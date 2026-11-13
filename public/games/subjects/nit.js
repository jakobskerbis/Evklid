// Pojmi za igre: nit (glej README.md v tej mapi).
// Naravoslovje in tehnika, 4. in 5. razred OŠ. Kratka vprašanja, odgovori največ nekaj besed.
// Banke vprašanj (vnos: stopnja, "vprašanje|pravilno|napačno|…" sl in en) in generatorji iz preglednic
// (seznami "slovensko|angleško").

export const SUBJECT = "NIT";

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
const an = (w) => (/^[aeiou]/i.test(w) ? "an " : "a ") + w; // angleški člen
const tr = (ctx, s) => s.split("|")[ctx.lang === "sl" ? 0 : 1];
const C = [];
const def = (id, area, year, glyph, sl, en, gen) => C.push({ id, area, year, glyph, name: { sl, en }, gen });

// Naloga: 3–4 napačni (premešani), brez podvajanja in brez pravilnega.
function out(q, a, ws) {
  const seen = new Set([a]);
  const w = [];
  for (const s of shuffle(ws)) {
    if (s == null || s === "" || seen.has(s) || w.length >= 4) continue;
    seen.add(s);
    w.push(s);
  }
  return { q, a, w };
}
// Izbira: pravilni iz seznama yes, napačni iz seznama no (vnosi "sl|en").
const choose = (ctx, q, yes, no) => out(q, tr(ctx, pick(yes)), no.map((s) => tr(ctx, s)));
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
const defBank = (id, area, year, glyph, sl, en, items) => def(id, area, year, glyph, sl, en, bank(items));

// =====================================================================
// SNOVI
// =====================================================================
const SOLIDS = ["kamen|stone", "les|wood", "led|ice", "sol|salt", "železo|iron", "steklo|glass", "pesek|sand"];
const LIQUIDS = ["voda|water", "mleko|milk", "olje|oil", "sok|juice", "kis|vinegar"];
const GASES = ["zrak|air", "vodna para|water vapour", "kisik|oxygen", "helij|helium"];
const MATTER_BANK = bank([
  [1, "Stalno obliko ima?|trdna snov|tekočina|plin|para", "Which keeps its own shape?|a solid|a liquid|a gas|steam"],
  [1, "Obliko posode prevzame, a ne zapolni vse?|tekočina|plin|trdna snov|kamen", "Takes the container's shape but doesn't fill it?|a liquid|a gas|a solid|a stone"],
  [1, "Kaj vedno zapolni vso posodo?|plin|tekočina|trdna snov|pesek", "What always fills the whole container?|a gas|a liquid|a solid|sand"],
  [1, "Kaj teče?|tekočina|kamen|les|železo", "What can flow?|a liquid|a stone|wood|iron"],
  [1, "Kaj je led?|trdna snov|tekočina|plin|para", "What is ice?|a solid|a liquid|a gas|steam"],
  [1, "Kaj je mleko?|tekočina|trdna snov|plin|kovina", "What is milk?|a liquid|a solid|a gas|a metal"],
  [1, "Kaj je v napihnjenem balonu?|zrak|voda|pesek|mleko", "What is inside a blown-up balloon?|air|water|sand|milk"],
  [1, "Kaj lahko nalijemo v kozarec?|sok|kamen|les|železo", "What can we pour into a glass?|juice|a stone|wood|iron"],
  [2, "Kaj lahko stisnemo?|zrak v brizgi|vodo v brizgi|kamen|les", "What can be squeezed smaller?|air in a syringe|water in a syringe|a stone|wood"],
  [2, "Ali zrak zavzema prostor?|da|ne|samo pozimi|samo v balonu", "Does air take up space?|yes|no|only in winter|only in balloons"],
  [2, "Ali ima zrak maso?|da|ne|samo veter|samo ponoči", "Does air have mass?|yes|no|only wind does|only at night"],
  [2, "Napihnjena žoga je v primerjavi s prazno?|malo težja|lažja|enako težka|veliko lažja", "A pumped-up ball compared with a flat one?|slightly heavier|lighter|exactly as heavy|much lighter"],
  [2, "Balon na toplem?|se poveča|se skrči|zmrzne|se stopi", "A balloon in a warm place?|gets bigger|shrinks|freezes|melts"],
  [2, "Balon v zamrzovalniku?|se skrči|se poveča|zavre|se stopi", "A balloon in the freezer?|shrinks|gets bigger|boils|melts"],
  [2, "Veter je?|zrak v gibanju|voda|svetloba|zvok", "Wind is?|moving air|water|light|sound"],
  [2, "Kateri plin iz zraka potrebujemo za dihanje?|kisik|helij|dim|para", "Which gas in air do we need to breathe?|oxygen|helium|smoke|steam"],
  [3, "Pesek se usipa kot tekočina, a je?|trdna snov|tekočina|plin|para", "Sand pours like a liquid, but what is it?|a solid|a liquid|a gas|vapour"],
  [3, "Kaj merimo s tehtnico?|maso|prostornino|temperaturo|čas", "What do we measure with scales?|mass|volume|temperature|time"],
  [3, "Kateri plin dvigne balonček s sejma?|helij|kisik|ogljikov dioksid|vodna para", "Which gas makes party balloons float?|helium|oxygen|carbon dioxide|water vapour"],
  [3, "Mehurčki v gazirani vodi so iz?|ogljikovega dioksida|kisika|helija|vodne pare", "Bubbles in fizzy water are?|carbon dioxide|oxygen|helium|steam"],
  [3, "Zrak je?|zmes plinov|en sam plin|tekočina|trdna snov", "Air is?|a mixture of gases|a single gas|a liquid|a solid"],
  [3, "Delci so najtesneje skupaj v?|trdni snovi|tekočini|plinu|zraku", "Where are particles packed most tightly?|in a solid|in a liquid|in a gas|in a bubble"],
  [3, "Snovi se pri segrevanju večinoma?|raztezajo|krčijo|ne spremenijo|izginejo", "When heated, most substances?|expand|shrink|don't change|vanish"],
  [3, "Kaj se zgodi z vodo pri 100 °C?|zavre|zmrzne|se strdi|se stali", "What happens to water at 100 °C?|it boils|it freezes|it hardens|it melts"],
]);
def("t_matter", "nt_snov", 4, "▣", "Trdne snovi, tekočine in plini", "Solids, liquids and gases", (t, ctx) => {
  const r = Math.random();
  if (r < (t === 1 ? 0.5 : 0.3)) {
    const k = R(0, 2), S = [SOLIDS, LIQUIDS, GASES];
    const q = [L(ctx, "Kaj je trdna snov?", "Which is a solid?"), L(ctx, "Kaj je tekočina?", "Which is a liquid?"), L(ctx, "Kaj je plin?", "Which is a gas?")][k];
    // led in pesek sta trdni snovi, a ju kot napačna pri trdnih ne ponujamo pri lažjih stopnjah
    return choose(ctx, q, t === 1 ? S[k].filter((x) => !/pesek|led/.test(x)) : S[k], S.filter((_, j) => j !== k).flat());
  }
  return MATTER_BANK(t, ctx);
});

const DISS = ["sladkor|sugar", "sol|salt", "kocka sladkorja|sugar cube", "med|honey"];
const NODISS = ["pesek|sand", "olje|oil", "kreda|chalk", "riž|rice", "kamenček|pebble", "poper v zrnu|peppercorns", "žagovina|sawdust"];
def("t_dissolve", "nt_snov", 4, "≋", "Raztapljanje in zmesi", "Dissolving and mixtures", (t, ctx) => {
  if (t === 3 && Math.random() < 0.3) {
    const w = pick([100, 150, 200, 250, 300, 400, 500]), m = pick([5, 10, 15, 20, 25, 30, 50].filter((x) => x * 100 <= w * 30)); // vsa sol se mora raztopiti (~36 g na 100 g vode)
    return out(L(ctx, `${w} g vode in ${m} g soli. Masa raztopine?`, `${w} g of water and ${m} g of salt. Mass of solution?`), `${w + m} g`, [`${w} g`, `${w - m} g`, `${m} g`, `${w + 2 * m} g`]);
  }
  if (t === 1 && Math.random() < 0.4) {
    return Math.random() < 0.5 ? choose(ctx, L(ctx, "Kaj se raztopi v vodi?", "What dissolves in water?"), DISS, NODISS) : choose(ctx, L(ctx, "Kaj se ne raztopi v vodi?", "What does NOT dissolve in water?"), NODISS, DISS);
  }
  return DISSOLVE_BANK(t, ctx);
});
const DISSOLVE_BANK = bank([
  [1, "Kje se sladkor hitreje raztopi?|v topli vodi|v hladni vodi|v ledu|v olju", "Where does sugar dissolve faster?|in warm water|in cold water|in ice|in oil"],
  [1, "Sladkor se raztopi hitreje, če?|mešamo|ne mešamo|ohladimo vodo|dodamo led", "Sugar dissolves faster if we?|stir|don't stir|cool the water|add ice"],
  [1, "Olje in voda se?|ne zmešata|lepo zmešata|raztopita|strdita", "Oil and water?|don't mix|mix well|dissolve|harden"],
  [1, "Kje je olje, ko ga nalijemo v vodo?|na vrhu|na dnu|v sredini|nikjer", "Where is oil poured into water?|on top|at the bottom|in the middle|nowhere"],
  [1, "Kaj je zmes?|sadna solata|sladkor|baker|zlato", "Which is a mixture?|fruit salad|sugar|copper|gold"],
  [1, "Kaj je raztopina?|slana voda|pesek v vodi|olje na vodi|kamenje v vodi", "Which is a solution?|salt water|sand in water|oil on water|stones in water"],
  [1, "Kaj zadrži pesek iz kalne vode?|filtrirni papir|magnet|termometer|žlica", "What holds back sand from muddy water?|filter paper|a magnet|a thermometer|a spoon"],
  [1, "S katerim pripomočkom ločimo kamenčke od peska?|sito|magnet|termometer|kozarec", "Which tool separates pebbles from sand?|a sieve|a magnet|a thermometer|a glass"],
  [1, "Kaj iz zmesi potegne železne opilke?|magnet|sito|termometer|ravnilo", "What pulls iron filings out of a mix?|a magnet|a sieve|a thermometer|a ruler"],
  [1, "Slano vodo pustimo na soncu. Kaj ostane?|sol|sladkor|pesek|nič", "Salt water is left in the sun. What remains?|salt|sugar|sand|nothing"],
  [2, "V slani vodi je sol?|raztopljena|stopljena|zmrznjena|izginila", "In salt water, the salt is?|dissolved|melted|frozen|gone"],
  [2, "Sladkor, raztopljen v vodi?|je še vedno tam|je izginil|se je stopil|je postal voda", "Sugar dissolved in water?|is still there|has vanished|has melted|has become water"],
  [2, "Kaj se raztopi hitreje?|sladkor v prahu|kocka sladkorja|oba enako|nobeden", "Which dissolves faster?|icing sugar|a sugar cube|both the same|neither"],
  [2, "V kateri vodi se raztopi več sladkorja?|v topli|v hladni|v obeh enako|v nobeni", "In which water does more sugar dissolve?|warm|cold|both the same|neither"],
  [2, "Kaj je topilo v sladkem čaju?|voda|sladkor|limona|skodelica", "What is the solvent in sweet tea?|water|sugar|lemon|the cup"],
  [2, "Kaj loči vodo od čajnih listov?|cedilo|magnet|termometer|tehtnica", "What separates tea leaves from water?|a strainer|a magnet|a thermometer|scales"],
  [2, "Kalno vodo pustimo stati. Kaj se zgodi?|blato se usede|voda zavre|voda zmrzne|voda izgine", "Muddy water is left to stand. What happens?|the mud settles|it boils|it freezes|it disappears"],
  [2, "Kocko sladkorja hitreje raztopimo, če jo?|zdrobimo|zamrznemo|pobarvamo|ohladimo", "A sugar cube dissolves faster if we?|crush it|freeze it|paint it|cool it"],
  [2, "Kaj je v sladkem čaju topljenec?|sladkor|voda|skodelica|žlička", "In sweet tea, what is the solute?|sugar|water|the cup|the spoon"],
  [3, "Raztopina je bistra, ker so raztopljeni delci?|zelo majhni|zelo veliki|zmrznjeni|obarvani", "A solution is clear because the particles are?|very small|very big|frozen|coloured"],
  [3, "Morska voda je zmes vode in?|soli|olja|peska|sladkorja", "Sea water is a mixture of water and?|salt|oil|sand|sugar"],
  [3, "Kava z mlekom in sladkorjem je?|zmes|čista snov|kovina|plin", "Coffee with milk and sugar is?|a mixture|a pure substance|a metal|a gas"],
  [3, "Kaj ni raztopina?|pesek v vodi|sladek čaj|slana voda|sirup", "Which is NOT a solution?|sand in water|sweet tea|salt water|syrup"],
  [3, "Kje iz morske vode pridobivajo sol?|v solinah|v gozdovih|v jamah|v vrtovih", "Where is salt made from sea water?|in salt pans|in forests|in caves|in gardens"],
  [3, "Slana voda vre. Kaj izhlapi?|voda|sol|voda in sol|nič", "Salt water boils. What evaporates?|the water|the salt|water and salt|nothing"],
  [3, "Kaj se zgodi s sladkorjem, ko ga je v vodi preveč?|ostane na dnu|izgine|se stali|izhlapi", "What if there's too much sugar in water?|some is left over|it vanishes|it melts|it evaporates"],
]);

