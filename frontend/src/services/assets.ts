import api from './api'
import { Asset, CreateAssetRequest } from '@/types'

export const assetsService = {
  getAll: async (): Promise<Asset[]> => {
    const response = await api.get('/assets')
    return response.data
  },

  getById: async (id: string): Promise<Asset> => {
    const response = await api.get(`/assets/${id}`)
    return response.data
  },

  create: async (data: CreateAssetRequest): Promise<Asset> => {
    const response = await api.post('/assets/create', data)
    return response.data
  },
}
