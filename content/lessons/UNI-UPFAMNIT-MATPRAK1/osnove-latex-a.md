---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za dve minuti, s telefonom v roki. V aplikaciji za sporočila prijatelju napiši `*izpit je jutri*` in pošlji. Zvezdici izgineta, besedilo je krepko. Gumba »krepko« nisi pritisnil. Zapisal si **oznako**, aplikacija pa jo je ob pošiljanju spremenila v obliko.

Zdaj poskusi v sporočilo spraviti formulo $\dfrac{x^2+1}{\sqrt{2}}$. Ne gre. V urejevalniku besedil z gumbi vstavi isti ulomek prek menija »Enačba« in si izmeri čas: večina potrebuje pol minute in kakih deset dotikov. V LaTeX-u isto zapišeš kot `\frac{x^2+1}{\sqrt{2}}`: 22 znakov, natipkanih v nekaj sekundah.

LaTeX je jezik oznak, kot zvezdice v sporočilu, le da zna veliko več: sam oštevilči poglavja, enačbe in izreke, popravi sklice nanje in uredi literaturo. V njem nastajajo seminarske naloge, diplome in skoraj vsi matematični članki.

## Razlaga

**1. Kar že poznaš: oznaka namesto gumba.** V sporočilu zvezdice okoli besede pomenijo »krepko«. V LaTeX-u je ista ideja zapisana z **ukazom**: ta se začne z levo poševnico `\`, njegov argument pa stoji v zavitih oklepajih.

| sporočilo | LaTeX | izpis |
|---|---|---|
| `*nujno*` | `\textbf{nujno}` | **nujno** |
| `_morda_` | `\emph{morda}` | *morda* |
| (ne gre) | `\frac{1}{2}` | $\frac{1}{2}$ |

Glavna sprememba glede na urejevalnik z gumbi: videza med pisanjem ne vidiš. Pišeš **izvorno datoteko** s končnico `.tex`, program `pdflatex` pa jo **prevede** v PDF. Oznake izginejo šele ob prevajanju, tako kot zvezdice šele ob pošiljanju. Spletni urejevalniki prevajajo na strežniku, zato delujejo tudi na telefonu.

**2. Struktura dokumenta.** Vsaka datoteka ima dva dela.

<pre><code>&#92;documentclass[12pt]{article}
&#92;usepackage[slovene]{babel}
&#92;usepackage{amsmath, amssymb, amsthm}
&#92;newtheorem{izrek}{Izrek}
&#92;title{Baterija pametnega telefona}
&#92;author{Ana Novak}

&#92;begin{document}
&#92;maketitle
&#92;section{Uvod}
Telefon porabi največ energije za zaslon.
&#92;section{Energija baterije}
% to je komentar, v PDF-ju se ne vidi
&#92;end{document}
</code></pre>

- **Preambula** je vse pred `\begin{document}`. Tu izbereš vrsto dokumenta (`article`, `book`) in naložiš **pakete**, ki dodajo ukaze: `babel` slovensko deljenje besed, `amsmath` matematična okolja. Je kot nastavitve telefona: ne vidiš je, a določa videz.
- **Telo** je med `\begin{document}` in `\end{document}`. To je vsebina.
- `\section{...}` in `\subsection{...}` naslove oštevilčita sama: 1, 2, 2.1. Številk torej ne pišeš ti, to opravi LaTeX.

Prazna vrstica začne nov odstavek, več presledkov šteje kot en sam. Črke č, š in ž v novejših namestitvah delujejo brez dodatnih paketov.

**3. Matematični način.** Formulo sredi stavka zapišeš med dva dolarja, <code>&#36;a+b&#36;</code>. Izpostavljeno formulo v svoji vrstici zapišeš med <code>&#92;[</code> in <code>&#92;]</code>. Česar sporočila sploh ne poznajo: med dolarji velja drug jezik.

- Presledki se ne upoštevajo: <code>&#36;a+b&#36;</code> in <code>&#36;a + b&#36;</code> dasta isto.
- Črke so poševne, ker pomenijo spremenljivke.
- `^` naredi potenco, `_` indeks. V tabeli spodaj opazi, kje za njima stojijo zaviti oklepaji.
- Funkcije in grške črke so ukazi: `\sin`, `\log`, `\lim`, `\alpha`, `\pi`.

| vtipkaš | dobiš |
|---|---|
| <code>&#36;x&#95;1^2 + x&#95;2^2&#36;</code> | $x_1^2 + x_2^2$ |
| <code>&#36;&#92;sqrt{a^2+b^2}&#36;</code> | $\sqrt{a^2+b^2}$ |
| <code>&#36;&#92;sum&#95;{k=1}^{n} k&#36;</code> | $\sum_{k=1}^{n} k$ |
| <code>&#36;&#92;int&#95;0^1 x^2&#92;,dx&#36;</code> | $\int_0^1 x^2\,dx$ |
| <code>&#36;&#92;sin&#92;alpha&#36;</code> | $\sin\alpha$ |

Ukaz `\,` je majhen presledek. Besedilo znotraj formule zapiši z ukazom `\text{...}`. Decimalno vejico zapiši kot `{,}`: <code>&#36;3{,}5&#36;</code> da $3{,}5$, medtem ko <code>&#36;3,5&#36;</code> da $3,5$, s presledkom kot pri naštevanju.

:::premisli
Kaj izpiše <code>&#36;x^10&#36;</code>? Napovej iz tabele: zakaj ima <code>&#92;sum&#95;{k=1}^{n}</code> zavite oklepaje, <code>x&#95;1^2</code> pa ne?
---
Izpiše $x^10$. `^` in `_` delujeta le na **en znak**: na potenco gre le enica, ničla pa ostane spodaj ob $x$. Pravilno je <code>&#36;x^{10}&#36;</code>, kar da $x^{10}$.
:::

**4. Okolja.** Daljši del dokumenta s posebno vlogo zapreš v **okolje**: `\begin{ime}` ... `\end{ime}`. V urejevalniku z gumbi bi za seznam kliknil ikono, tu odpreš okolje.

- `itemize` naredi alineje, `enumerate` oštevilčen seznam; vsaka točka se začne z `\item`.
- `equation` izpostavi formulo in ji na desni da zaporedno številko, na primer $(1)$.
- `align` zapiše več vrstic, poravnanih pri znaku `&`; ukaz `\\` konča vrstico.
- `izrek` ustvariš sam: ukaz `\newtheorem{izrek}{Izrek}` v preambuli. Izpiše se kot »**Izrek 1.**« s poševnim besedilom.
- `proof` iz paketa `amsthm` izpiše »*Dokaz.*« in na koncu kvadratek $\square$.

Okolje, ki ga odpreš, moraš tudi zapreti; gnezdena zapiraš v obratnem vrstnem redu, kot oklepaje.

**5. Sklici.** Mesto, na katero se boš skliceval, označiš z `\label{ime}`. Sklic zapišeš z `\ref{ime}` (samo številka) ali `\eqref{ime}` (številka enačbe v oklepaju). Ime izbereš ti, številko izbere LaTeX. Če pred enačbo vstaviš novo, se sklici popravijo sami. Navada je, da ime pove vrsto: `eq:energija`, `izr:vsota`.

:::premisli
Po prvem prevajanju je v sklicu namesto številke izpisano »??«, po drugem pa prava številka. Zakaj?
---
LaTeX bere datoteko od začetka proti koncu in ob sklicu še ne pozna oznake, ki stoji šele kasneje. Med prvim prevajanjem zapiše oznake in številke v pomožno datoteko `.aux`, pri drugem jo prebere že na začetku.
:::

**6. Literatura.** Seznam virov zapišeš na konec dokumenta v okolje `thebibliography`. Vsak vir začneš z `\bibitem{ključ}`, v besedilu pa se nanj skliceš s `\cite{ključ}`. Viri se oštevilčijo sami in sklic se izpiše kot [1]. Znak `~` je presledek, pri katerem se vrstica ne sme prelomiti.

<pre><code>Formulo za vsoto najdemo v~&#92;cite{gkp}.

&#92;begin{thebibliography}{9}
&#92;bibitem{gkp} R.~L.~Graham, D.~E.~Knuth, O.~Patashnik,
  &#92;emph{Concrete Mathematics}, Addison-Wesley, 1994.
&#92;end{thebibliography}
</code></pre>

Pri daljših delih vire hraniš v datoteki `.bib` in jih vključiš z BibTeX-om ali biberjem: v seznam pridejo le citirani viri, slog pa zamenjaš z enim ukazom.

## Rešeni primeri

### Primer 1: stavek s formulami v vrstici

V seminarski nalogi o telefonih želiš izpis: »Baterija z nabojem $Q = 4000\,\mathrm{mAh}$ pri povprečnem toku $I = 250\,\mathrm{mA}$ zdrži $t = \frac{Q}{I} = 16\,\mathrm{h}$.«

**Podatki:** želeni izpis zgoraj: navadno besedilo, tri formule sredi stavka, ulomek, enote mAh, mA in h
**Iščemo:** izvorno kodo LaTeX za ta stavek

:::formula
Formula v vrstici: <code>&#36;...&#36;</code>; ulomek: `\frac{števec}{imenovalec}`; enota pokončno: `\mathrm{...}`, pred njo `\,`.
:::

**Rešitev:**

1. Besedilo pišemo navadno, vsako formulo med svoja dolarja, ker je del stavka.
2. Enote niso spremenljivke, zato pokončno: `\mathrm{mAh}`, pred njo presledek `\,`.
3. Ulomek zapišemo s `\frac{Q}{I}`. Račun $4000 : 250 = 16$ je pravilen, zato ga lahko zapišemo.
4. Koda:

<pre><code>Baterija z nabojem &#36;Q = 4000&#92;,&#92;mathrm{mAh}&#36; pri povprečnem
toku &#36;I = 250&#92;,&#92;mathrm{mA}&#36; zdrži &#36;t = &#92;frac{Q}{I} = 16&#92;,&#92;mathrm{h}&#36;.
</code></pre>

5. Odgovor: stavek zapišemo z zgornjo kodo; prelom vrstice v izvorni datoteki LaTeX bere kot presledek.

### Primer 2: oštevilčena enačba in sklic nanjo

Želiš izpostavljeno enačbo $E = U \cdot Q$ s številko $(1)$ na desni, pod njo pa stavek: »Za baterijo z napetostjo $3{,}85\,\mathrm{V}$ in nabojem $4\,\mathrm{Ah}$ iz $(1)$ dobimo $E = 15{,}4\,\mathrm{Wh}$.« Številka v stavku naj se sama popravi, če kasneje pred enačbo dodaš novo.

**Podatki:** enačba $E = U \cdot Q$ s številko, $U = 3{,}85\,\mathrm{V}$, $Q = 4\,\mathrm{Ah}$, $E = 15{,}4\,\mathrm{Wh}$, sklic, ki se sam posodablja
**Iščemo:** kodo z ustreznim okoljem in sklicem

:::formula
`\begin{equation}` ... `\label{ime}` ... `\end{equation}`, sklic z `\eqref{ime}`, decimalna vejica `{,}`.
:::

**Rešitev:**

1. Številko da okolje `equation`; zapis med <code>&#92;[</code> in <code>&#92;]</code> bi bil brez nje.
2. Znotraj okolja dodamo `\label{eq:energija}`, ki ime poveže s številko.
3. V stavku napišemo `\eqref{eq:energija}`; ta izpiše številko skupaj z oklepajema.
4. Preverimo račun: $3{,}85 \cdot 4 = 15{,}4$. Decimalni vejici zapišemo kot `{,}`.
5. Koda:

<pre><code>&#92;begin{equation}
  E = U &#92;cdot Q &#92;label{eq:energija}
&#92;end{equation}
Za baterijo z napetostjo &#36;3{,}85&#92;,&#92;mathrm{V}&#36; in nabojem
&#36;4&#92;,&#92;mathrm{Ah}&#36; iz &#92;eqref{eq:energija} dobimo
&#36;E = 15{,}4&#92;,&#92;mathrm{Wh}&#36;.
</code></pre>

6. Odgovor: okolje `equation` z oznako in sklic `\eqref`; po dveh prevajanjih se izpiše $(1)$.

### Primer 3: izrek, dokaz, sklic in vir

V seminarski nalogi želiš izpis:

> **Izrek 1.** *Za vsako naravno število $n$ velja $1 + 2 + \dots + n = \frac{n(n+1)}{2}$.*
>
> *Dokaz.* Vsoti v obeh vrstnih redih seštejemo: $n$ parov z vsoto $n+1$. $\square$
>
> Po izreku 1 je vsota števil od 1 do 100 enaka 5050 [1].
>
> **Literatura:** [1] R. L. Graham, D. E. Knuth, O. Patashnik, *Concrete Mathematics*, Addison-Wesley, 1994.

**Podatki:** besedilo izreka, dokaza in stavka, vir (avtorji, naslov, založba, leto); številki »1« pri izreku in viru naj nastaneta sami
**Iščemo:** vrstici v preambuli in kodo za telo

:::formula
`\newtheorem{izrek}{Izrek}` v preambuli; okolji `izrek` in `proof`; `\label` + `\ref`; `\bibitem` + `\cite`.
:::

**Rešitev:**

1. V preambulo dodamo `\usepackage{amsthm}` in `\newtheorem{izrek}{Izrek}`, sicer okolje `izrek` ne obstaja.
2. Izrek zapremo v okolje `izrek` in mu dodamo oznako `izr:vsota`. Formula je del stavka, zato je med dolarji.
3. Dokaz zapremo v `proof`; kvadratek na koncu doda okolje samo.
4. Na izrek se sklicujemo z `\ref{izr:vsota}` (to ni enačba, zato brez oklepaja), na vir s `\cite{gkp}`. Preverimo: $\frac{100 \cdot 101}{2} = 5050$.
5. Koda telesa:

<pre><code>&#92;begin{izrek}&#92;label{izr:vsota}
Za vsako naravno število &#36;n&#36; velja
&#36;1 + 2 + &#92;dots + n = &#92;frac{n(n+1)}{2}&#36;.
&#92;end{izrek}
&#92;begin{proof}
Vsoti v obeh vrstnih redih seštejemo:
&#36;n&#36; parov z vsoto &#36;n+1&#36;.
&#92;end{proof}
Po izreku~&#92;ref{izr:vsota} je vsota števil od 1 do 100
enaka 5050~&#92;cite{gkp}.

&#92;begin{thebibliography}{9}
&#92;bibitem{gkp} R.~L.~Graham, D.~E.~Knuth, O.~Patashnik,
  &#92;emph{Concrete Mathematics}, Addison-Wesley, 1994.
&#92;end{thebibliography}
</code></pre>

6. Odgovor: dve vrstici v preambuli in štirje gradniki v telesu (izrek, dokaz, sklic, viri); po dveh prevajanjih se izpišeta »Izrek 1« in »[1]«.

### Primer 4 – zdaj ti: popravi sošolčevo kodo

Sošolec ti pošlje kodo: <code>Zaslon ima diagonalo &#36;6,1&#36; palca, ločljivost &#36;2532 x 1170&#36; in razmerje stranic &#36;2532/1170&#36;.</code> V PDF-ju je za vejico presledek, med števili stoji poševen $x$, razmerje pa naj bo zapisano kot ulomek.

**Podatki:** koda zgoraj; tri napake: decimalna vejica, znak za množenje, zapis razmerja
**Iščemo:** popravljeno kodo

:::formula
Decimalna vejica `{,}`, znak $\times$ z ukazom `\times`, ulomek s `\frac{a}{b}`.
:::

**Rešitev:**

1. Decimalna vejica: <code>&#36;6{,}1&#36;</code>.
2. Popravi še znak za množenje in razmerje, nato preveri:

:::premisli
Kakšna je celotna popravljena koda?
---
<code>Zaslon ima diagonalo &#36;6{,}1&#36; palca, ločljivost &#36;2532 &#92;times 1170&#36; in razmerje stranic &#36;&#92;frac{2532}{1170}&#36;.</code> Črka x v matematičnem načinu pomeni spremenljivko $x$, zato je poševna; znak $\times$ dobiš z ukazom `\times`.
:::

## Pogoste napake

- **Vejica brez zavitih oklepajev.** <code>&#36;3,5&#36;</code> da $3,5$. LaTeX vejico v formuli razume kot ločilo med naštetimi elementi in za njo doda presledek. Piši <code>&#36;3{,}5&#36;</code>.
- **Potenca ali indeks brez oklepajev.** <code>&#36;x^10&#36;</code> da $x^10$, <code>&#36;a&#95;12&#36;</code> da $a_12$. Na potenco ali v indeks gre le en znak. Piši <code>&#36;x^{10}&#36;</code> in <code>&#36;a&#95;{12}&#36;</code>.
- **Funkcija brez poševnice.** <code>&#36;sin x&#36;</code> da $sin x$: LaTeX vidi produkt štirih spremenljivk $s$, $i$, $n$ in $x$. Ukaz `\sin` izpiše pokončno ime s pravim razmikom: $\sin x$.
- **Besedilo med dolarji.** <code>&#36;v je hitrost&#36;</code> da $v je hitrost$: presledki izginejo, črke so poševne. Besedilo piši zunaj dolarjev ali v `\text{...}`.
- **Številke, pisane na roko.** Ročno zapisan »(3)« ne sledi spremembam. Uporabi `\label` in `\eqref`. Če sklic po dveh prevajanjih kaže »??«, se ime v `\ref` ne ujema z imenom v `\label`.

## Povzetek

- LaTeX je jezik oznak: pišeš izvorno datoteko `.tex`, program jo prevede v PDF.
- Struktura: v preambuli `\documentclass` in paketi (`babel`, `amsmath`, `amsthm`), vsebina med `\begin{document}` in `\end{document}`; `\section` oštevilči sam.
- Matematični način: formula v vrstici med dvema dolarjema, izpostavljena v svoji vrstici; presledki se ne upoštevajo, `^` in `_` delujeta na en znak, zato oklepaji; funkcije s `\sin`, `\log`; decimalna vejica `{,}`; besedilo s `\text`.
- Okolja `\begin{...}` ... `\end{...}`: `itemize`, `enumerate`, `equation` (s številko), `align`, izreki z `\newtheorem`, `proof`.
- Sklici: `\label` + `\ref` ali `\eqref`; viri: `thebibliography`, `\bibitem` + `\cite`. Za pravilne številke prevedi dvakrat.

## Drugače: Na sliki

Pot od izvorne datoteke do PDF-ja:

```
naloga.tex
   │  1. prevajanje
   ├──► naloga.aux  (oznaka → številka)
   └──► naloga.pdf  (sklici: ??)

