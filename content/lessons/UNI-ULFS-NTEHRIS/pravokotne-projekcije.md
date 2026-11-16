---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Oblikovalec dodatkov za telefone ti pošlje dve skici majhnega stojala. Ko stojalo gledaš od spredaj, vidiš kvadrat s stranico $40\,\mathrm{mm}$. Ko ga gledaš od zgoraj, vidiš spet kvadrat s stranico $40\,\mathrm{mm}$. Kakšno je stojalo? Preden bereš naprej, poišči vsaj tri različna telesa, ki se ujemajo z obema skicama.

Kocka je prva, ki pride na misel. Ustreza pa tudi klin: trikotna prizma, ki ima spredaj in zgoraj kvadraten obris, ob strani pa pravokoten trikotnik. Ustreza četrtina valja in še marsikaj. Vse te oblike se razlikujejo šele, ko pogledaš od strani.

Uganka pokaže bistvo teme. Ena slika, ki jo »sploščimo« na papir, izgubi eno razsežnost. Tehnična risba mora telo opisati tako, da ga delavec ali CNC-stroj izdela brez ugibanja. Zato rišemo več pogledov po strogih pravilih, za hiter vtis o obliki pa dodamo aksonometrijo.

## Razlaga

**1. Fotografija in pravokotna projekcija.** Telefon v žepu že zna narediti sliko telesa. Pri fotografiji gredo vsi svetlobni žarki skozi eno točko, objektiv. Taki preslikavi rečemo **središčna projekcija**: bližnji rob je na sliki daljši od enako dolgega oddaljenega, vzporedni robovi se stekajo.

Pri **pravokotni projekciji** si zamislimo, da so **projekcijski žarki** vzporedni med seboj in pravokotni na **projekcijsko ravnino** (ravnino risbe). Vsaka točka telesa se preslika naravnost na ravnino. Razlike so zbrane v tabeli:

| Lastnost | Fotografija | Pravokotna projekcija |
|---|---|---|
| žarki | skozi eno točko | vzporedni |
| vzporedni robovi | se stekajo | ostanejo vzporedni |
| mere | odvisne od oddaljenosti | prave za ploskve, vzporedne ravnini |
| globina | se vidi | se izgubi |

Zadnja vrstica je cena za prave mere. Iz enega pogleda ne razbereš globine, kar je natanko težava iz uganke.

**2. Trije glavni pogledi.** Telo postavimo tako, da so njegove glavne ploskve vzporedne s tremi med seboj pravokotnimi ravninami. Nato ga projiciramo na vsako posebej:

- **naris** (pogled od spredaj) pokaže širino in višino; izberemo ga tako, da pove o obliki največ;
- **tloris** (pogled od zgoraj) pokaže širino in globino;
- **stranski ris** (pogled z leve) pokaže globino in višino.

Vsaka mera se torej pojavi v dveh pogledih. Naris in tloris imata skupno širino, naris in stranski ris skupno višino. Robove, ki jih v pogledu zakriva telo, narišemo s črtkano črto, kot določa standard za vrste črt.

:::premisli
Stojalo iz uganke je lahko tudi četrtina valja. Kakšen bo njen stranski ris in katero mero bo imel skupno s tlorisom?
---
Četrtina kroga s polmerom $40\,\mathrm{mm}$; v narisu in tlorisu se ukrivljenost ne vidi. Skupna mera s tlorisom je globina, $40\,\mathrm{mm}$: tloris in stranski ris oba kažeta, kako globoko je telo.
:::

Vseh mogočih smeri pogleda pravokotno na ploskve kvadra je šest: od spredaj, zgoraj, leve, desne, spodaj in zadaj. Na risbo damo le toliko pogledov, kot jih potrebujemo, da je oblika nedvoumna. Za ploščat telefon pogosto zadoščata dva, za stojalo iz uganke potrebujemo tri.

