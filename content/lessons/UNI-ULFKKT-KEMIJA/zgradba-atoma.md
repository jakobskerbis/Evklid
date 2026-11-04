---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Bunsen in Kirchhoff sta v 19. stoletju opazila, da vsak element v plamenu seva svetlobo le pri nekaj značilnih valovnih dolžinah; po neznanih črtah v spektru sta odkrila cezij in rubidij. Metoda je delovala, nihče pa ni znal povedati, zakaj so črte prav tam. Bohr je pokazal, da črte vodika sledijo iz kvantiziranih energij elektrona, kvantna mehanika pa je razlago razširila na vse atome. Isti pojav vidiš nad stadionom ob odprtju velikega tekmovanja: rdečo barvo ognjemeta da stroncij, zeleno barij, rumeno natrij. Na njem temelji tudi atomska absorpcijska spektrometrija, s katero določajo kovine v vodi in krvi. **Razporeditev elektronov** pa razloži še, zakaj je natrij reaktiven, neon pa skoraj ne in zakaj je kisik paramagneten.

Na koncu boš znal:

- kaj so **orbitale** in kako izgledajo,
- kaj pomenijo **kvantna števila** $n$, $l$, $m_l$ in $m_s$ ter katere kombinacije so dovoljene,
- zapisati **elektronsko konfiguracijo** atomov in ionov po izgradnem načelu, Paulijevem načelu in Hundovem pravilu,
- razložiti izjeme (krom, baker) in konfiguracije ionov prehodnih kovin.

## Razlaga

### Najprej en atom: kisik

Kisik ima $Z = 8$, torej $8$ elektronov. Dva gresta v $1s$, dva v $2s$, preostali štirje v tri orbitale $2p$: $1s^2\,2s^2\,2p^4$. V $2p$ se trije elektroni najprej razporedijo vsak v svojo orbitalo, četrti se pari z enim od njih, zato ostaneta dva nesparjena. Ta zapis skriva vsa pravila spodaj: zakaj so orbitale prav $1s$, $2s$, $2p$ (kvantna števila), zakaj sta v orbitali največ dva elektrona (Paulijevo načelo), zakaj ta vrstni red (izgradno načelo) in zakaj se elektroni $2p$ ne parijo takoj (Hundovo pravilo). Razdelki 1–9 to splošno utemeljijo.

### Splošno: od delcev do pravil

**1. Delci v atomu.** Atom ima pozitivno **jedro** iz protonov in nevtronov (skupaj nukleoni) ter negativni elektronski oblak. **Vrstno število** $Z$ je število protonov, **masno število** $A$ število nukleonov. Atome z enakim $Z$ in različnim $A$ imenujemo **izotopi**, npr. $^{12}\mathrm{C}$ in $^{14}\mathrm{C}$. Jedro ima premer okoli $10^{-15}\,\mathrm{m}$, atom okoli $10^{-10}\,\mathrm{m}$: skoraj vsa masa je v jedru, skoraj vsa prostornina pa pripada elektronom.

**2. Kvantizacija energije.** Atomi sevajo in absorbirajo svetlobo le pri določenih valovnih dolžinah (črtasti spekter). Energija elektrona v atomu je torej **kvantizirana**. Za vodikov atom velja

$$E_n = -\frac{2{,}179 \cdot 10^{-18}\,\mathrm{J}}{n^2}, \qquad n = 1, 2, 3, \dots$$

Pri prehodu elektrona z višjega na nižji nivo se izseva foton z energijo $\Delta E = h\nu = hc/\lambda$, kjer je $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$ Planckova konstanta.

**3. Valovna narava elektrona.** Elektron ima tudi valovne lastnosti (de Brogliejeva valovna dolžina $\lambda = h/(mv)$). Po **Heisenbergovem načelu nedoločenosti** mu ne moremo hkrati natančno določiti lege in gibalne količine, zato o tirnicah (kot pri Bohru) ne moremo govoriti. Stanje elektrona opisuje **valovna funkcija** $\psi$, rešitev Schrödingerjeve enačbe. Kvadrat $|\psi|^2$ je **gostota verjetnosti**, da elektron najdemo na danem mestu.

