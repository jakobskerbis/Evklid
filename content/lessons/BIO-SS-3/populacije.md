---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V Sloveniji zadnja leta vsako leto umre nekaj tisoč ljudi več, kot se jih rodi. Pa vendar nas je danes več kot pred desetimi leti. Kako je to mogoče?

Najprej se zdi, da je nekje napaka v statistiki. Ni je. Podobno je s Tininim bančnim računom: z delom ob šoli mesečno zasluži $150$ €, porabi pa $180$ €. Kljub temu ima vsak mesec več denarja, ker ji babica mesečno nakaže $50$ €. Stanje se spremeni za $150 - 180 + 50 = 20$ €. Na stanje ne vplivata le zaslužek in poraba, ampak tudi nakazila od drugod in nakazila drugam.

S populacijami je enako. Na število osebkov vplivajo štirje tokovi, ne le rojstva in smrti. Kdor jih zna brati, razume rast mest, izbruhe lubadarja, upad ribjih jat in tudi, zakaj državo skrbijo pokojnine.

## Razlaga

**Štirje tokovi.** Populacijo (osebke ene vrste na istem prostoru) si predstavljaj kot škatlo, v katero osebki vstopajo in iz nje izstopajo:

:::risba skica
opis: Pravokotnik v sredini predstavlja populacijo z N osebki. Z leve vanj kažeta dve puščici: plus rodnost (R) in plus priseljevanje (P). Iz njega na desno kažeta dve puščici: minus smrtnost (S) in minus odseljevanje (O).
območje: 0; 0 .. 10; 6
enota: 30
pravokotnik: 3,5; 1,5 .. 6,5; 4,5 | modra
napis: 5; 3 | populacija N | sredina | debelo
puščica: 0,3; 4,2 -> 3,5; 3,7 | + rodnost R | nad | zelena
puščica: 0,3; 1,8 -> 3,5; 2,3 | + priseljevanje P | pod | zelena
puščica: 6,5; 3,7 -> 9,7; 4,2 | − smrtnost S | nad | rdeča
puščica: 6,5; 2,3 -> 9,7; 1,8 | − odseljevanje O | pod | rdeča
:::

**Rodnost** pove, koliko novih osebkov se v populaciji rodi (izleže, vzklije) v določenem času. **Smrtnost** pove, koliko jih v tem času umre. **Priseljevanje** je prihod osebkov iz drugih populacij, **odseljevanje** njihov odhod. Rodnost in priseljevanje populacijo večata, smrtnost in odseljevanje jo manjšata.

Razliko med rojenimi in umrlimi imenujemo **naravni prirastek**. V Sloveniji je negativen, priseljenih pa je več kot odseljenih, zato skupno število raste. To je rešitev uganke iz uvoda.

**Število ali delež?** V dveh gozdovih so eno leto šteli srne:

| Populacija | Osebkov | Rojenih | Rojenih na osebek |
|---|---|---|---|
| gozd A | $2000$ | $300$ | $0{,}15$ |
| gozd B | $400$ | $100$ | $0{,}25$ |

V gozdu A se rodi več srnjadi, a rodnost je večja v gozdu B. Zato rodnost in smrtnost navadno podajamo kot delež: na osebek ali na $1000$ osebkov v letu.

**Gostota.** Iz lekcije o ekosistemu veš, da gostota pove, koliko osebkov je na enoto prostora. Če je v prodajnem akvariju s $120\,\mathrm{L}$ vode $60$ gupijev, je gostota $0{,}5$ gupija na liter. Gostota se spreminja z vsemi štirimi tokovi. Pri veliki gostoti je več tekmovanja za hrano in prostor ter več bolezni, zato rodnost pade in smrtnost naraste.

**Starostna sestava.** Populacijo lahko razdelimo na tri starostne skupine: mlade (še se ne razmnožujejo), zrele (se razmnožujejo) in stare (se ne razmnožujejo več). Če skupine narišemo kot vodoravne stolpce, mlade spodaj in stare zgoraj, dobimo **starostno piramido**. Primeri deležev:

| Piramida | Mladi | Zreli | Stari |
|---|---|---|---|
| rastoča | $45\,\%$ | $40\,\%$ | $15\,\%$ |
| ustaljena | $30\,\%$ | $45\,\%$ | $25\,\%$ |
| upadajoča | $15\,\%$ | $45\,\%$ | $40\,\%$ |