**3. Razporeditev pogledov.** Pogledov ne rišemo kamorkoli. Navpična in vodoravna projekcijska ravnina razdelita prostor na štiri dele, **kvadrante**. Standard pozna dve postavitvi, ki se razlikujeta po tem, v katerem kvadrantu stoji telo:

- **Evropska postavitev** (metoda E, prvi kvadrant). Telo je med opazovalcem in ravnino, slika pade na ravnino *za* telesom, kot senca. Tloris zato leži *pod* narisom, pogled z leve *desno* od narisa.
- **Ameriška postavitev** (metoda A, tretji kvadrant). Ravnina je med opazovalcem in telesom, kot steklo izložbe. Tloris leži *nad* narisom, pogled z leve *levo* od narisa.

Katero postavitev risba uporablja, pove simbol prisekanega stožca v naslovnem polju. V Evropi je običajna metoda E.

Ravnini si zamisli kot dve steni škatle. Po projiciranju ju **razgrnemo** v ravnino risbe: vodoravna se zavrti okoli roba, ki ga ima skupnega z navpično.

:::premisli
V evropski postavitvi je v tlorisu sprednja stran telesa obrnjena *stran* od narisa, torej navzdol. Zakaj?
---
Vodoravna ravnina se pri razgrnitvi zavrti okoli roba, kjer se stika z navpično ravnino, ta pa je *za* telesom. Zadnja stran telesa je ob tem robu, torej ob narisu, sprednja pa najdlje od njega.
:::

Med pogledi pustimo enak razmik. Skupne mere morajo biti poravnane: tloris je navpično pod narisom, stranski ris je v isti višini.

**4. Aksonometrija.** Trije pogledi so natančni, a jih moraš v glavi sestaviti. Aksonometrija naredi nasprotno: telo zavrtimo glede na ravnino, da v *eni* pravokotni projekciji vidimo tri ploskve hkrati. Robove, vzporedne s tremi osmi telesa, nanašamo vzdolž treh **aksonometričnih osi**.

- **Izometrija**: vse tri osi oklepajo $120^\circ$; os višine je navpična, osi širine in globine sta $30^\circ$ nad vodoravnico. Vse tri smeri se skrajšajo enako, s faktorjem $k \approx 0{,}82$. V praksi rišemo **poenostavljeno izometrijo** z $k = 1$: mere nanašamo nespremenjene, slika je zato malo povečana.
- **Dimetrija**: ena os je $7^\circ$ nad vodoravnico z merilom $1$, druga, os globine, $42^\circ$ nad vodoravnico z merilom $\tfrac{1}{2}$. Globino zato nanesemo na polovico.

Prave mere veljajo le vzdolž osi. Poševnega roba ali diagonale na aksonometrični sliki ne meriš z ravnilom.

## Rešeni primeri

### Primer 1: pogledi telefona

Pametni telefon je kvader: širina $71\,\mathrm{mm}$, višina $147\,\mathrm{mm}$, globina $8\,\mathrm{mm}$. Narišemo ga v merilu $1 : 1$, za naris izberemo pogled na zaslon. Kakšne mere imajo naris, tloris in stranski ris?

**Podatki:** širina $a = 71\,\mathrm{mm}$, višina $h = 147\,\mathrm{mm}$, globina $c = 8\,\mathrm{mm}$, merilo $1 : 1$
**Iščemo:** mere pravokotnikov v treh pogledih

:::formula
Naris: $a \times h$; tloris: $a \times c$; stranski ris: $c \times h$
:::

**Rešitev:**

1. Naris kaže zaslon, torej širino in višino: pravokotnik $71\,\mathrm{mm} \times 147\,\mathrm{mm}$.
2. Tloris gleda na zgornji rob telefona, vidimo širino in globino: $71\,\mathrm{mm} \times 8\,\mathrm{mm}$.
3. Stranski ris gleda na levi rob, vidimo globino in višino: $8\,\mathrm{mm} \times 147\,\mathrm{mm}$.
4. Preverimo skupne mere: $71\,\mathrm{mm}$ je v narisu in tlorisu, $147\,\mathrm{mm}$ v narisu in stranskem risu, $8\,\mathrm{mm}$ v tlorisu in stranskem risu.
5. Odgovor: pogledi so pravokotniki $71 \times 147$, $71 \times 8$ in $8 \times 147$ (v mm).

