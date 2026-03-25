from hashlib import sha256
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies, get_jwt, unset_jwt_cookies, get_jwt_identity
from .extensions import db
from .db_models import User, Address, SecurityQA, PasswordHistory, SuspendedUsers
from .models.auth import Roles, AccountStatus, SecurityQuestions
from .services import email_service


PASSWORD_EXPIRY_WEEKS = 32
RESET_PASS_URL = "http://localhost:80/reset-password"

api_bp = Blueprint("api", __name__)


def hash_password(password_string: str):
    # Encode the string to bytes
    encoded_string = password_string.encode("utf-8")
    
    # Create a sha256 hash object
    hash_object = sha256(encoded_string)
    
    # Get the hexadecimal representation of the hash
    hex_digest = hash_object.hexdigest()
    
    return hex_digest


def set_password_expiry():
    return (datetime.now() +  timedelta(weeks=PASSWORD_EXPIRY_WEEKS))
    

@api_bp.get("/hello")
@jwt_required()
def hello():
    claims = get_jwt()
    
    requester_role = claims.get("role")
    
    data = request.args.get("userData")
    
    if requester_role == Roles.ADMIN.value:
        response = jsonify({"message": "hello!", "data": data})
    else:
        response = jsonify({"message": "nah brah"})
    return response


# rename to auth/login
@api_bp.post("auth/login")
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    
    if username == None or password == None:
        return "No username or password provided", 400
    
    auth_user = User.query.filter(
        User.username == username,
        User.password == hash_password(password)
    ).first()
    
    if auth_user is None:
        return f"No account found with usrname: {username} and password: {password}", 400
     
    if auth_user.password_expiry <= datetime.now():
        return "Password is expired", 400
    
    if auth_user.account_status != "Active":
        return "Account is not currently active", 403
    
    response = jsonify(auth_user.to_dict())
    
    identity = auth_user.username
    additional_claims={"role": auth_user.role}
    
    access_token = create_access_token(
        identity, 
        expires_delta=timedelta(hours=1),
        additional_claims=additional_claims
    )
    
    set_access_cookies(response, access_token)
        
    return response

#rename to auth/logout
@api_bp.post("auth/logout")
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response, 200


