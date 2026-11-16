---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi ploščato baterijo $4{,}5\,\mathrm{V}$, dve enaki žarnici in nekaj žic. Najprej priključi eno žarnico in si zapomni, kako sveti. Nato veži obe žarnici drugo za drugo v isti krog. Svetita šibkeje. Zdaj priključi vsako žarnico na svoj par žic, obe neposredno na baterijo. Vsaka sveti enako močno kot ena sama.

Iste žarnice, ista baterija, a povsem drugačen rezultat. Odloča le to, **kako** so porabniki vezani. Enako vprašanje rešujejo tisti, ki postavijo samodejno vremensko postajo na planini: en akumulator napaja grelec dežemera, ventilator, senzorje in oddajnik. Če vezavo zgrešijo, grelec pozimi ne stali snega ali pa se akumulator čez noč izprazni.

Na tekmovanju so vezja skoraj vedno sestavljena iz več delov. Kdor zna vezje razstaviti na majhne kose, ga reši v nekaj vrsticah.

## Razlaga

Iz Ohmovega zakona že poznaš $I = \dfrac{U}{R}$. Zdaj bomo vezje gradili kos za kosom. Za vsakim kosom je kratek preizkus z odgovorom v oklepaju.

**1. Zaporedna vezava.** Porabniki so drug za drugim na isti žici, tok ima eno samo pot. Vsak elektron, ki gre skozi prvi porabnik, gre tudi skozi drugega. Zato je **tok povsod enak**. Napetost vira pa se razdeli: del je na prvem, del na drugem porabniku.

$$U = U_1 + U_2$$

Ker je $U_1 = R_1 I$ in $U_2 = R_2 I$, se upora seštejeta:

$$R = R_1 + R_2$$

Primer: $10\,\Omega$ in $20\,\Omega$ na $12\,\mathrm{V}$ dasta $R = 30\,\Omega$ in tok $I = \dfrac{12}{30} = 0{,}4\,\mathrm{A}$. Na prvem je $4\,\mathrm{V}$, na drugem $8\,\mathrm{V}$. Večji upor dobi večji del napetosti.

*Preizkus:* $5\,\Omega$ in $15\,\Omega$ zaporedno, kolikšen je skupni upor? *(Odgovor: $20\,\Omega$.)*

**2. Vzporedna vezava.** Vsak porabnik je v svoji **veji**, torej na svoji poti za tok, med dvema točkama, ki ju imenujemo **vozlišči**. Vozlišče je točka, kjer se žica razcepi. Oba konca vsake veje sta priključena na isti vozlišči, zato je **napetost na vseh vejah enaka**. Tok se v vozlišču razdeli in v drugem spet združi:

$$I = I_1 + I_2$$

Na $12\,\mathrm{V}$ teče skozi $10\,\Omega$ tok $1{,}2\,\mathrm{A}$, skozi $20\,\Omega$ pa $0{,}6\,\mathrm{A}$. Iz baterije priteče $1{,}8\,\mathrm{A}$. Skupni upor je torej $R = \dfrac{12}{1{,}8} \approx 6{,}67\,\Omega$, manj kot vsak posamezni upor. Če vsak tok zapišeš kot $\dfrac{U}{R}$ in deliš z $U$, dobiš:

$$\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2}$$

Za dva upornika je hitrejša oblika $R = \dfrac{R_1 R_2}{R_1 + R_2}$, za $n$ enakih uporov $R_0$ pa $R = \dfrac{R_0}{n}$.

*Preizkus:* dva upora po $8\,\Omega$ vzporedno? *(Odgovor: $4\,\Omega$.)*

