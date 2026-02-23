from pydantic import BaseModel, Field, ConfigDict
from typing import Literal
from datetime import datetime, timezone
import uuid

class NotificationCreate(BaseModel):
    user_id: str
    type: Literal["investment_created", "investment_completed", "recurring_created", "price_update", "liquidity_window", "governance_alert"]
    title: str
    message: str
    related_id: str = None

class Notification(NotificationCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))