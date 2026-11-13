// Naloge pri biologiji (OŠ 8. in 9. razred, gimnazija 1.–4. letnik).
// 1) Izbirna vprašanja iz naborov za razvrščanje: vsaka tema dobi nabore, ki jih ima njena
//    simulacija »uvrsti« v public/sim/katalog.js (1. stopnja dve možnosti, 2. vse, 3. obratno vprašanje).
// 2) Računske naloge: križanje, spolno vezano dedovanje, krvne skupine, Hardy-Weinberg,
//    energijska piramida, populacije, mikroskop, DNA, površina in prostornina celice, statistika.
import { SIM_TOPICS } from "../../../public/sim/katalog.js";
import { cross } from "../../../public/sim/bio.js";
import { sortTask } from "./nar.js";
import { withMistakes, choicesWhy } from "./mat.js";

const lvl = (level) => Math.min(3, Math.max(1, level || 1));
const fmtN = (x, d = 2) => String(Math.round(x * 10 ** d) / 10 ** d).replace(".", ",");
const pctNum = (value, mistakes = [], decimals = 2) => withMistakes({ type: "number", value, unit: "%", decimals, unitAlternatives: ["odstotkov"] }, mistakes);
const num = (value, unit, decimals = 2, mistakes = []) => withMistakes({ type: "number", value, ...(unit ? { unit } : {}), decimals }, mistakes);

// ------------------------------------------------------------ razvrščanje
const SORT = Object.entries(SIM_TOPICS)
  .filter(([id]) => id.startsWith("BIO-"))
  .map(([id, v]) => [id, (Array.isArray(v[0]) ? v : [v]).filter((x) => x[0] === "uvrsti").map((x) => x[2].set)])
  .filter(([, sets]) => sets.length);

const SORT_GENERATORS = SORT.map(([topic, sets]) => ({
  id: `bio-${topic.split("/")[0].slice(4).toLowerCase()}-${topic.split("/")[1]}`,
  topics: [topic],
  gen(level, r) {
    return sortTask(r.pick(sets), lvl(level), r);
  },
}));

// ------------------------------------------------------------ križanje
const share = (res, test) => res.cells.filter(test).length / res.n;
const punnett = (res) => `Gamete: ${res.ga.map((g) => g.join("")).join(", ")} in ${res.gb.map((g) => g.join("")).join(", ")}; kombinacije: ${res.cells.join(", ")}.`;

// [pri kom, dominantna lastnost (tožilnik), recesivna lastnost (tožilnik)]
const ORGS = [
  ["morskih prašičkih", "črno dlako", "belo dlako"],
  ["grahu", "rumeno barvo semen", "zeleno barvo semen"],
  ["paradižniku", "rdečo barvo plodov", "rumeno barvo plodov"],
  ["vinski mušici", "normalna krila", "zakrnela krila"],
  ["mačkah", "kratko dlako", "dolgo dlako"],
];

