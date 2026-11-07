---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ponoči pripeljejo na urgenco otroka z vročino in trdim tilnikom. Kultura likvorja bo znana šele čez dan ali dva, antibiotik pa mora dobiti v eni uri. Laborantka kapljico likvorja razmaže na stekelce, ga v desetih minutah obarva po Gramu in pod mikroskopom vidi rožnate dvojne koke. To je dovolj, da zdravnik izbere zdravilo. Barvanje ne prepozna vrste, prepozna pa **zgradbo ovojnice** bakterije, od katere je odvisno, kateri antibiotik pride do tarče.

Podobno je zgradba pojasnila fizikalni poskus. Leta 1974 so bakterijo *E. coli* za en sam biček prilepili na stekelce. Če bi biček deloval kot bič, bi celica le trzala. Celica pa se je enakomerno vrtela, enkrat v eno, drugič v drugo smer. Biček je torej vijak, ki ga v ovojnici poganja vrtljiv motor. Za razumevanje bakterij v kliniki, industriji in okolju moraš poznati njihove štiri ključne zgradbe: **celično steno**, **membrano**, **bičke** in **endospore**.

## Razlaga

### Zemljevid celice

Prokariontska celica nima jedra in organelov z membrano; to že poznaš. Za mikrobiologijo je pomembno, kaj ima *na površini*, ker tam bakterija sreča okolje, gostitelja in zdravila. Od zunaj navznoter:

- **glikokaliks** (kapsula ali sluzna plast): polisaharidi ali polipeptidi, zaščita pred fagocitozo in izsušitvijo, lepljenje v biofilmih;
- **priveski**: bički za gibanje, fimbrije in pili za pritrjevanje in prenos DNA;
- **celična stena**: daje obliko in zdrži osmotski tlak;
- **citoplazemska membrana**: pregrada, prenašalci, pridobivanje energije;
- **citoplazma**: nukleoid, ribosomi $70\mathrm{S}$, plazmidi, inkluzije (zaloge).

Pri nekaterih vrstah se v neugodnih razmerah znotraj celice razvije **endospora**, mirujoča oblika, ki preživi skoraj vse.

### Celična stena: peptidoglikan

**Definicija.** **Peptidoglikan** (murein) je mrežast polimer, ki obdaja bakterijsko celico kot ena sama velikanska molekula (sakulus). Sestavljen je iz glikanskih verig izmeničnih ostankov **N-acetilglukozamina** (NAG) in **N-acetilmuraminske kisline** (NAM), povezanih z vezjo $\beta(1\to4)$. Na vsako NAM je vezan kratek peptid (navadno L-Ala, D-Glu, mezo-diaminopimelinska kislina ali L-Lys, D-Ala), sosednji peptidi pa so med seboj prečno povezani.

Mrežo si predstavljaj kot ribiško mrežo: glikanske verige so vodoravne niti, peptidni mostovi navpični vozli. Prečne povezave sklepajo **transpeptidaze** (beljakovine, ki vežejo penicilin, PBP). Pri *E. coli* gre vez neposredno od mezo-DAP ene verige do D-Ala druge, pri *Staphylococcus aureus* pa jo premosti most iz petih glicinov.

D-aminokisline in NAM so posebnost bakterij, zato je peptidoglikan odlična tarča:

- **penicilini** in drugi $\beta$-laktami vežejo transpeptidaze; nova stena nima prečnih vezi in rastoča celica poči;
- **lizocim** iz solz, sline in beljaka cepi vez $\beta(1\to4)$ med NAM in NAG;
- človeške celice peptidoglikana nimajo, zato ta zdravila nanje ne delujejo.

Stena ni okras: citoplazma ima precej višjo koncentracijo raztopljenih snovi od okolja, zato voda vdira v celico in ustvari **turgorski tlak**, pri gram-pozitivnih bakterijah okoli $2\,\mathrm{MPa}$ (dvajsetkratni zračni tlak), pri gram-negativnih nekaj desetink MPa. Membrana sama bi pri takem tlaku počila; tlak prevzame stena, kot plašč avtomobilske pnevmatike prevzame tlak zračnice.

### Dve vrsti ovojnice

Leta 1884 je Hans Christian Gram opazil, da se bakterije po istem postopku barvanja razdelijo v dve skupini. Danes vemo, da barva razkrije dve različni zgradbi ovojnice.

**Gram-pozitivna ovojnica** (prerez, zunaj zgoraj):

```
 ################################
 #  debel peptidoglikan        #
 #  20-80 nm, + teihojske k.  #
 ################################
 ==== citoplazemska membrana ====
        citoplazma
```

Peptidoglikan ima več deset plasti in obsega večino suhe mase stene. Vanj so vpete **teihojske kisline** (polimeri glicerol- ali ribitol-fosfata); **lipoteihojske** so zasidrane v membrano. Fosfati dajo površini negativni naboj, vežejo kovinske ione in sodelujejo pri pritrjevanju na gostitelja.

**Gram-negativna ovojnica**:

```
 ~~~~~ LPS (O-antigen) ~~~~~~~~
 ===== zunanja membrana =======
 . . . periplazma . . . . . . .
 ----- tanek peptidoglikan ----
 . . . periplazma . . . . . . .
 ===== notranja membrana ======
        citoplazma
```

Peptidoglikan je tanek, $2$ do $7\,\mathrm{nm}$, v eni ali dveh plasteh. Leži v **periplazmi**, prostoru med membranama, ki je poln encimov in vezavnih beljakovin. Nad njim je **zunanja membrana**, na peptidoglikan pritrjena z Braunovim lipoproteinom. Njena notranja plast je iz fosfolipidov, zunanja iz **lipopolisaharida** (LPS):

- **lipid A** zasidra LPS v membrano; ob razpadu bakterij v krvi sproži vročino in šok, zato ga imenujemo **endotoksin**;
- **sredica** iz sladkorjev;
- **O-antigen**, dolga veriga sladkorjev, ki se med sevi razlikuje (serotipi, npr. *E. coli* O157).

