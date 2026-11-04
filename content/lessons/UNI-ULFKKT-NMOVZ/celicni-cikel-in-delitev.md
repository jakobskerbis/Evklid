---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na kolokvijih se vsako leto znajde ista trditev: »Mejoza je samo mitoza, ki se zgodi dvakrat zapored.« Zveni prepričljivo, saj imata obe delitvi profazo, metafazo, anafazo in telofazo.

Preizkusimo trditev s številom. Človeška celica ima $46$ kromosomov. Mitoza da dve celici s po $46$ kromosomi. Še ena mitoza vsake hčerinske celice bi dala štiri celice, spet s po $46$ kromosomi. Jajčna celica in semenčica pa imata po $23$. Nekaj torej ne gre skupaj.

Celica pred delitvijo podvoji DNA, preveri kopije in jih razdeli. Ko nadzor odpove, nastanejo celice z napačnim številom kromosomov ali z napakami v DNA: začetek mnogih tumorjev in vzrok trisomij, kot je Downov sindrom.

## Razlaga

**Izhodišče: kaj se razdeli.** Kromosom je ena dolga dvojna vijačnica DNA s proteini. V telesni (somatski) celici človeka so kromosomi v parih: en kromosom od matere, enega od očeta. Taka dva kromosoma imenujemo **homologna kromosoma**. Nosita iste gene, a lahko različne alele. Celica z dvema kompletoma je **diploidna** ($2n = 46$), celica z enim kompletom pa **haploidna** ($n = 23$).

**Celični cikel.** Večino časa celica preživi v **interfazi**. Ta ima tri dele:

- **G1**: celica raste, izraža gene in se »odloči«, ali se bo delila;
- **S**: podvojevanje DNA; vsak kromosom dobi kopijo;
- **G2**: celica preveri podvojeno DNA in se pripravi na delitev.

Po S fazi je vsak kromosom iz dveh enakih molekul DNA, **sestrskih kromatid**. Skupaj ju drži proteinski obroč **kohezin**, najtesneje ob **centromeri**. Število kromosomov se v S fazi ne spremeni, podvoji se le količina DNA. Količino DNA haploidnega kompleta označimo s $c$, zato ima celica v G1 $2c$, v G2 pa $4c$.

**Pravilo štetja.** Kromosom je ena molekula DNA s proteini ali, po S fazi, dve sestrski kromatidi, povezani v centromeri. Kromosome zato štejemo po centromerah: število kromosomov se poveča šele, ko se sestrski kromatidi ločita. Tabela za človeka ($2n = 46$) že omenja faze mitoze in mejoze, ki jih razložimo spodaj; vrni se k njej, ko jih spoznaš.

| Stopnja | Kromosomi | Kromatide | DNA |
|---|---|---|---|
| G1 | $2n = 46$ | $46$ | $2c$ |
| G2, metafaza mitoze ali metafaza I | $46$ | $92$ | $4c$ |
| anafaza mitoze (cela celica) | $92$ | $92$ | $4c$ |
| po mejozi I (npr. metafaza II) | $n = 23$ | $46$ | $2c$ |
| po mejozi II | $23$ | $23$ | $c$ |

Za interfazo sledi **faza M**: jedrska delitev (mitoza ali mejoza) in delitev citoplazme (**citokineza**).

**Mitoza: kopija enaka izvirniku.** Mitoza iz ene diploidne celice naredi dve enaki diploidni celici.

1. *Profaza*: kromosomi se zgostijo, iz centrosomov začne rasti **delitveno vreteno** iz mikrotubulov.
2. *Prometafaza*: jedrna ovojnica razpade, mikrotubuli se pripnejo na **kinetohore**, proteinske ploščice na centromeri. Vsaka sestrska kromatida ima svoj kinetohor.
3. *Metafaza*: vsi kromosomi se uredijo v ekvatorialni ravnini. Sestrski kromatidi sta pripeti na nasprotna pola.
4. *Anafaza*: encim separaza razreže kohezin. Sestrski kromatidi se ločita in postaneta samostojna kromosoma.
5. *Telofaza in citokineza*: okoli vsake skupine kromosomov nastane jedro, celica se razdeli.

