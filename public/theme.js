// Svetli/temni način in lastne barve. Navaden skript v <head>, da se barve nastavijo pred prvim izrisom.
// Nastavitve so shranjene na tej napravi (localStorage "evklid.theme"):
//   { style: "cist" | "igriv" | "temen" | ključ iz ERAS (zgodovinski slogi), mode: "system" | "light" | "dark", accent: "#rrggbb" | null,
//     light: { bg, surface, menu, text } | null, dark: { … } | null }
// Slog (docs/oblikovanje.md): Čist (privzeto, Instrument Sans, umirjen), Igriv (Nunito, zaobljen, topel),
// Temen (IBM Plex Sans, vedno temen, metin poudarek) in zgodovinski slogi iz tabele ERAS spodaj (Antični,
// Renesansa, Hiša modrosti, Indija …). Slog nastavi data-style na <html> (pisava, oblike)
// in osnovne barve; lastne barve uporabnika veljajo nad njimi.
// Iz teh nekaj barv izračunamo vse ostale (robove, sivo besedilo, poudarke …) in pri tem
// pazimo na kontrast, da je besedilo vedno dobro berljivo.
// Nastavitve te naprave so v localStorage pod ključi z imenom aplikacije (»evklid.…« / »evklid_…«).
// Ključe s prejšnjimi imeni (brand.json → legacy; seznam spodaj posodobi scripts/preimenuj.js) enkrat
// prenesemo na trenutno ime, da se nič ne izgubi. theme.js se naloži prvi na vsaki strani.
(function () {
  try {
    const NOW = "evklid";
    const LEGACY = ["kompreno", "stemmind"]; // brand:legacy
    // Po vrsti od najnovejšega imena: če ključ obstaja pod dvema prejšnjima imenoma, obvelja novejši.
    const keys = Object.keys(localStorage);
    for (const old of LEGACY) {
      for (const key of keys) {
        if (!key.startsWith(old + ".") && !key.startsWith(old + "_")) continue;
        const next = NOW + key.slice(old.length);
        if (localStorage.getItem(next) === null) localStorage.setItem(next, localStorage.getItem(key));
        localStorage.removeItem(key);
      }
    }
  } catch {}
})();

