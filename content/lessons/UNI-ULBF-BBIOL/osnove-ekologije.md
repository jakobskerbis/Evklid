---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Odpri satelitski zemljevid klorofila v oceanih. Bistro, turkizno morje okoli tropskih otokov, kamor potujemo na počitnice, je na njem temno modro: skoraj puščava. Kalna, zelenkasta voda Severnega morja in obale Peruja pa žari od življenja. Kako je to mogoče, če je v tropih sonca največ?

Odgovor skriva dve pravili, ki vodita vsak ekosistem: energija teče skozenj le v eno smer, snovi pa morajo krožiti. Kdor ju razume, zna razložiti, zakaj so ribolovna območja tam, kjer so, koliko risov lahko živi v gozdu in zakaj meso obremeni okolje bolj kot žito.

## Razlaga

**Mamljiva ideja.** Sonce daje energijo, rastline jo ujamejo, živali jo pojedo, ko poginejo, jo razkrojevalci vrnejo v tla. Energija bi torej krožila tako kot snov, več sonca pa bi pomenilo več življenja. Ta slika je napačna na dveh mestih. Popravili ju bomo korak za korakom, od najmanjše do največje ravni.

**Ravni kot povečava na zemljevidu.** Ekologija preučuje odnose med organizmi in okoljem. Kot pri digitalnem zemljevidu jih lahko gledamo pri različni povečavi:

| Raven | Kaj zajame | Primer |
|---|---|---|
| populacija | osebki iste vrste na istem območju ob istem času | vsi gamsi v Julijcih |
| združba | vse populacije na istem območju | gamsi, rušje, orli, glive, bakterije |
| ekosistem | združba in nežive razmere (svetloba, voda, tla, temperatura) | visokogorje Julijcev |
| biosfera | vsi ekosistemi na Zemlji | |

**Populacija.** Opišemo jo z **velikostjo** $N$ (število osebkov) in **gostoto** (osebki na enoto površine). Če je hrane in prostora dovolj, populacija raste **eksponentno**: v vsakem enakem časovnem intervalu se poveča za enak delež. Taka rast ne traja dolgo. Ko je osebkov vse več, zmanjka hrane, skrivališč in prostora. Največjo velikost, ki jo okolje trajno vzdrži, imenujemo **nosilna kapaciteta** $K$. Rast, ki se ji približuje, je **logistična**:

$$\frac{\mathrm{d}N}{\mathrm{d}t} = rN\left(1 - \frac{N}{K}\right)$$

Tu je $r$ notranja stopnja rasti. Za $r = 0{,}5$ na leto in $K = 1000$:

| $N$ | $1 - N/K$ | $\mathrm{d}N/\mathrm{d}t$ [osebki/leto] |
|---|---|---|
| $100$ | $0{,}9$ | $45$ |
| $500$ | $0{,}5$ | $125$ |
| $900$ | $0{,}1$ | $45$ |

:::premisli
Kaj napoveš za $N = 1000$ in kaj za $N = 1200$?
---
Pri $N = K$ je oklepaj $0$, rast se ustavi. Pri $N = 1200$ je oklepaj negativen, zato populacija upada nazaj proti $K$. Populacija torej ne raste, dokler ne poje vse hrane, ampak se ustali okoli nosilne kapacitete.
:::

**Združba.** Populacije v združbi so povezane. Vrste **tekmujejo** za isti vir, **plenilec** lovi plen, **zajedavec** živi na račun gostitelja, pri **mutualizmu** imata korist obe vrsti (na primer gliva in korenine v mikorizi). Kdo koga jé, prikaže **prehranjevalni splet**. Vsak organizem v njem zaseda **trofično raven**: proizvajalci (rastline, alge, cianobakterije), primarni potrošniki (rastlinojedi), sekundarni potrošniki (plenilci) in tako naprej. Ostanke vseh ravni razgradijo **razkrojevalci**, predvsem bakterije in glive.

