---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Med kuhanjem imaš na telefonu odprto aplikacijo z video recepti. Aplikacija zavzame $2\,\text{GB}$. Telefon ima $128\,\text{GB}$ shrambe in $6\,\text{GB}$ delovnega pomnilnika. Ob prvem odprtju čakaš nekaj sekund, nato recept teče gladko. Ko telefon ponovno zaženeš, spet čakaš.

Zakaj ima telefon dva različna »pomnilnika«? Zakaj aplikacija, ki je že na telefonu, potrebuje čas, da se odpre? In kdo odloči, katera aplikacija dobi prostor, ko hkrati teče še glasba in odštevalnik za testenine?

Odgovori so v zgradbi računalnika. Ko jih poznaš, znaš izbrati primeren računalnik za delo s podatki z njive ali iz laboratorija, razumeš, zakaj se program upočasni, in veš, kaj pomeni »program je napisan v Pythonu«.

## Razlaga

**Kuhinja in računalnik.** Kuhinjo poznaš, zato začnimo z njo. V njej so stvari, ki jih lahko primeš (štedilnik, pult, hladilnik), in navodila, ki jih ne moreš prijeti (recepti). Računalnik je razdeljen enako:

- **strojna oprema** (angl. *hardware*) so fizični deli: procesor, pomnilnik, disk, zaslon, tipkovnica;
- **programska oprema** (angl. *software*) so programi: zaporedja ukazov, ki strojni opremi povedo, kaj naj dela.

Brez recepta kuhar ne ve, kaj skuhati; brez kuhinje recept nič ne skuha. Enako velja za računalnik. Od tu naprej gradimo na razlikah med kuhinjo in računalnikom.

**Procesor: kuhar, ki zna le drobne gibe.** **Procesor** (CPE, centralna procesna enota, angl. *CPU*) izvaja ukaze. Ima **aritmetično-logično enoto**, ki računa in primerja, in **krmilno enoto**, ki jemlje ukaze po vrsti in jih izvaja. Za vsak ukaz ponavlja isti krog: ukaz prevzame, ga razbere, ga izvede. Prva razlika s kuharjem: procesor ne razume »prepraži čebulo«. Pozna le zelo preproste ukaze, npr. »seštej dve števili« ali »skoči na drug ukaz«. Druga razlika: hitrost. Procesor ima notranjo uro, ki enakomerno »utripa«; en utrip je **takt**, v vsakem procesor opravi korak ukaza. Procesor s frekvenco takta $3\,\text{GHz}$ naredi $3$ milijarde taktov v sekundi, v eni milisekundi torej $3 \cdot 10^{6}$.

**Pomnilnik: pult in shramba.** Kuhar ne kuha iz shrambe, ampak sestavine najprej prinese na pult. Tudi računalnik ima dve vrsti hrambe:

| lastnost | delovni pomnilnik (RAM) | shramba (SSD, trdi disk) |
|---|---|---|
| v kuhinji | pult | shramba, hladilnik |
| hitrost branja | zelo velika, okoli $20\,\text{GB/s}$ | manjša, $0{,}15$ do $3\,\text{GB/s}$ |
| ob izklopu | vsebina se izgubi | vsebina ostane |
| običajna velikost | $4$ do $32\,\text{GB}$ | $128\,\text{GB}$ do nekaj TB |

Tu je tretja razlika: pult v kuhinji ob odhodu ostane poln, RAM pa ob izklopu toka izgubi vse. Zato moraš delo **shraniti**, torej prenesti s pulta v shrambo.

:::premisli
Aplikacija z recepti je velika $2\,\text{GB}$, shramba jo bere s hitrostjo $500\,\text{MB/s}$. Koliko sekund približno traja prvo odprtje? Zakaj je drugo odprtje, dokler je aplikacija še v RAM-u, skoraj takojšnje?
---
Približno $\dfrac{2000\,\text{MB}}{500\,\text{MB/s}} = 4\,\text{s}$. Ko je aplikacija že v RAM-u, je ni treba prenašati iz shrambe; iz RAM-a pri $20\,\text{GB/s}$ bi isto količino prebral v $0{,}1\,\text{s}$, torej $40$-krat hitreje. Po ponovnem zagonu je RAM prazen, zato spet čakaš.
:::

