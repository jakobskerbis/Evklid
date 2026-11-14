---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Matematika, naravoslovje in računalništvo temeljijo na **sklepanju**: iz znanih dejstev izpeljemo nova. »Če je število deljivo s $6$, je deljivo s $3$. Število $42$ je deljivo s $6$. Torej je deljivo s $3$.« Takšen sklep je pravilen zaradi svoje **oblike**, ne zaradi vsebine: enako pravilen je sklep »Če je raztopina kisla, se lakmus obarva rdeče. Raztopina je kisla. Torej se lakmus obarva rdeče.«

**Izjavni račun** je najpreprostejši del matematične logike. Iz stavkov odstrani vsebino in opazuje le, kako so sestavljeni z vezniki *ne*, *in*, *ali*, *če … potem* in *natanko tedaj, ko*. Z njim:

- natančno povemo, kdaj je sestavljena izjava resnična (**resničnostne tabele**),
- prepoznamo izjave, ki so resnične vedno, ne glede na vsebino (**tavtologije**),
- preverimo, ali je sklep pravilen, in razkrinkamo pogoste napačne sklepe,
- pravilno zanikamo zapletene trditve.

Izjavni račun je osnova za dokazovanje v matematiki, za logična vezja v računalnikih, za pogoje v programih in za iskanje po podatkovnih zbirkah.

## Razlaga

**1. Izjave.** **Izjava** je smiseln poveden stavek, ki je bodisi resničen bodisi neresničen, ne pa oboje. Primeri:

- »$7$ je praštevilo.« je resnična izjava.
- »$2 + 2 = 5$.« je neresnična izjava.
- »Ali dežuje?« in »Zapri okno!« nista izjavi (vprašanje in ukaz).
- »$x > 3$« ni izjava, dokler $x$ ni določen; to je **izjavna forma** (predikat), ki jo obravnava predikatni račun.

Resničnostno vrednost izjave označimo z $1$ (resnično) ali $0$ (neresnično); v literaturi najdeš tudi $R$ in $N$ ali $\top$ in $\bot$. Izjave, ki jih ne razstavljamo naprej, označimo s črkami $p, q, r, \dots$ in jih imenujemo **izjavne spremenljivke**.

**2. Izjavni vezniki.** Iz enostavnih izjav sestavimo sestavljene:

- **negacija** $\neg p$ (»ne $p$«): resnična, ko je $p$ neresnična,
- **konjunkcija** $p \wedge q$ (»$p$ in $q$«): resnična, ko sta resnični obe,
- **disjunkcija** $p \vee q$ (»$p$ ali $q$«): resnična, ko je resnična vsaj ena (**vključujoči** ali),
- **implikacija** $p \Rightarrow q$ (»če $p$, potem $q$«): neresnična le, ko je $p$ resnična in $q$ neresnična,
- **ekvivalenca** $p \Leftrightarrow q$ (»$p$ natanko tedaj, ko $q$«): resnična, ko imata $p$ in $q$ enako vrednost.

| $p$ | $q$ | $\neg p$ | $p \wedge q$ | $p \vee q$ | $p \Rightarrow q$ | $p \Leftrightarrow q$ |
|---|---|---|---|---|---|---|
| $1$ | $1$ | $0$ | $1$ | $1$ | $1$ | $1$ |
| $1$ | $0$ | $0$ | $0$ | $1$ | $0$ | $0$ |
| $0$ | $1$ | $1$ | $0$ | $1$ | $1$ | $0$ |
| $0$ | $0$ | $1$ | $0$ | $0$ | $1$ | $1$ |

**O implikaciji.** V $p \Rightarrow q$ je $p$ **predpostavka** (antecedens), $q$ **posledica** (konsekvens). Implikacija je obljuba: »če bo $p$, bo tudi $q$«. Prelomljena je le, ko $p$ velja, $q$ pa ne. Če $p$ ne velja, obljube ni mogoče prelomiti, zato je implikacija resnična (»Če je $2 + 2 = 5$, sem papež« je resnična izjava). Implikacija ne zahteva vzročne povezave med $p$ in $q$.

