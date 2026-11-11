---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Kuharica Ana je za svojo bodočo slaščičarno privarčevala $2000\,\text{€}$. Dve banki ji ponujata:

- **Banka A:** vsako leto ji pripiše $6\,\%$ od začetnih $2000\,\text{€}$, torej vsako leto $120\,\text{€}$.
- **Banka B:** vsako leto ji pripiše le $5\,\%$, a vsakič od zneska, ki je takrat na računu.

V kateri banki bo imela več, če denar potrebuje čez $5$ let? In če ga potrebuje čez $10$ let? Oceni, preden bereš naprej. Odgovor te morda preseneti.

Z obrestmi se srečaš povsod: pri varčevanju, kreditu za kuhinjsko opremo, lizingu za avto. Po istem računu rastejo tudi cene živil, ko se vsako leto podražijo za nekaj odstotkov. Kdor zna obresti izračunati, ne naseda ponudbam, ki se le na prvi pogled zdijo ugodnejše.

## Razlaga

**1. Obresti za eno leto.** Znesek, ki ga vložimo v banko, je **glavnica** $G_0$. Banka si od nas izposodi denar in nam zanj plača **obresti** $o$. Koliko, pove **letna obrestna mera** $p$: odstotek glavnice, ki ga dobimo v enem letu.

$$o = \frac{G_0 \cdot p}{100}$$

Račun je enak kot v receptu, kjer je kvasa $5\,\%$ mase moke: odstotek od celote.

*Hitri preizkus:* koliko obresti dobiš v enem letu za $400\,\text{€}$ pri $p = 5$? *(Odgovor: $20\,\text{€}$.)*

**2. Navadno obrestovanje.** Banka obresti vsako leto računa **od začetne glavnice**. Že dobljene obresti ne prinašajo novih obresti, zato so obresti vsako leto enake. Po $n$ letih imamo $G_0$ in še $n$-krat po $o$, torej $G_n = G_0 + n \cdot \frac{G_0 \cdot p}{100}$. Izpostavimo $G_0$:

$$G_n = G_0 \left(1 + \frac{n \cdot p}{100}\right)$$

Stanja $G_0, G_1, G_2, \dots$ tvorijo **aritmetično zaporedje** z diferenco $d = o$.

*Hitri preizkus:* $800\,\text{€}$ vložimo za $4$ leta pri $3\,\%$ navadno. Koliko je na računu na koncu? *(Odgovor: vsako leto $24\,\text{€}$, skupaj $896\,\text{€}$.)*

**3. Obrestno obrestovanje.** Banka ob koncu leta obresti **pripiše glavnici**. Naslednje leto se obrestujejo tudi te obresti, zato dobiš »obresti od obresti«. Kot kvašeno testo: raste toliko hitreje, kolikor več ga že je.

V enem letu se znesek poveča za $p\,\%$, torej se pomnoži z

$$r = 1 + \frac{p}{100}$$

Številu $r$ rečemo **obrestovalni faktor**. Pri $p = 3$ je $r = 1{,}03$. Vsako leto znova množimo z $r$:

$$G_n = G_0 \cdot r^n$$

Stanja tvorijo **geometrijsko zaporedje** s količnikom $r$.

*Hitri preizkus:* $800\,\text{€}$ za $2$ leti pri $3\,\%$ obrestno? *(Odgovor: $800 \cdot 1{,}03^2 = 848{,}72\,\text{€}$.)*

:::premisli
Napovej, preden pogledaš tabelo spodaj: ali imata navadno in obrestno obrestovanje pri isti glavnici in isti obrestni meri po prvem letu enako stanje? Kaj pa po drugem? Utemelji.
---
V prvem letu se obe obrestujeta od iste glavnice $G_0$, zato sta obresti enaki. Od drugega leta naprej obrestno obrestovanje računa obresti od $G_1 > G_0$, navadno pa še vedno od $G_0$. Razlika so obresti od že pripisanih obresti in vsako leto raste.
:::

