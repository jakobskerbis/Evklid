---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Cisplatin, eno najpomembnejših zdravil proti raku, ima formulo $[\mathrm{PtCl_2(NH_3)_2}]$. Spojina z *isto* formulo, transplatin, raka skoraj ne zdravi. Izpitno vprašanje, ki ga zdaj še ne znaš rešiti: koliko izomerov ima ta formula, če je kompleks tetraedrski, in koliko, če je kvadratno planaren? Kako iz meritve magnetnih lastnosti ugotoviš, katera oblika je prava, in zakaj zdravilo deluje šele v celici?

Odgovor zahteva štiri gradnike: kaj je ligand, kako kompleks poimenujemo, kako preštejemo izomere in kako teorija kristalnega polja poveže obliko z elektroni $d$. Iz lekcije o prehodnih elementih že poznaš oktaedrski razcep $\Delta_\mathrm{o}$, LFSE ter visoko- in nizkospinske komplekse; tu teh izpeljav ne ponavljamo, ampak jih razširimo na druge oblike. Celoten odgovor je v razdelku Za izpit, naloga 1.

## Razlaga

**1. Ligand in koordinacijsko število.**

**Definicija.** **Koordinacijska spojina** vsebuje **kompleks**: osrednji kovinski atom ali ion, na katerega so s koordinativnimi vezmi vezani **ligandi**. Ligand je Lewisova baza, ki podari prost elektronski par; kovina je Lewisova kislina. **Donorski atom** je atom liganda, ki je neposredno vezan na kovino. **Koordinacijsko število** (KŠ) je število donorskih atomov okoli kovine, ne število ligandov.

Ligand je **enovezni**, če ima en donorski atom ($\mathrm{H_2O}$, $\mathrm{NH_3}$, $\mathrm{Cl^-}$, $\mathrm{CN^-}$), **dvovezni** z dvema (etilendiamin $\mathrm{H_2NCH_2CH_2NH_2}$, »en«; oksalat $\mathrm{C_2O_4^{2-}}$, »ox«) in **večvezni** z več (EDTA$^{4-}$ s šestimi). Večvezni ligand, ki s kovino zapre obroč, je **kelatni** ligand, kompleks pa **kelat**. **Ambidentatni** ligand se lahko veže z enim od dveh različnih atomov: $\mathrm{NO_2^-}$ prek N ali prek O, $\mathrm{SCN^-}$ prek S ali prek N.

Kompleks v oglatem oklepaju je **notranja sfera**; ioni zunaj nje (**zunanja sfera**) uravnajo naboj in v vodi prosto disociirajo.

*Preizkus:* KŠ v $[\mathrm{Co(en)_3}]^{3+}$? (Šest: trije ligandi po dva donorska atoma N.)

**2. Oksidacijsko število in oblika.** Oksidacijsko število kovine je naboj kompleksa minus vsota nabojev ligandov. Pogoste oblike: KŠ $2$ linearna ($[\mathrm{Ag(NH_3)_2}]^+$), KŠ $4$ tetraedrska ali kvadratno planarna, KŠ $6$ oktaedrska.

*Preizkus:* oksidacijsko število Fe v $[\mathrm{Fe(CN)_6}]^{4-}$? ($-4 - 6 \cdot (-1) = +2$.)

**3. Nomenklatura (IUPAC).**

1. V soli najprej imenujemo kation, nato anion (kot pri $\mathrm{NaCl}$: natrijev klorid).
2. V kompleksu najprej ligande **po abecedi**, nato kovino. Množilne predpone (di-, tri-, tetra-, penta-, heksa-; pri zapletenih ligandih bis-, tris-) pri abecedi ne štejejo.
3. Anionski ligandi dobijo končnico -o: klorido ($\mathrm{Cl^-}$), cianido ($\mathrm{CN^-}$), hidroksido, okso, oksalato; v starejših knjigah kloro, ciano. Nevtralni: akva ($\mathrm{H_2O}$), amin ($\mathrm{NH_3}$), karbonil ($\mathrm{CO}$), etilendiamin.
4. Oksidacijsko število kovine z rimsko številko v oklepaju. V kationu je kovina pridevnik (kobaltov, bakrov), v nevtralnem kompleksu samostalnik (platina), v anionu dobi končnico -at: ferat (Fe), kuprat (Cu), kobaltat, platinat, kromat, nikljat.

Zgledi: $[\mathrm{Cu(NH_3)_4}]\mathrm{SO_4}$ je tetraaminbakrov(II) sulfat; $\mathrm{K_4[Fe(CN)_6]}$ je kalijev heksacianidoferat(II); $[\mathrm{PtCl_2(NH_3)_2}]$ je diamindikloridoplatina(II).

*Preizkus:* ime za $\mathrm{K_3[Fe(CN)_6]}$? (Kalijev heksacianidoferat(III).)

**4. Izomerija.** Izomeri imajo enako sestavo, a so različne spojine.

*Strukturni izomeri* se razlikujejo po vezeh:

- **ionizacijski**: ion zamenja mesto med notranjo in zunanjo sfero, $[\mathrm{Co(NH_3)_5Br}]\mathrm{SO_4}$ in $[\mathrm{Co(NH_3)_5(SO_4)}]\mathrm{Br}$;
- **hidratni**: voda v notranji ali zunanji sferi, $[\mathrm{Cr(H_2O)_6}]\mathrm{Cl_3}$ (vijoličen) in $[\mathrm{Cr(H_2O)_5Cl}]\mathrm{Cl_2 \cdot H_2O}$ (zelen);
- **vezni**: ambidentatni ligand je vezan prek različnega atoma, $-\mathrm{NO_2}$ (nitrito-κN) in $-\mathrm{ONO}$ (nitrito-κO).

