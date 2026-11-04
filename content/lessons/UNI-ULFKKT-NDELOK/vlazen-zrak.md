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

Šele zdaj zapiši oznake in natančne definicije. Vlažen zrak obravnavamo kot zmes dveh idealnih plinov, suhega zraka in vodne pare, pri skupnem tlaku $p$. Po Daltonovem zakonu je $p = p_z + p_v$, kjer sta $p_z$ in $p_v$ delna tlaka suhega zraka in pare.

**Definicija (relativna vlažnost).** Naj ima vlažen zrak temperaturo $t$ in delni tlak pare $p_v$. Relativna vlažnost je

$$\varphi = \frac{p_v}{p_s(t)},$$

kjer je $p_s(t)$ nasičeni parni tlak vode pri *isti* temperaturi. Za nenasičen zrak je $0 \le \varphi < 1$, za nasičen $\varphi = 1$. Ker je za idealni plin $\rho_v = p_v M_v/(RT)$ in $\rho_s = p_s M_v/(RT)$, je pri isti $T$ tudi $\varphi = \rho_v/\rho_s$ (do natančnosti modela idealnega plina).

**Definicija (vsebnost vlage).** $x = m_v/m_z$ je masa pare na maso suhega zraka v isti prostornini.

**Trditev.** Če sta suh zrak in para idealna plina pri skupnem tlaku $p$, potem je

$$x = 0{,}622 \, \frac{p_v}{p - p_v}.$$

*Izpeljava.* Oba plina zavzemata isto prostornino $V$ pri isti $T$, zato je $m_v = p_v V M_v/(RT)$ in $m_z = p_z V M_z/(RT)$. Deliš in $V$, $R$, $T$ se pokrajšajo: $x = \dfrac{M_v}{M_z}\,\dfrac{p_v}{p_z}$. Vstaviš $p_z = p - p_v$ in $M_v/M_z = 18{,}02/28{,}96 \approx 0{,}622$. Za nasičen zrak je $x_s = 0{,}622\,p_s/(p - p_s)$; tako je izračunan četrti stolpec tabele.

**Definicija (rosišče).** Rosišče $t_r$ je temperatura, na katero moramo ohladiti zrak pri stalnih $p$ in $x$, da postane nasičen: $p_s(t_r) = p_v$. Iz trditve sledi, da sta pri stalnih $p$ in $x$ tudi $p_v$ in s tem $t_r$ stalna: rosišče je odvisno od količine vode, ne od temperature zraka.

**Entalpija** vlažnega zraka $h$ je entalpija zmesi $(1 + x)\,\mathrm{kg}$, ki vsebuje $1\,\mathrm{kg}$ suhega zraka; za ničlo vzamemo suh zrak in kapljevito vodo pri $0\,^\circ\mathrm{C}$. Za nenasičen zrak, s $t$ v $^\circ\mathrm{C}$ in $x$ v $\mathrm{kg/kg}$, je v $\mathrm{kJ/kg}$ suhega zraka

$$h = 1{,}005\, t + x\,(2501 + 1{,}86\, t)$$

Prvi člen je segrevanje suhega zraka ($c_{p,z} = 1{,}005\,\mathrm{kJ/(kg\,K)}$), drugi pa izparilna toplota vode pri $0\,^\circ\mathrm{C}$ ($2501\,\mathrm{kJ/kg}$) in segrevanje pare ($c_{p,v} = 1{,}86\,\mathrm{kJ/(kg\,K)}$). Zrak v Anini kabini ima pri $22\,^\circ\mathrm{C}$ in $x = 0{,}00302$ entalpijo približno $29{,}8\,\mathrm{kJ/kg}$.

**Bilance naprave.** Skozi grelnik, vlažilnik ali hladilnik teče v ustaljenem stanju stalen masni tok suhega zraka $\dot m_z$. Bilanca vode da $\dot m_w = \dot m_z\,(x_2 - x_1)$, energijska bilanca grelnika brez dodane vode pa $\dot Q = \dot m_z\,(h_2 - h_1)$.

