# Berkah Teknik AC

Aplikasi operasional bengkel AC: servis kendaraan, SPK, POS sparepart, portal pelanggan, laporan, dan CMS situs.

Stack: **Laravel 13**, **Inertia.js**, **React**, **MySQL** (produksi) / SQLite (lokal).

---

## Fitur

- **Situs publik** — landing page, berita/promo, syarat ketentuan
- **Panel admin** — dashboard, servis, booking, SPK, POS, stok, karyawan, laporan, keuangan
- **Portal pelanggan** — daftar akun, lacak servis, booking, klaim garansi
- **Panel mekanik** — pekerjaan yang ditugaskan dan update status
- **Pengaturan aplikasi** — nama, logo, favicon, kontak, lokasi GPS
- **Update GitHub** — tarik update dari panel admin (setelah VPS dikonfigurasi)

Role staf: `owner`, `admin`, `cashier`, `purchasing`, `mechanic`.

---

## Persyaratan

| Komponen | Versi |
|---|---|
| PHP | 8.3+ (CLI **dan** FPM) |
| Ekstensi PHP | `mbstring`, `xml`, `curl`, `zip`, `gd`, `bcmath`, `intl`, `pdo_mysql` |
| Composer | 2.x |
| Node.js | 20 LTS atau 22 LTS |
| npm | ikut Node.js |
| Database produksi | MySQL 8 / MariaDB 10.11+ |
| Web server | Nginx (disarankan) atau Apache |
| Git | wajib jika memakai menu **Update GitHub** |

---

## URL penting

| Halaman | Path |
|---|---|
| Beranda | `/` |
| Login admin / staf | `/admin/login` |
| Panel mekanik | `/mechanic/dashboard` |
| Portal pelanggan | `/portal/login` |
| Pengaturan | `/admin/settings` |
| Update GitHub | `/admin/system-update` |

---

## Instalasi lokal (Laragon / Windows)

1. Clone repo ke folder web server, misalnya `D:\Laragon\www\berkahteknik`.
2. Salin environment:

```bash
cp .env.example .env
```

3. Isi `.env` (contoh Laragon + MySQL):

```env
APP_NAME="Berkah Teknik AC"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://berkahteknik.test
APP_TIMEZONE=Asia/Jakarta
APP_LOCALE=id

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=berkahteknik
DB_USERNAME=root
DB_PASSWORD=
```

Atau biarkan `DB_CONNECTION=sqlite` untuk development cepat (tanpa MySQL).

4. Pasang dependensi dan siapkan aplikasi:

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan storage:link
npm install
npm run dev
```

5. Buat akun owner (ganti email dan password):

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name' => 'Owner',
    'email' => 'owner@berkahteknik.test',
    'password' => 'GantiPasswordAman',
    'role' => 'owner',
]);
```

6. Buka `APP_URL` lalu masuk lewat `/admin/login`.

Jangan jalankan `php artisan db:seed` di produksi. Seeder bawaan hanya membuat user uji `test@example.com`.

---

## Instalasi di VPS (Ubuntu 22.04 / 24.04 + Nginx)

Panduan ini memakai domain contoh `bengkel.example.com` dan path `/var/www/berkahteknik`. Ganti sesuai server Anda.

### 1. Paket sistem

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git unzip curl nginx mysql-server \
    php8.3-fpm php8.3-cli php8.3-mysql php8.3-mbstring php8.3-xml \
    php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl
```

Jika `php8.3` belum ada di Ubuntu 22.04:

```bash
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
```

Composer:

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

Node.js 22 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Database MySQL

```bash
sudo mysql
```

```sql
CREATE DATABASE berkahteknik CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'berkah'@'localhost' IDENTIFIED BY 'GANTI_PASSWORD_DB';
GRANT ALL PRIVILEGES ON berkahteknik.* TO 'berkah'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Clone aplikasi

