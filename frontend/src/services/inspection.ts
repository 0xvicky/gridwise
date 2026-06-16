import api from './api'
import {
  Inspection,
  InspectionUploadResponse,
  ValidationResponse,
  DefectResponse,
} from '@/types'


export const inspectionService = {
  getAll:async():Promise<Inspection[]>=>{
    const response=await api.get('/inspection/')
    return response.data
  },

  getSummary: async (inspectionId: string): Promise<Inspection> => {
    const response = await api.get(`/inspection/${inspectionId}`)
    return response.data
  },

  getValidation: async (inspectionId: string): Promise<ValidationResponse> => {
    const response = await api.get(`/inspection/${inspectionId}/validation`)
    return response.data
  },

  getDefects: async (inspectionId: string): Promise<DefectResponse> => {
    const response = await api.get(`/inspection/${inspectionId}/defects`)
    return response.data
  },


  upload: async (
    assetId: string,
    assetName: string,
    pilotId: string,
    files: File[],
    aiSwitch: boolean
  ): Promise<InspectionUploadResponse> => {
    const formData = new FormData()
    formData.append('asset_id', assetId)
    formData.append('asset_name', assetName)
    formData.append('pilot_id', pilotId)
    formData.append('ai_switch', String(aiSwitch))
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await api.post('/inspection/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  generateReport: async (inspectionId: string): Promise<{ status: boolean; message: string; path: string }> => {
    const response = await api.post(`/inspection/${inspectionId}/report`)
    return response.data
  },

  downloadReport: async (inspectionId: string): Promise<Blob> => {
    const response = await api.get(`/inspection/${inspectionId}/report`, {
      responseType: 'blob',
    })
    return response.data
  },

  checkReport:async(inspectionId:string):Promise<{report_status:boolean}>=>{
    const response=await api.get(`/inspection/${inspectionId}/is_report`)
    return response.data
  },

  generateTickets: async (inspectionId: string): Promise<{ ticket_ids: string[] }> => {
    const response = await api.post(`/inspection/${inspectionId}/ticket`)
    return response.data
  },
}
