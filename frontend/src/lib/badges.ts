import { Severity, TicketStatus } from '@/types/enums'

export const severityStyles: Record<Severity, string> = {
  [Severity.CRITICAL]: 'bg-red-50 text-critical border-red-100',
  [Severity.MAJOR]: 'bg-amber-50 text-warning border-amber-100',
  [Severity.MINOR]: 'bg-primary-light text-primary-dark border-primary/10',
}

export const priorityStyles: Record<string, string> = {
  P1: 'bg-red-50 text-critical border-red-100',
  P2: 'bg-amber-50 text-warning border-amber-100',
  P3: 'bg-primary-light text-primary-dark border-primary/10',
}

export const ticketStatusStyles: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'bg-red-50 text-critical border-red-100',
  [TicketStatus.IN_PROGRESS]: 'bg-amber-50 text-warning border-amber-100',
  [TicketStatus.CLOSED]: 'bg-primary-light text-primary-dark border-primary/10',
}

export const formatLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
