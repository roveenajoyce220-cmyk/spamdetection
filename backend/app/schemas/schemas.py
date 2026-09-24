from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "Fact Checker"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    api_key: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- News Analysis Input Schemas ---
class AnalyzeRequest(BaseModel):
    input_type: str = Field(default="text", description="text, headline, or url")
    text: Optional[str] = None
    headline: Optional[str] = None
    url: Optional[str] = None
    language: Optional[str] = "English"
    category: Optional[str] = "World"

class AnalyzeUrlRequest(BaseModel):
    url: str


# --- Detection Signal & Claim Sub-Schemas ---
class DetectionSignal(BaseModel):
    id: str
    name: str
    category: str  # Linguistic, Credibility, Source, Structure
    status: str    # Clean, Caution, Risk
    score: float   # 0 to 100
    description: str
    flagged_snippet: Optional[str] = None

class ExtractedClaim(BaseModel):
    id: str
    claim: str
    status: str    # Supported, Needs Verification, Disputed, Unverified
    confidence: float # 0 to 100
    evidence: str
    source_reference: Optional[str] = None

class SourceIntelligenceResponse(BaseModel):
    domain: str
    name: str
    category: str
    country: str
    reliability_score: float
    https_valid: bool
    domain_age_years: int
    bias_rating: str
    total_analyzed: int
    spam_ratio: float
    verified: bool
    description: Optional[str] = None

    class Config:
        from_attributes = True


# --- Full Analysis Result Schema ---
class AnalysisResultResponse(BaseModel):
    id: int
    article_id: int
    user_id: Optional[int] = None
    title: Optional[str] = None
    content_preview: str
    url: Optional[str] = None
    source_domain: Optional[str] = None
    author: Optional[str] = None
    published_date: Optional[str] = None
    language: str
    category: str
    input_type: str

    classification: str       # NOT SPAM, SUSPICIOUS, SPAM
    credibility_score: float  # 0 to 100
    confidence: float         # 0 to 100
    risk_level: str           # LOW, MEDIUM, HIGH

    sensationalism_score: float
    clickbait_probability: float
    source_reliability: float
    claim_consistency: float

    summary: str
    reasons: List[str]
    concerns: List[str]
    signals: List[DetectionSignal]
    claims: List[ExtractedClaim]
    source_analysis: Optional[SourceIntelligenceResponse] = None
    model_metadata: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


# --- Dashboard & Trends Schemas ---
class DashboardStats(BaseModel):
    total_articles: int
    credible_count: int
    suspicious_count: int
    spam_count: int
    credible_rate: float
    countries_covered: int
    monitored_sources: int
    languages_count: int
    credibility_distribution: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    top_signals_detected: List[Dict[str, Any]]

class GlobalTrendsResponse(BaseModel):
    categories: List[Dict[str, Any]]
    countries: List[Dict[str, Any]]
    timeline: List[Dict[str, Any]]
    trending_unverified_claims: List[Dict[str, Any]]
    languages: List[Dict[str, Any]]

class SaveArticleRequest(BaseModel):
    notes: Optional[str] = None
    tags: Optional[str] = None
