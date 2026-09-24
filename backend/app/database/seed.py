from sqlalchemy.orm import Session
from app.database.session import SessionLocal, Base, engine
from app.models.models import User, NewsArticle, AnalysisResult, SourceIntelligence
from app.core.security import get_password_hash
from app.ai.pipeline import TruthLensAIEngine

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Users if none exist
        if db.query(User).count() == 0:
            demo_analyst = User(
                email="analyst@truthlens.ai",
                hashed_password=get_password_hash("truthlens2026"),
                full_name="Elena Rostova",
                role="Senior Intelligence Analyst",
                api_key="tl_live_a89f72bc910243d9281a74e",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            )
            demo_user = User(
                email="demo@truthlens.ai",
                hashed_password=get_password_hash("demo1234"),
                full_name="Marcus Vance",
                role="Fact Checker",
                api_key="tl_live_49b81c2019fe829aa872bc",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            )
            db.add(demo_analyst)
            db.add(demo_user)
            db.commit()
            print("[OK] Seeded demo users")

        # 2. Seed Source Intelligence Directory
        if db.query(SourceIntelligence).count() == 0:
            sources_data = [
                {"domain": "reuters.com", "name": "Reuters", "category": "International Wire", "country": "Global", "reliability_score": 96.5, "https_valid": True, "domain_age_years": 29, "bias_rating": "Least Biased / Factual", "verified": True, "total_analyzed": 1420, "spam_ratio": 0.01, "description": "Primary international wire agency known for factual, neutral reporting and rigorous attribution."},
                {"domain": "apnews.com", "name": "Associated Press", "category": "News Agency", "country": "United States", "reliability_score": 95.8, "https_valid": True, "domain_age_years": 31, "bias_rating": "Neutral / Wire Service", "verified": True, "total_analyzed": 1280, "spam_ratio": 0.01, "description": "Global news organization dedicated to non-profit journalism and objective factual reporting."},
                {"domain": "bbc.com", "name": "BBC News", "category": "Public Broadcaster", "country": "United Kingdom", "reliability_score": 93.4, "https_valid": True, "domain_age_years": 30, "bias_rating": "Center / Low Bias", "verified": True, "total_analyzed": 980, "spam_ratio": 0.02, "description": "British public service broadcaster with high editorial standards and international bureau network."},
                {"domain": "theguardian.com", "name": "The Guardian", "category": "News & Analysis", "country": "United Kingdom", "reliability_score": 89.2, "https_valid": True, "domain_age_years": 26, "bias_rating": "Center-Left / High Factual", "verified": True, "total_analyzed": 810, "spam_ratio": 0.03, "description": "Independent daily newspaper funded by Scott Trust, specializing in investigative reporting."},
                {"domain": "techcrunch.com", "name": "TechCrunch", "category": "Technology Media", "country": "United States", "reliability_score": 88.5, "https_valid": True, "domain_age_years": 20, "bias_rating": "Neutral / Tech", "verified": True, "total_analyzed": 640, "spam_ratio": 0.04, "description": "Technology journalism outlet covering startups, venture funding, and digital products."},
                {"domain": "nature.com", "name": "Nature Journal", "category": "Scientific Journal", "country": "United Kingdom", "reliability_score": 99.1, "https_valid": True, "domain_age_years": 32, "bias_rating": "Scientific / Peer-Reviewed", "verified": True, "total_analyzed": 420, "spam_ratio": 0.0, "description": "World-leading multidisciplinary scientific journal with strict peer-review criteria."},
                {"domain": "dailyviralbuzz.xyz", "name": "Daily Viral Buzz", "category": "Aggregator / Blog", "country": "Unknown", "reliability_score": 22.0, "https_valid": False, "domain_age_years": 1, "bias_rating": "Clickbait / Sensational", "verified": False, "total_analyzed": 210, "spam_ratio": 0.92, "description": "Flagged domain using deceptive clickbait headlines and non-existent author attribution."},
                {"domain": "healthmiraclenow.top", "name": "Health Miracle Now", "category": "Health Tabloid", "country": "Unknown", "reliability_score": 14.5, "https_valid": False, "domain_age_years": 1, "bias_rating": "Misleading / Unverified Claims", "verified": False, "total_analyzed": 180, "spam_ratio": 0.98, "description": "High-risk domain distributing unverified medical claims and supplement sales funnels."}
            ]

            for s in sources_data:
                db.add(SourceIntelligence(**s))
            db.commit()
            print("[OK] Seeded source intelligence directory")

        # 3. Seed Sample Analyses if table is empty
        if db.query(AnalysisResult).count() == 0:
            samples = [
                {
                    "title": "Global Fusion Energy Project Reaches Sustained Plasma Confinement Milestone",
                    "content": "Physicists at the International Thermonuclear Experimental Reactor announced a sustained high-density plasma confinement exceeding 400 seconds. According to Dr. Marcus Aris, chief research scientist at the facility, independent verification from peer laboratories in Grenoble and Oak Ridge National Laboratory confirmed net energy stability. The published data in Nuclear Energy Research outlines thermal yields exceeding earlier computational models by 14%.",
                    "url": "https://www.nature.com/articles/fusion-energy-milestone-2026",
                    "category": "Science",
                    "language": "English"
                },
                {
                    "title": "SHOCKING TRUTH: Doctors BANNED This Secret Herb That Cures Everything in 48 Hours!",
                    "content": "You won't believe what Big Pharma is desperately hiding from the public! 100% of all disease is caused by this one secret toxin, and doctors are furious that this miraculous mountain root completely cures every ailment in just two days. Act now before this post gets deleted by authorities! Millions are waking up to this ancient mystery that the elite don't want you to know!",
                    "url": "https://healthmiraclenow.top/shocking-cure-banned",
                    "category": "Health",
                    "language": "English"
                },
                {
                    "title": "Global Central Banks Announce Coordinated Liquidity Protocol to Bolster Cross-Border Settlement",
                    "content": "In a joint communiqué released this morning, the European Central Bank and the Federal Reserve outlined an enhanced bilateral currency swap arrangement designed to ensure smooth liquidity operations. The initiative comes following quarterly financial stability reviews and aims to mitigate foreign exchange friction across transatlantic commercial credit corridors.",
                    "url": "https://www.reuters.com/markets/central-banks-liquidity-protocol-2026",
                    "category": "Business",
                    "language": "English"
                },
                {
                    "title": "BREAKING: Mysterious Flying Object Lands Near Capital City, Insiders Claim Government Cover-Up",
                    "content": "People are saying a bizarre craft was spotted hovering over downtown last night! Secret sources say top officials are secretly evacuating key facilities while denying all reports. Is this the end of civilization as we know it?! Share this urgently before mainstream news censors the undeniable evidence!",
                    "url": "https://dailyviralbuzz.xyz/breaking-ufo-coverup",
                    "category": "World",
                    "language": "English"
                }
            ]

            for sample in samples:
                ai_res = TruthLensAIEngine.run_analysis(
                    text=sample["content"],
                    headline=sample["title"],
                    url=sample["url"],
                    category=sample["category"],
                    language=sample["language"]
                )
                
                article = NewsArticle(
                    title=ai_res["title"],
                    content=ai_res["content"],
                    url=ai_res["url"],
                    source_domain=ai_res["source_domain"],
                    author=ai_res["author"],
                    published_date=ai_res["published_date"],
                    language=ai_res["language"],
                    category=ai_res["category"],
                    input_type=ai_res["input_type"]
                )
                db.add(article)
                db.commit()
                db.refresh(article)

                analysis = AnalysisResult(
                    article_id=article.id,
                    user_id=1,
                    classification=ai_res["classification"],
                    credibility_score=ai_res["credibility_score"],
                    confidence=ai_res["confidence"],
                    risk_level=ai_res["risk_level"],
                    sensationalism_score=ai_res["sensationalism_score"],
                    clickbait_probability=ai_res["clickbait_probability"],
                    source_reliability=ai_res["source_reliability"],
                    claim_consistency=ai_res["claim_consistency"],
                    summary=ai_res["summary"],
                    reasons=ai_res["reasons"],
                    concerns=ai_res["concerns"],
                    signals=ai_res["signals"],
                    claims=ai_res["claims"],
                    model_metadata=ai_res["model_metadata"]
                )
                db.add(analysis)
                db.commit()
            print("[OK] Seeded sample analysis articles")

    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
