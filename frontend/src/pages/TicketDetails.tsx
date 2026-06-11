import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import { useTicket, useUpdateTicketStatus } from '@/hooks/useTickets'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components'
import { LoadingSpinner, Error, Alert } from '@/components/Loading'
import { TicketStatus } from '@/types/enums'
import { priorityStyles, ticketStatusStyles, formatLabel } from '@/lib/badges'

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
    <div className="mx-auto max-w-3xl space-y-8">
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
          className="mb-4 flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <h1 className="text-page-title text-text-primary">{ticket.title}</h1>
        <p className="mt-2 font-mono text-sm text-text-secondary">{ticket.id}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card hover>
          <CardContent className="py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Status
            </p>
            <div className="mt-3">
              <span
                className={`inline-flex rounded-md border px-2.5 py-1 text-sm font-medium ${ticketStatusStyles[ticket.status]}`}
              >
                {formatLabel(ticket.status)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Priority
            </p>
            <div className="mt-3">
              <span
                className={`inline-flex rounded-md border px-2.5 py-1 text-sm font-medium ${priorityStyles[ticket.priority]}`}
              >
                {ticket.priority}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Due Date
            </p>
            <p className="mt-3 text-lg font-medium text-text-primary">
              {format(new Date(ticket.due_date), 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Assigned Team
            </p>
            <p className="mt-2 text-base font-medium text-text-primary">
              {ticket.assigned_team || 'Unassigned'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Instructions
            </p>
            <div className="mt-3 rounded-lg border border-border bg-surface p-4">
              <p className="whitespace-pre-wrap text-sm text-text-primary">
                {(ticket as { instructions?: string }).instructions || 'No instructions provided'}
              </p>
            </div>
          </div>

          {(ticket as { before_photo_path?: string }).before_photo_path && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                Before Photo
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                {(ticket as { before_photo_path?: string }).before_photo_path}
              </p>
            </div>
          )}

          {(ticket as { after_photo_path?: string }).after_photo_path && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                After Photo
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                {(ticket as { after_photo_path?: string }).after_photo_path}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {nextStatuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-text-secondary">
              Available transitions from{' '}
              <span className="font-medium text-text-primary">
                {formatLabel(ticket.status)}
              </span>
            </p>
            <div className="flex gap-3">
              {nextStatuses.map((status) => (
                <Button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  isLoading={isPending}
                >
                  Change to {formatLabel(status)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {nextStatuses.length === 0 && ticket.status === TicketStatus.CLOSED && (
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-text-secondary">
              This ticket is closed. No further status transitions are available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TicketDetails