**Trditev (adiabatno mešanje).** Če zmešamo tokova $1$ in $2$ z masnima tokovoma suhega zraka $\dot m_1$ in $\dot m_2$ brez izmenjave toplote z okolico, potem je

$$x_M = \frac{\dot m_1 x_1 + \dot m_2 x_2}{\dot m_1 + \dot m_2}, \qquad h_M = \frac{\dot m_1 h_1 + \dot m_2 h_2}{\dot m_1 + \dot m_2}.$$

*Dokaz.* Bilance suhega zraka, vode in energije so $\dot m_M = \dot m_1 + \dot m_2$, $\dot m_M x_M = \dot m_1 x_1 + \dot m_2 x_2$ in $\dot m_M h_M = \dot m_1 h_1 + \dot m_2 h_2$; deliš z $\dot m_M$. Iz obeh enačb sledi $\dot m_1 (x_M - x_1) = \dot m_2 (x_2 - x_M)$ in enako za $h$, zato ima daljica od $1$ do $M$ enak naklon kot od $M$ do $2$ (pri $x_1 = x_2$ je tudi $x_M = x_1$ in vse tri točke ležijo na isti navpičnici). Točka $M$ leži na daljici $12$ v $h$–$x$ diagramu in jo deli v razmerju $\overline{1M} : \overline{M2} = \dot m_2 : \dot m_1$ (pravilo vzvoda).

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

### Primer 3: vlažilnik in grelnik za kabino

Ana želi v kabini $22\,^\circ\mathrm{C}$ in $\varphi = 40\,\%$. Ventilator dovaja $300\,\mathrm{m^3/h}$ zunanjega zraka iz primera 2 ($0\,^\circ\mathrm{C}$, $80\,\%$; gostota suhega zraka približno $1{,}2\,\mathrm{kg/m^3}$). Grelnik zrak najprej segreje na $22\,^\circ\mathrm{C}$, nato parni vlažilnik doda vodo; temperatura se pri vlaženju praktično ne spremeni. Koliko vode na uro mora dodati vlažilnik in kolikšna mora biti moč grelnika?

**Podatki:** $t_1 = 0\,^\circ\mathrm{C}$, $t_2 = 22\,^\circ\mathrm{C}$, $\varphi_3 = 0{,}40$, $p_s(22\,^\circ\mathrm{C}) = 2645\,\mathrm{Pa}$, $x_1 = 3{,}02\,\mathrm{g/kg}$, $V = 300\,\mathrm{m^3/h}$, $\rho = 1{,}2\,\mathrm{kg/m^3}$, $p = 101\,325\,\mathrm{Pa}$
**Iščemo:** masni tok vode $m_w$ v $\mathrm{kg/h}$ in moč grelnika $\dot Q$ v $\mathrm{kW}$

:::formula
$x_3 = 0{,}622\,\dfrac{\varphi_3 p_s}{p - \varphi_3 p_s}$, $\quad m_w = \rho V \,(x_3 - x_1)$
$h = 1{,}005\,t + x\,(2501 + 1{,}86\,t)$, $\quad \dot Q = \rho V\,(h_2 - h_1)$
:::

**Rešitev:**

