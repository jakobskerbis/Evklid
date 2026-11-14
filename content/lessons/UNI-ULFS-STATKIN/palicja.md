---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko so se v 19. stoletju po Evropi in Ameriki širile železnice, so potrebovale na tisoče mostov, lesenih in kmalu železnih. Graditelji so jih sestavljali iz ravnih palic v trikotnikih – tako so nastala paličja, ki jih še danes imenujemo po izumiteljih (Howejevo, Prattovo). Dolgo so jih dimenzionirali po izkušnjah, in kar nekaj mostov se je pod vlakom zrušilo. Ameriški inženir Squire Whipple je bil med prvimi, ki je pokazal, da lahko silo v **vsaki** palici izračunamo samo iz ravnotežja vozlišč. Nemški inženir August Ritter je pozneje opisal še hitrejšo pot do sile v izbrani palici, metodo prereza, ki jo po njem imenujemo Ritterjeva metoda.

Danes paličja nosijo strehe dvoran, žerjave, stolpe daljnovodov, odre in mostove. Na mnogih mostovih so na palice nalepljeni merilni lističi, ki ves čas pošiljajo podatke o deformacijah; računalnik iz njih sproti preverja, ali se sile ujemajo z izračunom. Da bi meritev znal brati, moraš znati izračunati, kolikšna sila naj bi bila v palici in ali je natezna ali tlačna. Za to sta metoda vozlišč in metoda prereza.

## Razlaga

### Najprej en primer

Preprosto streho nosi trikotnik $ABC$: $A(0; 0)$ je nepomična členkasta podpora, $B(4; 0)$ pomična, vrh $C(2; 1{,}5)$ je obremenjen s silo $10\,\mathrm{kN}$ navzdol (enote so metri). Palice so $AB$, $AC$ in $BC$.

1. **Reakcije celega trikotnika.** Obtežba je simetrična: $A_y = B = 5\,\mathrm{kN}$, $A_x = 0$.
2. **Izrežemo vozlišče $A$.** Nanj delujejo reakcija $A_y$ in sili palic $AB$ in $AC$. Palica $AC$ ima dolžino $2{,}5\,\mathrm{m}$ in smer $(0{,}8; 0{,}6)$. Obe sili palic narišemo, kot da palici vlečeta vozlišče k sebi (nateg).
3. **Ravnotežje vozlišča.** Navpično: $5 + 0{,}6\,S_{AC} = 0$, torej $S_{AC} \approx -8{,}33\,\mathrm{kN}$. Vodoravno: $S_{AB} + 0{,}8\,S_{AC} = 0$, torej $S_{AB} \approx 6{,}67\,\mathrm{kN}$.
4. **Pomen predznakov.** $S_{AB} > 0$: spodnja palica je napeta (nateg), drži nogi trikotnika skupaj. $S_{AC} < 0$: poševna palica je stisnjena (tlak).

V tem računu so štiri ideje, ki veljajo za vsako paličje: model idealnega paličja, štetje enačb in neznank, ravnotežje vozlišča in pomen predznaka osne sile. Vsaka dobi svoj razdelek.

### Idealno paličje

**Definicija.** **Idealno paličje** je konstrukcija iz ravnih palic, za katero velja:

1. palice so v vozliščih povezane s členki brez trenja;
2. zunanje sile (obtežbe in reakcije) delujejo le v vozliščih;
3. lastno težo palic zanemarimo ali jo razdelimo na krajišča.

Prava paličja imajo zvarjena ali privijačena vozlišča, a ker so palice vitke, je ta model zelo dober.

**Izrek.** V idealnem paličju je vsaka palica **dvosilni element**: obremenjena je le z dvema nasprotno enakima silama na krajiščih, ki ležita na osi palice.

**Dokaz.** Na palico delujeta le sili členkov na obeh koncih (sredi palice ni sil, členek ne prenaša momenta). Iz $\sum\vec{F} = 0$ sta nasprotno enaki. Iz $\sum M = 0$ glede na eno krajišče mora nosilka sile na drugem krajišču iti skozi prvo krajišče, torej leži na premici med njima – na osi palice. $\square$

Zato ima vsaka palica eno samo neznanko: **osno silo** $S$. Dogovor: $S > 0$ pomeni **nateg** (palica vleče vozlišči skupaj), $S < 0$ **tlak** (palica ju potiska narazen). Na skici vozlišča silo palice vedno narišemo **stran od vozlišča** (nateg); predznak rezultata nato sam pove, kaj je res.

### Statična določenost

Paličje z $v$ vozlišči ima za vsako vozlišče dve enačbi ($\sum F_x = 0$, $\sum F_y = 0$), skupaj $2v$. Neznanke so osne sile $p$ palic in $r$ reakcij.

**Pogoj.** Ravninsko paličje je lahko statično določeno le, če je

$$2v = p + r.$$

Pri $2v > p + r$ je mehanizem, pri $2v < p + r$ statično nedoločeno. Pogoj je potreben, ni pa zadosten: palice morajo biti razporejene tako, da je paličje geometrijsko nespremenljivo. Zanesljivo je to **enostavno paličje**: začnemo s trikotnikom in vsakič dodamo novo vozlišče z dvema palicama, ki nista na isti premici. Vsak korak doda $1$ vozlišče in $2$ palici, zato pogoj ostane izpolnjen. Tri enačbe celega paličja niso dodatne: so posledica enačb vozlišč.

V primeru zgoraj: $v = 3$, $p = 3$, $r = 3$, in $2 \cdot 3 = 3 + 3$.

