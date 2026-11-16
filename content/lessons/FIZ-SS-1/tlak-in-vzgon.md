---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poleti na morju se potopiš do dna, ki je $4{,}0\,\mathrm{m}$ pod gladino. Že na pol poti začutiš pritisk v ušesih. Za koliko je tlak na dnu večji kot na gladini?

Druga uganka prihaja s severnih morij. Ledena gora je ogromen kos ledu, pa vseeno plava. Nad vodo gleda le približno desetina nje, vse drugo je skrito pod gladino. Zakaj ravno desetina?

Iz osnovne šole že poznaš tlak kot količnik sile in ploščine ($p = F/S$) ter gostoto snovi ($\rho = m/V$). Veš tudi, da se pri potapljanju v globino ušesa »zamašijo« in da les plava, kamen pa potone.

Oba pojava izhajata iz iste ideje: tlak v tekočini raste z globino. Iz nje sledita **hidrostatični tlak** in **Arhimedov zakon**. Na vprašanje o ušesih odgovori primer 1, na vprašanje o ledeni gori primer 3.

## Razlaga

**1. Tlak.** Tlak je količnik pravokotne sile na ploskev in ploščine te ploskve:

$$p = \frac{F}{S}$$

Enota je paskal: $1\,\text{Pa} = 1\,\text{N/m}^2$. Pogosto uporabljamo tudi $1\,\text{bar} = 100\,000\,\text{Pa}$. Zračni tlak ob morju je približno $1\,\text{bar}$.

*Hitri preizkus:* kolikšen tlak povzročiš na tla, če s težo $600\,\mathrm{N}$ stojiš na podplatih s skupno ploščino $0{,}040\,\mathrm{m^2}$? ($600 / 0{,}040 = 15\,000\,\mathrm{Pa}$.)

**2. Ali odloča količina vode?** Na polici stojita visoka plastenka z $1{,}5\,\mathrm{L}$ vode in nizek, širok bidon s $5\,\mathrm{L}$ vode. Kje voda bolj pritiska na dno? Voda v plastenki sega $0{,}30\,\mathrm{m}$ visoko, dno ima ploščino $0{,}0050\,\mathrm{m^2}$. Bidon ima dno s ploščino $0{,}020\,\mathrm{m^2}$, voda v njem sega $0{,}25\,\mathrm{m}$ visoko. Plastenko poenostavimo v valj (zoženje pri vratu zanemarimo). Obe posodi imata tako navpične stene, zato je tlak na dnu teža vode, deljena s ploščino dna:

| | plastenka | bidon |
|---|---|---|
| masa vode | $1{,}5\,\mathrm{kg}$ | $5{,}0\,\mathrm{kg}$ |
| teža $F_g$ | $14{,}7\,\mathrm{N}$ | $49\,\mathrm{N}$ |
| ploščina dna $S$ | $0{,}0050\,\mathrm{m^2}$ | $0{,}020\,\mathrm{m^2}$ |
| tlak $F_g/S$ | $2940\,\mathrm{Pa}$ | $2450\,\mathrm{Pa}$ |

Presenetljivo zmaga plastenka, čeprav ima več kot trikrat manj vode. Bidon ima res večjo težo vode, a jo razporedi na štirikrat večje dno. Odloča višina vode: $0{,}30\,\mathrm{m}$ proti $0{,}25\,\mathrm{m}$.

:::premisli
Vodo iz plastenke preliješ v ozek, visok valj, kjer sega $0{,}40\,\mathrm{m}$ visoko. Kaj se zgodi s tlakom na dnu, čeprav je vode enako?
---
Tlak naraste. Ista teža $14{,}7\,\mathrm{N}$ pritiska na manjše dno, in to natanko toliko, da je tlak sorazmeren z višino: $\dfrac{0{,}40}{0{,}30} \cdot 2940\,\mathrm{Pa} = 3920\,\mathrm{Pa}$.
:::

**3. Hidrostatični tlak.** Zdaj isto s črkami. V mirujoči tekočini tlak narašča z globino, ker spodnje plasti tekočine nosijo težo zgornjih. Pomisli na navpičen stolpec tekočine s ploščino preseka $S$ in višino $h$:

- prostornina: $V = S\,h$,
- masa: $m = \rho\,V = \rho\,S\,h$,
- teža: $F_g = m g = \rho\,S\,h\,g$.

Ta teža pritiska na ploščino $S$, zato je tlak, ki ga povzroča tekočina:

$$p_h = \frac{F_g}{S} = \rho\,g\,h$$

Tu je $\rho$ gostota tekočine, $g \approx 9{,}8\,\text{m/s}^2$ težni pospešek in $h$ globina pod gladino. Ploščina $S$ se je pokrajšala, zato širina posode ni pomembna. Preveri na plastenki: $1000 \cdot 9{,}8 \cdot 0{,}30 = 2940\,\mathrm{Pa}$, enako kot v tabeli.

