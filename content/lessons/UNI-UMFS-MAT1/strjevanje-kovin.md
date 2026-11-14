---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na zimskem potovanju z avtom pustiš plastenko vode čez noč v prtljažniku. Zjutraj termometer v avtu kaže $-8\,^\circ\mathrm{C}$, voda pa je še tekoča. Odpreš jo in z dnom udariš ob odbijač. V nekaj sekundah od mesta udarca zrastejo ledene iglice in plastenka se napolni z ledeno kašo.

Isto jutro je vetrobransko steklo prekrito z ivjem. Ledene »rožice« niso razporejene enakomerno. Vsaka raste iz ene točke, iz praske ali prašnega delca, in se širi, dokler ne zadene sosede. Kjer se srečata, ostane ostra meja.

Ista ideja v obeh primerih: nova trdna faza ne nastane povsod hkrati. Najprej potrebuje **kal**, droben zametek, šele nato raste. Pri litju kovin je natanko tako. Koliko kali nastane in kako rastejo, določa **mikrostrukturo** ulitka, ta pa trdnost, žilavost in obdelovalnost. Jedkan prerez ulitka je pod mikroskopom videti kot zemljevid občin: vsaka »občina« je eno kristalno zrno, vsaka meja med njimi pa meja zrn.

## Razlaga

**1. En primer: kal bakra.** Talino čistega bakra ohladimo za $\Delta T = 236\,\mathrm{K}$ pod tališče $T_m = 1358\,\mathrm{K}$. Razliki med tališčem in dejansko temperaturo taline rečemo **podhladitev** $\Delta T$.

Atomi se v talini zaradi toplotnega gibanja ves čas za hip zložijo v drobne kroglice s kristalno zgradbo PCK (ploskovno centrirana kubična). Ali tak skupek z radijem $r$ preživi, odloča sprememba Gibbsove proste energije $\Delta G$. Prispevka sta dva.

- **Prostornina.** Pod tališčem ima trdna faza nižjo prosto energijo kot talina. Vsak kubični meter trdnine prinese prihranek $\Delta G_v$, ki ga izračunamo iz **talilne toplote na enoto prostornine** $\Delta H_f$: $\Delta G_v = \dfrac{\Delta H_f\,\Delta T}{T_m}$. Za baker je $\Delta H_f = 1{,}77 \cdot 10^{9}\,\mathrm{J/m^3}$, torej $\Delta G_v \approx 3{,}08 \cdot 10^{8}\,\mathrm{J/m^3}$.
- **Površina.** Meja med trdnim in talino stane energijo. Na kvadratni meter je to **površinska energija meje** $\gamma$, za baker $0{,}200\,\mathrm{J/m^2}$.

Prihranek raste z $r^3$, cena površine z $r^2$. Izračunajmo oba za nekaj radijev (vse energije v $10^{-19}\,\mathrm{J}$):

| $r$ [nm] | prostornina | površina | $\Delta G$ |
|---|---|---|---|
| 0,5 | −1,6 | +6,3 | +4,7 |
| 1,0 | −12,9 | +25,1 | +12,2 |
| 1,3 | −28,3 | +42,5 | +14,2 |
| 2,0 | −103,1 | +100,5 | −2,5 |
| 3,0 | −347,9 | +226,2 | −121,7 |

:::premisli
Trdna faza je pod tališčem stabilnejša od taline. Napovej iz tabele: ali kroglica z $r = 1{,}0\,\mathrm{nm}$ raste ali se raztopi? Zakaj?
---
Pri majhnem $r$ ima kroglica veliko površine glede na prostornino. Člen s površino ($\propto r^2$) prevlada nad prihrankom ($\propto r^3$), zato bi rast do $1{,}1\,\mathrm{nm}$ energijo še povečala. Sistem gre v smeri nižje $\Delta G$, za tako kroglico je to razpad.
:::

Do približno $1{,}3\,\mathrm{nm}$ vrednost $\Delta G$ narašča, nato pada. Kroglica levo od vrha se raje raztopi, saj bi jo rast stala energijo. Kroglica, ki se po naključju prebije čez vrh, z rastjo energijo zmanjšuje in raste naprej. Taki rečemo **stabilna kal**.