:::premisli
Celica bi preskočila S fazo in vstopila v mitozo. Kaj bi dobili hčerinski celici?
---
Kromosomi ne bi imeli sestrskih kromatid, zato vreteno ne bi imelo česa enakomerno ločiti. Celici bi dobili naključno, nepopolno DNA. Zato kontrolna točka G2/M zahteva dokončano podvojevanje.
:::

**Mejoza: zgrajena iz razlik do mitoze.** Mejoza poteka v zarodnih celicah in iz ene diploidne celice da štiri haploidne. Pred njo je ena S faza, sledita pa ji dve delitvi brez vmesnega podvojevanja. Od mitoze se loči na štirih mestih:

1. **Parjenje homolognih kromosomov.** V profazi I se homologna kromosoma natančno poravnata vzdolž cele dolžine (sinapsa). Nastane **bivalent**: dva kromosoma, štiri kromatide. V mitozi se homologi ne parijo.
2. **Prekrižanje (crossing-over).** Med nesestrskima kromatidama homologov si celica izmenja koščke DNA. Mesto izmenjave vidimo kot **hiazmo**. Kromatide so po tem mešanica materinih in očetovih alelov.
3. **Mejoza I loči homologe, ne sestrskih kromatid.** V metafazi I so na ekvatorju bivalenti. Kinetohora obeh sestrskih kromatid enega kromosoma gledata proti istemu polu. V anafazi I gre en homolog na en pol, drugi na drugega. Separaza razreže le kohezin na krakih (to sprosti hiazme), kohezin ob centromeri pa ostane, ker ga varuje protein šugošin. Zato kromosomi še vedno imajo po dve kromatidi. Po mejozi I je celica že haploidna: $23$ kromosomov, a $46$ kromatid.
4. **Mejoza II je podobna mitozi, a brez S faze.** Sestrske kromatide se ločijo šele zdaj. Nastanejo štiri celice z $n$ kromosomi in s $c$ DNA.

Usmeritev vsakega bivalenta v metafazi I je naključna. Zato vsaka gameta dobi svojo kombinacijo materinih in očetovih kromosomov (neodvisno razporejanje).

**Trditev.** Naj ima celica $n$ parov homolognih kromosomov in naj se vsak bivalent v metafazi I usmeri neodvisno od drugih, z enako verjetnostjo na eno ali drugo stran. Potem lahko brez prekrižanja nastane $2^n$ različnih gamet, vsaka z verjetnostjo $(1/2)^n$.

*Dokaz.* Iz vsakega para gre v gameto materin ali očetov homolog: $2$ možnosti. Izbire so neodvisne, zato se po pravilu produkta število možnosti in verjetnosti množijo: $2 \cdot 2 \cdots 2 = 2^n$ in $(1/2)^n$. Ker zigota nastane iz dveh neodvisnih gamet, je različnih zigot pri dveh starših $2^n \cdot 2^n = 4^n$.

Primerjava na enem mestu:

| Lastnost | Mitoza | Mejoza |
|---|---|---|
| Kje | telesne celice | zarodne celice |
| Delitev po S fazi | ena | dve |
| Kaj se loči v anafazi | sestrski kromatidi | I: homologa, II: kromatidi |
| Rezultat | 2 enaki celici, $2n$ | 4 različne celice, $n$ |

Trditev iz uvoda torej ne drži: dve mitozi bi zahtevali dve S fazi in dali štiri diploidne kopije.

:::premisli
Sošolec trdi: »Vsaka delitev razpolovi število kromosomov, saj iz ene celice nastaneta dve.« Za DNA to drži ($4c \to 2c \to c$). Zakaj pa število kromosomov razpolovi le mejoza I, mejoza II pa ne?
---
Ker v anafazi I gresta homologna kromosoma vsak na svoj pol: vsaka celica dobi le enega iz para. V mejozi II se ločita sestrski kromatidi, kar število kromosomov ohrani (kot v mitozi), razpolovi pa količino DNA s $2c$ na $c$.
:::

