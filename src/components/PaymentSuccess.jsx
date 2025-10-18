import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const orderId = params.get("order");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-4">
            <h1 className="text-3xl font-bold mb-3 text-green-400">
                ✅ To‘lov muvaffaqiyatli amalga oshirildi!
            </h1>
            <p className="text-gray-300 mb-2">
                Buyurtma raqami: <span className="text-white">{orderId}</span>
            </p>
            <a
                href="/"
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all"
            >
                Bosh sahifaga qaytish
            </a>
        </div>
    );
}
