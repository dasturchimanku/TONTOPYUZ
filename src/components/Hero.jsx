import { motion } from "framer-motion";
import { ArrowDown, HardHat, ShieldCheck, Clock } from "lucide-react";
import logo from "../assets/logo.png";

export default function Hero({ tagline }) {
    return (
        <section id="home" className="relative w-full overflow-hidden bg-stone-950">
            {/* 16:9 video banner */}
            <div className="relative aspect-video max-h-[92vh] min-h-[520px] w-full">
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/media/hero.mp4"
                    poster="/media/hero-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                {/* Overlaylar */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
                <div className="absolute inset-0 bg-gradient-to-tr from-flame-900/40 via-transparent to-transparent" />

                {/* Kontent */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <motion.img
                        src={logo}
                        alt="OYNUR BOUW"
                        className="mb-5 h-20 w-auto drop-shadow-[0_0_25px_rgba(249,115,22,0.55)] sm:h-28"
                        initial={{ opacity: 0, y: 25, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7 }}
                    />
                    <motion.h1
                        className="hero-title font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        OYNUR <span className="text-flame-500">BOUW</span>
                    </motion.h1>
                    <motion.p
                        className="mt-4 max-w-2xl text-base font-medium text-white/85 sm:text-xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        {tagline || "Qurilish va ta'mirlashda ishonchli hamkoringiz"}
                    </motion.p>

                    <motion.div
                        className="mt-8 flex flex-wrap items-center justify-center gap-3"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                    >
                        <a
                            href="#estimator"
                            className="rounded-2xl bg-flame-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-flame-500/40 transition hover:-translate-y-0.5 hover:bg-flame-600 sm:text-base"
                        >
                            Narxni hisoblash
                        </a>
                        <a
                            href="#works"
                            className="glass-dark rounded-2xl px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20 sm:text-base"
                        >
                            Ishlarimizni ko'rish
                        </a>
                    </motion.div>

                    {/* Glass badge-lar */}
                    <motion.div
                        className="mt-10 hidden items-center gap-3 sm:flex"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.65 }}
                    >
                        {[
                            { icon: HardHat, text: "10+ yillik tajriba" },
                            { icon: ShieldCheck, text: "Sifat kafolati" },
                            { icon: Clock, text: "O'z vaqtida topshirish" },
                        ].map(({ icon: Icon, text }) => (
                            <div
                                key={text}
                                className="glass-dark flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white/90"
                            >
                                <Icon size={17} className="text-flame-400" />
                                {text}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Pastga strelka */}
                <a
                    href="#services"
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full p-2 text-white/70 transition hover:text-flame-400"
                    aria-label="Pastga"
                >
                    <ArrowDown className="animate-bounce" size={26} />
                </a>
            </div>
        </section>
    );
}
