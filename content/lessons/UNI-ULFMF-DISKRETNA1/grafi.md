---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Bolnišnica kupi robota, ki ponoči razkuži hodnike. Sošolka Maja pravi: »Če so vsi prostori povezani s hodniki, lahko robot prevozi vsak hodnik natanko enkrat in se vrne v polnilnico. Samo pravi vrstni red mora najti.« Zveni razumno, a ni res. Po razlagi boš v nekaj sekundah, brez poskušanja, povedal, za katere tlorise drži.

Tloris je tu le seznam prostorov in hodnikov med njimi, torej **graf**. Enak zapis opiše zdravila, ki se ne smejo mešati, stike med bolniki ali vezi v molekuli. Vprašanja so podobna: ali obstaja obhod, koliko terminov potrebujemo, ali je struktura brez krogov.

## Razlaga

**1. Graf in stopnja.**

**Definicija.** (Enostavni) **graf** $G = (V, E)$ je končna neprazna množica **vozlišč** $V$ in množica **povezav** $E$, kjer je vsaka povezava neurejen par $\{u, v\}$ dveh različnih vozlišč. Pišemo $uv$; $u$ in $v$ sta **sosednji**. **Stopnja** $\deg(v)$ je število povezav, ki imajo krajišče v $v$. Največjo stopnjo v grafu označimo z $\Delta$.

Pogosti so **poln graf** $K_n$ ($n$ vozlišč, vsako s vsakim, $\binom{n}{2}$ povezav), **cikel** $C_n$ ($n \ge 3$ vozlišč v krogu) in **poln dvodelni graf** $K_{p,q}$ (vsako od $p$ vozlišč na eni strani je povezano z vsakim od $q$ vozlišč na drugi).

**Izrek (lema o rokovanju).** Za vsak graf z $m$ povezavami velja
$$\sum_{v \in V} \deg(v) = 2m.$$

**Dokaz.** Vsaka povezava $uv$ prispeva po $1$ k stopnji $u$ in k stopnji $v$, torej natanko $2$ k vsoti. $\square$

Posledica: število vozlišč lihe stopnje je vedno sodo, saj je vsota stopenj soda.

**2. Sprehodi, poti, cikli.** **Sprehod** je zaporedje vozlišč $v_0, v_1, \ldots, v_k$, kjer je vsak zaporedni par povezan. Je **sklenjen**, če je $v_k = v_0$. **Pot** je sprehod brez ponovljenih vozlišč, **cikel** pa sklenjen sprehod dolžine vsaj $3$, ki razen $v_0 = v_k$ nima ponovljenih vozlišč. Graf je **povezan**, če med poljubnima vozliščema obstaja pot.

Tloris iz uvoda:

```
   A --- B
   |   / |
   |  /  |
   C --- D
    \   /
     \ /
      E
```

Stopnje so $\deg(A) = 2$, $\deg(B) = 3$, $\deg(C) = 4$, $\deg(D) = 3$, $\deg(E) = 2$; vsota je $14$, povezav je $7$.

**3. Eulerjevi grafi: najprej opazuj.** **Eulerjev sprehod** uporabi vsako povezavo natanko enkrat; če je sklenjen, je to **Eulerjev obhod**, graf pa je **Eulerjev**. Preizkusi nekaj grafov s svinčnikom, ne da bi ga dvignil:

- trikotnik $C_3$ (vse stopnje $2$): obhod gre;
- »hiška« (kvadrat z dvema diagonalama in strehico; stopnje $2, 3, 3, 4, 4$): sprehod gre, a samo z začetkom v vozlišču stopnje $3$, in konča se v drugem takem; obhoda ni;
- $K_4$ (vse stopnje $3$): ne gre niti sprehod.

Vzorec: odloča število vozlišč lihe stopnje.

**Izrek (Euler).** Naj bo $G$ povezan graf z vsaj eno povezavo. Potem:
(a) $G$ ima Eulerjev obhod natanko tedaj, ko so vse stopnje sode;
(b) $G$ ima Eulerjev sprehod, ki ni sklenjen, natanko tedaj, ko ima natanko dve vozlišči lihe stopnje; sprehod se začne v enem in konča v drugem.

**Dokaz (a).** *Nujnost.* Ko obhod gre skozi vozlišče, porabi eno povezavo za prihod in eno za odhod; tudi začetek in konec obhoda se v $v_0$ sestavita v tak par. Povezave pri vsakem vozlišču so torej razdeljene v pare, zato je stopnja soda.

