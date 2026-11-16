---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V 17. stoletju je flamski zdravnik in naravoslovec Jan Baptist van Helmont želel ugotoviti, iz česa drevo zraste. Takrat so mnogi menili, da rastlina »poje« prst. Van Helmont je zato v velik lonec nasul približno $91\,\mathrm{kg}$ suhe prsti in vanjo posadil mlado vrbo, ki je tehtala približno $2\,\mathrm{kg}$. Pet let jo je samo zalival.

Po petih letih je vrba tehtala približno $77\,\mathrm{kg}$. Prst je ponovno posušil in stehtal: izgubila je le okoli $57\,\mathrm{g}$. Od kod je torej prišlo več kot $70\,\mathrm{kg}$ lesa, listov in korenin? Van Helmont je sklepal, da iz vode. Imel je le delno prav: spregledal je snov, ki je ni nihče tehtal.

Podobno uganko imaš po vsaki dolgi tekmi. Kolesar po gorski etapi tehta kilogram ali dva manj. Del mase je izpotil kot vodo, del pa je izdihal kot plin. Snov, ki je zapustila kolesarja, ne izgine. Čez nekaj časa jo bo morda vgradila prav takšna vrba.

## Razlaga

Začnimo s sliko. Puščice na njej kažejo, kam potuje **ogljik**, snov, ki je v telesu vseh živih bitij.

:::risba skica
opis: Kroženje ogljika. Zgoraj je zrak z ogljikovim dioksidom, desno zgoraj premog in nafta. V srednji vrsti so rastline, živali in razkrojevalci. Puščica fotosinteza gre iz zraka v rastline. Puščica hrana gre iz rastlin v živali. Puščice dihanje gredo iz rastlin in iz živali v zrak. Odmrli ostanki rastlin in živali gredo spodaj k razkrojevalcem, puščica razkroj gre od razkrojevalcev v zrak. Puščica gorenje gre iz premoga in nafte v zrak.
območje: 0; 0 .. 10; 7,5
enota: 30
pravokotnik: 3,5; 6 .. 6,5; 7,2 | modra
napis: 5; 6,6 | zrak: CO_2 | sredina | debelo
pravokotnik: 7,4; 6 .. 9,9; 7,2 | siva
napis: 8,65; 6,6 | premog, nafta | sredina
puščica: 7,4; 6,6 -> 6,5; 6,6 | gorenje | pod | rdeča
pravokotnik: 0,1; 3 .. 2,7; 4 | zelena
napis: 1,4; 3,5 | rastline | sredina
pravokotnik: 3,7; 3 .. 6,3; 4 | oranžna
napis: 5; 3,5 | živali | sredina
pravokotnik: 7,2; 3 .. 9,9; 4 | siva
napis: 8,55; 3,5 | razkrojevalci | sredina
puščica: 3,6; 6,1 -> 2,2; 4,1 | fotosinteza | desno | zelena
puščica: 0,8; 4,1 -> 3,4; 6,7 | dihanje | levo | rdeča
puščica: 2,7; 3,5 -> 3,7; 3,5 | hrana | nad
puščica: 5; 4,1 -> 5; 5,9 | dihanje | desno | rdeča
puščica: 8,5; 4,1 -> 6,6; 5,9 | razkroj | desno | rdeča
črta: 1,4; 3 -> 1,4; 2 -> 8,5; 2 | siva
črta: 5; 3 -> 5; 2 | siva
puščica: 8,5; 2 -> 8,5; 3 | | | siva
napis: 5; 1,5 | odmrli ostanki | pod
:::

Preberi sliko po vrsti. V zraku je ogljik v plinu **ogljikovem dioksidu** ($\mathrm{CO_2}$). Rastline ga pri **fotosintezi** vzamejo iz zraka in iz njega ter iz vode ob sončni svetlobi naredijo sladkor. Iz sladkorja nato gradijo deblo, liste in plodove.

Živali ogljik dobijo s hrano. Ko pojedo rastlino, del njenega ogljika vgradijo v svoje telo.

**Dihanje** v celicah je obratna pot. Celica sladkor razgradi s kisikom, pri tem dobi energijo, ogljik pa odda kot $\mathrm{CO_2}$. Dihajo živali, pa tudi rastline, podnevi in ponoči. Zato imata na sliki obe svojo puščico v zrak.

Odmrle liste, iztrebke in trupla razgradijo **razkrojevalci**, glive in bakterije. Tudi oni dihajo, zato se ogljik iz ostankov vrne v zrak. Nekaj ostankov se je v milijonih let spremenilo v premog in nafto. Ko gorivo zažgemo, se ta stari ogljik naenkrat vrne v zrak.

