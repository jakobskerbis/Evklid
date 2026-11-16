---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lara pri nogometu pade na umetno travo in si odrgne koleno. V rano zaide nekaj bakterij. V topli, vlažni rani se bakterija lahko razdeli na dve vsakih $20$ minut. V $12$ urah je to $36$ podvojitev, zato bi iz ene same bakterije nastalo $2^{36}$ bakterij, to je okoli $69$ milijard. To je več kot osemkrat toliko, kot je ljudi na Zemlji.

Pa vendar se Larino koleno v enem tednu zaceli in ona spet igra. Kdo je ustavil bakterije?

Odgovor je obramba telesa. Ko jo razumeš, veš tudi, zakaj trener bolnega igralca pošlje domov, zakaj antibiotik ne pomaga pri gripi in zakaj se nekaterih bolezni ne moreš nalesti.

## Razlaga

**1. Primer: kaj se dogaja v odrgnini.** Bakterija je enocelični organizem brez jedra; njena DNA je v citoplazmi. Ko ima dovolj hrane in toplote, raste in se deli na dve. Vsaka nova celica se spet deli. Število bakterij se tako v enakih časovnih presledkih podvoji. Čas med dvema delitvama je **čas podvojitve** $t_d$.

:::risba stolpci
opis: Število bakterij iz ene bakterije, ki se podvoji vsakih 20 minut. Ob 0 min je 1 bakterija, ob 20 min 2, ob 40 min 4, ob 60 min 8, ob 80 min 16, ob 100 min 32, ob 120 min 64.
os: število bakterij
stolpec: 0 min | 1
stolpec: 20 min | 2
stolpec: 40 min | 4
stolpec: 60 min | 8
stolpec: 80 min | 16
stolpec: 100 min | 32
stolpec: 120 min | 64
podnapis: Vsak stolpec je dvakrat višji od prejšnjega.
:::

Število podvojitev $n$ dobiš, če čas deliš s časom podvojitve. Število bakterij nato izračunaš enako kot število celic pri celični delitvi, le da na začetku ni nujno ena sama:

$$n = \frac{t}{t_d}$$

$$N = N_0 \cdot 2^n$$

Pri tem je $N_0$ začetno število bakterij, $N$ pa število bakterij po času $t$.

**2. Prva ovira: koža.** Zdrava koža je pregrada, skozi katero bakterije ne pridejo. Odrgnina je luknja v tej pregradi. Iz rane priteče kri, ki se strdi v krasto in luknjo spet zapre. Nos, usta in dihala varuje vlažna **sluznica**, na katero se bakterije in prah prilepijo.

**3. Vnetje in bele krvničke.** Okoli rane koža pordeči, se ogreje in oteče. Temu rečemo **vnetje**. Žile se razširijo, zato k rani priteče več krvi. S krvjo pridejo **bele krvničke** (levkociti): celice, ki bakterije poiščejo in jih požrejo. Gnoj so mrtve bele krvničke in bakterije.

:::premisli
Lara si rano takoj spere s čisto vodo in jo razkuži. V rani namesto $100$ ostane le $1$ bakterija. Koliko časa bi minilo, da bi jih bilo spet vsaj $100$, če se podvojijo vsakih $20$ minut? Najprej oceni, nato izračunaj.
---
Potrebnih je $7$ podvojitev, saj je $2^6 = 64$ še premalo, $2^7 = 128$ pa dovolj. To je $7 \cdot 20 = 140$ minut, več kot dve uri. V tem času bele krvničke že požirajo bakterije. Izpiranje rane torej obrambi zelo pomaga.
:::

**4. Od enega primera k vsem povzročiteljem.** Bakterije niso edini **povzročitelji bolezni**: tako imenujemo vse drobne vsiljivce, ki v telesu sprožijo bolezen. Bolezen, ki jo povzroči povzročitelj in se prenaša z ene osebe na drugo, je **nalezljiva bolezen**.

| Vrsta | Primeri bolezni | Pomaga |
|---|---|---|
| bakterija | angina, tetanus | antibiotik |
| virus | gripa, norice | cepljenje vnaprej |
| zajedavec | uši, gliste | zdravila |

