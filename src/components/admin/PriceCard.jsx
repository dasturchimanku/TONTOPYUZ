import React from "react";
export default function PriceCard({ price, onEdit }) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-between">
            <div>
                <div className="text-sm text-gray-400 mb-1 uppercase">
                    {price.service}
                </div>
                <div className="text-2xl font-bold">
                    {Number(price.unit_price).toLocaleString()} so'm
                </div>
                {price.meta && (
                    <div className="text-xs text-gray-400 mt-1">
                        {price.meta}
                    </div>
                )}
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={onEdit}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}
