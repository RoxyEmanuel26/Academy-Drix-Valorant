# Academy Drix Valorant Discord Bot

Bot Discord untuk komunitas VALORANT yang ceria, fun, dan tidak tryhard! Terintegrasi dengan Riot Sign On (RSO) dan VALORANT API untuk memberikan pengalaman bermain yang super seru tanpa pusing mikir MMR.

## Fitur Utama
- **Account Linking (RSO):** Opt-in aman mematuhi Riot Policy, tanpa pernah meminta password.
- **Personal Stats:** Pantau rank & winrate berdasarkan permainanmu.
- **Server Leaderboard:** Bersaing seru dengan member server di leaderboard winrate/KDA.
- **Missions:** Selesaikan misi harian & mingguan langsung di server Discord.
- **Fun & Games:** Main mini-games seperti Tebak Agent, Agent Roulette untuk seru-seruan bareng party.
- **LFG:** Kumpulkan tim (Competitive/Unrated) dengan Command pencarian grup pintar.
- **Tournaments:** Pendaftaran otomatis turnamen komunitas kecil-kecilan.
- **Help Interactive:** Navigasi command bot elegan menggunakan Discord Select Menu.

## Cara Instalasi & Menjalankan

1. Clone repositori ini ke lokal Anda.
2. Pastikan Anda telah menginstall Node.js (direkomendasikan v18+) dan MongoDB berjalan di lokal atau Anda memiliki link dari Mongo Atlas.
3. Install dependencies menggunakan package manager seperti npm:
   ```bash
   npm install
   ```
4. Salin file template enviroment dari `config/.env.example` ke `config/.env`, lalu isi lengkap:
   - `DISCORD_TOKEN`: Token rahasia bot Anda (dapatkan dari Discord Developer Portal)
   - `DISCORD_CLIENT_ID`: Client ID bot
   - `DISCORD_GUILD_ID`: (Opsional) Guild ID server test Anda untuk mempercepat loading slash command
   - `MONGO_URI`: Conection string milik MongoDB, contoh `mongodb://127.0.0.1:27017/academy_drix_valorant`
   - `RIOT_API_KEY`: API Key Development/Production dari Riot Developer Portal
   - `RIOT_RSO_CLIENT_ID`, `RIOT_RSO_CLIENT_SECRET`, `RIOT_RSO_REDIRECT_URI`: Kredensial RSO Anda
5. Build aplikasi (compile TypeScript ke `.js`):
   ```bash
   npm run build
   ```
6. Jalankan bot:
   ```bash
   npm start
   ```

*(Untuk mode development dengan auto-restart, gunakan script dev: `npm run dev`)*

## Struktur Project
- `src/commands/...` - Logika perintah prefix dan slash /
- `src/events/...` - System Discord Event seperti message, ready, guildMemberAdd
- `src/services/riot/...` - Wrapper official VALORANT API dan RSO token exchange
- `src/database/models/...` - Skema MongoDB

**Perhatian**: Aplikasi ini dibuat 100% mematuhi aturan Game Policy dari Riot Games. Data hanya diagregasi tanpa memberikan unfair advantage real-time atau membocorkan data tersembunyi.
