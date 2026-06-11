import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assetsService } from '@/services/assets'
import { CreateAssetRequest } from '@/types'

export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: assetsService.getAll,
  })
}

export const useAsset = (id: string | undefined) => {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: () => assetsService.getById(id!),
    enabled: !!id,
  })
}

export const useAssetInspections = (id: string | undefined) => {
  return useQuery({
    queryKey: ['assets', id, 'inspections'],
    queryFn: () => assetsService.getInspections(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

export const useCreateAsset = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAssetRequest) => assetsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}
