// Maturitetni poskus (načrt laboratorija, faza 3; docs/laboratorij.md »Maturitetni poskus«). Tretji način ob »Vodeno | Prosto«:
// učenec dobi nalogo z neznano količino (vzorec X), meri sam brez korakov in odda rezultat z enoto in napako meritve.
// Točke izračuna program po zgledu maturitetnega točkovnika: meritve (iz stanja poskusa, kot vodeni koraki), rezultat
// (odmik od prave vrednosti, ki jo pozna model poskusa), enota in napaka meritve. AI ne ocenjuje (postopek oceni
// inštruktor šele v fazi 4, profil B). Najboljši rezultat ostane na napravi; strežnik šteje le oddaje brez učenca.
//
// Naloga v public/sim/matura/<ključ>.js (default export):
//   naslov, naloga (besedilo v slogu mature), kolicina (»c(HCl)«),
//   enote: [[ime, faktor v pravo enoto ali null, če je napačna količina], …] (prva je prava),
//   tol: relativna natančnost za vse točke rezultata (umerjena s simulacijo skrbnega dijaka, glej test),
//   resnica(B): prava vrednost v pravi enoti iz modela poskusa (motor ga izpostavi kot mount._labBench),
//   meritve: [{ kaj, tock, ok(c) }] (c = lab-vodeno.js → kontekst; skupaj 4 točke),
//   izMeritev(c): ista količina, izračunana iz učenčeve tabele po metodi iz naloge (v pravi enoti); rezultat dobi točke le,
//     če se z njo ujema na 2·tol (sicer bi znana vrednost brez meritev dobila vse točke). Po oddaji se pokaže.
//   skrij: [selektorji], ki bi med nalogo pokazali izračunan rezultat (motor jih po oddaji spet pokaže),
//   priprava?(mount): po novem vzorcu (npr. izbere vzorec X).
//   niResnice?: opozorilo, ko prave vrednosti še ni (npr. grelec še ni segreval), resnica(B) vrne NaN.
import { h, button } from "./kit.js";
import { parseStevilo, num } from "./lab.js";

export const TOCKE = { rezultat: 4, enota: 1, napaka: 1 }; // + meritve (4) = 10
const KLJUC = "evklid.lab.matura";

// Točke za rezultat po relativnem odmiku: tol → 4, 2·tol → 3, 3·tol → 2, 5·tol → 1.
export function tockeRezultata(odmik, tol) {
  if (!Number.isFinite(odmik)) return 0;
  for (const [k, t] of [[1, 4], [2, 3], [3, 2], [5, 1]]) if (odmik <= k * tol + 1e-12) return t;
  return 0;
}

// Ocena oddaje. vnos = { rezultat, enota, napaka } (besedila iz polj), resnica v pravi enoti, c = kontekst poskusa.
// Vrne { postavke: [{ kaj, tock, max, opomba }], tocke, max, x, dx, odmik }.
export function oceni(def, vnos, resnica, c) {
  const postavke = [];
  for (const m of def.meritve) {
    let ok = false;
    try {
      ok = !!m.ok(c);
    } catch {}
    postavke.push({ kaj: m.kaj, tock: ok ? m.tock : 0, max: m.tock });
  }
  const enota = def.enote.find((e) => e[0] === vnos.enota);
  const f = enota?.[1] ?? null;
  const x0 = parseStevilo(vnos.rezultat), dx0 = parseStevilo(vnos.napaka);
  const x = x0 != null && f != null ? x0 * f : null;
  const dx = dx0 != null && f != null ? Math.abs(dx0 * f) : null;
  const odmik = x != null && resnica ? Math.abs(x - resnica) / Math.abs(resnica) : NaN;
  // Rezultat mora izhajati iz učenčevih meritev (izMeritev: isti račun iz tabele): znana vrednost (g, 9,81; napis 100 Ω)
  // brez ustreznih meritev ne prinese točk. Razlika do 2·tol je dovoljena (druga metoda, zaokroževanje).
  let mer = NaN;
  if (def.izMeritev)
    try {
      mer = Number(def.izMeritev(c));
    } catch {}
  const neujema = !!def.izMeritev && x != null && !(Number.isFinite(mer) && Math.abs(x - mer) <= 2 * def.tol * Math.abs(mer) + 1e-12);
  const tr = neujema ? 0 : tockeRezultata(odmik, def.tol);
  postavke.push({
    kaj: "Rezultat",
    tock: tr,
    max: TOCKE.rezultat,
    opomba: x == null
      ? x0 == null ? "Ni številke." : "Enota ne ustreza količini."
      : neujema
        ? Number.isFinite(mer) ? "Rezultat se ne ujema s tvojimi meritvami." : "Iz tvojih meritev tega rezultata še ni mogoče izračunati."
        : `Odmik od prave vrednosti ${num(odmik * 100, 1)}\u00a0%.`,
  });
  postavke.push({ kaj: "Enota", tock: f != null ? TOCKE.enota : 0, max: TOCKE.enota, opomba: f != null ? "" : enota ? "Enota ne ustreza količini." : "Enota ni izbrana." });
  // Napaka meritve: prava vrednost leži v intervalu x ± Δx in Δx ni nesmiselno velik (največ 4·tol rezultata).
  const okNap = x != null && dx > 0 && Math.abs(x - resnica) <= dx * (1 + 1e-9) && dx <= 4 * def.tol * Math.abs(x);
  postavke.push({
    kaj: "Napaka meritve",
    tock: okNap ? TOCKE.napaka : 0,
    max: TOCKE.napaka,
    opomba: okNap ? "" : !(dx > 0) ? "Napake nisi zapisal." : dx > 4 * def.tol * Math.abs(x ?? 0) ? "Napaka je prevelika za tako meritev." : "Prava vrednost ni v intervalu rezultat ± napaka.",
  });
  return { postavke, tocke: postavke.reduce((a, p) => a + p.tock, 0), max: postavke.reduce((a, p) => a + p.max, 0), x, dx, odmik, mer };
}

