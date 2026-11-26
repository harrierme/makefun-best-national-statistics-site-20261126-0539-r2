// DataNusa — grafik digambar langsung di <canvas>, tanpa library.
// Tiap fungsi menerima elemen canvas + seri data, menyesuaikan lebar
// elemen dan devicePixelRatio, lalu menggambar ulang saat jendela berubah
// ukuran (pendaftaran ulang ditangani pages.js lewat window.__redraw).

const INK = "#1b2a4a";
const FAINT = "#67718a";
const GRIDLINE = "#e4e8f0";
const GOLD = "#b8860b";
const TEAL = "#20706a";
const RUST = "#c2492f";
const NAVY = "#3d5a80";
const SLICE_COLORS = ["#b8860b", "#20706a", "#c2492f", "#3d5a80", "#7a6a9b", "#4a7c59"];

// Siapkan kanvas: atur ukuran piksel mengikuti lebar CSS x DPR,
// kembalikan konteks 2D yang sudah diskalakan + ukuran CSS-nya.
function prepare(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 640;
  canvas.width = Math.max(1, Math.round(cssW * dpr));
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, height);
  return { ctx, w: cssW, h: height };
}

// Tulis angka sumbu dengan koma desimal ala Indonesia.
function tickLabel(v) {
  if (Math.abs(v) >= 100) return String(Math.round(v));
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1).replace(".", ",");
}

// Pilih anak tangga sumbu yang enak dibaca (1 / 2 / 5 / 10 x pangkat 10).
function axisTicks(lo, hi, want = 4) {
  const span = Math.max(hi - lo, 1e-9);
  const raw = span / want;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const scaled = raw / power;
  const step = (scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10) * power;
  const out = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) {
    out.push(Math.round(v / step) * step);
  }
  return out;
}

// Gambar garis grid horizontal + label sumbu Y + label tahun di bawah.
function paintAxes(ctx, area, ticks, lo, hi, yearLabels) {
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = FAINT;
  ctx.strokeStyle = GRIDLINE;
  ctx.lineWidth = 1;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const t of ticks) {
    const y = area.top + ((hi - t) / (hi - lo)) * area.height;
    ctx.beginPath();
    ctx.moveTo(area.left, y);
    ctx.lineTo(area.left + area.width, y);
    ctx.stroke();
    ctx.fillText(tickLabel(t), area.left - 7, y);
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  yearLabels.forEach((lab, i) => {
    const x = area.left + (i / Math.max(yearLabels.length - 1, 1)) * area.width;
    ctx.fillText(String(lab), x, area.top + area.height + 8);
  });
}

// Batas sumbu Y: beri napas 8% di atas-bawah, sertakan nol bila datanya negatif.
function yRange(values) {
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  const pad = (hi - lo || 1) * 0.08;
  if (lo < 0) lo = Math.min(0, lo) - pad;
  else if (lo > 0 && lo / hi > 0.5) lo = lo - (hi - lo) * 0.3;
  else lo = Math.max(0, lo - pad);
  hi = hi + pad;
  return [lo, hi];
}

export function lineChart(canvas, series, opts = {}) {
  const height = opts.height || 240;
  const { ctx, w, h } = prepare(canvas, height);
  const pad = { left: 48, right: 16, top: 12, bottom: 28 };
  const area = { left: pad.left, top: pad.top, width: w - pad.left - pad.right, height: h - pad.top - pad.bottom };
  const values = series.points.map((p) => p[1]);
  const years = series.points.map((p) => p[0]);
  const [lo, hi] = yRange(values);
  paintAxes(ctx, area, axisTicks(lo, hi), lo, hi, years);
  const xs = values.map((_, i) => area.left + (i / (values.length - 1)) * area.width);
  const ys = values.map((v) => area.top + ((hi - v) / (hi - lo)) * area.height);
  const color = opts.color || GOLD;
  // Isi area di bawah garis.
  ctx.beginPath();
  ctx.moveTo(xs[0], area.top + area.height);
  ys.forEach((y, i) => ctx.lineTo(xs[i], y));
  ctx.lineTo(xs[xs.length - 1], area.top + area.height);
  ctx.closePath();
  ctx.fillStyle = "rgba(184, 134, 11, 0.09)";
  ctx.fill();
  // Garis utama.
  ctx.beginPath();
  ys.forEach((y, i) => (i === 0 ? ctx.moveTo(xs[i], y) : ctx.lineTo(xs[i], y)));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  // Titik + label nilai. Nilai negatif ditulis di bawah titik supaya
  // tidak menabrak garis yang turun tajam ke titik itu.
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(xs[i], ys[i], 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = INK;
    if (v < 0) {
      ctx.textBaseline = "top";
      ctx.fillText(tickLabel(v), xs[i], ys[i] + 8);
    } else {
      ctx.textBaseline = "bottom";
      ctx.fillText(tickLabel(v), xs[i], ys[i] - 8);
    }
  });
}

