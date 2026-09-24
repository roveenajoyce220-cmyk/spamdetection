export type ClassificationVerdict = 'NOT SPAM' | 'SUSPICIOUS' | 'SPAM';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: number;
  email: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  api_key?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface DetectionSignal {
  id: string;
  name: string;
  category: 'Linguistic' | 'Credibility' | 'Source' | 'Structure';
  status: 'Clean' | 'Caution' | 'Risk';
  score: number;
  description: string;
  flagged_snippet?: string | null;
}

export interface ExtractedClaim {
  id: string;
  claim: string;
  status: 'Supported' | 'Needs Verification' | 'Disputed' | 'Unverified';
  confidence: number;
  evidence: string;
  source_reference?: string | null;
}

export interface SourceIntelligence {
  domain: string;
  name: string;
  category: string;
  country: string;
  reliability_score: number;
  https_valid: boolean;
  domain_age_years: number;
  bias_rating: string;
  total_analyzed: number;
  spam_ratio: number;
  verified: boolean;
  description?: string | null;
}

export interface AnalysisResult {
  id: number;
  article_id: number;
  user_id?: number | null;
  title: string;
  content_preview: string;
  url?: string | null;
  source_domain?: string | null;
  author?: string | null;
  published_date?: string | null;
  language: string;
  category: string;
  input_type: string;

  classification: ClassificationVerdict;
  credibility_score: number;
  confidence: number;
  risk_level: RiskLevel;

  sensationalism_score: number;
  clickbait_probability: number;
  source_reliability: number;
  claim_consistency: number;

  summary: string;
  reasons: string[];
  concerns: string[];
  signals: DetectionSignal[];
  claims: ExtractedClaim[];
  source_analysis?: SourceIntelligence | null;
  model_metadata: {
    model_name: string;
    version: string;
    pipeline_stages: string[];
    evaluated_features_count: number;
    benchmark_accuracy: string;
    benchmark_f1_score: string;
  };
  created_at: string;
}

export interface DashboardStats {
  total_articles: number;
  credible_count: number;
  suspicious_count: number;
  spam_count: number;
  credible_rate: number;
  countries_covered: number;
  monitored_sources: number;
  languages_count: number;
  credibility_distribution: { name: string; value: number; color: string }[];
  recent_activity: {
    id: number;
    title: string;
    source: string;
    classification: ClassificationVerdict;
    credibility_score: number;
    created_at: string;
  }[];
  top_signals_detected: { name: string; count: number; severity: string }[];
}

export interface GlobalTrends {
  categories: { category: string; volume: number; credible_pct: number; spam_pct: number; suspicious_pct: number }[];
  countries: { code: string; country: string; volume: number; credibility_index: number; spam_rate: number; flagged_topics: string[] }[];
  timeline: { date: string; credible: number; suspicious: number; spam: number }[];
  trending_unverified_claims: {
    id: string;
    topic: string;
    claim: string;
    status: string;
    detected_volume: number;
    origin_tld: string;
    risk: string;
  }[];
  languages: { language: string; share: number; credible_pct: number }[];
}
