---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Izpitno vprašanje, ki ga zdaj še ne moreš rešiti: *Biotehnološko podjetje želi izdelati človeško monoklonsko protitelo, glikoprotein, ki ga celice izločijo v kri. Gen vstavijo v bakterijo* E. coli *in dobijo neaktiven protein brez sladkorjev, ki ostane v citoplazmi. V kvasovkah se protein izloči, a ima drugačne sladkorje. Šele v celicah iz jajčnikov kitajskega hrčka (celice CHO) dobijo pravo protitelo. Pojasni, zakaj.*

Odgovor skriva sistem notranjih membran evkariontske celice: pot, na kateri protein dobi pravo obliko, sladkorje in naslov. Na koncu razlage se vrnemo k vprašanju.

## Razlaga

### Dva proteina z istega ribosoma

Primerjajmo dva proteina iste celice trebušne slinavke: encim glikolize v citosolu in prebavni encim, ki ga celica izloči. Oba nastaneta na ribosomih iz istih aminokislin. Kje se njuni poti razideta?

- **Citosolni encim:** brez signala na začetku, nastane do konca na prostem ribosomu, brez sladkorjev, ostane v citosolu.
- **Izločeni encim:** na začetku ima signalno zaporedje, dokonča ga ribosom na ER, dobi sladkorje, konča zunaj celice.

Razlika je v prvih dvajsetih ali tridesetih aminokislinah. Iz te majhne razlike sledi vse ostalo.

**Definicija.** **Endomembranski sistem** so z membrano obdani predelki, ki si izmenjujejo membrano in vsebino neposredno ali z **mešički** (vezikli): jedrna ovojnica, **endoplazemski retikulum** (ER), **Golgijev aparat**, endosomi, lizosomi (v rastlinah vakuola), sekrecijski mešički in plazmalema kot končna postaja. Mitohondriji in kloroplasti ne spadajo zraven: proteine sprejemajo neposredno iz citosola in ne izmenjujejo mešičkov.

**Topologija.** Notranjost (lumen) ER in Golgija je topološko enakovredna zunanjosti celice. Ko se mešiček zlije s plazmalemo, se njegov lumen odpre navzven, notranja plast njegove membrane pa postane zunanja plast plazmaleme. Zato je vse, kar je v ER obrnjeno v lumen, na površini celice obrnjeno navzven.

### Vstop v ER: signalna hipoteza

**Definicija.** **Signalno zaporedje** je odsek na N-koncu nastajajočega proteina z jedrom iz okoli $6$ do $15$ hidrofobnih aminokislin.

Potek vnosa:

1. Ko signalno zaporedje izstopi iz ribosoma, ga veže **delec za prepoznavo signala** (SRP). Prevajanje se upočasni.
2. SRP z ribosomom vred se veže na **receptor SRP** na membrani ER. Ribosom prevzame **translokon** (kanal Sec61); SRP se sprosti.
3. Prevajanje se nadaljuje, veriga raste skozi kanal v lumen. Vnos je **kotranslacijski**: protein vstopa med nastajanjem.
4. **Signalna peptidaza** v lumnu odreže signalno zaporedje.

Proteini, ki ostanejo v membrani, imajo še **zaporedje za zaustavitev prenosa**: hidrofoben odsek okoli $20$ aminokislin, ki se iz kanala bočno premakne v lipidni dvosloj. Protein z odcepljenim signalom in enim takim odsekom ima N-konec v lumnu, C-konec v citosolu. Z več hidrofobnimi odseki nastanejo proteini, ki membrano prečkajo večkrat.

:::premisli
Signalno zaporedje encima prestavimo z N-konca na C-konec proteina. Ali bo protein še vstopil v ER? Zakaj?
---
Ne. SRP signal prepozna, ko izstopi iz ribosoma; C-konec izstopi šele ob koncu prevajanja, ko je protein že prost v citosolu. Kotranslacijski vnos potrebuje signal na začetku verige (ali notranji signal, ki izstopi med prevajanjem).
:::