**2. Posplošitev: kritični radij.** Za kroglico s poljubnim $r$ velja

$$\Delta G = -\tfrac{4}{3}\pi r^3\,\Delta G_v + 4\pi r^2\,\gamma$$

Vrh krivulje leži pri **kritičnem radiju** $r_{kr}$, višina vrha je **energijska ovira za nukleacijo** $\Delta G_{kr}$:

$$r_{kr} = \frac{2\gamma}{\Delta G_v} = \frac{2\gamma\,T_m}{\Delta H_f\,\Delta T}$$

$$\Delta G_{kr} = \frac{16\pi\gamma^3}{3\,\Delta G_v^2}$$

Za naš baker je $r_{kr} \approx 1{,}30\,\mathrm{nm}$ (približno 780 atomov) in $\Delta G_{kr} \approx 1{,}42 \cdot 10^{-18}\,\mathrm{J}$. **Nukleacija** je nastanek takih stabilnih kali.

Iz formul razberemo dvoje. Večja podhladitev pomeni manjši $r_{kr}$, ovira pa pada celo s kvadratom, $\Delta G_{kr} \propto 1/\Delta T^2$. Pri $\Delta T = 0$ je $r_{kr}$ neskončen, zato se točno pri tališču nič ne strdi.

**3. Homogena in heterogena nukleacija.** Kal sredi čiste taline nastane s **homogeno nukleacijo**. Zanjo bi baker potreboval podhladitev več kot $200\,\mathrm{K}$. Pravi ulitki se strdijo že pri nekaj kelvinih podhladitve. Kali namreč nastajajo na obstoječih površinah: na steni forme, na delcih oksidov in na namerno dodanih **cepivih** (npr. delci $\mathrm{TiB_2}$ v aluminijevih zlitinah). To je **heterogena nukleacija**.

Na podlagi kal ni cela kroglica, ampak kapica z **močitvenim kotom** $\theta$, to je kotom med površino kapice in podlago. Za isti $r_{kr}$ potrebuje manj atomov, zato je ovira manjša:

$$\Delta G_{het} = S\,\Delta G_{kr}$$

$$S = \frac{(2+\cos\theta)(1-\cos\theta)^2}{4}$$

Faktor $S$ je med $0$ in $1$. Bolj ko talina »moči« podlago (manjši $\theta$), manjši je.

:::premisli
Napovej: ali ima ulitek, ki mu dodamo cepivo, večja ali manjša zrna kot enak ulitek brez cepiva?
---
Manjša. Cepivo ponudi veliko mest za heterogeno nukleacijo. Kali je veliko, vsaka ima na voljo manj taline, preden trči v sosede, zato je zrn več in so drobnejša.
:::

**4. Rast in dendriti.** Stabilna kal raste, ko se nanjo vežejo atomi iz taline. Ob tem se sprošča talilna toplota, ki jo mora odvesti forma. Če je talina pred mejo podhlajena, zraste vsaka izboklina hitreje od okolice, saj sega v hladnejšo talino. Iz izboklin nastanejo **dendriti**, drevesca z glavnimi vejami v prednostnih kristalnih smereh (pri kubičnih kovinah $\langle 100 \rangle$). Zlitina se strjuje v temperaturnem intervalu (glej fazni diagram), zato se med vejami nabira talina, bogatejša s primesjo. Tako nastane **izcejanje**: neenakomerna sestava med jedrom in robom zrna.

**Kristalno zrno** je območje z enako orientacijo kristalne mreže, zraslo iz ene kali. Veje dendrita se sčasoma zapolnijo, rast se ustavi, ko zrno zadene sosednja zrna. Tam ostane **meja zrn**, tanek pas neurejenih atomov.

**5. Mikrostruktura ulitka.** Na prečnem prerezu ingota se od stene proti sredini vrstijo tri cone:

1. **skorjasta cona**: tanek pas drobnih enakoosnih zrn; hladna stena da veliko podhladitev in veliko kali;
2. **stebričasta cona**: dolga zrna, ki rastejo nasproti toku toplote proti sredini; zmagajo tista s smerjo $\langle 100 \rangle$ vzporedno s tokom toplote;
3. **središčna enakoosna cona**: zrna iz odlomljenih vej dendritov in kali v podhlajeni sredini.

