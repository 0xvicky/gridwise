import api from './api'
import {
  Ticket,
  TicketDetails,
  InspectionTicketsResponse,
  TicketStatusUpdateRequest,
  TicketStatusUpdateResponse,
} from '@/types'

export const ticketsService = {
  getAll: async (): Promise<Ticket[]> => {
    const response = await api.get('/tickets')
    return response.data
  },

  getById: async (ticketId: string): Promise<TicketDetails> => {
    const response = await api.get(`/ticket/${ticketId}`)
    return response.data
  },

  getForInspection: async (inspectionId: string): Promise<InspectionTicketsResponse> => {
    const response = await api.get(`/inspection/${inspectionId}/tickets`)
    return response.data
  },

  updateStatus: async (
    ticketId: string,
    statusUpdate: TicketStatusUpdateRequest
  ): Promise<TicketStatusUpdateResponse> => {
    const response = await api.patch(`/ticket/${ticketId}`, statusUpdate)
    return response.data
  },
}
