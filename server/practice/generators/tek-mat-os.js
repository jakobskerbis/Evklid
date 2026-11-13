// Tekmovalne naloge iz matematike za OŠ (Kenguru, Vegovo priznanje).
// Vse naloge so ustvarjene s kodo; pravilen odgovor je izračunan (kjer gre, s preštevanjem vseh možnosti).
import { NAMES, g, nOf, verbOf } from "../rng.js";
import {
  tx, res, num, sci, par, binom, fact, modpow, divisors, factorize, factorTex, gcd, ORD, cap, DAYS, choiceAns, withMistakes, choiceWhy, dat,
} from "./tek-util.js";

const T = (slug) => `MAT-TEK-OS/${slug}`;
const lazn = (n) => `${verbOf(n, "je", "sta", "so", "je")} natanko ${nOf(n, "lažnivec", "lažnivca", "lažnivci", "lažnivcev")}`;
const laznVsaj = (n) => `${verbOf(n, "je", "sta", "so", "je")} vsaj ${nOf(n, "lažnivec", "lažnivca", "lažnivci", "lažnivcev")}`;

// Sosledje števk 1234567891011…: števka na mestu k.
function digitAt(k) {
  let s = "";
  for (let i = 1; s.length < k; i++) s += i;
  return Number(s[k - 1]);
}
const digitSum = (n) => String(n).split("").reduce((a, c) => a + Number(c), 0);