*Stereoizomeri* imajo iste vezi, a drugačno prostorsko razporeditev:

- **geometrijski**: *cis* (enaka liganda sosednja, pod $90^\circ$) in *trans* (nasprotna, $180^\circ$); pri $\mathrm{MA_3B_3}$ *fac* (trije enaki na eni ploskvi oktaedra) in *mer* (na »poldnevniku«);
- **optični**: zrcalni sliki, ki se ne prekrivata (enantiomera). Kompleks je kiralen, če nima zrcalne ravnine in nima središča simetrije (strogo: nobene zrcalne rotacijske osi); tipična primera sta $[\mathrm{M(AA)_3}]$ in *cis*-$[\mathrm{M(AA)_2B_2}]$.

```
  cis               trans
 Cl   NH3         Cl   NH3
   \ /              \ /
   Pt               Pt
   / \              / \
 Cl   NH3      H3N     Cl
```

V tetraedru so vsi štirje položaji med seboj sosednji (vsi koti $109{,}5^\circ$), zato $\mathrm{MA_2B_2}$ nima *cis* in *trans*.

:::premisli
Koliko stereoizomerov ima oktaedrski $[\mathrm{CoCl_2(en)_2}]^+$? Napovej, nato premisli o zrcalni sliki vsakega.
---
Tri. *Trans* izomer ima zrcalno ravnino (vsebuje oba obroča en), zato je akiralen. *Cis* izomer zrcalne ravnine nima: obroča sta zasukana kot lopatici propelerja, levo- in desnosučni. Dobimo *trans* in par enantiomerov *cis*.
:::

**5. Kristalno polje v drugih oblikah.** V oktaedru ($\Delta_\mathrm{o}$) se orbitali $e_g$, ki kažeta proti ligandom, dvigneta. V **tetraedru** ligandi ležijo med osmi, zato je razporeditev obrnjena: spodaj sta orbitali $e$, zgoraj trije $t_2$, in razcep je manjši,
$$\Delta_\mathrm{t} \approx \frac{4}{9}\Delta_\mathrm{o}.$$
Razlogi: le štirje ligandi namesto šestih in nobena orbitala ne kaže naravnost proti njim. Ker je $\Delta_\mathrm{t}$ skoraj vedno manjši od energije parjenja, so tetraedrski kompleksi **visokospinski**. Težišče se spet ohrani: $e$ je pri $-0{,}6\,\Delta_\mathrm{t}$, $t_2$ pri $+0{,}4\,\Delta_\mathrm{t}$.

```
 oktaeder        tetraeder
 -- --   e_g     -- -- --  t2
 -- -- -- t2g    -- --     e
```

**Kvadratno planarno** polje si predstavljamo kot oktaeder, iz katerega odmaknemo liganda na osi $z$. Orbitale z delom $z$ se znižajo, $d_{x^2-y^2}$ (kaže proti štirim ligandom v ravnini) pa ostane daleč najvišje. Pri $d^8$ in močnem polju je ta orbitala prazna, vseh osem elektronov je sparjenih in kompleks je **diamagneten**. To so kompleksi $\mathrm{Pt^{2+}}$, $\mathrm{Pd^{2+}}$, $\mathrm{Au^{3+}}$ in $\mathrm{Ni^{2+}}$ z močnimi ligandi.

**Kaj določa velikost razcepa.**

- **Ligand** (spektrokemijska vrsta, od šibkih do močnih): $\mathrm{I^-} < \mathrm{Br^-} < \mathrm{Cl^-} < \mathrm{F^-} < \mathrm{OH^-} < \mathrm{H_2O} < \mathrm{NH_3} < \mathrm{en} < \mathrm{NO_2^-} < \mathrm{CN^-} < \mathrm{CO}$.
- **Oksidacijsko število**: višji naboj kovine pritegne ligande bliže, $\Delta$ naraste za okoli polovico od $\mathrm{M^{2+}}$ do $\mathrm{M^{3+}}$.
- **Perioda**: pri $4d$ in $5d$ kovinah je $\Delta$ za $30$ do $50\,\%$ večji kot pri $3d$, zato so njihovi kompleksi skoraj vedno nizkospinski.

**Jahn–Tellerjev pojav.** Če je degenerirana skupina $e_g$ neenakomerno zasedena (npr. $d^9$, $\mathrm{Cu^{2+}}$), se oktaeder raztegne vzdolž ene osi, ker to zniža energijo. Zato ima $[\mathrm{Cu(H_2O)_6}]^{2+}$ dve daljši vezi Cu–O.

*Preizkus:* $\Delta_\mathrm{o} = 90\,\mathrm{kJ/mol}$. Približno kolikšen je $\Delta_\mathrm{t}$ za isto kovino in ligand? (Okoli $40\,\mathrm{kJ/mol}$.)

