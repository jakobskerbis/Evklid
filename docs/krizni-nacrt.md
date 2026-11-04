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
