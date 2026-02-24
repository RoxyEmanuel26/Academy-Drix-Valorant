/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * @link      https://github.com/RoxyEmanuel26/Academy-Drix-Valorant
 * @community WonderPlay Discord: https://discord.gg/A6b3dT2eey
 * 
 * Bot Discord eksklusif untuk komunitas WonderPlay & Academy Drix Valorant.
 * Hak cipta dilindungi undang-undang.
 * 
 * ⚠️ PERINGATAN EKSKLUSIVITAS:
 * Dilarang keras melakukan modifikasi, distribusi, atau komersialisasi
 * tanpa izin tertulis dari pemegang hak cipta.
 * ---------------------------------------------------------------------
 */


// src/data/valorant.ts

export const agents = [
    "Jett", "Reyna", "Phoenix", "Raze", "Yoru", "Neon", "Iso", "Waylay", // Duelists
    "Sova", "Breach", "Skye", "KAY/O", "Fade", "Gekko", "Tejo", // Initiators
    "Brimstone", "Viper", "Omen", "Astra", "Harbor", "Clove", // Controllers
    "Sage", "Cypher", "Killjoy", "Chamber", "Deadlock", "Vyse" // Sentinels
];

export const maps = [
    "Bind", "Haven", "Split", "Ascent", "Icebox", "Breeze",
    "Fracture", "Pearl", "Lotus", "Sunset", "Abyss", "Cascade"
];

export const agentEmojiHints: Record<string, string[]> = {
    "Jett": ["🌬️", "🔪", "💨"],
    "Reyna": ["👁️", "💜", "🧿"],
    "Phoenix": ["🔥", "☀️", "🫶"],
    "Raze": ["💣", "🚀", "💥"],
    "Yoru": ["🌀", "👟", "🎭"],
    "Neon": ["⚡", "💙", "🏃"],
    "Iso": ["🛡️", "💠", "🔵"],
    "Waylay": ["✨", "🌟", "⚡"],
    "Sova": ["🏹", "🦅", "🔍"],
    "Breach": ["👊", "🌊", "💪"],
    "Skye": ["🌿", "🐺", "💚"],
    "KAY/O": ["🤖", "⚔️", "🔋"],
    "Fade": ["🌑", "😱", "🖤"],
    "Gekko": ["🦎", "🌈", "🐛"],
    "Tejo": ["🎯", "💼", "🔫"],
    "Brimstone": ["💨", "🌫️", "🇺🇸"],
    "Viper": ["🐍", "☠️", "🟢"],
    "Omen": ["👻", "🌑", "🔮"],
    "Astra": ["⭐", "🌌", "🔯"],
    "Harbor": ["🌊", "🏺", "🇮🇳"],
    "Clove": ["☘️", "💜", "🎴"],
    "Sage": ["💚", "🔮", "❄️"],
    "Cypher": ["🕵️", "📸", "🇲🇦"],
    "Killjoy": ["⚙️", "🤖", "🇩🇪"],
    "Chamber": ["🔫", "🇫🇷", "💛"],
    "Deadlock": ["🧲", "⛓️", "🇳🇴"],
    "Vyse": ["🕸️", "⚙️", "🔩"]
};

export const scrambleWords = {
    agents,
    maps
};

