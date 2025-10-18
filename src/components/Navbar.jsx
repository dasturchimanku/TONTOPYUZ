import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LangContext";

export default function Navbar() {
    const { theme, toggle } = useTheme();
    const { lang, setLang } = useLang();

    return (
        <nav
            className="w-full py-4 px-6 flex justify-between items-center
                    bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg
                    border-b border-gray-200 dark:border-gray-700
                    fixed top-0 left-0 z-50 transition-colors duration-300"
        >
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                HEREX.<span className="text-blue-500">UZ</span>
            </h1>

            <div className="flex items-center gap-3">
                <select
                    className="bg-transparent border border-gray-400 dark:border-gray-600 
                     text-gray-900 dark:text-gray-200 
                     px-2 py-1 rounded-md text-sm focus:outline-none"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                >
                    <option value="en">ENG</option>
                    <option value="uz">UZ</option>
                    <option value="ru">RUS</option>
                </select>

                <button
                    onClick={toggle}
                    className="px-3 py-1 rounded-md border border-gray-400 dark:border-gray-600 
                     text-gray-900 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                    {theme === "dark" ? "🌙" : "☀️"}
                </button>
            </div>
        </nav>
    );
}
