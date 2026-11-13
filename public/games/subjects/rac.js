// Pojmi za igre: rac (glej README.md v tej mapi).
// Računalništvo, 1. letnik fakultete. Brez uvozov: pomožne funkcije so lokalne.
// Izsek kode in njegov izpis sta zapisana kot v Pythonu (enak v obeh jezikih).

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
function mk(q, a, ws, fill) {
  a = String(a);
  const out = [];
  const seen = new Set([a]);
  const add = (w) => {
    if (w == null || w === "") return;
    const s = String(w);
    if (!seen.has(s) && !/NaN|undefined|Infinity/.test(s)) {
      seen.add(s);
      out.push(s);
    }
  };
  ws.forEach(add);
  for (let i = 0; out.length < 3 && fill && i < 80; i++) add(fill(i));
  // rezerva za številske odgovore: bližnja števila v istem zapisu
  const m = /^(−?)(\d+)([.,]\d+)?$/.exec(a);
  if (m) {
    const v = Number((m[1] ? "-" : "") + m[2] + (m[3] || "").replace(",", "."));
    const sep = (m[3] || "").startsWith(",") ? "," : ".";
    const dec = m[3] ? m[3].length - 1 : 0;
    const step = dec ? 10 ** -dec : 1;
    for (let i = 1; out.length < 3 && i < 40; i++) {
      const x = v + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * step;
      add((x < 0 ? "−" : "") + Math.abs(x).toFixed(dec).replace(".", sep));
    }
  }
  return { q, a, w: shuffle(out.slice(0, 3)) };
}
function bank(items, t, ctx) {
  let c = items.filter((x) => (t === 1 ? x[0] === 1 : t === 2 ? x[0] <= 2 : x[0] >= 2));
  if (!c.length) c = items;
  const it = pick(c);
  const [q, a, ...ws] = ctx.lang === "sl" ? it[1] : it[2];
  return mk(q, a, shuffle(ws));
}
// celo število z ločili (sl: pravi minus prek ctx.num)
const N = (ctx, x) => ctx.num(x);
const near = (ctx, a, step = 1) => (i) => N(ctx, a + (i % 2 ? -1 : 1) * step * (1 + Math.floor(i / 2)));
const bin = (n, w = 0) => n.toString(2).padStart(w, "0");
const grp = (s) => s.replace(/(\d{4})(?=\d)/g, "$1 "); // 8 bitov v skupinah po 4
const SUB = { "0": "₀", "1": "₁", "2": "₂", "6": "₆", "8": "₈" };
const sub = (n) => String(n).replace(/./g, (c) => SUB[c] || c);
const rev = (s) => [...s].reverse().join("");

// ---------- podatki ----------
const GATES = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  NAND: (a, b) => 1 - (a & b),
  NOR: (a, b) => 1 - (a | b),
  XOR: (a, b) => a ^ b,
  XNOR: (a, b) => 1 - (a ^ b),
};
const GN = Object.keys(GATES);
// logični izrazi s tremi spremenljivkami
const EXPR = [
  ["A ∧ B", (A, B) => A & B],
  ["A ∨ B", (A, B) => A | B],
  ["¬A ∧ C", (A, B, C) => (1 - A) & C],
  ["A ⊕ B", (A, B) => A ^ B],
  ["(A ∨ B) ∧ C", (A, B, C) => (A | B) & C],
  ["¬(A ∧ B)", (A, B) => 1 - (A & B)],
  ["A ∧ ¬C", (A, B, C) => A & (1 - C)],
  ["¬B ∨ C", (A, B, C) => (1 - B) | C],
  ["(A ⊕ C) ∧ B", (A, B, C) => (A ^ C) & B],
  ["¬(A ∨ C)", (A, B, C) => 1 - (A | C)],
  ["A ∧ B ∧ C", (A, B, C) => A & B & C],
  ["¬A ∨ ¬B", (A, B) => (1 - A) | (1 - B)],
  ["B ⊕ C", (A, B, C) => B ^ C],
  ["(A ∧ C) ∨ B", (A, B, C) => (A & C) | B],
  ["¬C", (A, B, C) => 1 - C],
  ["A ∨ (B ∧ C)", (A, B, C) => A | (B & C)],
  ["¬A ∧ ¬B", (A, B) => (1 - A) & (1 - B)],
  ["(A ∨ C) ∧ ¬B", (A, B, C) => (A | C) & (1 - B)],
];
const BOOL_ID = [
  ["A ∧ 0", "0"], ["A ∨ 1", "1"], ["A ∧ 1", "A"], ["A ∨ 0", "A"], ["A ∧ ¬A", "0"], ["A ∨ ¬A", "1"],
  ["¬¬A", "A"], ["A ∧ A", "A"], ["A ∨ A", "A"], ["A ⊕ A", "0"], ["A ⊕ 0", "A"], ["A ⊕ 1", "¬A"], ["¬A ⊕ 1", "A"], ["A ⊕ ¬A", "1"],
];
// [izraz, pravilni, napačni …] (enakovrednost preverjena s pravilnostnimi tabelami)
const BOOL_LAWS = [
  ["¬(A ∧ B)", "¬A ∨ ¬B", "¬A ∧ ¬B", "A ∨ B", "¬A ∧ B"],
  ["¬(A ∨ B)", "¬A ∧ ¬B", "¬A ∨ ¬B", "A ∧ B", "¬A ∨ B"],
  ["A ∨ (A ∧ B)", "A", "B", "A ∧ B", "A ∨ B"],
  ["A ∧ (A ∨ B)", "A", "B", "A ∧ B", "A ∨ B"],
  ["A ∨ (¬A ∧ B)", "A ∨ B", "A ∧ B", "B", "A"],
  ["A ∧ (¬A ∨ B)", "A ∧ B", "A ∨ B", "B", "A"],
  ["(A ∧ B) ∨ (A ∧ ¬B)", "A", "B", "1", "A ∧ B"],
  ["A ∧ (B ∨ C)", "(A∧B) ∨ (A∧C)", "(A∧B) ∧ (A∧C)", "(A∨B) ∧ (A∨C)", "(A∧B) ∨ C"],
  ["A ∨ (B ∧ C)", "(A∨B) ∧ (A∨C)", "(A∧B) ∨ (A∧C)", "(A∨B) ∨ (A∨C)", "(A∨B) ∧ C"],
  ["¬(¬A ∧ B)", "A ∨ ¬B", "¬A ∨ B", "A ∧ ¬B", "¬A ∧ ¬B"],
  ["¬(A ∧ ¬B)", "¬A ∨ B", "A ∨ ¬B", "¬A ∧ B", "A ∧ B"],
  ["A → B", "¬A ∨ B", "A ∨ ¬B", "¬A ∧ B", "A ∧ ¬B"],
  ["¬(A → B)", "A ∧ ¬B", "¬A ∧ B", "¬A ∨ B", "A ∨ ¬B"],
];

