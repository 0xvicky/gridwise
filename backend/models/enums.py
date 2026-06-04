from enum import Enum


class AssetType(str, Enum):
    TRANSMISSION_TOWER = "transmission_tower"
    OHE_RAIL = "ohe_rail"
    DISTRIBUTION_POLE = "distribution_pole"


class ValidationStatus(str, Enum):
    PENDING = "pending"
    PASSED = "passed"
    FAILED = "failed"


class DefectType(str, Enum):
    CORROSION = "corrosion"
    VEGETATION_ENCROACHMENT = "vegetation_encroachment"
    MISSING_COMPONENT = "missing_component"
    SAG = "sag"
    CRACK = "crack"
    HOTSPOT = "hotspot"
    OTHER = "other"


class Severity(str, Enum):
    CRITICAL = "critical"
    MAJOR = "major"
    MINOR = "minor"


class TicketPriority(str, Enum):
    P1 = "P1"
    P2 = "P2"
    P3 = "P3"


class TicketStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"


class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
