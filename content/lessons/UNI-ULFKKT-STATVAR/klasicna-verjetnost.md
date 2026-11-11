---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Preden prebereš razlago, poskusi uganiti. Redka genetska bolezen prizadene enega od tisoč ljudi. Presejalni test bolezen zazna pri $99\,\%$ bolnih, pri zdravih pa da lažno pozitiven izid v $5\,\%$ primerov. Naključno izbrani osebi je test pozitiven. Kolikšna je verjetnost, da je res bolna?

Večina reče »okoli $95\,\%$« ali »$99\,\%$«. Pravilen odgovor je **okoli $2\,\%$**. Med $100\,000$ testiranimi je bolnih okoli $100$, od teh jih test zazna $99$. Zdravih je $99\,900$, od teh jih test napačno označi $5\,\%$, kar je skoraj $5000$. Med vsemi pozitivnimi je bolnih torej le $99$ od približno $5100$.

Intuicija je zamenjala dve različni verjetnosti: verjetnost pozitivnega izida pri bolnem ($99\,\%$) in verjetnost bolezni pri pozitivnem izidu ($2\,\%$). Kako ju računamo in ločimo, pove pogojna verjetnost z Bayesovo formulo. Da do njih pridemo, potrebujemo najprej štetje izidov – kombinatoriko – in klasično definicijo verjetnosti. Ista orodja uporabljaš pri genetskih križanjih, vzorčenju v laboratoriju, oceni kontaminacije, zanesljivosti varnostnih sistemov in razlagi diagnostičnih testov.

## Razlaga

### Staro orodje: verjetnost kot delež enako možnih izidov

Iz srednje šole poznaš klasično definicijo.

**Definicija.** Naj bo **prostor izidov** $\Omega$ končna množica enako verjetnih izidov. **Dogodek** je podmnožica $A \subseteq \Omega$. Verjetnost dogodka je

$$P(A) = \frac{|A|}{|\Omega|},$$

število ugodnih izidov deljeno s številom vseh.

Splošneje verjetnost opišejo **Kolmogorovi aksiomi**: $P(A) \geq 0$, $P(\Omega) = 1$ in za nezdružljive dogodke ($A \cap B = \emptyset$) $P(A \cup B) = P(A) + P(B)$ (natančneje: verjetnost unije števno mnogo paroma nezdružljivih dogodkov je vsota njihovih verjetnosti). Klasična definicija jih izpolnjuje. Iz aksiomov sledita pravili, ki ju stalno uporabljamo:

- **nasprotni dogodek**: $P(A^c) = 1 - P(A)$, ker sta $A$ in $A^c$ nezdružljiva in skupaj dasta $\Omega$;
- **vsota poljubnih dogodkov**:

$$P(A \cup B) = P(A) + P(B) - P(A \cap B).$$

**Dokaz.** $A \cup B$ razpade na nezdružljiva dela $A$ in $B \setminus A$, $B$ pa na nezdružljiva dela $A \cap B$ in $B \setminus A$. Torej $P(A \cup B) = P(A) + P(B \setminus A)$ in $P(B \setminus A) = P(B) - P(A \cap B)$. $\square$

Pri klasični verjetnosti je vse delo v štetju $|A|$ in $|\Omega|$. Za to je kombinatorika.

### Kombinatorika: štetje brez naštevanja

**Osnovni izrek (pravilo produkta).** Če izbiro opravimo v $k$ zaporednih korakih in je v $i$-tem koraku $n_i$ možnosti (ne glede na prejšnje izbire), je vseh izbir $n_1 \cdot n_2 \cdots n_k$.

Iz njega sledijo štiri osnovne formule. Iz množice $n$ elementov izbiramo $k$ elementov:

| | red šteje | red ne šteje |
|---|---|---|
| brez ponav. | $\dfrac{n!}{(n-k)!}$ | $\dbinom{n}{k}$ |
| s ponav. | $n^k$ | $\dbinom{n+k-1}{k}$ |

Pri $k = n$ brez ponavljanja dobimo **permutacije**, $n!$. Če je med $n$ elementi $k_1$ enakih ene vrste, $k_2$ druge itd., je razporeditev $n!/(k_1!\,k_2!\cdots)$.

**Izpeljava kombinacij.** Urejenih izbir $k$ različnih elementov je $n!/(n-k)!$ (pravilo produkta: $n$, nato $n-1$, …, nato $n-k+1$ možnosti). Vsako neurejeno izbiro dobimo iz $k!$ urejenih (vse permutacije istih elementov). Zato je neurejenih

