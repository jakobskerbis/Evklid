---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Prva slika: na vratih hladilnika visi razglednica z morja. Drži jo majhen magnet, čeprav je med magnetom in kovino papir.

Druga slika: na planinskem izletu položiš kompas na zemljevid. V bližini ni nobenega magneta, pa se igla vseeno zavrti in obstane v smeri proti severu.

Na videz sta to dve povsem različni stvari. V resnici se v obeh zgodi isto: magnet deluje na drugo telo, ne da bi se ga dotikal. Okoli vsakega magneta je nekaj, česar ne vidiš, a to lahko izmeriš. In Zemlja sama je ogromen magnet. Ko to razumeš, znaš brati kompas, se orientirati v gorah ali v neznanem mestu in razumeš, zakaj kompas včasih kaže narobe.

## Razlaga

**Dva pola.** Vzemi paličasti magnet in ga obesi na nitko, da se lahko prosto vrti. Vedno se umiri tako, da en konec kaže proti severu. Ta konec imenujemo **severni pol** magneta, drugega **južni pol**. Na šolskih magnetih je severni pol pogosto pobarvan rdeče in označen s črko S, južni pa z J. Pola sta na koncih, tam magnet najmočneje privlači.

Ko dva magneta približaš, se zgodi eno od dvojega:

| Približaš | Kaj se zgodi |
|---|---|
| severni k severnemu | odbijata se |
| južni k južnemu | odbijata se |
| severni k južnemu | privlačita se |

Kratko: **istoimenska pola se odbijata, raznoimenska se privlačita.** Podobno je pri električnih nabojih, a pola magneta nista naboja. Če paličasti magnet prerežeš, ne dobiš ločenega severnega in južnega pola. Vsak kos ima spet oba pola.

**Kaj magnet privlači.** Magnet privlači železo, jeklo, nikelj in kobalt. Takim snovem pravimo **feromagnetne snovi**. Aluminija, bakra, lesa, plastike ali papirja ne privlači. Papir mu tudi ne preprečuje delovanja: sila deluje skozenj, zato razglednica ostane na hladilniku.

**Slika polja.** Na paličasti magnet položi list papirja in nanj nasuj železne opilke. Ko po papirju rahlo potrkaš, se opilke uredijo v črte. Opis slike:

- črte izhajajo iz severnega pola, se v lokih ukrivijo okoli magneta in vstopijo v južni pol;
- ob obeh polih so črte zelo goste, ob sredini magneta in daleč stran redke;
- nobeni dve črti se ne sekata.

Prostoru okoli magneta, kjer magnet deluje s silo na železo ali na drug magnet, rečemo **magnetno polje**. Črte, ki jih pokažejo opilke, so **magnetne silnice**. Kjer so silnice gostejše, je polje močnejše. Zunaj magneta silnice po dogovoru kažejo od severnega proti južnemu polu.

**Kompas.** Igla kompasa je majhen, lahek magnet, ki se lahko vrti. V magnetnem polju se postavi vzdolž silnice. Njen severni konec kaže v smer silnice. Zato s kompasom »rišeš« polje: premikaš ga okoli magneta in si zapisuješ, kam kaže igla.

V simulaciji spodaj (»Magnetno polje in kompas«) počasi pelji kompas od severnega pola magneta okoli boka do južnega pola. Opazuj, kako se igla ves čas obrača vzdolž silnic in kje se obrne najhitreje.

:::premisli
Kompas postaviš tik ob južni pol paličastega magneta. Kam pokaže severni konec igle? Napovej, nato utemelji.
---
Proti južnemu polu magneta, torej v magnet. Raznoimenska pola se privlačita, zato se severni konec igle obrne k južnemu polu. Tudi silnice tam vstopajo v magnet.
:::

**Zemlja je magnet.** Kompas kaže proti severu tudi sredi travnika, torej mora tam biti magnetno polje. Ustvarja ga Zemlja. Predstavljaj si, da je v Zemlji velik paličasti magnet, rahlo nagnjen glede na os vrtenja.

Severni konec igle kaže proti severu. K sebi pa ga potegne le raznoimenski, torej južni pol. Zato je blizu geografskega severnega pola v resnici **južni magnetni pol** Zemlje, blizu geografskega južnega pola pa severni magnetni pol. Zemljine silnice potekajo z južne poloble proti severni.

