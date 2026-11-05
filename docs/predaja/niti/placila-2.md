# Predaja: plačila 2 (4. 11. 2026, 10:30 UTC)

Iz niti »Zgradi garancijo in Podari Evklid« (cmsg_011HYzNBAS5HRU1H7PcSE7JtDjFozFEass6uv54Ai95CpJ). Kontekst te niti je ~350k žetonov, zato nadaljuje nova nit. Spomin projekta: `evklid-guarantee-podari.md`, `evklid-pricing-levels.md`, `evklid-payments-design.md`.

## Narejeno
- **PR #331 spojen** (squash 38f94ab): garancija »Boljša ocena ali vrnemo denar« (`server/placila/garancija.js`, `public/garancija.html`) in »Podari Evklid« (`server/placila/podari.js`), UI v `public/garancija-ui.js`, testi `test/garancija.test.js`. Kartice j: 4. 11. ob 3.55 (pogoji garancije), 3.54 »Oboje« (Podari), 7.56 »60 dni po 8 tednih vaje«. Vse samo v testnem načinu Stripa.
- **PR #339 odprt** (veja claude/project-thread-7m83f5, head b42dbd9): pilot 12 € samo za prvih 10 šol, privzeta meja AI šolske licence, letni paket prvi s »prihraniš 17 %«. Ko je meja AI porabljena, se ustavi samo AI (`rights().schoolAiOut`), lekcije ostanejo. Trikrat pregledano, npm test 974/0. j je vse tri stvari potrdil 4. 11. ob 8.05 (»Ok«, »Vse da«, cmsg_011HYzNBAS5HRU1H7PcSE7JtCax84tVGf5hXqNDpMndr83, cmsg_011HYzNBAS5HRU1H7PcSE7JtY56yzeoVyn7623YkuJNxpJ).

## Kartice, ki čakajo j (v stari niti; ta nit jih tam tudi zaključi in spoji #339)
1. ZAKLJUČENO 4. 11. 10.56: j izbral A (»Ok«), meja ostane 25 % cene; po začetku pilotnih šol preveri dejansko porabo. Prej: A »Cene ostanejo, meja AI 25 % cene« (privzeto v kodi), B »Dvigni cene na 75 %« (razredi 35 €, šola 29 €, pilot 25 €, AI 0,3 €, potrebuje spremembo SCHOOL_LICENCE_PRICES + /sole), C »0,5 € AI« (= `EVKLID_SCHOOL_AI_EUR=0.5` na Renderju). Prejšnja nit je napačno trdila, da 0,5 € da 75 %: s strežnikom 0,30 €/profil 75 % pri 12–20 €/leto ni mogoč.
2. ZAKLJUČENO: PR #339 spojen 4. 11. 10.27.

## Odprto za novo nit
1. **PR 3: začetna stran in inštruktor po stopnji** po /mnt/project-files/predaja/cenik.md (vrstni red kartic, študijsko leto faksa od 1. 10., dodatek k promptu). Prompt in posnetke zaslona pregleda j pred spajanjem.
2. Manjše po PR #290: besedilo blokade AI v strežniku samo v slovenščini; stari račun z oznakami v slovenščini; nadgradnja sredi meseca dobi poln nov delež; regijski letni paketi za 2 otroka (INR, BDT, IDR) brez razlag; v izbiri paketa trdo kodirana slovenščina (»mesec«, »šolsko leto«, »(10 mesecev)«, »Plačilo poteka varno prek Stripe…«), vidno tudi v arabščini.
3. Iz pregledov #331/#339 (zapisano v PR): števec Podari še ni na /sole; zasebnost.html ne omenja podatkov garancije; tedni vaje po UTC; sklad lahko gre v minus po vračilu; sola-vir.js šteje porabo tudi učencev brez mesta; naročilo pilota ne rezervira mesta.
4. Cene v trgovinah ~+25 % šele ob zagonu trgovin (po s.p.).

## Pravila
- Stripe ostane v testnem načinu (j nima s.p.). Cene, ki jih ljudje vidijo, se spojijo šele po j-jevi kartici. Trojni pregled po docs/pregled.md. Splet in aplikacija se ujemata. Besedila v sl + 32 jezikih.
- Veja: sveža iz main. Po spajanju PR se oddaljena veja izbriše; potisk včasih vrne 500, ponovi.
- Porabe ni več omejene (j 9.34); poročaj optimizatorju cmsg_011HYzNBAS5HRU1H7PcSE7JtEMiTgSpbZu2iAmVotBg46y.
- Ta nit je porabila 31,3 $ (cost_usd ob 10.25 UTC).