$$\binom{n}{k} = \frac{n!}{k!\,(n-k)!}.$$

Primer iz biologije: zaporedje DNA dolžine $6$ iz štirih nukleotidov je urejena izbira s ponavljanjem, $4^6 = 4096$ možnosti; izbira $5$ miši izmed $12$ za poskus je neurejena izbira brez ponavljanja, $\binom{12}{5} = 792$ možnosti.

### Novo orodje: pogojna verjetnost

Pri klasični verjetnosti štejemo ugodne izide med **vsemi**. Kaj pa, če že vemo, da se je zgodil dogodek $B$? Potem so možni le še izidi iz $B$: prostor izidov se skrči. To je edina razlika med staro in novo formulo:

| | klasična | pogojna |
|---|---|---|
| kaj je možno | vse iz $\Omega$ | le izidi iz $B$ |
| ugodni | $A$ | $A \cap B$ |
| formula | $\dfrac{\lvert A\rvert}{\lvert\Omega\rvert}$ | $\dfrac{\lvert A \cap B\rvert}{\lvert B\rvert}$ |

**Definicija.** Za dogodek $B$ s $P(B) > 0$ je **pogojna verjetnost** dogodka $A$ pri pogoju $B$

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}.$$

Pri enako verjetnih izidih je to natanko $|A \cap B|/|B|$ iz tabele. Iz definicije sledi **pravilo množenja** $P(A \cap B) = P(B)\,P(A \mid B)$.

Pozor: $P(A \mid B)$ in $P(B \mid A)$ sta različni števili. V uvodu je $P(\text{pozitiven} \mid \text{bolan}) = 0{,}99$, $P(\text{bolan} \mid \text{pozitiven})$ pa le okoli $0{,}02$. Ju poveže Bayesova formula.

**Izrek (formula o popolni verjetnosti).** Naj dogodki $H_1, \dots, H_n$ tvorijo **popoln sistem**: so paroma nezdružljivi, njihova unija je $\Omega$ in $P(H_i) > 0$. Potem je za vsak dogodek $A$

$$P(A) = \sum_{i=1}^{n} P(H_i)\,P(A \mid H_i).$$

**Dokaz.** $A = (A \cap H_1) \cup \dots \cup (A \cap H_n)$, deli so paroma nezdružljivi, zato $P(A) = \sum P(A \cap H_i)$; vsak člen po pravilu množenja zapišemo kot $P(H_i)\,P(A \mid H_i)$. $\square$

**Izrek (Bayesova formula).** Pri istih predpostavkah in $P(A) > 0$ je

$$P(H_k \mid A) = \frac{P(H_k)\,P(A \mid H_k)}{\sum_{i=1}^{n} P(H_i)\,P(A \mid H_i)}.$$

**Dokaz.** Po definiciji $P(H_k \mid A) = P(H_k \cap A)/P(A)$; števec je po pravilu množenja $P(H_k)\,P(A \mid H_k)$, imenovalec po formuli o popolni verjetnosti. $\square$

$P(H_k)$ imenujemo **apriorna** verjetnost (pred poskusom), $P(H_k \mid A)$ **aposteriorna** (po poskusu). Bayesova formula pove, kako podatek $A$ spremeni naše prepričanje.

:::premisli
Pri igralni kocki je $A$ dogodek »pade šestica«, $B$ pa »pade sodo število«. Kolikšni sta $P(A)$ in $P(A \mid B)$? Kolikšna je $P(B \mid A)$? Zakaj sta pogojni verjetnosti tako različni?
---
$P(A) = 1/6$. Pri pogoju $B$ so možni le izidi $2, 4, 6$, zato $P(A \mid B) = 1/3$. $P(B \mid A) = 1$: če pade šestica, je število gotovo sodo. Pogoj spremeni prostor izidov: pri $P(A \mid B)$ je to $\{2, 4, 6\}$, pri $P(B \mid A)$ le $\{6\}$.
:::

### Neodvisnost

**Definicija.** Dogodka $A$ in $B$ sta **neodvisna**, če je

$$P(A \cap B) = P(A)\,P(B).$$

Pri $P(B) > 0$ je to enakovredno $P(A \mid B) = P(A)$: podatek, da se je zgodil $B$, ne spremeni verjetnosti $A$. Dogodki $A_1, \dots, A_n$ so **neodvisni**, če produktno pravilo velja za **vsako** njihovo podmnožico (ne le za pare).

Neodvisnosti ne zamenjuj z nezdružljivostjo:

- **Nezdružljiva:** $A \cap B = \emptyset$. Ko vemo, da se je zgodil $B$, se $A$ gotovo ni zgodil. Verjetnost unije je $P(A) + P(B)$.
- **Neodvisna:** $P(A \cap B) = P(A)\,P(B)$. Ko vemo za $B$, se verjetnost $A$ ne spremeni. Verjetnost unije je $P(A) + P(B) - P(A)P(B)$.

Nezdružljiva dogodka s pozitivnima verjetnostma nista nikoli neodvisna: $P(A \cap B) = 0$, a $P(A)P(B) > 0$.

V praksi je neodvisnost **predpostavka modela** (zaporedni meti, neodvisni vzorci, sistemi z ločenim napajanjem), ki jo moramo utemeljiti. Napačno predpostavljena neodvisnost je pogost vzrok podcenjenih tveganj: dva varnostna sistema s skupnim vzrokom okvare (isti požar, ista programska napaka) nista neodvisna.

:::premisli
V laboratoriju sta dva neodvisna detektorja dima, vsak deluje z verjetnostjo $0{,}95$. Kolikšna je verjetnost, da ob požaru ne zazvoni noben? Zakaj se računa z množenjem, in kaj se zgodi z rezultatom, če oba napaja isti vod, ki odpove z verjetnostjo $0{,}01$?
---
Neodvisna sta, zato $P(\text{noben}) = 0{,}05 \cdot 0{,}05 = 0{,}0025$. S skupnim vodom pa oba odpovesta že, ko odpove vod: verjetnost je vsaj $0{,}01$ (natančneje $0{,}01 + 0{,}99 \cdot 0{,}0025 \approx 0{,}0125$), petkrat več. Skupni vzrok uniči neodvisnost.
:::

## Rešeni primeri

### Primer 1 (lažji)

Zaporedje DNA dolžine $6$ je sestavljeno iz nukleotidov A, C, G in T, vsak položaj neodvisno in enako verjetno. (a) Koliko je različnih zaporedij? (b) Kolikšna je verjetnost, da je naključno zaporedje točno prepoznavno mesto restrikcijskega encima EcoRI, GAATTC? (c) Kolikšna je verjetnost, da vsebuje natanko dva G?

**Podatki:** dolžina $k = 6$, $n = 4$ nukleotidi, položaji neodvisni in enako verjetni; iskano zaporedje GAATTC
**Iščemo:** $|\Omega|$, $P(\text{GAATTC})$, $P(\text{natanko dva G})$

:::formula
$|\Omega| = n^k$; $P(A) = \dfrac{|A|}{|\Omega|}$; izbira mest za G: $\dbinom{6}{2}$, ostala mesta $3^4$
:::

**Rešitev:**

1. (a) Vrstni red šteje, ponavljanje je dovoljeno: $|\Omega| = 4^6 = 4096$.
2. (b) Ugoden je en sam izid: $P = 1/4096 \approx 2{,}44 \cdot 10^{-4}$. V genomu z milijoni položajev se tako mesto pojavi v povprečju na vsakih $4096$ baznih parov.
3. (c) Najprej izberemo, kateri dve mesti sta G: $\binom{6}{2} = 15$ načinov. Na preostalih štirih mestih je lahko le A, C ali T: $3^4 = 81$ možnosti.
4. Ugodnih je $15 \cdot 81 = 1215$, zato $P = 1215/4096 \approx 0{,}297$.
5. Odgovor: zaporedij je $4096$; verjetnost za GAATTC je $1/4096$; natanko dva G ima približno $29{,}7\,\%$ zaporedij.

### Primer 2

V stojalu je $20$ epruvet z vzorci, $4$ izmed njih so kontaminirane, a ne vemo katere. Za kontrolo naključno izberemo $5$ epruvet. Kolikšna je verjetnost, da med izbranimi ni nobene kontaminirane? Da je vsaj ena? Da je natanko ena?

**Podatki:** $N = 20$, $K = 4$ kontaminiranih, izberemo $n = 5$ brez vračanja, vse petice enako verjetne
**Iščemo:** $P(0)$, $P(\geq 1)$, $P(1)$

:::formula
$P(\text{natanko } j) = \dfrac{\binom{K}{j}\binom{N-K}{n-j}}{\binom{N}{n}}$; $P(\geq 1) = 1 - P(0)$
:::

**Rešitev:**

