// DataNusa — kumpulan angka resmi Indonesia.
//
// Isi berkas ini diambil dari publikasi resmi Badan Pusat Statistik,
// Bank Indonesia, Kementerian Keuangan, dan APJII. Setiap seri
// menyimpan lembaga sumber beserta tahun acuannya; tidak ada angka
// karangan. Seri waktu ditulis sebagai dua larik sejajar — tahun dan
// nilai — supaya mudah dipetik per tahun maupun digambar sekaligus.

export const NEGARA = {
  nama: "Indonesia",
  dimutakhirkan: "November 2026",
  mataUang: "Rp",
};

const NAMA_LEMBAGA = [
  ["bps", "Badan Pusat Statistik (BPS)"],
  ["bi", "Bank Indonesia (BI)"],
  ["kemenkeu", "Kementerian Keuangan RI"],
  ["apjii", "APJII — Survei Penetrasi Internet"],
];
export const LEMBAGA = Object.fromEntries(NAMA_LEMBAGA);

// == Kartu angka utama: angka terbaru tiap indikator ==
export const SOROTAN = [
  { id: "populasi", label: "Penduduk", angka: "281,6 jt", ket: "2024, proyeksi pertengahan tahun", selisih: "+0,96% dari 2023", asal: LEMBAGA.bps, seri: "populasi" },
  { id: "pdb", label: "PDB", angka: "Rp22.139 T", ket: "2024, harga berlaku", selisih: "Rp78,62 jt per kapita", asal: LEMBAGA.bps, seri: "pdb" },
  { id: "tumbuh", label: "Pertumbuhan ekonomi", angka: "5,03%", ket: "2024 (y-on-y)", selisih: "2023: 5,05%", asal: LEMBAGA.bps, seri: "pertumbuhan" },
  { id: "inflasi", label: "Inflasi", angka: "1,57%", ket: "2024 (y-on-y, Desember)", selisih: "2023: 2,61%", asal: LEMBAGA.bps, seri: "inflasi" },
  { id: "tpt", label: "Pengangguran (TPT)", angka: "4,76%", ket: "Februari 2025", selisih: "Agustus 2024: 4,91%", asal: LEMBAGA.bps, seri: "pengangguran" },
  { id: "miskin", label: "Penduduk miskin", angka: "8,47%", ket: "Maret 2025", selisih: "24,06 juta jiwa", asal: LEMBAGA.bps, seri: "kemiskinan" },
  { id: "ipm", label: "Indeks Pembangunan Manusia", angka: "75,02", ket: "2024", selisih: "2023: 74,39", asal: LEMBAGA.bps, seri: "ipm" },
  { id: "ekspor", label: "Ekspor", angka: "US$264,7 M", ket: "2024", selisih: "Surplus US$31,0 M", asal: LEMBAGA.bps, seri: "ekspor" },
];

