# Faza 0 – izhodiščne meritve zmogljivosti (13. 11. 2026)

Izhodišče za vse naslednje PR-je o hitrosti in pomnilniku: vsak PR izmeri »prej« in »potem« z isto skripto
(`scripts/meritev-zmogljivosti.mjs`) in primerja s to stranjo. Surovi rezultati: `docs/meritve/zmogljivost-2026-11-13.json`.

## Povzetek

1. **Poraba AI (`usage`) je ozko grlo pri večji bazi.** Na sintetični bazi (1 000 000 vrstic porabe) traja sporočilo
   inštruktorju na strežniku **7,0 s** (mala baza: 67 ms), fotografija **2,9 s** (32 ms). Vsako sporočilo izvede ~30 vsot
   `SUM(cost_usd)` po tem mesecu ali dnevu (~230 ms vsaka), ker `usage` nima indeksa po `student_id` in planer bere
   ves mesec prek `idx_usage(created_at)`. V tem času je zanka dogodkov ustavljena za vse (zamik p99 7,1 s).
2. **Pomnilnik je blizu 512 MB.** RSS po zagonu 180–200 MB, po predgretju učbenika za tisk ~275–290 MB, med obremenitvijo
   do **530 MB** (mala baza, 50 hkratnih fotografij) in **493 MB** (velika baza). Prva prijava dvigne RSS na ~425 MB
   (scrypt N = 2^17 porabi 128 MB na izračun).
3. **Prijava:** scrypt traja ~435 ms na enem jedru; vrsta je omejena na 8 (`SCRYPT_QUEUE_MAX`), zato pri 10 in 50 hkratnih
   prijavah uspe le 8 (87 % oziroma 95 % dobi 503 »preobremenjen«).
4. **Veliko prevajanja SQL:** ~865 klicev `db.prepare` na eno sporočilo inštruktorju in 476 na fotografijo (vsak stavek se
   prevede ob vsakem klicu; vključno s 603× `PRAGMA table_info(classes)` in `SELECT … FROM sqlite_master` v zajemu).
5. **Lestvica** na veliki bazi (100 000 XP): 66 ms pri 1, 662 ms pri 10, 1,6 s pri 50 hkratnih (mala baza: 3 / 17 / 87 ms).
6. **Prvo odprtje (telefon, CPU 4×, Slow 4G):** 135 datotek (103 moduli JS, 25 CSS), aplikacija brez knjižnic 2,70 MB
   surovo / 0,85 MB brotli; `load` 15,5 s, FCP 4,0 s, LCP 17,7–18,3 s, Učna pot vidna po 20,9 s, CLS 0,26 (prijava) in
   0,69 (Učna pot), INP 176 ms. Strežnik vstavi **101 `modulepreload`** (`server/vstopna-stran.js`; `public/index.html` jih nima).

## Okolje in metoda

- Stroj: 4 jedra Intel Xeon 2,1 GHz, 16 GB, Linux, Node v22.23.4, Chromium 153 (Playwright). Pod `flock /tmp/evklid-tezko.lock`.
- **Strežnik je pripet na eno jedro (`taskset -c 0`)**, merilnik in brskalnik na jedrih 1–3. Render starter ima 0,5 CPU
  (kvota cgroup, ne pol jedra): procesorsko vezani časi so tam verjetno do ~2× daljši, z zastoji ob porabljeni kvoti.
- Strežnik: pravi `server/index.js` v svojem procesu, `EVKLID_ACCOUNTS=1`, `EVKLID_MOCK=1` (brez ključa API, pravi model
  ni bil nikoli klican), `EVKLID_MOCK_DELAY_MS=0` (brez umetnega čakanja med kosi odgovora), zavržena baza v začasni mapi,
  zavržen `EVKLID_DATA_KEY` (pogovori šifrirani kot v produkciji), `EVKLID_BACKUPS=0`, `EVKLID_CAS=0` (SymPy je ločen
  proces Python), `EVKLID_PDF=0`, `NODE_ENV` ni nastavljen (kot v `render.yaml`).
