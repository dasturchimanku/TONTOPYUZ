export default function Footer() {
    return (
        <footer className="border-t border-[var(--border)] mt-16">
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* LEFT */}
                <div className="text-sm text-[var(--muted)]">
                    © 2026{" "}
                    <span className="font-semibold text-[var(--accent)]">
                        tontopy.uz
                    </span>
                    . All rights reserved.
                </div>

                {/* CENTER */}
                <div className="flex gap-6 text-sm">
                    <a
                        href="#"
                        className="hover:text-[var(--accent)] transition"
                    >
                        Terms
                    </a>
                    <a
                        href="#"
                        className="hover:text-[var(--accent)] transition"
                    >
                        Privacy
                    </a>
                    <a
                        href="#"
                        className="hover:text-[var(--accent)] transition"
                    >
                        AML / KYC
                    </a>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://t.me/YOUR_TELEGRAM_USERNAME"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn px-6 py-2 text-sm"
                    >
                        Support
                    </a>
                </div>
            </div>
        </footer>
    );
}
