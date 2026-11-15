from decimal import Decimal
import re
from typing import Optional, List, Dict, Any
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from models.products_model import Product
from models.utils import ProductStatus


# Common electronics synonyms and spec keywords.
KEYWORD_MAPPINGS = {
    "phone": ["smartphone", "mobile", "iphone", "android", "galaxy", "phones"],
    "laptop": ["notebook", "macbook", "pc", "computer", "thinkpad", "ultrabook", "laptops"],
    "audio": [
        "headphone", "headphones", "earphone", "earphones", "earbud", "earbuds",
        "speaker", "speakers", "bluetooth", "sound",
    ],
    "gaming": ["gpu", "rgb", "console", "playstation", "xbox", "controller", "game"],
    "screen": ["monitor", "display", "tv", "4k", "oled", "screens"],
    "accessory": ["charger", "cable", "case", "adapter", "powerbank", "accessories"],
}

_SEARCH_STOP_WORDS = {
    "a", "an", "and", "are", "best", "for", "from", "get", "i", "in", "is",
    "it", "looking", "me", "of", "on", "or", "please", "recommend", "show",
    "some", "the", "to", "want", "what", "with",
}


def _query_terms(query: str) -> set[str]:
    """Return meaningful shopping terms without filler, currency, or budget numbers."""
    return {
        term for term in re.findall(r"[a-z]+", query.lower())
        if len(term) > 1 and term not in _SEARCH_STOP_WORDS
    }


def _expanded_terms(query: str) -> set[str]:
    terms = _query_terms(query)
    expanded = set(terms)
    for category, synonyms in KEYWORD_MAPPINGS.items():
        group = {category, *synonyms}
        if terms.intersection(group):
            expanded.update(group)
    return expanded

# Parse only explicit upper-bound language. Approximate phrases such as "around
# 1000" are intentionally not treated as hard spending limits.
_MAX_BUDGET_PATTERN = re.compile(
    r"\b(?:under|below|less than|up to|maximum|max(?:imum)?(?: budget)?(?: of)?|"
    r"budget(?: of)?)\s*[:=]?\s*[$€£]?\s*([\d,]+(?:\.\d{1,2})?)",
    re.IGNORECASE,
)


def _extract_max_budget(query: str) -> Optional[Decimal]:
    match = _MAX_BUDGET_PATTERN.search(query)
    if not match:
        return None
    try:
        return Decimal(match.group(1).replace(",", ""))
    except Exception:
        return None


def get_electronics_recommendations(
    session: Session,
    query: str,
    max_budget: Optional[Decimal] = None,
    preferred_category: Optional[str] = None,
) -> Dict[str, Any]:
    # Explicit API filters take precedence; otherwise honor a stated upper
    # budget found in the shopper's natural-language request.
    effective_budget = max_budget if max_budget is not None else _extract_max_budget(query)
    statement = (
        select(Product)
        .join(Product.product_status_record)
        .where(ProductStatus.name == "AVAILABLE", Product.quantity > 0)
    )
    if effective_budget is not None:
        statement = statement.where(Product.price <= effective_budget)

    all_products = list(session.scalars(statement).all())
    expanded_terms = _expanded_terms(query)
    if preferred_category:
        expanded_terms.update(_expanded_terms(preferred_category))
        expanded_terms.update(_query_terms(preferred_category))

    scored_products = []
    for product in all_products:
        product_terms = _query_terms(f"{product.name} {product.description or ''}")
        matched_terms = expanded_terms.intersection(product_terms)
        if not matched_terms:
            continue
        score = len(matched_terms)
        if query.strip().lower() in f"{product.name} {product.description or ''}".lower():
            score += 3
        scored_products.append((score, product))

    scored_products.sort(
        key=lambda item: (-item[0], Decimal(str(item[1].price)), item[1].id)
    )
    recommended = [product for _, product in scored_products[:5]]

    advice = (
        f"Based on your requirements for '{query}'"
        + (f" with a maximum budget of {effective_budget}" if effective_budget is not None else "")
        + (
            f", we matched {len(recommended)} available electronics option(s)."
            if recommended
            else ", no matching available products were found. Try another product type, "
                 "feature, or budget."
        )
    )
    return {
        "query": query,
        "ai_advice": advice,
        "recommendations": recommended,
    }


def smart_search_electronics(session: Session, query: str) -> Dict[str, Any]:
    expanded_terms = _expanded_terms(query)
    if not expanded_terms:
        return {"query": query, "total_matches": 0, "matches": []}
    statement = (
        select(Product)
        .join(Product.product_status_record)
        .where(ProductStatus.name == "AVAILABLE", Product.quantity > 0)
    )

    clauses = []
    for term in expanded_terms:
        term_filter = f"%{term}%"
        clauses.extend([Product.name.ilike(term_filter), Product.description.ilike(term_filter)])

    if clauses:
        statement = statement.where(or_(*clauses))

    matches = list(session.scalars(statement.order_by(Product.name.asc(), Product.id.asc())).all())
    return {
        "query": query,
        "total_matches": len(matches),
        "matches": matches,
    }
