from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.database.session import get_db
from app.models.models import NewsArticle, AnalysisResult, SourceIntelligence, SavedArticle, User
from app.schemas.schemas import (
    AnalyzeRequest,
    AnalyzeUrlRequest,
    AnalysisResultResponse,
    SaveArticleRequest,
    SourceIntelligenceResponse
)
from app.ai.pipeline import TruthLensAIEngine
from app.api.deps import get_current_user, require_current_user

router = APIRouter(prefix="/news", tags=["News Analysis"])

def format_analysis_response(result: AnalysisResult, article: NewsArticle, db: Session) -> AnalysisResultResponse:
    source_intel = None
    if article.source_domain:
        source_intel = db.query(SourceIntelligence).filter(
            SourceIntelligence.domain == article.source_domain.lower()
        ).first()
        if not source_intel:
            # Create dynamic source profile
            source_intel = SourceIntelligenceResponse(
                domain=article.source_domain,
                name=article.source_domain.title(),
                category="Online Media",
                country="Global",
                reliability_score=result.source_reliability,
                https_valid=True,
                domain_age_years=5,
                bias_rating="Unrated",
                total_analyzed=1,
                spam_ratio=0.1 if result.classification == "NOT SPAM" else 0.8,
                verified=False,
                description=f"Automated intelligence profile for {article.source_domain}."
            )

    return AnalysisResultResponse(
        id=result.id,
        article_id=article.id,
        user_id=result.user_id,
        title=article.title or "Untitled News Article",
        content_preview=article.content[:300] + ("..." if len(article.content) > 300 else ""),
        url=article.url,
        source_domain=article.source_domain,
        author=article.author,
        published_date=article.published_date,
        language=article.language or "English",
        category=article.category or "World",
        input_type=article.input_type or "text",
        classification=result.classification,
        credibility_score=result.credibility_score,
        confidence=result.confidence,
        risk_level=result.risk_level,
        sensationalism_score=result.sensationalism_score,
        clickbait_probability=result.clickbait_probability,
        source_reliability=result.source_reliability,
        claim_consistency=result.claim_consistency,
        summary=result.summary,
        reasons=result.reasons or [],
        concerns=result.concerns or [],
        signals=result.signals or [],
        claims=result.claims or [],
        source_analysis=source_intel,
        model_metadata=result.model_metadata or {},
        created_at=result.created_at
    )