Implikacijo $p \Rightarrow q$ beremo tudi: »$p$ je **zadosten** pogoj za $q$«, »$q$ je **potreben** pogoj za $p$«, »$p$ le, če $q$«. Z implikacijo so povezane še:

- **obrat** $q \Rightarrow p$ (ni enakovreden $p \Rightarrow q$),
- **kontrapozicija** $\neg q \Rightarrow \neg p$ (je enakovredna $p \Rightarrow q$).

**3. Izjavne formule in tabele.** **Izjavna formula** je izraz, sestavljen iz izjavnih spremenljivk, veznikov in oklepajev, na primer $(p \wedge \neg q) \Rightarrow r$. Da prihranimo oklepaje, se dogovorimo za **prednost**: najmočneje veže $\neg$, nato $\wedge$, nato $\vee$, nato $\Rightarrow$ in na koncu $\Leftrightarrow$. Torej $\neg p \vee q \Rightarrow r$ pomeni $((\neg p) \vee q) \Rightarrow r$. Pri dvomu raje napiši oklepaje.

Formula z $n$ spremenljivkami ima $2^n$ možnih **določil** (naborov vrednosti spremenljivk), zato ima njena resničnostna tabela $2^n$ vrstic. Tabelo izpolnjujemo stolpec za stolpcem, od notranjih podformul navzven.

**4. Tavtologije in enakovredne formule.**

- **Tavtologija** je formula, ki je resnična pri vseh določilih, na primer $p \vee \neg p$ (zakon izključene tretje možnosti).
- **Protislovje** je formula, ki je neresnična pri vseh določilih, na primer $p \wedge \neg p$.
- Formula je **izpolnljiva**, če je resnična pri vsaj enem določilu.

Formuli $A$ in $B$ sta **enakovredni**, $A \sim B$ (pišemo tudi $A \equiv B$), če imata pri vseh določilih enako vrednost, torej če je $A \Leftrightarrow B$ tavtologija. Enakovredne formule lahko v izpeljavah zamenjujemo. Najpomembnejše enakovrednosti:

| ime | enakovrednost |
|---|---|
| dvojna negacija | $\neg\neg p \sim p$ |
| De Morganova zakona | $\neg(p \wedge q) \sim \neg p \vee \neg q$, $\neg(p \vee q) \sim \neg p \wedge \neg q$ |
| distributivnost | $p \wedge (q \vee r) \sim (p \wedge q) \vee (p \wedge r)$, $p \vee (q \wedge r) \sim (p \vee q) \wedge (p \vee r)$ |
| implikacija z disjunkcijo | $p \Rightarrow q \sim \neg p \vee q$ |
| negacija implikacije | $\neg(p \Rightarrow q) \sim p \wedge \neg q$ |
| kontrapozicija | $p \Rightarrow q \sim \neg q \Rightarrow \neg p$ |
| ekvivalenca | $p \Leftrightarrow q \sim (p \Rightarrow q) \wedge (q \Rightarrow p)$ |
| absorpcija | $p \wedge (p \vee q) \sim p$, $p \vee (p \wedge q) \sim p$ |

Konjunkcija in disjunkcija sta tudi komutativni in asociativni.

**5. Sklepanje.** **Sklep** je sestavljen iz **predpostavk** (premis) $A_1, \dots, A_n$ in **zaključka** $B$. Sklep je **pravilen** (veljaven), če je $B$ resničen pri vsakem določilu, pri katerem so resnične vse predpostavke. Pišemo $A_1, \dots, A_n \models B$. Enakovredno: sklep je pravilen natanko tedaj, ko je formula

$$(A_1 \wedge A_2 \wedge \dots \wedge A_n) \Rightarrow B$$

tavtologija. Pravilnost sklepa ne pove, ali so predpostavke resnične; pove le, da iz resničnih predpostavk sledi resničen zaključek.

**Osnovna pravila sklepanja:**

| ime | predpostavke | zaključek |
|---|---|---|
| modus ponens | $p \Rightarrow q$, $p$ | $q$ |
| modus tollens | $p \Rightarrow q$, $\neg q$ | $\neg p$ |
| hipotetični silogizem | $p \Rightarrow q$, $q \Rightarrow r$ | $p \Rightarrow r$ |
| disjunktivni silogizem | $p \vee q$, $\neg p$ | $q$ |
| poenostavitev | $p \wedge q$ | $p$ |
| združitev | $p$, $q$ | $p \wedge q$ |

