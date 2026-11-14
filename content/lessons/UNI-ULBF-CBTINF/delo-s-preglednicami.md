---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Predstavljaj si dve sliki. Na prvi zapisnikar košarkarske tekme po vsaki četrtini sešteva točke igralcev, da bo na koncu vedel, kdo je bil najboljši strelec. Na drugi tvoj prijatelj vodi tabelo spletne lige v igri: za vsako zmago ekipa dobi $3$ točke, za neodločen izid $1$, in lestvico mora po vsakem krogu urediti na novo.

Na videz nimata nič skupnega. V resnici oba počneta isto: **eno pravilo uporabita na vsaki vrstici**, števila pa se ves čas spreminjajo. Ko se spremeni en rezultat, bi morali vse vsote in vse točke izračunati znova.

Preglednica (npr. Excel, LibreOffice Calc ali Google Preglednice) to naredi namesto tebe. Pravilo zapišeš enkrat, program ga uporabi povsod in ob vsaki spremembi sam preračuna. Enako boš delal z meritvami v laboratoriju ali na polju.

## Razlaga

**1. Mamljiva napačna zamisel.** Prva misel je pogosto: »Preglednica je le lepša tabela. Vsoto izračunam s kalkulatorjem in jo vpišem.« Nekoliko boljša različica je, da vpišeš `=18+22+15+25`. Program res pokaže $80$. Težava se pokaže pozneje: sodnik popravi zapisnik, igralec je na tretji tekmi dosegel $17$ točk, ne $15$. Celica z vsoto še vedno kaže $80$, ker v njej piše številka, ne pa povezava s podatki.

**2. Celica in sklic.** Preglednica je mreža **celic**. Stolpci so označeni s črkami ($A$, $B$, $C$ …), vrstice s števili. Naslov celice je črka stolpca in številka vrstice, na primer `B3`. Če v formuli zapišeš naslov druge celice, je to **sklic**: formula ne vsebuje števila, ampak »pojdi pogledat, kaj je v `B3`«.

**Formula** se vedno začne z enačajem. Brez njega program vsebino razume kot besedilo. Spodnja tabela kaže, kaj je v celicah zapisano in kaj vidiš na zaslonu:

| Celica | Zapisano | Na zaslonu |
|---|---|---|
| `B2` … `B5` | `18`, `22`, `15`, `25` | iste številke |
| `B6` | `=18+22+15+25` | $80$ |
| `B7` | `=B2+B3+B4+B5` | $80$ |
| `B8` | `B2+B3+B4+B5` | besedilo `B2+B3+B4+B5` |

:::premisli
V celici `B4` popraviš $15$ v $17$. Kaj bodo zdaj pokazale celice `B6`, `B7` in `B8`?
---
`B6` še vedno $80$, ker vsebuje samo številke. `B7` pokaže $82$, ker sklic znova prebere `B4`. `B8` ostane besedilo, saj brez enačaja ni formula.
:::

**3. Funkcije in obsegi.** Pri $30$ tekmah bi bila vsota sklicev predolga. Zato ima preglednica **funkcije**: vnaprej pripravljene izračune, ki jim podaš podatke v oklepaju. Zapis `B2:B5` je **obseg**: vse celice od `B2` do `B5`. Najpogostejše funkcije:

- `SUM(B2:B5)` sešteje vrednosti,
- `AVERAGE(B2:B5)` izračuna povprečje,
- `MIN(…)` in `MAX(…)` poiščeta najmanjšo in največjo vrednost,
- `COUNT(…)` prešteje celice s števili,
- `IF(pogoj; če_da; če_ne)` izbere med dvema izidoma, npr. `=IF(B2>=20;"dober";"slabši")`.

V slovenskih nastavitvah je decimalno ločilo vejica, zato so argumenti ločeni s podpičjem. Nekateri programi v slovenščini imena funkcij tudi prevedejo; pomen ostane enak.

Pozor pri praznih celicah. `AVERAGE` in `COUNT` prazne celice izpustita, ničlo pa upoštevata. Tekma, ki je igralec ni igral, naj ostane prazna. Če vpišeš $0$, mu znižaš povprečje, kot da bi igral in ne zadel ničesar.

