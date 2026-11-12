---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Telefon vsako fotografijo in sporočilo zapiše z le dvema znakoma, $0$ in $1$; vsak tak znak je en **bit**. Dva bita dasta $4$ kombinacije (00, 01, 10, 11), osem bitov že $256$.

DNA ima štiri znake: nukleotide z bazami A, T, G in C. Beljakovine so zgrajene iz $20$ različnih aminokislin. **Koliko nukleotidov mora imeti »beseda« v DNA, da dobi vsaka aminokislina svojo besedo?** Poskusi odgovoriti, preden bereš naprej.

Uganka ni samo igra: raziskovalci že shranjujejo podatke v sintetično DNA, po dva bita v nukleotid. Ob njej spoznaš, kako celica svoj zapis kopira, prebere in uravnava, zakaj ena zamenjana črka povzroči srpastocelično anemijo in zakaj bakterija zna izdelati človeški inzulin.

## Razlaga

**1. Kod je trojiški.** Beseda iz enega nukleotida da $4$ možnosti, premalo za $20$ aminokislin. Beseda iz dveh nukleotidov da $4 \cdot 4 = 16$, še vedno premalo. Beseda iz treh da

$$N = 4^3 = 64$$

kar je dovolj. Splošno: z besedami dolžine $n$ iz štirih znakov dobimo $N = 4^n$ različnih besed. Trojici nukleotidov na mRNA (prepisu gena, glej točko 3), ki določa eno aminokislino, rečemo **kodon**.

**Preveri:** Koliko besed bi dala dvojiška abeceda telefona pri treh bitih? *($2^3 = 8$.)*

**2. Podvojevanje na podvojevalnih vilicah.** Pred delitvijo celica kopira vso DNA. Podvojevanje je **semikonzervativno**: vsaka nova molekula ima eno staro in eno novo verigo.

Na mestu začetka podvojevanja se verigi razpreta in nastaneta **podvojevalni vilici**, ki se premikata vsaka v svojo smer. Na vilicah sodelujejo:

- **helikaza** razpira verigi (prekinja vodikove vezi med bazami);
- beljakovine SSB preprečijo, da bi se verigi spet sparili;
- **primaza** naredi kratek RNA-začetnik, saj DNA-polimeraza ne zna začeti iz nič;
- **DNA-polimeraza** dodaja nukleotide po pravilu A–T, G–C, a *samo na 3′-konec* rastoče verige. Nova veriga zato vedno raste v smeri $5' \to 3'$;
- **ligaza** poveže koščke v celo verigo.

Verigi DNA sta protivzporedni. Ob eni matrici nova veriga raste proti vilicam, neprekinjeno: to je **vodilna veriga**. Ob drugi polimeraza dela stran od vilic in začne znova, ko se vilice odprejo za nov kos. Ta **zaostajajoča veriga** nastaja v kosih, **Okazakijevih fragmentih**. Začetnike nato zamenja DNA, ligaza kose poveže.

Bakterija ima krožno DNA z enim mestom začetka podvojevanja, evkariontski kromosom jih ima na stotine ali tisoče.

:::premisli
Predstavljaj si DNA-polimerazo, ki bi znala dodajati nukleotide na oba konca verige. Bi še nastajali Okazakijevi fragmenti? Pojasni.
---
Ne, obe verigi bi rasli neprekinjeno proti vilicam. Fragmenti nastajajo, ker sta matrični verigi protivzporedni, polimeraza pa dodaja nukleotide le na 3′-konec. Ob eni matrici smer $5' \to 3'$ kaže proti vilicam, ob drugi stran od njih. Tam lahko polimeraza gradi le v kratkih kosih, vsakič ko se vilice odprejo naprej.
:::

**3. Prepis in tipi RNA.** Pri **prepisovanju (transkripciji)** RNA-polimeraza prebere matrično verigo gena in sestavi komplementarno RNA. RNA je enoverižna, ima ribozo in uracil (U) namesto timina.

