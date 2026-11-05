# Predaja: klikljive formule (nit »Make formulas interactive with sketches«, 4. 11. 2026)

Prevzame jo nit »Explain formula letters by topic« (cmsg_011HYzNBAS5HRU1H7PcSE7JtF3c3ZUET66xkG8JwzAtoSy). Moji opomniki so izbrisani (02:30, 02:31, 06:00 UTC). Delovno drevo je čisto; vse je na main.

## Narejeno (na main)
- PR #232 (združen 30. 10.): vsaka lekcija ima na koncu skrit blok `:::simboli`, z vrsticami `oznaka | ime | zveza | enota | opomba`.
  - Oznake lekcije imajo prednost pred slovarjem.
  - Kartica pokaže ime, zvezo, »Kjer je« (sestavne dele z enotami), enoto in opombo.
  - Bloke ima 340 od 372 lekcij; preostalih 32 nima oznak.
  - Kodo vsebujejo: `public/formula-data.js` (annotateTex, withFormulaSubject, parseSymbolsBlock, symbolsIn), `public/formula-info.js` (kartica, fit()), `server/textbook.js` (parseLesson → `symbols`), `server/lesson-check.js` (checkSymbols) ter `scripts/simboli.js` (povzetek; `--brez` = lekcije brez bloka) in `lesson-brief.js` (pisec ali pregledovalec mora blok napisati).
  - Testi so v `test/simboli.test.js`. Navodila so v `content/lessons/README.md`, razdelek »Oznake«.
- Odločitve j (30. 10.):
  - Klikljivi znaki so samo modri (`--accent`), brez podčrte. Ob dotiku dobijo rahlo ozadje, centrirano na znak.
  - Vrstica z več oznakami (`t_1, t_2 | …`) pokaže na kartici celo skupino.
- Dotik v imenovalcu ulomka deluje: pointer-events v `ui.css`, ker sta ga KaTeX-ova `.vlist`/`.pstrut` prekrivala.
- Pokončna enota (`\text{m}`) in diferencial `\mathrm{d}` nista oznaki lekcije.

## Odprto (vse je od j, nič še ni začeto)
1. **Surov TeX v izbirnih možnostih** (1. 11., posnetek): Učna pot, »Osnove logike« 3/3, možnosti pokažejo `\Rightarrow`, `\wedge`, `\vee`, `\neg` namesto znakov. Prav tako obvestilo »V redu, to bova predelala skupaj.« prekrije možnosti. Popraviti je treba oboje in nato preveriti vse izbirne možnosti v nalogah in lekcijah (verjetno manjka `$…$` ali izris). j je bilo obljubljeno za sredo 4. 11.
2. **»Pokaži formulo« v rešenih primerih** (1. 11.): j: »ko bi bile formule razložene že z interaktivnimi črkami, ni potrebno še okno«. Moje branje, ki sem ga povedal j in ga ni ugovarjal (»Ok«): okno `:::formula` se ne pokaže, kadar so vse črke v njem klikljive z oznako iz `:::simboli`. Okno »Skrij rešitev« ostane. Predlog: skrij ga pri izrisu, vir obdrži, ker `check-lesson` `:::formula` zahteva. To je bilo j-jevo pravilo z 27. 10., novo ima prednost.
3. **Bistvo ni klikljiv** (posnetek 5230, KEM, lekcija o atomu): v razdelku »Bistvo« so Z, A, E_n, ψ, n, l, m_l navadne. Klikljiva je le enota J. Bistvo verjetno ne gre skozi `withFormulaSubject(…, L.lesson?.symbols)` v `public/textbook.js` (`R`) ali pa nima predmeta. Isto preveri v povzetku, miselnih vzorcih, kartah in PDF.
4. **Formule v odgovorih inštruktorja smiselno klikljive** (j 3. 11.) in **»Prijavi napako« v inštruktorju za admin profil** (j 3. 11.). Prvo verjetno pomeni uporabiti slovar predmeta pogovora ter morebitni slovar lekcije, iz katere je vprašanje.
5. **Interaktivne skice v karticah formul** (velika naloga, j 1. 11.). Celoten opis j: `/mnt/project-files/evklid/skice/naloga-skice-j-2026-11-01.md`.
   - Potek: najprej pregled, kako so formule urejene (verjetno Orodja → Formule), brez sprememb zgradbe, zavihkov ali sloga. Nato skupna komponenta na kartici »Kotne funkcije v pravokotnem trikotniku«. Potem po eno poglavje v vsakem PR, s preverjanji iz opisa kot testi.
   - Kartice, ki še ne obstajajo: j vprašati za vse naenkrat, preden jih dodaš.
   - Pred začetkom vprašaj optimizator za prosto mesto (največ 3 nit funkcij).
6. j 2. 11.: »Ali so v razlagah dodani interaktivni elementi … tisti ki jih klikneš za razlago«. Ali je bilo odgovorjeno, ne vem. Odgovor: da, od PR #232 v vseh lekcijah; Bistvo in drugo glej točko 3.

## Ostalo nizko
- `\frac \Delta H` brez oklepajev izgubi dotike. Pri `\vec{r}\,'` se pokaže pomen osnovne črke.
- V arabščini je ločilo v slovenskem besedilu lekcije na napačni strani (ni od formul).
- Okvir fokusa pri ulomkih se skoraj dotika »=«.

## Spomin
`/tmp/claude/memory/team/silo/evklid-formula-symbols.md` (vse zgoraj na kratko).
