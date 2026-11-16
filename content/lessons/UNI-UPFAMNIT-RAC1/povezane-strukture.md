---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec trdi: »Povezan seznam je samo počasnejša tabela. Vse, kar zna seznam, zna tudi tabela, zato seznamov sploh ne potrebujemo.«

Ima prav le na pol. Predstavljaj si zidarja, ki na gradbišču polaga vrsto tlakovcev. Če mora nov tlakovec vstaviti **na začetek** že položene vrste, mora vse ostale premakniti za eno mesto. Pri tisoč tlakovcih je to tisoč premikov. Pri verigi, kjer je vsak člen le pripet na naslednjega, pa nov člen pripneš spredaj in si gotov.

Tabela je kot vrsta tlakovcev, povezan seznam kot veriga. Na koncu boš sam razsodil, kdaj ima sošolec prav. Spotoma spoznaš še **sklad**, **vrsto** in **drevo** ter kako program zanje dobi pomnilnik.

## Razlaga

**1. Izhodišče: tabela.** Tabelo že poznaš. Njeni elementi ležijo v pomnilniku **tesno drug ob drugem**. Recimo, da se tabela celih števil začne na naslovu $1000$ in vsak element zasede $4$ bajte:

| indeks | naslov | vrednost |
|---|---|---|
| 0 | 1000 | 7 |
| 1 | 1004 | 3 |
| 2 | 1008 | 9 |
| 3 | 1012 | 4 |

Naslov elementa z indeksom $i$ program izračuna z enim računom: začetek $+\; i \cdot$ velikost. Do sedmega elementa zato pride enako hitro kot do prvega. Cena za to udobje: elementi morajo biti v enem samem nepretrganem kosu pomnilnika.

**2. Prva razlika: členi namesto bloka.** Povezan seznam je sestavljen iz **vozlišč**. Vozlišče je majhen paket z dvema poljema: **podatek** in **kazalec** na naslednje vozlišče. Kazalec (v nekaterih jezikih mu rečemo referenca) je naslov, kjer v pomnilniku leži naslednik. Zadnje vozlišče ima namesto naslova posebno vrednost »nič« (∅). Na prvo vozlišče kaže spremenljivka, ki ji rečemo **glava**.

:::risba skica
opis: Povezan seznam s tremi vozlišči v vrsti od leve proti desni. Skrajno levo je napis glava, od njega kaže puščica na prvo vozlišče. Vsako vozlišče je pravokotnik z dvema poljema: levo podatek, desno kazalec. Prvo vozlišče hrani 7 in njegov kazalec kaže na drugo vozlišče, drugo hrani 3 in kaže na tretje, tretje hrani 9 in ima v polju kazalca znak ∅, ker nima naslednika.
območje: -1; -0,5 .. 20; 4,5
napis: 0,8; 2 | glava | sredina
puščica: 2,3; 2 -> 3,5; 2
pravokotnik: 3,5; 1 .. 7,5; 3 | modra
črta: 5,5; 1 -> 5,5; 3
napis: 4,5; 2 | 7 | sredina
točka: 6,5; 2
puščica: 6,5; 2 -> 9,5; 2
pravokotnik: 9,5; 1 .. 13,5; 3 | modra
črta: 11,5; 1 -> 11,5; 3
napis: 10,5; 2 | 3 | sredina
točka: 12,5; 2
puščica: 12,5; 2 -> 15,5; 2
pravokotnik: 15,5; 1 .. 19,5; 3 | modra
črta: 17,5; 1 -> 17,5; 3
napis: 16,5; 2 | 9 | sredina
napis: 18,5; 2 | ∅ | sredina
napis: 4,5; 0,3 | podatek | sredina | siva
napis: 6,5; 3,7 | kazalec | sredina | siva
podnapis: Glava kaže na prvo vozlišče, zadnje vozlišče ima kazalec ∅.
:::

Vozlišča so lahko raztresena kjerkoli po pomnilniku, kot členi verige, ki ležijo na mizi v neredu. Vrstni red določajo kazalci, ne položaj.