Velikost zrn zmanjšamo s hitrejšim ohlajanjem (kovinska kokila namesto peščene forme), s cepivi ali z mešanjem taline. Drobna zrna se splačajo: meje zrn ustavljajo dislokacije (črtne napake, katerih premikanje je plastična deformacija), zato po **Hall-Petchevi zvezi** meja tečenja $\sigma_y$ raste z manjšim povprečnim premerom zrn $d$:

$$\sigma_y = \sigma_0 + k\,d^{-1/2}$$

Velikost zrn izmerimo na mikroposnetku po **metodi linijskih presečišč**: čez sliko potegnemo črto dolžine $L$, preštejemo njena presečišča z mejami zrn $N$ in upoštevamo povečavo $M$. Povprečna dolžina odseka $\bar{l}$ je

$$\bar{l} = \frac{L}{N\,M}$$

## Rešeni primeri

### Primer 1: kritični radij niklja

Talina niklja je podhlajena za $319\,\mathrm{K}$. Kolikšen je kritični radij kali pri homogeni nukleaciji?

**Podatki:** $\gamma = 0{,}255\,\mathrm{J/m^2}$, $T_m = 1728\,\mathrm{K}$, $\Delta H_f = 2{,}53 \cdot 10^{9}\,\mathrm{J/m^3}$, $\Delta T = 319\,\mathrm{K}$
**Iščemo:** kritični radij $r_{kr}$

:::formula
$r_{kr} = \dfrac{2\gamma\,T_m}{\Delta H_f\,\Delta T}$
:::

**Rešitev:**

1. Števec: $2 \cdot 0{,}255 \cdot 1728 = 881{,}28$, v enotah $\mathrm{J\,K/m^2}$.
2. Imenovalec: $2{,}53 \cdot 10^{9} \cdot 319 = 8{,}0707 \cdot 10^{11}$, v enotah $\mathrm{J\,K/m^3}$.
3. Kvocient: $r_{kr} \approx 1{,}09 \cdot 10^{-9}\,\mathrm{m}$, ker se $\mathrm{J\,K}$ pokrajša in ostane $\mathrm{m}$.
4. Odgovor: kritični radij je približno $1{,}09\,\mathrm{nm}$, kar je le nekaj medatomskih razdalj.

### Primer 2: kal na steni forme

Talina železa je podhlajena za $295\,\mathrm{K}$. Kolikšna je ovira za homogeno nukleacijo in kolikšna za nukleacijo na steni forme z močitvenim kotom $40^\circ$?

**Podatki:** $\gamma = 0{,}204\,\mathrm{J/m^2}$, $T_m = 1811\,\mathrm{K}$, $\Delta H_f = 1{,}85 \cdot 10^{9}\,\mathrm{J/m^3}$, $\Delta T = 295\,\mathrm{K}$, $\theta = 40^\circ$
**Iščemo:** $\Delta G_{kr}$ in $\Delta G_{het}$

:::formula
$\Delta G_v = \dfrac{\Delta H_f\,\Delta T}{T_m}$, $\Delta G_{kr} = \dfrac{16\pi\gamma^3}{3\,\Delta G_v^2}$
$\Delta G_{het} = S\,\Delta G_{kr}$, $S = \dfrac{(2+\cos\theta)(1-\cos\theta)^2}{4}$
:::

**Rešitev:**

1. Gonilna sila: $\Delta G_v = \dfrac{1{,}85 \cdot 10^{9} \cdot 295}{1811} \approx 3{,}01 \cdot 10^{8}\,\mathrm{J/m^3}$.
2. Homogena ovira: $\Delta G_{kr} = \dfrac{16\pi \cdot 0{,}204^3}{3 \cdot (3{,}01 \cdot 10^{8})^2} \approx 1{,}57 \cdot 10^{-18}\,\mathrm{J}$.
3. Faktor oblike kapice: $\cos 40^\circ \approx 0{,}766$, zato $S = \dfrac{2{,}766 \cdot 0{,}234^2}{4} \approx 0{,}0379$.
4. Heterogena ovira: $\Delta G_{het} \approx 0{,}0379 \cdot 1{,}57 \cdot 10^{-18}\,\mathrm{J} \approx 5{,}9 \cdot 10^{-20}\,\mathrm{J}$.
5. Odgovor: na steni je ovira približno $26$-krat manjša kot sredi taline. Zato se ulitek začne strjevati ob steni in že pri majhni podhladitvi.

