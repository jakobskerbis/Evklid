---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Maja trenira odbojko. Pred tekmo pomaga trenerju pripraviti telovadnico, ki ima obliko kvadra. Trener bi rad s stropa spustil vrv za plezanje tako, da bo visela čisto navpično, in vpraša: »Koliko vrvi potrebujemo do tal?«

Medtem Majin soigralec Žan pokaže proti stropu: »Rob stropa nad košem in bela črta na tleh ob dolgi steni se nikoli ne sekata. Torej sta vzporedna.« Maja ni prepričana. Črta teče vzdolž dvorane, rob pa počez in visoko pod stropom.

Kdo ima prav? In kako izmeriš razdaljo od točke na stropu do tal, ko so tla cela ploskev, ne ena točka? Na obe vprašanji odgovori geometrija prostora. Potreboval jo boš tudi pri prizmah, valjih in piramidah, ki pridejo za to temo.

## Razlaga

**Mamljiva zamisel.** V ravnini velja: dve premici se sekata ali pa sta vzporedni. Zato je Žanov sklep videti pravilen. V prostoru pa obstaja še tretja možnost.

Vzemi kocko $ABCDEFGH$. Spodnja ploskev je $ABCD$, zgornja $EFGH$; točka $E$ je nad $A$, $F$ nad $B$, $G$ nad $C$ in $H$ nad $D$. Robova $AB$ (spredaj spodaj) in $CG$ (zadaj desno, navpično) se ne sekata. Vzporedna pa tudi nista: $AB$ leži vodoravno, $CG$ stoji navpično. Ne obstaja ravnina, v kateri bi ležala oba. Takima premicama pravimo **mimobežni**.

**Dve premici v prostoru** primerjamo z dvema vprašanjema: ali imata skupno točko in ali ležita v isti ravnini?

| premici | skupna točka | ista ravnina | lega |
|---|---|---|---|
| $AB$, $BC$ | $B$ | da | sekajoči |
| $AB$, $DC$ | ni | da | vzporedni |
| $AB$, $CG$ | ni | ne | mimobežni |

Vzporedni premici morata torej izpolniti **dva** pogoja: ležita v isti ravnini in nimata skupne točke (ali pa sovpadata). Žanov rob stropa in črta na tleh nimata skupne točke, kažeta pa v različni smeri in sta na različnih višinah. Sta mimobežna.

:::premisli
Na risbi kocke se daljici $BG$ in $CF$ križata v eni točki. Napovej: ali sta premici $BG$ in $CF$ v prostoru sekajoči ali mimobežni?
---
Sekajoči. Obe sta diagonali stranske ploskve $BCGF$, torej ležita v isti ravnini in se sekata v njenem središču. Pri $DC$ in $BF$ pa je križanje na risbi le videz, ker ne ležita v isti ravnini.
:::

**Kako določimo ravnino.** Ravnino natanko določajo tri točke, ki ne ležijo na isti premici. Enako dobro jo določijo premica in točka zunaj nje, dve sekajoči premici ali dve vzporedni premici.

**Točka in premica, točka in ravnina.** Tu sta možni le dve legi: točka leži na premici (v ravnini) ali pa ne leži. Točka $E$ leži v ravnini $EFGH$, točka $A$ pa ne.

**Premica in ravnina** imata tri možne lege:

- premica **leži** v ravnini, če ležita v njej dve njeni točki ($EF$ leži v $EFGH$);
- premica je **vzporedna** z ravnino, če nimata skupne točke ($EF$ in $ABCD$);
- premica **prebada** ravnino v eni točki, **prebodišču** ($AE$ prebada $ABCD$ v točki $A$).

**Dve ravnini** sta vzporedni ali pa se sekata v premici, ki ji pravimo **presečnica**. Ravnini $ABCD$ in $EFGH$ sta vzporedni, ravnini $ABCD$ in $BCGF$ se sekata v premici $BC$.