// Aplikacija za Android/iOS (mobile/src/app/web.tsx) sama pusti prostor za uro zgoraj in gumbe spodaj, WebView pa
// strani vseeno sporoči ta odmik (env(safe-area-inset-*)). Brez tega je bil nad glavo in pod spodnjo vrstico
// dvojni prazen pas (j 2026-11-04). CSS piše odmik kot var(--varno-zg/--varno-sp, env(…)); v aplikaciji je 0.
(function () {
  try {
    if (!/ EvklidApp\//.test(navigator.userAgent)) return;
    const r = document.documentElement;
    r.classList.add("v-aplikaciji");
    r.style.setProperty("--varno-zg", "0px");
    r.style.setProperty("--varno-sp", "0px");
  } catch {}
})();

(function () {
  const KEY = "evklid.theme";
  // Zgodovinski slogi: VSE o slogu na enem mestu (docs/oblikovanje.md → »Kako dodati novo zgodovinsko temo«).
  //   light/dark: osnovne barve (bg, surface, menu, text, accent; band = barva pasu na kartici dejstev, neobvezno)
  //     in barve okvirja (ui.css → »Okvir«): menu = zgornja in spodnja vrstica, seznam pogovorov, spustni meniji
  //     (v barvi obdobja, lahko tudi temen v svetlem načinu), menuAccent = poudarek na njih (neobvezno, sicer accent),
  //     bar = glave zaslonov in vrstica za pisanje, banner = obvestila (Preizkusni način, Testna verzija, brez povezave)
  //   font: [ime pisave, paket @fontsource-variable/<paket>] samo za h1 in naslove sklopov (besedilo ostane --font)
  //   hero: zasuk odtenka preliva logotipa in kartice Današnji trening (drugi slogi 28°); light/dark.hero = [a, b]
  //     (neobvezno) sta barvi preliva neposredno (npr. lapis → egipčanska modra, ne glede na poudarek), tretja
  //     (neobvezno) je tanek okvir v kartici (zlato; ui.css → --hero-line)
  //   band: [datoteka, širina, višina] vzorca v pasu na vrhu kartice dejstev (public/eras/<slog>/<datoteka>.svg);
  //     isti pas teče ob robovih okvirja, povečan za edge (1 = enako, npr. 1.25)
  //   frieze (neobvezno; ui.css → »Pisani pas«): pas v več barvah namesto enobarvne maske ([širina, višina, oznake] kot
  //     band, barve K B R G Y iz light/dark.frieze, K = obroba z vsaj 3:1 na meniju in vrstici); band ostane ista
  //     oblika kot maska (lastni poudarek, visok kontrast)
  //   glyph: majhna ikona ob naslovu kartice dejstev; motifs: 6–8 risb (črte, viewBox 0 0 64 64), iz katerih
  //     scripts/tapeta.js sestavi tapeta.svg za ozadje zaslonov (ui.css → »Tapeta«); vse datoteke so v public/eras/<slog>/
  //   facts: [predpona ključev i18n, število]: <predpona>.title in <predpona>.f1 … .fN
  //   icons: datoteka ikon obdobja public/eras/<slog>/<icons>.json (scripts/ikone-obdobij.js: map ime ikone → ikona
  //     obdobja in svg); naloži se samo v tem slogu, public/icons.js z njo zamenja ikone vmesnika
  //   Ime v izbiri sloga: ap.style<Slog> in ap.style<Slog>Text (prva črka velika), npr. ap.styleRenesansa.
  //   chat (neobvezno; ui.css → »Klepet obdobja«): videz klepeta, vsak ključ postane atribut na <html>, ki ga ui.css
  //     pozna po imenu (drug slog lahko vzame isto ali doda svojo vrednost): tutor → data-tutor-surface (npr. »papirus«:
  //     mehurček inštruktorja na light/dark.paper), user → data-user-shape (»ostrakon«), frame → data-chat-frame
  //     (»stebri«: pročelje templa ob pozdravu praznega klepeta iz arch.temple, samo antika, j 2026-11-04; »pilon«:
  //     egipčanski pilon iz building), composer → data-composer (»vosek«: polje v okvirju
  //     light/dark.wood). Barve paper in wood preveri check() (besedilo 7:1 tudi na vlaknih, okvir 3:1).
  //   arch (neobvezno; ui.css → »Arhitektura«): steber kot nosilni del okvirja (seznam pogovorov, rob klepeta, stranski
  //     stolpec Učne poti, kapitel na okencih). Deli so notranjost SVG ([širina, višina, oznake]; S = barva črte,
  //     F = polnilo): cap (kapitel), shaft (ploščica debla, ponavlja se navpično), base (baza); theme.js jih obarva za
  //     ozadje (--arch-*) in za meni (--arch-*-m). temple: pročelje ob pozdravu praznega klepeta (pediment, entablature,
  //     column = [kapitel, deblo, baza], stylobate; samo s frame »stebri«), glej temple() spodaj. Brez »stebri« ni
  //     stebrov ob klepetu (seznam pogovorov, rob klepeta), ostanejo okenca in Učna pot.
  //   frame: "stavba" + building (za slog brez chat.frame): pozdrav praznega klepeta v stavbi iz obdobja (isti deli kot
  //     arch.temple: pediment = streha, entablature ali null, column = [vrh, deblo, baza] stolpa, stylobate = podstavek);
  //     stebri so samo za Antični (j, 4. 11.: »v stilu Tadž Mahala za Indijo itd.«). Izjema: chat.frame »pilon« (Egipt)
  //     ima building.front = [širina, višina, oznake], eno risbo z nespremenljivim razmerjem (o = odprtina vrat).
  const ERAS = {
    antik: {
      light: { bg: "#f5f0e8", surface: "#fffcf7", menu: "#efe2d2", text: "#241c15", accent: "#973f1c", bar: "#f6ece0", banner: "#f6e2d1", paper: "#f4e6cb", wood: "#8a5b36" },
      // Temno: črnofiguralna keramika (temna glazura, terakota v robovih in figurah).
      dark: { bg: "#16110d", surface: "#211a14", menu: "#2b1a12", text: "#f2e8da", accent: "#e08a52", bar: "#1d1712", banner: "#3a2418", paper: "#22150d", wood: "#a8764c" },
      font: ["EB Garamond Variable", "eb-garamond"], hero: 6, band: ["meander", 8, 8], edge: 1, glyph: "ikona",
      motifs: ["dorski-steber", "amfora", "sova", "konstrukcija", "jonski-steber", "lovor", "valj-krogla", "pitagora"],
      facts: ["greek", 11], icons: "ikone",
      chat: { tutor: "papirus", user: "ostrakon", frame: "stebri", composer: "vosek" },
      // Vitek jonski steber (20 px): abak in voluti, kanelure, atiška baza. Pročelje ob pozdravu: zatrep 1 : 5,8 z akroteriji
      // in timpanonom (v njem ikona inštruktorja), zobci, friz z meandrom, arhitrav s fascijami, jonski stebri, tri stopnice.
      arch: {
        cap: [20, 13, '<path fill="F" d="M1 1h18v2.2H1z"/><path fill="F" d="M2.4 3.2h15.2c.6 1.5-.2 3.3-1.9 3.6-1.6.3-2.7-.8-2.6-2H6.9c.1 1.2-1 2.3-2.6 2-1.7-.3-2.5-2.1-1.9-3.6z"/><circle cx="4.4" cy="4.9" r=".75" fill="S" stroke="none"/><circle cx="15.6" cy="4.9" r=".75" fill="S" stroke="none"/><path d="M7 6.3c1.8 1.4 4.2 1.4 6 0"/><path fill="F" d="M4.5 9.5h11v1.8h-11z"/><path d="M5 11.3V13M15 11.3V13"/>'],
        shaft: [20, 8, '<path fill="F" stroke="none" d="M5 0h10v8H5z"/><path d="M5 0v8M15 0v8"/><path stroke-opacity=".5" d="M7.5 0v8M10 0v8M12.5 0v8"/>'],
        base: [20, 10, '<path d="M5 0v1.2M15 0v1.2"/><rect fill="F" x="4" y="1.2" width="12" height="2.4" rx="1.2"/><path d="M4.8 3.6c.8.7.8 1.3 0 2h10.4c-.8-.7-.8-1.3 0-2"/><rect fill="F" x="3" y="5.6" width="14" height="2.2" rx="1.1"/><path fill="F" d="M1.5 7.8h17v1.9h-17z"/>'],
        temple: {
          pediment: [600, 126, '<path class="f" d="M300 15c-5-4-6-9 0-13c6 4 5 9 0 13z"/><path class="f" d="M297 15c-6 1-11-2-12-7 5-1 9 2 12 7zM303 15c6 1 11-2 12-7-5-1-9 2-12 7z"/><path class="f" d="M2 118c0-6 3-11 9-13 0 6-3 10-9 13zM598 118c0-6-3-11-9-13 0 6 3 10 9 13z"/><path class="f" d="M0 118 300 14l300 104z"/><path class="t" d="M27.4 118 300 23.5 572.5 118z"/><path class="l" d="M10.6 118 300 17.7 589.3 118"/><path class="f" d="M0 118h600v8H0z"/><path class="l" d="M0 121h600"/>'],
          entablature: [600, 28, '<path class="d" d="M3 2.6h594"/><path class="f" d="M.75 5.5h598.5v12H.75z"/><path class="f" d="M.75 17.5h598.5v9.75H.75z"/><path class="l" d="M.75 21h598.5M.75 24.25h598.5"/>'],
          column: [[50, 22, '<path class="f n" d="M15.5 13h19v6h-19z"/><path d="M15.5 13v6M34.5 13v6"/><path class="f" d="M6 .75h38v3H6z"/><path class="f" d="M9.5 3.75h31V11Q25 13.4 9.5 11z"/><path class="f" d="M15 11.2c3 6 17 6 20 0Q25 13.4 15 11.2z"/><circle class="f" cx="9.5" cy="10" r="6"/><circle class="f" cx="40.5" cy="10" r="6"/><path class="v" d="M15.6 11A5.6 5.6 0 0 0 9.5 5 4.9 4.9 0 0 0 4.7 10 4.2 4.2 0 0 0 9.5 14.1 3.5 3.5 0 0 0 12.9 10 2.9 2.9 0 0 0 9.5 7.1M34.4 11A5.6 5.6 0 0 1 40.5 5 4.9 4.9 0 0 1 45.3 10 4.2 4.2 0 0 1 40.5 14.1 3.5 3.5 0 0 1 37.1 10 2.9 2.9 0 0 1 40.5 7.1"/><circle class="s" cx="9.5" cy="10" r="1.3"/><circle class="s" cx="40.5" cy="10" r="1.3"/><rect class="f" x="14.5" y="18" width="21" height="3.25" rx="1.6"/>'], [22, 100, '<path class="f" d="M1.5 0h19l.75 100H.75z"/><path class="l" d="M6.25 0 5.9 100M11 0v100M15.75 0l.35 100"/>'], [40, 17, '<rect class="f" x="8" y=".75" width="24" height="4" rx="2"/><path class="f" d="M9.5 4.75q2.5 1.75 0 3.5h21q-2.5-1.75 0-3.5z"/><rect class="f" x="5.5" y="8.25" width="29" height="4.5" rx="2.25"/><path class="f" d="M4 12.75h32v3.5H4z"/>']],
          stylobate: [600, 18, '<path class="f" d="M12 .75h576v5.5H12zM6 6.25h588v5.5H6zM.75 11.75h598.5v5.5H.75z"/>'],
        },
      },
    },
    renesansa: {
      light: { bg: "#f3ead8", surface: "#fffaf0", menu: "#ead8bd", text: "#2b1d12", accent: "#9b2335", band: "#a8834a", bar: "#f4e8d2", banner: "#efe0c4" },
      dark: { bg: "#19130c", surface: "#241b12", menu: "#301b16", text: "#f3e7d3", accent: "#ec8f8a", band: "#b8955a", bar: "#1f170f", banner: "#3a2c18" },
      font: ["EB Garamond Variable", "eb-garamond"], hero: 14, band: ["prepletanje", 16, 8], edge: 1.25, glyph: "ikona",
      motifs: ["sestilo", "armila", "vitruvij", "spirala", "kodeks", "perspektiva", "daljnogled", "poliedr"],
      facts: ["era.renesansa", 6], icons: "ikone",
      frame: "stavba",
      // Stavba ob pozdravu: šilasta rebrasta kupola z laterno na bobnu z okroglimi okni (Firence), polkupoli, venec,
      // nizek polkrožni lok s klinastimi kamni; ob strani kamniti robniki (rustika), spodaj podstavek.
      building: {
        pediment: [600, 170, "<path class=\"f\" d=\"M0 136h600v34H0z\"/><path class=\"t\" d=\"M46 170A254 40 0 0 1 554 170z\"/><path d=\"M46 170A254 40 0 0 1 554 170\"/><path class=\"l\" d=\"M34 170A266 52 0 0 1 566 170M54.7 159.6L43.1 156.5M80 150L69.6 144M120.4 141.7L111.9 133.2M173 135.4L167 125M234.3 131.4L231.2 119.8M300 130L300 118M365.7 131.4L368.8 119.8M427 135.4L433 125M479.6 141.7L488.1 133.2M520 150L530.4 144M545.3 159.6L556.9 156.5\"/><path class=\"f\" d=\"M0 122h600v14H0z\"/><path class=\"l\" d=\"M0 126h600\"/><path class=\"f\" d=\"M-4 116h608v6H-4z\"/><path class=\"f\" d=\"M118 116A46 26 0 0 1 210 116z\"/><path class=\"f\" d=\"M390 116A46 26 0 0 1 482 116z\"/><path class=\"f\" d=\"M222 92h156v24H222z\"/><circle class=\"l\" cx=\"252\" cy=\"104\" r=\"6\"/><circle class=\"l\" cx=\"300\" cy=\"104\" r=\"6\"/><circle class=\"l\" cx=\"348\" cy=\"104\" r=\"6\"/><path class=\"f\" d=\"M226 92C230 50 268 30 300 22 332 30 370 50 374 92z\"/><path class=\"l\" d=\"M264 92C267 60 284 36 300 22 316 36 333 60 336 92M300 22v70\"/><path class=\"f\" d=\"M292 10h16v12h-16z\"/><path class=\"f\" d=\"M290 10 300 2l10 8z\"/>"],
        entablature: null,
        column: [[26, 6, "<path class=\"f\" d=\"M.75 .75h24.5v4.5H.75z\"/>"], [24, 100, "<path class=\"f\" d=\"M1.5 0h21v12.5H1.5z\"/><path class=\"f\" d=\"M5 12.5h14v12.5H5z\"/><path class=\"f\" d=\"M1.5 25h21v12.5H1.5z\"/><path class=\"f\" d=\"M5 37.5h14v12.5H5z\"/><path class=\"f\" d=\"M1.5 50h21v12.5H1.5z\"/><path class=\"f\" d=\"M5 62.5h14v12.5H5z\"/><path class=\"f\" d=\"M1.5 75h21v12.5H1.5z\"/><path class=\"f\" d=\"M5 87.5h14v12.5H5z\"/>"], [30, 8, "<path class=\"f\" d=\"M.75 .75h28.5v6.5H.75z\"/>"]],
        stylobate: [600, 18, "<path class=\"f\" d=\"M6 .75h588v7H6zM.75 7.75h598.5v9.5H.75z\"/>"],
      },
    },
    bagdad: {
      light: { bg: "#edf2f0", surface: "#fbfdfc", menu: "#123a43", menuAccent: "#e2b24f", text: "#10272b", accent: "#0f5f68", band: "#b88a2e", bar: "#e4efeb", banner: "#f6edcf" },
      dark: { bg: "#0b1c22", surface: "#11272e", menu: "#0a2e3b", text: "#e9f1ef", accent: "#e2b24f", band: "#c99a3c", bar: "#0e2228", banner: "#2e2a16" },
      font: ["El Messiri Variable", "el-messiri"], hero: 22, band: ["zvezde", 12, 10], edge: 1.2, glyph: "ikona",
      motifs: ["astrolab", "zvezda", "ozvezdje", "lok", "rozeta", "kvadrant", "rokopis", "abak"],
      facts: ["era.bagdad", 6], icons: "ikone",
      frame: "stavba",
      // Stavba ob pozdravu: ivan (velik šilasti lok v pravokotnem pročelju) s pasom zvezd, stopničast zobčast rob,
      // rebrasta kupola; ob strani okrogli opečni stolpi z zobčastim vrhom (palače Abasidov).
      building: {
        pediment: [600, 170, "<path class=\"f\" d=\"M24 72v-6h4v-6h8v6h4v6zM52 72v-6h4v-6h8v6h4v6zM80 72v-6h4v-6h8v6h4v6zM108 72v-6h4v-6h8v6h4v6zM136 72v-6h4v-6h8v6h4v6zM164 72v-6h4v-6h8v6h4v6zM192 72v-6h4v-6h8v6h4v6zM220 72v-6h4v-6h8v6h4v6zM248 72v-6h4v-6h8v6h4v6zM276 72v-6h4v-6h8v6h4v6zM304 72v-6h4v-6h8v6h4v6zM332 72v-6h4v-6h8v6h4v6zM360 72v-6h4v-6h8v6h4v6zM388 72v-6h4v-6h8v6h4v6zM416 72v-6h4v-6h8v6h4v6zM444 72v-6h4v-6h8v6h4v6zM472 72v-6h4v-6h8v6h4v6zM500 72v-6h4v-6h8v6h4v6zM528 72v-6h4v-6h8v6h4v6zM556 72v-6h4v-6h8v6h4v6z\"/><path class=\"f\" d=\"M16 72h568v98H16z\"/><path class=\"l\" d=\"M24 80h552v90M24 170V80\"/><path class=\"s\" d=\"M44 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6zM108 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6zM172 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6zM236 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6zM300 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6zM364 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6zM428 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6zM492 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6zM556 86l1.6 2.4 2.4 1.6-2.4 1.6-1.6 2.4-1.6-2.4-2.4-1.6 2.4-1.6z\"/><path class=\"t\" d=\"M66 170V146C66 128 176 124 236 118 278 114 294 108 300 98 306 108 322 114 364 118 424 124 534 128 534 146v24z\"/><path class=\"l\" d=\"M76 170V148C76 134 180 130 238 126 280 122 294 116 300 108 306 116 320 122 362 126 420 130 524 134 524 148v22\"/><circle class=\"l\" cx=\"46\" cy=\"118\" r=\"7\"/><circle class=\"s\" cx=\"46\" cy=\"118\" r=\"2.2\"/><circle class=\"l\" cx=\"554\" cy=\"118\" r=\"7\"/><circle class=\"s\" cx=\"554\" cy=\"118\" r=\"2.2\"/><path class=\"f\" d=\"M254 46h92v14h-92z\"/><path class=\"f\" d=\"M256 46C256 18 282 8 300 6 318 8 344 18 344 46z\"/><path class=\"l\" d=\"M278 46C278 24 290 12 300 6 310 12 322 24 322 46M300 6v40\"/><circle class=\"s\" cx=\"300\" cy=\"3\" r=\"2.4\"/>"],
        entablature: null,
        column: [[40, 22, "<path class=\"f\" d=\"M4 10h6V4h6v6h8V4h6v6h6v6H4z\"/><path class=\"f\" d=\"M2 16h36v5.25H2z\"/>"], [26, 100, "<path class=\"f\" d=\"M3 0h20v100H3z\"/><path class=\"l\" d=\"M3 12.5h20M3 25h20M3 37.5h20M3 50h20M3 62.5h20M3 75h20M3 87.5h20\"/>"], [34, 12, "<path class=\"f\" d=\"M2 .75h30v10.5H2z\"/>"]],
        stylobate: [600, 18, "<path class=\"f\" d=\"M10 .75h580v7H10zM.75 7.75h598.5v9.5H.75z\"/>"],
      },
    },
    indija: {
      light: { bg: "#fbf1e1", surface: "#fffbf4", menu: "#262d6b", menuAccent: "#f2a64a", text: "#231a2c", accent: "#33408f", band: "#d9822b", bar: "#f9ecd6", banner: "#fbe3c0" },
      dark: { bg: "#13122a", surface: "#1c1a3a", menu: "#221d50", text: "#f3edf7", accent: "#f2a64a", band: "#d98a35", bar: "#171531", banner: "#3a2a16" },
      font: ["Eczar Variable", "eczar"], hero: 14, band: ["lotosi", 12, 10], edge: 1.5, glyph: "ikona",
      motifs: ["lotos", "sunja", "kolo", "steber", "stopnice", "palmov-list", "pav", "rangoli"],
      facts: ["era.indija", 6], icons: "ikone",
      frame: "stavba",
      // Stavba ob pozdravu v slogu Tadž Mahala: čebulasta kupola na bobnu, dva paviljona (čatri), pištak z mogulskim
      // lokom, vogalna stolpiča; ob strani minareti s paviljonom na vrhu (na širokem štirje), spodaj ploščad.
      building: {
        pediment: [600, 180, "<path class=\"f\" d=\"M10 104h580v76H10z\"/><path class=\"l\" d=\"M18 180V112h564v68\"/><path class=\"t\" d=\"M44 180V152C44 138 150 136 220 132 268 129 292 126 300 114 308 126 332 129 380 132 450 136 556 138 556 152v28z\"/><path class=\"l\" d=\"M54 180V154C54 144 154 142 222 138 270 135 292 132 300 122 308 132 330 135 378 138 446 142 546 144 546 154v26\"/><circle class=\"s\" cx=\"34\" cy=\"126\" r=\"3\"/><circle class=\"s\" cx=\"566\" cy=\"126\" r=\"3\"/><path class=\"f\" d=\"M6 98h588v6H6z\"/><path d=\"M14 98V82\"/><path class=\"f\" d=\"M8 82c0-6 4-9 6-11 2 2 6 5 6 11z\"/><path d=\"M586 98V82\"/><path class=\"f\" d=\"M580 82c0-6 4-9 6-11 2 2 6 5 6 11z\"/><path d=\"M139 98V84M161 98V84M150 98V86\"/><path class=\"f\" d=\"M133 80h34v4h-34z\"/><path class=\"f\" d=\"M137 80c-2-10 7-17 13-21 6 4 15 11 13 21z\"/><path d=\"M150 59v-7\"/><path d=\"M439 98V84M461 98V84M450 98V86\"/><path class=\"f\" d=\"M433 80h34v4h-34z\"/><path class=\"f\" d=\"M437 80c-2-10 7-17 13-21 6 4 15 11 13 21z\"/><path d=\"M450 59v-7\"/><path class=\"f\" d=\"M266 82h68v16h-68z\"/><path class=\"l\" d=\"M280 82v16M294 82v16M306 82v16M320 82v16\"/><path class=\"f\" d=\"M268 82C226 74 222 36 300 8 378 36 374 74 332 82z\"/><path d=\"M300 8V0\"/><circle class=\"s\" cx=\"300\" cy=\"3\" r=\"2.2\"/>"],
        entablature: null,
        column: [[40, 44, "<path class=\"f\" d=\"M10 30c-1-12 6-19 10-22 4 3 11 10 10 22z\"/><path d=\"M20 8V2\"/><path class=\"f\" d=\"M6 30h28v4H6z\"/><path d=\"M10 34v6M30 34v6M20 34v6\"/><path class=\"f\" d=\"M4 40h32v4H4z\"/>"], [22, 100, "<path class=\"f\" d=\"M3 0h16v100H3z\"/><path class=\"l\" d=\"M11 0v100\"/>"], [34, 16, "<path class=\"f\" d=\"M6 .75h22v6H6z\"/><path class=\"f\" d=\"M2 6.75h30v8.5H2z\"/>"]],
        stylobate: [600, 18, "<path class=\"f\" d=\"M8 .75h584v7H8zM.75 7.75h598.5v9.5H.75z\"/><path class=\"l\" d=\"M8 4h584\"/>"],
      },
    },
    // Stari Egipt: barve grobnih poslikav. Svetlo papirus in pesek, meni v zlatem peščenjaku, poudarek lapis lazuli;
    // temno nočno nebo nad Nilom (globok lapis), zlat poudarek (zlato na lapisu). Pisani pas: friz kheker (zvezani
    // snopi trstja) nad pasom pisanih pravokotnikov: svetlo črne obrobe (poslikava), temno zlate (vložki v nakitu).
    // Brez verskih simbolov (ne oko, ankh, skarabej, sončni disk, krilati disk, božanstva) in brez hieroglifov.
    egipt: {
      light: { bg: "#f4ead3", surface: "#fffaf0", menu: "#e6cb8e", menuAccent: "#1b3f86", text: "#24190d", accent: "#1d4796", band: "#a2401f", bar: "#f7ecd3", banner: "#f2ddac", paper: "#f4e4bf", wood: "#8c5a26", soft: "#dfe6f4", menuSoft: "#f0dfb5",
        hero: ["#183a82", "#1d5bb4", "#e2b65a"], frieze: { K: "#2a1d10", B: "#2351a8", R: "#b5452a", G: "#2c8a6e", Y: "#dcaa3e" } },
      dark: { bg: "#0c1430", surface: "#141f42", menu: "#13285a", menuAccent: "#ecc25f", text: "#f4ecd9", accent: "#e6b955", band: "#d6a64a", bar: "#101a39", banner: "#1c2852", paper: "#18244a", wood: "#b88a45", soft: "#3a3320", menuSoft: "#3a3320",
        hero: ["#1b3a86", "#2154b0", "#e8c063"], frieze: { K: "#e2b65a", B: "#3466c8", R: "#c55a3c", G: "#38ae9a", Y: "#e2b65a" } },
      font: ["El Messiri Variable", "el-messiri"], hero: 10, band: ["kheker", 36, 16], edge: 1, glyph: "ikona",
      motifs: ["piramide", "papirus", "ladja", "lotos", "paleta", "gos", "vrv", "shaduf"],
      facts: ["era.egipt", 6], icons: "ikone",
      chat: { tutor: "papirus", user: "ostrakon", frame: "pilon", composer: "vosek" },
      // Friz kheker (pas, polna barva; theme.js → friezeUrl): trije snopi trstja (glava, vez, telo) in pas pravokotnikov.
      // Barve K (obroba), B, R, G, Y iz light/dark.frieze; public/eras/egipt/kheker.svg je ista oblika kot maska.
      frieze: [36, 16, '<g stroke="K" stroke-width=".9" stroke-linejoin="round"><path fill="R" d="M0 12.6h9v3.4H0z"/><path fill="G" d="M9 12.6h9v3.4H9z"/><path fill="Y" d="M18 12.6h9v3.4h-9z"/><path fill="B" d="M27 12.6h9v3.4h-9z"/>' +
        [["B", 6], ["R", 18], ["G", 30]].map(([c, x]) => `<path fill="${c}" d="M${x} .3C${x + .6} 1.6 ${x + 2.2} 2.2 ${x + 2} 3.6L${x + 1.5} 4.4H${x - 1.5}L${x - 2} 3.6C${x - 2.2} 2.2 ${x - .6} 1.6 ${x} .3z"/><path fill="Y" d="M${x - 1.9} 4.4h3.8v1.8h-3.8z"/><path stroke-width=".5" d="M${x - 1.9} 5.3h3.8"/><path fill="${c}" d="M${x - 1.2} 6.2h2.4c.6.6 1 2.6.9 4-.1 1-.4 1.8-.7 2.4h-2.8c-.3-.6-.6-1.4-.7-2.4-.1-1.4.3-3.4.9-4z"/>`).join("") + "</g>"],
      // Pilon ob pozdravu (chat.frame »pilon«, ui.css → »Pilon«; j 2026-11-04: stavba iz obdobja, stebri samo v antiki):
      // ena risba z nespremenljivim razmerjem (kot Edfu): stolpa 190 enot široka spodaj in 165 zgoraj (poševni zunanji
      // rob), visoka 213 (venec kavetto z listi, torus zgoraj in po zunanjem robu), na vsakem dve vdolbini z drogovoma in
      // zastavicama; vmes nižji portal (180) z vencem, podboji in preklado, v odprtini vrat ikona inštruktorja; spodaj
      // ploščad. Pozdrav in predlogi pod stavbo. Razred o = odprtina vrat (ui.css). Brez stebrov, krilatega diska in
      // drugih verskih znamenj, brez reliefov in hieroglifov.
      building: (() => {
        const tower = (X) => {
          const r = (x0, x1, y, h, cls, rx) => `<rect class="${cls}" x="${Math.min(X(x0), X(x1))}" y="${y}" width="${Math.abs(x1 - x0)}" height="${h}"${rx ? ` rx="${rx}"` : ""}/>`;
          return `<path class="f" d="M${X(37)} 72H${X(202)}V248H${X(12)}z"/><path class="t" d="M${X(37)} 72H${X(42)}L${X(17)} 248H${X(12)}z"/>` +
            r(70, 80, 86, 162, "t") + r(150, 160, 86, 162, "t") + r(25, 212, 35, 5, "f") +
            `<path class="f" d="M${X(25)} 40H${X(212)}Q${X(204)} 44 ${X(204)} 66H${X(33)}Q${X(33)} 44 ${X(25)} 40z"/>` +
            `<path class="l" d="${Array.from({ length: 18 }, (_, i) => `M${X(42 + i * 9)} 44v21`).join("")}"/>` + r(31, 206, 66, 6, "f", 3) +
            `<path class="l" d="${Array.from({ length: 21 }, (_, i) => `M${X(36 + i * 8.3)} 66.5l${X(3) - X(0)} 5`).join("")}"/>` +
            [75, 155].map((x) => `<path d="M${X(x)} 247V12"/><path class="t" d="M${X(x)} 13l13 4-13 4z"/>`).join("");
        };
        const portal = '<rect class="t" x="202" y="118" width="196" height="130"/><rect class="f" x="206" y="100" width="188" height="4"/>' +
          '<path class="f" d="M206 104h188q-6 3-6 18H212q0-15-6-18z"/><path class="l" d="' + Array.from({ length: 19 }, (_, i) => `M${219 + i * 9} 107v14`).join("") + '"/>' +
          '<rect class="f" x="210" y="122" width="180" height="5" rx="2.5"/><rect class="f" x="214" y="127" width="172" height="121"/>' +
          '<path class="l" d="M256 248V150h88v98"/><rect class="o" x="262" y="156" width="76" height="92"/>';
        return {
          front: [600, 262, tower((x) => x) + tower((x) => 600 - x) + portal + '<rect class="f" x="2" y="248" width="596" height="13"/><path class="l" d="M2 252h596"/>'],
        };
      })(),
      // Papirusov steber (okenca, Učna pot; ne v Inštruktorju, j 2026-11-04: stebri v klepetu samo za antiko): odprt
      // kapitel (zvon s čašnimi listi, abak), deblo iz snopa stebel, odebeljeno vznožje z listi in okrogla baza.
      arch: {
        cap: [20, 13, '<path fill="F" d="M7 .5h6v2H7z"/><path fill="F" d="M1 2.5h18c-.9 3.6-3.3 6.3-5.5 7.5h-7C4.3 8.8 1.9 6.1 1 2.5z"/><path stroke-opacity=".5" d="M5.3 3.2 8.4 10M14.7 3.2 11.6 10M10 2.5V10"/><path fill="F" d="M6.5 10h7v3h-7z"/><path d="M6.5 11.5h7"/>'],
        shaft: [20, 8, '<path fill="F" stroke="none" d="M6.5 0h7v8h-7z"/><path d="M6.5 0v8M13.5 0v8"/><path stroke-opacity=".5" d="M8.8 0v8M11.2 0v8"/>'],
        base: [20, 10, '<path fill="F" d="M6.5 0h7c1.4 1.8 1.6 3.4.9 4.8H5.6c-.7-1.4-.5-3 .9-4.8z"/><path stroke-opacity=".5" d="M7.6 4.8 10 1.4l2.4 3.4"/><rect fill="F" x="2.5" y="5.6" width="15" height="3.6" rx="1.8"/>'],
      },
    },
  };
  const STYLES = ["cist", "igriv", "temen", ...Object.keys(ERAS)];
  // Osnovne barve slogov. Čist je enak privzetim barvam v style.css (brez izračuna).
  const BASES = {
    cist: {
      light: { bg: "#f6f7f9", surface: "#ffffff", menu: "#ffffff", text: "#141821", accent: "#2353d1" },
      dark: { bg: "#0d1117", surface: "#151b23", menu: "#151b23", text: "#e6eaf0", accent: "#6e9bff" },
    },
    igriv: {
      light: { bg: "#fff6ea", surface: "#ffffff", menu: "#ffffff", text: "#1f1a2e", accent: "#6a3bd6" },
      dark: { bg: "#17121f", surface: "#211a2e", menu: "#211a2e", text: "#efeaf8", accent: "#a98bff" },
    },
    temen: {
      light: { bg: "#0d1117", surface: "#151b23", menu: "#151b23", text: "#e6eaf0", accent: "#4cd3a4" },
      dark: { bg: "#0d1117", surface: "#151b23", menu: "#151b23", text: "#e6eaf0", accent: "#4cd3a4" },
    },
  };
  for (const [k, e] of Object.entries(ERAS)) BASES[k] = { light: e.light, dark: e.dark };
  // Tapeta v ozadju je v barvi besedila (ui.css: --wall-c 6 %, na telefonu 7 %, en sloj, črte se ne prekrivajo);
  // kontrast besedila se preverja tudi na podlagi z najmočnejšim deležem.
  const MOTIF = 0.07;
  // Vlakna papirusa (ui.css → »Klepet obdobja«: črte v --paper-fibre); kontrast besedila se preveri tudi na njih.
  const PAPER = 0.1;
  const BASE = BASES.cist;
  const baseOf = (s) => BASES[s && STYLES.includes(s.style) ? s.style : "cist"];
  // Najmanjši kontrast (WCAG): navadno besedilo 7 (AAA), sivo besedilo in poudarki 4.5 (AA).
  const MIN = { text: 7, muted: 4.5, accent: 4.5, onAccent: 4.5 };
  const mq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : { matches: false, addEventListener() {} };

  // ---------- barve ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  function hexToRgb(hex) {
    let h = String(hex || "").trim().replace("#", "");
    if (h.length === 3) h = h.replace(/./g, "$&$&");
    const n = parseInt(h, 16);
    return /^[0-9a-f]{6}$/i.test(h) ? [(n >> 16) & 255, (n >> 8) & 255, n & 255] : null;
  }
  const rgbToHex = (rgb) => "#" + rgb.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("");
  function lum(hex) {
    const [r, g, b] = hexToRgb(hex).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(a, b) {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  }
  function mix(a, b, t) { // t = delež barve b
    const A = hexToRgb(a), B = hexToRgb(b);
    return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
  }
  function toHsl(hex) {
    const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) return [0, 0, l * 100];
    const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s * 100, l * 100];
  }
  function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360; s = clamp(s / 100); l = clamp(l / 100);
    const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return rgbToHex([f(0) * 255, f(8) * 255, f(4) * 255]);
  }
  // Spremeni svetlost barve (ohrani odtenek), dokler ne doseže kontrasta z vsemi podlagami.
  function fit(color, against, min, prefer) {
    const ok = (c) => against.every((bg) => contrast(c, bg) >= min);
    if (ok(color)) return color;
    const [h, s, l] = toHsl(color);
    const darkBg = against.reduce((t, bg) => t + lum(bg), 0) / against.length < 0.18;
    const dir = prefer || (darkBg ? 1 : -1);
    for (const d of [dir, -dir]) {
      for (let x = l; x >= 0 && x <= 100; x += d * 2) {
        const c = hsl(h, s, x);
        if (ok(c)) return c;
      }
    }
    return darkBg ? "#ffffff" : "#000000";
  }
  // Barve za drug, tretji in četrti pomen iste črke na strani (formula-info.js data-fx-tone, ui.css --fx-tone-N):
  // prvi ton leži na osi modra–oranžna stran od poudarka (ločita ju tudi barvno slepi), nato vijolična in zelena,
  // vsak z vsaj 4,5 kontrasta na vseh podlagah (tudi na --accent-soft ob dotiku).
  function tonesOf(accent, on, dark) {
    const [h] = toHsl(accent);
    const far = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b)) >= 45;
    // oranžna le ob modrem in vijoličnem poudarku; zelen in topel poudarek dobita modro (rdeče-zeleno slepi)
    const hues = [h >= 180 && h <= 300 ? 28 : 215];
    const red = h < 30 || h > 330;
    for (const x of [320, 145, 270, 28, 215, 70, 180]) if (hues.length < 3 && far(x, h) && !(red && x === 145) && hues.every((y) => far(x, y))) hues.push(x);
    return hues.map((x) => fit(hsl(x, 85, dark ? 66 : 36), on, MIN.accent));
  }
  // Barva besedila, ki je dobro berljiva na vseh podlagah: najprej poskusi želeno, sicer temno ali svetlo.
  function readable(on, wish, min = MIN.text) {
    if (wish) {
      const f = fit(wish, on, min); // ohrani odtenek, spremeni le svetlost
      if (on.every((bg) => contrast(f, bg) >= min)) return f;
    }
    const tint = toHsl(on[0])[0];
    const dark = hsl(tint, 35, 11), light = hsl(tint, 25, 95);
    const score = (c) => Math.min(...on.map((bg) => contrast(c, bg)));
    const best = score(dark) >= score(light) ? dark : light;
    return score(best) >= MIN.text ? best : score("#000000") >= score("#ffffff") ? "#000000" : "#ffffff";
  }
  const onColor = (bg) => (contrast("#ffffff", bg) >= contrast("#0b1020", bg) ? "#ffffff" : "#0b1020");
  // Sivo besedilo: čim bolj umirjeno, a še vedno berljivo.
  function mutedOf(text, on) {
    for (let t = 0.42; t >= 0; t -= 0.04) {
      const c = mix(text, on[0], t);
      if (on.every((bg) => contrast(c, bg) >= MIN.muted)) return c;
    }
    return text;
  }

  // Svetla podlaga izbranega (--accent-soft): v zgodovinskih slogih (text podan) manj poudarka, dokler poudarek (4,5)
  // in besedilo (7) na njej nista berljiva (izbrani zavihek, izbrani pogovor, žetoni v barvi obdobja).
  function softOf(on, accent, t, text) {
    let soft = mix(on, accent, t);
    while (text && t > 0.05 && (contrast(accent, soft) < MIN.accent || contrast(text, soft) < MIN.text)) soft = mix(on, accent, (t -= 0.02));
    return soft;
  }

  // ---------- nastavitve ----------
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { style: STYLES.includes(s.style) ? s.style : "cist", mode: ["light", "dark", "system"].includes(s.mode) ? s.mode : "system", accent: hexToRgb(s.accent) ? s.accent : null, light: s.light || null, dark: s.dark || null };
    } catch {
      return { style: "cist", mode: "system", accent: null, light: null, dark: null };
    }
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    apply(s);
    window.dispatchEvent(new CustomEvent("evklid:theme", { detail: s }));
  }
  const isDarkMode = (s) => s.style === "temen" || s.mode === "dark" || (s.mode === "system" && mq.matches);

  // Iz nekaj izbranih barv izračuna vse spremenljivke. Vrne null, če ni lastnih barv.
  function compute(s) {
    const key = isDarkMode(s) ? "dark" : "light";
    const pal = s[key] || {};
    // Čist brez lastnih barv = privzete barve iz style.css; drugi slogi se izračunajo iz svojih osnovnih barv.
    const custom = Object.keys(pal).some((k) => hexToRgb(pal[k])) || s.accent || (s.style && s.style !== "cist");
    if (!custom) return null;
    const base = baseOf(s)[key];
    const pick = (k) => (hexToRgb(pal[k]) ? pal[k] : base[k]);
    const bg = pick("bg"), surface = pick("surface");
    const menu = hexToRgb(pal.menu) ? pal.menu : hexToRgb(pal.surface) ? surface : base.menu;
    const dark = lum(bg) < 0.18;
    const era = ERAS[s.style];
    // Okvir zgodovinskega sloga (glave zaslonov, vrstica za pisanje, obvestila); z lastnimi okni ostane barva oken.
    const ownWin = hexToRgb(pal.surface) || hexToRgb(pal.menu);
    const chrome = era && !ownWin ? [base.bar, base.banner].filter((x) => hexToRgb(x)) : [];
    // Izbrano pisavo spoštujemo, dokler je berljiva (4.5); samodejno izbrana mora doseči 7.
    // Klepet obdobja (ERAS[…].chat): papirus pod odgovori inštruktorja in les okvirja polja za pisanje.
    // Z lastnimi barvami oken (tudi »naključne barve«) je papirus v barvi okna, vlakna v barvi besedila.
    const paper = era && era.chat ? (ownWin ? surface : hexToRgb(base.paper) ? base.paper : null) : null;
    const textOn = [bg, surface, ...chrome, ...(paper ? [paper] : [])];
    const text = hexToRgb(pal.text) ? readable(textOn, pal.text, MIN.muted) : readable(textOn, base.text);
    // Zgodovinski slogi: podlaga pod motivi (ozadje in kartice z MOTIF deleža besedila) mora biti prav tako berljiva.
    const motifBg = era ? [mix(bg, text, MOTIF), mix(surface, text, MOTIF)] : [];
    // Papir: vlakna (PAPER deleža lesa) in temnejši papir za kodo in glavo tabele (+6 % besedila).
    const paperBg = paper ? [paper, mix(paper, (!ownWin && base.wood) || text, PAPER), mix(paper, text, 0.06)] : [];
    const onBg = [surface, bg, ...chrome, ...motifBg, ...paperBg];
    const accent = fit(s.accent || base.accent, onBg, MIN.accent);
    const [ah, as] = toHsl(accent);
    // Zgodovinski slogi zasukajo odtenek preliva za svoj »hero« (Antični 6°: ostane v terakoti), drugi za 28°;
    // light/dark.hero = [a, b] določi preliv neposredno (z lastnim poudarkom spet poudarek).
    const heroPair = era && !s.accent && Array.isArray(base.hero) && base.hero.slice(0, 2).every(hexToRgb) ? base.hero : null;
    const heroA = fit(heroPair ? heroPair[0] : accent, ["#ffffff"], MIN.onAccent, -1);
    const heroB = heroPair ? fit(heroPair[1], ["#ffffff"], MIN.onAccent, -1) : fit(hsl(ah + (era ? era.hero : 28), Math.max(as, 60), toHsl(heroA)[2] + 6), ["#ffffff"], MIN.onAccent, -1);
    const accentText = onColor(accent);
    const vars = {
      "--bg": bg,
      "--surface": surface,
      "--text": text,
      "--muted": mutedOf(text, onBg),
      "--surface-2": mix(mix(surface, text, dark ? 0.08 : 0.05), accent, dark ? 0.06 : 0.07),
      "--border": mix(surface, text, dark ? 0.16 : 0.12),
      "--accent": accent,
      "--accent-2": mix(accent, surface, 0.2),
      "--accent-grad": hsl(ah + 28, as, toHsl(accent)[2]),
      "--accent-soft": (era && !s.accent && hexToRgb(base.soft)) ? base.soft : softOf(surface, accent, dark ? 0.22 : 0.13, era && text),
      "--accent-text": accentText,
      "--hero-a": heroA,
      "--hero-b": heroB,
      "--user-bubble": accent,
      "--user-text": accentText,
    };
    if (heroPair && hexToRgb(heroPair[2])) vars["--hero-line"] = heroPair[2];
    tonesOf(accent, [...onBg, vars["--accent-soft"]], dark).forEach((c, i) => (vars[`--fx-tone-${i + 1}`] = c));
    // Pas na kartici dejstev v barvi obdobja (zlato, žafran …), malo potopljen v okno, da ne vpije.
    if (era && base.band && !s.accent) vars["--band-c"] = mix(surface, base.band, 0.75);
    if (chrome.length) {
      if (hexToRgb(base.bar)) vars["--bar"] = base.bar;
      if (hexToRgb(base.banner)) vars["--banner"] = base.banner;
    }
    // Pas ob robovih okvirja: barva pasu obdobja (z lastnim poudarkom poudarek), dovolj izrazita na meniju in glavi.
    if (era) vars["--edge-c"] = fit(base.band && !s.accent ? base.band : accent, [menu, vars["--bar"] || surface], 3);
    // Pisani pas (ERAS[…].frieze): barve obdobja; obroba K mora biti vidna (3:1) na meniju in vrstici. Z lastnim
    // poudarkom ostane enobarvni pas v poudarku.
    let frieze = null;
    if (era && era.frieze && base.frieze && !s.accent) {
      frieze = {};
      for (const k of ["K", "B", "R", "G", "Y"]) frieze[k] = hexToRgb(base.frieze[k]) ? base.frieze[k] : vars["--edge-c"];
      frieze.K = fit(frieze.K, [menu, vars["--bar"] || surface], 3);
      vars["--frieze"] = friezeUrl(era.frieze, frieze);
    }
    if (paper) Object.assign(vars, { "--paper": paper, "--paper-2": paperBg[2], "--paper-fibre": paperBg[1] });
    // Les (okvir voščene tablice, zvitka papirusa): kot rob vnosnega polja vsaj 3:1 na vrstici in oknu.
    if (era && era.chat) vars["--wood"] = fit(hexToRgb(base.wood) && !ownWin ? base.wood : accent, [vars["--bar"] || surface, surface], 3);
    // Meniji: lastna podlaga, besedilo in poudarek se prilagodita njej. V zgodovinskem slogu je na seznamu
    // pogovorov tudi tapeta (menuMotif), zato mora besedilo doseči 7 tudi tam.
    let menuMotif = [];
    if (menu.toLowerCase() !== surface.toLowerCase()) {
      // Temen meni v svetlem načinu (ali obratno): besedilo iz druge različice sloga, ne izbledela barva besedila.
      const mWishText = era && !hexToRgb(pal.text) && lum(menu) < 0.18 !== dark ? era[dark ? "light" : "dark"].text : text;
      let mText = readable([menu], mWishText, era ? MIN.text : contrast(text, menu) >= MIN.muted ? MIN.muted : MIN.text);
      if (era) {
        menuMotif = [mix(menu, mText, MOTIF)];
        mText = readable([menu, ...menuMotif], mText, MIN.text);
        menuMotif = [mix(menu, mText, MOTIF)];
      }
      const mOn = [menu, ...menuMotif];
      const mWish = era && base.menuAccent && !s.accent && !hexToRgb(pal.menu) ? base.menuAccent : accent;
      const mAccent = fit(mWish, mOn, MIN.accent);
      // Neobvezna lastna podlaga izbranega (ERAS[…].light/dark.soft, menuSoft), kadar mešanica poudarka in podlage posivi (Egipt).
      const mSoft = era && !s.accent && !hexToRgb(pal.menu) && hexToRgb(base.menuSoft) ? base.menuSoft : softOf(menu, mAccent, lum(menu) < 0.18 ? 0.24 : 0.14, era && mText);
      Object.assign(vars, {
        "--menu": menu,
        "--menu-text": mText,
        "--menu-muted": mutedOf(mText, era ? [...mOn, mSoft] : mOn),
        "--menu-2": mix(menu, mText, 0.08),
        "--menu-border": mix(menu, mText, 0.14),
        "--menu-accent": era ? fit(mAccent, [...mOn, mSoft], MIN.accent) : mAccent,
        "--menu-accent-soft": mSoft,
      });
      if (era) vars["--menu-accent-text"] = onColor(vars["--menu-accent"]);
    }
    // Stebri (ERAS[…].arch): deli kot SVG v barvi pasu, malo potopljeni v podlago (okras, ne vsebina).
    if (era && era.arch) {
      const edge = vars["--edge-c"];
      const paint = (on, suffix) => {
        const S = mix(on, edge, dark ? 0.7 : 0.62), F = mix(on, dark ? text : "#ffffff", dark ? 0.05 : 0.55);
        for (const k of ["cap", "shaft", "base"]) if (era.arch[k]) vars[`--arch-${k}${suffix}`] = archUrl(era.arch[k], S, F);
      };
      paint(bg, "");
      paint(vars["--menu"] || menu, "-m");
    }
    return { vars, dark, menu, text, bg, surface, accent, motifBg, chrome, menuMotif, paperBg, frieze, era: !!era };
  }

  // Pisani pas kot slika: oznake K B R G Y v risbi (fill="B", stroke="K") postanejo barve načina.
  function friezeUrl([w, h, body], colors) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body.replace(/"([KBRGY])"/g, (m, k) => `"${colors[k]}"`)}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  // Del stebra kot slika: preserveAspectRatio="none" in črta, ki se ne razteguje.
  function archUrl([w, h, body], S, F) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" fill="none" stroke="${S}" stroke-width="1" stroke-linejoin="round"><style>*{vector-effect:non-scaling-stroke}</style>${body.replace(/"S"/g, `"${S}"`).replace(/"F"/g, `"${F}"`)}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  // Pročelje (ERAS[…].arch.temple ali ERAS[…].building) okrog pozdrava praznega klepeta (app.js, ui.css → »Klepet obdobja«): deli kot
  // vrstični SVG, barve iz ui.css po razredih (f polnilo, t timpanon, l tanka črta, s pika, d zobci), zato sledijo
  // načinu in lastnim barvam. Zatrep (pediment) se veča enakomerno s širino, entablatura in stopnice (stylobate) se
  // raztegnejo po širini, deblo stebra (column[1]) po višini; kapitel in baza ostaneta v naravni velikosti.
  function temple(id) {
    const e = ERAS[id];
    const t = e && ((e.arch && e.arch.temple) || e.building);
    if (!t) return null;
    const svg = (cls, [w, h, body], fit) =>
      `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${fit || "none"}"${fit ? ` width="${w}" height="${h}"` : ""} aria-hidden="true" focusable="false">${body}</svg>`;
    // Stavba kot ena risba (building.front, npr. pilon): nespremenljivo razmerje, brez stebrov in stopnic.
    if (t.front) return { top: svg("t-part t-front", t.front, "xMidYMax meet"), bottom: "" };
    const [cap, shaft, base] = t.column;
    const col = (n) => `<div class="t-part t-col t${n}" aria-hidden="true">${svg("t-cap", cap, "xMidYMin")}${svg("t-shaft", shaft)}${svg("t-base", base, "xMidYMax")}</div>`;
    return {
      top: svg("t-part t-roof", t.pediment, "xMidYMax") + (t.entablature ? `<div class="t-part t-ent" aria-hidden="true">${svg("", t.entablature)}</div>` : ""),
      bottom: [1, 2, 3, 4].map(col).join("") + svg("t-part t-steps", t.stylobate),
    };
  }
  const ARCH_VARS = ["cap", "shaft", "base"].flatMap((k) => [`--arch-${k}`, `--arch-${k}-m`]);
  const ALL_VARS = [...ARCH_VARS, "--frieze", "--hero-line", "--paper", "--paper-2", "--paper-fibre", "--wood", "--bg", "--surface", "--text", "--muted", "--surface-2", "--border", "--accent", "--accent-2", "--accent-grad", "--accent-soft", "--accent-text", "--hero-a", "--hero-b", "--user-bubble", "--user-text", "--menu", "--menu-text", "--menu-muted", "--menu-2", "--menu-border", "--menu-accent", "--menu-accent-soft", "--menu-accent-text", "--band-c", "--edge-c", "--bar", "--banner", "--fx-tone-1", "--fx-tone-2", "--fx-tone-3"];
  const ERA_VARS = ["--era-font", "--band", "--band-w", "--band-h", "--edge-w", "--edge-h", "--glyph", "--tapeta"];
  const CHAT_ATTRS = { tutor: "data-tutor-surface", user: "data-user-shape", frame: "data-chat-frame", composer: "data-composer", arch: "data-arch" };
  const eraUrl = (id, f) => `url("/eras/${id}/${f}.svg")`;
  // Pisava sloga (/vendor/<paket>/index.css) se doda le enkrat; brskalnik prenese datoteke šele, ko jih rabi.
  function loadFont(pkg) {
    if (!pkg || document.querySelector(`link[data-font="${pkg}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = `vendor/${pkg}/index.css`;
    l.dataset.font = pkg;
    document.head.appendChild(l);
  }
  // Ikone obdobja (icons.js): ena zahteva na slog, začne se že ob prvem izrisu v <head>.
  const iconSets = {};
  function iconSet(id) {
    const era = ERAS[id];
    if (!era || !era.icons || typeof fetch !== "function") return Promise.resolve(null);
    return (iconSets[id] ||= fetch(`/eras/${id}/${era.icons}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((j) => (j && j.map && j.svg ? j : (delete iconSets[id], null))));
  }
  function applyEra(root, id) {
    const era = ERAS[id];
    const prev = root.dataset.era || "";
    for (const v of ERA_VARS) root.style.removeProperty(v);
    // Klepet obdobja in stebri: atributi, po katerih ui.css izbere videz (brez njih ostane klepet kot v Čistem).
    for (const [k, attr] of Object.entries(CHAT_ATTRS)) {
      const v = k === "arch" ? era && era.arch && id : (era && era.chat && era.chat[k]) || (k === "frame" && era && era.building && era.frame);
      if (v) root.setAttribute(attr, v); else root.removeAttribute(attr);
    }
    if (era) {
      root.dataset.era = id;
      iconSet(id);
      loadFont(era.font[1]);
      root.style.setProperty("--era-font", `"${era.font[0]}"`);
      root.style.setProperty("--band", eraUrl(id, era.band[0]));
      root.style.setProperty("--band-w", era.band[1] + "px");
      root.style.setProperty("--band-h", era.band[2] + "px");
      // Pas ob robovih okvirja je lahko malo večji (edge; meander ostane 8 px, da so črte ostre).
      root.style.setProperty("--edge-w", era.band[1] * (era.edge || 1) + "px");
      root.style.setProperty("--edge-h", era.band[2] * (era.edge || 1) + "px");
      root.style.setProperty("--glyph", eraUrl(id, era.glyph));
      root.style.setProperty("--tapeta", eraUrl(id, "tapeta"));
    } else root.removeAttribute("data-era");
    // Menjava sloga brez ponovnega nalaganja: icons.js zamenja ikone.
    if (prev !== (era ? id : "")) window.dispatchEvent(new CustomEvent("evklid:era", { detail: era ? id : "" }));
  }

  function apply(s = load()) {
    const root = document.documentElement;
    root.dataset.style = STYLES.includes(s.style) ? s.style : "cist";
    applyEra(root, s.style);
    const c = compute(s);
    for (const v of ALL_VARS) root.style.removeProperty(v);
    const dark = c ? c.dark : isDarkMode(s);
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
    if (c) for (const [k, v] of Object.entries(c.vars)) root.style.setProperty(k, v);
    // Pisani pas (ui.css → »Pisani pas«): slika namesto maske samo, ko jo compute() nastavi.
    if (c && c.vars["--frieze"]) root.setAttribute("data-frieze", ""); else root.removeAttribute("data-frieze");
    const meta = document.querySelector('meta[name="theme-color"]');
    const top = c ? c.menu : isDarkMode(s) ? baseOf(s).dark.menu : baseOf(s).light.menu;
    if (meta) meta.setAttribute("content", top);
    // Nameščena aplikacija (Android) pobarva spodnjo sistemsko vrstico z barvo iz manifesta: ista kot meni.
    const link = document.querySelector('link[rel="manifest"]');
    if (link) {
      try {
        const u = new URL(link.getAttribute("href") || "/manifest.webmanifest", location.href);
        u.searchParams.set("barva", top);
        u.searchParams.set("ozadje", c ? c.bg : baseOf(s)[dark ? "dark" : "light"].bg);
        link.setAttribute("href", u.pathname + u.search);
      } catch {}
    }
  }

  // ---------- naključne barve ----------
  const rnd = (a, b) => a + Math.random() * (b - a);
  const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function randomAccent(s = load()) {
    const key = isDarkMode(s) ? "dark" : "light";
    const pal = s[key] || {};
    const against = [hexToRgb(pal.surface) ? pal.surface : baseOf(s)[key].surface, hexToRgb(pal.bg) ? pal.bg : baseOf(s)[key].bg];
    const current = s.accent ? toHsl(s.accent)[0] : -999;
    let h;
    do h = rnd(0, 360); while (Math.abs(((h - current + 540) % 360) - 180) < 40);
    return fit(hsl(h, rnd(62, 88), key === "dark" ? 66 : 46), against, MIN.accent);
  }
  // Celotna paleta za trenutni način: ozadje, okna, meniji in pisava v istem odtenku, poudarek v drugem.
  function randomPalette(s = load()) {
    const darkMode = isDarkMode(s);
    for (let i = 0; i < 40; i++) {
      const h = rnd(0, 360);
      const pal = darkMode
        ? {
            bg: hsl(h, rnd(18, 45), rnd(6, 10)),
            surface: hsl(h, rnd(16, 38), rnd(12, 17)),
            text: hsl(h, rnd(15, 40), rnd(92, 97)),
          }
        : {
            bg: hsl(h, rnd(25, 70), rnd(91, 96)),
            surface: hsl(h, rnd(20, 70), rnd(98, 100)),
            text: hsl(h, rnd(25, 55), rnd(9, 16)),
          };
      pal.menu = choice([
        pal.surface,
        darkMode ? hsl(h, rnd(20, 45), rnd(9, 13)) : hsl(h, rnd(35, 75), rnd(87, 93)),
        darkMode ? hsl(h, rnd(35, 60), rnd(20, 26)) : hsl(h, rnd(35, 60), rnd(15, 24)),
      ]);
      const accent = fit(hsl(h + choice([150, 180, 210, 35, -35]), rnd(62, 88), darkMode ? 66 : 46), [pal.surface, pal.bg], MIN.accent);
      const c = compute({ ...s, accent, [darkMode ? "dark" : "light"]: pal });
      if (c && check(c)) return { pal, accent };
    }
    return { pal: null, accent: null };
  }
  // Preveri vse pare besedila in podlage.
  function check(c) {
    const v = c.vars;
    const pairs = [
      [v["--text"], c.bg, MIN.text], [v["--text"], c.surface, MIN.text],
      [v["--muted"], c.surface, MIN.muted], [v["--accent"], c.surface, MIN.accent], [v["--accent"], c.bg, MIN.accent],
      [v["--accent-text"], v["--accent"], MIN.onAccent],
      ...(c.motifBg || []).flatMap((m) => [[v["--text"], m, MIN.text], [v["--muted"], m, MIN.muted], [v["--accent"], m, MIN.accent]]), ["#ffffff", v["--hero-a"], MIN.onAccent], ["#ffffff", v["--hero-b"], 3],
    ];
    if (v["--menu"]) pairs.push([v["--menu-text"], v["--menu"], MIN.text], [v["--menu-accent"], v["--menu"], MIN.accent]);
    // Zgodovinski slogi: okvir (glave, vrstica za pisanje, obvestila), žetoni v barvi poudarka in tapeta na meniju.
    for (const b of c.chrome || []) pairs.push([v["--text"], b, MIN.text], [v["--muted"], b, MIN.muted], [v["--accent"], b, MIN.accent]);
    // Papirus pod odgovori (tudi vlakna in koda/glava tabele) in les okvirja polja za pisanje.
    for (const p of c.paperBg || []) pairs.push([v["--text"], p, MIN.text], [v["--muted"], p, MIN.muted], [v["--accent"], p, MIN.accent]);
    // Pisani pas: obroba (črna poslikava, zlati vložki) vidna na meniju in vrstici.
    if (c.frieze && v["--menu"]) pairs.push([c.frieze.K, v["--menu"], 3], [c.frieze.K, v["--bar"] || c.surface, 3]);
    if (v["--wood"]) pairs.push([v["--wood"], v["--bar"] || c.surface, 3], [v["--wood"], c.surface, 3]);
    if (c.era) {
      pairs.push([v["--accent"], v["--accent-soft"], MIN.accent], [v["--text"], v["--accent-soft"], MIN.text]);
      if (v["--menu"]) {
        const soft = v["--menu-accent-soft"];
        for (const m of [v["--menu"], ...(c.menuMotif || [])]) pairs.push([v["--menu-text"], m, MIN.text], [v["--menu-muted"], m, MIN.muted], [v["--menu-accent"], m, MIN.accent]);
        pairs.push([v["--menu-accent"], soft, MIN.accent], [v["--menu-text"], soft, MIN.text], [v["--menu-muted"], soft, MIN.muted], [v["--menu-accent-text"], v["--menu-accent"], MIN.onAccent]);
      }
    }
    return pairs.every(([a, b, m]) => contrast(a, b) >= m - 0.01);
  }

  window.STEMTheme = { load, save, apply, compute, tonesOf, check, contrast, randomAccent, randomPalette, isDarkMode, BASE, BASES, STYLES, ERAS, baseOf, MIN, MOTIF, PAPER, readable, loadFont, iconSet, temple };
  apply();
  mq.addEventListener?.("change", () => apply());
})();

