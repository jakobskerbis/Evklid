---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ana Kos skrbi za varnost in zdravje pri delu v avtobusnem prevozniškem podjetju. Januarja dobi tri pritožbe voznikov z linije čez Korensko sedlo. Vsi pravijo isto: po nekaj urah vožnje jih pečejo oči, ustnice pokajo, zjutraj pa se notranja stran vetrobranskega stekla orosi.

Na zemljevidu proge si Ana označi postanke in temperature. Zunaj je okoli $0\,^\circ\mathrm{C}$ in megleno vlažno, $80\,\%$. V kabini je prijetnih $22\,^\circ\mathrm{C}$. Kako je lahko zrak v kabini suh, če je zunanji zrak skoraj nasičen z vodo? In če naj vgradi vlažilnik: koliko vode na uro mora dodati?

Za odgovor potrebuje drug zemljevid: **Mollierov diagram** vlažnega zraka. Na njem vsako stanje zraka postane točka, vsaka sprememba pa pot med dvema točkama.

## Razlaga

Začni s tabelo. Pove, koliko vodne pare lahko zrak pri dani temperaturi največ sprejme, preden se para začne kondenzirati. Takemu zraku rečemo **nasičen**. Vrednosti veljajo pri normalnem zračnem tlaku $101{,}3\,\mathrm{kPa}$.

| $t$ [°C] | $p_s$ [Pa] | $\rho_s$ [g/m³] | $x_s$ [g/kg] |
|---|---|---|---|
| 0 | 611 | 4,85 | 3,77 |
| 5 | 872 | 6,80 | 5,40 |
| 10 | 1228 | 9,40 | 7,63 |
| 20 | 2339 | 17,3 | 14,7 |
| 22 | 2645 | 19,4 | 16,7 |
| 25 | 3169 | 23,0 | 20,1 |
| 30 | 4246 | 30,4 | 27,2 |

Preberi stolpce od zgoraj navzdol. Pri vsakih $10\,^\circ\mathrm{C}$ se največja količina pare približno podvoji. Topel zrak je torej kot večja posoda.

Drugi stolpec je **nasičeni parni tlak** $p_s$: delni tlak vodne pare v nasičenem zraku. **Absolutna vlažnost** $\rho_v$ je masa pare v enem kubičnem metru zraka; tretji stolpec je njena največja vrednost $\rho_s$. Četrti stolpec je največja **vsebnost vlage** $x_s$: grami pare na kilogram *suhega* zraka. Obe zadnji količini povesta, koliko vode je v zraku. Za račune z ogrevanjem je priročnejša $x$, ker se pri segrevanju zrak razširi in se $\rho_v$ spremeni, masa suhega zraka in pare pa ne.

**Relativna vlažnost** $\varphi$ pove, kako polna je posoda: koliko pare je v zraku glede na največjo možno količino pri isti temperaturi. Zunanji zrak na Anini progi ima $\varphi = 80\,\%$ pri $0\,^\circ\mathrm{C}$. V tabeli vidiš $x_s = 3{,}77\,\mathrm{g/kg}$, zato je v njem približno $0{,}8 \cdot 3{,}77 \approx 3{,}0$ grama pare na kilogram suhega zraka.

:::premisli
Ta zrak ventilator potegne v kabino in ga grelnik segreje na $22\,^\circ\mathrm{C}$. Vode ne doda in ne odvzame. Napovej: bo relativna vlažnost ostala $80\,\%$, narasla ali padla? Približno na koliko?
---
Pade na približno $18\,\%$. Vode je še vedno okoli $3{,}0\,\mathrm{g/kg}$, posoda pa je zdaj velika $16{,}7\,\mathrm{g/kg}$. Zato vozniki čutijo suh zrak, čeprav je zunaj vlažno.
:::

Zdaj obrni smer. Zrak ohlajaš, količina pare ostane enaka, posoda pa se manjša. Pri neki temperaturi je posoda ravno polna in $\varphi = 100\,\%$. To temperaturo imenujemo **rosišče**. Pod rosiščem se odvečna para kondenzira v kapljice: na hladni šipi, v megli ali kot rosa na travi.

Vse to združuje **Mollierov diagram** ($h$–$x$ diagram). Beri ga kot zemljevid:

