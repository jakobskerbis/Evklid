---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi dve polarizacijski foliji (ali dvoje polarizacijskih sončnih očal) in ju zasukaj tako, da skozi par ne vidiš ničesar. Zdaj med njiju vtakni tretjo folijo, zasukano za $45^\circ$. Ali bo za trojico svetleje ali temneje kot za parom?

Večina ugane »še temneje«, saj vsak filter nekaj svetlobe vzame. V resnici se za trojico **posveti**: skozi gre osmina vpadne svetlobe, prej pa nič. Filter, ki sam svetlobo le slabi, je pot svetlobi odprl. Ta uganka je jedro lekcije: polarizator svetlobe ne »reže«, ampak njeno električno polje **projicira** na svojo smer. Ko to razumeš, znaš izračunati, koliko svetlobe prepusti veriga filtrov, pod katerim kotom gledati vodno gladino brez bleščanja in kako izbrati število filtrov, da bo izkoristek največji – tipično optimizacijsko vprašanje izpitov iz optike.

## Razlaga

Gradimo po delih. Za vsakim delom je vrstica **Preizkus**: kratko vprašanje z odgovorom, ki pove, ali si del res razumel.

### 1. Polarizacija je smer električnega polja

Svetloba je prečno elektromagnetno valovanje: električno polje $\vec{E}$ niha pravokotno na smer širjenja, magnetno polje pa pravokotno na oboje. Za opis polarizacije zadošča $\vec{E}$.

**Definicija.** Svetloba je **linearno polarizirana**, če $\vec{E}$ v dani točki ves čas niha vzdolž iste premice. Ravnino, v kateri ležita smer $\vec{E}$ in smer širjenja, imenujemo **ravnina polarizacije** (nekateri starejši učbeniki jo vežejo na smer $\vec{B}$, zato preveri dogovor v svojem viru).

**Definicija.** **Nepolarizirana** (naravna) svetloba je zmes valovnih paketov z naključnimi in hitro spreminjajočimi se smermi $\vec{E}$; nobena smer pravokotno na žarek ni odlikovana. Takšna je svetloba Sonca, žarnice in sveče.

Vmes je **delno polarizirana** svetloba: zmes nepolarizirane in linearno polarizirane. Njeno **stopnjo polarizacije** definiramo kot

$$P = \frac{I_{max} - I_{min}}{I_{max} + I_{min}},$$

kjer sta $I_{max}$ in $I_{min}$ največja in najmanjša gostota svetlobnega toka za vrtečim se polarizatorjem. Za nepolarizirano svetlobo je $P = 0$, za linearno polarizirano $P = 1$.

Gostota svetlobnega toka (jakost) $I$ je sorazmerna s kvadratom amplitude polja: $I \propto E_0^2$. To je ključ za vse, kar sledi.

**Preizkus.** Ali ima tudi zvok v zraku polarizacijo? – Ne. Zvok v plinu je vzdolžno valovanje: snov niha v smeri širjenja, zato ni pravokotne smeri, ki bi jo lahko izbrali.

### 2. Polarizator in Malusov zakon

**Definicija.** **Linearni polarizator** je naprava, ki prepušča komponento $\vec{E}$ vzdolž svoje **prepustne osi** in zaduši pravokotno komponento. Dikroična folija to doseže z dolgimi molekulami, v katerih lahko elektroni nihajo le v eni smeri in tisto komponento polja absorbirajo.

**Izrek (Malusov zakon).** Na idealen polarizator vpada linearno polarizirana svetloba z gostoto toka $I_0$, njena smer polarizacije pa s prepustno osjo oklepa kot $\theta$. Potem je gostota toka prepuščene svetlobe

$$I = I_0\cos^2\theta,$$

prepuščena svetloba pa je polarizirana vzdolž prepustne osi.

**Izpeljava.** Amplitudo $E_0$ razstavimo na komponento vzdolž osi, $E_0\cos\theta$, in pravokotno, $E_0\sin\theta$. Polarizator prepusti le prvo. Ker je $I \propto E^2$, je $I/I_0 = (E_0\cos\theta)^2/E_0^2 = \cos^2\theta$.

**Posledica (nepolarizirana svetloba).** Za nepolarizirano svetlobo z gostoto toka $I_0$ idealen polarizator v vsaki legi prepusti $I_0/2$. Kot $\theta$ je namreč naključen in enakomerno porazdeljen, povprečje $\cos^2\theta$ po celem krogu pa je $\tfrac{1}{2}$, ker je $\cos^2\theta = \tfrac12(1 + \cos 2\theta)$ in se člen $\cos 2\theta$ v povprečju izniči.

**Preizkus.** Linearno polarizirana svetloba pade na polarizator pod kotom $\theta = 90^\circ$. Koliko je prepuščene? – Nič, ker je $\cos 90^\circ = 0$; temu pravimo **prekrižana** polarizatorja.

Zdaj je uganka iz uvoda razrešena. Prvi polarizator prepusti $I_0/2$. Srednji, zasukan za $45^\circ$, prepusti $\tfrac12 I_0\cos^2 45^\circ = I_0/4$, svetloba pa je zdaj polarizirana pod $45^\circ$. Zadnji je glede na to smer spet zasukan za $45^\circ$ in prepusti $I_0/8$. Srednji filter ni dodal svetlobe, spremenil je njeno smer polarizacije.

