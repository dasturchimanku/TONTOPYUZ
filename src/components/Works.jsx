import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Works({ works }) {
    const [active, setActive] = useState(null);
    if (!works.length) return null;

    return (
        <section id="works" className="bg-white py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="inline-block rounded-full bg-flame-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-flame-600">
                        Portfolio
                    </span>
                    <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
                        OUR <span className="text-flame-500">WORK</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-stone-500">
                        Bajargan loyihalarimizdan namunalar — har bir ishga mehr bilan yondashamiz.
                    </p>
                </motion.div>

                {/* Masonry — rasmlar har xil joylashadi */}
                <div className="mt-14 columns-2 gap-4 sm:gap-5 lg:columns-3 [column-fill:_balance]">
                    {works.map((w, i) => (
                        <motion.button
                            key={w.id}
                            onClick={() => setActive(w)}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                            className="group relative mb-4 block w-full cursor-zoom-in overflow-hidden rounded-3xl sm:mb-5"
                        >
                            <img
                                src={w.image}
                                alt={w.title || "Ish namunasi"}
                                loading="lazy"
                                className="w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                {w.category && (
                                    <span className="rounded-lg bg-flame-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                                        {w.category}
                                    </span>
                                )}
                                {w.title && <p className="mt-2 font-display text-base font-bold text-white">{w.title}</p>}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/85 p-4 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActive(null)}
                    >
                        <button
                            className="absolute right-5 top-5 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-flame-500"
                            onClick={() => setActive(null)}
                            aria-label="Yopish"
                        >
                            <X size={22} />
                        </button>
                        <motion.figure
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: "spring", damping: 26, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-[85vh] max-w-4xl"
                        >
                            <img
                                src={active.image}
                                alt={active.title || ""}
                                className="max-h-[78vh] w-auto rounded-2xl object-contain shadow-2xl"
                            />
                            {(active.title || active.category) && (
                                <figcaption className="mt-3 text-center text-white">
                                    <span className="font-display font-bold">{active.title}</span>
                                    {active.category && <span className="ml-2 text-sm text-flame-300">· {active.category}</span>}
                                </figcaption>
                            )}
                        </motion.figure>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
