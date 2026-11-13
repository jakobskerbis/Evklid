# Povratne informacije testerjev

Testerji v aplikaciji povedo, kaj je dobro in kaj ne. Iz tega nastane seznam sprememb, ki jih Claude naredi po tvoji potrditvi.

## Kje testerji povedo mnenje

- **Učna pot**: kartica »Kako ti je všeč Evklid?« z gumbom »Povej mnenje« (izgine, ko tester pošlje mnenje ali jo zapre).
- **Računalnik**: zavihek »Mnenje« v zgornji vrstici. **Telefon**: Jaz → Povratne informacije.

Dve možnosti, tester izbere:

1. **Vprašalnik**: ocena 1–5 (obrazki) za Učno pot in naloge, Inštruktorja, Učbenik in simulacije, Tekmovanja, Videz, Hitrost, Točke in lige; trije odgovori s svojimi besedami (kaj je všeč, kaj moti ali ne dela, kaj bi dodal); ali bi priporočil prijatelju.
2. **Pogovor z inštruktorjem**: 5–6 kratkih vprašanj v klepetu (kaj si uporabljal, kaj je všeč, kje si se zataknil, na katerem zaslonu, kaj bi spremenil, ali bi uporabljal za šolo). Vprašanja so pripravljena v aplikaciji in ne stanejo nič. Z `EVKLID_FEEDBACK_AI=1` (in API ključem) pogovor vodi Haiku, ki pri nejasnem odgovoru še enkrat vpraša po podrobnostih; največ 6 vprašanj, okoli 0,1 centa na pogovor.

Vse je v jeziku, ki ga ima tester izbranega.

## Kam se shrani

- tabela `feedback` v bazi in
- **`data/povratne-informacije.json`** (cela kopija, ob vsakem novem mnenju).

Na računalniku, kjer teče Evklid (`http://localhost:3000`), je pod vprašalnikom še razdelek **Zbrana mnenja**: povzetek in gumba »Prenesi povzetek« (.md) in »Prenesi vsa mnenja« (.json). Prek povezave za telefon (Cloudflare) in na Renderju tega razdelka ni, zato testerji ne vidijo mnenj drugih.

Povzetek brez aplikacije: `node scripts/povzetek-povratnih.js` zapiše `data/povratne-informacije-povzetek.md`.

## Povzetek

Brez AI, samo koda (`server/feedback.js`):

- tabela povprečnih ocen po področjih,
- **Predlogi sprememb**: področja z najnižjo oceno in največ pritožbami najprej; pod vsakim citati težav in predlogov (razvrščeni po ključnih besedah, npr. »učbenik«, »počasi«, »gumb«),
- kaj je testerjem všeč (tega ne spreminjamo),
- drugi odgovori iz pogovorov.

## Od mnenj do sprememb

Aplikacija se ne spreminja sama, ker bi lahko en tester (ali šala) pokvaril aplikacijo vsem. Postopek:

1. Testerji pošiljajo mnenja.
2. V projektu napišeš Claudu **»uporabi povratne informacije«**. Claude prebere `data/povratne-informacije.json` z računalnika (dostop do mape na namizju) ali datoteko, ki jo naložiš.
3. Claude pripravi kratek seznam konkretnih sprememb (kaj, zakaj, koliko testerjev je to omenilo) in ga pokaže.
4. Odgovoriš **»ok«** (ali izbereš točke). Claude naredi spremembe in pošlje novo različico; na telefon pride ob naslednjem zagonu `telefon-windows.bat`.