const WORDS = ["python", "zvezda", "planet", "kodiram", "program", "tipkovnica", "monitor", "algoritem", "spremenljivka", "zanka"];

const BIGO = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)", "O(2ⁿ)", "O(n!)"];
// [stopnja, sl, en, indeks v BIGO]
const ALGS = [
  [1, "Binarno iskanje (najslabše)", "Binary search (worst)", 1],
  [1, "Linearno iskanje (najslabše)", "Linear search (worst)", 2],
  [1, "Dostop do a[i] v tabeli", "Array access a[i]", 0],
  [1, "Urejanje z mehurčki (najslabše)", "Bubble sort (worst)", 4],
  [1, "Dve gnezdeni zanki od 1 do n", "Two nested loops, 1 to n", 4],
  [1, "Ena zanka od 1 do n", "One loop from 1 to n", 2],
  [1, "Iskanje največjega elementa v tabeli", "Finding the maximum of an array", 2],
  [1, "Seštevanje dveh števil", "Adding two numbers", 0],
  [1, "Zanka, ki n vsakič razpolovi", "Loop that halves n each time", 1],
  [2, "Urejanje z zlivanjem", "Merge sort", 3],
  [2, "Hitro urejanje (povprečno)", "Quicksort (average)", 3],
  [2, "Hitro urejanje (najslabše)", "Quicksort (worst)", 4],
  [2, "Urejanje z vstavljanjem (najslabše)", "Insertion sort (worst)", 4],
  [2, "Urejanje z izbiranjem", "Selection sort", 4],
  [2, "Iskanje v zgoščeni tabeli (povprečno)", "Hash table lookup (average)", 0],
  [2, "push ali pop na skladu", "Stack push or pop", 0],
  [2, "Iskanje v uravnoteženem BST (najslabše)", "Balanced BST search (worst)", 1],
  [3, "Iskanje v izrojenem BST (najslabše)", "Search in a degenerate BST (worst)", 2],
  [3, "Vstavljanje v dvojiško kopico (najslabše)", "Binary heap insert (worst)", 1],
  [3, "Urejanje s kopico", "Heapsort", 3],
  [3, "Rekurzija T(n) = 2T(n − 1) + 1", "Recurrence T(n) = 2T(n − 1) + 1", 6],
  [3, "Rekurzija T(n) = n · T(n − 1)", "Recurrence T(n) = n · T(n − 1)", 7],
  [3, "Hanojski stolpi z n diski", "Towers of Hanoi, n disks", 6],
  [3, "Urejanje z vstavljanjem, urejen vhod", "Insertion sort, sorted input", 2],
  [3, "Naivno množenje matrik n × n", "Naive n × n matrix product", 5],
  [3, "Vstavljanje na začetek povezanega seznama", "Insert at head of a linked list", 0],
];

const PORTS = [
  ["HTTP", 80], ["HTTPS", 443], ["DNS", 53], ["SSH", 22], ["FTP", 21], ["SMTP", 25],
  ["Telnet", 23], ["POP3", 110], ["IMAP", 143], ["NTP", 123], ["SNMP", 161],
];
const PROTO = [
  [2, ["Pretvarja imena v IP naslove?", "DNS", "DHCP", "ARP", "HTTP"], ["Turns names into IP addresses?", "DNS", "DHCP", "ARP", "HTTP"]],
  [2, ["Samodejno dodeli IP naslov?", "DHCP", "DNS", "ARP", "SMTP"], ["Assigns IP addresses automatically?", "DHCP", "DNS", "ARP", "SMTP"]],
  [2, ["Šifrirana oddaljena prijava?", "SSH", "Telnet", "FTP", "HTTP"], ["Encrypted remote login?", "SSH", "Telnet", "FTP", "HTTP"]],
  [2, ["Pošiljanje e-pošte med strežniki?", "SMTP", "IMAP", "POP3", "DNS"], ["Sending e-mail between servers?", "SMTP", "IMAP", "POP3", "DNS"]],
  [2, ["Šifriran prenos spletnih strani?", "HTTPS", "HTTP", "FTP", "Telnet"], ["Encrypted transfer of web pages?", "HTTPS", "HTTP", "FTP", "Telnet"]],
  [3, ["Iz IP naslova poišče MAC naslov?", "ARP", "DNS", "DHCP", "NTP"], ["Finds the MAC address for an IP?", "ARP", "DNS", "DHCP", "NTP"]],
  [3, ["Usklajevanje ure prek omrežja?", "NTP", "SNMP", "ARP", "SMTP"], ["Synchronising clocks over a network?", "NTP", "SNMP", "ARP", "SMTP"]],
  [3, ["Protokol ukaza ping?", "ICMP", "TCP", "ARP", "DNS"], ["Protocol used by ping?", "ICMP", "TCP", "ARP", "DNS"]],
  [3, ["Prenos brez povezave in potrditev?", "UDP", "TCP", "SSH", "HTTPS"], ["Connectionless, unacknowledged transport?", "UDP", "TCP", "SSH", "HTTPS"]],
  [3, ["Zanesljiv prenos s povezavo?", "TCP", "UDP", "ICMP", "ARP"], ["Reliable connection-based transport?", "TCP", "UDP", "ICMP", "ARP"]],
];
const OSI = [
  ["fizična", "physical"], ["povezavna", "data link"], ["omrežna", "network"], ["transportna", "transport"],
  ["sejna", "session"], ["predstavitvena", "presentation"], ["aplikacijska", "application"],
];
// [sl, en, plast 1–7]
const OSI_ITEMS = [
  ["IP", "IP", 3], ["TCP", "TCP", 4], ["UDP", "UDP", 4], ["HTTP", "HTTP", 7], ["DNS", "DNS", 7], ["SMTP", "SMTP", 7],
  ["Usmerjevalnik", "Router", 3], ["Stikalo", "Switch", 2], ["Razdelilnik (hub)", "Hub", 1], ["MAC naslov", "MAC address", 2],
  ["IP naslov", "IP address", 3], ["Številka vrat", "Port number", 4], ["Ethernetni okvir", "Ethernet frame", 2], ["ICMP", "ICMP", 3],
  ["Signal po kablu", "Signal on a cable", 1], ["Vzpostavitev seje", "Session setup", 5], ["Pretvorba zapisa podatkov", "Data format conversion", 6],
];

