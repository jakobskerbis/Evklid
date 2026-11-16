---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Žan med odmorom raztegne palico za selfije do konca in razglasi: »Telefon tehta vedno $1{,}6\,\mathrm{N}$, zato je palico enako težko držati, ne glede na to, kako dolga je.« Preveri ga sam. Na konec kuhalnice obesi šop ključev in jo drži vodoravno, najprej čisto blizu ključev, nato za drugi konec. Razlika je očitna.

Teža telefona se res ne spremeni. Spremeni se, kako močno telefon zasuka palico okoli tvoje dlani. Na tekmovanju se ta misel pojavi v treh oblikah: na telo deluje več sil hkrati, telo se lahko vrti okoli osi (vzvod) ali pa breme dvigamo z vrvjo čez škripce. Vse tri rešiš z istim vprašanjem: kaj mora veljati, da telo miruje?

## Razlaga

**1. Več sil na isto telo.** Silo rišemo kot puščico: dolžina pove velikost, konica smer. Več sil na isto telo lahko nadomestimo z eno samo silo z enakim učinkom. Imenujemo jo **rezultanta** $F_R$.

Dva robota v skladišču vlečeta isto škatlo, prvi s silo $3\,\mathrm{N}$, drugi s $4\,\mathrm{N}$. Spreminjamo kot med silama:

| kot med silama | rezultanta |
|---|---|
| $0^\circ$ (ista smer) | $7\,\mathrm{N}$ |
| $90^\circ$ | $5\,\mathrm{N}$ |
| $180^\circ$ (nasprotni smeri) | $1\,\mathrm{N}$ |

Večji kot je med silama, manjša je rezultanta. Vedno leži med razliko in vsoto obeh sil. Sili v isti smeri seštejemo:

$$F_R = F_1 + F_2$$

Pri nasprotnih smereh večjo zmanjšamo za manjšo in rezultanta kaže v smer večje. Pod poljubnim kotom velja **pravilo paralelograma**: puščici narišemo iz iste točke in ju dopolnimo do paralelograma. Rezultanta je njegova diagonala iz te točke.

:::risba skica
opis: Pravilo paralelograma pri pravem kotu. Iz iste točke kaže F₁ = 3 N v desno in F₂ = 4 N navzgor. Črtkani črti dopolnita pravokotnik, diagonala iz začetne točke je rezultanta 5 N.
območje: 0; 0 .. 6; 5
enota: 40
puščica: 1; 0,5 -> 4; 0,5 | F_1 = 3 N | pod | modra
puščica: 1; 0,5 -> 1; 4,5 | F_2 = 4 N | levo | modra
črta: 4; 0,5 -> 4; 4,5 | črtkano
črta: 1; 4,5 -> 4; 4,5 | črtkano
puščica: 1; 0,5 -> 4; 4,5 | F_R = 5 N | desno | oranžna
:::

Pri pravem kotu je paralelogram pravokotnik, diagonala pa hipotenuza pravokotnega trikotnika. Zato po Pitagorovem izreku:

$$F_R = \sqrt{F_1^2 + F_2^2}$$

:::premisli
Dve vrvici vlečeta z enako silo $F$. Kot med njima počasi večamo od $0^\circ$ do $180^\circ$. Kako se spreminja rezultanta? Koliko meri pri $120^\circ$?
---
Manjša se od $2F$ do nič. Pri $120^\circ$ je paralelogram romb, ki ga diagonala razdeli na dva enakostranična trikotnika. Diagonala je zato enako dolga kot stranica: rezultanta je $F$, tako velika kot vsaka sila posebej.
:::

**2. Ravnovesje sil.** Telo miruje, kadar je rezultanta vseh sil nanj enaka nič. Telefon na mizi vleče teža navzdol, miza ga enako močno potiska navzgor. Če poznaš vse sile razen ene, je manjkajoča sila enako velika kot rezultanta ostalih in kaže v nasprotno smer.

**3. Vzvod.** **Vzvod** je togo telo, ki se lahko vrti okoli osi. Ravnilo položimo čez sredino na svinčnik in nanj polagamo telefone, polnilne baterije in kovance. Zapišemo sile in razdalje od osi, levo ($F_1$, $r_1$) in desno ($F_2$, $r_2$), pri katerih ravnilo obmiruje vodoravno:

| $F_1$ [N] | $r_1$ [cm] | $F_2$ [N] | $r_2$ [cm] |
|---|---|---|---|
| $2$ | $10$ | $1$ | $20$ |
| $2$ | $15$ | $3$ | $10$ |
| $4$ | $5$ | $1$ | $20$ |
| $3$ | $12$ | $2$ | $18$ |

Zmnoži silo in razdaljo na vsaki strani. V vrsticah dobiš $20 = 20$, $30 = 30$, $20 = 20$ in $36 = 36$ (v $\mathrm{N\,cm}$). Majhna sila daleč od osi zmore toliko kot velika blizu nje.

Razdaljo od osi do sile imenujemo **ročica** $r$. Merimo jo pravokotno na smer sile: če sila na vodoravno ravnilo deluje navpično, je ročica kar razdalja vzdolž ravnila. Zmnožek sile in ročice je **navor**:

$$M = F \cdot r$$

Enota navora je newton meter ($\mathrm{N\,m}$). **Pravilo vzvoda**: vzvod je v ravnovesju, kadar je navor, ki ga vrti v eno smer, enak navoru, ki ga vrti v drugo. Za eno silo na vsaki strani je pogoj (enačba):

$$F_1 \cdot r_1 = F_2 \cdot r_2$$

Pri več silah na isti strani njihove navore seštej. Za mirujoče telo morata veljati oba pogoja: navori se izravnajo in rezultanta sil je nič. Zato os vzvoda potiska s silo, ki uravnoteži vse ostale.

:::premisli
Žan raztegne palico z $20\,\mathrm{cm}$ na $80\,\mathrm{cm}$. Kolikokrat večji navor ima zdaj telefon okoli njegove dlani? Kaj to pomeni za Žanovo trditev?
---
Štirikrat večji: sila je ista, ročica pa štirikrat daljša. Žan nima prav. Roka mora uravnotežiti štirikrat večji navor, zato je dolgo palico veliko težje držati vodoravno.
:::

**4. Škripci.** **Stalni škripec** (v nekaterih učbenikih pritrjeni škripec) je pritrjen, na primer na strop. Vrv samo preusmeri: vlečeš navzdol, breme gre gor. Sila je enaka teži bremena $F_g$, zato je stalni škripec le za udobje.

**Gibljivi škripec** visi na vrvi in se dviga skupaj z bremenom. Nosita ga dva kosa vrvi in vsak nosi polovico:

:::risba skica
opis: Gibljivi škripec. Krog visi na vrvi. Levi kos vrvi je pritrjen na strop, desni kos gre navzgor do roke, ki vleče s silo F. Tudi levi kos vleče s silo F. Pod škripcem visi breme, njegova teža kaže navzdol.
območje: 0; 0 .. 6; 6
enota: 40
črta: 0,8; 5,5 -> 3; 5,5 | debelo
krog: 3; 3,4 | 0,8 | modra
črta: 2,2; 3,4 -> 2,2; 5,5
črta: 3,8; 3,4 -> 3,8; 4,6
puščica: 3,8; 4,6 -> 3,8; 5,8 | F | desno | oranžna
napis: 2,2; 4,4 | F | levo
črta: 3; 3,4 -> 3; 2
pravokotnik: 2,3; 1,2 .. 3,7; 2 | siva
puščica: 3; 1,2 -> 3; 0,2 | F_g | desno | rdeča
:::

$$F = \frac{F_g}{2}$$

Manjšo silo plačaš z daljšo potjo. Ko breme dvigneš za $1\,\mathrm{m}$, se morata skrajšati oba kosa vrvi, vsak za $1\,\mathrm{m}$. Potegneš torej $2\,\mathrm{m}$ vrvi. Kar pridobiš pri sili, izgubiš pri poti.

**Škripčevje** sestavlja več škripcev. Preštej kose vrvi, ki nosijo gibljivi del, in jih označi z $n$. Če ima gibljivi škripec tudi sam težo $F_s$, jo nosijo isti kosi vrvi:

$$F = \frac{F_g + F_s}{n}$$

Vrvi pri tem potegneš $n$-krat toliko, kot se dvigne breme.

V simulaciji spodaj »Škripci« nastavi maso bremena na $40\,\mathrm{kg}$ in preklopi med »stalni škripec«, »gibljivi škripec« in »škripčevje«. Opazuj, kolikšna je potrebna sila pri vsaki izbiri in kako je povezana s številom kosov vrvi, ki nosijo breme.