1. Ciljni delni tlak pare: $0{,}40 \cdot 2645 = 1058$ paskalov.
2. Ciljna vsebnost vlage: $x_3 = 0{,}622 \cdot \dfrac{1058}{101\,325 - 1058} \approx 0{,}00656$, to je $6{,}56\,\mathrm{g/kg}$.
3. Vsak kilogram suhega zraka potrebuje $6{,}56 - 3{,}02 = 3{,}54$ grama vode. Na diagramu je to pot skoraj vodoravno desno od točke iz primera 2.
4. Masni tok suhega zraka: $1{,}2 \cdot 300 = 360$ kilogramov na uro.
5. $m_w = 360 \cdot 3{,}54 = 1274{,}4$ grama na uro.
6. Grelnik vode ne doda, zato zanj velja $\dot Q = \rho V\,(h_2 - h_1)$ pri $x = x_1 = 0{,}00302$. Pred grelnikom: $h_1 = 1{,}005 \cdot 0 + 0{,}00302 \cdot 2501 \approx 7{,}55\,\mathrm{kJ/kg}$.
7. Za grelnikom: $h_2 = 1{,}005 \cdot 22 + 0{,}00302 \cdot (2501 + 1{,}86 \cdot 22) \approx 22{,}11 + 7{,}68 = 29{,}79\,\mathrm{kJ/kg}$.
8. $\dot Q = 360 \cdot (29{,}79 - 7{,}55) = 360 \cdot 22{,}24 \approx 8006\,\mathrm{kJ/h}$; deliš s $3600\,\mathrm{s/h}$ in dobiš $2{,}22\,\mathrm{kW}$.
9. Odgovor: vlažilnik mora dodati približno $1{,}3\,\mathrm{kg}$ vode na uro, kar je več kot liter na uro vožnje, grelnik pa mora imeti moč približno $2{,}2\,\mathrm{kW}$.

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

## Za izpit

Znati moraš povedati:

- natančne definicije relativne vlažnosti ($\varphi = p_v/p_s(t)$ pri *isti* temperaturi), vsebnosti vlage ($x = m_v/m_z$), absolutne vlažnosti in rosišča ($p_s(t_r) = p_v$ pri stalnih $p$ in $x$);
- izpeljavo $x = 0{,}622\,p_v/(p - p_v)$ iz Daltonovega zakona in plinske enačbe ter pogoje, pod katerimi velja (idealna plina, skupni tlak $p$);
- entalpijo $h = 1{,}005\,t + x(2501 + 1{,}86\,t)$: pomen vsakega člena in referenčno stanje;
- bilanci vode in energije za grelnik in vlažilnik ter dokaz, da mešanica leži na daljici med točkama tokov (pravilo vzvoda);
- kako na Mollierovem diagramu potekajo segrevanje, ohlajanje pod rosišče, vlaženje in mešanje.

### Naloga 1

Klimatska naprava laboratorija zmeša zunanji zrak ($0\,^\circ\mathrm{C}$, $80\,\%$, $x_1 = 3{,}02\,\mathrm{g/kg}$, $h_1 = 7{,}55\,\mathrm{kJ/kg}$; masni tok suhega zraka $2000\,\mathrm{kg/h}$) z obtočnim zrakom iz laboratorija ($22\,^\circ\mathrm{C}$, $50\,\%$; masni tok suhega zraka $6000\,\mathrm{kg/h}$). Mešanico nato grelnik segreje na $22\,^\circ\mathrm{C}$. Tlak je $101\,325\,\mathrm{Pa}$, nasičene tlake vzemi iz tabele v razlagi. (a) Izračunaj $x$, $h$ in temperaturo mešanice. (b) Ali se v mešalni komori pojavi megla? (c) Kolikšna je moč grelnika in kolikšna relativna vlažnost zraka, ki gre v laboratorij?

**Rešitev:**

