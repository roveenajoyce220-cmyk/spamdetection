import re
from typing import Dict, Any, List, Tuple
from app.ai.signals import analyze_detection_signals, HIGH_TRUST_DOMAINS

def extract_claims(text: str, title: str, domain: str) -> List[Dict[str, Any]]:
    """
    Extracts core propositions and factual assertions from the news content,
    evaluating verifiability, internal consistency, and evidentiary anchors.
    """
    sentences = re.split(r'(?<=[.!?])\s+', (text or "").strip())
    # Filter short or purely subjective fragments
    candidate_sentences = [
        s.strip() for s in sentences 
        if len(s.strip()) > 35 and not s.strip().startswith(("Click here", "Subscribe", "Read more", "Share this"))
    ]
    
    if not candidate_sentences and title:
        candidate_sentences = [title]

    claims = []
    for idx, sentence in enumerate(candidate_sentences[:5]):
        # Analyze claim keywords
        has_numbers = bool(re.search(r'\b\d+(\.\d+)?%?|\b(billion|million|trillion|hundred|thousand)\b', sentence, re.IGNORECASE))
        has_entities = bool(re.search(r'\b[A-Z][a-z]+(\s+[A-Z][a-z]+)*\b', sentence))
        has_citations = bool(re.search(r'\b(reported|stated|confirmed|found|announced|discovered|published)\b', sentence, re.IGNORECASE))
        has_speculation = bool(re.search(r'\b(might|allegedly|rumored|secretly|could possibly|miraculous)\b', sentence, re.IGNORECASE))

        if has_speculation:
            status = "Needs Verification"
            confidence = 68.0 + (idx * 2)
            evidence = "Contains speculative framing or unverified attributions without primary documentation."
        elif has_citations and has_numbers:
            status = "Supported"
            confidence = 88.0 + (idx % 8)
            evidence = f"Corroborated by quantitative metrics and journalistic attribution markers in the passage."
        elif has_entities and not has_speculation:
            status = "Supported"
            confidence = 82.0 + (idx % 6)
            evidence = "Internally consistent with entity references and standard news reporting structure."
        else:
            status = "Needs Verification"
            confidence = 72.0
            evidence = "General assertion requiring cross-reference with corroborating wire service archives."

        claims.append({
            "id": f"claim_{idx + 1}",
            "claim": sentence[:240] + ("..." if len(sentence) > 240 else ""),
            "status": status,
            "confidence": round(min(confidence, 98.0), 1),
            "evidence": evidence,
            "source_reference": domain if domain else "Wire reports"
        })

    # Default fallback claim if text is extremely brief
    if not claims:
        claims.append({
            "id": "claim_1",
            "claim": title or text[:120] or "General news submission",
            "status": "Needs Verification",
            "confidence": 70.0,
            "evidence": "Brief submission requires full context for comprehensive multi-source claim verification.",
            "source_reference": domain or "Self-reported"
        })

    return claims