*Hitri preizkus:* za koliko naraste tlak, ko se v vodi spustiš za $1{,}0\,\mathrm{m}$? ($1000 \cdot 9{,}8 \cdot 1{,}0 = 9800\,\mathrm{Pa}$, skoraj $10\,\mathrm{kPa}$.)

**4. Skupni tlak.** Če je gladina odprta v ozračje, na tekočino pritiska še zrak. Skupni tlak v globini $h$ je

$$p = p_0 + \rho\,g\,h$$

kjer je $p_0$ zunanji (zračni) tlak, ob morju približno $100\,\mathrm{kPa}$.

:::risba graf
opis: Graf tlaka v tekočini v odvisnosti od globine h od 0 do 20 m. Polna premica je skupni tlak p in se na gladini začne pri 100 kPa. Črtkana premica je hidrostatični tlak in se začne pri 0. Izbrana gostota je {r} kg/m³, globina {d} m: hidrostatični tlak je {r*9.8*d/1000:.1} kPa, skupni tlak {100 + r*9.8*d/1000:.1} kPa.
x: 0 .. 20 | 5 | h (m)
y: 0 .. 400 | 100 | p (kPa)
drsnik: r | 700 .. 1400 | 25 | 1000 | gostota tekočine v kg/m³
drsnik: d | 0 .. 20 | 1 | 10 | globina v metrih
f: 100 + r*9.8*x/1000 | modra
f: r*9.8*x/1000 | siva črtkano
točka: d; 100 + r*9.8*d/1000
točka: d; r*9.8*d/1000
napis: 0,5; 385 | skupni: {100 + r*9.8*d/1000:.1} kPa | desno
napis: 0,5; 345 | hidrostatični: {r*9.8*d/1000:.1} kPa | desno
napis: 18; 100 + r*9.8*18/1000 | p | nad levo
napis: 18; r*9.8*18/1000 | p_h | nad levo
podnapis: Polna črta p: skupni tlak. Črtkana pₕ: hidrostatični tlak. Gostota {r} kg/m³, globina {d} m.
:::

Na sliki je voda na globini $10\,\mathrm{m}$: hidrostatični tlak je $98\,\mathrm{kPa}$, skupni $198\,\mathrm{kPa}$. V aplikaciji premakni drsnik za globino na $20\,\mathrm{m}$. Opazi, da se hidrostatični tlak podvoji na $196\,\mathrm{kPa}$, skupni pa naraste le na $296\,\mathrm{kPa}$, ker zračni del ostane enak. Nato povečaj gostoto: obe premici postaneta strmejši, in to za enako, ter ostaneta ravni; polna je vedno za $100\,\mathrm{kPa}$ nad črtkano.

*Hitri preizkus:* zakaj polna premica ne gre skozi izhodišče? (Na gladini je tlak že $p_0$, ne nič.)

**5. Lastnosti hidrostatičnega tlaka.**

- Odvisen je samo od globine, gostote tekočine in $g$, **ne** od oblike posode ali količine tekočine.
- Na isti globini je tlak v tekočini povsod enak (ne glede na smer ploskve).
- Sila tlaka deluje pravokotno na stene posode.

**6. Vzgon.** Telo, potopljeno v tekočino, doživlja s strani tekočine silo navzgor. Vzrok je razlika tlakov: na spodnjo ploskev telesa deluje večji tlak (večja globina) kot na zgornjo, zato je sila navzgor večja od sile navzdol.

:::risba graf
opis: Kocka z robom 0,10 m, v celoti potopljena v vodo; gladina je na vrhu slike. Navpična puščica od gladine do zgornje ploskve kaže njeno globino h = {h:.2} m. Sila hidrostatičnega tlaka na zgornjo ploskev kaže navzdol in je F₁ = {98*h:.1} N, na spodnjo kaže navzgor in je F₂ = {98*(h+0.1):.1} N. Stranski sili sta enako veliki in nasprotni. Razlika F₂ − F₁ = 9,8 N je vzgon.
x: 0 .. 8 | 1 | 
y: 0 .. 10 | 1 | 
enako: da
oznake: ne
mreža: ne
drsnik: h | 0,15 .. 0,4 | 0,05 | 0,2 | globina zgornje ploskve v metrih
pravokotnik: 0; 0 .. 8; 9 | modra
črta: 0; 9 -> 8; 9 | modra
napis: 0,2; 9,5 | gladina | desno
pravokotnik: 3,5; 8 - 10*h .. 4,5; 9 - 10*h | debelo
puščica: 1; 9 -> 1; 9 - 10*h | h = {h:.2} m | desno
puščica: 4; 9 - 5*h -> 4; 9 - 10*h | F_1 = {98*h:.1} N | desno
puščica: 4; 8 - 10*h - 5*(h + 0.1) -> 4; 8 - 10*h | F_2 = {98*(h + 0.1):.1} N | desno
puščica: 3,5 - 5*(h + 0.05); 8,5 - 10*h -> 3,5; 8,5 - 10*h | | | siva
puščica: 4,5 + 5*(h + 0.05); 8,5 - 10*h -> 4,5; 8,5 - 10*h | | | siva
podnapis: Zgornja ploskev na globini {h:.2} m: vzgon F₂ − F₁ = 9,8 N.
:::

