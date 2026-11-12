---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na soparen poletni dan tekači pravijo, da je zrak »težak«. Kemik bi jim odgovoril presenetljivo: liter vlažnega zraka ima **manjšo** maso kot liter suhega zraka pri enaki temperaturi in tlaku. Voda v zraku ga torej olajša.

Zveni narobe, saj vodo vsi poznamo kot težko tekočino. Ključ je v tem, kako se obnašajo plini. V plinu so molekule daleč narazen, zato prostor, ki ga plin zavzame, skoraj ni odvisen od velikosti molekul, ampak od njihovega **števila**. Ko to razumeš, znaš izračunati tlak v kolesarski pnevmatiki, nevarno globino za potapljača in tudi to, zakaj je soparni zrak lažji. Na tekmovanjih so plini skoraj vedno del naloge s stehiometrijo.

## Razlaga

**1. En mol vsakega plina zavzame enak prostor.** Pri $0\,\mathrm{°C}$ in tlaku $101{,}3\,\mathrm{kPa}$ stehtamo po en mol treh plinov:

| plin | masa 1 mol | prostornina |
|---|---|---|
| vodik $\mathrm{H_2}$ | $2{,}0\,\mathrm{g}$ | $22{,}4\,\mathrm{L}$ |
| dušik $\mathrm{N_2}$ | $28{,}0\,\mathrm{g}$ | $22{,}4\,\mathrm{L}$ |
| ogljikov dioksid $\mathrm{CO_2}$ | $44{,}0\,\mathrm{g}$ | $22{,}4\,\mathrm{L}$ |

Mase se razlikujejo več kot dvajsetkrat, prostornine so enake. To je **Avogadrov zakon**: enake prostornine plinov pri enaki temperaturi in tlaku vsebujejo enako število delcev. Prostornina enega mola je **molski volumen** $V_m$ (iz šole ga poznaš tudi kot molsko prostornino). Pri $0\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$ (normalni pogoji) je $22{,}4\,\mathrm{L/mol}$, kar je približno prostornina treh košarkarskih žog. Pri $25\,\mathrm{°C}$ in enakem tlaku je $24{,}5\,\mathrm{L/mol}$.

$$V_m = \frac{V}{n}$$

**2. Temperatura: zakaj kelvini.** Graf kaže, kako se pri stalnem tlaku $101{,}3\,\mathrm{kPa}$ spreminja prostornina enega mola plina s temperaturo:

:::risba graf
opis: Prostornina enega mola plina pri tlaku 101,3 kPa v odvisnosti od temperature v stopinjah Celzija. Premica gre skozi točke 0 °C in 22,4 L, 25 °C in 24,5 L ter 100 °C in 30,6 L. Podaljšana črtkano seka vodoravno os pri −273 °C.
x: -300 .. 100 | 50 | t v °C
y: 0 .. 35 | 5 | V v L
črta: -273; 0 -> -150; 10,1 | črtkano
črta: -150; 10,1 -> 100; 30,6 | modra
točka: 0; 22,4 | 22,4 L | levo
točka: 100; 30,6 | 30,6 L | levo
točka: -273; 0 | −273 °C | nad desno
:::

Točke ležijo na premici. Če jo podaljšamo (črtkani del), doseže prostornina nič pri $-273{,}15\,\mathrm{°C}$. Nižje temperature ni. Zato temperaturo v plinskih zakonih merimo od te točke, v **kelvinih**: $T = t + 273{,}15$. Tako merjeni temperaturi pravimo **termodinamična temperatura**. V kelvinih je prostornina premo sorazmerna s temperaturo.

:::premisli
Balon pri stalnem tlaku ohladiš z $20\,\mathrm{°C}$ na $0\,\mathrm{°C}$. Kaj bi napovedal za njegovo prostornino, če bi namesto kelvinov uporabil stopinje Celzija? Zakaj je to nesmisel?
---
Temperatura bi padla na nič, torej bi morala pasti na nič tudi prostornina: balon bi izginil. V resnici se prostornina zmanjša le za približno $7\,\%$, ker se termodinamična temperatura spremeni z $293{,}15\,\mathrm{K}$ na $273{,}15\,\mathrm{K}$. Celzijeva ničla je izbrana po ledišču vode in za pline nima posebnega pomena.
:::

