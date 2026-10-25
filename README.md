# Paper.id Auth Token Picker

Chrome extension (Manifest V3) yang otomatis nangkep header `Authorization`
dari tiap request ke `api.paper.id`, biar lu bisa copy tokennya tanpa harus
buka DevTools > Network tiap kali.

## Cara install
1. Buka `chrome://extensions`
2. Nyalain **Developer mode** (toggle kanan atas)
3. Klik **Load unpacked**
4. Pilih folder ini (`authtoken_picker`)

## Cara pakai
1. Buka / refresh halaman `paper.id` (yang udah login)
2. Begitu ada request ke `api.paper.id`, badge hijau ✓ muncul di icon extension
3. Klik icon extension → tokennya ada di situ
4. Tombol:
   - **Copy Token** — copy token mentah
   - **Copy "Bearer ..."** — copy lengkap dengan prefix `Bearer `
   - **Hapus** — bersihin token yang kesimpen

## Catatan
- Token cuma disimpen lokal di `chrome.storage.local`, nggak dikirim ke mana-mana.
- Token JWT ini expired (ada waktunya), jadi refresh halaman kalau udah basi.

## Troubleshooting

**Token nggak nongol / "Belum ada token ketangkep"**

Listener cuma nangkep request yang terjadi *setelah* extension aktif. Request
ke `api.paper.id` kebanyakan nembak pas halaman pertama kali load, jadi:

1. Pastiin extension udah ke-reload (di `chrome://extensions` klik icon ⟳ pada
   card extension) — wajib tiap kali ada perubahan kode.
2. Balik ke tab paper.id, **hard refresh**: `Ctrl + Shift + R`.
3. Baru buka popup extension → token harusnya muncul.

**Cek apakah listener jalan (debug)**

1. Buka `chrome://extensions` → klik link **"service worker"** (biru) di card
   extension. DevTools background kebuka.
2. Lihat tab **Console**:
   - `[AuthPicker] service worker aktif...` → extension jalan.
   - `[AuthPicker] ketangkep: POST https://api.paper.id/...` → token ketangkep.
3. Kalau cuma baris pertama yang muncul walau udah hard-refresh, berarti request
   ber-Authorization nembak ke host selain `*.paper.id`. Cek host asli request-nya
   di DevTools > Network > tab Headers, lalu sesuaikan `host_permissions` di
   `manifest.json` dan filter `urls` di `background.js`.

**Token ketangkep tapi API nolak (401 / Unauthorized)**

Token JWT ada masa berlakunya. Hard refresh halaman paper.id buat dapetin token
baru — extension bakal auto-update ke yang terbaru.