**Virus** je še veliko manjši od bakterije. Sam ne raste in se ne deli. V tvojo celico vnese svoj dedni zapis in jo prisili, da izdeluje nove viruse. **Antibiotik** je zdravilo, ki uniči bakterije ali ustavi njihovo rast. Na viruse ne deluje: napade dele bakterijske celice, virus pa ni celica.

**Zajedavec** (parazit) živi na drugem organizmu ali v njem in se hrani na njegov račun. Ta organizem je **gostitelj**. Tudi glive povzročajo bolezni: srbeče glivice med prsti dobiš v vlažni slačilnici.

Povzročitelji se prenašajo s kapljicami pri kašljanju in kihanju, z dotikom, s skupnim bidonom ali brisačo, z umazano hrano in vodo ter s piki (klop).

**5. Protitelesa in spomin.** Nekatere bele krvničke izdelujejo **protitelesa**: beljakovine, ki se prilepijo na točno določen povzročitelj in ga označijo za uničenje. Ob prvi okužbi traja nekaj dni, da jih je dovolj; zato si bolan. Po okužbi v krvi ostanejo **spominske celice**. Če pride isti povzročitelj znova, protitelesa nastanejo veliko hitreje in jih je več, zato navadno ne zboliš. Takrat si **imun**.

**Cepivo** vsebuje oslabljen ali mrtev povzročitelj ali le njegov del. Telo naredi protitelesa in spominske celice, ne da bi zbolelo.

:::premisli
Zakaj po prebolelih noricah navadno ne zboliš še enkrat, prehlad pa lahko dobiš večkrat na leto?
---
Norice povzroča en sam virus. Spominske celice ga ob naslednji okužbi takoj prepoznajo. Prehlad povzroča več kot $200$ različnih virusov. Protitelesa proti enemu ne prepoznajo drugega, zato te vsak nov virus prehlada spet okuži.
:::

**6. Bolezni brez povzročitelja.** **Poškodbe** nastanejo zaradi sile: zvin gležnja, zlom kosti, pretres možganov po udarcu z glavo. **Dedne bolezni** nastanejo zaradi napake v genu, ki jo otrok podeduje od staršev. Pri hemofiliji je okvarjen gen za beljakovino, ki strjuje kri; rana zato dolgo krvavi. Dedne bolezni niso nalezljive.

**7. Skrb za zdravje.** Umivaj roke, imej svoj bidon in brisačo, rane izperi in pokrij. Cepi se po programu cepljenja. Dovolj spi, se gibaj in se zdravo prehranjuj, saj to krepi obrambo telesa. Pri športu nosi zaščitno opremo (čelada, ščitniki) in se pred tekmo ogrej. Bolan ostani doma, da ne okužiš soigralcev.

## Rešeni primeri

### Primer 1 (lažji): bakterije v odrgnini

V Larino odrgnino zaide $1$ bakterija, ki se podvoji vsakih $20$ minut. Koliko bakterij bi bilo v rani po $3$ urah, če jih nič ne bi ustavilo?

**Podatki:** $N_0 = 1$, $t_d = 20\,\mathrm{min}$, $t = 3\,\mathrm{h}$
**Iščemo:** število bakterij $N$

:::formula
$n = \dfrac{t}{t_d}$ in $N = N_0 \cdot 2^n$
:::

**Rešitev:**

1. Čas pretvorimo v minute, da ima enako enoto kot $t_d$: $3\,\mathrm{h} = 180\,\mathrm{min}$.
2. Število podvojitev: $n = \dfrac{180\,\mathrm{min}}{20\,\mathrm{min}} = 9$.
3. Vsaka podvojitev pomnoži število z $2$: $N = 1 \cdot 2^9 = 512$.
4. Odgovor: po $3$ urah bi bilo v rani $512$ bakterij. Zato je pomembno, da bele krvničke začnejo delati takoj.

### Primer 2: kaj je kdo staknil

