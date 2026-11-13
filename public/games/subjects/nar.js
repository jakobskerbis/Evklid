// Pojmi za igre: nar (glej README.md v tej mapi).
// Naravoslovje, 6. in 7. razred OŠ. Večinoma banke vprašanj (vnos: stopnja, "vprašanje|pravilno|napačno|…" sl in en),
// kjer gre, pa računske naloge (pretvarjanje enot, merjenje, temperatura, pH).

// ---------- pomožne ----------
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
const L = (ctx, sl, en) => (ctx.lang === "sl" ? sl : en);
const C = [];
const def = (id, area, year, sl, en, gen) => C.push({ id, area, year, name: { sl, en }, gen });

// Naloga: tipične napake najprej (premešane), nato rezervni napačni; 3–4 napačni, brez podvajanja.
function out(q, a, ws, fill = []) {
  const seen = new Set([a]);
  const w = [];
  for (const s of [...shuffle(ws), ...fill]) {
    if (s == null || s === "" || seen.has(s) || w.length >= 4) continue;
    seen.add(s);
    w.push(s);
  }
  return { q, a, w: shuffle(w) };
}
const nice = (x) =>
  Number.isFinite(x) && Math.abs(x) >= 1e-6 && Math.abs(x) < 1e9 && Math.abs(x - Number(x.toPrecision(4))) <= 1e-9 * Math.abs(x);
// Številski odgovor z enoto; napačni: števila (tipične napake) ali že oblikovani nizi.
function nq(ctx, q, a, unit, ws, opt = {}) {
  const f = (x) => ctx.num(x) + (unit ? " " + unit : "");
  const ok = (x) => nice(x) && (opt.neg || x > 0) && Math.abs(x - a) > 1e-9 * Math.max(1, Math.abs(a)) && Math.abs(Math.round(x * 1e6) / 1e6 - x) <= 1e-9 * Math.abs(x);
  const W = ws.filter((x) => typeof x !== "number" || ok(x)).map((x) => (typeof x === "number" ? f(x) : x));
  const F = [a * 10, a / 10, a * 2, a / 2, a + 1, a - 1, a + 2, a * 100].filter(ok).map(f);
  return out(q, f(a), W, F);
}
// Banka: stopnja 1 vzame vnose 1; stopnji 2 in 3 večinoma svoje, v 30 % z nižje stopnje.
function bank(items) {
  return (tier, ctx) => {
    let lv = tier;
    if (tier > 1 && Math.random() < 0.3) lv = tier - 1;
    let pool = items.filter((it) => it[0] === lv);
    if (!pool.length) pool = items.filter((it) => it[0] <= tier);
    const it = pick(pool);
    const [q, a, ...ws] = (ctx.lang === "sl" ? it[1] : it[2]).split("|");
    return out(q, a, ws);
  };
}
// Pojem, ki je samo banka.
const defBank = (id, area, year, sl, en, items) => def(id, area, year, sl, en, bank(items));

// =====================================================================
// RAZISKOVANJE IN MERJENJE
// =====================================================================
const U_BASIC = [
  ["km", "m", 1000], ["m", "dm", 10], ["m", "cm", 100], ["dm", "cm", 10], ["cm", "mm", 10], ["m", "mm", 1000],
  ["kg", "dag", 100], ["dag", "g", 10], ["kg", "g", 1000], ["t", "kg", 1000], ["L", "dL", 10], ["L", "mL", 1000],
  ["dL", "mL", 100], ["h", "min", 60], ["min", "s", 60],
];
const U_VOL = [["dm³", "L", 1], ["L", "cm³", 1000], ["m³", "L", 1000], ["cm³", "mL", 1], ["m³", "dm³", 1000], ["dm³", "cm³", 1000]];
// sestavljene količine: [velika, mala, faktor, največ malih]
const U_MIX = [["m", "cm", 100, 99], ["km", "m", 1000, 999], ["kg", "g", 1000, 999], ["kg", "dag", 100, 99], ["h", "min", 60, 59], ["min", "s", 60, 59], ["L", "dL", 10, 9], ["L", "mL", 1000, 999]];
def("n_units", "nr_mer", 6, "Merske enote in pretvarjanje", "Units and conversions", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    if (Math.random() < 0.12) return nq(ctx, L(ctx, "1 dan = ? h", "1 day = ? h"), 24, "", [12, 60, 100, 10]);
    const [A, B, f] = pick(U_BASIC);
    return nq(ctx, `1 ${A} = ? ${B}`, f, "", [f * 10, f / 10, ...(f === 60 ? [100] : [100, 1000, 10])]);
  }
  if (t === 2) {
    const [A, B, f] = pick(U_BASIC);
    if (f === 60) {
      const v = pick([1.5, 2.5, 0.5, 3, 2, 0.25, 0.75]);
      if (Math.random() < 0.5) return nq(ctx, `${n(v)} ${A} = ? ${B}`, v * 60, "", [v * 100, v * 10, Math.floor(v) * 100 + (v % 1) * 10, v * 60 * 60]);
      return nq(ctx, `${n(v * 60)} ${B} = ? ${A}`, v, "", [(v * 60) / 100, v * 10, Math.floor(v) + ((v * 60) % 60) / 100]);
    }
    const v = pick([2, 3, 5, 1.5, 2.5, 0.5, 0.2, 4, 12, 25]);
    if (Math.random() < 0.5) return nq(ctx, `${n(v)} ${A} = ? ${B}`, v * f, "", [v * f * 10, (v * f) / 10, v / f, v * f * 100]);
    return nq(ctx, `${n(v * f)} ${B} = ? ${A}`, v, "", [v * 10, v / 10, v * 100, v * f * f]);
  }
  if (Math.random() < 0.35) {
    const [A, B, f] = pick(U_VOL), v = pick([1, 2, 5, 0.5, 3]);
    return nq(ctx, `${n(v)} ${A} = ? ${B}`, v * f, "", [v * f * 10, (v * f) / 10, v * f * 100, v * 10, v * 100]);
  }
  const [A, B, f, max] = pick(U_MIX), a = R(1, 5), b = max === 999 ? R(1, 99) * 10 : R(1, max);
  const total = a * f + b;
  return nq(ctx, `${a} ${A} ${b} ${B} = ? ${B}`, total, "", [a * 100 + b, a + b, a * 10 + b, a * f * 10 + b, a * f]);
});

const MEASURE = [
  [1, "S čim merimo maso?|s tehtnico|z metrom|s termometrom|s štoparico", "Mass is measured with?|a balance|a tape measure|a thermometer|a stopwatch"],
  [1, "S čim merimo dolžino?|z metrom|s tehtnico|s termometrom|s štoparico", "Length is measured with?|a ruler|a balance|a thermometer|a stopwatch"],
  [1, "S čim merimo čas?|s štoparico|s tehtnico|z ravnilom|s termometrom", "Time is measured with?|a stopwatch|a balance|a ruler|a thermometer"],
  [1, "S čim merimo prostornino tekočine?|z merilnim valjem|s tehtnico|z ravnilom|s termometrom", "Liquid volume is measured with?|a measuring cylinder|a balance|a ruler|a thermometer"],
  [1, "S čim merimo temperaturo?|s termometrom|s tehtnico|z metrom|s štoparico", "Temperature is measured with?|a thermometer|a balance|a ruler|a stopwatch"],
  [1, "Masa jabolka je približno?|150 g|150 kg|15 mg|15 t", "An apple's mass is about?|150 g|150 kg|15 mg|15 t"],
  [1, "Višina učenca je približno?|150 cm|150 mm|15 m|1,5 km", "A pupil's height is about?|150 cm|150 mm|15 m|1.5 km"],
  [1, "Prostornina skodelice je približno?|250 mL|250 L|2,5 mL|25 m³", "A cup holds about?|250 mL|250 L|2.5 mL|25 m³"],
  [1, "Masa učenca 6. razreda je približno?|40 kg|40 g|400 kg|4 t", "A 12-year-old's mass is about?|40 kg|40 g|400 kg|4 t"],
  [1, "Šolska ura traja?|45 min|45 s|4,5 h|45 h", "A school lesson lasts?|45 min|45 s|4.5 h|45 h"],
  [1, "Dolžina zvezka je približno?|30 cm|30 m|3 mm|30 km", "A notebook is about how long?|30 cm|30 m|3 mm|30 km"],
  [1, "Prostornina vedra je približno?|10 L|10 mL|10 m³|1 mL", "A bucket holds about?|10 L|10 mL|10 m³|1 mL"],
  [1, "Temperatura zdravega človeka?|okoli 37 °C|okoli 20 °C|okoli 50 °C|okoli 0 °C", "Body temperature of a healthy person?|about 37 °C|about 20 °C|about 50 °C|about 0 °C"],
  [1, "Debelina lista papirja je približno?|0,1 mm|1 cm|1 m|10 cm", "A sheet of paper is about how thick?|0.1 mm|1 cm|1 m|10 cm"],
  [2, "Pri branju merilnega valja je oko?|v višini gladine|nad gladino|pod gladino|zaprto", "Reading a measuring cylinder, your eye is?|at liquid level|above it|below it|closed"],
  [2, "Prostornino kamna izmerimo s?|potopitvijo v vodo|tehtanjem|termometrom|štoparico", "A stone's volume is measured by?|sinking it in water|weighing it|a thermometer|a stopwatch"],
  [2, "Pred tehtanjem tehtnico?|naravnamo na nič|segrejemo|obrnemo|zmočimo", "Before weighing, the balance is?|set to zero|heated|turned over|wetted"],
  [2, "Osnovna enota SI za maso?|kg|g|t|mg", "SI base unit of mass?|kg|g|t|mg"],
  [2, "Osnovna enota SI za dolžino?|m|cm|km|mm", "SI base unit of length?|m|cm|km|mm"],
  [2, "Osnovna enota SI za čas?|s|min|h|dan", "SI base unit of time?|s|min|h|day"],
  [2, "Termometer odčitamo, ko?|se kazanje ustali|ga takoj vstavimo|ga stresemo|ga segrejemo", "Read a thermometer when?|the reading settles|you just put it in|you shake it|you heat it"],
  [3, "Meritev ponovimo večkrat, da zmanjšamo?|napako|maso|prostornino|temperaturo", "We repeat a measurement to reduce?|the error|the mass|the volume|the temperature"],
  [3, "Pri pravilno izvedenem poskusu spreminjamo?|eno spremenljivko|vse spremenljivke|nobene|dve hkrati", "In a fair test we change?|one variable|all variables|nothing|two at once"],
  [3, "Domneva, ki jo preverimo s poskusom, je?|hipoteza|rezultat|sklep|meritev", "An idea tested by an experiment is a?|hypothesis|result|conclusion|measurement"],
  [3, "Rezultate meritev pregledno prikažemo v?|tabeli in grafu|pesmi|zemljevidu|risbi živali", "Results are shown clearly with?|a table and graph|a poem|a map|an animal drawing"],
  [3, "Kaj ni enota za prostornino?|kg|L|m³|mL", "Which is NOT a unit of volume?|kg|L|m³|mL"],
  [3, "Kaj ni enota za maso?|L|g|t|dag", "Which is NOT a unit of mass?|L|g|t|mg"],
];
const MEASURE_BANK = bank(MEASURE);
def("n_measure", "nr_mer", 6, "Merjenje", "Measuring", (t, ctx) => {
  const n = ctx.num;
  if (t === 2 && Math.random() < 0.5) {
    if (Math.random() < 0.5) {
      const V1 = R(4, 16) * 5, d = R(1, 6) * 5, V2 = V1 + d;
      return nq(ctx, L(ctx, `Voda ${V1} mL, s kamnom ${V2} mL. V kamna = ?`, `Water ${V1} mL, with stone ${V2} mL. Stone V = ?`), d, "mL", [V2, V1, V1 + V2, `${d} L`]);
    }
    const [Rg, k] = pick([[10, 5], [10, 10], [10, 2], [20, 4], [20, 10], [50, 5], [50, 10], [100, 4], [100, 5], [100, 10], [1, 10]]), s = Rg / k;
    const rz = k === 2 ? "sta 2 razdelka" : k === 4 ? "so 4 razdelki" : `je ${k} razdelkov`;
    return nq(ctx, L(ctx, `Med 0 in ${Rg} mL ${rz}. 1 razdelek = ?`, `${k} divisions between 0 and ${Rg} mL. 1 division = ?`), s, "mL", [k, Rg, Rg * k, k / Rg]);
  }
  if (t === 3 && Math.random() < 0.5) {
    for (let i = 0; i < 40; i++) {
      const m = R(10, 40), k = pick([3, 4]), d = [R(-2, 2), R(-2, 2), R(-2, 2)];
      const vals = k === 3 ? [m + d[0], m + d[1], m - d[0] - d[1]] : [m + d[0], m + d[1], m + d[2], m - d[0] - d[1] - d[2]];
      if (new Set(vals).size < 2 || vals.some((v) => v <= 0)) continue;
      const sum = vals.reduce((a, b) => a + b, 0);
      return nq(ctx, L(ctx, `Meritve: ${vals.join("; ")} cm. Povprečje?`, `Measurements: ${vals.join("; ")} cm. Mean?`), m, "cm", [sum, Math.max(...vals), Math.min(...vals), sum / (k - 1)]);
    }
  }
  return MEASURE_BANK(t, ctx);
});