**Ekosistem in prvi popravek: energija teče, ne kroži.** Proizvajalci s fotosintezo vežejo sončno energijo v organske snovi. Del te energije porabijo sami za dihanje. Kar ostane in se vgradi v novo biomaso, je **neto primarna produkcija**. Rastlinojed dobi le del te energije: veliko rastlin ostane nepojedenih, del pojedenega ne prebavi, večino prebavljenega pa porabi za lastno dihanje. Energija, porabljena za dihanje, na koncu preide v toploto in odide iz ekosistema. Nazaj je ni mogoče ujeti.

Zato na naslednjo trofično raven v povprečju preide le približno **10 %** energije. Prikaz kot piramida:

:::risba skica
opis: Energijska piramida s štirimi plastmi. Spodaj proizvajalci 100 000 kJ, nad njimi rastlinojedi 10 000 kJ, nato plenilci 1 000 kJ in na vrhu vrhnji plenilci 100 kJ, njihovo ime je napisano nad vrhom. Vsaka plast je ožja od spodnje; širine niso v merilu.
območje: 0; 0 .. 10; 6,6
enota: 30
pravokotnik: 0,5; 0,3 .. 9,5; 1,5 | zelena
pravokotnik: 1,7; 1,6 .. 8,3; 2,8 | modra
pravokotnik: 2,6; 2,9 .. 7,4; 4,1 | oranžna
pravokotnik: 3,9; 4,2 .. 6,1; 5,4 | rdeča
napis: 5; 0,9 | proizvajalci: 100 000 kJ | sredina
napis: 5; 2,2 | rastlinojedi: 10 000 kJ | sredina
napis: 5; 3,5 | plenilci: 1 000 kJ | sredina
napis: 5; 4,8 | 100 kJ | sredina
napis: 5; 6 | vrhnji plenilci | sredina
:::

Že po treh stopnicah, na četrti ravni, ostane tisočinka. Zato prehranjevalne verige redko imajo več kot štiri ali pet členov.

**Drugi popravek: snov kroži, a lahko ostane zaklenjena.** Atomi ogljika, dušika in fosforja se ne porabijo. Ogljik iz $\mathrm{CO_2}$ rastline vgradijo v sladkorje, dihanje vseh organizmov in razkroj ga vrneta v zrak. Dušik iz zraka ($\mathrm{N_2}$) lahko vežejo le nekatere bakterije, na primer v koreninskih gomoljčkih metuljnic. Druge bakterije ga pretvarjajo v nitrat, ki ga rastline sprejmejo, denitrifikacijske bakterije pa ga vrnejo v zrak. Brez razkrojevalcev bi se hranila kopičila v mrtvih ostankih. Snov je lahko zaklenjena tudi tam, kamor proizvajalci ne sežejo, na primer globoko pod površjem.

:::premisli
Zdaj se vrni k zemljevidu iz uvoda. Zakaj je bistro tropsko morje skoraj puščava, čeprav ima največ sonca?
---
Energije je dovolj, primanjkuje pa hranil, predvsem dušika in fosforja. Odmrli plankton potone v globino, topla površinska plast pa se ne meša s hladno, bogato globinsko vodo. Snov ne kroži nazaj na površje, zato alge ne morejo rasti. Ob Peruju vetrovi dvigajo globinsko vodo s hranili, zato je tam življenja na pretek.
:::

## Rešeni primeri

### Primer 1: gostota z zemljevida

Popisovalci so na nekem območju prešteli $45$ gamsov. Na planinski karti v merilu $1 : 25\,000$ meri to območje približno $8\,\mathrm{cm} \times 6\,\mathrm{cm}$. Kolikšna je gostota populacije?

**Podatki:** merilo $1 : 25\,000$, na karti $8\,\mathrm{cm}$ in $6\,\mathrm{cm}$, $N = 45$
**Iščemo:** gostoto populacije v osebkih na $\mathrm{km^2}$

:::formula
$\text{gostota} = \dfrac{N}{A}$
:::

**Rešitev:**