:::premisli
Med prekrižana polarizatorja vstaviš tretjega, a z osjo vzporedno s prvim. Ali se za trojico posveti?
---
Ne. Srednji polarizator je vzporeden s prvim, zato prepusti vso svetlobo in ji smeri ne spremeni ($\cos^2 0^\circ = 1$). Zadnji je na to smer še vedno pravokoten in prepusti nič. Posveti se le, če srednji ni vzporeden ne s prvim ne z zadnjim.
:::

### 3. Polarizacija pri odboju in Brewstrov kot

Bleščanje vodne gladine je delno polarizirano. Zakaj?

Pri odboju razstavimo $\vec{E}$ na dve komponenti: **s** (pravokotno na vpadno ravnino, vzporedno z gladino) in **p** (v vpadni ravnini). Ti dve komponenti se odbijata različno močno. Za mejo, na kateri svetloba iz snovi z lomnim količnikom $n_1$ vpada na snov z $n_2$ (vpadni kot $\theta_1$, lomni kot $\theta_2$, $n_1\sin\theta_1 = n_2\sin\theta_2$) dajo Fresnelove enačbe razmerji amplitud

$$r_s = -\frac{\sin(\theta_1 - \theta_2)}{\sin(\theta_1 + \theta_2)},$$

$$r_p = \frac{\tan(\theta_1 - \theta_2)}{\tan(\theta_1 + \theta_2)}.$$

Predznak je odvisen od dogovora o smereh polja; odbojnost (delež odbite gostote toka) je $R_s = r_s^2$ oziroma $R_p = r_p^2$.

**Izrek (Brewstrov kot).** Ko svetloba vpada iz snovi z $n_1$ na snov z $n_2$ pod kotom $\theta_B$, za katerega velja

$$\tan\theta_B = \frac{n_2}{n_1},$$

se p-komponenta sploh ne odbije; odbita svetloba je v celoti s-polarizirana. Pri tem kotu sta odbiti in lomljeni žarek pravokotna: $\theta_B + \theta_2 = 90^\circ$.

**Dokaz.** Imenovalec $\tan(\theta_1 + \theta_2)$ v $r_p$ postane neskončen, ko je $\theta_1 + \theta_2 = 90^\circ$; tedaj je $r_p = 0$, števec pa ni nič, ker je $\theta_1 \ne \theta_2$. Iz $\theta_2 = 90^\circ - \theta_1$ je $\sin\theta_2 = \cos\theta_1$, zato lomni zakon da $n_1\sin\theta_1 = n_2\cos\theta_1$ oziroma $\tan\theta_1 = n_2/n_1$.

Fizikalna slika brez Fresnelovih enačb: lomljena svetloba v drugi snovi zaniha elektrone, ti so drobni dipoli in sevajo odbito svetlobo. Dipol ne seva vzdolž svoje osi. Pri p-polarizaciji elektroni nihajo pravokotno na lomljeni žarek, v vpadni ravnini; če je odbiti žarek pravokoten na lomljenega, kaže ravno vzdolž osi teh dipolov in p-svetlobe ni.

**Preizkus.** Ali Brewstrov kot obstaja tudi za svetlobo, ki iz stekla izhaja v zrak? – Da: $\tan\theta_B = 1/n$, kar je manj od mejnega kota totalnega odboja, zato kot obstaja (za $n = 1{,}5$ okoli $33{,}7^\circ$).

:::premisli
Na mirno jezero gledaš skozi polarizacijska očala, ki imajo prepustno os navpično. Zakaj odsev Sonca skoraj izgine, ko je Sonce nizko, opoldne poleti pa veliko manj?
---
Odbita svetloba je s-polarizirana, torej vodoravno, in jo navpični polarizator zaduši. V celoti pa je s-polarizirana le blizu Brewstrovega kota (za vodo okoli $53^\circ$ od navpičnice, Sonce okoli $37^\circ$ nad obzorjem). Ko je Sonce visoko, je vpadni kot majhen, obe komponenti se odbijeta skoraj enako in odsev je skoraj nepolariziran. Tudi tik ob obzorju (zelo poševen vpad) se obe komponenti odbijeta skoraj v celoti, zato očala odsev najbolj oslabijo okoli Brewstrovega kota, ne pri najnižjem Soncu.
:::

### 4. Še dve poti do polarizirane svetlobe

**Sipanje.** Molekule zraka sipajo sončno svetlobo kot dipoli. Svetloba, sipana pravokotno na vpadni žarek, je skoraj linearno polarizirana, zato je modro nebo $90^\circ$ stran od Sonca skozi polarizator opazno temnejše pri eni legi filtra.

**Dvolomnost.** V nekaterih kristalih (kalcit, kremen) je lomni količnik odvisen od smeri polarizacije: žarek se razcepi na dva pravokotno polarizirana. Na tem temeljijo valovne ploščice, ki linearno polarizacijo spremenijo v krožno (več v razdelku »Bolj natančno«).

## Rešeni primeri

### Primer 1 (lažji)

Nepolarizirana svetloba z gostoto toka $400\,\mathrm{W/m^2}$ vpada na dva idealna polarizatorja. Prepustni osi oklepata kot $30^\circ$. Kolikšna je gostota toka za drugim polarizatorjem? Kolikšna bi bila pri kotu $60^\circ$?