- Merilni predhodni modul v strežniku (`node --import`, samo za meritev, ni nove poti): `monitorEventLoopDelay`
  (ločljivost 10 ms; poročan je zamik nad 10 ms), ovoj `DatabaseSync.prototype.prepare` (zajem stavkov SQL) in
  `StatementSync.prototype.all/get/run` (čas stavka med zajemom); poroča prek IPC.
- Uporabniki: 50 računov prek API (registracija, potrditev, profil), naročnina v bazi (kot testi), vsak z 10 pogovori po
  20 šifriranih sporočil. Obremenitev je zaprta zanka: c delavcev, vsak vzame prostega uporabnika iz vrste (en uporabnik
  nikoli v dveh zahtevah hkrati; dnevna meja vprašanj na profil sicer ustavi enega samega). Ena meritev izdaja zahteve
  največ 30 s. Odjemalec sprejema gzip/br (kot brskalnik). Latenca je merjena pri odjemalcu na istem stroju.

### Ponovitev

```sh
flock /tmp/evklid-tezko.lock node scripts/meritev-zmogljivosti.mjs --json docs/meritve/zmogljivost-<datum>.json --md /tmp/m.md
# samo del:   --samo zagon | poti | sql | prvo | instruktor | velika   (z vejicami)
# drugo:      --stopnje 1,10,50  --uporabniki 50  --brskalnik chromium,webkit  --brez-taskset  --hitro  --obdrzi
```

Celota traja ~11 min (zagon ~1,5 min, mala baza ~4 min, velika baza ~6 min, ker so poti tam počasne). WebKit:
GitHub → Actions → »Meritev zmogljivosti« → Run workflow (`.github/workflows/meritev-zmogljivosti.yml`, samo ročno,
Chromium in WebKit, artefakt `meritev-zmogljivosti` z JSON in povzetkom).

## 0.1 Zagon

Čas od zagona procesa do prvega `/healthz` 200 (pravi `server/index.js`, 3×): **1852 ms** mediana (2088, 1852, 1761).
Na veliki bazi (350 MB): 1982 ms.

Po fazah v enem procesu (isto zaporedje kot `server/index.js`, predgretji zaporedno, brez predaha 15 s):

| Faza | t od zagona (ms) | RSS MB | kopica MB | external MB |
|---|---|---|---|---|
| začetek (pred uvozi) | 31 | 42 | 4 | 1 |
| po uvozih | 1763 | 184 | 92 | 3 |
| po `createApp` | 1852 | 173 | 74 | 3 |
| prvi `/healthz` | 1916 | 178 | 77 | 4 |
| po `warmStatic()` (165 datotek, 1956 ms) | 3873 | 186 | 72 | 12 |
| po `tiskPredgrej()` (11 strani, 6094 ms) | 9967 | 288 | 144 | 25 |
| po `gc()` | 10086 | 269 | 108 | 25 |

Pravi `server/index.js` (RSS iz `/proc`, predgrevanje tiska 15 s po zagonu):

| Ponovitev | /healthz | RSS ob /healthz | warmStatic | tiskPredgrej | največ RSS |
|---|---|---|---|---|---|
| 1 | 2088 ms | 199 MB | 165 datotek v 1615 ms, 192 MB | 11 strani v 6176 ms, 281 MB | 281 MB |
| 2 | 1852 ms | 193 MB | 165 datotek v 1681 ms, 191 MB | 11 strani v 6160 ms, 275 MB | 275 MB |
| 3 | 1761 ms | 180 MB | 165 datotek v 1520 ms, 191 MB | 11 strani v 6575 ms, 273 MB | 273 MB |

Lastnikove številke na razvojnem računalniku (171 → 174 → 344 → 409 MB, zagon ≈ 5 s) so višje pri `warmStatic`; tu
predgretje stisnjenih datotek doda le ~10 MB, predgretje tiska pa ~100 MB. Največji skok je torej `tiskPredgrej`.