export const mapClues: Record<string, { easy: string, medium: string, hard: string }> = {
    "Bind": {
        easy: "Map ini punya portal teleporter.",
        medium: "Satu-satunya map tanpa mid area tradisional.",
        hard: "Map ini berlokasi di Maroko dan memiliki lab rahasia Kingdom."
    },
    "Haven": {
        easy: "Satu-satunya map klasik dengan 3 bomb site (A, B, C).",
        medium: "Punya area 'Garage' dengan pintu kayu ganda yang sering disepam wallbang.",
        hard: "Map ini berlokasi di Thimphu, Bhutan, berupa sebuah kuil suci."
    },
    "Split": {
        easy: "Map ini punya tali Zipline (Ropes) di Mid menuju Heaven.",
        medium: "Tema map kota fiksi yang terbagi dua: modern dan tradisional Jepang.",
        hard: "Situs A terhubung ke A Sewer, dan berlokasi di Shinjuku, Tokyo."
    },
    "Ascent": {
        easy: "Map ini punya pintu besi di A dan B yang bisa ditutup menggunakan switch.",
        medium: "Mid sangat terbuka, dijaga ketat dari Catwalk atau Pizza.",
        hard: "Potongan wilayah dari San Marco, Venezia, Italia, yang kini melayang di angkasa."
    },
    "Icebox": {
        easy: "Penuh salju dan kontainer kargo pengiriman.",
        medium: "A Site punya zona bertingkat sangat tinggi dan Ziplines.",
        hard: "Sebuah fasilitas ekskavasi rahasia milik Kingdom di Bennett Island."
    },
    "Breeze": {
        easy: "Map pantai, cuaca cerah, sangat terbuka lebar dan cocok buat senjata jarak jauh.",
        medium: "Punya terowongan tabung besi dan pintu ganda pelindung di A Hall.",
        hard: "Terletak di kawasan Segitiga Bermuda dengan gaya kepulauan tropis."
    },
    "Fracture": {
        easy: "Attacker bisa spawn dan menyerang Site A & B dari dua sisi berlawanan.",
        medium: "Ada zipline sangat panjang yang melintasi tengah map (bawah).",
        hard: "Berlokasi di Santa Fe, New Mexico dengan bentuk struktur H."
    },
    "Pearl": {
        easy: "Satu-satunya map yang sepenuhnya terendam di bawah laut.",
        medium: "Tidak ada pintu gimmick atau teleporter sama sekali, Mid sangat rumit.",
        hard: "Kota futuristik ini terletak di wilayah perairan Portugal."
    },
    "Lotus": {
        easy: "Punya 3 Bomb Site dan ada tembok rotasi (revolving doors).",
        medium: "Truk rubble destructible menutupi jalur B ke A Link.",
        hard: "Gaya arsitektur tradisional berlokasi di Omega Earth India."
    },
    "Sunset": {
        easy: "Bernuansa sore hari di sebuah kota yang punya kedai Boba.",
        medium: "Pintu mekanik ala Ascent tapi hanya ada antara B Main dan Market.",
        hard: "Pemandangan Hollywood berlokasi di Los Angeles, California."
    },
    "Abyss": {
        easy: "Map ini tidak ada pembatas jurang (bisa jatuh dan mati seketika).",
        medium: "Tema Edge-of-the-World milik Scions of Hourglass dengan lompatan berbahaya.",
        hard: "Ada penjara sel kaca besar mengurung seseorang di bagian library map."
    },
    "Cascade": {
        easy: "Map yang didedikasikan untuk pertarungan ekstrim dengan jalur verticality baru.",
        medium: "Map rilisan terbaru pasca patch Abyss.",
        hard: "Salah satu instalasi radionite ekstrim di garis batas."
    }
};

export const wyrQuestions = [
    { optionA: "Vandal 🔴", optionB: "Phantom 🟣" },
    { optionA: "Jett Operator Sniper 💨", optionB: "Raze Judge di Ujung Pintu 🚀" },
    { optionA: "Terbunuh karena fall damage 💀", optionB: "Mati karena spike ledak pas defuse 0.01 detik ⏱️" },
    { optionA: "Main 5 Duelist ⚔️", optionB: "Main 5 Controller 🌫️" },
    { optionA: "Jadi bottom frag tapi menang 🥉", optionB: "Jadi Team MVP tapi kalah 🏆" },
    { optionA: "Skin Prime 🐺", optionB: "Skin Kuronami 🌀" },
    { optionA: "Ketemu smurf musuh Jett 😡", optionB: "Ketemu teman afk ronde 1 💤" },
    { optionA: "Defuse ninja pake ulti Omen 👻", optionB: "Defuse pake wall Sage 🧊" },
    { optionA: "Odin seumur hidup 🔫", optionB: "Ares seumur hidup 🛠️" },
    { optionA: "Breeze 🏝️", optionB: "Icebox ❄️" },
    { optionA: "Kena flash Phoenix teammate 🦯", optionB: "Kena stun Breach musuh terus-terusan 🥴" },
    { optionA: "Instalock Reyna 👑", optionB: "Main Smoke (Controller) tiap match 🌫️" },
    { optionA: "Ace tapi round kalah karena timer habis ⏳", optionB: "Gak nge-kill tapi defuse spike menang 💣" },
    { optionA: "Pisau Butterly Recon 🔪", optionB: "Pisau Karambit Champion 🌟" },
    { optionA: "Classic burst headshot 💥", optionB: "Ghost 1-tap headshot 🎯" },
    { optionA: "Map Bind 🏜️", optionB: "Map Ascent 🏛️" },
    { optionA: "Beli skin senjata mele (pisau) 🗡️", optionB: "Beli skin senjata Vandal/Phantom 🔫" },
    { optionA: "Gekko Wingman (Dizzy) 🦎", optionB: "Skye Wolf 🐺" },
    { optionA: "Ulti Raze dapet 3 kill 💥", optionB: "Ulti Sova dapet 3 kill 🏹" },
    { optionA: "Terjebak di ulti Viper 🐍", optionB: "Terjebak di ulti Killjoy ⚙️" },
    { optionA: "Dihidupkan Sage tapi langsung mati lagi 💚", optionB: "Mati ditusuk pisau Yoru dari belakang 🔪" },
    { optionA: "Match overtime sampai ronde 40 😵", optionB: "Kalah telak 13-0 😭" },
    { optionA: "Kena recon dart Sova 🦅", optionB: "Kena cypher trapwire 🕸️" },
    { optionA: "Push Site A selalu 😎", optionB: "Push Site B selalu 🤔" },
    { optionA: "Sheriff round 1 🤠", optionB: "Frenzy + Shield round 1 🔫" },
    { optionA: "Main di ping 150ms 📡", optionB: "Main di FPS 30hz 💻" },
    { optionA: "Chamber dengan snipernya 🔬", optionB: "Iso dengan tameng icoshieldnya 🛡️" },
    { optionA: "Mati karena jatuh di Abyss 🕳️", optionB: "Mati nyangkut di teleport Bind 🌀" },
    { optionA: "Menang kompetitif +30rr 💎", optionB: "Gacha Night Market dapet skin idaman 🛒" },
    { optionA: "Bisa recall granat KAY/O 📻", optionB: "Bisa nyetir Boom Bot Raze 🤖" }
];

