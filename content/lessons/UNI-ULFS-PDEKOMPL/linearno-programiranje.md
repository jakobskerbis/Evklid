---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Za dobrodelno stojnico na fakulteti pečeš pladnje pice in pladnje jabolčne pite. Na voljo imaš $6\,\mathrm{kg}$ moke in pečico za $10$ ur. Pladenj pice porabi $1\,\mathrm{kg}$ moke in $2$ uri pečice ter prinese $5$ € dobička. Pladenj pite porabi $1\,\mathrm{kg}$ moke in $1$ uro pečice ter prinese $3$ €. Koliko česa spečeš?

Prvi refleks: pica prinese več, torej same pice. Pečica dopusti $5$ pladnjev, to je $25$ €. Same pite: moke je za $6$ pladnjev, to je $18$ €. Mešanica $4$ pic in $2$ pit pa porabi vso moko in ves čas pečice ter prinese $26$ €. Zmaga mešanica, ki je na prvi pogled nihče ne bi izbral.

Pri dveh izdelkih lahko ugibaš. Pri tridesetih jedeh, dvajsetih surovinah in treh izmenah kuharjev ne več. Linearno programiranje to reši sistematično. Pri optimizaciji z vezmi si iskal ekstrem pri enačbah z Lagrangeevimi multiplikatorji. Tu so vezi **neenačbe**, funkcija pa je linearna, zato ima njen gradient povsod isto smer in nikjer ni enak nič. Optimum mora zato ležati na robu.

## Razlaga

**1. Model.** Spremenljivki sta $x$ (pladnji pice) in $y$ (pladnji pite). Želimo največji dobiček, to je **namenska funkcija**
$$z = 5x + 3y \to \max.$$
Omejitve:
$$x + y \le 6 \ \ \text{(moka)}, \qquad 2x + y \le 10 \ \ \text{(pečica)}, \qquad x, y \ge 0.$$
**Linearni program** je iskanje največje ali najmanjše vrednosti linearne funkcije pri linearnih neenačbah ali enačbah. Produkti spremenljivk in potence niso dovoljeni.

*Hiter preizkus:* ali je pogoj $xy \le 8$ dovoljen? (Ne, $xy$ ni linearen.)

**2. Dopustno območje.** Vsaka neenačba določa polravnino. Presek vseh je **dopustno območje**, tu konveksen štirikotnik. Njegova oglišča so presečišča mejnih premic:

| oglišče | kje | $z$ |
|---|---|---|
| $(0, 0)$ | izhodišče | $0$ |
| $(5, 0)$ | pečica in $y = 0$ | $25$ |
| $(4, 2)$ | moka in pečica | $26$ |
| $(0, 6)$ | moka in $x = 0$ | $18$ |

*Hiter preizkus:* je točka $(5, 1)$ dopustna? (Ne: $2 \cdot 5 + 1 = 11$, pečica ima le $10$ ur.)

**3. Grafična rešitev.** Množice $5x + 3y = c$ so vzporedne premice, **nivojnice**. Z večanjem $c$ se premikajo v smeri gradienta $(5, 3)$, desno navzgor. Iščemo zadnjo nivojnico, ki se še dotakne območja. Pri konveksnem mnogokotniku je ta dotik vedno v oglišču, ali pa vzdolž celega roba, če je nivojnica z robom vzporedna. Tu je to $(4, 2)$ z $z = 26$.

:::premisli
Dobiček pite zraste s $3$ € na $5$ €, pica ostane pri $5$ €. Kje bo zdaj optimum? Napovej, preden računaš.
---
Nivojnice $5x + 5y = c$ so vzporedne z robom moke $x + y = 6$. Optimalen je cel rob od $(4, 2)$ do $(0, 6)$, povsod $z = 30$. Optimum ni več en sam, oglišči pa sta še vedno med optimalnimi.
:::

**4. Simpleksna metoda.** Pri več kot treh spremenljivkah risanje odpade. Simpleksna metoda posnema sliko algebrsko: začne v oglišču in hodi po robovih do sosednjega oglišča z večjim $z$, dokler boljšega soseda ni.

Neenačbe spremenimo v enačbe z **dopolnilnimi spremenljivkami** (koliko moke oziroma časa ostane):
$$s_1 = 6 - x - y, \qquad s_2 = 10 - 2x - y, \qquad s_1, s_2 \ge 0.$$
Spremenljivke na levi so **bazne**, tiste na desni so **nebazne** in v trenutnem oglišču enake $0$. Začnemo v $(0, 0)$: $s_1 = 6$, $s_2 = 10$, $z = 0$. Tak zapis imenujemo slovar. Simpleksna tabela vsebuje iste koeficiente, le zložene v vrstice.