**4. Orbitala** je valovna funkcija enega elektrona v atomu; v praksi tako imenujemo tudi območje prostora, kjer je elektron z veliko verjetnostjo (npr. $90\,\%$). Vsako orbitalo določajo tri kvantna števila $n$, $l$, $m_l$.

**5. Kvantna števila.**

| Kvantno število | Oznaka | Dovoljene vrednosti | Kaj določa |
|---|---|---|---|
| glavno | $n$ | $1, 2, 3, \dots$ | lupino, velikost in (pretežno) energijo |
| stransko (orbitalno) | $l$ | $0, 1, \dots, n-1$ | podlupino in obliko orbitale |
| magnetno | $m_l$ | $-l, \dots, 0, \dots, +l$ | usmerjenost orbitale v prostoru |
| spinsko | $m_s$ | $+\tfrac12$ ali $-\tfrac12$ | spin elektrona |

Podlupine označujemo s črkami: $l = 0$ je $s$, $l = 1$ je $p$, $l = 2$ je $d$, $l = 3$ je $f$. Podlupina z danim $l$ ima $2l + 1$ orbital: ena $s$, tri $p$, pet $d$, sedem $f$. Lupina z glavnim kvantnim številom $n$ ima $n^2$ orbital in največ $2n^2$ elektronov.

:::premisli
Preden pogledaš odgovor, izračunaj iz tabele: koliko orbital ima lupina $n = 4$ in koliko elektronov sprejme?
---
$l$ je $0$, $1$, $2$ ali $3$ (podlupine $4s$, $4p$, $4d$, $4f$), torej $1 + 3 + 5 + 7 = 16 = 4^2$ orbital in največ $2 \cdot 16 = 32$ elektronov.
:::

**6. Oblike orbital.** Orbitale $s$ so kroglasto simetrične. Orbitale $p$ ($p_x$, $p_y$, $p_z$) imajo obliko dvojnega balona vzdolž ene osi, z vozelno ravnino skozi jedro. Orbitale $d$ imajo večinoma štiri »liste« (štirilistna deteljica), $d_{z^2}$ pa dva lista in obroč. Število **vozlov** (ploskev, kjer je $\psi = 0$) je $n - 1$: od tega je $l$ kotnih in $n - l - 1$ radialnih. Orbitala $2s$ ima en radialni vozel, $3p$ en radialni in en kotni.

**7. Pravila za razporejanje elektronov.**

- **Paulijevo izključitveno načelo:** v atomu nimata dva elektrona vseh štirih kvantnih števil enakih. V eni orbitali sta torej največ dva elektrona z nasprotnima spinoma.
- **Izgradno načelo:** elektroni zasedajo orbitale od najnižje energije navzgor. V večelektronskem atomu je energija podlupine odvisna od $n$ in $l$; vrstni red zasedanja da približno pravilo $n + l$ (nižji $n + l$ prej, pri enakem $n + l$ nižji $n$ prej):

$$1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s < 4d < 5p < 6s < 4f < 5d < 6p$$

- **Hundovo pravilo:** v podlupini z več enakovrednimi orbitalami elektroni najprej zasedejo vsako orbitalo posamezno z vzporednimi spini, šele nato se parijo.

:::premisli
Ogljik ima $1s^2\,2s^2\,2p^2$. Napovej: sta oba elektrona $2p$ v isti orbitali ali v dveh? Koliko nesparjenih elektronov ima ogljik?
---
V dveh različnih orbitalah z vzporednima spinoma, ker se v ločenih orbitalah manj odbijata (Hundovo pravilo). Ogljik ima zato $2$ nesparjena elektrona.
:::

**8. Zapis konfiguracije.** Za kisik iz uvodnega primera ($Z = 8$): $1s^2\,2s^2\,2p^4$. Okrajšano zapišemo jedro kot konfiguracijo prejšnjega žlahtnega plina: železo je $[\mathrm{Ar}]\,3d^6\,4s^2$. Z orbitalnim diagramom (škatlice s puščicami) pokažemo tudi spine:

```
O:  1s [↑↓]  2s [↑↓]  2p [↑↓][↑ ][↑ ]    -> 2 nesparjena elektrona
```