## Rešeni primeri

### Primer 1 (lažji): paket s telefoni

Paket z novimi telefoni leži na gladkih tleh skladišča. Prvi robot ga vleče s silo $30\,\mathrm{N}$ proti vzhodu, drugi s silo $40\,\mathrm{N}$ proti severu. Kolikšna je rezultanta? S kolikšno silo in v katero smer mora vleči tretji robot, da paket ostane pri miru? Trenje zanemarimo.

**Podatki:** $F_1 = 30\,\mathrm{N}$ (vzhod), $F_2 = 40\,\mathrm{N}$ (sever), kot med silama $90^\circ$, trenja ni
**Iščemo:** rezultanto $F_R$ in silo tretjega robota $F_3$

:::formula
$F_R = \sqrt{F_1^2 + F_2^2}$; za ravnovesje je $F_3 = F_R$, v nasprotni smeri
:::

**Rešitev:**

1. Sili sta pravokotni, zato ju ne smemo kar sešteti; uporabimo Pitagorov izrek.
2. $F_R = \sqrt{30^2 + 40^2}\,\mathrm{N} = \sqrt{2500}\,\mathrm{N} = 50\,\mathrm{N}$.
3. Paket miruje le, če je rezultanta vseh treh sil nič. Tretja sila mora zato izničiti $F_R$.
4. Odgovor: rezultanta je $50\,\mathrm{N}$ in kaže med vzhod in sever, bliže severu. Tretji robot mora vleči s silo $50\,\mathrm{N}$ v nasprotno smer, med jug in zahod.

### Primer 2: palica za selfije

Žan drži lahko palico za selfije vodoravno. Kazalec je pod palico in je os vrtenja. Mezinec je $8\,\mathrm{cm}$ za kazalcem in palico pritiska navzdol. Telefon s težo $1{,}6\,\mathrm{N}$ je $80\,\mathrm{cm}$ pred kazalcem. S kolikšno silo pritiska mezinec in s kolikšno silo kazalec podpira palico? Težo palice zanemarimo.

**Podatki:** $F_1 = 1{,}6\,\mathrm{N}$, $r_1 = 80\,\mathrm{cm} = 0{,}8\,\mathrm{m}$, $r_2 = 8\,\mathrm{cm} = 0{,}08\,\mathrm{m}$, palica je lahka
**Iščemo:** silo mezinca $F_2$ in silo opore (kazalca) $F_o$

:::formula
$F_1 \cdot r_1 = F_2 \cdot r_2$, nato iz ravnovesja sil $F_o = F_1 + F_2$
:::

**Rešitev:**

1. Telefon zasuka palico tako, da se sprednji konec spušča. Mezinec za osjo jo mora zavrteti nazaj, zato pritiska navzdol.
2. Navor telefona: $M = 1{,}6\,\mathrm{N} \cdot 0{,}8\,\mathrm{m} = 1{,}28\,\mathrm{N\,m}$.
3. Mezinec mora dati enak navor: $F_2 = \dfrac{1{,}28\,\mathrm{N\,m}}{0{,}08\,\mathrm{m}} = 16\,\mathrm{N}$.
4. Sili telefona in mezinca kažeta navzdol, kazalec pa navzgor. Za ravnovesje sil: $F_o = 1{,}6\,\mathrm{N} + 16\,\mathrm{N} = 17{,}6\,\mathrm{N}$.
5. Odgovor: mezinec pritiska s silo $16\,\mathrm{N}$, kazalec podpira s silo $17{,}6\,\mathrm{N}$. Pri palici, dolgi le $20\,\mathrm{cm}$, bi mezinec pritiskal z $4\,\mathrm{N}$, torej štirikrat manj.

### Primer 3 (težji): antena na stolpu

Serviser stoji ob stolpu mobilne telefonije in dviga anteno s težo $360\,\mathrm{N}$. Na vrhu stolpa je stalni škripec, antena visi na gibljivem škripcu s težo $40\,\mathrm{N}$. Gibljivi škripec nosita dva kosa vrvi, prosti konec vrvi pa gre čez stalni škripec do serviserja, ki vleče navzdol.

a) S kolikšno silo vleče?
b) Koliko vrvi potegne, da anteno dvigne za $4\,\mathrm{m}$?
c) Serviser lahko vleče s silo največ $450\,\mathrm{N}$. Kolikšna je največja teža antene, ki jo še dvigne?