### Kaj se zgodi v ER

**Zrnati ER** (z ribosomi) je mesto, kjer proteini nastanejo in se zvijejo:

- **Zvijanje** pomagajo šaperoni (BiP), **protein disulfid-izomeraza** tvori disulfidne vezi, ki jih v citosolu ni (tam je redukcijsko okolje).
- **N-glikozilacija:** encim oligosahariltransferaza prenese vnaprej sestavljen oligosaharid (iz $14$ sladkornih enot, pripet na lipid dolihol) na asparagin v zaporedju **Asn–X–Ser/Thr**, kjer X ni prolin. Prenos poteka med vnosom.
- **Nadzor kakovosti:** kalneksin in kalretikulin zadržita napol zvite glikoproteine. Trajno napačno zviti proteini se vrnejo v citosol in razgradijo v proteasomu (z ER povezana razgradnja, ERAD). Če se nezviti proteini kopičijo, celica sproži **odziv na nezvite proteine**: manj prevajanja, več šaperonov.

**Gladki ER** (brez ribosomov) sintetizira lipide (fosfolipide v citosolni plasti, ki jih flipaze in skramblaze razporedijo), steroidne hormone, v jetrih razstruplja zdravila (citokromi P450), v mišicah pa kot **sarkoplazemski retikulum** hrani ione $\mathrm{Ca^{2+}}$.

### Golgijev aparat: sortirnica in obdelava

Golgijev aparat je sklad sploščenih cistern s **cis** stranjo proti ER in **trans** stranjo z mrežo cevk (**trans Golgijeva mreža**, TGN). Proteini potujejo od cis proti trans in se med potjo spreminjajo:

- oligosaharidom odcepijo manozo in dodajo druge sladkorje (N-acetilglukozamin, galaktozo, sialno kislino): nastanejo **kompleksni** oligosaharidi;
- na serin in treonin pripnejo sladkorje (**O-glikozilacija**); proteoglikanom dodajo sulfat;
- lizosomskim encimom na cis strani dodajo **manoza-6-fosfat** (M6P).

V TGN se poti razidejo. Receptorji za M6P zberejo lizosomske encime v mešičke, ki gredo v endosome; pri nizkem pH endosoma se encim odcepi, receptor se vrne. Ostali proteini gredo s **konstitutivno sekrecijo** stalno na površino ali se shranijo v sekrecijskih zrncih za **regulirano sekrecijo** (na signal, na primer inzulin ali prebavni encimi).

**Endo H** je encim, ki odcepi le oligosaharide z veliko manoze (iz ER in cis Golgija), kompleksnih pa ne. Če je glikoprotein na Endo H odporen, je že prešel srednje cisterne Golgija. To je pogost laboratorijski test, kje na poti je protein.

### Vezikularni transport

Mešiček nastane, se odcepi, potuje in se zlije s pravo tarčo. Tri vrste **plaščev** določajo smer:

- **COPII:** iz ER v Golgi (naprej);
- **COPI:** iz Golgija nazaj v ER in med cisternami (nazaj);
- **klatrin** (z adaptorji): iz TGN v endosome in iz plazmaleme pri endocitozi; odcep zadrgne GTPaza **dinamin**.

Plašč na membrano pripeljejo majhne GTPaze (Sar1 za COPII, ARF za COPI). Pravo tarčo izbere par **Rab** proteinov in povezovalnih proteinov, zlitje pa izvedejo **SNARE**: v-SNARE na mešičku in t-SNARE na tarči se zvijeta v snop in membrani potegneta skupaj. Po zlitju snop razdre ATPaza NSF.

**Vračanje.** Proteini ER, ki jih tok odnese naprej, imajo na C-koncu signal **KDEL** (Lys–Asp–Glu–Leu). Receptor KDEL v cis Golgiju jih ujame in s COPI mešički vrne v ER.

