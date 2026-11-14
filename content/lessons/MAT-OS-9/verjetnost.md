---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve situaciji iz nakupovalnega središča.

- Pri blagajni smeš iz škatle na slepo izvleči en kupon. V škatli je $40$ kuponov, $10$ jih prinese popust.
- Na stojnici zavrtiš kolo sreče z $8$ enakimi polji. Dve polji prineseta darilo.

Kje imaš več možnosti? Na prvi pogled je škatla boljša, saj ima kar $10$ dobitnih kuponov, kolo pa samo $2$ dobitni polji. A pri škatli je dobitna četrtina kuponov ($10$ od $40$), pri kolesu pa četrtina polj ($2$ od $8$). Možnosti so enake.

Obe situaciji skrivata isto idejo: šteje **delež** dobitnih možnosti med vsemi enako možnimi. Temu deležu rečemo **verjetnost**. Z njo presodiš nagradne igre, akcije »vsak četrti zadene« in obljube, ki zvenijo predobro.

## Razlaga

**1. Mamljiva napačna misel.** »Pri kolesu sreče dobim ali ne dobim. To sta dve možnosti, torej je verjetnost $50\,\%$.«

Preštej polja. Kolo ima $8$ enakih polj, dobitni sta le $2$. Če ga zavrtiš $80$-krat, se kazalec na dobitnem polju ustavi približno $20$-krat, ne $40$-krat. Napaka je v tem, da »dobim« in »ne dobim« nista **enako verjetni** možnosti: »ne dobim« pokrije $6$ polj, »dobim« samo $2$. Šteti moramo enako verjetne možnosti, to so polja.

**2. Poskus in izid.** **Poskus** je dejanje, katerega rezultata ne moremo vnaprej napovedati, lahko pa ga ponovimo: vrtenje kolesa, izvlek kupona, met kocke. **Izid** je en mogoč rezultat poskusa. Pri kolesu je $8$ izidov (polja), pri kocki $6$ izidov ($1, 2, 3, 4, 5, 6$), pri kovancu $2$ (grb in cifra).

**3. Dogodek.** **Dogodek** je izjava o rezultatu poskusa, na primer »dobim darilo« ali »pade sodo število«. Izidi, pri katerih se dogodek zgodi, so **ugodni izidi**. Za »pade sodo število« so ugodni izidi $2$, $4$ in $6$.

- **Gotov dogodek** se zgodi pri vsakem izidu: »izvlečem kupon« (v škatli so sami kuponi).
- **Nemogoč dogodek** se ne zgodi pri nobenem izidu: »pade $7$«.
- **Slučajni dogodek** se lahko zgodi ali ne: »izvlečem kupon s popustom«.

**4. Verjetnost.** Če so vsi izidi poskusa enako verjetni, je verjetnost dogodka $A$:

$$P(A) = \frac{\text{število ugodnih izidov}}{\text{število vseh izidov}}$$

Pri kolesu: $P(\text{darilo}) = \dfrac{2}{8} = \dfrac{1}{4}$. Pri škatli: $P(\text{popust}) = \dfrac{10}{40} = \dfrac{1}{4}$.

:::premisli
Kolo $X$ ima $4$ enaka polja in eno dobitno. Kolo $Y$ ima $12$ enakih polj in tri dobitna. Prijatelj pravi: »Vrtel bom $Y$, ima trikrat več dobitnih polj.« Ima prav?
---
Pri obeh enako: $\dfrac{1}{4} = \dfrac{3}{12}$. Več dobitnih polj ne pomeni nujno večje verjetnosti, šteje delež.
:::

**5. Od $0$ do $1$.** Ugodnih izidov ni nikoli manj kot $0$ in nikoli več kot vseh, zato je

$$0 \le P(A) \le 1$$

Verjetnost zapišemo kot ulomek, decimalno število ali v odstotkih: $\dfrac{1}{4} = 0{,}25 = 25\,\%$.

