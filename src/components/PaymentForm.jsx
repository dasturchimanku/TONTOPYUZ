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
    const [amountError, setAmountError] = useState("");
    const [isPaying, setIsPaying] = useState(false); // 🔄 Lokal loader holati
    const { strings } = useLang();

    const isPremium = service?.title?.toLowerCase() === "premium";
    const isVariable = ["star", "ton"].includes(service?.title?.toLowerCase());

    const minStar = 50;
    const minTon = 1;

    // 💰 Narxni hisoblash
    useEffect(() => {
        let total = 0;
        let errorText = "";

        if (isVariable) {
            const amt = parseFloat(amount) || 0;
            if (service.title.toLowerCase() === "star") {
                if (amt > 0 && amt < minStar)
                    errorText = `${strings.min} ${minStar} ${strings.stars}`;
                total = amt * 250;
            } else if (service.title.toLowerCase() === "ton") {
                if (amt > 0 && amt < minTon)
                    errorText = `${strings.min} ${minTon} ${strings.TON}`;
                total = amt * 1000;
            }
        } else if (isPremium) {
            switch (selectedPlan) {
                case "3":
                    total = 1000;
                    break;
                case "6":
                    total = 2000;
                    break;
                case "12":
                    total = 3000;
                    break;
                default:
                    total = 0;
            }
        }

        setAmountError(errorText);
        setPriceUZS(total);
    }, [amount, selectedPlan, service]);

    // 👤 Telegram username orqali userni olish
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
        }, 800);

        return () => clearTimeout(timer);
    }, [username]);

    // 🧭 To‘lovni yuborish
    const handlePayment = async () => {
        if (isPaying) return; // 🔒 Faqat bir marta bosilishi uchun
        setIsPaying(true);
        onPayingChange?.(true); // 🔄 Modaldagi loaderni yoqish

        try {
            const res = await fetch(
                "https://6899d9e381ab8.xvest5.ru/create_payment.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username,
                        service: service.title,
                        priceUZS,
                        amount,
                        plan: selectedPlan,
                    }),
                }
            );

            const data = await res.json();

            if (data.success && data.payment_url) {
                window.location.href = data.payment_url; // Click sahifasiga o‘tish
            } else {
                alert(strings.server_error || "Server xatosi.");
                setIsPaying(false);
                onPayingChange?.(false); // 🔄 Loaderni o‘chirish
            }
        } catch (err) {
            alert(strings.server_error, err);
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
        <div className="w-full max-w-md mx-auto p-6 bg-white/5 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 transition-all duration-300">
            <h2 className="text-xl font-semibold text-center mb-4 text-white dark:text-white/90">
                {service.title} {strings.purchase}
            </h2>

            {/* Username input */}
            <input
                type="text"
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* Loading skeleton */}
            {loading && (
                <div className="flex items-center mt-4 space-x-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-600/40 rounded-full" />
                    <div className="flex-1">
                        <div className="w-32 h-4 bg-gray-600/40 rounded mb-2" />
                        <div className="w-20 h-3 bg-gray-600/40 rounded" />
                    </div>
                </div>
            )}

            {/* Profil topildi */}
            {userInfo && !loading && (
                <div className="flex items-center mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300">
                    {userInfo.photo ? (
                        <img
                            src={userInfo.photo}
                            alt={userInfo.name}
                            className="w-12 h-12 rounded-full border border-white/20"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-500" />
                    )}
                    <div className="ml-3">
                        <p className="text-white font-semibold">
                            {userInfo.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                            @{userInfo.username}
                        </p>
                    </div>
                </div>
            )}

            {/* Profil topilmadi */}
            {error && !loading && (
                <div className="mt-4 text-center text-red-400 bg-red-400/10 p-3 rounded-xl backdrop-blur-md border border-red-400/20 transition-all duration-300">
                    {error}
                </div>
            )}

            {/* To‘lov maydoni */}
            {userInfo && !error && (
                <div className="mt-6 space-y-3 transition-all duration-300">
                    {isVariable && (
                        <>
                            <input
                                type="number"
                                min={
                                    service.title === "Star" ? minStar : minTon
                                }
                                step={service.title === "Star" ? 1 : 0.1}
                                placeholder={`${strings.quantity_amount} (${
                                    service.title === "Star" ? "⭐" : "TON"
                                })`}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            {amountError && (
                                <p className="text-sm text-red-400 text-center">
                                    ⚠️ {amountError}
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
                                    className={`flex-1 mx-1 py-2 rounded-xl border text-sm transition-all ${
                                        selectedPlan === plan
                                            ? "bg-blue-600 text-white border-blue-500"
                                            : "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20"
                                    }`}
                                >
                                    {plan}
                                    {strings.months}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 💸 Dinamik narx */}
                    {priceUZS > 0 && (
                        <div className="text-center mt-3 text-lg font-semibold text-green-400">
                            {priceUZS.toLocaleString()} so‘m
                        </div>
                    )}

                    {/* Pay button */}
                    <button
                        disabled={!canPay}
                        onClick={handlePayment}
                        className={`w-full py-3 mt-2 rounded-xl font-semibold transition-all flex items-center justify-center ${
                            canPay
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-600/40 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {isPaying ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>{strings.sending}</span>
                            </div>
                        ) : (
                            strings.pay_now
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
