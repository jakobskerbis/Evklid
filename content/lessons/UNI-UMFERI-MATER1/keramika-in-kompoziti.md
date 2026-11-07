---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Keramični kuhinjski nož je trši od vsakega jeklenega in ostane oster leta. Ko pa pade na ploščice, se odkruši ali prelomi, jekleni nož pa se kvečjemu skrivi. Betonski steber nosi stavbo, betonska greda brez jeklenih palic pa poči že pod lastno težo. Na videz gre za kuhinjo in gradbišče, v resnici za isto strukturo: material, ki zelo dobro prenaša tlak, a ga v nategu uniči že drobna razpoka.

Prvi del lekcije pojasni, zakaj je keramika taka: kakšna je njena zgradba in zakaj razpoka v njej ne obstane. Drugi del pokaže rešitev, ki jo inženirji uporabljajo povsod, od betona do letalskih kril: **kompozit**, v katerem drug material prevzame tisto, česar prvi ne zmore. Lastnosti kompozita se dajo izračunati iz podatkov o sestavinah, kar je vsakdanje delo pri izbiri materiala.

## Razlaga

**1. Slika najprej: kristal keramike.** Zamisli si ravnino kristala magnezijevega oksida MgO:

```
 O Mg  O Mg  O
Mg  O Mg  O Mg
 O Mg  O Mg  O
```

Vsak ion Mg²⁺ ima za sosede štiri ione O²⁻ v ravnini ter še enega nad in enega pod njo, skupaj šest. Ioni z enakim nabojem se nikoli ne dotikajo. Če bi hoteli eno vrstico premakniti za en ion v desno, bi za trenutek prišli $\mathrm{Mg^{2+}}$ ob $\mathrm{Mg^{2+}}$ in $\mathrm{O^{2-}}$ ob $\mathrm{O^{2-}}$; odboj je ogromen. To je bistvo krhkosti.

**Definicija.** **Keramika** so anorganski nekovinski materiali, navadno spojine kovin z nekovinami (oksidi, karbidi, nitridi, silikati), z **ionskimi** in **kovalentnimi** vezmi. Primeri: $\mathrm{Al_2O_3}$ (korund), $\mathrm{ZrO_2}$, SiC, $\mathrm{Si_3N_4}$, porcelan, steklo, beton.

**2. Kako so ioni razporejeni.** V ionski keramiki veljata dve pravili:

- **električna nevtralnost:** sestava je taka, da se naboji izničijo ($\mathrm{MgO}$, $\mathrm{Al_2O_3}$, $\mathrm{ZrO_2}$);
- **razmerje polmerov** kationa in aniona $\frac{r_\mathrm{K}}{r_\mathrm{A}}$ določa **koordinacijsko število** (število najbližjih anionov ob kationu). Kation mora »napolniti« prostor med anioni, sicer struktura ni stabilna.

Okvirne meje:

- $0{,}225$ do $0{,}414$: koordinacijsko število $4$ (tetraeder),
- $0{,}414$ do $0{,}732$: koordinacijsko število $6$ (oktaeder, kot NaCl),
- $0{,}732$ do $1$: koordinacijsko število $8$ (kocka, kot CsCl).

Pri **silikatih** je osnovna enota tetraeder $\mathrm{SiO_4^{4-}}$: ion silicija v sredini, štirje kisikovi ioni v ogliščih. Tetraedri se povezujejo prek skupnih kisikovih ionov v verige, plasti (glinenci, sljuda) ali tridimenzionalno mrežo (kremen). Steklo je enaka mreža brez reda dolgega dosega.

*Preveri v eni vrstici:* zakaj ima $\mathrm{Al_2O_3}$ ravno to formulo? (Dva iona $\mathrm{Al^{3+}}$ dasta $+6$, trije $\mathrm{O^{2-}}$ dajo $-6$.)

**3. Zakaj je keramika krhka.** V kovini se plastična deformacija zgodi z drsenjem **dislokacij**; kovinska vez ni usmerjena in ne loči nabojev, zato drsenje ne stane veliko. V ionski keramiki drsenje približa enako nabite ione (slika zgoraj), v kovalentni (SiC, diamant) pa bi moralo pretrgati usmerjene vezi. Drsnih sistemov je zato zelo malo, dislokacije se pri sobni temperaturi skoraj ne gibljejo.

Posledica: keramika se do loma deformira le elastično. Vsaka razpoka, por ali zrno nečistoče je mesto, kjer se napetost zbere, ne pa »razmaže« s plastično deformacijo.

```
   sigma
    |
 ---|---
  > |<  razpoka
 ---|---  dolžina a
    |
   sigma
```

Na konici razpoke z dolžino $a$ in polmerom konice $\rho$ je napetost približno $\sigma_\mathrm{max} = 2\sigma\sqrt{a/\rho}$, pri ostri razpoki večkrat večja od povprečne. Inženirska mera odpornosti je **lomna žilavost** $K_\mathrm{Ic}$:

$$K_\mathrm{Ic} = Y\sigma_\mathrm{c}\sqrt{\pi a}.$$

Pri tem je $\sigma_\mathrm{c}$ napetost, pri kateri se razpoka z dolžino $a$ nenadzorovano razširi, $Y \approx 1$ pa faktor oblike. Keramika ima $K_\mathrm{Ic} \approx 1$–$5\,\mathrm{MPa\,\sqrt{m}}$, jeklo $50$–$150\,\mathrm{MPa\,\sqrt{m}}$.

V **tlaku** se razpoke zapirajo, zato je tlačna trdnost keramike okoli desetkrat večja od natezne. Na trdnost močno vpliva tudi **poroznost**: že $5\,\%$ por lahko zmanjša trdnost za tretjino. Keramiko zato oblikujemo iz prahu in **sintramo** (segrejemo pod tališčem, da se zrna zrastejo in pore zaprejo).

:::premisli
Na dve enaki keramični palici naredimo zarezo: na prvo $0{,}1\,\mathrm{mm}$, na drugo $0{,}4\,\mathrm{mm}$ globoko. Kolikšna bo natezna trdnost druge palice v primerjavi s prvo?
---
Polovica. Iz $\sigma_\mathrm{c} = \frac{K_\mathrm{Ic}}{Y\sqrt{\pi a}}$ sledi, da štirikrat daljša razpoka zmanjša trdnost za $\sqrt{4} = 2$. Zato keramične dele polirajo: manjše površinske razpoke pomenijo večjo trdnost.
:::

**4. Kompoziti.** **Definicija.** **Kompozit** je material iz dveh ali več faz, ki so ločene z jasno mejo in skupaj dajo lastnosti, ki jih nobena faza sama nima. Zvezna faza je **matrica**, vgrajena faza je **ojačitev**.

Po obliki ojačitve ločimo:

- **delčne kompozite:** beton (kamni in pesek v cementu), trdine WC–Co (karbidni delci v kobaltu) za rezalna orodja;
- **vlaknaste kompozite:** steklena, ogljikova ali aramidna vlakna v polimeru; vlakna so dolga in usmerjena ali kratka in naključna;
- **strukturne kompozite:** laminati (plasti z različno smerjo vlaken) in sendviči (trdni plošči in lahka sredica, satovje ali pena).

Po matrici ločimo polimerne (PMC), kovinske (MMC) in keramične kompozite (CMC). Pri CMC (npr. SiC vlakna v SiC) vlakna premostijo razpoko in ji preprečijo, da bi se razširila; žilavost se poveča večkrat.

**5. Pravilo mešanic.** Pri enosmernem vlaknastem kompozitu sta dva skrajna primera.

Sila **vzdolž vlaken**: vlakna in matrica se raztegnejo enako (enaka deformacija). Sila se razdeli sorazmerno z $E \cdot V$, zato

$$E_\parallel = E_\mathrm{v}V_\mathrm{v} + E_\mathrm{m}V_\mathrm{m}.$$

Sila **prečno na vlakna**: obe fazi nosita enako napetost, deformaciji se seštejeta, zato

$$\frac{1}{E_\perp} = \frac{V_\mathrm{v}}{E_\mathrm{v}} + \frac{V_\mathrm{m}}{E_\mathrm{m}}.$$

Tu sta $V_\mathrm{v}$ in $V_\mathrm{m} = 1 - V_\mathrm{v}$ prostorninska deleža vlaken in matrice. Gostota je vedno $\rho = \rho_\mathrm{v}V_\mathrm{v} + \rho_\mathrm{m}V_\mathrm{m}$. Delež sile, ki ga vzdolž vlaken nosijo vlakna, je $\frac{E_\mathrm{v}V_\mathrm{v}}{E_\parallel}$.

Kratka vlakna prevzamejo silo prek strižne napetosti na meji z matrico. Da se vlakno obremeni do svoje trdnosti $\sigma_\mathrm{v}$, mora biti dolgo vsaj **kritično dolžino** $l_\mathrm{c} = \frac{\sigma_\mathrm{v}d}{2\tau_\mathrm{c}}$, kjer je $d$ premer vlakna in $\tau_\mathrm{c}$ strižna trdnost meje.

:::premisli
Kompozit z $60\,\%$ ogljikovih vlaken je vzdolž vlaken okoli $16$-krat bolj tog kot prečno. Kaj to pomeni za konstruktorja okvirja kolesa in kako to rešijo?
---
Enosmerni kompozit je močno anizotropen: prečno je skoraj tako mehak kot matrica. Okvir obremenijo sile v več smereh, zato zložijo **laminat** iz plasti z različno usmeritvijo vlaken (npr. $0°$, $\pm 45°$, $90°$), tako da je tog v vseh potrebnih smereh.
:::

## Rešeni primeri

### Primer 1 (lažji)

