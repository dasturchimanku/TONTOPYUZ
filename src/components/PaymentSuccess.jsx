import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const [statusText, setStatusText] = useState("");
    const orderId = params.get("order");
    const paymentStatus = params.get("payment_status");
    const paymentId = params.get("payment_id");

    useEffect(() => {
        if (!paymentStatus) return;

        switch (paymentStatus) {
            case "0":
                setStatusText("✅ To‘lov muvaffaqiyatli amalga oshirildi!");
                break;
            case "1":
                setStatusText("⌛ To‘lov jarayonda. Iltimos, kuting...");
                break;
            case "2":
                setStatusText("❌ To‘lov bekor qilindi yoki amalga oshmadi.");
                break;
            default:
                setStatusText("ℹ️ To‘lov holati noma’lum.");
        }
    }, [paymentStatus]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-6">
            <h1 className="text-3xl font-bold mb-3">{statusText}</h1>

            <div className="text-gray-400 text-sm">
                <p>
                    🧾 Buyurtma raqami:{" "}
                    <span className="text-white">{orderId}</span>
                </p>
                <p>
                    💳 To‘lov ID:{" "}
                    <span className="text-white">{paymentId}</span>
                </p>
            </div>

            <a
                href="/"
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all"
            >
                Bosh sahifaga qaytish
            </a>
        </div>
    );
}