| Tip RNA | Naloga | Kje deluje |
|---|---|---|
| mRNA (informacijska) | nosi zapis gena do ribosoma | ribosom v citoplazmi |
| tRNA (prenašalna) | prinese aminokislino; z antikodonom se pari s kodonom | ribosom |
| rRNA (ribosomska) | gradi ribosom in poveže aminokisline | ribosom |
| snRNA, miRNA (male RNA) | izrezovanje intronov; utišanje mRNA | jedro; citoplazma |

**Preveri:** Katera RNA ima antikodon? *(tRNA.)*

**4. Univerzalni genetski kod.** Ribosom bere mRNA od začetnega kodona **AUG** (aminokislina metionin) naprej po tri nukleotide, brez presledkov in prekrivanja. Od $64$ kodonov jih $61$ določa aminokisline, trije (UAA, UAG, UGA) so **stop kodoni**, ki prevajanje končajo. Kod je:

- **izrojen**: večina aminokislin ima več kodonov, ki se pogosto razlikujejo le v tretjem nukleotidu (CCU, CCC, CCA in CCG so vsi prolin);
- **nedvoumen**: en kodon pomeni vedno isto aminokislino;
- **univerzalen**: bakterije, rastline in ljudje berejo kodone enako (redke izjeme so v mitohondrijih).

Zaradi univerzalnosti lahko gen za človeški inzulin vstavimo v bakterijo in ta izdela pravi človeški inzulin.

**Preveri:** Koliko kodonov določa aminokisline? *($64 - 3 = 61$.)*

**5. Mutacije in beljakovine.** **Mutacija** je trajna sprememba zaporedja DNA. Kaj naredi z beljakovino, je odvisno od vrste:

- **zamenjava enega nukleotida**:
  - *tiha mutacija*: novi kodon pomeni isto aminokislino (zaradi izrojenosti koda), beljakovina ostane enaka;
  - *mutacija s spremenjenim pomenom*: nastane druga aminokislina. Pri srpastocelični anemiji kodon GAG v genu za β-globin postane GUG (valin namesto glutaminske kisline), hemoglobin se zlepi v vlakna in eritrocit postane srpast;
  - *nesmiselna mutacija*: nastane stop kodon, beljakovina je prekratka in navadno ne deluje;
- **vrinjenje ali izpad nukleotidov** (če njihovo število ni večkratnik treh) povzroči **premik bralnega okvirja**: vsi kodoni za mestom mutacije se preberejo drugače.

V simulaciji spodaj (»Genetski kod in mutacije«) vpiši matrico TACGGAAATCCGATT in pritisni »Zamenjaj eno bazo«, nato »Vrini bazo«. Opazi, da zamenjava spremeni največ eno aminokislino ali prinese stop, vrinjenje pa vse za seboj.

:::premisli
Kaj se zgodi z beljakovino, če se v gen vrinejo trije zaporedni nukleotidi namesto enega? Napovej.
---
Bralni okvir se ne premakne. Beljakovina dobi eno aminokislino več (ob mestu vrinjenja se lahko spremeni še ena), naprej je zaporedje enako. Posledica je navadno blažja, razen če nastane stop kodon.
:::

**6. Operon pri prokariontih.** Bakterija ne izdeluje vseh beljakovin ves čas. Pri *E. coli* so trije geni za izrabo laktoze v **operonu lac**: so drug za drugim in imajo skupen **promotor** (mesto, kjer se veže RNA-polimeraza) in **operator** (stikalo tik za promotorjem).

- Ko laktoze ni, se na operator veže **represor** (beljakovina, ki jo zapisuje ločen regulatorni gen). RNA-polimeraza ne more mimo, geni so izklopljeni.
- Ko laktoza pride v celico, se del nje pretvori v alolaktozo, ta pa se veže na represor. Represor spremeni obliko in odpade z operatorja. RNA-polimeraza prepiše vse tri gene v eno mRNA.