// Najboljši rezultat na napravi: { [ključ]: { tocke, max, t } }.
export function najboljsi(key) {
  try {
    return JSON.parse(localStorage.getItem(KLJUC) || "{}")?.[key] || null;
  } catch {
    return null;
  }
}
function shraniNajboljsi(key, r) {
  try {
    const vse = JSON.parse(localStorage.getItem(KLJUC) || "{}") || {};
    const prej = vse[key];
    if (!prej || r.tocke / r.max > prej.tocke / prej.max) vse[key] = { tocke: r.tocke, max: r.max, t: Date.now() };
    localStorage.setItem(KLJUC, JSON.stringify(vse));
  } catch {}
}

// Kartica naloge v lab-vodeno.js (namesto kartice korakov). kontekst() vrne c za meritve; onOddaj(r) ob oddaji.
// faza: "uvod" (naloga in »Začni nalogo«), "tece" (meritve, oddaja), "oddano" (točke, prava vrednost, »Nova naloga«).
export function maturaKartica({ mount, key, def, kontekst, onZacni, onOddaj }) {
  let faza = "uvod", ocena = null, resnica = NaN, zaganjam = false;
  let ctl = null; // kontrole poskusa po zadnji pripravi: drug element pomeni, da je poskus zgrajen znova
  const kontrole = () => mount.querySelector(".lab-tit-top .demo-controls") || mount.querySelector(".demo-controls");
  const el = h("section", { class: "lab-vod lab-mat", "aria-label": "maturitetni poskus" });
  const rez = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "lab-tit-in", "aria-label": `rezultat ${def.kolicina}` });
  const nap = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "lab-tit-in", "aria-label": "napaka meritve (absolutna, ±)" });
  const enota = h("select", { "aria-label": "enota rezultata" }, h("option", { value: "" }, "izberi"), ...def.enote.map(([e]) => h("option", { value: e }, e)));
  const opozorilo = h("p", { class: "lab-why", "aria-live": "polite", hidden: true });

  // Med nalogo so skriti izračunani rezultati poskusa (račun, preverjanje, sklepi), po oddaji spet vidni.
  const SPLOSNO = [".lab-racun", ".lab-q", ".lab-notes"]; // opombe navajajo vrednosti iz literature (n, F, Eₐ …)
  function skrij() {
    const naj = faza === "tece";
    for (const sel of [...SPLOSNO, ...(def.skrij || [])])
      for (const x of mount.querySelectorAll(sel)) if (!x.closest(".lab-vod-wrap")) x.classList.toggle("lab-mat-skrito", naj);
  }

  async function zacni() {
    if (zaganjam) return;
    zaganjam = true;
    try {
      // Nov vzorec: meritve se pozabijo in poskus se postavi znova z novim semenom (lab.js → shramba, sim/index.js).
      await mount._labZnova?.();
      faza = "tece";
      ocena = null;
      rez.value = nap.value = enota.value = "";
      opozorilo.hidden = true;
      onZacni?.();
      def.priprava?.(mount);
      ctl = kontrole();
    } finally {
      zaganjam = false;
    }
    render();
  }

  function oddaj() {
    const B = mount._labBench;
    resnica = B ? def.resnica(B) : NaN;
    if (parseStevilo(rez.value) == null) return opozori(`Vpiši rezultat kot število (npr. ${def.zgled || "0,0985"}).`);
    if (!enota.value) return opozori("Izberi enoto rezultata.");
    if (!Number.isFinite(resnica)) return opozori(def.niResnice || "Poskus se še ni naložil. Poskusi znova.");
    ocena = oceni(def, { rezultat: rez.value, enota: enota.value, napaka: nap.value }, resnica, kontekst());
    faza = "oddano";
    shraniNajboljsi(key, ocena);
    onOddaj?.(ocena);
    render();
  }
  function opozori(t) {
    opozorilo.hidden = false;
    opozorilo.className = "lab-why";
    opozorilo.textContent = t;
  }
  rez.addEventListener("keydown", (e) => e.key === "Enter" && oddaj());
  nap.addEventListener("keydown", (e) => e.key === "Enter" && oddaj());

  const tockovnik = () =>
    h("details", { class: "lab-vod-namig" }, h("summary", {}, "Točkovnik"),
      h("ul", { class: "lab-mat-tock" },
        ...def.meritve.map((m) => h("li", {}, `${m.kaj} (${m.tock}\u00a0t.)`)),
        h("li", {}, `Rezultat: vse točke, če se od prave vrednosti razlikuje za največ ${num(def.tol * 100, 1)}\u00a0% (${TOCKE.rezultat}\u00a0t.)`),
        h("li", {}, `Prava enota (${TOCKE.enota}\u00a0t.)`),
        h("li", {}, `Napaka meritve: prava vrednost leži v intervalu rezultat ± napaka (${TOCKE.napaka}\u00a0t.)`)));

  function render() {
    skrij();
    const best = najboljsi(key);
    const kids = [h("div", { class: "lab-vod-head" }, h("span", { class: "lab-vod-oznaka" }, faza === "oddano" ? "Maturitetni poskus: oddano" : "Maturitetni poskus"))];
    if (faza === "uvod") {
      kids.push(h("h3", {}, def.naslov), h("p", {}, def.naloga),
        h("p", { class: "lab-vod-kaj" }, "Meriš sam, brez korakov. Ob začetku dobiš nov vzorec, dosedanje meritve tega poskusa se pobrišejo."),
        tockovnik());
      if (best) kids.push(h("p", { class: "muted" }, `Tvoj najboljši rezultat: ${best.tocke} od ${best.max} točk.`));
      kids.push(h("div", { class: "demo-buttons" }, button("Začni nalogo", () => zacni(), "primary small")));
    } else if (faza === "tece") {
      kids.push(h("h3", {}, def.naslov), h("p", {}, def.naloga), tockovnik(),
        h("div", { class: "lab-mat-polja" },
          h("label", { class: "lab-tit-field" }, h("span", { class: "demo-slider-label" }, `rezultat ${def.kolicina}`), rez),
          h("label", { class: "lab-tit-field" }, h("span", { class: "demo-slider-label" }, "enota"), enota),
          h("label", { class: "lab-tit-field" }, h("span", { class: "demo-slider-label" }, "napaka meritve ±"), nap)),
        h("p", { class: "muted" }, "Napako zapiši v isti enoti kot rezultat, na primer 0,0985 ± 0,0010."),
        h("div", { class: "demo-buttons" }, button("Oddaj rezultat", () => oddaj(), "primary small")), opozorilo);
    } else {
      const e = def.enote[0][0];
      kids.push(h("h3", {}, `${ocena.tocke} od ${ocena.max} točk`),
        h("p", {}, `Tvoj rezultat: ${def.kolicina} = ${rez.value.trim()}${nap.value.trim() ? ` ± ${nap.value.trim()}` : ""}\u00a0${enota.value}.`),
        ...(Number.isFinite(ocena.mer) ? [h("p", {}, `Iz tvojih meritev: ${def.kolicina} = ${num(ocena.mer, def.dec ?? 4)}\u00a0${e}.`)] : []),
        h("p", {}, `Prava vrednost: ${def.kolicina} = ${num(resnica, def.dec ?? 4)}\u00a0${e}.`),
        h("ul", { class: "lab-mat-ocena" },
          ...ocena.postavke.map((p) => h("li", { class: p.tock === p.max ? "ok" : p.tock ? "" : "bad" },
            h("b", {}, `${p.kaj}: ${p.tock}/${p.max}`), p.opomba ? ` ${p.opomba}` : ""))),
        h("p", { class: "muted" }, "Postopek (enačbe, povprečje, graf) ta ocena ne zajame: na maturi ga oceni učitelj."),
        h("div", { class: "demo-buttons" }, button("Nova naloga", () => zacni(), "primary small")));
    }
    el.replaceChildren(...kids);
  }

  render();
  return {
    el,
    get faza() {
      return faza;
    },
    // Ob vsakem pregledu (lab-vodeno.js → tick): poskus lahko kontrole nariše znova, zato skrivanje ponovimo.
    tick: skrij,
    // Poskus je zgrajen znova (»↺ Ponastavi« med nalogo): nov vzorec, zato znova priprava (npr. vzorec X, odtehtan vzorec).
    znova: () => {
      const c = kontrole();
      if (faza !== "tece" || zaganjam || c === ctl) return;
      ctl = c;
      def.priprava?.(mount);
    },
    // Ob odhodu iz načina »Matura«: vse spet vidno, naloga ostane, kot je.
    pokazi: () => mount.querySelectorAll(".lab-mat-skrito").forEach((x) => x.classList.remove("lab-mat-skrito")),
    render,
  };
}
