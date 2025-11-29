"""
Firebase Cloud Messaging notification endpoints.

This module provides endpoints for:
- Subscribing/unsubscribing to push notifications
- Sending test notifications
- Managing daily reminder schedules
"""

import os
import json
import logging
from typing import Optional, Dict, List
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv

try:
    import firebase_admin
    from firebase_admin import credentials, messaging
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    logging.warning("Firebase Admin SDK not available")

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage for FCM tokens (in production, use a database)
# Format: {"token": {"subscribed_at": datetime, "preferences": {}}}
fcm_tokens: Dict[str, Dict] = {}

# Initialize Firebase Admin SDK
_firebase_initialized = False


def initialize_firebase():
    """Initialize Firebase Admin SDK with credentials."""
    global _firebase_initialized

    if not FIREBASE_AVAILABLE:
        logger.warning("Firebase Admin SDK not available")
        return False

    if _firebase_initialized:
        return True

    try:
        # Check if already initialized
        if firebase_admin._apps:
            _firebase_initialized = True
            return True

        # Load service account credentials
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")

        if service_account_path and os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized with service account")
        else:
            # Try to initialize with environment variables
            firebase_config = {
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }

            if all(firebase_config.values()):
                cred = credentials.Certificate(firebase_config)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK initialized with env variables")
            else:
                logger.warning("Firebase credentials not configured")
                return False

        _firebase_initialized = True
        return True

    except Exception as e:
        logger.error(f"Error initializing Firebase: {e}")
        return False


# Request/Response models
class SubscribeRequest(BaseModel):
    """Request to subscribe to notifications."""
    fcm_token: str = Field(..., description="FCM registration token")
    preferences: Optional[Dict] = Field(default=None, description="Notification preferences")


class UnsubscribeRequest(BaseModel):
    """Request to unsubscribe from notifications."""
    fcm_token: str = Field(..., description="FCM registration token")


class TestNotificationRequest(BaseModel):
    """Request to send a test notification."""
    fcm_token: str = Field(..., description="FCM registration token to send to")
    title: Optional[str] = Field("Test Notification", description="Notification title")
    body: Optional[str] = Field("This is a test notification", description="Notification body")


class NotificationResponse(BaseModel):
    """Standard notification response."""
    success: bool
    message: str
    error: Optional[str] = None


@router.post("/api/py/notifications/subscribe", response_model=NotificationResponse)
async def subscribe_to_notifications(request: SubscribeRequest):
    """
    Subscribe a user to push notifications.

    Stores the FCM token and preferences for future notifications.

    Args:
        request: SubscribeRequest with FCM token and preferences

    Returns:
        NotificationResponse indicating success or failure
    """
    logger.info(f"Subscription request received for token: {request.fcm_token[:20]}...")

    try:
        # Store token with metadata
        fcm_tokens[request.fcm_token] = {
            "subscribed_at": datetime.now().isoformat(),
            "preferences": request.preferences or {},
            "active": True
        }

        logger.info(f"Token stored. Total active tokens: {len(fcm_tokens)}")

        return NotificationResponse(
            success=True,
            message="Successfully subscribed to notifications"
        )

    except Exception as e:
        logger.error(f"Error subscribing to notifications: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to subscribe: {str(e)}"
        )


@router.delete("/api/py/notifications/unsubscribe", response_model=NotificationResponse)
async def unsubscribe_from_notifications(request: UnsubscribeRequest):
    """
    Unsubscribe a user from push notifications.

    Removes the FCM token from storage.

    Args:
        request: UnsubscribeRequest with FCM token

    Returns:
        NotificationResponse indicating success or failure
    """
    logger.info(f"Unsubscribe request for token: {request.fcm_token[:20]}...")

    try:
        if request.fcm_token in fcm_tokens:
            fcm_tokens[request.fcm_token]["active"] = False
            logger.info("Token marked as inactive")
        else:
            logger.warning("Token not found in storage")

        return NotificationResponse(
            success=True,
            message="Successfully unsubscribed from notifications"
        )

    except Exception as e:
        logger.error(f"Error unsubscribing: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to unsubscribe: {str(e)}"
        )