**Kontrolne točke: gradbeni nadzor celice.** Prehode med fazami poganjajo **od ciklinov odvisne kinaze** (CDK). To so encimi, ki fosforilirajo tarčne proteine, aktivni pa so le, kadar je nanje vezan ustrezen ciklin. Koncentracija ciklinov v ciklu narašča in pada, ker jih celica sintetizira in nato razgradi. Kontrolna točka je mehanizem, ki zadrži aktivacijo naslednjega koraka, dokler pogoj ni izpolnjen.

- **G1/S (restrikcijska točka)**: je celica dovolj velika, ima rastne dejavnike, je DNA nepoškodovana? Ob poškodbi se stabilizira protein **p53**, ki sproži prepisovanje gena za zaviralec CDK p21. Cikel se ustavi, da se DNA popravi; če popravilo ne uspe, p53 sproži apoptozo.
- **G2/M**: je vsa DNA podvojena in brez prelomov? Šele nato se aktivira kompleks CDK1 s ciklinom B, ki začne mitozo.
- **Kontrolna točka delitvenega vretena (metafaza → anafaza)**: je vsak kinetohor pripet in pod napetostjo? En sam nepripet kinetohor oddaja signal, ki zavira kompleks APC/C (ta označi proteine za razgradnjo). Dokler je APC/C zavrt, se sekurin, zaviralec separaze, ne razgradi in separaza ne more razrezati kohezina.

Mutacije gena za p53 so pogoste v tumorjih. Napaka v ločevanju kromosomov v mejozi (**nerazdružitev**) da gameto z $n + 1$ ali $n - 1$ kromosomi (**aneuploidija**); po oploditvi tako nastane npr. trisomija 21. Če se homologa ne ločita v mejozi I, so aneuploidne vse štiri gamete; če se sestrski kromatidi ne ločita v mejozi II v eni od celic, sta aneuploidni le dve.

**Trajanje faz.** Delež celic v mitozi je **mitotski indeks** $N_{\mathrm{M}}/N$. Če je kultura nesinhronizirana in so celice enakomerno porazdeljene po ciklu, je delež celic v fazi enak deležu časa, ki ga faza zavzame v ciklu dolžine $T$: $t_{\mathrm{faza}} \approx \dfrac{N_{\mathrm{faza}}}{N} \cdot T$. Vsaka celica namreč v času $T$ preide vse faze.

## Rešeni primeri

### Primer 1 (lažji): štetje skozi cikel

Človeška celica ima v G1 $46$ kromosomov in $6{,}4\,\mathrm{pg}$ DNA. Koliko kromosomov, kromatid in DNA ima v G2 in koliko vsaka hčerinska celica po mitozi?

**Podatki:** $2n = 46$, masa DNA v G1 $m_{\mathrm{G1}} = 6{,}4\,\mathrm{pg}$
**Iščemo:** število kromosomov, kromatid in maso DNA v G2 ter po mitozi

:::formula
S faza: kromosomi ostanejo, kromatide in DNA $\times 2$. Mitoza: vsaka hčerinska celica dobi eno kromatido iz vsakega para sestrskih kromatid.
:::

**Rešitev:**

1. V G1 ima vsak kromosom eno kromatido: $46$ kromosomov, $46$ kromatid.
2. V S fazi se podvoji DNA, ne število kromosomov, zato v G2: $46$ kromosomov, $46 \cdot 2 = 92$ kromatid.
3. Masa DNA v G2: $6{,}4 \cdot 2 = 12{,}8$, torej $12{,}8\,\mathrm{pg}$.
4. V anafazi se kromatide ločijo, vsak pol dobi $92 / 2 = 46$ kromosomov z eno kromatido.
5. Odgovor: v G2 ima celica $46$ kromosomov, $92$ kromatid in $12{,}8\,\mathrm{pg}$ DNA; vsaka hčerinska celica ima spet $46$ kromosomov, $46$ kromatid in $6{,}4\,\mathrm{pg}$ DNA.