**Valenčni elektroni** so elektroni v zunanji lupini (pri prehodnih kovinah še elektroni $(n-1)d$). Atom z nesparjenimi elektroni je **paramagneten** (privlači ga magnetno polje), atom z vsemi sparjenimi pa **diamagneten**.

**9. Izjeme in ioni.** Polzasedena ($d^5$) in povsem zasedena ($d^{10}$) podlupina sta posebej stabilni, zato ima krom konfiguracijo $[\mathrm{Ar}]\,3d^5\,4s^1$ (ne $3d^4\,4s^2$) in baker $[\mathrm{Ar}]\,3d^{10}\,4s^1$. Pri tvorbi kationov prehodnih kovin atom **najprej odda elektrone $4s$**, šele nato $3d$: $\mathrm{Fe^{2+}}$ je $[\mathrm{Ar}]\,3d^6$, ne $[\mathrm{Ar}]\,3d^4\,4s^2$. Pri anionih elektrone dodajamo v prvo nezasedeno orbitalo: $\mathrm{Cl^-}$ je $[\mathrm{Ne}]\,3s^2\,3p^6$, izoelektronski z argonom.

## Rešeni primeri

### Primer 1 (lažji)

Zapiši elektronsko konfiguracijo žvepla ($Z = 16$), nariši orbitalni diagram valenčne lupine in določi število nesparjenih elektronov. Ali je atom žvepla paramagneten?

**Podatki:** žveplo, $Z = 16$ (atom ima $16$ elektronov)
**Iščemo:** elektronsko konfiguracijo, število nesparjenih elektronov, magnetne lastnosti

:::formula
Izgradno načelo $1s < 2s < 2p < 3s < 3p$, Paulijevo načelo (največ $2$ elektrona v orbitali), Hundovo pravilo.
:::

**Rešitev:**

1. Razporejamo $16$ elektronov od najnižje energije navzgor, podlupino $s$ napolnimo z $2$, $p$ s $6$ elektroni (Paulijevo načelo): $1s^2$ ($2$), $2s^2$ ($4$), $2p^6$ ($10$), $3s^2$ ($12$), $3p^4$ ($16$).
2. Konfiguracija: $1s^2\,2s^2\,2p^6\,3s^2\,3p^4$ oziroma $[\mathrm{Ne}]\,3s^2\,3p^4$.
3. Po Hundovem pravilu prvi trije elektroni $3p$ zasedejo vsak svojo orbitalo, četrti se pari s prvim: $3p\ [\uparrow\downarrow][\uparrow\ ][\uparrow\ ]$.
4. Nesparjena sta $2$ elektrona, zato je atom paramagneten.
5. Odgovor: žveplo ima konfiguracijo $[\mathrm{Ne}]\,3s^2\,3p^4$, šest valenčnih elektronov, od tega dva nesparjena; atom je paramagneten.

### Primer 2

Za lupino z $n = 3$ naštej dovoljene vrednosti $l$ in $m_l$, število orbital in največje število elektronov. Ali je kombinacija kvantnih števil $(n, l, m_l, m_s) = (3, 2, -3, +\tfrac12)$ dovoljena?

**Podatki:** $n = 3$; kombinacija $n = 3$, $l = 2$, $m_l = -3$, $m_s = +\tfrac12$
**Iščemo:** dovoljene $l$ in $m_l$, število orbital, največje število elektronov, dovoljenost kombinacije

:::formula
$l = 0, \dots, n-1$; $\quad m_l = -l, \dots, +l$ ($2l + 1$ vrednosti); $\quad$ število orbital $n^2$, največ $2n^2$ elektronov
:::

**Rešitev:**

1. $l$ je lahko $0$, $1$ ali $2$ (podlupine $3s$, $3p$, $3d$).
2. Za $l = 0$: $m_l = 0$ (ena orbitala). Za $l = 1$: $m_l = -1, 0, +1$ (tri orbitale). Za $l = 2$: $m_l = -2, -1, 0, +1, +2$ (pet orbital).
3. Število orbital: $1 + 3 + 5 = 9 = 3^2$.
4. Elektronov je največ $2 \cdot 9 = 18 = 2 \cdot 3^2$.
5. Pri $l = 2$ je $|m_l| \le 2$, zato $m_l = -3$ ni dovoljen.
6. Odgovor: lupina $n = 3$ ima podlupine $3s$, $3p$ in $3d$ z devetimi orbitalami in prostorom za $18$ elektronov; kombinacija $(3, 2, -3, +\tfrac12)$ ni dovoljena.

