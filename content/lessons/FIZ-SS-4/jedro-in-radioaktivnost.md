---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1896 je Henri Becquerel raziskoval, ali uranove soli po osvetlitvi s Soncem oddajajo rentgenske žarke. Fotografske plošče je zavil v črn papir in nanje položil uranovo sol. Ker je bilo nekaj dni oblačno, je vse skupaj pospravil v predal. Ko je plošče razvil, so bile kljub temu počrnele, prav pod uranovo soljo. Uran je torej seval sam od sebe, brez svetlobe in brez kakršnega koli polnjenja.

Od kod to sevanje in njegova energija? Marie in Pierre Curie sta odkrila še dva taka elementa, polonij in radij. Ernest Rutherford je sevanje razdelil na vrste. Njegov sodelavec Hans Geiger je razvil števec, ki zazna vsak posamezen delec sevanja. Danes je Geigerjev števec priključen na zvočnik: vsak zaznan delec je en klik. Ob kosu uranove rude števec prasketa kot dež po strehi, v razredu le redko klikne.

Iz tega prasketanja bomo razbrali, kaj se pri sevanju zgodi z jedrom, zakaj klikanje ob nekaterih snoveh v nekaj dneh utihne in zakaj je energija iz jeder milijonkrat večja kot pri gorenju.

## Razlaga

**1. Kaj je v jedru.** V središču atoma je jedro, ki je približno $100\,000$-krat manjše od atoma, v njem pa je skoraj vsa masa. Sestavljajo ga **protoni** (pozitivni) in **nevtroni** (brez naboja), s skupnim imenom **nukleoni**. Število protonov je **vrstno število** $Z$; to določa element. Število vseh nukleonov je **masno število** $A$. Jedro zapišemo kot ${}^{A}_{Z}\mathrm{X}$: zgoraj masno število $A$, spodaj vrstno število $Z$. Ogljik-14 je ${}^{14}_{6}\mathrm{C}$: $6$ protonov in $8$ nevtronov.

Jedra istega elementa z različnim številom nevtronov so **izotopi**. Ogljik-12 in ogljik-14 sta izotopa ogljika. Protoni se električno odbijajo. Jedro kljub temu drži skupaj **močna jedrska sila**, ki privlači vse nukleone, a deluje le na zelo kratke razdalje. Nekatere kombinacije protonov in nevtronov so stabilne, druge ne. Nestabilno jedro prej ali slej **razpade**: izseva delec in se spremeni. Takšno jedro je **radioaktivno**.

**2. Tri vrste razpada.** Rutherford je sevanje ločil po tem, kaj ga ustavi:

| Vrsta | Kaj odleti | Kaj se zgodi z jedrom | Kaj ga ustavi |
|---|---|---|---|
| $\alpha$ | helijevo jedro ${}^{4}_{2}\mathrm{He}$ | masno število $-4$, $Z - 2$ | list papirja, koža |
| $\beta^-$ | elektron | masno število enako, $Z + 1$ | nekaj mm aluminija |
| $\gamma$ | foton z energijo okoli MeV | masno in vrstno število enako | debel svinec, beton |

Pri razpadu $\beta^-$ elektron ne pride iz elektronske ovojnice, ampak nastane v jedru: en nevtron se spremeni v proton in elektron (ter še skoraj neopazen delec, antinevtrino). Zato ostane število nukleonov enako, protonov pa je en več. Jedro, ki nastane po razpadu, je pogosto vzbujeno. Tako kot atom pri skoku elektrona na nižji nivo izseva foton, jedro izseva foton $\gamma$. Ta ima okoli milijonkrat več energije kot foton vidne svetlobe.

Pri zapisu razpada se na obeh straneh ohranita vsota masnih števil in vsota vrstnih števil (naboj). Uran-238 razpade z razpadom $\alpha$:

$${}^{238}_{92}\mathrm{U} \rightarrow {}^{234}_{90}\mathrm{Th} + {}^{4}_{2}\mathrm{He}$$

Zgoraj: $238 = 234 + 4$. Spodaj: $92 = 90 + 2$. Ogljik-14 razpade z razpadom $\beta^-$ (elektron zapišemo kot ${}^{0}_{-1}\mathrm{e}$):

$${}^{14}_{6}\mathrm{C} \rightarrow {}^{14}_{7}\mathrm{N} + {}^{0}_{-1}\mathrm{e}$$

