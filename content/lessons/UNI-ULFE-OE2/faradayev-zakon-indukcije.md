---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1820 je Ørsted pokazal, da električni tok odkloni magnetnico: tok ustvarja magnetno polje. Fiziki so se takoj vprašali obratno. Ali lahko magnetno polje ustvari tok? Michael Faraday je to leta 1831 tudi izmeril. Na železni obroč je navil dve tuljavi. Ko je v prvi vklopil ali izklopil tok, se je kazalec galvanometra na drugi za hip premaknil. Ko je tok v prvi stalno tekel, je kazalec stal na ničli.

Odločilna torej ni bila velikost polja, ampak njegova **sprememba**. Iz tega opažanja so zrasli generator, transformator, indukcijski števec, merilnik pretoka in vsaka merilna tuljavica, s katero danes v laboratoriju merimo magnetna polja. Ko razumeš ta zakon, znaš izračunati napetost na sponkah merilne tuljave, zaviralno silo vrtinčnih tokov in napetost, ki jo kabel z velikim tokom inducira v sosednji vodnik.

## Razlaga

### Najprej en primer

Kvadratna tuljava ima $N = 50$ ovojev s stranico $4\,\mathrm{cm}$. Leži pravokotno na homogeno magnetno polje elektromagneta. Gostota polja enakomerno naraste od $0$ do $0{,}30\,\mathrm{T}$ v $20\,\mathrm{ms}$. Voltmeter na sponkah tuljave ves ta čas kaže stalno napetost. Kolikšno?

Merilni podatki iz praktikuma kažejo vzorec. Napetost se podvoji, če podvojimo število ovojev, ploščino ali spremembo gostote. Razpolovi pa se, če spremembo naredimo v dvakrat daljšem času. Napetost je torej sorazmerna z $N \cdot A \cdot \Delta B / \Delta t$:

1. Ploščina enega ovoja: $A = 0{,}04 \cdot 0{,}04 = 0{,}0016\,\mathrm{m^2}$.
2. Sprememba skupnega pretoka skozi vse ovoje: $N A \Delta B = 50 \cdot 0{,}0016 \cdot 0{,}30 = 0{,}024\,\mathrm{Wb}$.
3. Napetost: $0{,}024\,\mathrm{Wb} / 0{,}020\,\mathrm{s} = 1{,}2\,\mathrm{V}$.

Če sta tuljava in voltmeter sklenjena v krog z upornostjo $20\,\mathrm{\Omega}$, teče tok $1{,}2 / 20 = 0{,}06\,\mathrm{A}$. Energijo za toploto v uporu mora dati elektromagnet, ki polje spreminja. Zdaj ta račun posplošimo.

### Magnetni pretok

**Definicija.** Magnetni pretok skozi ploskev $A$ je

$$\Phi = \int_A \vec B \cdot \mathrm{d}\vec A$$

Enota je weber, $1\,\mathrm{Wb} = 1\,\mathrm{V\,s}$. Smer vektorja $\mathrm{d}\vec A$ (normale) izberemo sami. S tem izberemo tudi pozitivno smer obhoda roba ploskve: obhod in normala sta povezana s **pravilom desne roke** (prsti v smeri obhoda, palec kaže normalo). V homogenem polju in na ravni ploskvi je $\Phi = B A \cos\alpha$, kjer je $\alpha$ kot med $\vec B$ in normalo.

**Definicija.** Če $N$ ovojev objema isti pretok $\Phi$, je **sklopljeni pretok** tuljave $\Psi = N\Phi$. Kadar so pretoki skozi ovoje različni, je $\Psi$ njihova vsota.

### Zakon in pravilo o smeri

**Izrek (Faradayev zakon indukcije).** Če se sklopljeni pretok skozi sklenjeno zanko s časom spreminja, se v zanki inducira napetost

$$u_i = -\frac{\mathrm{d}\Psi}{\mathrm{d}t}$$

Napetost $u_i$ šteje pozitivno v smeri obhoda, ki je z normalo povezana s pravilom desne roke. Zakon velja ne glede na to, *zakaj* se pretok spreminja: spreminja se lahko gostota polja, ploščina zanke ali kot med njima.

Minus v zakonu je **Lenzovo pravilo**: inducirani tok teče tako, da njegovo magnetno polje nasprotuje *spremembi* pretoka, ki ga je povzročila. Ne nasprotuje polju samemu. Če pretok narašča, inducirani tok ustvarja polje v nasprotni smeri. Če pretok pada, ga inducirani tok skuša ohraniti.