Na sliki je zgornja ploskev kocke z robom $0{,}10\,\mathrm{m}$ na globini $0{,}20\,\mathrm{m}$, spodnja na $0{,}30\,\mathrm{m}$. Sila hidrostatičnega tlaka na zgornjo ploskev je $F_1 = 19{,}6\,\mathrm{N}$, na spodnjo $F_2 = 29{,}4\,\mathrm{N}$, razlika je $9{,}8\,\mathrm{N}$. Zračnega tlaka tu ne štejemo: na obe ploskvi pritiska enako in se pri razliki odšteje (glej »Bolj natančno«). V aplikaciji spuščaj kocko globlje. Opazi, da se obe puščici daljšata za enako, zato njuna razlika ostane $9{,}8\,\mathrm{N}$. Toliko je teža litra vode, ki bi napolnil prostor kocke.

**7. Arhimedov zakon.** Vzgon je enak teži izpodrinjene tekočine:

$$F_v = \rho_t\,g\,V_i$$

Tu je $\rho_t$ gostota **tekočine** in $V_i$ prostornina **potopljenega dela** telesa (to je prostornina izpodrinjene tekočine).

*Hitri preizkus:* kolikšen vzgon deluje na potopljeno plastenko s prostornino $0{,}5\,\mathrm{L}$? ($1000 \cdot 9{,}8 \cdot 0{,}0005 = 4{,}9\,\mathrm{N}$.)

:::premisli
Kepa plastelina v vodi potone. Iz iste kepe oblikuješ čolniček in ta plava. Masa se ni spremenila. Zakaj zdaj plava?
---
Kepa izpodrine le toliko vode, kolikor je sama velika. Potopljeni del čolnička, skupaj z zrakom v njem, je mnogo večji, zato izpodrine več vode. Večja izpodrinjena prostornina $V_i$ pomeni večji vzgon, ki zdaj lahko uravnovesi težo. Tako plavajo tudi jeklene ladje.
:::

**8. Plavanje, lebdenje, potop.** Primerjamo gostoto telesa $\rho$ in gostoto tekočine $\rho_t$ (za telo, ki je v celoti potopljeno):

- $\rho < \rho_t$: vzgon je večji od teže, telo priplava na površje in plava,
- $\rho = \rho_t$: vzgon je enak teži, telo lebdi,
- $\rho > \rho_t$: vzgon je manjši od teže, telo potone.

Pri plavajočem telesu je vzgon enak teži telesa: $F_v = F_g$, torej $\rho_t\,g\,V_i = \rho\,g\,V$. Ko krajšamo $g$, dobimo delež potopljenega dela:

$$\frac{V_i}{V} = \frac{\rho}{\rho_t}$$

:::risba graf
opis: Kvader plava v morski vodi z gostoto 1025 kg/m³. Gostota kvadra je {r} kg/m³, zato je pod gladino {100*r/1025:.0} % njegove prostornine, nad gladino pa {100 - 100*r/1025:.0} %. Teža prijemlje v središču kvadra in kaže navzdol, vzgon prijemlje v središču potopljenega dela in kaže navzgor; sili sta enaki.
x: 0 .. 10 | 1 | 
y: 0 .. 9 | 1 | 
enako: da
oznake: ne
mreža: ne
drsnik: r | 550 .. 1000 | 10 | 920 | gostota telesa v kg/m³
pravokotnik: 0; 0 .. 10; 5 | modra
črta: 0; 5 -> 10; 5 | modra
pravokotnik: 2,5; 5 - 4*r/1025 .. 5,5; 9 - 4*r/1025 | debelo
napis: 6,5; 5 | gladina | nad desno
puščica: 3,3; 7 - 4*r/1025 -> 3,3; 6 - 4*r/1025 | F_g | desno
puščica: 4,7; 5 - 2*r/1025 -> 4,7; 6 - 2*r/1025 | F_v | desno
napis: 5,8; 2 | {100*r/1025:.0} % pod vodo | desno
podnapis: Gostota telesa {r} kg/m³ v morju: pod gladino {100*r/1025:.0} %, nad gladino {100 - 100*r/1025:.0} %.
:::

Slika kaže led z gostoto $920\,\mathrm{kg/m^3}$: pod gladino je $90\,\%$ kvadra. V aplikaciji zmanjšaj gostoto telesa na $600\,\mathrm{kg/m^3}$ (les). Opazi, da se kvader dvigne in je pod gladino le še $59\,\%$. Pri $1000\,\mathrm{kg/m^3}$ je pod gladino že $98\,\%$ kvadra.