**3. Kaj to spremeni.** Ker naslovov ne moremo izračunati, do $k$-tega vozlišča pridemo le tako, da od glave $k$ korakov sledimo kazalcem. Vstavljanje na začetek pa je preprosto: novemu vozlišču nastavimo kazalec na staro glavo, nato glavo preusmerimo nanj. Dve spremembi, ne glede na dolžino seznama.

| opravilo | tabela | povezan seznam |
|---|---|---|
| dostop do $k$-tega | en račun | $k$ korakov |
| vstavi na začetek | premakni vse | 2 kazalca |
| pomnilnik na element | samo podatek | podatek + kazalec |
| sprememba velikosti | nov blok, kopiranje | vozlišče po vozlišče |

:::premisli
Tabela in seznam imata vsak po $6$ elementov. Koliko elementov moraš premakniti, ko vstaviš novega **na začetek**, in koliko, ko ga vstaviš **na konec** (v tabeli je na koncu še prostor)?
---
Na začetek: v tabeli $6$ premikov, v seznamu nič, le $2$ kazalca. Na konec: v tabeli nič, v seznamu pa moraš najprej $6$-krat slediti kazalcem do zadnjega vozlišča (razen če si hraniš še kazalec na konec). Nobena struktura ni hitrejša pri vsem.
:::

**4. Alokacija pomnilnika.** Alokacija pomeni, da program od sistema dobi kos pomnilnika. Tabelo navadno ustvarimo naenkrat, z znano velikostjo, zato dobi en sam blok. Če se napolni, je ne moremo podaljšati na mestu, ker je za njo morda že nekaj drugega. Treba je zahtevati večji blok in vse prepisati.

Vozlišče pa ustvarimo šele takrat, ko ga potrebujemo. Temu rečemo **dinamična alokacija**. Pomnilnik dobi iz območja, ki mu pravimo **kopica**. Ko vozlišča ne potrebujemo več, se pomnilnik sprosti: v nekaterih jezikih ročno, v drugih ga samodejno pobere **smetar** (angl. *garbage collector*), ko na vozlišče ne kaže noben kazalec več.

**5. Sklad: dostop le z vrha.** Zdaj omejimo seznam. Pri **skladu** dodajamo in jemljemo samo na enem koncu, ki mu pravimo vrh. Operaciji sta **potisni** (doda na vrh) in **vzemi** (odstrani z vrha). Kar je prišlo zadnje, gre prvo ven. To pravilo se imenuje LIFO (angl. *last in, first out*). Sklad ploščic na paleti deluje enako: ploščice z dna ne moreš izvleči, ne da bi prej odložil vse nad njo.

Sklad iz povezanega seznama naredimo preprosto: vrh je glava, potisni je vstavljanje na začetek, vzemi je odstranjevanje z začetka. Obe operaciji porabita le nekaj korakov.

**6. Vrsta: noter zadaj, ven spredaj.** **Vrsta** se od sklada razlikuje v enem samem pravilu. Dodajamo na konec, jemljemo z začetka. Kar je prišlo prvo, gre prvo ven: FIFO (angl. *first in, first out*). Tako na gradbišče prihajajo tovornjaki z materialom: prvi, ki je pripeljal, je prvi raztovorjen. Pri povezanem seznamu za vrsto hranimo dva kazalca, na začetek in na konec, da sta obe operaciji hitri.

:::premisli
V urejevalniku besedil vtipkaš »a«, nato »b«, nato »c« in dvakrat pritisneš »Razveljavi«. Kaj ostane? Ali naj urejevalnik spremembe hrani v skladu ali v vrsti?
---
Ostane »a«. Razveljaviti želimo najprej **zadnjo** spremembo. To je LIFO, torej sklad. Vrsta bi najprej preklicala najstarejšo spremembo, recimo prvo vtipkano besedo, kar ni tisto, kar uporabnik pričakuje.
:::

