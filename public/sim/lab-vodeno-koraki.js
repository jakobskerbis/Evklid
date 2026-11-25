// Koraki vodenega poskusa (public/sim/lab-vodeno.js, docs/laboratorij.md »Vodeni poskus«; načrt j 21. 11. 2026, faza 1).
// Brez DOM: vsak korak pove, kaj naj učenec naredi, in s funkcijo `done(c)` iz stanja poskusa ugotovi, ali je to res
// naredil. `c` je kontekst iz lab-vodeno.js → kontekst(): par(ime) besedilo nastavitve, num(ime) število iz nje,
// bilo(re, vrsta?) ali je bilo v dnevniku tako sporočilo (od začetka vodenja), vrstice (meritve iz tabele, ključ je
// glava stolpca brez oznak), sklepi (koliko vprašanj »Sklep« je pravilno odgovorjenih).
// `poudari`: začetek besedila gumba, stikala ali oznake kontrole, ki jo korak obkroži. `zakaj` se pokaže, ko je korak
// opravljen. Besedila so slovenska kot vse besedilo poskusov (lab-*.js).

// Število iz celice ali nastavitve (decimalna vejica, enota za številom).
export const stevilo = (s) => {
  const m = String(s ?? "").replace(/−/g, "-").match(/-?\d+(?:[.,]\d+)?/);
  return m ? Number(m[0].replace(",", ".")) : NaN;
};
// Vrednost stolpca, katerega glava se ujema z `re` (npr. /^h\b/ za »h [m]«).
export const celica = (vrstica, re) => {
  for (const [k, v] of Object.entries(vrstica || {})) if (re.test(k)) return v;
  return "";
};
// Vrstice, pri katerih se stolpec `re` ujema z `vrednost` (regularni izraz).
const kjer = (c, re, vrednost) => c.vrstice.filter((r) => vrednost.test(celica(r, re)));
// Različne vrednosti (zaokrožene na `d` decimalk) v stolpcu.
const razlicne = (vrstice, re, d = 2) => new Set(vrstice.map((r) => stevilo(celica(r, re))).filter(Number.isFinite).map((x) => x.toFixed(d)));
// Najmanj dve titraciji istega vzorca se ujemata na 0,10 mL (kot »Ujemanje« v lab-titracija.js → concordant).
export function ujemanje(vrstice) {
  const po = new Map();
  for (const r of vrstice) {
    const V = stevilo(celica(r, /^V\b/));
    if (!Number.isFinite(V)) continue;
    const k = celica(r, /^vzorec/);
    po.set(k, [...(po.get(k) || []), V]);
  }
  for (const V of po.values()) for (const a of V) if (V.filter((b) => b >= a - 1e-9 && b <= a + 0.1 + 1e-9).length >= 2) return true;
  return false;
}

