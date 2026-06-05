import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TicketStatus } from '@/types/enums'
import { useTickets } from '@/hooks/useTickets'
import { Button, Card, CardHeader, CardTitle, CardContent, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components'
import { LoadingSpinner, Error, EmptyState } from '@/components/Loading'
import { format } from 'date-fns'

const Tickets: React.FC = () => {
  const { data: tickets, isLoading, error, refetch } = useTickets()
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all')

  const filteredTickets = tickets?.filter(
    (ticket) => filter === 'all' || ticket.status === filter
  ) || []

  const statusCounts = {
    all: tickets?.length || 0,
    [TicketStatus.OPEN]: tickets?.filter((t) => t.status === TicketStatus.OPEN).length || 0,
    [TicketStatus.IN_PROGRESS]: tickets?.filter((t) => t.status === TicketStatus.IN_PROGRESS).length || 0,
    [TicketStatus.CLOSED]: tickets?.filter((t) => t.status === TicketStatus.CLOSED).length || 0,
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-accent-cyan bg-clip-text text-transparent">Tickets</h1>
        <p className="mt-2 text-white">Manage maintenance and repair tickets</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.CLOSED].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as TicketStatus | 'all')}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-lg shadow-accent-cyan/30'
                : 'bg-dark-700 text-white hover:text-accent-cyan hover:border-accent-cyan border border-dark-600'
            }`}
          >
            {status === 'all' ? 'All' : status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 inline-block rounded-full bg-accent-cyan/20 px-2 py-0.5 text-xs">
              {statusCounts[status as keyof typeof statusCounts]}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <Error message="Failed to load tickets" onRetry={() => refetch()} />
          ) : filteredTickets.length === 0 ? (
            <EmptyState
              title="No tickets found"
              description={filter !== 'all' ? 'No tickets match the selected filter' : 'Create your first ticket to get started'}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Priority</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Team</TableHeader>
                  <TableHeader>Due Date</TableHeader>
                  <TableHeader className="text-right">Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-sm text-white">{ticket.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace(/_/g, ' ').charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>{ticket.assigned_team || '-'}</TableCell>
                    <TableCell>{format(new Date(ticket.due_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/ticket/${ticket.id}`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Tickets
