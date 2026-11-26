// DataNusa — semua grafik digambar manual di <canvas>, tanpa library.
// Setiap fungsi menerima elemen canvas + seri data dan menyesuaikan lebar
// elemen dengan devicePixelRatio, lalu menggambar ulang saat jendela
// berubah ukuran (pendaftaran ulangnya diurus pages.js lewat
// window.__gambarUlang).

const PALET = {
  tinta: "#1b2a4a",
  redup: "#67718a",
  garis: "#e4e8f0",
  emas: "#b8860b",
  toska: "#20706a",
  bata: "#c2492f",
  biru: "#3d5a80",
};
const IRIS = ["#b8860b", "#20706a", "#c2492f", "#3d5a80", "#7a6a9b", "#4a7c59"];
const FONT_KECIL = "11px system-ui, sans-serif";
const FONT_TEBAL_KECIL = "bold 11px system-ui, sans-serif";

// Siapkan kanvas: ukuran piksel mengikuti lebar CSS dikali DPR,
// lalu kembalikan konteks 2D yang sudah diskalakan + ukuran CSS-nya.
function siapkanKanvas(kanvas, tinggi) {
  const skala = window.devicePixelRatio || 1;
  const induk = kanvas.parentElement;
  const lebarCss = kanvas.clientWidth || (induk && induk.clientWidth) || 640;
  kanvas.width = Math.max(1, Math.round(lebarCss * skala));
  kanvas.height = Math.round(tinggi * skala);
  kanvas.style.height = tinggi + "px";
  const g = kanvas.getContext("2d");
  g.setTransform(skala, 0, 0, skala, 0, 0);
  g.clearRect(0, 0, lebarCss, tinggi);
  return { g, lebar: lebarCss, tinggi };
}

// Angka sumbu ditulis dengan koma desimal ala Indonesia.
function labelSumbu(nilai) {
  if (Math.abs(nilai) >= 100) return String(Math.round(nilai));
  if (Number.isInteger(nilai)) return String(nilai);
  return nilai.toFixed(1).replace(".", ",");
}

// Anak tangga sumbu dipilih yang enak dibaca (1 / 2 / 5 / 10 x pangkat 10).
function tanggaSumbu(bawah, atas, target = 4) {
  const bentang = Math.max(atas - bawah, 1e-9);
  const kasar = bentang / target;
  const pangkat = Math.pow(10, Math.floor(Math.log10(kasar)));
  const skala = kasar / pangkat;
  let langkah;
  if (skala <= 1) langkah = 1;
  else if (skala <= 2) langkah = 2;
  else if (skala <= 5) langkah = 5;
  else langkah = 10;
  langkah = langkah * pangkat;
  const hasil = [];
  for (let v = Math.ceil(bawah / langkah) * langkah; v <= atas + langkah * 1e-6; v += langkah) {
    hasil.push(Math.round(v / langkah) * langkah);
  }
  return hasil;
}

// Garis grid horizontal + label sumbu Y + label tahun di bawah digambar di sini.
function gambarSumbu(g, petak, anakTangga, bawah, atas, labelTahun) {
  g.font = FONT_KECIL;
  g.fillStyle = PALET.redup;
  g.strokeStyle = PALET.garis;
  g.lineWidth = 1;
  g.textAlign = "right";
  g.textBaseline = "middle";
  for (const t of anakTangga) {
    const y = petak.atas + petak.tinggi * ((atas - t) / (atas - bawah));
    g.beginPath();
    g.moveTo(petak.kiri, y);
    g.lineTo(petak.kiri + petak.lebar, y);
    g.stroke();
    g.fillText(labelSumbu(t), petak.kiri - 7, y);
  }
  g.textAlign = "center";
  g.textBaseline = "top";
  const penyebut = Math.max(labelTahun.length - 1, 1);
  labelTahun.forEach((lab, i) => {
    const x = petak.kiri + (i / penyebut) * petak.lebar;
    g.fillText(String(lab), x, petak.atas + petak.tinggi + 8);
  });
}

// Batas sumbu Y diberi napas 8% di atas-bawah; nol ikut bila datanya negatif.
function rentangSumbuY(nilai) {
  let bawah = Math.min(...nilai);
  let atas = Math.max(...nilai);
  const bantalan = (atas - bawah || 1) * 0.08;
  if (bawah < 0) {
    bawah = Math.min(0, bawah) - bantalan;
  } else if (bawah > 0 && bawah / atas > 0.5) {
    bawah = bawah - (atas - bawah) * 0.3;
  } else {
    bawah = Math.max(0, bawah - bantalan);
  }
  return [bawah, atas + bantalan];
}

