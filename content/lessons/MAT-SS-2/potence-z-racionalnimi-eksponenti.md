---
stanje: osnutek
demo: graf
avtor: AI
---

## Zakaj se tega učimo

V 17. stoletju sta angleška matematika John Wallis in Isaac Newton iskala način, kako s koreni računati enako preprosto kot s potencami. Wallis je razmišljal o potencah z negativnimi in ulomljenimi eksponenti, Newton pa je pri svojih računih korene zapisoval kot potence, na primer $a^{\frac{1}{2}}$ namesto $\sqrt{a}$. Ta zapis je ostal do danes.

Danes ga srečaš tudi v medicini. Pri odmerjanju nekaterih zdravil zdravniki potrebujejo telesno površino bolnika, ki jo izračunajo kot potenco z eksponentom $\frac{1}{2}$. Veterinarji dnevno potrebo psa po energiji v mirovanju ocenijo z izrazom $70 \cdot M^{\frac{3}{4}}$, kjer je $M$ masa v kilogramih. Kaj pomeni eksponent $\frac{3}{4}$ in kako ga izračunaš brez kalkulatorja? Odgovor je v zvezi med potencami in koreni, ki jih že poznaš.

## Razlaga

**1. Lestev potenc.** Število $16$ je $16^1$, število $1$ pa $16^0$. Od eksponenta $0$ do eksponenta $1$ se vrednost pomnoži s $16$. Razdelimo to pot na štiri enake korake, pri katerih vsak korak vrednost pomnoži z istim faktorjem. Ker je $2 \cdot 2 \cdot 2 \cdot 2 = 16$, je ta faktor $2$:

| eksponent | potenca | vrednost |
|---|---|---|
| $0$ | $16^0$ | $1$ |
| $\frac{1}{4}$ | $16^{\frac{1}{4}}$ | $2$ |
| $\frac{1}{2}$ | $16^{\frac{1}{2}}$ | $4$ |
| $\frac{3}{4}$ | $16^{\frac{3}{4}}$ | $8$ |
| $1$ | $16^1$ | $16$ |

Eksponent raste za $\frac{1}{4}$, vrednost pa se vsakič podvoji. Na sredini lestve je $4 = \sqrt{16}$, na prvem klinu $2 = \sqrt[4]{16}$, na tretjem $8 = \left(\sqrt[4]{16}\right)^3$. Ulomek v eksponentu torej pove, kateri koren vzameš in na katero potenco ga dvigneš.

:::premisli
Nadaljuj lestev v obe smeri: koliko je $16^{\frac{5}{4}}$ in koliko $16^{-\frac{1}{4}}$?
---
Korak navzgor pomnoži z $2$: $16^{\frac{5}{4}} = 16 \cdot 2 = 32$. Korak navzdol od $16^0 = 1$ deli z $2$: $16^{-\frac{1}{4}} = \frac{1}{2}$.
:::

**2. Ponovitev pravil za potence.** Za $a, b \ne 0$ in cela števila $m, n$ velja:

$$a^m \cdot a^n = a^{m+n}, \qquad a^m : a^n = a^{m-n}, \qquad \left(a^m\right)^n = a^{m \cdot n},$$
$$(a \cdot b)^n = a^n \cdot b^n, \qquad a^0 = 1, \qquad a^{-n} = \frac{1}{a^n}.$$

**3. Kaj naj pomeni $a^{\frac{1}{2}}$?** Želimo, da pravila veljajo tudi za ulomke v eksponentu. Če velja pravilo $\left(a^m\right)^n = a^{m \cdot n}$, potem je

$$\left(a^{\frac{1}{2}}\right)^2 = a^{\frac{1}{2} \cdot 2} = a^1 = a.$$

Število $a^{\frac{1}{2}}$ je torej število, katerega kvadrat je $a$. To je ravno $\sqrt{a}$. Enako velja za $n$-ti koren: ker mora biti $\left(a^{\frac{1}{n}}\right)^n = a$, je $a^{\frac{1}{n}} = \sqrt[n]{a}$.