**6. Kelatni učinek.** Kelati so mnogo obstojnejši od kompleksov z enakimi donorskimi atomi v enoveznih ligandih: za $[\mathrm{Ni(NH_3)_6}]^{2+}$ je $\log\beta_6 \approx 8{,}6$, za $[\mathrm{Ni(en)_3}]^{2+}$ pa $\log\beta_3 \approx 18{,}3$. Vezi Ni–N so v obeh skoraj enake, $\Delta H$ se malo razlikuje. Razlika je v **entropiji**: pri izmenjavi
$$[\mathrm{Ni(NH_3)_6}]^{2+} + 3\,\mathrm{en} \rightleftharpoons [\mathrm{Ni(en)_3}]^{2+} + 6\,\mathrm{NH_3}$$
se število prostih delcev v raztopini poveča s $4$ na $7$. Pomaga tudi to, da se drugi donorski atom že vezanega liganda nahaja tik ob kovini.

:::premisli
Zakaj se v celični membrani ali krvi, kjer je kovinskih ionov malo, kelati obnesejo še bolje od enoveznih ligandov? Razmisli, kaj se zgodi, ko se ena vez Ni–N za hip pretrga.
---
Pri enoveznem ligandu prekinjena vez pomeni, da ligand odplava in ga v razredčeni raztopini težko nadomesti nov. Pri kelatu ostane drugi konec liganda vezan in prosti konec je tik ob kovini, zato se vez hitro spet sklene. Ta učinek je pri nizkih koncentracijah najpomembnejši, zato so zdravila za vezavo kovin skoraj vedno kelati.
:::

## Rešeni primeri

### Primer 1: Wernerjev poskus

Raztopina vsebuje $0{,}010\,\mathrm{mol}$ spojine $[\mathrm{Co(NH_3)_5Cl}]\mathrm{Cl_2}$. Dodamo prebitek $\mathrm{AgNO_3}$. Določi oksidacijsko število in KŠ kobalta, poimenuj spojino in izračunaj, koliko $\mathrm{AgCl}$ se obori.

**Podatki:** $n = 0{,}010\,\mathrm{mol}$ $[\mathrm{Co(NH_3)_5Cl}]\mathrm{Cl_2}$; prebitek $\mathrm{Ag^+}$; $M(\mathrm{AgCl}) = 143{,}3\,\mathrm{g/mol}$
**Iščemo:** oksidacijsko število, KŠ, ime, $m(\mathrm{AgCl})$

:::formula
naboj kompleksa = oksidacijsko število + vsota nabojev ligandov; z $\mathrm{Ag^+}$ se oborijo le kloridi zunanje sfere
:::

**Rešitev:**

1. Kompleksni kation ima naboj $+2$ (dva klorida zunaj). Ligandi: $5 \cdot 0 + 1 \cdot (-1) = -1$, zato je oksidacijsko število $+2 + 1 = +3$.
2. KŠ: pet $\mathrm{NH_3}$ in en $\mathrm{Cl^-}$, skupaj $6$ (oktaeder).
3. Ime: ligandi po abecedi, amin pred klorido: pentaaminkloridokobaltov(III) klorid.
4. V vodi: $[\mathrm{Co(NH_3)_5Cl}]^{2+} + 2\,\mathrm{Cl^-}$; vezani klorid ostane v kompleksu.
5. $n(\mathrm{AgCl}) = 2 \cdot 0{,}010\,\mathrm{mol} = 0{,}020\,\mathrm{mol}$, $m = 0{,}020 \cdot 143{,}3\,\mathrm{g} \approx 2{,}87\,\mathrm{g}$.
6. Odgovor: kobalt(III), KŠ $6$, pentaaminkloridokobaltov(III) klorid; obori se $2{,}87\,\mathrm{g}$ $\mathrm{AgCl}$, ne $4{,}30\,\mathrm{g}$, kot bi bilo pri treh prostih kloridih.

### Primer 2: izomeri kobaltovega kompleksa

Za oktaedrski kompleks $[\mathrm{Co(NH_3)_3Cl_3}]$ določi število in vrsto stereoizomerov. Kaj se spremeni, če tri $\mathrm{NH_3}$ zamenjamo z enim tridonornim ligandom, ki lahko zasede le tri sosednja mesta na eni ploskvi?

**Podatki:** oktaeder, $\mathrm{MA_3B_3}$ ($\mathrm{A} = \mathrm{NH_3}$, $\mathrm{B} = \mathrm{Cl^-}$); v drugem delu tridonorni ligand le na eni ploskvi
**Iščemo:** število stereoizomerov v obeh primerih

:::formula
$\mathrm{MA_3B_3}$: *fac* (trije A na eni ploskvi) in *mer* (trije A na poldnevniku)
:::

**Rešitev:**

1. Postavi tri A. Med tremi položaji oktaedra sta mogoči le dve razporeditvi: vsi trije paroma *cis* (ploskev) ali dva *trans* in tretji med njima (poldnevnik).
2. Pri *fac* so koti A–Co–A vsi $90^\circ$; pri *mer* je en kot $180^\circ$.
3. Oba izomera imata zrcalno ravnino, zato nista kiralna.
4. Ligand, ki lahko zasede le tri sosednja mesta na eni ploskvi, dovoli le *fac*.
5. Odgovor: $[\mathrm{Co(NH_3)_3Cl_3}]$ ima dva stereoizomera, *fac* in *mer*; s takim tridonornim ligandom ostane en sam (*fac*).

### Primer 3: oblika iz magnetnega momenta