**Druga mamljiva zamisel: pravokotnost na ravnino.** Diagonala $AF$ sprednje ploskve je pravokotna na rob $AD$, ki leži v tleh $ABCD$. Je zato $AF$ pravokotna na tla? Ne: z robom $AB$ oklepa kot $45^\circ$, torej je nagnjena. Ena pravokotna premica v ravnini ne zadošča.

Pravilo: premica, ki prebada ravnino, je **pravokotna na ravnino**, če je pravokotna na **dve različni premici** te ravnine skozi prebodišče. Tedaj je pravokotna na vsako premico ravnine skozi prebodišče. Rob $AE$ je pravokoten na $AB$ in na $AD$, zato je pravokoten na ravnino $ABCD$.

:::premisli
Zakaj ne zadošča ena pravokotna premica v ravnini, dve pa že?
---
Okoli ene premice lahko pravokotnico »vrtimo« kot vrata okoli tečajev, pa ostane pravokotna nanjo in se hkrati nagiba. Druga pravokotna premica v drugi smeri to vrtenje ustavi, zato ostane le ena lega.
:::

**Razdalja točke od ravnine.** Iz točke $T$ spustimo pravokotnico na ravnino. Prebodišče pravokotnice je **pravokotna projekcija** $T'$ točke $T$ (pravimo mu tudi nožišče). Razdalja točke $T$ od ravnine je dolžina daljice $TT'$. Vsaka druga daljica od $T$ do ravnine je poševna in daljša, ker je hipotenuza pravokotnega trikotnika s kateto $TT'$.

V simulaciji spodaj »Točke, premice in ravnine v kocki« izberi način »Razdalja do ravnine« in ravnino $ABCD$. Kje bo nožišče točke $G$ in kolikšna bo razdalja? Odgovori, preden izbereš $G$. Simulacija pokaže nožišče $C$ in razdaljo, enako robu kocke.

## Rešeni primeri

### Primer 1 (lažji): lega dveh robov kocke

V kocki $ABCDEFGH$ določi medsebojno lego premic: $EH$ in $HG$, $EF$ in $DC$, $BF$ in $DH$, $AD$ in $FG$, $EF$ in $CG$.

**Podatki:** kocka $ABCDEFGH$ (zgornja ploskev $EFGH$ nad spodnjo $ABCD$), pet parov premic
**Iščemo:** za vsak par: sekajoči, vzporedni ali mimobežni

:::formula
Skupna točka $\Rightarrow$ sekajoči. Brez skupne točke in v isti ravnini $\Rightarrow$ vzporedni. Brez skupne točke in ne v isti ravnini $\Rightarrow$ mimobežni.
:::

**Rešitev:**

1. $EH$ in $HG$ imata skupno točko $H$: sekajoči.
2. $EF$ in $DC$ ležita v ravnini $EFCD$, ki kocko prereže poševno, in nimata skupne točke: vzporedni.
3. $BF$ in $DH$ sta navpična robova, ležita v ravnini $BDHF$: vzporedni.
4. $AD$ in $FG$ ležita v ravnini $ADGF$ in kažeta v isto smer: vzporedni.
5. $EF$ je vodoraven rob zgoraj, $CG$ navpičen rob zadaj. Skupne točke nimata, v nobeni ravnini nista skupaj: mimobežni.

Odgovor: sekajoči je prvi par, vzporedni so drugi, tretji in četrti, mimobežni je zadnji par.

### Primer 2: telovadnica kot kvader

Telovadnica je kvader $ABCDEFGH$: tla $ABCD$, strop $EFGH$, stena z golom $ABFE$. Vrv za plezanje visi navpično s točke $V$ na stropu do tal. Določi lego: (a) vrvi in tal, (b) roba $EF$ in tal, (c) roba $AB$ in tal, (d) stropa in tal, (e) tal in stene $ABFE$.

**Podatki:** kvader $ABCDEFGH$, navpična vrv iz točke $V$ na stropu
**Iščemo:** pet medsebojnih leg premic in ravnin

