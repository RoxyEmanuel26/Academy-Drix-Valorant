# Academy Drix Valorant Discord Bot

Bot Discord berbasis Node.js & TypeScript yang diciptakan khusus untuk komunitas VALORANT yang mengutamakan *fun gaming experience* (tidak tryhard!). Terintegrasi secara resmi (via *Riot Sign On* / RSO) dan aman menggunakan VALORANT API tanpa memodifikasi data in-game.

---

## 🚀 Fitur Utama

- **🔗 Amankan Akun dengan RSO (Riot Sign On)**
  Sinkronisasi akun game pengguna secara aman via OAuth2, 100% mematuhi *Riot Games Policy*. Tidak pernah meminta password!
- **📊 Personal Stats Tracker**
  Pantau rank dan persentase kemenangan (Winrate) dari pertarungan terakhirmu.
- **🏆 Poin Ekonomi & Leaderboard Global**
  Adu mekanik secara sehat dengan Leaderboard berbasis In-Game Stats atau Leaderboard Minigames! Setiap user punya profil poin pribadi.
- **🎯 Sistem Misi Harian & Mingguan**
  Selesaikan misi seru langsung dari Discord untuk mendapatkan *Badge* atau pengakuan di server.
- **🎲 Ekosistem Fun & Games Interaktif**
  Tersedia puluhan Minigames (Tebak Map, Emoji Agent, Susun Kata / Scramble, dan Kuis VALORANT) berhadiah poin, plus *Daily Challenges* (multiplier rewards) & *Polling/Personality Tests* kasual (This or That, Would you Rather).
- **🎮 Looking For Party (LFP)**
  Cari teman party (Competitive / Unrated) secara praktis dan tertata langsung di satu channel. LFP otomatis lock dan mendeteksi ketersediaan Voice Channel si pembuat!
- **🚩 Turnamen Komunitas Internal**
  Sistem pendaftaran dan pembuatan bracket minim (khusus administrasi turnamen santai).
- **💡 Helper Interaktif (`/help` & `!help`)**
  Eksplorasi ribuan perintah dengan antarmuka Menu Dropdown modern (String Select Menu) tanpa menyepam channel text.

---

## 🛠 Teknologi & Persyaratan Sistem

- **Node.js** v18 atau lebih baru.
- **TypeScript** sebagai core language.
- **Discord.js** v14 untuk interaksi API Discord terkini.
- **MongoDB** (Lokal/Atlas) + **Mongoose** sebagai Database.
- **Axios** untuk komunikasi dengan RIOT API.

---

## ⚙️ Persiapan Instalasi

Ikuti langkah-langkah di bawah untuk memulai server bot di perangkat lokal Anda.

### 1. Kloning Repositori
```bash
git clone https://github.com/UsernameKamu/Academy-Drix-Valorant.git
cd Academy-Drix-Valorant
```

### 2. Instalasi Ketergantungan (Dependencies)
Gunakan `npm` untuk menginstal modul yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env`)
Salin file template lingkungan:
```bash
cp config/.env.example config/.env
```
Buka file `config/.env` dan lengkapi detail berikut:

**A. Kredensial Discord**
- `DISCORD_TOKEN`: Token App Discord. (Dapatkan di [Discord Developer Portal](https://discord.com/developers/applications))
- `DISCORD_CLIENT_ID`: ID Aplikasi dari bot Anda.
- `DISCORD_GUILD_ID`: (Opsional) ID Server pengujian Anda. Digunakan agar *Slash Commands* diregistrasi lebih cepat.

**B. Database**
- `MONGO_URI`: Ekstensi database MongoDB Anda. Contoh tes lokal: `mongodb://127.0.0.1:27017/academy_drix_valorant`.

**C. Riot Games API & RSO**
- Dapatkan kunci pengembang di [Riot Developer Portal](https://developer.riotgames.com/).
- `RIOT_API_KEY`: Kunci akses (Personal/Production key).
- `RIOT_RSO_CLIENT_ID`: Client ID untuk Riot Sign On.
- `RIOT_RSO_CLIENT_SECRET`: Kunci Rahasia untuk Riot Sign On.
- `RIOT_RSO_REDIRECT_URI`: Endpoint pengembalian setelah login RSO sukses (misalnya: `http://localhost:3000/callback`).

**D. Konfigurasi Feature Flags**
Bot ini mendukung *Modular Features*, jika Anda belum memiliki kunci RIOT API, Anda dapat mematikan beberapa flag menjadi `false` (contoh: ubah `FF_VAL_STATS=true` menjadi `false`) agar bot tetap bisa berjalan menggunakan fitur-fitur santainya tanpa menyebabkan error.

### 4. Menjalankan Bot

**Mode Pengembangan (Auto-Reload saat kodingan diubah)**
```bash
npm run dev
```

**Mode Produksi (Kompilasi TypeScript dan jalankan skrip aslinya)**
```bash
npm run build
npm start
```

---

## 📁 Struktur Proyek (Directory Tree)

```text
Academy-Drix-Valorant/
│
├── config/                  # Variabel lingkungan
│   ├── .env                 # Kredensial Asli (TIDAK ter-commit di GIT)
│   └── .env.example         # Template environment
│
├── src/
│   ├── commands/            # Semua Perintah (Commands) Bot
│   │   ├── prefix/          # Logika untuk prefix klasik (!help, !stats)
│   │   └── slash/           # Logika untuk Slash Interactions (/help, /stats)
│   │
│   ├── config/              # Modul konfigurasi sistem
│   │   ├── env.ts           # Centralized environment loader
│   │   └── featureFlags.ts  # Sistem toggle hidup/mati per fungsionalitas
│   │
│   ├── database/            # Terhubung ke MongoDB MongoDB
│   │   ├── models/          # Skema/Model Mongoose (User, GuildConfig, dll.)
│   │   └── connection.ts    # Setup konektivitas MongoDB
│   │
│   ├── events/              # Pendengar Event Discord (ready, messageCreate, guildMemberAdd)
│   │
│   ├── services/            
│   │   └── riot/            # Wrapper resmi API VALORANT dan RSO token exchange
│   │
│   ├── utils/               # Alat bantu global
│   │   ├── commandHandler.ts# Memuat perintah ke dalam memori bot & registry Discord
│   │   ├── eventHandler.ts  # Mengikat file logis di `events/` ke Client Discord
│   │   └── embed.ts         # Koleksi format bingkai respon chat bot (Fun & Error Embeds)
│   │
│   └── index.ts             # Main Entry Bot
│
└── package.json
```

---

## 🤝 Berkontribusi
Karena ini proyek untuk bersenang-senang, silakan buka **Pull Request** jika kamu menemukan *bug*, menambahkan command aneh nan seru lainnya, atau ingin memperbaiki dokumentasi.

## 📄 Kebijakan Hukum & License
*"Academy Drix Valorant" wasn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.*

*Bot ini diciptakan tanpa menyimpan dan membocorkan data kata sandi permainan sama sekali.*
