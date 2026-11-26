// DataNusa — angka resmi Indonesia.
//
// Seluruh angka di bawah ini diambil dari publikasi resmi Badan Pusat
// Statistik (BPS), Bank Indonesia (BI), Kementerian Keuangan, dan APJII.
// Tiap seri mencatat lembaga sumber dan tahun acuannya; tidak ada angka
// yang dibuat-buat. Seri waktu ditulis sebagai pasangan [tahun, nilai]
// supaya mudah diolah jadi grafik, tabel, maupun CSV.

export const META = {
  country: "Indonesia",
  refreshed: "November 2026",
  currency: "Rp",
};

export const ORIGIN = {
  bps: "Badan Pusat Statistik (BPS)",
  bi: "Bank Indonesia (BI)",
  kemenkeu: "Kementerian Keuangan RI",
  apjii: "APJII — Survei Penetrasi Internet",
};

// ---- Kartu angka utama: angka terbaru yang tersedia per indikator ----
export const HEADLINE = [
  { key: "populasi", name: "Penduduk", figure: "281,6 jt", detail: "2024, proyeksi pertengahan tahun", change: "+0,96% dari 2023", origin: ORIGIN.bps, spark: "populasi" },
  { key: "pdb", name: "PDB", figure: "Rp22.139 T", detail: "2024, harga berlaku", change: "Rp78,62 jt per kapita", origin: ORIGIN.bps, spark: "ekspor" },
  { key: "tumbuh", name: "Pertumbuhan ekonomi", figure: "5,03%", detail: "2024 (y-on-y)", change: "2023: 5,05%", origin: ORIGIN.bps, spark: "pertumbuhan" },
  { key: "inflasi", name: "Inflasi", figure: "1,57%", detail: "2024 (y-on-y, Desember)", change: "2023: 2,61%", origin: ORIGIN.bps, spark: "inflasi" },
  { key: "tpt", name: "Pengangguran (TPT)", figure: "4,76%", detail: "Februari 2025", change: "Agustus 2024: 4,91%", origin: ORIGIN.bps, spark: "pengangguran" },
  { key: "miskin", name: "Penduduk miskin", figure: "8,47%", detail: "Maret 2025", change: "24,06 juta jiwa", origin: ORIGIN.bps, spark: "kemiskinan" },
  { key: "ipm", name: "Indeks Pembangunan Manusia", figure: "75,02", detail: "2024", change: "2023: 74,39", origin: ORIGIN.bps, spark: "ipm" },
  { key: "ekspor", name: "Ekspor", figure: "US$264,7 M", detail: "2024", change: "Surplus US$31,0 M", origin: ORIGIN.bps, spark: "ekspor" },
];