**Podatki:** $I_0 = 400\,\mathrm{W/m^2}$ (nepolarizirana), $\theta = 30^\circ$, nato $\theta' = 60^\circ$
**Iščemo:** $I_2$ in $I_2'$

:::formula
Prvi polarizator: $I_1 = I_0/2$. Drugi: $I_2 = I_1\cos^2\theta$.
:::

**Rešitev:**

1. Vpadna svetloba je nepolarizirana, zato kot pri prvem polarizatorju ne nastopa: $I_1 = 400/2\,\mathrm{W/m^2} = 200\,\mathrm{W/m^2}$.
2. Za prvim polarizatorjem je svetloba linearno polarizirana, zato za drugega velja Malusov zakon: $I_2 = 200\,\mathrm{W/m^2} \cdot \cos^2 30^\circ = 200 \cdot 0{,}75\,\mathrm{W/m^2} = 150\,\mathrm{W/m^2}$.
3. Pri $60^\circ$: $I_2' = 200 \cdot 0{,}25\,\mathrm{W/m^2} = 50\,\mathrm{W/m^2}$. Kot se je podvojil, prepuščena svetloba pa se je zmanjšala na tretjino, ker zakon ni linearen v kotu.
4. Odgovor: za parom je $150\,\mathrm{W/m^2}$, pri kotu $60^\circ$ pa $50\,\mathrm{W/m^2}$.

### Primer 2

Fotograf želi odstraniti odsev z vodne gladine ($n_v = 1{,}33$) in z izložbenega stekla ($n_s = 1{,}52$). Pod kolikšnim vpadnim kotom je odbita svetloba v obeh primerih v celoti polarizirana in kolikšen je tedaj lomni kot? Kako mora biti obrnjena prepustna os polarizacijskega filtra?

**Podatki:** $n_1 = 1{,}00$ (zrak), $n_v = 1{,}33$, $n_s = 1{,}52$
**Iščemo:** Brewstrova kota $\theta_B$, lomna kota $\theta_2$, smer prepustne osi

:::formula
$\tan\theta_B = \dfrac{n_2}{n_1}$, $\theta_2 = 90^\circ - \theta_B$
:::

**Rešitev:**

1. Voda: $\tan\theta_B = 1{,}33$, zato $\theta_B \approx 53{,}1^\circ$.
2. Odbiti in lomljeni žarek sta pri Brewstrovem kotu pravokotna, zato $\theta_2 = 90^\circ - 53{,}1^\circ = 36{,}9^\circ$. Preizkus z lomnim zakonom: $\sin 53{,}1^\circ/\sin 36{,}9^\circ \approx 0{,}800/0{,}600 \approx 1{,}33$. ✓
3. Steklo: $\tan\theta_B = 1{,}52$, zato $\theta_B \approx 56{,}7^\circ$ in $\theta_2 \approx 33{,}3^\circ$. Večji lomni količnik da večji Brewstrov kot.
4. Odbita svetloba je s-polarizirana (vzporedno z gladino oziroma steklom), zato mora biti prepustna os filtra pravokotna nanjo, torej v vpadni ravnini.
5. Odgovor: voda $\theta_B \approx 53{,}1^\circ$ ($\theta_2 \approx 36{,}9^\circ$), steklo $\theta_B \approx 56{,}7^\circ$ ($\theta_2 \approx 33{,}3^\circ$); prepustna os filtra mora ležati v vpadni ravnini, pri vodoravni gladini torej navpično.

### Primer 3 (težji)

Nepolarizirana svetloba z $I_0 = 600\,\mathrm{W/m^2}$ vpada na dva prekrižana idealna polarizatorja. (a) Med njiju vstaviš en polarizator, zasukan za kot $\theta$ glede na prvega. Za kateri $\theta$ je prepuščena gostota toka največja in koliko je? Koliko je pri $\theta = 30^\circ$? (b) Namesto enega vstaviš $N - 1$ polarizatorjev tako, da se smer osi od prvega do zadnjega spreminja v $N$ enakih korakih. Najmanj kolikšen mora biti $N$, da za zadnjim polarizatorjem dobiš vsaj $40\,\%$ vpadne gostote toka? Kam gre prepuščeni delež, ko $N$ zelo naraste?

**Podatki:** $I_0 = 600\,\mathrm{W/m^2}$ (nepolarizirana), prvi in zadnji polarizator pravokotna ($90^\circ$), polarizatorji idealni, cilj $I \ge 0{,}40\,I_0 = 240\,\mathrm{W/m^2}$
**Iščemo:** optimalni $\theta$ in $I_{max}$; $I(30^\circ)$; najmanjši $N$; meja za $N \to \infty$

:::formula
En vmesni: $I(\theta) = \dfrac{I_0}{2}\cos^2\theta\,\sin^2\theta = \dfrac{I_0}{8}\sin^2 2\theta$. $N$ korakov po $90^\circ/N$: $I_N = \dfrac{I_0}{2}\cos^{2N}\dfrac{90^\circ}{N}$.
:::

**Rešitev:**