**Vhodne in izhodne naprave.** Tipkovnica, miška, mikrofon, kamera in senzorji prinašajo podatke v računalnik (**vhod**). Zaslon, zvočnik in tiskalnik jih dajejo ven (**izhod**). Vse dele povezujejo **vodila**, nekakšni hodniki med pultom, kuharjem in vrati.

**Operacijski sistem: vodja kuhinje.** V veliki kuhinji ima vodja pregled: kateri kuhar je prost, kje je prostor na pultu, kdaj gre jed ven. V računalniku to dela **operacijski sistem** (OS), npr. Windows, macOS, Linux, Android ali iOS. Njegove naloge so:

- razporeja procesor: vsak program dobi kratko **časovno rezino**, nato pride na vrsto naslednji;
- deli RAM med programe in jih loči, da drug drugemu ne pokvarijo podatkov;
- upravlja datoteke v shrambi (mape, imena, pravice dostopa);
- prek **gonilnikov** (majhnih programov, ki znajo upravljati eno vrsto naprave) govori z napravami, npr. s tiskalnikom ali kamero;
- nudi uporabniški vmesnik (okna, ikone, dotik).

Razlika z vodjo kuhinje: OS menja programe tako hitro (vsakih nekaj milisekund), da se ti zdi, da tečejo hkrati. Programom, ki jih uporabljaš ti (brskalnik, preglednica, aplikacija z recepti), rečemo **aplikacijska programska oprema**. OS in gonilniki so **sistemska programska oprema**.

:::premisli
Na tabličnem računalniku v kuhinji hkrati teče deset programov, vsak dobi rezino $10\,\text{ms}$. Napovej: ali bo odštevalnik za testenine »zamudil«, če mora vsakih nekaj desetink sekunde osvežiti številke?
---
Ne. Odštevalnik pride na vrsto vsakih $10 \cdot 10\,\text{ms} = 100\,\text{ms}$, to je $10$-krat v sekundi. Za osvežitev številk vsakih nekaj desetink sekunde je to dovolj.
:::

**Programski jeziki: v kakšnem jeziku je recept.** Procesor razume le **strojno kodo**: zaporedja ničel in enic, ki pomenijo njegove preproste ukaze. Pisati tako je kot pisati recept v gibih mišic. Ljudje zato pišemo v **višjih programskih jezikih** (Python, C, Java, R), kjer en stavek, npr. `povprecje = sum(pridelki) / len(pridelki)`, pomeni na stotine strojnih ukazov. Vmes je **zbirni jezik**: strojni ukazi, zapisani s kratkimi besedami, npr. `ADD`.

Višji jezik je treba prevesti. Dva načina:

- **prevajalnik** (angl. *compiler*) prevede ves program vnaprej v strojno kodo; nastane izvršljiva datoteka (npr. C);
- **tolmač** (angl. *interpreter*) bere program sproti, stavek za stavkom, in ga takoj izvaja (npr. Python).

V kuhinji: prevajalnik je kot prevedena kuharska knjiga, ki jo dobi tuj kuhar; tolmač je kot človek ob kuharju, ki mu recept prevaja stavek za stavkom.

## Rešeni primeri

### Primer 1 (lažji): fotografije receptov

Fotografija jedi v visoki ločljivosti zavzame $4\,\text{MB}$. Koliko takih fotografij gre na pomnilniško kartico s $64\,\text{GB}$?

**Podatki:** velikost fotografije $4\,\text{MB}$, kapaciteta kartice $64\,\text{GB}$, $1\,\text{GB} = 1000\,\text{MB}$
**Iščemo:** število fotografij $N$

:::formula
$N = \dfrac{\text{kapaciteta}}{\text{velikost ene fotografije}}$
:::

**Rešitev:**

1. Obe količini izrazimo v isti enoti: $64\,\text{GB} = 64 \cdot 1000\,\text{MB} = 64000\,\text{MB}$.
2. Delimo: $N = \dfrac{64000\,\text{MB}}{4\,\text{MB}} = 16000$.
3. Odgovor: na kartico gre približno $16000$ fotografij (malo manj, ker del prostora porabi datotečni sistem).

