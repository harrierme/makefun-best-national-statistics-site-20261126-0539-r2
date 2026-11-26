// DataNusa — mula-mula: pasang navigasi, tampilkan halaman pertama,
// lalu tampilkan ulang setiap kali hash berubah.
import { tampilkan, tautanNav } from "./pages.js";

const navigasi = document.getElementById("main-nav");
navigasi.innerHTML = tautanNav();
window.addEventListener("hashchange", tampilkan);
tampilkan();