### Primer 2: koliko različnih kompletov načrtov

Vsak bivalent v metafazi I naključno »izbere«, kateri homolog gre v katero celico, kot bi za vsako od $23$ nadstropij stavbe izbirali med načrtoma dveh arhitektov. Koliko različnih gamet lahko nastane pri človeku samo zaradi neodvisnega razporejanja? In koliko pri vinski mušici z $2n = 8$?

**Podatki:** človek $n = 23$ parov, vinska mušica $2n = 8$, vsak par ima $2$ možnosti
**Iščemo:** število različnih kombinacij kromosomov v gameti

:::formula
Število kombinacij $= 2^n$
:::

**Rešitev:**

1. Vsak par se usmeri neodvisno od drugih, zato možnosti množimo: $2 \cdot 2 \cdot \ldots \cdot 2 = 2^n$.
2. Človek: $2^{23} = 8\,388\,608$.
3. Vinska mušica: $n = 8 / 2 = 4$, torej $2^4 = 16$.
4. Odgovor: človek lahko naredi $8\,388\,608$ različnih gamet, vinska mušica $16$. Prekrižanje k temu doda še veliko novih kombinacij.

### Primer 3 (težji): koliko trajajo faze cikla

V nesinhronizirani kulturi človeških celic se število celic v $66\,\mathrm{h}$ poveča z $1{,}0 \cdot 10^{5}$ na $8{,}0 \cdot 10^{5}$; vse celice se delijo. Na preparatu prešteješ $400$ celic: $20$ jih je v mitozi, od preostalih jih ima $180$ vsebnost DNA $2c$ (G1), $120$ jih je po kratkem pulzu z EdU (analogom timidina) označenih (S), ostale imajo $4c$ (G2). Oceni dolžino cikla in trajanje vseh štirih faz.

**Podatki:** $t = 66\,\mathrm{h}$, razmerje števila celic $8{,}0 \cdot 10^{5} / 1{,}0 \cdot 10^{5}$, $N = 400$, $N_{\mathrm{M}} = 20$, $N_{\mathrm{G1}} = 180$, $N_{\mathrm{S}} = 120$
**Iščemo:** dolžino cikla $T$ ter $t_{\mathrm{G1}}$, $t_{\mathrm{S}}$, $t_{\mathrm{G2}}$ in $t_{\mathrm{M}}$

:::formula
$\dfrac{N_t}{N_0} = 2^{t/T}$, $\quad t_{\mathrm{faza}} \approx \dfrac{N_{\mathrm{faza}}}{N} \cdot T$
:::

**Rešitev:**

1. Vsaka celica se v enem ciklu razdeli na dve, zato je dolžina cikla enaka času podvojitve populacije. Razmerje $8{,}0 \cdot 10^{5} / 1{,}0 \cdot 10^{5} = 8 = 2^3$ pomeni $3$ cikle, torej $T = 66 / 3 = 22\,\mathrm{h}$.
2. Celice so nesinhronizirane, zato je delež celic v fazi približno enak deležu časa faze. Mitoza: $20 / 400 = 0{,}05$, zato $t_{\mathrm{M}} \approx 0{,}05 \cdot 22 = 1{,}1$, torej $1{,}1\,\mathrm{h}$.
3. G1: $180 / 400 \cdot 22 = 9{,}9$, torej $9{,}9\,\mathrm{h}$.
4. S: EdU se vgradi le v DNA, ki se podvaja: $120 / 400 \cdot 22 = 6{,}6$, torej $6{,}6\,\mathrm{h}$.
5. G2: $400 - 20 - 180 - 120 = 80$ celic, $80 / 400 \cdot 22 = 4{,}4$, torej $4{,}4\,\mathrm{h}$.
6. Preverba: $1{,}1 + 9{,}9 + 6{,}6 + 4{,}4 = 22$, kar je ravno $T$.
7. Odgovor: cikel traja $22\,\mathrm{h}$; G1 okoli $9{,}9\,\mathrm{h}$, S okoli $6{,}6\,\mathrm{h}$, G2 okoli $4{,}4\,\mathrm{h}$ in mitoza okoli $1{,}1\,\mathrm{h}$.

