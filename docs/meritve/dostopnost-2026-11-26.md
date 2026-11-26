# Dostopnost WCAG 2.2 AA po axe-core na glavnih zaslonih (26. 11. 2026)

Naloga K-11 načrta dviga kakovosti po reviziji (j odobril 26. 11. 2026). Merilo: 0 kršitev axe z vplivom
»serious« ali »critical« na 20 glavnih zaslonih.

## Povzetek
- Glavna številka: **19 od 20** glavnih zaslonov brez resnih kršitev axe (cilj 20 od 20, smer: višje je bolje),
  n = 20 zaslonov v 60 posnetkih (računalnik 1280 px in telefon 360 px). Prej (main pred popravki): 12 od 20.
  Edina preostala kršitev je `target-size` na eni črki formule v razlagi teme (1 posnetek od 60). Ta črka je del
  formule v besedilu, zato zanjo po naši presoji velja izjema »Inline« iz WCAG 2.5.8 (glej Napake). S to izjemo, ki jo
  presodimo sami in ki ni ugotovitev axe, so vsi zasloni brez kršitev: 20 od 20.
- Vsi posnetki dimnega testa: **5 od 225** posnetkov imajo resno kršitev. Prej jih je imelo 88 od 224.
  2 sta v kalkulatorju (`label`, AUDIT-086, lastnik je kalkulatorska seja), 2 sta ista izjema »Inline« za črko
  formule, 1 so gumbi z izbiro odgovora, ki so samo formula (`button-name`, Vadba za izpit; glej Napake, ni popravljeno).
- Pomeni: axe na posnetih stanjih glavnih zaslonov ne najde več gumba, vrstice napredka, risbe simulacije ali
  vnosnega polja brez imena, ne besedila s premajhnim kontrastom in ne drsnega področja, ki ga s tipko Tab ne dosežemo.
  Rdeče besedilo in zlato besedilo »+XP« (naloga, igre) imata v svetli temi kontrast vsaj 4,5 : 1.
- Ne pomeni: da je Evklid dostopen po WCAG 2.2 AA v celoti. axe samodejno najde le del napak (po Deque okoli 57 %).
  Ročni pregled z bralnikom zaslona (NVDA, VoiceOver, TalkBack), pregled vrstnega reda fokusa in pregled z osebo,
  ki bralnik uporablja, še nista bila narejena.

## Nabor
- Vir in različica: vsi posnetki dimnega testa `scripts/preveri-aplikacijo.cjs` (učenci OŠ, SŠ, UNI, računi, starši,
  šole, telefon), svetla tema. Na vsakem posnetku teče axe-core 4.11.0 s pravili wcag2a, wcag21a, wcag2aa, wcag21aa
  in wcag22aa. Uradni viri ne pridejo v poštev.
- Kdo je določil pričakovani izid in kdaj: merilo (0 serious/critical) je določil načrt K-11 pred zagonom. Pravila
  so pravila axe-core in jih nismo spreminjali.
- Skriti kontrolni del: ne. Zasloni so isti kot pri razvoju popravkov.
- 20 glavnih zaslonov in posnetki, ki jim pripadajo (vzorci imen v `.json`):

| Zaslon | Posnetkov | Širine (px) | S kršitvijo prej | S kršitvijo zdaj |
|---|---|---|---|---|
| Pristajalna stran | 1 | 1280 | 0 | 0 |
| Prijava | 1 | 1280 | 0 | 0 |
| Registracija | 1 | 1280 | 0 | 0 |
| Nov profil (uvod) | 3 | 1280 | 0 | 0 |
| Učna pot | 4 | 1280, 360 | 1 | 0 |
| Tema | 6 | 1280, 360 | 6 | 1 |
| Naloga | 4 | 1280, 360 | 4 | 0 |
| Učbenik | 4 | 1280, 360 | 0 | 0 |
| Lekcija | 4 | 1280, 360 | 4 | 0 |
| Simulacija | 3 | 1280, 360 | 3 | 0 |
| Inštruktor (klepet) | 8 | 1280, 360 | 0 | 0 |
| Kalkulator (znanstveni) | 2 | 1280, 360 | 1 | 0 |
| Skeniraj | 2 | 1280, 360 | 0 | 0 |
| Tekmovanja | 3 | 1280, 360 | 0 | 0 |
| Igre | 2 | 1280, 360 | 0 | 0 |
| Napredek | 4 | 1280, 360 | 3 | 0 |
| Nastavitve | 4 | 1280, 360 | 0 | 0 |
| Jaz (telefon) | 1 | 360 | 0 | 0 |
| NPZ in matura (pole) | 2 | 1280 | 0 | 0 |
| Račun | 1 | 1280 | 1 | 0 |