const HW = [
  [1, ["Najhitrejši pomnilnik?", "registri", "predpomnilnik", "RAM", "SSD", "trdi disk"], ["Fastest memory?", "registers", "cache", "RAM", "SSD", "hard disk"]],
  [1, ["Ob izklopu izgubi vsebino?", "RAM", "ROM", "SSD", "trdi disk"], ["Loses its contents at power-off?", "RAM", "ROM", "SSD", "hard disk"]],
  [1, ["Enota, ki izvaja ukaze?", "procesor (CPE)", "RAM", "trdi disk", "napajalnik"], ["Unit that executes instructions?", "CPU", "RAM", "hard disk", "power supply"]],
  [1, ["Vhodna naprava?", "tipkovnica", "monitor", "tiskalnik", "zvočnik"], ["Input device?", "keyboard", "monitor", "printer", "speaker"]],
  [1, ["Izhodna naprava?", "tiskalnik", "tipkovnica", "miška", "mikrofon"], ["Output device?", "printer", "keyboard", "mouse", "microphone"]],
  [1, ["Najpočasnejši od teh pomnilnikov?", "trdi disk", "RAM", "predpomnilnik", "registri"], ["Slowest of these memories?", "hard disk", "RAM", "cache", "registers"]],
  [1, ["Trajni pomnilnik brez gibljivih delov?", "SSD", "trdi disk", "RAM", "registri"], ["Non-volatile storage with no moving parts?", "SSD", "hard disk", "RAM", "registers"]],
  [1, ["Koliko bitov ima en bajt?", "8", "4", "10", "16"], ["How many bits are in a byte?", "8", "4", "10", "16"]],
  [2, ["1 GHz = ? Hz", "10⁹", "10⁶", "10³", "10¹²"], ["1 GHz = ? Hz", "10⁹", "10⁶", "10³", "10¹²"]],
  [2, ["Hitri pomnilnik med CPE in RAM?", "predpomnilnik", "trdi disk", "ROM", "SSD"], ["Fast memory between CPU and RAM?", "cache", "hard disk", "ROM", "SSD"]],
  [2, ["Program, ki upravlja strojno opremo?", "operacijski sistem", "prevajalnik", "urejevalnik", "brskalnik"], ["Software that manages the hardware?", "operating system", "compiler", "text editor", "web browser"]],
  [2, ["Prevede celoten program pred zagonom?", "prevajalnik", "tolmač", "povezovalnik", "razhroščevalnik"], ["Translates a whole program before running?", "compiler", "interpreter", "linker", "debugger"]],
];

// ---------- pojmi ----------
export const AREAS = [
  ["rc_st", { sl: "Številski sistemi in zapis podatkov", en: "Number systems and data" }, "#2563eb"],
  ["rc_log", { sl: "Logika in logična vezja", en: "Logic and logic gates" }, "#7c3aed"],
  ["rc_prg", { sl: "Programiranje", en: "Programming" }, "#059669"],
  ["rc_alg", { sl: "Algoritmi in podatkovne strukture", en: "Algorithms and data structures" }, "#db2777"],
  ["rc_net", { sl: "Omrežja in računalniški sistemi", en: "Networks and computer systems" }, "#ea580c"],
];