### Primer 2: prostor na listu

Stojalo za telefon je široko $80\,\mathrm{mm}$, visoko $60\,\mathrm{mm}$ in globoko $50\,\mathrm{mm}$. Narišemo naris, tloris in pogled z leve v merilu $1 : 1$ v evropski postavitvi, z razmikom $20\,\mathrm{mm}$ med pogledi. Kje leži kateri pogled in kolikšen pravokotnik na listu zavzame skupina pogledov?

**Podatki:** $a = 80\,\mathrm{mm}$, $h = 60\,\mathrm{mm}$, $c = 50\,\mathrm{mm}$, razmik $d = 20\,\mathrm{mm}$, metoda E
**Iščemo:** postavitev pogledov, skupno širino $B$ in višino $H$

:::formula
$B = a + d + c$, $H = h + d + c$
:::

**Rešitev:**

1. Metoda E: tloris pod narisom, pogled z leve desno od narisa.
2. V vodoravni vrsti sta naris (širok $a$) in stranski ris (širok $c$, ker kaže globino): $B = 80 + 20 + 50 = 150\,\mathrm{mm}$.
3. V navpičnem stolpcu sta naris (visok $h$) in tloris (visok $c$, ker kaže globino): $H = 60 + 20 + 50 = 130\,\mathrm{mm}$.
4. Odgovor: naris je levo zgoraj, tloris pod njim, stranski ris desno od narisa. Skupina zavzame $150\,\mathrm{mm} \times 130\,\mathrm{mm}$ in brez težav pride na list A4.

### Primer 3: škatla slušalk v aksonometriji

Škatla brezžičnih slušalk je široka $60\,\mathrm{mm}$, visoka $30\,\mathrm{mm}$ in globoka $50\,\mathrm{mm}$. Za navodila jo narišemo v poenostavljeni izometriji, za primerjavo še v dimetriji z globino na osi $42^\circ$. (a) Kako dolge so narisane stranice v obeh slikah? (b) Kolikšna sta širina in višina izometrične slike na papirju?

**Podatki:** $a = 60\,\mathrm{mm}$, $h = 30\,\mathrm{mm}$, $c = 50\,\mathrm{mm}$; izometrija $k = 1$, osi $30^\circ$; dimetrija: merilo $1$ na osi $7^\circ$, $\tfrac{1}{2}$ na osi $42^\circ$
**Iščemo:** narisane dolžine robov, širino $B$ in višino $H$ izometrične slike

:::formula
Dimetrija: $c' = \tfrac{1}{2} c$; izometrija: $B = (a + c)\cos 30^\circ$, $H = h + (a + c)\sin 30^\circ$
:::

**Rešitev:**

1. Poenostavljena izometrija: vse mere nanesemo nespremenjene, robovi so $60$, $30$ in $50\,\mathrm{mm}$.
2. Dimetrija: širina na osi $7^\circ$ ostane $60\,\mathrm{mm}$, višina navpično $30\,\mathrm{mm}$, globina na osi $42^\circ$ se razpolovi: $c' = 0{,}5 \cdot 50 = 25\,\mathrm{mm}$.
3. Izometrija, širina slike: širina in globina gresta poševno pod $30^\circ$, vsaka v svojo stran, zato se njuni vodoravni deli seštejejo. $B = 110 \cdot \cos 30^\circ \approx 95{,}3\,\mathrm{mm}$.
4. Višina slike: navpični rob plus dva navpična dela poševnih robov, $H = 30 + 110 \cdot \sin 30^\circ = 30 + 55 = 85\,\mathrm{mm}$.
5. Odgovor: v izometriji so robovi $60$, $30$, $50\,\mathrm{mm}$, v dimetriji $60$, $30$ in $25\,\mathrm{mm}$. Izometrična slika zasede približno $95\,\mathrm{mm} \times 85\,\mathrm{mm}$.

