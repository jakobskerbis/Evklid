---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1897 je Ferdinand Braun v stekleno cev usmeril curek elektronov in ga odklonil z merjeno napetostjo. Svetla pika na zaslonu je prvič pokazala, kako se napetost spreminja s časom. Prvi osciloskopi s prostotekočim časovnim odklonom pa niso dali mirne slike: pri vsakem preletu zaslona je krivulja začela na drugem mestu in slika je drsela. Pravi preboj so prinesli šele osciloskopi s **proženjem**, ki prelet začnejo vedno v isti točki signala. Od takrat se na zaslonu ponavljajoč signal ustavi, kot bi ga fotografirali.

V kemijskem laboratoriju osciloskop odgovori na vprašanja, ki jih voltmeter ne more: ali ultrazvočna kopel res niha s $40\,\mathrm{kHz}$, zakaj pH-meter kaže nemirno vrednost, kako hitro naraste svetlobni impulz pri meritvi fluorescence. Voltmeter da eno število, osciloskop pa celo obliko signala in, če ga preklopimo v **frekvenčni prikaz**, tudi iz katerih frekvenc je signal sestavljen.

## Razlaga

### Najprej en zaslon

Na zaslonu je mreža z $10$ razdelki vodoravno in $8$ navpično. Recimo, da vidimo sinusni signal, ki se od dna do vrha razteza čez $4{,}6$ razdelka, ena perioda pa traja $5{,}0$ razdelka. Gumb za navpično os kaže $20\,\mathrm{V/razdelek}$, gumb za časovno os $5\,\mu\mathrm{s/razdelek}$.

- Napetost od temena do temena: $4{,}6 \cdot 20\,\mathrm{V} = 92\,\mathrm{V}$.
- Perioda: $5{,}0 \cdot 5\,\mu\mathrm{s} = 25\,\mu\mathrm{s}$, torej frekvenca $40\,\mathrm{kHz}$.

Vse, kar na zaslonu preberemo, je **število razdelkov krat nastavitev**. Iz tega primera sledijo splošna pravila.

**Definicija.** Osciloskop v **časovnem prikazu** riše napetost $u(t)$: navpični odklon je sorazmeren z napetostjo (občutljivost $k_y$ v $\mathrm{V/razdelek}$), vodoravni s časom (časovna baza $k_x$ v $\mathrm{s/razdelek}$). Iz odčitkov dobimo

$$u = k_y \cdot y$$

$$t = k_x \cdot x$$

kjer sta $y$ in $x$ odčitka v razdelkih. Iz periode dobimo frekvenco $f = 1/T$.

Iz napetosti od temena do temena $U_{pp}$ dobimo temensko vrednost $U_p = U_{pp}/2$. Za sinusni signal je efektivna vrednost $U_p/\sqrt{2}$, za druge oblike pa ne: zato sodobni osciloskopi efektivno vrednost računajo iz vzorcev.

```
 |<---- 10 razdelkov ---->|
 +------------------------+
 |  .-.     .-.     .-.   |
 |-*---\---/---\---/---\--|
 |      '-'     '-'     '-|
 +------------------------+
 * prožitev: nivo in naklon
```

### Proženje: zakaj slika stoji

Signal se ponavlja, zaslon pa se riše vedno znova. Če bi vsak prelet začel ob naključnem trenutku, bi se krivulje prekrivale z zamikom in slika bi drsela.

**Definicija.** **Proženje** (trigger) je pogoj, ki sproži zajem: signal izbranega vira mora prečkati **nivo proženja** v izbrani smeri (**naklon**: naraščajoči ali padajoči). Točka proženja leži vedno na istem mestu zaslona, zato vsak prelet nariše isti del periode.

Načini proženja:

- **samodejni** (AUTO): če pogoj ne nastopi v nekaj desetinkah sekunde, osciloskop vseeno riše; vidimo vsaj ničelno črto;
- **normalni** (NORMAL): riše le ob izpolnjenem pogoju; ob odsotnem signalu ostane zadnja slika;
- **enkratni** (SINGLE): zajame en dogodek in se ustavi, primerno za enkratne impulze.

Če je nivo nad najvišjo vrednostjo signala, pogoj ni nikoli izpolnjen: v normalnem načinu zaslon zamrzne, v samodejnem pa slika drsi. Pri signalu z več podobnimi prečkanji v periodi (na primer impulzni niz) pomaga **zadržanje** (holdoff): po prožitvi osciloskop določen čas ne sprejme novega pogoja.

:::premisli
Na vhodu je sinus z $1\,\mathrm{V}$ temenske vrednosti, nivo proženja pa nastavimo na $1{,}5\,\mathrm{V}$. Kaj se zgodi v samodejnem in kaj v normalnem načinu?
---
Signal nivoja nikoli ne doseže, zato pogoj ni izpolnjen. V samodejnem načinu osciloskop po izteku čakanja riše brez proženja in slika drsi. V normalnem čaka in kaže zadnjo zajeto sliko ali nič. Rešitev je nivo znotraj območja signala.
:::