**Podatki:** $F_g = 360\,\mathrm{N}$, $F_s = 40\,\mathrm{N}$, $n = 2$, $h = 4\,\mathrm{m}$, največja sila $450\,\mathrm{N}$
**Iščemo:** silo $F$, dolžino potegnjene vrvi $s_v$, največjo težo antene

:::formula
$F = \dfrac{F_g + F_s}{n}$ in $s_v = n \cdot h$
:::

**Rešitev:**

1. Stalni škripec samo preusmeri vrv, sile ne zmanjša. Šteje gibljivi škripec z dvema nosilnima kosoma vrvi.
2. a) Vrvi nosita anteno in škripec: $F = \dfrac{360\,\mathrm{N} + 40\,\mathrm{N}}{2} = 200\,\mathrm{N}$.
3. b) Vsak kos se skrajša za $4\,\mathrm{m}$: $s_v = 2 \cdot 4\,\mathrm{m} = 8\,\mathrm{m}$.
4. c) Obrni nalogo: pri največji sili dva kosa vrvi skupaj nosita $2 \cdot 450\,\mathrm{N}$. Koliko od tega ostane za anteno? Izračunaj sam.

:::premisli
Kolikšna je največja teža antene?
---
Vrvi skupaj nosita $2 \cdot 450\,\mathrm{N} = 900\,\mathrm{N}$. Od tega $40\,\mathrm{N}$ odpade na gibljivi škripec, za anteno ostane $900\,\mathrm{N} - 40\,\mathrm{N} = 860\,\mathrm{N}$. Kdor pozabi na škripec, dobi napačnih $900\,\mathrm{N}$.
:::

## Pogoste napake

- **Sile seštevaš kot števila.** »$30\,\mathrm{N}$ in $40\,\mathrm{N}$ dasta $70\,\mathrm{N}$.« To velja le, če kažeta v isto smer. Pri pravem kotu je rezultanta $50\,\mathrm{N}$, v nasprotnih smereh $10\,\mathrm{N}$. Najprej preveri kot.
- **»Vsaka od dveh vrvic nosi polovico.«** Res je le, če vrvici visita navpično. Bolj kot sta razprti, večja je sila v vsaki. Pri kotu $120^\circ$ med njima vsaka nosi celo težo.
- **Ročica od konca palice.** Ročico meriš od osi, ne od roba telesa, in pravokotno na smer sile. Pri selfie palici je to razdalja od kazalca, ne od konca ročaja.
- **»Škripec prihrani delo.«** Gibljivi škripec razpolovi silo, a vrvi potegneš dvakrat toliko. Stalni škripec sile sploh ne zmanjša, samo preusmeri jo.
- **Pozabljena sila.** Teža gibljivega škripca ali sila v opori vzvoda. Pred računom naštej vse sile na telo.

## Povzetek

- Rezultanta nadomesti več sil. Isti smeri: vsota; nasprotni smeri: razlika; pravi kot: $F_R = \sqrt{F_1^2 + F_2^2}$; v splošnem pravilo paralelograma.
- Dve enaki sili pod kotom $120^\circ$ imata rezultanto, enako vsaki od njiju.
- Telo miruje, ko je rezultanta vseh sil nič in se navori izravnajo.
- Navor $M = F \cdot r$, ročica $r$ se meri od osi pravokotno na silo. Vzvod: $F_1 \cdot r_1 = F_2 \cdot r_2$.
- Stalni škripec le preusmeri silo. Gibljivi jo razpolovi, pot vrvi pa podvoji.
- Škripčevje z $n$ nosilnimi kosi vrvi: $F = \dfrac{F_g + F_s}{n}$, potegneš $n$-krat toliko vrvi.

## Drugače: Korak za korakom s številkami

Na ravnilu, podprtem v sredini, sta na levi telefon $2\,\mathrm{N}$ na razdalji $12\,\mathrm{cm}$ in polnilna baterija $3\,\mathrm{N}$ na razdalji $4\,\mathrm{cm}$. Kolikšno breme moraš postaviti na desno, $8\,\mathrm{cm}$ od osi?

1. Izberi os: svinčnik pod sredino ravnila.
2. Navori na levi: $2 \cdot 12 = 24$ in $3 \cdot 4 = 12$, skupaj $36\,\mathrm{N\,cm}$.
3. Navor na desni mora biti enak: $F \cdot 8\,\mathrm{cm} = 36\,\mathrm{N\,cm}$.
4. Deli z ročico: $F = 36 : 8 = 4{,}5\,\mathrm{N}$.
5. Preveri še ravnovesje sil: svinčnik potiska navzgor z $2 + 3 + 4{,}5 = 9{,}5\,\mathrm{N}$.

