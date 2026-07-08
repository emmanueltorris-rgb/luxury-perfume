from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.email import send_email

router = APIRouter(
    prefix="/api/v1/contact",
    tags=["Contact"]
)


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str


@router.post("/")
def contact(data: ContactRequest):

    # Email to your business
    admin_html = f"""
    <h2>New Contact Message</h2>

    <p><strong>Name:</strong> {data.name}</p>
    <p><strong>Email:</strong> {data.email}</p>

    <p><strong>Message:</strong></p>

    <p>{data.message}</p>
    """

    send_email(
        to_email="samsonmanoti02@gmail.com",
        subject="New Contact Form Message",
        html=admin_html,
    )

    # Auto reply to customer
    try:
        customer_html = f"""
        <h2>Hello {data.name},</h2>

        <p>Thank you for contacting <strong>Arwaah Parfumerie</strong>.</p>

        <p>We have successfully received your message and one of our team members will respond within 24 hours.</p>

        <hr>

        <p><strong>Your message:</strong></p>

        <blockquote>{data.message}</blockquote>

        <br>

         <p>Kind regards,<br>
         Arwaah Parfumerie Team</p>
                """

        send_email(
            to_email=data.email,
            subject="We've received your message",
            html=customer_html,
            )

    except Exception as e:
        print(f"Customer email not sent: {e}")
    
    return {
        "message": "Message sent successfully"
    }