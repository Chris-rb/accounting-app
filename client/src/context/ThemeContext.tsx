import React, { createContext, ReactNode, useContext, useState } from "react";


export enum ThemeMode {
    LIGHT = "light",
    DARK = "dark"
}

interface Theme {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<Theme>({mode: ThemeMode.DARK, toggleTheme: () => {}})

export const ThemeProvider = ({children}: {children: ReactNode}) => {
    const [mode, setMode] = useState<ThemeMode>(ThemeMode.DARK);

    const toggleTheme = () => {
        setMode(mode == ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT)
    }

    return <ThemeContext.Provider value={{ mode, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider")
    }
    return context;
}