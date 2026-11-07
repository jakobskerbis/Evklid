---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Začnimo z izpitnim vprašanjem, ki ga zdaj še ne znaš rešiti. Rezilo kirurškega skalpela je iz ogljikovega jekla z $0{,}6\,\%$ ogljika. Proizvajalec ga po kovanju počasi ohladi v peči. Koliko odstotkov rezila je pri sobni temperaturi perlit in koliko ferit, ki je nastal pred njim?

Na prvi pogled za to potrebuješ mikroskop in veliko potrpljenja. Metalurg pa odgovor izračuna v pol minute, s svinčnikom in eno sliko: faznim diagramom. Isto sliko uporablja zobotehnik, ko izbira spajko za zobni most, in inženir, ki načrtuje toplotno obdelavo kirurškega orodja. Na koncu rešenih primerov se k skalpelu vrnemo z vsem potrebnim orodjem.

## Razlaga

### Kaj opazimo pri ohlajanju

Iz prejšnje lekcije veš, da kovina pri strjevanju zgradi kristalno mrežo. Kaj pa se zgodi, ko zmešamo dve kovini? Opravimo miselni poskus. Talino segrejemo, vanjo potopimo termočlen in med počasnim ohlajanjem beležimo temperaturo. Dobimo **ohlajevalno krivuljo**. Tri meritve na sistemu baker-nikelj (vrednosti so zaokrožene):

| vzorec | krivulja | strjevanje |
|---|---|---|
| čisti Cu | plato | $1085\,^\circ\mathrm{C}$ |
| Cu + $35\,\%$ Ni | zlom | $1270$–$1230\,^\circ\mathrm{C}$ |
| čisti Ni | plato | $1455\,^\circ\mathrm{C}$ |

»Plato« pomeni vodoraven del krivulje, »zlom« le spremembo naklona; temperature zlitine so približne.

Čista kovina se strdi pri eni sami temperaturi: dokler se talina strjuje, sproščena talilna toplota drži temperaturo na mestu. Zlitina pa se strjuje v **temperaturnem intervalu**. Krivulja ne obstane, le upočasni se. Ko poskus ponovimo pri več sestavah in na graf temperatura-sestava vnesemo začetke in konce strjevanja, se točke uredijo v dve krivulji. Zgornja povezuje začetke, spodnja konce. Med njima je področje, kjer talina in kristali obstajajo hkrati.

To je že fazni diagram. Preden ga razložimo, potrebujemo natančne pojme.

**Definicija.** *Komponenta* je kemijsko samostojna snov, iz katere je sistem sestavljen (Cu in Ni; Fe in C). *Faza* je homogen del sistema z enako zgradbo in sestavo, ločen od drugih faz z mejno ploskvijo (talina, trdna raztopina, spojina $\mathrm{Fe_3C}$). *Trdna raztopina* je kristal ene komponente, v katerem so atomi druge vgrajeni substitucijsko ali intersticijsko.

**Definicija.** *Ravnotežni fazni diagram* binarnega sistema pri stalnem tlaku pokaže, katere faze so v ravnotežju pri dani temperaturi $T$ in sestavi $c_0$. Sestavo merimo v **masnih odstotkih** ene komponente. *Likvidus* je krivulja, nad katero je vse talina. *Solidus* je krivulja, pod katero je vse trdno. *Solvus* je meja topnosti v trdnem.

Baker in nikelj imata obe mreži KPloC in podobna atomska polmera, zato se mešata v vseh razmerjih. Tak sistem je **izomorfen**: v trdnem je ena sama trdna raztopina $\alpha$, med likvidusom in solidusom pa leži dvofazno področje $\mathrm{L} + \alpha$ v obliki leče.

### Pravilo faz

Zakaj ima čista kovina plato, zlitina pa ne? Odgovor da Gibbsovo pravilo faz.

**Izrek (Gibbsovo pravilo faz pri stalnem tlaku).** Za sistem v ravnotežju s $K$ komponentami in $P$ fazami je število prostostnih stopenj

$$F = K - P + 1$$

Prostostne stopnje so spremenljivke (temperatura, sestave faz), ki jih lahko spreminjamo, ne da bi katera faza izginila ali nastala nova.

- Čista kovina med strjevanjem: $K = 1$, $P = 2$, zato $F = 0$. Temperatura je določena, krivulja ima plato.
- Zlitina v področju $\mathrm{L} + \alpha$: $K = 2$, $P = 2$, zato $F = 1$. Temperatura se lahko spreminja, sestavi obeh faz pa ji sledita.

:::premisli
V binarnem sistemu sta na neki točki hkrati v ravnotežju talina in dve trdni fazi. Napovej, kako bo videti ohlajevalna krivulja pri tej sestavi.
---
$K = 2$ in $P = 3$, zato $F = 2 - 3 + 1 = 0$. Temperatura je določena, kot pri čisti kovini, zato krivulja pokaže vodoraven plato. Takšna točka je na primer evtektik, ki ga spoznamo spodaj, ali peritektik (razdelek »Bolj natančno«).
:::

### Vezna premica in vzvodno pravilo