Ion $[\mathrm{NiCl_4}]^{2-}$ je paramagneten z magnetnim momentom okoli $2{,}8\,\mu_\mathrm{B}$ (samo spin), ion $[\mathrm{Ni(CN)_4}]^{2-}$ pa je diamagneten. Oba imata KŠ $4$. Poimenuj oba iona, določi njuno obliko z razporeditvijo elektronov $d$ in izračunaj LFSE tetraedrskega iona v enotah $\Delta_\mathrm{t}$ in $\Delta_\mathrm{o}$. Koliko stereoizomerov bi imel ion $[\mathrm{NiCl_2(CN)_2}]^{2-}$ v vsaki obliki?

**Podatki:** $[\mathrm{NiCl_4}]^{2-}$: $\mu \approx 2{,}8\,\mu_\mathrm{B}$; $[\mathrm{Ni(CN)_4}]^{2-}$: $\mu = 0$; KŠ $4$; $\Delta_\mathrm{t} \approx \frac{4}{9}\Delta_\mathrm{o}$
**Iščemo:** imeni, oblika, razporeditev, LFSE, število izomerov

:::formula
$\mu = \sqrt{n(n+2)}\,\mu_\mathrm{B}$; tetraeder: $\mathrm{LFSE} = (-0{,}6\,n_e + 0{,}4\,n_t)\,\Delta_\mathrm{t}$
:::

**Rešitev:**

1. Oksidacijsko število: $-2 - 4 \cdot (-1) = +2$ v obeh; Ni je v 10. skupini, zato $10 - 2 = 8$ elektronov $d$.
2. Imeni (anion, končnica -at): tetrakloridonikljat(II) in tetracianidonikljat(II).
3. Iz $\mu$: $\sqrt{n(n+2)} = 2{,}8$ da $n = 2$, saj je $\sqrt{8} \approx 2{,}83$. (Izmerjeni moment tetraedrskih kompleksov Ni(II) je zaradi orbitalnega prispevka višji, okoli $3{,}5$ do $4\,\mu_\mathrm{B}$; tudi to vrednost razložita le dva neparna elektrona, saj bi trije dali vsaj $3{,}87\,\mu_\mathrm{B}$ brez orbitalnega dela.)
4. Tetraeder pri $d^8$: $e^4\,t_2^4$, v $t_2$ sta dva neparna elektrona. Kvadrat pri $d^8$: prazna $d_{x^2-y^2}$, nič neparnih. Torej je $[\mathrm{NiCl_4}]^{2-}$ tetraedrski, $[\mathrm{Ni(CN)_4}]^{2-}$ kvadratno planaren.
5. To se ujema s spektrokemijsko vrsto: šibki in veliki ligandi $\mathrm{Cl^-}$ dajo tetraeder z majhnim razcepom, močni $\mathrm{CN^-}$ velik razcep, pri katerem se prazna $d_{x^2-y^2}$ izplača.
6. LFSE: $(-0{,}6 \cdot 4 + 0{,}4 \cdot 4)\,\Delta_\mathrm{t} = -0{,}8\,\Delta_\mathrm{t} \approx -0{,}8 \cdot \frac{4}{9}\Delta_\mathrm{o} \approx -0{,}36\,\Delta_\mathrm{o}$.
7. Izomeri $\mathrm{MA_2B_2}$: v tetraedru $1$, v kvadratu $2$ (*cis*, *trans*).
8. Odgovor: tetrakloridonikljat(II) je tetraedrski ($e^4\,t_2^4$, LFSE $-0{,}8\,\Delta_\mathrm{t} \approx -0{,}36\,\Delta_\mathrm{o}$), tetracianidonikljat(II) kvadratno planaren in diamagneten. $[\mathrm{NiCl_2(CN)_2}]^{2-}$ bi imel en izomer kot tetraeder in dva kot kvadrat.

### Primer 4: zdaj ti

Izračunaj konstanto izmenjave $[\mathrm{Ni(NH_3)_6}]^{2+} + 3\,\mathrm{en} \rightleftharpoons [\mathrm{Ni(en)_3}]^{2+} + 6\,\mathrm{NH_3}$ in njen $\Delta G^\circ$ pri $25\,^\circ\mathrm{C}$.

**Podatki:** $\log\beta_6(\mathrm{NH_3}) = 8{,}61$, $\log\beta_3(\mathrm{en}) = 18{,}28$, $T = 298{,}15\,\mathrm{K}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** $K$ in $\Delta G^\circ$

:::formula
$K = \frac{\beta_3(\mathrm{en})}{\beta_6(\mathrm{NH_3})}$, $\quad \Delta G^\circ = -RT\ln K$
:::

**Rešitev:**

1. Reakcija je razlika dveh tvorb, zato se konstanti delita: $\log K = 18{,}28 - 8{,}61 = 9{,}67$.
2. $K = 10^{9{,}67} \approx 4{,}7 \cdot 10^9$.
3. Izračunaj sam $\Delta G^\circ$ in presodi, kaj pomeni predznak.

:::premisli
Koliko je $\Delta G^\circ$?
---
$\ln K = 9{,}67 \cdot \ln 10 \approx 22{,}27$, zato $\Delta G^\circ = -8{,}314 \cdot 298{,}15 \cdot 22{,}27\,\mathrm{J/mol} \approx -55{,}2\,\mathrm{kJ/mol}$. Izmenjava je močno ugodna: v prebitku en se ves amoniak izpodrine, čeprav sta donorska atoma v obeh primerih dušik.
:::

## Pogoste napake