**4. Definicija.** Lestev zapišemo s simboli. Naj bo $a > 0$, $m$ celo število in $n$ naravno število ($n \ge 2$). Potem je

$$a^{\frac{m}{n}} = \sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m.$$

Imenovalec ulomka pove **stopnjo korena**, števec pa **eksponent potence**. Obe obliki na desni dasta isto število. Pri računanju na pamet je navadno lažje najprej koreniti in nato potencirati, ker so števila manjša: $8^{\frac{2}{3}} = \left(\sqrt[3]{8}\right)^2 = 2^2 = 4$.

Za osnovo $0$ in pozitiven eksponent je $0^{\frac{m}{n}} = 0$.

:::premisli
Ali je $0{,}25^{\frac{1}{2}}$ večje ali manjše od $0{,}25$? Napovej, nato izračunaj.
---
Večje: $0{,}25^{\frac{1}{2}} = \sqrt{0{,}25} = 0{,}5$. Pri osnovi med $0$ in $1$ koren število poveča, ker je $0{,}5 \cdot 0{,}5 = 0{,}25$ manj od $0{,}5$.
:::

**5. Negativni eksponent.** Kot pri celih eksponentih velja

$$a^{-\frac{m}{n}} = \frac{1}{a^{\frac{m}{n}}}.$$

Na primer $25^{-\frac{1}{2}} = \dfrac{1}{\sqrt{25}} = \dfrac{1}{5}$. Negativni eksponent ne pomeni negativnega rezultata, temveč obratno vrednost.

**6. Zakaj zahtevamo $a > 0$?** Ulomek lahko zapišemo na več načinov: $\dfrac{1}{3} = \dfrac{2}{6}$. Za pozitivno osnovo to ne povzroča težav. Za negativno osnovo pa bi dobili protislovje: po prvem zapisu bi bilo $(-8)^{\frac{1}{3}} = \sqrt[3]{-8} = -2$, po drugem pa $(-8)^{\frac{2}{6}} = \sqrt[6]{(-8)^2} = \sqrt[6]{64} = 2$. Zato potenc z racionalnim eksponentom in negativno osnovo ne uporabljamo. Kubični koren $\sqrt[3]{-8} = -2$ seveda obstaja, le kot potenco ga ne pišemo.

**7. Pravila veljajo naprej.** Za $a, b > 0$ in racionalni števili $r, s$ veljajo enaka pravila kot pri celih eksponentih:

| Pravilo | Primer |
|---|---|
| $a^r \cdot a^s = a^{r+s}$ | $a^{\frac{1}{2}} \cdot a^{\frac{1}{3}} = a^{\frac{5}{6}}$ |
| $a^r : a^s = a^{r-s}$ | $a^{\frac{3}{4}} : a^{\frac{1}{4}} = a^{\frac{1}{2}}$ |
| $\left(a^r\right)^s = a^{r \cdot s}$ | $\left(a^{\frac{2}{3}}\right)^{\frac{3}{4}} = a^{\frac{1}{2}}$ |
| $(a \cdot b)^r = a^r \cdot b^r$ | $(4x)^{\frac{1}{2}} = 2x^{\frac{1}{2}}$ |
| $\left(\dfrac{a}{b}\right)^r = \dfrac{a^r}{b^r}$ | $\left(\dfrac{8}{27}\right)^{\frac{1}{3}} = \dfrac{2}{3}$ |