:::premisli
Magnet s severnim polom naprej potiskamo proti obroču iz bakra. Ali se obroč magneta »brani« ali ga privlači? Kaj se zgodi, ko magnet vlečemo stran?
---
Pri približevanju pretok skozi obroč narašča, zato inducirani tok ustvari polje, ki kaže proti magnetu: obroč ima na strani magneta severni pol in ga odbija. Pri oddaljevanju pretok pada, inducirani tok ga skuša ohraniti, obroč obrne pol in magnet privlači. V obeh primerih sila nasprotuje gibanju.
:::

**Zakaj prav minus.** Recimo, da bi bil predznak plus. Inducirani tok bi potem krepil spremembo pretoka, ta bi inducirala še večji tok in tako naprej. Iz majhne motnje bi brez dela nastala poljubno velika energija. To prepoveduje zakon o ohranitvi energije. Lenzovo pravilo je zato posledica ohranitve energije, ne dodatna predpostavka.

### Gibalna inducirana napetost

Vzemimo ravno palico dolžine $l$, ki se giblje s hitrostjo $\vec v$ v homogenem polju $\vec B$; palica, $\vec v$ in $\vec B$ so med seboj pravokotni. Na vsak prosti elektron deluje Lorentzova sila $\vec F = q\,\vec v \times \vec B$. Elektroni se kopičijo na enem koncu, dokler električno polje ne uravnovesi magnetne sile. Takrat je med koncema napetost.

**Izpeljava.** Delo magnetne sile na naboj $q$ vzdolž palice je $q v B l$. Delo na enoto naboja je napetost:

$$u_i = B l v$$

Isto dobimo iz Faradayevega zakona. Če palica drsi po dveh tirnicah, ki sta na koncu sklenjeni, se ploščina zanke v času $\mathrm{d}t$ poveča za $l v\,\mathrm{d}t$. Pretok se poveča za $B l v\,\mathrm{d}t$, zato je $\left|\mathrm{d}\Phi/\mathrm{d}t\right| = B l v$. Obe razlagi, z Lorentzovo silo in s spremembo pretoka, se ujemata.

### Vrteča se tuljava

Tuljava z $N$ ovoji in ploščino $A$ se v homogenem polju $B$ vrti s kotno hitrostjo $\omega$ okoli osi, pravokotne na polje. Kot med normalo in poljem je $\alpha = \omega t$, sklopljeni pretok je $\Psi = N B A \cos\omega t$. Odvod da

$$u_i = N B A \omega \sin\omega t$$

To je izmenična napetost z amplitudo $\hat u = N B A \omega$ in efektivno vrednostjo $\hat u / \sqrt 2$. Na tem načelu delujejo generatorji izmenične napetosti.

:::premisli
Pri katerem kotu med normalo tuljave in poljem je inducirana napetost največja: ko je pretok največji ali ko je nič? Zakaj?
---
Ko je pretok nič (ravnina tuljave je vzporedna s poljem, $\alpha = 90^\circ$). Napetost ni odvisna od pretoka, ampak od hitrosti njegove spremembe, ta pa je največja tam, kjer kosinus prečka ničlo.
:::

### Tuljava ob vodniku

Pri dolgem ravnem vodniku s tokom $i$ je gostota polja na razdalji $r$ enaka $B = \mu_0 i / (2\pi r)$ (lekcija Magnetno polje toka). Pravokotna zanka s stranico $b$ vzporedno z vodnikom leži med razdaljama $r_1$ in $r_2$. Polje ni homogeno, zato pretok seštejemo po pasovih širine $\mathrm{d}r$:

$$\Phi = \frac{\mu_0 i b}{2\pi} \ln\frac{r_2}{r_1}$$

Skica (pogled od zgoraj, tok teče navzgor):

```
 i ^      b
   |   +-----+
   |   |  x  |  B v zanko
   |   |  x  |
   |   +-----+
   |<r1>
   |<- r2 -->|
```

Ko se tok $i$ spreminja, se v zanki inducira napetost, sorazmerna z $\mathrm{d}i/\mathrm{d}t$. To je osnova presluha med kabli in merilnih tuljav za tok.

## Rešeni primeri

### Primer 1 (lažji)

Merilna tuljavica z $200$ ovoji in ploščino $1{,}5\,\mathrm{cm^2}$ je nagnjena tako, da normala oklepa s poljem kot $60^\circ$. Gostota polja enakomerno naraste z $0{,}10\,\mathrm{T}$ na $0{,}50\,\mathrm{T}$ v $40\,\mathrm{ms}$. Kolikšna napetost se inducira?