defBank("t_water", "nt_snov", 5, "↺", "Kroženje vode", "The water cycle", [
  [1, "Sonce segreva morje. Voda?|izhlapeva|zmrzuje|tone|se tali", "The Sun warms the sea. The water?|evaporates|freezes|sinks|melts"],
  [1, "Para se visoko v zraku ohladi. Nastanejo?|oblaki|kamni|reke|vulkani", "Vapour cools high in the air. What forms?|clouds|stones|rivers|volcanoes"],
  [1, "Kaj pada iz oblakov?|dež ali sneg|pesek|listje|para", "What falls from clouds?|rain or snow|sand|leaves|steam"],
  [1, "Dež, sneg in toča so?|padavine|oblaki|megle|vetrovi", "Rain, snow and hail are?|precipitation|clouds|fog|winds"],
  [1, "Kam tečejo reke?|v morje|v gore|v oblake|v vulkane", "Where do rivers flow to?|the sea|the mountains|the clouds|volcanoes"],
  [1, "Kako rečemo vodi pod zemljo?|podtalnica|izvir|dež|para", "What is water under the ground called?|groundwater|a spring|rain|steam"],
  [1, "Kako rečemo kraju, kjer voda priteče iz tal?|izvir|ustje|jez|oblak", "Where water comes out of the ground is a?|spring|river mouth|dam|cloud"],
  [1, "Kaj poganja kroženje vode?|Sonce|Luna|ribe|ljudje", "What drives the water cycle?|the Sun|the Moon|fish|people"],
  [1, "Kje je voda slana?|v morju|v potoku|v dežju|v podtalnici", "Where is water salty?|in the sea|in a stream|in rain|in groundwater"],
  [1, "Kraj, kjer se reka izliva v morje, je?|ustje|izvir|struga|breg", "Where a river meets the sea is the?|mouth|source|riverbed|bank"],
  [1, "Jezero je voda, ki?|stoji|teče|pada|takoj izhlapi", "A lake is water that?|stands still|flows|falls|evaporates at once"],
  [1, "Potok in reka sta?|tekoči vodi|stoječi vodi|oblaka|ledenika", "A stream and a river are?|flowing waters|still waters|clouds|glaciers"],
  [2, "Kako rečemo, ko para postane kapljice?|kondenzacija|izhlapevanje|taljenje|zmrzovanje", "Vapour turning into droplets is called?|condensation|evaporation|melting|freezing"],
  [2, "Kako rečemo, ko voda postane para?|izhlapevanje|kondenzacija|taljenje|zmrzovanje", "Water turning into vapour is called?|evaporation|condensation|melting|freezing"],
  [2, "Količina vode na Zemlji se?|skoraj ne spreminja|hitro povečuje|hitro zmanjšuje|vsak dan podvoji", "The amount of water on Earth?|stays about the same|grows fast|shrinks fast|doubles daily"],
  [2, "Večina vode na Zemlji je?|slana|sladka|zmrznjena|para", "Most water on Earth is?|salty|fresh|frozen|vapour"],
  [2, "Koliko Zemljinega površja pokriva voda?|približno 70 %|približno 10 %|približno 30 %|vse", "How much of Earth's surface is water?|about 70%|about 10%|about 30%|all of it"],
  [2, "Rastline oddajajo vodo skozi?|liste|korenine|cvetove|semena", "Plants give off water through their?|leaves|roots|flowers|seeds"],
  [2, "Kateri del kroženja vrne vodo na tla?|padavine|izhlapevanje|kondenzacija|veter", "Which part of the cycle brings water down?|precipitation|evaporation|condensation|wind"],
  [2, "Voda po površju teče?|navzdol|navzgor|v krogu|na mestu", "Water on the surface flows?|downhill|uphill|in circles|nowhere"],
  [2, "Kaj očisti vodo, ki ponika?|tla in kamnine|oblaki|veter|ribe", "What cleans water as it soaks down?|soil and rock|clouds|wind|fish"],
  [2, "Od kod je večina pitne vode v Sloveniji?|iz podtalnice|iz morja|iz sodov za dež|iz ledenikov", "Most of Slovenia's tap water comes from?|groundwater|the sea|rain barrels|glaciers"],
  [2, "Kaj onesnažuje podtalnico?|odpadki in strupi|dež|drevesa|kamni", "What pollutes groundwater?|waste and poisons|rain|trees|rocks"],
  [2, "Kaj počne čistilna naprava?|čisti odpadno vodo|dela dež|greje morje|polni oblake", "What does a sewage plant do?|cleans waste water|makes rain|heats the sea|fills clouds"],
  [3, "Kje je na Zemlji največ sladke vode?|v ledenikih|v rekah|v oblakih|v jezerih", "Where is most of Earth's fresh water?|in glaciers and ice|in rivers|in clouds|in lakes"],
  [3, "Toča nastane v?|nevihtnih oblakih|megli|jezeru|ledeniku", "Hail forms in?|storm clouds|fog|lakes|glaciers"],
  [3, "Na kaj vpliva kroženje vode?|na vreme|na Lunine mene|na potrese|na uro", "What does the water cycle affect?|the weather|the Moon's phases|earthquakes|the clock"],
  [3, "Izhlapevanje → ? → padavine|kondenzacija|taljenje|zmrzovanje|odtekanje", "evaporation → ? → precipitation|condensation|melting|freezing|runoff"],
  [3, "Oblaki → ? → reke → morje|padavine|izhlapevanje|kondenzacija|sublimacija", "clouds → ? → rivers → sea|precipitation|evaporation|condensation|sublimation"],
  [3, "V kraškem svetu reke ponikajo?|v podzemlje|v oblake|naravnost v morje|nikamor", "In karst land, rivers sink?|underground|into clouds|straight to the sea|nowhere"],
  [3, "Ponikalnica je reka, ki?|teče tudi pod zemljo|nikoli ne teče|je zamrznjena|teče navzgor", "A sinking river is one that?|goes underground|never flows|is frozen|flows uphill"],
  [3, "Kaj zadržuje vodo v tleh?|gozd in rastline|beton|asfalt|avtomobili", "What keeps water in the ground?|forests and plants|concrete|asphalt|cars"],
  [3, "Zakaj po dolgi suši reke presahnejo?|ni padavin|preveč dežja|preveč rib|ker piha veter", "Why do rivers dry up after a drought?|no rain|too much rain|too many fish|because of wind"],
  [3, "Odpadna voda je voda, ki?|smo jo uporabili|pade z neba|je v morju|je čista", "Waste water is water that?|we have used|falls from the sky|is in the sea|is clean"],
  [3, "Zakaj morske vode ne pijemo?|preveč soli ima|je prehladna|je modra|je pretežka", "Why don't we drink sea water?|too much salt|it's too cold|it's blue|it's too heavy"],
]);

defBank("t_fire", "nt_snov", 5, "△", "Gorenje in požar", "Burning and fire safety", [
  [1, "Za gorenje potrebujemo gorivo, toploto in?|kisik|vodo|led|pesek", "Burning needs fuel, heat and?|oxygen|water|ice|sand"],
  [1, "Sveča pod kozarcem ugasne, ker zmanjka?|kisika|voska|stenja|svetlobe", "A candle under a jar goes out because it runs out of?|oxygen|wax|wick|light"],
  [1, "Kaj je gorivo?|les|voda|pesek|kamen", "Which is a fuel?|wood|water|sand|stone"],
  [1, "Kaj ne gori?|kamen|papir|les|bencin", "What does NOT burn?|stone|paper|wood|petrol"],
  [1, "Gori olje v ponvi. Kaj storimo?|pokrijemo s pokrovom|polijemo z vodo|pihamo|mešamo", "Oil is burning in a pan. We?|cover it with a lid|pour water on it|blow on it|stir it"],
  [1, "Številka za gasilce in reševalce?|112|113|911|100", "Emergency number for fire and ambulance?|112|113|911|100"],
  [1, "Številka za policijo v Sloveniji?|113|911|123|100", "Police number in Slovenia?|113|911|123|100"],
  [1, "Če zagori obleka, se?|valjamo po tleh|poženemo v tek|zelo hitro vrtimo|skrijemo v omaro", "If your clothes catch fire, you?|roll on the ground|run|spin fast|hide in a cupboard"],
  [1, "Kaj ostane, ko les zgori?|pepel|led|sneg|pesek", "What is left when wood burns?|ash|ice|snow|sand"],
  [1, "Kaj nam daje ogenj?|toploto in svetlobo|mraz|temo|vodo", "What does fire give us?|heat and light|cold|darkness|water"],
  [1, "Kdo gasi požare?|gasilci|peki|poštarji|kuharji", "Who puts out fires?|firefighters|bakers|postmen|cooks"],
  [1, "Kaj je nevarno?|igra z vžigalicami|branje knjige|risanje|petje", "What is dangerous?|playing with matches|reading|drawing|singing"],
  [1, "Česa pri požaru v stavbi ne uporabljamo?|dvigala|stopnic|izhoda|vrat", "In a building fire, what do we NOT use?|the lift|the stairs|the exit|the door"],
  [2, "Zakaj pihamo v žerjavico?|da dobi več kisika|da se ohladi|da ugasne|da je tiše", "Why do we blow on embers?|to give more oxygen|to cool them|to put them out|to quieten them"],
  [2, "Ogenj pod gasilno odejo ugasne, ker?|ni kisika|je pretemno|je premokro|je pretoplo", "Fire under a fire blanket goes out because?|no oxygen|it's too dark|it's too wet|it's too warm"],
  [2, "Voda gasi ogenj, ker ga?|ohladi|segreje|osuši|osvetli", "Water puts out fire because it?|cools it|heats it|dries it|lights it"],
  [2, "Kaj zgori hitreje?|suh papir|moker papir|kamen|led", "Which burns faster?|dry paper|wet paper|a stone|ice"],
  [2, "Kateri plin nastane pri gorenju?|ogljikov dioksid|kisik|helij|vodik", "Which gas forms when things burn?|carbon dioxide|oxygen|helium|hydrogen"],
  [2, "Pri požaru v prostoru se premikamo?|nizko pri tleh|na prstih|zravnani|s skoki", "In a smoky room we move?|low to the floor|on tiptoe|standing tall|by jumping"],
  [2, "Kaj zazna dimni javljalnik?|dim|vodo|zvok|svetlobo", "What does a smoke alarm detect?|smoke|water|sound|light"],
  [2, "Kam gre vroč dim?|navzgor|navzdol|v tla|nikamor", "Which way does hot smoke go?|up|down|into the ground|nowhere"],
  [2, "Kaj lahko zaneti gozdni požar?|odvržena vžigalica|dež|sneg|rosa", "What can start a forest fire?|a dropped match|rain|snow|dew"],
  [2, "Kaj storimo najprej, če zagori v hiši?|gremo ven|se skrijemo|odpremo omare|iščemo igrače", "What do we do first if the house is on fire?|get out|hide|open cupboards|look for toys"],
  [3, "Ogenj potrebuje gorivo, kisik in?|toploto|vodo|dim|pepel", "Fire needs fuel, oxygen and?|heat|water|smoke|ash"],
  [3, "Gorenje je sprememba, pri kateri?|nastanejo nove snovi|se nič ne spremeni|se snov le stali|snov izgine", "Burning is a change in which?|new substances form|nothing changes|things just melt|matter vanishes"],
  [3, "Zakaj električnih naprav ne gasimo z vodo?|ker voda prevaja tok|ker je voda mrzla|ker voda izhlapi|ker je voda draga", "Why not use water on electrical fires?|water conducts|water is cold|water evaporates|water is costly"],
  [3, "Kateri plin nastane, ko dihamo in ko gori?|ogljikov dioksid|kisik|helij|dušik", "Which gas forms both when we breathe out and burn?|carbon dioxide|oxygen|helium|nitrogen"],
  [3, "Katero gorivo je plinasto?|zemeljski plin|premog|les|nafta", "Which fuel is a gas?|natural gas|coal|wood|crude oil"],
  [3, "Katero gorivo je tekoče?|bencin|premog|les|zemeljski plin", "Which fuel is a liquid?|petrol|coal|wood|natural gas"],
  [3, "Katero gorivo je trdno?|premog|bencin|zemeljski plin|kurilno olje", "Which fuel is a solid?|coal|petrol|natural gas|heating oil"],
  [3, "Kaj gasilni aparat naredi z ognjem?|ga zaduši|ga razpiha|ga segreje|ga razširi", "What does an extinguisher do to fire?|smothers it|fans it|heats it|spreads it"],
  [3, "Kaj ogenj potrebuje iz zraka?|kisik|dušik|prah|vlago", "What does fire need from the air?|oxygen|nitrogen|dust|moisture"],
  [3, "Les zgori, kamen pa ne. Kamen je?|negorljiv|gorljiv|tekoč|živ", "Wood burns but stone doesn't. Stone is?|non-flammable|flammable|liquid|alive"],
  [3, "Zakaj pri požaru zapremo vrata za sabo?|da se ogenj ne širi|da je tišje|da je temneje|zaradi reda", "Why close doors behind us in a fire?|to slow the fire|to keep it quiet|to make it dark|to be tidy"],
]);