// Lahki način pred prvim izrisom (da se spletna pisava sploh ne prenese): zadnja izbira na tej
// napravi ("evklid.lite" = "1" / "0") ali, če je ni, varčevanje s podatki / počasna povezava.
(function () {
  let saved = null;
  try {
    saved = localStorage.getItem("evklid.lite");
  } catch {}
  const c = navigator.connection;
  const auto = !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || "")));
  if (saved === "1" || (saved === null && auto)) document.documentElement.classList.add("lite");
})();

// Pisava besedila izbranega sloga takoj (preload), ne šele ko brskalnik prebere CSS: besedilo se ne
// preriše z drugo pisavo pozneje (brez premikov postavitve). Samo Čist/Igriv/Temen (zgodovinski slogi imajo
// isto pisavo besedila kot Čist) in nikoli v lahkem načinu (tam spletne pisave sploh ni).
(function () {
  try {
    const r = document.documentElement;
    if (r.classList.contains("lite") || !document.head || !/^\/(index\.html)?$/.test(location.pathname)) return; // samo aplikacija
    const pkg = { igriv: "nunito", temen: "ibm-plex-sans" }[r.dataset.style] || "instrument-sans";
    for (const sub of ["latin", "latin-ext"]) {
      const l = document.createElement("link");
      l.rel = "preload";
      l.as = "font";
      l.type = "font/woff2";
      l.crossOrigin = "anonymous";
      l.href = `/vendor/${pkg}/files/${pkg}-${sub}-wght-normal.woff2`;
      document.head.append(l);
    }
  } catch {}
})();