## Metoda
- Ukaz: `npm install --no-save axe-core@4.11.0`, nato
  `node scripts/preveri-aplikacijo.cjs --posnetki <mapa> --meritve` (polni zagon, ne `--samo`). Zapis
  `<mapa>/meritve.jsonl` povzame skripta, ki je opisana v `.json` (vzorci imen zaslonov, »resno« = serious ali critical).
- Prej: `main` 5b8130ae064212121a81f6cb4f24c475c60add78 (26. 11. 2026, pred popravki). Potem: `main`
  e787bd065a167b814ac58437d6096ab6e5129f22 s popravki te veje (`claude/project-thread-g6oklx-dostopnost`).
- Stroj in okolje: oblačni vsebnik Linux s 4 jedri, Node 22.23, Playwright 1.63 s Chromiumom, preizkusni strežnik
  (`EVKLID_MOCK=1`, začasna baza, brez ključev API).
- Ocenjevanje: program (axe-core). Ocene človeka ni.

## Izidi
| Merilo | Vrednost | n | 95-% interval (Wilson) | Cilj | Prej |
|---|---|---|---|---|---|
| Glavni zasloni brez resnih kršitev axe | 19 od 20 | 20 zaslonov | 76–99 % | 20 od 20 | 12 od 20 |
| Posnetki glavnih zaslonov z resno kršitvijo | 1 od 60 | 60 posnetkov | 0,3–8,9 % | 0 | 23 od 60 |
| Vsi posnetki z resno kršitvijo | 5 od 225 | 225 posnetkov | 1,0–5,1 % | – | 88 od 224 |
| Dimni test: najdene težave | 0 | 225 posnetkov | – | 0 | 0 |
| Temna tema: glavni zasloni brez resnih kršitev | 19 od 20 | 20 zaslonov | 76–99 % | 20 od 20 | – |
| Temna tema: vsi posnetki z resno kršitvijo | 5 od 225 | 225 posnetkov | 1,0–5,1 % | – | – |

Resne kršitve po pravilu axe (število posnetkov, prej → zdaj): `aria-allowed-attr` 47 → 0, `color-contrast` 26 → 0,
`aria-progressbar-name` 22 → 0, `svg-img-alt` 17 → 0, `listitem` 8 → 0, `button-name` 8 → 1 (izbire s samo formulo),
`scrollable-region-focusable` 5 → 0, `aria-prohibited-attr` 4 → 0, `label` 3 → 2 (kalkulator),
`aria-required-children` 2 → 0, `target-size` 1 → 2 (črka formule, glej Napake).

Kaj je popravljeno:
- Ponovljena črka formule (`.fx-dup`, `public/formula-info.js`) nima več `aria-label` in `aria-expanded` brez vloge gumba.
- Vrstica napredka v lekciji (`.tb-progress`) in zbirkah (`.zb-bar`) ima ime, ki pove korak ali stopnjo.
- Risba simulacije (`svg role="img"`) dobi ime iz `<title>` ali naslova simulacije (`public/sim/index.js`).
- Barve v svetli temi: `--danger` #d33a3f → #c8323a (4,6 : 1 na rdeči podlagi), novo `--gold-text` #975800 (5,7 : 1)
  za »+XP«; besedilo pod pozdravom na Učni poti in števila na zavihkih zbirk ne bledijo več s prosojnostjo; značka
  »Pravilno« v skenerju ima svetlejšo podlago.
- Izbira odgovora v naši poli je spet seznam (brez `role="group"` na `<ul>`). Srca v igri imajo vlogo slike.
  Gumba »Obrazec« in »Pogovor« v povratnih informacijah sta skupina s pritisnjenim gumbom, ne zavihka brez plošč.
