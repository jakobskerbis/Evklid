// Pomen črk v fiziki, kemiji in biologiji (kontrolni pregled PR 463 §4): te napake so bile že na main.
// Raje nič kot napačno: dvoumna črka velja le, ko jo potrdi formula, enota ali tema.
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { Marked } from "marked";
import { createRenderer } from "../public/rich.js";
import { annotateTex, withFormulaSubject } from "../public/formula-data.js";
import { cardFor, configureCard } from "../public/formula-card.js";
import SL from "../public/i18n/sl.js";

configureCard({ katex, t: (k, v = {}) => String(SL[k] || k).replace(/\{(\w+)\}/g, (_, n) => v[n] ?? "") });
const fx = createRenderer({ marked: new Marked(), katex, sanitize: (h) => h, annotate: (tex, o) => annotateTex(tex, undefined, o) });
const codes = (html) => [...html.matchAll(/data-fx="([^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/\./g, "%")));
// Imena vseh pomenov črke v besedilu (brez oznak lekcije: kartice, naloge, klepet).
const names = (subject, topic, text, key) =>
  codes(withFormulaSubject(subject, () => fx.renderRich(text), null, topic))
    .filter((c) => c.split(":")[2] === key)
    .map((c) => cardFor(c)?.label?.replace(/<[^>]+>/g, "") || "");
const none = (s, t, x, k) => assert.deepEqual(names(s, t, x, k), [], `${k} v »${x}«`);
const has = (s, t, x, k, re) => {
  const n = names(s, t, x, k);
  assert.ok(n.length && n.every((l) => re.test(l)), `${k} v »${x}«: ${n.join(" / ") || "–"}`);
};

test("fizika: F, a, c, t, E, A, T, B, G, S po kontekstu", () => {
  none("FIZ", "Lom svetlobe", "Gorišče $F$ leče je $a_1 = 8\\,\\mathrm{cm}$ od nje, slika pa $a_2$.", "F");
  none("FIZ", "Lom svetlobe", "Predmet je $a_1 = 8\\,\\mathrm{cm}$ od leče.", "a_1");
  none("FIZ", "Gostota", "Kvader: $V = a \\cdot b \\cdot c$.", "c");
  none("FIZ", "Gostota", "Kvader: $V = a \\cdot b \\cdot c$.", "a");
  has("FIZ", "Temperatura in raztezanje", "Velja $T = t + 273\\,\\mathrm{K}$.", "t", /temperatura/);
  has("FIZ", "Plinska enačba", "Pri $t_1 = 37\\,^\\circ\\mathrm{C}$ je plin topel.", "t", /temperatura/);
  none("FIZ", "Torzija", "Ravnovesje: $T_A a = T_B b$.", "a");
  none("FIZ", "Torzija", "Ravnovesje: $T_A a = T_B b$.", "T_A");
  none("FIZ", "Torzija", "Raztezek palice je $FL/(EA)$.", "E");
  none("FIZ", "Torzija", "Raztezek palice je $FL/(EA)$.", "A");
  none("FIZ", "Vlažen zrak", "Velja $c_{p,z} = 1{,}0$.", "c_p,z");
  none("FIZ", "Magnetni krogi", "Presek jedra je $a \\times b$.", "a");
  none("FIZ", "Notranje sile v nosilcih", "Podpora $B$ nosi nosilec.", "B");
  none("FIZ", "Drugi zakon termodinamike", "Velja $\\Delta G = \\Delta H - T \\Delta S$.", "G");
  none("FIZ", "Drugi zakon termodinamike", "Velja $\\Delta G = \\Delta H - T \\Delta S$.", "S");
  // Pravilni pomeni ostanejo.
  has("FIZ", "Enakomerno pospešeno gibanje", "Pospešek $a = 2\\,\\mathrm{m/s^2}$ in $v = v_0 + a t$.", "a", /pospešek/);
  has("FIZ", "Newtonovi zakoni", "Velja $F = m a$.", "a", /pospešek/);
  has("FIZ", "Newtonovi zakoni", "Velja $F = m a$.", "F", /sila/);
  has("FIZ", "Enakomerno gibanje", "Čas je $t = 5\\,\\mathrm{s}$.", "t", /čas/);
  has("FIZ", "Svetloba", "Velja $c = \\lambda \\nu$.", "c", /svetlob/);
  has("FIZ", "Specifična toplota", "Velja $Q = m c \\Delta T$.", "c", /specifična toplota/);
  has("FIZ", "Magnetno polje", "Gostota je $B = 0{,}5\\,\\mathrm{T}$.", "B", /magnetnega/);
  has("FIZ", "Gibalna količina", "Velja $G = m v$.", "G", /gibalna/);
  has("FIZ", "Tlak", "Tlak je $p = F/S$.", "S", /ploščina/);
});

test("kemija: p⁺, n⁰, lupina, Q < K, R, S, w, t v °C", () => {
  none("KEM", "Zgradba atoma", "Proton $p^+$ in nevtron $n^0$.", "p");
  none("KEM", "Zgradba atoma", "Proton $p^+$ in nevtron $n^0$.", "n");
  none("KEM", "Zgradba atoma", "Elektron je v lupini $n = 4$.", "n");
  has("KEM", "Kemijsko ravnotežje", "Ker je $Q < K$, poteka reakcija v desno.", "Q", /reakcijski kvocient/);
  has("KEM", "Termokemija", "Sprejeta toplota je $Q = m c \\Delta T$.", "Q", /toplota/);
  has("KEM", "Plinska enačba", "Velja $pV = nRT$.", "R", /plinska konstanta/);
  has("KEM", "Plinska enačba", "Velja $pV = nRT$.", "n", /množina/);
  has("KEM", "Plinska enačba", "Velja $pV = nRT$.", "p", /tlak/);
  has("KEM", "Plinska enačba", "Pri $t = 25\\,^\\circ\\mathrm{C}$.", "t", /temperatura/);
  has("KEM", "Entropija", "Velja $\\Delta G = \\Delta H - T\\Delta S$.", "S", /entropija/);
  has("KEM", "Raztopine", "Masni delež je $w = \\frac{m_1}{m}$.", "w", /masni delež/);
});

test("biologija: črke iz kemije le s formulo ali enoto", () => {
  none("BIO", "Statistika v biologiji", "Ker je $p < 0{,}05$, je razlika značilna.", "p");
  none("BIO", "Dedovanje", "Križanje $Vv \\times Vv$.", "V");
  none("BIO", "Raziskovanje v biologiji", "Poskus ponovimo $n = 3$-krat.", "n");
  none("BIO", "Evolucija", "Garnitura $4n$.", "n");
  none("BIO", "Evolucija", "Relativni fitnes $w = W/W_{max}$.", "w");
  none("BIO", "Evolucija", "Razmerje $R = p/q$.", "R");
  none("BIO", "Mikrobna rast", "Substrat $S$ se porablja.", "S");
  none("BIO", "Uravnavanje izražanja genov", "Gen $lacI$ in $c$.", "c");
  has("BIO", "Celica", "Raztopina ima $c = 0{,}1\\,\\mathrm{mol/L}$.", "c", /koncentracija/);
  has("BIO", "Celica", "Vzorec ima $V = 2\\,\\mathrm{mL}$.", "V", /prostornina/);
  has("BIO", "Celica", "Masa je $m = 5\\,\\mathrm{g}$.", "m", /masa/);
  has("BIO", "Fotosinteza", "Konstanta $K_a$ kisline.", "K_a", /kisline/);
});

test("pravilni pomeni ostanejo: n v kemiji, a z indeksom, čas v biologiji", () => {
  has("KEM", "Statistična obdelava rezultatov", "Iz vzorca dobimo $n = 0{,}01\\,\\mathrm{mol}$ in $m = n \\cdot M$.", "n", /množina/);
  none("KEM", "Statistična obdelava rezultatov", "Opravili smo $n=10$ meritev.", "n");
  none("KEM", "Elementi p-bloka", "Konfiguracija $ns^2\\,np^2$.", "n");
  none("KEM", "Elementi p-bloka", "Konfiguracija $ns^2\\,np^2$.", "p");
  has("FIZ", "Enakomerno kroženje", "Velja $a_r = \\dfrac{v^2}{r}$.", "a", /pospešek/);
  has("FIZ", "Newtonovi zakoni", "Velja $a_2 = F/m_2$.", "a", /pospešek/);
  has("BIO", "Organski sistemi živali", "Čas je $t = 1\\,\\mathrm{dan}$.", "t", /čas/);
});
