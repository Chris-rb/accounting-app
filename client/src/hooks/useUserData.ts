import { getActiveUsers, getPendingUsers } from "../api/service";
import { AxiosResponse } from "axios"


export const getUserData = async () => {
    const resp: AxiosResponse | null = await getActiveUsers();
    if (resp) {
        console.log("retrieved user data");
        console.log(resp.data)
        console.log("resp")
        return resp.data;
    }
    else {
        console.log("Unable to retrieve active user data")
        return null;
    }
}


export const getPendingUserData = async () => {
    const resp: AxiosResponse | null = await getPendingUsers();
    if (resp) {
        console.log("retrieved user data");
        console.log(resp.data)
        console.log("resp")
        return resp.data;
    }
    else {
        console.log("Unable to retrieve pending user data")
        return null;
    }
}