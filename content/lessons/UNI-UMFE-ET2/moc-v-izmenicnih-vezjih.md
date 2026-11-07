---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na starem izpitu stoji naloga: »Vir z efektivno napetostjo $12\,\mathrm V$ ima notranjo impedanco $\underline Z_g = (6 + \mathrm{j} 8)\,\Omega$. Kakšno breme mu priključimo, da prejme največjo delovno moč, in kolikšna je ta moč?«

Pri enosmernem toku odgovor poznaš: bremenski upor mora biti enak notranjemu. Ali naj bo breme zdaj $6\,\Omega$, ker je to realni del? Ali $10\,\Omega$, ker je to velikost impedance? Oboje je napačno, in do konca razlage boš vedel, zakaj.

Za isto mislijo stoji tudi denar. Tovarna z motorji plača elektriko po delovni energiji. Distributer pa ji dodatno zaračuna jalovo energijo, če je faktor moči prenizek, ker mora zanjo dimenzionirati kable in transformatorje. Kdor zna razstaviti moč na delovni in jalovi del, zna izračunati, koliko kondenzatorjev se splača vgraditi.

## Razlaga

### Izhodišče: moč pri enosmernem toku

Pri enosmernem toku sta napetost in tok stalna. Moč je $P = UI$, vsa gre v toploto ali delo, in pri danem viru je največja, ko je $R_\mathrm{L} = R_g$. V izmeničnem vezju velja $p = ui$ še vedno, a v vsakem trenutku posebej. Iz tega izhajajo štiri razlike.

### Prva razlika: moč niha

Naj bo $u = \sqrt 2\,U\cos\omega t$ in $i = \sqrt 2\,I\cos(\omega t - \varphi)$, kjer sta $U$ in $I$ efektivni vrednosti, $\varphi$ pa fazni kot impedance bremena. **Trenutna moč** je $p(t) = u(t)\,i(t)$.

**Izpeljava.** Z zvezo $2\cos\alpha\cos\beta = \cos(\alpha - \beta) + \cos(\alpha + \beta)$ dobimo

$$p = UI\cos\varphi + UI\cos(2\omega t - \varphi)$$

Drugi člen razpišemo še s $\cos(2\omega t - \varphi) = \cos 2\omega t\cos\varphi + \sin 2\omega t\sin\varphi$:

$$p = UI\cos\varphi\,(1 + \cos 2\omega t) + UI\sin\varphi\,\sin 2\omega t$$

Prvi del nikoli ni negativen: to je energija, ki teče samo k bremenu. Drugi del ima povprečje nič: energija gre z dvojno frekvenco sem in tja med virom in poljem tuljave ali kondenzatorja.

### Druga razlika: tri moči namesto ene

**Definicija.** Pri sinusnih razmerah so:

- **delovna moč** $P = UI\cos\varphi$, povprečje $p(t)$ v periodi, enota vat ($\mathrm W$);
- **jalova moč** $Q = UI\sin\varphi$, amplituda nihajočega dela, enota var ($\mathrm{var}$); induktivno breme ima $Q > 0$, kapacitivno $Q < 0$;
- **navidezna moč** $S = UI$, enota voltamper ($\mathrm{VA}$);
- **faktor moči** $\lambda = P/S = \cos\varphi$.

Velja $S^2 = P^2 + Q^2$. Moči tvorijo pravokotni **trikotnik moči**:

```
          /|
      S  / |
        /  | Q
       / φ |
      +----+
        P
```

:::premisli
Na upor, tuljavo in kondenzator priključimo isto napetost. Pri katerem elementu je trenutna moč kdaj negativna in kaj to fizikalno pomeni?
---
Pri tuljavi in kondenzatorju (in pri vsakem bremenu z $\varphi \neq 0$). Negativna moč pomeni, da element v tistem delu periode vrača energijo, shranjeno v magnetnem ali električnem polju, nazaj viru. Pri uporu je $p \ge 0$ vedno, ker se energija le spreminja v toploto.
:::

### Tretja razlika: kompleksna moč

S kazalci $\underline U$ in $\underline I$ zapišemo vse tri moči naenkrat.

**Definicija.** **Kompleksna moč** je

$$\underline S = \underline U\,\underline I^{*} = P + \mathrm{j} Q$$

kjer je $\underline I^{*}$ konjugirana vrednost toka. Konjugacija poskrbi, da je kot $\underline S$ ravno razlika kotov napetosti in toka, torej $\varphi$. Za breme z impedanco $\underline Z = R + \mathrm{j} X$ in tokom $\underline I$ je $\underline S = I^2\underline Z$, torej $P = I^2 R$ in $Q = I^2 X$.

**Izrek (ohranitev kompleksne moči, Boucherot).** V vezju s sinusnimi viri iste frekvence je vsota kompleksnih moči, ki jih oddajo viri, enaka vsoti kompleksnih moči, ki jih prejmejo vsi elementi. Ločeno se torej ohranjata delovna in jalova moč.

