# Obremenitev: sporočilo inštruktorju in fotografija pri 50 hkratnih (26. 11. 2026)

Naloga K-14 načrta dviga kakovosti (merilo: 50 hkratnih, p95 ≤ 3 s brez AI). Primerjava `main` pred popravkom
(»prej«) in veje s popravkom (»potem«). Obe sta merjeni z isto skripto, na istem stroju, isti dan.

## Povzetek
- **Glavna številka.** Sporočilo inštruktorju v preizkusnem načinu (brez pravega modela) pri 50 hkratnih, en procesor,
  odprte povezave: **p95 2063 ms** (prej 4988 ms; cilj ≤ 3000 ms, nižje je bolje).
  - n = 500 zahtev potem in 367 prej. Prej je naletelo na rok 30 s, potem je 500 zahtev končalo v ~18 s.
  - Fotografija v skeniranje (`scan/read`, 342 KB): **p95 1501 ms** (prej 2449 ms), n = 500.
- **Kot Render starter (0,5 procesorja, 512 MB, D6).** Strežnik v 90 s obdela 2,4-krat več zahtev (1043 in 1083
  namesto 434). Sporočilo p95 6,6 s namesto 15,1 s. Ne pade, vrh pomnilnika je 425 MB namesto 482 MB.
- **Kaj se je spremenilo:**
  - Pogosti stavki SQL se ne prevajajo več ob vsakem klicu: 247 namesto 1175 prevajanj na sporočilo.
  - Oblikovalnik časovnega pasu pilota se ne ustvari več ob vsakem klicu; prej je porabil ~10 % procesorja.
  - Kopica V8 je omejena na 256 MB. Brez te meje je hitrejši strežnik v vsebniku s 512 MB vsakič padel (OOM, 4 od 4).
- **Ne pomeni:**
  - Čas pravega modela (Anthropic) v meritvi ni zajet, učenec nanj čaka še dodatno.
  - Pri 0,5 procesorja cilj 3 s pri 50 hkratnih brez premora ni dosežen (p95 6,6 s).
  - Pri novih povezavah med nasičenjem ostaja dolg rep: sporočilo p95 v treh ponovitvah 2,5 s, 2,9 s in 10,5 s.
    Fotografija je v eni ponovitvi presegla 3 s (4,0 s), v dveh pa ne (1,2 s in 1,3 s).

## Nabor
- Sintetična mala baza skripte (`scripts/meritev-zmogljivosti.mjs`): 50 učencev s pogovori in sporočili.
- Sporočilo »Koliko je a + (a+7)?«, fotografija 342 KB. Brez osebnih podatkov.
- Pričakovani izid ni potreben: merimo čas in status. Vsi odgovori so bili 200, razen pri padcih, ki so našteti spodaj.

## Metoda
- **Ukazi:**
  - `node scripts/meritev-zmogljivosti.mjs --samo poti --stopnje 1,10,50 [--tople-povezave] --json … --md …` (del 0.2);
  - `node scripts/meritev-zmogljivosti.mjs --samo obremenitev --stopnje 50 --trajanje 90` (D6: cgroup v1 512 MB, CPU
    50 000/100 000 µs, pretakanje odgovora `EVKLID_MOCK_DELAY_MS=15`).
  - »Prej« je isti ukaz na `main` `5b8130ae064212121a81f6cb4f24c475c60add78` (ločen delovni imenik). »Potem« je ta PR
    na isti osnovi.
- **Okolje strežnika.** Od te različice skripta strežniku nastavi enako kot produkcija: nastavitve glibc
  `MALLOC_*` iz `render.yaml` in mejo kopice iz `npm start`. Pri D6 »prej« so bile `MALLOC_*` nastavljene ročno iz
  lupine.
- **Stroj.** Oblak, Node v22.23.5, Intel Xeon 2,1 GHz, 4 jedra. Strežnik je pripet na 1 jedro (`taskset -c 0`), merilnik
  teče na ostalih. Preizkusni način `EVKLID_MOCK=1`.
