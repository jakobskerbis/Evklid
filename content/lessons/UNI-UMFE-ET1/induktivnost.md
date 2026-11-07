---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V fizikalnem praktikumu elektromagnet drži jekleno kroglico, dokler računalnik ne sproži meritve prostega pada. Tok skozi tuljavo elektromagneta vklaplja in izklaplja tranzistor. Po nekaj dneh se tranzistor uniči, čeprav teče le $60\,\mathrm{mA}$ in je tranzistor narejen za $40\,\mathrm{V}$. Merilnik ob izklopu pokaže na tuljavi konico več sto ali celo tisoč voltov. Od kod tolikšna napetost, ko vir daje le $12\,\mathrm{V}$? In zakaj ena sama dioda vzporedno s tuljavo težavo odpravi?

Odgovor je v lastnosti, ki jo ima vsaka tuljava: **induktivnosti**. Tuljava se upira vsaki spremembi toka in v svojem magnetnem polju hrani energijo, ki ob izklopu nekam mora.

## Razlaga

### En primer: toroid v praktikumu

Na obroč iz elektropločevine je navitih $N = 500$ ovojev. Srednja dolžina silnice je $l = 10\,\mathrm{cm}$, presek $A = 1{,}0\,\mathrm{cm^2}$, relativna permeabilnost $\mu_r = 1000$. Iz lekcije o magnetnih krogih znamo izračunati pretok:

1. magnetni upor $R_m = l/(\mu_0\mu_r A) \approx 7{,}96 \cdot 10^5\,\mathrm{A/Wb}$;
2. pri toku $I$ je magnetna napetost $NI$ in pretok $\Phi = NI/R_m$.

Vsak od $500$ ovojev objame ta pretok. Če tok spremenimo, se inducira napetost v vsakem ovoju. Skupaj je to $N\,\mathrm{d}\Phi/\mathrm{d}t = (N^2/R_m)\,\mathrm{d}I/\mathrm{d}t$. Napetost je torej sorazmerna s hitrostjo spreminjanja toka, sorazmernostni faktor $N^2/R_m \approx 0{,}314\,\mathrm{H}$ pa je odvisen le od navitja in jedra. Ta faktor je induktivnost.

### Lastna induktivnost

**Definicija.** **Spreženi magnetni pretok** tuljave je vsota pretokov skozi vse ovoje, $\Psi = N\Phi$, če vsi ovoji objemajo enak pretok. **Lastna induktivnost** je razmerje

$$L = \frac{\Psi}{I}.$$

Enota je henry: $1\,\mathrm{H} = 1\,\mathrm{Wb/A} = 1\,\mathrm{V\,s/A}$. V linearnem okolju (brez nasičenja železa) $L$ ni odvisna od toka.

Iz indukcijskega zakona sledi napetost na tuljavi. Pri porabniški smeri (tok teče v sponko z višjim potencialom) velja

$$u = L\,\frac{\mathrm{d}i}{\mathrm{d}t}.$$

Napetost torej ni sorazmerna s tokom, ampak z njegovo hitrostjo spreminjanja. Pri stalnem toku idealna tuljava nima napetosti; ob hitrem izklopu pa je $\mathrm{d}i/\mathrm{d}t$ ogromen.

**Induktivnost iz magnetnega kroga.** Za tuljavo z $N$ ovoji na krogu z magnetnim uporom $R_m$ je $\Psi = N \cdot NI/R_m$, torej

$$L = \frac{N^2}{R_m}.$$

Induktivnost raste s kvadratom števila ovojev: dvakrat več ovojev pomeni dvakrat večjo magnetno napetost in dvakrat več ovojev, ki pretok objamejo. Za toroid ali dolgo tuljavo s presekom $A$ in dolžino $l$ je $L = \mu_0\mu_r N^2 A/l$.

:::premisli
V jedro toroida zarežemo zračno režo, dolgo le $1\,\mathrm{mm}$. Ali se induktivnost zmanjša za $1\,\%$ (ker je reža $1\,\%$ dolžine) ali bolj? Zakaj?
---
Precej bolj. Reža ima permeabilnost zraka, zato je njen magnetni upor tak kot upor $1000\,\mathrm{mm}$ železa. Skupni upor naraste z $7{,}96 \cdot 10^5$ na okoli $8{,}75 \cdot 10^6\,\mathrm{A/Wb}$, induktivnost pa pade skoraj enajstkrat.
:::

### Medsebojna induktivnost

Postavimo na isto jedro še drugo navitje z $N_2$ ovoji. Tok $i_1$ v prvem navitju ustvari pretok, ki ga deloma objame tudi drugo.

```
  +========================+
  |  )))            (((    |
 i1  ))) N1      N2 (((   u2
  |  )))            (((    |
  +========================+
     pretok kroži po jedru
```