:::premisli
Van Helmontova vrba je v petih letih pridobila več kot $70\,\mathrm{kg}$, prst pa je izgubila le okoli $57\,\mathrm{g}$. Napovej, od kod je prišla večina mase, in razloži, kaj je vrba sploh vzela iz prsti.
---
Iz ogljikovega dioksida iz zraka in iz vode. Rastlina pri fotosintezi iz teh dveh snovi naredi sladkor, iz sladkorja pa les. Prst je dala le malo rudninskih snovi, zato je izgubila samo okoli $57\,\mathrm{g}$.
:::

Tudi voda kroži. Njeno pot prikaže tabela:

| Korak | Kaj se zgodi |
|---|---|
| izhlapevanje | Sončna toplota spremeni vodo iz morja, rek in tal v paro. |
| transpiracija | Rastline oddajajo vodno paro skozi listne reže. |
| kondenzacija | Para se v višini ohladi v kapljice; nastanejo oblaki. |
| padavine | Kapljice se združijo in padejo kot dež ali sneg. |
| odtekanje | Voda teče po površju ali pronica v podtalnico, do rek in morja. |

**Transpiracija** je izhlapevanje vode skozi drobne reže na listih. Veliko drevo tako v vročem dnevu odda več sto litrov vode. Kroženje vode in ogljika se torej srečata v vsakem listu: list jemlje $\mathrm{CO_2}$ in oddaja vodno paro.

V simulaciji spodaj »Kroženje vode in ogljika« razvrsti procese v dve skupini. Pozorno poglej »izhlapevanje skozi listne reže« in »fotosintezo«. Opazi, da se oba procesa dogajata v istem listu, pa vendar spadata v različni kroženji.

Snov se torej ves čas vrača. Ogljikov atom v tvojem telesu je bil morda pred sto leti v hrastu, pred tem pa v dinozavru.

Z **energijo** je drugače. Prinaša jo sončna svetloba. Rastline so **proizvajalci**: ujamejo svetlobo, vendar le majhen del nje, in ga shranijo v sladkorju. Živali, ki jedo rastline ali druge živali, so **porabniki**. Ko kobilica poje travo, dobi to energijo. Večino porabi za gibanje in delovanje telesa; pri tem jo odda okolici kot **toploto**. V njenem telesu ostane shranjena le okoli desetina. Samo ta del lahko preide na žabo, ki kobilico poje.

Stolpci kažejo, koliko energije ostane na vsaki stopnji travniške verige:

:::risba stolpci
opis: Energija v štirih stopnjah verige. Trava 10000 kJ, kobilice 1000 kJ, žabe 100 kJ, kača 10 kJ. Vsak stolpec je desetkrat nižji od prejšnjega.
os: energija v kJ
korak: 2000
stolpec: trava | 10000
stolpec: kobilice | 1000
stolpec: žabe | 100
stolpec: kača | 10
:::

Energijo merimo v **kilojoulih** (kJ), enako kot na embalaži hrane. Stolpec za kačo je skoraj neviden: od $10\,000\,\mathrm{kJ}$, ki jih ujame trava, kači ostane le $10\,\mathrm{kJ}$.

Toplota, ki jo oddajo bitja, se ne vrne k rastlinam. Rastline je ne morejo ujeti, uporabiti znajo le svetlobo. Energija zato ne kroži, ampak **teče v eno smer**: od Sonca skozi verigo v okolico. Ekosistem brez stalnega dotoka sončne svetlobe bi ugasnil.

:::premisli
Zakaj imajo prehranjevalne verige redko več kot štiri ali pet členov?
---
Ker na vsaki stopnji ostane le desetina energije. Peti člen dobi le $\dfrac{1}{10\,000}$ energije, ki so jo ujele rastline. To je premalo, da bi se z njo preživila še ena populacija plenilcev.
:::

Šele zdaj zapišimo pravilo z znaki. Če je $E_1$ energija v eni stopnji verige, je v naslednji stopnji približno

$$E_2 = \frac{E_1}{10}$$

Pravilo deluje tudi nazaj: $E_1 = 10 \cdot E_2$. To je le približno pravilo; v naravi preide včasih nekaj manj, včasih nekaj več kot desetina.

## Rešeni primeri

### Primer 1: koliko dobi sova

Na njivi žito v enem poletju shrani $50\,000\,\mathrm{kJ}$ energije. Žito jedo miši, miši pa lovi sova. Koliko energije pride do sove in kolikšen delež energije žita je to?