:::premisli
Kvadratni okvir iz štirih palic s členki v ogliščih leži na nepomični in pomični podpori. Ali je statično določen? Kaj se zgodi, če dodaš eno diagonalo?
---
Brez diagonale: $v = 4$, $p = 4$, $r = 3$, $2v = 8 > 7$; je mehanizem, kvadrat se lahko zamakne v romb. Z diagonalo je $p = 5$ in $8 = 5 + 3$: okvir razpade na dva trikotnika in postane tog. Prav zato so paličja zgrajena iz trikotnikov.
:::

### Metoda vozlišč

Postopek, ki smo ga uporabili v uvodnem primeru, posplošimo:

1. Preveri $2v = p + r$ in iz ravnotežja celega paličja izračunaj reakcije.
2. Poišči vozlišče z največ **dvema** neznanima silama palic.
3. Izreži ga, sile neznanih palic nariši stran od vozlišča in zapiši $\sum F_x = 0$, $\sum F_y = 0$.
4. Nadaljuj na sosednje vozlišče, kjer sta zdaj neznani spet največ dve palici.
5. Zadnja vozlišča služijo za preizkus.

Smer palice dobiš iz koordinat: palica od vozlišča $i$ proti $j$ ima smerni vektor $(x_j - x_i;\ y_j - y_i)/l_{ij}$.

**Ničelne palice.** Iz ravnotežja vozlišča sledita dve pravili, s katerima si prihraniš veliko računanja:

- Če se v **neobremenjenem** vozlišču stikata le dve palici, ki nista na isti premici, sta obe ničelni.
- Če se v **neobremenjenem** vozlišču stikajo tri palice in sta dve na isti premici, je tretja ničelna.

Dokaz drugega pravila: os $y$ postavimo pravokotno na skupno premico prvih dveh palic. V enačbi $\sum F_y = 0$ ostane le tretja palica, zato je njena sila nič. Ničelna palica pri tej obtežbi ne nosi ničesar, ni pa odveč: pri drugi obtežbi lahko nosi, poleg tega skrajša uklonsko dolžino tlačenih palic in drži geometrijo.

### Metoda prereza (Ritterjeva metoda)

Pri metodi vozlišč moramo do palice sredi paličja »prehoditi« vsa vozlišča od podpore. Kadar potrebujemo le nekaj palic, je hitrejša metoda prereza:

1. Izračunaj reakcije.
2. Paličje prereži skozi **največ tri** palice, ki se ne sekajo vse v isti točki in niso vse vzporedne, med njimi palico, ki jo iščeš.
3. Za levi ali desni del zapiši ravnotežje: rezane palice nadomesti z osnimi silami (stran od dela, ki ga opazuješ).
4. Momentno enačbo zapiši okoli **Ritterjeve točke**: presečišča nosilk drugih dveh rezanih palic. Ti dve nimata momenta, zato v enačbi ostane le iskana sila.
5. Če sta drugi dve palici vzporedni (ni presečišča), uporabi projekcijsko enačbo pravokotno nanju.

Ritterjeva točka lahko leži daleč od rezanega polja, tudi v podpori ali zunaj paličja (v Nalogi 1 razdelka Za izpit je v podpori $L_0$); računa to ne spremeni. Vsaka iskana sila pride iz svoje enačbe, zato se napaka ne prenaša naprej, kot se lahko pri metodi vozlišč.

:::premisli
Pri paličju z vodoravnim zgornjim in spodnjim pasom prerežeš zgornji pas, diagonalo in spodnji pas. Zakaj sile v diagonali ne moreš dobiti z eno samo momentno enačbo, in kaj narediš namesto tega?
---
Pasova sta vzporedna in se ne sekata, zato Ritterjeve točke za diagonalo ni. Uporabiš navpično projekcijsko enačbo $\sum F_y = 0$: pasova sta vodoravna in v njej ne nastopata, ostane le navpična komponenta diagonale.
:::

## Rešeni primeri

### Primer 1 (lažji)

Elektronska prometna tabla visi na stenski konzoli iz dveh palic. Zgornja palica $AC$ je vodoravna, dolga $2{,}0\,\mathrm{m}$, spodnja $BC$ je poševna: $B$ je na steni $1{,}5\,\mathrm{m}$ pod $A$. Obe palici sta na steno in med seboj pritrjeni členkasto, v vozlišču $C$ visi tabla s težo $6{,}0\,\mathrm{kN}$ (skupaj z nosilnim okvirjem). Kolikšni sta sili v palicah in ali sta natezni ali tlačni?

**Podatki:** $A(0; 0)$, $B(0; -1{,}5)$, $C(2{,}0; 0)$ v metrih; $F = 6{,}0\,\mathrm{kN}$ navzdol v $C$
**Iščemo:** $S_{AC}$, $S_{BC}$

:::formula
vozlišče $C$: $\sum F_x = 0$, $\sum F_y = 0$; smer palice $(x_j - x_i;\ y_j - y_i)/l_{ij}$
:::

**Rešitev:**

1. Vozlišče $C$ ima le dve neznanki, zato reakcij ni treba računati prej.
2. Smeri od $C$ proti drugemu krajišču: proti $A$ je $(-1; 0)$; proti $B$ je $(-2{,}0; -1{,}5)/2{,}5 = (-0{,}8; -0{,}6)$, ker je $l_{BC} = \sqrt{2{,}0^2 + 1{,}5^2}\,\mathrm{m} = 2{,}5\,\mathrm{m}$.
3. Navpično: $-6{,}0 - 0{,}6\,S_{BC} = 0$, torej $S_{BC} = -10\,\mathrm{kN}$.
4. Vodoravno: $-S_{AC} - 0{,}8\,S_{BC} = 0$, torej $S_{AC} = -0{,}8 \cdot (-10)\,\mathrm{kN} = 8{,}0\,\mathrm{kN}$.
5. Odgovor: zgornja palica je napeta z $8{,}0\,\mathrm{kN}$ (vleče vozlišče k steni), spodnja je stisnjena z $10\,\mathrm{kN}$ (potiska vozlišče stran od stene). Obe sili sta večji od teže table, ker je spodnja palica položna.