**4. Kopiranje formul: relativni sklic.** Ligaška tabela ima v stolpcu $A$ ekipe, v $B$ zmage, v $C$ neodločene izide. V `D2` vpišeš `=3*B2+C2`. Ko formulo povlečeš navzdol, v `D3` dobiš `=3*B3+C3`, v `D4` pa `=3*B4+C4`. Sklic se je premaknil skupaj s celico. Takemu sklicu rečemo **relativni**: ne pomeni »celica `B2`«, ampak »celica v stolpcu $B$ v moji vrstici«.

Druga mamljiva zamisel: »Število točk za zmago dam v svojo celico `F1`, da ga lahko spremenim.« Pametno, le da `=F1*B2+C2`, kopiran navzdol, postane `=F2*B3+C3`. Celica `F2` je prazna in šteje kot $0$, zato vse ekipe razen prve izgubijo točke za zmage.

**5. Absolutni sklic.** Znak <code>&#36;</code> sklic zaklene. <code>&#36;F&#36;1</code> ostane <code>&#36;F&#36;1</code>, kamorkoli formulo kopiraš. <code>&#36;F1</code> zaklene le stolpec, <code>F&#36;1</code> le vrstico; takima rečemo **mešana sklica**. Pravilna formula v `D2` je torej <code>=&#36;F&#36;1&#42;B2+C2</code>.

:::premisli
Formulo <code>=&#36;F&#36;1&#42;B2+C2</code> iz `D2` skopiraš v `D5`. Kaj bo pisalo v `D5`? Zakaj se en del spremeni, drugi pa ne?
---
<code>=&#36;F&#36;1&#42;B5+C5</code>. Sklica `B2` in `C2` sta relativna, zato se premakneta za tri vrstice navzdol. <code>&#36;F&#36;1</code> je absolutni sklic in ostane, kakršen je.
:::

**6. Grafi.** Graf narišeš iz označenega obsega in je s podatki povezan: ko popraviš rezultat, se stolpec ali točka premakne sama. Vrsto grafa izbereš po vprašanju, ne po videzu:

| Vprašanje | Vrsta grafa | Primer iz športa |
|---|---|---|
| Kdo ima več? | stolpčni | točke ekip na lestvici |
| Kako se spreminja v času? | črtni | točke igralca po krogih |
| Kolikšen del celote? | tortni | deleži zmag, remijev in porazov |
| Ali sta dve količini povezani? | raztreseni (XY) | višina igralca in skoki |

Črta med dvema točkama nakazuje, da se je vmes nekaj spreminjalo. Zato sodi k času, ne med dve ekipi.

## Rešeni primeri

### Primer 1: vsota in povprečje strelca

Košarkar je na štirih tekmah dosegel $18$, $22$, $15$ in $25$ točk. Številke so v celicah `B2` do `B5`. Katero formulo vpišeš v `B6` za skupno število točk in katero v `B7` za povprečje? Kaj pokažeta?

**Podatki:** `B2` $= 18$, `B3` $= 22$, `B4` $= 15$, `B5` $= 25$ (točke na tekmo)
**Iščemo:** formuli v `B6` in `B7` ter njuni vrednosti

:::formula
`=SUM(B2:B5)` in `=AVERAGE(B2:B5)`; povprečje $= \dfrac{\text{vsota}}{\text{število podatkov}}$
:::

**Rešitev:**

1. Obseg so štiri celice od `B2` do `B5`, zato funkcijama podamo `B2:B5`; tako bo vsak popravek upoštevan.
2. Vsota: $18 + 22 + 15 + 25 = 80$.
3. Povprečje: vsota deljena s številom tekem, $80 / 4 = 20$.
4. Odgovor: v `B6` vpišemo `=SUM(B2:B5)`, pokaže $80$ točk; v `B7` vpišemo `=AVERAGE(B2:B5)`, pokaže $20$ točk na tekmo.

### Primer 2: ligaška lestvica s kopiranjem

V tabeli so tri ekipe. Olimpija ima v vrstici $2$ osem zmag in nič neodločenih, Maribor v vrstici $3$ šest zmag in pet neodločenih, Celje v vrstici $4$ pet zmag in šest neodločenih. V `F1` je število točk za zmago, $3$. V `D2` vpišemo formulo in jo skopiramo do `D4`. Kaj je zapisano v `D4` in koliko točk ima vsaka ekipa?