### Sklopitev in sonda

**Sklopitev** DC pokaže celoten signal. Sklopitev AC doda zaporedni kondenzator, ki odreže enosmerno komponento: tako lahko majhno valovitost ($50\,\mathrm{mV}$) na napajalni napetosti $12\,\mathrm{V}$ povečamo čez ves zaslon. AC sklopitev je visokoprepustni filter z mejno frekvenco nekaj hercev; počasne spremembe zato popači.

Vhod osciloskopa ima upornost $1\,\mathrm{M\Omega}$ in vzporedno okoli $15$ do $20\,\mathrm{pF}$ kapacitivnosti. Merjenca zato obremeni, podobno kot voltmeter pri U-I metodi. **Sonda 10:1** ima v konici upor $9\,\mathrm{M\Omega}$; z vhodom tvori delilnik, ki signal zmanjša desetkrat, obremenitev pa desetkrat zmanjša. Vzporedno uporu v konici je nastavljiv kondenzator.

**Izrek (kompenzirani delilnik).** Delilnik iz $R_1 \parallel C_1$ (konica) in $R_2 \parallel C_2$ (vhod) ima za vse frekvence enako razmerje $R_2/(R_1 + R_2)$ natanko tedaj, ko velja

$$R_1 C_1 = R_2 C_2.$$

*Dokaz.* Admitanci vej sta $Y_1 = 1/R_1 + \mathrm{j}\omega C_1$ in $Y_2 = 1/R_2 + \mathrm{j}\omega C_2$. Razmerje napetosti je $Y_1/(Y_1 + Y_2)$. To je neodvisno od $\omega$, če je $Y_2$ za vse $\omega$ isti večkratnik $Y_1$: $1/R_2 = m/R_1$ in $C_2 = mC_1$. Iz obeh sledi $m = R_1/R_2 = C_2/C_1$, torej $R_1C_1 = R_2C_2$. Obratno, če pogoj velja, je razmerje povsod $1/(1 + m) = R_2/(R_1 + R_2)$.

Sondo kompenziramo na pravokotnem signalu, ki ga da osciloskop sam: ravni vrhovi pomenijo pravilno nastavitev, prenihaji ali zaobljeni robovi pa napačno.

### Pasovna širina in čas vzpona

Vhodni ojačevalnik ne prenese poljubno hitrih sprememb. **Pasovna širina** $B$ je frekvenca, pri kateri amplituda sinusa pade na $1/\sqrt{2}$ (za $3\,\mathrm{dB}$). Hitro stopnico osciloskop pokaže s končnim **časom vzpona** $t_r$ (od $10\,\%$ do $90\,\%$ končne vrednosti).

**Izpeljava** za sistem prvega reda (nizkoprepustni RC). Odziv na stopnico je $1 - \mathrm{e}^{-t/\tau}$. Do $10\,\%$ preteče $\tau \ln(10/9)$, do $90\,\%$ pa $\tau \ln 10$; razlika je $\tau \ln 9 \approx 2{,}2\,\tau$. Mejna frekvenca je $B = 1/(2\pi\tau)$, zato

$$t_r = \frac{\ln 9}{2\pi B} \approx \frac{0{,}35}{B}.$$

Če zaporedno delujeta signal s časom vzpona $t_s$ in osciloskop s $t_o$, je izmerjeni čas približno $t_m = \sqrt{t_s^2 + t_o^2}$.

### Digitalni osciloskop in frekvenčni prikaz

Digitalni osciloskop signal **vzorči** z vzorčevalno frekvenco $f_s$ in shrani $N$ vzorcev (globina pomnilnika). Okno zajema traja $T_z = N/f_s$.

**Izrek (o vzorčenju).** Če signal nima komponent nad frekvenco $f_{max}$ in je $f_s > 2 f_{max}$, ga vzorci natančno določajo. Komponenta s frekvenco $f$ nad $f_s/2$ se pokaže na napačni, **zrcaljeni** frekvenci $|f - k f_s|$ (najbližja vrednost za celo število $k$). Pojavu pravimo **prekrivanje** (aliasing).

**Frekvenčni prikaz** (FFT) iz istih vzorcev izračuna spekter: amplitude posameznih frekvenc. Prikaz sega do $f_s/2$, razmik med sosednjima frekvencama pa je **frekvenčna ločljivost**

$$\Delta f = \frac{f_s}{N} = \frac{1}{T_z}.$$

Daljše okno da finejšo ločljivost. Če v okno ne pade celo število period, se energija ene frekvence razleze na sosednje (**uhajanje spektra**); to omilimo z oknom (na primer Hannovim), ki konca zapisa zmehča.

Pravokotni signal z amplitudo $A$ ima v spektru le lihe harmonske komponente z amplitudami $4A/(n\pi)$: $1{,}27\,A$; $0{,}42\,A$; $0{,}25\,A$ … V časovnem prikazu vidimo obliko, v frekvenčnem sestavo.