Korak metode ima dve pravili:

- **vstop**: v vrstici $z$ izberi nebazno spremenljivko s pozitivnim koeficientom (običajno največjim); njeno večanje poveča $z$;
- **izstop**: večaj jo, dokler katera bazna ne pade na $0$. Odloča **najmanjši količnik**: za vsako bazno spremenljivko deli njen prosti člen s koeficientom, s katerim jo vstopna zmanjšuje.

Ko imajo vse nebazne spremenljivke v vrstici $z$ koeficient $\le 0$, smo v optimumu.

*Hiter preizkus:* zakaj najmanjši količnik? (Pri večjem bi neka bazna spremenljivka postala negativna in bi zapustili dopustno območje.)

**5. Dualnost.** Slaščičarna bi rada odkupila vso tvojo moko in čas pečice. Ponudi ceno $u$ za kilogram moke in $v$ za uro pečice. Prodaš le, če surovine za vsak izdelek prinesejo vsaj toliko kot izdelek sam:
$$u + 2v \ge 5 \ \ \text{(pica)}, \qquad u + v \ge 3 \ \ \text{(pita)}, \qquad u, v \ge 0.$$
Slaščičarna plača čim manj: $w = 6u + 10v \to \min$. To je **dualni problem**. Max postane min, $\le$ postane $\ge$, desne strani in koeficienti funkcije zamenjajo vlogi, matrika omejitev se transponira.

Za vsak dopusten par velja $z \le w$ (**šibka dualnost**). V optimumu sta enaka (**krepka dualnost**). Optimalna $u$ in $v$ sta **senčni ceni**: za koliko zraste največji dobiček, če dobiš enoto surovine več. To je natanko vloga Lagrangeevega multiplikatorja.

:::premisli
Če bi imel $100\,\mathrm{kg}$ moke in še vedno $10$ ur pečice, ali bi bila senčna cena moke še vedno pozitivna?
---
Ne. Pečica bi dopustila največ $5$ pic oziroma $10$ pit, moke pa bi porabil največ $10\,\mathrm{kg}$. Ostala bi neporabljena, zato dodatni kilogram ne prinese nič: $u = 0$. Senčna cena je pozitivna le pri surovini, ki jo porabiš do konca.
:::

*Hiter preizkus:* koliko dualnih omejitev ima problem s $30$ jedmi? (Trideset, ena za vsako primalno spremenljivko.)

## Rešeni primeri

### Primer 1 (lažji): najcenejša malica za smučišče

Za dan na smučišču kupiš kosmiče in jogurt. Porcija kosmičev ima $4\,\mathrm{g}$ beljakovin in $200\,\mathrm{kcal}$ ter stane $0{,}50$ €. Porcija jogurta ima $12\,\mathrm{g}$ beljakovin in $100\,\mathrm{kcal}$ ter stane $1$ €. Potrebuješ vsaj $36\,\mathrm{g}$ beljakovin in vsaj $800\,\mathrm{kcal}$. Koliko česa kupiš, da plačaš najmanj?

**Podatki:** kosmiči ($4\,\mathrm{g}$; $200\,\mathrm{kcal}$; $0{,}50$ €), jogurt ($12\,\mathrm{g}$; $100\,\mathrm{kcal}$; $1$ €), potreba ($\ge 36\,\mathrm{g}$; $\ge 800\,\mathrm{kcal}$)
**Iščemo:** število porcij $x$ (kosmiči), $y$ (jogurt) in najmanjšo ceno $c$

:::formula
$c = 0{,}5x + y \to \min$ pri $4x + 12y \ge 36$, $200x + 100y \ge 800$, $x, y \ge 0$; optimum v oglišču
:::

**Rešitev:**

1. Omejitvi poenostavimo (delimo s $4$ in $100$): $x + 3y \ge 9$ in $2x + y \ge 8$.
2. Dopustno je vse nad obema premicama. Območje je neomejeno, a cena je pri $x, y \ge 0$ navzdol omejena z $0$, zato minimum obstaja.
3. Oglišča: $(0, 8)$ na osi $y$, $(9, 0)$ na osi $x$ in presečišče premic.
4. Presečišče: iz $x = 9 - 3y$ sledi $18 - 6y + y = 8$, torej $y = 2$ in $x = 3$.
5. Cene v ogliščih: $(0, 8)$ da $8$ €, $(9, 0)$ da $0{,}5 \cdot 9 = 4{,}5$ €, $(3, 2)$ da $0{,}5 \cdot 3 + 2 = 3{,}5$ €.
6. Kontrola: $4 \cdot 3 + 12 \cdot 2 = 36$ in $200 \cdot 3 + 100 \cdot 2 = 800$, obe potrebi točno pokriti.
7. Odgovor: kupiš $3$ porcije kosmičev in $2$ jogurta za $3{,}50$ €.