| Dogodek | Ugodni | Vsi | $P$ |
|---|---|---|---|
| izvlečem bon za $100$ € (ga ni) | $0$ | $40$ | $0$ |
| izvlečem kupon s popustom | $10$ | $40$ | $0{,}25$ |
| pade grb | $1$ | $2$ | $0{,}5$ |
| izvlečem kupon | $40$ | $40$ | $1$ |

:::risba premica
opis: Številska premica od 0 do 1 s črticami na vsako četrtino. Pri 0 je nemogoč dogodek, pri 0,25 kupon s popustom, pri 0,5 grb pri metu kovanca, pri 1 gotov dogodek.
od: 0
do: 1
korak: 0,25
točka: 0 | nemogoč
točka: 0,25 | popust
točka: 0,5 | grb
točka: 1 | gotov
:::

**6. Nasprotni dogodek.** Nasprotni dogodek dogodka $A$ je »$A$ se ne zgodi«. Ugodni so zanj vsi izidi, ki za $A$ niso ugodni, zato

$$P(\text{ne } A) = 1 - P(A)$$

Pri škatli: $P(\text{brez popusta}) = 1 - \dfrac{1}{4} = \dfrac{3}{4}$.

**7. Verjetnost in poskusi.** Iz statistike poznaš relativno frekvenco $f_r = \dfrac{f}{n}$: kolikokrat se je dogodek zgodil ($f$), deljeno s številom poskusov ($n$). Relativna frekvenca je izmerjena, verjetnost izračunana. Pri malo poskusih se lahko močno razlikujeta. Pri zelo veliko poskusih je relativna frekvenca praviloma blizu verjetnosti.

V simulaciji spodaj (»Verjetnost s poskusi«) izberi »met kocke« in nekajkrat pritisni »10«. Nato pritisni »1000«. Opazuj, kako se stolpci (relativne frekvence) približajo črtam (verjetnostim $\dfrac{1}{6}$).

:::premisli
Kocko boš vrgel $60$-krat. Prijatelj trdi: »Ker je $P = \dfrac{1}{6}$, bo šestica padla natanko $10$-krat.« Kaj mu odgovoriš?
---
Verjetnost ne predpisuje izidov, pove le, kam se relativna frekvenca ustali pri zelo veliko metih. Pri $60$ metih je $8$ ali $13$ šestic povsem običajno. Kocka si ne zapomni, kaj je že padlo, zato ničesar ne »popravlja«.
:::

## Rešeni primeri

### Primer 1 (lažji): met kocke

Kolikšna je verjetnost, da pri metu poštene kocke pade število, večje od $4$?

**Podatki:** poštena kocka, izidi $1, 2, 3, 4, 5, 6$; dogodek $A$: »pade število, večje od $4$«
**Iščemo:** $P(A)$

:::formula
$P(A) = \dfrac{\text{število ugodnih izidov}}{\text{število vseh izidov}}$ (izidi enako verjetni)
:::

**Rešitev:**

1. Vseh izidov je $6$. Kocka je poštena, zato so enako verjetni in smemo uporabiti formulo.
2. Ugodna izida sta $5$ in $6$. Število $4$ ni večje od $4$, zato ni ugoden izid.
3. $P(A) = \dfrac{2}{6} = \dfrac{1}{3}$.
4. Preizkus: rezultat leži med $0$ in $1$.

Verjetnost je $\dfrac{1}{3}$, približno $33\,\%$.

### Primer 2: kuponi pri blagajni

V škatli pri blagajni je $40$ kuponov: $24$ z napisom »Hvala za nakup«, $10$ s popustom $5\,\%$, $5$ s popustom $10\,\%$ in $1$ darilni bon za $20$ €. Kupec na slepo izvleče en kupon. Kolikšna je verjetnost, da dobi popust ali bon?

**Podatki:** $24$ kuponov »Hvala«, $10$ kuponov s $5\,\%$, $5$ kuponov z $10\,\%$, $1$ bon za $20$ €
**Iščemo:** $P(\text{popust ali bon})$

:::formula
$P(A) = \dfrac{\text{število ugodnih izidov}}{\text{število vseh izidov}}$ in $P(\text{ne } A) = 1 - P(A)$
:::

