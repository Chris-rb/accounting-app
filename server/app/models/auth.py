from enum import Enum


class Roles(Enum):
    ADMIN = "Admin"
    MANAGER = "Manager"
    ACCOUNTANT = "Accountant"
    
    
class Permissions(Enum):
    ADD_ACCOUNT = "add_account"
    VIEW_ACCOUNT = "view_account"
    EDIT_ACCOUNT = "edit_account"
    DELETE_ACCOUNT = "delete_account"


class AccountStatus(Enum):
    ACTIVE = "Active"
    SUSPENDED = "Suspended"
    DEACTIVATED = "Deactivated"
    PENDING = "Pending"
    
    
class SecurityQuestions(Enum):
    QUESTION1 = "What's the name of your first pet?"
    QUESTION2 = "What was your first car?"
    QUESTION3 = "What was the name of your middle school?"
    QUESTION4 = "What was your fisrt pet's name?"
    QUESTION5 = "What is your mother's maiden name?"
    QUESTION6 = "What city were you born in?"
    QUESTION7 = "What is the name of the street you grew up on?"
    QUESTION8 = "What is the name of your favorite teacher?"
    
    
RolePermissionsMapping = {
    Roles.ADMIN.value: [
        Permissions.ADD_ACCOUNT.value,
        Permissions.VIEW_ACCOUNT.value,
        Permissions.EDIT_ACCOUNT.value,
        Permissions.DELETE_ACCOUNT.value
    ],
    Roles.MANAGER.value: [
        Permissions.VIEW_ACCOUNT.value
    ],
    Roles.ACCOUNTANT.value: [
        Permissions.VIEW_ACCOUNT.value
    ]
}
    

