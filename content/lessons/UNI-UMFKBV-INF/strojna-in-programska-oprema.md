---
stanje: osnutek
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
4. Odgovor: s trdega diska čakamo $8\,\text{s}$, s SSD le $2\,\text{s}$, torej štirikrat manj.

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

## Drugače: Na sliki

Računalnik si nariši kot torto v plasteh, od spodaj navzgor:

```
   [ ti, uporabnik ]
 ------------------------
 | aplikacije          |  recepti, preglednica
 ------------------------
 | operacijski sistem  |  razporeja, deli RAM
 ------------------------
 | strojna oprema      |  CPE, RAM, SSD, V/I
 ------------------------
```

Vsaka plast govori le s sosednjima. Aplikacija ne krmili diska sama, ampak prosi OS, OS pa prek gonilnika krmili disk.

V spodnji plasti si predstavljaj procesor na sredini. Levo od njega je RAM, povezan s širokim, kratkim hodnikom (hitro). Še bolj levo je shramba, povezana z ožjim hodnikom (počasneje). Zgoraj so vrata za vhod (tipkovnica, senzor), spodaj vrata za izhod (zaslon). Vsi podatki iz shrambe gredo do procesorja čez RAM.

## Drugače: Iz vsakdanjega življenja

Kaj se zgodi, ko na telefonu tapneš ikono kamere?

1. Zaslon na dotik (vhodna naprava) zazna dotik in sporoči koordinate.
2. Operacijski sistem ugotovi, da si zadel ikono kamere.
3. OS poišče aplikacijo v shrambi in jo naloži v RAM, če je tam še ni.
4. OS aplikaciji dodeli časovne rezine procesorja.
5. Aplikacija prek OS in gonilnika vklopi kamero (vhodna naprava).
6. Procesor obdeluje sliko, zaslon (izhodna naprava) jo pokaže.
7. Ko pritisneš sprožilec, se fotografija iz RAM-a zapiše v shrambo. Šele zdaj je varna, tudi če se baterija izprazni.

V tem zaporedju so vsi deli lekcije: vhod, OS, shramba, RAM, procesor, izhod.

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

? Igra velikosti $3\,\text{GB}$ se nalaga s SSD-ja s hitrostjo $500\,\text{MB/s}$. Približno koliko traja nalaganje?
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
