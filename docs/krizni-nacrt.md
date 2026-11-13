# Krizni načrt: ko se zgodi kaj neljubega

Celoten načrt (vloge, stopnje, časovnica, pripravljena sporočila za omrežja, starše, učitelje in medije):
[Evklid – krizni načrt za neljube dogodke](https://claude.ai/artifact/SDR71FXmRVsb6T5YzzQwhC).
Dogodek javi v projektni niti »Pripravi krizni načrt za neljube dogodke«. Javne objave potrdi samo j.

## Orodja v aplikaciji

- **Trojno preverjanje shranjenih odgovorov** (j, 2026-10-30: »lahko se shranjuje, ampak naj bo dovoljkrat
  pregledano za popolno točnost«, `server/verify.js`). Odgovor, ki bi ga dobili drugi učenci (`answer_cache`),
  in kartice za ponavljanje so vidni šele, ko jih preverijo (1) koda, ki znova izračuna vsak račun v `$…$`,
  ter (2) in (3) dva neodvisna AI pregleda z različnima modeloma (privzeto Sonnet in Opus, `EVKLID_VERIFY_MODELS`).
  Če kateri od treh pregledov najde napako ali dvomi, se odgovor ne shrani. Strošek je omejen z `EVKLID_VERIFY_DAILY_USD`
  (privzeto 1 $ na dan); nad tem se nič novega ne shrani. Stari, nepreverjeni shranjeni odgovori so skriti.

- **Prijavi napako** pod vsakim odgovorom inštruktorja: učenec izbere razlog (napačen odgovor, neprimerna
  vsebina, drugo) in po želji napiše, kaj bi moralo pisati. Prijava se shrani v tabelo `message_reports`
  in odgovor se takoj izbriše iz predpomnilnika (`answer_cache`), da ga ne dobi noben drug učenec.
  Seznam: skrbnik v Računu → »Prijave napak« (`GET /api/admin/reports`, prenos v Markdownu
  `/api/admin/reports/export` za popravke, gumb »Popravljeno«); na računalniku s strežnikom tudi `GET /api/reports`.
- **Prijavi napako v vsaki lekciji** (splet in aplikacija): razlog (napaka v besedilu ali računu, nejasno,
  nekaj ne deluje, drugo), opomba in korak lekcije; tabela `bug_reports` (`kind = lesson`). Skrbnik ima v
  glavi klepeta še svoj gumb za napako v aplikaciji ali pri inštruktorju (`kind = app`, priloži zadnjih
  10 sporočil pogovora). Prijave pregledamo in popravimo v nekaj dneh, nato jih označimo »Popravljeno«.
- **Koda sporočila** (npr. `#00YA`) pod vsakim odgovorom. Če kroži posnetek zaslona, s kodo takoj najdemo
  sporočilo v bazi; če ga ni, je posnetek ponarejen ali iz druge aplikacije.
- **Opozorilo** pod poljem za pisanje: »Evklid se lahko zmoti. Pomembne rezultate preveri.«
  (preglednost po AI Act, čl. 50).
- **Stikalo** `EVKLID_CHAT_OFF=1` v `.env` (nato ponovni zagon): klepet z inštruktorjem je izklopljen za
  vse in pokaže obvestilo; Vadnica, učbenik in igre delujejo naprej.

## Ukazi

```
node scripts/najdi-sporocilo.js "#00YA"            # sporočilo s posnetka, pogovor okoli njega, oznake, predpomnilnik
node scripts/najdi-sporocilo.js --besedilo "= 54"  # iskanje po delu besedila odgovora
node scripts/najdi-sporocilo.js --prijave          # zadnje prijave napak
node scripts/najdi-sporocilo.js --odstrani "#00YA" # odstrani odgovor iz predpomnilnika
```

Ukaz samo bere bazo (razen `--odstrani`). Pregleda se samo pogovor, ki je povezan z dogodkom.

Druga stikala za nujne primere: `EVKLID_ANSWER_CACHE=0` (brez ponovne uporabe odgovorov),
`EVKLID_FREE_POOL_USD=0` (brez AI za brezplačne učence), `EVKLID_MODEL` (večji model inštruktorja).

## Kršitev varstva osebnih podatkov (čl. 33 in 34 GDPR)

Kršitev je tudi nenamerno razkritje ali dostop (npr. API vrne podatke drugega računa), ne glede na to, ali je kdo pogledal.
1. **Ustavi uhajanje** (popravek ali stikalo) in zavaruj dokaze (commit, od kdaj, dnevniki Renderja).
2. **Ugotovi dejstva:** kateri podatki, čigavi (otroci?), koliko oseb, od kdaj, kdo je lahko videl, kopije na napravah.
3. **Oceni tveganje in odloči (j, upravljavec), rok 72 ur od seznanitve:**
   - verjetno tveganje → prijava Informacijskemu pooblaščencu (čl. 33(1)); kar še ni znano, se dopolni pozneje;
   - visoko tveganje → še obvestilo prizadetim (staršem) v preprostem jeziku (čl. 34);
   - ni verjetnega tveganja → brez prijave.
4. **Vedno zapiši evidenco** (čl. 33(5)) v `docs/krsitve/LLLL-MM-DD-<kratko>.md`: kaj, od kdaj, kdo je lahko videl,
   ocena in odločitev z razlogom, ukrepi. Primer: `docs/krsitve/2026-11-06-lestvica.md`.
5. **Prepreči ponovitev:** test, ki pade na stari kodi (npr. `test/zasebnost-vse-poti.test.js`).
