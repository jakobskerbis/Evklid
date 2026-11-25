// Vodeni poskus »Drugi Newtonov zakon« (lab-newton2, motor lab-gibanje.js → labNewton2; docs/laboratorij.md »Vodeni poskus«).
// Postopek kot v šoli: proga z libelo, izravnava kotalnega upora s podložko (preizkus brez vrvice s potiskom), nato a(F) pri
// stalni skupni masi (utežice z vozička na obešalo) in a(1/m) pri stalni sili (palice po 250 g).
import { stevilo, celica } from "../lab-vodeno-pomoc.js";

// Dnevnik motorja: izravnava z libelo in izid preizkusa trenja (porociloPoteka/frame v lab-gibanje.js).
const LIBELA = /Progo si izravnal z libelo/;
const IZRAVNANO = /trenje je izravnano/;
const NI_IZRAVNANO = /podložka je premajhna|proga je preveč nagnjena/;

// Zapisane meritve (record zapiše le, če je bila vrvica pripeta in sta obe vrati izmerili zatemnitev).
const meritve = (c) => c.vrstice.filter((r) => Number.isFinite(stevilo(celica(r, /^a\b/))));
// Največ različnih vrednosti `vrednost` pri isti vrednosti `kljuc` (npr. različnih sil pri isti skupni masi).
function najvecPri(rows, kljuc, vrednost) {
  const po = new Map();
  for (const r of rows) {
    const k = kljuc(r), v = vrednost(r);
    if (!Number.isFinite(k) || !Number.isFinite(v)) continue;
    if (!po.has(k)) po.set(k, new Set());
    po.get(k).add(v);
  }
  return Math.max(0, ...[...po.values()].map((s) => s.size));
}
const masa = (r) => stevilo(celica(r, /^m\b/));
const sila = (r) => stevilo(celica(r, /^F\b/));
// Različne sile pri isti skupni masi (graf a(F)) in različne mase pri isti sili (graf a(1/m), sila na 0,01 N kot v motorju).
export const silPriMasi = (c) => najvecPri(meritve(c), masa, (r) => Math.round(sila(r) * 1000));
export const masPriSili = (c) => najvecPri(meritve(c), (r) => Math.round(sila(r) * 100), masa);

