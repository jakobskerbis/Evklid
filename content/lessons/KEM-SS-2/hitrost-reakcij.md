---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Molekule v zraku letijo hitreje od zvoka. Zvok potuje s približno $340\,\mathrm{m/s}$, molekula dušika pri sobni temperaturi v povprečju s približno $470\,\mathrm{m/s}$, molekula vodika celo s približno $1760\,\mathrm{m/s}$. Pri običajnem zračnem tlaku vsaka molekula v sekundi trči z drugimi nekaj milijardkrat.

Zdaj pa paradoks. Zmes vodika in kisika lahko v zaprti posodi stoji leta, ne da bi se karkoli zgodilo. Reakcija bi sprostila veliko energije, delci nenehno trkajo, pa vendar nič. Ko zmesi približaš iskro, se zasliši glasen **pok**.

Kako je mogoče, da milijarde trkov na sekundo ne naredijo nič, ena iskra pa vse?

## Razlaga

**Trk ni dovolj.** Predstavljaj si dva delca, ki letita drug proti drugemu. Glede na energijo in usmerjenost so štiri možnosti:

| energija | usmerjenost | izid |
|---|---|---|
| premajhna | napačna | odboj |
| premajhna | prava | odboj |
| dovolj | napačna | odboj |
| dovolj | prava | produkt |

Skica kaže, kaj pomeni usmerjenost: delec C reagira z delcem AB le, če zadene konec A.

:::risba skica
opis: Dva trka delca C z delcem AB. Levo: C leti proti koncu A, usmerjenost je prava, pod sliko piše »nastane produkt«. Desno: C leti proti koncu B, usmerjenost je napačna, pod sliko piše »odboj«.
območje: 0; -1 .. 20; 6,4
krog: 3; 4 | 1,2 | siva
napis: 3; 4 | B | sredina
krog: 4,9; 4 | 0,7 | modra
napis: 4,9; 4 | A | sredina
krog: 8,4; 4 | 0,7 | oranžna
napis: 8,4; 4 | C | sredina
puščica: 7,6; 4 -> 5,8; 4
napis: 5; 1,6 | C zadene A: | sredina
napis: 5; 0,6 | prava usmerjenost | sredina
napis: 5; -0,4 | nastane produkt | sredina
črta: 10; -0,8 -> 10; 6,2 | siva črtkano
krog: 17; 4 | 1,2 | siva
napis: 17; 4 | B | sredina
krog: 18,9; 4 | 0,7 | modra
napis: 18,9; 4 | A | sredina
krog: 12,4; 4 | 0,7 | oranžna
napis: 12,4; 4 | C | sredina
puščica: 13,2; 4 -> 15,6; 4
napis: 15; 1,6 | C zadene B: | sredina
napis: 15; 0,6 | napačna usmerjenost | sredina
napis: 15; -0,4 | odboj | sredina
:::

Le zadnji trk v tabeli je **uspešen trk**. Najmanjšo energijo, ki jo morata delca imeti ob trku, da reakcija steče, imenujemo **aktivacijska energija** $E_\mathrm{a}$. Pri sobni temperaturi ima toliko energije le neznaten delež molekul vodika in kisika: uspešnih trkov je premalo, da bi karkoli opazili. Iskra krajevno segreje zmes, nekaj molekul zreagira, sproščena energija segreje sosede in reakcija se razširi.

**Energijski hrib.** Pot od reaktantov do produktov si nariši kot cesto čez hrib. Levo spodaj so reaktanti, desno še nižje produkti. Vmes je vrh, **prehodno stanje** (aktivirani kompleks), ki je za $E_\mathrm{a}$ višje od reaktantov. Delec brez dovolj energije se do vrha ne povzpne.

Slika, energijski diagram, kaže tak hrib za razkroj vodikovega peroksida, $\mathrm{2\,H_2O_2 \rightarrow 2\,H_2O + O_2}$. Energija je podana na mol peroksida. Vrh je približno $75\,\mathrm{kJ/mol}$ nad reaktanti: to je $E_\mathrm{a}$ (črna puščica skrajno levo); oranžna puščica ob njej kaže $E_\mathrm{a}$ s platino. Produkti so $98\,\mathrm{kJ/mol}$ pod reaktanti, toliko energije se sprosti (reakcijska entalpija $\Delta H = -98\,\mathrm{kJ/mol}$). Črtkana krivulja pripada isti reakciji s katalizatorjem.

:::risba graf
opis: Energijski hrib za razkroj vodikovega peroksida. Energija je v kJ na mol vodikovega peroksida. Reaktanti so na višini 0, produkti na −98. Polna krivulja brez katalizatorja se dvigne do vrha pri 75 kJ/mol, črtkana krivulja s platino kot katalizatorjem le do 49 kJ/mol. Obe se začneta in končata na isti višini. Puščici na levi kažeta obe aktivacijski energiji od ravni reaktantov do vrha, puščica na desni sproščenih 98.
x: 0 .. 10 | 10 | potek reakcije
y: -120 .. 100 | 20 | energija (kJ/mol)
višina: 240
oznake: ne
oznakay: 0 | 0
oznakay: 49 | 49
oznakay: 75 | 75
oznakay: -98 | −98
f: 0 | modra | 0 .. 2
f: 75*(1-cos(pi*(x-2)/3))/2 | modra | 2 .. 5
f: 75-173*(1-cos(pi*(x-5)/3))/2 | modra | 5 .. 8
f: -98 | modra | 8 .. 10
f: 49*(1-cos(pi*(x-2)/3))/2 | oranžna črtkano | 2 .. 5
f: 49-147*(1-cos(pi*(x-5)/3))/2 | oranžna črtkano | 5 .. 8
puščica: 0,6; 0 -> 0,6; 75
črta: 0,4; 75 -> 5; 75 | siva črtkano
puščica: 1,4; 0 -> 1,4; 49 | | | oranžna
črta: 1,2; 49 -> 5; 49 | siva črtkano
črta: 2; 0 -> 9,6; 0 | siva črtkano
puščica: 9,2; 0 -> 9,2; -98 | 98 | levo
napis: 2,2; -14 | reaktanti | desno
napis: 9,8; -110 | produkti | levo
napis: 5; 88 | brez katalizatorja: E_a = 75 | sredina
napis: 9,9; 55 | Pt: E_a = 49 | levo | oranžna
:::