Trener zapiše, zakaj manjkajo igralci. Jan ima angino, zdravnik je v brisu žrela našel bakterije. Maja ima gripo. Tim ima v laseh uši. Eva si je na tekmi zvila gleženj. Nik ima hemofilijo. Kaj povzroča njihove težave, kdo lahko okuži soigralce in komu bo pomagal antibiotik?

**Podatki:** Jan: angina, bakterije; Maja: gripa; Tim: uši; Eva: zvin gležnja; Nik: hemofilija
**Iščemo:** vrsto bolezni, nalezljivost in ali pomaga antibiotik

:::formula
Nalezljive so le bolezni s povzročiteljem. Poškodbe in dedne bolezni niso nalezljive. Antibiotik uniči samo bakterije.
:::

**Rešitev:**

1. Jan: povzročitelj je bakterija. Bolezen je nalezljiva. Antibiotik pomaga, ker deluje na bakterije.
2. Maja: gripo povzroča virus. Je nalezljiva, prenaša se s kapljicami. Antibiotik ne pomaga, ker virus ni celica.
3. Tim: uš je zajedavec, ki se hrani s krvjo. Prenaša se z dotikom glav, kapami in glavniki. Pomaga šampon proti ušem, ne antibiotik.
4. Eva: zvin je poškodba zaradi sile. Ni nalezljiv. Pomagajo počitek, hlajenje in povoj.
5. Nik: hemofilija je dedna bolezen, napaka v genu. Ni nalezljiva in je ni mogoče stakniti.
6. Odgovor: soigralce lahko okužijo Jan, Maja in Tim. Antibiotik pomaga samo Janu.

### Primer 3 (težji): kako hitro se delijo?

V laboratoriju so bakterije iz rane gojili na gojišču. Na začetku jih je bilo $40$, po $3$ urah pa $2560$. Na koliko minut so se podvojile?

**Podatki:** $N_0 = 40$, $N = 2560$, $t = 3\,\mathrm{h} = 180\,\mathrm{min}$
**Iščemo:** čas podvojitve $t_d$

:::formula
Iz $N = N_0 \cdot 2^n$ najprej najdemo $n$, nato $t_d = \dfrac{t}{n}$.
:::

**Rešitev:**

1. Kolikokrat se je število povečalo: $\dfrac{2560}{40} = 64$.
2. Katera potenca števila $2$ je $64$: $2^6 = 64$, zato je bilo $n = 6$ podvojitev.
3. Šest podvojitev v $180$ minutah: $t_d = \dfrac{180\,\mathrm{min}}{6} = 30\,\mathrm{min}$.
4. Odgovor: bakterije so se podvojile vsakih $30$ minut.

### Primer 4 – zdaj ti: cepljenje na turnirju

Na nogometnem turnirju igra $240$ otrok. Proti ošpicam jih je cepljenih $95\,\%$. Koliko otrok ni zaščitenih?

**Podatki:** vseh otrok je $240$, cepljenih $95\,\%$
**Iščemo:** število necepljenih otrok

:::formula
del celote $= \dfrac{\text{odstotek}}{100} \cdot \text{celota}$
:::

**Rešitev:**

1. Necepljenih je $100\,\% - 95\,\% = 5\,\%$.
2. Izračunaj $5\,\%$ od $240$ in preveri:

:::premisli
Koliko otrok ni zaščitenih?
---
$0{,}05 \cdot 240 = 12$ otrok. Ker je skoraj vsak okoli njih cepljen, virus težko pride do njih. Tako cepljeni varujejo tudi tiste, ki se ne morejo cepiti.
:::

## Pogoste napake

- **»Antibiotik pozdravi gripo in prehlad.«** Gripo in prehlad povzročajo virusi. Antibiotik uniči le bakterije, virus pa ni celica in ga antibiotik ne doseže. Pri virusni bolezni pomagajo počitek, tekočina in cepljenje vnaprej.
- **»V dveh urah s podvojitvijo vsakih 20 minut je bakterij 6-krat več.«** Šest podvojitev ne pomeni »krat 6«, ampak šestkrat »krat 2«: $2^6 = 64$. Število bakterij raste vedno hitreje.
- **»Vse bakterije so škodljive.«** Večina bakterij nam ne škodi. Bakterije v črevesu pomagajo pri prebavi in odrivajo škodljive. Bolezni povzroča le manjši del bakterij.
- **»Hemofilijo lahko dobiš od soigralca.«** Dedna bolezen je zapisana v genih, ki jih dobiš od staršev. Ni povzročitelja, ki bi prešel na drugega, zato ni nalezljiva.
- **»Cepivo pozdravi bolnega.«** Cepivo telo pripravi, preden pride povzročitelj. Bolniku z ošpicami cepivo ne pomaga več, ker je okužba že tu.

