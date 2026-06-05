export enum ValidationStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
}

export enum AnalysisStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AssetType {
  TRANSMISSION_TOWER = 'transmission_tower',
  OHE_RAIL = 'ohe_rail',
  DISTRIBUTION_POLE = 'distribution_pole',
}

export enum DefectType {
  CORROSION = 'corrosion',
  VEGETATION_ENCROACHMENT = 'vegetation_encroachment',
  MISSING_COMPONENT = 'missing_component',
  SAG = 'sag',
  CRACK = 'crack',
  HOTSPOT = 'hotspot',
  OTHER = 'other',
}

export enum Severity {
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
}

export enum TicketPriority {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}