- **KŠ = število ligandov.** $[\mathrm{Co(en)_3}]^{3+}$ ima tri ligande, a KŠ $6$. Štej donorske atome.
- **Vsi kloridi se oborijo.** Klorid, vezan v notranji sferi, z $\mathrm{Ag^+}$ ne reagira hitro. Iz mase oborine sklepamo, koliko kloridov je zunaj, kar je bil Wernerjev dokaz zgradbe.
- **Cis in trans pri tetraedru.** V tetraedru so vsi položaji sosednji, zato $\mathrm{MA_2B_2}$ ni geometrijskih izomerov. Dva izomera kažeta na kvadratno planarno obliko.
- **Tetraedrski razcep kot oktaedrski.** V tetraedru sta spodaj *dve* orbitali ($e$), razcep je le okoli $\frac{4}{9}\Delta_\mathrm{o}$ in nizkospinskih tetraedrskih kompleksov skoraj ni.
- **Abeceda s predponami.** Pri $[\mathrm{CoCl_2(NH_3)_4}]^+$ odloča prva črka imena liganda, ne predpona: amin je pred klorido, zato tetraamindikloridokobaltov(III) ion, ne »dikloridotetraaminkobaltov(III)«.

## Povzetek

- Kompleks: kovina (Lewisova kislina) in ligandi (Lewisove baze); KŠ je število donorskih atomov. Kelatni ligandi so večvezni ligandi, ki s kovino zaprejo obroč.
- Ime: kation pred anionom; ligandi po abecedi brez predpon, anionski na -o; oksidacijsko število z rimsko številko; v anionu kovina na -at.
- Izomerija: ionizacijska, hidratna, vezna; geometrijska (*cis/trans*, *fac/mer*) in optična (kiralni $[\mathrm{M(AA)_3}]$, *cis*-$[\mathrm{M(AA)_2B_2}]$).
- Tetraeder: obrnjen razcep, $\Delta_\mathrm{t} \approx \frac{4}{9}\Delta_\mathrm{o}$, skoraj vedno visokospinski. Kvadrat: $d^8$ z močnim poljem, diamagneten.
- $\Delta$ raste z močjo liganda (spektrokemijska vrsta), z oksidacijskim številom in navzdol po skupini.
- Kelatni učinek je predvsem entropijski: več prostih delcev po izmenjavi.

## Za izpit

Znati moraš povedati:

- definicije liganda, donorskega atoma, KŠ, kelata in ambidentatnega liganda;
- pravila nomenklature in jih uporabiti v obe smeri (formula → ime, ime → formula);
- vrste izomerije z zgledi in kriterij kiralnosti (ni zrcalne ravnine ne središča simetrije);
- razcep v tetraedru in kvadratu, zakaj je $\Delta_\mathrm{t}$ manjši in zakaj so tetraedrski kompleksi visokospinski;
- dejavnike, od katerih je odvisen $\Delta$, in Jahn–Tellerjev pojav pri $d^9$;
- razlago kelatnega učinka in izračun konstante izmenjave iz $\beta$.

### Naloga 1

Odgovori na vprašanje iz uvoda za $[\mathrm{PtCl_2(NH_3)_2}]$. (a) Poimenuj spojino in določi število elektronov $d$. (b) Koliko izomerov bi imela kot tetraeder in koliko kot kvadrat? (c) Spojina je diamagnetna. Kaj to pove o obliki? (d) V celici se klorid zamenja z vodo: $[\mathrm{PtCl_2(NH_3)_2}] + \mathrm{H_2O} \rightleftharpoons [\mathrm{PtCl(H_2O)(NH_3)_2}]^+ + \mathrm{Cl^-}$. Vzemi $K = 3{,}0 \cdot 10^{-3}\,\mathrm{mol/L}$ in izračunaj delež zamenjane oblike v krvni plazmi ($c(\mathrm{Cl^-}) = 0{,}100\,\mathrm{mol/L}$) in v celici ($0{,}004\,\mathrm{mol/L}$). (e) Utemelji, zakaj je zdravilo le *cis* izomer.

**Rešitev:**

1. (a) Ligandi nevtralni in dva $\mathrm{Cl^-}$, kompleks nevtralen: Pt(II). Pt je v 10. skupini, $10 - 2 = 8$ elektronov $d$. Ime: diamindikloridoplatina(II).
2. (b) V tetraedru so vsi položaji sosednji: $1$ izomer. V kvadratu sta $2$ (*cis*, *trans*). Dejstvo, da obstajata cisplatin in transplatin, že izključi tetraeder.
3. (c) Tetraedrski $d^8$ bi bil $e^4\,t_2^4$ z dvema neparnima elektronoma, torej paramagneten. Kvadratni $d^8$ ima prazno $d_{x^2-y^2}$ in je diamagneten. Pt je $5d$ kovina z velikim razcepom, zato je kvadratna oblika ugodna.
4. (d) Delež zamenjane oblike: $x = \frac{c(\text{akva})}{c(\text{akva}) + c(\text{cisplatin})} = \frac{K}{K + c(\mathrm{Cl^-})}$, ker je $\frac{c(\text{akva})}{c(\text{cisplatin})} = \frac{K}{c(\mathrm{Cl^-})}$.
5. Plazma: $x = \frac{0{,}0030}{0{,}0030 + 0{,}100} \approx 0{,}029$, torej okoli $3\,\%$.
6. Celica: $x = \frac{0{,}0030}{0{,}0030 + 0{,}004} \approx 0{,}43$, torej okoli $43\,\%$.
7. Visok klorid v krvi zdravilo varuje pred zamenjavo; v celici nastane reaktivna akva oblika, iz katere se voda zlahka izpodrine z dušikom baze DNK.
8. (e) Akva oblika se veže na atom N7 gvanina. *Cis* izomer z dvema sosednjima prostima mestoma (pod $90^\circ$) poveže dva sosednja gvanina na isti verigi in DNK ukrivi; celica takšno poškodbo slabo popravi. *Trans* izomer ima prosti mesti pod $180^\circ$ in takega mostu ne more narediti.
9. Odgovor: diamindikloridoplatina(II), $d^8$, kvadratno planarna in diamagnetna; dva izomera (tetraeder bi imel enega); v plazmi je zamenjanih okoli $3\,\%$, v celici okoli $43\,\%$; zdravilo je *cis* izomer, ker le ta premosti sosednja gvanina.