V rastoči kulturi je mladih celic več (vsaka delitev da dve), zato je ocena za pozne faze prekratka; natančneje je $t_{\mathrm{M}} = T \log_2 (1 + N_{\mathrm{M}}/N)$, okoli $1{,}5\,\mathrm{h}$.

### Primer 4: zdaj ti

Paradižnik ima $2n = 24$. Koliko kromosomov in kromatid je v celici v anafazi mitoze (šteješ celo celico, pred citokinezo) in koliko v eni celici v metafazi II?

**Podatki:** $2n = 24$, faza 1: anafaza mitoze, faza 2: metafaza II
**Iščemo:** število kromosomov in kromatid v obeh fazah

:::formula
Ločena sestrska kromatida šteje kot samostojen kromosom. Mejoza I razpolovi število kromosomov, kromatide pa ostanejo spojene.
:::

**Rešitev:**

1. Po S fazi ima celica $24$ kromosomov in $24 \cdot 2 = 48$ kromatid.
2. V anafazi mitoze se sestrski kromatidi ločita. Koliko kromosomov je zdaj v celici?
3. Po mejozi I dobi vsaka celica le en homolog iz vsakega para. Koliko kromosomov in kromatid je v metafazi II?

:::premisli
Izračunaj obe fazi, nato preveri.
---
Anafaza mitoze: $48$ kromosomov z eno kromatido, skupaj $48$ kromatid (vsaka kromatida je postala kromosom). Metafaza II: $24 / 2 = 12$ kromosomov, vsak z dvema kromatidama, skupaj $24$ kromatid.
:::

## Pogoste napake

- **»Mejoza je dvakratna mitoza.«** Ker imata enake faze, se zdi mejoza ponovitev. Dve mitozi pa bi potrebovali dve S fazi in ne bi razpolovili kromosomov. Pravilno: ena S faza, mejoza I loči homologe, mejoza II sestrske kromatide.
- **»DNA se podvoji v mitozi.«** Ker se med mitozo kromosomi vidijo podvojeni, študent misli, da se tam podvajajo. DNA se podvoji v S fazi interfaze; v mitozi se kopije le razdelijo.
- **Kromatide šteje kot kromosome.** V G2 človeške celice napiše »$92$ kromosomov«. Kromosome štejemo po centromerah; več jih je šele, ko se kromatidi v anafazi ločita.
- **»Homologna kromosoma sta sestrski kromatidi.«** Oba para sta »dvojici«, zato ju zameša. Sestrski kromatidi sta enaki kopiji iz S faze; homologa sta kromosoma od dveh staršev z različnimi aleli.
- **»Kontrolna točka popravi napako.«** Kontrolna točka sama ničesar ne popravi. Le ustavi cikel (zavre CDK ali APC/C), da popravljalni sistemi dobijo čas, ali sproži apoptozo.

## Povzetek

- Celični cikel: G1 → S (podvojevanje DNA) → G2 → M (jedrska delitev in citokineza).
- Po S fazi ima kromosom dve sestrski kromatidi, ki ju drži kohezin; število kromosomov ostane, DNA se podvoji ($2c \to 4c$).
- Mitoza: separaza razreže kohezin, sestrske kromatide se ločijo; nastaneta dve enaki diploidni celici.
- Mejoza: ena S faza, dve delitvi. Mejoza I (parjenje, prekrižanje, ločitev homologov) razpolovi število kromosomov; mejoza II loči sestrske kromatide. Nastanejo štiri različne haploidne celice; neodvisno razporejanje da $2^n$ kombinacij.
- Kontrolne točke G1/S, G2/M in točka delitvenega vretena zadržijo cikel prek CDK s ciklini, p53 in APC/C, dokler pogoj ni izpolnjen.
- Odpoved kontrolnih točk vodi v tumorje, napaka v mejozi v aneuploidijo (npr. trisomija 21).