*Zadostnost* (indukcija po $m$). Začnimo v poljubnem $v$ in hodimo po še neporabljenih povezavah. Ko pridemo v vozlišče $u \ne v$, smo pri njem porabili liho mnogo povezav, stopnja pa je soda, zato lahko nadaljujemo. Obstanemo lahko le v $v$: dobimo sklenjen sprehod $W$ brez ponovljenih povezav. Če $W$ porabi vse povezave, smo končali. Sicer odstranimo povezave iz $W$; vse stopnje ostanejo sode. Ker je $G$ povezan, ima neka komponenta preostanka s povezavami skupno vozlišče $u$ z $W$. Po indukcijski predpostavki ima ta komponenta Eulerjev obhod, ki ga v $u$ vrinemo v $W$. Tako obdelamo vse komponente. $\square$

Za (b) dodamo novo povezavo med obe lihi vozlišči (če že obstaja, dodamo novo vozlišče, povezano z obema), uporabimo (a) in dodano povezavo spet odstranimo.

:::premisli
Ali ima tloris iz uvoda Eulerjev obhod? In ali je kakšen tloris, kjer je natanko eno vozlišče lihe stopnje?
---
Obhoda ni, ker imata $B$ in $D$ liho stopnjo $3$. Obstaja pa Eulerjev sprehod od $B$ do $D$. Natanko eno liho vozlišče je nemogoče: po lemi o rokovanju je lihih vozlišč vedno sodo mnogo. Majina trditev je torej napačna, povezanost ni dovolj.
:::

**4. Hamiltonovi grafi.** **Hamiltonov cikel** gre skozi vsako *vozlišče* natanko enkrat; graf s takim ciklom je **Hamiltonov**. Tloris je Hamiltonov: $A, B, D, E, C, A$. Čeprav sta pojma podobna, za Hamiltonove grafe ni preprostega pogoja, kot so sode stopnje. Iskanje Hamiltonovega cikla je algoritmično težak problem, Eulerjev obhod pa najdemo hitro. Uporabljamo zadostne in nujne pogoje.

**Izrek (Dirac).** Če ima graf $n \ge 3$ vozlišč in je $\deg(v) \ge \frac{n}{2}$ za vsako vozlišče $v$, je Hamiltonov.

**Izrek (nujni pogoj).** Če je $G$ Hamiltonov in iz njega odstranimo $k \ge 1$ vozlišč, ima preostanek največ $k$ komponent.

**Dokaz.** Hamiltonov cikel z odstranitvijo $k$ vozlišč razpade na največ $k$ lokov, vsak lok je povezan, in vsako preostalo vozlišče leži na enem od lokov. $\square$

Posledica: $K_{p,q}$ s $p < q$ ni Hamiltonov. Odstranimo $p$ vozlišč manjše strani in ostane $q > p$ osamljenih vozlišč. Cikel v dvodelnem grafu namreč izmenjuje strani, zato zahteva $p = q$.

**5. Drevesa.** Zapiši ogljikovo verigo propana, butana in izobutana kot graf, kjer so vozlišča le ogljikovi atomi: $3$ vozlišča in $2$ povezavi, $4$ in $3$, $4$ in $3$. V nobenem ni cikla, vsi so povezani, povezav je vedno ena manj kot vozlišč.

**Definicija.** **Drevo** je povezan graf brez ciklov. **List** je vozlišče stopnje $1$.

**Izrek.** Za graf $G$ z $n$ vozlišči so enakovredne trditve:
(i) $G$ je drevo;
(ii) med poljubnima vozliščema obstaja natanko ena pot;
(iii) $G$ je povezan in ima $n - 1$ povezav;
(iv) $G$ nima ciklov in ima $n - 1$ povezav.

**Lema.** Vsako drevo z $n \ge 2$ vozlišči ima vsaj dva lista.

**Dokaz.** Vzemimo najdaljšo pot $P = v_0 v_1 \ldots v_k$; ker je drevo povezano in ima vsaj eno povezavo, je $k \ge 1$. Če bi imel $v_0$ še soseda $w \ne v_1$, bi bil $w$ bodisi zunaj $P$ (in bi bila pot $w v_0 \ldots v_k$ daljša) bodisi na $P$ (in bi nastal cikel). Oboje je nemogoče, zato je $\deg(v_0) = 1$; enako za $v_k$. $\square$