### Primer 3: zemljevid zrn z merilom

Mikroposnetek beremo kot planinski zemljevid: razdaljo na sliki delimo z merilom, da dobimo resnično. Iz ulitka medenine vzamemo dva vzorca. Vzorec A je s skorjaste cone, posnet pri povečavi $200\times$. Črta dolžine $100\,\mathrm{mm}$ seka $40$ mej zrn. Vzorec B je iz sredine, posnet pri $50\times$, ista črta seka $25$ mej. Za kolikšen delež je meja tečenja vzorca A večja od meje tečenja vzorca B? Za to medenino je $\sigma_0 = 25\,\mathrm{MPa}$ in $k = 12{,}5\,\mathrm{MPa\,mm^{1/2}}$. Vzemi $d \approx \bar{l}$.

**Podatki:** $L = 100\,\mathrm{mm}$; A: $N_A = 40$, $M_A = 200$; B: $N_B = 25$, $M_B = 50$; $\sigma_0 = 25\,\mathrm{MPa}$, $k = 12{,}5\,\mathrm{MPa\,mm^{1/2}}$
**Iščemo:** $\bar{l}_A$, $\bar{l}_B$, meji tečenja $\sigma_{y,A}$ in $\sigma_{y,B}$

:::formula
$\bar{l} = \dfrac{L}{N\,M}$, nato $\sigma_y = \sigma_0 + k\,d^{-1/2}$
:::

**Rešitev:**

1. Vzorec A: $\bar{l}_A = \dfrac{100\,\mathrm{mm}}{40 \cdot 200} = 0{,}0125\,\mathrm{mm}$, to je $12{,}5\,\mu\mathrm{m}$.
2. Vzorec B: $\bar{l}_B = \dfrac{100\,\mathrm{mm}}{25 \cdot 50} = 0{,}08\,\mathrm{mm}$, to je $80\,\mu\mathrm{m}$. B ima manj presečišč na sliki, še bolj pa odloča manjša povečava.
3. Meja tečenja A: $\sigma_{y,A} = 25 + \dfrac{12{,}5}{\sqrt{0{,}0125}} \approx 25 + 111{,}8 = 136{,}8\,\mathrm{MPa}$.
4. Meja tečenja B: $\sigma_{y,B} = 25 + \dfrac{12{,}5}{\sqrt{0{,}08}} \approx 25 + 44{,}2 = 69{,}2\,\mathrm{MPa}$.
5. Razmerje: $\dfrac{136{,}8}{69{,}2} \approx 1{,}98$.
6. Odgovor: zrna ob steni so okoli šestkrat drobnejša, meja tečenja je tam približno dvakrat večja (za okoli $98\,\%$).

### Primer 4: zdaj ti

Pri kolikšni podhladitvi bi bil kritični radij kali bakra $2{,}0\,\mathrm{nm}$?

**Podatki:** $\gamma = 0{,}200\,\mathrm{J/m^2}$, $T_m = 1358\,\mathrm{K}$, $\Delta H_f = 1{,}77 \cdot 10^{9}\,\mathrm{J/m^3}$, $r_{kr} = 2{,}0 \cdot 10^{-9}\,\mathrm{m}$
**Iščemo:** podhladitev $\Delta T$

:::formula
$\Delta T = \dfrac{2\gamma\,T_m}{\Delta H_f\,r_{kr}}$
:::

**Rešitev:**

1. Formulo za $r_{kr}$ preuredimo tako, da je $\Delta T$ sam na levi.
2. Števec: $2 \cdot 0{,}200 \cdot 1358 = 543{,}2$.
3. Imenovalec in kvocient izračunaj sam, nato preveri:

