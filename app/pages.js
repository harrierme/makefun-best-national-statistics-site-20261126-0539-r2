// DataNusa — halaman situs + router berbasis hash.
// Satu index.html melayani delapan halaman lewat hash (#/ekonomi, #/penduduk, ...).
// Tiap halaman dirakit dari data.js; grafik digambar ulang oleh charts.js.

import { SOROTAN, RENTANG, LAPANGAN, UMUR, DAERAH } from "./data.js";
import { DAERAH_SUMBER, KERJA, KEUANGAN, SOSIAL, NEGARA } from "./data.js";
import { tahunSeri, nilaiSeri, nilaiTahun, formatAngka } from "./data.js";
import { grafikGaris, grafikBatang, grafikDonat, grafikUmur, percik } from "./charts.js";

export const NAVIGASI = [
  ["#/", "Beranda"],
  ["#/ekonomi", "Ekonomi"],
  ["#/penduduk", "Penduduk"],
  ["#/tenaga-kerja", "Tenaga Kerja"],
  ["#/kemiskinan", "Kemiskinan"],
  ["#/bandingkan", "Bandingkan"],
  ["#/data", "Tabel Data"],
  ["#/sumber", "Sumber"],
];

function amankan(teks) {
  let hasil = String(teks);
  const pasangan = [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"]];
  for (const [cari, ganti] of pasangan) hasil = hasil.split(cari).join(ganti);
  return hasil;
}

function barisSumber(asal, tambahan = "") {
  const ekor = tambahan ? " — " + amankan(tambahan) : "";
  return '<p class="origin">Sumber: ' + amankan(asal) + ekor + "</p>";
}

// Kartu angka utama, lengkap dengan percik tren serinya.
function kartuAngka(butir, urutan) {
  const seri = RENTANG[butir.seri];
  const judul = seri ? amankan(seri.judul) : "";
  return [
    '<article class="stat">',
    '    <p class="stat-name">' + amankan(butir.label) + "</p>",
    '    <p class="stat-figure">' + amankan(butir.angka) + "</p>",
    '    <p class="stat-detail">' + amankan(butir.ket) + "</p>",
    '    <canvas class="spark" id="spark-' + urutan + '" aria-hidden="true"></canvas>',
    '    <p class="stat-change">' + amankan(butir.selisih) + "</p>",
    '    <p class="stat-origin">Sumber: ' + amankan(butir.asal) + "</p>",
    '    <span class="sr-only">Tren: ' + judul + "</span>",
    "  </article>",
  ].join("\n");
}

// Kartu pembungkus grafik: judul + kanvas + baris sumber.
function kartuGrafik(id, judul, asal, catatan = "") {
  return [
    '<section class="panel graph">',
    "    <h3>" + amankan(judul) + "</h3>",
    '    <canvas id="' + id + '" role="img" aria-label="Grafik ' + amankan(judul) + '"></canvas>',
    "    " + barisSumber(asal, catatan),
    "  </section>",
  ].join("\n");
}

function tabelTahun(seri) {
  const desimal = seri.satuan === "rasio" ? 3 : 2;
  const baris = seri.tahun
    .map((tahun, i) => "<tr><td>" + tahun + "</td><td>" + formatAngka(seri.nilai[i], desimal) + "</td></tr>")
      .join("");
  return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tahun</th><th>' + amankan(seri.judul) + "</th></tr></thead><tbody>" + baris + "</tbody></table></div>";
}

// Daftarkan grafik halaman ini supaya digambar sekarang + saat jendela diubah ukurannya.
function gambar(tugas) {
  const daftar = window.__gambarUlang || (window.__gambarUlang = {});
  Object.keys(tugas).forEach((id) => {
    const kanvas = document.getElementById(id);
    if (!kanvas) return;
    daftar[id] = () => tugas[id](kanvas);
    tugas[id](kanvas);
  });
}

addEventListener("resize", () => {
  const daftar = window.__gambarUlang;
  if (!daftar) return;
  Object.values(daftar).forEach((lukis) => lukis());
});

// ================ Beranda ================
function halamanBeranda() {
  const kartu = SOROTAN.map(kartuAngka).join("");
  const limaBesar = DAERAH.slice(0, 5)
    .map((d, i) => "<tr><td>" + (i + 1) + '</td><td><a href="#/penduduk">' + amankan(d[0]) + "</a></td><td>" + amankan(d[1]) + "</td><td>" + formatAngka(d[2]) + "</td><td>" + formatAngka((d[2] / 281.6) * 100, 1) + "%</td></tr>")
      .join("");
  return [
    "",
    '  <section class="hero">',
    '    <div class="hero-main">',
    '    <p class="kicker">Portal statistik resmi · Indonesia</p>',
    "    <h1>Indonesia dalam angka</h1>",
    "    <p class=\"lede\">Penduduk, ekonomi, pekerjaan, dan kesejahteraan Indonesia — dirangkum dari",
    "    publikasi resmi BPS, Bank Indonesia, dan Kementerian Keuangan, diperbarui " + amankan(NEGARA.dimutakhirkan) + ".</p>",
    '    <div class="hero-actions">',
    '      <a class="button" href="#/ekonomi">Lihat ekonomi →</a>',
    '      <a class="button outline" href="#/penduduk">Jelajahi provinsi →</a>',
    "    </div>",
    "    </div>",
    '    <aside class="hero-side" aria-label="Angka kunci 2024">',
    '      <p class="hero-side-title">Sekilas 2024</p>',
    "      <dl>",
    "        <div><dt>Penduduk</dt><dd>281,6 jt</dd></div>",
    "        <div><dt>PDB</dt><dd>Rp22.139 T</dd></div>",
    "        <div><dt>Pertumbuhan</dt><dd>5,03%</dd></div>",
    "        <div><dt>Kemiskinan</dt><dd>8,47%</dd></div>",
    "      </dl>",
    "    </aside>",
    "  </section>",
    "",
    '  <section class="stat-grid">' + kartu + "</section>",
    "",
    '  <div class="cols-2">',
    "    " + kartuGrafik("home-growth", RENTANG.pertumbuhan.judul, RENTANG.pertumbuhan.asal, RENTANG.pertumbuhan.catatan),
    "    " + kartuGrafik("home-inflasi", RENTANG.inflasi.judul, RENTANG.inflasi.asal, RENTANG.inflasi.catatan),
    "  </div>",
    "",
    '  <section class="panel">',
    "    <h2>Sekilas 2024</h2>",
    '    <ul class="points">',
    "      <li><strong>281,6 juta</strong> penduduk — negara keempat terbanyak di dunia, dengan 68,8% penduduk berusia produktif (15–64 tahun).</li>",
    "      <li><strong>PDB Rp22.139 triliun</strong> dengan pertumbuhan 5,03%; lapangan usaha terbesar adalah industri pengolahan (18,67% PDB).</li>",
    "      <li><strong>Ekspor US$264,7 miliar</strong> dan surplus perdagangan US$31,0 miliar; cadangan devisa US$155,7 miliar.</li>",
    "      <li><strong>Kemiskinan 8,47%</strong> (Maret 2025) — terendah dalam sejarah pencatatan BPS; gini 0,375.</li>",
    "      <li><strong>IPM 75,02</strong> (2024), naik dari 74,39 pada 2023; harapan hidup 74,15 tahun.</li>",
    "    </ul>",
    "    " + barisSumber("Badan Pusat Statistik (BPS), Bank Indonesia, Kementerian Keuangan", "angka per 2024 kecuali dinyatakan lain"),
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Provinsi berpenduduk terbesar</h2>",
    '    <div class="tbl-wrap"><table class="tbl">',
    "      <thead><tr><th>#</th><th>Provinsi</th><th>Ibu kota</th><th>Penduduk 2024 (juta)</th><th>Pangsa</th></tr></thead>",
    "      <tbody>",
    "        " + limaBesar,
    "      </tbody>",
    "    </table></div>",
    '    <p><a href="#/penduduk">Lihat semua 15 provinsi terbesar →</a></p>',
    "    " + barisSumber(DAERAH_SUMBER),
    "  </section>",
  ].join("\n");
}

function lukisBeranda() {
  gambar({
    "home-growth": (kanvas) => grafikGaris(kanvas, RENTANG.pertumbuhan, { tinggi: 250 }),
    "home-inflasi": (kanvas) => grafikBatang(kanvas, RENTANG.inflasi, { tinggi: 250 }),
  });
  SOROTAN.forEach((butir, i) => {
    const kanvas = document.getElementById("spark-" + i);
    if (!kanvas || !RENTANG[butir.seri]) return;
    percik(kanvas, nilaiSeri(RENTANG[butir.seri]));
  });
}

// ================ Ekonomi ================
function halamanEkonomi() {
  const barisUang = KEUANGAN
    .map((b) => "<tr><td>" + amankan(b[0]) + "</td><td><strong>" + amankan(b[1]) + "</strong></td><td>" + amankan(b[2]) + "</td><td>" + amankan(b[3]) + "</td></tr>")
      .join("");
  return [
    "",
    '  <section class="page-top">',
    '    <p class="kicker">Topik</p>',
    "    <h1>Ekonomi</h1>",
    '    <p class="lede">Pertumbuhan, harga, perdagangan, dan keuangan negara Indonesia.</p>',
    "  </section>",
    "",
    '  <div class="cols-2">',
    "    " + kartuGrafik("eco-growth", RENTANG.pertumbuhan.judul, RENTANG.pertumbuhan.asal, RENTANG.pertumbuhan.catatan),
    "    " + kartuGrafik("eco-inflasi", RENTANG.inflasi.judul, RENTANG.inflasi.asal, RENTANG.inflasi.catatan),
    "  </div>",
    "",
    '  <div class="cols-2">',
    "    " + kartuGrafik("eco-ekspor", RENTANG.ekspor.judul, RENTANG.ekspor.asal, RENTANG.ekspor.catatan),
    '    <section class="panel">',
    "      <h3>" + amankan(LAPANGAN.judul) + "</h3>",
    '      <canvas id="eco-sektor" role="img" aria-label="Donat pangsa PDB menurut lapangan usaha"></canvas>',
    "      " + barisSumber(LAPANGAN.asal, LAPANGAN.catatan),
    "    </section>",
    "  </div>",
    "",
    '  <section class="panel">',
    "    <h2>Keuangan negara &amp; moneter</h2>",
    '    <div class="tbl-wrap"><table class="tbl">',
    "      <thead><tr><th>Indikator</th><th>Nilai</th><th>Keterangan</th><th>Sumber</th></tr></thead>",
    "      <tbody>" + barisUang + "</tbody>",
    "    </table></div>",
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Apa yang dibaca dari angka ini?</h2>",
    '    <ul class="points">',
    "      <li><strong>Pertumbuhan 5,03%</strong> pada 2024 ditopang konsumsi rumah tangga dan investasi; kontraksi 2020 (-2,07%) adalah satu-satunya tahun negatif dalam enam tahun terakhir.</li>",
    "      <li><strong>Inflasi 1,57%</strong> pada 2024 adalah yang terendah sejak 2020 dan berada dalam sasaran Bank Indonesia (2,5% ±1%).</li>",
    "      <li><strong>Ekspor 2024 (US$264,7 M)</strong> turun dari rekor 2022 (US$291,9 M) seiring normalisasi harga komoditas, tetapi neraca dagang tetap surplus 56 bulan beruntun hingga akhir 2024.</li>",
    "    </ul>",
    "  </section>",
  ].join("\n");
}

function lukisEkonomi() {
  gambar({
    "eco-growth": (kanvas) => grafikGaris(kanvas, RENTANG.pertumbuhan, { tinggi: 250 }),
    "eco-inflasi": (kanvas) => grafikBatang(kanvas, RENTANG.inflasi, { tinggi: 250 }),
    "eco-ekspor": (kanvas) => grafikBatang(kanvas, RENTANG.ekspor, { tinggi: 250, warna: "#3d5a80" }),
    "eco-sektor": (kanvas) => grafikDonat(kanvas, LAPANGAN.baris, { tinggi: 250, tengah: "62,2%", catatanTengah: "dari PDB" }),
  });
}

// ================ Penduduk ================
function halamanPenduduk() {
  const baris = DAERAH
    .map((d, i) => [
      '<tr data-name="' + amankan(d[0].toLowerCase()) + '">',
      "    <td>" + (i + 1) + "</td><td>" + amankan(d[0]) + "</td><td>" + amankan(d[1]) + "</td>",
      "    <td>" + formatAngka(d[2]) + "</td><td>" + formatAngka((d[2] / 281.6) * 100, 1) + "%</td></tr>",
    ].join("\n"))
      .join("");
  return [
    "",
    '  <section class="page-top">',
    '    <p class="kicker">Topik</p>',
    "    <h1>Penduduk &amp; Wilayah</h1>",
    '    <p class="lede">281,6 juta jiwa pada 2024 — tersebar di 38 provinsi, dengan 56% tinggal di Pulau Jawa.</p>',
    "  </section>",
    "",
    '  <div class="cols-2">',
    "    " + kartuGrafik("pop-total", RENTANG.populasi.judul, RENTANG.populasi.asal, RENTANG.populasi.catatan),
    '    <section class="panel">',
    "      <h3>" + amankan(UMUR.judul) + "</h3>",
    '      <canvas id="pop-age" role="img" aria-label="Struktur umur penduduk 2024"></canvas>',
    "      " + barisSumber(UMUR.asal, UMUR.catatan),
    "    </section>",
    "  </div>",
    "",
    '  <section class="panel">',
    "    <h2>Provinsi berpenduduk terbesar, 2024</h2>",
    '    <p class="tools"><label>Cari provinsi: <input id="prov-q" type="search" placeholder="mis. Jawa Barat" aria-label="Cari provinsi"></label>',
    '    <span id="prov-count">' + DAERAH.length + " provinsi ditampilkan</span></p>",
    '    <div class="tbl-wrap"><table class="tbl" id="prov-tbl">',
    '      <thead><tr><th><button class="sort-btn" data-key="rank">#</button></th>',
    '      <th><button class="sort-btn" data-key="name">Provinsi</button></th><th>Ibu kota</th>',
    '      <th><button class="sort-btn" data-key="pop">Penduduk 2024 (juta)</button></th><th>Pangsa</th></tr></thead>',
    "      <tbody>" + baris + "</tbody>",
    "    </table></div>",
    "    " + barisSumber(DAERAH_SUMBER),
    "  </section>",
  ].join("\n");
}

function lukisPenduduk() {
  gambar({
    "pop-total": (kanvas) => grafikGaris(kanvas, RENTANG.populasi, { tinggi: 250, warna: "#20706a" }),
    "pop-age": (kanvas) => grafikUmur(kanvas, UMUR.kelompok, { tinggi: 260 }),
  });
  const cari = document.getElementById("prov-q");
  const hitung = document.getElementById("prov-count");
  const badan = document.querySelector("#prov-tbl tbody");
  if (cari && badan) {
    cari.addEventListener("input", () => {
      const kata = cari.value.trim().toLowerCase();
      let tampil = 0;
      badan.querySelectorAll("tr").forEach((baris) => {
        const cocok = baris.dataset.name.includes(kata);
        baris.style.display = cocok ? "" : "none";
        if (cocok) tampil++;
      });
      hitung.textContent = tampil + " provinsi ditampilkan";
    });
  }
  document.querySelectorAll("#prov-tbl .sort-btn").forEach((tombol) => {
    tombol.addEventListener("click", () => {
      const kunci = tombol.dataset.key;
      const semua = [...badan.querySelectorAll("tr")];
      const naik = tombol.dataset.asc !== "1";
      tombol.dataset.asc = naik ? "1" : "0";
      const angkaSel = (baris) => parseFloat(baris.cells[3].textContent.replace(".", "").replace(",", "."));
      semua.sort((a, b) => {
        if (kunci === "name") {
          return naik
            ? a.cells[1].textContent.localeCompare(b.cells[1].textContent, "id")
            : b.cells[1].textContent.localeCompare(a.cells[1].textContent, "id");
        }
        if (kunci === "pop") return naik ? angkaSel(a) - angkaSel(b) : angkaSel(b) - angkaSel(a);
        return naik
          ? Number(a.cells[0].textContent) - Number(b.cells[0].textContent)
          : Number(b.cells[0].textContent) - Number(a.cells[0].textContent);
      });
      semua.forEach((baris) => badan.appendChild(baris));
    });
  });
}

// ================ Tenaga Kerja ================
function halamanKerja() {
  const kartu = [
    ["Angkatan kerja", KERJA.angkatan],
    ["Penduduk bekerja", KERJA.bekerja],
    ["TPT perkotaan", KERJA.kota],
    ["TPT perdesaan", KERJA.desa],
    ["Rata-rata upah buruh", KERJA.upah],
  ]
    .map(([label, d]) => '<article class="stat"><p class="stat-name">' + amankan(label) + '</p><p class="stat-figure">' + amankan(d.angka) + '</p><p class="stat-detail">' + amankan(d.ket) + '</p><p class="stat-origin">Sumber: ' + amankan(d.asal) + "</p></article>")
      .join("");
  return [
    "",
    '  <section class="page-top">',
    '    <p class="kicker">Topik</p>',
    "    <h1>Tenaga Kerja</h1>",
    '    <p class="lede">153,05 juta orang angkatan kerja pada Februari 2025; 145,77 juta di antaranya bekerja.</p>',
    "  </section>",
    "",
    '  <section class="stat-grid">' + kartu + "</section>",
    "",
    '  <div class="cols-2">',
    "    " + kartuGrafik("jobs-tpt", RENTANG.pengangguran.judul, RENTANG.pengangguran.asal, RENTANG.pengangguran.catatan),
    '    <section class="panel">',
    "      <h3>Tingkat pengangguran terbuka, Agustus</h3>",
    "      " + tabelTahun(RENTANG.pengangguran),
    "      " + barisSumber(RENTANG.pengangguran.asal, "Februari 2025: 4,76%."),
    "    </section>",
    "  </div>",
    "",
    '  <section class="panel">',
    "    <h2>Membaca angka pengangguran</h2>",
    '    <ul class="points">',
    "      <li><strong>TPT turun dalam lima pembacaan survei beruntun</strong> dari puncak pandemi 7,07% (Agustus 2020) menjadi 4,91% (Agustus 2024) dan 4,76% (Februari 2025).</li>",
    "      <li><strong>Pengangguran perkotaan (5,73%) lebih tinggi</strong> daripada perdesaan (3,61%) pada Februari 2025 — pola yang konsisten setiap tahun.</li>",
    "      <li><strong>Upah rata-rata buruh Rp3,09 juta/bulan</strong> (Agustus 2024), naik dari Rp2,87 juta pada Agustus 2023.</li>",
    "    </ul>",
    "  </section>",
  ].join("\n");
}

function lukisKerja() {
  gambar({
    "jobs-tpt": (kanvas) => grafikGaris(kanvas, RENTANG.pengangguran, { tinggi: 250, warna: "#c2492f" }),
  });
}

// ================ Kemiskinan ================
function halamanMiskin() {
  return [
    "",
    '  <section class="page-top">',
    '    <p class="kicker">Topik</p>',
    "    <h1>Kemiskinan &amp; Ketimpangan</h1>",
    '    <p class="lede">8,47% penduduk miskin pada Maret 2025 — 24,06 juta jiwa, terendah sepanjang sejarah pencatatan.</p>',
    "  </section>",
    "",
    '  <div class="cols-2">',
    "    " + kartuGrafik("poor-rate", RENTANG.kemiskinan.judul, RENTANG.kemiskinan.asal, RENTANG.kemiskinan.catatan),
    "    " + kartuGrafik("poor-gini", RENTANG.gini.judul, RENTANG.gini.asal, RENTANG.gini.catatan),
    "  </div>",
    "",
    '  <section class="panel">',
    "    <h2>Angka kunci</h2>",
    '    <div class="tbl-wrap"><table class="tbl">',
    "      <thead><tr><th>Indikator</th><th>Nilai</th><th>Keterangan</th></tr></thead>",
    "      <tbody>",
    "        <tr><td>Penduduk miskin</td><td><strong>24,06 juta jiwa</strong></td><td>Maret 2025</td></tr>",
    "        <tr><td>Garis kemiskinan</td><td><strong>Rp609.160</strong></td><td>Per kapita per bulan, Maret 2025</td></tr>",
    "        <tr><td>Kemiskinan perkotaan</td><td><strong>7,26%</strong></td><td>Maret 2025</td></tr>",
    "        <tr><td>Kemiskinan perdesaan</td><td><strong>11,03%</strong></td><td>Maret 2025</td></tr>",
    "        <tr><td>Rasio gini</td><td><strong>0,375</strong></td><td>Maret 2025</td></tr>",
    "      </tbody>",
    "    </table></div>",
    "    " + barisSumber("Badan Pusat Statistik (BPS)", "Profil Kemiskinan di Indonesia, Maret 2025"),
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Membaca angka kemiskinan</h2>",
    '    <ul class="points">',
    "      <li><strong>Kemiskinan turun dari 10,14% (Maret 2021)</strong> menjadi 8,47% (Maret 2025) seiring pulihnya ekonomi pascapandemi.</li>",
    "      <li><strong>Jurang kota–desa tetap lebar:</strong> kemiskinan perdesaan 11,03% berbanding 7,26% di perkotaan pada Maret 2025.</li>",
    "      <li><strong>Gini 0,375</strong> menunjukkan ketimpangan pengeluaran yang relatif stabil dalam lima tahun terakhir (0,375–0,384).</li>",
    "    </ul>",
    "  </section>",
  ].join("\n");
}

function lukisMiskin() {
  gambar({
    "poor-rate": (kanvas) => grafikGaris(kanvas, RENTANG.kemiskinan, { tinggi: 250, warna: "#20706a" }),
    "poor-gini": (kanvas) => grafikGaris(kanvas, RENTANG.gini, { tinggi: 250, warna: "#3d5a80" }),
  });
}

// ================ Bandingkan ================
function halamanBanding() {
  const opsiDaerah = DAERAH
    .map((d) => '<option value="' + amankan(d[0]) + '">' + amankan(d[0]) + "</option>")
      .join("");
  const opsiTahun = tahunSeri(RENTANG.pertumbuhan)
    .map((t) => '<option value="' + t + '">' + t + "</option>")
      .join("");
  return [
    "",
    '  <section class="page-top">',
    '    <p class="kicker">Alat</p>',
    "    <h1>Bandingkan</h1>",
    '    <p class="lede">Bandingkan dua provinsi, atau dua tahun pada indikator nasional.</p>',
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Dua provinsi</h2>",
    '    <p class="tools">',
    '      <label>A: <select id="cmp-a">' + opsiDaerah + "</select></label>",
    '      <label>B: <select id="cmp-b">' + opsiDaerah + "</select></label>",
    "    </p>",
    '    <div id="cmp-out"></div>',
    "    " + barisSumber(DAERAH_SUMBER),
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Dua tahun: pertumbuhan ekonomi &amp; inflasi</h2>",
    '    <p class="tools">',
    '      <label>Tahun pertama: <select id="yr-a">' + opsiTahun + "</select></label>",
    '      <label>Tahun kedua: <select id="yr-b">' + opsiTahun + "</select></label>",
    "    </p>",
    '    <div id="yr-out"></div>',
    "    " + barisSumber("Badan Pusat Statistik (BPS)"),
    "  </section>",
  ].join("\n");
}

function tabelDaerah(namaA, namaB) {
  const da = DAERAH.find((d) => d[0] === namaA);
  const db = DAERAH.find((d) => d[0] === namaB);
  if (!da || !db) return "<p>Pilih dua provinsi.</p>";
  const terbesar = Math.max(...DAERAH.map((d) => d[2]));
  const batang = (d) => {
    const persen = (d[2] / terbesar) * 100;
    return '<div class="bar"><span class="bar-fill" style="width:' + persen.toFixed(1) + '%"></span></div>';
  };
  const besar = da[2] >= db[2] ? da : db;
  const kecil = da[2] >= db[2] ? db : da;
  const selisih =
    da[0] === db[0]
      ? "Provinsi yang sama."
      : amankan(besar[0]) + " lebih besar " + formatAngka(besar[2] - kecil[2]) + " juta jiwa (" + formatAngka((besar[2] / kecil[2] - 1) * 100, 0) + "% lebih besar).";
  return [
    '<div class="tbl-wrap"><table class="tbl">',
    "    <thead><tr><th></th><th>" + amankan(da[0]) + "</th><th>" + amankan(db[0]) + "</th></tr></thead>",
    "    <tbody>",
    "      <tr><td>Ibu kota</td><td>" + amankan(da[1]) + "</td><td>" + amankan(db[1]) + "</td></tr>",
    "      <tr><td>Penduduk 2024</td><td><strong>" + formatAngka(da[2]) + " juta</strong>" + batang(da) + "</td><td><strong>" + formatAngka(db[2]) + " juta</strong>" + batang(db) + "</td></tr>",
    "      <tr><td>Pangsa penduduk nasional</td><td>" + formatAngka((da[2] / 281.6) * 100, 1) + "%</td><td>" + formatAngka((db[2] / 281.6) * 100, 1) + "%</td></tr>",
    '      <tr><td>Selisih</td><td colspan="2">' + selisih + "</td></tr>",
    "    </tbody></table></div>",
  ].join("\n");
}

function tabelTahunBanding(tahunA, tahunB) {
  const tumbuhA = nilaiTahun(RENTANG.pertumbuhan, tahunA);
  const tumbuhB = nilaiTahun(RENTANG.pertumbuhan, tahunB);
  const inflA = nilaiTahun(RENTANG.inflasi, tahunA);
  const inflB = nilaiTahun(RENTANG.inflasi, tahunB);
  if (tumbuhA === null || tumbuhB === null) return "<p>Pilih dua tahun 2019–2024.</p>";
  const selPenduduk = (t) => {
    const v = nilaiTahun(RENTANG.populasi, t);
    return v === null ? "—" : formatAngka(v) + " jt";
  };
  const nilaiAwal = nilaiTahun(RENTANG.populasi, tahunA);
  const nilaiAkhir = nilaiTahun(RENTANG.populasi, tahunB);
  const bedaPenduduk = nilaiAwal === null || nilaiAkhir === null ? "—" : "+" + formatAngka(nilaiAkhir - nilaiAwal) + " jt";
  const beda = (x, y) => (y - x >= 0 ? "+" : "") + formatAngka(y - x) + " poin";
  return [
    '<div class="tbl-wrap"><table class="tbl">',
    "    <thead><tr><th>Indikator</th><th>" + tahunA + "</th><th>" + tahunB + "</th><th>Perubahan</th></tr></thead>",
    "    <tbody>",
    "      <tr><td>Pertumbuhan ekonomi</td><td>" + formatAngka(tumbuhA) + "%</td><td>" + formatAngka(tumbuhB) + "%</td><td>" + beda(tumbuhA, tumbuhB) + "</td></tr>",
    "      <tr><td>Inflasi</td><td>" + formatAngka(inflA) + "%</td><td>" + formatAngka(inflB) + "%</td><td>" + beda(inflA, inflB) + "</td></tr>",
    "      <tr><td>Jumlah penduduk</td><td>" + selPenduduk(tahunA) + "</td><td>" + selPenduduk(tahunB) + "</td><td>" + bedaPenduduk + "</td></tr>",
    "    </tbody></table></div>",
  ].join("\n");
}

function lukisBanding() {
  const pilihA = document.getElementById("cmp-a");
  const pilihB = document.getElementById("cmp-b");
  const keluar = document.getElementById("cmp-out");
  const segarkan = () => {
    keluar.innerHTML = tabelDaerah(pilihA.value, pilihB.value);
  };
  pilihA.value = DAERAH[0][0];
  pilihB.value = DAERAH[1][0];
  pilihA.addEventListener("change", segarkan);
  pilihB.addEventListener("change", segarkan);
  segarkan();
  const tahunAEl = document.getElementById("yr-a");
  const tahunBEl = document.getElementById("yr-b");
  const keluarTahun = document.getElementById("yr-out");
  const segarkanTahun = () => {
    keluarTahun.innerHTML = tabelTahunBanding(Number(tahunAEl.value), Number(tahunBEl.value));
  };
  const daftarTahun = tahunSeri(RENTANG.pertumbuhan);
  tahunAEl.value = String(daftarTahun[1]);
  tahunBEl.value = String(daftarTahun[daftarTahun.length - 1]);
  tahunAEl.addEventListener("change", segarkanTahun);
  tahunBEl.addEventListener("change", segarkanTahun);
  segarkanTahun();
}

// ================ Tabel Data ================
function halamanData() {
  const blok = Object.values(RENTANG)
    .map((seri) => '<details class="fold"><summary>' + amankan(seri.judul) + " (" + seri.tahun[0] + "–" + seri.tahun[seri.tahun.length - 1] + ")</summary>" + tabelTahun(seri) + barisSumber(seri.asal, seri.catatan) + "</details>")
      .join("");
  const barisSosial = SOSIAL
    .map((s) => "<tr><td>" + amankan(s[0]) + "</td><td><strong>" + amankan(s[1]) + "</strong></td><td>" + amankan(s[2]) + "</td><td>" + amankan(s[3]) + "</td></tr>")
      .join("");
  return [
    "",
    '  <section class="page-top">',
    '    <p class="kicker">Alat</p>',
    "    <h1>Tabel Data</h1>",
    '    <p class="lede">Semua seri waktu yang dipakai situs ini, lengkap dengan sumber. Unduh sebagai CSV untuk diolah sendiri.</p>',
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Unduh data</h2>",
    "    <p>Seluruh seri waktu nasional dalam satu berkas CSV (kolom: indikator, tahun, nilai, satuan, sumber).</p>",
    '    <button class="button" id="dl-csv" type="button">Unduh CSV</button>',
    '    <span id="dl-msg" role="status"></span>',
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Seri waktu nasional</h2>",
    "    " + blok,
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Sosial &amp; digital</h2>",
    '    <div class="tbl-wrap"><table class="tbl">',
    "      <thead><tr><th>Indikator</th><th>Nilai</th><th>Keterangan</th><th>Sumber</th></tr></thead>",
    "      <tbody>" + barisSosial + "</tbody>",
    "    </table></div>",
    "  </section>",
  ].join("\n");
}

function teksCsv() {
  const baris = ["indikator;tahun;nilai;satuan;sumber"];
  Object.values(RENTANG).forEach((seri) => {
    seri.tahun.forEach((tahun, i) => {
      baris.push('"' + seri.judul + '";' + tahun + ";" + String(seri.nilai[i]).replace(".", ",") + ';"' + seri.satuan + '";"' + seri.asal + '"');
    });
  });
  return baris.join("\n");
}

function lukisData() {
  const tombol = document.getElementById("dl-csv");
  const pesan = document.getElementById("dl-msg");
  if (!tombol) return;
  tombol.addEventListener("click", () => {
    const blob = new Blob([teksCsv()], { type: "text/csv;charset=utf-8" });
    const alamatBlob = URL.createObjectURL(blob);
    const tautan = document.createElement("a");
    tautan.href = alamatBlob;
    tautan.download = "datanusa-seri-nasional.csv";
    document.body.appendChild(tautan);
    tautan.click();
    tautan.remove();
    setTimeout(() => URL.revokeObjectURL(alamatBlob), 1000);
    pesan.textContent = "CSV diunduh.";
  });
}

// ================ Sumber ================
function halamanSumber() {
  return [
    "",
    '  <section class="page-top">',
    '    <p class="kicker">Tentang</p>',
    "    <h1>Sumber &amp; Metodologi</h1>",
    '    <p class="lede">Dari mana angka-angka di situs ini berasal, dan bagaimana membacanya.</p>',
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Sumber data</h2>",
    '    <div class="tbl-wrap"><table class="tbl">',
    "      <thead><tr><th>Sumber</th><th>Yang dipakai</th></tr></thead>",
    "      <tbody>",
    "        <tr><td><strong>Badan Pusat Statistik (BPS)</strong></td><td>Pertumbuhan ekonomi, inflasi, penduduk, pengangguran, kemiskinan, gini, IPM, ekspor-impor, upah, garis kemiskinan, struktur umur, penduduk provinsi.</td></tr>",
    "        <tr><td><strong>Bank Indonesia</strong></td><td>BI-Rate, cadangan devisa, kurs rata-rata.</td></tr>",
    "        <tr><td><strong>Kementerian Keuangan</strong></td><td>Realisasi APBN 2024: pendapatan, belanja, defisit.</td></tr>",
    "        <tr><td><strong>APJII</strong></td><td>Survei penetrasi internet 2024.</td></tr>",
    "      </tbody>",
    "    </table></div>",
    "    <p>Semua angka adalah angka resmi yang dipublikasikan lembaga tersebut; situs ini tidak menghitung ulang angka mentah kecuali penjumlahan dan pangsa yang ditandai sebagai hitungan situs.</p>",
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Catatan metodologi</h2>",
    '    <ul class="points">',
    "      <li><strong>Tahun acuan</strong> ditulis pada setiap angka. Seri waktu memakai tahun kalender, kecuali TPT (survei Agustus/Februari) dan kemiskinan (Maret/September).</li>",
    "      <li><strong>Pembulatan:</strong> nilai ditampilkan dengan pembulatan publikasi aslinya; pangsa provinsi dihitung situs dari angka BPS.</li>",
    "      <li><strong>Struktur umur 2024</strong> memakai kelompok 10 tahun yang dibulatkan dari publikasi BPS; jumlah kelompok sama dengan total penduduk 281,6 juta.</li>",
    "      <li><strong>Data ini statis</strong> (per November 2026). Untuk angka terbaru, kunjungi publikasi resmi masing-masing lembaga.</li>",
    "    </ul>",
    "  </section>",
    "",
    '  <section class="panel">',
    "    <h2>Tentang DataNusa</h2>",
    "    <p>DataNusa adalah situs peraga statistik nasional Indonesia yang dibuat untuk kompetisi make.fun",
    "    “Make the best national statistics site”. Desain, teks, dan grafiknya asli; angka-angkanya berasal",
    "    dari publikasi resmi dan dicantumkan sumbernya di setiap halaman. Situs ini berjalan sepenuhnya",
    "    dari berkasnya sendiri, tanpa memuat apa pun dari internet.</p>",
    '    <p><a href="#/">Kembali ke Beranda →</a></p>',
    "  </section>",
  ].join("\n");
}

// ================ Router ================
const RUTE = {
  "#/": [halamanBeranda, lukisBeranda],
  "#/ekonomi": [halamanEkonomi, lukisEkonomi],
  "#/penduduk": [halamanPenduduk, lukisPenduduk],
  "#/tenaga-kerja": [halamanKerja, lukisKerja],
  "#/kemiskinan": [halamanMiskin, lukisMiskin],
  "#/bandingkan": [halamanBanding, lukisBanding],
  "#/data": [halamanData, lukisData],
  "#/sumber": [halamanSumber, () => {}],
};

export function ruteAktif() {
  const pecahan = location.hash || "#/";
  return RUTE[pecahan] ? pecahan : "#/";
}

export function tampilkan() {
  const rute = ruteAktif();
  const [bangun, lukis] = RUTE[rute];
  document.getElementById("view").innerHTML = bangun();
  window.__gambarUlang = {};
  lukis();
  document.querySelectorAll("#main-nav a").forEach((tautan) => {
    const aktif = tautan.getAttribute("href") === rute;
    tautan.classList.toggle("active", aktif);
    if (aktif) tautan.setAttribute("aria-current", "page");
    else tautan.removeAttribute("aria-current");
  });
  scrollTo(0, 0);
}

export function tautanNav() {
  return NAVIGASI.map(([jalur, label]) => '<a href="' + jalur + '">' + amankan(label) + "</a>").join("");
}