**Dokaz, da ima drevo $n - 1$ povezav** (indukcija po $n$). Za $n = 1$ je povezav $0$. Pri $n \ge 2$ odstranimo list in njegovo povezavo; ostane povezan graf brez ciklov, torej drevo z $n - 1$ vozlišči, ki ima po indukciji $n - 2$ povezav. Prvotno drevo jih ima $n - 1$. $\square$

**6. Barvanje.** Nekateri pari zdravil ne smejo teči v istem terminu. V **grafu konfliktov** vsakemu zdravilu priredimo termin tako, da sosedi dobijo različne.

**Definicija.** **Barvanje** grafa s $k$ barvami je preslikava $c\colon V \to \{1, \ldots, k\}$, pri kateri za vsako povezavo $uv$ velja $c(u) \ne c(v)$. **Kromatično število** $\chi(G)$ je najmanjši tak $k$.

Hitre vrednosti: $\chi(K_n) = n$; $\chi(C_n) = 2$ pri sodem $n$ in $3$ pri lihem $n$. Graf je **dvodelen**, če ima $\chi(G) \le 2$.

**Izrek.** Graf je dvodelen natanko tedaj, ko nima cikla lihe dolžine.

Smer »dvodelen ⇒ brez lihih ciklov« je kratka: barvi se vzdolž cikla izmenjujeta, zato se po lihem številu korakov ne moreta ujeti z začetno.

**Izrek (požrešno barvanje).** Za vsak graf velja $\chi(G) \le \Delta + 1$.

**Dokaz.** Vozlišča obiščemo v poljubnem vrstnem redu in vsakemu damo najmanjšo barvo, ki je ne uporablja noben že pobarvan sosed. Sosedov je največ $\Delta$, zato je med barvami $1, \ldots, \Delta + 1$ vsaj ena prosta. $\square$

Spodnjo mejo da podgraf, ki zahteva veliko barv: $K_r$ zahteva $r$ barv, lih cikel $3$.

:::premisli
Graf ima trikotnik in $\Delta = 5$. Kaj iz tega lahko zagotovo poveš o $\chi(G)$?
---
Velja $3 \le \chi(G) \le 6$. Trikotnik zahteva $3$ barve, požrešno barvanje ne potrebuje več kot $\Delta + 1 = 6$. Natančno vrednost dobiš šele s konkretnim barvanjem in dokazom, da manj barv ne gre.
:::

## Rešeni primeri

### Primer 1: interakcije zdravil

Bolnik jemlje $7$ zdravil. Farmacevtka nariše graf, kjer povezava pomeni znano medsebojno interakcijo. Stopnje so $4, 3, 3, 2, 2, 1, 1$. (a) Koliko je interakcij? (b) Ali je mogoče, da bi pri $5$ zdravilih vsako imelo interakcijo z natanko $3$ drugimi?

**Podatki:** $n = 7$, stopnje $4, 3, 3, 2, 2, 1, 1$; (b) $n = 5$, vse stopnje $3$
**Iščemo:** število povezav $m$; obstoj grafa v (b)

:::formula
lema o rokovanju: $\sum_{v} \deg(v) = 2m$
:::

**Rešitev:**

1. Vsota stopenj: $4 + 3 + 3 + 2 + 2 + 1 + 1 = 16$.
2. Iz leme sledi $m = 16 : 2 = 8$.
3. (b) Vsota stopenj bi bila $5 \cdot 3 = 15$, kar je liho, lema pa zahteva sodo vsoto.
4. Odgovor: interakcij je $8$ (od največ $\binom{7}{2} = 21$ možnih); pri (b) takega grafa ni.

### Primer 2: robot v bolnišnici

Tloris s prostori $A, \ldots, E$ in hodniki $AB$, $AC$, $BC$, $BD$, $CD$, $CE$, $DE$ (slika v razlagi). Polnilnica je v $A$. (a) Ali lahko robot prevozi vsak hodnik natanko enkrat in se vrne v $A$? (b) Če ne, koliko hodnikov mora prevoziti najmanj, da vse razkuži in se vrne? Zapiši tak obhod.

**Podatki:** $7$ hodnikov; stopnje $A{:}\,2$, $B{:}\,3$, $C{:}\,4$, $D{:}\,3$, $E{:}\,2$; začetek in konec v $A$
**Iščemo:** obstoj Eulerjevega obhoda; najkrajši obhod, ki uporabi vse hodnike