**Rešitev:**

1. Vseh kuponov je $24 + 10 + 5 + 1 = 40$. Vsak kupon je en enako verjeten izid.
2. Ugodni so vsi kuponi s popustom ali bonom: $10 + 5 + 1 = 16$.
3. $P = \dfrac{16}{40} = \dfrac{2}{5} = 0{,}4$.
4. Preizkus z nasprotnim dogodkom: $P(\text{»Hvala«}) = \dfrac{24}{40} = \dfrac{3}{5}$, torej $P = 1 - \dfrac{3}{5} = \dfrac{2}{5}$.

Kupec dobi popust ali bon z verjetnostjo $\dfrac{2}{5}$, to je $40\,\%$.

### Primer 3 (težji): koliko praznih srečk

Trgovec ima za nagradno igro $5$ dobitnih srečk. Rad bi, da je verjetnost dobitka natanko $\dfrac{1}{8}$. Koliko praznih srečk mora dodati v boben?

**Podatki:** $5$ dobitnih srečk, želena verjetnost $P = \dfrac{1}{8}$
**Iščemo:** število praznih srečk

:::formula
$P = \dfrac{\text{dobitne srečke}}{\text{vse srečke}}$
:::

**Rešitev:**

1. Dobitne srečke morajo biti osmina vseh, ker je $P = \dfrac{1}{8}$.
2. Vseh srečk je zato $8 \cdot 5 = 40$.
3. Praznih je $40 - 5 = 35$.
4. Preizkus: $\dfrac{5}{40} = \dfrac{1}{8}$.

Trgovec mora dodati $35$ praznih srečk.

### Primer 4 – zdaj ti: dva kovanca

Hkrati vržemo dva kovanca. Kolikšna je verjetnost, da pade natanko en grb?

**Podatki:** dva poštena kovanca; G = grb, C = cifra
**Iščemo:** $P(\text{natanko en grb})$

:::formula
$P(A) = \dfrac{\text{število ugodnih izidov}}{\text{število vseh izidov}}$
:::

**Rešitev:**

1. Kovanca ločimo: prvi in drugi. Izidi so GG, GC, CG, CC. GC in CG sta različna izida. Kovanca sta poštena, zato so vsi štirje izidi enako verjetni.
2. Poišči ugodne izide in izračunaj verjetnost.

:::premisli
Kolikšna je verjetnost?
---
Ugodna sta GC in CG, torej $2$ od $4$: $P = \dfrac{2}{4} = \dfrac{1}{2}$. Kdor šteje samo »$0$, $1$ ali $2$ grba«, dobi napačno $\dfrac{1}{3}$, ker ti trije izidi niso enako verjetni.
:::

## Pogoste napake

- **»Zgodi se ali ne, torej $50\,\%$.«** Dve možnosti sta $50\,\%$ le, če sta enako verjetni. Pri kolesu z $8$ polji in $2$ dobitnima »ne dobim« pokrije $6$ polj. Preštej enako verjetne izide.
- **Izidi, ki niso enako verjetni.** Pri dveh kovancih »$0$ grbov, $1$ grb, $2$ grba« niso trije enako verjetni izidi, ker en grb pade na dva načina (GC in CG). Izide naštej tako, da kovanca ločiš.
- **Ugodni proti neugodnim.** Pri $15$ dobitnih in $45$ praznih kuponih verjetnost ni $\dfrac{15}{45}$. V imenovalcu so **vsi** izidi: $\dfrac{15}{60} = \dfrac{1}{4}$. Če pa dobiš verjetnost, večjo od $1$, si ulomek obrnil.
- **»Zdaj je na vrsti.«** Po šestih praznih vrtenjih kolesa je verjetnost dobitka še vedno $\dfrac{1}{4}$, ker si kolo prejšnjih vrtenj ne zapomni. (Drugače je pri srečkah, ki jih ne vrnemo v boben: tam se spremeni število srečk.)
- **Relativna frekvenca ni verjetnost.** Če pri $60$ metih pade $13$ šestic, kocka ni nujno goljufiva. Relativna frekvenca $\dfrac{13}{60}$ je izmerjena in se od poskusa do poskusa spreminja, verjetnost $\dfrac{1}{6}$ pa je izračunana.