1. Za prvim polarizatorjem je $I_0/2 = 300\,\mathrm{W/m^2}$. Vmesni je zasukan za $\theta$, zadnji je glede nanj zasukan za $90^\circ - \theta$, zato $I(\theta) = \tfrac{I_0}{2}\cos^2\theta\cos^2(90^\circ - \theta) = \tfrac{I_0}{2}\cos^2\theta\sin^2\theta$.
2. Z $\sin\theta\cos\theta = \tfrac12\sin 2\theta$ dobimo $I(\theta) = \tfrac{I_0}{8}\sin^2 2\theta$. Ta izraz je največji pri $\sin 2\theta = \pm 1$, torej pri $\theta = 45^\circ$ (ali $135^\circ$): $I_{max} = 600/8\,\mathrm{W/m^2} = 75\,\mathrm{W/m^2}$.
3. Pri $\theta = 30^\circ$: $\sin^2 60^\circ = 0{,}75$, zato $I = 75 \cdot 0{,}75\,\mathrm{W/m^2} \approx 56{,}3\,\mathrm{W/m^2}$, kar je opazno manj od optimuma.
4. Pri $N$ enakih korakih je vsak zasuk $90^\circ/N$; vsak od $N$ polarizatorjev za prvim prepusti delež $\cos^2(90^\circ/N)$, zato $I_N = \tfrac{I_0}{2}\cos^{2N}(90^\circ/N)$. Enaki koraki so optimalni, kar posplošuje rezultat iz (a).
5. Pogoj $I_N \ge 0{,}40\,I_0$ je $\cos^{2N}(90^\circ/N) \ge 0{,}80$. Za $N = 11$: $\cos^2(8{,}18^\circ) \approx 0{,}97975$ in $0{,}97975^{11} \approx 0{,}7985$, torej $I_{11} \approx 239{,}5\,\mathrm{W/m^2}$, malo premalo.
6. Za $N = 12$: $\cos^2 7{,}5^\circ \approx 0{,}98296$ in $0{,}98296^{12} \approx 0{,}8137$, torej $I_{12} \approx 244{,}1\,\mathrm{W/m^2}$. ✓
7. Za velike $N$ je $\cos^2 x \approx 1 - x^2$ (kot $x$ v radianih), zato $\cos^{2N}\tfrac{\pi}{2N} \approx \left(1 - \tfrac{\pi^2}{4N^2}\right)^N \approx 1 - \tfrac{\pi^2}{4N}$, kar gre proti $1$. Prepuščeni delež gre proti $\tfrac{I_0}{2}$: veriga idealnih polarizatorjev polarizacijo zavrti skoraj brez izgub.
8. Odgovor: en vmesni polarizator je najboljši pri $45^\circ$ in prepusti $75\,\mathrm{W/m^2}$ (pri $30^\circ$ le $56{,}3\,\mathrm{W/m^2}$); za vsaj $40\,\%$ potrebuješ $N = 12$ korakov, torej $11$ vmesnih polarizatorjev; pri $N \to \infty$ gre prepuščeno proti $300\,\mathrm{W/m^2}$.

### Primer 4 – zdaj ti

Svetlobo z neba merimo z detektorjem za polarizatorjem, ki ga vrtimo. Največja izmerjena gostota toka je $50\,\mathrm{W/m^2}$, najmanjša $20\,\mathrm{W/m^2}$. Svetlobo opiši kot zmes nepolarizirane ($I_n$) in linearno polarizirane ($I_p$). Kolikšna je stopnja polarizacije in kolikšna sta $I_n$ in $I_p$?

**Podatki:** $I_{max} = 50\,\mathrm{W/m^2}$, $I_{min} = 20\,\mathrm{W/m^2}$, polarizator idealen
**Iščemo:** $P$, $I_n$, $I_p$

:::formula
$P = \dfrac{I_{max} - I_{min}}{I_{max} + I_{min}}$, $I_{min} = \dfrac{I_n}{2}$, $I_{max} = \dfrac{I_n}{2} + I_p$
:::

**Rešitev:**

1. Nepolarizirani del vedno prepusti polovico, polarizirani pa od $0$ do vsega, odvisno od lege. Zato je $I_{min} = I_n/2$ in $I_{max} = I_n/2 + I_p$.
2. Stopnja polarizacije: $P = \dfrac{50 - 20}{50 + 20} = \dfrac{30}{70} \approx 0{,}43$.
3. Zdaj ti: iz zvez v koraku 1 izračunaj $I_n$ in $I_p$ ter preveri, da je $P = I_p/(I_n + I_p)$.

:::premisli
Kolikšna sta $I_n$ in $I_p$?
---
$I_n = 2I_{min} = 40\,\mathrm{W/m^2}$, $I_p = I_{max} - I_{min} = 30\,\mathrm{W/m^2}$. Skupna gostota toka je $70\,\mathrm{W/m^2} = I_{max} + I_{min}$, polarizirani del pa $30/70 \approx 0{,}43$ od nje, kar je ravno $P$.
:::

## Pogoste napake

