// Vercel serverless funksiyasi — barcha /api/* va /uploads/* so'rovlari shu yerga tushadi.
// Diqqat: Vercel'da faqat /tmp yozish mumkin, shuning uchun db.json va yangi yuklangan
// rasmlar /tmp da saqlanadi (sovuq startda boshlang'ich holatga qaytadi).
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "../server/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedDir = path.join(__dirname, "..", "server");

const app = createApp({
    dbPath: "/tmp/oynur-db.json",
    uploadsDir: "/tmp/oynur-uploads",
    seedDbPath: path.join(seedDir, "db.json"),
    seedUploadsDir: path.join(seedDir, "uploads"),
});

export default app;
