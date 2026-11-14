# Zmogljivost: koliko sočasnih učencev zdrži paket starter

Točka D6 (sklop D, master brief j 13. 11. 2026). Meritev 14. 11. 2026.

## Kratek odgovor

- **Proces ne pade.** Pri 512 MB in 0,5 CPU (kot Render starter) je strežnik zdržal 20, 40, 60 in 80 sočasnih
  učencev v zaprti zanki (vsak ves čas pošilja vprašanja in fotografije, brez premora): 0 napak, 0 zavrnitev zaradi
  pomnilnika (failcnt 0, OOM 0). Največ pomnilnika procesa (anon, brez predpomnilnika datotek) ~290 MB, RSS (skupaj
  s kodo in knjižnicami) ~345 MB. Meritev je brez procesa SymPy, ki na Renderju teče ob strežniku (glej spodaj).
- **Meja je procesor, ne pomnilnik.** Strežnik obdela ~4 sporočila inštruktorju in ~1,3 fotografije na sekundo;
  nad tem zahteve čakajo v vrsti in odgovor pride pozneje, vendar pride. To velja za majhno bazo: na veliki bazi
  (5000 profilov) eno sporočilo še vedno porabi ~4 s strežnika (glej »Kar ostane«), zato bi bila meja tam precej
  nižja.
- **Koliko učencev:** brez premora (najslabši primer) se odgovor podaljša za ~4 s na vsakih 20 hkratnih učencev:
  pri 20 je gotov v ~4,0 s (p95 4,9 s), pri 80 v ~16,7 s (p95 20,1 s); od tega je ~0,7 s preizkusni »model«.
  Pri pravem učenju (učenec bere odgovor in piše naslednje vprašanje): ob ~20 s premora med dejanji je pri 40 hkratnih učencih odgovor gotov v ~1,0 s (p95 1,6 s, skoraj
  samo »model«), pri 80 v ~1,7 s (p95 4,6 s), pri 120 v ~5,2 s (p95 10,3 s). **Starter tako udobno zdrži ~80
  hkrati aktivnih učencev** (na majhni bazi); pravi učenci med vprašanji navadno premislijo dlje kot 20 s, zato
  verjetno še več.
- Pravi model doda čas do prvega žetona (in daljše odgovore izpisuje dlje); ta čas ni odvisen od števila učencev
  na strežniku in ga ta meritev ne vsebuje.

## Kako je merjeno

`node scripts/meritev-zmogljivosti.mjs --samo obremenitev` (privzeto `--pomnilnik 512 --cpu 0.5 --trajanje 120
--stopnje 20,40,60,80 --premor 0 --mock-zamik 15`).

- Pravi strežnik (`server/index.js`) v skupini cgroup v1: `memory.limit_in_bytes` 512 MB brez izmenjalnega prostora,
  kvota CPU 50 000 / 100 000 µs (0,5 CPU kot na Renderju), pripet na eno jedro. Ob preseženi meji ga ubije jedro
  (OOM), kot na Renderju.
- Preizkusni način namesto modela: odgovor ~270 znakov se pretaka ~0,7 s (45 kosov po 15 ms, približno hitrost
  Haikuja). Delo strežnika (prijava, baza, šifriranje, fotografije, SSE) je pravo.
- Vsak učenec je svoj račun z naročnino in pogovorom z 20 sporočili zgodovine. Zanka: 3 sporočila inštruktorju (do
  konca toka), nato fotografija 342 KB, izmenično v klepetu in v skeniranju; po 9 sporočilih nov pogovor.
- Vsaka stopnja traja 120 s, nato 5 s mirovanja (RSS po stopnji, za puščanje pomnilnika).
- Primerjava: ista skripta na `main` pred sklopom D (ba8962da) in po D1–D5 (d28787f5).
- Brez procesa SymPy (`EVKLID_CAS=0`), varnostnih kopij in učbenikov PDF: merjen je samo strežnik Node.

## Rezultati brez premora (najslabši primer)

Sporočilo inštruktorju, čas do konca odgovora (ms). »Prej« = pred D1–D5, »potem« = po D1–D5. p50 = polovica
odgovorov je hitrejših, p95 = 95 % jih je hitrejših.

| Hkrati | zahtev ok / napak | p50 prej → potem | p95 prej → potem | s fotografijo p95 prej → potem | največ anon / RSS MB (potem) | OOM |
|---|---|---|---|---|---|---|
| 20 | 727 / 0 → 730 / 0 | 4007 → 4010 | 4695 → 4877 | 5642 → 4957 | 242 / 298 | 0 |
| 40 | 653 / 0 → 694 / 0 | 8892 → 8302 | 10448 → 9338 | 13171 → 12164 | 266 / 322 | 0 |
| 60 | 665 / 0 → 681 / 0 | 12923 → 12781 | 17469 → 15663 | 20857 → 18973 | 281 / 337 | 0 |
| 80 | 693 / 0 → 693 / 0 | 17011 → 16681 | 25548 → 20056 | 26171 → 29907 | 289 / 345 | 0 |

- Prepustnost je pri vseh stopnjah enaka (~4 sporočila/s): strežnik je ves čas zaseden (kvota CPU je bila porabljena
  in proces ustavljen skupaj 49–57 s od 120 s).
- Na majhni bazi (merjena baza ima le testne učence) D1–D3 skoraj ne vplivajo; pri veliki bazi glej spodaj.
- Šum meritve je po oceni ±10–20 % (stroj deli jedra z drugim delom), zato razlike prej/potem v tej tabeli niso
  pomembne (pri 80 je p95 s fotografijo celo višji).