// == Seri waktu nasional (larik tahun + larik nilai, sejajar) ==
const DAFTAR_RENTANG = [
  ["pertumbuhan", {
    judul: "Pertumbuhan ekonomi (% y-on-y)",
    satuan: "%",
    asal: LEMBAGA.bps,
    tahun: [2019, 2020, 2021, 2022, 2023, 2024],
    nilai: [5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
    catatan: "PDB harga konstan 2010. Kontraksi 2020 adalah dampak pandemi COVID-19.",
  }],
  ["inflasi", {
    judul: "Inflasi tahunan (% y-on-y, Desember)",
    satuan: "%",
    asal: LEMBAGA.bps,
    tahun: [2019, 2020, 2021, 2022, 2023, 2024],
    nilai: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    catatan: "Inflasi 2022 melonjak setelah penyesuaian harga BBM bersubsidi.",
  }],
  ["populasi", {
    judul: "Jumlah penduduk (juta jiwa)",
    satuan: "juta",
    asal: LEMBAGA.bps,
    tahun: [2020, 2021, 2022, 2023, 2024],
    nilai: [270.2, 273.75, 275.77, 278.69, 281.6],
    catatan: "2020 hasil Sensus Penduduk; 2021–2024 proyeksi pertengahan tahun.",
  }],
  ["pdb", {
    judul: "PDB harga berlaku (Rp triliun)",
    satuan: "Rp T",
    asal: LEMBAGA.bps,
    tahun: [2019, 2020, 2021, 2022, 2023, 2024],
    nilai: [15833, 15443, 16977, 19588, 20892, 22139],
    catatan: "PDB atas dasar harga berlaku. 2020 turun akibat pandemi; 2022–2024 pulih dan naik.",
  }],
  ["pengangguran", {
    judul: "Tingkat pengangguran terbuka (%)",
    satuan: "%",
    asal: LEMBAGA.bps,
    tahun: [2020, 2021, 2022, 2023, 2024],
    nilai: [7.07, 6.49, 5.86, 5.45, 4.91],
    catatan: "Survei Angkatan Kerja Nasional, Agustus tiap tahun. Februari 2025: 4,76%.",
  }],
  ["kemiskinan", {
    judul: "Persentase penduduk miskin (%)",
    satuan: "%",
    asal: LEMBAGA.bps,
    tahun: [2020, 2021, 2022, 2023, 2024, 2025],
    nilai: [9.78, 10.14, 9.57, 9.36, 9.03, 8.47],
    catatan: "Maret tiap tahun. Maret 2025: 24,06 juta jiwa.",
  }],
  ["gini", {
    judul: "Rasio gini (ketimpangan pengeluaran)",
    satuan: "rasio",
    asal: LEMBAGA.bps,
    tahun: [2020, 2021, 2022, 2023, 2024, 2025],
    nilai: [0.381, 0.384, 0.379, 0.379, 0.379, 0.375],
    catatan: "Maret tiap tahun. 0 = merata sempurna, 1 = timpang sempurna.",
  }],
  ["ekspor", {
    judul: "Nilai ekspor (miliar US$)",
    satuan: "US$ M",
    asal: LEMBAGA.bps,
    tahun: [2020, 2021, 2022, 2023, 2024],
    nilai: [163.19, 231.61, 291.9, 258.82, 264.7],
    catatan: "2022 rekor tertinggi, didorong harga komoditas. Impor 2024: US$233,66 M.",
  }],
  ["ipm", {
    judul: "Indeks Pembangunan Manusia",
    satuan: "indeks",
    asal: LEMBAGA.bps,
    tahun: [2020, 2021, 2022, 2023, 2024],
    nilai: [71.94, 72.29, 73.55, 74.39, 75.02],
    catatan: "IPM 2024 naik 0,63 poin dari 2023.",
  }],
];
export const RENTANG = Object.fromEntries(DAFTAR_RENTANG);

// Petik larik tahun / nilai dari sebuah seri.
export function tahunSeri(seri) {
  return seri.tahun.slice();
}
export function nilaiSeri(seri) {
  return seri.nilai.slice();
}
export function nilaiTahun(seri, tahun) {
  const posisi = seri.tahun.indexOf(tahun);
  return posisi === -1 ? null : seri.nilai[posisi];
}

// == Pangsa PDB menurut lapangan usaha, 2024 ==
// Tiap baris: [nama lapangan, nama pendek, pangsa %].
export const LAPANGAN = {
  judul: "Lima lapangan usaha terbesar, pangsa PDB 2024",
  satuan: "% PDB",
  asal: LEMBAGA.bps,
  baris: [
    ["Industri pengolahan", "Industri pengolahan", 18.67],
    ["Perdagangan besar & eceran", "Perdagangan", 13.02],
    ["Pertanian, kehutanan & perikanan", "Pertanian & perikanan", 12.53],
    ["Konstruksi", "Konstruksi", 9.71],
    ["Pertambangan & penggalian", "Pertambangan", 8.26],
  ],
  catatan: "Pangsa terhadap PDB harga berlaku 2024 (Rp22.139 triliun).",
};

// == Struktur umur 2024 (kelompok 10 tahun, juta jiwa) ==
// Tiap kelompok: [rentang umur, juta jiwa].
export const UMUR = {
  judul: "Struktur umur penduduk 2024",
  satuan: "juta jiwa",
  asal: LEMBAGA.bps,
  kelompok: [
    ["0–9", 45.0],
    ["10–19", 46.6],
    ["20–29", 46.0],
    ["30–39", 43.3],
    ["40–49", 36.7],
    ["50–59", 28.4],
    ["60–69", 19.2],
    ["70+", 16.4],
  ],
  catatan: "Kelompok umur 0–14 tahun: 24,4% penduduk; 15–64 tahun: 68,8%; 65 tahun ke atas: 6,8%.",
};

// == Provinsi berpenduduk terbesar, 2024 (juta jiwa, BPS) ==
// Tiap baris: [provinsi, ibu kota, juta jiwa].
export const DAERAH = [
  ["Jawa Barat", "Bandung", 50.35],
  ["Jawa Timur", "Surabaya", 41.81],
  ["Jawa Tengah", "Semarang", 37.89],
  ["Sumatera Utara", "Medan", 15.59],
  ["Banten", "Serang", 12.43],
  ["DKI Jakarta", "Jakarta", 10.68],
  ["Sulawesi Selatan", "Makassar", 9.46],
  ["Lampung", "Bandar Lampung", 9.42],
  ["Sumatera Selatan", "Palembang", 8.84],
  ["Riau", "Pekanbaru", 6.73],
  ["Sumatera Barat", "Padang", 5.84],
  ["Kalimantan Barat", "Pontianak", 5.7],
  ["Nusa Tenggara Timur", "Kupang", 5.66],
  ["Nusa Tenggara Barat", "Mataram", 5.65],
  ["Aceh", "Banda Aceh", 5.55],
];

export const DAERAH_SUMBER =
  "BPS, proyeksi penduduk pertengahan tahun 2024 " + "(15 provinsi berpenduduk terbesar).";

// == Ketenagakerjaan ==
export const KERJA = {
  angkatan: { angka: "153,05 jt", ket: "Februari 2025", asal: LEMBAGA.bps },
  bekerja: { angka: "145,77 jt", ket: "Februari 2025", asal: LEMBAGA.bps },
  tpt: { angka: "4,76%", ket: "Februari 2025", asal: LEMBAGA.bps },
  kota: { angka: "5,73%", ket: "Februari 2025, perkotaan", asal: LEMBAGA.bps },
  desa: { angka: "3,61%", ket: "Februari 2025, perdesaan", asal: LEMBAGA.bps },
  upah: { angka: "Rp3,09 jt", ket: "Rata-rata upah buruh, Agustus 2024", asal: LEMBAGA.bps },
};

// == Keuangan negara & moneter ==
// Tiap baris: [indikator, nilai, keterangan, sumber].
export const KEUANGAN = [
  ["Pendapatan negara", "Rp2.842,4 T", "Realisasi APBN 2024", LEMBAGA.kemenkeu],
  ["Belanja negara", "Rp3.350,3 T", "Realisasi APBN 2024", LEMBAGA.kemenkeu],
  ["Defisit APBN", "Rp507,9 T", "2,29% terhadap PDB, 2024", LEMBAGA.kemenkeu],
  ["BI-Rate", "6,00%", "Desember 2024", LEMBAGA.bi],
  ["Cadangan devisa", "US$155,7 M", "Desember 2024", LEMBAGA.bi],
  ["Kurs rata-rata", "Rp15.847", "Per dolar AS, rata-rata 2024", LEMBAGA.bi],
];

// == Sosial & digital ==
// Tiap baris: [indikator, nilai, keterangan, sumber].
export const SOSIAL = [
  ["Pengguna internet", "221,6 jt", "79,5% populasi, 2024", LEMBAGA.apjii],
  ["Kunjungan wisman", "13,90 jt", "2024", LEMBAGA.bps],
  ["Angka harapan hidup", "74,15 thn", "2024", LEMBAGA.bps],
  ["Rata-rata lama sekolah", "9,11 thn", "2024", LEMBAGA.bps],
  ["Garis kemiskinan", "Rp609.160", "Per kapita/bulan, Maret 2025", LEMBAGA.bps],
];

// Angka diformat gaya Indonesia: koma desimal, titik ribuan.
export function formatAngka(n, desimal = 2) {
  const opsi = { minimumFractionDigits: desimal, maximumFractionDigits: desimal };
  return n.toLocaleString("id-ID", opsi);
}

// Total penduduk 15 provinsi terbesar (juta jiwa).
export function totalDaerah() {
  let jumlah = 0;
  for (const baris of DAERAH) jumlah += baris[2];
  return jumlah;
}
