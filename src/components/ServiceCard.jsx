import React from "react";
import { Star, Crown, Coins } from "lucide-react";
import { useLang } from "../contexts/LangContext";

export default function ServiceCard({ title, price, description, onClick }) {
    const { strings } = useLang();
    // Xizmat turiga qarab icon tanlaymiz
    const renderIcon = () => {
        switch (title.toLowerCase()) {
            case "star":
                return <Star className="w-8 h-8 text-yellow-400" />;
            case "ton":
                return <Coins className="w-8 h-8 text-blue-400" />;
            case "premium":
                return <Crown className="w-8 h-8 text-purple-400" />;
            default:
                return <Star className="w-8 h-8 text-gray-300" />;
        }
    };

    // Icon orqasida blur effect (neon style)
    const iconGlow = {
        star: "bg-yellow-400/30 blur-2xl",
        ton: "bg-blue-400/30 blur-2xl",
        premium: "bg-purple-400/30 blur-2xl",
    };

    const iconBgClass =
        iconGlow[title.toLowerCase()] || "bg-gray-400/30 blur-2xl";

    return (
        <div
            onClick={onClick}
            className="relative cursor-pointer group overflow-hidden rounded-2xl p-6 shadow-lg 
             border border-white/10 backdrop-blur-lg 
             bg-gradient-to-br from-white/20 via-gray-200/10 to-transparent 
             dark:from-gray-800/70 dark:via-gray-900/60 dark:to-black/80
             hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]
             transition-all duration-500 ease-out flex flex-col justify-between"
        >
            {/* Icon + blur */}
            <div className="relative flex items-center justify-center mb-4">
                <div
                    className={`absolute w-16 h-16 rounded-full ${iconBgClass} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
                />
                <div className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {renderIcon()}
                </div>
            </div>

            {/* Text qismi */}
            <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white text-center transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 text-center leading-relaxed transition-colors">
                    {description}
                </p>
            </div>

            {/* Price va action (har doim pastda) */}
            <div className="mt-auto flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {price}
                </span>
                <span
                    className="inline-flex items-center gap-1 text-blue-500 dark:text-blue-400 
                 font-medium group-hover:text-blue-300 
                 transition-all duration-300 transform translate-y-0 
                 group-hover:translate-y-[-2px]"
                >
                    {strings.select}
                    <span className="text-base leading-none">→</span>
                </span>
            </div>
        </div>
    );
}