*Hitri preizkus:* kapljica olja z gostoto $920\,\mathrm{kg/m^3}$ je pod vodo. Kaj naredi? (Priplava na površje, ker ima manjšo gostoto kot voda.)

## Rešeni primeri

### Primer 1: na dnu morja (lažji)

Kolikšen je hidrostatični tlak na morskem dnu na globini $4{,}0\,\text{m}$ iz uvodnega vprašanja? Gostota morske vode je $1025\,\text{kg/m}^3$.

**Podatki:** $h = 4{,}0\,\text{m}$, $\rho = 1025\,\text{kg/m}^3$ (morska voda), $g = 9{,}8\,\text{m/s}^2$, zračni tlak $p_0 \approx 100\,000\,\text{Pa}$ (za skupni tlak)
**Iščemo:** hidrostatični tlak $p_h$ (in še skupni tlak $p$)

:::formula
$p_h = \rho\,g\,h$, skupni tlak $p = p_0 + p_h$
:::

**Rešitev:**

1. Iščemo tlak zaradi vode, zato uporabimo $p_h = \rho\,g\,h$.
2. Vstavimo: $p_h = 1025 \cdot 9{,}8 \cdot 4{,}0 = 40\,180\,\text{Pa} \approx 4{,}0 \cdot 10^4\,\text{Pa}$. Zaokrožimo na 2 mestni števki, ker ima globina $4{,}0\,\text{m}$ le dve.
3. To je približno $40\,\text{kPa}$ ali $0{,}4\,\text{bar}$.
4. Skupni tlak dobimo, ko prištejemo še zračni tlak, ki pritiska na gladino: $p \approx 100\,000 + 40\,000 = 140\,000\,\text{Pa}$.

Odgovor: na dnu je tlak za približno $40\,\text{kPa}$ večji kot na gladini, skupaj okoli $1{,}4\,\text{bar}$. Na bobnič od zunaj pritiska ta večji tlak, od znotraj pa zrak s tlakom, kot je na gladini, zato ušesa zabolijo. Za vsakih približno $10\,\text{m}$ globine v vodi tlak naraste za okoli $1\,\text{bar}$.

### Primer 2: kocka v olju (srednji)

Aluminijasto kocko z robom $5{,}0\,\text{cm}$ obesimo na silomer in jo v celoti potopimo v olje. Kolikšen je vzgon in kaj pokaže silomer?

**Podatki:** $a = 5{,}0\,\text{cm}$, kocka je v celoti potopljena, $\rho_t = 920\,\text{kg/m}^3$ (olje), $\rho = 2700\,\text{kg/m}^3$ (aluminij), $g = 9{,}8\,\text{m/s}^2$
**Iščemo:** vzgon $F_v$ in odčitek silomera $F_s$

:::formula
$F_v = \rho_t\,g\,V_i$, $F_g = \rho\,g\,V$, odčitek $F_s = F_g - F_v$
:::

**Rešitev:**

1. Rob v metrih: $a = 0{,}050\,\text{m}$, prostornina $V = a^3 = 1{,}25 \cdot 10^{-4}\,\text{m}^3$ (to je $125\,\text{cm}^3$).
2. Kocka je povsem pod gladino, zato je $V_i = V$.
3. Vzgon dobimo z gostoto **olja**, ker ga povzroča tekočina: $F_v = 920 \cdot 9{,}8 \cdot 1{,}25 \cdot 10^{-4} \approx 1{,}13\,\text{N}$.
4. Za težo potrebujemo gostoto **aluminija**: $F_g = 2700 \cdot 9{,}8 \cdot 1{,}25 \cdot 10^{-4} \approx 3{,}31\,\text{N}$.
5. Silomer drži kocko skupaj z vzgonom, zato kaže razliko: $F_s = 3{,}31 - 1{,}13 = 2{,}18\,\text{N}$.

Odgovor: vzgon je približno $1{,}1\,\text{N}$, silomer kaže okoli $2{,}2\,\text{N}$. V vodi bi bil vzgon nekoliko večji, ker ima voda večjo gostoto kot olje.

### Primer 3: ledena gora (težji)

Ledena gora plava v morju. Nad gladino je $2000\,\text{m}^3$ ledu. Gostota ledu je približno $920\,\text{kg/m}^3$, gostota morske vode približno $1025\,\text{kg/m}^3$. Kolikšna sta prostornina in masa cele ledene gore?

**Podatki:** prostornina nad gladino $2000\,\text{m}^3$, $\rho = 920\,\text{kg/m}^3$ (led), $\rho_t = 1025\,\text{kg/m}^3$ (morska voda), ledena gora plava
**Iščemo:** celotno prostornino $V$ in maso $m$