1. Dolžini v naravi: $8 \cdot 25\,000 = 200\,000\,\mathrm{cm} = 2\,\mathrm{km}$ in $6 \cdot 25\,000 = 150\,000\,\mathrm{cm} = 1{,}5\,\mathrm{km}$.
2. Površina: $A = 2 \cdot 1{,}5 = 3\,\mathrm{km^2}$. Merilo velja za dolžine, zato najprej pretvorimo stranici in šele nato množimo.
3. Gostota: $\dfrac{45}{3} = 15$ gamsov na $\mathrm{km^2}$.
4. Odgovor: gostota je $15$ gamsov na kvadratni kilometer.

### Primer 2: ulov, označitev, ponovni ulov

Vseh osebkov skoraj nikoli ne moremo prešteti. Biologi v narodnem parku na območju $12\,\mathrm{km^2}$ ujamejo in označijo $60$ snežnih voluharic ter jih izpustijo. Teden kasneje ujamejo $45$ voluharic, med njimi je $9$ označenih. Oceni velikost in gostoto populacije.

**Podatki:** označenih $M = 60$, v drugem ulovu $C = 45$, od tega označenih $R = 9$, površina $A = 12\,\mathrm{km^2}$
**Iščemo:** velikost populacije $N$ in gostoto

:::formula
$\dfrac{R}{C} = \dfrac{M}{N} \quad\Rightarrow\quad N = \dfrac{M \cdot C}{R}$
:::

**Rešitev:**

1. Delež označenih v drugem ulovu naj bo enak deležu označenih v vsej populaciji: $\dfrac{9}{45} = \dfrac{60}{N}$.
2. $N = \dfrac{60 \cdot 45}{9} = 300$.
3. Gostota: $\dfrac{300}{12} = 25$ voluharic na $\mathrm{km^2}$.
4. Odgovor: populacija šteje približno $300$ osebkov, gostota je $25$ na $\mathrm{km^2}$. Ocena velja, če se označeni osebki dobro pomešajo z drugimi in oznak ne izgubijo.

### Primer 3: žito ali meso

Njiva na leto da užitno žito z energijo $7{,}3 \cdot 10^7\,\mathrm{kJ}$. Človek potrebuje približno $10\,000\,\mathrm{kJ}$ na dan. Koliko ljudi njiva prehrani celo leto, če jedo žito? Koliko, če žito pokrmijo govedu in ljudje jedo meso? Predpostavi, da na naslednjo trofično raven preide $10\,\%$ energije.

**Podatki:** energija žita $7{,}3 \cdot 10^7\,\mathrm{kJ/leto}$, potreba $10\,000\,\mathrm{kJ/dan}$, prenos $10\,\%$, $1$ leto $= 365$ dni
**Iščemo:** število ljudi v obeh primerih

:::formula
$\text{št. ljudi} = \dfrac{\text{energija, ki pride do človeka}}{\text{letna potreba enega človeka}}$
:::

**Rešitev:**

1. Letna potreba: $10\,000 \cdot 365 = 3\,650\,000\,\mathrm{kJ} = 3{,}65 \cdot 10^6\,\mathrm{kJ}$.
2. Žito: $\dfrac{7{,}3 \cdot 10^7}{3{,}65 \cdot 10^6} = 20$ ljudi. Človek je tu primarni potrošnik.
3. Meso: človek postane sekundarni potrošnik, vmes je ena stopnica več. Izračunaj sam še zadnja dva koraka.

:::premisli
Koliko energije pride do ljudi prek govedi in koliko ljudi to prehrani?
---
$10\,\%$ od $7{,}3 \cdot 10^7\,\mathrm{kJ}$ je $7{,}3 \cdot 10^6\,\mathrm{kJ}$, kar zadošča za $\dfrac{7{,}3 \cdot 10^6}{3{,}65 \cdot 10^6} = 2$ človeka. Z isto njivo prehranimo desetkrat manj ljudi.
:::

## Pogoste napake

**Energija kroži.** Kroži snov, energija pa teče v eno smer in na koncu kot toplota zapusti ekosistem. Ekosistem zato potrebuje stalen dotok energije, praviloma od Sonca.