**Definicija.** **Medsebojna induktivnost** je razmerje med pretokom, ki ga tok ene tuljave sprega z drugo, in tem tokom:

$$M_{21} = \frac{\Psi_{21}}{I_1}.$$

Ko se $i_1$ spreminja, se v drugi tuljavi inducira napetost $u_2 = M\,\mathrm{d}i_1/\mathrm{d}t$. Predznak je odvisen od smeri navijanja; v shemah ga označujeta **piki**: tok, ki teče v pikasto sponko ene tuljave, inducira v drugi tuljavi napetost s pozitivnim polom na pikasti sponki.

**Izrek (vzajemnost).** V linearnem okolju je $M_{21} = M_{12} = M$.

*Dokaz z energijo.* Tuljavi napajamo na dva načina in v obeh dosežemo toka $I_1$ in $I_2$. Najprej povečamo $i_1$ od $0$ do $I_1$ (vir 1 opravi delo $\tfrac{1}{2}L_1I_1^2$), nato $i_2$ do $I_2$. Med drugim korakom vir 2 opravi $\tfrac{1}{2}L_2I_2^2$, vir 1 pa mora držati $I_1$ proti inducirani napetosti $M_{12}\,\mathrm{d}i_2/\mathrm{d}t$, kar zahteva še $M_{12}I_1I_2$. V obratnem vrstnem redu je dodatno delo $M_{21}I_1I_2$. Končno stanje je enako, zato mora biti tudi shranjena energija enaka: $M_{12} = M_{21}$.

Za tuljavi na skupnem jedru brez stresanja je $M = N_1N_2/R_m$. V splošnem pa del pretoka prve tuljave uide mimo druge (**stresani pretok**). Stopnjo sklopa meri **faktor sklopa**

$$k = \frac{M}{\sqrt{L_1 L_2}}, \qquad 0 \le k \le 1.$$

Pri $k = 1$ vsa silnica ene tuljave objame drugo (idealni transformator), pri $k = 0$ tuljavi ne vplivata druga na drugo.

**Zaporedna vezava sklopljenih tuljav.** Če toka v obeh tuljavah krepita skupni pretok (**sopojna** vezava), je $L_{s} = L_1 + L_2 + 2M$; če se pretoka odštevata (**protipojna**), je $L_{p} = L_1 + L_2 - 2M$. Razlika obeh meritev da $M = (L_s - L_p)/4$; tako $M$ izmerimo z navadnim merilnikom induktivnosti.

### Energija magnetnega polja

Ko tok v tuljavi narašča, vir opravlja delo proti inducirani napetosti. Moč je $p = ui = Li\,\mathrm{d}i/\mathrm{d}t$.

*Izpeljava.* Delo od $i = 0$ do $i = I$ je

$$W = \int_0^I L\,i\,\mathrm{d}i = \frac{1}{2}LI^2.$$

Ta energija ni v žici, ampak v **polju**. Za toroid vstavimo $L = \mu N^2A/l$ in $H = NI/l$: $W = \tfrac{1}{2}\mu H^2 \cdot Al$. Produkt $Al$ je prostornina jedra, zato je **gostota energije**

$$w = \frac{B^2}{2\mu} = \frac{1}{2}BH.$$

Pri dani gostoti $B$ je gostota energije v zraku $\mu_r$-krat večja kot v železu. Zato v jedru z režo skoraj vsa energija sedi v reži.

Za dve sklopljeni tuljavi z enako izpeljavo dobimo

$$W = \frac{1}{2}L_1I_1^2 + \frac{1}{2}L_2I_2^2 \pm MI_1I_2,$$

z znakom $+$, kadar se pretoka krepita.

:::premisli
Zakaj ob izklopu toka skozi tuljavo nastane iskra ali visoka napetost, ob izklopu toka skozi upornik pa ne?
---
Tuljava hrani energijo $\tfrac{1}{2}LI^2$ in se upira spremembi toka. Ob nenadni prekinitvi bi bil $\mathrm{d}i/\mathrm{d}t$ ogromen, zato je ogromna tudi $u = L\,\mathrm{d}i/\mathrm{d}t$; napetost naraste, dokler tok ne najde poti (iskra, preboj tranzistorja). Upornik energije ne hrani, njegov tok pade takoj.
:::

## Rešeni primeri

### Primer 1 (lažji)

Za toroid iz uvoda ($N = 500$, $l = 10\,\mathrm{cm}$, $A = 1{,}0\,\mathrm{cm^2}$, $\mu_r = 1000$) izračunaj induktivnost, gostoto polja pri $I = 0{,}10\,\mathrm{A}$ in shranjeno energijo.

**Podatki:** $N = 500$, $l = 0{,}10\,\mathrm{m}$, $A = 1{,}0 \cdot 10^{-4}\,\mathrm{m^2}$, $\mu_r = 1000$, $I = 0{,}10\,\mathrm{A}$, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** $L$, $B$, $W$