**Podatki:** $N = 200$, $A = 1{,}5\,\mathrm{cm^2} = 1{,}5 \cdot 10^{-4}\,\mathrm{m^2}$, $\alpha = 60^\circ$, $B_1 = 0{,}10\,\mathrm{T}$, $B_2 = 0{,}50\,\mathrm{T}$, $\Delta t = 40\,\mathrm{ms}$
**Iščemo:** velikost inducirane napetosti $\lvert u_i \rvert$

:::formula
$\Psi = N B A \cos\alpha$, $\lvert u_i \rvert = \dfrac{\Delta \Psi}{\Delta t}$ (pri enakomerni spremembi)
:::

**Rešitev:**

1. Sklopljeni pretok na začetku: $\Psi_1 = 200 \cdot 0{,}10 \cdot 1{,}5 \cdot 10^{-4} \cdot 0{,}5 = 0{,}0015\,\mathrm{Wb}$.
2. Na koncu: $\Psi_2 = 200 \cdot 0{,}50 \cdot 1{,}5 \cdot 10^{-4} \cdot 0{,}5 = 0{,}0075\,\mathrm{Wb}$.
3. Sprememba je $\Delta\Psi = 0{,}0060\,\mathrm{Wb}$, ker se spremeni le gostota; ploščina in kot ostaneta.
4. Sprememba je enakomerna, zato je napetost ves čas enaka: $0{,}0060 / 0{,}040 = 0{,}15$, torej $\lvert u_i \rvert = 0{,}15\,\mathrm{V}$.
5. Odgovor: inducira se napetost $0{,}15\,\mathrm{V}$. Pri pravokotni legi bi bila dvakrat večja, ker je $\cos 60^\circ = 0{,}5$.

### Primer 2: pretok iz zapisa meritve

Študent hitro izvleče merilno tuljavico ($200$ ovojev, $A = 1{,}0\,\mathrm{cm^2}$) iz reže močnega magneta daleč stran, kjer je polje zanemarljivo. Merilna kartica zapiše napetost vsaki $2\,\mathrm{ms}$:

- $t = 0$: $0\,\mathrm V$; $t = 2\,\mathrm{ms}$: $0{,}6\,\mathrm V$; $t = 4\,\mathrm{ms}$: $1{,}0\,\mathrm V$
- $t = 6\,\mathrm{ms}$: $0{,}8\,\mathrm V$; $t = 8\,\mathrm{ms}$: $0{,}4\,\mathrm V$; $t = 10\,\mathrm{ms}$: $0\,\mathrm V$

Kolikšna je bila gostota polja v reži? Normala tuljavice je bila vzporedna s poljem.

**Podatki:** $N = 200$, $A = 1{,}0 \cdot 10^{-4}\,\mathrm{m^2}$, korak $h = 2\,\mathrm{ms}$, vzorci napetosti zgoraj, končna gostota $B_2 = 0$
**Iščemo:** gostoto $B_1$ v reži

:::formula
$\Delta\Psi = \int u_i\,\mathrm{d}t \approx h\left(\tfrac{u_0}{2} + u_1 + \dots + u_{n-1} + \tfrac{u_n}{2}\right)$ (trapezno pravilo), $B_1 = \dfrac{\Delta\Psi}{N A}$
:::

**Rešitev:**

1. Napetost je odvod pretoka, zato je sprememba pretoka ploščina pod krivuljo napetosti. Ne potrebujemo hitrosti, s katero smo tuljavico vlekli.
2. Krajna vzorca sta nič, zato ostane vsota notranjih: $0{,}6 + 1{,}0 + 0{,}8 + 0{,}4 = 2{,}8\,\mathrm V$.
3. Integral: $\Delta\Psi \approx 0{,}002 \cdot 2{,}8 = 0{,}0056\,\mathrm{Wb}$.
4. Gostota: $B_1 = \dfrac{0{,}0056}{200 \cdot 1{,}0 \cdot 10^{-4}} = 0{,}28\,\mathrm{T}$.
5. Odgovor: v reži je bilo približno $0{,}28\,\mathrm T$. Na tem temelji fluksmeter: integrator napetosti merilne tuljave.

### Primer 3 (težji): zanka ob kablu

Po dolgem ravnem kablu tok enakomerno naraste od $0$ do $100\,\mathrm A$ v $5\,\mathrm{ms}$. V isti ravnini kot kabel leži pravokotna tuljava z $10$ ovoji. Njeni stranici dolžine $20\,\mathrm{cm}$ sta vzporedni s kablom, na razdaljah $2\,\mathrm{cm}$ in $10\,\mathrm{cm}$. Upornost tuljave je $0{,}5\,\mathrm{\Omega}$, njene sponke so kratko sklenjene. Izračunaj inducirano napetost in tok ter določi smer toka.

