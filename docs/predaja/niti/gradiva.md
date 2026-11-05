# Predaja: Nova gradiva (točka 7 j-jevega briefa)

Stara nit: cmsg_011HYzNBAS5HRU1H7PcSE7JtQggKMZ4A1XQh3NZ4m8jwUh (»Add new learning material types«), predano 4. 11. 2026 ob ~06:25 UTC, ker je imela 285k konteksta.
Spomin: `/tmp/claude/memory/team/silo/evklid-gradiva.md` (posodobi ga ti).

## Cilj
j-jev brief `/mnt/project-files/evklid/placljivi-paket/prompt-za-koordinatorja.md`, točka 7: nove vrste učnih gradiv.
Šolska licenca odpre šolske predmete, Osebno vse predmete. Vsebino piše in pregleda samo Opus ali Fable, vedno s trojnim pregledom.

## Narejeno (vse spojeno v main)
- #177: povzetek na eni strani z miselnim vzorcem; zvočni povzetek (brskalnik bere, `server/govor.js`); delovni list z rešitvami; delovni list iz šibkih tem (na strani Napredek); NPZ/matura samo kot povezave na ric.si (RIC ima vse pravice, pol ne kopiramo).
- #186: oblike in strani za domači poskus, projekt in kratek video iz simulacije; predvajalnik videa (`public/gradiva.js`); preverjanje `scripts/check-gradivo.js`.
- #198: kviz v živo za razred (`server/kviz.js`, `public/kviz.js`) in delovni listi za učitelje.
- #206: prikaz napisanega miselnega vzorca.
- Pravila za pisce so v `docs/gradiva.md`, primeri v `test/fixtures/gradiva/`.

## Odprto: prvi paket vsebine
- Odločitev j 4. 11. 06:15 (cmsg_011HYzNBAS5HRU1H7PcSE7Jt8yb3opx6TsGczfUTMVkQDk): »sproži vse queued naloge, in jih ne ustavi razen ce porabijo vec kot 40% weekly limita«.
- Znesek in tempo da optimizator (cmsg_011HYzNBAS5HRU1H7PcSE7JtRD8HLfR81B3wJiA5ayzef5). Vprašanje je poslano 06:16; ODGOVOR (06:17): **30 $ za prvi paket**, Opus pisec → pregledovalec → bralec, največ 2 agenta hkrati. Če paket doseže znesek, pushaj nedokončano in se ustavi. Ko končaš, sporoči `usage.cost_usd` optimizatorju. Štej strošek nove niti od njenega začetka.
- Predlog prvega paketa (približno 25–35 $), samo OŠ/SŠ FIZ, KEM in NAR:
  - 6 domačih poskusov;
  - 4 projekti;
  - 4 scenariji za video.
- Datoteke gredo v `content/gradiva/<poskus|projekt|video>/<POT>/<tema>.md`, z enakim id kot lekcija.
- Postopek na vsak par datotek: pisec (Opus), nato pregledovalec (Opus), nato bralec z očmi učenca. Največ 2 agenta hkrati, brez workflowa.
- Pred commitom zaženi `node scripts/check-gradivo.js -q <datoteke>` in `npm test`.
- Pisec: `node scripts/lesson-topic.js <id>` za raven teme. Za video vzemi simulacijo iz `public/sim/katalog.js` in imena drsnikov (`kit.slider` label) iz izvorne kode simulacije.
- Poskusi naj bodo samo varni doma: brez kislin, ognja ali elektrike iz vtičnice.
- Video: preveri ga v brskalniku na Playwrightu (`openVideo` v `public/gradiva.js`), da se dejanja res izvedejo.
- `stanje: osnutek`, dokler ni opravljen tretji pregled, potem `pregledano`.
- Zadržek spajanja (test na Renderju) je končan ob 07:17; spajaj normalno.
- En PR na paket. Spoji ga sam. Optimizatorju sporoči `usage.cost_usd`.

## Effort
j (4. 11. 06:26, cmsg_011HYzNBAS5HRU1H7PcSE7JtE2VfrnJZhguy6hmEdE7qsS): optimalen effort za vsako nit. Za gradiva je **medium** (tabela /mnt/project-files/optimizator/effort-po-nitih.md); nastavi ga s set_effort_level. Pisci in pregledovalci vsebine ostanejo Opus po token-rules §5.

## Pasti
- Na isti seji več serverjev: vsak agent naj uporabi svoja vrata (3457, 3458 …). Nikoli `pkill -f`, ker ubije lastno lupino; ubijaj po vratih s `fuser -k`.
- Pri pushu na `claude/...` je bila veja po squash merge stara. Force push je zavrnjen, zato uporabi `git merge -s ours origin/<veja>` in navaden push.
- Po menjavi main pogosto manjkajo paketi (npr. helmet): zaženi `npm ci`.
- Nizi v UI gredo v `public/i18n/sl.js` in vseh 32 `ui/*.json`.

## Kartice, ki čakajo na j
Ni jih.

## Načrtovana bujenja
Ni jih.

## PR-ji in veje
Odprtih ni. Veja `claude/project-thread-xcrkct` je prazna (vse je spojeno).
