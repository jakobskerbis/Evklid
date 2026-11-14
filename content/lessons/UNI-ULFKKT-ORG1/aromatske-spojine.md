---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nina ima na vajah iz farmacevtske kemije nalogo: na benzenov obroč mora pripeti brom, obroč pa mora ostati cel. Ve, da cikloheksen v trenutku razbarva bromovico, ker se brom adira na dvojno vez. Benzen ima na papirju kar tri dvojne vezi, pa bromovice ne razbarva. Z bromom reagira šele s katalizatorjem $\text{FeBr}_3$, in še takrat nastane bromobenzen z nedotaknjenim obročem, ne adicijski produkt.

Za to »upiranje« je kriva **aromatičnost**: posebna stabilnost nekaterih cikličnih sistemov z delokaliziranimi elektroni $\pi$. Aromatski obroči so v mnogih zdravilih (paracetamol, ibuprofen), barvilih in biomolekulah (fenilalanin, baze DNA). Njihova glavna reakcija je **elektrofilna aromatska substitucija**.

## Razlaga

### Najprej en primer: benzen je bolj stabilen, kot bi pričakovali

Pri hidrogenaciji cikloheksena (ena dvojna vez) se sprosti približno $120\,\text{kJ/mol}$. Za »cikloheksatrien« s tremi ločenimi dvojnimi vezmi bi pričakovali trikrat toliko, $3 \cdot 120 = 360\,\text{kJ/mol}$. Izmerimo pa le $208\,\text{kJ/mol}$. Razlika, $360 - 208 = 152\,\text{kJ/mol}$, je **resonančna (aromatska) stabilizacija**: za toliko je benzen nižje na energijski lestvici.

### Od kod ta stabilnost: zgradba benzena

Vseh šest ogljikov je hibridiziranih $sp^2$, obroč je raven, koti so $120^\circ$. Vsak ogljik ima eno nehibridizirano orbitalo $p$, pravokotno na ravnino obroča. Šest orbital $p$ se prekriva v sklenjen krog nad in pod ravnino, v katerem je šest elektronov $\pi$. Vse vezi C–C so enako dolge ($139\,\text{pm}$), med enojno ($154\,\text{pm}$) in dvojno ($134\,\text{pm}$). Dve Kekuléjevi strukturi (šestkotnik z izmeničnimi enojnimi in dvojnimi vezmi, enkrat tako, enkrat zamaknjeno) sta le resonančni strukturi; prava molekula je hibrid, zato benzen pogosto rišemo kot šestkotnik s krogom.

### Posplošitev: Hücklovo pravilo

Benzen ni edini tak obroč. **Hücklovo pravilo:** spojina (molekula ali ion) je **aromatska**, če hkrati velja:

- je ciklična in ravna,
- vsak atom v obroču ima orbitalo $p$ (sklenjen, nepretrgan sistem $\pi$),
- v sistemu $\pi$ je $4n + 2$ elektronov ($n = 0, 1, 2, \ldots$), torej $2$, $6$, $10$, $14$ …

Če sta prvi dve točki izpolnjeni, elektronov $\pi$ pa je $4n$ ($4$, $8$ …), je spojina **antiaromatska** in posebno nestabilna. Molekule, ki prvih dveh točk ne izpolnijo, so **nearomatske**: obnašajo se kot navadni polieni. Pravilo velja strogo za monociklične sisteme; pri zlitih obročih (naftalen) štejemo vse elektrone $\pi$ in ga uporabljamo kot dobro oceno.

**Utemeljitev (teorija MO).** V ravnem, cikličnem sistemu z $N$ orbitalami $p$ da Hücklova metoda energije $E_k = \alpha + 2\beta\cos\dfrac{2\pi k}{N}$, $k = 0, 1, \ldots, N - 1$, kjer je $\beta < 0$.
1. Najnižja orbitala ($k = 0$, $E = \alpha + 2\beta$) je ena sama; orbitali $k$ in $N - k$ imata enako energijo, zato so višje orbitale v degeneriranih parih (pri sodem $N$ je ena sama še najvišja, $k = N/2$, ki je protivezna in pri štetju veznih elektronov ne nastopi).
2. Najnižja sprejme $2$ elektrona, vsak naslednji par $4$. Lupina je zaprta natanko pri $2 + 4n$ elektronih.
3. Pri $4n$ elektronih ostaneta v najvišjem zasedenem paru dva nesparjena elektrona (po Hundu), kar je energijsko neugodno: antiaromatičnost.