### Primer 2

Prattovo paličje ima spodnja vozlišča $L_0(0; 0)$, $L_1(3; 0)$, $L_2(6; 0)$, $L_3(9; 0)$, $L_4(12; 0)$ in zgornja $U_1(3; 4)$, $U_2(6; 4)$, $U_3(9; 4)$ (v metrih). Palice: spodnji pas $L_0L_1$, $L_1L_2$, $L_2L_3$, $L_3L_4$; zgornji pas $U_1U_2$, $U_2U_3$; krajni palici $L_0U_1$ in $U_3L_4$; vertikale $U_1L_1$, $U_2L_2$, $U_3L_3$; diagonali $U_1L_2$ in $U_3L_2$. V $L_0$ je nepomična, v $L_4$ pomična podpora. V vozliščih $L_1$, $L_2$, $L_3$ visi po $12\,\mathrm{kN}$. Preveri statično določenost, poišči ničelno palico in izračunaj sile v levi polovici.

```
        U1      U2      U3
        o-------o-------o
      / | \     |     / | \
    /   |   \   |   /   |   \
  /     |     \ | /     |     \
o-------o-------o-------o-------o
L0      L1      L2      L3      L4
/\      v       v       v       ()
       12 kN   12 kN   12 kN
```

Polja so široka $3\,\mathrm{m}$, visoka $4\,\mathrm{m}$; $/\backslash$ je nepomična, $()$ pomična podpora, bremena visijo v spodnjih vozliščih.

**Podatki:** koordinate vozlišč in palice zgoraj; $F = 12\,\mathrm{kN}$ navzdol v $L_1$, $L_2$, $L_3$; podpori $L_0$ (nepomična), $L_4$ (pomična)
**Iščemo:** $2v = p + r$?, ničelne palice, $S_{L_0U_1}$, $S_{L_0L_1}$, $S_{U_1L_1}$, $S_{L_1L_2}$, $S_{U_1L_2}$, $S_{U_1U_2}$

:::formula
$2v = p + r$; vozlišče: $\sum F_x = 0$, $\sum F_y = 0$; pravilo treh palic za ničelno palico
:::

**Rešitev:**

1. Štetje: $v = 8$, $p = 4 + 2 + 2 + 3 + 2 = 13$, $r = 3$; $2 \cdot 8 = 16 = 13 + 3$. ✓ Paličje je sestavljeno iz trikotnikov, zato je togo.
2. Reakcije (simetrija): $A_y = B = 36/2\,\mathrm{kN} = 18\,\mathrm{kN}$, $A_x = 0$.
3. Ničelna palica: v vozlišču $U_2$ ni obtežbe, palici $U_1U_2$ in $U_2U_3$ ležita na isti premici, tretja je $U_2L_2$. Torej $S_{U_2L_2} = 0$.
4. Vozlišče $L_0$ (dve neznanki). Smer $L_0 \to U_1$ je $(3; 4)/5 = (0{,}6; 0{,}8)$. Navpično: $18 + 0{,}8\,S_{L_0U_1} = 0$, torej $S_{L_0U_1} = -22{,}5\,\mathrm{kN}$. Vodoravno: $S_{L_0L_1} + 0{,}6 \cdot (-22{,}5) = 0$, torej $S_{L_0L_1} = 13{,}5\,\mathrm{kN}$.
5. Vozlišče $L_1$: palici spodnjega pasu sta na isti premici, zato $S_{L_1L_2} = S_{L_0L_1} = 13{,}5\,\mathrm{kN}$; navpično $S_{U_1L_1} - 12 = 0$, torej $S_{U_1L_1} = 12\,\mathrm{kN}$ (nateg: vertikala obesi breme na zgornje vozlišče).
6. Vozlišče $U_1$: smeri proti $L_0$ $(-0{,}6; -0{,}8)$, proti $L_1$ $(0; -1)$, proti $U_2$ $(1; 0)$, proti $L_2$ $(0{,}6; -0{,}8)$. Navpično: $-0{,}8 \cdot (-22{,}5) - 12 - 0{,}8\,S_{U_1L_2} = 0$, torej $S_{U_1L_2} = 6/0{,}8\,\mathrm{kN} = 7{,}5\,\mathrm{kN}$.
7. Vodoravno v $U_1$: $-0{,}6 \cdot (-22{,}5) + S_{U_1U_2} + 0{,}6 \cdot 7{,}5 = 0$, torej $S_{U_1U_2} = -(13{,}5 + 4{,}5)\,\mathrm{kN} = -18\,\mathrm{kN}$.
8. Preizkus v $L_2$: vertikala je ničelna, navpično mora breme $12\,\mathrm{kN}$ nositi obe diagonali: $2 \cdot 0{,}8 \cdot 7{,}5 = 12\,\mathrm{kN}$. ✓
9. Odgovor: $S_{L_0U_1} = -22{,}5\,\mathrm{kN}$ (tlak), $S_{L_0L_1} = S_{L_1L_2} = 13{,}5\,\mathrm{kN}$ (nateg), $S_{U_1L_1} = 12\,\mathrm{kN}$ (nateg), $S_{U_1L_2} = 7{,}5\,\mathrm{kN}$ (nateg), $S_{U_1U_2} = -18\,\mathrm{kN}$ (tlak), $S_{U_2L_2} = 0$. Desna polovica je zrcalna. Pri Prattovem paličju so diagonale pri navpični obtežbi napete, zgornji pas pa stisnjen.

### Primer 3 (težji)