**Napačna sklepa**, ki ju pogosto srečamo:

- **zatrjevanje posledice**: iz $p \Rightarrow q$ in $q$ sklepamo $p$,
- **zanikanje predpostavke**: iz $p \Rightarrow q$ in $\neg p$ sklepamo $\neg q$.

Pri obeh je protiprimer določilo $p = 0$, $q = 1$: predpostavki sta resnični, zaključek pa ne.

**Kako preverimo sklep.** (1) Z resničnostno tabelo: pogledamo vse vrstice, v katerih so vse predpostavke resnične, in preverimo zaključek. (2) **Z iskanjem protiprimera**: predpostavimo, da so predpostavke resnične in zaključek neresničen, ter poskusimo najti ustrezno določilo. Če pridemo do protislovja, je sklep pravilen. (3) Z verigo pravil sklepanja in enakovrednosti.

## Rešeni primeri

### Primer 1 (lažji)

Z resničnostno tabelo pokaži, da sta formuli $p \Rightarrow q$ in $\neg p \vee q$ enakovredni.

**Podatki:** formuli $A = p \Rightarrow q$ in $B = \neg p \vee q$, izjavni spremenljivki $p$, $q$
**Iščemo:** ali imata $A$ in $B$ pri vseh določilih enako vrednost

:::formula
$A \sim B$ natanko tedaj, ko se stolpca $A$ in $B$ v resničnostni tabeli ujemata v vseh $2^n$ vrsticah.
:::

**Rešitev:**

1. Spremenljivki sta dve, zato ima tabela $2^2 = 4$ vrstice.
2. Izpolnimo stolpce $\neg p$, nato $\neg p \vee q$ in $p \Rightarrow q$:

| $p$ | $q$ | $\neg p$ | $\neg p \vee q$ | $p \Rightarrow q$ |
|---|---|---|---|---|
| $1$ | $1$ | $0$ | $1$ | $1$ |
| $1$ | $0$ | $0$ | $0$ | $0$ |
| $0$ | $1$ | $1$ | $1$ | $1$ |
| $0$ | $0$ | $1$ | $1$ | $1$ |

3. Zadnja stolpca sta enaka v vseh štirih vrsticah.
4. Odgovor: $p \Rightarrow q \sim \neg p \vee q$. Implikacijo lahko vedno nadomestimo z disjunkcijo; od tod sledi tudi $\neg(p \Rightarrow q) \sim p \wedge \neg q$ (po De Morganu).

### Primer 2

Ali je formula $\big((p \Rightarrow q) \wedge (q \Rightarrow r)\big) \Rightarrow (p \Rightarrow r)$ tavtologija? Odgovori brez celotne tabele, z iskanjem protiprimera.

**Podatki:** formula $F = \big((p \Rightarrow q) \wedge (q \Rightarrow r)\big) \Rightarrow (p \Rightarrow r)$ s tremi spremenljivkami $p$, $q$, $r$
**Iščemo:** ali je $F$ resnična pri vseh $2^3 = 8$ določilih

:::formula
Implikacija $X \Rightarrow Y$ je neresnična le pri $X = 1$, $Y = 0$. Formula je tavtologija, če določila z $F = 0$ ni.
:::

**Rešitev:**

1. Predpostavimo, da je $F = 0$ pri nekem določilu. Tedaj je predpostavka $(p \Rightarrow q) \wedge (q \Rightarrow r) = 1$ in posledica $p \Rightarrow r = 0$.
2. Iz $p \Rightarrow r = 0$ sledi $p = 1$ in $r = 0$.
3. Iz predpostavke sledi $p \Rightarrow q = 1$. Ker je $p = 1$, mora biti $q = 1$.
4. Iz predpostavke sledi tudi $q \Rightarrow r = 1$. Ker je $q = 1$, mora biti $r = 1$.
5. To nasprotuje koraku 2 ($r = 0$). Določila z $F = 0$ torej ni.
6. Odgovor: formula je tavtologija. Zato je hipotetični silogizem ($p \Rightarrow q$, $q \Rightarrow r \models p \Rightarrow r$) pravilen sklep.