Vzemimo zlitino s sestavo $c_0$ pri temperaturi $T$ znotraj dvofaznega področja. Skozi točko $(c_0, T)$ potegnemo vodoravno **vezno premico** (konodo) do obeh mej področja. Njeni krajišči povesta **sestavi faz**: levo krajišče na likvidusu da sestavo taline $c_\mathrm{L}$, desno na solidusu sestavo kristalov $c_\alpha$. Pozor: nobena od obeh faz nima sestave $c_0$.

Koliko je katere faze, pove **vzvodno pravilo**. Predstavljaj si vezno premico kot gugalnico z oporo v $c_0$. Masni delež ene faze je dolžina nasprotnega kraka, deljena s celo dolžino.

**Izrek (vzvodno pravilo).** Za zlitino s sestavo $c_0$ v dvofaznem področju $\mathrm{L} + \alpha$ sta masna deleža faz

$$W_\mathrm{L} = \frac{c_\alpha - c_0}{c_\alpha - c_\mathrm{L}}$$

$$W_\alpha = \frac{c_0 - c_\mathrm{L}}{c_\alpha - c_\mathrm{L}}$$

**Izpeljava.** Naj ima zlitina maso $m$ in naj bosta $m_\mathrm{L}$ in $m_\alpha$ masi faz. Ohranitev mase da $m_\mathrm{L} + m_\alpha = m$ oziroma $W_\mathrm{L} + W_\alpha = 1$. Ohranitev mase niklja da $c_0\,m = c_\mathrm{L}\,m_\mathrm{L} + c_\alpha\,m_\alpha$. Delimo z $m$ in vstavimo $W_\alpha = 1 - W_\mathrm{L}$:

$$c_0 = c_\mathrm{L}\,W_\mathrm{L} + c_\alpha\,(1 - W_\mathrm{L})$$

Od tod $W_\mathrm{L}\,(c_\alpha - c_\mathrm{L}) = c_\alpha - c_0$, kar je prva formula. Druga sledi iz $W_\alpha = 1 - W_\mathrm{L}$. ∎

Pravilo velja le v dvofaznem področju, kjer vezna premica obstaja. V enofaznem področju je delež edine faze $1$, njena sestava pa je $c_0$. Ista formula velja za katerikoli par faz: namesto $\mathrm{L}$ in $\alpha$ vstavimo faze, ki ležita na krajiščih vezne premice.

### Evtektični sistem

Srebro in baker imata obe mreži KPloC, a se v trdnem mešata le delno. Diagram Ag-Cu ima dve trdni raztopini: $\alpha$, bogato z bakrom, ki pri $779\,^\circ\mathrm{C}$ raztopi največ $8{,}0\,\%$ Ag, in $\beta$, bogato s srebrom, ki raztopi največ $8{,}8\,\%$ Cu (to je $91{,}2\,\%$ Ag). Likvidusa obeh strani padata in se sekata v **evtektični točki** E: $71{,}9\,\%$ Ag pri $779\,^\circ\mathrm{C}$.

**Definicija.** *Evtektična reakcija* je izotermna pretvorba ene taline v dve trdni fazi:

$$\mathrm{L} \to \alpha + \beta$$

Zlitina z evtektično sestavo se strdi pri eni temperaturi, najnižji v sistemu. Nastane **evtektik**: drobna, pogosto lamelarna zmes faz $\alpha$ in $\beta$. Zlitina levo od E je *podevtektična*: najprej se izločajo **primarni** kristali $\alpha$, preostala talina se bogati s srebrom in pri $779\,^\circ\mathrm{C}$ doseže sestavo E. Takrat se strdi kot evtektik. Zlitina desno od E je *nadevtektična* in ima primarne kristale $\beta$.

Ločiti moramo dve vprašanji. Katere **faze** so v zlitini? Pod evtektično temperaturo le $\alpha$ in $\beta$. Katere **sestavine mikrostrukture** vidimo? Primarni $\alpha$ in evtektik. Evtektik ni faza, je zmes dveh faz z značilno obliko. Vzvodno pravilo za sestavine uporabimo tik pod evtektično temperaturo, na vezni premici od $c_\alpha = 8{,}0\,\%$ do točke E.

### Diagram železo-ogljik

Najpomembnejši diagram tehnike je **metastabilni diagram** $\mathrm{Fe}$-$\mathrm{Fe_3C}$. Na desni se konča pri $6{,}67\,\%$ C, kar je sestava cementita. Faze:

- **ferit** $\alpha$: trdna raztopina C v železu KPC, največ $0{,}022\,\%$ C pri $727\,^\circ\mathrm{C}$; mehak;
- **avstenit** $\gamma$: trdna raztopina C v železu KPloC, največ $2{,}11\,\%$ C pri $1147\,^\circ\mathrm{C}$;
- **cementit** $\mathrm{Fe_3C}$: železov karbid s $6{,}67\,\%$ C; zelo trd in krhek;
- pri visokih temperaturah še $\delta$-ferit in talina.

Ključne točke:

- **evtektik** pri $1147\,^\circ\mathrm{C}$ in $4{,}30\,\%$ C: $\mathrm{L} \to \gamma + \mathrm{Fe_3C}$; zmes je **ledeburit**;
- **evtektoid** pri $727\,^\circ\mathrm{C}$ in $0{,}77\,\%$ C: $\gamma \to \alpha + \mathrm{Fe_3C}$; zmes je **perlit**, tanke izmenične lamele ferita in cementita.