Za benzen ($N = 6$) dobimo $\alpha + 2\beta$, dvakrat $\alpha + \beta$, dvakrat $\alpha - \beta$ in $\alpha - 2\beta$. Šest elektronov da $E_\pi = 2(\alpha + 2\beta) + 4(\alpha + \beta) = 6\alpha + 8\beta$, tri izolirane vezi C=C pa $3 \cdot 2(\alpha + \beta) = 6\alpha + 6\beta$. Razlika $2\beta$ je **delokalizacijska energija**, teoretična ustreznica izmerjene resonančne stabilizacije.

### Pravilo na drugih obročih: štetje elektronov $\pi$

Dvojna vez v obroču prispeva $2$ elektrona. Nevezni par na atomu v obroču prispeva $2$ elektrona le, če je v orbitali $p$, ki je del kroga. Pozitivni naboj na ogljiku $sp^2$ pomeni prazno orbitalo $p$ ($0$ elektronov), negativni naboj par v orbitali $p$ ($2$ elektrona).

| Spojina | Elektroni $\pi$ | Raven, sklenjen $p$? | Vrsta |
|---|---|---|---|
| benzen | $6$ | da | aromatska |
| ciklooktatetraen | $8$ | ne (oblika kadi) | nearomatska |
| pirol | $4 + 2$ (par N) | da | aromatska |
| piridin | $6$ (par N ne šteje) | da | aromatska |

V piridinu je dušik $sp^2$ in že sodeluje v dvojni vezi; njegov nevezni par leži v ravnini obroča, pravokotno na orbitale $p$, zato ga ne štejemo. Ker ostane prost, je piridin bazičen. V pirolu dušik nima dvojne vezi, zato njegov par napolni orbitalo $p$ in zaključi sekstet.

:::premisli
Ciklopentadien ($\text{C}_5\text{H}_6$) ni aromatski. Kaj se zgodi z aromatičnostjo, ko mu močna baza odvzame proton s skupine $\text{CH}_2$? Napovej, preden pogledaš.
---
Nastane ciklopentadienidni anion, ki je aromatski. Ogljik, ki je bil $sp^3$, postane $sp^2$, njegov nevezni par preide v orbitalo $p$, krog je sklenjen in ima $4 + 2 = 6$ elektronov $\pi$. Zato je ciklopentadien za ogljikovodik nenavadno kisel.
:::

### Nazaj k Ninini nalogi: zakaj substitucija in ne adicija

Elektrofil $\text{E}^+$ napade oblak $\pi$ benzena podobno kot pri alkenih. Pri tem nastane karbokation, imenovan **areniumski ion** (kompleks $\sigma$). Pozitivni naboj je delokaliziran na treh ogljikih (orto, para glede na mesto napada), a aromatičnost je izgubljena, zato je ta korak počasen in določa hitrost. Nato ima ion dve možnosti:

- adira nukleofil, kot pri alkenih: produkt ni več aromatski, kar bi stalo okoli $150\,\text{kJ/mol}$;
- odda proton z ogljika, na katerega se je vezal E: aromatski obroč se obnovi.

Narava izbere drugo pot. Shematsko:

$$\text{ArH} + \text{E}^+ \xrightarrow{\text{počasi}} [\text{Ar(H)E}]^+ \xrightarrow{-\text{H}^+} \text{ArE}$$

### En mehanizem, pet reakcij

Benzen je šibek nukleofil, zato potrebuje močan elektrofil, ki ga ustvari katalizator ali kislina:

| Reakcija | Reagenti | Elektrofil | Produkt |
|---|---|---|---|
| halogeniranje | $\text{Br}_2$, $\text{FeBr}_3$ | $\text{Br}^{\delta+}\cdots\text{FeBr}_4^{\delta-}$ | $\text{ArBr}$ |
| nitriranje | $\text{HNO}_3$, $\text{H}_2\text{SO}_4$ | $\text{NO}_2^+$ | $\text{ArNO}_2$ |
| sulfoniranje | $\text{SO}_3$, $\text{H}_2\text{SO}_4$ | $\text{SO}_3$ ($\text{HSO}_3^+$) | $\text{ArSO}_3\text{H}$ |
| alkiliranje F.–C. | $\text{RCl}$, $\text{AlCl}_3$ | $\text{R}^+$ | $\text{ArR}$ |
| aciliranje F.–C. | $\text{RCOCl}$, $\text{AlCl}_3$ | $\text{RCO}^+$ | $\text{ArCOR}$ |

Pri Friedel-Craftsovem alkiliranju nastane karbokation, ki se lahko premesti v stabilnejšega, tako kot pri $\text{S}_\text{N}1$ in E1. Acilijev ion je stabiliziran z resonanco in se ne premešča. Ravno alkilno verigo zato uvedemo z aciliranjem, karbonilno skupino pa nato reduciramo v $\text{CH}_2$, npr. z $\text{Zn(Hg)}/\text{HCl}$ (Clemmensenova redukcija).

Alkil obroč aktivira, zato pri alkiliranju nastajajo tudi polialkilirani produkti; acilna skupina ga deaktivira, zato se aciliranje ustavi pri enem substituentu. Na močno deaktiviranih obročih (nitrobenzen) Friedel-Craftsovi reakciji ne potečeta.

### Drugi substituent: kako hitro in kam

Skupina, ki je že na obroču, odloči, kako hitro poteče naslednja substitucija in kam gre nova skupina. Skupina je **aktivirajoča**, če je substitucija na substituiranem benzenu hitrejša kot na benzenu, in **deaktivirajoča**, če je počasnejša. Odloča stabilnost areniumskega iona:

- **Aktivirajoče skupine** ($-\text{OH}$, $-\text{OR}$, $-\text{NH}_2$, alkil) dajejo obroču elektrone. Pri napadu na orto ali para mesto pride pozitivni naboj na ogljik s to skupino, ki ga stabilizira (pri $-\text{OH}$ celo z neveznim parom kisika). Usmerjajo **orto/para**, reakcija je hitrejša kot pri benzenu.
- **Deaktivirajoče skupine** ($-\text{NO}_2$, $-\text{CN}$, $-\text{CHO}$, $-\text{COR}$, $-\text{COOH}$, $-\text{SO}_3\text{H}$) elektrone odvzemajo. Pri orto/para napadu bi pozitivni naboj sedel tik ob skupini, ki ga ne prenese. Ostane **meta**, reakcija je počasnejša.
- **Halogeni** so izjema: z induktivnim učinkom obroč deaktivirajo, z neveznim parom pa stabilizirajo orto/para ion. Usmerjajo **orto/para**, a je reakcija počasnejša kot pri benzenu.

**Utemeljitev usmerjanja.** Naj bo skupina G na C1. Narišemo resonančne strukture areniumskega iona za napad na C2 (orto), C3 (meta) in C4 (para).
1. Pozitivni naboj je vedno na ogljikih v orto in para položaju glede na mesto napada.
2. Pri napadu na C2 ali C4 je zato v eni strukturi naboj na C1, ki nosi G; pri napadu na C3 nikoli.
3. Donor (alkil, nevezni par) to strukturo stabilizira, pri $-\text{OH}$ celo z dodatno strukturo $\text{C{=}O}^+\text{H}$, v kateri imajo vsi atomi oktet. Akceptor jo destabilizira.
4. Po Hammondovem postulatu je prehodno stanje počasnega koraka podobno ionu, zato stabilnost iona določa hitrost in položaj.

:::premisli
Pri nitrobenzenu so vsi trije položaji počasnejši kot pri benzenu. Napovej, kateri kljub temu prevlada pri nadaljnjem nitriranju, in pojasni, zakaj. Namig: kakšen naboj nosi dušik v $-\text{NO}_2$?
---
Ker je meta napad »najmanj slab«. Pri orto in para napadu ena resonančna struktura areniumskega iona postavi pozitivni naboj na ogljik, vezan na $-\text{NO}_2$, ki ima tudi sam pozitivni dušik. Pri meta napadu se tej strukturi izogne, zato je meta ion najmanj nestabilen in nastaja najhitreje.
:::