Pri vzvodu lahko ostaneš kar v centimetrih, saj imata obe strani isto enoto. Za navor v $\mathrm{N\,m}$ pa centimetre pretvori v metre.

## Drugače: Kot zgodba

Na koncertu je Žan dvignil palico za selfije, raztegnjeno na $80\,\mathrm{cm}$. Po treh pesmih ga je zapestje bolelo, kot bi držal liter mleka. Telefon pa je bil lažji od jabolka.

Nika mu je palico skrajšala na $20\,\mathrm{cm}$. »Telefon je enak,« je rekla, »ročica pa štirikrat krajša. Tvoje prste je prej obremenjeval štirikrat večji navor.« Žan je preračunal: mezinec je prej pritiskal s $16\,\mathrm{N}$, zdaj le s $4\,\mathrm{N}$. Razliko je čutil tudi kazalec: prej je nosil $17{,}6\,\mathrm{N}$, zdaj $5{,}6\,\mathrm{N}$.

Domov grede je Žan opazil serviserja na stolpu. Ta je s škripci in brez napora dvigal anteno, ki je bila težja od njega. »Tudi on nekaj plača,« je pomislil Žan. »Za manjšo silo potegne več vrvi.«

## Preveri se

? Katera trditev o škripcih je pravilna?
- Stalni škripec potrebno silo razpolovi.
~ Stalni škripec samo spremeni smer sile. Vleči moraš s silo, enako teži bremena.
+ Gibljivi škripec potrebno silo razpolovi, vrvi pa potegneš dvakrat toliko.
- Z gibljivim škripcem prihraniš polovico dela.
~ Sila je pol manjša, pot pa dvakrat daljša. Zmnožek sile in poti, delo, ostane enak.
- Škripčevje s štirimi nosilnimi kosi vrvi zmanjša silo za $4\,\mathrm{N}$.
~ Sila se deli s številom nosilnih kosov vrvi: postane štirikrat manjša, ne za $4\,\mathrm{N}$ manjša.
> Gibljivi škripec nosita dva kosa vrvi, zato je $F = \dfrac{F_g}{2}$; vsak kos se skrajša za višino dviga, zato potegneš dvojno dolžino.

? Dve sili po $10\,\mathrm{N}$ delujeta na isto telo pod različnimi koti. Razvrsti primere od najmanjše do največje rezultante.
1. kot med silama $180^\circ$
2. kot med silama $120^\circ$
3. kot med silama $90^\circ$
4. kot med silama $0^\circ$
> Rezultante so $0\,\mathrm{N}$, $10\,\mathrm{N}$, približno $14\,\mathrm{N}$ ($\sqrt{10^2 + 10^2}$) in $20\,\mathrm{N}$. Večji kot pomeni manjšo rezultanto.

? Palica je podprta v sredini. Z risbe odčitaj sile in ročice ter izračunaj, s kolikšno silo $F$ moraš pritisniti na desni, da bo palica v ravnovesju. Težo palice zanemari.
:::risba skica
opis: Vodoravna palica je podprta na sredini. Levo od opore visita 2 N na razdalji 30 cm in 4 N na razdalji 10 cm. Desno od opore na razdalji 25 cm deluje navzdol neznana sila F.
območje: -4; -3 .. 4; 2
enota: 36
črta: -3,5; 0 -> 3,5; 0 | debelo
lik: 0; 0 -> -0,4; -0,7 -> 0,4; -0,7 | siva
puščica: -3; 0 -> -3; -1,6 | 2 N | levo | modra
puščica: -1; 0 -> -1; -2,4 | 4 N | levo | modra
puščica: 2,5; 0 -> 2,5; -2 | F | desno | oranžna
črta: -3; 1,2 -> 0; 1,2 | črtkano
napis: -1,5; 1,2 | 30 cm | nad
črta: -1; 0,5 -> 0; 0,5 | črtkano
napis: -0,5; 0,5 | 10 cm | nad
črta: 0; 0,5 -> 2,5; 0,5 | črtkano
napis: 1,25; 0,5 | 25 cm | nad
:::
= 4 N | 0,05
~ 6 | Sile si seštel brez ročic. Na vzvodu štejejo navori: sila krat ročica.
~ 2,4 | Upošteval si samo $2\,\mathrm{N}$ na $30\,\mathrm{cm}$. Navor uteži $4\,\mathrm{N}$ moraš prišteti.
> Navori na levi: $2 \cdot 30 + 4 \cdot 10 = 100\,\mathrm{N\,cm}$. Na desni: $F \cdot 25\,\mathrm{cm} = 100\,\mathrm{N\,cm}$, torej $F = 4\,\mathrm{N}$.