:::formula
Euler: obhod $\iff$ vse stopnje sode; sprehod od $u$ do $w$ $\iff$ liha sta le $u$ in $w$
:::

**Rešitev:**

1. Lihi sta $B$ in $D$, zato Eulerjevega obhoda ni (a).
2. Obstaja pa Eulerjev sprehod od $B$ do $D$, npr. $B, A, C, B, D, C, E, D$, ki porabi vseh $7$ hodnikov.
3. Za obhod iz $A$ mora robot nekatere hodnike ponoviti. Ponovljen hodnik deluje kot dodatna povezava; dodane povezave morajo $B$ in $D$ narediti sodi, ostalih stopenj pa ne smejo pokvariti. Najceneje je ponoviti najkrajšo pot med $B$ in $D$, to je hodnik $BD$ (dolžina $1$).
4. Z dvojnim $BD$ so stopnje $2, 4, 4, 4, 2$, vse sode, in graf je povezan, zato obhod obstaja: $A, B, D, B, C, D, E, C, A$.
5. Odgovor: (a) ne; (b) robot prevozi najmanj $7 + 1 = 8$ hodnikov, npr. po zgornjem obhodu.

### Primer 3: termini infuzij

Na oddelku je $7$ zdravil $Z_1, \ldots, Z_7$. V istem terminu ne smeta teči zdravili, ki tvorita par: $Z_1Z_2$, $Z_2Z_3$, $Z_3Z_4$, $Z_4Z_5$, $Z_5Z_1$, $Z_6$ z vsakim od $Z_1, \ldots, Z_5$ ter $Z_7Z_6$ in $Z_7Z_3$. Določi najmanjše število terminov in to dokaži.

**Podatki:** $7$ vozlišč, $12$ povezav: cikel $Z_1 \ldots Z_5$, $Z_6$ sosed vseh petih, $Z_7$ sosed $Z_6$ in $Z_3$
**Iščemo:** $\chi(G)$ z dokazom spodnje in zgornje meje

:::formula
$\chi(C_5) = 3$; vozlišče, sosednje vsem vozliščem podgrafa $H$, zahteva barvo več: $\chi \ge \chi(H) + 1$
:::

**Rešitev:**

1. *Spodnja meja.* $Z_1, \ldots, Z_5$ tvorijo cikel dolžine $5$, ki je lih, zato zahteva vsaj $3$ barve.
2. $Z_6$ je sosed vseh petih vozlišč cikla, zato ne sme imeti nobene od njihovih barv. Potrebna je četrta: $\chi(G) \ge 4$.
3. Pozor: graf nima $K_4$. Cikel $C_5$ nima trikotnika, $Z_7$ pa ima le dva soseda, zato iskanje $K_4$ meje $4$ ne bi pokazalo.
4. *Zgornja meja.* Barvanje: $Z_1 \mapsto 1$, $Z_2 \mapsto 2$, $Z_3 \mapsto 1$, $Z_4 \mapsto 2$, $Z_5 \mapsto 3$, $Z_6 \mapsto 4$. $Z_7$ ima soseda z barvama $4$ ($Z_6$) in $1$ ($Z_3$), zato dobi barvo $2$.
5. Preverimo vseh $12$ povezav: na ciklu so pari barv $(1,2)$, $(2,1)$, $(1,2)$, $(2,3)$, $(3,1)$, $Z_6$ ima barvo $4$, ki je drugje ni, $Z_7Z_3$ je $(2,1)$. Barvanje je pravilno.
6. Odgovor: $\chi(G) = 4$; potrebni so natanko $4$ termini, npr. $\{Z_1, Z_3\}$, $\{Z_2, Z_4, Z_7\}$, $\{Z_5\}$, $\{Z_6\}$.

### Primer 4: zdaj ti

Alkan $\mathrm{C_6H_{14}}$ zapišemo kot graf: vozlišča so vsi atomi, povezave so kovalentne vezi (vse enojne). Ogljik ima stopnjo $4$, vodik stopnjo $1$. Pokaži, da je ta graf drevo.

**Podatki:** $6$ vozlišč stopnje $4$, $14$ vozlišč stopnje $1$; molekula je povezana
**Iščemo:** število povezav in dokaz, da je graf drevo

:::formula
lema o rokovanju; povezan graf z $n - 1$ povezavami je drevo
:::

**Rešitev:**

1. Vozlišč je $n = 6 + 14 = 20$.
2. Vsota stopenj: $6 \cdot 4 + 14 \cdot 1 = 38$, zato $m = 19$.
3. Dokončaj sam: kaj sledi iz $m$ in povezanosti?

