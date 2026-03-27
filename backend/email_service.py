import os
import asyncio
import logging
import resend
from datetime import datetime

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
EMAIL_ENABLED = bool(RESEND_API_KEY)

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

class EmailService:
    @staticmethod
    async def _send(to: str, subject: str, html: str):
        if not EMAIL_ENABLED:
            logger.info(f"[EMAIL DEV MODE] To: {to} | Subject: {subject}")
            return None
        try:
            result = await asyncio.to_thread(resend.Emails.send, {
                "from": SENDER_EMAIL,
                "to": [to],
                "subject": subject,
                "html": html,
            })
            logger.info(f"[EMAIL SENT] To: {to} | ID: {result.get('id')}")
            return result
        except Exception as e:
            logger.error(f"[EMAIL ERROR] To: {to} | Error: {str(e)}")
            return None

    @staticmethod
    async def send_email_verification(user_email: str, verification_link: str):
        html = f"""
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #464AAC; font-size: 24px; margin-bottom: 16px;">Verify your email</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Welcome to Sri by Mahakali Tribunal. Please verify your email address to complete your account setup.
            </p>
            <a href="{verification_link}" style="display: inline-block; background-color: #464AAC; color: white; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 500; font-size: 16px;">
                Verify Email
            </a>
            <p style="color: #888; font-size: 14px; margin-top: 32px; line-height: 1.5;">
                If you didn't create an account, you can safely ignore this email.
                This link expires in 24 hours.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">Sri by Mahakali Tribunal</p>
        </div>
        """
        logger.info(f"[EMAIL] Verification link for {user_email}: {verification_link}")
        await EmailService._send(user_email, "Verify your email - Sri", html)

    @staticmethod
    async def send_investment_confirmation(user_email: str, investment_data: dict):
        html = f"""
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #464AAC; font-size: 24px; margin-bottom: 16px;">Investment Confirmation</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Your investment of <strong>${investment_data.get('amount')}</strong> ({investment_data.get('investment_type')}) has been submitted successfully.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">Sri by Mahakali Tribunal</p>
        </div>
        """
        await EmailService._send(user_email, "Investment Confirmation - Sri", html)

    @staticmethod
    async def send_recurring_notification(user_email: str, recurring_data: dict):
        html = f"""
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #464AAC; font-size: 24px; margin-bottom: 16px;">Recurring Investment Setup</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Your {recurring_data.get('frequency')} investment of <strong>${recurring_data.get('amount')}</strong> has been set up.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">Sri by Mahakali Tribunal</p>
        </div>
        """
        await EmailService._send(user_email, "Recurring Investment Setup - Sri", html)

    @staticmethod
    async def send_price_update(user_email: str, price_data: dict):
        html = f"""
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #464AAC; font-size: 24px; margin-bottom: 16px;">Reference Price Update</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                A reference price has been updated: ${price_data.get('old_price', 'N/A')} &rarr; ${price_data.get('new_price')}.
            </p>
            <p style="color: #555; font-size: 14px;">Reason: {price_data.get('reason')}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">Sri by Mahakali Tribunal</p>
        </div>
        """
        await EmailService._send(user_email, "Reference Price Update - Sri", html)

    @staticmethod
    async def send_liquidity_window_alert(user_email: str, window_data: dict):
        html = f"""
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #464AAC; font-size: 24px; margin-bottom: 16px;">Liquidity Window Alert</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                A liquidity window is open from {window_data.get('start_date')} to {window_data.get('end_date')}.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">Sri by Mahakali Tribunal</p>
        </div>
        """
        await EmailService._send(user_email, "Liquidity Window Alert - Sri", html)

    @staticmethod
    async def send_governance_alert(user_email: str, alert_data: dict):
        html = f"""
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #464AAC; font-size: 24px; margin-bottom: 16px;">Governance Alert</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                <strong>{alert_data.get('title')}</strong>
            </p>
            <p style="color: #555; font-size: 14px;">Severity: {alert_data.get('severity')}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">Sri by Mahakali Tribunal</p>
        </div>
        """
        await EmailService._send(user_email, "Governance Alert - Sri", html)