:::premisli
Zapis s $10\,000$ vzorci in $f_s = 100\,\mathrm{kS/s}$ ima ločljivost $10\,\mathrm{Hz}$. Ali bi z $10$-krat večjo vzorčevalno frekvenco (pri enakem $N$) bolje ločili brnenje pri $50\,\mathrm{Hz}$ od $60\,\mathrm{Hz}$?
---
Ne, slabše. $\Delta f = f_s/N$ bi narasla na $100\,\mathrm{Hz}$, ker bi okno trajalo le $10\,\mathrm{ms}$. Višja $f_s$ razširi prikaz navzgor, ločljivost pa določa le dolžina okna.
:::

## Rešeni primeri

### Primer 1 (lažji)

Ultrazvočno kopel v laboratoriju poganja piezoelektrični pretvornik. Na njegove sponke priključimo sondo 10:1, osciloskop je nastavljen za to sondo. Pri $20\,\mathrm{V/razdelek}$ in $5\,\mu\mathrm{s/razdelek}$ sinusni signal sega čez $4{,}6$ razdelka od temena do temena, perioda pa je $5{,}0$ razdelka. Kolikšni so frekvenca, temenska in efektivna napetost?

**Podatki:** $k_y = 20\,\mathrm{V/razdelek}$, $k_x = 5\,\mu\mathrm{s/razdelek}$, $y_{pp} = 4{,}6$ razdelka, $x_T = 5{,}0$ razdelka, sinusna oblika
**Iščemo:** $f$, $U_p$, $U_{ef}$

:::formula
$u = k_y \cdot y$, $t = k_x \cdot x$, $f = \dfrac{1}{T}$, $U_{ef} = \dfrac{U_p}{\sqrt{2}}$ (sinus)
:::

**Rešitev:**

1. Perioda: $T = 5{,}0 \cdot 5\,\mu\mathrm{s} = 25\,\mu\mathrm{s}$.
2. Frekvenca: $f = 1/(25 \cdot 10^{-6}\,\mathrm{s}) = 40\,000\,\mathrm{Hz} = 40\,\mathrm{kHz}$.
3. Od temena do temena: $U_{pp} = 4{,}6 \cdot 20\,\mathrm{V} = 92\,\mathrm{V}$, temenska vrednost je polovica: $U_p = 46\,\mathrm{V}$.
4. Signal je sinusen, zato $U_{ef} = 46\,\mathrm{V}/\sqrt{2} \approx 32{,}5\,\mathrm{V}$.
5. Odgovor: pretvornik niha s $40\,\mathrm{kHz}$, temenska napetost je $46\,\mathrm{V}$, efektivna okoli $32{,}5\,\mathrm{V}$.

### Primer 2

Pri meritvi fluorescence laserski impulz vzbudi vzorec, fotodioda pa da napetostni impulz. Na osciloskopu s pasovno širino $100\,\mathrm{MHz}$ izmerimo čas vzpona $4{,}2\,\mathrm{ns}$. Kolikšen je pravi čas vzpona impulza? Kolikšno pasovno širino bi moral imeti osciloskop, da bi bil njegov čas vzpona trikrat krajši od pravega?

**Podatki:** $B = 100\,\mathrm{MHz}$, $t_m = 4{,}2\,\mathrm{ns}$, želeno razmerje $t_s/t_o = 3$
**Iščemo:** pravi čas vzpona $t_s$, potrebno pasovno širino $B'$

:::formula
$t_o \approx \dfrac{0{,}35}{B}$, $t_m = \sqrt{t_s^2 + t_o^2}$
:::

**Rešitev:**

1. Čas vzpona osciloskopa: $t_o = 0{,}35/(100 \cdot 10^6\,\mathrm{Hz}) = 3{,}5\,\mathrm{ns}$. Je skoraj tako dolg kot izmerjeni, zato ga ne smemo zanemariti.
2. Izrazimo pravi čas: $t_s = \sqrt{t_m^2 - t_o^2} = \sqrt{4{,}2^2 - 3{,}5^2}\,\mathrm{ns} \approx 2{,}32\,\mathrm{ns}$.
3. Želeni čas vzpona osciloskopa: $t_o' = 2{,}32/3\,\mathrm{ns} \approx 0{,}77\,\mathrm{ns}$.
4. Potrebna pasovna širina: $B' = 0{,}35/(0{,}77 \cdot 10^{-9}\,\mathrm{s}) \approx 4{,}5 \cdot 10^8\,\mathrm{Hz}$, okoli $450\,\mathrm{MHz}$.
5. Odgovor: impulz naraste v okoli $2{,}3\,\mathrm{ns}$; izmerjeni $4{,}2\,\mathrm{ns}$ sta večinoma posledica osciloskopa. Za zanesljivo meritev potrebujemo vsaj okoli $450\,\mathrm{MHz}$ (v praksi $500\,\mathrm{MHz}$).

### Primer 3 (težji)

