# Spremljanje: kdaj dobiš opozorilo in kam (pilot, 16. 11. 2026)

Tri poti, neodvisne ena od druge:

1. **Straža** (`.github/workflows/straza.yml`, `scripts/straza.mjs`): GitHub po vsaki objavi na Renderju in po
   urniku od zunaj preveri živo stran. Urnik je vsakih 15 min, a ga GitHub v praksi zažene le na ~5–10 ur
   (izmerjeno 8.–16. 11. 2026), zato hiter alarm ob izpadu da UptimeRobot (3.). Ko preizkus ne uspe, delovni tok
   pade in **GitHub pošlje e-pošto** (komu: spodaj, »Kaj narediš ročno«). Deluje tudi, ko strežnik ne teče.
2. **Strežnik sam** pošlje e-pošto naslovom iz `EVKLID_ADMIN_EMAILS` (prek Resenda) ob dogodkih, ki jih vidi samo on:
   dnevni strošek AI nad mejo, neuspel nočni preizkus varnostne kopije, nova oznaka stiske, inštruktor AI ne dela,
   nepričakovan ponovni zagon in poln disk (`server/zdravje.js`).
3. **UptimeRobot** (brezplačen račun j, 16. 11. 2026): vsakih 5 min odpre `https://evklid.app/healthz` in ob izpadu
   pošlje e-pošto »Down«, ob vrnitvi »Up«. Če ob objavi nove različice prideta »Down« in v nekaj minutah »Up«, je bil
   to le ponovni zagon. Drugi monitor na `https://evklid.app/healthz/alarm` (21. 11. 2026) vrne 503 »alarm: <kode>«,
   dokler traja katera od okvar iz `/healthz/stanje` (spodaj), in tako v 5 min javi tudi to, kar Straža ujame šele
   po urah.

## Kaj sproži opozorilo

| Dogodek | Straža (e-pošta GitHub) | Strežnik (e-pošta skrbniku) |
|---|---|---|
| Strežnik ne odgovori (`/healthz`) | **UptimeRobot** (ne Straža): e-pošta v ~5 min | – |
| Strežnik ne odgovori ali vrne napako (`/healthz`, domača stran, `app.js`, atlas, `/api/config`) | da, ob vsakem zagonu, dokler traja | – |
| Strošek AI danes (UTC) nad `EVKLID_OPOZORILO_AI_USD` (privzeto 3 $) | da, prvo uro po preseganju (in prvo uro po drugem e-mailu) | da, z zneskom; drugič istega dne pri 3-kratniku meje |
| Nočni preizkus obnove iz kopije ni uspel (4.30–8.00) | da, prvo uro po preizkusu (ne ob prehodni napaki, ki jo strežnik čez 10 min ponovi) | da, enkrat na dan, z razlogom (`server/kopije-preveri.js`) |
| Nova oznaka stiske (inštruktor `flag=distress`; `server/stiska-obvestilo.js`) | – | da, takoj; v nizu največ en e-mail na 10 min s številom. Brez imena, vsebine in sporočila: vrsta, stopnja, čas in povezava `/api/admin/stiske` (prijava skrbnika), kjer oznako v 24 urah označiš kot pregledano (`pregledano_ob`). Tudi namestniku iz `EVKLID_STISKA_EMAIL_NAMESTNIK`; stran `/api/admin/stiske` odpre samo skrbnik, zato mora biti namestnik, ki naj oznake tudi pregleduje, še v `EVKLID_ADMIN_EMAILS`. E-mail velja za poslan, ko uspe vsaj enemu prejemniku (neuspeh drugemu gre samo v dnevnik). `EVKLID_STISKA_EMAIL=0` izklopi |
| Dnevna kopija baze ni narejena (`kopije.napaka`) | da, dokler traja | – |
| Šifriranje osebnih podatkov izklopljeno (`sifriranje: false`; strežnik brez `EVKLID_DATA_KEY` se v produkciji zažene samo z `EVKLID_ALLOW_PLAINTEXT=1`) | da, dokler traja | – |
| E-pošta ne gre ven (Resend zavrne ključ, preobremenjen, ni omrežja) | da, prvo uro po zadnji neuspeli pošiljki | – (e-pošta ne deluje) |
| Pomnilnik nad 85 % meje v zadnjih 30 min | da | – |
| Inštruktor AI ne dela za nikogar (`ai.deluje: false`): ni dobroimetja, neveljaven ključ (401), ključ brez dovoljenja (403), model ne obstaja (404), ali 5 zaporednih neuspelih odgovorov (napaka enega učenca, npr. 400 ali 413, ne šteje) | da, dokler traja (brez novih napak alarm poteče: po 6 h pri ključu, dobroimetju in modelu, po 1 h pri drugih) | da, takoj en e-mail na izpad (vse vrste skupaj), z navodilom, kaj popraviti; opomnik po 1 h, nato po 6 h, nato vsakih 24 h. Prvi uspešen odgovor izpad konča; nov izpad najprej 1 h po zadnjem e-mailu |
| Nepričakovan ponovni zagon (`zagoni`: premalo pomnilnika, SIGKILL, sesutje; ne objava) | da, prvo uro | da, največ en e-mail na 6 ur, z vrsto napake, če je znana |
| Disk z bazo nad `EVKLID_DISK_OPOZORILO` (privzeto 90 %, računano kot `df`: rezerva ext4 ne šteje kot zasedena) (`disk`) | da, dokler traja | da, pregled na 10 min, največ en e-mail na 6 ur. Po prvi objavi preveri trenutno vrednost na https://evklid.app/healthz/stanje → `disk.delez` |
| Vse e-pošte zgornjih treh vrstic skupaj (`server/zdravje.js`) | – | največ 12 pošiljk na dan (prejemnik × e-mail), da ne porabijo kvote Resend za potrditve in gesla učencev; čez mejo samo vrstica v dnevniku |
| Inštruktor v preizkusnem načinu (`mock: true`) | da, dokler traja | – (v produkciji se strežnik brez `ANTHROPIC_API_KEY` ne zažene, razen z izrecnim `EVKLID_MOCK=1`) |
| PDF učbenika se ne prenese; kopija v R2 ni nastavljena | samo vrstica »Opozorilo« v dnevniku Straže | – |