// =====================================================================
// ŽIVA BITJA IN OKOLJE
// =====================================================================
const CONIFERS = ["smreka|spruce", "jelka|fir", "bor|pine", "macesen|larch", "tisa|yew"];
const BROADLEAF = ["bukev|beech", "hrast|oak", "lipa|lime", "javor|maple", "breza|birch", "kostanj|chestnut"];
const PLANT_BANK = bank([
  [1, "Kaj počnejo korenine?|vsrkavajo vodo|cvetijo|delajo plodove|lovijo svetlobo", "What do roots do?|take up water|bloom|make fruit|catch light"],
  [1, "Kateri del rastline je kot cev za vodo?|steblo|cvet|seme|plod", "Which plant part is like a water pipe?|stem|flower|seed|fruit"],
  [1, "V listih rastlina izdeluje?|hrano|semena|korenine|cvetni prah", "In its leaves a plant makes?|food|seeds|roots|pollen"],
  [1, "Kaj je v plodu?|semena|korenine|listi|cvetovi", "What is inside a fruit?|seeds|roots|leaves|flowers"],
  [1, "Kaj potrebuje seme, da vzkali?|vodo|sol|mraz|sladkor", "What does a seed need to sprout?|water|salt|frost|sugar"],
  [1, "Gobe so?|glive|rastline|živali|kamnine", "Mushrooms are?|fungi|plants|animals|rocks"],
  [1, "Gobe nimajo?|zelenih listov|celic|trosov|vode", "Mushrooms have no?|green leaves|cells|spores|water"],
  [1, "Kaj storimo z neznanimi gobami?|pustimo jih|poskusimo jih|pojemo jih surove|skuhamo jih", "What do we do with unknown mushrooms?|leave them|taste them|eat them raw|cook them"],
  [1, "Kdo opraši cvet?|čebela|krt|deževnik|polž", "Who pollinates a flower?|a bee|a mole|an earthworm|a snail"],
  [1, "Rastlina se obrača proti?|svetlobi|temi|zidu|tlom", "A plant turns towards?|light|darkness|the wall|the floor"],
  [1, "Kateri del rastline privablja žuželke?|cvet|korenina|steblo|seme", "Which plant part attracts insects?|flower|root|stem|seed"],
  [1, "Drevo vsako leto zraste?|višje in širše|samo navzdol|manjše|ožje", "Each year a tree grows?|taller and wider|only downwards|smaller|thinner"],
  [2, "Kako se razmnožujejo gobe?|s trosi|s semeni|z gomolji|s cvetovi", "How do mushrooms reproduce?|by spores|by seeds|by tubers|by flowers"],
  [2, "Kaj razkraja odpadlo listje?|glive in deževniki|ptice|srne|veter", "What breaks down fallen leaves?|fungi and earthworms|birds|deer|wind"],
  [2, "Plesen na kruhu je?|gliva|rastlina|žival|kamnina", "What is mould on bread?|a fungus|a plant|an animal|a rock"],
  [2, "Kvasovke v testu naredijo, da testo?|vzhaja|zmrzne|se stali|pozeleni", "Yeast in dough makes it?|rise|freeze|melt|turn green"],
  [2, "Kateri del cveta je pisan?|venčni listi|čašni listi|korenine|steblo", "Which part of a flower is colourful?|petals|sepals|roots|stem"],
  [2, "Kako se širijo semena javorja?|z vetrom|z vodo|z mravljami|s polži", "How do maple seeds spread?|by wind|by water|by ants|by snails"],
  [2, "Kako se širijo semena češenj?|s pticami|z vetrom|s polži|s krti", "How do cherry seeds spread?|by birds|by wind|by snails|by moles"],
  [2, "Bodičasti plodovi se širijo?|na krznu živali|po vodi|s sončnimi žarki|pod zemljo", "Burrs spread by?|sticking to fur|floating on water|sunbeams|going underground"],
  [2, "Letnica v deblu pomeni?|eno leto rasti|en mesec|en teden|en dan", "One tree ring stands for?|one year of growth|one month|one week|one day"],
  [3, "Zakaj listavci jeseni odvržejo liste?|da varčujejo z vodo|da so lepši|da jih jedo srne|da se ogrejejo", "Why do broadleaf trees drop leaves?|to save water|to look nicer|to feed deer|to keep warm"],
  [3, "Zakaj listi jeseni porumenijo?|izgine zelenilo|pobarva jih sonce|zmrznejo|dobijo več vode", "Why do leaves turn yellow in autumn?|green pigment fades|the sun paints them|they freeze|they get more water"],
  [3, "Lišaj je sožitje glive in?|alge|mahu|praproti|drevesa", "A lichen is a fungus living with?|an alga|a moss|a fern|a tree"],
  [3, "Kako se razmnožujejo mahovi?|s trosi|s semeni|s cvetovi|s plodovi", "How do mosses reproduce?|by spores|by seeds|by flowers|by fruit"],
  [3, "Kateri iglavec jeseni odvrže iglice?|macesen|smreka|jelka|bor", "Which conifer drops its needles in autumn?|larch|spruce|fir|pine"],
  [3, "Kje nastajajo trosi gob?|pod klobukom|v koreninah|v listih|v cvetovih", "Where are mushroom spores made?|under the cap|in roots|in leaves|in flowers"],
  [3, "Kaj lubje naredi za drevo?|ga ščiti|ga hrani|ga opraši|ga zaliva", "What does bark do for a tree?|protects it|feeds it|pollinates it|waters it"],
  [3, "Najstarejši letni krog je?|v sredini debla|tik pod lubjem|na veji|v korenini", "The oldest tree ring is?|in the centre|just under the bark|in a branch|in a root"],
  [3, "Rastline, ki jih gojimo za hrano, so?|kulturne rastline|plevel|divje rastline|lišaji", "Plants we grow for food are?|crops|weeds|wild plants|lichens"],
  [3, "Nove rastline jagod zrastejo iz?|pritlik|listov|cvetnih listov|trnov", "New strawberry plants also grow from?|runners|leaves|petals|thorns"],
]);
def("t_plants", "nt_ziv", 4, "✾", "Rastline in glive", "Plants and fungi", (t, ctx) => {
  const r = Math.random();
  if (t === 2 && r < 0.35) {
    const con = Math.random() < 0.5, tree = pick(con ? CONIFERS.filter((x) => !/macesen|tisa/.test(x)) /* macesen odvrže iglice, tisa je lahko grm */ : BROADLEAF);
    const nm = tr(ctx, tree);
    return out(L(ctx, `${nm[0].toUpperCase() + nm.slice(1)} je?`, `What kind of tree is ${an(nm)}?`), L(ctx, con ? "iglavec" : "listavec", con ? "conifer" : "broadleaf tree"), L(ctx, "iglavec|listavec|grm|zelišče", "conifer|broadleaf tree|shrub|herb").split("|"));
  }
  if (t === 3 && r < 0.25) {
    const n = R(2, 9) * 10 + R(0, 9) * (Math.random() < 0.5 ? 1 : 0);
    const y = (k) => L(ctx, `${k} ${["let", "leto", "leti", "leta", "leta"][k % 100] || "let"}`, `${k} years`);
    return out(L(ctx, `Na štoru je ${n} letnic. Starost drevesa?`, `A stump has ${n} rings. How old was the tree?`), y(n), [y(n * 2), y(n + 10), y(n - 10), y(n * 12)]);
  }
  return PLANT_BANK(t, ctx);
});

const HERB = ["srna|roe deer", "zajec|hare", "krava|cow", "ovca|sheep", "gosenica|caterpillar", "kobilica|grasshopper"];
const CARN = ["volk|wolf", "ris|lynx", "sova|owl", "kragulj|hawk", "pajek|spider", "ščuka|pike"];
const OMNI = ["medved|bear", "divji prašič|wild boar", "vrana|crow", "človek|human"];
const ANIMAL_BANK = bank([
  [1, "Kaj imajo vsi vretenčarji?|hrbtenico|perje|krila|luske", "What do all vertebrates have?|a backbone|feathers|wings|scales"],
  [1, "Živali brez hrbtenice so?|nevretenčarji|vretenčarji|sesalci|ptiči", "Animals without a backbone are?|invertebrates|vertebrates|mammals|birds"],
  [1, "Kaj ribi pomaga plavati?|plavuti|krila|dlaka|kremplji", "What helps a fish swim?|fins|wings|fur|claws"],
  [1, "Kaj ptici pomaga leteti?|krila in perje|plavuti|dolg rep|luske", "What helps a bird fly?|wings and feathers|fins|a long tail|scales"],
  [1, "Kaj krtu pomaga kopati?|lopataste tace|dolg rep|krila|plavuti", "What helps a mole dig?|spade-like paws|a long tail|wings|fins"],
  [1, "Zakaj ima žaba dolge zadnje noge?|za skakanje|za letenje|za kopanje|za plezanje", "Why does a frog have long back legs?|for jumping|for flying|for digging|for climbing"],
  [1, "Kaj sovi pomaga loviti ponoči?|dober vid in sluh|dolg rep|pisano perje|kratke noge", "What helps an owl hunt at night?|sharp eyes and ears|a long tail|bright feathers|short legs"],
  [1, "Zakaj ima zajec velika ušesa?|da dobro sliši|da leti|da plava|da koplje", "Why does a hare have big ears?|to hear well|to fly|to swim|to dig"],
  [1, "Zakaj je planinski zajec pozimi bel?|za skrivanje v snegu|da se ogreje|ker je star|ker je bolan", "Why is a mountain hare white in winter?|to hide in snow|to keep warm|it's old|it's ill"],
  [1, "Kaj ima riba namesto pljuč?|škrge|krila|perje|kopita", "What does a fish breathe with?|gills|wings|feathers|hooves"],
  [2, "Kaj je plenilec?|lovi druge živali|jé samo travo|živi v vodi|spi pozimi", "What is a predator?|hunts other animals|eats only grass|lives in water|sleeps in winter"],
  [2, "Selivke so ptice, ki?|jeseni odletijo|pozimi spijo|ne letijo|živijo v vodi", "Migrating birds are birds that?|fly away in autumn|sleep in winter|can't fly|live in water"],
  [2, "Katera ptica je selivka?|štorklja|vrabec|sinica|vrana", "Which bird migrates?|stork|sparrow|tit|crow"],
  [2, "Koliko nog imajo žuželke?|6 nog|8 nog|4 noge|2 nogi", "How many legs do insects have?|6 legs|8 legs|4 legs|2 legs"],
  [2, "Koliko nog imajo pajki?|8 nog|6 nog|4 noge|10 nog", "How many legs do spiders have?|8 legs|6 legs|4 legs|10 legs"],
  [2, "Koliko delov ima telo žuželke?|3|2|4|6", "How many body parts does an insect have?|3|2|4|6"],
  [2, "Deževnik rahlja?|zemljo|vodo|zrak|kamne", "An earthworm loosens the?|soil|water|air|stones"],
  [2, "Kdo na vrtu jé listne uši?|pikapolonica|polž|gosenica|kobilica", "Who eats aphids in the garden?|a ladybird|a snail|a caterpillar|a grasshopper"],
  [2, "Zakaj so čebele koristne?|oprašujejo cvetove|pikajo|brenčijo|so rumene", "Why are bees useful?|they pollinate|they sting|they buzz|they're yellow"],
  [3, "Zakaj ima raca plavalno kožico?|za plavanje|za letenje|za kopanje|za plezanje", "Why does a duck have webbed feet?|for swimming|for flying|for digging|for climbing"],
  [3, "Zakaj ima žolna močan kljun?|za kljuvanje lesa|za petje|za plavanje|za lepoto", "Why does a woodpecker have a strong beak?|to peck into wood|to sing|to swim|for looks"],
  [3, "Kaj ščiti želvo?|oklep|perje|krzno|plavuti", "What protects a tortoise?|its shell|feathers|fur|fins"],
  [3, "Kaj ima ris na konicah ušes?|čopke dlake|rogove|perje|luske", "What does a lynx have on its ear tips?|tufts of hair|horns|feathers|scales"],
  [3, "Jelen vsako leto?|odvrže rogovje|dobi krila|izgubi rep|zamenja kožo", "Every year a stag?|sheds its antlers|grows wings|loses its tail|sheds its skin"],
  [3, "Kako jé krava?|prežvekuje|sploh ne žveči|hrano zakoplje|hrano zamrzne", "How does a cow eat?|chews the cud|doesn't chew|buries food|freezes food"],
  [3, "Kdo ima ostre kremplje za lov?|kragulj|kokoš|golob|raca", "Who has sharp talons for hunting?|hawk|hen|pigeon|duck"],
  [3, "Zakaj sova leti tiho?|da je plen ne sliši|ker je majhna|ker je utrujena|ker leti počasi", "Why does an owl fly silently?|so prey can't hear|it's small|it's tired|it flies slowly"],
  [3, "Mravlje, čebele in ose živijo v?|kolonijah|samoti|parih|čredah", "Ants, bees and wasps live in?|colonies|alone|pairs|herds"],
  [3, "Kaj počne čebelja matica?|leže jajčeca|nabira med|straži panj|gradi satje", "What does a queen bee do?|lays eggs|collects nectar|guards the hive|builds comb"],
  [3, "Koliko kril ima čebela?|4|2|6|8", "How many wings does a bee have?|4|2|6|8"],
  [3, "Koliko kril ima muha?|2|4|6|0", "How many wings does a fly have?|2|4|6|0"],
]);
def("t_animals", "nt_ziv", 4, "∷", "Živali in njihove prilagoditve", "Animals and adaptations", (t, ctx) => {
  if (Math.random() < (t === 1 ? 0.35 : 0.3)) {
    const k = t === 1 ? R(0, 1) : R(0, 2);
    const q = [L(ctx, "Kdo je rastlinojedec?", "Which is a herbivore?"), L(ctx, "Kdo je mesojedec?", "Which is a carnivore?"), L(ctx, "Kdo je vsejed?", "Which is an omnivore?")][k];
    const S = [HERB, CARN, OMNI];
    return choose(ctx, q, S[k], S.filter((_, j) => j !== k).flat());
  }
  return ANIMAL_BANK(t, ctx);
});

