import React from "react";

export default function Modal({ open, onClose, children }) {
    if (!open) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-all"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl transition-transform animate-fade-in"
            >
                {children}
            </div>
        </div>
    );
}