**3. Splošna plinska enačba.** Iz poskusov vemo: več plina pomeni večjo prostornino, višja temperatura večjo prostornino, višji tlak manjšo. Vse skupaj združuje **splošna plinska enačba**

$$pV = nRT$$

kjer je $R = 8{,}314\,\mathrm{\dfrac{kPa \cdot L}{mol \cdot K}}$ splošna plinska konstanta. Če tlak vstaviš v kilopaskalih in prostornino v litrih, se enote ujemajo. Iz nje sledi tudi molski volumen: pri $273{,}15\,\mathrm{K}$ in $101{,}3\,\mathrm{kPa}$ je $\frac{RT}{p} = 22{,}4\,\mathrm{L/mol}$.

Kadar se množina plina ne spremeni (zaprta žoga, pnevmatika), je $\frac{pV}{T}$ stalen, saj je enak $nR$. Za začetno (1) in končno (2) stanje velja

$$\frac{p_1 V_1}{T_1} = \frac{p_2 V_2}{T_2}$$

V simulaciji spodaj (»Plinska enačba«) drži prostornino stalno in temperaturo v kelvinih podvoji (prostornina je tam v $\mathrm{dm^3}$, kar je isto kot liter). Opazuj število udarcev delcev ob steno in tlak: oboje se poveča, tlak natanko na dvojno.

**4. Gostota plina.** Če v $pV = nRT$ vstaviš $n = \frac{m}{M}$ in izraziš $\frac{m}{V}$, dobiš gostoto:

$$\rho = \frac{pM}{RT}$$

Pri isti temperaturi in tlaku je liter plina tem težji, čim večja je molska masa njegovih molekul. Zato helijev balon lebdi, balon z $\mathrm{CO_2}$ pa pade na tla.

**5. Zmesi plinov.** Zrak je zmes. Vsak plin v zmesi se obnaša, kot da bi bil v posodi sam: trka ob stene in prispeva svoj **delni tlak** $p_i$. Delni tlaki se seštejejo v skupni tlak (Daltonov zakon). Pri zraku s tlakom $100\,\mathrm{kPa}$:

:::risba stolpci
opis: Delni tlaki v zraku pri skupnem tlaku 100 kPa. Dušik 78 kPa, kisik 21 kPa, argon 1 kPa.
stolpec: N_2 | 78
stolpec: O_2 | 21
stolpec: Ar | 1
os: delni tlak v kPa
korak: 10
:::

Delni tlak je sorazmeren s številom molekul, torej z **molskim deležem** (v učbenikih tudi množinski delež) $x_i = \frac{n_i}{n}$:

$$p_i = x_i \, p$$

Zmes ima **povprečno molsko maso** $\bar{M} = x_1 M_1 + x_2 M_2 + \ldots$. Za zrak je približno $29\,\mathrm{g/mol}$.

:::premisli
V litru suhega zraka nekaj molekul dušika in kisika zamenjamo z molekulami vode, temperatura in tlak ostaneta enaka. Kaj se zgodi s številom molekul v litru in kaj z maso litra?
---
Število molekul ostane enako (Avogadrov zakon). Voda ima molsko maso $18\,\mathrm{g/mol}$, dušik $28\,\mathrm{g/mol}$ in kisik $32\,\mathrm{g/mol}$. Lažje molekule zamenjajo težje, zato povprečna molska masa in masa litra padeta. To je rešitev uganke z začetka.
:::

**6. Na tekmovanju: enote in razmerja prostornin.** Temperaturo takoj pretvori v kelvine. Tlak in prostornino zapiši v kPa in L. Pri zmeseh računaj z molskimi deleži, ne z masnimi. Ker je pri istih pogojih prostornina plina sorazmerna z njegovo množino (Avogadrov zakon), je pri reakcijah med plini razmerje prostornin enako razmerju koeficientov: $1\,\mathrm{L}$ dušika in $3\,\mathrm{L}$ vodika dasta $2\,\mathrm{L}$ amonijaka. Omejitveni reaktant tako poiščeš kar s prostorninami.

## Rešeni primeri

### Primer 1: kartuša za pnevmatiko

Kolesarji na dirki nosijo s seboj kartušo s $16{,}0\,\mathrm{g}$ ogljikovega dioksida. Kolikšno prostornino bi ta plin zavzel pri $25\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$?