### Primer 3 (težji)

Zapiši elektronske konfiguracije železa ($Z = 26$), iona $\mathrm{Fe^{2+}}$ in iona $\mathrm{Fe^{3+}}$. Koliko nesparjenih elektronov ima vsak delec? Razloži, zakaj se $\mathrm{Fe^{2+}}$ na zraku rad oksidira v $\mathrm{Fe^{3+}}$.

**Podatki:** železo, $Z = 26$; iona $\mathrm{Fe^{2+}}$ ($24$ elektronov) in $\mathrm{Fe^{3+}}$ ($23$ elektronov)
**Iščemo:** tri konfiguracije, število nesparjenih elektronov, razlago stabilnosti $\mathrm{Fe^{3+}}$

:::formula
Izgradno načelo: $\dots\,3p < 4s < 3d$. Kationi prehodnih kovin najprej oddajo elektrone $4s$. Hundovo pravilo za $5$ orbital $3d$.
:::

**Rešitev:**

1. Atom: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$, okrajšano $[\mathrm{Ar}]\,3d^6\,4s^2$ (argon ima $18$ elektronov, $18 + 2 + 6 = 26$).
2. $\mathrm{Fe^{2+}}$: odvzamemo oba elektrona $4s$, ker je pri prehodnih kovinah $4s$ nad $3d$ in se izprazni prva: $[\mathrm{Ar}]\,3d^6$.
3. $\mathrm{Fe^{3+}}$: odvzamemo še en elektron $3d$: $[\mathrm{Ar}]\,3d^5$.
4. Nesparjeni elektroni ($3d$ ima $5$ orbital): pri $d^6$ je zasedenost $[\uparrow\downarrow][\uparrow][\uparrow][\uparrow][\uparrow]$, torej $4$ nesparjeni (pri Fe in $\mathrm{Fe^{2+}}$); pri $d^5$ je vsaka orbitala zasedena z enim elektronom, torej $5$ nesparjenih.
5. Šesti elektron $d$ v $\mathrm{Fe^{2+}}$ je v orbitali z drugim elektronom, zato ga odboj med njima destabilizira; z njegovo oddajo nastane polzasedena, posebej stabilna podlupina $d^5$.
6. Odgovor: Fe $[\mathrm{Ar}]\,3d^6\,4s^2$ ($4$ nesparjeni), $\mathrm{Fe^{2+}}$ $[\mathrm{Ar}]\,3d^6$ ($4$), $\mathrm{Fe^{3+}}$ $[\mathrm{Ar}]\,3d^5$ ($5$); prehod $\mathrm{Fe^{2+}} \to \mathrm{Fe^{3+}}$ je ugoden, ker nastane polzasedena podlupina $3d^5$.

### Primer 4 – zdaj ti

Ob odprtju tekmovanja na stadionu zažari rdeč ognjemet; rdečo barvo dajo stroncijeve soli, v katerih je stroncij kot ion $\mathrm{Sr^{2+}}$. Zapiši elektronsko konfiguracijo atoma stroncija ($Z = 38$) in iona $\mathrm{Sr^{2+}}$. Koliko nesparjenih elektronov ima atom?

**Podatki:** stroncij, $Z = 38$ (atom ima $38$ elektronov); ion $\mathrm{Sr^{2+}}$ ($36$ elektronov)
**Iščemo:** konfiguraciji atoma in iona, število nesparjenih elektronov v atomu

:::formula
Izgradno načelo $\dots\,3d < 4p < 5s < 4d$ (pravilo $n + l$); kripton ima $36$ elektronov; Paulijevo načelo.
:::

**Rešitev:**