:::risba skica
opis: Dve vezji z baterijo 12 V in upornikoma 10 Ω in 20 Ω; daljša plošča baterije je pozitivni pol. Levo zaporedno: upornika sta drug za drugim, povsod teče 0,4 A, na 10 Ω je 4 V, na 20 Ω je 8 V. Desno vzporedno: upornika sta v dveh vejah med vozliščema A in B. Iz baterije priteče 1,8 A, ki se v A razdeli na 1,2 A skozi 10 Ω in 0,6 A skozi 20 Ω.
območje: 0; -2,8 .. 22; 10
črta: 1; 2 -> 1; 8 -> 10; 8 -> 10; 2 -> 6; 2
črta: 5; 2 -> 1; 2
pravokotnik: 2,5; 7,4 .. 4,5; 8,6 | ozadje
pravokotnik: 6,5; 7,4 .. 8,5; 8,6 | ozadje
napis: 3,5; 8,6 | 10 Ω | nad
napis: 7,5; 8,6 | 20 Ω | nad
napis: 3,5; 7,2 | 4 V | pod
napis: 7,5; 7,2 | 8 V | pod
črta: 5; 1,2 -> 5; 2,8 | debelo
črta: 6; 1,6 -> 6; 2,4 | debelo
napis: 5,5; 1 | 12 V | pod
napis: 4,8; 3 | + | levo
puščica: 10; 6,5 -> 10; 3,5 | 0,4 A | levo
napis: 5,5; -2 | zaporedno
črta: 14; 5 -> 14; 8 -> 19; 8 -> 19; 5
črta: 14; 5 -> 19; 5
črta: 14; 5 -> 12; 5 -> 12; 2 -> 15,5; 2
črta: 16,5; 2 -> 21; 2 -> 21; 5 -> 19; 5
pravokotnik: 15,5; 7,4 .. 17,5; 8,6 | ozadje
pravokotnik: 15,5; 4,4 .. 17,5; 5,6 | ozadje
napis: 16,5; 8,6 | 10 Ω | nad
napis: 16,5; 5,6 | 20 Ω | nad
točka: 14; 5 | A | pod levo
točka: 19; 5 | B | pod desno
črta: 15,5; 1,2 -> 15,5; 2,8 | debelo
črta: 16,5; 1,6 -> 16,5; 2,4 | debelo
napis: 16; 1 | 12 V | pod
napis: 15,3; 3 | + | levo
puščica: 12; 2,4 -> 12; 4,6 | 1,8 A | levo
puščica: 14; 5,6 -> 14; 7,6 | 1,2 A | levo
puščica: 17,7; 5 -> 18,6; 5 | 0,6 A | pod
napis: 16,5; -2 | vzporedno
:::

| | zaporedno | vzporedno |
|---|---|---|
| $I$ | enak | $I_1 + I_2$ |
| $U$ | $U_1 + U_2$ | enaka |
| $R$ | večji od vseh | manjši od vseh |

:::premisli
K dvema vzporedno vezanima žarnicama na bateriji dodaš še tretjo vzporedno. Kaj se zgodi s svetlostjo prvih dveh in s tokom iz baterije? Baterija naj ima stalno napetost.
---
Prvi dve svetita enako kot prej, saj imata še vedno vso napetost baterije. Tok iz baterije pa naraste, ker se mu pridruži tok tretje veje. Skupni upor se je zmanjšal.
:::

**3. Mešana vezava.** Vezje rešuješ od znotraj navzven. Poišči skupino, ki je čisto zaporedna ali čisto vzporedna, in jo nadomesti z enim uporom. Ponavljaj, dokler ne ostane en sam upor. Nato greš nazaj: izračunaš tok iz vira in ga razdeliš po vejah.

*Preizkus:* $6\,\Omega$ zaporedno z vzporedno vezanima $12\,\Omega$ in $4\,\Omega$? *(Odgovor: $3\,\Omega + 6\,\Omega = 9\,\Omega$.)*

**4. Merjenje.** **Ampermeter** meri tok, ki teče skozenj, zato ga vežemo **zaporedno** v vejo, ki nas zanima. Imeti mora zelo majhen upor, da toka ne zmanjša. **Voltmeter** meri napetost med dvema točkama, zato ga vežemo **vzporedno** s porabnikom. Imeti mora zelo velik upor, da skozenj skoraj nič ne teče.