**Podatki:** $m = 16{,}0\,\mathrm{g}$; $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$; $t = 25\,\mathrm{°C}$; $p = 101{,}3\,\mathrm{kPa}$, torej $V_m = 24{,}5\,\mathrm{L/mol}$
**Iščemo:** prostornino $V$

:::formula
$n = \dfrac{m}{M}$, nato $V = n \cdot V_m$
:::

**Rešitev:**

1. Množina: $\dfrac{16{,}0}{44{,}01} = 0{,}3636$, torej $n = 0{,}3636\,\mathrm{mol}$.
2. Pri $25\,\mathrm{°C}$ velja $V_m = 24{,}5\,\mathrm{L/mol}$, ne $22{,}4\,\mathrm{L/mol}$: $0{,}3636 \cdot 24{,}5 = 8{,}91$.
3. Odgovor: plin bi zavzel $8{,}91\,\mathrm{L}$, več kot prostornina košarkarske žoge.

### Primer 2: tlak v pnevmatiki

Kolesar ves plin iz kartuše iz Primera 1 spusti v prazno zračnico s prostornino $1{,}10\,\mathrm{L}$. Temperatura je $15\,\mathrm{°C}$. Zraka v zračnici ni bilo. Kolikšen je tlak v njej?

**Podatki:** $n = 0{,}3636\,\mathrm{mol}$; $V = 1{,}10\,\mathrm{L}$; $t = 15\,\mathrm{°C}$; $R = 8{,}314\,\mathrm{kPa \cdot L/(mol \cdot K)}$
**Iščemo:** tlak $p$

:::formula
$p = \dfrac{nRT}{V}$
:::

**Rešitev:**

1. Temperatura v kelvinih: $15 + 273{,}15 = 288{,}15$, torej $T = 288{,}15\,\mathrm{K}$.
2. Vstavimo: $\dfrac{0{,}3636 \cdot 8{,}314 \cdot 288{,}15}{1{,}10} = 792$.
3. Enote: $\mathrm{mol} \cdot \frac{\mathrm{kPa \cdot L}}{\mathrm{mol \cdot K}} \cdot \mathrm{K} / \mathrm{L}$ da kPa.
4. Odgovor: tlak v zračnici je $792\,\mathrm{kPa}$, to je okoli osemkrat več od zunanjega zračnega tlaka, kar ustreza cestnemu kolesu.

### Primer 3: potapljanje z nitroksom (od tlaka nazaj h globini)

Potapljač diha nitroks, zmes kisika in dušika z molskim deležem kisika $0{,}32$. Delni tlak kisika ne sme preseči $140\,\mathrm{kPa}$, ker postane kisik strupen. Tlak v morju je $p = 100\,\mathrm{kPa} + h \cdot 10\,\mathrm{kPa/m}$, kjer je $h$ globina. Kolikšen je delni tlak kisika na globini $30\,\mathrm{m}$ in kako globoko se potapljač sme spustiti?

**Podatki:** $x(\mathrm{O_2}) = 0{,}32$; $p_\mathrm{max}(\mathrm{O_2}) = 140\,\mathrm{kPa}$; $p = 100\,\mathrm{kPa} + h \cdot 10\,\mathrm{kPa/m}$; prva globina $30\,\mathrm{m}$
**Iščemo:** delni tlak kisika na $30\,\mathrm{m}$ in največjo globino $h$

:::formula
$p_i = x_i \, p$
:::

**Rešitev:**

1. Na $30\,\mathrm{m}$ je skupni tlak $100 + 30 \cdot 10 = 400$, torej $400\,\mathrm{kPa}$.
2. Delni tlak kisika: $0{,}32 \cdot 400 = 128$, torej $128\,\mathrm{kPa}$. To je še pod mejo.
3. Obrnemo: skupni tlak, pri katerem kisik doseže mejo, je $\dfrac{140}{0{,}32} = 437{,}5$, torej $437{,}5\,\mathrm{kPa}$.
4. Globina: $\dfrac{437{,}5 - 100}{10} = 33{,}75$, torej $33{,}75\,\mathrm{m}$.
5. Odgovor: na $30\,\mathrm{m}$ je delni tlak kisika $128\,\mathrm{kPa}$; potapljač se ne sme spustiti globlje od približno $33\,\mathrm{m}$ (zaokrožimo navzdol, ker gre za varnostno mejo).