**8. Prevajanje med koreni in potencami.** Postopek je vedno enak: koren prepišemo v potenco, uporabimo pravila za potence in rezultat po želji spet zapišemo s korenom. Tako dobimo tudi pravila za korene, ki si jih spoznal prej, na primer $\sqrt[m]{\sqrt[n]{a}} = \left(a^{\frac{1}{n}}\right)^{\frac{1}{m}} = a^{\frac{1}{mn}} = \sqrt[mn]{a}$. Novo pa je, da lahko množimo korene **različnih stopenj**: $\sqrt{a} \cdot \sqrt[3]{a} = a^{\frac{1}{2}+\frac{1}{3}} = a^{\frac{5}{6}} = \sqrt[6]{a^5}$.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj vrednosti potenc: a) $27^{\frac{2}{3}}$, b) $16^{-\frac{3}{4}}$, c) $\left(\dfrac{4}{9}\right)^{\frac{3}{2}}$.

**Podatki:** potence $27^{\frac{2}{3}}$, $16^{-\frac{3}{4}}$ in $\left(\dfrac{4}{9}\right)^{\frac{3}{2}}$
**Iščemo:** vrednost vsake potence

:::formula
$a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m$ in $\;a^{-r} = \dfrac{1}{a^r}$
:::

**Rešitev:**

1. a) $27^{\frac{2}{3}} = \left(\sqrt[3]{27}\right)^2 = 3^2 = 9$.
2. b) Najprej negativni eksponent: $16^{-\frac{3}{4}} = \dfrac{1}{16^{\frac{3}{4}}}$. Nato $16^{\frac{3}{4}} = \left(\sqrt[4]{16}\right)^3 = 2^3 = 8$. Torej je $16^{-\frac{3}{4}} = \dfrac{1}{8}$.
3. c) Potenciramo števec in imenovalec: $\left(\dfrac{4}{9}\right)^{\frac{3}{2}} = \dfrac{\left(\sqrt{4}\right)^3}{\left(\sqrt{9}\right)^3} = \dfrac{2^3}{3^3} = \dfrac{8}{27}$.
4. Odgovor: $27^{\frac{2}{3}} = 9$, $16^{-\frac{3}{4}} = \dfrac{1}{8}$ in $\left(\dfrac{4}{9}\right)^{\frac{3}{2}} = \dfrac{8}{27}$.

### Primer 2 (srednji)

Poenostavi izraz $\dfrac{\sqrt{a} \cdot \sqrt[3]{a^2}}{\sqrt[4]{a^3}}$ za $a > 0$ in rezultat zapiši s korenom.

**Podatki:** izraz $\dfrac{\sqrt{a} \cdot \sqrt[3]{a^2}}{\sqrt[4]{a^3}}$, pogoj $a > 0$
**Iščemo:** izraz v obliki enega korena

:::formula
$\sqrt[n]{a^m} = a^{\frac{m}{n}}$, $\;a^r \cdot a^s = a^{r+s}$, $\;a^r : a^s = a^{r-s}$
:::

**Rešitev:**

1. Korene zapišemo kot potence: $\sqrt{a} = a^{\frac{1}{2}}$, $\sqrt[3]{a^2} = a^{\frac{2}{3}}$, $\sqrt[4]{a^3} = a^{\frac{3}{4}}$.
2. Eksponent rezultata: $\dfrac{1}{2} + \dfrac{2}{3} - \dfrac{3}{4}$. Skupni imenovalec je $12$: $\dfrac{6}{12} + \dfrac{8}{12} - \dfrac{9}{12} = \dfrac{5}{12}$.
3. Izraz je enak $a^{\frac{5}{12}} = \sqrt[12]{a^5}$.
4. Preverjanje za $a = 2$: $\dfrac{1{,}4142 \cdot 1{,}5874}{1{,}6818} \approx 1{,}3348$ in $2^{\frac{5}{12}} \approx 1{,}3348$.
5. Odgovor: izraz je enak $\sqrt[12]{a^5}$.

### Primer 3 (težji): energija v mirovanju

Veterinarji dnevno potrebo živali po energiji v mirovanju ocenijo z izrazom $P = 70 \cdot M^{\frac{3}{4}}$, kjer je $M$ masa v kilogramih, $P$ pa v kilokalorijah na dan. Izračunaj $P$ za psa z maso $16\,\mathrm{kg}$ in za žival z maso $81\,\mathrm{kg}$. Kolikokrat več energije potrebuje težja žival in kolikokrat je težja?