**4. Primerjava.** Vzemimo $1000\,\text{€}$ pri $5\,\%$:

| leto $n$ | navadno [€] | obrestno [€] |
|---|---|---|
| 0 | 1000 | 1000 |
| 1 | 1050 | 1050 |
| 2 | 1100 | 1102,50 |
| 3 | 1150 | 1157,63 |
| 5 | 1250 | 1276,28 |
| 10 | 1500 | 1628,89 |
| 20 | 2000 | 2653,30 |

Če stanja narišeš kot točke, so pri navadnem obrestovanju na premici, saj vsako leto pridejo enake obresti. Pri obrestnem so na krivulji, ki se vse bolj vzpenja. Po $2$ letih je razlika le $2{,}50\,\text{€}$, po $20$ letih več kot $650\,\text{€}$.

V simulaciji spodaj »Navadno in obrestno obrestovanje« nastavi isto glavnico in obrestno mero za obe vrsti, nato povečuj število let. Opazuj, v katerem letu je razlika prvič večja od $10\,\%$ začetne glavnice.

:::premisli
Vrni se k uganki. Kje ima Ana več po $5$ letih in kje po $10$ letih? Napovej, nato izračunaj s $G_n = 2000\,(1 + 0{,}06\,n)$ za A in $G_n = 2000 \cdot 1{,}05^n$ za B.
---
Po $5$ letih: A $2600\,\text{€}$, B približno $2552{,}56\,\text{€}$, boljša je A. Po $10$ letih: A $3200\,\text{€}$, B približno $3257{,}79\,\text{€}$, boljša je B. Banka B prehiti A med 8. letom (A $2960\,\text{€}$, B $2954{,}91\,\text{€}$) in 9. letom (A $3080\,\text{€}$, B $3102{,}66\,\text{€}$). Pri kratkem varčevanju odloča višja mera, pri dolgem obresti od obresti.
:::

**5. Računanje nazaj.** Včasih poznamo končni znesek, iščemo pa, koliko vložiti danes. Iz $G_n = G_0 \cdot r^n$ sledi

$$G_0 = \frac{G_n}{r^n}$$

Končni znesek torej **delimo** z $r^n$. Odštevanje odstotkov od končnega zneska ni pravilno, ker se obresti računajo od vloge, ne od končnega zneska.

*Hitri preizkus:* koliko vložiti danes, da bo čez $2$ leti pri $4\,\%$ obrestno na računu $1081{,}60\,\text{€}$? *(Odgovor: $1081{,}60 : 1{,}04^2 = 1000\,\text{€}$.)*

## Rešeni primeri

### Primer 1 (lažji): navadno obrestovanje

Lastnik gostilne vloži $1500\,\text{€}$ za $3$ leta pri letni obrestni meri $4\,\%$ z navadnim obrestovanjem. Koliko obresti dobi in koliko bo na računu?

**Podatki:** $G_0 = 1500\,\text{€}$, $p = 4\,\%$, $n = 3$ leta, navadno obrestovanje
**Iščemo:** vse obresti in končno stanje $G_3$

:::formula
$o = \dfrac{G_0 \cdot p}{100}$, $\quad G_n = G_0 \left(1 + \dfrac{n \cdot p}{100}\right)$
:::

**Rešitev:**

1. Obresti v enem letu: $o = \dfrac{1500 \cdot 4}{100} = 60$, torej $60\,\text{€}$.
2. Pri navadnem obrestovanju so vsako leto enake, zato v treh letih $3 \cdot 60 = 180$, torej $180\,\text{€}$.
3. Končno stanje: $\frac{3 \cdot 4}{100} = 0{,}12$, zato $G_3 = 1500 \cdot (1 + 0{,}12) = 1680$, torej $1680\,\text{€}$.
4. Odgovor: lastnik dobi $180\,\text{€}$ obresti, na računu bo $1680\,\text{€}$.

