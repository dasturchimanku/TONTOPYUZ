import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { api } from "../api.js";
import ImagePicker from "./ImagePicker.jsx";

const empty = { title: "", category: "", image: "" };

export default function WorksAdmin() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const load = () => api.works.list().then(setItems).catch(console.error);
    useEffect(() => {
        load();
    }, []);

    function openNew() {
        setForm(empty);
        setEditing("new");
        setError("");
    }
    function openEdit(item) {
        setForm({ title: item.title, category: item.category, image: item.image });
        setEditing(item);
        setError("");
    }

    async function save() {
        setSaving(true);
        setError("");
        try {
            if (editing === "new") await api.works.create(form);
            else await api.works.update(editing.id, form);
            setEditing(null);
            load();
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function remove(id) {
        if (!confirm("Bu rasmni portfolio'dan o'chirishni tasdiqlaysizmi?")) return;
        await api.works.remove(id);
        load();
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">"Our Work" portfolio rasmlari — yangi rasm qo'shing yoki almashtiring.</p>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 rounded-2xl bg-flame-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600"
                >
                    <Plus size={17} /> Rasm qo'shish
                </button>
            </div>

            <div className="mt-6 columns-2 gap-4 md:columns-3 xl:columns-4">
                {items.map((w) => (
                    <div key={w.id} className="group relative mb-4 overflow-hidden rounded-2xl border border-flame-100 bg-white shadow-sm">
                        <img src={w.image} alt="" className="w-full object-cover" />
                        <div className="absolute inset-0 flex flex-col justify-between bg-black/45 p-3 opacity-0 transition group-hover:opacity-100">
                            <div className="flex justify-end gap-1.5">
                                <button
                                    onClick={() => openEdit(w)}
                                    className="rounded-xl bg-white/90 p-2 text-stone-700 transition hover:bg-white"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    onClick={() => remove(w.id)}
                                    className="rounded-xl bg-white/90 p-2 text-red-600 transition hover:bg-white"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                            <div className="text-white">
                                {w.category && <p className="text-[11px] font-bold uppercase text-flame-300">{w.category}</p>}
                                {w.title && <p className="text-sm font-bold">{w.title}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editing !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg font-extrabold text-stone-900">
                                {editing === "new" ? "Yangi portfolio rasmi" : "Rasmni tahrirlash"}
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
                                placeholder="Sarlavha (ixtiyoriy)"
                                className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none focus:border-flame-500"
                            />
                            <input
                                value={form.category}
                                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                placeholder="Kategoriya (masalan: Interyer, Fasad)"
                                className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none focus:border-flame-500"
                            />
                            {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">{error}</p>}
                            <button
                                onClick={save}
                                disabled={saving || !form.image}
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
