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
                return <Coins className="w-8 h-8 text-blue-500" />;
            case "premium":
                return <Crown className="w-8 h-8 text-purple-500" />;
            default:
                return <Star className="w-8 h-8 text-gray-400" />;
        }
    };

    // Neon blur effekti
    const iconGlow = {
        star: "bg-yellow-400/30",
        ton: "bg-blue-400/30",
        premium: "bg-purple-400/30",
    };
    const iconBgClass = iconGlow[title.toLowerCase()] || "bg-gray-400/30";

    return (
        <div
            onClick={onClick}
            className="relative cursor-pointer group overflow-hidden rounded-2xl p-6 
             shadow-md hover:shadow-lg 
             border border-gray-200 dark:border-white/10 
             bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900
             transition-all duration-500 ease-out flex flex-col justify-between
             hover:scale-[1.02]"
        >
            {/* 🔥 Hover gradient faqat dark rejimda */}
            <div
                className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-500
                 dark:bg-gradient-to-br dark:from-blue-500/10 dark:via-transparent dark:to-purple-600/10"
            />

            {/* Icon + glow */}
            <div className="relative flex items-center justify-center mb-4">
                <div
                    className={`absolute w-16 h-16 rounded-full ${iconBgClass} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
                />
                <div className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {renderIcon()}
                </div>
            </div>

            {/* Title & description */}
            <div className="relative z-10 flex-grow flex flex-col justify-center text-center">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 leading-relaxed transition-colors">
                    {description}
                </p>
            </div>

            {/* Price & action */}
            <div className="relative z-10 mt-auto flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {price}
                </span>
                <span
                    className="inline-flex items-center gap-1 
                    text-blue-600 dark:text-blue-400 font-medium
                    group-hover:text-blue-700 dark:group-hover:text-blue-300 
                    transition-all duration-300 transform translate-y-0 
                    group-hover:-translate-y-[2px]"
                >
                    {strings.select}
                    <span className="text-base leading-none">→</span>
                </span>
            </div>
        </div>
    );
}