Stanja, ki trajajo ves dan (strošek AI nad mejo, neuspel preizkus kopije, e-pošta), Stražo podrejo samo eno uro po
dogodku, da ne pada ves dan. Ker GitHub Stražo po urniku zažene le na ~5–10 ur, tisto uro običajno ujame samo
zagon po objavi, zato teh stanj od Straže **večinoma ne dobiš** (glej »Česar ni«). Po tej uri je v dnevniku Straže
samo »Opozorilo«. En
napačen e-naslov uporabnika (Resend 422) ni napaka e-pošte. Opozorila (PDF, R2) so vidna samo v dnevniku zagona:
Actions → Straža → zadnji zagon → korak »Preveri živo spletišče«.

## Ko dobiš e-pošto GitHuba »Run failed«

1. Odpri povezavo v e-pošti → korak »Preveri živo spletišče«: na koncu je slovenski povzetek, kaj ne deluje.
2. Strežnik ne odgovori: Render → evklid → Events in Logs (ali teče objava, ali je proces padel).
3. Strošek AI: e-pošta strežnika z zneskom; v aplikaciji kot skrbnik merilnik »Poraba AI« v zgornji vrstici.
4. Preizkus kopije: e-pošta strežnika z razlogom; postopek v `docs/obnova.md`.
5. E-pošta (Resend): Render → Environment `RESEND_API_KEY`, nadzorna plošča Resend.

## Strošek AI

- `server/opozorilo-ai.js`: vsakih 10 min sešteje današnjo porabo AI (vse vrste v števcu porabe, tudi aplikacija; dan
  po UTC). Ko je nad mejo, pošlje e-mail z zneskom in navodili; drugič istega dne, ko poraba doseže 3-kratnik meje,
  in znova, ko mejo med dnem spremeniš in je nova presežena. Ob neuspehu poskusi znova (do 6-krat).