### Primer 4: zdaj ti

Prenosna baterija (powerbank) ima naris v obliki pravokotnika $90\,\mathrm{mm} \times 20\,\mathrm{mm}$ (širina × višina), tloris pa $90\,\mathrm{mm} \times 60\,\mathrm{mm}$ (širina × globina). Kakšen je pogled z leve in kam ga postaviš v evropski postavitvi?

**Podatki:** naris $90 \times 20\,\mathrm{mm}$, tloris $90 \times 60\,\mathrm{mm}$, metoda E
**Iščemo:** mere in lego stranskega risa

:::formula
Stranski ris: globina × višina
:::

**Rešitev:**

1. Višino vzamemo iz narisa: $20\,\mathrm{mm}$.
2. Globino vzamemo iz tlorisa: $60\,\mathrm{mm}$.
3. Sestavi mere in določi lego, nato preveri:

:::premisli
Kakšen je stranski ris in kje leži?
---
Pravokotnik $60\,\mathrm{mm} \times 20\,\mathrm{mm}$ (globina × višina). V metodi E leži desno od narisa, v isti višini kot naris.
:::

## Pogoste napake

- **Tloris nad narisom.** Kdor je videl ameriške risbe, tloris postavi nad naris in pogled z leve levo. Ob metodi E je to napačno, ker v prvem kvadrantu slika pade za telo. Popravek: najprej poglej simbol v naslovnem polju, nato razporedi.
- **Globina obrnjena proti narisu.** V metodi E je sprednja stran telesa v tlorisu spodaj, v pogledu z leve pa desno, torej stran od narisa. Kdor jo obrne proti narisu, nariše zrcalno telo. Popravek: zamisli si, da se ravnini razgrneta okoli roba za telesom.
- **Dva pogleda sta vedno dovolj.** Uganka s kocko in klinom pokaže, da ne. Popravek: preveri, ali bi lahko dve različni telesi dali enaka pogleda; če da, dodaj tretjega.
- **Perspektiva v pogledu.** Kdor riše po fotografiji, nariše oddaljeni rob krajši. V pravokotni projekciji imata enako dolga robova, vzporedna z ravnino, enako dolgo sliko.
- **Merjenje vzdolž poljubne smeri v aksonometriji.** Prave mere (ali v dimetriji polovične) veljajo le vzdolž osi. Diagonala ploskve ali poševni rob na sliki nima prave dolžine. Popravek: točke konstruiraj s premiki vzdolž osi. V dimetriji ne pozabi razpoloviti globine.

## Povzetek

- Pravokotna projekcija: vzporedni žarki, pravokotni na ravnino. Ploskve, vzporedne z ravnino, imajo pravo velikost; globina se izgubi.
- Glavni pogledi: naris (širina, višina), tloris (širina, globina), stranski ris (globina, višina). Vsaka mera je v dveh pogledih.
- Rišemo toliko pogledov, da je oblika nedvoumna; nevidne robove rišemo črtkano.
- Metoda E: tloris pod narisom, pogled z leve desno. Metoda A: tloris nad narisom, pogled z leve levo. Simbol je v naslovnem polju.
- Aksonometrija pokaže tri ploskve na eni sliki. Izometrija: osi $120^\circ$, poenostavljeno $k = 1$. Dimetrija: osi $7^\circ$ in $42^\circ$, globina na polovico.
- Mere nanašamo samo vzdolž osi.

## Za izpit

Znati moraš povedati:

- definicijo pravokotne projekcije in razlike od središčne (žarki, vzporednost robov, mere, globina);
- kaj kažejo naris, tloris in stranski ris, katere mere si delijo in koliko pogledov je potrebnih za nedvoumno obliko;
- razporeditev pogledov v metodi E in metodi A, utemeljeno z lego telesa v kvadrantu in z razgrnitvijo ravnin, ter kako metodo prepoznaš na risbi;
- osi in merila izometrije in dimetrije ter izpeljavo faktorja $k = \sqrt{\tfrac{2}{3}}$;
- zakaj v aksonometriji prave mere veljajo le vzdolž osi.