:::premisli
Radij-226 (${}^{226}_{88}\mathrm{Ra}$) razpade z razpadom $\alpha$. Napovej masno in vrstno število novega jedra. Kateri plin nastane?
---
Masno število $226 - 4 = 222$, vrstno število $88 - 2 = 86$. Element z $Z = 86$ je radon, ${}^{222}_{86}\mathrm{Rn}$. Ta plin uhaja iz tal in se nabira v kleteh, ker v kamninah povsod razpada malo radija.
:::

**3. Razpolovni čas.** Za posamezno jedro ne moremo napovedati, kdaj bo razpadlo; razpad je naključen. Za ogromno jeder pa velja zanesljivo pravilo: v vsakem enako dolgem času razpade enak *delež* jeder. Čas, v katerem razpade polovica jeder, je **razpolovni čas** $t_{1/2}$. Jod-131 ima razpolovni čas $8$ dni, ogljik-14 $5730$ let, uran-238 okoli $4{,}5$ milijarde let.

| Pretekli čas | Delež nerazpadlih jeder |
|---|---|
| $0$ | $1$ |
| $t_{1/2}$ | $1/2$ |
| $2\,t_{1/2}$ | $1/4$ |
| $3\,t_{1/2}$ | $1/8$ |

Na grafu je ta tabela krivulja, ki se vsakič razpolovi:

:::risba graf
opis: Delež nerazpadlih jeder v odstotkih v odvisnosti od časa, merjenega v razpolovnih časih. Krivulja se začne pri 100 %, po enem razpolovnem času je 50 %, po dveh 25 %, po treh 12,5 %. Nikoli ne pade na nič.
x: 0 .. 4 | 1 | razpolovni časi
y: 0 .. 100 | 25 | delež jeder [%]
f: 100*2^(-x) | modra | 0 .. 4
točka: 1; 50 | 50 % | desno
točka: 2; 25 | 25 % | nad desno
točka: 3; 12,5 | 12,5 % | nad desno
:::

V simulaciji spodaj izberi jod-131 in poženi razpadanje $400$ jeder. Po treh razpolovnih časih (pri $24$ dneh) preveri, koliko jeder je ostalo. Ponovi poskus in opazuj, da število ni vedno točno $50$, je pa vedno blizu.

:::premisli
Sošolec reče: »Če v $8$ dneh razpade polovica joda, potem v $16$ dneh razpade še druga polovica in ne ostane nič.« Sošolka mu ugovarja: »Preostala jedra so že stara, zato bodo zdaj razpadala hitreje.« Kaj je narobe pri vsakem od njiju?
---
V drugih $8$ dneh razpade polovica *preostalih* jeder, ne polovica začetnih. Po $16$ dneh ostane četrtina, po $24$ dneh osmina. Vsako jedro »ne ve«, koliko časa že obstaja, zato je delež, ki razpade v naslednjih $8$ dneh, vedno enak.
:::

Število nerazpadlih jeder $N$ po času $t$ zapišemo s simboli:

$$N = N_0 \cdot 2^{-t/t_{1/2}}$$

$N_0$ je začetno število jeder. **Aktivnost** $A$ je število razpadov v sekundi; enota je becquerel, $1\,\mathrm{Bq} = 1\,\mathrm{s^{-1}}$. Aktivnost je sorazmerna s številom jeder, zato pada po istem pravilu:

$$A = A_0 \cdot 2^{-t/t_{1/2}}$$

Geigerjev števec zazna le del razpadov, a stalen del. Zato tudi število klikov na minuto pada natanko tako kot aktivnost.

**4. Jedrska energija.** Ko natančno stehtamo jedro, je njegova masa *manjša* od vsote mas posameznih protonov in nevtronov. Razliko imenujemo **masni primanjkljaj** $\Delta m$. Pri vezavi nukleonov v jedro se je ta masa sprostila kot energija, ki jo opiše Einsteinova enačba:

$$W_v = \Delta m \, c^2$$

$W_v$ je **vezavna energija**: toliko energije bi morali dodati, da bi jedro razbili na posamezne nukleone. Če jo delimo s številom nukleonov, dobimo vezavno energijo na nukleon. Ta pove, kako trdno je jedro zvezano:

:::risba stolpci
opis: Vezavna energija na nukleon v MeV za pet jeder. Devterij 1,1; helij-4 7,1; ogljik-12 7,7; železo-56 8,8; uran-235 7,6. Najvišja je pri železu.
podnapis: Vezavna energija na nukleon
os: MeV na nukleon
korak: 2
stolpec: H-2 | 1,1
stolpec: He-4 | 7,1
stolpec: C-12 | 7,7
stolpec: Fe-56 | 8,8
stolpec: U-235 | 7,6
:::

Najtrdneje so zvezana srednje težka jedra okoli železa. Energija se sprosti, kadar jedra preidejo v bolj zvezana, torej k višjim stolpcem. Dve poti sta:

- **Cepitev**: težko jedro, na primer uran-235, po zadetku nevtrona razpade na dve srednje težki jedri. Ob eni cepitvi se sprosti okoli $200\,\mathrm{MeV}$. Tako deluje jedrska elektrarna Krško.
- **Zlivanje** (fuzija): lahka jedra se zlijejo v težje, na primer vodik v helij. Tako sevajo zvezde.

Pri gorenju se ob reakciji ene molekule sprosti le nekaj eV. Pri cepitvi enega jedra je to okoli $200$ milijonov eV, zato gram urana-235 da približno toliko energije kot nekaj ton premoga.

## Rešeni primeri

### Primer 1: kaj nastane pri razpadu

Polonij-210 (${}^{210}_{84}\mathrm{Po}$) je sevalec $\alpha$. Zapiši enačbo razpada in ugotovi, katero jedro nastane. Svinec ima vrstno število $82$.

**Podatki:** jedro ${}^{210}_{84}\mathrm{Po}$, razpad $\alpha$, svinec $Z = 82$
**Iščemo:** masno in vrstno število novega jedra, ime elementa

:::formula
Pri razpadu $\alpha$ odleti ${}^{4}_{2}\mathrm{He}$: masno število se zmanjša za $4$, vrstno število za $2$.
:::

**Rešitev:**

1. Masno število: $210 - 4 = 206$, ker delec $\alpha$ odnese $4$ nukleone.
2. Vrstno število: $84 - 2 = 82$, ker odnese $2$ protona.
3. $Z = 82$ ima svinec, zato nastane ${}^{206}_{82}\mathrm{Pb}$.
4. Preverimo ohranitev: $210 = 206 + 4$ in $84 = 82 + 2$.
5. Odgovor: ${}^{210}_{84}\mathrm{Po} \rightarrow {}^{206}_{82}\mathrm{Pb} + {}^{4}_{2}\mathrm{He}$; nastane svinec-206.

### Primer 2: klikanje, ki se upočasni

Ob vzorcu joda-131 Geigerjev števec v zvočniku odda $320$ klikov na minuto (ozadje smo že odšteli). Razpolovni čas joda-131 je $8$ dni. Koliko klikov na minuto bomo slišali čez $24$ dni?

**Podatki:** $A_0 = 320$ klikov na minuto, $t_{1/2} = 8\,\mathrm{dni}$, $t = 24\,\mathrm{dni}$
**Iščemo:** hitrost klikanja $A$ po $24$ dneh

:::formula
$A = A_0 \cdot 2^{-t/t_{1/2}}$
:::

**Rešitev:**

1. Koliko razpolovnih časov je minilo: $\dfrac{t}{t_{1/2}} = \dfrac{24\,\mathrm{dni}}{8\,\mathrm{dni}} = 3$.
2. Po treh razpolovnih časih ostane $2^{-3} = \dfrac{1}{8}$ aktivnosti, ker se vsakič razpolovi.
3. $A = \dfrac{320}{8} = 40$ klikov na minuto.
4. Odgovor: slišali bomo $40$ klikov na minuto, osemkrat redkeje kot na začetku.

### Primer 3: koliko je stara koščena piščal

Arheologi izkopljejo piščal iz kosti. Ogljik v živi kosti ima aktivnost ogljika-14 približno $16$ razpadov na minuto na gram ogljika. V piščali izmerijo le $2$ razpada na minuto na gram. Razpolovni čas ogljika-14 je $5730$ let. Koliko je stara piščal?

**Podatki:** $A_0 = 16\,\mathrm{min^{-1}}$ na gram, $A = 2\,\mathrm{min^{-1}}$ na gram, $t_{1/2} = 5730\,\mathrm{let}$
**Iščemo:** starost $t$