export const TEK_MAT_OS = [
  {
    id: "tek-vitezi-lazniveci",
    topics: [T("logicne-naloge-in-sklepanje")],
    gen(level, r) {
      const n = level === 1 ? r.int(4, 5) : level === 2 ? r.int(6, 7) : r.int(8, 10);
      const kind = level === 1 ? "natanko" : r.pick(["natanko", "vsaj"]);
      // Učenec i trdi: »Med nami je natanko/vsaj a_i lažnivcev.« Iščemo L, pri katerem je vse skladno.
      const truth = (a, L) => (kind === "natanko" ? a === L : L >= a);
      for (let tries = 0; tries < 400; tries++) {
        const a = Array.from({ length: n }, () => r.int(1, n));
        const ok = [];
        for (let L = 0; L <= n; L++) if (a.filter((x) => truth(x, L)).length === n - L) ok.push(L);
        if (ok.length !== 1 || ok[0] === 0 || ok[0] === n) continue;
        const L = ok[0];
        const knights = n - L;
        const lines = a.map((x, i) => `- ${cap(ORD[i])}: »Med nami ${kind === "natanko" ? lazn(x) : laznVsaj(x)}.«`).join("\n");
        const check = [];
        for (let k = 0; k <= n; k++) {
          const t = a.filter((x) => truth(x, k)).length;
          check.push(`$L = ${k}$: resnico govori ${t}, vitezov bi bilo ${n - k} ${t === n - k ? "✓" : "✗"}`);
        }
        return {
          text: `Na otoku živijo vitezi, ki vedno govorijo resnico, in lažnivci, ki vedno lažejo. Srečamo ${nOf(n, "prebivalca", "prebivalca", "prebivalce", "prebivalcev")} in vsak nekaj pove o vseh (tudi o sebi):\n\n${lines}\n\nKoliko vitezov je med njimi?`,
          answer: num(knights),
          hint: "Recimo, da je med njimi $L$ lažnivcev. Kateri stavki so potem resnični? Resnico govorijo natanko vitezi, torej mora biti resničnih stavkov $n - L$.",
          data: { given: [`n = ${n}`], find: ["\\text{število vitezov}"] },
          formula: "\\text{število resničnih izjav} = \\text{število vitezov} = n - L",
          solution: `Naj bo $L$ število lažnivcev. Resnične so natanko izjave vitezov, zato mora biti resničnih izjav $${n} - L$. Preverimo vse možnosti:\n\n${check.join("\n")}\n\nSkladno je le $L = ${L}$, torej je vitezov $${n} - ${L} = ${knights}$.`,
        };
      }
      return null;
    },
  },
  {
    id: "tek-invariante-os",
    topics: [T("parnost-in-invariante")],
    gen(level, r) {
      if (level === 1) {
        const n = r.int(8, 30);
        const v = r.pick(["minus", "plus"]);
        if (v === "minus") {
          const S = (n * (n + 1)) / 2;
          return {
            text: `Na tabli so napisana števila $1, 2, 3, \\ldots, ${n}$. V vsakem koraku zbrišemo dve števili $a$ in $b$ ter namesto njiju napišemo $a + b - 1$. Ko na tabli ostane eno samo število, kolikšno je?`,
            answer: num(S - (n - 1)),
            hint: "Kaj se v enem koraku zgodi z vsoto vseh števil na tabli? Koliko korakov naredimo?",
            data: { given: [`n = ${n}`], find: ["\\text{zadnje število}"] },
            formula: ["1 + 2 + \\ldots + n = \\dfrac{n(n+1)}{2}", "\\text{število korakov} = n - 1"],
            solution: `Vsak korak zmanjša vsoto vseh števil za natanko 1, ne glede na to, kateri števili izberemo.\nNa začetku je vsota $1 + 2 + \\ldots + ${n} = \\dfrac{${n} \\cdot ${n + 1}}{2} = ${S}$.\nŠtevil je ${n}, vsak korak jih zmanjša za eno, zato naredimo $${n - 1}$ korakov.\nZadnje število: $${S} - ${n - 1} = ${S - (n - 1)}$.`,
          };
        }
        const m = r.int(4, 6);
        const val = fact(m + 1) - 1;
        return {
          text: `Na tabli so števila $1, 2, \\ldots, ${m}$. V vsakem koraku zbrišemo dve števili $a$ in $b$ ter napišemo $ab + a + b$. Katero število ostane na koncu?`,
          answer: num(val),
          hint: "Opazi, da je $ab + a + b + 1 = (a + 1)(b + 1)$. Kaj se torej ne spremeni, če vsakemu številu prišteješ 1 in vse zmnožiš?",
          data: { given: [`n = ${m}`], find: ["\\text{zadnje število}"] },
          formula: "ab + a + b + 1 = (a+1)(b+1)",
          solution: `Ker je $ab + a + b + 1 = (a+1)(b+1)$, se zmnožek vseh števil $(x + 1)$ na tabli nikoli ne spremeni.\nNa začetku je ta zmnožek $2 \\cdot 3 \\cdots ${m + 1} = ${m + 1}! = ${fact(m + 1)}$.\nNa koncu ostane eno število $z$, za katero je $z + 1 = ${fact(m + 1)}$, torej $z = ${val}$.`,
        };
      }
      if (level === 2) {
        // Obračanje kovancev: najmanjše število potez (preiskava vseh stanj).
        for (let tries = 0; tries < 100; tries++) {
          const n = r.int(5, 11);
          const k = r.int(2, Math.min(5, n - 1));
          const dist = new Array(n + 1).fill(-1);
          dist[0] = 0;
          const q = [0];
          while (q.length) {
            const t = q.shift();
            for (let j = 0; j <= k; j++) {
              if (j > t || k - j > n - t) continue;
              const nt = t - j + (k - j);
              if (dist[nt] < 0) {
                dist[nt] = dist[t] + 1;
                q.push(nt);
              }
            }
          }
          if (dist[n] < 2) continue;
          const lower = Math.ceil(n / k);
          return {
            text: `Na mizi leži ${nOf(n, "kovanec", "kovanca", "kovanci", "kovancev")}, vsi z grbom navzgor. V eni potezi obrnemo natanko ${nOf(k, "kovanec", "kovanca", "kovance", "kovancev")} (katere koli). Najmanj koliko potez potrebujemo, da bodo vsi kovanci obrnjeni s cifro navzgor?`,
            answer: num(dist[n]),
            hint: `Vsak kovanec mora biti obrnjen liho mnogokrat. Koliko obratov je vseh skupaj po $p$ potezah? Kaj pove parnost? Nato poišči, ali gre res s tolikimi potezami.`,
            data: { given: [`n = ${n}`, `k = ${k}`], find: ["\\text{najmanjše število potez}"] },
            formula: ["\\text{vseh obratov} = p \\cdot k", "p \\cdot k \\ge n"],
            solution: `Po $p$ potezah je vseh obratov $${k}p$, vsak kovanec pa mora biti obrnjen vsaj enkrat, zato $${k}p \\ge ${n}$, torej $p \\ge ${lower}$. Ker mora biti vsak kovanec obrnjen liho mnogokrat, mora imeti $${k}p$ enako parnost kot ${n}.\nPreverjanje vseh stanj (koliko kovancev kaže cifro po vsaki potezi) pokaže, da je najmanjše možno število potez $${dist[n]}$.`,
          };
        }
        return null;
      }
      // Kameleoni: pregled vseh dosegljivih stanj.
      for (let tries = 0; tries < 200; tries++) {
        const c = [r.int(1, 9), r.int(1, 9), r.int(1, 9)];
        const key = (s) => s.join(",");
        const seen = new Set([key(c)]);
        const q = [c];
        const mono = new Set();
        while (q.length) {
          const s = q.shift();
          s.forEach((v, i) => v === c[0] + c[1] + c[2] && mono.add(i));
          for (const [i, j, k] of [[0, 1, 2], [0, 2, 1], [1, 2, 0]]) {
            if (!s[i] || !s[j]) continue;
            const t = [...s];
            t[i]--, t[j]--, (t[k] += 2);
            if (!seen.has(key(t))) seen.add(key(t)), q.push(t);
          }
        }
        if (mono.size > 1) continue;
        const div3 = [[0, 1], [1, 2], [0, 2]].some(([i, j]) => (c[i] - c[j]) % 3 === 0);
        if (!mono.size && div3) continue;
        const names = ["rdeči", "zeleni", "modri"];
        const correct = mono.size ? `Da, vsi so lahko ${names[[...mono][0]]}.` : "Ne, to ni mogoče.";
        const opts = choiceAns(r, correct, ["Ne, to ni mogoče.", ...names.map((x) => `Da, vsi so lahko ${x}.`)]);
        const diffs = `$${c[0]} - ${c[1]} = ${c[0] - c[1]}$, $${c[1]} - ${c[2]} = ${c[1] - c[2]}$, $${c[0]} - ${c[2]} = ${c[0] - c[2]}$`;
        return {
          text: `Na otoku živijo kameleoni treh barv: rdečih je ${c[0]}, zelenih ${c[1]} in modrih ${c[2]}. Ko se srečata dva kameleona različnih barv, oba spremenita barvo v tretjo barvo. Ali je mogoče, da so nekoč vsi kameleoni iste barve?`,
          answer: opts,
          hint: "Poglej razlike števil kameleonov dveh barv. Kako se ob srečanju spremeni razlika, in kakšen je njen ostanek pri deljenju s 3?",
          data: { given: [`r = ${c[0]}`, `z = ${c[1]}`, `m = ${c[2]}`], find: ["\\text{ali so lahko vsi iste barve}"] },
          formula: "\\text{razlike števil dveh barv se spremenijo za } 0 \\text{ ali } \\pm 3",
          solution: `Ob vsakem srečanju se razlika števil dveh barv spremeni za $0$ ali $\\pm 3$, zato ostanek razlike pri deljenju s 3 ostane enak (invarianta).\nRazlike na začetku: ${diffs}.\nČe so na koncu vsi iste barve, sta drugi dve števili 0, zato mora biti njuna razlika deljiva s 3.\n${
            mono.size ? `Deljiva s 3 je le razlika barv, ki nista ${names[[...mono][0]]}; zato so lahko na koncu vsi le ${names[[...mono][0]]}, in s primernimi srečanji se to res da doseči. Odgovor: ${correct}` : `Nobena razlika ni deljiva s 3, zato to ni mogoče.`
          }`,
        };
      }
      return null;
    },
  },
  {
    id: "tek-dirichlet-os",
    topics: [T("dirichletovo-nacelo")],
    gen(level, r) {
      if (level <= 2) {
        const c = [r.int(3, 12), r.int(3, 12), r.int(3, 12)];
        const names = ["rdečih", "modrih", "zelenih"];
        const text0 = `V predalu je v temi pomešanih ${c[0]} rdečih, ${c[1]} modrih in ${c[2]} zelenih nogavic.`;
        const given = [`r = ${c[0]}`, `m = ${c[1]}`, `z = ${c[2]}`];
        if (level === 1) {
          const k = r.int(2, Math.min(5, Math.max(...c)));
          const worst = c.reduce((s, x) => s + Math.min(x, k - 1), 0);
          return {
            text: `${text0} Najmanj koliko nogavic moramo vzeti (brez gledanja), da bomo zagotovo imeli ${nOf(k, "nogavico", "nogavici", "nogavice", "nogavic")} iste barve?`,
            answer: num(worst + 1),
            hint: "Predstavljaj si najslabši primer: vlečeš tako, da čim dlje nimaš dovolj enakih. Koliko jih lahko vzameš, ne da bi uspel?",
            data: { given: [...given, `k = ${k}`], find: ["\\text{najmanjše število nogavic}"] },
            formula: "\\text{najslabši primer} + 1",
            solution: `V najslabšem primeru vzamemo od vsake barve največ ${k - 1} (če jih toliko sploh je): $${c.map((x) => Math.min(x, k - 1)).join(" + ")} = ${worst}$ nogavic, pa še nimamo ${k} enakih.\nNaslednja nogavica gotovo dopolni eno barvo do ${k}. Odgovor: $${worst} + 1 = ${worst + 1}$.`,
          };
        }
        const v = r.pick(["vse", "dve"]);
        if (v === "vse") {
          const total = c[0] + c[1] + c[2];
          const ans = total - Math.min(...c) + 1;
          return {
            text: `${text0} Najmanj koliko nogavic moramo vzeti, da bomo zagotovo imeli vsaj eno nogavico vsake barve?`,
            answer: num(ans),
            hint: "Najslabši primer: najprej izvlečeš vse nogavice dveh barv, kateri sta najštevilčnejši.",
            data: { given, find: ["\\text{najmanjše število nogavic}"] },
            formula: "\\text{najslabši primer} + 1",
            solution: `V najslabšem primeru najprej izvlečemo vse nogavice dveh najštevilčnejših barv: $${total} - ${Math.min(...c)} = ${total - Math.min(...c)}$. Naslednja je gotovo tretje barve. Odgovor: $${ans}$.`,
          };
        }
        const ans = Math.max(...c) + 1;
        return {
          text: `${text0} Najmanj koliko nogavic moramo vzeti, da bomo zagotovo imeli dve nogavici različnih barv?`,
          answer: num(ans),
          hint: "Najslabši primer: dolgo vlečeš same nogavice iste barve. Katere barve jih je največ?",
          data: { given, find: ["\\text{najmanjše število nogavic}"] },
          formula: "\\text{najslabši primer} + 1",
          solution: `V najslabšem primeru izvlečemo najprej vse nogavice najštevilčnejše barve, to je ${Math.max(...c)}. Naslednja je gotovo druge barve. Odgovor: $${ans}$.`,
        };
      }
      const v = r.pick(["meseci", "vsota", "razlika"]);
      if (v === "meseci") {
        const n = r.int(40, 120);
        const ans = Math.ceil(n / 12);
        return {
          text: `Na šoli je ${n} učencev. Najmanj koliko učencev ima zagotovo rojstni dan v istem mesecu (ne glede na to, kdaj so rojeni)?`,
          answer: num(ans),
          hint: "Meseci so »predali«, učenci »predmeti«. Kako enakomerno jih lahko razporediš?",
          data: { given: [`n = ${n}`], find: ["\\text{zagotovo v istem mesecu}"] },
          formula: "\\left\\lceil \\dfrac{n}{12} \\right\\rceil",
          solution: `Če bi bilo v vsakem mesecu največ $${ans - 1}$ učencev, bi jih bilo skupaj največ $12 \\cdot ${ans - 1} = ${12 * (ans - 1)} < ${n}$. Zato je v nekem mesecu vsaj $${ans}$ učencev. Razporeditev s po največ ${ans} na mesec obstaja, zato več ne moremo zagotoviti. Odgovor: $${ans}$.`,
        };
      }
      if (v === "vsota") {
        const m = r.int(5, 20);
        return {
          text: `Iz množice $\\{1, 2, \\ldots, ${2 * m}\\}$ izbiramo števila. Najmanj koliko števil moramo izbrati, da bosta med izbranimi zagotovo dve, katerih vsota je ${2 * m + 1}?`,
          answer: num(m + 1),
          hint: `Razdeli števila v pare z vsoto ${2 * m + 1}. Koliko je takih parov?`,
          data: { given: [`2m = ${2 * m}`, `s = ${2 * m + 1}`], find: ["\\text{najmanjše število izbranih}"] },
          formula: "\\text{predali} + 1",
          solution: `Pari $\\{1, ${2 * m}\\}, \\{2, ${2 * m - 1}\\}, \\ldots, \\{${m}, ${m + 1}\\}$ imajo vsoto ${2 * m + 1}; parov je ${m}.\nČe izberemo ${m} števil, lahko iz vsakega para vzamemo le eno (npr. $1, 2, \\ldots, ${m}$) in vsote ${2 * m + 1} ni.\nPri $${m + 1}$ izbranih sta po Dirichletovem načelu dve iz istega para. Odgovor: $${m + 1}$.`,
        };
      }
      const k = r.int(3, 12);
      return {
        text: `Najmanj koliko različnih naravnih števil moramo izbrati, da bosta med njimi zagotovo dve, katerih razlika je deljiva s ${k}?`,
        answer: num(k + 1),
        hint: `Razlika dveh števil je deljiva s ${k}, če imata enak ostanek pri deljenju s ${k}. Koliko različnih ostankov je?`,
        data: { given: [`k = ${k}`], find: ["\\text{najmanjše število izbranih}"] },
        formula: "\\text{ostankov je } k",
        solution: `Pri deljenju s ${k} je možnih ${k} ostankov ($0, 1, \\ldots, ${k - 1}$). Števila $1, 2, \\ldots, ${k}$ imajo vsa različne ostanke, zato ${k} števil ni dovolj.\nMed $${k + 1}$ števili imata dve enak ostanek, njuna razlika pa je deljiva s ${k}. Odgovor: $${k + 1}$.`,
      };
    },
  },
  {
    id: "tek-igre-vzigalice",
    topics: [T("igre-in-zmagovalne-strategije")],
    gen(level, r) {
      const [a, b] = r.shuffle(NAMES).slice(0, 2);
      if (level <= 2) {
        const k = r.int(2, 6);
        let N;
        do N = r.int(15, 60);
        while ((level === 1 ? N : N - 1) % (k + 1) === 0);
        const move = (level === 1 ? N : N - 1) % (k + 1);
        const rule = level === 1 ? "Zmaga tisti, ki vzame zadnjo vžigalico." : "Kdor vzame zadnjo vžigalico, izgubi.";
        const target = level === 1 ? "mnogokratnik" : "za 1 večje od mnogokratnika";
        return {
          text: `Na mizi je ${N} vžigalic. ${a} in ${b} izmenično jemljeta vžigalice; vsak v svoji potezi vzame najmanj 1 in največ ${k}. ${rule} Začne ${a}. Koliko vžigalic mora ${a} vzeti v prvi potezi, da bo ${g(a, "zmagal", "zmagala")} ne glede na to, kako igra ${b}?`,
          answer: num(move),
          hint: `Poglej igro od konca. Kateri položaji so za igralca na potezi izgubljeni? Namig: v vsakem krogu lahko poskrbiš, da skupaj vzameta ${k + 1}.`,
          data: { given: [`N = ${N}`, `k = ${k}`], find: ["\\text{prva poteza}"] },
          formula: level === 1 ? "\\text{izgubljeni položaji: } 0, k+1, 2(k+1), \\ldots" : "\\text{izgubljeni položaji: } 1, k+2, 2(k+1)+1, \\ldots",
          solution: `Kdor je na potezi, ko je število vžigalic ${target} števila $${k + 1}$, izgubi: karkoli vzame ($x$), nasprotnik vzame $${k + 1} - x$ in položaj se ponovi.\n${level === 1 ? `$${N} = ${Math.floor(N / (k + 1))} \\cdot ${k + 1} + ${move}$` : `$${N} - 1 = ${Math.floor((N - 1) / (k + 1))} \\cdot ${k + 1} + ${move}$`}, zato ${a} vzame $${move}$ in nasprotniku pusti izgubljen položaj. Nato vedno dopolni do $${k + 1}$.`,
        };
      }
      const sets = [[1, 3, 4], [1, 4], [2, 3], [1, 2, 4], [2, 3, 5], [1, 3], [1, 5, 6]];
      const S = r.pick(sets);
      const M = r.int(15, 30);
      const win = [false];
      for (let n = 1; n <= M; n++) win[n] = S.some((s) => s <= n && !win[n - s]);
      const winning = [];
      for (let n = 1; n <= M; n++) if (win[n]) winning.push(n);
      const losing = [];
      for (let n = 1; n <= M; n++) if (!win[n]) losing.push(n);
      return {
        text: `Na kupu je $N$ kamenčkov. Dva igralca izmenično jemljeta kamenčke; v eni potezi lahko vzameš natanko ${S.slice(0, -1).join(", ")} ali ${S[S.length - 1]} kamenčke. Kdor ne more narediti poteze, izgubi. Za koliko izmed števil $N = 1, 2, \\ldots, ${M}$ ima prvi igralec zmagovalno strategijo?`,
        answer: num(winning.length),
        hint: "Pojdi od majhnih $N$ navzgor. Položaj je zmagovalen, če lahko s potezo pustiš nasprotniku izgubljen položaj; izgubljen, če vse poteze vodijo v zmagovalne.",
        data: { given: [`M = ${M}`], find: ["\\text{število zmagovalnih } N"] },
        formula: "N \\text{ je zmagovalen} \\iff \\text{obstaja poteza v izgubljen položaj}",
        solution: `$N = 0$ je izgubljen (ni poteze). Postopoma dobimo izgubljene položaje do ${M}: ${losing.length ? `$${losing.join(", ")}$` : "jih ni"}.\nVsi drugi so zmagovalni: teh je $${M} - ${losing.length} = ${winning.length}$.`,
      };
    },
  },
  {
    id: "tek-ostanki-os",
    topics: [T("deljivost-in-ostanki")],
    gen(level, r) {
      if (level === 1) {
        const a = r.int(2, 9);
        const n = r.int(30, 2030);
        const cyc = [];
        let x = a % 10;
        while (!cyc.includes(x)) cyc.push(x), (x = (x * a) % 10);
        const ans = modpow(a, n, 10);
        return {
          text: `Katera je zadnja števka števila $${a}^{${n}}$?`,
          answer: num(ans),
          hint: `Izračunaj zadnje števke prvih nekaj potenc števila ${a}. Kdaj se začnejo ponavljati?`,
          data: { given: [`a = ${a}`, `n = ${n}`], find: ["\\text{zadnja števka}"] },
          formula: "\\text{zadnje števke potenc se ponavljajo v ciklu}",
          solution: `Zadnje števke potenc ${a}: $${cyc.join(", ")}, \\ldots$ (cikel dolžine ${cyc.length}).\n${
            cyc.length === 1 ? `Zadnja števka je vedno ${cyc[0]}.` : `$${n}$ da pri deljenju s ${cyc.length} ostanek ${n % cyc.length}, zato je zadnja števka ${ans}.`
          }`,
        };
      }
      if (level === 2) {
        const m = r.pick([3, 7, 9, 11, 13]);
        let a;
        do a = r.int(2, 12);
        while (gcd(a, m) !== 1);
        const n = r.int(50, 999);
        const ans = modpow(a, n, m);
        const pw = [];
        for (let e = 1, v = a % m; e <= 12; e++, v = (v * a) % m) {
          pw.push(v);
          if (v === 1) break;
        }
        const per = pw[pw.length - 1] === 1 ? pw.length : null;
        return {
          text: `Kolikšen je ostanek pri deljenju števila $${a}^{${n}}$ s ${m}?`,
          answer: num(ans),
          hint: `Izračunaj ostanke $${a}^1, ${a}^2, ${a}^3, \\ldots$ pri deljenju s ${m}, dokler ne dobiš ostanka 1.`,
          data: { given: [`a = ${a}`, `n = ${n}`, `m = ${m}`], find: ["\\text{ostanek}"] },
          formula: "\\text{če } a^k \\text{ da ostanek } 1\\text{, se ostanki ponavljajo s periodo } k",
          solution: per
            ? `Ostanki potenc ${a} pri deljenju s ${m}: $${pw.join(", ")}$. Ker $${a}^{${per}}$ da ostanek 1, se ostanki ponavljajo s periodo ${per}.\n$${n} = ${Math.floor(n / per)} \\cdot ${per} + ${n % per}$, zato je ostanek enak ostanku $${a}^{${n % per}}$, to je ${ans}.`
            : `Ostanke potenc računamo postopoma (vsakič pomnožimo z ${a} in vzamemo ostanek). Za $${a}^{${n}}$ dobimo ostanek ${ans}.`,
        };
      }
      const ms = r.pick([[3, 4, 5], [3, 5, 7], [4, 5, 6], [2, 3, 7], [4, 7, 9], [3, 8, 5], [5, 6, 7]]);
      const L = ms.reduce((a, b) => (a * b) / gcd(a, b));
      let rs, x;
      do {
        rs = ms.map((m) => r.int(0, m - 1));
        x = 1;
        while (x <= L && !ms.every((m, i) => x % m === rs[i])) x++;
      } while (x > L || rs.every((v) => v === 0));
      return {
        text: `Katero je najmanjše naravno število, ki da pri deljenju s ${ms[0]} ostanek ${rs[0]}, pri deljenju s ${ms[1]} ostanek ${rs[1]} in pri deljenju s ${ms[2]} ostanek ${rs[2]}?`,
        answer: num(x),
        hint: `Začni s števili, ki ustrezajo največjemu delitelju (${Math.max(...ms)}), in med njimi poišči prvo, ki ustreza še drugima pogojema.`,
        data: { given: ms.map((m, i) => `x \\bmod ${m} = ${rs[i]}`), find: ["x"] },
        formula: "\\text{rešitve se ponavljajo z } v(m_1, m_2, m_3)",
        solution: `Števila z ostankom ${rs[ms.indexOf(Math.max(...ms))]} pri deljenju s ${Math.max(...ms)} so ${[0, 1, 2, 3].map((i) => (rs[ms.indexOf(Math.max(...ms))] || Math.max(...ms)) + i * Math.max(...ms)).join(", ")}, …\nMed njimi je prvo, ki ustreza vsem trem pogojem, $${x}$ (preveri: ${ms.map((m) => `$${x} = ${Math.floor(x / m)} \\cdot ${m} + ${x % m}$`).join(", ")}).\nVse rešitve se ponavljajo vsakih $v(${ms.join(", ")}) = ${L}$.`,
      };
    },
  },
  {
    id: "tek-delitelji-os",
    topics: [T("prastevila-in-delitelji-v-nalogah")],
    gen(level, r) {
      if (level <= 2) {
        let N;
        do N = r.pick([2, 4, 8, 16, 3 * 8, 2 * 9, 4 * 9]) * r.pick([1, 3, 5, 5, 7, 25]) * r.pick([1, 1, 7, 11]);
        while (N > 3000 || N < 40 || divisors(N).length < 8);
        const f = factorize(N);
        const ds = divisors(N);
        if (level === 1) {
          return {
            text: `Koliko deliteljev ima število ${N}?`,
            answer: num(ds.length),
            hint: "Razcepi število na prafaktorje. Delitelj dobiš tako, da za vsak prafaktor izbereš, kolikokrat ga vzameš.",
            data: { given: [`n = ${N}`], find: ["\\text{število deliteljev}"] },
            formula: "n = p^a q^b r^c \\Rightarrow \\text{deliteljev je } (a+1)(b+1)(c+1)",
            solution: `$${N} = ${factorTex(f)}$\nŠtevilo deliteljev: $${Object.values(f).map((e) => `(${e} + 1)`).join(" \\cdot ")} = ${ds.length}$.`,
          };
        }
        const v = r.pick(["sodi", "kvadrati", "vsota"]);
        if (v === "sodi" && f[2]) {
          const even = ds.filter((d) => d % 2 === 0).length;
          const odd = ds.length - even;
          return {
            text: `Koliko sodih deliteljev ima število ${N}?`,
            answer: num(even),
            hint: "Sod delitelj vsebuje vsaj en faktor 2. Lahko pa prešteješ vse delitelje in odšteješ lihe.",
            data: { given: [`n = ${N}`], find: ["\\text{število sodih deliteljev}"] },
            formula: "\\text{sodi} = \\text{vsi} - \\text{lihi}",
            solution: `$${N} = ${factorTex(f)}$. Vseh deliteljev je ${ds.length}. Lihi delitelji ne vsebujejo faktorja 2: teh je ${odd}.\nSodih je $${ds.length} - ${odd} = ${even}$.`,
          };
        }
        if (v === "kvadrati") {
          const sq = ds.filter((d) => Number.isInteger(Math.sqrt(d)));
          return {
            text: `Koliko deliteljev števila ${N} je popolnih kvadratov (vključno z 1)?`,
            answer: num(sq.length),
            hint: "Delitelj je popoln kvadrat, če je v njegovem razcepu vsak prafaktor na sodo potenco.",
            data: { given: [`n = ${N}`], find: ["\\text{število kvadratnih deliteljev}"] },
            formula: "p^{2k} \\text{ za vsak prafaktor}",
            solution: `$${N} = ${factorTex(f)}$. Za vsak prafaktor izberemo sodo potenco do največje dovoljene: ${Object.entries(f).map(([p, e]) => `za ${p} imamo ${Math.floor(e / 2) + 1} ${Math.floor(e / 2) + 1 === 1 ? "možnost" : "možnosti"}`).join(", ")}.\nSkupaj $${sq.length}$: ${sq.join(", ")}.`,
          };
        }
        const sum = ds.reduce((a, b) => a + b, 0);
        return {
          text: `Kolikšna je vsota vseh deliteljev števila ${N}?`,
          answer: num(sum),
          hint: "Razcepi število. Vsota deliteljev je zmnožek vsot $(1 + p + p^2 + \\ldots)$ za vsak prafaktor.",
          data: { given: [`n = ${N}`], find: ["\\text{vsota deliteljev}"] },
          formula: "\\sigma(p^a q^b) = (1 + p + \\ldots + p^a)(1 + q + \\ldots + q^b)",
          solution: `$${N} = ${factorTex(f)}$\nVsota: $${Object.entries(f).map(([p, e]) => `(${Array.from({ length: e + 1 }, (_, i) => (i === 0 ? "1" : i === 1 ? p : `${p}^{${i}}`)).join(" + ")})`).join(" \\cdot ")} = ${sum}$.`,
        };
      }
      const k = r.pick([6, 8, 9, 10, 12, 14, 15, 16, 18, 20]);
      let n = 1;
      while (divisors(n).length !== k) n++;
      return {
        text: `Katero je najmanjše naravno število, ki ima natanko ${k} deliteljev?`,
        answer: num(n),
        hint: `Če je $n = p^a q^b \\cdots$, ima $(a+1)(b+1)\\cdots$ deliteljev. Zapiši ${k} kot zmnožek in večje eksponente daj manjšim praštevilom.`,
        data: { given: [`d(n) = ${k}`], find: ["n"] },
        formula: "n = p^a q^b \\Rightarrow d(n) = (a+1)(b+1)",
        solution: `Možni zapisi števila ${k} kot zmnožek dajo kandidate (največji eksponent pri 2, nato pri 3 …). Najmanjši je $${n} = ${factorTex(factorize(n))}$, ki ima $${Object.values(factorize(n)).map((e) => `(${e}+1)`).join(" \\cdot ")} = ${k}$ deliteljev.`,
      };
    },
  },
  {
    id: "tek-stevke",
    topics: [T("stevilske-uganke-in-zapisi")],
    gen(level, r) {
      if (level === 1) {
        const N = r.int(60, 999);
        let d = 0;
        for (let i = 1; i <= N; i++) d += String(i).length;
        const two = Math.min(N, 99) - 9;
        const three = Math.max(0, N - 99);
        return {
          text: `Koliko števk zapišemo, ko zapišemo vsa naravna števila od 1 do ${N}?`,
          answer: num(d),
          hint: "Ločeno preštej enomestna, dvomestna in trimestna števila.",
          data: { given: [`N = ${N}`], find: ["\\text{število števk}"] },
          formula: "9 \\cdot 1 + 90 \\cdot 2 + \\ldots",
          solution: `Enomestnih je 9 (9 števk), dvomestnih ${two} (${2 * two} števk)${three ? `, trimestnih ${three} (${3 * three} števk)` : ""}.\nSkupaj: $9 + ${2 * two}${three ? ` + ${3 * three}` : ""} = ${d}$.`,
        };
      }
      if (level === 2) {
        const digits = r.pick([3, 3, 4]);
        const s = digits === 3 ? r.int(5, 22) : r.int(6, 30);
        let c = 0;
        for (let i = 10 ** (digits - 1); i < 10 ** digits; i++) if (digitSum(i) === s) c++;
        return {
          text: `Koliko je ${digits === 3 ? "trimestnih" : "štirimestnih"} naravnih števil, ki imajo vsoto števk ${s}?`,
          answer: num(c),
          hint: "Prva števka je od 1 do 9, ostale od 0 do 9. Za vsako prvo števko preštej, na koliko načinov dopolniš ostanek vsote.",
          data: { given: [`s = ${s}`], find: ["\\text{število števil}"] },
          formula: false,
          solution: `Za vsako možno prvo števko $a$ preštejemo, na koliko načinov lahko ostale števke (od 0 do 9) dajo vsoto $${s} - a$, in seštejemo.\nSkupaj je takih števil $${c}$.`,
        };
      }
      if (r.next() < 0.5) {
        const k = r.int(200, 2900);
        let len = 0, i = 0;
        while (len < k) len += String(++i).length;
        return {
          text: `Napišemo zaporedje števk $123456789101112131415\\ldots$ (vsa naravna števila po vrsti). Katera števka stoji na ${k}. mestu?`,
          answer: num(digitAt(k)),
          hint: "Najprej ugotovi, koliko mest zasedejo enomestna in dvomestna števila. Nato izračunaj, v katerem trimestnem številu je iskano mesto.",
          data: { given: [`k = ${k}`], find: ["\\text{števka na mestu } k"] },
          formula: "9 \\cdot 1 + 90 \\cdot 2 = 189 \\text{ mest}",
          solution: `Enomestna števila zasedejo 9 mest, dvomestna $90 \\cdot 2 = 180$ mest, skupaj 189.\n${
            k <= 9 ? "" : k <= 189 ? `Mesto ${k} je med dvomestnimi števili.` : `Ostane $${k} - 189 = ${k - 189}$ mest med trimestnimi: $${k - 189} = 3 \\cdot ${Math.floor((k - 190) / 3)} + ${((k - 190) % 3) + 1}$, torej smo v ${Math.floor((k - 190) / 3) + 1}. trimestnem številu, to je $${100 + Math.floor((k - 190) / 3)}$, na njegovem ${((k - 190) % 3) + 1}. mestu.`
          }\nIskana števka je ${digitAt(k)} (število ${i}).`,
        };
      }
      const N = r.int(100, 999);
      const dgt = r.int(1, 9);
      let c = 0;
      for (let i = 1; i <= N; i++) c += String(i).split("").filter((x) => Number(x) === dgt).length;
      return {
        text: `Kolikokrat zapišemo števko ${dgt}, ko zapišemo vsa naravna števila od 1 do ${N}?`,
        answer: num(c),
        hint: "Preštej posebej na mestu enic, desetic in stotic.",
        data: { given: [`N = ${N}`, `d = ${dgt}`], find: ["\\text{število pojavitev}"] },
        formula: false,
        solution: `Na vsakem mestu (enice, desetice, stotice) preštejemo, kolikokrat se pojavi števka ${dgt} med števili od 1 do ${N}, in seštejemo. Skupaj $${c}$-krat.`,
      };
    },
  },
  {
    id: "tek-diofant-os",
    topics: [T("enacbe-s-celostevilskimi-resitvami")],
    gen(level, r) {
      if (level === 1) {
        const z = r.int(5, 40), k = r.int(5, 40);
        const animals = r.pick([["kokoši", "zajcev", 2, 4], ["kokoši", "ovac", 2, 4], ["purani", "prašičev", 2, 4]]);
        const heads = z + k, legs = animals[2] * k + animals[3] * z;
        return {
          text: `Na kmetiji so ${animals[0]} in ${animals[1].replace("zajcev", "zajci").replace("ovac", "ovce").replace("prašičev", "prašiči")}. Skupaj imajo ${heads} glav in ${legs} nog. Koliko je ${animals[1]}?`,
          answer: num(z),
          hint: "Recimo, da bi imele vse živali po 2 nogi. Koliko nog bi manjkalo in koliko jih »prinese« vsaka štirinožna žival?",
          data: { given: [`\\text{glav} = ${heads}`, `\\text{nog} = ${legs}`], find: [`\\text{število štirinožcev}`] },
          formula: "\\text{štirinožcev} = \\dfrac{\\text{nog} - 2 \\cdot \\text{glav}}{2}",
          solution: `Če bi imele vse po 2 nogi, bi bilo $2 \\cdot ${heads} = ${2 * heads}$ nog. Manjka $${legs} - ${2 * heads} = ${legs - 2 * heads}$ nog, vsak štirinožec doda 2.\nŠtirinožcev je $${legs - 2 * heads} : 2 = ${z}$.`,
        };
      }
      if (level === 2) {
        const [a, b] = r.pick([[2, 5], [3, 5], [2, 7], [3, 7], [4, 7], [5, 8]]);
        let S, sols;
        do {
          S = r.int(30, 90);
          sols = [];
          for (let x = 0; a * x <= S; x++) if ((S - a * x) % b === 0) sols.push([x, (S - a * x) / b]);
        } while (sols.length < 2);
        return {
          text: `Na koliko načinov lahko plačamo natanko ${S} € samo s kovanci po ${a} € in bankovci po ${b} € (vrstni red ni pomemben; enega od teh dveh lahko tudi ne uporabimo)?`,
          answer: num(sols.length),
          hint: `Iščemo pare celih števil $x, y \\ge 0$ z $${a}x + ${b}y = ${S}$. Kakšen mora biti $y$, da je $${S} - ${b}y$ deljivo z ${a}?`,
          data: { given: [`S = ${S}`, `a = ${a}`, `b = ${b}`], find: ["\\text{število načinov}"] },
          formula: "a x + b y = S, \\quad x, y \\ge 0",
          solution: `Rešujemo $${a}x + ${b}y = ${S}$ v nenegativnih celih številih. Rešitve $(x, y)$: ${sols.map(([x, y]) => `$(${x}, ${y})$`).join(", ")}.\nNačinov je $${sols.length}$.`,
        };
      }
      const coins = r.pick([[10, 20, 50], [5, 10, 20], [2, 5, 10], [1, 2, 5]]);
      const S = coins[2] * r.int(2, coins[0] === 1 ? 4 : 5);
      let c = 0;
      for (let x = 0; x * coins[2] <= S; x++) for (let y = 0; x * coins[2] + y * coins[1] <= S; y++) if ((S - x * coins[2] - y * coins[1]) % coins[0] === 0) c++;
      return {
        text: `Na koliko različnih načinov lahko plačamo ${S} centov s kovanci po ${coins[0]}, ${coins[1]} in ${coins[2]} centov (kovancev vsake vrste imamo dovolj, vrstni red ni pomemben)?`,
        answer: num(c),
        hint: `Razdeli po številu največjih kovancev (${coins[2]} c). Za vsako možnost preštej, na koliko načinov plačaš ostanek s kovanci po ${coins[0]} in ${coins[1]} c.`,
        data: { given: [`S = ${S}`], find: ["\\text{število načinov}"] },
        formula: `${coins[0]}a + ${coins[1]}b + ${coins[2]}c = S`,
        solution: `Za vsako število kovancev po ${coins[2]} c (od 0 do ${S / coins[2]}) preštejemo, koliko je možnosti za kovance po ${coins[1]} c; preostanek vedno doplačamo s kovanci po ${coins[0]} c, če je deljiv.\nSkupaj je načinov $${c}$.`,
      };
    },
  },
  {
    id: "tek-prestevanje",
    topics: [T("prestevanje-moznosti")],
    gen(level, r) {
      const ime = r.pick(NAMES);
      if (level === 1) {
        const v = r.int(0, 5);
        if (v === 0) {
          const conds = [
            ["so soda", (n) => n % 2 === 0, "zadnjo"],
            ["so liha", (n) => n % 2 === 1, "zadnjo"],
            ["so deljiva s 5", (n) => n % 5 === 0, "zadnjo"],
            ["so večja od 500", (n) => n > 500, "prvo"],
            ["nimajo števke 0", (n) => !String(n).includes("0"), "vsako"],
            ["se začnejo s števko 7", (n) => String(n)[0] === "7", "prvo"],
            ["so manjša od 400", (n) => n < 400, "prvo"],
          ];
          const [desc, f, kje] = r.pick(conds);
          let c = 0, z = 0;
          for (let n = 100; n <= 999; n++) if (new Set(String(n)).size === 3 && f(n)) c++;
          // napaka: ničla na prvem mestu dovoljena
          for (let n = 0; n <= 999; n++) if (new Set(String(n).padStart(3, "0")).size === 3 && f(n)) z++;
          return {
            text: `Koliko je trimestnih števil s tremi različnimi števkami, ki ${desc}?`,
            answer: withMistakes(num(c), [[z, "Ali si izločil števila z ničlo na prvem mestu?"], [9 * 9 * 8, "To so vsa trimestna števila z različnimi števkami; upoštevaj še pogoj."]]),
            hint: `Najprej izberi ${kje} števko (tisto z omejitvijo), nato ostale. Pazi na ničlo na prvem mestu.`,
            data: false,
            formula: "\\text{pravilo produkta}",
            solution: `Najprej določimo ${kje} števko, ker ima omejitev; nato preostali mesti (prva ni 0, števke so različne).\nKjer je potrebno, ločimo primere (npr. ali je zadnja števka 0).\nSkupaj: $${c}$.`,
          };
        }
        if (v === 1) {
          const a = r.int(3, 8), b = r.int(2, 6), k = r.int(2, 5);
          return {
            text: `${ime} ima ${a} majic, ${b} hlač in ${k} pare superg. Na koliko načinov se lahko obleče (ena majica, ene hlače, en par superg)?`,
            answer: withMistakes(num(a * b * k), [[a + b + k, "Izbire so neodvisne: število možnosti zmnožiš, ne sešteješ."], [a * b, "Upoštevaj tudi superge."]]),
            hint: "Za vsako majico lahko izbereš katerekoli hlače in katerekoli superge.",
            data: { given: [`a = ${a}`, `b = ${b}`, `c = ${k}`], find: ["N"] },
            formula: "N = a \\cdot b \\cdot c",
            solution: `Pravilo produkta: $N = a \\cdot b \\cdot c$\n$N = ${a} \\cdot ${b} \\cdot ${k} = ${a * b * k}$`,
          };
        }
        if (v === 2) {
          const n = r.int(5, 14);
          return {
            text: `Na srečanju je ${n} učencev. Vsak se z vsakim natanko enkrat rokuje. Koliko je vseh rokovanj?`,
            answer: withMistakes(num((n * (n - 1)) / 2), [[n * (n - 1), "Vsako rokovanje si štel dvakrat (A z B in B z A)."], [n * n, "Sam s seboj se nihče ne rokuje, vsako rokovanje pa šteješ enkrat."]]),
            hint: "Vsak se rokuje z vsemi drugimi; ko to sešteješ za vse, je vsako rokovanje šteto dvakrat.",
            data: { given: [`n = ${n}`], find: ["N"] },
            formula: "N = \\dfrac{n(n-1)}{2}",
            solution: `Vsak od ${n} se rokuje z ${n - 1} drugimi: $${n} \\cdot ${n - 1} = ${n * (n - 1)}$\nVsako rokovanje je šteto dvakrat: $N = ${n * (n - 1)} : 2 = ${(n * (n - 1)) / 2}$`,
          };
        }
        if (v === 3) {
          const n = r.int(5, 12);
          return {
            text: `Na tekmi teče ${n} tekačev. Na koliko načinov so lahko podeljene zlata, srebrna in bronasta medalja (vsak tekač dobi največ eno)?`,
            answer: withMistakes(num(n * (n - 1) * (n - 2)), [[n ** 3, "Isti tekač ne more dobiti dveh medalj."], [(n * (n - 1) * (n - 2)) / 6, "Vrstni red je pomemben: zlato in srebro nista isto."]]),
            hint: "Kdo lahko dobi zlato? Koliko jih ostane za srebro, in koliko za bron?",
            data: { given: [`n = ${n}`], find: ["N"] },
            formula: "N = n(n-1)(n-2)",
            solution: `Zlato: ${n} možnosti, srebro: ${n - 1}, bron: ${n - 2}\n$N = ${n} \\cdot ${n - 1} \\cdot ${n - 2} = ${n * (n - 1) * (n - 2)}$`,
          };
        }
        if (v === 4) {
          const L = r.int(3, 5), k = r.pick([4, 5, 6, 10]);
          return {
            text: `Ključavnica s kodo ima ${L} kolesca, na vsakem je ${k} različnih števk. Koliko različnih kod lahko nastavimo (števke se lahko ponavljajo)?`,
            answer: withMistakes(num(k ** L), [[k * L, "Možnosti na kolescih se zmnožijo, ne seštejejo."], [L ** k, "Osnova je število števk na kolescu, eksponent pa število kolesc."]]),
            hint: "Vsako kolesce nastaviš neodvisno od drugih.",
            data: { given: [`n = ${L}`, `k = ${k}`], find: ["N"] },
            formula: "N = k^n",
            solution: `Vsako od ${L} kolesc ima ${k} možnosti.\n$N = ${k}^{${L}} = ${k ** L}$`,
          };
        }
        const p = r.int(2, 5), q = r.int(3, 7), s = r.int(2, 5);
        return {
          text: `V restavraciji imajo ${p} predjedi, ${q} glavnih jedi in ${s} sladic. ${ime} izbere eno predjed, eno glavno jed in eno sladico. Koliko različnih kosil lahko sestavi?`,
          answer: withMistakes(num(p * q * s), [[p + q + s, "Izbire so neodvisne: število možnosti zmnožiš, ne sešteješ."], [q * s, "Upoštevaj tudi predjed."]]),
          hint: "Za vsako predjed lahko izbere katerokoli glavno jed in katerokoli sladico.",
          data: { given: [`a = ${p}`, `b = ${q}`, `c = ${s}`], find: ["N"] },
          formula: "N = a \\cdot b \\cdot c",
          solution: `Pravilo produkta: $N = a \\cdot b \\cdot c$\n$N = ${p} \\cdot ${q} \\cdot ${s} = ${p * q * s}$`,
        };
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const N = r.int(100, 999);
          const [a, b] = r.pick([[2, 3], [3, 5], [2, 5], [4, 6], [3, 7], [6, 9], [4, 10], [5, 7], [6, 8]]);
          const not = r.next() < 0.5;
          const L = (a * b) / gcd(a, b);
          const A = Math.floor(N / a), B = Math.floor(N / b), AB = Math.floor(N / L);
          const c = not ? N - (A + B - AB) : A + B - AB;
          const wrongAB = Math.floor(N / (a * b));
          return {
            text: `Koliko števil od 1 do ${N} ${not ? `ni deljivih ne s ${a} ne s ${b}` : `je deljivih s ${a} ali s ${b}`}?`,
            answer: withMistakes(num(c), [[not ? N - A - B : A + B, "Števila, deljiva z obema, si štel dvakrat."], [not ? N - (A + B - wrongAB) : A + B - wrongAB, `Deljiva z ${a} in ${b} so deljiva z njunim najmanjšim skupnim večkratnikom ${L}, ne nujno s ${a * b}.`], [not ? A + B - AB : N - (A + B - AB), not ? "To so števila, ki SO deljiva z vsaj enim; odštej jih od vseh." : "To so števila, ki niso deljiva z nobenim."]]),
            hint: `Preštej deljive s ${a}, deljive s ${b}, in pazi, da tistih, ki so deljiva z obema (z $v(${a}, ${b})$), ne šteješ dvakrat.`,
            data: { given: [`N = ${N}`, `a = ${a}`, `b = ${b}`], find: ["\\text{število števil}"] },
            formula: "|A \\cup B| = |A| + |B| - |A \\cap B|",
            solution: `Deljivih s ${a}: $\\lfloor ${N}/${a} \\rfloor = ${A}$, s ${b}: $${B}$\nZ obema (z $v(${a}, ${b}) = ${L}$): $${AB}$\nDeljivih s ${a} ali ${b}: $${A} + ${B} - ${AB} = ${A + B - AB}$${not ? `\nNi deljivih z nobenim: $${N} - ${A + B - AB} = ${c}$` : ""}`,
          };
        }
        if (v === 1) {
          const n = r.int(5, 15);
          return {
            text: `Koliko diagonal ima konveksni ${n}-kotnik?`,
            answer: withMistakes(num((n * (n - 3)) / 2), [[n * (n - 3), "Vsako diagonalo si štel dvakrat (z obeh krajišč)."], [(n * (n - 1)) / 2, "Med vsemi daljicami med oglišči so tudi stranice; odštej jih."]]),
            hint: "Iz enega oglišča gre diagonala do vseh oglišč razen sebe in obeh sosedov.",
            data: { given: [`n = ${n}`], find: ["d"] },
            formula: "d = \\dfrac{n(n-3)}{2}",
            solution: `Iz vsakega oglišča: $${n} - 3 = ${n - 3}$ diagonal\nVseh krajišč: $${n} \\cdot ${n - 3} = ${n * (n - 3)}$\nVsaka diagonala šteta dvakrat: $d = ${(n * (n - 3)) / 2}$`,
          };
        }
        if (v === 2) {
          const f = r.int(4, 9), m = r.int(4, 9), kf = r.int(1, 3), km = r.int(1, 3);
          const val = binom(f, kf) * binom(m, km);
          return {
            text: `V razredu je ${f} deklet in ${m} fantov. Za šolski kviz izberejo ekipo, v kateri so ${kf} ${kf === 1 ? "dekle" : kf === 2 ? "dekleti" : "dekleta"} in ${nOf(km, "fant", "fanta", "fantje", "fantov")}. Koliko različnih ekip lahko sestavijo?`,
            answer: withMistakes(num(val), [[binom(f, kf) + binom(m, km), "Izbiri sta neodvisni: možnosti zmnožiš."], [binom(f + m, kf + km), "Ta izbira ne upošteva, koliko je deklet in koliko fantov."], [(fact(f) / fact(f - kf)) * (fact(m) / fact(m - km)), "V ekipi vrstni red ni pomemben."]]),
            hint: "Posebej izberi dekleta in posebej fante, nato možnosti zmnožiš.",
            data: { given: [`d = ${f}`, `f = ${m}`, `k_d = ${kf}`, `k_f = ${km}`], find: ["N"] },
            formula: "N = \\binom{d}{k_d} \\binom{f}{k_f}",
            solution: `Dekleta: $\\binom{${f}}{${kf}} = ${binom(f, kf)}$\nFantje: $\\binom{${m}}{${km}} = ${binom(m, km)}$\n$N = ${binom(f, kf)} \\cdot ${binom(m, km)} = ${val}$`,
          };
        }
        const a = r.int(2, 5), b = r.int(2, 5);
        return {
          text: `Iz kraja A v kraj B vodi ${a} različnih poti, iz B v C pa ${b}. ${ime} gre iz A v C (prek B) in nazaj, vendar se nobene poti ne sme dvakrat. Na koliko načinov lahko opravi pot tja in nazaj?`,
          answer: withMistakes(num(a * b * (a - 1) * (b - 1)), [[(a * b) ** 2, "Nazaj ne sme po isti poti: na vsakem odseku ostane ena možnost manj."], [a * b, "To je le pot tja; dodaj še pot nazaj."]]),
          hint: "Pot tja: koliko možnosti? Pri poti nazaj je na vsakem odseku ena pot že porabljena.",
          data: { given: [`a = ${a}`, `b = ${b}`], find: ["N"] },
          formula: "N = a \\cdot b \\cdot (b-1)(a-1)",
          solution: `Tja: $${a} \\cdot ${b} = ${a * b}$ možnosti\nNazaj: $${b - 1} \\cdot ${a - 1} = ${(a - 1) * (b - 1)}$ možnosti\n$N = ${a * b} \\cdot ${(a - 1) * (b - 1)} = ${a * b * (a - 1) * (b - 1)}$`,
        };
      }
      const v = r.pick(["vsaj", "narascajoce", "palindrom", "besede", "mreza"]);
      if (v === "vsaj") {
        const d = r.int(0, 9), len = r.pick([3, 4]);
        const tot = 9 * 10 ** (len - 1), bez = (d === 0 ? 9 : 8) * 9 ** (len - 1);
        return {
          text: `Koliko ${len === 3 ? "trimestnih" : "štirimestnih"} števil vsebuje vsaj eno števko ${d}?`,
          answer: withMistakes(num(tot - bez), [[bez, `To so števila BREZ števke ${d}; odštej jih od vseh.`], [tot - 9 ** len, "Prva števka ne sme biti 0, zato ima manj možnosti."], [len * 10 ** (len - 1), `Števila z več števkami ${d} si štel večkrat.`]]),
          hint: `Lažje je prešteti nasprotno: koliko ${len === 3 ? "trimestnih" : "štirimestnih"} števil sploh nima števke ${d}?`,
          data: { given: [`d = ${d}`], find: ["\\text{število števil}"] },
          formula: "\\text{iskano} = \\text{vsa} - \\text{brez števke } d",
          solution: `Vseh ${len === 3 ? "trimestnih" : "štirimestnih"}: $9 \\cdot 10^{${len - 1}} = ${tot}$\nBrez števke ${d}: prva števka ima ${d === 0 ? 9 : 8} možnosti, ostale po 9: $${d === 0 ? 9 : 8} \\cdot 9^{${len - 1}} = ${bez}$\nZ vsaj eno ${d}: $${tot} - ${bez} = ${tot - bez}$`,
        };
      }
      if (v === "narascajoce") {
        const len = r.pick([3, 4, 5, 6]), dec = r.next() < 0.5;
        const c = dec ? binom(10, len) : binom(9, len);
        const word = ["", "", "", "trimestnih", "štirimestnih", "petmestnih", "šestmestnih"][len];
        return {
          text: `Koliko je ${word} števil, pri katerih je vsaka števka ${dec ? "manjša" : "večja"} od prejšnje (npr. ${dec ? ["", "", "", "830", "9520", "86410", "975310"][len] : ["", "", "", "258", "1479", "13568", "234789"][len]})?`,
          answer: withMistakes(num(c), [[dec ? binom(9, len) : binom(10, len), dec ? "Pri padajočih števkah je lahko 0 zadnja števka." : "Ničla ne more biti nikjer: na prvem mestu ni dovoljena, za njo pa bi morale priti manjše števke."], [c * fact(len), "Ko izbereš števke, je vrstni red že določen."]]),
          hint: dec ? "Izberi množico števk (tudi 0 je dovoljena); padajoči vrstni red je en sam." : "Ničla ne more biti nikjer. Ko izbereš množico števk, je vrstni red določen.",
          data: false,
          formula: `\\binom{${dec ? 10 : 9}}{k}`,
          solution: `Števke so različne in izbrane iz ${dec ? "$\\{0, 1, \\ldots, 9\\}$" : "$\\{1, \\ldots, 9\\}$"}.\nVsaka izbira ${len} števk da natanko eno tako število.\nŠtevil je $\\binom{${dec ? 10 : 9}}{${len}} = ${c}$`,
        };
      }
      if (v === "palindrom") {
        const len = r.pick([4, 5, 6]);
        const div = r.pick([1, 2, 3, 5, 9]);
        let c = 0;
        for (let n = 10 ** (len - 1); n < 10 ** len; n++) {
          const s = String(n);
          if (s === [...s].reverse().join("") && n % div === 0) c++;
        }
        const all = 9 * 10 ** (Math.ceil(len / 2) - 1);
        const word = len === 4 ? "štirimestnih" : len === 5 ? "petmestnih" : "šestmestnih";
        return {
          text: `Palindrom je število, ki se z leve in desne bere enako (npr. 12321). Koliko je ${word} palindromov${div > 1 ? `, ki so deljivi z ${div}` : ""}?`,
          answer: withMistakes(num(c), [[div > 1 ? Math.round(all / div) : 10 ** Math.ceil(len / 2), div > 1 ? "Deljivost ni enakomerno razporejena; preštej natančno po pogoju za deljivost." : "Prva števka ne sme biti 0."], [div > 1 ? all : 9 * 10 ** (len - 1), div > 1 ? "Upoštevaj še pogoj deljivosti." : "Palindrom določa le prva polovica števk."]]),
          hint: `Palindrom je določen s prvo polovico števk.${div === 2 || div === 5 ? " Zadnja števka je enaka prvi." : div > 1 ? ` Za deljivost s ${div} poglej vsoto števk.` : ""}`,
          data: false,
          formula: false,
          solution: `Palindrom določa prvih ${Math.ceil(len / 2)} števk: prva od 1 do 9, ostale od 0 do 9, skupaj $${all}$ palindromov.${div > 1 ? `\n${div === 2 ? "Prva (in zadnja) števka mora biti soda: 2, 4, 6 ali 8." : div === 5 ? "Prva (in zadnja) števka mora biti 5." : `Vsota števk mora biti deljiva z ${div}.`}` : ""}\nSkupaj: $${c}$`,
        };
      }
      if (v === "besede") {
        const w = r.pick(["ANANAS", "BANANA", "KOKOS", "PAPRIKA", "KAKAV", "MATEMATIKA", "TABELA", "LOPATA", "KOLOKVIJ", "BARABA"]);
        const cnt = {};
        for (const ch of w) cnt[ch] = (cnt[ch] || 0) + 1;
        const reps = Object.entries(cnt).filter(([, k]) => k > 1);
        const val = fact(w.length) / reps.reduce((p, [, k]) => p * fact(k), 1);
        return {
          text: `Koliko različnih »besed« (tudi nesmiselnih) dobimo, če premešamo vse črke besede ${w} (${w.length} črk)?`,
          answer: withMistakes(num(val), [[fact(w.length), "Zamenjava dveh enakih črk ne da nove besede: deli s permutacijami ponovljenih črk."], [fact(w.length) / reps.reduce((p, [, k]) => p * k, 1), "Deliti moraš s fakultetami števila ponovitev ($k!$), ne s $k$."]]),
          hint: "Če bi bile vse črke različne, bi bilo besed $n!$. Koliko teh je enakih zaradi ponovljenih črk?",
          data: { given: [`n = ${w.length}`], find: ["N"] },
          formula: "N = \\dfrac{n!}{k_1!\\, k_2! \\cdots}",
          solution: `Črk je ${w.length}: $${w.length}! = ${fact(w.length)}$\nPonovljene črke: ${reps.map(([ch, k]) => `${ch} ${k}-krat`).join(", ")}\n$N = \\dfrac{${w.length}!}{${reps.map(([, k]) => `${k}!`).join(" \\cdot ")}} = ${val}$`,
        };
      }
      const a = r.int(3, 6), b = r.int(2, 5), via = r.next() < 0.5;
      const px = r.int(1, a - 1), py = r.int(1, b - 1);
      const val = via ? binom(px + py, px) * binom(a - px + b - py, a - px) : binom(a + b, a);
      return {
        text: `Mreža ulic je pravokotna. ${ime} gre od vogala $(0, 0)$ do vogala $(${a}, ${b})$ in se premika le po ${a + b} odsekih na desno ali navzgor${via ? `, spotoma pa se mora ustaviti pri pekarni na vogalu $(${px}, ${py})$` : ""}. Koliko različnih najkrajših poti ima?`,
        answer: withMistakes(num(val), [[a * b, "Pot je zaporedje premikov D in G; šteješ razporeditve teh premikov."], [via ? binom(a + b, a) : fact(a + b), via ? "Šteti moraš le poti skozi pekarno." : "Premiki v isto smer so med seboj enaki; deli z $a!\\,b!$."], [via ? binom(px + py, px) + binom(a - px + b - py, a - px) : 2 ** (a + b), via ? "Poti do pekarne in od nje zmnožiš, ne sešteješ." : `Ne smeš izbrati poljubnih smeri: desno mora iti natanko ${a}-krat.`]]),
        hint: via ? "Pot razdeli na dva dela: do pekarne in od pekarne naprej. Vsak del je izbira premikov D in G." : `Vsaka pot ima ${a} premikov desno in ${b} navzgor. Na koliko načinov razporediš te premike?`,
        data: { given: [`a = ${a}`, `b = ${b}`, ...(via ? [`P = (${px}, ${py})`] : [])], find: ["N"] },
        formula: via ? "N = \\binom{x+y}{x} \\binom{(a-x)+(b-y)}{a-x}" : "N = \\binom{a+b}{a}",
        solution: via
          ? `Do pekarne: $\\binom{${px + py}}{${px}} = ${binom(px + py, px)}$\nOd pekarne: $\\binom{${a - px + b - py}}{${a - px}} = ${binom(a - px + b - py, a - px)}$\n$N = ${binom(px + py, px)} \\cdot ${binom(a - px + b - py, a - px)} = ${val}$`
          : `Pot je zaporedje ${a + b} premikov, od tega ${a} desno.\nIzberemo, kateri so desno: $\\binom{${a + b}}{${a}}$\n$N = ${val}$`,
      };
    },
  },
  {
    id: "tek-razporeditve",
    topics: [T("razporeditve-in-izbire")],
    gen(level, r) {
      if (level === 1) {
        const n = r.int(4, 8);
        const [a, b] = r.shuffle(NAMES).slice(0, 2);
        return {
          text: `Skupina ${n} prijateljev, med njimi ${a} in ${b}, se posede v vrsto na ${nOf(n, "stol", "stola", "stole", "stolov")}. Na koliko načinov se lahko posedejo, če ${a} in ${b} želita sedeti ${g(a, "", "f") + g(b, "", "f") === "ff" ? "druga ob drugi" : "drug ob drugem"}?`,
          answer: num(2 * fact(n - 1)),
          hint: `»Zlepi« ${a} in ${b} v en blok. Koliko »oseb« potem razporejaš? Na koliko načinov sta lahko razporejena znotraj bloka?`,
          data: { given: [`n = ${n}`], find: ["\\text{število razporeditev}"] },
          formula: "2 \\cdot (n-1)!",
          solution: `Par obravnavamo kot en blok: razporejamo $${n - 1}$ enot, kar gre na $${n - 1}! = ${fact(n - 1)}$ načinov. Znotraj bloka sta lahko na 2 načina.\nSkupaj: $2 \\cdot ${fact(n - 1)} = ${2 * fact(n - 1)}$.`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const n = r.int(5, 8);
          const [a, b] = r.shuffle(NAMES).slice(0, 2);
          const ans = fact(n) - 2 * fact(n - 1);
          return {
            text: `${n} otrok, med njimi ${a} in ${b}, stoji v vrsti. Na koliko načinov se lahko postavijo, če ${a} in ${b} ne smeta stati ${g(a, "", "f") + g(b, "", "f") === "ff" ? "druga ob drugi" : "drug ob drugem"}?`,
            answer: num(ans),
            hint: "Preštej vse razporeditve in odštej tiste, kjer stojita skupaj.",
            data: { given: [`n = ${n}`], find: ["\\text{število razporeditev}"] },
            formula: "n! - 2 \\cdot (n-1)!",
            solution: `Vseh razporeditev je $${n}! = ${fact(n)}$. Skupaj stojita v $2 \\cdot ${n - 1}! = ${2 * fact(n - 1)}$ razporeditvah.\nOdgovor: $${fact(n)} - ${2 * fact(n - 1)} = ${ans}$.`,
          };
        }
        const f = r.int(4, 8), d = r.int(3, 7), k = r.int(3, 4);
        const ans = binom(f + d, k) - binom(f, k);
        return {
          text: `V razredu je ${f} fantov in ${d} deklet. Na koliko načinov lahko izberemo ${k}-člansko ekipo za tekmovanje, v kateri je vsaj eno dekle?`,
          answer: num(ans),
          hint: "Preštej vse ekipe in odštej tiste brez deklet.",
          data: { given: [`f = ${f}`, `d = ${d}`, `k = ${k}`], find: ["\\text{število ekip}"] },
          formula: "\\binom{f + d}{k} - \\binom{f}{k}",
          solution: `Vseh ekip: $\\binom{${f + d}}{${k}} = ${binom(f + d, k)}$. Ekip samo iz fantov: $\\binom{${f}}{${k}} = ${binom(f, k)}$.\nOdgovor: $${binom(f + d, k)} - ${binom(f, k)} = ${ans}$.`,
        };
      }
      const words = ["MATEMATIKA", "BANANA", "KENGURU", "ANANAS", "KOKOS", "PAPAGAJ", "TEKMOVANJE", "KAKADU", "RACUNALO", "LOGIKA"];
      const w = r.pick(words);
      const cnt = {};
      for (const ch of w) cnt[ch] = (cnt[ch] || 0) + 1;
      const rep = Object.entries(cnt).filter(([, c]) => c > 1);
      const ans = fact(w.length) / rep.reduce((p, [, c]) => p * fact(c), 1);
      return {
        text: `Koliko različnih »besed« (zaporedij črk, ki nimajo nujno pomena) lahko sestavimo iz vseh črk besede ${w}, če vsako črko porabimo natanko tolikokrat, kot se pojavi v besedi?`,
        answer: num(ans),
        hint: "Če bi bile vse črke različne, bi bilo razporeditev $n!$. Enake črke med sabo zamenjane dajo isto besedo, zato deli.",
        data: false,
        formula: "\\dfrac{n!}{k_1! \\, k_2! \\cdots}",
        solution: `Beseda ima ${w.length} črk; ${rep.length ? `ponavljajo se ${rep.map(([ch, c]) => `${ch} (${c}-krat)`).join(", ")}` : "vse so različne"}.\nŠtevilo besed: $\\dfrac{${w.length}!}{${rep.map(([, c]) => `${c}!`).join(" \\cdot ") || "1"}} = ${ans}$.`,
      };
    },
  },
  {
    id: "tek-poti-liki",
    topics: [T("stetje-poti-in-likov")],
    gen(level, r) {
      if (level === 1) {
        const m = r.int(3, 7), n = r.int(2, 6);
        return {
          text: `Mesto ima pravokotno mrežo ulic. Do šole mora Ana prehoditi ${nOf(m, "blok", "bloka", "bloke", "blokov")} proti vzhodu in ${n} proti severu. Na koliko različnih najkrajših poti lahko pride do šole?`,
          answer: num(binom(m + n, n)),
          hint: "Vsaka najkrajša pot je zaporedje korakov V in S. Koliko je korakov in koliko izmed njih je S?",
          data: { given: [`m = ${m}`, `n = ${n}`], find: ["\\text{število poti}"] },
          formula: "\\binom{m + n}{n}",
          solution: `Vsaka pot ima $${m + n}$ korakov, od tega ${n} proti severu. Pot določimo, ko izberemo, kateri koraki gredo na sever: $\\binom{${m + n}}{${n}} = ${binom(m + n, n)}$.`,
        };
      }
      if (level === 2) {
        const m = r.int(4, 7), n = r.int(3, 6);
        const cx = r.int(1, m - 1), cy = r.int(1, n - 1);
        const through = binom(cx + cy, cy) * binom(m - cx + n - cy, n - cy);
        const avoid = r.next() < 0.5;
        const total = binom(m + n, n);
        return {
          text: `Na mreži gremo od točke $A(0, 0)$ do točke $B(${m}, ${n})$ samo s koraki za 1 v desno ali navzgor. Koliko je poti, ki ${avoid ? "se izognejo točki" : "gredo skozi točko"} $C(${cx}, ${cy})$?`,
          answer: num(avoid ? total - through : through),
          hint: `Poti skozi $C$: pot od $A$ do $C$ in nato od $C$ do $B$ (pravilo produkta).${avoid ? " Izognejo se ji vse ostale." : ""}`,
          data: { given: [`B = (${m}, ${n})`, `C = (${cx}, ${cy})`], find: ["\\text{število poti}"] },
          formula: ["\\text{poti do } (x, y) = \\binom{x + y}{y}", "\\text{skozi } C = (A \\to C) \\cdot (C \\to B)"],
          solution: `Od $A$ do $C$: $\\binom{${cx + cy}}{${cy}} = ${binom(cx + cy, cy)}$, od $C$ do $B$: $\\binom{${m - cx + n - cy}}{${n - cy}} = ${binom(m - cx + n - cy, n - cy)}$. Skozi $C$: $${through}$.${
            avoid ? `\nVseh poti je $\\binom{${m + n}}{${n}} = ${total}$, mimo $C$: $${total} - ${through} = ${total - through}$.` : ""
          }`,
        };
      }
      const v = r.pick(["pravokotniki", "kvadrati", "trikotniki"]);
      if (v === "pravokotniki") {
        const m = r.int(2, 6), n = r.int(2, 6);
        const ans = binom(m + 1, 2) * binom(n + 1, 2);
        return {
          text: `Koliko pravokotnikov (vseh velikosti, tudi kvadratov) je na mreži iz ${m} × ${n} enotskih kvadratkov?`,
          answer: num(ans),
          hint: "Pravokotnik je določen z izbiro dveh navpičnih in dveh vodoravnih črt mreže.",
          data: { given: [`m = ${m}`, `n = ${n}`], find: ["\\text{število pravokotnikov}"] },
          formula: "\\binom{m+1}{2} \\binom{n+1}{2}",
          solution: `Navpičnih črt je ${m + 1}, vodoravnih ${n + 1}. Izbira dveh navpičnih: $\\binom{${m + 1}}{2} = ${binom(m + 1, 2)}$, dveh vodoravnih: $\\binom{${n + 1}}{2} = ${binom(n + 1, 2)}$.\nPravokotnikov: $${binom(m + 1, 2)} \\cdot ${binom(n + 1, 2)} = ${ans}$.`,
        };
      }
      if (v === "kvadrati") {
        const n = r.int(3, 9);
        let s = 0;
        for (let k = 1; k <= n; k++) s += k * k;
        return {
          text: `Koliko kvadratov (vseh velikosti) je na mreži ${n} × ${n} enotskih kvadratkov?`,
          answer: num(s),
          hint: "Koliko je kvadratov velikosti 1 × 1, koliko 2 × 2 …?",
          data: { given: [`n = ${n}`], find: ["\\text{število kvadratov}"] },
          formula: "1^2 + 2^2 + \\ldots + n^2",
          solution: `Kvadratov velikosti $k \\times k$ je $(${n} - k + 1)^2$. Skupaj: $${Array.from({ length: n }, (_, i) => `${n - i}^2`).join(" + ")} = ${s}$.`,
        };
      }
      const p = r.int(3, 7), q = r.int(3, 7);
      const ans = binom(p, 2) * q + binom(q, 2) * p;
      return {
        text: `Na eni premici je ${p} točk, na drugi, vzporedni premici pa ${q} točk. Koliko trikotnikov ima oglišča v teh točkah?`,
        answer: num(ans),
        hint: "Trikotnik ima dve oglišči na eni premici in eno na drugi (tri na isti premici ne tvorijo trikotnika).",
        data: { given: [`p = ${p}`, `q = ${q}`], find: ["\\text{število trikotnikov}"] },
        formula: "\\binom{p}{2} q + \\binom{q}{2} p",
        solution: `Dve oglišči na prvi in eno na drugi: $\\binom{${p}}{2} \\cdot ${q} = ${binom(p, 2) * q}$. Dve na drugi in eno na prvi: $\\binom{${q}}{2} \\cdot ${p} = ${binom(q, 2) * p}$.\nSkupaj: $${ans}$.`,
      };
    },
  },
  {
    id: "tek-koti-os",
    topics: [T("lovljenje-kotov")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.5) {
          const n = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
          const ang = (180 * (n - 2)) / n;
          return {
            text: `Notranji kot pravilnega mnogokotnika meri $${tx(ang)}^\\circ$. Koliko diagonal ima ta mnogokotnik?`,
            answer: num((n * (n - 3)) / 2),
            hint: "Najprej iz zunanjega kota ($180^\\circ$ minus notranji) ugotovi število stranic. Iz vsakega oglišča gre $n - 3$ diagonal.",
            data: { given: [`\\alpha = ${tx(ang)}^\\circ`], find: ["\\text{število diagonal}"] },
            formula: ["n = \\dfrac{360^\\circ}{180^\\circ - \\alpha}", "d = \\dfrac{n(n-3)}{2}"],
            solution: `Zunanji kot: $180^\\circ - ${tx(ang)}^\\circ = ${tx(180 - ang)}^\\circ$, zato je $n = \\dfrac{360^\\circ}{${tx(180 - ang)}^\\circ} = ${n}$.\nDiagonal: $\\dfrac{${n} \\cdot ${n - 3}}{2} = ${(n * (n - 3)) / 2}$.`,
          };
        }
        const n = r.pick([5, 6, 8, 9, 10, 12]);
        return {
          text: `V pravilnem ${n}-kotniku $A_1 A_2 \\ldots A_{${n}}$ narišemo diagonali $A_1 A_3$ in $A_2 A_4$, ki se sekata v točki $P$. Koliko stopinj meri ostri kot med diagonalama?`,
          answer: num(360 / n, "°", null, { unitAlternatives: ["stopinj", "°"] }),
          hint: "Mnogokotniku očrtaj krog. Kot med tetivama, ki se sekata v krogu, je polovica vsote lokov, ki ju kot in njegov sovršni kot zajemata.",
          data: { given: [`n = ${n}`], find: ["\\angle A_1 P A_2"] },
          formula: "\\angle A_1 P A_2 = \\tfrac{1}{2}(\\text{lok } A_1A_2 + \\text{lok } A_3A_4)",
          solution: `Vsaka stranica pravilnega ${n}-kotnika odreže lok $\\dfrac{360^\\circ}{${n}} = ${tx(360 / n)}^\\circ$.\nKot med tetivama: $\\tfrac{1}{2}(${tx(360 / n)}^\\circ + ${tx(360 / n)}^\\circ) = ${tx(360 / n)}^\\circ$.`,
        };
      }
      if (level === 2) {
        let a, b;
        do (a = r.int(30, 100)), (b = r.int(30, 100));
        while ((a + b) % 2 || a + b >= 170);
        const ans = 180 - (a + b) / 2;
        return {
          text: `V trikotniku $ABC$ meri kot pri $A$ $${a}^\\circ$, kot pri $B$ pa $${b}^\\circ$. Simetrali notranjih kotov pri $A$ in $B$ se sekata v točki $S$. Koliko meri kot $\\angle ASB$?`,
          answer: num(ans, "°", null, { unitAlternatives: ["stopinj"] }),
          hint: "V trikotniku $ABS$ poznaš polovici kotov pri $A$ in $B$.",
          data: { given: [`\\alpha = ${a}^\\circ`, `\\beta = ${b}^\\circ`], find: ["\\angle ASB"] },
          formula: "\\angle ASB = 180^\\circ - \\dfrac{\\alpha}{2} - \\dfrac{\\beta}{2}",
          solution: `V trikotniku $ABS$ sta kota $\\dfrac{${a}^\\circ}{2} = ${tx(a / 2)}^\\circ$ in $\\dfrac{${b}^\\circ}{2} = ${tx(b / 2)}^\\circ$.\n$\\angle ASB = 180^\\circ - ${tx(a / 2)}^\\circ - ${tx(b / 2)}^\\circ = ${tx(ans)}^\\circ$ (to je tudi $90^\\circ + \\tfrac{\\gamma}{2}$).`,
        };
      }
      // Enakokraki trikotnik z dodano točko: AB = AC, D na AC, BD = BC.
      const top = r.pick([20, 24, 28, 30, 36, 40, 44, 48, 52]);
      const base = (180 - top) / 2; // kota ob osnovnici
      const ang = 180 - 2 * base; // kot CBD v enakokrakem BCD (BD = BC): kota ob C in D sta base
      return {
        text: `V trikotniku $ABC$ je $AB = AC$ in $\\angle BAC = ${top}^\\circ$. Na stranici $AC$ leži točka $D$, da je $BD = BC$. Koliko stopinj meri kot $\\angle ABD$?`,
        answer: num(base - ang, "°", null, { unitAlternatives: ["stopinj"] }),
        hint: "Najprej izračunaj kota ob osnovnici trikotnika $ABC$. Nato opazi, da je trikotnik $BCD$ enakokrak.",
        data: { given: [`\\angle BAC = ${top}^\\circ`], find: ["\\angle ABD"] },
        formula: ["\\text{vsota kotov v trikotniku} = 180^\\circ", "\\text{v enakokrakem trikotniku sta kota ob osnovnici enaka}"],
        solution: `$\\angle ABC = \\angle ACB = \\dfrac{180^\\circ - ${top}^\\circ}{2} = ${tx(base)}^\\circ$.\nTrikotnik $BCD$ je enakokrak ($BD = BC$), zato $\\angle BDC = \\angle BCD = ${tx(base)}^\\circ$ in $\\angle CBD = 180^\\circ - 2 \\cdot ${tx(base)}^\\circ = ${tx(ang)}^\\circ$.\n$\\angle ABD = ${tx(base)}^\\circ - ${tx(ang)}^\\circ = ${tx(base - ang)}^\\circ$.`,
      };
    },
  },
  {
    id: "tek-ploscine-os",
    topics: [T("ploscine-z-razrezom-in-dopolnjevanjem")],
    gen(level, r) {
      if (level === 1) {
        const a = r.int(4, 20);
        const k = r.pick([2, 3]);
        if (k === 2) {
          return {
            text: `Kvadrat ima stranico ${a} cm. Razpolovišča njegovih stranic povežemo, da dobimo manjši kvadrat. Kolikšna je ploščina manjšega kvadrata?`,
            answer: num((a * a) / 2, "cm²", 1, { unitAlternatives: ["cm2"] }),
            hint: "Nariši diagonali manjšega kvadrata. Na koliko enakih trikotnikov razpade veliki kvadrat?",
            data: { given: [`a = ${a}\\ \\mathrm{cm}`], find: ["p"] },
            formula: "p = \\dfrac{a^2}{2}",
            solution: `Veliki kvadrat razpade na 8 enakih trikotnikov, manjši kvadrat jih vsebuje 4, torej polovico ploščine.\n$p = \\dfrac{${a}^2}{2} ${res((a * a) / 2, 1, "cm²")}$.`,
          };
        }
        const b = r.int(4, 20);
        return {
          text: `Pravokotnik $ABCD$ ima stranici $AB = ${a}$ cm in $BC = ${b}$ cm. Točka $E$ leži kjer koli na stranici $CD$. Kolikšna je ploščina trikotnika $ABE$?`,
          answer: num((a * b) / 2, "cm²", 1, { unitAlternatives: ["cm2"] }),
          hint: "Osnovnica trikotnika je $AB$. Kolikšna je višina na to osnovnico, kjer koli je $E$?",
          data: { given: [`AB = ${a}\\ \\mathrm{cm}`, `BC = ${b}\\ \\mathrm{cm}`], find: ["p_{ABE}"] },
          formula: "p = \\dfrac{a \\cdot v_a}{2}",
          solution: `Višina trikotnika na $AB$ je vedno enaka $BC = ${b}$ cm.\n$p = \\dfrac{${a} \\cdot ${b}}{2} ${res((a * b) / 2, 1, "cm²")}$ (polovica pravokotnika).`,
        };
      }
      if (level === 2) {
        const W = r.int(8, 16), H = r.int(6, 12);
        const cuts = [[r.int(1, 4), r.int(1, 4)], [r.int(1, 4), r.int(1, 4)]];
        const area = W * H - cuts.reduce((s, [p, q]) => s + (p * q) / 2, 0);
        return {
          text: `Iz pravokotnika z dolžino ${W} cm in širino ${H} cm odrežemo dva vogala: na enem vogalu pravokotni trikotnik s katetama ${cuts[0][0]} cm in ${cuts[0][1]} cm, na drugem vogalu pravokotni trikotnik s katetama ${cuts[1][0]} cm in ${cuts[1][1]} cm. Kolikšna je ploščina nastalega šestkotnika?`,
          answer: num(area, "cm²", 1, { unitAlternatives: ["cm2"] }),
          hint: "Od ploščine pravokotnika odštej ploščini odrezanih trikotnikov.",
          data: { given: [`a = ${W}\\ \\mathrm{cm}`, `b = ${H}\\ \\mathrm{cm}`], find: ["p"] },
          formula: ["p = a \\cdot b - p_1 - p_2", "p_{\\triangle} = \\dfrac{k_1 \\cdot k_2}{2}"],
          solution: `$p = ${W} \\cdot ${H} - \\dfrac{${cuts[0][0]} \\cdot ${cuts[0][1]}}{2} - \\dfrac{${cuts[1][0]} \\cdot ${cuts[1][1]}}{2} = ${W * H} - ${tx((cuts[0][0] * cuts[0][1]) / 2)} - ${tx((cuts[1][0] * cuts[1][1]) / 2)} ${res(area, 1, "cm²")}$.`,
        };
      }
      const a = r.int(6, 16);
      const p = r.int(1, a - 1), q = r.int(1, a - 1);
      // Kvadrat ABCD, E na AB z AE = p, F na BC z BF = q; ploščina trikotnika DEF.
      const area = a * a - (a * p) / 2 - ((a - p) * q) / 2 - (a * (a - q)) / 2;
      return {
        text: `Kvadrat $ABCD$ ima stranico ${a} cm. Točka $E$ leži na stranici $AB$ tako, da je $AE = ${p}$ cm, točka $F$ pa na stranici $BC$ tako, da je $BF = ${q}$ cm. Kolikšna je ploščina trikotnika $DEF$?`,
        answer: num(area, "cm²", 1, { unitAlternatives: ["cm2"] }),
        hint: "Trikotnik $DEF$ dobiš, ko od kvadrata odrežeš tri pravokotne trikotnike ob ogliščih $A$, $B$ in $C$.",
        data: { given: [`a = ${a}\\ \\mathrm{cm}`, `AE = ${p}\\ \\mathrm{cm}`, `BF = ${q}\\ \\mathrm{cm}`], find: ["p_{DEF}"] },
        formula: "p_{DEF} = a^2 - p_{ADE} - p_{EBF} - p_{FCD}",
        solution: `$p_{ADE} = \\dfrac{${a} \\cdot ${p}}{2} = ${tx((a * p) / 2)}$, $p_{EBF} = \\dfrac{${a - p} \\cdot ${q}}{2} = ${tx(((a - p) * q) / 2)}$, $p_{FCD} = \\dfrac{${a} \\cdot ${a - q}}{2} = ${tx((a * (a - q)) / 2)}$ (v cm²).\n$p_{DEF} = ${a * a} - ${tx((a * p) / 2)} - ${tx(((a - p) * q) / 2)} - ${tx((a * (a - q)) / 2)} ${res(area, 1, "cm²")}$.`,
      };
    },
  },
  {
    id: "tek-pitagora-os",
    topics: [T("pitagorov-izrek-v-tekmovalnih-nalogah")],
    gen(level, r) {
      if (level === 1) {
        const [a, b] = r.pick([[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [7, 24], [2, 3], [1, 5], [4, 7]]);
        const x1 = r.int(-5, 5), y1 = r.int(-5, 5);
        const [dx, dy] = r.next() < 0.5 ? [a, b] : [b, a];
        const d = Math.sqrt(a * a + b * b);
        return {
          text: `V koordinatnem sistemu z enoto 1 cm sta točki $A(${x1}, ${y1})$ in $B(${x1 + dx}, ${y1 - dy})$. Kolikšna je razdalja $|AB|$? Zaokroži na dve decimalki.`,
          answer: num(d, "cm", 2),
          hint: "Nariši pravokotni trikotnik, katerega kateti sta vodoravna in navpična razlika koordinat.",
          data: { given: [`A = (${x1}, ${y1})`, `B = (${x1 + dx}, ${y1 - dy})`], find: ["|AB|"] },
          formula: "|AB| = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
          solution: `Kateti: $|${x1 + dx} - ${par(x1)}| = ${dx}$ in $|${y1 - dy} - ${par(y1)}| = ${dy}$.\n$|AB| = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${a * a + b * b}} ${res(d, 2, "cm")}$.`,
        };
      }
      if (level === 2) {
        const [L, p1, p2] = r.pick([[25, 7, 15], [25, 15, 20], [13, 5, 12], [50, 14, 30], [50, 30, 40], [65, 16, 25], [65, 25, 33], [65, 33, 39], [85, 13, 36], [85, 40, 51], [10, 6, 8]]);
        const h1 = Math.sqrt(L * L - p1 * p1), h2 = Math.sqrt(L * L - p2 * p2);
        const scale = L > 20 ? "dm" : "m";
        return {
          text: `Lestev dolžine ${L} ${scale} sloni ob navpičnem zidu, njen spodnji konec je ${p1} ${scale} od zidu. Spodnji konec odmaknemo, da je ${p2} ${scale} od zidu. Za koliko se spusti zgornji konec lestve?`,
          answer: num(h1 - h2, scale, 2),
          hint: "Pred premikom in po njem izračunaj višino zgornjega konca s Pitagorovim izrekom.",
          data: { given: [`L = ${L}\\ \\mathrm{${scale}}`, `d_1 = ${p1}\\ \\mathrm{${scale}}`, `d_2 = ${p2}\\ \\mathrm{${scale}}`], find: ["\\Delta h"] },
          formula: ["h = \\sqrt{L^2 - d^2}", "\\Delta h = h_1 - h_2"],
          solution: `$h_1 = \\sqrt{${L}^2 - ${p1}^2} = ${tx(h1, 2)}$, $h_2 = \\sqrt{${L}^2 - ${p2}^2} = ${tx(h2, 2)}$ (v ${scale}).\n$\\Delta h = ${tx(h1, 2)} - ${tx(h2, 2)} ${res(h1 - h2, 2, scale)}$.`,
        };
      }
      const [a, b, c] = r.shuffle([r.int(2, 9), r.int(2, 9), r.int(2, 9)]);
      const opts = [Math.hypot(a + b, c), Math.hypot(a + c, b), Math.hypot(b + c, a)];
      const best = Math.min(...opts);
      return {
        text: `Kvader ima robove ${a} cm, ${b} cm in ${c} cm. Mravlja gre po površju kvadra iz enega oglišča v nasprotno oglišče (skozi notranjost ne more). Kolikšna je najkrajša možna pot? Zaokroži na dve decimalki.`,
        answer: num(best, "cm", 2),
        hint: "Razgrni dve sosednji ploskvi v ravnino, da pot postane daljica. Preizkusi vse tri možne razgrnitve.",
        data: { given: [`a = ${a}\\ \\mathrm{cm}`, `b = ${b}\\ \\mathrm{cm}`, `c = ${c}\\ \\mathrm{cm}`], find: ["d_{\\min}"] },
        formula: "d = \\sqrt{(a + b)^2 + c^2} \\text{ (in še dve podobni razgrnitvi)}",
        solution: `Razgrnitve dajo daljice: $\\sqrt{(${a}+${b})^2 + ${c}^2} = ${tx(opts[0], 2)}$, $\\sqrt{(${a}+${c})^2 + ${b}^2} = ${tx(opts[1], 2)}$, $\\sqrt{(${b}+${c})^2 + ${a}^2} = ${tx(opts[2], 2)}$.\nNajkrajša je $d_{\\min} ${res(best, 2, "cm")}$ (najdaljši rob ostane sam, druga dva seštejemo).`,
      };
    },
  },
  {
    id: "tek-simetrija-os",
    topics: [T("simetrija-vrtenje-in-tlakovanje")],
    gen(level, r) {
      if (level === 1) {
        const n = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]);
        const k = r.int(2, 5);
        return {
          text: `Pravilni ${n}-kotnik vrtimo okoli njegovega središča. Pri nekaterih kotih vrtenja se preslika sam vase. Koliko meri ${k}. najmanjši tak pozitivni kot?`,
          answer: num((360 / n) * k, "°", null, { unitAlternatives: ["stopinj"] }),
          hint: "Najmanjši kot, pri katerem se pravilni mnogokotnik preslika vase, je $360^\\circ$ deljeno s številom stranic. Vsi drugi so njegovi večkratniki.",
          data: { given: [`n = ${n}`, `k = ${k}`], find: ["\\varphi_k"] },
          formula: "\\varphi_k = k \\cdot \\dfrac{360^\\circ}{n}",
          solution: `Takih kotov je ${n}: $\\dfrac{360^\\circ}{${n}} = ${tx(360 / n)}^\\circ$ in njegovi večkratniki do $360^\\circ$.\n${k}. najmanjši: $${k} \\cdot ${tx(360 / n)}^\\circ = ${tx((360 / n) * k)}^\\circ$.`,
        };
      }
      if (level === 2) {
        const h = r.int(1, 11), m = r.pick([5, 10, 15, 20, 25, 35, 40, 45, 50, 55]);
        let tot = (12 * 60 - (h * 60 + m)) % 720;
        const rh = Math.floor(tot / 60) || 12, rm = tot % 60;
        const fmtT = (H, M) => `${H}.${String(M).padStart(2, "0")}`;
        const correct = fmtT(rh, rm);
        const opts = choiceAns(r, correct, [fmtT(h, m), fmtT(12 - h || 12, m), fmtT(rh, (60 - m) % 60), fmtT((rh % 12) + 1, rm)]);
        return {
          text: `Ura s kazalci (brez številk, z oznakami ur) se vidi v ogledalu. Na sliki v ogledalu je videti, kot da kaže ${fmtT(h, m)}. Koliko je ura v resnici?`,
          answer: opts,
          hint: "Ogledalo zamenja levo in desno: kazalec, ki je videti pri $x$ minutah, je v resnici pri $60 - x$. Prava in zrcalna ura skupaj dasta 12.00.",
          data: false,
          formula: "\\text{prava ura} = 12.00 - \\text{zrcalna ura}",
          solution: `Zrcaljenje čez navpično os da: prava ura + zrcalna ura = 12.00.\n$12.00 - ${fmtT(h, m)} = ${correct}$.`,
        };
      }
      const configs = [[[3, 12], 12], [[4, 6], 12], [[4, 8], 8], [[3, 3, 4], 12], [[3, 3, 6], 6], [[3, 4, 4], 6], [[5, 5], 10], [[3, 8], 24], [[3, 9], 18], [[3, 10], 15], [[4, 5], 20], [[3, 7], 42]];
      const [known, n] = r.pick(configs);
      const angle = (k) => (180 * (k - 2)) / k;
      const sum = known.reduce((s, k) => s + angle(k), 0);
      const names = { 3: ["pravilni trikotnik", "dva pravilna trikotnika"], 4: ["kvadrat", "dva kvadrata"], 5: ["pravilni petkotnik", "dva pravilna petkotnika"], 6: ["pravilni šestkotnik", "dva pravilna šestkotnika"], 7: ["pravilni sedemkotnik"], 8: ["pravilni osemkotnik", "dva pravilna osemkotnika"], 9: ["pravilni devetkotnik"], 10: ["pravilni desetkotnik"], 12: ["pravilni dvanajstkotnik", "dva pravilna dvanajstkotnika"] };
      const groups = [...new Set(known)].map((k) => names[k][known.filter((x) => x === k).length - 1]);
      const list = groups.length > 1 ? `${groups.slice(0, -1).join(", ")} in ${groups[groups.length - 1]}` : groups[0];
      return {
        text: `Okoli ene točke se brez vrzeli in prekrivanja stikajo ${list} ter še en pravilni $n$-kotnik. Koliko je $n$?`,
        answer: num(n),
        hint: "Notranji kot pravilnega $k$-kotnika je $\\dfrac{180^\\circ (k-2)}{k}$. Vsota kotov okoli točke je $360^\\circ$.",
        data: false,
        formula: ["\\alpha_k = \\dfrac{180^\\circ (k-2)}{k}", "n = \\dfrac{360^\\circ}{180^\\circ - \\alpha}"],
        solution: `Znani koti: ${known.map((k) => `$${tx(angle(k), 2)}^\\circ$`).join(" + ")} $= ${tx(sum, 2)}^\\circ$. Za $n$-kotnik ostane $\\alpha = 360^\\circ - ${tx(sum, 2)}^\\circ = ${tx(360 - sum, 2)}^\\circ$.\nZunanji kot $180^\\circ - ${tx(360 - sum, 2)}^\\circ = ${tx(sum - 180, 2)}^\\circ$, zato $n = \\dfrac{360^\\circ}{${tx(sum - 180, 2)}^\\circ} = ${n}$.`,
      };
    },
  },
  {
    id: "tek-delo-hitrost",
    topics: [T("delo-hitrost-in-mesanice")],
    gen(level, r) {
      if (level === 1) {
        const set = r.pick([[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [6, 3], [2, 3, 6], [4, 6, 12], [6, 10, 15], [10, 15, 30]]);
        const inv = set.reduce((s, x) => s + 1 / x, 0);
        const t = Math.round(1 / inv);
        const who = r.shuffle(NAMES).slice(0, set.length);
        return {
          text: `${who.map((w, i) => `${w} sam${g(w, "", "a")} prepleska ograjo v ${set[i]} urah`).join(", ").replace(/, ([^,]*)$/, " in $1")}. ${set.length === 2 ? "V koliko urah jo prepleskata, če delata skupaj?" : "V koliko urah jo prepleskajo, če delajo vsi hkrati?".replace("vsi", who.every((w) => g(w, 0, 1)) ? "vse" : "vsi")}`,
          answer: num(t, "h", null, { unitAlternatives: ["ur", "ure", "h"] }),
          hint: "V eni uri vsak naredi del ograje (npr. $\\tfrac{1}{3}$). Seštej dele.",
          data: { given: set.map((x, i) => `t_${i + 1} = ${x}\\ \\mathrm{h}`), find: ["t"] },
          formula: "\\dfrac{1}{t} = \\dfrac{1}{t_1} + \\dfrac{1}{t_2} + \\ldots",
          solution: `V eni uri skupaj naredijo $${set.map((x) => `\\tfrac{1}{${x}}`).join(" + ")} = \\tfrac{1}{${t}}$ ograje.\nCelo ograjo prepleskajo v $${t}$ urah.`,
        };
      }
      if (level === 2) {
        const [v1, v2] = r.pick([[40, 60], [30, 60], [60, 90], [20, 30], [45, 90], [12, 6], [15, 10], [60, 40], [80, 120], [24, 8]]);
        const vp = (2 * v1 * v2) / (v1 + v2);
        return {
          text: `Avto pelje iz kraja A v kraj B s povprečno hitrostjo ${v1} km/h, nazaj po isti cesti pa s povprečno hitrostjo ${v2} km/h. Kolikšna je povprečna hitrost za celo pot tja in nazaj?`,
          answer: num(vp, "km/h", 1),
          hint: "Povprečna hitrost je celotna pot deljeno s celotnim časom, ne povprečje hitrosti. Izberi razdaljo, npr. $s$, in izračunaj oba časa.",
          data: { given: [`v_1 = ${v1}\\ \\mathrm{km/h}`, `v_2 = ${v2}\\ \\mathrm{km/h}`], find: ["\\bar{v}"] },
          formula: "\\bar{v} = \\dfrac{2s}{\\frac{s}{v_1} + \\frac{s}{v_2}} = \\dfrac{2 v_1 v_2}{v_1 + v_2}",
          solution: `$\\bar{v} = \\dfrac{2 \\cdot ${v1} \\cdot ${v2}}{${v1} + ${v2}} ${res(vp, 1, "km/h")}$ (manj od povprečja ${tx((v1 + v2) / 2)} km/h, ker počasneje vozi dlje časa).`,
        };
      }
      if (r.next() < 0.5) {
        const y = r.pick([5, 10, 15, 20]), x = r.pick([40, 50, 60, 80]), z = r.pick([25, 30, 35]);
        const V = r.int(2, 12);
        const add = (V * (z - y)) / (x - z);
        return {
          text: `Imamo ${V} litrov ${y}-odstotne sokove mešanice. Koliko litrov ${x}-odstotne mešanice moramo doliti, da dobimo ${z}-odstotno mešanico?`,
          answer: num(add, "l", 2, { unitAlternatives: ["l", "L", "litrov"] }),
          hint: "Količina čistega soka se pri mešanju ohrani. Zapiši enačbo za čisti sok pred mešanjem in po njem.",
          data: { given: [`V = ${V}\\ \\mathrm{l}`, `p_1 = ${y}\\ \\%`, `p_2 = ${x}\\ \\%`, `p = ${z}\\ \\%`], find: ["x"] },
          formula: "p_1 V + p_2 x = p (V + x)",
          solution: `$${y} \\cdot ${V} + ${x} \\cdot x = ${z} \\cdot (${V} + x)$\n$(${x} - ${z})\\,x = (${z} - ${y}) \\cdot ${V}$\n$x = \\dfrac{${z - y} \\cdot ${V}}{${x - z}} ${res(add, 2, "l")}$.`,
        };
      }
      const v1 = r.pick([4, 5, 6]), v2 = r.pick([12, 15, 18, 20]), dt = r.pick([10, 15, 20, 30]);
      const head = (v1 * dt) / 60;
      const t = head / (v2 - v1);
      const [a, b] = r.shuffle(NAMES).slice(0, 2);
      return {
        text: `${a} gre peš iz šole s hitrostjo ${v1} km/h. ${dt} minut pozneje se po isti poti odpelje za ${g(a, "njim", "njo")} ${b} s kolesom s hitrostjo ${v2} km/h. Čez koliko minut po svojem odhodu ${b} dohiti ${a === "Ana" ? "Ano" : g(a, a + "a", a.replace(/a$/, "o"))}?`,
        answer: num(t * 60, "min", 1, { unitAlternatives: ["minut", "min"] }),
        hint: "Koliko je pešec že prehodil, ko kolesar štarta? Za koliko kolesar vsako uro zmanjša razliko?",
        data: { given: [`v_1 = ${v1}\\ \\mathrm{km/h}`, `v_2 = ${v2}\\ \\mathrm{km/h}`, `\\Delta t = ${dt}\\ \\mathrm{min}`], find: ["t"] },
        formula: ["s_0 = v_1 \\Delta t", "t = \\dfrac{s_0}{v_2 - v_1}"],
        solution: `V ${dt} minutah pešec prehodi $${v1} \\cdot \\tfrac{${dt}}{60} = ${tx(head, 3)}$ km.\nKolesar razliko zmanjšuje s hitrostjo $${v2} - ${v1} = ${v2 - v1}$ km/h.\n$t = \\dfrac{${tx(head, 3)}}{${v2 - v1}}\\ \\mathrm{h} ${res(t * 60, 1, "min")}$.`,
      };
    },
  },
  {
    id: "tek-ure-koledar",
    topics: [T("starosti-ure-in-koledar")],
    gen(level, r) {
      if (level === 1) {
        const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const mNames = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];
        const mGen = ["januarja", "februarja", "marca", "aprila", "maja", "junija", "julija", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
        const start = r.int(0, 6);
        const m = r.int(1, 11), d = r.int(1, months[m]);
        const offset = months.slice(0, m).reduce((a, b) => a + b, 0) + d - 1;
        const day = DAYS[(start + offset) % 7];
        const opts = choiceAns(r, day, r.shuffle(DAYS.filter((x) => x !== day)));
        return {
          text: `V nekem letu, ki ni prestopno, je bil 1. januar ${DAYS[start]}. Kateri dan v tednu je bil ${d}. ${mGen[m]} istega leta?`,
          answer: opts,
          hint: "Preštej, koliko dni mine od 1. januarja do iskanega dne, in poišči ostanek pri deljenju s 7.",
          data: false,
          formula: "\\text{dan v tednu se ponovi vsakih } 7 \\text{ dni}",
          solution: `Od 1. januarja do ${d}. ${mGen[m]} mine ${offset} dni (${m === 1 ? "januar" : `januar … ${mNames[m - 1]}`}: ${months.slice(0, m).join(" + ")} dni, nato še ${d - 1}).\n$${offset} = 7 \\cdot ${Math.floor(offset / 7)} + ${offset % 7}$: cele tedne preskočimo in se od dneva 1. januarja (${DAYS[start]}) pomaknemo še za ${offset % 7} dni naprej. To je ${day}.`,
        };
      }
      if (level === 2) {
        const h = r.int(1, 11), m = r.int(1, 59);
        let ang = Math.abs(30 * h - 5.5 * m);
        if (ang > 180) ang = 360 - ang;
        return {
          text: `Koliko stopinj meri manjši kot med urnim in minutnim kazalcem ob ${h}.${String(m).padStart(2, "0")}?`,
          answer: num(ang, "°", 1, { unitAlternatives: ["stopinj"] }),
          hint: "Minutni kazalec se v minuti premakne za $6^\\circ$, urni za $0{,}5^\\circ$. Kje sta oba kazalca glede na številko 12?",
          data: { given: [`h = ${h}`, `m = ${m}`], find: ["\\varphi"] },
          formula: ["\\varphi_{\\text{min}} = 6^\\circ \\cdot m", "\\varphi_{\\text{ura}} = 30^\\circ \\cdot h + 0{,}5^\\circ \\cdot m"],
          solution: `Minutni kazalec: $6^\\circ \\cdot ${m} = ${6 * m}^\\circ$. Urni: $30^\\circ \\cdot ${h} + 0{,}5^\\circ \\cdot ${m} = ${tx(30 * h + 0.5 * m)}^\\circ$.\nRazlika: $${tx(Math.abs(30 * h + 0.5 * m - 6 * m))}^\\circ$${Math.abs(30 * h - 5.5 * m) > 180 ? `, manjši kot je $360^\\circ - ${tx(Math.abs(30 * h - 5.5 * m))}^\\circ = ${tx(ang)}^\\circ$` : ""}.`,
        };
      }
      const k = r.int(2, 5), x = r.int(2, 15);
      const h0 = r.int(3, Math.min(12, Math.floor((60 - x) / k)));
      const H = h0 + x, M = k * h0 + x;
      return {
        text: `Mama in hči sta skupaj stari ${M + H} let. Pred ${x} leti je bila mama ${k}-krat starejša od hčere. Koliko let je hči stara danes?`,
        answer: num(H),
        hint: `Naj bo hči pred ${x} leti stara $h$ let. Koliko je bila takrat stara mama in koliko sta stari danes?`,
        data: { given: [`\\text{vsota} = ${M + H}`, `x = ${x}`, `k = ${k}`], find: ["\\text{starost hčere}"] },
        formula: "(k h + x) + (h + x) = \\text{vsota}",
        solution: `Pred ${x} leti: hči $h$, mama $${k}h$. Danes: hči $h + ${x}$, mama $${k}h + ${x}$.\n$(${k}h + ${x}) + (h + ${x}) = ${M + H}$, torej $${k + 1}h = ${M + H - 2 * x}$ in $h = ${h0}$.\nHči je danes stara $${h0} + ${x} = ${H}$ let.`,
      };
    },
  },
  {
    id: "tek-fermi",
    topics: [T("ocenjevanje-in-fermijeve-naloge")],
    gen(level, r) {
      const ime = r.pick(NAMES);
      const Q = (x, u) => `$${tx(x)}\\ \\mathrm{${u}}$`;
      if (level === 1) {
        // En korak (deljenje ali množenje) s pretvorbo enot; odgovor na celo število.
        const items = [
          () => {
            const km = r.pick([2, 3, 5, 10, 21]), step = r.pick([50, 60, 70, 75, 80]);
            const v = (km * 100000) / step;
            return { text: `${ime} ima korak dolg približno ${step} cm. Približno koliko korakov naredi na poti, dolgi ${km} km?`, v, w: [[(km * 1000) / step, "Kilometre pretvori v centimetre: 1 km = 100 000 cm."]], given: [dat("s", km, "km"), dat("d", step, "cm")], find: "N", f: "N = \\dfrac{s}{d}", sol: [`$s = ${km}\\ \\mathrm{km} = ${km * 100000}\\ \\mathrm{cm}$`, `$N = \\dfrac{${km * 100000}}{${step}} ${res(v, 0)}$`], hint: "Razdaljo in dolžino koraka zapiši v isti enoti in ju deli." };
          },
          () => {
            const V = r.pick([0.5, 1, 2, 5]), drop = r.pick([0.04, 0.05]);
            const v = (V * 1000) / drop;
            return { text: `Kapljica vode ima prostornino približno ${Q(drop, "ml")}. Približno koliko kapljic je v $${tx(V)}$ l vode?`, v, w: [[V / drop, "Litre pretvori v mililitre: 1 l = 1000 ml."]], given: [dat("V", tx(V), "l"), dat("V_k", tx(drop), "ml")], find: "N", f: "N = \\dfrac{V}{V_k}", sol: [`$V = ${tx(V)}\\ \\mathrm{l} = ${V * 1000}\\ \\mathrm{ml}$`, `$N = \\dfrac{${V * 1000}}{${tx(drop)}} ${res(v, 0)}$`], hint: "Prostornino zapiši v mililitrih in jo deli s prostornino kapljice." };
          },
          () => {
            const kg = r.pick([0.5, 1, 2, 5]), mg = r.pick([20, 25, 40]);
            const v = (kg * 1e6) / mg;
            return { text: `Zrno riža tehta približno ${mg} mg. Približno koliko zrn je v vrečki s $${tx(kg)}$ kg riža?`, v, w: [[(kg * 1000) / mg, "1 kg = 1 000 000 mg (1 kg = 1000 g, 1 g = 1000 mg)."]], given: [dat("m", tx(kg), "kg"), dat("m_z", mg, "mg")], find: "N", f: "N = \\dfrac{m}{m_z}", sol: [`$m = ${tx(kg)}\\ \\mathrm{kg} = ${kg * 1e6}\\ \\mathrm{mg}$`, `$N = \\dfrac{${kg * 1e6}}{${mg}} ${res(v, 0)}$`], hint: "Maso vrečke pretvori v miligrame in deli z maso zrna." };
          },
          () => {
            const d = r.pick([1, 2, 3, 7]);
            const v = d * 24 * 3600;
            return { text: `Približno koliko sekund je v ${d} ${d === 1 ? "dnevu" : "dneh"}?`, v, w: [[d * 24 * 60, "To so minute; vsaka minuta ima še 60 sekund."]], given: [`t = ${d}\\ \\text{dni}`], find: "N", f: "1\\ \\text{dan} = 24 \\cdot 60 \\cdot 60\\ \\mathrm{s}", sol: [`En dan: $24 \\cdot 3600 = 86\\,400\\ \\mathrm{s}$`, `$N = ${d} \\cdot 86\\,400 = ${v}$`], hint: "En dan ima 24 ur, ura 60 minut, minuta 60 sekund." };
          },
          () => {
            const b = r.pick([60, 65, 70, 75, 80]), h = r.pick([1, 2, 8, 24]);
            const v = b * 60 * h;
            return { text: `Srce utripne približno ${b}-krat na minuto. Približno kolikokrat utripne v ${h} ${h === 1 ? "uri" : h === 2 ? "urah" : "urah"}?`, v, w: [[b * h, "Ure najprej pretvori v minute."]], given: [`f = ${b}\\ \\mathrm{/min}`, dat("t", h, "h")], find: "N", f: "N = f \\cdot t", sol: [`$t = ${h}\\ \\mathrm{h} = ${h * 60}\\ \\mathrm{min}$`, `$N = ${b} \\cdot ${h * 60} = ${v}$`], hint: "Čas zapiši v minutah in ga pomnoži s številom utripov na minuto." };
          },
          () => {
            const D = r.pick([2, 3, 4, 5]), t = r.pick([0.08, 0.1, 0.12]);
            const v = (D * 10) / t;
            return { text: `List papirja je debel približno ${Q(t, "mm")}. Približno koliko listov je v kupu papirja, visokem ${D} cm?`, v, w: [[D / t, "Centimetre pretvori v milimetre."]], given: [dat("h", D, "cm"), dat("d", tx(t), "mm")], find: "N", f: "N = \\dfrac{h}{d}", sol: [`$h = ${D}\\ \\mathrm{cm} = ${D * 10}\\ \\mathrm{mm}$`, `$N = \\dfrac{${D * 10}}{${tx(t)}} ${res(v, 0)}$`], hint: "Višino kupa zapiši v milimetrih in deli z debelino lista." };
          },
          () => {
            const b = r.pick([12, 15, 16, 18]), h = r.pick([1, 8, 24]);
            const v = b * 60 * h;
            return { text: `Človek v mirovanju vdihne približno ${b}-krat na minuto. Približno kolikokrat vdihne v ${h} ${h === 1 ? "uri" : "urah"}?`, v, w: [[b * h, "Ure najprej pretvori v minute."]], given: [`f = ${b}\\ \\mathrm{/min}`, dat("t", h, "h")], find: "N", f: "N = f \\cdot t", sol: [`$t = ${h}\\ \\mathrm{h} = ${h * 60}\\ \\mathrm{min}$`, `$N = ${b} \\cdot ${h * 60} = ${v}$`], hint: "Čas zapiši v minutah in ga pomnoži s številom vdihov na minuto." };
          },
        ];
        const it = r.pick(items)();
        return {
          text: `${it.text} Zaokroži na celo število.`,
          answer: withMistakes(num(it.v, null, 0), it.w),
          hint: it.hint,
          data: { given: it.given, find: [it.find] },
          formula: it.f,
          solution: it.sol.join("\n"),
        };
      }
      // Ocene z več faktorji: red velikosti.
      const chains = [
        () => { const b = r.pick([60, 70, 80]), y = r.pick([10, 15, 50, 80]); return { text: `Srce utripne približno ${b}-krat na minuto. Približno kolikokrat utripne v ${y} letih?`, value: b * 60 * 24 * 365 * y, calc: `${b} \\cdot 60 \\cdot 24 \\cdot 365 \\cdot ${y}`, given: [`f = ${b}\\ \\mathrm{/min}`, `t = ${y}\\ \\text{let}`] }; },
        () => { const km = r.pick([42, 100, 500]), step = r.pick([50, 70, 80]); return { text: `Dolžina koraka je približno ${step} cm. Približno koliko korakov narediš na poti, dolgi ${km} km?`, value: (km * 100000) / step, calc: `\\dfrac{${km} \\cdot 100\\,000}{${step}}`, given: [dat("s", km, "km"), dat("d", step, "cm")] }; },
        () => { const V = r.pick([25, 50, 200]); return { text: `Kapljica vode ima prostornino približno $0{,}05\\ \\mathrm{ml}$. Približno koliko kapljic je v bazenu s ${V} $\\mathrm{m^3}$ vode?`, value: (V * 1e6) / 0.05, calc: `\\dfrac{${V} \\cdot 10^6}{0{,}05}`, given: [dat("V", V, "m³"), "V_k = 0{,}05\\ \\mathrm{ml}"] }; },
        () => { const y = r.pick([1, 12, 100]); return { text: `Približno koliko sekund je v ${y} ${y === 1 ? "letu" : "letih"}?`, value: y * 365 * 24 * 3600, calc: `${y} \\cdot 365 \\cdot 24 \\cdot 3600`, given: [`t = ${y}\\ \\text{let}`] }; },
        () => { const n = r.pick([150, 200, 250]), S = r.pick([500, 600, 700]); return { text: `Na $1\\ \\mathrm{cm^2}$ lasišča raste približno ${n} las, lasišče pa meri približno ${S} $\\mathrm{cm^2}$. Približno koliko las ima človek?`, value: n * S, calc: `${n} \\cdot ${S}`, given: [`n = ${n}\\ \\mathrm{/cm^2}`, dat("S", S, "cm²")] }; },
        () => { const L = r.pick([10, 12, 15]), W = r.pick([8, 10]), H = r.pick([3, 4]); return { text: `Učilnica je dolga ${L} m, široka ${W} m in visoka ${H} m. Žoga za tenis ima prostornino približno $150\\ \\mathrm{cm^3}$. Približno koliko žog bi napolnilo učilnico?`, value: (L * W * H * 1e6) / 150, calc: `\\dfrac{${L} \\cdot ${W} \\cdot ${H} \\cdot 10^6}{150}`, given: [dat("a", L, "m"), dat("b", W, "m"), dat("c", H, "m"), "V_z = 150\\ \\mathrm{cm^3}"] }; },
        () => { const y = r.pick([30, 50, 80]), l = r.pick([1.5, 2, 3]); return { text: `Človek popije približno $${tx(l)}$ l tekočine na dan. Približno koliko litrov popije v ${y} letih?`, value: l * 365 * y, calc: `${tx(l)} \\cdot 365 \\cdot ${y}`, given: [dat("V_1", tx(l), "l"), `t = ${y}\\ \\text{let}`] }; },
      ];
      if (level === 2) {
        for (let tries = 0; tries < 20; tries++) {
          const it = r.pick(chains)();
          const lg = Math.log10(it.value), k = Math.round(lg);
          if (Math.abs(lg - k) > 0.38 || k < 2) continue;
          const asNum = r.next() < 0.5;
          const common = {
            hint: "Zaokroži vmesne številke na lepa števila (npr. 365 ≈ 400, 24 ≈ 25) in štej potence števila 10.",
            data: { given: it.given, find: [asNum ? "k" : "\\text{red velikosti}"] },
            formula: "\\text{red velikosti} = 10^{k}, \\; k \\approx \\log_{10}(\\text{rezultat})",
            solution: `Zmnožimo oceno: $${it.calc}$\n$\\approx ${sci(it.value)}$\nNajbližja potenca: $10^{${k}}$`,
          };
          if (asNum) {
            return {
              text: `${it.text} Rezultat zapiši kot $10^k$ (red velikosti) in vpiši celo število $k$.`,
              answer: withMistakes(num(k), [[k - 1, "Si morda izpustil kakšen faktor ali pretvorbo enot?"], [k + 1, "Si morda kakšno pretvorbo enot naredil dvakrat?"]]),
              ...common,
            };
          }
          const opts = [k - 2, k - 1, k + 1, k + 2].map((e) => [`10^{${e}}`, e < k ? `Premajhno za ${nOf(k - e, "red", "reda", "rede", "redov")} velikosti: si izpustil kakšen faktor ali pretvorbo?` : `Preveliko za ${nOf(e - k, "red", "reda", "rede", "redov")} velikosti: si kakšen faktor upošteval dvakrat?`]);
          const pick = r.shuffle(opts).slice(0, 3);
          return {
            text: `${it.text} Izberi red velikosti, ki je najbližji.`,
            answer: choiceWhy(r, `10^{${k}}`, pick),
            options_tex: true,
            ...common,
          };
        }
        return null;
      }
      // Raven 3: večstopenjska Fermijeva ocena z danimi predpostavkami.
      const v = r.int(0, 4);
      if (v === 0) {
        const N = r.pick([280, 300, 600, 2100]) * 1000, p = r.pick([2.5, 3]), k = r.pick([20, 25, 50]), dan = r.pick([3, 4]);
        const hh = N / p, piano = hh / k, tun = piano / (dan * 250);
        return {
          text: `Ocena: koliko uglaševalcev klavirjev dela v mestu z $${tx(N)}$ prebivalci? Predpostavi: gospodinjstvo ima $${tx(p)}$ člana, klavir ima eno od ${k} gospodinjstev, vsak klavir uglasijo enkrat na leto, uglaševalec uglasi ${dan} klavirje na dan in dela 250 dni na leto. Zaokroži na celo število.`,
          answer: withMistakes(num(tun, null, 0), [[N / k / (dan * 250), "Klavir ima gospodinjstvo, ne vsak prebivalec: najprej izračunaj število gospodinjstev."], [hh / k / dan, "Uglaševalec dela 250 dni na leto; upoštevaj vse delovne dni."]]),
          hint: "Pojdi po verigi: prebivalci → gospodinjstva → klavirji → uglasitve na leto → uglaševalci.",
          data: { given: [`N = ${tx(N)}`, `p = ${tx(p)}`, `k = ${k}`, `n_d = ${dan}`, "D = 250"], find: ["\\text{število uglaševalcev}"] },
          formula: "\\text{uglaševalci} = \\dfrac{N / p / k}{n_d \\cdot D}",
          solution: `Gospodinjstva: $${tx(N)} : ${tx(p)} ${res(hh, 0)}$\nKlavirji: $${tx(hh, 0)} : ${k} ${res(piano, 0)}$\nEn uglaševalec na leto: $${dan} \\cdot 250 = ${dan * 250}$ klavirjev\nUglaševalcev: $${tx(piano, 0)} : ${dan * 250} ${res(tun, 0)}$`,
        };
      }
      if (v === 1) {
        const N = r.pick([20, 25, 30]) * 1000, t = r.pick([5, 6, 8, 10]), q = r.pick([8, 10, 12]);
        const V = (N * t * q) / 1000;
        return {
          text: `Ocena: koliko kubičnih metrov vode na dan porabijo za tuširanje prebivalci mesta s $${tx(N)}$ prebivalci? Predpostavi, da se vsak tušira enkrat na dan ${t} minut, pretok prhe pa je ${q} litrov na minuto. Zaokroži na celo število.`,
          answer: withMistakes(num(V, "m³", 0, { unitAlternatives: ["m3", "m^3"] }), [[N * t * q, "Rezultat je v litrih; 1 m³ = 1000 l."], [(N * q) / 1000, "Upoštevaj, koliko minut traja tuširanje."]]),
          hint: "Izračunaj porabo enega človeka, pomnoži s številom prebivalcev in litre pretvori v m³.",
          data: { given: [`N = ${tx(N)}`, dat("t", t, "min"), `q = ${q}\\ \\mathrm{l/min}`], find: ["V"] },
          formula: ["V = N \\cdot t \\cdot q", "1\\ \\mathrm{m^3} = 1000\\ \\mathrm{l}"],
          solution: `En človek: $${t} \\cdot ${q} = ${t * q}\\ \\mathrm{l}$\nVsi: $${tx(N)} \\cdot ${t * q} = ${tx(N * t * q)}\\ \\mathrm{l}$\n$V ${res(V, 0, "m³")}$`,
        };
      }
      if (v === 2) {
        const n = r.pick([300, 450, 600, 800]), l = r.pick([4, 5, 6, 8]), d = r.pick([180, 190]), per = r.pick([8000, 10000]);
        const sheets = n * l * d, trees = sheets / per;
        return {
          text: `Šola ima ${n} učencev, vsak porabi povprečno ${l} listov papirja na šolski dan, pouk traja ${d} dni na leto. Iz enega drevesa izdelajo približno $${tx(per)}$ listov. Približno koliko dreves porabi šola v letu? Zaokroži na eno decimalko.`,
          answer: withMistakes(num(trees, null, 1), [[(n * l) / per, "To je poraba za en dan; pomnoži še s številom šolskih dni."], [sheets / per / n, "To je na enega učenca; iščemo za celo šolo."]]),
          hint: "Najprej izračunaj, koliko listov porabi šola v letu, nato to deli s številom listov iz enega drevesa.",
          data: { given: [`n = ${n}`, `l = ${l}`, `d = ${d}`, `L = ${tx(per)}`], find: ["\\text{število dreves}"] },
          formula: "\\text{drevesa} = \\dfrac{n \\cdot l \\cdot d}{L}",
          solution: `Na dan: $${n} \\cdot ${l} = ${n * l}$ listov\nNa leto: $${n * l} \\cdot ${d} = ${tx(sheets)}$ listov\nDreves: $${tx(sheets)} : ${tx(per)} ${res(trees, 1)}$`,
        };
      }
      if (v === 3) {
        const cars = r.pick([1.1, 1.2, 1.3]), km = r.pick([10000, 12000, 15000]), c = r.pick([5, 6, 7, 8]);
        const L = (cars * km * c) / 100; // v milijonih litrov
        return {
          text: `V Sloveniji je približno $${tx(cars)}$ milijona osebnih avtomobilov. Vsak na leto prevozi približno $${tx(km)}$ km in porabi ${c} l goriva na 100 km. Približno koliko milijonov litrov goriva porabijo v letu? Zaokroži na celo število.`,
          answer: withMistakes(num(L, null, 0), [[cars * km * c, "Poraba je na 100 km: deli s 100."], [(cars * c) / 100, "Upoštevaj, koliko kilometrov prevozi vsak avto."]]),
          hint: "Izračunaj porabo enega avtomobila na leto (poraba velja za 100 km), nato pomnoži s številom avtomobilov.",
          data: { given: [`N = ${tx(cars)}\\ \\text{milijona}`, dat("s", tx(km), "km"), `q = ${c}\\ \\mathrm{l/100\\,km}`], find: ["V"] },
          formula: "V = N \\cdot \\dfrac{s}{100} \\cdot q",
          solution: `En avto: $\\dfrac{${tx(km)}}{100} \\cdot ${c} = ${(km / 100) * c}\\ \\mathrm{l}$ na leto\nVsi: $${tx(cars)} \\text{ milijona} \\cdot ${(km / 100) * c} ${res(L, 0)}$ milijonov litrov`,
        };
      }
      const M = r.pick([1, 2, 5, 10]), s = r.pick([1, 2]), h = r.pick([8, 10, 12]);
      const days = (M * 1e6 * s) / 3600 / h;
      return {
        text: `${ime} želi na glas prešteti do ${M} ${M === 1 ? "milijona" : "milijonov"}. Za vsako število porabi povprečno ${s} s in šteje ${h} ur na dan. Približno koliko dni bo štel${g(ime, "", "a")}? Zaokroži na celo število.`,
        answer: withMistakes(num(days, null, 0), [[(M * 1e6 * s) / 3600, "To so ure; deli še z urami štetja na dan."], [(M * 1e6 * s) / 3600 / 24, `${ime} ne šteje 24 ur na dan.`]]),
        hint: "Izračunaj skupni čas v sekundah, ga pretvori v ure in deli s številom ur štetja na dan.",
        data: { given: [`N = ${M}\\ \\text{milijon}`, dat("t_1", s, "s"), dat("t_d", h, "h")], find: ["\\text{število dni}"] },
        formula: "\\text{dni} = \\dfrac{N \\cdot t_1}{3600 \\cdot t_d}",
        solution: `Skupni čas: $${tx(M * 1e6)} \\cdot ${s} = ${tx(M * 1e6 * s)}\\ \\mathrm{s}$\nV urah: $${tx(M * 1e6 * s)} : 3600 ${res((M * 1e6 * s) / 3600, 1, "h")}$\nDni: $${tx((M * 1e6 * s) / 3600, 1)} : ${h} ${res(days, 0)}$`,
      };
    },
  },
];
