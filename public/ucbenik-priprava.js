// Učbenik za tiskanje (server/textbook-print.js): pregrada »Pripravljam učbenik …« z napredkom, med tem ko se stran
// prenaša in izrisuje, in navodilo v brskalnikih, ki ne znajo tiskati/shraniti PDF-ja (vgrajeni brskalniki aplikacij).
// Ločena datoteka zaradi politike CSP (brez vrinjenih skript). Teče takoj na vrhu strani, ne šele ob koncu prenosa.

// Brskalniki, v katerih print() ne naredi nič ali ne ponudi PDF-ja: vgrajeni brskalniki aplikacij (Facebook,
// Messenger, Instagram, TikTok, Snapchat, LINE, WeChat, LinkedIn …), Android WebView ("; wv)") in iOS WebView
// (iPhone/iPad brez »Safari/« v UA; Safari, Chrome in Firefox na iOS ga imajo).
function neZnaTiskati(ua = "", hasPrint = true) {
  if (!hasPrint) return true;
  if (/EvklidApp\//.test(ua)) return false;
  if (/FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|musical_ly|BytedanceWebview|TikTok|Snapchat|\bLine\/|MicroMessenger|LinkedInApp|Pinterest|Twitter|KAKAOTALK|Viber/i.test(ua)) return true;
  if (/; wv\)/.test(ua)) return true;
  if (/iPhone|iPad|iPod/.test(ua) && !/Safari\//.test(ua)) return true;
  return false;
}

globalThis.neZnaTiskati = neZnaTiskati; // test/ucbenik-pdf.test.js

const box = typeof document !== "undefined" ? document.getElementById("priprava") : null;
if (box) {
  const $ = (s) => box.querySelector(s);
  const bar = $(".p-trak i");
  const total = Number(box.dataset.skupaj) || 0;
  box.classList.add("p-on"); // pregrada je privzeto skrita v CSS: če ta skripta ne naloži, stran ostane berljiva
  const unsupported = neZnaTiskati(navigator.userAgent, typeof window.print === "function");
  window.__tiskNe = unsupported;
  let text = {};
  const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
  const state = $(".p-stanje");
  const lessons = () => document.querySelectorAll("article.lesson").length;
  const paint = (done) => {
    // 5–90 %: lekcije, ki so že prišle; zadnjih 10 % je izris v brskalniku (ob »load« 100 %).
    bar.style.width = `${total ? 5 + Math.min(1, done / total) * 85 : 50}%`;
    state.textContent = fill(text.progress || `${done} od ${total} lekcij`, { done, total });
  };
  const timer = setInterval(() => paint(lessons()), 150);

  const apply = (d) => {
    text = { progress: d["tbk.pdfProgress"], copied: d["tbk.pdfCopied"], copy: d["tbk.pdfCopy"] };
    $(".p-naslov").textContent = d["tbk.pdfPrep"];
    $(".p-navodilo").textContent = d["tbk.pdfNoPrint"];
    $(".p-kopiraj").textContent = d["tbk.pdfCopy"];
    $(".p-vseeno").textContent = d["tbk.pdfTry"];
    $(".p-prikazi").textContent = d["tbk.pdfShow"];
    const save = document.querySelector(".bar button");
    if (save) save.textContent = d["tbk.pdfSave"];
    paint(lessons());
  };
  const lang = new URLSearchParams(location.search).get("l") || "";
  if (/^[A-Za-z]{2,3}(-[A-Za-z]{2,4})?$/.test(lang) && lang !== "sl") {
    if (["ar", "fa", "ur"].includes(lang)) box.dir = "rtl";
    fetch(`/i18n/ui/${lang}.json`).then(async (r) => { if (!r.ok) { await r.text().catch(() => {}); return null; } return r.json(); }).then((d) => d && apply(d)).catch(() => {});
  }

  const hide = () => {
    clearInterval(timer);
    box.hidden = true;
  };
  // Varnostni čas: če »load« ne pride (počasno omrežje, zataknjen prenos), pregrada ne ostane čez vso stran.
  $(".p-prikazi").addEventListener("click", hide);
  if (!unsupported) setTimeout(() => !box.hidden && ($(".p-varnost").hidden = false), 45_000);
  if (unsupported) {
    // Brez samodejnega tiska: navodilo + kopiranje povezave; »Vseeno poskusi« pokaže stran in tiska.
    clearInterval(timer);
    $(".p-naslov").hidden = true;
    $(".p-trak").hidden = true;
    state.hidden = true;
    $(".p-navodilo").hidden = false;
    $(".p-akcije").hidden = false;
    $(".p-kopiraj").addEventListener("click", async (e) => {
      const url = location.href; // z #natisni: odprta povezava takoj ponudi shranjevanje
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        const i = document.createElement("input");
        i.value = url;
        document.body.appendChild(i);
        i.select();
        try { document.execCommand("copy"); } catch {}
        i.remove();
      }
      e.target.textContent = text.copied || "Povezava kopirana";
    });
    $(".p-vseeno").addEventListener("click", () => {
      hide();
      try { print(); } catch {}
    });
  } else {
    addEventListener("load", () => {
      bar.style.width = "100%";
      state.textContent = fill(text.progress || `${total} od ${total} lekcij`, { done: total, total });
      setTimeout(hide, 150);
    });
  }
}