:::formula
Telo plava: $F_v = F_g$, torej $\rho_t\,g\,V_i = \rho\,g\,V$ in $\dfrac{V_i}{V} = \dfrac{\rho}{\rho_t}$; masa $m = \rho\,V$
:::

**Rešitev:**

1. **Pogoj plavanja.** Ledena gora miruje, zato je vzgon enak teži: $\rho_t\,g\,V_i = \rho\,g\,V$. Ko krajšamo $g$, dobimo $\dfrac{V_i}{V} = \dfrac{\rho}{\rho_t}$.
2. **Delež pod gladino:** $\dfrac{920}{1025} \approx 0{,}898$, torej približno $90\,\%$.
3. **Delež nad gladino:** $1 - 0{,}898 = 0{,}102$. To je tista desetina z začetka: odloča samo razmerje gostot, ne velikost gore.
4. **Celotna prostornina.** Natančneje je nad gladino $\dfrac{1025 - 920}{1025} = \dfrac{105}{1025}$ prostornine, zato je $V = 2000 \cdot \dfrac{1025}{105} \approx 19\,524\,\text{m}^3 \approx 2{,}0 \cdot 10^4\,\text{m}^3$. Na 2 mestni števki zaokrožimo, ker sta gostoti dani le približno.
5. **Masa:** $m = \rho\,V = 920 \cdot 19\,524 \approx 1{,}8 \cdot 10^7\,\text{kg}$.

Odgovor: ledena gora ima prostornino približno $20\,000\,\text{m}^3$ in maso okoli $18\,000$ ton, čeprav nad vodo vidimo le $2000\,\text{m}^3$.

### Primer 4 – zdaj ti: lubenica s tržnice

Na tržnici kupiš lubenico z maso $6{,}0\,\text{kg}$. Doma jo ohladiš v koritu z vodo, kjer plava. Kolikšna prostornina lubenice je pod gladino?

**Podatki:** $m = 6{,}0\,\text{kg}$, lubenica plava, $\rho_t = 1000\,\text{kg/m}^3$ (voda), $g = 9{,}8\,\text{m/s}^2$
**Iščemo:** prostornino potopljenega dela $V_i$

:::formula
Plavanje: $F_v = F_g$, torej $\rho_t\,g\,V_i = m\,g$
:::

**Rešitev:**

1. **Pogoj plavanja.** Lubenica miruje, zato je vzgon enak njeni teži: $\rho_t\,g\,V_i = m\,g$.
2. **Krajšamo $g$,** ker nastopa na obeh straneh: $\rho_t\,V_i = m$, torej $V_i = \dfrac{m}{\rho_t}$.
3. Vstavi podatke in rezultat pretvori še v litre.

:::premisli
Koliko je $V_i$?
---
$V_i = \dfrac{6{,}0\,\text{kg}}{1000\,\text{kg/m}^3} = 0{,}0060\,\text{m}^3 = 6{,}0\,\text{L}$. Lubenica izpodrine toliko vode, kolikor sama tehta: $6\,\text{L}$ vode ima maso $6\,\text{kg}$.
:::

## Pogoste napake

- **Mešanje gostot.** Kdor pri ledeni gori vstavi v $F_v = \rho_t\,g\,V_i$ gostoto ledu $920\,\text{kg/m}^3$, dobi premajhen vzgon. Vzgon povzroča tekočina, zato vanj spada gostota *tekočine*. Gostoto telesa potrebuješ za njegovo težo. Zato je delež pod gladino odvisen od obeh gostot: v sladki vodi bi bil drugačen kot v morju.
- **»Dvakrat globlje, dvakrat večji tlak.«** To velja samo za hidrostatični tlak $\rho g h$. Skupni tlak ima še stalni del $p_0$: na $10\,\text{m}$ je $198\,\text{kPa}$, na $20\,\text{m}$ pa $296\,\text{kPa}$, ne $396\,\text{kPa}$. Najprej se vprašaj, ali naloga sprašuje po skupnem tlaku ali samo po tlaku vode.
- **»Več vode, večji tlak.«** Tako sklepamo pri bidonu: ima več vode, zato bi moral bolj pritiskati na dno. A večja teža se razporedi na večje dno. Hidrostatični tlak je odvisen le od globine in gostote, ne od količine vode ali oblike posode.
- **»Težka stvar vedno potone.«** Ladja tehta tisoče ton, pa plava. Odloča gostota, ne teža: povprečna gostota ladje skupaj z zrakom v trupu je manjša od gostote vode.
- **»Globlje je vzgon večji.«** Ker tlak z globino raste, se zdi, da mora rasti tudi vzgon. Vendar z globino enako narasteta tlak na spodnjo in na zgornjo ploskev, njuna razlika pa ostane enaka. Dokler je telo v celoti potopljeno, je vzgon na vsaki globini enak.

## Povzetek