1. Obtočni zrak: $p_{v2} = 0{,}50 \cdot 2645 = 1322{,}5\,\mathrm{Pa}$ in $x_2 = 0{,}622 \cdot \dfrac{1322{,}5}{101\,325 - 1322{,}5} \approx 0{,}00823$, to je $8{,}23\,\mathrm{g/kg}$.
2. $h_2 = 1{,}005 \cdot 22 + 0{,}00823 \cdot (2501 + 1{,}86 \cdot 22) \approx 22{,}11 + 20{,}92 = 43{,}03\,\mathrm{kJ/kg}$.
3. Mešanje (bilanca vode): $x_M = \dfrac{2000 \cdot 3{,}02 + 6000 \cdot 8{,}23}{8000} = \dfrac{55\,420}{8000} \approx 6{,}93\,\mathrm{g/kg}$.
4. Mešanje (bilanca energije): $h_M = \dfrac{2000 \cdot 7{,}55 + 6000 \cdot 43{,}03}{8000} = \dfrac{273\,280}{8000} = 34{,}16\,\mathrm{kJ/kg}$.
5. Temperaturo dobiš, ko enačbo za $h$ razrešiš na $t$ in vstaviš $x_M = 0{,}00693\,\mathrm{kg/kg}$: $t_M = \dfrac{h_M - 2501\,x_M}{1{,}005 + 1{,}86\,x_M} = \dfrac{34{,}16 - 17{,}33}{1{,}0179} \approx 16{,}5\,^\circ\mathrm{C}$.
6. Delni tlak pare v mešanici: iz $x = 0{,}622\,p_v/(p - p_v)$ sledi $p_v = \dfrac{x\,p}{0{,}622 + x} = \dfrac{0{,}00693 \cdot 101\,325}{0{,}62893} \approx 1116\,\mathrm{Pa}$.
7. Ker je $p_s(10\,^\circ\mathrm{C}) = 1228\,\mathrm{Pa} > 1116\,\mathrm{Pa}$ in $p_s$ s temperaturo narašča, je rosišče pod $10\,^\circ\mathrm{C}$ (med $5$ in $10\,^\circ\mathrm{C}$), mešanica pa ima $16{,}5\,^\circ\mathrm{C}$. Megle ni.
8. Za grelnikom: $h_4 = 1{,}005 \cdot 22 + 0{,}00693 \cdot (2501 + 1{,}86 \cdot 22) \approx 22{,}11 + 17{,}62 = 39{,}73\,\mathrm{kJ/kg}$.
9. $\dot Q = 8000 \cdot (39{,}73 - 34{,}16) = 44\,560\,\mathrm{kJ/h}$, kar je $44\,560/3600 \approx 12{,}4\,\mathrm{kW}$.
10. $\varphi_4 = \dfrac{1116}{2645} \approx 0{,}42$.
11. Odgovor: mešanica ima $x \approx 6{,}93\,\mathrm{g/kg}$, $h \approx 34{,}2\,\mathrm{kJ/kg}$ in $t \approx 16{,}5\,^\circ\mathrm{C}$; megle ni, ker je rosišče pod $10\,^\circ\mathrm{C}$. Grelnik potrebuje približno $12{,}4\,\mathrm{kW}$, v laboratorij pa pride zrak z $22\,^\circ\mathrm{C}$ in $\varphi \approx 42\,\%$.

### Naloga 2

Natančno definiraj relativno vlažnost in vsebnost vlage ter navedi pogoje, pod katerimi velja $x = 0{,}622\,p_v/(p - p_v)$. Izpelji to zvezo. Nato utemelji, ali se pri segrevanju vlažnega zraka pri stalnem tlaku brez dodajanja vode spremenijo $x$, rosišče in $\varphi$.

**Rešitev:**

1. Naj ima vlažen zrak temperaturo $t$ in delni tlak pare $p_v$. Relativna vlažnost je $\varphi = p_v/p_s(t)$, kjer je $p_s(t)$ nasičeni parni tlak pri isti temperaturi. Vsebnost vlage je $x = m_v/m_z$, masa pare na maso suhega zraka.
2. Pogoji: suh zrak in para sta idealna plina, ki zavzemata isto prostornino pri isti temperaturi, skupni tlak je $p = p_z + p_v$ (Daltonov zakon).
3. Za vsak plin velja $m_i = p_i V M_i/(RT)$, zato $x = \dfrac{M_v}{M_z} \cdot \dfrac{p_v}{p_z} = \dfrac{18{,}02}{28{,}96} \cdot \dfrac{p_v}{p - p_v} \approx 0{,}622\,\dfrac{p_v}{p - p_v}$.
4. Pri segrevanju brez dodajanja vode se $m_v$ in $m_z$ ne spremenita, zato je $x$ stalen.
5. Iz zveze v koraku 3, razrešene na $p_v = x\,p/(0{,}622 + x)$, sledi: pri stalnih $x$ in $p$ je stalen tudi $p_v$. Rosišče je določeno s $p_s(t_r) = p_v$, zato se ne spremeni.
6. $p_s(t)$ s temperaturo strogo narašča, $p_v$ pa je stalen, zato $\varphi = p_v/p_s(t)$ pada.
7. Odgovor: $x$ in rosišče ostaneta enaka, $\varphi$ pade; na Mollierovem diagramu je to navpična pot navzgor.

