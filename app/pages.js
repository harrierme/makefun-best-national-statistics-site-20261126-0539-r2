// DataNusa — halaman situs + router hash.
// Satu index.html, delapan halaman lewat hash (#/ekonomi, #/penduduk, ...).
// Tiap halaman dibangun dari data.js; grafik digambar ulang oleh charts.js.

import {
  HEADLINE, SERIES, SECTORS, AGE_GROUPS, PROVINCES, PROVINCES_SOURCE,
  JOBS, MONEY, SOCIAL, META, yearsOf, valuesOf, valueIn, idNumber,
} from "./data.js";
import { lineChart, barChart, donutChart, ageChart, sparkline } from "./charts.js";

export const NAV = [
  { path: "#/", label: "Beranda" },
  { path: "#/ekonomi", label: "Ekonomi" },
  { path: "#/penduduk", label: "Penduduk" },
  { path: "#/tenaga-kerja", label: "Tenaga Kerja" },
  { path: "#/kemiskinan", label: "Kemiskinan" },
  { path: "#/bandingkan", label: "Bandingkan" },
  { path: "#/data", label: "Tabel Data" },
  { path: "#/sumber", label: "Sumber" },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function originLine(origin, extra = "") {
  return `<p class="origin">Sumber: ${esc(origin)}${extra ? " — " + esc(extra) : ""}</p>`;
}

// Kartu angka utama, lengkap dengan sparkline tren serinya.
function statCard(item, index) {
  const series = SERIES[item.spark];
  return `<article class="stat">
    <p class="stat-name">${esc(item.name)}</p>
    <p class="stat-figure">${esc(item.figure)}</p>
    <p class="stat-detail">${esc(item.detail)}</p>
    <canvas class="spark" id="spark-${index}" aria-hidden="true"></canvas>
    <p class="stat-change">${esc(item.change)}</p>
    <p class="stat-origin">Sumber: ${esc(item.origin)}</p>
    <span class="sr-only">Tren: ${series ? esc(series.heading) : ""}</span>
  </article>`;
}

// Kartu pembungkus grafik: judul + kanvas + sumber.
function graphCard(id, heading, origin, remark = "") {
  return `<section class="panel graph">
    <h3>${esc(heading)}</h3>
    <canvas id="${id}" role="img" aria-label="Grafik ${esc(heading)}"></canvas>
    ${originLine(origin, remark)}
  </section>`;
}

function yearTable(series) {
  const rows = series.points
    .map(([y, v]) => `<tr><td>${y}</td><td>${idNumber(v, series.unit === "rasio" ? 3 : 2)}</td></tr>`)
    .join("");
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tahun</th><th>${esc(series.heading)}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

// Daftarkan grafik halaman ini supaya digambar sekarang + saat resize.
function paint(jobs) {
  window.__redraw = window.__redraw || {};
  for (const [id, draw] of Object.entries(jobs)) {
    const el = document.getElementById(id);
    if (!el) continue;
    window.__redraw[id] = () => draw(el);
    draw(el);
  }
}

window.addEventListener("resize", () => {
  if (!window.__redraw) return;
  for (const draw of Object.values(window.__redraw)) draw();
});

// ---------------- Beranda ----------------
function pageHome() {
  const cards = HEADLINE.map(statCard).join("");
  return `
  <section class="hero">
    <div class="hero-main">
    <p class="kicker">Portal statistik resmi · Indonesia</p>
    <h1>Indonesia dalam angka</h1>
    <p class="lede">Penduduk, ekonomi, pekerjaan, dan kesejahteraan Indonesia — dirangkum dari
    publikasi resmi BPS, Bank Indonesia, dan Kementerian Keuangan, diperbarui ${esc(META.refreshed)}.</p>
    <div class="hero-actions">
      <a class="button" href="#/ekonomi">Lihat ekonomi →</a>
      <a class="button outline" href="#/penduduk">Jelajahi provinsi →</a>
    </div>
    </div>
    <aside class="hero-side" aria-label="Angka kunci 2024">
      <p class="hero-side-title">Sekilas 2024</p>
      <dl>
        <div><dt>Penduduk</dt><dd>281,6 jt</dd></div>
        <div><dt>PDB</dt><dd>Rp22.139 T</dd></div>
        <div><dt>Pertumbuhan</dt><dd>5,03%</dd></div>
        <div><dt>Kemiskinan</dt><dd>8,47%</dd></div>
      </dl>
    </aside>
  </section>

  <section class="stat-grid">${cards}</section>

  <div class="cols-2">
    ${graphCard("home-growth", SERIES.pertumbuhan.heading, SERIES.pertumbuhan.origin, SERIES.pertumbuhan.remark)}
    ${graphCard("home-inflasi", SERIES.inflasi.heading, SERIES.inflasi.origin, SERIES.inflasi.remark)}
  </div>

  <section class="panel">
    <h2>Sekilas 2024</h2>
    <ul class="points">
      <li><strong>281,6 juta</strong> penduduk — negara keempat terbanyak di dunia, dengan 68,8% penduduk berusia produktif (15–64 tahun).</li>
      <li><strong>PDB Rp22.139 triliun</strong> dengan pertumbuhan 5,03%; lapangan usaha terbesar adalah industri pengolahan (18,67% PDB).</li>
      <li><strong>Ekspor US$264,7 miliar</strong> dan surplus perdagangan US$31,0 miliar; cadangan devisa US$155,7 miliar.</li>
      <li><strong>Kemiskinan 8,47%</strong> (Maret 2025) — terendah dalam sejarah pencatatan BPS; gini 0,375.</li>
      <li><strong>IPM 75,02</strong> (2024), naik dari 74,39 pada 2023; harapan hidup 74,15 tahun.</li>
    </ul>
    ${originLine("Badan Pusat Statistik (BPS), Bank Indonesia, Kementerian Keuangan", "angka per 2024 kecuali dinyatakan lain")}
  </section>

  <section class="panel">
    <h2>Provinsi berpenduduk terbesar</h2>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>#</th><th>Provinsi</th><th>Ibu kota</th><th>Penduduk 2024 (juta)</th><th>Pangsa</th></tr></thead>
      <tbody>
        ${PROVINCES.slice(0, 5).map((p, i) => `<tr><td>${i + 1}</td><td><a href="#/penduduk">${esc(p.province)}</a></td><td>${esc(p.city)}</td><td>${idNumber(p.millions)}</td><td>${idNumber((p.millions / 281.6) * 100, 1)}%</td></tr>`).join("")}
      </tbody>
    </table></div>
    <p><a href="#/penduduk">Lihat semua 15 provinsi terbesar →</a></p>
    ${originLine(PROVINCES_SOURCE)}
  </section>`;
}

function paintHome() {
  paint({
    "home-growth": (el) => lineChart(el, SERIES.pertumbuhan, { height: 250 }),
    "home-inflasi": (el) => barChart(el, SERIES.inflasi, { height: 250 }),
  });
  HEADLINE.forEach((item, i) => {
    const el = document.getElementById(`spark-${i}`);
    if (!el || !SERIES[item.spark]) return;
    sparkline(el, valuesOf(SERIES[item.spark]));
  });
}

// ---------------- Ekonomi ----------------
function pageEconomy() {
  const sectorRows = SECTORS.rows
    .map((r) => `<tr><td>${esc(r.sector)}</td><td>${idNumber(r.pct)}%</td></tr>`)
    .join("");
  const moneyRows = MONEY.map((m) => `<tr><td>${esc(m.item)}</td><td><strong>${esc(m.figure)}</strong></td><td>${esc(m.detail)}</td><td>${esc(m.origin)}</td></tr>`).join("");
  return `
  <section class="page-top">
    <p class="kicker">Topik</p>
    <h1>Ekonomi</h1>
    <p class="lede">Pertumbuhan, harga, perdagangan, dan keuangan negara Indonesia.</p>
  </section>

  <div class="cols-2">
    ${graphCard("eco-growth", SERIES.pertumbuhan.heading, SERIES.pertumbuhan.origin, SERIES.pertumbuhan.remark)}
    ${graphCard("eco-inflasi", SERIES.inflasi.heading, SERIES.inflasi.origin, SERIES.inflasi.remark)}
  </div>

  <div class="cols-2">
    ${graphCard("eco-ekspor", SERIES.ekspor.heading, SERIES.ekspor.origin, SERIES.ekspor.remark)}
    <section class="panel">
      <h3>${esc(SECTORS.heading)}</h3>
      <canvas id="eco-sektor" role="img" aria-label="Donat pangsa PDB menurut lapangan usaha"></canvas>
      ${originLine(SECTORS.origin, SECTORS.remark)}
    </section>
  </div>

  <section class="panel">
    <h2>Keuangan negara &amp; moneter</h2>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Indikator</th><th>Nilai</th><th>Keterangan</th><th>Sumber</th></tr></thead>
      <tbody>${moneyRows}</tbody>
    </table></div>
  </section>

  <section class="panel">
    <h2>Apa yang dibaca dari angka ini?</h2>
    <ul class="points">
      <li><strong>Pertumbuhan 5,03%</strong> pada 2024 ditopang konsumsi rumah tangga dan investasi; kontraksi 2020 (-2,07%) adalah satu-satunya tahun negatif dalam enam tahun terakhir.</li>
      <li><strong>Inflasi 1,57%</strong> pada 2024 adalah yang terendah sejak 2020 dan berada dalam sasaran Bank Indonesia (2,5% ±1%).</li>
      <li><strong>Ekspor 2024 (US$264,7 M)</strong> turun dari rekor 2022 (US$291,9 M) seiring normalisasi harga komoditas, tetapi neraca dagang tetap surplus 56 bulan beruntun hingga akhir 2024.</li>
    </ul>
  </section>`;
}

function paintEconomy() {
  paint({
    "eco-growth": (el) => lineChart(el, SERIES.pertumbuhan, { height: 250 }),
    "eco-inflasi": (el) => barChart(el, SERIES.inflasi, { height: 250 }),
    "eco-ekspor": (el) => barChart(el, SERIES.ekspor, { height: 250, color: "#3d5a80" }),
    "eco-sektor": (el) => donutChart(el, SECTORS.rows, { height: 250, center: "62,2%", centerNote: "dari PDB" }),
  });
}

// ---------------- Penduduk ----------------
function pagePopulation() {
  const rows = PROVINCES.map((p, i) => `<tr data-name="${esc(p.province.toLowerCase())}">
    <td>${i + 1}</td><td>${esc(p.province)}</td><td>${esc(p.city)}</td>
    <td>${idNumber(p.millions)}</td><td>${idNumber((p.millions / 281.6) * 100, 1)}%</td></tr>`).join("");
  return `
  <section class="page-top">
    <p class="kicker">Topik</p>
    <h1>Penduduk &amp; Wilayah</h1>
    <p class="lede">281,6 juta jiwa pada 2024 — tersebar di 38 provinsi, dengan 56% tinggal di Pulau Jawa.</p>
  </section>

  <div class="cols-2">
    ${graphCard("pop-total", SERIES.populasi.heading, SERIES.populasi.origin, SERIES.populasi.remark)}
    <section class="panel">
      <h3>${esc(AGE_GROUPS.heading)}</h3>
      <canvas id="pop-age" role="img" aria-label="Struktur umur penduduk 2024"></canvas>
      ${originLine(AGE_GROUPS.origin, AGE_GROUPS.remark)}
    </section>
  </div>

  <section class="panel">
    <h2>Provinsi berpenduduk terbesar, 2024</h2>
    <p class="tools"><label>Cari provinsi: <input id="prov-q" type="search" placeholder="mis. Jawa Barat" aria-label="Cari provinsi"></label>
    <span id="prov-count">${PROVINCES.length} provinsi ditampilkan</span></p>
    <div class="tbl-wrap"><table class="tbl" id="prov-tbl">
      <thead><tr><th><button class="sort-btn" data-key="rank">#</button></th>
      <th><button class="sort-btn" data-key="name">Provinsi</button></th><th>Ibu kota</th>
      <th><button class="sort-btn" data-key="pop">Penduduk 2024 (juta)</button></th><th>Pangsa</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${originLine(PROVINCES_SOURCE)}
  </section>`;
}

function paintPopulation() {
  paint({
    "pop-total": (el) => lineChart(el, SERIES.populasi, { height: 250, color: "#20706a" }),
    "pop-age": (el) => ageChart(el, AGE_GROUPS.bands, { height: 260 }),
  });
  const q = document.getElementById("prov-q");
  const count = document.getElementById("prov-count");
  const tbody = document.querySelector("#prov-tbl tbody");
  if (q && tbody) {
    q.addEventListener("input", () => {
      const needle = q.value.trim().toLowerCase();
      let shown = 0;
      tbody.querySelectorAll("tr").forEach((tr) => {
        const hit = tr.dataset.name.includes(needle);
        tr.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      count.textContent = `${shown} provinsi ditampilkan`;
    });
  }
  document.querySelectorAll("#prov-tbl .sort-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const rows = [...tbody.querySelectorAll("tr")];
      const asc = btn.dataset.asc !== "1";
      btn.dataset.asc = asc ? "1" : "0";
      const num = (tr) => parseFloat(tr.cells[3].textContent.replace(".", "").replace(",", "."));
      rows.sort((a, b) => {
        if (key === "name") return asc ? a.cells[1].textContent.localeCompare(b.cells[1].textContent, "id") : b.cells[1].textContent.localeCompare(a.cells[1].textContent, "id");
        if (key === "pop") return asc ? num(a) - num(b) : num(b) - num(a);
        return asc ? Number(a.cells[0].textContent) - Number(b.cells[0].textContent) : Number(b.cells[0].textContent) - Number(a.cells[0].textContent);
      });
      rows.forEach((r) => tbody.appendChild(r));
    });
  });
}

// ---------------- Tenaga Kerja ----------------
function pageJobs() {
  const cards = [
    { name: "Angkatan kerja", figure: JOBS.workforce.figure, detail: JOBS.workforce.detail, origin: JOBS.workforce.origin },
    { name: "Penduduk bekerja", figure: JOBS.employed.figure, detail: JOBS.employed.detail, origin: JOBS.employed.origin },
    { name: "TPT perkotaan", figure: JOBS.urban.figure, detail: JOBS.urban.detail, origin: JOBS.urban.origin },
    { name: "TPT perdesaan", figure: JOBS.rural.figure, detail: JOBS.rural.detail, origin: JOBS.rural.origin },
    { name: "Rata-rata upah buruh", figure: JOBS.wage.figure, detail: JOBS.wage.detail, origin: JOBS.wage.origin },
  ];
  return `
  <section class="page-top">
    <p class="kicker">Topik</p>
    <h1>Tenaga Kerja</h1>
    <p class="lede">153,05 juta orang angkatan kerja pada Februari 2025; 145,77 juta di antaranya bekerja.</p>
  </section>

  <section class="stat-grid">${cards.map((c) => `<article class="stat"><p class="stat-name">${esc(c.name)}</p><p class="stat-figure">${esc(c.figure)}</p><p class="stat-detail">${esc(c.detail)}</p><p class="stat-origin">Sumber: ${esc(c.origin)}</p></article>`).join("")}</section>

  <div class="cols-2">
    ${graphCard("jobs-tpt", SERIES.pengangguran.heading, SERIES.pengangguran.origin, SERIES.pengangguran.remark)}
    <section class="panel">
      <h3>Tingkat pengangguran terbuka, Agustus</h3>
      ${yearTable(SERIES.pengangguran)}
      ${originLine(SERIES.pengangguran.origin, "Februari 2025: 4,76%.")}
    </section>
  </div>

  <section class="panel">
    <h2>Membaca angka pengangguran</h2>
    <ul class="points">
      <li><strong>TPT turun dalam lima pembacaan survei beruntun</strong> dari puncak pandemi 7,07% (Agustus 2020) menjadi 4,91% (Agustus 2024) dan 4,76% (Februari 2025).</li>
      <li><strong>Pengangguran perkotaan (5,73%) lebih tinggi</strong> daripada perdesaan (3,61%) pada Februari 2025 — pola yang konsisten setiap tahun.</li>
      <li><strong>Upah rata-rata buruh Rp3,09 juta/bulan</strong> (Agustus 2024), naik dari Rp2,87 juta pada Agustus 2023.</li>
    </ul>
  </section>`;
}

function paintJobs() {
  paint({
    "jobs-tpt": (el) => lineChart(el, SERIES.pengangguran, { height: 250, color: "#c2492f" }),
  });
}

// ---------------- Kemiskinan ----------------
function pagePoverty() {
  return `
  <section class="page-top">
    <p class="kicker">Topik</p>
    <h1>Kemiskinan &amp; Ketimpangan</h1>
    <p class="lede">8,47% penduduk miskin pada Maret 2025 — 24,06 juta jiwa, terendah sepanjang sejarah pencatatan.</p>
  </section>

  <div class="cols-2">
    ${graphCard("poor-rate", SERIES.kemiskinan.heading, SERIES.kemiskinan.origin, SERIES.kemiskinan.remark)}
    ${graphCard("poor-gini", SERIES.gini.heading, SERIES.gini.origin, SERIES.gini.remark)}
  </div>

  <section class="panel">
    <h2>Angka kunci</h2>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Indikator</th><th>Nilai</th><th>Keterangan</th></tr></thead>
      <tbody>
        <tr><td>Penduduk miskin</td><td><strong>24,06 juta jiwa</strong></td><td>Maret 2025</td></tr>
        <tr><td>Garis kemiskinan</td><td><strong>Rp609.160</strong></td><td>Per kapita per bulan, Maret 2025</td></tr>
        <tr><td>Kemiskinan perkotaan</td><td><strong>7,26%</strong></td><td>Maret 2025</td></tr>
        <tr><td>Kemiskinan perdesaan</td><td><strong>11,03%</strong></td><td>Maret 2025</td></tr>
        <tr><td>Rasio gini</td><td><strong>0,375</strong></td><td>Maret 2025</td></tr>
      </tbody>
    </table></div>
    ${originLine("Badan Pusat Statistik (BPS)", "Profil Kemiskinan di Indonesia, Maret 2025")}
  </section>

  <section class="panel">
    <h2>Membaca angka kemiskinan</h2>
    <ul class="points">
      <li><strong>Kemiskinan turun dari 10,14% (Maret 2021)</strong> menjadi 8,47% (Maret 2025) seiring pulihnya ekonomi pascapandemi.</li>
      <li><strong>Jurang kota–desa tetap lebar:</strong> kemiskinan perdesaan 11,03% berbanding 7,26% di perkotaan pada Maret 2025.</li>
      <li><strong>Gini 0,375</strong> menunjukkan ketimpangan pengeluaran yang relatif stabil dalam lima tahun terakhir (0,375–0,384).</li>
    </ul>
  </section>`;
}

function paintPoverty() {
  paint({
    "poor-rate": (el) => lineChart(el, SERIES.kemiskinan, { height: 250, color: "#20706a" }),
    "poor-gini": (el) => lineChart(el, SERIES.gini, { height: 250, color: "#3d5a80" }),
  });
}

// ---------------- Bandingkan ----------------
function pageCompare() {
  const provOpts = PROVINCES.map((p) => `<option value="${esc(p.province)}">${esc(p.province)}</option>`).join("");
  const yearOpts = yearsOf(SERIES.pertumbuhan).map((y) => `<option value="${y}">${y}</option>`).join("");
  return `
  <section class="page-top">
    <p class="kicker">Alat</p>
    <h1>Bandingkan</h1>
    <p class="lede">Bandingkan dua provinsi, atau dua tahun pada indikator nasional.</p>
  </section>

  <section class="panel">
    <h2>Dua provinsi</h2>
    <p class="tools">
      <label>A: <select id="cmp-a">${provOpts}</select></label>
      <label>B: <select id="cmp-b">${provOpts}</select></label>
    </p>
    <div id="cmp-out"></div>
    ${originLine(PROVINCES_SOURCE)}
  </section>

  <section class="panel">
    <h2>Dua tahun: pertumbuhan ekonomi &amp; inflasi</h2>
    <p class="tools">
      <label>Tahun pertama: <select id="yr-a">${yearOpts}</select></label>
      <label>Tahun kedua: <select id="yr-b">${yearOpts}</select></label>
    </p>
    <div id="yr-out"></div>
    ${originLine("Badan Pusat Statistik (BPS)")}
  </section>`;
}

function provinceTable(a, b) {
  const pa = PROVINCES.find((p) => p.province === a);
  const pb = PROVINCES.find((p) => p.province === b);
  if (!pa || !pb) return "<p>Pilih dua provinsi.</p>";
  const bar = (p) => {
    const pct = (p.millions / Math.max(...PROVINCES.map((q) => q.millions))) * 100;
    return `<div class="bar"><span class="bar-fill" style="width:${pct.toFixed(1)}%"></span></div>`;
  };
  const bigger = pa.millions >= pb.millions ? pa : pb;
  const smaller = pa.millions >= pb.millions ? pb : pa;
  return `<div class="tbl-wrap"><table class="tbl">
    <thead><tr><th></th><th>${esc(pa.province)}</th><th>${esc(pb.province)}</th></tr></thead>
    <tbody>
      <tr><td>Ibu kota</td><td>${esc(pa.city)}</td><td>${esc(pb.city)}</td></tr>
      <tr><td>Penduduk 2024</td><td><strong>${idNumber(pa.millions)} juta</strong>${bar(pa)}</td><td><strong>${idNumber(pb.millions)} juta</strong>${bar(pb)}</td></tr>
      <tr><td>Pangsa penduduk nasional</td><td>${idNumber((pa.millions / 281.6) * 100, 1)}%</td><td>${idNumber((pb.millions / 281.6) * 100, 1)}%</td></tr>
      <tr><td>Selisih</td><td colspan="2">${pa.province === pb.province ? "Provinsi yang sama." : `${esc(bigger.province)} lebih besar ${idNumber(bigger.millions - smaller.millions)} juta jiwa (${idNumber((bigger.millions / smaller.millions - 1) * 100, 0)}% lebih besar).`}</td></tr>
    </tbody></table></div>`;
}

function yearTableCompare(ya, yb) {
  const g1 = valueIn(SERIES.pertumbuhan, ya);
  const g2 = valueIn(SERIES.pertumbuhan, yb);
  const i1 = valueIn(SERIES.inflasi, ya);
  const i2 = valueIn(SERIES.inflasi, yb);
  if (g1 === null || g2 === null) return "<p>Pilih dua tahun 2019–2024.</p>";
  const popCell = (y) => {
    const v = valueIn(SERIES.populasi, y);
    return v === null ? "—" : idNumber(v) + " jt";
  };
  const popDiff = (() => {
    const va = valueIn(SERIES.populasi, ya);
    const vb = valueIn(SERIES.populasi, yb);
    if (va === null || vb === null) return "—";
    return "+" + idNumber(vb - va) + " jt";
  })();
  const delta = (x, y) => (y - x >= 0 ? "+" : "") + idNumber(y - x) + " poin";
  return `<div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>Indikator</th><th>${ya}</th><th>${yb}</th><th>Perubahan</th></tr></thead>
    <tbody>
      <tr><td>Pertumbuhan ekonomi</td><td>${idNumber(g1)}%</td><td>${idNumber(g2)}%</td><td>${delta(g1, g2)}</td></tr>
      <tr><td>Inflasi</td><td>${idNumber(i1)}%</td><td>${idNumber(i2)}%</td><td>${delta(i1, i2)}</td></tr>
      <tr><td>Jumlah penduduk</td><td>${popCell(ya)}</td><td>${popCell(yb)}</td><td>${popDiff}</td></tr>
    </tbody></table></div>`;
}

function paintCompare() {
  const a = document.getElementById("cmp-a");
  const b = document.getElementById("cmp-b");
  const out = document.getElementById("cmp-out");
  const refresh = () => { out.innerHTML = provinceTable(a.value, b.value); };
  a.value = "Jawa Barat";
  b.value = "Jawa Timur";
  a.addEventListener("change", refresh);
  b.addEventListener("change", refresh);
  refresh();
  const ya = document.getElementById("yr-a");
  const yb = document.getElementById("yr-b");
  const yout = document.getElementById("yr-out");
  const yrefresh = () => { yout.innerHTML = yearTableCompare(Number(ya.value), Number(yb.value)); };
  ya.value = "2020";
  yb.value = "2024";
  ya.addEventListener("change", yrefresh);
  yb.addEventListener("change", yrefresh);
  yrefresh();
}

// ---------------- Tabel Data ----------------
function pageData() {
  const blocks = Object.values(SERIES)
    .map((s) => `<details class="fold"><summary>${esc(s.heading)} (${s.points[0][0]}–${s.points[s.points.length - 1][0]})</summary>${yearTable(s)}${originLine(s.origin, s.remark)}</details>`)
    .join("");
  return `
  <section class="page-top">
    <p class="kicker">Alat</p>
    <h1>Tabel Data</h1>
    <p class="lede">Semua seri waktu yang dipakai situs ini, lengkap dengan sumber. Unduh sebagai CSV untuk diolah sendiri.</p>
  </section>

  <section class="panel">
    <h2>Unduh data</h2>
    <p>Seluruh seri waktu nasional dalam satu berkas CSV (kolom: indikator, tahun, nilai, satuan, sumber).</p>
    <button class="button" id="dl-csv" type="button">Unduh CSV</button>
    <span id="dl-msg" role="status"></span>
  </section>

  <section class="panel">
    <h2>Seri waktu nasional</h2>
    ${blocks}
  </section>

  <section class="panel">
    <h2>Sosial &amp; digital</h2>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Indikator</th><th>Nilai</th><th>Keterangan</th><th>Sumber</th></tr></thead>
      <tbody>${SOCIAL.map((s) => `<tr><td>${esc(s.item)}</td><td><strong>${esc(s.figure)}</strong></td><td>${esc(s.detail)}</td><td>${esc(s.origin)}</td></tr>`).join("")}</tbody>
    </table></div>
  </section>`;
}

function csvText() {
  const lines = ["indikator;tahun;nilai;satuan;sumber"];
  for (const s of Object.values(SERIES)) {
    for (const [y, v] of s.points) {
      lines.push(`"${s.heading}";${y};${String(v).replace(".", ",")};"${s.unit}";"${s.origin}"`);
    }
  }
  return lines.join("\n");
}

function paintData() {
  const btn = document.getElementById("dl-csv");
  const msg = document.getElementById("dl-msg");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const blob = new Blob([csvText()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "datanusa-seri-nasional.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    msg.textContent = "CSV diunduh.";
  });
}

// ---------------- Sumber ----------------
function pageSources() {
  return `
  <section class="page-top">
    <p class="kicker">Tentang</p>
    <h1>Sumber &amp; Metodologi</h1>
    <p class="lede">Dari mana angka-angka di situs ini berasal, dan bagaimana membacanya.</p>
  </section>

  <section class="panel">
    <h2>Sumber data</h2>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Sumber</th><th>Yang dipakai</th></tr></thead>
      <tbody>
        <tr><td><strong>Badan Pusat Statistik (BPS)</strong></td><td>Pertumbuhan ekonomi, inflasi, penduduk, pengangguran, kemiskinan, gini, IPM, ekspor-impor, upah, garis kemiskinan, struktur umur, penduduk provinsi.</td></tr>
        <tr><td><strong>Bank Indonesia</strong></td><td>BI-Rate, cadangan devisa, kurs rata-rata.</td></tr>
        <tr><td><strong>Kementerian Keuangan</strong></td><td>Realisasi APBN 2024: pendapatan, belanja, defisit.</td></tr>
        <tr><td><strong>APJII</strong></td><td>Survei penetrasi internet 2024.</td></tr>
      </tbody>
    </table></div>
    <p>Semua angka adalah angka resmi yang dipublikasikan lembaga tersebut; situs ini tidak menghitung ulang angka mentah kecuali penjumlahan dan pangsa yang ditandai sebagai hitungan situs.</p>
  </section>

  <section class="panel">
    <h2>Catatan metodologi</h2>
    <ul class="points">
      <li><strong>Tahun acuan</strong> ditulis pada setiap angka. Seri waktu memakai tahun kalender, kecuali TPT (survei Agustus/Februari) dan kemiskinan (Maret/September).</li>
      <li><strong>Pembulatan:</strong> nilai ditampilkan dengan pembulatan publikasi aslinya; pangsa provinsi dihitung situs dari angka BPS.</li>
      <li><strong>Struktur umur 2024</strong> memakai kelompok 10 tahun yang dibulatkan dari publikasi BPS; jumlah kelompok sama dengan total penduduk 281,6 juta.</li>
      <li><strong>Data ini statis</strong> (per November 2026). Untuk angka terbaru, kunjungi publikasi resmi masing-masing lembaga.</li>
    </ul>
  </section>

  <section class="panel">
    <h2>Tentang DataNusa</h2>
    <p>DataNusa adalah situs peraga statistik nasional Indonesia yang dibuat untuk kompetisi make.fun
    “Make the best national statistics site”. Desain, teks, dan grafiknya asli; angka-angkanya berasal
    dari publikasi resmi dan dicantumkan sumbernya di setiap halaman. Situs ini berjalan sepenuhnya
    dari berkasnya sendiri, tanpa memuat apa pun dari internet.</p>
    <p><a href="#/">Kembali ke Beranda →</a></p>
  </section>`;
}

// ---------------- Router ----------------
const PAGES = {
  "#/": [pageHome, paintHome],
  "#/ekonomi": [pageEconomy, paintEconomy],
  "#/penduduk": [pagePopulation, paintPopulation],
  "#/tenaga-kerja": [pageJobs, paintJobs],
  "#/kemiskinan": [pagePoverty, paintPoverty],
  "#/bandingkan": [pageCompare, paintCompare],
  "#/data": [pageData, paintData],
  "#/sumber": [pageSources, () => {}],
};

export function currentRoute() {
  const hash = location.hash || "#/";
  return PAGES[hash] ? hash : "#/";
}

export function render() {
  const route = currentRoute();
  const [build, paintFn] = PAGES[route];
  document.getElementById("view").innerHTML = build();
  window.__redraw = {};
  paintFn();
  document.querySelectorAll("#main-nav a").forEach((a) => {
    const on = a.getAttribute("href") === route;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}

export function navHtml() {
  return NAV.map((r) => `<a href="${r.path}">${esc(r.label)}</a>`).join("");
}