**Definicija.** *Evtektoidna reakcija* je izotermna pretvorba ene **trdne** faze v dve drugi trdni fazi. Od evtektične se loči le po tem, da je izhodna faza trdna.

Meja med jeklom in litim železom je $2{,}11\,\%$ C. Jeklo z manj kot $0{,}77\,\%$ C je **podevtektoidno**, z več **nadevtektoidno**. Skica področja jekel (ni v merilu):

```
 T/°C
 1147 +                /
      |      γ        /
  912 +.             / γ+Fe3C
      |  `.         /
      | α+γ `.     /
  727 +-------S---------------
      |  α+P  |    P+Fe3C
      +-------+-------------->
      0     0,77        2,11 %C
```

Črta od $912\,^\circ\mathrm{C}$ do točke S je $A_3$, vodoravnica pri $727\,^\circ\mathrm{C}$ je $A_1$, črta od S navzgor proti $2{,}11\,\%$ pa $A_\mathrm{cm}$. P pomeni perlit.

Pri počasnem ohlajanju podevtektoidnega jekla se med $A_3$ in $A_1$ iz avstenita izloča **proevtektoidni ferit**. Ferit ogljika skoraj ne raztaplja, zato se preostali avstenit bogati z ogljikom in pri $727\,^\circ\mathrm{C}$ doseže $0{,}77\,\%$. Takrat se ves pretvori v perlit. Pri nadevtektoidnem jeklu se pod $A_\mathrm{cm}$ izloča **sekundarni cementit** po mejah avstenitnih zrn.

:::premisli
Zakaj ima vsako počasi ohlajeno podevtektoidno jeklo tik pod $727\,^\circ\mathrm{C}$ enako sestavljen perlit, ne glede na to, ali ima $0{,}2\,\%$ ali $0{,}6\,\%$ C?
---
Perlit nastane iz avstenita, ki je ob $727\,^\circ\mathrm{C}$ vedno dosegel evtektoidno sestavo $0{,}77\,\%$ C. Od sestave jekla je odvisno le, koliko avstenita je takrat še ostalo, torej koliko perlita nastane, ne pa njegova sestava.
:::

## Rešeni primeri

### Primer 1: zlitina za bolnišnične kljuke

Bakrove zlitine na kljukah in ograjah bolniških postelj zmanjšajo število bakterij na površini. Livar ulije $5\,\mathrm{kg}$ zlitine Cu s $35\,\%$ Ni. Pri $1250\,^\circ\mathrm{C}$ iz diagrama odčita, da ima talina $31{,}5\,\%$ Ni, kristali $\alpha$ pa $42{,}5\,\%$ Ni. Koliko je pri tej temperaturi taline in koliko kristalov?

**Podatki:** $m = 5\,\mathrm{kg}$, $c_0 = 35\,\%$ Ni, $c_\mathrm{L} = 31{,}5\,\%$ Ni, $c_\alpha = 42{,}5\,\%$ Ni, $T = 1250\,^\circ\mathrm{C}$
**Iščemo:** masna deleža $W_\mathrm{L}$, $W_\alpha$ in masi faz

:::formula
$W_\mathrm{L} = \dfrac{c_\alpha - c_0}{c_\alpha - c_\mathrm{L}}$, $W_\alpha = 1 - W_\mathrm{L}$
:::

**Rešitev:**

1. Točka leži v leči $\mathrm{L} + \alpha$, ker je $31{,}5 < 35 < 42{,}5$; vzvodno pravilo torej smemo uporabiti.
2. Talina: $W_\mathrm{L} = \dfrac{42{,}5 - 35}{42{,}5 - 31{,}5} = \dfrac{7{,}5}{11} \approx 0{,}682$.
3. Kristali: $W_\alpha = 1 - 0{,}682 = 0{,}318$.
4. Masi: $m_\mathrm{L} = 0{,}682 \cdot 5\,\mathrm{kg} \approx 3{,}41\,\mathrm{kg}$ in $m_\alpha \approx 1{,}59\,\mathrm{kg}$.
5. Odgovor: pri $1250\,^\circ\mathrm{C}$ je okoli $3{,}4\,\mathrm{kg}$ taline z $31{,}5\,\%$ Ni in $1{,}6\,\mathrm{kg}$ kristalov z $42{,}5\,\%$ Ni. Talina je bližje sestavi $c_0$, zato je je več.

### Primer 2: srebrna spajka za zobni most

Zobotehnik spaja dele zobnega mostu s spajko Ag-Cu s $50\,\%$ Ag. Kateri sestavini mikrostrukture in kateri fazi ima spajka tik pod $779\,^\circ\mathrm{C}$ in v kakšnih deležih? Iz diagrama: $c_\alpha = 8{,}0\,\%$ Ag, $c_\mathrm{E} = 71{,}9\,\%$ Ag, $c_\beta = 91{,}2\,\%$ Ag.

**Podatki:** $c_0 = 50\,\%$ Ag, $c_\alpha = 8{,}0\,\%$ Ag, $c_\mathrm{E} = 71{,}9\,\%$ Ag, $c_\beta = 91{,}2\,\%$ Ag, $T_\mathrm{E} = 779\,^\circ\mathrm{C}$
**Iščemo:** deleža primarnega $\alpha$ in evtektika, deleža faz $\alpha$ in $\beta$