## 0.2 Poti (mala baza)

p50/p95/p99 v ms pri odjemalcu; »zanka« = zamik zanke dogodkov v strežniku (p50/p99/največ, ms); »prepare« = klici
`db.prepare` na zahtevo.

| Pot | hkrati | n | p50 | p95 | p99 | zahtev/s | zanka p50/p99/max | prepare | statusi |
|---|---|---|---|---|---|---|---|---|---|
| prijava | 1 | 20 | 437 | 463 | 477 | 2,3 | 0/3/22 | 7 | 200×20 |
| prijava | 10 | 60 | 6 | 2291 | 3552 | 16,9 | 0/6/13 | 3,5 | 200×8, 503×52 (uspešne: p50 1819, p99 3552) |
| prijava | 50 | 150 | 62 | 653 | 3321 | 40 | 0/41/68 | 3,2 | 200×8, 503×142 (uspešne: p50 1976, p99 3748) |
| seznam pogovorov | 1 | 50 | 3,7 | 7,9 | 26 | 223 | 1/15/15 | 10 | 200 |
| seznam pogovorov | 10 | 200 | 21 | 64 | 73 | 370 | 6/43/43 | 10 | 200 |
| seznam pogovorov | 50 | 500 | 119 | 207 | 228 | 392 | 47/144/144 | 10 | 200 |
| odpri pogovor (20 sporočil) | 1 | 50 | 3,3 | 7,8 | 15 | 253 | 0/4/4 | 14 | 200 |
| odpri pogovor | 10 | 200 | 32 | 54 | 58 | 308 | 7/30/30 | 14 | 200 |
| odpri pogovor | 50 | 500 | 122 | 235 | 301 | 354 | 111/150/150 | 14 | 200 |
| sporočilo inštruktorju (SSE do konca) | 1 | 50 | 67 | 96 | 127 | 13,8 | 53/77/93 | 869 | 200 |
| sporočilo inštruktorju | 10 | 200 | 532 | 1133 | 1209 | 15,6 | 577/672/672 | 865 | 200 |
| sporočilo inštruktorju | 50 | 500 | 1991 | 4816 | 32 612 | 15,2 | 1579/2486/2486 | 865 | 200 |
| lekcija | 1 | 50 | 4,0 | 8,6 | 24 | 207 | 0/11/11 | 17 | 200 |
| lekcija | 10 | 200 | 29 | 43 | 46 | 327 | 8/24/24 | 17 | 200 |
| lekcija | 50 | 500 | 138 | 266 | 300 | 302 | 120/214/214 | 17 | 200 |
| lestvica | 1 | 50 | 2,7 | 4,5 | 6,6 | 352 | 1/2/2 | 24 | 200 |
| lestvica | 10 | 200 | 17 | 26 | 28 | 539 | 5/16/16 | 22 | 200 |
| lestvica | 50 | 500 | 87 | 135 | 178 | 497 | 33/68/68 | 22 | 200 |
| fotografija 342 KB (`scan/read`) | 1 | 50 | 32 | 57 | 68 | 27,4 | 21/36/46 | 476 | 200 |
| fotografija | 10 | 200 | 284 | 596 | 682 | 29,6 | 288/345/345 | 476 | 200 |
| fotografija | 50 | 500 | 1607 | 2665 | 3771 | 29,5 | 376/1739/1739 | 476 | 200 |

Največji RSS med meritvami: prijava 425 MB (scrypt), sporočilo pri 50 hkratnih 489 MB, fotografija pri 50 hkratnih
**530 MB** (telo JSON ~460 KB na zahtevo, 50 naenkrat v pomnilniku). Pretok sporočil je omejen na ~15/s, fotografij na ~30/s.

## 0.3 SQL na teh poteh (EXPLAIN QUERY PLAN)

70 različnih stavkov (7 poti in 5 načinov inštruktorja). SCAN brez indeksa:

| Tabela | Poti | Stavek |
|---|---|---|
| `conversations` | seznam pogovorov | `SELECT * FROM conversations WHERE student_id = ? ORDER BY updated_at DESC, id DESC` (ni indeksa po `student_id`) |
| `events` | odpri pogovor | `SELECT * FROM events WHERE conversation_id = ? ORDER BY id DESC LIMIT 1` |
| `events` | sporočilo, vsi načini | `SELECT mode FROM events WHERE conversation_id = ? AND message_id IS NOT NULL ORDER BY id DESC LIMIT ?` |
| `message_reports` | odpri pogovor | `SELECT message_id FROM message_reports WHERE conversation_id = ?` |
| `ai_credit_use` | sporočilo, fotografija | `SELECT COALESCE(SUM(usd),0) AS s FROM ai_credit_use WHERE created_at >= date('now','start of month')` |
| `class_members` | lestvica | `SELECT c.* FROM class_members m JOIN classes c ON c.id = m.class_id WHERE m.student_id = ? ORDER BY m.joined_at, c.id` |
| `usage` | »Razloži podrobneje« 2. (močnejši model) | `SELECT COUNT(*) AS n FROM usage WHERE student_id = ? AND kind IN ('chat','prekinjeno') AND model LIKE ? AND date(created_at) = date('now')` (1 M vrstic: 50 ms) |
| `sqlite_master` | sporočilo, lekcija, fotografija | `SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'school_licences'` (603× v zajemu) |

Poln pregled indeksa: dva stavka na `class_members` (`… WHERE m.student_id = ?`) gresta prek `sqlite_autoindex_class_members_1`
(indeks se začne s `class_id`) na poteh sporočilo, lekcija in fotografija. Začasno drevo B (`TEMP B-TREE`) v 8 stavkih
(npr. lestvica `GROUP BY`/`ORDER BY`).

Ni SCAN, a je najdražje (velika baza, glej 0.6): `SUM(cost_usd) FROM usage WHERE created_at >= date('now','start of month')`
(z in brez `student_id = ?`) in `… >= date('now')` gredo prek `idx_usage(created_at)` in preberejo vse vrstice obdobja.

## 0.4 Prvo odprtje

Statično (`server/startup-files.js`, kot jih strežnik postreže; brotli = kar strežnik pošlje z `Accept-Encoding: br`):

| Del | datotek | surovo | brotli |
|---|---|---|---|
| aplikacija JS (moduli) | 103 | 2042 KB | 672 KB |
| aplikacija CSS | 22 | 578 KB | 136 KB |
| aplikacija HTML + drugo | 4 | 78 KB | 38 KB |
| **aplikacija skupaj (brez knjižnic)** | **129** | **2698 KB** | **845 KB** |
| knjižnice (KaTeX, marked, DOMPurify) | 6 (3 CSS) | 372 KB | 98 KB |
| vse | 135 | 3070 KB | 943 KB |

Globina uvozov: najdaljša veriga statičnih uvozov ima 8 modulov (7 korakov: `/app.js > /schedule.js > /pass-offer.js >
/account.js > /profile-menu.js > /subject-switch.js > /i18n.js > /i18n/sl.js`); po nivojih odkrivanja (prvi uvoznik) 4.
Strežnik v `/` vstavi 101 `<link rel="modulepreload">`, zato brskalnik slapa ne čaka (v `public/index.html` jih ni).

Chromium 153, telefon 390×844, CPU 4× počasneje, Slow 4G (CDP, pomožne funkcije iz `scripts/meri-hitrost.cjs`),
prazen predpomnilnik, service worker izklopljen (sicer bi v ozadju prenesel še vse datoteke):

