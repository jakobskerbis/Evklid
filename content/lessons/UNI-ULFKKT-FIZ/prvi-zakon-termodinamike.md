---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pol minute žagaj suho desko z ročno žago, nato previdno potipaj list: topel je, čeprav ga nisi držal nad ognjem. Enako se segrejeta sveder po vrtanju v beton in brusni papir po brušenju lesa. List žage je energijo dobil z **delom** tvojih rok; enako segretje bi dosegel s **toploto**, če bi ga za hip položil na grelno ploščo. Oboje spremeni **notranjo energijo** telesa in nič energije se pri tem ne izgubi. Prvi zakon termodinamike je ta ohranitev energije, razširjena na toploto. Z njim računamo energijsko bilanco kompresorjev, motorjev, hladilnikov, kemijskih reakcij (kalorimetrija, entalpije), organizmov in dvigajočega se zraka, iz katerega nastanejo oblaki.

## Razlaga

### Od mehanske energije k notranji

Iz mehanike poznaš izrek o kinetični in potencialni energiji: delo zunanjih sil spremeni mehansko energijo telesa, pri trenju pa se zdi, da energija »izgine«. Prvi zakon pokaže, kam gre: v notranjo energijo. Razlike med starim in novim zakonom:

| | mehanika | termodinamika |
|---|---|---|
| katera energija | $W_k + W_p$ telesa kot celote | notranja energija $W_n$ (gibanje in vezi delcev) |
| kako jo spremenimo | z delom | z delom **in** s toploto |
| trenje | energija se »izgubi« | energija ostane, poveča $W_n$ |
| zakon | $A = \Delta W_k + \Delta W_p$ | $\Delta W_n = Q + A$ |

### Pojmi in delo plina

**1. Sistem in okolica.** Sistem je del sveta, ki ga opazujemo (plin v valju, reakcijska zmes, organizem), vse drugo je okolica. **Zaprt** sistem z okolico izmenjuje energijo, ne pa snovi; **izoliran** sistem ne izmenjuje ničesar. Stanje sistema opišejo **spremenljivke stanja** ($p$, $V$, $T$, $n$). Količina, ki je odvisna le od stanja, ne pa od tega, kako smo do stanja prišli, je **funkcija stanja**. Notranja energija je funkcija stanja, delo in toplota pa nista: odvisna sta od poti.

**2. Notranja energija.** Notranja energija $W_n$ (v kemiji in tehniki $U$) je vsota kinetičnih energij naključnega gibanja delcev in potencialnih energij njihovih medsebojnih vezi. **Molska toplotna kapaciteta pri stalni prostornini** je $C_V = \frac{1}{n}\left(\frac{\partial W_n}{\partial T}\right)_V$, **molska toplotna kapaciteta pri stalnem tlaku** $C_p$ pa je toplota, ki jo en mol prejme pri stalnem tlaku na kelvin segretja, torej $Q_p = nC_p\Delta T$. Notranja energija idealnega plina je odvisna le od temperature (pri prosti ekspanziji v vakuum se mu temperatura ne spremeni). Naj ima idealni plin stalno $C_V$; potem je $W_n = nC_VT$ (do konstante), torej

$$\Delta W_n = nC_V\Delta T \quad\text{za vsako spremembo idealnega plina,}$$

tudi kadar prostornina ni stalna.

**3. Delo pri spremembi prostornine.** Plin v valju z batom s ploščino $S$ deluje na bat s silo $pS$. Ko se bat premakne za $\mathrm{d}x$, plin opravi delo $pS\,\mathrm{d}x = p\,\mathrm{d}V$. V splošnem je delo, ki ga plin prejme, $A = -\int p_\text{zun}\,\mathrm{d}V$. Pri **kvazistatični (reverzibilni)** spremembi je plin ves čas v ravnovesju in je zunanji tlak enak tlaku plina, zato je delo, ki ga **plin prejme** od okolice,

$$A = -\int_{V_1}^{V_2} p\,\mathrm{d}V.$$

Pri stiskanju ($\mathrm{d}V < 0$) plin delo prejme ($A > 0$), pri razširjanju ga odda ($A < 0$). Delo, ki ga plin opravi, je $A' = -A = \int p\,\mathrm{d}V$, in je enako **ploščini pod krivuljo** v diagramu $p(V)$. Pri stalnem tlaku je $A = -p\,\Delta V$.

:::premisli
Plin se razširi z $1\,\mathrm{L}$ na $3\,\mathrm{L}$. Kdaj opravi več dela: če tlak ves čas ostane $2\,\mathrm{bar}$ ali če med razširjanjem enakomerno pade z $2\,\mathrm{bar}$ na $1\,\mathrm{bar}$?
---
Pri stalnem tlaku: ploščina pod krivuljo v diagramu $p(V)$ je večja, ker tlak ves čas ostane pri najvišji vrednosti. Delo torej ni odvisno le od začetne in končne prostornine, temveč od poti, zato delo ni funkcija stanja.
:::

### Prvi zakon in posebne spremembe

**4. Toplota.** Toplota $Q$ je energija, ki preide med telesoma zaradi temperaturne razlike. Je pozitivna, kadar jo sistem **prejme**. Toplota ni nekaj, kar telo »vsebuje«; telo ima notranjo energijo, toplota pa je le način njenega prenosa.

**5. Prvi zakon termodinamike.** Naj zaprt sistem preide iz stanja 1 v stanje 2 in pri tem prejme toploto $Q$ in delo $A$. Potem je sprememba notranje energije (končna minus začetna)

