export enum Permission {
    ADD_ACCOUNT = "add_account",
    VIEW_ACCOUNT = "view_account",
    EDIT_ACCOUNT = "edit_account",
    DELETE_ACCOUNT = "delete_account",
}

export enum Roles {
    ADMIN = "Admin",
    MANAGER = "Manager",
    ACCOUNTANT = "Accountant"
}

export enum AccountStatus {
    ACTIVE = "Active",
    SUSPENDED = "Suspended",
    DEACTIVATED = "Deactivated",
    PENDING = "Pending"
}

export enum SecurityQuestions {
    QUESTION1 = "What's the name of your first pet?",
    QUESTION2 = "What was your first car?",
    QUESTION3 = "What was the name of your middle school?",
    QUESTION4 = "What was your fisrt pet's name?",
    QUESTION5 = "What is your mother's maiden name?",
    QUESTION6 = "What city were you born in?",
    QUESTION7 = "What is the name of the street you grew up on?",
    QUESTION8 = "What is the name of your favorite teacher?"
}

export interface SecurityQA {
    securityQues1: SecurityQuestions;
    securityAns1: string;
    securityQues2: SecurityQuestions;
    securityAns2: string;
}