naloga.tex + naloga.aux
   │  2. prevajanje
   └──► naloga.pdf  (sklici: 1, 2, …)
```

Zgradba dokumenta kot drevo:

```
preambula: documentclass, paketi,
           newtheorem
document
 ├─ section Uvod
 ├─ section Energija baterije
 │   ├─ equation (1)  ← label
 │   └─ izrek 1       ← label
 └─ thebibliography
     └─ bibitem [1]   ← cite
```

Puščica »←« pomeni: tu je pripeto ime, ki ga `\ref` ali `\cite` prevede v številko.

## Drugače: Iz vsakdanjega življenja

Ko kličeš mamo, izbereš stik »Mama«, številke ne tipkaš. Če mama zamenja številko, popraviš en stik in vsi klici še vedno pridejo do nje.

Z oznakami v LaTeX-u je enako. `\label{eq:energija}` je ime stika, številka enačbe je telefonska številka. V besedilu »kličeš« ime z `\eqref{eq:energija}`, LaTeX pa poišče trenutno številko. Ko dodaš novo enačbo, se številke premaknejo, tvoji sklici pa ostanejo pravilni. Pri viru je `\cite{gkp}` ime stika, [1] pa njegova trenutna številka v seznamu.

## Preveri se

? Katera vrstica tabele »vtipkaš → dobiš« je pravilna?
- <code>&#36;x^10&#36;</code> → $x^{10}$
~ Brez zavitih oklepajev gre na potenco le enica, izpis je $x^10$.
+ <code>&#36;x&#95;{12}&#36;</code> → $x_{12}$
- <code>&#36;sin x&#36;</code> → $\sin x$
~ Brez poševnice LaTeX izpiše poševne črke $s$, $i$, $n$ kot produkt spremenljivk: $sin x$.
- <code>&#36;3,5&#36;</code> → $3{,}5$
~ Vejica brez zavitih oklepajev dobi presledek kot pri naštevanju: $3,5$.
> Zaviti oklepaji poskrbijo, da gre v indeks celo število $12$. Ostale vrstice kažejo tri pogoste napake.

? Na telefonu tipkaš formulo $\int_0^1 x^2\,dx$ v LaTeX-u, brez dolarjev. Približno koliko znakov natipkaš?
- približno $5$
~ Toliko je vidnih simbolov, a ukaz `\int` ima štiri znake, meje in presledki pa dodajo še nekaj.
+ približno $15$
- približno $60$
~ Ukazi so kratki: integral je `\int`, meje so `_0^1`. Toliko znakov bi potreboval za zelo dolgo formulo.
> Zapis `\int_0^1 x^2\,dx` ima $16$ znakov, kar je hitreje od vstavljanja prek menijev.

? Zakaj v matematičnem načinu pišemo `\sin x` in ne `sin x`?
- Ker `sin x` pri prevajanju sproži napako.
~ Prevajanje uspe; napaka je samo v videzu.
- Ker `\sin` izračuna vrednost sinusa.
~ LaTeX ničesar ne računa, le stavi besedilo in formule.
+ Ker LaTeX črke sin brez poševnice razume kot produkt treh spremenljivk in jih izpiše poševno.
> `\sin` izpiše pokončno ime funkcije s pravim razmikom do argumenta: $\sin x$ namesto $sin x$.

? V PDF-ju želiš izpostavljeno enačbo $a^2 + b^2 = c^2$ s številko $(1)$ na desni, na katero se boš kasneje skliceval. Katera koda to da?
- <code>&#36;a^2 + b^2 = c^2&#36;</code>
~ To je formula v vrstici: ni izpostavljena in nima številke.
- <code>&#92;[ a^2 + b^2 = c^2 &#92;]</code>
~ Formula je izpostavljena, a brez številke, zato se nanjo ne moreš sklicevati s številko.
+ `\begin{equation} a^2 + b^2 = c^2 \label{eq:pit} \end{equation}`
- `\begin{itemize} \item a^2 + b^2 = c^2 \end{itemize}`
~ `itemize` je seznam, ne matematično okolje; potenca zunaj matematičnega načina povzroči napako.
> Številko da okolje `equation`, oznaka `\label{eq:pit}` pa omogoči sklic z `\eqref{eq:pit}`.

? Enačba z oznako `eq:energija` ima zdaj številko $(3)$, v besedilu pa piše »iz `\eqref{eq:energija}` sledi«. Pred njo vstaviš novo oštevilčeno enačbo in dokument prevedeš dvakrat. Kaj piše v PDF-ju?
- »iz (3) sledi«
~ Oznaka je ime, ne številka. Ko se številka enačbe spremeni, se spremeni tudi sklic.
- »iz ?? sledi«
~ »??« ostane le po enem prevajanju ali pri napačnem imenu oznake.
- »iz eq:energija sledi«
~ Ime oznake se v PDF-ju nikoli ne izpiše, služi le za povezavo.
+ »iz (4) sledi«
> Nova enačba dobi številko $(3)$, stara $(4)$; sklic poišče trenutno številko oznake.

:::simboli
E | energija baterije | E = U \cdot Q | Wh | primer izpostavljene enačbe s številko
U | napetost baterije | | V |
Q | naboj baterije | | Ah | v primeru tudi mAh
I | povprečni tok | | mA |
t | čas delovanja baterije | t = \dfrac{Q}{I} | h |
n | naravno število v izreku | | |
x | spremenljivka | | | v matematičnem načinu poševna; znak za množenje je $\times$
:::