**Hitrost reakcije** pove, koliko reaktanta se porabi ali koliko produkta nastane v eni sekundi. Ko magnezij reagira s kislino, glasnejše šumenje mehurčkov vodika pomeni hitrejšo reakcijo.

**Kaj vpliva na hitrost.** Vsak dejavnik spremeni bodisi število trkov bodisi delež uspešnih:

| dejavnik | kaj se zgodi z delci |
|---|---|
| večja koncentracija | več delcev, več trkov |
| višja temperatura | več uspešnih trkov |
| drobnejša snov | večja površina za trke |
| katalizator | nižji hrib |

Vsi štirje dejavniki reakcijo pospešijo: koncentracija in površina povečata število trkov, temperatura in katalizator delež uspešnih. Pri plinih večji tlak pomeni več delcev v istem prostoru, torej večjo koncentracijo. Peti dejavnik je narava snovi: različne snovi imajo različne vezi in zato različno visok hrib.

Zakaj razdrobljenost toliko pomeni, pokaže kocka z robom $2\,\mathrm{cm}$. Njena površina je $6 \cdot 4 = 24$, torej $24\,\mathrm{cm^2}$. Razrežemo jo na $8$ kock z robom $1\,\mathrm{cm}$: snovi je enako, površina pa je $8 \cdot 6 = 48$, torej $48\,\mathrm{cm^2}$.

:::risba skica
opis: Levo ena kocka z robom 2 cm, površina 24 cm². Desno ista kocka, razrezana na 8 kock z robom 1 cm, ki so razmaknjene; skupna površina je 48 cm².
območje: 0; 0 .. 19,4; 7,6
pravokotnik: 1; 2 .. 5; 6 | modra
črta: 1; 6 -> 2; 7 -> 6; 7 -> 5; 6 | modra
črta: 6; 7 -> 6; 3 -> 5; 2 | modra
napis: 3,7; 0,8 | rob 2 cm: 24 cm^2 | sredina
puščica: 6,5; 4,2 -> 8,3; 4,2
pravokotnik: 8,8; 1,8 .. 10,8; 3,8 | oranžna
črta: 8,8; 3,8 -> 9,3; 4,3 -> 11,3; 4,3 -> 10,8; 3,8 | oranžna
črta: 11,3; 4,3 -> 11,3; 2,3 -> 10,8; 1,8 | oranžna
pravokotnik: 11,4; 1,8 .. 13,4; 3,8 | oranžna
črta: 11,4; 3,8 -> 11,9; 4,3 -> 13,9; 4,3 -> 13,4; 3,8 | oranžna
črta: 13,9; 4,3 -> 13,9; 2,3 -> 13,4; 1,8 | oranžna
pravokotnik: 14; 1,8 .. 16; 3,8 | oranžna
črta: 14; 3,8 -> 14,5; 4,3 -> 16,5; 4,3 -> 16; 3,8 | oranžna
črta: 16,5; 4,3 -> 16,5; 2,3 -> 16; 1,8 | oranžna
pravokotnik: 16,6; 1,8 .. 18,6; 3,8 | oranžna
črta: 16,6; 3,8 -> 17,1; 4,3 -> 19,1; 4,3 -> 18,6; 3,8 | oranžna
črta: 19,1; 4,3 -> 19,1; 2,3 -> 18,6; 1,8 | oranžna
pravokotnik: 8,8; 4,6 .. 10,8; 6,6 | oranžna
črta: 8,8; 6,6 -> 9,3; 7,1 -> 11,3; 7,1 -> 10,8; 6,6 | oranžna
črta: 11,3; 7,1 -> 11,3; 5,1 -> 10,8; 4,6 | oranžna
pravokotnik: 11,4; 4,6 .. 13,4; 6,6 | oranžna
črta: 11,4; 6,6 -> 11,9; 7,1 -> 13,9; 7,1 -> 13,4; 6,6 | oranžna
črta: 13,9; 7,1 -> 13,9; 5,1 -> 13,4; 4,6 | oranžna
pravokotnik: 14; 4,6 .. 16; 6,6 | oranžna
črta: 14; 6,6 -> 14,5; 7,1 -> 16,5; 7,1 -> 16; 6,6 | oranžna
črta: 16,5; 7,1 -> 16,5; 5,1 -> 16; 4,6 | oranžna
pravokotnik: 16,6; 4,6 .. 18,6; 6,6 | oranžna
črta: 16,6; 6,6 -> 17,1; 7,1 -> 19,1; 7,1 -> 18,6; 6,6 | oranžna
črta: 19,1; 7,1 -> 19,1; 5,1 -> 18,6; 4,6 | oranžna
napis: 13,7; 0,8 | 8 kock, rob 1 cm: 48 cm^2 | sredina
:::