**7. Drevo: več naslednikov.** Seznam ima v vsakem vozlišču en kazalec. Če vozlišču dovolimo več kazalcev, dobimo **drevo**. Vozlišča, na katera kaže neko vozlišče, so njegovi **otroci**, ono pa je njihov **starš**. Vsako vozlišče ima natanko enega starša, le **koren** ga nima; vozlišča brez otrok so **listi**.

**Višina** drevesa je število povezav na najdaljši poti od korena do lista. Če ima vsako vozlišče največ dva otroka, je to **dvojiško drevo**.

Načrt hiše je drevo: koren je hiša, njeni otroci so nadstropja, otroci nadstropij so sobe.

## Rešeni primeri

### Primer 1: paleta ali tovornjaki

Zidar na paleto zaporedno odloži vreče $A$, $B$, $C$, nato eno vzame, odloži $D$, nato vzame še dve. Katere vreče je vzel in v kakšnem vrstnem redu? Kaj ostane? Kaj bi se zgodilo pri enakem zaporedju ukazov, če bi šlo za vrsto?

**Podatki:** ukazi: potisni $A$, potisni $B$, potisni $C$, vzemi, potisni $D$, vzemi, vzemi
**Iščemo:** vrstni red vzetih elementov in kaj ostane, za sklad in za vrsto

:::formula
Sklad: vzemi odstrani **zadnji** dodani element (LIFO). Vrsta: vzemi odstrani **najstarejši** element (FIFO).
:::

**Rešitev:**

1. Sklad po treh potiskih (vrh desno): $A, B, C$. Vzemi vrne $C$, ker je bil dodan zadnji.
2. Potisni $D$: $A, B, D$. Vzemi vrne $D$, nato $B$. Ostane $A$.
3. Vrsta po treh dodajanjih (začetek levo): $A, B, C$. Vzemi vrne $A$, ker je bil prvi.
4. Dodaj $D$: $B, C, D$. Vzemi vrne $B$, nato $C$. Ostane $D$.
5. Odgovor: sklad vrne $C, D, B$ in ostane $A$; vrsta vrne $A, B, C$ in ostane $D$.

### Primer 2: naslov in vstavljanje

Mizar hrani $1000$ meritev desk v tabeli celih števil, ki se začne na naslovu $2000$; vsako število zasede $4$ bajte. Na katerem naslovu je element z indeksom $250$? Koliko premikov zahteva nova meritev na začetku (na koncu je še prostor) in koliko sprememb kazalcev bi zahteval povezan seznam?

**Podatki:** $n = 1000$ elementov, začetni naslov $2000$, velikost elementa $4\,\mathrm{B}$, indeks $i = 250$
**Iščemo:** naslov elementa $i$, število premikov pri tabeli, število sprememb kazalcev pri seznamu

:::formula
naslov $=$ začetek $+\; i \cdot$ velikost; vstavljanje na začetek tabele premakne vseh $n$ elementov, pri seznamu spremenimo $2$ kazalca
:::

**Rešitev:**

1. Naslov: $2000 + 250 \cdot 4 = 3000$. Računamo neposredno, ker elementi ležijo brez vrzeli.
2. Vstavljanje v tabelo: vsak od $1000$ elementov se premakne za eno mesto naprej, da se sprosti indeks $0$. To je $1000$ premikov.
3. Vstavljanje v seznam: novo vozlišče dobi kazalec na staro glavo, glava pa kaže na novo vozlišče. To sta $2$ spremembi.
4. Odgovor: element je na naslovu $3000$; tabela potrebuje $1000$ premikov, seznam le $2$ spremembi kazalcev.

### Primer 3: drevo načrta hiše

Arhitekt hišo opiše kot drevo. Hiša ima $3$ nadstropja, vsako nadstropje ima $4$ sobe, vsaka soba ima $2$ okni. Koliko vozlišč ima drevo, koliko je listov in kolikšna je višina?

**Podatki:** koren: hiša; $3$ nadstropja; $4$ sobe na nadstropje; $2$ okni na sobo
**Iščemo:** število vozlišč, število listov, višino drevesa