function krizanje(level, r, { di }) {
  const L = lvl(level);
  if (L === 3 && di) {
    const [p1, p2] = r.pick([["AaBb", "AaBb"], ["AaBb", "aabb"], ["AaBb", "Aabb"], ["AaBB", "aaBb"]]);
    const res = cross("di", p1, p2);
    const ask = r.pick([["aabb", (c) => c === "aabb", "z obema recesivnima lastnostma (aabb)"], ["A_B_", (c) => c.includes("A") && c.includes("B"), "z obema dominantnima lastnostma"]]);
    const v = 100 * share(res, ask[1]);
    return {
      text: `Gena A in B ležita na različnih kromosomih, A in B sta dominantna. Križamo ${p1} × ${p2}. Kolikšen delež potomcev je ${ask[2]}?`,
      answer: pctNum(v, [[v === 6.25 ? 25 : 6.25, p1 === p2 ? "Pri dveh genih je 16 enako verjetnih kombinacij (4 × 4 gamete), ne 4." : "Gena obravnavaj posebej: izračunaj delež za vsak gen in ju zmnoži."], [100 - v, "Izračunal si delež preostalih potomcev."]]),
      hint: "Gena se dedujeta neodvisno: izračunaj verjetnost za vsak gen posebej in ju zmnoži.",
      data: { given: [`\\text{starš 1} = ${p1}`, `\\text{starš 2} = ${p2}`], find: [`d(\\text{${ask[0].replace(/_/g, "\\_")}})`] },
      formula: "P(A \\text{ in } B) = P(A) \\cdot P(B)",
      solution: `${punnett(res)}\nDelež je ${res.cells.filter(ask[1]).length}/${res.n} = ${fmtN(v)} %.`,
    };
  }
  if (L >= 2 && r.int(0, 1)) {
    // nepopolna dominanca
    const [p1, p2] = r.pick([["Rr", "Rr"], ["Rr", "rr"], ["RR", "Rr"]]);
    const res = cross("vmesno", p1, p2);
    const v = 100 * share(res, (c) => c === "Rr");
    return {
      text: `Pri nočni lepotici je rdeča barva cveta (RR) nepopolno dominantna nad belo (rr), heterozigoti (Rr) so rožnati. Križamo ${p1} × ${p2}. Kolikšen delež potomcev ima rožnate cvetove?`,
      answer: pctNum(v, [[75, "Pri nepopolni dominanci heterozigot ni rdeč: rožnati so le Rr."], [100 - v, "To je delež potomcev, ki niso rožnati."]]),
      hint: "Nariši Punnettov kvadrat in preštej polja Rr.",
      data: { given: [`\\text{starš 1} = ${p1}`, `\\text{starš 2} = ${p2}`], find: ["d(Rr)"] },
      formula: false,
      solution: `${punnett(res)}\nRožnati so Rr: ${res.cells.filter((c) => c === "Rr").length}/${res.n} = ${fmtN(v)} %.`,
    };
  }
  const [who, dom, rec] = r.pick(ORGS);
  if (L === 3 && !di) {
    const [pp, desc] = r.pick([["Aa × Aa", `približno tri četrtine potomcev ima ${dom}, ena četrtina ${rec}`], ["Aa × aa", `polovica potomcev ima ${dom}, polovica ${rec}`], ["AA × aa", `vsi potomci imajo ${dom}, eden od staršev pa ima ${rec}`]]);
    const why = {
      "Aa × Aa": "Pri Aa × Aa je razmerje 3 : 1.",
      "Aa × aa": "Pri Aa × aa je razmerje 1 : 1.",
      "AA × aa": "Pri AA × aa so vsi potomci Aa z dominantnim fenotipom.",
      "AA × Aa": "Pri AA × Aa imajo vsi potomci dominantni fenotip in noben starš ni recesiven.",
      "aa × aa": "Pri aa × aa imajo vsi potomci recesivni fenotip.",
    };
    const ch = choicesWhy(r, pp, Object.keys(why).filter((k) => k !== pp).map((k) => [k, why[k]]));
    return {
      text: `Pri ${who} je alel A za ${dom} dominanten nad alelom a za ${rec}. Pri križanju dveh staršev ${desc}. Kakšna sta genotipa staršev?`,
      answer: { type: "choice", ...ch },
      hint: "Razmerje 3 : 1 pomeni dva heterozigota, 1 : 1 pa heterozigota in recesivnega homozigota.",
      data: false,
      formula: false,
      solution: `${why[pp]}\nGenotipa staršev: ${pp}.`,
    };
  }
  const [p1, p2] = r.pick(L === 1 ? [["Aa", "Aa"], ["Aa", "aa"]] : [["Aa", "Aa"], ["AA", "Aa"], ["Aa", "aa"], ["AA", "aa"]]);
  const res = cross("mono", p1, p2);
  const ask = L === 1 ? "rec" : r.pick(["rec", "dom", "het"]);
  const test = { rec: (c) => c === "aa", dom: (c) => c.includes("A"), het: (c) => c === "Aa" }[ask];
  const what = { rec: `${rec} (recesivni fenotip, aa)`, dom: `${dom} (dominantni fenotip)`, het: "genotip Aa (heterozigoti)" }[ask];
  const v = 100 * share(res, test);
  return {
    text: `Pri ${who} je alel A za ${dom} dominanten nad alelom a za ${rec}. Križamo ${p1} × ${p2}. Kolikšen delež potomcev ima ${what}?`,
    answer: pctNum(v, [[100 - v, "To je delež preostalih potomcev."], [ask === "dom" ? 50 : 75, ask === "dom" ? `Tudi Aa ima ${dom}: dominantni alel se izrazi že v enem izvodu.` : "Preštej le polja, ki ustrezajo vprašanju."]]),
    hint: "Vsak starš da gameto z enim alelom. Nariši Punnettov kvadrat 2 × 2.",
    data: { given: [`\\text{starš 1} = ${p1}`, `\\text{starš 2} = ${p2}`], find: [`d(\\text{${ask === "het" ? "Aa" : ask === "rec" ? "aa" : "A\\_"}})`] },
    formula: false,
    solution: `${punnett(res)}\nUstreza ${res.cells.filter(test).length} od ${res.n} polj: ${fmtN(v)} %.`,
  };
}