defBank("n_cell", "nr_mer", 6, "Mikroskop in celica", "Microscope and cells", [
  [1, "Osnovna gradbena enota živih bitij?|celica|organ|tkivo|kost", "Basic unit of all living things?|the cell|an organ|a tissue|a bone"],
  [1, "S čim opazujemo celice?|z mikroskopom|z daljnogledom|s termometrom|s tehtnico", "Cells are observed with a?|microscope|telescope|thermometer|balance"],
  [1, "Rastlinska celica ima, živalska pa ne?|celično steno|celično membrano|jedro|citoplazmo", "Plant cells have, animal cells don't?|a cell wall|a cell membrane|a nucleus|cytoplasm"],
  [1, "Zeleno barvilo v kloroplastih?|klorofil|hemoglobin|melanin|škrob", "Green pigment in chloroplasts?|chlorophyll|haemoglobin|melanin|starch"],
  [1, "Fotosinteza poteka v?|kloroplastih|jedru|celični steni|vakuoli", "Photosynthesis takes place in?|chloroplasts|the nucleus|the cell wall|the vacuole"],
  [1, "Dedni zapis celice je predvsem v?|jedru|celični steni|vakuoli|celični membrani", "A cell's genetic material is mainly in?|the nucleus|the cell wall|the vacuole|the membrane"],
  [1, "Del mikroskopa, v katerega gledamo?|okular|objektiv|mizica|vijak", "Microscope part you look into?|eyepiece|objective|stage|focus knob"],
  [1, "Leča mikroskopa tik nad preparatom?|objektiv|okular|zrcalo|stojalo", "Microscope lens just above the slide?|objective|eyepiece|mirror|stand"],
  [1, "Preparat položimo na?|predmetno stekelce|okular|objektiv|vijak", "The specimen is placed on a?|glass slide|eyepiece|objective|knob"],
  [1, "S čim pokrijemo preparat?|s krovnim stekelcem|z objektivom|z okularjem|s papirjem","The specimen is covered with a?|cover slip|objective|eyepiece|paper"],
  [1, "Organizem iz ene same celice je?|enoceličar|večceličar|tkivo|organ", "An organism of one cell is?|unicellular|multicellular|a tissue|an organ"],
  [1, "Bakterije so?|enoceličarji|rastline|živali|glive s klobukom", "Bacteria are?|unicellular|plants|animals|mushrooms"],
  [1, "Velika osrednja vakuola je značilna za celice?|rastlin|živali|bakterij|človeka", "A large central vacuole is typical of?|plant cells|animal cells|bacteria|human cells"],
  [2, "Okular 10×, objektiv 40×. Povečava?|400×|50×|4×|4000×", "Eyepiece 10×, objective 40×. Magnification?|400×|50×|4×|4000×"],
  [2, "Okular 5×, objektiv 10×. Povečava?|50×|15×|2×|500×", "Eyepiece 5×, objective 10×. Magnification?|50×|15×|2×|500×"],
  [2, "Okular 15×, objektiv 4×. Povečava?|60×|19×|11×|600×", "Eyepiece 15×, objective 4×. Magnification?|60×|19×|11×|600×"],
  [2, "Okular 10×, objektiv 100×. Povečava?|1000×|110×|10×|100×", "Eyepiece 10×, objective 100×. Magnification?|1000×|110×|10×|100×"],
  [2, "Skupina podobnih celic z isto nalogo?|tkivo|organ|organski sistem|organizem", "Group of similar cells with one job?|a tissue|an organ|an organ system|an organism"],
  [2, "Več tkiv, ki skupaj opravljajo nalogo?|organ|celica|molekula|vakuola", "Several tissues working together form?|an organ|a cell|a molecule|a vacuole"],
  [2, "Celico obdaja in nadzira prehod snovi?|celična membrana|jedro|kloroplast|vakuola", "Controls what enters and leaves a cell?|cell membrane|nucleus|chloroplast|vacuole"],
  [2, "Kvasovke so?|glive|bakterije|rastline|živali", "Yeasts are?|fungi|bacteria|plants|animals"],
  [3, "Celično dihanje poteka v?|mitohondrijih|kloroplastih|celični steni|vakuoli", "Cellular respiration happens in?|mitochondria|chloroplasts|the cell wall|the vacuole"],
  [3, "Celična stena rastlin je večinoma iz?|celuloze|škroba|kosti|maščobe", "A plant cell wall is mostly?|cellulose|starch|bone|fat"],
  [3, "S čim dokažemo škrob?|z jodovico|z vodo|s soljo|s kisom","Starch is detected with?|iodine solution|water|salt|vinegar"],
  [3, "Celica → tkivo → ? → organski sistem|organ|molekula|atom|organizem", "Cell → tissue → ? → organ system|organ|molecule|atom|organism"],
  [3, "Živalska celica nima?|kloroplastov|jedra|membrane|citoplazme", "An animal cell has no?|chloroplasts|nucleus|membrane|cytoplasm"],
  [3, "Bakterijska celica nima?|pravega jedra|membrane|citoplazme|dednega zapisa", "A bacterial cell has no?|true nucleus|membrane|cytoplasm|genetic material"],
]);