:::formula
$R_m = \dfrac{l}{\mu_0\mu_r A}$, $L = \dfrac{N^2}{R_m}$, $B = \dfrac{NI}{R_m A}$, $W = \dfrac{1}{2}LI^2$
:::

**Rešitev:**

1. Magnetni upor: $R_m = 0{,}10/(4\pi \cdot 10^{-7} \cdot 1000 \cdot 10^{-4})\,\mathrm{A/Wb} \approx 7{,}96 \cdot 10^5\,\mathrm{A/Wb}$.
2. Induktivnost: $L = 500^2/(7{,}96 \cdot 10^5)\,\mathrm{H} \approx 0{,}314\,\mathrm{H}$.
3. Pretok $\Phi = NI/R_m = 50/(7{,}96 \cdot 10^5)\,\mathrm{Wb} \approx 6{,}28 \cdot 10^{-5}\,\mathrm{Wb}$, gostota $B = \Phi/A \approx 0{,}628\,\mathrm{T}$. To je pod nasičenjem pločevine (okoli $1{,}5\,\mathrm{T}$), zato je linearni model upravičen.
4. Energija: $W = 0{,}5 \cdot 0{,}314 \cdot 0{,}10^2\,\mathrm{J} \approx 1{,}57\,\mathrm{mJ}$.
5. Odgovor: $L \approx 0{,}31\,\mathrm{H}$, $B \approx 0{,}63\,\mathrm{T}$, shranjena energija okoli $1{,}6\,\mathrm{mJ}$.

### Primer 2

Isti toroid dobi zračno režo dolžine $1{,}0\,\mathrm{mm}$ (dolžino železa obravnavaj kot nespremenjeno). Železo se ne sme nasičiti: gostota polja naj ne preseže $1{,}2\,\mathrm{T}$. Primerjaj induktivnost, največji dovoljeni tok in največjo energijo brez reže in z režo. Kje je energija shranjena?

**Podatki:** $l_r = 1{,}0 \cdot 10^{-3}\,\mathrm{m}$, $B_{max} = 1{,}2\,\mathrm{T}$, $R_m = 7{,}96 \cdot 10^5\,\mathrm{A/Wb}$ (železo), $N = 500$, $A = 1{,}0 \cdot 10^{-4}\,\mathrm{m^2}$, $\mu_r = 1000$
**Iščemo:** $L'$, $I_{max}$ in $W_{max}$ v obeh primerih, delež energije v reži

:::formula
$R_r = \dfrac{l_r}{\mu_0 A}$, $L = \dfrac{N^2}{R_m}$, $I_{max} = \dfrac{B_{max} A R_m}{N}$, $w = \dfrac{B^2}{2\mu}$
:::

**Rešitev:**

1. Upor reže: $R_r = 10^{-3}/(4\pi \cdot 10^{-7} \cdot 10^{-4})\,\mathrm{A/Wb} \approx 7{,}96 \cdot 10^6\,\mathrm{A/Wb}$, desetkrat več kot vse železo.
2. Skupni upor: $7{,}96 \cdot 10^5 + 7{,}96 \cdot 10^6 \approx 8{,}75 \cdot 10^6\,\mathrm{A/Wb}$; induktivnost $L' = 500^2/(8{,}75 \cdot 10^6)\,\mathrm{H} \approx 28{,}6\,\mathrm{mH}$.
3. Največji tok brez reže: $I_{max} = 1{,}2 \cdot 10^{-4} \cdot 7{,}96 \cdot 10^5/500\,\mathrm{A} \approx 0{,}191\,\mathrm{A}$; energija $0{,}5 \cdot 0{,}314 \cdot 0{,}191^2\,\mathrm{J} \approx 5{,}73\,\mathrm{mJ}$.
4. Z režo: $I'_{max} = 1{,}2 \cdot 10^{-4} \cdot 8{,}75 \cdot 10^6/500\,\mathrm{A} \approx 2{,}10\,\mathrm{A}$; energija $0{,}5 \cdot 0{,}0286 \cdot 2{,}10^2\,\mathrm{J} \approx 63\,\mathrm{mJ}$.
5. Kje je energija: v reži $w = 1{,}2^2/(2\mu_0) \approx 5{,}73 \cdot 10^5\,\mathrm{J/m^3}$, krat prostornina $10^{-7}\,\mathrm{m^3}$ da $57{,}3\,\mathrm{mJ}$; v železu je gostota $1000$-krat manjša, a prostornina $100$-krat večja: $5{,}73\,\mathrm{mJ}$.
6. Odgovor: reža zmanjša induktivnost enajstkrat (na $28{,}6\,\mathrm{mH}$), a dovoli enajstkrat večji tok in shrani enajstkrat več energije ($63\,\mathrm{mJ}$ namesto $5{,}7\,\mathrm{mJ}$); od tega je $91\,\%$ v reži.