```
ER --COPII--> cis-Golgi
 ^              |
 +----COPI------+
                v
            trans (TGN)
           /    |    \
     endosom  mešiček  plazmalema
```

:::premisli
Pri bolezni I-celic (mukolipidoza II) celicam manjka encim, ki lizosomskim encimom doda M6P. Kje bomo te encime našli in kakšni bodo lizosomi?
---
Brez M6P jih receptorji v TGN ne prepoznajo, zato gredo po privzeti poti, s konstitutivno sekrecijo, iz celice: veliko jih je v krvi in zunajceličnini. Lizosomi so brez encimov in se polnijo z nerazgrajenimi snovmi (»inkluzije«, od tod ime I-celice).
:::

### Odgovor na uvodno vprašanje

Bakterija nima ER ne Golgija: protein ne vstopi v oksidacijsko okolje za disulfidne vezi in ne dobi sladkorjev. Kvasovke ga glikozilirajo, a v Golgiju dodajo večinoma manozo (oligosaharidi z veliko manoze), ki jih človeški imunski sistem in jetra prepoznajo kot tuje. Celice CHO so sesalske: imajo podobne encime Golgija kot človek in naredijo kompleksne oligosaharide s galaktozo in sialno kislino.

## Rešeni primeri

### Primer 1 (lažji)

Receptor za LDL ima na N-koncu odcepljivo signalno zaporedje, nato velik del z vezavnim mestom za LDL in več mesti za N-glikozilacijo, en hidrofoben odsek z $22$ aminokislinami in kratek C-konec. Kako je receptor obrnjen v membrani ER in kako v plazmalemi? Kje so sladkorji?

**Podatki:** odcepljiv signal na N-koncu; eno zaporedje za zaustavitev prenosa ($22$ hidrofobnih aminokislin); mesta N-glikozilacije v N-končnem delu
**Iščemo:** usmerjenost N- in C-konca v ER in na plazmalemi, lego sladkorjev

:::formula
Pravilo topologije: lumen ER $\leftrightarrow$ zunanjost celice; odcepljen signal + zaporedje za zaustavitev prenosa → N-konec v lumnu, C-konec v citosolu.
:::

**Rešitev:**

1. Signal usmeri ribosom na ER; N-konec gre skozi translokon v lumen, signalna peptidaza signal odreže.
2. Ko v kanal pride hidrofobni odsek, se ustavi in se premakne v membrano. Preostanek (C-konec) nastaja na citosolni strani.
3. N-glikozilacija poteka v lumnu, zato so sladkorji na N-končnem delu, ki je v lumnu.
4. Po transportu se lumen mešička odpre navzven: N-konec z vezavnim mestom in sladkorji je zunaj celice, C-konec v citosolu.
5. Odgovor: receptor ima N-konec in sladkorje v lumnu ER oziroma zunaj celice, C-konec pa v citosolu, kjer ga prepozna adaptor klatrina pri endocitozi.

### Primer 2

Oceni, koliko transportnih mešičkov s premerom $50\,\mathrm{nm}$ prinese toliko membrane, kot je ima na površini kroglasta celica s premerom $20\,\mu\mathrm{m}$. Makrofag z endocitozo v manj kot eni uri sprejme toliko membrane, kot je ima na površini; za oceno vzemimo eno uro. Koliko mešičkov na sekundo je to in kaj sledi iz tega?

**Podatki:** $d_c = 20\,\mu\mathrm{m}$, $d_v = 50\,\mathrm{nm} = 0{,}050\,\mu\mathrm{m}$, $t = 1\,\mathrm{h} = 3600\,\mathrm{s}$
**Iščemo:** število mešičkov $n$, mešičke na sekundo

:::formula
$A = 4\pi r^2$, $n = \dfrac{A_c}{A_v}$
:::

**Rešitev:**

