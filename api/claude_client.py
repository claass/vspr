"""
Claude API client for Vesper tarot interpretations.

This module provides a wrapper around the Anthropic Claude API with:
- Error handling and retry logic
- Rate limiting and token usage monitoring
- Graceful fallback to static interpretations
"""

import os
import time
import logging
from typing import Optional, Dict, Any
from anthropic import Anthropic, APIError, APITimeoutError, RateLimitError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
MAX_RETRIES = 3
RETRY_DELAY = 1  # seconds
TIMEOUT = 30  # seconds
MAX_TOKENS = 500  # Max tokens per interpretation (~400 target)
MODEL = "claude-sonnet-4-5-20250929"


class ClaudeClient:
    """Client for interacting with Claude API for tarot interpretations."""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Claude API client.

        Args:
            api_key: Anthropic API key. If not provided, reads from ANTHROPIC_API_KEY env var.
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            logger.warning("ANTHROPIC_API_KEY not found. Client will use fallback mode.")
            self.client = None
        else:
            self.client = Anthropic(api_key=self.api_key)

        # Token usage tracking
        self.total_tokens_used = 0
        self.request_count = 0

    def generate_interpretation(
        self,
        prompt: str,
        max_retries: int = MAX_RETRIES,
        timeout: int = TIMEOUT
    ) -> Dict[str, Any]:
        """
        Generate a tarot card interpretation using Claude.

        Args:
            prompt: The formatted prompt for Claude
            max_retries: Number of retry attempts on failure
            timeout: Request timeout in seconds

        Returns:
            Dict with keys:
                - interpretation: The generated text
                - success: Boolean indicating if API call succeeded
                - error: Error message if failed
                - tokens_used: Number of tokens used
        """
        if not self.client:
            return {
                "interpretation": None,
                "success": False,
                "error": "API key not configured",
                "tokens_used": 0
            }

        for attempt in range(max_retries):
            try:
                logger.info(f"Calling Claude API (attempt {attempt + 1}/{max_retries})")

                response = self.client.messages.create(
                    model=MODEL,
                    max_tokens=MAX_TOKENS,
                    timeout=timeout,
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                )

                # Extract interpretation text
                interpretation = response.content[0].text

                # Track usage
                tokens_used = response.usage.input_tokens + response.usage.output_tokens
                self.total_tokens_used += tokens_used
                self.request_count += 1

                logger.info(f"API call successful. Tokens used: {tokens_used}")

                return {
                    "interpretation": interpretation,
                    "success": True,
                    "error": None,
                    "tokens_used": tokens_used
                }

            except RateLimitError as e:
                logger.warning(f"Rate limit hit: {e}")
                if attempt < max_retries - 1:
                    wait_time = RETRY_DELAY * (2 ** attempt)  # Exponential backoff
                    logger.info(f"Waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                else:
                    return {
                        "interpretation": None,
                        "success": False,
                        "error": "Rate limit exceeded. Please try again later.",
                        "tokens_used": 0
                    }

            except APITimeoutError as e:
                logger.warning(f"API timeout: {e}")
                if attempt < max_retries - 1:
                    time.sleep(RETRY_DELAY)
                else:
                    return {
                        "interpretation": None,
                        "success": False,
                        "error": "Request timed out. Please try again.",
                        "tokens_used": 0
                    }

            except APIError as e:
                logger.error(f"API error: {e}")
                return {
                    "interpretation": None,
                    "success": False,
                    "error": f"API error: {str(e)}",
                    "tokens_used": 0
                }

            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                return {
                    "interpretation": None,
                    "success": False,
                    "error": "An unexpected error occurred.",
                    "tokens_used": 0
                }

        return {
            "interpretation": None,
            "success": False,
            "error": "Max retries exceeded.",
            "tokens_used": 0
        }

    def get_usage_stats(self) -> Dict[str, int]:
        """
        Get current API usage statistics.

        Returns:
            Dict with total_tokens_used and request_count
        """
        return {
            "total_tokens_used": self.total_tokens_used,
            "request_count": self.request_count
        }

    def reset_usage_stats(self):
        """Reset usage statistics counters."""
        self.total_tokens_used = 0
        self.request_count = 0


# Global client instance
_client_instance: Optional[ClaudeClient] = None


def get_claude_client() -> ClaudeClient:
    """
    Get or create the global Claude client instance.

    Returns:
        ClaudeClient instance
    """
    global _client_instance
    if _client_instance is None:
        _client_instance = ClaudeClient()
    return _client_instance