- **Vodoravna os** (»zemljepisna dolžina«) je vsebnost vlage $x$ v $\mathrm{g/kg}$. Bolj desno pomeni več vode.
- **Navpična os** (»zemljepisna širina«) je temperatura $t$. Črte enake temperature (**izoterme**) so skoraj vodoravne, proti desni se rahlo dvigajo.
- **Krivulje stalne relativne vlažnosti** se pahljačasto razprejo iz spodnjega levega kota. Zgoraj levo je suh zrak, spodnja krivulja je $\varphi = 100\,\%$.
- Krivulja $\varphi = 100\,\%$ je **obala**. Desno pod njo je **območje megle**: tam je del vode v kapljicah.
- Poševne vzporedne črte, ki padajo proti desni, so črte stalne **entalpije** $h$: energije vlažnega zraka na kilogram suhega zraka.

Vsak proces je pot po tem zemljevidu:

| proces | smer na diagramu | $x$ | $\varphi$ |
|---|---|---|---|
| segrevanje | navpično gor | enak | pade |
| ohlajanje nad rosiščem | navpično dol | enak | naraste |
| ohlajanje pod rosiščem | dol do obale, nato po njej | pade | $100\,\%$ |
| vlaženje s paro | skoraj vodoravno desno | naraste | naraste |

Mešanje dveh zračnih tokov je ravna črta med njunima točkama. Mešanica leži bližje toku z večjo maso.

:::premisli
Pozimi izdihneš topel, skoraj nasičen zrak v mrzel zunanji zrak. Na diagramu poveži obe točki z ravno črto. Zakaj se pred ustmi pojavi meglica?
---
Obala $\varphi = 100\,\%$ je ukrivljena: proti desni postaja vse bolj položna. Zato ravna črta med toplo nasičeno točko in mrzlo točko vmes zaide pod obalo, v območje megle. Mešanica ima pri svoji temperaturi več vode, kot je zrak lahko sprejme, in del pare se kondenzira v drobne kapljice.
:::

Šele zdaj zapiši oznake. Relativna vlažnost je razmerje delnega tlaka pare $p_v$ in nasičenega tlaka pri isti temperaturi:

$$\varphi = \frac{p_v}{p_s}$$

Približno enako je razmerje $\rho_v / \rho_s$. Vsebnost vlage pri skupnem tlaku $p$ izračunaš kot

$$x = 0{,}622 \, \frac{p_v}{p - p_v}$$

Število $0{,}622$ je razmerje molskih mas vode in suhega zraka ($18/29$). Entalpija vlažnega zraka v $\mathrm{kJ/kg}$ suhega zraka, s $t$ v $^\circ\mathrm{C}$ in $x$ v $\mathrm{kg/kg}$, je

$$h = 1{,}005\, t + x\,(2501 + 1{,}86\, t)$$

Prvi člen je segrevanje suhega zraka, drugi pa izparilna toplota vode in segrevanje pare. Zrak v Anini kabini ima pri $22\,^\circ\mathrm{C}$ in $x = 0{,}00302$ entalpijo približno $29{,}8\,\mathrm{kJ/kg}$.

## Rešeni primeri

### Primer 1: hotelska soba na postanku

Na postanku v Trbižu Ana preveri sobo za voznike. Merilnik pokaže $20\,^\circ\mathrm{C}$ in absolutno vlažnost $8{,}65\,\mathrm{g/m^3}$. Kolikšna je relativna vlažnost?

**Podatki:** $t = 20\,^\circ\mathrm{C}$, $\rho_v = 8{,}65\,\mathrm{g/m^3}$, iz tabele $\rho_s(20\,^\circ\mathrm{C}) = 17{,}3\,\mathrm{g/m^3}$
**Iščemo:** relativno vlažnost $\varphi$

:::formula
$\varphi \approx \dfrac{\rho_v}{\rho_s}$
:::

**Rešitev:**

1. Iz tabele vzameš največjo absolutno vlažnost pri $20\,^\circ\mathrm{C}$, ker relativna vlažnost vedno primerja z nasičenim zrakom pri *isti* temperaturi.
2. $\varphi = \dfrac{8{,}65}{17{,}3} = 0{,}5$.
3. Odgovor: relativna vlažnost je $50\,\%$, kar je v območju, ki ga ljudje doživljajo kot prijetno (približno $40$ do $60\,\%$).