### Naloga 2

Natančno navedi, kdaj je kompleks kiralen. Za $[\mathrm{Cr(ox)_3}]^{3-}$ in $[\mathrm{Co(NH_3)_4Cl_2}]^+$ ugotovi, ali sta kiralna, in poimenuj oba. Utemelji, zakaj je kelatni učinek predvsem entropijski, in izpelji konstanto izmenjave enoveznih ligandov s kelatom iz celokupnih konstant tvorbe.

**Rešitev:**

1. Kompleks je kiralen, če se njegova zrcalna slika z nobeno rotacijo ne prekrije z njim. To velja natanko tedaj, ko nima nobene zrcalne rotacijske osi; v praksi preverimo zrcalno ravnino in središče simetrije.
2. $[\mathrm{Cr(ox)_3}]^{3-}$, tris(oksalato)kromat(III): trije obroči okoli kovine tvorijo levi in desni »propeler« (Λ in Δ), brez zrcalne ravnine. Kiralen, dva enantiomera.
3. $[\mathrm{Co(NH_3)_4Cl_2}]^+$, tetraamindikloridokobaltov(III) ion: ima *cis* in *trans* izomer, oba imata zrcalno ravnino (pri *cis* skozi oba Cl in Co). Ni kiralen, ima pa dva geometrijska izomera.
4. Kelatni učinek: pri izmenjavi $[\mathrm{ML_6}] + 3\,\mathrm{AA} \rightleftharpoons [\mathrm{M(AA)_3}] + 6\,\mathrm{L}$ se tvorijo enake vrste vezi (npr. M–N), zato je $\Delta H^\circ$ majhen. Število prostih delcev naraste s $4$ na $7$, $\Delta S^\circ > 0$, zato je $\Delta G^\circ = \Delta H^\circ - T\Delta S^\circ < 0$; večino prispeva člen $-T\Delta S^\circ$.
5. Izpeljava: $\beta_6 = \frac{[\mathrm{ML_6}]}{[\mathrm{M}][\mathrm{L}]^6}$ in $\beta_3' = \frac{[\mathrm{M(AA)_3}]}{[\mathrm{M}][\mathrm{AA}]^3}$. Kvocient $\frac{\beta_3'}{\beta_6} = \frac{[\mathrm{M(AA)_3}][\mathrm{L}]^6}{[\mathrm{ML_6}][\mathrm{AA}]^3} = K$, torej $\log K = \log\beta_3' - \log\beta_6$.

### Naloga 3

Vijolična spojina A in rdeča spojina B imata isto sestavo $\mathrm{CoBr(NH_3)_5SO_4}$. Raztopina A z $\mathrm{BaCl_2}$ da belo oborino, z $\mathrm{AgNO_3}$ pa ne. Raztopina B z $\mathrm{AgNO_3}$ da bledo rumeno oborino, z $\mathrm{BaCl_2}$ pa ne. Zapiši formuli in imeni, poimenuj vrsto izomerije in izračunaj maso oborine, ki jo da $1{,}00\,\mathrm{g}$ spojine B s prebitkom $\mathrm{AgNO_3}$.

**Rešitev:**

1. A obori $\mathrm{BaSO_4}$, torej je sulfat zunaj: $[\mathrm{Co(NH_3)_5Br}]\mathrm{SO_4}$, pentaaminbromidokobaltov(III) sulfat.
2. B obori $\mathrm{AgBr}$, torej je bromid zunaj: $[\mathrm{Co(NH_3)_5(SO_4)}]\mathrm{Br}$, pentaaminsulfatokobaltov(III) bromid.
3. Vrsta: ionizacijska izomerija. V obeh je kobalt(III): v A $+2 = x - 1$, v B $+1 = x - 2$, torej $x = 3$.
4. Molska masa: $M = 58{,}93 + 79{,}90 + 5 \cdot 17{,}03 + 96{,}06\,\mathrm{g/mol} \approx 320{,}0\,\mathrm{g/mol}$.
5. $n(\mathrm{B}) = 1{,}00/320{,}0\,\mathrm{mol} \approx 3{,}125 \cdot 10^{-3}\,\mathrm{mol}$; en bromid na formulsko enoto, $M(\mathrm{AgBr}) = 187{,}77\,\mathrm{g/mol}$.
6. $m(\mathrm{AgBr}) = 3{,}125 \cdot 10^{-3} \cdot 187{,}77\,\mathrm{g} \approx 0{,}587\,\mathrm{g}$.
7. Odgovor: A je $[\mathrm{Co(NH_3)_5Br}]\mathrm{SO_4}$, B je $[\mathrm{Co(NH_3)_5(SO_4)}]\mathrm{Br}$, ionizacijska izomera; $1{,}00\,\mathrm{g}$ B da okoli $0{,}587\,\mathrm{g}$ $\mathrm{AgBr}$.

