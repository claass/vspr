"""
Prompt engineering for Vesper tarot card interpretations.

This module contains prompt templates and content moderation logic
for generating personalized tarot interpretations via Claude API.
"""

import re
from typing import Optional, List

# Harmful content patterns (simple content filter)
HARMFUL_PATTERNS = [
    r'\b(kill|harm|hurt|suicide|self-harm)\b',
    r'\b(illegal|crime|fraud|scam)\b',
    r'\bshould i (cheat|lie|steal)\b',
]

# Position meanings for context
POSITION_CONTEXT = {
    "past": "reflecting on what has shaped your current situation",
    "present": "illuminating your current circumstances and energies",
    "future": "suggesting potential outcomes and energies ahead",
    "outcome": "pointing toward where this path may lead",
    "challenge": "highlighting obstacles or lessons to consider",
    "advice": "offering guidance for moving forward"
}


def is_harmful_question(question: str) -> bool:
    """
    Check if a user question contains harmful or inappropriate content.

    Args:
        question: User's question text

    Returns:
        True if harmful content detected, False otherwise
    """
    if not question:
        return False

    question_lower = question.lower()

    for pattern in HARMFUL_PATTERNS:
        if re.search(pattern, question_lower, re.IGNORECASE):
            return True

    return False


def get_position_context(position: Optional[str]) -> str:
    """
    Get contextual description for a card position.

    Args:
        position: Card position (e.g., "past", "present", "future")

    Returns:
        Contextual description string
    """
    if not position:
        return ""

    position_lower = position.lower()
    return POSITION_CONTEXT.get(position_lower, "")


def create_interpretation_prompt(
    card_name: str,
    card_orientation: str,
    card_upright_meaning: str,
    card_reversed_meaning: str,
    user_question: Optional[str] = None,
    card_position: Optional[str] = None,
) -> str:
    """
    Create a prompt for Claude to generate a tarot card interpretation.

    Args:
        card_name: Name of the card (e.g., "Three of Swords")
        card_orientation: "upright" or "reversed"
        card_upright_meaning: Traditional upright meaning
        card_reversed_meaning: Traditional reversed meaning
        user_question: Optional user question for context
        card_position: Optional position in spread (e.g., "past", "present", "future")

    Returns:
        Formatted prompt string for Claude API
    """
    # Build position context
    position_text = ""
    if card_position:
        position_ctx = get_position_context(card_position)
        if position_ctx:
            position_text = f"Card Position: {card_position.title()} - {position_ctx}"
        else:
            position_text = f"Card Position: {card_position.title()}"

    # Build user question context
    question_text = ""
    if user_question:
        question_text = f"User's Question: {user_question}"
    else:
        question_text = "User's Question: (No specific question - general guidance)"

    # Choose relevant meaning based on orientation
    primary_meaning = card_upright_meaning if card_orientation == "upright" else card_reversed_meaning
    orientation_text = card_orientation.title()

    # Construct the prompt
    prompt = f"""You are Vesper, a thoughtful and insightful tarot guide. Your role is to help people reflect on their lives through tarot symbolism, not to predict the future.

Generate a personalized card interpretation for the following:

Card: {card_name} ({orientation_text})
{question_text}
{position_text}

Traditional Meaning ({orientation_text}): {primary_meaning}

Generate a 2-3 paragraph interpretation that:

1. Acknowledges the user's specific question (if provided) or offers general reflection
2. Weaves the card's symbolism with their situation in a meaningful way
3. Feels personal and conversational, not generic or formulaic
4. Maintains Vesper's voice: insightful, witty, grounded, and compassionate
5. Offers reflection prompts or questions rather than definitive predictions
6. Uses language like "might," "suggests," "invites you to consider," "could indicate"
7. Avoids deterministic or fortune-telling language

Important guidelines:
- This is a tool for self-reflection, not fortune-telling
- Avoid making definitive predictions about the future
- Don't claim supernatural knowledge or certainty
- Focus on empowering the reader to make their own choices
- Keep the tone warm, thoughtful, and slightly mystical but grounded
- Maximum length: 400 tokens (aim for 2-3 substantial paragraphs)

Generate the interpretation now:"""

    return prompt


def get_fallback_interpretation(
    card_name: str,
    card_orientation: str,
    card_description: str,
    user_question: Optional[str] = None
) -> str:
    """
    Generate a fallback interpretation when API is unavailable.

    Args:
        card_name: Name of the card
        card_orientation: "upright" or "reversed"
        card_description: Card's basic description
        user_question: Optional user question

    Returns:
        Static fallback interpretation text
    """
    question_intro = ""
    if user_question:
        question_intro = f"In considering your question, \"{user_question},\" "
    else:
        question_intro = ""

    orientation_text = ""
    if card_orientation == "reversed":
        orientation_text = " (reversed)"

    return f"""{question_intro}The {card_name}{orientation_text} appears in your reading.

{card_description}

This card invites you to reflect on its themes and how they resonate with your current situation. Consider what aspects of this energy are present in your life right now, and how you might work with them constructively.

Remember, tarot is a tool for self-reflection and personal insight, not a prediction of fixed outcomes. Use this reading as a starting point for deeper contemplation."""


# Sample test cases for validation
SAMPLE_QUESTIONS = [
    "Should I take this new job offer?",
    "What energy surrounds my relationship?",
    "How can I overcome my creative block?",
    "What do I need to know about my current path?",
    None,  # No question provided
    "What is blocking me from moving forward?",
    "Should I trust this new opportunity?",
    "How can I find more balance in my life?",
    "What lesson am I meant to learn right now?",
    "Is this the right time to make a change?"
]