### Primer 3 (težji)

V praktikumu z merilnikom induktivnosti izmerimo dve tuljavi na skupni plastični cevi. Prva sama ima $L_1 = 0{,}20\,\mathrm{H}$. Zaporedno vezani dasta $0{,}52\,\mathrm{H}$, po zamenjavi priključkov druge tuljave pa $0{,}12\,\mathrm{H}$. a) Določi $L_2$, $M$ in $k$. b) Tok v prvi tuljavi enakomerno naraste od $0$ do $2{,}0\,\mathrm{A}$ v $5{,}0\,\mathrm{ms}$. Kolikšna napetost se inducira na odprtih sponkah druge? c) Kolikšna je energija polja, ko teče v prvi $1{,}0\,\mathrm{A}$, v drugi $0{,}50\,\mathrm{A}$, in se pretoka krepita?

**Podatki:** $L_1 = 0{,}20\,\mathrm{H}$, $L_s = 0{,}52\,\mathrm{H}$, $L_p = 0{,}12\,\mathrm{H}$, $\Delta I_1 = 2{,}0\,\mathrm{A}$, $\Delta t = 5{,}0 \cdot 10^{-3}\,\mathrm{s}$, $I_1 = 1{,}0\,\mathrm{A}$, $I_2 = 0{,}50\,\mathrm{A}$
**Iščemo:** $L_2$, $M$, $k$, $u_2$, $W$

:::formula
$L_s = L_1 + L_2 + 2M$, $L_p = L_1 + L_2 - 2M$, $k = \dfrac{M}{\sqrt{L_1L_2}}$, $u_2 = M\dfrac{\mathrm{d}i_1}{\mathrm{d}t}$, $W = \dfrac{1}{2}L_1I_1^2 + \dfrac{1}{2}L_2I_2^2 + MI_1I_2$
:::

**Rešitev:**

1. Večja vrednost je sopojna vezava. Vsota obeh meritev odstrani $M$: $L_1 + L_2 = (0{,}52 + 0{,}12)/2\,\mathrm{H} = 0{,}32\,\mathrm{H}$, zato $L_2 = 0{,}12\,\mathrm{H}$.
2. Razlika odstrani lastni induktivnosti: $M = (0{,}52 - 0{,}12)/4\,\mathrm{H} = 0{,}10\,\mathrm{H}$.
3. Faktor sklopa: $k = 0{,}10/\sqrt{0{,}20 \cdot 0{,}12} \approx 0{,}645$. Plastična cev nima železa, zato del pretoka uide mimo druge tuljave.
4. b) Hitrost spreminjanja toka: $\mathrm{d}i_1/\mathrm{d}t = 2{,}0/0{,}005\,\mathrm{A/s} = 400\,\mathrm{A/s}$.
5. Inducirana napetost: $u_2 = 0{,}10 \cdot 400\,\mathrm{V} = 40\,\mathrm{V}$. Sponke so odprte, zato tok v drugi ne teče in ne vpliva nazaj na prvo.
6. c) Energija: $W = 0{,}5 \cdot 0{,}20 \cdot 1{,}0^2 + 0{,}5 \cdot 0{,}12 \cdot 0{,}50^2 + 0{,}10 \cdot 1{,}0 \cdot 0{,}50 = 0{,}165\,\mathrm{J}$.
7. Odgovor: $L_2 = 0{,}12\,\mathrm{H}$, $M = 0{,}10\,\mathrm{H}$, $k \approx 0{,}65$; inducirana napetost je $40\,\mathrm{V}$; energija polja $0{,}165\,\mathrm{J}$, od tega $0{,}05\,\mathrm{J}$ prispeva sklop.

### Primer 4 – zdaj ti

Vrnimo se k elektromagnetu iz uvoda: $L = 0{,}50\,\mathrm{H}$, tok $60\,\mathrm{mA}$. Tranzistor tok prekine v približno $10\,\mu\mathrm{s}$. Oceni napetost na tuljavi ob izklopu in energijo, ki se mora nekje porabiti. Zakaj dioda vzporedno s tuljavo (v zaporni smeri glede na vir) tranzistor zaščiti?

**Podatki:** $L = 0{,}50\,\mathrm{H}$, $I = 0{,}060\,\mathrm{A}$, $\Delta t \approx 10 \cdot 10^{-6}\,\mathrm{s}$
**Iščemo:** $u$ ob izklopu, energijo $W$, vlogo diode

:::formula
$u \approx L\dfrac{\Delta i}{\Delta t}$, $W = \dfrac{1}{2}LI^2$
:::

**Rešitev:**

