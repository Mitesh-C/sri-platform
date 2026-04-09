from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
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
    create_verification_token,
    verify_verification_token,
    get_current_user
)
from email_service import EmailService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

app = FastAPI(title="Sri by Mahakali Tribunal API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
@limiter.limit("5/minute")
async def signup(request: Request, user_data: UserCreate):
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(**user_data.model_dump(exclude={"password"}))
    user_dict = user.model_dump()
    user_dict['password_hash'] = get_password_hash(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Send verification email
    verification_token = create_verification_token(user.email)
    verification_link = f"{FRONTEND_URL}/verify-email?token={verification_token}"
    logger.info(f"[SIGNUP] Verification link for {user.email}: {verification_link}")
    await EmailService.send_email_verification(user.email, verification_link)
    
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
@limiter.limit("10/minute")
async def login(request: Request, credentials: UserLogin):
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

@api_router.post("/auth/send-verification")
async def send_verification_email(current_user: dict = Depends(get_current_user)):
    """Send email verification link"""
    user = await db.users.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get('email_verified'):
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Create verification token
    verification_token = create_verification_token(user['email'])
    verification_link = f"{FRONTEND_URL}/verify-email?token={verification_token}"
    
    # Send email (logged for now, can integrate real email service)
    logger.info(f"[EMAIL] Verification link for {user['email']}: {verification_link}")
    await EmailService.send_email_verification(user['email'], verification_link)
    
    return {"message": "Verification email sent"}

@api_router.get("/auth/verify-email/{token}")
async def verify_email(token: str):
    """Verify email with token"""
    email = verify_verification_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    # Update user email_verified status
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"email_verified": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Email verified successfully"}

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

    thesis = Thesis(**thesis_data.model_dump(), created_by=current_user["id"])
    thesis_dict = thesis.model_dump()
    thesis_dict['created_at'] = thesis_dict['created_at'].isoformat()
    thesis_dict['updated_at'] = thesis_dict['updated_at'].isoformat()

    await db.theses.insert_one(thesis_dict)
    await log_audit("thesis_created", current_user["id"], "thesis", thesis.id,
                    {"title": thesis.title, "company_name": thesis.company_name})
    return thesis

@api_router.get("/theses", response_model=List[Thesis])
async def list_theses(
    status: Optional[str] = None,
    industry: Optional[str] = None,
    geography: Optional[str] = None,
    stage: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
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

@api_router.get("/theses/my", response_model=List[Thesis])
async def my_theses(current_user: dict = Depends(get_current_user)):
    theses = await db.theses.find(
        {"created_by": current_user["id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    for t in theses:
        if isinstance(t.get('created_at'), str):
            t['created_at'] = datetime.fromisoformat(t['created_at'])
        if isinstance(t.get('updated_at'), str):
            t['updated_at'] = datetime.fromisoformat(t['updated_at'])
    return theses

@api_router.get("/theses/{thesis_id}", response_model=Thesis)
async def get_thesis(thesis_id: str, current_user: dict = Depends(get_current_user)):
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

    # Verify ownership — only the creator or admin may update
    if current_user["role"] != "admin":
        if existing.get("created_by") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Not authorized to modify this thesis")

    update_dict = thesis_data.model_dump()
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()

    await db.theses.update_one({"id": thesis_id}, {"$set": update_dict})
    await log_audit("thesis_updated", current_user["id"], "thesis", thesis_id, {"title": existing.get("title")})
    
    updated = await db.theses.find_one({"id": thesis_id}, {"_id": 0})
    if isinstance(updated['created_at'], str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated['updated_at'], str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    
    return Thesis(**updated)

@api_router.delete("/theses/{thesis_id}")
async def delete_thesis(
    thesis_id: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["business", "both", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    existing = await db.theses.find_one({"id": thesis_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Thesis not found")

    # Verify ownership — only the creator or admin can delete
    if current_user["role"] != "admin":
        if existing.get("created_by") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Not authorized to delete this thesis")

    await db.theses.delete_one({"id": thesis_id})
    await log_audit("thesis_deleted", current_user["id"], "thesis", thesis_id, {"title": existing.get("title")})
    return {"message": "Thesis deleted successfully"}


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

    # Persist investment + notification atomically
    async with await client.start_session() as session:
        async with session.start_transaction():
            await db.investments.insert_one(investment_dict, session=session)

            notif = Notification(**NotificationCreate(
                user_id=current_user["id"],
                type="investment_created",
                title="Investment Submitted",
                message=f"Your investment of ${investment.amount} has been submitted successfully.",
                related_id=investment.id
            ).model_dump())
            notif_dict = notif.model_dump()
            notif_dict['created_at'] = notif_dict['created_at'].isoformat()
            await db.notifications.insert_one(notif_dict, session=session)

    await log_audit("investment_created", current_user["id"], "investment", investment.id,
                    {"amount": investment.amount, "thesis_id": investment.thesis_id, "type": investment.investment_type})

    # Send email (non-critical — log failures but don't fail the request)
    try:
        user_doc = await db.users.find_one({"id": current_user["id"]})
        if user_doc:
            await EmailService.send_investment_confirmation(
                user_doc['email'],
                {"amount": investment.amount, "investment_type": investment.investment_type}
            )
    except Exception as e:
        logger.error(f"[EMAIL] Investment confirmation email failed: {e}")

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
    
    # Send notification
    await create_notification(NotificationCreate(
        user_id=current_user["id"],
        type="recurring_created",
        title="Recurring Investment Setup",
        message=f"Your {recurring.frequency} investment of ${recurring.amount} has been set up.",
        related_id=recurring.id
    ))
    
    # Send email
    user = await db.users.find_one({"id": current_user["id"]})
    if user:
        await EmailService.send_recurring_notification(
            user['email'],
            {"amount": recurring.amount, "frequency": recurring.frequency}
        )
    
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
    allowed_statuses = {"active", "paused", "cancelled"}
    if status not in allowed_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(allowed_statuses)}")

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
    await log_audit("reference_price_updated", current_user["id"], "reference_price", price.id,
                    {"thesis_id": price.thesis_id, "old_price": price.old_price, "new_price": price.new_price})

    # Notify all investors of this thesis
    investments = await db.investments.find({"thesis_id": price_data.thesis_id}, {"_id": 0}).to_list(1000)
    investor_ids = set(inv['investor_id'] for inv in investments)
    
    for investor_id in investor_ids:
        await create_notification(NotificationCreate(
            user_id=investor_id,
            type="price_update",
            title="Reference Price Update",
            message=f"Reference price updated: ${price.old_price or 'N/A'} → ${price.new_price}",
            related_id=price.id
        ))
        
        # Send email
        user = await db.users.find_one({"id": investor_id})
        if user:
            await EmailService.send_price_update(
                user['email'],
                {"old_price": price.old_price, "new_price": price.new_price, "reason": price.reason}
            )
    
    return price

@api_router.get("/reference-prices", response_model=List[ReferencePrice])
async def list_reference_prices(thesis_id: Optional[str] = None, current_user: dict = Depends(get_current_user)):
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
async def list_liquidity_windows(thesis_id: Optional[str] = None, current_user: dict = Depends(get_current_user)):
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
    await log_audit("secondary_sale_approved", current_user["id"], "secondary_sale", sale_id)
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
async def list_discussions(thesis_id: str, current_user: dict = Depends(get_current_user)):
    discussions = await db.discussions.find(
        {"thesis_id": thesis_id}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    for d in discussions:
        if isinstance(d['created_at'], str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return discussions

# Governance Routes
@api_router.get("/governance/alerts", response_model=List[GovernanceAlert])
async def list_governance_alerts(current_user: dict = Depends(get_current_user)):
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

    theses = await db.theses.find({"created_by": current_user["id"]}, {"_id": 0}).to_list(1000)
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
    
    theses = await db.theses.find({"created_by": current_user["id"]}, {"_id": 0}).to_list(1000)
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

async def log_audit(action: str, user_id: str, resource_type: str, resource_id: str, details: dict = None):
    """Write an immutable audit record for every financial or sensitive action."""
    record = {
        "id": str(__import__("uuid").uuid4()),
        "action": action,
        "user_id": user_id,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "details": details or {},
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    try:
        await db.audit_logs.insert_one(record)
    except Exception as e:
        logger.error(f"[AUDIT] Failed to write audit log: {e}")

# Payment Routes (Razorpay)
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')
RAZORPAY_ENABLED = bool(RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)

if RAZORPAY_ENABLED:
    import razorpay
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    razorpay_client = None
    logger.info("[RAZORPAY] Not configured - payment features disabled")

@api_router.get("/payments/config")
async def payment_config():
    """Return Razorpay public key for frontend"""
    return {
        "enabled": RAZORPAY_ENABLED,
        "key_id": RAZORPAY_KEY_ID if RAZORPAY_ENABLED else None,
        "currency": "INR"
    }

@api_router.post("/payments/create-order")
async def create_payment_order(
    amount: int,
    purpose: str = "investment",
    thesis_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Create a Razorpay order for payment"""
    if not RAZORPAY_ENABLED:
        raise HTTPException(status_code=503, detail="Payment gateway not configured")
    
    try:
        order_data = {
            "amount": amount,  # Amount in paise
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "user_id": current_user["id"],
                "purpose": purpose,
                "thesis_id": thesis_id or ""
            }
        }
        order = razorpay_client.order.create(data=order_data)
        
        # Store order in DB
        payment_record = {
            "id": order["id"],
            "user_id": current_user["id"],
            "amount": amount,
            "currency": "INR",
            "purpose": purpose,
            "thesis_id": thesis_id,
            "status": "created",
            "razorpay_order_id": order["id"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payments.insert_one(payment_record)
        
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": RAZORPAY_KEY_ID
        }
    except Exception as e:
        logger.error(f"[RAZORPAY] Order creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")

@api_router.post("/payments/verify")
async def verify_payment(
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """Verify Razorpay payment signature"""
    if not RAZORPAY_ENABLED:
        raise HTTPException(status_code=503, detail="Payment gateway not configured")
    
    body = await request.json()
    razorpay_order_id = body.get("razorpay_order_id")
    razorpay_payment_id = body.get("razorpay_payment_id")
    razorpay_signature = body.get("razorpay_signature")
    
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
        
        # Update payment status
        await db.payments.update_one(
            {"razorpay_order_id": razorpay_order_id},
            {"$set": {
                "status": "completed",
                "razorpay_payment_id": razorpay_payment_id,
                "completed_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return {"status": "success", "message": "Payment verified successfully"}
    except Exception as e:
        logger.error(f"[RAZORPAY] Verification failed: {str(e)}")
        await db.payments.update_one(
            {"razorpay_order_id": razorpay_order_id},
            {"$set": {"status": "failed"}}
        )
        raise HTTPException(status_code=400, detail="Payment verification failed")

@api_router.get("/payments/my")
async def my_payments(current_user: dict = Depends(get_current_user)):
    """Get user's payment history"""
    payments = await db.payments.find(
        {"user_id": current_user["id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return payments

app.include_router(api_router)

_cors_origins_raw = os.environ.get('CORS_ORIGINS', 'http://localhost:3000')
_cors_origins = [o.strip() for o in _cors_origins_raw.split(',') if o.strip()]
if '*' in _cors_origins:
    logger.warning("[CORS] Wildcard '*' detected in CORS_ORIGINS — this is insecure in production. Set explicit origins.")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors_origins,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