$$\Delta W_n = Q + A,$$

za majhno spremembo pa $\mathrm{d}W_n = \delta Q + \delta A$. Vsebina zakona ni le bilanca: $Q$ in $A$ sta vsak zase odvisna od poti, njuna vsota pa le od začetnega in končnega stanja, zato obstaja funkcija stanja $W_n$. Posledica: pri krožni spremembi je $Q + A = 0$, zato stroj, ki bi v ciklu oddajal delo brez prejete toplote (perpetuum mobile prve vrste), ni mogoč.

To je dogovor o predznakih, ki ga uporabljata tudi IUPAC in kemija ($\Delta U = q + w$). V strojništvu pogosto pišejo $\Delta U = Q - W$, kjer je $W$ delo, ki ga **opravi** sistem; fizika je enaka, le predznak dela je obrnjen. Pri vsaki nalogi najprej ugotovi, kateri dogovor uporabljaš.

**6. Posebne spremembe idealnega plina.** Za $n$ molov idealnega plina:

- **Izohorna** ($V$ stalna): $A = 0$, $Q = \Delta W_n = nC_V\Delta T$.
- **Izobarna** ($p$ stalen): $A = -p\Delta V = -nR\Delta T$, $Q = nC_p\Delta T$, $\Delta W_n = nC_V\Delta T$. Iz prvega zakona je $Q = \Delta W_n - A = nC_V\Delta T + nR\Delta T$; primerjava z $Q = nC_p\Delta T$ da **Mayerjevo zvezo** $C_p = C_V + R$.
- **Izotermna** ($T$ stalna): $\Delta W_n = 0$, zato $Q = -A$. Pri reverzibilni spremembi je $p = nRT/V$, zato

$$A = -\int_{V_1}^{V_2}\frac{nRT}{V}\,\mathrm{d}V = -nRT\ln\frac{V_2}{V_1}.$$

  Pri izotermnem razširjanju plin vso prejeto toploto pretvori v delo.
- **Adiabatna** (brez izmenjave toplote, $Q = 0$): $\Delta W_n = A$. Pri stiskanju se plin segreje, pri razširjanju ohladi. Za počasno (reverzibilno) adiabatno spremembo velja

$$pV^\kappa = \text{konst.}, \qquad TV^{\kappa - 1} = \text{konst.}, \qquad \kappa = \frac{C_p}{C_V}.$$

  Izpeljava (idealni plin, reverzibilno, stalna $C_V$): iz $\delta Q = 0$ sledi $nC_V\,\mathrm{d}T = -p\,\mathrm{d}V = -\frac{nRT}{V}\mathrm{d}V$. Ker je $R/C_V = (C_p - C_V)/C_V = \kappa - 1$, je $\frac{\mathrm{d}T}{T} = -(\kappa - 1)\frac{\mathrm{d}V}{V}$; integracija da $TV^{\kappa-1} = \text{konst.}$, s $T = pV/(nR)$ pa $pV^\kappa = \text{konst.}$

  Delo je $A = \Delta W_n = nC_V(T_2 - T_1) = \dfrac{p_2V_2 - p_1V_1}{\kappa - 1}$, ker je $nC_VT = \frac{C_V}{R}pV = \frac{pV}{\kappa - 1}$.

Adiabatna sprememba je dober model za hitre procese, pri katerih toplota ne utegne steči (stiskanje v motorju, širjenje zvoka, dvigajoči se zrak), ali za dobro izolirane sisteme. Ker je $\kappa > 1$, je adiabata v diagramu $p(V)$ bolj strma od izoterme skozi isto točko.

:::premisli
Enak plin je enkrat v trdni jeklenki, drugič v valju s prosto gibljivim batom. Oba segrejemo za isti $\Delta T$. Kateri potrebuje več toplote in kam gre razlika?
---
Pri stalnem tlaku se plin med segrevanjem razširja in opravlja delo na okolico ($nR\Delta T$). Toplota mora pokriti enako povečanje notranje energije $nC_V\Delta T$ in še to delo, zato je $C_p = C_V + R$.
:::

### Entalpija in krožne spremembe

**7. Entalpija.** **Entalpija** je funkcija stanja $H = W_n + pV$. **Trditev:** če zaprt sistem preide iz enega stanja v drugo pri stalnem tlaku $p$, ki je enak zunanjemu, in opravlja le prostorninsko delo, potem je $\Delta H = Q_p$. *Dokaz:* $A = -p\Delta V$, zato $Q_p = \Delta W_n - A = \Delta W_n + p\Delta V = \Delta(W_n + pV) = \Delta H$, ker je $p$ stalen. Kemijske reakcije v odprti čaši potekajo pri stalnem tlaku, zato tabele v kemiji navajajo reakcijske entalpije.

**8. Krožna sprememba.** Pri krožni spremembi se sistem vrne v začetno stanje, zato je $\Delta W_n = 0$ in $Q_{\text{cel}} = -A_{\text{cel}}$. Delo, ki ga plin opravi v enem ciklu, je ploščina, ki jo cikel obkroža v diagramu $p(V)$. Na tem temeljijo toplotni stroji (več v lekciji o drugem zakonu termodinamike).

## Rešeni primeri

### Primer 1 (lažji)