**Podatki:** $\Delta i = 100\,\mathrm A$, $\Delta t = 5\,\mathrm{ms}$, $N = 10$, $b = 0{,}20\,\mathrm m$, $r_1 = 0{,}02\,\mathrm m$, $r_2 = 0{,}10\,\mathrm m$, $R = 0{,}5\,\mathrm{\Omega}$, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** $\lvert u_i \rvert$, tok $i_z$ v zanki in njegovo smer

:::formula
$\Psi = N\dfrac{\mu_0 i b}{2\pi} \ln\dfrac{r_2}{r_1}$, $\lvert u_i \rvert = \left|\dfrac{\mathrm{d}\Psi}{\mathrm{d}t}\right|$, $i_z = \dfrac{u_i}{R}$
:::

**Rešitev:**

1. Razmerje razdalj: $r_2 / r_1 = 5$, $\ln 5 \approx 1{,}609$.
2. Pretok skozi en ovoj pri končnem toku: $\Phi = 2 \cdot 10^{-7} \cdot 100 \cdot 0{,}20 \cdot 1{,}609 \approx 6{,}44 \cdot 10^{-6}\,\mathrm{Wb}$ (ker je $\mu_0 / (2\pi) = 2 \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$).
3. Sklopljeni pretok: $\Psi = 10 \cdot 6{,}44 \cdot 10^{-6} = 6{,}44 \cdot 10^{-5}\,\mathrm{Wb}$.
4. Tok narašča enakomerno, zato je napetost stalna: $\lvert u_i \rvert = 6{,}44 \cdot 10^{-5} / 0{,}005 \approx 0{,}0129\,\mathrm V = 12{,}9\,\mathrm{mV}$.
5. Tok v zanki: $i_z = 0{,}0129 / 0{,}5 \approx 0{,}0258\,\mathrm A = 25{,}8\,\mathrm{mA}$.
6. Smer: na strani zanke kaže polje kabla v zanko (glej skico). Pretok narašča, zato inducirani tok ustvarja polje iz zanke. To pomeni, da na bližnji stranici teče *nasproti* toku v kablu. Nasprotna tokova se odbijata: zanko odriva stran, kjer je pretok manjši, tako kot zahteva Lenzovo pravilo.
7. Odgovor: inducira se $12{,}9\,\mathrm{mV}$, teče $25{,}8\,\mathrm{mA}$; na stranici ob kablu v nasprotni smeri kot tok v kablu.

### Primer 4 – zdaj ti

Generator v laboratoriju ima tuljavo s $100$ ovoji in ploščino $0{,}020\,\mathrm{m^2}$, ki se vrti z $1500$ vrtljaji na minuto v homogenem polju $0{,}25\,\mathrm T$. Kolikšni sta amplituda in efektivna vrednost inducirane napetosti?

**Podatki:** $N = 100$, $A = 0{,}020\,\mathrm{m^2}$, $n = 1500\,\mathrm{min^{-1}}$, $B = 0{,}25\,\mathrm T$
**Iščemo:** $\hat u$ in $U$

:::formula
$\omega = 2\pi n$, $\hat u = N B A \omega$, $U = \dfrac{\hat u}{\sqrt 2}$
:::

**Rešitev:**

1. Vrtljaje pretvorimo v sekunde: $n = 1500 / 60 = 25\,\mathrm{s^{-1}}$.
2. Kotna hitrost: $\omega = 2\pi \cdot 25 \approx 157{,}1\,\mathrm{s^{-1}}$.
3. Izračunaj še amplitudo in efektivno vrednost.

:::premisli
Kolikšna sta $\hat u$ in $U$?
---
$\hat u = 100 \cdot 0{,}25 \cdot 0{,}020 \cdot 157{,}1 \approx 78{,}5\,\mathrm V$, $U = 78{,}5 / \sqrt 2 \approx 55{,}5\,\mathrm V$.
:::

## Pogoste napake

- **»Močno polje inducira veliko napetost.«** Tuljava, ki miruje v stalnem polju $1\,\mathrm T$, nima inducirane napetosti. Odločilna je hitrost spremembe sklopljenega pretoka, ne velikost polja.
- **Lenzovo pravilo kot »nasprotuje polju«.** Inducirani tok ne nasprotuje polju, ampak spremembi pretoka. Pri padajočem pretoku inducirani tok polje celo krepi.
- **Pozabljeno število ovojev ali kot.** Pretok skozi en ovoj je $BA\cos\alpha$, sklopljeni pretok $N$-krat večji. Če pozabiš $N$, je rezultat napačen za faktor $N$.
- **Gostota polja ob vodniku kot stalna.** Pri zanki ob kablu ne smeš vzeti $B$ v sredini zanke in pomnožiti s ploščino. Polje pada z $1/r$, zato pride logaritem.
- **Napetost iz meritve brez integrala.** Pri Primeru 2 ne zadošča največja vrednost napetosti krat čas. Pretok je ploščina pod krivuljo $u(t)$.

