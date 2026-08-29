<?php

$now = now();

return [
    [
        'title' => 'Promo Servis AC Mobil — Diskon 15%',
        'slug' => 'promo-servis-ac-mobil-diskon-15',
        'type' => 'promo',
        'excerpt' => 'Dapatkan diskon 15% untuk paket servis AC mobil lengkap selama bulan ini.',
        'body' => "Syarat dan ketentuan:\n- Berlaku untuk semua tipe mobil\n- Tidak dapat digabung dengan promo lain\n- Hubungi kami via WhatsApp untuk reservasi",
        'cover_image_path' => 'images/cms/cover-promo-servis-ac.jpg',
        'is_published' => true,
        'published_at' => $now->copy()->subDays(3),
        'sort_order' => 10,
    ],
    [
        'title' => 'Tips Merawat AC Agar Awet dan Dingin',
        'slug' => 'tips-merawat-ac-agar-awet',
        'type' => 'berita',
        'excerpt' => 'Beberapa kebiasaan sederhana yang membantu AC mobil tetap optimal.',
        'body' => "1. Rutin servis setiap 6 bulan\n2. Bersihkan filter AC secara berkala\n3. Hindari pengaturan suhu terlalu ekstrem\n4. Segera periksa jika AC kurang dingin atau berbau",
        'cover_image_path' => 'images/cms/cover-tips-merawat-ac.jpg',
        'is_published' => true,
        'published_at' => $now->copy()->subDays(2),
        'sort_order' => 5,
    ],
    [
        'title' => 'Jam Operasional Bengkel',
        'slug' => 'jam-operasional-bengkel',
        'type' => 'informasi',
        'excerpt' => 'Informasi jam buka dan layanan booking servis.',
        'body' => "Senin – Sabtu: 08.00 – 17.00 WIB\nMinggu: Tutup\n\nUntuk antrian lebih cepat, silakan daftar melalui portal pelanggan atau WhatsApp.",
        'cover_image_path' => 'images/cms/cover-jam-operasional.jpg',
        'is_published' => true,
        'published_at' => $now->copy()->subDays(4),
        'sort_order' => 0,
    ],
    [
        'title' => 'AC Mobil Kurang Dingin di Musim Kemarau? Ini Temuan Paling Sering dari Bengkel',
        'slug' => 'ac-mobil-kurang-dingin-musim-kemarau',
        'type' => 'berita',
        'excerpt' => 'Keluhan AC kurang dingin biasanya naik saat cuaca panas. Berikut lima temuan yang paling sering muncul saat diagnosa, plus yang bisa dicek sendiri sebelum ke bengkel.',
        'cover_image_path' => 'images/cms/cover-diagnosa-ac-kurang-dingin.jpg',
        'is_published' => true,
        'published_at' => $now,
        'sort_order' => 20,
        'body' => <<<'TXT'
Musim kemarau biasanya membuat banyak pemilik kendaraan baru merasakan perubahan pada AC mobil. Kabin terasa lebih lama dingin, hembusan angin lemah, atau udara yang keluar justru pengap. Di bengkel, keluhan ini hampir selalu meningkat pada bulan-bulan kering — bukan karena cuaca “merusak” AC secara tiba-tiba, melainkan karena sistem pendingin bekerja lebih berat dan masalah kecil yang selama ini tertunda jadi terasa.

Artikel ini merangkum temuan yang paling sering kami jumpai saat diagnosa, plus langkah yang bisa Anda cek sendiri sebelum membawa kendaraan.

Mengapa keluhan naik saat udara panas?

AC mobil bukan hanya soal “isi freon”. Sistem ini bekerja sebagai satu rangkaian: kompresor, kondensor, evaporator, filter kabin, blower, dan saluran yang harus tertutup rapat. Saat suhu luar tinggi, beban kerja naik. Kalau salah satu bagian sudah menurun, hasilnya langsung terasa di kabin.

Yang juga sering terlewat: kebiasaan pemakaian. Menyalakan AC dengan suhu paling dingin dan blower paling kencang segera setelah mesin hidup, atau memarkir mobil di bawah terik tanpa sirkulasi, membuat sistem bekerja ekstra sejak menit pertama.

Lima temuan paling sering di bengkel

1. Filter kabin kotor
Ini penyebab yang paling sederhana, sekaligus paling sering diabaikan. Filter yang tersumbat debu dan serat membuat aliran udara terhambat. Gejalanya khas: angin terasa lemah, kabin bau pengap, kaca mudah berembun, dan AC “dingin di ventilasi” tapi tidak merata.

Penggantian filter kabin biasanya cepat. Untuk mobil yang sering lewat jalan berdebu atau area industri, interval 6 bulan lebih aman daripada menunggu setahun.

2. Evaporator kotor atau berjamur
Kalau AC berbau saat baru dinyalakan, lalu membaik setelah beberapa menit, curigai evaporator. Debu yang menempel di sirip evaporator menghambat pertukaran panas. Dalam kondisi lembap di dalam unit, jamur mudah tumbuh.

Cuci evaporator yang benar tidak hanya semprot pewangi. Teknisi perlu akses yang tepat, pembersihan, dan pengeringan agar bau tidak kembali dalam seminggu.

3. Tekanan refrigeran tidak sesuai
Banyak pelanggan datang dengan permintaan “isi freon saja”. Padahal refrigeran yang kurang biasanya ada sebabnya: kebocoran kecil di sambungan, O-ring aus, atau kondensor yang mulai retak. Mengisi ulang tanpa mencari kebocoran hanya menunda masalah.

Sebaliknya, pengisian berlebih juga merusak. Tekanan yang terlalu tinggi membuat kompresor bekerja berat dan pendinginan justru tidak stabil. Diagnosa yang benar memakai manifold gauge, cek visual, dan — bila perlu — uji kebocoran.

4. Kondensor tertutup kotoran
Kondensor di depan radiator mudah dilapisi debu, serangga, dan kotoran jalan. Di musim kemarau, debu lebih banyak. Pendinginan di sisi panas terganggu, tekanan naik, dan udara kabin terasa “dingin sebentar lalu menghangat”.

Pembersihan kondensor sering sudah mengembalikan performa, asalkan sirip tidak patah dan kipas masih bekerja normal.

5. Kompresor atau magnetic clutch mulai lemah
Kalau AC kadang dingin kadang tidak, atau terdengar bunyi tidak wajar dari ruang mesin saat AC hidup, kompresor perlu dicek. Kerusakan ini tidak selalu berarti harus ganti unit. Kadang masalah ada di kopling, tegangan, atau oli kompresor.

Karena biayanya lebih besar, kami selalu menempatkan pemeriksaan ini setelah penyebab yang lebih sederhana disingkirkan.

Yang bisa Anda cek sendiri di rumah

Sebelum ke bengkel, beberapa pengecekan ringan membantu:

- Pastikan tombol AC benar-benar aktif, bukan hanya blower.
- Coba mode sirkulasi dalam kabin, lalu bandingkan dengan udara luar.
- Perhatikan apakah ada tetesan air di bawah mobil setelah AC dipakai — itu normal. Kalau tidak ada sama sekali dan kabin lembap, saluran pembuangan bisa tersumbat.
- Cium bau saat menit pertama. Bau apek berulang biasanya bukan soal “freon habis”.
- Dengarkan apakah kompresor “klik” hidup saat AC dinyalakan.

Hindari membongkar sistem sendiri. Refrigeran dan oli kompresor perlu penanganan yang benar.

Bagaimana alur diagnosa di bengkel

Di Berkah Teknik AC, kami tidak langsung mengisi refrigeran. Alurnya biasanya:

1. Wawancara singkat: kapan mulai terasa, apakah tiba-tiba atau bertahap, ada bau atau bunyi.
2. Cek visual: filter kabin, kondensor, belt, kebocoran olahan oli di sambungan.
3. Uji kinerja: suhu hembusan, tekanan sistem, dan kerja kompresor.
4. Penjelasan temuan dan estimasi, baru pengerjaan setelah Anda setuju.

Transparansi ini penting supaya Anda tahu apakah yang dibutuhkan cukup servis ringan, atau memang ada komponen yang harus diganti.

Kapan harus segera dibawa?

Segera ke bengkel jika:

- AC tiba-tiba tidak dingin sama sekali setelah sebelumnya normal.
- Ada bunyi gesek atau ketukan dari kompresor.
- Kabin berbau seperti kimia atau terbakar.
- Lampu peringatan mesin menyala bersamaan dengan keluhan AC.

Menunda pada kondisi itu bisa membuat kerusakan merambat ke komponen lain.

Penutup

AC yang kurang dingin hampir selalu punya jejak yang bisa dilacak — dari filter yang sudah waktunya diganti sampai kebocoran yang tidak terlihat mata. Semakin awal dicek, semakin besar peluang selesai dengan servis ringan.

Jika Anda ingin antrean lebih nyaman, daftar lewat portal pelanggan atau hubungi WhatsApp bengkel. Bawa juga catatan kapan terakhir servis AC, supaya teknisi bisa menyesuaikan diagnosa dari awal.
TXT,
    ],
];