Z razmerjem polmerov napovej koordinacijsko število kationa v MgO, $\mathrm{SiO_2}$ in CsCl. Polmeri: $\mathrm{Mg^{2+}}$ $0{,}072\,\mathrm{nm}$, $\mathrm{Si^{4+}}$ $0{,}040\,\mathrm{nm}$, $\mathrm{Cs^{+}}$ $0{,}170\,\mathrm{nm}$, $\mathrm{O^{2-}}$ $0{,}140\,\mathrm{nm}$, $\mathrm{Cl^{-}}$ $0{,}181\,\mathrm{nm}$.

**Podatki:** $r(\mathrm{Mg^{2+}}) = 0{,}072\,\mathrm{nm}$, $r(\mathrm{Si^{4+}}) = 0{,}040\,\mathrm{nm}$, $r(\mathrm{Cs^{+}}) = 0{,}170\,\mathrm{nm}$, $r(\mathrm{O^{2-}}) = 0{,}140\,\mathrm{nm}$, $r(\mathrm{Cl^{-}}) = 0{,}181\,\mathrm{nm}$
**Iščemo:** koordinacijsko število kationa v vsaki spojini

:::formula
Razmerje $\frac{r_\mathrm{K}}{r_\mathrm{A}}$: $0{,}225$–$0{,}414$ da $4$; $0{,}414$–$0{,}732$ da $6$; $0{,}732$–$1$ da $8$.
:::

**Rešitev:**

1. MgO: $\frac{0{,}072}{0{,}140} = 0{,}514$, v območju za $6$; vsak Mg je v oktaedru šestih kisikov (struktura NaCl).
2. $\mathrm{SiO_2}$: $\frac{0{,}040}{0{,}140} = 0{,}286$, v območju za $4$; to je tetraeder $\mathrm{SiO_4}$.
3. CsCl: $\frac{0{,}170}{0{,}181} = 0{,}939$, v območju za $8$; Cs je v središču kocke osmih Cl.
4. Odgovor: koordinacijska števila so $6$, $4$ in $8$. Napovedi se ujemajo z izmerjenimi strukturami; pri razmerjih blizu meje (npr. $\mathrm{Al_2O_3}$) je pravilo le okvirno.

### Primer 2

Ploščica iz $\mathrm{Al_2O_3}$ ima lomno žilavost $4\,\mathrm{MPa\,\sqrt{m}}$. Pri pregledu je največja najdena razpoka dolga $50\,\mu\mathrm{m}$ ($Y = 1$). Pri kolikšni natezni napetosti se ploščica zlomi? Kako dolga sme biti razpoka, da ploščica zdrži $500\,\mathrm{MPa}$? Za primerjavo izračunaj kritično napetost za jeklo z $K_\mathrm{Ic} = 50\,\mathrm{MPa\,\sqrt{m}}$ in enako razpoko.

**Podatki:** $K_\mathrm{Ic} = 4\,\mathrm{MPa\,\sqrt{m}}$, $a = 50\,\mu\mathrm{m}$, $Y = 1$, zahtevana napetost $500\,\mathrm{MPa}$; jeklo $K_\mathrm{Ic} = 50\,\mathrm{MPa\,\sqrt{m}}$
**Iščemo:** $\sigma_\mathrm{c}$ za keramiko in jeklo, največjo dopustno dolžino razpoke

:::formula
$\sigma_\mathrm{c} = \frac{K_\mathrm{Ic}}{Y\sqrt{\pi a}}$, $a_\mathrm{c} = \frac{1}{\pi}\left(\frac{K_\mathrm{Ic}}{Y\sigma}\right)^2$
:::

**Rešitev:**

1. Dolžina v metrih: $a = 5 \cdot 10^{-5}\,\mathrm{m}$; $\sqrt{\pi a} = 0{,}01253\,\mathrm{\sqrt{m}}$.
2. Keramika: $\sigma_\mathrm{c} = \frac{4}{0{,}01253} = 319\,\mathrm{MPa}$.
3. Za $500\,\mathrm{MPa}$: $\frac{K_\mathrm{Ic}}{\sigma} = \frac{4}{500} = 0{,}008\,\mathrm{\sqrt{m}}$; $a_\mathrm{c} = \frac{0{,}008^2}{\pi} = 2{,}04 \cdot 10^{-5}\,\mathrm{m} = 20\,\mu\mathrm{m}$.
4. Jeklo: $\sigma_\mathrm{c} = \frac{50}{0{,}01253} = 3990\,\mathrm{MPa}$. To je več od meje tečenja jekla, zato se jeklo pri tej razpoki ne zlomi krhko, ampak se prej plastično deformira.
5. Odgovor: ploščica se zlomi pri okoli $320\,\mathrm{MPa}$; za $500\,\mathrm{MPa}$ morajo biti vse razpoke krajše od približno $20\,\mu\mathrm{m}$. Pri keramiki je zato kontrola napak (polirane površine, merjenje razpok) del konstrukcije.

### Primer 3 (težji)

