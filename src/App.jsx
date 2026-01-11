import { useState } from "react";
import { motion } from "framer-motion";
import translations from "./i18n/translations";
import { useTheme } from "./hooks/useTheme";

import Header from "./components/Header";
import TonLogo from "./components/TonLogo";
import BuySellTabs from "./components/BuySellTabs";
import BuyTonForm from "./components/BuyTonForm"; // sotib olish
import SellTonForm from "./components/SellTonForm"; // sotish
import Footer from "./components/Footer";

export default function App() {
    const { themeMode, setThemeMode } = useTheme();
    const [lang, setLang] = useState("uz");
    const [mode, setMode] = useState("buy"); // "buy" yoki "sell"

    const t = translations[lang];

    return (
        <div className="min-h-screen px-4 pt-28">
            <Header
                lang={lang}
                setLang={setLang}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
            />

            <div className="flex justify-center mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card w-full max-w-xl"
                >
                    {/* Buy/Sell Tabs */}
                    <BuySellTabs mode={mode} setMode={setMode} t={t} />

                    {/* Sarlavha */}
                    <h2 className="text-3xl font-semibold flex justify-center gap-3 mb-2">
                        <TonLogo />
                        {t[mode]}
                    </h2>

                    <p className="text-center text-[var(--muted)] mb-6">
                        {mode === "buy" ? t.introBuy : t.introSell}
                    </p>

                    {/* ============================ */}
                    {/* MODEGA KO‘RA ALOHIDA FORM */}
                    {/* ============================ */}
                    {mode === "buy" ? (
                        <BuyTonForm
                            t={{
                                address: "TON manzilingizni kiriting",
                                price: "Narx",
                                pay: "Davom etish",
                                invalid: "Noto‘g‘ri manzil",
                            }}
                        />
                    ) : (
                        <SellTonForm t={{}} />
                    )}
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
