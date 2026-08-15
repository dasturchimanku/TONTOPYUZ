# OYNUR BOUW — Qurilish va Ta'mirlash sayti

Zamonaviy qurilish kompaniyasi veb-sayti: glass navbar, 16:9 video banner, xizmatlar karuseli, portfolio, AI narx kalkulyatori va to'liq admin panel.

## Texnologiyalar

- **Frontend:** React 19 + Vite + Tailwind CSS 4 + Framer Motion
- **Backend:** Express + Multer (rasm yuklash) + JSON fayl bazasi (`server/db.json`)

## Ishga tushirish

```bash
npm install

# 1-terminal: API server (port 3001)
npm run server

# 2-terminal: frontend (port 5173)
npm run dev
```

Vite dev server `/api` va `/uploads` so'rovlarini avtomatik ravishda 3001-portga proxy qiladi.

## Sahifalar

| Yo'l | Tavsif |
| --- | --- |
| `/` | Asosiy sayt (hero video, Our Services, Our Work, AI Estimator, footer) |
| `/admin` | Admin panel |

## Admin panel

- **Standart parol:** `oynur2026` (Sozlamalar bo'limida o'zgartirish mumkin)
- **Boshqaruv:** statistika va so'nggi so'rovlar
- **Xizmatlar:** qo'shish/tahrirlash/o'chirish + rasm yuklash + m² narx stavkasi (AI kalkulyator shu asosda hisoblaydi)
- **Portfolio:** "Our Work" rasmlarini yuklash va boshqarish (drag & drop qo'llab-quvvatlanadi)
- **So'rovlar:** AI Estimator orqali kelgan leadlar — status (Yangi / Bog'lanildi / Yopildi)
- **Sozlamalar:** telefon, email, manzil, ijtimoiy tarmoqlar, valyuta, shior, parol

## AI Estimator

Mijoz 4 qadamda xizmat, maydon, sifat darajasi va aloqa ma'lumotlarini kiritadi. Server xizmat stavkasi asosida narx oralig'ini hisoblab beradi va so'rov avtomatik ravishda admin panelga (So'rovlar bo'limiga) tushadi.

## Fayl tuzilishi

```
server/
  index.js      — Express API (auth, CRUD, upload, estimator)
  db.json       — ma'lumotlar bazasi
  uploads/      — yuklangan rasmlar
src/
  components/   — sayt bo'limlari (Navbar, Hero, Services, Works, Estimator, Footer)
  admin/        — admin panel sahifalari
  api.js        — API klient
public/media/   — hero video (16:9) va poster
```