// ------------------------------------------------------------ dedovanje na X in krvne skupine
function xVezano(level, r) {
  const L = lvl(level);
  const dis = r.pick(["Barvna slepota", "Hemofilija"]);
  const sick = dis === "Barvna slepota" ? "barvno slep" : "bolan s hemofilijo";
  if (L === 3) {
    const ch = choicesWhy(r, "$X^BX^b$", [
      ["$X^BX^B$", "Mati $X^BX^B$ bi vsem sinovom dala zdrav $X^B$."],
      ["$X^bX^b$", "Mati $X^bX^b$ bi bila bolna, naloga pa pravi, da je zdrava."],
      ["$X^BY$", "Mati nima kromosoma Y."],
    ]);
    return {
      text: `${dis} je recesivna, gen je na kromosomu X. Zdrava starša imata sina, ki je ${sick}. Kakšen genotip ima mati?`,
      answer: { type: "choice", ...ch },
      hint: "Sin dobi kromosom X samo od matere, od očeta dobi Y.",
      data: false,
      formula: false,
      solution: `Sin ima $X^bY$: alel $X^b$ je dobil od matere. Ker je mati zdrava, ima še zdrav alel: $X^BX^b$ (prenašalka).`,
    };
  }
  const [mo, fa] = r.pick(L === 1 ? [["XBXb", "XBY"], ["XBXB", "XbY"]] : [["XBXb", "XBY"], ["XBXb", "XbY"], ["XbXb", "XBY"]]);
  const res = cross("x", mo, fa);
  const show = (g) => g.replace(/XB/g, "X^B").replace(/Xb/g, "X^b");
  const showM = (g) => `$${show(g)}$`;
  const sons = res.cells.filter((c) => c.includes("Y"));
  const daughters = res.cells.filter((c) => !c.includes("Y"));
  const q = L === 1 ? "son" : r.pick(["son", "child", "daughterCarrier"]);
  let v, what, solv;
  if (q === "son") {
    v = (100 * sons.filter((c) => c.includes("Xb")).length) / sons.length;
    what = `da bo njun sin ${sick}`;
    solv = `Sinovi dobijo Y od očeta in en X od matere: ${sons.map(showM).join(", ")}. Bolni so ${sons.filter((c) => c.includes("Xb")).length} od ${sons.length}.`;
  } else if (q === "child") {
    v = (100 * res.cells.filter((c) => (c.includes("Y") ? c.includes("Xb") : c === "XbXb")).length) / res.n;
    what = `da bo njun otrok (sin ali hči) ${sick}`;
    solv = `Vsi potomci: ${res.cells.map(showM).join(", ")}. Bolni so sinovi z $X^b$ in hčere $X^bX^b$.`;
  } else {
    v = (100 * daughters.filter((c) => c === "XBXb").length) / daughters.length;
    what = "da bo njuna hči prenašalka (zdrava, z alelom $X^b$)";
    solv = `Hčere: ${daughters.map(showM).join(", ")}. Prenašalke so $X^BX^b$.`;
  }
  return {
    text: `${dis} je recesivna, gen je na kromosomu X. Mati ima genotip $${show(mo)}$, oče $${show(fa)}$. Kolikšna je verjetnost, ${what}?`,
    answer: pctNum(v, [[25, "Vprašanje se nanaša le na sinove (ali le na hčere), ne na vse otroke."], [50, "Upoštevaj, da sin dobi od očeta Y, ne X."], [0, "Tudi zdrava mati je lahko prenašalka."]]),
    hint: "Sin dobi X od matere in Y od očeta. Hči dobi X od obeh.",
    data: { given: [`\\text{mati} = ${show(mo)}`, `\\text{oče} = ${show(fa)}`], find: ["P"] },
    formula: false,
    solution: `${solv}\nVerjetnost: ${fmtN(v)} %.`,
  };
}

const ABO = { AA: "A", Ai: "A", BB: "B", Bi: "B", AB: "AB", ii: "0" };
const aboTex = (g) => g.split("").map((a) => (a === "i" ? "i" : `I^${a}`)).join("");
function krvne(level, r) {
  const L = lvl(level);
  const pairs = L === 1 ? [["Ai", "Bi"], ["AA", "ii"], ["AB", "ii"]] : [["Ai", "Bi"], ["AB", "Ai"], ["AB", "AB"], ["Ai", "Ai"], ["Bi", "ii"], ["AB", "Bi"]];
  const [p1, p2] = r.pick(pairs);
  const res = cross("krvne", p1, p2);
  const groups = res.cells.map((c) => ABO[c]);
  if (L === 3) {
    const all = ["A", "B", "AB", "0"];
    const no = all.filter((g) => !groups.includes(g));
    if (no.length) {
      const right = no[0];
      const ch = choicesWhy(r, `skupina ${right}`, all.filter((g) => groups.includes(g)).map((g) => [`skupina ${g}`, `Skupina ${g} je mogoča: nastane iz kombinacije ${res.cells.filter((c) => ABO[c] === g).map(aboTex).map((x) => `$${x}$`).join(", ")}.`]));
      return {
        text: `Starša imata genotipa $${aboTex(p1)}$ in $${aboTex(p2)}$. Katere krvne skupine njun otrok ne more imeti?`,
        answer: { type: "choice", ...ch },
        hint: "Napiši gamete obeh staršev in vse štiri kombinacije. Iᴬ in Iᴮ sta kodominantna, i je recesiven.",
        data: false,
        formula: false,
        solution: `Kombinacije: ${res.cells.map(aboTex).map((x) => `$${x}$`).join(", ")} → skupine ${[...new Set(groups)].join(", ")}. Skupina ${right} ni mogoča.`,
      };
    }
  }
  const want = r.pick([...new Set(groups)]);
  const v = (100 * groups.filter((g) => g === want).length) / groups.length;
  return {
    text: `Starša imata genotipa $${aboTex(p1)}$ in $${aboTex(p2)}$. Kolikšna je verjetnost, da ima njun otrok krvno skupino ${want}?`,
    answer: pctNum(v, [[want === "AB" ? 0 : 50, want === "AB" ? "Iᴬ in Iᴮ sta kodominantna: otrok IᴬIᴮ ima skupino AB." : "Preštej vse štiri kombinacije gamet."], [100 - v, "To je verjetnost za druge skupine."]]),
    hint: "Vsak starš da en alel. Iᴬ in Iᴮ sta kodominantna, i je recesiven proti obema.",
    data: { given: [`\\text{starš 1} = ${aboTex(p1)}`, `\\text{starš 2} = ${aboTex(p2)}`], find: [`P(\\text{${want}})`] },
    formula: false,
    solution: `Kombinacije: ${res.cells.map((c) => `$${aboTex(c)}$ (${ABO[c]})`).join(", ")}.\nSkupina ${want}: ${groups.filter((g) => g === want).length}/4 = ${fmtN(v)} %.`,
  };
}

