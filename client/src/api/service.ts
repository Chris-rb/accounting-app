import axios, { AxiosResponse } from "axios"
import { Address, User } from "../types/userdata-types";

// const API_URL = "http://localhost:5000/api"


enum API_ENDPOINTS {
    HELLO = "/api/hello",
    LOGIN = "/api/auth/login",
    LOGOUT = "/api/auth/logout",
    CREATE_USER = "/api/create_user",
    FORGOT_PASSWORD = "/api/auth/forgot-password",
    RESET_PASSWORD = "/api/auth/reset-password",
    ACTIVE_USERS = "/api/users/active",
    PENDING_USERS = "/api/users/pending",
    SEND_EMAIL = `/api/email/message/{0}`,
    USERS = "/api/users",
    SUSPEND_USER = `/api/users/{0}/suspend`,
    ACTIVATE_USER = `/api/users/{0}/activate`,
    DEACTIVATE_USER = `/api/users/{0}/deactivate`
}


export const hello = async <T>(userData: T): Promise<unknown> => {
    try {
        const resp = await axios.get(
            `${API_ENDPOINTS.HELLO}`, 
            {
                params: { 
                    "userData": userData
                },
                withCredentials: true
            }
        )
        console.log(resp);
        return resp;
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}

export const login = async (username: string, password: string): Promise<User | null> => {
    try {
        const resp = await axios.post(
            `${API_ENDPOINTS.LOGIN}`,
            {
                "username": username,
                "password": password
            },
            {
                withCredentials: true
            }
        )

        if (resp.status == 200) {
            return resp.data
        }
        else if (resp.status == 404) {
            console.log(`No account found with username: ${username}, and password: ${password}`)
            return null
        }
        console.log("There was an error processing the request")
        return null
    }
    catch (error) {
        console.log(error.status)
        console.log(error.response)
        return null
    }
}

export const logout = async (): Promise<AxiosResponse | null> => {
    try {
        const resp = await axios.post(`${API_ENDPOINTS.LOGOUT}`)
        if (resp.status == 200) {
            return resp;
        }
        return null;
    }
    catch (error) {
        console.log(error.status)
        console.log(error.response)
        return null
    }
}

export const createUser = async (userData, address, sequrityQuestions): Promise<AxiosResponse | null> => {
    try {
        const resp = await axios.post(
            `${API_ENDPOINTS.CREATE_USER}`,
            {
                "user": userData,
                "address": address,
                "security_questions": sequrityQuestions
            },
            {
                withCredentials: true,
            }
        )

        if (resp.status == 201) {
            return resp;
        }
        return null;
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}


export const sendForgotPassReq = async (email: string): Promise<string | null> => {
    try {
        const resp = await axios.post(
            `${API_ENDPOINTS.FORGOT_PASSWORD}`,
            {
                "email": email
            },
            {
                withCredentials: true
            }
        )

        if (resp.status == 200) {
            return resp.statusText;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}


export const resetPassReq = async (password: string, token: string): Promise<AxiosResponse | null> => {
    try {
        const resp = await axios.post(
            `${API_ENDPOINTS.RESET_PASSWORD}`,
            {
                "password": password
            },
            {
                "headers": 
                {
                    "Authorization": `Bearer ${token}`
                }
            }
        )
        if (resp.status == 200) {
            return resp
        }
        return null;
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}


export const getActiveUsers = async (): Promise<AxiosResponse | null> => {
    try {
        const resp = await axios.get(
            `${API_ENDPOINTS.ACTIVE_USERS}`,
            {
                withCredentials: true,
                headers: { 'Accept': 'application/json' }
            }
        )

        if (resp.status == 200) {
            return resp;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}


export const getPendingUsers = async (): Promise<AxiosResponse | null> => {
    try {
        const resp = await axios.get(
            `${API_ENDPOINTS.PENDING_USERS}`,
            {
                withCredentials: true,
                headers: { 'Accept': 'application/json' }
            }
        )

        if (resp.status == 200) {
            return resp;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}


export const sendEmail = async (
    userId: number,
    subject: string, 
    messageBody: string
    ): Promise<AxiosResponse | null> => {
        try {
            const resp = await axios.post(
                `${API_ENDPOINTS.SEND_EMAIL.replace(`{0}`, userId.toString())}`,
                {
                    "subject": subject,
                    "messageBody": messageBody
                },
                {
                    withCredentials: true
                }
            )
            if (resp.status == 200) {
                return resp;
            }
            return null;
        }
        catch (error) {
            console.log(error.status);
            console.log(error.response);
            return null;
        }
} 


export const updateUser = async (userDetails: User, addressDetails: Address) => {
    try {
        const resp = await axios.patch(
            `${API_ENDPOINTS.USERS}/${userDetails.id}`,
            {
                user_details: userDetails,
                address_details: addressDetails
            },
            {
                withCredentials: true
            }
        );

        if (resp.status == 200) {
            return resp
        }
        return null;
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}


export const suspendUser = async (userId: number, suspenedStart: Date, suspendEnd: Date): Promise<AxiosResponse | null> => {
    try {
        const resp = await axios.patch(
            `${API_ENDPOINTS.SUSPEND_USER.replace(`{0}`, userId.toString())}`,
            {
                suspendAt: suspenedStart,
                suspendUntil: suspendEnd
            },
            {
                withCredentials: true
            }
        )

        if (resp.status == 200) {
            return resp;
        }
        return null;
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}


export const deactivateUser = async (userId: number): Promise<AxiosResponse | null> => {
    try {
        const resp = await axios.patch(
            `${API_ENDPOINTS.DEACTIVATE_USER.replace("{0}", userId.toString())}`,
            {},
            {
                withCredentials: true
            }
        )

        if (resp.status == 200) {
            return resp;
        }
        return null;
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}


export const activateUser = async (userId: number): Promise<AxiosResponse | null> => {
    try {
        const resp = await axios.patch(
            `${API_ENDPOINTS.ACTIVATE_USER.replace("{0}", userId.toString())}`,
            {},
            {
                withCredentials: true
            }
        )

        if (resp.status == 200) {
            return resp;
        }
        return null;
    }
    catch (error) {
        console.log(error.status);
        console.log(error.response);
        return null;
    }
}