defBank("t_human", "nt_ziv", 5, "♡", "Človeško telo", "The human body", [
  [1, "Kateri organ je črpalka za kri?|srce|pljuča|jetra|želodec", "Which organ pumps blood?|heart|lungs|liver|stomach"],
  [1, "Kam gre hrana iz požiralnika?|v želodec|v pljuča|v srce|v ledvice", "Where does food go after the gullet?|stomach|lungs|heart|kidneys"],
  [1, "Kateri organ upravlja telo?|možgani|srce|želodec|jetra", "Which organ controls the body?|brain|heart|stomach|liver"],
  [1, "Koleno in komolec sta?|sklepa|mišici|organa|žili", "The knee and the elbow are?|joints|muscles|organs|blood vessels"],
  [1, "Srce, žile in kri so?|obtočila|prebavila|dihala|čutila", "Heart, blood vessels and blood are the?|circulatory system|digestive system|respiratory system|sense organs"],
  [1, "Nos, sapnik in pljuča so?|dihala|obtočila|prebavila|izločala", "Nose, windpipe and lungs are the?|respiratory system|circulatory system|digestive system|urinary system"],
  [1, "Želodec in črevesje sta del?|prebavil|dihal|obtočil|okostja", "Stomach and intestines belong to the?|digestive system|respiratory system|circulatory system|skeleton"],
  [1, "Ledvice in sečni mehur so?|izločala|dihala|prebavila|čutila", "Kidneys and bladder are the?|urinary system|respiratory system|digestive system|sense organs"],
  [1, "Možgani, hrbtenjača in živci so?|živčevje|okostje|prebavila|dihala", "Brain, spinal cord and nerves are the?|nervous system|skeleton|digestive system|respiratory system"],
  [1, "Po čem teče kri?|po žilah|po živcih|po kosteh|po kitah", "What does blood flow through?|blood vessels|nerves|bones|tendons"],
  [1, "Kaj prenaša kisik po telesu?|kri|slina|seč|znoj", "What carries oxygen around the body?|blood|saliva|urine|sweat"],
  [1, "Pri teku se dihanje?|pospeši|upočasni|ustavi|ne spremeni", "When we run, breathing?|speeds up|slows down|stops|doesn't change"],
  [2, "Kaj čutimo kot utrip na zapestju?|bitje srca|dihanje|prebavo|rast", "A pulse at the wrist shows?|heartbeats|breathing|digestion|growth"],
  [2, "Kaj počnejo mišice?|premikajo kosti|prebavljajo hrano|čistijo kri|vidijo", "What do muscles do?|move bones|digest food|clean blood|see"],
  [2, "Kaj v želodcu razgradi hrano?|želodčni sok|kri|seč|zrak", "What breaks down food in the stomach?|stomach juices|blood|urine|air"],
  [2, "Kje se začne prebava?|v ustih|v želodcu|v črevesju|v jetrih", "Where does digestion start?|in the mouth|in the stomach|in the intestine|in the liver"],
  [2, "Iz česa je hrbtenica?|iz vretenc|iz reber|iz mišic|iz las", "What is the spine made of?|vertebrae|ribs|muscles|hair"],
  [2, "Ob vdihu se prsni koš?|razširi|skrči|ne premakne|zloži", "When we breathe in, the chest?|expands|shrinks|doesn't move|folds up"],
  [2, "Za zdrave kosti potrebujemo?|kalcij|sladkor|sol|maščobe", "For healthy bones we need?|calcium|sugar|salt|fat"],
  [2, "Koliko kosti ima odrasel človek?|206|20|2000|50", "How many bones does an adult have?|206|20|2000|50"],
  [2, "Srce otroka v mirovanju utripne na minuto približno?|80-krat|8-krat|800-krat|8000-krat", "A resting child's heart beats per minute about?|80 times|8 times|800 times|8000 times"],
  [2, "Kateri organ izloča znoj?|koža|srce|jetra|želodec", "Which organ gives off sweat?|skin|heart|liver|stomach"],
  [3, "Kje nastaja kri?|v kostnem mozgu|v srcu|v pljučih|v želodcu", "Where is blood made?|in bone marrow|in the heart|in the lungs|in the stomach"],
  [3, "Najdaljša kost v telesu je?|stegnenica|lobanja|rebro|ključnica", "The longest bone in the body is the?|thigh bone|skull|rib|collarbone"],
  [3, "Najmanjša kost je v?|ušesu|prstu|nosu|kolenu", "The smallest bone is in the?|ear|finger|nose|knee"],
  [3, "Največji organ telesa je?|koža|jetra|možgani|pljuča", "The body's largest organ is the?|skin|liver|brain|lungs"],
  [3, "Največji notranji organ je?|jetra|srce|želodec|ledvice", "The largest internal organ is the?|liver|heart|stomach|kidneys"],
  [3, "Sporočila čutil potujejo po živcih v?|možgane|želodec|srce|kosti", "Nerves carry messages from the senses to the?|brain|stomach|heart|bones"],
  [3, "Kaj ob rani strdi kri?|krvne ploščice|rdeče krvničke|bele krvničke|živci", "What makes blood clot at a cut?|platelets|red blood cells|white blood cells|nerves"],
  [3, "Kaj se bori proti bacilom?|bele krvničke|rdeče krvničke|kosti|lasje", "What fights germs in the body?|white blood cells|red blood cells|bones|hair"],
  [3, "Zakaj po teku hitreje dihamo?|mišice rabijo kisik|pljuča so mokra|srce počiva|zrak je težak", "Why do we breathe fast after running?|muscles need oxygen|lungs are wet|the heart rests|air is heavy"],
  [3, "Hrbtenjača poteka v?|hrbtenici|lobanji|rebrih|medenici", "The spinal cord runs inside the?|spine|skull|ribs|pelvis"],
  [3, "Kaj debelo črevo vsrka iz ostankov hrane?|vodo|kisik|kri|kosti", "What does the large intestine take back?|water|oxygen|blood|bones"],
  [3, "Kaj povezuje mišice s kostmi?|kite|živci|žile|nohti", "What joins muscles to bones?|tendons|nerves|blood vessels|nails"],
]);

// Življenjska okolja: le vrste, ki so izrazito vezane na eno okolje.
const HAB = {
  gozd: ["veverica|squirrel", "žolna|woodpecker", "jurček|porcini", "smreka|spruce", "bukev|beech", "medved|bear", "šoja|jay", "praprot|fern"],
  travnik: ["kobilica|grasshopper", "regrat|dandelion", "marjetica|daisy", "murn|cricket", "detelja|clover", "poljski škrjanec|skylark"],
  voda: ["postrv|trout", "ščuka|pike", "lokvanj|water lily", "raca|duck", "vidra|otter", "čaplja|heron"],
};
const HAB_Q = { gozd: "Kaj živi v gozdu?|What lives in a forest?", travnik: "Kaj živi na travniku?|What lives in a meadow?", voda: "Kaj živi v reki ali ribniku?|What lives in a river or pond?" };
const HAB_BANK = bank([
  [1, "Plasti gozda: zeliščna, grmovna in?|drevesna|travniška|vodna|morska", "Forest layers: herb, shrub and?|tree|meadow|water|sea"],
  [1, "Kaj v gozdu ni živo?|kamen|mah|lišaj|gliva", "What in a forest is not alive?|a rock|moss|lichen|a fungus"],
  [1, "Zakaj je gozd pomemben?|daje kisik in les|daje nafto|dela potrese|onesnažuje zrak", "Why are forests important?|oxygen and wood|they give oil|they cause quakes|they pollute air"],
  [1, "Kaj na travniku pokosimo za seno?|travo|grmovje|drevesa|kamne", "What do we mow in a meadow for hay?|grass|bushes|trees|stones"],
  [1, "Kje živi žaba?|ob ribniku|v puščavi|na strehi|v mravljišču", "Where does a frog live?|by a pond|in a desert|on a roof|in an anthill"],
  [1, "Kaj v gozdu zraste najvišje?|drevesa|grmi|zelišča|mah", "What grows tallest in a forest?|trees|bushes|herbs|moss"],
  [1, "Česa ne puščamo v gozdu?|smeti|gob|mahu|praproti", "What must we never leave in a forest?|litter|mushrooms|moss|ferns"],
  [1, "Kje rastejo lokvanji?|v ribniku|na travniku|v gozdu|na skali", "Where do water lilies grow?|in a pond|in a meadow|in a forest|on a rock"],
  [2, "Kaj je v gozdu prepovedano?|kurjenje ognja|hoja po poteh|opazovanje ptic|tiho govorjenje", "What is forbidden in a forest?|lighting fires|walking on paths|birdwatching|talking quietly"],
  [2, "Kdo na travniku opraši cvetove?|čebele in čmrlji|krti|polži|deževniki", "Who pollinates meadow flowers?|bees and bumblebees|moles|snails|earthworms"],
  [2, "Kaj naredi krt na travniku?|krtine|gnezda|mreže|panje", "What does a mole make in a meadow?|molehills|nests|webs|hives"],
  [2, "Ribnik je?|majhna stoječa voda|velika reka|morje|izvir", "A pond is?|a small still water|a big river|a sea|a spring"],
  [2, "Kje ima lokvanj liste?|na gladini vode|pod zemljo|na drevesu|v pesku", "Where are water lily leaves?|floating on water|underground|in a tree|in sand"],
  [2, "Kje živi postrv?|v čistih potokih|v slani vodi|v blatu|v gozdu", "Where does a trout live?|in clean streams|in salt water|in mud|in a forest"],
  [2, "Ribe dihajo kisik, ki je?|raztopljen v vodi|v oblakih|v pesku|v soli", "Fish breathe oxygen that is?|dissolved in water|in clouds|in sand|in salt"],
  [2, "Katero drevo rado raste ob reki?|vrba|oljka|kaktus|limona", "Which tree likes to grow by rivers?|willow|olive|cactus|lemon"],
  [2, "Kdo v gozdu razkraja odmrle liste?|glive in bakterije|srne|sove|veverice", "Who breaks down dead leaves in a forest?|fungi and bacteria|deer|owls|squirrels"],
  [3, "Kje je v gozdu najmanj svetlobe?|pri tleh|v krošnjah|nad drevesi|na jasi", "Where is a forest darkest?|on the ground|in the treetops|above the trees|in a clearing"],
  [3, "Odmrlo deblo v gozdu je?|dom za žuželke|smeti|strupeno|nekoristno", "A dead log in a forest is?|a home for insects|rubbish|poisonous|useless"],
  [3, "Zakaj je na travniku veliko rastlin?|ima veliko svetlobe|nima vode|je temen|nima tal", "Why do many plants grow in a meadow?|lots of light|no water|it's dark|no soil"],
  [3, "Travnik, ki ga ne kosimo?|se zaraste|postane jezero|postane puščava|ostane enak", "A meadow that is never mown?|gets overgrown|becomes a lake|becomes a desert|stays the same"],
  [3, "Mokrišča so pomembna, ker?|zadržujejo vodo|so suha|so slana|nimajo živali", "Wetlands are important because?|they store water|they are dry|they are salty|they have no animals"],
  [3, "Morje je slano, reka pa?|sladka|slana|zmrznjena|kisla", "The sea is salty, a river is?|fresh|salty|frozen|sour"],
  [3, "Koliko Slovenije pokriva gozd?|več kot polovico|desetino|četrtino|vso", "How much of Slovenia is forest?|more than half|a tenth|a quarter|all of it"],
  [3, "Jasa je?|travnik sredi gozda|gozdna reka|vrh drevesa|jama", "A glade is?|a forest clearing|a forest river|a treetop|a cave"],
  [3, "Katera ptica lovi ribe ob reki?|vodomec|žolna|sinica|vrabec", "Which bird catches fish by rivers?|kingfisher|woodpecker|tit|sparrow"],
  [3, "Kaj gradi bober?|jezove|gnezda v krošnjah|mravljišča|panje", "What does a beaver build?|dams|treetop nests|anthills|hives"],
]);
def("t_habitat", "nt_ziv", 5, "∆", "Gozd, travnik in voda", "Forest, meadow and water", (t, ctx) => {
  if (Math.random() < (t === 1 ? 0.5 : 0.3)) {
    const k = pick(Object.keys(HAB));
    return choose(ctx, tr(ctx, HAB_Q[k]), HAB[k], Object.keys(HAB).filter((x) => x !== k).flatMap((x) => HAB[x]));
  }
  return HAB_BANK(t, ctx);
});