### Primer 4: zdaj ti – je soparni zrak res lažji?

Na vroč dan je temperatura $30\,\mathrm{°C}$, tlak $101{,}3\,\mathrm{kPa}$. V vlažnem zraku je molski delež vode $0{,}030$, ostalo je suhi zrak. Primerjaj gostoti suhega in vlažnega zraka.

**Podatki:** $t = 30\,\mathrm{°C}$; $p = 101{,}3\,\mathrm{kPa}$; $x(\mathrm{H_2O}) = 0{,}030$; $M(\text{suhi zrak}) = 28{,}96\,\mathrm{g/mol}$; $M(\mathrm{H_2O}) = 18{,}02\,\mathrm{g/mol}$; $R = 8{,}314\,\mathrm{kPa \cdot L/(mol \cdot K)}$
**Iščemo:** gostoti suhega in vlažnega zraka

:::formula
$\bar{M} = x_1 M_1 + x_2 M_2$, nato $\rho = \dfrac{pM}{RT}$
:::

**Rešitev:**

1. $T = 30 + 273{,}15 = 303{,}15$, torej $T = 303{,}15\,\mathrm{K}$.
2. Molski delež suhega zraka je $1 - 0{,}030 = 0{,}970$. Povprečna molska masa vlažnega zraka: $0{,}970 \cdot 28{,}96 + 0{,}030 \cdot 18{,}02 = 28{,}63$, torej $\bar{M} = 28{,}63\,\mathrm{g/mol}$.
3. Izračunaj sam obe gostoti, nato preveri:

:::premisli
Kolikšni sta gostoti suhega in vlažnega zraka v $\mathrm{g/L}$?
---
Suhi zrak: $\rho = \dfrac{101{,}3 \cdot 28{,}96}{8{,}314 \cdot 303{,}15} = 1{,}164$, torej $1{,}164\,\mathrm{g/L}$. Vlažni zrak: $\rho = \dfrac{101{,}3 \cdot 28{,}63}{8{,}314 \cdot 303{,}15} = 1{,}151$, torej $1{,}151\,\mathrm{g/L}$. Vlažni zrak je za približno $1\,\%$ lažji, ker lažje molekule vode zamenjajo težje molekule dušika in kisika.
:::

## Pogoste napake

- **Stopinje Celzija v enačbi.** Kdor vstavi $20$ namesto $293{,}15$, dobi množino, ki je skoraj petnajstkrat prevelika. Pravilno: v plinskih zakonih je $T$ vedno v kelvinih.
- **$22{,}4\,\mathrm{L/mol}$ povsod.** Ta vrednost velja samo pri $0\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$ in samo za pline, ne za tekočo vodo. Pri drugih pogojih uporabi $pV = nRT$ ali $V_m = \frac{RT}{p}$.
- **Nadtlak namesto tlaka.** Manometer na tlačilki kaže, za koliko je tlak večji od zunanjega. V enačbo spada absolutni tlak: nadtlak prištej zunanjemu tlaku.
- **Pomešane enote.** Z $R = 8{,}314$ in kPa mora biti prostornina v litrih, s pascali pa v kubičnih metrih. Pa in L skupaj dajo rezultat, ki je tisočkrat napačen.
- **Masni delež namesto molskega.** Delni tlak je sorazmeren s številom molekul, ne z maso. V zmesi z enako maso vodika in kisika ima vodik šestnajstkrat večji delni tlak.

## Povzetek

- Pri enakih $T$ in $p$ imajo enake prostornine plinov enako število delcev. Molski volumen je $22{,}4\,\mathrm{L/mol}$ pri $0\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$ ter $24{,}5\,\mathrm{L/mol}$ pri $25\,\mathrm{°C}$.
- Splošna plinska enačba $pV = nRT$, $R = 8{,}314\,\mathrm{kPa \cdot L/(mol \cdot K)}$; $T$ v kelvinih, $p$ absolutni.
- Za stalno množino plina velja $\frac{p_1 V_1}{T_1} = \frac{p_2 V_2}{T_2}$.
- Gostota plina $\rho = \frac{pM}{RT}$ raste z molsko maso.
- V zmesi je delni tlak $p_i = x_i\,p$, delni tlaki se seštejejo v skupnega; povprečna molska masa je $\bar{M} = \sum x_i M_i$.