Isto Prattovo paličje kot v Primeru 2 je zdaj obremenjeno nesimetrično: v $L_1$ visi $20\,\mathrm{kN}$, v $U_3$ deluje $10\,\mathrm{kN}$ navzdol, v $U_1$ pa veter $6{,}0\,\mathrm{kN}$ vodoravno v desno. Z metodo prereza določi sile v palicah $U_1U_2$, $U_1L_2$ in $L_1L_2$. Rezultat preveri s projekcijsko enačbo in ugotovi, ali je kakšna palica ničelna.

**Podatki:** geometrija kot v Primeru 2; $F_1 = 20\,\mathrm{kN}$ navzdol v $L_1(3; 0)$; $F_2 = 10\,\mathrm{kN}$ navzdol v $U_3(9; 4)$; $H = 6{,}0\,\mathrm{kN}$ v smeri $+x$ v $U_1(3; 4)$
**Iščemo:** reakcije, $S_{U_1U_2}$, $S_{U_1L_2}$, $S_{L_1L_2}$, ničelne palice

:::formula
reakcije: $\sum M_{L_0} = 0$, $\sum F_x = 0$, $\sum F_y = 0$; prerez skozi tri palice; $M = xF_y - yF_x$ glede na Ritterjevo točko; preizkus $\sum F_x = 0$
:::

**Rešitev:**

1. Reakcije: $\sum M_{L_0} = 0$ da $12\,B - 20 \cdot 3 - 10 \cdot 9 - 6{,}0 \cdot 4 = 0$ (veter ima ročico $4\,\mathrm{m}$ in vrti v smeri urnega kazalca), torej $B = 174/12\,\mathrm{kN} = 14{,}5\,\mathrm{kN}$. Nato $A_y = 30 - 14{,}5 = 15{,}5\,\mathrm{kN}$ in $A_x = -6{,}0\,\mathrm{kN}$.
2. Prerez skozi drugo polje ($3 < x < 6$) prereže $U_1U_2$, $U_1L_2$ in $L_1L_2$. Opazujemo levi del ($L_0$, $L_1$, $U_1$); sile rezanih palic narišemo stran od levega dela.
3. **Zgornji pas.** Ritterjeva točka je presečišče diagonale in spodnjega pasu, vozlišče $L_2(6; 0)$. Momenti glede na $L_2$: reakcija $A_y$ ima ročico $6\,\mathrm{m}$ in da $-6 \cdot 15{,}5 = -93\,\mathrm{kN\,m}$; breme v $L_1$ da $+3 \cdot 20 = 60\,\mathrm{kN\,m}$; veter v $U_1$ da $-4 \cdot 6{,}0 = -24\,\mathrm{kN\,m}$; sila $S_{U_1U_2}$ v smeri $+x$ na višini $4\,\mathrm{m}$ da $-4\,S_{U_1U_2}$.
4. $-93 + 60 - 24 - 4\,S_{U_1U_2} = 0$, torej $S_{U_1U_2} = -57/4\,\mathrm{kN} = -14{,}25\,\mathrm{kN}$ (tlak).
5. **Spodnji pas.** Ritterjeva točka je presečišče zgornjega pasu in diagonale, vozlišče $U_1(3; 4)$. Glede na $U_1$: $A_y$ z ročico $3\,\mathrm{m}$ da $-3 \cdot 15{,}5 = -46{,}5\,\mathrm{kN\,m}$; $A_x = -6{,}0\,\mathrm{kN}$ na $4\,\mathrm{m}$ pod $U_1$ da $-(-4)(-6{,}0) = -24\,\mathrm{kN\,m}$; breme v $L_1$ leži navpično pod $U_1$ in nima momenta; $S_{L_1L_2}$ v smeri $+x$, $4\,\mathrm{m}$ pod $U_1$, da $+4\,S_{L_1L_2}$.
6. $-46{,}5 - 24 + 4\,S_{L_1L_2} = 0$, torej $S_{L_1L_2} = 70{,}5/4\,\mathrm{kN} \approx 17{,}63\,\mathrm{kN}$ (nateg).
7. **Diagonala.** Pasova sta vzporedna, Ritterjeve točke ni; uporabimo $\sum F_y = 0$ za levi del. Diagonala kaže od $U_1$ proti $L_2$, smer $(0{,}6; -0{,}8)$: $15{,}5 - 20 - 0{,}8\,S_{U_1L_2} = 0$, torej $S_{U_1L_2} = -4{,}5/0{,}8\,\mathrm{kN} \approx -5{,}63\,\mathrm{kN}$ (tlak).
8. Preizkus $\sum F_x = 0$ za levi del: $-6{,}0 + 6{,}0 - 14{,}25 + 17{,}63 + 0{,}6 \cdot (-5{,}63) \approx 0$. ✓
9. Ničelne palice: v vozlišču $L_3$ ni obtežbe, $L_2L_3$ in $L_3L_4$ sta na isti premici, zato $S_{U_3L_3} = 0$. V $U_2$ ni obtežbe, zato tudi $S_{U_2L_2} = 0$.
10. Odgovor: $S_{U_1U_2} = -14{,}25\,\mathrm{kN}$ (tlak), $S_{L_1L_2} \approx 17{,}6\,\mathrm{kN}$ (nateg), $S_{U_1L_2} \approx -5{,}63\,\mathrm{kN}$ (tlak); ničelni sta vertikali $U_2L_2$ in $U_3L_3$. Diagonala, ki je bila v Primeru 2 napeta, je pri tej obtežbi stisnjena – zato jo je treba preveriti tudi na uklon.

### Primer 4 – zdaj ti

