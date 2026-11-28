# Prvi obisk z računi, kot v produkciji (27. 11. 2026)

## Povzetek
- Glavna številka: **obrazec »Začni brezplačno« je viden 1890 ms po odprtju strani, prej 4282 ms** (mediana 63 ponovitev na 9 napravah, nižje je bolje; cilj nadzorne plošče prvi obisk ≤ 2,5 s). Najpočasnejša od 63 ponovitev: 2060 ms (prej najhitrejša 4112 ms). Pod 2,5 s je 63 od 63 ponovitev.
- Pristajalna stran je vidna po ~1,2 s, kot prej (1217 ms, prej 1172 ms; razlika je v šumu, glej spodaj).
- Pomeni: nov obiskovalec evklid.app na počasnem omrežju (»Slow 4G«) vidi pristajalno stran po ~1,2 s. Ko se dotakne »Začni brezplačno« (najhitreje: takoj, ko stran vidi), dobi obrazec za registracijo po ~1,9 s namesto po ~4,3 s. Obrazec je enak do piksla kot prej (telefon 390 × 844 in računalnik 1440 × 900, registracija in prijava).
- Ne pomeni: da je tako na pravem telefonu. Merjeno v pogonih brskalnikov na strežniku v oblaku, procesor ni upočasnjen (kot K-12). Zakasnitev Renderja in pot do Slovenije nista zajeti.
- Zakaj ne K-12: `scripts/hitrost-naprav.cjs` (K-12, `matrika-naprav-2026-11-26.md`) meri prvi obisk **brez računov** (obrazec za nov profil, ~5 s). Tega obiskovalec evklid.app ne vidi: z računi (`EVKLID_ACCOUNTS=1`, produkcija) dobi pristajalno stran s strežnika. Zato nova skripta `scripts/hitrost-prvi-obisk.cjs`. Številka K-12 se s tem popravkom ne spremeni.

## Nabor
- 9 naprav in brskalnikov iz matrike K-12 (`scripts/matrika-naprav.cjs`): Android 360 in 412, iPhone SE in iPhone (WebKit), iPad pokončno in ležeče (WebKit), Windows 1366 (Chromium), Mac 1440 (WebKit), Firefox 1920.
- 7 ponovitev na napravo za »prej« in 7 za »potem«, vsaka s praznim predpomnilnikom (nov kontekst brskalnika).
- Pogoni: Chromium 158.0.8127.36, WebKit 26.6, Firefox 155.0 (Playwright 1.63).
- Kdo je določil pričakovani izid: cilj 2,5 s je z nadzorne plošče (K-12). Skriti kontrolni del: ne.

