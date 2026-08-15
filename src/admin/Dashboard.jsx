import { useEffect, useState } from "react";
import { Hammer, Images, MessageSquareText, BellRing } from "lucide-react";
import { api } from "../api.js";

export default function Dashboard({ goTo }) {
    const [stats, setStats] = useState(null);
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        api.overview().then(setStats).catch(console.error);
        api.leads.list().then((l) => setLeads(l.slice(0, 5))).catch(console.error);
    }, []);

    const cards = [
        { label: "Xizmatlar", value: stats?.services ?? "—", icon: Hammer, tab: "services" },
        { label: "Portfolio rasmlari", value: stats?.works ?? "—", icon: Images, tab: "works" },
        { label: "Jami so'rovlar", value: stats?.leads ?? "—", icon: MessageSquareText, tab: "leads" },
        { label: "Yangi so'rovlar", value: stats?.newLeads ?? "—", icon: BellRing, tab: "leads", hot: true },
    ];

    return (
        <div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map(({ label, value, icon: Icon, tab, hot }) => (
                    <button
                        key={label}
                        onClick={() => goTo(tab)}
                        className={`rounded-3xl border p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                            hot && value > 0
                                ? "border-flame-500 bg-flame-500 text-white shadow-flame-500/30"
                                : "border-flame-100 bg-white"
                        }`}
                    >
                        <Icon size={22} className={hot && value > 0 ? "text-white" : "text-flame-500"} />
                        <p className={`mt-4 font-display text-3xl font-extrabold ${hot && value > 0 ? "text-white" : "text-stone-900"}`}>
                            {value}
                        </p>
                        <p className={`mt-1 text-sm font-semibold ${hot && value > 0 ? "text-white/85" : "text-stone-400"}`}>{label}</p>
                    </button>
                ))}
            </div>

            <div className="mt-8 rounded-3xl border border-flame-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-extrabold text-stone-900">So'nggi so'rovlar</h2>
                    <button onClick={() => goTo("leads")} className="text-sm font-bold text-flame-500 hover:text-flame-600">
                        Hammasini ko'rish →
                    </button>
                </div>
                {leads.length === 0 ? (
                    <p className="mt-5 text-sm text-stone-400">Hozircha so'rovlar yo'q.</p>
                ) : (
                    <div className="mt-4 divide-y divide-flame-50">
                        {leads.map((l) => (
                            <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                                <div>
                                    <p className="font-bold text-stone-800">
                                        {l.name} <span className="font-medium text-stone-400">· {l.phone}</span>
                                    </p>
                                    <p className="text-xs text-stone-400">
                                        {l.serviceTitle} · {l.area} m² · {new Date(l.createdAt).toLocaleString("uz-UZ")}
                                    </p>
                                </div>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                        l.status === "new" ? "bg-flame-500/10 text-flame-600" : "bg-stone-100 text-stone-500"
                                    }`}
                                >
                                    {l.status === "new" ? "Yangi" : l.status === "contacted" ? "Bog'lanildi" : "Yopildi"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