**Dokaz (skica).** Po Tellegenovem izreku je vsota $\underline U_k\,\underline I_k^{*}$ po vseh vejah enaka nič, če napetosti zadoščajo Kirchhoffovemu napetostnemu zakonu, tokovi (in s tem tudi konjugirani tokovi) pa tokovnemu. Ko veje razdelimo na vire in bremena, dobimo trditev.

Pozor: navidezne moči $S$ se v splošnem *ne* seštevajo. Seštevamo $P$ in $Q$, šele iz vsot izračunamo $S$.

### Četrta razlika: kompenzacija in prilagoditev

**Kompenzacija.** Za isto delovno moč pri slabšem faktorju moči teče večji tok, $I = P/(U\cos\varphi)$. Izgube v vodih so sorazmerne z $I^2$, torej z $1/\cos^2\varphi$. Vzporedni kondenzator ima jalovo moč $Q_C = -\omega C U^2$. Napetost bremena se ne spremeni, zato tudi $P$ ne; skupna jalova moč pa se zmanjša. Za dvig faktorja moči s $\cos\varphi_1$ na $\cos\varphi_2$ potrebujemo kondenzator z jalovo močjo

$$\lvert Q_C \rvert = P\,(\tan\varphi_1 - \tan\varphi_2)$$

**Izrek (največji prenos delovne moči).** Vir z napetostjo $\underline U_g$ in notranjo impedanco $\underline Z_g = R_g + \mathrm{j} X_g$ odda bremenu $\underline Z_\mathrm{L} = R_\mathrm{L} + \mathrm{j} X_\mathrm{L}$ največjo delovno moč, ko je $\underline Z_\mathrm{L} = \underline Z_g^{*}$ (**konjugirana prilagoditev**). Ta moč je

$$P_\mathrm{max} = \frac{U_g^2}{4R_g}$$

**Dokaz.** Tok je $I = U_g / \sqrt{(R_g + R_\mathrm{L})^2 + (X_g + X_\mathrm{L})^2}$, moč $P = I^2 R_\mathrm{L}$. Pri vsakem $R_\mathrm{L}$ je imenovalec najmanjši, ko je $X_\mathrm{L} = -X_g$; reaktanci se izničita. Ostane enosmerni problem $P = U_g^2 R_\mathrm{L} / (R_g + R_\mathrm{L})^2$, ki ima maksimum pri $R_\mathrm{L} = R_g$. Vstavimo in dobimo $P_\mathrm{max} = U_g^2 / (4R_g)$.

:::premisli
Zakaj pri prilagoditvi gre na breme le polovica moči, ki jo vir proizvede? Ali bi elektrarna hotela biti prilagojena na omrežje?
---
Pri $R_\mathrm{L} = R_g$ teče isti tok skozi enaka upora, zato se na notranjem uporu porabi enaka moč kot na bremenu: izkoristek je $50\,\%$. Za elektrarno bi bil to velik strošek; tam želimo velik izkoristek, zato je $R_g$ veliko manjši od bremena. Prilagoditev uporabljamo tam, kjer je signal šibek: antene, ojačevalniki, senzorji.
:::

**Odgovor na uvodno nalogo.** Breme mora biti $\underline Z_\mathrm{L} = (6 - \mathrm{j} 8)\,\Omega$: upor $6\,\Omega$ zaporedno s kondenzatorjem z reaktanco $8\,\Omega$. Moč je $P_\mathrm{max} = 12^2 / (4 \cdot 6) = 6\,\mathrm W$. Breme $6\,\Omega$ brez kondenzatorja dobi manj, ker reaktanca vira ostane v krogu in zmanjša tok.

## Rešeni primeri

### Primer 1 (lažji)

Breme z impedanco $\underline Z = (30 + \mathrm{j} 40)\,\Omega$ je priključeno na $230\,\mathrm V$. Izračunaj tok, kompleksno moč, faktor moči ter delovno, jalovo in navidezno moč.

**Podatki:** $U = 230\,\mathrm V$, $R = 30\,\Omega$, $X = 40\,\Omega$
**Iščemo:** $I$, $\underline S$, $\cos\varphi$, $P$, $Q$, $S$

:::formula
$\lvert\underline Z\rvert = \sqrt{R^2 + X^2}$, $I = \dfrac{U}{\lvert\underline Z\rvert}$, $\underline S = I^2\underline Z$, $\cos\varphi = \dfrac{R}{\lvert\underline Z\rvert}$
:::

**Rešitev:**