1. Vseh izbir: vrstni red ne šteje, brez ponavljanja, $\binom{20}{5} = 15\,504$.
2. Nobena kontaminirana: vseh $5$ iz $16$ čistih, $\binom{16}{5} = 4368$; $P(0) = 4368/15\,504 \approx 0{,}282$.
3. Vsaj ena: nasprotni dogodek, $P(\geq 1) = 1 - 0{,}282 = 0{,}718$. Neposredno bi morali sešteti štiri primere.
4. Natanko ena: eno izmed $4$ kontaminiranih in štiri izmed $16$ čistih, $4 \cdot 1820 = 7280$ izbir; $P(1) = 7280/15\,504 \approx 0{,}470$.
5. Odgovor: z verjetnostjo okoli $28\,\%$ kontrola kontaminacije sploh ne odkrije, vsaj eno kontaminirano epruveto najde z verjetnostjo okoli $72\,\%$, natanko eno z okoli $47\,\%$.

### Primer 3 (težji)

Redka genetska bolezen ima prevalenco $0{,}1\,\%$. Presejalni test ima občutljivost $99\,\%$ (pozitiven pri bolnih) in specifičnost $95\,\%$ (negativen pri zdravih). (a) Kolikšna je verjetnost pozitivnega izida pri naključni osebi? (b) Kolikšna je verjetnost bolezni ob pozitivnem izidu? (c) Pozitivne osebe ponovno testiramo z drugim testom enakih lastnosti, katerega napake so pri danem zdravstvenem stanju neodvisne od prvega. Kolikšna je verjetnost bolezni, če sta pozitivna oba testa? (d) Koliko oseb na $100\,000$ testiranih je pozitivnih v prvem testu?

**Podatki:** $P(D) = 0{,}001$, $P(+ \mid D) = 0{,}99$, $P(- \mid D^c) = 0{,}95$, torej $P(+ \mid D^c) = 0{,}05$; testa pogojno neodvisna glede na stanje
**Iščemo:** $P(+)$, $P(D \mid +)$, $P(D \mid ++)$, število pozitivnih na $100\,000$

:::formula
$P(+) = P(D)P(+ \mid D) + P(D^c)P(+ \mid D^c)$; $P(D \mid +) = \dfrac{P(D)P(+ \mid D)}{P(+)}$; pogojna neodvisnost: $P(++ \mid D) = P(+ \mid D)^2$
:::

**Rešitev:**

1. Popoln sistem sta $D$ (bolan) in $D^c$ (zdrav), $P(D^c) = 0{,}999$.
2. (a) $P(+) = 0{,}001 \cdot 0{,}99 + 0{,}999 \cdot 0{,}05 = 0{,}00099 + 0{,}04995 = 0{,}05094$.
3. (b) Bayes: $P(D \mid +) = 0{,}00099/0{,}05094 \approx 0{,}0194$, okoli $1{,}9\,\%$.
4. Razlog za majhno vrednost: lažno pozitivnih ($0{,}04995$) je okoli $50$-krat več kot resnično pozitivnih ($0{,}00099$), ker je zdravih tisočkrat več.
5. (c) Pri danem stanju sta testa neodvisna: $P(++ \mid D) = 0{,}99^2 = 0{,}9801$, $P(++ \mid D^c) = 0{,}05^2 = 0{,}0025$.
6. $P(D \mid ++) = \dfrac{0{,}001 \cdot 0{,}9801}{0{,}001 \cdot 0{,}9801 + 0{,}999 \cdot 0{,}0025} \approx \dfrac{0{,}000980}{0{,}000980 + 0{,}002498} \approx 0{,}282$.
7. Enak rezultat dobimo, če aposteriorno verjetnost po prvem testu ($0{,}0194$) vzamemo za apriorno pri drugem: Bayesovo formulo lahko uporabljamo zaporedno.
8. (d) Pozitivnih: $0{,}05094 \cdot 100\,000 \approx 5094$, od tega le $99$ bolnih.
9. Odgovor: (a) $P(+) \approx 0{,}051$; (b) $P(D \mid +) \approx 1{,}9\,\%$; (c) po dveh pozitivnih testih okoli $28\,\%$; (d) okoli $5100$ pozitivnih na $100\,000$. Zato pozitiven presejalni test vedno potrdimo z natančnejšo metodo.

### Primer 4 – zdaj ti

Starša sta heterozigota $Aa$ za recesivno lastnost; alel $A$ je dominanten. Otrok ima dominanten fenotip (ni izrazil recesivne lastnosti). Kolikšna je verjetnost, da je heterozigot? Aleli se dedujejo neodvisno in enako verjetno.

**Podatki:** starša $Aa \times Aa$; vsak starš prenese $A$ ali $a$ z verjetnostjo $1/2$, neodvisno; otrok ima dominanten fenotip
**Iščemo:** $P(E \mid B)$, kjer je $E$ dogodek »otrok je heterozigot« in $B$ »dominanten fenotip«