// =====================================================================
// SNOVI
// =====================================================================
defBank("n_states", "nr_snov", 6, "Agregatna stanja in spremembe", "States of matter and changes", [
  [1, "Voda pri sobni temperaturi je?|tekoča|trdna|plinasta|prašnata", "Water at room temperature is?|liquid|solid|a gas|a powder"],
  [1, "Led je voda v stanju?|trdnem|tekočem|plinastem|prašnatem", "Ice is water in which state?|solid|liquid|gas|powder"],
  [1, "Vodna para je?|plin|trdna snov|tekočina|kovina", "Water vapour is a?|gas|solid|liquid|metal"],
  [1, "Led se spremeni v vodo. To je?|taljenje|strjevanje|izparevanje|kondenzacija", "Ice turns into water. This is?|melting|freezing|evaporation|condensation"],
  [1, "Voda zmrzne v led. To je?|strjevanje|taljenje|izparevanje|kondenzacija", "Water freezes into ice. This is?|freezing|melting|evaporation|condensation"],
  [1, "Mokro perilo se posuši zaradi?|izhlapevanja|taljenja|strjevanja|kondenzacije", "Wet washing dries because of?|evaporation|melting|freezing|condensation"],
  [1, "Ogledalo v kopalnici se orosi zaradi?|kondenzacije|izparevanja|taljenja|strjevanja", "A bathroom mirror mists up due to?|condensation|evaporation|melting|freezing"],
  [1, "Stalno obliko ima snov v stanju?|trdnem|tekočem|plinastem|nobenem", "Which state has a fixed shape?|solid|liquid|gas|none"],
  [1, "Ves prostor posode zapolni?|plin|tekočina|trdna snov|led", "Which fills its whole container?|a gas|a liquid|a solid|ice"],
  [1, "Obliko posode prevzame, prostornina ostane?|tekočina|trdna snov|plin|kamen", "Takes the container's shape, keeps its volume?|a liquid|a solid|a gas|a stone"],
  [1, "Vrelišče vode pri normalnem tlaku?|100 °C|0 °C|50 °C|37 °C","Water boils at (normal pressure)?|100 °C|0 °C|50 °C|37 °C"],
  [1, "Led se stali pri?|0 °C|100 °C|−20 °C|37 °C", "Ice melts at?|0 °C|100 °C|−20 °C|37 °C"],
  [1, "Maslo na soncu se?|stali|strdi|kondenzira|zmrzne", "Butter in the sun?|melts|freezes|condenses|solidifies"],
  [2, "Delci so najbolj urejeni v?|trdni snovi|tekočini|plinu|vodni pari", "Particles are most ordered in a?|solid|liquid|gas|vapour"],
  [2, "Delci se najhitreje gibljejo v?|plinu|trdni snovi|tekočini|ledu", "Particles move fastest in a?|gas|solid|liquid|block of ice"],
  [2, "Samodejno mešanje delcev dveh snovi?|difuzija|destilacija|filtracija|kondenzacija", "Particles of two substances mixing by themselves?|diffusion|distillation|filtration|condensation"],
  [2, "Difuzija čaja je hitrejša v?|topli vodi|hladni vodi|ledeni vodi|zmrznjeni vodi", "Tea diffuses faster in?|hot water|cold water|ice-cold water|frozen water"],
  [2, "Plin lahko stisnemo, ker so delci?|daleč narazen|tesno skupaj|negibni|v kristalu", "A gas can be squeezed because particles are?|far apart|packed tight|not moving|in a crystal"],
  [2, "Trdno → plinasto brez tekočine?|sublimacija|taljenje|izparevanje|strjevanje", "Solid → gas, skipping liquid?|sublimation|melting|evaporation|freezing"],
  [2, "Mehurčki v vreli vodi so iz?|vodne pare|kisika|vodika|ogljikovega dioksida", "Bubbles in boiling water are?|water vapour|oxygen|hydrogen|carbon dioxide"],
  [2, "Pri taljenju snov toploto?|prejema|oddaja|ne izmenjuje|uniči", "While melting, a substance heat?|takes in|gives off|exchanges no|destroys"],
  [3, "Voda ima največjo gostoto pri?|4 °C|0 °C|100 °C|20 °C", "Water is densest at?|4 °C|0 °C|100 °C|20 °C"],
  [3, "Led plava na vodi, ker ima?|manjšo gostoto|večjo gostoto|večjo maso|ostre robove", "Ice floats on water because it has?|lower density|higher density|more mass|sharp edges"],
  [3, "Voda se pri zmrzovanju?|razširi|skrči|ne spremeni|izpari", "When water freezes it?|expands|shrinks|doesn't change|evaporates"],
  [3, "Med taljenjem temperatura ledu?|ostane 0 °C|narašča|pada|niha", "While ice melts, its temperature?|stays at 0 °C|rises|falls|swings"],
  [3, "Na visoki gori voda vre pri?|nižji temperaturi|višji temperaturi|točno 100 °C|0 °C", "On a high mountain water boils at?|a lower temperature|a higher temperature|exactly 100 °C|0 °C"],
  [3, "Izhlapevanje je hitrejše, ko je?|toplo in vetrovno|hladno in mirno|vlažno|temno", "Evaporation is faster when it's?|warm and windy|cold and still|humid|dark"],
  [3, "Pri izhlapevanju se tekočina?|ohlaja|segreva|strdi|zgosti", "An evaporating liquid?|cools down|warms up|freezes|thickens"],
]);

defBank("n_mix", "nr_snov", 6, "Zmesi in ločevanje zmesi", "Mixtures and separation", [
  [1, "Kako ločimo pesek in vodo?|s filtriranjem|z destilacijo|z magnetom|s sejanjem", "Sand and water are separated by?|filtering|distillation|a magnet|sieving"],
  [1, "Kako ločimo železne opilke in pesek?|z magnetom|s filtriranjem|z izparevanjem|z destilacijo", "Iron filings and sand are separated with?|a magnet|filtering|evaporation|distillation"],
  [1, "Kako dobimo sol iz slane vode?|z izparevanjem|s filtriranjem|z magnetom|s sejanjem", "Salt from salt water is obtained by?|evaporation|filtering|a magnet|sieving"],
  [1, "Kako ločimo kamenčke in pesek?|s sejanjem|z magnetom|z izparevanjem|z destilacijo", "Pebbles and sand are separated by?|sieving|a magnet|evaporation|distillation"],
  [1, "Kako dobimo čisto vodo iz slane vode?|z destilacijo|s filtriranjem|s sejanjem|z magnetom", "Pure water from salt water is obtained by?|distillation|filtering|sieving|a magnet"],
  [1, "Kako ločimo barvila flomastra?|s kromatografijo|s sejanjem|z magnetom|s filtriranjem", "Felt-pen dyes are separated by?|chromatography|sieving|a magnet|filtering"],
  [1, "S čim ločimo olje in vodo?|z lijem ločnikom|z magnetom|s sitom|s filtrom", "Oil and water are separated with a?|separating funnel|magnet|sieve|filter paper"],
  [1, "Kaj je zmes?|zrak|kisik|zlato|destilirana voda", "Which is a mixture?|air|oxygen|pure gold|distilled water"],
  [1, "Kaj je čista snov?|destilirana voda|morska voda|zrak|mleko", "Which is a pure substance?|distilled water|sea water|air|milk"],
  [1, "Kaj je raztopina?|sladkor v vodi|pesek v vodi|olje v vodi|kamenje v vodi", "Which is a solution?|sugar in water|sand in water|oil in water|stones in water"],
  [1, "Homogena zmes je?|slana voda|pesek in voda|sadna solata|olje in voda", "Which mixture is homogeneous?|salt water|sand and water|fruit salad|oil and water"],
  [1, "Heterogena zmes je?|pesek in voda|slana voda|sladek čaj|zrak", "Which mixture is heterogeneous?|sand and water|salt water|sweet tea|air"],
  [2, "Pri filtriranju trdne delce zadrži?|filtrirni papir|filtrat|lij|čaša", "When filtering, solids are held by the?|filter paper|filtrate|funnel|beaker"],
  [2, "Tekočina, ki preide skozi filter?|filtrat|ostanek|usedlina|topljenec", "Liquid that passes through a filter?|filtrate|residue|sediment|solute"],
  [2, "Odlivanje tekočine nad usedlino?|dekantiranje|destilacija|sublimacija|kromatografija", "Pouring liquid off a sediment?|decanting|distillation|sublimation|chromatography"],
  [2, "V slani vodi je sol?|topljenec|topilo|filtrat|usedlina", "In salt water, salt is the?|solute|solvent|filtrate|sediment"],
  [2, "V slani vodi je voda?|topilo|topljenec|usedlina|filtrat", "In salt water, water is the?|solvent|solute|sediment|filtrate"],
  [2, "Pri destilaciji para v hladilniku?|kondenzira|zmrzne|zgori|se stali", "In distillation, vapour in the condenser?|condenses|freezes|burns|melts"],
  [2, "Bron je?|zmes kovin|element|plin|nekovina", "Bronze is?|a mixture of metals|an element|a gas|a non-metal"],
  [3, "Raztopina, ki ne raztopi več snovi?|nasičena|nenasičena|razredčena|čista", "A solution that can dissolve no more?|saturated|unsaturated|dilute|pure"],
  [3, "Sladkor se v topli vodi raztaplja?|hitreje|počasneje|enako hitro|sploh ne", "Sugar dissolves in warm water?|faster|slower|equally fast|not at all"],
  [3, "Destilacija loči snovi po različnem?|vrelišču|barvi|magnetnosti|vonju", "Distillation separates by different?|boiling points|colours|magnetism|smells"],
  [3, "Sejanje loči snovi po?|velikosti delcev|barvi|vrelišču|topnosti", "Sieving separates by?|particle size|colour|boiling point|solubility"],
  [3, "Magnet loči snovi po?|magnetnosti|gostoti|barvi|vrelišču", "A magnet separates by?|magnetism|density|colour|boiling point"],
  [3, "Filtriranje od tekočine loči?|netopne delce|raztopljeno sol|raztopljen sladkor|raztopljen plin", "Filtering removes from a liquid?|insoluble bits|dissolved salt|dissolved sugar|dissolved gas"],
  [3, "Lij ločnik loči tekočini, ki se?|ne mešata|mešata|raztapljata|izparevata", "A separating funnel splits liquids that?|don't mix|mix well|dissolve|evaporate"],
]);