**Podatki:** energija v žitu $E_\text{žito} = 50\,000\,\mathrm{kJ}$; veriga žito → miši → sova; na vsako stopnjo preide desetina
**Iščemo:** energijo v sovi $E_\text{sova}$ in delež $d$

:::formula
$E_2 = \dfrac{E_1}{10}$, delež $d = \dfrac{E_\text{sova}}{E_\text{žito}} \cdot 100\,\%$
:::

**Rešitev:**

1. Miši dobijo desetino energije žita: $\dfrac{50\,000\,\mathrm{kJ}}{10} = 5000\,\mathrm{kJ}$.
2. Sova je naslednja stopnja, zato spet delimo z $10$: $\dfrac{5000\,\mathrm{kJ}}{10} = 500\,\mathrm{kJ}$.
3. Delež: $\dfrac{500}{50\,000} \cdot 100\,\% = 1\,\%$, ker sova stoji dve stopnji nad žitom.
4. Odgovor: do sove pride $500\,\mathrm{kJ}$, kar je le $1\,\%$ energije žita.

### Primer 2: pot ogljika in vode po maratonu

Maratonka zjutraj poje kos kruha. Med tekom diha hitro in se močno poti. Opiši, kako lahko ogljik in voda, ki ju odda, čez nekaj mesecev spet pristaneta v kruhu.

**Podatki:** kruh je iz pšenice; tekačica izdihuje zrak in se poti
**Iščemo:** pot ogljika in pot vode nazaj do pšenice

:::formula
Dihanje: sladkor + kisik → ogljikov dioksid + voda + energija.
Fotosinteza: ogljikov dioksid + voda → sladkor + kisik (ob svetlobi).
:::

**Rešitev:**

1. Celice v mišicah razgrajujejo sladkor iz kruha, da dobijo energijo za tek. Ogljik zapusti telo v izdihanem ogljikovem dioksidu.
2. Ogljikov dioksid se pomeša z zrakom in ga veter raznese, tudi nad polje.
3. Pšenica ga pri fotosintezi vzame skozi listne reže in ogljik vgradi v sladkor ter škrob v zrnu.
4. Pot na koži izhlapi, ker ga segreje telo. Para se v višini ohladi, nastane oblak.
5. Dež pade na polje, voda pronica v tla, korenine pšenice jo vsrkajo.
6. Odgovor: ogljik se vrne po poti dihanje → zrak → fotosinteza, voda pa po poti izhlapevanje → oblak → padavine → korenine. Iz zrna spet speče kruh.

### Primer 3: obrok nogometaša

Nogometaš pred tekmo poje piščančje meso z energijsko vrednostjo $3000\,\mathrm{kJ}$. Piščanec je jedel le žito. Koliko energije je moralo biti v žitu, ki ga je pojedel piščanec? Koliko žita (v kJ) bi nogometaš potreboval, če bi enako energijo dobil kar iz žita?

**Podatki:** energija v mesu $E_2 = 3000\,\mathrm{kJ}$; veriga žito → piščanec → nogometaš; na vsako stopnjo preide desetina
**Iščemo:** energijo v žitu za piščanca $E_1$ in energijo žita, če ga poje nogometaš sam

:::formula
$E_1 = 10 \cdot E_2$
:::

**Rešitev:**

1. Iščemo prejšnjo stopnjo, zato računamo nazaj in množimo: $E_1 = 10 \cdot 3000\,\mathrm{kJ} = 30\,000\,\mathrm{kJ}$.
2. Če nogometaš poje žito sam, piščančje stopnje ni. Potrebuje torej le $3000\,\mathrm{kJ}$ v žitu.
3. Primerjamo: $\dfrac{30\,000}{3000} = 10$, ker ena stopnja manj pomeni desetkrat manj potrebnega žita.
4. Odgovor: piščanec je moral pojesti žito s $30\,000\,\mathrm{kJ}$. Neposredno bi nogometaš potreboval le $3000\,\mathrm{kJ}$ žita, kar je desetkrat manj.

### Primer 4: zdaj ti

Športni ribič v ribniku ujame ščuko. Veriga je alge → vodne bolhe → ribice → ščuka. Koliko energije morajo ujeti alge za vsak $1\,\mathrm{kJ}$, ki je shranjen v ščuki?

**Podatki:** energija v ščuki $1\,\mathrm{kJ}$; veriga alge → vodne bolhe → ribice → ščuka; na vsako stopnjo preide desetina
**Iščemo:** energijo v algah

:::formula
$E_1 = 10 \cdot E_2$
:::

**Rešitev:**