Zrak v pnevmatskem valju mizarske stiskalnice se pri stalnem tlaku $1{,}0 \cdot 10^5\,\mathrm{Pa}$ razširi z $2{,}0\,\mathrm{L}$ na $5{,}0\,\mathrm{L}$ in pri tem prejme $800\,\mathrm{J}$ toplote. Koliko dela prejme zrak in za koliko se mu spremeni notranja energija?

**Podatki:** $p = 1{,}0 \cdot 10^5\,\mathrm{Pa}$, $V_1 = 2{,}0\,\mathrm{L}$, $V_2 = 5{,}0\,\mathrm{L}$, $Q = +800\,\mathrm{J}$
**Iščemo:** delo $A$ in spremembo notranje energije $\Delta W_n$

:::formula
$A = -p\,\Delta V$, $\Delta W_n = Q + A$
:::

**Rešitev:**

1. $\Delta V = 3{,}0\,\mathrm{L} = 3{,}0 \cdot 10^{-3}\,\mathrm{m^3}$; v kubičnih metrih, da bo delo v joulih.
2. $A = -1{,}0 \cdot 10^5\,\mathrm{Pa} \cdot 3{,}0 \cdot 10^{-3}\,\mathrm{m^3} = -300\,\mathrm{J}$; plin opravi $300\,\mathrm{J}$ dela na okolico.
3. Po prvem zakonu sešteješ prejeto toploto in prejeto delo: $\Delta W_n = 800\,\mathrm{J} - 300\,\mathrm{J} = 500\,\mathrm{J}$.
4. Odgovor: plin prejme delo $-300\,\mathrm{J}$ (sam opravi $300\,\mathrm{J}$ dela), njegova notranja energija se poveča za $500\,\mathrm{J}$.

### Primer 2

$0{,}50\,\mathrm{mol}$ idealnega plina se pri stalni temperaturi $300\,\mathrm{K}$ počasi razširi z $10\,\mathrm{L}$ na $30\,\mathrm{L}$. Koliko dela opravi plin, koliko toplote prejme in kolikšna je sprememba notranje energije? Kolikšen je končni tlak?

**Podatki:** $n = 0{,}50\,\mathrm{mol}$, $T = 300\,\mathrm{K}$ (stalna), $V_1 = 10\,\mathrm{L}$, $V_2 = 30\,\mathrm{L}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** delo plina $A' = -A$, toploto $Q$, $\Delta W_n$, končni tlak $p_2$

:::formula
$A = -nRT\ln\dfrac{V_2}{V_1}$, $\Delta W_n = 0$, $Q = -A$, $p = \dfrac{nRT}{V}$
:::

**Rešitev:**

1. $nRT = 0{,}50 \cdot 8{,}314 \cdot 300\,\mathrm{J} \approx 1247\,\mathrm{J}$; ta produkt nastopa v delu in v tlaku, zato ga izračunamo najprej.
2. $A = -1247\,\mathrm{J} \cdot \ln 3 = -1247\,\mathrm{J} \cdot 1{,}099 \approx -1370\,\mathrm{J}$; plin opravi $A' \approx 1370\,\mathrm{J}$ dela.
3. Temperatura je stalna, zato je $\Delta W_n = 0$ in $Q = -A \approx +1370\,\mathrm{J}$.
4. Končni tlak iz plinske enačbe: $p_2 = 1247\,\mathrm{J} / 0{,}030\,\mathrm{m^3} \approx 4{,}16 \cdot 10^4\,\mathrm{Pa}$ (tretjina začetnega $1{,}25 \cdot 10^5\,\mathrm{Pa}$).
5. Odgovor: plin opravi približno $1{,}37\,\mathrm{kJ}$ dela in prejme prav toliko toplote; notranja energija se ne spremeni, končni tlak je približno $41{,}6\,\mathrm{kPa}$.

### Primer 3 (težji)

V valju dizelskega motorja zrak (idealni dvoatomni plin, $\kappa = 1{,}40$) s prostornino $1{,}0\,\mathrm{L}$, tlakom $1{,}0 \cdot 10^5\,\mathrm{Pa}$ in temperaturo $300\,\mathrm{K}$ hitro (adiabatno) stisnemo na $0{,}10\,\mathrm{L}$. Kolikšna sta končna temperatura in tlak? Koliko dela prejme zrak? Primerjaj z izotermnim stiskanjem na isto prostornino. Kolikšno kompresijsko razmerje bi bilo potrebno, da bi se zrak segrel na $800\,\mathrm{K}$?

**Podatki:** $V_1 = 1{,}0\,\mathrm{L}$, $p_1 = 1{,}0 \cdot 10^5\,\mathrm{Pa}$, $T_1 = 300\,\mathrm{K}$, $V_2 = 0{,}10\,\mathrm{L}$, $\kappa = 1{,}40$, $Q = 0$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$, $T_2' = 800\,\mathrm{K}$
**Iščemo:** $T_2$, $p_2$, delo $A$; za primerjavo $p_2$ in $A$ pri izotermnem stiskanju; razmerje $V_1/V_2$ za $T_2'$