export const CONCEPTS = [
  {
    id: "r_bin2dec",
    area: "rc_st",
    year: 12,
    name: { sl: "Dvojiško v desetiško", en: "Binary to decimal" },
    gen(t, ctx) {
      if (t === 3 && Math.random() < 0.4) {
        // dvojiška števila z decimalko
        const ip = R(1, 7), fb = pick(["1", "01", "11"]);
        const fv = { 1: 0.5, "01": 0.25, 11: 0.75 }[fb];
        const s = `${bin(ip)}${ctx.lang === "sl" ? "," : "."}${fb}`;
        const wrongF = { 1: 0.1, "01": 0.01, 11: 0.11 }[fb];
        return mk(`${s}${sub(2)} = ?${sub(10)}`, N(ctx, ip + fv), [N(ctx, ip + wrongF), N(ctx, ip + 1 - fv), N(ctx, ip + fv + 1), N(ctx, ip * 2 + fv), N(ctx, ip + (fb === "01" ? 0.5 : 0.25))]);
      }
      const n = t === 1 ? R(2, 15) : t === 2 ? R(16, 255) : R(256, 1023);
      const s = bin(n);
      const r = parseInt(rev(s), 2);
      return mk(`${s}${sub(2)} = ?${sub(10)}`, N(ctx, n), [r, 2 * n, n + 1, n - 1, n >> 1, n + 2].filter((x) => x > 0).map((x) => N(ctx, x)), near(ctx, n));
    },
  },
  {
    id: "r_dec2bin",
    area: "rc_st",
    year: 12,
    name: { sl: "Desetiško v dvojiško", en: "Decimal to binary" },
    gen(t, ctx) {
      const n = t === 1 ? R(2, 15) : t === 2 ? R(16, 255) : R(256, 1023);
      const s = bin(n);
      const flip = (k) => bin(n ^ (1 << k));
      const ws = [rev(s), bin(n + 1), bin(n - 1), flip(R(1, s.length - 2)), bin(n * 2), bin(n >> 1)];
      return mk(`${N(ctx, n)}${sub(10)} = ?${sub(2)}`, s, ws.filter((w) => w.length > 0 && !/^0/.test(w)), (i) => flip(i % s.length));
    },
  },
  {
    id: "r_hex",
    area: "rc_st",
    year: 13,
    name: { sl: "Šestnajstiški in osmiški sistem", en: "Hexadecimal and octal" },
    gen(t, ctx) {
      const H = (n) => n.toString(16).toUpperCase();
      if (t === 1) {
        const d = R(10, 15);
        if (Math.random() < 0.5) return mk(`${H(d)}${sub(16)} = ?${sub(10)}`, N(ctx, d), [d - 1, d + 1, d - 9, d - 6, d + 6].map((x) => N(ctx, x)));
        return mk(`${N(ctx, d)}${sub(10)} = ?${sub(16)}`, H(d), [H(d - 1), d < 15 ? H(d + 1) : "G", String(d), H((d % 10) + 1)], (i) => H(10 + ((d - 10 + 2 + i) % 6)));
      }
      if (t === 2) {
        const v = R(17, 255);
        const hi = v >> 4, lo = v & 15;
        if (lo === hi) return mk(`${H(v)}${sub(16)} = ?${sub(10)}`, N(ctx, v), [hi * 10 + lo, hi + lo, v + 1, v - 1].map((x) => N(ctx, x)), near(ctx, v, 16));
        if (Math.random() < 0.5) return mk(`${H(v)}${sub(16)} = ?${sub(10)}`, N(ctx, v), [hi * 10 + lo, lo * 16 + hi, hi + lo, v + 16, v - 1].map((x) => N(ctx, x)), near(ctx, v));
        return mk(`${N(ctx, v)}${sub(10)} = ?${sub(16)}`, H(v), [H(lo * 16 + hi), H(v + 1), H(v - 1), H(v + 16), String(Math.floor(v / 16)) + String(v % 16)], (i) => H(v + i + 2));
      }
      const k = R(0, 2);
      if (k === 0) {
        const v = R(17, 254);
        const s = grp(bin(v, 8));
        const hi = v >> 4, lo = v & 15;
        return mk(`${s}${sub(2)} = ?${sub(16)}`, H(v).padStart(2, "0"), [H(lo * 16 + hi).padStart(2, "0"), H(v + 1).padStart(2, "0"), H(v - 1).padStart(2, "0"), H(v ^ 16).padStart(2, "0")], (i) => H((v + 17 * (i + 1)) & 255).padStart(2, "0"));
      }
      if (k === 1) {
        const v = R(17, 254);
        const hi = v >> 4, lo = v & 15;
        return mk(`${H(v).padStart(2, "0")}${sub(16)} = ?${sub(2)}`, grp(bin(v, 8)), [grp(bin(lo * 16 + hi, 8)), grp(bin(v + 1, 8)), grp(bin(v - 1, 8)), grp(bin(v ^ 16, 8))], (i) => grp(bin((v + 3 * (i + 1)) & 255, 8)));
      }
      const v = R(64, 511);
      const o = v.toString(8);
      return mk(`${o}${sub(8)} = ?${sub(10)}`, N(ctx, v), [Number(o), parseInt(o, 16), parseInt(rev(o), 8), v + 1, v - 1].map((x) => N(ctx, x)), near(ctx, v));
    },
  },
  {
    id: "r_units",
    area: "rc_st",
    year: 12,
    name: { sl: "Biti, bajti in enote", en: "Bits, bytes and units" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = (x) => N(ctx, x);
      if (t === 1) {
        const k = R(0, 2);
        if (k === 0) {
          const b = R(2, 16);
          return mk(`${b} B = ? bit`, n(8 * b), [4 * b, 10 * b, 16 * b, b / 8].filter((x) => Number.isInteger(x)).map(n));
        }
        if (k === 1) {
          const B = R(2, 16);
          return mk(`${8 * B} bit = ? B`, n(B), [64 * B, 2 * B, 4 * B, 8 * B * 8].map(n));
        }
        const b = R(3, 10);
        return mk(sl ? `Koliko različnih vrednosti ima ${b}-bitno število?` : `How many different values fit in ${b} bits?`, n(2 ** b), [2 ** b - 1, 2 * b, b * b, 2 ** (b - 1)].map(n));
      }
      if (t === 2) {
        const v = R(1, 8);
        const k = R(0, 3);
        if (k === 0) return mk(`${v} KiB = ? B`, n(1024 * v), [1000 * v, 8192 * v, 1024 * v * 1024].map(n));
        if (k === 1) return mk(`${v} kB (SI) = ? B`, n(1000 * v), [1024 * v, 8000 * v, 100 * v].map(n));
        if (k === 2) return mk(`${v} MiB = ? KiB`, n(1024 * v), [1000 * v, 1024 * 1024 * v, 8192 * v].map(n));
        return mk(`${v} GB (SI) = ? MB`, n(1000 * v), [1024 * v, 8000 * v, 1000000 * v].map(n));
      }
      if (Math.random() < 0.5) {
        let S, r;
        do {
          r = pick([8, 16, 20, 40, 50, 80, 100]);
          S = R(1, 50);
        } while ((8 * S) % r !== 0 || (8 * S) / r > 60);
        const s = (x) => `${n(x)} s`;
        const tt = (8 * S) / r;
        return mk(sl ? `${S} MB pri ${r} Mbit/s: čas prenosa?` : `${S} MB at ${r} Mbit/s: transfer time?`, s(tt), [S / r, tt * 8, r / S, tt / 2].map((x) => (Math.abs(x * 100 - Math.round(x * 100)) < 1e-9 ? s(x) : null)), (i) => s(tt + i + 1));
      }
      const w = pick([100, 200, 400, 500]), h = pick([100, 200, 300]), bpp = pick([8, 24, 32]);
      const B = (w * h * bpp) / 8;
      return mk(sl ? `Slika ${w} × ${h} px, ${bpp} bit/px: velikost?` : `Image ${w} × ${h} px, ${bpp} bit/px: size?`, `${n(B)} B`, [`${n(B * 8)} B`, `${n(w * h)} B`, `${n(w * h * bpp * 8)} B`, `${n((w + h) * bpp)} B`]);
    },
  },
  {
    id: "r_twos",
    area: "rc_st",
    year: 14,
    name: { sl: "Dvojiški komplement", en: "Two's complement" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = (x) => N(ctx, x);
      const tc = (x, w) => bin((x + 2 ** w) % 2 ** w, w);
      const show = (s) => (s.length === 8 ? grp(s) : s);
      if (t === 1) {
        const w = pick([4, 6, 8, 10, 12, 16]);
        const range = (a, b) => `${n(a)} … ${n(b)}`;
        const m = 2 ** (w - 1);
        if (Math.random() < 0.7)
          return mk(sl ? `Obseg ${w}-bitnega predznačenega celega števila?` : `Range of a signed ${w}-bit integer?`, range(-m, m - 1), [range(-(m - 1), m - 1), range(0, 2 * m - 1), range(-m, m), range(-(m - 1), m)]);
        return mk(sl ? `Obseg ${w}-bitnega nepredznačenega celega števila?` : `Range of an unsigned ${w}-bit integer?`, range(0, 2 * m - 1), [range(0, 2 * m), range(1, 2 * m), range(-m, m - 1)]);
      }
      const w = t === 2 ? 4 : 8;
      const lim = 2 ** (w - 1);
      const x = -R(1, lim);
      const s = tc(x, w);
      const oc = bin(parseInt(s, 2) - 1, w); // eniški komplement
      const sm = -x < lim ? "1" + bin(-x, w - 1) : null; // predznak in velikost
      if (Math.random() < 0.5) {
        const q = sl ? `${n(x)} v ${w}-bitnem dvojiškem komplementu?` : `${n(x)} in ${w}-bit two's complement?`;
        return mk(q, show(s), [oc, sm, bin(-x, w), tc(x + 1, w), tc(x - 1, w), tc(x + 2, w), "1".repeat(w)].filter(Boolean).map(show));
      }
      const u = parseInt(s, 2);
      const smv = s[0] === "1" ? -parseInt(s.slice(1), 2) : null;
      const q = sl ? `${show(s)} (${w}-bitni dvojiški komplement) = ?` : `${show(s)} (${w}-bit two's complement) = ?`;
      return mk(q, n(x), [u, smv, x + 1, -x, x - 1].filter((v) => v != null).map(n));
    },
  },
  {
    id: "r_ascii",
    area: "rc_st",
    year: 13,
    name: { sl: "Kode ASCII", en: "ASCII codes" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = (x) => N(ctx, x);
      const ch = (c) => `'${String.fromCharCode(c)}'`;
      if (t === 1) {
        const c = R(65, 90);
        return mk(`ASCII ${ch(c)} = ?`, n(c), [c - 1, c + 1, c + 32, c - 64, Number(c.toString(16))].map(n));
      }
      if (t === 2) {
        if (Math.random() < 0.6) {
          const c = R(97, 122);
          return mk(`ASCII ${ch(c)} = ?`, n(c), [c - 32, c - 1, c + 1, c - 96].map(n));
        }
        const c = R(48, 57);
        return mk(`ASCII ${ch(c)} = ?`, n(c), [c - 48, c + 1, c - 1, Number(c.toString(16))].map(n));
      }
      const k = R(0, 4);
      if (k === 0) {
        const c = pick([R(65, 90), R(97, 122)]);
        const other = c >= 97 ? c - 32 : c + 32;
        const lim = (v) => (c >= 97 ? v >= 97 && v <= 122 : v >= 65 && v <= 90);
        return mk(`ASCII ${n(c)} = ?`, ch(c), [ch(other), ...[c - 1, c + 1, c + 2, c - 2].filter(lim).map(ch)]);
      }
      if (k === 1) {
        const c = R(48, 57);
        return mk(`ASCII ${n(c)} = ?`, ch(c), [c - 1, c + 1, c + 2, c - 2].filter((v) => v >= 48 && v <= 57).map(ch).concat([`'${c}'`]));
      }
      if (k === 2) return mk(`ord('a') − ord('A') = ?`, n(32), [26, 1, 31, 25].map(n));
      if (k === 3) return mk(sl ? "Koda ASCII za presledek?" : "ASCII code of a space?", n(32), [0, 20, 127, 48].map(n));
      return mk(sl ? "Koliko znakov ima standardni (7-bitni) ASCII?" : "How many codes in standard (7-bit) ASCII?", n(128), [256, 127, 255, 64].map(n));
    },
  },
  {
    id: "r_gates",
    area: "rc_log",
    year: 13,
    name: { sl: "Logična vrata", en: "Logic gates" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const col = (g) => [0, 1, 2, 3].map((i) => GATES[g](i >> 1, i & 1)).join("");
      if (t === 1) {
        const g = pick(GN);
        return mk(sl ? `${g}: izhodi za AB = 00, 01, 10, 11?` : `${g}: outputs for AB = 00, 01, 10, 11?`, col(g), shuffle(GN.filter((x) => x !== g)).map(col));
      }
      if (t === 2) {
        const a = R(0, 1), b = R(0, 1), y = R(0, 1);
        const yes = GN.filter((g) => GATES[g](a, b) === y);
        const no = GN.filter((g) => GATES[g](a, b) !== y);
        return mk(sl ? `A = ${a}, B = ${b}: katera vrata dajo ${y}?` : `A = ${a}, B = ${b}: which gate outputs ${y}?`, pick(yes), shuffle(no));
      }
      const k = R(0, 3);
      if (k === 0) {
        const m = R(2, 6);
        return mk(sl ? `Vrstic v pravilnostni tabeli (vhodov: ${m})?` : `Truth-table rows for ${m} inputs?`, N(ctx, 2 ** m), [2 * m, m * m, 2 ** m - 1, 2 ** (m + 1)].map((x) => N(ctx, x)));
      }
      if (k === 1) return mk(sl ? "Katera vrata so univerzalna?" : "Which gate is universal?", pick(["NAND", "NOR"]), shuffle(["AND", "OR", "XOR", "XNOR"]));
      if (k === 2) return mk(sl ? "Polovični seštevalnik: vsota S = ?" : "Half adder: sum S = ?", "A XOR B", ["A AND B", "A OR B", "A NAND B", "A NOR B"]);
      return mk(sl ? "Polovični seštevalnik: prenos C = ?" : "Half adder: carry C = ?", "A AND B", ["A XOR B", "A OR B", "A NOR B", "A XNOR B"]);
    },
  },
  {
    id: "r_bool",
    area: "rc_log",
    year: 14,
    name: { sl: "Logični izrazi in zakoni", en: "Boolean expressions and laws" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      if (t === 1) {
        const [e, a] = pick(BOOL_ID);
        return mk(`${e} = ?`, a, ["0", "1", "A", "¬A"].filter((x) => x !== a));
      }
      if (t === 2) {
        for (;;) {
          const A = R(0, 1), B = R(0, 1), C = R(0, 1), y = R(0, 1);
          const ex = shuffle(EXPR);
          const yes = ex.filter((x) => x[1](A, B, C) === y);
          const no = ex.filter((x) => x[1](A, B, C) !== y);
          if (yes.length < 1 || no.length < 3) continue;
          return mk(sl ? `A = ${A}, B = ${B}, C = ${C}: kateri izraz je ${y}?` : `A = ${A}, B = ${B}, C = ${C}: which equals ${y}?`, yes[0][0], no.map((x) => x[0]));
        }
      }
      const [e, a, ...ws] = pick(BOOL_LAWS);
      return mk(`${e} = ?`, a, shuffle(ws));
    },
  },
  {
    id: "r_trace",
    area: "rc_prg",
    year: 13,
    name: { sl: "Sledenje kodi", en: "Code tracing" },
    gen(t, ctx) {
      const n = (x) => N(ctx, x);
      if (t === 1) {
        const k = R(0, 3);
        if (k === 0) {
          const a = R(2, 9), b = R(2, 5), c = R(1, 9);
          return mk(`x=${a}; x*=${b}; x-=${c} → x?`, n(a * b - c), [a * (b - c), a * b + c, (a - c) * b, a + b - c].map(n), near(ctx, a * b - c));
        }
        if (k === 1) {
          const a = R(1, 9), b = R(1, 9), c = R(2, 5);
          return mk(`x=${a}; x+=${b}; x*=${c} → x?`, n((a + b) * c), [a + b * c, a * c + b, a + b + c, a * b * c].map(n), near(ctx, (a + b) * c));
        }
        if (k === 2) {
          const a = R(1, 9);
          let b = R(1, 9);
          if (b === a) b = a + 1;
          return mk(`x=${a}; y=x; x=${b} → y?`, n(a), [b, a + b, 0, b - a].map(n));
        }
        const m = R(2, 10);
        return mk(`2 ** ${m} → ?`, n(2 ** m), [2 * m, m * m, 2 ** (m - 1), 2 ** m - 1].map(n));
      }
      if (t === 2) {
        const a = R(11, 59), b = R(3, 9);
        if (a % b === 0) return mk(`${a} % ${b} → ?`, n(0), [b, a / b, 1].map(n));
        const q = Math.floor(a / b), r = a % b;
        if (Math.random() < 0.5) return mk(`${a} // ${b} → ?`, n(q), [r, q + 1, q - 1, b].map(n));
        return mk(`${a} % ${b} → ?`, n(r), [q, b - r, r + 1, r - 1].map(n));
      }
      const k = R(0, 4);
      if (k === 0) {
        let a = R(5, 29), b = R(2, 6);
        if (a % b === 0) a++;
        const fq = Math.floor(-a / b);
        return mk(`-${a} // ${b} → ?`, n(fq), [fq + 1, -fq, fq - 1, -fq - 1].map(n));
      }
      if (k === 1) {
        let a = R(5, 29), b = R(3, 7);
        if (a % b === 0) a++;
        const m = ((-a % b) + b) % b;
        return mk(`-${a} % ${b} → ?`, n(m), [-(a % b), a % b, b - m + 1, -m].map(n));
      }
      if (k === 2) {
        const x = R(1, 9), y = R(1, 9);
        const A = y, B = x + y;
        return mk(`a,b=${x},${y}; a,b=b,a+b → a+b?`, n(A + B), [3 * y, x + y, 2 * x + y].map(n), near(ctx, A + B));
      }
      if (k === 3) {
        const a = R(10, 30), b = R(1, 9);
        return mk(`int('${a}') + ${b} → ?`, n(a + b), [`${a}${b}`, `'${a}${b}'`, `'${a + b}'`]);
      }
      const a = R(2, 9), b = R(2, 9);
      return mk(`str(${a}) * ${b} → ?`, `'${String(a).repeat(b)}'`, [n(a * b), `'${a * b}'`, `'${a}${b}'`, `'${String(a).repeat(b + 1)}'`]);
    },
  },
  {
    id: "r_seq",
    area: "rc_prg",
    year: 13,
    name: { sl: "Nizi, seznami in range", en: "Strings, lists and range" },
    gen(t, ctx) {
      const n = (x) => N(ctx, x);
      const w = pick(WORDS);
      const q = (s) => `'${s}'`;
      if (t === 1) {
        const k = R(0, 3);
        if (k === 0) {
          const i = R(1, w.length - 2);
          return mk(`'${w}'[${i}] → ?`, q(w[i]), [q(w[i - 1]), q(w[i + 1]), q(w[0])], () => q(pick([..."abcdefgh"])));
        }
        if (k === 1) return mk(`len('${w}') → ?`, n(w.length), [w.length - 1, w.length + 1, w.length + 2].map(n));
        if (k === 2) return mk(`'${w}'[-1] → ?`, q(w[w.length - 1]), [q(w[0]), q(w[w.length - 2]), "'-'"], () => q(pick([..."xyz"])));
        const L = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, R(3, 5));
        return mk(`a=[${L.join(",")}]; a.append(0); len(a) → ?`, n(L.length + 1), [L.length, L.length + 2, 1].map(n));
      }
      if (t === 2) {
        const k = R(0, 3);
        if (k === 0) {
          const m = R(3, 10);
          return mk(`sum(range(${m})) → ?`, n((m * (m - 1)) / 2), [(m * (m + 1)) / 2, m, (m * (m - 1)) / 2 - 1].map(n));
        }
        if (k === 1) {
          const a = R(0, 9), b = a + R(3, 12);
          return mk(`len(range(${a}, ${b})) → ?`, n(b - a), [b - a + 1, b - a - 1, b].map(n));
        }
        if (k === 2) {
          const s = R(1, 2) + 1;
          const a = R(0, 5), b = a + R(5, 15);
          const L = Math.ceil((b - a) / s);
          return mk(`len(range(${a}, ${b}, ${s})) → ?`, n(L), [L + 1, L - 1, b - a, Math.floor((b - a) / s) === L ? L + 2 : Math.floor((b - a) / s)].map(n));
        }
        const k2 = R(2, 4);
        return mk(`len('${w}' * ${k2}) → ?`, n(w.length * k2), [w.length + k2, w.length, k2].map(n));
      }
      const k = R(0, 2);
      if (k === 0) {
        const i = R(0, w.length - 4), j = i + R(2, 3);
        return mk(`'${w}'[${i}:${j}] → ?`, q(w.slice(i, j)), [q(w.slice(i, j + 1)), q(w.slice(i + 1, j + 1)), q(w.slice(Math.max(0, i - 1), j)), q(w.slice(i + 1, j))]);
      }
      if (k === 1) {
        const L = R(1, 3);
        return mk(`a=[${[...Array(L)].map((_, i) => i + 1).join(",")}]; b=a; b.append(9); len(a) → ?`, n(L + 1), [L, L + 2, 1].map(n));
      }
      const L = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
      const s = [...L].sort((x, y) => x - y);
      return mk(`a=[${L.join(",")}]; a.sort(); a[1] → ?`, n(s[1]), [L[1], s[0], s[2], L[0]].map(n));
    },
  },
  {
    id: "r_bigo",
    area: "rc_alg",
    year: 14,
    name: { sl: "Časovna zahtevnost (O)", en: "Time complexity (Big-O)" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      if (t === 3 && Math.random() < 0.4) {
        const n = (x) => N(ctx, x);
        if (Math.random() < 0.3) {
          const k = R(1, 4);
          return mk(sl ? `O(2ⁿ): n → n + ${k}, čas ×?` : `O(2ⁿ): n → n + ${k}, time ×?`, n(2 ** k), [k, 2 * k, k * k + 1, 2 ** (k + 1)].map(n));
        }
        const [p, lab] = pick([[1, "O(n)"], [2, "O(n²)"], [3, "O(n³)"]]);
        const f = pick([2, 3, 10]);
        if (Math.random() < 0.5) return mk(sl ? `${lab}: n ×${f}, čas ×?` : `${lab}: n ×${f}, time ×?`, n(f ** p), [f, f * p, f ** (p + 1), f ** p + 1, 2 * f].map(n));
        const ms = R(1, 5);
        return mk(sl ? `${lab}: ${ms} ms pri n = 1000; pri n = ${1000 * f}?` : `${lab}: ${ms} ms at n = 1000; at n = ${1000 * f}?`, `${n(ms * f ** p)} ms`, [ms * f, ms * f * p, ms * f ** (p + 1), ms + f, ms * f * 2, ms * (f + 1), ms * f ** p * 10].filter((x) => x !== ms * f ** p).map((x) => `${n(x)} ms`));
      }
      const pool = ALGS.filter((x) => (t === 1 ? x[0] === 1 : t === 2 ? x[0] <= 2 : x[0] >= 2));
      const [, s, e, i] = pick(pool);
      const ws = shuffle([i - 1, i + 1, i - 2, i + 2].filter((k) => k >= 0 && k < BIGO.length));
      return mk(sl ? `${s}: tesna meja O?` : `${e}: tight O bound?`, BIGO[i], ws.map((k) => BIGO[k]), () => pick(BIGO));
    },
  },
  {
    id: "r_search",
    area: "rc_alg",
    year: 14,
    name: { sl: "Iskanje in urejanje: štetje korakov", en: "Searching and sorting: counting steps" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = (x) => N(ctx, x);
      if (t === 1) {
        if (Math.random() < 0.35)
          return bank(
            [
              [1, ["Binarno iskanje zahteva?", "urejeno tabelo", "neurejeno tabelo", "povezan seznam", "sklad"], ["Binary search needs?", "a sorted array", "an unsorted array", "a linked list", "a stack"]],
              [1, ["Iskanje, ki pregleda element za elementom?", "linearno", "binarno", "zgoščeno", "interpolacijsko"], ["Checking items one by one?", "linear search", "binary search", "hashing", "interpolation"]],
              [1, ["Urejanje, ki zamenjuje sosednja elementa?", "z mehurčki", "z zlivanjem", "s kopico", "s štetjem"], ["Sort that swaps adjacent items?", "bubble sort", "merge sort", "heapsort", "counting sort"]],
              [1, ["Urejanje: razpolovi, uredi polovici, združi?", "z zlivanjem", "z mehurčki", "z vstavljanjem", "z izbiranjem"], ["Sort: split in half, sort halves, merge?", "merge sort", "bubble sort", "insertion sort", "selection sort"]],
            ],
            1,
            ctx,
          );
        const m = pick([10, 20, 50, 100, 500, 1000]);
        return mk(sl ? `Linearno iskanje v ${m} elementih: največ primerjav?` : `Linear search in ${m} items: most comparisons?`, n(m), [m / 2, m - 1, Math.ceil(Math.log2(m + 1)), m + 1].map(n));
      }
      if (t === 2) {
        if (Math.random() < 0.3) {
          const k = R(4, 12);
          return mk(sl ? `Kolikokrat razpolovimo ${n(2 ** k)}, da dobimo 1?` : `How many halvings take ${n(2 ** k)} to 1?`, n(k), [k + 1, k - 1, 2 ** (k - 1), 2 * k].map(n));
        }
        const m = pick([7, 15, 31, 63, 100, 127, 255, 500, 1000, 4000, 10000, 100000, 1000000]);
        const k = Math.ceil(Math.log2(m + 1));
        return mk(sl ? `Binarno iskanje v ${n(m)} elementih: največ primerjav?` : `Binary search in ${n(m)} items: most comparisons?`, n(k), [k - 1, k + 1, Math.ceil(m / 2), Math.round(Math.log10(m))].map(n));
      }
      const k = R(0, 2);
      if (k === 2) {
        return mk(sl ? "Binarno iskanje, n ×2: za koliko več primerjav (najslabše)?" : "Binary search, n ×2: extra comparisons (worst)?", n(1), [2, 0].map(n).concat([sl ? "2-krat več" : "twice as many"]));
      }
      const m = R(4, 12);
      const [s, e] = k === 0 ? ["Urejanje z izbiranjem", "Selection sort"] : ["Urejanje z mehurčki (najslabše)", "Bubble sort (worst case)"];
      return mk(sl ? `${s}, n = ${m}: primerjav?` : `${e}, n = ${m}: comparisons?`, n((m * (m - 1)) / 2), [m * m, m * (m - 1), (m * (m + 1)) / 2, m - 1].map(n));
    },
  },
  {
    id: "r_ds",
    area: "rc_alg",
    year: 14,
    name: { sl: "Sklad in vrsta", en: "Stack and queue" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const stack = Math.random() < 0.5;
      const P = stack ? "push" : sl ? "dodaj" : "enqueue";
      const O = stack ? "pop" : sl ? "vzemi" : "dequeue";
      const head = stack ? (sl ? "Sklad" : "Stack") : sl ? "Vrsta" : "Queue";
      if (t === 1 && Math.random() < 0.3)
        return bank(
          [
            [1, ["Sklad deluje po načelu?", "LIFO", "FIFO", "naključno", "po prioriteti"], ["A stack works by?", "LIFO", "FIFO", "random order", "priority"]],
            [1, ["Vrsta deluje po načelu?", "FIFO", "LIFO", "naključno", "po prioriteti"], ["A queue works by?", "FIFO", "LIFO", "random order", "priority"]],
            [1, ["Struktura za klice funkcij (rekurzija)?", "sklad", "vrsta", "zgoščena tabela", "kopica"], ["Structure for function calls (recursion)?", "stack", "queue", "hash table", "heap"]],
            [1, ["Struktura za iskanje v širino (BFS)?", "vrsta", "sklad", "kopica", "zgoščena tabela"], ["Structure for breadth-first search?", "queue", "stack", "heap", "hash table"]],
            [1, ["Struktura za iskanje v globino (DFS)?", "sklad", "vrsta", "kopica", "zgoščena tabela"], ["Structure for depth-first search?", "stack", "queue", "heap", "hash table"]],
            [1, ["Struktura za prioritetno vrsto?", "kopica", "sklad", "povezan seznam", "vrsta FIFO"], ["Structure for a priority queue?", "heap", "stack", "linked list", "FIFO queue"]],
          ],
          1,
          ctx,
        );
      const vals = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      let ops;
      if (t === 1) ops = [["p", 4], ["o", 1]];
      else if (t === 2) ops = [["p", 4], ["o", 2]];
      else ops = pick([[["p", 2], ["o", 1], ["p", 2], ["o", 2]], [["p", 3], ["o", 2], ["p", 2], ["o", 1]], [["p", 3], ["o", 1], ["p", 1], ["o", 2]]]);
      // simulacija za obe strukturi
      let vi = 0;
      const S = [], Q = [], pushed = [];
      let lastS, lastQ;
      const parts = [];
      for (const [op, k] of ops) {
        if (op === "p") {
          const xs = vals.slice(vi, vi + k);
          vi += k;
          for (const x of xs) S.push(x), Q.push(x), pushed.push(x);
          parts.push(`${P} ${xs.join(",")}`);
        } else {
          for (let i = 0; i < k; i++) (lastS = S.pop()), (lastQ = Q.shift());
          parts.push(k === 1 ? O : `${O} ×${k}`);
        }
      }
      const a = stack ? lastS : lastQ;
      const other = stack ? lastQ : lastS;
      const rest = stack ? S : Q;
      return mk(`${head}: ${parts.join("; ")} → ${sl ? "zadnji vzeti" : "last removed"}?`, String(a), [other, ...shuffle([...rest, ...pushed])].map(String));
    },
  },
  {
    id: "r_ports",
    area: "rc_net",
    year: 14,
    name: { sl: "Protokoli in vrata", en: "Protocols and ports" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const pool = t === 1 ? PORTS.slice(0, 4) : PORTS;
      if (t >= 2 && Math.random() < 0.4) return bank(PROTO, t, ctx);
      const p = pick(pool);
      const others = shuffle(PORTS.filter((x) => x !== p));
      if (t !== 2 && Math.random() < 0.5) return mk(sl ? `Vrata ${p[1]}: protokol?` : `Port ${p[1]}: protocol?`, p[0], others.map((x) => x[0]));
      return mk(sl ? `${p[0]}: privzeta vrata?` : `${p[0]}: default port?`, String(p[1]), others.map((x) => String(x[1])));
    },
  },
  {
    id: "r_osi",
    area: "rc_net",
    year: 14,
    name: { sl: "Plasti OSI in naslovi", en: "OSI layers and addresses" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const lab = (i) => `${i} (${sl ? OSI[i - 1][0] : OSI[i - 1][1]})`;
      if (t === 3 && Math.random() < 0.5)
        return bank(
          [
            [3, ["Dolžina naslova IPv4?", "32 bitov", "48 bitov", "64 bitov", "128 bitov"], ["Length of an IPv4 address?", "32 bits", "48 bits", "64 bits", "128 bits"]],
            [3, ["Dolžina naslova IPv6?", "128 bitov", "32 bitov", "48 bitov", "64 bitov"], ["Length of an IPv6 address?", "128 bits", "32 bits", "48 bits", "64 bits"]],
            [3, ["Dolžina naslova MAC?", "48 bitov", "32 bitov", "64 bitov", "128 bitov"], ["Length of a MAC address?", "48 bits", "32 bits", "64 bits", "128 bits"]],
            [3, ["Podatkovna enota 2. plasti OSI?", "okvir", "paket", "segment", "bit"], ["Data unit of OSI layer 2?", "frame", "packet", "segment", "bit"]],
            [3, ["Podatkovna enota 3. plasti OSI?", "paket", "okvir", "segment", "bit"], ["Data unit of OSI layer 3?", "packet", "frame", "segment", "bit"]],
            [3, ["Podatkovna enota 4. plasti (TCP)?", "segment", "paket", "okvir", "bit"], ["Data unit of layer 4 (TCP)?", "segment", "packet", "frame", "bit"]],
            [3, ["Število plasti modela OSI?", "7", "4", "5", "8"], ["Number of layers in the OSI model?", "7", "4", "5", "8"]],
          ],
          3,
          ctx,
        );
      const pool = t === 1 ? OSI_ITEMS.filter((x) => ["IP", "TCP", "HTTP", "Usmerjevalnik", "Stikalo", "MAC naslov", "IP naslov", "UDP", "DNS", "Razdelilnik (hub)"].includes(x[0])) : OSI_ITEMS;
      const it = pick(pool);
      const L = it[2];
      const ws = shuffle([L - 1, L + 1, L - 2, L + 2, L + 3, L - 3].filter((k) => k >= 1 && k <= 7)).map(lab);
      return mk(sl ? `${it[0]}: plast OSI?` : `${it[1]}: OSI layer?`, lab(L), ws);
    },
  },
  {
    id: "r_ip",
    area: "rc_net",
    year: 14,
    name: { sl: "Naslovi IPv4 in podomrežja", en: "IPv4 addressing and subnets" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = (x) => N(ctx, x);
      const mask = (p) => [0, 1, 2, 3].map((i) => 256 - 2 ** (8 - Math.max(0, Math.min(8, p - 8 * i)))).map((x) => (x === 256 ? 0 : x)).join(".");
      if (t === 1) {
        const p = pick([8, 16, 24]);
        if (Math.random() < 0.5) return mk(sl ? `Maska omrežja /${p}?` : `Subnet mask for /${p}?`, mask(p), [8, 16, 24, 32].filter((x) => x !== p).map(mask));
        return mk(`${mask(p)} = ?`, `/${p}`, [8, 16, 24, 32].filter((x) => x !== p).map((x) => `/${x}`));
      }
      if (t === 2) {
        const p = R(20, 30);
        const A = 2 ** (32 - p);
        if (Math.random() < 0.5) return mk(sl ? `Vseh naslovov v omrežju /${p}?` : `Total addresses in a /${p}?`, n(A), [A - 2, A * 2, A / 2, 32 - p].map(n));
        return mk(sl ? `Uporabnih naslovov za gostitelje v /${p}?` : `Usable host addresses in a /${p}?`, n(A - 2), [A, A - 1, A * 2 - 2, A / 2 - 2].map(n));
      }
      const k = R(0, 1);
      if (k === 0) {
        const p = R(17, 30);
        const ps = [p - 1, p + 1, p - 2, p + 2].filter((x) => x >= 16 && x <= 32);
        return mk(sl ? `Maska omrežja /${p}?` : `Subnet mask for /${p}?`, mask(p), ps.map(mask));
      }
      const p = R(25, 28);
      const size = 2 ** (32 - p);
      const host = R(1, 254);
      const net = host - (host % size);
      if (host === net) return mk(sl ? `Maska omrežja /${p}?` : `Subnet mask for /${p}?`, mask(p), [p - 1, p + 1, p + 2].map(mask));
      const ip = (x) => `192.168.1.${x}`;
      return mk(sl ? `Omrežni naslov za ${ip(host)}/${p}?` : `Network address of ${ip(host)}/${p}?`, ip(net), [ip(net + 1), ip(net + size - 1), ip(0), ip(host), ip(Math.max(0, net - size)), ip(net + size), ip(net + size / 2)]);
    },
  },
  {
    id: "r_hw",
    area: "rc_net",
    year: 13,
    name: { sl: "Strojna oprema in takt", en: "Hardware and clock speed" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = (x) => N(ctx, x);
      if (t === 3) {
        const k = R(0, 2);
        if (k === 0) {
          const f = pick([1, 2, 4, 5]);
          const T = 1 / f;
          return mk(sl ? `Takt ${f} GHz: trajanje cikla?` : `Clock ${f} GHz: cycle time?`, `${n(T)} ns`, [`${n(f)} ns`, `${n(T)} µs`, `${n(T * 10)} ns`, `${n(T)} ms`]);
        }
        if (k === 1) {
          const f = pick([2, 3, 4]), ipc = pick([2, 4]);
          const g = (x) => `${n(x)} · 10⁹`;
          return mk(sl ? `${f} GHz, IPC = ${ipc}: ukazov na sekundo?` : `${f} GHz, IPC = ${ipc}: instructions per second?`, g(f * ipc), [g(f), `${n(f * ipc)} · 10⁶`, g(f + ipc), g(f / ipc)]);
        }
        const [b, s] = pick([[16, "64 KiB"], [20, "1 MiB"], [24, "16 MiB"], [30, "1 GiB"], [32, "4 GiB"]]);
        const all = ["64 KiB", "1 MiB", "16 MiB", "1 GiB", "4 GiB", "32 GiB", "256 KiB", "2 GiB"];
        return mk(sl ? `${b}-bitni naslovi (po bajtih): največ pomnilnika?` : `${b}-bit byte addresses: max memory?`, s, shuffle(all.filter((x) => x !== s)));
      }
      return bank(HW, t, ctx);
    },
  },
];
