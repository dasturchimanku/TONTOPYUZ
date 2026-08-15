import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { api } from "../api.js";
import ImagePicker from "./ImagePicker.jsx";

const empty = { title: "", description: "", image: "", rate: 25 };

export default function ServicesAdmin() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null); // null | {..} | "new"
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const load = () => api.services.list().then(setItems).catch(console.error);
    useEffect(() => {
        load();
    }, []);

    function openNew() {
        setForm(empty);
        setEditing("new");
        setError("");
    }
    function openEdit(item) {
        setForm({ title: item.title, description: item.description, image: item.image, rate: item.rate });
        setEditing(item);
        setError("");
    }

    async function save() {
        setSaving(true);
        setError("");
        try {
            if (editing === "new") await api.services.create(form);
            else await api.services.update(editing.id, form);
            setEditing(null);
            load();
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function remove(id) {
        if (!confirm("Bu xizmatni o'chirishni tasdiqlaysizmi?")) return;
        await api.services.remove(id);
        load();
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">Bosh sahifadagi "Our Services" bo'limi shu yerdan boshqariladi.</p>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 rounded-2xl bg-flame-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600"
                >
                    <Plus size={17} /> Yangi xizmat
                </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((s) => (
                    <div key={s.id} className="overflow-hidden rounded-3xl border border-flame-100 bg-white shadow-sm">
                        <div className="aspect-video bg-flame-50">
                            {s.image && <img src={s.image} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-bold text-stone-900">{s.title}</p>
                                    <p className="text-xs font-semibold text-flame-500">~{s.rate} birlik/m²</p>
                                </div>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => openEdit(s)}
                                        className="rounded-xl p-2 text-stone-500 transition hover:bg-flame-50 hover:text-flame-600"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => remove(s.id)}
                                        className="rounded-xl p-2 text-stone-500 transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 line-clamp-2 text-xs text-stone-400">{s.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {editing !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg font-extrabold text-stone-900">
                                {editing === "new" ? "Yangi xizmat" : "Xizmatni tahrirlash"}
                            </h3>
                            <button onClick={() => setEditing(null)} className="rounded-xl p-2 hover:bg-stone-100">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mt-5 space-y-4">
                            <ImagePicker value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
                            <input
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                placeholder="Xizmat nomi *"
                                className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none focus:border-flame-500"
                            />
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                placeholder="Qisqacha tavsif"
                                rows={3}
                                className="w-full resize-none rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none focus:border-flame-500"
                            />
                            <label className="block">
                                <span className="text-sm font-semibold text-stone-600">
                                    Narx stavkasi (1 m² uchun) — AI kalkulyator shu asosda hisoblaydi
                                </span>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.rate}
                                    onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
                                    className="mt-1.5 w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none focus:border-flame-500"
                                />
                            </label>
                            {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">{error}</p>}
                            <button
                                onClick={save}
                                disabled={saving || !form.title}
                                className="w-full rounded-2xl bg-flame-500 py-3.5 font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600 disabled:opacity-50"
                            >
                                {saving ? "Saqlanmoqda..." : "Saqlash"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
