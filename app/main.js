// DataNusa — bootstrap: pasang navigasi, render halaman pertama,
// lalu render ulang setiap kali hash berubah.
import { render, navHtml } from "./pages.js";

document.getElementById("main-nav").innerHTML = navHtml();
window.addEventListener("hashchange", render);
render();