:::formula
$P(E \mid B) = \dfrac{P(E \cap B)}{P(B)}$
:::

**Rešitev:**

1. Prostor izidov (alel od matere, alel od očeta): $\{AA, Aa, aA, aa\}$, vsi z verjetnostjo $1/4$.
2. Dominanten fenotip: $B = \{AA, Aa, aA\}$, $P(B) = 3/4$.
3. Zdaj ti: določi $E \cap B$ in izračunaj pogojno verjetnost. (Dogodek ne imenujemo $A$, ker je $A$ tu ime alela.)

:::premisli
Kolikšna je verjetnost, da je otrok heterozigot?
---
Heterozigot je $E = \{Aa, aA\}$, kar je v celoti v $B$; $P(E \cap B) = 2/4$. Torej $P = (2/4)/(3/4) = 2/3$. Brez podatka o fenotipu bi bila $1/2$: pogoj izloči izid $aa$ in skrči prostor izidov.
:::

## Pogoste napake

- **Zamenjava $P(A \mid B)$ in $P(B \mid A)$.** »Test je $99\,\%$ natančen, torej sem bolan z $99\,\%$.« Občutljivost je $P(+ \mid D)$, zanima pa nas $P(D \mid +)$, ki je odvisna od prevalence.
- **Vsota za nezdružljive tudi, ko dogodka nista nezdružljiva.** $P(A \cup B) = P(A) + P(B)$ velja le pri $A \cap B = \emptyset$; sicer odštej $P(A \cap B)$, drugače lahko dobiš verjetnost nad $1$.
- **Nezdružljivo = neodvisno.** Ravno nasprotno: nezdružljiva dogodka s pozitivnima verjetnostma sta odvisna, saj eden izključi drugega.
- **Napačen način štetja.** Pri izbiri epruvet vrstni red ne šteje ($\binom{n}{k}$), pri zaporedju DNA šteje in ponavljanje je dovoljeno ($n^k$). Pred štetjem si odgovori na obe vprašanji iz tabele.
- **»Vsaj eden« z neposrednim seštevanjem.** Lažje in varneje je $1 - P(\text{noben})$.

## Povzetek

- Klasična verjetnost: $P(A) = |A|/|\Omega|$ pri enako verjetnih izidih; $P(A^c) = 1 - P(A)$, $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.
- Štetje: urejeno brez ponavljanja $n!/(n-k)!$, s ponavljanjem $n^k$; neurejeno $\binom{n}{k}$; permutacije $n!$.
- Pogojna verjetnost $P(A \mid B) = P(A \cap B)/P(B)$ skrči prostor izidov na $B$.
- Popolna verjetnost $P(A) = \sum P(H_i)P(A \mid H_i)$; Bayes $P(H_k \mid A) = P(H_k)P(A \mid H_k)/P(A)$.
- Neodvisnost: $P(A \cap B) = P(A)P(B)$; ni isto kot nezdružljivost.

## Za izpit

Znati moraš povedati:

- klasično definicijo verjetnosti in Kolmogorove aksiome ter dokaz formule za $P(A \cup B)$;
- osnovni izrek kombinatorike in izpeljavo $\binom{n}{k}$;
- definicijo pogojne verjetnosti in pravilo množenja;
- formulo o popolni verjetnosti in Bayesovo formulo s pogoji in dokazoma;
- definicijo neodvisnosti dveh in več dogodkov ter razliko med neodvisnostjo in nezdružljivostjo.

### Naloga 1

Laboratorij dobi šaržo $20$ epruvet. Iz izkušenj ve, da je $90\,\%$ šarž »dobrih« (v njih je natanko $1$ kontaminirana epruveta), $10\,\%$ pa »slabih« (natanko $5$ kontaminiranih). Iz šarže naključno izberejo $4$ epruvete brez vračanja in med njimi najdejo natanko eno kontaminirano. (a) Kolikšna je verjetnost tega izida pri dobri in pri slabi šarži? (b) Kolikšna je po pregledu verjetnost, da je šarža slaba? (c) Iz preostalih $16$ epruvet vzamejo še eno. Kolikšna je verjetnost, da je kontaminirana?

**Rešitev:**