Tak operon je **inducibilen**: vklopi ga snov, ki jo celica razgrajuje. Operon trp (geni za izdelavo aminokisline triptofana) je **represibilen**: ko je triptofana dovolj, pomaga represorju sesti na operator.

**Preveri:** Se geni lac prepisujejo, ko laktoze ni? *(Ne, represor sedi na operatorju.)*

**7. Uravnavanje genov pri evkariontih.** Vse tvoje celice imajo isto DNA; nevron in jetrna celica izražata različne gene. Evkarionti to uravnavajo na več ravneh:

- **kromatin**: DNA je navita na histone. Tesno zvita DNA se ne prepisuje, razrahljana se;
- **prepisovanje**: **transkripcijski dejavniki** se vežejo na promotor in na **ojačevalce** (oddaljena mesta DNA) ter prepisovanje pospešijo ali zavrejo; operonov evkarionti skoraj nimajo, vsak gen ima svoj promotor;
- **dozorevanje mRNA** v jedru: kapa, poli-A rep in izrezovanje **intronov** (odsekov gena, ki ne zapisujejo beljakovine). Z **alternativnim izrezovanjem** iz enega gena nastane več beljakovin;
- **po prepisu**: miRNA utišajo ali razgradijo mRNA.

**Preveri:** Imata kožna in mišična celica različne gene? *(Ne, le izražata jih različno.)*

## Rešeni primeri

### Primer 1 (lažji): od DNA do beljakovine

Matrična veriga kratkega gena je 3′-TAC GGA AAT CCG ATT-5′. Zapiši mRNA in zaporedje aminokislin.

**Podatki:** matrična veriga DNA 3′-TAC GGA AAT CCG ATT-5′; del tabele kodov: AUG – Met (začetek), CCU – Pro, UUA – Leu, GGC – Gly, UAA – stop
**Iščemo:** mRNA in beljakovino

:::formula
Pravilo komplementarnosti pri prepisu: A → U, T → A, G → C, C → G. Prevod: od AUG naprej po tri nukleotide do stop kodona.
:::

**Rešitev:**

1. Prepis, ker je mRNA komplementarna matrici: 5′-AUG CCU UUA GGC UAA-3′.
2. Prevod, kodon za kodonom: AUG – Met, CCU – Pro, UUA – Leu, GGC – Gly, UAA – stop.
3. Stop kodon ne določa aminokisline.

Odgovor: mRNA je AUG CCU UUA GGC UAA, beljakovina Met–Pro–Leu–Gly ima $4$ aminokisline.

### Primer 2: tri mutacije istega gena

V genu iz primera 1 se zgodi ena od treh mutacij matrice: (a) tretji kodon AAT postane AAC; (b) tretji kodon AAT postane ACT; (c) izpade prvi G v drugem kodonu. Kako se spremeni beljakovina?

**Podatki:** prvotna matrica 3′-TAC GGA AAT CCG ATT-5′; mutacije (a), (b), (c) kot v besedilu; del tabele kodov: UUG – Leu, CUU – Leu, UGA – stop, UAG – stop in kodoni iz primera 1
**Iščemo:** beljakovino pri vsaki mutaciji in vrsto mutacije

:::formula
Zamenjava: nov kodon poišči v tabeli. Izpad ali vrinjenje enega nukleotida: od mesta mutacije naprej preberi kodone na novo.
:::

**Rešitev:**

1. (a) AAC na matrici da na mRNA UUG, to je spet Leu. Beljakovina Met–Pro–Leu–Gly je enaka: **tiha mutacija**.
2. (b) ACT na matrici da UGA, to je stop. Beljakovina je le Met–Pro, dve aminokislini namesto štirih: **nesmiselna mutacija**.
3. (c) Nova matrica je TAC GAA ATC CGA TT, mRNA AUG CUU UAG GCU AA. Beremo: AUG – Met, CUU – Leu, UAG – stop. Beljakovina je Met–Leu: **premik bralnega okvirja**.