1. Površina celice: $A_c = 4\pi \cdot 10^2\,\mu\mathrm{m^2} \approx 1257\,\mu\mathrm{m^2}$.
2. Površina mešička: $A_v = 4\pi \cdot 0{,}025^2\,\mu\mathrm{m^2} \approx 0{,}00785\,\mu\mathrm{m^2}$.
3. Število: $n = 1257/0{,}00785 \approx 160\,000$ mešičkov.
4. Na sekundo: $160\,000/3600 \approx 44$ mešičkov.
5. Celica se pri tem ne skrči, zato mora skoraj vso membrano vrniti na površino: receptorji in lipidi se iz endosomov reciklirajo.
6. Odgovor: potrebnih je okoli $160\,000$ mešičkov, to je okoli $44$ na sekundo. Promet membrane je zelo hiter in skoraj ves krožen.

### Primer 3 (težji)

V celicah CHO izražamo tri različice izločenega glikoproteina (veriga brez sladkorjev ima $50\,\mathrm{kDa}$, dve mesti za N-glikozilacijo, vsak oligosaharid okoli $2\,\mathrm{kDa}$): A) divji tip; B) brez signalnega zaporedja; C) z dodanim zaporedjem KDEL na C-koncu. Celice za $5\,\mathrm{min}$ označimo z radioaktivnim metioninom in jih nato $2\,\mathrm{h}$ gojimo brez oznake. Rezultati elektroforeze po $2\,\mathrm{h}$:

- A: v gojišču $56\,\mathrm{kDa}$, po Endo H še vedno $56\,\mathrm{kDa}$;
- B: v celicah $50\,\mathrm{kDa}$, Endo H ne spremeni ničesar, v gojišču nič;
- C: v celicah $54\,\mathrm{kDa}$, po Endo H okoli $50\,\mathrm{kDa}$, v gojišču skoraj nič.

Kje je vsaka različica in zakaj?

**Podatki:** veriga $50\,\mathrm{kDa}$; $2$ mesti N-glikozilacije po okoli $2\,\mathrm{kDa}$; oznaka $5\,\mathrm{min}$, čakanje $2\,\mathrm{h}$; rezultati A, B, C zgoraj
**Iščemo:** predelek in razlago za A, B, C

:::formula
Endo H odcepi oligosaharide z veliko manoze (ER, cis Golgi), ne pa kompleksnih (od srednjih cistern Golgija naprej). Signal KDEL → vračanje iz cis Golgija v ER.
:::

**Rešitev:**

1. Masa z dvema oligosaharidoma: $50 + 2 \cdot 2 = 54\,\mathrm{kDa}$. Različica C ima to maso, A pa več.
2. A: v gojišču je, torej je šla po vsej poti. Masa $56\,\mathrm{kDa}$ pomeni, da so v Golgiju oligosaharidom dodali sladkorje (kompleksni oligosaharidi so večji). Odpornost na Endo H potrdi prehod skozi srednje cisterne.
3. B: brez signala ni vstopa v ER; protein nastane na prostem ribosomu in ostane v citosolu. Masa $50\,\mathrm{kDa}$ in neobčutljivost na Endo H pomenita, da sladkorjev ni.
4. C: vstopila je v ER in dobila oba oligosaharida ($54\,\mathrm{kDa}$). Ker jih Endo H odcepi, so še vedno tipa z veliko manoze: protein ni prišel do srednjih cistern.
5. Razlaga za C: s COPII je šla v cis Golgi, tam jo je ujel receptor KDEL in s COPI vrnil v ER. Ostaja v ER kot BiP in drugi rezidentni proteini.
6. Odgovor: A je izločena in ima kompleksne sladkorje; B je v citosolu brez sladkorjev; C je zadržana v ER (vračanje KDEL) s sladkorji tipa ER.

### Primer 4 – zdaj ti

Del zaporedja domene receptorja, ki leži v lumnu ER, je (od N- proti C-koncu): G–N–A–S–L–N–P–T–Q–N–V–T–A–N–G–E. Katera mesta asparagina (N) lahko dobijo N-vezan oligosaharid in koliko se masa poveča, če so zasedena vsa možna mesta (okoli $2\,\mathrm{kDa}$ na oligosaharid)?