:::formula
$T_2 = T_1\left(\dfrac{V_1}{V_2}\right)^{\kappa - 1}$, $p_2 = p_1\left(\dfrac{V_1}{V_2}\right)^{\kappa}$, $A = \Delta W_n = \dfrac{p_2V_2 - p_1V_1}{\kappa - 1}$; izotermno $A = nRT\ln\dfrac{V_1}{V_2}$; obratno $\dfrac{V_1}{V_2} = \left(\dfrac{T_2'}{T_1}\right)^{1/(\kappa - 1)}$
:::

**Rešitev:**

1. Kompresijsko razmerje je $V_1/V_2 = 10$; nastopa v obeh adiabatnih enačbah.
2. Iz $TV^{\kappa-1} = \text{konst.}$: $T_2 = 300\,\mathrm{K} \cdot 10^{0{,}40} \approx 300\,\mathrm{K} \cdot 2{,}512 \approx 754\,\mathrm{K}$ (okoli $480\,^\circ\mathrm{C}$).
3. Iz $pV^\kappa = \text{konst.}$: $p_2 = 1{,}0 \cdot 10^5\,\mathrm{Pa} \cdot 10^{1{,}40} \approx 2{,}51 \cdot 10^6\,\mathrm{Pa}$ (okoli $25\,\mathrm{bar}$).
4. $p_1V_1 = 100\,\mathrm{J}$, $p_2V_2 = 2{,}512 \cdot 10^6 \cdot 1{,}0 \cdot 10^{-4}\,\mathrm{J} \approx 251\,\mathrm{J}$, zato $A = (251 - 100)/0{,}40\,\mathrm{J} \approx 378\,\mathrm{J}$; ker je $Q = 0$, je vse to delo enako $\Delta W_n$.
5. Preizkus: $n = p_1V_1/(RT_1) \approx 0{,}0401\,\mathrm{mol}$, $\Delta W_n = n\cdot\tfrac{5}{2}R\cdot(754 - 300)\,\mathrm{K} \approx 378\,\mathrm{J}$. ✓
6. Izotermno: $p_2 = 10\,p_1 = 1{,}0 \cdot 10^6\,\mathrm{Pa}$, $A = p_1V_1\ln 10 = 100\,\mathrm{J} \cdot 2{,}303 \approx 230\,\mathrm{J}$; plin bi to energijo sproti oddal kot toploto.
7. Obratno vprašanje: enačbo $TV^{\kappa-1} = \text{konst.}$ rešimo za razmerje, $V_1/V_2 = (800/300)^{1/0{,}40} = 2{,}667^{2{,}5} \approx 11{,}6$. Temperatura raste s kompresijskim razmerjem le s potenco $0{,}40$, zato za $46\,\mathrm{K}$ višjo temperaturo potrebujemo za $16\,\%$ večje razmerje.
8. Odgovor: pri adiabatnem stiskanju se zrak segreje na približno $754\,\mathrm{K}$, tlak naraste na približno $2{,}5 \cdot 10^6\,\mathrm{Pa}$, zrak pa prejme približno $378\,\mathrm{J}$ dela, ki se v celoti shrani v notranji energiji. Izotermno stiskanje bi zahtevalo le $230\,\mathrm{J}$ in dalo $10\,\mathrm{bar}$. Za $800\,\mathrm{K}$ bi bilo potrebno kompresijsko razmerje okoli $11{,}6$. Visoka temperatura po adiabatnem stiskanju vžge vbrizgano gorivo.

### Primer 4 – zdaj ti

Pnevmatski valj stiskalnice v delavnici stoji ob peči. Zrak v njem ($0{,}40\,\mathrm{mol}$, idealni dvoatomni plin) se pri stalnem tlaku segreje za $50\,\mathrm{K}$. Koliko toplote prejme, za koliko se mu poveča notranja energija in koliko dela prejme?

**Podatki:** $n = 0{,}40\,\mathrm{mol}$, $\Delta T = 50\,\mathrm{K}$, $p$ stalen, $C_V = \tfrac{5}{2}R$, $C_p = \tfrac{7}{2}R$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** toploto $Q$, spremembo notranje energije $\Delta W_n$, delo $A$

:::formula
$Q = nC_p\Delta T$, $\Delta W_n = nC_V\Delta T$, $A = -p\Delta V = -nR\Delta T$
:::

**Rešitev:**

1. Molski toploti dvoatomnega plina: $C_p \approx 29{,}1\,\mathrm{J/(mol\,K)}$, $C_V \approx 20{,}8\,\mathrm{J/(mol\,K)}$.
2. Tlak je stalen, zato toploto računamo s $C_p$: $Q = 0{,}40 \cdot 29{,}1 \cdot 50\,\mathrm{J} = 582\,\mathrm{J}$.
3. Notranja energija idealnega plina se vedno spremeni za $nC_V\Delta T$: $\Delta W_n = 0{,}40 \cdot 20{,}8 \cdot 50\,\mathrm{J} = 416\,\mathrm{J}$.
4. Zdaj ti: izračunaj delo $A$, ki ga zrak prejme, in preveri, ali velja $\Delta W_n = Q + A$.

:::premisli
Koliko dela prejme zrak in ali se energijska bilanca ujema?
---
$A = -nR\Delta T = -0{,}40 \cdot 8{,}314 \cdot 50\,\mathrm{J} \approx -166\,\mathrm{J}$: zrak opravi okoli $166\,\mathrm{J}$ dela na bat. Preizkus: $Q + A \approx 582\,\mathrm{J} - 166\,\mathrm{J} = 416\,\mathrm{J} = \Delta W_n$. ✓ Okoli $29\,\%$ prejete toplote gre v delo, ostanek ostane v zraku kot notranja energija.
:::

## Pogoste napake

- **Mešanje predznakov dela.** Odloči se za en dogovor. Tu je $A$ delo, ki ga sistem **prejme**: pri razširjanju je negativno.
- **Toplota in temperatura.** Pri adiabatnem stiskanju se plin segreje, čeprav ne prejme nobene toplote. Pri izotermnem razširjanju plin prejema toploto, temperatura pa se ne spremeni.
- **$\Delta W_n = nC_p\Delta T$ pri izobarni spremembi.** Notranja energija idealnega plina se vedno spremeni za $nC_V\Delta T$. $nC_p\Delta T$ je toplota pri stalnem tlaku.
- **Uporaba $pV^\kappa$ pri izotermni spremembi.** Pri izotermni velja $pV = \text{konst.}$, pri adiabatni $pV^\kappa = \text{konst.}$ Zamenjava da napačen tlak.
- **Temperatura v $^\circ\mathrm{C}$ v $TV^{\kappa-1}$.** V vseh plinskih enačbah je $T$ v kelvinih.
- **Litri v $p\Delta V$.** $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^3}$; $\mathrm{Pa} \cdot \mathrm{m^3} = \mathrm{J}$.
- **Logaritem.** V $nRT\ln(V_2/V_1)$ je naravni logaritem, ne desetiški.

## Povzetek

- $\Delta W_n = Q + A$; $Q$ in $A$ sta pozitivna, kadar ju sistem prejme. $W_n$ je funkcija stanja, $Q$ in $A$ nista.
- Delo plina: $A = -\int p\,\mathrm{d}V$; ploščina pod krivuljo v diagramu $p(V)$.
- Idealni plin: $\Delta W_n = nC_V\Delta T$ vedno.
- Izohorna: $A = 0$; izobarna: $A = -p\Delta V$, $Q = nC_p\Delta T$; izotermna: $\Delta W_n = 0$, $A = -nRT\ln(V_2/V_1)$; adiabatna: $Q = 0$, $pV^\kappa = \text{konst.}$, $TV^{\kappa-1} = \text{konst.}$
- Entalpija $H = W_n + pV$, pri stalnem tlaku $\Delta H = Q_p$.

## Za izpit

Znati moraš povedati:

- prvi zakon za zaprt sistem z dogovorom o predznakih in zakaj iz njega sledi, da je $W_n$ funkcija stanja, $Q$ in $A$ pa nista;
- definicijo dela $A = -\int p\,\mathrm{d}V$ s pogojem reverzibilnosti in izpeljavo $A = -nRT\ln(V_2/V_1)$ za izotermno spremembo;
- izpeljavo Mayerjeve zveze $C_p = C_V + R$;
- izpeljavo adiabate $TV^{\kappa-1} = \text{konst.}$ in $pV^\kappa = \text{konst.}$ z vsemi pogoji (idealni plin, reverzibilno, $Q = 0$, stalna $C_V$);
- definicijo entalpije in dokaz $\Delta H = Q_p$ s pogoji.

### Naloga 1

$0{,}10\,\mathrm{mol}$ dvoatomnega idealnega plina ($C_V = \tfrac52R$, $C_p = \tfrac72R$) je v stanju 1 pri $T_1 = 300\,\mathrm{K}$ in $V_1 = 3{,}0\,\mathrm{L}$. Plin najprej reverzibilno izotermno stisnemo na $V_2 = 1{,}0\,\mathrm{L}$, nato ga pri stalnem tlaku razširimo nazaj na $3{,}0\,\mathrm{L}$, na koncu pa ga pri stalni prostornini ohladimo v stanje 1. Za vsak korak izračunaj prejeto delo in toploto, nato delo, ki ga plin opravi v enem ciklu, in izkoristek $\eta = A'_\text{cel}/Q_\text{prejeta}$, kjer je $Q_\text{prejeta}$ vsota pozitivnih toplot. $R = 8{,}314\,\mathrm{J/(mol\,K)}$.

**Rešitev:**

1. $nRT_1 = 0{,}10 \cdot 8{,}314 \cdot 300\,\mathrm{J} \approx 249{,}4\,\mathrm{J}$.
2. Izotermno $1 \to 2$: $A_{12} = -nRT_1\ln(V_2/V_1) = nRT_1\ln(V_1/V_2) = 249{,}4\,\mathrm{J} \cdot \ln 3 \approx 274{,}0\,\mathrm{J}$; $\Delta W_n = 0$, zato $Q_{12} = -274{,}0\,\mathrm{J}$ (plin toploto odda).
3. Tlak v stanju 2: $p_2 = nRT_1/V_2 = 249{,}4\,\mathrm{J}/1{,}0 \cdot 10^{-3}\,\mathrm{m^3} \approx 2{,}49 \cdot 10^5\,\mathrm{Pa}$.
4. Izobarno $2 \to 3$: prostornina se pri stalnem tlaku potroji, zato $T_3 = 3T_1 = 900\,\mathrm{K}$ in $\Delta T = 600\,\mathrm{K}$. $A_{23} = -nR\Delta T = -0{,}10 \cdot 8{,}314 \cdot 600\,\mathrm{J} \approx -498{,}8\,\mathrm{J}$, $Q_{23} = nC_p\Delta T = 0{,}10 \cdot 3{,}5 \cdot 8{,}314 \cdot 600\,\mathrm{J} \approx 1745{,}9\,\mathrm{J}$.
5. Izohorno $3 \to 1$: $A_{31} = 0$, $Q_{31} = nC_V(T_1 - T_3) = 0{,}10 \cdot 2{,}5 \cdot 8{,}314 \cdot (-600)\,\mathrm{J} \approx -1247{,}1\,\mathrm{J}$.
6. Cikel: $A_\text{cel} = 274{,}0\,\mathrm{J} - 498{,}8\,\mathrm{J} \approx -224{,}8\,\mathrm{J}$, torej plin opravi $A'_\text{cel} \approx 224{,}8\,\mathrm{J}$. Preizkus s prvim zakonom ($\Delta W_n = 0$): $Q_\text{cel} = -274{,}0 + 1745{,}9 - 1247{,}1 \approx 224{,}8\,\mathrm{J} = -A_\text{cel}$. ✓
7. Toplota je pozitivna le v koraku $2 \to 3$: $\eta = 224{,}8/1745{,}9 \approx 0{,}129$.
8. Odgovor: plin v ciklu opravi približno $225\,\mathrm{J}$ dela, izkoristek je približno $12{,}9\,\%$.

### Naloga 2

Natančno navedi prvi zakon termodinamike in dokaži, da za reverzibilno adiabatno spremembo idealnega plina s stalno $C_V$ velja $pV^\kappa = \text{konst.}$ Utemelji, zakaj je adiabata v diagramu $p(V)$ bolj strma od izoterme skozi isto točko.

**Rešitev:**

1. Če zaprt sistem preide iz stanja 1 v stanje 2 in prejme toploto $Q$ in delo $A$, je $\Delta W_n = Q + A$; za majhno spremembo $\mathrm{d}W_n = \delta Q + \delta A$.
2. Za idealni plin je $\mathrm{d}W_n = nC_V\,\mathrm{d}T$; pri reverzibilni spremembi je $\delta A = -p\,\mathrm{d}V$, pri adiabatni $\delta Q = 0$.
3. Torej $nC_V\,\mathrm{d}T = -p\,\mathrm{d}V$. Iz $pV = nRT$ diferenciramo $p\,\mathrm{d}V + V\,\mathrm{d}p = nR\,\mathrm{d}T$ in izločimo $\mathrm{d}T$: $C_V(p\,\mathrm{d}V + V\,\mathrm{d}p) = -Rp\,\mathrm{d}V$.
4. Z $C_V + R = C_p$ dobimo $C_pp\,\mathrm{d}V + C_VV\,\mathrm{d}p = 0$, torej $\kappa\frac{\mathrm{d}V}{V} + \frac{\mathrm{d}p}{p} = 0$.
5. Integracija: $\kappa\ln V + \ln p = \text{konst.}$, torej $pV^\kappa = \text{konst.}$
6. Naklon: iz 4. koraka je za adiabato $\frac{\mathrm{d}p}{\mathrm{d}V} = -\kappa\frac{p}{V}$, iz $pV = \text{konst.}$ za izotermo $-\frac{p}{V}$. Ker je $\kappa = C_p/C_V > 1$, je adiabata v isti točki $\kappa$-krat bolj strma.
7. Fizikalno: pri adiabatnem razširjanju plin opravlja delo na račun notranje energije, se ohlaja, zato tlak pade hitreje kot pri stalni temperaturi.

### Naloga 3

Idealni plin preide iz stanja $(p_1; V_1) = (2{,}0\,\mathrm{bar}; 1{,}0\,\mathrm{L})$ v stanje $(p_2; V_2) = (1{,}0\,\mathrm{bar}; 2{,}0\,\mathrm{L})$ po dveh poteh: (a) najprej izobarno pri $2{,}0\,\mathrm{bar}$ do $2{,}0\,\mathrm{L}$, nato izohorno do $1{,}0\,\mathrm{bar}$; (b) najprej izohorno do $1{,}0\,\mathrm{bar}$, nato izobarno do $2{,}0\,\mathrm{L}$. Izračunaj toploto, ki jo plin prejme po vsaki poti, in utemelji, ali je toplota funkcija stanja.

**Rešitev:**

1. Začetno in končno stanje imata enak produkt $pV = 200\,\mathrm{J}$, torej enako temperaturo; za idealni plin je zato po obeh poteh $\Delta W_n = 0$.
2. Pot (a): plin opravi delo le na izobari, $A' = 2{,}0 \cdot 10^5\,\mathrm{Pa} \cdot 1{,}0 \cdot 10^{-3}\,\mathrm{m^3} = 200\,\mathrm{J}$, torej $A = -200\,\mathrm{J}$ in $Q_a = \Delta W_n - A = 200\,\mathrm{J}$.
3. Pot (b): $A' = 1{,}0 \cdot 10^5\,\mathrm{Pa} \cdot 1{,}0 \cdot 10^{-3}\,\mathrm{m^3} = 100\,\mathrm{J}$, zato $Q_b = 100\,\mathrm{J}$.
4. Med istima stanjema je plin prejel različno toploto, zato toplota ni funkcija stanja (in prav tako ne delo). Funkcija stanja je le njuna vsota $Q + A = \Delta W_n$, ki je po obeh poteh $0$.

## Drugače: Na sliki

V diagramu $p(V)$ nariši izotermo in adiabato skozi isto začetno točko:

```
 p
 |  \
 |   \ adiabata (bolj strma)
 |    \.
 |     \ '.
 |      \   '. izoterma
 |       \     ' - .
 |        \           ' - - .
 +---------------------------------> V
```

Pri razširjanju adiabata pade hitreje kot izoterma, ker se plin hkrati ohlaja. Ploščina pod krivuljo je delo, ki ga opravi plin: pri adiabatnem razširjanju je manjša kot pri izotermnem, ker plin ne dobiva toplote.

Prvi zakon si predstavljaj kot bančni račun: notranja energija je stanje na računu, toplota in delo sta dva načina pologa ali dviga. Stanje na računu ni odvisno od tega, ali si denar položil z gotovino ali z nakazilom; enako je $\Delta W_n$ odvisna le od začetnega in končnega stanja.

## Drugače: Uporaba v stroki

**Bombni kalorimeter.** V zaprti jekleni posodi (stalna prostornina, $A = 0$) izmerimo $Q_V = \Delta W_n$ sežiga, v tabelah pa potrebujemo $\Delta H = \Delta W_n + \Delta(pV) \approx \Delta W_n + \Delta n_{\text{plin}}RT$. Pri sežigu benzojske kisline, s katero kalorimetre umerjamo, je $\Delta n_{\text{plin}} = 7 - 7{,}5 = -0{,}5$ na mol, zato se $\Delta H$ in $\Delta W_n$ razlikujeta le za okoli $1{,}24\,\mathrm{kJ/mol}$ pri skoraj $3230\,\mathrm{kJ/mol}$.

**Večstopenjski kompresorji.** Adiabatno stiskanje zraka z $1$ na $9\,\mathrm{bar}$ ga segreje s $300\,\mathrm{K}$ na okoli $562\,\mathrm{K}$. Če stiskamo v dveh stopnjah po razmerju $3$ in zrak med njima ohladimo nazaj na $300\,\mathrm{K}$, se v vsaki stopnji segreje le na okoli $411\,\mathrm{K}$; pot se približa izotermi in kompresor porabi okoli $16\,\%$ manj dela (pri pretočnem stroju je delo na mol $C_p\Delta T$).

**Dušenje in utekočinjanje plinov.** Pri pretoku skozi ventil (Joule-Thomsonov pojav) se ohranja entalpija. Idealnemu plinu se temperatura ne spremeni, realni plini, kot sta dušik in zrak, pa se pri sobni temperaturi ohladijo; na tem temelji Lindejev postopek utekočinjanja zraka.

## Drugače: Korak za korakom s številkami

Idealni plin opravi krožno spremembo, ki je v diagramu $p(V)$ pravokotnik: $p$ med $1{,}0 \cdot 10^5\,\mathrm{Pa}$ in $3{,}0 \cdot 10^5\,\mathrm{Pa}$, $V$ med $1{,}0\,\mathrm{L}$ in $4{,}0\,\mathrm{L}$. Cikel teče v smeri urinega kazalca (zgornja izobara pri razširjanju).

1. **Razširjanje pri $3{,}0 \cdot 10^5\,\mathrm{Pa}$:** plin opravi $3{,}0 \cdot 10^5 \cdot 3{,}0 \cdot 10^{-3}\,\mathrm{J} = 900\,\mathrm{J}$.
2. **Izohorno ohlajanje:** $\Delta V = 0$, ni dela.
3. **Stiskanje pri $1{,}0 \cdot 10^5\,\mathrm{Pa}$:** plin prejme $1{,}0 \cdot 10^5 \cdot 3{,}0 \cdot 10^{-3}\,\mathrm{J} = 300\,\mathrm{J}$.
4. **Izohorno segrevanje:** spet ni dela.
5. **Celotno delo plina:** $900\,\mathrm{J} - 300\,\mathrm{J} = 600\,\mathrm{J}$, kar je ploščina pravokotnika: $2{,}0 \cdot 10^5\,\mathrm{Pa} \cdot 3{,}0 \cdot 10^{-3}\,\mathrm{m^3} = 600\,\mathrm{J}$.
6. **Prvi zakon za cikel:** $\Delta W_n = 0$, zato je neto prejeta toplota $Q = 600\,\mathrm{J}$. Plin je $600\,\mathrm{J}$ toplote pretvoril v delo; toploto je moral pri tem prejemati in del je tudi oddati.

## Drugače: Bolj natančno

**Delo in toplota nista funkciji stanja.** V jeziku diferencialov je $\mathrm{d}W_n = \delta Q + \delta A$, kjer sta $\delta Q$ in $\delta A$ »nepopolna« diferenciala: integral $\int\delta A = -\int p\,\mathrm{d}V$ je odvisen od poti v ravnini $(V, p)$. Primer s številkami je Naloga 3 v razdelku »Za izpit«.

**Izpeljava adiabate.** Pri $\delta Q = 0$ je $nC_V\,\mathrm{d}T = -p\,\mathrm{d}V = -\frac{nRT}{V}\mathrm{d}V$. Ločimo spremenljivki: $\frac{C_V}{R}\frac{\mathrm{d}T}{T} = -\frac{\mathrm{d}V}{V}$. Integriramo in upoštevamo $R/C_V = (C_p - C_V)/C_V = \kappa - 1$:

$$\ln T + (\kappa - 1)\ln V = \text{konst.} \quad\Rightarrow\quad TV^{\kappa - 1} = \text{konst.}$$

S $T = pV/(nR)$ dobimo $pV^\kappa = \text{konst.}$ Naklon adiabate je $\frac{\mathrm{d}p}{\mathrm{d}V} = -\kappa\frac{p}{V}$, izoterme pa $-\frac{p}{V}$; adiabata je torej $\kappa$-krat bolj strma.

**Reverzibilnost.** Formule za $pV^\kappa$ in $nRT\ln(V_2/V_1)$ veljajo za **reverzibilne** (kvazistatične) spremembe, pri katerih je plin ves čas v notranjem ravnovesju in ima določen tlak. Pri nenadnem razširjanju v vakuum (prosta ekspanzija) plin ne opravi dela in ne izmenja toplote, zato se idealnemu plinu temperatura ne spremeni, čeprav sprememba ni izotermna v običajnem pomenu in ni reverzibilna. Prvi zakon velja vedno, posebne formule pa le pod svojimi pogoji.

## Preveri se

? Katera od teh količin je funkcija stanja?
- Toplota $Q$
~ Toplota je odvisna od poti: med istima stanjema plin prejme različno toploto, odvisno od tega, po kateri spremembi ga peljemo.
- Delo $A$
~ Delo je ploščina pod krivuljo v diagramu $p(V)$, ta pa je odvisna od poti, ne le od začetnega in končnega stanja.
+ Notranja energija $W_n$
> Notranja energija je odvisna le od stanja (pri idealnem plinu le od $T$). Toplota in delo opisujeta prenos energije med spremembo, zato sta odvisna od poti.

? Plin prejme $500\,\mathrm{J}$ toplote in pri tem opravi $200\,\mathrm{J}$ dela na okolico. Za koliko se mu spremeni notranja energija?
- $700\,\mathrm{J}$
~ Seštel si toploto in delo, kot da bi plin delo prejel. Delo, ki ga plin opravi, mu energijo odvzame.
+ $300\,\mathrm{J}$
- $-300\,\mathrm{J}$
~ Predznak je obrnjen: plin je prejel več energije ($500\,\mathrm{J}$), kot je je oddal ($200\,\mathrm{J}$), zato se mu notranja energija poveča.
> $\Delta W_n = Q + A = 500\,\mathrm{J} + (-200\,\mathrm{J}) = 300\,\mathrm{J}$. Delo, ki ga plin opravi, mu energijo zmanjša.

? Kaj velja pri izotermnem razširjanju idealnega plina?
- Plin ne prejme toplote.
~ To velja za adiabatno spremembo. Brez dovedene toplote bi se plin pri razširjanju ohladil, temperatura ne bi ostala stalna.
- Notranja energija se poveča.
~ Notranja energija idealnega plina je odvisna le od temperature. Ta je stalna, zato je $\Delta W_n = 0$.
+ Prejeta toplota je enaka delu, ki ga plin opravi.
> Pri stalni temperaturi je $\Delta W_n = 0$, zato je $Q = -A$: vsa prejeta toplota se pretvori v delo plina.

? Plin hitro (adiabatno) stisnemo. Kaj se zgodi s temperaturo?
+ Naraste.
- Ostane enaka.
~ »Brez toplote« ne pomeni »brez spremembe temperature«. Plin pri stiskanju prejme delo, ki mu poveča notranjo energijo.
- Pade.
~ Temperatura pade pri adiabatnem razširjanju, ko plin delo odda. Pri stiskanju ga prejme.
> Pri $Q = 0$ je $\Delta W_n = A > 0$, ker plin pri stiskanju prejme delo. Notranja energija in s tem temperatura narasteta.

? Plin se pri stalnem tlaku $2{,}0 \cdot 10^5\,\mathrm{Pa}$ razširi za $3{,}0\,\mathrm{L}$. Koliko dela opravi?
- $6{,}0 \cdot 10^5\,\mathrm{J}$
~ Litrov nisi pretvoril v kubične metre: $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^3}$.
- $60\,\mathrm{J}$
~ Pri pretvorbi si se zmotil za faktor 10: $3{,}0\,\mathrm{L} = 3{,}0 \cdot 10^{-3}\,\mathrm{m^3}$, ne $3{,}0 \cdot 10^{-4}\,\mathrm{m^3}$.
+ $600\,\mathrm{J}$
> $A' = p\Delta V = 2{,}0 \cdot 10^5\,\mathrm{Pa} \cdot 3{,}0 \cdot 10^{-3}\,\mathrm{m^3} = 600\,\mathrm{J}$. $6{,}0 \cdot 10^5\,\mathrm{J}$ dobiš, če litrov ne pretvoriš v kubične metre.