### Naloga 1

Klinasto stojalo je široko $a = 120\,\mathrm{mm}$, visoko $h = 60\,\mathrm{mm}$ in globoko $c = 80\,\mathrm{mm}$. Zadnja ploskev je navpična, poševna ploskev pada od zgornjega zadnjega roba k spodnjemu sprednjemu robu. (a) Narišemo naris, tloris in pogled z leve v metodi E z razmikom $15\,\mathrm{mm}$. Risalno polje pokončnega lista A4 meri $180\,\mathrm{mm} \times 277\,\mathrm{mm}$. Ali gre skupina pogledov nanj v merilu $1 : 1$? Kaj pa v merilu $1 : 2$? (b) V katerem pogledu ima poševni rob pravo dolžino in kolikšna je? (c) Kako dolg je poševni rob na sliki v poenostavljeni izometriji in kako dolg v dimetriji (globina na osi $42^\circ$), obakrat v merilu $1 : 1$? Os globine se od sprednjega roba proti zadnjemu dviga.

**Rešitev:**

1. (a) Merilo $1 : 1$: v vrsti sta naris in stranski ris, $B = a + d + c = 120 + 15 + 80 = 215\,\mathrm{mm}$. To je več kot $180\,\mathrm{mm}$, skupina ne gre na list.
2. Merilo $1 : 2$: mere telesa na papirju so $60$, $30$ in $40\,\mathrm{mm}$, razmik ostane $15\,\mathrm{mm}$. $B = 60 + 15 + 40 = 115\,\mathrm{mm}$ in $H = 30 + 15 + 40 = 85\,\mathrm{mm}$. Oboje je manj od $180\,\mathrm{mm}$ in $277\,\mathrm{mm}$, skupina gre na list.
3. (b) Poševni rob leži v ravnini globine in višine, ki je vzporedna z ravnino stranskega risa. Pravo dolžino ima zato v stranskem risu, kjer je hipotenuza pravokotnega trikotnika s katetama $c$ in $h$: $\sqrt{80^2 + 60^2} = \sqrt{10000} = 100\,\mathrm{mm}$. V narisu se vidi le njegova višina $60\,\mathrm{mm}$, v tlorisu le globina $80\,\mathrm{mm}$.
4. (c) Na aksonometrični sliki pridemo od spodnjega sprednjega do zgornjega zadnjega oglišča z dvema premikoma vzdolž osi: za narisano globino $c'$ po osi globine in za $h$ navpično navzgor. Os globine oklepa z vodoravnico kot $\varphi$, zato sta premika po sliki vodoravno $c'\cos\varphi$ in navpično $h + c'\sin\varphi$. Dolžina slike roba je $\sqrt{c'^2 + h^2 + 2c'h\sin\varphi}$.
5. Poenostavljena izometrija: $c' = 80\,\mathrm{mm}$, $\varphi = 30^\circ$, $\sin 30^\circ = 0{,}5$. Dolžina je $\sqrt{6400 + 3600 + 4800} = \sqrt{14800} \approx 121{,}7\,\mathrm{mm}$.
6. Dimetrija: $c' = 0{,}5 \cdot 80 = 40\,\mathrm{mm}$, $\varphi = 42^\circ$, $\sin 42^\circ \approx 0{,}6691$. Dolžina je $\sqrt{1600 + 3600 + 4800 \cdot 0{,}6691} \approx \sqrt{8411{,}8} \approx 91{,}7\,\mathrm{mm}$.
7. Odgovor: v merilu $1 : 1$ skupina ne gre na list ($215\,\mathrm{mm} > 180\,\mathrm{mm}$), v merilu $1 : 2$ zavzame $115\,\mathrm{mm} \times 85\,\mathrm{mm}$ in gre. Poševni rob je dolg $100\,\mathrm{mm}$, pravo dolžino kaže stranski ris. Na izometrični sliki meri približno $121{,}7\,\mathrm{mm}$, na dimetrični $91{,}7\,\mathrm{mm}$; nobena ni prava, ker rob ni vzporeden z nobeno osjo.

