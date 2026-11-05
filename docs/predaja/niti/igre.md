# Predaja: nit IGRE (4. 11. 2026)

Stara nit: cmsg_011HYzNBAS5HRU1H7PcSE7Jt9tB1wmUdEAviPfgregVrhf. Repo jakobskerbis/Evklid. Vse delo je združeno v main: ni odprtih PR-jev in ni nezdruženih vej. Spomin: `evklid-games.md` (projektni spomin).

## Kaj je narejeno (vse v main)
- **#174** Vprašalnik »Katere igre si igral kot otrok?« (`public/games/childhood.js`).
  - 27 zvrsti, nastavitev profila `game_childhood`.
  - Motorji `retro.js`: blocks, match, cards.
- **#197** Tedenske nove igre po glasovih.
  - 👍/👎 po igri, glas tedna (`wishes.js`, teden od srede do srede UTC).
  - Plošča »Glasovi tedna (za pregled)« vidi le skrbnik ali lokalni računalnik. j je izbral, da glasovi niso javni.
  - Postopek: `docs/igre-tedensko.md`.
- **#222** Lastni naslovi iger v vprašalniku (`game_titles`, `matchTitle`).
- **#231** »Kdo je slepar?« (`public/games/deduction.js`, motor `impostor`).
  - Izvirni robotki, izgon skozi zapornico. Naloge z izbiro pokažejo svoje možnosti.
  - Kljuke v `core.js`: `engine.prompt`, `G.ask()`, `timer(G)`, `G.answer({note})`, `timeout()` lahko vrne možnosti, `question()` lahko vrne opis za bralnik zaslona.
- **#236** Mreža iger po straneh, 60 iger na stran (`public/games/pages.js`, testi v `test/games.test.js`, korak v `preveri-aplikacijo.cjs`).
- Skupaj 31 vrst iger. Pravila za novo vrsto igre so v `docs/igre-tedensko.md` (razdelek »Kako narediti igro«) in v `docs/oblikovanje.md`.

## Odprto delo (j, 1. 11.): začni zdaj, po ponastavitvi porabe
j: »Naredi tako, naj bodo igre bolj raznovrstne kot samo izbiranje pravilnih možnosti« (vprašal je tudi, ali razdelek Igre sploh ima smisel; odgovor: ima, če pomaga pri učenju).

Načrt, ki ga je j potrdil z »Ok«:
1. **Nove vrste interakcije, ne izbiranje odgovora.**
   - Prve štiri: številska premica (točko povlečeš na vrednost), sestavi enačbo iz ploščic, razvrsti po velikosti (vlečenje), računanje na pamet z vtipkavanjem na tipkovnici na zaslonu.
   - Kasneje: točke v koordinatnem sistemu, pari in logične uganke (cevi, nonogram, ugani enačbo).
2. **Dnevna uganka**, enaka za vse, z lestvico po času. Stopnje Lahko, Srednje in Težko, z namigi in kratko razlago na primeru.
3. **Povezava z učno potjo:** igra kot nagrada po dnevnem treningu in vrsta »Ponovi šibke teme« iz učenčevih napak.
4. **Merjenje v pilotu:** igre na učenca, vrnitev na pot po igri, točnost pri šibkih temah.

Pogoji:
- Vse platforme morajo biti enake (splet + Android).
- Majhni PR-ji, trojni pregled (`docs/pregled.md`).
- Pred začetkom preveri tempo optimizatorja (`docs/token-rules.md`).

Vzor:
- Posnetki iz aplikacije Astra so v `/mnt/project-files/evklid/igre-vzor/` (»Linearni žarek«: vpišeš k in n, da žarek zadene kristale; uganke; dnevna uganka).
- Vzamemo samo ideje: lasten Evklidov videz in besedila, brez kopiranja.
- j: »ni nujno da so take«. Žarek je le en primer, cilj je čim več različnih načinov igranja.
- Simulacije (atlas, osončje, vezja) je koordinator predal niti laboratorija (cmsg_011HYzNBAS5HRU1H7PcSE7JtWrCGs3grp6Y6Jj3kHqkanY), ne tej niti. Slike so v `/mnt/project-files/evklid/simulacije-vzor/`.

## Opomniki (ustavljeni 4. 11.; nova nit naj jih po potrebi ponovno vklopi ali ustvari znova)
- `trig_017B529ZEiVjUNcz8hBiKXna` »Igre: tedenski pregled glasov za j«, cron `13 6 * * 3` (sreda 06:13 UTC), **izklopljen**.
  - Postopek: j-ja prosiš, naj prilepi »Kopiraj seznam za Clauda«. Nato pripraviš zmagovalca in 2–3 predloge na kartici za odločitev. Gradiš šele po j-jevi izbiri (`docs/igre-tedensko.md`).
  - Opomnik je vezan na staro sejo, zato ga v novi niti ustvari znova (z istim besedilom).
- `trig_01FbdHGUEiBUneYG4BnAaZAy` enkratni opomnik 4. 11. ob 03:30 UTC za zgornje odprto delo, **izklopljen** (delo je opisano zgoraj).

## Drugo
- `test/exams.test.js` »ENEM has five options« je 30. 10. enkrat naključno padel. Koordinator je obveščen; ni del IGRE.
- Avatar in trgovino ima nit kozmetike. Datotek avatarja ne urejaj iz IGRE.
- j piše slovensko in ni tehnik: odgovori kratko in preprosto. Nit sama združuje svoje PR-je.