export default {
  naslov: "Drugi Newtonov zakon: pospešek, sila in masa",
  cilj: "Voziček na vodoravni progi vleče obešalo z utežmi prek škripca. Izmeril boš, kako je pospešek vozička odvisen od sile in kako od mase.",
  konec: "Pokazal si, da je pospešek sorazmeren s silo in obratno sorazmeren z maso: a = F/m. Preklopi na »Prosto« in postavi vrata 2 na 105 cm: kaj se zgodi z izmerjenim pospeškom in zakaj?",
  koraki: [
    {
      naslov: "Izravnaj progo z libelo",
      kaj: "Pritisni »Izravnaj progo z libelo«.",
      namig: "Šolska miza ni povsem vodoravna. Libela pokaže, na katero stran je nagnjena.",
      zakaj: "Že nagib nekaj milimetrov na meter da vozičku pospešek, ki ga ne povzroči obešalo. Proga je zdaj vodoravna, kotalni upor pa voziček še vedno zavira.",
      poudari: ["Izravnaj progo"],
      done: (c) => c.bilo(LIBELA),
    },
    {
      naslov: "Pripravi preizkus trenja",
      kaj: "Izklopi »vrvica pripeta na voziček« in pri »spust« izberi »s potiskom«.",
      namig: "Brez vrvice obešalo vozička ne vleče. Potisk mu da začetno hitrost.",
      zakaj: "Ko voziček sunkneš, nanj vzdolž proge deluje le še kotalni upor. Če ga nič ne uravnovesi, se voziček med vratoma upočasni.",
      poudari: ["vrvica pripeta", "spust"],
      done: (c) => c.par("vrvica pripeta na voziček") === "ne" && /potisk/.test(c.par("spust")),
    },
    {
      naslov: "Izravnaj trenje s podložko",
      kaj: "Drsnik »podložka pod levo nogo« nastavi na približno 3 mm in pritisni »Spusti voziček«. Ko se voziček ustavi, dnevnik primerja Δt₁ in Δt₂. Podložko popravljaj, dokler v dnevniku ne piše »trenje je izravnano«.",
      namig: "Če se voziček ustavlja (Δt₂ je večji od Δt₁), podložko povečaj. Če pospešuje, jo zmanjšaj. Hitrost potiska je vsakič malo drugačna, zato preizkus po potrebi ponovi.",
      zakaj: "Proga je zdaj rahlo nagnjena: komponenta teže vzdolž proge je ravno tolikšna kot kotalni upor. Voziček brez vrvice se giblje enakomerno, zato bo edina neuravnotežena sila sila vrvice.",
      poudari: ["podložka pod levo nogo", "Spusti voziček"],
      // Najnovejši preizkus po izravnavi z libelo: starejši izid ali izid pred libelo ne velja.
      done: (c) => c.zadnji(LIBELA, IZRAVNANO, NI_IZRAVNANO) === 1,
    },
    {
      naslov: "Pripni vrvico in spuščaj z elektromagnetom",
      kaj: "Vklopi »vrvica pripeta na voziček« in pri »spust« izberi »elektromagnet«. Podložke ne spreminjaj več.",
      namig: "Časovnik meri »vrata 1 → 2«: čas med vratoma in kako dolgo zastavica zastira vsaka vrata.",
      zakaj: "Elektromagnet spusti voziček iz mirovanja, brez sunka. Iz časa, ko 20 mm široka zastavica zastira žarek, dobiš hitrosti v₁ in v₂, iz njiju in razdalje med vratoma pa pospešek.",
      poudari: ["vrvica pripeta", "spust"],
      done: (c) => c.par("vrvica pripeta na voziček") === "da" && /elektromagnet/.test(c.par("spust")),
    },
    {
      naslov: "Izmeri prvi pospešek",
      kaj: "Na obešalu (10 g) je ena utežica, pet jih je na vozičku. Pritisni »Spusti voziček«, počakaj, da pelje skozi obe vrati, in pritisni »Zapiši meritev«.",
      zakaj: "Sila, ki pospešuje voziček in obešalo, je teža obešala z utežico. V tabeli je skupna masa vsega, kar se giblje: voziček, utežice in obešalo.",
      poudari: ["Spusti voziček", "Zapiši meritev"],
      done: (c) => meritve(c).length >= 1,
    },
    {
      naslov: "Prestavljaj utežice z vozička na obešalo",
      kaj: "Pritisni »Utežico z vozička na obešalo«, spusti voziček in zapiši meritev. Ponavljaj, dokler nimaš vsaj 4 različnih sil pri isti skupni masi.",
      namig: "Stolpec m v tabeli mora ostati enak. Utežic ne jemlji iz škatle, ker bi se spremenila tudi masa.",
      zakaj: "Utežica samo zamenja mesto, zato skupna masa ostane enaka. Spreminja se le sila, zato graf a(F) pokaže, kako je pospešek odvisen od sile.",
      poudari: ["Utežico z vozička na obešalo", "Spusti voziček", "Zapiši meritev"],
      done: (c) => silPriMasi(c) >= 4,
    },
    {
      naslov: "Kaj pokaže graf a(F)?",
      kaj: "Pod grafom je vprašanje »Sklep«. Poglej točke in izračun naklona ter izberi pravilen odgovor.",
      namig: "Kolikokrat se poveča pospešek, ko silo podvojiš?",
      zakaj: "Naklon premice a(F) je 1/m. Masa iz naklona je malo večja od skupne mase, ker sila zavrti tudi kolesa in škripec.",
      pokazi: /pri stalni skupni masi/,
      done: (c) => c.sklep(/pri stalni skupni masi/),
    },
    {
      naslov: "Spremeni maso pri stalni sili",
      kaj: "Utežic ne prestavljaj več. Pri »palice 250 g« izberi 1, spusti voziček in zapiši meritev, nato enako z 2 palicama. Pri »prikaži« izberi »a(1/m)«.",
      namig: "Podložke ni treba spreminjati: kotalni upor in komponenta teže sta oba sorazmerna z maso, zato trenje ostane izravnano.",
      zakaj: "Pri stalni sili je pospešek sorazmeren z 1/m: dvakrat večja masa, polovičen pospešek.",
      poudari: ["palice 250 g", "Spusti voziček", "Zapiši meritev", "prikaži"],
      done: (c) => masPriSili(c) >= 3,
    },
    {
      naslov: "Zakaj si utežice prestavljal?",
      kaj: "Odgovori na drugo vprašanje »Sklep«.",
      namig: "Kaj se zgodi s skupno maso, če utežico vzameš iz škatle?",
      zakaj: "Pri poskusu spreminjaš eno količino, drugo držiš stalno. Samo tako vidiš, kaj spremeni pospešek.",
      pokazi: /iz škatle/,
      done: (c) => c.sklep(/iz škatle/),
    },
  ],
};