### Primer 2: trdi disk ali SSD

Video recept velikosti $1{,}2\,\text{GB}$ se mora pred predvajanjem naložiti v RAM. Trdi disk bere s hitrostjo $150\,\text{MB/s}$, SSD s $600\,\text{MB/s}$. Koliko časa traja nalaganje v vsakem primeru?

**Podatki:** velikost $1{,}2\,\text{GB}$, $v_{\text{disk}} = 150\,\text{MB/s}$, $v_{\text{SSD}} = 600\,\text{MB/s}$
**Iščemo:** čas nalaganja $t$ za oba

:::formula
$t = \dfrac{\text{količina podatkov}}{\text{hitrost branja}}$
:::

**Rešitev:**

1. Pretvorimo v MB: $1{,}2\,\text{GB} = 1200\,\text{MB}$, ker je hitrost podana v MB/s.
2. Trdi disk: $t = \dfrac{1200\,\text{MB}}{150\,\text{MB/s}} = 8\,\text{s}$.
3. SSD: $t = \dfrac{1200\,\text{MB}}{600\,\text{MB/s}} = 2\,\text{s}$.
4. Odgovor: s trdega diska čakamo $8\,\text{s}$, z SSD le $2\,\text{s}$, torej štirikrat manj.

### Primer 3 (težji): kako OS deli procesor

Na kuhinjskem tabličnem računalniku z enim procesorskim jedrom tečejo štirje programi: recept, glasba, sporočila in odštevalnik. Operacijski sistem jim izmenično daje rezine po $10\,\text{ms}$. Koliko časa odštevalnik čaka med dvema svojima rezinama? Koliko milisekund procesorskega časa dobi v eni sekundi?

**Podatki:** $4$ programi, rezina $10\,\text{ms}$, izmenično po vrsti, $1\,\text{s} = 1000\,\text{ms}$
**Iščemo:** čakanje med rezinama in procesorski čas odštevalnika v $1\,\text{s}$

:::formula
krog $= n \cdot$ rezina, čakanje $= (n - 1) \cdot$ rezina
:::

**Rešitev:**

1. En krog, v katerem vsak program enkrat pride na vrsto: $4 \cdot 10 = 40$ milisekund.
2. Med dvema rezinama odštevalnika so na vrsti ostali trije: čaka $3 \cdot 10 = 30$ milisekund.
3. V eni sekundi je $1000 / 40 = 25$ krogov, ker vsak traja $40\,\text{ms}$.
4. V vsakem krogu dobi odštevalnik eno rezino: $25 \cdot 10 = 250$ milisekund.
5. Odgovor: odštevalnik čaka $30\,\text{ms}$ med rezinama in v vsaki sekundi dobi $250\,\text{ms}$ procesorja, to je četrtino.

### Primer 4: zdaj ti

Telefon ima $6\,\text{GB}$ RAM-a. Operacijski sistem zase porabi $2\,\text{GB}$. Odprti sta aplikacija z recepti ($1{,}5\,\text{GB}$) in glasba ($0{,}3\,\text{GB}$). Koliko aplikacij po $0{,}8\,\text{GB}$ lahko še odpreš, preden mora OS katero zapreti ali umakniti iz RAM-a?

**Podatki:** RAM $6\,\text{GB}$, OS $2\,\text{GB}$, recepti $1{,}5\,\text{GB}$, glasba $0{,}3\,\text{GB}$, nova aplikacija $0{,}8\,\text{GB}$
**Iščemo:** največje celo število novih aplikacij

:::formula
prosto $= \text{RAM} - \text{OS} - \text{odprte aplikacije}$, nato število $=$ prosto $: 0{,}8\,\text{GB}$, zaokroženo navzdol
:::

**Rešitev:**

1. Za aplikacije ostane $6 - 2 = 4$ gigabajte.
2. Odštej že odprti aplikaciji in izračunaj, koliko novih gre zraven. Nato preveri:

:::premisli
Koliko prostora ostane in koliko novih aplikacij gre še v RAM?
---
Prosto je $4 - 1{,}5 - 0{,}3 = 2{,}2$ gigabajta. $\dfrac{2{,}2}{0{,}8} = 2{,}75$, zaokroženo navzdol $2$. Polovične aplikacije v RAM ne moreš naložiti, zato gresta le dve.
:::

