import { motion } from "framer-motion";

function ServiceCard({ s, className = "" }) {
    return (
        <div
            className={`group relative overflow-hidden rounded-3xl border border-flame-100 bg-white shadow-lg shadow-flame-900/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-flame-500/20 ${className}`}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-flame-900/50 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-5">
                <h3 className="font-display text-lg font-bold text-stone-900">{s.title}</h3>
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-stone-500">{s.description}</p>
            </div>
            <div className="absolute left-4 top-4 rounded-xl bg-flame-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-flame-500/40">
                Xizmat
            </div>
        </div>
    );
}

export default function Services({ services }) {
    if (!services.length) return null;
    return (
        <section id="services" className="relative overflow-hidden bg-flame-50/60 py-20 sm:py-28">
            {/* Bezak doiralar */}
            <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-flame-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-flame-500/10 blur-3xl" />

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="inline-block rounded-full bg-flame-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-flame-600">
                        Nima qilamiz
                    </span>
                    <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
                        OUR <span className="text-flame-500">SERVICES</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-stone-500">
                        Qurilishdan pardozgacha — barcha ishlarni bitta ishonchli jamoa bajaradi.
                    </p>
                </motion.div>
            </div>

            {/* MOBIL: chapdan o'ngga aylanib turadigan karusel */}
            <div className="relative mt-12 md:hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-flame-50 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-flame-50 to-transparent" />
                <div className="overflow-hidden">
                    <div className="services-marquee gap-4 px-4">
                        {[...services, ...services].map((s, i) => (
                            <ServiceCard key={s.id + "-" + i} s={s} className="w-64 shrink-0" />
                        ))}
                    </div>
                </div>
                <p className="mt-4 text-center text-xs font-medium text-stone-400">
                    Karusel avtomatik aylanadi — to'xtatish uchun ushlab turing
                </p>
            </div>

            {/* LAPTOP/DESKTOP: oddiy grid */}
            <div className="mx-auto mt-14 hidden max-w-6xl grid-cols-2 gap-6 px-6 md:grid lg:grid-cols-3">
                {services.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.55, delay: (i % 3) * 0.12 }}
                    >
                        <ServiceCard s={s} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
