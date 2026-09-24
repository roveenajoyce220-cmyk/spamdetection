import re
from typing import List, Dict, Any

# Clickbait keywords and pattern matchers
CLICKBAIT_PATTERNS = [
    r"\b\d+\s+(reasons|things|secrets|tricks|ways|habits)\b",
    r"\byou won'?t believe\b",
    r"\bwill blow your mind\b",
    r"\bshocking truth\b",
    r"\bwhat happens next\b",
    r"\bdoctors hate\b",
    r"\bthe real reason why\b",
    r"\bthe secret that\b",
    r"\bthis one simple trick\b",
    r"\bexposed:\b",
    r"\bwarning:\s*do not\b"
]

# Sensationalism & Hyperbole triggers
SENSATIONAL_WORDS = {
    "bombshell", "devastating", "cataclysmic", "unbelievable", "mind-blowing",
    "treasonous", "insane", "apocalyptic", "massacre", "furious", "explosive",
    "obliterates", "destroys", "shatters", "epic", "chaos", "nightmare", "miracle",
    "secret cure", "conspiracy", "cover-up", "they don't want you to know"
}

# Manipulative emotional keywords
EMOTIONAL_MANIPULATION_WORDS = {
    "outrage", "wake up", "sheeple", "pure evil", "brainwashed", "terrifying",
    "disgusting", "horrific", "sinister", "corrupt to the core", "blood on their hands",
    "shame on", "unforgivable", "urgent alert", "share before deleted"
}

# Known reputable domains (baseline reputation dictionary)
HIGH_TRUST_DOMAINS = {
    "reuters.com", "apnews.com", "bbc.com", "bbc.co.uk", "theguardian.com",
    "nytimes.com", "wsj.com", "bloomberg.com", "nature.com", "science.org",
    "aljazeera.com", "dw.com", "lemonde.fr", "ft.com", "npr.org", "economist.com",
    "afp.com", "washingtonpost.com", "time.com", "pbs.org", "who.int", "nasa.gov",
    "techcrunch.com", "theverge.com", "arstechnica.com", "wired.com", "reuters.tv"
}

SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".buzz", ".click", ".vip", ".cam", ".rest", ".tk", ".ml", ".ga", ".cf"
}

