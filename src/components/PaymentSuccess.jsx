import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const orderId = params.get("order");

    useEffect(() => {
        console.log("To‘lov ID:", orderId);
    }, [orderId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-4">
            <h1 className="text-3xl font-bold mb-4">
                ✅ To‘lov muvaffaqiyatli amalga oshirildi!
            </h1>
            <p className="text-gray-300">Buyurtma raqami: {orderId}</p>
            <a
                href="/"
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all"
            >
                Bosh sahifaga qaytish
            </a>
        </div>
    );
}
