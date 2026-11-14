---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec ob novici o iskanju življenja na Marsu reče: »Marsovo ozračje skoraj nima kisika. Tam bi lahko preživele kvečjemu bakterije, ki fermentirajo. Dihanje brez kisika ne obstaja.«

Zveni logično, saj človek brez kisika ne preživi niti nekaj minut. A mikrobi so pri pridobivanju energije veliko bolj iznajdljivi od nas. Nekateri »dihajo« nitrat, sulfat ali železove ione. Drugi jedo vodik in kamnine. Tretji živijo od svetlobe. Prav te možnosti preučujejo astrobiologi, ko presojajo, ali je v podzemlju Marsa ali v oceanu pod ledom Jupitrove lune Evrope lahko kaj živega.

Na koncu lekcije boš znal sošolcu odgovoriti z argumenti in s števili.

## Razlaga

**Izhodišče: aerobno dihanje, ki ga že poznaš.** Pri dihanju celica glukozo razgradi do $\mathrm{CO_2}$. Elektroni iz glukoze se najprej naložijo na prenašalec $\mathrm{NAD^+}$, ki postane $\mathrm{NADH}$. Nato jih $\mathrm{NADH}$ odda **verigi za prenos elektronov** v celični membrani. Pri prokariontih je ta veriga v citoplazemski membrani, saj mitohondrijev nimajo. Na koncu verige elektrone sprejme kisik, ki se pri tem reducira v vodo.

Med potovanjem po verigi elektroni izgubljajo energijo. Celica jo porabi za črpanje protonov skozi membrano. Ko protoni tečejo nazaj skozi encim ATP-sintazo, nastaja ATP. Temu rečemo **oksidativna fosforilacija**.

Vsako presnovo bomo opisali z istimi tremi vprašanji in jo primerjali z aerobnim dihanjem:

1. Od kod pride energija (kemična spojina ali svetloba)?
2. Kdo odda elektrone (**darovalec elektronov**)?
3. Kdo jih na koncu sprejme (**končni sprejemnik elektronov**)?

**Fermentacija: brez verige.** Prva razlika je velika: pri fermentaciji zunanjega sprejemnika ni. Glukoza se v **glikolizi** razgradi do piruvata. Pri tem nastaneta 2 ATP, in sicer neposredno, s prenosom fosfatne skupine z organske molekule na ADP. Temu rečemo **fosforilacija na ravni substrata**. Verige za prenos elektronov in protonskega gradienta tu ni.

$\mathrm{NADH}$ iz glikolize mora nekam oddati elektrone. Odda jih kar piruvatu ali produktu, ki iz njega nastane. Tako nastanejo mlečna kislina, etanol, ocetna kislina ali drugi produkti, ki jih mikrob izloči. Končni sprejemnik elektronov je torej organska molekula iz same celice.

:::premisli
Pretvorba piruvata v mlečno kislino ne da nobenega ATP. Zakaj jo celica vseeno opravi?
---
Ker tako $\mathrm{NADH}$ odda elektrone in spet nastane $\mathrm{NAD^+}$. Brez $\mathrm{NAD^+}$ bi se glikoliza ustavila, z njo pa edini vir ATP pri fermentaciji.
:::

**Anaerobno dihanje: ista veriga, drug sprejemnik.** Zdaj je razlika z aerobnim dihanjem manjša. Veriga za prenos elektronov in ATP-sintaza delujeta enako, le na koncu elektronov ne sprejme kisik. Sprejme jih nitrat ($\mathrm{NO_3^-}$), sulfat ($\mathrm{SO_4^{2-}}$), železov ion $\mathrm{Fe^{3+}}$, fumarat ali celo $\mathrm{CO_2}$. Sošolčeva trditev torej ne drži: dihanje brez kisika obstaja.

Koliko energije da posamezen sprejemnik, pove **standardni redoks potencial** $E_0'$. To je merilo, kako močno spojina vleče elektrone k sebi (pri pH 7). Elektroni »padajo« od spojine z bolj negativnim $E_0'$ k spojini z bolj pozitivnim. Večja kot je višina padca $\Delta E_0'$, več energije se sprosti:

$$\Delta G_0' = -n\,F\,\Delta E_0'$$

Tu je $n$ število prenesenih elektronov, $F = 96{,}485\,\mathrm{kJ/(V\cdot mol)}$ Faradayeva konstanta, $\Delta E_0' = E_0'(\text{sprejemnik}) - E_0'(\text{darovalec})$.

