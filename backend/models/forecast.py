from uuid import uuid4
from sqlalchemy import ForeignKey,Float,String,Text,JSON
from database import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column


class Forecast(Base):
    __tablename__ = "forecasts"
 
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    asset_id:Mapped[UUID] = mapped_column(ForeignKey("assets.id"))
    risk_30_days:Mapped[float] = mapped_column(Float)
    risk_60_days:Mapped[float] = mapped_column(Float)
    risk_90_days:Mapped[float] = mapped_column(Float)
    
    degradation_rate:Mapped[float] = mapped_column(Float)
    at_risk_component:Mapped[str] = mapped_column(String)
    recommended_action:Mapped[str] = mapped_column(String)
    reasoning:Mapped[str] = mapped_column(Text)
    inspection_history_snapshot:Mapped[dict] = mapped_column(JSON)