**Podatki:** zaporedje G–N–A–S–L–N–P–T–Q–N–V–T–A–N–G–E (mesta $1$ do $16$); domena je v lumnu ER; okoli $2\,\mathrm{kDa}$ na oligosaharid
**Iščemo:** mesta, ki ustrezajo pravilu; povečanje mase

:::formula
Sekvon za N-glikozilacijo: Asn–X–Ser/Thr, X ni prolin; protein mora biti v lumnu ER.
:::

**Rešitev:**

1. Asparagin je na mestih $2$, $6$, $10$ in $14$.
2. Mesto $2$: N–A–S, X je alanin, tretji je serin: ustreza.
3. Mesto $6$: N–P–T, X je prolin: ne ustreza.
4. Preostali mesti oceni sam.

:::premisli
Kaj velja za mesti $10$ in $14$ in kolikšno je povečanje mase?
---
Mesto $10$: N–V–T ustreza. Mesto $14$: N–G–E, na tretjem mestu je glutamat, ne serin ali treonin: ne ustreza. Možni sta dve mesti ($2$ in $10$), masa se poveča za okoli $2 \cdot 2 = 4\,\mathrm{kDa}$. Ali sta res zasedeni, je odvisno še od tega, ali je mesto med zvijanjem dostopno.
:::

## Pogoste napake

- **Lizosomski in membranski proteini se delajo v citosolu.** Ne: vsi proteini endomembranskega sistema in plazmaleme ter izločeni proteini začnejo na ribosomih, ki jih SRP pripne na ER. »Prosti« in »vezani« ribosomi so isti ribosomi; odloči signal na proteinu.
- **Sladkorji so na citosolni strani.** Glikozilacija poteka v lumnu ER in Golgija, zato so sladkorji glikoproteinov in glikolipidov na zunanji strani celice. Citosolni del membranskega proteina sladkorjev nima.
- **Mitohondriji so del endomembranskega sistema.** Imajo membrane, a proteine sprejemajo posttranslacijsko iz citosola in z ostalimi predelki ne izmenjujejo mešičkov.
- **Proteini ER v ER preprosto ostanejo.** Mnogi uidejo v cis Golgi in se vrnejo s COPI po zaslugi signala KDEL. Brez signala bi jih tok odnesel iz celice.
- **COPI in COPII sta zamenljiva.** COPII vodi iz ER naprej, COPI nazaj in med cisternami; klatrin pa iz TGN in plazmaleme.

## Povzetek

- Endomembranski sistem: jedrna ovojnica, ER, Golgijev aparat, endosomi, lizosomi, mešički in plazmalema; povezuje jih promet mešičkov. Lumen je topološko zunanjost celice.
- Signalna hipoteza: signal na N-koncu → SRP → receptor SRP → translokon; kotranslacijski vnos, signalna peptidaza. Zaporedja za zaustavitev prenosa določijo lego membranskih proteinov.
- Zrnati ER: zvijanje (šaperoni, disulfidne vezi), N-glikozilacija na Asn–X–Ser/Thr, nadzor kakovosti, ERAD. Gladki ER: lipidi, steroidi, razstrupljanje, $\mathrm{Ca^{2+}}$.
- Golgi (cis → trans → TGN): kompleksni oligosaharidi, O-glikozilacija, M6P za lizosomske encime; sortiranje v TGN v lizosome, konstitutivno ali regulirano sekrecijo.
- Mešički: COPII (ER → Golgi), COPI (nazaj, KDEL), klatrin (TGN, endocitoza); Rab izbere tarčo, SNARE izvedejo zlitje.
- Endo H: občutljivost pomeni ER ali cis Golgi, odpornost pomeni prehod srednjih cistern.

## Za izpit