// ------------------------------------------------------------ Hardy-Weinberg
function hardyWeinberg(level, r) {
  const L = lvl(level);
  if (L === 1) {
    const p = r.pick([0.6, 0.7, 0.8, 0.9, 0.5, 0.4]);
    const q = Math.round((1 - p) * 10) / 10;
    const ask = r.pick(["AA", "aa", "Aa"]);
    const v = 100 * (ask === "AA" ? p * p : ask === "aa" ? q * q : 2 * p * q);
    return {
      text: `V populaciji v Hardy-Weinbergovem ravnovesju je pogostost alela A enaka p = ${fmtN(p, 1)}. Kolikšen odstotek osebkov ima genotip ${ask}?`,
      answer: pctNum(v, [[100 * (ask === "Aa" ? p * q : ask === "AA" ? p : q), ask === "Aa" ? "Heterozigotov je 2pq: Aa in aA sta dve kombinaciji." : "Pogostost genotipa je kvadrat pogostosti alela."], [100 * q, "Najprej izračunaj q = 1 − p."]]),
      hint: "p + q = 1 in p² + 2pq + q² = 1.",
      data: { given: [`p = ${fmtN(p, 1)}`], find: [`d(${ask})`] },
      formula: ["q = 1 - p", "p^2 + 2pq + q^2 = 1"],
      solution: `$q = 1 - ${fmtN(p, 1)} = ${fmtN(q, 1)}$\n$d(${ask}) = ${ask === "AA" ? `p^2 = ${fmtN(p, 1)}^2` : ask === "aa" ? `q^2 = ${fmtN(q, 1)}^2` : `2pq = 2 \\cdot ${fmtN(p, 1)} \\cdot ${fmtN(q, 1)}`} = ${fmtN(v / 100, 4)}$ → ${fmtN(v)} %`,
    };
  }
  if (L === 2) {
    const [n, label] = r.pick([[100, "1 od 100"], [400, "1 od 400"], [2500, "1 od 2500"], [10000, "1 od 10000"], [900, "1 od 900"]]);
    const q = Math.sqrt(1 / n), p = 1 - q;
    const v = 100 * 2 * p * q;
    return {
      text: `Recesivna dedna bolezen (aa) prizadene ${label} ljudi. Populacija je v Hardy-Weinbergovem ravnovesju. Kolikšen odstotek ljudi je zdravih prenašalcev (Aa)? Rezultat zaokroži na dve decimalki.`,
      answer: pctNum(v, [[100 * q, "To je q, pogostost alela a. Prenašalcev je 2pq."], [100 * p * q, "Heterozigotov je 2pq, ne pq."], [100 / n, "To je delež bolnih (q²), ne prenašalcev."]]),
      hint: "Iz deleža bolnih q² izračunaj q, nato p = 1 − q in 2pq.",
      data: { given: [`q^2 = \\frac{1}{${n}}`], find: ["2pq"] },
      formula: ["q = \\sqrt{q^2}", "p = 1 - q", "d(Aa) = 2pq"],
      solution: `$q = \\sqrt{1/${n}} = ${fmtN(q, 4)}$\n$p = 1 - q = ${fmtN(p, 4)}$\n$2pq = 2 \\cdot ${fmtN(p, 4)} \\cdot ${fmtN(q, 4)} = ${fmtN(2 * p * q, 4)}$ → ${fmtN(v)} %`,
    };
  }
  const AA = r.int(20, 60), Aa = r.int(20, 50), aa = r.int(5, 30);
  const N = AA + Aa + aa;
  const p = (2 * AA + Aa) / (2 * N);
  return {
    text: `V populaciji metuljev je ${AA} osebkov AA, ${Aa} osebkov Aa in ${aa} osebkov aa. Kolikšna je pogostost alela A? Rezultat zaokroži na tri decimalke.`,
    answer: num(p, "", 3, [[(AA + Aa) / N, "Vsak osebek ima dva alela: AA prispeva dva alela A, Aa enega."], [AA / N, "To je delež osebkov AA, ne pogostost alela."], [Math.sqrt(AA / N), "Pogostost alela izračunaj iz štetja alelov; korenjenje velja le v ravnovesju."]]),
    hint: "Preštej alele: vseh je 2N. Alelov A je 2·N(AA) + N(Aa).",
    data: { given: [`N(AA) = ${AA}`, `N(Aa) = ${Aa}`, `N(aa) = ${aa}`], find: ["p"] },
    formula: "p = \\frac{2N(AA) + N(Aa)}{2N}",
    solution: `$N = ${AA} + ${Aa} + ${aa} = ${N}$\n$p = \\frac{2 \\cdot ${AA} + ${Aa}}{2 \\cdot ${N}} = \\frac{${2 * AA + Aa}}{${2 * N}} = ${fmtN(p, 3)}$`,
  };
}

