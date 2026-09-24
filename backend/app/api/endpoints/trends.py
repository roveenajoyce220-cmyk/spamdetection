from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.schemas import GlobalTrendsResponse

router = APIRouter(prefix="/trends", tags=["Global News Trends"])

@router.get("/global", response_model=GlobalTrendsResponse)
def get_global_trends(
    category: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    timeframe: Optional[str] = Query("30d")
):
    categories = [
        {"category": "Technology", "volume": 3420, "credible_pct": 82, "spam_pct": 8, "suspicious_pct": 10},
        {"category": "Science", "volume": 2150, "credible_pct": 89, "spam_pct": 4, "suspicious_pct": 7},
        {"category": "Health", "volume": 4180, "credible_pct": 64, "spam_pct": 21, "suspicious_pct": 15},
        {"category": "Politics", "volume": 6890, "credible_pct": 58, "spam_pct": 24, "suspicious_pct": 18},
        {"category": "Business", "volume": 3890, "credible_pct": 78, "spam_pct": 11, "suspicious_pct": 11},
        {"category": "World", "volume": 5210, "credible_pct": 72, "spam_pct": 14, "suspicious_pct": 14},
        {"category": "Entertainment", "volume": 2980, "credible_pct": 44, "spam_pct": 36, "suspicious_pct": 20},
        {"category": "Sports", "volume": 2100, "credible_pct": 86, "spam_pct": 6, "suspicious_pct": 8},
        {"category": "Education", "volume": 1250, "credible_pct": 91, "spam_pct": 3, "suspicious_pct": 6}
    ]

    countries = [
        {"code": "US", "country": "United States", "volume": 8420, "credibility_index": 76.4, "spam_rate": 14.2, "flagged_topics": ["Elections", "Miracle Diets"]},
        {"code": "GB", "country": "United Kingdom", "volume": 4150, "credibility_index": 79.8, "spam_rate": 11.5, "flagged_topics": ["Celebrity Tabloids", "Energy Policy"]},
        {"code": "IN", "country": "India", "volume": 6210, "credibility_index": 71.2, "spam_rate": 18.4, "flagged_topics": ["WhatsApp Rumors", "Financial Schemes"]},
        {"code": "DE", "country": "Germany", "volume": 3120, "credibility_index": 84.1, "spam_rate": 8.1, "flagged_topics": ["Climate Claims"]},
        {"code": "FR", "country": "France", "volume": 2890, "credibility_index": 82.5, "spam_rate": 9.3, "flagged_topics": ["Immigration", "Social Reforms"]},
        {"code": "JP", "country": "Japan", "volume": 2410, "credibility_index": 88.6, "spam_rate": 5.4, "flagged_topics": ["Cryptocurrency"]},
        {"code": "BR", "country": "Brazil", "volume": 3640, "credibility_index": 67.8, "spam_rate": 21.0, "flagged_topics": ["Vaccines", "Deforestation"]},
        {"code": "CA", "country": "Canada", "volume": 2190, "credibility_index": 83.2, "spam_rate": 8.7, "flagged_topics": ["Housing Crisis"]},
        {"code": "AU", "country": "Australia", "volume": 1940, "credibility_index": 81.5, "spam_rate": 9.8, "flagged_topics": ["Mining", "Tax Policies"]}
    ]

    timeline = [
        {"date": "Day 1", "credible": 120, "suspicious": 35, "spam": 18},
        {"date": "Day 5", "credible": 145, "suspicious": 42, "spam": 24},
        {"date": "Day 10", "credible": 160, "suspicious": 38, "spam": 15},
        {"date": "Day 15", "credible": 190, "suspicious": 51, "spam": 32},
        {"date": "Day 20", "credible": 175, "suspicious": 44, "spam": 21},
        {"date": "Day 25", "credible": 210, "suspicious": 48, "spam": 19},
        {"date": "Day 30", "credible": 235, "suspicious": 56, "spam": 28}
    ]

    trending_claims = [
        {
            "id": "tc-1",
            "topic": "Global Health & Diet",
            "claim": "Newly discovered herbal compound eliminates need for insulin entirely.",
            "status": "FALSE / UNSUPPORTED",
            "detected_volume": 412,
            "origin_tld": ".xyz / Social feeds",
            "risk": "HIGH"
        },
        {
            "id": "tc-2",
            "topic": "Clean Energy",
            "claim": "Perovskite solar cell efficiency reaches 34% in certified laboratory benchmark.",
            "status": "VERIFIED / CREDIBLE",
            "detected_volume": 890,
            "origin_tld": "nature.com / MIT Tech",
            "risk": "LOW"
        },
        {
            "id": "tc-3",
            "topic": "Space Exploration",
            "claim": "James Webb Space Telescope detects artificial atmospheric signals on exoplanet K2-18b.",
            "status": "NEEDS VERIFICATION / EXAGGERATED",
            "detected_volume": 630,
            "origin_tld": "Science blogs",
            "risk": "MEDIUM"
        },
        {
            "id": "tc-4",
            "topic": "Finance & Markets",
            "claim": "Central banks announce mandatory phase-out of physical currency by end of year.",
            "status": "FALSE / MISLEADING",
            "detected_volume": 320,
            "origin_tld": "Anonymous telegram feeds",
            "risk": "HIGH"
        }
    ]

    languages = [
        {"language": "English", "share": 54, "credible_pct": 78},
        {"language": "Spanish", "share": 16, "credible_pct": 72},
        {"language": "French", "share": 9, "credible_pct": 81},
        {"language": "German", "share": 8, "credible_pct": 85},
        {"language": "Hindi", "share": 7, "credible_pct": 69},
        {"language": "Japanese", "share": 4, "credible_pct": 88},
        {"language": "Others", "share": 2, "credible_pct": 70}
    ]

    return GlobalTrendsResponse(
        categories=categories,
        countries=countries,
        timeline=timeline,
        trending_unverified_claims=trending_claims,
        languages=languages
    )