## Pogoste napake

- **»Telefon ima 128 GB pomnilnika, torej je hiter.«** Tu sta pomešana RAM in shramba. $128\,\text{GB}$ je shramba (koliko datotek hraniš). Za hkrati odprte programe šteje RAM, ki je veliko manjši.
- **»Kar je v RAM-u, je shranjeno.«** RAM ob izklopu izgubi vsebino. Neshranjen dokument izgine, shranjen v shrambi ostane.
- **Mešanje GB in MB.** Če $1{,}2\,\text{GB}$ deliš s $150\,\text{MB/s}$ brez pretvorbe, dobiš $0{,}008\,\text{s}$, kar je $1000$-krat premalo. Pred deljenjem izrazi obe količini v isti enoti in deli količino s hitrostjo, ne obratno.
- **»Operacijski sistem je le namizje.«** Ozadje in ikone so le vmesnik. OS hkrati razporeja procesor, deli RAM in upravlja datoteke ter naprave, tudi ko ga ne vidiš.
- **»Računalnik razume Python.«** Procesor razume le strojno kodo. Program v Pythonu izvaja tolmač, program v C pa prevajalnik najprej prevede v strojno kodo.

## Povzetek

- Strojna oprema so fizični deli; programska oprema so programi, ki jim povedo, kaj delati.
- Procesor (krmilna enota, aritmetično-logična enota) ukaze prevzame, razbere in izvede, milijarde v sekundi.
- RAM je hiter in začasen (pult); shramba (SSD, disk) je počasnejša in trajna (shramba v kuhinji). Program se pred izvajanjem naloži iz shrambe v RAM.
- Vhodne naprave prinašajo podatke noter, izhodne ven; vodila povezujejo dele.
- Operacijski sistem razporeja procesor v časovnih rezinah, deli pomnilnik, upravlja datoteke in naprave (gonilniki). Je sistemska programska oprema; aplikacije so aplikacijska.
- Procesor razume le strojno kodo. Višje jezike prevede prevajalnik (vnaprej) ali tolmač (sproti).
- Čas prenosa: $t = \dfrac{\text{količina}}{\text{hitrost}}$, z enakimi enotami.

## Za izpit

Znati moraš povedati:
- razliko med strojno in programsko opremo ter med sistemsko in aplikacijsko programsko opremo, vsako s primerom;
- dela procesorja (krmilna enota, aritmetično-logična enota), krog »prevzemi, razberi, izvedi« ter kaj sta takt in frekvenca takta;
- razlike med RAM-om in shrambo (hitrost, obstojnost ob izklopu, velikost) in zakaj se program pred izvajanjem naloži v RAM;
- naloge operacijskega sistema ter kaj sta časovna rezina in gonilnik;
- kaj so strojna koda, zbirni jezik in višji programski jezik ter razliko med prevajalnikom in tolmačem;
- zvezi $t = \dfrac{\text{količina}}{\text{hitrost}}$ in krog $= n \cdot$ rezina, z enakimi enotami.

### Naloga 1

Brezpilotni letalnik nad vinogradom posname $1200$ fotografij po $25\,\text{MB}$ na pomnilniško kartico z $32\,\text{GB}$ ($1\,\text{GB} = 1000\,\text{MB}$). (a) Koliko prostora na kartici ostane? (b) Bralnik kartic bere s hitrostjo $80\,\text{MB/s}$. Koliko časa traja prenos vseh fotografij na SSD? (c) Računalnik ima $16\,\text{GB}$ RAM-a. Operacijski sistem porabi $3\,\text{GB}$, program za obdelavo slik $2{,}5\,\text{GB}$, vsaka odprta fotografija pa v RAM-u zavzame $150\,\text{MB}$. Koliko fotografij ima program lahko hkrati odprtih? (d) Obdelava ene skupine fotografij potrebuje $90\,\text{s}$ procesorskega časa. Na enem procesorskem jedru tečejo poleg nje še trije programi, vsi izmenično dobivajo rezine po $20\,\text{ms}$. Koliko časa traja obdelava skupine? Koliko taktov opravi procesor s frekvenco takta $3\,\text{GHz}$ v eni rezini?