:::premisli
Koliko je imenovalec $1{,}77 \cdot 10^{9} \cdot 2{,}0 \cdot 10^{-9}$ in kolikšna je $\Delta T$?
---
Imenovalec je $3{,}54$, zato $\Delta T = \dfrac{543{,}2}{3{,}54} \approx 153\,\mathrm{K}$. Večji $r_{kr}$ kot pri $236\,\mathrm{K}$ ($1{,}30\,\mathrm{nm}$) pomeni manjšo podhladitev, kot pričakujemo.
:::

## Pogoste napake

- **»Kovina se začne strjevati točno pri tališču.«** Pri $T_m$ je $\Delta G_v = 0$ in $r_{kr}$ neskončen, zato ni stabilne kali. Vedno je potrebna vsaj majhna podhladitev, v ulitkih zaradi heterogene nukleacije le nekaj kelvinov.
- **»Vsak skupek trdnih atomov zraste v zrno.«** Skupki z $r < r_{kr}$ se raztopijo, ker bi rast povečala $\Delta G$. Zrno zraste le iz kali, ki preseže $r_{kr}$.
- **»Večja podhladitev da večje kali in večja zrna.«** Obratno: $r_{kr}$ in $\Delta G_{kr}$ se s podhladitvijo zmanjšata, kali je več, zrna so drobnejša.
- **»Počasno ohlajanje da drobna zrna, ker imajo atomi čas za urejanje.«** Počasno ohlajanje pomeni majhno podhladitev, malo kali in dolgo rast, torej groba zrna. Drobna zrna dobimo s hitrim ohlajanjem ali cepivi.
- **»Meje zrn so šibka mesta, zato so groba zrna boljša.«** Pri sobni temperaturi meje ustavljajo dislokacije in povečajo trdnost in žilavost (Hall-Petch). Groba zrna so ugodnejša le pri lezenju pri visoki temperaturi.

## Povzetek

- Strjevanje poteka v dveh korakih: nukleacija (nastanek kali) in rast kristalnih zrn.
- Pri kali tekmujeta prihranek prostornine $\Delta G_v$ in cena površine $\gamma$; stabilna je kal z $r > r_{kr} = \dfrac{2\gamma\,T_m}{\Delta H_f\,\Delta T}$.
- Večja podhladitev pomeni manjši $r_{kr}$, ovira $\Delta G_{kr}$ pada z $1/\Delta T^2$.
- Heterogena nukleacija (stena forme, cepiva) zmanjša oviro za faktor $S(\theta)$, zato ulitki potrebujejo le nekaj kelvinov podhladitve.
- Zrna rastejo kot dendriti, dokler ne trčijo; meje zrn ostanejo med njimi.
- Ingot ima skorjasto, stebričasto in središčno enakoosno cono.
- Drobna zrna (hitro ohlajanje, cepiva) povečajo mejo tečenja: $\sigma_y = \sigma_0 + k\,d^{-1/2}$; velikost merimo z $\bar{l} = L/(N\,M)$.

## Drugače: Z analogijo

Predstavljaj si prazno pokrajino, v katero prihajajo naseljenci. Ena sama družina ne vzdrži: preveč dela je z obrambo meja svoje parcele in prej ali slej odide. Naselje preživi šele, ko je dovolj veliko, da skupni pridelek odtehta stroške meja. To je kritični radij.

Naselja se najlažje rodijo ob rekah in cestah, kjer je del infrastrukture že pripravljen. To je heterogena nukleacija na steni forme in na cepivih. Vsako naselje se širi, dokler ne doseže ozemlja soseda. Tam nastane občinska meja, v kovini meja zrn.

Če naseljenci pridejo hkrati na mnogo krajev, je občin veliko in so majhne. Če pride le nekaj skupin in imajo dovolj časa, dobimo nekaj velikih občin. Prva slika je hitro ohlajen ulitek z drobnimi zrni, druga počasi ohlajen z grobimi.

Meja analogije: atomi ne izbirajo kraja. Kal nastane po naključju in preživi le, če po naključju preseže $r_{kr}$. Vsako zrno ima tudi svojo smer kristalne mreže, česar občine nimajo.

## Drugače: Bolj natančno

