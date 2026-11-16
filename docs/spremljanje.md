# Spremljanje: kdaj dobiš opozorilo in kam (pilot, 16. 11. 2026)

Dve poti, neodvisni ena od druge:

1. **Straža** (`.github/workflows/straza.yml`, `scripts/straza.mjs`): GitHub vsakih 15 min (in po vsaki objavi na
   Renderju) od zunaj preveri živo stran. Ko preizkus ne uspe, delovni tok pade in **GitHub pošlje e-pošto** lastniku
   repozitorija. Deluje tudi, ko strežnik ne teče.
2. **Strežnik sam** pošlje e-pošto naslovom iz `EVKLID_ADMIN_EMAILS` (prek Resenda) ob dogodkih, ki jih vidi samo on:
   dnevni strošek AI nad mejo in neuspel nočni preizkus varnostne kopije. Največ en e-mail na dan za vsako vrsto.

## Kaj sproži opozorilo

| Dogodek | Straža (e-pošta GitHub) | Strežnik (e-pošta skrbniku) |
|---|---|---|
| Strežnik ne odgovori ali vrne napako (`/healthz`, domača stran, `app.js`, atlas, `/api/config`) | da, ob vsakem zagonu, dokler traja | – |
| Strošek AI danes (UTC) nad `EVKLID_OPOZORILO_AI_USD` (privzeto 3 $) | da, prvo uro po preseganju | da, enkrat na dan, z zneskom |
| Nočni preizkus obnove iz kopije ni uspel (4.30–8.00) | da, prvo uro po preizkusu | da, enkrat na dan, z razlogom (`server/kopije-preveri.js`) |
| Dnevna kopija baze ni narejena (`kopije.napaka`) | da, dokler traja | – |
| E-pošta ne gre ven (Resend zavrne ključ, preobremenjen, ni omrežja) | da, prvo uro po zadnji neuspeli pošiljki | – (e-pošta ne deluje) |
| Pomnilnik nad 85 % meje v zadnjih 30 min | da | – |
| PDF učbenika se ne prenese; kopija v R2 ni nastavljena | samo vrstica »Opozorilo« v dnevniku Straže | – |

Stanja, ki trajajo ves dan (strošek AI nad mejo, neuspel preizkus kopije), Stražo podrejo samo eno uro po dogodku,
da ne dobiš e-pošte vsakih 15 minut. Po tem je v dnevniku Straže samo »Opozorilo«. En napačen e-naslov uporabnika
(Resend 422) ni napaka e-pošte.

## Strošek AI

- `server/opozorilo-ai.js`: vsakih 10 min sešteje današnjo porabo AI (vse vrste, tudi aplikacija; dan po UTC, kot v
  Števcu porabe). Ko je nad mejo, pošlje e-mail z zneskom in navodili. Ob neuspehu poskusi znova (do 6-krat).
- Javno na `/healthz/stanje` → `aiStrosek`: samo `{ nadMejo, od }`, brez zneska.
- Meja: Render → Environment → `EVKLID_OPOZORILO_AI_USD` (npr. `5`; `0` izklopi). Privzeto 3 $ na dan. V to so
  šteti tudi pregledi odgovorov, ki jih plača aplikacija (med pilotom do 1 $ na dan, `docs/stroski-ai.md`). Po prvem
  tednu pilota poglej v Števcu porabe običajno dnevno porabo in mejo nastavi malo nad njo.
- Opozorilo ničesar ne ustavi. Strošek omejujejo meje AI na učenca, račun in aplikacijo (`docs/stroski-ai.md`).

## Kaj narediš ročno (enkrat)

1. **Preveri, ali e-pošta GitHuba pride.** GitHub → Settings → Notifications → Actions: vklopljeno »Email« in
   »Only notify for failed workflows«. Nato GitHub → Evklid → Actions → Straža → Run workflow, v polje
   »naslov« vpiši `https://evklid.app/ni-strani`. Delovni tok mora pasti, v nekaj minutah pa mora priti e-pošta.
   GitHub e-pošto o načrtovanih delovnih tokovih pošlje tistemu, ki je zadnji spremenil vrstico `cron` v
   `straza.yml`. Če e-pošte ni, preveri, kdo je to.
2. **Preveri `EVKLID_ADMIN_EMAILS` in Resend** v Render → Environment. Brez njiju strežnik e-pošte ne pošlje in v
   dnevnik zapiše »e-pošta skrbniku ni poslana«.

## Česar ni

- GitHub lahko načrtovani zagon Straže zamakne za nekaj minut ali več. Za pilot z 20 uporabniki to zadošča. Zunanji
  nadzor (npr. UptimeRobot) bi zahteval nov račun, zato ga nisem dodal.
- Kopija baze zunaj Renderja (R2) ni nastavljena (`docs/obnova.md`). Ko bo, jo preverja nočni preizkus kopije.
