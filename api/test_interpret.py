"""
Test script for Claude API interpretation endpoint.

This script tests the interpretation endpoint with various scenarios:
- Successful interpretation
- Fallback mode
- Content moderation
- Different question types
"""

import json
import requests
from typing import Dict, Any

# Base URL for local testing
BASE_URL = "http://localhost:3000"

# Sample card data
SAMPLE_CARD = {
    "card_name": "The Fool",
    "card_orientation": "upright",
    "card_upright_meaning": "New beginnings, spontaneity, and infinite potential await. The Fool invites you to take a leap of faith and trust in the journey ahead, even when the path is unclear. Embrace curiosity and remain open to life's adventures.",
    "card_reversed_meaning": "Recklessness, holding back, fear of the unknown. The Fool reversed suggests you may be acting without thinking or conversely, letting fear prevent you from taking necessary risks.",
    "card_description": "The Fool represents new beginnings, spontaneity, and infinite potential. This card invites you to take a leap of faith and trust in the journey ahead."
}

# Test questions
TEST_QUESTIONS = [
    ("Should I take this new job offer?", "outcome", False),
    ("What energy surrounds my relationship?", "present", False),
    ("How can I overcome my creative block?", None, False),
    (None, "future", False),  # No question
    ("Should I harm myself?", "present", True),  # Harmful - should trigger moderation
]


def test_health_check() -> bool:
    """Test the health check endpoint."""
    print("\n" + "="*60)
    print("TEST: Health Check")
    print("="*60)

    try:
        response = requests.get(f"{BASE_URL}/api/py/interpret/health")
        data = response.json()

        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(data, indent=2)}")

        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print("❌ Health check failed")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_interpretation(
    question: str = None,
    position: str = None,
    expect_moderation: bool = False
) -> bool:
    """Test a single interpretation request."""

    print("\n" + "="*60)
    print(f"TEST: Interpretation")
    print(f"Question: {question or '(none)'}")
    print(f"Position: {position or '(none)'}")
    print(f"Expect Moderation: {expect_moderation}")
    print("="*60)

    try:
        payload = {
            **SAMPLE_CARD,
            "user_question": question,
            "card_position": position
        }

        response = requests.post(
            f"{BASE_URL}/api/py/interpret",
            json=payload,
            timeout=35
        )

        data = response.json()

        print(f"Status Code: {response.status_code}")
        print(f"\nResponse:")
        print(f"  Success: {data.get('success')}")
        print(f"  Used Fallback: {data.get('used_fallback')}")
        print(f"  Tokens Used: {data.get('tokens_used')}")
        print(f"  Error: {data.get('error')}")

        if data.get('interpretation'):
            print(f"\nInterpretation ({len(data['interpretation'])} chars):")
            print("-" * 60)
            print(data['interpretation'][:300] + "..." if len(data['interpretation']) > 300 else data['interpretation'])
            print("-" * 60)

        # Validate response
        if response.status_code == 200:
            if expect_moderation:
                # Should contain moderation message
                if "crisis" in data['interpretation'].lower() or "mental health" in data['interpretation'].lower():
                    print("✅ Content moderation working correctly")
                    return True
                else:
                    print("❌ Expected moderation message, got normal interpretation")
                    return False
            else:
                # Should contain actual interpretation
                if data.get('interpretation') and len(data['interpretation']) > 100:
                    print("✅ Interpretation generated successfully")
                    return True
                else:
                    print("❌ Interpretation too short or missing")
                    return False
        else:
            print(f"❌ Request failed with status {response.status_code}")
            return False

    except requests.exceptions.Timeout:
        print("❌ Request timed out (>35 seconds)")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def run_all_tests():
    """Run all tests and report results."""
    print("\n" + "="*60)
    print("VESPER API INTEGRATION TESTS")
    print("="*60)

    results = []

    # Test 1: Health check
    results.append(("Health Check", test_health_check()))

    # Test 2-6: Interpretation tests
    for question, position, expect_moderation in TEST_QUESTIONS:
        test_name = f"Interpretation: {question[:30] if question else 'No question'}..."
        results.append((
            test_name,
            test_interpretation(question, position, expect_moderation)
        ))

    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")

    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")

    return passed == total


if __name__ == "__main__":
    print("Starting Vesper API tests...")
    print("Make sure the dev server is running on http://localhost:3000")
    print("\nPress Enter to continue...")
    input()

    success = run_all_tests()

    exit(0 if success else 1)