## Drugače: Z analogijo

Zrak je avtobus, molekule vodne pare so potniki.

- Število potnikov je vsebnost vlage $x$.
- Število sedežev je $x_s$ in je odvisno od temperature: topel zrak je dolg zgibni avtobus, mrzel zrak je kombi.
- Zasedenost sedežev v odstotkih je relativna vlažnost $\varphi$.

Ko zunanji zrak segreješ, potnike iz kombija prestaviš v zgibni avtobus. Potnikov je enako, sedežev je veliko več, zato je avtobus skoraj prazen: $\varphi$ pade z $80$ na $18\,\%$. Ko zrak ohlajaš, se avtobus manjša. Rosišče je trenutek, ko so vsi sedeži zasedeni. Če se avtobus še zmanjša, morajo nekateri potniki izstopiti: to so kapljice na šipi.

Analogija ima mejo: v zraku »sedeži« niso prava mesta. Para in zrak sta mešanica plinov, $p_s$ pa je lastnost vode pri tej temperaturi.

## Drugače: Uporaba v stroki

- **Klimatizacija laboratorijev in čistih prostorov.** Klimatska naprava pozimi zrak segreje in navlaži, poleti ga ohladi pod rosišče, da izloči vodo, in nato dogreje. Moč grelnika, hladilnika in porabo vode projektant odčita kot razlike $h$ in $x$ na Mollierovem diagramu.
- **Sušilniki v kemijski in živilski industriji.** Zrak se v grelniku segreje, $\varphi$ pade in zrak lahko prevzame vlago iz produkta. Ker vodo prevzame skoraj adiabatno, $h$ ostane približno stalna in iz razlike $x$ izračunaš, koliko zraka potrebuješ na kilogram izparjene vode.
- **Izolacija hladnih cevi in opreme.** Cev s hladilno vodo, ki je hladnejša od rosišča zraka v hali, se orosi in korodira; izolacija mora imeti zunanjo površino nad rosiščem.
- **Kondicioniranje vzorcev.** Higroskopne snovi, papir in polimere pred tehtanjem ali mehanskim preskusom hranijo v standardni atmosferi, na primer $23\,^\circ\mathrm{C}$ in $50\,\%$ (ISO 554), ker se njihova masa in lastnosti spreminjajo z vlago.
- **Psihrometer.** Vlažnost merimo s suhim in mokrim termometrom; razlika temperatur je večja, kadar je $\varphi$ nižja.

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
p_z | delni tlak suhega zraka | p_z = p - p_v | Pa
t_r | rosišče | p_s(t_r) = p_v | °C
\dot Q | toplotni tok (moč grelnika) | \dot Q = \dot m_z (h_2 - h_1) | kW
\dot m_z | masni tok suhega zraka | | kg/h
x_M | vsebnost vlage mešanice | x_M = \dfrac{\dot m_1 x_1 + \dot m_2 x_2}{\dot m_1 + \dot m_2} | g/kg
\dot m_1 | masni tok suhega zraka v toku 1 | | kg/h
\dot m_2 | masni tok suhega zraka v toku 2 | | kg/h
h_M | entalpija mešanice | h_M = \dfrac{\dot m_1 h_1 + \dot m_2 h_2}{\dot m_1 + \dot m_2} | kJ/kg
:::