*Preizkus:* kam vežeš ampermeter, da izmeri tok skozi drugi upornik vzporedne vezave? *(Odgovor: zaporedno v vejo drugega upornika.)*

:::premisli
Kaj se zgodi, če ampermeter po pomoti vežeš vzporedno z žarnico?
---
Ampermeter ima skoraj nič upora, zato tok steče skozenj mimo žarnice. Žarnica ugasne, tok v krogu močno naraste in lahko pregori varovalka ampermetra. Taki poti mimo porabnika rečemo kratek stik.
:::

V simulaciji spodaj (Zaporedna in vzporedna vezava) nastavi dva upornika na $10\,\Omega$ in $20\,\Omega$ ter preklapljaj med zaporedno in vzporedno vezavo. Opazuj, pri kateri vezavi je tok iz vira večji in kako se razdeli po upornikih.

## Rešeni primeri

### Primer 1: ogrevani dežemer

Pozimi grelec v dežemeru tali sneg, da postaja izmeri tudi padavine v obliki snega. Grelec z uporom $16\,\Omega$ je zaporedno z zaščitnim upornikom $8\,\Omega$ priključen na akumulator $12\,\mathrm{V}$. Kolikšen tok teče in kolikšna napetost je na grelcu?

**Podatki:** $U = 12\,\mathrm{V}$, $R_1 = 16\,\Omega$ (grelec), $R_2 = 8\,\Omega$, vezava zaporedna
**Iščemo:** tok $I$ in napetost $U_1$ na grelcu

:::formula
$R = R_1 + R_2$, $I = \dfrac{U}{R}$, $U_1 = R_1 I$
:::

**Rešitev:**

1. Skupni upor, ker sta zaporedno: $R = 16\,\Omega + 8\,\Omega = 24\,\Omega$.
2. Tok, ki je povsod enak: $I = \dfrac{12\,\mathrm{V}}{24\,\Omega} = 0{,}5\,\mathrm{A}$.
3. Napetost na grelcu: $U_1 = 16\,\Omega \cdot 0{,}5\,\mathrm{A} = 8\,\mathrm{V}$.
4. Preverba: na upornik ostane $8\,\Omega \cdot 0{,}5\,\mathrm{A} = 4\,\mathrm{V}$, skupaj $12\,\mathrm{V}$.
5. Odgovor: teče tok $0{,}5\,\mathrm{A}$, na grelcu je $8\,\mathrm{V}$.

### Primer 2: tri naprave na enem akumulatorju

Na akumulator $12\,\mathrm{V}$ so vzporedno priključeni grelec ($12\,\Omega$), ventilator ($24\,\Omega$) in oddajnik ($48\,\Omega$). Kolikšen tok priteče iz akumulatorja in kolikšen je skupni upor?

**Podatki:** $U = 12\,\mathrm{V}$, $R_1 = 12\,\Omega$, $R_2 = 24\,\Omega$, $R_3 = 48\,\Omega$, vezava vzporedna
**Iščemo:** tok $I$ iz akumulatorja in skupni upor $R$

:::formula
$I_k = \dfrac{U}{R_k}$, $I = I_1 + I_2 + I_3$, $R = \dfrac{U}{I}$
:::

**Rešitev:**

1. Vsaka naprava ima vso napetost $12\,\mathrm{V}$, ker so vzporedno.
2. Tokovi: $I_1 = \dfrac{12}{12} = 1\,\mathrm{A}$, $I_2 = \dfrac{12}{24} = 0{,}5\,\mathrm{A}$, $I_3 = \dfrac{12}{48} = 0{,}25\,\mathrm{A}$.
3. Tok iz akumulatorja je vsota: $I = 1 + 0{,}5 + 0{,}25 = 1{,}75\,\mathrm{A}$.
4. Skupni upor: $R = \dfrac{12}{1{,}75} \approx 6{,}86\,\Omega$. Preverba: $\dfrac{1}{12} + \dfrac{1}{24} + \dfrac{1}{48} = \dfrac{7}{48}$, torej $R = \dfrac{48}{7} \approx 6{,}86\,\Omega$, manj kot najmanjši upor.
5. Odgovor: iz akumulatorja priteče $1{,}75\,\mathrm{A}$, skupni upor je približno $6{,}86\,\Omega$.