:::premisli
Zakaj je graf drevo in kaj to pove o izomerih heksana?
---
$m = 19 = n - 1$ in graf je povezan, zato je po izreku o drevesih drevo (karakterizacija (iii)). Vsak izomer z isto formulo je zato drevo; izomeri se razlikujejo le po obliki ogljikovega drevesa ($5$ izomerov heksana).
:::

## Pogoste napake

- **»Povezan graf je Eulerjev.«** To je Majina napaka. Povezanost je nujna, odločajo pa sode stopnje. Preden iščeš obhod, preštej liha vozlišča.
- **Eulerjev in Hamiltonov zamenjana.** Euler prehodi vsako *povezavo*, Hamilton obišče vsako *vozlišče*. Tloris iz primera 2 je Hamiltonov, a ne Eulerjev; $C_n$ je oboje. Za Hamiltonove grafe sodost stopenj ne pove ničesar.
- **»Brez $K_4$ so dovolj $3$ barve.«** Primer 3 kaže, da ne. Poln podgraf da le spodnjo mejo; višjo mejo lahko povzroči tudi lih cikel z vozliščem, ki je sosed vseh.
- **Zgornja meja brez spodnje.** Kdor najde barvanje s $4$ barvami, je dokazal le $\chi \le 4$. Za enakost moraš utemeljiti še, zakaj $3$ barve ne zadoščajo.
- **Drevo z $n$ povezavami.** Pri štetju vezi v molekulah ali kablov v omrežju se hitro zmotiš za ena. Drevo ima vedno $n - 1$ povezav; vsaka dodatna povezava ustvari cikel.

## Povzetek

- Graf $G = (V, E)$: vozlišča in povezave; $\sum \deg(v) = 2m$, lihih vozlišč je sodo mnogo.
- Pot nima ponovljenih vozlišč, cikel je sklenjena pot dolžine vsaj $3$; povezan graf ima pot med vsakima vozliščema.
- Euler: povezan graf ima obhod natanko tedaj, ko so vse stopnje sode; sprehod (nesklenjen) natanko tedaj, ko sta lihi natanko dve.
- Hamilton: ni preprostega pogoja; Dirac ($\deg(v) \ge n/2$) je zadosten, »odstranimo $k$ vozlišč → največ $k$ komponent« je nujen.
- Drevo: povezan brez ciklov, $n - 1$ povezav, natanko ena pot med vozliščema, vsaj dva lista.
- Barvanje: $\chi(G) \le \Delta + 1$; dvodelen natanko tedaj, ko ni lihih ciklov; za $\chi$ vedno dokaži spodnjo in zgornjo mejo.

## Za izpit

Znati moraš povedati:

- definicije grafa, stopnje, sprehoda, poti, cikla, povezanosti, drevesa, barvanja in kromatičnega števila;
- lemo o rokovanju z dokazom in posledico o lihih vozliščih;
- Eulerjev izrek (obhod in sprehod) s pogoji in dokazom obeh smeri;
- Diracov izrek (izjava) in nujni pogoj za Hamiltonove grafe z dokazom;
- karakterizacije dreves, dokaz o dveh listih in o $n - 1$ povezavah;
- $\chi(G) \le \Delta + 1$ z dokazom in karakterizacijo dvodelnih grafov.

### Naloga 1

Bolnišnica ima $3$ laboratorije $L_1, L_2, L_3$ in $4$ oddelke $O_1, \ldots, O_4$. Vsak laboratorij je s cevno pošto povezan z vsakim oddelkom, drugih cevi ni. (a) Koliko je cevi in kakšne so stopnje? (b) Ali obstaja obhod, ki obišče vsako postajo natanko enkrat? Ali obstaja tak sprehod? (c) Vzdrževalec mora pregledati vse cevi in se vrniti na začetek. Najmanj koliko odsekov prevozi, če sme ponavljati le obstoječe cevi? (d) Namesto ponavljanja zgradimo nove cevi med oddelki. Koliko jih je najmanj treba, da obhod brez ponavljanja obstaja, in kolikšno je potem kromatično število grafa?

**Rešitev:**