Rastoča piramida ima široko osnovo, ustaljena je podobna zvonu, upadajoča ima ozko osnovo. Danes mladi so jutrišnji starši: široka osnova napoveduje rast, ozka upad.

:::premisli
Ob odprtju novega ribnika vanj spustijo $200$ mladic krapov, vse enako starih. Kakšna je starostna piramida in kako se bo spreminjalo število rib v prvih letih?
---
Piramida je le en sam spodnji stolpec, vse ribe so mlade. Prva leta se ne rodi nobena riba, le nekaj jih pogine, zato število rahlo pada. Ko mladice dozorijo, rodnost skokovito naraste in populacija začne hitro rasti.
:::

**Rast populacije.** Kako se število spreminja skozi leta, kaže graf:

:::risba graf
opis: Dve krivulji rasti populacije, ki obe začneta pri 10 osebkih. Črtkana krivulja J brez omejitev raste vedno hitreje in pri 7 letih preseže 480 osebkov. Polna krivulja S z omejenimi viri sprva raste skoraj enako kot J, nato hitro, potem se upočasni in se približa nosilni zmogljivosti K = 500 osebkov, ki je vodoravna črtkana črta.
x: 0 .. 15 | 5 | čas (leta)
y: 0 .. 600 | 100 | število osebkov N
črta: 0; 500 -> 15; 500 | siva črtkano
napis: 1; 500 | K = 500 | nad | siva
f: 10*2^(0.8*x) | rdeča črtkano | 0 .. 7,3
f: 500/(1+49*2^(-0.8*x)) | modra debelo | 0 .. 15
napis: 5,3; 300 | J | levo | rdeča
napis: 10; 420 | S | desno | modra
podnapis: Krivulja J (brez omejitev) in krivulja S (omejeni viri)
:::

Če hrane in prostora ne zmanjka, se populacija vsako leto poveča za **isti delež**, ne za isto število. Nastane krivulja v obliki črke J: **eksponentna rast**. Tako rastejo bakterije v sveži hranilni raztopini ali zajci, ki jih prinesejo na otok brez plenilcev.

V naravi viri prej ali slej postanejo omejeni. Ko gostota narašča, se okrepi tekmovanje, rast se upočasni in krivulja se ukrivi v obliko črke S: **logistična rast**. Največje število osebkov, ki ga okolje trajno preživlja, je **nosilna zmogljivost** $K$ (tudi nosilnost okolja).

Preizkusi to v simulaciji »Rast populacije« spodaj. Najprej preveri, da so omejeni viri vklopljeni in da je prirast na osebek $r = 0{,}4$ (simbol $r$ natančno razložimo na koncu razlage). Nato premakni nosilno zmogljivost z $500$ na $1000$ in opazuj: krivulja ima enako obliko, le da se ustali višje.

**Nihanje.** Ob nosilni zmogljivosti razmnoževanje ne ugasne. Rojstva in smrti se le izenačijo, število pa niha gor in dol. Hladna zima, sušno poletje ali požar prizadenejo populacijo ne glede na gostoto. Bolezni, tekmovanje in plenilci pa so tem močnejši, čim gostejša je populacija.

Plenilec in plen pogosto nihata skupaj: v Kanadi se število zajcev in risov v ciklih po okoli $10$ let dviga in spušča, ris z zamikom za zajcem.

:::premisli
Zakaj število risov doseže vrh šele leto ali dve za vrhom zajcev, ne hkrati z njim?
---
Risi potrebujejo čas, da se ob obilju hrane razmnožijo in mladiči odrastejo. Ko je risov največ, so zajce že močno zdesetkali, zato začne kmalu upadati tudi število risov.
:::

**Simboli na koncu.** Spremembo števila osebkov v nekem času zapišemo z rojenimi $R$, umrlimi $S$, priseljenimi $P$ in odseljenimi $O$:

$$\Delta N = R - S + P - O$$

Rodnost na osebek je $b = \dfrac{R}{N}$, smrtnost na osebek $m = \dfrac{S}{N}$. Njuna razlika je prirast na osebek $r$:

$$r = b - m$$

Pri eksponentni rasti brez selitev po $t$ letih velja:

$$N_t = N_0 \cdot (1 + r)^{t}$$

Ta formula je enaka kot pri obrestno obrestnem računu v banki: obresti se vsako leto obračunajo tudi od lanskih obresti.

## Rešeni primeri