:::formula
$A = A_0 \cdot 2^{-t/t_{1/2}}$, zato $\dfrac{A_0}{A} = 2^{t/t_{1/2}}$
:::

**Rešitev:**

1. Dokler žival živi, ogljik-14 iz hrane sproti nadomešča razpadlega. Ura začne teči ob smrti.
2. Kolikokrat se je aktivnost zmanjšala: $\dfrac{A_0}{A} = \dfrac{16}{2} = 8$.
3. $8 = 2^3$, torej so minili trije razpolovni časi: $\dfrac{t}{t_{1/2}} = 3$.
4. $t = 3 \cdot 5730 = 17190$ let.
5. Odgovor: piščal je stara približno $17\,000$ let.

### Primer 4 – zdaj ti: vezavna energija helija

Proton ima maso $1{,}00728\,\mathrm{u}$, nevtron $1{,}00866\,\mathrm{u}$, jedro helija-4 pa $4{,}00151\,\mathrm{u}$. Atomska enota mase je $1\,\mathrm{u} = 1{,}661\cdot10^{-27}\,\mathrm{kg}$. Izračunaj vezavno energijo jedra helija-4 v MeV.

**Podatki:** $m_p = 1{,}00728\,\mathrm{u}$; $m_n = 1{,}00866\,\mathrm{u}$; $m_\mathrm{He} = 4{,}00151\,\mathrm{u}$; $1\,\mathrm{u} = 1{,}661\cdot10^{-27}\,\mathrm{kg}$; $c = 3{,}00\cdot10^{8}\,\mathrm{m/s}$; $1\,\mathrm{eV} = 1{,}60\cdot10^{-19}\,\mathrm{J}$
**Iščemo:** vezavno energijo $W_v$ v MeV

:::formula
$\Delta m = 2m_p + 2m_n - m_\mathrm{He}$, nato $W_v = \Delta m \, c^2$
:::

**Rešitev:**

1. Helij-4 ima $2$ protona in $2$ nevtrona: $2 \cdot 1{,}00728 + 2 \cdot 1{,}00866 = 4{,}03188$ (v enotah u).
2. Masni primanjkljaj: $4{,}03188 - 4{,}00151 = 0{,}03037$ (v enotah u).
3. V kilogramih: $\Delta m = 0{,}03037 \cdot 1{,}661\cdot10^{-27}\,\mathrm{kg} \approx 5{,}04\cdot10^{-29}\,\mathrm{kg}$.
4. Izračunaj sam še $W_v$ v joulih in ga pretvori v MeV, nato preveri:

:::premisli
Koliko je $W_v$ in koliko je to na en nukleon?
---
$W_v = 5{,}04\cdot10^{-29}\,\mathrm{kg} \cdot (3{,}00\cdot10^{8}\,\mathrm{m/s})^2 \approx 4{,}54\cdot10^{-12}\,\mathrm{J}$. Delimo z $1{,}60\cdot10^{-19}\,\mathrm{J/eV}$ in dobimo $2{,}84\cdot10^{7}\,\mathrm{eV} \approx 28{,}4\,\mathrm{MeV}$. Na nukleon je to $28{,}4 / 4 = 7{,}1\,\mathrm{MeV}$, kar se ujema s stolpcem za He-4.
:::

## Pogoste napake

- **»Po dveh razpolovnih časih ni ničesar več.«** Učenec misli, da vsak razpolovni čas odvzame polovico *začetnega* števila. V resnici razpade polovica *preostalih* jeder, zato ostane $1/2$, $1/4$, $1/8$ in nikoli točno nič. Vsak razpolovni čas deli s $2$, ne odšteva.
- **Delež preveden v napačno število razpolovnih časov.** Ostala četrtina ne pomeni štirih razpolovnih časov, ampak dva, ker je $\tfrac14 = \left(\tfrac12\right)^2$. Vprašaj se: kolikokrat moram razpoloviti, da pridem do tega deleža?
- **Elektron iz ovojnice.** Pri razpadu $\beta^-$ elektron nastane v jedru, ko se nevtron spremeni v proton. Kdor misli, da odleti elektron iz ovojnice, ne razume, zakaj se vrstno število poveča za $1$ in nastane drug element.
- **Zamenjana števila pri razpadu $\alpha$.** Vrstno število se zmanjša za $2$, masno za $4$. Napaka »$Z - 4$« da napačen element. Pomaga, če se spomniš, kaj je delec $\alpha$: ${}^{4}_{2}\mathrm{He}$, zgoraj $4$, spodaj $2$.
- **»Jedrsko gorivo zgori kot premog« ali »masa se ohrani«.** V reaktorju ni kemijskega gorenja s kisikom. Produkti cepitve so močneje zvezani, zato imajo malo manjšo skupno maso. Ta razlika $\Delta m$ se sprosti kot energija $\Delta m \, c^2$.

