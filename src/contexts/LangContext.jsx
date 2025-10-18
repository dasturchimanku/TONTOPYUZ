import React, { createContext, useContext, useEffect, useState } from "react";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
    const [lang, setLang] = useState(
        () => localStorage.getItem("lang") || "eng"
    );
    const [strings, setStrings] = useState({});

    useEffect(() => {
        import(`../i18n/${lang}.json`)
            .then((mod) => setStrings(mod.default))
            .catch(() => setStrings({}));
        localStorage.setItem("lang", lang);
    }, [lang]);

    return (
        <LangContext.Provider value={{ lang, setLang, strings }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => useContext(LangContext);