### Primer 3: od meritve nazaj do vira

Upornik $R_1 = 6\,\Omega$ je zaporedno vezan s parom vzporednih upornikov $R_2 = 12\,\Omega$ in $R_3 = 4\,\Omega$. Ampermeter v veji z $R_2$ kaže $0{,}25\,\mathrm{A}$. Kolikšna je napetost vira in kaj kaže voltmeter, priključen vzporedno z $R_1$?

**Podatki:** $R_1 = 6\,\Omega$, $R_2 = 12\,\Omega$, $R_3 = 4\,\Omega$, $I_2 = 0{,}25\,\mathrm{A}$
**Iščemo:** napetost vira $U$ in napetost $U_1$ na $R_1$

:::formula
$U_2 = R_2 I_2$, $I_3 = \dfrac{U_2}{R_3}$, $I = I_2 + I_3$, $U = U_1 + U_2$
:::

**Rešitev:**

1. Napetost na vzporednem paru: $U_2 = 12\,\Omega \cdot 0{,}25\,\mathrm{A} = 3\,\mathrm{V}$. Enaka je na obeh vejah.
2. Tok skozi $R_3$: $I_3 = \dfrac{3\,\mathrm{V}}{4\,\Omega} = 0{,}75\,\mathrm{A}$.
3. Tok skozi $R_1$ je vsota obeh vej: $I = 0{,}25 + 0{,}75 = 1\,\mathrm{A}$.
4. Voltmeter na $R_1$: $U_1 = 6\,\Omega \cdot 1\,\mathrm{A} = 6\,\mathrm{V}$.
5. Napetost vira: $U = 6\,\mathrm{V} + 3\,\mathrm{V} = 9\,\mathrm{V}$. Preverba s skupnim uporom: vzporedna $12\,\Omega$ in $4\,\Omega$ dasta $3\,\Omega$, zato $R = 6 + 3 = 9\,\Omega$ in $9\,\Omega \cdot 1\,\mathrm{A} = 9\,\mathrm{V}$.
6. Odgovor: vir ima $9\,\mathrm{V}$, voltmeter kaže $6\,\mathrm{V}$.

### Primer 4: zdaj ti

Postaja meri temperaturo s termistorjem, upornikom, katerega upor se spreminja s temperaturo. Ponoči ima $60\,\Omega$. Zaporedno z upornikom $30\,\Omega$ je na bateriji $9\,\mathrm{V}$. Kaj kaže voltmeter, vezan vzporedno s termistorjem?

**Podatki:** $U = 9\,\mathrm{V}$, $R_T = 60\,\Omega$, $R_1 = 30\,\Omega$, vezava zaporedna
**Iščemo:** napetost $U_T$ na termistorju

:::formula
$R = R_1 + R_T$, $I = \dfrac{U}{R}$, $U_T = R_T I$
:::

**Rešitev:**

1. Skupni upor: $R = 30\,\Omega + 60\,\Omega = 90\,\Omega$.
2. Tok: $I = \dfrac{9\,\mathrm{V}}{90\,\Omega} = 0{,}1\,\mathrm{A}$.
3. Izračunaj napetost na termistorju in preveri, ali se napetosti seštejeta v $9\,\mathrm{V}$.

:::premisli
Koliko je $U_T$?
---
$U_T = 60\,\Omega \cdot 0{,}1\,\mathrm{A} = 6\,\mathrm{V}$. Na upornik $30\,\Omega$ ostanejo $3\,\mathrm{V}$, skupaj $9\,\mathrm{V}$. Dvakrat večji upor dobi dvakrat večjo napetost.
:::

## Pogoste napake

