import api from './api'
import { Asset, CreateAssetRequest, Inspection, PaginatedResponse } from '@/types'

export const assetsService = {
  getAll: async (): Promise<Asset[]> => {
    const response = await api.get('/assets')
    return response.data
  },

  getById: async (id: string): Promise<Asset> => {
    const response = await api.get(`/assets/${id}`)
    return response.data
  },

  getInspections: async (
    id: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResponse<Inspection>> => {
    const response = await api.get(`/assets/${id}/inspections`, {
      params: { page, page_size: pageSize },
    })
    return response.data
  },

  create: async (data: CreateAssetRequest): Promise<Asset> => {
    const response = await api.post('/assets/create', data)
    return response.data
  },
  forecastAsset:async(id:string)=>{
    const response=await api.post(`/assets/${id}/forecast`)
    return response.data
  }
}
