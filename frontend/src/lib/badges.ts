import { Severity, TicketStatus } from '@/types/enums'

export const severityStyles: Record<Severity, string> = {
  [Severity.CRITICAL]: 'bg-red-50 text-critical border-red-100',
  [Severity.MAJOR]: 'bg-accent-light text-accent-dark border-orange-100',
  [Severity.MINOR]: 'bg-green-50 text-success border-green-100',
}

export const priorityStyles: Record<string, string> = {
  P1: 'bg-red-50 text-critical border-red-100',
  P2: 'bg-accent-light text-accent-dark border-orange-100',
  P3: 'bg-green-50 text-success border-green-100',
}

export const ticketStatusStyles: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'bg-red-50 text-critical border-red-100',
  [TicketStatus.IN_PROGRESS]: 'bg-accent-light text-accent-dark border-orange-100',
  [TicketStatus.CLOSED]: 'bg-green-50 text-success border-green-100',
}

export const formatLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
