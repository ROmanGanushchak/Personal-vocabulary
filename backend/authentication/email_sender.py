from random import randint
from email.mime.text import MIMEText
import smtplib

from backend.settings import BASIC_SENDER_EMAIL, BASIC_SENDER_PASSWORD
from .models import VerificationAwaitUser


def generate_verification_code(length: int = 6) -> str:
    code: str = "".join([str(randint(1, 9)) for _ in range(length)])

    while (1):
        try:
            VerificationAwaitUser.objects.get(verification_code = code)
            code = "".join([str(randint(1, 9)) for _ in range(length)])
        except Exception:
            return code


def send_mail(email: str, content: str, subject: str) -> None:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(BASIC_SENDER_EMAIL, BASIC_SENDER_PASSWORD)

    msg = MIMEText(content)
    msg['Subject'] = subject
    msg['From'] = BASIC_SENDER_EMAIL
    msg['To']   = email

    server.send_message(msg)
    server.quit()


def send_confirm_code(email: str, verification_code: str) -> None:
    subject = 'Email verification for dictionary'
    content = f'To finish your account creation use this confirmation code {verification_code}. The code has experation time about 30min.'
    send_mail(email, content, subject)


RESET_PASSWORD_LINK = "something/"

def send_password_reset_code(email: str, verification_code: str):
    subject = "Dictionary password reset"
    content = f"We resived a request to change the password of your account, if you are intended to do this go to the link {RESET_PASSWORD_LINK}/{verification_code}/"
    send_mail(email, content, subject)


if __name__ == "__main__":
    email = "roman.for.programing@gmail.com"
    send_confirm_code(email)