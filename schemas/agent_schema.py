from typing import Any, Literal
from pydantic import BaseModel, Field


class AgentConversationMessage(BaseModel):
    role: Literal["customer", "store"]
    content: str = Field(..., min_length=1, max_length=4000)


class AgentRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=4000)
    conversation_history: list[AgentConversationMessage] = Field(
        default_factory=list, max_length=8
    )

class AgentResponse(BaseModel):
    agent: str
    answer: str
    model: str
    warning: str | None = None
    data_summary: dict[str, Any]