:::formula
Sestavini: $W_\mathrm{e} = \dfrac{c_0 - c_\alpha}{c_\mathrm{E} - c_\alpha}$; faze: $W_\beta = \dfrac{c_0 - c_\alpha}{c_\beta - c_\alpha}$
:::

**Rešitev:**

1. Ker je $50 < 71{,}9$, je spajka podevtektična: najprej se izločajo primarni kristali $\alpha$.
2. Tik nad $779\,^\circ\mathrm{C}$ je preostala talina natanko evtektične sestave in se nato vsa strdi v evtektik. Delež evtektika je zato enak deležu te taline: $W_\mathrm{e} = \dfrac{50 - 8}{71{,}9 - 8} = \dfrac{42}{63{,}9} \approx 0{,}657$.
3. Primarni $\alpha$: $W_\mathrm{p} = 1 - 0{,}657 = 0{,}343$.
4. Za faze vezna premica seže čez vse dvofazno področje do $91{,}2\,\%$: $W_\beta = \dfrac{50 - 8}{91{,}2 - 8} = \dfrac{42}{83{,}2} \approx 0{,}505$, zato $W_\alpha \approx 0{,}495$.
5. Odgovor: mikrostruktura ima okoli $34\,\%$ primarnega $\alpha$ in $66\,\%$ evtektika; po fazah je okoli $50\,\%$ $\alpha$ in $50\,\%$ $\beta$. Del faze $\alpha$ je namreč tudi v evtektiku.

### Primer 3 (izpitna raven): rezilo skalpela

Vrnimo se k vprašanju z začetka. Rezilo iz ogljikovega jekla z $0{,}6\,\%$ C počasi ohladimo z $900\,^\circ\mathrm{C}$. (a) Opiši potek pretvorb in oceni temperaturo $A_3$, če črto $A_3$ nadomestimo z daljico od $(0\,\%; 912\,^\circ\mathrm{C})$ do $(0{,}77\,\%; 727\,^\circ\mathrm{C})$. (b) Izračunaj delež proevtektoidnega ferita in perlita tik pod $727\,^\circ\mathrm{C}$. (c) Izračunaj delež faz ferit in cementit.

**Podatki:** $c_0 = 0{,}6\,\%$ C, $c_\alpha = 0{,}022\,\%$ C, $c_\mathrm{S} = 0{,}77\,\%$ C, $c_\mathrm{cem} = 6{,}67\,\%$ C, $A_1 = 727\,^\circ\mathrm{C}$, daljica $A_3$ od $912$ do $727\,^\circ\mathrm{C}$
**Iščemo:** $A_3$ za to jeklo, deleža sestavin $W_\mathrm{pf}$ in $W_\mathrm{per}$, deleža faz $W_\alpha$ in $W_\mathrm{cem}$

:::formula
$A_3 \approx 912\,^\circ\mathrm{C} - 185\,^\circ\mathrm{C} \cdot \dfrac{c_0}{0{,}77\,\%}$; $W_\mathrm{per} = \dfrac{c_0 - c_\alpha}{c_\mathrm{S} - c_\alpha}$; $W_\mathrm{cem} = \dfrac{c_0 - c_\alpha}{c_\mathrm{cem} - c_\alpha}$
:::

**Rešitev:**

1. Pri $900\,^\circ\mathrm{C}$ je jeklo ves avstenit. Padec daljice je $912 - 727 = 185$, zato $A_3 \approx 912 - 185 \cdot \dfrac{0{,}6}{0{,}77} \approx 768$, torej okoli $768\,^\circ\mathrm{C}$.
2. Med $768$ in $727\,^\circ\mathrm{C}$ se izloča proevtektoidni ferit, preostali avstenit se bogati z ogljikom do $0{,}77\,\%$.
3. Tik nad $727\,^\circ\mathrm{C}$ je avstenita $W_\gamma = \dfrac{0{,}6 - 0{,}022}{0{,}77 - 0{,}022} = \dfrac{0{,}578}{0{,}748} \approx 0{,}773$. Ves se pretvori v perlit, zato je $W_\mathrm{per} \approx 0{,}773$.
4. Proevtektoidni ferit: $W_\mathrm{pf} = 1 - 0{,}773 = 0{,}227$.
5. Faze: vezna premica pod $727\,^\circ\mathrm{C}$ gre od ferita do cementita, $W_\mathrm{cem} = \dfrac{0{,}6 - 0{,}022}{6{,}67 - 0{,}022} = \dfrac{0{,}578}{6{,}648} \approx 0{,}087$, zato $W_\alpha \approx 0{,}913$.
6. Odgovor: rezilo ima okoli $77\,\%$ perlita in $23\,\%$ proevtektoidnega ferita; po fazah je okoli $91\,\%$ ferita in le $9\,\%$ cementita. Pod $727\,^\circ\mathrm{C}$ se deleži pri počasnem ohlajanju do sobne temperature skoraj ne spremenijo.

### Primer 4: zdaj ti