## Rešeni primeri

### Primer 1 (lažji): ali je aromatski?

Za tri ciklične, ravne molekule s sklenjenim sistemom orbital $p$ odloči, ali so aromatske ali antiaromatske: ciklobutadien ($2$ dvojni vezi), tropilijev kation $\text{C}_7\text{H}_7^+$ ($3$ dvojne vezi in en ogljik s pozitivnim nabojem) in naftalen ($5$ dvojnih vezi v dveh zlitih obročih).

**Podatki:** vse tri molekule so ciklične, ravne in s sklenjenim sistemom $p$; ciklobutadien: $2$ vezi C=C; tropilij: $3$ vezi C=C in $1$ ogljik $\text{C}^+$; naftalen: $5$ vezi C=C
**Iščemo:** število elektronov $\pi$ in vrsto (aromatska, antiaromatska)

:::formula
Hücklovo pravilo: aromatska pri $4n + 2$ elektronih $\pi$, antiaromatska pri $4n$; dvojna vez $= 2$, $\text{C}^+ = 0$.
:::

**Rešitev:**

1. Ciklobutadien: $2 \cdot 2 = 4$ elektroni. To je $4n$ z $n = 1$, zato je antiaromatski (in obstaja le pri zelo nizki temperaturi).
2. Tropilijev kation: $3 \cdot 2 + 0 = 6$ elektronov, ker je orbitala $p$ na $\text{C}^+$ prazna. To je $4 \cdot 1 + 2$, zato je aromatski, kar pojasni, zakaj je ta karbokation nenavadno stabilen.
3. Naftalen: $5 \cdot 2 = 10$ elektronov, kar je $4 \cdot 2 + 2$. Aromatski.
4. Odgovor: ciklobutadien je antiaromatski, tropilijev kation in naftalen sta aromatska.

### Primer 2: mehanizem bromiranja

Benzen segrevamo z bromom ob dodatku $\text{FeBr}_3$. Zapiši korake mehanizma in produkt.

**Podatki:** substrat benzen, reagent $\text{Br}_2$, katalizator $\text{FeBr}_3$ (Lewisova kislina)
**Iščemo:** korake mehanizma in produkt

:::formula
$\text{ArH} + \text{E}^+ \to [\text{Ar(H)E}]^+ \to \text{ArE} + \text{H}^+$
:::

**Rešitev:**

1. Nastanek elektrofila: $\text{FeBr}_3$ sprejme par z enega broma. Vez Br–Br se polarizira, zunanji brom postane $\text{Br}^{\delta+}$. To je potrebno, ker je sam brom za benzen prešibak elektrofil.
2. Napad: par $\pi$ benzena napade $\text{Br}^{\delta+}$, nastaneta areniumski ion in $\text{FeBr}_4^-$. Aromatičnost se začasno izgubi, zato je to počasni korak.
3. Deprotonacija: $\text{FeBr}_4^-$ odvzame proton z ogljika, ki nosi brom. Obroč je spet aromatski, nastaneta $\text{HBr}$ in spet $\text{FeBr}_3$, torej je ta res katalizator.
4. Odgovor: nastane bromobenzen ($\text{C}_6\text{H}_5\text{Br}$) in $\text{HBr}$; obroč ostane aromatski.

### Primer 3 (težji): vrstni red korakov v sintezi

Nina za sintezo farmacevtskega intermediata potrebuje 1-bromo-3-propilbenzen, izhaja pa iz benzena. Na voljo ima $\text{Br}_2/\text{FeBr}_3$, 1-kloropropan z $\text{AlCl}_3$, propanoil klorid ($\text{CH}_3\text{CH}_2\text{COCl}$) z $\text{AlCl}_3$ in $\text{Zn(Hg)}/\text{HCl}$. Predlagaj zaporedje reakcij in utemelji, zakaj krajša pot ne gre.