## Povzetek

- Povzročitelji nalezljivih bolezni so bakterije, virusi, zajedavci in glive. Prenašajo se s kapljicami, dotikom, skupnimi predmeti, hrano, vodo in piki.
- Bakterija je celica brez jedra in se deli; virus ni celica in se razmnožuje le v celici gostitelja; zajedavec živi na gostitelju ali v njem in se hrani na njegov račun.
- Število bakterij: $n = \dfrac{t}{t_d}$, $N = N_0 \cdot 2^n$.
- Obramba: koža in sluznice, vnetje z belimi krvničkami, ki požirajo povzročitelje, nato protitelesa in spominske celice (imunost). Cepivo ustvari imunost brez bolezni.
- Antibiotik deluje samo na bakterije.
- Poškodbe in dedne bolezni (npr. hemofilija) niso nalezljive.
- Za zdravje: umivanje rok, svoj bidon, cepljenje, spanje, gibanje, zaščitna oprema.

## Drugače: Z analogijo

Telo si predstavljaj kot stadion na veliki tekmi.

- **Ograja in vhodi** so koža in sluznice. Večina nepovabljenih ne pride čez.
- **Odrgnina** je luknja v ograji. Skozi njo se prerinejo vsiljivci, bakterije.
- **Redarji**, ki prihitijo k luknji, so bele krvničke. Vsiljivce primejo in odstranijo. Gneča redarjev pri luknji je vnetje.
- **Fotografije prepovedanih navijačev** so protitelesa in spominske celice. Kogar so enkrat ujeli, ga pri naslednji tekmi prepoznajo že na vhodu.
- **Vaja z igralcem v vlogi vsiljivca** je cepljenje. Redarji se naučijo obraz, nihče pa ni v nevarnosti.

Primerjava ima mejo: virus ne gleda tekme, ampak vdre v »garderobo«, tvojo celico, in tam naredi nove viruse.

## Drugače: Bolj natančno

Velikosti povzročiteljev se zelo razlikujejo. Virus gripe meri okoli $0{,}1\,\mu\mathrm{m}$, bakterija nekaj mikrometrov, bela krvnička okoli $12\,\mu\mathrm{m}$, uš okoli $3\,\mathrm{mm}$. Bakterijo vidiš s šolskim svetlobnim mikroskopom, virusa pa ne; zanj potrebujemo elektronski mikroskop.

Bele krvničke so dveh glavnih vrst. **Fagociti** (požiralke) požrejo vsak tujek, ki ga srečajo. **Limfociti** izdelujejo protitelesa in postanejo spominske celice; vsak limfocit prepozna en sam povzročitelj.

Antibiotiki uničijo občutljive bakterije. Če jih jemlješ po nepotrebnem ali premalo časa, preživijo najbolj odporne. Te se razmnožijo in antibiotik nanje ne deluje več. Zato antibiotik jemlješ le, ko ga predpiše zdravnik, in ves predpisani čas.

Vročina je odziv obrambe: pri višji temperaturi se mnogi povzročitelji delijo počasneje. Pri visoki vročini ali če traja več dni, pa poišči zdravnika.

## Preveri se

? Košarkarja srbi lasišče. Zdravnica v laseh najde drobne žuželke, ki živijo na njegovi glavi in sesajo njegovo kri. Kaj so te žuželke?
- bakterije
~ Bakterije so enocelične in prostemu očesu nevidne; to pa so žuželke z nogami.
- virusi
~ Virusi niso celice in jih vidimo le z elektronskim mikroskopom.
+ zajedavci
- znak dedne bolezni
~ Dedna bolezen nima povzročitelja; uši pa preidejo z ene glave na drugo.
> Uši so zajedavci: živijo na gostitelju in se hranijo na njegov račun, z njegovo krvjo.

