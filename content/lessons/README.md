# Lekcije učbenika

Vsaka tema učne poti ima lahko lekcijo v `content/lessons/<pot>/<slug-teme>.md`,
npr. `MAT-OS-8/pitagorov-izrek.md`. Id teme (pot + slug) je v `server/curriculum-data.js`
oz. se izpiše z `node scripts/generate-lessons.js --list`.

Lekcije se berejo brez stroškov AI. Datoteko lahko učitelj popravi kar tukaj;
aplikacija spremembo pobere ob naslednjem odprtju lekcije.

## Oblika

```markdown
---
stanje: osnutek        # osnutek | pregledano (osnutek pokaže opozorilo učencu)
demo: pitagora         # neobvezno: dodatna simulacija (simulacije za vsako temo so v public/sim/katalog.js)
avtor: učitelj / AI    # neobvezno, za evidenco
---

## Zakaj se tega učimo
Navezava na znano in zakaj je tema uporabna.

## Razlaga
Definicije in razlaga po korakih. Vmes 2 vprašanji »Premisli« (napoved ali
»zakaj«), odgovor je v aplikaciji skrit za gumbom:

:::premisli
Kaj se zgodi z gostoto, če kocko prerežemo na pol?
---
Ostane enaka: masa in prostornina se razpolovita, razmerje ostane.
:::

## Rešeni primeri
### Primer 1 (lažji)
Besedilo naloge (vsi podatki so v besedilu).

**Podatki:** $v = 9\,\mathrm{m/s}$, $t = 45\,\mathrm{s}$
**Iščemo:** pot $s$

:::formula
$s = v \cdot t$
:::

**Rešitev:**

1. $s = 9\,\mathrm{m/s} \cdot 45\,\mathrm{s} = 405\,\mathrm{m}$
2. Odgovor: kolesar prevozi $405\,\mathrm{m}$.

### Primer 2
### Primer 3 (težji)

## Pogoste napake

## Povzetek
Nekaj vrstic. Tutor ga dobi v kontekst, da razlaga skladno z učbenikom.

## Drugače: Na sliki
## Drugače: Iz vsakdanjega življenja
## Drugače: Korak za korakom s številkami
## Drugače: Bolj natančno
Razdelki, ki se začnejo z »Drugače:«, se pokažejo pod gumbom »Razloži drugače«.

**Telefon (360 px).** Formula, ki na telefonu ne gre v vrstico, se sama zloži pri enačajih (leva stran zgoraj, spodaj vsak »= …«); tabela ali formula brez enačaja se pomanjša do 80 %, ostalo se pomika vstran (`public/sirina.js`). Zato dolgo verigo enačb razdeli v več `$$…$$`, vsak naj bo cela enačba z levo stranjo (`$$s = v \cdot t$$`, nato `$$s = 9 \cdot 45 = 405\,\mathrm{m}$$`), sicer `check-lesson.js` korakov ne preračuna; `aligned` in `$$= …$$` brez leve strani ne preverita ničesar. Tabela naj ima največ 3–4 kratke stolpce. Videz preveri `node scripts/preveri-videz-lekcij.cjs --samo POT/tema --vse` (napake: koreni brez črte, neporavnane tabele, formule čez rob ali ne na sredini; »drsnik« je opozorilo, kje bi krajši zapis pomagal).

## Preveri se
? Vprašanje (Markdown in $LaTeX$ sta dovoljena)
- napačen odgovor
~ Zakaj je ta odgovor napačen (tipična napačna predstava); pokaže se ob tej izbiri.
+ pravilen odgovor
- napačen odgovor
~ Razlaga za to napačno možnost.
> Pojasnilo, ki se pokaže po pravilnem odgovoru.

:::simboli
s | pot | s = v \cdot t | m
v | hitrost | v = \frac{s}{t} | m/s
t | čas | | s
:::
```

## Oznake (`:::simboli`) – klikljive formule

V aplikaciji je vsaka oznaka v formuli klikljiva: kartica pokaže ime, zvezo,
iz česa je sestavljena (pri $\rho = \frac{m}{V}$: $m$ masa, $V$ prostornina) in enoto.
Pomen oznake je odvisen od lekcije ($T$ je lahko temperatura, nihajni čas ali
prepustnost), zato ga lekcija zapiše sama v bloku `:::simboli` na koncu datoteke.
Blok se ne izpiše; brez njega aplikacija ugiba iz splošnega slovarja
(`public/formula-data.js`).

