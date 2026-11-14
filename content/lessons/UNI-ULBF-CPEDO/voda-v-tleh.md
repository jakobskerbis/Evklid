---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Paradoks z vrta: v glinastih tleh s $25\,\%$ vode (po prostornini) paradižnik vene. V peščenih tleh z le $10\,\%$ vode isti paradižnik stoji pokonci. Več vode, a rastlina žejna?

Podoben paradoks pozna medicina. Brodolomec je obdan z morjem, pa vendar umira od žeje. Morska voda je tako slana, da telo za izločanje soli porabi več vode, kot jo je dobilo. Voda je tam, ni pa **dostopna**.

Pri tleh je vprašanje enako: ne koliko vode je v tleh, ampak kako močno jo tla držijo. Od tega je odvisno, ali bo korenina vodo sploh dobila, koliko časa bo njiva zdržala sušo in koliko vode prinese namakanje.

## Razlaga

**Slika: tla po močnem dežju.** Predstavljaj si prst, ki je po nalivu popolnoma namočena. Vse pore so polne vode, zraka ni. Sledimo ji, kako se suši:

```
 Ψ [kPa]   pF    stanje tal
      0     –    nasičena tla
           ↓     odteka gravitacijska voda
    −33    2,5   poljska kapaciteta
           ↓     rastlinam dostopna voda
  −1500    4,2   točka venenja
           ↓     nedostopna voda
   −10⁵    ≈ 6   zračno suha tla
```

Na levi je **vodni potencial** $\Psi$. Pove, kako močno tla »vlečejo« vodo nase. Nič pomeni prosto vodo v kozarcu. Bolj negativen potencial pomeni, da tla vodo drže močneje. Stolpec pF je isti podatek na logaritemski lestvici; razložimo ga na koncu.

**Prvi korak navzdol: gravitacijska voda.** Iz največjih por, širših od približno $10\,\mathrm{\mu m}$, voda v enem do treh dneh odteče v globino. Tla je ne morejo zadržati. Ko odtekanje praktično preneha, je v tleh največ vode, ki jo lahko obdržijo proti težnosti. Temu stanju rečemo **poljska kapaciteta** (PK). Ustreza potencialu od približno $-10$ do $-33\,\mathrm{kPa}$; za peščena tla se pogosto vzame $-10$, sicer $-33\,\mathrm{kPa}$.

**Drugi korak: voda, ki jo vzamejo korenine.** V srednjih porah, med približno $0{,}2$ in $10\,\mathrm{\mu m}$, voda ostane. Korenine jo s sesanjem počasi praznijo. Ožja kot je pora, močneje drži vodo, zato potencial pada.

**Konec dosega korenin: točka venenja.** Večina kmetijskih rastlin ne more ustvariti sesanja, močnejšega od približno $-1500\,\mathrm{kPa}$ ($-1{,}5\,\mathrm{MPa}$). Tedaj rastlina ovene in si niti čez noč ne opomore. To vsebnost vode imenujemo **točka (trajnega) venenja** (TV). Voda v najmanjših porah, pod približno $0{,}2\,\mathrm{\mu m}$, in voda v tankih ovojih okrog delcev ostane v tleh, a je rastlina ne doseže.

**Rastlinam dostopna voda** (RDV) je pas med obema mejama: voda, ki je ostala po odtekanju in je tla še ne držijo premočno.

:::premisli
Glina ima veliko več drobnih por kot pesek. Napovej: ali ima višjo ali nižjo točko venenja (v $\%$ vode)? Zakaj?
---
Višjo. Drobne pore in velika površina glinenih delcev drže veliko vode močneje kot $-1500\,\mathrm{kPa}$. Ta voda je v tleh, korenina pa je ne izvleče. Zato rastlina v glini vene že pri $25\,\%$ vode, v pesku pa šele pod okoli $5\,\%$.
:::

**Isto v tabeli.** Tekstura določa delež por posamezne velikosti, zato se tla zelo razlikujejo (okvirne vrednosti, volumski delež vode):

| Tla | PK | TV | RDV |
|---|---|---|---|
| pesek | $12\,\%$ | $5\,\%$ | $7\,\%$ |
| ilovica | $32\,\%$ | $14\,\%$ | $18\,\%$ |
| glina | $44\,\%$ | $28\,\%$ | $16\,\%$ |

Pesek ima malo vode in skoraj vsa je dostopna. Glina ima največ vode, vendar jo velik del drži tako trdno, da je rastlinam nedostopna.