Folder harus **repository Git** (bukan zip), agar menu Update GitHub bisa `git pull`.

```bash
sudo mkdir -p /var/www
sudo git clone git@github.com:USERNAME/berkahteknik.git /var/www/berkahteknik
sudo chown -R www-data:www-data /var/www/berkahteknik
```

Untuk repo privat, buat **Deploy key** (read-only) di GitHub lalu pasang di VPS:

```bash
sudo -u www-data ssh-keygen -t ed25519 -C "vps-berkahteknik" -f /var/www/.ssh/id_ed25519 -N ""
sudo -u www-data cat /var/www/.ssh/id_ed25519.pub
```

Tempel public key itu di GitHub → **Settings → Deploy keys**.

Uji:

```bash
sudo -u www-data git -C /var/www/berkahteknik fetch origin
```

### 4. Environment produksi

```bash
cd /var/www/berkahteknik
sudo -u www-data cp .env.example .env
sudo -u www-data nano .env
```

Isian penting:

```env
APP_NAME="Berkah Teknik AC"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://bengkel.example.com
APP_TIMEZONE=Asia/Jakarta
APP_LOCALE=id

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=berkahteknik
DB_USERNAME=berkah
DB_PASSWORD=GANTI_PASSWORD_DB

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
LOG_LEVEL=error

# Update dari panel admin
DEPLOY_GITHUB_ENABLED=true
DEPLOY_GITHUB_BRANCH=main
DEPLOY_GITHUB_REMOTE=origin
DEPLOY_PHP_BINARY=/usr/bin/php8.3
DEPLOY_COMPOSER_BINARY=/usr/local/bin/composer
DEPLOY_ALLOW_DIRTY=true
```

Cek path PHP CLI (bukan php-fpm):

```bash
which php8.3
# biasanya /usr/bin/php8.3
```

### 5. Dependensi, migrasi, dan build

Jalankan sebagai `www-data` agar file hasil build milik web server:

```bash
cd /var/www/berkahteknik

sudo -u www-data composer install --no-dev --optimize-autoloader
sudo -u www-data php8.3 artisan key:generate
sudo -u www-data php8.3 artisan migrate --force
sudo -u www-data php8.3 artisan storage:link
sudo -u www-data npm ci --no-audit --no-fund
sudo -u www-data npm run build
sudo -u www-data php8.3 artisan optimize
sudo -u www-data php8.3 artisan config:cache
sudo -u www-data php8.3 artisan route:cache
sudo -u www-data php8.3 artisan view:cache
```

Hak tulis:

```bash
sudo chown -R www-data:www-data /var/www/berkahteknik
sudo find /var/www/berkahteknik -type d -exec chmod 755 {} \;
sudo find /var/www/berkahteknik -type f -exec chmod 644 {} \;
sudo chmod -R ug+rwx storage bootstrap/cache
```

### 6. Akun owner pertama

```bash
sudo -u www-data php8.3 artisan tinker
```

```php
\App\Models\User::create([
    'name' => 'Owner Bengkel',
    'email' => 'owner@bengkel.example.com',
    'password' => 'GantiPasswordAman',
    'role' => 'owner',
]);
```

Jangan gunakan `php artisan db:seed` di VPS.

### 7. Nginx

```bash
sudo nano /etc/nginx/sites-available/berkahteknik
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name bengkel.example.com;
    root /var/www/berkahteknik/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;
    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Aktifkan situs:

```bash
sudo ln -s /etc/nginx/sites-available/berkahteknik /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Pastikan document root mengarah ke folder **`public`**, bukan root project.

### 8. HTTPS (Let’s Encrypt)

Arahkan DNS A record domain ke IP VPS, lalu:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d bengkel.example.com
```

Setelah SSL aktif, `APP_URL` harus memakai `https://`.

### 9. PHP-FPM (upload logo / foto)

```bash
sudo nano /etc/php/8.3/fpm/php.ini
```