- Imena: povezava za povabilo v Računu, vrstice zgodovine skenerja, gumb »Jaz« v glavi kalkulatorja (`index.html`).
- Drsna področja: vrstica ali pogled, ki se pomika in nima ničesar za fokus, dobi `tabindex="0"`
  (`public/drsniki.js`). Pogled Napredek na računalniku se pomika sam in je imel samo skrite gumbe.
- `scripts/preveri-aplikacijo.cjs` v meritve zapiše mesta kršitev (do 10) in pri kontrastu barve z razmerjem.
- Regresijski testi: `test/dostopnost-k11.test.js` (kontrast žetonov, imena, vloge, `dosegljiva`).

## Napake in neuspehi
- `target-size`, 125-pc-tema-UNI in 105-pc-trening-konec-SS (v temni temi 125 in 104-pc-nova-raven): posamezna črka v formuli (`span[data-fx]`, odpre opis
  količine) je manjša od 24 × 24 px in preblizu sosednje črke. Črka je del formule v besedilu razlage ali naloge.
  Po naši presoji zanjo velja izjema »Inline« iz WCAG 2.5.8 (velikost omejuje višina vrstice besedila okoli nje).
  axe izjemo prepozna pri večini takih črk, pri teh dveh pa ne. To je presoja, ne dokaz. Če izjemo zavrnemo, bi
  popravek pomenil drugačno postavitev formul, kar spremeni videz in je odločitev za j-ja. Na katerem posnetku axe
  črko najde, se med zagoni spreminja (prej 1 posnetek, zdaj 2 v svetli in 3 v temni temi; 050, 104 in 105 so
  čestitka za novo raven čez isto nalogo ali konec treninga), zato porast ni posledica teh sprememb.
- `button-name`, 147-pc-izpit-trening (samo v svetli temi, naloge so naključne): gumbi z izbiro odgovora, ki so samo
  formula (npr. $[0,\pi] - \{\frac{\pi}{2}\}$), nimajo imena. To ni le omejitev axe: Chrome za tak gumb izračuna prazno
  ime (preverjeno z drevesom dostopnosti prek CDP), ker MathML v gumbu ne šteje v ime. Bralnik zaslona tako prebere le
  »gumb«. Isto velja za vse izbire s samo formulo (vadnica, kviz, pilotne naloge), ne le za ta zaslon. Popravek
  potrebuje izgovor formul v slovenščini (ime gumba iz zapisa LaTeX), kar je ločena naloga; v tem PR ni popravljeno.
- `label`, kalkulator Orodja (035-pc, 189-tel): polja `input.tl-ra` in `input.tl-co` v `public/graph/tools.js` nimajo
  imena (napis je samo črka v KaTeX). Kalkulator ureja ena sama seja (CLAUDE.md), zato smo ga le prijavili: register
  `docs/revizija/register.md`, AUDIT-086 (P2), popravek pripravi lastnik kalkulatorja.
- Napačno potrjenih trditev v tej meritvi ni, ker axe ne potrjuje matematike.

## Omejitve
- Samo Chromium. Temna tema (`--tema temna`) je izmerjena z isto skripto in istimi zasloni: 19 od 20 glavnih
  zaslonov, isti 2 polji v kalkulatorju in črka formule na 3 posnetkih. Izhodišča »prej« za temno temo nimamo.
  WebKit in Firefox: naloga K-12.
- Naloge v dimnem testu so deloma naključne, zato se posamezni posnetki med zagoni razlikujejo (npr. izbire s samo
  formulo v Vadbi za izpit).
- Samo širini 1280 in 360 px. Druge naprave so v K-12 (`scripts/posnetki-naprave.cjs`).
- axe vidi stanje zaslona ob posnetku, ne vseh stanj (odprti meniji, napake obrazcev, vsi koraki lekcij).
- Samodejno preverjanje ne nadomesti pregleda z bralnikom zaslona in tipkovnico ter pregleda človeka.
- Isti razvijalec je popravljal in meril (ločen pregled kode je del PR).

## Stroški
Klicev API: 0 (preizkusni strežnik brez modela). Cena: 0 $.