// ---- Seri waktu nasional (pasangan [tahun, nilai]) ----
export const SERIES = {
  pertumbuhan: {
    heading: "Pertumbuhan ekonomi (% y-on-y)",
    unit: "%",
    origin: ORIGIN.bps,
    points: [[2019, 5.02], [2020, -2.07], [2021, 3.7], [2022, 5.31], [2023, 5.05], [2024, 5.03]],
    remark: "PDB harga konstan 2010. Kontraksi 2020 adalah dampak pandemi COVID-19.",
  },
  inflasi: {
    heading: "Inflasi tahunan (% y-on-y, Desember)",
    unit: "%",
    origin: ORIGIN.bps,
    points: [[2019, 2.72], [2020, 1.68], [2021, 1.87], [2022, 5.51], [2023, 2.61], [2024, 1.57]],
    remark: "Inflasi 2022 melonjak setelah penyesuaian harga BBM bersubsidi.",
  },
  populasi: {
    heading: "Jumlah penduduk (juta jiwa)",
    unit: "juta",
    origin: ORIGIN.bps,
    points: [[2020, 270.2], [2021, 273.75], [2022, 275.77], [2023, 278.69], [2024, 281.6]],
    remark: "2020 hasil Sensus Penduduk; 2021–2024 proyeksi pertengahan tahun.",
  },
  pengangguran: {
    heading: "Tingkat pengangguran terbuka (%)",
    unit: "%",
    origin: ORIGIN.bps,
    points: [[2020, 7.07], [2021, 6.49], [2022, 5.86], [2023, 5.45], [2024, 4.91]],
    remark: "Survei Angkatan Kerja Nasional, Agustus tiap tahun. Februari 2025: 4,76%.",
  },
  kemiskinan: {
    heading: "Persentase penduduk miskin (%)",
    unit: "%",
    origin: ORIGIN.bps,
    points: [[2020, 9.78], [2021, 10.14], [2022, 9.57], [2023, 9.36], [2024, 9.03], [2025, 8.47]],
    remark: "Maret tiap tahun. Maret 2025: 24,06 juta jiwa.",
  },
  gini: {
    heading: "Rasio gini (ketimpangan pengeluaran)",
    unit: "rasio",
    origin: ORIGIN.bps,
    points: [[2020, 0.381], [2021, 0.384], [2022, 0.379], [2023, 0.379], [2024, 0.379], [2025, 0.375]],
    remark: "Maret tiap tahun. 0 = merata sempurna, 1 = timpang sempurna.",
  },
  ekspor: {
    heading: "Nilai ekspor (miliar US$)",
    unit: "US$ M",
    origin: ORIGIN.bps,
    points: [[2020, 163.19], [2021, 231.61], [2022, 291.9], [2023, 258.82], [2024, 264.7]],
    remark: "2022 rekor tertinggi, didorong harga komoditas. Impor 2024: US$233,66 M.",
  },
  ipm: {
    heading: "Indeks Pembangunan Manusia",
    unit: "indeks",
    origin: ORIGIN.bps,
    points: [[2020, 71.94], [2021, 72.29], [2022, 73.55], [2023, 74.39], [2024, 75.02]],
    remark: "IPM 2024 naik 0,63 poin dari 2023.",
  },
};

// Bantuan: ambil larik tahun / nilai dari sebuah seri.
export function yearsOf(series) {
  return series.points.map((p) => p[0]);
}
export function valuesOf(series) {
  return series.points.map((p) => p[1]);
}
export function valueIn(series, year) {
  const hit = series.points.find((p) => p[0] === year);
  return hit ? hit[1] : null;
}

// ---- Pangsa PDB menurut lapangan usaha, 2024 ----
export const SECTORS = {
  heading: "Lima lapangan usaha terbesar, pangsa PDB 2024",
  unit: "% PDB",
  origin: ORIGIN.bps,
  rows: [
    { sector: "Industri pengolahan", short: "Industri pengolahan", pct: 18.67 },
    { sector: "Perdagangan besar & eceran", short: "Perdagangan", pct: 13.02 },
    { sector: "Pertanian, kehutanan & perikanan", short: "Pertanian & perikanan", pct: 12.53 },
    { sector: "Konstruksi", short: "Konstruksi", pct: 9.71 },
    { sector: "Pertambangan & penggalian", short: "Pertambangan", pct: 8.26 },
  ],
  remark: "Pangsa terhadap PDB harga berlaku 2024 (Rp22.139 triliun).",
};

// ---- Struktur umur 2024 (kelompok 10 tahun, juta jiwa) ----
export const AGE_GROUPS = {
  heading: "Struktur umur penduduk 2024",
  unit: "juta jiwa",
  origin: ORIGIN.bps,
  bands: [
    { group: "0–9", millions: 45.0 },
    { group: "10–19", millions: 46.6 },
    { group: "20–29", millions: 46.0 },
    { group: "30–39", millions: 43.3 },
    { group: "40–49", millions: 36.7 },
    { group: "50–59", millions: 28.4 },
    { group: "60–69", millions: 19.2 },
    { group: "70+", millions: 16.4 },
  ],
  remark: "Kelompok umur 0–14 tahun: 24,4% penduduk; 15–64 tahun: 68,8%; 65 tahun ke atas: 6,8%.",
};

