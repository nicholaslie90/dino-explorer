# Dino Explorer 🦖

Web app dinosaurus untuk anak (6–10 tahun), Bahasa Indonesia + English. Static site di Cloudflare Pages.

- 10 hewan purba dengan gambar SVG beranimasi (jalan, napas, ekor, mengaum, terbang, berenang)
- Suara tiap dino (CC0 / Public Domain, lihat `public/sounds/LICENSES.md`)
- Tombol "Bacakan" (text-to-speech browser)
- Kuis: tebak bayangan, makanan, dan siapa yang lebih panjang

```sh
npm run dev     # http://localhost:8787
npm test        # cek kelengkapan data
npm run deploy  # deploy ke Cloudflare Pages (perlu `npx wrangler login`)
```