- Pomnilnik po stopnjah (mirovanje RSS): 273 → 307 → 323 → 314 MB. Rast se umiri (verjetno polnjenje
  predpomnilnikov); puščanje bi dokončno izključila šele dolga meritev (več ur).

## Rezultati s premorom (bolj podobno pravi rabi)

`--premor 20000 --stopnje 40,80,120,160`: po vsakem dejanju učenec počaka naključno 0–40 s (povprečno 20 s), tudi
pred prvim (učenci ne začnejo hkrati). Pri prvem zagonu so vsi začeli v isti milisekundi; začetni naval je dvignil p95
(pri 40 učencih 8,2 s) in pri 120 in 160 je bilo 7 prekinjenih povezav (ECONNRESET) od ~1340; proces ni padel.
V ponovljeni meritvi z razpršenim začetkom (spodaj) ni bilo nobene napake. Po D1–D5 in z `busy_timeout`.

| Hkrati | zahtev ok / napak | sporočilo p50 / p95 ms | s fotografijo p95 ms | sporočil na s | največ anon / RSS MB | OOM |
|---|---|---|---|---|---|---|
| 40 | 205 / 0 | 1009 / 1578 | 1550 | 1,0 | 232 / 289 | 0 |
| 80 | 438 / 0 | 1725 / 4629 | 4943 | 2,0 | 236 / 292 | 0 |
| 120 | 603 / 0 | 5199 / 10276 | 10704 | 2,7 | 254 / 310 | 0 |
| 160 | 632 / 0 | 11068 / 21355 | 22687 | 2,8 | 287 / 343 | 0 |

- Do ~80 učencev strežnik ni nasičen (odgovor ~1–2 s, od tega ~0,7 s preizkusni »model«); pri 120 in več je
  procesor polno zaseden in čakanje hitro raste.
- Za pilot: dokler je hkrati aktivnih manj kot ~80 učencev, hitrost odgovora ni odvisna od strežnika.

## Pomnilnik na Renderju

- `memory.usage_in_bytes` šteje tudi predpomnilnik datotek (baza, statične datoteke); graf »Memory« na Renderju
  verjetno tudi (tega nismo preverili). Pri 80 učencih je bil ta skupni vrh 505 MB, blizu meje 512 MB, pomnilnik
  procesa pa le ~290 MB. Predpomnilnik datotek jedro ob pritisku sprosti, zato tak vrh ni nevaren; meja ni bila
  nikoli dosežena (failcnt 0, OOM 0).
- Zato Straža (D4, `/healthz/stanje` → `pomnilnik`) šteje samo `anon + shmem` vseh procesov vsebnika (tudi SymPy)
  in opozori nad 85 % meje.
- Na Renderju ob strežniku teče še proces SymPy (Python), ki ga ta meritev ne vsebuje; njegov pomnilnik pride zraven.
- Del točke D4 »stisnjene datoteke pripravi z manj pomnilnika« ni bil potreben: ob zagonu proces porabi ~245 MB
  RSS, pod obremenitvijo največ ~345 MB, kar je ~67 % od 512 MB (brez SymPy).

## Najdena napaka: zaklep baze

Med meritvijo je zapis drugega procesa v bazo (merilnik je ponastavljal dnevno mejo vprašanj; v produkciji npr.
skripta v lupini Renderja) povzročil »database is locked« in napako 500 za učenca, ker strežnik na zaklep ni čakal
(privzeto 0 ms). Popravek: `PRAGMA busy_timeout = 2000` v `server/db.js` (strežnik počaka največ 2 s), test
`test/zaklep-baze-d6.test.js`. Med čakanjem stoji ves strežnik (baza je sinhrona), zato naj bodo zapisi drugih
procesov kratki.

## Sklop D: številke prej in potem

Vse z isto skripto pred spremembo in po njej. Surovi izpisi meritev D6: `docs/meritve/obremenitev-2026-11-14-*.md`.

| Točka | PR | Prej | Potem |
|---|---|---|---|
| D1 indeksi | #680 | sporočilo inštruktorju na veliki bazi (5000 profilov, 1 M vrstic porabe) p50 9703 ms; fotografija 3604 ms | 4097 ms; 1265 ms |
| D2 poraba »danes« | #681 | `deepToday` 43 ms | 4,6 ms |
| D3 zgodovina enkrat | #682 | pogovor s 60 sporočili in 4 fotografijami: 51 ms strežnika na sporočilo (3 branja) | 23 ms (1 branje) |
| D4 Straža pomnilnika | #683 | ni opozorila pri nobeni porabi | opozorilo nad 85 % v zadnjih 30 min |
| D5 izpis med pretakanjem | #684 | 3085 znakov, 24 formul: 1188 ms procesorja | 67 ms |
| D6 obremenitev | ta dokument | glej tabeli zgoraj | proces ne pade (80 učencev brez premora, 160 učencev s premorom); ~80 hkrati aktivnih udobno; zaklep baze popravljen |

## Kar ostane

- Na veliki bazi sporočilo inštruktorju še vedno porabi ~4 s strežnika (merjeno na celem jedru; pri 0,5 CPU
  verjetno do dvakrat dlje): ~11 mesečnih vsot porabe **vseh** učencev na sporočilo (meje stroškov).
  Rešitev bi bila kratkotrajen predpomnilnik teh vsot (predlog, ni v briefu).
- Meritev je brez pravega modela in brez pravega telefona; omrežje je lokalno.