Enosmerni kompozit ima $60\,\%$ (po prostornini) ogljikovih vlaken v epoksidni smoli. Vlakna: $E_\mathrm{v} = 230\,\mathrm{GPa}$, $\rho_\mathrm{v} = 1{,}8\,\mathrm{g/cm^3}$; smola: $E_\mathrm{m} = 3{,}5\,\mathrm{GPa}$, $\rho_\mathrm{m} = 1{,}2\,\mathrm{g/cm^3}$. Izračunaj modul vzdolž in prečno na vlakna, gostoto in delež sile, ki ga vzdolž nosijo vlakna. Primerjaj specifično togost $\frac{E}{\rho}$ z jeklom ($210\,\mathrm{GPa}$; $7{,}85\,\mathrm{g/cm^3}$) in aluminijem ($70\,\mathrm{GPa}$; $2{,}7\,\mathrm{g/cm^3}$).

**Podatki:** $V_\mathrm{v} = 0{,}6$, $E_\mathrm{v} = 230\,\mathrm{GPa}$, $\rho_\mathrm{v} = 1{,}8\,\mathrm{g/cm^3}$, $E_\mathrm{m} = 3{,}5\,\mathrm{GPa}$, $\rho_\mathrm{m} = 1{,}2\,\mathrm{g/cm^3}$; jeklo $210\,\mathrm{GPa}$; $7{,}85\,\mathrm{g/cm^3}$; aluminij $70\,\mathrm{GPa}$; $2{,}7\,\mathrm{g/cm^3}$
**Iščemo:** $E_\parallel$, $E_\perp$, $\rho$, delež sile v vlaknih, $\frac{E}{\rho}$

:::formula
$E_\parallel = E_\mathrm{v}V_\mathrm{v} + E_\mathrm{m}V_\mathrm{m}$; $\frac{1}{E_\perp} = \frac{V_\mathrm{v}}{E_\mathrm{v}} + \frac{V_\mathrm{m}}{E_\mathrm{m}}$; $\rho = \rho_\mathrm{v}V_\mathrm{v} + \rho_\mathrm{m}V_\mathrm{m}$
:::

**Rešitev:**

1. Delež matrice: $V_\mathrm{m} = 1 - 0{,}6 = 0{,}4$.
2. Vzdolž: $E_\parallel = 230 \cdot 0{,}6 + 3{,}5 \cdot 0{,}4 = 139{,}4\,\mathrm{GPa}$.
3. Prečno: $\frac{0{,}6}{230} + \frac{0{,}4}{3{,}5} = 0{,}00261 + 0{,}11429 = 0{,}11690\,\mathrm{GPa^{-1}}$, torej $E_\perp = 8{,}55\,\mathrm{GPa}$.
4. Gostota: $\rho = 1{,}8 \cdot 0{,}6 + 1{,}2 \cdot 0{,}4 = 1{,}56\,\mathrm{g/cm^3}$.
5. Delež sile v vlaknih: $\frac{230 \cdot 0{,}6}{139{,}4} = 0{,}990$.
6. Specifična togost (v $\mathrm{GPa\,cm^3/g}$): kompozit vzdolž $\frac{139{,}4}{1{,}56} = 89{,}4$, prečno $\frac{8{,}55}{1{,}56} = 5{,}5$; jeklo $\frac{210}{7{,}85} = 26{,}8$; aluminij $\frac{70}{2{,}7} = 25{,}9$.
7. Odgovor: $E_\parallel = 139\,\mathrm{GPa}$, $E_\perp = 8{,}6\,\mathrm{GPa}$, $\rho = 1{,}56\,\mathrm{g/cm^3}$; vlakna nosijo $99\,\%$ sile. Vzdolž vlaken je kompozit pri enaki masi več kot trikrat bolj tog od jekla in aluminija, prečno pa precej slabši od obeh; od tod laminati.

### Primer 4 – zdaj ti

Lopata vetrne elektrarne je iz steklenih vlaken ($E_\mathrm{v} = 72\,\mathrm{GPa}$) v poliestru ($E_\mathrm{m} = 3\,\mathrm{GPa}$), $V_\mathrm{v} = 0{,}4$. Izračunaj $E_\parallel$ in $E_\perp$.

**Podatki:** $E_\mathrm{v} = 72\,\mathrm{GPa}$, $E_\mathrm{m} = 3\,\mathrm{GPa}$, $V_\mathrm{v} = 0{,}4$
**Iščemo:** $E_\parallel$, $E_\perp$

:::formula
$E_\parallel = E_\mathrm{v}V_\mathrm{v} + E_\mathrm{m}V_\mathrm{m}$; $\frac{1}{E_\perp} = \frac{V_\mathrm{v}}{E_\mathrm{v}} + \frac{V_\mathrm{m}}{E_\mathrm{m}}$
:::

**Rešitev:**

1. $V_\mathrm{m} = 0{,}6$; $E_\parallel = 72 \cdot 0{,}4 + 3 \cdot 0{,}6 = 30{,}6\,\mathrm{GPa}$.
2. Izračunaj še $E_\perp$. Kateri člen v vsoti prevlada in zakaj?