Impedanco prevodnostne celice merimo pri $1\,\mathrm{kHz}$. Generator, celica in merilni upor $R_s = 100\,\Omega$ so vezani zaporedno; spodnji konec $R_s$ je na masi. Kanal 1 meri napetost na celici in uporu skupaj, kanal 2 napetost na $R_s$. Pri $100\,\mu\mathrm{s/razdelek}$ odčitamo: amplituda kanala 1 je $2{,}40\,\mathrm{V}$, kanala 2 pa $0{,}50\,\mathrm{V}$; signal kanala 2 prehiteva kanal 1 za $0{,}5$ razdelka. Odčitek časa je negotov za $\pm 0{,}1$ razdelka. Določi fazni kot, upornost in kapacitivnost celice (model: zaporedni $R_c$ in $C$) ter oceni, kako negotov je $C$.

**Podatki:** $f = 1\,\mathrm{kHz}$, $R_s = 100\,\Omega$, $U_1 = 2{,}40\,\mathrm{V}$, $U_2 = 0{,}50\,\mathrm{V}$, $k_x = 100\,\mu\mathrm{s/razdelek}$, $x_{\Delta} = 0{,}5$ razdelka (kanal 2 prehiteva), negotovost $\pm 0{,}1$ razdelka
**Iščemo:** $\varphi$, $R_c$, $C$, razpon $C$

:::formula
$\varphi = 360^\circ \cdot \dfrac{\Delta t}{T}$, $I = \dfrac{U_2}{R_s}$, $Z = \dfrac{U_1}{I}$, $R_s + R_c = Z\cos\varphi$, $X_C = Z\sin\varphi = \dfrac{1}{2\pi f C}$
:::

**Rešitev:**

1. Zakaj tako vezje: osciloskop ima obe masi skupaj, zato lahko merimo le napetosti proti masi. Tok dobimo iz napetosti na $R_s$, ki je v fazi s tokom.
2. Časovni zamik: $\Delta t = 0{,}5 \cdot 100\,\mu\mathrm{s} = 50\,\mu\mathrm{s}$; perioda je $T = 1\,\mathrm{ms}$.
3. Fazni kot: $\varphi = 360^\circ \cdot 50/1000 = 18^\circ$. Tok prehiteva napetost, zato je vezje kapacitivno.
4. Tok: $I = 0{,}50\,\mathrm{V}/100\,\Omega = 5{,}0\,\mathrm{mA}$ (amplituda).
5. Impedanca celote: $Z = 2{,}40\,\mathrm{V}/0{,}0050\,\mathrm{A} = 480\,\Omega$.
6. Delovni del: $Z\cos 18^\circ \approx 456{,}5\,\Omega$; od tega odštejemo merilni upor: $R_c \approx 456{,}5\,\Omega - 100\,\Omega = 356{,}5\,\Omega$.
7. Jalovi del: $X_C = Z\sin 18^\circ \approx 148{,}3\,\Omega$, zato $C = 1/(2\pi \cdot 1000 \cdot 148{,}3)\,\mathrm{F} \approx 1{,}07\,\mu\mathrm{F}$.
8. Negotovost: $\pm 0{,}1$ razdelka je $\pm 10\,\mu\mathrm{s}$ oziroma $\pm 3{,}6^\circ$. Za $\varphi = 14{,}4^\circ$ dobimo $C \approx 1{,}33\,\mu\mathrm{F}$, za $21{,}6^\circ$ pa $C \approx 0{,}90\,\mu\mathrm{F}$.
9. Odgovor: celica ima $R_c \approx 357\,\Omega$ in $C \approx 1{,}07\,\mu\mathrm{F}$, a z odčitkom na pol razdelka je $C$ negotov za okoli $+24\,\%$ oziroma $-16\,\%$ (približno $\pm 20\,\%$). Bolje je raztegniti časovno os ali uporabiti samodejno merjenje faze.

### Primer 4 – zdaj ti

Brnenje na signalu pH-metra posnamemo z $f_s = 100\,\mathrm{kS/s}$ in $N = 10\,000$ vzorci ter pogledamo spekter. Kolikšni sta dolžina okna in frekvenčna ločljivost? Do katere frekvence sega prikaz? Kje v spektru se pokaže motnja stikalnega napajalnika pri $75\,\mathrm{kHz}$, če je ne odstranimo s filtrom?

**Podatki:** $f_s = 100\,\mathrm{kS/s}$, $N = 10\,000$, motnja $f_m = 75\,\mathrm{kHz}$
**Iščemo:** $T_z$, $\Delta f$, zgornjo mejo prikaza, prikazano frekvenco motnje

:::formula
$T_z = \dfrac{N}{f_s}$, $\Delta f = \dfrac{1}{T_z}$, prikaz do $\dfrac{f_s}{2}$, zrcaljena frekvenca $|f - k f_s|$
:::

**Rešitev:**