Rezilo mikrotoma, s katerim biologi režejo tanke rezine tkiv, je iz jekla z $1{,}2\,\%$ C, počasi ohlajenega. Koliko sekundarnega cementita in koliko perlita ima tik pod $727\,^\circ\mathrm{C}$?

**Podatki:** $c_0 = 1{,}2\,\%$ C, $c_\mathrm{S} = 0{,}77\,\%$ C, $c_\mathrm{cem} = 6{,}67\,\%$ C
**Iščemo:** deleža sestavin $W_\mathrm{sc}$ in $W_\mathrm{per}$

:::formula
$W_\mathrm{sc} = \dfrac{c_0 - c_\mathrm{S}}{c_\mathrm{cem} - c_\mathrm{S}}$
:::

**Rešitev:**

1. Ker je $1{,}2 > 0{,}77$, je jeklo nadevtektoidno: pod $A_\mathrm{cm}$ se izloča sekundarni cementit, avstenit pa se osiromaši do $0{,}77\,\%$ C.
2. Vezna premica tik nad $727\,^\circ\mathrm{C}$ gre od $0{,}77\,\%$ (avstenit, ki bo perlit) do $6{,}67\,\%$ (cementit).
3. Izračunaj oba deleža.

:::premisli
Koliko sta $W_\mathrm{sc}$ in $W_\mathrm{per}$?
---
$W_\mathrm{sc} = \dfrac{1{,}2 - 0{,}77}{6{,}67 - 0{,}77} = \dfrac{0{,}43}{5{,}9} \approx 0{,}073$ in $W_\mathrm{per} \approx 0{,}927$. Rezilo ima okoli $7\,\%$ sekundarnega cementita, ki tvori mrežo po mejah zrn, in $93\,\%$ perlita.
:::

## Pogoste napake

- **Sestava faze zamenjana s sestavo zlitine.** Študent reče, da ima talina v Primeru 1 kar $35\,\%$ Ni. Sestavi faz sta na krajiščih vezne premice ($31{,}5$ in $42{,}5\,\%$), $c_0$ je le opora gugalnice.
- **Obrnjen vzvod.** Za $W_\mathrm{L}$ kdo vzame krak od likvidusa do $c_0$, ker leži »na strani taline«. Delež faze je nasprotni krak: bližje kot je $c_0$ meji neke faze, več je te faze. Preizkus: ko $c_0$ zdrsne na likvidus, mora biti $W_\mathrm{L} = 1$.
- **Evtektik ali perlit šteti kot fazo.** Perlit je zmes ferita in cementita. Za delež perlita vezna premica seže do $0{,}77\,\%$, za delež cementita kot faze do $6{,}67\,\%$. Dve različni vprašanji, dve različni premici.
- **Vzvodno pravilo v enofaznem področju.** Pri $900\,^\circ\mathrm{C}$ je jeklo z $0{,}6\,\%$ C ves avstenit. Vezne premice tam ni, zato je delež avstenita $1$.
- **Napačna meja jekla.** Jeklo se konča pri $2{,}11\,\%$ C, ne pri $0{,}77\,\%$; evtektoidna sestava ločuje le pod- in nadevtektoidna jekla.

## Povzetek

- Fazni diagram pri stalnem tlaku pove, katere faze so v ravnotežju pri $T$ in $c_0$. Likvidus, solidus in solvus omejujejo področja.
- Pravilo faz $F = K - P + 1$: čista kovina in evtektik se strdita pri stalni temperaturi ($F = 0$), zlitina v dvofaznem področju v intervalu ($F = 1$).
- Vezna premica da sestavi faz, vzvodno pravilo njune masne deleže: $W_\mathrm{L} = \frac{c_\alpha - c_0}{c_\alpha - c_\mathrm{L}}$. Izpeljava iz ohranitve mase.
- Izomorfen sistem (Cu-Ni) ima eno trdno raztopino; evtektičen (Ag-Cu) ima reakcijo $\mathrm{L} \to \alpha + \beta$ pri stalni temperaturi.
- Fe-$\mathrm{Fe_3C}$: evtektik ledeburit pri $1147\,^\circ\mathrm{C}$ in $4{,}30\,\%$ C, evtektoid perlit pri $727\,^\circ\mathrm{C}$ in $0{,}77\,\%$ C.
- Topnost ogljika: ferit največ $0{,}022\,\%$, avstenit največ $2{,}11\,\%$; cementit ima $6{,}67\,\%$ C.
- Ločuj faze (ferit, cementit) od sestavin mikrostrukture (proevtektoidni ferit, perlit, sekundarni cementit).

## Za izpit

Znati moraš povedati:

- definicije komponente, faze, trdne raztopine, likvidusa, solidusa in solvusa;
- Gibbsovo pravilo faz pri stalnem tlaku in z njim utemeljiti plato na ohlajevalni krivulji;
- izpeljavo vzvodnega pravila iz ohranitve mase in pogoj, kdaj velja;
- razliko med evtektično in evtektoidno reakcijo z obema primeroma iz diagrama Fe-$\mathrm{Fe_3C}$;
- vse točke diagrama Fe-$\mathrm{Fe_3C}$ s temperaturami in sestavami ter imena faz in sestavin.

### Naloga 1