@router.post("/analyze", response_model=AnalysisResultResponse)
def analyze_news(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if request.input_type == "url" and not request.url:
        raise HTTPException(status_code=400, detail="URL is required for URL analysis mode.")
    if request.input_type in ["text", "headline"] and not request.text and not request.headline:
        raise HTTPException(status_code=400, detail="Text or headline is required for analysis.")

    # Run AI Pipeline
    ai_output = TruthLensAIEngine.run_analysis(
        text=request.text,
        headline=request.headline,
        url=request.url,
        input_type=request.input_type,
        language=request.language or "English",
        category=request.category or "World"
    )

    # Persist Article
    article = NewsArticle(
        title=ai_output["title"],
        content=ai_output["content"],
        url=ai_output["url"],
        source_domain=ai_output["source_domain"],
        author=ai_output["author"],
        published_date=ai_output["published_date"],
        language=ai_output["language"],
        category=ai_output["category"],
        input_type=ai_output["input_type"]
    )
    db.add(article)
    db.commit()
    db.refresh(article)

    # Persist Analysis Result
    result = AnalysisResult(
        article_id=article.id,
        user_id=current_user.id if current_user else None,
        classification=ai_output["classification"],
        credibility_score=ai_output["credibility_score"],
        confidence=ai_output["confidence"],
        risk_level=ai_output["risk_level"],
        sensationalism_score=ai_output["sensationalism_score"],
        clickbait_probability=ai_output["clickbait_probability"],
        source_reliability=ai_output["source_reliability"],
        claim_consistency=ai_output["claim_consistency"],
        summary=ai_output["summary"],
        reasons=ai_output["reasons"],
        concerns=ai_output["concerns"],
        signals=ai_output["signals"],
        claims=ai_output["claims"],
        model_metadata=ai_output["model_metadata"]
    )
    db.add(result)

    # Update or add Source Intelligence stats
    if ai_output["source_domain"] and not ai_output["source_domain"].startswith("unknown"):
        source = db.query(SourceIntelligence).filter(
            SourceIntelligence.domain == ai_output["source_domain"].lower()
        ).first()
        if source:
            source.total_analyzed += 1
            if ai_output["classification"] == "SPAM":
                source.spam_ratio = round(((source.spam_ratio * (source.total_analyzed - 1)) + 1.0) / source.total_analyzed, 2)
            else:
                source.spam_ratio = round((source.spam_ratio * (source.total_analyzed - 1)) / source.total_analyzed, 2)
        else:
            new_source = SourceIntelligence(
                domain=ai_output["source_domain"].lower(),
                name=ai_output["source_domain"].split(".")[0].capitalize(),
                category="Online Media",
                country="Global",
                reliability_score=ai_output["source_reliability"],
                total_analyzed=1,
                spam_ratio=1.0 if ai_output["classification"] == "SPAM" else 0.0,
                verified=False
            )
            db.add(new_source)

    db.commit()
    db.refresh(result)

    return format_analysis_response(result, article, db)


@router.post("/analyze-url", response_model=AnalysisResultResponse)
def analyze_news_url(
    request: AnalyzeUrlRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    analyze_req = AnalyzeRequest(
        input_type="url",
        url=request.url
    )
    return analyze_news(analyze_req, db, current_user)


@router.get("/history", response_model=List[AnalysisResultResponse])
def get_analysis_history(
    classification: Optional[str] = Query(None, description="Filter by NOT SPAM, SUSPICIOUS, SPAM"),
    search: Optional[str] = Query(None, description="Search by title or source"),
    category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(AnalysisResult).join(NewsArticle)

    if classification and classification != "ALL":
        query = query.filter(AnalysisResult.classification == classification)
    if category and category != "ALL":
        query = query.filter(NewsArticle.category == category)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (NewsArticle.title.ilike(search_fmt)) |
            (NewsArticle.source_domain.ilike(search_fmt)) |
            (NewsArticle.content.ilike(search_fmt))
        )

    results = query.order_by(desc(AnalysisResult.created_at)).offset(offset).limit(limit).all()

    formatted = []
    for r in results:
        formatted.append(format_analysis_response(r, r.article, db))
    return formatted


@router.get("/history/{result_id}", response_model=AnalysisResultResponse)
def get_single_analysis(result_id: int, db: Session = Depends(get_db)):
    result = db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail=f"Analysis report #{result_id} not found.")
    return format_analysis_response(result, result.article, db)


@router.post("/save/{result_id}")
def save_article_analysis(
    result_id: int,
    req: SaveArticleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_current_user)
):
    result = db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Analysis report not found.")

    existing = db.query(SavedArticle).filter(
        SavedArticle.user_id == current_user.id,
        SavedArticle.analysis_id == result_id
    ).first()

    if existing:
        existing.notes = req.notes or existing.notes
        existing.tags = req.tags or existing.tags
        db.commit()
        return {"message": "Article bookmark updated successfully", "saved_id": existing.id}

    saved = SavedArticle(
        user_id=current_user.id,
        analysis_id=result_id,
        notes=req.notes,
        tags=req.tags
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return {"message": "Article saved to your research collection", "saved_id": saved.id}


@router.get("/saved", response_model=List[AnalysisResultResponse])
def get_user_saved_articles(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_current_user)
):
    saved_entries = db.query(SavedArticle).filter(SavedArticle.user_id == current_user.id).order_by(desc(SavedArticle.created_at)).all()
    formatted = []
    for s in saved_entries:
        if s.analysis:
            formatted.append(format_analysis_response(s.analysis, s.analysis.article, db))
    return formatted