1. Do kriptona ($[\mathrm{Kr}] = 1s^2 \dots 4p^6$) je razporejenih $36$ elektronov, ostaneta $38 - 36 = 2$.
2. Za $4p$ pride na vrsto $5s$, ker ima $n + l = 5$, podlupina $4d$ pa $n + l = 6$: atom je $[\mathrm{Kr}]\,5s^2$.
3. Določi sam število nesparjenih elektronov in konfiguracijo iona, nato preveri:

:::premisli
Koliko nesparjenih elektronov ima atom Sr in kakšna je konfiguracija $\mathrm{Sr^{2+}}$?
---
Oba elektrona $5s$ sta v isti orbitali z nasprotnima spinoma, zato atom nima nesparjenih elektronov (je diamagneten). Pri nastanku iona $\mathrm{Sr^{2+}}$ atom odda prav ta dva zunanja elektrona, zato je ion $[\mathrm{Kr}]$, izoelektronski s kriptonom.
:::

## Pogoste napake

- **Ioni prehodnih kovin.** $\mathrm{Fe^{2+}}$ ni $[\mathrm{Ar}]\,3d^4\,4s^2$. Orbitala $4s$ se zapolni pred $3d$, pri ionizaciji pa se tudi prva izprazni.
- **Hundovo pravilo.** Za dušik $2p^3$ ni $[\uparrow\downarrow][\uparrow][\ ]$, ampak $[\uparrow][\uparrow][\uparrow]$ s tremi nesparjenimi elektroni.
- **Meje kvantnih števil.** $l$ je največ $n - 1$ (ni orbitale $2d$ ali $1p$), $m_l$ pa je med $-l$ in $+l$. Spinsko število ni $\pm 1$, ampak $\pm\tfrac12$.
- **Orbitala ni tirnica.** Elektron se ne giblje po »osmici« $p$-orbitale. Oblika orbitale pove, kje je verjetnost, da ga najdemo, velika.
- **Število orbital in elektronov.** Podlupina $d$ ima $5$ orbital in največ $10$ elektronov, podlupina $f$ $7$ orbital in $14$ elektronov. Ne zamenjuj števila orbital s številom elektronov.
- **Izjeme brez razloga.** Krom in baker imata en elektron $4s$, ker je $d^5$ oziroma $d^{10}$ stabilnejša. Teh izjem ne posplošuj na vse elemente; pri večini velja pravilo $n + l$.

## Povzetek

- Atom: jedro (protoni, nevtroni) in elektroni; $Z$ = število protonov, $A$ = število nukleonov; izotopi imajo enak $Z$.
- Energija elektrona je kvantizirana; za H je $E_n = -2{,}179 \cdot 10^{-18}\,\mathrm{J}/n^2$, foton ima $\Delta E = hc/\lambda$.
- Orbitala je valovna funkcija; $|\psi|^2$ je gostota verjetnosti.
- Kvantna števila: $n \ge 1$, $0 \le l \le n-1$, $-l \le m_l \le l$, $m_s = \pm\tfrac12$; podlupina ima $2l + 1$ orbital, lupina $n^2$ orbital in $2n^2$ elektronov.
- Konfiguracija: izgradno načelo ($n + l$), Paulijevo načelo, Hundovo pravilo; izjemi Cr $3d^5\,4s^1$ in Cu $3d^{10}\,4s^1$.
- Kationi prehodnih kovin najprej izgubijo elektrone $4s$.

## Drugače: Na sliki

Vrstni red zasedanja podlupin si zapomniš z diagonalnim diagramom: piši podlupine v vrstice po $n$ in jih beri po diagonalah od zgoraj desno navzdol levo.

```
1s
2s 2p
3s 3p 3d
4s 4p 4d 4f
5s 5p 5d 5f
6s 6p 6d
7s 7p

diagonale:  1s | 2s | 2p 3s | 3p 4s | 3d 4p 5s | 4d 5p 6s | 4f 5d 6p 7s
```

Energijske nivoje vodikovega atoma si predstavljaj kot lestev, katere prečke so vse gostejše navzgor:

```
 n = ∞  ---------------------  0
 n = 3  ---------------------  -2,42·10^-19 J
 n = 2  ---------------------  -5,45·10^-19 J
            ↑ absorpcija   ↓ emisija (656 nm)

 n = 1  ---------------------  -2,18·10^-18 J
```

