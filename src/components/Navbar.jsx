import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LangContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { theme, toggle } = useTheme();
    const { lang, setLang } = useLang();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: "uz", label: "UZ" },
        { code: "en", label: "EN" },
        { code: "ru", label: "RU" },
    ];

    const selectedLang = languages.find((l) => l.code === lang);

    // Tashqariga bosilganda menyuni yopish
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav
            className="w-full py-3 px-6 flex justify-between items-center fixed top-0 left-0 z-50 
                       bg-gradient-to-r from-blue-200/70 via-purple-100/50 to-pink-100/40
                       dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/70
                       backdrop-blur-xl border-b border-white/20 dark:border-white/10
                       shadow-[0_4px_30px_rgba(59,130,246,0.15)]
                       transition-all duration-500"
        >
            {/* 🔷 Logo */}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                {" "}
                HEREX.<span className="text-blue-500">UZ</span>{" "}
            </h1>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* 🌍 Language Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-between gap-2 min-w-[70px]
                                   bg-white/30 dark:bg-white/10
                                   border border-white/30 dark:border-white/20
                                   text-gray-900 dark:text-gray-100
                                   px-3 py-1.5 rounded-xl text-sm font-medium
                                   shadow-sm backdrop-blur-lg
                                   hover:bg-white/40 dark:hover:bg-white/20
                                   transition-all duration-300"
                    >
                        <span>{selectedLang?.label || "UZ"}</span>
                        <motion.span
                            animate={{ rotate: open ? 180 : 0 }}
                            className="text-gray-600 dark:text-gray-400 text-[10px]"
                        >
                            ▼
                        </motion.span>
                    </button>

                    {/* Dropdown menyu */}
                    <AnimatePresence>
                        {open && (
                            <motion.ul
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-full rounded-xl overflow-hidden
                                           bg-gradient-to-b from-white/90 via-white/70 to-white/60
                                           dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/90
                                           backdrop-blur-2xl border border-white/20 dark:border-white/10
                                           shadow-lg z-50"
                            >
                                {languages.map((l) => (
                                    <li
                                        key={l.code}
                                        onClick={() => {
                                            setLang(l.code);
                                            setOpen(false);
                                        }}
                                        className={`px-3 py-1.5 text-sm text-center cursor-pointer 
                                                   hover:bg-blue-100/60 dark:hover:bg-blue-600/30
                                                   transition-all duration-200 ${
                                                       l.code === lang
                                                           ? "text-blue-600 dark:text-blue-400 font-semibold"
                                                           : "text-gray-800 dark:text-gray-200"
                                                   }`}
                                    >
                                        {l.label}
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                {/* 🌓 Theme Toggle */}
                <button
                    onClick={toggle}
                    className="w-8 h-8 rounded-xl flex items-center justify-center
                               bg-white/30 dark:bg-white/10
                               border border-white/30 dark:border-white/20
                               hover:bg-blue-100/50 dark:hover:bg-white/20
                               text-base text-gray-800 dark:text-gray-200
                               shadow-sm backdrop-blur-lg
                               transition-all duration-300"
                    title={theme === "dark" ? "Dark mode" : "Light mode"}
                >
                    {theme === "dark" ? "🌙" : "☀️"}
                </button>
            </div>
        </nav>
    );
}