Zunanja membrana je pregrada za velike in hidrofobne molekule. Majhne hidrofilne snovi (pod okoli $600\,\mathrm{Da}$) prehajajo skozi **porine**, kanalčke v zunanji membrani. Penicilin G je sicer majhen, a razmeroma hidrofoben, zato skozi porine prehaja počasi, v periplazmi pa ga pogosto razgradijo $\beta$-laktamaze; zato je proti gram-negativnim slabo učinkovit. Lizocim (beljakovina, okoli $14\,\mathrm{kDa}$) je za porine prevelik in brez pomoči (npr. EDTA, ki odstrani $\mathrm{Mg^{2+}}$ iz LPS) sploh ne pride do peptidoglikana.

**Mehanizem barvanja po Gramu.** Postopek ima štiri korake:

1. **kristal vijolično** obarva vse celice vijolično;
2. **Lugolova raztopina** (jod) z barvilom tvori velik kompleks;
3. **razbarvanje** z etanolom ali acetonom: pri gram-pozitivnih alkohol izsuši debel peptidoglikan, pore se zožijo in kompleks ostane ujet; pri gram-negativnih alkohol raztopi lipide zunanje membrane, tanek peptidoglikan kompleksa ne zadrži in celice se razbarvajo;
4. **safranin** (protibarvilo) obarva razbarvane celice rožnato.

Rezultat: gram-pozitivne so vijolične, gram-negativne rožnate. Barvanje je zanesljivo le pri mladih kulturah: v starih celicah se stena tanjša in gram-pozitivne bakterije postanejo **gram-variabilne**.

:::premisli
Laborant pri barvanju pozabi na korak z etanolom. Kakšne barve bodo na koncu *E. coli* in *S. aureus*? Kaj pa, če etanol drži na stekelcu predolgo?
---
Brez razbarvanja kompleks ostane v obeh, zato sta obe vijolični in safranin se ne opazi: vse je »gram-pozitivno«. Predolgo razbarvanje izpere kompleks tudi iz gram-pozitivnih, zato so obe rožnati. Zato v vsako serijo damo kontrolni preparat z znanima bakterijama.
:::

**Izjeme.** **Mikobakterije** (povzročitelj tuberkuloze) imajo v steni voskaste **mikolne kisline**, vezane na arabinogalaktan; barvila slabo sprejmejo, a jih ob segrevanju zadržijo tudi pri razbarvanju s kislim alkoholom. Imenujemo jih **acidorezistentne** in barvamo po Ziehl-Neelsenu. **Mikoplazme** stene nimajo; njihovo membrano utrjujejo steroli, nanje penicilin ne deluje. **Arheje** nimajo peptidoglikana; nekatere imajo **psevdomurein** (namesto NAM N-acetiltalozaminuronska kislina, vez $\beta(1\to3)$, odporen proti lizocimu), mnoge le beljakovinsko **plast S**.

### Citoplazemska membrana

**Definicija.** **Citoplazemska membrana** je fosfolipidni dvosloj, debel okoli $8\,\mathrm{nm}$, z vgrajenimi beljakovinami (okoli polovica mase), ki loči citoplazmo od okolja in uravnava prehajanje snovi.

Pri bakterijah so v membrani poleg prenašalcev še **veriga za prenos elektronov**, **ATP-sintaza**, encimi za sintezo stene ter receptorji za kemotakso. Bakterije nimajo sterolov (razen mikoplazem); membrano utrjujejo **hopanoidi**, molekule podobne oblike. Membrana **arhej** je drugačna: glicerol je na verige vezan z **etrsko** vezjo, verige so razvejeni izoprenoidi, pri termofilih pa dve plasti nadomesti enoplastna membrana iz tetraetrov, ki se pri visoki temperaturi ne razcepi.

Ker bakterija nima mitohondrijev, ima membrana tudi njihovo nalogo. Veriga za prenos elektronov črpa protone iz celice in na membrani ustvari dve razliki hkrati: električno (notranjost negativna) in kemijsko (zunaj več $\mathrm{H^+}$). Skupaj ju izrazimo z **protonsko gonilno silo** (v mV):

$$\Delta p = \Delta\psi - Z\,\Delta\mathrm{pH}.$$

Tu je $\Delta\psi$ membranski potencial (notranjost minus zunanjost, negativen), $\Delta\mathrm{pH} = \mathrm{pH}_\mathrm{not} - \mathrm{pH}_\mathrm{zun}$ (pozitiven, ker je znotraj bolj bazično), $Z = 2{,}303\,RT/F$ pa pri $37\,^\circ\mathrm{C}$ znaša okoli $61{,}5\,\mathrm{mV}$. Oba prispevka imata isti predznak in se seštejeta v negativno $\Delta p$: protoni »želijo« nazaj v celico. Ko tečejo nazaj, poganjajo ATP-sintazo, prenašalce in motorje bičkov. Kako je veriga zgrajena, je snov lekcije o mikrobnem metabolizmu; tukaj je pomembno, da je membrana bakterijska »elektrarna«.

### Bički

**Definicija.** **Biček** (flagel) je dolg vijačen privesek, ki ga celica vrti in se z njim poganja. Sestavljajo ga **filament** (votla vijačnica iz beljakovine flagelina, debela okoli $20\,\mathrm{nm}$ in dolga $5$ do $10\,\mu\mathrm{m}$), **kavelj** (prožen zgib) in **bazalno telo**, ki je pravi motor.

Bazalno telo gram-negativne bakterije (zunaj zgoraj):

```
   ~~~~~ filament ~~~~~~
          |
          ) kavelj
   [ L ]  v zunanji membrani
   [ P ]  v peptidoglikanu
   [ MS]  v notranji membrani
   [ C ]  v citoplazmi: stikalo
  statorji MotA/MotB ob obroču MS
```

Obroča L in P sta ležaja, skozi katera se vrti os. Gram-pozitivne bakterije nimajo zunanje membrane, zato imajo le obroče MS in C. **Statorji** so kanalčki za protone, pritrjeni na steno; ko protoni tečejo skoznje po protonski gonilni sili, potiskajo rotor. Motor *E. coli* se vrti s frekvenco okoli $100\,\mathrm{Hz}$ in za en obrat porabi okoli tisoč protonov. Nekatere morske vibrije namesto protonov uporabljajo $\mathrm{Na^+}$.

**Razporeditev** bičkov je razločevalni znak: monotrih (en biček na polu, *Vibrio*), lofotrih (šop na polu), amfitrih (na obeh polih), peritrih (po vsej površini, *E. coli*, *Salmonella*). Spirohete imajo **endoflagele** v periplazmi in se zvijajo kot zamašek.