:::premisli
Kolikšen je $E_\perp$?
---
$\frac{0{,}4}{72} + \frac{0{,}6}{3} = 0{,}0056 + 0{,}2 = 0{,}2056\,\mathrm{GPa^{-1}}$, $E_\perp = 4{,}86\,\mathrm{GPa}$. Prevlada člen matrice, ker je ta mehka: pri zaporedni vezavi odloča najbolj podajna faza.
:::

## Pogoste napake

- **»Trda keramika je trdna in žilava.«** Trdota (odpornost proti razenju) in žilavost (odpornost proti širjenju razpoke) sta različni lastnosti. Keramika je zelo trda in malo žilava.
- **Natezna in tlačna trdnost sta enaki.** Pri keramiki je tlačna trdnost okoli desetkrat večja, ker se razpoke v tlaku zapirajo. Keramične dele zato načrtujemo za tlak.
- **Pravilo mešanic velja v vseh smereh.** Linearno pravilo velja le vzdolž dolgih vlaken. Prečno velja obratno (harmonično) pravilo in modul je blizu modulu matrice.
- **Masni delež namesto prostorninskega.** V pravilu mešanic so prostorninski deleži. Masni delež pretvoriš z gostotama faz.
- **Kratka vlakna so enako dobra kot dolga.** Vlakno, krajše od kritične dolžine, se ne obremeni do svoje trdnosti; kompozit s prekratkimi vlakni je le malo boljši od matrice.

## Povzetek

- Keramika: anorganske nekovinske spojine z ionskimi in kovalentnimi vezmi; trda, toga, obstojna pri visoki temperaturi, krhka.
- Zgradba ionske keramike: nevtralnost in razmerje $\frac{r_\mathrm{K}}{r_\mathrm{A}}$ (meje $0{,}225$; $0{,}414$; $0{,}732$ za koordinacijska števila $4$, $6$, $8$); silikati iz tetraedrov $\mathrm{SiO_4}$.
- Krhkost: dislokacije se ne gibljejo; lom določa najdaljša razpoka, $\sigma_\mathrm{c} = \frac{K_\mathrm{Ic}}{Y\sqrt{\pi a}}$; tlak $\gg$ nateg; pore zmanjšajo trdnost.
- Kompoziti: matrica in ojačitev; delčni, vlaknasti, strukturni; PMC, MMC, CMC.
- Pravilo mešanic: $E_\parallel = E_\mathrm{v}V_\mathrm{v} + E_\mathrm{m}V_\mathrm{m}$, $\frac{1}{E_\perp} = \frac{V_\mathrm{v}}{E_\mathrm{v}} + \frac{V_\mathrm{m}}{E_\mathrm{m}}$; kritična dolžina vlakna $l_\mathrm{c} = \frac{\sigma_\mathrm{v}d}{2\tau_\mathrm{c}}$.

## Za izpit

Znati moraš povedati:

- definicijo keramike in kompozita, vrste kompozitov po ojačitvi in matrici,
- pravili za zgradbo ionske keramike (nevtralnost, razmerje polmerov) in zgradbo silikatov,
- razlog za krhkost keramike in pomen lomne žilavosti,
- izpeljavo pravila mešanic za obremenitev vzdolž in prečno na vlakna,
- pomen kritične dolžine vlakna.

### Naloga 1

Za ojačitev nosilca potrebujemo enosmerni ogljik–epoksidni kompozit ($E_\mathrm{v} = 230\,\mathrm{GPa}$, $E_\mathrm{m} = 3{,}5\,\mathrm{GPa}$, $\rho_\mathrm{v} = 1{,}8\,\mathrm{g/cm^3}$, $\rho_\mathrm{m} = 1{,}2\,\mathrm{g/cm^3}$) z modulom vzdolž vlaken $100\,\mathrm{GPa}$. (a) Kolikšen mora biti prostorninski delež vlaken in kolikšna je gostota? (b) Kompozit vzdolž obremenimo z $500\,\mathrm{MPa}$. Kolikšne so deformacija ter napetosti v vlaknih in matrici? (c) Cenejša različica bi imela kratka vlakna dolžine $0{,}2\,\mathrm{mm}$ s premerom $7\,\mu\mathrm{m}$ in trdnostjo $3500\,\mathrm{MPa}$; strižna trdnost meje je $40\,\mathrm{MPa}$. Ali so vlakna dovolj dolga?

**Rešitev:**