- **Malusov zakon za nepolarizirano svetlobo.** »Nepolarizirana svetloba pade na polarizator pod $30^\circ$, torej $I = I_0\cos^2 30^\circ$.« Nepolarizirana svetloba nima smeri, od katere bi merili kot. Prvi polarizator vedno prepusti $I_0/2$; Malusov zakon velja šele za vsak naslednji.
- **$\cos\theta$ namesto $\cos^2\theta$.** Polarizator projicira amplitudo, gostota toka pa je sorazmerna s kvadratom amplitude. Pri $60^\circ$ prepusti $25\,\%$, ne $50\,\%$.
- **Vsak filter samo slabi, zato dodatni ne more pomagati.** Med prekrižanima polarizatorjema dodatni poševni polarizator poveča prepuščeno svetlobo z nič na do $I_0/8$, ker spremeni smer polarizacije.
- **Brewstrov kot iz $\sin\theta_B = n_2/n_1$.** Ta zveza spominja na mejni kot totalnega odboja. Pravilno je $\tan\theta_B = n_2/n_1$; za vodo $53{,}1^\circ$, ne $\sin^{-1}$ česar koli.
- **Pri Brewstrovem kotu se nič ne odbije.** Odbije se le p-komponenta ne; s-komponenta se odbije (pri steklu okoli $15\,\%$ njene gostote toka). Odbita svetloba je zato šibka, a v celoti polarizirana.

## Povzetek

- Polarizacija opisuje smer nihanja $\vec{E}$; ima jo le prečno valovanje.
- Idealen polarizator: nepolarizirana svetloba $\to I_0/2$; linearno polarizirana $\to I_0\cos^2\theta$ (Malusov zakon).
- Med prekrižanima polarizatorjema vmesni pod $45^\circ$ prepusti $I_0/8$; $N$ enakih korakov da $\tfrac{I_0}{2}\cos^{2N}(90^\circ/N) \to I_0/2$.
- Pri odboju pod Brewstrovim kotom, $\tan\theta_B = n_2/n_1$, je odbita svetloba povsem s-polarizirana, odbiti in lomljeni žarek sta pravokotna.
- Stopnja polarizacije $P = (I_{max} - I_{min})/(I_{max} + I_{min})$.
- Polarizirano svetlobo dajo tudi sipanje (nebo) in dvolomni kristali.

## Za izpit

Znati moraš povedati:

- definicije linearno polarizirane, nepolarizirane in delno polarizirane svetlobe ter stopnje polarizacije;
- Malusov zakon s pogoji (linearno polarizirana vpadna svetloba, idealen polarizator) in izpeljavo iz projekcije amplitude;
- zakaj idealen polarizator iz nepolarizirane svetlobe prepusti polovico (povprečje $\cos^2\theta$);
- Brewstrov zakon, dokaz iz pogoja $\theta_1 + \theta_2 = 90^\circ$ in lomnega zakona ter razlago z dipolnim sevanjem;
- Fresnelovi razmerji $r_s$ in $r_p$ ter kdaj je $r_p = 0$.

### Naloga 1

Pravi polarizatorji niso idealni: vsak prepusti le $90\,\%$ gostote toka komponente vzdolž prepustne osi (pravokotne komponente pa nič). Nepolarizirana svetloba vpada na verigo prekrižanih polarizatorjev, med katere vstaviš $N - 1$ vmesnih, tako da se smer osi spreminja v $N$ enakih korakih (skupaj je $N + 1$ polarizatorjev). Zapiši prepuščeni delež $I/I_0$ kot funkcijo $N$, utemelji, zakaj ima optimum, in poišči $N$, pri katerem je prepuščeni delež največji.

**Rešitev:**

1. Prvi polarizator prepusti $0{,}90 \cdot I_0/2$, vsak od preostalih $N$ pa delež $0{,}90\cos^2(90^\circ/N)$.
2. Zato $\dfrac{I}{I_0} = \dfrac12 \cdot 0{,}90^{N+1}\cos^{2N}\dfrac{90^\circ}{N}$.
3. Faktor $0{,}90^{N+1}$ z $N$ pada (izgube), faktor $\cos^{2N}(90^\circ/N)$ pa narašča proti $1$ (manjši zasuki). Produkt padajoče in naraščajoče funkcije ima vmes največjo vrednost.
4. Vrednosti: $N = 3$: $0{,}5 \cdot 0{,}6561 \cdot 0{,}4219 \approx 0{,}138$; $N = 4$: $0{,}5 \cdot 0{,}5905 \cdot 0{,}5308 \approx 0{,}157$; $N = 5$: $0{,}5 \cdot 0{,}5314 \cdot 0{,}6054 \approx 0{,}161$; $N = 6$: $0{,}5 \cdot 0{,}4783 \cdot 0{,}6597 \approx 0{,}158$.
5. Za $N \ge 6$ vrednosti padajo naprej (pri $N = 10$ le še $0{,}123$), ker izgube rastejo hitreje, kot se zmanjšujejo zasuki.
6. Odgovor: $I/I_0 = \tfrac12 \cdot 0{,}9^{N+1}\cos^{2N}(90^\circ/N)$; največ, okoli $16{,}1\,\%$, prepusti veriga s $N = 5$ koraki po $18^\circ$, torej s štirimi vmesnimi polarizatorji. Z idealnimi bi bilo $30{,}3\,\%$.

### Naloga 2

Natančno navedi in izpelji Malusov zakon. Nato dokaži Brewstrov zakon $\tan\theta_B = n_2/n_1$ in pokaži, da sta pri tem kotu odbiti in lomljeni žarek pravokotna. Utemelji, ali obstaja Brewstrov kot za mejo voda–steklo ($n_1 = 1{,}33$, $n_2 = 1{,}52$), in ga izračunaj.