1. Graf je $K_{3,4}$: $3 \cdot 4 = 12$ cevi. Stopnja vsakega laboratorija je $4$, vsakega oddelka $3$ (vsota $12 + 12 = 24 = 2 \cdot 12$).
2. (b) Cikel v dvodelnem grafu izmenjuje strani, zato bi potreboval enako vozlišč na obeh straneh; $3 \ne 4$, zato Hamiltonovega cikla ni. Hamiltonova pot obstaja: $O_1, L_1, O_2, L_2, O_3, L_3, O_4$.
3. (c) Lihe stopnje imajo vsi štirje oddelki, zato Eulerjevega obhoda (niti sprehoda) ni. Ponovljeni odseki morajo vsakemu oddelku dodati liho število obiskov in laboratorijem sodo; ponovitve tvorijo poti, ki pare oddelkov povezujejo.
4. Dva oddelka sta na razdalji $2$ (prek kateregakoli laboratorija), zato je najceneje združiti oddelke v dva para in ponoviti dve poti dolžine $2$, npr. $O_1L_1O_2$ in $O_3L_1O_4$: $4$ ponovitve. Manj ne gre, ker vsak od štirih lihih oddelkov potrebuje vsaj eno ponovljeno cev, vsaka ponovljena cev pa ima le eno krajišče med oddelki.
5. Po ponovitvi so stopnje oddelkov $4$, laboratorija $L_1$ pa $4 + 4 = 8$; vse sode, graf povezan, obhod obstaja. Skupaj $12 + 4 = 16$ odsekov.
6. (d) Vsaka nova cev med oddelkoma popravi dva liha oddelka, zato sta potrebni vsaj $2$, npr. $O_1O_2$ in $O_3O_4$. Potem so vse stopnje $4$ in obhod dolžine $14$ obstaja.
7. Nova cev ustvari trikotnik $O_1, O_2, L_1$, ki je lih cikel, zato $\chi \ge 3$. Barvanje: laboratoriji $1$, $O_1, O_3 \mapsto 2$, $O_2, O_4 \mapsto 3$ je pravilno.
8. Odgovor: (a) $12$ cevi, stopnji $4$ in $3$; (b) cikla ni, pot obstaja; (c) najmanj $16$ odsekov; (d) $2$ novi cevi, nato $\chi = 3$ (prej $2$).

### Naloga 2

Natančno navedi Eulerjev izrek za obhode in ga dokaži. Utemelji, ali drži: »Če ima povezan graf natanko dve vozlišči lihe stopnje, ima Eulerjev sprehod med njima.«

**Rešitev:**

1. Izrek: povezan graf z vsaj eno povezavo ima Eulerjev obhod natanko tedaj, ko so vse stopnje sode.
2. Nujnost: obhod pri vsakem prehodu skozi vozlišče porabi par povezav (prihod, odhod), tudi začetek in konec tvorita par; stopnje so sode.
3. Zadostnost z indukcijo po številu povezav: hodimo po neporabljenih povezavah iz $v$; zaradi sodih stopenj se ustavimo le v $v$ in dobimo sklenjen sprehod $W$. Preostanek ima sode stopnje; vsaka njegova komponenta s povezavami ima zaradi povezanosti $G$ skupno vozlišče z $W$ in po indukciji svoj obhod, ki ga vrinemo v $W$.
4. Trditev drži. Naj bosta $u, w$ lihi. Dodamo novo vozlišče $x$ s povezavama $xu$ in $xw$. Novi graf je povezan in ima vse stopnje sode ($u$, $w$ dobita $+1$, $\deg(x) = 2$), zato ima Eulerjev obhod.
5. Obhod prečka $x$ kot $\ldots, u, x, w, \ldots$; ko odstranimo $x$, ostane Eulerjev sprehod iz $w$ do $u$ po vseh povezavah prvotnega grafa.

### Naloga 3

Dokaži, da ima vsako drevo z $n \ge 2$ vozlišči vsaj dva lista in natanko $n - 1$ povezav. Drevo ima $2$ vozlišči stopnje $4$, $3$ vozlišča stopnje $3$, $1$ vozlišče stopnje $2$, ostala so listi. Koliko je listov?

**Rešitev:**

1. Lista: krajišči najdaljše poti ne moreta imeti drugega soseda (daljša pot ali cikel), zato imata stopnjo $1$.
2. Povezave: indukcija po $n$, odstranitev lista ohrani drevo z $n - 1$ vozlišči in odstrani eno povezavo.
3. Naj bo $L$ število listov. Vozlišč je $n = 6 + L$, povezav $n - 1 = 5 + L$.
4. Vsota stopenj: $2 \cdot 4 + 3 \cdot 3 + 1 \cdot 2 + L = 19 + L$.
5. Lema o rokovanju: $19 + L = 2(5 + L)$, torej $L = 9$.
6. Odgovor: drevo ima $9$ listov in $15$ vozlišč.