Odgovor: (a) beljakovina se ne spremeni, (b) skrajša se na Met–Pro, (c) postane Met–Leu, ker se bralni okvir premakne.

### Primer 3 (težji): fotografija v DNA

Fotografijo s telefona velikosti $2\,\mathrm{MB}$ ($1\,\mathrm{MB} = 10^6$ bajtov, $1$ bajt $= 8$ bitov) zapišemo v krožno molekulo DNA, po $2$ bita na nukleotid, in jo vnesemo v bakterijo. Ta jo podvoji z dvema vilicama, vsaka napreduje $1000$ nukleotidov na sekundo. Koliko nukleotidov potrebujemo in koliko časa traja podvojevanje te molekule?

**Podatki:** velikost $B = 2 \cdot 10^6$ bajtov, $8$ bitov na bajt, $2$ bita na nukleotid, $2$ vilici, hitrost vilic $v = 1000$ nukleotidov/s
**Iščemo:** dolžino zapisa $L$ in čas podvojevanja $t$

:::formula
$L = \dfrac{8 \cdot B}{2}$, $t = \dfrac{L}{2v}$ (dve vilici si delo razdelita)
:::

**Rešitev:**

1. Število bitov: $2 \cdot 10^6 \cdot 8 = 1{,}6 \cdot 10^7$ bitov.
2. Število nukleotidov, ker vsak nosi $2$ bita: $L = \dfrac{1{,}6 \cdot 10^7}{2} = 8 \cdot 10^6$ nukleotidov.
3. Vsaka vilica podvoji polovico molekule, zato delimo z $2v$.
4. Zdaj ti: izračunaj $t$ v sekundah in ga pretvori v minute.

:::premisli
Koliko je $t$?
---
$t = \dfrac{8 \cdot 10^6}{2000} = 4000\,\mathrm{s}$, to je $\dfrac{4000}{60} \approx 67\,\mathrm{min}$. Z eno samo vilico bi trajalo dvakrat dlje, $8000\,\mathrm{s}$.
:::

## Pogoste napake

- **»DNA-polimeraza lahko gradi v obe smeri.«** Gradi samo v smeri $5' \to 3'$, ker dodaja nukleotide le na 3′-konec. Zato zaostajajoča veriga nastaja v Okazakijevih fragmentih, čeprav tudi ta raste $5' \to 3'$.
- **»Vsaka mutacija spremeni beljakovino.«** Zaradi izrojenosti koda je zamenjava, zlasti v tretjem mestu kodona, lahko tiha. Če pa nastane stop kodon, se beljakovina skrajša.
- **»Vrinjenje nukleotida spremeni le eno aminokislino.«** Vrinjenje ali izpad enega nukleotida premakne bralni okvir, zato se spremenijo vsi kodoni za mestom mutacije.
- **»Laktoza se veže na operator in vklopi gene.«** Na operator se veže represor. Alolaktoza se veže na represor, ta odpade in RNA-polimeraza prepisuje.

## Povzetek

- Kodon so trije nukleotidi mRNA; $4^3 = 64$ kodonov: $61$ za aminokisline, $3$ stop (UAA, UAG, UGA); AUG je začetni (Met).
- Genetski kod je izrojen, nedvoumen in univerzalen; zato bakterija izdela človeški inzulin.
- Podvojevanje je semikonzervativno: helikaza, primaza, DNA-polimeraza (samo $5' \to 3'$), ligaza. Vodilna veriga neprekinjeno, zaostajajoča v Okazakijevih fragmentih.
- RNA: mRNA (zapis), tRNA (antikodon, aminokislina), rRNA (ribosom), male RNA.
- Mutacije: tiha, s spremenjenim pomenom (srpastocelična anemija), nesmiselna (stop), premik bralnega okvirja (vrinjenje ali izpad, ki ni večkratnik $3$).
- Operon lac: promotor, operator, represor; laktoza inaktivira represor in geni se prepišejo (inducibilen). Operon trp je represibilen.
- Evkarionti uravnavajo izražanje s kromatinom, transkripcijskimi dejavniki in ojačevalci, alternativnim izrezovanjem intronov in miRNA.