### Primer 2: simpleks za stojnico

Problem s stojnice reši s simpleksno metodo: $z = 5x + 3y \to \max$ pri $x + y \le 6$ (moka v kg), $2x + y \le 10$ (pečica v urah), $x, y \ge 0$.

**Podatki:** dobiček pice $5$ €, pite $3$ €; moka $6\,\mathrm{kg}$, pečica $10$ ur; pica porabi $1\,\mathrm{kg}$ in $2$ uri, pita $1\,\mathrm{kg}$ in $1$ uro
**Iščemo:** optimalni $x$, $y$ in največji $z$

:::formula
Slovar: $s_1 = 6 - x - y$, $s_2 = 10 - 2x - y$, $z = 5x + 3y$. Vstopi spremenljivka s pozitivnim koeficientom v $z$; izstopi tista z najmanjšim količnikom.
:::

**Rešitev:**

1. Vstopi $x$ (koeficient $5$). Meji: $s_1 \ge 0$ da $x \le 6$, $s_2 \ge 0$ da $x \le 5$. Manjša je $5$, zato izstopi $s_2$.
2. Iz enačbe za $s_2$: $x = 5 - \tfrac12 y - \tfrac12 s_2$.
3. Vstavimo: $s_1 = 1 - \tfrac12 y + \tfrac12 s_2$ in $z = 25 + \tfrac12 y - \tfrac52 s_2$. Smo v oglišču $(5, 0)$ z $z = 25$.
4. Koeficient pri $y$ je še pozitiven, zato vstopi $y$. Meji: $s_1$ da $y \le 2$, $x$ da $y \le 10$. Izstopi $s_1$.
5. Iz $s_1$: $y = 2 - 2s_1 + s_2$; nato $x = 4 + s_1 - s_2$.
6. Vrstica $z$: $z = 25 + \tfrac12(2 - 2s_1 + s_2) - \tfrac52 s_2 = 26 - s_1 - 2s_2$.
7. Oba koeficienta sta negativna: optimum. Nebazni $s_1 = s_2 = 0$ dasta $x = 4$, $y = 2$.
8. Odgovor: spečeš $4$ pladnje pice in $2$ pladnja pite za $26$ € dobička. Metoda je šla po robovih $(0, 0) \to (5, 0) \to (4, 2)$.

### Primer 3 (težji): se splača kupiti?

Sosed ponudi dodatni kilogram moke za $1{,}50$ € ali dodatno uro v svoji pečici prav tako za $1{,}50$ €. Kaj se ti splača kupiti?

**Podatki:** problem iz primera 2; optimum $x = 4$, $y = 2$, $z = 26$ €; cena moke $1{,}50$ €/kg, cena ure pečice $1{,}50$ €/h
**Iščemo:** senčni ceni $u$, $v$ in odločitev za vsako ponudbo

:::formula
Dual: $w = 6u + 10v \to \min$ pri $u + 2v \ge 5$, $u + v \ge 3$, $u, v \ge 0$. Če je $x > 0$ (oziroma $y > 0$), je pripadajoča dualna omejitev izpolnjena z enačajem.
:::

**Rešitev:**

1. V optimumu sta $x = 4 > 0$ in $y = 2 > 0$, zato sta obe dualni omejitvi enakosti: $u + 2v = 5$, $u + v = 3$.
2. Odštejemo: $v = 2$, nato $u = 1$. Isto pokaže vrstica $z = 26 - s_1 - 2s_2$ iz primera 2: senčni ceni sta koeficienta pri $s_1$ in $s_2$ z obrnjenim predznakom.
3. Kontrola krepke dualnosti: $6 \cdot 1 + 10 \cdot 2 = 26$, enako kot $z$.
4. Moka: dodatni kilogram prinese $1$ €, stane $1{,}50$ €. Ne splača se.
5. Zadnji korak naredi sam: ali se splača ura pečice?

:::premisli
Ali se splača ura pečice? Odloči, nato preveri tako, da problem rešiš znova z $11$ urami.
---
Ura prinese $v = 2$ € in stane $1{,}50$ €, torej se splača, čisti dobiček je $0{,}50$ €. Kontrola: pri $2x + y \le 11$ in $x + y \le 6$ je novo oglišče $(5, 1)$ in $z = 25 + 3 = 28 = 26 + 2$.
:::

## Pogoste napake

