from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from models import (
    User, UserCreate, UserLogin, Token,
    Company, CompanyCreate,
    Thesis, ThesisCreate,
    Investment, InvestmentCreate,
    RecurringInvestment, RecurringInvestmentCreate,
    ReferencePrice, ReferencePriceCreate,
    LiquidityWindow, LiquidityWindowCreate,
    SecondarySale, SecondarySaleCreate,
    BankAccount, BankAccountCreate,
    Discussion, DiscussionCreate,
    GovernanceAlert
)
from notification_models import Notification, NotificationCreate
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from email_service import EmailService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Sri by Mahakali Tribunal API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper Functions
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc.pop('_id')
    if doc and 'password_hash' in doc:
        doc.pop('password_hash')
    return doc

async def get_user_by_email(email: str):
    user = await db.users.find_one({"email": email})
    return serialize_doc(user)

# Auth Routes
@api_router.post("/auth/signup", response_model=Token)
async def signup(user_data: UserCreate):
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(**user_data.model_dump(exclude={"password"}))
    user_dict = user.model_dump()
    user_dict['password_hash'] = get_password_hash(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_doc = serialize_doc(user_doc)
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": current_user["id"]}, {"_id": 0, "password_hash": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)

# Company Routes
@api_router.post("/companies", response_model=Company)
async def create_company(
    company_data: CompanyCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    company = Company(**company_data.model_dump(), created_by=current_user["id"])
    company_dict = company.model_dump()
    company_dict['created_at'] = company_dict['created_at'].isoformat()
    
    await db.companies.insert_one(company_dict)
    return company

@api_router.get("/companies", response_model=List[Company])
async def list_companies(current_user: dict = Depends(get_current_user)):
    companies = await db.companies.find({}, {"_id": 0}).to_list(1000)
    for c in companies:
        if isinstance(c['created_at'], str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return companies

@api_router.get("/companies/my", response_model=List[Company])
async def my_companies(current_user: dict = Depends(get_current_user)):
    companies = await db.companies.find(
        {"created_by": current_user["id"]}, {"_id": 0}
    ).to_list(1000)
    for c in companies:
        if isinstance(c['created_at'], str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return companies

# Thesis Routes
@api_router.post("/theses", response_model=Thesis)
async def create_thesis(
    thesis_data: ThesisCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    thesis = Thesis(**thesis_data.model_dump())
    thesis_dict = thesis.model_dump()
    thesis_dict['created_at'] = thesis_dict['created_at'].isoformat()
    thesis_dict['updated_at'] = thesis_dict['updated_at'].isoformat()
    
    await db.theses.insert_one(thesis_dict)
    return thesis

@api_router.get("/theses", response_model=List[Thesis])
async def list_theses(
    status: Optional[str] = None,
    industry: Optional[str] = None,
    geography: Optional[str] = None,
    stage: Optional[str] = None
):
    query = {}
    if status:
        query["status"] = status
    if industry:
        query["industry"] = industry
    if geography:
        query["geography"] = geography
    if stage:
        query["stage"] = stage
    
    theses = await db.theses.find(query, {"_id": 0}).to_list(1000)
    for t in theses:
        if isinstance(t['created_at'], str):
            t['created_at'] = datetime.fromisoformat(t['created_at'])
        if isinstance(t['updated_at'], str):
            t['updated_at'] = datetime.fromisoformat(t['updated_at'])
    return theses

@api_router.get("/theses/{thesis_id}", response_model=Thesis)
async def get_thesis(thesis_id: str):
    thesis = await db.theses.find_one({"id": thesis_id}, {"_id": 0})
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    
    if isinstance(thesis['created_at'], str):
        thesis['created_at'] = datetime.fromisoformat(thesis['created_at'])
    if isinstance(thesis['updated_at'], str):
        thesis['updated_at'] = datetime.fromisoformat(thesis['updated_at'])
    
    return Thesis(**thesis)

@api_router.put("/theses/{thesis_id}", response_model=Thesis)
async def update_thesis(
    thesis_id: str,
    thesis_data: ThesisCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    existing = await db.theses.find_one({"id": thesis_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Thesis not found")
    
    update_dict = thesis_data.model_dump()
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.theses.update_one({"id": thesis_id}, {"$set": update_dict})
    
    updated = await db.theses.find_one({"id": thesis_id}, {"_id": 0})
    if isinstance(updated['created_at'], str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated['updated_at'], str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    
    return Thesis(**updated)

# Investment Routes
@api_router.post("/investments", response_model=Investment)
async def create_investment(
    investment_data: InvestmentCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["investor", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if not investment_data.acknowledged_risks:
        raise HTTPException(status_code=400, detail="Must acknowledge risks")
    
    investment = Investment(**investment_data.model_dump(), investor_id=current_user["id"])
    investment_dict = investment.model_dump()
    investment_dict['created_at'] = investment_dict['created_at'].isoformat()
    
    await db.investments.insert_one(investment_dict)
    return investment

@api_router.get("/investments/my", response_model=List[Investment])
async def my_investments(current_user: dict = Depends(get_current_user)):
    investments = await db.investments.find(
        {"investor_id": current_user["id"]}, {"_id": 0}
    ).to_list(1000)
    for inv in investments:
        if isinstance(inv['created_at'], str):
            inv['created_at'] = datetime.fromisoformat(inv['created_at'])
    return investments

@api_router.get("/investments/thesis/{thesis_id}", response_model=List[Investment])
async def thesis_investments(
    thesis_id: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    investments = await db.investments.find(
        {"thesis_id": thesis_id}, {"_id": 0}
    ).to_list(1000)
    for inv in investments:
        if isinstance(inv['created_at'], str):
            inv['created_at'] = datetime.fromisoformat(inv['created_at'])
    return investments

# Recurring Investment Routes
@api_router.post("/recurring-investments", response_model=RecurringInvestment)
async def create_recurring_investment(
    recurring_data: RecurringInvestmentCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["investor", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    next_run_map = {
        "weekly": timedelta(days=7),
        "monthly": timedelta(days=30),
        "quarterly": timedelta(days=90)
    }
    
    recurring = RecurringInvestment(
        **recurring_data.model_dump(),
        investor_id=current_user["id"],
        next_run=datetime.now(timezone.utc) + next_run_map[recurring_data.frequency]
    )
    recurring_dict = recurring.model_dump()
    recurring_dict['created_at'] = recurring_dict['created_at'].isoformat()
    recurring_dict['next_run'] = recurring_dict['next_run'].isoformat()
    
    await db.recurring_investments.insert_one(recurring_dict)
    return recurring

@api_router.get("/recurring-investments/my", response_model=List[RecurringInvestment])
async def my_recurring_investments(current_user: dict = Depends(get_current_user)):
    recurring = await db.recurring_investments.find(
        {"investor_id": current_user["id"]}, {"_id": 0}
    ).to_list(1000)
    for r in recurring:
        if isinstance(r['created_at'], str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
        if isinstance(r['next_run'], str):
            r['next_run'] = datetime.fromisoformat(r['next_run'])
    return recurring

@api_router.patch("/recurring-investments/{recurring_id}/status")
async def update_recurring_status(
    recurring_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    result = await db.recurring_investments.update_one(
        {"id": recurring_id, "investor_id": current_user["id"]},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recurring investment not found")
    return {"success": True}

# Reference Price Routes
@api_router.post("/reference-prices", response_model=ReferencePrice)
async def create_reference_price(
    price_data: ReferencePriceCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    price = ReferencePrice(**price_data.model_dump())
    price_dict = price.model_dump()
    price_dict['created_at'] = price_dict['created_at'].isoformat()
    
    await db.reference_prices.insert_one(price_dict)
    return price

@api_router.get("/reference-prices", response_model=List[ReferencePrice])
async def list_reference_prices(thesis_id: Optional[str] = None):
    query = {"thesis_id": thesis_id} if thesis_id else {}
    prices = await db.reference_prices.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for p in prices:
        if isinstance(p['created_at'], str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
    return prices

# Liquidity Window Routes
@api_router.post("/liquidity-windows", response_model=LiquidityWindow)
async def create_liquidity_window(
    window_data: LiquidityWindowCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if not window_data.governance_confirmed:
        raise HTTPException(status_code=400, detail="Must confirm governance")
    
    window = LiquidityWindow(**window_data.model_dump(), created_by=current_user["id"])
    window_dict = window.model_dump()
    window_dict['created_at'] = window_dict['created_at'].isoformat()
    window_dict['start_date'] = window_dict['start_date'].isoformat()
    window_dict['end_date'] = window_dict['end_date'].isoformat()
    
    await db.liquidity_windows.insert_one(window_dict)
    return window

@api_router.get("/liquidity-windows", response_model=List[LiquidityWindow])
async def list_liquidity_windows(thesis_id: Optional[str] = None):
    query = {"thesis_id": thesis_id} if thesis_id else {}
    windows = await db.liquidity_windows.find(query, {"_id": 0}).to_list(1000)
    for w in windows:
        if isinstance(w['created_at'], str):
            w['created_at'] = datetime.fromisoformat(w['created_at'])
        if isinstance(w['start_date'], str):
            w['start_date'] = datetime.fromisoformat(w['start_date'])
        if isinstance(w['end_date'], str):
            w['end_date'] = datetime.fromisoformat(w['end_date'])
    return windows

# Secondary Sale Routes
@api_router.post("/secondary-sales", response_model=SecondarySale)
async def create_secondary_sale(
    sale_data: SecondarySaleCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["investor", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    sale = SecondarySale(**sale_data.model_dump(), seller_id=current_user["id"])
    sale_dict = sale.model_dump()
    sale_dict['created_at'] = sale_dict['created_at'].isoformat()
    
    await db.secondary_sales.insert_one(sale_dict)
    return sale

@api_router.get("/secondary-sales/my", response_model=List[SecondarySale])
async def my_secondary_sales(current_user: dict = Depends(get_current_user)):
    sales = await db.secondary_sales.find(
        {"seller_id": current_user["id"]}, {"_id": 0}
    ).to_list(1000)
    for s in sales:
        if isinstance(s['created_at'], str):
            s['created_at'] = datetime.fromisoformat(s['created_at'])
    return sales

@api_router.patch("/secondary-sales/{sale_id}/approve")
async def approve_secondary_sale(
    sale_id: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.secondary_sales.update_one(
        {"id": sale_id},
        {"$set": {"status": "approved"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Sale not found")
    return {"success": True}

# Bank Account Routes
@api_router.post("/bank-accounts", response_model=BankAccount)
async def create_bank_account(
    bank_data: BankAccountCreate,
    current_user: dict = Depends(get_current_user)
):
    bank = BankAccount(**bank_data.model_dump(), user_id=current_user["id"])
    bank_dict = bank.model_dump()
    bank_dict['created_at'] = bank_dict['created_at'].isoformat()
    
    await db.bank_accounts.insert_one(bank_dict)
    return bank

@api_router.get("/bank-accounts/my", response_model=List[BankAccount])
async def my_bank_accounts(current_user: dict = Depends(get_current_user)):
    accounts = await db.bank_accounts.find(
        {"user_id": current_user["id"]}, {"_id": 0}
    ).to_list(1000)
    for a in accounts:
        if isinstance(a['created_at'], str):
            a['created_at'] = datetime.fromisoformat(a['created_at'])
    return accounts

# Discussion Routes
@api_router.post("/discussions", response_model=Discussion)
async def create_discussion(
    discussion_data: DiscussionCreate,
    current_user: dict = Depends(get_current_user)
):
    discussion = Discussion(**discussion_data.model_dump(), user_id=current_user["id"])
    discussion_dict = discussion.model_dump()
    discussion_dict['created_at'] = discussion_dict['created_at'].isoformat()
    
    await db.discussions.insert_one(discussion_dict)
    return discussion

@api_router.get("/discussions/{thesis_id}", response_model=List[Discussion])
async def list_discussions(thesis_id: str):
    discussions = await db.discussions.find(
        {"thesis_id": thesis_id}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    for d in discussions:
        if isinstance(d['created_at'], str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return discussions

# Governance Routes
@api_router.get("/governance/alerts", response_model=List[GovernanceAlert])
async def list_governance_alerts():
    alerts = await db.governance_alerts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for a in alerts:
        if isinstance(a['created_at'], str):
            a['created_at'] = datetime.fromisoformat(a['created_at'])
    return alerts

# Dashboard Routes
@api_router.get("/dashboard/investor")
async def investor_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["investor", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    investments = await db.investments.find({"investor_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    recurring = await db.recurring_investments.find({"investor_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    
    total_invested = sum(inv['amount'] for inv in investments if inv.get('status') == 'completed')
    active_investments = len([inv for inv in investments if inv.get('status') == 'completed'])
    
    return {
        "total_invested": total_invested,
        "active_investments": active_investments,
        "recurring_count": len([r for r in recurring if r.get('status') == 'active'])
    }

@api_router.get("/dashboard/business")
async def business_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    companies = await db.companies.find({"created_by": current_user["id"]}, {"_id": 0}).to_list(1000)
    company_ids = [c['id'] for c in companies]
    
    theses = await db.theses.find({"company_id": {"$in": company_ids}}, {"_id": 0}).to_list(1000)
    thesis_ids = [t['id'] for t in theses]
    
    investments = await db.investments.find({"thesis_id": {"$in": thesis_ids}}, {"_id": 0}).to_list(1000)
    
    capital_raised = sum(inv['amount'] for inv in investments if inv.get('status') == 'completed')
    active_investors = len(set(inv['investor_id'] for inv in investments if inv.get('status') == 'completed'))
    
    return {
        "capital_raised": capital_raised,
        "active_investors": active_investors,
        "active_theses": len([t for t in theses if t.get('status') == 'active'])
    }

# Analytics Routes
@api_router.get("/analytics/investor/timeline")
async def investor_timeline(current_user: dict = Depends(get_current_user)):
    """Get investment timeline data for charts"""
    if current_user["role"] not in ["investor", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    investments = await db.investments.find(
        {"investor_id": current_user["id"], "status": "completed"}, 
        {"_id": 0}
    ).to_list(1000)
    
    # Group by month
    monthly_data = {}
    for inv in investments:
        created_at = inv['created_at']
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)
        month_key = created_at.strftime('%Y-%m')
        if month_key not in monthly_data:
            monthly_data[month_key] = 0
        monthly_data[month_key] += inv['amount']
    
    # Convert to list format for charts
    timeline = [{"month": k, "amount": v} for k, v in sorted(monthly_data.items())]
    return timeline

@api_router.get("/analytics/business/timeline")
async def business_timeline(current_user: dict = Depends(get_current_user)):
    """Get capital raised timeline for charts"""
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    companies = await db.companies.find({"created_by": current_user["id"]}, {"_id": 0}).to_list(1000)
    company_ids = [c['id'] for c in companies]
    
    theses = await db.theses.find({"company_id": {"$in": company_ids}}, {"_id": 0}).to_list(1000)
    thesis_ids = [t['id'] for t in theses]
    
    investments = await db.investments.find(
        {"thesis_id": {"$in": thesis_ids}, "status": "completed"}, 
        {"_id": 0}
    ).to_list(1000)
    
    # Group by month
    monthly_data = {}
    for inv in investments:
        created_at = inv['created_at']
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)
        month_key = created_at.strftime('%Y-%m')
        if month_key not in monthly_data:
            monthly_data[month_key] = 0
        monthly_data[month_key] += inv['amount']
    
    # Convert to list format for charts
    timeline = [{"month": k, "amount": v} for k, v in sorted(monthly_data.items())]
    return timeline

# Notification Routes
@api_router.get("/notifications/my", response_model=List[Notification])
async def my_notifications(current_user: dict = Depends(get_current_user)):
    """Get user notifications"""
    notifications = await db.notifications.find(
        {"user_id": current_user["id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for n in notifications:
        if isinstance(n['created_at'], str):
            n['created_at'] = datetime.fromisoformat(n['created_at'])
    
    return notifications

@api_router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark notification as read"""
    result = await db.notifications.update_one(
        {"id": notification_id, "user_id": current_user["id"]},
        {"$set": {"read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True}

async def create_notification(notification: NotificationCreate):
    """Helper to create notifications"""
    notif = Notification(**notification.model_dump())
    notif_dict = notif.model_dump()
    notif_dict['created_at'] = notif_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_dict)
    return notif

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