## Povzetek

- Magnetni pretok je $\Phi = \int \vec B \cdot \mathrm{d}\vec A$ (v homogenem polju $BA\cos\alpha$), enota $\mathrm{Wb} = \mathrm{V\,s}$; sklopljeni pretok tuljave je $\Psi = N\Phi$.
- Faradayev zakon: $u_i = -\mathrm{d}\Psi/\mathrm{d}t$; smer obhoda in normala sta povezani s pravilom desne roke.
- Lenzovo pravilo (minus): inducirani tok nasprotuje spremembi pretoka; sledi iz ohranitve energije.
- Gibalna napetost palice: $u_i = Blv$; izpeljemo jo iz Lorentzove sile ali iz spremembe ploščine.
- Vrteča se tuljava: $u_i = NBA\omega\sin\omega t$, amplituda $NBA\omega$.
- Iz zapisa napetosti dobimo pretok z integralom (fluksmeter).

## Za izpit

Znati moraš povedati:

- definicijo magnetnega in sklopljenega pretoka ter dogovor o smeri normale in obhoda;
- Faradayev zakon s predznakom in Lenzovo pravilo ter zakaj predznak sledi iz ohranitve energije;
- izpeljavo gibalne inducirane napetosti $u_i = Blv$ iz Lorentzove sile in iz spremembe pretoka;
- izpeljavo napetosti vrteče se tuljave $u_i = NBA\omega\sin\omega t$;
- pretok skozi pravokotno zanko ob ravnem vodniku in iz njega inducirano napetost.

### Naloga 1

Po dolgem ravnem vodniku teče stalni tok $200\,\mathrm A$. V isti ravnini je pravokotna tuljava s $50$ ovoji in upornostjo $2\,\mathrm{\Omega}$. Stranici dolžine $b = 0{,}30\,\mathrm m$ sta vzporedni z vodnikom, širina tuljave je $a = 0{,}10\,\mathrm m$. Tuljavo odmikamo od vodnika s stalno hitrostjo $5\,\mathrm{m/s}$. (a) Kolikšna napetost se inducira v trenutku, ko je bližnja stranica $x = 5\,\mathrm{cm}$ od vodnika? Izračunaj jo na dva načina. (b) Kolikšna sta tok in sila, s katero moramo tuljavo vleči? Pokaži, da je mehanska moč enaka toplotni. (c) Kolikšna je napetost, ko je $x = 15\,\mathrm{cm}$?

**Rešitev:**