:::premisli
Na vseh treh tleh raste koruza z enako globokimi koreninami, vsa tla so na začetku na PK. Dolgo ne dežuje. Sosed stavi na glino, ker ima največ vode. Na katerih tleh bo koruza res zdržala najdlje in kje se sosed zmoti?
---
Na ilovici, ker ima največjo RDV ($18\,\%$). Glina ima sicer največ vode, a ko vsebnost pade na $28\,\%$, je preostanek nedostopen. Odloča razlika PK − TV, ne PK.
:::

**Simboli na koncu.** Vodni potencial je potencialna energija vode na enoto prostornine glede na čisto prosto vodo pri referenčni višini in tlaku. Enota je $\mathrm{J/m^3} = \mathrm{Pa}$. Sestavljen je iz delov:

$$\Psi = \Psi_m + \Psi_o + \Psi_g$$

- $\Psi_m$ – **matrični potencial**: privlak vode na površine delcev in kapilarnost v porah. V nenasičenih tleh je glavni del.
- $\Psi_o$ – **osmotski potencial**: zaradi raztopljenih soli. Šteje, kjer je polprepustna membrana, na primer na korenini.
- $\Psi_g$ – **gravitacijski potencial**: zaradi višine.

Voda teče od višjega (manj negativnega) potenciala k nižjemu: tla ($-0{,}1\,\mathrm{MPa}$) → korenina → list → zrak (okrog $-100\,\mathrm{MPa}$).

Sesanje pogosto podajamo kot višino vodnega stolpca $h$ v centimetrih ($10\,\mathrm{cm} \approx 1\,\mathrm{kPa}$) in njen logaritem $\mathrm{pF} = \log_{10} h$. Za $-33\,\mathrm{kPa}$ je $h \approx 336\,\mathrm{cm}$ in $\mathrm{pF} \approx 2{,}5$; za $-1500\,\mathrm{kPa}$ je $h \approx 15\,300\,\mathrm{cm}$ in $\mathrm{pF} \approx 4{,}2$.

Volumski delež vode $\theta$ dobiš iz masnega $w$ z volumsko gostoto tal $\rho_v$ (masa suhih tal na prostornino, pore vštete): $\theta = w \cdot \rho_v/\rho_{\text{voda}}$. Zaloga dostopne vode v plasti debeline $z$ je

$$\mathrm{RDV} = (\theta_{PK} - \theta_{TV}) \cdot z.$$

Če $z$ vstaviš v milimetrih, dobiš milimetre vode; $1\,\mathrm{mm}$ je $1\,\mathrm{L}$ na $\mathrm{m^2}$.

## Rešeni primeri

### Primer 1: zaloga vode v ilovici

Ilovnata njiva ima pri poljski kapaciteti $32\,\%$ vode, pri točki venenja $14\,\%$ (volumsko). Korenine sežejo $60\,\mathrm{cm}$ globoko. Koliko dostopne vode je v koreninskem sloju, ko so tla na PK?

**Podatki:** $\theta_{PK} = 0{,}32$, $\theta_{TV} = 0{,}14$, $z = 60\,\mathrm{cm} = 600\,\mathrm{mm}$
**Iščemo:** RDV v mm

:::formula
$\mathrm{RDV} = (\theta_{PK} - \theta_{TV}) \cdot z$
:::

**Rešitev:**

1. Razlika deležev: $0{,}32 - 0{,}14 = 0{,}18$.
2. Pomnožimo z debelino v mm, da dobimo višino vode: $0{,}18 \cdot 600\,\mathrm{mm} = 108\,\mathrm{mm}$.
3. Odgovor: v koreninskem sloju je $108\,\mathrm{mm}$ dostopne vode, to je $108\,\mathrm{L}$ na vsak kvadratni meter.

### Primer 2: iz masnih deležev

V laboratoriju so izmerili masni delež vode pri PK $25\,\%$ in pri TV $11\,\%$. Volumska gostota tal je $1{,}4\,\mathrm{g/cm^3}$. Koliko dostopne vode je v plasti $40\,\mathrm{cm}$ in koliko dni zadošča, če rastline porabijo $4\,\mathrm{mm}$ na dan?

**Podatki:** $w_{PK} = 0{,}25$, $w_{TV} = 0{,}11$, $\rho_v = 1{,}4\,\mathrm{g/cm^3}$, $\rho_{\text{voda}} = 1\,\mathrm{g/cm^3}$, $z = 400\,\mathrm{mm}$, poraba $4\,\mathrm{mm/dan}$
**Iščemo:** RDV v mm in število dni

