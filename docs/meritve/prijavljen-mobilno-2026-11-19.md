# Prijavljen učenec na počasnem telefonu (19. 11. 2026)

Zunanji pregled je opozoril, da je LCP 2,8 s iz #860 izmerjen le lokalno in za neprijavljenega obiskovalca. Tu je
Učna pot (`#view-path`) in Inštruktor za **prijavljenega učenca z napredkom**, na počasnem omrežju, s strežnikom,
omejenim kot Render starter. Produkcija ni bila dotaknjena. Surovi rezultati: `prijavljen-mobilno-2026-11-19.json`.

## Rezultati

Strežnik ima cgroup 0,5 CPU / 512 MB in je pripet na eno jedro. Pred njim je posrednik HTTP/2, v Chromiumu 157 pa
sta vklopljena CPU 4× in Slow 4G (562 ms, 1,44 Mb/s). Omejitev velja tudi za service worker. Časi so v sekundah od
začetka navigacije oziroma od tapa.

| Naprava, obisk | Učna pot uporabna (interaktivna) | FCP | LCP | CLS | INP | zahtev (po omrežju) | prenos | Inštruktor: polje | odpri dolgi pogovor | prvi znak* |
|---|---|---|---|---|---|---|---|---|---|---|
| telefon, prvi | **11,4** (11,4) | 2,5 | 11,4 | **0,62** | **1,50** | 173 (163) | 1083 KB | 0,10 | **11,2** | 3,7 |
| telefon, ponovni (SW) | 1,4 (2,9) | 1,5 | 1,5 | 0,00 | 1,36 | 158 (7) | 7 KB | 1,2 (1,9)** | 0,2** | 2,5 |
| računalnik 1280×800, prvi | **11,5** (11,6) | 2,4 | 11,6 | 0,17 | 1,27 | 173 (163) | 1083 KB | 0,08 | **11,7** | 2,3 |
| računalnik, ponovni (SW) | 1,3 (2,6) | 1,4 | 1,4 | 0,01 | 1,36 | 167 (11) | 10 KB | 0,8 (1,0)** | 0,07** | 2,5 |
| *telefon, prvi, HTTP/1.1* | *20,8* | *4,3* | *20,8* | *0,59* | *1,33* | *174 (164)* | *1267 KB* | *0,11* | *11,4* | *3,6* |
| *13. 11. (0.4), HTTP/1.1, nov profil* | *20,9* | *4,1* | *17,7* | *0,69* | *0,18* | *168* | *1271 KB* | – | – | – |

\* Prvi izpisani znak odgovora po tapu »Pošlji« je izmerjen v preizkusnem načinu (`EVKLID_MOCK_DELAY_MS=15`). **Čas
pravega modela do prvega žetona ni vključen.**
\*\* Ob ponovnem obisku zavihek Inštruktor sam odpre zadnji (dolgi) pogovor, zato je ta čas že v stolpcu »polje«.

Pri prvem obisku je service worker v ozadju prenesel še 160 zahtev (30 KB, iz predpomnilnika HTTP). Ponovljivost:
pri telefonu je bil prvi obisk v treh tekih 11,4–11,6 s. Na strežniku je bilo največ 234 MB (meja 512 MB), zato
strežnik pri enem učencu ni ozko grlo.

**Pravilo hitrosti** (j 15. 11.: »vse se ob kliku odpre takoj, razen kjer to ni mogoče«) ni izpolnjeno pri treh
stvareh: pri odprtju dolgega pogovora (11 s), pri tapu »Pošlji« (stran zamrzne za 1,3–1,5 s) in pri zavihku
Inštruktor, ko obnovi dolg pogovor (0,8–1,4 s). Izpolnjeno je pri zavihku Inštruktor z novim pogovorom (0,1 s) in pri
Učni poti ob ponovnem obisku (1,3–1,4 s).

## Ugotovitve (najhujše najprej)

1. **Odprtje pogovora s 120 sporočili traja 11–12 s, glavna nit pa je pri tem zamrznjena v eni nalogi (~10 s).** To
   velja za telefon in računalnik ter za HTTP/2 in HTTP/1.1. Profil (CPU 4×, brez omejitve omrežja, 11,1 s) pokaže,
   da gre 10,3 s v `addMessage`. Od tega je 5,2 s `prilagodiZdaj → noveFormule → blok` (`getComputedStyle`), 4,4 s
   pa `addMessage` sam, najverjetneje zaradi `box.scrollTop = box.scrollHeight` po vsakem sporočilu. Vsako sporočilo
   tako vsili preračun sloga in postavitve za vedno večji DOM. KaTeX, marked in DOMPurify skupaj vzamejo le ~0,5 s.
   **Popravek:** `openConversation` naj doda sporočila brez meritev (zastavica v `addMessage` ali `DocumentFragment`)
   in nato enkrat pokliče `prilagodiZdaj()` ter enkrat pomakne na dno. Najprej naj izriše zadnjih ~20 sporočil,
   starejša pa ob drsenju navzgor. Isti popravek odpravi tudi 0,8–1,4 s ob zavihku Inštruktor pri ponovnem obisku.
2. **Prijavljen učenec ob prvem obisku čaka na Učno pot 11,4 s (HTTP/2) oziroma 20,8 s (HTTP/1.1).** To je enako kot
   13. 11. (20,9 s), ker je #860 pospešil samo stran za neprijavljene. Okostje se pokaže po 2,5 s, `load` pa je šele
   po 7,8 s, ker se naloži vseh 173 datotek (1083 KB, vsi moduli vseh zaslonov). Učna pot pride še ~3,5 s pozneje:
   po zagonu `app.js` sledijo klici API in štiri dolge naloge do ~1 s. **Popravek:** za sejo isto kot #860 za
   pristajalno stran. Strežnik naj v HTML vstavi začetne podatke (`/api/students`, `/path`, `/xp`, `/config`), da
   ni krogov API po zagonu. Moduli in slogi drugih zaslonov (klepet, igre, učbenik, kalkulator, 3D) naj se naložijo
   po prvem izrisu Učne poti (`<template>` kot v `server/vstopna-stran.js` `withLanding`). Cilj je ~3–4 s.