1. Tok pade z $0{,}060\,\mathrm{A}$ na nič, torej $\Delta i = 0{,}060\,\mathrm{A}$.
2. Napetost: $u \approx 0{,}50 \cdot 0{,}060/(10 \cdot 10^{-6})\,\mathrm{V} = 3000\,\mathrm{V}$. Tranzistor za $40\,\mathrm{V}$ tega ne zdrži.
3. Energijo in vlogo diode določi sam.

:::premisli
Kolikšna je energija in kaj naredi dioda?
---
$W = 0{,}5 \cdot 0{,}50 \cdot 0{,}060^2\,\mathrm{J} = 0{,}90\,\mathrm{mJ}$. Ob izklopu tuljava ohrani smer toka, ta pa steče skozi diodo. Napetost na tuljavi je zato omejena na okoli $0{,}7\,\mathrm{V}$, tok počasi upade, energija pa se porabi v uporu navitja in diodi namesto v preboju tranzistorja.
:::

## Pogoste napake

- **Napetost sorazmerna s tokom.** »Pri $60\,\mathrm{mA}$ ne more nastati $3000\,\mathrm{V}$« meša tuljavo z upornikom. Na tuljavi je napetost sorazmerna z $\mathrm{d}i/\mathrm{d}t$; velik tok s stalno vrednostjo da nič, majhen tok, ki hitro pade, pa ogromno napetost.
- **$L$ linearno z $N$.** Podvojitev ovojev podvoji induktivnost? Ne: $L = N^2/R_m$, zato štirikrat. Ovoji dvakrat povečajo pretok in dvakrat več ovojev ga objame.
- **Reža je zanemarljiva.** »Reža je le $1\,\%$ dolžine« pozabi, da je upor zraka $\mu_r$-krat večji. Reža pogosto odloča o celotni induktivnosti.
- **Napačen predznak $M$.** Pri zaporedni vezavi sklopljenih tuljav $L_1 + L_2$ ni pravilno; odvisno od navijanja je $\pm 2M$. Smer določijo piki ali meritev obeh vezav.
- **Energija v železu.** Ker je železo »magnetno«, se zdi, da tam sedi energija. Pri enaki gostoti $B$ je gostota energije $B^2/(2\mu)$ v zraku $\mu_r$-krat večja; v jedru z režo je skoraj vsa energija v reži.

## Povzetek

- Spreženi pretok $\Psi = N\Phi$; lastna induktivnost $L = \Psi/I$, enota henry; napetost $u = L\,\mathrm{d}i/\mathrm{d}t$.
- Iz magnetnega kroga $L = N^2/R_m$; toroid ali dolga tuljava $L = \mu_0\mu_r N^2 A/l$; zračna reža močno zmanjša $L$.
- Medsebojna induktivnost $M = \Psi_{21}/I_1 = \Psi_{12}/I_2$ (vzajemnost), $u_2 = M\,\mathrm{d}i_1/\mathrm{d}t$, predznak določata piki.
- Faktor sklopa $k = M/\sqrt{L_1L_2}$, $0 \le k \le 1$; zaporedno $L = L_1 + L_2 \pm 2M$, $M = (L_s - L_p)/4$.
- Energija $W = \tfrac{1}{2}LI^2$, gostota $w = B^2/(2\mu)$; sklopljeni tuljavi $W = \tfrac{1}{2}L_1I_1^2 + \tfrac{1}{2}L_2I_2^2 \pm MI_1I_2$.
- Ob hitrem izklopu tuljava ustvari visoko napetost; zaščita je dioda, ki toku da pot.

## Za izpit

Znati moraš povedati:

- definiciji lastne in medsebojne induktivnosti, enoto in zvezo $u = L\,\mathrm{d}i/\mathrm{d}t$ s predznakom pri porabniški smeri;
- izpeljavo $L = N^2/R_m$ in vpliv zračne reže;
- izrek o vzajemnosti $M_{12} = M_{21}$ z energijskim dokazom;
- definicijo faktorja sklopa, pomen pik in induktivnost zaporedne vezave sklopljenih tuljav;
- izpeljavo $W = \tfrac{1}{2}LI^2$ in gostote energije $w = B^2/(2\mu)$.

### Naloga 1

Koaksialni kabel ima notranji vodnik s polmerom $a = 0{,}50\,\mathrm{mm}$ in tanek zunanji plašč s polmerom $b = 2{,}0\,\mathrm{mm}$; vmes je zrak ali neferomagnetni izolator. Tok $I$ teče po notranjem vodniku enakomerno po preseku in se vrača po plašču. a) Z energijo polja izpelji induktivnost na enoto dolžine, ločeno za polje med vodnikoma in za polje v notranjem vodniku. b) Izračunaj induktivnost $20\,\mathrm{m}$ kabla in energijo pri toku $10\,\mathrm{A}$.

**Rešitev:**