1. (a) Iz $100 = 230V_\mathrm{v} + 3{,}5(1 - V_\mathrm{v})$ sledi $V_\mathrm{v} = \frac{100 - 3{,}5}{230 - 3{,}5} = 0{,}426$.
2. Gostota: $\rho = 1{,}8 \cdot 0{,}426 + 1{,}2 \cdot 0{,}574 = 1{,}456\,\mathrm{g/cm^3}$.
3. (b) Vzdolž je deformacija za obe fazi enaka: $\varepsilon = \frac{500\,\mathrm{MPa}}{100\,000\,\mathrm{MPa}} = 0{,}005$.
4. Napetost v vlaknih: $230\,000 \cdot 0{,}005 = 1150\,\mathrm{MPa}$; v matrici: $3500 \cdot 0{,}005 = 17{,}5\,\mathrm{MPa}$.
5. Preizkus ravnotežja: $0{,}426 \cdot 1150 + 0{,}574 \cdot 17{,}5 = 500\,\mathrm{MPa}$.
6. (c) Kritična dolžina: $l_\mathrm{c} = \frac{3500 \cdot 7 \cdot 10^{-6}}{2 \cdot 40} = 3{,}06 \cdot 10^{-4}\,\mathrm{m} = 0{,}31\,\mathrm{mm}$.
7. Vlakna z $0{,}2\,\mathrm{mm}$ so krajša od $l_\mathrm{c}$, zato se nobeno vlakno ne obremeni do trdnosti; prej popusti meja.
8. Odgovor: potrebno je $42{,}6\,\%$ vlaken, gostota $1{,}46\,\mathrm{g/cm^3}$; pri $500\,\mathrm{MPa}$ je $\varepsilon = 0{,}5\,\%$, vlakna nosijo $1150\,\mathrm{MPa}$, matrica le $17{,}5\,\mathrm{MPa}$. Kratka vlakna niso primerna, potrebna bi bila vsaj okoli $0{,}3\,\mathrm{mm}$ dolga, za dober izkoristek pa več (okoli $15 l_\mathrm{c}$).

### Naloga 2

(a) Utemelji, zakaj je ionska keramika pri sobni temperaturi krhka, kovina pa ne. (b) Izpelji pravili mešanic za modul enosmernega kompozita vzdolž in prečno na vlakna. (c) Dokaži, da je za vsak $0 < V_\mathrm{v} < 1$ in $E_\mathrm{v} \ne E_\mathrm{m}$ modul prečno strogo manjši od modula vzdolž.

**Rešitev:**

1. (a) Plastična deformacija je drsenje dislokacij. V kovini vez ni usmerjena in ne loči nabojev, drsenje je lahko. V ionskem kristalu bi drsenje za trenutek postavilo enako nabite ione drug ob drugega; odboj je ogromen, drsnih sistemov je malo. Napetost se zato ob razpoki ne sprosti s plastično deformacijo in razpoka se razširi.
2. (b) Vzdolž: sila $F = F_\mathrm{v} + F_\mathrm{m}$, deformacija enaka $\varepsilon$. Z $F_i = E_i\varepsilon A_i$ in deljenjem s presekom $A$: $\sigma = \varepsilon(E_\mathrm{v}V_\mathrm{v} + E_\mathrm{m}V_\mathrm{m})$, torej $E_\parallel = E_\mathrm{v}V_\mathrm{v} + E_\mathrm{m}V_\mathrm{m}$ (prostorninski delež je pri dolgih vlaknih enak deležu preseka).
3. Prečno: napetost $\sigma$ je v obeh fazah enaka, raztezka se seštejeta sorazmerno z debelinama: $\varepsilon = V_\mathrm{v}\frac{\sigma}{E_\mathrm{v}} + V_\mathrm{m}\frac{\sigma}{E_\mathrm{m}}$, torej $\frac{1}{E_\perp} = \frac{V_\mathrm{v}}{E_\mathrm{v}} + \frac{V_\mathrm{m}}{E_\mathrm{m}}$.
4. (c) Velja $E_\parallel \cdot \frac{1}{E_\perp} = (E_\mathrm{v}V_\mathrm{v} + E_\mathrm{m}V_\mathrm{m})\left(\frac{V_\mathrm{v}}{E_\mathrm{v}} + \frac{V_\mathrm{m}}{E_\mathrm{m}}\right) = V_\mathrm{v}^2 + V_\mathrm{m}^2 + V_\mathrm{v}V_\mathrm{m}\left(\frac{E_\mathrm{v}}{E_\mathrm{m}} + \frac{E_\mathrm{m}}{E_\mathrm{v}}\right)$.
5. Za $x = \frac{E_\mathrm{v}}{E_\mathrm{m}} > 0$, $x \ne 1$, je $x + \frac1x > 2$, ker je $\left(\sqrt x - \frac{1}{\sqrt x}\right)^2 > 0$.
6. Zato je izraz večji od $V_\mathrm{v}^2 + V_\mathrm{m}^2 + 2V_\mathrm{v}V_\mathrm{m} = (V_\mathrm{v} + V_\mathrm{m})^2 = 1$, torej $E_\parallel > E_\perp$.
7. Odgovor: krhkost izhaja iz negibljivih dislokacij; pravili mešanic sledita iz enake deformacije oziroma enake napetosti; prečni modul je vedno manjši (harmonična sredina je manjša od aritmetične), enaka sta le pri enakih fazah.