Redoks lestvica, od najbolj negativnega do najbolj pozitivnega $E_0'$:

| Par (oksidirana/reducirana oblika) | $E_0'$ [V] | Vloga |
|---|---|---|
| $2\mathrm{H^+}/\mathrm{H_2}$ | $-0{,}42$ | močan darovalec |
| $\mathrm{NAD^+}/\mathrm{NADH}$ | $-0{,}32$ | darovalec v dihanju |
| $\mathrm{SO_4^{2-}}/\mathrm{H_2S}$ | $-0{,}22$ | šibek sprejemnik |
| $\mathrm{NO_3^-}/\mathrm{NO_2^-}$ | $+0{,}42$ | dober sprejemnik |
| $\mathrm{O_2}/\mathrm{H_2O}$ | $+0{,}82$ | najboljši sprejemnik |

:::premisli
Bakterija *Escherichia coli* lahko diha s kisikom ali z nitratom. Kaj bo uporabila, če ima na voljo oba? Napovej in utemelji z lestvico.
---
Kisik. Njegov $E_0'$ je višji, zato je padec elektronov od $\mathrm{NADH}$ večji in sprosti se več energije za ATP. *E. coli* zato gene za dihanje z nitratom vklopi šele, ko kisika zmanjka.
:::

**Kemolitotrofija: drug darovalec.** Doslej so elektroni prihajali iz organskih snovi; takim organizmom rečemo **kemoorganotrofi**. **Kemolitotrofi** pa elektrone vzamejo anorganskim snovem: vodiku $\mathrm{H_2}$, vodikovemu sulfidu $\mathrm{H_2S}$, amonijaku ali $\mathrm{Fe^{2+}}$. Veriga za prenos elektronov in ATP-sintaza ostaneta. Večina kemolitotrofov je hkrati **avtotrofnih**: ogljik dobijo iz $\mathrm{CO_2}$, ne iz organskih snovi. Primer so metanogene arheje, ki z vodikom reducirajo $\mathrm{CO_2}$ v metan. Zato astrobiologe zanima vsaka sled metana v Marsovem ozračju.

**Fotosinteza: drug vir energije.** Pri **fototrofih** energija ne pride iz kemične reakcije, ampak iz svetlobe. Svetloba v klorofilu ali bakterioklorofilu vzbudi elektron, ta steče po verigi za prenos elektronov in spet nastane protonski gradient. Ločimo dve vrsti:

- **Oksigena fotosinteza** (cianobakterije): darovalec elektronov je voda, zato nastaja kisik.
- **Anoksigena fotosinteza** (škrlatne in zelene bakterije): darovalec je na primer $\mathrm{H_2S}$ ali $\mathrm{H_2}$, kisik ne nastaja.

Cianobakterije zato preizkušajo kot vir kisika za bodoče baze na Marsu.

## Rešeni primeri

### Primer 1: koliko glukoze za isto delo

V bioreaktorju za podporo življenju na vesoljski postaji gojijo dva seva. Prvi glukozo fermentira in dobi $2$ ATP na molekulo glukoze. Drugi aerobno diha in dobi do $38$ ATP na molekulo. Koliko molekul glukoze porabi vsak sev, da naredi $380$ molekul ATP?

**Podatki:** fermentacija $2$ ATP/glukozo, aerobno dihanje $38$ ATP/glukozo, potrebnih $380$ ATP
**Iščemo:** število molekul glukoze za vsak sev in njuno razmerje

:::formula
$\text{št. glukoz} = \dfrac{\text{potrebni ATP}}{\text{ATP na glukozo}}$
:::

**Rešitev:**

1. Fermentacija: $\dfrac{380}{2} = 190$ molekul glukoze.
2. Aerobno dihanje: $\dfrac{380}{38} = 10$ molekul glukoze.
3. Razmerje: $\dfrac{38}{2} = 19$. Fermentacija izkoristi le glikolizo, dihanje pa še verigo za prenos elektronov.
4. Odgovor: fermentor porabi $190$, dihajoči sev $10$ molekul glukoze, torej $19$-krat manj.

### Primer 2: kisik ali nitrat

Izračunaj standardno spremembo proste energije, ko $\mathrm{NADH}$ odda $2$ elektrona kisiku in ko ju odda nitratu. Kolikokrat več energije da kisik?