### Primer 2: zrak z gorske ceste v kabini

Zunanji zrak ima $0\,^\circ\mathrm{C}$ in $\varphi_1 = 80\,\%$. Grelnik ga segreje na $22\,^\circ\mathrm{C}$. Kolikšni sta vsebnost vlage in nova relativna vlažnost? Opiši pot na Mollierovem diagramu.

**Podatki:** $t_1 = 0\,^\circ\mathrm{C}$, $\varphi_1 = 0{,}80$, $t_2 = 22\,^\circ\mathrm{C}$, $p = 101\,325\,\mathrm{Pa}$, iz tabele $p_s(0\,^\circ\mathrm{C}) = 611\,\mathrm{Pa}$, $p_s(22\,^\circ\mathrm{C}) = 2645\,\mathrm{Pa}$
**Iščemo:** vsebnost vlage $x$ in relativno vlažnost $\varphi_2$

:::formula
$p_v = \varphi_1 \, p_s(t_1)$, $\quad x = 0{,}622\,\dfrac{p_v}{p - p_v}$, $\quad \varphi_2 = \dfrac{p_v}{p_s(t_2)}$
:::

**Rešitev:**

1. Delni tlak pare zunaj: $p_v = 0{,}80 \cdot 611 = 488{,}8$ paskala.
2. Vsebnost vlage: $x = 0{,}622 \cdot \dfrac{488{,}8}{101\,325 - 488{,}8} \approx 0{,}00302$, to je $3{,}02\,\mathrm{g/kg}$.
3. Grelnik vode ne doda, zato ostaneta $x$ in $p_v$ enaka. Na diagramu se točka premakne navpično navzgor.
4. $\varphi_2 = \dfrac{488{,}8}{2645} \approx 0{,}185$.
5. Odgovor: vsebnost vlage ostane $3{,}0\,\mathrm{g/kg}$, relativna vlažnost pa pade na približno $18\,\%$. Na diagramu točka iz bližine obale navpično prečka pahljačo krivulj do skoraj $\varphi = 20\,\%$.

### Primer 3: koliko vode za vlažilnik

Ana želi v kabini $22\,^\circ\mathrm{C}$ in $\varphi = 40\,\%$. Ventilator dovaja $300\,\mathrm{m^3/h}$ zunanjega zraka iz primera 2 (gostota suhega zraka približno $1{,}2\,\mathrm{kg/m^3}$). Koliko vode na uro mora dodati parni vlažilnik?

**Podatki:** $t_2 = 22\,^\circ\mathrm{C}$, $\varphi_3 = 0{,}40$, $p_s(22\,^\circ\mathrm{C}) = 2645\,\mathrm{Pa}$, $x_1 = 3{,}02\,\mathrm{g/kg}$, $V = 300\,\mathrm{m^3/h}$, $\rho = 1{,}2\,\mathrm{kg/m^3}$, $p = 101\,325\,\mathrm{Pa}$
**Iščemo:** masni tok vode $m_w$ v $\mathrm{kg/h}$

:::formula
$x_3 = 0{,}622\,\dfrac{\varphi_3 p_s}{p - \varphi_3 p_s}$, $\quad m_w = \rho V \,(x_3 - x_1)$
:::

**Rešitev:**

1. Ciljni delni tlak pare: $0{,}40 \cdot 2645 = 1058$ paskalov.
2. Ciljna vsebnost vlage: $x_3 = 0{,}622 \cdot \dfrac{1058}{101\,325 - 1058} \approx 0{,}00656$, to je $6{,}56\,\mathrm{g/kg}$.
3. Vsak kilogram suhega zraka potrebuje $6{,}56 - 3{,}02 = 3{,}54$ grama vode. Na diagramu je to pot skoraj vodoravno desno od točke iz primera 2.
4. Masni tok suhega zraka: $1{,}2 \cdot 300 = 360$ kilogramov na uro.
5. $m_w = 360 \cdot 3{,}54 = 1274{,}4$ grama na uro.
6. Odgovor: vlažilnik mora dodati približno $1{,}3\,\mathrm{kg}$ vode na uro, kar je več kot liter na uro vožnje.