- **Ni šteto:** meritev natančnosti po objavi (`server/meritev-po-objavi.js`, do 1 $ na objavo, 15 $ na teden) ima
  svojo knjigo; poglej `/api/admin/meritev-po-objavi`. Če poraba preseže mejo v zadnjih 10 minutah dneva (UTC),
  opozorila za ta dan ni (naslednji pregled šteje že nov dan).
- Javno na `/healthz/stanje` → `aiStrosek`: samo `{ nadMejo, od }`, brez zneska.
- Meja: Render → Environment → `EVKLID_OPOZORILO_AI_USD` (npr. `5`; `0` izklopi). Privzeto 3 $ na dan. V to so
  šteti tudi pregledi odgovorov, ki jih plača aplikacija (med pilotom do 1 $ na dan, `docs/stroski-ai.md`). Po prvem
  tednu pilota poglej v Števcu porabe običajno dnevno porabo in mejo nastavi malo nad njo.
- Opozorilo ničesar ne ustavi. Strošek omejujejo meje AI na učenca, račun in aplikacijo (`docs/stroski-ai.md`).

## Varnostni pregled sporočil

- `server/nujno.js`: sporočilo inštruktorju, ki ga lokalni zaznavalnik ne ujame, pregleda še AI (Haiku). Če ponudnik
  AI ne odgovori v 5 s ali vrne napako, aplikacija poskusi še enkrat v ozadju (do 20 s); učenec na to ne čaka. Če
  ponovitev najde nujen primer, učenec dobi isto okno s številkami pomoči (še v istem odgovoru ali ob naslednjem).
  Če ne uspe niti ponovitev, okna **ni** (izpad ponudnika ni razlog za alarm), sporočilo pa se prešteje kot
  **nepregledano**.
- **Kje to vidiš (enkrat na teden):** https://evklid.app/healthz/stanje → `varnostniPregled`. `vklopljen` mora biti
  `true`, pri `danes` in `vceraj` pa `"nepregledano":0`. `rok` in `napaka` povesta, kolikokrat prvi poskus ni uspel
  (posamezni so običajni, ponovitev jih večinoma reši); `zadnjeNepregledano` je datum (brez ure) zadnjega nepregledanega sporočila.
  Javno so samo ta števila o ponudniku, nič o učencih ali zadetkih.
- **Več (samo skrbnik):** prijavljen odpri https://evklid.app/api/usage → `varnost` → `dnevi` (zadnjih 7 dni, po UTC):
  `pozni_zadetki` (ponovitev je našla nujen primer), `pozno_v_toku` in `pozno_naslednji` (učenec je okno dobil še v
  istem odgovoru oziroma ob naslednjem), `pozno_ze_okno` (okno iste vrste je že imel), `pozno_poteklo` (v 1 uri ni
  napisal ničesar več in okna ni videl), `nad_varovalko` (čez mejo več kot 10 pregledov profila na dan),
  `brez_dobroimetja` (dobroimetje pri ponudniku AI je bilo porabljeno) in `neznano` (model ni odgovoril z vrsto ali NE).
  `pozna_okna_cakajo` pove, koliko oken zdaj čaka na naslednji odgovor.
- Ko `nepregledano` raste: v Anthropic Console preveri dobroimetje in omejitve ključa. Ko zmanjka dobroimetja za
  inštruktorja, strežnik pošlje e-pošto (`ai.deluje: false`, zgoraj).

## Kaj narediš ročno (enkrat)

1. **Nastavitve e-pošte GitHuba.** GitHub → Settings → Notifications → System → Actions: »Email« vklopljen in
   »Only notify for failed workflows« obkljukan.
2. **Poskusni alarm.** GitHub → Evklid → Actions → Straža → Run workflow; v polje »Drug naslov« vpiši
   `https://evklid.app/ni-strani` in zaženi. Po približno 1 minuti delovni tok pade in mora priti e-pošta. To preveri
   tvoje nastavitve (ročni zagon javi tistemu, ki ga je zagnal).
