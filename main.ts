// DataNusa — program penyerahan (Node 22, pustaka standar saja).
//
// Tugas program ini: menyalin app/ dan screenshots/ dari samping berkas
// ini ke /output, lalu menulis /output/dossier.json memakai buildDossier
// dari vendor/makefun-frontend.ts. Di luar kontainer grader,
// MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// vendor/makefun-frontend.ts jangan diubah: scorer membangun ulang
// dossier.json dengan salinan yang sama dan membandingkan byte per byte.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const appDir = join(root, "app");
const shotsDir = join(root, "screenshots");

mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });
}

// Batas yang sama dengan yang dipakai scorer: teks dossier dibatasi
// 160 KiB, maksimal 4 screenshot @ 256 KiB, app/ maksimal 993 entri
// dan 16 MiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
