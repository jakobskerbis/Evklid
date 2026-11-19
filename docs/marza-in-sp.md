# Marža in preživetje s.p.

Stanje 19. 11. 2026 (točki 20 in 22 načrta izboljšav po zunanjem pregledu). Vse spodaj je **ocena** iz cenika in
mej v kodi, ne izmerjen podatek in ne davčni nasvet: davčne predpostavke potrdi računovodja.

## 1. Najslabša marža po scenarijih

Pravilo »marža ≥ 75 %« (j, 4. 11.) se v kodi računa tako (`server/accounts/plans.js`, test `test/stopnje-cene.test.js`):
cena − Stripe (1,5 % + 0,25 € na plačilo) − strežnik (0,30 € na profil na mesec) − ves zajamčeni AI paketa (trda meja,
`server/meje-ai.js`), brez DDV, 1 $ = 0,92 €. Zajamčeni AI je **najslabši** primer: učenec, ki porabi vso mejo. Tipični
učenec porabi manj (točka 21: pravi podatki iz pilota).

Zajamčeni AI na profil na mesec: OŠ 1,9 $ (letno 1,7 $), SŠ 2,9 $ (2,58 $), faks 4,452 $ (3,693 $).

| Paket | Cena na mesec | A: zdaj v kodi (pod pragom DDV, 1 $ = 0,92 €) | B: pod pragom, 1 $ = 1 € | C: pod pragom, identificiran za DDV (obrnjena davčna obveznost na AI in strežnik, brez odbitka), 1 $ = 1 € | D: nad pragom 60.000 € (cena vsebuje 22 % DDV, vstopni DDV se odbije), 1 $ = 1 € |
|---|---:|---:|---:|---:|---:|
| OŠ mesečno | 9,99 € | 75,5 % | 74,0 % | 69,1 % | 68,3 % |
| OŠ letno | 8,25 € | 75,7 % | 74,0 % | 68,7 % | 68,3 % |
| SŠ mesečno | 13,99 € | 75,5 % | 73,8 % | 68,8 % | 68,1 % |
| SŠ letno | 11,58 € | 75,2 % | 73,5 % | 68,0 % | 67,6 % |
| Faks mesečno | 19,99 € | 75,3 % | 73,5 % | 68,2 % | 67,6 % |
| Faks letno | 16,58 € | 76,1 % | 74,3 % | 69,0 % | 68,6 % |

Izračun: marža = (neto cena − Stripe − strežnik − AI) / neto cena; v C sta AI in strežnik × 1,22; v D je neto cena
= cena / 1,22.

**Kaj to pomeni.** Pravilo 75 % drži samo v scenariju A (tečaj 0,92 € za 1 $ in brez DDV). Pri tečaju 1 : 1 je
najslabša marža 73,5–74,3 %, z obrnjeno davčno obveznostjo ali nad pragom DDV pa 67,6–69,1 %. To še vedno ni izguba,
je pa pod lastnim pravilom. Možnosti (odloči j; gre v že načrtovane cenovne predloge):
1. pravilo zapisati kot »≥ 75 % pri tečaju v kodi, brez DDV« (zdaj tako deluje koda);
2. pravilo preračunati na scenarij C ali D in znižati meje AI za ~8 %;
3. pravilo spremeniti na »≥ 65 % v najslabšem primeru, z DDV« in pustiti cene.

## 2. Neskladje 0,82 € proti 2,20 $ na učenca

Zunanji pregled je opozoril, da 20 dni × 10 vprašanj × 0,011 $ = 2,20 $ na mesec, dokument pa navaja 0,82 €.
- **0,82 €** je stara ocena »tipičnega« učenca iz `docs/stroski-ai.md` (večina odgovorov s hitrim modelom, 10 %
  podrobnih razlag), narejena pred sprotnim preverjanjem odgovorov in pred zamenjavo modelov.
- **0,011 $** je strošek enega odgovora po celotni poti s preverjanjem; vsak odgovor te poti ne gre.
- Obe sta oceni. Za maržo nista pomembni, ker jo določa trda meja (zgornja tabela), ne tipični učenec. Za ceno na
  učenca in poslovni načrt jo nadomesti meritev iz pilota (točka 21: strošek na aktiven profil na mesec iz tabele
  `usage`, ločeno po paketu in vrsti klica).

## 3. Načrt preživetja s.p.

Številke prispevkov so iz zunanjega pregleda (FURS, Mladipodjetnik.si), tukaj niso neodvisno preverjene.

| Stalni strošek na mesec (ocena) | Nov s.p., 1. leto | Nov s.p., 2. leto | Polni prispevki |
|---|---:|---:|---:|
| Minimalni prispevki | 465,78 € | 539,89 € | 651,04 € |
| Računovodja (ocena) | 60 € | 60 € | 60 € |
| Render Standard, domena, e-pošta (ocena) | 30 € | 30 € | 30 € |
| **Skupaj** | **~556 €** | **~630 €** | **~741 €** |
| Plačnikov SŠ (mesečno) za pokritje, ~9,6 € na plačnika | ~58 | ~66 | ~78 |
| Plačnikov OŠ (mesečno) za pokritje, ~6,9 € na plačnika | ~81 | ~92 | ~108 |

Prispevek na plačnika = cena brez DDV × najslabša marža iz scenarija C (SŠ 13,99 € × 68,8 % ≈ 9,6 €; OŠ 9,99 € × 69,1 %
≈ 6,9 €); število plačnikov je zaokroženo navzgor. Tipični učenec porabi manj AI, zato je pravi prispevek višji (točka 21).

**Realen trg v 12 mesecih (ocena zunanjega pregleda):** 600–1.200 plačnikov, veliko sezonskih (marec–junij), okoli
30.000–60.000 € prihodka na leto. To zadošča za en s.p., ne pa za podjetje z vlagatelji.

**Vprašanja za računovodjo (točka 1, ko jo j izbere):** ali študent lahko odpre s.p. in kaj izgubi (status, zavarovanje);
ali je d.o.o. brez plače direktorju cenejši v prvem letu; ali obrnjena davčna obveznost za Anthropic, Render in Stripe
zahteva identifikacijo za DDV že pod pragom; davčno potrjevanje računov pri plačilih s kartico prek Stripa (FURS);
OSS za kupce v drugih državah EU nad 10.000 €.