### Naloga 2

Natančno navedi, kako sta v metodi E in v metodi A glede na naris razporejena tloris in pogled z leve. Razporeditev utemelji z lego telesa glede na projekcijsko ravnino in z razgrnitvijo ravnin. Pojasni še, kako bralec risbe ugotovi, katera metoda je uporabljena, in kaj se zgodi, če to spregleda.

**Rešitev:**

1. Metoda E (prvi kvadrant): tloris leži pod narisom, pogled z leve desno od narisa. Metoda A (tretji kvadrant): tloris leži nad narisom, pogled z leve levo od narisa.
2. Utemeljitev za E: telo je med opazovalcem in ravnino, zato slika pade na ravnino za telesom. Pogled od zgoraj pade na vodoravno ravnino pod telesom, pogled z leve na stransko ravnino desno od telesa. Ko ravnini razgrnemo okoli robov, ki jih imata skupne z ravnino narisa, se vodoravna zavrti navzdol in stranska v desno.
3. Utemeljitev za A: ravnina je med opazovalcem in telesom. Pogled od zgoraj nastane na ravnini nad telesom, pogled z leve na ravnini levo od telesa. Po razgrnitvi zato vsak pogled leži na tisti strani narisa, s katere gledamo.
4. V obeh metodah ostanejo skupne mere poravnane: tloris ima z narisom skupno širino, stranski ris skupno višino.
5. Metodo pove simbol prisekanega stožca v naslovnem polju. Kdor ga spregleda, pogled desno od narisa razume kot pogled z napačne strani in izdela zrcalno telo.

### Naloga 3

Izpelji faktor skrajšanja robov v izometriji in pokaži, da slike treh med seboj pravokotnih robov oklepajo kote $120^\circ$. Nato izračunaj, kako dolg je na sliki rob z dolžino $50\,\mathrm{mm}$ v pravi in v poenostavljeni izometriji ter za koliko odstotkov je poenostavljena slika večja.

**Rešitev:**

1. V izometriji gledamo kocko v smeri prostorske diagonale. Enotski vektor smeri pogleda je $\tfrac{1}{\sqrt{3}}(1, 1, 1)$ in z vsemi tremi robovi oklepa enak kot.
2. Enotski rob $(1, 0, 0)$ ima v smeri pogleda komponento $\tfrac{1}{\sqrt{3}}$. Pravokotna projekcija ohrani le del, pravokoten na smer pogleda, zato je dolžina slike $k = \sqrt{1 - \tfrac{1}{3}} = \sqrt{\tfrac{2}{3}} \approx 0{,}8165$. Enako velja za druga dva robova.
3. Kot med slikama: sliki robov $(1, 0, 0)$ in $(0, 1, 0)$ dobimo tako, da vsakemu odštejemo komponento v smeri pogleda. Njun skalarni produkt je $0 - \tfrac{1}{3} = -\tfrac{1}{3}$, dolžini sta $\sqrt{\tfrac{2}{3}}$. Zato je $\cos\gamma = \dfrac{-\tfrac{1}{3}}{\tfrac{2}{3}} = -\tfrac{1}{2}$ in $\gamma = 120^\circ$. Zaradi simetrije velja to za vse tri pare.
4. Prava izometrija: $0{,}8165 \cdot 50 \approx 40{,}8\,\mathrm{mm}$. Poenostavljena ($k = 1$): $50\,\mathrm{mm}$.
5. Povečava poenostavljene slike: $\tfrac{1}{k} = \sqrt{\tfrac{3}{2}} \approx 1{,}225$, torej je večja za približno $22{,}5\,\%$.
6. Odgovor: $k = \sqrt{\tfrac{2}{3}} \approx 0{,}82$, osi oklepajo $120^\circ$; rob meri na sliki $40{,}8\,\mathrm{mm}$ oziroma $50\,\mathrm{mm}$, poenostavljena izometrija je za okoli $22{,}5\,\%$ večja, oblika pa enaka.