1. Velikost impedance: $\sqrt{30^2 + 40^2} = 50$, torej $\lvert\underline Z\rvert = 50\,\Omega$.
2. Tok: $I = 230 / 50 = 4{,}6\,\mathrm A$; zaostaja za napetostjo za $\arctan(40/30) \approx 53{,}1^\circ$.
3. Kompleksna moč: $I^2 = 21{,}16\,\mathrm{A^2}$, zato $P = 21{,}16 \cdot 30 = 634{,}8\,\mathrm W$ in $Q = 21{,}16 \cdot 40 = 846{,}4\,\mathrm{var}$.
4. Navidezna moč: $S = 230 \cdot 4{,}6 = 1058\,\mathrm{VA}$. Kontrola: $\sqrt{634{,}8^2 + 846{,}4^2} = 1058$.
5. Faktor moči: $\cos\varphi = 30 / 50 = 0{,}6$.
6. Odgovor: teče $4{,}6\,\mathrm A$; $\underline S = (634{,}8 + \mathrm{j} 846{,}4)\,\mathrm{VA}$, $P = 635\,\mathrm W$, $Q = 846\,\mathrm{var}$, $S = 1058\,\mathrm{VA}$, $\cos\varphi = 0{,}6$ (induktivno).

### Primer 2: tri bremena v delavnici

Na $230\,\mathrm V$ so vzporedno priključeni: grelnik $2000\,\mathrm W$ ($\cos\varphi = 1$), motor $1500\,\mathrm W$ s $\cos\varphi = 0{,}75$ (induktivno) in razsvetljava $500\,\mathrm W$ s $\cos\varphi = 0{,}9$ (kapacitivno). Kolikšni so skupna navidezna moč, faktor moči in tok v dovodu?

**Podatki:** $U = 230\,\mathrm V$; $P_1 = 2000\,\mathrm W$, $\cos\varphi_1 = 1$; $P_2 = 1500\,\mathrm W$, $\cos\varphi_2 = 0{,}75$ ind.; $P_3 = 500\,\mathrm W$, $\cos\varphi_3 = 0{,}9$ kap.
**Iščemo:** $S$, $\cos\varphi$, $I$

:::formula
$Q_k = P_k\tan\varphi_k$, $P = \sum P_k$, $Q = \sum Q_k$, $S = \sqrt{P^2 + Q^2}$, $I = \dfrac{S}{U}$
:::

**Rešitev:**

1. Jalova moč motorja: $\tan(\arccos 0{,}75) \approx 0{,}8819$, $Q_2 = 1500 \cdot 0{,}8819 \approx 1322{,}9\,\mathrm{var}$.
2. Razsvetljava je kapacitivna, zato je njena jalova moč negativna: $\tan(\arccos 0{,}9) \approx 0{,}4843$, $Q_3 \approx -242{,}2\,\mathrm{var}$.
3. Po Boucherotovem izreku seštejemo ločeno: $P = 2000 + 1500 + 500 = 4000\,\mathrm W$ in $Q = 1322{,}9 - 242{,}2 = 1080{,}7\,\mathrm{var}$.
4. Navidezna moč: $S = \sqrt{4000^2 + 1080{,}7^2} \approx 4143\,\mathrm{VA}$; faktor moči $4000 / 4143 \approx 0{,}965$.
5. Tok v dovodu: $I = 4143 / 230 \approx 18{,}01\,\mathrm A$.
6. Kontrola napake: tokovi posameznih bremen so $8{,}70\,\mathrm A$, $8{,}70\,\mathrm A$ in $2{,}42\,\mathrm A$, njihova vsota $19{,}81\,\mathrm A$ je večja od $18{,}01\,\mathrm A$. Tokovi niso v fazi, zato se velikosti ne seštevajo.
7. Odgovor: $S \approx 4{,}14\,\mathrm{kVA}$, $\cos\varphi \approx 0{,}965$ (induktivno), po dovodu teče $18{,}0\,\mathrm A$.

### Primer 3 (težji): ali se kompenzacija splača?

Obrat ima enofazni priključek $230\,\mathrm V$, $50\,\mathrm{Hz}$, in odjema $6\,\mathrm{kW}$ pri $\cos\varphi = 0{,}65$ (induktivno). Upornost dovoda (obeh vodnikov) je $0{,}15\,\Omega$. (a) Kolikšen kondenzator dvigne faktor moči na $0{,}95$? (b) Za koliko se zmanjšajo izgube v dovodu? (c) Koliko prihranimo v letu z $2000$ obratovalnimi urami pri ceni $0{,}15$ evra za $\mathrm{kWh}$?

**Podatki:** $U = 230\,\mathrm V$, $f = 50\,\mathrm{Hz}$, $P = 6000\,\mathrm W$, $\cos\varphi_1 = 0{,}65$, $\cos\varphi_2 = 0{,}95$, $R_\mathrm{v} = 0{,}15\,\Omega$, $t = 2000\,\mathrm h$, cena $0{,}15$ evra za $\mathrm{kWh}$
**Iščemo:** $C$, zmanjšanje izgub $\Delta P_\mathrm{v}$, letni prihranek

