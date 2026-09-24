from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.session import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="Fact Checker")  # Fact Checker, Journalist, Researcher, General Reader, Admin
    avatar_url = Column(String(500), nullable=True)
    api_key = Column(String(100), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    analyses = relationship("AnalysisResult", back_populates="user", cascade="all, delete-orphan")
    saved_articles = relationship("SavedArticle", back_populates="user", cascade="all, delete-orphan")


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    url = Column(String(1000), nullable=True, index=True)
    source_domain = Column(String(255), nullable=True, index=True)
    author = Column(String(255), nullable=True)
    published_date = Column(String(100), nullable=True)
    language = Column(String(50), default="English")
    category = Column(String(100), default="World")
    input_type = Column(String(50), default="text")  # text, headline, url
    created_at = Column(DateTime, default=utc_now)

    analyses = relationship("AnalysisResult", back_populates="article", cascade="all, delete-orphan")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Core Verdict Metrics
    classification = Column(String(50), nullable=False, index=True)  # NOT SPAM, SUSPICIOUS, SPAM
    credibility_score = Column(Float, nullable=False)  # 0 to 100
    confidence = Column(Float, nullable=False)  # 0 to 100
    risk_level = Column(String(50), nullable=False)  # LOW, MEDIUM, HIGH
    
    # Detailed Sub-Scores
    sensationalism_score = Column(Float, default=0.0)  # 0 to 100
    clickbait_probability = Column(Float, default=0.0)  # 0 to 100
    source_reliability = Column(Float, default=0.0)  # 0 to 100
    claim_consistency = Column(Float, default=0.0)  # 0 to 100
    
    # Rich AI Explanations & Structures
    summary = Column(Text, nullable=False)
    reasons = Column(JSON, default=list)       # List of strings / objects (Affirmative signals)
    concerns = Column(JSON, default=list)      # List of strings / objects (Warnings/red flags)
    signals = Column(JSON, default=list)       # List of 14 detection signal objects
    claims = Column(JSON, default=list)         # List of extracted claims with status & evidence
    model_metadata = Column(JSON, default=dict) # Name, version, metrics
    
    created_at = Column(DateTime, default=utc_now)

    article = relationship("NewsArticle", back_populates="analyses")
    user = relationship("User", back_populates="analyses")
    saved_entries = relationship("SavedArticle", back_populates="analysis", cascade="all, delete-orphan")


class SourceIntelligence(Base):
    __tablename__ = "source_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="General News")
    country = Column(String(100), default="Global")
    reliability_score = Column(Float, default=85.0)  # 0 to 100
    https_valid = Column(Boolean, default=True)
    domain_age_years = Column(Integer, default=10)
    bias_rating = Column(String(100), default="Center / Neutral")
    total_analyzed = Column(Integer, default=0)
    spam_ratio = Column(Float, default=0.0)
    verified = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class SavedArticle(Base):
    __tablename__ = "saved_articles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("analysis_results.id"), nullable=False)
    notes = Column(Text, nullable=True)
    tags = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="saved_articles")
    analysis = relationship("AnalysisResult", back_populates="saved_entries")