const PROPS = bank([
  [1, "Električni tok prevaja?|baker|les|plastika|steklo", "Which conducts electricity?|copper|wood|plastic|glass"],
  [1, "Magnet privlači?|železen žebelj|aluminijasto folijo|bakreno žico|lesen svinčnik", "A magnet attracts an?|iron nail|aluminium foil|copper wire|wooden pencil"],
  [1, "Prozoren material?|steklo|les|železo|karton", "Which material is transparent?|glass|wood|iron|cardboard"],
  [1, "Najtrša naravna snov?|diamant|kreda|les|vosek", "Hardest natural substance?|diamond|chalk|wood|wax"],
  [1, "V vodi se raztopi?|sladkor|pesek|olje|kamen", "Which dissolves in water?|sugar|sand|oil|stone"],
  [1, "V vodi plava?|plutovina|železo|kamen|steklo", "Which floats on water?|cork|iron|stone|glass"],
  [1, "V vodi potone?|kamen|plutovina|stiropor|suh les", "Which sinks in water?|a stone|cork|polystyrene|dry wood"],
  [1, "Prožen material?|guma|steklo|kreda|glina", "Which material is elastic?|rubber|glass|chalk|clay"],
  [1, "Krhek material?|steklo|guma|volna|baker", "Which material is brittle?|glass|rubber|wool|copper"],
  [1, "Dober toplotni izolator?|volna|baker|aluminij|železo", "Good heat insulator?|wool|copper|aluminium|iron"],
  [1, "Kovina, ki je pri sobni temperaturi tekoča?|živo srebro|železo|baker|aluminij", "Metal that is liquid at room temperature?|mercury|iron|copper|aluminium"],
  [1, "Kaj gori?|les|steklo|kamen|voda", "Which burns?|wood|glass|stone|water"],
  [2, "Gostota vode je?|1 g/cm³|10 g/cm³|0,1 g/cm³|100 g/cm³", "Density of water?|1 g/cm³|10 g/cm³|0.1 g/cm³|100 g/cm³"],
  [2, "Snov z manjšo gostoto od vode v vodi?|plava|potone|izgine|se dvigne v zrak", "A substance less dense than water?|floats|sinks|vanishes|flies up"],
  [2, "Kovine dobro prevajajo?|toploto in elektriko|samo zvok|samo svetlobo|nič", "Metals conduct well?|heat and electricity|only sound|only light|nothing"],
  [2, "Lastnost, ki jo zaznamo z nosom?|vonj|barva|trdota|gostota", "Property we detect with the nose?|smell|colour|hardness|density"],
  [2, "Plastiko izdelujejo predvsem iz?|nafte|lesa|peska|železove rude", "Plastic is mostly made from?|crude oil|wood|sand|iron ore"],
  [2, "Steklo izdelujejo iz?|peska|nafte|lesa|volne", "Glass is made from?|sand|crude oil|wood|wool"],
  [2, "Papir izdelujejo iz?|lesa|nafte|peska|železa", "Paper is made from?|wood|crude oil|sand|iron"],
  [3, "Železo rjavi, ko je v stiku?|z vodo in zrakom|s suhim zrakom|z oljem|z barvo","Iron rusts in contact with?|water and air|dry air|oil|paint"],
  [3, "Kovine pridobivamo iz?|rud|nafte|lesa|peska", "Metals are obtained from?|ores|crude oil|wood|sand"],
  [3, "Gostota je masa deljena s?|prostornino|težo|časom|temperaturo", "Density is mass divided by?|volume|weight|time|temperature"],
]);
def("n_props", "nr_snov", 6, "Lastnosti snovi in materialov", "Properties of materials", (t, ctx) => {
  const n = ctx.num;
  if (t === 3 && Math.random() < 0.5) {
    const rho = pick([0.5, 0.8, 0.9, 2, 2.5, 2.7, 4, 5, 8, 0.2]), V = pick([10, 20, 50, 100]), m = rho * V;
    if (Math.random() < 0.5) return nq(ctx, `m = ${n(m)} g, V = ${V} cm³, ρ = ?`, rho, "g/cm³", [m * V, V / m, m - V]);
    return out(L(ctx, `Kocka z maso ${n(m)} g in V = ${V} cm³ v vodi?`, `Block of ${n(m)} g and ${V} cm³ in water?`), L(ctx, rho < 1 ? "plava" : "potone", rho < 1 ? "floats" : "sinks"), ctx.lang === "sl" ? [rho < 1 ? "potone" : "plava", "lebdi", "se dvigne v zrak"] : [rho < 1 ? "sinks" : "floats", "hovers", "rises into the air"]);
  }
  return PROPS(t, ctx);
});

defBank("n_change", "nr_snov", 7, "Fizikalne in kemijske spremembe", "Physical and chemical changes", [
  [1, "Kemijska sprememba je?|gorenje lesa|taljenje ledu|trganje papirja|vrenje vode", "Which is a chemical change?|burning wood|melting ice|tearing paper|boiling water"],
  [1, "Fizikalna sprememba je?|taljenje ledu|gorenje sveče|rjavenje železa|kisanje mleka", "Which is a physical change?|melting ice|a candle burning|iron rusting|milk souring"],
  [1, "Pri kemijski spremembi nastane?|nova snov|ista snov|samo para|nič", "A chemical change produces?|a new substance|the same substance|only steam|nothing"],
  [1, "Rjavenje železa je sprememba?|kemijska|fizikalna|agregatna|navidezna", "Rusting of iron is a change that is?|chemical|physical|a change of state|imaginary"],
  [1, "Vrenje vode je sprememba?|fizikalna|kemijska|jedrska|biološka", "Boiling water is a change that is?|physical|chemical|nuclear|biological"],
  [1, "Za gorenje potrebujemo gorivo, toploto in?|kisik|dušik|vodo|pesek", "Burning needs fuel, heat and?|oxygen|nitrogen|water|sand"],
  [1, "Peka kruha je sprememba?|kemijska|fizikalna|agregatna|navidezna", "Baking bread is a change that is?|chemical|physical|a change of state|imaginary"],
  [1, "Raztapljanje sladkorja v čaju je sprememba?|fizikalna|kemijska|jedrska|gorenje", "Sugar dissolving in tea is a change that is?|physical|chemical|nuclear|burning"],
  [1, "Znak kemijske spremembe?|nastanek plina|sprememba oblike|drobljenje|mešanje", "A sign of a chemical change?|a gas forms|shape changes|crushing|stirring"],
  [1, "Kemijski simbol kisika?|O|K|Ki|Ox", "Chemical symbol of oxygen?|O|Ox|K|Oy"],
  [1, "Kemijski simbol vodika?|H|V|Vo|W", "Chemical symbol of hydrogen?|H|Hy|Hd|W"],
  [1, "Kemijski simbol železa?|Fe|Ž|Ze|F", "Chemical symbol of iron?|Fe|I|Ir|F"],
  [1, "Kemijski simbol ogljika?|C|O|Og|Co", "Chemical symbol of carbon?|C|Ca|Cb|Co"],
  [2, "Voda je?|spojina|element|zmes|kovina", "Water is?|a compound|an element|a mixture|a metal"],
  [2, "Kisik je?|element|spojina|zmes|kovina", "Oxygen is?|an element|a compound|a mixture|a metal"],
  [2, "Ogljikov dioksid je?|spojina|element|zmes|kovina", "Carbon dioxide is?|a compound|an element|a mixture|a metal"],
  [2, "Zrak je?|zmes|element|spojina|kovina", "Air is?|a mixture|an element|a compound|a metal"],
  [2, "Najmanjši delec elementa?|atom|celica|kristal|kapljica", "Smallest particle of an element?|an atom|a cell|a crystal|a droplet"],
  [2, "Plin, ki skali apnico?|ogljikov dioksid|kisik|vodik|dušik", "Gas that turns limewater milky?|carbon dioxide|oxygen|hydrogen|nitrogen"],
  [2, "Kemijski simbol natrija?|Na|S|So|K", "Chemical symbol of sodium?|Na|S|So|K"],
  [2, "Kemijski simbol zlata?|Au|Z|Zl|Ag", "Chemical symbol of gold?|Au|G|Go|Ag"],
  [2, "Kemijski simbol bakra?|Cu|B|Ba|Bk", "Chemical symbol of copper?|Cu|C|Co|Cp"],
  [3, "Snovi pred kemijsko reakcijo so?|reaktanti|produkti|zmesi|raztopine", "Substances before a reaction are?|reactants|products|mixtures|solutions"],
  [3, "Snovi, ki pri reakciji nastanejo?|produkti|reaktanti|topila|indikatorji", "Substances formed in a reaction are?|products|reactants|solvents|indicators"],
  [3, "Skupna masa pri kemijski reakciji?|se ohrani|se poveča|se zmanjša|izgine", "Total mass in a chemical reaction?|is conserved|increases|decreases|vanishes"],
  [3, "H₂O sestavljata?|vodik in kisik|vodik in ogljik|ogljik in kisik|dušik in kisik", "H₂O is made of?|hydrogen and oxygen|hydrogen and carbon|carbon and oxygen|nitrogen and oxygen"],
  [3, "CO₂ sestavljata?|ogljik in kisik|kobalt in kisik|ogljik in vodik|kalcij in kisik", "CO₂ is made of?|carbon and oxygen|cobalt and oxygen|carbon and hydrogen|calcium and oxygen"],
  [3, "NaCl je?|kuhinjska sol|sladkor|voda|soda bikarbona", "NaCl is?|table salt|sugar|water|baking soda"],
  [3, "Pri gorenju sveče nastaneta voda in?|ogljikov dioksid|kisik|dušik|vodik", "A burning candle makes water and?|carbon dioxide|oxygen|nitrogen|hydrogen"],
]);

