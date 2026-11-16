// Učbenik za tiskanje (server/textbook-print.js): gumb »Shrani kot PDF« in samodejni tisk (#natisni).
// Ločena datoteka zaradi politike CSP (brez vrinjenih skript in onclick).
// Gumb brez id="natisni": sicer bi #natisni v povezavi pomaknil stran h gumbu in naslov skril pod vrstico.
// V brskalniku, ki ne zna tiskati (public/ucbenik-priprava.js), se samodejni tisk ne sproži.
document.querySelector(".bar button")?.addEventListener("click", () => print());
if (location.hash === "#natisni" && !window.__tiskNe) addEventListener("load", () => setTimeout(() => print(), 300));

// Samo zaslon (j 16. 11., telefon): modra vrstica ostane nad formulami (KaTeX ima position: relative), široka skica
// (<pre>) ali predolga formula v vrstici se pomika sama in ne zamakne cele strani vstran (gumb je ostal napol
// zunaj zaslona). Pravila so tu in ne v lupini strani, da se zgoščena vrednost predloge PDF ne spremeni
// (server/ucbenik-pdf.js pdfTemplateHash: sprememba bi razveljavila vse vnaprej izdelane PDF-je); tisk jih ne vidi.
const css = document.createElement("style");
css.textContent = `@media screen {
  .bar { z-index: 5; }
  main pre { overflow-x: auto; }
  main .tisk-siroka { display: inline-block; max-width: 100%; overflow-x: auto; overflow-y: hidden; vertical-align: middle; }
}`;
document.head.append(css);
function siroke() {
  const main = document.querySelector("main");
  if (!main || matchMedia("print").matches) return;
  const right = main.getBoundingClientRect().right - parseFloat(getComputedStyle(main).paddingRight);
  for (const k of main.querySelectorAll(".katex:not(.katex-display .katex)")) if (k.getBoundingClientRect().right > right + 1) k.classList.add("tisk-siroka");
}
addEventListener("load", siroke);
