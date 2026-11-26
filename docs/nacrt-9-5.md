# Načrt dviga kakovosti do 9,5 (odobril j 26. 11. 2026)

Javni povzetek zasebnega načrta (Claude Doc) in nadzorne plošče »Evklid: kakovost do 9,5«, ki ju profil B ne more
odpreti. Stanje: 26. 11. 2026 ob 9.30 po slovenskem času. PR-ji so preverjeni na GitHubu, ugotovitve revizije pa so
povzete z nadzorne plošče, ki jo dnevno primerja `scripts/revizija-stanje.mjs`. Ta datoteka je posnetek, zato se ne
posodablja sproti. Velja stanje PR na GitHubu.

**Postopek (j, 26. 11.):** B uskladi svoje poročilo za beto (21 točk P0) s tem načrtom in odstrani, kar načrt že
pokriva. Seznam za B gre j-ju v potrditev, preden kdorkoli spremeni kodo.

## Stalna pravila (j)

- Združitev v `main` in objava samo z j-jevo izrecno odobritvijo. PR #934 (revizija) se nikoli ne združi.
- Načrtovano se ne predstavlja kot dokončano. Zelen CI ni dokaz matematične ali pedagoške pravilnosti.
- Matematika povsod v LaTeX/KaTeX.
- Vsaka meritev ima n, imenovalec, 95-% interval in metodo (predloga `docs/meritve/README.md`).
- Neodvisni nabori, tudi za BIO, in človeški strokovni pregledovalci (po prvem plačilu; do takrat uradne rešitve RIC,
  DMFA in ZOTKS).
