#!/usr/bin/env bash
# Build aset frontend di VPS — jalankan dari root proyek Laravel
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Memeriksa package.json..."
if ! grep -q '@point-of-sale/receipt-printer-encoder' package.json; then
    echo ""
    echo "ERROR: package.json di server TIDAK berisi paket thermal printer."
    echo "Kode JS sudah baru, tapi dependency belum. Perbaiki dengan Git:"
    echo "  git fetch origin --tags --force"
    echo "  git checkout -f 1.1"
    echo ""
    echo "Atau salin package.json + package-lock.json dari komputer development."
    exit 1
fi

if [[ ! -f package-lock.json ]]; then
    echo "WARNING: package-lock.json tidak ada, memakai npm install..."
    rm -rf node_modules
    npm install --include=dev --no-audit --no-fund
else
    echo "==> Instal bersih (npm ci --include=dev)..."
    rm -rf node_modules
    npm ci --include=dev --no-audit --no-fund
fi

echo "==> Memastikan paket @point-of-sale..."
for pkg in receipt-printer-encoder webbluetooth-receipt-printer; do
    if [[ ! -d "node_modules/@point-of-sale/${pkg}" ]]; then
        echo "    Memasang @point-of-sale/${pkg}..."
        npm install "@point-of-sale/${pkg}" --no-audit --no-fund
    fi
done

if [[ ! -d node_modules/@point-of-sale/receipt-printer-encoder ]]; then
    echo "ERROR: Paket tetap tidak ada. Cek akses ke registry.npmjs.org dari server."
    exit 1
fi

echo "==> npm run build..."
npm run build

echo "==> Selesai. Cek: public/build/manifest.json"
test -f public/build/manifest.json && echo "OK: manifest.json ada."