// Prehranjevalne verige: členi "imenovalnik/tožilnik|angleško"; vsak člen poje prejšnjega.
const CH = [
  ["trava/travo|grass", "jelen/jelena|red deer", "volk/volka|wolf"],
  ["semena/semena|seeds", "poljska miš/poljsko miš|field mouse", "kanja/kanjo|buzzard"],
  ["trava/travo|grass", "srna/srno|roe deer", "ris/risa|lynx"],
  ["alge/alge|algae", "paglavec/paglavca|tadpole", "postrv/postrv|trout", "vidra/vidro|otter"],
  ["cvet/cvet|flower", "metulj/metulja|butterfly", "pajek/pajka|spider", "sinica/sinico|tit"],
  ["trava/travo|grass", "kobilica/kobilico|grasshopper", "kuščar/kuščarja|lizard", "kanja/kanjo|buzzard"],
  ["bukov žir/bukov žir|beechnuts", "polh/polha|dormouse", "sova/sovo|owl"],
  ["detelja/deteljo|clover", "zajec/zajca|hare", "kragulj/kragulja|goshawk"],
  ["listje/listje|leaves", "polž/polža|snail", "jež/ježa|hedgehog"],
];
const CHAIN_BANK = bank([
  [3, "Če izginejo srne, ima ris?|manj hrane|več hrane|enako hrane|preveč hrane", "If roe deer vanish, the lynx has?|less food|more food|the same food|too much food"],
  [3, "Če izginejo sove, bo miši?|več|manj|enako|nič", "If owls disappear, there will be?|more mice|fewer mice|the same mice|no mice"],
  [3, "Prvi člen vsake verige je?|rastlina|plenilec|razkrojevalec|vsejed", "The first link in every food chain is?|a plant|a predator|a decomposer|an omnivore"],
  [3, "Kaj rastline potrebujejo za izdelavo hrane?|sončno svetlobo|meso|druge rastline|temo", "To make food, plants need?|sunlight|meat|other plants|darkness"],
  [3, "Kdo ostanke mrtvih bitij spremeni v prst?|razkrojevalci|plenilci|rastlinojedci|proizvajalci", "Who turns dead remains into soil?|decomposers|predators|herbivores|producers"],
  [3, "Žival, ki jo drugi lovijo, je?|plen|plenilec|proizvajalec|razkrojevalec", "An animal that is hunted is?|prey|a predator|a producer|a decomposer"],
]);
def("t_chain", "nt_ziv", 5, "→", "Prehranjevalne verige", "Food chains", (t, ctx) => {
  if (t === 3 && Math.random() < 0.35) return CHAIN_BANK(3, ctx);
  const c = pick(CH), sl = ctx.lang === "sl";
  const nom = (s) => (sl ? s.split("|")[0].split("/")[0] : s.split("|")[1]);
  const acc = (s) => s.split("|")[0].split("/")[1];
  const ch = c.map(nom), last = ch.length - 1, s = ch.join(" → ");
  const others = (i) => ch.filter((_, j) => j !== i);
  const plants = [...new Set(CH.map((x) => nom(x[0])))].filter((p) => !ch.includes(p));
  const k = t === 1 ? R(0, 2) : t === 2 ? R(0, 4) : R(2, 5);
  if (k === 0) return out(`${s}: ${L(ctx, "proizvajalec?", "producer?")}`, ch[0], [...others(0), L(ctx, "Sonce", "the Sun")]);
  if (k === 1) return out(`${s}: ${L(ctx, "vrhnji plenilec?", "top predator?")}`, ch[last], [...others(last), L(ctx, "Sonce", "the Sun")]);
  if (k === 2) return out(`${s}: ${L(ctx, "rastlinojedec?", "herbivore?")}`, ch[1], [...others(1), pick(plants)]);
  if (k === 3) {
    // kdo jé izbrani člen
    const i = R(0, last - 1);
    let q = sl ? `${s}: kdo jé ${acc(c[i])}?` : `${s}: who eats the ${ch[i]}?`;
    if (q.length > 60) q = `${s}: ${ch[i]} → ?`;
    // višji členi verige bi lahko jedli tudi ta člen, zato napačni le nižji členi in rastline
    return out(q, ch[i + 1], [...ch.slice(0, i + 1), ...shuffle(plants).slice(0, 3)]);
  }
  if (k === 4) {
    // manjkajoči vmesni člen: napačni so rastline in člani verige, ki tja ne sodijo
    const i = R(1, last - 1);
    return out(ch.map((x, j) => (j === i ? "?" : x)).join(" → "), ch[i], [...others(i), ...shuffle(plants).slice(0, 2)]);
  }
  // kdo je plen pri puščici med živalima
  const i = R(1, last - 1);
  return out(`${ch[i]} → ${ch[i + 1]}: ${L(ctx, "kdo je plen?", "which is the prey?")}`, ch[i], [...others(i), pick(plants)]);
});

// =====================================================================
// SILE, ENERGIJA IN POJAVI
// =====================================================================
defBank("t_force", "nt_sil", 4, "F", "Sile in gibanje", "Forces and motion", [
  [1, "Ko odpremo predal, ga?|povlečemo|potisnemo|dvignemo|vržemo", "When we open a drawer, we?|pull it|push it|lift it|throw it"],
  [1, "Ko zapremo predal, ga?|potisnemo|povlečemo|dvignemo|vržemo", "When we close a drawer, we?|push it|pull it|lift it|throw it"],
  [1, "Ko brcnemo žogo, jo?|potisnemo|povlečemo|stisnemo|ujamemo", "When we kick a ball, we?|push it|pull it|squeeze it|catch it"],
  [1, "Zakaj žoga pade na tla?|Zemlja jo privlači|ker je okrogla|ker je lahka|ker piha veter", "Why does a ball fall to the ground?|Earth pulls it down|it's round|it's light|the wind blows"],
  [1, "Kaj ustavi kotalečo se žogo?|trenje|svetloba|toplota|zvok", "What stops a rolling ball?|friction|light|heat|sound"],
  [1, "Po čem najlaže drsimo?|po ledu|po pesku|po travi|po preprogi", "What is easiest to slide on?|ice|sand|grass|carpet"],
  [1, "Zakaj pozimi na ceste trosijo pesek?|da ne drsi|da se led stopi|za lepoto|da je toplo", "Why is grit put on icy roads?|to stop slipping|to melt the ice|to look nice|to keep warm"],
  [1, "Sila lahko predmetu spremeni?|obliko ali gibanje|barvo|vonj|ime", "A force can change an object's?|shape or motion|colour|smell|name"],
  [1, "Kaj potrebujemo, da se voziček premakne?|silo|svetlobo|zvok|temo", "What do we need to move a trolley?|a force|light|sound|darkness"],
  [1, "Katera naprava meri silo?|silomer|termometer|ura|ravnilo", "Which device measures force?|a force meter|a thermometer|a clock|a ruler"],
  [1, "Enota za silo je?|N|kg|m|°C", "The unit of force is?|N|kg|m|°C"],
  [1, "Kam deluje teža?|navzdol|navzgor|vstran|v krogu", "Which way does weight pull?|down|up|sideways|in a circle"],
  [2, "Kaj zmanjša trenje?|olje|pesek|lepilo|hrapava podlaga", "What reduces friction?|oil|sand|glue|a rough surface"],
  [2, "Zakaj imajo podplati vzorec?|da ne zdrsnemo|za lepoto|da so lažji|da so tišji", "Why do shoe soles have a pattern?|so we don't slip|for looks|to be lighter|to be quieter"],
  [2, "Kolesca na kovčku?|zmanjšajo trenje|povečajo trenje|ga otežijo|delajo hrup", "Wheels on a suitcase?|reduce friction|increase friction|make it heavier|make noise"],
  [2, "Padalo pada počasi zaradi?|zračnega upora|teže|magneta|sonca", "A parachute falls slowly because of?|air resistance|weight|a magnet|the Sun"],
  [2, "Kako gre kolo hitreje?|močneje poganjamo|zaviramo|se ustavimo|nehamo poganjati", "To make a bike go faster we?|pedal harder|brake|stop|stop pedalling"],
  [2, "Zavore ustavijo kolo zaradi?|trenja|magneta|svetlobe|vetra", "Brakes stop a bike because of?|friction|a magnet|light|wind"],
  [2, "Težji predmet na silomeru pokaže?|večjo silo|manjšo silo|nič|enako silo", "A heavier object on a force meter shows?|a bigger force|a smaller force|zero|the same force"],
  [2, "Vzmet silomera se pod utežjo?|raztegne|skrči|zlomi|stopi", "Under a weight, the force meter spring?|stretches|shrinks|snaps|melts"],
  [2, "Kdo se giblje najhitreje?|letalo|kolesar|polž|pešec", "Which moves fastest?|a plane|a cyclist|a snail|a walker"],
  [2, "V čem povemo hitrost avta?|km/h|kg|°C|L", "Car speed is given in?|km/h|kg|°C|L"],
  [3, "Na Luni bi bila tvoja teža?|manjša|večja|enaka|enaka nič", "On the Moon your weight would be?|smaller|bigger|the same|zero"],
  [3, "Voda potiska plavajočo ladjo?|navzgor|navzdol|vstran|nikamor", "Water pushes a floating boat?|upwards|downwards|sideways|nowhere"],
  [3, "Kolo po klancu navzdol?|pospešuje|se samo ustavi|gre nazaj|stoji", "A bike rolling downhill?|speeds up|stops by itself|goes backwards|stays still"],
  [3, "Zakaj se v avtu pripnemo?|da nas pas zadrži|za lepoto|da je toplo|da je mehko", "Why do we wear a seat belt?|it holds us in place|for looks|to keep warm|to be comfy"],
  [3, "Enako močni sili v nasprotnih smereh sta?|v ravnovesju|podvojeni|neenaki|izginili", "Equal forces in opposite directions are?|balanced|doubled|unequal|gone"],
  [3, "Vlečenje vrvi: obe ekipi enako močni. Vrv?|miruje|gre levo|gre desno|se strga", "Tug of war, teams equally strong. The rope?|stays put|moves left|moves right|snaps"],
  [3, "Kje se kolo najtežje ustavi?|na ledu|na asfaltu|na travi|na pesku", "Where is it hardest to stop a bike?|on ice|on tarmac|on grass|on gravel"],
  [3, "Katera sila deluje na daljavo?|teža|trenje|potisk roke|vlečenje vrvi", "Which force acts at a distance?|gravity|friction|a hand push|a rope pull"],
  [3, "Silomer kaže 10 N. Kaj meri?|silo|maso|dolžino|čas", "A force meter shows 10 N. What is it?|a force|a mass|a length|a time"],
  [3, "Kaj smučarja vleče navzdol po bregu?|teža|trenje|veter|sneg", "What pulls a skier down a slope?|gravity|friction|wind|snow"],
]);

const TRANSP = ["okensko steklo|window glass", "čista voda|clear water", "zrak|air", "celofan|cellophane"];
const TRANSL = ["peki papir|baking paper", "mlečno steklo|frosted glass", "tanek papir|tissue paper", "tanka zavesa|thin curtain"];
const OPAQUE = ["les|wood", "karton|cardboard", "kovina|metal", "kamen|stone", "opeka|brick"];
const LIGHT4_BANK = bank([
  [1, "Kaj odbije skoraj vso svetlobo?|ogledalo|črn žamet|les|karton", "What reflects almost all light?|a mirror|black velvet|wood|cardboard"],
  [1, "Senca je mesto, kamor?|ne pride svetloba|pride svetloba|pada dež|piha veter", "A shadow is a place where?|light can't reach|light shines|rain falls|wind blows"],
  [1, "Kaj je naravni vir svetlobe?|Sonce|žarnica|sveča|svetilka", "Which is a natural light source?|the Sun|a light bulb|a candle|a torch"],
  [1, "Kaj je umetni vir svetlobe?|žarnica|Sonce|strela|kresnica", "Which is an artificial light source?|a light bulb|the Sun|lightning|a firefly"],
  [1, "Kaj potrebujemo, da vidimo?|svetlobo|temo|zvok|veter", "What do we need in order to see?|light|darkness|sound|wind"],
  [1, "Kaj odbije svetlobo nazaj k avtu?|odsevnik|črna bunda|temna kapa|les", "What sends car light back?|a reflector|a black coat|a dark hat|wood"],
  [1, "Kako potuje svetloba?|naravnost|v krogu|cik-cak|samo navzgor", "How does light travel?|in straight lines|in circles|zigzag|only upwards"],
  [1, "Zakaj ne gledamo naravnost v Sonce?|ker škoduje očem|ker je hladno|ker je majhno|ker je daleč", "Why not look straight at the Sun?|it harms the eyes|it's cold|it's small|it's far away"],
  [2, "Žlica v kozarcu vode je videti?|prelomljena|stopljena|nevidna|rdeča", "A spoon in a glass of water looks?|bent|melted|invisible|red"],
  [2, "Lupa predmete?|poveča|pomanjša|obarva|skrije", "A magnifying glass makes things look?|bigger|smaller|coloured|hidden"],
  [2, "Bela svetloba je mešanica?|vseh barv|ene barve|črne in bele|samo modre", "White light is a mix of?|all colours|one colour|black and white|only blue"],
  [2, "Kaj se s svetlobo zgodi na ogledalu?|odbije se|ustavi se|izgine|stopi se", "What happens to light at a mirror?|it reflects|it stops|it vanishes|it melts"],
  [2, "Kaj na ovinku pokaže prihajajoči avto?|cestno ogledalo|semafor|znak STOP|prehod za pešce", "What shows a car coming round a bend?|a road mirror|a traffic light|a STOP sign|a crossing"],
  [2, "Črna majica na soncu?|se bolj segreje|se manj segreje|ostane mrzla|zasveti", "A black T-shirt in the sun?|warms up more|warms up less|stays cold|glows"],
  [2, "Bele površine svetlobo?|odbijajo|vpijajo|ustvarjajo|ugašajo", "What do white surfaces do to light?|reflect it|absorb it|create it|switch it off"],
  [2, "V očesu je?|leča|žarnica|magnet|baterija", "What is inside the eye?|a lens|a light bulb|a magnet|a battery"],
  [2, "Senca je daljša, ko je svetilo?|nizko|visoko|ugasnjeno|točno nad nami", "A shadow is longer when the light is?|low|high|off|right overhead"],
  [2, "Mavrica nastane, ko se svetloba?|razkloni v barve|odbije od Lune|stopi|ugasne", "A rainbow forms when light?|splits into colours|bounces off the Moon|melts|goes out"],
  [3, "Kaj je v periskopu?|dve ogledali|baterija|magnet|zvočnik", "What is inside a periscope?|two mirrors|a battery|a magnet|a speaker"],
  [3, "Prizma belo svetlobo razkloni v?|mavrične barve|črno barvo|toploto|zvok", "A prism splits white light into?|rainbow colours|black|heat|sound"],
  [3, "Zakaj vidimo predmete?|odbijajo svetlobo|oddajajo zvok|so topli|so blizu", "Why can we see objects?|they reflect light|they make sound|they are warm|they are near"],
  [3, "Rdeče jabolko je rdeče, ker?|odbija rdečo luč|vpija rdečo luč|samo sveti|je toplo", "A red apple looks red because it?|reflects red light|absorbs red light|glows|is warm"],
  [3, "Kje v očesu nastane slika?|na mrežnici|na zenici|na trepalnicah|na obrvi", "Where in the eye is the image formed?|on the retina|on the pupil|on the eyelashes|on the eyebrow"],
  [3, "Kaj ima daljnogled?|leče|baterije|magnete|zvočnike", "What is inside binoculars?|lenses|batteries|magnets|speakers"],
  [3, "Skozi mlečno steklo vidimo?|zamegljeno|zelo jasno|nič|samo barve", "Through frosted glass we see?|blurry shapes|very clearly|nothing|only colours"],
  [3, "Pri sončnem mrku je Luna med?|Soncem in Zemljo|Zemljo in Marsom|dvema zvezdama|Soncem in Marsom", "In a solar eclipse the Moon is between?|the Sun and Earth|Earth and Mars|two stars|the Sun and Mars"],
  [3, "Zemljina senca na Luni je?|Lunin mrk|sončni mrk|mavrica|komet", "Earth's shadow on the Moon is called?|a lunar eclipse|a solar eclipse|a rainbow|a comet"],
  [3, "Laserskega žarka nikoli ne usmerimo v?|oči|steno|ogledalo|tla", "Never point a laser at?|eyes|a wall|a mirror|the floor"],
]);
def("t_light", "nt_sil", 4, "◑", "Svetloba in senca", "Light and shadow", (t, ctx) => {
  if (Math.random() < (t === 1 ? 0.45 : 0.25)) {
    const k = R(0, 2), S = [TRANSP, TRANSL, OPAQUE];
    const q = [L(ctx, "Kaj je prozorno?", "Which is transparent?"), L(ctx, "Kaj je prosojno?", "Which is translucent?"), L(ctx, "Kaj je neprozorno?", "Which is opaque?")][k];
    return choose(ctx, q, S[k], S.filter((_, j) => j !== k).flat());
  }
  return LIGHT4_BANK(t, ctx);
});

