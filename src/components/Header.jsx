import React, { useContext } from "react";
import ThemeToggle from "./ThemeToggle";
import { LangContext } from "../contexts/LangContext";

export default function Header() {
    const { langKey, setLangKey, t } = useContext(LangContext);

    return (
        <header className="flex items-center justify-between py-4">
            <div className="text-xl font-bold">{t.siteName}</div>
            <div className="flex items-center gap-4">
                <select
                    value={langKey}
                    onChange={(e) => setLangKey(e.target.value)}
                    className="bg-transparent border rounded px-2 py-1"
                >
                    <option value="en">ENG</option>
                    <option value="uz">UZ</option>
                    <option value="ru">RUS</option>
                </select>
                <ThemeToggle />
            </div>
        </header>
    );
}