3. **Komu gredo pravi alarmi.** E-pošto o načrtovanih (samodejnih) zagonih GitHub pošlje tistemu, ki je zadnji
   spremenil vrstico `cron` v `.github/workflows/straza.yml` (ali ki je delovni tok zadnji ponovno vklopil). Na GitHubu
   odpri to datoteko → History in preveri, da je zadnja sprememba vrstice `cron` tvoja (`jakobskerbis`). Če ni, vrstico
   enkrat sam shrani (npr. dodaj in odstrani presledek).
4. **Preveri `EVKLID_ADMIN_EMAILS` in Resend** v Render → Environment. Brez njiju strežnik e-pošte ne pošlje in v
   dnevnik zapiše »e-pošta skrbniku ni poslana«.
5. **UptimeRobot.** uptimerobot.com → Register for FREE → + New monitor: HTTP(s), URL `https://evklid.app/healthz`,
   interval 5 minutes, obvestilo E-mail → Create monitor. Uspelo je, ko je monitor zelen (»Up«). Nato še drugi monitor
   enako na `https://evklid.app/healthz/alarm` (ime npr. »Evklid alarm«). Kode v odgovoru 503: `baza` (baza ne
   odgovori), `ai` (inštruktor ne dela), `posta` (Resend ne sprejema), `kopije` (dnevna kopija, kopija v R2 ali nočni
   preizkus), `disk`, `pomnilnik`, `zagon` (nepričakovan ponovni zagon v zadnji uri). Podrobnosti so v
   `/healthz/stanje`. Tudi drugi monitor ob vsaki objavi javi »Down« in v nekaj minutah »Up« (ponovni zagon). Po
   nepričakovanem ponovnem zagonu ostane namenoma eno uro na 503 `zagon`: to ni nov izpad, e-mail o zagonu je že
   prišel. `posta` velja pri prehodni napaki Resenda (omrežje, 429, 5xx) eno uro, pri napačnem ključu (401, 403) do
   prvega uspešnega e-maila.

## Česar ni

- GitHub načrtovani zagon Straže zamakne za ure, zato stanj iz `/healthz/stanje` (strošek AI, kopija, e-pošta)
  Straža večinoma ne javi. Strošek AI in neuspel preizkus kopije ti strežnik pošlje sam po e-pošti. Napake e-pošte
  (Resend) javi samo drugi monitor UptimeRobot (`/healthz/alarm`, koda `posta`); brez njega enkrat na teden odpri
  https://evklid.app/healthz/stanje in preveri, da je pri `posta` `"napak":0` ali da je `zadnjiUspeh` novejši od
  `zadnjaNapaka`. Izpad strežnika javi UptimeRobot.
- Nastavitve brez opozorila: `EVKLID_AI_MIROVANJE_S` (privzeto 60) in za »Razloži podrobneje« (Opus, Sonnet)
  `EVKLID_AI_MIROVANJE_DEEP_S` (privzeto 180): odgovor AI, ki toliko sekund ne pošlje ničesar (niti »ping«), se prekine
  z napako »zastoj odgovora« (učenec poskusi znova, vprašanje ne šteje); `EVKLID_SIGNUPS_PER_DAY`
  (privzeto 5): novih računov z enega omrežja na dan (veljavna koda vabila v pilot to mejo obide, z eno kodo največ 3
  na dan); `EVKLID_ZAUSTAVITEV_MS` (privzeto 20000, največ 25000 zaradi Renderjevih 30 s): koliko ob objavi čakamo na odgovore v teku, preden jih prekinemo
  z obvestilom o posodobitvi (vprašanje ne šteje).
- GitHub v javnem repozitoriju izklopi načrtovane delovne tokove po 60 dneh brez sprememb v repozitoriju (pošlje
  opozorilo). Takrat Stražo v Actions znova vklopi (in alarmi gredo tebi).
- Dodatna varovalka zunaj aplikacije (šteje tudi meritve po objavi): mesečna meja porabe v Anthropic Console
  (Settings → Limits). To nastaviš sam.
- Kopija baze zunaj Renderja (R2) ni nastavljena (`docs/obnova.md`). Ko bo, jo preverja nočni preizkus kopije.