Strešni trikotnik ima $A(0; 0)$ (nepomična podpora), $B(6; 0)$ (pomična) in vrh $C(3; 4)$, v metrih. V $C$ delujeta teža $12\,\mathrm{kN}$ navzdol in veter $4{,}0\,\mathrm{kN}$ vodoravno v desno. Določi sile v vseh treh palicah.

**Podatki:** $A(0; 0)$, $B(6; 0)$, $C(3; 4)$; v $C$: $F_y = -12\,\mathrm{kN}$, $F_x = 4{,}0\,\mathrm{kN}$
**Iščemo:** $S_{AB}$, $S_{AC}$, $S_{BC}$

:::formula
reakcije iz $\sum M_A = 0$; vozlišči $B$ in $A$: $\sum F_x = 0$, $\sum F_y = 0$
:::

**Rešitev:**

1. Reakcije: $6\,B - 12 \cdot 3 - 4{,}0 \cdot 4 = 0$, torej $B = 52/6\,\mathrm{kN} \approx 8{,}67\,\mathrm{kN}$; $A_y = 12 - 8{,}67 \approx 3{,}33\,\mathrm{kN}$; $A_x = -4{,}0\,\mathrm{kN}$.
2. Vozlišče $B$: smer proti $C$ je $(-3; 4)/5 = (-0{,}6; 0{,}8)$. Navpično: $8{,}67 + 0{,}8\,S_{BC} = 0$, torej $S_{BC} \approx -10{,}83\,\mathrm{kN}$. Vodoravno: $-S_{AB} - 0{,}6\,S_{BC} = 0$, torej $S_{AB} = 6{,}5\,\mathrm{kN}$.
3. Zdaj ti: v vozlišču $A$ izračunaj $S_{AC}$ in z drugo enačbo preveri rezultat.

:::premisli
Kolikšna je $S_{AC}$ in ali se vodoravna enačba v $A$ izide?
---
Smer $A \to C$ je $(0{,}6; 0{,}8)$. Navpično: $3{,}33 + 0{,}8\,S_{AC} = 0$, torej $S_{AC} \approx -4{,}17\,\mathrm{kN}$ (tlak). Vodoravno: $-4{,}0 + 6{,}5 + 0{,}6 \cdot (-4{,}17) \approx 0$. ✓ Zaradi vetra je palica na zavetrni strani ($BC$) stisnjena več kot dvakrat bolj kot $AC$.
:::

## Pogoste napake

- **Sila palice v napačno smer.** Študent pri enem vozlišču nariše nateg proti vozlišču, pri drugem stran od njega in dobi nasprotne predznake za isto palico. Popravek: v vsakem vozlišču riši silo stran od vozlišča; predznak je potem lastnost palice.
- **Ničelna palica, ki ni ničelna.** Pravilo treh palic velja le za neobremenjeno vozlišče. V Primeru 2 vertikala $U_1L_1$ ni ničelna, ker v $L_1$ visi breme.
- **Prerez skozi štiri palice.** Iz treh enačb ne dobiš štirih neznank. Prerez izberi tako, da prereže največ tri palice z neznano silo.
- **Napačna Ritterjeva točka.** Moment se računa glede na presečišče drugih dveh rezanih palic, ne glede na krajišče iskane palice. Če vzameš napačno točko, v enačbi ostaneta dve neznanki.
- **Ničelna palica je odveč.** Je ničelna le pri tej obtežbi. Pri vetru, snegu ali premiku bremena nosi silo, poleg tega skrajšuje uklonsko dolžino tlačenih palic.

## Povzetek

- Idealno paličje: ravne palice, členkasta vozlišča, sile le v vozliščih; vsaka palica je dvosilni element z osno silo $S$ ($S > 0$ nateg, $S < 0$ tlak).
- Statična določenost: $2v = p + r$ (potreben pogoj); enostavno paličje iz trikotnikov je togo.
- Metoda vozlišč: začni v vozlišču z dvema neznankama, $\sum F_x = 0$, $\sum F_y = 0$, sile riši stran od vozlišča.
- Ničelne palice: dve nekolinearni palici v neobremenjenem vozlišču; tretja palica ob dveh kolinearnih v neobremenjenem vozlišču.
- Metoda prereza: prereži največ tri palice, moment glede na Ritterjevo točko (presečišče drugih dveh); pri vzporednih pasovih projekcijska enačba.

## Za izpit

Znati moraš povedati:

- predpostavke idealnega paličja in dokaz, da je palica dvosilni element;
- pogoj $2v = p + r$ z izpeljavo in zakaj ni zadosten (primer geometrijsko spremenljivega paličja);
- postopek metode vozlišč in pravila za ničelne palice z utemeljitvijo;
- postopek metode prereza, pojem Ritterjeve točke in kaj narediš pri vzporednih pasovih.

### Naloga 1

Paličje enokapne strehe ima spodnja vozlišča $L_0(0; 0)$, $L_1(3; 0)$, $L_2(6; 0)$, $L_3(9; 0)$ in zgornja $U_1(3; 1)$, $U_2(6; 2)$, $U_3(9; 3)$ v metrih; zgornji pas leži na premici $y = x/3$ skozi $L_0$. Palice: spodnji pas $L_0L_1$, $L_1L_2$, $L_2L_3$; zgornji pas $L_0U_1$, $U_1U_2$, $U_2U_3$; vertikale $L_1U_1$, $L_2U_2$, $L_3U_3$; diagonali $U_1L_2$ in $U_2L_3$. Podpori: $L_0$ nepomična, $L_3$ pomična. V $U_1$, $U_2$ in $U_3$ deluje po $6{,}0\,\mathrm{kN}$ navzdol. Preveri statično določenost in z metodo prereza določi sile v $U_1U_2$, $U_1L_2$ in $L_1L_2$.

**Rešitev:**