## Drugače: Z analogijo

Armirani beton je najstarejši vsakdanji kompozit. Beton je kot keramika: v tlaku zdrži veliko, v nategu pa poči ob prvi razpoki. Jeklene palice so kot vlakna: v spodnjem, nategnjenem delu grede prevzamejo nateg, ki ga beton ne zmore. Ko se v betonu pojavi drobna razpoka, se ne razširi čez ves prerez, ker jo palice »zašijejo«. Prav tako delujejo ogljikova vlakna v smoli in SiC vlakna v SiC keramiki. Razlika je le v merilu: palice so debele centimeter, vlakna nekaj mikrometrov.

## Drugače: Uporaba v stroki

- **Elektronika.** Podlage tiskanih vezij za močnostno elektroniko so iz $\mathrm{Al_2O_3}$ ali AlN (izolator, dobro prevaja toploto). Piezoelektrična keramika PZT je v ultrazvočnih senzorjih, merilnikih tlaka in vbrizgalnih šobah.
- **Merilna tehnika.** Senzor kisika v izpušnem sistemu avtomobila (lambda sonda) je iz $\mathrm{ZrO_2}$, ki pri visoki temperaturi prevaja kisikove ione.
- **Medicina.** Zobne krone in umetni kolki so iz $\mathrm{ZrO_2}$ in $\mathrm{Al_2O_3}$: obstojni, biokompatibilni in trdi.
- **Letalstvo in promet.** Najnovejša potniška letala imajo okoli polovico strukturne mase iz ogljikovih kompozitov. Zavorni koluti športnih avtomobilov so iz ogljika, ojačenega s SiC (CMC). Lopatice vetrnih elektrarn so iz steklenih vlaken v smoli.
- **Kontrola kakovosti.** Ker lom določa najdaljša razpoka, keramične in kompozitne dele pregledujejo z ultrazvokom in rentgensko tomografijo; razslojitev laminata je glavna napaka, ki jo iščejo.

## Drugače: Bolj natančno

**Statistika loma.** Trdnost enakih keramičnih vzorcev se močno razlikuje, ker je vsak vzorec drugače »nesrečen« pri najdaljši razpoki. Opisuje jo **Weibullova porazdelitev**: verjetnost preživetja pri napetosti $\sigma$ je $\exp\left[-\left(\frac{\sigma}{\sigma_0}\right)^m\right]$. Za keramiko je modul $m \approx 5$–$20$, za kovine $m > 50$. Večji vzorec ima več napak in je v povprečju šibkejši.

**Transformacijsko ojačanje.** Delno stabiliziran $\mathrm{ZrO_2}$ ima ob konici razpoke zrna, ki preidejo iz tetragonalne v monoklinsko obliko s približno $4\,\%$ večjo prostornino. Razširitev stisne konico razpoke in poveča žilavost do okoli $10\,\mathrm{MPa\,\sqrt{m}}$. Zato iz njega delajo nože in zobne krone.

**Meje pravila mešanic.** Pravili mešanic sta zgornja in spodnja meja (Voigt, Reuss) za vsako razporeditev faz; dejanski modul delčnega kompozita leži med njima. Natančnejše ocene (Halpin–Tsai, Hashin–Shtrikman) upoštevajo obliko in razporeditev ojačitve.

## Preveri se

? Inženirka izbira material za izolator vžigalne svečke: delovati mora pri $900\,\mathrm{°C}$, biti električni izolator in ne sme reagirati s plini. Katera skupina materialov je prava in zakaj?
- kovine, ker dobro prenašajo udarce
~ Kovine prevajajo električni tok, izolator pa mora tok ustaviti.
+ keramika (npr. $\mathrm{Al_2O_3}$), ker ima ionske in kovalentne vezi brez prostih elektronov in je kemijsko obstojna
- termoplasti, ker so lahki
~ Termoplasti se zmehčajo že pri nekaj sto stopinjah ali manj.
- kompozit ogljikovih vlaken, ker je zelo tog
~ Ogljikova vlakna prevajajo električni tok in na zraku pri visoki temperaturi oksidirajo.
> Keramika je izolator (elektroni so vezani v ionskih in kovalentnih vezeh), ima visoko tališče in je kemijsko obstojna.

? Razvrsti materiale po specifični togosti $\frac{E}{\rho}$ od največje do najmanjše: jeklo ($210\,\mathrm{GPa}$; $7{,}85\,\mathrm{g/cm^3}$), aluminij ($70\,\mathrm{GPa}$; $2{,}7\,\mathrm{g/cm^3}$), enosmerni ogljikov kompozit vzdolž vlaken ($139\,\mathrm{GPa}$; $1{,}56\,\mathrm{g/cm^3}$).
- jeklo, aluminij, kompozit
~ Jeklo ima največji modul, a tudi daleč največjo gostoto; šteje razmerje.
+ kompozit, jeklo, aluminij
- kompozit, aluminij, jeklo
~ Jeklo ($26{,}8$) in aluminij ($25{,}9$) sta si zelo blizu, a jeklo je malenkost pred aluminijem.
- aluminij, kompozit, jeklo
~ Kompozit vzdolž vlaken ima več kot trikrat večje razmerje od aluminija.
> $\frac{E}{\rho}$: kompozit $89$, jeklo $26{,}8$, aluminij $25{,}9$ (v $\mathrm{GPa\,cm^3/g}$).

