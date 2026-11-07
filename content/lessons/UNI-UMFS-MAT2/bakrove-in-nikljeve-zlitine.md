---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Med drugo svetovno vojno so v Veliki Britaniji gradili prve reaktivne motorje. Plinska turbina je delovala, a lopatice turbine so se v vročem plinu pod veliko centrifugalno silo počasi raztezale in pokale. Jekla in lahke kovine pri teh temperaturah niso zdržala. Metalurgi so zato razvili nikljevo zlitino s kromom ter malo titana in aluminija, imenovano Nimonic 80. Njena trdnost je izvirala iz drobnih izločkov, ki ostanejo stabilni tudi pri temperaturah, kjer se aluminijeva zlitina T6 prestara v nekaj minutah.

Iz bakra in niklja so vodniki, izmenjevalniki, ventili, propelerji, kovanci, vzmeti in lopatice motorjev. Lekcija gre od enega konkretnega primera (zakaj se baker in nikelj mešata v vsakem razmerju) do splošnih pravil za medenine, brone in superzlitine.

## Razlaga

### Konkreten primer: zlitina Cu-Ni

Baker in nikelj imata enako kristalno mrežo (ploskovno centrirano kubično), skoraj enak atomski polmer (Cu $128\,\mathrm{pm}$, Ni $125\,\mathrm{pm}$), podobno elektronegativnost in valenco. Zato atom niklja lahko zamenja atom bakra na katerem koli mestu mreže. Nastane **neomejena trdna raztopina**: vsaka sestava od čistega bakra do čistega niklja je v trdnem stanju ena sama faza $\alpha$.

Fazni diagram takega para je **izomorfni** diagram: zgoraj talina, spodaj $\alpha$, vmes leča, kjer sta talina in $\alpha$ skupaj.

```
T ^                    o 1455
  |       L        _.-'|
  |            _.-'  _/
  |        _.-' L+a_/
  |    _.-'    __/
  |_.-'    __/    a
  o____---
  | 1085
  +-------------------> % Ni
  Cu                  Ni
```

Na skici je a faza $\alpha$. Zgornja krivulja je **likvidus**, spodnja **solidus**. Leva točka je tališče bakra ($1085\,^\circ\mathrm C$), desna tališče niklja ($1455\,^\circ\mathrm C$). Zlitina se ne strdi pri eni temperaturi, temveč v intervalu med likvidusom in solidusom.

V dvofaznem področju potegnemo vodoravno **vezno črto** pri dani temperaturi. Kjer seka likvidus, odčitamo sestavo taline $C_\mathrm{L}$, kjer seka solidus, sestavo trdne faze $C_\alpha$. Deleža faz da **vzvodno pravilo**:

$$W_\mathrm{L} = \frac{C_\alpha - C_0}{C_\alpha - C_\mathrm{L}}$$

$$W_\alpha = \frac{C_0 - C_\mathrm{L}}{C_\alpha - C_\mathrm{L}}$$

Pri tem je $C_0$ sestava zlitine. Ime pravila izvira iz vzvoda: faza, ki je sestavi zlitine bližje, je je več.

### Od primera do pravila: Hume-Rotheryjeva pravila

Kar smo videli pri Cu-Ni, je splošno. **Hume-Rotheryjeva pravila** povedo, kdaj sta kovini v trdnem stanju neomejeno topni:

1. razlika atomskih polmerov je manjša od okoli $15\,\%$;
2. enaka kristalna mreža;
3. podobna elektronegativnost;
4. enaka valenca.

Če kateri pogoj ni izpolnjen, je topnost omejena in pri večjih deležih nastanejo nove faze. To se zgodi pri medeninah in bronih.

:::premisli
Cink ima polmer $134\,\mathrm{pm}$, a heksagonalno mrežo in valenco $2$. Kaj pričakuješ za topnost cinka v bakru: neomejena, omejena ali skoraj nič?
---
Omejena. Polmer se razlikuje le za okoli $5\,\%$, zato se cink v bakru dobro raztaplja (do okoli $39\,\%$). Mreža in valenca pa se razlikujeta, zato topnost ni neomejena: pri večjih deležih nastane nova faza $\beta$.
:::

### Baker

Čisti baker ima gostoto $8{,}96\,\mathrm{g/cm^3}$, modul elastičnosti okoli $120\,\mathrm{GPa}$ in se tali pri $1085\,^\circ\mathrm C$. Je odličen električni in toplotni prevodnik. Za primerjavo prevodnosti uporabljamo **mednarodni standard žarjenega bakra** (IACS): $100\,\%$ IACS je $58{,}0\,\mathrm{MS/m}$.

Vsak tuj atom v mreži siplje elektrone in zmanjša prevodnost, že majhni deleži fosforja ali železa jo močno znižajo. Zato je za vodnike najboljši čisti baker, utrjen le s hladnim preoblikovanjem. Zlitine bakra so trdnejše, a slabše prevajajo: to je glavni kompromis pri izbiri.

