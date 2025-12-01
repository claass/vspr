"""
Tarot card interpretation endpoint using Claude API.

This module provides the /api/interpret endpoint for generating
AI-powered tarot card interpretations with fallback to static text.
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from api.claude_client import get_claude_client
from api.prompts import (
    create_interpretation_prompt,
    get_fallback_interpretation,
    is_harmful_question
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


class InterpretationRequest(BaseModel):
    """Request model for card interpretation."""
    card_name: str = Field(..., description="Name of the tarot card")
    card_orientation: str = Field(..., description="Card orientation: 'upright' or 'reversed'")
    card_upright_meaning: str = Field(..., description="Traditional upright meaning")
    card_reversed_meaning: str = Field(..., description="Traditional reversed meaning")
    card_description: str = Field(..., description="Basic card description for fallback")
    user_question: Optional[str] = Field(None, description="User's optional question")
    card_position: Optional[str] = Field(None, description="Card position in spread")


class InterpretationResponse(BaseModel):
    """Response model for card interpretation."""
    interpretation: str = Field(..., description="Generated interpretation text")
    success: bool = Field(..., description="Whether API call succeeded")
    used_fallback: bool = Field(..., description="Whether fallback was used")
    error: Optional[str] = Field(None, description="Error message if any")
    tokens_used: int = Field(0, description="Tokens used by API")


@router.post("/api/py/interpret", response_model=InterpretationResponse)
async def interpret_card(request: InterpretationRequest):
    """
    Generate an AI-powered interpretation for a tarot card.

    This endpoint:
    1. Validates the user's question for harmful content
    2. Generates a personalized interpretation using Claude API
    3. Falls back to static interpretation if API fails
    4. Returns interpretation with metadata

    Args:
        request: InterpretationRequest containing card data and optional question

    Returns:
        InterpretationResponse with interpretation text and metadata

    Raises:
        HTTPException: If validation fails or request is inappropriate
    """
    logger.info(f"Interpretation request for: {request.card_name} ({request.card_orientation})")

    # Validate orientation
    if request.card_orientation not in ["upright", "reversed"]:
        raise HTTPException(
            status_code=400,
            detail="card_orientation must be 'upright' or 'reversed'"
        )

    # Content moderation - check for harmful questions
    if request.user_question and is_harmful_question(request.user_question):
        logger.warning(f"Harmful question detected: {request.user_question}")
        return InterpretationResponse(
            interpretation="I'm designed to help with reflection and personal growth. "
                          "If you're experiencing a crisis or need immediate help, "
                          "please reach out to a mental health professional or crisis helpline. "
                          "For tarot guidance, please rephrase your question to focus on "
                          "personal insight and growth.",
            success=False,
            used_fallback=True,
            error="Question contains inappropriate content",
            tokens_used=0
        )

    # Get Claude client
    client = get_claude_client()

    # Create prompt
    prompt = create_interpretation_prompt(
        card_name=request.card_name,
        card_orientation=request.card_orientation,
        card_upright_meaning=request.card_upright_meaning,
        card_reversed_meaning=request.card_reversed_meaning,
        user_question=request.user_question,
        card_position=request.card_position
    )

    # Try to generate interpretation with Claude
    result = client.generate_interpretation(prompt)

    if result["success"] and result["interpretation"]:
        logger.info("Successfully generated interpretation with Claude API")
        return InterpretationResponse(
            interpretation=result["interpretation"],
            success=True,
            used_fallback=False,
            error=None,
            tokens_used=result["tokens_used"]
        )
    else:
        # Fallback to static interpretation
        logger.warning(f"Using fallback interpretation. Error: {result.get('error')}")
        fallback_text = get_fallback_interpretation(
            card_name=request.card_name,
            card_orientation=request.card_orientation,
            card_description=request.card_description,
            user_question=request.user_question
        )

        return InterpretationResponse(
            interpretation=fallback_text,
            success=False,
            used_fallback=True,
            error=result.get("error"),
            tokens_used=0
        )


@router.get("/api/py/interpret/health")
async def health_check():
    """
    Check if the interpretation service is healthy.

    Returns:
        Dict with service status and API client availability
    """
    client = get_claude_client()
    api_available = client.client is not None

    return {
        "status": "healthy",
        "api_available": api_available,
        "usage_stats": client.get_usage_stats()
    }
