Berikut adalah versi `README.md` yang sudah dirapikan, dipersingkat tanpa mengurangi informasi esensial, serta ditata secara logis agar mudah dibaca di GitHub.

---

```markdown
# 🏔️ NDAKI Backend System

NDAKI adalah sistem backend berbasis **Next.js App Router**, **Supabase (Auth, DB, Realtime)**, dan **PostgreSQL**. Dirancang sebagai *offline-first + real-time mountain tracking & safety system* untuk pendakian gunung di Indonesia.

---

## 🚀 Base URL & Auth Header

*   **Local:** `http://localhost:3000/api`
*   **Production:** `https://api.ndaki.id/api`

### Authorization Header
Semua endpoint yang membutuhkan proteksi menggunakan JWT Token via Bearer:
```http
Authorization: Bearer <access_token>

```

---

## 🗺️ Complete Endpoints Table

### 🔐 Authentication & Users

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register user baru | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `GET` | `/api/auth/google` | Google OAuth login | ❌ |
| `POST` | `/api/auth/logout` | Logout user | ✅ |
| `GET` | `/api/users/me` | Ambil data profile user aktif | ✅ |

### 👥 Team System

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/teams/create` | Buat tim pendakian baru | ✅ |
| `POST` | `/api/teams/join` | Gabung tim via kode unik | ✅ |
| `GET` | `/api/teams/[code]` | Detail tim berdasarkan kode | ✅ |
| `GET` | `/api/teams/[code]/members` | Daftar anggota dalam tim | ✅ |

### 📍 Core Tracking System

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/tracking/start` | Mulai sesi tracking baru | ✅ |
| `POST` | `/api/tracking/heartbeat` | Ping interval deteksi perangkat aktif | ✅ |
| `POST` | `/api/tracking/sync` | Sinkronisasi batch log GPS (offline-safe) | ✅ |
| `POST` | `/api/tracking/end` | Akhiri sesi tracking pendakian | ✅ |
| `GET` | `/api/tracking/[session_id]` | Ambil history log koordinat GPS | ✅ |

### 📡 Live Monitoring & SOS System

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/monitoring/team/[code]` | Monitor posisi & status realtime tim | ✅ |
| `POST` | `/api/sos/send` | Kirim sinyal darurat (SOS) | ✅ |
| `GET` | `/api/sos/active/[team_id]` | Ambil daftar SOS aktif di internal tim | ✅ |
| `GET` | `/api/sos/[id]` | Detail laporan kejadian SOS | ✅ |
| `POST` | `/api/sos/resolve` | Selesaikan/tutup status laporan SOS | ✅ |

### 🧠 Context-Aware AI & Weather

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/ai/chat` | Chat asisten keselamatan (Gemini) | ✅ |
| `POST` | `/api/weather/compare` | Analisis komparasi cuaca user vs gunung | ✅ |
| `GET` | `/api/weather/user` | Ambil data lokasi & cuaca user saat ini | ✅ |
| `GET` | `/api/weather/mountain/[slug]` | Ambil info cuaca spesifik di gunung | ✅ |

### 📊 Profile Analytics & Gamification

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/profile/stats` | Statistik total metrik pendakian user | ✅ |
| `GET` | `/api/profile/monthly-chart` | Data chart aktivitas bulanan user | ✅ |
| `GET` | `/api/profile/replay/[session_id]` | Ambil data koordinat untuk replay rute | ✅ |
| `GET` | `/api/profile/mountains` | Daftar koleksi gunung yang sudah didaki | ✅ |
| `GET` | `/api/profile/achievements` | Daftar lencana/badge yang diraih | ✅ |

### 🎒 Gear & 🎫 Open Trip Systems

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/gear/personal/add` | Tambah perlengkapan pribadi | ✅ |
| `POST` | `/api/gear/team/add` | Tambah log logistik/perlengkapan kelompok | ✅ |
| `GET` | `/api/mountains` | Ambil semua daftar gunung terdaftar | ❌ |
| `GET` | `/api/mountains/[slug]` | Ambil detail informasi gunung | ❌ |
| `GET` | `/api/open-trips` | Ambil daftar open trip tersedia | ❌ |
| `GET` | `/api/open-trips/[id]` | Detail informasi paket open trip | ❌ |
| `POST` | `/api/open-trips/create` | Buka pendaftaran open trip baru | ✅ |
| `POST` | `/api/open-trips/book` | Booking/pesan slot open trip | ✅ |