### Medenine (Cu-Zn)

**Definicija.** **Medenina** je zlitina bakra s cinkom kot glavnim legirnim elementom.

- **Medenina $\alpha$** (do okoli $37\,\%$ Zn): trdna raztopina z mrežo bakra, zelo dobro se hladno preoblikuje. CuZn30 se uporablja za globoko vlečenje (tulci, cevi). Do okoli $30\,\%$ Zn cink poveča *hkrati* trdnost in raztezek, kar je pri zlitinah redko.
- **Medenina $\alpha + \beta$** ($37$ do $45\,\%$ Zn): vsebuje fazo $\beta$ s kubično telesno centrirano mrežo. Pri sobni temperaturi je $\beta$ urejena ($\beta'$), trša in krhkejša. Nad okoli $450\,^\circ\mathrm C$ postane neurejena in duktilna, zato te medenine **vroče** preoblikujemo (kovanje, iztiskanje). Primer je CuZn40.
- **Automatna medenina** CuZn39Pb3: svinec se v bakru ne raztaplja in ostane v drobnih kroglicah. Odrezki se lomijo na kratko, struženje je hitro. Za pitno vodo so nove medenine s silicijem ali bizmutom.

Dve slabosti medenine:

- **Razcinkanje**: v mehki vodi ali kloridih se cink selektivno raztaplja, ostane porozen, šibek baker. Zavira ga malo arzena v medenini $\alpha$.
- **Napetostno korozijsko pokanje**: hladno preoblikovana medenina z zaostalimi napetostmi poka v okolju z amoniakom. Pomaga žarjenje za odpravo napetosti pri okoli $250$ do $300\,^\circ\mathrm C$.

### Broni

**Definicija.** **Bron** je zlitina bakra z glavnim legirnim elementom, ki ni cink ali nikelj. Brez pridevnika običajno pomeni kositrov bron.

- **Kositrov bron** (Cu-Sn): gnetni do okoli $8\,\%$ Sn (fosforjev bron CuSn8, fosfor pri litju odstrani kisik), za vzmeti in drsne elemente. Livni broni z $10$ do $12\,\%$ Sn vsebujejo trdo fazo $\delta$ v mehki osnovi: idealno za ležaje, ker trdi delci nosijo, mehka osnova pa se prilagodi gredi. Zvonovina ima okoli $20$ do $22\,\%$ Sn in je trda in krhka, a lepo zveni.
- **Aluminijev bron** (okoli $10\,\%$ Al, z Ni in Fe): visoka trdnost in odpornost proti morski vodi in kavitaciji, za ladijske propelerje in črpalke. Na površini nastane plast $\mathrm{Al_2O_3}$.
- **Berilijev baker** (okoli $2\,\%$ Be): izločevalno utrjevalen kot aluminijeve zlitine. Po raztopnem žarjenju (okoli $790\,^\circ\mathrm C$), gašenju in staranju (okoli $320\,^\circ\mathrm C$) doseže natezno trdnost do okoli $1300\,\mathrm{MPa}$. Uporaba: vzmeti in kontakti, orodje, ki ne iskri. Prah berilija je strupen, zato obdelava zahteva zaščito.

### Bakrovo-nikljeve zlitine

Ker se Cu in Ni mešata v vsakem razmerju, je družina zvezna:

- **CuNi10Fe1Mn** in **CuNi30Mn1Fe**: cevi kondenzatorjev in ladijski cevovodi za morsko vodo, odporni proti obraščanju;
- **konstantan** (CuNi44): električna upornost se s temperaturo skoraj ne spreminja, za merilne upore in termočlene;
- **monel** (okoli $65\,\%$ Ni, ostalo večinoma Cu): kemijska industrija, morska tehnika;
- kovanci: belo kovino daje CuNi25.

### Nikelj in superzlitine

Nikelj ima ploskovno centrirano kubično mrežo vse do tališča $1455\,^\circ\mathrm C$, brez premene. Zato ni nenadnih sprememb prostornine, drsnih sistemov je veliko in kovina je žilava tudi vroča. Gostota je $8{,}90\,\mathrm{g/cm^3}$, modul okoli $200\,\mathrm{GPa}$.

**Definicija.** **Superzlitina** je zlitina na osnovi niklja, kobalta ali železa, ki ohrani trdnost, odpornost proti lezenju in oksidaciji nad okoli $0{,}6$ tališča v kelvinih. **Lezenje** je počasna trajna deformacija pod stalno napetostjo pri visoki temperaturi.

Zgradba:

- osnova **$\gamma$**: trdna raztopina niklja s kromom, kobaltom, molibdenom, volframom in renijem. Krom tvori zaščitno plast $\mathrm{Cr_2O_3}$, težki atomi upočasnijo difuzijo;
- izločki **$\gamma'$**: urejena faza $\mathrm{Ni_3(Al,Ti)}$, kocke velikosti okoli $0{,}3$ do $0{,}5\,\mu\mathrm m$, koherentne z osnovo, pri lopaticah do okoli $60$ do $70\,\%$ prostornine;
- na mejah zrn karbidi ter malo bora in cirkonija, ki zavirajo drsenje po mejah.

Faza $\gamma'$ je posebna: njena meja tečenja z naraščajočo temperaturo do okoli $800\,^\circ\mathrm C$ *narašča*. Dislokacija, ki vstopi v urejeno mrežo, pusti za seboj napačno razporejene atome (protifazno mejo), zato se dislokacije gibljejo v parih.

**Razvoj lopatic** sledi ideji, da lezenje pri visoki temperaturi poteka ob mejah zrn:

1. litje z enakoosnimi zrni (meje v vseh smereh);
2. **usmerjeno strjevanje**: stebričasta zrna vzdolž lopatice, ni prečnih mej;
3. **monokristal**: lopatica je en sam kristal, mej sploh ni. Odpadejo elementi za meje zrn (bor, cirkonij), ki nižajo tališče, zato smemo zlitino raztopno žariti pri višji temperaturi.

Inconel 718 je druga pomembna vrsta: utrjuje ga faza $\gamma''$ ($\mathrm{Ni_3Nb}$), dobro se vari in je standard za diske turbin do okoli $650\,^\circ\mathrm C$.

:::premisli
Zakaj monokristalno lopatico, ki je dražja, sploh potrebujemo, če ima zlitina z drobnimi zrni pri sobni temperaturi celo večjo mejo plastičnosti?
---
Pri sobni temperaturi meje zrn ovirajo dislokacije in utrjujejo. Pri visoki temperaturi pa ob mejah poteka difuzija in drsenje zrn, kar pospeši lezenje in nastanek por na mejah. Pri lopatici odloča lezenje, ne meja plastičnosti pri sobni temperaturi.
:::

**Napoved časa do loma pri lezenju.** Larson-Millerjev parameter združi temperaturo $T$ v kelvinih in čas do loma $t_\mathrm{r}$ v urah:

$$P = T\,(C + \log_{10} t_\mathrm{r})$$

Konstanta $C$ je za večino kovin okoli $20$. Za dano zlitino je $P$ odvisen le od napetosti, zato iz kratkega preizkusa pri višji temperaturi ocenimo dolgo življenjsko dobo pri nižji.

## Rešeni primeri

### Primer 1 (lažji): vodnik iz bakra ali medenine

Vodnik dolžine $10\,\mathrm m$ s prerezom $2{,}5\,\mathrm{mm^2}$ je iz žarjenega bakra ($58{,}0\,\mathrm{MS/m}$) ali iz medenine CuZn37 ($15{,}5\,\mathrm{MS/m}$). Izračunaj upornost obeh in prevodnost medenine v odstotkih IACS.

**Podatki:** $L = 10\,\mathrm m$, $A = 2{,}5\,\mathrm{mm^2} = 2{,}5 \cdot 10^{-6}\,\mathrm{m^2}$, $\sigma_\mathrm{Cu} = 58{,}0\,\mathrm{MS/m}$, $\sigma_\mathrm{M} = 15{,}5\,\mathrm{MS/m}$
**Iščemo:** upornosti $R$ in prevodnost medenine v $\%$ IACS

:::formula
$R = \dfrac{L}{\sigma A}$, prevodnost v $\%$ IACS $= \dfrac{\sigma}{58{,}0\,\mathrm{MS/m}} \cdot 100\,\%$
:::

**Rešitev:**

1. Baker: $R = \dfrac{10}{58 \cdot 10^{6} \cdot 2{,}5 \cdot 10^{-6}} \approx 0{,}0690\,\Omega$.
2. Medenina: $R = \dfrac{10}{15{,}5 \cdot 10^{6} \cdot 2{,}5 \cdot 10^{-6}} \approx 0{,}258\,\Omega$.
3. Prevodnost medenine: $\dfrac{15{,}5}{58{,}0} \cdot 100 \approx 26{,}7\,\%$ IACS.
4. Zakaj tolikšna razlika: atomi cinka v mreži sipljejo elektrone. Trdnost se poveča, prevodnost pade na četrtino.
5. Odgovor: bakreni vodnik ima okoli $0{,}069\,\Omega$, medeninast okoli $0{,}26\,\Omega$; medenina prevaja okoli $27\,\%$ IACS.

### Primer 2: strjevanje zlitine Cu-Ni

Talino z $35\,\%$ Ni (masni delež) ohlajamo. Pri $1250\,^\circ\mathrm C$ seka vezna črta likvidus pri $31{,}5\,\%$ Ni in solidus pri $42{,}5\,\%$ Ni. Kolikšna sta deleža faz in masi faz v $5\,\mathrm{kg}$ zlitine? Preveri z bilanco niklja.

**Podatki:** $C_0 = 35\,\%$, $C_\mathrm{L} = 31{,}5\,\%$, $C_\alpha = 42{,}5\,\%$, $m = 5\,\mathrm{kg}$, $T = 1250\,^\circ\mathrm C$
**Iščemo:** $W_\mathrm{L}$, $W_\alpha$, masi faz

:::formula
$W_\mathrm{L} = \dfrac{C_\alpha - C_0}{C_\alpha - C_\mathrm{L}}$, $W_\alpha = \dfrac{C_0 - C_\mathrm{L}}{C_\alpha - C_\mathrm{L}}$
:::

**Rešitev:**

1. Imenovalec: $42{,}5 - 31{,}5 = 11$.
2. Talina: $W_\mathrm{L} = \dfrac{42{,}5 - 35}{11} \approx 0{,}682$.
3. Trdna faza: $W_\alpha = \dfrac{35 - 31{,}5}{11} \approx 0{,}318$; vsota je $1$.
4. Masi: $5 \cdot 0{,}682 \approx 3{,}41\,\mathrm{kg}$ taline in $5 \cdot 0{,}318 \approx 1{,}59\,\mathrm{kg}$ faze $\alpha$.
5. Bilanca niklja: $3{,}409 \cdot 0{,}315 + 1{,}591 \cdot 0{,}425 \approx 1{,}074 + 0{,}676 = 1{,}75\,\mathrm{kg}$, kar je $35\,\%$ od $5\,\mathrm{kg}$. Pravilo se ujema.
6. Odgovor: pri $1250\,^\circ\mathrm C$ je okoli $68\,\%$ taline ($3{,}4\,\mathrm{kg}$) in $32\,\%$ trdne faze ($1{,}6\,\mathrm{kg}$).

### Primer 3 (težji): lopatica turbine

Lopatica turbine iz monokristalne nikljeve superzlitine ($\rho = 8700\,\mathrm{kg/m^3}$) ima stalen prerez in sega od polmera $0{,}30\,\mathrm m$ do $0{,}40\,\mathrm m$. Rotor se vrti z $8000$ obrati na minuto. Iz preizkusov lezenja je Larson-Millerjev parameter ($C = 20$, $T$ v K, $t$ v h) pri $200\,\mathrm{MPa}$ enak $27\,000$, pri $300\,\mathrm{MPa}$ pa $25\,500$; vmes velja linearna interpolacija. (a) Kolikšna je napetost v korenu lopatice? (b) Kolikšna je največja temperatura kovine za čas do loma $10\,000\,\mathrm h$? (c) Kolikšen je čas do loma, če je kovina za $50\,\mathrm K$ toplejša?

**Podatki:** $\rho = 8700\,\mathrm{kg/m^3}$, $r_\mathrm{n} = 0{,}30\,\mathrm m$, $r_\mathrm{z} = 0{,}40\,\mathrm m$, $n = 8000\,\mathrm{min^{-1}}$, $P(200\,\mathrm{MPa}) = 27\,000$, $P(300\,\mathrm{MPa}) = 25\,500$, $C = 20$, $t_\mathrm{r} = 10\,000\,\mathrm h$, $\Delta T = 50\,\mathrm K$
**Iščemo:** $\sigma$, $T$, novi $t_\mathrm{r}$

:::formula
napetost v korenu lopatice s stalnim prerezom: $\sigma = \dfrac{\rho\,\omega^2 (r_\mathrm{z}^2 - r_\mathrm{n}^2)}{2}$, $\omega = \dfrac{2\pi n}{60}$; $P = T\,(C + \log_{10} t_\mathrm{r})$
:::

**Rešitev:**

1. Kotna hitrost: $\omega = \dfrac{2\pi \cdot 8000}{60} \approx 837{,}8\,\mathrm{s^{-1}}$, $\omega^2 \approx 7{,}018 \cdot 10^{5}\,\mathrm{s^{-2}}$.
2. Razlika kvadratov: $0{,}40^2 - 0{,}30^2 = 0{,}07\,\mathrm{m^2}$.
3. (a) $\sigma = \dfrac{8700 \cdot 7{,}018 \cdot 10^{5} \cdot 0{,}07}{2} \approx 2{,}137 \cdot 10^{8}\,\mathrm{Pa} \approx 214\,\mathrm{MPa}$. Napetost ni odvisna od prereza: večji prerez nosi večjo maso.
4. Interpolacija: $P$ pade za $1500$ na $100\,\mathrm{MPa}$, torej $P \approx 27\,000 - 15 \cdot 13{,}7 \approx 26\,794$.
5. (b) $T = \dfrac{P}{C + \log_{10} t_\mathrm{r}} = \dfrac{26\,794}{20 + 4} \approx 1116\,\mathrm K$, to je okoli $843\,^\circ\mathrm C$.
6. (c) Pri $T = 1166\,\mathrm K$: $\log_{10} t_\mathrm{r} = \dfrac{26\,794}{1166{,}4} - 20 \approx 2{,}97$, torej $t_\mathrm{r} \approx 10^{2{,}97} \approx 940\,\mathrm h$.
7. Odgovor: napetost v korenu je okoli $214\,\mathrm{MPa}$, kovina sme biti vroča največ okoli $843\,^\circ\mathrm C$, pri $50\,\mathrm K$ višji temperaturi pa se čas do loma skrajša z $10\,000$ na okoli $940\,\mathrm h$, več kot desetkrat. Zato so hlajenje lopatic in toplotne zaščitne plasti tako pomembni.

### Primer 4 – zdaj ti: merilni upor

Merilni upor (šant) ima pri $20\,^\circ\mathrm C$ upornost $0{,}0100\,\Omega$ in skozenj teče $20\,\mathrm A$. Med obratovanjem se segreje na $70\,^\circ\mathrm C$. Temperaturni koeficient upornosti bakra je $0{,}0039\,\mathrm{K^{-1}}$, konstantana okoli $2 \cdot 10^{-5}\,\mathrm{K^{-1}}$. Za koliko odstotkov se spremeni upornost in kakšno napetost pokaže voltmeter na šantu iz vsakega materiala?

**Podatki:** $R_0 = 0{,}0100\,\Omega$, $I = 20\,\mathrm A$, $\Delta T = 50\,\mathrm K$, $\alpha_\mathrm{Cu} = 0{,}0039\,\mathrm{K^{-1}}$, $\alpha_\mathrm{K} = 2 \cdot 10^{-5}\,\mathrm{K^{-1}}$
**Iščemo:** relativni spremembi upornosti, napetosti $U$

:::formula
$R = R_0\,(1 + \alpha\,\Delta T)$, $U = I R$
:::

**Rešitev:**

1. Pri $20\,^\circ\mathrm C$: $U = 20 \cdot 0{,}01 = 0{,}2\,\mathrm V$ za oba materiala.
2. Baker: $\alpha\,\Delta T = 0{,}0039 \cdot 50 = 0{,}195$.
3. Izračunaj še upornost bakrenega in konstantanskega šanta pri $70\,^\circ\mathrm C$, napetosti in napako meritve toka, če merilnik predpostavlja $0{,}0100\,\Omega$.

:::premisli
Kakšni so rezultati in kateri material izbereš?
---
Baker: $R = 0{,}01195\,\Omega$ (za $19{,}5\,\%$ več), $U = 0{,}239\,\mathrm V$, merilnik pokaže $23{,}9\,\mathrm A$ namesto $20\,\mathrm A$. Konstantan: $\alpha\,\Delta T = 0{,}001$, $R = 0{,}01001\,\Omega$ (za $0{,}1\,\%$ več), $U = 0{,}2002\,\mathrm V$, napaka $0{,}1\,\%$. Izbereš konstantan: zlitina Cu-Ni ima zaradi neurejene trdne raztopine veliko upornost, ki je malo odvisna od temperature.
:::

## Pogoste napake

- **»Bron je zlitina bakra s cinkom.«** To je medenina. Bron je zlitina bakra s kositrom, aluminijem, berilijem ali silicijem.
- **»Več cinka pomeni vedno boljšo medenino.«** Do okoli $30\,\%$ Zn trdnost in raztezek rasteta. Nad okoli $37\,\%$ nastane faza $\beta$; medenina je trša, a se slabo hladno preoblikuje in je bolj nagnjena k razcinkanju.
- **»Zlitina ima eno tališče kot čista kovina.«** Zlitina Cu-Ni se strjuje v intervalu med likvidusom in solidusom; sestavi taline in trdne faze se med strjevanjem spreminjata.
- **Vzvodno pravilo narobe obrnjeno.** Delež taline je v števcu razdalja od $C_0$ do *solidusa* (nasprotne strani), ne do likvidusa.
- **»Superzlitino utrdimo z drobnimi zrni, kot jeklo.«** Pri visoki temperaturi meje zrn pospešijo lezenje. Zato so najboljše lopatice monokristali, trdnost pa dajo izločki $\gamma'$.

## Povzetek

- Cu in Ni: izomorfni sistem, neomejena trdna raztopina (Hume-Rotheryjeva pravila), strjevanje v intervalu, vzvodno pravilo $W_\mathrm{L} = \frac{C_\alpha - C_0}{C_\alpha - C_\mathrm{L}}$.
- Gostota bakra je $8{,}96\,\mathrm{g/cm^3}$. Standard $100\,\%$ IACS je $58{,}0\,\mathrm{MS/m}$. Legiranje poveča trdnost in zmanjša prevodnost.
- Medenina (Cu-Zn): $\alpha$ do okoli $37\,\%$ Zn za hladno preoblikovanje, $\alpha + \beta$ za vroče; svinec za obdelovalnost; razcinkanje, napetostno korozijsko pokanje.
- Broni: kositrov (vzmeti, ležaji, zvonovi), aluminijev (propelerji, morska voda), berilijev (izločevalno utrjevanje, do okoli $1300\,\mathrm{MPa}$).
- Cu-Ni zlitine: cevi za morsko vodo, konstantan, monel, kovanci.
- Nikljeve superzlitine: osnova $\gamma$, izločki $\gamma'$ $\mathrm{Ni_3(Al,Ti)}$, Cr za oksidacijo; monokristalne lopatice; Larson-Miller $P = T(C + \log_{10} t_\mathrm{r})$.

## Za izpit

Znati moraš povedati:

- Hume-Rotheryjeva pravila in zakaj sta Cu in Ni neomejeno topna, Cu in Zn pa ne;
- izpeljavo vzvodnega pravila iz masne bilance;
- razliko med medenino $\alpha$ in $\alpha + \beta$ ter pomen svinca, arzena in žarjenja za odpravo napetosti;
- vrste bronov z uporabo in postopek utrjevanja berilijevega bakra;
- zgradbo nikljeve superzlitine ($\gamma$, $\gamma'$, elementi in njihova vloga) ter zakaj so lopatice monokristalne;
- Larson-Millerjev parameter in njegovo uporabo.

### Naloga 1

Lopatica iz superzlitine je obremenjena z $250\,\mathrm{MPa}$. Za zlitino velja $P = 27\,000 - 15\,(\sigma/\mathrm{MPa} - 200)$ ($C = 20$, $T$ v K, $t$ v h). Brez zaščitne plasti je površina kovine vroča $1000\,^\circ\mathrm C$. Keramična toplotna zaščitna plast iz cirkonijevega oksida debeline $0{,}25\,\mathrm{mm}$ ima toplotno prevodnost $1{,}0\,\mathrm{W/(m\,K)}$, skozi njo teče toplotni tok $0{,}5\,\mathrm{MW/m^2}$. Predpostavi, da se temperatura kovine zniža za ves padec temperature na plasti. (a) Kolikšen je čas do loma brez plasti in s plastjo? (b) Kolikšna sme biti temperatura kovine za $20\,000\,\mathrm h$?

**Rešitev:**

1. Parameter pri $250\,\mathrm{MPa}$: $P = 27\,000 - 15 \cdot 50 = 26\,250$.
2. Padec temperature na plasti: $\Delta T = \dfrac{q\,d}{\lambda} = \dfrac{0{,}5 \cdot 10^{6} \cdot 0{,}25 \cdot 10^{-3}}{1{,}0} = 125\,\mathrm K$.
3. Brez plasti $T = 1273{,}15\,\mathrm K$: $\log_{10} t_\mathrm{r} = \dfrac{26\,250}{1273{,}15} - 20 \approx 0{,}618$, $t_\mathrm{r} \approx 4{,}2\,\mathrm h$.
4. S plastjo $T = 1148{,}15\,\mathrm K$: $\log_{10} t_\mathrm{r} = \dfrac{26\,250}{1148{,}15} - 20 \approx 2{,}863$, $t_\mathrm{r} \approx 730\,\mathrm h$.
5. Razmerje: plast podaljša življenjsko dobo za okoli $176$-krat.
6. (b) $T = \dfrac{26\,250}{20 + \log_{10} 20\,000} \approx \dfrac{26\,250}{24{,}301} \approx 1080\,\mathrm K$, okoli $807\,^\circ\mathrm C$.
7. Odgovor: brez plasti lopatica zdrži le okoli $4\,\mathrm h$, s plastjo okoli $730\,\mathrm h$; za $20\,000\,\mathrm h$ mora biti kovina hladnejša od okoli $807\,^\circ\mathrm C$. Zato lopatice poleg plasti hladijo še z zrakom skozi notranje kanale.

### Naloga 2

Navedi Hume-Rotheryjeva pravila in z njimi utemelji, zakaj je diagram Cu-Ni izomorfen, diagram Cu-Zn pa ima več faz. Izpelji vzvodno pravilo. Pojasni, zakaj izločki $\gamma'$ utrjujejo nikljeve superzlitine tudi pri $800\,^\circ\mathrm C$.

**Rešitev:**

1. Pravila: razlika polmerov pod okoli $15\,\%$, enaka mreža, podobna elektronegativnost, enaka valenca. Pri Cu-Ni so izpolnjena vsa (FCC, $128$ in $125\,\mathrm{pm}$, valenci podobni), zato je raztopina neomejena. Cink ima heksagonalno mrežo in valenco $2$, zato je topnost omejena; z večjim deležem elektronov na atom postanejo stabilne faze $\beta$, $\gamma$ in druge.
2. Izpeljava: masa zlitine $m = m_\mathrm{L} + m_\alpha$, masa niklja $m\,C_0 = m_\mathrm{L} C_\mathrm{L} + m_\alpha C_\alpha$.
3. Delimo z $m$: $C_0 = W_\mathrm{L} C_\mathrm{L} + (1 - W_\mathrm{L}) C_\alpha$, torej $W_\mathrm{L} (C_\alpha - C_\mathrm{L}) = C_\alpha - C_0$.
4. Sledi $W_\mathrm{L} = \dfrac{C_\alpha - C_0}{C_\alpha - C_\mathrm{L}}$ in $W_\alpha = 1 - W_\mathrm{L} = \dfrac{C_0 - C_\mathrm{L}}{C_\alpha - C_\mathrm{L}}$.
5. $\gamma'$: urejena faza $\mathrm{Ni_3(Al,Ti)}$, koherentna z $\gamma$, z velikim deležem prostornine. Dislokacija, ki vstopi vanjo, ustvari protifazno mejo, zato morajo dislokacije potovati v parih, kar zahteva večjo napetost. Pri višji temperaturi se dislokacije prečno zdrsnejo v lege, kjer se težje gibljejo, zato meja tečenja raste do okoli $800\,^\circ\mathrm C$.
6. Ker je $\gamma'$ stabilna skoraj do $1200\,^\circ\mathrm C$, izločki rastejo počasi in zlitina se ne prestara hitro.

## Drugače: Z analogijo

Kovinska mreža je kot parkirišče z enakimi mesti. Pri bakru in niklju so vsi avtomobili enako veliki in enake oblike: nikljev avto lahko parkira na katero koli mesto bakrovega, zato parkirišče sprejme poljubno mešanico (neomejena topnost). Cinkovi avtomobili so podobno dolgi, a drugače oblikovani: nekaj jih gre med bakrove, pri preveč pa je treba narisati novo parkirišče z drugačno razporeditvijo (faza $\beta$).

Superzlitina je kot avtocesta z zidaki: osnova $\gamma$ je pas, kocke $\gamma'$ so zidaki, ki stojijo tesno skupaj. Dislokacija je tovornjak, ki mora skozi. Vsaka kocka mu ponuja »napačno« pot, zato gre lahko skozi le v koloni dveh.

## Drugače: Uporaba v stroki

- **Elektroindustrija.** Vodniki in navitja iz bakra brez kisika (Cu-OF, vsaj $99{,}95\,\%$ Cu); vodila v stikalih in konektorjih iz CuSn ali CuBe2, ker morajo biti hkrati vzmet in prevodnik.
- **Vodovod.** Ventili in fitingi iz medenin z malo svinca, odpornih proti razcinkanju.
- **Ladjedelništvo.** Propelerji iz nikljevega aluminijevega brona, kondenzatorske cevi iz CuNi10Fe1Mn; pazi na galvanski stik z jeklenim trupom.
- **Letalski in energetski motorji.** Monokristalne lopatice prve stopnje turbine, diski iz Inconela 718, keramična zaščitna plast in hladilni kanali.

## Drugače: Bolj natančno

**Izcejanje.** Vzvodno pravilo velja v ravnotežju, ko difuzija izenači sestavo trdne faze. Pri realnem litju je difuzija v trdnem prepočasna: prva jedra zrn so bogata z nikljem, zadnja plast bogata z bakrom. To je **izcejanje** (koringov pojav). Odpravimo ga s **homogenizacijskim žarjenjem** pod solidusom.

**Faze v medenini.** Z naraščajočim deležem cinka si sledijo faze $\alpha$ (FCC), $\beta$ (BCC), $\gamma$ (kompleksna kubična, krhka) in druge. Pojavijo se pri značilnem številu valenčnih elektronov na atom ($3/2$ za $\beta$, $21/13$ za $\gamma$). Takšne faze imenujemo elektronske faze; podobne nastopijo tudi pri Cu-Sn in Cu-Al.

## Preveri se

? Katera zlitina ne spada med ostale?
- CuSn8
~ Kositrov bron, tudi ta je zlitina na osnovi bakra.
- CuZn37
~ Medenina, zlitina na osnovi bakra.
- CuNi30Mn1Fe
~ Bakrovo-nikljeva zlitina, osnova je še vedno baker.
+ Inconel 718
> Inconel 718 je superzlitina na osnovi niklja; ostale tri so zlitine na osnovi bakra.

? Zlitina Cu-Ni s $36\,\%$ Ni je pri neki temperaturi v dvofaznem področju; talina ima $32\,\%$ Ni, trdna faza $48\,\%$ Ni. Kolikšen je delež taline?
- $0{,}25$
~ Vzvod si obrnil: razdalja do likvidusa ($4$) da delež trdne faze, ne taline.
+ $0{,}75$
- $0{,}5$
~ Polovica velja le, če je sestava zlitine na sredini vezne črte ($40\,\%$).
- $0{,}89$
~ Delil si $32$ s $36$; vzvodno pravilo uporablja razlike sestav.
> $W_\mathrm{L} = \frac{48 - 36}{48 - 32} = 0{,}75$. Zlitina je bližje likvidusu, zato je taline več.

? Kaj je posledica tega, da je baker legiran z $2\,\%$ berilija in staran?
- večja električna prevodnost kot pri čistem bakru
~ Vsak legirni element zmanjša prevodnost; staranje jo le delno vrne.
+ zelo velika trdnost zaradi drobnih izločkov, zato je primeren za vzmeti
- zlitina postane magnetna
~ Berilij ni feromagneten; magnetnost ni povezana z izločki.
- zlitina se tali pri višji temperaturi kot baker
~ Legiranje bakra tališče navadno zniža.
> Cu-Be je izločevalno utrjevalen: raztopno žarjenje, gašenje in staranje dajo do okoli $1300\,\mathrm{MPa}$.

? Študent je izračunal čas do loma: (1) $P = 26\,250$; (2) $T = 1000\,^\circ\mathrm C$; (3) $\log_{10} t_\mathrm{r} = 26\,250/1000 - 20 = 6{,}25$; (4) $t_\mathrm{r} \approx 1{,}8 \cdot 10^{6}\,\mathrm h$. Kateri korak je napačen?
- korak 1
~ Parameter je dan pravilno.
+ korak 3, ker temperatura ni v kelvinih
- korak 4
~ Iz $6{,}25$ je $10^{6{,}25}$ res okoli $1{,}8 \cdot 10^{6}$; napaka je prej.
- noben
~ Rezultat bi pomenil $200$ let pod obremenitvijo, kar je za lopatico nemogoče.
> V parameter gre $T = 1273{,}15\,\mathrm K$; potem je $\log_{10} t_\mathrm{r} \approx 0{,}62$ in $t_\mathrm{r} \approx 4\,\mathrm h$.

? Medeninast ventil v hiši z mehko, kloridno vodo je po nekaj letih rdečkast, porozen in pušča. Kaj se je zgodilo in kaj bi pomagalo?
- napetostno korozijsko pokanje; pomaga debelejša stena
~ Pokanje pušča razpoke, ne rdečkaste porozne plasti; vzrok je amoniak, ne kloridi.
+ razcinkanje; pomaga medenina $\alpha$ z arzenom ali bron
- oksidacija bakra; pomaga barva
~ Bakrovi oksidi so temni in tanki; porozen baker kaže na izgubo cinka.
- prestaranje; pomaga ponovno staranje
~ Medenina ni izločevalno utrjevalna, staranje tu nima vloge.
> Cink se selektivno raztopi, ostane porozen baker. Odporne so medenine $\alpha$ z malo arzena (DZR) ali zlitine brez cinka.

:::simboli
C_0 | sestava zlitine | | – | masni delež niklja v odstotkih
C_\mathrm{L} | sestava taline | | – | odčitana na likvidusu
C_\alpha | sestava trdne faze $\alpha$ | | – | odčitana na solidusu
W_\mathrm{L} | masni delež taline | W_\mathrm{L} = \frac{C_\alpha - C_0}{C_\alpha - C_\mathrm{L}} | –
W_\alpha | masni delež faze $\alpha$ | W_\alpha = \frac{C_0 - C_\mathrm{L}}{C_\alpha - C_\mathrm{L}} | –
R | električna upornost | R = \frac{L}{\sigma A} | \Omega
L | dolžina vodnika | | m
A | prerez vodnika | | m^2
\sigma | električna prevodnost ali mehanska napetost | | MS/m | napetost v MPa
\sigma_\mathrm{Cu} | prevodnost bakra | | MS/m
\sigma_\mathrm{M} | prevodnost medenine | | MS/m
P | Larson-Millerjev parameter | P = T\,(C + \log_{10} t_\mathrm{r}) | – | $T$ v K, $t_\mathrm{r}$ v h
T | absolutna temperatura | | K
C | Larson-Millerjeva konstanta | | – | okoli 20
t_\mathrm{r} | čas do loma pri lezenju | | h
\rho | gostota | | kg/m^3
\omega | kotna hitrost | \omega = \frac{2\pi n}{60} | s^{-1}
n | vrtilna frekvenca | | min^{-1}
r_\mathrm{n} | notranji polmer lopatice | | m
r_\mathrm{z} | zunanji polmer lopatice | | m
R_0 | upornost pri 20 °C | | \Omega
\alpha | temperaturni koeficient upornosti | | K^{-1}
\Delta T | sprememba temperature | | K
U | napetost | U = I R | V
I | električni tok | | A
:::