export function barChart(canvas, series, opts = {}) {
  const height = opts.height || 240;
  const { ctx, w, h } = prepare(canvas, height);
  const pad = { left: 48, right: 16, top: 18, bottom: 28 };
  const area = { left: pad.left, top: pad.top, width: w - pad.left - pad.right, height: h - pad.top - pad.bottom };
  const values = series.points.map((p) => p[1]);
  const years = series.points.map((p) => p[0]);
  const hi = Math.max(...values, 0) * 1.12;
  const lo = Math.min(0, ...values) * 1.12;
  paintAxes(ctx, area, axisTicks(lo, hi), lo, hi, years);
  const zeroY = area.top + ((hi - 0) / (hi - lo)) * area.height;
  const slot = area.width / values.length;
  const bw = Math.min(46, slot * 0.62);
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  values.forEach((v, i) => {
    const x = area.left + slot * i + (slot - bw) / 2;
    const y = area.top + ((hi - v) / (hi - lo)) * area.height;
    const top = Math.min(y, zeroY);
    const bh = Math.max(Math.abs(zeroY - y), 2);
    ctx.fillStyle = v < 0 ? RUST : opts.color || TEAL;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, top, bw, bh, 3);
    else ctx.rect(x, top, bw, bh);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textBaseline = v < 0 ? "top" : "bottom";
    ctx.fillText(tickLabel(v), x + bw / 2, v < 0 ? y + 5 : y - 6);
  });
}

export function donutChart(canvas, rows, opts = {}) {
  const height = opts.height || 220;
  const { ctx, w, h } = prepare(canvas, height);
  const cx = w * 0.32;
  const cy = h / 2;
  const radius = Math.min(h / 2 - 14, 78);
  const total = rows.reduce((s, r) => s + r.pct, 0);
  let angle = -Math.PI / 2;
  rows.forEach((row, i) => {
    const sweep = (row.pct / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = SLICE_COLORS[i % SLICE_COLORS.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(opts.center || "62,2%", cx, cy - 8);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = FAINT;
  ctx.fillText(opts.centerNote || "dari PDB", cx, cy + 10);
  // Legenda di kanan.
  const lx = w * 0.62;
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "left";
  rows.forEach((row, i) => {
    const y = 24 + i * 34;
    ctx.fillStyle = SLICE_COLORS[i % SLICE_COLORS.length];
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(lx, y - 6, 12, 12, 3);
    else ctx.rect(lx, y - 6, 12, 12);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.fillText(row.short, lx + 20, y);
    ctx.fillStyle = FAINT;
    ctx.fillText(tickLabel(row.pct) + "%", lx + 20, y + 14);
  });
}

export function ageChart(canvas, bands, opts = {}) {
  const height = opts.height || 260;
  const { ctx, w, h } = prepare(canvas, height);
  const peak = Math.max(...bands.map((b) => b.millions));
  const labelW = 54;
  const rowH = (h - 10) / bands.length;
  ctx.font = "12px system-ui, sans-serif";
  bands.forEach((b, i) => {
    const y = 5 + i * rowH;
    const barW = (b.millions / peak) * (w - labelW - 66);
    ctx.fillStyle = INK;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(b.group, labelW - 8, y + rowH / 2);
    ctx.fillStyle = i % 2 === 0 ? GOLD : TEAL;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(labelW, y + 4, Math.max(barW, 2), rowH - 8, 3);
    else ctx.rect(labelW, y + 4, Math.max(barW, 2), rowH - 8);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textAlign = "left";
    ctx.fillText(tickLabel(b.millions) + " jt", labelW + barW + 8, y + rowH / 2);
  });
}

// Sparkline kecil untuk kartu KPI di Beranda.
export function sparkline(canvas, values, color = GOLD) {
  const { ctx, w, h } = prepare(canvas, 44);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const px = (i) => (i / (values.length - 1)) * (w - 4) + 2;
  const py = (v) => h - 4 - ((v - lo) / span) * (h - 8);
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px(values.length - 1), py(values[values.length - 1]), 3.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
