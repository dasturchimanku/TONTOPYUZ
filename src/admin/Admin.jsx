import { useEffect, useState } from "react";
import { LayoutDashboard, Hammer, Images, MessageSquareText, Settings as SettingsIcon, LogOut, Menu, X } from "lucide-react";
import defaultLogo from "../assets/logo.png";
import { api, getToken, setToken, clearToken } from "../api.js";
import Dashboard from "./Dashboard.jsx";
import ServicesAdmin from "./ServicesAdmin.jsx";
import WorksAdmin from "./WorksAdmin.jsx";
import LeadsAdmin from "./LeadsAdmin.jsx";
import SettingsAdmin from "./SettingsAdmin.jsx";

const tabs = [
    { id: "dashboard", label: "Boshqaruv", icon: LayoutDashboard },
    { id: "services", label: "Xizmatlar", icon: Hammer },
    { id: "works", label: "Portfolio", icon: Images },
    { id: "leads", label: "So'rovlar", icon: MessageSquareText },
    { id: "settings", label: "Sozlamalar", icon: SettingsIcon },
];

function Login({ onOk, logoSrc }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { token } = await api.login(password);
            setToken(token);
            onOk();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-flame-600 via-flame-500 to-flame-700 p-4">
            <form onSubmit={submit} className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl">
                <img src={logoSrc} alt="OYNUR BOUW" className="mx-auto h-16" />
                <h1 className="mt-4 text-center font-display text-2xl font-extrabold text-stone-900">
                    Admin <span className="text-flame-500">Panel</span>
                </h1>
                <p className="mt-1 text-center text-sm text-stone-400">OYNUR BOUW boshqaruv paneli</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parol"
                    autoFocus
                    className="mt-6 w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold outline-none transition focus:border-flame-500"
                />
                {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">{error}</p>}
                <button
                    disabled={loading || !password}
                    className="mt-5 w-full rounded-2xl bg-flame-500 py-3.5 font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600 disabled:opacity-50"
                >
                    {loading ? "Tekshirilmoqda..." : "Kirish"}
                </button>
            </form>
        </div>
    );
}

export default function Admin() {
    const [authed, setAuthed] = useState(false);
    const [checking, setChecking] = useState(true);
    const [tab, setTab] = useState("dashboard");
    const [menuOpen, setMenuOpen] = useState(false);
    const [adminLogo, setAdminLogo] = useState("");

    function refreshBranding() {
        api.site()
            .then((d) => setAdminLogo(d.settings?.logo || ""))
            .catch(() => {});
    }

    useEffect(() => {
        if (!getToken()) {
            setChecking(false);
            return;
        }
        api.overview()
            .then(() => {
                setAuthed(true);
                refreshBranding();
            })
            .catch(() => clearToken())
            .finally(() => setChecking(false));
    }, []);

    if (checking) return <div className="flex min-h-screen items-center justify-center text-stone-400">Yuklanmoqda...</div>;
    if (!authed) return <Login onOk={() => setAuthed(true)} logoSrc={adminLogo || defaultLogo} />;

    const brandingLogo = adminLogo || defaultLogo;

    async function logout() {
        try {
            await api.logout();
        } catch {
            /* empty */
        }
        clearToken();
        setAuthed(false);
    }

    return (
        <div className="flex min-h-screen bg-flame-50/50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-stone-950 p-5 transition-transform lg:static lg:translate-x-0 ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center gap-2.5">
                    <img src={brandingLogo} alt="" className="h-9" />
                    <span className="font-display font-extrabold text-white">
                        OYNUR<span className="text-flame-500"> BOUW</span>
                    </span>
                </div>
                <nav className="mt-8 space-y-1.5">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => {
                                setTab(id);
                                setMenuOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                                tab === id ? "bg-flame-500 text-white shadow-lg shadow-flame-500/30" : "text-stone-400 hover:bg-stone-800 hover:text-white"
                            }`}
                        >
                            <Icon size={18} /> {label}
                        </button>
                    ))}
                </nav>
                <div className="absolute inset-x-5 bottom-5 space-y-1.5">
                    <a
                        href="/"
                        className="block w-full rounded-2xl px-4 py-3 text-center text-sm font-bold text-stone-400 transition hover:bg-stone-800 hover:text-white"
                    >
                        Saytga qaytish
                    </a>
                    <button
                        onClick={logout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-800 px-4 py-3 text-sm font-bold text-stone-300 transition hover:bg-red-500/90 hover:text-white"
                    >
                        <LogOut size={16} /> Chiqish
                    </button>
                </div>
            </aside>
            {menuOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMenuOpen(false)} />}

            {/* Content */}
            <main className="min-w-0 flex-1">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-flame-100 bg-white/80 px-5 py-4 backdrop-blur lg:px-8">
                    <div className="flex items-center gap-3">
                        <button className="rounded-xl p-2 hover:bg-flame-50 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <h1 className="font-display text-lg font-extrabold text-stone-900">
                            {tabs.find((t) => t.id === tab)?.label}
                        </h1>
                    </div>
                    <span className="rounded-full bg-flame-500/10 px-3 py-1 text-xs font-bold text-flame-600">Admin</span>
                </header>
                <div className="p-5 lg:p-8">
                    {tab === "dashboard" && <Dashboard goTo={setTab} />}
                    {tab === "services" && <ServicesAdmin />}
                    {tab === "works" && <WorksAdmin />}
                    {tab === "leads" && <LeadsAdmin />}
                    {tab === "settings" && <SettingsAdmin onLogoChanged={refreshBranding} />}
                </div>
            </main>
        </div>
    );
}