### Primer 2: obrestno obrestovanje

Isti znesek $1500\,\text{€}$ vloži za $3$ leta pri $4\,\%$, tokrat z obrestnim obrestovanjem in letnim pripisom. Koliko bo na računu in koliko več kot v primeru 1?

**Podatki:** $G_0 = 1500\,\text{€}$, $p = 4\,\%$, $n = 3$ leta, obrestno obrestovanje; iz primera 1: navadno $1680\,\text{€}$
**Iščemo:** končno stanje $G_3$ in razliko do navadnega obrestovanja

:::formula
$r = 1 + \dfrac{p}{100}$, $\quad G_n = G_0 \cdot r^n$
:::

**Rešitev:**

1. Obrestovalni faktor: $r = 1 + \frac{4}{100} = 1{,}04$.
2. Po letih: $G_1 = 1500 \cdot 1{,}04 = 1560$, $G_2 = 1560 \cdot 1{,}04 = 1622{,}4$, $G_3 = 1622{,}4 \cdot 1{,}04 = 1687{,}296$.
3. Isto naenkrat: $G_3 = 1500 \cdot 1{,}04^3 = 1687{,}296$, zaokroženo $1687{,}30\,\text{€}$. Zaokrožimo šele na koncu.
4. Razlika: $1687{,}30 - 1680 = 7{,}30$, torej $7{,}30\,\text{€}$. To so obresti od obresti iz 1. in 2. leta.
5. Odgovor: na računu bo $1687{,}30\,\text{€}$, kar je $7{,}30\,\text{€}$ več kot pri navadnem obrestovanju.

### Primer 3 (težji): koliko vložiti danes

Slaščičar Marko želi čez $5$ let kupiti novo krušno peč za $6000\,\text{€}$. Banka ponuja $3\,\%$ letno z obrestnim obrestovanjem. Koliko mora vložiti danes? Koliko bi moral vložiti pri navadnem obrestovanju z isto mero?

**Podatki:** $G_5 = 6000\,\text{€}$, $p = 3\,\%$, $n = 5$ let, obrestno obrestovanje (za primerjavo še navadno)
**Iščemo:** potrebno vlogo $G_0$ pri obrestnem in pri navadnem obrestovanju

:::formula
obrestno: $G_0 = \dfrac{G_n}{r^n}$; $\quad$ navadno: $G_0 = \dfrac{G_n}{1 + \frac{n \cdot p}{100}}$
:::

**Rešitev:**

1. Obrestovalni faktor: $r = 1{,}03$. Potenca: $r^5 = 1{,}03^5 \approx 1{,}159274$. Obdržimo več decimalk, ker z njo delimo velik znesek.
2. Obrestno: $G_0 = \dfrac{6000}{1{,}159274} \approx 5175{,}65$, torej približno $5175{,}65\,\text{€}$.
3. Navadno: faktor je $1 + \frac{5 \cdot 3}{100} = 1{,}15$, zato $G_0 = \dfrac{6000}{1{,}15} \approx 5217{,}39$, torej približno $5217{,}39\,\text{€}$.
4. Preizkus za obrestno: $5175{,}65 \cdot 1{,}03^5 \approx 6000$. Navadno zahteva približno $41{,}74\,\text{€}$ večjo vlogo, ker ne prinaša obresti od obresti.
5. Odgovor: pri obrestnem obrestovanju mora Marko vložiti približno $5175{,}65\,\text{€}$, pri navadnem približno $5217{,}39\,\text{€}$.

### Primer 4 – zdaj ti: obrestna mera

Ana vloži $2000\,\text{€}$ z obrestnim obrestovanjem. Po $2$ letih ima na računu $2163{,}20\,\text{€}$. Kolikšna je letna obrestna mera?

**Podatki:** $G_0 = 2000\,\text{€}$, $G_2 = 2163{,}20\,\text{€}$, $n = 2$ leti, obrestno obrestovanje
**Iščemo:** obrestno mero $p$