**»90 % energije izgine.«** Energija ne izgine, saj se ohranja. Večino porabijo organizmi za dihanje in ta preide v toploto, del ostane nepojeden ali neprebavljen in gre k razkrojevalcem. Za naslednjo raven ni več dosegljiva.

**Populacija in združba sta isto.** Populacija je ena vrsta, združba so vse vrste skupaj. Če na območju naštevaš različne vrste, govoriš o združbi; če dodaš še tla, vodo in podnebje, o ekosistemu.

**Napačno obrnjen količnik pri ponovnem ulovu.** Iz $\dfrac{R}{C} = \dfrac{M}{N}$ sledi $N = \dfrac{M \cdot C}{R}$. Kdor računa $\dfrac{R \cdot C}{M}$, dobi premajhno število, pogosto celo manjše od števila že označenih živali, kar ne more biti.

## Povzetek

Ravni: populacija (ena vrsta) → združba (vse vrste) → ekosistem (združba + nežive razmere) → biosfera.

- Populacijo opišeta velikost $N$ in gostota; rast je eksponentna, dokler ni omejitev, nato logistična do nosilne kapacitete $K$: $\mathrm{d}N/\mathrm{d}t = rN(1 - N/K)$.
- Velikost ocenimo z ulovom in ponovnim ulovom: $N = \dfrac{M \cdot C}{R}$.
- V združbi so tekmovanje, plenilstvo, zajedavstvo, mutualizem; prehranjevalni splet in trofične ravni.
- Energija teče v eno smer, na vsaki stopnici preide le okoli $10\,\%$, preostanek konča kot toplota.
- Snovi (C, N, P) krožijo; razkrojevalci jih vračajo proizvajalcem. Pomanjkanje hranil lahko omeji življenje tudi tam, kjer je energije dovolj.

## Za izpit

Znati moraš povedati:
- definicije populacije, združbe, ekosistema in biosfere ter po čem se vsaka raven loči od prejšnje;
- logistično enačbo $\mathrm{d}N/\mathrm{d}t = rN(1 - N/K)$, pomen $r$ in $K$ ter kaj napove za $N < K$, $N = K$ in $N > K$;
- oceno velikosti populacije z ulovom in ponovnim ulovom, $N = \dfrac{M \cdot C}{R}$, in pogoja, pri katerih velja;
- odnose v združbi (tekmovanje, plenilstvo, zajedavstvo, mutualizem) in trofične ravni z razkrojevalci;
- kaj je neto primarna produkcija, zakaj na naslednjo trofično raven preide le okoli $10\,\%$ energije in kam gre preostanek;
- kroženje ogljika in dušika z vlogo bakterij ter zakaj lahko hranila omejijo produkcijo.

### Naloga 1

V jezeru živi populacija ostrižev z nosilno kapaciteto $K = 4000$ in notranjo stopnjo rasti $r = 0{,}6$ na leto. Biologi označijo $120$ ostrižev in jih izpustijo. V drugem ulovu je $150$ ostrižev, med njimi $12$ označenih. (a) Oceni velikost populacije. (b) Kolikšen je pri tej velikosti letni prirast po logistični enačbi? (c) Izpelji, pri kateri velikosti je prirast največji, in ga izračunaj. (d) Ribiči želijo vsako leto odloviti $450$ ostrižev. Pri katerih velikostih populacije je prirast enak ulovu in kaj se zgodi s sedanjo populacijo? (e) Kaj se zgodi pri ulovu $650$ ostrižev na leto?

**Rešitev:**

