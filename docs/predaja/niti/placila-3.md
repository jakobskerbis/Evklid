# Predaja: plačila 3 (4. 11. 2026, 11.45 UTC)

Iz niti »Dokončaj plačila in začetno stran« (cmsg_011HYzNBAS5HRU1H7PcSE7JtFYZvfHowHiR5JxFL8zayzd). Spomin: `evklid-stage-home.md`.

## Narejeno
- **PR #350 spojen** (squash fbe7666): začetna stran po stopnji (`public/zacetna.js`), faks študijsko leto od 1. 10., faks Haiku think + prva »Razloži podrobneje« Sonnet (`EVKLID_UNI_MID`), prompt OŠ/faks (j »Ok« 11.19), popravki plačil (i18n izbire paketa, `block.*` kode, delež AI ob nadgradnji po dnevih, garancija po času v Ljubljani, Podari ≥ 0, zasebnost, šolska meja samo učenci z mestom), INR/BDT/IDR letni 2 otroka 5.699 / 7.999 / 1.149.000 (j kartica 11.19).

## Odprto (majhno)
1. Števec Podari še ni na /sole (public/sole.html).
2. Naročilo pilota šole ne rezervira mesta (prvih 10 šol, server/schools.js / sole.js).
3. Besedila dnevne meje za brezplačne in šole v server/accounts/index.js (~468/477) samo slovensko: dodaj `block.*` kodo kot v server/usage.js blockInfo().
4. V arabščini `money()` v izbiri paketa kaže »9,90 €«, blok Podari »2.00 €«; »Podari Evklid« ni preveden.
5. Študent z mestom v dveh šolah šteje v obe šolski meji AI (redko).
6. ~~Rok hrambe garancije~~: narejeno, PR #365 (10 let po odločitvi, j kartica 11.52).
7. Ostala besedila `block.*` v drugih jezikih: »all {n}« ni preverjeno za n 1–4 (sl in en popravljena).

## Pravila
Stripe testni način; cene, ki jih ljudje vidijo, šele po j-jevi kartici (v »Odločitve zate«); trojni pregled po docs/pregled.md; splet in aplikacija enako; besedila sl + 32 jezikov. Poročaj optimizatorju 2 (cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB).

## Stanje 4. 11. 12.20 UTC: NAREJENO (PR #369 spojen, squash 7f3c8a3)
Točke 1, 2, 3, 4, 5, 7 narejene; 6 rešil #365 (zapis garancije se izbriše 10 let po odločitvi).
Ostane (majhno): naročilo, ki je že dobilo pilotno licenco, šteje dvakrat, dokler ga skrbnik ne označi »won«; skrbnik lahko »lost« pilotno naročilo odpre brez preverjanja mesta; v zavihku Račun (account.js ~759–764, 1246) so nekatera besedila še samo slovenska (»Naročnina«, »Brezplačni preizkus …«).