:::formula
Premica in ravnina: leži v njej, je vzporedna ali jo prebada. Dve ravnini: vzporedni ali se sekata v presečnici.
:::

**Rešitev:**

1. (a) Navpična vrv je vzporedna z robom $AE$. Ta je pravokoten na $AB$ in $AD$, torej na tla. Zato je na tla pravokotna tudi vrv, ki jih prebada.
2. (b) Rob $EF$ leži v stropu in tal nikjer ne doseže: vzporeden s tlemi.
3. (c) Obe točki $A$ in $B$ ležita v tleh, zato rob $AB$ leži v ravnini tal.
4. (d) Strop in tla nimata skupne točke: vzporedni ravnini.
5. (e) Tla in stena z golom se stikata ob robu $AB$: sekata se, presečnica je $AB$.

Odgovor: vrv prebada tla pravokotno, $EF$ je vzporeden s tlemi, $AB$ leži v tleh, strop in tla sta vzporedna, tla in stena se sekata v $AB$.

### Primer 3 (težji): igralna kocka, prerezana po diagonali

Igralna kocka $ABCDEFGH$ ima rob $a = 2\,\text{cm}$. Kocko prerežemo po ravnini $ACGE$. Kolikšna je razdalja oglišča $B$ od te ravnine?

**Podatki:** rob $a = 2\,\text{cm}$, ravnina $ACGE$, točka $B$
**Iščemo:** razdaljo $d$ točke $B$ od ravnine $ACGE$

:::formula
Diagonala kvadrata (Pitagorov izrek): $e = a\sqrt{2}$. Razdalja je dolžina pravokotnice od oglišča do središča kvadrata, to je polovica diagonale: $d = \dfrac{e}{2}$.
:::

**Rešitev:**

1. Diagonali kvadrata $ABCD$ se sekata pravokotno v središču $S$. Zato je $BS$ pravokotna na premico $AC$, ki leži v ravnini $ACGE$.
2. Skozi $S$ gre v ravnini $ACGE$ tudi navpična premica (vzporedna z $AE$). Ta je pravokotna na tla, torej tudi na $BS$.
3. $BS$ je pravokotna na dve sekajoči premici ravnine skozi $S$. Torej je pravokotna na ravnino in $S$ je nožišče.
4. Dolžina diagonale $BD$:

$$e = 2\sqrt{2} \approx 2{,}83\,\text{cm}$$

5. Razdalja $d = BS$ je polovica diagonale:

$$d = \sqrt{2} \approx 1{,}41\,\text{cm}$$

Odgovor: oglišče $B$ je od ravnine prereza oddaljeno približno $1{,}41\,\text{cm}$.

### Primer 4 – zdaj ti

Telovadnica je kvader $ABCDEFGH$ z dolžino $AB = 30\,\text{m}$, širino $BC = 18\,\text{m}$ in višino $AE = 7\,\text{m}$. Luč je v kotu stropa, v točki $G$. Kako daleč je od tal in kako daleč od stene z golom $ABFE$?

**Podatki:** $AB = 30\,\text{m}$, $BC = 18\,\text{m}$, $AE = 7\,\text{m}$, točka $G$
**Iščemo:** razdaljo $G$ od ravnine $ABCD$ in od ravnine $ABFE$

:::formula
Razdalja točke od ravnine je dolžina pravokotnice od točke do nožišča.
:::

**Rešitev:**

1. Rob $GC$ je navpičen, zato je pravokoten na tla. Nožišče je $C$, razdalja do tal je $GC = AE = 7\,\text{m}$.
2. Za steno $ABFE$ poišči rob iz $G$, ki je pravokoten na to steno, in preberi njegovo dolžino.

:::premisli
Kateri rob je to in kolikšna je razdalja?
---
Rob $GF$: vzporeden je z $BC$, ki je pravokoten na $AB$ in na $BF$. Nožišče je $F$, razdalja je $GF = BC = 18\,\text{m}$.
:::