1. Ocena velikosti: $N = \dfrac{M \cdot C}{R} = \dfrac{120 \cdot 150}{12} = 1500$.
2. Prirast: $1 - \dfrac{1500}{4000} = 0{,}625$, zato $\dfrac{\mathrm{d}N}{\mathrm{d}t} = 0{,}6 \cdot 1500 \cdot 0{,}625 = 562{,}5$ osebka na leto.
3. Prirast kot funkcija velikosti je $f(N) = rN - \dfrac{r}{K}N^2$. Odvod $f'(N) = r - \dfrac{2r}{K}N$ je enak $0$ pri $N = \dfrac{K}{2}$; ker je $f''(N) = -\dfrac{2r}{K} < 0$, je tam maksimum.
4. Največji prirast: $N = \dfrac{4000}{2} = 2000$ in $f(2000) = 0{,}6 \cdot 2000 \cdot 0{,}5 = 600$ osebkov na leto, kar je $\dfrac{rK}{4}$.
5. Ravnovesje z ulovom: $0{,}6 N\left(1 - \dfrac{N}{4000}\right) = 450$. Po množenju s $\dfrac{4000}{0{,}6}$ dobimo $N^2 - 4000N + 3\,000\,000 = 0$.
6. Diskriminanta: $4000^2 - 4 \cdot 3\,000\,000 = 4\,000\,000$, koren je $2000$. Rešitvi sta $N_1 = \dfrac{4000 - 2000}{2} = 1000$ in $N_2 = \dfrac{4000 + 2000}{2} = 3000$.
7. Med $1000$ in $3000$ je prirast večji od ulova, zato populacija raste; pod $1000$ in nad $3000$ je manjši, zato upada. Ravnovesje pri $3000$ je stabilno, pri $1000$ nestabilno.
8. Sedanja populacija ($1500$) ima prirast $562{,}5$, ulov je $450$. Presežek je $562{,}5 - 450 = 112{,}5$ osebka na leto, zato populacija raste in se ustali pri $3000$.
9. Ulov $650$ presega največji prirast $600$. Populacija upada pri vsaki velikosti, in to vse hitreje, dokler ne propade.
10. Odgovor: (a) $N \approx 1500$; (b) $562{,}5$ osebka na leto; (c) največ pri $N = K/2 = 2000$, in sicer $600$ na leto; (d) ravnovesji sta pri $1000$ (nestabilno) in $3000$ (stabilno), sedanja populacija se ustali pri $3000$; (e) populacija propade. Trajni ulov ne sme preseči $\dfrac{rK}{4}$, populacija pa ne sme pasti pod nestabilno ravnovesje.

### Naloga 2

Natančno navedi razliko med pretokom energije in kroženjem snovi v ekosistemu. Utemelji, (a) zakaj imajo prehranjevalne verige redko več kot štiri ali pet členov in (b) zakaj je lahko produkcija majhna tudi tam, kjer je sončne energije na pretek.

**Rešitev:**

1. Energija vstopi v ekosistem kot svetloba, proizvajalci jo s fotosintezo vežejo v organske snovi. Na vsaki trofični ravni jo organizmi večinoma porabijo za dihanje in ta preide v toploto, ki zapusti ekosistem. Pot je enosmerna, zato ekosistem potrebuje stalen dotok energije.
2. Snov se ne porabi. Atome ogljika, dušika in fosforja proizvajalci vgradijo v biomaso, potrošniki jih prevzamejo s hrano, dihanje in razkrojevalci pa jih vrnejo v zrak, vodo in tla, kjer so proizvajalcem spet na voljo.
3. (a) Na naslednjo raven preide okoli $10\,\%$ energije, ker del biomase ostane nepojeden, del pojedenega neprebavljen, večina prebavljenega pa se porabi za dihanje. Do pete ravni so štiri stopnice, zato tja pride $0{,}1^4 = 0{,}0001$ neto primarne produkcije, torej desettisočinka.
4. Od $100\,000\,\mathrm{kJ}$ pri proizvajalcih ostane na peti ravni $100\,000 \cdot 0{,}0001 = 10\,\mathrm{kJ}$. Tako majhen pretok ne vzdržuje populacije, ki bi bila dovolj velika za obstoj, zato šestega člena praviloma ni.
5. (b) Proizvajalci za rast poleg energije potrebujejo hranila, predvsem dušik in fosfor. Če se ta ne vračajo tja, kjer je svetloba, produkcijo omejuje snov, ne energija.
6. Primer je odprto tropsko morje: odmrli plankton potone, topla površinska plast se ne meša z globinsko vodo, hranila ostanejo zaklenjena v globini. Kjer se globinska voda dviga (obala Peruja), je produkcija velika.
7. Sklep: energija omejuje dolžino verig, ker se na vsaki stopnici izgublja kot toplota; hranila omejujejo velikost produkcije, kadar je njihovo kroženje prekinjeno.