**Podatki:** $P = 70 \cdot M^{\frac{3}{4}}$ ($P$ v $\mathrm{kcal/dan}$, $M$ v $\mathrm{kg}$), $M_1 = 16\,\mathrm{kg}$, $M_2 = 81\,\mathrm{kg}$
**Iščemo:** $P_1$, $P_2$, razmerje $\dfrac{P_2}{P_1}$ in razmerje mas $\dfrac{M_2}{M_1}$

:::formula
$P = 70 \cdot M^{\frac{3}{4}}$ in $\;a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m$
:::

**Rešitev:**

1. Najprej korenimo, ker so števila manjša: $\sqrt[4]{16} = 2$, zato je $16^{\frac{3}{4}} = 2^3 = 8$.
2. Energija za psa: $P_1 = 70 \cdot 8 = 560$, torej $560\,\mathrm{kcal/dan}$.
3. Enako za težjo žival: $\sqrt[4]{81} = 3$, zato je $81^{\frac{3}{4}} = 3^3 = 27$ in $P_2 = 70 \cdot 27 = 1890$, torej $1890\,\mathrm{kcal/dan}$.
4. Razmerje energij: $\dfrac{1890}{560} = 3{,}375$; razmerje mas: $\dfrac{81}{16} = 5{,}0625$.
5. Odgovor: pes potrebuje približno $560\,\mathrm{kcal}$ na dan, težja žival $1890\,\mathrm{kcal}$. Težja žival je približno $5$-krat težja, energije pa potrebuje le približno $3{,}4$-krat več. Zato odmerkov hrane ne računamo kar sorazmerno z maso.

### Primer 4 – zdaj ti

Poenostavi izraz $\left(\dfrac{x^{\frac{3}{4}} \cdot y^{-\frac{1}{2}}}{x^{-\frac{1}{4}} \cdot y^{\frac{1}{6}}}\right)^{\frac{3}{2}}$ za $x, y > 0$. Nato izračunaj njegovo vrednost za $x = 4$ in $y = 8$.

**Podatki:** izraz $\left(\dfrac{x^{\frac{3}{4}} \cdot y^{-\frac{1}{2}}}{x^{-\frac{1}{4}} \cdot y^{\frac{1}{6}}}\right)^{\frac{3}{2}}$, pogoj $x, y > 0$, vrednosti $x = 4$, $y = 8$
**Iščemo:** poenostavljen izraz in njegovo vrednost

:::formula
$a^r : a^s = a^{r-s}$, $\;(a^r)^s = a^{r \cdot s}$, $\;(a \cdot b)^r = a^r \cdot b^r$
:::

**Rešitev:**

1. Najprej uredimo ulomek v oklepaju; pri deljenju eksponente odštejemo. Pri $x$: $\dfrac{3}{4} - \left(-\dfrac{1}{4}\right) = \dfrac{4}{4} = 1$. Pri $y$: $-\dfrac{1}{2} - \dfrac{1}{6} = -\dfrac{3}{6} - \dfrac{1}{6} = -\dfrac{2}{3}$.
2. V oklepaju je torej $x^1 \cdot y^{-\frac{2}{3}}$.
3. Potenciramo z $\dfrac{3}{2}$: $x^{1 \cdot \frac{3}{2}} \cdot y^{-\frac{2}{3} \cdot \frac{3}{2}} = x^{\frac{3}{2}} \cdot y^{-1} = \dfrac{x^{\frac{3}{2}}}{y}$.
4. S korenom: $x^{\frac{3}{2}} = x^{1 + \frac{1}{2}} = x\sqrt{x}$, zato je izraz enak $\dfrac{x\sqrt{x}}{y}$.
5. Zdaj ti: vstavi $x = 4$ in $y = 8$ v poenostavljeni izraz.

