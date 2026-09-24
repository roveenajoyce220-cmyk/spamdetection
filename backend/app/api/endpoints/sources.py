from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.session import get_db
from app.models.models import SourceIntelligence
from app.schemas.schemas import SourceIntelligenceResponse

router = APIRouter(prefix="/sources", tags=["Source Intelligence"])

@router.get("", response_model=List[SourceIntelligenceResponse])
def get_sources_catalog(
    search: Optional[str] = Query(None, description="Search by domain or publisher name"),
    trust_tier: Optional[str] = Query(None, description="HIGH, MEDIUM, LOW"),
    country: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(SourceIntelligence)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (SourceIntelligence.name.ilike(search_fmt)) |
            (SourceIntelligence.domain.ilike(search_fmt))
        )
    if country and country != "ALL":
        query = query.filter(SourceIntelligence.country == country)
    if trust_tier == "HIGH":
        query = query.filter(SourceIntelligence.reliability_score >= 80.0)
    elif trust_tier == "MEDIUM":
        query = query.filter(SourceIntelligence.reliability_score >= 50.0, SourceIntelligence.reliability_score < 80.0)
    elif trust_tier == "LOW":
        query = query.filter(SourceIntelligence.reliability_score < 50.0)

    sources = query.order_by(SourceIntelligence.reliability_score.desc()).limit(limit).all()
    return sources


@router.get("/{domain}", response_model=SourceIntelligenceResponse)
def get_source_by_domain(domain: str, db: Session = Depends(get_db)):
    source = db.query(SourceIntelligence).filter(
        SourceIntelligence.domain == domain.lower()
    ).first()
    
    if not source:
        # Dynamic fallback
        return SourceIntelligenceResponse(
            domain=domain.lower(),
            name=domain.split(".")[0].capitalize(),
            category="Web Publisher",
            country="Global",
            reliability_score=65.0,
            https_valid=True,
            domain_age_years=3,
            bias_rating="Unrated",
            total_analyzed=0,
            spam_ratio=0.2,
            verified=False,
            description=f"AI automated profile for domain {domain}."
        )
    return source