- Tlak: $p = F/S$, enota $1\,\text{Pa} = 1\,\text{N/m}^2$.
- Hidrostatični tlak: $p_h = \rho\,g\,h$. Narašča z globino, ni odvisen od oblike posode.
- Skupni tlak v tekočini z odprto gladino: $p = p_0 + \rho\,g\,h$.
- Arhimedov zakon: vzgon je enak teži izpodrinjene tekočine, $F_v = \rho_t\,g\,V_i$.
- Telo plava, če je $\rho < \rho_t$, lebdi pri $\rho = \rho_t$ in potone pri $\rho > \rho_t$.
- Pri plavajočem telesu velja $F_v = F_g$; potopljeni delež je $V_i/V = \rho/\rho_t$ (led v morju: okoli $90\,\%$).

## Drugače: Na sliki

Predstavljaj si navpičen stolp iz škatel, naloženih ena na drugo. Spodnja škatla nosi vse nad seboj, zgornja skoraj nič. Voda deluje podobno: plast na dnu »nosi« vso vodo nad seboj, zato je tlak tam največji. Graf tlaka v odvisnosti od globine je zato **premica**, ki se začne pri $p_0$ na gladini in raste za $\rho g$ na vsak meter.

Vzgon si predstavljaj kot puščice. Na spodnjo ploskev potopljene kocke kažejo puščice tlaka navzgor in so daljše, na zgornjo ploskev kažejo navzdol in so krajše. Stranske puščice se izničijo. Ostane razlika, ki kaže navzgor, in to je vzgon.

Prav te puščice so narisane na sliki kocke v razlagi, s številkami za sile hidrostatičnega tlaka: $19{,}6\,\mathrm{N}$ navzdol, $29{,}4\,\mathrm{N}$ navzgor. V simulaciji »Vzgon in Arhimedov zakon« spodaj pa poskusi, katera telesa plavajo in katera potonejo.

## Drugače: Iz vsakdanjega življenja

**Potapljanje.** Potapljač na globini $10\,\text{m}$ čuti približno dvojni tlak v primerjavi s površjem: $1\,\text{bar}$ zraka in dodatni približno $1\,\text{bar}$ vode. Zato ga ušesa bolijo, če ne izenači tlaka.

**Jez.** Zid jezu je pri dnu debelejši, ker je tam tlak največji. Tlak ne ve, kako velik je zbiralnik: pri enaki globini je enak v majhnem ribniku in v velikem jezeru.

**Najgloblje morje.** Challengerjeva globel v Marianskem jarku je globoka okoli $10\,900\,\text{m}$. Hidrostatični tlak tam je približno $1025 \cdot 9{,}8 \cdot 10\,900 \approx 1{,}1 \cdot 10^8\,\text{Pa}$, kar je okoli $1100\,\text{bar}$: več kot tisočkrat več od zračnega tlaka ob morju.

## Drugače: Korak za korakom s številkami

Recept za naloge z vzgonom:

1. Nariši telo in tekočino. Vriši silo teže navzdol in vzgon navzgor.
2. Vprašaj se: je telo v celoti potopljeno ali plava?
3. Pretvori vse enote v $\text{kg}$, $\text{m}$, $\text{m}^3$.
4. Izračunaj izpodrinjeno prostornino $V_i$ (cela prostornina ali samo potopljeni del).
5. Vstavi v $F_v = \rho_t\,g\,V_i$.
6. Če telo plava ali lebdi, postavi $F_v = F_g$.

**Številčni primer.** Železna utež ima prostornino $0{,}0005\,\text{m}^3$ in maso $3{,}9\,\text{kg}$. Potopimo jo v vodo.

- Gostota uteži: $\rho = 3{,}9 / 0{,}0005 = 7800\,\text{kg/m}^3$.
- Primerjava: $7800 > 1000$, zato potone.
- Vzgon: $F_v = 1000 \cdot 9{,}8 \cdot 0{,}0005 = 4{,}9\,\text{N}$.
- Teža: $F_g = 3{,}9 \cdot 9{,}8 \approx 38\,\text{N}$.
- Silomer, na katerega obesimo utež v vodi, pokaže razliko: $38 - 4{,}9 \approx 33\,\text{N}$, kar ustreza teži telesa z maso približno $3{,}4\,\text{kg}$. Utež se zdi lažja.

## Drugače: Bolj natančno

**Izpeljava vzgona na kvader.** Vzemimo kvader s ploščino osnovne ploskve $S$ in višino $H$, potopljen navpično v tekočino tako, da je zgornja ploskev na globini $h_1$, spodnja pa na globini $h_2 = h_1 + H$.

- Tlak na zgornji ploskvi: $p_1 = p_0 + \rho_t g h_1$, sila navzdol: $F_1 = p_1 S$.
- Tlak na spodnji ploskvi: $p_2 = p_0 + \rho_t g h_2$, sila navzgor: $F_2 = p_2 S$.
- Stranske sile se na isti globini izničijo.

Rezultanta sil tlaka je

