import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../utils/api";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const orderId = searchParams.get("order");

    useEffect(() => {
        if (orderId) {
            const check = async () => {
                const res = await getPaymentStatus(orderId);
                setData(res);
            };
            check();
        }
    }, [orderId]);

    if (!data)
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-gray-400">
                Yuklanmoqda...
            </div>
        );

    const success =
        data.status === "success" &&
        data.fragment_response?.includes("success");

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center text-white">
            {success ? (
                <>
                    <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold">
                        Xizmat muvaffaqiyatli sotib olindi 🎉
                    </h2>
                    <p className="text-gray-400 mt-2">
                        Sizga tegishli xizmat ( {data.service} ) muvaffaqiyatli
                        bajarildi.
                    </p>
                </>
            ) : (
                <>
                    <AlertTriangle className="w-20 h-20 text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold">
                        To‘lov kutilmoqda yoki xato yuz berdi
                    </h2>
                    <p className="text-gray-400 mt-2">
                        Buyurtma raqami: #{orderId}
                    </p>
                </>
            )}
        </div>
    );
}