// ------------------------------------------------------------ energijska piramida
function piramida(level, r) {
  const L = lvl(level);
  const eff = L === 1 ? 10 : r.pick([10, 10, 5, 20]);
  if (L === 3) {
    const top = r.pick([5, 10, 20, 50]);
    const steps = r.pick([2, 3]);
    const need = top / (eff / 100) ** steps;
    const who = steps === 2 ? "mesojedec (drugi potrošnik)" : "končni plenilec (tretji potrošnik)";
    return {
      text: `${who[0].toUpperCase() + who.slice(1)} v enem letu z hrano prejme ${top} kJ energije. Na vsako višjo trofično raven preide ${eff} % energije, od proizvajalcev do njega so ${steps} ${steps === 2 ? "koraka" : "koraki"} prenosa. Koliko energije morajo v tem času vezati proizvajalci?`,
      answer: num(need, "kJ", 0, [[top * (100 / eff) * steps, "Pri vsakem koraku se energija deli z deležem: množi s 100/" + eff + " tolikokrat, kolikor je korakov."], [top * (100 / eff), "Med proizvajalci in tem potrošnikom je več kot en korak."]]),
      hint: "Pojdi po verigi navzdol: vsaka nižja raven ima 100/" + eff + "-krat več energije.",
      data: { given: [`E_{\\text{potrošnik}} = ${top}\\ \\mathrm{kJ}`, `\\eta = ${eff}\\ \\%`, `n = ${steps}`], find: ["E_{\\text{proizvajalci}}"] },
      formula: "E_{\\text{proizvajalci}} = \\frac{E_{\\text{potrošnik}}}{\\eta^{n}}",
      solution: `Vsaka nižja raven ima 100/${eff} = ${100 / eff}-krat več energije, korakov je ${steps}.\n$E = \\frac{${top}}{${fmtN(eff / 100)}^{${steps}}} = ${fmtN(need, 0)}\\ \\mathrm{kJ}$`,
    };
  }
  const E0 = r.pick([10000, 20000, 50000, 5000, 80000]);
  const steps = L === 1 ? r.pick([1, 2]) : r.pick([2, 3]);
  const v = E0 * (eff / 100) ** steps;
  const names = ["rastlinojedci", "mesojedci (drugi potrošniki)", "končni plenilci (tretji potrošniki)"];
  return {
    text: `Rastline na travniku v enem letu vežejo ${E0} kJ energije. Na vsako višjo trofično raven preide ${eff} % energije. Koliko energije dobijo ${names[steps - 1]}?`,
    answer: num(v, "kJ", 1, [[E0 * (eff / 100), "To je energija prve ravni potrošnikov; nadaljuj do zahtevane ravni."], [E0 - E0 * (eff / 100) * steps, "Energija se ne odšteva po delih: vsaka raven dobi le delež prejšnje."]]),
    hint: `Vsaka višja raven dobi le ${eff} % energije prejšnje ravni.`,
    data: { given: [`E_0 = ${E0}\\ \\mathrm{kJ}`, `\\eta = ${eff}\\ \\%`], find: [`E_${steps}`] },
    formula: "E_n = E_0 \\cdot \\eta^{n}",
    solution: `${Array.from({ length: steps }, (_, i) => `${i + 1}. raven potrošnikov: $${fmtN(E0 * (eff / 100) ** (i + 1), 1)}\\ \\mathrm{kJ}$`).join("\n")}\n$E_${steps} = ${E0} \\cdot ${fmtN(eff / 100)}^{${steps}} = ${fmtN(v, 1)}\\ \\mathrm{kJ}$`,
  };
}

// ------------------------------------------------------------ populacije
function populacije(level, r) {
  const L = lvl(level);
  if (L === 1) {
    const N = r.int(12, 90), A = r.pick([2, 4, 5, 8, 10]);
    return {
      text: `Na ${A} hektarjih travnika so našteli ${N} poljskih zajcev. Kolikšna je gostota populacije (osebkov na hektar)?`,
      answer: num(N / A, "", 1, [[A / N, "Gostota je število osebkov deljeno s površino, ne obratno."]]),
      hint: "Gostota = število osebkov / površina.",
      data: { given: [`N = ${N}`, `S = ${A}\\ \\mathrm{ha}`], find: ["g"] },
      formula: "g = \\frac{N}{S}",
      solution: `Gostota pove, koliko osebkov živi na enoti površine.\n$g = \\frac{${N}}{${A}\\ \\mathrm{ha}} = ${fmtN(N / A, 1)}$ osebka na hektar`,
    };
  }
  if (L === 2) {
    const N0 = r.int(200, 600), b = r.int(40, 160), d = r.int(30, 140), im = r.int(0, 30), em = r.int(0, 30);
    const N1 = N0 + b - d + im - em;
    return {
      text: `Na začetku leta je v populaciji srnjadi ${N0} osebkov. Med letom se rodi ${b} mladičev, pogine ${d} živali, ${im} se jih priseli in ${em} odseli. Koliko osebkov je na koncu leta?`,
      answer: num(N1, "", 0, [[N0 + b - d, "Upoštevaj še priseljene in odseljene živali."], [N0 + b + d + im + em, "Smrti in odselitve populacijo zmanjšajo."]]),
      hint: "Rojstva in priselitve populacijo povečajo, smrti in odselitve jo zmanjšajo.",
      data: { given: [`N_0 = ${N0}`, `R = ${b}`, `S = ${d}`, `P = ${im}`, `O = ${em}`], find: ["N_1"] },
      formula: "N_1 = N_0 + R - S + P - O",
      solution: `Rojstva in priselitve prištejemo, smrti in odselitve odštejemo.\n$N_1 = ${N0} + ${b} - ${d} + ${im} - ${em} = ${N1}$ osebkov\nPopulacija se je ${N1 > N0 ? "povečala" : N1 < N0 ? "zmanjšala" : "ohranila"}.`,
    };
  }
  const R = r.int(4, 15), C = R * r.int(3, 8) + r.int(0, 3), M = r.int(30, 120);
  const N = (M * C) / R;
  return {
    text: `Biologi so v ribniku ujeli ${M} krapov, jih označili in izpustili. Teden pozneje so ujeli ${C} krapov, med njimi je bilo ${R} označenih. Oceni velikost populacije z metodo ponovnega ulova (zaokroži na celo število).`,
    answer: num(N, "", 0, [[(M * R) / C, "Delež označenih v drugem ulovu (R/C) je enak deležu označenih v populaciji (M/N): N = M·C/R."], [M + C, "Velikosti ne dobimo s seštevanjem ulovov."], [M + C - R, "To je le število različnih ujetih rib, ne ocena populacije."]]),
    hint: "Delež označenih v drugem ulovu je približno enak deležu označenih v celi populaciji.",
    data: { given: [`M = ${M}`, `C = ${C}`, `R = ${R}`], find: ["N"] },
    formula: "\\frac{R}{C} = \\frac{M}{N} \\Rightarrow N = \\frac{M \\cdot C}{R}",
    solution: `$N = \\frac{${M} \\cdot ${C}}{${R}} = ${fmtN(N, 1)} \\approx ${Math.round(N)}$ krapov`,
  };
}