**Rešitev:**

1. Vse fotografije skupaj: $1200 \cdot 25 = 30000$ megabajtov, to je $30\,\text{GB}$.
2. Na kartici ostane $32 - 30 = 2$ gigabajta.
3. Prenos: $t = \dfrac{30000\,\text{MB}}{80\,\text{MB/s}} = 375\,\text{s}$, to je $6\,\text{min}$ in $15\,\text{s}$.
4. Za fotografije je v RAM-u prosto $16 - 3 - 2{,}5 = 10{,}5$ gigabajta, to je $10500\,\text{MB}$.
5. Hkrati odprtih fotografij: $\dfrac{10500}{150} = 70$.
6. En krog štirih programov traja $4 \cdot 20 = 80$ milisekund; obdelava v njem dobi eno rezino, torej $20\,\text{ms}$ procesorja.
7. Za $90\,\text{s} = 90000\,\text{ms}$ procesorskega časa potrebuje $\dfrac{90000}{20} = 4500$ rezin, torej $4500$ krogov.
8. Trajanje: $4500 \cdot 80 = 360000$ milisekund, to je $360\,\text{s}$ ali $6\,\text{min}$. Obdelava dobi četrtino procesorja, zato traja štirikrat dlje kot $90\,\text{s}$.
9. V eni rezini ($20\,\text{ms} = 0{,}02\,\text{s}$) procesor opravi $3 \cdot 10^{9} \cdot 0{,}02 = 6 \cdot 10^{7}$ taktov.
10. Odgovor: na kartici ostane $2\,\text{GB}$, prenos traja $375\,\text{s}$, hkrati je lahko odprtih $70$ fotografij, obdelava skupine traja okoli $6\,\text{min}$, v eni rezini pa procesor opravi $6 \cdot 10^{7}$ taktov.

### Naloga 2

Isti izračun povprečnega pridelka je napisan enkrat v jeziku C in enkrat v Pythonu. Natančno navedi, po kateri poti pride vsak od programov od izvorne kode do izvajanja na procesorju, in utemelji, katero programsko opremo mora imeti računalnik, na katerem želiš program samo pognati.

**Rešitev:**

1. Izhodišče: procesor razume le strojno kodo, zaporedja ničel in enic, ki pomenijo njegove preproste ukaze. Stavka v višjem jeziku ne more izvesti neposredno.
2. C: prevajalnik prevede ves program vnaprej v strojno kodo. Nastane izvršljiva datoteka, ki je shranjena v shrambi.
3. Ob zagonu operacijski sistem izvršljivo datoteko naloži iz shrambe v RAM in ji dodeli časovne rezine; procesor njene ukaze prevzema, razbira in izvaja.
4. Python: prevoda vnaprej ni. Tolmač bere izvorno kodo sproti, stavek za stavkom, in vsak stavek takoj izvede. Na procesorju teče tolmač, ki je sam program v strojni kodi.
5. Za program v C zato na računalniku zadošča izvršljiva datoteka (in operacijski sistem); prevajalnika ne potrebuješ več, ker je svoje delo opravil vnaprej.
6. Za program v Pythonu mora biti na računalniku nameščen tolmač, ker se prevajanje dogaja med izvajanjem, ob vsakem zagonu znova.
7. Sklep: v obeh primerih procesor izvaja strojno kodo; razlika je v tem, kdaj nastane (vnaprej ali sproti) in kateri program jo priskrbi.

### Naloga 3

Utemelji, ali drži trditev: »Če v računalniku trdi disk zamenjamo z SSD, se program, ki je že naložen v RAM in samo računa, izvaja hitreje.«

**Rešitev:**