:::formula
Vozlišča štejemo po ravneh: število na ravni $=$ število na prejšnji ravni $\cdot$ število otrok. Listi so vozlišča brez otrok (tukaj vsa na zadnji ravni), višina je število povezav od korena do lista.
:::

**Rešitev:**

1. Raven $0$: $1$ hiša.
2. Raven $1$: $3$ nadstropja.
3. Raven $2$: $3 \cdot 4 = 12$ sob, ker ima vsako nadstropje svoje sobe.
4. Raven $3$: $12 \cdot 2 = 24$ oken.
5. Vseh vozlišč je $1 + 3 + 12 + 24 = 40$.
6. Okna nimajo otrok, zato so listi: $24$ listov. Pot hiša → nadstropje → soba → okno ima $3$ povezave, torej je višina $3$.
7. Odgovor: drevo ima $40$ vozlišč, od tega $24$ listov, in višino $3$.

### Primer 4: zdaj ti

Tesar si v programu vodi $1000$ dolžin letev. Vsaka dolžina je celo število s $4$ bajti, kazalec v vozlišču pa zasede $8$ bajtov. Koliko pomnilnika porabi tabela in koliko povezan seznam? Kolikokrat več porabi seznam?

**Podatki:** $n = 1000$, podatek $4\,\mathrm{B}$, kazalec $8\,\mathrm{B}$
**Iščemo:** pomnilnik tabele, pomnilnik seznama, njuno razmerje

:::formula
tabela: $n \cdot$ podatek; seznam: $n \cdot ($podatek $+$ kazalec$)$
:::

**Rešitev:**

1. Tabela: $1000 \cdot 4 = 4000$, torej $4000\,\mathrm{B}$.
2. Vsako vozlišče ima podatek in kazalec. Izračunaj sam pomnilnik seznama in razmerje, nato preveri:

:::premisli
Koliko bajtov porabi seznam in kolikokrat več je to od tabele?
---
Seznam: $1000 \cdot (4 + 8) = 12000\,\mathrm{B}$. To je $3$-krat več kot tabela. Kazalci stanejo pomnilnik, zato seznam ni varčnejši od tabele.
:::

## Pogoste napake

- **»Do petega vozlišča skočim takoj.«** Napaka pride iz navade s tabelo, kjer indeks takoj da naslov. V seznamu naslova ni mogoče izračunati, ker vozlišča niso zaporedna. Popravek: do $k$-tega vozlišča je treba od glave narediti $k$ korakov po kazalcih.
- **Brisanje brez prevezovanja.** Študent izbriše vozlišče $B$ v verigi $A \to B \to C$ in misli, da je konec. Kazalec v $A$ pa še vedno kaže na izbrisano mesto, vozlišča za njim so izgubljena. Popravek: najprej preusmeri kazalec v $A$ na $C$, šele nato sprosti $B$.
- **Zamenjava sklada in vrste.** »Oba hranita elemente, torej vzemi vrne isti element.« Ne: sklad vrne zadnjega dodanega (LIFO), vrsta najstarejšega (FIFO). Popravek: pri vsakem vzemi najprej vprašaj, na katerem koncu se jemlje.
- **»Seznam porabi manj pomnilnika, ker se širi po potrebi.«** Res se širi po potrebi, a vsako vozlišče nosi še kazalec. Popravek: na element porabi seznam več pomnilnika kot tabela; prednost je prilagodljivost, ne varčnost.

## Povzetek

- Tabela: elementi v enem bloku, dostop do indeksa $i$ z enim računom, vstavljanje na začetek premakne vse.
- Povezan seznam: vozlišča (podatek + kazalec) kjerkoli v pomnilniku; dostop do $k$-tega v $k$ korakih, vstavljanje na začetek z $2$ kazalcema, več pomnilnika na element.
- Sklad: potisni in vzemi na vrhu, LIFO. Vrsta: dodaj na konec, vzemi z začetka, FIFO.
- Drevo: vozlišče ima lahko več otrok; koren, listi, višina. Dvojiško drevo ima največ dva otroka na vozlišče.
- Dinamična alokacija: vozlišče dobi pomnilnik s kopice, ko ga ustvarimo; sprosti se ročno ali s smetarjem.
- Sošolec je imel prav le na pol: tabela je boljša za dostop po indeksu, seznam za pogosto vstavljanje in brisanje.