**Gonilna sila.** Na enoto prostornine velja $\Delta G_v = \Delta H_f - T\,\Delta S_f$. Pri tališču je $\Delta G_v = 0$, zato je $\Delta S_f = \Delta H_f / T_m$. Ob predpostavki, da sta $\Delta H_f$ in $\Delta S_f$ blizu tališča konstantna, sledi $\Delta G_v = \Delta H_f (T_m - T)/T_m = \Delta H_f\,\Delta T / T_m$.

**Vrh krivulje.** Kritični radij in oviro v literaturi pogosto označijo z $r^*$ in $\Delta G^*$. Iz $\dfrac{d\,\Delta G}{dr} = -4\pi r^2\,\Delta G_v + 8\pi r\,\gamma = 0$ sledi $r_{kr} = 2\gamma/\Delta G_v$. Ko ga vstavimo v $\Delta G(r)$, dobimo $\Delta G_{kr} = \dfrac{16\pi\gamma^3}{3\,\Delta G_v^2} = \dfrac{16\pi\gamma^3 T_m^2}{3\,\Delta H_f^2\,\Delta T^2}$.

**Hitrost nukleacije.** Število kali na enoto prostornine in časa je sorazmerno z $\exp(-\Delta G_{kr}/k_B T)$ ($k_B$ je Boltzmannova konstanta), pomnoženim s faktorjem za difuzijo atomov do kali. Za baker pri $\Delta T = 236\,\mathrm{K}$ je $\Delta G_{kr}/k_B T \approx 91$. Ker je ovira v eksponentu in pada z $1/\Delta T^2$, se hitrost nukleacije v ozkem intervalu podhladitve spremeni za mnogo velikostnih redov. Zato je začetek homogene nukleacije oster. Pri zelo veliki podhladitvi začne difuzija zaostajati, zato hitrost spet pade.

**Kapica.** Iz ravnovesja površinskih napetosti na stiku treh faz sledi Youngova enačba $\gamma_{FT} = \gamma_{FK} + \gamma_{KT}\cos\theta$ (F forma, K kal, T talina). Ukrivljenost kapice je enaka kot pri prosti kali, zato ima isti $r_{kr}$. Prostornina kapice je le delež $S(\theta)$ prostornine krogle, enak delež velja za oviro. Mejna primera: pri $\theta = 180^\circ$ je $S = 1$ (podlaga ne pomaga), pri $\theta \to 0$ gre $S \to 0$ (podlaga je kot že zrasel kristal).

## Preveri se

? V talini aluminija nastane skupek trdnih atomov z radijem, nekoliko večjim od kritičnega $r_{kr}$. Kaj se z njim najverjetneje zgodi?
- Raztopi se, ker je še vedno premajhen za trdno fazo.
~ To velja za skupke z $r < r_{kr}$. Nad $r_{kr}$ rast zmanjšuje $\Delta G$.
+ Raste naprej, ker vsak dodatni atom zmanjša prosto energijo.
- Ostane enako velik, ker je v ravnovesju s talino.
~ Pri $r_{kr}$ je ravnovesje nestabilno, kot kroglica na vrhu hriba. Že malo večji skupek »zdrsne« v rast.
> Za $r > r_{kr}$ krivulja $\Delta G(r)$ pada, zato je rast energijsko ugodna: skupek je stabilna kal.

? Razvrsti cone prečnega prereza ingota od stene forme proti sredini.
- stebričasta – skorjasta – središčna enakoosna
~ Stebričasta zrna rastejo iz zrn ob steni, zato ne morejo biti prva. Ob hladni steni so najprej drobna zrna.
+ skorjasta – stebričasta – središčna enakoosna
- središčna enakoosna – stebričasta – skorjasta
~ To je vrstni red od sredine proti steni, obratno od vprašanja.
> Ob hladni steni nastane veliko kali (skorjasta cona), nato zrna rastejo nasproti toku toplote (stebričasta), v sredini pa nastanejo enakoosna zrna iz kali in odlomljenih dendritov.