**Rešitev:**

1. Malusov zakon: za linearno polarizirano svetlobo z gostoto toka $I_0$, katere smer polarizacije oklepa kot $\theta$ s prepustno osjo idealnega polarizatorja, je $I = I_0\cos^2\theta$. Izpeljava: prepuščena je komponenta $E_0\cos\theta$, $I \propto E^2$.
2. Brewster: $r_p = \tan(\theta_1 - \theta_2)/\tan(\theta_1 + \theta_2)$ je nič, ko je $\theta_1 + \theta_2 = 90^\circ$ (in $\theta_1 \ne \theta_2$, torej $n_1 \ne n_2$).
3. Lomni zakon z $\sin\theta_2 = \sin(90^\circ - \theta_1) = \cos\theta_1$ da $n_1\sin\theta_B = n_2\cos\theta_B$, torej $\tan\theta_B = n_2/n_1$.
4. Pravokotnost: odbiti žarek oklepa z mejno ploskvijo kot $90^\circ - \theta_B$, lomljeni (na drugi strani pravokotnice) kot $90^\circ - \theta_2$. Kot med žarkoma je zato $180^\circ - (90^\circ - \theta_B) - (90^\circ - \theta_2) = \theta_B + \theta_2 = 90^\circ$.
5. Voda–steklo: $\tan\theta_B = 1{,}52/1{,}33 \approx 1{,}143$, zato $\theta_B \approx 48{,}8^\circ$. Kot obstaja za vsak par $n_1 \ne n_2$, saj $\tan$ zavzame vse pozitivne vrednosti; ker je $n_2 > n_1$, totalnega odboja ni.
6. Odgovor: $\theta_B \approx 48{,}8^\circ$; pri tem kotu je od vode na steklo odbita svetloba povsem s-polarizirana.

### Naloga 3

Nepolarizirana svetloba vpada pod Brewstrovim kotom na kup tankih steklenih ploščic ($n = 1{,}50$) v zraku. Večkratne odboje zanemari in absorpcije ni. (a) Kolikšen je delež s-komponente, ki se odbije na eni površini? (b) Kolikšna je stopnja polarizacije prepuščene svetlobe za eno ploščico? (c) Najmanj koliko ploščic potrebuješ, da je stopnja polarizacije prepuščene svetlobe vsaj $0{,}50$?

**Rešitev:**

1. $\theta_B = \arctan 1{,}50 \approx 56{,}31^\circ$, $\theta_2 = 90^\circ - \theta_B \approx 33{,}69^\circ$, zato $\theta_B - \theta_2 \approx 22{,}62^\circ$ in $\theta_B + \theta_2 = 90^\circ$.
2. $r_s = -\sin 22{,}62^\circ/\sin 90^\circ \approx -0{,}3846$, $R_s = r_s^2 \approx 0{,}148$. Prepušča se $T_s = 1 - R_s \approx 0{,}852$ s-komponente, p-komponenta pa v celoti.
3. V steklu žarek zadene drugo površino pod kotom $\theta_2$, ki je Brewstrov kot za mejo steklo–zrak ($\tan\theta_2 = 1/n$), zato tam spet velja $R_p = 0$ in enak $R_s$. Ena ploščica ima dve površini.
4. Vpadna svetloba ima pol s in pol p. Za $k$ ploščicami: $I_p = \tfrac12 I_0$, $I_s = \tfrac12 I_0 T_s^{2k}$, zato $P = \dfrac{1 - T_s^{2k}}{1 + T_s^{2k}}$.
5. (b) $k = 1$: $T_s^2 \approx 0{,}726$, $P \approx 0{,}274/1{,}726 \approx 0{,}159$.
6. (c) $P \ge 0{,}50$ pomeni $T_s^{2k} \le \tfrac13$, torej $2k \ge \dfrac{\ln 3}{-\ln 0{,}852} \approx 6{,}86$, $k \ge 3{,}43$. Preizkus: $k = 3$ da $P \approx 0{,}446$, $k = 4$ pa $P \approx 0{,}565$.
7. Odgovor: na eni površini se odbije $14{,}8\,\%$ s-komponente; ena ploščica da $P \approx 0{,}16$; za $P \ge 0{,}50$ potrebuješ $4$ ploščice.

## Drugače: Na sliki

Pogled vzdolž žarka (žarek gre iz zaslona proti tebi):

```
 vpadna  za 1.  za 2.  za 3.
  \|/      |      /     ---
 --*--     |     /
  /|\      |    /
  I0     I0/2   I0/4   I0/8
```

Osi polarizatorjev: prvi navpično, drugi pod $45^\circ$, tretji vodoravno. Črta kaže smer $\vec{E}$ za vsakim.

Vsak polarizator iz puščice $\vec{E}$ obdrži le senco na svojo os. Senca puščice dolžine $1$ na os, zasukano za $45^\circ$, je dolga $\cos 45^\circ \approx 0{,}71$, gostota toka pa sledi kvadratu: $0{,}5$. Dvakrat po $45^\circ$ da $\tfrac12 \cdot \tfrac12 \cdot \tfrac12 = \tfrac18$. Naravnost za $90^\circ$ pa je senca nič.

Odboj pod Brewstrovim kotom v vpadni ravnini:

```
 vpadni   |   odbiti (le s)
    \  B  |  B  /
      \   |   /
        \ | /
 ---------*--------- gladina
          |\
          | \  lomljeni
          |  \ (pravokotno
          |   \ na odbitega)
```

Navpična črta je vpadna pravokotnica, $B$ je Brewstrov kot. Lomljeni žarek je bližje pravokotnici ($\theta_2 = 90^\circ - \theta_B$).

## Drugače: Uporaba v stroki

**Zasloni LCD.** Vsak slikovni element je tekoči kristal med prekrižanima polarizatorjema. Brez napetosti zasukane molekule zavrtijo polarizacijo za $90^\circ$ in svetloba gre skozi; z napetostjo se molekule poravnajo, zasuka ni in element je temen. Zato zaslon prenosnika skozi polarizacijska očala pri neki legi glave potemni.

**Fotoelastičnost.** Prozorni model strojnega dela (na primer iz epoksida) pod obremenitvijo postane dvolomen; med prekrižanima polarizatorjema se pokažejo barvni pasovi, ki se zgostijo tam, kjer se napetost hitro spreminja (koncentracije napetosti ob luknjah in zarezah). Inženirji tako najdejo kritična mesta pred izdelavo kovinskega dela.

**Optična aktivnost in saharimetrija.** Raztopine kiralnih molekul (sladkor) zavrtijo ravnino polarizacije za kot, sorazmeren s koncentracijo in dolžino kivete. V živilski in farmacevtski industriji iz zasuka med polarizatorjema določijo koncentracijo.

**Laserji in Brewstrova okna.** Okna plinskih laserjev so nagnjena pod Brewstrovim kotom: p-svetloba gre skozi brez odbojnih izgub, s-svetloba se na vsakem prehodu delno odbije iz resonatorja. Laser zato seva linearno polarizirano svetlobo.

## Drugače: Bolj natančno

**Splošna (eliptična) polarizacija.** Za val, ki se širi v smeri $z$, je $\vec{E} = (E_x\cos(\omega t - kz), E_y\cos(\omega t - kz + \delta))$. Pri $\delta = 0$ ali $\pi$ je svetloba linearno polarizirana, pri $E_x = E_y$ in $\delta = \pm\pi/2$ krožno, sicer eliptično. Krožno polarizirana svetloba za katerim koli linearnim polarizatorjem da $I_0/2$, tako kot nepolarizirana; ločiš ju šele s četrtvalno ploščico.

**Valovne ploščice.** Dvolomna ploščica debeline $d$ ima za polarizaciji vzdolž hitre in počasne osi lomna količnika $n_o$ in $n_e$, zato med njima nastane fazna razlika $\delta = \tfrac{2\pi}{\lambda}|n_e - n_o|d$. Četrtvalna ploščica ($\delta = \pi/2$), na katero pade linearno polarizirana svetloba pod $45^\circ$ glede na os, da krožno polarizirano svetlobo.

**Jonesovi vektorji.** Polarizacijo zapišemo kot stolpec $(E_x, E_y)$ s kompleksnimi komponentami, vsak element (polarizator, ploščica) pa kot matriko $2 \times 2$. Veriga elementov je produkt matrik; Malusov zakon in rezultat Primera 3 sta posebna primera.

## Preveri se

? Katera trditev o polarizaciji je pravilna?
- Polarizirati je mogoče tudi zvok v zraku.
~ Zvok v plinu je vzdolžno valovanje; nima pravokotne smeri nihanja, ki bi jo lahko izbrali.
+ Idealen polarizator iz nepolarizirane svetlobe prepusti polovico gostote toka, ne glede na svojo lego.
- Pri Brewstrovem kotu se svetloba sploh ne odbije.
~ Ne odbije se le p-komponenta; s-komponenta se odbije, zato je odbita svetloba polarizirana.
> Smeri $\vec{E}$ v nepolarizirani svetlobi so naključne, povprečje $\cos^2\theta$ je $\tfrac12$, zato polarizator v vsaki legi prepusti $I_0/2$.

? Nepolarizirana svetloba z gostoto toka $120\,\mathrm{W/m^2}$ gre skozi dva idealna polarizatorja, katerih osi oklepata $60^\circ$. Kolikšna je gostota toka za drugim?
- $30\,\mathrm{W/m^2}$
~ Pozabil si, da prvi polarizator iz nepolarizirane svetlobe prepusti le polovico: $120 \cdot \cos^2 60^\circ = 30$.
+ $15\,\mathrm{W/m^2}$
- $45\,\mathrm{W/m^2}$
~ Vzel si kot med osjo in pravokotnico, $\cos^2 30^\circ = 0{,}75$. Kot v Malusovem zakonu je kot med obema prepustnima osema, $60^\circ$.
> Prvi prepusti $60\,\mathrm{W/m^2}$, drugi $60 \cdot \cos^2 60^\circ = 60 \cdot 0{,}25 = 15\,\mathrm{W/m^2}$.