## Povzetek

- Poskus je naključno dejanje, ki ga lahko ponovimo. Izid je en mogoč rezultat. Dogodek je izjava o rezultatu, ugodni izidi so tisti, pri katerih se zgodi.
- Pri enako verjetnih izidih: $P(A) = \dfrac{\text{ugodni izidi}}{\text{vsi izidi}}$.
- $0 \le P(A) \le 1$: nemogoč dogodek ima $0$, gotov $1$.
- Nasprotni dogodek: $P(\text{ne } A) = 1 - P(A)$.
- »Zgodi se ali ne« ni samodejno $50\,\%$: štejemo enako verjetne izide.
- Relativna frekvenca $f_r = \dfrac{f}{n}$ je izmerjena; pri veliko poskusih je praviloma blizu verjetnosti.

## Drugače: Kot zgodba

Luka je v soboto pred trgovino zagledal kolo sreče z $8$ enakimi polji. Dve sta bili zeleni z napisom »DARILO«, šest sivih z napisom »Več sreče prihodnjič«.

»Ali dobim ali ne, to je pol-pol,« si je rekel in zavrtel. Sivo. Zavrtel je še petkrat, vsakič sivo. »Zdaj pa mora priti zeleno, na vrsti je!«

Prodajalka se je nasmehnila. »Kolo ne ve, kaj je bilo prej. Vsakič sta dobitni $2$ polji od $8$, to je četrtina. Danes so ga ljudje zavrteli približno $400$-krat, darilo pa smo podelili okoli $100$-krat. Ne $200$-krat, kot bi bilo pri pol-pol.«

Luka je izračunal: $\dfrac{100}{400} = \dfrac{1}{4}$. Pri veliko vrtenjih je delež dobitkov blizu verjetnosti $\dfrac{2}{8}$. Pri njegovih šestih vrtenjih pa se je lahko zgodilo karkoli.

## Drugače: Korak za korakom s številkami

Postopek za vsako nalogo:

1. Kaj je poskus? (npr. met kocke)
2. Naštej vse izide in jih preštej. So enako verjetni?
3. Zapiši dogodek in poišči ugodne izide.
4. Izračunaj $P = \dfrac{\text{ugodni}}{\text{vsi}}$ in okrajšaj.
5. Preveri, ali je rezultat med $0$ in $1$.

**Primer.** Poskus je met kocke, dogodek »pade praštevilo«. Število $1$ ni praštevilo.

| Izid | Praštevilo? |
|---|---|
| $1$ | ne |
| $2$ | da |
| $3$ | da |
| $4$ | ne |
| $5$ | da |
| $6$ | ne |

Ugodni izidi so $2$, $3$ in $5$, vseh je $6$: $P = \dfrac{3}{6} = \dfrac{1}{2}$.

**Še poskus.** Kocko vržemo $60$-krat in šestica pade $13$-krat.

| Metov | Šestic | Relativna frekvenca | Verjetnost |
|---|---|---|---|
| $60$ | $13$ | $\dfrac{13}{60} \approx 0{,}217$ | $\dfrac{1}{6} \approx 0{,}167$ |

Razlika je pri tako malo metih običajna. Pri $6\,000$ metih bi bila relativna frekvenca praviloma mnogo bližje $0{,}167$.

## Preveri se

? Na stojnici zavrtiš kolo sreče z $8$ enakimi polji, dve sta dobitni. Kaj od naštetega je **dogodek**?
- vrtenje kolesa
~ Vrtenje je poskus: dejanje, katerega rezultata ne poznamo vnaprej.
+ kazalec se ustavi na dobitnem polju
- število $\dfrac{1}{4}$
~ $\dfrac{1}{4}$ je verjetnost dogodka, ne dogodek sam.
- število $8$
~ $8$ je število vseh izidov poskusa.
> Dogodek je izjava o rezultatu poskusa. Zanj sta ugodna $2$ izida od $8$, zato je njegova verjetnost $\dfrac{1}{4}$.