### Primer 3 (težji)

V laboratoriju veljajo naslednje ugotovitve. Če je raztopina kisla, se modri lakmusov papir obarva rdeče. Papir se ni obarval rdeče. Če raztopina ni kisla, je nevtralna ali bazična. Raztopina ni bazična. Ali lahko pravilno sklepamo, da je raztopina nevtralna?

**Podatki:** izjave $k$: »raztopina je kisla«, $r$: »papir se obarva rdeče«, $n$: »raztopina je nevtralna«, $b$: »raztopina je bazična«; predpostavke $k \Rightarrow r$, $\neg r$, $\neg k \Rightarrow (n \vee b)$, $\neg b$
**Iščemo:** ali je sklep $k \Rightarrow r,\ \neg r,\ \neg k \Rightarrow (n \vee b),\ \neg b \models n$ pravilen

:::formula
Modus tollens: $p \Rightarrow q, \neg q \models \neg p$. Modus ponens: $p \Rightarrow q, p \models q$. Disjunktivni silogizem: $p \vee q, \neg q \models p$.
:::

**Rešitev:**

1. Iz $k \Rightarrow r$ in $\neg r$ po modus tollens sledi $\neg k$: raztopina ni kisla.
2. Iz $\neg k \Rightarrow (n \vee b)$ in $\neg k$ po modus ponens sledi $n \vee b$: raztopina je nevtralna ali bazična.
3. Iz $n \vee b$ in $\neg b$ po disjunktivnem silogizmu sledi $n$.
4. Preizkus z iskanjem protiprimera: naj bodo vse predpostavke resnične in $n = 0$. Iz $\neg b$ je $b = 0$, zato $n \vee b = 0$. Da bo $\neg k \Rightarrow (n \vee b)$ resnična, mora biti $\neg k = 0$, torej $k = 1$. Tedaj iz $k \Rightarrow r$ sledi $r = 1$, kar nasprotuje $\neg r$. Protiprimera ni.
5. Odgovor: sklep je pravilen; raztopina je nevtralna (seveda le, če so vse štiri predpostavke resnične).

## Pogoste napake

- **Implikacija kot ekvivalenca.** Iz »Če dežuje, so ceste mokre« ne sledi »Če so ceste mokre, dežuje« (lahko je vozil čistilni avtomobil). Obrat ni enakovreden izvirni implikaciji.
- **Zatrjevanje posledice.** »Če je snov kovina, prevaja tok. Grafit prevaja tok. Torej je grafit kovina.« Sklep je napačen, čeprav sta predpostavki resnični.
- **Napačna negacija konjunkcije.** Negacija izjave »Raztopina je kisla in topla« ni »Raztopina ni kisla in ni topla«, ampak »Raztopina ni kisla ali ni topla« (De Morgan).
- **Napačna negacija implikacije.** $\neg(p \Rightarrow q)$ ni $\neg p \Rightarrow \neg q$ in ni $p \Rightarrow \neg q$, ampak $p \wedge \neg q$. Negacija izjave »Če je raztopina kisla, se papir obarva rdeče« je »Raztopina je kisla in papir se ne obarva rdeče«.
- **Izključujoči ali.** V vsakdanjem jeziku »ali« pogosto pomeni »eno ali drugo, ne oboje«. V logiki je $p \vee q$ resnična tudi, ko sta resnični obe.
- **Neresnična predpostavka da neresnično implikacijo.** Pri $p = 0$ je $p \Rightarrow q$ vedno resnična.
- **Nepopolna tabela.** Pri treh spremenljivkah je vrstic $8$, ne $6$. Sistematično zapisuj vrednosti: prvi stolpec štiri enice in štiri ničle, drugi po dve, tretji izmenično.

## Povzetek