1. Štetje: $v = 7$, $p = 3 + 3 + 3 + 2 = 11$, $r = 3$; $14 = 11 + 3$. ✓
2. Reakcije: $9\,B - 6{,}0 \cdot (3 + 6 + 9) = 0$, torej $B = 12\,\mathrm{kN}$; $A_y = 18 - 12 = 6{,}0\,\mathrm{kN}$; $A_x = 0$.
3. Prerez med $x = 3$ in $x = 6$ prereže $U_1U_2$, $U_1L_2$ in $L_1L_2$; opazujemo levi del ($L_0$, $L_1$, $U_1$).
4. **$L_1L_2$:** Ritterjeva točka je $U_1(3; 1)$, kjer se sekata zgornji pas in diagonala. $A_y$ da $-3 \cdot 6{,}0 = -18\,\mathrm{kN\,m}$, breme v $U_1$ nima momenta, $S_{L_1L_2}$ v smeri $+x$, $1\,\mathrm{m}$ pod $U_1$, da $+1 \cdot S_{L_1L_2}$. Torej $S_{L_1L_2} = 18\,\mathrm{kN}$ (nateg).
5. **$U_1U_2$:** Ritterjeva točka je $L_2(6; 0)$. Smer $U_1 \to U_2$ je $(3; 1)/\sqrt{10} \approx (0{,}949; 0{,}316)$. Glede na $L_2$: $A_y$ da $-6 \cdot 6{,}0 = -36\,\mathrm{kN\,m}$; breme v $U_1$ z ročico $3\,\mathrm{m}$ da $+18\,\mathrm{kN\,m}$; sila $S_{U_1U_2}$ v $U_1$ (relativni položaj $(-3; 1)$) da $(-3)(0{,}316\,S) - (1)(0{,}949\,S) \approx -1{,}897\,S$.
6. $-36 + 18 - 1{,}897\,S_{U_1U_2} = 0$, torej $S_{U_1U_2} \approx -9{,}49\,\mathrm{kN}$ (tlak); natančno $-3\sqrt{10}\,\mathrm{kN}$.
7. **$U_1L_2$:** zgornji in spodnji pas se sekata v $L_0(0; 0)$ – Ritterjeva točka je zunaj polja, v podpori. Smer $U_1 \to L_2$ je $(3; -1)/\sqrt{10} \approx (0{,}949; -0{,}316)$. Glede na $L_0$: reakcija in oba pasova nimajo momenta; breme v $U_1(3; 1)$ da $3 \cdot (-6{,}0) = -18\,\mathrm{kN\,m}$; diagonala da $3(-0{,}316\,S) - 1(0{,}949\,S) \approx -1{,}897\,S$.
8. $-18 - 1{,}897\,S_{U_1L_2} = 0$, torej $S_{U_1L_2} \approx -9{,}49\,\mathrm{kN}$ (tlak).
9. Preizkus $\sum F_x = 0$ na levem delu: $0{,}949 \cdot (-9{,}49) + 0{,}949 \cdot (-9{,}49) + 18 \approx -9{,}0 - 9{,}0 + 18 = 0$. ✓ Preizkus $\sum F_y = 0$: $6{,}0 - 6{,}0 + 0{,}316 \cdot (-9{,}49) - 0{,}316 \cdot (-9{,}49) = 0$. ✓
10. Odgovor: $S_{L_1L_2} = 18\,\mathrm{kN}$ (nateg), $S_{U_1U_2} \approx -9{,}49\,\mathrm{kN}$ (tlak), $S_{U_1L_2} \approx -9{,}49\,\mathrm{kN}$ (tlak).

### Naloga 2

Natančno navedi predpostavke idealnega paličja in dokaži, da je vsaka palica dvosilni element. Izpelji potreben pogoj statične določenosti ravninskega paličja in pokaži s primerom, da ni zadosten. Utemelji obe pravili za ničelne palice.

**Rešitev:**

1. Predpostavke: ravne palice; členkasta vozlišča brez trenja; vse zunanje sile v vozliščih; lastna teža zanemarjena ali prenesena v vozlišča.
2. Dvosilni element: na palico delujeta le sili v krajiščih. Iz $\sum\vec{F} = 0$ sta nasprotno enaki; iz $\sum M = 0$ glede na eno krajišče gre nosilka druge sile skozi to krajišče, torej po osi palice.
3. Pogoj: vsako vozlišče da dve neodvisni ravnotežni enačbi, skupaj $2v$; neznanke so $p$ osnih sil in $r$ reakcij. Enolična rešitev zahteva $2v = p + r$.
4. Ni zadosten: paličje z dvema pravokotnima poljema ($v = 6$: tri spodnja in tri zgornja vozlišča; palice: $2$ v zgornjem pasu, $2$ v spodnjem, $3$ vertikale) dobi obe diagonali v levem polju, v desnem pa nobene. Potem je $p = 9$, $r = 3$ in $2v = 12 = 9 + 3$, a levo polje je enkrat statično nedoločeno, desno pa mehanizem (pravokotnik se zamakne v paralelogram). Štetje se izide, togost pa ne.
5. Pravilo dveh palic: neobremenjeno vozlišče z dvema nekolinearnima palicama; os $x$ postavimo vzdolž prve palice, v enačbi $\sum F_y = 0$ ostane le komponenta druge, zato je ta nič; nato iz $\sum F_x = 0$ še prva.
6. Pravilo treh palic: os $x$ vzdolž kolinearnih palic; v $\sum F_y = 0$ nastopa le tretja, zato je nič.

### Naloga 3

Za Prattovo paličje iz Primera 2 utemelji brez računanja vseh sil: (a) katere palice so ničelne, če deluje ena sama sila $10\,\mathrm{kN}$ navzdol v $U_2$; (b) ali se spremeni predznak sile v diagonali $U_1L_2$, če isto silo prestaviš v $L_2$; (c) kaj se zgodi s silami vseh palic, če obtežba v (a) zamenja smer (vetrni srk).