## Drugače: Na sliki

Oktaeder s šestimi mesti, oštevilčenimi tako, da sta $1$ in $6$ nasprotna:

```
        1
        |
   5 -- M -- 3
       /|
      4 2
        |
        6
```

Nasprotni pari so $1$–$6$, $2$–$4$, $3$–$5$; vsi drugi pari so *cis*. Pri $\mathrm{MA_4B_2}$ dasta B na $1, 6$ *trans*, na $1, 2$ *cis*. Pri $\mathrm{MA_3B_3}$ dajo A na $1, 2, 3$ *fac* (ploskev), na $1, 3, 6$ *mer*. Vsako drugo razporeditev z rotacijo prevedeš na eno od teh.

Barvni krog pomaga pri barvi: kompleks z vrhom absorpcije v rumenem delu je vijoličen, z vrhom v rdečem modrozelen. Vijolični $[\mathrm{Cr(H_2O)_6}]^{3+}$ in zeleni $[\mathrm{Cr(H_2O)_5Cl}]^{2+}$ se razlikujeta, ker je $\mathrm{Cl^-}$ šibkejši ligand od vode: vrh se pomakne k daljšim valovnim dolžinam.

## Drugače: Uporaba v stroki

- **Kemoterapija.** Cisplatin, karboplatin in oksaliplatin so kvadratni kompleksi Pt(II). Karboplatin ima kelatni dikarboksilatni ligand, ki se počasneje zamenja, zato je manj strupen za ledvice.
- **Zastrupitve s kovinami.** Pri zastrupitvi s svincem dajejo $\mathrm{Na_2[Ca(EDTA)]}$, ne prostega EDTA, da ne bi iz krvi odvzeli kalcija. Izmenjava $[\mathrm{Ca(EDTA)}]^{2-} + \mathrm{Pb^{2+}} \to [\mathrm{Pb(EDTA)}]^{2-} + \mathrm{Ca^{2+}}$ ima $\log K \approx 18{,}0 - 10{,}7 = 7{,}3$. Za železo uporabljajo deferoksamin, za baker pri Wilsonovi bolezni penicilamin.
- **Kontrastna sredstva.** Prosti $\mathrm{Gd^{3+}}$ je strupen, zato ga za magnetno resonanco vežejo v kelate z $\log K$ okoli $22$ do $25$. Makrociklični kelati sproščajo $\mathrm{Gd^{3+}}$ počasneje od linearnih, zato imajo prednost.
- **Biološki kompleksi.** Hem v hemoglobinu je kompleks Fe(II) s porfirinom; $\mathrm{CO}$, ligand z močnim poljem, se veže okoli $200$-krat močneje kot $\mathrm{O_2}$. Vitamin $\mathrm{B_{12}}$ je kompleks kobalta.

## Drugače: Bolj natančno

**Teorija ligandnega polja.** Kristalno polje ligande obravnava kot točkaste naboje in ne pojasni, zakaj je nevtralni $\mathrm{CO}$ močnejši ligand od $\mathrm{F^-}$. Teorija molekulskih orbital to pojasni z vezmi π: ligandi π-akceptorji ($\mathrm{CO}$, $\mathrm{CN^-}$) imajo prazne orbitale π*, ki znižajo $t_{2g}$ in povečajo $\Delta_\mathrm{o}$; ligandi π-donorji ($\mathrm{Cl^-}$, $\mathrm{OH^-}$) zapolnjene orbitale p dvignejo $t_{2g}$ in zmanjšajo $\Delta_\mathrm{o}$. Od tod vrstni red spektrokemijske vrste: π-donorji < čisti σ-donorji < π-akceptorji.

**Pravilo 18 elektronov.** Karbonilni kompleksi nizkovalentnih kovin so obstojni, kadar je vsota elektronov $d$ kovine in elektronov, ki jih podarijo ligandi, enaka $18$: $[\mathrm{Ni(CO)_4}]$ ima $10 + 4 \cdot 2 = 18$, $[\mathrm{Cr(CO)_6}]$ $6 + 6 \cdot 2 = 18$.

**Trans učinek.** V kvadratnih kompleksih Pt(II) ligand pospeši zamenjavo liganda *trans* k sebi; vrstni red $\mathrm{CN^-} > \mathrm{Cl^-} > \mathrm{NH_3} > \mathrm{H_2O}$. Iz $[\mathrm{PtCl_4}]^{2-}$ z amoniakom zato nastane ravno *cis* izomer: drugi $\mathrm{NH_3}$ zamenja klorid *trans* k drugemu kloridu, ne k amoniaku. Na tem temelji industrijska sinteza cisplatina (v praksi prek $[\mathrm{PtI_4}]^{2-}$, ker ima jodid še močnejši trans učinek od klorida).

## Preveri se