:::premisli
Magnezijev trak enkrat potopiš v klorovodikovo kislino s koncentracijo $1\,\mathrm{mol/L}$, drugič v kislino z $2\,\mathrm{mol/L}$. Napovej, kako se bo razlikovalo šumenje. Kaj se v bolj koncentrirani kislini spremeni: hitrost delcev kisline, njihova energija ali njihovo število?
---
V bolj koncentrirani kislini šumi močneje. V istem prostoru je dvakrat več delcev kisline, zato ti v sekundi pogosteje zadenejo površino magnezija in v sekundi nastane več vodika.
:::

**Temperatura deluje močneje, kot bi pričakoval.** Pri segrevanju z $20\,^\circ\mathrm{C}$ na $30\,^\circ\mathrm{C}$ se delci gibljejo le približno $2\,\%$ hitreje. Pa vendar se hitrost mnogih reakcij pri tem približno podvoji. Temu pravimo **pravilo $10\,^\circ\mathrm{C}$** (van 't Hoffovo pravilo). Velja le približno.

V simulaciji spodaj »Hitrost reakcije in trki delcev« nastavi $25$ delcev in primerjaj $0\,^\circ\mathrm{C}$ s $100\,^\circ\mathrm{C}$. Pri višji temperaturi pričakuj večji odstotek uspešnih trkov v izpisu in strmejši padec grafa števila delcev A. Delcev je malo, zato odstotek od teka do teka niha: poskus pri vsaki temperaturi ponovi dvakrat ali trikrat z gumbom Znova in primerjaj tudi čas, v katerem zreagira polovica delcev A.

:::premisli
Zakaj se hitrost podvoji, čeprav so delci hitrejši le za okoli $2\,\%$ in je tudi trkov le malo več?
---
Ker ne šteje število trkov, ampak število *uspešnih* trkov. Delež delcev z energijo vsaj $E_\mathrm{a}$ je majhen in z višanjem temperature hitro raste: že malo več energije prevede čez vrh hriba veliko več delcev.
:::

Slika kaže, kako je energija razdeljena med delci: večina delcev ima malo energije (vrh krivulje je pri približno $1{,}2\,\mathrm{kJ/mol}$), vse manj delcev pa veliko. Vsa ploščina pod krivuljo so vsi delci; osenčeni rep desno od črtkane črte $E_\mathrm{a}$ je delež delcev, ki lahko reagirajo. Za risbo je izbran nizek hrib, $E_\mathrm{a} = 10\,\mathrm{kJ/mol}$, da se rep sploh vidi: pri $20\,^\circ\mathrm{C}$ je v njem $4{,}19\,\%$ delcev. Siva črtkana krivulja kaže iste delce pri $100\,^\circ\mathrm{C}$: nižja je in raztegnjena v desno, njen rep je debelejši.

:::risba graf
opis: Porazdelitev energije delcev. Krivulja se od nič hitro dvigne do vrha pri majhni energiji in nato položno pada proti desni. Navpična črtkana črta označuje aktivacijsko energijo {a} kJ/mol; osenčeni rep desno od nje so delci z dovolj energije. V aplikaciji se z drsnikoma spreminjata temperatura in aktivacijska energija. Pri {T} °C in aktivacijski energiji {a} kJ/mol je v repu {100*(((1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(0.254829592+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(-0.284496736+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(1.421413741+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(-1.453152027+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*1.061405429)))))*exp(-a/(0.008314*(T+273.15)))+1.1283792*sqrt(a/(0.008314*(T+273.15)))*exp(-a/(0.008314*(T+273.15)))):.2} % delcev. Siva črtkana krivulja kaže za primerjavo porazdelitev pri 100 °C: je nižja in raztegnjena v desno, njen rep je debelejši.
x: 0 .. 40 | 5 | energija (kJ/mol)
y: 0 .. 22 | 22 | število delcev
višina: 220
oznake: ne
oznakax: 0 | 0
oznakax: 10 | 10
oznakax: 20 | 20
oznakax: 30 | 30
drsnik: T | 20 .. 100 | 10 | 20 | temperatura v °C
drsnik: a | 6 .. 20 | 2 | 10 | aktivacijska energija v kJ/mol
lik: a; 0 -> a+0; 100*1.1283792*sqrt(a+0)*exp(-(a+0)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+1; 100*1.1283792*sqrt(a+1)*exp(-(a+1)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+2; 100*1.1283792*sqrt(a+2)*exp(-(a+2)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+3; 100*1.1283792*sqrt(a+3)*exp(-(a+3)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+4; 100*1.1283792*sqrt(a+4)*exp(-(a+4)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+5; 100*1.1283792*sqrt(a+5)*exp(-(a+5)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+6; 100*1.1283792*sqrt(a+6)*exp(-(a+6)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+8; 100*1.1283792*sqrt(a+8)*exp(-(a+8)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+10; 100*1.1283792*sqrt(a+10)*exp(-(a+10)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+13; 100*1.1283792*sqrt(a+13)*exp(-(a+13)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+16; 100*1.1283792*sqrt(a+16)*exp(-(a+16)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) -> a+16; 0 | oranžna polno
f: 100*1.1283792*sqrt(x)*exp(-(x)/(0.008314*(373.15)))/((0.008314*(373.15))*sqrt((0.008314*(373.15)))) | siva črtkano
f: 100*1.1283792*sqrt(x)*exp(-(x)/(0.008314*(T+273.15)))/((0.008314*(T+273.15))*sqrt((0.008314*(T+273.15)))) | modra
črta: a; 0 -> a; 12,5 | črtkano
napis: a; 14,5 | E_a = {a} | desno
napis: 39; 20,5 | dovolj energije: {100*(((1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(0.254829592+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(-0.284496736+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(1.421413741+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(-1.453152027+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*1.061405429)))))*exp(-a/(0.008314*(T+273.15)))+1.1283792*sqrt(a/(0.008314*(T+273.15)))*exp(-a/(0.008314*(T+273.15)))):.2} % | levo | oranžna
napis: 39; 17,5 | črtkano: 100 °C | levo | siva
podnapis: Pri {T} °C in aktivacijski energiji {a} kJ/mol ima dovolj energije {100*(((1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(0.254829592+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(-0.284496736+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(1.421413741+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*(-1.453152027+(1/(1+0.3275911*sqrt(a/(0.008314*(T+273.15)))))*1.061405429)))))*exp(-a/(0.008314*(T+273.15)))+1.1283792*sqrt(a/(0.008314*(T+273.15)))*exp(-a/(0.008314*(T+273.15)))):.2} % delcev.
:::

V aplikaciji premakni drsnik temperature na $100\,^\circ\mathrm{C}$. Modra krivulja se premakne na črtkano; ploščina pod njo ostane enaka, rep pa zraste na $9{,}18\,\%$, več kot dvakrat. Nato vrni temperaturo na $20\,^\circ\mathrm{C}$ in $E_\mathrm{a}$ pomakni na $20\,\mathrm{kJ/mol}$: rep skoraj izgine ($0{,}09\,\%$). Višji ko je hrib, manjši je rep in hitreje raste s temperaturo. Pri hribu, visokem okoli $50\,\mathrm{kJ/mol}$, se rep pri segrevanju za $10\,^\circ\mathrm{C}$ približno podvoji: od tod pravilo $10\,^\circ\mathrm{C}$.

**Katalizator.** Katalizator je snov, ki reakcijo pospeši, sama pa se pri tem ne porabi: med reakcijo sodeluje, na koncu pa se obnovi. Reakciji ponudi drugo pot z nižjo aktivacijsko energijo, kot nižji prelaz čez hrib.

Na energijskem diagramu je to črtkana krivulja: vrh je pri $49\,\mathrm{kJ/mol}$ namesto pri $75\,\mathrm{kJ/mol}$, začetek in konec sta ista. Na sliki porazdelitve energije v aplikaciji pomakni $E_\mathrm{a}$ z $10\,\mathrm{kJ/mol}$ na $6\,\mathrm{kJ/mol}$: rep zraste s $4{,}19\,\%$ na $17{,}75\,\%$, čeprav je temperatura ista.

Katalizator ne spremeni končne količine produkta in ne sproščene energije.

Primeri: manganov(IV) oksid $\mathrm{MnO_2}$ pospeši razkroj vodikovega peroksida, platina v avtomobilskem katalizatorju pretvarja strupeni $\mathrm{CO}$ v $\mathrm{CO_2}$ (reakcija poteka na njeni površini, zato je tam nanesena v drobnih delcih), platina tudi vžge zmes vodika in kisika brez iskre. Biološkim katalizatorjem pravimo **encimi**. Katalaza v krvi zniža hrib razkroja vodikovega peroksida pod $10\,\mathrm{kJ/mol}$; amilaza v slini razgrajuje škrob.

**Na koncu še simboli.** Povprečno hitrost v časovnem intervalu zapišemo kot spremembo koncentracije, deljeno s časom:

$$v = \frac{|\Delta c|}{\Delta t}$$

Enota je $\mathrm{mol/(L \cdot s)}$. Ker se koncentracija reaktanta zmanjšuje, je $\Delta c$ negativna; absolutno vrednost pišemo, da je hitrost pozitivna. Kadar merimo plin, uporabimo kar prostornino na čas, na primer $\mathrm{mL/s}$. Vedno povej, katero snov spremljaš: pri $\mathrm{Mg + 2\,HCl \rightarrow MgCl_2 + H_2}$ se kislina porablja dvakrat hitreje (v molih), kot nastaja vodik.

Graf kaže meritve iz primera 2 spodaj: koncentracija kisline pada vedno počasneje in se približuje $0{,}75\,\mathrm{mol/L}$, ko zmanjka magnezija. Črtkana stopnica kaže $\Delta t = 120\,\mathrm{s}$ in padec $\Delta c$; strmejša ko je oranžna daljica, večja je povprečna hitrost. V prvem intervalu je padec $0{,}30\,\mathrm{mol/L}$, hitrost pa $0{,}0025\,\mathrm{mol/(L \cdot s)}$. V aplikaciji pomikaj drsnik začetka intervala proti $480\,\mathrm{s}$ in opazuj, kako se daljica polaga: tam je hitrost le še $0{,}0003\,\mathrm{mol/(L \cdot s)}$.

:::risba graf
opis: Graf koncentracije kisline v odvisnosti od časa. Krivulja pada od 1,50 mol/L vedno položneje proti 0,75 mol/L. Oranžna daljica gre skozi točki na krivulji na začetku in koncu intervala, dolgega 120 s, in je podaljšana v desno; siva črtkana vodoravnica označuje 0,75 mol/L; črtkana stopnica od prve točke vodoravno v desno in nato navzdol kaže dolžino intervala Δt in padec koncentracije Δc. V aplikaciji se z drsnikom izbira začetek intervala. Od {t} s do {t+120} s koncentracija pade za {(0.75+0.75*exp(-0.5108256*(t)/120))-(0.75+0.75*exp(-0.5108256*(t+120)/120)):.2} mol/L, povprečna hitrost je {((0.75+0.75*exp(-0.5108256*(t)/120))-(0.75+0.75*exp(-0.5108256*(t+120)/120)))/120:.4} mol/(L·s).
x: 0 .. 720 | 120 | t (s)
y: 0 .. 1,8 | 0,2 | c (mol/L)
višina: 220
drsnik: t | 0 .. 480 | 60 | 0 | začetek intervala v sekundah
f: (0.75+0.75*exp(-0.5108256*(x)/120)) | modra
črta: t; (0.75+0.75*exp(-0.5108256*(t)/120)) -> t+120; (0.75+0.75*exp(-0.5108256*(t)/120)) -> t+120; (0.75+0.75*exp(-0.5108256*(t+120)/120)) | črtkano
črta: t; (0.75+0.75*exp(-0.5108256*(t)/120)) -> t+240; 2*(0.75+0.75*exp(-0.5108256*(t+120)/120))-(0.75+0.75*exp(-0.5108256*(t)/120)) | oranžna debelo
točka: t; (0.75+0.75*exp(-0.5108256*(t)/120)) | | | oranžna
napis: t+60; (0.75+0.75*exp(-0.5108256*(t)/120)) | Δt | nad
napis: t+120; ((0.75+0.75*exp(-0.5108256*(t)/120))+(0.75+0.75*exp(-0.5108256*(t+120)/120)))/2 | Δc | nad desno
črta: 0; 0,75 -> 720; 0,75 | siva črtkano
napis: 10; 0,75 | 0,75: zmanjka magnezija | pod desno
točka: t+120; (0.75+0.75*exp(-0.5108256*(t+120)/120)) | | | oranžna
podnapis: Od {t} s do {t+120} s: padec {(0.75+0.75*exp(-0.5108256*(t)/120))-(0.75+0.75*exp(-0.5108256*(t+120)/120)):.2} mol/L, hitrost {((0.75+0.75*exp(-0.5108256*(t)/120))-(0.75+0.75*exp(-0.5108256*(t+120)/120)))/120:.4} mol/(L·s).
:::

## Rešeni primeri

### Primer 1: trak ali prah

Enako maso magnezija damo v enako kislino. Trak da $45\,\mathrm{mL}$ vodika v $30\,\mathrm{s}$, prah enako prostornino v $9\,\mathrm{s}$. Kolikšni sta povprečni hitrosti nastajanja vodika in kolikokrat je reakcija s prahom hitrejša?

**Podatki:** $V = 45\,\mathrm{mL}$, $t_\mathrm{trak} = 30\,\mathrm{s}$, $t_\mathrm{prah} = 9\,\mathrm{s}$, masa in kislina enaki
**Iščemo:** hitrosti $v_\mathrm{trak}$, $v_\mathrm{prah}$ in njuno razmerje

:::formula
$v = \dfrac{V}{t}$ (prostornina plina na čas)
:::

**Rešitev:**

1. Trak: $v_\mathrm{trak} = \dfrac{45\,\mathrm{mL}}{30\,\mathrm{s}} = 1{,}5\,\mathrm{mL/s}$, ker hitrost pove prostornino plina na sekundo.
2. Prah: $v_\mathrm{prah} = \dfrac{45\,\mathrm{mL}}{9\,\mathrm{s}} = 5\,\mathrm{mL/s}$; enaka prostornina v krajšem času pomeni večjo hitrost.
3. Razmerje: $\dfrac{5}{1{,}5} \approx 3{,}3$; razlog je večja površina prahu, saj je masa enaka.
4. Odgovor: trak daje $1{,}5\,\mathrm{mL/s}$, prah $5\,\mathrm{mL/s}$ vodika, torej je reakcija s prahom približno $3{,}3$-krat hitrejša.

### Primer 2: hitrost se s časom manjša

Pri reakciji magnezija s klorovodikovo kislino izmerimo koncentracijo kisline. Na začetku je $1{,}50\,\mathrm{mol/L}$, po $120\,\mathrm{s}$ je $1{,}20\,\mathrm{mol/L}$, po nadaljnjih $120\,\mathrm{s}$ pa $1{,}02\,\mathrm{mol/L}$. Izračunaj povprečno hitrost porabljanja kisline v obeh intervalih in pojasni razliko.

**Podatki:** $c_0 = 1{,}50\,\mathrm{mol/L}$, $c_1 = 1{,}20\,\mathrm{mol/L}$, $c_2 = 1{,}02\,\mathrm{mol/L}$, $\Delta t = 120\,\mathrm{s}$ za vsak interval
**Iščemo:** $v_1$ in $v_2$

:::formula
$v = \dfrac{|\Delta c|}{\Delta t}$
:::

**Rešitev:**

1. Prvi interval: $|\Delta c| = 1{,}50 - 1{,}20 = 0{,}30$, torej $0{,}30\,\mathrm{mol/L}$; odštejemo končno od začetne, ker nas zanima, koliko kisline se je porabilo.
2. $v_1 = \dfrac{0{,}30\,\mathrm{mol/L}}{120\,\mathrm{s}} = 0{,}0025\,\mathrm{mol/(L \cdot s)}$; delimo s časom intervala, ker hitrost pove porabo na sekundo.
3. Drugi interval: $|\Delta c| = 1{,}20 - 1{,}02 = 0{,}18$, torej $0{,}18\,\mathrm{mol/L}$.
4. $v_2 = \dfrac{0{,}18\,\mathrm{mol/L}}{120\,\mathrm{s}} = 0{,}0015\,\mathrm{mol/(L \cdot s)}$.
5. Hitrost je padla iz dveh razlogov: kisline je manj (manj trkov v sekundi) in magnezija je manj, zato je manjša tudi njegova površina.
6. Odgovor: v prvih dveh minutah se kislina porablja s hitrostjo $0{,}0025\,\mathrm{mol/(L \cdot s)}$, v naslednjih dveh le $0{,}0015\,\mathrm{mol/(L \cdot s)}$.

### Primer 3: pevka in šumeča tableta

Pevka Ana si pred koncertom pripravi šumečo tableto. V vodi z $20\,^\circ\mathrm{C}$ šumenje traja $80\,\mathrm{s}$. Po pravilu $10\,^\circ\mathrm{C}$ oceni: (a) koliko časa bi šumelo v vodi s $40\,^\circ\mathrm{C}$; (b) kako topla bi morala biti voda, da bi bila tableta raztopljena v $10\,\mathrm{s}$. (c) Pravilo preveri s poskusom za domačo rabo (Scientific American, »Carbonation Countdown«): šumeča tableta Alka-Seltzer v ledeni vodi večinoma izgine v $2$ do $3$ minutah, v vroči vodi iz pipe pa v $20$ do $30\,\mathrm{s}$. Članek temperatur ne navaja; vzemi okoli $0\,^\circ\mathrm{C}$ in okoli $50\,^\circ\mathrm{C}$.

**Podatki:** $T_1 = 20\,^\circ\mathrm{C}$, $t_1 = 80\,\mathrm{s}$, $T_2 = 40\,^\circ\mathrm{C}$, želeni čas $t_3 = 10\,\mathrm{s}$; poskus: $2$ do $3\,\mathrm{min}$ (okoli $0\,^\circ\mathrm{C}$), $20$ do $30\,\mathrm{s}$ (okoli $50\,^\circ\mathrm{C}$)
**Iščemo:** čas $t_2$, temperaturo $T_3$ in primerjavo pravila s poskusom

:::formula
Vsakih $+10\,^\circ\mathrm{C}$ se hitrost približno podvoji, zato se čas razpolovi.
:::

**Rešitev:**

1. Z $20\,^\circ\mathrm{C}$ na $40\,^\circ\mathrm{C}$ sta dva koraka po $10\,^\circ\mathrm{C}$, hitrost se poveča $2 \cdot 2 = 4$-krat.
2. Čas je obratno sorazmeren s hitrostjo: $t_2 = \dfrac{80\,\mathrm{s}}{4} = 20\,\mathrm{s}$.
3. Za (b): čas se mora skrajšati $\dfrac{80\,\mathrm{s}}{10\,\mathrm{s}} = 8$-krat.
4. $8 = 2 \cdot 2 \cdot 2$, torej potrebujemo tri podvojitve, to je $3 \cdot 10\,^\circ\mathrm{C} = 30\,^\circ\mathrm{C}$ več.
5. $T_3 = 20\,^\circ\mathrm{C} + 30\,^\circ\mathrm{C} = 50\,^\circ\mathrm{C}$.
6. Za (c): razlika $50\,^\circ\mathrm{C}$ je pet korakov, pravilo bi napovedalo $2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$-krat hitrejše šumenje.
7. Poskus s srednjima vrednostma $150\,\mathrm{s}$ in $25\,\mathrm{s}$ da $\dfrac{150\,\mathrm{s}}{25\,\mathrm{s}} = 6$-krat hitreje, veliko manj kot $32$-krat: približno $1{,}4$-krat na vsakih $10\,^\circ\mathrm{C}$ namesto $2$-krat.
8. Odgovor: po pravilu bi tableta pri $40\,^\circ\mathrm{C}$ šumela okoli $20\,\mathrm{s}$, za $10\,\mathrm{s}$ pa bi potrebovali približno $50\,^\circ\mathrm{C}$. Poskus kaže, da pravilo pri šumeči tableti vpliv temperature preceni: okoli $6$-krat namesto $32$-krat. Pravilo $10\,^\circ\mathrm{C}$ je groba ocena, ne zakon.

### Primer 4: zdaj ti – platina in vodikov peroksid

Za razkroj vodikovega peroksida so izmerili: brez katalizatorja je aktivacijska energija približno $75\,\mathrm{kJ/mol}$, s platino približno $49\,\mathrm{kJ/mol}$. Pri razkroju se sprosti $98\,\mathrm{kJ/mol}$. V raztopino peroksida damo $0{,}5\,\mathrm{g}$ platine. (a) Za koliko platina zniža energijski hrib? (b) Koliko energije se sprosti s platino? (c) Koliko platine je v posodi po reakciji? (d) Zakaj je reakcija s platino hitrejša, čeprav se sprosti enako energije? (e) Na sliki porazdelitve energije odčitaj deleža repa pri $20\,^\circ\mathrm{C}$ za $E_\mathrm{a} = 10\,\mathrm{kJ/mol}$ in $6\,\mathrm{kJ/mol}$. Kolikokrat se rep poveča?

**Podatki:** $E_\mathrm{a} = 75\,\mathrm{kJ/mol}$ brez katalizatorja, $E_\mathrm{a} = 49\,\mathrm{kJ/mol}$ s platino, sproščena energija $98\,\mathrm{kJ/mol}$, $m(\mathrm{Pt}) = 0{,}5\,\mathrm{g}$
**Iščemo:** znižanje hriba, sproščeno energijo s platino, maso platine po reakciji, razlog za večjo hitrost in povečanje repa

:::formula
Znižanje hriba je razlika aktivacijskih energij. Katalizator ne premakne reaktantov in produktov na energijskem hribu in se ne porabi.
:::

**Rešitev:**

1. Na sliki energijskega hriba se krivulji razlikujeta le v višini vrha; začetek in konec sta ista.
2. Izračunaj razliko vrhov in odgovori še na (b), (c), (d) in (e):

:::premisli
Koliko je $75\,\mathrm{kJ/mol} - 49\,\mathrm{kJ/mol}$? Kaj se s katalizatorjem ne spremeni? Kolikšno je razmerje obeh repov?
---
$75 - 49 = 26$: platina zniža hrib za $26\,\mathrm{kJ/mol}$. Sprosti se enako, $98\,\mathrm{kJ/mol}$, ker sta reaktanti in produkti na isti višini. Platine je še vedno $0{,}5\,\mathrm{g}$, ker se katalizator ne porabi. Hitrejša je, ker ima ob nižjem vrhu pri isti temperaturi dovolj energije veliko večji delež delcev. Slika to pokaže na nizkem hribu: rep zraste s $4{,}19\,\%$ na $17{,}75\,\%$, to je $\dfrac{17{,}75}{4{,}19} \approx 4{,}2$-krat, čeprav se hrib zniža le za $4\,\mathrm{kJ/mol}$.
:::

## Pogoste napake

- **»Vsak trk je reakcija.«** Če bi to veljalo, bi zmes vodika in kisika eksplodirala sama od sebe. Uspešen je le trk z energijo vsaj $E_\mathrm{a}$ in pravo usmerjenostjo.
- **»Toplota pomaga le zato, ker je trkov več.«** Trkov je pri $+10\,^\circ\mathrm{C}$ le približno $2\,\%$ več, hitrost pa se podvoji. Odločilno je, da ima več delcev dovolj energije.
- **»Katalizator se porabi« ali »katalizator da več produkta«.** Katalizator se na koncu obnovi; produkta nastane enako, le prej.
- **»Segrevanje zniža hrib« ali »katalizator da delcem več energije«.** Ravno obratno: segrevanje poveča energijo delcev, hrib ostane enak; katalizator zniža hrib, energija delcev ostane enaka.
- **»Hitrost je ves čas enaka.«** Ko se reaktanti porabljajo, koncentracija raztopljenih pada, trdnega reaktanta in njegove površine pa je vse manj. Reakcija se zato upočasnjuje.

## Povzetek

- Reakcija poteče le ob uspešnem trku: dovolj energije (vsaj aktivacijska energija $E_\mathrm{a}$) in prava usmerjenost.
- Hitrost reakcije je sprememba koncentracije (ali količine produkta) v času: $v = \dfrac{|\Delta c|}{\Delta t}$, enota $\mathrm{mol/(L \cdot s)}$.
- Hitrost povečajo: večja koncentracija, višja temperatura, bolj razdrobljena trdna snov in katalizator; odvisna je tudi od narave snovi.
- Pravilo $10\,^\circ\mathrm{C}$: hitrost se približno podvoji, ker raste delež delcev z dovolj energije.
- Katalizator zniža aktivacijsko energijo, se ne porabi in ne spremeni produktov niti sproščene energije.

## Drugače: Z analogijo

Pomisli na klavirsko tipko. Če jo pritisneš zelo nežno, kladivce ne doseže strune in tona ni. Za ton mora biti pritisk dovolj močan: to je aktivacijska energija.

- **Višja temperatura** je kot pianist, ki igra močneje: veliko več pritiskov preseže prag, čeprav jih ni bistveno več.
- **Katalizator** je kot lažja mehanika klavirja: kladivce doseže struno že pri nežnejšem pritisku.

## Drugače: Iz vsakdanjega življenja

- **Hladilnik:** pri $4\,^\circ\mathrm{C}$ potekajo reakcije, zaradi katerih se hrana kvari, nekajkrat počasneje kot pri sobni temperaturi.
- **Kurjenje:** poleno se vžge težko, trske hitro, žagovina ali moka v zraku pa lahko eksplodira.
- **Rana:** vodikov peroksid se na rani peni, ker katalaza v krvi pospeši njegov razkroj.

## Preveri se

? Z energijskega diagrama odčitaj aktivacijsko energijo reakcije s katalizatorjem.
:::risba graf
opis: Energijski diagram reakcije z mrežo na vsakih 20 kJ/mol. Reaktanti so na višini 20 kJ/mol, produkti na −60 kJ/mol. Polna krivulja ima vrh pri 120 kJ/mol, črtkana krivulja z vrhom pri 60 kJ/mol pripada isti reakciji s katalizatorjem.
x: 0 .. 10 | 10 | potek reakcije
y: -120 .. 140 | 20 | energija (kJ/mol)
višina: 240
f: 20 | modra | 0 .. 2
f: 20+100*(1-cos(pi*(x-2)/3))/2 | modra | 2 .. 5
f: 120-180*(1-cos(pi*(x-5)/3))/2 | modra | 5 .. 8
f: -60 | modra | 8 .. 10
f: 20+40*(1-cos(pi*(x-2)/3))/2 | oranžna črtkano | 2 .. 5
f: 60-120*(1-cos(pi*(x-5)/3))/2 | oranžna črtkano | 5 .. 8
napis: 0,2; 8 | reaktanti | desno
napis: 9,8; -72 | produkti | levo
napis: 0,2; -88 | polna: brez katalizatorja | desno
napis: 0,2; -108 | črtkana: s katalizatorjem | desno | oranžna
:::
= 40 kJ/mol | 2
~ 60 | Odčital si višino vrha od ničle. Aktivacijska energija se meri od ravni reaktantov, ki so pri $20\,\mathrm{kJ/mol}$.
~ 100 | To je aktivacijska energija brez katalizatorja (polna krivulja).
~ 80 | To je sproščena energija, razlika med reaktanti in produkti. Katalizator je ne spremeni.
> Aktivacijska energija je višina vrha nad reaktanti. Črtkana krivulja ima vrh pri $60\,\mathrm{kJ/mol}$, reaktanti so pri $20\,\mathrm{kJ/mol}$: $60 - 20 = 40$, torej $40\,\mathrm{kJ/mol}$.

? Enako maso magnezija damo v klorovodikovo kislino. Razvrsti poskuse od najhitrejše do najpočasnejše reakcije.
1. prah, $2\,\mathrm{mol/L}$, $40\,^\circ\mathrm{C}$
2. prah, $2\,\mathrm{mol/L}$, $20\,^\circ\mathrm{C}$
3. prah, $1\,\mathrm{mol/L}$, $20\,^\circ\mathrm{C}$
4. trak, $1\,\mathrm{mol/L}$, $20\,^\circ\mathrm{C}$
> Vsak naslednji poskus izgubi eno prednost: najprej višjo temperaturo, nato večjo koncentracijo, nazadnje večjo površino prahu.

? Kaj se zgodi, če reakcijsko zmes segrejemo za $10\,^\circ\mathrm{C}$, vse drugo pa ostane enako?
- Trkov je približno dvakrat več, zato je reakcija dvakrat hitrejša.
~ Delci so le okoli $2\,\%$ hitrejši, zato je trkov le malo več.
+ Delež delcev z energijo vsaj $E_\mathrm{a}$ močno zraste, zato je uspešnih trkov veliko več.
- Aktivacijska energija se zniža.
~ Višina hriba je lastnost reakcije. Zniža jo katalizator, ne segrevanje.
- Vsak trk postane uspešen.
~ Tudi pri višji temperaturi ima večina delcev premalo energije.
> Segrevanje ne zniža hriba in trkov skoraj ne pomnoži. Poveča rep delcev z dovolj energije.

? Koncentracija reaktanta je na začetku $0{,}80\,\mathrm{mol/L}$, po $60\,\mathrm{s}$ je $0{,}50\,\mathrm{mol/L}$, po $120\,\mathrm{s}$ pa $0{,}32\,\mathrm{mol/L}$. Kolikšna je povprečna hitrost reakcije v drugi minuti?
= 0,0030 mol/(L·s) | 0,0001
~ 0,0050 | To je hitrost v prvi minuti. Hitrost ni ves čas enaka.
~ 0,18 | To je le sprememba koncentracije v drugi minuti. Hitrost je sprememba, deljena s časom.
~ 0,0040 | To je povprečje čez obe minuti skupaj. Vprašanje sprašuje samo po drugi minuti.
> V drugi minuti je $|\Delta c| = 0{,}50 - 0{,}32 = 0{,}18$, torej $v = \dfrac{0{,}18\,\mathrm{mol/L}}{60\,\mathrm{s}} = 0{,}0030\,\mathrm{mol/(L \cdot s)}$.

? Reakciji dodamo katalizator, temperatura ostane enaka. Kaj se zgodi?
- Delci dobijo več energije, zato jih več pride čez hrib.
~ Energijo delcev določa temperatura. Katalizator zniža hrib, delci ostanejo enako hitri.
- Nastane več produkta.
~ Katalizator ne spremeni, koliko produkta nastane. Isto količino dobimo le prej.
+ Aktivacijska energija se zniža, zato je uspešnih trkov več.
- Katalizator se porabi kot reaktant.
~ Reaktant se porablja. Katalizator med reakcijo sodeluje in se na koncu obnovi.
> Katalizator ponudi pot z nižjim vrhom; začetek in konec ostaneta enaka.

? Reakcija pri $20\,^\circ\mathrm{C}$ traja $120\,\mathrm{s}$. Koliko sekund približno traja pri $50\,^\circ\mathrm{C}$, če velja pravilo $10\,^\circ\mathrm{C}$?
= 15 s | 0,5
~ 40 | Tri korake po $10\,^\circ\mathrm{C}$ si štel kot trikrat hitrejšo reakcijo. Vsak korak hitrost podvoji: $2 \cdot 2 \cdot 2 = 8$.
~ 30 | To sta le dve podvojitvi, potrebne so tri.
~ 360 | Pri višji temperaturi je reakcija hitrejša, zato traja manj časa, ne več.
> Trije koraki po $10\,^\circ\mathrm{C}$ pomenijo $8$-krat večjo hitrost, zato čas $\dfrac{120\,\mathrm{s}}{8} = 15\,\mathrm{s}$.

:::simboli
v | hitrost reakcije | v = \frac{\lvert \Delta c \rvert}{\Delta t} | mol/(L s) | pri merjenju plina v = V : t, v mL/s
c | množinska koncentracija | | mol/L | Δc je pri reaktantu negativna, pri produktu pozitivna
m | masa | | g
t | čas | | s | v primerih 1 in 3 trajanje reakcije
T | temperatura | | ^\circ\mathrm{C}
V | prostornina nastalega plina | | mL
E_\mathrm{a} | aktivacijska energija | | kJ/mol | višina energijskega hriba nad reaktanti
\Delta H | reakcijska entalpija | | kJ/mol | negativna, ko se energija sprosti
:::