**Gibanje in kemotaksa.** Ko se motorji peritrihe vrtijo v nasprotni smeri urinega kazalca (gledano od zunaj), se bički zvijejo v šop in celica plava naravnost (**tek**, okoli $1\,\mathrm{s}$). Ko se nekaj motorjev obrne, se šop razpleta in celica se **prekucne** (okoli $0{,}1\,\mathrm{s}$) v naključno novo smer. Receptorji v membrani primerjajo koncentracijo privlačila zdaj in pred kratkim; kadar raste, so prekucnitve redkejše. Tako celica z naključnim sprehodom vendarle napreduje proti hrani.

:::premisli
Bakterija plava v vodi s hitrostjo $30\,\mu\mathrm{m/s}$. Kaj se zgodi, ko motor nenadoma ustavi: ali celica, kot čoln, še nekaj časa drsi naprej?
---
Ne. Za tako majhno telo so viskozne sile ogromne v primerjavi z vztrajnostjo, zato se ustavi praktično takoj, na razdalji, manjši od premera atoma (Primer 3). Bakterija ne more »zamahniti in drseti«; poganjati se mora neprestano in z gibanjem, ki ni simetrično v času, kot je vrtenje vijaka.
:::

**Drugi priveski.** **Fimbrije** so kratke in številne, služijo pritrjevanju (npr. uropatogena *E. coli* na sečila). **Spolni pil** (F-pil) poveže celico darovalko s prejemnico pri konjugaciji. Pili tipa IV se krčijo in celico vlečejo po podlagi (trzajoče gibanje).

### Endospore

**Definicija.** **Endospora** je mirujoča, zelo odporna celica, ki nastane znotraj vegetativne celice nekaterih gram-pozitivnih bakterij (rodova *Bacillus* in *Clostridium*, tudi *Clostridioides difficile*), ko jim zmanjka hranil. Ena celica naredi eno sporo, zato sporulacija **ni razmnoževanje**, ampak način preživetja.

Zgradba od zunaj navznoter:

```
 ( eksosporij (pri nekaterih) )
  ( plašč: plasti beljakovin )
   ( korteks: peptidoglikan )
    ( notranja membrana    )
     ( sredica: DNA, Ca-DPA )
```

- **Sredica** vsebuje DNA, ribosome in encime, a le $10$ do $25\,\%$ vode, zato so encimi neaktivni in odporni proti vročini.
- **Kalcijev dipikolinat** (Ca-DPA) obsega okoli $10\,\%$ suhe mase spore; veže vodo in stabilizira DNA.
- **Majhne kisletopne beljakovine** (SASP) ovijejo DNA in jo varujejo pred UV in vročino.
- **Korteks** je ohlapno prečno povezan peptidoglikan, ki sredico stisne in vzdržuje njeno nizko vsebnost vode.
- **Plašč** iz beljakovin zadrži encime in kemikalije.

**Sporulacija** traja okoli $8$ ur: nesimetrična delitev, nato materinska celica objame manjšo predsporo (ta ima zdaj dve membrani), med membranama nastane korteks, zunaj plašč, sredica se izsuši in napolni z DPA, nazadnje materinska celica razpade in sprosti sporo. **Kalitev** sprožijo hranila (npr. L-alanin), pogosto po aktivaciji s toploto: spora izgubi DPA, se napije vode, korteks razpade in v nekaj minutah je spet presnovno aktivna.

Spore preživijo vrenje več ur, izsušitev desetletja, UV in razkužila. Zato v laboratoriju steriliziramo z nasičeno paro pri $121\,^\circ\mathrm{C}$. Lega spore v celici (končna, podkončna, osrednja) in to, ali celico napihne, pomaga pri določanju vrste; spore barvamo z malahitnim zelenilom ob segrevanju (po Schaeffer-Fultonu).

## Rešeni primeri

### Primer 1 (lažji)

V laboratoriju po Gramu obarvaš tri preparate. A: vijolični koki v grozdih. B: rožnate paličke. C: kultura iz rodu *Bacillus*, stara $48$ ur: del paličk vijoličen, del rožnat, v mnogih celicah neobarvana ovalna telesca. Kaj sklepaš o zgradbi ovojnice v vsakem primeru?

**Podatki:** A vijolični koki v grozdih; B rožnate paličke; C stara kultura *Bacillus* ($48\,\mathrm{h}$), mešano vijolično in rožnato, neobarvana ovalna telesca
**Iščemo:** razlago zgradbe ovojnice za A, B in C

:::formula
vijolično = kompleks ostane v debelem peptidoglikanu; rožnato = razbarvano, tanek peptidoglikan in zunanja membrana; stare kulture so lahko gram-variabilne; spore barvila ne sprejmejo
:::

**Rešitev:**

1. A: kompleks kristal vijoličnega in joda je ostal ujet, ker je debel peptidoglikan po razbarvanju zadržal pore zaprte. To je gram-pozitivna ovojnica (oblika ustreza stafilokokom).
2. B: kompleks se je izpral, safranin je celice obarval rožnato. Ovojnica ima tanek peptidoglikan v periplazmi in zunanjo membrano z LPS.
3. C: rod *Bacillus* je gram-pozitiven, a v stari kulturi se stena tanjša in se razgrajuje, zato del celic izgubi barvilo. Neobarvana telesca so endospore, katerih plašč barvila ne prepusti.
4. Odgovor: A gram-pozitivna, B gram-negativna; C je gram-pozitivna bakterija, ki je zaradi starosti gram-variabilna in tvori endospore. Za zanesljiv rezultat barvamo $18$ do $24$ ur staro kulturo.

### Primer 2

V poskusu z membranskimi barvili so pri *E. coli* pri $37\,^\circ\mathrm{C}$ izmerili membranski potencial $-120\,\mathrm{mV}$ (notranjost negativna). Notranjost ima pH $7{,}6$, gojišče pH $6{,}85$. Izračunaj protonsko gonilno silo in energijo, ki jo sprosti en proton, ko steče v celico (osnovni naboj $1{,}602 \cdot 10^{-19}\,\mathrm{C}$). Kolikšen del prispeva razlika pH?