const SOUND_BANK = bank([
  [1, "Ko udarimo na boben, njegova koža?|niha|se stopi|zmrzne|zasveti", "When we hit a drum, its skin?|vibrates|melts|freezes|lights up"],
  [1, "Katero glasbilo ima strune?|kitara|boben|flavta|triangel", "Which instrument has strings?|guitar|drum|flute|triangle"],
  [1, "Katero glasbilo je pihalo?|flavta|kitara|boben|violina", "Which is a wind instrument?|flute|guitar|drum|violin"],
  [1, "Katero glasbilo je tolkalo?|boben|flavta|kitara|violina", "Which is a percussion instrument?|drum|flute|guitar|violin"],
  [1, "Kako rečemo zelo tihemu govorjenju?|šepet|krik|vpitje|petje", "What is very quiet speaking called?|a whisper|a shout|yelling|singing"],
  [1, "Kje pogosto slišimo odmev?|v gorah|pod odejo|v omari s perilom|v blazini", "Where do we often hear an echo?|in the mountains|under a duvet|in a wardrobe|in a pillow"],
  [1, "Kaj je najglasnejše?|reaktivno letalo|šepet|šumenje listja|tiktakanje ure", "Which is the loudest?|a jet plane|a whisper|rustling leaves|a ticking clock"],
  [1, "Kaj je najtišje?|šepet|sirena|grom|bobnanje", "Which is the quietest?|a whisper|a siren|thunder|drumming"],
  [1, "Skozi kaj potuje zvok?|zrak, vodo in les|samo zrak|samo vodo|nič", "What can sound travel through?|air, water and wood|only air|only water|nothing"],
  [1, "Kaj zmanjša hrup v sobi?|zavese in preproge|goli zidovi|odprto okno|kovinske plošče", "What makes a room quieter?|curtains and rugs|bare walls|an open window|metal sheets"],
  [1, "Kateri zvok je najvišji?|čivkanje ptice|renčanje medveda|bobnenje groma|udarec bobna", "Which sound is the highest?|a bird chirping|a bear growling|rumbling thunder|a drum beat"],
  [1, "Prevelik hrup lahko poškoduje?|sluh|vid|okus|vonj", "Too much noise can damage our?|hearing|sight|taste|smell"],
  [2, "Struno bolj napnemo. Ton je?|višji|nižji|tišji|izgine", "We tighten a string. The note is?|higher|lower|quieter|gone"],
  [2, "Daljša struna da?|nižji ton|višji ton|glasnejši ton|nobenega tona", "What note does a longer string give?|a lower note|a higher note|a louder note|no note"],
  [2, "Uho na mizi: trkanje po mizi slišimo?|bolje|slabše|sploh ne|enako", "Ear on a table, someone taps it. We hear?|better|worse|nothing|the same"],
  [2, "Kaj vpliva na glasnost bobna?|kako močno udarimo|barva bobna|ime bobna|dan v tednu", "What changes how loud a drum is?|how hard we hit|the drum's colour|its name|the day"],
  [2, "V vesolju brez radia astronavti?|se ne slišijo|se slišijo glasneje|se slišijo enako|vpijejo", "In space without radios, astronauts?|hear nothing|hear louder|hear the same|hear echoes"],
  [2, "V steklenico pihamo. Več vode v njej da?|višji ton|nižji ton|tišino|enak ton", "Blowing over a bottle: more water gives?|a higher note|a lower note|silence|the same note"],
  [2, "Kozarci z različno količino vode zvenijo?|različno|enako|sploh ne|kot boben", "Glasses with different water levels ring?|differently|the same|not at all|like a drum"],
  [2, "Kaj je hrup?|moteč zvok|tišina|svetloba|prijetna glasba", "What is noise?|unwanted sound|silence|light|lovely music"],
  [3, "Odmev slišimo, ko se zvok?|odbije|ustavi|segreje|zasveti", "We hear an echo when sound?|bounces back|stops|warms up|lights up"],
  [3, "Kaj v ušesu zaniha ob zvoku?|bobnič|nohti|zob|jezik", "What vibrates in the ear when sound arrives?|the eardrum|a nail|a tooth|the tongue"],
  [3, "Zvok, previsok za naša ušesa, je?|ultrazvok|infrazvok|odmev|šepet", "Sound too high for us to hear is?|ultrasound|infrasound|an echo|a whisper"],
  [3, "Ob avtocesti postavijo?|protihrupne ograje|semaforje|bazene|igrišča", "Along motorways they build?|noise barriers|traffic lights|pools|playgrounds"],
  [3, "Telefon zvoni v posodi brez zraka. Ga slišimo?|ne|da, glasneje|da, enako|da, višje", "A phone rings in a jar with no air. Do we hear it?|no|yes, louder|yes, the same|yes, higher"],
  [3, "Zvok je hitrejši v?|vodi kot v zraku|zraku kot v vodi|vakuumu|nikjer", "Sound travels faster in?|water than air|air than water|a vacuum|nowhere"],
]);
def("t_sound", "nt_sil", 5, "♪", "Zvok", "Sound", (t, ctx) => {
  if (t === 3 && Math.random() < 0.35) {
    const km = R(1, 5), s = km * 3;
    const sek = s < 5 ? "sekunde" : "sekund";
    return out(L(ctx, `Blisk, ${s} ${sek} pozneje grom. Kako daleč je nevihta?`, `Lightning, then thunder ${s} s later. How far is the storm?`), L(ctx, `približno ${km} km`, `about ${km} km`),
      [s, km * 10, km + 3, s * 3].filter((x) => x !== km).map((x) => L(ctx, `približno ${x} km`, `about ${x} km`)));
  }
  return SOUND_BANK(t, ctx);
});

const COND = ["bakrena žica|copper wire", "železen žebelj|iron nail", "aluminijasta folija|aluminium foil", "sponka za papir|paper clip", "kovanec|coin", "ključ|key"];
const INSUL = ["plastika|plastic", "guma|rubber", "suh les|dry wood", "steklo|glass", "papir|paper", "volna|wool", "porcelan|porcelain"];
const ELEC_BANK = bank([
  [1, "Kaj je v krogu vir električne energije?|baterija|žarnica|stikalo|žica", "What is the power source in a circuit?|battery|bulb|switch|wire"],
  [1, "Kaj krog odpre in zapre?|stikalo|baterija|žarnica|žica", "What opens and closes a circuit?|switch|battery|bulb|wire"],
  [1, "Kaj v krogu sveti?|žarnica|baterija|stikalo|žica", "What lights up in a circuit?|bulb|battery|switch|wire"],
  [1, "Žarnica sveti, ko je krog?|sklenjen|odprt|prekinjen|prazen", "A bulb lights when the circuit is?|closed|open|broken|empty"],
  [1, "Smemo vtikač prijeti z mokrimi rokami?|ne|da|samo poleti|samo zjutraj", "May we touch a plug with wet hands?|no|yes|only in summer|only in the morning"],
  [1, "Kaj vtaknemo v vtičnico?|vtikač naprave|žebelj|sponko|prst", "What do we put into a socket?|an appliance plug|a nail|a paper clip|a finger"],
  [1, "Katera naprava deluje na elektriko?|hladilnik|kolo|metla|svinčnik", "Which runs on electricity?|a fridge|a bicycle|a broom|a pencil"],
  [1, "Kaj deluje na baterije?|žepna svetilka|sveča|metla|svinčnik", "What runs on batteries?|a torch|a candle|a broom|a pencil"],
  [1, "Kam odložimo izrabljene baterije?|v zbiralnik baterij|med smeti|v reko|v gozd", "Where do used batteries go?|a battery bin|normal rubbish|a river|a forest"],
  [1, "Vidimo pretrgan kabel. Kaj storimo?|povemo odraslemu|ga primemo|ga popravimo|ga nesemo domov", "We see a broken cable. We?|tell an adult|touch it|fix it|take it home"],
  [2, "Zakaj so žice oblečene v plastiko?|plastika je izolator|plastika prevaja|za lepšo barvo|da so težje", "Why are wires covered in plastic?|plastic insulates|plastic conducts|for colour|to be heavier"],
  [2, "Kaj se zgodi, ko odpremo stikalo?|žarnica ugasne|zasveti močneje|baterija se polni|žica se stopi", "What happens when we open the switch?|the bulb goes out|it shines brighter|the battery charges|the wire melts"],
  [2, "Dve bateriji namesto ene: žarnica?|sveti močneje|sveti šibkeje|ugasne|enako sveti", "Two batteries instead of one: the bulb?|shines brighter|shines dimmer|goes out|no change"],
  [2, "Svinčnikova mina (grafit)?|prevaja tok|je izolator|je magnet|je baterija", "Pencil lead (graphite)?|conducts|insulates|is a magnet|is a battery"],
  [2, "Kovine so dobri?|prevodniki|izolatorji|viri toka|porabniki", "Metals are good?|conductors|insulators|power sources|appliances"],
  [2, "Kaj je porabnik v krogu?|zvonec|baterija|stikalo|žica", "Which is a load (user) in a circuit?|a bell|a battery|a switch|a wire"],
  [2, "Elektrika iz vtičnice je?|nevarna|nenevarna|šibka kot baterija|hladna", "Electricity from a socket is?|dangerous|harmless|weak like a battery|cold"],
  [2, "Napetost baterije merimo v?|voltih|metrih|litrih|kilogramih", "Battery voltage is measured in?|volts|metres|litres|kilograms"],
  [2, "Strela je?|električna iskra|magnet|zvok|veter", "Lightning is?|an electric spark|a magnet|a sound|wind"],
  [3, "Slana voda?|prevaja tok|ne prevaja toka|je magnet|je baterija", "Salt water?|conducts electricity|doesn't conduct|is a magnet|is a battery"],
  [3, "Suh zrak je?|izolator|prevodnik|vir toka|porabnik", "What is dry air?|an insulator|a conductor|a power source|an appliance"],
  [3, "Vzporedno vezani žarnici: ena pregori. Druga?|sveti naprej|ugasne|zasveti rdeče|poči", "Two bulbs in parallel; one blows. The other?|keeps shining|goes out|turns red|bursts"],
  [3, "Zaporedno vezani žarnici: ena pregori. Druga?|ugasne|sveti naprej|sveti močneje|zasveti rdeče", "Two bulbs in series; one blows. The other?|goes out|keeps shining|shines brighter|turns red"],
  [3, "Zakaj ne plezamo na električne drogove?|nevarno za življenje|ker so mrzli|ker so visoki|ker so stari", "Why never climb electricity pylons?|deadly danger|they're cold|they're tall|they're old"],
  [3, "Kaj stori varovalka ob okvari?|prekine tok|poveča tok|shrani tok|ustvari tok", "What does a fuse do in a fault?|cuts the current|boosts the current|stores current|makes current"],
  [3, "Podrgnjen balon?|privlači lase|odbija vodo|se segreje|zasveti", "A rubbed balloon?|attracts hair|repels water|heats up|lights up"],
  [3, "Žarnica med svetenjem?|se segreje|se ohladi|se zmoči|zamrzne", "A bulb while shining?|gets warm|cools down|gets wet|freezes"],
  [3, "LED-sijalka v primerjavi z navadno žarnico?|porabi manj|porabi več|ne sveti|porabi enako", "An LED lamp compared with an old bulb?|uses less energy|uses more|gives no light|uses the same"],
  [3, "Kaj prinaša elektriko do hiš?|daljnovodi|vodovod|plinovod|ceste", "What carries electricity to houses?|power lines|water pipes|gas pipes|roads"],
]);
def("t_electric", "nt_sil", 5, "+−", "Električni krog", "Electric circuits", (t, ctx) => {
  const r = Math.random();
  if (r < (t === 1 ? 0.5 : 0.25)) return r < 0.15 ? choose(ctx, L(ctx, "Kaj je izolator?", "Which is an insulator?"), INSUL, COND) : choose(ctx, L(ctx, "Kaj prevaja električni tok?", "Which conducts electricity?"), COND, INSUL);
  return ELEC_BANK(t, ctx);
});

