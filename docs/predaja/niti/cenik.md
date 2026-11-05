# Predaja: cenik po stopnjah in delitev na OŠ, SŠ, faks

Iz niti »Predlagaj cenik po stopnjah« (cmsg_011HYzNBAS5HRU1H7PcSE7JtTr3mJ55Uszuud63V1gyLiu), 1. 11. 2026. Prevzame nit za šole.
Spomin projekta: `evklid-pricing-levels.md` (vse odločitve z uro).

## Dokumenta (Claude Docs, slovensko)
- Predlog cenika: https://claude.ai/artifact/XAy2JK2PikTyyxLsEWKnMc (cene, neto za j po poteh plačila, razdelek »Poraba AI v naročnini«, viri)
- Načrt delitve na stopnje: https://claude.ai/artifact/Nkb14LowXunGVjCkrvMAoA (kaj že obstaja, kaj se loči, prehodi, 3 koraki)
- Opomba: dokumenta še kažeta predlog; j je vse potrdil (spodaj), označiti »potrjeno« ni bilo narejeno, razen pri prikazu porabe.

## Odločitve j (vse potrjene 1. 11. 06:34–06:55, kartice ali »ok«)
1. Cene na profil: OŠ 9,99 €/mesec ali 89 €/leto (nespremenjeno), SŠ 12,99 / 119 €, faks 16,99 / 149 €.
2. Družina (2–4 profili OŠ/SŠ) 17,99 / 159 € (zamenja »2 otroka« 15,99 / 139); Družina s študentom 24,99 / 219 €.
3. Naročnina odpre svojo stopnjo in vse nižje; višja stopnja le z doplačilom razlike (proracija Stripe).
4. Vsaka stopnja svojo začetno stran (isti videz, drug vrstni red kartic) in dodatek k promptu za ton; faks študijsko leto od 1. 10. Posnetki in sprememba prompta gredo j-ju v pregled pred združitvijo.
5. Zajamčen AI na mesec: OŠ 2 $, SŠ 3 $, faks 5 $; potem Haiku odgovarja naprej do dnevne meje (60 / 60 / 100 vprašanj). Deleži naročnikov imajo prednost pred brezplačnimi v proračunu 200 $.
6. Prikaz porabe: kot število preostalih podrobnih razlag (nikoli € ali $); obvestilo pri 80 %, opomba pri 100 % (inštruktor nadaljuje v hitrem načinu); gumb za dokup le polnoletni in starši; pod 15 brez poziva k nakupu, starši dobijo e-pošto pri 80 % in 100 %; odstotek v tedenskem poročilu.
7. Ena ponudba naenkrat: brez naročnine + test v 30 dneh → paket pred testom; naročnik nad deležem → dokup. Nikoli oboje isti osebi.
8. Manjše (»Da, vse«): paketi pred testom za faks 6,99 / 9,99 / 14,99 € (meja AI ×1,5); darilna koda = letna cena stopnje (89 / 119 / 149 € namesto 49 €); v trgovinah z aplikacijami 2 € dražje kot na spletu, splet privzet; poročilo staršem pri SŠ le s privolitvijo najstnika, pri faksu ga ni.
- Nespremenjeno: paketi pred testom OŠ/SŠ, Osebno ob šolski licenci 5,99 / 49 €, šolska licenca, brezplačno 0,2 $, regijske cene.
- Prehod stopnje: nova cena ob naslednjem podaljšanju, e-pošta 30 dni prej; prehod navzdol ob podaljšanju; napredek ostane.

## Odprto delo: 3 PR-ji po vrsti (nič še ni začeto, ni veje s kodo)
1. **Ena stopnja v kodi** (brez vidne spremembe): `stopnja(profil)` → OS / SS / FAKS v eni datoteki; ~15 razpršenih preverjanj `educational_track` (UNIVERZA/UNI/SS/OS v server/leagues.js, games.js, competition.js, exams.js, prompt.js, public/app.js, textbook.js …) preide nanjo; test prepove nova preverjanja mimo nje.
2. **Cene, pravice, meje AI, ena ponudba** (polni trojni pregled, denar): `server/accounts/plans.js` (paketi po stopnjah, družinska paketa, faks paketi pred testom, darilna koda), `server/placila/pravice.js` (svoja + nižje stopnje, nadgradnja), `server/proracun.js`/`usage.js` (zajamčeni deleži 2/3/5 $, nato Haiku, prednost pred brezplačnimi), `server/placila/darila.js`, Račun (cena stopnje, družina pri ≥2 profilih), obvestila 80/100 %, e-pošta staršem, pravilo ene ponudbe (pass-offer.js / credit-card.js), `server/advice.js` po stopnjah. Besedila v sl + 32 jezikov (docs/besedila.md). Pravilo j: PR s cenami se ne združi brez j-jeve kartice. Stripe testni način (j nima s.p.).
3. **Začetna stran in inštruktor po stopnji**: vrstni red kartic, faks študijsko leto 1. 10. (server/level-up.js) in izpitni roki, dodatek k promptu (prompts/system_prompt.md, čaka j-jev pregled), meja AI faks 5 $.

## Za j (poslano na seznam odločitev)
- Samodejni dokup dobroimetja na Anthropic Console, preden deleži naročnikov presežejo 200 $ (≈70 naročnikov pri polni porabi, ≈200 pri povprečni). Ni nujno pred plačljivimi uporabniki.
- Ob odprtju s.p.: računovodja potrdi davek (normiranec ~4 %), prispevke in DDV za kupce iz drugih držav EU (OSS).

## »Podari Evklid«
V tej niti ni bilo predloga »Podari Evklid«; edino povezano je odločitev 8 (darilna koda po ceni letnega paketa stopnje). Če obstaja drugje, ga ta nit ni videla.

## Opomniki
- Opomnik za začetek PR 1 (4. 11. 03:30 UTC) je izklopljen ob predaji.