**Rešitev:**

1. (a) Vozlišče $L_1$ je neobremenjeno, $L_0L_1$ in $L_1L_2$ sta kolinearni, zato $S_{U_1L_1} = 0$; enako v $L_3$: $S_{U_3L_3} = 0$.
2. V $U_2$ je zdaj obtežba, zato pravilo treh palic za $U_2L_2$ ne velja. V $L_2$ pa se stikajo $L_1L_2$, $L_2L_3$ (kolinearni) ter $U_2L_2$, $U_1L_2$ in $U_3L_2$; vozlišče je neobremenjeno, a ima tri nekolinearne palice, zato iz pravila ne sledi nič.
3. (b) Reakciji sta $5\,\mathrm{kN}$ ne glede na to, ali je sila v $U_2$ ali $L_2$. Iz $\sum F_y = 0$ na levem delu prereza skozi drugo polje: $5 - 0{,}8\,S_{U_1L_2} = 0$, torej $S_{U_1L_2} = 6{,}25\,\mathrm{kN}$ v obeh primerih; predznak se ne spremeni.
4. (c) Ravnotežne enačbe so linearne v obtežbi, zato vse sile zamenjajo predznak: napete palice postanejo tlačene in obratno. Vitke palice, ki so bile dimenzionirane le na nateg, je treba preveriti na uklon.

## Drugače: Z analogijo

Paličje si predstavljaj kot ekipo, ki prenaša težko omaro po stopnicah: vsak nosilec lahko le **vleče ali potiska vzdolž svoje roke**, prečno na roko pa ne more prenašati sile. Breme se razdeli tako, da je vsak »par rok« (palica) v ravnotežju na obeh koncih.

- Vozlišče je kot vozel v ribiški mreži: če potegneš za en vozel, se sila razdeli le po vrvicah, ki se stikajo v njem. Zato pri metodi vozlišč gledamo eno vozlišče naenkrat.
- Prerez je kot da bi mrežo prerezal s škarjami in rezane vrvice držal z rokami: sila, ki jo čutiš v vsaki roki, je sila v tej vrvici.
- Ničelna palica je kot oseba, ki v ekipi le pridržuje vrata: pri tej poti ne nosi ničesar, pri drugi poti pa brez nje omara pade.

Razlika od mreže: vrvica prenese le nateg, palica pa tudi tlak. Zato so paličja lahko toga, mreža pa ne.

## Drugače: Bolj natančno

**Matrična oblika.** Enačbe vseh vozlišč zapišemo kot linearni sistem $\mathbf{A}\,\mathbf{s} = -\mathbf{f}$: vektor $\mathbf{s}$ vsebuje $p$ osnih sil in $r$ reakcij, $\mathbf{f}$ zunanje sile v vozliščih ($2v$ komponent), matrika $\mathbf{A}$ pa smerne kosinuse palic. Paličje je statično določeno natanko tedaj, ko je $\mathbf{A}$ kvadratna ($2v = p + r$) in obrnljiva ($\det\mathbf{A} \neq 0$). Geometrijska spremenljivost se pokaže kot $\det\mathbf{A} = 0$, čeprav je štetje pravilno. Tako paličja računajo programi za statiko; metoda vozlišč na roke je le zaporedno reševanje tega sistema.

**Statično nedoločena paličja.** Pri $2v < p + r$ ima sistem neskončno mnogo rešitev, prava pa je tista, pri kateri se raztezki palic ($\Delta l = Sl/(EA)$, Hookov zakon za palico) ujemajo s skupnimi premiki vozlišč. To vodi v metodo pomikov, osnovo metode končnih elementov.

**Prostorska paličja.** Stolpi daljnovodov in strešne mreže so prostorska paličja: vsako vozlišče da tri enačbe, pogoj je $3v = p + r$, za togo podprto telo potrebujemo vsaj šest reakcij.

**Prava vozlišča.** Zvarjena vozlišča prenesejo tudi momente, zato v palicah nastanejo sekundarni upogibni momenti. Pri vitkih palicah so majhni; standardi za jeklene konstrukcije povedo, kdaj jih smemo zanemariti.

## Drugače: Uporaba v stroki

**Mostovi in merjenje.** Na paličnih mostovih so na izbrane palice nalepljeni merilni lističi, ki merijo specifično deformacijo. Iz nje s Hookovim zakonom in prerezom palice izračunamo osno silo in jo primerjamo s silo, ki jo za znano obtežbo (npr. preizkusni tovornjak) da metoda prereza. Če se meritev in račun ne ujemata, je morda poškodovano vozlišče ali je palica popustila. Sistemi za stalni nadzor zbirajo take podatke ves čas in opozorijo na odstopanja.

**Strehe in hale.** Strešna paličja iz lesa ali jekla so pogosto enostavna paličja iz trikotnikov. Projektant najprej določi sile v palicah za lastno težo, sneg in veter (tudi srk, ki obrne predznake), nato tlačene palice dimenzionira na uklon, natezne na nosilnost prereza in spojev. Ničelne palice pri eni kombinaciji obtežbe so pri drugi pogosto merodajne.

**Daljnovodi, žerjavi, odri.** Stebri daljnovodov in roke žerjavov so prostorska paličja; računajo jih programi z matrično metodo, inženir pa ročno preveri izbrane palice z metodo prereza. Pri odrih in podpornih konstrukcijah na gradbišču diagonale zagotavljajo togost – oder brez diagonal je mehanizem in se lahko zamakne kot kvadrat brez diagonale iz Razlage.

## Preveri se