### Primer 4: zdaj ti

Ko je zrak v kabini na $22\,^\circ\mathrm{C}$ in $40\,\%$, je vetrobransko steklo ob robu ohlajeno na $5\,^\circ\mathrm{C}$. Se bo orosilo?

**Podatki:** $p_v = 1058\,\mathrm{Pa}$ (iz primera 3), temperatura stekla $5\,^\circ\mathrm{C}$, iz tabele $p_s(5\,^\circ\mathrm{C}) = 872\,\mathrm{Pa}$
**Iščemo:** ali je steklo pod rosiščem

:::formula
Steklo se orosi, če je $p_v > p_s(t_{\text{steklo}})$.
:::

**Rešitev:**

1. Ob steklu se zrak ohladi, $p_v$ pa ostane enak, ker vode ne izgubi, dokler ne doseže rosišča.
2. Primerjaj $p_v$ s $p_s$ pri $5\,^\circ\mathrm{C}$ in odloči.

:::premisli
Kaj dobiš? Med katerima temperaturama iz tabele je rosišče?
---
$1058\,\mathrm{Pa} > 872\,\mathrm{Pa}$, zato se steklo orosi. Rosišče je med $5$ in $10\,^\circ\mathrm{C}$ (pri $10\,^\circ\mathrm{C}$ je $p_s = 1228\,\mathrm{Pa}$), približno $8\,^\circ\mathrm{C}$. Zato mora biti steklo ogrevano ali pihano s suhim zrakom.
:::

## Pogoste napake

- **Ogrevanje ne ohrani relativne vlažnosti.** Kdor misli, da ostane $\varphi = 80\,\%$, ker vode nismo dodali, zamenja količino vode s polnostjo posode. Enaka ostane $x$; $\varphi$ pade, ker $p_s$ hitro narašča s temperaturo.
- **»Topel zrak je bolj suh, ker ima manj vode.«** Topel zrak ima pogosto enako ali več vode, a večjo zmogljivost. Suhost, ki jo čutiš, je nizka $\varphi$, ne majhna $x$.
- **Primerjava z napačno temperaturo.** Pri računu $\varphi$ deliš z nasičeno vrednostjo pri temperaturi *tega* zraka, ne pri zunanji ali kakšni drugi.
- **Zamenjava $\rho_v$ in $x$.** Prva je v $\mathrm{g/m^3}$, druga v $\mathrm{g/kg}$ suhega zraka. Številki sta podobni, a ju ne mešaš v isti enačbi; Mollierov diagram uporablja $x$.
- **Segrevanje kot vodoravna pot.** Na Mollierovem diagramu je temperatura navpična os, zato segrevanje brez dodajanja vode poteka navpično; vodoravno se premakneš, ko spremeniš $x$.

## Povzetek

- Absolutna vlažnost $\rho_v$ (g pare na m³ zraka) in vsebnost vlage $x$ (g pare na kg suhega zraka) povesta, koliko vode je v zraku.
- Relativna vlažnost $\varphi = p_v/p_s$ pove, kako blizu nasičenja je zrak; $p_s$ se na vsakih $10\,^\circ\mathrm{C}$ približno podvoji.
- Segrevanje ohrani $x$, $\varphi$ pa pade; ohlajanje do rosišča dvigne $\varphi$ na $100\,\%$, pod njim se para kondenzira.
- $x = 0{,}622\,p_v/(p - p_v)$; $h = 1{,}005\,t + x(2501 + 1{,}86\,t)$.
- Mollierov ($h$–$x$) diagram: $x$ vodoravno, $t$ navpično, krivulje $\varphi$ in poševne črte $h$; segrevanje je navpična pot, vlaženje s paro skoraj vodoravna, mešanje ravna črta.
- Za ugodje na delovnem mestu je primerna relativna vlažnost približno $40$ do $60\,\%$.

## Drugače: Z analogijo

Zrak je avtobus, molekule vodne pare so potniki.

- Število potnikov je vsebnost vlage $x$.
- Število sedežev je $x_s$ in je odvisno od temperature: topel zrak je dolg zgibni avtobus, mrzel zrak je kombi.
- Zasedenost sedežev v odstotkih je relativna vlažnost $\varphi$.