:::formula
$G_n = G_0 \cdot r^n$, $\quad r = 1 + \dfrac{p}{100}$
:::

**Rešitev:**

1. Iz formule: $r^2 = \dfrac{G_2}{G_0} = \dfrac{2163{,}2}{2000} = 1{,}0816$.
2. Iz $r^2$ dobiš $r$ s korenjenjem. Izračunaj $r$, nato iz $r = 1 + \frac{p}{100}$ še $p$. Preveri:

:::premisli
Koliko sta $r$ in $p$?
---
$r = \sqrt{1{,}0816} = 1{,}04$, zato $\frac{p}{100} = 0{,}04$ in $p = 4\,\%$. Preizkus: $2000 \cdot 1{,}04^2 = 2163{,}20\,\text{€}$.
:::

## Pogoste napake

- **Odstotek v faktorju kot celo število.** Pri $p = 4$ nekateri zapišejo $r = 1 + 4 = 5$ ali $r = 1{,}4$. Pravilno je $r = 1 + \frac{4}{100} = 1{,}04$. Preveri: faktor pri majhni obrestni meri je le malo večji od $1$.
- **Množenje z $n$ namesto potenciranja.** »$3000 \cdot 1{,}02 \cdot 3 = 9180\,\text{€}$.« Tako bi denar v treh letih skoraj potrojil. Vsako leto znova množimo z $r$, zato je prav $3000 \cdot 1{,}02^3$.
- **Zamenjani vrsti obrestovanja.** Pri obrestnem obrestovanju nekateri računajo $G_0\,(1 + \frac{n \cdot p}{100})$, kot da obresti ne bi bile pripisane. To je formula za navadno obrestovanje in da premalo. Najprej se vprašaj: se obresti računajo od začetne glavnice ali od trenutnega stanja?
- **Računanje nazaj z odštevanjem.** »Čez $5$ let pri $3\,\%$ je $15\,\%$, $6000 - 900 = 5100\,\text{€}$.« Obresti se računajo od vloge, ne od končnega zneska. Preizkus pokaže napako: $5100 \cdot 1{,}03^5 \approx 5912\,\text{€}$. Končni znesek deli z $r^n$.
- **»Obrestno je vedno boljše.«** Pri isti obrestni meri da obrestno obrestovanje po prvem letu enako, pozneje več. Pri različnih merah pa je lahko navadno z višjo mero dolgo ugodnejše, kot kaže uganka. Primerjaj s številkami za tvoje število let.

## Povzetek

- Glavnica $G_0$, letna obrestna mera $p$, obresti za eno leto $o = \dfrac{G_0 \cdot p}{100}$.
- Navadno obrestovanje: obresti vedno od $G_0$; $G_n = G_0 \left(1 + \dfrac{n \cdot p}{100}\right)$; stanja tvorijo aritmetično zaporedje.
- Obrestno obrestovanje: obresti se pripišejo in obrestujejo naprej; $G_n = G_0 \cdot r^n$, $r = 1 + \dfrac{p}{100}$; stanja tvorijo geometrijsko zaporedje.
- Pri isti meri sta obe po 1. letu enaki, nato obrestno raste hitreje.
- Nazaj: $G_0 = \dfrac{G_n}{r^n}$; obrestna mera iz $r^n = \dfrac{G_n}{G_0}$.
- Zaokrožuj šele na koncu.

## Drugače: Na sliki

Predstavljaj si stanje na računu kot stolpce, en stolpec za vsako leto.

**Navadno:** vsak naslednji stolpec je višji za enako velik kos, za $o$. Vrhovi stolpcev ležijo na ravni črti. Kot stopnice z enako visokimi stopnicami.

**Obrestno:** vsak naslednji stolpec je višji za kos, ki je $p\,\%$ *prejšnjega* stolpca. Ker stolpci rastejo, rastejo tudi kosi. Vrhovi ležijo na krivulji, ki se vse bolj vzpenja. Kot stopnice, kjer je vsaka stopnica malo višja od prejšnje.