## Za izpit

Znati moraš povedati:

- natančne definicije: kromosom (štetje po centromerah), sestrski kromatidi, homologna kromosoma, diploidna in haploidna celica, $n$ in $c$;
- število kromosomov, kromatid in količino DNA v vsaki fazi mitoze in mejoze (tabela v razlagi);
- štiri razlike med mejozo in mitozo ter zakaj mejoza I razpolovi število kromosomov, mejoza II pa ne;
- trditev o $2^n$ kombinacijah z dokazom in posledice nerazdružitve v mejozi I in mejozi II;
- molekularni mehanizem kontrolnih točk G1/S (p53, p21), G2/M (CDK1 s ciklinom B) in delitvenega vretena (APC/C, sekurin, separaza, kohezin).

### Naloga 1

Rž ima $2n = 14$, celica v G1 vsebuje približno $16\,\mathrm{pg}$ DNA. (a) Koliko kromosomov, kromatid in DNA je v G2, v anafazi I (cela celica), v eni celici v metafazi II in v eni celici po mejozi II? (b) Koliko kombinacij kromosomov da neodvisno razporejanje in kolikšna je verjetnost, da produkt mejoze dobi vse materine kromosome (brez prekrižanja)? (c) Koliko kromosomov imajo štiri celice po mejozi, če se en par homologov ne loči v anafazi I, in koliko, če se v anafazi II v eni celici ne ločita sestrski kromatidi?

**Rešitev:**

1. Haploidno število je $n = 14/2 = 7$, $2c = 16\,\mathrm{pg}$, zato $c = 8\,\mathrm{pg}$.
2. G2: S faza podvoji DNA, ne kromosomov: $14$ kromosomov, $14 \cdot 2 = 28$ kromatid, $4c = 32\,\mathrm{pg}$.
3. Anafaza I: ločita se homologa, ne kromatidi, zato je v celici še $14$ kromosomov, $28$ kromatid in $32\,\mathrm{pg}$.
4. Metafaza II: en homolog iz vsakega para, $7$ kromosomov z dvema kromatidama, $14$ kromatid in $2c = 16\,\mathrm{pg}$.
5. Po mejozi II: $7$ kromosomov, $7$ kromatid, $c = 8\,\mathrm{pg}$.
6. Kombinacije: $2^7 = 128$; verjetnost, da gredo v isto celico vsi materini homologi: $(1/2)^7 = 1/128 \approx 0{,}0078$.
7. Nerazdružitev v anafazi I: oba homologa gresta v isto celico ($8$ proti $6$ kromosomov); mejoza II poteče normalno, zato nastanejo dve celici z $n + 1 = 8$ in dve z $n - 1 = 6$ kromosomi.
8. Nerazdružitev v anafazi II: neprizadeta celica da dve celici s $7$ kromosomi, prizadeta eno z $8$ in eno s $6$.
9. Odgovor: G2 $14$/$28$/$32\,\mathrm{pg}$, anafaza I $14$/$28$/$32\,\mathrm{pg}$, metafaza II $7$/$14$/$16\,\mathrm{pg}$, po mejozi II $7$/$7$/$8\,\mathrm{pg}$; $128$ kombinacij, verjetnost $1/128$; nerazdružitev v mejozi I da $8, 8, 6, 6$, v mejozi II pa $7, 7, 8, 6$ kromosomov.

### Naloga 2