3. **Tap »Pošlji« zamrzne stran za 1,3–1,5 s** (INP 1,27–1,50 s na vseh štirih obiskih, v novem pogovoru ~0,9 s).
   Prvi znak odgovora se zato pokaže šele po 2,3–3,7 s, čeprav preizkusni model odgovori takoj. Verjeten vzrok je
   isti kot pri 1. točki (`addMessage` za oba mehurčka z `prilagodiZdaj` in `scrollHeight` na velikem DOM), vendar
   tu ni profilirano. **Popravek:** mehurček učenca naj se pokaže brez sinhronega merjenja, `prilagodi` naj teče v
   `requestAnimationFrame` po izrisu. Po popravku 1. točke je treba INP izmeriti znova.
4. **CLS 0,62 na telefonu ob prvem obisku** (računalnik 0,17). Ko pravi pogled zamenja okostje, se premakneta
   `#xp-card` in `#modebar` (0,43), `main#view-path` s pasicama »Preizkusni način« in »Testna različica« pa še za
   0,10. Ob ponovnem obisku s posnetkom je CLS 0–0,04. **Popravek:** okostje v `public/zacetek.js` naj ima enako
   višino `#modebar`, `#xp-card` in pasic kot pravi pogled (pasici sta znani že iz HTML, kot pri pristajalni strani).
5. **HTTP/1.1 lokalno doda ~9 s k prvemu obisku** (20,8 proti 11,4 s), ker ima brskalnik največ 6 povezav, zahteve
   pa na Slow 4G čakajo v vrsti. Meritve 0.4 (13. 11.) in Lighthouse iz #860 so bile narejene na HTTP/1.1.
   **Popravek (meritev):** v DevTools na evklid.app preveri stolpec Protocol (pričakovano `h2` ali `h3`). Primerjave
   za prijavljene naj odslej uporabljajo privzeti posrednik HTTP/2 (`--samo prijavljen`).

## Metoda

```sh
flock /tmp/evklid-tezko.lock node scripts/meritev-zmogljivosti.mjs --samo prijavljen --json p.json --md p.md
# --http1 (brez posrednika), --naprave telefon,racunalnik, --velika-baza, --brez-cgroup, --slike <mapa>, --mock-zamik 15
```

- Uporabljen je nov del skripte `prijavljen`, s pomožnimi deli v `scripts/meritev-prijavljen.mjs` in testom v
  `test/meritev-prijavljen.test.js`. Učenec ima 21 dni napredka za MAT-OS-8: 6 obvladanih tem in 4 teme v učenju,
  120 rešenih nalog iz generatorja in 2039 XP. Ima 40 pogovorov s 676 sporočili, najnovejši ima 120 sporočil z
  LaTeX-om. Vprašalnik in ogled sta opravljena, tedenska anketa pa je odložena.
- Postopek: učenec se pripravi na strežniku brez omejitev, nato teče pravi `server/index.js` v cgroup (0,5 CPU in
  512 MB) za posrednikom HTTP/2. Meritev se začne šele, ko sta predgreta stisnjene datoteke in učbenik za tisk.
- Brskalnik: Chromium (Playwright), za vsako napravo svoj profil. Prvi obisk ima prazen predpomnilnik. Ponovni obisk
  je nova stran v istem profilu, s predpomnilnikom HTTP in service workerja ter brez posnetka zaslona.
- Merjeni koraki: »uporabna« pomeni, da je viden `#view-path #xp-card .hero`, »interaktivna« pa, da 500 ms ni dolge
  naloge. Sledijo pravi tapi: Inštruktor (polje vidno in gumb omogočen), dolgi pogovor s seznama (vidnih ≥ 10
  odgovorov) ter vnos in »Pošlji« (prvi znak). INP je najdaljša interakcija in jo skoraj vedno določa »Pošlji«.
- Česa ni bilo mogoče izmeriti: Render sam (disk, Frankfurt), WebKit in pravega modela.

## Za pravo produkcijo pozneje

Najvarneje je uporabiti gosta iz lastnikovega povabila, ki ga poganja ročni delovni tok v GitHub Actions.
Gost (`gost-…@gost.invalid`, `is_guest = 1`) ni štet v metrikah pilota (`server/rast.js`, `server/pilot-ucinek.js`),
po odjavi in 30 dneh pa ga `GuestQuota.cleanup()` izbriše. Skripta bi dobila način `--cilj https://evklid.app
--gost`: odpre `/?gost=<žeton>`, potrdi obvestilo, izmeri iste korake z enakim CPU 4× in Slow 4G (enkrat s pravim
modelom, nekaj centov) in se na koncu odjavi. Dolge zgodovine tam ni, zato dolgi pogovor ostane lokalna meritev.

Lastnik (j) mora storiti tri stvari:

1. Ko je prijavljen kot skrbnik, ustvari povabilo (`POST /api/admin/guest-invite`). Povabilo velja 14 dni za
   10 gostov, kar je 10 meritev.
2. Žeton shrani kot skrivnost repozitorija `EVKLID_MERITEV_GOST`.
3. Odobri PR z delovnim tokom in ga sproži v Actions. Ko je povabilo porabljeno ali poteče, ponovi 1. in 2. korak.