Ulitek iz belega litega železa s $3{,}0\,\%$ C in maso $20\,\mathrm{kg}$ se počasi ohlaja. (a) Katere faze ima tik nad $1147\,^\circ\mathrm{C}$ in v kakšnih deležih? (b) Koliko kilogramov ledeburita nastane? (c) Kolikšen je masni delež cementita kot faze tik pod $727\,^\circ\mathrm{C}$? Uporabi $c_\gamma = 2{,}11\,\%$, $c_\mathrm{E} = 4{,}30\,\%$, $c_\alpha = 0{,}022\,\%$ in $c_\mathrm{cem} = 6{,}67\,\%$ C.

**Rešitev:**

1. Ker je $2{,}11 < 3{,}0 < 4{,}30$, je zlitina podevtektična. Tik nad $1147\,^\circ\mathrm{C}$ je v področju $\mathrm{L} + \gamma$ s $c_\gamma = 2{,}11\,\%$ in talino evtektične sestave $4{,}30\,\%$.
2. Talina: $W_\mathrm{L} = \dfrac{3{,}0 - 2{,}11}{4{,}30 - 2{,}11} = \dfrac{0{,}89}{2{,}19} \approx 0{,}406$; primarni avstenit $W_\gamma \approx 0{,}594$.
3. Vsa ta talina se pri $1147\,^\circ\mathrm{C}$ strdi v ledeburit: $m = 0{,}406 \cdot 20\,\mathrm{kg} \approx 8{,}1\,\mathrm{kg}$.
4. Pod $727\,^\circ\mathrm{C}$ sta fazi le ferit in cementit: $W_\mathrm{cem} = \dfrac{3{,}0 - 0{,}022}{6{,}67 - 0{,}022} = \dfrac{2{,}978}{6{,}648} \approx 0{,}448$.
5. Odgovor: (a) okoli $41\,\%$ taline in $59\,\%$ avstenita; (b) okoli $8{,}1\,\mathrm{kg}$ ledeburita; (c) okoli $45\,\%$ cementita. Zato je belo lito železo trdo in krhko.

### Naloga 2

Natančno navedi Gibbsovo pravilo faz pri stalnem tlaku. Utemelji z njim, zakaj zlitina z evtektično sestavo nima intervala strjevanja, zlitina s $50\,\%$ Ag v sistemu Ag-Cu pa ga ima. Nato iz ohranitve mase izpelji vzvodno pravilo za fazi $\alpha$ in $\beta$.

**Rešitev:**

1. Pravilo: v ravnotežju s $K$ komponentami in $P$ fazami pri stalnem tlaku je $F = K - P + 1$.
2. Evtektična sestava: med strjevanjem so hkrati L, $\alpha$ in $\beta$, torej $F = 2 - 3 + 1 = 0$. Temperatura je določena ($779\,^\circ\mathrm{C}$), krivulja ima en plato.
3. Spajka s $50\,\%$ Ag: najprej sta prisotni le L in $\alpha$, $F = 2 - 2 + 1 = 1$. Temperatura pada, medtem ko se izločajo primarni kristali; šele na koncu, pri $779\,^\circ\mathrm{C}$, sledi plato za evtektik. Interval je od likvidusa do $779\,^\circ\mathrm{C}$.
4. Izpeljava: $m_\alpha + m_\beta = m$ in $c_\alpha m_\alpha + c_\beta m_\beta = c_0 m$. Z $W_\alpha = 1 - W_\beta$ dobimo $c_\alpha (1 - W_\beta) + c_\beta W_\beta = c_0$, torej $W_\beta = \dfrac{c_0 - c_\alpha}{c_\beta - c_\alpha}$ in $W_\alpha = \dfrac{c_\beta - c_0}{c_\beta - c_\alpha}$.
5. Pravilo velja le na vezni premici znotraj dvofaznega področja in le v ravnotežju.

### Naloga 3

Metalograf na posnetku počasi ohlajenega podevtektoidnega jekla s slikovno analizo posnetka z elektronskim mikroskopom izmeri, da je delež cementita kot faze $10\,\%$. Gostoti ferita in cementita sta skoraj enaki, zato je to tudi masni delež. Kolikšna je vsebnost ogljika v jeklu in kolikšen je delež perlita?

**Rešitev:**

1. Vezna premica za faze: $W_\mathrm{cem} = \dfrac{c_0 - 0{,}022}{6{,}67 - 0{,}022}$.
2. Iz $W_\mathrm{cem} = 0{,}10$ sledi $c_0 = 0{,}022 + 0{,}10 \cdot 6{,}648 \approx 0{,}687$, torej okoli $0{,}69\,\%$ C.
3. Perlit: $W_\mathrm{per} = \dfrac{0{,}687 - 0{,}022}{0{,}77 - 0{,}022} = \dfrac{0{,}665}{0{,}748} \approx 0{,}889$.
4. Odgovor: jeklo ima okoli $0{,}69\,\%$ C in okoli $89\,\%$ perlita. Ker je $0{,}69 < 0{,}77$, je predpostavka o podevtektoidnem jeklu izpolnjena.

## Drugače: Korak za korakom s številkami

Sledimo jeklu z $0{,}4\,\%$ C od $900\,^\circ\mathrm{C}$ navzdol in opazujmo, kako se spreminjata sestava in delež avstenita. Črto $A_3$ spet nadomestimo z daljico.