const PH = bank([
  [1, "Raztopina s pH = 7 je?|nevtralna|kisla|bazična|zelo kisla", "A solution with pH 7 is?|neutral|acidic|basic|very acidic"],
  [1, "Raztopina s pH < 7 je?|kisla|bazična|nevtralna|čista voda", "A solution with pH below 7 is?|acidic|basic|neutral|pure water"],
  [1, "Raztopina s pH > 7 je?|bazična|kisla|nevtralna|čista voda", "A solution with pH above 7 is?|basic|acidic|neutral|pure water"],
  [1, "Kis je?|kisel|bazičen|nevtralen|kovina", "Vinegar is?|acidic|basic|neutral|a metal"],
  [1, "Milnica je?|bazična|kisla|nevtralna|kovina", "Soapy water is?|basic|acidic|neutral|a metal"],
  [1, "Destilirana voda ima pH?|7|1|14|0", "Distilled water has a pH of?|7|1|14|0"],
  [1, "Limonin sok ima pH približno?|2|7|12|14", "Lemon juice has a pH of about?|2|7|12|14"],
  [1, "Kisel okus ima?|limona|milo|sladkor|voda", "Which tastes sour?|lemon|soap|sugar|water"],
  [1, "Indikator nam pokaže, ali je raztopina?|kisla ali bazična|topla ali hladna|težka ali lahka|slana ali sladka", "An indicator shows if a solution is?|acidic or basic|hot or cold|heavy or light|salty or sweet"],
  [1, "Modri lakmusov papir v kislini?|pordeči|ostane moder|pozeleni|počrni", "Blue litmus paper in acid turns?|red|stays blue|green|black"],
  [1, "Rdeči lakmusov papir v bazi?|pomodri|ostane rdeč|porumeni|počrni", "Red litmus paper in a base turns?|blue|stays red|yellow|black"],
  [2, "Kislina + baza → ?|sol in voda|kisik|samo plin|kovina", "Acid + base → ?|salt and water|oxygen|only a gas|a metal"],
  [2, "Želodčni sok je?|kisel|bazičen|nevtralen|sladek", "Stomach juice is?|acidic|basic|neutral|sweet"],
  [2, "Mravlja ob ugrizu vbrizga?|kislino|bazo|sol|sladkor", "An ant bite injects an?|acid|base|salt|sugar"],
  [2, "Sok rdečega zelja v kisu?|pordeči|pozeleni|porumeni|ostane vijoličen", "Red cabbage juice in vinegar turns?|red|green|yellow|stays purple"],
  [2, "Sok rdečega zelja v milnici?|pozeleni|pordeči|ostane vijoličen|počrni", "Red cabbage juice in soapy water turns?|green|red|stays purple|black"],
  [2, "Pri delu s kislinami nosimo?|zaščitna očala|sončna očala|kapo|copate", "Working with acids we wear?|safety goggles|sunglasses|a cap|slippers"],
  [3, "Kaj ima najnižji pH?|limonin sok|milnica|destilirana voda|apnica", "Which has the lowest pH?|lemon juice|soapy water|distilled water|limewater"],
  [3, "Kisel dež povzročajo predvsem?|žveplovi oksidi|kisik|vodna para|argon", "Acid rain is mainly caused by?|sulfur oxides|oxygen|water vapour|argon"],
  [3, "Apnica je?|bazična|kisla|nevtralna|kovina", "Limewater is?|basic|acidic|neutral|a metal"],
  [3, "S čim nevtraliziramo kislo zemljo?|z apnom|s kisom|z limono|s sladkorjem","Acidic soil is neutralised with?|lime|vinegar|lemon|sugar"],
]);
def("n_ph", "nr_snov", 7, "Kisle in bazične raztopine", "Acids, bases and pH", (t, ctx) => {
  if (Math.random() < 0.35) {
    const vals = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]).slice(0, 4).sort((a, b) => a - b);
    const k = R(0, t === 1 ? 1 : 2);
    if (k === 2 && !vals.includes(7)) vals[R(0, 3)] = 7;
    const v = [...new Set(vals)];
    // »najbolj kisla« mora biti res kisla (pH < 7), »najbolj bazična« res bazična (pH > 7)
    if (v.length < 4 || (k === 0 && Math.min(...v) >= 7) || (k === 1 && Math.max(...v) <= 7)) return PH(t, ctx);
    const ans = k === 0 ? Math.min(...v) : k === 1 ? Math.max(...v) : 7;
    const q = [L(ctx, "Najbolj kisla raztopina?", "Most acidic solution?"), L(ctx, "Najbolj bazična raztopina?", "Most basic solution?"), L(ctx, "Nevtralna raztopina?", "Neutral solution?")][k];
    return out(q, `pH = ${ans}`, v.filter((x) => x !== ans).map((x) => `pH = ${x}`));
  }
  return PH(t, ctx);
});

// =====================================================================
// ŽIVA BITJA IN EKOSISTEMI
// =====================================================================
defBank("n_plant", "nr_ziv", 6, "Rastline", "Plants", [
  [1, "Vodo iz tal vsrkava?|korenina|list|cvet|plod", "Water from the soil is taken in by the?|root|leaf|flower|fruit"],
  [1, "Fotosinteza poteka predvsem v?|listih|koreninah|cvetovih|semenih", "Photosynthesis happens mainly in the?|leaves|roots|flowers|seeds"],
  [1, "Vodo do listov prevaja?|steblo|cvet|seme|plod", "Water is carried up to the leaves by the?|stem|flower|seed|fruit"],
  [1, "Cvet je organ za?|razmnoževanje|dihanje|vsrkavanje vode|oporo", "The flower is the organ for?|reproduction|breathing|taking in water|support"],
  [1, "Iz oplojenega cveta nastane?|plod s semeni|korenina|list|steblo", "A fertilised flower becomes a?|fruit with seeds|root|leaf|stem"],
  [1, "Za fotosintezo rastlina potrebuje?|svetlobo|temo|sol|pesek", "For photosynthesis a plant needs?|light|darkness|salt|sand"],
  [1, "Pri fotosintezi nastaja?|kisik|dušik|ogljikov dioksid|dim", "Photosynthesis releases?|oxygen|nitrogen|carbon dioxide|smoke"],
  [1, "Pri fotosintezi rastlina iz zraka jemlje?|ogljikov dioksid|kisik|dušik|helij", "In photosynthesis a plant takes from the air?|carbon dioxide|oxygen|nitrogen|helium"],
  [1, "Zeleno barvo listom daje?|klorofil|škrob|voda|kisik", "Leaves are green because of?|chlorophyll|starch|water|oxygen"],
  [1, "Prenos peloda na brazdo pestiča?|opraševanje|oploditev|kalitev|fotosinteza", "Moving pollen to the stigma is?|pollination|fertilisation|germination|photosynthesis"],
  [1, "Čebele pri opraševanju prenašajo?|pelod|semena|liste|korenine", "When pollinating, bees carry?|pollen|seeds|leaves|roots"],
  [1, "Seme vzkali, ko ima?|vodo in toploto|samo temo|samo sol|mraz", "A seed germinates when it has?|water and warmth|only darkness|only salt|frost"],
  [1, "Korenina rastlino tudi?|pritrdi v tla|opraši|osvetli|ogreje", "Roots also?|anchor the plant|pollinate it|light it|warm it"],
  [2, "Listne reže so večinoma na?|spodnji strani lista|zgornji strani lista|koreninah|cvetovih", "Stomata are mostly on the?|underside of leaves|top of leaves|roots|flowers"],
  [2, "Izhlapevanje vode skozi liste?|transpiracija|fotosinteza|kalitev|opraševanje", "Water evaporating from leaves?|transpiration|photosynthesis|germination|pollination"],
  [2, "Ženski del cveta?|pestič|prašnik|venčni list|čašni list", "Female part of a flower?|pistil|stamen|petal|sepal"],
  [2, "Moški del cveta?|prašnik|pestič|plodnica|brazda", "Male part of a flower?|stamen|pistil|ovary|stigma"],
  [2, "Pelod nastaja v?|prašnikih|pestiču|plodnici|koreninah", "Pollen is made in the?|anthers|pistil|ovary|roots"],
  [2, "Iz plodnice nastane?|plod|cvet|list|korenina", "The ovary develops into the?|fruit|flower|leaf|root"],
  [2, "Kako se krompir nespolno razmnožuje?|z gomolji|s semeni|s trosi|s cvetovi", "Potatoes reproduce asexually by?|tubers|seeds|spores|flowers"],
  [2, "Kako se razmnožujejo praproti?|s trosi|s semeni|s plodovi|z gomolji", "Ferns reproduce by?|spores|seeds|fruits|tubers"],
  [2, "Sladkor, ki nastane pri fotosintezi?|glukoza|beljakovina|maščoba|sol", "Sugar made in photosynthesis?|glucose|protein|fat|salt"],
  [3, "Semenke delimo na golosemenke in?|kritosemenke|praproti|mahove|alge", "Seed plants are gymnosperms and?|angiosperms|ferns|mosses|algae"],
  [3, "Smreka je?|golosemenka|kritosemenka|praprot|mah", "A spruce is a?|gymnosperm|flowering plant|fern|moss"],
  [3, "Jablana je?|kritosemenka|golosemenka|praprot|mah", "An apple tree is a?|flowering plant|gymnosperm|fern|moss"],
  [3, "Rastline celično dihajo?|podnevi in ponoči|samo podnevi|samo ponoči|nikoli", "Plants respire?|day and night|only by day|only at night|never"],
  [3, "S čim dokažemo škrob v listu?|z jodovico|z vodo|s kisom|s soljo","Starch in a leaf is shown with?|iodine solution|water|vinegar|salt"],
  [3, "Fotosinteza poleg svetlobe in CO₂ potrebuje?|vodo|kisik|dušik|sol", "Besides light and CO₂, photosynthesis needs?|water|oxygen|nitrogen|salt"],
  [3, "Rastline so v prehranjevalni verigi?|proizvajalci|porabniki|razkrojevalci|plenilci", "In a food chain, plants are?|producers|consumers|decomposers|predators"],
]);

defBank("n_animals", "nr_ziv", 7, "Razvrščanje živali", "Classifying animals", [
  [1, "Vretenčar je?|žaba|polž|pajek|deževnik", "Which is a vertebrate?|frog|snail|spider|earthworm"],
  [1, "Nevretenčar je?|polž|riba|ptica|kača", "Which is an invertebrate?|snail|fish|bird|snake"],
  [1, "Sesalec je?|kit|morski pes|pingvin|krokodil", "Which is a mammal?|whale|shark|penguin|crocodile"],
  [1, "Ptica je?|pingvin|netopir|metulj|leteča riba", "Which is a bird?|penguin|bat|butterfly|flying fish"],
  [1, "Plazilec je?|kuščar|žaba|močerad|krt", "Which is a reptile?|lizard|frog|salamander|mole"],
  [1, "Dvoživka je?|žaba|kuščar|želva|kača", "Which is an amphibian?|frog|lizard|tortoise|snake"],
  [1, "Riba je?|morski pes|kit|delfin|tjulenj", "Which is a fish?|shark|whale|dolphin|seal"],
  [1, "Žuželka je?|mravlja|pajek|polž|stonoga", "Which is an insect?|ant|spider|snail|centipede"],
  [1, "Koliko nog ima žuželka?|6|8|4|10", "How many legs does an insect have?|6|8|4|10"],
  [1, "Koliko nog ima pajek?|8|6|4|10", "How many legs does a spider have?|8|6|4|10"],
  [1, "Mladiče z mlekom hranijo?|sesalci|ptiči|plazilci|ribe", "Which feed their young on milk?|mammals|birds|reptiles|fish"],
  [1, "Perje imajo?|ptiči|sesalci|plazilci|dvoživke", "Which have feathers?|birds|mammals|reptiles|amphibians"],
  [1, "S škrgami diha?|riba|kit|delfin|želva", "Which breathes with gills?|fish|whale|dolphin|turtle"],
  [2, "Kit diha s?|pljuči|škrgami|kožo|trahejami", "A whale breathes with?|lungs|gills|its skin|tracheae"],
  [2, "Paglavec diha s?|škrgami|pljuči|trahejami|perjem", "A tadpole breathes with?|gills|lungs|tracheae|feathers"],
  [2, "Žuželke dihajo s?|trahejami|škrgami|pljuči|perjem", "Insects breathe through?|tracheae|gills|lungs|feathers"],
  [2, "Razvoj s popolno preobrazbo ima?|metulj|kobilica|stenica|kačji pastir", "Which has complete metamorphosis?|butterfly|grasshopper|shield bug|dragonfly"],
  [2, "Stalno telesno temperaturo imajo?|ptiči in sesalci|ribe in dvoživke|plazilci|žuželke", "Which keep a constant body temperature?|birds and mammals|fish and amphibians|reptiles|insects"],
  [2, "Netopir je?|sesalec|ptica|žuželka|plazilec", "A bat is a?|mammal|bird|insect|reptile"],
  [2, "Delfin je?|sesalec|riba|dvoživka|plazilec", "A dolphin is a?|mammal|fish|amphibian|reptile"],
  [2, "Želva je?|plazilec|dvoživka|sesalec|riba", "A tortoise is a?|reptile|amphibian|mammal|fish"],
  [2, "Močerad je?|dvoživka|plazilec|riba|žuželka", "A salamander is an?|amphibian|reptile|fish|insect"],
  [2, "Zunanje ogrodje imajo?|členonožci|sesalci|ribe|ptiči", "Which have an exoskeleton?|arthropods|mammals|fish|birds"],
  [3, "Deževnik je?|kolobarnik|žuželka|plazilec|mehkužec", "An earthworm is an?|annelid|insect|reptile|mollusc"],
  [3, "Polž je?|mehkužec|členonožec|kolobarnik|vretenčar", "A snail is a?|mollusc|arthropod|annelid|vertebrate"],
  [3, "Rak je?|členonožec|mehkužec|riba|kolobarnik", "A crab is an?|arthropod|mollusc|fish|annelid"],
  [3, "Hobotnica je?|mehkužec|riba|členonožec|ožigalkar", "An octopus is a?|mollusc|fish|arthropod|cnidarian"],
  [3, "Klop je?|pajkovec|žuželka|rak|kolobarnik", "A tick is an?|arachnid|insect|crustacean|annelid"],
  [3, "Meduza je?|ožigalkar|riba|mehkužec|členonožec", "A jellyfish is a?|cnidarian|fish|mollusc|arthropod"],
  [3, "Kdo rodi žive mladiče?|srna|kokoš|krokodil|žaba", "Which gives birth to live young?|deer|hen|crocodile|frog"],
]);