- Izjava je resnična ($1$) ali neresnična ($0$). Vezniki: $\neg$, $\wedge$, $\vee$, $\Rightarrow$, $\Leftrightarrow$.
- $p \Rightarrow q$ je neresnična le pri $p = 1$, $q = 0$; $p \Rightarrow q \sim \neg p \vee q \sim \neg q \Rightarrow \neg p$; obrat ni enakovreden.
- Resničnostna tabela formule z $n$ spremenljivkami ima $2^n$ vrstic.
- Tavtologija je vedno resnična, protislovje vedno neresnično; $A \sim B$, če je $A \Leftrightarrow B$ tavtologija.
- De Morgan: $\neg(p \wedge q) \sim \neg p \vee \neg q$, $\neg(p \vee q) \sim \neg p \wedge \neg q$.
- Sklep $A_1, \dots, A_n \models B$ je pravilen, če je $(A_1 \wedge \dots \wedge A_n) \Rightarrow B$ tavtologija. Pravilna: modus ponens, modus tollens, silogizma. Napačna: zatrjevanje posledice, zanikanje predpostavke.

## Drugače: Na sliki

**Vennovi diagrami.** Narišimo pravokotnik (vsa možna stanja sveta) in v njem kroga $P$ in $Q$: v krogu $P$ so stanja, v katerih je $p$ resnična. Tedaj:

- $\neg p$ je vse zunaj kroga $P$,
- $p \wedge q$ je presek krogov,
- $p \vee q$ je unija krogov,
- $p \Rightarrow q$ je vse razen dela $P$, ki je zunaj $Q$. Implikacija je resnična v vseh stanjih natanko tedaj, ko krog $P$ v celoti leži v krogu $Q$.

Tavtologija ustreza celemu pravokotniku, protislovje prazni množici. De Morganov zakon na sliki: zunanjost unije je presek zunanjosti.

**Električna vezja.** Stikalo je zaprto ($1$) ali odprto ($0$). Dve stikali **zaporedno** prevajata tok, ko sta zaprti obe: to je $p \wedge q$. Dve stikali **vzporedno** prevajata, ko je zaprto vsaj eno: $p \vee q$. Na tem temeljijo logična vrata v računalniških čipih.

## Drugače: Uporaba v stroki

**Programiranje.** Pogoj `if (temperatura > 30 && !klima)` je konjunkcija z negacijo. Pogoj »ni res, da je $a$ ali $b$« programer po De Morganu prepiše v `!a && !b`.

**Iskanje po zbirkah.** Iskalnik literature razume `kofein AND (čaj OR kava) NOT brezkofeinska`. Brez razumevanja veznikov dobimo preveč ali premalo zadetkov.

**Medicinski testi.** »Če ima pacient bolezen, je test pozitiven« ne pomeni, da je vsak pozitiven pacient bolan. Lažno pozitivni izvidi so ravno primer, ko je posledica resnična, predpostavka pa ne.

**Pravila in predpisi.** »Vstop je dovoljen le z zaščitnimi očali« pomeni: vstop $\Rightarrow$ očala. Očala so potreben, ne zadosten pogoj; z očali še nimaš nujno dovoljenja za vstop.

**Biologija.** »Vsi sesalci imajo dlako« je implikacija »sesalec $\Rightarrow$ dlaka«. Kontrapozicija »brez dlake $\Rightarrow$ ni sesalec« je enako resnična; obrat »dlaka $\Rightarrow$ sesalec« pa ni nujno.

## Drugače: Korak za korakom s številkami

Preveri distributivni zakon $p \wedge (q \vee r) \sim (p \wedge q) \vee (p \wedge r)$.

1. **Število vrstic:** tri spremenljivke, $2^3 = 8$ vrstic.
2. **Določila:** $p$ ima štiri enice, nato štiri ničle; $q$ po dve; $r$ izmenično.
3. **Leva stran:** najprej $q \vee r$, nato konjunkcija s $p$.
4. **Desna stran:** $p \wedge q$, $p \wedge r$ in njuna disjunkcija.

