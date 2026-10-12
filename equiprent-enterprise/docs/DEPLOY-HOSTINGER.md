# Catatan Deploy ke Hostinger (auto-deploy dari GitHub)

Catatan rencana hosting EquipRent di Hostinger (hPanel), dibuat 12 Okt 2026. Belum dikerjakan.

Repo: `git@github.com:erziealdrian02/tkn-rent-revamp.git`

---

## 1. Prototype (HTML statis)

### Rencana subdomain

| Subdomain (contoh) | Branch | Isi |
|---|---|---|
| `demo.domainanda.com` | `prototype-template` | Data contoh, untuk presentasi |
| `uji.domainanda.com` | `testing-end-to-end` | Data bersih, untuk uji dari nol |

Lebih aman lagi kalau dibuat branch khusus `demo`, dan hanya di-merge ke sana kalau sudah siap ditunjukkan.

### Langkah di hPanel

1. **Websites** → pilih domain → buat subdomain. Folder tujuannya harus **kosong**.
2. **Advanced → GIT**:
   - Repository: `git@github.com:erziealdrian02/tkn-rent-revamp.git`
   - Branch: `prototype-template` / `testing-end-to-end`
   - Directory: folder subdomain
3. Kalau repo **private**: salin SSH key dari halaman GIT hPanel → GitHub repo → **Settings → Deploy keys** → Add (read-only).
4. Klik **Auto Deployment** di hPanel → salin URL webhook → GitHub repo → **Settings → Webhooks → Add webhook**:
   - Payload URL: URL dari hPanel
   - Content type: `application/json`
   - Event: *Just the push event*

Webhook berlaku untuk satu repo, jadi push ke branch mana pun memicu webhook. Hostinger hanya menarik branch yang dipilih di langkah 2.

### Wajib dibereskan sebelum online

- [ ] **Blokir `excel/` dan `docs/`.** Hostinger meng-copy seluruh isi repo, jadi proposal (ada harga), `DATA TKN.xlsx`, User Guide, Skenario Uji dan catatan ini bisa diunduh publik. Blokir lewat `.htaccess` (`Require all denied` di folder itu), atau pindahkan file-file itu keluar dari repo.
- [ ] **Redirect ke halaman login.** Prototype ada di subfolder `equiprent-enterprise/`. Tambahkan `.htaccess` di root yang mengarahkan `/` ke `equiprent-enterprise/login.html`.
- [ ] **Password tambahan.** Login prototype hanya demo, siapa pun bisa masuk sebagai Admin. Kalau link hanya untuk klien, pasang hPanel → **Password Protect Directories**.
- [ ] **Hati-hati push.** Dengan auto-deploy, apa pun yang ter-push langsung tayang. Pernah ada push tak sengaja ke `testing-end-to-end` (12 Okt 2026) yang sumbernya tidak jelas.

---

## 2. Aplikasi final (Laravel + MySQL)

- **Paket:** Laravel butuh paket yang punya SSH, Composer dan MySQL, yaitu Business / Cloud, atau Hostinger VPS.
- **Deploy:** fitur GIT hPanel hanya menarik file. `composer install`, `php artisan migrate`, `php artisan config:cache` **tidak** jalan otomatis. Pilihannya:
  - GitHub Actions yang SSH ke Hostinger lalu menjalankan perintah di atas setiap push ke `main`, atau
  - Hostinger VPS dengan skrip deploy sendiri.
- **Backup mingguan** (janji di proposal: otomatis seminggu sekali, tersimpan terpisah):
  - hPanel → **Cron Jobs** → `mysqldump` seminggu sekali.
  - Simpan hasilnya di luar server aplikasi (mis. Cloudflare R2 / Backblaze / Google Drive). Kalau hanya disalin ke tabel lain di database yang sama, backup ikut hilang saat database rusak.
  - Backup bawaan Hostinger tergantung paket. Cek di menu **Backups**.
- **Anggaran:** di proposal, biaya hosting tahun ke-2 dst. ± Rp2.500.000 / tahun. Hosting + maintenance + backup gratis di tahun pertama. Pastikan paket yang dipilih masih masuk angka itu.

---

## 3. Alternatif kalau Hostinger kurang cocok

| Kebutuhan | Pilihan |
|---|---|
| Prototype statis, gratis, URL per branch | Cloudflare Pages (root directory `equiprent-enterprise`), Vercel, Netlify |
| Laravel produksi, kontrol penuh, murah | VPS Jakarta / Singapura (± Rp100–200 rb / bulan) + GitHub Actions |
| Laravel, deploy satu klik | Laravel Forge / Ploi (± US$10–12 / bulan di luar VPS) |

Harga di atas perkiraan Okt 2026. Cek lagi sebelum dipakai.
