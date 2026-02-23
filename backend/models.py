from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List, Literal
from datetime import datetime, timezone
import uuid

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Literal["investor", "business", "both", "admin"]
    country: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Company Models
class CompanyCreate(BaseModel):
    name: str
    description: str
    industry: str
    geography: str
    website: Optional[str] = None

class Company(CompanyCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Investment Thesis Models
class ThesisCreate(BaseModel):
    company_id: str
    title: str
    overview: str
    thesis_content: str
    risks: str
    safe_structure: dict
    status: Literal["draft", "active", "closed"] = "draft"
    industry: str
    geography: str
    stage: str

class Thesis(ThesisCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Investment Models
class InvestmentCreate(BaseModel):
    thesis_id: str
    amount: float
    investment_type: Literal["one_time", "recurring"] = "one_time"
    acknowledged_risks: bool

class Investment(InvestmentCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    investor_id: str
    status: Literal["pending", "completed", "failed"] = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Recurring Investment Models
class RecurringInvestmentCreate(BaseModel):
    thesis_id: str
    amount: float
    frequency: Literal["weekly", "monthly", "quarterly"]

class RecurringInvestment(RecurringInvestmentCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    investor_id: str
    status: Literal["active", "paused", "cancelled"] = "active"
    next_run: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Reference Price Models
class ReferencePriceCreate(BaseModel):
    thesis_id: str
    old_price: Optional[float] = None
    new_price: float
    reason: str

class ReferencePrice(ReferencePriceCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Liquidity Window Models
class LiquidityWindowCreate(BaseModel):
    thesis_id: str
    start_date: datetime
    end_date: datetime
    governance_confirmed: bool

class LiquidityWindow(LiquidityWindowCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_by: str
    status: Literal["upcoming", "active", "closed"] = "upcoming"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Secondary Sale Models
class SecondarySaleCreate(BaseModel):
    thesis_id: str
    buyer_id: Optional[str] = None
    amount: float
    sale_type: Literal["to_company", "to_investor"] = "to_company"

class SecondarySale(SecondarySaleCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    seller_id: str
    status: Literal["pending", "approved", "rejected", "completed"] = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Bank Account Models
class BankAccountCreate(BaseModel):
    country: str
    bank_name: str
    account_holder: str
    account_number: str
    routing_code: str

class BankAccount(BankAccountCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    status: Literal["pending", "verified", "failed"] = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Discussion Models
class DiscussionCreate(BaseModel):
    thesis_id: str
    content: str

class Discussion(DiscussionCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Governance Alert Models
class GovernanceAlert(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    severity: Literal["info", "warning", "critical"]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))