:::formula
$\lvert Q_C \rvert = P(\tan\varphi_1 - \tan\varphi_2)$, $C = \dfrac{\lvert Q_C \rvert}{\omega U^2}$, $I = \dfrac{P}{U\cos\varphi}$, $P_\mathrm{v} = I^2 R_\mathrm{v}$
:::

**Rešitev:**

1. Tangensa: $\tan\varphi_1 \approx 1{,}1691$, $\tan\varphi_2 \approx 0{,}3287$. Jalova moč pred kompenzacijo je $6000 \cdot 1{,}1691 \approx 7015\,\mathrm{var}$, po njej $6000 \cdot 0{,}3287 \approx 1972\,\mathrm{var}$.
2. Kondenzator mora prevzeti razliko: $\lvert Q_C \rvert = 6000 \cdot 0{,}8404 \approx 5043\,\mathrm{var}$.
3. Kapacitivnost: $\omega U^2 = 314{,}16 \cdot 52900 \approx 1{,}662 \cdot 10^7$, zato $C = 5043 / (1{,}662 \cdot 10^7)\,\mathrm F \approx 303\,\mu\mathrm F$.
4. Tok pred kompenzacijo: $I_1 = 6000 / (230 \cdot 0{,}65) \approx 40{,}13\,\mathrm A$; po njej: $I_2 = 6000 / (230 \cdot 0{,}95) \approx 27{,}46\,\mathrm A$.
5. Izgube v dovodu: $P_{\mathrm{v1}} = 40{,}13^2 \cdot 0{,}15 \approx 241{,}6\,\mathrm W$, $P_{\mathrm{v2}} = 27{,}46^2 \cdot 0{,}15 \approx 113{,}1\,\mathrm W$; razlika $\Delta P_\mathrm{v} \approx 128{,}5\,\mathrm W$.
6. Letno: $128{,}5\,\mathrm W \cdot 2000\,\mathrm h \approx 257\,\mathrm{kWh}$, kar je $257 \cdot 0{,}15 \approx 38{,}6$ evra, brez prihranka pri zaračunani jalovi energiji.
7. Zakaj ne na $\cos\varphi = 1$: zadnji del jalove moči zahteva sorazmerno veliko kondenzatorja za majhno zmanjšanje toka, pri spremenljivem bremenu pa grozi prekompenzacija (kapacitiven obrat in previsoka napetost).
8. Odgovor: potrebujemo približno $303\,\mu\mathrm F$; izgube v dovodu padejo za okoli $129\,\mathrm W$, kar na leto prihrani okoli $257\,\mathrm{kWh}$ oziroma $39$ evrov, poleg tega pa obrat ne plača prekomerne jalove energije.

### Primer 4 – zdaj ti

Ostanimo pri uvodni nalogi: $U_g = 12\,\mathrm V$, $\underline Z_g = (6 + \mathrm{j} 8)\,\Omega$. Na voljo imamo le čiste upore, kondenzatorja ne. Pokaži, da je najboljši upor $R_\mathrm{L} = \lvert\underline Z_g\rvert$, in izračunaj moč, ki jo prejme.

**Podatki:** $U_g = 12\,\mathrm V$, $R_g = 6\,\Omega$, $X_g = 8\,\Omega$, $X_\mathrm{L} = 0$
**Iščemo:** optimalni $R_\mathrm{L}$ in moč $P$

:::formula
$P = \dfrac{U_g^2 R_\mathrm{L}}{(R_g + R_\mathrm{L})^2 + X_g^2}$, $\dfrac{\mathrm{d} P}{\mathrm{d} R_\mathrm{L}} = 0$
:::

**Rešitev:**

1. Odvod števca in imenovalca da pogoj $(R_g + R_\mathrm{L})^2 + X_g^2 - 2R_\mathrm{L}(R_g + R_\mathrm{L}) = 0$, torej $R_\mathrm{L}^2 = R_g^2 + X_g^2$ in $R_\mathrm{L} = \lvert\underline Z_g\rvert = 10\,\Omega$.
2. Celotna impedanca kroga je $(16 + \mathrm{j} 8)\,\Omega$, njena velikost $\sqrt{16^2 + 8^2} \approx 17{,}89\,\Omega$.
3. Izračunaj še tok in moč ter ju primerjaj s $6\,\mathrm W$ pri konjugirani prilagoditvi.

:::premisli
Kolikšna sta tok in moč?
---
$I = 12 / 17{,}89 \approx 0{,}671\,\mathrm A$, $P = 0{,}671^2 \cdot 10 \approx 4{,}5\,\mathrm W$. To je $75\,\%$ največje moči $6\,\mathrm W$: brez kompenzacije reaktance vira breme ne dobi vse moči.
:::

## Pogoste napake