@router.post("/api/py/notifications/send-test", response_model=NotificationResponse)
async def send_test_notification(request: TestNotificationRequest):
    """
    Send a test notification to a specific FCM token.

    Useful for testing notification setup and delivery.

    Args:
        request: TestNotificationRequest with token and message content

    Returns:
        NotificationResponse with delivery status
    """
    logger.info(f"Test notification request for token: {request.fcm_token[:20]}...")

    # Initialize Firebase if needed
    if not initialize_firebase():
        return NotificationResponse(
            success=False,
            message="Firebase not initialized",
            error="Firebase Admin SDK not configured"
        )

    try:
        # Create notification message
        message = messaging.Message(
            notification=messaging.Notification(
                title=request.title,
                body=request.body,
            ),
            token=request.fcm_token,
            webpush=messaging.WebpushConfig(
                notification=messaging.WebpushNotification(
                    icon="/icon-192x192.png",
                    badge="/badge-72x72.png",
                ),
                fcm_options=messaging.WebpushFCMOptions(
                    link="/"
                )
            )
        )

        # Send message
        response = messaging.send(message)
        logger.info(f"Test notification sent successfully: {response}")

        return NotificationResponse(
            success=True,
            message=f"Test notification sent successfully: {response}"
        )

    except Exception as e:
        logger.error(f"Error sending test notification: {e}")
        return NotificationResponse(
            success=False,
            message="Failed to send test notification",
            error=str(e)
        )


@router.post("/api/py/notifications/schedule-daily")
async def schedule_daily_reminder(request: SubscribeRequest):
    """
    Schedule daily reminder notifications for a user.

    In production, this would integrate with a job scheduler like Celery or Cloud Scheduler.
    For now, it just stores the preference.

    Args:
        request: SubscribeRequest with FCM token and preferences

    Returns:
        NotificationResponse indicating success
    """
    logger.info("Daily reminder schedule request")

    try:
        if request.fcm_token in fcm_tokens:
            fcm_tokens[request.fcm_token]["preferences"]["daily_reminder"] = True
            fcm_tokens[request.fcm_token]["preferences"].update(request.preferences or {})

            return NotificationResponse(
                success=True,
                message="Daily reminder scheduled"
            )
        else:
            raise HTTPException(
                status_code=404,
                detail="Token not found. Please subscribe first."
            )

    except Exception as e:
        logger.error(f"Error scheduling daily reminder: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to schedule reminder: {str(e)}"
        )


@router.post("/api/py/notifications/send-daily-card")
async def send_daily_card_reminder():
    """
    Send daily card reminder to all subscribed users.

    This endpoint would typically be called by a cron job or scheduler.

    Returns:
        Statistics about notifications sent
    """
    logger.info("Sending daily card reminders")

    if not initialize_firebase():
        raise HTTPException(
            status_code=500,
            detail="Firebase not initialized"
        )

    # Notification templates for A/B testing
    templates = [
        {
            "title": "Your daily card awaits",
            "body": "Ready to see what today holds?"
        },
        {
            "title": "Time for your daily reading",
            "body": "Your cards are ready. What guidance do you seek?"
        },
        {
            "title": "Daily wisdom from Vesper",
            "body": "Take a moment to draw your cards for today."
        }
    ]

    sent_count = 0
    error_count = 0
    skipped_count = 0

    # Get active tokens with daily reminder enabled
    active_tokens = [
        token for token, data in fcm_tokens.items()
        if data.get("active", True) and data.get("preferences", {}).get("daily_reminder", False)
    ]

    logger.info(f"Found {len(active_tokens)} tokens for daily reminders")

    for i, token in enumerate(active_tokens):
        try:
            # Use template variation (simple A/B test)
            template = templates[i % len(templates)]

            message = messaging.Message(
                notification=messaging.Notification(
                    title=template["title"],
                    body=template["body"],
                ),
                token=token,
                webpush=messaging.WebpushConfig(
                    notification=messaging.WebpushNotification(
                        icon="/icon-192x192.png",
                        badge="/badge-72x72.png",
                        tag="daily-reminder",
                        require_interaction=False,
                    ),
                    fcm_options=messaging.WebpushFCMOptions(
                        link="/"
                    )
                )
            )

            messaging.send(message)
            sent_count += 1

        except Exception as e:
            logger.error(f"Error sending to token {token[:20]}...: {e}")
            error_count += 1

    logger.info(f"Daily reminders sent: {sent_count}, errors: {error_count}")

    return {
        "success": True,
        "sent": sent_count,
        "errors": error_count,
        "skipped": skipped_count,
        "total_tokens": len(active_tokens)
    }


@router.get("/api/py/notifications/status")
async def get_notification_status():
    """
    Get notification service status.

    Returns:
        Service status and statistics
    """
    active_tokens = sum(
        1 for data in fcm_tokens.values()
        if data.get("active", True)
    )

    daily_reminder_count = sum(
        1 for data in fcm_tokens.values()
        if data.get("active", True) and data.get("preferences", {}).get("daily_reminder", False)
    )

    return {
        "firebase_initialized": _firebase_initialized,
        "firebase_available": FIREBASE_AVAILABLE,
        "total_tokens": len(fcm_tokens),
        "active_tokens": active_tokens,
        "daily_reminder_enabled": daily_reminder_count
    }