**Podatki:** `B2` $= 8$, `C2` $= 0$; `B3` $= 6$, `C3` $= 5$; `B4` $= 5$, `C4` $= 6$; `F1` $= 3$; neodločen izid prinese $1$ točko
**Iščemo:** formulo v `D4` in točke vseh treh ekip

:::formula
`D2`: <code>=&#36;F&#36;1&#42;B2+C2</code>, nato kopiranje navzdol (točke $= 3 \cdot$ zmage $+$ neodločeni)
:::

**Rešitev:**

1. `F1` mora ostati isti za vse ekipe, zato ga zaklenemo z <code>&#36;F&#36;1</code>; zmage in remiji pa so v vsaki vrstici drugje, zato sta `B2` in `C2` relativna.
2. Pri kopiranju v `D4` se relativna sklica premakneta za dve vrstici: <code>=&#36;F&#36;1&#42;B4+C4</code>.
3. Olimpija: $3 \cdot 8 + 0 = 24$.
4. Maribor: $3 \cdot 6 + 5 = 23$.
5. Celje: $3 \cdot 5 + 6 = 21$.
6. Odgovor: v `D4` piše <code>=&#36;F&#36;1&#42;B4+C4</code>; Olimpija ima $24$, Maribor $23$, Celje $21$ točk.

### Primer 3: liga spremeni pravila

Vodstvo lige iz primera 2 razmišlja, da bi zmaga prinesla le $2$ točki. Koliko celic moraš v tabeli spremeniti? Katera ekipa bi potem vodila?

**Podatki:** zmage in remiji kot v primeru 2 (Olimpija $8$ in $0$, Maribor $6$ in $5$, Celje $5$ in $6$); nova vrednost zmage $2$ točki; formule v `D2:D4` so <code>=&#36;F&#36;1&#42;B…+C…</code>
**Iščemo:** število celic, ki jih spremenimo, in novega vodilnega

:::formula
točke $=$ (vrednost zmage) $\cdot$ zmage $+$ neodločeni; vrednost zmage je v `F1`
:::

**Rešitev:**

1. Vse tri formule berejo vrednost zmage iz iste celice `F1`, zato spremenimo samo njo: vpišemo $2$.
2. Olimpija: $2 \cdot 8 + 0 = 16$.
3. Maribor: $2 \cdot 6 + 5 = 17$.
4. Celje: $2 \cdot 5 + 6 = 16$.
5. Primerjamo: $17$ je največ, Olimpija in Celje sta izenačena s $16$.
6. Odgovor: spremenimo eno samo celico (`F1`); po novih pravilih bi vodil Maribor s $17$ točkami. Ekipa z več remiji pridobi, ko je zmaga manj vredna.

Če bi bila vrednost zmage zapisana v vsaki formuli posebej (`=3*B2+C2`), bi moral popraviti vse tri, v pravi ligi pa dvajset ali več.

### Primer 4: zdaj ti

Igralec je pri prostih metih zadel $33$ od $40$ metov. Zadetki so v `B2`, vsi meti v `C2`. Kolikšen je njegov odstotek uspešnosti?

**Podatki:** `B2` $= 33$ (zadeti meti), `C2` $= 40$ (vsi meti)
**Iščemo:** formulo v `D2` in delež zadetkov v odstotkih

:::formula
`=B2/C2`, celico oblikujemo kot odstotek (delež $\cdot 100\,\%$)
:::

**Rešitev:**

1. Delež je del deljen s celoto: zadeti meti deljeno z vsemi meti, zato `=B2/C2`.
2. Sklica naj bosta relativna, da formulo lahko skopiraš za vse igralce v ekipi.
3. Izračunaj delež in ga zapiši v odstotkih, nato preveri:

:::premisli
Kaj pokaže `D2` in koliko je to v odstotkih?
---
$33 / 40 = 0{,}825$, oblikovano kot odstotek $82{,}5\,\%$.
:::

## Pogoste napake

