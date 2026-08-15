import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = createApp({
    dbPath: path.join(__dirname, "db.json"),
    uploadsDir: path.join(__dirname, "uploads"),
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => console.log("API server: http://0.0.0.0:" + PORT));