Oblike orbital: $s$ je krogla, $p$ dvojni balon (tri med seboj pravokotne usmeritve), $d$ štirilistna deteljica (pet orbital).

## Drugače: Iz vsakdanjega življenja

**Ognjemet in plamenski test.** Natrijeve soli obarvajo plamen rumeno, litijeve in stroncijeve rdeče, bakrove zeleno-modro. V plamenu se elektroni vzbudijo na višje nivoje, pri vračanju pa izsevajo fotone z valovno dolžino, značilno za element. Isti pojav s svetilkami z natrijevimi parami daje rumeno cestno razsvetljavo.

**Atomska spektrometrija.** V laboratorijih za okolje, hrano in klinično kemijo z **atomsko absorpcijsko spektrometrijo** določajo svinec v pitni vodi ali železo v krvnem serumu. Vsak element absorbira svetlobo le pri svojih valovnih dolžinah, zato je meritev zelo selektivna.

**Barve prehodnih kovin.** Raztopine $\mathrm{Cu^{2+}}$ so modre, $\mathrm{Ni^{2+}}$ zelene, $\mathrm{Zn^{2+}}$ pa brezbarvne. Razlika je v konfiguraciji: $\mathrm{Cu^{2+}}$ ($3d^9$) ima nepopolno podlupino $d$ in elektron lahko absorbira vidno svetlobo, $\mathrm{Zn^{2+}}$ ($3d^{10}$) je nima. Barva hemoglobina in klorofila pa ne izvira iz prehodov $d$, ampak predvsem iz konjugiranega porfirinskega obroča (ion $\mathrm{Mg^{2+}}$ v klorofilu nima elektronov $d$).

**Magnetizem.** Kisik $\mathrm{O_2}$ ima nesparjene elektrone, zato se tekoči kisik ujame med pola močnega magneta. Na lastnostih spina temelji tudi magnetna resonanca, ki jo v kemiji uporabljamo za določanje struktur, v medicini pa za slikanje tkiv.

## Drugače: Korak za korakom s številkami

Izračunaj valovno dolžino svetlobe, ki jo vodikov atom izseva pri prehodu elektrona z $n = 3$ na $n = 2$, in ionizacijsko energijo vodika v $\mathrm{kJ/mol}$. Uporabi $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$, $c = 2{,}998 \cdot 10^8\,\mathrm{m/s}$, $N_\mathrm{A} = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$.

1. **Energija nivojev:** $E_3 = -2{,}179 \cdot 10^{-18}/9 = -2{,}421 \cdot 10^{-19}\,\mathrm{J}$, $E_2 = -2{,}179 \cdot 10^{-18}/4 = -5{,}448 \cdot 10^{-19}\,\mathrm{J}$.
2. **Razlika:** $\Delta E = E_3 - E_2 = 2{,}179 \cdot 10^{-18}\,(\tfrac14 - \tfrac19)\,\mathrm{J} = 3{,}026 \cdot 10^{-19}\,\mathrm{J}$.
3. **Valovna dolžina:** $\lambda = \dfrac{hc}{\Delta E} = \dfrac{6{,}626 \cdot 10^{-34} \cdot 2{,}998 \cdot 10^{8}}{3{,}026 \cdot 10^{-19}}\,\mathrm{m} = 6{,}56 \cdot 10^{-7}\,\mathrm{m} = 656\,\mathrm{nm}$. To je rdeča črta v vodikovem spektru.
4. **Ionizacija** pomeni prehod z $n = 1$ na $n = \infty$: $\Delta E = 0 - E_1 = 2{,}179 \cdot 10^{-18}\,\mathrm{J}$ na atom.
5. **Na mol:** $2{,}179 \cdot 10^{-18}\,\mathrm{J} \cdot 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}} = 1{,}312 \cdot 10^{6}\,\mathrm{J/mol} = 1312\,\mathrm{kJ/mol}$, kar se ujema z izmerjeno prvo ionizacijsko energijo vodika.

## Drugače: Bolj natančno