- **Številke namesto sklicev.** `=18+22+15+25` da pravi rezultat le, dokler se podatki ne spremenijo. Napačna misel je »rezultat je isti, torej je vseeno«. Formula naj vedno bere celice (`=SUM(B2:B5)`), da se ob popravku preračuna.
- **Kopiranje brez <code>&#36;</code>.** Kdor vrednost zmage da v `F1` in piše `=F1*B2+C2`, pričakuje, da se `F1` ne bo premikal. Pri kopiranju se premakne v `F2`, `F3` …, ki so prazni, zato ekipe ostanejo le pri remijih. Celico, ki je skupna vsem vrsticam, zakleni: <code>&#36;F&#36;1</code>.
- **Ničla namesto prazne celice.** Videti je, da sta »nič« in »prazno« isto. Za `AVERAGE` nista: ničla se šteje kot podatek in zniža povprečje, prazna celica se izpusti. Tekme, ki je ni bilo, ne vpiši kot $0$.
- **Pozabljen enačaj.** Brez `=` na začetku program vsebino shrani kot besedilo in nič ne izračuna. Formula se vedno začne z `=`.
- **Graf po videzu.** Črtni graf za točke ekip na lestvici je napačen, ker črta med ekipama nakazuje razvoj, ki ga ni. Za primerjavo kategorij izberi stolpčni graf, za spremembo v času črtnega.

## Povzetek