**Podatki:** $\Delta\psi = -120\,\mathrm{mV}$, $\mathrm{pH}_\mathrm{not} = 7{,}6$, $\mathrm{pH}_\mathrm{zun} = 6{,}85$, $T = 310\,\mathrm{K}$, $Z = 61{,}5\,\mathrm{mV}$, $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$
**Iščemo:** $\Delta p$, energijo $E_\mathrm{H}$ na proton, delež kemijskega dela

:::formula
$\Delta p = \Delta\psi - Z\,\Delta\mathrm{pH}$, $\Delta\mathrm{pH} = \mathrm{pH}_\mathrm{not} - \mathrm{pH}_\mathrm{zun}$, $E_\mathrm{H} = e_0\,|\Delta p|$
:::

**Rešitev:**

1. Razlika pH: $\Delta\mathrm{pH} = 7{,}6 - 6{,}85 = 0{,}75$; znotraj je bolj bazično, ker veriga črpa protone ven.
2. Kemijski del: $Z\,\Delta\mathrm{pH} = 61{,}5 \cdot 0{,}75\,\mathrm{mV} \approx 46\,\mathrm{mV}$.
3. Gonilna sila: $\Delta p = -120\,\mathrm{mV} - 46\,\mathrm{mV} \approx -166\,\mathrm{mV}$. Predznak minus pomeni, da proton teče v celico »navzdol«.
4. Energija na proton: $E_\mathrm{H} = 1{,}602 \cdot 10^{-19}\,\mathrm{C} \cdot 0{,}166\,\mathrm{V} \approx 2{,}66 \cdot 10^{-20}\,\mathrm{J}$, na mol protonov okoli $16\,\mathrm{kJ}$.
5. Delež razlike pH: $46/166 \approx 0{,}28$.
6. Odgovor: $\Delta p \approx -166\,\mathrm{mV}$, en proton sprosti okoli $2{,}7 \cdot 10^{-20}\,\mathrm{J}$; razlika pH prispeva nekaj več kot četrtino, večino pa električni potencial.

### Primer 3 (težji)

Fizikalni poskus s plavajočo bakterijo. Celico obravnavaj kot kroglo s polmerom $1{,}0\,\mu\mathrm{m}$ (dolžina celice $2{,}0\,\mu\mathrm{m}$) in gostoto vode $1000\,\mathrm{kg/m^3}$; plava s hitrostjo $30\,\mu\mathrm{m/s}$ v vodi z viskoznostjo $1{,}0 \cdot 10^{-3}\,\mathrm{Pa\,s}$. Šop bičkov se vrti s $100\,\mathrm{Hz}$, motor za obrat porabi $1200$ protonov, $\Delta p = -166\,\mathrm{mV}$.
a) Izračunaj Reynoldsovo število in pokaži, da vztrajnost ne igra vloge.
b) Kako daleč odplava celica po ustavitvi motorja? (Pri Stokesovem uporu hitrost pada eksponentno s časovno konstanto $\tau = m/(6\pi\eta r)$, pot do ustavitve je $v\tau$.)
c) Primerjaj moč, ki jo motor prejme od protonov, z močjo za premagovanje upora vode.

**Podatki:** $r = 1{,}0 \cdot 10^{-6}\,\mathrm{m}$, $l = 2{,}0 \cdot 10^{-6}\,\mathrm{m}$, $\rho = 1000\,\mathrm{kg/m^3}$, $v = 3{,}0 \cdot 10^{-5}\,\mathrm{m/s}$, $\eta = 1{,}0 \cdot 10^{-3}\,\mathrm{Pa\,s}$, $f = 100\,\mathrm{Hz}$, $N = 1200$ protonov na obrat, $\Delta p = -0{,}166\,\mathrm{V}$, $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$
**Iščemo:** $\mathrm{Re}$; pot $s$ po ustavitvi; moči $P_\mathrm{H}$ in $P_\mathrm{u}$ ter njuno razmerje

:::formula
$\mathrm{Re} = \dfrac{\rho v l}{\eta}$, $F_\mathrm{u} = 6\pi\eta r v$, $m = \rho\,\tfrac{4}{3}\pi r^3$, $\tau = \dfrac{m}{6\pi\eta r}$, $s = v\tau$, $P_\mathrm{u} = F_\mathrm{u}v$, $P_\mathrm{H} = N f e_0|\Delta p|$
:::

**Rešitev:**

1. a) $\mathrm{Re} = 1000 \cdot 3{,}0 \cdot 10^{-5} \cdot 2{,}0 \cdot 10^{-6}/1{,}0 \cdot 10^{-3} = 6{,}0 \cdot 10^{-5}$. Plavalec v bazenu ima $\mathrm{Re}$ okoli $10^6$; pri bakteriji so viskozne sile desettisočkrat večje od vztrajnostnih.
2. b) Masa: $m = 1000 \cdot \tfrac{4}{3}\pi \cdot (1{,}0 \cdot 10^{-6})^3\,\mathrm{kg} \approx 4{,}19 \cdot 10^{-15}\,\mathrm{kg}$.
3. Časovna konstanta: $6\pi\eta r \approx 1{,}885 \cdot 10^{-8}\,\mathrm{kg/s}$, zato $\tau = 4{,}19 \cdot 10^{-15}/1{,}885 \cdot 10^{-8}\,\mathrm{s} \approx 2{,}2 \cdot 10^{-7}\,\mathrm{s}$.
4. Pot: $s = 3{,}0 \cdot 10^{-5}\,\mathrm{m/s} \cdot 2{,}2 \cdot 10^{-7}\,\mathrm{s} \approx 6{,}7 \cdot 10^{-12}\,\mathrm{m}$, kar je manj od desetine premera atoma vodika.
5. c) Sila upora: $F_\mathrm{u} = 1{,}885 \cdot 10^{-8}\,\mathrm{kg/s} \cdot 3{,}0 \cdot 10^{-5}\,\mathrm{m/s} \approx 5{,}65 \cdot 10^{-13}\,\mathrm{N}$, moč $P_\mathrm{u} = F_\mathrm{u}v \approx 1{,}7 \cdot 10^{-17}\,\mathrm{W}$.
6. Protoni na sekundo: $1200 \cdot 100\,\mathrm{s^{-1}} = 1{,}2 \cdot 10^5\,\mathrm{s^{-1}}$; moč $P_\mathrm{H} = 1{,}2 \cdot 10^5 \cdot 1{,}602 \cdot 10^{-19} \cdot 0{,}166\,\mathrm{W} \approx 3{,}2 \cdot 10^{-15}\,\mathrm{W}$.
7. Razmerje: $P_\mathrm{u}/P_\mathrm{H} \approx 1{,}7 \cdot 10^{-17}/3{,}2 \cdot 10^{-15} \approx 0{,}005$.
8. Odgovor: $\mathrm{Re} \approx 6 \cdot 10^{-5}$, po ustavitvi celica odplava le okoli $7 \cdot 10^{-12}\,\mathrm{m}$, za plavanje pa porabi le okoli pol odstotka moči, ki jo protoni dajo motorju. Večina energije gre v vrtenje vijaka v viskozni vodi. Pri majhnem $\mathrm{Re}$ recipročno mahanje (naprej in nazaj po isti poti) celice ne premakne, vrtenje vijaka pa jo; bakterija si tak potratni pogon lahko privošči, ker motor porabi le majhen del njene celotne energije.