- **Seštevanje navideznih moči ali tokov.** Pri Primeru 2 bi vsota tokov dala $19{,}81\,\mathrm A$ namesto $18{,}01\,\mathrm A$. Seštevamo $P$ in $Q$ (ali kompleksne moči), nikoli $S$ ali velikosti tokov bremen z različnimi koti.
- **Kompleksna moč brez konjugacije.** $\underline U\,\underline I$ ima kot vsote kotov, ne razlike, zato da napačen predznak in velikost $Q$. Pravilno je $\underline S = \underline U\,\underline I^{*}$.
- **»Jalova moč je izguba.«** Jalova energija se ne spremeni v toploto; niha med virom in poljem. Škoduje posredno: poveča tok in s tem izgube $I^2R$ v vodih.
- **Prilagoditev $R_\mathrm{L} = R_g$ tudi pri izmeničnem viru.** Brez izničenja reaktance je tok premajhen. Pri prostem bremenu velja $\underline Z_\mathrm{L} = \underline Z_g^{*}$, pri samem uporu pa $R_\mathrm{L} = \lvert\underline Z_g\rvert$.
- **Kondenzator zaporedno z bremenom.** Zaporedni kondenzator spremeni napetost na bremenu in s tem njegovo delovanje. Kompenziramo z vzporednim kondenzatorjem, ki napetosti bremena ne spremeni.

## Povzetek

- Trenutna moč niha z $2\omega$: $p = UI\cos\varphi(1 + \cos 2\omega t) + UI\sin\varphi\sin 2\omega t$.
- $P = UI\cos\varphi$ (W), $Q = UI\sin\varphi$ (var), $S = UI$ (VA), $S^2 = P^2 + Q^2$, $\lambda = \cos\varphi$.
- Kompleksna moč $\underline S = \underline U\,\underline I^{*} = P + \mathrm{j}Q = I^2\underline Z$.
- Boucherot: $P$ in $Q$ se ohranjata in seštevata ločeno; $S$ se ne sešteva.
- Kompenzacija z vzporednim kondenzatorjem: $\lvert Q_C\rvert = P(\tan\varphi_1 - \tan\varphi_2)$, $C = \lvert Q_C\rvert / (\omega U^2)$; tok in izgube padejo.
- Največji prenos moči: $\underline Z_\mathrm{L} = \underline Z_g^{*}$, $P_\mathrm{max} = U_g^2/(4R_g)$; samo upor: $R_\mathrm{L} = \lvert\underline Z_g\rvert$.

## Za izpit

Znati moraš povedati:

- izpeljavo trenutne moči in njeno razstavitev na delovni in jalovi del;
- definicije $P$, $Q$, $S$, faktorja moči in kompleksne moči ter predznak $Q$ pri tuljavi in kondenzatorju;
- Boucherotov izrek in zakaj se navidezne moči ne seštevajo;
- izpeljavo kapacitivnosti za kompenzacijo in zakaj kompenziramo vzporedno;
- izrek o največjem prenosu moči z dokazom.

### Naloga 1

Bremeni $\underline Z_1 = (10 + \mathrm{j} 15)\,\Omega$ in $\underline Z_2 = 20\,\Omega$ sta vzporedno vezani. Napaja ju vir prek voda z impedanco $\underline Z_\mathrm{v} = (0{,}5 + \mathrm{j} 0{,}4)\,\Omega$. Na bremenih mora biti $230\,\mathrm V$, $50\,\mathrm{Hz}$. (a) Izračunaj tok v vodu, kompleksne moči bremen in voda ter napetost vira. (b) Preveri Boucherotov izrek. (c) Kolikšen kondenzator ob bremenih dvigne njihov faktor moči na $1$? Kolikšni sta tedaj izguba v vodu in potrebna napetost vira?

**Rešitev:**