## Povzetek

- Jedro: $Z$ protonov in nevtroni; zapis ${}^{A}_{Z}\mathrm{X}$ z masnim številom zgoraj in vrstnim spodaj; izotopi imajo enak $Z$.
- Razpad $\alpha$: odleti ${}^{4}_{2}\mathrm{He}$, masno število $-4$, $Z - 2$. Razpad $\beta^-$: nevtron $\rightarrow$ proton + elektron, $Z + 1$. Sevanje $\gamma$: foton, jedro ostane isti element.
- Pri zapisu razpada se ohranita vsota masnih in vsota vrstnih števil.
- Razpolovni čas $t_{1/2}$: v tem času razpade polovica jeder. $N = N_0 \cdot 2^{-t/t_{1/2}}$, enako za aktivnost $A$ (enota Bq).
- Masni primanjkljaj $\Delta m$ in vezavna energija $W_v = \Delta m \, c^2$; najtrdneje so zvezana jedra okoli železa.
- Energija se sprosti pri cepitvi težkih jeder (elektrarna) in pri zlivanju lahkih (zvezde): na eno jedro milijoni eV, pri kemijski reakciji le nekaj eV na molekulo.

## Drugače: Z analogijo

Vzemi $64$ kovancev in jih vrzi na mizo. Vse, ki so padli na cifro, odstrani: ti so »razpadli«. Preostale vrzi znova in spet odstrani cifre. Po prvem metu ti ostane okoli $32$ kovancev, po drugem okoli $16$, po tretjem okoli $8$.

En met je en razpolovni čas. Za posamezen kovanec ne veš, kdaj bo padel na cifro, za vse skupaj pa zelo dobro napoveš, koliko jih ostane. Kovanec si ne zapomni, kolikokrat je že preživel met, zato je verjetnost vsakič $1/2$. Prav tako jedro »ne ve«, kako staro je.

Podobno izzveni ton klavirske strune: v vsaki sekundi izgubi približno enak delež glasnosti, zato se nikoli ne odreže naenkrat.

## Drugače: Iz vsakdanjega življenja

- **Radon v kleti.** Radon-222 nastaja pri razpadu radija v tleh in ima razpolovni čas $3{,}8$ dni. V slabo prezračenih kleteh se nabere, zato prezračevanje zmanjša sevanje, ki ga vdihnemo.
- **Javljalnik dima.** V njem je malo americija-241, sevalca $\alpha$. Delci $\alpha$ ionizirajo zrak, da skozenj teče šibek tok; dim ga zmanjša in javljalnik zapiska. Delce $\alpha$ ustavi že ohišje.
- **Bolnišnica.** Jod-131 se nabira v ščitnici in jo od znotraj obseva. Zaradi razpolovnega časa $8$ dni po nekaj tednih skoraj izgine iz telesa.
- **Elektrarna Krško.** Toplota iz cepitve urana-235 segreva vodo, para poganja turbino. Termoelektrarna bi za enako elektriko pokurila več kot desettisočkrat večjo maso premoga, kot jedrska porabi urana.

## Preveri se

? Tri trditve veljajo za razpad $\alpha$, ena ne. Katera **ne** sodi zraven?
- Odleti helijevo jedro z dvema protonoma in dvema nevtronoma.
~ To velja: delec $\alpha$ je ${}^{4}_{2}\mathrm{He}$.
- Delce ustavi že list papirja.
~ To velja: delci $\alpha$ so težki in nabiti, zato hitro izgubijo energijo.
+ Vrstno število jedra se poveča za $1$.
- Masno število jedra se zmanjša za $4$.
~ To velja: delec $\alpha$ odnese štiri nukleone.
> Vrstno število se poveča za $1$ pri razpadu $\beta^-$. Pri razpadu $\alpha$ se zmanjša za $2$.