- **»Vzemi najdonosnejši izdelek.«** Same pice dajo $25$ € namesto $26$ €. Napaka je v tem, da gledaš dobiček na pladenj, ne pa porabe surovine, ki je zmanjka prva. Popravek: primerjaj oglišča ali uporabi simpleks.
- **Napačen izstop.** Kdor pri vstopu $x$ izbere večji količnik ($x = 6$), dobi $s_2 = 10 - 12 = -2$, torej neizvedljiv načrt. Popravek: vedno najmanjši količnik, in le v vrsticah, kjer večanje vstopne spremenljivke bazno res zmanjšuje.
- **Prezgodnja ustavitev.** Pri $z = 25 + \tfrac12 y - \tfrac52 s_2$ se zdi, da smo končali, ker je oglišče lepo. A koeficient pri $y$ je pozitiven, zato je še boljše oglišče. Popravek: pri maksimizaciji končaš šele, ko so vsi koeficienti nebaznih $\le 0$.
- **Dual brez transponiranja.** Napačno je pisati $u + v \ge 5$, tj. prepisati prvo vrstico. Pravilno: ena dualna omejitev za vsako primalno spremenljivko, koeficienti iz njenega *stolpca*: za pico $u + 2v \ge 5$.
- **Senčna cena velja neomejeno.** Dodatnih $100\,\mathrm{kg}$ moke ne prinese $100$ €. Senčna cena $1$ € velja le, dokler se ne zamenja aktivna omejitev; tu do $10\,\mathrm{kg}$ moke, ko pite zasedejo vso pečico.

## Povzetek

- Linearni program: linearna funkcija $\to$ max ali min pri linearnih omejitvah; dopustno območje je konveksen polieder.
- Če optimum obstaja, je dosežen v oglišču (lahko tudi na celem robu).
- Grafična rešitev (2 spremenljivki): nariši polravnine, poišči oglišča, premikaj nivojnico ali primerjaj $z$ v ogliščih.
- Simpleks: dopolnilne spremenljivke, vstop s pozitivnim koeficientom v $z$, izstop z najmanjšim količnikom, konec, ko so vsi koeficienti $\le 0$.
- Dual problema $\max c^\top x$, $Ax \le b$, $x \ge 0$ je $\min b^\top y$, $A^\top y \ge c$, $y \ge 0$; $z \le w$, v optimumu $z = w$.
- Optimalne dualne spremenljivke so senčne cene virov (kot Lagrangeevi multiplikatorji); neporabljen vir ima senčno ceno $0$.

## Za izpit

Znati moraš povedati:
- definicijo linearnega programa, dopustnega območja in nivojnice ter utemeljitev, zakaj je optimum, če obstaja, dosežen v oglišču (ali na celem robu);
- potek simpleksne metode: dopolnilne spremenljivke, bazne in nebazne spremenljivke, pravilo vstopa, pravilo izstopa z najmanjšim količnikom (z utemeljitvijo) in pogoj za optimum;
- kako problemu $\max c^\top x$, $Ax \le b$, $x \ge 0$ zapišeš dual $\min b^\top y$, $A^\top y \ge c$, $y \ge 0$;
- izreka o šibki in krepki dualnosti z vsemi predpostavkami ter dokaz šibke dualnosti;
- pogoje komplementarnosti in kako z njimi iz rešitve enega problema dobiš rešitev drugega;
- pomen senčne cene in zakaj velja le, dokler se ne zamenja aktivna omejitev.

### Naloga 1

Delavnica izdeluje serije prirobnic ($x_1$), gredi ($x_2$) in puš ($x_3$). Serija prirobnic zasede stružnico $3$ ure, rezkalni stroj $1$ uro in brusilni stroj $1$ uro. Serija gredi zasede stružnico $3$ ure, rezkalni stroj $3$ ure in brusilni stroj $4$ ure. Serija puš zasede vsak stroj po $1$ uro. Na teden je prostih $14$ ur stružnice, $8$ ur rezkalnega stroja in $16$ ur brusilnega stroja. Serija prirobnic prinese $400$ €, serija gredi $500$ € in serija puš $200$ € dobička. Dovoljeni so tudi deli serij. (a) S simpleksno metodo (vstopi spremenljivka z največjim koeficientom) poišči načrt z največjim dobičkom. (b) Zapiši dualni problem, iz končnega slovarja preberi senčne cene in preveri krepko dualnost. (c) Sosednje podjetje ponuja dodatno uro stružnice za $80$ € in dodatno uro brusilnega stroja za $10$ €. Kaj se splača? Najmanj kolikšen bi moral biti dobiček serije gredi, da bi jih bilo smiselno izdelovati?