### Primer 1 (lažji): gupiji v trgovini

V prodajnem akvariju trgovine z živalmi je v ponedeljek $60$ gupijev. Do naslednjega ponedeljka se jih skoti $18$, pogine $6$, kupci jih kupijo $25$, dobavitelj pa pripelje $10$ novih. Koliko gupijev je v akvariju čez teden dni? Kolikšen je naravni prirastek?

**Podatki:** $N_0 = 60$, $R = 18$, $S = 6$, $O = 25$ (prodani), $P = 10$ (dobava)
**Iščemo:** število gupijev po enem tednu in naravni prirastek

:::formula
$\Delta N = R - S + P - O$; naravni prirastek je $R - S$
:::

**Rešitev:**

1. Prodani gupiji populacijo zapustijo, zato so odseljevanje; dobava je priseljevanje.
2. $\Delta N = 18 - 6 + 10 - 25 = -3$.
3. Po tednu: $N = 60 - 3 = 57$.
4. Naravni prirastek: $18 - 6 = 12$, torej pozitiven.
5. Odgovor: v akvariju je $57$ gupijev. Naravni prirastek je $+12$, a populacija vseeno upada, ker je odseljenih več kot priseljenih.

### Primer 2: zajci na otoku

Na otoku brez plenilcev živi $400$ zajcev. V enem letu se jih rodi $240$, umre pa $80$. Zajci z otoka ne morejo oditi in nobeni ne pridejo. Izračunaj rodnost, smrtnost in prirast na osebek. Koliko zajcev bo čez $3$ leta, če ostane $r$ enak?

**Podatki:** $N_0 = 400$, $R = 240$, $S = 80$, $P = O = 0$, $t = 3$ leta
**Iščemo:** $b$, $m$, $r$ in $N_3$

:::formula
$b = \dfrac{R}{N}$, $m = \dfrac{S}{N}$, $r = b - m$, nato $N_t = N_0 \cdot (1 + r)^{t}$
:::

**Rešitev:**

1. Rodnost: $b = \dfrac{240}{400} = 0{,}6$ na osebek v letu.
2. Smrtnost: $m = \dfrac{80}{400} = 0{,}2$ na osebek v letu.
3. Prirast: $r = 0{,}6 - 0{,}2 = 0{,}4$, populacija se letno poveča za $40\,\%$.
4. Po enem letu $400 \cdot 1{,}4 = 560$, po dveh $560 \cdot 1{,}4 = 784$.
5. Po treh: $N_3 = 400 \cdot 1{,}4^{3} = 1097{,}6$, kar zaokrožimo na $1098$.
6. Odgovor: rodnost je $0{,}6$, smrtnost $0{,}2$, prirast $0{,}4$ na osebek v letu; čez $3$ leta bo na otoku okoli $1098$ zajcev, skoraj trikrat toliko kot zdaj.

### Primer 3 (težji): koliko gupijev prodati?

Druga trgovina želi imeti v akvariju stalno $80$ gupijev. Akvarij je velik za največ $100$ rib. Vsak teden se jih skoti $16$, pogine $4$, dobavitelj pa pripelje $10$. Koliko gupijev mora trgovina prodati na teden? Koliko jih bo čez $4$ tedne, če proda le $15$ na teden, in kaj se bo zgodilo?

**Podatki:** $N_0 = 80$, $R = 16$, $S = 4$, $P = 10$ na teden; $K = 100$; v drugem delu $O = 15$ na teden, $t = 4$ tedni
**Iščemo:** potrebno odseljevanje $O$ za stalno število; število po $4$ tednih

:::formula
Populacija je stalna, če je $\Delta N = 0$, torej $O = R - S + P$
:::

**Rešitev:**

1. Za stalno število mora veljati $\Delta N = 0$.
2. $O = 16 - 4 + 10 = 22$: trgovina mora prodati $22$ gupijev na teden.
3. Če jih proda le $15$: $\Delta N = 16 - 4 + 10 - 15 = 7$ na teden.
4. Zdaj ti: izračunaj število po $4$ tednih (če vsa števila ostanejo enaka) in ga primerjaj z $K$.

:::premisli
Koliko gupijev bi bilo čez $4$ tedne in kaj se bo v resnici zgodilo?
---
$80 + 4 \cdot 7 = 108$, kar je več od nosilne zmogljivosti $100$. Število tako ne bo raslo: ob preveliki gostoti zmanjka kisika in prostora, ribe so pod stresom in bolne. Smrtnost naraste, rodnost pade, in število se ustali pri ali pod $100$, trgovina pa izgubi denar za poginule ribe.
:::

