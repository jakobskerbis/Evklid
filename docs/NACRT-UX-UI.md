# Evklid – načrt optimizacije UX/UI (2. faza)

Stanje: 25. 11. 2026. Referenčni commit zunanjega pregleda: `fe998f2`. Ta načrt je pripravljen na `main` `2ad0e44`, dimni test pa je tekel na veji PR 0 (#1079, `5a37a89`).
Načrt zamenja izgubljeni `NACRT-UX-UI.md` iz paketa za ChatGPT, ki v repozitoriju ni bil shranjen. Nove ugotovitve so oštevilčene od UX-100 naprej, da se ne pomešajo z oznakami zunanjega poročila (UX-001 do UX-099).

## 1. Izhodišče

Ocene zunanjega pregleda (ChatGPT) so predhodne strokovne presoje. Niso rezultati popolnega interaktivnega testiranja.

| Naprava | Ocena | Cilj (razvojni, ni zahtevan) |
|---|---|---|
| Računalnik | 8,8 | ≥ 9,5 |
| iPad ležeče | 8,3 | ≥ 9,5 |
| iPad pokončno | 8,0 | ≥ 9,3 |
| Telefon pokončno | 8,0 | ≥ 9,3 |
| Telefon ležeče | 6,8 | ≥ 9,0 |

Dodatni dimni testi pred tem načrtom so dali 240 posnetkov in 13 težav. Po napravah: telefon pokončno 0, telefon ležeče 10, iPad pokončno 2 in iPad ležeče 1 težava. Vir so lokalni zagoni avtorja #1079 pred zunanjim pregledom. Ti rezultati niso shranjeni v repozitoriju.

Od številčnih ocen so pomembnejši:
- zanesljivo opravljanje učnih nalog;
- da se uporabnikov vnos nikoli ne izgubi;
- da ni potrjenih pomembnih prekrivanj;
- da ni novih regresij;
- dostopnost in pravilen matematični zapis (KaTeX);
- da se zmogljivost, varnost in pedagoška vrednost ohranijo.

## 2. Ponovno preverjeno 25. 11. 2026

Ukaz: `node scripts/posnetki-naprave.cjs --naprave tel-390 --teme temna`. Na 2 jedrih traja zagon 4–7 min (telefon ~4, računalnik ~7).

- **Telefon 390 × 844 pokončno:** 61 posnetkov, 2 težavi.
- **Telefon 844 × 390 ležeče:** 58 posnetkov, 10 težav. Imajo 4 skupne vzroke (UX-100 do UX-103).
- **axe-core:** vsak zagon ima 9 pravil, v obeh zagonih skupaj pa se ponovi vseh 10 pravil iz zunanjega pregleda.
- Pokončno sta zdaj 2 težavi namesto 0. Najdeta jih nova preverjanja v #1079 (UX-103 fokus, UX-104 prijava napake), ne nova napaka v aplikaciji.
- Številke so iz zagona na `5a37a89`. Po zadnjih spremembah skript v #1079 jih je treba znova izmeriti v GitHub Actions.

Odpravljenega še ni nič. Commita na `main` po `fe998f2` (#1076, #1068) se UX-ugotovitev ne dotikata.

## 3. Register ugotovitev

Stolpec P je prioriteta: P1 = blokira opravilo ali izgubi vnos, P2 = moti ali je nedostopno, P3 = videz.

| ID | P | Področje | Opis | Dokaz | Reprodukcija | Popravek (PR) | Kriterij sprejema |
|---|---|---|---|---|---|---|---|
| UX-022 | P1 | Prekrivanje | Mehurček inštruktorja prekrije iskanje učbenika | Zunanji pregled. V zagonu tel-390 temna se ni ponovilo; preveriti na iPadu | Učbenik na telefonu ali iPadu, mehurček desno | Skupna pravila umeščanja (PR 1) | 0 zadetkov »mehurček prekriva« na 26 zagonih |
| UX-023 | P1 | Prekrivanje | Mehurček prekrije izbiro teme in PSE na iPadu | Zunanji pregled. V tel-390 je `[data-tab=pse]` samo opozorilo axe o kontrastu | iPad ležeče, Zbirke → PSE | PR 1 | kot UX-022 |
| UX-100 | P2 | Ležeči telefon | Mali navpični drsniki ▲▼ (6×, 3 elementi) | `div.messages`, `div.sc-history`, `main.view.narrow` | 844 × 390, klepet, kalkulator, naloga | PR 2. `sc-history` je kalkulator, zato gre v register AUDIT | Dimni test: 0 opozoril »mali navpični drsnik« |
| UX-101 | P1 | Ležeči telefon | Stran je za 18–40 px višja od zaslona, zato drsi stran in ne pogled | `klepet-prijava-tel`, `klepet-funkcija-tel` | 844 × 390, klepet z odprtim vnosom | PR 2: višina pogleda (`dvh`, `visualViewport`, varna območja) | 0 opozoril »cela stran je višja« |
| UX-102 | za preverbo | Ležeči telefon | Klik `[view-chat]` ne uspe v 5 s. Na posnetku je klepet že odprt, zato je to lahko napaka testa | korak `tel-klepet` | 844 × 390, spodnja vrstica | PR 2 | korak uspe; vsi gumbi menija so vidni in klikljivi |
| UX-103 | za preverbo | Fokus | Fokus na datumskem polju ni viden. Verjetno lažni alarm: Chromium pri `type=date` označi notranji del polja | `input#onb-goal-date`, obe legi | Tab skozi uvodni ogled | PR 3 | Tipkovnica: 0 težav |
| UX-104 | P1 | Prekrivanje | Mehurček prekrije polje »Kaj je narobe…« pri prijavi napake | `lekcija-prijava-tel`, 390 pokončno | Lekcija → prijavi napako | PR 1 | kot UX-022 |
| UX-105 | P2 | Prekrivanje | Obvestila in plavajoči elementi prekrijejo odgovore, lekcije in simulacije | Zunanji pregled | Obvestilo med lekcijo ali simulacijo | PR 1 | Nov test prekrivanja: obvestilo ne prekrije nobenega kontrolnika |
| UX-106 | P1 | Ležeči telefon, vnos | Tipkovnica za vnos (123/ABC/f(x)) zasede ves zaslon 844 × 390, besedila naloge se ne vidi | `tel-390-lezece-temna/024-tel-naloga.png` | Naloga, odpri vnos | `vnos-formul.js` je kalkulator, zato gre v register AUDIT; postavitev okoli tipkovnice reši PR 2 | Naloga in vnos sta hkrati vidna |
| UX-107 | P2 | Prekrivanje | Števec korakov »1/11« prekrije besedilo »Cilji: …« | `tel-390-pokoncno-temna/036-lekcija-prijava-tel.png` | Lekcija po korakih, 390 pokončno | Najprej preveriti #1050 (profil A), sicer PR 1 | Števec ne prekrije besedila |

### axe-core (PR 3)

Za vsako pravilo se določi, ali gre za potrjeno napako, lažni alarm ali dovoljeno izjemo. Določi se še kriterij WCAG, popravek in regresijski test.

| Pravilo | Primer | Prva presoja |
|---|---|---|
| aria-allowed-attr | KaTeX (`.katex-html`) | Verjetno izjema KaTeX. Dostopnosti KaTeX ne odstranjujemo samo zato, da opozorilo izgine |
| aria-progressbar-name | `.zb-bar`, `.tb-progress` | Potrjeno v kodi: nimata `aria-label` (WCAG 4.1.2) |
| button-name | `.calc-top > .me-back` | Za preverbo (gumb kalkulatorja; register AUDIT) |
| target-size | `#chat-bug` | Za preverbo (WCAG 2.5.8, 24 px) |
| aria-prohibited-attr | `.gm-lives` | Za preverbo |
| svg-img-alt | `.demo-svg` | Za preverbo (besedilna alternativa) |
| scrollable-region-focusable | `#usage > .md-table-wrap` | Za preverbo (WCAG 2.1.1) |
| color-contrast | `[data-tab=pse] small` | Za preverbo v obeh temah (WCAG 1.4.3) |
| aria-required-children | `.fb-tabs` | Za preverbo |
| label | `input[data-i]` v orodjih kalkulatorja | Kalkulator: register AUDIT |

Nič opozoril axe-core ne pomeni popolne skladnosti z WCAG. Pragovi so trije:
- 24 × 24 px je zahteva WCAG 2.2 AA (2.5.8);
- ≥ 40 px je pravilo projekta (`docs/pregled.md`);
- 44 × 44 px je raven AAA (2.5.5) in oblikovalski cilj za pomembne kontrolnike na dotik.

## 4. Skupni vzrok prekrivanj (za PR 1)

- `public/okna.js` `placeBubble()` se izogiba le oknom, `KEEP_CLEAR` (tipke kalkulatorja), `CONTROLS` v glavnem pogledu in pasovom `BANNERS`.
- Simulacij, PSE in obvestil ne pozna, prav tako ne elementov zunaj `main.view`.
- Ko prostega mesta ni (nizek zaslon), mehurček ostane, kjer je.
- CSS uporablja 28 različnih vrednosti `z-index` (od 1 do 1200) brez skupnih pravil.

Rešitev je sistemska in ne posamezni popravki CSS:
1. **Plasti kot spremenljivke** v `public/ui.css`: vsebina < `--z-noga` < `--z-mehurcek` < `--z-obvestilo` < `--z-okno` < `--z-modal`. Obstoječe vrednosti se preslikajo nanje.
2. **Oznaka `data-ne-prekrij`** za površine, ki jih plavajoči elementi ne smejo prekriti (simulacije, PSE, iskalna polja). `placeBubble()` jo upošteva skupaj z obstoječimi pravili. Površine kalkulatorja (grafi, vnos odgovora) se zajamejo s selektorjem v `okna.js`, kot `KEEP_CLEAR`, ali prek registra AUDIT. Datotek kalkulatorja ne urejamo.
3. **Nizek zaslon** (višina pod ~500 px): mehurček se umakne na rob kot majhen jeziček in ne prekriva vsebine.
4. **Obvestila** so vedno nad spodnjo vrstico in varnim območjem ter na drugi strani kot mehurček.
5. **Splošen test** v dimnem testu: noben fiksni element ne prekrije vidnega kontrolnika.

## 5. Vrstni red PR-jev

| PR | Vsebina | Pogoj |
|---|---|---|
| 0 | #1079: matrika naprav, referenčni paket, ta načrt | j odobri združitev |
| 1 | Pravila umeščanja plavajočih elementov (§4) | Po PR 0. Spor z #1050 (števec korakov) in #1077 je treba razrešiti |
| 2 | Ležeči telefon: višina, drsniki, navigacija, tipkovnica, ohranjanje stanja ob zasuku | Po PR 1 |
| 3 | WCAG 2.2 AA: axe, fokus, kontrast, 200 %, zmanjšane animacije | Po #1077 (profil A, 40 px in ARIA) |
| 4 | iPad: postavitev po razpoložljivem prostoru, ne po vrsti naprave (zdaj velja: vsaka naprava na dotik do širine 1240 px dobi telefonsko postavitev), razdeljeni pogledi | Po PR 2 |
| 5 | Matematični vnos | Kalkulator: samo prek registra AUDIT (lastnik kalkulatorja). Apple Pencil samo na pravi napravi |
| 6 | Videz: prazna stanja, hierarhija, pristajalna stran | Po #1078 (nastavitve, profil A). Brez manjšanja uporabne površine |
| 7 | Končna validacija in paket `EVKLID-UX-UI-PONOVNI-PREGLED.zip` | Po vseh odobrenih PR-jih |

Pred vsakim PR-jem j dobi opis z namenom, obsegom, tveganji in pričakovanim učinkom, in nato odloči.

## 6. Usklajevanje

- **Profil A** spreminja iste datoteke:
  - #1077: `style.css`, `ui.css`, `index.html`, `preveri-aplikacijo.cjs`;
  - #1078: nastavitve;
  - #1050: glava lekcije in `textbook.css`;
  - `scripts/preveri-aplikacijo.cjs` spreminjajo #1036, #1050, #1071, #1077 in #1078.
- **Kalkulator** (`public/graph/*`, `vnos-formul.js`, `predogled-vnosa.js` …): ugotovitve se vpišejo v `docs/revizija/register.md` (veja `review/chatgpt-audit`). Teh datotek ta sklop ne spreminja.
- **Inštruktor:** prompt in strežniški del ostaneta drugemu profilu. Preden se PR 1 dotakne `public/okna.js`, se uskladimo v #539.
- **Delo agentov:** kodo piše en agent zaporedno, ena veja naenkrat. Vzporedno delajo le pregledovalci (samo branje, ločen kontekst). Simulirane vloge se ne predstavljajo kot neodvisni pregledi.

## 7. Metodologija ocenjevanja (PR 7)

Uteži so enake kot pri ChatGPT:
- uspešnost opravila 25 %;
- izkoristek prostora 20 %;
- način vnosa 15 %;
- berljivost in matematični zapis 15 %;
- dostopnost 15 %;
- doslednost 10 %.

Vsaka naprava, orientacija in funkcionalnost se oceni posebej, s konkretnim dokazom (posnetek, izid testa ali opozorilo). Kar ni zanesljivo preverjeno (npr. Apple Pencil, bralniki zaslona na pravi napravi), je označeno kot »nepreverjeno«. Rezultatov uporabniških testov si ne izmišljujemo.
