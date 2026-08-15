import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calculator, ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "../api.js";

const qualities = [
    { id: "econom", label: "Ekonom", desc: "Sifatli, hamyonbop materiallar" },
    { id: "standart", label: "Standart", desc: "Narx va sifat muvozanati" },
    { id: "premium", label: "Premium", desc: "Yuqori sinf materiallar" },
];

export default function Estimator({ services, currency }) {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        serviceId: "",
        area: "",
        rooms: "",
        quality: "standart",
        name: "",
        phone: "",
        message: "",
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const canNext =
        step === 0 ? !!form.serviceId : step === 1 ? Number(form.area) > 0 : step === 2 ? true : !!(form.name && form.phone);

    async function submit() {
        setLoading(true);
        setError("");
        try {
            const res = await api.estimate(form);
            setResult(res);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setResult(null);
        setStep(0);
        setForm({ serviceId: "", area: "", rooms: "", quality: "standart", name: "", phone: "", message: "" });
    }

    return (
        <section id="estimator" className="relative overflow-hidden bg-gradient-to-br from-flame-600 via-flame-500 to-flame-700 py-20 sm:py-28">
            {/* Bezaklar */}
            <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-flame-900/30 blur-3xl" />

            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur">
                        <Sparkles size={14} /> AI Estimator
                    </span>
                    <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        Loyihangiz narxini <span className="text-flame-100">hisoblang</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-white/80">
                        Bir necha savolga javob bering — aqlli kalkulyator taxminiy narxni darhol hisoblab beradi, so'rovingiz esa
                        to'g'ridan-to'g'ri menejerimizga boradi.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-12 overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-flame-900/40"
                >
                    {result ? (
                        /* ---------- NATIJA ---------- */
                        <div className="p-8 text-center sm:p-12">
                            <CheckCircle2 size={56} className="mx-auto text-flame-500" />
                            <h3 className="mt-4 font-display text-2xl font-extrabold text-stone-900 sm:text-3xl">
                                Taxminiy narx tayyor!
                            </h3>
                            <div className="mx-auto mt-6 inline-block rounded-3xl bg-flame-50 px-8 py-6">
                                <p className="text-sm font-semibold uppercase tracking-wider text-flame-600">Taxminiy narx</p>
                                <p className="mt-1 font-display text-4xl font-extrabold text-stone-900 sm:text-5xl">
                                    {result.low.toLocaleString()} – {result.high.toLocaleString()} {currency}
                                </p>
                            </div>
                            <p className="mx-auto mt-6 max-w-md text-sm text-stone-500">
                                So'rovingiz qabul qilindi va menejerimizga yuborildi. Tez orada{" "}
                                <b className="text-stone-700">{form.phone}</b> raqamiga qo'ng'iroq qilib, aniq narxni kelishib olamiz.
                            </p>
                            <button
                                onClick={reset}
                                className="mt-8 rounded-2xl bg-flame-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600"
                            >
                                Yana hisoblash
                            </button>
                        </div>
                    ) : (
                        /* ---------- QADAMLAR ---------- */
                        <div className="p-6 sm:p-10">
                            {/* Progress */}
                            <div className="mb-8 flex items-center gap-2">
                                {[0, 1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                            i <= step ? "bg-flame-500" : "bg-flame-100"
                                        }`}
                                    />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {step === 0 && (
                                        <>
                                            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-stone-900">
                                                <Calculator size={20} className="text-flame-500" /> Qaysi xizmat kerak?
                                            </h3>
                                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                {services.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => set("serviceId", s.id)}
                                                        className={`rounded-2xl border-2 p-4 text-left transition ${
                                                            form.serviceId === s.id
                                                                ? "border-flame-500 bg-flame-50 shadow-md shadow-flame-500/20"
                                                                : "border-stone-200 hover:border-flame-300"
                                                        }`}
                                                    >
                                                        <p className="text-sm font-bold text-stone-900">{s.title}</p>
                                                        <p className="mt-1 text-xs text-stone-400">
                                                            ~{s.rate} {currency}/m²
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {step === 1 && (
                                        <>
                                            <h3 className="font-display text-xl font-bold text-stone-900">Obyekt hajmi qancha?</h3>
                                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                                <label className="block">
                                                    <span className="text-sm font-semibold text-stone-600">Maydon (m²) *</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={form.area}
                                                        onChange={(e) => set("area", e.target.value)}
                                                        placeholder="Masalan: 85"
                                                        className="mt-1.5 w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none transition focus:border-flame-500"
                                                    />
                                                </label>
                                                <label className="block">
                                                    <span className="text-sm font-semibold text-stone-600">Xonalar soni</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={form.rooms}
                                                        onChange={(e) => set("rooms", e.target.value)}
                                                        placeholder="Masalan: 3"
                                                        className="mt-1.5 w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none transition focus:border-flame-500"
                                                    />
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <h3 className="font-display text-xl font-bold text-stone-900">Material sifati?</h3>
                                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                                {qualities.map((q) => (
                                                    <button
                                                        key={q.id}
                                                        onClick={() => set("quality", q.id)}
                                                        className={`rounded-2xl border-2 p-5 text-left transition ${
                                                            form.quality === q.id
                                                                ? "border-flame-500 bg-flame-50 shadow-md shadow-flame-500/20"
                                                                : "border-stone-200 hover:border-flame-300"
                                                        }`}
                                                    >
                                                        <p className="font-display font-bold text-stone-900">{q.label}</p>
                                                        <p className="mt-1 text-xs text-stone-400">{q.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {step === 3 && (
                                        <>
                                            <h3 className="font-display text-xl font-bold text-stone-900">
                                                Aloqa ma'lumotlaringiz
                                            </h3>
                                            <p className="mt-1 text-sm text-stone-400">
                                                Natijani ko'rsatamiz va menejer siz bilan bog'lanadi.
                                            </p>
                                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                                <input
                                                    value={form.name}
                                                    onChange={(e) => set("name", e.target.value)}
                                                    placeholder="Ismingiz *"
                                                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none transition focus:border-flame-500"
                                                />
                                                <input
                                                    value={form.phone}
                                                    onChange={(e) => set("phone", e.target.value)}
                                                    placeholder="Telefon raqam *"
                                                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none transition focus:border-flame-500"
                                                />
                                                <textarea
                                                    value={form.message}
                                                    onChange={(e) => set("message", e.target.value)}
                                                    placeholder="Qo'shimcha izoh (ixtiyoriy)"
                                                    rows={3}
                                                    className="w-full resize-none rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none transition focus:border-flame-500 sm:col-span-2"
                                                />
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">{error}</p>}

                            {/* Tugmalar */}
                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                                    disabled={step === 0}
                                    className="flex items-center gap-1.5 rounded-2xl px-5 py-3 text-sm font-bold text-stone-500 transition hover:bg-stone-100 disabled:invisible"
                                >
                                    <ChevronLeft size={18} /> Orqaga
                                </button>
                                {step < 3 ? (
                                    <button
                                        onClick={() => setStep((s) => s + 1)}
                                        disabled={!canNext}
                                        className="flex items-center gap-1.5 rounded-2xl bg-flame-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Keyingisi <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={submit}
                                        disabled={!canNext || loading}
                                        className="flex items-center gap-2 rounded-2xl bg-flame-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                        Narxni hisoblash
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