Ko zunanji zrak segreješ, potnike iz kombija prestaviš v zgibni avtobus. Potnikov je enako, sedežev je veliko več, zato je avtobus skoraj prazen: $\varphi$ pade z $80$ na $18\,\%$. Ko zrak ohlajaš, se avtobus manjša. Rosišče je trenutek, ko so vsi sedeži zasedeni. Če se avtobus še zmanjša, morajo nekateri potniki izstopiti: to so kapljice na šipi.

Analogija ima mejo: v zraku »sedeži« niso prava mesta. Para in zrak sta mešanica plinov, $p_s$ pa je lastnost vode pri tej temperaturi.

## Drugače: Iz vsakdanjega življenja

- **Očala po vstopu v toplo.** Pozimi prideš z mraza v toplo kavarno in očala se orosijo. Mrzla stekla ohladijo topel vlažen zrak ob sebi pod rosišče.
- **Ogledalo v kopalnici.** Prha da veliko pare, $x$ naraste, rosišče se dvigne nad temperaturo ogledala.
- **Pločevinka iz hladilnika.** Poleti se orosi, ker ima okoli $5\,^\circ\mathrm{C}$, rosišče poletnega zraka pa je pogosto $15\,^\circ\mathrm{C}$ ali več.
- **Suho grlo na letalu ali v ogrevani pisarni.** Zunanji mrzel zrak ima malo vode; segret ima zelo nizko $\varphi$.
- **Perilo na balkonu.** Hitreje se suši v toplem, suhem in vetrovnem dnevu kot v hladni megli, kjer je $\varphi$ blizu $100\,\%$.

## Preveri se

? Tri od teh vrednosti povedo, koliko vode je v zraku, ena ne. Katera ne sodi zraven?
- $7{,}8\,\mathrm{g/m^3}$
~ To je absolutna vlažnost: masa pare v kubičnem metru zraka.
- $6{,}6\,\mathrm{g/kg}$ suhega zraka
~ To je vsebnost vlage $x$, os Mollierovega diagrama. Pove maso pare.
- rosišče $8\,^\circ\mathrm{C}$
~ Rosišče je določeno samo s količino pare: več pare pomeni višje rosišče.
+ relativna vlažnost $40\,\%$
> Relativna vlažnost pove le, kako blizu nasičenja je zrak. Isti $40\,\%$ pri $0\,^\circ\mathrm{C}$ in pri $30\,^\circ\mathrm{C}$ pomeni zelo različno količino vode.

? Zrak ima $25\,^\circ\mathrm{C}$ in absolutno vlažnost $6{,}9\,\mathrm{g/m^3}$. Kolikšna je relativna vlažnost? Uporabi tabelo iz razlage.
- $6{,}9\,\%$
~ Absolutna vlažnost v $\mathrm{g/m^3}$ ni odstotek. Deliti jo moraš z nasičeno vrednostjo.
- $40\,\%$
~ Delil si z nasičeno vrednostjo pri $20\,^\circ\mathrm{C}$ ($17{,}3\,\mathrm{g/m^3}$). Vzeti moraš temperaturo tega zraka.
+ $30\,\%$
- $70\,\%$
~ Do nasičenja manjka $70\,\%$; relativna vlažnost je zapolnjeni del, ne manjkajoči.
> $\varphi \approx \dfrac{\rho_v}{\rho_s} = \dfrac{6{,}9}{23{,}0} = 0{,}30$, torej $30\,\%$.

? Pozimi pade relativna vlažnost v ogrevani pisarni na $20\,\%$, čeprav je zunaj megla. Kaj je vzrok?
- Radiatorji porabljajo vodo iz zraka.
~ Grelnik vode ne odvzema; vsebnost vlage $x$ ostane enaka.
+ Ogrevanje ohrani količino vode, nasičeni parni tlak pa s temperaturo močno naraste.
- Topel zrak vsebuje manj vode kot mrzel.
~ Topel zrak lahko vsebuje več vode. Tu je vode enako, le zmogljivost je večja.
> Pri segrevanju se točka na Mollierovem diagramu premakne navpično navzgor: $x$ ostane enak, $p_s$ naraste, $\varphi = p_v/p_s$ pade.

