import React, { useState } from "react";
import ServiceCard from "../components/ServiceCard";
import ServiceModal from "../components/ServiceModal";

export default function Home() {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            title: "Star",
            price: "$5",
            description: "1 oy davomida premium yulduzli xizmat",
        },
        {
            title: "Premium",
            price: "$10",
            description: "Qo‘shimcha afzalliklar va tezkor qo‘llab-quvvatlash",
        },
        {
            title: "Ton",
            price: "$20",
            description: "Eng yuqori darajadagi VIP xizmat",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 py-12 px-4">
            <h1 className="text-3xl font-bold mb-4 text-white">
                HEREX Services
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