V prvem letu sta obe stopnici enaki. Prostor med črto in krivuljo so obresti od obresti. Na začetku je tanek kot list. Pri $1000\,\text{€}$ in $5\,\%$ po dvajsetih letih meri več kot $650\,\text{€}$, kar je več kot trinajst navadnih stopnic po $50\,\text{€}$.

## Drugače: Bolj natančno

**Zakaj je obrestno vsaj tolikšno kot navadno.** Naj bo $x = \frac{p}{100} > 0$. Trdimo: $(1 + x)^n \ge 1 + nx$ za vsak naravni $n$ (Bernoullijeva neenakost). Dokaz z indukcijo: za $n = 1$ velja enakost. Če velja za $n$, je $(1 + x)^{n+1} = (1 + x)^n (1 + x) \ge (1 + nx)(1 + x)$. Desna stran je $(1 + nx)(1 + x) = 1 + (n+1)x + nx^2$, kar je $\ge 1 + (n+1)x$.
Člen $nx^2$ so »obresti od obresti«: obresti, ki jih v $(n+1)$-tem letu prinesejo dotlej zbrane navadne obresti $nx$. Ker je pozitiven, je neenakost za $n \ge 2$ stroga.

**Pripis večkrat na leto.** Banka lahko obresti pripisuje mesečno. Takrat uporabi **relativno obrestno mero** $\frac{p}{12}$ na mesec in $12n$ pripisov v $n$ letih: $G = G_0 \left(1 + \frac{p}{1200}\right)^{12n}$. Za $1000\,\text{€}$ pri $6\,\%$ v enem letu dobiš približno $1061{,}68\,\text{€}$ namesto $1060\,\text{€}$. Pogostejši pripis pomeni malo več.

**Povezava z vrstami.** Če vsako leto vložiš enak znesek, je končno stanje vsota geometrijskega zaporedja (vsaka vloga se obrestuje drugače dolgo). Taki računi so osnova za varčevalne načrte in obroke kreditov.

## Preveri se

? Katera trditev je pravilna?
- Pri navadnem obrestovanju se obresti vsako leto računajo od trenutnega stanja.
~ To opisuje obrestno obrestovanje. Pri navadnem se obresti vedno računajo od začetne glavnice $G_0$.
- Pri obrestnem obrestovanju se stanje vsako leto poveča za enak znesek.
~ Enak znesek vsako leto je značilnost navadnega obrestovanja. Pri obrestnem se poveča za enak odstotek, znesek obresti pa raste.
+ Pri navadnem obrestovanju stanja tvorijo aritmetično, pri obrestnem geometrijsko zaporedje.
- Pri $p = 5\,\%$ je obrestovalni faktor $r = 1{,}5$.
~ $5\,\% = 0{,}05$, zato je $r = 1{,}05$. Faktor $1{,}5$ bi pomenil $50\,\%$.
> Navadno: vsako leto prištejemo enak $o$ (diferenca). Obrestno: vsako leto pomnožimo z $r$ (količnik).

? Koliko je na računu po $3$ letih, če vložimo $3000\,\text{€}$ pri $2\,\%$ z obrestnim obrestovanjem?
- $3180{,}00\,\text{€}$
~ To je navadno obrestovanje: $3000 \cdot (1 + 0{,}06)$. Pri obrestnem se obrestujejo tudi pripisane obresti.
- $9180{,}00\,\text{€}$
~ To je $3000 \cdot 1{,}02 \cdot 3$. Faktor $r$ ne množimo s številom let, ampak ga potenciramo: $r^3$.
- $5184{,}00\,\text{€}$
~ To je $3000 \cdot 1{,}2^3$. Pri $2\,\%$ je $r = 1{,}02$, ne $1{,}2$.
+ $3183{,}62\,\text{€}$
> $G_3 = 3000 \cdot 1{,}02^3 = 3183{,}624 \approx 3183{,}62\,\text{€}$.