? Geigerjev števec ob vzorcu radona klikne $640$-krat na minuto. Razpolovni čas radona-222 je $3{,}8$ dni. Kolikokrat na minuto klikne čez $7{,}6$ dni?
- $0$
~ To dobiš, če misliš, da vsak razpolovni čas odvzame polovico začetne vrednosti. Razpade polovica preostalih jeder.
- $320$
~ To je stanje po enem razpolovnem času. Minila sta dva: $7{,}6 / 3{,}8 = 2$.
+ $160$
- $480$
~ $480 = 640 - 160$ je del, ki je v tem času izginil (tri četrtine). Vprašanje je, koliko ostane.
> $7{,}6\,\mathrm{dni}$ sta dva razpolovna časa: $640 \rightarrow 320 \rightarrow 160$ klikov na minuto.

? Zakaj se pri razpadu $\beta^-$ vrstno število jedra poveča za $1$?
- Ker atom izgubi en elektron iz ovojnice in postane pozitiven ion.
~ Elektron ne pride iz ovojnice in ion ni drug element. Spremeni se jedro.
+ Ker se v jedru nevtron spremeni v proton in elektron, elektron pa odleti.
- Ker jedro ujame proton iz okolice.
~ Jedro pri razpadu ničesar ne sprejme, ampak izseva. Proton nastane v jedru samem.
- Ker odleti foton, ki odnese negativni naboj.
~ Foton nima naboja; to je sevanje $\gamma$, ki $Z$ ne spremeni.
> Pri $\beta^-$ velja nevtron $\rightarrow$ proton + elektron. Protonov je en več, masno število ostane enako.

? Ana določa starost lesa. (1) Aktivnost ogljika-14 je padla s $16$ na $4$ razpade na minuto na gram. (2) To je četrtina začetne aktivnosti. (3) Četrtina pomeni štiri razpolovne čase. (4) Starost je $4 \cdot 5730 = 22920$ let. Kateri korak je napačen?
- Korak (1)
~ Podatke je prepisala pravilno.
- Korak (2)
~ $4/16 = 1/4$, to je res četrtina.
+ Korak (3)
- Korak (4)
~ Množenje je pravilno, a z napačnim številom razpolovnih časov iz prejšnjega koraka.
> $\tfrac14 = \left(\tfrac12\right)^2$, torej sta minila dva razpolovna časa. Les je star $2 \cdot 5730 = 11460$ let.

? Ko v jedrski elektrarni porabijo gorivo, ima vse, kar nastane, malo manjšo maso kot gorivo pred tem. Zakaj?
- Ker del urana zgori s kisikom in odide kot plin.
~ V reaktorju ni kemijskega gorenja. Energija pride iz jeder, ne iz vezi med atomi.
- Ker masa ostane enaka; energijo dajo nevtroni, ki jih dovajajo od zunaj.
~ Nevtroni le sprožijo cepitev. Energija izvira iz razlike mas pred cepitvijo in po njej.
+ Ker so jedra po cepitvi močneje zvezana; manjkajoča masa $\Delta m$ se sprosti kot energija $\Delta m \, c^2$.
> Srednje težka jedra imajo večjo vezavno energijo na nukleon kot uran. Pri prehodu se sprosti energija $\Delta m \, c^2$, okoli $200\,\mathrm{MeV}$ na cepitev.

:::simboli
N | število nerazpadlih jeder | N = N_0 \cdot 2^{-t/t_{1/2}} | – |
N_0 | začetno število jeder | | – |
Z | vrstno število | | – | število protonov v jedru; določa element
t | pretekli čas | | s | lahko tudi v dneh ali letih
t_{1/2} | razpolovni čas | | s | čas, v katerem razpade polovica jeder
A | aktivnost | A = A_0 \cdot 2^{-t/t_{1/2}} | Bq | pri zapisu ${}^{A}_{Z}\mathrm{X}$ pa masno število
A_0 | začetna aktivnost | | Bq |
\alpha | razpad alfa | | – | odleti jedro ${}^{4}_{2}\mathrm{He}$
W_v | vezavna energija jedra | W_v = \Delta m \, c^2 | J | pogosto v MeV
\Delta m | masni primanjkljaj | \Delta m = 2m_p + 2m_n - m_\mathrm{He} | kg | zveza velja za helij-4
c | hitrost svetlobe | | m/s | $3{,}00\cdot10^{8}\,\mathrm{m/s}$
m_p | masa protona | | u |
m_n | masa nevtrona | | u |
m_\mathrm{He} | masa jedra helija-4 | | u |
:::