Znati moraš povedati:

- definicijo endomembranskega sistema, kateri predelki spadajo vanj in zakaj mitohondriji ne;
- signalno hipotezo po korakih z vlogo SRP, receptorja SRP, translokona in signalne peptidaze;
- kako signal in zaporedja za zaustavitev prenosa določijo topologijo membranskega proteina in zakaj so sladkorji zunaj celice;
- naloge zrnatega in gladkega ER ter Golgijevega aparata, pot lizosomskih encimov z M6P;
- vrste plaščev in smeri prevoza, vlogo Rab in SNARE ter vračanje s signalom KDEL.

### Naloga 1

Pri poskusu z označevanjem in sledenjem izmerimo delež označenega glikoproteina, ki je še v ER: $100\,\%$ ob $0\,\mathrm{min}$; $71\,\%$ po $10\,\mathrm{min}$; $50\,\%$ po $20\,\mathrm{min}$; $36\,\%$ po $30\,\mathrm{min}$; $25\,\%$ po $40\,\mathrm{min}$. Po $30\,\mathrm{min}$ je $55\,\%$ proteina odpornega na Endo H. a) Pokaži, da izhod iz ER poteka po kinetiki prvega reda, in določi konstanto in razpolovni čas. b) Koliko proteina bo v ER po $60\,\mathrm{min}$ in kdaj ga bo ostalo le še $5\,\%$? c) Primerjaj delež, ki je zapustil ER, z deležem, odpornim na Endo H, po $30\,\mathrm{min}$, in razloži razliko.

**Rešitev:**

1. a) Pri kinetiki prvega reda je razmerje zaporednih vrednosti v enakih presledkih stalno. Razmerja so $0{,}71$; $0{,}70$; $0{,}72$; $0{,}69$: skoraj stalna.
2. Konstanta iz prve in zadnje točke: $k = \ln(100/25)/40\,\mathrm{min} \approx 0{,}0347\,\mathrm{min^{-1}}$.
3. Razpolovni čas: $t_{1/2} = \ln 2/k \approx 20\,\mathrm{min}$, kar se ujema s $50\,\%$ po $20\,\mathrm{min}$.
4. b) Po $60\,\mathrm{min}$: $100\,\% \cdot \mathrm{e}^{-0{,}0347 \cdot 60} \approx 12{,}5\,\%$ (tri razpolovne dobe).
5. Do $5\,\%$: $t = \ln 20/k \approx 86\,\mathrm{min}$.
6. c) Po $30\,\mathrm{min}$ je ER zapustilo $100 - 36 = 64\,\%$, odpornih pa je le $55\,\%$.
7. Razlika $9\,\%$ je protein, ki je zapustil ER, a še ni prišel do srednjih cistern Golgija: je v mešičkih, vmesnem predelku med ER in Golgijem ali v cis cisterni. Odpornost na Endo H nastopi šele z encimom manozidazo II v srednjih cisternah.
8. Odgovor: izhod je prvega reda s $k \approx 0{,}035\,\mathrm{min^{-1}}$ in $t_{1/2} \approx 20\,\mathrm{min}$; po $60\,\mathrm{min}$ ostane okoli $12{,}5\,\%$ proteina, do $5\,\%$ pade po okoli $86\,\mathrm{min}$; $9\,\%$ proteina je po $30\,\mathrm{min}$ na poti med ER in srednjimi cisternami.

### Naloga 2

Natančno opiši signalno hipotezo in utemelji, zakaj je glikoprotein plazmaleme z enim transmembranskim odsekom in odcepljenim signalom obrnjen z N-koncem in sladkorji navzven. Napovej, kako bi bil obrnjen protein brez odcepljivega signala, katerega edini hidrofobni odsek deluje kot notranji signal in se v kanal vstavi z N-koncem proti citosolu.

**Rešitev:**