? Kateri opis ustreza razcepu orbital $d$ v tetraedrskem polju?
- Tri orbitale spodaj, dve zgoraj, razcep enak kot v oktaedru.
~ To je oktaedrski razcep; v tetraedru ligandi ležijo med osmi, zato je razporeditev obrnjena.
+ Dve orbitali ($e$) spodaj, tri ($t_2$) zgoraj, razcep okoli $\frac{4}{9}\Delta_\mathrm{o}$.
- Dve orbitali spodaj, tri zgoraj, razcep večji od $\Delta_\mathrm{o}$.
~ Štirje ligandi namesto šestih, ki ne kažejo naravnost na orbitale, dajo manjši razcep, ne večjega.
> V tetraedru se dvignejo $d_{xy}$, $d_{xz}$, $d_{yz}$ ($t_2$), ker so bliže ligandom; $\Delta_\mathrm{t} \approx \frac{4}{9}\Delta_\mathrm{o}$.

? Za kobaltov(II) kompleks z oktaedrskim razcepom $\Delta_\mathrm{o} \approx 110\,\mathrm{kJ/mol}$ oceni razcep v tetraedrskem kompleksu z istim ligandom.
- okoli $110\,\mathrm{kJ/mol}$
~ Razcep ni neodvisen od oblike; manj ligandov da šibkejše polje.
+ okoli $50\,\mathrm{kJ/mol}$
- okoli $250\,\mathrm{kJ/mol}$
~ Pomnožil si z $\frac{9}{4}$ namesto s $\frac{4}{9}$.
- okoli $10\,\mathrm{kJ/mol}$
~ Razcep je manjši, a istega reda velikosti; razmerje je okoli $0{,}44$, ne $0{,}1$.
> $\frac{4}{9} \cdot 110\,\mathrm{kJ/mol} \approx 49\,\mathrm{kJ/mol}$, kar je manj od energije parjenja, zato visokospinski kompleks.

? Zakaj je $[\mathrm{Ni(en)_3}]^{2+}$ za okoli $10$ redov velikosti obstojnejši od $[\mathrm{Ni(NH_3)_6}]^{2+}$?
- Ker je vez Ni–N z etilendiaminom mnogo močnejša.
~ Donorski atom je v obeh primerih dušik in entalpiji tvorbe sta podobni.
- Ker ima etilendiamin naboj in ga kovina močneje privlači.
~ Etilendiamin je nevtralna molekula, tako kot amoniak.
+ Ker se pri izmenjavi poveča število prostih delcev, kar poveča entropijo.
> Kelatni učinek: $4 \to 7$ delcev, $\Delta S^\circ > 0$; poleg tega drugi konec vezanega kelata ostane tik ob kovini.

? Katera formula ustreza imenu kalijev heksacianidoferat(III)?
- $\mathrm{K_4[Fe(CN)_6]}$
~ To je heksacianidoferat(II): pri Fe(III) je naboj aniona $3 - 6 = -3$, zato trije kalijevi ioni.
+ $\mathrm{K_3[Fe(CN)_6]}$
- $\mathrm{K[Fe(CN)_6]}$
~ Pozabil si naboje ligandov: šest $\mathrm{CN^-}$ da anionu naboj $-3$, ne $-1$.
- $\mathrm{K_3[Fe(CN)_3]}$
~ Predpona heksa pomeni šest ligandov, ne tri.
> Fe(III) in šest $\mathrm{CN^-}$: $[\mathrm{Fe(CN)_6}]^{3-}$, za nevtralnost trije $\mathrm{K^+}$.

? V bolnišničnem laboratoriju imajo zeleno snov s sestavo $\mathrm{CrCl_3 \cdot 6H_2O}$. En mol z $\mathrm{AgNO_3}$ takoj obori $2$ mola $\mathrm{AgCl}$. Katera formula ji ustreza?
- $[\mathrm{Cr(H_2O)_6}]\mathrm{Cl_3}$
~ Ta oblika ima tri proste kloride in bi oborila $3$ mole $\mathrm{AgCl}$; je vijolična.
+ $[\mathrm{Cr(H_2O)_5Cl}]\mathrm{Cl_2 \cdot H_2O}$
- $[\mathrm{Cr(H_2O)_3Cl_3}] \cdot 3\,\mathrm{H_2O}$
~ Nevtralni kompleks nima prostih kloridov, oborina takoj ne bi nastala.
> Dva prosta klorida pomenita en klorid v notranji sferi; voda, ki ga je izpodrinil, je v kristalu zunaj. To je hidratna izomerija.

:::simboli
\Delta_\mathrm{o} | oktaedrski razcep kristalnega polja | | kJ/mol
\Delta_\mathrm{t} | tetraedrski razcep kristalnega polja | \Delta_\mathrm{t} \approx \frac{4}{9}\Delta_\mathrm{o} | kJ/mol
\mu | magnetni moment (samo spin) | \mu = \sqrt{n(n+2)}\,\mu_\mathrm{B} | –
n | število neparnih elektronov | | –
n_e, n_t | število elektronov v $e$ oz. $t_2$ | | –
\beta_3, \beta_6, \beta_3' | celokupne konstante tvorbe | | – | z ustreznimi enotami koncentracije
K | ravnotežna konstanta | | – | pri zamenjavi kloridov v mol/L
\Delta G | standardna sprememba Gibbsove energije | \Delta G^\circ = -RT\ln K | kJ/mol
\Delta H | standardna reakcijska entalpija | | kJ/mol
\Delta S | standardna reakcijska entropija | | J/(mol\,K)
R | splošna plinska konstanta | | J/(mol\,K)
T | temperatura | | K
x | delež zamenjane (akva) oblike | | –
M | molska masa | | g/mol | tudi oznaka kovine v $\mathrm{ML_6}$
m | masa | | g
:::