## Metoda
- **Ukaz:** `PLAYWRIGHT_BROWSERS_PATH=<mapa> node scripts/hitrost-prvi-obisk.cjs --samo <id> --ponovitve 7 [--koren <mapa prej>] --json <izhod>`, za vsako napravo najprej »prej«, nato »potem« (izmenično, enaki pogoji na stroju).
- **Commit:** »prej« je `main` d5addc9 (#1202), »potem« veja `claude/project-thread-8nmxre` (PR #1203). Skripta je ista za oba.
- **Stroj, strežnik in omrežje:** kot K-12: oblak, 4 jedra, Node 22, preizkusni način (`EVKLID_MOCK=1`, `EVKLID_SKRCI=1`), poleg tega `EVKLID_ACCOUNTS=1`. Posrednik doda vsakemu odgovoru 150 ms in pošilja po eni liniji 1,6 Mbit/s × 0,9 (`posrednik()` iz `scripts/hitrost-naprav.cjs`). Posrednik je HTTP/1.1 (največ 6 povezav), Render streže HTTP/2.
- **Časi** (od začetka nalaganja, merilnik v strani v sličicah `requestAnimationFrame`):
  - pristajalna: vidna pristajalna stran (`#view-auth .land`);
  - obrazec: v isti sličici, ko je stran vidna, klik na »Začni brezplačno«; do vidnega `#auth-form`;
  - aplikacija: `app.js` je zagnal račune (zavihek Račun ni več `hidden`).
- Pred merjenimi ponovitvami ena, ki ne šteje (strežnik ob prvi zahtevi stisne datoteke; WebKit dobi gzip namesto brotlija).
- **Ocenjevanje:** program, brez človeka.

## Izidi (mediana v ms, v oklepaju »prej«)

| Naprava | Pristajalna | Obrazec | Razpon obrazca (potem) | Aplikacija |
|---|---|---|---|---|
| Android telefon 360 × 740, Chrome | 1144 (1150) | **1812** (4142) | 1808–1882 | 4245 (4142) |
| Android telefon 412 × 915, Chrome | 1147 (1139) | **1814** (4131) | 1806–1908 | 4239 (4131) |
| iPhone SE 375 × 667, Safari | 1319 (1311) | **1984** (4426) | 1863–2060 | 4471 (4426) |
| iPhone 390 × 844, Safari | 1306 (1308) | **1966** (4392) | 1855–2027 | 4503 (4392) |
| iPad 820 × 1180 pokončno, Safari | 1343 (1329) | **2026** (4438) | 1828–2040 | 4531 (4438) |
| iPad 1180 × 820 ležeče, Safari | 1316 (1195) | **1987** (4357) | 1887–2011 | 4483 (4357) |
| računalnik 1366 × 768, Chrome/Edge | 1145 (1136) | **1815** (4134) | 1812–1952 | 4235 (4134) |
| Mac 1440 × 900, Safari | 1331 (1312) | **1995** (4425) | 1870–2048 | 4501 (4425) |
| računalnik 1920 × 1080, Firefox | 1162 (1169) | **1881** (4208) | 1868–1890 | 4254 (4208) |
| **Vse (63)** | 1217 (1172) | **1890** (4282) | 1806–2060 | 4423 (4282) |

- Razpona »prej« (4112–4644 ms) in »potem« (1806–2060 ms) se ne prekrivata na nobeni napravi.
- **Cena:** prevzem `app.js` je ~100 ms poznejši (mediana 4423, prej 4282 ms, +3 %), ker slogi drugih zaslonov (~95 KB stisnjeno) zdaj pridejo za moduli obrazca in si povezavo delijo z moduli `app.js`. Obiskovalec tega ne vidi: pristajalna stran in obrazec sta takrat že na zaslonu in delujeta.
- **Pristajalna stran** je pri iPadu ležeče 1316 ms (prej 1195), drugod ±20 ms. Sprememba ne vpliva na nič pred prvim izrisom (slogi in moduli se začnejo šele po njem), zato je to šum; ena meritev »prej« je bila hitrejša.
- Surove ponovitve: `prvi-obisk-2026-11-27.json`.

## Kaj je spremenjeno
- `public/zagon.js` (`obrazecSPristajalne`): na pristajalni strani dotik »Začni brezplačno« ali »Prijava« izriše obrazec z `account.js obrazecVnaprej`, ko je prenesen `account.js` (moduli obrazca so prvi na seznamu), ne šele po `app.js` in ~60 modulih.
- `public/zacetek.js`: slogi za druge zaslone se na pristajalni strani vklopijo, ko so moduli obrazca tu (`evklidZacetek.slogi`, varovalo 3 s, sicer v `konec`). Prej so jim na počasni povezavi vzeli ~0,7 s.

## Živa stran (samo smer, ne primerjava)
- evklid-a6az.onrender.com prek posrednika v oblaku (HTTP/1.1, Chromium, upočasnitev omrežja 150 ms in 1,44 Mbit/s v brskalniku, 3 ponovitve, pred tem popravkom): pristajalna stran ~1,6 s, obrazec po dotiku ~5,5 s.

## Omejitve
- Pogoni brskalnikov v Playwrightu, ne pravi telefoni. Procesor ni upočasnjen; na šibkem telefonu so časi daljši.
- Dotik takoj ob vidni strani je najslabši primer za obrazec: kdor se dotakne pozneje (bere stran), dobi obrazec takoj, ko je `account.js` že tu.
- Posrednik je HTTP/1.1. Pri HTTP/2 (Render) se zahteve ne čakajo na prosto povezavo, zato bi lahko bili časi drugačni (smer izboljšave ostane).
- Prvi obisk v drugem jeziku (brez jedra besedil) ni meril.

## Stroški
Klicev API: 0, cena: 0 $. Preizkusni način.
