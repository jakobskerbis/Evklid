# Predaja: Dodaj razdelek za NPZ in maturo

Iz niti cmsg_011HYzNBAS5HRU1H7PcSE7JtV5M8vhzSzQSBfZTSXTXDp4 (30. 10.–4. 11. 2026). Spomin: `evklid-npz-matura.md` (posodobljen).

## Cilj
j (30. 10. 11:01): »naj ima evklid poseben razdelek posvečen npz-jem in maturi«. Nadaljevanja: pole razvrščene kot izbira ravni izobrazbe (11:03); vse pole predelane in razložene na več načinov (11:02); »ne uporabljaj dobesednih nalog samo strukturo nalog« (11:23, cmsg_011HYzNBAS5HRU1H7PcSE7JtPH9Ly7BapNbpMABm7w2A3e); kaj ima Evklid več kot RIC + ChatGPT (1. 11.).

## Narejeno in združeno (repo zdaj jakobskerbis/Evklid)
- PR #213: pogled `#view-exams`, kartica pripravljenosti (`Progress.examReadiness`), izpit POKLICNA (RIC PIK-MAT-2026), izbirnik preteklih pol (`server/exam-papers-si.js` iz `scripts/pole-ric.js`, samo povezave na ric.si, prazni `structure: []`, `ours: null`).
- PR #237, #238: preverjanje števil (regex tisočic: »1.1484«, »1.200,5«, »-1.200«).
- PR #263: »Rešuj z inštruktorjem« pri vsaki poli (nov pogovor, predizpolnjen `pp.tutorMsg`).
- PR #272: »Odpri preneseno polo« – PDF ostane na napravi, pdf.js 4.10.38 na `/vendor/pdfjs/`, `public/paper-viewer.js`, razdelilnik `public/paper-tasks.js` (9/9 NPZ9 MAT 2026, 14/14 matura MAT OR 2026 P1), »Pomoč pri tej nalogi« pošlje izrez + besedilo, okvir kot rezerva. Lokalni preizkus: `EVKLID_PREVERI_POLA=<pdf> node scripts/preveri-aplikacijo.cjs`.

## Odločitve j
- Avtorske pravice RIC (»vse pravice pridržane«, RIC prodaja rešene pole; PDF kot priponka, brez CORS): nikoli kopirati, posredovati ali hraniti pol RIC. Lastne pole z enako zgradbo (30. 10. 11:23). Prošnja RIC pripravljena, ni poslana: `/mnt/project-files/evklid/npz-matura/prosnja-ric.md` (j sem rekel: polno dovoljenje malo verjetno, delno možno).
- 1. 11. 08:54 »Okej«: pola v Evklidu s samodejno razdelitvijo (kartica zaprta, možnost 0). Narejeno (#272).

## Odprto delo (po vrsti)
1. **Napaka, ki jo je j poslal 1. 11. 18:08** (posnetek `/root/.claude/uploads/5177fb5b-0ba6-5097-ac3a-e642bdb19abe/c31426c2-5062.png` v stari seji; koordinator ga ima): pri »Pomoč pri tej nalogi« / »Rešuj z inštruktorjem« (matura 2026 A1, telefon) se dolgo navodilo pokaže dvakrat (pasica + vnos) in zasede zaslon; v besedilu naloge številka strani »5« in opomba »formule so lahko pokvarjene«. Popravek: učenec vidi samo čisto nalogo (slika + čisto besedilo); navodilo za inštruktorja (pola, namigi namesto rešitve) gre kot skrit kontekst, ne kot vidno besedilo (glej `askTutorAbout` / `POST /api/students/:id/tasks/:id/help` v server/app.js); v `public/paper-tasks.js` odstrani številke strani, glave in noge; brez opombe o formulah. Splet in aplikacija enako. Majhen PR: en pregledovalec.
2. **Poskus lastnih pol**: 2 poli NPZ 9 MAT (zadnji dve leti v exam-papers-si.js), enaka zgradba, brez dobesednih nalog. Najprej določi obliko `structure`/`ours` in UI za `ours` (zdaj »Naša pola v tem slogu je v pripravi«). Opus pisec (≈1 pola), Opus pregledovalec (effort high, `node -e`), Opus bralec; nikoli Sonnet. Optimizer: končaj pred 12:00 UTC (učbeniški paket 14:20), poročaj agente po vlogah, čas, subagent_tokens, cost_usd prej/potem, rate_limit_info.
3. **Aplikacija za telefon (Expo, `mobile/`)**: razdelek NPZ in matura + pregledovalnik pol (aplikacija polo prenese z ric.si na napravi in jo odpre sama; ponovno uporabi `paper-tasks.js`). Vrstici v `docs/mobilna-aplikacija.md`. Pred začetkom vprašaj optimizatorja za mejo $.

## Manjše odprto
- Dvojni klik »Rešuj z inštruktorjem« ustvari dva pogovora.
- Raven OR/VR samo pri polah, ne pri treningu/poskusnem izpitu (ni VR vsebine).
- Starejše: povzetek izpita in imena tem ostanejo slovenska v drugih jezikih; »od tega 0 izbirnih« pri maturi MAT.

## Kartice, ki čakajo j
- Nobene.

## Veje in razporejena bujenja
- Veja `claude/project-thread-lo4isc` (vse združeno; za novo delo začni od origin/main).
- trig_018cTc5qUwJ1RKWFC62Vbygf (4. 11. 03:30, poskus lastnih pol) – sprožen, onemogočen ob predaji.
- trig_01Utd4EizmoypocAm39eAKiE (4. 11. 09:00, popravek sporočila + aplikacija) – onemogočen ob predaji; nova nit naj ga ustvari znova.

## Pasti
- `npm install` po vsakem `git fetch` (novi paketi na main, npr. pisave; brez tega `preveri-aplikacijo` javi 404 na /vendor).
- `preveri-aplikacijo.cjs` traja ~4–5 min; poganjaj cel skript.
- Nikoli ne commitaj pravih PDF-jev RIC (le v scratch za lokalni preizkus).
- »preneseno« (knjižno), ne »prenešeno«.