**Podatki:** $E_0'(\mathrm{NAD^+/NADH}) = -0{,}32\,\mathrm{V}$, $E_0'(\mathrm{O_2/H_2O}) = +0{,}82\,\mathrm{V}$, $E_0'(\mathrm{NO_3^-/NO_2^-}) = +0{,}42\,\mathrm{V}$, $n = 2$, $F = 96{,}485\,\mathrm{kJ/(V\cdot mol)}$
**Iščemo:** $\Delta G_0'$ za oba sprejemnika in razmerje

:::formula
$\Delta E_0' = E_0'(\text{sprejemnik}) - E_0'(\text{darovalec})$

$\Delta G_0' = -n\,F\,\Delta E_0'$
:::

**Rešitev:**

1. Kisik: $\Delta E_0' = 0{,}82 + 0{,}32 = 1{,}14\,\mathrm{V}$ (darovalec ima negativen potencial, zato se vrednosti seštejeta).
2. $\Delta G_0' = -2 \cdot 96{,}485 \cdot 1{,}14 \approx -220{,}0\,\mathrm{kJ/mol}$.
3. Nitrat: $\Delta E_0' = 0{,}42 + 0{,}32 = 0{,}74\,\mathrm{V}$.
4. $\Delta G_0' = -2 \cdot 96{,}485 \cdot 0{,}74 \approx -142{,}8\,\mathrm{kJ/mol}$.
5. Razmerje: $\dfrac{220{,}0}{142{,}8} \approx 1{,}54$.
6. Odgovor: s kisikom se sprosti $220\,\mathrm{kJ/mol}$, z nitratom $143\,\mathrm{kJ/mol}$, kar je približno $1{,}5$-krat manj. Dihanje z nitratom deluje, a da manj ATP.

### Primer 3: vodik pod ledom Evrope

V oceanu pod ledom Evrope bi lahko nastajal vodik iz reakcij vode s kamninami, sulfat pa bi prihajal s površja. Kisika skoraj ni. Koliko energije bi dobil mikrob, ki s $4\,\mathrm{H_2}$ reducira en sulfat ($8$ elektronov)? Kolikokrat več bi dobil iz iste količine vodika, če bi imel kisik?

**Podatki:** $E_0'(2\mathrm{H^+/H_2}) = -0{,}42\,\mathrm{V}$, $E_0'(\mathrm{SO_4^{2-}/H_2S}) = -0{,}22\,\mathrm{V}$, $E_0'(\mathrm{O_2/H_2O}) = +0{,}82\,\mathrm{V}$, $n = 8$, $F = 96{,}485\,\mathrm{kJ/(V\cdot mol)}$
**Iščemo:** $\Delta G_0'$ za sulfat, $\Delta G_0'$ za kisik in razmerje

:::formula
$\Delta G_0' = -n\,F\,\left(E_0'(\text{sprejemnik}) - E_0'(\text{darovalec})\right)$
:::

**Rešitev:**

1. Darovalec je $\mathrm{H_2}$, anorganska snov: to je kemolitotrofija z anaerobnim dihanjem.
2. Sulfat: $\Delta E_0' = -0{,}22 + 0{,}42 = 0{,}20\,\mathrm{V}$.
3. $\Delta G_0' = -8 \cdot 96{,}485 \cdot 0{,}20 \approx -154{,}4\,\mathrm{kJ}$ na mol sulfata. Energije je malo, a je je dovolj za življenje.
4. Kisik: izračunaj $\Delta E_0'$ in $\Delta G_0'$ za $8$ elektronov sam, nato še razmerje.

:::premisli
Koliko je $\Delta G_0'$ s kisikom in kolikokrat več je to?
---
$\Delta E_0' = 0{,}82 + 0{,}42 = 1{,}24\,\mathrm{V}$, $\Delta G_0' = -8 \cdot 96{,}485 \cdot 1{,}24 \approx -957{,}1\,\mathrm{kJ}$. To je $\dfrac{957{,}1}{154{,}4} \approx 6{,}2$-krat več. Mikrob na Evropi bi torej rasel počasi, a bi lahko živel.
:::

## Pogoste napake

