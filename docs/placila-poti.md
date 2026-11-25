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
| Neuspelo plačilo | SP »naročnina: neuspelo plačilo …« (e-pošta enkrat, odlog, brezplačni paket, plačilo vrne dostop); SP »… unpaid → brezplačni paket«; P »neuspelo plačilo«; SN N3–N5 | – (Checkout: plačilo uspe ali seje ni) | – | – |
| Preklic | SP »… preklic ob koncu obdobja → konec« (dostop do konca obdobja); SP »preklic in nato nadaljevanje …«; SN N2, N3 | – | – | – |
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

- **Različica API webhooka mora biti `2024-06-20`** (Stripe → Developers → Webhooks → endpoint → API version), enaka
  kot v `server/accounts/stripe.js`. Nov endpoint dobi privzeto najnovejšo različico (2025-03-31 »basil« ali novejšo),
  v kateri dogodek `charge.refunded` nima več polja `invoice`: vračilo naročnine bi takrat **ne** znižalo meje AI
  (pregled koraka 4, 15. 11. 2026). Testi pošiljajo obliko 2024-06-20.

- Prava povezava s Stripom (ključi, cene, webhook v nadzorni plošči): enkrat pred pilotom ročni nakup s testno kartico
  `4242 4242 4242 4242`, zavrnjeno plačilo s `4000 0000 0000 0341`, preklic v portalu, vračilo v Stripe → Payments.
  V Stripe → Developers → Webhooks mora biti vsak dogodek odgovorjen z 200.
- Odlog ob neuspelem plačilu testi skrajšajo s spremembo v bazi (`past_due_since`), ne s pravim časom.
- Vračilo naročnine ne prekliče naročnine: to naredi skrbnik v Stripu (test to preveri).

## Znano, a ne popravljeno (zapisano za j, 15. 11. 2026)

- Dobljen spor (`charge.dispute.closed`, sredstva vrnjena) ni obdelan: odvzet paket, kredit, darilo ali naročnina
  ostane odvzet, skrbnik ga vrne ročno.
- Delno vračilo dokupa odvzame cel paket kredita; že porabljeni del tega paketa se odšteje od drugih aktivnih paketov.
- Koda ob vračilu naročnine bere `charge.invoice` iz dogodka; pri novejši različici API bi morala plačilo prebrati
  s `GET /charges/:id` (zgoraj: dokler je različica webhooka `2024-06-20`, to ni potrebno).

## Odstop od pogodbe: funkcija za odstop (ZVPot-1A, 18. 11. 2026)

Zakon: 138.a člen ZVPot-1A (Uradni list RS, objava 29. 10. 2026; velja 15. dan po objavi, uporablja se 30 dni po
uveljavitvi) in člen 11a Direktive 2011/83/EU (Direktiva (EU) 2023/2673). Stran `/odstop.html` (kratka pot `/odstop`),
povezava »Odstop od pogodbe« v nogi vseh javnih strani, na pristajalni strani in v zavihku Račun (dokler je kaka
pogodba v roku). Strežnik: `server/placila/odstop.js`, test `test/odstop.test.js` (**O**).

| Korak | Kaj | Test |
|---|---|---|
| Funkcija | naslov »Kliknite tukaj za odstop od pogodbe« in takoj obrazec (ime, e-naslov za potrdilo, pogodba) → »Potrdi odstop od pogodbe« | O »oznake …« |
| Brez prijave | zapis + potrdilo o prejemu (vsebina, datum in ura s sekundami, CET/CEST); obdela skrbnik | O »brez prijave …« |
| Prijavljen imetnik | izbere pogodbo v roku 14 dni (naročnina, paket, dokup); vračilo v Stripu, nato takojšen preklic | O »prijavljen imetnik …« |
| Znesek | sorazmerno (pogoji 12. točka), če je plačnik pred plačilom izrecno potrdil takojšen začetek, sicer celotno | O »… celotno vračilo« |
| Skrbnik | Račun → »Odstopi od pogodbe«: izvedi, poveži obvestilo brez prijave z računom, zaključi ročno (razlog) | O »skrbnik …« |
| Pravi ključ | samodejno vračilo samo v testnem načinu, dokler ni `EVKLID_ODSTOP_LIVE=1` | O »pravi ključ …« |