## Za izpit

Znati moraš povedati:

- kako ležijo v pomnilniku elementi tabele in kako vozlišča povezanega seznama (podatek, kazalec, glava, ∅) ter formulo naslov $=$ začetek $+\; i \cdot$ velikost;
- ceno opravil v tabeli in v seznamu: dostop do $k$-tega elementa, vstavljanje na začetek in na konec, pomnilnik na element, sprememba velikosti;
- postopek vstavljanja na začetek seznama in brisanja vozlišča s pravilnim vrstnim redom prevezovanja kazalcev;
- definiciji sklada (LIFO, potisni in vzemi na vrhu) in vrste (FIFO, dodaj na konec, vzemi z začetka) ter njuno izvedbo s povezanim seznamom;
- pojme koren, starš, otrok, list, višina in dvojiško drevo ter štetje vozlišč po ravneh;
- kaj je dinamična alokacija, od kod vozlišče dobi pomnilnik in kako se ta sprosti (ročno ali s smetarjem).

### Naloga 1

V drevesu ima vsako vozlišče, ki ni list, natanko $3$ otroke, vsi listi pa so na ravni $4$ (koren je na ravni $0$). Vsako vozlišče hrani podatek z $8$ bajti in $3$ kazalce na otroke, vsak kazalec zasede $8$ bajtov (pri listih so vsi trije ∅). (a) Koliko vozlišč in koliko listov ima drevo in kolikšna je njegova višina? (b) Koliko pomnilnika porabi drevo in kolikšen delež vseh kazalcev je ∅? (c) Kolikokrat več pomnilnika porabi drevo kot tabela z istimi podatki? (d) Iste podatke preložimo v dvojiško drevo. Kolikšna je najmanjša mogoča višina?

**Rešitev:**

1. Vozlišča štejemo po ravneh, vsaka raven jih ima $3$-krat več kot prejšnja: $1$, $3$, $9$, $27$, $81$.
2. Vseh vozlišč je $1 + 3 + 9 + 27 + 81 = 121$. Listi so vozlišča na ravni $4$, torej jih je $81$. Pot od korena do lista ima $4$ povezave, višina je $4$.
3. Eno vozlišče zasede $8 + 3 \cdot 8 = 32$ bajtov, drevo torej $121 \cdot 32 = 3872$, to je $3872\,\mathrm{B}$.
4. Vseh kazalcev je $121 \cdot 3 = 363$. Vsako vozlišče razen korena ima natanko enega starša, zato na vozlišče kaže $121 - 1 = 120$ kazalcev. Kazalcev ∅ je $363 - 120 = 243$. Preverimo še z listi: $81 \cdot 3 = 243$.
5. Delež kazalcev ∅ je $\frac{243}{363} \approx 0{,}67$, torej približno dve tretjini.
6. Tabela hrani samo podatke: $121 \cdot 8 = 968$, to je $968\,\mathrm{B}$. Razmerje je $\frac{3872}{968} = 4$.
7. Dvojiško drevo ima na ravni $r$ največ $2^r$ vozlišč, ker se število na vsaki ravni kvečjemu podvoji. Drevo višine $5$ jih ima največ $1 + 2 + 4 + 8 + 16 + 32 = 63$, kar je manj od $121$. Drevo višine $6$ jih ima največ $63 + 64 = 127$, kar zadošča.
8. Odgovor: drevo ima $121$ vozlišč, od tega $81$ listov, in višino $4$; porabi $3872\,\mathrm{B}$, kar je $4$-krat več od tabele, in približno $67\,\%$ njegovih kazalcev je ∅; najmanjša višina dvojiškega drevesa s $121$ vozlišči je $6$.