export const quizQuestions = [
    // ABILITIES
    { question: "Ability apa milik Reyna yang digunakan untuk memulihkan HP setelah mendapatkan kill/assist?", options: ["Dismiss", "Devour", "Empress", "Leer"], answer: "Devour", category: "Agent Abilities" },
    { question: "Siapa agent yang bisa melakukan 'Resurrection' teman yang sudah mati?", options: ["Skye", "Clove", "Sage", "Killjoy"], answer: "Sage", category: "Agent Abilities" },
    { question: "Berapa jumlah charge cloudburst (smoke) maksimal milik Jett?", options: ["1", "2", "3", "4"], answer: "2", category: "Agent Abilities" },
    { question: "Ultimate milik Sova 'Hunter's Fury' menembakkan berapa tembakan energi maksimum?", options: ["2", "3", "4", "5"], answer: "3", category: "Agent Abilities" },
    { question: "Ability apa dari Chamber yang memungkinkannya berteleportasi?", options: ["Trademark", "Tour De Force", "Headhunter", "Rendezvous"], answer: "Rendezvous", category: "Agent Abilities" },
    { question: "Berapa banyak HP yang diberikan oleh armor/shield besar (Heavy Shield)?", options: ["25", "50", "75", "100"], answer: "50", category: "Agent Abilities" },
    { question: "Ultimate dari Viper disebut apa?", options: ["Poison Cloud", "Snake Bite", "Viper's Pit", "Toxic Screen"], answer: "Viper's Pit", category: "Agent Abilities" },
    { question: "Apa nama alat (pet) milik Gekko yang bisa melakukan plant spike?", options: ["Dizzy", "Mosh Pit", "Thrash", "Wingman"], answer: "Wingman", category: "Agent Abilities" },
    { question: "Agent mana yang memiliki ability bernama 'Cyber Cage'?", options: ["Omen", "Astra", "Cypher", "Killjoy"], answer: "Cypher", category: "Agent Abilities" },
    { question: "Berapa lama durasi ultimatenya Phoenix (Run It Back)?", options: ["10 detik", "15 detik", "12 detik", "14 detik"], answer: "10 detik", category: "Agent Abilities" },

    // MAPS
    { question: "Map ini adalah satu-satunya map dengan tiga Bomb Site. Map apakah ini?", options: ["Lotus", "Haven", "Fracture", "Keduanya Haven & Lotus"], answer: "Keduanya Haven & Lotus", category: "Map Knowledge" },
    { question: "Tali zip (Ziplines) secara horizontal pertama kali ada di map mana?", options: ["Split", "Icebox", "Breeze", "Fracture"], answer: "Icebox", category: "Map Knowledge" },
    { question: "Di map manakah terdapat pintu besi mekanik yang bisa dibuka tutup pakai switch?", options: ["Ascent & Sunset", "Bind", "Split", "Pearl"], answer: "Ascent & Sunset", category: "Map Knowledge" },
    { question: "Map mana yang berlatar di Portugal dan di bawah air?", options: ["Breeze", "Pearl", "Lotus", "Abyss"], answer: "Pearl", category: "Map Knowledge" },
    { question: "Apa sebutan untuk callout ruangan di atas Site A pada map Ascent?", options: ["Heaven", "Window", "Rafters", "Balcony"], answer: "Heaven", category: "Map Knowledge" },
    { question: "Map Valorant apa yang punya pintu (Rotasi) berputar besar?", options: ["Abyss", "Sunset", "Lotus", "Haven"], answer: "Lotus", category: "Map Knowledge" },
    { question: "Area Mid di Split yang terhubung menggunakan tali ke atas biasa disebut apa?", options: ["Vent / Ropes", "Tube", "Mid Doors", "Sewer"], answer: "Vent / Ropes", category: "Map Knowledge" },
    { question: "Di mana lokasi B Hall dan A Hall yang dihubungkan dengan pintu ganda tebal?", options: ["Breeze", "Icebox", "Pearl", "Bind"], answer: "Breeze", category: "Map Knowledge" },
    { question: "Map mana yang memiliki teleporter searah?", options: ["Bind", "Fracture", "Abyss", "Icebox"], answer: "Bind", category: "Map Knowledge" },
    { question: "Di map Abyss, apa bahaya utamanya?", options: ["Tidak ada atap", "Jalan sempit", "Bisa jatuh mati ke jurang", "Radiasi gas racun"], answer: "Bisa jatuh mati ke jurang", category: "Map Knowledge" },

    // WEAPONS
    { question: "Berapa harga kredit dari senjata Vandal?", options: ["2700", "2900", "3200", "2500"], answer: "2900", category: "Weapon Stats" },
    { question: "Senjata apa yang harganya 4700 kredit (paling mahal)?", options: ["Judge", "Odin", "Operator", "Ares"], answer: "Operator", category: "Weapon Stats" },
    { question: "Damage ke kepala (Headshot) untuk senjata Phantom di jarak 0-15 meter adalah?", options: ["140", "156", "124", "160"], answer: "156", category: "Weapon Stats" },
    { question: "Berapa banyak peluru dalam satu magazine senjata Spectre?", options: ["25", "30", "35", "40"], answer: "30", category: "Weapon Stats" },
    { question: "Pistol mana yang menembakkan burst 3 peluru dengan klik kanan?", options: ["Ghost", "Frenzy", "Classic", "Shorty"], answer: "Classic", category: "Weapon Stats" },
    { question: "Senjata apa yang merupakan kelas LMG dan harganya 1600 kredit?", options: ["Odin", "Ares", "Bucky", "Judge"], answer: "Ares", category: "Weapon Stats" },
    { question: "Berapa base damage (badan) dari tembakan OP (Operator)?", options: ["120", "150", "200", "140"], answer: "150", category: "Weapon Stats" },
    { question: "Senjata rifle yang dirancang khusus memiliki scope ADS seperti AUG adalah?", options: ["Bulldog", "Guardian", "Vandal", "Phantom"], answer: "Bulldog", category: "Weapon Stats" },
    { question: "Berapa harga Sheriff?", options: ["600", "700", "800", "900"], answer: "800", category: "Weapon Stats" },
    { question: "Senapan sniper sekunder yang harganya 950 kredit adalah?", options: ["Marshal", "Bucky", "Outlaw", "Ares"], answer: "Marshal", category: "Weapon Stats" },

    // LORE
    { question: "Kingdom Corporation berasal dari bumi mana?", options: ["Alpha Earth", "Omega Earth", "Zeta Earth", "Beta Earth"], answer: "Alpha Earth", category: "Lore" },
    { question: "Siapakah nama asli Jett?", options: ["Sunwoo Han", "Tala Nicole", "Sabine", "Amir El Amari"], answer: "Sunwoo Han", category: "Lore" },
    { question: "Agent VALORANT nomor 01 adalah?", options: ["Viper", "Brimstone", "Omen", "Breach"], answer: "Brimstone", category: "Lore" },
    { question: "Dari mana asal Agent Reyna?", options: ["Spanyol", "Brazil", "Meksiko", "Filipina"], answer: "Meksiko", category: "Lore" },
    { question: "Zat bercahaya misterius di dunia Valorant yang diperebutkan adalah?", options: ["Tiberium", "Radianite", "Eridium", "Kryptonite"], answer: "Radianite", category: "Lore" },
    { question: "Apa ras spesifik Omen sebelum ia menjadi bayangan hantu?", options: ["Manusia", "Robot", "Alien", "Unknown/Radiant"], answer: "Manusia", category: "Lore" },
    { question: "Siapakah pencipta dari alat-alat teknologi Killjoy & Brimstone?", options: ["Sova", "Raze", "Killjoy", "Viper"], answer: "Killjoy", category: "Lore" },
    { question: "Chamber dan siapakah yang dulunya pernah bekerja sama di militer Perancis?", options: ["Brimstone", "Omen", "Sova", "Tidak ada (Dia bergerak sendiri)"], answer: "Tidak ada (Dia bergerak sendiri)", category: "Lore" }, // He is PMC
    { question: "Berasal dari manakah Neon?", options: ["Jepang", "Indonesia", "Filipina", "Malaysia"], answer: "Filipina", category: "Lore" },
    { question: "Siapakah robot pengekang radiants di cerita lore?", options: ["KAY/O", "Omen", "Cypher", "Breach"], answer: "KAY/O", category: "Lore" },

    // MECHANICS
    { question: "Berapa detik total waktu yang dibutuhkan dari Spike di-plant hingga meledak?", options: ["35 Detik", "40 Detik", "45 Detik", "50 Detik"], answer: "45 Detik", category: "Game Mechanics" },
    { question: "Berapa detik waktu animasi saat kita memasang (Planting) Spike?", options: ["3 Detik", "4 Detik", "5 Detik", "6 Detik"], answer: "4 Detik", category: "Game Mechanics" },
    { question: "Berapa lama waktu untuk mencabut (Defuse) Spike secara utuh?", options: ["5 Detik", "6 Detik", "7 Detik", "8 Detik"], answer: "7 Detik", category: "Game Mechanics" },
    { question: "Jumlah kredit maksimum yang bisa disimpan oleh seorang pemain adalah?", options: ["8000", "9000", "10000", "12000"], answer: "9000", category: "Game Mechanics" },
    { question: "Berapa kapasitas kredit dasar yang didapat dari memenangkan ronde?", options: ["2500", "3000", "3300", "2000"], answer: "3000", category: "Game Mechanics" },
    { question: "Kill memberi bonus berapa kredit langsung?", options: ["100", "200", "250", "300"], answer: "200", category: "Game Mechanics" },
    { question: "Mengambil ultimate orb di map memberikan persentase kredit tambahan sebesar?", options: ["Tidak ada kredit", "50 kredit", "100 kredit", "150 kredit"], answer: "Tidak ada kredit", category: "Game Mechanics" },
    { question: "Batas skor untuk menang match competitive normal adalah?", options: ["11", "12", "13", "14"], answer: "13", category: "Game Mechanics" },
    { question: "Apa istilah jika spike di-half defuse?", options: ["Memotong kabel kedua", "Mencapai titik 3.5 detik", "Mencapai 50% timing armor", "Menahan E setengah ronde"], answer: "Mencapai titik 3.5 detik", category: "Game Mechanics" },
    { question: "Status apa yang diberikan panah kuning Skye, bot Boom Raze, dan Flash Yoru jika mengenai/mendekati kawan?", options: ["Team Damage / Friendly Fire", "Tidak ada damage", "Kawan pusing lama", "Kawan mati"], answer: "Tidak ada damage", category: "Game Mechanics" }, // friendly team damage specific

    // ESPORTS TRIVIA
    { question: "Siapa tim yang memenangkan VCT Champions pertama kali (Tahun 2021 di Berlin)?", options: ["Gambit Esports", "Acend", "Sentinels", "Team Liquid"], answer: "Acend", category: "Esports Trivia" },
    { question: "Pemain manakah yang dikenal sebagai Jett main fenomenal dari Sentinel di tahun awal rilis?", options: ["TenZ", "cNed", "Yay", "Boaster"], answer: "TenZ", category: "Esports Trivia" },
    { question: "Negara manakah asal tim Paper Rex (PRX)?", options: ["Indonesia", "Thailand", "Singapura", "Malaysia"], answer: "Singapura", category: "Esports Trivia" },
    { question: "Siapakah tim pemenang VCT Champions 2022 (Istanbul)?", options: ["OpTic Gaming", "LOUD", "DRX", "FunPlus Phoenix"], answer: "LOUD", category: "Esports Trivia" },
    { question: "Pemain legendaris f0rsakeN dan d4v41 bermain tergabung untuk tim mana?", options: ["PRX", "BOOM", "RRQ", "Talon"], answer: "PRX", category: "Esports Trivia" },
];