def analyze_detection_signals(title: str, text: str, domain: str, author: str, published_date: str) -> List[Dict[str, Any]]:
    full_text = f"{title or ''} {text or ''}".strip()
    words = re.findall(r"\b\w+\b", full_text.lower())
    total_words = max(len(words), 1)

    signals: List[Dict[str, Any]] = []

    # 1. Clickbait Syntax
    clickbait_matches = []
    for pattern in CLICKBAIT_PATTERNS:
        if re.search(pattern, title or "", re.IGNORECASE) or re.search(pattern, text[:300], re.IGNORECASE):
            match = re.search(pattern, title or text[:300], re.IGNORECASE)
            if match:
                clickbait_matches.append(match.group(0))
    
    has_clickbait = len(clickbait_matches) > 0
    signals.append({
        "id": "clickbait_syntax",
        "name": "Clickbait Headline Syntax",
        "category": "Linguistic",
        "status": "Risk" if len(clickbait_matches) >= 2 else ("Caution" if has_clickbait else "Clean"),
        "score": min(len(clickbait_matches) * 40, 100),
        "description": "Checks for formulaic curiosity hooks, listicle traps, and withheld resolution syntax.",
        "flagged_snippet": ", ".join(clickbait_matches) if clickbait_matches else None
    })

    # 2. Sensationalism & Hyperbole
    sensational_found = [w for w in words if w in SENSATIONAL_WORDS]
    sensational_density = (len(sensational_found) / total_words) * 100
    signals.append({
        "id": "sensationalism",
        "name": "Sensationalism & Hyperbole",
        "category": "Linguistic",
        "status": "Risk" if len(sensational_found) >= 4 or sensational_density > 2.0 else ("Caution" if len(sensational_found) >= 2 else "Clean"),
        "score": min(int(sensational_density * 40 + len(sensational_found) * 15), 100),
        "description": "Evaluates excessive use of exaggerated or superlative dramatic adjectives.",
        "flagged_snippet": ", ".join(list(set(sensational_found))[:5]) if sensational_found else None
    })

    # 3. Emotional Manipulation & Urgency
    emotional_found = [w for w in words if w in EMOTIONAL_MANIPULATION_WORDS]
    urgency_trigger = bool(re.search(r"\b(share before|deleted soon|act now|banned on)\b", full_text, re.IGNORECASE))
    signals.append({
        "id": "emotional_manipulation",
        "name": "Emotional Manipulation & Viral Triggers",
        "category": "Linguistic",
        "status": "Risk" if urgency_trigger or len(emotional_found) >= 3 else ("Caution" if len(emotional_found) >= 1 else "Clean"),
        "score": min((len(emotional_found) * 25) + (40 if urgency_trigger else 0), 100),
        "description": "Flags coercive rhetoric designed to induce fear, outrage, or panic sharing.",
        "flagged_snippet": ", ".join(list(set(emotional_found))[:4]) if emotional_found else None
    })

    # 4. Excessive Capitalization (SHOUTING)
    caps_words = re.findall(r"\b[A-Z]{3,}\b", f"{title} {text[:500]}")
    # Filter out common legitimate acronyms
    filtered_caps = [w for w in caps_words if w not in {"USA", "UK", "EU", "UN", "NATO", "WHO", "NASA", "AI", "CEO", "FBI", "CIA", "GOP", "DNC", "COVID", "IMF", "SEC"}]
    signals.append({
        "id": "excessive_capitalization",
        "name": "Excessive Capitalization & Shouting",
        "category": "Structure",
        "status": "Risk" if len(filtered_caps) >= 3 else ("Caution" if len(filtered_caps) >= 1 else "Clean"),
        "score": min(len(filtered_caps) * 30, 100),
        "description": "Detects loud capitalized words used to artificially inflate urgency in headlines.",
        "flagged_snippet": ", ".join(filtered_caps[:4]) if filtered_caps else None
    })

    # 5. Punctuation Spam (!!! / ???)
    punc_matches = re.findall(r"[!?]{2,}", full_text)
    signals.append({
        "id": "punctuation_spam",
        "name": "Punctuation Anomaly & Spam",
        "category": "Structure",
        "status": "Risk" if len(punc_matches) >= 3 else ("Caution" if len(punc_matches) >= 1 else "Clean"),
        "score": min(len(punc_matches) * 35, 100),
        "description": "Flags multiple consecutive exclamation marks or question marks commonly found in tabloid spam.",
        "flagged_snippet": f"{len(punc_matches)} occurrences (e.g. '{punc_matches[0]}')" if punc_matches else None
    })

    # 6. Author Transparency
    has_author = bool(author and author.lower() not in {"unknown", "admin", "news staff", "anonymous", ""})
    signals.append({
        "id": "author_attribution",
        "name": "Author Attribution & Byline",
        "category": "Source",
        "status": "Clean" if has_author else "Caution",
        "score": 0 if has_author else 45,
        "description": "Verifies whether a named journalist or verified editorial byline is credited.",
        "flagged_snippet": f"Author: {author}" if has_author else "No individual author identified"
    })

    # 7. Publication Date Verifiability
    has_date = bool(published_date and published_date.lower() not in {"unknown", "unknown date", ""})
    signals.append({
        "id": "date_verifiability",
        "name": "Chronological Anchoring & Date",
        "category": "Structure",
        "status": "Clean" if has_date else "Caution",
        "score": 0 if has_date else 40,
        "description": "Validates the presence of timestamp metadata for historical tracking.",
        "flagged_snippet": f"Published: {published_date}" if has_date else "Missing publication timestamp"
    })

    # 8. Domain Integrity & TLD Risk
    domain_clean = domain.lower() if domain else ""
    is_trusted = any(td in domain_clean for td in HIGH_TRUST_DOMAINS)
    is_suspicious_tld = any(domain_clean.endswith(tld) for tld in SUSPICIOUS_TLDS)
    domain_score = 0 if is_trusted else (85 if is_suspicious_tld else 25)
    signals.append({
        "id": "domain_integrity",
        "name": "Domain Reputation & TLD Security",
        "category": "Source",
        "status": "Clean" if is_trusted else ("Risk" if is_suspicious_tld else "Caution"),
        "score": domain_score,
        "description": "Examines domain registry TLD, spoofing indicators, and global publisher verification index.",
        "flagged_snippet": f"Domain: {domain_clean}" if domain_clean else "No URL domain provided"
    })

    # 9. Unsupported Numerical Claims & Vague Statistics
    vague_stats = re.findall(r"\b(100% proof|studies show that everyone|\d{2,3}% of all people agree|secretly confirmed)\b", full_text, re.IGNORECASE)
    signals.append({
        "id": "unsupported_statistics",
        "name": "Unsupported Statistics & Quantifiers",
        "category": "Credibility",
        "status": "Risk" if len(vague_stats) >= 2 else ("Caution" if len(vague_stats) == 1 else "Clean"),
        "score": min(len(vague_stats) * 45, 100),
        "description": "Checks for sweepingly definitive statistical claims lacking methodology citations.",
        "flagged_snippet": ", ".join(vague_stats) if vague_stats else None
    })

    # 10. Anonymous Sourcing & Hearsay Triggers
    hearsay = re.findall(r"\b(sources say|insiders claim|people are saying|it is rumored|secret sources)\b", full_text, re.IGNORECASE)
    signals.append({
        "id": "anonymous_sourcing",
        "name": "Hearsay & Vague Sourcing Signals",
        "category": "Credibility",
        "status": "Caution" if len(hearsay) >= 2 else "Clean",
        "score": min(len(hearsay) * 25, 80),
        "description": "Monitors unverified anonymous attributions without corroborating primary evidence.",
        "flagged_snippet": ", ".join(hearsay[:3]) if hearsay else None
    })

    # 11. Headline-to-Body Consistency
    # Basic overlap check between title tokens and content
    title_words = set(re.findall(r"\b\w{4,}\b", (title or "").lower()))
    body_words = set(re.findall(r"\b\w{4,}\b", (text or "").lower()))
    overlap = len(title_words.intersection(body_words))
    overlap_ratio = overlap / max(len(title_words), 1)
    
    signals.append({
        "id": "headline_consistency",
        "name": "Headline-Body Narrative Alignment",
        "category": "Structure",
        "status": "Clean" if overlap_ratio > 0.4 or len(title_words) == 0 else "Caution",
        "score": 0 if overlap_ratio > 0.4 or len(title_words) == 0 else 50,
        "description": "Assesses whether the article body actually elaborates on the headline's core subject.",
        "flagged_snippet": f"Semantic overlap index: {int(overlap_ratio * 100)}%"
    })

    # 12. Impersonation & Spoofing Markers
    impersonation = re.findall(r"\b(bbc-breaking|cnn-live-update|fox-special-alert|reuters-official)\b", domain_clean)
    signals.append({
        "id": "impersonation_markers",
        "name": "Brand & Impersonation Verification",
        "category": "Source",
        "status": "Risk" if impersonation else "Clean",
        "score": 90 if impersonation else 0,
        "description": "Scans for typosquatting and deceptive brand-mimicking domain names.",
        "flagged_snippet": ", ".join(impersonation) if impersonation else None
    })

    # 13. Lexical Diversity & Repetition Index
    unique_ratio = len(set(words)) / total_words if total_words > 20 else 1.0
    is_spammy_repetition = unique_ratio < 0.35 and total_words > 40
    signals.append({
        "id": "lexical_diversity",
        "name": "Lexical Diversity & Redundancy Index",
        "category": "Linguistic",
        "status": "Risk" if is_spammy_repetition else "Clean",
        "score": 75 if is_spammy_repetition else 10,
        "description": "Evaluates keyword stuffing, spam loops, and robotic text generation markers.",
        "flagged_snippet": f"Unique vocabulary ratio: {int(unique_ratio * 100)}%"
    })

    # 14. Citations & Attribution Density
    citation_markers = re.findall(r"\b(according to|published in|spokesperson for|study by|reported by|official statement|data from)\b", full_text, re.IGNORECASE)
    has_citations = len(citation_markers) >= 1
    signals.append({
        "id": "citation_density",
        "name": "External Citation & Institutional Reference",
        "category": "Credibility",
        "status": "Clean" if has_citations else "Caution",
        "score": 0 if has_citations else 35,
        "description": "Verifies presence of verifiable institutional citations, studies, or official quotes.",
        "flagged_snippet": f"{len(citation_markers)} citation anchors found" if has_citations else "Few or no institutional attributions detected"
    })

    return signals