- **Zaprta zanka.** c delavcev, vsak takoj pošlje naslednjo zahtevo, brez premora. Pri delu 0.2 največ 30 s na
  stopnjo.
- **`--tople-povezave` (novo).** Pred meritvijo c hkratnih `/healthz` odpre c povezav. Domneva: posrednik Renderja
  drži povezave do strežnika odprte. Tega nismo izmerili.
  - Brez zastavice nove povezave nastajajo med nasičenjem. Strežnik jih sprejme šele ob naslednjem krogu zanke dogodkov,
    krog pa traja nekaj sekund. To doda rep do ~34 s.
  - Sledenje: zahteve, izdane ob 0 ms, so prišle do strežnika v novih povezavah, ena na ~3,5 s. Na strežniku je vsaka
    trajala ≤ 270 ms.
- **Vzrok počasnosti.** Najden s profilom CPU (`--cpu-prof`) med 50 hkratnimi sporočili:
  - lastni čas: `ljubljanaOffsetMs` 10 %, `db.prepare` 14 %, izvajanje SQL 19 %;
  - na eno sporočilo: 339 branj `parents`, 233 branj `students.parent_id` in ~70 izračunov šolskih pravic, vsak s
    poizvedbo po `sqlite_master` in `PRAGMA`.
- **Vzrok padca.** Node 22 v vsebniku s 512 MB vidi `process.constrainedMemory()` = 512 MB, meja kopice
  (`heap_size_limit`) pa ostane ~8 GB. Preverjeno v cgroup s 512 MB.

## Izidi

### En procesor, odprte povezave (`--tople-povezave`), ena ponovitev (ms)

| Pot, 50 hkratnih | p50 prej → potem | p95 prej → potem | p99 prej → potem | zahtev/s prej → potem | n prej / potem | Cilj p95 |
|---|---|---|---|---|---|---|
| sporočilo inštruktorju (SSE do konca) | 4475 → 1696 | 4988 → **2063** | 9216 → 3556 | 10,7 → 27,8 | 367 / 500 | ≤ 3000 |
| fotografija (`scan/read`) | 2110 → 782 | 2449 → **1501** | 4430 → 1907 | 22,4 → 57,7 | 500 / 500 | ≤ 3000 |
| seznam pogovorov | 112 → 104 | 247 → 236 | 250 → 311 | 389 → 396 | 500 / 500 | ≤ 3000 |
| odpri pogovor | 131 → 152 | 193 → 204 | 204 → 205 | 357 → 315 | 500 / 500 | ≤ 3000 |
| lekcija | 180 → 156 | 276 → 208 | 282 → 210 | 250 → 308 | 500 / 500 | ≤ 3000 |
| lestvica | 98 → 124 | 184 → 160 | 461 → 164 | 432 → 392 | 500 / 500 | ≤ 3000 |
| prijava (p50/p95 samo zahtev s statusom 200; zahtev/s vse, tudi 503) | 1620 → 1604 | 3044 → 3028 | – | 49 → 50 | 8 / 8 od 150 | glej spodaj |

Pri 1 hkratnem: sporočilo p50 101 → 46 ms, fotografija 69 → 28 ms. Pri 10 hkratnih: sporočilo p95 1676 → 624 ms,
fotografija 875 → 340 ms. Prevajanj SQL na zahtevo: sporočilo 1175 → 247, fotografija 608 → 104, lekcija 19 → 6.

### En procesor, nove povezave med nasičenjem (brez `--tople-povezave`, kot doslej), 50 hkratnih, p95 (ms)

| Različica | Sporočilo p95 (n) | Fotografija p95 (n) |
|---|---|---|
| prej, `main` `8fc9ec25` | 32 461 (416) | 3795 (500) |
| prej, `main` `8fc9ec25`, dve ponovitvi z beleženjem povezav (izpis v konzolo) | 7205 (363), 5382 (352) | – |
| prej, `main` `5b8130ae` | 4650 (386), 13 136 (346) | 2681 (500) |
| potem, brez meje kopice | 2872 (500) | 4024 (500) |
| potem, z mejo kopice 256 MB in `MALLOC_*` | 2491 (500), 10 480 (500) | 1229 (500), 1270 (500) |