| $p$ | $q$ | $r$ | $q \vee r$ | $p \wedge (q \vee r)$ | $p \wedge q$ | $p \wedge r$ | $(p \wedge q) \vee (p \wedge r)$ |
|---|---|---|---|---|---|---|---|
| $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $1$ | $1$ | $0$ | $1$ | $1$ | $1$ | $0$ | $1$ |
| $1$ | $0$ | $1$ | $1$ | $1$ | $0$ | $1$ | $1$ |
| $1$ | $0$ | $0$ | $0$ | $0$ | $0$ | $0$ | $0$ |
| $0$ | $1$ | $1$ | $1$ | $0$ | $0$ | $0$ | $0$ |
| $0$ | $1$ | $0$ | $1$ | $0$ | $0$ | $0$ | $0$ |
| $0$ | $0$ | $1$ | $1$ | $0$ | $0$ | $0$ | $0$ |
| $0$ | $0$ | $0$ | $0$ | $0$ | $0$ | $0$ | $0$ |

5. **Primerjava:** peti in zadnji stolpec se ujemata v vseh osmih vrsticah, zato zakon velja.
6. **Opazka:** obe strani sta resnični v natanko treh vrsticah: $p = 1$ in vsaj ena od $q$, $r$ resnična.

## Drugače: Bolj natančno

**Sintaksa.** Množico izjavnih formul definiramo induktivno: (1) vsaka izjavna spremenljivka je formula, prav tako konstanti $1$ in $0$; (2) če sta $A$ in $B$ formuli, so formule tudi $\neg A$, $(A \wedge B)$, $(A \vee B)$, $(A \Rightarrow B)$ in $(A \Leftrightarrow B)$; (3) drugih formul ni. Lastnosti formul zato dokazujemo z indukcijo po zgradbi.

**Semantika.** **Določilo** je preslikava $v$ iz množice spremenljivk v $\{0, 1\}$. Razširimo jo na vse formule z $v(\neg A) = 1 - v(A)$, $v(A \wedge B) = \min(v(A), v(B))$, $v(A \vee B) = \max(v(A), v(B))$, $v(A \Rightarrow B) = \max(1 - v(A), v(B))$ in $v(A \Leftrightarrow B) = 1$ natanko tedaj, ko je $v(A) = v(B)$. Formula $B$ je **logična posledica** množice $\Gamma$, $\Gamma \models B$, če je $v(B) = 1$ za vsako določilo $v$, pri katerem so vse formule iz $\Gamma$ resnične.

**Trditev.** $A_1, \dots, A_n \models B$ natanko tedaj, ko je $(A_1 \wedge \dots \wedge A_n) \Rightarrow B$ tavtologija.

*Dokaz.* Implikacija je pri določilu $v$ neresnična natanko tedaj, ko je $v(A_1 \wedge \dots \wedge A_n) = 1$ in $v(B) = 0$, torej natanko tedaj, ko so vse predpostavke resnične in zaključek neresničen. Implikacija je torej tavtologija natanko tedaj, ko takega $v$ ni, kar je definicija logične posledice. $\square$

**Polni nabori veznikov in normalne oblike.** Vsaka resničnostna tabela (vsaka funkcija $\{0, 1\}^n \to \{0, 1\}$) pripada neki formuli. Za vsako vrstico z vrednostjo $1$ zapišemo konjunkcijo spremenljivk oziroma njihovih negacij (na primer $p \wedge \neg q \wedge r$ za vrstico $1, 0, 1$), nato vse take konjunkcije povežemo z disjunkcijo (če take vrstice ni, vzamemo protislovje $p \wedge \neg p$). Dobimo **disjunktivno normalno obliko** (DNO). Dualno dobimo **konjunktivno normalno obliko** (KNO). Zato je nabor $\{\neg, \wedge, \vee\}$ **poln**. Ker $p \vee q \sim \neg(\neg p \wedge \neg q)$, je poln že $\{\neg, \wedge\}$, prav tako $\{\neg, \Rightarrow\}$. Poln je celo en sam veznik, **Shefferjev** $p \uparrow q \sim \neg(p \wedge q)$ (NAND), saj $\neg p \sim p \uparrow p$ in $p \wedge q \sim (p \uparrow q) \uparrow (p \uparrow q)$.