? Kaj se zgodi z velikostjo zrn, če isto zlitino namesto v peščeno formo ulijemo v jekleno kokilo?
- Zrna so večja, ker kovina hitreje odvaja toploto in kali hitreje rastejo.
~ Hitrejše odvajanje toplote pomeni predvsem večjo podhladitev in več kali, ne hitrejšo rast posameznega zrna v večje.
- Velikost zrn se ne spremeni, ker je odvisna samo od sestave zlitine.
~ Sestava vpliva, a pri isti sestavi odloča hitrost ohlajanja.
+ Zrna so drobnejša, ker je podhladitev večja in kali več.
> Kokila hitro odvaja toploto, podhladitev je večja, $r_{kr}$ in $\Delta G_{kr}$ sta manjša, kali je več in zrna so drobnejša.

? Pri podhladitvi $100\,\mathrm{K}$ je kritični radij kali $2\,\mathrm{nm}$. Kolikšen je pri podhladitvi $200\,\mathrm{K}$?
- $4\,\mathrm{nm}$
~ To bi veljalo, če bi bil $r_{kr}$ sorazmeren s $\Delta T$. Podhladitev je v imenovalcu.
- $0{,}5\,\mathrm{nm}$
~ S kvadratom $\Delta T$ pada ovira $\Delta G_{kr}$, ne radij.
+ $1\,\mathrm{nm}$
> $r_{kr} = \dfrac{2\gamma\,T_m}{\Delta H_f\,\Delta T}$ je obratno sorazmeren s $\Delta T$: dvakrat večja podhladitev da pol manjši radij.

? Na mikroposnetku pri povečavi $100\times$ seka črta dolžine $50\,\mathrm{mm}$ skupno $20$ mej zrn. Kolikšna je povprečna dolžina odseka $\bar{l}$?
- $2{,}5\,\mathrm{mm}$
~ To je razdalja na sliki. Kot pri zemljevidu jo moraš deliti z merilom (povečavo).
+ $25\,\mu\mathrm{m}$
- $250\,\mu\mathrm{m}$
~ Tako dobiš, če deliš z $10$ namesto s $100$. Povečava $100\times$ pomeni deljenje s $100$.
> $\bar{l} = \dfrac{50\,\mathrm{mm}}{20 \cdot 100} = 0{,}025\,\mathrm{mm} = 25\,\mu\mathrm{m}$.

:::simboli
\Delta G | sprememba Gibbsove proste energije pri nastanku kali | \Delta G = -\tfrac{4}{3}\pi r^3\,\Delta G_v + 4\pi r^2\,\gamma | J
r | radij skupka (kali) | | m
\Delta G_v | prihranek proste energije na enoto prostornine | \Delta G_v = \dfrac{\Delta H_f\,\Delta T}{T_m} | J/m^3 | gonilna sila strjevanja
\gamma | površinska energija meje trdno–talina | | J/m^2
\Delta H_f | talilna toplota na enoto prostornine | | J/m^3
\Delta T | podhladitev | \Delta T = T_m - T | K
T_m | tališče | | K
r_{kr} | kritični radij kali | r_{kr} = \dfrac{2\gamma}{\Delta G_v} | m
\Delta G_{kr} | energijska ovira za homogeno nukleacijo | \Delta G_{kr} = \dfrac{16\pi\gamma^3}{3\,\Delta G_v^2} | J
\Delta G_{het} | energijska ovira za heterogeno nukleacijo | \Delta G_{het} = S\,\Delta G_{kr} | J
S | faktor oblike kapice | S = \dfrac{(2+\cos\theta)(1-\cos\theta)^2}{4} | – | med $0$ in $1$
\theta | močitveni kot | | ° | kot med kapico in podlago
\pi | število pi | |
\sigma_y | meja tečenja | \sigma_y = \sigma_0 + k\,d^{-1/2} | MPa
\sigma_0 | meja tečenja pri zelo grobih zrnih | | MPa | snovna konstanta
k | Hall-Petcheva konstanta | | MPa\,mm^{1/2}
d | povprečni premer zrn | | mm | tu $d \approx \bar{l}$
\bar{l} | povprečna dolžina odseka | \bar{l} = \dfrac{L}{N\,M} | mm
L | dolžina črte na sliki | | mm
N | število presečišč z mejami zrn | | –
M | povečava | | –
:::