? Kaj se zgodi z natezno trdnostjo keramičnega dela, če največja površinska razpoka zraste za štirikrat?
- Trdnost se zmanjša na četrtino.
~ Trdnost je obratno sorazmerna s korenom dolžine razpoke, ne z dolžino.
+ Trdnost se zmanjša na polovico.
- Trdnost ostane enaka, ker je odvisna le od materiala.
~ Lomna žilavost je lastnost materiala, trdnost pa je odvisna tudi od razpoke.
- Trdnost se zmanjša na šestnajstino.
~ To bi veljalo, če bi bila trdnost sorazmerna z $\frac{1}{a^2}$.
> $\sigma_\mathrm{c} = \frac{K_\mathrm{Ic}}{Y\sqrt{\pi a}}$; pri $4a$ je imenovalec dvakrat večji.

? Kation ima polmer $0{,}100\,\mathrm{nm}$, anion $0{,}180\,\mathrm{nm}$. Kolikšno je pričakovano koordinacijsko število kationa?
- $4$
~ Za $4$ bi moralo biti razmerje med $0{,}225$ in $0{,}414$.
+ $6$
- $8$
~ Za $8$ bi moralo biti razmerje nad $0{,}732$.
- $12$
~ Koordinacijsko število $12$ se pojavi pri kovinah z gostim zlogom, ne v ionski keramiki s tem razmerjem.
> $\frac{0{,}100}{0{,}180} = 0{,}556$, kar je med $0{,}414$ in $0{,}732$: oktaedrska koordinacija.

? Aluminij ($E_\mathrm{m} = 70\,\mathrm{GPa}$) ojačimo z $30\,\%$ enosmernih SiC vlaken ($E_\mathrm{v} = 400\,\mathrm{GPa}$). Kolikšen je modul vzdolž vlaken?
- $93\,\mathrm{GPa}$
~ To je modul prečno na vlakna (harmonično pravilo).
+ $169\,\mathrm{GPa}$
- $235\,\mathrm{GPa}$
~ To je navadno povprečje $\frac{400 + 70}{2}$; deleža faz nista enaka.
- $331\,\mathrm{GPa}$
~ Deleža sta zamenjana: $400 \cdot 0{,}7 + 70 \cdot 0{,}3$.
> $E_\parallel = 400 \cdot 0{,}3 + 70 \cdot 0{,}7 = 120 + 49 = 169\,\mathrm{GPa}$.

:::simboli
r_\mathrm{K} | polmer kationa | | nm
r_\mathrm{A} | polmer aniona | | nm
\sigma | natezna napetost | | MPa
\sigma_\mathrm{c} | kritična napetost za lom | \sigma_\mathrm{c} = \frac{K_\mathrm{Ic}}{Y\sqrt{\pi a}} | MPa
\sigma_\mathrm{max} | napetost na konici razpoke | | MPa
K_\mathrm{Ic} | lomna žilavost | K_\mathrm{Ic} = Y\sigma_\mathrm{c}\sqrt{\pi a} | MPa\,\sqrt{m}
Y | faktor oblike razpoke | | – | približno 1
a | dolžina razpoke | | m
a_\mathrm{c} | največja dopustna dolžina razpoke | | m
\rho | polmer konice razpoke; gostota kompozita | | g/cm^3 | pomen iz zveze
E_\parallel | modul vzdolž vlaken | E_\parallel = E_\mathrm{v}V_\mathrm{v} + E_\mathrm{m}V_\mathrm{m} | GPa
E_\perp | modul prečno na vlakna | | GPa
E_\mathrm{v} | elastični modul vlaken | | GPa
E_\mathrm{m} | elastični modul matrice | | GPa
V_\mathrm{v} | prostorninski delež vlaken | | –
V_\mathrm{m} | prostorninski delež matrice | V_\mathrm{m} = 1 - V_\mathrm{v} | –
\rho_\mathrm{v} | gostota vlaken | | g/cm^3
\rho_\mathrm{m} | gostota matrice | | g/cm^3
l_\mathrm{c} | kritična dolžina vlakna | l_\mathrm{c} = \frac{\sigma_\mathrm{v}d}{2\tau_\mathrm{c}} | m
\sigma_\mathrm{v} | natezna trdnost vlakna | | MPa
d | premer vlakna | | m
\tau_\mathrm{c} | strižna trdnost meje vlakno–matrica | | MPa
\pi | število pi | | | $\pi \approx 3{,}14$
:::
