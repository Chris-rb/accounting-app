from .extensions import db
from .models.auth import Roles, AccountStatus, SecurityQuestions


class User(db.Model):
    __tablename__ = "user"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    password_expiry = db.Column(db.DateTime, nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    account_status = db.Column(db.String(25), nullable=False)
    address = db.relationship("Address", backref="user")
    security_qa = db.relationship("SecurityQA", backref="user")
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "passwordExpiry": self.password_expiry.isoformat() if self.password_expiry else None,
            "dateOfBirth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "role" : self.role,
            "accountStatus": self.account_status,
            "address": [addr.to_dict() for addr in self.address][0],
            "createdAt": self.created_at,
            "modifiedAt": self.modified_at,
        }
        
class Address(db.Model):
    __tablename__ = "address"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    address_line_1 = db.Column(db.String(125), nullable=False)
    address_line_2 = db.Column(db.String(125), nullable=True)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(20), nullable=False)
    zipcode = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "addressLine1": self.address_line_1,
            "addressLine2": self.address_line_2,
            "city": self.city,
            "state": self.state,
            "zipcode": self.zipcode,
            "createdAt": self.created_at,
            "modifiedAt": self.modified_at,
        }
    
    
class SecurityQA(db.Model):
    __tablename__ = "securityqa"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    security_ques_1 = db.Column(db.String(120), nullable=False)
    security_ans_1 = db.Column(db.String(50), nullable=False)
    security_ques_2 = db.Column(db.String(120), nullable=False)
    security_ans_2 = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "securityQues1": self.security_ques_1,
            "securityAns1": self.security_ans_1,
            "securityQues2": self.security_ques_2,
            "securityAns2": self.security_ans_2,
            "createdAt": self.created_at,
            "modifiedAt": self.modified_at,
        }
        
    
class PasswordHistory(db.Model):
    __tablename__ = "password_history"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "password": self.password,
            "createdAt": self.created_at,
            "modifiedAt": self.modified_at,
        }
        
        
class SuspendedUsers(db.Model):
    __tablename__ = "suspended_users"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    suspended_at = db.Column(db.DateTime, nullable=False)
    suspended_until= db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "suspendedAt": self.suspended_at,
            "suspendedUntil": self.suspended_until,
            "createdAt": self.created_at,
            "modifiedAt": self.modified_at,
        }