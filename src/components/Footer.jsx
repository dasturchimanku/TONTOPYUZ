import React from "react";
import { useLang } from "../contexts/LangContext";

export default function Footer() {
    const { strings } = useLang();

    return (
        <footer
            className="py-8 mt-auto border-t border-white/20 dark:border-white/10 
                       text-center text-gray-600 dark:text-gray-400 
                       backdrop-blur-lg bg-white/30 dark:bg-gray-900/30
                       transition-all duration-500"
        >
            {/* Matn
            <p className="mb-3 text-sm sm:text-base">{strings.footer}</p> */}

            {/* Telegram havolalari */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-sm">
                <a
                    href="https://t.me/herexuzbotbot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-blue-400/30 
                               text-blue-500 dark:text-blue-400 font-medium 
                               hover:bg-blue-500/10 hover:border-blue-400/60
                               backdrop-blur-md transition-all duration-300"
                >
                    🤖 HEREX Bot
                </a>

                <a
                    href="https://t.me/javokhiroka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-purple-400/30 
                               text-purple-500 dark:text-purple-400 font-medium 
                               hover:bg-purple-500/10 hover:border-purple-400/60
                               backdrop-blur-md transition-all duration-300"
                >
                    💬 Support: @javokhiroka
                </a>
            </div>

            {/* Pastki yozuv */}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                © {new Date().getFullYear()} HEREX.UZ — All rights reserved.
            </p>
        </footer>
    );
}
