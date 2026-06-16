import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inspectionService } from '@/services/inspection'

export const useInspections = ()=>{
  return useQuery({
    queryKey:['inspections'],
    queryFn:inspectionService.getAll,
  })
}
export const useInspectionSummary = (inspectionId: string | undefined) => {
  return useQuery({
    queryKey: ['inspection', inspectionId],
    queryFn: () => inspectionService.getSummary(inspectionId!),
    enabled: !!inspectionId,
  })
}

export const useInspectionValidation = (inspectionId: string | undefined) => {
  return useQuery({
    queryKey: ['inspection-validation', inspectionId],
    queryFn: () => inspectionService.getValidation(inspectionId!),
    enabled: !!inspectionId,
  })
}

export const useInspectionDefects = (inspectionId: string | undefined) => {
  return useQuery({
    queryKey: ['inspection-defects', inspectionId],
    queryFn: () => inspectionService.getDefects(inspectionId!),
    enabled: !!inspectionId,
  })
}

export const useUploadInspection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      assetId,
      assetName,
      pilotId,
      files,
      aiSwitch,
    }: {
      assetId: string
      assetName: string
      pilotId: string
      files: File[]
      aiSwitch: boolean
    }) => inspectionService.upload(assetId, assetName, pilotId, files, aiSwitch),
    onSuccess: (_, { assetId }) => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] })
      queryClient.invalidateQueries({ queryKey: ['assets', assetId, 'inspections'] })
    },
  })
}

export const useGenerateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inspectionId: string) =>
      inspectionService.generateReport(inspectionId),
    onSuccess: (_, inspectionId) => {
      queryClient.invalidateQueries({ queryKey: ['inspection', inspectionId] })
      queryClient.invalidateQueries({ queryKey: ['check-report', inspectionId] })
    },
  })
}

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: (inspectionId: string) =>
      inspectionService.downloadReport(inspectionId),
  })
}

export const useCheckReport = (inspectionId:string|undefined)=>{
  return useQuery({
    queryKey:['check-report',inspectionId],
    queryFn:()=>inspectionService.checkReport(inspectionId!),
    enabled:!!inspectionId,
  })
}

export const useGenerateTickets = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inspectionId: string) =>
      inspectionService.generateTickets(inspectionId),
    onSuccess: (_, inspectionId) => {
      queryClient.invalidateQueries({
        queryKey: ['inspection-tickets', inspectionId],
      })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
