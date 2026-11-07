# IT Solution — Katalog Unit Usaha HMP-TI ITS

Website menggunakan HTML, CSS, dan JavaScript murni. Tidak memerlukan instalasi, framework, akun, atau koneksi internet untuk menjalankan berkas yang disertakan.

## Membuka website

Ekstrak ZIP, lalu buka `index.html` di browser. Untuk pengembangan, buka folder ini di VS Code dan jalankan Live Server bila tersedia.

## Alur demonstrasi sekitar satu menit

1. Tampilkan halaman pembuka: identitas HMP-TI ITS, logo IT Solution, dan empat bidang layanan.
2. Gulir perlahan untuk memperlihatkan transisi katalog ponsel dan perubahan warna adegan. Pilih salah satu layanan di ponsel untuk membuka detailnya.
3. Buka katalog. Ketik **print tugas**, tunjukkan hasil Percetakan & Dokumen, lalu buka detailnya.
4. Hapus pencarian dan tunjukkan galeri empat unit. Pada desktop, arahkan kursor atau fokus keyboard ke kartu untuk memperluasnya.
5. Buka **Menu**, pilih **Informasi**, lalu buka salah satu baris informasi.
6. Tampilkan versi layar kecil untuk menunjukkan susunan kartu, menu, dan dialog yang menyesuaikan ruang.

## Hubungan dengan kriteria penilaian

| Kriteria | Bobot | Hal yang dapat ditunjukkan |
| --- | --- | --- |
| Kelengkapan HTML | 40% | `index.html` memiliki judul tab yang sesuai, satu `h1`, struktur semantik, serta empat unit dengan judul, paragraf deskripsi, dan gambar. |
| Kualitas CSS | 40% | `style.css` eksternal mengatur jenis huruf, kontras warna, margin, padding, dan tata letak responsif. Warna krem, navy, dan aksen kuning menyelaraskan katalog dengan logo. |
| Tantangan JavaScript | 20% | `script.js` eksternal dipanggil di akhir `body`. Detail empat unit, pencarian lokal, akses cepat dari ponsel, navigasi buka/tutup, dan akordeon dapat didemonstrasikan. |
| Kerapian kode | Poin plus | HTML, CSS, dan JavaScript terpisah dengan indentasi konsisten; data detail terpusat di `unitDetails`. Tidak ada framework CSS/JS atau dependensi runtime. |

Tata letak juga diuji pada lebar 320, 390, 1366, dan 1440 piksel.

Keyboard dapat digunakan untuk membuka menu, memilih layanan, serta menutup dialog dengan Escape. Preferensi pengurangan gerakan dari perangkat juga dihormati. Animasi adegan dijeda ketika berada di luar layar.

## Data yang perlu dilengkapi sebelum pengumpulan resmi

Kontak, jam operasional, lokasi, dan harga belum diberikan. Website menampilkan keterangan pembaruan oleh pengurus. Isi data terverifikasi pada objek `unitDetails` di awal `script.js`; jangan mengganti dengan informasi contoh.

Foto kategori merupakan ilustrasi layanan. Ganti dengan dokumentasi unit usaha yang berizin jika tersedia. Logo disertakan dalam versi web dan versi resolusi tinggi dengan latar transparan.

Identitas: **Ariza Naufal Kholish — 2510010223**.

Repository: https://github.com/ArizaNaufalKholish-2510010223/portofolio_Ariza-Naufal-Kholish_2510010223

Alamat GitHub Pages: https://arizanaufalkholish-2510010223.github.io/portofolio_Ariza-Naufal-Kholish_2510010223/
