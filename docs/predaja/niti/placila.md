# Predaja: plačila, šole, cene (4. 11. 2026, 07:55 UTC)

Iz niti »Build school licences, paid plans and access« (cmsg_011HYzNBAS5HRU1H7PcSE7JtDjri6iP8TcwTf5J3DbtE91), ki ima 290 tisoč žetonov.
Spomin projekta: `evklid-pricing-levels.md`, `evklid-school-build.md`, `evklid-payments-design.md`.

## Narejeno
- PR #290 je združen 4. 11. ob 7.52 (squash 5ad23063). Vsebuje:
  - pomožno funkcijo `public/stopnja.js` za stopnjo profila;
  - cene z najmanj 75 % dobička: OŠ 9,99/99 €, SŠ 13,99/139 €, faks 19,99/199 €, Družina 18,99/189 €, Družina s študentom 27,99/269 €; paketi pred testom 5,49/8,49/13,99 €, faks paketi 6,99/11,49/19,99 €; šolska licenca 5,99/49 €; darilo = letna cena stopnje;
  - dokup AI s 75 % dobička;
  - skupen delež AI za družino;
  - hitri način in brezplačni rep (0,2 $ na profil) sta všteta v delež, nato blokada do 1. v mesecu ali do dokupa;
  - Stripe portal: za vsak paket svoja nastavitev (samo mesečno ↔ letno istega paketa).
  Tabela: /mnt/project-files/evklid/placljivi-paket/cene-75-odstotkov.md.
- j je pravila določil 4. 11.:
  - ob 5.00: vsak paket ima vsaj 75 % dobička;
  - ob 6.12: kar je finančno najugodnejše zame;
  - ob 7.28: »ok« za Družino 18,99 € in za spajanje.

## Odprto (omejitev optimizatorja 4. 11.: garancija 15 $, »Podari Evklid« 15 $, oboje s trojnim pregledom)
1. **Garancija »Boljša ocena ali vrnemo denar«** (j je izbral na kartici 4. 11. ob 3.55):
   - velja 60 dni;
   - otrok vadi vsaj 3 dni na teden 8 tednov (Evklid to izmeri sam);
   - starš sporoči oceno pred in po;
   - če ocena ni boljša, dobi vrnjeno vse plačano;
   - enkrat na družino.
   Zgraditi: besedilo v pogojih poslovanja, vrstico v Računu in na strani naročnine, zahtevek starša, admin vračilo prek Stripe (testni način). Besedila v sl + 32 jezikov.
2. **»Podari Evklid«** (j je izbral »Oboje« 4. 11. ob 3.54), načrt v /mnt/project-files/evklid/placljivi-paket/podari-evklid.md:
   - kode »Podari« za pilotske šole, 2–3 na šolo iz proračuna AI (~20 $ na mesec);
   - prostovoljni dodatek pri plačilu (+2/+5/+10 €) in gumb »Podari mesec«, vse v testnem načinu Stripe;
   - števec podarjenih mesecev;
   - brez podatkov o dohodkih (šola presodi), brez oznake na profilu.
   Nadgradnja `server/placila/darila.js`. Besedilo mora jasno povedati, da to ni donacija.
3. **PR 3: začetna stran in inštruktor po stopnji**, naslednji teden, po /mnt/project-files/predaja/cenik.md: vrstni red kartic, študijsko leto faksa od 1. 10., dodatek k promptu. Prompt in posnetke zaslona pregleda j.
4. **Manjše, kar je ostalo po PR #290:**
   - cene v trgovinah z aplikacijami ~+25 % pred zagonom trgovin;
   - nekateri regijski letni paketi za 2 otroka (INR, BDT, IDR) nimajo podrobnih razlag;
   - besedilo blokade v strežniku je samo v slovenščini;
   - stari račun z oznakami v slovenščini;
   - nadgradnja sredi meseca dobi poln nov delež.
5. **Kartice v tej niti, na katere j še ni odgovoril:** meja AI za šole 0,5 €/učenca/mesec; poudarek na letnih paketih; pilot 12 € samo za prvih 10 šol. Test cen 9,99 proti 12,99 je smiseln šele s pravimi plačili (po s.p.).

## Pravila
- PR s cenami se ne združi brez j-jeve kartice.
- Stripe ostane v testnem načinu, ker j nima s.p.
- Trojni pregled po docs/pregled.md.
- Splet in aplikacija se ujemata.
- Besedila v sl + 32 jezikov.
- Veja: sveža iz main. Če oddaljena veja obstaja, pred potiskom `git merge -s ours`, ker je force-push prepovedan.
