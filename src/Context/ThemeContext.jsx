import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? JSON.parse(savedTheme) : "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme));
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark")
    }

    useEffect(() => {
        document.body.style.backgroundColor =
            theme === "dark" ? "#ffffff" : "#151515";

        document.body.style.color =
            theme === "dark" ? "#151515" : "#ffffff";
    }, [theme]);

    const getThemeStyle = (theme) => ({
        background: theme === "dark" ? "#ffffff" : "#151515",
        color: theme === "dark" ? "#151515" : "#ffffff",
        transition: "0.3s",
    });

    

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, getThemeStyle }}>
            {children}
        </ThemeContext.Provider>
    )
}