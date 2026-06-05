import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inspectionService } from '@/services/inspection'

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
      pilotId,
      files,
    }: {
      assetId: string
      pilotId: string
      files: File[]
    }) => inspectionService.upload(assetId, pilotId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] })
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
    },
  })
}

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: (inspectionId: string) =>
      inspectionService.downloadReport(inspectionId),
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
    },
  })
}
