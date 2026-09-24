import re
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional

def extract_domain_from_url(url: str) -> str:
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc or "unknown-domain.com"
    except Exception:
        return "unknown-domain.com"

def scrape_article_from_url(url: str) -> Dict[str, Any]:
    """
    Extracts article content, headline, domain, author, and date from a given URL.
    Includes robust fallback parsing for real-world news formats.
    """
    domain = extract_domain_from_url(url)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=8)
        response.raise_for_status()
        html = response.text
        soup = BeautifulSoup(html, "html.parser")

        # 1. Headline Extraction
        title = None
        # Check OpenGraph title
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            title = og_title["content"].strip()
        elif soup.title and soup.title.string:
            title = soup.title.string.strip()
        elif soup.find("h1"):
            title = soup.find("h1").get_text().strip()

        # 2. Author Extraction
        author = None
        author_meta = soup.find("meta", attrs={"name": re.compile(r"author", re.I)}) or \
                      soup.find("meta", property=re.compile(r"author", re.I))
        if author_meta and author_meta.get("content"):
            author = author_meta["content"].strip()
        else:
            byline = soup.find(class_=re.compile(r"(byline|author|writer)", re.I))
            if byline:
                author = byline.get_text().strip()

        # 3. Date Extraction
        published_date = None
        date_meta = soup.find("meta", property="article:published_time") or \
                    soup.find("meta", attrs={"name": re.compile(r"(date|published)", re.I)})
        if date_meta and date_meta.get("content"):
            published_date = date_meta["content"][:10]

        # 4. Content Extraction
        # Remove scripts, styles, nav, footer, ads
        for unwanted in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
            unwanted.decompose()

        paragraphs = []
        # Target article body if semantic tag exists
        article_tag = soup.find("article") or soup.find(class_=re.compile(r"(article-body|story-content|post-content|entry-content)", re.I))
        target_container = article_tag if article_tag else soup

        for p in target_container.find_all("p"):
            text = p.get_text().strip()
            if len(text) > 30 and not re.search(r"(cookie|subscribe|sign in|all rights reserved)", text, re.I):
                paragraphs.append(text)

        content = "\n\n".join(paragraphs)
        if not content:
            # Fallback to whole text
            content = soup.get_text(separator=" ", strip=True)

        return {
            "success": True,
            "title": title or f"News Report from {domain}",
            "content": content[:8000],  # Safeguard length
            "domain": domain,
            "author": author or "News Staff",
            "published_date": published_date or "Recent",
            "url": url
        }
    except Exception as e:
        # Fallback for unreachable URLs or offline demo tests
        return {
            "success": False,
            "title": f"Article from {domain}",
            "content": f"Failed to retrieve remote article content from {url}. Error: {str(e)}",
            "domain": domain,
            "author": "Unknown Reporter",
            "published_date": "Unknown Date",
            "url": url,
            "error": str(e)
        }