- **»Anaerobno pomeni fermentacijo.«** Brez kisika sta mogoči dve zelo različni poti. Pri anaerobnem dihanju deluje veriga za prenos elektronov z drugim zunanjim sprejemnikom. Fermentacija verige nima. Vprašaj se: ali ima celica zunanji sprejemnik?
- **»Kisik je gorivo.«** Kisik ne prinese energije, le sprejme elektrone na koncu verige. Energija je v darovalcu; sprejemnik določa, kako globoko elektroni padejo.
- **»Kemolitotrofi dobijo ogljik iz kamnin.«** Predpona *lito-* pove le, da je darovalec elektronov anorganski. Ogljik večina kemolitotrofov dobi iz $\mathrm{CO_2}$.
- **»Vsaka fotosinteza sprošča kisik.«** Kisik nastane le, če je darovalec voda. Škrlatne žveplove bakterije uporabljajo $\mathrm{H_2S}$ in odlagajo žveplo.
- **Napačen predznak pri $\Delta E_0'$.** Če računaš darovalec minus sprejemnik, dobiš pozitiven $\Delta G_0'$ za reakcijo, ki v resnici poteka sama od sebe. Vedno: sprejemnik minus darovalec.

## Povzetek

- Presnovo opišemo s tremi vprašanji: vir energije, darovalec elektronov, končni sprejemnik elektronov. Posebej še vir ogljika (avtotrof: $\mathrm{CO_2}$, heterotrof: organske snovi).
- Fermentacija: brez zunanjega sprejemnika in brez verige; ATP le s fosforilacijo na ravni substrata (2 ATP/glukozo); $\mathrm{NADH}$ odda elektrone organskemu produktu.
- Aerobno dihanje: sprejemnik $\mathrm{O_2}$, oksidativna fosforilacija, do 38 ATP/glukozo.
- Anaerobno dihanje: ista veriga, sprejemnik $\mathrm{NO_3^-}$, $\mathrm{SO_4^{2-}}$, $\mathrm{Fe^{3+}}$, $\mathrm{CO_2}$; manj energije.
- Kemolitotrofija: anorganski darovalec ($\mathrm{H_2}$, $\mathrm{H_2S}$, $\mathrm{NH_3}$, $\mathrm{Fe^{2+}}$).
- Fotosinteza: energija iz svetlobe; oksigena (voda, nastaja $\mathrm{O_2}$) ali anoksigena.
- $\Delta G_0' = -nF\Delta E_0'$, $\Delta E_0' = E_0'(\text{sprejemnik}) - E_0'(\text{darovalec})$.

## Drugače: Na sliki

Predstavljaj si navpično merilo nadmorske višine. Zgoraj, pri $-0{,}42\,\mathrm{V}$, je vodik. Malo nižje, pri $-0{,}32\,\mathrm{V}$, je $\mathrm{NADH}$. Na dnu, pri $+0{,}82\,\mathrm{V}$, je kisik.

```
-0,42  H2      ← vrh: najmočnejši darovalec
-0,32  NADH
-0,22  SO4 2-
+0,42  NO3-
+0,82  O2      ← dno: največji padec
```

Elektron je kot kamen, ki ga spustiš z darovalca do sprejemnika. Več kot je višinskih metrov med njima, več energije se sprosti. Na tej sliki vidiš vse oblike presnove:

- aerobno dihanje: od $\mathrm{NADH}$ do dna,
- anaerobno dihanje: od $\mathrm{NADH}$ do vmesne postaje,
- kemolitotrofija: kamen spustiš z drugega mesta, na primer z vodika,
- fermentacija: kamen ostane skoraj na isti višini, ker sprejemnik nastane iz same glukoze,
- fotosinteza: svetloba kamen najprej dvigne, nato pade.

## Drugače: Uporaba v stroki

- **Kruh, vino in jogurt** so izdelki fermentacije. Kvasovke glukozo pretvorijo v etanol in $\mathrm{CO_2}$, mlečnokislinske bakterije v mlečno kislino.
- **Čistilna naprava** odstranjuje nitrat z denitrifikacijo: bakterije z nitratom dihajo in ga pretvorijo v plin $\mathrm{N_2}$.
- **Smrad po gnilih jajcih** v blatu na dnu ribnika je $\mathrm{H_2S}$, ki ga oddajajo bakterije, ki dihajo s sulfatom.
- **Bioplinarna** proizvaja metan s pomočjo metanogenih arhej.
- **Rjava voda iz starih rudnikov** je delo kemolitotrofov, ki oksidirajo $\mathrm{Fe^{2+}}$.
- **Zeleni ribnik** poleti obarvajo cianobakterije, ki s fotosintezo sproščajo kisik.

## Preveri se

? Katera trditev o fermentaciji drži?
- Končni sprejemnik elektronov je kisik, vendar ga je malo.
~ To meša fermentacijo z dihanjem. Pri fermentaciji zunanjega sprejemnika ni, ne kisika ne drugega.
+ ATP nastaja le s fosforilacijo na ravni substrata, elektrone pa sprejme organski produkt.
- ATP nastaja v ATP-sintazi s protonskim gradientom, le brez kisika.
~ Tako deluje anaerobno dihanje. Fermentacija verige za prenos elektronov in protonskega gradienta nima.
> Pri fermentaciji $\mathrm{NADH}$ odda elektrone piruvatu ali iz njega nastalemu produktu, ATP pa nastane le v glikolizi.