1. Ribice so stopnjo pod ščuko: $10 \cdot 1\,\mathrm{kJ} = 10\,\mathrm{kJ}$.
2. Zdaj nadaljuj sam še za vodne bolhe in alge, nato preveri:

:::premisli
Koliko energije potrebujejo vodne bolhe in koliko alge?
---
Vodne bolhe $10 \cdot 10\,\mathrm{kJ} = 100\,\mathrm{kJ}$, alge $10 \cdot 100\,\mathrm{kJ} = 1000\,\mathrm{kJ}$. Za vsak kilojoule v ščuki morajo alge ujeti $1000\,\mathrm{kJ}$.
:::

## Pogoste napake

- **»Energija kroži tako kot snov.«** Kdor tako misli, nariše puščico od kače nazaj k travi. Toplota, ki jo oddajo bitja, gre v okolico, rastline pa uporabijo le svetlobo. Pravilno: snov kroži, energija teče v eno smer in jo Sonce stalno dovaja.
- **»Rastlina zraste iz prsti.«** Tako je mislil tudi van Helmont, dokler ni stehtal prsti. Prst da le malo rudninskih snovi. Večino mase rastlina naredi iz ogljikovega dioksida iz zraka in iz vode.
- **»Rastline ne dihajo, samo fotosintetizirajo.«** Dihajo vse žive celice, tudi rastlinske, podnevi in ponoči. Podnevi rastlina s fotosintezo vzame več $\mathrm{CO_2}$, kot ga z dihanjem odda, zato se dihanje ne opazi.
- **»Pri dihanju se ogljik spremeni v energijo.«** Ogljik ne izgine. Energija se sprosti, ko celica razgradi sladkor, ogljik pa telo zapusti v ogljikovem dioksidu.
- **»Na višji stopnji je več energije, ker so živali večje.«** Velikost osebka ne odloča. Na vsaki stopnji ostane le okoli desetina energije, zato je plenilcev na vrhu malo.

## Povzetek

- Snov kroži: isti ogljik in ista voda se v ekosistemu vedno znova uporabita.
- Kroženje ogljika: fotosinteza ga vzame iz zraka; hrana ga prenese na živali; dihanje, razkroj in gorenje ga vrnejo v zrak kot $\mathrm{CO_2}$.
- Kroženje vode: izhlapevanje in transpiracija → kondenzacija (oblaki) → padavine → odtekanje in podtalnica.
- Energija teče v eno smer: Sonce → proizvajalci → porabniki → toplota v okolico. Ne kroži.
- Na naslednjo stopnjo preide približno desetina energije: $E_2 = \dfrac{E_1}{10}$; nazaj $E_1 = 10 \cdot E_2$.
- Zato so verige kratke in je plenilcev na vrhu malo.

## Drugače: Z analogijo

Predstavljaj si družabno igro z žetoni in igralno konzolo hkrati.

**Žetoni so snov.** Igralci si jih podajajo: banka jih da prvemu, prvi plača drugemu, drugi vrne banki. Žetonov ni nikoli več ali manj, samo menjajo lastnika. Tako ogljik potuje iz zraka v rastlino, v žival, k razkrojevalcem in spet v zrak.

**Baterija v konzoli je energija.** Med igro se prazni in konzola se segreva. Te toplote ne moreš spraviti nazaj v baterijo. Če konzole ne priključiš na polnilnik, ugasne. Polnilnik ekosistema je Sonce.

Pri vsaki podaji v verigi »igralec« porabi devet desetin baterije zase, naslednjemu preda le desetino. Po treh podajah skoraj nič ne ostane.

## Drugače: Iz vsakdanjega življenja

- Po tuširanju se ogledalo orosi. Topla para se na hladnem steklu kondenzira, prav kakor v oblaku.
- Na vrtu odpadke vržeš na kompost. Po letu dni so iz njih temna prst in hranila. Razkrojevalci so ogljik pri tem oddali v zrak, rudninske snovi pa ostanejo za nove rastline.
- Po teku ti je vroče. To je toplota, ki jo je telo oddalo pri dihanju v celicah: del energije iz hrane je že odšel v okolico.
- Kurjenje drv vrne v zrak ogljik, ki ga je drevo zbiralo desetletja. Kurjenje premoga vrne ogljik, ki je bil pod zemljo milijone let.

## Preveri se

