import json
import random
from pathlib import Path
from fastapi import APIRouter, HTTPException

router = APIRouter()

def load_cards():
    """Load cards from the JSON file."""
    cards_file = Path(__file__).parent.parent / "data" / "cards.json"
    try:
        with open(cards_file, "r") as f:
            data = json.load(f)
            return data["cards"]
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Card data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid card data format")

@router.get("/api/py/draw")
def draw_cards():
    """Draw 3 random unique cards from the deck."""
    cards = load_cards()

    if len(cards) < 3:
        raise HTTPException(status_code=500, detail="Not enough cards in deck")

    # Select 3 random unique cards
    selected_cards = random.sample(cards, 3)

    return {"cards": selected_cards}
