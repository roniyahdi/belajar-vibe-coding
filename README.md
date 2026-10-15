# Belajar Vibe Coding - REST API

REST API backend modern yang dibangun menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## 🛠️ Tech Stack

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [ElysiaJS](https://elysiajs.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database Driver:** [mysql2](https://github.com/sidorares/node-mysql2)
- **Database:** MySQL
- **Documentation:** Elysia Swagger (OpenAPI)

---

## 📁 Struktur Folder

```
├── drizzle/              # File migration SQL yang digenerate oleh Drizzle Kit
├── src/
│   ├── db/
│   │   ├── index.ts      # Koneksi database MySQL dengan Drizzle ORM
│   │   └── schema.ts     # Definisi schema database (tabel users dengan password hash)
│   ├── routes/
│   │   └── users-route.ts # Route endpoint /api/users
│   ├── services/
│   │   └── user-service.ts# Logic bisnis (registrasi user & hashing password)
│   └── index.ts          # Entry point aplikasi Elysia (CORS, Swagger, routes)
├── .env                  # Environment variables lokal
├── .env.example          # Template konfigurasi environment variables
├── drizzle.config.ts     # Konfigurasi Drizzle Kit untuk migration
├── package.json          # Dependencies dan script Bun
├── tsconfig.json         # Konfigurasi TypeScript
└── README.md             # Petunjuk penggunaan
```

---

## 🚀 Panduan Memulai

### 1. Prasyarat

Pastikan Anda telah menginstal:
- [Bun](https://bun.sh/) (v1.0+)
- Server MySQL yang sedang berjalan

### 2. Konfigurasi Environment Variables

Salin file template `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Sesuaikan nilai koneksi database di `.env`:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=belajar_vibe_coding
DATABASE_URL=mysql://root:@127.0.0.1:3306/belajar_vibe_coding
```

> **Catatan:** Pastikan database `belajar_vibe_coding` sudah dibuat di MySQL Anda.

### 3. Migrasi Database

Generate migration SQL:
```bash
bun run db:generate
```

Terapkan migration ke MySQL:
```bash
bun run db:migrate
# atau push schema langsung saat development:
bun run db:push
```

Buka visual database manager (Drizzle Studio):
```bash
bun run db:studio
```

### 4. Menjalankan Server

**Mode Development (dengan auto-reload):**
```bash
bun run dev
```

**Mode Production:**
```bash
bun run start
```

Server akan aktif di: `http://localhost:3000`

---

## 📖 Endpoint API & Dokumentasi

Dokumentasi interaktif OpenAPI / Swagger dapat diakses di:
👉 **[http://localhost:3000/swagger](http://localhost:3000/swagger)**

### Ringkasan Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/` | Health check & info API |
| `GET` | `/swagger` | Swagger UI documentation |
| `POST` | `/api/users` | Registrasi user baru (password di-hash dengan bcrypt) |
| `GET` | `/api/users` | Mengambil seluruh data user |
| `GET` | `/api/users/:id` | Mengambil detail user berdasarkan ID |
| `DELETE` | `/api/users/:id` | Menghapus user berdasarkan ID |

### Contoh Request Registrasi User (`POST /api/users`)

**Request Body:**
```json
{
  "name": "Roni",
  "email": "roni@localhost",
  "password": "rahasia"
}
```

**Response Sukses (HTTP 201):**
```json
{
  "data": "OK"
}
```

**Response Error (Email duplikat - HTTP 400):**
```json
{
  "error": "Email sudah terdaftar"
}
```

---

## 🧪 Validasi Tipe Data

Jalankan type checking dengan:
```bash
bun run typecheck
```