1. Dolžina okna: $T_z = 10\,000/100\,000\,\mathrm{s} = 0{,}1\,\mathrm{s}$.
2. Ločljivost: $\Delta f = 1/0{,}1\,\mathrm{s} = 10\,\mathrm{Hz}$; brnenje pri $50\,\mathrm{Hz}$ in njegove harmonske komponente so ločene črte.
3. Zadnja koraka naredi sam: do kod sega prikaz in kje se pokaže motnja?

:::premisli
Kolikšna je zgornja meja in kje je motnja?
---
Prikaz sega do $f_s/2 = 50\,\mathrm{kHz}$. Motnja pri $75\,\mathrm{kHz}$ je nad to mejo, zato se zrcali: $|75 - 100|\,\mathrm{kHz} = 25\,\mathrm{kHz}$. V spektru vidimo črto pri $25\,\mathrm{kHz}$, ki je v resnici ni. Pomaga protiprekrivni filter pred vzorčenjem ali višja $f_s$.
:::

## Pogoste napake

- **Pozabljena nastavitev sonde.** Sonda 10:1 na vhodu, nastavljenem za 1:1, pokaže desetkrat premajhno napetost. Preden beremo, preverimo, ali osciloskop ve, katera sonda je priključena.
- **$U_{pp}$ namesto $U_p$.** Iz višine od dna do vrha dobimo $U_{pp}$; temenska vrednost je polovica, efektivna pri sinusu še $\sqrt{2}$-krat manjša. Kdor vzame $92\,\mathrm{V}/\sqrt{2}$, dobi dvakrat preveč.
- **Pasovna širina enaka frekvenci signala.** »Osciloskop s $100\,\mathrm{MHz}$ zadošča za sinus s $100\,\mathrm{MHz}$« ne drži: pri $B$ je amplituda že za $29\,\%$ premajhna, pravokotni signal pa potrebuje še višje harmonske komponente. Pravilo: $B$ vsaj $3$- do $5$-krat nad najvišjo pomembno frekvenco.
- **Večja $f_s$ za boljšo ločljivost spektra.** Ločljivost FFT je $1/T_z$; določa jo dolžina okna, ne gostota vzorcev.
- **Dve masi na različnih točkah.** Masi obeh kanalov sta v osciloskopu povezani (in prek ozemljitve z omrežjem). Če masni priključek sonde pritrdimo na točko, ki ni na masi vezja, jo kratko sklenemo.

## Povzetek

- Časovni prikaz: $u = k_y y$, $t = k_x x$; iz periode $f = 1/T$; $U_p = U_{pp}/2$, pri sinusu $U_{ef} = U_p/\sqrt{2}$.
- Proženje: nivo in naklon določita, kje zajem začne; načini samodejni, normalni, enkratni; zadržanje za zapletene signale.
- Sklopitev AC odreže enosmerno komponento; sonda 10:1 zmanjša obremenitev, kompenzirana je pri $R_1C_1 = R_2C_2$.
- Pasovna širina in čas vzpona: $t_r \approx 0{,}35/B$; izmerjeni $t_m \approx \sqrt{t_s^2 + t_o^2}$.
- Fazni zamik dveh kanalov: $\varphi = 360^\circ \cdot \Delta t/T$.
- Digitalno: $T_z = N/f_s$; vzorčenje zahteva $f_s > 2f_{max}$, sicer prekrivanje na $|f - kf_s|$.
- Frekvenčni prikaz (FFT): sega do $f_s/2$, ločljivost $\Delta f = 1/T_z$; okno zmanjša uhajanje spektra.

## Za izpit

Znati moraš povedati:

- kako iz zaslona odčitaš napetost, periodo, frekvenco in fazni zamik ter kaj pomeni efektivna vrednost pri nesinusnem signalu;
- definicijo proženja, nivoja in naklona ter razlike med samodejnim, normalnim in enkratnim načinom;
- pogoj kompenzacije sonde z dokazom in kako se napačna kompenzacija vidi na pravokotnem signalu;
- izpeljavo $t_r \approx 0{,}35/B$ za sistem prvega reda in zvezo $t_m = \sqrt{t_s^2 + t_o^2}$;
- izrek o vzorčenju, prekrivanje ter od česa sta odvisni frekvenčna ločljivost in zgornja meja FFT.

### Naloga 1

Sonda 10:1 ima v konici upor $R_1 = 9\,\mathrm{M\Omega}$ z nastavljivim kondenzatorjem $C_1$. Vhod osciloskopa ima $R_2 = 1\,\mathrm{M\Omega}$ in $C_2 = 20\,\mathrm{pF}$ (kabel vštet). a) Kolikšen mora biti $C_1$? b) Kolikšna je impedanca, ki jo kompenzirana sonda pokaže merjencu pri $10\,\mathrm{MHz}$ (upornost zanemari, ker je mnogo večja)? c) Kondenzator je pomotoma nastavljen na $3\,\mathrm{pF}$. Na sondo pripeljemo pravokotni signal od $0$ do $5\,\mathrm{V}$. Kakšna je napetost na vhodu tik po robu in v ustaljenem stanju, za koliko odstotkov rob prenihi in s katero časovno konstanto se prenihaj umiri?