**Magnetni in geografski sever nista ista točka.** Magnetni pol leži nekaj sto kilometrov od geografskega in se vsako leto premakne. Zato igla kompasa ne kaže točno proti geografskemu severu, h kateremu je obrnjen zemljevid. Kot med tema smerema imenujemo **magnetni odklon** (deklinacija), oznaka $\delta$. V Sloveniji je danes približno $5^\circ$ proti vzhodu. Natančna vrednost je zapisana na robu planinskega zemljevida.

**Smer kot število.** V gorah smer pogosto podamo s kotom od severa, merjenim v smeri urinega kazalca. Ta kot je **azimut**:

| Smer | Azimut |
|---|---|
| sever | $0^\circ$ |
| vzhod | $90^\circ$ |
| jug | $180^\circ$ |
| zahod | $270^\circ$ |

Na zemljevidu meriš azimut $\alpha_\mathrm{z}$ od geografskega severa. Kompas meri azimut $\alpha_\mathrm{k}$ od smeri igle. Igla je zasukana za $\delta$ proti vzhodu, torej v smeri urinega kazalca. Zato je kot od igle do cilja za $\delta$ manjši:

$$\alpha_\mathrm{k} = \alpha_\mathrm{z} - \delta$$

:::premisli
Kam bi kazala igla navadnega kompasa, če bi stal točno na Zemljinem magnetnem polu na severu? Pomisli, kako tam potekajo silnice.
---
Nikamor določeno. Tam silnice vstopajo v Zemljo skoraj navpično. Igla, ki se vrti le vodoravno, nima vodoravne smeri, v katero bi jo polje obrnilo, zato obstane kjerkoli.
:::

## Rešeni primeri

### Primer 1: azimut za kočo

Na zemljevidu vidiš, da je planinska koča točno jugovzhodno od tebe. Kateri azimut nastaviš na kompasu? Odklon zanemari.

**Podatki:** smer jugovzhod (na sredini med vzhodom in jugom), vzhod $= 90^\circ$, jug $= 180^\circ$, odklon zanemarimo
**Iščemo:** azimut $\alpha$

:::formula
Vmesna smer leži na sredini med sosednjima: $\alpha = \dfrac{\alpha_1 + \alpha_2}{2}$ (pri smereh ob severu sever štejemo kot $360^\circ$, npr. severozahod $= \dfrac{270^\circ + 360^\circ}{2} = 315^\circ$)
:::

**Rešitev:**

1. Jugovzhod je točno med vzhodom in jugom, zato vzamemo povprečje kotov.
2. $\alpha = \dfrac{90 + 180}{2} = 135$, torej $135^\circ$.
3. Odgovor: na kompasu nastaviš azimut $135^\circ$.

### Primer 2: prerezan magnet

Paličasti magnet ima severni pol na levem koncu. Razrežeš ga na tri enake kose in jih pustiš v isti vrsti. Koliko polov imajo kosi skupaj? Kateri pol je na levem koncu srednjega kosa? Ali se kosa na prvem rezu privlačita?

**Podatki:** severni pol na levem koncu, $n = 3$ kosi, kosi ostanejo v isti vrsti
**Iščemo:** število polov $p$, pol na levem koncu srednjega kosa, ali se kosa privlačita

:::formula
Vsak kos ima dva pola: $p = 2 \cdot n$. Raznoimenska pola se privlačita.
:::

**Rešitev:**

1. Vsak kos je cel magnet z dvema poloma: $p = 2 \cdot 3 = 6$.
2. Kosi so obrnjeni kot prej, zato ima vsak kos severni pol na levi in južni na desni.
3. Levi konec srednjega kosa je torej severni pol.
4. Na prvem rezu se srečata južni pol levega kosa in severni pol srednjega. Pola sta raznoimenska, zato se kosa privlačita.
5. Odgovor: skupaj je $6$ polov; levi konec srednjega kosa je severni pol; kosa se na rezu privlačita.

### Primer 3: pohod s kompasom v megli

Na zemljevidu izmeriš, da je vrh od tebe v smeri z azimutom $62^\circ$. Na robu zemljevida piše: magnetni odklon $5^\circ$ proti vzhodu. Prišla je megla in vrha ne vidiš več. Kateri azimut nastaviš na kompasu?

**Podatki:** $\alpha_\mathrm{z} = 62^\circ$ (z zemljevida), $\delta = 5^\circ$ proti vzhodu
**Iščemo:** azimut na kompasu $\alpha_\mathrm{k}$

:::formula
$\alpha_\mathrm{k} = \alpha_\mathrm{z} - \delta$
:::