$$F_v = F_2 - F_1 = \rho_t\,g\,(h_2 - h_1)\,S = \rho_t\,g\,H\,S = \rho_t\,g\,V$$

Zunanji tlak $p_0$ se pri odštevanju izniči. Ker je $H S = V$ prostornina kvadra, dobimo Arhimedov zakon. Za telesa poljubne oblike izrek velja splošno, saj ga lahko razumemo kot vsoto veliko majhnih kvadrov.

**Zakaj tlak ni odvisen od posode?** V izpeljavi $p_h = \rho g h$ se ploščina $S$ pokrajša, zato rezultat ni odvisen od preseka stolpca.

## Preveri se

? Kamen, v celoti potopljen v jezero, spuščamo z globine $2\,\text{m}$ na globino $8\,\text{m}$. Kaj se zgodi z vzgonom?
+ Ostane enak.
- Poveča se, ker je globlje tlak večji.
~ Tlak naraste na spodnji in na zgornji ploskvi enako; razlika med njima, torej vzgon, ostane enaka.
- Zmanjša se, ker voda nad kamnom pritiska navzdol.
~ Večji pritisk od zgoraj spremlja enako večji pritisk od spodaj. Vzgon se ne zmanjša.
> Vzgon je $F_v = \rho_t\,g\,V_i$. Gostota vode in prostornina kamna se ne spremenita, zato je vzgon na obeh globinah enak (kot na sliki kocke v razlagi).

? Razvrsti posode po tlaku tekočine na dnu, od največjega do najmanjšega.
1. visoka vaza z morsko vodo ($1025\,\text{kg/m}^3$), višina $0{,}30\,\text{m}$
2. ozka plastenka vode, višina $0{,}30\,\text{m}$
3. steklenica olja ($920\,\text{kg/m}^3$), višina $0{,}30\,\text{m}$
4. širok bidon vode, višina $0{,}25\,\text{m}$
> Tlak je $\rho g h$: šteje gostota in višina, ne količina. Morska voda: $3014\,\text{Pa}$, plastenka: $2940\,\text{Pa}$, olje: $2705\,\text{Pa}$, bidon: $2450\,\text{Pa}$. Bidon ima največ vode, pa najmanjši tlak.

? Graf kaže skupni tlak v neznani tekočini v odvisnosti od globine. Z grafa odčitaj potrebne podatke in izračunaj gostoto tekočine v $\text{kg/m}^3$. Vzemi $g = 9{,}8\,\text{m/s}^2$.
:::risba graf
opis: Graf skupnega tlaka p v neznani tekočini v odvisnosti od globine h od 0 do 10 m. Premica se na gladini začne pri 100 kPa in na globini 10 m doseže označeno točko pri 178,4 kPa.
x: 0 .. 10 | 2 | h (m)
y: 0 .. 200 | 50 | p (kPa)
f: 100 + 7.84*x | modra
točka: 10; 178,4 | 178,4 kPa | nad levo
:::
= 800 kg/m³ | 15
~ 1820 | Vstavil si skupni tlak $178{,}4\,\text{kPa}$. Gostoto določa samo hidrostatični del: odštej tlak na gladini.
~ 0,8 | Tlak si pustil v kPa. Pretvori ga v paskale: $78{,}4\,\text{kPa} = 78\,400\,\text{Pa}$.
~ 1,82 | Vstavil si skupni tlak in ga pustil v kPa. Odštej $100\,\text{kPa}$ in pretvori v paskale.
> Na gladini je $100\,\text{kPa}$, zato je hidrostatični tlak na $10\,\text{m}$ enak $78{,}4\,\text{kPa}$. $\rho = \dfrac{78\,400}{9{,}8 \cdot 10} = 800\,\text{kg/m}^3$.

? Potapljač v jezeru ($\rho = 1000\,\text{kg/m}^3$) izmeri skupni tlak $250\,\text{kPa}$. Zračni tlak na gladini je $100\,\text{kPa}$. Na kateri globini je? Vzemi $g = 9{,}8\,\text{m/s}^2$.
= 15,3 m | 0,4
~ 25,5 | Tako dobiš, če ves tlak pripišeš vodi. Na gladino pritiska še zrak s $100\,\text{kPa}$: odštej ga.
> Hidrostatični tlak je $250 - 100 = 150\,\text{kPa}$. $h = \dfrac{150\,000}{1000 \cdot 9{,}8} \approx 15{,}3\,\text{m}$.