**Podatki:** izhodna snov benzen; cilj 1-bromo-3-propilbenzen (substituenta v meta); reagenti $\text{Br}_2/\text{FeBr}_3$, $\text{CH}_3\text{CH}_2\text{CH}_2\text{Cl}/\text{AlCl}_3$, $\text{CH}_3\text{CH}_2\text{COCl}/\text{AlCl}_3$, $\text{Zn(Hg)}/\text{HCl}$
**Iščemo:** zaporedje reakcij z vmesnimi produkti in utemeljitev

:::formula
Usmerjanje: $-\text{Br}$ in alkil orto/para, $-\text{COR}$ meta. Alkiliranje s primarnim halidom: premestitev kationa. $\text{Zn(Hg)}/\text{HCl}$: $\text{C{=}O} \to \text{CH}_2$.
:::

**Rešitev:**

1. Substituenta sta v meta položaju, oba ($-\text{Br}$ in propil) pa usmerjata orto/para. Noben vrstni red neposrednih substitucij ne da meta produkta, zato potrebujemo začasno meta usmerjevalno skupino.
2. Propila ne moremo uvesti z 1-kloropropanom: primarni kation se premesti v sekundarnega in nastane izopropilbenzen.
3. Korak 1: aciliranje s propanoil kloridom da 1-fenilpropan-1-on ($\text{C}_6\text{H}_5\text{COCH}_2\text{CH}_3$), ker se acilijev ion ne premešča.
4. Korak 2: bromiranje. Acilna skupina deaktivira obroč in usmerja meta, zato nastane 1-(3-bromofenil)propan-1-on; potrebni so nekoliko ostrejši pogoji kot pri benzenu.
5. Korak 3: Clemmensenova redukcija pretvori $\text{C{=}O}$ v $\text{CH}_2$; vez C–Br na obroču ostane, nastane 1-bromo-3-propilbenzen.
6. Kontrola: obraten vrstni red bi dal bromobenzen, ta pa bi acilno skupino usmeril v orto in para položaj (predvsem para), ne v meta. Enako velja za 1-bromo-3-nitrobenzen: meta usmerjevalec $-\text{NO}_2$ mora na obroč prvi, zato najprej nitriramo in nato bromiramo.
7. Odgovor: aciliranje, bromiranje, redukcija. Meta usmerjanje acilne skupine izkoristimo, preden jo pretvorimo v orto/para usmerjajoči propil.

### Primer 4: zdaj ti

Anizol (metoksibenzen, $\text{C}_6\text{H}_5\text{OCH}_3$) nitriramo z $\text{HNO}_3/\text{H}_2\text{SO}_4$. Katera produkta nastaneta in ali je reakcija hitrejša ali počasnejša kot pri benzenu?

**Podatki:** substrat anizol (skupina $-\text{OCH}_3$), reagenta $\text{HNO}_3$, $\text{H}_2\text{SO}_4$
**Iščemo:** glavna produkta in hitrost glede na benzen

:::formula
$-\text{OR}$: aktivirajoča skupina, usmerja orto/para.
:::

**Rešitev:**

1. Elektrofil je nitronijev ion $\text{NO}_2^+$, ki nastane iz $\text{HNO}_3$ v močni kislini.
2. Kisik skupine $-\text{OCH}_3$ ima nevezni par, ki stabilizira areniumski ion pri orto in para napadu.
3. Zapiši produkta in hitrost sam, nato preveri:

:::premisli
Katera produkta nastaneta in kako hitra je reakcija?
---
Nastaneta 2-nitroanizol (orto) in 4-nitroanizol (para); para pogosto prevladuje, ker je orto mesto sterično bolj ovirano. Reakcija je hitrejša kot pri benzenu, ker je $-\text{OCH}_3$ aktivirajoča skupina.
:::

## Pogoste napake