? $\mathrm{NADH}$ ($E_0' = -0{,}32\,\mathrm{V}$) odda $2$ elektrona fumaratu ($E_0' = +0{,}03\,\mathrm{V}$). Koliko je $\Delta G_0'$? ($F = 96{,}485\,\mathrm{kJ/(V\cdot mol)}$)
- $+56{,}0\,\mathrm{kJ/mol}$
~ Izpustil si predznak potenciala $\mathrm{NADH}$ in računal $0{,}03 - 0{,}32$. Pravilno je sprejemnik minus darovalec: $0{,}03 - (-0{,}32)$.
- $-33{,}8\,\mathrm{kJ/mol}$
~ Upošteval si le en elektron. $\mathrm{NADH}$ odda dva, zato je $n = 2$.
+ $-67{,}5\,\mathrm{kJ/mol}$
> $\Delta E_0' = 0{,}03 + 0{,}32 = 0{,}35\,\mathrm{V}$, $\Delta G_0' = -2 \cdot 96{,}485 \cdot 0{,}35 \approx -67{,}5\,\mathrm{kJ/mol}$.

? Študent je rešil nalogo: »Bakterija oksidira $\mathrm{H_2S}$ s kisikom, ogljik dobi iz $\mathrm{CO_2}$. (1) Energijo dobi iz kemične reakcije, je kemotrof. (2) Darovalec je anorganski, je litotrof. (3) Sprejemnik je kisik, zato gre za fermentacijo.« Kje je napaka?
- V koraku 1.
~ Korak 1 je pravilen: svetlobe ne uporablja, energijo dobi iz kemične reakcije.
- V koraku 2.
~ $\mathrm{H_2S}$ je anorganski darovalec, zato je oznaka litotrof pravilna.
+ V koraku 3.
- Napake ni.
~ Če obstaja zunanji sprejemnik (kisik), to ni fermentacija.
> Ker elektrone sprejme kisik, je to aerobno dihanje kemolitoavtotrofa, ne fermentacija.

? Zakaj da anaerobno dihanje s sulfatom manj ATP kot aerobno dihanje z isto organsko snovjo?
- Ker anaerobno dihanje nima verige za prenos elektronov.
~ Veriga obstaja; brez nje bi šlo za fermentacijo.
- Ker sulfat prinese manj energije kot kisik.
~ Energije ne prinese sprejemnik, ampak darovalec. Sprejemnik določa le, kako globoko elektroni padejo.
+ Ker ima sulfat veliko nižji $E_0'$ kot kisik, zato je padec elektronov manjši.
> $\Delta G_0'$ je sorazmerna z razliko potencialov. $\mathrm{SO_4^{2-}/H_2S}$ ima $-0{,}22\,\mathrm{V}$, $\mathrm{O_2/H_2O}$ pa $+0{,}82\,\mathrm{V}$.

? V zaprtem rezervoarju vode brez kisika se nabira plin $\mathrm{N_2}$, nitrata v vodi pa je vse manj. Kateri metabolizem poteka?
- Fermentacija.
~ Fermentacija ne porablja zunanjega sprejemnika, nitrat pa tu izginja.
+ Anaerobno dihanje z nitratom (denitrifikacija).
- Oksigena fotosinteza.
~ Oksigena fotosinteza bi sproščala kisik, ne dušika, nitrata pa ne porablja kot sprejemnik elektronov.
> Nitrat je končni sprejemnik elektronov in se reducira do $\mathrm{N_2}$. To je denitrifikacija, oblika anaerobnega dihanja.

:::simboli
\Delta G_0' | standardna sprememba proste energije (proste entalpije) | \Delta G_0' = -n\,F\,\Delta E_0' | kJ/mol | negativna: reakcija sprošča energijo
n | število prenesenih elektronov | | –
F | Faradayeva konstanta | | kJ/(V mol) | 96,485 kJ/(V mol)
\Delta E_0' | razlika standardnih redoks potencialov | \Delta E_0' = E_0'(\text{sprejemnik}) - E_0'(\text{darovalec}) | V | večja razlika, več energije
E_0' | standardni redoks potencial pri pH 7 | | V
:::
