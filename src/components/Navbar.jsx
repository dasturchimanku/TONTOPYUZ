import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import defaultLogo from "../assets/logo.png";

const links = [
    { href: "#home", label: "Bosh sahifa" },
    { href: "#services", label: "Xizmatlar" },
    { href: "#works", label: "Ishlarimiz" },
    { href: "#estimator", label: "Narx hisoblash" },
    { href: "#contact", label: "Aloqa" },
];

export default function Navbar({ phone, logo }) {
    const logoSrc = logo || defaultLogo;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
            <nav
                className={`glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 shadow-lg shadow-black/5 transition-all duration-300 sm:px-6 ${
                    scrolled ? "bg-white/75" : ""
                }`}
            >
                {/* Logo */}
                <a href="#home" className="flex items-center gap-2.5">
                    <img src={logoSrc} alt="OYNUR BOUW logo" className="h-10 w-auto drop-shadow-sm" />
                    <span className="font-display text-lg font-extrabold tracking-tight text-stone-900">
                        OYNUR<span className="text-flame-500"> BOUW</span>
                    </span>
                </a>

                {/* Desktop links */}
                <ul className="hidden items-center gap-1 lg:flex">
                    {links.map((l) => (
                        <li key={l.href}>
                            <a
                                href={l.href}
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-flame-500/10 hover:text-flame-600"
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2">
                    {phone && (
                        <a
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="hidden items-center gap-2 rounded-xl bg-flame-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-flame-500/30 transition hover:bg-flame-600 sm:flex"
                        >
                            <Phone size={16} />
                            {phone}
                        </a>
                    )}
                    <button
                        onClick={() => setOpen(!open)}
                        className="rounded-xl p-2 text-stone-800 transition hover:bg-flame-500/10 lg:hidden"
                        aria-label="Menyu"
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-3 shadow-xl lg:hidden">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 transition hover:bg-flame-500/10 hover:text-flame-600"
                        >
                            {l.label}
                        </a>
                    ))}
                    {phone && (
                        <a
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-flame-500 px-4 py-3 text-sm font-bold text-white"
                        >
                            <Phone size={16} /> {phone}
                        </a>
                    )}
                </div>
            )}
        </header>
    );
}