- **»Tri dvojne vezi v obroču pomenijo aromatičnost.«** Šteje število elektronov $\pi$ v sklenjenem, ravnem sistemu, ne število vezi. Ciklooktatetraen ima štiri dvojne vezi in $8$ elektronov, je upognjen in nearomatski.
- **»Benzen reagira kot alken.«** Benzen brez katalizatorja ne adira broma, s katalizatorjem pa da substitucijski produkt, ker se tako aromatičnost obnovi. Adicija bi stala okoli $150\,\text{kJ/mol}$ stabilizacije.
- **»Halogeni deaktivirajo, torej usmerjajo meta.«** Hitrost in usmerjanje sta dve različni vprašanji. Halogeni zmanjšajo hitrost (induktivno), a z neveznim parom stabilizirajo orto/para ion. Rezultat: počasneje, a orto/para.
- **Alkiliranje z 1-kloropropanom da propilbenzen.** Primarni karbokation se premesti v sekundarnega, zato nastane predvsem izopropilbenzen (kumen). Ravno verigo dobiš z aciliranjem in redukcijo.

## Povzetek

- Aromatska spojina je ciklična, ravna, s sklenjenim sistemom orbital $p$ in $4n + 2$ elektroni $\pi$ ($2, 6, 10$ …); s $4n$ elektroni je antiaromatska.
- Benzen je za okoli $150\,\text{kJ/mol}$ stabilnejši od »cikloheksatriena«; vse vezi C–C so enake ($139\,\text{pm}$).
- Nevezni par šteje le, če je v orbitali $p$ kroga (pirol da, piridin ne); $\text{C}^+$ prispeva $0$, $\text{C}^-$ $2$ elektrona.
- Elektrofilna aromatska substitucija: nastanek $\text{E}^+$, počasni napad do areniumskega iona, hitra deprotonacija, ki obnovi aromatičnost.
- Reakcije: halogeniranje ($\text{FeX}_3$), nitriranje ($\text{NO}_2^+$), sulfoniranje, Friedel-Craftsovo alkiliranje (premestitve) in aciliranje.
- Aktivirajoče skupine in halogeni usmerjajo orto/para, ostale deaktivirajoče skupine meta; v sintezi je vrstni red korakov pomemben.

## Za izpit

Znati moraš povedati:

- definicije aromatske, antiaromatske in nearomatske spojine (Hücklovo pravilo z vsemi pogoji) in utemeljitev pravila $4n + 2$ s teorijo MO;
- izpeljavo resonančne stabilizacije benzena iz hidrogenacijskih entalpij in delokalizacijske energije $2\beta$;
- mehanizem elektrofilne aromatske substitucije in nastanek elektrofila v petih osnovnih reakcijah;
- definicijo aktivirajoče in deaktivirajoče skupine ter utemeljitev usmerjanja z resonančnimi strukturami areniumskega iona;
- omejitve Friedel-Craftsovega alkiliranja (premestitve, polialkiliranje, deaktivirani obroči).

### Naloga 1

Hidrogenacijske entalpije do cikloheksana so: cikloheksen $-120\,\text{kJ/mol}$, cikloheksa-1,3-dien $-232\,\text{kJ/mol}$, benzen $-208\,\text{kJ/mol}$. (a) Izračunaj resonančno stabilizacijo benzena in stabilizacijo zaradi konjugacije v cikloheksa-1,3-dienu. (b) S Hessovim zakonom izračunaj $\Delta H$ za $\text{C}_6\text{H}_6 + \text{H}_2 \to$ cikloheksa-1,3-dien in razloži, kaj pomeni predznak. (c) Delokalizacijsko energijo $2\beta$ izenači z resonančno stabilizacijo in oceni $\beta$.

**Rešitev:**