? Razvrsti dogodke od najmanj do najbolj verjetnega. $A$: pri metu kocke pade $6$. $B$: pri metu kovanca pade grb. $C$: iz bobna z $20$ srečkami, od katerih so $3$ dobitne, izvlečeš dobitno.
- $A$, $B$, $C$
~ Razvrstil si po številu ugodnih izidov ($C$ ima $3$). Šteje delež: $\dfrac{3}{20}$ je manj kot $\dfrac{1}{6}$.
+ $C$, $A$, $B$
- $B$, $A$, $C$
~ To je vrstni red od najbolj do najmanj verjetnega.
- Vsi so enako verjetni, ker so vsi naključni.
~ Naključni so vsi, a deleži ugodnih izidov so različni.
> $P(C) = \dfrac{3}{20} = 0{,}15$, $P(A) = \dfrac{1}{6} \approx 0{,}167$, $P(B) = \dfrac{1}{2} = 0{,}5$.

? V bobnu je $5$ dobitnih in $15$ praznih srečk. Kaj se zgodi z verjetnostjo dobitka, če trgovec doda še $5$ praznih?
- Ostane enaka, ker je dobitnih še vedno $5$.
~ Število ugodnih izidov se ne spremeni, poveča pa se število vseh izidov v imenovalcu.
- Poveča se, ker je v bobnu več srečk.
~ Več srečk pomeni več možnosti za prazno srečko, ne za dobitno.
+ Zmanjša se z $\dfrac{1}{4}$ na $\dfrac{1}{5}$.
> Prej $\dfrac{5}{20} = \dfrac{1}{4}$, potem $\dfrac{5}{25} = \dfrac{1}{5}$. Ugodnih je enako, vseh več, zato je delež manjši.

? V nagradnem bobnu je $60$ kuponov, $15$ jih prinese popust. Kolikšna je verjetnost, da kupec **ne** dobi popusta?
- $\dfrac{1}{4}$
~ To je verjetnost, da popust *dobi*. Nasprotni dogodek ima verjetnost $1 - \dfrac{1}{4}$.
- $\dfrac{1}{2}$
~ »Dobim ali ne« nista enako verjetni možnosti: brez popusta je $45$ kuponov, s popustom $15$.
- $\dfrac{1}{3}$
~ To je $\dfrac{15}{45}$, dobitni proti praznim. V imenovalcu morajo biti vsi kuponi.
+ $\dfrac{3}{4}$
> Brez popusta je $60 - 15 = 45$ kuponov, zato $P = \dfrac{45}{60} = \dfrac{3}{4}$. Enako dobimo z $1 - \dfrac{15}{60}$.

? Pošteno kocko vržeš $300$-krat. Koliko šestic pričakuješ?
- natanko $50$, sicer kocka ni poštena
~ Relativna frekvenca niha. Pri $300$ metih je $45$ ali $56$ šestic povsem običajno.
+ približno $50$
- približno $150$, ker šestica pade ali ne pade
~ Šestica in »ne šestica« nista enako verjetni: »ne šestica« pokrije $5$ izidov od $6$.
- približno $6$
~ $6$ je število izidov pri enem metu, ne število šestic v $300$ metih.
> $P(6) = \dfrac{1}{6}$, zato pričakujemo približno $\dfrac{1}{6} \cdot 300 = 50$ šestic. Natančnega števila verjetnost ne napove.

:::simboli
P | verjetnost dogodka | P(A) = \frac{\text{ugodni izidi}}{\text{vsi izidi}} | – | vedno med $0$ in $1$
A | dogodek | | | nasprotni dogodek »ne $A$«: $1 - P(A)$
f_r | relativna frekvenca | f_r = \frac{f}{n} | – | izmerjen delež
f | frekvenca (kolikokrat se je dogodek zgodil) | | – |
n | število poskusov | | – |
:::