**Schrödingerjeva enačba.** Za elektron v potencialu jedra rešujemo stacionarno enačbo $\hat H\psi = E\psi$, kjer je

$$\hat H = -\frac{\hbar^2}{2m_e}\nabla^2 - \frac{Ze^2}{4\pi\varepsilon_0 r}.$$

Ker je potencial odvisen le od $r$, rešitev v krogelnih koordinatah ločimo: $\psi_{nlm_l}(r, \theta, \varphi) = R_{nl}(r)\,Y_{l}^{m_l}(\theta, \varphi)$. Kvantna števila niso vpeljana »na roko«, ampak sledijo iz robnih pogojev: $\psi$ mora biti končna, enolična in normirana ($\int |\psi|^2\,\mathrm{d}V = 1$). Kotni del da pogoja $l = 0, 1, 2, \dots$ in $|m_l| \le l$, radialni pa $n \ge l + 1$. Energija vodiku podobnega atoma je

$$E_n = -\frac{m_e e^4 Z^2}{8\varepsilon_0^2 h^2 n^2},$$

kar za $Z = 1$ da $-2{,}179 \cdot 10^{-18}\,\mathrm{J}/n^2$. Pri vodiku je energija odvisna le od $n$ (orbitale $2s$ in $2p$ so degenerirane).

**Večelektronski atomi.** Pri več elektronih enačbe ne znamo rešiti natančno. V približku vsak elektron čuti **efektivni naboj jedra** $Z_\mathrm{eff} = Z - S$, kjer $S$ opisuje senčenje notranjih elektronov. Elektron $s$ ima večjo verjetnost blizu jedra (prodira skozi notranje lupine) kot elektron $p$ ali $d$ z istim $n$, zato čuti večji $Z_\mathrm{eff}$ in ima nižjo energijo. Od tod razcep $2s < 2p$ in pravilo $n + l$. Pri kaliju je $4s$ pod $3d$; ko pa se v vrsti prehodnih kovin povečuje $Z$, se $3d$ spusti pod $4s$, zato kationi najprej izgubijo elektrone $4s$.

**Spin in Paulijevo načelo.** Spin je notranja vrtilna količina elektrona brez klasičnega ustreznika; dokazali so ga s Stern-Gerlachovim poskusom. Paulijevo načelo je posledica splošnejše zahteve, da je valovna funkcija sistema elektronov **antisimetrična** pri zamenjavi dveh elektronov. Hundovo pravilo izhaja iz tega, da imajo elektroni z vzporednimi spini manjšo verjetnost, da so blizu skupaj (izmenjalna energija), zato je njihov odboj manjši.

**Vozli in radialna porazdelitev.** Radialna porazdelitvena funkcija $P(r) = r^2 R_{nl}^2$ pove verjetnost, da je elektron na razdalji $r$ od jedra. Za $1s$ vodika ima maksimum pri Bohrovem polmeru $a_0 = 52{,}9\,\mathrm{pm}$. Orbitala z $n$ in $l$ ima $n - l - 1$ radialnih vozlov: $3s$ dva, $3p$ enega, $3d$ nobenega.

## Preveri se

? Koliko elektronov lahko največ sprejme podlupina $4f$?
- $7$
~ Sedem je število orbital $f$; v vsako gresta dva elektrona.
+ $14$
- $10$
~ Deset elektronov sprejme podlupina $d$ ($l = 2$); za $f$ je $l = 3$.
> Za $f$ je $l = 3$, zato je $2l + 1 = 7$ orbital, v vsaki dva elektrona: $14$. Sedem je število orbital, deset pa velja za podlupino $d$.

? Katera kombinacija kvantnih števil $(n, l, m_l, m_s)$ **ni** dovoljena?
- $(2, 1, -1, +\tfrac12)$
~ Ta je dovoljena: $l = 1 \le n - 1$ in $m_l = -1$ je med $-1$ in $+1$ (orbitala $2p$).
- $(3, 2, 2, -\tfrac12)$
~ Ta je dovoljena: pri $l = 2$ sme biti $m_l$ do $+2$ (orbitala $3d$); meja za $m_l$ je $l$, ne $l - 1$.
+ $(2, 2, 0, +\tfrac12)$
> Stransko kvantno število je največ $n - 1$. Pri $n = 2$ je $l$ lahko le $0$ ali $1$, zato orbitale $2d$ ni.