:::simboli
W_n | notranja energija | W_n = nC_VT | J | idealni plin, do aditivne konstante
\Delta W_n | sprememba notranje energije | \Delta W_n = Q + A | J | idealni plin: ΔW_n = nC_V ΔT
Q | toplota, ki jo plin prejme | Q = \Delta W_n - A | J | negativna, kadar plin toploto odda
A | delo, ki ga plin prejme | A = -\int_{V_1}^{V_2} p\,\mathrm{d}V | J | pri razširjanju negativno
A' | delo, ki ga plin odda (delo plina) | A' = -A | J
n | množina plina | | mol
C_V | molska toplotna kapaciteta pri stalni prostornini | | J/(mol K)
C_p | molska toplotna kapaciteta pri stalnem tlaku | C_p = C_V + R | J/(mol K)
R | splošna plinska konstanta | | J/(mol K) | 8,314 J/(mol K)
p | tlak plina | p = \frac{nRT}{V} | Pa
p_1, p_2 | začetni in končni tlak | | Pa
V | prostornina plina | | m^3
V_1, V_2 | začetna in končna prostornina | | m^3
T | absolutna temperatura | | K
T_1, T_2 | začetna in končna temperatura | | K | adiabatno: T₂ = T₁(V₁/V₂)^(κ−1)
\kappa | adiabatni eksponent | \kappa = \frac{C_p}{C_V} | – | enoatomni 5/3, dvoatomni 1,40
:::