### Naloga 2

Povezan seznam celih števil je v pomnilniku zapisan takole: glava hrani naslov $1040$; na naslovu $1040$ je vozlišče s podatkom $7$ in kazalcem $1024$; na naslovu $1024$ vozlišče s podatkom $3$ in kazalcem $1100$; na naslovu $1100$ vozlišče s podatkom $9$ in kazalcem ∅. Kazalca na konec seznama ne hranimo. Po vrsti izvedi: (a) vstavi $5$ na začetek, novo vozlišče dobi naslov $1200$; (b) izbriši vozlišče s podatkom $3$; (c) vstavi $4$ na konec, novo vozlišče dobi naslov $1300$. Pri vsakem opravilu zapiši spremembe kazalcev v pravilnem vrstnem redu, število sledenj kazalcu in utemelji vrstni red. (d) Seznam s $1000$ vozlišči na enak način podaljšamo za $200$ elementov na koncu. Kolikokrat skupaj sledimo kazalcu in koliko bi bilo sledenj s kazalcem na konec?

**Rešitev:**

1. (a) Najprej v novo vozlišče na naslovu $1200$ zapišemo podatek $5$ in kazalec $1040$ (staro glavo), šele nato glavo nastavimo na $1200$. V obratnem vrstnem redu bi naslov $1040$ izgubili in stari seznam ne bi bil več dosegljiv. Sledenj ni, spremembi sta $2$.
2. Seznam je zdaj $5 \to 7 \to 3 \to 9$ na naslovih $1200$, $1040$, $1024$, $1100$.
3. (b) Potrebujemo **predhodnika** vozlišča s podatkom $3$. Od glave pridemo do $1200$ (podatek $5$), nato do $1040$ (podatek $7$), katerega kazalec $1024$ kaže na iskano vozlišče. To sta $2$ sledenji.
4. Iz vozlišča $1024$ preberemo njegov kazalec $1100$ in ga zapišemo v vozlišče $1040$. Šele nato sprostimo vozlišče $1024$. Če bi ga sprostili prej, bi kazalec v $1040$ kazal na sproščeno mesto, vozlišče $1100$ pa bi bilo izgubljeno. Sprememba kazalca je $1$.
5. Seznam je zdaj $5 \to 7 \to 9$ na naslovih $1200$, $1040$, $1100$.
6. (c) Do zadnjega vozlišča pridemo s $3$ sledenji: $1200$, $1040$, $1100$. V novo vozlišče $1300$ zapišemo podatek $4$ in kazalec ∅, nato kazalec v $1100$ nastavimo na $1300$. Novo vozlišče pripravimo prej, da seznam v nobenem trenutku ne kaže na nedokončano vozlišče.
7. Končno stanje: glava $= 1200$; $1200$: ($5$, $1040$); $1040$: ($7$, $1100$); $1100$: ($9$, $1300$); $1300$: ($4$, ∅). Vrstni red podatkov je $5, 7, 9, 4$.
8. (d) Pred prvim dodajanjem ima seznam $1000$ vozlišč, pred zadnjim $1199$. Vsakič sledimo kazalcu tolikokrat, kolikor je vozlišč, skupaj $1000 + 1001 + \dots + 1199$. To je vsota $200$ členov aritmetičnega zaporedja: $200 \cdot \frac{1000 + 1199}{2} = 219900$.
9. S kazalcem na konec sledenj ni: novo vozlišče pripnemo na zadnje in kazalec na konec premaknemo nanj, pri vsakem dodajanju sta to $2$ spremembi, skupaj $200 \cdot 2 = 400$ sprememb.
10. Odgovor: vstavljanje na začetek zahteva $0$ sledenj in $2$ spremembi, brisanje $2$ sledenji in $1$ spremembo, vstavljanje na konec $3$ sledenja in $2$ zapisa kazalca; končni seznam je $5, 7, 9, 4$. Brez kazalca na konec je za $200$ dodajanj potrebnih $219900$ sledenj, z njim nobeno.

### Naloga 3