## Drugače: Na sliki

:::risba skica
opis: Podvojevalne vilice. Desno je zaprta DNA, ki jo helikaza razpira; vilice se premikajo v desno. Zgornja nova veriga, vodilna, raste neprekinjeno proti vilicam. Spodnja, zaostajajoča, je iz treh kratkih Okazakijevih fragmentov, ki kažejo stran od vilic.
območje: 0; 0 .. 10; 6
enota: 30
črta: 6,5; 3,3 -> 10; 3,3 | siva | debelo
črta: 6,5; 2,7 -> 10; 2,7 | siva | debelo
črta: 6,5; 3,3 -> 0,5; 5,3 | siva | debelo
črta: 6,5; 2,7 -> 0,5; 0,7 | siva | debelo
puščica: 0,5; 4,9 -> 5,6; 3,2 | vodilna | nad | modra
puščica: 5,6; 2,8 -> 4,1; 2,3 | | | oranžna
puščica: 3,8; 2,2 -> 2,3; 1,7 | | | oranžna
puščica: 2; 1,6 -> 0,6; 1,13 | | | oranžna
napis: 3; 0,4 | zaostajajoča (fragmenti) | sredina
napis: 6,7; 3,9 | helikaza | desno
puščica: 7,5; 1,6 -> 9,5; 1,6 | smer vilic | pod
:::

Desno je starševska DNA, ki jo helikaza razpira. Levo je vsaka stara veriga že matrica za novo.

- Zgornja nova veriga (dolga puščica) raste proti vilicam. Ko se vilice premaknejo, polimeraza samo nadaljuje.
- Spodnja nova veriga je iz kosov (kratke puščice), ki rastejo stran od vilic. Ko se vilice odprejo naprej, se začne nov kos.

Vse puščice kažejo smer $5' \to 3'$. Verigi se razlikujeta le v tem, ali ta smer kaže proti vilicam ali stran od njih.

## Drugače: Bolj natančno

**Hitrost podvojevanja.** Kromosom *E. coli* ima okoli $4{,}6 \cdot 10^6$ baznih parov. Z dvema vilicama po $1000$ nukleotidov/s traja podvojevanje

$$t = \frac{4{,}6 \cdot 10^6}{2 \cdot 1000} = 2300\,\mathrm{s}$$

kar je približno $38\,\mathrm{min}$. Evkariontske polimeraze so počasnejše (okoli $50$ nukleotidov/s), človeški genom je približno $700$-krat večji, zato potrebuje tisoče mest začetka.

**Konci kromosomov.** Na koncu zaostajajoče verige zadnjega začetnika ni mogoče nadomestiti, zato se kromosom ob vsaki delitvi skrajša. Konce varujejo **telomere** brez genov.

**Operon lac in glukoza.** Geni lac se močno prepisujejo le, ko je laktoza prisotna (represor odpade) *in* je glukoze malo: takrat kompleks CAP–cAMP pomaga RNA-polimerazi, da se prime promotorja.

## Preveri se

? Katera trditev o genetskem kodu je pravilna?
- Vsaka aminokislina ima natanko en kodon.
~ Kod je izrojen: večina aminokislin ima več kodonov, npr. prolin štiri.
+ Isti kodon pomeni isto aminokislino pri bakteriji in pri človeku.
- Kodon UAA določa aminokislino, ki zaključi beljakovino.
~ UAA je stop kodon: ne določa nobene aminokisline, samo konča prevajanje.
> Kod je univerzalen (z redkimi izjemami v mitohondrijih).