- **»Prva žarnica porabi tok.«** Napačno sklepanje: tok gre najprej skozi prvo žarnico, zato zadnji ostane manj. Tok se ne porabi, v zaporedni vezavi je povsod enak. Porabi se energija, ne naboj.
- **Upore v vzporedni vezavi seštevaš.** Kdor sešteje $10\,\Omega + 20\,\Omega$, dobi $30\,\Omega$, a vzporedno je tok večji, upor pa manjši. Pravilo za preverbo: skupni vzporedni upor je manjši od najmanjšega.
- **Pozabljen obrat.** Iz $\dfrac{1}{R} = \dfrac{1}{12} + \dfrac{1}{24} + \dfrac{1}{48} = \dfrac{7}{48}$ ni $R = \dfrac{7}{48}\,\Omega$. Na koncu ulomek obrni: $R = \dfrac{48}{7}\,\Omega$.
- **Napetost se v vzporedni vezavi deli.** Vsaka veja ima vso napetost med vozliščema. Deli se tok, ne napetost.
- **Ampermeter vzporedno, voltmeter zaporedno.** Ampermeter vzporedno naredi kratek stik; voltmeter zaporedno skoraj ustavi tok, ker ima velik upor. Ampermeter gre v vejo, voltmeter na konca porabnika.

## Povzetek

- Zaporedno: tok povsod enak, $U = U_1 + U_2$, $R = R_1 + R_2$; večji upor dobi večjo napetost.
- Vzporedno: napetost na vseh vejah enaka, $I = I_1 + I_2$, $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$; skupni upor je manjši od najmanjšega.
- Dva vzporedna: $R = \dfrac{R_1 R_2}{R_1 + R_2}$; $n$ enakih: $\dfrac{R_0}{n}$.
- Mešano vezje poenostavljaš od znotraj navzven, nato tok razdeliš nazaj po vejah.
- Ampermeter zaporedno (majhen upor), voltmeter vzporedno (velik upor).

## Drugače: Na sliki

Predstavljaj si reko. Napetost je višinska razlika, za katero se voda spusti, tok je količina vode na sekundo.

:::risba skica
opis: Reka z vodnim tokom 30 kubičnih metrov na sekundo se pred otokom razdeli v dva rokava: širši nosi 20, ožji 10 kubičnih metrov na sekundo. Za otokom se rokava spet združita v 30 kubičnih metrov na sekundo.
območje: 0; 0 .. 20; 8
puščica: 0,5; 4 -> 4; 4 | 30 m³/s | nad
črta: 4; 4 -> 6; 6,5 -> 14; 6,5 -> 16; 4 | modra
črta: 4; 4 -> 6; 1,5 -> 14; 1,5 -> 16; 4 | modra
pravokotnik: 6,5; 2,5 .. 13,5; 5,5 | ozadje
napis: 10; 4 | otok | sredina
napis: 10; 6,5 | širši rokav: 20 m³/s | nad
napis: 10; 1,5 | ožji rokav: 10 m³/s | pod
puščica: 16; 4 -> 19,5; 4 | 30 m³/s | nad
:::

- **Vzporedno** je kot reka okoli otoka. Oba rokava se spustita za enako višino, od razcepa do sotočja (enaka napetost). Vode je skupaj toliko, kot je je prej teklo v enem koritu (tokova se seštejeta). Širši rokav (manjši upor) nese več vode.
- **Zaporedno** je kot dve brzici ena za drugo. Skozi obe teče ista voda (enak tok), višina se razdeli: kjer je brzica bolj strma (večji upor), voda izgubi več višine.
- Vsak nov rokav reki olajša pot, zato steče več vode. Tako tudi vsak nov vzporedni porabnik zmanjša skupni upor.

## Drugače: Bolj natančno

**Formula za vzporedno vezavo.** Iz $I = I_1 + I_2$ in $I_k = \dfrac{U}{R_k}$ dobiš $\dfrac{U}{R} = \dfrac{U}{R_1} + \dfrac{U}{R_2}$. Deliš z $U$ in imaš $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$. Če je $R_2$ zelo velik, je $\dfrac{1}{R_2}$ skoraj nič in $R$ skoraj enak $R_1$.

