import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TicketStatus } from '@/types/enums'
import { useTickets } from '@/hooks/useTickets'
import {
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  PageHeader,
} from '@/components'
import { LoadingSpinner, Error, EmptyState } from '@/components/Loading'
import { format } from 'date-fns'
import { priorityStyles, ticketStatusStyles, formatLabel } from '@/lib/badges'

const Tickets: React.FC = () => {
  const { data: tickets, isLoading, error, refetch } = useTickets()
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all')

  const filteredTickets =
    tickets?.filter((ticket) => filter === 'all' || ticket.status === filter) || []

  const statusCounts = {
    all: tickets?.length || 0,
    [TicketStatus.OPEN]:
      tickets?.filter((t) => t.status === TicketStatus.OPEN).length || 0,
    [TicketStatus.IN_PROGRESS]:
      tickets?.filter((t) => t.status === TicketStatus.IN_PROGRESS).length || 0,
    [TicketStatus.CLOSED]:
      tickets?.filter((t) => t.status === TicketStatus.CLOSED).length || 0,
  }

  const filters: Array<{ key: TicketStatus | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: TicketStatus.OPEN, label: 'Open' },
    { key: TicketStatus.IN_PROGRESS, label: 'In Progress' },
    { key: TicketStatus.CLOSED, label: 'Closed' },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tickets"
        description="Manage maintenance and repair tickets across your infrastructure"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              filter === item.key
                ? 'border-accent/25 bg-accent-light text-accent-dark'
                : 'border-border bg-surface text-text-secondary hover:bg-primary-light hover:text-primary'
            }`}
          >
            {item.label}
            <span className="ml-2 rounded-md bg-surface/80 px-1.5 py-0.5 text-xs">
              {statusCounts[item.key as keyof typeof statusCounts]}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-6">
              <Error message="Failed to load tickets" onRetry={() => refetch()} />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No tickets found"
                description={
                  filter !== 'all'
                    ? 'No tickets match the selected filter'
                    : 'Tickets will appear here when generated from inspections'
                }
              />
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow index={0}>
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
                {filteredTickets.map((ticket, idx) => (
                  <TableRow key={ticket.id} index={idx + 1}>
                    <TableCell className="font-mono text-xs text-text-secondary">
                      {ticket.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${priorityStyles[ticket.priority]}`}
                      >
                        {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${ticketStatusStyles[ticket.status]}`}
                      >
                        {formatLabel(ticket.status)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell className="text-text-secondary">
                      {ticket.assigned_team || '—'}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {format(new Date(ticket.due_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/ticket/${ticket.id}`}>
                        <Button variant="ghost" size="sm">
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
    </div>
  )
}

export default Tickets
