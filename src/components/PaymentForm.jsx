import React, { useState, useEffect } from "react";
import { getTelegramUser } from "../utils/getTelegramUser";
import { useLang } from "../contexts/LangContext";

export default function PaymentForm({ service, onPayingChange }) {
    const [username, setUsername] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [priceUZS, setPriceUZS] = useState(0);
    const [prices, setPrices] = useState({});
    const [amountError, setAmountError] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const { strings } = useLang();

    const isPremium = service?.title?.toLowerCase() === "premium";
    const isVariable = ["star", "ton"].includes(service?.title?.toLowerCase());
    const minStar = 50;
    const minTon = 1;

    // 🧩 Narxlarni MySQL’dan olish
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    "https://6899d9e381ab8.xvest5.ru/get_prices.php"
                );
                const data = await res.json();
                if (data.success) setPrices(data.prices);
            } catch (err) {
                console.error("❌ Narxlarni olishda xato:", err);
            }
        })();
    }, []);

    // 💰 Dinamik hisob
    useEffect(() => {
        let total = 0;
        let errorText = "";

        const title = service.title.toLowerCase();
        const amt = parseFloat(amount) || 0;

        if (isVariable) {
            const pricePer =
                title === "star" ? prices.star || 0 : prices.ton || 0;

            // ⚙️ faqat foydalanuvchi qiymat kiritgan bo‘lsa tekshiramiz
            if (amount !== "") {
                if (title === "star" && amt < minStar)
                    errorText = `${strings.min} ${minStar} ${strings.stars}`;
                if (title === "ton" && amt < minTon)
                    errorText = `${strings.min} ${minTon} ${strings.TON}`;
            }

            total = amt * pricePer;
        } else if (isPremium) {
            if (selectedPlan === "3") total = prices.premium3 || 0;
            if (selectedPlan === "6") total = prices.premium6 || 0;
            if (selectedPlan === "12") total = prices.premium12 || 0;
        }

        setAmountError(errorText);
        setPriceUZS(total);
    }, [amount, selectedPlan, service, prices, strings]);

    // 👤 Telegram foydalanuvchi
    useEffect(() => {
        if (!username) {
            setUserInfo(null);
            setError(null);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            setError(null);
            const user = await getTelegramUser(username);
            setLoading(false);
            if (user) {
                setUserInfo(user);
                setError(null);
            } else {
                setUserInfo(null);
                setError(strings.user_not_found);
            }
        }, 700);

        return () => clearTimeout(timer);
    }, [username, strings]);

    // 💳 To‘lov
    const handlePayment = async () => {
        if (isPaying) return;
        setIsPaying(true);
        onPayingChange?.(true);

        try {
            const payload = {
                username,
                service: service.title.toLowerCase(),
                priceUZS,
                amount: isPremium ? selectedPlan : amount,
            };

            const res = await fetch(
                "https://6899d9e381ab8.xvest5.ru/create_payment.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();
            if (data.success && data.payment_url) {
                window.location.href = data.payment_url;
            } else {
                alert(strings.server_error || "Server xatosi.");
                setIsPaying(false);
                onPayingChange?.(false);
            }
        } catch (err) {
            console.error("⚠️ Xatolik:", err);
            alert(strings.server_error || "Server bilan bog‘lanishda xatolik.");
            setIsPaying(false);
            onPayingChange?.(false);
        }
    };

    const validAmount =
        !amountError &&
        ((isPremium && selectedPlan) ||
            (isVariable &&
                parseFloat(amount) >=
                    (service.title.toLowerCase() === "star"
                        ? minStar
                        : minTon)));

    const canPay = userInfo && validAmount && !isPaying;

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white/5 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-xl font-semibold text-center mb-4 text-white dark:text-white/90">
                {service.title} {strings.purchase}
            </h2>

            {/* Username */}
            <input
                type="text"
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />

            {/* Telegram user */}
            {loading && (
                <p className="text-gray-400 text-center mt-4">Loading...</p>
            )}
            {userInfo && (
                <div className="mt-4 flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                    <img
                        src={userInfo.photo}
                        alt="user"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="text-white font-medium">
                            {userInfo.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                            @{userInfo.username}
                        </p>
                    </div>
                </div>
            )}
            {error && (
                <p className="text-red-400 text-center mt-3 bg-red-400/10 rounded-lg p-2">
                    {error}
                </p>
            )}

            {/* Amount or plan */}
            {userInfo && !error && (
                <div className="mt-6 space-y-3">
                    {isVariable && (
                        <>
                            <input
                                type="number"
                                min={
                                    service.title === "Star" ? minStar : minTon
                                }
                                placeholder={`${strings.quantity_amount} (${
                                    service.title === "Star" ? "⭐" : "TON"
                                })`}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                            />
                            {amountError && (
                                <p className="text-red-400 text-center text-sm">
                                    {amountError}
                                </p>
                            )}
                        </>
                    )}

                    {isPremium && (
                        <div className="flex justify-between">
                            {["3", "6", "12"].map((plan) => (
                                <button
                                    key={plan}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`flex-1 mx-1 py-2 rounded-xl text-sm border ${
                                        selectedPlan === plan
                                            ? "bg-blue-600 text-white border-blue-500"
                                            : "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20"
                                    }`}
                                >
                                    {plan} {strings.months}
                                </button>
                            ))}
                        </div>
                    )}

                    {priceUZS > 0 && (
                        <div className="text-center mt-3 text-lg font-semibold text-green-400">
                            {priceUZS.toLocaleString()} so‘m
                        </div>
                    )}

                    <button
                        disabled={!canPay}
                        onClick={handlePayment}
                        className={`w-full py-3 mt-2 rounded-xl font-semibold flex items-center justify-center ${
                            canPay
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-600/40 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {isPaying ? strings.sending : strings.pay_now}
                    </button>
                </div>
            )}
        </div>
    );
}
