import { useEffect, useState } from "react";
import { ACCENT_COLOR } from "../constants/config";

export function useTheme() {
    const [themeMode, setThemeMode] = useState(
        () => localStorage.getItem("themeMode") || "system"
    );

    useEffect(() => {
        const html = document.documentElement;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            const theme =
                themeMode === "system"
                    ? mq.matches
                        ? "dark"
                        : "light"
                    : themeMode;

            html.classList.remove("dark", "light");
            html.classList.add(theme);
            html.style.setProperty("--accent", ACCENT_COLOR);
        };

        applyTheme();
        mq.addEventListener("change", applyTheme);
        localStorage.setItem("themeMode", themeMode);

        return () => mq.removeEventListener("change", applyTheme);
    }, [themeMode]);

    return { themeMode, setThemeMode };
}
