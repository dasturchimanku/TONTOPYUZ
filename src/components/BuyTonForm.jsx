import { useState, useEffect } from "react";
import { createPayment } from "../services/paymentService";

const RATE_API = "https://6899d9e381ab8.xvest5.ru/tontopy/get-rate.php";

function isValidTonAddress(address) {
    return (
        address?.startsWith("UQ") &&
        address.length >= 48 &&
        address.length <= 50
    );
}

export default function BuyTonForm({ t }) {
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validAddress = isValidTonAddress(address);

    // 🔥 Narxni API orqali olish
    useEffect(() => {
        if (!amount || amount <= 0) {
            setPrice(0);
            return;
        }
        const controller = new AbortController();
        fetch(`${RATE_API}?amount=${amount}`, { signal: controller.signal })
            .then((res) => res.json())
            .then((data) => setPrice(data?.price ? Number(data.price) : 0))
            .catch(() => setPrice(0));
        return () => controller.abort();
    }, [amount]);

    async function handleContinue() {
        if (!validAddress) return setError(t.invalid);
        if (amount <= 0) return setError("Noto‘g‘ri miqdor");
        if (!price) return setError("Narx aniqlanmadi");

        setLoading(true);
        setError("");

        try {
            const res = await createPayment({
                address,
                amount,
                priceUZS: price,
                paymentMethod: "click",
            });
            if (res?.success && res.payment_url) {
                window.location.href = res.payment_url;
            } else {
                setError(res?.error || "To‘lovga yo‘naltirib bo‘lmadi");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError("Server bilan bog‘lanib bo‘lmadi");
            setLoading(false);
        }
    }

    const validToPay = validAddress && amount > 0 && price > 0 && !loading;

    return (
        <div className="space-y-5">
            {error && <div className="text-red-500">{error}</div>}

            <input
                value={address}
                onChange={(e) => setAddress(e.target.value.trim())}
                placeholder={t.address}
                className={`input ${
                    address && !validAddress ? "border-red-500" : ""
                }`}
            />

            <input
                type="number"
                min={0.1}
                step={0.1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input"
            />

            <div className="flex justify-between text-lg">
                <span>{t.price}:</span>
                <span className="font-bold text-[var(--accent)]">
                    {price ? price.toLocaleString() : "—"} UZS
                </span>
            </div>

            <button
                onClick={handleContinue}
                disabled={!validToPay}
                className={`w-full px-4 py-3 font-semibold text-white rounded-xl ${
                    validToPay
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        : "bg-gray-500 cursor-not-allowed"
                }`}
            >
                {loading ? "Yuklanmoqda..." : t.pay}
            </button>
        </div>
    );
}