**Rešitev:**

1. a) Pogoj kompenzacije: $C_1 = R_2C_2/R_1 = 10^6 \cdot 20 \cdot 10^{-12}/(9 \cdot 10^6)\,\mathrm{F} \approx 2{,}22\,\mathrm{pF}$.
2. b) Pri visokih frekvencah prevladujeta kondenzatorja, vezana zaporedno: $C = C_1C_2/(C_1 + C_2) = 2{,}0\,\mathrm{pF}$.
3. Reaktanca: $X = 1/(2\pi \cdot 10^7 \cdot 2{,}0 \cdot 10^{-12})\,\Omega \approx 7{,}96\,\mathrm{k\Omega}$. Pri $10\,\mathrm{MHz}$ sonda merjenec obremeni z okoli $8\,\mathrm{k\Omega}$, ne z $10\,\mathrm{M\Omega}$.
4. c) Tik po robu se napetost razdeli kapacitivno: $C_1/(C_1 + C_2) = 3/23 \approx 0{,}130$, torej $5\,\mathrm{V} \cdot 0{,}130 \approx 0{,}65\,\mathrm{V}$.
5. V ustaljenem stanju odloča uporovni delilnik: $5\,\mathrm{V} \cdot 1/10 = 0{,}50\,\mathrm{V}$.
6. Prenihaj: $0{,}65/0{,}50 - 1 \approx 0{,}30$, torej okoli $30\,\%$ (točno $30{,}4\,\%$).
7. Napetost se umiri s časovno konstanto, ki jo določata vzporedni upornosti in vsota kapacitivnosti (Theveninova upornost z vidika kondenzatorjev): $\tau = (R_1 \parallel R_2)(C_1 + C_2) = 0{,}9\,\mathrm{M\Omega} \cdot 23\,\mathrm{pF} \approx 20{,}7\,\mu\mathrm{s}$.
8. Odgovor: $C_1 \approx 2{,}22\,\mathrm{pF}$; pri $10\,\mathrm{MHz}$ je obremenitev okoli $8\,\mathrm{k\Omega}$; pri $3\,\mathrm{pF}$ rob skoči na $0{,}65\,\mathrm{V}$ ($30\,\%$ prenihaja) in se v nekaj deset mikrosekundah ($\tau \approx 21\,\mu\mathrm{s}$) spusti na $0{,}50\,\mathrm{V}$ – na zaslonu vidimo konice na začetku vsakega vrha.

### Naloga 2

Izpelji čas vzpona sistema prvega reda in pokaži, da je $t_r \approx 0{,}35/B$. Utemelji, kolikokrat krajši mora biti čas vzpona osciloskopa od časa vzpona signala, da je izmerjeni čas daljši od pravega za največ $5\,\%$ (privzemi $t_m = \sqrt{t_s^2 + t_o^2}$).

**Rešitev:**

1. Nizkoprepustni sistem prvega reda ima prenosno funkcijo $1/(1 + \mathrm{j}\omega\tau)$; njen modul pade na $1/\sqrt{2}$ pri $\omega\tau = 1$, torej $B = 1/(2\pi\tau)$.
2. Odziv na enotsko stopnico je $1 - \mathrm{e}^{-t/\tau}$. Vrednost $0{,}1$ doseže pri $t_1 = \tau\ln(10/9)$, vrednost $0{,}9$ pri $t_2 = \tau\ln 10$.
3. $t_r = t_2 - t_1 = \tau\ln 9 \approx 2{,}197\,\tau$.
4. Vstavimo $\tau = 1/(2\pi B)$: $t_r = \ln 9/(2\pi B) \approx 0{,}350/B$.
5. Naj bo $t_s = k\,t_o$. Relativna napaka je $t_m/t_s - 1 = \sqrt{1 + 1/k^2} - 1$.
6. Pogoj $\sqrt{1 + 1/k^2} \le 1{,}05$ da $1/k^2 \le 1{,}1025 - 1 = 0{,}1025$, torej $k \ge 3{,}12$.
7. Preverba: pri $k = 3$ je napaka $5{,}4\,\%$, pri $k = 5$ pa $2{,}0\,\%$.
8. Odgovor: $t_r = \ln 9/(2\pi B) \approx 0{,}35/B$; osciloskop mora biti vsaj okoli $3$-krat hitrejši od signala za napako do $5\,\%$, za napako okoli $2\,\%$ pa $5$-krat.

## Drugače: Z analogijo

Osciloskop je kot **stroboskop** na vrtečem se kolesu. Če blisk sveti vedno, ko je ventil kolesa na vrhu, kolo navidez stoji: to je proženje. Če blisk sveti ob naključnih trenutkih, vidimo zmazano sliko: to je slika brez proženja.

Ista analogija pojasni prekrivanje. Če blisk sveti malo manj kot enkrat na obrat, kolo navidez počasi teče naprej; če malo več, navidez teče nazaj. Digitalni osciloskop z $f_s$, ki je prenizka, vidi hiter signal kot počasnega, natanko kot oko vidi hitro kolo pod stroboskopom.