Natančno navedi definiciji sklada in vrste ter opiši, kako vsako od njiju izvedemo z enojno povezanim seznamom. Utemelji, zakaj vrsta potrebuje kazalec na konec, sklad pa ne, in zakaj pri vrsti jemljemo pri glavi in dodajamo na koncu, ne obratno.

**Rešitev:**

1. Sklad je struktura, pri kateri dodajamo (potisni) in jemljemo (vzemi) samo na enem koncu, na vrhu. Vzemi vrne zadnji dodani element: LIFO.
2. Vrsta je struktura, pri kateri dodajamo na konec in jemljemo z začetka. Vzemi vrne najstarejši element: FIFO.
3. Sklad s seznamom: vrh je glava. Potisni je vstavljanje na začetek ($2$ spremembi kazalcev), vzemi je odstranjevanje z začetka (glavo preusmerimo na drugo vozlišče, prvo sprostimo). Obe opravili se dotakneta le glave, zato je število korakov neodvisno od dolžine in kazalec na konec ni potreben.
4. Vrsta s seznamom: jemljemo pri glavi kot pri skladu. Dodajamo pa na drugem koncu. Brez kazalca na konec bi morali pri $n$ vozliščih vsakič $n$-krat slediti kazalcem do zadnjega vozlišča. S kazalcem na konec novo vozlišče pripnemo na zadnje in kazalec premaknemo nanj, kar sta $2$ spremembi ne glede na $n$.
5. Zakaj ne obratno: če bi jemali na koncu, bi morali po odstranitvi zadnjega vozlišča kazalec na konec premakniti na **predzadnje** vozlišče in njegov kazalec nastaviti na ∅. V enojno povezanem seznamu kazalci kažejo samo naprej, zato do predzadnjega vozlišča pridemo le od glave, z $n - 1$ sledenji. Kazalec na konec pri tem ne pomaga.
6. Posebna primera: ko v prazno vrsto dodamo prvi element, morata nanj kazati glava in kazalec na konec; ko vzamemo zadnji element, moramo oba nastaviti na ∅.
7. Sklep: sklad uporablja en konec seznama, zato zadošča glava. Vrsta uporablja oba konca; hitra je le, če dodajamo tam, kjer zadošča kazalec na konec, in jemljemo tam, kjer je glava.

## Drugače: Na sliki

Nariši pomnilnik kot dolg trak predalčkov z naslovi.

- **Tabela** je en strnjen pas predalčkov, recimo od $1000$ do $1012$. Puščic ni, sosed je vedno tik ob tebi.
- **Seznam** so trije predalčki na naslovih $1040$, $1024$ in $1100$. V vsakem je število in puščica na naslednji predalček. Puščice skačejo naprej in nazaj po traku.
- **Sklad** nariši navpično: stolpec škatel, roka sega le do zgornje.
- **Vrsta** je vodoravna cev: vstopa se desno, izstopa levo.
- **Drevo** nariši obrnjeno: koren zgoraj, iz njega veje navzdol do listov.

## Drugače: Uporaba v stroki

- **Tabela** je slikovni pomnilnik zaslona. Slika s $1920 \times 1080$ piksli in $4$ bajti na piksel zasede $1920 \cdot 1080 \cdot 4 = 8294400$ bajtov, približno $8{,}3\,\mathrm{MB}$, v enem bloku. Odmik piksla v vrstici $500$ in stolpcu $800$ grafični gonilnik izračuna z enim računom: $(500 \cdot 1920 + 800) \cdot 4 = 3843200$.
- **Povezan seznam** uporablja upravljalnik pomnilnika: proste bloke kopice veže v seznam prostih blokov, kjer vsak blok hrani naslov naslednjega. Sproščeni blok pripne na začetek z $2$ spremembama kazalcev. Jedro operacijskega sistema ima v povezanem seznamu tudi vse procese.
- **Sklad** je klicni sklad programa. Ob vsakem klicu metode se nanj potisnejo parametri in povratni naslov, ob vrnitvi se vzamejo. Nit ima zanj navadno okoli $1\,\mathrm{MB}$ prostora, zato pregloboka rekurzija konča z napako prekoračitve sklada.
- **Vrsta** je tiskalniška vrsta in vrsta sporočil med strežniki: zahtevki se obdelajo v vrstnem redu prihoda. Usmerjevalnik v vrsti hrani pakete, ki čakajo na pošiljanje.
- **Drevo** je datotečni sistem (koren `/`, mape, datoteke kot listi), drevo elementov spletne strani v brskalniku in sintaktično drevo, ki ga iz programa zgradi prevajalnik.

