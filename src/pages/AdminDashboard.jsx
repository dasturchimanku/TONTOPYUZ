import React, { useEffect, useState } from "react";
import {
    getPrices,
    updatePrice,
    getPayments,
    adminLogout,
} from "../utils/adminApi";
import PriceCard from "../components/admin/PriceCard";
import PaymentsTable from "../components/admin/PaymentsTable";
import EditPriceModal from "../components/admin/EditPriceModal";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const nav = useNavigate();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [balance, setBalance] = useState(null);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [paymentsState, setPaymentsState] = useState({
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        q: "",
    });

    // 🔐 Token check
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        const expires = parseInt(
            localStorage.getItem("admin_expires") || "0",
            10
        );
        if (!token || Date.now() / 1000 > expires) {
            localStorage.clear();
            nav("/admin/login");
        }
    }, []);

    // 🪙 TON balansni olish
    const fetchBalance = async () => {
        try {
            setBalanceLoading(true);
            const res = await fetch(
                "https://fragment-api.net/v2/getBalance?auth_key=U33YxikGU4xwhMx6Aq9w2Azjyh1kP2nFTf9MV4nFwGE1PN0bgBhKzzAuGlmB5iMJ&wallet_type=v4r2",
                { headers: { accept: "application/json" } }
            );
            const data = await res.json();
            if (data.success) {
                setBalance(data.balance);
            } else {
                setBalance("Error");
            }
        } catch (e) {
            console.error(e);
            setBalance("Error");
        } finally {
            setBalanceLoading(false);
        }
    };

    // 🔁 Har 30s da balansni yangilab turish
    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, []);

    // 🧾 Prices va Payments
    const fetchPrices = async () => {
        setLoading(true);
        const res = await getPrices();
        if (res.success) setPrices(res.data || []);
        setLoading(false);
    };

    const fetchPayments = async (page = 1, pageSize = 10, q = "") => {
        const res = await getPayments(page, pageSize, q);
        if (res.success)
            setPaymentsState((s) => ({
                ...s,
                data: res.data,
                total: res.total,
                page: res.page,
                pageSize: res.pageSize,
            }));
    };

    useEffect(() => {
        fetchPrices();
        fetchPayments();
    }, []);

    const onEdit = (priceItem) => setSelected(priceItem);

    const onSavePrice = async (id, unit_price) => {
        const res = await updatePrice(id, unit_price);
        if (res.success) {
            await fetchPrices();
            setSelected(null);
        } else {
            alert(res.message || "Error");
        }
    };

    const handleLogout = async () => {
        await adminLogout();
        localStorage.clear();
        nav("/admin/login");
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                        Barcha xizmatlar, to‘lovlar va balansni kuzating
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        Signed as <b>{localStorage.getItem("admin_user")}</b>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* TON Balance */}
            <div
                className="mb-8 p-5 rounded-2xl border border-white/10 dark:border-gray-700 
        bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 
        shadow-md hover:shadow-lg transition-all flex justify-between items-center"
            >
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        💎 TON Balans
                    </h2>
                    {balanceLoading ? (
                        <p className="text-gray-500 text-sm mt-1 animate-pulse">
                            Yuklanmoqda...
                        </p>
                    ) : balance === "Error" ? (
                        <p className="text-red-500 text-sm mt-1">
                            Failed to fetch balance
                        </p>
                    ) : (
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                            {balance} TON
                        </p>
                    )}
                </div>
                <button
                    onClick={fetchBalance}
                    disabled={balanceLoading}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    {balanceLoading ? "Yangilanmoqda..." : "Yangilash"}
                </button>
            </div>

            {/* Prices */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Xizmat narxlari
                </h2>
                {loading ? (
                    <div className="text-gray-500 animate-pulse">
                        Yuklanmoqda...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {prices.map((p) => (
                            <PriceCard
                                key={p.id}
                                price={p}
                                onEdit={() => onEdit(p)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Payments */}
            <section>
                <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    To‘lovlar
                </h2>
                <PaymentsTable state={paymentsState} onFetch={fetchPayments} />
            </section>

            {selected && (
                <EditPriceModal
                    price={selected}
                    onClose={() => setSelected(null)}
                    onSave={onSavePrice}
                />
            )}
        </div>
    );
}