1. Napetost bremen vzamemo za referenco, $\underline U = 230\,\mathrm V$. Tok skozi $\underline Z_1$: $\underline I_1 = 230 / (10 + \mathrm{j} 15) \approx (7{,}077 - \mathrm{j} 10{,}615)\,\mathrm A$, velikost $12{,}76\,\mathrm A$. Tok skozi $\underline Z_2$: $\underline I_2 = 11{,}5\,\mathrm A$.
2. Tok v vodu: $\underline I = \underline I_1 + \underline I_2 \approx (18{,}577 - \mathrm{j} 10{,}615)\,\mathrm A$, velikost $21{,}40\,\mathrm A$.
3. Moči bremen: $\underline S_1 = I_1^2\underline Z_1 \approx (1627{,}7 + \mathrm{j} 2441{,}5)\,\mathrm{VA}$, $\underline S_2 = 2645\,\mathrm W$. Moč voda: $\underline S_\mathrm{v} = I^2\underline Z_\mathrm{v} \approx (228{,}9 + \mathrm{j} 183{,}1)\,\mathrm{VA}$.
4. Napetost vira: $\underline U_g = \underline U + \underline I\,\underline Z_\mathrm{v} \approx (243{,}53 + \mathrm{j} 2{,}12)\,\mathrm V$, velikost $243{,}5\,\mathrm V$.
5. Moč vira: $\underline S_g = \underline U_g\,\underline I^{*} \approx (4501{,}6 + \mathrm{j} 2624{,}7)\,\mathrm{VA}$. Vsota prejetih: $P = 1627{,}7 + 2645 + 228{,}9 = 4501{,}6\,\mathrm W$ in $Q = 2441{,}5 + 183{,}1 = 2624{,}6\,\mathrm{var}$. Izrek drži (razlika je le zaokrožitev).
6. Kompenzacija: kondenzator mora prevzeti $Q_1 \approx 2441{,}5\,\mathrm{var}$, zato $C = 2441{,}5 / (314{,}16 \cdot 230^2)\,\mathrm F \approx 146{,}9\,\mu\mathrm F$.
7. Po kompenzaciji je tok v vodu realen: $I = (1627{,}7 + 2645) / 230 \approx 18{,}58\,\mathrm A$. Izguba: $18{,}58^2 \cdot 0{,}5 \approx 172{,}6\,\mathrm W$ namesto $228{,}9\,\mathrm W$.
8. Napetost vira: $\underline U_g = 230 + 18{,}58 \cdot (0{,}5 + \mathrm{j} 0{,}4) \approx (239{,}29 + \mathrm{j} 7{,}43)\,\mathrm V$, velikost $239{,}4\,\mathrm V$.
9. Odgovor: (a) $I \approx 21{,}4\,\mathrm A$, $U_g \approx 243{,}5\,\mathrm V$; (b) vir odda $(4501{,}6 + \mathrm{j} 2624{,}7)\,\mathrm{VA}$, kar je vsota prejetih moči; (c) $C \approx 147\,\mu\mathrm F$, izguba v vodu $173\,\mathrm W$, vir potrebuje le $239{,}4\,\mathrm V$.

### Naloga 2

Natančno navedi in dokaži izrek o največjem prenosu delovne moči z vira z notranjo impedanco $\underline Z_g = R_g + \mathrm{j}X_g$. Utemelji, zakaj pri prilagoditvi izkoristek ne more preseči $50\,\%$.

**Rešitev:**

1. Izrek: pri danem $\underline U_g$ in $\underline Z_g$ ($R_g > 0$) je delovna moč na bremenu največja natanko pri $\underline Z_\mathrm{L} = \underline Z_g^{*}$ in je tedaj $P_\mathrm{max} = U_g^2/(4R_g)$.
2. Moč na bremenu: $P = I^2R_\mathrm{L} = \dfrac{U_g^2 R_\mathrm{L}}{(R_g + R_\mathrm{L})^2 + (X_g + X_\mathrm{L})^2}$.
3. Pri vsakem $R_\mathrm{L} > 0$ člen $(X_g + X_\mathrm{L})^2 \ge 0$ le povečuje imenovalec, zato je za maksimum nujno $X_\mathrm{L} = -X_g$.
4. Ostane $f(R_\mathrm{L}) = U_g^2 R_\mathrm{L}/(R_g + R_\mathrm{L})^2$. Odvod $f' = U_g^2 (R_g - R_\mathrm{L})/(R_g + R_\mathrm{L})^3$ je pozitiven za $R_\mathrm{L} < R_g$ in negativen za $R_\mathrm{L} > R_g$, zato je maksimum pri $R_\mathrm{L} = R_g$.
5. Vstavimo: $P_\mathrm{max} = U_g^2 R_g / (2R_g)^2 = U_g^2/(4R_g)$.
6. Izkoristek: isti tok teče skozi $R_g$ in $R_\mathrm{L} = R_g$, zato je moč na notranjem uporu enaka moči na bremenu. Bremenu gre polovica proizvedene delovne moči, $\eta = 50\,\%$. Večji izkoristek zahteva $R_\mathrm{L} > R_g$, a takrat moč ni več največja.

## Drugače: Na sliki

Nariši kazalca $\underline U$ (vodoravno) in $\underline I$, zasukan navzdol za $\varphi$ (induktivno breme). Tok razstavi na dve komponenti: $I\cos\varphi$ v smeri napetosti in $I\sin\varphi$ pravokotno nanjo.

- **Delovni tok** $I\cos\varphi$ je v fazi z napetostjo. Pomnožen z $U$ da $P$.
- **Jalovi tok** $I\sin\varphi$ zaostaja za $90^\circ$. Pomnožen z $U$ da $Q$.
- Če vse tri dolžine pomnožiš z $U$, dobiš trikotnik moči z zgornje skice.