1. *$900\,^\circ\mathrm{C}$:* ves avstenit, $W_\gamma = 1$, sestava $0{,}4\,\%$ C.
2. *Črta $A_3$:* $912 - 185 \cdot \frac{0{,}4}{0{,}77} \approx 816$, torej okoli $816\,^\circ\mathrm{C}$. Pojavi se prvi ferit.
3. *$760\,^\circ\mathrm{C}$:* na daljici $A_3$ odčitamo sestavo avstenita $\frac{912 - 760}{185} \cdot 0{,}77 \approx 0{,}63\,\%$ C, ferit ima okoli $0{,}02\,\%$. Ferita je $\frac{0{,}63 - 0{,}4}{0{,}63 - 0{,}02} \approx 0{,}38$.
4. *Tik nad $727\,^\circ\mathrm{C}$:* avstenit ima $0{,}77\,\%$, ferita je $\frac{0{,}77 - 0{,}4}{0{,}748} \approx 0{,}49$.
5. *Tik pod $727\,^\circ\mathrm{C}$:* preostali avstenit postane perlit, $W_\mathrm{per} \approx 0{,}51$.

Vidiš vzorec: ko temperatura pada, avstenit se krči in bogati z ogljikom, dokler ne doseže točke S. Jeklo z $0{,}4\,\%$ C ima zato približno pol perlita, kar je dobro pravilo za hitro oceno: delež perlita je približno $c_0 / 0{,}77$.

## Drugače: Bolj natančno

Diagram $\mathrm{Fe}$-$\mathrm{Fe_3C}$ je **metastabilen**. Cementit sčasoma razpade v železo in grafit, a pri sobni temperaturi neznansko počasi. Pri sivem litem železu silicij in počasno ohlajanje pospešita nastanek grafita; tam velja stabilni diagram Fe-C, katerega črte so le malo premaknjene.

Na zgornjem levem robu diagrama je še **peritektična reakcija** pri okoli $1495\,^\circ\mathrm{C}$: $\delta + \mathrm{L} \to \gamma$. Trdna faza in talina skupaj dasta novo trdno fazo. Pri počasnem ohlajanju ima reakcija težavo: novi avstenit obda kristale $\delta$ in loči talino od njih, zato se pretvorba konča le z difuzijo skozi to plast.

Ravnotežni diagram predpostavlja, da ima difuzija dovolj časa. Pri hitrem strjevanju se sestava kristalov ne izenači: jedro kristala ima drugo sestavo kot rob (**kristalno izcejanje**, angl. *coring*). Pri hitrem ohlajanju jekla pa nastanejo strukture, ki jih v ravnotežnem diagramu ni. To je vsebina naslednje lekcije o toplotni obdelavi.

## Drugače: Uporaba v stroki

- *Kirurška orodja.* Martenzitna nerjavna jekla (okoli $13\,\%$ Cr in $0{,}2$ do $0{,}4\,\%$ C) za skalpele in klešče izberejo tako, da so pri temperaturi kaljenja v področju avstenita. Brez faznega diagrama ne bi vedeli, do kod jih segreti.
- *Vsadki.* Titanova zlitina Ti-6Al-4V za kolčne proteze je dvofazna ($\alpha + \beta$). Razmerje faz, ki ga določa temperatura obdelave, nastavi trdnost in odpornost proti utrujanju.
- *Zobotehnika in spajke.* Spajke izbirajo blizu evtektične sestave, ker se strdijo pri eni, nizki temperaturi in lepo tečejo v režo.
- *Laboratorij.* Likvidus in solidus merijo z diferenčno dinamično kalorimetrijo; metalografi na obrusih s slikovno analizo izmerijo delež perlita ali cementita in iz njega z vzvodnim pravilom preverijo vsebnost ogljika, kot v Nalogi 3. Slikovna analiza da ploščinski (prostorninski) delež; ker imata ferit in cementit skoraj enako gostoto, je ta blizu masnega.

## Preveri se

? Katera ohlajevalna krivulja ustreza zlitini Ag-Cu z evtektično sestavo $71{,}9\,\%$ Ag?
- Krivulja z zlomom pri likvidusu in nato enakomernim padanjem brez platoja.
~ Tako se ohlaja zlitina v izomorfnem sistemu, kjer strjevanje poteka v intervalu.
+ Krivulja z enim samim vodoravnim platojem pri $779\,^\circ\mathrm{C}$.
- Krivulja z zlomom in kasneje platojem pri $779\,^\circ\mathrm{C}$.
~ To je podevtektična ali nadevtektična zlitina: najprej se izločajo primarni kristali, nato evtektik.
> Pri evtektični sestavi so hkrati L, $\alpha$ in $\beta$, zato $F = 0$ in temperatura obstane pri $779\,^\circ\mathrm{C}$.

? Oceni brez kalkulatorja: koliko perlita ima počasi ohlajeno jeklo z $0{,}4\,\%$ C?
- Okoli $6\,\%$.
~ To je delež cementita kot faze; za perlit vezna premica seže le do $0{,}77\,\%$.
+ Okoli $50\,\%$.
- Okoli $90\,\%$.
~ Tako veliko perlita ima šele jeklo blizu $0{,}7\,\%$ C.
> $W_\mathrm{per} = \frac{0{,}4 - 0{,}022}{0{,}748} \approx 0{,}51$; hitra ocena je $0{,}4 / 0{,}77 \approx 0{,}5$.