:::formula
$\theta = w \cdot \dfrac{\rho_v}{\rho_{\text{voda}}}$, $\quad \mathrm{RDV} = (\theta_{PK} - \theta_{TV}) \cdot z$, $\quad t = \dfrac{\mathrm{RDV}}{\text{poraba}}$
:::

**Rešitev:**

1. Masni delež pretvorimo v volumskega, ker zalogo merimo v prostornini: $\theta_{PK} = 0{,}25 \cdot 1{,}4 = 0{,}35$.
2. $\theta_{TV} = 0{,}11 \cdot 1{,}4 = 0{,}154$.
3. Razlika: $0{,}35 - 0{,}154 = 0{,}196$.
4. $\mathrm{RDV} = 0{,}196 \cdot 400\,\mathrm{mm} = 78{,}4\,\mathrm{mm}$.
5. Čas: $78{,}4/4 = 19{,}6$ dneva.
6. Odgovor: v plasti je $78{,}4\,\mathrm{mm}$ dostopne vode, kar brez dežja zadošča za slabih $20$ dni.

### Primer 3 (težji): fiziološka raztopina v tleh

V bolnišnici dajejo infuzijo fiziološke raztopine, $0{,}9\,\%$ NaCl ($0{,}154\,\mathrm{mol/L}$). Njen osmotski potencial je blizu potenciala krvne plazme, zato celice ne nabreknejo in se ne skrčijo. Kaj bi se zgodilo, če bi imela talna raztopina pri PK enako koncentracijo soli? Vzemi $T = 293\,\mathrm{K}$ in matrični potencial $-33\,\mathrm{kPa}$.

**Podatki:** $c = 0{,}154\,\mathrm{mol/L} = 154\,\mathrm{mol/m^3}$, NaCl razpade na $i = 2$ iona, $R = 8{,}314\,\mathrm{J/(mol\,K)}$, $T = 293\,\mathrm{K}$, $\Psi_m = -33\,\mathrm{kPa}$, točka venenja $-1500\,\mathrm{kPa}$
**Iščemo:** osmotski potencial $\Psi_o$ in skupni potencial na PK

:::formula
$\Psi_o = -i\,c\,R\,T$, $\quad \Psi = \Psi_m + \Psi_o$
:::

**Rešitev:**

1. Koncentracija delcev: $2 \cdot 154 = 308\,\mathrm{mol/m^3}$, ker ima vsak NaCl dva iona.
2. $\Psi_o = -308 \cdot 8{,}314 \cdot 293\,\mathrm{Pa} \approx -750\,000\,\mathrm{Pa} = -750\,\mathrm{kPa}$.
3. Skupaj: $\Psi \approx -33 - 750 = -783\,\mathrm{kPa}$.
4. Primerjava: $783/1500 \approx 0{,}52$, torej je voda že pri polni poljski kapaciteti več kot pol poti do točke venenja.
5. Odgovor: korenina bi dobila vodo težko, kot bolnik, ki pije slano vodo. Zato so zasoljena tla in pregnojene gredice nevarne za rastline, čeprav so mokre.

### Primer 4: zdaj ti (koliko zaliti)

Vrt ima pri PK $32\,\%$ vode. Tenziometer in vzorec pokažeta, da je zdaj v zgornjih $30\,\mathrm{cm}$ le $20\,\%$ vode. Koliko litrov na kvadratni meter moraš zaliti, da bo plast spet na PK?

**Podatki:** $\theta_{PK} = 0{,}32$, $\theta_{\text{zdaj}} = 0{,}20$, $z = 300\,\mathrm{mm}$
**Iščemo:** potrebna količina vode v $\mathrm{L/m^2}$

:::formula
$\text{potrebna voda} = (\theta_{PK} - \theta_{\text{zdaj}}) \cdot z$
:::

**Rešitev:**

1. Do PK manjka $0{,}32 - 0{,}20 = 0{,}12$ prostornine.
2. Pomnoži z debelino plasti in pretvori v litre sam, nato preveri:

:::premisli
Koliko vode je treba zaliti?
---
$0{,}12 \cdot 300\,\mathrm{mm} = 36\,\mathrm{mm}$, kar je $36\,\mathrm{L/m^2}$. Več ne pomaga: presežek bi kot gravitacijska voda odtekel v globino.
:::

## Pogoste napake

