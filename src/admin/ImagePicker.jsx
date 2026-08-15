import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { api } from "../api.js";

/** Rasm yuklash komponenti — fayl tanlash yoki sudrab tashlash */
export default function ImagePicker({ value, onChange }) {
    const inputRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [drag, setDrag] = useState(false);

    async function handleFile(file) {
        if (!file) return;
        setLoading(true);
        setError("");
        try {
            const { url } = await api.upload(file);
            onChange(url);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    handleFile(e.dataTransfer.files?.[0]);
                }}
                className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
                    drag ? "border-flame-500 bg-flame-50" : "border-stone-300 hover:border-flame-400 hover:bg-flame-50/50"
                } ${value ? "aspect-video" : "h-36"}`}
            >
                {value ? (
                    <>
                        <img src={value} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                            <span className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-stone-800">Almashtirish</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-stone-400">
                        {loading ? (
                            <Loader2 className="mx-auto animate-spin text-flame-500" size={28} />
                        ) : (
                            <>
                                <UploadCloud className="mx-auto text-flame-400" size={28} />
                                <p className="mt-2 text-sm font-semibold">Rasm tanlang yoki shu yerga tashlang</p>
                                <p className="text-xs">JPG, PNG, WEBP · maks. 8 MB</p>
                            </>
                        )}
                    </div>
                )}
                {loading && value && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="animate-spin text-flame-500" size={30} />
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
        </div>
    );
}