1. Po Amperovem zakonu je med vodnikoma ($a < r < b$) $B = \mu_0 I/(2\pi r)$, v notranjem vodniku ($r < a$) $B = \mu_0 I r/(2\pi a^2)$, zunaj plašča $B = 0$.
2. Energija na enoto dolžine v tanki lupini s polmerom $r$ je $w \cdot 2\pi r\,\mathrm{d}r$, $w = B^2/(2\mu_0)$.
3. Med vodnikoma: $W'_z = \int_a^b \frac{\mu_0 I^2}{8\pi^2 r^2}\,2\pi r\,\mathrm{d}r = \frac{\mu_0 I^2}{4\pi}\ln\frac{b}{a}$.
4. V notranjem vodniku: $W'_n = \int_0^a \frac{\mu_0 I^2 r^2}{8\pi^2 a^4}\,2\pi r\,\mathrm{d}r = \frac{\mu_0 I^2}{16\pi}$.
5. Iz $W' = \tfrac{1}{2}L'I^2$: $L'_z = \frac{\mu_0}{2\pi}\ln\frac{b}{a}$ in $L'_n = \frac{\mu_0}{8\pi}$ (neodvisno od $a$).
6. Številke: $L'_z = 2 \cdot 10^{-7} \cdot \ln 4\,\mathrm{H/m} \approx 0{,}277\,\mu\mathrm{H/m}$; $L'_n = 0{,}050\,\mu\mathrm{H/m}$; skupaj $0{,}327\,\mu\mathrm{H/m}$.
7. b) Za $20\,\mathrm{m}$: $L = 20 \cdot 0{,}327\,\mu\mathrm{H} \approx 6{,}55\,\mu\mathrm{H}$; energija $W = 0{,}5 \cdot 6{,}55 \cdot 10^{-6} \cdot 10^2\,\mathrm{J} \approx 0{,}33\,\mathrm{mJ}$.
8. Odgovor: $L' = \frac{\mu_0}{2\pi}\ln\frac{b}{a} + \frac{\mu_0}{8\pi} \approx 0{,}33\,\mu\mathrm{H/m}$; $20\,\mathrm{m}$ kabla ima okoli $6{,}5\,\mu\mathrm{H}$ in pri $10\,\mathrm{A}$ hrani okoli $0{,}33\,\mathrm{mJ}$. Notranji del je $15\,\%$ celote; pri visokih frekvencah ga kožni pojav še zmanjša.

### Naloga 2

Izpelji energijo dveh sklopljenih tuljav s tokovoma $I_1$ in $I_2$. Iz pogoja, da je energija magnetnega polja vedno nenegativna, dokaži, da je $M \le \sqrt{L_1L_2}$, torej $k \le 1$.

**Rešitev:**

1. Najprej povečamo $i_1$ od $0$ do $I_1$ pri $i_2 = 0$: vir 1 opravi $\tfrac{1}{2}L_1I_1^2$.
2. Nato povečamo $i_2$ do $I_2$. Vir 2 opravi $\tfrac{1}{2}L_2I_2^2$. Vir 1 drži $I_1$ proti napetosti $M\,\mathrm{d}i_2/\mathrm{d}t$ in opravi $\int I_1 M\,\mathrm{d}i_2 = MI_1I_2$.
3. Skupaj $W = \tfrac{1}{2}L_1I_1^2 + MI_1I_2 + \tfrac{1}{2}L_2I_2^2$ (z $M$ s predznakom: negativen, če se pretoka odštevata).
4. Energija polja je integral $B^2/(2\mu)$ po prostoru, zato je $W \ge 0$ za vse $I_1$, $I_2$.
5. Za $I_2 \ne 0$ označimo $x = I_1/I_2$: $W/I_2^2 = \tfrac{1}{2}L_1x^2 + Mx + \tfrac{1}{2}L_2 \ge 0$ za vse $x$.
6. Kvadratna funkcija s pozitivnim vodilnim koeficientom je povsod nenegativna natanko tedaj, ko diskriminanta ni pozitivna: $M^2 - L_1L_2 \le 0$.
7. Torej $|M| \le \sqrt{L_1L_2}$ in $k = |M|/\sqrt{L_1L_2} \le 1$. Enakost velja, ko obstaja razmerje tokov, pri katerem je polje povsod nič: pretoka se popolnoma izničita, kar pomeni popoln sklop brez stresanja.

## Drugače: Z analogijo

Induktivnost je električna **vztrajnost**. Primerjaj tuljavo s telesom z maso $m$:

- tok $i$ ustreza hitrosti $v$;
- napetost $u = L\,\mathrm{d}i/\mathrm{d}t$ ustreza sili $F = m\,\mathrm{d}v/\mathrm{d}t$;
- energija $\tfrac{1}{2}LI^2$ ustreza kinetični energiji $\tfrac{1}{2}mv^2$.