### Primer 4 – zdaj ti

Kok gram-pozitivne bakterije ima turgorski tlak $2{,}0\,\mathrm{MPa}$, polmer $0{,}50\,\mu\mathrm{m}$ in steno debeline $30\,\mathrm{nm}$. Steno obravnavaj kot tanko kroglasto lupino, v kateri je natezna napetost $\sigma = pr/(2d)$. Kolikšna je napetost v steni?

**Podatki:** $p = 2{,}0 \cdot 10^6\,\mathrm{Pa}$, $r = 0{,}50 \cdot 10^{-6}\,\mathrm{m}$, $d = 30 \cdot 10^{-9}\,\mathrm{m}$
**Iščemo:** natezno napetost $\sigma$ v steni

:::formula
$\sigma = \dfrac{p r}{2d}$
:::

**Rešitev:**

1. Napetost nastane, ker tlak razteza lupino; pri tanki lupini se porazdeli po prerezu stene.
2. Števec: $p r = 2{,}0 \cdot 10^6 \cdot 0{,}50 \cdot 10^{-6}\,\mathrm{N/m} = 1{,}0\,\mathrm{N/m}$.
3. Zdaj ti: deli z $2d$ in rezultat izrazi v MPa.

:::premisli
Kolikšna je $\sigma$? Kaj se zgodi, če penicilin ustavi prečno povezovanje nove stene?
---
$\sigma = 1{,}0\,\mathrm{N/m}/(2 \cdot 30 \cdot 10^{-9}\,\mathrm{m}) \approx 1{,}7 \cdot 10^7\,\mathrm{Pa} = 17\,\mathrm{MPa}$, kar je napetost reda velikosti trdnosti plastike. Stena brez prečnih vezi te napetosti ne zdrži: na mestu rasti se pretrga, membrana izboči in celica poči (osmotska liza).
:::

## Pogoste napake

- **»Gram-pozitivne bakterije imajo dodatno membrano.«** Ravno obratno: dodatno, zunanjo membrano imajo gram-negativne. Gram-pozitivne imajo debelejši peptidoglikan, a eno samo membrano.
- **»Barva je odvisna od tega, ali bakterija sprejme barvilo.«** Barvilo sprejmejo vse; odločilno je, ali ga pri razbarvanju **zadržijo**. Napačno razbarvanje zato da napačen rezultat pri pravilni bakteriji.
- **»Penicilin razgradi steno.«** Penicilin ne cepi obstoječega peptidoglikana (to dela lizocim), ampak zavre transpeptidaze, ki prečno povezujejo **novega**. Zato deluje le na celice, ki rastejo.
- **»Biček maha kot bič.«** Bakterijski biček je tog vijak, ki ga vrti rotacijski motor s protoni (ali $\mathrm{Na^+}$), ne z ATP. Evkariontski biček (spermij) je druga, z ATP gnana zgradba z mikrotubuli.
- **»Endospora je način razmnoževanja.«** Iz ene celice nastane ena spora in iz nje spet ena celica; število se ne poveča. Spora je oblika preživetja.
- **»Arheje so bakterije z nenavadnim okoljem.«** Arheje nimajo peptidoglikana, njihovi membranski lipidi imajo etrske vezi in izoprenoidne verige; so posebna domena.

## Povzetek

- Peptidoglikan: verige NAG–NAM ($\beta(1\to4)$), peptidi z D-aminokislinami, prečne vezi s transpeptidazami; tarča penicilinov (sinteza) in lizocima (vez $\beta(1\to4)$); prevzame turgorski tlak.
- Gram-pozitivna ovojnica: membrana in debel peptidoglikan ($20$ do $80\,\mathrm{nm}$) s teihojskimi kislinami. Gram-negativna: notranja membrana, periplazma s tankim peptidoglikanom, zunanja membrana z LPS (lipid A = endotoksin) in porini.
- Barvanje po Gramu: kristal vijolično, jod, razbarvanje, safranin; razliko da zadrževanje kompleksa. Izjeme: mikobakterije (mikolne kisline), mikoplazme (brez stene), arheje (psevdomurein, plast S).
- Membrana: fosfolipidni dvosloj s hopanoidi; arheje etrski lipidi. Protonska gonilna sila $\Delta p = \Delta\psi - Z\,\Delta\mathrm{pH}$ poganja ATP-sintazo, transport in bičke.
- Biček: filament, kavelj, bazalno telo (obroči L, P, MS, C; statorji MotA/MotB); rotacijski motor na protone; tek in prekucnitev, kemotaksa; razporeditve mono-, lofo-, amfi-, peritrih.
- Endospora (*Bacillus*, *Clostridium*): sredica z malo vode, Ca-DPA in SASP, korteks, plašč; sporulacija okoli $8$ h, kalitev; preživi vrenje, steriliziramo pri $121\,^\circ\mathrm{C}$.

## Za izpit

Znati moraš povedati:

- zgradbo peptidoglikana (sladkorji, vez, peptid, prečna vez) in kje nanj delujeta penicilin in lizocim;
- primerjavo gram-pozitivne in gram-negativne ovojnice z vsemi plastmi ter sestavo in pomen LPS;
- korake barvanja po Gramu z mehanizmom in vzroke napačnih rezultatov; izjeme (mikobakterije, mikoplazme, arheje);
- razlike med membrano bakterij in arhej ter pomen protonske gonilne sile;
- zgradbo bazalnega telesa bička in mehanizem kemotakse;
- zgradbo endospore, dejavnike odpornosti, stopnje sporulacije in kalitve.

### Naloga 1

Gram-negativna paličasta bakterija (valj s polmerom $0{,}40\,\mu\mathrm{m}$) ima v citoplazmi osmotsko aktivne delce s skupno koncentracijo $0{,}30\,\mathrm{mol/L}$, gojišče pa $0{,}050\,\mathrm{mol/L}$; temperatura je $37\,^\circ\mathrm{C}$. a) Izračunaj osmotsko razliko tlakov po van 't Hoffu. b) Izračunaj obodno napetost v peptidoglikanu debeline $4{,}0\,\mathrm{nm}$, če ves tlak nosi ta plast ($\sigma = \Delta\Pi\,r/d$ za tanek valj). c) Bakterije prenesemo v gojišče s penicilinom. Koliko saharoze moramo dodati gojišču, da celice brez stene (sferoplasti) ne počijo? Saharoza ne prehaja membrane in ne disociira. d) Utemelji, zakaj sferoplasti v takem gojišču postanejo okrogli.

**Rešitev:**

1. a) $\Delta\Pi = \Delta c\,RT = (0{,}30 - 0{,}050) \cdot 1000\,\mathrm{mol/m^3} \cdot 8{,}314\,\mathrm{J/(mol\,K)} \cdot 310{,}15\,\mathrm{K} \approx 6{,}4 \cdot 10^5\,\mathrm{Pa}$, okoli $6{,}4$ bara. Pretvorba: $1\,\mathrm{mol/L} = 1000\,\mathrm{mol/m^3}$.
2. b) $\sigma = 6{,}45 \cdot 10^5\,\mathrm{Pa} \cdot 0{,}40 \cdot 10^{-6}\,\mathrm{m}/4{,}0 \cdot 10^{-9}\,\mathrm{m} \approx 6{,}4 \cdot 10^7\,\mathrm{Pa} = 64\,\mathrm{MPa}$. Pri valju je obodna napetost dvakrat večja kot pri krogli z enakim polmerom, zato paličasta celica poči najprej na sredini, kjer nastaja nova stena.
3. V resnici del tlaka nosi tudi zunanja membrana, ki je s peptidoglikanom povezana z lipoproteini; zato je izračun zgornja meja.
4. c) Sferoplast ne poči, če je gojišče izotonično: skupna koncentracija delcev zunaj mora biti $0{,}30\,\mathrm{mol/L}$. Ker jih je že $0{,}050\,\mathrm{mol/L}$, dodamo $0{,}25\,\mathrm{mol/L}$ saharoze (v praksi nekoliko več, okoli $0{,}3$ do $0{,}5\,\mathrm{mol/L}$, ker se citoplazma prilagaja).
5. d) Brez stene obliko določa le membrana, ki ima površinsko napetost; pri dani prostornini ima najmanjšo površino krogla, zato se celica zaokroži.
6. Odgovor: $\Delta\Pi \approx 6{,}4 \cdot 10^5\,\mathrm{Pa}$, napetost v tankem peptidoglikanu okoli $64\,\mathrm{MPa}$; dodati je treba vsaj $0{,}25\,\mathrm{mol/L}$ saharoze, sferoplasti pa so okrogli, ker jih oblikuje le membrana.

### Naloga 2

Natančno opiši zgradbo celične ovojnice gram-pozitivnih in gram-negativnih bakterij in na tej podlagi razloži mehanizem barvanja po Gramu. Utemelji: a) zakaj lizocim gram-pozitivno bakterijo v vodi raztopi, gram-negativne pa ne; b) zakaj lahko razpad gram-negativnih bakterij v krvi po antibiotiku pacientu začasno poslabša stanje.

**Rešitev:**

1. Gram-pozitivna: citoplazemska membrana, nad njo debel večplasten peptidoglikan ($20$ do $80\,\mathrm{nm}$) s teihojskimi in lipoteihojskimi kislinami; zunanje membrane ni.
2. Gram-negativna: notranja membrana, periplazma s tankim peptidoglikanom ($2$ do $7\,\mathrm{nm}$), zunanja membrana (notranji list fosfolipidi, zunanji LPS: lipid A, sredica, O-antigen), porini, Braunov lipoprotein.
3. Barvanje: kristal vijolično obarva vse; jod tvori velik kompleks; etanol pri gram-pozitivnih izsuši peptidoglikan in zapre pore, kompleks ostane; pri gram-negativnih raztopi lipide zunanje membrane, tanek peptidoglikan kompleksa ne zadrži; safranin obarva razbarvane rožnato.
4. a) Pri gram-pozitivni bakteriji je peptidoglikan na površini, lizocim cepi vezi $\beta(1\to4)$, stena izgubi trdnost in celica v hipotonični vodi osmotsko poči. Pri gram-negativni zunanja membrana zadrži lizocim, ker je prevelik za porine; brez EDTA ne pride do peptidoglikana.
5. b) Antibiotik ubije bakterije, ki razpadejo in sprostijo LPS. Lipid A aktivira imunske celice (receptor TLR4), te sprostijo citokine, kar povzroči vročino, padec tlaka in lahko šok. Stanje se lahko poslabša, preden se izboljša.

### Naloga 3

Opiši zgradbo endospore od sredice navzven in za vsako plast navedi njeno vlogo pri odpornosti. Naštej glavne stopnje sporulacije in kalitve. Utemelji, ali je trditev »Kuhanje v loncu 10 minut zanesljivo uniči vse bakterije v konzervi« pravilna, in kaj bi svetoval.

**Rešitev:**