1. Shramba hrani programe in podatke trajno; pred izvajanjem se program naloži v RAM, ker je shramba za procesor prepočasna.
2. Hitrejša shramba skrajša nalaganje: po $t = \dfrac{\text{količina}}{\text{hitrost}}$ je čas obratno sorazmeren s hitrostjo branja. Program velikosti $1200\,\text{MB}$ se s trdega diska pri $150\,\text{MB/s}$ nalaga $8\,\text{s}$, z SSD pri $600\,\text{MB/s}$ pa $2\,\text{s}$.
3. Ko je program v RAM-u, procesor ukaze in podatke jemlje iz RAM-a. Hitrost računanja določata frekvenca takta in delež časovnih rezin, ki jih programu dodeli operacijski sistem; shramba v tem ne sodeluje.
4. Izjemi: program med delom bere ali zapisuje datoteke; ali pa RAM-a zmanjka in mora operacijski sistem dele programov umikati iz RAM-a v shrambo in jih brati nazaj. Takrat hitrost shrambe spet vpliva.
5. Sklep: trditev v splošnem ne drži. SSD pospeši zagon, nalaganje in shranjevanje, ne pa računanja programa, ki je že v celoti v RAM-u.

## Drugače: Na sliki

Računalnik si nariši kot torto v plasteh, od spodaj navzgor:

:::risba skica
opis: Tri plasti kot trije enako široki pravokotniki, zloženi drug na drugega. Spodaj je strojna oprema (CPE, RAM, SSD, V/I), nad njo operacijski sistem (razporeja, deli RAM), nad njim aplikacije (recepti, preglednica). Nad zgornjo plastjo si ti, uporabnik. Puščica kaže od uporabnika k aplikacijam.
območje: 0; 0 .. 20; 8,5
pravokotnik: 0,5; 0,5 .. 9,5; 2,5 | siva
pravokotnik: 0,5; 2,5 .. 9,5; 4,5 | modra
pravokotnik: 0,5; 4,5 .. 9,5; 6,5 | oranžna
napis: 5; 1,5 | strojna oprema | sredina | debelo
napis: 5; 3,5 | operacijski sistem | sredina | debelo
napis: 5; 5,5 | aplikacije | sredina | debelo
napis: 5; 7,9 | ti, uporabnik | sredina
puščica: 5; 7,4 -> 5; 6,6
napis: 10; 1,5 | CPE, RAM, SSD, V/I | desno
napis: 10; 3,5 | razporeja, deli RAM | desno
napis: 10; 5,5 | recepti, preglednica | desno
:::

Vsaka plast govori le s sosednjima. Aplikacija ne krmili diska sama, ampak prosi OS, OS pa prek gonilnika krmili disk.

V spodnji plasti si predstavljaj procesor na sredini. Levo od njega je RAM, povezan s širokim, kratkim hodnikom (hitro). Še bolj levo je shramba, povezana z ožjim hodnikom (počasneje). Zgoraj so vrata za vhod (tipkovnica, senzor), spodaj vrata za izhod (zaslon). Vsi podatki iz shrambe gredo do procesorja čez RAM.

## Drugače: Uporaba v stroki

Kaj se zgodi, ko vremenska postaja v sadovnjaku pošlje meritev in jo agronom odpre v pisarni?

1. Senzorji temperature, vlage zraka in omočenosti listov (vhodne naprave) vsakih $10$ minut izmerijo vrednosti, to je $6 \cdot 24 = 144$ meritev na dan.
2. Majhen procesor v postaji izvaja program, ki vrednosti prebere, jih za hip drži v RAM-u in zapiše v shrambo postaje. Zato meritve ostanejo tudi, če zmanjka toka.
3. Postaja meritve pošlje v pisarniški računalnik. Tam operacijski sistem prek gonilnika omrežne naprave sprejme podatke in jih zapiše v datoteko na SSD.
4. Agronom odpre program za napoved škrlupa. Operacijski sistem ga iz shrambe naloži v RAM in mu dodeli časovne rezine procesorja.
5. Program je napisan v Pythonu ali R, zato ga izvaja tolmač. Datoteko z meritvami prebere v RAM in procesor iz temperature in omočenosti listov izračuna nevarnost okužbe.
6. Zaslon (izhodna naprava) pokaže graf in opozorilo, tiskalnik izpiše priporočilo za škropljenje.
7. Ko agronom izračun shrani, se rezultat iz RAM-a zapiše v shrambo. Šele zdaj ga lahko pošlje naprej ali naslednje leto primerja z novimi meritvami.