## Drugače: Z analogijo

Predstavljaj si telovadnico, v kateri igralci ves čas mečejo žoge ob stene. Tlak je to, kako pogosto in kako močno žoge udarjajo ob stene.

- Več igralcev v isti telovadnici pomeni več udarcev: večji $n$, večji $p$.
- Igralci, ki se ogrejejo, mečejo hitreje: višji $T$, večji $p$.
- Če iste igralce preseliš v manjšo dvorano, zadevajo stene pogosteje: manjši $V$, večji $p$.

V telovadnici sta dve ekipi. Vsaka ekipa prispeva svoje udarce ne glede na drugo: to je njen delni tlak. Ekipa z dvakrat več igralci prispeva dvakrat več udarcev, ne glede na to, kako težki so njeni igralci.

## Drugače: Iz vsakdanjega življenja

- Nogometno žogo napihneš v topli dvorani in jo neseš na zimsko igrišče. Ko se ohladi, je mehkejša, čeprav iz nje ni ušel noben delec: pri manjšem $T$ je manjši $p$.
- Vrečka čipsa, ki jo zapreš v dolini, se na planinski koči napihne. Zunanji tlak je manjši, plin v vrečki pa ima še vedno enako množino.
- Potapljaška jeklenka vsebuje zrak ali nitroks pod velikim tlakom. Na globini je delni tlak kisika večji kot na površju, zato ima vsaka zmes svojo največjo globino.

## Preveri se

? Potapljač na zaslonu računalnika prebere: »delni tlak kisika $128\,\mathrm{kPa}$«. Kaj to pomeni?
- Tlak čistega kisika v jeklenki, preden so ga zmešali z dušikom.
~ Delni tlak opisuje kisik v zmesi, ki jo potapljač ravno diha, ne kisika pred mešanjem.
+ Tlak, ki bi ga imel kisik iz zmesi, če bi bil pri isti temperaturi sam v vsej prostornini.
- Masni delež kisika v zmesi, izražen v kilopaskalih.
~ Delež nima enote tlaka. Delni tlak je sorazmeren z molskim, ne z masnim deležem.
> Vsak plin v zmesi prispeva svoj delež k skupnemu tlaku: $p(\mathrm{O_2}) = x(\mathrm{O_2}) \cdot p$, tu $0{,}32 \cdot 400\,\mathrm{kPa}$.

? V balone napolnimo po $10\,\mathrm{g}$ plina pri enaki temperaturi in tlaku. Razvrsti jih od največje do najmanjše prostornine. Molske mase: $\mathrm{H_2}$ 2, $\mathrm{He}$ 4, $\mathrm{CH_4}$ 16, $\mathrm{N_2}$ 28, $\mathrm{CO_2}$ $44\,\mathrm{g/mol}$.
1. vodik $\mathrm{H_2}$
2. helij $\mathrm{He}$
3. metan $\mathrm{CH_4}$
4. dušik $\mathrm{N_2}$
5. ogljikov dioksid $\mathrm{CO_2}$
> Prostornina je sorazmerna z množino $n = \frac{m}{M}$. Pri enaki masi ima največ molov plin z najmanjšo molsko maso: $10\,\mathrm{g}$ vodika je skoraj $5\,\mathrm{mol}$, $10\,\mathrm{g}$ $\mathrm{CO_2}$ le $0{,}23\,\mathrm{mol}$.

? Kaj se zgodi s tlakom v zaprti jeklenki, če jo segrejemo z $10\,\mathrm{°C}$ na $20\,\mathrm{°C}$?
- Podvoji se, ker se je temperatura podvojila.
~ Podvojila se je le številka v stopinjah Celzija. Termodinamična temperatura se je povečala z $283{,}15\,\mathrm{K}$ na $293{,}15\,\mathrm{K}$.
+ Poveča se za približno $3{,}5\,\%$.
- Ostane enak, ker se prostornina jeklenke ne spremeni.
~ Pri stalni prostornini je tlak sorazmeren s temperaturo v kelvinih, zato se z njo poveča.
> Pri stalnih $n$ in $V$ velja $\frac{p_2}{p_1} = \frac{T_2}{T_1} = \frac{293{,}15}{283{,}15} = 1{,}035$.

