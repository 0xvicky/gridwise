import api from './api'
import { Forecast, ForecastGenerationResponse, PaginatedResponse } from '@/types'

export const generateForecast = async (assetId: string): Promise<Forecast> => {
  try {
    const generationResponse = await api.post<ForecastGenerationResponse>(
      `/assets/${assetId}/forecast`
    )

    const forecastResponse = await api.get<Forecast>(
      `/assets/${assetId}/forecast/${generationResponse.data.forecast_id}`
    )

    return {
      ...forecastResponse.data,
      cached: generationResponse.data.cached,
    }
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      'Forecast generation failed. Please try again.'
    throw new Error(message)
  }
}

export const getAssetForecasts = async (
  assetId: string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Forecast>> => {
  const response = await api.get<PaginatedResponse<Forecast>>(
    `/assets/${assetId}/forecasts`,
    { params: { page, page_size: pageSize } }
  )
  return response.data
}

export const getForecast = async (
  assetId: string,
  forecastId: string
): Promise<Forecast> => {
  const response = await api.get<Forecast>(
    `/assets/${assetId}/forecast/${forecastId}`
  )
  return response.data
}

export const forecastService = {
  generateForecast,
  getAssetForecasts,
  getForecast,
}