| Scenarij | load | Učna pot vidna | FCP | LCP (element) | CLS do tapov / skupaj | INP | dolge naloge (skupaj, najdaljša) | zahtev | prenos | surovo |
|---|---|---|---|---|---|---|---|---|---|---|
| neprijavljen (vstopna stran) | 15,5 s | – | 4,0 s | 18,3 s (`p.land-lead`) | 0,257 | – | 4 (1,6 s, 1,3 s) | 141 | 1139 KB | 3113 KB |
| prijavljen, nov profil | 15,6 s | 20,9 s | 4,1 s | 17,7 s (`p.muted`) | 0,688 / 0,732 | 176 ms | 10 (2,1 s, 1,3 s) | 168 | 1271 KB | 3438 KB |

INP je iz 4 tapov (preskoči vprašalnik zanimanj, Uči se, Jaz, Učna pot); LCP je za dogodkom `load`. Prenos vključuje
glave; zahteve do mirovanja omrežja + 2 s.

**WebKit: izmeri v GitHubu** (lokalno ni nameščen; delovni tok »Meritev zmogljivosti«, WebKit brez omejitev CPU in omrežja,
ker CDP ni na voljo).

## 0.5 Inštruktor (preizkusni način)

**Pravi model ni bil merjen** (brez ključa API, `EVKLID_MOCK=1`). To je samo čas strežnika pred in po klicu modela
(sestava poziva, meje porabe, zapis v bazo); preizkusni odgovor pride takoj (`EVKLID_MOCK_DELAY_MS=0`), zato so glave,
prvi bajt SSE in prvi `delta` skoraj hkrati. Mala baza, 1 uporabnik, 15 sporočil na način (ms):

| Način | do prvega bajta SSE p50 / p95 | do konca p50 / p95 |
|---|---|---|
| navaden | 60 / 87 | 60 / 87 |
| lahki (`lite`) | 62 / 103 | 62 / 103 |
| »Razloži podrobneje« (1.) | 59 / 107 | 59 / 107 |
| »Razloži podrobneje« (2., močnejši model) | 68 / 98 | 78 / 112 |
| s sliko (342 KB) | 133 / 211 | 144 / 224 |

Na veliki bazi je isto sporočilo 7,0 s (0.6), skoraj vse pred prvim bajtom.

## 0.6 Sintetična baza

5000 profilov (vsak s svojim računom), 200 000 šifriranih sporočil v 10 000 pogovorih (zadnjih 180 dni), 1 000 000 vrstic
`usage` (enakomerno v zadnjih 90 dneh, ~330 000 v tekočem mesecu), 100 000 `xp_events` (60 dni), 2000 `answer_cache`;
shema iz pravega strežnika, polnjenje 20 s, 347 MB. Plus 57 uporabnikov meritve kot zgoraj.

| Pot | hkrati | p50 | p95 | p99 | zanka p99 | opomba |
|---|---|---|---|---|---|---|
| prijava | 1 / 10 / 50 | 440 / 6 / 49 | 462 / 2254 / 651 | 463 / 3565 / 3266 | 3 / 4 / 30 | pri 10 in 50 enako 8 uspešnih, ostalo 503 |
| seznam pogovorov | 1 / 10 / 50 | 3,6 / 25 / 99 | 9 / 32 / 245 | 11 / 37 / 783 | 5 / 17 / 162 | |
| odpri pogovor | 1 / 10 / 50 | 3,3 / 28 / 124 | 8 / 62 / 147 | 12 / 115 / 149 | 5 / 55 / 115 | |
| **sporočilo inštruktorju** | 1 | **6993** | 7158 | 7158 | 7150 | 10 in 50 preskočeno (en krog bi trajal 70 s / 350 s) |
| lekcija | 1 / 10 / 50 | 4,5 / 32 / 109 | 7 / 94 / 211 | 15 / 126 / 1680 | 7 / 53 / 114 | |
| **lestvica** | 1 / 10 / 50 | **66 / 662 / 1615** | 75 / 737 / 8358 | 92 / 1365 / 32 341 | 82 / 468 / 1783 | |
| **fotografija** | 1 / 10 | **2870 / 17 973** | 3067 / 32 660 | 3067 / 32 818 | 3058 / 17 690 | pri 10: 3× ECONNRESET; 50 preskočeno |

Najdražji stavki v zajemu (velika baza):