? Kamen visi na silomeru. V zraku silomer kaže $12{,}0\,\text{N}$, ko je kamen v celoti v vodi, pa $7{,}2\,\text{N}$. Kolikšna je gostota kamna v $\text{kg/m}^3$?
= 2500 kg/m³ | 30
~ 1500 | V števec si vstavil odčitek v vodi $7{,}2\,\text{N}$. Teža kamna je odčitek v zraku, $12{,}0\,\text{N}$.
~ 1667 | Delil si s silo v vodi. Vzgon je razlika odčitkov, $12{,}0 - 7{,}2 = 4{,}8\,\text{N}$.
> Vzgon je $12{,}0 - 7{,}2 = 4{,}8\,\text{N}$, kar je teža vode s prostornino kamna. Kamen tehta $\dfrac{12{,}0}{4{,}8} = 2{,}5$-krat toliko kot enaka prostornina vode, zato je $\rho = 2{,}5 \cdot 1000 = 2500\,\text{kg/m}^3$.

? Ledena gora ($920\,\text{kg/m}^3$) odplava iz morja ($1025\,\text{kg/m}^3$) v fjord, kjer je voda skoraj sladka ($1000\,\text{kg/m}^3$). Kaj se zgodi z delom pod gladino?
- Pod gladino je manjši del, ker je sladka voda lažja.
~ Voda z manjšo gostoto da na vsak kubični meter manj vzgona. Da uravnovesi enako težo, mora led izpodriniti več vode, ne manj.
- Ostane enak, ker je odvisen samo od gostote ledu.
~ Mešanje gostot: vzgon povzroča tekočina, zato je delež $\rho/\rho_t$ odvisen tudi od gostote tekočine.
+ Pod gladino je večji del, približno $92\,\%$.
- Ledena gora potone, ker je zelo težka.
~ Odloča gostota, ne teža: led z $920\,\text{kg/m}^3$ ima še vedno manjšo gostoto kot sladka voda, zato plava.
> $\dfrac{V_i}{V} = \dfrac{920}{1000} = 0{,}92$, v morju pa $0{,}898$. Ledena gora se v sladki vodi pogrezne nekoliko globlje.

:::simboli
p | tlak | p = p_0 + \rho\,g\,h | Pa | v tekočini skupni tlak; splošno p = F/S
F | sila, pravokotna na ploskev | | N
S | ploščina ploskve | | m^2
p_h | hidrostatični tlak | p_h = \rho\,g\,h | Pa
p_0 | zunanji (zračni) tlak | | Pa | približno 100 000 Pa
\rho | gostota | | kg/m^3 | pri tlaku gostota tekočine, pri plavanju gostota telesa
g | težni pospešek | | m/s^2 | približno 9,8 m/s²
h | globina pod gladino | | m
F_g | teža | F_g = m\,g | N
F_s | odčitek silomera | F_s = F_g - F_v | N | v primeru 2
m | masa telesa | m = \rho\,V | kg | v izpeljavi $\rho g h$ masa stolpca tekočine
F_v | vzgon | F_v = \rho_t\,g\,V_i | N | Arhimedov zakon
\rho_t | gostota tekočine | | kg/m^3
V_i | prostornina potopljenega dela telesa | | m^3 | enaka prostornini izpodrinjene tekočine
V | prostornina telesa | | m^3
a | rob kocke | | m
F_1 | sila tlaka na zgornjo ploskev | | N | na sliki kocke brez zračnega tlaka, v izpeljavi (Bolj natančno) z njim
F_2 | sila tlaka na spodnjo ploskev | | N | na sliki kocke brez zračnega tlaka, v izpeljavi (Bolj natančno) z njim
p_1 | tlak na zgornji ploskvi | p_1 = p_0 + \rho_t\,g\,h_1 | Pa
p_2 | tlak na spodnji ploskvi | p_2 = p_0 + \rho_t\,g\,h_2 | Pa
h_1 | globina zgornje ploskve | | m
h_2 | globina spodnje ploskve | | m | h₂ = h₁ + H
H | višina kvadra | | m
:::

<<RACUN
vrednost: 600/0.040 | 15000
vrednost: 1000*9.8*0.30 | 2940
vrednost: 1000*9.8*0.25 | 2450
vrednost: 100+1000*9.8*20/1000 | 296
vrednost: 1025*9.8*4.0 | 40180
vrednost: 920*9.8*0.050^3 | 1.127
vrednost: 2700*9.8*0.050^3 | 3.3075
vrednost: 2700*9.8*0.050^3-920*9.8*0.050^3 | 2.18
vrednost: 98*0.30-98*0.20 | 9.8
vrednost: 920/1025 | 0.898
vrednost: 2000*1025/105 | 19523.8
vrednost: 920*2000*1025/105 | 1.8*10^7
vrednost: 6.0/1000 | 0.0060
vrednost: 1025*9.8*0.30 | 3013.5
vrednost: 920*9.8*0.30 | 2704.8
vrednost: (178.4-100)*1000/(9.8*10) | 800
vrednost: (250-100)*1000/(1000*9.8) | 15.3
vrednost: 12.0/(12.0-7.2)*1000 | 2500
vrednost: 1025*9.8*10900 | 1.1*10^8
vrednost: 3.9*9.8-4.9 | 33.3
>>