defBank("n_body", "nr_ziv", 7, "Zgradba in delovanje živali", "How animals work", [
  [1, "Kri po telesu poganja?|srce|pljuča|želodec|jetra", "Blood is pumped by the?|heart|lungs|stomach|liver"],
  [1, "Kisik pride v kri v?|pljučih|želodcu|srcu|ledvicah", "Oxygen enters the blood in the?|lungs|stomach|heart|kidneys"],
  [1, "Telo podpira?|okostje|koža|kri|želodec", "The body is supported by the?|skeleton|skin|blood|stomach"],
  [1, "Ko se gibljemo, se krčijo?|mišice|kosti|živci|lasje", "When we move, what contracts?|muscles|bones|nerves|hair"],
  [1, "Organ za vid?|oko|uho|nos|jezik", "Organ of sight?|eye|ear|nose|tongue"],
  [1, "Organ za sluh?|uho|oko|koža|jezik", "Organ of hearing?|ear|eye|skin|tongue"],
  [1, "Okus zaznamo z?|jezikom|ušesi|očmi|lasmi", "We taste with the?|tongue|ears|eyes|hair"],
  [1, "Izdihan zrak ima več?|CO₂|kisika|dušika|helija", "Exhaled air has more?|CO₂|oxygen|nitrogen|helium"],
  [1, "Možgani so del?|živčevja|prebavil|okostja|dihal", "The brain is part of the?|nervous system|digestive system|skeleton|respiratory system"],
  [1, "Želodec je del?|prebavil|dihal|živčevja|okostja", "The stomach is part of the?|digestive system|respiratory system|nervous system|skeleton"],
  [1, "Rastlinojedec je?|krava|volk|lev|orel", "Which is a herbivore?|cow|wolf|lion|eagle"],
  [1, "Mesojedec je?|volk|zajec|krava|srna", "Which is a carnivore?|wolf|rabbit|cow|deer"],
  [1, "Vsejed je?|medved|krava|lev|zajec", "Which is an omnivore?|bear|cow|lion|rabbit"],
  [2, "Kisik po krvi prenašajo?|rdeče krvničke|bele krvničke|krvne ploščice|živci", "Oxygen in blood is carried by?|red blood cells|white blood cells|platelets|nerves"],
  [2, "Pred bolezni nas branijo?|bele krvničke|rdeče krvničke|kosti|mišice", "We are defended from germs by?|white blood cells|red blood cells|bones|muscles"],
  [2, "Hranila preidejo v kri v?|tankem črevesu|požiralniku|ustih|debelem črevesu", "Nutrients pass into blood in the?|small intestine|oesophagus|mouth|large intestine"],
  [2, "Seč izdelujejo?|ledvice|jetra|pljuča|srce", "Urine is made by the?|kidneys|liver|lungs|heart"],
  [2, "Žolč izdelujejo?|jetra|ledvice|pljuča|srce", "Bile is made by the?|liver|kidneys|lungs|heart"],
  [2, "Kaj povezuje mišice s kostmi?|kite|živci|žile|lasje","Muscles are joined to bones by?|tendons|nerves|blood vessels|hair"],
  [2, "Ostre podočnike za trganje mesa ima?|mačka|krava|ovca|zajec", "Sharp canines for tearing meat?|cat|cow|sheep|rabbit"],
  [3, "Celice → tkiva → organi → ?|organski sistemi|molekule|atomi|celice", "Cells → tissues → organs → ?|organ systems|molecules|atoms|cells"],
  [3, "Koliko votlin ima srce sesalcev?|4|2|3|1", "A mammal's heart has how many chambers?|4|2|3|1"],
  [3, "Koliko votlin ima srce rib?|2|4|3|1","A fish heart has how many chambers?|2|4|3|1"],
  [3, "Žile, ki vodijo kri od srca?|arterije|vene|kite|živci", "Vessels carrying blood away from the heart?|arteries|veins|tendons|nerves"],
  [3, "Žile, ki vodijo kri k srcu?|vene|arterije|kite|živci", "Vessels carrying blood to the heart?|veins|arteries|tendons|nerves"],
  [3, "Snovi med krvjo in celicami se izmenjujejo v?|kapilarah|arterijah|srcu|kitah", "Blood and cells exchange substances in the?|capillaries|arteries|heart|tendons"],
  [3, "Prebava škroba se začne v?|ustih|želodcu|debelem črevesu|jetrih", "Starch digestion begins in the?|mouth|stomach|large intestine|liver"],
]);

// Prehranjevalne verige [sl, en]; vsak člen poje prejšnjega.
const CHAINS = [
  [["trava", "zajec", "lisica"], ["grass", "rabbit", "fox"]],
  [["trava", "kobilica", "žaba", "kača"], ["grass", "grasshopper", "frog", "snake"]],
  [["alge", "vodna bolha", "riba", "čaplja"], ["algae", "water flea", "fish", "heron"]],
  [["listi", "gosenica", "sinica", "kragulj"], ["leaves", "caterpillar", "tit", "hawk"]],
  [["žito", "miš", "sova"], ["grain", "mouse", "owl"]],
  [["trava", "srna", "volk"], ["grass", "deer", "wolf"]],
  [["listi", "listna uš", "pikapolonica", "vrabec"], ["leaves", "aphid", "ladybird", "sparrow"]],
  [["solata", "polž", "jež"], ["lettuce", "snail", "hedgehog"]],
  [["želod", "veverica", "kuna"], ["acorns", "squirrel", "marten"]],
  [["alge", "kril", "kit"], ["algae", "krill", "whale"]],
];
const ECO = bank([
  [3, "Energija od člena do člena verige?|se zmanjšuje|se povečuje|ostane enaka|se podvoji", "Energy from link to link in a chain?|decreases|increases|stays the same|doubles"],
  [3, "Razkrojevalci so?|glive in bakterije|rastline|plenilci|sesalci", "Decomposers are?|fungi and bacteria|plants|predators|mammals"],
  [3, "Razkrojevalec je?|gliva|lisica|trava|sova", "Which is a decomposer?|fungus|fox|grass|owl"],
  [3, "Puščica v verigi kaže smer?|pretoka energije|velikosti živali|starosti|hitrosti", "Arrows in a food chain show the flow of?|energy|size|age|speed"],
  [3, "Neživi dejavnik v ekosistemu?|svetloba|zajec|trava|gliva", "A non-living factor in an ecosystem?|light|rabbit|grass|fungus"],
  [3, "Živi dejavnik v ekosistemu?|gliva|temperatura|voda|kamenje", "A living factor in an ecosystem?|fungus|temperature|water|rocks"],
  [3, "Vir energije za skoraj vse ekosisteme?|Sonce|Luna|veter|tla", "Energy source for almost all ecosystems?|the Sun|the Moon|wind|soil"],
  [3, "Več prepletenih verig tvori?|prehranjevalni splet|celico|tkivo|populacijo", "Many linked food chains form a?|food web|cell|tissue|population"],
  [3, "Osebki iste vrste na istem mestu?|populacija|združba|ekosistem|organ", "Members of one species in one place?|population|community|ecosystem|organ"],
  [3, "Vse populacije na enem območju?|združba|populacija|celica|vrsta", "All populations in one area?|community|population|cell|species"],
  [3, "Če izginejo plenilci, se rastlinojedci?|namnožijo|zmanjšajo|ne spremenijo|postanejo plenilci", "If predators vanish, herbivores?|multiply|decrease|stay the same|become predators"],
]);
def("n_chain", "nr_ziv", 7, "Prehranjevalne verige in ekosistem", "Food chains and ecosystems", (t, ctx) => {
  if (t === 3 && Math.random() < 0.5) return ECO(3, ctx);
  const [sl, en] = pick(CHAINS), ch = ctx.lang === "sl" ? sl : en, s = ch.join(" → "), last = ch.length - 1;
  const k = t === 1 ? R(0, 1) : R(0, 3);
  const others = (i) => ch.filter((_, j) => j !== i);
  if (k === 0) return out(`${s}: ${L(ctx, "proizvajalec?", "producer?")}`, ch[0], [...others(0), L(ctx, "Sonce", "the Sun")]);
  if (k === 1) return out(`${s}: ${L(ctx, "vrhnji plenilec?", "top predator?")}`, ch[last], [...others(last), L(ctx, "Sonce", "the Sun")]);
  if (k === 2) return out(`${s}: ${L(ctx, "rastlinojedec?", "herbivore?")}`, ch[1], [...others(1), L(ctx, "gliva", "a fungus")]);
  // branje verige: kdo je naslednji člen (kdo poje izbranega)
  const i = R(0, last - 1);
  return out(`${s}: ${ch[i]} → ?`, ch[i + 1], [...others(i + 1), L(ctx, "Sonce", "the Sun")]);
});

