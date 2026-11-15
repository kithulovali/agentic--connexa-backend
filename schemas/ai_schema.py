from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field
from schemas.product_schema import ProductOut


class AIRecommendationQuery(BaseModel):
    query: str = Field(..., min_length=2, max_length=1000, description="What kind of electronics are you looking for?")
    max_budget: Optional[Decimal] = Field(None, gt=0, description="Maximum budget")
    preferred_category: Optional[str] = Field(None, max_length=80, description="Electronics category (e.g., Laptops, Phones, Audio, Accessories)")


class AIRecommendationResponse(BaseModel):
    query: str
    ai_advice: str
    recommendations: List[ProductOut]


class AISmartSearchResponse(BaseModel):
    query: str
    total_matches: int
    matches: List[ProductOut]