Težkega vozička ne moreš ustaviti v trenutku: ob trku nastane ogromna sila. Enako tuljava ob hitrem izklopu ustvari ogromno napetost. Dioda vzporedno s tuljavo je kot zavorna pot: tok se ustavi postopoma, energija se porabi brez sunka.

Medsebojna induktivnost ustreza dvema vozičkoma, povezanima z elastično vrvico: sunek prvega se prenese na drugega, a le deloma, če vrvica popušča (faktor sklopa manjši od $1$).

## Drugače: Bolj natančno

**Neumannova formula.** Za dve tanki zanki v vakuumu je

$$M = \frac{\mu_0}{4\pi}\oint\oint \frac{\mathrm{d}\vec{l}_1 \cdot \mathrm{d}\vec{l}_2}{r},$$

kjer je $r$ razdalja med kosoma. Formula je simetrična v indeksih $1$ in $2$, kar je drug dokaz vzajemnosti. Odvisna je le od geometrije.

**Nelinearna tuljava.** Ko se železo nasiti, $\Psi$ ni več sorazmeren s tokom. Tedaj ločimo statično induktivnost $\Psi/I$ in **diferencialno** $\mathrm{d}\Psi/\mathrm{d}i$, ki določa napetost $u = (\mathrm{d}\Psi/\mathrm{d}i)\,\mathrm{d}i/\mathrm{d}t$. Energija je $W = \int i\,\mathrm{d}\Psi$, ne $\tfrac{1}{2}LI^2$. Pri histerezi se del energije ob vsakem ciklu spremeni v toploto.

**Notranja induktivnost in frekvenca.** Rezultat $\mu_0/(8\pi)$ iz Naloge 1 velja za enakomerno porazdeljen tok. Pri visokih frekvencah tok teče le v tanki plasti ob površini (kožni pojav), polje v vodniku izgine in induktivnost kabla pade na zunanji del.

## Drugače: Uporaba v stroki

- **Dušilke v pretvornikih.** Stikalni napajalniki in razsmerniki sončnih elektrarn shranjujejo energijo v dušilkah z režo (Primer 2): reža zmanjša $L$, a omogoči velik tok brez nasičenja.
- **Transformatorji.** Dober transformator ima $k$ blizu $1$; stresana induktivnost (del, ki ni sklopljen) omejuje kratkostični tok in povzroča padec napetosti pod obremenitvijo.
- **Brezžično polnjenje.** Tuljavi v podlagi in telefonu sta sklopljeni s $k$ okoli $0{,}3$ do $0{,}7$; ob zamiku telefona $k$ pade in izkoristek se poslabša.
- **Zaščita stikal.** Pri relejih, ventilih in motorjih je vzporedna dioda ali varistor obvezen, sicer napetost ob izklopu uniči krmilni tranzistor (Primer 4).
- **Superprevodni magneti.** Magnet naprave MRI hrani nekaj megajoulov energije $\tfrac{1}{2}LI^2$; ob nenadnem prehodu iz superprevodnega stanja se ta energija sprosti kot toplota, zato imajo magneti zaščitne sisteme.

## Preveri se

? Katera od naslednjih sprememb **ne** poveča lastne induktivnosti toroida?
- več ovojev
~ $L = N^2/R_m$ narašča s kvadratom števila ovojev.
- jedro z večjo permeabilnostjo
~ Večja $\mu_r$ zmanjša magnetni upor in poveča $L$.
+ večji tok skozi navitje
- večji presek jedra
~ Večji presek zmanjša magnetni upor, zato $L$ naraste.
> V linearnem okolju je $L$ lastnost geometrije in snovi; tok spremeni pretok, ne razmerja $\Psi/I$. Pri nasičenju se $L$ z večjim tokom celo zmanjša.

? Tuljava ima $L = 20\,\mathrm{mH}$. Tok v njej enakomerno naraste od $1{,}0\,\mathrm{A}$ na $3{,}0\,\mathrm{A}$ v $4{,}0\,\mathrm{ms}$. Kolikšna je napetost na tuljavi?
- $15\,\mathrm{V}$
~ Vzel si končni tok $3\,\mathrm{A}$ namesto spremembe $2\,\mathrm{A}$.
+ $10\,\mathrm{V}$
- $0{,}06\,\mathrm{V}$
~ Pomnožil si $L$ s tokom; napetost je sorazmerna s hitrostjo spreminjanja toka, ne s tokom.
> $u = L\,\Delta i/\Delta t = 0{,}020 \cdot 2{,}0/0{,}004\,\mathrm{V} = 10\,\mathrm{V}$.

