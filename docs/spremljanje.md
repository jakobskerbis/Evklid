# Spremljanje: kdaj dobiš opozorilo in kam (pilot, 16. 11. 2026)

Tri poti, neodvisne ena od druge:

1. **Straža** (`.github/workflows/straza.yml`, `scripts/straza.mjs`): GitHub po vsaki objavi na Renderju in po
   urniku od zunaj preveri živo stran. Urnik je vsakih 15 min, a ga GitHub v praksi zažene le na ~5–10 ur
   (izmerjeno 8.–16. 11. 2026), zato hiter alarm ob izpadu da UptimeRobot (3.). Ko preizkus ne uspe, delovni tok
   pade in **GitHub pošlje e-pošto** (komu: spodaj, »Kaj narediš ročno«). Deluje tudi, ko strežnik ne teče.
2. **Strežnik sam** pošlje e-pošto naslovom iz `EVKLID_ADMIN_EMAILS` (prek Resenda) ob dogodkih, ki jih vidi samo on:
   dnevni strošek AI nad mejo in neuspel nočni preizkus varnostne kopije.
3. **UptimeRobot** (brezplačen račun j, 16. 11. 2026): vsakih 5 min odpre `https://evklid.app/healthz` in ob izpadu
   pošlje e-pošto »Down«, ob vrnitvi »Up«. Če ob objavi nove različice prideta »Down« in v nekaj minutah »Up«, je bil
   to le ponovni zagon.

## Kaj sproži opozorilo

| Dogodek | Straža (e-pošta GitHub) | Strežnik (e-pošta skrbniku) |
|---|---|---|
| Strežnik ne odgovori (`/healthz`) | **UptimeRobot** (ne Straža): e-pošta v ~5 min | – |
| Strežnik ne odgovori ali vrne napako (`/healthz`, domača stran, `app.js`, atlas, `/api/config`) | da, ob vsakem zagonu, dokler traja | – |
| Strošek AI danes (UTC) nad `EVKLID_OPOZORILO_AI_USD` (privzeto 3 $) | da, prvo uro po preseganju (in prvo uro po drugem e-mailu) | da, z zneskom; drugič istega dne pri 3-kratniku meje |
| Nočni preizkus obnove iz kopije ni uspel (4.30–8.00) | da, prvo uro po preizkusu (ne ob prehodni napaki, ki jo strežnik čez 10 min ponovi) | da, enkrat na dan, z razlogom (`server/kopije-preveri.js`) |
| Dnevna kopija baze ni narejena (`kopije.napaka`) | da, dokler traja | – |
| E-pošta ne gre ven (Resend zavrne ključ, preobremenjen, ni omrežja) | da, prvo uro po zadnji neuspeli pošiljki | – (e-pošta ne deluje) |
| Pomnilnik nad 85 % meje v zadnjih 30 min | da | – |
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
- Ko `nepregledano` raste: v Anthropic Console preveri dobroimetje in omejitve ključa. E-pošte o tem strežnik (še) ne
  pošlje.

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
   interval 5 minutes, obvestilo E-mail → Create monitor. Uspelo je, ko je monitor zelen (»Up«).

## Česar ni

- GitHub načrtovani zagon Straže zamakne za ure, zato stanj iz `/healthz/stanje` (strošek AI, kopija, e-pošta)
  Straža večinoma ne javi. Strošek AI in neuspel preizkus kopije ti strežnik pošlje sam po e-pošti. **Napake e-pošte
  (Resend) ti nihče ne javi**: enkrat na teden odpri https://evklid.app/healthz/stanje in preveri, da je pri `posta`
  `"napak":0` ali da je `zadnjiUspeh` novejši od `zadnjaNapaka`. Izpad strežnika javi UptimeRobot.
- GitHub v javnem repozitoriju izklopi načrtovane delovne tokove po 60 dneh brez sprememb v repozitoriju (pošlje
  opozorilo). Takrat Stražo v Actions znova vklopi (in alarmi gredo tebi).
- Dodatna varovalka zunaj aplikacije (šteje tudi meritve po objavi): mesečna meja porabe v Anthropic Console
  (Settings → Limits). To nastaviš sam.
- Kopija baze zunaj Renderja (R2) ni nastavljena (`docs/obnova.md`). Ko bo, jo preverja nočni preizkus kopije.