---

## ⚙️ Core Architecture & Models

### Status Models & State Machine

#### 1. Tracking Session Status

Dikelola otomatis via Server Cron Job berdasarkan durasi `heartbeat_at`.

* `active` : Perangkat normal / responsif.
* `stale` : Tidak ada heartbeat > 60 detik (Sinyal buruk/lemah).
* `inactive` : Tidak ada heartbeat > 180 detik (Perangkat mati/hilang sinyal).
* `ended` : Sesi pendakian selesai secara manual.

#### 2. SOS Alert Status

* `active` : Sinyal darurat sedang menyala dan butuh evakuasi.
* `resolved` : Masalah darurat selesai ditangani.
* `expired` : SOS kedaluwarsa/tidak aktif.

### Database Core Tables

* `users`, `mountains`, `teams`, `team_members`
* `tracking_sessions`, `tracking_logs`, `sos_alerts`
* `personal_gear`, `team_gear`, `user_achievements`, `user_mountain_collections`

---

## 🛠️ Feature Details, Body Request & Responses

### 1. Authentication System

Sistem manajemen akun terintegrasi Supabase Auth & Google OAuth.

#### Register User

* **Endpoint:** `POST /api/auth/register`
* **Body:**
```json
{
  "email": "user@email.com",
  "password": "password123",
  "full_name": "Resta"
}


```



```

#### Login User
*   **Endpoint:** `POST /api/auth/login`
*   **Body:**
    ```json
    {
      "email": "user@email.com",
      "password": "password123"
    }
    

```

---

### 2. Team Management System

Sistem pembentukan kelompok pendakian menggunakan token sirkulasi unik.

#### Create Team

* **Endpoint:** `POST /api/teams/create`
* **Body:**
```json
{
  "name": "Tim Pendaki Merbabu",
  "mountain_id": "uuid-gunung",
  "hike_start_date": "2026-05-20",
  "hike_end_date": "2026-05-22",
  "hike_type": "camp"
}


```



```

#### Join Team
*   **Endpoint:** `POST /api/teams/join`
*   **Body:**
    ```json
    {
      "code": "MRB-K7X4P"
    }
    

```

---

### 3. Real-time GPS Tracking System

Sistem pelacakan posisi pendaki secara *offline-first*. Aplikasi mobile menyimpan koordinat lokal saat sinyal hilang dan mengirimkannya secara kolektif (*batch*) saat terhubung jaringan.

#### Start Tracking Session

* **Endpoint:** `POST /api/tracking/start`
* **Body:**
```json
{
  "team_id": "uuid-tim",
  "device_id": "android-xyz"
}


```



```

#### Heartbeat System (Setiap 10-15s)
*   **Endpoint:** `POST /api/tracking/heartbeat`
*   **Body:**
    ```json
    {
      "session_id": "uuid-sesi"
    }
    

```

#### GPS Batch Sync (Offline Safe)

* **Endpoint:** `POST /api/tracking/sync`
* **Body:**
```json
{
  "session_id": "uuid-sesi",
  "points": [
    {
      "lat": -7.54,
      "lng": 110.44,
      "accuracy": 5,
      "alt": 3100,
      "time": "2026-05-16T10:00:00Z"
    }
  ]
}


```



```

#### End Tracking Session
*   **Endpoint:** `POST /api/tracking/end`
*   **Body:**
    ```json
    {
      "session_id": "uuid-sesi"
    }
    

```

---

### 4. Real-time Live Monitoring & SOS System

Dasbor pemantauan berbasis **Supabase Realtime Event**. Setiap deteksi insiden langsung menyiarkan data ke dasbor penyelamat.

#### Live Team Monitoring Response

* **Endpoint:** `GET /api/monitoring/team/[code]`
* **Response:**
```json
{
  "team": {},
  "members": [
    {
      "user_id": "uuid",
      "lat": -7.5,
      "lng": 110.4,
      "status": "active",
      "last_seen": "2026-05-16T10:00:00Z"
    }
  ]
}


```



```

#### Send SOS Alert
*   **Endpoint:** `POST /api/sos/send`
*   **Body:**
    ```json
    {
      "session_id": "uuid-sesi",
      "latitude": -7.5401,
      "longitude": 110.445,
      "altitude": 3100,
      "message": "Cedera kaki"
    }
    

```

* **Response:**
```json
{
  "success": true,
  "sos": {
    "id": "uuid-sos",
    "status": "active",
    "created_at": "2026-05-17T10:00:00Z"
  }
}


