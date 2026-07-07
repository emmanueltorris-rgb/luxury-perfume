import resend
from backend.config import get_settings

settings = get_settings()
resend.api_key = settings.RESEND_API_KEY

def send_email(to_email:str, subject:str, html:str):
    try:
        response = resend.Email.send({
            "from":settings.FROM_EMAIL,
            "to":[to_email],
            "subject":subject,
            "html":html
        })
        return response
    except Exception as e:
        print("Email error:", e)

