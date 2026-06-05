import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useTicket, useUpdateTicketStatus } from '@/hooks/useTickets'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components'
import { LoadingSpinner, Error, Alert } from '@/components/Loading'
import { TicketStatus } from '@/types/enums'

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: ticket, isLoading, error } = useTicket(id)
  const { mutate: updateStatus, isPending } = useUpdateTicketStatus()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleStatusUpdate = (newStatus: TicketStatus) => {
    if (!id) return
    updateStatus(
      { ticketId: id, status: newStatus },
      {
        onSuccess: () => {
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 3000)
        },
      }
    )
  }

  const getStatusColor = (status: TicketStatus) => {
    const colors = {
      [TicketStatus.OPEN]: 'bg-red-500 bg-opacity-20 text-red-300',
      [TicketStatus.IN_PROGRESS]: 'bg-accent-amber bg-opacity-20 text-accent-amber',
      [TicketStatus.CLOSED]: 'bg-accent-green bg-opacity-20 text-accent-green',
    }
    return colors[status]
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      P1: 'bg-red-500 bg-opacity-20 text-red-300',
      P2: 'bg-accent-amber bg-opacity-20 text-accent-amber',
      P3: 'bg-accent-blue bg-opacity-20 text-accent-blue',
    }
    return colors[priority] || 'bg-dark-700 bg-opacity-50 text-white'
  }

  const getNextStatuses = (currentStatus: TicketStatus): TicketStatus[] => {
    const transitions: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.CLOSED],
      [TicketStatus.CLOSED]: [],
    }
    return transitions[currentStatus]
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <Error message="Failed to load ticket" />

  if (!ticket) return <Error message="Ticket not found" />

  const nextStatuses = getNextStatuses(ticket.status)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl space-y-6"
    >
      {showSuccess && (
        <Alert
          type="success"
          message="Ticket status updated successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-accent-cyan hover:text-accent-blue mb-2 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white">{ticket.title}</h1>
        <p className="mt-2 text-white">ID: {ticket.id}</p>
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-white">Status</p>
            <div className="mt-3">
              <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace(/_/g, ' ').charAt(0).toUpperCase() + ticket.status.slice(1)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-white">Priority</p>
            <div className="mt-3">
              <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-white">Due Date</p>
            <p className="mt-3 text-lg font-medium text-white">
              {format(new Date(ticket.due_date), 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-white">Assigned Team</p>
            <p className="mt-2 text-lg font-medium text-white">{ticket.assigned_team || 'Unassigned'}</p>
          </div>

          <div>
            <p className="text-sm text-white">Instructions</p>
            <div className="mt-3 rounded-lg bg-dark-800 p-4">
              <p className="text-white whitespace-pre-wrap">
                {(ticket as any).instructions || 'No instructions provided'}
              </p>
            </div>
          </div>

          {(ticket as any).before_photo_path && (
            <div>
              <p className="text-sm text-white">Before Photo</p>
              <p className="mt-2 text-sm text-white">{(ticket as any).before_photo_path}</p>
            </div>
          )}

          {(ticket as any).after_photo_path && (
            <div>
              <p className="text-sm text-white">After Photo</p>
              <p className="mt-2 text-sm text-white">{(ticket as any).after_photo_path}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Actions */}
      {nextStatuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-white">
              Available transitions from <strong>{ticket.status.replace(/_/g, ' ')}</strong>:
            </p>
            <div className="flex gap-3">
              {nextStatuses.map((status) => (
                <Button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  isLoading={isPending}
                >
                  Change to {status.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {nextStatuses.length === 0 && ticket.status === TicketStatus.CLOSED && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-white">
              This ticket is closed and cannot be updated. No further transitions are available.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

export default TicketDetails