Kompenzacija je na tej sliki preprosta: kondenzator doda tok, ki je za $90^\circ$ *pred* napetostjo. Ta skrajša navpično komponento, vodoravna (delovna) ostane enaka. Tok v dovodu postane krajši.

Trenutno moč si predstavljaj kot sinusoido z dvojno frekvenco, dvignjeno za $P$. Pri uporu se dotika ničle, pri tuljavi je simetrična okoli nič, pri mešanem bremenu se spusti pod nič za kratek del periode.

## Drugače: Uporaba v stroki

- **Obračun jalove energije.** Pri večjih odjemalcih števec meri tudi jalovo energijo. Ko je faktor moči pod dogovorjeno mejo (pogosto $0{,}95$), se presežek zaračuna. Zato imajo obrati z motorji kondenzatorske baterije s stopenjskim regulatorjem, ki vklaplja kondenzatorje glede na trenutno breme.
- **Dimenzioniranje.** Transformator ima na tablici navidezno moč v $\mathrm{kVA}$, ne $\mathrm{kW}$, ker ga segrevata tok in napetost, ne glede na faktor moči. Pri slabem faktorju moči isti transformator prenese manj delovne moči.
- **Prilagoditev v visokofrekvenčni tehniki.** Antena, kabel in ojačevalnik so prilagojeni (na primer $50\,\Omega$), da sprejemnik dobi največ moči šibkega signala in ni odbojev.
- **Elektronski napajalniki.** Usmerniki s kondenzatorjem vlečejo tok v kratkih sunkih. Napajalniki zato vsebujejo vezje za korekcijo faktorja moči (PFC), ki tok oblikuje v sinus.

## Drugače: Bolj natančno

Vse zgoraj velja za sinusne napetosti in tokove. Kadar je tok popačen (usmerniki, frekvenčni pretvorniki, LED svetila), ga razstavimo v Fourierovo vrsto z višjimi harmoniki. Napetost omrežja je skoraj sinusna, zato delovno moč prispeva le osnovni harmonik toka:

$$P = U I_\mathrm{o} \cos\varphi_\mathrm{o}$$

kjer je $I_\mathrm{o}$ efektivna vrednost osnovnega harmonika toka in $\varphi_\mathrm{o}$ njegov fazni kot. Navidezna moč pa je $S = UI$ z efektivno vrednostjo *celotnega* toka. Ker je $I > I_\mathrm{o}$, je $S^2 > P^2 + Q_\mathrm{o}^2$; razliko imenujemo moč popačenja $D$, $S^2 = P^2 + Q_\mathrm{o}^2 + D^2$. Faktor moči $\lambda = P/S$ je tedaj manjši od $\cos\varphi_\mathrm{o}$. Kondenzator popačenja ne odpravi; potrebni so filtri ali aktivna korekcija.

## Preveri se

? Katera trojica vrednosti ($P$, $Q$, $S$) lahko opisuje isto breme?
- $3\,\mathrm{kW}$, $4\,\mathrm{kvar}$, $7\,\mathrm{kVA}$
~ Moči niso seštevne kot števila: $S = \sqrt{P^2 + Q^2}$, ne $P + Q$.
+ $3\,\mathrm{kW}$, $4\,\mathrm{kvar}$, $5\,\mathrm{kVA}$
- $5\,\mathrm{kW}$, $4\,\mathrm{kvar}$, $3\,\mathrm{kVA}$
~ Navidezna moč je hipotenuza trikotnika moči in ne more biti manjša od delovne.
- $3\,\mathrm{kW}$, $-4\,\mathrm{kvar}$, $1\,\mathrm{kVA}$
~ Negativen $Q$ je mogoč (kapacitivno breme), a $S$ je tudi tedaj $\sqrt{3^2 + 4^2} = 5\,\mathrm{kVA}$.
> $\sqrt{3^2 + 4^2} = 5$; trojica tvori pravokotni trikotnik moči s $\cos\varphi = 0{,}6$.

? Motor na $230\,\mathrm V$ vleče $10\,\mathrm A$ pri $\cos\varphi = 0{,}8$. Približno kolikšna je njegova delovna moč?
- $2{,}3\,\mathrm{kW}$
~ To je navidezna moč $UI$; faktor moči je izpuščen.
+ $1{,}8\,\mathrm{kW}$
- $1{,}4\,\mathrm{kW}$
~ Uporabljen je $\sin\varphi = 0{,}6$; tako dobiš jalovo moč v $\mathrm{kvar}$.
- $18\,\mathrm{kW}$
~ Napaka v redu velikosti: $230 \cdot 10 = 2300$, ne $23\,000$.
> $P = 230 \cdot 10 \cdot 0{,}8 = 1840\,\mathrm W \approx 1{,}8\,\mathrm{kW}$.