## Drugače: Na sliki

Zamisli si prozorno škatlo, v kateri lebdi telo. Na vsako steno škatle pade pravokotna slika telesa. Nato škatlo razpreš okoli robov zadnje stene z narisom in jo položiš v ravnino. V metodi E dobiš tak križ:

:::risba skica
opis: Razporeditev šestih pogledov v metodi E v obliki križa. V srednji vrsti so od leve proti desni pogled z desne, naris, pogled z leve in pogled od zadaj. Nad narisom je pogled od spodaj, pod narisom je tloris. Pogledi v isti vrsti so enako visoki, pogledi v istem stolpcu enako široki.
območje: -0,3; -0,3 .. 23,8; 14,3
pravokotnik: 0; 5,5 .. 5; 8,5
pravokotnik: 5,5; 5,5 .. 11,5; 8,5 | debelo
pravokotnik: 12; 5,5 .. 17; 8,5
pravokotnik: 17,5; 5,5 .. 23,5; 8,5
pravokotnik: 5,5; 9 .. 11,5; 14
pravokotnik: 5,5; 0 .. 11,5; 5
napis: 2,5; 7 | z desne | sredina
napis: 8,5; 7 | NARIS | sredina | debelo
napis: 14,5; 7 | z leve | sredina
napis: 20,5; 7 | zadaj | sredina
napis: 8,5; 11,5 | od spodaj | sredina
napis: 8,5; 2,5 | TLORIS | sredina
:::

Opazi tri stvari. Pogled leži na *nasprotni* strani od smeri, iz katere gledamo: pogled od zgoraj je spodaj. Pogledi v isti vrsti imajo isto višino, v istem stolpcu isto širino. Pogled od zadaj je lahko tudi skrajno levo. V metodi A stene razgrneš proti sebi, zato križ zrcališ: pogled od zgoraj je zgoraj, pogled z leve levo.

## Drugače: Uporaba v stroki

Konstruktor danes najprej izdela 3D model, poglede pa iz njega izpelje program za modeliranje. Program postavi tloris in stranski ris po metodi, ki je nastavljena v predlogi risbe. Odločitve ostanejo konstruktorjeve: kateri pogled je naris, koliko pogledov je res potrebnih in ali je simbol v naslovnem polju pravi.

Podjetje, ki dele naroča v Evropi in v ZDA, dobiva risbe v obeh postavitvah. Orodjar, ki ameriško risbo ohišja prebere po metodi E, izdela zrcalno orodje za brizganje; napaka se pokaže šele pri prvem vzorčnem kosu. Zato vhodna kontrola risb najprej preveri simbol postavitve.

Aksonometrijo strojnik uporablja tam, kjer bralec ni risar: v montažnih navodilih, katalogih nadomestnih delov z razstavljenimi sklopi in v ponudbah. V delavnico gre vedno risba s pogledi, ker operater in merilec iz nje bereta prave mere.

## Drugače: Bolj natančno

Zakaj je v izometriji $k \approx 0{,}82$? Kocko gledamo v smeri njene prostorske diagonale, ki z vsemi tremi robovi oklepa enak kot. Enotski smerni vektor diagonale je $\tfrac{1}{\sqrt{3}}(1, 1, 1)$. Rob $(1, 0, 0)$ ima v smeri pogleda komponento $\tfrac{1}{\sqrt{3}}$, zato je dolžina njegove projekcije

$$k = \sqrt{1 - \tfrac{1}{3}} = \sqrt{\tfrac{2}{3}} \approx 0{,}82$$

Enako velja za vse tri robove. Poenostavljena izometrija z $k = 1$ je zato povečana za faktor $\tfrac{1}{k} \approx 1{,}22$. Oblika je enaka, le mere slike niso prave.

## Preveri se