## Pogoste napake

- **»Če se rodi več, kot jih umre, populacija raste.«** Pozabiš na selitve. V Primeru 1 je naravni prirastek $+12$, a populacija upade za $3$. Vedno seštej vse štiri tokove.
- **»Večja rodnost je tam, kjer se rodi več osebkov.«** Število rojenih je odvisno tudi od velikosti populacije. Primerjaj delež na osebek: gozd B ima rodnost $0{,}25$, gozd A le $0{,}15$, čeprav se v A rodi več srnjadi.
- **»Eksponentna rast pomeni, da vsako leto pride enako število osebkov.«** To je linearna rast. Pri eksponentni je enak *delež*, zato se prirastek iz leta v leto veča, kot obresti na obresti.
- **»Pri nosilni zmogljivosti se razmnoževanje ustavi.«** Osebki se še rojevajo in umirajo, le v enakem številu. Število niha okoli $K$.
- **»Široka osnova piramide pomeni staro populacijo.«** Spodaj so najmlajši. Široka osnova pomeni veliko mladih in prihodnjo rast.

## Povzetek

- Na število osebkov vplivajo rodnost in priseljevanje (večata) ter smrtnost in odseljevanje (manjšata): $\Delta N = R - S + P - O$.
- Naravni prirastek je $R - S$; populacija lahko raste tudi ob negativnem prirastku, če je priseljevanja dovolj.
- Rodnost in smrtnost primerjamo na osebek: $b = \dfrac{R}{N}$, $m = \dfrac{S}{N}$, $r = b - m$.
- Gostota je število osebkov na enoto prostora; ob veliki gostoti tekmovanje in bolezni zmanjšajo rast.
- Starostna piramida: široka osnova (rast), zvon (ustaljena), ozka osnova (upad).
- Brez omejitev eksponentna rast (krivulja J, $N_t = N_0 (1 + r)^{t}$); z omejenimi viri logistična rast (krivulja S) do nosilne zmogljivosti $K$, okoli katere število niha.

## Drugače: Z analogijo

Populacija je kot kad z vodo. Gladina je število osebkov. Pipa nad kadjo je rodnost, odtok smrtnost. Ob strani sta še dve cevi: ena dovaja vodo iz sosednje kadi (priseljevanje), druga jo odvaja (odseljevanje). Gladina se dviga, če skupaj priteče več vode, kot je odteče, ne glede na to, skozi katero cev.

Krivulja S pa je kad, ki ima ob robu prelivno odprtino. Ko je voda nizko, gladina hitro raste. Bliže ko je robu, več vode odteka skozi preliv, in gladina se ustavi tik ob njem. Rob kadi je nosilna zmogljivost $K$. Analogija ima mejo: voda se sama ne »razmnožuje«, zato pipa ne teče hitreje, ko je vode več. Pri živih populacijah je prav to razlog za eksponentno rast.

## Drugače: Iz vsakdanjega življenja

**Pokojnine.** Starostna piramida Slovenije ima ožjo osnovo kot sredino: rojenih je malo, generacije, rojene po drugi svetovni vojni in v sedemdesetih letih, pa so številne. Ko se te generacije upokojijo, je zaposlenih, ki plačujejo prispevke, razmeroma vedno manj, upokojencev pa več. Zato država razpravlja o višji upokojitveni starosti in spodbuja priseljevanje delavcev.

**Lubadar.** Po žledu in viharjih v slovenskih gozdovih leži veliko podrtih smrek. Za podlubnika to pomeni skoraj neomejeno hrano, zato njegova populacija nekaj let raste skoraj eksponentno. Ko podrto drevje odpeljejo ali ga lubadar porabi, se rast ustavi in število pade.

**Miške in bukov žir.** V letih, ko bukve obilno obrodijo, imajo gozdne miši veliko hrane in naslednje leto jih je izjemno veliko. Z njimi se namnožijo tudi klopi, ki se hranijo na miših.

## Preveri se