**Delilnik napetosti.** Pri dveh zaporednih uporih velja $U_1 = U \dfrac{R_1}{R_1 + R_2}$. Napetosti sta v istem razmerju kot upora. Na tem temelji termometer iz Primera 4: ko se zjutraj termistor segreje in mu upor pade, pade tudi njegova napetost.

**Pravi merilniki.** Voltmeter ima končen upor, npr. $10\,\mathrm{M\Omega}$. Porabnik skupaj z voltmetrom ob sebi ima zato malo manjši upor kot porabnik sam. Pri majhnih uporih je razlika neopazna, pri uporih reda megaohmov pa ne več.

**Ptica na žici.** Ptica sedi na eni sami žici daljnovoda. Njeno telo je vzporedno vezano s koščkom žice med nogama. Ta košček ima zelo majhen upor, zato je napetost med nogama le nekaj milivoltov in skozi ptico skoraj nič ne teče. Nevarno postane, ko se dotakne dveh žic hkrati.

## Preveri se

? Zakaj ampermeter vežemo zaporedno s porabnikom?
- Ker mora imeti enako napetost kot porabnik.
~ Enako napetost imajo vzporedno vezani elementi. To velja za voltmeter, ne za ampermeter.
+ Ker mora skozenj teči isti tok kot skozi porabnik.
- Ker ima velik upor in bi vzporedno pokvaril meritev.
~ Velik upor ima voltmeter. Ampermeter ima majhen upor in bi vzporedno naredil kratek stik.
> V zaporedni vezavi je tok povsod enak, zato ampermeter v isti veji pokaže tok skozi porabnik.

? Tri enake upornike po $6\,\Omega$ vežemo na štiri načine. Razvrsti vezave od najmanjšega do največjega skupnega upora.
1. vsi trije vzporedno
2. dva zaporedno, tretji vzporedno s tem parom
3. dva vzporedno, tretji zaporedno s tem parom
4. vsi trije zaporedno
> Skupni upori: $\dfrac{6}{3} = 2\,\Omega$; $\dfrac{12 \cdot 6}{12 + 6} = 4\,\Omega$; $3 + 6 = 9\,\Omega$; $3 \cdot 6 = 18\,\Omega$. Več vzporednih poti pomeni manjši upor.

? Upornika $100\,\Omega$ in $1\,\Omega$ sta vezana vzporedno. Izračunaj skupni upor na dve decimalki natančno.
= 0,99 Ω | 0,005
~ 101 | Upora si seštel. To velja za zaporedno vezavo; vzporedni upor je manjši od najmanjšega.
~ 50,5 | To je povprečje. Vzporedni upor ni povprečje, ampak je manjši od $1\,\Omega$.
~ 1,01 | To je $\dfrac{1}{R}$. Na koncu moraš ulomek obrniti: $R = \dfrac{1}{1{,}01}$.
> $R = \dfrac{100 \cdot 1}{100 + 1} \approx 0{,}99\,\Omega$. Skoraj ves tok teče skozi $1\,\Omega$, velik upor ob njem skupni upor le malo zmanjša.