// Preprosti stroji: [primer, vrsta]
const MACH_KIND = { vzvod: "vzvod|lever", skripec: "škripec|pulley", klanec: "klanec|ramp", klin: "klin|wedge", vijak: "vijak|screw" };
const MACH = [
  ["gugalnica|seesaw", "vzvod"], ["samokolnica|wheelbarrow", "vzvod"], ["odpirač za steklenice|bottle opener", "vzvod"], ["veslo|oar", "vzvod"],
  ["vrv na drogu za zastavo|flagpole rope", "skripec"], ["vrv za dviganje jadra|sail-raising rope", "skripec"],
  ["rampa za voziček|wheelchair ramp", "klanec"], ["cesta v serpentinah|zigzag mountain road", "klanec"],
  ["sekira|axe", "klin"], ["nož|knife", "klin"],
  ["pokrovček na kozarcu|jar lid", "vijak"],
];
const MACH_BANK = bank([
  [1, "Kaj nam olajšajo preprosti stroji?|delo|spanje|branje|petje", "What do simple machines make easier?|work|sleep|reading|singing"],
  [1, "Kje je oporišče gugalnice?|na sredini|na koncu|ga ni|pod sedežem", "Where is a seesaw's pivot?|in the middle|at one end|it has none|under a seat"],
  [2, "Točka, okoli katere se vrti vzvod, je?|oporišče|ročica|breme|klin", "The point a lever turns on is the?|pivot|arm|load|wedge"],
  [2, "Daljša ročica vzvoda pomeni?|manjšo silo|večjo silo|enako silo|nobene sile", "A longer lever arm means?|less force|more force|the same force|no force"],
  [2, "Po klancu je pot daljša, sila pa?|manjša|večja|enaka|nič", "Up a ramp the path is longer, but the force is?|smaller|bigger|the same|zero"],
  [2, "Stalni škripec spremeni?|smer sile|maso bremena|barvo vrvi|dolžino vrvi", "A fixed pulley changes the?|direction of pull|mass of the load|rope colour|rope length"],
  [2, "Zakaj je rezilo sekire ostro?|da lažje prodre|za lepoto|da je težje|da se sveti", "Why is an axe blade sharp?|to cut in easily|for looks|to be heavier|to shine"],
  [2, "Kladivo pri izdiranju žebljev deluje kot?|vzvod|škripec|klanec|vijak", "Pulling out a nail, a hammer works as?|a lever|a pulley|a ramp|a screw"],
  [2, "Kako so težke kamne dvigovali v starih časih?|po klancih|z motorji|z elektriko|z dvigali", "Long ago, heavy stones were raised?|up ramps|with engines|with electricity|with lifts"],
  [3, "Daljši ročaj ključa za vijake?|olajša odvijanje|oteži odvijanje|nič ne spremeni|zlomi vijak", "A longer spanner handle?|makes it easier|makes it harder|changes nothing|breaks the bolt"],
  [3, "Vijak je kot klanec, ovit okoli?|valja|kocke|krogle|piramide", "A screw is a ramp wrapped around what?|a cylinder|a cube|a ball|a pyramid"],
  [3, "Gibljivi škripec potrebno silo?|razpolovi|podvoji|ne spremeni|potroji", "A movable pulley does what to the force needed?|halves it|doubles it|nothing|triples it"],
  [3, "Kateri klanec je najlažji za vleko?|najbolj položen|najbolj strm|navpičen|vsi enako", "Which ramp is easiest to pull up?|the gentlest|the steepest|a vertical one|all the same"],
]);
def("t_machines", "nt_sil", 5, "⊥", "Preprosti stroji", "Simple machines", (t, ctx) => {
  const r = Math.random();
  if (r < (t === 1 ? 0.65 : t === 2 ? 0.3 : 0.2)) {
    const m = pick(MACH);
    const nm = tr(ctx, m[0]);
    return out(L(ctx, `${nm[0].toUpperCase() + nm.slice(1)}: kateri preprosti stroj?`, `${nm[0].toUpperCase() + nm.slice(1)}: which simple machine?`), tr(ctx, MACH_KIND[m[1]]), Object.values(MACH_KIND).map((x) => tr(ctx, x)));
  }
  if (t === 3 && r < 0.55) {
    const m1 = pick([15, 20, 25, 30]), d1 = pick([1, 2]), k = 2; // gugalnica ima ~2 m na vsako stran
    const m2 = m1 * k, d2 = d1 / k;
    if (Number.isInteger(d2 * 10)) {
      const f = (x) => `${ctx.num(x)} m`;
      return out(L(ctx, `Gugalnica: ${m1} kg sedi ${d1} m od sredine. Kje sedi ${m2} kg?`, `Seesaw: ${m1} kg is ${d1} m from the pivot. Where is ${m2} kg?`), f(d2), [f(d1), f(d1 * k), f(d1 + 1), f(d1 / 2 + 1)]);
    }
  }
  return MACH_BANK(t, ctx);
});

// =====================================================================
// TEHNIKA
// =====================================================================
// Orodja: [orodje (imenovalnik/tožilnik|angleško), namen]
const TOOLS = [
  ["kladivo/kladivo|hammer", "za zabijanje žebljev|for hammering nails"],
  ["žaga/žago|saw", "za rezanje lesa|for cutting wood"],
  ["izvijač/izvijač|screwdriver", "za privijanje vijaka|for turning screws"],
  ["šestilo/šestilo|compasses", "za risanje krožnic|for drawing circles"],
  ["vrtalnik/vrtalnik|drill", "za vrtanje lukenj|for drilling holes"],
  ["brusni papir/brusni papir|sandpaper", "za glajenje lesa|for smoothing wood"],
  ["primež/primež|vice", "za vpenjanje lesa|for holding wood"],
  ["škarje/škarje|scissors", "za rezanje papirja|for cutting paper"],
  ["klešče/klešče|pliers", "za upogibanje žice|for bending wire"],
  ["ravnilo/ravnilo|ruler", "za merjenje dolžine|for measuring length"],
  ["luknjač/luknjač|hole punch", "za luknjanje papirja|for punching paper"],
  ["spenjač/spenjač|stapler", "za spenjanje listov|for stapling paper"],
];
const TOOL_BANK = bank([
  [3, "Kaj nosimo pri delu z orodjem?|zaščitna očala|kopalke|copate|šal", "What do we wear when using tools?|safety goggles|a swimsuit|slippers|a scarf"],
  [3, "Kako režemo z nožem za papir?|stran od sebe|proti sebi|proti prijatelju|z zaprtimi očmi", "How do we cut with a craft knife?|away from us|towards us|towards a friend|eyes closed"],
  [3, "Kako podamo škarje?|z ročaji naprej|s konicami naprej|odprte|z metom", "How do we hand over scissors?|handles first|points first|open|by throwing"],
  [3, "Kaj uporabimo za risanje pravega kota?|geotrikotnik|šestilo|radirko|šilček", "What do we draw a right angle with?|a set square|compasses|a rubber|a sharpener"],
  [3, "Pred lepljenjem je površina?|čista in suha|mokra|mastna|prašna", "Before gluing, a surface should be?|clean and dry|wet|greasy|dusty"],
  [3, "Les žagamo?|ob zarisani črti|kjerkoli|na pamet|z zaprtimi očmi", "How do we saw wood?|along the line|anywhere|by guessing|with eyes closed"],
  [3, "Kako vrtimo izvijač, ko vijak privijamo?|kot urni kazalec|v obratni smeri|gor in dol|naključno", "How do we turn a screwdriver to tighten?|clockwise|anticlockwise|up and down|at random"],
  [3, "Žebelj lažje zabijemo, če je?|koničast|top|zvit|moker", "A nail goes in more easily if it is?|pointed|blunt|bent|wet"],
  [3, "Orodje po delu?|pospravimo na mesto|pustimo na tleh|vržemo stran|skrijemo", "After work, tools are?|put back in place|left on the floor|thrown away|hidden"],
  [3, "Električno orodje uporabljamo?|z odraslo osebo|sami|ponoči|z mokrimi rokami", "We use power tools?|with an adult|alone|at night|with wet hands"],
  [3, "Kaj uporabimo za risanje ravne črte?|ravnilo|šestilo|radirko|šilček", "What do we use for a straight line?|a ruler|compasses|a rubber|a sharpener"],
  [3, "Kaj zabijemo s kladivom?|žebelj|vijak|sponko|lepilo", "What do we knock in with a hammer?|a nail|a screw|a paper clip|glue"],
]);
def("t_tools", "nt_teh", 4, "⊤", "Orodja in pripomočki", "Tools", (t, ctx) => {
  const r = Math.random(), sl = ctx.lang === "sl";
  const x = pick(TOOLS), nom = (y) => (sl ? y[0].split("|")[0].split("/")[0] : y[0].split("|")[1]);
  if (t === 1 || (t === 3 && r < 0.3)) return out(L(ctx, `Katero orodje je ${tr(ctx, x[1])}?`, `Which tool is ${tr(ctx, x[1])}?`), nom(x), TOOLS.map(nom));
  if (t === 2) return out(sl ? `Za kaj uporabimo ${x[0].split("|")[0].split("/")[1]}?` : `What do we use ${/s$|paper$/.test(nom(x)) ? "" : "a "}${nom(x)} for?`, tr(ctx, x[1]), TOOLS.map((y) => tr(ctx, y[1])));
  return TOOL_BANK(3, ctx);
});

defBank("t_techmat", "nt_teh", 4, "▤", "Gradiva: les, papir, umetne snovi, kovine", "Materials: wood, paper, plastics, metals", [
  [1, "Papir izdelujejo iz?|lesnih vlaken|nafte|peska|volne", "Paper is made from?|wood fibres|oil|sand|wool"],
  [1, "Umetne snovi izdelujejo predvsem iz?|nafte|lesa|peska|volne", "Plastics are mostly made from?|oil|wood|sand|wool"],
  [1, "Katera kovina rjavi?|železo|zlato|aluminij|baker", "Which metal rusts?|iron|gold|aluminium|copper"],
  [1, "Kaj najlaže prerežemo s škarjami?|papir|železo|kamen|steklo", "What is easiest to cut with scissors?|paper|iron|stone|glass"],
  [1, "Katero gradivo plava na vodi?|les|železo|steklo|kamen", "Which material floats on water?|wood|iron|glass|stone"],
  [1, "Kaj je karton?|debel papir|tanka kovina|plastika|steklo", "What is cardboard?|thick paper|thin metal|plastic|glass"],
  [1, "Les dobimo iz?|dreves|nafte|rude|peska", "Wood comes from?|trees|oil|ore|sand"],
  [1, "Kovine pridobivajo iz?|rude|lesa|nafte|vode", "Metals are obtained from?|ore|wood|oil|water"],
  [1, "Glavna surovina za steklo je?|pesek|les|nafta|ruda", "The main raw material for glass is?|sand|wood|oil|ore"],
  [1, "Kaj ni kovina?|les|železo|baker|aluminij", "Which is NOT a metal?|wood|iron|copper|aluminium"],
  [1, "Iz česa je pločevinka za sok?|iz aluminija|iz lesa|iz papirja|iz stekla", "A drink can is made of?|aluminium|wood|paper|glass"],
  [1, "Iz česa so žice za elektriko?|iz bakra|iz lesa|iz papirja|iz stekla", "Electric wires are made of?|copper|wood|paper|glass"],
  [2, "Les v vodi?|nabrekne|se skrči|se raztopi|se stopi", "Wood in water?|swells|shrinks|dissolves|melts"],
  [2, "Papir se lažje trga?|v smeri vlaken|prečno na vlakna|samo moker|nikoli", "Paper tears more easily?|along the grain|across the grain|only when wet|never"],
  [2, "Recikliran papir je iz?|starega papirja|novih dreves|plastike|stekla", "Recycled paper is made from?|old paper|new trees|plastic|glass"],
  [2, "Kaj se ob segrevanju zmehča?|plastika|les|kamen|papir", "What softens when heated?|plastic|wood|stone|paper"],
  [2, "Kako kovino zaščitimo pred rjo?|z barvo|z vodo|s soljo|z blatom", "How do we protect metal from rust?|paint it|wet it|salt it|cover it in mud"],
  [2, "Furnir je?|tanek list lesa|kovinska plošča|plastična folija|kos stekla", "Veneer is?|a thin sheet of wood|a metal plate|plastic film|a piece of glass"],
  [2, "Iverna plošča je iz?|lesnih ostankov|kovine|stekla|volne", "Chipboard is made from?|wood chips|metal|glass|wool"],
  [2, "Vezana plošča je iz?|plasti lesa|plasti stekla|kovine|papirja", "Plywood is made of?|layers of wood|layers of glass|metal|paper"],
  [2, "Kaj uporabimo za spajanje lesa?|žeblje in lepilo|vodo|led|maslo", "What do we join wood with?|nails and glue|water|ice|butter"],
  [2, "Kaj je dober toplotni izolator?|stiropor|aluminij|baker|železo", "Which is a good heat insulator?|polystyrene|aluminium|copper|iron"],
  [2, "Zakaj ločujemo odpadke?|da jih recikliramo|da jih je več|za zabavo|da smrdijo", "Why do we sort our rubbish?|to recycle it|to make more|for fun|to make it smell"],
  [3, "Katera od teh kovin je najlažja?|aluminij|železo|svinec|baker", "Which of these metals is lightest?|aluminium|iron|lead|copper"],
  [3, "Jeklo je predvsem iz?|železa|aluminija|bakra|zlata", "Steel is mainly made of?|iron|aluminium|copper|gold"],
  [3, "Kaj se zgodi z železom na vlagi?|zarjavi|se stopi|zgori|izgine", "What happens to iron in damp air?|it rusts|it melts|it burns|it vanishes"],
  [3, "Kateri les je najtrši?|bukev|smreka|lipa|topol", "Which wood is the hardest?|beech|spruce|lime|poplar"],
  [3, "Kateri mehak les je dober za rezbarjenje?|lipa|bukev|hrast|jesen", "Which soft wood is good for carving?|lime (linden)|beech|oak|ash"],
  [3, "Plastika v naravi razpade?|zelo počasi|v enem dnevu|v enem tednu|takoj", "Plastic in nature breaks down?|very slowly|in a day|in a week|at once"],
  [3, "Kateri papir je najdebelejši?|lepenka|časopisni|svileni|pisarniški", "Which paper is the thickest?|cardboard|newspaper|tissue paper|office paper"],
  [3, "Zakaj les pred barvanjem zbrusimo?|da je gladek|da je težji|da je mokrejši|da lepo diši", "Why sand wood before painting?|to make it smooth|to make it heavier|to make it wetter|to make it smell"],
  [3, "Kovine se pri segrevanju?|raztezajo|krčijo|takoj stalijo|raztopijo", "When heated, metals?|expand|shrink|melt at once|dissolve"],
  [3, "Zakaj ponve niso iz plastike?|plastika se stopi|plastika je pretežka|plastika rjavi|plastika prevaja", "Why aren't pans made of plastic?|plastic melts|it's too heavy|it rusts|it conducts"],
  [3, "Katero gradivo lahko recikliramo neštetokrat?|steklo|papir|les|tekstil", "Which material can be recycled endlessly?|glass|paper|wood|fabric"],
]);