1. Hipotezi: $H_1$ (dobra, $P(H_1) = 0{,}9$) in $H_2$ (slaba, $P(H_2) = 0{,}1$); dogodek $E$: »med $4$ izbranimi je natanko $1$ kontaminirana«. Vseh izbir je $\binom{20}{4} = 4845$.
2. (a) Dobra šarža: kontaminirano izberemo na $\binom{1}{1} = 1$ način, preostale tri izmed $19$ čistih na $\binom{19}{3} = 969$ načinov; $P(E \mid H_1) = 969/4845 = 0{,}2$.
3. Slaba šarža: $\binom{5}{1}\binom{15}{3} = 5 \cdot 455 = 2275$; $P(E \mid H_2) = 2275/4845 \approx 0{,}470$.
4. (b) Popolna verjetnost: $P(E) = 0{,}9 \cdot 0{,}2 + 0{,}1 \cdot 0{,}470 \approx 0{,}180 + 0{,}047 = 0{,}227$.
5. Bayes: $P(H_2 \mid E) = 0{,}047/0{,}227 \approx 0{,}207$. Ena najdena kontaminirana epruveta poveča verjetnost slabe šarže z $10\,\%$ na okoli $21\,\%$.
6. (c) Ponovno uporabimo popolno verjetnost, zdaj z aposteriornima verjetnostma $P(H_1 \mid E) \approx 0{,}793$ in $P(H_2 \mid E) \approx 0{,}207$.
7. Če je šarža dobra, je bila edina kontaminirana že najdena: med preostalimi $16$ ni nobene, verjetnost $0$. Če je slaba, so med $16$ preostalimi še $4$ kontaminirane: verjetnost $4/16 = 0{,}25$.
8. $P(\text{naslednja kontaminirana} \mid E) \approx 0{,}793 \cdot 0 + 0{,}207 \cdot 0{,}25 \approx 0{,}052$.
9. Odgovor: (a) $0{,}20$ in $0{,}47$; (b) okoli $21\,\%$; (c) okoli $5{,}2\,\%$. Ključ je v koraku 6: po opazovanju moramo računati s posodobljenimi verjetnostmi hipotez, ne z apriornimi.

### Naloga 2

Natančno definiraj pogojno verjetnost in dokaži formulo o popolni verjetnosti in Bayesovo formulo; navedi vse pogoje. Nato dokaži: (a) če sta $A$ in $B$ neodvisna, sta neodvisna tudi $A$ in $B^c$; (b) nezdružljiva dogodka s pozitivnima verjetnostma nista neodvisna.

**Rešitev:**

1. Definicija: za $P(B) > 0$ je $P(A \mid B) = P(A \cap B)/P(B)$.
2. Popolna verjetnost: $H_1, \dots, H_n$ paroma nezdružljivi, unija $\Omega$, $P(H_i) > 0$. Iz $A = \bigcup_i (A \cap H_i)$ in aditivnosti: $P(A) = \sum_i P(A \cap H_i) = \sum_i P(H_i)P(A \mid H_i)$.
3. Bayes: pri dodatnem pogoju $P(A) > 0$ je $P(H_k \mid A) = P(H_k \cap A)/P(A) = P(H_k)P(A \mid H_k)/\sum_i P(H_i)P(A \mid H_i)$.
4. (a) $A = (A \cap B) \cup (A \cap B^c)$ nezdružljivo, zato $P(A \cap B^c) = P(A) - P(A \cap B) = P(A) - P(A)P(B) = P(A)(1 - P(B)) = P(A)P(B^c)$.
5. (b) Če je $A \cap B = \emptyset$, je $P(A \cap B) = 0$, a $P(A)P(B) > 0$; produktno pravilo ne velja.

### Naloga 3

Dvakrat vržemo pošten kovanec. Naj bo $A$ »prvi met je cifra«, $B$ »drugi met je cifra« in $E$ »oba meta sta enaka«. Pokaži, da so dogodki paroma neodvisni, niso pa neodvisni vsi trije. Kaj to pomeni za modele zanesljivosti, ki preverijo le pare komponent?

**Rešitev:**

1. $\Omega = \{CC, CG, GC, GG\}$ ($C$ cifra, $G$ grb), vsi izidi z verjetnostjo $1/4$.
2. $A = \{CC, CG\}$, $B = \{CC, GC\}$, $E = \{CC, GG\}$; vsak ima verjetnost $1/2$.
3. Pari: $A \cap B = \{CC\}$, $A \cap E = \{CC\}$, $B \cap E = \{CC\}$, vsak z verjetnostjo $1/4 = \tfrac12 \cdot \tfrac12$. Paroma so neodvisni.
4. Vsi trije: $A \cap B \cap E = \{CC\}$ z verjetnostjo $1/4$, produkt pa je $1/8$. Neodvisnost vseh treh ne velja.
5. Razlog: če vemo $A$ in $B$, je $E$ gotov; dva dogodka skupaj določita tretjega.
6. Pomen: preverjanje neodvisnosti po parih ne zadošča; pri sistemih s tremi ali več komponentami mora produktno pravilo veljati za vse podmnožice, sicer verjetnost hkratne odpovedi napačno ocenimo.