// =====================================================================
// ENERGIJA, ZEMLJA IN OKOLJE
// =====================================================================
defBank("n_energy", "nr_ene", 6, "Energija, svetloba in zvok", "Energy, light and sound", [
  [1, "Obnovljiv vir energije?|sonce|premog|nafta|zemeljski plin", "A renewable energy source?|sunlight|coal|oil|natural gas"],
  [1, "Neobnovljiv vir energije?|premog|veter|sonce|tekoča voda", "A non-renewable energy source?|coal|wind|sunlight|running water"],
  [1, "Sončna celica svetlobo pretvarja v?|električno energijo|zvok|kemično energijo|jedrsko energijo", "A solar cell turns light into?|electrical energy|sound|chemical energy|nuclear energy"],
  [1, "Energija v hrani je?|kemijska|jedrska|zvočna|magnetna", "Energy stored in food is?|chemical|nuclear|sound|magnetic"],
  [1, "Vetrnica izkorišča energijo?|vetra|sonca|premoga|nafte", "A wind turbine uses energy from?|wind|sunlight|coal|oil"],
  [1, "Energija gibajočega se telesa?|kinetična|potencialna|kemična|jedrska", "Energy of a moving body?|kinetic|potential|chemical|nuclear"],
  [1, "Zvok nastane, ko telo?|niha|miruje|sveti|se tali", "Sound is made when something?|vibrates|rests|glows|melts"],
  [1, "Zvok se ne širi skozi?|vakuum|zrak|vodo|les", "Sound cannot travel through?|a vacuum|air|water|wood"],
  [1, "Kaj je hitrejše?|svetloba|zvok|oboje enako|odvisno od vetra", "Which is faster?|light|sound|both equal|depends on wind"],
  [1, "Odbit zvok, ki ga slišimo?|odmev|senca|mavrica|blisk", "Reflected sound that we hear?|an echo|a shadow|a rainbow|lightning"],
  [1, "Svetloba gre skozi?|steklo|les|kamen|kovino", "Light passes through?|glass|wood|stone|metal"],
  [1, "Senca nastane, ker se svetloba širi?|premočrtno|v krogih|cik-cak|le ponoči", "Shadows form because light travels?|in straight lines|in circles|zigzag|only at night"],
  [2, "Enota za energijo?|J|W|N|kg", "Unit of energy?|J|W|N|kg"],
  [2, "Glasnost merimo v?|dB|Hz|W|m", "Loudness is measured in?|dB|Hz|W|m"],
  [2, "Višino tona določa?|frekvenca|glasnost|barva|masa", "The pitch of a note depends on?|frequency|loudness|colour|mass"],
  [2, "Zvok se hitreje širi v?|vodi|zraku|vakuumu|nikjer", "Sound travels faster in?|water|air|a vacuum|nowhere"],
  [2, "Hidroelektrarna izkorišča energijo?|vode|vetra|sonca|premoga", "A hydroelectric plant uses energy of?|water|wind|sunlight|coal"],
  [2, "Primer biomase?|drva|nafta|uran|zemeljski plin", "An example of biomass?|firewood|crude oil|uranium|natural gas"],
  [2, "Fosilno gorivo?|premog|les|veter|sonce", "A fossil fuel?|coal|wood|wind|sunlight"],
  [2, "Napeta frača ima energijo?|prožnostno|kemično|jedrsko|zvočno", "A stretched catapult stores energy that is?|elastic|chemical|nuclear|sound"],
  [3, "Energije ne moremo ustvariti, lahko jo le?|pretvarjamo|uničimo|izbrišemo|podvojimo", "Energy can't be created, only?|converted|destroyed|deleted|doubled"],
  [3, "Svetloba s Sonca do Zemlje potuje približno?|8 minut|8 sekund|8 ur|8 dni", "Sunlight reaches Earth in about?|8 minutes|8 seconds|8 hours|8 days"],
  [3, "Zvok v zraku potuje s hitrostjo približno?|340 m/s|3 m/s|300000 km/s|34000 m/s", "Sound in air travels at about?|340 m/s|3 m/s|300000 km/s|34000 m/s"],
  [3, "Človek sliši frekvence do približno?|20000 Hz|200 Hz|20 Hz|2000000 Hz", "Humans hear frequencies up to about?|20000 Hz|200 Hz|20 Hz|2000000 Hz"],
  [3, "Ultrazvok za orientacijo uporablja?|netopir|krava|polž|kokoš", "Which uses ultrasound to find its way?|bat|cow|snail|hen"],
  [3, "Blisk vidimo prej kot slišimo grom, ker je?|svetloba hitrejša|zvok hitrejši|grom tišji|oko bližje", "We see lightning before thunder because?|light is faster|sound is faster|thunder is quiet|eyes are closer"],
]);

const HEAT = bank([
  [1, "Toplotni prevodnik?|kovinska žlica|lesena kuhalnica|volnena nogavica|stiropor", "A good heat conductor?|a metal spoon|a wooden spoon|a wool sock|polystyrene"],
  [1, "Toplotni izolator?|volna|baker|aluminij|železo", "A heat insulator?|wool|copper|aluminium|iron"],
  [1, "Topel zrak se?|dviga|spušča|ne giblje|utekočini", "Warm air?|rises|sinks|stays still|turns liquid"],
  [1, "S čim merimo temperaturo?|s termometrom|s tehtnico|z metrom|s štoparico", "Temperature is measured with a?|thermometer|balance|ruler|stopwatch"],
  [1, "Toplota sama prehaja na?|hladnejše telo|toplejše telo|večje telo|težje telo", "Heat flows by itself to the?|colder body|warmer body|bigger body|heavier body"],
  [2, "Prenos toplote po kovinski palici?|prevajanje|sevanje|konvekcija|izhlapevanje", "Heat moving along a metal rod?|conduction|radiation|convection|evaporation"],
  [2, "Kako pride toplota s Sonca na Zemljo?|s sevanjem|s prevajanjem|s konvekcijo|z vetrom","Heat reaches us from the Sun by?|radiation|conduction|convection|wind"],
  [2, "Kroženje vode v loncu med segrevanjem?|konvekcija|sevanje|prevajanje|sublimacija", "Water circulating in a heated pot?|convection|radiation|conduction|sublimation"],
  [2, "Svetla oblačila sončno sevanje?|bolj odbijajo|bolj vpijajo|ustvarjajo|ojačijo", "Light-coloured clothes, sunlight?|reflect more|absorb more|create it|amplify it"],
  [3, "Termovka ohranja toploto, ker ima?|vakuum med stenama|tanke stene|kovinski pokrov|črno barvo", "A vacuum flask keeps heat because of?|vacuum between walls|thin walls|a metal lid|black paint"],
  [3, "Ptiči pozimi našopirijo perje, da ujamejo?|zrak|vodo|svetlobo|hrano", "Birds fluff up feathers in winter to trap?|air|water|light|food"],
  [3, "Ponev ima ročaj iz plastike, ker je plastika?|toplotni izolator|toplotni prevodnik|kovina|težka", "Pan handles are plastic because plastic is?|a heat insulator|a heat conductor|a metal|heavy"],
]);
def("n_heat", "nr_ene", 6, "Toplota in temperatura", "Heat and temperature", (t, ctx) => {
  const n = ctx.num;
  if (Math.random() < 0.5) return HEAT(t, ctx);
  if (t === 1) {
    const a = R(5, 25), d = R(2, 12);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Bilo je ${a} °C, ogrelo se je za ${d} °C. Zdaj?`, `It was ${a} °C and warmed by ${d} °C. Now?`), a + d, "°C", [a - d, a * d, d]);
    return nq(ctx, L(ctx, `Bilo je ${a + d} °C, ohladilo se je za ${d} °C. Zdaj?`, `It was ${a + d} °C and cooled by ${d} °C. Now?`), a, "°C", [a + 2 * d, d, a + d]);
  }
  if (t === 2) {
    const lo = -R(1, 9), hi = R(2, 15);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Zjutraj ${n(lo)} °C, opoldne ${hi} °C. Razlika?`, `Morning ${n(lo)} °C, noon ${hi} °C. Difference?`), hi - lo, "°C", [hi + lo, -lo, hi], { neg: true });
    const d = R(3, 12), start = R(1, 8);
    return nq(ctx, L(ctx, `Bilo je ${start} °C, ohladilo se je za ${d} °C. Zdaj?`, `It was ${start} °C and cooled by ${d} °C. Now?`), start - d, "°C", [d - start, start + d, -d, -start], { neg: true });
  }
  if (Math.random() < 0.5) {
    const a = R(1, 5) * 10, b = a + R(1, (90 - a) / 10) * 10;
    return nq(ctx, L(ctx, `Enaki količini vode: ${a} °C in ${b} °C. Temperatura zmesi?`, `Equal amounts of water: ${a} °C and ${b} °C. Mix temp.?`), (a + b) / 2, "°C", [a + b, b - a, b, a]);
  }
  const [m1, m2] = pick([[1, 3], [3, 1], [1, 4], [4, 1]]), a = pick([10, 20, 30]), b = a + pick([20, 40, 60]);
  const mix = (m1 * a + m2 * b) / (m1 + m2);
  if (!Number.isInteger(mix * 10)) return nq(ctx, L(ctx, "1 kg vode (20 °C) + 3 kg vode (60 °C). Temperatura zmesi?", "1 kg water (20 °C) + 3 kg water (60 °C). Mix temp.?"), 50, "°C", [40, 80, 30]);
  return nq(ctx, L(ctx, `${m1} kg vode (${a} °C) + ${m2} kg vode (${b} °C). Temperatura zmesi?`, `${m1} kg water (${a} °C) + ${m2} kg water (${b} °C). Mix temp.?`), mix, "°C", [(a + b) / 2, a + b, (m2 * a + m1 * b) / (m1 + m2)]);
});