Utemelji, zakaj se v anafazi I ločita homologna kromosoma, sestrski kromatidi pa ostaneta skupaj, in zakaj zato mejoza I razpolovi število kromosomov, mejoza II pa ne. Nato opiši, kako kontrolna točka delitvenega vretena prepreči anafazo, dokler en sam kinetohor ni pripet.

**Rešitev:**

1. V profazi I se homologa sparita v bivalent; skupaj ju držijo hiazme in kohezin na krakih kromatid.
2. V metafazi I sta kinetohora sestrskih kromatid usmerjena proti istemu polu, homologa pa proti nasprotnima poloma.
3. V anafazi I separaza razreže kohezin na krakih, s tem se hiazme sprostijo in homologa odpotujeta k nasprotnima poloma. Kohezin ob centromeri varuje šugošin, zato sestrski kromatidi ostaneta skupaj.
4. Vsaka hčerinska celica dobi en kromosom iz vsakega para: število kromosomov pade z $2n$ na $n$.
5. Pred mejozo II ni S faze; kinetohora sestrskih kromatid gledata proti nasprotnima poloma, separaza razreže centromerni kohezin in vsaka celica dobi eno kromatido, zato število kromosomov ostane $n$, DNA pa pade z $2c$ na $c$.
6. Kontrolna točka vretena: nepripet kinetohor oddaja signal, ki zavira APC/C. Dokler je APC/C zavrt, ne označi sekurina in ciklina B za razgradnjo v proteasomu.
7. Sekurin ostane vezan na separazo, zato ta ne more razrezati kohezina in sestrski kromatidi ostaneta skupaj; celica obstane v metafazi.
8. Ko so vsi kinetohori pripeti in pod napetostjo, se APC/C aktivira, sekurin se razgradi, separaza razreže kohezin in anafaza se začne. Ker je razgradnja beljakovin nepovratna, je tudi začetek anafaze nepovraten.

## Drugače: Na sliki

Materin kromosom nariši z debelo, očetovega s tanko črto; po S fazi je vsak »X«.

Mitoza, v metafazi:

```
   pol  ←   X (debel)   →  pol
   pol  ←   X (tanek)   →  pol
```

Vsak pol dobi eno debelo in eno tanko črto.

Mejoza I, v metafazi I:

```
   pol  ←   X (debel)
            X (tanek)   →  pol
```

Na en pol gre cel debel »X«, na drugega cel tanek; v mejozi II se »X« razpre kot v mitozi.

## Drugače: Uporaba v stroki

- **Kariotipizacija.** Kolhicin zavre vreteno, celice obstanejo v metafazi z zgoščenimi kromosomi; tako v prenatalni diagnostiki prepoznamo trisomije.
- **Pretočna citometrija.** Po barvanju DNA ločimo celice z $2c$ (G1), vmesno (S) in $4c$ (G2/M) vsebnostjo ter iz deležev ocenimo trajanje faz, kot v primeru 3.
- **Zdravila proti raku.** Paklitaksel (taksol) in vinka alkaloidi delujejo na mikrotubule vretena, zaviralci CDK4/6 pa ustavijo cikel pred restrikcijsko točko G1/S.
- **Žlahtnjenje rastlin.** Žlahtnitelji s kolhicinom podvojijo število kromosomov in dobijo poliploidne sorte.

## Preveri se

? Katera trditev o celičnem ciklu je pravilna?
- DNA se podvoji v profazi mitoze, ko postanejo kromosomi vidni.
~ Kromosomi so v profazi že podvojeni, vidni postanejo, ker se zgostijo. DNA se podvoji v S fazi.
+ V G2 ima vsak kromosom dve sestrski kromatidi, število kromosomov pa je enako kot v G1.
- Kontrolna točka G1/S sama popravi poškodovano DNA.
~ Kontrolna točka cikel le ustavi (npr. p53 → p21 zavre CDK); popravijo ga popravljalni encimi.
- Mejoza I loči sestrski kromatidi, mejoza II pa homologna kromosoma.
~ Vrstni red je obraten: v mejozi I se ločita homologa, v mejozi II sestrski kromatidi.
> S faza podvoji DNA, ne kromosomov: v G2 je $46$ kromosomov s po dvema kromatidama.