? Kakšna je elektronska konfiguracija kroma ($Z = 24$) v osnovnem stanju?
- $[\mathrm{Ar}]\,3d^4\,4s^2$
~ To da pravilo $n + l$, krom pa je izjema: en elektron preide iz $4s$ v $3d$, ker je polzasedena podlupina $3d^5$ stabilnejša.
+ $[\mathrm{Ar}]\,3d^5\,4s^1$
- $[\mathrm{Ar}]\,3d^6$
~ Število elektronov se ujema, a $4s$ v atomu ni prazna; konfiguracija brez $4s$ velja za ione, ne za nevtralen atom.
> Krom je izjema: polzasedena podlupina $3d^5$ s šestimi nesparjenimi elektroni ima nižjo energijo kot $3d^4\,4s^2$.

? Koliko nesparjenih elektronov ima atom dušika ($1s^2\,2s^2\,2p^3$)?
- $1$
~ Tako je, če prva dva elektrona $2p$ sparimo v eni orbitali ($[\uparrow\downarrow][\uparrow][\ ]$); po Hundovem pravilu gre najprej po en elektron v vsako orbitalo.
- $2$
~ Dva nesparjena ima kisik ($2p^4$); pri $2p^3$ so tri orbitale in trije elektroni, zato para ni.
+ $3$
> Po Hundovem pravilu trije elektroni $2p$ zasedejo vsak svojo orbitalo z vzporednimi spini, zato so vsi trije nesparjeni.

? Študent določa konfiguracijo iona $\mathrm{Mn^{2+}}$ ($Z = 25$): (1) ion ima $25 - 2 = 23$ elektronov; (2) atom je $[\mathrm{Ar}]\,3d^5\,4s^2$; (3) ion je $[\mathrm{Ar}]\,3d^3\,4s^2$; (4) ion ima $3$ nesparjene elektrone. V katerem koraku je prva napaka?
- korak (1)
~ Ta je pravilen: kation z nabojem $2+$ ima dva elektrona manj kot atom.
- korak (2)
~ Ta je pravilen: mangan ni izjema kot krom, pravilo $n + l$ da $3d^5\,4s^2$.
+ korak (3)
- korak (4)
~ Iz $3d^3$ res sledijo $3$ nesparjeni; napaka je prej, v napačni konfiguraciji iona.
> Kation prehodne kovine najprej odda elektrone $4s$, zato je $\mathrm{Mn^{2+}}$ $[\mathrm{Ar}]\,3d^5$ s petimi nesparjenimi elektroni. Korak (4) računa pravilno, a iz napačne konfiguracije, zato je tudi njegov rezultat napačen.

:::simboli
E_n | energija elektrona na n-tem nivoju | E_n = -\frac{2{,}179 \cdot 10^{-18}\,\mathrm{J}}{n^2} | J | za vodikov atom
n | glavno kvantno število | | – | n = 1, 2, 3, …
l | stransko (orbitalno) kvantno število | | – | l = 0, …, n − 1
m_l | magnetno kvantno število | | – | m_l = −l, …, +l
s | podlupina s | | | l = 0, ena orbitala
p | podlupina p | | | l = 1, tri orbitale
d | podlupina d | | | l = 2, pet orbital
f | podlupina f | | | l = 3, sedem orbital
\hat H | Hamiltonov operator (operator energije) | | J | v Schrödingerjevi enačbi Ĥψ = Eψ
\hbar | reducirana Planckova konstanta | \hbar = \frac{h}{2\pi} | J s
h | Planckova konstanta | | J s | 6,626 · 10⁻³⁴ J s
m_e | masa elektrona | | kg | 9,109 · 10⁻³¹ kg
Z | vrstno število (število protonov) | | –
e | osnovni naboj | | C | 1,602 · 10⁻¹⁹ C
\varepsilon_0 | influenčna konstanta | | F/m | 8,854 · 10⁻¹² F/m
r | razdalja elektrona od jedra | | m
:::
