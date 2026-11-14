---
stanje: osnutek
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

```
vrhnji plenilci          100 kJ
plenilci               1 000 kJ
rastlinojedi          10 000 kJ
proizvajalci         100 000 kJ
```

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

Vseh osebkov skoraj nikoli ne moremo prešteti. Biologi v narodnem parku na območju $12\,\mathrm{km^2}$ ujamejo in označijo $60$ planinskih voluharic ter jih izpustijo. Teden kasneje ujamejo $45$ voluharic, med njimi je $9$ označenih. Oceni velikost in gostoto populacije.

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