? Trije procesi vračajo ogljik v zrak, eden ga iz zraka jemlje. Kateri ne sodi zraven?
- dihanje rastlin
~ Rastline tudi dihajo in pri tem oddajajo $\mathrm{CO_2}$, tako kot živali.
- razkroj odmrlega listja
~ Razkrojevalci pri razgradnji listja dihajo in oddajajo $\mathrm{CO_2}$ v zrak.
- gorenje drv
~ Pri gorenju se ogljik iz lesa vrne v zrak kot $\mathrm{CO_2}$.
+ fotosinteza
> Fotosinteza je edini od naštetih procesov, ki $\mathrm{CO_2}$ jemlje iz zraka; rastlina iz njega naredi sladkor.

? Stolpci kažejo energijo v morski verigi. Kril so drobni morski raki, ki jedo alge. Koliko kilojoulov preide na tuna, ki je sardele?
:::risba stolpci
opis: Energija v morski verigi. Alge 40000 kJ, kril 4000 kJ, sardele 400 kJ.
os: energija v kJ
korak: 10000
stolpec: alge | 40000
stolpec: kril | 4000
stolpec: sardele | 400
:::
= 40 kJ | 0
~ 200 | Na naslednjo stopnjo ne preide polovica, ampak le približno desetina.
~ 360 | Odštel si desetino. Desetina energije preide naprej, devet desetin se izgubi.
~ 4 | Delil si s $100$. Tun je le eno stopnjo nad sardelami, zato deliš z $10$.
> Iz grafa preberemo, da je v sardelah $400\,\mathrm{kJ}$. Tun dobi približno desetino: $\dfrac{400\,\mathrm{kJ}}{10} = 40\,\mathrm{kJ}$.

? Na vsaki stopnji verige se večina energije odda kot toplota. Kaj je posledica tega?
- Na vrhu verige je največ energije, ker so tam največje živali.
~ Velikost živali ne odloča. Vsaka stopnja dobi le okoli desetino energije prejšnje.
- Toplota se vrne k rastlinam in jih ogreje, zato energija kroži.
~ Rastline ne morejo uporabiti toplote, le svetlobo. Energija ne kroži.
+ Verige so kratke, plenilcev na vrhu pa je malo.
- Veriga je lahko poljubno dolga, saj Sonce sveti ves čas.
~ Sonce oskrbuje le rastline. Do petega člena pride le desettisočinka njihove energije.
> Ker na vsaki stopnji ostane le desetina energije, se že po nekaj stopnjah ne more preživeti nova populacija plenilcev.

? Luka razlaga pot ogljika v kolesarju. V katerem koraku se je zmotil?
**1.** Pšenica pri fotosintezi vzame $\mathrm{CO_2}$ iz zraka in ga vgradi v sladkor.
**2.** Kolesar poje testenine iz te pšenice.
**3.** Pri dihanju se ogljik v mišicah spremeni v energijo in izgine.
**4.** Energija iz hrane poganja kolesarjeve mišice.
- v koraku 1
~ Korak 1 je pravilen: rastlina pri fotosintezi res vzame $\mathrm{CO_2}$ iz zraka.
- v koraku 2
~ Korak 2 je pravilen: s hrano ogljik preide iz rastline v človeka.
+ v koraku 3
- v koraku 4
~ Korak 4 je pravilen: energija, ki se sprosti pri dihanju, poganja mišice.
> Ogljik ne izgine in se ne spremeni v energijo. Energija se sprosti pri razgradnji sladkorja, ogljik pa kolesar izdiha kot $\mathrm{CO_2}$.

? Razvrsti pot kapljice potu od tekačeve kože do vode v reki.
1. Pot na koži se segreje in izhlapi.
2. Vodna para se dvigne in se v višini ohladi.
3. Para se kondenzira v kapljice in nastane oblak.
4. Iz oblaka pade dež.
5. Voda pronica v tla in podtalnica jo odnese v reko.
> To je kroženje vode: izhlapevanje → kondenzacija → padavine → odtekanje.

:::simboli
E_1 | energija v eni stopnji verige | E_1 = 10 \cdot E_2 | kJ
E_2 | energija v naslednji stopnji verige | E_2 = \dfrac{E_1}{10} | kJ | približno desetina $E_1$
E_\text{žito} | energija, shranjena v žitu | | kJ
E_\text{sova} | energija, ki pride do sove | | kJ
d | delež energije žita, ki pride do sove | d = \dfrac{E_\text{sova}}{E_\text{žito}} \cdot 100\,\% | \%
:::

<<RACUN
vrednost: 50000/10 | 5000
vrednost: 5000/10 | 500
vrednost: 500/50000*100 | 1
vrednost: 10*3000 | 30000
vrednost: 30000/3000 | 10
vrednost: 10*1 | 10
vrednost: 10*10 | 100
vrednost: 10*100 | 1000
vrednost: 10000/10/10/10 | 10
vrednost: 400/10 | 40
>>
