// Naloge pri naravoslovju (OŠ 6. in 7. razred): izbirna vprašanja iz naborov za razvrščanje
// (public/sim/nar-data.js), vsaka z razlago pri napačni izbiri.
// 1. stopnja: dve možnosti; 2. stopnja: vse skupine; 3. stopnja: obratno vprašanje
// (»Kaj od naštetega …?«) s štirimi primeri.
// Teme, ki se prekrivajo s fiziko in kemijo (»=>« v curriculum-data.js), vzamejo naloge od tam.
import { SETS as NAR } from "../../../public/sim/nar-data.js";
import { SETS as BIO } from "../../../public/sim/bio-data.js";

const SETS = { ...NAR, ...BIO };

const TOPIC_SETS = {
  "NAR-OS-6/naravoslovni-postopki": ["postopki"],
  "NAR-OS-6/mikroskop-in-celica": ["celica"],
  "NAR-OS-6/agregatna-stanja": ["agregatna"],
  "NAR-OS-6/zmesi-in-ciste-snovi": ["snovi-zmesi"],
  "NAR-OS-6/locevanje-zmesi": ["locevanje"],
  "NAR-OS-6/oblike-energije": ["energija"],
  "NAR-OS-6/toplota-in-temperatura": ["toplota"],
  "NAR-OS-6/zgradba-rastline": ["rastlina"],
  "NAR-OS-6/fotosinteza-in-celicno-dihanje": ["fotosinteza"],
  "NAR-OS-6/prevajanje-vode-in-snovi": ["voda-rastline"],
  "NAR-OS-6/razmnozevanje-rastlin": ["razmnozevanje-rastlin"],
  "NAR-OS-6/razvrscanje-rastlin": ["rastline"],
  "NAR-OS-6/raznolikost-organizmov": ["kraljestva"],
  "NAR-OS-6/rastline-in-okolje": ["prilagoditve-rastlin"],
  "NAR-OS-7/zgradba-snovi": ["zgradba-snovi"],
  "NAR-OS-7/elementi-in-spojine": ["elementi"],
  "NAR-OS-7/fizikalne-in-kemijske-spremembe": ["spremembe"],
  "NAR-OS-7/zgradba-in-delovanje-zivali": ["organski-sistemi"],
  "NAR-OS-7/prehranjevanje-in-prebava": ["prehrana"],
  "NAR-OS-7/dihanje-in-krvni-obtok": ["dihanje"],
  "NAR-OS-7/gibanje-in-opora": ["gibanje"],
  "NAR-OS-7/cutila-in-zivcevje": ["cutila"],
  "NAR-OS-7/razmnozevanje-in-razvoj": ["razvoj"],
  "NAR-OS-7/razvrscanje-zivali": ["zivali"],
  "NAR-OS-7/ekosistem": ["ekosistem"],
  "NAR-OS-7/prehranjevalne-verige-in-spleti": ["veriga"],
  "NAR-OS-7/krozenje-snovi-in-pretok-energije": ["krozenje"],
  "NAR-OS-7/kopenski-in-vodni-ekosistemi": ["ekosistemi"],
  "NAR-OS-7/clovek-in-okolje": ["clovek"],
};

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

// Izbirna naloga iz nabora za razvrščanje (tudi za biologijo, server/practice/generators/bio.js).
export function sortTask(set, level, r) {
  const def = SETS[set];
  const name = (k) => def.cats.find((c) => c[0] === k)[1];
  // 3. stopnja: kateri primer sodi v izbrano skupino (en pravilen, trije iz drugih skupin).
  if (level === 3) {
    const cats = def.cats.filter(([k]) => def.items.some((i) => i[1] === k) && def.items.filter((i) => i[1] !== k).length >= 3);
    const [k] = r.pick(cats);
    const right = r.pick(def.items.filter((i) => i[1] === k));
    const wrong = r.shuffle(def.items.filter((i) => i[1] !== k)).slice(0, 3);
    const options = r.shuffle([right, ...wrong]);
    return {
      text: `${def.q}\n\nPoišči primer, pri katerem je odgovor **${name(k)}**.`,
      answer: {
        type: "choice",
        options: options.map((o) => cap(o[0])),
        index: options.indexOf(right),
        why: options.map((o) => (o === right ? null : `»${cap(o[0])}« sodi v skupino ${name(o[1])}: ${o[2]}`)),
      },
      hint: def.hint,
      data: false,
      formula: false,
      solution: `${cap(right[0])}: ${name(k)}.\n${right[2]}`,
    };
  }
  const item = r.pick(def.items);
  const others = r.shuffle(def.cats.filter(([k]) => k !== item[1]));
  const cats = level === 1 ? [def.cats.find(([k]) => k === item[1]), others[0]] : def.cats;
  const ordered = def.cats.filter((c) => cats.includes(c)); // vedno v istem vrstnem redu kot v naboru
  return {
    text: `${def.q}\n\n**${cap(item[0])}**`,
    answer: {
      type: "choice",
      options: ordered.map(([, t]) => cap(t)),
      index: ordered.findIndex(([k]) => k === item[1]),
      why: ordered.map(([k]) => (k === item[1] ? null : item[2])),
    },
    hint: def.hint,
    data: false,
    formula: false,
    solution: `${cap(name(item[1]))}.\n${item[2]}`,
  };
}

export const NAR_GENERATORS = Object.entries(TOPIC_SETS).map(([topic, sets]) => ({
  id: `nar-${topic.split("/")[1]}`,
  topics: [topic],
  gen(level, r) {
    return sortTask(r.pick(sets), Math.min(3, Math.max(1, level)), r);
  },
}));