1. Signalno zaporedje na N-koncu izstopi iz ribosoma; SRP ga veže in upočasni prevajanje, da protein ne nastane v citosolu.
2. Kompleks SRP–ribosom se veže na receptor SRP na ER; ob hidrolizi GTP se SRP sprosti, ribosom pa sede na translokon Sec61.
3. Veriga raste skozi kanal v lumen; signalna peptidaza odcepi signal. Proteini za izločanje gredo v celoti v lumen.
4. Pri membranskem proteinu z zaporedjem za zaustavitev prenosa se kanal bočno odpre in hidrofobni odsek preide v dvosloj; N-konec je že v lumnu, preostanek nastaja v citosolu.
5. N-glikozilacija poteka v lumnu, zato so sladkorji na delu v lumnu.
6. Mešički ohranijo usmerjenost membrane: lumenska stran ostane obrnjena v lumen vsakega naslednjega predelka. Ob zlitju s plazmalemo se lumen odpre v zunanjost, zato so N-konec in sladkorji zunaj.
7. Protein z notranjim signalom, vstavljenim z N-koncem proti citosolu: signala ne odcepi nihče, odsek ostane v membrani kot sidro, C-končni del gre v lumen. Na plazmalemi je zato C-konec (in morebitni sladkorji) zunaj, N-konec v citosolu – obratno kot zgoraj.
8. Odgovor: topologijo določita smer vstavitve prvega hidrofobnega odseka in topološka enakovrednost lumna in zunanjosti; sladkorji so vedno na strani, ki je bila v lumnu.

## Drugače: Na sliki

Predstavljaj si celico kot **tovarno s pošto**:

- zrnati ER je proizvodna hala, kjer izdelek nastane in se preveri; slabi izdelki gredo v reciklažo (ERAD);
- Golgijev aparat je pakirnica: izdelek dobi končno embalažo (sladkorje) in nalepko z naslovom (M6P za lizosom);
- TGN je razdelilni center, mešički so dostavna vozila, plašči so vrste vozil za različne smeri (COPII naprej, COPI nazaj, klatrin iz razdelilnega centra in s površine);
- Rab je naslov na vozilu, SNARE je ključavnica, ki se odpre le s pravim ključem.

Paket z nalepko KDEL (protein ER) v pakirnici vrnejo v halo.

## Drugače: Uporaba v stroki

- **Biofarmacevtska proizvodnja.** Monoklonska protitelesa, eritropoetin in faktorje strjevanja krvi delajo v celicah CHO v bioreaktorjih s tisoči litrov. Sialna kislina na koncu oligosaharidov podaljša čas, ko zdravilo ostane v krvi, zato proizvajalci vzorec sladkorjev redno merijo kot znak kakovosti.
- **Glikoinženirstvo.** S spremembo encimov Golgija dobijo protitelesa brez fukoze, ki močneje aktivirajo imunske celice.
- **Laboratorijska orodja.** Brefeldin A ustavi transport iz ER v Golgi (prepreči nastanek plašča COPI), tunikamicin zavre N-glikozilacijo. Z njima in z Endo H raziskovalci ugotavljajo, kje na poti se protein ustavi.
- **Encimsko nadomestno zdravljenje.** Bolnikom z lizosomskimi boleznimi (na primer Gaucherjeva bolezen) dajejo encim, ki ga celice sprejmejo prek receptorjev za manozo ali M6P na površini in z endocitozo dostavijo v lizosome.

## Drugače: Bolj natančno

**Zorenje cistern.** Kako potujejo proteini skozi Golgi? Po modelu zorenja cistern se cis cisterna sama pomika proti trans strani in pri tem zori, encimi Golgija pa se s COPI mešički vračajo v mlajše cisterne. Tako lahko skozi Golgi potujejo tudi strukture, prevelike za mešičke (prokolagen).

**Energetika zlitja.** Zvijanje štirih vijačnic SNARE v snop sprosti dovolj energije, da premaga odbijanje dveh hidratiranih membran. Toksin botulinusa in toksin tetanusa sta proteazi, ki cepita SNARE v živčnih končičih in tako preprečita izločanje živčnih prenašalcev.