**Rešitev:**

1. Igla kaže $5^\circ$ vzhodneje od geografskega severa, zato je smer proti vrhu od igle oddaljena za $5^\circ$ manj.
2. $\alpha_\mathrm{k} = 62 - 5 = 57$, torej $57^\circ$.
3. Preverimo smiselnost: razlika je majhna, a na $2\,\mathrm{km}$ poti bi te že zanesla za približno $170\,\mathrm{m}$ vstran.
4. Odgovor: na kompasu nastaviš $57^\circ$.

### Primer 4: zdaj ti

Na izletu greš s kompasom v smeri z azimutom $200^\circ$, odklon je $5^\circ$ proti vzhodu. Doma želiš pot vrisati v zemljevid. Kolikšen azimut izmeriš na zemljevidu?

**Podatki:** $\alpha_\mathrm{k} = 200^\circ$, $\delta = 5^\circ$ proti vzhodu
**Iščemo:** azimut na zemljevidu $\alpha_\mathrm{z}$

:::formula
$\alpha_\mathrm{k} = \alpha_\mathrm{z} - \delta$, preoblikovano $\alpha_\mathrm{z} = \alpha_\mathrm{k} + \delta$
:::

**Rešitev:**

1. Neznanka je kot na zemljevidu, zato odklon prištejemo.
2. Izračunaj sam, nato preveri:

:::premisli
Koliko je $\alpha_\mathrm{z}$?
---
$\alpha_\mathrm{z} = 200^\circ + 5^\circ = 205^\circ$. Na zemljevidu je smer od geografskega severa za odklon večja kot na kompasu.
:::

## Pogoste napake

- **»Magnet privlači vse kovine.«** Učenec misli, da bo prijel tudi aluminijasto pločevinko. A privlači le feromagnetne snovi: železo, jeklo, nikelj, kobalt. Preden napoveš, se vprašaj, iz česa je predmet.
- **»Na severu je severni magnetni pol.«** Ime se zdi logično. Toda severni konec igle se obrne k raznoimenskemu polu. Pod Arktiko je torej južni magnetni pol Zemlje.
- **»Ko magnet prerežem, ločim pola.«** Pričakuješ samostojen severni in samostojen južni del. V resnici ima vsak kos spet oba pola, ne glede na to, kolikokrat režeš.
- **»Kompas kaže točno geografski sever.«** Kaže proti magnetnemu polu, ki je drugje. Pri daljših poteh upoštevaj odklon $\delta$, ki je na robu zemljevida.
- **»Kompas deluje povsod enako.«** Blizu železne ograje, avtomobila ali magneta v torbici igla pokaže narobe, ker tam prevlada njihovo polje. Kompas drži stran od železa.

## Povzetek

- Magnet ima severni in južni pol; istoimenska pola se odbijata, raznoimenska privlačita. Prerezan magnet ima spet oba pola.
- Magnet privlači feromagnetne snovi (železo, jeklo, nikelj, kobalt), drugih kovin ne.
- Okoli magneta je magnetno polje; prikažemo ga s silnicami, ki zunaj magneta kažejo od severnega proti južnemu polu. Gostejše silnice pomenijo močnejše polje.
- Igla kompasa je majhen magnet, ki se postavi vzdolž silnic.
- Zemlja je velik magnet; blizu geografskega severnega pola je njen južni magnetni pol.
- Magnetni odklon $\delta$ je kot med smerjo igle in geografskim severom (v Sloveniji okoli $5^\circ$ proti vzhodu): $\alpha_\mathrm{k} = \alpha_\mathrm{z} - \delta$.

## Drugače: Z analogijo

Spomni se vremenske karte, na kateri puščice kažejo veter. Vsaka puščica pove, kam piha, gostejše puščice pa pomenijo močnejši veter. Magnetne silnice so taka karta za magnetno polje.

Igla kompasa je kot vetrnica na strehi. Vetrnica se sama obrne v smer vetra, igla se sama obrne vzdolž silnice. Ne vidiš ne vetra ne polja, vidiš pa, kako se vetrnica in igla postavita.

Analogija ima mejo: veter je gibanje zraka, v magnetnem polju pa se nič ne premika. Silnice so le risba, ki pokaže smer in moč sile.

## Drugače: Iz vsakdanjega življenja

