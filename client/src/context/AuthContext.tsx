import React, {createContext, ReactNode, useContext, useState} from "react"
import { Roles } from "../types/auth-types";
import { User } from "../types/userdata-types";

interface AuthContextType {
    user: User | null;
    setAuthUser: (userData: User) => void;
    clearAuthUser: () => void;
    hasPermission: (permission: string) => boolean;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const setAuthUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const clearAuthUser = () => {
        setUser(null);
        localStorage.removeItem("user");
    }

    const hasPermission = (permission: string) => {
        return user?.permissions?.includes(permission) || false;
    }

    const isAuthenticated = () => {
        return user?.role != null && Object.values(Roles).includes(user.role);
    }

    return <AuthContext.Provider value={{user, setAuthUser, clearAuthUser, hasPermission, isAuthenticated}}>{children}</AuthContext.Provider>
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}
