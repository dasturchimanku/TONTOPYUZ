import { useEffect, useState } from "react";
import { Trash2, Phone } from "lucide-react";
import { api } from "../api.js";

const statusOpts = [
    { id: "new", label: "Yangi", cls: "bg-flame-500/10 text-flame-600" },
    { id: "contacted", label: "Bog'lanildi", cls: "bg-blue-50 text-blue-600" },
    { id: "closed", label: "Yopildi", cls: "bg-stone-100 text-stone-500" },
];

export default function LeadsAdmin() {
    const [leads, setLeads] = useState([]);
    const [filter, setFilter] = useState("all");

    const load = () => api.leads.list().then(setLeads).catch(console.error);
    useEffect(() => {
        load();
    }, []);

    async function setStatus(id, status) {
        await api.leads.update(id, { status });
        load();
    }
    async function remove(id) {
        if (!confirm("So'rovni o'chirishni tasdiqlaysizmi?")) return;
        await api.leads.remove(id);
        load();
    }

    const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);
    const qualityLabel = { econom: "Ekonom", standart: "Standart", premium: "Premium" };

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                        filter === "all" ? "bg-flame-500 text-white" : "bg-white text-stone-500 hover:bg-flame-50"
                    }`}
                >
                    Barchasi ({leads.length})
                </button>
                {statusOpts.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setFilter(s.id)}
                        className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                            filter === s.id ? "bg-flame-500 text-white" : "bg-white text-stone-500 hover:bg-flame-50"
                        }`}
                    >
                        {s.label} ({leads.filter((l) => l.status === s.id).length})
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <p className="mt-10 text-center text-sm text-stone-400">So'rovlar topilmadi.</p>
            ) : (
                <div className="mt-6 space-y-4">
                    {filtered.map((l) => (
                        <div key={l.id} className="rounded-3xl border border-flame-100 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="font-display text-lg font-extrabold text-stone-900">{l.name}</p>
                                    <a
                                        href={`tel:${l.phone.replace(/\s/g, "")}`}
                                        className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-bold text-flame-500 hover:text-flame-600"
                                    >
                                        <Phone size={14} /> {l.phone}
                                    </a>
                                    <p className="mt-1 text-xs text-stone-400">{new Date(l.createdAt).toLocaleString("uz-UZ")}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={l.status}
                                        onChange={(e) => setStatus(l.id, e.target.value)}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-bold outline-none ${
                                            statusOpts.find((s) => s.id === l.status)?.cls || ""
                                        }`}
                                    >
                                        {statusOpts.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => remove(l.id)}
                                        className="rounded-xl p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-3 rounded-2xl bg-flame-50/70 p-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-stone-400">Xizmat</p>
                                    <p className="font-bold text-stone-800">{l.serviceTitle}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-stone-400">Maydon</p>
                                    <p className="font-bold text-stone-800">{l.area} m²</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-stone-400">Xonalar</p>
                                    <p className="font-bold text-stone-800">{l.rooms || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-stone-400">Sifat</p>
                                    <p className="font-bold text-stone-800">{qualityLabel[l.quality] || l.quality}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-stone-400">AI narx</p>
                                    <p className="font-bold text-flame-600">
                                        {l.estimateLow?.toLocaleString()} – {l.estimateHigh?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {l.message && <p className="mt-3 rounded-2xl bg-stone-50 p-4 text-sm italic text-stone-600">"{l.message}"</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