// Petak gambar dari padding: {kiri, atas, lebar, tinggi}.
function petakGambar(lebar, tinggi, pad) {
  return {
    kiri: pad.kiri,
    atas: pad.atas,
    lebar: lebar - pad.kiri - pad.kanan,
    tinggi: tinggi - pad.atas - pad.bawah,
  };
}

export function grafikGaris(kanvas, seri, opsi = {}) {
  const tinggi = opsi.tinggi || 240;
  const { g, lebar, tinggi: h } = siapkanKanvas(kanvas, tinggi);
  const petak = petakGambar(lebar, h, { kiri: 48, kanan: 16, atas: 12, bawah: 28 });
  const nilai = seri.nilai;
  const tahun = seri.tahun;
  const [bawah, atas] = rentangSumbuY(nilai);
  gambarSumbu(g, petak, tanggaSumbu(bawah, atas), bawah, atas, tahun);
  const warna = opsi.warna || PALET.emas;
  const xs = nilai.map((_, i) => petak.kiri + petak.lebar * (i / (nilai.length - 1)));
  const ys = nilai.map((v) => petak.atas + petak.tinggi * ((atas - v) / (atas - bawah)));
  // Isian area di bawah garis.
  g.beginPath();
  g.moveTo(xs[0], petak.atas + petak.tinggi);
  ys.forEach((y, i) => g.lineTo(xs[i], y));
  g.lineTo(xs[xs.length - 1], petak.atas + petak.tinggi);
  g.closePath();
  g.fillStyle = "rgba(184, 134, 11, 0.09)";
  g.fill();
  // Garisnya sendiri.
  g.beginPath();
  ys.forEach((y, i) => (i === 0 ? g.moveTo(xs[i], y) : g.lineTo(xs[i], y)));
  g.strokeStyle = warna;
  g.lineWidth = 2.5;
  g.lineJoin = "round";
  g.stroke();
  // Titik beserta label nilainya. Nilai negatif ditulis di bawah titik supaya
  // tidak bertabrakan dengan garis yang turun tajam ke titik itu.
  g.font = FONT_TEBAL_KECIL;
  g.fillStyle = PALET.tinta;
  nilai.forEach((v, i) => {
    g.beginPath();
    g.arc(xs[i], ys[i], 4, 0, Math.PI * 2);
    g.fillStyle = "#ffffff";
    g.fill();
    g.strokeStyle = warna;
    g.lineWidth = 2;
    g.stroke();
    g.fillStyle = PALET.tinta;
    // Label titik tepi digeser ke dalam supaya tidak bertabrakan dengan
    // label sumbu Y (titik pertama) atau terpotong tepi kanan (titik terakhir).
    const posisi = i === 0 ? "awal" : i === nilai.length - 1 ? "akhir" : "tengah";
    g.textAlign = posisi === "awal" ? "left" : posisi === "akhir" ? "right" : "center";
    const lx = posisi === "awal" ? xs[i] + 8 : posisi === "akhir" ? xs[i] - 8 : xs[i];
    const diBawah = v < 0;
    if (diBawah) {
      g.textBaseline = "top";
      g.fillText(labelSumbu(v), lx, ys[i] + 8);
    } else {
      g.textBaseline = "bottom";
      g.fillText(labelSumbu(v), lx, ys[i] - 8);
    }
  });
}

export function grafikBatang(kanvas, seri, opsi = {}) {
  const tinggi = opsi.tinggi || 240;
  const { g, lebar, tinggi: h } = siapkanKanvas(kanvas, tinggi);
  const petak = petakGambar(lebar, h, { kiri: 48, kanan: 16, atas: 18, bawah: 28 });
  const nilai = seri.nilai;
  const tahun = seri.tahun;
  const atas = Math.max(...nilai, 0) * 1.12;
  const bawah = Math.min(0, ...nilai) * 1.12;
  gambarSumbu(g, petak, tanggaSumbu(bawah, atas), bawah, atas, tahun);
  const yNol = petak.atas + petak.tinggi * ((atas - 0) / (atas - bawah));
  const slot = petak.lebar / nilai.length;
  const lebarBatang = Math.min(46, slot * 0.62);
  g.font = FONT_TEBAL_KECIL;
  g.textAlign = "center";
  nilai.forEach((v, i) => {
    const x = petak.kiri + slot * i + (slot - lebarBatang) / 2;
    const y = petak.atas + petak.tinggi * ((atas - v) / (atas - bawah));
    const puncak = Math.min(y, yNol);
    const tinggiBatang = Math.max(Math.abs(yNol - y), 2);
    g.fillStyle = v < 0 ? PALET.bata : opsi.warna || PALET.toska;
    g.beginPath();
    if (g.roundRect) g.roundRect(x, puncak, lebarBatang, tinggiBatang, 3);
    else g.rect(x, puncak, lebarBatang, tinggiBatang);
    g.fill();
    g.fillStyle = PALET.tinta;
    const negatif = v < 0;
    g.textBaseline = negatif ? "top" : "bottom";
    g.fillText(labelSumbu(v), x + lebarBatang / 2, negatif ? y + 5 : y - 6);
  });
}