Varovalke (pregled #843, 18. 11. 2026):
- Vračilo je idempotentno: ključ `withdrawal-<id>-<payment_intent>`, oznaka »pending« pred klicem; ob ponovitvi strežnik
  najprej poišče vračilo z `metadata.withdrawal_id` (`GET /refunds`). Pri paketu in dokupu se vrne največ
  prejeto − že vrnjeno (`GET /payment_intents/:id`). Znesek ob oddaji obvestila je zgornja meja.
- Pogodba z neuspelim, izvedenim ali delno vrnjenim odstopom ni več na seznamu (ni drugega vračila).
- Manj vrnjeno od zneska → stanje »ni uspelo« z zapisom »vrnjeno X od Y, uredi ročno«; skrbnik dobi e-pošto za vsako
  obvestilo, ki ni bilo izvedeno samodejno; neobdelano dlje kot 7 dni je v seznamu označeno.
- Obrazec brez prijave: največ 2 potrdili na isti naslov v 24 urah in 50 obvestil skupaj (nad tem zapis brez e-pošte,
  opozorilo v dnevniku); potrdilo samo kot besedilo, brez povezav in e-naslovov iz vpisanega besedila. Skrbnik
  neželeno obvestilo brez prijave izbriše ali potrdilo pošlje znova.
- Potrdilo, ki ni bilo poslano, se poskusi znova enkrat na dan (največ 5-krat); na zaslonu »Prenesi potrdilo«.
- Preklic samo naročnine, od katere je kupec odstopil (`p.sub_id`); že preklicana šteje kot uspeh.
- Izrecna zahteva za takojšen začetek šteje le, če je soglasje zapisano pred začetkom pogodbe (+10 min) ali je
  povezano z isto plačilno sejo (paket, dokup).
- Pred vsakim plačilom (naročnina, paket, dokup, darilo, Podari, stran za starše) je vrstica o funkciji za odstop
  (130. člen 6. točka); povezava »Odstop od pogodbe« je v zavihku Račun vedno, nad karticami.

Nastavitve (Render → Environment):
- `EVKLID_ODSTOP_VRACILO=celotno`: vedno celotno plačilo (če pravnik reče, da sorazmerni del ni dovoljen).
- `EVKLID_ODSTOP_SAMODEJNO=0`: nič samodejno, vse obdela skrbnik.
- `EVKLID_ODSTOP_LIVE=1`: samodejno vračilo tudi s pravim ključem (po s.p. in potrditvi pravnika).

Nakupi v App Store in Google Play: trgovina je prodajalec in vodi vračila; stran prijavljenemu imetniku pove, naj odstop
uredi pri trgovini, obvestilo brez prijave pa skrbnik zaključi z razlogom.

## Splošni pogoji: osnutek in objava

`EVKLID_POGOJI_OBJAVLJENI` (privzeto izklopljeno): `/pogoji.html` pokaže pasico »Splošni pogoji so v pripravi« in
noindex, plačila s pravim ključem Stripa (`sk_live_`) vrnejo 409 (`terms_draft`), testni način deluje naprej. Z `=1`
strežnik odstrani dele med `<!-- osnutek -->` in `<!-- /osnutek -->` (`server/pogoji-stran.js`), plačila se odprejo
in imetnik, ki zadnje različice (`TERMS_VERSION`) še ni potrdil, v zavihku Račun dobi pasico »Novi splošni pogoji«
(`POST /api/account/terms`, zapis različice in časa v `consents`). Ob vsaki potrditvi pred plačilom se različica
zapiše v `billing_consents.terms_version`; ob potrditvi je prikazana različica (`terms_version` v `/api/account` in `/api/pay/:token`).
Objava novega besedila: zamenjaj besedilo v `public/pogoji.html`, popravi datum »Različica« in `TERMS_VERSION`
(`server/accounts/potrdilo.js`; test preveri, da se ujemata), nato nastavi zastavico.