// ------------------------------------------------------------ mikroskop
function mikroskop(level, r) {
  const L = lvl(level);
  const oc = r.pick([10, 15]), ob = r.pick([4, 10, 40, 100]);
  const M = oc * ob;
  if (L === 1)
    return {
      text: `Okular mikroskopa povečuje ${oc}-krat, objektiv ${ob}-krat. Kolikšna je skupna povečava?`,
      answer: num(M, "", 0, [[oc + ob, "Povečavi se množita, ne seštejeta."]]),
      hint: "Skupna povečava je zmnožek povečav okularja in objektiva.",
      data: { given: [`P_{ok} = ${oc}`, `P_{ob} = ${ob}`], find: ["P"] },
      formula: "P = P_{ok} \\cdot P_{ob}",
      solution: `Okular še enkrat poveča sliko, ki jo naredi objektiv.\n$P = ${oc} \\cdot ${ob} = ${M}$-kratna povečava`,
    };
  const real = r.pick([8, 10, 20, 25, 50, 100, 2, 5]); // µm
  const img = (real * M) / 1000; // mm
  if (L === 2)
    return {
      text: `Pri ${M}-kratni povečavi meri slika celice na risbi ${fmtN(img, 2)} mm. Kolikšna je dejanska velikost celice v mikrometrih (µm)?`,
      answer: num(real, "µm", 1, [[img / M, "Rezultat je v milimetrih: 1 mm = 1000 µm."], [img * M * 1000, "Dejansko velikost dobiš z deljenjem s povečavo, ne z množenjem."]]),
      hint: "Dejanska velikost = velikost slike / povečava. Nato pretvori milimetre v mikrometre.",
      data: { given: [`s = ${fmtN(img, 2)}\\ \\mathrm{mm}`, `P = ${M}`], find: ["d"] },
      formula: "d = \\frac{s}{P}",
      solution: `$d = \\frac{${fmtN(img, 2)}\\ \\mathrm{mm}}{${M}} = ${fmtN(img / M, 5)}\\ \\mathrm{mm} = ${fmtN(real, 1)}\\ \\mu\\mathrm{m}$`,
    };
  return {
    text: `Celica, ki meri ${real} µm, je na fotografiji velika ${fmtN(img, 2)} mm. Kolikšna je povečava fotografije?`,
    answer: num(M, "", 0, [[real / img, "Najprej izrazi obe dolžini v istih enotah."], [img / real, "Pretvori milimetre v mikrometre (1 mm = 1000 µm) in deli sliko z dejansko velikostjo."]]),
    hint: "Povečava = velikost slike / dejanska velikost, obe v enakih enotah.",
    data: { given: [`s = ${fmtN(img, 2)}\\ \\mathrm{mm}`, `d = ${real}\\ \\mu\\mathrm{m}`], find: ["P"] },
    formula: "P = \\frac{s}{d}",
    solution: `$s = ${fmtN(img, 2)}\\ \\mathrm{mm} = ${fmtN(img * 1000, 0)}\\ \\mu\\mathrm{m}$\n$P = \\frac{${fmtN(img * 1000, 0)}\\ \\mu\\mathrm{m}}{${real}\\ \\mu\\mathrm{m}} = ${M}$`,
  };
}