## Drugače: Uporaba v stroki

- **Sestavljanje genoma.** Sekvenator prebere milijone kratkih odsekov DNK. Če so odseki vozlišča, iščemo Hamiltonovo pot, kar je računsko prezahtevno. Sodobni programi zato zgradijo de Bruijnov graf, kjer so odseki *povezave*, in iščejo Eulerjev sprehod, ki ga najdejo v linearnem času.
- **Razporejanje.** Termini infuzij, sobe za izolacijo, urnik izpitov in frekvence radijskih oddajnikov so barvanja grafa konfliktov.
- **Kemijska informatika.** Molekule so grafi; ogljikovo ogrodje alkanov je drevo. Opisniki molekul, npr. Wienerjev indeks (vsota razdalj med vsemi pari atomov), pomagajo napovedati vrelišče in biološko aktivnost zdravilnih učinkovin.

## Drugače: Korak za korakom s številkami

**Požrešno barvanje je odvisno od vrstnega reda.** Pot $a - b - c - d$ ima $\chi = 2$.

1. Vrstni red $a, b, c, d$: $a \mapsto 1$, $b \mapsto 2$, $c \mapsto 1$, $d \mapsto 2$. Dve barvi.
2. Vrstni red $a, d, b, c$: $a \mapsto 1$; $d$ nima pobarvanih sosedov, $d \mapsto 1$; $b$ ima soseda $a$ ($1$), $b \mapsto 2$; $c$ ima soseda $b$ ($2$) in $d$ ($1$), $c \mapsto 3$. Tri barve.
3. Obe vrednosti sta $\le \Delta + 1 = 3$, kot pravi izrek, a požrešno barvanje ne da nujno $\chi$.

**Gradnja Eulerjevega obhoda** po dokazu, za tloris z dvojnim $BD$:

1. Iz $A$ hodimo: $A, B, D, C, A$. Obstanemo v $A$; porabljeni so $AB$, $BD$, $DC$, $CA$.
2. Ostanejo $BC$, drugi $BD$, $CE$, $DE$. Vozlišče $B$ je na $W$ in ima neporabljeno povezavo.
3. Iz $B$: $B, C, E, D, B$, sklenjen sprehod.
4. Vrinemo ga v $W$ na mestu $B$: $A, B, C, E, D, B, D, C, A$. Vseh $8$ povezav, obhod je končan.

## Drugače: Bolj natančno

**Dvodelni grafi (König).** Druga smer izreka: naj povezan $G$ nima lihih ciklov. Izberi vozlišče $r$ in pobarvaj $v$ z $1$, če je razdalja $d(r, v)$ soda, sicer z $2$. Če bi bila sosednja $u$, $v$ enake barve, bi najkrajši poti iz $r$ do $u$ in do $v$ skupaj s povezavo $uv$ dali sklenjen sprehod lihe dolžine, ta pa vsebuje lih cikel. Za nepovezan graf barvamo vsako komponento posebej.

**Izrek o drevesih (skica dokaza).** (i)⇔(ii): dve različni poti med istima vozliščema dasta cikel. (i)⇒(iii), (iv): dokaz z listi zgoraj. (iii)⇒(i): povezan graf ima vpeto drevo z $n - 1$ povezavami, ki je zato kar $G$. (iv)⇒(i): graf brez ciklov s $c$ komponentami ima $n - c$ povezav, torej $c = 1$.

**Močnejši izreki.** *Ore:* če je $\deg(u) + \deg(v) \ge n$ za vsak par nesosednjih vozlišč, je graf Hamiltonov (Dirac je poseben primer). *Brooks:* povezan graf, ki ni poln graf ali lih cikel, ima $\chi \le \Delta$. *Izrek o štirih barvah:* vsak ravninski graf ima $\chi \le 4$; dokaz iz leta 1976 je prvi večji izrek, dokazan z računalnikom. *Zahtevnost:* Eulerjev obhod najdemo v času $O(m)$, odločanje o Hamiltonovem ciklu in o $\chi \le 3$ je NP-polno.

## Preveri se