? Tuljavi na skupnem jedru preklopimo iz sopojne v protipojno zaporedno vezavo. Kaj se zgodi s skupno induktivnostjo?
+ Zmanjša se za $4M$.
- Zmanjša se za $2M$.
~ V sopojni vezavi je $+2M$, v protipojni $-2M$; razlika je $4M$.
- Ostane enaka, ker se tuljavi nista spremenili.
~ Lastni induktivnosti sta res enaki, spremeni pa se, ali se pretoka krepita ali odštevata.
> $L_s - L_p = (L_1 + L_2 + 2M) - (L_1 + L_2 - 2M) = 4M$.

? Študent računa energijo tuljave z $L = 0{,}40\,\mathrm{H}$ pri $I = 0{,}50\,\mathrm{A}$: »1) $W = \tfrac{1}{2}LI^2$; 2) $I^2 = 0{,}25\,\mathrm{A^2}$; 3) $W = 0{,}40 \cdot 0{,}25\,\mathrm{J} = 0{,}10\,\mathrm{J}$.« Kateri korak je napačen?
- korak 1
~ Formula $W = \tfrac{1}{2}LI^2$ je pravilna.
- korak 2
~ $0{,}50^2 = 0{,}25$ je pravilno.
+ korak 3
> Pozabil je faktor $\tfrac{1}{2}$: $W = 0{,}5 \cdot 0{,}40 \cdot 0{,}25\,\mathrm{J} = 0{,}050\,\mathrm{J}$.

? Elektrikar izklopi stikalo velikega elektromagneta brez zaščite in v stikalu vidi močno iskro. Kaj je najboljša razlaga?
- Stikalo je preobremenjeno s prevelikim stalnim tokom.
~ Stalni tok skozi zaprto stikalo iskre ne povzroči; iskra nastane šele ob prekinitvi.
- Iskra nastane zaradi statične elektrike na ohišju.
~ Statični naboj ni povezan s prekinitvijo toka v tuljavi.
+ Energija $\tfrac{1}{2}LI^2$ in napetost $L\,\mathrm{d}i/\mathrm{d}t$ ob hitri prekinitvi prebijeta zrak med kontaktoma.
> Tuljava vzdržuje tok; ko kontakta razmakneta, napetost naraste, dokler zrak ne prevaja. Energija polja se porabi v iskri, ki kontakte žge.

:::simboli
\Psi | spreženi magnetni pretok | \Psi = N\Phi | Wb
\Psi_{21} | pretok prve tuljave, sprežen z drugo | | Wb
\Phi | magnetni pretok | \Phi = \frac{NI}{R_m} | Wb
L | lastna induktivnost | L = \frac{\Psi}{I} | H
L' | induktivnost z režo ali na enoto dolžine | | H | pri kablu v H/m
L_1, L_2 | lastni induktivnosti tuljav | | H
L_s | induktivnost sopojne vezave | L_s = L_1 + L_2 + 2M | H
L_p | induktivnost protipojne vezave | L_p = L_1 + L_2 - 2M | H
L'_z | zunanja induktivnost kabla na enoto dolžine | | H/m
L'_n | notranja induktivnost na enoto dolžine | L'_n = \frac{\mu_0}{8\pi} | H/m
M | medsebojna induktivnost | M = \frac{\Psi_{21}}{I_1} | H
M_{12}, M_{21} | medsebojni induktivnosti v obeh smereh | | H | enaki (vzajemnost)
k | faktor sklopa | k = \frac{M}{\sqrt{L_1 L_2}} | – | med 0 in 1
N, N_1, N_2 | število ovojev | | –
I, I_1, I_2 | tok | | A
i, i_1 | trenutni tok | | A
u, u_2 | inducirana napetost | u = L\frac{\mathrm{d}i}{\mathrm{d}t} | V
R_m | magnetni upor | R_m = \frac{l}{\mu_0 \mu_r A} | A/Wb
R_r | magnetni upor reže | R_r = \frac{l_r}{\mu_0 A} | A/Wb
l | srednja dolžina silnice | | m
l_r | dolžina reže | | m
A | presek jedra | | m^2
\mu_0 | indukcijska konstanta | | V\,s/(A\,m)
\mu_r | relativna permeabilnost | | –
\mu | permeabilnost | \mu = \mu_0 \mu_r | V\,s/(A\,m)
B | gostota magnetnega polja | | T
B_{max} | največja dovoljena gostota | | T
H | magnetna poljska jakost | H = \frac{NI}{l} | A/m
W | energija magnetnega polja | W = \frac{1}{2}LI^2 | J
W'_z, W'_n | energija na enoto dolžine | | J/m
w | gostota energije | w = \frac{B^2}{2\mu} | J/m^3
I_{max} | največji tok brez nasičenja | I_{max} = \frac{B_{max} A R_m}{N} | A
a, b | polmera notranjega vodnika in plašča | | m
r | razdalja od osi | | m
\Delta t | čas spremembe | | s
t | čas | | s
:::
