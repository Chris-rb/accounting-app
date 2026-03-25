import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

APP_EMAIL = "app.thebookkeeper@gmail.com"

def send_pass_reset_req(email_address: str, reset_url: str):
    message = Mail(
        from_email=APP_EMAIL,
        to_emails=email_address,
        subject="Password Reset Request",
        html_content=f"""
            <p>You requested a password reset.</p>
            <a href={reset_url}>
                <button>Reset Password</button>
            </a>
            <p>This link expires in 1 hour.</p>
        """
    )
    try:
        sg=SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
        resp = sg.send(message)
        return resp
    except Exception as e:
        print("Email failed to send", str(e))
        
        
def send_acct_req_notification(admin_email: str, request_user: str):
    message = Mail(
        from_email=APP_EMAIL,
        to_emails=admin_email,
        subject="User Account Request",
        html_content=f"""
            <p>A new user, {request_user}, has requested to create a Bookkeeper account</p>
        """
    )
    try:
        sg=SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
        resp = sg.send(message)
        return resp
    except Exception as e:
        print("Email failed to send", str(e))
        
        
def send_email(email_address: str, subject: str, message_body: str):
    message = Mail(
        from_email=APP_EMAIL,
        to_emails=email_address,
        subject=subject,
        html_content=f"""
            <p>
                {message_body}
            </p>
        """
    )
    try:
        sg=SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
        resp = sg.send(message)
        return resp
    except Exception as e:
        print("Email failed to send", str(e))