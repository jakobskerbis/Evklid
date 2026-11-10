// Učbenik za tiskanje (server/textbook-print.js): gumb »Shrani kot PDF« in samodejni tisk (#natisni).
// Ločena datoteka zaradi politike CSP (brez vrinjenih skript in onclick).
// Gumb brez id="natisni": sicer bi #natisni v povezavi pomaknil stran h gumbu in naslov skril pod vrstico.
// V brskalniku, ki ne zna tiskati (public/ucbenik-priprava.js), se samodejni tisk ne sproži.
document.querySelector(".bar button")?.addEventListener("click", () => print());
if (location.hash === "#natisni" && !window.__tiskNe) addEventListener("load", () => setTimeout(() => print(), 300));
