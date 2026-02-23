import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_data():
    print("Seeding database...")
    
    # Clear existing data
    await db.users.delete_many({})
    await db.companies.delete_many({})
    await db.theses.delete_many({})
    await db.investments.delete_many({})
    await db.governance_alerts.delete_many({})
    
    # Create sample users (passwords are all "password123")
    users = [
        {
            "id": "investor-1",
            "email": "investor@sri.com",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7qK/Qa8j5i",
            "full_name": "Sarah Investor",
            "role": "investor",
            "country": "US",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "founder-1",
            "email": "founder@sri.com",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7qK/Qa8j5i",
            "full_name": "John Founder",
            "role": "business",
            "country": "US",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "both-1",
            "email": "both@sri.com",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7qK/Qa8j5i",
            "full_name": "Alex Both",
            "role": "both",
            "country": "UK",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.users.insert_many(users)
    print(f"Created {len(users)} users")
    
    # Create sample companies
    companies = [
        {
            "id": "company-1",
            "name": "Solar Futures Inc",
            "description": "Next-generation solar energy storage systems",
            "industry": "Energy",
            "geography": "North America",
            "website": "https://solarfutures.example.com",
            "created_by": "founder-1",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "company-2",
            "name": "BioGen Labs",
            "description": "Precision medicine and gene therapy research",
            "industry": "Biotech",
            "geography": "Europe",
            "website": "https://biogenlabs.example.com",
            "created_by": "both-1",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "company-3",
            "name": "AgriTech Solutions",
            "description": "AI-powered vertical farming systems",
            "industry": "Agriculture",
            "geography": "Asia Pacific",
            "website": "https://agritech.example.com",
            "created_by": "founder-1",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.companies.insert_many(companies)
    print(f"Created {len(companies)} companies")
    
    # Create sample theses
    theses = [
        {
            "id": "thesis-1",
            "company_id": "company-1",
            "title": "Democratizing Clean Energy Storage",
            "overview": "Solar Futures is building the world's most efficient residential battery storage system, enabling homes to achieve energy independence while reducing carbon emissions by 80%.",
            "thesis_content": "The residential energy storage market is projected to reach $50B by 2030. Current solutions are expensive and inefficient. Our proprietary solid-state battery technology delivers 3x the capacity at 40% lower cost.\n\nWe've secured partnerships with three major solar installers and have 500 pre-orders totaling $12M in projected revenue. Our founding team includes former Tesla Energy executives and PhD researchers from MIT.",
            "risks": "Technology risk: Battery technology is still in development phase and may not achieve targeted specifications.\n\nMarket risk: Adoption depends on regulatory incentives which may change.\n\nCompetition: Large incumbents like Tesla may enter this space aggressively.\n\nLiquidity risk: This is a long-term investment with no guaranteed exit.",
            "safe_structure": {
                "valuation_cap": "$30M",
                "discount_rate": "20%",
                "type": "Pre-seed SAFE",
                "pro_rata_rights": "Yes"
            },
            "status": "active",
            "industry": "Energy",
            "geography": "North America",
            "stage": "Pre-seed",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "thesis-2",
            "company_id": "company-2",
            "title": "Gene Therapy for Rare Diseases",
            "overview": "BioGen Labs is developing breakthrough gene therapies for ultra-rare genetic disorders affecting 1 in 100,000 people, bringing hope to patients with no current treatment options.",
            "thesis_content": "Rare disease gene therapy is a $15B+ market with limited competition. We have successfully completed Phase 1 trials for two drug candidates with 85% efficacy rates.\n\nOur scientific advisory board includes Nobel laureates and leading geneticists. We have secured $5M in NIH grants and are in partnership discussions with major pharma companies for Phase 2 trials.",
            "risks": "Clinical risk: Drug candidates may fail in later-stage trials.\n\nRegulatory risk: FDA approval process is lengthy and uncertain.\n\nFunding risk: Clinical trials require significant capital that may exceed current runway.\n\nLiquidity risk: Long development timelines mean returns are 7-10+ years away.",
            "safe_structure": {
                "valuation_cap": "$50M",
                "discount_rate": "15%",
                "type": "Seed SAFE",
                "pro_rata_rights": "Yes"
            },
            "status": "active",
            "industry": "Biotech",
            "geography": "Europe",
            "stage": "Seed",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "thesis-3",
            "company_id": "company-3",
            "title": "AI-Powered Vertical Farming Revolution",
            "overview": "AgriTech Solutions uses computer vision and machine learning to optimize crop yields in vertical farms, producing 10x more food per square foot than traditional agriculture.",
            "thesis_content": "Global food security is a $8T problem. Vertical farming can feed growing urban populations sustainably. Our AI system monitors every plant in real-time and adjusts nutrients, light, and water with precision.\n\nWe operate 3 profitable farms in Singapore and have signed MOUs for 20 more across Asia. Unit economics show 18-month payback and 40% margins at scale.",
            "risks": "Execution risk: Scaling operations across geographies is complex.\n\nTechnology risk: AI models may not generalize to all crop types and climates.\n\nMarket risk: Commodity pricing volatility may impact profitability.\n\nLiquidity risk: Agriculture is capital-intensive with multi-year investment horizons.",
            "safe_structure": {
                "valuation_cap": "$40M",
                "discount_rate": "20%",
                "type": "Series A SAFE",
                "pro_rata_rights": "No"
            },
            "status": "active",
            "industry": "Agriculture",
            "geography": "Asia Pacific",
            "stage": "Series A",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.theses.insert_many(theses)
    print(f"Created {len(theses)} theses")
    
    # Create governance alerts
    alerts = [
        {
            "id": "alert-1",
            "title": "Platform Governance Update",
            "content": "Sri has updated its Investor Protection Charter to include enhanced disclosure requirements for all active theses. All founders must acknowledge the new requirements by March 1, 2026.",
            "severity": "info",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "alert-2",
            "title": "Regulatory Compliance Notice",
            "content": "New SEC guidelines for SAFE instruments take effect Q2 2026. Sri is implementing additional audit trails and investor acknowledgements to remain compliant.",
            "severity": "warning",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        }
    ]
    await db.governance_alerts.insert_many(alerts)
    print(f"Created {len(alerts)} governance alerts")
    
    print("\nSeed data created successfully!")
    print("\nTest accounts:")
    print("Investor: investor@sri.com / password123")
    print("Founder: founder@sri.com / password123")
    print("Both: both@sri.com / password123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