## Pogoste napake

- **»Se ne sekata, torej sta vzporedni.«** To velja le v ravnini. V prostoru preveri še, ali premici ležita v isti ravnini. Robova $AB$ in $CG$ nimata skupne točke, a sta mimobežna.
- **Ena pravokotnica zadošča.** Diagonala $AF$ je pravokotna na $AD$ v tleh, pa vendar ni pravokotna na tla. Pravokotnost na ravnino zahteva pravokotnost na dve različni premici ravnine skozi prebodišče.
- **Poševna daljica namesto pravokotnice.** Razdalja točke od ravnine ni dolžina katerekoli daljice do ravnine, na primer do nekega oglišča. Iskati moraš pravokotnico; vsaka poševna daljica je daljša.
- **Zaupanje risbi.** Na ploski risbi kocke se mimobežna robova lahko »križata«. Križanje na sliki še ne pomeni skupne točke v prostoru. Preveri, ali obstaja ravnina, ki vsebuje obe premici.
- **Tri točke vedno določajo ravnino.** Le če ne ležijo na isti premici. Skozi tri točke na eni premici gre neskončno ravnin.

## Povzetek

- Dve premici v prostoru: sekajoči (ena skupna točka), vzporedni (ista ravnina, brez skupne točke ali sovpadata), mimobežni (ne v isti ravnini, brez skupne točke).
- Ravnino določajo: tri točke, ki niso na isti premici, premica in točka zunaj nje, dve sekajoči ali dve vzporedni premici.
- Premica in ravnina: premica leži v ravnini, je z njo vzporedna ali jo prebada v prebodišču.
- Dve ravnini: vzporedni ali se sekata v presečnici.
- Premica je pravokotna na ravnino, če je pravokotna na dve različni premici ravnine skozi prebodišče.
- Razdalja točke od ravnine je dolžina pravokotnice do nožišča (pravokotne projekcije); je najkrajša daljica od točke do ravnine.

## Drugače: Kot zgodba

Pajek sedi v kotu sobe pod stropom. Zazdi se mu, da je spodaj na tleh muha, zato se po niti spusti naravnost navzdol. Nit je napeta, ker pajka vleče teža, in visi pravokotno na tla. Pajek pristane točno pod izhodiščem, v nožišču. Dolžina niti je razdalja kota od tal.

Muha je medtem že pri vratih. Če bi pajek splezal po poševni niti do nje, bi potreboval daljšo nit: poševna nit, navpična nit in razdalja po tleh tvorijo pravokoten trikotnik, poševna nit je njegova hipotenuza.

Ko pajek spet spleza gor, opazi, da njegova navpična nit in rob med stropom in steno nasproti nimata skupne točke. Vzporedna pa nista, saj nit visi navpično, rob pa teče vodoravno. Ta par je mimobežen.

## Drugače: Korak za korakom s številkami

Vzemi kvader z robovi $AB = 4\,\text{cm}$, $BC = 3\,\text{cm}$ in $AE = 2\,\text{cm}$ ter točko $H$ (nad $D$).

1. Ravnina $ABCD$: iz $H$ gre navzdol rob $HD$, pravokoten na tla. Razdalja je $HD = 2\,\text{cm}$.
2. Ravnina $BCGF$ (desna stena): iz $H$ gre proti njej rob $HG$, vzporeden z $AB$. Razdalja je $HG = 4\,\text{cm}$.
3. Ravnina $ABFE$ (sprednja stena): iz $H$ gre proti njej rob $HE$, vzporeden z $BC$. Razdalja je $HE = 3\,\text{cm}$.
4. Ravnine $ADHE$, $DCGH$ in $EFGH$ vsebujejo točko $H$, zato je razdalja do njih $0\,\text{cm}$.

Pri vsakem koraku isti postopek: poišči daljico iz točke, ki je pravokotna na ravnino, in preberi njeno dolžino.

## Preveri se