## Preveri se

? Katera trditev o skladu je pravilna?
- Vzemi vrne element, ki je bil dodan prvi.
~ To velja za vrsto (FIFO). Sklad deluje po pravilu LIFO.
+ Vzemi vrne element, ki je bil dodan zadnji.
- Vzemi lahko vrne katerikoli element, če poznamo njegov indeks.
~ Sklad nima dostopa po indeksu; jemljemo samo z vrha.
> Sklad je LIFO: zadnji potisnjeni element je na vrhu in pride ven prvi.

? Tabela celih števil se začne na naslovu $400$, vsak element zasede $8$ bajtov. Na katerem naslovu je element z indeksom $6$?
- $406$
~ Indeks je treba pomnožiti z velikostjo elementa; prišteti samo $6$ bi bilo prav le pri elementih velikosti $1$ bajt.
+ $448$
- $456$
~ To je naslov elementa z indeksom $7$. Indeksi se začnejo z $0$, zato je element z indeksom $6$ sedmi po vrsti.
- Ni ga mogoče izračunati, treba je slediti kazalcem.
~ Kazalcem sledimo v povezanem seznamu. Elementi tabele ležijo zaporedno, zato naslov izračunamo.
> $400 + 6 \cdot 8 = 448$.

? Študent je iz seznama $A \to B \to C \to D$ izbrisal vozlišče $C$ takole: 1. od glave poišče $C$; 2. sprosti pomnilnik vozlišča $C$; 3. konec. Kje je napaka?
- V koraku 1: vozlišča ne smemo iskati od glave.
~ Drugega načina ni; v seznamu do vozlišča pridemo le od glave.
- Napake ni, sprostitev pomnilnika zadošča.
~ Kazalec v $B$ še vedno kaže na sproščeno mesto, $D$ pa ni več dosegljiv.
+ Manjka korak: kazalec v $B$ je treba preusmeriti na $D$, preden sprostimo $C$.
> Pri brisanju najprej prevežemo predhodnika ($B \to D$), šele nato sprostimo vozlišče. Sicer seznam razpade.

? Program pogosto vstavlja nove elemente na začetek in redko bere element po indeksu. Kaj je bolje izbrati?
- Tabelo, ker je dostop po indeksu hiter.
~ Dostop po indeksu je tu redek, vstavljanje na začetek pa bi vsakič premaknilo vse elemente.
+ Povezan seznam, ker je vstavljanje na začetek le preusmeritev $2$ kazalcev.
- Vseeno je, ker sta obe strukturi enako hitri.
~ Nista: tabela je hitrejša pri dostopu po indeksu, seznam pri vstavljanju na začetek.
> Izbira je odvisna od pogostih opravil. Za pogosto vstavljanje na začetek je seznam boljši, za pogost dostop po indeksu tabela.

? Na gradbišče prihajajo tovornjaki, ki jih je treba raztovoriti v vrstnem redu prihoda. Katera struktura to opisuje?
- Sklad
~ Sklad bi najprej raztovoril tovornjak, ki je prišel zadnji; prvi bi čakal najdlje.
+ Vrsta
- Drevo
~ Drevo opisuje hierarhijo (koren, otroci), ne vrstnega reda prihodov.
> Prvi, ki pride, je prvi postrežen: FIFO, torej vrsta.

:::simboli
i | indeks elementa v tabeli | | – | šteje od 0
n | število elementov | | –
:::