## Preveri se

? Katera vrstica v tabeli pravilno opiše plašč COPI?

| | smer | posebnost |
|---|---|---|
| a | ER → Golgi | Sar1 |
| b | Golgi → ER | vrača KDEL |
| c | plazmalema → endosom | dinamin |

- vrstica a
~ To je COPII; plašč z GTPazo Sar1 nosi tovor iz ER naprej.
+ vrstica b
- vrstica c
~ To je klatrin, ki ga pri endocitozi odcepi dinamin.
> COPI prevaža nazaj iz Golgija v ER in med cisternami; z njim se vračajo proteini s signalom KDEL.

? Lizosomski encim ima maso $60\,\mathrm{kDa}$ brez sladkorjev in tri mesta za N-glikozilacijo. Kolikšno maso približno pričakuješ na gelu, če so vsa mesta zasedena (okoli $2\,\mathrm{kDa}$ na oligosaharid)?
- $60\,\mathrm{kDa}$
~ To je masa verige brez sladkorjev; encim gre skozi ER in dobi oligosaharide.
+ okoli $66\,\mathrm{kDa}$
- okoli $120\,\mathrm{kDa}$
~ Oligosaharid je majhen v primerjavi z verigo; masa se ne podvoji.
> $60 + 3 \cdot 2 = 66\,\mathrm{kDa}$.

? Zakaj je disulfidnih vezi v izločenih proteinih veliko, v citosolnih pa skoraj nič?
+ Lumen ER je oksidacijsko okolje s protein disulfid-izomerazo, citosol pa redukcijsko.
- Citosolni proteini nimajo cisteina.
~ Imajo ga; v redukcijskem okolju citosola pa ostane v reducirani obliki (–SH).
- Disulfidne vezi nastanejo šele zunaj celice.
~ Nastanejo že v ER med zvijanjem; zato je zvijanje izločenih proteinov odvisno od ER.
> Lumen ER ima drugačno okolje kot citosol, zato tam nastanejo disulfidne vezi, ki stabilizirajo zunajcelične proteine.

? Protein je v celici na Endo H odporen in ima sladkorje zunaj celice. Kateri trditvi o njegovi preteklosti zagotovo **ni** treba držati?
- Imel je signal za vstop v ER.
~ Brez vstopa v ER ne bi dobil N-vezanih oligosaharidov; to mora držati.
- Prešel je srednje cisterne Golgija.
~ Odpornost na Endo H pomeni ravno to; mora držati.
+ Imel je signal KDEL.
> KDEL protein zadrži v ER; protein, ki je prešel Golgi in je na površini, ga ni imel. Ostali dve trditvi sta nujni.

? Zdravilo zavre GTPazo Sar1 (prepreči nastanek plašča COPII). Kaj se zgodi z izločanjem albumina v jetrnih celicah?
- Albumin se izloči hitreje, ker se ne zadržuje v Golgiju.
~ Albumin mora najprej priti v Golgi; brez COPII ne zapusti ER.
+ Albumin se kopiči v ER in izločanje se ustavi.
- Albumin ostane v citosolu.
~ Vstop v ER s SRP ni odvisen od Sar1; albumin je že v lumnu ER.
> Sar1 je potreben za mešičke iz ER; brez njih se izločeni proteini nabirajo v ER.

:::simboli
A | površina | A = 4\pi r^2 | µm^2
A_c | površina celice | | µm^2
A_v | površina mešička | | µm^2
r | polmer | | µm
d_c | premer celice | | µm
d_v | premer mešička | | nm
n | število mešičkov | n = \frac{A_c}{A_v} | –
t | čas | | s
k | konstanta izhoda iz ER | | 1/min | kinetika prvega reda
t_{1/2} | razpolovni čas | t_{1/2} = \frac{\ln 2}{k} | min
:::