defBank("n_weather", "nr_ene", 6, "Zemlja, vreme in kroženje vode", "Earth, weather and the water cycle", [
  [1, "Merilnik temperature zraka?|termometer|barometer|vetrokaz|dežemer", "Air temperature is measured with a?|thermometer|barometer|wind vane|rain gauge"],
  [1, "Merilnik zračnega tlaka?|barometer|termometer|dežemer|vetrokaz", "Air pressure is measured with a?|barometer|thermometer|rain gauge|wind vane"],
  [1, "Smer vetra kaže?|vetrokaz|barometer|termometer|dežemer", "Wind direction is shown by a?|wind vane|barometer|thermometer|rain gauge"],
  [1, "Merilnik količine padavin?|dežemer|barometer|termometer|vetrokaz", "Rainfall is measured with a?|rain gauge|barometer|thermometer|wind vane"],
  [1, "Oblaki so iz?|vodnih kapljic|dima|vodne pare|kisika", "Clouds are made of?|water droplets|smoke|water vapour|oxygen"],
  [1, "Zemlja obkroži Sonce v?|enem letu|enem dnevu|enem mesecu|eni uri", "Earth orbits the Sun in?|one year|one day|one month|one hour"],
  [1, "Dan in noč nastaneta zaradi?|vrtenja Zemlje|kroženja Lune|oblakov|letnih časov", "Day and night are caused by?|Earth spinning|the Moon orbiting|clouds|the seasons"],
  [1, "Kroženje vode na Zemlji poganja?|Sonce|Luna|veter|vulkani", "The water cycle is driven by the?|Sun|Moon|wind|volcanoes"],
  [1, "Padavine so?|dež in sneg|veter|oblaki|mavrica", "Precipitation is?|rain and snow|wind|clouds|a rainbow"],
  [1, "Zemlji najbližja zvezda?|Sonce|Luna|Mars|Venera", "The star nearest to Earth?|the Sun|the Moon|Mars|Venus"],
  [1, "Luna je Zemljin?|naravni satelit|planet|zvezda|komet", "The Moon is Earth's?|natural satellite|planet|star|comet"],
  [1, "Voda iz morij in rek izhlapeva zaradi?|sončne toplote|Lunine svetlobe|soli|rib", "Water evaporates from seas because of?|the Sun's heat|moonlight|salt|fish"],
  [2, "Vodna para v višjih plasteh ozračja?|kondenzira|zgori|se stali|postane kisik", "Water vapour high in the air?|condenses|burns|melts|turns into oxygen"],
  [2, "Voda, ki ponikne v tla, postane?|podtalnica|oblak|para|led", "Water that soaks into the ground becomes?|groundwater|cloud|vapour|ice"],
  [2, "Veter nastane zaradi razlik v?|zračnem tlaku|barvi neba|uri dneva|velikosti oblakov", "Wind is caused by differences in?|air pressure|sky colour|time of day|cloud size"],
  [2, "Ozonska plast nas varuje pred?|UV-sevanjem|dežjem|vetrom|potresi", "The ozone layer protects us from?|UV radiation|rain|wind|earthquakes"],
  [2, "Zrak je večinoma iz?|dušika|kisika|ogljikovega dioksida|vodika", "Air is mostly?|nitrogen|oxygen|carbon dioxide|hydrogen"],
  [2, "Kisika je v zraku približno?|21 %|78 %|1 %|50 %", "Air contains about how much oxygen?|21 %|78 %|1 %|50 %"],
  [2, "Zemlja je od Sonca?|tretji planet|prvi planet|drugi planet|peti planet", "Counting from the Sun, Earth is the?|third planet|first planet|second planet|fifth planet"],
  [2, "Letni časi nastanejo zaradi?|nagiba Zemljine osi|razdalje do Sonca|Lune|oblakov", "Seasons are caused by?|Earth's tilted axis|distance to the Sun|the Moon|clouds"],
  [3, "Topel vlažen zrak se dviga in ohlaja. Nastanejo?|oblaki|potresi|mrki|vulkani", "Warm moist air rises and cools. This forms?|clouds|earthquakes|eclipses|volcanoes"],
  [3, "Plimovanje povzroča predvsem?|Luna|veter|potresi|oblaki", "Tides are mainly caused by the?|Moon|wind|earthquakes|clouds"],
  [3, "Ko je pri nas poletje, je v Avstraliji?|zima|poletje|pomlad|jesen", "When it's summer in Europe, in Australia it's?|winter|summer|spring|autumn"],
  [3, "Najdaljši dan v letu je pri nas okoli?|21. junija|21. decembra|21. marca|1. januarja", "Our longest day (north) is around?|21 June|21 December|21 March|1 January"],
  [3, "Toplogredni učinek povečuje?|ogljikov dioksid|kisik|dušik|argon", "The greenhouse effect is increased by?|carbon dioxide|oxygen|nitrogen|argon"],
  [3, "Zakaj je na gorah hladneje? Z višino?|zrak se redči|Sonce je dlje|ni oblakov|veter manjka", "Why is it colder up mountains? With height?|air gets thinner|Sun is farther|no clouds|no wind"],
]);

defBank("n_env", "nr_ene", 7, "Človek in okolje", "People and the environment", [
  [1, "Steklenico odvržemo v zabojnik za?|steklo|papir|biološke odpadke|embalažo", "A glass bottle goes in the bin for?|glass|paper|food waste|packaging"],
  [1, "Časopis odvržemo v zabojnik za?|papir|steklo|embalažo|biološke odpadke", "A newspaper goes in the bin for?|paper|glass|packaging|food waste"],
  [1, "Ostanki zelenjave gredo med?|biološke odpadke|steklo|papir|embalažo", "Vegetable peels go in the bin for?|food waste|glass|paper|packaging"],
  [1, "Plastenka gre v zabojnik za?|embalažo|papir|steklo|biološke odpadke", "A plastic bottle goes in the bin for?|packaging|paper|glass|food waste"],
  [1, "Izrabljene baterije oddamo?|v zbirni center|v smeti|v reko|v kompost", "Used batteries go to?|a collection point|the general bin|a river|the compost"],
  [1, "Okolju najbolj prijazen prevoz?|kolo|avto|letalo|tovornjak", "Most eco-friendly transport?|bicycle|car|plane|lorry"],
  [1, "Zrak onesnažujejo?|izpušni plini|drevesa|dež|travniki", "Air is polluted by?|exhaust fumes|trees|rain|meadows"],
  [1, "Ko zapustimo sobo, luč?|ugasnemo|pustimo prižgano|prižgemo še eno|pokrijemo", "Leaving a room, we turn the light?|off|on and leave it|on twice|upside down"],
  [1, "Drevesa pri fotosintezi iz zraka jemljejo?|ogljikov dioksid|kisik|dušik|argon", "In photosynthesis, trees take from the air?|carbon dioxide|oxygen|nitrogen|argon"],
  [1, "Vodo varčujemo, če se raje?|prhamo kot kopamo|kopamo kot prhamo|dolgo prhamo|kopamo v polni kadi", "We save water if we?|shower, not bathe|bathe, not shower|take long showers|fill the bath full"],
  [2, "Kompost nastane z delovanjem?|razkrojevalcev|plenilcev|rastlinojedcev|ptičev", "Compost is made by?|decomposers|predators|herbivores|birds"],
  [2, "Vrsta, ki ji grozi izumrtje, je?|ogrožena|invazivna|domorodna|udomačena", "A species at risk of dying out is?|endangered|invasive|native|domesticated"],
  [2, "Tujerodna vrsta, ki se hitro širi?|invazivna|ogrožena|izumrla|udomačena", "A non-native species that spreads fast?|invasive|endangered|extinct|domesticated"],
  [2, "Gnojila s polj v vodi povzročijo bujno rast?|alg|rib|rakov|školjk", "Fertiliser in water causes a boom of?|algae|fish|crabs|mussels"],
  [2, "Steklenico znova napolnimo in uporabimo. To je?|ponovna uporaba|sežiganje|odlaganje|onesnaževanje", "Refilling and using a bottle again is?|reuse|burning|landfill|pollution"],
  [2, "Kje nastaja smog predvsem?|v mestih|v gozdovih|na odprtem morju|v gorah", "Smog forms mainly in?|cities|forests|the open sea|mountains"],
  [3, "Ozonsko luknjo so povzročali?|freoni|kisik|dušik|vodna para", "The ozone hole was caused by?|CFCs|oxygen|nitrogen|water vapour"],
  [3, "Kisel dež škoduje predvsem?|gozdovom in jezerom|puščavam|ledenikom|vulkanom", "Acid rain harms mainly?|forests and lakes|deserts|glaciers|volcanoes"],
  [3, "Toplogredni plin iz izpušnih plinov?|ogljikov dioksid|kisik|dušik|argon", "Greenhouse gas from car exhaust?|carbon dioxide|oxygen|nitrogen|argon"],
  [3, "Mikroplastika v morju škoduje?|morskim živalim|samo ladjam|samo kamnom|nikomur", "Microplastics in the sea harm?|sea animals|only ships|only rocks|nobody"],
  [3, "Raznolikost vrst na Zemlji se imenuje?|biodiverziteta|populacija|fotosinteza|evolucija", "The variety of species on Earth is?|biodiversity|a population|photosynthesis|evolution"],
  [3, "Krčenje gozdov poveča v ozračju delež?|CO₂|kisika|ozona|dušika", "Deforestation increases which gas in air?|CO₂|oxygen|ozone|nitrogen"],
]);

export const AREAS = [
  ["nr_mer", { sl: "Raziskovanje in merjenje", en: "Investigating and measuring" }, "#64748b"],
  ["nr_snov", { sl: "Snovi", en: "Materials and substances" }, "#0ea5e9"],
  ["nr_ziv", { sl: "Živa bitja in ekosistemi", en: "Living things and ecosystems" }, "#22c55e"],
  ["nr_ene", { sl: "Energija, Zemlja in okolje", en: "Energy, Earth and environment" }, "#f59e0b"],
];
export const CONCEPTS = C;