- Primerjalna skupina v 2. fazi pilota. Zunanji varnostni pregled pred komercialno objavo.
- Postopno uvajanje in hitra vrnitev (#1139): od 10. 12. 2026 se združitve objavljajo samo ponoči med 3. in 5. uro.
  Vrnitev na prejšnjo različico je v delovnem toku Render (vhod `vrni_na`).
- Pilot se ne začne, dokler je odprta resna napaka (pogoj g10). Register revizije ostaja usklajen z GitHubom.
- Brez nepotrebnih funkcij in brez podvajanja dela profila B.
- Razporeditev zmogljivosti profila A: preverjanje 35 %, inštruktor 20 %, revizija 10 %, priprava 20 %, UX 15 %.
  Pilot ima dve fazi. Meja za plačljive meritve je 60 $ na mesec.

Lastniki: **A** = profil A (ta projekt), **B** = profil B (#539), **kalk.** = seja kalkulatorja (`CLAUDE.md`: edina
ureja `public/graph/*`, `public/vnos-formul.js`, `public/predogled-vnosa.js`, `server/practice/check.js`,
`server/live-check.js`, `server/sodba-koraka.js`). Dokler B ne zaključi #959, #1013, #1017 in #1023, kalkulator ureja B.
**j** = odločitev ali ročni korak j-ja.

## Naloge

### P0: pred pilotom 10. 12.

| ID | Kaj | Lastnik | Stanje | Datoteke | Merilo |
|---|---|---|---|---|---|
| K-01 | Uskladitev registra revizije z GitHubom in skripta, ki razlike najde sama | A | združeno #1135; preostanek pri B | `scripts/revizija-stanje.mjs`, veja `review/chatgpt-audit` | 0 razlik (26 → 6) |
| K-02 | Vsaka zaključena ugotovitev ima test z oznako AUDIT-NNN, ki na stari kodi pade | A (skripta) + B (testi kalk.) | v delu; manjkajo 029, 031, 033, 052 | `test/*`, `scripts/revizija-stanje.mjs` | vsaka zaključena ima test |
| K-03 | Ponovni pregled 19 združenih popravkov (test na `main`, ponovitev na evklid.app) | A preveri, B popravi | odprto | register | vsaka z dokazom ali ponovno odprta |
| K-04 | Varna odpoved preverjevalnikov (SymPy, Lean, model) | A | PR #1147 odprt | `server/cas.js`, `server/preverjanje/` | 0 trditev nad statusom dokaza ob izpadu |
| K-13 | Notranji varnostni pregled (OWASP ASVS 1. raven) | A | združeno #1141 | več (poročilo zasebno) | 0 kritičnih ali visokih |
| K-15 | Predloga poročila meritve in nadzorna plošča | A | združeno #1136 | `docs/meritve/README.md` | n, imenovalec, interval, metoda |
| K-17 | Postopno uvajanje in hitra vrnitev | A + j (Render) | združeno #1139 | `scripts/render-objava.js`, `.github/workflows/` | vrnitev < 5 min; nočno okno od 10. 12. |
| N-01 | Nabor 1.020 trditev za preverjevalnike | A | združeno #1133 | `test/fixtures/preverjanje/` | 0 napačno potrjenih na 512 napačnih trditvah |
| N-08b | Učna pot iz predpomnilnika | A | združeno #1131 | `public/` | ponovni obisk hitrejši |
| N-09/10 | Meritve pilota, preizkus pred in po | A | združeno #1123 | `server/pilot*`, `content/pilot-preizkus/` | D14/D30, samostojnost, strošek |
| N-11 | Pilot samo s polnoletnimi | A | združeno #1121 | `server/accounts/`, `server/vabila*.js` | koda vabila zavrne < 18 |
| PV-04 | Popis pokritosti trditev po delih aplikacije | A | odprto | `server/preverjanje/`, `scripts/meri-preverjanje.mjs` | poročilo za 19 mest |
| PV-05 | Dnevna meritev preverjevalnikov v CI | A | odprto | `.github/workflows/`, `scripts/meri-preverjanje.mjs` | opozorilo ob vsakem napačno potrjenem |
| P1-1 | Popravki AUDIT-058–066, 068, 069 | B | 11 PR odprtih (#1000–#1022) | `server/live-check.js`, `server/sodba-koraka.js` | vsi združeni z regresijskim testom |
| P1-2 | Odrezani odgovori inštruktorja se dokončajo | B | združeno #1132 | `server/` (inštruktor) | 0 odrezanih na zlatem naboru |
| 080/081 | Racionalne enačbe, ničle na robu območja | kalk. (B) | brez PR | kalkulator, enačbe | 0 lažnih in 0 izgubljenih rešitev na 800 primerih proti SymPy |
| PR 7 | Vmesnik priprave iz zapiskov | A1 | čaka j (makete) | `public/priprava/` | od zapiskov do kviza ≤ 3 min |

### P1: december

| ID | Kaj | Lastnik | Stanje | Datoteke | Merilo |
|---|---|---|---|---|---|
| K-06 | Neodvisni nabor inštruktorja: 2.000 MAT + 1.000 FIZ/KEM | A | odprto | `test/fixtures/instruktor-*`, `scripts/meri-*` | ≥ 30 % uradni viri, 20 % skrit kontrolni del |
| K-07 | Pedagoška rubrika in neodvisno ocenjevanje razlag | A gradi, B uporablja | odprto | `test/fixtures/instruktor-*` | 100 pogovorov, ujemanje ocenjevalcev, 10 % človeški vzorec |
| K-08 | Meritev in vklop »Podobna naloga« | A meri, j vklopi | odprto | `scripts/meri-*` | 0 napačnih tem ali odgovorov na 200 primerih |
| K-09 | Integracijski testi med moduli (skener → preverjanje → vaja, priprava → vaja → napredek, pogovor → kartice, registracija → plačilo v testnem načinu → pravice) | A | odprto | `test/integracija-*` | 4 poti zelene |
| K-10 | Primerjava z Astro na enakih zapiskih | A1 + j | v delu | `server/priprava/` | 10 kompletov, 5 meril |
| K-11 | Dostopnost WCAG 2.2 AA | A; kalkulator B/kalk. | odprto | `public/` | 0 serious/critical na 20 zaslonih |
| K-12 | Matrika platform, meritve pred in po | A | odprto | `scripts/posnetki-naprave.cjs` | 9 kombinacij, 0 prekrivanj |
| K-14 | Obremenitev in stroški | A | v delu (PR sledi) | `scripts/meritev-zmogljivosti.mjs`, `server/accounts/` | 50 hkratnih, p95 ≤ 3 s brez AI |
| K-16 | Neodvisni nabor BIO | A | odprto | `test/fixtures/` | ≥ 500 nalog, ≥ 30 % RIC, 20 % skrito |
| K-18 | Človeški strokovni pregledovalci | A + j | čaka prvo plačilo | – | ≥ 2 učitelja na predmet, ujemanje poročano |
| P1-5/6 | Vklop napačnih predstav in stopenj namigov | B | vmesnik v `main` (#1111–#1113), vklop odprt | `prompts/`, `server/napacne-predstave.js` | ni slabše na zlatem naboru |
| PV-06 | Preverjevalnik korakov (območja, izgubljene rešitve) | A | odprto | `server/preverjanje/` | 50 napačnih prehodov ujetih, 0 lažnih na 200 |
| PV-07 | Enote in zaokroževanje po korakih | A | odprto | `server/preverjanje/` | enote v vseh fizikalnih generatorjih |
| PV-08 | Vse lekcije v trditve s statusi | A | čaka #1011–#1013 (B); PR #1035 | `scripts/`, CI | ≥ 90 % korakov preverjenih |
| PV-09 | Lean L2 za lekcije | B | PR #1142, #1145 odprta | `lean/` | 43 od 208 lekcij; vsak izrek z id in sha256 |
| PV-10 | 688 generatorjev: neodvisen preračun | A | odprto | `server/practice/` (generatorji) | vsak generator ima status |
| PV-11 | Pole mature, NPZ, tekmovanj v trditve | A | odprto | `content/exam-papers/` | poročilo po nalogah |
| 019 | Dotikalna presečišča | kalk. | brez PR | `public/graph/*` | ≥ 99 % od 20.000, 0 lažnih |
| 078 | Predpone SI v Vadnici (pF/PF) | kalk. | brez PR | `server/practice/check.js` | 40 primerov velikih in malih črk |
| P2-4, PR 8–9 | Diagnostika predznanja, kartice in kvizi v pripravi | A1 | odprto | `server/priprava/`, `public/priprava/` | – |

### P2 in pozneje

K-05 (kalkulatorja v skupnih statusih, B), K-19 (primerjalna skupina, faza 2), K-20 (zunanji varnostni pregled, j),
PV-13 in PV-14 (prevajalnik in delavec Lean, A), PV-15 in PV-16 (strukturirani koraki in samopopravek inštruktorja,
B), PV-17 in PV-18 (značke statusa in trditve v vseh delih, A), priprava PR 10–14 (A1), PV-19 do PV-22 (na j-jevo
kartico o strošku, PV-21 po prvem plačilu).

## Točke, ki jih načrt dodeli profilu B

1. **P1-1:** združiti odprte popravke #1000, #1001, #1009, #1011, #1012, #1013, #1015, #1016, #1018, #1021, #1022
   (AUDIT-058–066, 068, 069), vsak z regresijskim testom. To je pogoj za fazo 1 (ugotovitve P1: 058, 059, 060, 066).
2. **Kalkulator (dokler je pri B):** #959 (022), #1017 (067), #1023 (085, napačen naslov »070«), #1024 (021, 071).
   Nov PR za AUDIT-080 in 081 (081 je P1 in pogoj za fazo 1). Potem 019, 078, 023 in potrditev ugotovitev NOVO.
3. **K-02:** testi z oznako AUDIT za kalkulator: 029, 031, 033, 052.
4. **K-01, preostanek:** 6 neskladij registra (zastareli statusi in oznake pri B-jevih PR, glej komentar v #539
   26. 11. ob 7.22).
5. **K-03:** popravki, ki jih ponovni pregled A ponovno odpre v kalkulatorju ali inštruktorju.
6. **P1-5/P1-6:** vklop napačnih predstav in stopenj namigov v pozivu (vmesnik A je v `main`).
7. **PV-09 in Lean L2** za preostale lekcije (#1142, #1145). PV-12, PV-15, PV-16, K-05.
8. **K-07:** B uporabi rubriko, ki jo zgradi A, pri spremembah poziva.
9. **K-11:** dostopnost kalkulatorja.
10. **AUDIT-084:** izris formule v potrditvi skenerja. Kalkulatorski del ureja B, skenerski del A2 (dogovor v #539).

## Točke brez določenega ali potrjenega lastnika

- **AUDIT-070, 072, 073, 074, 082, 083** (NOVO, še niso potrjene). Register jih pripisuje kalkulatorju, vendar jih
  nihče še ni potrdil ali prevzel.
- **AUDIT-035 in 036** (»V preverjanju«): ni zapisano, kdo preveri, ali sta že odpravljeni z #956.
- **AUDIT-076:** popravek je v `main` (#1140, 26. 11.), register pa še kaže NOVO. Kdo ga zaključi in doda test?
- **Delitev AUDIT-084** med B in A2 je dogovorjena le v komentarju. Če B ne potrdi, je lastnik nedoločen.
- **PV-19 do PV-22** (strogi način, strežnik Lean, učiteljski pregled): lastnik po j-jevi kartici o strošku.
- **Beta P0 profila B (21 točk)**, ki jih ta načrt ne pokriva, npr. zasebnost povratnih informacij, metrika D30
  (N-09 jo že meri), dodelitve učitelja ter uvajanje staršev in učiteljev: lastnik po j-jevi potrditvi seznama.

## Odprte ugotovitve revizije po lastniku

Stanje nadzorne plošče 26. 11.: 85 ugotovitev, 40 zaključenih, **45 odprtih**. »Ponovni pregled« pomeni, da je
popravek v `main` ali v odprtem PR in da čaka dokaz ali združitev.

### Profil A (4)

| ID | P | Področje | Stanje | PR |
|---|---|---|---|---|
| 001 | P1 | Skener, preverjanje rešitev | ponovni pregled, popravek v `main` | #935, #1089 |
| 042 | P1 | Klepet, preverjanje računa (datoteke kalk.) | ponovni pregled, popravek v `main` | #976 |
| 075 | P3 | Laboratorij, titracija | ponovni pregled, popravek v `main` | #1085 |
| 077 | P3 | Zagon strežnika | ponovni pregled, popravek v `main` | #1081 |

### Profil B, inštruktor (preverjanje računa v klepetu) (10)

| ID | P | Kaj | Stanje | PR |
|---|---|---|---|---|
| 058 | P1 | Pretvorbe enot s predponami | odprt PR | #1012 |
| 059 | P1 | Rezultat z vprašajem | odprt PR | #1001 |
| 060 | P1 | Napaka ob meji porabe | odprt PR | #1009 |
| 061 | P2 | Toleranca pri velikih številih | odprt PR | #1011 |
| 062 | P2 | »:«, € in % | odprt PR | #1013 |
| 063 | P2 | Znan odvod | odprt PR | #1015 |
| 064 | P2 | Skriti blok RACUN | odprt PR | #1016 |
| 065 | P2 | Ponarejena skrita opomba | odprt PR | #1018 |
| 066 | P1 | »Če«, »ali«, »?« izklopijo preverjanje | odprt PR | #1000 |
| 069 | P2 | Gol rezultat | odprt PR | #1022 |

### Seja kalkulatorja (zdaj B) (30)

| ID | P | Področje | Stanje | PR |
|---|---|---|---|---|
| 003 | P1 | Vnos integrala | ponovni pregled, v `main` | #940, #965 |
| 014 | P2 | Drsniki | ponovni pregled, v `main` | #948 |
| 019 | P2 | Presečišča | potrjeno, brez PR | – |
| 021 | P2 | Izris ukaza CAS | odprt PR | #1024 |
| 022 | P2 | Dotik indeksa korena, logb | odprt PR | #959 |
| 023 | P3 | Neznana imena funkcij | potrjeno, brez PR | – |
| 026 | P2 | Isto besedilo, drug pomen | ponovni pregled, v `main` | #961 |
| 029 | P3 | Kombinatorika | ponovni pregled, v `main`, brez testa | #966 |
| 031 | P2 | Iracionalne rešitve z »=« | ponovni pregled, v `main`, brez testa | #968 |
| 035 | P2 | ∑/∏ s praznim telesom | v preverjanju | – |
| 036 | P2 | Prazna predloga det/inverz | v preverjanju | – |
| 039 | P3 | Označevanje v predlogi | ponovni pregled, v `main` | #973 |
| 047 | P2 | ⌫ v meji integrala | ponovni pregled, v `main`, brez testa | #945, #970 |
| 052 | P2 | Kazalec v »10« pri ×10ˣ | ponovni pregled, v `main`, brez testa | #992 |
| 056 | P3 | Grafični, RTL | ponovni pregled, v `main` | #1006 |
| 057 | P3 | 3D graf, RTL | ponovni pregled, v `main` | #1019 |
| 067 | P1 | Tipka predloge v prazni reži | odprt PR | #1017 |
| 068 | P3 | Kompleksne ničle v gruči | odprt PR | #1021 |
| 070 | P3 | Tanek drsnik v Chromiumu na Windows | NOVO | – |
| 071 | P3 | Tiha zavrnjena tipka | odprt PR | #1024 |
| 072 | P3 | Zgodovina v dveh vrsticah (#735) | NOVO | – |
| 073 | P3 | Drsniki v skicah Formul (#736) | NOVO | – |
| 074 | P3 | Počasne skice Formul (#737) | NOVO | – |
| 076 | P2 | Čipi »Nedavno« | register NOVO, popravek združen | #1140 |
| 078 | P3 | Predpone SI v Vadnici | odobreno, brez PR | – |
| 080 | P2 | Racionalna enačba z luknjo | odobreno, brez PR | – |
| 081 | P1 | Ničla na robu območja | odobreno, brez PR | – |
| 082 | P3 | Ključ regresije v izpisu | NOVO | – |
| 083 | P2 | Ležeč telefon, zgodovina | NOVO | – |
| 085 | P2 | Integral s spremenljivo mejo | odprt PR | #1023 |

### Skupaj B in A (1)

| ID | P | Področje | Stanje |
|---|---|---|---|
| 084 | P2 | Izris formule v potrditvi skenerja | odobreno, brez PR (kalkulatorski del B, skenerski A2) |

## Pogoji za pilot (faza 1, 10. 12., polnoletni)

1. N-01 v `main` z 0 napačno potrjenimi (izpolnjeno, #1133), PV-05 dnevna meritev.
2. Vse ugotovitve P1 zaključene z regresijskim dokazom: 001, 003, 058, 059, 060, 066, 067, 081 (in 080 v istem PR).
3. K-04 in K-13 (K-13 izpolnjeno, #1141).
4. #1121 in #1123 (izpolnjeno).
5. Strop porabe na učenca deluje (del K-14).
6. Posnetki na napravah članov brez napak (del K-12).
7. Ročni koraki j (UptimeRobot, alarm, Stripe webhook, meja Anthropic).
8. g10: brez odprtih P0/P1 in brez kritičnih ali visokih varnostnih točk.

Faza 2 (30–50, tudi mladoletni in učitelji): pregled odvetnika, soglasja, DPIA, izmerjena K-06 in K-07, zelena K-09 in
K-11, poročilo faze 1 brez odprtih P1.