// ---- Provinsi berpenduduk terbesar, 2024 (juta jiwa, BPS) ----
export const PROVINCES = [
  { province: "Jawa Barat", city: "Bandung", millions: 49.94 },
  { province: "Jawa Timur", city: "Surabaya", millions: 41.81 },
  { province: "Jawa Tengah", city: "Semarang", millions: 37.89 },
  { province: "Sumatera Utara", city: "Medan", millions: 16.03 },
  { province: "Banten", city: "Serang", millions: 12.43 },
  { province: "DKI Jakarta", city: "Jakarta", millions: 10.56 },
  { province: "Sulawesi Selatan", city: "Makassar", millions: 9.51 },
  { province: "Lampung", city: "Bandar Lampung", millions: 9.33 },
  { province: "Sumatera Selatan", city: "Palembang", millions: 9.02 },
  { province: "Riau", city: "Pekanbaru", millions: 6.96 },
  { province: "Sumatera Barat", city: "Padang", millions: 6.03 },
  { province: "Kalimantan Barat", city: "Pontianak", millions: 5.8 },
  { province: "Kalimantan Timur", city: "Samarinda", millions: 4.04 },
  { province: "Bali", city: "Denpasar", millions: 4.41 },
  { province: "DI Yogyakarta", city: "Yogyakarta", millions: 3.78 },
];

export const PROVINCES_SOURCE =
  "BPS, proyeksi penduduk pertengahan tahun 2024 (15 provinsi berpenduduk terbesar).";

// ---- Ketenagakerjaan ----
export const JOBS = {
  workforce: { figure: "153,05 jt", detail: "Februari 2025", origin: ORIGIN.bps },
  employed: { figure: "145,77 jt", detail: "Februari 2025", origin: ORIGIN.bps },
  tpt: { figure: "4,76%", detail: "Februari 2025", origin: ORIGIN.bps },
  urban: { figure: "5,73%", detail: "Februari 2025, perkotaan", origin: ORIGIN.bps },
  rural: { figure: "3,61%", detail: "Februari 2025, perdesaan", origin: ORIGIN.bps },
  wage: { figure: "Rp3,09 jt", detail: "Rata-rata upah buruh, Agustus 2024", origin: ORIGIN.bps },
};

// ---- Keuangan negara & moneter ----
export const MONEY = [
  { item: "Pendapatan negara", figure: "Rp2.842,4 T", detail: "Realisasi APBN 2024", origin: ORIGIN.kemenkeu },
  { item: "Belanja negara", figure: "Rp3.350,3 T", detail: "Realisasi APBN 2024", origin: ORIGIN.kemenkeu },
  { item: "Defisit APBN", figure: "Rp507,9 T", detail: "2,29% terhadap PDB, 2024", origin: ORIGIN.kemenkeu },
  { item: "BI-Rate", figure: "6,00%", detail: "Desember 2024", origin: ORIGIN.bi },
  { item: "Cadangan devisa", figure: "US$155,7 M", detail: "Desember 2024", origin: ORIGIN.bi },
  { item: "Kurs rata-rata", figure: "Rp15.847", detail: "Per dolar AS, rata-rata 2024", origin: ORIGIN.bi },
];

// ---- Sosial & digital ----
export const SOCIAL = [
  { item: "Pengguna internet", figure: "221,6 jt", detail: "79,5% populasi, 2024", origin: ORIGIN.apjii },
  { item: "Kunjungan wisman", figure: "13,90 jt", detail: "2024", origin: ORIGIN.bps },
  { item: "Angka harapan hidup", figure: "74,15 thn", detail: "2024", origin: ORIGIN.bps },
  { item: "Rata-rata lama sekolah", figure: "9,11 thn", detail: "2024", origin: ORIGIN.bps },
  { item: "Garis kemiskinan", figure: "Rp609.160", detail: "Per kapita/bulan, Maret 2025", origin: ORIGIN.bps },
];

// Format angka gaya Indonesia: koma desimal, titik ribuan.
export function idNumber(n, decimals = 2) {
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Jumlah penduduk 15 provinsi terbesar (juta jiwa).
export function provincesTotal() {
  return PROVINCES.reduce((sum, p) => sum + p.millions, 0);
}
