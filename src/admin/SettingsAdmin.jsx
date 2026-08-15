import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api, setToken } from "../api.js";
import ImagePicker from "./ImagePicker.jsx";
import defaultLogo from "../assets/logo.png";

export default function SettingsAdmin({ onLogoChanged }) {
    const [form, setForm] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [logoSaving, setLogoSaving] = useState(false);
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

    async function saveLogo(logoUrl) {
        setLogoSaving(true);
        setError("");
        try {
            const updated = await api.settings.update({ logo: logoUrl });
            setForm((f) => ({ ...f, ...updated }));
            onLogoChanged?.();
        } catch (e) {
            setError(e.message);
        } finally {
            setLogoSaving(false);
        }
    }

    async function clearLogo() {
        setLogoSaving(true);
        setError("");
        try {
            const updated = await api.settings.update({ logo: "" });
            setForm((f) => ({ ...f, ...updated }));
            onLogoChanged?.();
        } catch (e) {
            setError(e.message);
        } finally {
            setLogoSaving(false);
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
                <h2 className="font-display text-lg font-extrabold text-stone-900">Logo</h2>
                <p className="mt-1 text-sm text-stone-500">
                    Sayt logosi — navbar, footer va admin panelda ko'rsatiladi. Bo'sh qoldirilsa standart OYNUR BOUW logosi ishlatiladi.
                </p>

                <div className="mt-5 flex items-start gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-stone-200 bg-white p-2">
                        <img src={form.logo || defaultLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <ImagePicker
                            value={form.logo || ""}
                            onChange={(url) => {
                                set("logo", url);
                                saveLogo(url);
                            }}
                        />
                        {form.logo && (
                            <button
                                onClick={clearLogo}
                                disabled={logoSaving}
                                className="mt-2 inline-flex items-center gap-1.5 rounded-xl border-2 border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-500 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                            >
                                <Trash2 size={14} /> Standart logoga qaytarish
                            </button>
                        )}
                        {logoSaving && <p className="mt-2 text-xs font-semibold text-flame-600">Logo saqlanmoqda...</p>}
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-3xl border border-flame-100 bg-white p-6 shadow-sm">
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