export function grafikDonat(kanvas, baris, opsi = {}) {
  const tinggi = opsi.tinggi || 220;
  const { g, lebar, tinggi: h } = siapkanKanvas(kanvas, tinggi);
  const cx = lebar * 0.32;
  const tengahY = h / 2;
  const jari = Math.min(h / 2 - 14, 78);
  const total = baris.reduce((s, r) => s + r[2], 0);
  let sudut = -Math.PI / 2;
  baris.forEach((r, i) => {
    const sapuan = (r[2] / total) * Math.PI * 2;
    g.beginPath();
    g.moveTo(cx, tengahY);
    g.arc(cx, tengahY, jari, sudut, sudut + sapuan);
    g.closePath();
    g.fillStyle = IRIS[i % IRIS.length];
    g.fill();
    sudut += sapuan;
  });
  g.beginPath();
  g.arc(cx, tengahY, jari * 0.58, 0, Math.PI * 2);
  g.fillStyle = "#ffffff";
  g.fill();
  g.fillStyle = PALET.tinta;
  g.font = "bold 15px system-ui, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(opsi.tengah || "62,2%", cx, tengahY - 8);
  g.font = FONT_KECIL;
  g.fillStyle = PALET.redup;
  g.fillText(opsi.catatanTengah || "dari PDB", cx, tengahY + 10);
  // Legenda di sisi kanan.
  const lx = lebar * 0.62;
  g.font = "12px system-ui, sans-serif";
  g.textAlign = "left";
  baris.forEach((r, i) => {
    const yLegenda = 24 + i * 34;
    g.fillStyle = IRIS[i % IRIS.length];
    g.beginPath();
    if (g.roundRect) g.roundRect(lx, yLegenda - 6, 12, 12, 3);
    else g.rect(lx, yLegenda - 6, 12, 12);
    g.fill();
    g.fillStyle = PALET.tinta;
    g.fillText(r[1], lx + 20, yLegenda);
    g.fillStyle = PALET.redup;
    g.fillText(labelSumbu(r[2]) + "%", lx + 20, yLegenda + 14);
  });
}

export function grafikUmur(kanvas, kelompok, opsi = {}) {
  const tinggi = opsi.tinggi || 260;
  const { g, lebar, tinggi: h } = siapkanKanvas(kanvas, tinggi);
  const puncak = Math.max(...kelompok.map((k) => k[1]));
  const lebarLabel = 54;
  const tinggiBaris = (h - 10) / kelompok.length;
  g.font = "12px system-ui, sans-serif";
  kelompok.forEach((k, i) => {
    const y = 5 + i * tinggiBaris;
    const lebarBatang = (k[1] / puncak) * (lebar - lebarLabel - 66);
    g.fillStyle = PALET.tinta;
    g.textAlign = "right";
    g.textBaseline = "middle";
    g.fillText(k[0], lebarLabel - 8, y + tinggiBaris / 2);
    g.fillStyle = i % 2 === 0 ? PALET.emas : PALET.toska;
    g.beginPath();
    if (g.roundRect) g.roundRect(lebarLabel, y + 4, Math.max(lebarBatang, 2), tinggiBaris - 8, 3);
    else g.rect(lebarLabel, y + 4, Math.max(lebarBatang, 2), tinggiBaris - 8);
    g.fill();
    g.fillStyle = PALET.tinta;
    g.textAlign = "left";
    g.fillText(labelSumbu(k[1]) + " jt", lebarLabel + lebarBatang + 8, y + tinggiBaris / 2);
  });
}

// Percik kecil untuk kartu KPI di Beranda.
export function percik(kanvas, nilai, warna = PALET.emas) {
  const { g, lebar, tinggi: h } = siapkanKanvas(kanvas, 44);
  const bawah = Math.min(...nilai);
  const atas = Math.max(...nilai);
  const bentang = atas - bawah || 1;
  const px = (i) => (i / (nilai.length - 1)) * (lebar - 4) + 2;
  const py = (v) => h - 4 - ((v - bawah) / bentang) * (h - 8);
  g.beginPath();
  nilai.forEach((v, i) => (i === 0 ? g.moveTo(px(i), py(v)) : g.lineTo(px(i), py(v))));
  g.strokeStyle = warna;
  g.lineWidth = 2;
  g.lineJoin = "round";
  g.stroke();
  g.beginPath();
  g.arc(px(nilai.length - 1), py(nilai[nilai.length - 1]), 3.5, 0, Math.PI * 2);
  g.fillStyle = warna;
  g.fill();
}