1. Polje ob bližnji stranici: $B_1 = 2 \cdot 10^{-7} \cdot 200 / 0{,}05 = 8{,}0 \cdot 10^{-4}\,\mathrm T$; ob daljni ($0{,}15\,\mathrm m$): $B_2 = 2 \cdot 10^{-7} \cdot 200 / 0{,}15 \approx 2{,}67 \cdot 10^{-4}\,\mathrm T$.
2. Gibalna napetost bližnje stranice: $N B_1 b v = 50 \cdot 8{,}0 \cdot 10^{-4} \cdot 0{,}30 \cdot 5 = 0{,}060\,\mathrm V$; daljne: $50 \cdot 2{,}67 \cdot 10^{-4} \cdot 0{,}30 \cdot 5 \approx 0{,}020\,\mathrm V$.
3. Napetosti stranic v zanki delujeta druga proti drugi (obe stranici se gibljeta v isto smer), zato je $u_i = 0{,}060 - 0{,}020 = 0{,}040\,\mathrm V$. Stranici, pravokotni na vodnik, k napetosti ne prispevata, ker je zanje $\vec v$ vzporeden s palico.
4. Drugi način: $\Psi(x) = N \dfrac{\mu_0 I b}{2\pi} \ln\dfrac{x + a}{x}$. Odvod po času je $\dfrac{\mathrm{d}\Psi}{\mathrm{d}t} = N\dfrac{\mu_0 I b}{2\pi}\left(\dfrac{1}{x + a} - \dfrac{1}{x}\right) v$.
5. Številke: $50 \cdot 2 \cdot 10^{-7} \cdot 200 \cdot 0{,}30 \cdot (6{,}667 - 20) \cdot 5 \approx -0{,}040\,\mathrm{V}$, torej $\lvert u_i \rvert = 0{,}040\,\mathrm V$, enako kot zgoraj.
6. Tok: $i_z = 0{,}040 / 2 = 0{,}020\,\mathrm A$. Pretok pada, zato tok na bližnji stranici teče v isti smeri kot v vodniku in jo privlači; daljno stranico odbija.
7. Rezultanta sil: $F = N i_z b (B_1 - B_2) = 50 \cdot 0{,}020 \cdot 0{,}30 \cdot 5{,}33 \cdot 10^{-4} \approx 1{,}6 \cdot 10^{-4}\,\mathrm N$, usmerjena proti vodniku. S tako silo moramo vleči.
8. Moči: $F v = 1{,}6 \cdot 10^{-4} \cdot 5 = 8{,}0 \cdot 10^{-4}\,\mathrm W$ in $u_i i_z = 0{,}040 \cdot 0{,}020 = 8{,}0 \cdot 10^{-4}\,\mathrm W$. Vloženo delo se v celoti spremeni v toploto.
9. (c) Pri $x = 0{,}15\,\mathrm m$: $\dfrac{1}{0{,}15} - \dfrac{1}{0{,}25} \approx 2{,}667\,\mathrm{m^{-1}}$ namesto $13{,}33\,\mathrm{m^{-1}}$, zato je napetost $5$-krat manjša, $0{,}0080\,\mathrm V$.
10. Odgovor: (a) $40\,\mathrm{mV}$; (b) $20\,\mathrm{mA}$, sila $0{,}16\,\mathrm{mN}$, obe moči $0{,}80\,\mathrm{mW}$; (c) $8{,}0\,\mathrm{mV}$.

### Naloga 2

Natančno navedi Faradayev zakon indukcije z dogovorom o predznaku. Za palico, ki drsi po dveh sklenjenih tirnicah v homogenem polju, izpelji inducirano napetost iz Lorentzove sile in pokaži, da se ujema s Faradayevim zakonom. Utemelji, zakaj Lenzovo pravilo sledi iz ohranitve energije.

**Rešitev:**

1. Zakon: v sklenjeni zanki se inducira $u_i = -\mathrm{d}\Psi/\mathrm{d}t$. Pozitivna smer $u_i$ je smer obhoda, ki je z izbrano normalo ploskve povezana s pravilom desne roke.
2. Lorentzova sila na prosti naboj v palici je $q v B$ vzdolž palice. Njeno delo na poti $l$ je $q v B l$. Delo na enoto naboja je napetost $u_i = Blv$.
3. Ploščina zanke se v času $\mathrm{d}t$ spremeni za $\mathrm{d}A = l v\,\mathrm{d}t$, pretok za $\mathrm{d}\Phi = B l v\,\mathrm{d}t$. Iz zakona: $\lvert u_i \rvert = Blv$. Rezultata se ujemata.
4. Ohranitev energije: tok $i = u_i/R$ v palici čuti silo $F = i l B$. Pri minusu sila zavira palico, zato moramo vleči z močjo $F v = i Blv = u_i i$, kar je toplotna moč upora. Pri plusu bi sila palico pospeševala, hitrost in tok bi rasla brez vloženega dela, energija pa bi nastajala iz nič.
5. Sklep: minus (Lenzovo pravilo) je edini predznak, skladen z ohranitvijo energije.

## Drugače: Z analogijo

Lenzovo pravilo je električna **vztrajnost**. Telo se upira spremembi hitrosti, ne hitrosti sami. Zanka se podobno upira spremembi pretoka, ne pretoku samemu. Ko pretok narašča, »zavira«; ko pada, »potiska naprej«.

Druga analogija je **viskozno trenje**. Pri palici na tirnicah je zaviralna sila $F = B^2 l^2 v / R$, torej sorazmerna s hitrostjo, tako kot sila v blažilniku z oljem. Manjši upor $R$ pomeni »gostejše olje« in močnejše zaviranje. Zato bakrena plošča med poloma magneta niha le nekaj nihajev, prerezana na trakove pa dolgo: reže povečajo upornost poti vrtinčnih tokov.

## Drugače: Uporaba v stroki