? Katera trditev ne sodi med predpostavke idealnega paličja?
- Vozlišča so členkasta, brez trenja.
~ To je ena izmed predpostavk: členek ne prenaša momenta.
- Zunanje sile delujejo le v vozliščih.
~ Tudi to je predpostavka; brez nje palica ne bi bila dvosilni element.
+ Palice prenašajo upogibne momente.
- Palice so ravne.
~ Ravne palice so predpostavka; sila v smeri osi je potem sila v smeri palice.
> Pri idealnem paličju palice prenašajo le osne sile. Upogib nastopi le pri pravih (togih) vozliščih ali obtežbi med vozlišči.

? Stenska konzola iz dveh palic: zgornja vodoravna, spodnja poševna pod kotom, da je $\sin\beta = 0{,}6$ glede na vodoravnico. V skupnem vozlišču visi $9{,}0\,\mathrm{kN}$. Kolikšna je sila v poševni palici?
- $5{,}4\,\mathrm{kN}$
~ Breme si pomnožil s $\sin\beta$, namesto da bi ga delil: navpična komponenta palice mora biti enaka bremenu.
+ $15\,\mathrm{kN}$ (tlak)
- $12\,\mathrm{kN}$ (nateg)
~ $12\,\mathrm{kN}$ je sila v zgornji, vodoravni palici ($9{,}0 \cdot 0{,}8/0{,}6$). Spodnja palica je stisnjena.
> Navpično: $0{,}6\,|S| = 9{,}0\,\mathrm{kN}$, torej $|S| = 15\,\mathrm{kN}$. Spodnja palica potiska vozlišče stran od stene, zato je tlačena.

? Strešno paličje je izračunano za težo snega. Ob neurju veter streho dviga (srk) z enako razporeditvijo in velikostjo. Kaj se zgodi s silami v palicah?
+ Vse sile zamenjajo predznak; napete palice postanejo tlačene.
- Sile ostanejo enake, ker se paličje ne spremeni.
~ Sile so odvisne od obtežbe, ne le od geometrije. Pri obrnjeni obtežbi se obrne tudi rešitev enačb.
- Spremenijo se le reakcije, palice ostanejo enake.
~ Reakcije in sile v palicah so povezane z ravnotežjem vozlišč: če se spremenijo reakcije, se spremenijo tudi sile.
> Enačbe ravnotežja so linearne, zato obrnjena obtežba obrne vse sile. Vitke palice, ki so bile prej le napete, se lahko pod tlakom uklonijo.

? Pri metodi prereza iščeš silo v spodnjem pasu. Prerezal si zgornji pas, diagonalo in spodnji pas. Kateri korak je napačen? (1) Izračunam reakcije. (2) Sile treh rezanih palic narišem stran od levega dela. (3) Momentno enačbo zapišem okoli levega krajišča spodnjega pasu. (4) Iz nje izračunam silo spodnjega pasu.
- korak 1
~ Reakcije potrebuješ, da poznaš vse zunanje sile na levem delu; korak je pravilen.
- korak 2
~ Risanje vseh rezanih sil kot nateg (stran od dela) je dogovor, ki ga uporabljamo; korak je pravilen.
+ korak 3
- korak 4
~ Ta korak bi bil pravilen, če bi bil korak 3 pravilen.
> Momentno enačbo je treba zapisati okoli presečišča zgornjega pasu in diagonale (Ritterjeve točke). Okoli krajišča spodnjega pasu nima momenta prav iskana sila, v enačbi pa ostaneta drugi dve neznanki.

? Pri pregledu odra statik ugotovi, da je pri lastni teži ena izmed diagonal ničelna. Monter predlaga, da jo odstrani in prihrani material. Kaj je pravilno?
- Prav ima: palica ne nosi ničesar, zato ni potrebna.
~ Ničelna je le pri tej obtežbi. Pri vetru, neenakomerni obtežbi ali sunku delavca nosi silo.
- Odstrani jo lahko, če jo nadomesti z močnejšo sosednjo palico.
~ Sosednja palica ne prevzame sile v drugi smeri; poleg tega se lahko spremeni določenost in paličje postane mehanizem.
+ Ne sme je odstraniti: pri drugih obtežbah nosi silo, drži geometrijo in skrajšuje uklonsko dolžino tlačenih palic.
> Ničelnost je lastnost para »paličje + obtežba«, ne same palice. Brez nje lahko paličje postane gibljivo ali se tlačena palica ukloni.

:::simboli
S | osna sila v palici | | kN | pozitivna je nateg
S_{AB}, S_{AC}, S_{BC} | osne sile v palicah trikotnika | | kN
S_{U_1L_2} | sila v diagonali $U_1L_2$ | | kN
S_{U_1U_2} | sila v zgornjem pasu | | kN
S_{L_1L_2} | sila v spodnjem pasu | | kN
v | število vozlišč | | –
p | število palic | | –
r | število reakcij | | –
x_i, y_i | koordinati vozlišča i | | m
x_j, y_j | koordinati vozlišča j | | m
l_{ij} | dolžina palice med vozliščema i in j | l_{ij} = \sqrt{(x_j - x_i)^2 + (y_j - y_i)^2} | m
A_x, A_y | reakciji nepomične podpore | | kN
B | reakcija pomične podpore | | kN
F | sila (breme) v vozlišču | | kN
F_x, F_y | komponenti sile v vozlišču | | kN
F_1, F_2 | bremeni v Primeru 3 | | kN
H | vodoravna sila vetra | | kN
M | moment glede na Ritterjevo točko | M = xF_y - yF_x | kN\,m
x, y | lega prijemališča glede na Ritterjevo točko | | m
M_{L_0} | moment glede na podporo $L_0$ | | kN\,m
A, C | oznaki vozlišč trikotnika | | –
:::