### Naloga 3

V populaciji, ki v resnici šteje $300$ voluharic, označiš $M = 60$ osebkov. Do drugega ulova petina označenih izgubi oznako. V drugem ulovu je $C = 50$ voluharic. (a) Koliko označenih pričakuješ v drugem ulovu in kolikšno oceno velikosti dobiš? (b) Utemelji, v katero smer izguba oznak popači oceno in v katero smer bi jo popačilo, če bi se označene živali pasti raje izogibale.

**Rešitev:**

1. Oznako obdrži $60 - \dfrac{60}{5} = 48$ osebkov.
2. Delež označenih v populaciji je $\dfrac{48}{300} = 0{,}16$, zato v drugem ulovu pričakujemo $R = 0{,}16 \cdot 50 = 8$ označenih.
3. Ocena z zapisanim $M = 60$: $N = \dfrac{60 \cdot 50}{8} = 375$.
4. Napaka: $\dfrac{375 - 300}{300} = 0{,}25$, ocena je za $25\,\%$ prevelika.
5. Izguba oznak zmanjša $R$, ta pa je v imenovalcu, zato je ocena prevelika. Brez izgube bi pričakovali $R = \dfrac{60 \cdot 50}{300} = 10$ in dobili $N = \dfrac{60 \cdot 50}{10} = 300$.
6. Če se označene živali pasti izogibajo, je v drugem ulovu spet premalo označenih, $R$ je premajhen in ocena prevelika. Če bi se v past raje vračale, bi bil $R$ prevelik in ocena premajhna.
7. Odgovor: (a) pričakujemo $8$ označenih in oceno $375$ namesto $300$; (b) izguba oznak in izogibanje pastem dasta preveliko oceno. Metoda velja le, če se oznake ohranijo in ima vsak osebek enako verjetnost ulova.

## Drugače: Kot zgodba

Spremljajmo dva popotnika, ki ob istem jutru prispeta v gorski gozd.

Prvi je atom ogljika. V zraku je del molekule $\mathrm{CO_2}$. List bukve ga ujame in vgradi v sladkor. Jeseni srna pojé bukov žir in atom postane del njene mišice. Ris ujame srno in atom ogljika izdiha kot $\mathrm{CO_2}$, ki se vrne v zrak. Če bi atom ostal v risovem truplu, bi ga glive in bakterije sprostile čez nekaj mesecev. Popotovanje se začne znova. Atom ima povratno vozovnico.

Drugi popotnik je obrok energije iz sončnega žarka. List ga ujame v isti sladkor. Srna ga porabi, ko teče čez jaso, in večina ga odide kot toplota iz njenega telesa v hladen zrak. Kar ostane, preide v risa. Tudi ris ga porabi in izseva. Toplote nihče v gozdu ne more več ujeti. Obrok energije ima samo enosmerno vozovnico. Zato mora Sonce gozd oskrbovati vsak dan znova.

## Drugače: Korak za korakom s številkami

Kako preveriš katerokoli nalogo s piramido energije:

1. Ugotovi, na kateri trofični ravni je izhodišče in na kateri cilj. Proizvajalci so raven 1, rastlinojedi 2, plenilci 3.
2. Preštej stopnice med njima: od ravni 1 do ravni 4 so tri.
3. Za vsako stopnico pomnoži z $0{,}1$: $100\,000 \to 10\,000 \to 1000 \to 100\,\mathrm{kJ}$.
4. Če računaš nazaj (koliko potrebuje vrh), za vsako stopnico deli z $0{,}1$, torej pomnoži z $10$.
5. Preveri smiselnost: višja raven ima vedno manj energije kot nižja.

In za ulov in ponovni ulov:

1. Zapiši $M$, $C$, $R$.
2. Postavi sorazmerje deležev $\dfrac{R}{C} = \dfrac{M}{N}$.
3. Izrazi $N = \dfrac{M \cdot C}{R}$.
4. Preveri: $N$ mora biti večji od $M$ in od $C$.