- **Hladilnik:** vrata so iz jekla, zato se jih magnet prime. Tudi tesnilo vrat ima v sebi magnetni trak, ki vrata potegne k ohišju.
- **Kovanci:** kovanci za $1$, $2$ in $5$ centov so iz jekla, prevlečenega z bakrom. Magnet jih dvigne, čeprav so videti bakreni.
- **Letala in ladje:** poleg sodobnih naprav imajo še vedno magnetni kompas, ki deluje tudi brez elektrike.
- **Ptice selivke:** nekatere zaznajo Zemljino magnetno polje in si z njim pomagajo pri iskanju poti.
- **Telefon:** aplikacija kompas uporablja drobno tipalo magnetnega polja. Če je telefon blizu magneta v ovitku, kaže narobe.

## Preveri se

? Na zemljevidu za orientacijski tek piše: »Kompas drži stran od železnih predmetov.« Kaj je igla kompasa?
- Kazalec, ki ga poganja vzmet in kaže proti severu.
~ V kompasu ni vzmeti. Igla se obrne sama, ker nanjo deluje magnetno polje.
+ Majhen magnet, ki se lahko vrti in se postavi vzdolž magnetnih silnic.
- Košček železa, ki ga privlači Zemljino jedro.
~ Navadno železo bi Zemlja privlačila brez določene smeri. Igla se obrne, ker ima pola, torej je magnet.
> Igla je magnet. Železo v bližini spremeni polje, zato je kompas treba držati stran od njega.

? Razvrsti točke ob paličastem magnetu od najmočnejšega do najšibkejšega polja: A tik ob severnem polu, B tik ob sredini magneta, C $30\,\mathrm{cm}$ od magneta.
- B, A, C
~ Sredina magneta se zdi »najbolj magnetna«, a tam so silnice redke. Najgostejše so ob polih.
- C, B, A
~ Polje z razdaljo slabi, ne narašča. Daleč stran so silnice najredkejše.
+ A, B, C
> Ob polu so silnice najgostejše, ob sredini redkejše, daleč stran pa skoraj ni polja.

? Kompas leži na mizi in kaže proti severu. Z vzhodne strani mu približaš severni pol magneta. Kaj se zgodi?
- Severni konec igle se obrne proti magnetu.
~ Severni konec igle in severni pol magneta sta istoimenska, zato se odbijata.
+ Južni konec igle se obrne proti magnetu, severni konec od njega.
- Nič, ker igla vedno kaže proti Zemljinemu severu.
~ Blizu magneta je njegovo polje močnejše od Zemljinega, zato prevlada.
> Istoimenska pola se odbijata, raznoimenska privlačita: proti severnemu polu magneta se obrne južni konec igle.

? Paličasti magnet razrežeš na $4$ kose. Koliko magnetnih polov imajo kosi skupaj?
- $2$
~ Misel, da se pola pri rezanju le razdelita med kose, je napačna: vsak kos dobi oba pola.
- $4$
~ Tako dobiš, če misliš, da ima vsak kos en sam pol. Vsak kos je cel magnet z dvema poloma.
+ $8$
> Vsak kos ima severni in južni pol: $p = 2 \cdot 4 = 8$.

? Na zemljevidu izmeriš azimut $120^\circ$, odklon je $5^\circ$ proti vzhodu. Kateri azimut nastaviš na kompasu?
- $125^\circ$
~ Odklon si prištel. Igla je zasukana proti vzhodu, zato je kot od igle manjši: $\alpha_\mathrm{k} = \alpha_\mathrm{z} - \delta$.
+ $115^\circ$
- $120^\circ$
~ Tako bi bilo, če bi kompas kazal točno geografski sever. Kaže proti magnetnemu polu.
> $\alpha_\mathrm{k} = 120^\circ - 5^\circ = 115^\circ$.

:::simboli
\alpha_\mathrm{k} | azimut na kompasu (od smeri igle) | \alpha_\mathrm{k} = \alpha_\mathrm{z} - \delta | ^\circ
\alpha_\mathrm{z} | azimut na zemljevidu (od geografskega severa) | \alpha_\mathrm{z} = \alpha_\mathrm{k} + \delta | ^\circ
\delta | magnetni odklon (deklinacija) | | ^\circ | pozitiven, kadar je proti vzhodu
\alpha | azimut vmesne smeri | \alpha = \frac{\alpha_1 + \alpha_2}{2} | ^\circ
\alpha_1, \alpha_2 | azimuta sosednjih smeri | | ^\circ
p | število polov | p = 2 \cdot n | –
n | število kosov magneta | | –
:::
