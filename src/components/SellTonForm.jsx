import { useState, useEffect } from "react";

const RATE_PER_TON = 15000; // so'm
const MY_TON_ADDRESS = "UQDwMDn58CqyLEvj6sfDM4E-ChR8BDr3vLM6RkW4MAHu9f6W";

export default function SellTonForm({ t }) {
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [cardNumber, setCardNumber] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPrice(amount > 0 ? amount * RATE_PER_TON : 0);
    }, [amount]);

    const validToSell = amount > 0 && cardNumber && !loading;

    const handleSellTon = async () => {
        if (!validToSell) {
            setError("TON miqdori va karta raqamini kiriting");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // Backend server URL
            const res = await fetch(
                "https://6899d9e381ab8.xvest5.ru/tontopy/sell_ton/createSell.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, card: cardNumber }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                setError("Backendga yuborishda xatolik yuz berdi");
                setLoading(false);
                return;
            }

            // TON Keeper oynasini ochish
            const tonKeeperLink = `https://app.tonkeeper.com/transfer/${MY_TON_ADDRESS}?amount=${amount}&text=TON%20sotish`;
            window.open(tonKeeperLink, "_blank");

            setSuccess(
                `TON yuborish oynasi ochildi. TON muvaffaqiyatli yuborilgandan so‘ng, ${price.toLocaleString()} so'm 24 soat ichida kartangizga o'tkaziladi.`
            );
        } catch (err) {
            console.error(err);
            setError("Server bilan bog‘lanib bo‘lmadi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}

            <input
                type="number"
                min={0.1}
                step={0.1}
                placeholder="TON miqdori"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input"
            />

            <div className="text-lg">
                Narx:{" "}
                <span className="font-bold">{price.toLocaleString()} so'm</span>
            </div>

            <input
                type="text"
                placeholder="Pul olish uchun karta raqami"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.trim())}
                className="input"
            />

            <button
                onClick={handleSellTon}
                disabled={!validToSell}
                className={`w-full px-4 py-3 font-semibold text-white rounded-xl ${
                    validToSell
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-500 cursor-not-allowed"
                }`}
            >
                {loading ? "Yuklanmoqda..." : "TON Sotish"}
            </button>
        </div>
    );
}