```



```

#### Resolve SOS Alert
*   **Endpoint:** `POST /api/sos/resolve`
*   **Body:**
    ```json
    {
      "sos_id": "uuid-sos"
    }
    

```

---

### 5. Context-Aware AI & Safety Weather System

Sistem kecerdasan buatan berbasis Gemini AI terintegrasi dengan mesin validasi aturan (*Internal Safety Rule Engine*). API membaca konteks dinamis: lokasi terakhir, elevasi, cuaca (BMKG/OpenWeather), dan status darurat untuk memberikan keputusan mutlak.

#### AI Safety Chat Engine

* **Endpoint:** `POST /api/ai/chat`
* **Body:**
```json
{
  "message": "aman gak summit sekarang?",
  "team_id": "uuid-tim"
}

```


* **Response:**
```json
{
  "answer": "Tidak disarankan summit saat ini karena hujan deras dan angin tinggi.",
  "risk_level": "high",
  "recommendation": [
    "Tunggu cuaca membaik",
    "Hindari area terbuka"
  ],
  "warning": "Risiko hipotermia meningkat"
}


```



```

#### Compare Weather & Safety Analysis
*   **Endpoint:** `POST /api/weather/compare`
*   **Body:**
    ```json
    {
      "mountain_id": "uuid-gunung",
      "user_lat": -7.123,
      "user_lng": 110.123
    }
    

```

* **Response:**
```json
{
  "success": true,
  "analysis": {
    "rule_based": { "risk": "medium", "message": "Hujan di jalur gunung" },
    "ai": {
      "risk_level": "medium",
      "message": "Rekomendasi tunda summit",
      "recommendation": "Hati-hati jalur licin"
    }
  }
}


```



```

---

### 6. Profile Analytics System
Sistem kalkulasi statistik performa pendakian seperti Strava/Garmin yang disesuaikan dengan karakteristik pegunungan Indonesia.

#### Get Profile Stats
*   **Endpoint:** `GET /api/profile/stats`
*   **Response:**
    ```json
    {
      "success": true,
      "stats": {
        "total_trip": 12,
        "total_distance_km": 148.2,
        "total_trek_hours": 72,
        "total_elevation_gain": 8420,
        "avg_pace": 3.8,
        "fastest_summit_hours": 4.5,
        "longest_hike_km": 28.3,
        "estimated_calories": 9620,
        "current_rank": "Sepuh",
        "grade": 4
      }
    }
    

```

```
> 💡 **Metrik & Formula:**
> *   `total_elevation_gain`: Akumulasi elevasi positif pendakian (kondisi naik saja).
> *   `avg_pace`: `distance / hours`.
> *   `estimated_calories`: `distance_km * 65` (kalkulasi dasar).
> *   `Rank System`: Pemula (1–3 trip), Berpengalaman (3–8 trip), Sepuh (8–15 trip), Legenda (15+ trip).

```

#### Get Route Replay Data

* **Endpoint:** `GET /api/profile/replay/[session_id]`
* **Response:**
```json
{
  "success": true,
  "route": [
    {
      "latitude": -7.54,
      "longitude": 110.44,
      "altitude": 3100,
      "tracked_at": "2026-05-16T10:00:00Z"
    }
  ]
}


```



```

---

### 7. Gear Management & Open Trip System

#### Add Gear Log (Personal / Team)
*   **Endpoint:** `POST /api/gear/team/add`
*   **Body:**
    ```json
    {
      "team_id": "uuid-tim",
      "name": "Tenda isi 4",
      "quantity": 2
    }
    

```

#### Open Trip Booking

* **Endpoint:** `POST /api/open-trips/book`
* **Body:**
```json
{
  "open_trip_id": "uuid-trip",
  "slots_booked": 2
}


```



```

---

## ⚡ Performance Optimization Strategy

1.  **Batch GPS Logs Sync:** Pengiriman koordinat tidak dilakukan per satu titik lokasi melainkan berkala dalam struktur array (*batch queued*) untuk menghemat baterai & bandwidth perangkat.
2.  **Database Indexing:** Optimasi pencarian cepat pada table `tracking_logs` berbasis kombinasi compound index `session_id` + `time`.
3.  **Lightweight Heartbeat:** Transaksi paket ping *heartbeat* dibuat seminimal mungkin hanya memperbarui tanda waktu aktif, memisahkan beban payload data pelacakan utama.

```

```

```