- **Elektromagnetni merilnik pretoka.** Prevodna tekočina teče s hitrostjo $v$ skozi cev s premerom $d$ v polju $B$. Elektrodi na steni izmerita $u = B d v$. Merilnik nima gibljivih delov in ne ovira toka, zato ga uporabljajo v vodovodih in živilski industriji.
- **Rogowskijeva tuljava.** Toroidna tuljava brez železnega jedra objema vodnik. Napetost je sorazmerna z $\mathrm{d}i/\mathrm{d}t$; integrator da tok. Meri tudi tokove več kiloamperov, ker se jedro ne more nasičiti.
- **Vrtinčni tokovi.** Jedra transformatorjev in motorjev so iz tankih izoliranih pločevin, da so zanke vrtinčnih tokov kratke in izgube majhne. Indukcijska plošča in zavore vlakov ter dvigal vrtinčne tokove izkoriščajo namerno.
- **Neporušno preizkušanje.** Sonda z izmenično tuljavo inducira vrtinčne tokove v kovini. Razpoka jih preusmeri, kar spremeni impedanco sonde. Tako pregledujejo letalske dele in cevi toplotnih izmenjevalnikov.

## Drugače: Bolj natančno

Za mirujočo zanko lahko zakon zapišemo z električnim poljem:

$$\oint_C \vec E \cdot \mathrm{d}\vec l = -\int_A \frac{\partial \vec B}{\partial t} \cdot \mathrm{d}\vec A$$

To je ena od Maxwellovih enačb. Pove nekaj presenetljivega: spremenljivo magnetno polje ustvari električno polje, katerega krivuljni integral po sklenjeni poti ni nič. Tako polje ni potencialno. Napetost med dvema točkama je zato odvisna od poti. Dva voltmetra, priključena na isti dve točki, a z žicami na različnih straneh spremenljivega pretoka, pokažeta različno.

Za gibajoče se zanke velja splošneje, da je inducirana napetost vsota dveh delov: integrala $(\vec v \times \vec B) \cdot \mathrm{d}\vec l$ po gibajočih se delih (gibalni del) in $-\int \partial\vec B/\partial t \cdot \mathrm{d}\vec A$ (transformatorski del). Za tanke žice je vsota enaka $-\mathrm{d}\Psi/\mathrm{d}t$. Pri razsežnih vodnikih, na primer pri Faradayevem disku, ki se vrti v polju, pa moramo uporabiti Lorentzovo silo neposredno, ker »zanke« ni mogoče enolično določiti.

## Preveri se

? Kateri primer NE spada zraven, ker se v tuljavi napetost ne inducira?
- Tuljava se vrti v stalnem homogenem polju.
~ Pri vrtenju se spreminja kot med normalo in poljem, zato se spreminja tudi pretok.
- Magnet približujemo tuljavi.
~ Gostota polja v tuljavi narašča, s tem tudi pretok.
+ Tuljava miruje v močnem stalnem polju.
- V sosednji tuljavi narašča tok.
~ Naraščajoč tok spremeni pretok tudi skozi sosednjo tuljavo; tako deluje transformator.
> Inducirana napetost je sorazmerna s hitrostjo spremembe pretoka. Pri mirujoči tuljavi v stalnem polju je ta nič, ne glede na velikost polja.

? Tuljava ima $100$ ovojev s ploščino $10\,\mathrm{cm^2}$ pravokotno na polje. Gostota polja enakomerno pade z $0{,}5\,\mathrm T$ na $0$ v $0{,}1\,\mathrm s$. Kolikšna je inducirana napetost?
- $5\,\mathrm{mV}$
~ To je napetost enega ovoja. Pozabljeno je število ovojev.
+ $0{,}5\,\mathrm V$
- $50\,\mathrm V$
~ Ploščina je ostala v $\mathrm{cm^2}$: $10\,\mathrm{cm^2} = 10^{-3}\,\mathrm{m^2}$, ne $10^{-1}\,\mathrm{m^2}$.
- $0$, ker je končno polje nič.
~ Odločilna je sprememba pretoka, ne končna vrednost polja.
> $\lvert u_i \rvert = 100 \cdot 10^{-3} \cdot 0{,}5 / 0{,}1 = 0{,}5\,\mathrm V$.

? Na železno jedro tuljave položimo aluminijast obroč. Ko vklopimo izmenični tok v tuljavi, obroč odskoči navzgor. Zakaj?
- Aluminij je feromagneten in ga tuljava privlači.
~ Aluminij ni feromagneten. Privlak bi obroč potegnil navzdol k tuljavi, ne pa navzgor.
+ Inducirani tok v obroču ustvari polje, ki nasprotuje spremembi pretoka, zato se obroč in tuljava odbijata.
- Tok v tuljavi segreje obroč in vroč zrak ga dvigne.
~ Segrevanje je prepočasno in prešibko za sunkovit skok ob vklopu.
> Po Lenzovem pravilu tok v obroču teče nasproti toku v tuljavi; nasprotna tokova se odbijata.