:::premisli
Kolikšna je vrednost izraza za $x = 4$ in $y = 8$?
---
$\dfrac{4 \cdot \sqrt{4}}{8} = \dfrac{4 \cdot 2}{8} = 1$. Preverjanje v prvotnem izrazu: števec $4^{\frac{3}{4}} \cdot 8^{-\frac{1}{2}} \approx 2{,}8284 \cdot 0{,}3536 \approx 1{,}000$, imenovalec $4^{-\frac{1}{4}} \cdot 8^{\frac{1}{6}} \approx 0{,}7071 \cdot 1{,}4142 \approx 1{,}000$, ulomek je $1$ in $1^{\frac{3}{2}} = 1$. Izraz je enak $\dfrac{x\sqrt{x}}{y}$ in ima vrednost $1$.
:::

## Pogoste napake

- **Ulomek v eksponentu kot deljenje.** $8^{\frac{1}{3}} = \dfrac{8}{3}$ je napačno. Eksponent $\dfrac{1}{3}$ pomeni kubični koren, zato je $8^{\frac{1}{3}} = \sqrt[3]{8} = 2$.
- **Negativni eksponent kot negativno število.** $25^{-\frac{1}{2}} = -5$ ni res. Minus v eksponentu pomeni obratno vrednost: $25^{-\frac{1}{2}} = \dfrac{1}{25^{\frac{1}{2}}} = \dfrac{1}{5}$. Potenca s pozitivno osnovo je vedno pozitivna.
- **Zamenjava števca in imenovalca.** $a^{\frac{2}{3}} = \sqrt{a^3}$ je napačno. Imenovalec je stopnja korena, števec eksponent: $a^{\frac{2}{3}} = \sqrt[3]{a^2}$. Preizkus z $a = 8$: $\sqrt[3]{64} = 4$, toda $\sqrt{512} \approx 22{,}6$.
- **Seštevanje potenc kot množenje.** $a^{\frac{1}{2}} + a^{\frac{1}{3}} = a^{\frac{5}{6}}$ ni res. Eksponente seštevamo le pri **množenju** potenc z isto osnovo. Vsote $\sqrt{a} + \sqrt[3]{a}$ ne moremo zapisati kot eno potenco.
- **Negativna osnova.** Zapis $(-27)^{\frac{1}{3}}$ ni definiran, ker bi zapis z drugim ulomkom, na primer $(-27)^{\frac{2}{6}}$, dal drug rezultat. Kadar potrebuješ kubični koren negativnega števila, ga piši s korenom: $\sqrt[3]{-27} = -3$.

## Povzetek

- Za $a > 0$, $m \in \mathbb{Z}$, $n \in \mathbb{N}$, $n \ge 2$: $a^{\frac{m}{n}} = \sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m$; posebej $a^{\frac{1}{n}} = \sqrt[n]{a}$ in $a^{\frac{1}{2}} = \sqrt{a}$.
- Imenovalec eksponenta je stopnja korena, števec je eksponent potence.
- $a^{-\frac{m}{n}} = \dfrac{1}{a^{\frac{m}{n}}}$: negativni eksponent pomeni obratno vrednost.
- Osnova mora biti pozitivna (pri osnovi $0$ eksponent pozitiven); potenc z negativno osnovo in racionalnim eksponentom ne pišemo.
- Pravila: $a^r a^s = a^{r+s}$, $a^r : a^s = a^{r-s}$, $(a^r)^s = a^{rs}$, $(ab)^r = a^r b^r$.
- Korene pretvori v potence, uporabi pravila in rezultat zapiši nazaj s korenom.

## Drugače: Z analogijo

Program za urejanje slik z enim klikom poveča sliko $8$-krat. Kaj bi bila »tretjina klika«? Tak manjši klik, da trije zaporedni dajo isto kot en cel. Če tretjina klika poveča za faktor $q$, mora veljati $q \cdot q \cdot q = 8$, torej $q = 2 = 8^{\frac{1}{3}}$. Dve tretjini klika povečata za $2 \cdot 2 = 4 = 8^{\frac{2}{3}}$.