1. Sredica: DNA, ribosomi, encimi; le $10$ do $25\,\%$ vode, zato so beljakovine odporne proti vročini; Ca-DPA (okoli $10\,\%$ suhe mase) veže vodo; SASP ovijejo DNA in jo varujejo pred UV in vročino.
2. Notranja membrana: slabo prepustna za kemikalije, varuje sredico pred razkužili.
3. Korteks: ohlapno povezan peptidoglikan, ki vzdržuje izsušenost sredice. Plašč: beljakovine, pregrada za encime in oksidante. Eksosporij (pri nekaterih vrstah): zunanja ovojnica.
4. Sporulacija: nesimetrična delitev, objem predspore z materinsko celico, sinteza korteksa in plašča, izsušitev sredice in vgradnja Ca-DPA, razpad materinske celice. Kalitev: aktivacija (toplota), zaznava hranil, izguba DPA, vdor vode, razgradnja korteksa, začetek presnove in rast.
5. Trditev ni pravilna: vegetativne celice pri vrenju propadejo, spore (npr. *Clostridium botulinum*) pa preživijo $100\,^\circ\mathrm{C}$ več ur. V konzervi brez kisika z nizko kislostjo nato vzkalijo in tvorijo toksin.
6. Nasvet: živila z nizko kislostjo konzerviramo v loncu na pritisk pri okoli $121\,^\circ\mathrm{C}$ ali jih nakisamo (pH pod $4{,}6$), kar prepreči kalitev in rast.

## Drugače: Z analogijo

Bakterijo si predstavljaj kot **balon v mreži**. Membrana je balon: tanek, napet in poln, ker vanj vdira voda. Peptidoglikan je mreža, ki balon drži, da ne poči. Pri gram-pozitivni bakteriji je mreža debela in na površini, kot več plasti ribiške mreže; pri gram-negativni je tanka, vendar je okoli nje še en balon, zunanja membrana, ki varuje mrežo. Penicilin prepreči zavozlanje novih vozlov v mreži, ko se ta širi; lizocim reže niti obstoječe mreže.

**Biček** je ladijski vijak z elektromotorjem v trupu: elektriko daje protonski tok skozi membrano, obroči L in P so tesnila v steni trupa, kavelj je kardanski zgib. Ker ladja tu plava v »medu«, se ustavi takoj, ko se vijak ustavi.

**Endospora** je trezor: v sredini dokumenti (DNA), suhi in zviti v zaščitno folijo (SASP), okoli njih vrsta sten. Trezor ničesar ne proizvaja in ne »živi«, a preživi požar. Ko je spet varno (hranila), se odpre in pisarna začne delati.

## Drugače: Uporaba v stroki

**Klinična mikrobiologija.** Barvanje po Gramu iz krvne kulture, likvorja ali izpljunka je prvi laboratorijski izvid in vodi začetno zdravljenje. Gram-negativne bakterije so pogosto odpornejše, ker zunanja membrana z ozkimi porini in izlivnimi črpalkami (angl. *efflux*) zmanjša vstop zdravila; mutacije porinov so eden od mehanizmov odpornosti pri *Pseudomonas aeruginosa*.

**Farmacija in proizvodnja zdravil.** Endotoksin (LPS) preživi sterilizacijo s paro, zato morajo biti raztopine za injiciranje in dializo **apirogene**. Endotoksin merijo s testom LAL (lizat amebocitov ostvarja *Limulus polyphemus*), ki se z lipidom A strdi; meja za parenteralna zdravila je izražena v enotah endotoksina na kilogram telesne mase.

**Sterilizacija in validacija.** Za preverjanje avtoklavov uporabljajo **biološke indikatorje**: trakove s sporami *Geobacillus stearothermophilus*, ki so med najodpornejšimi proti vlažni toploti. Če po ciklu nobena spora ne vzkali, je cikel uspešen. Spore *C. difficile* razkužila na alkoholni osnovi ne uničijo, zato v bolnišnicah po stiku s takim bolnikom roke umijemo z milom in vodo.

**Biofizika in biotehnologija.** Motor bička je model za nanostroje; z optičnimi pincetami merijo njegov navor in število korakov na obrat. Flagelin prepozna receptor TLR5 prirojene imunosti, zato ga preizkušajo kot dodatek cepivom.

## Drugače: Bolj natančno

**Sinteza peptidoglikana.** Prekurzor (UDP-NAM-pentapeptid) nastane v citoplazmi, se pritrdi na lipidni nosilec baktoprenol, doda NAG (lipid II) in se obrne na zunanjo stran membrane. Transglikozilaze ga vgradijo v verigo, transpeptidaze pa odcepijo končni D-Ala in tvorijo prečno vez. Vankomicin veže konec D-Ala–D-Ala lipida II, $\beta$-laktami posnemajo ta konec in acilirajo transpeptidazo. Odpornost: $\beta$-laktamaze cepijo zdravilo; pri MRSA nova PBP2a zdravila ne veže; pri enterokokih z odpornostjo na vankomicin se konec spremeni v D-Ala–D-laktat.

**Sistemi izločanja.** Gram-negativne bakterije imajo skozi obe membrani posebne naprave (tipi I do VI). Injekcijski sistem tipa III je po zgradbi soroden bazalnemu telesu bička; z njim *Salmonella* in *Yersinia* vbrizgata beljakovine v gostiteljske celice.

**Arhealni biček (arhelum)** je po zgradbi soroden pilom tipa IV, ne bakterijskemu bičku, in ga poganja ATP. Podobna funkcija je nastala dvakrat neodvisno.

## Preveri se

? Katera sestavina NE spada v ovojnico gram-negativne bakterije?
- lipopolisaharid
~ LPS tvori zunanji list zunanje membrane gram-negativnih bakterij; lipid A je endotoksin.
- porini
~ Porini so kanalčki v zunanji membrani gram-negativnih bakterij, skozi katere prehajajo majhne hidrofilne molekule.
+ teihojske kisline
- periplazma
~ Periplazma je prostor med notranjo in zunanjo membrano, v njem leži tanek peptidoglikan.
> Teihojske kisline so značilne za debel peptidoglikan gram-pozitivnih bakterij. Gram-negativne imajo namesto njih zunanjo membrano z LPS in porini.

