import React, { useState } from "react";
import ServiceCard from "../components/ServiceCard";
import ServiceModal from "../components/ServiceModal";
import { useLang } from "../contexts/LangContext";

export default function Home() {
    const [selectedService, setSelectedService] = useState(null);
    const { strings } = useLang();

    const services = [
        {
            title: "Star",
            price: "",
            description: strings.star_detail,
        },
        {
            title: "Premium",
            price: "",
            description: strings.premium_detail,
        },
        {
            title: "Ton",
            price: "",
            description: strings.ton_detail,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 py-12 px-4">
            <h1
                className="text-3xl font-bold mb-4 
               bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
               bg-clip-text text-transparent 
               dark:from-blue-400 dark:via-purple-300 dark:to-pink-300
               drop-shadow-sm"
            >
                {strings.services}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
                {services.map((s, i) => (
                    <ServiceCard
                        key={i}
                        {...s}
                        onClick={() => setSelectedService(s)}
                    />
                ))}
            </div>

            {/* Modal */}
            <ServiceModal
                show={!!selectedService}
                onClose={() => setSelectedService(null)}
                service={selectedService || {}}
            />
        </div>
    );
}