**Rešitev:**

1. Dobiček merimo v stotih evrih: $z = 4x_1 + 5x_2 + 2x_3 \to \max$. Začetni slovar: $s_1 = 14 - 3x_1 - 3x_2 - x_3$, $s_2 = 8 - x_1 - 3x_2 - x_3$, $s_3 = 16 - x_1 - 4x_2 - x_3$.
2. Vstopi $x_2$ (koeficient $5$). Količniki: $\tfrac{14}{3}$ pri $s_1$, $\tfrac{8}{3}$ pri $s_2$, $\tfrac{16}{4} = 4$ pri $s_3$. Najmanjši je $\tfrac83$, izstopi $s_2$: $x_2 = \tfrac83 - \tfrac13 x_1 - \tfrac13 x_3 - \tfrac13 s_2$.
3. Vstavimo: $s_1 = 6 - 2x_1 + s_2$, $s_3 = \tfrac{16}{3} + \tfrac13 x_1 + \tfrac13 x_3 + \tfrac43 s_2$, $z = \tfrac{40}{3} + \tfrac73 x_1 + \tfrac13 x_3 - \tfrac53 s_2$.
4. Vstopi $x_1$ (koeficient $\tfrac73$). Zmanjšuje le $s_1$ in $x_2$: količnika sta $\tfrac62 = 3$ in $\tfrac{8/3}{1/3} = 8$. Izstopi $s_1$: $x_1 = 3 - \tfrac12 s_1 + \tfrac12 s_2$.
5. Vstavimo: $x_2 = \tfrac53 - \tfrac13 x_3 + \tfrac16 s_1 - \tfrac12 s_2$, $s_3 = \tfrac{19}{3} + \tfrac13 x_3 - \tfrac16 s_1 + \tfrac32 s_2$, $z = \tfrac{61}{3} + \tfrac13 x_3 - \tfrac76 s_1 - \tfrac12 s_2$.
6. Koeficient pri $x_3$ je še pozitiven, zato vstopi $x_3$. Zmanjšuje le $x_2$, količnik je $\tfrac{5/3}{1/3} = 5$. Izstopi $x_2$: $x_3 = 5 - 3x_2 + \tfrac12 s_1 - \tfrac32 s_2$.
7. Končni slovar: $x_1 = 3 - \tfrac12 s_1 + \tfrac12 s_2$, $x_3 = 5 - 3x_2 + \tfrac12 s_1 - \tfrac32 s_2$, $s_3 = 8 - x_2 + s_2$, $z = 22 - x_2 - s_1 - s_2$. Vsi koeficienti v vrstici $z$ so negativni: optimum.
8. Odgovor (a): $x_1 = 3$, $x_2 = 0$, $x_3 = 5$, $z = 22$, torej $2200$ € na teden. Kontrola: stružnica $3 \cdot 3 + 5 = 14$, rezkalni stroj $3 + 5 = 8$, brusilni stroj $3 + 5 = 8 \le 16$ (ostane $s_3 = 8$ ur). Gredi so vstopile v prvem koraku in v tretjem spet izstopile.
9. Dual: $w = 14y_1 + 8y_2 + 16y_3 \to \min$ pri $3y_1 + y_2 + y_3 \ge 4$, $3y_1 + 3y_2 + 4y_3 \ge 5$, $y_1 + y_2 + y_3 \ge 2$, $y_1, y_2, y_3 \ge 0$.
10. Senčne cene so koeficienti pri $s_1$, $s_2$, $s_3$ v vrstici $z$ z obrnjenim predznakom: $y_1 = 1$, $y_2 = 1$, $y_3 = 0$ ($s_3$ je bazna, brusilni stroj ni polno zaseden). Dualne omejitve: $3 + 1 + 0 = 4$, $3 + 3 + 0 = 6 \ge 5$, $1 + 1 + 0 = 2$.
11. Odgovor (b): $w = 14 \cdot 1 + 8 \cdot 1 + 16 \cdot 0 = 22 = z$, krepka dualnost velja. Tudi komplementarnost se izide: enakost je pri prirobnicah in pušah ($x_1, x_3 > 0$), pri gredeh je presežek $1$ in $x_2 = 0$.
12. Ura stružnice prinese $y_1 = 1$, torej $100$ €, in stane $80$ €: splača se, čisti dobiček je $20$ €. Kontrola s $15$ urami: v slovarju postavimo $s_1 = -1$ in dobimo $x_1 = 3{,}5$, $x_3 = 4{,}5$, $z = 4 \cdot 3{,}5 + 2 \cdot 4{,}5 = 23$.
13. Ura brusilnega stroja prinese $y_3 = 0$ €, saj $8$ ur že zdaj ostaja neporabljenih. Ne splača se pri nobeni ceni.
14. Odgovor (c): kupiš uro stružnice, ure brusilnega stroja ne. Serija gredi porabi vire, vredne $3y_1 + 3y_2 + 4y_3 = 6$, torej $600$ €. Pri manjšem dobičku gredi ostanejo zunaj načrta; pri natanko $600$ € je koeficient pri $x_2$ v vrstici $z$ enak $0$ in se optimum z gredmi ne spremeni, šele nad $600$ € ga gredi povečajo.