? Membranski potencial bakterije pri $37\,^\circ\mathrm{C}$ je $-100\,\mathrm{mV}$, notranjost ima pH $7{,}5$, okolje pH $6{,}5$. Kolikšna je protonska gonilna sila ($Z = 61{,}5\,\mathrm{mV}$)?
- $-38{,}5\,\mathrm{mV}$
~ Kemijski del si prištel s pozitivnim predznakom. Ker je znotraj bolj bazično, je $\Delta\mathrm{pH} > 0$ in $-Z\,\Delta\mathrm{pH}$ je negativen, kot $\Delta\psi$.
- $-100\,\mathrm{mV}$
~ Upošteval si le električni del. Razlika pH prispeva še $61{,}5\,\mathrm{mV}$ v isto smer.
+ $-161{,}5\,\mathrm{mV}$
> $\Delta p = \Delta\psi - Z\,\Delta\mathrm{pH} = -100\,\mathrm{mV} - 61{,}5 \cdot 1{,}0\,\mathrm{mV} = -161{,}5\,\mathrm{mV}$. Oba prispevka potiskata protone v celico.

? Gram-pozitivne bakterije obdelamo z lizocimom: eno skupino v destilirani vodi, drugo v $0{,}5\,\mathrm{mol/L}$ saharozi. Kaj opazimo?
- V obeh skupinah celice ostanejo paličaste, ker lizocim deluje le na gram-negativne.
~ Ravno pri gram-negativnih lizocim brez pomoči ne deluje, ker ga zadrži zunanja membrana. Pri gram-pozitivnih je peptidoglikan na površini.
+ V vodi celice počijo, v saharozi postanejo okrogli protoplasti.
- V obeh skupinah celice počijo, ker brez stene membrana ne zdrži.
~ Membrana ne zdrži le, če voda vdira v celico. V izotonični saharozi osmotske razlike ni, zato protoplast preživi.
> Lizocim cepi peptidoglikan; v hipotonični vodi vdira voda in celica poči. V izotonični saharozi ni neto vdora vode, zato celica brez stene preživi in se zaokroži.

? Študent opiše barvanje po Gramu: (1) kristal vijolično obarva vse celice; (2) jod z barvilom tvori kompleks; (3) pri razbarvanju gram-pozitivne celice izgubijo barvilo, ker debel peptidoglikan vpije alkohol; (4) safranin obarva razbarvane celice rožnato. Kateri korak je napačen?
- (1)
~ Kristal vijolično res obarva vse celice, ne glede na zgradbo stene.
- (2)
~ Jod res deluje kot jedkalo in z barvilom tvori velik kompleks.
+ (3)
- (4)
~ Safranin res obarva celice, ki so pri razbarvanju izgubile kompleks, torej gram-negativne.
> Pri razbarvanju alkohol debel peptidoglikan izsuši in zapre pore, zato gram-pozitivne kompleks **zadržijo** in ostanejo vijolične. Barvilo izgubijo gram-negativne, ker alkohol raztopi lipide zunanje membrane.

? Babica konzervira stročji fižol (nizka kislost) tako, da kozarce $10$ minut kuha v loncu vrele vode. Čez nekaj mesecev se pokrovček enega kozarca napihne. Kaj je najverjetnejši vzrok?
- Vrenje ni uničilo vegetativnih celic, ker je bilo prekratko.
~ Vegetativne celice pri $100\,^\circ\mathrm{C}$ propadejo v nekaj minutah. Problem so oblike, ki vrenje preživijo.
+ Endospore klostridijev so preživele vrenje in v kozarcu brez kisika vzkalile.
- Bakterije so v kozarec prišle skozi pokrovček po zaprtju.
~ Zaprt kozarec je neprepusten za bakterije. Napihnjen pokrov kaže na rast od znotraj, iz preživelih spor.
> Spore *Clostridium* (tudi *C. botulinum*) preživijo vrenje, v anaerobnem in nekislem okolju vzkalijo, rastejo, tvorijo plin in lahko tudi toksin. Zato živila z nizko kislostjo konzerviramo pri okoli $121\,^\circ\mathrm{C}$ v loncu na pritisk.

:::simboli
\Delta p | protonska gonilna sila | \Delta p = \Delta\psi - Z\,\Delta\mathrm{pH} | mV | negativna: protoni tečejo v celico
\Delta\psi | membranski potencial | | mV | notranjost minus zunanjost
\Delta\mathrm{pH} | razlika pH čez membrano | \Delta\mathrm{pH} = \mathrm{pH}_\mathrm{not} - \mathrm{pH}_\mathrm{zun} | –
\mathrm{pH}_\mathrm{not} | pH citoplazme | | –
\mathrm{pH}_\mathrm{zun} | pH okolja | | –
Z | faktor $2{,}303\,RT/F$ | Z = \frac{2{,}303\,RT}{F} | mV | pri 37 °C okoli 61,5 mV
R | splošna plinska konstanta | | J/(mol\,K) | 8,314
F | Faradayeva konstanta | | C/mol
T | temperatura | | K
E_\mathrm{H} | energija, ki jo sprosti en proton | E_\mathrm{H} = e_0|\Delta p| | J
e_0 | osnovni naboj | | C | 1,602·10⁻¹⁹ C
\mathrm{Re} | Reynoldsovo število | \mathrm{Re} = \frac{\rho v l}{\eta} | – | razmerje vztrajnostnih in viskoznih sil
\rho | gostota | | kg/m^3
v | hitrost plavanja | | m/s
l | dolžina celice | | m
\eta | viskoznost vode | | Pa\,s
r | polmer celice | | m
F_\mathrm{u} | sila upora (Stokesova) | F_\mathrm{u} = 6\pi\eta r v | N
m | masa celice | m = \rho\,\tfrac{4}{3}\pi r^3 | kg
\tau | časovna konstanta ustavljanja | \tau = \frac{m}{6\pi\eta r} | s
s | pot po ustavitvi motorja | s = v\tau | m
P_\mathrm{u} | moč za premagovanje upora | P_\mathrm{u} = F_\mathrm{u}v | W
P_\mathrm{H} | moč protonskega toka skozi motor | P_\mathrm{H} = N f e_0|\Delta p| | W
N | število protonov na obrat | | –
f | frekvenca vrtenja bička | | Hz
\sigma | natezna napetost v steni | \sigma = \frac{p r}{2d} | Pa | krogla; valj: ΔΠ·r/d
p | turgorski tlak | | Pa
d | debelina stene | | m
\Delta\Pi | osmotska razlika tlakov | \Delta\Pi = \Delta c\,RT | Pa
\Delta c | razlika koncentracij osmotsko aktivnih delcev | | mol/m^3
:::
