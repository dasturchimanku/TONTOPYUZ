import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaymentForm from "./PaymentForm";
import { Star, Coins, Crown } from "lucide-react";

export default function ServiceModal({ show, onClose, service }) {
    const [isPaying, setIsPaying] = useState(false); // 🔒 To‘lov jarayonida bloklash

    if (!service) return null;

    // Xizmatga qarab icon tanlaymiz
    const renderIcon = () => {
        switch (service?.title?.toLowerCase()) {
            case "star":
                return <Star className="w-10 h-10 text-yellow-400" />;
            case "ton":
                return <Coins className="w-10 h-10 text-blue-400" />;
            case "premium":
                return <Crown className="w-10 h-10 text-purple-400" />;
            default:
                return <Star className="w-10 h-10 text-gray-300" />;
        }
    };

    // Blur glow ranglari
    const iconGlow = {
        star: "bg-yellow-400/30 blur-2xl",
        ton: "bg-blue-400/30 blur-2xl",
        premium: "bg-purple-400/30 blur-2xl",
    };
    const iconBgClass =
        iconGlow[service?.title?.toLowerCase()] || "bg-gray-400/30 blur-2xl";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !isPaying && onClose()} // 🔒 to‘lov paytida yopilmasin
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                        }}
                        className="relative w-[90%] max-w-md bg-gradient-to-br from-gray-900/80 to-gray-800/80 
                                   text-white rounded-2xl p-6 shadow-xl backdrop-blur-xl border border-white/10 overflow-hidden"
                    >
                        {/* Blur orqa fon effekti */}
                        <div
                            className={`absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full ${iconBgClass} opacity-40`}
                        ></div>

                        {/* Header */}
                        <div className="relative flex flex-col items-center text-center mb-6 z-10">
                            <div className="relative flex items-center justify-center mb-3">
                                <div
                                    className={`absolute w-16 h-16 rounded-full ${iconBgClass} opacity-60 blur-2xl animate-pulse`}
                                ></div>
                                <div className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                                    {renderIcon()}
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold">
                                {service.title}
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {service.description}
                            </p>
                        </div>

                        {/* Payment form */}
                        <PaymentForm
                            service={service}
                            onPayingChange={setIsPaying} // 🔄 Loader boshqaruvi
                        />

                        {/* Yopish tugmasi */}
                        {!isPaying && (
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
                            >
                                ✕
                            </button>
                        )}

                        {/* 🔄 To‘lov loader */}
                        {isPaying && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
                                <div className="w-8 h-8 border-4 border-white/60 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-sm text-gray-300">
                                    To‘lov jarayoni davom etmoqda...
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