### Naloga 2

Natančno navedi izrek o šibki dualnosti za par $\max c^\top x$, $Ax \le b$, $x \ge 0$ in $\min b^\top y$, $A^\top y \ge c$, $y \ge 0$ ter ga dokaži. Izpelji posledico: če za dopustna $x^*$ in $y^*$ velja $c^\top x^* = b^\top y^*$, sta oba optimalna. S posledico brez simpleksne metode utemelji, da je $(4, 2)$ optimum stojnice: $z = 5x + 3y \to \max$ pri $x + y \le 6$, $2x + y \le 10$, $x, y \ge 0$.

**Rešitev:**

1. Izrek: če je $x$ dopusten za primal ($Ax \le b$, $x \ge 0$) in $y$ dopusten za dual ($A^\top y \ge c$, $y \ge 0$), potem je $c^\top x \le b^\top y$.
2. Dokaz, prvi del: ker je $c \le A^\top y$ po komponentah in $x \ge 0$, je $c^\top x \le (A^\top y)^\top x = y^\top A x$. Nenegativnost $x$ je nujna, sicer bi se neenakost pri množenju obrnila.
3. Dokaz, drugi del: ker je $Ax \le b$ po komponentah in $y \ge 0$, je $y^\top A x \le y^\top b = b^\top y$. Skupaj $c^\top x \le b^\top y$.
4. Posledica: naj bo $x$ poljuben dopusten vektor primala. Po izreku je $c^\top x \le b^\top y^* = c^\top x^*$, zato nobena dopustna točka ni boljša od $x^*$. Enako je za vsak dopusten $y$: $b^\top y \ge c^\top x^* = b^\top y^*$, zato je $y^*$ optimalen za dual.
5. Stojnica: $(4, 2)$ je dopustna, ker je $4 + 2 = 6 \le 6$ in $2 \cdot 4 + 2 = 10 \le 10$; $z = 5 \cdot 4 + 3 \cdot 2 = 26$.
6. Dual je $w = 6u + 10v \to \min$ pri $u + 2v \ge 5$, $u + v \ge 3$, $u, v \ge 0$. Par $u = 1$, $v = 2$ je dopusten: $1 + 2 \cdot 2 = 5$ in $1 + 2 = 3$; $w = 6 \cdot 1 + 10 \cdot 2 = 26$.
7. Odgovor: ker je $z = w = 26$ pri dopustnih točkah, je po posledici $(4, 2)$ optimum primala in $(1, 2)$ optimum duala. Dopustna dualna točka z enako vrednostjo je potrdilo optimalnosti, ki ga preveriš brez ponovnega reševanja.

### Naloga 3

Livarna doda talini vreče treh dodatkov. Vreča dodatka A vsebuje $2\,\mathrm{kg}$ mangana in $2\,\mathrm{kg}$ silicija ter stane $10$ €. Vreča dodatka B vsebuje $2\,\mathrm{kg}$ mangana in $3\,\mathrm{kg}$ silicija ter stane $11$ €. Vreča dodatka C vsebuje $1\,\mathrm{kg}$ mangana in $3\,\mathrm{kg}$ silicija ter stane $10$ €. Talina potrebuje vsaj $16\,\mathrm{kg}$ mangana in vsaj $18\,\mathrm{kg}$ silicija. Problem ima tri spremenljivke, zato ga ne moreš narisati. Zapiši dual, ga reši grafično in s komplementarnostjo določi najcenejšo mešanico.

**Rešitev:**