? Zakaj kompenzacijski kondenzator vežemo vzporedno z bremenom, ne zaporedno?
+ Vzporedni kondenzator ne spremeni napetosti bremena, zato breme dela enako, tok v dovodu pa se zmanjša.
- Zaporedni kondenzator bi povečal delovno moč bremena.
~ Delovno moč troši breme; kondenzator je ne proizvaja. Zaporedni bi spremenil napetost bremena in s tem njegovo delovanje.
- Vzporedni kondenzator porabi več delovne moči in zato bolje »vleče« jalovo.
~ Idealen kondenzator delovne moči ne porabi; izmenjuje le jalovo energijo.
- Ker zaporedno vezan kondenzator ne prepušča izmeničnega toka.
~ Kondenzator izmenični tok prepušča; to velja le za enosmerni tok.
> Vzporedni element ima isto napetost kot breme, zato ostanejo tok in moč bremena enaki, jalovi tok kondenzatorja pa se odšteje od jalovega toka bremena.

? Breme prejme $P = 800\,\mathrm W$ in $Q = 600\,\mathrm{var}$ pri $230\,\mathrm V$. Kolikšen tok teče?
- $6{,}09\,\mathrm A$
~ To je $(800 + 600)/230$: moči sta seštete kot števili.
- $3{,}48\,\mathrm A$
~ To je $P/U$; pozabljen je jalovi del toka.
+ $4{,}35\,\mathrm A$
- $2{,}61\,\mathrm A$
~ To je $Q/U$, samo jalovi del toka.
> $S = \sqrt{800^2 + 600^2} = 1000\,\mathrm{VA}$, $I = 1000/230 \approx 4{,}35\,\mathrm A$.

? Isti obrat kot v Primeru 3 bi stal v državi z omrežjem $230\,\mathrm V$, $60\,\mathrm{Hz}$. Kolikšen kondenzator bi potreboval za enako kompenzacijo?
- Enak, $303\,\mu\mathrm F$, ker sta $P$ in faktorja moči enaka.
~ Jalova moč kondenzatorja je $\omega C U^2$ in je odvisna od frekvence.
+ Manjši, okoli $253\,\mu\mathrm F$.
- Večji, okoli $364\,\mu\mathrm F$.
~ Pri višji frekvenci ima isti kondenzator manjšo reaktanco in večjo jalovo moč, zato zadošča manjši.
- Kondenzator pri $60\,\mathrm{Hz}$ ne kompenzira.
~ Kompenzacija deluje pri vsaki frekvenci; spremeni se le potrebna kapacitivnost.
> $C \propto 1/\omega$: $303 \cdot 50/60 \approx 253\,\mu\mathrm F$.

:::simboli
p | trenutna moč | p = u i | W
u | trenutna napetost | | V
i | trenutni tok | | A
U | efektivna napetost | | V
I | efektivni tok | | A
\varphi | fazni kot impedance bremena | | rad | kot med $\underline U$ in $\underline I$
\omega | krožna frekvenca | \omega = 2\pi f | s^{-1}
t | čas | | s
P | delovna moč | P = U I \cos\varphi | W
Q | jalova moč | Q = U I \sin\varphi | var | $Q > 0$ induktivno
S | navidezna moč | S = U I | VA | kompleksna $\underline S = P + \mathrm{j} Q$
\lambda | faktor moči | \lambda = \frac{P}{S} | –
R | upornost bremena | | \Omega
X | reaktanca bremena | | \Omega
Z | impedanca bremena | | \Omega | kazalec $\underline Z = R + \mathrm{j} X$
Q_C | jalova moč kondenzatorja | Q_C = -\omega C U^2 | var
C | kapacitivnost | | F
U_g | napetost vira | | V
Z_g | notranja impedanca vira | | \Omega | $R_g + \mathrm{j} X_g$
R_g | notranja upornost vira | | \Omega
X_g | notranja reaktanca vira | | \Omega
Z_\mathrm{L} | impedanca bremena pri prilagoditvi | | \Omega
R_\mathrm{L} | upornost bremena | | \Omega
X_\mathrm{L} | reaktanca bremena | | \Omega
P_\mathrm{max} | največja delovna moč | P_\mathrm{max} = \frac{U_g^2}{4 R_g} | W
P_\mathrm{v} | izgube v vodu | P_\mathrm{v} = I^2 R_\mathrm{v} | W
R_\mathrm{v} | upornost voda | | \Omega
I_\mathrm{o} | efektivni tok osnovnega harmonika | | A
\varphi_\mathrm{o} | fazni kot osnovnega harmonika | | rad
Q_\mathrm{o} | jalova moč osnovnega harmonika | | var
\varphi_1, \varphi_2 | fazni kot pred in po kompenzaciji | | rad
I_1, I_2 | tok pred in po kompenzaciji | | A | v Nalogi 1 toka bremen
D | moč popačenja | | VA
f | frekvenca | | Hz
\mathrm{j} | imaginarna enota | | – | $\mathrm{j}^2 = -1$
:::