? Kateri par robov kocke $ABCDEFGH$ ne sodi k ostalim?
- $AB$ in $DC$
~ Ta robova ležita v ploskvi $ABCD$ in nimata skupne točke, zato sta vzporedna kot večina parov.
- $EF$ in $HG$
~ Ležita v ploskvi $EFGH$ in nimata skupne točke: vzporedna.
- $AE$ in $CG$
~ Oba sta navpična in ležita v ravnini $ACGE$: vzporedna.
+ $AB$ in $CG$
> Prvi trije pari so vzporedni. $AB$ in $CG$ nimata skupne točke in ne ležita v isti ravnini, zato sta mimobežna.

? Kocka ima rob $5\,\text{cm}$. Kolikšna je razdalja oglišča $H$ od ravnine $BCGF$?
- $7{,}07\,\text{cm}$
~ To je dolžina diagonale $HC$, poševne daljice do ravnine. Razdalja je dolžina pravokotnice.
+ $5\,\text{cm}$
- $2{,}5\,\text{cm}$
~ Polovica roba je razdalja središča kocke od ploskve, oglišče $H$ pa je od nje oddaljeno za cel rob.
> Rob $HG$ je pravokoten na ploskev $BCGF$, nožišče je $G$. Razdalja je enaka robu, $5\,\text{cm}$.

? Palica stoji v tleh in je pravokotna na dve različni premici tal skozi svoje prebodišče. Kaj iz tega sledi?
- Pravokotna je le na ti dve premici, na druge morda ne.
~ Dve različni premici ravnine skozi prebodišče zadoščata: od tod sledi pravokotnost na vse premice ravnine skozi to točko.
+ Palica je pravokotna na tla, torej na vsako premico tal skozi prebodišče.
- Nič, za pravokotnost na tla moramo preveriti vse premice tal.
~ Vseh premic ne moremo preveriti, zato velja pravilo dveh premic. Pravokotnost na dve različni premici je dovolj.
> To je pravilo za pravokotnost premice na ravnino: zadoščata dve različni premici ravnine skozi prebodišče.

? Učenec reši nalogo o kocki $ABCDEFGH$. (1) Robova $BC$ in $EH$ nimata skupne točke. (2) Zato sta vzporedna. (3) Robova $AB$ in $FG$ nimata skupne točke. (4) Zato sta vzporedna. Kateri korak je napačen?
- Korak (2)
~ $BC$ in $EH$ ležita v ravnini $BCHE$, zato je sklep tu pravilen.
- Korak (3)
~ $AB$ je spodaj spredaj, $FG$ zgoraj desno, skupne točke res nimata.
+ Korak (4)
- Noben
~ $AB$ in $FG$ ne ležita v isti ravnini, zato ne moreta biti vzporedna.
> $AB$ in $FG$ nimata skupne točke in ne ležita v isti ravnini, zato sta mimobežna. Pri $BC$ in $EH$ je ravnina $BCHE$, zato sta vzporedna.

? Fotograf na tekmi postavi stojalo s tremi nogami na neravna tla. Zakaj se stojalo ne maje, stol s štirimi nogami pa se lahko?
+ Tri točke, ki ne ležijo na isti premici, vedno določajo eno ravnino, četrta točka pa v njej ne leži nujno.
- Ker je trinožnik lažji od stola.
~ Teža ne odloča, ali se predmet maje. Odloča, ali vse noge hkrati ležijo v isti ravnini.
- Ker so noge trinožnika pravokotne na tla.
~ Noge trinožnika so poševne. Pomembne so tri točke, kjer se dotikajo tal.
> Konice treh nog vedno ležijo v eni ravnini. Štiri konice pa v isti ravnini ležijo le, če so tla in noge natančno usklajene.

:::simboli
a | rob kocke | | cm
e | diagonala kvadrata $ABCD$ (daljica $BD$) | e = a\sqrt{2} | cm
d | razdalja točke $B$ od ravnine $ACGE$ | d = \frac{e}{2} | cm
:::