- Celica ima naslov iz črke stolpca in številke vrstice (`B3`); formula se začne z `=`.
- Sklic v formuli bere vsebino celice, zato se rezultat ob spremembi podatkov sam preračuna.
- Funkcije delujejo na obsegih (`B2:B5`): `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`, `IF`; argumente v slovenskih nastavitvah ločimo s `;`.
- `AVERAGE` in `COUNT` prazne celice izpustita, ničlo pa štejeta.
- Relativni sklic (`B2`) se pri kopiranju premakne, absolutni (<code>&#36;F&#36;1</code>) ostane; mešana sta <code>&#36;F1</code> in <code>F&#36;1</code>.
- Konstanto, skupno vsem vrsticam, zapiši v svojo celico in nanjo pokaži z absolutnim sklicem.
- Vrsta grafa sledi vprašanju: stolpčni za primerjavo, črtni za čas, tortni za dele celote, raztreseni za povezavo dveh količin.

## Drugače: Kot zgodba

Tjaša je trenerka mladinske odbojkarske ekipe. Prvo sezono je statistiko vodila v zvezku: po vsaki tekmi je s kalkulatorjem seštela točke in vpisala vsoto. Ko je sodnik po treh tednih popravil zapisnik ene tekme, je morala znova preračunati pol zvezka.

Naslednjo sezono je odprla preglednico. Točke je vpisala v stolpec $B$, v spodnjo celico pa `=SUM(B2:B21)`. Ko je prišel popravek, je spremenila eno številko in vsota se je popravila sama.

Nato je želela povprečje vsake igralke. Formulo je napisala za prvo vrstico in jo povlekla navzdol; vsaka vrstica je dobila svojo formulo, ker so se sklici premaknili. Ko je hotela dodati bonus za igralko tekme, ga je zapisala v `H1`. Prva igralka je bonus dobila, vse druge pa ne. Hitro je ugotovila, da se je `H1` pri kopiranju spremenil v `H2`, `H3` … Dodala je dolarja, <code>&#36;H&#36;1</code>, in vse je delovalo.

Za sestanek s starši je narisala črtni graf točk po tekmah, ki se ob vsakem popravku posodobi sam.

## Drugače: Korak za korakom s številkami

Postopek za ligaško lestvico, ki jo boš lahko spreminjal:

1. Vpiši podatke: ekipe v $A$, zmage v $B$, neodločene v $C$, od vrstice $2$ naprej.
2. Konstanto zapiši posebej: `F1` $= 3$ (točke za zmago).
3. V `D2` vpiši <code>=&#36;F&#36;1&#42;B2+C2</code>. Za Olimpijo: $3 \cdot 8 + 0 = 24$.
4. Formulo povleci do zadnje ekipe. Preveri eno kopijo: v `D3` mora pisati <code>=&#36;F&#36;1&#42;B3+C3</code>, rezultat $3 \cdot 6 + 5 = 23$.
5. Dodaj povzetek: `=MAX(D2:D4)` pokaže $24$, `=AVERAGE(D2:D4)` pa $(24 + 23 + 21) / 3 = 68 / 3 \approx 22{,}7$.
6. Označi `A1:A4`, nato s pritisnjeno tipko Ctrl še `D1:D4`, in vstavi stolpčni graf.
7. Preizkus: v `F1` vpiši $2$. Točke se spremenijo v $16$, $17$ in $16$, stolpci na grafu se prilagodijo, `MAX` pokaže $17$.

## Preveri se

? V celici `D2` je formula `=3*B2+C2`. Kaj v tej formuli pomeni `B2`?
- Število $2$ iz stolpca $B$.
~ `B2` ni število, ampak naslov. Formula vzame tisto, kar je v celici `B2` (npr. $8$ zmag).
+ Relativni sklic: formula prebere vrednost iz stolpca $B$ v isti vrstici, pri kopiranju se premakne.
- Absolutni sklic, ki ostane enak, kamorkoli formulo kopiraš.
~ Absolutni sklic ima dolarja, <code>&#36;B&#36;2</code>. Brez njiju se sklic pri kopiranju premakne.
> `B2` je relativni sklic. V `D3` se spremeni v `B3`, zato vsaka ekipa dobi točke iz svoje vrstice.

? V `B2:B5` so vrednosti $4$, $0$, prazna celica in $8$. Kako si od najmanjšega do največjega sledijo rezultati `MIN`, `COUNT`, `AVERAGE` in `MAX` na tem obsegu?
- `MIN` < `AVERAGE` < `COUNT` < `MAX`
~ Tako bi bilo, če bi prazna celica štela kot ničla (povprečje $3$, štetje $4$). Prazne celice obe funkciji izpustita.
+ `MIN` < `COUNT` < `AVERAGE` < `MAX`
- `COUNT` < `MIN` < `AVERAGE` < `MAX`
~ Tako bi bilo, če bi ničlo izpustili kot prazno celico (`COUNT` $2$, `MIN` $4$, `AVERAGE` $6$). Ničla je podatek, zato je `MIN` enak $0$ in `COUNT` jo prešteje.
> `MIN` $= 0$, `COUNT` $= 3$ (ničla šteje, prazna celica ne), `AVERAGE` $= 12 / 3 = 4$, `MAX` $= 8$.

? V `D2` je `=F1*B2+C2`, kjer je v `F1` število točk za zmago. Kaj se zgodi, ko formulo skopiraš v `D3`?
- Vse deluje, ker je `F1` le ena celica in je program ne premika.
~ Program ne ve, da je `F1` posebna. Brez <code>&#36;</code> se premakne kot vsak relativni sklic.
+ V `D3` nastane `=F2*B3+C3`; `F2` je prazen, zato ekipa dobi le točke za neodločene.
- Program javi napako, ker je `F2` prazen.
~ Prazna celica v računu šteje kot $0$, napake ni. Prav zato je ta napaka zahrbtna: rezultat je videti kot pravo število.
> Relativni sklic `F1` se premakne v `F2`. Popravek: <code>=&#36;F&#36;1&#42;B2+C2</code>.

? Igralka je zadela $27$ od $36$ metov. V `B2` je $27$, v `C2` $36$, v `D2` `=B2/C2`, oblikovano kot odstotek. Kaj pokaže `D2`?
- $133\,\%$
~ To je $36 / 27$: deljenje v obratni smeri. Delež je del deljen s celoto.
- $9\,\%$
~ To je razlika $36 - 27$, zapisana kot odstotek. Delež dobiš z deljenjem.
+ $75\,\%$
> $27 / 36 = 0{,}75$, kar je $75\,\%$.

? V `F1` je $3$, v `D2` je <code>=&#36;F&#36;1&#42;B2+C2</code>. Ekipa ima v `B2` $9$ zmag in v `C2` $4$ neodločene izide. Koliko točk pokaže `D2`?
- $16$
~ To je $3 + 9 + 4$: točke za zmago so prištete, ne pomnožene z zmagami.
- $39$
~ To je $3 \cdot (9 + 4)$: tudi neodločeni so pomnoženi s $3$. Remi prinese le $1$ točko.
+ $31$
> $3 \cdot 9 + 4 = 31$.

:::simboli
A, B, C | stolpci preglednice | | | naslov celice je črka stolpca in številka vrstice, npr. B3
\text{vsota} | vsota vseh podatkov | | | v preglednici =SUM(B2:B5)
\text{število podatkov} | koliko podatkov povprečimo | | | povprečje je vsota : število podatkov
:::