Minus v eksponentu je klik nazaj: $8^{-\frac{1}{3}}$ sliko pomanjša na polovico, ne naredi pa je »negativne«. In zakaj so faktorji vedno pozitivni? Povečava s faktorjem $-2$ nima smisla, tako kot potenca z racionalnim eksponentom nima smisla pri negativni osnovi.

## Drugače: Na sliki

Nariši grafe funkcij $y = x^{\frac{1}{2}}$, $y = x^1$ in $y = x^{\frac{3}{2}}$ za $x \ge 0$. Nekaj vrednosti:

| $x$ | $\sqrt{x}$ | $x^1$ | $x\sqrt{x}$ |
|---|---|---|---|
| $0$ | $0$ | $0$ | $0$ |
| $1$ | $1$ | $1$ | $1$ |
| $4$ | $2$ | $4$ | $8$ |
| $9$ | $3$ | $9$ | $27$ |

Vsi trije grafi gredo skozi točki $(0, 0)$ in $(1, 1)$, ker je $1^r = 1$ za vsak eksponent. Za $x > 1$ je graf višje, čim večji je eksponent. Med $0$ in $1$ je ravno obratno: tam je $\sqrt{x}$ nad premico $y = x$, $x\sqrt{x}$ pa pod njo. Pri eksponentu med $0$ in $1$ graf raste vedno počasneje in se upogiba navzdol, pri eksponentu nad $1$ pa raste vedno hitreje. Premica $y = x$ loči ti dve skupini. V interaktivni simulaciji spodaj premikaj eksponent in opazuj, kako se graf zvezno preoblikuje iz ene oblike v drugo.

## Drugače: Iz vsakdanjega življenja

**Glasba.** Pri klavirju je oktava razdeljena na $12$ poltonov. Ton, ki je za oktavo višji, ima dvakrat večjo frekvenco. Ker so vsi poltoni enaki koraki, se frekvenca pri vsakem poltonu pomnoži z istim faktorjem $q$, za katerega velja $q^{12} = 2$. Torej je $q = 2^{\frac{1}{12}} = \sqrt[12]{2} \approx 1{,}0595$. Če ima ton A frekvenco $440\,\text{Hz}$, ima ton pol tona višje frekvenco približno $440\,\text{Hz} \cdot 1{,}0595 \approx 466{,}2\,\text{Hz}$. Kvinta je $7$ poltonov, zato je razmerje frekvenc $2^{\frac{7}{12}} \approx 1{,}498$, kar je zelo blizu razmerja $\dfrac{3}{2}$, ki ga uho zazna kot ubrano.

**Planeti.** Po tretjem Keplerjevem zakonu je kvadrat obhodnega časa planeta (v letih) enak kubu njegove povprečne oddaljenosti od Sonca (v astronomskih enotah): $T^2 = a^3$. Od tod je $a = T^{\frac{2}{3}}$. Mars obkroži Sonce v $1{,}88$ leta, zato je od Sonca oddaljen približno $1{,}88^{\frac{2}{3}} \approx 1{,}52$ astronomske enote.

## Drugače: Korak za korakom s številkami

**Izračunaj $32^{-\frac{3}{5}}$.**

1. Minus v eksponentu pomeni obratno vrednost: $32^{-\frac{3}{5}} = \dfrac{1}{32^{\frac{3}{5}}}$.
2. Imenovalec ulomka v eksponentu je $5$, zato potrebujemo peti koren: $\sqrt[5]{32} = 2$, ker je $2^5 = 32$.
3. Števec je $3$, zato rezultat korena potenciramo na tretjo: $2^3 = 8$.
4. Torej je $32^{\frac{3}{5}} = 8$ in $32^{-\frac{3}{5}} = \dfrac{1}{8} = 0{,}125$.

**Zapiši $\sqrt[3]{x} \cdot \sqrt[6]{x}$ z enim korenom ($x > 0$).**