? Rešitev naloge: zrak z $0\,^\circ\mathrm{C}$ in $80\,\%$ segrejemo na $22\,^\circ\mathrm{C}$. (1) $x = 0{,}8 \cdot 3{,}77 \approx 3{,}0\,\mathrm{g/kg}$. (2) Grelnik ne doda vode, zato ostane $\varphi = 80\,\%$. (3) Na diagramu se točka pomakne navpično gor. Kateri korak je napačen?
- Korak (1)
~ Korak je pravilen: pri $80\,\%$ je v zraku $80\,\%$ največje vsebnosti vlage $x_s = 3{,}77\,\mathrm{g/kg}$.
+ Korak (2)
- Korak (3)
~ Korak je pravilen: temperatura je navpična os, $x$ se ne spremeni.
> Brez dodane vode ostane enaka $x$, ne $\varphi$. Pri $22\,^\circ\mathrm{C}$ je $x_s = 16{,}7\,\mathrm{g/kg}$, zato je $\varphi \approx 3{,}0/16{,}7 \approx 18\,\%$.

? Iz klimatiziranega hotela v Singapurju ($22\,^\circ\mathrm{C}$) stopiš na ulico: $31\,^\circ\mathrm{C}$ in $75\,\%$ ($p_s(31\,^\circ\mathrm{C}) \approx 4495\,\mathrm{Pa}$). Očala se ti v hipu orosijo. Zakaj?
- Ker se steklo na vročini segreje nad temperaturo zraka.
~ Steklo je hladnejše od zraka, ne toplejše. Rosi se hladna površina.
+ Ker je $p_v = 0{,}75 \cdot 4495 \approx 3371\,\mathrm{Pa}$ večji od $p_s(22\,^\circ\mathrm{C}) = 2645\,\mathrm{Pa}$: stekla so pod rosiščem (okoli $26\,^\circ\mathrm{C}$).
- Ker ima zunanji zrak $75\,\%$, kar je že nad mejo kondenzacije.
~ Kondenzacija se začne šele pri $\varphi = 100\,\%$ ob hladni površini, ne pri $75\,\%$.
> Zrak ob hladnem steklu se ohladi na $22\,^\circ\mathrm{C}$, kjer lahko vsebuje največ $2645\,\mathrm{Pa}$ delnega tlaka pare. Ker ga ima $3371\,\mathrm{Pa}$, se odvečna para kondenzira.

:::simboli
\varphi | relativna vlažnost | \varphi = \dfrac{p_v}{p_s} | – | med 0 in 1 ali v %
p_v | delni tlak vodne pare | p_v = \varphi \, p_s | Pa
p_s | nasičeni parni tlak | | Pa | odvisen samo od temperature
p | skupni zračni tlak | | Pa | normalni $101\,325\,\mathrm{Pa}$
x | vsebnost vlage | x = 0{,}622 \, \dfrac{p_v}{p - p_v} | kg/kg | v tabelah in diagramu v g/kg
h | entalpija vlažnega zraka | h = 1{,}005\, t + x\,(2501 + 1{,}86\, t) | kJ/kg | na kg suhega zraka
t | temperatura | | °C
\rho_v | absolutna vlažnost | | g/m^3 | masa pare v $1\,\mathrm{m^3}$ zraka
\rho_s | največja absolutna vlažnost | | g/m^3 | nasičen zrak pri isti $t$
t_1 | zunanja temperatura | | °C
t_2 | temperatura v kabini | | °C
\varphi_1 | zunanja relativna vlažnost | | –
\varphi_2 | relativna vlažnost po segrevanju | \varphi_2 = \dfrac{p_v}{p_s(t_2)} | –
\varphi_3 | želena relativna vlažnost | | –
x_1 | vsebnost vlage zunanjega zraka | | g/kg
x_3 | želena vsebnost vlage | x_3 = 0{,}622\,\dfrac{\varphi_3 p_s}{p - \varphi_3 p_s} | g/kg
m_w | masni tok vode iz vlažilnika | m_w = \rho V (x_3 - x_1) | kg/h
\rho | gostota suhega zraka | | kg/m^3
V | prostorninski tok zraka | | m^3/h
t_{\text{steklo}} | temperatura stekla | | °C
:::