export const KORAKI = {
  "lab-titracija": {
    naslov: "Titracija: koliko kisline je v vzorcu?",
    cilj: "Z raztopino NaOH znane koncentracije boš določil neznano koncentracijo klorovodikove kisline (HCl).",
    konec: "Določil si koncentracijo kisline tako, kot jo določijo v pravem laboratoriju. Zdaj preklopi na »Prosto« in poskusi ocetno kislino z metiloranžem: zakaj dobiš napačen rezultat?",
    koraki: [
      {
        naslov: "Nadeni si zaščitna očala",
        kaj: "Vklopi stikalo »zaščitna očala«.",
        namig: "Brez očal laboratorij ne pusti ničesar narediti, tako kot v šoli.",
        zakaj: "NaOH je jedek, tudi razredčen. Kaplja v očesu lahko trajno poškoduje roženico.",
        poudari: ["zaščitna očala"],
        done: (c) => c.par("zaščitna očala") === "da",
      },
      {
        naslov: "Speri bireto s titrantom",
        kaj: "Pritisni »Speri bireto s titrantom«.",
        namig: "Bireta je po pomivanju še mokra od vode.",
        zakaj: "Voda v bireti bi raztopino NaOH razredčila. Potem bi je porabil več in dobil prevelik rezultat.",
        poudari: ["Speri bireto"],
        done: (c) => c.bilo(/Bireto si trikrat spral/),
      },
      {
        naslov: "Napolni bireto z NaOH",
        kaj: "Pritisni »Napolni bireto z NaOH«.",
        zakaj: "Bireta je zdaj napolnjena malo pod ničlo. Odčitek bereš na spodnjem robu meniska.",
        poudari: ["Napolni bireto"],
        done: (c) => c.bilo(/Bireto si (z lijakom )?napolnil|Bireto si dopolnil/),
      },
      {
        naslov: "Izpusti zrak iz konice",
        kaj: "Pritisni »Izpusti zrak iz konice«.",
        namig: "V konici pod pipo je po polnjenju pogosto zračni mehurček.",
        zakaj: "Če mehurček uide med titracijo, bireta pokaže več porabljenega NaOH, kot ga je res steklo v erlenmajerico.",
        poudari: ["Izpusti zrak"],
        done: (c) => c.bilo(/zračni mehurček je odšel iz konice|zraka v konici ni bilo/),
      },
      {
        naslov: "Odpipetiraj vzorec",
        kaj: "Pri »vzorec« pusti klorovodikovo kislino, vklopi »pipeto prej speri z vzorcem«, erlenmajerico speri z destilirano vodo in pritisni »Odpipetiraj 25,00 mL v erlenmajerico«.",
        namig: "Pipeto speri z vzorcem, erlenmajerico pa z vodo. Zakaj ravno obratno? Voda v erlenmajerici ne spremeni količine kisline, ostanek vzorca pa bi jo povečal.",
        zakaj: "Polnilna pipeta odmeri natanko 25,00 mL. To prostornino vzorca potrebuješ v računu.",
        poudari: ["pipeto prej speri", "Odpipetiraj"],
        done: (c) => c.bilo(/S propipeto si/),
      },
      {
        naslov: "Dodaj indikator",
        kaj: "Izberi fenolftalein in pritisni »Dodaj 2 kapljici indikatorja«.",
        namig: "Fenolftalein je v kislini brezbarven, v bazi rožnat.",
        zakaj: "Indikator s spremembo barve pokaže končno točko: takrat je NaOH ravno toliko, kolikor je bilo kisline.",
        poudari: ["indikator", "Dodaj 2 kapljici"],
        done: (c) => c.bilo(/dodal 2 kapljici indikatorja/),
      },
      {
        naslov: "Zapiši začetni odčitek",
        kaj: "V povečavi preberi gladino v bireti (spodnji rob meniska), vpiši jo na 0,05 mL natančno in pritisni »Zapiši začetni odčitek«.",
        namig: "Oči imej v višini meniska. Bireta šteje od zgoraj navzdol, zato je število zgoraj manjše.",
        zakaj: "Porabo NaOH dobiš kot razliko končnega in začetnega odčitka.",
        poudari: ["odčitek birete", "Zapiši"],
        done: (c) => c.bilo(/Začetni odčitek(:| popravljen)/),
      },
      {
        naslov: "Titriraj do končne točke",
        kaj: "Odpri pipo, sproti mešaj in blizu konca dodajaj po eno kapljico. Ko rožnata barva ostane, zapri pipo, preberi bireto in zapiši končni odčitek.",
        namig: "Prva titracija je lahko groba: iz nje izveš približno porabo. Pri naslednji odpri curek samo do nekaj mL pred tem.",
        zakaj: "Ena kapljica je okoli 0,05 mL. Zato se blizu končne točke splača iti po kapljicah.",
        poudari: ["pipa birete", "1 kapljica", "Zapiši"],
        done: (c) => c.vrstice.length >= 1,
      },
      {
        naslov: "Ponovi, da se titraciji ujemata",
        kaj: "Odpipetiraj nov vzorec in titriraj znova, dokler se dve titraciji istega vzorca ne ujemata na 0,10 mL.",
        namig: "Za novo titracijo znova odpipetiraj vzorec in dodaj indikator. Bireto po potrebi dopolni in zapiši nov začetni odčitek.",
        zakaj: "Ena meritev lahko vsebuje napako. Dve ujemajoči se titraciji pokažeta, da je poraba res taka.",
        done: (c) => ujemanje(c.vrstice),
      },
      {
        naslov: "Izračunaj koncentracijo",
        kaj: "Iz povprečne porabe izračunaj koncentracijo kisline, jo vpiši in pritisni »Preveri koncentracijo«.",
        namig: "HCl in NaOH reagirata 1 : 1, zato je c(kisline) · 25,00 mL = 0,1000 mol/L · V(NaOH).",
        zakaj: "To je osnovni račun vsake titracije: iz znane množine NaOH sklepaš na množino kisline v vzorcu.",
        poudari: ["c(kisline)", "Preveri koncentracijo"],
        done: (c) => c.bilo(/Račun je pravilen/),
      },
    ],
  },

  "lab-ohm": {
    naslov: "Ohmov zakon: kako je tok odvisen od napetosti?",
    cilj: "Izmeril boš tok skozi upornik pri več napetostih, iz grafa določil upor in ugotovil, zakaj se žarnica obnaša drugače.",
    konec: "Pokazal si, da je pri uporniku tok premo sorazmeren z napetosti (Ohmov zakon), pri žarnici pa ne. Preklopi na »Prosto« in preizkusi upornik 47 Ω: kaj se zgodi pri 12 V?",
    koraki: [
      {
        naslov: "Poglej vezje",
        kaj: "Ampermeter je vezan zaporedno, voltmeter vzporedno z upornikom 100 Ω. Napetost napajalnika povečaj na približno 2 V.",
        namig: "Drsnik »napetost napajalnika« je na vrhu kontrol.",
        zakaj: "Skozi ampermeter mora teči isti tok kot skozi upornik, zato je zaporedno. Voltmeter meri razliko napetosti med krajišči upornika, zato je vzporedno.",
        poudari: ["napetost napajalnika"],
        done: (c) => c.num("napetost napajalnika") >= 1.5,
      },
      {
        naslov: "Zapiši prvo meritev",
        kaj: "Pritisni »Zapiši meritev«.",
        zakaj: "V tabeli sta zdaj napetost in tok. Iz njiju je narisana prva točka grafa.",
        poudari: ["Zapiši meritev"],
        done: (c) => kjer(c, /^porabnik/, /100/).some((r) => Number.isFinite(stevilo(celica(r, /^I\b/)))),
      },
      {
        naslov: "Izmeri še pri drugih napetostih",
        kaj: "Spreminjaj napetost (npr. 4, 6, 8 in 10 V) in vsakič zapiši meritev. Potrebuješ vsaj 5 različnih napetosti.",
        namig: "Pri 100 Ω in 10 V teče 100 mA, zato je območje 200 mA ampermetra prav.",
        zakaj: "Več točk pokaže, ali ležijo na premici. Ena točka tega ne more pokazati.",
        poudari: ["napetost napajalnika", "Zapiši meritev"],
        done: (c) => {
          const r = kjer(c, /^porabnik/, /100/).filter((x) => Number.isFinite(stevilo(celica(x, /^I\b/))));
          return razlicne(r, /^U\b/, 1).size >= 5 && Math.max(...r.map((x) => stevilo(celica(x, /^U\b/)))) >= 4;
        },
      },
      {
        naslov: "Odgovori na vprašanje o uporniku",
        kaj: "Pod grafom je vprašanje »Sklep«. Poglej točke in črtkano premico ter izberi pravilen odgovor.",
        namig: "Če napetost podvojiš, kaj se zgodi s tokom?",
        zakaj: "Naklon premice je 1/R. Iz njega izračunaš upor in ga primerjaš z oznako na uporniku.",
        done: (c) => c.sklepi >= 1,
      },
      {
        naslov: "Kaj, če ampermeter vežeš narobe?",
        kaj: "Napetost znižaj na približno 1 V in ampermeter za trenutek priključi vzporedno. Opazuj, kaj se zgodi.",
        namig: "Pri »ampermeter« izberi »vzporedno«.",
        zakaj: "Ampermeter ima zelo majhen upor. Vzporedno priključen naredi skoraj kratek stik, zato steče velik tok in varovalka pregori.",
        poudari: ["ampermeter"],
        done: (c) => c.bilo(/pregorela varovalka/) || c.par("ampermeter") === "vzporedno",
      },
      {
        naslov: "Popravi vezje",
        kaj: "Ampermeter znova veži zaporedno. Če je varovalka pregorela, pritisni »Zamenjaj varovalko v ampermetru«.",
        zakaj: "V šolskem multimetru je zato varovalka: zaščiti merilnik, ko ga narobe priključiš.",
        poudari: ["ampermeter", "Zamenjaj varovalko"],
        done: (c) => c.par("ampermeter") === "zaporedno" && (!c.bilo(/pregorela varovalka/) || c.bilo(/Nova varovalka/)),
      },
      {
        naslov: "Izmeri še žarnico",
        kaj: "Pri »porabnik« izberi žarnico 6 V in zapiši meritve pri vsaj 4 napetostih, od majhnih do približno 6 V.",
        namig: "Nad 6 V se nitka lahko pretrga. Žarnica rabi največ 0,1 A, zato je območje 200 mA dovolj.",
        zakaj: "Pri žarnici se z napetostjo spreminja temperatura nitke in z njo upor.",
        poudari: ["porabnik", "Zapiši meritev"],
        done: (c) => {
          const r = kjer(c, /^porabnik/, /žarnica/).filter((x) => Number.isFinite(stevilo(celica(x, /^I\b/))));
          return razlicne(r, /^U\b/, 1).size >= 4 && Math.max(...r.map((x) => stevilo(celica(x, /^U\b/)))) >= 4;
        },
      },
      {
        naslov: "Odgovori na vprašanje o žarnici",
        kaj: "Pod grafom je novo vprašanje »Sklep« za žarnico. Izberi pravilen odgovor.",
        namig: "Primerjaj U/I v tabeli pri 2 V in pri 6 V.",
        zakaj: "Upor kovine raste s temperaturo. Zato graf žarnice ni premica.",
        done: (c) => c.sklepi >= 2,
      },
    ],
  },

  "lab-prosti-pad": {
    naslov: "Prosti pad: kolikšen je težni pospešek?",
    cilj: "S svetlobnimi vrati boš meril čas padanja jeklene kroglice z različnih višin, iz grafa h(t²) določil g in ga primerjal s padanjem filtra za kavo.",
    konec: "Iz svojih meritev si določil težni pospešek in videl, kako zračni upor zavre lahek predmet. Preklopi na »Prosto« in poskusi pero ali papirnati stožec.",
    koraki: [
      {
        naslov: "Postavi vrata 20 cm pod kroglico",
        kaj: "Predmet je jeklena kroglica na elektromagnetu. Drsnik »vrata pod predmetom« nastavi na 20 cm.",
        zakaj: "h je razdalja od spodnjega roba kroglice do žarka. Časovnik meri čas od izklopa magneta do zatemnitve žarka.",
        poudari: ["vrata pod predmetom"],
        done: (c) => Math.abs(c.num("vrata pod predmetom") - 20) <= 2 && /jeklena/.test(c.par("predmet")),
      },
      {
        naslov: "Spusti kroglico in zapiši čas",
        kaj: "Pritisni »Spusti«, počakaj, da kroglica pade, in pritisni »Zapiši meritev«.",
        namig: "Če kroglica gre mimo žarka, premik vrat naprej–nazaj vrni na 0 mm.",
        zakaj: "Iz višine in časa lahko izračunaš pospešek, a ena meritev ima lahko napako. Zato meriš z več višin.",
        poudari: ["Spusti", "Zapiši meritev"],
        done: (c) => kjer(c, /^predmet/, /kroglica/).length >= 1,
      },
      {
        naslov: "Izmeri pri več višinah",
        kaj: "Ponovi pri 50, 100, 150 in 200 cm. Skupaj potrebuješ vsaj 5 različnih višin.",
        zakaj: "Graf h(t²) z več točkami pokaže, ali je odvisnost res premica.",
        poudari: ["vrata pod predmetom", "Spusti", "Zapiši meritev"],
        done: (c) => {
          const r = kjer(c, /^predmet/, /kroglica/);
          return razlicne(r, /^h\b/, 2).size >= 5 && Math.max(...r.map((x) => stevilo(celica(x, /^h\b/)))) >= 1.4;
        },
      },
      {
        naslov: "Iz grafa določi g",
        kaj: "Poglej graf h(t²) in račun pod njim, nato odgovori na vprašanje »Sklep«.",
        namig: "Iz h = ½gt² sledi, da je naklon premice h(t²) enak ½g.",
        zakaj: "Ker so točke na premici, je pospešek stalen. Dvakratnik naklona je težni pospešek, približno 9,8 m/s².",
        done: (c) => c.sklepi >= 1,
      },
      {
        naslov: "Zamenjaj predmet s filtrom za kavo",
        kaj: "Pri »predmet« izberi filter za kavo, pri »spust« pa klešče s stikalom.",
        namig: "Elektromagnet drži samo jeklo.",
        zakaj: "Filter je lahek in širok, zato ga zrak zavira veliko bolj kot kroglico.",
        poudari: ["predmet", "spust"],
        done: (c) => /filter/.test(c.par("predmet")) && /klešče/.test(c.par("spust")),
      },
      {
        naslov: "Izmeri filter pri več višinah",
        kaj: "Spusti filter z vsaj treh različnih višin in vsakič zapiši meritev.",
        zakaj: "Na grafu primerjaj točke filtra s premico kroglice.",
        poudari: ["vrata pod predmetom", "Spusti", "Zapiši meritev"],
        done: (c) => razlicne(kjer(c, /^predmet/, /filter/), /^h\b/, 2).size >= 3,
      },
      {
        naslov: "Zakaj filter pade počasneje?",
        kaj: "Odgovori na drugo vprašanje »Sklep«.",
        namig: "Kaj se zgodi s silo zračnega upora, ko hitrost raste?",
        zakaj: "Ko je upor enak teži, filter ne pospešuje več in pada s stalno končno hitrostjo.",
        done: (c) => c.sklepi >= 2,
      },
    ],
  },
};