- **»Več vode v tleh, več vode za rastlino.«** Glina ima pri TV še $28\,\%$ vode, ki je rastlina ne doseže. Za rastlino šteje razlika PK − TV, ne skupna vsebnost.
- **PK je največja vsebnost vode.** Največ vode je v nasičenih tleh. Gravitacijska voda pri PK že odteče; dokler stoji v porah, rastlinam manjka zraka.
- **Masni delež kot volumski.** Če vstaviš $w = 25\,\%$ neposredno v formulo za RDV, dobiš premalo vode. Najprej pomnoži z volumsko gostoto tal.
- **Napačna smer potenciala.** Bolj negativen potencial ni »manj sesanja«, ampak več. Voda teče od $-33\,\mathrm{kPa}$ proti $-1500\,\mathrm{kPa}$, iz vlažnega v suho.
- **Vsa voda pri PK je dostopna.** Kdor zalogo računa kot $\theta_{PK} \cdot z$, pozabi odšteti vodo pod točko venenja in precenjuje, koliko časa bo rastlina zdržala.

## Povzetek

- Vodni potencial $\Psi$ (v kPa ali MPa) pove, kako močno tla držijo vodo; prosta čista voda ima $0$. Voda teče proti bolj negativnemu $\Psi$.
- $\Psi = \Psi_m + \Psi_o + \Psi_g$: matrični (pore, površine), osmotski (soli), gravitacijski.
- Poljska kapaciteta: vsebnost vode po odteku gravitacijske vode, $-10$ do $-33\,\mathrm{kPa}$ (pF $\approx 2$–$2{,}5$).
- Točka venenja: $-1500\,\mathrm{kPa}$ (pF $\approx 4{,}2$), rastlina trajno ovene.
- Rastlinam dostopna voda: $\mathrm{RDV} = (\theta_{PK} - \theta_{TV}) \cdot z$; $1\,\mathrm{mm} = 1\,\mathrm{L/m^2}$. Masni delež pretvori z $\theta = w\,\rho_v/\rho_{\text{voda}}$.
- Pesek: malo vode, skoraj vsa dostopna. Glina: veliko vode, velik del nedostopen. Ilovica: največ dostopne vode.
- Soli znižajo $\Psi_o$ in zmanjšajo dostopnost tudi v mokrih tleh.

## Drugače: Z analogijo

Tla so kot kuhinjska goba.

- Gobo potopiš v vodo in dvigneš: nekaj časa kaplja. To je gravitacijska voda.
- Ko neha kapljati, je goba na »poljski kapaciteti«.
- Gobo stisneš z roko in iztisneš še precej vode. Tvoja roka je korenina, iztisnjena voda je dostopna voda.
- Tudi po najmočnejšem stisku je goba vlažna. Te vode roka ne iztisne: to je voda pod točko venenja.

Goba z drobnimi porami (glina) je po stisku še zelo mokra. Goba z velikimi luknjami (pesek) malo vode sploh zadrži, a jo skoraj vso izpusti.

## Drugače: Iz vsakdanjega življenja

Lonček z rožo zaliješ do vrha. Voda priteče v podstavek: to je gravitacijska voda, ki jo je treba izliti, sicer korenine nimajo zraka.

Če rože nekaj dni ne zaliješ, listi popoldne povesijo glavo, zvečer pa se spet dvignejo. Rastlina je blizu meje, ne pa še na njej. Ko se ne dvignejo niti čez noč, so tla na točki venenja.

V vrtu po dolgem dežju dva dni ne moreš kopati, potem je prst ravno prav vlažna: odtekla je gravitacijska voda, tla so na poljski kapaciteti. Tenziometer, zapičen v gredico, to pokaže kot sesanje okoli $10$ do $30\,\mathrm{kPa}$.

## Preveri se

? Kmet njivo dobro namoči in počaka dva dni, da voda ne odteka več. Kateri vsebnosti vode to ustreza?
- Nasičenju.
~ Pri nasičenju so polne vse pore, tudi največje. V dveh dneh je ta gravitacijska voda že odtekla.
+ Poljski kapaciteti.
- Točki venenja.
~ Točka venenja je spodnja meja dostopne vode, ko korenine ne morejo več črpati. Po namakanju so tla daleč od nje.
> Poljska kapaciteta je vsebnost vode, ki ostane, ko gravitacijska voda odteče, običajno po enem do treh dneh.

? Razvrsti od najvišjega (najmanj negativnega) do najnižjega vodnega potenciala na sončen dan: list, zrak, tla, korenina.
- zrak > list > korenina > tla
~ To je obratni vrstni red. Voda teče od višjega k nižjemu potencialu, torej iz tal proti zraku, ne obratno.
+ tla > korenina > list > zrak
- korenina > tla > list > zrak
~ Če bi imela korenina višji potencial od tal, bi voda tekla iz korenine v tla.
> Voda teče navzdol po potencialu: tla (okrog $-0{,}1\,\mathrm{MPa}$) → korenina → list → zrak (okrog $-100\,\mathrm{MPa}$).