Pasovna širina je kot vztrajnost kazalca: težak kazalec ne sledi hitrim sunkom, zato vsak hiter rob zabriše v počasnejši vzpon.

## Drugače: Bolj natančno

**Lissajousove krivulje.** V načinu XY en kanal odklanja vodoravno, drugi navpično. Za dva sinusa iste frekvence z amplitudama $A$ in $B$ ter faznim zamikom $\varphi$ nastane elipsa. Kjer seka navpično os, je $y_0 = B\sin\varphi$, zato $\sin\varphi = y_0/B$. Pri razmerju frekvenc $2:1$ nastane osmica; število dotikov z vodoravnim in navpičnim robom da razmerje frekvenc.

**Efektivna vrednost iz vzorcev.** Digitalni osciloskop računa $U_{ef} = \sqrt{\frac{1}{N}\sum u_i^2}$ prek celega števila period. Če okno ne zajame celih period, je rezultat malo napačen; zato osciloskop ponudi izračun »po ciklih«.

**Ločljivost amplitude.** Analogno-digitalni pretvornik z $8$ biti razdeli zaslon na $256$ stopenj; pri $8$ razdelkih je to $32$ stopenj na razdelek. Majhen signal zato povečamo čez ves zaslon (manjši $\mathrm{V/razdelek}$), sicer ga zrnatost pretvornika popači. Visoko ločljivi osciloskopi imajo $12$ bitov.

**Okna FFT.** Pravokotno okno ima najožji vrh, a največje uhajanje; Hannovo okno zmanjša uhajanje na račun nekoliko širšega vrha; okno »flat top« da najbolj natančno amplitudo. Izbira je kompromis med ločljivostjo in natančnostjo amplitude.

## Drugače: Uporaba v stroki

- **Elektrokemija.** Pri ciklični voltametriji in impulznih metodah osciloskop pokaže, ali potenciostat sledi stopnicam napetosti brez prenihajev; sicer so izmerjeni tokovi napačni.
- **Kemijska kinetika z bliskovno fotolizo.** Prehodna absorpcija po laserskem blisku traja od nanosekund do milisekund; osciloskop v enkratnem načinu zajame celoten upad, iz katerega se izračuna hitrostna konstanta. Pasovna širina mora biti dovolj velika (Primer 2).
- **Iskanje motenj.** FFT pokaže, ali nemir pH-metra ali spektrofotometra prihaja iz omrežja ($50\,\mathrm{Hz}$ in lihe harmonske komponente) ali iz stikalnega napajalnika (desetine kHz); od tega je odvisen ukrep: ozemljitev, oklop ali filter.
- **Elektronika in energetika.** Inženirji z osciloskopom preverjajo čase preklopa tranzistorjev, valovitost napajalnikov in harmonske komponente tokov; standardi kakovosti omrežja omejujejo prav te komponente.

## Preveri se

? Kateri podatek **ne** spada med nastavitve proženja?
- nivo proženja
~ Nivo je napetost, ki jo mora signal prečkati, da se zajem začne; je osnovna nastavitev proženja.
- naklon (naraščajoči ali padajoči)
~ Naklon pove, v kateri smeri mora signal prečkati nivo; brez njega bi bili v periodi dve točki proženja.
+ občutljivost v $\mathrm{V/razdelek}$
- zadržanje (holdoff)
~ Zadržanje je čas po prožitvi, ko osciloskop ne sprejme novega pogoja; spada med nastavitve proženja.
> Občutljivost določa velikost slike v navpični smeri, ne trenutka začetka zajema.

? Na zaslonu je pri $0{,}2\,\mathrm{ms/razdelek}$ ena perioda dolga $4{,}0$ razdelka. Kolikšna je frekvenca?
- $800\,\mathrm{Hz}$
~ Izračunal si periodo $0{,}8\,\mathrm{ms}$ in jo prebral kot $0{,}8\,\mathrm{kHz}$; frekvenca je obratna vrednost periode.
+ $1{,}25\,\mathrm{kHz}$
- $5\,\mathrm{kHz}$
~ Uporabil si le en razdelek kot periodo; perioda traja štiri razdelke.
> $T = 4{,}0 \cdot 0{,}2\,\mathrm{ms} = 0{,}8\,\mathrm{ms}$, zato $f = 1/T = 1250\,\mathrm{Hz}$.

? Pravokotni signal z ravnimi vrhovi se na zaslonu kaže s konicami na začetku vsakega vrha. Kaj je vzrok?
+ Kondenzator v sondi je nastavljen na preveliko vrednost (sonda je prekompenzirana).
- Nivo proženja je previsok.
~ Previsok nivo prepreči proženje in slika drsi ali zamrzne, oblike vrhov pa ne spremeni.
- Vhod je v sklopitvi AC.
~ AC sklopitev povzroči počasno povešanje ravnih vrhov, ne kratkih konic na robovih.
> Pri $C_1 > R_2C_2/R_1$ visoke frekvence (robovi) pridejo skozi z večjim razmerjem kot enosmerna komponenta; rob prenihi in se nato umiri (Naloga 1).