1. Primal: $c = 10x_1 + 11x_2 + 10x_3 \to \min$ pri $2x_1 + 2x_2 + x_3 \ge 16$ (mangan), $2x_1 + 3x_2 + 3x_3 \ge 18$ (silicij), $x_1, x_2, x_3 \ge 0$.
2. Dual ima dve spremenljivki, $u$ (vrednost kilograma mangana) in $v$ (vrednost kilograma silicija): $w = 16u + 18v \to \max$ pri $2u + 2v \le 10$ (A), $2u + 3v \le 11$ (B), $u + 3v \le 10$ (C), $u, v \ge 0$.
3. Oglišča dopustnega območja duala: $(0, 0)$, $(5, 0)$ (A in $v = 0$), $(4, 1)$ (A in B), $(1, 3)$ (B in C), $(0, \tfrac{10}{3})$ (C in $u = 0$). Presečišče A in B: odštejemo in dobimo $v = 1$, nato $u = 4$. Presečišče B in C: odštejemo in dobimo $u = 1$, nato $v = 3$.
4. Vrednosti $w$: $0$; $16 \cdot 5 = 80$; $16 \cdot 4 + 18 \cdot 1 = 82$; $16 \cdot 1 + 18 \cdot 3 = 70$; $18 \cdot \tfrac{10}{3} = 60$. Največja je $82$ v točki $u = 4$, $v = 1$.
5. Komplementarnost, dualne omejitve: A in B sta enakosti, pri C pa je $4 + 3 \cdot 1 = 7 < 10$. Vreča C stane več, kot sta vredna njen mangan in silicij, zato je $x_3 = 0$.
6. Komplementarnost, primalne omejitve: $u > 0$ in $v > 0$, zato sta obe primalni omejitvi enakosti: $2x_1 + 2x_2 = 16$ in $2x_1 + 3x_2 = 18$.
7. Odštejemo: $x_2 = 2$, nato $x_1 = 6$.
8. Kontrola: cena $10 \cdot 6 + 11 \cdot 2 = 82$, enako kot $w$, zato je po krepki dualnosti rešitev optimalna.
9. Odgovor: livarna doda $6$ vreč dodatka A in $2$ vreči dodatka B za $82$ €, dodatka C ne kupi. Kilogram več zahtevanega mangana bi mešanico podražil za $4$ €, kilogram več silicija za $1$ €.

## Drugače: Na sliki

Nariši os $x$ (pice) in os $y$ (pite). Premica moke gre od $(6, 0)$ do $(0, 6)$, premica pečice od $(5, 0)$ do $(0, 10)$. Dopustno je območje pod obema premicama v prvem kvadrantu: štirikotnik z oglišči $(0, 0)$, $(5, 0)$, $(4, 2)$, $(0, 6)$.

Iz izhodišča nariši puščico gradienta $(5, 3)$. Nivojnice so pravokotne nanjo. Drsi z ravnilom v smeri puščice: zadnja točka, ki je še v štirikotniku, je $(4, 2)$.

Simpleks na tej sliki ne drsi po notranjosti, ampak skače po obodu. Iz $(0, 0)$ gre vzdolž osi $x$ do $(5, 0)$, kjer ga ustavi pečica. Nato gre po robu pečice navzgor do $(4, 2)$, kjer ga ustavi še moka. Vsak skok je en vstop in en izstop.

## Drugače: Bolj natančno

Standardna oblika: $\max c^\top x$ pri $Ax \le b$, $x \ge 0$. Z dopolnilnimi spremenljivkami $s = b - Ax \ge 0$ dobimo sistem enačb. **Bazna dopustna rešitev** (izberemo $m$ baznih stolpcev, ostale spremenljivke so $0$) je natanko oglišče poliedra. Teh je končno mnogo, zato simpleks konča, če preprečimo ciklanje (npr. z Blandovim pravilom: med kandidati vedno izberi najmanjši indeks).

**Šibka dualnost.** Za dopustna $x$ in $y$ velja
$$c^\top x \le (A^\top y)^\top x = y^\top (A x) \le y^\top b.$$
Prva neenakost sledi iz $A^\top y \ge c$ in $x \ge 0$, druga iz $Ax \le b$ in $y \ge 0$.

**Krepka dualnost.** Če ima primal končen optimum, ga ima tudi dual in vrednosti sta enaki. **Komplementarnost:** v optimumu je $x_j > 0 \Rightarrow$ $j$-ta dualna omejitev je enakost, in $y_i > 0 \Rightarrow$ $i$-ta primalna omejitev je enakost. To smo uporabili v primeru 3.

Minimizacijo prevedemo v $\max(-c^\top x)$. Omejitve $\ge$ in enačbe zahtevajo začetno dopustno bazo, ki jo poiščemo z dvofazno metodo ali metodo velikega $M$.

## Preveri se