? Katera trditev o glavnih pogledih je pravilna?
- Tloris pokaže širino in višino telesa.
~ Širino in višino pokaže naris. Tloris gleda od zgoraj, zato vidi širino in globino.
+ Naris in tloris imata skupno širino.
- Stranski ris in naris imata skupno globino.
~ Naris globine sploh ne pokaže. Naris in stranski ris imata skupno višino.
> Naris kaže širino in višino, tloris širino in globino, zato je širina skupna obema. Zato je tloris navpično poravnan z narisom.

? Kocka z robom $40\,\mathrm{mm}$ je narisana v dimetriji. Kako dolg je narisani rob na osi $42^\circ$?
- $40\,\mathrm{mm}$
~ To velja za os $7^\circ$ ali za izometrijo. V dimetriji na osi $42^\circ$ globino razpolovimo.
- $42\,\mathrm{mm}$
~ $42$ je kot osi v stopinjah, ne merilo. Merilo na tej osi je $\tfrac{1}{2}$.
+ $20\,\mathrm{mm}$
- $80\,\mathrm{mm}$
~ Merilo $1 : 2$ pomeni deljenje z $2$, ne množenje.
> Merilo na osi $42^\circ$ je $\tfrac{1}{2}$: $0{,}5 \cdot 40\,\mathrm{mm} = 20\,\mathrm{mm}$.

? Študent riše ohišje polnilnika v metodi E. (1) Za naris izbere pogled, ki pokaže vtičnico. (2) Tloris postavi pod naris, poravnan po širini. (3) Pogled z leve postavi levo od narisa, v isti višini. (4) Nevidni rob notranje odprtine nariše črtkano. Kateri korak je napačen?
- Korak 1
~ Naris naj pokaže čim več o obliki, vtičnica je dobra izbira.
- Korak 2
~ V metodi E tloris res leži pod narisom in ima z njim skupno širino.
+ Korak 3
- Korak 4
~ Nevidne robove po standardu res rišemo s črtkano črto.
> V metodi E pogled z leve leži desno od narisa, ker slika pade na ravnino za telesom. Levo bi stal v metodi A.

? Kaj ima pravokotna projekcija, česar fotografija s telefonom nima?
- Pokaže globino telesa na eni sliki.
~ Ravno nasprotno: ena pravokotna projekcija globino izgubi, zato rišemo več pogledov.
+ Enako dolga robova, vzporedna z ravnino, imata enako dolgo sliko, ne glede na oddaljenost.
- Žarki se stekajo v eno točko, zato je slika bolj naravna.
~ To opisuje fotografijo (središčno projekcijo), ne pravokotne.
> V pravokotni projekciji so žarki vzporedni, zato oddaljenost ne vpliva na velikost slike. Iz pogleda lahko odčitamo prave mere.

? Dobavitelj ohišij iz ZDA pošlje risbo, na kateri je pogled od zgoraj *nad* narisom. Kaj narediš?
- Risbo zavrnem, ker je tloris na napačnem mestu.
~ Mesto ni napačno, le druga postavitev. Risba je lahko povsem pravilna.
- Pogled nad narisom razumem kot pogled od spodaj, kot v metodi E.
~ To velja le, če risba uporablja metodo E. Zaradi takega ugibanja nastanejo zrcalni izdelki.
+ V naslovnem polju preverim simbol; verjetno je to metoda A, kjer tloris leži nad narisom.
> Ameriška metoda A postavi tloris nad naris. Katero metodo risba uporablja, pove simbol prisekanega stožca v naslovnem polju.

:::simboli
a | širina telesa | | mm
h | višina telesa | | mm
c | globina telesa | | mm
c' | narisana globina v dimetriji | c' = \tfrac{1}{2} c | mm
d | razmik med pogledi | | mm
B | širina skupine pogledov ali slike | | mm
H | višina skupine pogledov ali slike | | mm
k | faktor skrajšanja v izometriji | k = \sqrt{\tfrac{2}{3}} | – | poenostavljeno $k = 1$
:::