// ------------------------------------------------------------ DNA
const PAIR = { A: "T", T: "A", C: "G", G: "C" };
const RNA = { A: "U", T: "A", C: "G", G: "C" };
function dnaTask(level, r) {
  const L = lvl(level);
  if (L === 1) {
    const s = Array.from({ length: 6 }, () => r.pick(["A", "T", "C", "G"])).join("");
    const right = [...s].map((b) => PAIR[b]).join("");
    const ch = choicesWhy(r, right, [
      [[...s].map((b) => RNA[b]).join(""), "To je mRNA (z uracilom), ne komplementarna veriga DNA."],
      [s, "Komplementarna veriga ni enaka: A se pari s T, C z G."],
      [[...right].reverse().join(""), "Baze zapiši v istem vrstnem redu, vsako zamenjaj s komplementarno."],
      [[...s].map((b) => ({ A: "G", G: "A", C: "T", T: "C" })[b]).join(""), "Pari so A–T in C–G."],
    ]);
    return {
      text: `Ena veriga DNA ima zaporedje **${s}**. Kakšno je zaporedje komplementarne verige?`,
      answer: { type: "choice", ...ch },
      hint: "V DNA se A vedno pari s T, C pa z G.",
      data: false,
      formula: false,
      solution: `Vsako bazo zamenjamo s komplementarno: ${s} → ${right}.`,
    };
  }
  if (L === 2) {
    const A = r.pick([15, 20, 22, 26, 30, 32, 35]);
    const ask = r.pick(["G", "T", "C"]);
    const v = ask === "T" ? A : 50 - A;
    return {
      text: `V molekuli DNA je ${A} % adenina (A). Kolikšen odstotek je ${ask === "G" ? "gvanina (G)" : ask === "T" ? "timina (T)" : "citozina (C)"}?`,
      answer: pctNum(v, [[100 - A, "Vse štiri baze skupaj dajo 100 %, A in T pa sta enaka."], [A, "Le T je enak A; C in G sta enaka med sabo."], [100 - 2 * A, "To je delež C in G skupaj; vsakega je polovica."]], 0),
      hint: "A se pari s T, zato je A = T. Ostalo (C + G) si razdelita na polovico.",
      data: { given: [`A = ${A}\\ \\%`], find: [ask] },
      formula: ["A = T", "C = G", "A + T + C + G = 100\\ \\%"],
      solution: `$T = A = ${A}\\ \\%$\n$C + G = 100\\ \\% - 2 \\cdot ${A}\\ \\% = ${100 - 2 * A}\\ \\%$\n$${ask} = ${v}\\ \\%$`,
    };
  }
  const n = r.int(60, 400);
  const withStop = r.int(0, 1);
  const nt = 3 * n + (withStop ? 3 : 0);
  return {
    text: `Beljakovina ima ${n} aminokislin. Najmanj koliko nukleotidov ima del mRNA, ki jo kodira${withStop ? ", če štejemo še stop kodon" : " (brez stop kodona)"}?`,
    answer: num(nt, "", 0, [[n, "Vsako aminokislino določa trojček (kodon) treh nukleotidov."], [withStop ? 3 * n : 3 * n + 3, withStop ? "Prištej še tri nukleotide stop kodona." : "Stop kodona tokrat ne štejemo."], [2 * nt, "mRNA je enoverižna."]]),
    hint: "En kodon = 3 nukleotidi = 1 aminokislina. Stop kodon ne določa aminokisline.",
    data: { given: [`n(\\text{AK}) = ${n}`], find: ["n(\\text{nukleotidov})"] },
    formula: "n(\\text{nukleotidov}) = 3 \\cdot n(\\text{AK})" + (withStop ? " + 3" : ""),
    solution: `$3 \\cdot ${n}${withStop ? " + 3" : ""} = ${nt}$ nukleotidov`,
  };
}

// ------------------------------------------------------------ površina in prostornina
function povrsina(level, r) {
  const L = lvl(level);
  const a = L === 1 ? r.pick([1, 2, 3]) : r.pick([2, 4, 5, 10]);
  if (L === 3) {
    const b = a * r.pick([2, 3, 4]);
    return {
      text: `Primerjaj kocki s stranicama ${a} µm in ${b} µm. Kolikokrat večje je razmerje površina : prostornina pri manjši kocki?`,
      answer: num(b / a, "", 2, [[(b / a) ** 2, "Površina raste s kvadratom, prostornina s kubom: razmerje se zmanjša z dolžino stranice."], [(b / a) ** 3, "Primerjaj razmerje P/V, ne prostornini."]]),
      hint: "Pri kocki je P/V = 6a²/a³ = 6/a.",
      data: { given: [`a_1 = ${a}\\ \\mu\\mathrm{m}`, `a_2 = ${b}\\ \\mu\\mathrm{m}`], find: ["\\frac{(P/V)_1}{(P/V)_2}"] },
      formula: "\\frac{P}{V} = \\frac{6a^2}{a^3} = \\frac{6}{a}",
      solution: `$\\frac{P}{V}$ pri ${a} µm: $\\frac{6}{${a}}$, pri ${b} µm: $\\frac{6}{${b}}$\nRazmerje: $\\frac{6/${a}}{6/${b}} = ${fmtN(b / a)}$\nZato so celice majhne: večja celica ima premalo površine za izmenjavo snovi glede na prostornino.`,
    };
  }
  const ratioPV = 6 / a;
  return {
    text: `Celico ponazorimo s kocko s stranico ${a} µm. Izračunaj razmerje med površino in prostornino (v µm⁻¹).`,
    answer: num(ratioPV, "", 2, [[a / 6, "Obrnil si razmerje: deli površino s prostornino."], [(a * a) / a ** 3, "Kocka ima 6 ploskev: P = 6a²."]]),
    hint: "Površina kocke je 6a², prostornina a³.",
    data: { given: [`a = ${a}\\ \\mu\\mathrm{m}`], find: ["\\frac{P}{V}"] },
    formula: ["P = 6a^2", "V = a^3"],
    solution: `$P = 6 \\cdot ${a}^2 = ${6 * a * a}\\ \\mu\\mathrm{m}^2$\n$V = ${a}^3 = ${a ** 3}\\ \\mu\\mathrm{m}^3$\n$\\frac{P}{V} = \\frac{${6 * a * a}}{${a ** 3}} = ${fmtN(ratioPV)}\\ \\mu\\mathrm{m}^{-1}$`,
  };
}