? Pri maksimizaciji je vrstica $z$ zapisana z nebaznimi spremenljivkami. Kateri zapis pove, da je trenutno oglišče optimalno?
- $z = 25 + \tfrac12 y - \tfrac52 s_2$
~ Koeficient pri $y$ je pozitiven: če $y$ povečaš, $z$ zraste. Oglišče še ni optimalno.
+ $z = 26 - s_1 - 2s_2$
- $z = 0 + 5x + 3y$
~ To je začetno oglišče $(0, 0)$. Oba koeficienta sta pozitivna, zato se da še veliko pridobiti.
> Vsi koeficienti nebaznih so $\le 0$, zato bi vsako povečanje nebazne spremenljivke $z$ le zmanjšalo.

? Zakaj je optimum linearnega programa, če obstaja, vedno dosežen v oglišču?
+ Ker so nivojnice linearne funkcije vzporedne premice; zadnja, ki se dotakne konveksnega območja, ga zadene v oglišču ali vzdolž celega roba.
- Ker je v oglišču gradient $z$ enak $0$.
~ Gradient linearne funkcije je stalen, tu $(5, 3)$, in nikjer ni $0$. Zato notranjega ekstrema ni.
- Ker so v oglišču vse omejitve izpolnjene z enačajem.
~ V oglišču v ravnini sta aktivni le dve omejitvi, ne vse. Razlog je v obliki nivojnic, ne v številu aktivnih omejitev.
> Linearna funkcija na konveksnem mnogokotniku doseže največjo vrednost na meji, natančneje v oglišču.

? Restavracija z LP načrtuje jedilnik. Omejitve so meso, zelenjava in število kuharjev. Senčna cena omejitve kuharjev je $0$. Kaj to pomeni?
- Kuharji restavracije ne stanejo nič.
~ Senčna cena ni plača. Pove, za koliko bi zrasel optimum pri eni enoti vira več.
+ Dodatni kuhar dobička ne poveča, praviloma zato, ker v optimalnem načrtu kuharji niso vsi polno zasedeni.
- Brez kuharjev bi bil dobiček enak.
~ Senčna cena velja za majhne spremembe okoli optimuma. Brez kuharjev bi postala omejitev aktivna in dobiček bi padel.
> Komplementarnost: dualna spremenljivka je pozitivna le pri omejitvi, ki je izpolnjena z enačajem.

? Pri stojnici (optimum $26$ €, senčna cena moke $1$ €/kg) dobiš $6{,}5\,\mathrm{kg}$ moke namesto $6\,\mathrm{kg}$. Približno koliko je novi največji dobiček?
- $26$ €
~ Moka je v optimumu porabljena do konca, zato vsak dodatni kilogram nekaj prinese.
- $28{,}50$ €
~ Tako bi bilo, če bi pol kilograma šlo v pol pladnja pice po $5$ €. Pečica je polna, zato več pice pomeni manj pite.
+ $26{,}50$ €
> $26 + 0{,}5 \cdot 1 = 26{,}5$ €. Novi optimum je $x = 3{,}5$, $y = 3$: $17{,}5 + 9 = 26{,}5$ €.

? Dobiček pite ostane $3$ €. Najmanj kolikšen mora biti dobiček pladnja pice, da je peka samih pic ($5$ pladnjev) optimalna?
- $5$ €
~ Pri $5$ € same pice dajo $25$ €, mešanica $(4, 2)$ pa $26$ €.
- $3$ €
~ Pri enakem dobičku je pica slabša, saj porabi dvakrat več pečice kot pita.
+ $6$ €
> Pri dobičku $p$ je $(5, 0)$ optimalno, ko je nivojnica vsaj tako strma kot rob pečice: $\frac{p}{3} \ge 2$, torej $p \ge 6$. Pri $p = 6$: $(5, 0)$ in $(4, 2)$ dasta oba $30$ €.

:::simboli
z | vrednost namenske funkcije (dobiček) | z = 5x + 3y | | iščemo maksimum
x | število pladnjev pice | | | v splošnem zapisu vektor spremenljivk; pri prehrani porcije kosmičev
y | število pladnjev pite | | | v dualu vektor dualnih spremenljivk; pri prehrani porcije jogurta
s_1 | dopolnilna spremenljivka (neporabljena moka) | s_1 = 6 - x - y | | s₁ ≥ 0
s_2 | dopolnilna spremenljivka (neizkoriščen čas pečice) | s_2 = 10 - 2x - y | | s₂ ≥ 0
u | cena kilograma moke (dualna spremenljivka) | | | pri livarni vrednost kilograma mangana
v | cena ure pečice (dualna spremenljivka) | | | pri livarni vrednost kilograma silicija
w | vrednost dualne namenske funkcije | w = 6u + 10v | | z ≤ w, v optimumu z = w
c | koeficienti namenske funkcije (vektor) | | | pri prehrani cena obrokov c = 0,5x + y
A | matrika koeficientov omejitev
b | vektor desnih strani omejitev
:::