? Trgovina z živalmi proda $25$ gupijev iz prodajnega akvarija. Kateri proces je to za populacijo gupijev v tem akvariju?
- smrtnost
~ Prodane ribe ne poginejo, le zapustijo to populacijo.
- priseljevanje
~ Priseljevanje je za kupčev akvarij doma. Za akvarij v trgovini ribe odidejo.
+ odseljevanje
- negativna rodnost
~ Rodnost šteje le novorojene osebke in ne more biti negativna.
> Osebki, ki zapustijo populacijo in ne poginejo, so odseljevanje.

? Kateri vrstni red opisuje rast populacije z omejenimi viri (krivulja S)?
- hitra rast, počasna rast, upočasnitev, nihanje okoli $K$
~ Na začetku je osebkov malo, zato je tudi novih malo: rast je najprej počasna.
+ počasna rast, hitra rast, upočasnitev, nihanje okoli $K$
- počasna rast, hitra rast, nihanje okoli $K$, ponovna hitra rast
~ Ob nosilni zmogljivosti ni prostora za novo hitro rast; tekmovanje jo zavira.
- počasna rast, hitra rast, upočasnitev, populacija izumre
~ Pri $K$ se rojstva in smrti izenačijo, populacija ne izumre.
> Najprej je osebkov malo, nato se razmah pospeši, ob vse večji gostoti pa tekmovanje rast upočasni, dokler število ne niha okoli $K$.

? Kaj se bo v prihodnjih desetletjih zgodilo s populacijo z ozko osnovo starostne piramide in široko sredino, če ni priseljevanja?
- Hitro bo rasla.
~ Hitro rast napoveduje široka osnova, torej veliko mladih.
- Ostala bo enaka.
~ V ustaljeni populaciji je mladih dovolj, da nadomestijo starše; tu jih je premalo.
+ Upadala bo.
> Mladih je malo, zato bo čez leta manj staršev in manj rojstev, zrele generacije pa se bodo postarale.

? V gozdu živi $1200$ srn. V letu se jih rodi $90$, umre $110$, priseli $40$, odseli pa $25$. Koliko srn je v gozdu ob koncu leta?
- $1180$
~ Upošteval si le rojene in umrle. Prištej še priseljene in odštej odseljene.
+ $1195$
- $1165$
~ Zamenjal si priseljevanje in odseljevanje: priseljene prišteješ, odseljene odšteješ.
- $1465$
~ Vse štiri tokove si prištel. Smrtnost in odseljevanje populacijo manjšata.
> $\Delta N = 90 - 110 + 40 - 25 = -5$, zato $1200 - 5 = 1195$ srn.

? Populacija ima $200$ osebkov in prirast $r = 0{,}1$ na leto, selitev ni. Koliko osebkov ima čez $2$ leti?
- $220$
~ To je stanje po enem letu. Račun ponovi še za drugo leto.
- $240$
~ Dodal si dvakrat po $20$, kot da je rast linearna. Drugo leto raste od $220$, ne od $200$.
+ $242$
> $N_2 = 200 \cdot 1{,}1^{2} = 242$: prvo leto $+20$, drugo leto $+22$.

:::simboli
\Delta N | sprememba števila osebkov | \Delta N = R - S + P - O | –
R | število rojenih | | –
S | število umrlih | | –
P | število priseljenih | | –
O | število odseljenih | | –
N | število osebkov v populaciji | | –
b | rodnost na osebek | b = \frac{R}{N} | – | v letu
m | smrtnost na osebek | m = \frac{S}{N} | – | v letu
r | prirast na osebek | r = b - m | – | v letu
N_0 | začetno število osebkov | | –
N_t | število osebkov po $t$ letih | N_t = N_0 \cdot (1 + r)^{t} | –
N_3 | število zajcev po treh letih | | –
t | čas | | leta
K | nosilna zmogljivost | | – | največ osebkov, ki jih okolje trajno preživlja
:::

<<RACUN
vrednost: 150-180+50 | 20
vrednost: 60/120 | 0.5
vrednost: 300/2000 | 0.15
vrednost: 100/400 | 0.25
vrednost: 18-6+10-25 | -3
vrednost: 60-3 | 57
vrednost: 18-6 | 12
vrednost: 240/400 | 0.6
vrednost: 80/400 | 0.2
vrednost: 0.6-0.2 | 0.4
vrednost: 400*1.4^2 | 784
vrednost: 400*1.4^3 | 1097.6
vrednost: 16-4+10 | 22
vrednost: 80+4*(16-4+10-15) | 108
vrednost: 1200+90-110+40-25 | 1195
vrednost: 200*1.1^2 | 242
>>