? Krožna tuljava s $100$ ovoji ima polmer $2\,\mathrm{cm}$. Polje skozi njo pravokotno naraste od $0$ na $0{,}2\,\mathrm T$ v $10\,\mathrm{ms}$. Rešitev: »1. $A = \pi d^2 = \pi \cdot 0{,}04^2 \approx 5{,}03 \cdot 10^{-3}\,\mathrm{m^2}$. 2. $\Delta\Psi = 100 \cdot 5{,}03 \cdot 10^{-3} \cdot 0{,}2 \approx 0{,}10\,\mathrm{Wb}$. 3. $u_i = 0{,}10 / 0{,}01 \approx 10\,\mathrm V$.« Kateri korak je napačen?
+ Korak 1: ploščina je $\pi r^2 \approx 1{,}26 \cdot 10^{-3}\,\mathrm{m^2}$, zato je pravilno $u_i \approx 2{,}5\,\mathrm V$.
- Korak 2: pretok bi moral biti brez faktorja $100$.
~ Sklopljeni pretok tuljave je $N\Phi$, zato faktor $100$ spada zraven.
- Korak 3: napetost bi bila $0{,}10 \cdot 0{,}01\,\mathrm V$.
~ Napetost je sprememba pretoka, *deljena* s časom, ne pomnožena z njim.
- Vsi koraki so pravilni.
~ Ploščina kroga je $\pi r^2$ ali $\pi d^2/4$, ne $\pi d^2$; napaka da štirikrat preveliko napetost.
> $A = \pi \cdot 0{,}02^2 \approx 1{,}257 \cdot 10^{-3}\,\mathrm{m^2}$, $u_i = 100 \cdot 1{,}257 \cdot 10^{-3} \cdot 0{,}2 / 0{,}01 \approx 2{,}51\,\mathrm V$.

? Elektromagnetni merilnik pretoka ima cev s premerom $0{,}10\,\mathrm m$ in polje $0{,}010\,\mathrm T$. Voda teče s povprečno hitrostjo $2\,\mathrm{m/s}$. Kolikšno napetost izmerita elektrodi?
- $0{,}2\,\mathrm V$
~ Premer je vstavljen v centimetrih: $0{,}010 \cdot 10 \cdot 2 = 0{,}2$. Pred računom pretvori $d = 0{,}10\,\mathrm m$.
+ $2\,\mathrm{mV}$
- $0$, ker voda ni kovina.
~ Voda iz vodovoda vsebuje ione in je dovolj prevodna. Napetost se inducira zaradi gibanja nabojev v polju.
- $20\,\mathrm{mV}$
~ To je $Bv = 0{,}010 \cdot 2 = 0{,}02\,\mathrm V$: pozabljen je premer. Dolžina »palice« med elektrodama je ves premer $d$.
> Tekočina med elektrodama je kot palica dolžine $d$: $u = Bdv = 0{,}010 \cdot 0{,}10 \cdot 2 = 0{,}002\,\mathrm V$.

:::simboli
\Phi | magnetni pretok | \Phi = B A \cos\alpha | Wb | v homogenem polju
\Psi | sklopljeni pretok | \Psi = N \Phi | Wb
u_i | inducirana napetost | u_i = -\frac{\mathrm{d}\Psi}{\mathrm{d}t} | V
\hat u | amplituda inducirane napetosti | \hat u = N B A \omega | V
U | efektivna vrednost napetosti | U = \frac{\hat u}{\sqrt 2} | V
N | število ovojev | | –
B | gostota magnetnega polja | | T
A | ploščina ovoja | | m^2
\alpha | kot med normalo in poljem | | rad
l | dolžina palice | | m
v | hitrost | | m/s
\omega | kotna hitrost vrtenja | \omega = 2\pi n | s^{-1}
n | vrtilna frekvenca | | s^{-1} | vrtljaji na sekundo
i | tok v vodniku | | A
i_z | tok v zanki | i_z = \frac{u_i}{R} | A
R | upornost zanke | | \Omega
b | dolžina stranice ob vodniku | | m
r_1, r_2 | razdalji stranic od vodnika | | m
\mu_0 | indukcijska konstanta | | V\,s/(A\,m) | $4\pi \cdot 10^{-7}$
E | jakost električnega polja | | V/m
t | čas | | s
h | časovni korak meritve | | s
u_0, u_1, u_{n-1}, u_n | izmerjeni vzorci napetosti | | V | vsakih $h$ sekund
C | sklenjena pot (rob ploskve $A$) | | | obhod po pravilu desne roke
:::