## Drugače: Na sliki

Presejalni test iz uvoda kot drevo verjetnosti za $100\,000$ ljudi:

```
100 000 testiranih
├─ bolni 100
│  ├─ test + : 99
│  └─ test − : 1
└─ zdravi 99 900
   ├─ test + : 4995
   └─ test − : 94 905
```

Bayesova formula je na drevesu le delež: med vsemi vejami »test +« ($99 + 4995 = 5094$) je bolnih $99$, torej $99/5094 \approx 1{,}9\,\%$. Formula o popolni verjetnosti sešteje vse veje, ki se končajo s »test +«.

Pogojno verjetnost si predstavljaj z Vennovim diagramom: $\Omega$ je pravokotnik, $A$ in $B$ krogi. $P(A \mid B)$ je delež kroga $B$, ki ga pokriva presek z $A$. Ko vemo za $B$, zunanjost kroga $B$ izgine; krog $B$ postane novi »pravokotnik«.

## Drugače: Uporaba v stroki

**Diagnostika.** Pozitivna napovedna vrednost testa, $P(D \mid +)$, je odvisna od prevalence. Isti test, ki je v specialistični ambulanti (kjer je bolnih pogosto več kot $10\,\%$) veliko bolj zanesljiv (pri prevalenci $10\,\%$ je $P(D \mid +) \approx 0{,}69$), je v splošnem presejanju večinoma lažno pozitiven. Zato zdravstveni sistemi presejalne programe načrtujejo v dveh korakih.

**Genetika.** Mendlova pravila so klasična verjetnost na prostoru kombinacij alelov; pogojne verjetnosti (kot v Primeru 4) uporabljajo genetski svetovalci, ko izračunajo verjetnost, da je zdrav sorodnik prenašalec. Pri iskanju motivov v genomu kombinatorika pove, kolikokrat bi neko zaporedje pričakovali po naključju.

**Varnost in zanesljivost.** Verjetnost odpovedi zaporedno vezanih komponent je $1 - \prod(1 - p_i)$, vzporedno vezanih (rezervnih) pa $\prod p_i$, kjer je $p_i$ verjetnost odpovedi $i$-te komponente – a le, če so odpovedi neodvisne. Analize drevesa napak v kemijski in jedrski industriji zato posebej iščejo **odpovedi s skupnim vzrokom**, ki to predpostavko kršijo.

## Drugače: Korak za korakom s številkami

Laboratorij dobiva vzorce iz treh obratov: $50\,\%$ iz prvega, $30\,\%$ iz drugega, $20\,\%$ iz tretjega; kontaminiranih je v njih po vrsti $1\,\%$, $2\,\%$ in $5\,\%$. Vzorec je kontaminiran. Iz katerega obrata najverjetneje izvira?

1. **Hipoteze in apriorne verjetnosti:** $P(H_1) = 0{,}5$; $P(H_2) = 0{,}3$; $P(H_3) = 0{,}2$ – skupaj $1$.
2. **Pogojne verjetnosti podatka:** $P(K \mid H_1) = 0{,}01$; $P(K \mid H_2) = 0{,}02$; $P(K \mid H_3) = 0{,}05$.
3. **Zmnožki (veje drevesa):** $0{,}5 \cdot 0{,}01 = 0{,}005$; $0{,}3 \cdot 0{,}02 = 0{,}006$; $0{,}2 \cdot 0{,}05 = 0{,}010$.
4. **Popolna verjetnost (vsota vej):** $P(K) = 0{,}005 + 0{,}006 + 0{,}010 = 0{,}021$.
5. **Bayes (delež vsake veje):** $0{,}005/0{,}021 \approx 0{,}238$; $0{,}006/0{,}021 \approx 0{,}286$; $0{,}010/0{,}021 \approx 0{,}476$.
6. **Preizkus:** $0{,}238 + 0{,}286 + 0{,}476 = 1{,}000$. ✓
7. **Sklep:** najverjetneje iz tretjega obrata, čeprav ta da najmanj vzorcev – njegov visok delež kontaminacije prevlada.

## Preveri se