? Jure računa, koliko vložiti danes, da bo čez $5$ let pri $3\,\%$ obrestno $6000\,\text{€}$: »$5 \cdot 3\,\% = 15\,\%$; $15\,\%$ od $6000\,\text{€}$ je $900\,\text{€}$; vložiti moram $6000 - 900 = 5100\,\text{€}$.« Kje je napaka?
- $5 \cdot 3\,\%$ ni $15\,\%$.
~ Zmnožek je pravilen. Napaka je v načinu računanja, ne v aritmetiki.
- Namesto odšteti bi moral $900\,\text{€}$ prišteti.
~ Vloga mora biti manjša od končnega zneska, ne večja, saj obresti znesek povečajo.
+ Obresti se računajo od vloge in se obrestujejo naprej; pravilno je $6000\,\text{€}$ deliti z $1{,}03^5$.
- Napake ni.
~ Preizkus: $5100 \cdot 1{,}03^5 \approx 5912\,\text{€}$, kar je manj od $6000\,\text{€}$.
> $G_0 = \frac{6000}{1{,}03^5} \approx 5175{,}65\,\text{€}$. Odstotke računamo od vloge, zato končni znesek delimo z $r^n$.

? Dve vlogi po $1000\,\text{€}$ sta $2$ leti naloženi pri $4\,\%$, ena navadno, druga obrestno. Katera trditev drži?
- Obe dasta enako, ker je obrestna mera enaka.
~ Enako dasta le po prvem letu. V drugem letu obrestno obrestuje tudi obresti prvega leta.
+ Obrestna da $1081{,}60\,\text{€}$, navadna $1080\,\text{€}$; razlika so obresti od obresti prvega leta.
- Navadna da več, ker so obresti vsako leto enake.
~ Enake obresti pomenijo počasnejšo rast. Pri obrestnem so obresti v drugem letu večje.
- Obrestna da dvakrat toliko obresti kot navadna.
~ Obresti sta $81{,}60\,\text{€}$ in $80\,\text{€}$. V kratkem času je razlika majhna.
> Navadno: $1000 \cdot 1{,}08 = 1080\,\text{€}$. Obrestno: $1000 \cdot 1{,}04^2 = 1081{,}60\,\text{€}$. Razlika $1{,}60\,\text{€}$ je $4\,\%$ od $40\,\text{€}$ obresti prvega leta.

? Restavracija letno porabi $10\,000\,\text{€}$ za živila. Cene vsako leto zrastejo za $2{,}5\,\%$ glede na prejšnje leto. Koliko bo za enako količino živil plačala čez $4$ leta?
- $10\,250\,\text{€}$
~ To je podražitev le za eno leto. Cene rastejo vsa $4$ leta.
- $11\,000\,\text{€}$
~ To je $4 \cdot 2{,}5\,\% = 10\,\%$, kot pri navadnem obrestovanju. Vsako leto se podraži že podražena cena.
+ približno $11\,038{,}13\,\text{€}$
> Podražitve se »obrestujejo« kot pri obrestnem obrestovanju: $10\,000 \cdot 1{,}025^4 \approx 11\,038{,}13\,\text{€}$.

:::simboli
G_0 | začetna glavnica (vloga) | G_0 = \dfrac{G_n}{r^n} | € | pri obrestnem obrestovanju
G_n | stanje na računu po $n$ letih | G_n = G_0 \cdot r^n | € | pri navadnem $G_n = G_0 (1 + \frac{np}{100})$
G_2, G_3, G_5 | stanje po 2, 3 oziroma 5 letih | | €
o | obresti za eno leto | o = \dfrac{G_0 \cdot p}{100} | €
p | letna obrestna mera | | \% | v formule vstavimo število brez znaka %
n | število let | | leta
r | obrestovalni faktor | r = 1 + \dfrac{p}{100} | –
:::