Disarankan:

```ini
upload_max_filesize = 8M
post_max_size = 12M
memory_limit = 256M
max_execution_time = 120
```

```bash
sudo systemctl restart php8.3-fpm
```

---

## Update aplikasi

### Dari panel admin (disarankan)

1. Push commit ke cabang `main`.
2. Login sebagai `owner` atau `admin`.
3. Buka **Update GitHub** (`/admin/system-update`).
4. Jalankan update. Panel akan `git pull`, `composer install --no-dev`, `migrate --force`, `npm ci` + `npm run build`, lalu cache config.

Syarat VPS:

- Folder app adalah clone Git, bukan salinan zip
- `www-data` bisa `git fetch` / `git pull` (deploy key)
- `DEPLOY_PHP_BINARY` mengarah ke PHP **CLI**, contoh `/usr/bin/php8.3`
- Composer dan npm ada di `PATH` user `www-data`

### Manual di SSH

```bash
cd /var/www/berkahteknik
sudo -u www-data git pull --ff-only origin main
sudo -u www-data composer install --no-dev --optimize-autoloader
sudo -u www-data php8.3 artisan migrate --force
sudo -u www-data npm ci --no-audit --no-fund
sudo -u www-data npm run build
sudo -u www-data php8.3 artisan optimize
```

---

## Setelah install

1. Login `/admin/login`.
2. Buka **Pengaturan Aplikasi** — isi nama, alamat, logo, favicon, WhatsApp.
3. Buka **Konten Situs** untuk landing page.
4. Tambah karyawan di **Data Karyawan** (kasir, mekanik, admin).
5. Isi master data: jasa, produk, supplier.

Nama di navbar dan judul tab mengikuti **Nama Aplikasi** di Identitas & Pemilik.

---

## Backup

Menu **Backup & Restore** di admin saat ini menyalin file `database/database.sqlite`. Di VPS MySQL, backup lewat server:

```bash
mkdir -p /var/backups/berkahteknik
mysqldump -u berkah -p berkahteknik > /var/backups/berkahteknik/berkah-$(date +%F).sql
```

Juga cadangkan:

- `.env`
- `storage/app/public` (logo, foto KTP, unggahan)

Contoh cron harian (jam 02:00):

```cron
0 2 * * * mysqldump -u berkah -p'GANTI_PASSWORD_DB' berkahteknik > /var/backups/berkahteknik/berkah-$(date +\%F).sql
```

---

## Troubleshooting

| Gejala | Periksa |
|---|---|
| Halaman putih / 500 | `storage/logs/laravel.log`, `APP_DEBUG=false` jangan dibiarkan tanpa cek log |
| CSS/JS tidak muncul | `npm run build` sudah jalan; `public/build` ada `manifest.json` |
| Logo tidak tampil | `php artisan storage:link`; folder `storage` milik `www-data` |
| Upload gagal | `client_max_body_size` Nginx dan `upload_max_filesize` PHP |
| Update GitHub gagal | `DEPLOY_PHP_BINARY=/usr/bin/php8.3`; deploy key; `sudo -u www-data git fetch` |
| Composer gagal dari panel | Composer di PATH `www-data`, atau set `DEPLOY_COMPOSER_BINARY` |
| Permission denied | `chown -R www-data:www-data` pada project; `storage` dan `bootstrap/cache` writable |
| Session error | `php artisan migrate` (tabel `sessions`, `cache`, `jobs`) |

Log PHP-FPM / Nginx:

```bash
sudo tail -n 80 /var/www/berkahteknik/storage/logs/laravel.log
sudo tail -n 80 /var/log/nginx/error.log
```

---

## Pengembangan

```bash
composer install
npm install
npm run dev          # Vite HMR
php artisan serve    # jika tidak memakai Laragon/Nginx
php artisan migrate
php artisan pint     # format PHP
```

Build produksi frontend: `npm run build`.