? Katera trditev je pravilna?
- Nezdružljiva dogodka s pozitivnima verjetnostma sta neodvisna.
~ Nezdružljivost pomeni, da eden izključuje drugega; podatek o $B$ zmanjša verjetnost $A$ na nič, zato sta odvisna.
- Za vsak par dogodkov velja $P(A \mid B) = P(B \mid A)$.
~ To velja le, če je $P(A) = P(B)$ ali $P(A \cap B) = 0$; sicer se razlikujeta za faktor $P(A)/P(B)$.
+ Če je $P(A \mid B) = P(A)$ in $P(B) > 0$, sta $A$ in $B$ neodvisna.
> Iz $P(A \mid B) = P(A)$ sledi $P(A \cap B) = P(B)P(A \mid B) = P(A)P(B)$, kar je definicija neodvisnosti.

? Na koliko načinov lahko izmed $12$ laboratorijskih miši izberemo $5$ za poskusno skupino?
- $95\,040$
~ To je število urejenih izbir $12!/7!$. V skupini vrstni red ne šteje, zato deli še s $5! = 120$.
+ $792$
- $248\,832$
~ To je $12^5$, kot da bi lahko isto miš izbrali večkrat in bi vrstni red štel.
> $\binom{12}{5} = 12!/(5!\,7!) = 792$.

? Kje je napaka? »$P(A) = 0{,}6$, $P(B) = 0{,}5$, $P(A \cap B) = 0{,}3$. (1) $P(A \cup B) = P(A) + P(B) = 1{,}1$. (2) Ker je to več kot $1$, sta dogodka nemogoča.«
+ V koraku 1: pozabljen je presek; pravilno $0{,}6 + 0{,}5 - 0{,}3 = 0{,}8$.
- V koraku 2: verjetnost je lahko večja od $1$.
~ Verjetnost nikoli ni večja od $1$; rezultat $1{,}1$ je znak, da je napačen korak 1.
- Ni napake: podatki so protislovni.
~ Podatki so skladni: $P(A \cap B) = 0{,}3$ je manjša od obeh verjetnosti. Celo $P(A)P(B) = 0{,}3$, zato sta $A$ in $B$ neodvisna.
> Vsota $P(A) + P(B)$ šteje presek dvakrat; $P(A \cup B) = 0{,}8$.

? Test ima $P(+ \mid D) = 0{,}99$ in $P(+ \mid D^c) = 0{,}05$. Primerjaj $P(D \mid +)$ v populaciji s prevalenco $0{,}1\,\%$ in v ambulanti s prevalenco $20\,\%$.
- Enaki sta, ker je test isti.
~ Lastnosti testa so enake, aposteriorna verjetnost pa je odvisna tudi od apriorne – prevalence.
+ V ambulanti je mnogo večja (okoli $83\,\%$), v populaciji okoli $2\,\%$.
- V populaciji je večja, ker je tam več testiranih.
~ Število testiranih ne vpliva na verjetnost; odločilna je prevalenca.
> V ambulanti: $0{,}2 \cdot 0{,}99/(0{,}2 \cdot 0{,}99 + 0{,}8 \cdot 0{,}05) = 0{,}198/0{,}238 \approx 0{,}83$. Pri prevalenci $0{,}1\,\%$ je okoli $0{,}019$.

? Posejemo tri semena nove sorte; vsako vzklije z verjetnostjo $0{,}8$, neodvisno od drugih. Kolikšna je verjetnost, da vzklije vsaj eno?
- $0{,}8$
~ To je verjetnost za eno seme. Pri treh semenih je možnosti za uspeh več.
- $2{,}4$
~ Seštel si verjetnosti nezdružljivih dogodkov, a dogodki niso nezdružljivi; verjetnost ne more biti večja od $1$.
+ $0{,}992$
> $P(\text{nobeno}) = 0{,}2^3 = 0{,}008$, zato $P(\geq 1) = 1 - 0{,}008 = 0{,}992$.

:::simboli
\Omega | prostor izidov | | –
A, B | dogodka | | –
E | dogodek v nalogi (heterozigot, »oba meta enaka«, »natanko ena kontaminirana«) | | –
P | verjetnost | | – | pri enako verjetnih izidih delež ugodnih izidov
n | število elementov (možnosti) | | –
k | število izbranih elementov | | –
k_1, k_2 | števila enakih elementov | | –
n_i | število možnosti v i-tem koraku | | –
H_i, H_k | hipoteze popolnega sistema | | –
i | zaporedna številka | | –
D | dogodek »oseba je bolna« | | –
c | nasprotni dogodek (nadpis, npr. $D^c$ zdrav) | | –
K | število kontaminiranih epruvet | | – | v »Korak za korakom« dogodek »kontaminiran«
N | število vseh epruvet | | –
j | število kontaminiranih med izbranimi | | –
:::
