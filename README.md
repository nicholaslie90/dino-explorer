# Dino Explorer 🦖

Web app hewan purba untuk anak (6–10 tahun), Bahasa Indonesia + English. Static site di Cloudflare Pages.

- 103 dinosaurus & hewan purba lain, dengan pencarian dan filter (daging / tumbuhan / terbang / laut)
- Tampilan **🎨 Animasi** (kartun SVG beranimasi) atau **📷 Realistis** (paleoart Wikimedia Commons, tetap beranimasi). Pilihan diingat sebagai default.
- Suara tiap hewan (CC0 / Public Domain, lihat `public/sounds/LICENSES.md`)
- Tombol "Bacakan" (text-to-speech browser)
- Fakta dicek terhadap Wikipedia (Okt 2026); kredit gambar tampil di halaman tiap hewan

Struktur: `public/data.js` (10 dino inti + UI teks) mengimpor `public/data/batch-*.js`; gambar di `public/img/`.

```sh
npm run dev     # http://localhost:8787
npm test        # cek kelengkapan data, gambar, lisensi, suara
npm run deploy  # deploy ke Cloudflare Pages (perlu `npx wrangler login`)
```
