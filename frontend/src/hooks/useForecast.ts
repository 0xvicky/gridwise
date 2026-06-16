import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateForecast, getAssetForecasts, getForecast } from '@/services/forecast'

export const useAssetForecasts = (
  assetId: string | undefined,
  page = 1,
  pageSize = 5
) => {
  return useQuery({
    queryKey: ['assets', assetId, 'forecasts', page, pageSize],
    queryFn: () => getAssetForecasts(assetId!, page, pageSize),
    enabled: !!assetId,
    placeholderData: (previousData) => previousData,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

export const useForecast = (
  assetId: string | undefined,
  forecastId: string | undefined
) => {
  return useQuery({
    queryKey: ['assets', assetId, 'forecast', forecastId],
    queryFn: () => getForecast(assetId!, forecastId!),
    enabled: !!assetId && !!forecastId,
  })
}

export const useGenerateForecast = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateForecast,
    onSuccess: (forecast, assetId) => {
      queryClient.setQueryData(['assets', assetId, 'forecast', forecast.id], forecast)
      queryClient.invalidateQueries({ queryKey: ['assets', assetId, 'forecasts'] })
    },
  })
}
