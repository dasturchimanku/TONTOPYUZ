export default function SupportModal({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="card w-80">
                <h3 className="text-xl font-semibold mb-4">Support</h3>
                <p className="text-sm text-[var(--muted)] mb-4">
                    Biz bilan Telegram orqali bog‘laning
                </p>
                <a
                    href="https://t.me/YOUR_TELEGRAM_USERNAME"
                    target="_blank"
                    className="btn w-full"
                >
                    Telegram
                </a>
            </div>
        </div>
    );
}