**Metode dokazovanja.** Pravilni sklepi izjavnega računa so podlaga za matematične dokaze: **neposredni** dokaz $p \Rightarrow q$ (predpostavimo $p$, izpeljemo $q$), dokaz s **kontrapozicijo** (predpostavimo $\neg q$, izpeljemo $\neg p$) in dokaz s **protislovjem** (iz $\neg q$ in $p$ izpeljemo protislovje), ki temelji na tavtologiji $\big((p \wedge \neg q) \Rightarrow (r \wedge \neg r)\big) \Rightarrow (p \Rightarrow q)$.

**Računska zahtevnost.** Ali je formula izpolnljiva, lahko vedno ugotovimo s tabelo, a ta ima $2^n$ vrstic. Pri $n = 50$ je to več kot $10^{15}$ vrstic. Problem izpolnljivosti (SAT) je prvi znani NP-poln problem; učinkovit algoritem zanj ni znan.

## Preveri se

? Pri katerem določilu je implikacija $p \Rightarrow q$ neresnična?
+ $p = 1$, $q = 0$
- $p = 0$, $q = 1$
~ Predpostavka je neresnična, zato obljuba ni prelomljena: implikacija je resnična.
- $p = 0$, $q = 0$
~ Tudi tu je predpostavka neresnična, zato je implikacija resnična.
- implikacija je vedno resnična
~ Pri $p = 1$, $q = 0$ je neresnična; $p \Rightarrow q$ ni tavtologija.
> Implikacija je kot obljuba: prelomljena je le, ko predpostavka velja, posledica pa ne. Pri $p = 0$ je implikacija resnična ne glede na $q$.

? Katera izjava je negacija izjave »Raztopina je kisla in topla«?
- Raztopina ni kisla in ni topla.
~ Zanikal si vsak člen, veznika »in« pa nisi zamenjal z »ali«; ta izjava je neresnična tudi pri kisli in hladni raztopini.
+ Raztopina ni kisla ali ni topla.
- Raztopina je bazična in hladna.
~ To je le eden od primerov, v katerih je prvotna izjava neresnična; negacija mora zajeti vse.
- Če raztopina ni kisla, ni topla.
~ To je $\neg k \Rightarrow \neg t \sim k \vee \neg t$, kar je resnično tudi pri kisli in topli raztopini.
> Po De Morganu je $\neg(p \wedge q) \sim \neg p \vee \neg q$. Izjava »ni kisla in ni topla« je močnejša: izključuje tudi primer, ko je raztopina kisla, a hladna.

? Koliko vrstic ima resničnostna tabela formule s štirimi izjavnimi spremenljivkami?
- $8$
~ To je $2^3$, tabela za tri spremenljivke (ali $2 \cdot 4$: možnosti se množijo, ne seštevajo).
+ $16$
- $4$
~ To je število spremenljivk oziroma $2^2$; vrstic je $2^n$, ne $n$.
- $32$
~ To je $2^5$, tabela za pet spremenljivk.
> Vsaka spremenljivka ima dve vrednosti, zato je določil $2^4 = 16$.

? Katera formula je tavtologija?
- $(p \Rightarrow q) \Rightarrow (q \Rightarrow p)$
~ Implikacija in njen obrat nista enakovredna: pri $p = 0$, $q = 1$ je formula neresnična.
- $(p \vee q) \Rightarrow p$
~ Pri $p = 0$, $q = 1$ je disjunkcija resnična, $p$ pa ne.
+ $\big(p \wedge (p \Rightarrow q)\big) \Rightarrow q$
- $p \wedge \neg p$
~ To je protislovje: neresnično pri vseh določilih.
> To je modus ponens: če sta $p$ in $p \Rightarrow q$ resnični, mora biti resnična $q$. Prvi dve formuli sta neresnični pri $p = 0$, $q = 1$, zadnja je protislovje.

:::simboli
A_1, A_2, A_n | predpostavke (premise) sklepa
A | izjavna formula
B | izjavna formula | | | v sklepu zaključek
n | število izjavnih spremenljivk | | | tabela ima 2ⁿ vrstic
X, Y | izjavi v implikaciji X ⇒ Y | | | 1 resnično, 0 neresnično
F | izjavna formula, ki jo preverjamo
p, q | izjavni spremenljivki
:::
