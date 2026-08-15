import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "db.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/* ---------------- DB ---------------- */
function loadDB() {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
function saveDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
const uid = () => crypto.randomBytes(8).toString("hex");

/* ---------------- Auth ---------------- */
const tokens = new Set();
function auth(req, res, next) {
    const t = (req.headers.authorization || "").replace("Bearer ", "");
    if (!tokens.has(t)) return res.status(401).json({ error: "Avtorizatsiya talab qilinadi" });
    next();
}

/* ---------------- Upload ---------------- */
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOADS_DIR),
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
        cb(null, Date.now() + "-" + crypto.randomBytes(4).toString("hex") + ext);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
        if (/^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype)) cb(null, true);
        else cb(new Error("Faqat rasm fayllari qabul qilinadi"));
    },
});

/* ---------------- App ---------------- */
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "7d" }));

/* ============ PUBLIC ============ */

// Sayt uchun barcha ma'lumot
app.get("/api/site", (_, res) => {
    const db = loadDB();
    const { adminPassword, ...publicSettings } = db.settings;
    res.json({
        settings: publicSettings,
        services: db.services.sort((a, b) => a.order - b.order),
        works: db.works.sort((a, b) => a.order - b.order),
    });
});

// AI Estimator — narx hisoblash va lead saqlash
app.post("/api/estimate", (req, res) => {
    const { name, phone, serviceId, area, rooms, quality, message } = req.body || {};
    if (!name || !phone || !serviceId || !area) {
        return res.status(400).json({ error: "Ism, telefon, xizmat va maydon majburiy" });
    }
    const db = loadDB();
    const service = db.services.find((s) => s.id === serviceId);
    if (!service) return res.status(400).json({ error: "Xizmat topilmadi" });

    const qualityFactor = { econom: 1, standart: 1.35, premium: 1.85 }[quality] || 1;
    const a = Math.max(1, Number(area) || 1);
    const r = Math.max(0, Number(rooms) || 0);
    const base = service.rate * a * qualityFactor + r * service.rate * 2.5;
    const low = Math.round((base * 0.9) / 50) * 50;
    const high = Math.round((base * 1.2) / 50) * 50;

    const lead = {
        id: uid(),
        createdAt: new Date().toISOString(),
        status: "new",
        name: String(name).slice(0, 100),
        phone: String(phone).slice(0, 40),
        serviceId,
        serviceTitle: service.title,
        area: a,
        rooms: r,
        quality: quality || "econom",
        message: String(message || "").slice(0, 500),
        estimateLow: low,
        estimateHigh: high,
    };
    db.leads.unshift(lead);
    saveDB(db);
    res.json({ low, high, currency: db.settings.currency, leadId: lead.id });
});

/* ============ ADMIN ============ */

app.post("/api/admin/login", (req, res) => {
    const db = loadDB();
    if ((req.body?.password || "") !== db.settings.adminPassword) {
        return res.status(401).json({ error: "Parol noto'g'ri" });
    }
    const token = crypto.randomBytes(24).toString("hex");
    tokens.add(token);
    res.json({ token });
});

app.post("/api/admin/logout", auth, (req, res) => {
    tokens.delete((req.headers.authorization || "").replace("Bearer ", ""));
    res.json({ ok: true });
});

app.get("/api/admin/overview", auth, (_, res) => {
    const db = loadDB();
    res.json({
        services: db.services.length,
        works: db.works.length,
        leads: db.leads.length,
        newLeads: db.leads.filter((l) => l.status === "new").length,
    });
});

/* ---- Rasm yuklash ---- */
app.post("/api/admin/upload", auth, upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Rasm yuborilmadi" });
    res.json({ url: "/uploads/" + req.file.filename });
});

/* ---- Services CRUD ---- */
app.get("/api/admin/services", auth, (_, res) => {
    res.json(loadDB().services.sort((a, b) => a.order - b.order));
});
app.post("/api/admin/services", auth, (req, res) => {
    const db = loadDB();
    const { title, description, image, rate } = req.body || {};
    if (!title) return res.status(400).json({ error: "Sarlavha majburiy" });
    const item = {
        id: uid(),
        title,
        description: description || "",
        image: image || "",
        rate: Number(rate) || 10,
        order: db.services.length,
    };
    db.services.push(item);
    saveDB(db);
    res.json(item);
});
app.put("/api/admin/services/:id", auth, (req, res) => {
    const db = loadDB();
    const item = db.services.find((s) => s.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Topilmadi" });
    const { title, description, image, rate, order } = req.body || {};
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (image !== undefined) item.image = image;
    if (rate !== undefined) item.rate = Number(rate) || item.rate;
    if (order !== undefined) item.order = Number(order);
    saveDB(db);
    res.json(item);
});
app.delete("/api/admin/services/:id", auth, (req, res) => {
    const db = loadDB();
    db.services = db.services.filter((s) => s.id !== req.params.id);
    saveDB(db);
    res.json({ ok: true });
});

/* ---- Works CRUD ---- */
app.get("/api/admin/works", auth, (_, res) => {
    res.json(loadDB().works.sort((a, b) => a.order - b.order));
});
app.post("/api/admin/works", auth, (req, res) => {
    const db = loadDB();
    const { title, category, image } = req.body || {};
    if (!image) return res.status(400).json({ error: "Rasm majburiy" });
    const item = {
        id: uid(),
        title: title || "",
        category: category || "",
        image,
        order: db.works.length,
    };
    db.works.push(item);
    saveDB(db);
    res.json(item);
});
app.put("/api/admin/works/:id", auth, (req, res) => {
    const db = loadDB();
    const item = db.works.find((w) => w.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Topilmadi" });
    const { title, category, image, order } = req.body || {};
    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (image !== undefined) item.image = image;
    if (order !== undefined) item.order = Number(order);
    saveDB(db);
    res.json(item);
});
app.delete("/api/admin/works/:id", auth, (req, res) => {
    const db = loadDB();
    db.works = db.works.filter((w) => w.id !== req.params.id);
    saveDB(db);
    res.json({ ok: true });
});

/* ---- Leads ---- */
app.get("/api/admin/leads", auth, (_, res) => {
    res.json(loadDB().leads);
});
app.put("/api/admin/leads/:id", auth, (req, res) => {
    const db = loadDB();
    const lead = db.leads.find((l) => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: "Topilmadi" });
    if (req.body?.status) lead.status = req.body.status;
    saveDB(db);
    res.json(lead);
});
app.delete("/api/admin/leads/:id", auth, (req, res) => {
    const db = loadDB();
    db.leads = db.leads.filter((l) => l.id !== req.params.id);
    saveDB(db);
    res.json({ ok: true });
});

/* ---- Settings ---- */
app.get("/api/admin/settings", auth, (_, res) => {
    const { adminPassword, ...rest } = loadDB().settings;
    res.json(rest);
});
app.put("/api/admin/settings", auth, (req, res) => {
    const db = loadDB();
    const allowed = ["phone", "email", "address", "instagram", "telegram", "currency", "heroTagline"];
    for (const k of allowed) {
        if (req.body?.[k] !== undefined) db.settings[k] = String(req.body[k]);
    }
    if (req.body?.newPassword) {
        if (String(req.body.newPassword).length < 4)
            return res.status(400).json({ error: "Parol kamida 4 belgi bo'lsin" });
        db.settings.adminPassword = String(req.body.newPassword);
    }
    saveDB(db);
    const { adminPassword, ...rest } = db.settings;
    res.json(rest);
});

app.use((err, _req, res, _next) => {
    res.status(400).json({ error: err.message || "Server xatosi" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => console.log("API server: http://0.0.0.0:" + PORT));
