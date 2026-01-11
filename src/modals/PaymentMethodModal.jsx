export default function PaymentMethodModal({ open, onClose, onSelect }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="card w-full max-w-sm">
                <h3 className="text-xl font-semibold mb-6 text-center">
                    To‘lov usulini tanlang
                </h3>

                <div className="space-y-4">
                    <button
                        onClick={() => onSelect("click")}
                        className="btn w-full"
                    >
                        Click orqali to‘lash
                    </button>

                    <button
                        onClick={() => onSelect("card")}
                        className="btn w-full btn-outline"
                    >
                        Karta orqali to‘lash
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 text-sm text-[var(--muted)] block mx-auto"
                >
                    Bekor qilish
                </button>
            </div>
        </div>
    );
}
