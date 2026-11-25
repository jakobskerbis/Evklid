// Vodeni poskus »Soda bikarbona in kislina« (lab-kem.js → labCo2; docs/laboratorij.md »Vodeni poskus«, faza 2).
// Poskus ima eno bučko: kar je nalito in stresenega, ostane do »↺ Ponastavi«. Koraki berejo dnevnik motorja:
// »Z merilnim valjem si v bučko nalil 30 mL. Tekočina: …«, »Na tehtalni ladjici si stehtal 1,00 g sode …«,
// »Začetna masa bučke s snovmi …« (reakcija se je začela), »Apnica se je pomotnila …«, »Trska je ugasnila …«.
import { stevilo } from "../lab-vodeno-pomoc.js";

const NALIL = /Z merilnim valjem si v bučko nalil ([\d,]+) mL\. Tekočina: (.+)\./;
const SODA = /Na tehtalni ladjici si stehtal ([\d,]+) g sode/;
const vsota = (dn, re) => dn.map((t) => t.match(re)).filter(Boolean).reduce((s, m) => s + stevilo(m[1]), 0);

export default {
  naslov: "Soda bikarbona in kis: kateri plin nastaja?",
  cilj: "Sodo bikarbono boš stresel v kis v bučki na tehtnici, nastali plin preizkusil z apnico in s trsko ter izmeril, za koliko se zmanjša masa bučke.",
  konec: "Dokazal si, da nastaja ogljikov dioksid, in pokazal, da bučka izgubi maso, ker plin uide iz nje. Preklopi na »Prosto«, pritisni »↺ Ponastavi« in stresi 4\u00a0g sode v 60\u00a0mL kisa: kaj se zgodi in zakaj?",
  koraki: [
    {
      naslov: "Nadeni si zaščitna očala",
      kaj: "Vklopi stikalo »zaščitna očala«.",
      zakaj: "Kislina in pena lahko brizgneta. Kislina v očesu peče in ga lahko poškoduje, zato pri poskusih s kislino vedno nosiš očala.",
      poudari: ["zaščitna očala"],
      done: (c) => c.par("zaščitna očala") === "da",
    },
    {
      naslov: "Nalij 30\u00a0mL kisa v bučko",
      kaj: "Pri »tekočina« pusti kis, z drsnikom »merilni valj« odmeri 30\u00a0mL in pritisni »Nalij v bučko«.",
      namig: "Če si nalil kaj drugega ali več kot 30\u00a0mL, pritisni »↺ Ponastavi« in začni znova.",
      zakaj: "Bučka stoji na tehtnici. Kis je 5-odstotna raztopina ocetne kisline. V 30\u00a0mL je dovolj kisline, da zreagira 1\u00a0g sode.",
      poudari: ["tekočina", "merilni valj", "Nalij v bučko"],
      // Vse, kar je v bučki, je kis, skupaj 30 mL (dnevnik izpiše vrednost drsnika).
      done: (c) => {
        const n = c.dnevnik.map((t) => t.match(NALIL)).filter(Boolean);
        return n.length > 0 && n.every((m) => /^kis\b/.test(m[2])) && Math.abs(n.reduce((s, m) => s + stevilo(m[1]), 0) - 30) < 0.5;
      },
    },
    {
      naslov: "Pripravi zamašek s cevko in apnico",
      kaj: "Pri »zamašek« izberi »zamašek s cevko«. Cevka vodi plin iz bučke v epruveto. Pri »v epruveti« pusti apnico.",
      namig: "Apnica je bistra nasičena raztopina kalcijevega hidroksida, Ca(OH)₂.",
      zakaj: "Ves plin, ki bo nastal v bučki, bo moral skozi apnico. Tako ga boš lahko preizkusil.",
      poudari: ["zamašek", "v epruveti"],
      done: (c) => c.par("zamašek") === "zamašek s cevko" && /^apnica/.test(c.par("v epruveti")),
    },
    {
      naslov: "Vklopi samodejni zapis mase",
      kaj: "Vklopi »zapisuj vsakih 10 s«. Ko se reakcija začne, bo tehtnica sama zapisovala maso.",
      zakaj: "Med penjenjem se masa hitro spreminja. Zapis na vsakih 10\u00a0s pokaže, kako hitro plin uhaja iz bučke.",
      poudari: ["zapisuj vsakih 10 s"],
      done: (c) => c.par("zapisuj vsakih 10 s") === "da",
    },
    {
      naslov: "Napovej in stresi 1\u00a0g sode",
      kaj: "Najprej napovej, za koliko gramov se bo zmanjšala masa bučke, ko zreagira 1\u00a0g sode. Nato pri »soda bikarbona« nastavi 1,0\u00a0g in pritisni »Stresi sodo v bučko«. Zamašek s cevko takoj vrneš na bučko.",
      namig: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. Iz 1\u00a0mol sode nastane 1\u00a0mol CO₂. M(NaHCO₃) = 84,01\u00a0g/mol, M(CO₂) = 44,01\u00a0g/mol. Če si stresel več kot 1\u00a0g, pritisni »↺ Ponastavi« in začni znova.",
      zakaj: "Po enačbi da 1\u00a0g sode 0,52\u00a0g CO₂. Ko plin uide iz bučke, tehtnica pokaže manjšo maso.",
      poudari: ["soda bikarbona", "Stresi sodo"],
      // Skupaj 1 g sode (tehtalna ladjica: ±0,01 g) in reakcija se je začela (soda in kis sta v bučki).
      done: (c) => Math.abs(vsota(c.dnevnik, SODA) - 1) <= 0.1 && c.bilo(/Začetna masa bučke s snovmi/),
    },
    {
      naslov: "Opazuj apnico",
      kaj: "Opazuj mehurčke, ki prihajajo iz cevke v epruveto. Počakaj, da se apnica pomotni.",
      namig: "Če v epruveti ni mehurčkov, preveri, ali je izbran »zamašek s cevko«. Če mehurčkov v bučki ni več, stresi še 0,5\u00a0g sode.",
      zakaj: "CO₂ + Ca(OH)₂ → CaCO₃ + H₂O. Nastaja kalcijev karbonat, ki se v vodi ne raztaplja. Njegovi drobni beli delci skalijo apnico.",
      done: (c) => c.bilo(/Apnica se je pomotnila/),
    },
    {
      naslov: "Preizkusi plin še s trsko",
      kaj: "Ko se penjenje umiri, pri »zamašek« izberi »brez zamaška« in pritisni »Prižgi trsko in jo podrži v vratu bučke«.",
      namig: "Če trska gori naprej, je plin že odtekel iz bučke. Stresi še 0,5\u00a0g sode, počakaj pol minute in poskusi znova.",
      zakaj: "Trska je ugasnila, ker je plin iz bučke izrinil zrak in v vratu bučke ni bilo dovolj kisika za gorenje.",
      poudari: ["zamašek", "Prižgi trsko"],
      done: (c) => c.bilo(/Trska je ugasnila/),
    },
    {
      naslov: "Kateri dokaz je zanesljiv?",
      kaj: "Pod meritvami je vprašanje »Sklep«. Izberi, s čim si res dokazal, da je plin ogljikov dioksid.",
      namig: "Vprašanje se pokaže, ko je reakcija končana. Ali trska ugasne samo v ogljikovem dioksidu?",
      zakaj: "Trska ugasne v vsakem plinu, ki ne podpira gorenja, na primer v dušiku. Apnica se pomotni le zaradi CO₂.",
      pokazi: /Kako si dokazal/,
      done: (c) => c.sklep(/Kako si dokazal/),
    },
    {
      naslov: "Zakaj je izguba mase manjša od napovedi?",
      kaj: "Primerjaj zadnji Δm v tabeli s svojo napovedjo in odgovori na drugo vprašanje »Sklep«.",
      namig: "Ali ves nastali CO₂ res zapusti bučko? Pomisli na kis in na plin nad njim.",
      zakaj: "Masa se pri reakciji ohranja. Del CO₂ je še raztopljen v kisu, del pa je nad tekočino. CO₂ je težji od zraka, zato je bučka zaradi njega malo težja.",
      pokazi: /izmerjena izguba manjša/,
      done: (c) => c.sklep(/izmerjena izguba manjša/),
    },
  ],
};
