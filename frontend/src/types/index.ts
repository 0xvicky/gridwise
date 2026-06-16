import {
  AssetType,
  ValidationStatus,
  AnalysisStatus,
  DefectType,
  Severity,
  TicketPriority,
  TicketStatus,
} from './enums'

export interface Asset {
  id: string
  name: string
  asset_type: AssetType
  latitude: number
  longitude: number
  zone: string
  installed_year: number
}

export interface CreateAssetRequest {
  name: string
  asset_type: AssetType
  latitude: number
  longitude: number
  zone: string
  installed_year: number
}

export interface Inspection {
  inspection_id: string
  asset_id: string
  asset_name:string
  pilot_id: string
  capture_date: string
  validation_status: ValidationStatus
  analysis_status: AnalysisStatus
  health_score: number | null
}

export interface InspectionUploadResponse {
  inspection_id: string
  validation_status: ValidationStatus
}

export interface ValidationFileResult {
  file_name: string
  status: ValidationStatus
  reason?: string
}

export interface ValidationResponse {
  inspection_id: string
  files: ValidationFileResult[]
}

export interface Defect {
  defect_type: DefectType
  severity: Severity
  location_description: string
  confidence_score: number
  ai_reasoning: string
  ai_recommendation:string | null
}

export interface DefectResponse {
  inspection_id: string
  defects: Defect[]
}

export interface Ticket {
  id: string
  priority: TicketPriority
  status: TicketStatus
  title: string
  assigned_team: string | null
  due_date: string
}

export interface TicketDetails extends Ticket {
  instructions: string
  defect_id: string
  asset_id: string
  inspection_id: string
  before_photo_path?: string
  after_photo_path?: string
}

export interface InspectionTicketsResponse {
  inspection_id: string
  tickets: Ticket[]
}

export interface TicketStatusUpdateRequest {
  status: TicketStatus
}

export interface TicketStatusUpdateResponse {
  ticket_id: string
  old_status: TicketStatus
  new_status: TicketStatus
}

export interface ForecastGenerationResponse {
  forecast_id: string
}

export interface Forecast {
  id: string
  risk_30_days: number
  risk_60_days: number
  risk_90_days: number
  degradation_rate: number
  recommended_action: string
  at_risk_component: string
  reasoning: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