// ------------------------------------------------------------ statistika
function statistika(level, r) {
  const L = lvl(level);
  if (L <= 2) {
    const n = L === 1 ? 5 : 4;
    const base = r.int(10, 30);
    const xs = Array.from({ length: n }, () => base + r.int(-4, 4));
    const mean = xs.reduce((a, b) => a + b, 0) / n;
    if (L === 1)
      return {
        text: `Višine sadik fižola v cm so: ${xs.join(", ")}. Izračunaj povprečno višino.`,
        answer: num(mean, "cm", 1, [[[...xs].sort((a, b) => a - b)[2], "To je mediana (srednja vrednost po velikosti), ne povprečje."]]),
        hint: "Povprečje = vsota vseh vrednosti / število vrednosti.",
        data: { given: [`x_i = ${xs.join(", ")}\\ \\mathrm{cm}`], find: ["\\bar{x}"] },
        formula: "\\bar{x} = \\frac{\\sum x_i}{n}",
        solution: `$\\bar{x} = \\frac{${xs.join(" + ")}}{${n}} = \\frac{${xs.reduce((a, b) => a + b, 0)}}{${n}} = ${fmtN(mean, 1)}\\ \\mathrm{cm}$`,
      };
    const ss = xs.reduce((a, x) => a + (x - mean) ** 2, 0);
    const sd = Math.sqrt(ss / (n - 1));
    return {
      text: `Dolžine listov v cm so: ${xs.join(", ")}. Izračunaj vzorčni standardni odklon (deli z n − 1). Zaokroži na dve decimalki.`,
      answer: num(sd, "cm", 2, [[Math.sqrt(ss / n), "Za vzorec deli z n − 1, ne z n."], [ss / (n - 1), "To je varianca: koreni jo."]]),
      hint: "Izračunaj povprečje, nato vsoto kvadratov odmikov, deli z n − 1 in koreni.",
      data: { given: [`x_i = ${xs.join(", ")}\\ \\mathrm{cm}`], find: ["s"] },
      formula: "s = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n - 1}}",
      solution: `$\\bar{x} = ${fmtN(mean, 2)}\\ \\mathrm{cm}$\n$\\sum (x_i - \\bar{x})^2 = ${fmtN(ss, 2)}$\n$s = \\sqrt{\\frac{${fmtN(ss, 2)}}{${n - 1}}} = ${fmtN(sd, 2)}\\ \\mathrm{cm}$`,
    };
  }
  const N = r.pick([80, 120, 160, 200, 240]);
  const dom = Math.round(N * 0.75) + r.int(-12, 12);
  const rec = N - dom;
  const eD = N * 0.75, eR = N * 0.25;
  const chi = (dom - eD) ** 2 / eD + (rec - eR) ** 2 / eR;
  return {
    text: `Pri križanju Aa × Aa so med ${N} potomci našteli ${dom} z dominantnim in ${rec} z recesivnim fenotipom. Izračunaj vrednost χ² za pričakovano razmerje 3 : 1. Zaokroži na dve decimalki.`,
    answer: num(chi, "", 2, [[(dom - eD) ** 2 / eD, "Seštej prispevka obeh fenotipov."], [Math.abs(dom - eD) / eD + Math.abs(rec - eR) / eR, "Odmike kvadriraj."]]),
    hint: "Pričakovano: 3/4 in 1/4 vseh. Za vsak fenotip izračunaj (O − E)²/E in seštej.",
    data: { given: [`N = ${N}`, `O_{dom} = ${dom}`, `O_{rec} = ${rec}`], find: ["\\chi^2"] },
    formula: "\\chi^2 = \\sum \\frac{(O - E)^2}{E}",
    solution: `$E_{dom} = ${fmtN(eD, 0)}$, $E_{rec} = ${fmtN(eR, 0)}$\n$\\chi^2 = \\frac{(${dom} - ${fmtN(eD, 0)})^2}{${fmtN(eD, 0)}} + \\frac{(${rec} - ${fmtN(eR, 0)})^2}{${fmtN(eR, 0)}} = ${fmtN(chi, 2)}$\nPri 1 prostostni stopnji je meja 3,84: ${chi < 3.84 ? "odstopanje je naključno, razmerje ustreza 3 : 1" : "odstopanje je preveliko za naključje"}.`,
  };
}

const CALC = [
  { id: "bio-krizanje-os", topics: ["BIO-OS-9/dedovanje-lastnosti"], gen: (l, r) => krizanje(l, r, { di: false }) },
  { id: "bio-krizanje-ss", topics: ["BIO-SS-1/mendlovo-dedovanje"], gen: (l, r) => krizanje(l, r, { di: true }) },
  { id: "bio-x-vezano", topics: ["BIO-OS-9/dedovanje-pri-cloveku", "BIO-SS-4/geni-in-razvoj-cloveka"], gen: xVezano },
  { id: "bio-krvne-skupine", topics: ["BIO-SS-4/imunost-in-krvne-skupine", "BIO-OS-9/dedovanje-pri-cloveku"], gen: krvne },
  { id: "bio-hardy-weinberg", topics: ["BIO-SS-4/populacijska-genetika", "BIO-SS-2/mehanizmi-evolucije"], gen: hardyWeinberg },
  { id: "bio-piramida", topics: ["BIO-SS-3/pretok-energije-in-krozenje-snovi", "BIO-OS-9/ekosistemi-in-biomi"], gen: piramida },
  { id: "bio-populacije", topics: ["BIO-SS-3/populacije"], gen: populacije },
  { id: "bio-mikroskop", topics: ["BIO-OS-8/celica-pod-mikroskopom", "BIO-SS-1/prokariontska-in-evkariontska-celica"], gen: mikroskop },
  { id: "bio-dna", topics: ["BIO-OS-8/dna-in-dedna-informacija", "BIO-SS-1/od-dna-do-beljakovine", "BIO-SS-4/molekularna-genetika", "BIO-OS-9/kromosomi-in-geni"], gen: dnaTask },
  { id: "bio-povrsina", topics: ["BIO-SS-1/biotska-membrana"], gen: povrsina },
  { id: "bio-statistika", topics: ["BIO-SS-4/statistika-v-biologiji"], gen: statistika },
];

export const BIO_GENERATORS = [...SORT_GENERATORS, ...CALC];
