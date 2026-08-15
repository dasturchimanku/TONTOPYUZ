import { Phone, Mail, MapPin, Instagram, Send } from "lucide-react";
import logo from "../assets/logo.png";

export default function Footer({ settings }) {
    return (
        <footer id="contact" className="bg-stone-950 pt-16 text-stone-300">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 sm:px-6 md:grid-cols-3">
                <div>
                    <div className="flex items-center gap-2.5">
                        <img src={logo} alt="OYNUR BOUW" className="h-10 w-auto" />
                        <span className="font-display text-lg font-extrabold text-white">
                            OYNUR<span className="text-flame-500"> BOUW</span>
                        </span>
                    </div>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
                        Qurilish va ta'mirlash bo'yicha professional jamoa. Har bir loyihaga sifat, aniqlik va mas'uliyat bilan
                        yondashamiz.
                    </p>
                </div>

                <div>
                    <h4 className="font-display text-sm font-bold uppercase tracking-widest text-flame-500">Bo'limlar</h4>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {[
                            ["#home", "Bosh sahifa"],
                            ["#services", "Xizmatlar"],
                            ["#works", "Ishlarimiz"],
                            ["#estimator", "Narx hisoblash"],
                        ].map(([href, label]) => (
                            <li key={href}>
                                <a href={href} className="transition hover:text-flame-400">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-display text-sm font-bold uppercase tracking-widest text-flame-500">Aloqa</h4>
                    <ul className="mt-4 space-y-3 text-sm">
                        {settings.phone && (
                            <li>
                                <a
                                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                                    className="flex items-center gap-2.5 transition hover:text-flame-400"
                                >
                                    <Phone size={16} className="text-flame-500" /> {settings.phone}
                                </a>
                            </li>
                        )}
                        {settings.email && (
                            <li>
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="flex items-center gap-2.5 transition hover:text-flame-400"
                                >
                                    <Mail size={16} className="text-flame-500" /> {settings.email}
                                </a>
                            </li>
                        )}
                        {settings.address && (
                            <li className="flex items-center gap-2.5">
                                <MapPin size={16} className="text-flame-500" /> {settings.address}
                            </li>
                        )}
                    </ul>
                    <div className="mt-5 flex gap-3">
                        {settings.instagram && (
                            <a
                                href={settings.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl bg-stone-800 p-2.5 transition hover:bg-flame-500 hover:text-white"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                        )}
                        {settings.telegram && (
                            <a
                                href={settings.telegram}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl bg-stone-800 p-2.5 transition hover:bg-flame-500 hover:text-white"
                                aria-label="Telegram"
                            >
                                <Send size={18} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-stone-800 py-5">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-stone-500 sm:flex-row sm:px-6">
                    <p>© {new Date().getFullYear()} OYNUR BOUW. Barcha huquqlar himoyalangan.</p>
                    <a href="/admin" className="transition hover:text-flame-400">
                        Admin panel
                    </a>
                </div>
            </div>
        </footer>
    );
}