const DRAW_BANK = bank([
  [1, "Katera črta riše vidne robove?|debela polna|črtkana|tanka črta-pika|valovita", "Which line shows visible edges?|thick solid|dashed|thin dash-dot|wavy"],
  [1, "Katera črta riše skrite robove?|črtkana|debela polna|tanka črta-pika|valovita", "Which line shows hidden edges?|dashed|thick solid|thin dash-dot|wavy"],
  [1, "Katera črta riše simetralo?|tanka črta-pika|debela polna|črtkana|valovita", "Which line shows a centre line?|thin dash-dot|thick solid|dashed|wavy"],
  [1, "Kotirne črte so?|tanke polne|debele polne|črtkane|valovite", "Dimension lines are?|thin solid|thick solid|dashed|wavy"],
  [1, "V katerih enotah pišemo mere na tehnični risbi?|v milimetrih|v metrih|v kilometrih|v centimetrih", "Technical drawing measurements are in?|millimetres|metres|kilometres|centimetres"],
  [1, "Kaj rišemo s šestilom?|krožnico|kvadrat|ravno črto|trikotnik", "What do we draw with compasses?|a circle|a square|a straight line|a triangle"],
  [1, "Kaj potrebujemo za ravno črto?|ravnilo|šestilo|radirko|šilček", "What do we need for a straight line?|a ruler|compasses|a rubber|a sharpener"],
  [1, "Pogled od zgoraj je?|tloris|naris|stranski ris|prerez", "The view from above is the?|top view|front view|side view|cross-section"],
  [1, "Pogled od spredaj je?|naris|tloris|stranski ris|prerez", "The view from the front is the?|front view|top view|side view|cross-section"],
  [1, "Pogled od strani je?|stranski ris|naris|tloris|prerez", "The view from the side is the?|side view|front view|top view|cross-section"],
  [1, "Merilo 1 : 1 pomeni?|naravno velikost|pomanjšano|povečano|brez mer", "Scale 1 : 1 means?|actual size|smaller|bigger|no sizes"],
  [1, "Merilo 1 : 2 pomeni?|2-krat pomanjšano|2-krat povečano|naravno velikost|4-krat pomanjšano", "Scale 1 : 2 means?|half size|twice the size|actual size|quarter size"],
  [1, "Merilo 2 : 1 pomeni?|2-krat povečano|2-krat pomanjšano|naravno velikost|4-krat povečano", "Scale 2 : 1 means?|twice the size|half size|actual size|four times bigger"],
  [3, "Merilo 1 : 100: 1 cm na risbi je v resnici?|1 m|1 cm|10 cm|1 km", "Scale 1 : 100: 1 cm on paper is really?|1 m|1 cm|10 cm|1 km"],
  [3, "Kocka: koliko pogledov običajno narišemo?|3|1|2|6", "A cube: how many views do we usually draw?|3|1|2|6"],
  [3, "Kje na risbi je tloris?|pod narisom|nad narisom|levo od narisa|ga ni", "Where is the top view placed?|below the front view|above the front view|left of it|nowhere"],
]);
def("t_drawing", "nt_teh", 5, "⌀", "Tehnična risba", "Technical drawing", (t, ctx) => {
  if (t > 1 && Math.random() < (t === 2 ? 0.8 : 0.6)) {
    const f = (x) => `${ctx.num(x)} mm`;
    const [a, b] = t === 2 ? pick([[1, 2], [2, 1]]) : pick([[1, 2], [2, 1], [1, 5], [1, 10], [5, 1], [1, 4]]);
    let real, draw;
    if (a === 1) { draw = R(2, 15) * 2; real = draw * b; } else { real = R(2, 12) * 2; draw = real * a; }
    const sc = `${a} : ${b}`;
    if (Math.random() < 0.5) return out(L(ctx, `Merilo ${sc}. Na risbi ${f(draw)}. V resnici?`, `Scale ${sc}. Drawing ${f(draw)}. Real size?`), f(real), [f(draw), f((draw * a) / b), f(draw * 10), f(real + draw)]);
    return out(L(ctx, `Merilo ${sc}. V resnici ${f(real)}. Na risbi?`, `Scale ${sc}. Real size ${f(real)}. On the drawing?`), f(draw), [f(real), f((real * b) / a), f(real / 10), f(real + draw)]);
  }
  return DRAW_BANK(t === 1 ? 1 : 3, ctx);
});

const BIKE_BANK = bank([
  [1, "Kam na kolesu sedemo?|na sedež|na krmilo|na pedal|na verigo", "Where do we sit on a bike?|on the saddle|on the handlebars|on a pedal|on the chain"],
  [1, "Kaj poganjamo z nogami?|pedale|krmilo|zvonec|zavore", "What do we push with our feet?|the pedals|the handlebars|the bell|the brakes"],
  [1, "Kaj ustavi kolo?|zavore|zvonec|luč|veriga", "What stops a bike?|the brakes|the bell|the light|the chain"],
  [1, "Kaj opozori pešca na kolesarja?|zvonec|veriga|pedal|sedež", "What warns a walker that a bike is coming?|the bell|the chain|a pedal|the saddle"],
  [1, "Kolesarska čelada mora biti?|pripeta|odpeta|na krmilu|v torbi", "A bike helmet must be?|fastened|unfastened|on the handlebars|in a bag"],
  [1, "Kateri del kolesa uporabimo za zavijanje?|krmilo|veriga|sedež|pedal", "Which part do we steer with?|the handlebars|the chain|the saddle|a pedal"],
  [1, "Veriga poganja?|zadnje kolo|sprednje kolo|krmilo|zvonec", "The chain turns the?|back wheel|front wheel|handlebars|bell"],
  [1, "Kaj je v zračnici?|zrak|voda|pesek|olje", "What is inside an inner tube?|air|water|sand|oil"],
  [1, "Kaj potrebujemo za polnjenje zračnice?|tlačilko|kladivo|izvijač|lepilo", "What do we need to pump up a tyre?|a pump|a hammer|a screwdriver|glue"],
  [1, "Kaj je na kolesu iz gume?|pnevmatika|veriga|okvir|zvonec", "Which bike part is made of rubber?|the tyre|the chain|the frame|the bell"],
  [1, "Iz česa je navadno okvir kolesa?|iz kovine|iz lesa|iz papirja|iz stekla", "A bike frame is usually made of?|metal|wood|paper|glass"],
  [1, "Kako najvarneje držimo krmilo?|z obema rokama|z nobeno roko|s komolcem|z enim prstom", "How do we hold handlebars most safely?|with both hands|with no hands|with an elbow|with one finger"],
  [2, "Kakšne barve je sprednja luč kolesa?|bela|rdeča|modra|zelena", "What colour is a bike's front light?|white|red|blue|green"],
  [2, "Kakšne barve je zadnja luč kolesa?|rdeča|bela|modra|zelena", "What colour is a bike's rear light?|red|white|blue|green"],
  [2, "Kakšne barve je zadnji odsevnik?|rdeč|bel|moder|zelen", "What colour is the rear reflector?|red|white|blue|green"],
  [2, "Koliko zavor mora imeti kolo?|2|1|3|4", "How many brakes must a bike have?|2|1|3|4"],
  [2, "Ali mora imeti kolo zvonec?|da|ne|samo pozimi|samo ponoči", "Must a bike have a bell?|yes|no|only in winter|only at night"],
  [2, "Kje vozi kolesar?|ob desnem robu ceste|ob levem robu|po sredini ceste|po pločniku", "Where does a cyclist ride?|on the right edge|on the left edge|in the middle|on the pavement"],
  [2, "Kako vozijo kolesarji v skupini?|drug za drugim|drug ob drugem|v krogu|cik-cak", "How do cyclists ride in a group?|in single file|side by side|in a circle|zigzag"],
  [2, "Ko zavijamo desno, iztegnemo?|desno roko|levo roko|obe roki|nogo", "When turning right, we stick out our?|right arm|left arm|both arms|a leg"],
  [2, "Ko zavijamo levo, iztegnemo?|levo roko|desno roko|obe roki|nogo", "When turning left, we stick out our?|left arm|right arm|both arms|a leg"],
  [2, "Kdaj prižgemo luči na kolesu?|ponoči in v megli|samo opoldne|nikoli|samo poleti", "When do we switch on bike lights?|at night and in fog|only at noon|never|only in summer"],
  [2, "Pred vožnjo preverimo?|zavore in luči|barvo kolesa|ime kolesa|vreme v tujini", "Before riding we check?|brakes and lights|the bike's colour|the bike's name|foreign weather"],
  [2, "Verigo namažemo z oljem, da?|teče lažje|je lepša|je težja|se ustavi", "We oil the chain so that it?|runs smoothly|looks nicer|gets heavier|stops"],
  [3, "Do katere starosti je čelada za kolesarje obvezna?|do 18 let|do 10 let|do 5 let|nikoli", "Until what age must cyclists wear a helmet?|until 18|until 10|until 5|never"],
  [3, "V katerem razredu je kolesarski izpit?|v 5. razredu|v 1. razredu|v 9. razredu|v 3. razredu", "In which school year is the cycling test?|5th grade|1st grade|9th grade|3rd grade"],
  [3, "Kaj dobimo po opravljenem kolesarskem izpitu?|kolesarsko izkaznico|vozniško dovoljenje|novo kolo|medaljo", "What do we get after the cycling test?|a cycling licence|a driving licence|a new bike|a medal"],
  [3, "Kako kolesar prečka prehod za pešce?|kolo potiska|hitro pelje|pelje cik-cak|pelje brez rok", "How does a cyclist cross a zebra crossing?|pushes the bike|rides fast|rides zigzag|rides no-handed"],
  [3, "Pred zavijanjem levo pogledamo?|nazaj čez ramo|samo naprej|v nebo|na pedale", "Before turning left we look?|back over a shoulder|only ahead|at the sky|at the pedals"],
  [3, "Kaj nosimo ponoči na kolesu?|odsevni jopič|črno bundo|temno kapo|sončna očala", "What do we wear cycling at night?|a hi-vis vest|a black coat|a dark hat|sunglasses"],
  [3, "Kje s kolesom ne smemo voziti?|po avtocesti|po kolesarski stezi|po kolesarskem pasu|po poljski poti", "Where may we NOT ride a bike?|on a motorway|on a cycle path|in a cycle lane|on a farm track"],
  [3, "Prestave na kolesu pomagajo?|voziti v klanec|zavirati|zvoniti|svetiti", "Bike gears help us?|ride uphill|brake|ring the bell|light the way"],
  [3, "Okrogel moder znak s kolesom označuje?|kolesarsko stezo|prepoved koles|servis koles|izposojo koles", "A round blue sign with a bike shows?|a cycle path|no bikes allowed|a bike repair shop|bike hire"],
]);
def("t_bike", "nt_teh", 5, "o-o", "Kolo in kolesar", "Bicycle and cyclist", (t, ctx) => BIKE_BANK(t, ctx));

export const AREAS = [
  ["nt_snov", { sl: "Snovi", en: "Materials and substances" }, "#0ea5e9"],
  ["nt_ziv", { sl: "Živa bitja in okolje", en: "Living things and environment" }, "#22c55e"],
  ["nt_sil", { sl: "Sile, energija in pojavi", en: "Forces, energy and phenomena" }, "#f59e0b"],
  ["nt_teh", { sl: "Tehnika", en: "Technology" }, "#8b5cf6"],
];
export const CONCEPTS = C;
