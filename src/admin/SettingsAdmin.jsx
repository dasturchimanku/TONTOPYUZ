import { useEffect, useState } from "react";
import { api, setToken } from "../api.js";

export default function SettingsAdmin() {
    const [form, setForm] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        api.settings.get().then(setForm).catch(console.error);
    }, []);

    if (!form) return <p className="text-stone-400">Yuklanmoqda...</p>;

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    async function save() {
        setSaving(true);
        setMsg("");
        setError("");
        try {
            const payload = { ...form };
            if (newPassword) payload.newPassword = newPassword;
            const updated = await api.settings.update(payload);
            // Parol o'zgargan bo'lsa server yangi token qaytaradi — sessiya uzilmasligi uchun saqlaymiz
            if (updated.token) {
                setToken(updated.token);
                delete updated.token;
            }
            setForm(updated);
            setNewPassword("");
            setMsg("Sozlamalar saqlandi ✓");
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    const fields = [
        ["phone", "Telefon raqam"],
        ["email", "Email"],
        ["address", "Manzil"],
        ["instagram", "Instagram havolasi"],
        ["telegram", "Telegram havolasi"],
        ["currency", "Valyuta belgisi (€, $, so'm)"],
        ["heroTagline", "Bosh sahifa shiori"],
    ];

    return (
        <div className="max-w-xl">
            <div className="rounded-3xl border border-flame-100 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-extrabold text-stone-900">Sayt sozlamalari</h2>
                <div className="mt-5 space-y-4">
                    {fields.map(([key, label]) => (
                        <label key={key} className="block">
                            <span className="text-sm font-semibold text-stone-600">{label}</span>
                            <input
                                value={form[key] || ""}
                                onChange={(e) => set(key, e.target.value)}
                                className="mt-1.5 w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none focus:border-flame-500"
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="mt-6 rounded-3xl border border-flame-100 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-extrabold text-stone-900">Xavfsizlik</h2>
                <label className="mt-4 block">
                    <span className="text-sm font-semibold text-stone-600">Yangi admin parol (bo'sh qoldirsangiz o'zgarmaydi)</span>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Yangi parol"
                        className="mt-1.5 w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none focus:border-flame-500"
                    />
                </label>
            </div>

            {msg && <p className="mt-4 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-bold text-green-600">{msg}</p>}
            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">{error}</p>}

            <button
                onClick={save}
                disabled={saving}
                className="mt-6 w-full rounded-2xl bg-flame-500 py-3.5 font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600 disabled:opacity-50"
            >
                {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
        </div>
    );
}