? Študent računa Brewstrov kot za steklo z $n = 1{,}50$: »1. Pogoj je $\sin\theta_B = 1/n$. 2. $\sin\theta_B = 0{,}667$. 3. $\theta_B = 41{,}8^\circ$.« Kje je napaka?
- V koraku 3: $\arcsin 0{,}667$ je $48{,}2^\circ$.
~ $\arcsin 0{,}667$ je res $41{,}8^\circ$; računanje je pravilno, napačna je že zveza.
+ V koraku 1: pravilno je $\tan\theta_B = n$, torej $\theta_B \approx 56{,}3^\circ$.
- Napake ni; to je Brewstrov kot pri izhodu iz stekla.
~ $41{,}8^\circ$ je mejni kot totalnega odboja pri izhodu iz stekla. Brewstrov kot za izhod je $\arctan(1/1{,}5) \approx 33{,}7^\circ$.
> Pri Brewstrovem kotu sta odbiti in lomljeni žarek pravokotna, kar z lomnim zakonom da $\tan\theta_B = n_2/n_1 = 1{,}50$ in $\theta_B \approx 56{,}3^\circ$. Zveza s sinusom je mejni kot totalnega odboja.

? Med prekrižana polarizatorja vstaviš (A) en polarizator pod $45^\circ$ ali (B) dva pod $30^\circ$ in $60^\circ$. Vsi so idealni. Kaj velja za prepuščeno svetlobo?
- A prepusti več, ker je v njem manj filtrov.
~ Pri idealnih polarizatorjih število filtrov ne prinaša izgub; šteje le velikost zasukov.
+ B prepusti več: $\tfrac12\cos^6 30^\circ \approx 0{,}21\,I_0$ proti $\tfrac18 I_0 = 0{,}125\,I_0$.
- Obe ureditvi prepustita enako, ker je skupni zasuk v obeh $90^\circ$.
~ Prepuščeni delež ni odvisen le od skupnega zasuka: več manjših korakov izgubi manj, ker je $\cos^2$ blizu $1$ pri majhnih kotih.
> Trije koraki po $30^\circ$: $\tfrac12(\cos^2 30^\circ)^3 = \tfrac12 \cdot 0{,}75^3 \approx 0{,}211$; dva koraka po $45^\circ$: $\tfrac12 \cdot 0{,}5^2 = 0{,}125$.

? Ribič na morju nosi polarizacijska očala. Zakaj ima njihova prepustna os navpično smer?
- Ker je sončna svetloba navpično polarizirana.
~ Neposredna sončna svetloba je nepolarizirana; polarizira se šele pri odboju ali sipanju.
- Ker navpični polarizator prepusti več vse svetlobe.
~ Za nepolarizirano svetlobo prepusti vsaka lega polovico. Navpična smer je izbrana zaradi odbite svetlobe.
+ Ker je svetloba, odbita od vodoravne gladine, pretežno vodoravno (s) polarizirana in jo navpični polarizator zaduši.
> Pri odboju se s-komponenta (vzporedna z gladino) odbije močneje; blizu Brewstrovega kota je odbita svetloba skoraj povsem vodoravno polarizirana. Navpična os jo zaduši, ribič pa vidi pod gladino.

:::simboli
\vec{E} | električna poljska jakost | | V/m | njena smer je smer polarizacije
E_0 | amplituda električnega polja | | V/m
I | gostota svetlobnega toka za polarizatorjem | | W/m^2 | sorazmerna z $E_0^2$
I_0 | vpadna gostota svetlobnega toka | | W/m^2
I_1, I_2 | gostota toka za prvim in drugim polarizatorjem | | W/m^2
I_2' | gostota toka za drugim polarizatorjem pri kotu $60^\circ$ | | W/m^2
I_N | gostota toka za verigo z $N$ koraki | I_N = \frac{I_0}{2}\cos^{2N}\frac{90^\circ}{N} | W/m^2
I_{max}, I_{min} | največja in najmanjša gostota toka za vrtečim se polarizatorjem | | W/m^2
I_n | nepolarizirani del gostote toka | I_n = 2I_{min} | W/m^2
I_p | linearno polarizirani del gostote toka | I_p = I_{max} - I_{min} | W/m^2
P | stopnja polarizacije | P = \frac{I_{max} - I_{min}}{I_{max} + I_{min}} | – | od $0$ do $1$
\theta | kot med smerjo polarizacije in prepustno osjo | | ° | v Primeru 3 kot vmesnega polarizatorja
\theta' | drugi kot med osema v Primeru 1 | | °
N | število enakih korakov zasuka | | –
\theta_1 | vpadni kot | | ° | merjen od vpadne pravokotnice
\theta_2 | lomni kot | | ° | $n_1\sin\theta_1 = n_2\sin\theta_2$
\theta_B | Brewstrov kot | \tan\theta_B = \frac{n_2}{n_1} | °
n_1 | lomni količnik snovi, iz katere svetloba vpada | | –
n_2 | lomni količnik snovi, na katero svetloba vpada | | –
n_v | lomni količnik vode | | –
n_s | lomni količnik stekla | | –
r_s | razmerje amplitud odbite in vpadne s-komponente | r_s = -\frac{\sin(\theta_1 - \theta_2)}{\sin(\theta_1 + \theta_2)} | –
r_p | razmerje amplitud odbite in vpadne p-komponente | r_p = \frac{\tan(\theta_1 - \theta_2)}{\tan(\theta_1 + \theta_2)} | – | pri Brewstrovem kotu nič
R_s, R_p | odbojnost za s- in p-komponento | R_s = r_s^2 | –
:::
