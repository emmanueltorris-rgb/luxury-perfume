from backend.services.email import send_email
send_email(
    to_email= "samsonmanoti02@gmail.com",
    subject="Resend Test",
    html="""
<h1> Hello Manoti</h1>
<p>Testing if resend integration is working</p>
"""
)
print ("Email sent!")