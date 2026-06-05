import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsService } from '@/services/tickets'
import { TicketStatus } from '@/types'

export const useTickets = () => {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: ticketsService.getAll,
  })
}

export const useTicket = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsService.getById(ticketId!),
    enabled: !!ticketId,
  })
}

export const useInspectionTickets = (inspectionId: string | undefined) => {
  return useQuery({
    queryKey: ['inspection-tickets', inspectionId],
    queryFn: () => ticketsService.getForInspection(inspectionId!),
    enabled: !!inspectionId,
  })
}

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string
      status: TicketStatus
    }) => ticketsService.updateStatus(ticketId, { status }),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
