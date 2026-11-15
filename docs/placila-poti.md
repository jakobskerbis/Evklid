# Plačila Stripe: poti in testi (pilot, 15. 11. 2026)

Vsaka pot plačila ima test, ki pošlje **podpisan** dogodek na `/api/stripe/webhook` (kot Stripe v testnem načinu) in
preveri, kar vidi uporabnik: dostop v `/api/account`, vprašanja inštruktorju, meja AI. Lažni Stripe vrne stanje
naročnine, seje in plačila; pravih ključev testi ne potrebujejo. Vsi testi tečejo v CI (`npm test`).

Okrajšave datotek v `test/`: **SP** `stripe-poti.test.js` (korak 4 priprave na pilot), **P** `placila.test.js`,
**A** `accounts.test.js`, **SN** `stara-narocnina-b.test.js`, **B** `pregled-511-b.test.js`,
**R** `pregled-511-b-ponovni.test.js`, **C** `cene-sola.test.js`, **G** `garancija.test.js`,
**SS** `stripe-socasno.test.js`.

| Pot | Naročnina | Paket pred testom | Dokup pogovorov | Darilna koda |
|---|---|---|---|---|
| Nakup | SP »naročnina: nakup (Checkout) …«; A »subscription via webhook lifts it« | SP »paket pred testom: nakup samo prek webhooka …«; P »webhook vklopi paket« | SP »dokup pogovorov …«; R RR8 | SP »darilna koda …«; C »darilna koda: nakup …« |
| Podaljšanje | SP »naročnina: nakup … → podaljšanje …« (nov konec obdobja) | – (enkratno plačilo) | – | – |
| Neuspelo plačilo | SP »naročnina: neuspelo plačilo …« (e-pošta enkrat, odlog, brezplačni paket, plačilo vrne dostop); P »neuspelo plačilo«; SN N3–N5 | – (Checkout: plačilo uspe ali seje ni) | – | – |
| Preklic | SP »… preklic ob koncu obdobja → konec« (dostop do konca obdobja); SN N2, N3 | – | – | – |
| Vračilo | SP »naročnina: delno in polno vračilo …« (meja AI takoj nižja); G (garancija) | SP (polno vračilo); P »paket pred testom …« (delno vračilo) | SP »dokup pogovorov …« | C »darilna koda: nakup … vračilo«, C (dve darili) |
| Spor (chargeback) | P »spor pri enkratnem plačilu …«; B | P »webhook vklopi paket« | SP »dokup pogovorov …« | SP »darilna koda …« |
| Dvojni dogodek | B, R; SS (sočasna dostava → 409) | SP, P | R RR8 | SP |
| Zamujen dogodek | SP (star »active« po koncu); B, R RR5, SN N6 | SP (async po completed) | R RR8 | SP |
| Ponarejen podpis | B (brez glave, napačen ključ, star čas, spremenjeno telo); A | (preverjanje podpisa je pred obdelavo, velja za vse) | | |
| Izbrisan kupec | P, B, R (plačilo ne gre novemu računu z istim id; zapis za ročno vračilo) | P | P, R RR9 | P |

Preverjeno z »mutacijami« (15. 11. 2026): če iz `server/accounts/index.js` odstranimo obdelavo spora pri dokupu ali
darilu, znižanje meje ob vračilu naročnine, konec paketa ob vračilu, enkratno e-pošto ob neuspelem plačilu ali
odvzem kredita ob vračilu, novi testi v SP padejo.

## Česar testi ne pokrijejo (ročno v Stripe testnem načinu)

- Prava povezava s Stripom (ključi, cene, webhook v nadzorni plošči): enkrat pred pilotom ročni nakup s testno kartico
  `4242 4242 4242 4242`, zavrnjeno plačilo s `4000 0000 0000 0341`, preklic v portalu, vračilo v Stripe → Payments.
  V Stripe → Developers → Webhooks mora biti vsak dogodek odgovorjen z 200.
- Odlog ob neuspelem plačilu testi skrajšajo s spremembo v bazi (`past_due_since`), ne s pravim časom.
- Vračilo naročnine ne prekliče naročnine: to naredi skrbnik v Stripu (test to preveri).