? Stolpci kažejo delne tlake plinov v jeklenki. Kolikšen je molski delež kisika?
:::risba stolpci
opis: Delni tlaki v jeklenki. Kisik 60 kPa, dušik 150 kPa, helij 90 kPa.
stolpec: O_2 | 60
stolpec: N_2 | 150
stolpec: He | 90
os: delni tlak v kPa
korak: 30
:::
= 0,20 | 0,005
~ 0,40 | Delni tlak kisika si delil le z dušikovim. Deliti moraš s skupnim tlakom vseh treh plinov.
~ 0,25 | Kisik si delil z vsoto drugih dveh plinov. V skupni tlak spada tudi kisik sam.
> Skupni tlak je $60 + 150 + 90 = 300\,\mathrm{kPa}$, zato $x(\mathrm{O_2}) = \frac{60}{300} = 0{,}20$.

? Nogometna žoga ima prostornino $5{,}6\,\mathrm{L}$, absolutni tlak v njej je $180\,\mathrm{kPa}$, temperatura $20\,\mathrm{°C}$. Koliko molov zraka je v žogi?
= 0,414 mol | 0,005
~ 6,06 | Temperaturo si vstavil v stopinjah Celzija. V plinski enačbi je $T = 293{,}15\,\mathrm{K}$.
~ 0,181 | Uporabil si nadtlak ($180 - 101{,}3$). Podatek je že absolutni tlak.
~ 0,25 | Prostornino si delil z $22{,}4\,\mathrm{L/mol}$, ki velja le pri $0\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$.
> $n = \frac{pV}{RT} = \frac{180 \cdot 5{,}6}{8{,}314 \cdot 293{,}15} = 0{,}414\,\mathrm{mol}$.

<<RACUN
vrednost: 8.314*273.15/101.3 | 22.4
vrednost: 8.314*298.15/101.3 | 24.5
vrednost: 22.4*373.15/273.15 | 30.6
vrednost: 4/3*pi*12^3/1000 | 7.24
vrednost: 16.0/44.01 | 0.3636
vrednost: 16.0/44.01*24.5 | 8.91
vrednost: 16.0/44.01*8.314*288.15/1.10 | ≈792
vrednost: 0.32*400 | 128
vrednost: (140/0.32-100)/10 | 33.75
vrednost: 0.97*28.96+0.03*18.02 | 28.63
vrednost: 101.3*28.96/(8.314*303.15) | 1.164
vrednost: 101.3*28.63/(8.314*303.15) | 1.151
vrednost: 293.15/283.15 | 1.035
vrednost: 60/(60+150+90) | 0.20
vrednost: 180*5.6/(8.314*293.15) | 0.414
vrednost: 1-273.15/293.15 | 0.068
>>

:::simboli
V_m | molski volumen | V_m = \dfrac{V}{n} | L/mol | $22{,}4\,\mathrm{L/mol}$ pri $0\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$
V | prostornina plina | V = n \cdot V_m | L
n | množina plina | n = \dfrac{m}{M} | mol
m | masa plina | | g
p | tlak (absolutni) | p = \dfrac{nRT}{V} | kPa
T | termodinamična temperatura | T = t + 273{,}15 | K
t | temperatura v stopinjah Celzija | | °C
R | splošna plinska konstanta | | kPa\,L\,mol^{-1}\,K^{-1} | $8{,}314$
p_1, V_1, T_1 | tlak, prostornina in temperatura v začetnem stanju | | 
p_2, V_2, T_2 | tlak, prostornina in temperatura v končnem stanju | | 
\rho | gostota plina | \rho = \dfrac{pM}{RT} | g/L
M | molska masa | | g/mol
p_i | delni tlak plina $i$ v zmesi | p_i = x_i \, p | kPa
x_i | molski delež plina $i$ | x_i = \dfrac{n_i}{n} | – | med 0 in 1
n_i | množina plina $i$ v zmesi | | mol
\bar{M} | povprečna molska masa zmesi | \bar{M} = x_1 M_1 + x_2 M_2 | g/mol
x_1, x_2 | molska deleža plinov 1 in 2 | | –
M_1, M_2 | molski masi plinov 1 in 2 | | g/mol
:::