? Kaj se zgodi, če tla močno pregnojimo z mineralnim gnojilom, vsebnost vode pa ostane enaka?
- Nič, ker je vode enako kot prej.
~ Šteje potencial, ne samo količina vode. Soli znižajo osmotski potencial.
+ Skupni vodni potencial pade, rastlina težje črpa vodo in lahko vene v mokrih tleh.
- Rastlina dobi več vode, ker gnojilo vodo pritegne v koren.
~ Soli vodo pritegnejo k sebi, torej v tla, ne v korenino. To je isti razlog, zakaj morska voda ne odžeja.
> Raztopljene soli dodajo negativen $\Psi_o$. Ker korenina deluje kot polprepustna membrana, mora rastlina premagati skupni potencial.

? Plast je debela $30\,\mathrm{cm}$, PK je $28\,\%$, TV $12\,\%$ (volumsko). Koliko dostopne vode je v njej?
- $84\,\mathrm{mm}$
~ To je vsa voda pri PK ($0{,}28 \cdot 300$). Vode pod točko venenja rastlina ne doseže, zato jo odštej.
- $4{,}8\,\mathrm{mm}$
~ Debelino si vstavil v centimetrih. Za milimetre vode jo vstavi v milimetrih: $300\,\mathrm{mm}$.
+ $48\,\mathrm{mm}$
- $36\,\mathrm{mm}$
~ To je voda pri točki venenja ($0{,}12 \cdot 300$), torej ravno nedostopni del.
> $\mathrm{RDV} = (0{,}28 - 0{,}12) \cdot 300\,\mathrm{mm} = 48\,\mathrm{mm}$, to je $48\,\mathrm{L/m^2}$.

? Merilnik vlage v tleh pokaže pF $3$. Koliko je približno matrični potencial?
- $-9{,}8\,\mathrm{kPa}$
~ To ustreza pF $2$ ($100\,\mathrm{cm}$). Pri pF $3$ je stolpec $1000\,\mathrm{cm}$.
+ $-98\,\mathrm{kPa}$
- $-980\,\mathrm{kPa}$
~ To bi bil stolpec $10\,000\,\mathrm{cm}$, torej pF $4$.
> $h = 10^3\,\mathrm{cm} = 10\,\mathrm{m}$ vodnega stolpca, $\Psi = -\rho g h = -1000 \cdot 9{,}81 \cdot 10\,\mathrm{Pa} \approx -98\,\mathrm{kPa}$, kar je med PK in TV.

:::simboli
\Psi | vodni potencial | \Psi = \Psi_m + \Psi_o + \Psi_g | kPa | voda teče k nižjemu (bolj negativnemu)
\Psi_m | matrični potencial | | kPa | privlak delcev in kapilarnost; pri PK okrog −33 kPa
\Psi_o | osmotski potencial | \Psi_o = -i\,c\,R\,T | kPa | zaradi raztopljenih soli
\Psi_g | gravitacijski potencial | | kPa | zaradi višine
\mathrm{RDV} | rastlinam dostopna voda | \mathrm{RDV} = (\theta_{PK} - \theta_{TV}) \cdot z | mm | 1 mm vode je 1 L na m²
\theta | volumski delež vode v tleh | \theta = w \cdot \dfrac{\rho_v}{\rho_{\text{voda}}} | –
\theta_{PK} | volumski delež vode pri poljski kapaciteti | | –
\theta_{TV} | volumski delež vode pri točki venenja | | –
\theta_{\text{zdaj}} | trenutni volumski delež vode | | –
z | debelina plasti tal | | mm
w | masni delež vode v tleh | | –
\rho_v | volumska gostota tal | | g/cm^3 | masa suhih tal na prostornino s porami
\rho_{\text{voda}} | gostota vode | | g/cm^3 | 1 g/cm³
t | čas, za katerega zadošča zaloga vode | t = \dfrac{\mathrm{RDV}}{\text{poraba}} | dan
i | število ionov iz ene formulske enote | | – | NaCl: i = 2
c | množinska koncentracija soli | | mol/m^3 | 1 mol/L = 1000 mol/m³
R | splošna plinska konstanta | | J/(mol K) | 8,314 J/(mol K)
T | absolutna temperatura | | K
:::