## Preveri se

? Na izletu ob reki Soči vodnik pokaže »vse rastline, živali, glive in mikrobe ob reki, skupaj z vodo, prodom, svetlobo in temperaturo«. Kateri ekološki pojem opisuje?
- populacijo
~ Populacija je ena sama vrsta. Tu je naštetih veliko vrst.
- združbo
~ Združba so le živa bitja. Ker so dodane še nežive razmere, gre za višjo raven.
+ ekosistem
- biosfero
~ Biosfera zajema vse ekosisteme na Zemlji, ne enega odseka reke.
> Ekosistem je združba vseh organizmov skupaj z neživim okoljem, s katerim si izmenjujejo snovi in energijo.

? Razvrsti ravni od najmanjše do največje.
- populacija → ekosistem → združba → biosfera
~ Ekosistem vsebuje združbo, zato je združba manjša raven.
+ osebek → populacija → združba → ekosistem → biosfera
- osebek → združba → populacija → ekosistem → biosfera
~ Združba je sestavljena iz več populacij, zato je populacija manjša raven.
> Vsaka raven vsebuje prejšnjo: osebki tvorijo populacijo, populacije združbo, združba z neživim okoljem ekosistem.

? Kaj se zgodi v gozdu, če iz njega izginejo vsi razkrojevalci?
- Nič posebnega, saj energija prihaja od Sonca.
~ Energija res prihaja od Sonca, a rastline potrebujejo tudi hranila, ki jih vračajo razkrojevalci.
- Energija se začne kopičiti v tleh in kroži nazaj k rastlinam.
~ Energija ne kroži. Kopičila bi se snov v odmrlih ostankih.
+ Hranila ostanejo zaklenjena v odmrlih ostankih, rastlinam jih zmanjka in proizvodnja upade.
> Razkrojevalci zaključijo kroženje snovi: dušik, fosfor in ogljik iz ostankov vrnejo v tla in zrak.

? V jezeru označijo $30$ rib in jih izpustijo. V drugem ulovu je $40$ rib, med njimi $6$ označenih. Kolikšna je ocenjena velikost populacije?
- $8$
~ To je $\dfrac{R \cdot C}{M}$, obrnjen količnik. Rezultat ne more biti manjši od števila označenih rib.
- $1200$
~ To je le $M \cdot C$. Deliti moraš še s številom označenih v drugem ulovu.
+ $200$
- $76$
~ To je le vsota vseh števil, ne sorazmerje.
> $N = \dfrac{M \cdot C}{R} = \dfrac{30 \cdot 40}{6} = 200$.

? Proizvajalci v ekosistemu na leto vežejo $50\,000\,\mathrm{kJ}$ energije. Koliko je pride do terciarnih potrošnikov (4. trofična raven), če na vsako raven preide $10\,\%$?
- $5000\,\mathrm{kJ}$
~ To je le ena stopnica (do rastlinojedov). Do 4. ravni so tri stopnice.
- $500\,\mathrm{kJ}$
~ To so plenilci na 3. ravni. Manjka še ena stopnica.
+ $50\,\mathrm{kJ}$
- $5\,\mathrm{kJ}$
~ Naredil si stopnico preveč: od ravni 1 do ravni 4 so tri stopnice, ne štiri.
> $50\,000 \cdot 0{,}1 \cdot 0{,}1 \cdot 0{,}1 = 50\,\mathrm{kJ}$.

:::simboli
N | velikost populacije (število osebkov) | N = \dfrac{M \cdot C}{R} | – | pri metodi ulova in ponovnega ulova
t | čas | | leto
r | notranja stopnja rasti | | 1/leto
K | nosilna kapaciteta okolja | | – | največja trajno vzdržna velikost populacije
A | površina območja | | km^2
M | število označenih osebkov v prvem ulovu | | –
C | število osebkov v drugem ulovu | | –
R | število označenih osebkov v drugem ulovu | | –
:::