? Pes ima $2n = 78$. Koliko kromatid je v celici v metafazi I?
- $78$
~ To je število kromosomov. Vsak ima po S fazi dve kromatidi.
- $39$
~ To je število kromosomov po mejozi I. V metafazi I celica še ni razdeljena.
+ $156$
- $312$
~ To bi bilo po dveh S fazah. Pred mejozo se DNA podvoji le enkrat.
> V metafazi I je $78$ kromosomov (v $39$ bivalentih), vsak z dvema kromatidama: $78 \cdot 2 = 156$.

? Študent je rešil nalogo: »Človeška celica v G2: $92$ kromosomov. Po mejozi I: $46$ kromosomov. Po mejozi II: $23$ kromosomov.« Kje je napaka?
- Napaka je le v zadnji vrstici: po mejozi II jih je $11{,}5$.
~ Mejoza II loči sestrski kromatidi in ne zmanjša števila kromosomov; polovičnega kromosoma ni.
+ Že v prvi vrstici: v G2 je $46$ kromosomov z $92$ kromatidami, po mejozi I pa $23$ kromosomov.
- Napak ni; vsaka delitev razpolovi število kromosomov.
~ Število kromosomov razpolovi le mejoza I; mejoza II ga ohrani, razpolovi le DNA.
> Kromatide je štel kot kromosome. Pravilno: G2 $46$, po mejozi I $23$, po mejozi II $23$ kromosomov (z eno kromatido).

? Kaj imata skupnega anafaza mitoze in anafaza II mejoze, česar anafaza I nima?
- V obeh se ločita homologna kromosoma.
~ Homologa se ločita prav v anafazi I, ki je izjema.
- V obeh nastanejo diploidne celice.
~ Po mejozi II so celice haploidne; diploidne nastanejo le v mitozi.
+ V obeh separaza razreže kohezin ob centromeri in sestrski kromatidi se ločita.
> V anafazi I je kohezin ob centromeri zaščiten, zato sestrski kromatidi ostaneta skupaj; ločita se šele v anafazi II, tako kot v mitozi.

? Taksol (paklitaksel) stabilizira mikrotubule, zato vreteno ne deluje pravilno. Zakaj se rakave celice, zdravljene s taksolom, ustavijo v mitozi?
- Ker taksol zavre podvojevanje DNA v S fazi.
~ Taksol deluje na mikrotubule, ne na DNA-polimerazo; celice pridejo do mitoze.
+ Ker kinetohori niso pravilno pripeti in pod napetostjo, zato kontrolna točka vretena zavira APC/C in anafaza se ne začne.
- Ker p53 zazna poškodbo DNA in ustavi cikel v G1.
~ To je kontrolna točka G1/S; taksol ne poškoduje DNA, celice se ustavijo v metafazi.
> Dokler vsi kinetohori niso pravilno pripeti, signal kontrolne točke vretena zavira APC/C; sekurin se ne razgradi, separaza ostane neaktivna in celica obstane v metafazi.

:::simboli
n | število kromosomov v enem kompletu (haploidno število) | | – | pri človeku n = 23, diploidna celica 2n
t_{\mathrm{faza}} | trajanje faze celičnega cikla | t_{\mathrm{faza}} \approx \dfrac{N_{\mathrm{faza}}}{N} \cdot T | h |
N_{\mathrm{faza}} | število celic v tej fazi | | – |
N | število vseh preštetih celic | | – |
T | trajanje celotnega celičnega cikla | | h |
t | čas opazovanja rasti kulture | | h |
N_t | število celic po času t | N_t = N_0 \cdot 2^{t/T} | – |
N_0 | začetno število celic | | – |
N_{\mathrm{M}} | število celic v mitozi | | – | mitotski indeks je N_M/N
c | količina DNA haploidnega kompleta | | pg |
:::