# change to users/new_user
@api_bp.post("/create_user")
@jwt_required(optional=True)
def create_user():
    data = request.get_json()
    user_data = data["user"]
    address_data = data["address"]
    security_ques_data = data["security_questions"]
    
    email_exists = User.query.filter(
        User.email == user_data["email"]
    ).first()
    
    if email_exists:
        return f"email '{email_exists}' is already associated with a user", 400

    claims = get_jwt()
    
    if claims:
        requester_role = claims.get("role")
    else: 
        requester_role = None
        
    if requester_role == Roles.ADMIN.value:
        assigned_role = user_data.get("role", Roles.ACCOUNTANT.value)
        status = user_data.get("account_status", AccountStatus.ACTIVE.value)
    else:
        assigned_role = Roles.ACCOUNTANT.value
        status = AccountStatus.PENDING.value
    
    username = f"{user_data['firstname'][0]}{user_data['lastname']}{datetime.now().strftime('%m%y')}"
    
    date_format = '%Y-%m-%dT%H:%M:%S.%fZ'
    user_dob = datetime.strptime(user_data["dateOfBirth"], date_format)
    
    new_user = User(
        username=username,
        firstname=user_data["firstname"],
        lastname=user_data["lastname"],
        email=user_data["email"],
        password=hash_password(user_data["password"]),
        password_expiry=set_password_expiry(),
        date_of_birth=user_dob,
        role=assigned_role,
        account_status=status
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    new_password = PasswordHistory(
        user_id = new_user.id,
        password = hash_password(user_data["password"])
    ) 
    
    new_user_address = Address(
        user_id = new_user.id,
        address_line_1 = address_data["addressLine1"],
        address_line_2 = address_data["addressLine2"],
        city = address_data["city"],
        state = address_data["state"],
        zipcode = address_data["zipcode"]
    )
    
    new_user_security_qa = SecurityQA(
        user_id = new_user.id,
        security_ques_1 = security_ques_data["securityQues1"],
        security_ans_1 = security_ques_data["securityAns1"],
        security_ques_2 = security_ques_data["securityQues2"],
        security_ans_2 = security_ques_data["securityAns2"]
    )
    
    db.session.add(new_password)
    db.session.add(new_user_address)
    db.session.add(new_user_security_qa)
    db.session.commit()
    
    # email_service.send_acct_req_notification("", username)
    
    return "Successfully created an account", 201
    
    
    
    # change to users/active
@api_bp.get("/users/active")
@jwt_required()
def get_active_users():
    claims = get_jwt()
    
    requester_role = claims.get("role")
    
    if requester_role != Roles.ADMIN.value:
        return "Unautheried request", 401
    
    users = User.query.filter(
        User.account_status == AccountStatus.ACTIVE.value
    ).all()
    active_users = [active_user.to_dict() for active_user in users]
    
    return jsonify(active_users), 200


@api_bp.get("/users/pending")
@jwt_required()
def get_pending_users():
    claims = get_jwt()
    
    requester_role = claims.get("role")
    
    if requester_role != Roles.ADMIN.value:
        return "Unautheried request", 401
    
    users = User.query.filter(
        User.account_status == AccountStatus.PENDING.value
    ).all()
    pending_users = [pending_user.to_dict() for pending_user in users]
    
    return jsonify(pending_users), 200
    
    

@api_bp.patch("/users/<int:user_id>")
@jwt_required()
def update_user(user_id: int):
    claims = get_jwt()
    
    requester_role = claims.get("role")
    
    if requester_role != Roles.ADMIN.value:
        return "Unautheried request", 401
    
    update_user = User.query.get(user_id)
    update_address = Address.query.filter(Address.user_id==user_id)
    
    if not update_user:
        return f"No user found with id: {user_id}", 404
    
    data = request.get_json()
    user_details = data.get("user_details")
    addr_details = data.get("address_details")
    
    if not user_details:
        return "Unable to retrieve user details", 404
    
    for key, value in user_details.items():
        try:
            setattr(update_user, key, value)
        except Exception as e:
            print(f"unable to update {key}")
            
    for key, value in addr_details.items():
        try:
            setattr(update_address, key, value)
        except Exception as e:
            print(f"unable to update {key}")
            
    db.session.commit()
    
    return f"successfully updated user details for user with id {user_id}", 200
    

    # change to users/id/role
@api_bp.put("/assign_role/<int:user_id>")
@jwt_required()
def assign_role(user_id: int):
    claims = get_jwt()
    
    requester_role = claims.get("role")
    
    if requester_role != Roles.ADMIN.value:
        return "Unautheried request", 401
    
    data = request.get_json()
    new_role = data.get("role")
    
    update_user = User.query.get(user_id)
    
    if not update_user:
        return f"No user found with id: {user_id}", 404
    
    update_user.role = new_role
    
    db.session.commit()


# change to auth/forgot-password
@api_bp.post("/auth/forgot-password")
def forgot_password():
    data = request.get_json()
    email_addr = data.get("email")
    # security_data = data.get("securityQA")
    print(email_addr)
    
    req_user = User.query.filter(
        User.email == email_addr
    ).first()
    
    if not req_user:
        return f"No account found with email: {email_addr}", 404
    
    # security_qa_matches = SecurityQA.query.filter(
    #     SecurityQA.security_ques_1 == security_data.get("securityQues1"),
    #     SecurityQA.security_ans_1 == security_data.get("securityAns1"),
    #     SecurityQA.security_ques_2 == security_data.get("securityQues2"),
    #     SecurityQA.security_ans_2 == security_data.get("securityAns2")
    # ).first()
    
    # if not security_qa_matches:
    #     return f"Incorrect answers for security questions", 400
    
    access_token = create_access_token(identity=str(req_user.id), expires_delta=timedelta(minutes=15))
    
    reset_url = f"{RESET_PASS_URL}/{access_token}"

    try:
        resp = email_service.send_pass_reset_req(email_addr, reset_url)
        print(resp)
        return "Forgot Password link Successfully sent", 200
    except Exception as e:
        return f"An error occured: {e}", 400
    
     
@api_bp.post("/auth/reset-password")
@jwt_required()
def reset_password():
    data = request.get_json()
    new_password = hash_password(data.get("password"))
    
    # or maybe pass user_id on successful forgot_password to client
    # if not, will have to get user_id by email lookup firts
    # email_exists = User.query.filter(
    #     User.email == email_addr
    # ).first()
    
    user_id = int(get_jwt_identity())
    
    user = User.query.get(user_id)
    
    if not user:
        f"User account with id {user_id} not found", 404
    
    password_exists = PasswordHistory.query.filter(
        PasswordHistory.user_id == user_id,
        PasswordHistory.password ==  new_password
    ).first()
    
    if password_exists:
        return "New password cannot be a previous password", 400
    
    user_update = User.query.get(user_id)
    
    user_update.password = new_password
    user_update.password_expiry = set_password_expiry()
    
    new_password_hist = PasswordHistory(
        user_id = user_id,
        password = new_password
    )
    
    db.session.add(new_password_hist)
    db.session.commit()
    
    return "New password successfully updated", 200


# change to users/id/deactivate
@api_bp.patch("/users/<int:user_id>/deactivate")
@jwt_required()
def deactivate_user(user_id: int):
    claims = get_jwt()
    
    request_role = claims.get("role")
    
    if request_role != Roles.ADMIN.value:
        return "Unathorized", 403
    
    deact_user = User.query.get(user_id)
    
    if not deact_user:
        return f"No user found with user_id: {user_id}", 404
    
    deact_user.account_status = AccountStatus.DEACTIVATED.value
    
    db.session.commit()
    
    return "User account successfully deactivated", 200



@api_bp.patch("/users/<int:user_id>/activate")
@jwt_required()
def activate_user(user_id: int):
    claims = get_jwt()
    
    request_role = claims.get("role")
    
    if request_role != Roles.ADMIN.value:
        return "Unathorized", 403
    
    pending_user = User.query.get(user_id)
    
    if not pending_user:
        return f"No user found with user_id: {user_id}", 404
    
    pending_user.account_status = AccountStatus.ACTIVE.value
    
    db.session.commit()
    
    return "User account successfully activated", 200


# change to users/id/suspend
@api_bp.patch("/users/<int:user_id>/suspend")
@jwt_required()
def suspend_user(user_id: int):
    claims = get_jwt()
    
    request_role = claims.get("role")
    
    if request_role != Roles.ADMIN.value:
        return "Unathorized", 403
    
    date_format = '%Y-%m-%dT%H:%M:%S.%fZ'
    data = request.get_json()
    suspend_user_at = datetime.strptime(data.get("suspendAt"), date_format)
    suspend_user_until = datetime.strptime(data.get("suspendUntil"), date_format)
    
    suspended_user = User.query.get(user_id)
    if not suspended_user:
        return f"No User found with user_id {user_id}", 404
    
    if suspend_user_at > suspend_user_until:
        return "Suspension start must be before suspension end", 404
    if suspend_user_at < datetime.now() and suspend_user_until < datetime.now():
        return "Suspension range must not be in the past", 401
    elif suspend_user_at < datetime.now():
        suspended_user.account_status = AccountStatus.SUSPENDED.value
    
    new_suspension = SuspendedUsers(
        user_id = user_id,
        suspended_at = suspend_user_at,
        suspended_until = suspend_user_until
    )
    
    db.session.add(new_suspension)
    db.session.commit()
    
    return "User successfully suspended", 200
    
    
@api_bp.delete("/users/<int:user_id>/delete")
@jwt_required()
def delete_user(user_id: int):
    claims = get_jwt()
    
    request_role = claims.get("role")
    
    if request_role != Roles.ADMIN.value:
        return "Unathorized", 403
    
    user_to_delete = User.query.get(user_id)
    pass_hist_to_delete = PasswordHistory.query.filter(PasswordHistory.user_id == user_id)
    addr_to_delete = Address.query.filter(Address.user_id == user_id)
    
    if not user_to_delete:
        return f"No user found with id {user_id}", 404
    
    db.session.delete(user_to_delete)
    db.session.delete(pass_hist_to_delete)
    db.session.delete(addr_to_delete)
    db.session.commit()
    
    
@api_bp.post("/email/message/<int:user_id>")
@jwt_required()
def send_email(user_id: int):
    claims = get_jwt()
    
    request_role = claims.get("role")
    
    if request_role != Roles.ADMIN.value:
        return "Unathorized", 403
    
    recipient_user = User.query.get(user_id)
    if not recipient_user:
        return f"No user found with id {user_id}", 404
    
    data = request.get_json()
    recipient_email = recipient_user.email
    subject = data["subject"]
    message_body = data["messageBody"]
    
    try:
        resp = email_service.send_email(recipient_email, subject, message_body)
        print(resp)
        return "Email successfully sent", 200
    except Exception as e:
        return f"An error occured: {e}", 400
    
    
# def check_suspension():
#     set up cron job to check SuspendedUsers table
#     if suspended start and suspended end for a user is within
#     time now, check if they're status updated to suspended, if not, suspend.
#     check suspended end, when time now is beyond suspend end, check if they have their status
#     back to active, if not, set to active, then delete from Suspended users table