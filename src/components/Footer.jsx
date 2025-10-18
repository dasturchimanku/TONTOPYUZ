import React from "react";
import { useLang } from "../contexts/LangContext";

export default function Footer() {
    const { strings } = useLang();

    return (
        <footer className="py-6 mt-auto border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <p>{strings.footer}</p>
        </footer>
    );
}