Ena vrstica na oznako, polja ločena z `|`:

1. oznaka v TeX (`I_0`, `\varepsilon`, `\Delta H`, `\mathrm{pH}`); več oznak z istim pomenom loči z vejico (`x_1, x_2`);
2. ime, kot ga uporablja lekcija (`prepustnost (transmitanca)`);
3. zveza v TeX, s katero jo izračunamo (`T = \frac{I}{I_0}`), ali prazno;
4. enota v TeX (`kg/m^3`, `mol/L`, `L\,mol^{-1}\,cm^{-1}`); `–`, če nima enote; prazno pri čisti matematiki;
5. neobvezna kratka opomba (`število med 0 in 1`).

Formula v imenu ali opombi je med `$…$` (`največje odstopanje od $\bar{h}$`), sicer se izpiše surov TeX.

Preverjevalnik opozori na oznake iz izpostavljenih formul (`$$…$$` in `:::formula`),
ki v bloku manjkajo. Pomoč za obstoječe lekcije: `node scripts/simboli.js <lekcija>`
izpiše formule, manjkajoče oznake, slovarski pomen in stavke, kjer se pojavijo.

Merila kakovosti (vrhunska raven) za lekcije, naloge in simulacije so v
`docs/kakovost.md`; pisec in pregledovalec jih preverita pri vsaki lekciji.
Preverjevalnik opozori, če razlaga nima 2 blokov `:::premisli` ali če kateri
napačni odgovor nima vrstice `~`.

Pravila za rešene primere (vsak `### Primer`):

- **Podatki:** vedno izpiši *vse* podatke iz besedila naloge (z oznakami in
  enotami), tudi če je naloga brez računanja (napiši, kaj je dano).
- **Iščemo:** kaj naloga sprašuje.
- Blok `:::formula … :::` z formulo oziroma pravilom, ki ga potrebujemo. V
  aplikaciji je skrit za gumbom »Pokaži formulo«, da učenec najprej poskusi
  sam; v PDF-ju je izpisan. Vsebina bloka je navaden Markdown z LaTeX.
- **Rešitev:** koraki z vmesnimi rezultati in odgovor v stavku.

Obliko preveriš z `node scripts/check-lesson.js -q content/lessons/<pot>/<slug>.md` (`-q` izpiše samo težave). Preverjevalnik tudi sam preračuna čisto številske korake v formulah (`$37 \cdot 7 = 259$`) in javi napako, če se ne ujemajo; pretvorb enot in razdelkov »Pogoste napake« / »Preveri se« ne preverja. Enakosti z neznankami (pravila, identitete, `:::simboli`, pravilni odgovor `+` v kvizu, miselni vzorci) preveri z naključnimi števili (`server/lesson-identity.js`): $(a+b)^2 = a^2 + b^2$ ali $z \cdot \bar z = a^2 - b^2$ je napaka. Enačbo ali pogoj označi v isti vrstici (»enačba«, »če je …«, »za $x < 0$«), namerno napačen zapis z »napačno« ali »napaka«. Navodila za pisca ali pregledovalca izpiše `node scripts/lesson-brief.js [--review] <id-teme> [...]`. Za varčno pisanje glej `docs/token-rules.md`.
(brez argumentov preveri vse lekcije). Simulacijo v besedilu omeni kot
»simulacija spodaj« z njenim naslovom iz public/sim/katalog.js.

Demonstracija se pokaže za razdelkom »Rešeni primeri«. Formule piši v LaTeX z
decimalno vejico (`$3{,}5$`).

## Fakultetne lekcije

Fakultetna tema z enakim naslovom in predmetom se pojavi v več predmetih (npr.
»Odvod funkcije« v 42 programih). Lekcijo napišeš enkrat, v mapo prvega
predmeta (`sameTopics(id)[0]` v `server/curriculum.js`), in velja za vse
predmete s to temo. Lastna datoteka v mapi drugega predmeta ima prednost.
Zato naj bo fakultetna lekcija splošna (brez imena enega predmeta ali
fakultete), strožje dokaze pa daj v »Drugače: Bolj natančno«.

Katere teme še nimajo lekcije, urejeno po številu programov:
`node scripts/fakultetne-lekcije.js --letnik 1 --n 40`.