| Skupaj | klicev | povprečno | Stavek | Načrt |
|---|---|---|---|---|
| 23,1 s | 101 | 229 ms | `SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE created_at >= date('now','start of month')` | `SEARCH usage USING INDEX idx_usage (created_at>?)` |
| 19,6 s | 85 | 231 ms | `… FROM usage WHERE student_id = ? AND created_at >= ?` | isto |
| 19,3 s | 85 | 228 ms | `… FROM usage WHERE created_at >= date('now','start of month') AND student_id = ?` | isto |
| 1,4 s | 93 | 16 ms | `… FROM usage WHERE created_at >= date('now')` | isto |
| 172 ms | 3 | 57 ms | lestvica: `SELECT x.student_id, p.nickname, SUM(x.amount) … FROM xp_events x JOIN league_profiles p …` | `idx_xp_time`, `TEMP B-TREE FOR GROUP BY`, `… ORDER BY` |
| 50 ms | 1 | 50 ms | `SELECT COUNT(*) … FROM usage WHERE student_id = ? AND kind IN (…) AND model LIKE ? AND date(created_at) = date('now')` | `SCAN usage` |

Na eno sporočilo pride ~11× vsota za ves mesec, 2 × ~9× vsota profila za mesec in ~10× vsota za danes (fotografija: po
4 vsake). Indeks `usage(student_id, created_at)` in en izračun vsot na zahtevo bi to odpravila; to je naloga naslednjih faz.
Seznam SCAN je enak kot na mali bazi.

## Česa ni bilo mogoče izmeriti

- **Pravi model** (Anthropic): ni ključa in klic ni dovoljen; merjen je le čas strežnika v preizkusnem načinu.
- **WebKit**: ni nameščen lokalno (`playwright install` ni dovoljen) → izmeri v GitHubu z delovnim tokom.
- **Render sam**: 0,5 CPU kot kvota in disk Renderja; tu en cel jedro in lokalni SSD. Številke z Renderja: spodaj.
- SymPy, varnostne kopije in prenos PDF-jev učbenika so bili izklopljeni (ločeni procesi oziroma občasna opravila).
- Sintetična baza nima `events`, `topic_state`, `tasks` in razredov; SCAN na `events` in `class_members` je zato tu
  poceni, v produkciji raste s številom sporočil oziroma članstev. Razporeditev `usage` je enakomerna (prava: z
  `scripts/meritev-produkcija.mjs`).
- Pri prijavi pri 10 in 50 hkratnih je le 8 uspešnih zahtev, zato so časi uspešnih prijav groba ocena.

## Za j na Renderju

1. **Metrics → Memory** (storitev `evklid`, zadnjih 7 dni): najvišji RSS in RSS v mirovanju, posebej takoj po objavi in
   ~15 s po zagonu (predgretje tiska), ter ob največjem prometu. Meja je 512 MB; tu je merjeno 180–290 MB v mirovanju in
   do 530 MB pod obremenitvijo. Zraven še **Metrics → CPU** v istem času.
2. **Logs**: poišči `pripravljenih` → vrstica `[evklid] pripravljenih N stisnjenih datotek v X ms` po vsaki objavi (tu:
   165 datotek v ~1,6 s), in `učbenik za tisk:` → `N strani v predpomnilniku v X ms` (tu: 11 strani v ~6,2 s).
3. **Shell** (samo branje, izpiše samo seštevke: delež `cache_read_tokens` po vrsti in modelu za 7 in 30 dni, število
   zapisov in `SUM(hits)` v `answer_cache`, število vrstic v vsaki tabeli):

   ```sh
   node scripts/meritev-produkcija.mjs          # baza iz EVKLID_DB (/var/data/evklid.db)
   node scripts/meritev-produkcija.mjs --json   # isto kot JSON
   ```

   Izpis pošlji v nit; po številu vrstic v `usage`, `messages` in `events` se odloči, ali je sintetična baza (0.6) blizu
   produkcije.