1. Prevedemo v potence: $x^{\frac{1}{3}} \cdot x^{\frac{1}{6}}$.
2. Pri množenju seštejemo eksponente: $\dfrac{1}{3} + \dfrac{1}{6} = \dfrac{2}{6} + \dfrac{1}{6} = \dfrac{3}{6} = \dfrac{1}{2}$.
3. Rezultat je $x^{\frac{1}{2}} = \sqrt{x}$.
4. Preverjanje za $x = 64$: $\sqrt[3]{64} \cdot \sqrt[6]{64} = 4 \cdot 2 = 8$ in $\sqrt{64} = 8$.

## Drugače: Bolj natančno

**Definicija je dobra.** Ker lahko isti ulomek zapišemo kot $\dfrac{m}{n}$ ali $\dfrac{mk}{nk}$, moramo preveriti, da obe obliki dasta isto število. Za $a > 0$ označimo $b = \sqrt[n]{a^m}$, torej $b > 0$ in $b^n = a^m$. Potem je $b^{nk} = \left(b^n\right)^k = a^{mk}$, zato je $b$ tudi pozitivni $nk$-ti koren števila $a^{mk}$, torej $\sqrt[nk]{a^{mk}} = b$. Pri negativni osnovi ta sklep odpove, ker sodi koren ne more biti negativen, kar smo videli pri $(-8)^{\frac{2}{6}}$.

**Pravilo za produkt potenc.** Naj bo $r = \dfrac{p}{n}$ in $s = \dfrac{q}{n}$ (ulomka vedno lahko zapišemo s skupnim imenovalcem). Število $c = a^r \cdot a^s$ je pozitivno in velja $c^n = \left(a^{\frac{p}{n}}\right)^n \cdot \left(a^{\frac{q}{n}}\right)^n = a^p \cdot a^q = a^{p+q}$. Zato je $c = \sqrt[n]{a^{p+q}} = a^{\frac{p+q}{n}} = a^{r+s}$. Podobno dokažemo ostala pravila.

**Kaj pa iracionalni eksponenti?** Potenco $2^{\sqrt{2}}$ lahko razumemo kot število, ki ga vedno bolj natančno približujejo potence $2^{1{,}4}$, $2^{1{,}41}$, $2^{1{,}414}$, … z racionalnimi eksponenti. Natančno to obravnavamo pri eksponentni funkciji.

## Preveri se

? Kateri zapis **ni** enak $\sqrt[4]{a^3}$ za $a > 0$?
- $a^{\frac{3}{4}}$
~ To je enako: stopnja korena $4$ gre v imenovalec, eksponent $3$ v števec.
- $\left(\sqrt[4]{a}\right)^3$
~ To je enako: korenimo in potenciramo v poljubnem vrstnem redu.
- $a^{\frac{6}{8}}$
~ To je enako, ker je $\frac{6}{8} = \frac{3}{4}$; okrajšan ali razširjen ulomek da isto potenco.
+ $a^{\frac{4}{3}}$
> V $a^{\frac{4}{3}}$ sta števec in imenovalec zamenjana: to je $\sqrt[3]{a^4}$. Imenovalec eksponenta je stopnja korena.

? Koliko je $64^{\frac{2}{3}}$?
- $\dfrac{128}{3}$
~ Eksponent $\frac{2}{3}$ ni množenje z $\frac{2}{3}$; pomeni kubični koren in kvadrat.
- $8$
~ $8 = \sqrt{64}$: vzel si kvadratni koren in pozabil na števec $2$ ter stopnjo $3$.
+ $16$
- $512$
~ $512 = 64^{\frac{3}{2}}$: števec in imenovalec sta zamenjana.
> $64^{\frac{2}{3}} = \left(\sqrt[3]{64}\right)^2 = 4^2 = 16$. Imenovalec $3$ je stopnja korena, števec $2$ eksponent.