? Kaj velja za vsako drevo z $n \ge 2$ vozlišči?
- Ima natanko dva lista.
~ Natanko dva lista ima le pot; zvezda $K_{1,n-1}$ ima $n - 1$ listov.
+ Med poljubnima vozliščema obstaja natanko ena pot.
- Vsako vozlišče ima stopnjo največ $2$.
~ To velja le za pot; v drevesu ima lahko vozlišče poljubno stopnjo, npr. središče zvezde.
- Ima $n$ povezav.
~ Ena povezava preveč: drevo z $n$ vozlišči ima $n - 1$ povezav, vsaka dodatna ustvari cikel.
> To je ena od karakterizacij drevesa; druga pot bi skupaj s prvo dala cikel.

? Graf ima $12$ povezav in vsa vozlišča imajo stopnjo $3$. Koliko ima vozlišč?
- $4$
~ Delil si $12$ s $3$ in pozabil, da vsaka povezava šteje pri dveh vozliščih.
+ $8$
- $12$
~ Število vozlišč ni enako številu povezav; uporabi lemo o rokovanju.
- $36$
~ To je $12 \cdot 3$, ne vsota stopenj, ki je $2 \cdot 12$.
> $3n = 2 \cdot 12 = 24$, torej $n = 8$ (npr. kocka).

? Študent piše: »Graf vsebuje $C_5$ in vozlišče, sosednje vsem petim. Ker v grafu ni $K_4$, so $3$ barve dovolj, zato $\chi = 3$.« Kje je napaka?
- Napake ni.
~ Vozlišče, sosednje vsem vozliščem lihega cikla, potrebuje četrto barvo; primer 3 kaže, da je $\chi = 4$.
- Napaka je, ker $C_5$ zahteva le $2$ barvi.
~ $C_5$ je lih cikel in zahteva $3$ barve; le sodi cikli zadoščajo z dvema.
+ Odsotnost $K_4$ ne zagotavlja $\chi \le 3$; ta graf zahteva $4$ barve.
> $K_r$ v grafu da spodnjo mejo $\chi \ge r$, obrat pa ne velja. Cikel potrebuje $3$ barve, skupni sosed četrto.

? Primerjaj $C_5$ in $K_4$. Kaj drži?
+ $C_5$ ima Eulerjev obhod, $K_4$ nima niti Eulerjevega sprehoda.
- Oba imata Eulerjev obhod, ker sta povezana.
~ Povezanost ni dovolj: v $K_4$ imajo vsa štiri vozlišča liho stopnjo $3$.
- $K_4$ ima Eulerjev sprehod, $C_5$ pa ne.
~ V $C_5$ so vse stopnje $2$, zato je Eulerjev; $K_4$ ima štiri liha vozlišča, sprehod dovoli največ dve.
> V $C_5$ so vse stopnje sode. V $K_4$ so štiri liha vozlišča; Eulerjev sprehod dopušča $0$ ali $2$.

? Lekarna pripravlja $5$ zdravil. Konflikti tvorijo cikel: $1$–$2$, $2$–$3$, $3$–$4$, $4$–$5$, $5$–$1$. Najmanj koliko ločenih terminov priprave potrebuje?
- $2$
~ Dve barvi zadoščata le za sodi cikel; pri lihem se izmenjevanje ne izide.
+ $3$
- $5$
~ Vsako zdravilo v svojem terminu deluje, a ni najmanj: nesosednja zdravila smejo v isti termin.
- $4$
~ Graf nima vozlišča, ki bi bil sosed vseh ostalih; tri barve zadoščajo, npr. $1, 2, 1, 2, 3$.
> $\chi(C_5) = 3$: lih cikel ni dvodelen, barvanje $1, 2, 1, 2, 3$ pa pokaže, da tri zadoščajo.

:::simboli
G | graf | G = (V, E) | | 
V | množica vozlišč | | |
E | množica povezav | | | povezava je par $\{u, v\}$
n | število vozlišč | | |
m | število povezav | | |
\chi | kromatično število | | | najmanjše število barv
K_n | poln graf na $n$ vozliščih | | | $\binom{n}{2}$ povezav
C_n | cikel na $n$ vozliščih | | |
C_5 | cikel na petih vozliščih | | | lih cikel, $\chi = 3$
K_{p,q} | poln dvodelni graf | | | strani s $p$ in $q$ vozlišči
v, u, w | vozlišča | | |
H | podgraf | | |
c | barvanje | | | preslikava $V \to \{1, \ldots, k\}$
k | število barv oz. odstranjenih vozlišč | | |
:::
