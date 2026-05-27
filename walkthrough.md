# Walkthrough: Script Installer GenieACS untuk Ubuntu Server

Saya telah membuat dan memvalidasi script installer GenieACS yang kompatibel untuk berbagai versi Ubuntu Server dengan kemampuan adaptasi spesifikasi perangkat keras (baik server lama dengan spesifikasi rendah maupun server modern berkinerja tinggi).

## Berkas yang Dibuat

1. **Script Installer Utama**: [genieacs-install.sh](file:///c:/laragon/www/genieacs/genieacs-install.sh)
   - Sintaksis script telah divalidasi dan dikonfirmasi bebas dari error sintaks (`bash -n` sukses).

---

## Fitur Utama Script

### 1. Deteksi Otomatis OS & Arsitektur
- Mendeteksi versi Ubuntu (18.04, 20.04, 22.04, dan 24.04).
- Menyesuaikan versi Node.js yang dipasang (Node.js 16 untuk Ubuntu 18.04 karena keterbatasan versi `glibc` sistem, dan Node.js 20 untuk versi Ubuntu yang lebih baru).

### 2. Kompatibilitas CPU (Solusi Crash Non-AVX)
- Mendeteksi apakah CPU mendukung instruksi **AVX**.
- Jika CPU tidak mendukung AVX (biasanya pada prosesor server lama atau VPS murah), script secara otomatis memasang **MongoDB 4.4** (versi terakhir yang tidak mewajibkan AVX).
- Pada Ubuntu >= 22.04 yang tidak lagi menyediakan pustaka legacy `libssl1.1` (dependensi wajib MongoDB 4.4), script akan mengunduh dan memasang `libssl1.1` secara otomatis dari arsip resmi Ubuntu agar MongoDB 4.4 dapat berjalan tanpa kendala.

### 3. Penyesuaian Berdasarkan RAM (Optimasi Memori)
Script mendeteksi total RAM dan mengoptimalkan penggunaan memori untuk mencegah crash (terutama OOM Killer pada memori < 2 GB):
- **Swap Otomatis**: Membuat dan mengaktifkan swap file sebesar 2GB jika total RAM kecil dan swap belum memadai.
- **MongoDB Limit**: Membatasi ukuran cache WiredTiger MongoDB (256 MB untuk RAM < 2GB, 512 MB untuk RAM < 4GB, dan 1 GB untuk RAM >= 4GB).
- **Node.js Limit**: Menambahkan parameter `--max-old-space-size` pada berkas systemd unit GenieACS untuk membatasi konsumsi RAM per proses Node.js berdasarkan profil RAM server.

### 4. Integrasi Nginx & Firewall (UFW)
- **Nginx Reverse Proxy**: Mengonfigurasi Nginx untuk meneruskan lalu lintas Port 80 (HTTP) ke Port 3000 (GenieACS UI), lengkap dengan konfigurasi WebSocket untuk realtime log.
- **UFW Firewall**: Membuka port yang dibutuhkan secara otomatis (CWMP 7547, FS 7567, UI 80/3000, dan NBI 7557 secara opsional) dengan tetap menjaga Port SSH 22 agar tidak terputus.

---

## Panduan Penggunaan Script

### Langkah 1: Pindahkan Script ke Server Target
Pindahkan berkas [genieacs-install.sh](file:///c:/laragon/www/genieacs/genieacs-install.sh) ke server Ubuntu Anda. Anda juga bisa mengunduhnya secara langsung atau menyalin isinya ke server baru.

### Langkah 2: Berikan Izin Eksekusi & Jalankan
Jalankan perintah berikut di terminal Ubuntu Server Anda:
```bash
# Berikan izin eksekusi berkas
chmod +x genieacs-install.sh

# Jalankan installer dengan hak akses root
sudo ./genieacs-install.sh
```

### Langkah 3: Ikuti Petunjuk di Layar
Script akan menampilkan hasil deteksi sistem Anda (RAM, CPU AVX, Versi OS) dan meminta konfirmasi. Anda juga dapat memilih apakah ingin memasang Nginx dan mengonfigurasi Firewall secara otomatis.

---

## Pengelolaan Layanan Setelah Instalasi

Setelah instalasi selesai, layanan GenieACS akan berjalan di latar belakang sebagai systemd service. Berikut perintah untuk mengelolanya:

### 1. Memeriksa Status Layanan
```bash
sudo systemctl status genieacs-cwmp genieacs-nbi genieacs-fs genieacs-ui
```

### 2. Memulai / Menghentikan / Restart Layanan
```bash
# Restart semua layanan GenieACS
sudo systemctl restart genieacs-cwmp genieacs-nbi genieacs-fs genieacs-ui

# Menghentikan layanan
sudo systemctl stop genieacs-cwmp genieacs-nbi genieacs-fs genieacs-ui
```

### 3. Memantau Log Realtime
```bash
# Memantau log CWMP (komunikasi perangkat)
sudo journalctl -f -u genieacs-cwmp

# Memantau log Web UI
sudo journalctl -f -u genieacs-ui
```

---

## Catatan Perbaikan & Troubleshooting (Bugfix)

### 1. Masalah: MongoDB Gagal Berjalan (`Unrecognized option: storage.journal.enabled`)
- **Gejala**: Layanan `mongod` berstatus *failed* saat dimulai, dan `genieacs-ui` mengalami *crash loop* dengan log error *worker died*.
- **Penyebab**: MongoDB versi 6.1 ke atas (termasuk v7.0 dan v8.0) tidak lagi mengenali opsi `storage.journal.enabled` karena fitur journaling sudah selalu aktif secara bawaan dan tidak bisa dinonaktifkan.
- **Solusi**: Baris konfigurasi `journal:` dan `enabled: true` di bawah bagian `storage:` harus dihapus dari berkas `/etc/mongod.conf`.
- **Tindakan Perbaikan**:
  1. Script installer utama ([genieacs-install.sh](file:///c:/laragon/www/genieacs/genieacs-install.sh)) telah diperbarui untuk menghapus penulisan opsi tersebut.
  2. Untuk perbaikan manual di server yang sudah berjalan, jalankan perintah:
     ```bash
     # Hapus baris journal dari mongod.conf
     sudo sed -i '/journal:/d; /enabled: true/d' /etc/mongod.conf
     
     # Muat ulang systemd dan jalankan kembali layanan
     sudo systemctl daemon-reload
     sudo systemctl restart mongod
     sudo systemctl restart genieacs-ui
     ```