Interval za kvantile ni izračunan, ker skripta shrani kvantile, ne posameznih časov. Razpon ponovitev kaže, kako zelo
se rep spreminja.

### D6: kot Render starter (0,5 procesorja, 512 MB), 50 hkratnih, 90 s

| Različica | zahtev (ok) | padel | sporočilo p50 / p95 ms | s fotografijo p95 | `scan/read` p95 | vrh cgroup MB | mirovanje RSS / kopica MB |
|---|---|---|---|---|---|---|---|
| prej, brez meje kopice | 434 (434) | ne | 11 663 / 15 133 | 16 383 | 3494 | 482 | 413 / 209 |
| prej, kopica 256 MB | 464 (464) | ne | 10 504 / 13 908 | 15 984 | 4118 | 377 | 298 / 175 |
| potem, brez meje kopice | 268 (213) | **da (OOM)** | 2779 / 5494 do padca | 9579 | 7475 | 512 | – |
| potem, kopica 256 MB, 1. ponovitev | 1043 (1043) | ne | 4801 / **6644** | 6993 | 974 | 425 | 315 / 195 |
| potem, kopica 256 MB, 2. ponovitev | 1083 (1083) | ne | 4723 / **6569** | 6802 | 1052 | 426 | 269 / 160 |

Vse vrstice imajo `MALLOC_*` iz `render.yaml`. Brez njih je »potem« brez meje kopice padel še trikrat, pri 229, 231 in
425 zahtevah. Ena od teh ponovitev je imela poskusno vrsto za velika telesa, ki je v tem PR ni. »Prej« brez njih je
preživel dvakrat (460 in 460 zahtev), z vrhom cgroup 512 MB, tik pod mejo.

## Napake in neuspehi
- **Prijava pri 50 hkratnih.** 142 od 150 dobi 503 »preobremenjen«, prej in potem enako. To je namerna zaščita:
  preverjanje gesla (scrypt) ima omejeno vrsto, da strežnik ne ostane brez pomnilnika. 50 prijav v isti sekundi v
  pilotu ni pričakovanih. Vprašanje ostaja odprto za K-14 (vrsta s čakanjem namesto takojšnjega 503).
- **Pri 0,5 procesorja (D6)** je p95 sporočila 6,6 s, cilj 3 s ni dosežen. Pri 50 učencih, ki pišejo brez premora, je
  procesor Renderja ozko grlo. Hitrejše je z večjim paketom ali z manj dela na sporočilo (izračun pravic ~70-krat na
  sporočilo je naslednji kandidat).
- **Rep brez toplih povezav:** glej tabelo (do 10,5 s pri sporočilu).
- **Brez meje kopice** je hitrejši strežnik v vsebniku s 512 MB padel v vseh 4 ponovitvah, zato je meja del tega PR.

## Omejitve
- Preizkusni način: brez časa modela in brez omrežja do Anthropic. Pravi odgovor traja še sekunde (glej
  `obremenitev-2026-11-14-potem.md`, prvi bajt).
- Mala baza (50 učencev). Velika baza (del 0.6 »velika«) v tej meritvi ni ponovljena.
- Zaprta zanka brez premora je strožja od resnične rabe: učenec bere odgovor, preden piše naprej.
- Stroj v oblaku si procesor deli z drugimi. Ponovitev je malo (1–2 na vrstico, pri hladnih povezavah do 5).
- Kopica 256 MB je preverjena z obremenitvijo in s pregledom poti z veliko pomnilnika (tisk učbenika, kopije, izvoz,
  uvoz zapiskov). Na samem Renderju še ni izmerjena.

## Stroški
Klicev API: 0, cena: 0 $.