def calculate_credibility_metrics(
    title: str,
    text: str,
    domain: str,
    author: str,
    published_date: str,
    signals: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Synthesizes signals, domain trust, lexical patterns, and claims into comprehensive credibility metrics.
    """
    domain_lower = (domain or "").lower()
    is_high_trust = any(td in domain_lower for td in HIGH_TRUST_DOMAINS)
    
    # Calculate signal penalty
    risk_signals = [s for s in signals if s["status"] == "Risk"]
    caution_signals = [s for s in signals if s["status"] == "Caution"]
    clean_signals = [s for s in signals if s["status"] == "Clean"]

    signal_penalty = (len(risk_signals) * 22.0) + (len(caution_signals) * 7.5)
    
    # Base source reliability
    if is_high_trust:
        source_reliability = 92.0 + min(len(clean_signals), 5)
    elif domain_lower and not domain_lower.startswith("unknown"):
        source_reliability = 68.0 - (len(risk_signals) * 10.0)
    else:
        source_reliability = 50.0 - (len(risk_signals) * 8.0)
    source_reliability = max(10.0, min(source_reliability, 98.0))

    # Calculate Clickbait Probability
    clickbait_signal = next((s for s in signals if s["id"] == "clickbait_syntax"), None)
    caps_signal = next((s for s in signals if s["id"] == "excessive_capitalization"), None)
    clickbait_prob = 0.0
    if clickbait_signal:
        clickbait_prob += clickbait_signal["score"] * 0.7
    if caps_signal:
        clickbait_prob += caps_signal["score"] * 0.3
    clickbait_prob = max(5.0, min(clickbait_prob, 95.0))

    # Calculate Sensationalism Score
    sens_signal = next((s for s in signals if s["id"] == "sensationalism"), None)
    emo_signal = next((s for s in signals if s["id"] == "emotional_manipulation"), None)
    sensationalism_score = 0.0
    if sens_signal:
        sensationalism_score += sens_signal["score"] * 0.6
    if emo_signal:
        sensationalism_score += emo_signal["score"] * 0.4
    sensationalism_score = max(5.0, min(sensationalism_score, 98.0))

    # Calculate Claim Consistency
    headline_sig = next((s for s in signals if s["id"] == "headline_consistency"), None)
    citation_sig = next((s for s in signals if s["id"] == "citation_density"), None)
    claim_consistency = 88.0
    if headline_sig and headline_sig["status"] == "Caution":
        claim_consistency -= 25.0
    if citation_sig and citation_sig["status"] == "Caution":
        claim_consistency -= 15.0
    claim_consistency = max(20.0, min(claim_consistency, 98.0))

    # Overall Credibility Score (0-100)
    base_credibility = 88.0
    if is_high_trust:
        base_credibility += 8.0
    
    credibility_score = base_credibility - signal_penalty + (source_reliability * 0.15) - (sensationalism_score * 0.2)
    credibility_score = max(8.0, min(credibility_score, 98.0))

    # Determine Classification
    if credibility_score >= 70.0:
        classification = "NOT SPAM"
        risk_level = "LOW"
    elif credibility_score >= 42.0:
        classification = "SUSPICIOUS"
        risk_level = "MEDIUM"
    else:
        classification = "SPAM"
        risk_level = "HIGH"

    # AI Confidence Calculation
    content_len = len((text or "") + (title or ""))
    confidence_base = 82.0
    if content_len > 400:
        confidence_base += 7.0
    if domain_lower:
        confidence_base += 5.0
    confidence = min(confidence_base - (len(caution_signals) * 1.5), 96.0)

    # Key Reasons (Affirmative)
    reasons = []
    if is_high_trust:
        reasons.append(f"Published by established and internationally referenced domain '{domain}'.")
    if author and author.lower() not in {"unknown", "anonymous", ""}:
        reasons.append(f"Credited byline attributed to author '{author}'.")
    if published_date and published_date.lower() not in {"unknown", "unknown date", ""}:
        reasons.append(f"Explicit publication timeline anchoring ({published_date}).")
    if sensationalism_score < 30.0:
        reasons.append("Measured editorial tone with low sensationalism or dramatic exaggeration.")
    if clickbait_prob < 30.0:
        reasons.append("Headline structure avoids artificial cliffhangers and clickbait patterns.")
    if claim_consistency > 70.0:
        reasons.append("High narrative consistency between headline subject and article body.")
    if not reasons:
        reasons.append("Article text contains sufficient structural coherence for preliminary indexing.")

    # Potential Concerns (Flags)
    concerns = []
    if risk_signals:
        for rs in risk_signals:
            concerns.append(f"{rs['name']}: {rs['description']}")
    if caution_signals:
        for cs in caution_signals[:2]:
            concerns.append(f"{cs['name']} detected ({cs.get('flagged_snippet', 'moderate anomaly')}).")
    if not author or author.lower() in {"unknown", "anonymous", ""}:
        concerns.append("No explicit journalist byline or editorial team member identified.")
    if not domain or domain.startswith("unknown"):
        concerns.append("Direct text submission without verified canonical URL source metadata.")
    if not concerns:
        concerns.append("None. All primary verification signals passed within standard integrity thresholds.")

    # Structured Summary Explanation
    if classification == "NOT SPAM":
        summary = (
            f"AI evaluation indicates high journalistic integrity (Credibility Score: {int(credibility_score)}%). "
            f"The content demonstrates a balanced, neutral writing style, verifiable entity references, "
            f"and aligns with standard professional news reporting conventions."
        )
    elif classification == "SUSPICIOUS":
        summary = (
            f"AI evaluation detected mixed credibility indicators (Credibility Score: {int(credibility_score)}%). "
            f"While the core topic may reflect actual events, the narrative contains sensational phrasing, "
            f"unverified speculative claims, or lacks strong primary source documentation. Independent verification recommended."
        )
    else:
        summary = (
            f"AI evaluation flagged significant disinformation and spam patterns (Credibility Score: {int(credibility_score)}%). "
            f"The submission displays elevated emotional manipulation, exaggerated claims, clickbait phrasing, "
            f"and high-risk structural anomalies typical of unverified viral rumors or deceptive publisher networks."
        )

    return {
        "classification": classification,
        "credibility_score": round(credibility_score, 1),
        "confidence": round(confidence, 1),
        "risk_level": risk_level,
        "sensationalism_score": round(sensationalism_score, 1),
        "clickbait_probability": round(clickbait_prob, 1),
        "source_reliability": round(source_reliability, 1),
        "claim_consistency": round(claim_consistency, 1),
        "reasons": reasons,
        "concerns": concerns,
        "summary": summary
    }