? Lara si odrgne koleno in v rano zaidejo bakterije. Razvrsti dogodke po vrsti, kot si sledijo.
1. Bakterije pridejo skozi poškodovano kožo.
2. Bakterije se v rani začnejo deliti.
3. Okoli rane koža pordeči in oteče.
4. Bele krvničke požirajo bakterije.
5. Rana se zaceli, nova koža spet zapre pot.
> Najprej je pregrada predrta, nato se bakterije delijo. Telo odgovori z vnetjem, ki pripelje bele krvničke, te bakterije uničijo, nazadnje se koža obnovi.

? Kaj se zgodi, če igralca, ki je bil cepljen proti ošpicam, na tekmi okuži virus ošpic?
- Zboli enako hudo kot necepljen igralec.
~ Cepivo je pustilo spominske celice; telo virus prepozna in ga ustavi, preden se namnoži.
+ Njegovo telo hitro naredi protitelesa, zato ne zboli ali zboli zelo blago.
- Ne zgodi se nič, ker cepivo virus uniči že na koži.
~ Cepivo ne deluje na koži; varuje, ker je telo že pripravilo protitelesa in spomin.
- Zboli, ker dobi z virusom še bakterije, nato mu pomaga antibiotik.
~ Ošpice povzroča virus. Antibiotik na viruse ne deluje.
> Cepivo je telo naučilo prepoznati virus ošpic. Spominske celice ob okužbi hitro sprožijo izdelavo protiteles.

? Po tekmi je v odrgnini $15$ bakterij, ki se podvojijo vsakih $30$ minut. Koliko bakterij bi bilo po $3$ urah, če jih nič ne bi ustavilo?
= 960 | 0
~ 90 | Število si pomnožil s $6$. Šest podvojitev pomeni $2^6 = 64$, torej $15 \cdot 64$.
~ 120 | Upošteval si le $3$ podvojitve, eno na uro. V $3$ urah je šest polurnih presledkov.
> $n = \dfrac{180\,\mathrm{min}}{30\,\mathrm{min}} = 6$, $N = 15 \cdot 2^6 = 15 \cdot 64 = 960$.

? Stolpci kažejo število bakterij v gojišču na začetku, po $1$ uri in po $2$ urah. Na koliko minut se bakterije podvojijo?
:::risba stolpci
opis: Število bakterij v gojišču. Ob 0 h je 50 bakterij, ob 1 h 400, ob 2 h 3200.
os: število bakterij
stolpec: 0 h | 50
stolpec: 1 h | 400
stolpec: 2 h | 3200
:::
= 20 min | 0
~ 60 | Misliš, da je ena podvojitev na uro. Število se v eni uri poveča $8$-krat, to so tri podvojitve.
~ 7,5 | Delil si $60$ z $8$. Deliti moraš s številom podvojitev, ne s faktorjem povečanja.
> V eni uri: $\dfrac{400}{50} = 8 = 2^3$, torej $3$ podvojitve. $t_d = \dfrac{60\,\mathrm{min}}{3} = 20\,\mathrm{min}$.

<<RACUN
vrednost: 720/20 | 36
vrednost: 2^36 | 68719476736
vrednost: 2^7 | 128
vrednost: 7*20 | 140
vrednost: 180/20 | 9
vrednost: 1*2^9 | 512
vrednost: 2560/40 | 64
resi: 2^n=64 | n | 6
vrednost: 180/6 | 30
vrednost: 0.05*240 | 12
vrednost: 180/30 | 6
vrednost: 15*2^6 | 960
vrednost: 400/50 | 8
vrednost: 60/3 | 20
>>

:::simboli
N | število bakterij po času $t$ | N = N_0 \cdot 2^n | –
N_0 | začetno število bakterij | | –
n | število podvojitev | n = \frac{t}{t_d} | –
t | čas rasti | | min
t_d | čas podvojitve | t_d = \frac{t}{n} | min | čas med dvema delitvama
:::