? Na sliki je vezje z baterijo $12\,\mathrm{V}$. Kaj kaže ampermeter A?
:::risba skica
opis: Baterija 12 V, daljša plošča je pozitivni pol. V levi žici je ampermeter A. V zgornji žici je upornik 4 Ω. Za njim se vezje razcepi na dve vzporedni veji: v eni je upornik 6 Ω, v drugi upornik 3 Ω. Veji se spodaj združita in vodita nazaj k bateriji.
območje: -1; -1,5 .. 17; 10
črta: 6; 1 -> 1; 1 -> 1; 8 -> 13; 8 -> 13; 1 -> 7; 1
črta: 8; 8 -> 8; 1
krog: 1; 4,5 | 0,8 | ozadje
napis: 1; 4,5 | A | sredina | debelo
pravokotnik: 2,5; 7,4 .. 4,5; 8,6 | ozadje
napis: 3,5; 8,6 | 4 Ω | nad
pravokotnik: 7,4; 3,5 .. 8,6; 5,5 | ozadje
napis: 8,8; 4,5 | 6 Ω | desno
pravokotnik: 12,4; 3,5 .. 13,6; 5,5 | ozadje
napis: 13,8; 4,5 | 3 Ω | desno
črta: 6; 0,2 -> 6; 1,8 | debelo
črta: 7; 0,6 -> 7; 1,4 | debelo
napis: 6,5; 0 | 12 V | pod
napis: 5,8; 2 | + | levo
:::
= 2 A | 0,01
~ 0,92 | Vse tri upore si seštel. Upora $6\,\Omega$ in $3\,\Omega$ sta vzporedno: skupaj imata $2\,\Omega$.
~ 2,67 | Za vzporedni par si vzel $\dfrac{1}{R} = 0{,}5$ kot upor. Obrni: par ima $2\,\Omega$.
> Vzporedni par: $\dfrac{6 \cdot 3}{6 + 3} = 2\,\Omega$. Skupaj $4 + 2 = 6\,\Omega$, tok $I = \dfrac{12}{6} = 2\,\mathrm{A}$.

? Upornik $20\,\Omega$ in neznani upornik $R_x$ sta zaporedno na bateriji $12\,\mathrm{V}$. Voltmeter na $20\,\Omega$ kaže $4\,\mathrm{V}$. Kolikšen je $R_x$?
= 40 Ω | 0,5
~ 60 | To je skupni upor kroga, $\dfrac{12\,\mathrm{V}}{0{,}2\,\mathrm{A}}$. Odšteti moraš še $20\,\Omega$.
~ 10 | Razmerje si obrnil. Večji upor dobi večjo napetost: na $R_x$ je $8\,\mathrm{V}$, dvakrat več kot na $20\,\Omega$.
> Tok: $I = \dfrac{4\,\mathrm{V}}{20\,\Omega} = 0{,}2\,\mathrm{A}$. Na $R_x$ je $12 - 4 = 8\,\mathrm{V}$, zato $R_x = \dfrac{8\,\mathrm{V}}{0{,}2\,\mathrm{A}} = 40\,\Omega$.

<<RACUN
vrednost: 12/(10+20) | 0.4
vrednost: 12/10+12/20 | 1.8
vrednost: 10*20/(10+20) | 6.67
vrednost: 12/(16+8) | 0.5
vrednost: 16*0.5 | 8
vrednost: 12/12+12/24+12/48 | 1.75
vrednost: 1/(1/12+1/24+1/48) | 6.86
vrednost: 12*0.25 | 3
vrednost: 3/4 | 0.75
vrednost: 6*(0.25+0.75) | 6
vrednost: 6+12*4/(12+4) | 9
vrednost: 60*9/(30+60) | 6
vrednost: 12*6/(12+6) | 4
vrednost: 100*1/(100+1) | 0.99
vrednost: 12/(4+6*3/(6+3)) | 2
vrednost: (12-4)/(4/20) | 40
>>

:::simboli
U | napetost vira | U = R \cdot I | V
U_1, U_2 | napetost na posameznem uporu | U_1 = R_1 I | V
U_T | napetost na termistorju | U_T = R_T I | V
I | tok iz vira | I = \dfrac{U}{R} | A
I_1, I_2, I_3 | tok v posamezni veji | I_k = \dfrac{U}{R_k} | A
I_k | tok v $k$-ti veji | I_k = \dfrac{U}{R_k} | A
R | skupni (nadomestni) upor | R = \dfrac{U}{I} | Ω
R_1, R_2, R_3 | upor posameznega porabnika | | Ω
R_k | upor $k$-tega porabnika | | Ω
R_T | upor termistorja | | Ω | odvisen od temperature
R_0 | upor enega od $n$ enakih upornikov | | Ω
n | število enakih vzporednih upornikov | | –
:::
