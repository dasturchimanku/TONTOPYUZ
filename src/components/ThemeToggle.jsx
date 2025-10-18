import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function ThemeToggle() {
    const { theme, setTheme } = useContext(ThemeContext);
    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1 rounded border"
        >
            {theme === "dark" ? "Light" : "Dark"}
        </button>
    );
}