1. Tri izolirane dvojne vezi bi dale $3 \cdot (-120) = -360$, v $\text{kJ/mol}$.
2. Benzen: $-208 - (-360) = 152$, resonančna stabilizacija je $152\,\text{kJ/mol}$.
3. Dien: pričakovano $2 \cdot (-120) = -240$, izmerjeno $-232$; stabilizacija $-232 - (-240) = 8$, torej le $8\,\text{kJ/mol}$, kar je $152/8 = 19$-krat manj kot pri benzenu. Konjugacija sama ne zadošča, potreben je sklenjen aromatski krog.
4. Hessov zakon: pot benzen → cikloheksan ($-208$) razdelimo na benzen → dien ($\Delta H_x$) in dien → cikloheksan ($-232$), zato $\Delta H_x = -208 - (-232) = 24$, torej $+24\,\text{kJ/mol}$.
5. Prva adicija $\text{H}_2$ na benzen je endotermna, na alken pa močno eksotermna ($-120\,\text{kJ/mol}$). Izguba aromatičnosti stane več, kot se sprosti pri adiciji; zato benzen hidrogeniramo le v ostrih pogojih, vmesni dien pa reagira hitreje in ga ne izoliramo.
6. Energija se z delokalizacijo zniža, zato je $2\beta = -152\,\text{kJ/mol}$ in $\beta = -76\,\text{kJ/mol}$.
7. Odgovor: stabilizacija benzena je $152\,\text{kJ/mol}$, diena $8\,\text{kJ/mol}$; $\Delta H_x = +24\,\text{kJ/mol}$; $\beta \approx -76\,\text{kJ/mol}$.

### Naloga 2

Natančno navedi Hücklovo pravilo z vsemi pogoji in ga utemelji s teorijo molekulskih orbital. Nato utemelji, ali so aromatski, antiaromatski ali nearomatski: ciklopropenilni kation $\text{C}_3\text{H}_3^+$, furan $\text{C}_4\text{H}_4\text{O}$, raven ciklooktatetraenski dianion $\text{C}_8\text{H}_8^{2-}$ in cikloheptatrien $\text{C}_7\text{H}_8$.

**Rešitev:**

1. Pravilo: monociklična spojina je aromatska, če je ravna, ima vsak atom obroča orbitalo $p$ (sklenjen sistem $\pi$) in je v tem sistemu $4n + 2$ elektronov ($n = 0, 1, 2, \ldots$); pri istih prvih pogojih in $4n$ elektronih je antiaromatska.
2. MO: $E_k = \alpha + 2\beta\cos(2\pi k/N)$; najnižja orbitala je ena sama, višje so v degeneriranih parih, zato je lupina zaprta pri $2 + 4n$ elektronih, pri $4n$ pa ostaneta dva nesparjena.
3. $\text{C}_3\text{H}_3^+$: trije ogljiki $sp^2$, ena vez C=C ($2$) in $\text{C}^+$ ($0$), skupaj $2 = 4 \cdot 0 + 2$: aromatski.
4. Furan: dve vezi C=C ($4$) in en nevezni par kisika v orbitali $p$ ($2$); drugi par leži v ravnini in ne šteje. Skupaj $6 = 4 \cdot 1 + 2$: aromatski.
5. $\text{C}_8\text{H}_8^{2-}$: štiri vezi C=C ($8$) in dva dodatna elektrona ($2$), skupaj $10 = 4 \cdot 2 + 2$; ion je raven in sklenjen: aromatski.
6. Cikloheptatrien: skupina $\text{CH}_2$ je $sp^3$ in prekine krog orbital $p$, zato je nearomatski, čeprav ima $6$ elektronov $\pi$; aromatski je šele tropilijev kation (Primer 1).
7. Odgovor: $\text{C}_3\text{H}_3^+$, furan in $\text{C}_8\text{H}_8^{2-}$ so aromatski, cikloheptatrien je nearomatski.

## Drugače: Na sliki

Benzen je od strani kot miza s šestimi ogljiki; orbitale $p$ štrlijo kot ročke nad in pod mizo in tvorijo »krof« elektronov zgoraj in spodaj. Elektrofil zgrabi par iz zgornjega krofa, en ogljik postane $sp^3$ in krof se pretrga: pet ogljikov si deli štiri elektrone, naboj pa tri od njih. Ko se proton odcepi, je krof spet cel.

## Drugače: Uporaba v stroki

- **Kumenski postopek:** benzen in propen na zeolitu dasta kumen, iz njega pa z oksidacijo in cepitvijo fenol in aceton; tako nastane večina svetovnega fenola.
- **Farmacija:** sinteza ibuprofena se začne s Friedel-Craftsovim aciliranjem izobutilbenzena v para položaj.
- **Eksplozivi:** TNT nastane z zaporednim nitriranjem toluena; metil usmerja na 2, 4 in 6, vsaka nitro skupina pa deaktivira, zato so pogoji vsakič ostrejši.