? Breme s težo $600\,\mathrm{N}$ dvigamo z gibljivim škripcem s težo $40\,\mathrm{N}$, ki ga nosita dva kosa vrvi. Učenec je napisal tri korake. (A) Nosilna kosa vrvi sta dva. (B) $F = 600\,\mathrm{N} : 2 = 300\,\mathrm{N}$. (C) Za dvig za $1\,\mathrm{m}$ potegnemo $2\,\mathrm{m}$ vrvi. Kje je napaka?
- V koraku A, ker so nosilni kosi trije.
~ En gibljivi škripec visi na dveh kosih vrvi. Korak A je pravilen.
+ V koraku B, ker je pozabil težo škripca; pravilno je $320\,\mathrm{N}$.
- V koraku C, ker potegnemo samo $1\,\mathrm{m}$ vrvi.
~ Vsak od obeh kosov se skrajša za $1\,\mathrm{m}$, zato potegnemo $2\,\mathrm{m}$. Korak C je pravilen.
- Napake ni.
~ Gibljivi škripec se dviga skupaj z bremenom, zato vrvi nosita tudi njegovo težo.
> $F = \dfrac{600\,\mathrm{N} + 40\,\mathrm{N}}{2} = 320\,\mathrm{N}$.

? Reklamni zaslon v trgovini s telefoni ima težo $50\,\mathrm{N}$. Visi na dveh enako dolgih vrvicah, ki med seboj oklepata kot $120^\circ$. S kolikšno silo je napeta vsaka vrvica?
= 50 N | 0,5
~ 25 | Polovica teže velja le, če bi vrvici viseli navpično. Pod kotom se del sile vsake vrvice porabi za vlečenje vstran.
~ 100 | Rezultanta obeh vrvic mora biti enaka teži, ne dvakratni teži.
> Rezultanta sil vrvic mora biti $50\,\mathrm{N}$ navzgor. Dve enaki sili pod kotom $120^\circ$ imata rezultanto, enako vsaki od njiju, zato je vsaka vrvica napeta s silo $50\,\mathrm{N}$.

:::simboli
F_R | rezultanta | | N | sila, ki nadomesti vse sile
F_1, F_2 | prva in druga sila | | N
F_3 | sila tretjega robota | | N
M | navor | M = F \cdot r | N\,m
F | sila; pri škripcu sila, s katero vlečemo vrv | | N
r | ročica | | m | pravokotna razdalja od osi do premice sile
r_1, r_2 | ročici prve in druge sile | | m
F_g | teža bremena | | N
F_s | teža gibljivega škripca | | N
n | število kosov vrvi, ki nosijo gibljivi del | | –
F_o | sila opore (kazalca) | F_o = F_1 + F_2 | N
s_v | dolžina potegnjene vrvi | s_v = n \cdot h | m
h | višina dviga bremena | | m
:::

<<RACUN
vrednost: 3+4 | 7
vrednost: sqrt(3^2+4^2) | 5
vrednost: 4-3 | 1
vrednost: 3*12 | 36
vrednost: 2*18 | 36
vrednost: sqrt(30^2+40^2) | 50
vrednost: 1.6*0.8 | 1.28
vrednost: 1.28/0.08 | 16
vrednost: 1.6+16 | 17.6
vrednost: 1.6*0.2/0.08 | 4
vrednost: (360+40)/2 | 200
vrednost: 2*4 | 8
resi: (G+40)/2=450 | G | 860
vrednost: (2*30+4*10)/25 | 4
vrednost: (600+40)/2 | 320
vrednost: sqrt(10^2+10^2) | 14.14
vrednost: (2*12+3*4)/8 | 4.5
vrednost: 2+3+4.5 | 9.5
vrednost: 4+1.6 | 5.6
resi: 2*T*cos(60°)=50 | T | 50
>>