? Zakaj se zlitina Cu s $35\,\%$ Ni strjuje v temperaturnem intervalu, čisti baker pa pri eni temperaturi?
- Ker ima nikelj višje tališče od bakra.
~ Višje tališče premakne lečo navzgor, ne razloži pa, zakaj zlitina nima platoja.
- Ker se v zlitini med strjevanjem sprošča manj toplote.
~ Talilna toplota se sprošča tudi v zlitini; plato določa število prostostnih stopenj.
+ Ker sta v zlitini med strjevanjem dve fazi in dve komponenti, zato je $F = 1$ in temperatura se lahko spreminja.
> Pri čisti kovini je $F = 1 - 2 + 1 = 0$, pri zlitini $F = 2 - 2 + 1 = 1$: sestavi faz sledita temperaturi.

? Na obrusu počasi ohlajenega jekla je $30\,\%$ proevtektoidnega ferita, preostalo je perlit. Koliko ogljika ima jeklo?
- Okoli $0{,}23\,\%$ C.
~ To je $0{,}3 \cdot 0{,}77$: vzvod je obrnjen. Več ferita pomeni manj ogljika, a delež ferita ustreza kraku od $c_0$ do $0{,}77$.
+ Okoli $0{,}55\,\%$ C.
- Okoli $0{,}97\,\%$ C.
~ Jeklo z več kot $0{,}77\,\%$ C sploh nima proevtektoidnega ferita, temveč sekundarni cementit.
> $0{,}30 = \frac{0{,}77 - c_0}{0{,}748}$, zato $c_0 = 0{,}77 - 0{,}224 \approx 0{,}55\,\%$ C.

? Zlitina Al-Si za ohišja medicinskih naprav ima $7\,\%$ Si; evtektik sistema je pri $12{,}6\,\%$ Si in $577\,^\circ\mathrm{C}$. Kaj se ob ohlajanju taline izloči najprej?
- Evtektik pri $577\,^\circ\mathrm{C}$, ker se vsaka zlitina strdi kot evtektik.
~ Kot evtektik se strdi le zlitina evtektične sestave; druge imajo najprej primarne kristale.
- Primarni kristali silicija.
~ Primarni silicij ima nadevtektična zlitina z več kot $12{,}6\,\%$ Si.
+ Primarni kristali trdne raztopine na osnovi aluminija, nato pri $577\,^\circ\mathrm{C}$ evtektik.
> Zlitina je podevtektična ($7 < 12{,}6$), zato se kot pri spajki Ag-Cu najprej izloča faza z leve strani diagrama.

:::simboli
F | število prostostnih stopenj | F = K - P + 1 | – | pri stalnem tlaku
K | število komponent | | –
P | število faz v ravnotežju | | –
\alpha | trdna raztopina $\alpha$ (faza) | | | v Fe-C ferit
\beta | trdna raztopina $\beta$ (faza) | | |
W_\mathrm{L} | masni delež taline | W_\mathrm{L} = \frac{c_\alpha - c_0}{c_\alpha - c_\mathrm{L}} | –
W_\alpha | masni delež faze $\alpha$ (ferita) | | –
W_\beta | masni delež faze $\beta$ | W_\beta = \frac{c_0 - c_\alpha}{c_\beta - c_\alpha} | –
W_\gamma | masni delež avstenita | | –
c_0 | sestava zlitine | | \% | masni odstotek
c_\mathrm{L} | sestava taline | | \% | krajišče vezne premice na likvidusu
c_\alpha | sestava faze $\alpha$ | | \%
c_\beta | sestava faze $\beta$ | | \%
c_\gamma | sestava avstenita | | \%
c_\mathrm{E} | evtektična sestava | | \%
c_\mathrm{S} | evtektoidna sestava | | \% | $0{,}77\,\%$ C
c_\mathrm{cem} | sestava cementita | | \% | $6{,}67\,\%$ C
W_\mathrm{e} | masni delež evtektika | W_\mathrm{e} = \frac{c_0 - c_\alpha}{c_\mathrm{E} - c_\alpha} | –
W_\mathrm{p} | masni delež primarnih kristalov | | –
W_\mathrm{per} | masni delež perlita | W_\mathrm{per} = \frac{c_0 - c_\alpha}{c_\mathrm{S} - c_\alpha} | –
W_\mathrm{pf} | masni delež proevtektoidnega ferita | | –
W_\mathrm{cem} | masni delež cementita | W_\mathrm{cem} = \frac{c_0 - c_\alpha}{c_\mathrm{cem} - c_\alpha} | –
W_\mathrm{sc} | masni delež sekundarnega cementita | W_\mathrm{sc} = \frac{c_0 - c_\mathrm{S}}{c_\mathrm{cem} - c_\mathrm{S}} | –
A_3 | temperatura začetka izločanja ferita | | ^\circ C
A_1 | evtektoidna temperatura | | ^\circ C | $727\,^\circ\mathrm{C}$
T_\mathrm{E} | evtektična temperatura | | ^\circ C
T | temperatura | | ^\circ C
m | masa zlitine | | kg
:::