## Drugače: Bolj natančno

**Frostov krog.** Energije $E_k$ dobiš grafično: v krog s polmerom $2|\beta|$ okoli $\alpha$ včrtaš pravilni $N$-kotnik z ogliščem spodaj; višine oglišč so nivoji MO. Ciklobutadien ima tako dve nevezni orbitali z enim elektronom vsaka, zato se raztegne v pravokotnik z izmeničnimi vezmi.

## Preveri se

? Koliko elektronov $\pi$ mora imeti raven, cikličen sistem s sklenjenim krogom orbital $p$, da je aromatski?
- $4n$, na primer $4$ ali $8$
~ Tako šteje antiaromatska molekula, kot ciklobutadien; aromatska ima $4n + 2$.
+ $4n + 2$, na primer $2$, $6$ ali $10$
- Kakršnokoli sodo število
~ Sodo število ni dovolj: $4$ in $8$ sta sodi, a dajeta antiaromatičnost.
> Hücklovo pravilo: $4n + 2$ elektronov $\pi$ ($n = 0, 1, 2 \ldots$) da zaprto lupino veznih orbital.

? Zakaj benzen z $\text{Br}_2/\text{FeBr}_3$ da bromobenzen in ne dibromocikloheksadiena?
- Ker benzen nima dvojnih vezi.
~ Elektroni $\pi$ so prisotni, le delokalizirani. Napad elektrofila na oblak $\pi$ se res zgodi.
- Ker $\text{FeBr}_3$ prepreči nastanek karbokationa.
~ $\text{FeBr}_3$ ustvari elektrofil; karbokation (areniumski ion) vseeno nastane kot vmesni produkt.
+ Ker oddaja protona iz areniumskega iona obnovi aromatičnost, adicija pa bi jo trajno uničila.
> Substitucijski produkt ohrani okoli $150\,\text{kJ/mol}$ aromatske stabilizacije, zato je ta pot ugodnejša.

? Klorobenzen reagira z nitrirno zmesjo. Kaj velja?
- Reakcija je hitrejša kot pri benzenu, produkt je meta.
~ Klor obroč deaktivira (induktivno), zato je počasnejša; usmerja pa orto/para.
- Reakcija je počasnejša kot pri benzenu, produkt je predvsem meta.
~ Počasnejša res, a halogen z neveznim parom stabilizira orto/para ion, zato ne usmerja meta.
+ Reakcija je počasnejša kot pri benzenu, produkta sta predvsem orto in para.
> Halogeni so deaktivirajoči orto/para usmerjevalci: induktivni učinek zniža hitrost, resonanca neveznega para določi položaj.

? Katera od spojin je aromatska?
- ciklooktatetraen
~ Ima $8$ elektronov $\pi$ ($4n$) in se upogne v obliko kadi, zato je nearomatski.
- cikloheksa-1,3-dien
~ Ogljika $\text{CH}_2$ (C5, C6) sta $sp^3$, zato krog orbital $p$ ni sklenjen.
+ piridin
- ciklopentadien
~ Skupina $\text{CH}_2$ je $sp^3$ in prekine krog; aromatski je šele njegov anion.
> Piridin je raven, ima sklenjen krog šestih orbital $p$ in $6$ elektronov $\pi$; nevezni par dušika leži v ravnini in ne šteje.

? Benzen reagira z 1-kloropropanom in $\text{AlCl}_3$. Kaj je glavni produkt?
- propilbenzen
~ Primarni karbokation (ali kompleks z $\text{AlCl}_3$) se premesti v sekundarnega, zato ravna veriga ni glavni produkt.
+ izopropilbenzen (kumen)
- klorobenzen
~ Klor je del alkilnega halida, ki da elektrofil $\text{R}^+$; na obroč se veže alkil, ne klor.
> Friedel-Craftsovo alkiliranje poteka prek karbokationa, ki se s premikom hidrida premesti v stabilnejši sekundarni kation, zato nastane izopropilbenzen.

:::simboli
n | nenegativno celo število v Hücklovem pravilu | | – | n = 0, 1, 2, …; 4n + 2 elektronov π je aromatsko
:::
