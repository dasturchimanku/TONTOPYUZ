import { useEffect, useState } from "react";
import { createPayment } from "../services/paymentService";

const RATE_API = "https://6899d9e381ab8.xvest5.ru/tontopy/get-rate.php";
const MY_TON_ADDRESS = "UQDwMDn58CqyLEvj6sfDM4E-ChR8BDr3vLM6RkW4MAHu9f6W"; // sizning adres

function isValidTonAddress(address) {
    return (
        address?.startsWith("UQ") &&
        address.length >= 48 &&
        address.length <= 50
    );
}

export default function TradeForm({
    t,
    amount,
    setAmount,
    address,
    setAddress,
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [price, setPrice] = useState(0);
    const [cardNumber, setCardNumber] = useState(""); // sotish uchun karta

    const validAddress = isValidTonAddress(address);

    // 🔥 PRICE NI API ORQALI OLISH
    useEffect(() => {
        if (!amount || amount <= 0) {
            setPrice(0);
            return;
        }

        const controller = new AbortController();

        fetch(`${RATE_API}?amount=${amount}`, {
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.price) {
                    setPrice(Number(data.price));
                } else {
                    setPrice(0);
                }
            })
            .catch(() => setPrice(0));

        return () => controller.abort();
    }, [amount]);

    // ============================
    // TON SOTIB OLISH FUNKSIYASI (OLDI)
    // ============================
    async function handlePayment() {
        if (loading) return;
        setLoading(true);
        setError("");

        try {
            const payload = {
                address,
                amount,
                priceUZS: price,
                paymentMethod: "click",
            };

            const res = await createPayment(payload);

            if (!res?.success) {
                setError(res?.error || "To‘lov yaratilmadi");
                setLoading(false);
                return;
            }

            if (res.provider === "click" && res.payment_url) {
                window.location.href = res.payment_url;
                return;
            }

            setError("To‘lovga yo‘naltirib bo‘lmadi");
        } catch (err) {
            console.error(err);
            setError("Server bilan bog‘lanib bo‘lmadi");
            setLoading(false);
        }
    }

    function handleContinue() {
        if (!validAddress) return setError(t.invalid);
        if (amount <= 0) return setError("Noto‘g‘ri miqdor");
        if (!price) return setError("Narx aniqlanmadi");

        handlePayment();
    }

    const validToPay = validAddress && amount > 0 && price > 0 && !loading;

    // ============================
    // TON SOTISH FUNKSIYASI (YANGI)
    // ============================
    const validToSell = amount > 0 && cardNumber;

    const handleSellTon = () => {
        if (!validToSell) {
            setError("TON miqdori va karta raqamini kiriting");
            return;
        }
        setError("");

        // TON Keeper link
        const tonKeeperLink = `https://app.tonkeeper.com/transfer/${MY_TON_ADDRESS}?amount=${amount}&text=TON%20sotish`;

        // Linkni yangi oynada ochish
        window.open(tonKeeperLink, "_blank");

        // Foydalanuvchiga xabar berish
        alert(
            `TON yuborish oynasi ochildi.\nTON muvaffaqiyatli yuborilgandan so‘ng, ${price.toLocaleString()} so'm 24 soat ichida kartangizga o'tkaziladi.`
        );
    };

    return (
        <div className="space-y-5">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* ======================== */}
            {/* TON MANZIL VA MIQDOR INPUT */}
            {/* ======================== */}
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

            {/* ======================== */}
            {/* KARTA RAQAMI (SOTISH UCHUN) */}
            {/* ======================== */}
            <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.trim())}
                placeholder="Pul olish uchun karta raqami"
                className="input"
            />

            {/* ======================== */}
            {/* SOTIB OLISH TUGMASI */}
            {/* ======================== */}
            <button
                onClick={handleContinue}
                disabled={!validToPay}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition-all duration-200
                    ${
                        validToPay
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                            : "bg-gray-500 cursor-not-allowed"
                    }`}
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                        <span>Yuklanmoqda...</span>
                    </>
                ) : (
                    t.pay
                )}
            </button>

            {/* ======================== */}
            {/* SOTISH TUGMASI */}
            {/* ======================== */}
            <button
                onClick={handleSellTon}
                disabled={!validToSell}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition-all duration-200
                    ${
                        validToSell
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-500 cursor-not-allowed"
                    }`}
            >
                TON Sotish
            </button>
        </div>
    );
}
