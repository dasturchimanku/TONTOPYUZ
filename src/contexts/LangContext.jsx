import React, { createContext, useContext, useEffect, useState } from "react";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
    const [lang, setLang] = useState(
        () => localStorage.getItem("lang") || "uz"
    );
    const [strings, setStrings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStrings = async () => {
            setLoading(true);
            try {
                // i18n faylni dinamik import
                const mod = await import(`../i18n/${lang}.json`);
                setStrings(mod.default);
            } catch (err) {
                console.error("Til fayli yuklanmadi:", err);
                setStrings({});
            } finally {
                setLoading(false);
            }
        };
        loadStrings();
        localStorage.setItem("lang", lang);
    }, [lang]);

    // 🟢 Fallback (til yuklanmaguncha)
    if (loading || !strings) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
                <div className="animate-pulse text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <LangContext.Provider value={{ lang, setLang, strings }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => useContext(LangContext);