V tem zaporedju so vsi deli lekcije: vhod, procesor, RAM, shramba, operacijski sistem z gonilniki, programski jezik, izhod. Enako pot imajo podatki s tehtnice v laboratoriju, iz molznega robota ali s terminala v traktorju.

## Preveri se

? Tabela ima stolpca »hiter, a začasen« in »počasnejši, a trajen«. Kateri par spada vanju v tem vrstnem redu?
+ RAM | SSD
- SSD | RAM
~ Obrnjeno. RAM je hiter in ob izklopu izgubi vsebino, SSD je počasnejši in jo obdrži.
- procesor | RAM
~ RAM ni trajen: ob izklopu se izprazni. Trajna je šele shramba.
- RAM | RAM
~ Ista naprava ne more biti hkrati začasna in trajna; trajna hramba je SSD ali trdi disk.
> RAM je delovni pult (hiter, začasen), SSD je shramba (počasnejša, trajna).

? Igra velikosti $3\,\text{GB}$ se nalaga z SSD-ja s hitrostjo $500\,\text{MB/s}$. Približno koliko traja nalaganje?
- približno $0{,}006\,\text{s}$
~ Tako dobiš, če deliš $3$ s $500$ brez pretvorbe GB v MB.
+ približno $6\,\text{s}$
- približno $170\,\text{s}$
~ To je $500 : 3$, deljenje v obratni smeri. Čas je količina, deljena s hitrostjo.
- približno $1500\,\text{s}$
~ Časa ne dobiš z množenjem ($3000 \cdot 0{,}5$), ampak z deljenjem količine s hitrostjo.
> $3\,\text{GB} = 3000\,\text{MB}$, $t = \dfrac{3000\,\text{MB}}{500\,\text{MB/s}} = 6\,\text{s}$.

? Zakaj računalnik potrebuje RAM, čeprav ima velik SSD?
- Ker SSD ne more hraniti programov.
~ Programi so ravno v shrambi (SSD). Ob zagonu jih OS prenese v RAM.
+ Ker je shramba za procesor prepočasna, zato program in podatke med delom drži v hitrem RAM-u.
- Ker RAM obdrži podatke tudi ob izklopu.
~ Ravno obratno: RAM ob izklopu izgubi vsebino; trajna je shramba.
> Procesor dela milijarde korakov v sekundi. Podatke mora dobiti hitro, zato delo poteka v RAM-u, shramba pa hrani vse trajno.

? Operacijski sistem daje vsakemu programu rezino $20\,\text{ms}$, programi se menjajo po vrsti. Vsak program pride na vrsto vsakih $100\,\text{ms}$ (od začetka ene njegove rezine do začetka naslednje). Koliko programov teče?
- $4$
~ To je število drugih programov. Krog $100\,\text{ms}$ vključuje tudi rezino programa samega.
+ $5$
- $2000$
~ Rezine se ne množijo s krogom; krog je vsota rezin vseh programov.
- $0{,}2$
~ Deljenje v obratni smeri ($20 : 100$). Programov ne more biti manj kot eden.
> Krog $=$ število programov $\cdot$ rezina, torej $\dfrac{100\,\text{ms}}{20\,\text{ms}} = 5$.

? Pametna pečica ima zaslon, tipke, senzor temperature, procesor in program, ki vodi peko po izbranem receptu. Kaj je senzor temperature?
- izhodna naprava
~ Izhodne naprave dajejo podatke ven (zaslon, grelec). Senzor podatek o temperaturi prinaša v napravo.
+ vhodna strojna oprema
- programska oprema
~ Senzor lahko primeš, zato je strojna oprema. Program za peko je programska oprema.
- operacijski sistem
~ Operacijski sistem je program, ki upravlja naprave; senzor je ena od naprav, ki jih upravlja.
> Senzor meri temperaturo in podatek pošlje procesorju, zato je vhodna naprava, torej strojna oprema.

:::simboli
N | število fotografij, ki jih shranimo | N = \frac{\text{kapaciteta}}{\text{velikost ene fotografije}} | – | zaokrožimo navzdol
t | čas nalaganja | t = \frac{\text{količina podatkov}}{\text{hitrost branja}} | s
n | število programov, ki izmenično dobivajo rezine | | – | krog traja n rezin
:::
