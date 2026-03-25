import os
import sys
from datetime import datetime, timedelta, timezone

# add server/ to path so absolute imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from app import create_app
from app.extensions import db
from app.db_models import User, Address, SecurityQA
from app.models.auth import Roles, AccountStatus, SecurityQuestions
from app.api import hash_password


load_dotenv()

app = create_app()

with app.app_context():
    if os.environ.get("FLASK_ENV") == "development":
        db.drop_all()
        db.create_all()
        
    pass_date = datetime(2026, 2, 24, 12, 12, 0, 0)
    expired_pass_date = pass_date
    now = datetime.now(timezone.utc)
    upcoming_expiry_date = now + timedelta(days=2)
    pass_expiry_date = pass_date + timedelta(weeks=32)
        
    users = [
        User(
            username = "aadmin0224", 
            firstname = "admin", 
            lastname = "admin",
            email = "admin@gmail.com",
            password = hash_password("adminpa33word!"),
            password_expiry = pass_expiry_date,
            date_of_birth = pass_date,
            role = Roles.ADMIN.value,
            account_status = AccountStatus.ACTIVE.value,
            created_at = now
        ),
        User(
            username = "mmanager0224", 
            firstname = "manager", 
            lastname = "manager",
            email = "manager@gmail.com",
            password = hash_password("managerpa33word!"),
            password_expiry = pass_expiry_date,
            date_of_birth = pass_date,
            role = Roles.MANAGER.value,
            account_status = AccountStatus.ACTIVE.value,
            created_at = now
        ),
        User(
            username = "aacct0224", 
            firstname = "acct", 
            lastname = "acct",
            email = "acct@gmail.com",
            password = hash_password("acctpa33word!"),
            password_expiry = pass_expiry_date,
            date_of_birth = pass_date,
            role = Roles.ACCOUNTANT.value,
            account_status = AccountStatus.ACTIVE.value,
            created_at = now
        ),
    ]
        
    db.session.add_all(users)
    db.session.commit() 
    
    addresses = [
        Address(
            user_id = users[0].id,
            address_line_1 = "1000 Chastain Rd NW",
            address_line_2 = None,
            city = "Kennesaw",
            state = "GA",
            zipcode = 30144,
            created_at = now
        ),
        Address(
            user_id = users[1].id,
            address_line_1 = "1000 Chastain Rd NW",
            address_line_2 = None,
            city = "Kennesaw",
            state = "GA",
            zipcode = 30144,
            created_at = now
        ),
        Address(
            user_id = users[2].id,
            address_line_1 = "1000 Chastain Rd NW",
            address_line_2 = None,
            city = "Kennesaw",
            state = "GA",
            zipcode = 30144,
            created_at = now
        )
    ]
    
    security_qas = [
        SecurityQA(
            user_id = users[0].id,
            security_ques_1 = "What's the name of your first pet?",
            security_ans_1 = "frodo",
            security_ques_2 = "What was your first car?",
            security_ans_2 = "mitsubishi",
            created_at = now
        ),
        SecurityQA(
            user_id = users[1].id,
            security_ques_1 = "What was the name of your middle school?",
            security_ans_1 = "middle school",
            security_ques_2 = "What is your mother's maiden name?",
            security_ans_2 = "maiden",
            created_at = now
        ),
        SecurityQA(
            user_id = users[2].id,
            security_ques_1 = "What city were you born in?",
            security_ans_1 = "some city",
            security_ques_2 = "What is the name of the street you grew up on?",
            security_ans_2 = "grove street",
            created_at = now
        )
    ]
    
    db.session.add_all(addresses)
    db.session.add_all(security_qas)
    db.session.commit() 
    print("Database successfully initialized!")
