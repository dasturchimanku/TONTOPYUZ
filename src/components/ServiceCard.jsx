import React from "react";
import { Star, Crown, Coins } from "lucide-react";

export default function ServiceCard({ title, price, description, onClick }) {
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
                 border border-white/10 backdrop-blur-md 
                 bg-gradient-to-br from-gray-800/90 to-gray-900/90 
                 dark:from-gray-900/80 dark:to-black/80
                 hover:scale-[1.03] transition-transform duration-300"
        >
            {/* Icon + blur */}
            <div className="relative flex items-center justify-center mb-4">
                <div
                    className={`absolute w-16 h-16 rounded-full ${iconBgClass} blur-2xl animate-pulse`}
                />
                <div className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {renderIcon()}
                </div>
            </div>

            {/* Text qismi */}
            <h3 className="text-2xl font-semibold mb-2 text-white dark:text-white/90 text-center">
                {title}
            </h3>
            <p className="text-gray-400 text-sm mb-5 text-center">
                {description}
            </p>

            {/* Price va action */}
            <div className="flex justify-between items-center mt-auto">
                <span className="text-lg font-bold text-white dark:text-white/90">
                    {price}
                </span>
                <span className="text-blue-400 font-medium group-hover:text-blue-300 transition">
                    Select →
                </span>
            </div>
        </div>
    );
}