? V potenci $a^{r}$ ($a > 0$) eksponent $r$ zamenjamo z $-r$. Kaj se zgodi z vrednostjo?
- Vrednost postane negativna, $-a^r$.
~ Minus v eksponentu ne naredi negativnega števila; potenca s pozitivno osnovo je vedno pozitivna.
+ Vrednost postane obratna, $\dfrac{1}{a^r}$.
- Vrednost se ne spremeni.
~ Spremeni se, razen pri $a = 1$ ali $r = 0$: na primer $4^{\frac{1}{2}} = 2$, $4^{-\frac{1}{2}} = \frac{1}{2}$.
> Velja $a^{-r} = \dfrac{1}{a^r}$, zato je na primer $49^{-\frac{1}{2}} = \dfrac{1}{\sqrt{49}} = \dfrac{1}{7}$.

? Nejc je $\sqrt{a} \cdot \sqrt[4]{a}$ za $a > 0$ poenostavil v treh korakih. V katerem se je zmotil?
1) $a^{\frac{1}{2}} \cdot a^{\frac{1}{4}}$; 2) eksponenta zmnožimo: $a^{\frac{1}{8}}$; 3) $a^{\frac{1}{8}} = \sqrt[8]{a}$.
- korak 1
~ Korak 1 je pravilen: $\sqrt{a} = a^{\frac{1}{2}}$ in $\sqrt[4]{a} = a^{\frac{1}{4}}$.
+ korak 2
- korak 3
~ Korak 3 pravilno prepiše $a^{\frac{1}{8}}$ v koren; napačen je že rezultat koraka 2.
- vsi koraki so pravilni
~ Preizkus z $a = 16$: $\sqrt{16} \cdot \sqrt[4]{16} = 4 \cdot 2 = 8$, $\sqrt[8]{16} = \sqrt{2}$ pa ni $8$.
> Pri množenju potenc z isto osnovo eksponente **seštejemo**: $a^{\frac{1}{2} + \frac{1}{4}} = a^{\frac{3}{4}} = \sqrt[4]{a^3}$. Množimo jih pri potenciranju potence.

? Telesno površino bolnika ocenijo z izrazom $S = \left(\dfrac{h \cdot M}{3600}\right)^{\frac{1}{2}}$, kjer je $h$ višina v centimetrih, $M$ masa v kilogramih, $S$ pa v $\mathrm{m^2}$. Kolikšna je $S$ za $h = 162\,\mathrm{cm}$ in $M = 50\,\mathrm{kg}$?
- $1{,}125\,\mathrm{m^2}$
~ Eksponent $\frac{1}{2}$ si razumel kot deljenje z $2$; pomeni pa kvadratni koren.
- $2{,}25\,\mathrm{m^2}$
~ To je vrednost v oklepaju; pozabil si na eksponent $\frac{1}{2}$.
+ $1{,}5\,\mathrm{m^2}$
- $5{,}0625\,\mathrm{m^2}$
~ Vrednost v oklepaju si kvadriral; eksponent $\frac{1}{2}$ pomeni koren, ne kvadrata.
> $\dfrac{162 \cdot 50}{3600} = \dfrac{8100}{3600} = 2{,}25$ in $2{,}25^{\frac{1}{2}} = \sqrt{2{,}25} = 1{,}5$, torej $S = 1{,}5\,\mathrm{m^2}$.

:::simboli
a | osnova potence | | | $a > 0$ pri racionalnih eksponentih
b | osnova druge potence | | |
m | števec eksponenta (eksponent potence pod korenom) | | | celo število; v pravilih iz točke 2 cel eksponent
n | imenovalec eksponenta (stopnja korena) | | | naravno število, $n \ge 2$; v pravilih iz točke 2 cel eksponent
r, s | racionalna eksponenta | | |
P | dnevna potreba po energiji v mirovanju | P = 70 \cdot M^{\frac{3}{4}} | kcal/dan | ocena za sesalce
M | masa živali | | kg |
:::