? Beljakovina ima $250$ aminokislin. Koliko nukleotidov ima najmanj odsek mRNA od začetnega do vključno stop kodona?
- $250$
~ En nukleotid ne more določiti aminokisline; vsako določa kodon iz treh nukleotidov.
- $750$
~ To je dovolj za $250$ aminokislin, a manjka še stop kodon na koncu.
+ $753$
> $250 \cdot 3 + 3 = 753$: trije nukleotidi za vsako aminokislino (tudi za začetni Met) in še trije za stop kodon.

? Učenec reši nalogo »Kaj se zgodi z operonom lac, ko bakterija dobi laktozo?« takole: (1) laktoza se veže na operator; (2) operator se sprosti; (3) RNA-polimeraza prepiše gene lac. Kje je napaka?
+ V koraku 1: laktoza se veže na represor, ne na operator.
- V koraku 3: RNA-polimeraza prepiše vsak gen posebej.
~ Geni operona imajo skupen promotor in se prepišejo v eno mRNA, zato je korak 3 pravilen.
- Napake ni.
~ Operator je mesto na DNA, na katero se veže represor. Laktoza na operator ne sede.
> Alolaktoza se veže na represor, ta odpade z operatorja in RNA-polimeraza prepiše vse tri gene.

? Kako se razlikujeta vodilna in zaostajajoča veriga pri podvojevanju?
- Vodilna raste v smeri $5' \to 3'$, zaostajajoča v smeri $3' \to 5'$.
~ DNA-polimeraza vedno gradi $5' \to 3'$. Razlikuje se le, ali ta smer kaže proti vilicam ali stran od njih.
+ Obe rasteta $5' \to 3'$; vodilna neprekinjeno proti vilicam, zaostajajoča v fragmentih stran od vilic.
- Vodilno gradi DNA-polimeraza, zaostajajočo pa ligaza.
~ Obe gradi DNA-polimeraza; ligaza le poveže Okazakijeve fragmente.
> Ker sta matrici protivzporedni, ena nova veriga raste proti vilicam (vodilna), druga v kosih stran od njih (zaostajajoča).

? Genetski test, naročen prek aplikacije, pokaže zamenjavo kodona GAA v GAG. Oba določata glutaminsko kislino. Kaj to pomeni za beljakovino?
- Beljakovina je prekratka.
~ Prekratka bi bila le, če bi nastal stop kodon (nesmiselna mutacija).
- Spremenijo se vse aminokisline za tem mestom.
~ To se zgodi pri premiku bralnega okvirja zaradi vrinjenja ali izpada. Tu je ena baza zamenjana.
+ Beljakovina ostane enaka, ker je mutacija tiha.
> Kod je izrojen: GAA in GAG pomenita isto aminokislino, zato je zaporedje beljakovine nespremenjeno.

<<RACUN
vrednost: 4^1 | 4
vrednost: 4*4 | 16
vrednost: 4^3 | 64
vrednost: 2^3 | 8
vrednost: 64-3 | 61
vrednost: 2*10^6*8 | 1.6*10^7
vrednost: 1.6*10^7/2 | 8*10^6
vrednost: 8*10^6/2000 | 4000
vrednost: 4000/60 | 200/3
vrednost: 8*10^6/1000 | 8000
vrednost: 4.6*10^6/(2*1000) | 2300
vrednost: 2300/60 | 115/3
vrednost: 250*3+3 | 753
>>

:::simboli
N | število različnih besed (kodonov) | N = 4^n | –
n | dolžina besede v nukleotidih | | –
L | dolžina zapisa v nukleotidih | L = \dfrac{8 \cdot B}{2} | – | $2$ bita na nukleotid
B | velikost datoteke v bajtih | | bajt | $1$ bajt $= 8$ bitov
t | čas podvojevanja | t = \dfrac{L}{2v} | s
v | hitrost ene podvojevalne vilice | | nukleotidov/s
:::