? Študent izračuna pravi čas vzpona: »$t_o = 0{,}35/200\,\mathrm{MHz} = 1{,}75\,\mathrm{ns}$; izmerjeno $t_m = 2{,}5\,\mathrm{ns}$; torej $t_s = t_m - t_o = 0{,}75\,\mathrm{ns}$.« Kateri korak je napačen?
- izračun $t_o$
~ $0{,}35/(200 \cdot 10^6\,\mathrm{Hz}) = 1{,}75\,\mathrm{ns}$ je pravilno.
- odčitek $t_m$
~ Odčitek je podatek naloge in ga ne spreminjamo.
+ odštevanje $t_m - t_o$
> Časa vzpona se seštevata kvadratno: $t_s = \sqrt{2{,}5^2 - 1{,}75^2}\,\mathrm{ns} \approx 1{,}79\,\mathrm{ns}$, ne $0{,}75\,\mathrm{ns}$.

? Tehnik v laboratoriju posname valovitost napajalnika s $f_s = 50\,\mathrm{kS/s}$. V spektru vidi močno črto pri $10\,\mathrm{kHz}$, proizvajalec pa pravi, da stikalni napajalnik dela pri $60\,\mathrm{kHz}$. Kaj je najverjetnejša razlaga?
- Napajalnik je pokvarjen in dela s šestkrat nižjo frekvenco.
~ Zrcaljenje razloži črto brez okvare; preden sklepamo na okvaro, preverimo pogoj vzorčenja.
+ Komponenta pri $60\,\mathrm{kHz}$ je nad $f_s/2$ in se zrcali na $|60 - 50|\,\mathrm{kHz} = 10\,\mathrm{kHz}$.
- Frekvenčna ločljivost je premajhna.
~ Ločljivost določa, kako blizu ležeči črti še ločimo; ne premakne črte s $60$ na $10\,\mathrm{kHz}$.
> Pri $f_s = 50\,\mathrm{kS/s}$ prikaz sega le do $25\,\mathrm{kHz}$; višje komponente se pokažejo na napačnih frekvencah. Treba je vzorčiti hitreje ali dodati filter.

:::simboli
u | trenutna napetost | u = k_y \cdot y | V
t | čas | t = k_x \cdot x | s
k_y | navpična občutljivost | | V | na razdelek
k_x | časovna baza | | s | na razdelek
y | navpični odčitek | | – | v razdelkih
x | vodoravni odčitek | | – | v razdelkih
y_{pp} | višina od temena do temena | | – | v razdelkih
x_T | dolžina periode na zaslonu | | – | v razdelkih
x_{\Delta} | zamik med kanaloma na zaslonu | | – | v razdelkih
T | perioda | T = \frac{1}{f} | s
f | frekvenca | f = \frac{1}{T} | Hz
U_{pp} | napetost od temena do temena | | V
U_p | temenska napetost | U_p = \frac{U_{pp}}{2} | V
U_{ef} | efektivna napetost | U_{ef} = \frac{U_p}{\sqrt{2}} | V | za sinus
U_1, U_2 | amplitudi kanalov 1 in 2 | | V
R_1, C_1 | upor in kondenzator v konici sonde | R_1 C_1 = R_2 C_2 | Ω, F
R_2, C_2 | vhodna upornost in kapacitivnost | | Ω, F
B | pasovna širina osciloskopa | | Hz | padec za 3 dB
t_r | čas vzpona | t_r \approx \frac{0{,}35}{B} | s | od 10 % do 90 %
t_o | čas vzpona osciloskopa | t_o \approx \frac{0{,}35}{B} | s
t_s | pravi čas vzpona signala | t_s = \sqrt{t_m^2 - t_o^2} | s
t_m | izmerjeni čas vzpona | t_m = \sqrt{t_s^2 + t_o^2} | s
\tau | časovna konstanta | | s
\varphi | fazni kot | \varphi = 360^\circ \cdot \frac{\Delta t}{T} | °
\Delta t | časovni zamik med kanaloma | | s
I | amplituda toka | I = \frac{U_2}{R_s} | A
R_s | merilni upor | | Ω
Z | impedanca | Z = \frac{U_1}{I} | Ω
R_c | upornost celice | | Ω
X_C | reaktanca kondenzatorja | X_C = \frac{1}{2\pi f C} | Ω
C | kapacitivnost celice | | F
f_s | vzorčevalna frekvenca | | Hz | vzorcev na sekundo
f_{max} | najvišja frekvenca v signalu | | Hz
f_m | frekvenca motnje | | Hz
N | število vzorcev | | –
T_z | dolžina okna zajema | T_z = \frac{N}{f_s} | s
\Delta f | frekvenčna ločljivost | \Delta f = \frac{f_s}{N} | Hz
k | celo število pri zrcaljenju | | –
:::
