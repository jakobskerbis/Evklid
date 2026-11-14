---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Preden bereš naprej, napovej. Na kljuko obesiš utež na tanki jekleni žici, na drugo kljuko enako utež na gumijastem traku. Oboje nekaj časa grejemo s sušilnikom za lase. Žica se podaljša, kot pričakuješ: kovine se pri segrevanju raztezajo. Kaj naredi raztegnjen gumijast trak? Večina ugane, da se podaljša še bolj, saj je guma »mehka«. V resnici se **skrči** in utež dvigne.

Če želiš, poskusi sam: raztegnjen trak prisloni na ustnice, da začutiš, kako se segreje, nato ga hitro spusti in začutiš, da se ohladi. Nobeno pravilo, ki si se ga naučil pri kovinah, tega ne pojasni. Pojasni ga zgradba **polimerov**: dolgih verižnih molekul, ki imajo s kovinskim kristalom le malo skupnega. Iz polimerov so cevi za plin in vodo, embalaža, izolacija kablov, tesnila, ohišja, lopatice vetrnic in podplati. Inženir, ki zanje uporablja pravila za jeklo, bo zgrešil trdnost, togost in temperaturo uporabe.

## Razlaga

### Kovina in polimer drug ob drugem

Pri kovinah poznaš kristalno mrežo, dislokacije, natezni preizkus in fazne diagrame. Polimer je drugačen že v osnovni gradnji:

- **gradnik:** kovina atom, polimer dolga veriga (makromolekula);
- **vez v gradniku:** kovina kovinska, polimer kovalentna vzdolž verige;
- **vez med gradniki:** kovina ista kovinska vez, polimer šibke sile in prepletanje;
- **urejenost:** kovina kristal, polimer amorfen ali delno kristaliničen;
- **modul $E$:** kovina $45$ do $400\,\mathrm{GPa}$, polimer $0{,}001$ do $4\,\mathrm{GPa}$;
- **gostota:** kovina $1{,}7$ do $20\,\mathrm{g/cm^3}$, polimer $0{,}9$ do $2{,}2\,\mathrm{g/cm^3}$.

Vse razlike v lastnostih izhajajo iz ene: vzdolž verige so atomi povezani z močnimi kovalentnimi vezmi, sosednje verige pa držijo skupaj le van der Waalsove sile, ponekod vodikove vezi, in to, da so verige prepletene kot špageti v loncu.

### Zgradba verige

**Definicija.** **Polimer** je snov iz makromolekul, sestavljenih iz velikega števila ponavljajočih se enot, ki izvirajo iz majhnih molekul, **monomerov**. **Ponavljajoča enota** je najmanjši del, iz katerega z nizanjem dobimo verigo: pri polietilenu je to $-\mathrm{CH_2{-}CH_2}-$ iz etena, pri PVC $-\mathrm{CH_2{-}CHCl}-$.

**Definicija.** **Stopnja polimerizacije** $n$ je število ponavljajočih se enot v verigi. Ker so verige različno dolge, je povprečna stopnja polimerizacije

$$n = \frac{M_n}{M_0},$$

kjer je $M_0$ molska masa ponavljajoče enote, $M_n$ pa številsko povprečje molske mase.

**Definicija.** Vzorec naj vsebuje $N_i$ verig z molsko maso $M_i$; delež verig je $x_i = N_i/\sum N_j$, masni delež pa $w_i = N_iM_i/\sum N_jM_j$. **Številsko povprečje** in **masno povprečje** molske mase sta

$$M_n = \sum_i x_iM_i, \qquad M_w = \sum_i w_iM_i.$$

**Indeks polidisperznosti** je $\mathrm{PDI} = M_w/M_n$. $M_n$ je občutljiv na kratke verige (vsaka šteje enako), $M_w$ na dolge (težke verige imajo večjo težo v povprečju). Lastnosti, kot sta viskoznost taline in žilavost, sledijo bolj $M_w$.

**Izrek.** Za vsak vzorec je $M_w \ge M_n$; enakost velja natanko tedaj, ko imajo vse verige enako molsko maso.

**Dokaz.** Iz definicij je $M_w = \dfrac{\sum N_iM_i^2}{\sum N_iM_i} = \dfrac{\sum x_iM_i^2}{M_n}$. Varianca porazdelitve števila verig je $s^2 = \sum x_i(M_i - M_n)^2 = \sum x_iM_i^2 - M_n^2 \ge 0$. Torej je $M_wM_n = M_n^2 + s^2 \ge M_n^2$ in $M_w = M_n + s^2/M_n \ge M_n$. Enakost velja le pri $s^2 = 0$, ko so vse $M_i$ enake. ∎

Industrijski polimeri imajo $\mathrm{PDI}$ od okoli $2$ (stopenjska polimerizacija pri visoki pretvorbi, npr. PET in poliamidi) do $10$ ali več (nekateri polietileni); vrednosti blizu $1$ dajo le posebni postopki, kot je živa anionska polimerizacija.

**Oblika verige** (od preprostega do zapletenega):

- **linearne** verige se lahko tesno zložijo, kar omogoča kristalizacijo (polietilen visoke gostote, PE-HD);
- **razvejene** verige s stranskimi vejami se slabše zložijo, zato je gostota manjša (polietilen nizke gostote, PE-LD);
- **zamrežene** verige so ponekod med seboj povezane s kovalentnimi vezmi (vulkanizirana guma);
- **mrežasti** polimeri so gosta tridimenzionalna mreža kovalentnih vezi (epoksidna smola).

Pri monomerih z različnimi stranskimi skupinami (propen, stiren) je pomembna še **taktičnost**: pri **izotaktni** zgradbi so vse skupine na isti strani verige, pri **sindiotaktni** izmenično, pri **ataktni** naključno. Pravilne verige (izotaktni polipropilen) kristalizirajo, ataktni polistiren pa je amorfen in zato prozoren. **Kopolimeri** iz dveh vrst enot so lahko statistični, izmenični, blokovni (termoplastični elastomeri) ali cepljeni (udarno odporni ABS).

### Kristaliničnost

Kovina je v trdnem stanju praktično v celoti kristalna. Polimer tega ne zmore: dolga prepletena veriga se ne more vsa zložiti v red. Polimeri so zato **amorfni** ali **delno kristalinični**. V delno kristaliničnih se verige ponekod zložijo sem in tja v tanke ploščice, **lamele** (debele okoli $10\,\mathrm{nm}$), med katerimi ostanejo amorfna področja; lamele rastejo radialno iz jeder v kroglaste **sferolite**.

Kristalno področje je gostejše od amorfnega. Zato iz izmerjene gostote $\rho$ vzorca izračunamo masni delež kristalne faze, **stopnjo kristaliničnosti**:

$$\chi = \frac{\rho_c\,(\rho - \rho_a)}{\rho\,(\rho_c - \rho_a)}.$$

**Izpeljava.** V masi $m$ je masa $\chi m$ kristalna in $(1-\chi)m$ amorfna. Prostornini se seštejeta: $\dfrac{m}{\rho} = \dfrac{\chi m}{\rho_c} + \dfrac{(1-\chi)m}{\rho_a}$. Delimo z $m$ in izrazimo $\chi$: $\chi\left(\dfrac{1}{\rho_a} - \dfrac{1}{\rho_c}\right) = \dfrac{1}{\rho_a} - \dfrac{1}{\rho}$, kar po množenju z $\rho\rho_a\rho_c$ da zgornjo formulo.

Kristaliničnost poveča gostoto, togost, trdnost, kemijsko odpornost in tališče, zmanjša pa prozornost (sferoliti sipajo svetlobo) in žilavost. Večja je pri linearnih, pravilnih verigah, pri počasnem ohlajanju in pri raztezanju, ki verige uredi.

:::premisli
Plastenka iz PET je prozorna, posoda za pečico iz istega PET pa motna bela. Kateri od njiju je bil po oblikovanju ohlajen hitreje in zakaj?
---
Plastenka. Pri hitrem ohlajanju verige nimajo časa, da bi se zložile, zato ostanejo večinoma amorfne in prozorne. Posoda za pečico je namerno kristalizirana (počasno ohlajanje oziroma toplotna obdelava): sferoliti sipajo svetlobo, zato je motna, a zdrži višjo temperaturo.
:::

### Temperatura: tališče in steklasti prehod

Čista kovina se pri segrevanju stali pri eni sami temperaturi. Pri polimerih sta pomembni dve:

**Definicija.** **Temperatura steklastega prehoda** $T_g$ je temperatura, pod katero so segmenti verig v amorfnih področjih zamrznjeni (polimer je trd in krhek kot steklo), nad njo pa se lahko segmenti vrtijo okoli vezi (polimer je usnjat ali gumijast). Pri $T_g$ se skokovito spremenita toplotna kapaciteta in temperaturni razteznostni koeficient, modul pa pade za okoli tri velikostne rede. **Tališče** $T_m$ je temperatura, pri kateri se stalijo kristalna področja; amorfni polimer ga nima.

Pri mnogih polimerih je $T_g$ (v kelvinih) med polovico in dvema tretjinama $T_m$. Primeri: PE $T_g \approx -120\,^\circ\mathrm{C}$, $T_m \approx 135\,^\circ\mathrm{C}$; PP $-10$ in $165\,^\circ\mathrm{C}$; PET $75$ in $255\,^\circ\mathrm{C}$; PS (ataktni) $T_g \approx 100\,^\circ\mathrm{C}$ brez tališča; PVC $T_g \approx 80\,^\circ\mathrm{C}$. PE je pri sobni temperaturi nad $T_g$, zato je žilav in upogljiv; PS je pod $T_g$, zato je trd in krhek kot lonček za jogurt.

Modul amorfnega polimera pri segrevanju gre skozi štiri stopnje: steklasto (okoli $3\,\mathrm{GPa}$), prehodno usnjato pri $T_g$, gumijasti plato (okoli $1\,\mathrm{MPa}$) in viskozni tok. Zamreženje odstrani tok: guma ostane na gumijastem platoju, dokler se ne razkroji.

### Termoplasti, duromeri, elastomeri

**Termoplasti** so iz linearnih ali razvejenih verig brez kovalentnih vezi med njimi. Pri segrevanju šibke sile med verigami popustijo in snov se zmehča oziroma stali, pri ohlajanju se strdi; postopek je ponovljiv. Predelujemo jih z **brizganjem** v kalup, **ekstrudiranjem** (cevi, folije, profili) in **pihanjem** (plastenke), odpadke pa recikliramo s taljenjem. Primeri: PE, PP, PVC, PS, PET, poliamidi (PA), polikarbonat (PC).

**Duromeri** (termoreaktivne smole) so gosto zamrežene mreže. Mrežo ustvari kemijska reakcija (utrjevanje) med oblikovanjem, pogosto ob segrevanju ali z dodatkom utrjevalca. Pri ponovnem segrevanju se ne zmehčajo, ampak se pri visoki temperaturi razkrojijo, ker bi se morale pretrgati kovalentne vezi. So togi, dimenzijsko stabilni in toplotno odpornejši, a krhki in jih ne moremo pretaliti. Primeri: epoksidne smole, fenol-formaldehidne (bakelit), melaminske, nenasičeni poliestri.

**Elastomeri** so redko zamreženi polimeri nad $T_g$. Verige med vozlišči so dolge in gibljive, zato se snov reverzibilno raztegne za več sto odstotkov, vozlišča pa preprečijo trajno drsenje verig. Primeri: naravna guma (vulkanizirana z žveplom), SBR v pnevmatikah, silikoni, EPDM. **Termoplastični elastomeri** namesto kovalentnih vozlišč uporabljajo trde bloke kopolimera, ki se ob segrevanju stalijo, zato jih lahko brizgamo kot termoplaste.

### Mehanske lastnosti

Natezni preizkus poznaš pri kovinah. Pri polimerih isti preizkus pokaže tri tipe krivulj:

- **krhki** (PS, duromeri pod $T_g$): skoraj linearno do loma pri nekaj odstotkih raztezka;
- **duktilni termoplasti** (PE, PP, PA): meja tečenja, nato **vrat**, ki se razširi po vsej preizkušanki (**hladno vlečenje**); verige se v vratu uredijo vzdolž smeri vleka in material se utrdi, raztezek je lahko več sto odstotkov;
- **elastomeri**: nizek modul, velik povraten raztezek, brez izrazite meje tečenja.

Odločilna razlika od kovin: lastnosti polimerov so močno odvisne od **temperature** in **hitrosti** obremenitve. Polimer je **viskoelastičen**: pri stalni obremenitvi se počasi deformira naprej (**lezenje**), pri stalni deformaciji napetost počasi pada (**relaksacija**). Pri jeklu je lezenje pomembno šele nad nekaj sto stopinjami, pri plastični cevi pa že pri sobni temperaturi. Zato plastične tlačne cevi dimenzioniramo na trdnost po $50$ letih, ne na kratkotrajno natezno trdnost.

**Entropijska elastičnost.** Raztezanje jekla razmika atome iz ravnovesnih leg in povečuje notranjo energijo. Raztezanje gume pa verige le zravna: zvita veriga ima neprimerno več možnih oblik kot zravnana, zato ima večjo entropijo. Sila, ki vleče trak nazaj, je posledica težnje k večji entropiji, ne energije vezi. Za idealni zamreženi elastomer teorija gumijaste elastičnosti da strižni modul

$$G = \frac{\rho RT}{M_c},$$

kjer je $M_c$ povprečna molska masa verige med dvema vozliščema; pri majhnih deformacijah je $E = 3G$. Pri raztezku $\lambda = L/L_0$ je napetost glede na začetni presek $\sigma = G\,(\lambda - 1/\lambda^2)$.

:::premisli
Iz enačbe za $G$ razloži uganko iz uvoda: zakaj se raztegnjen gumijast trak pri segrevanju skrči?
---
$G$ je sorazmeren s temperaturo $T$. Ko trak segrejemo, se sila pri isti dolžini poveča; ker utež ostane enaka, se trak skrči, dokler se sila ne izenači s težo. Toplotno gibanje verige bolj zvija in povečuje njihovo entropijo. Pri jeklu ni tega učinka, ker je njegova elastičnost energijska.
:::

**Druge lastnosti.** Polimeri so dobri električni in toplotni izolatorji (toplotna prevodnost okoli $0{,}2\,\mathrm{W/(m\,K)}$), imajo okoli desetkrat večji temperaturni raztezek od jekla, so kemijsko odporni, a jih razgrajujejo UV svetloba, kisik pri povišani temperaturi in nekatera topila; večina gori. Lastnosti prilagodimo z **dodatki**: mehčala (PVC za kable), stabilizatorji proti UV, polnila in vlakna (steklena vlakna v PA).

## Rešeni primeri

### Primer 1 (lažji)

Proizvajalec cevi kupuje polietilen s številskim povprečjem molske mase $140\,000\,\mathrm{g/mol}$. Kolikšna je povprečna stopnja polimerizacije? Koliko ponavljajočih se enot ima povprečna veriga PVC z $M_n = 100\,000\,\mathrm{g/mol}$? Molske mase: $\mathrm{C}$ $12{,}011\,\mathrm{g/mol}$; $\mathrm{H}$ $1{,}008\,\mathrm{g/mol}$; $\mathrm{Cl}$ $35{,}45\,\mathrm{g/mol}$.

**Podatki:** $M_n(\mathrm{PE}) = 140\,000\,\mathrm{g/mol}$, $M_n(\mathrm{PVC}) = 100\,000\,\mathrm{g/mol}$, ponavljajoči se enoti $\mathrm{C_2H_4}$ in $\mathrm{C_2H_3Cl}$, $M(\mathrm{C}) = 12{,}011\,\mathrm{g/mol}$, $M(\mathrm{H}) = 1{,}008\,\mathrm{g/mol}$, $M(\mathrm{Cl}) = 35{,}45\,\mathrm{g/mol}$
**Iščemo:** stopnji polimerizacije $n_\mathrm{PE}$ in $n_\mathrm{PVC}$

:::formula
$n = \dfrac{M_n}{M_0}$
:::

**Rešitev:**

1. Ponavljajoča enota PE je $\mathrm{C_2H_4}$: $M_0 = 2 \cdot 12{,}011 + 4 \cdot 1{,}008 = 28{,}054\,\mathrm{g/mol}$.
2. $n_\mathrm{PE} = 140\,000/28{,}054 \approx 4990$.
3. Enota PVC je $\mathrm{C_2H_3Cl}$: $M_0 = 2 \cdot 12{,}011 + 3 \cdot 1{,}008 + 35{,}45 = 62{,}496\,\mathrm{g/mol}$.
4. $n_\mathrm{PVC} = 100\,000/62{,}496 \approx 1600$.
5. Odgovor: povprečna veriga PE ima okoli $5000$ enot (okoli $10\,000$ ogljikovih atomov), veriga PVC okoli $1600$ enot. Ker je enota PVC težja, ima pri podobni molski masi manj enot.

### Primer 2

Iz reaktorja vzamemo vzorec PE in ga s kromatografijo razdelimo na tri frakcije: $30\,\mathrm{g}$ z $M = 20\,000\,\mathrm{g/mol}$, $50\,\mathrm{g}$ z $M = 50\,000\,\mathrm{g/mol}$ in $20\,\mathrm{g}$ z $M = 100\,000\,\mathrm{g/mol}$. Izračunaj $M_n$, $M_w$ in $\mathrm{PDI}$.

**Podatki:** $m_1 = 30\,\mathrm{g}$, $M_1 = 20\,000\,\mathrm{g/mol}$; $m_2 = 50\,\mathrm{g}$, $M_2 = 50\,000\,\mathrm{g/mol}$; $m_3 = 20\,\mathrm{g}$, $M_3 = 100\,000\,\mathrm{g/mol}$
**Iščemo:** $M_n$, $M_w$, $\mathrm{PDI}$

:::formula
$n_i = \dfrac{m_i}{M_i}$, $M_n = \dfrac{\sum m_i}{\sum n_i}$, $M_w = \dfrac{\sum m_iM_i}{\sum m_i}$, $\mathrm{PDI} = \dfrac{M_w}{M_n}$
:::

**Rešitev:**

1. Podane so mase frakcij, zato za $M_n$ najprej izračunamo množine verig: $n_1 = 30/20\,000\,\mathrm{mol} = 0{,}0015\,\mathrm{mol}$, $n_2 = 50/50\,000\,\mathrm{mol} = 0{,}0010\,\mathrm{mol}$, $n_3 = 20/100\,000\,\mathrm{mol} = 0{,}0002\,\mathrm{mol}$.
2. Skupaj $0{,}0027\,\mathrm{mol}$ verig v $100\,\mathrm{g}$: $M_n = 100/0{,}0027\,\mathrm{g/mol} \approx 37\,000\,\mathrm{g/mol}$.
3. Masni deleži so $0{,}30$; $0{,}50$ in $0{,}20$: $M_w = 0{,}30 \cdot 20\,000 + 0{,}50 \cdot 50\,000 + 0{,}20 \cdot 100\,000 = 51\,000\,\mathrm{g/mol}$.
4. $\mathrm{PDI} = 51\,000/37\,037 \approx 1{,}38$.
5. Odgovor: $M_n \approx 37\,000\,\mathrm{g/mol}$, $M_w = 51\,000\,\mathrm{g/mol}$, $\mathrm{PDI} \approx 1{,}38$. Številsko povprečje je nižje, ker je med verigami več kot polovica najkrajših (delež verig prve frakcije je $0{,}0015/0{,}0027 \approx 0{,}56$).

### Primer 3 (težji)

Tovarna ekstrudira tlačne cevi iz PE-HD z zunanjim premerom $110\,\mathrm{mm}$ in debelino stene $10\,\mathrm{mm}$. Izmerjena gostota vzorca je $0{,}955\,\mathrm{g/cm^3}$. Gostota povsem kristalnega PE je $1{,}00\,\mathrm{g/cm^3}$, amorfnega $0{,}855\,\mathrm{g/cm^3}$.
a) Izračunaj stopnjo kristaliničnosti in maso kristalne faze v metru cevi.
b) Po toplotni obdelavi (počasnem ohlajanju) se gostota poveča na $0{,}965\,\mathrm{g/cm^3}$. Kolikšna je nova kristaliničnost?
c) Za primerjavo: folija iz PE-LD ima gostoto $0{,}920\,\mathrm{g/cm^3}$. Izračunaj njeno kristaliničnost in utemelji, zakaj PE-LD ni primeren za tlačne cevi.

**Podatki:** $D = 0{,}110\,\mathrm{m}$, $t = 0{,}010\,\mathrm{m}$, $L = 1{,}0\,\mathrm{m}$, $\rho = 0{,}955\,\mathrm{g/cm^3}$, $\rho' = 0{,}965\,\mathrm{g/cm^3}$, $\rho_\mathrm{LD} = 0{,}920\,\mathrm{g/cm^3}$, $\rho_c = 1{,}00\,\mathrm{g/cm^3}$, $\rho_a = 0{,}855\,\mathrm{g/cm^3}$
**Iščemo:** $\chi$, masa kristalne faze $m_c$, $\chi'$, $\chi_\mathrm{LD}$

:::formula
$\chi = \dfrac{\rho_c(\rho - \rho_a)}{\rho(\rho_c - \rho_a)}$, $V = \dfrac{\pi}{4}(D^2 - d^2)L$ z $d = D - 2t$, $m = \rho V$, $m_c = \chi m$
:::

**Rešitev:**

1. a) $\chi = \dfrac{1{,}00 \cdot (0{,}955 - 0{,}855)}{0{,}955 \cdot (1{,}00 - 0{,}855)} = \dfrac{0{,}100}{0{,}1385} \approx 0{,}722$.
2. Notranji premer je $d = 0{,}110 - 2 \cdot 0{,}010 = 0{,}090\,\mathrm{m}$. Prostornina stene na meter: $V = \tfrac{\pi}{4}(0{,}110^2 - 0{,}090^2) \cdot 1{,}0\,\mathrm{m^3} \approx 3{,}14 \cdot 10^{-3}\,\mathrm{m^3}$.
3. Masa: $m = 955\,\mathrm{kg/m^3} \cdot 3{,}14 \cdot 10^{-3}\,\mathrm{m^3} \approx 3{,}00\,\mathrm{kg}$; kristalna faza $m_c = 0{,}722 \cdot 3{,}00\,\mathrm{kg} \approx 2{,}17\,\mathrm{kg}$.
4. b) $\chi' = \dfrac{1{,}00 \cdot (0{,}965 - 0{,}855)}{0{,}965 \cdot 0{,}145} = \dfrac{0{,}110}{0{,}1399} \approx 0{,}786$. Počasno ohlajanje je verigam dalo čas, da se zložijo v lamele.
5. c) $\chi_\mathrm{LD} = \dfrac{1{,}00 \cdot (0{,}920 - 0{,}855)}{0{,}920 \cdot 0{,}145} = \dfrac{0{,}065}{0{,}1334} \approx 0{,}487$.
6. PE-LD ima razvejene verige, ki se slabo zložijo, zato je kristaliničnost le okoli polovica. Pri sobni temperaturi je nad $T_g$, zato amorfna faza malo prispeva k togosti: manj kristalne faze pomeni manjši modul, nižjo mejo tečenja, nižje tališče in hitrejše lezenje pod tlakom.
7. Odgovor: cev ima $\chi \approx 72\,\%$ in okoli $2{,}2\,\mathrm{kg}$ kristalne faze na meter; po toplotni obdelavi $\chi \approx 79\,\%$. PE-LD ima le $\chi \approx 49\,\%$, zato je premehak in bi pod stalnim tlakom prehitro lezel; primeren je za folije, kjer je upogljivost prednost.

### Primer 4 – zdaj ti

Gumijasto tesnilo iz zamrežene naravne gume ima pri $300\,\mathrm{K}$ modul $E = 1{,}5\,\mathrm{MPa}$ in gostoto $920\,\mathrm{kg/m^3}$. Kolikšna je povprečna molska masa verige med vozliščema?

**Podatki:** $E = 1{,}5 \cdot 10^6\,\mathrm{Pa}$, $T = 300\,\mathrm{K}$, $\rho = 920\,\mathrm{kg/m^3}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** $M_c$

:::formula
$E = 3G = \dfrac{3\rho RT}{M_c}$, torej $M_c = \dfrac{3\rho RT}{E}$
:::

**Rešitev:**

1. Formula velja za idealni elastomer nad $T_g$ pri majhni deformaciji; naravna guma ima $T_g \approx -70\,^\circ\mathrm{C}$, zato pogoj drži.
2. Števec: $3 \cdot 920 \cdot 8{,}314 \cdot 300 \approx 6{,}88 \cdot 10^6$ (v $\mathrm{J/m^3}$, kar je $\mathrm{Pa}$, krat $\mathrm{kg/mol}$).
3. Zdaj ti: deli z $E$ in izračunaj, koliko ponavljajočih se enot izoprena ($68{,}1\,\mathrm{g/mol}$) je med dvema vozliščema.

:::premisli
Kolikšna sta $M_c$ in število enot med vozliščema?
---
$M_c = 6{,}88 \cdot 10^6/1{,}5 \cdot 10^6\,\mathrm{kg/mol} \approx 4{,}6\,\mathrm{kg/mol} = 4600\,\mathrm{g/mol}$, kar je okoli $4600/68{,}1 \approx 67$ enot izoprena. Gostejše zamreženje (manjši $M_c$) bi dalo trše tesnilo, a manj raztegljivo.
:::

## Pogoste napake

- **En sam modul in ena trdnost za polimer.** »PE ima $E = 1\,\mathrm{GPa}$« velja le pri določeni temperaturi in hitrosti. Ista cev je pozimi togejša kot poleti, pod stalno obremenitvijo pa leze. Pri dimenzioniranju uporabi podatke za dejansko temperaturo in čas.
- **Steklasti prehod je tališče.** Pri $T_g$ se ne stali nič, le zamrznjeni segmenti amorfnih področij postanejo gibljivi. Amorfni polimer nima tališča, delno kristaliničen pa ima $T_g$ in $T_m$.
- **Duromer se zmehča, če ga dovolj segreješ.** Duromer je ena sama zamrežena mreža kovalentnih vezi; pri segrevanju se razkroji, ne stali. Zato ga ne moremo reciklirati s taljenjem.
- **Zamenjava $M_n$ in $M_w$.** Pri frakcijah, podanih z masami, $M_n$ ni masno povprečje: najprej izračunaj množine verig $m_i/M_i$. Vedno velja $M_w \ge M_n$; rezultat $\mathrm{PDI} < 1$ je napaka v računu.
- **Kristaliničnost kot volumski delež z linearno interpolacijo.** $(\rho - \rho_a)/(\rho_c - \rho_a)$ je volumski delež; masni delež ima še faktor $\rho_c/\rho$. Razlika je nekaj odstotnih točk, a na izpitu šteje.
- **Gumijasta elastičnost kot pri jeklu.** Guma se pri segrevanju pod obremenitvijo skrči, ker je njena sila entropijska in raste s $T$. Pravila za kovine (razteznost, energijska elastičnost) tu ne veljajo.

## Povzetek

- Polimer: verige ponavljajočih se enot; kovalentne vezi vzdolž verige, šibke sile in prepletanje med verigami.
- $n = M_n/M_0$; $M_n = \sum x_iM_i$, $M_w = \sum w_iM_i$, $M_w \ge M_n$, $\mathrm{PDI} = M_w/M_n$.
- Arhitektura: linearni, razvejeni, zamreženi, mrežasti; taktičnost in kopolimeri.
- Amorfni ali delno kristalinični (lamele, sferoliti); $\chi = \rho_c(\rho - \rho_a)/[\rho(\rho_c - \rho_a)]$.
- $T_g$: zamrznitev segmentov amorfne faze; $T_m$: taljenje kristalov; pod $T_g$ krhko, nad $T_g$ žilavo ali gumijasto.
- Termoplasti (linearni, pretaljivi), duromeri (gosto zamreženi, se razkrojijo), elastomeri (redko zamreženi nad $T_g$).
- Viskoelastičnost: lezenje in relaksacija že pri sobni temperaturi; entropijska elastičnost gume $G = \rho RT/M_c$.

## Za izpit

Znati moraš povedati:

- definicije ponavljajoče enote, stopnje polimerizacije, $M_n$, $M_w$ in $\mathrm{PDI}$ ter dokaz, da je $M_w \ge M_n$;
- vrste arhitekture verig, taktičnost in vpliv na kristaliničnost;
- izpeljavo formule za stopnjo kristaliničnosti iz gostote;
- definicijo $T_g$ in $T_m$ ter obnašanje modula amorfnega polimera s temperaturo;
- razlike med termoplasti, duromeri in elastomeri (zgradba, vedenje pri segrevanju, predelava, primeri);
- vzrok viskoelastičnosti in entropijske elastičnosti ter zvezo $G = \rho RT/M_c$.

### Naloga 1

Trak iz zamrežene naravne gume z gostoto $920\,\mathrm{kg/m^3}$ ima povprečno molsko maso verige med vozliščema $5{,}0\,\mathrm{kg/mol}$ in začetni presek $4{,}0\,\mathrm{mm^2}$. a) Izračunaj strižni in natezni modul pri $20\,^\circ\mathrm{C}$. b) Kolikšna sila je potrebna, da trak raztegnemo na dvakratno dolžino? c) Kolikšna je sila pri isti dolžini pri $60\,^\circ\mathrm{C}$? d) Jeklena žica dolžine $1{,}0\,\mathrm{m}$ (temperaturni razteznostni koeficient $12 \cdot 10^{-6}\,\mathrm{K^{-1}}$) se pri tem segrevanju podaljša. Za koliko? Primerjaj vedenje obeh.

**Rešitev:**

1. a) $T = 293{,}15\,\mathrm{K}$: $G = \rho RT/M_c = 920 \cdot 8{,}314 \cdot 293{,}15/5{,}0\,\mathrm{Pa} \approx 4{,}48 \cdot 10^5\,\mathrm{Pa}$; $E = 3G \approx 1{,}35\,\mathrm{MPa}$, okoli $150\,000$-krat manj kot jeklo.
2. b) Pri $\lambda = 2{,}0$: $\lambda - 1/\lambda^2 = 2{,}0 - 0{,}25 = 1{,}75$; $\sigma = 4{,}48 \cdot 10^5 \cdot 1{,}75\,\mathrm{Pa} \approx 7{,}85 \cdot 10^5\,\mathrm{Pa}$.
3. Napetost je glede na začetni presek, zato $F = \sigma S_0 = 7{,}85 \cdot 10^5\,\mathrm{Pa} \cdot 4{,}0 \cdot 10^{-6}\,\mathrm{m^2} \approx 3{,}14\,\mathrm{N}$. Linearni Hookov zakon ($E\varepsilon = 1{,}35\,\mathrm{MPa} \cdot 1{,}0$) bi dal napačno večjo silo, ker pri velikih raztezkih ne velja.
4. c) $G$ je sorazmeren s $T$: $F_{60} = 3{,}14\,\mathrm{N} \cdot 333{,}15/293{,}15 \approx 3{,}57\,\mathrm{N}$, okoli $14\,\%$ več.
5. d) $\Delta L = \alpha L\Delta T = 12 \cdot 10^{-6} \cdot 1{,}0 \cdot 40\,\mathrm{m} = 4{,}8 \cdot 10^{-4}\,\mathrm{m} = 0{,}48\,\mathrm{mm}$.
6. Odgovor: $G \approx 0{,}45\,\mathrm{MPa}$, $E \approx 1{,}35\,\mathrm{MPa}$; za dvakratno dolžino potrebujemo okoli $3{,}1\,\mathrm{N}$, pri $60\,^\circ\mathrm{C}$ pa $3{,}6\,\mathrm{N}$. Jeklo se pri segrevanju podaljša za $0{,}48\,\mathrm{mm}$, raztegnjena guma pa bi se pri stalni sili skrčila, ker njena sila izvira iz entropije in raste s temperaturo.

### Naloga 2

Natančno definiraj številsko in masno povprečje molske mase. Dokaži, da je $M_w \ge M_n$, in povej, kdaj velja enakost. Utemelji, ali je mogoče z mešanjem dveh vzorcev z enakim $M_n$ dobiti mešanico z drugačnim $M_n$ ali drugačnim $\mathrm{PDI}$.

**Rešitev:**

1. Za $N_i$ verig z molsko maso $M_i$: $M_n = \sum N_iM_i/\sum N_i$ (masa vzorca, deljena s številom verig), $M_w = \sum N_iM_i^2/\sum N_iM_i$ (povprečje, uteženo z maso).
2. Z deleži $x_i$ je $M_w = \sum x_iM_i^2/M_n$; varianca $s^2 = \sum x_iM_i^2 - M_n^2 \ge 0$, zato $M_w = M_n + s^2/M_n \ge M_n$.
3. Enakost velja natanko pri $s^2 = 0$, ko imajo vse verige isto molsko maso (monodisperzni vzorec).
4. Mešanica vzorcev z enakim $M_n$: skupna masa, deljena s skupnim številom verig, je spet $M_n$, ker je vsak vzorec prispeval maso $M_n$ na verigo. $M_n$ se ne spremeni.
5. $\mathrm{PDI}$ pa se lahko spremeni: mešanica ozkega vzorca s $\mathrm{PDI} \approx 1$ in širokega vzorca ima varianco, ki je uteženo povprečje varianc, zato $\mathrm{PDI}$ mešanice leži med obema. Če se $M_n$ vzorcev razlikujeta, se varianci prišteje še razpršenost med povprečjema, zato je porazdelitev mešanice širša, kot bi bila samo zaradi vzorcev.

### Naloga 3

Utemelji razliko med termoplasti, duromeri in elastomeri na ravni zgradbe verig. Za vsako skupino navedi, kaj se zgodi pri segrevanju, kako jo predelujemo in dva primera. Razloži, zakaj je za ohišje stikala v električni napeljavi primeren duromer, za plastenko termoplast in za tesnilo elastomer.

**Rešitev:**

1. Termoplasti: linearne ali razvejene verige, med njimi le šibke sile; pri segrevanju se zmehčajo (amorfni nad $T_g$) ali stalijo (kristalni pri $T_m$), postopek je ponovljiv; brizganje, ekstrudiranje, pihanje; PE, PET.
2. Duromeri: gosta tridimenzionalna mreža kovalentnih vezi, nastala z utrjevanjem; pri segrevanju se ne zmehčajo, ampak razkrojijo; oblikujemo jih med utrjevanjem (stiskanje, liv, laminiranje); epoksi, fenol-formaldehid.
3. Elastomeri: redka kovalentna vozlišča, dolge gibljive verige nad $T_g$; pri segrevanju ostanejo gumijasti do razkroja; vulkanizacija v kalupu; naravna guma, silikon.
4. Ohišje stikala: ob kratkem stiku ali iskri se ne sme zmehčati in teči; duromer je toplotno in dimenzijsko stabilen ter dober izolator.
5. Plastenka: potrebujemo hitro in poceni oblikovanje s pihanjem ter recikliranje s taljenjem; to omogoča le termoplast.
6. Tesnilo: mora se reverzibilno deformirati in tesniti ob neravnih ploskvah; to omogoča elastomer, ker vozlišča preprečujejo trajno tečenje, gibljive verige pa velik povraten raztezek.

## Drugače: Na sliki

Štiri arhitekture verig:

```
 linearna     ~~~~~~~~~~~~~~~~~~
 razvejena    ~~~~~~~~~~~~~~~~~~
                  \~~~    \~~~
 zamrežena    ~~~~~~+~~~~~~~~~~~
                    |
              ~~~~~~+~~~~~+~~~~~
                          |
              ~~~~~~~~~~~~+~~~~~
 mrežasta     gosto: + na vsakih
              nekaj atomih
```

Modul amorfnega polimera pri segrevanju (logaritemska os):

```
 log E
  |######  steklasto
  |      #
  |       # (T_g)
  |        ######## gumijasto
  |                #  tok
  +-----------------#----> T
```

Zamrežen polimer (elastomer) ostane na vodoravnem gumijastem delu, termoplast se pri višji temperaturi spusti v tok, duromer pa ima tudi gumijasti del zelo visoko, ker ga držijo goste vezi.

## Drugače: Uporaba v stroki

**Cevi za vodo in plin.** Cevi iz PE-HD (PE 100) dimenzioniramo po **najmanjši zahtevani trdnosti** po $50$ letih pri $20\,^\circ\mathrm{C}$, ki jo določijo s preizkusi lezenja pri več temperaturah in ekstrapolacijo. Zato je dovoljeni tlak cevi občutno nižji, kot bi kazala kratkotrajna natezna trdnost.

**Brizganje in kalupi.** Delno kristalinični termoplasti se pri ohlajanju bolj skrčijo (PP, PA okoli $1$ do $2\,\%$) kot amorfni (PS, PC okoli $0{,}5\,\%$), zato morajo biti kalupi zanje večji. Hitrost ohlajanja v kalupu določa kristaliničnost in s tem togost izdelka.

**Kompozitne konstrukcije.** Lopatice vetrnic, deli letal in čolni so iz epoksidne ali poliestrske smole s steklenimi ali ogljikovimi vlakni. Duromerna matrica drži vlakna in prenaša obremenitev nanje; temperatura uporabe mora biti precej pod $T_g$ utrjene smole, ki jo kontrolirajo z diferenčno dinamično kalorimetrijo (DSC).

**Recikliranje.** Termoplaste mehansko recikliramo s pretaljevanjem, pri čemer se verige delno trgajo in $M_w$ pada. Duromerov in vulkanizirane gume s taljenjem ne moremo predelati; zmeljemo jih v polnilo ali kemijsko razgradimo, kar je pomemben izziv industrije.

## Drugače: Bolj natančno

**Časovno-temperaturna superpozicija.** Pri viskoelastičnih polimerih ima višja temperatura podoben učinek kot daljši čas obremenitve. Krivulje modula pri različnih temperaturah s premikom po logaritemski časovni osi zložimo v eno glavno krivuljo. Faktor premika nad $T_g$ opisuje enačba Williams-Landel-Ferry. Tako iz kratkih preizkusov pri višjih temperaturah napovemo vedenje v desetletjih.

**Odvisnost $T_g$ od molske mase.** Konci verig imajo več prostega volumna, zato kratke verige znižujejo $T_g$: velja Flory-Foxova zveza $T_g = T_{g,\infty} - K/M_n$. Mehčala delujejo podobno: majhne molekule med verigami povečajo gibljivost, zato ima mehki PVC $T_g$ pod sobno temperaturo.

**Stopenjska polimerizacija.** Pri reakciji dveh vrst funkcionalnih skupin (poliestri, poliamidi) Carothersova enačba poveže povprečno stopnjo polimerizacije s pretvorbo $p$: $\bar{X}_n = 1/(1 - p)$. Za verige s povprečno $100$ enotami mora zreagirati $99\,\%$ skupin, zato morajo biti monomeri zelo čisti in v natančnem razmerju.

## Preveri se

? Katera trditev o temperaturi steklastega prehoda $T_g$ je pravilna?
- Pri $T_g$ se stalijo kristalna področja polimera.
~ Taljenje kristalov je pri tališču $T_m$, ki je višje od $T_g$. Pri $T_g$ se spremeni le gibljivost segmentov v amorfni fazi.
+ Pri $T_g$ postanejo segmenti verig v amorfnih področjih gibljivi in modul močno pade.
- Popolnoma kristalen polimer ima izrazitejši $T_g$ kot amorfen.
~ Steklasti prehod je lastnost amorfne faze; več kristaliničnosti pomeni šibkejši prehod, popolnoma kristalen polimer ga ne bi imel.
> Pod $T_g$ so segmenti zamrznjeni in polimer je steklast; nad njim se lahko vrtijo okoli vezi, modul pade za okoli tri velikostne rede.

? Polipropilen ima molsko maso ponavljajoče enote $42{,}08\,\mathrm{g/mol}$. Kolikšna je stopnja polimerizacije vzorca z $M_n = 210\,000\,\mathrm{g/mol}$?
- okoli $8{,}8 \cdot 10^6$
~ Molsko maso si pomnožil z maso enote namesto delil. Stopnja polimerizacije je število enot: $M_n/M_0$.
+ okoli $5000$
- okoli $2500$
~ Delil si še z $2$, kot da bi bila ponavljajoča enota dve molekuli propena ($84\,\mathrm{g/mol}$). Ponavljajoča enota PP je ena enota propena, $-\mathrm{CH_2{-}CH(CH_3)}-$ z $42{,}08\,\mathrm{g/mol}$.
> $n = M_n/M_0 = 210\,000/42{,}08 \approx 4990$, torej okoli $5000$ enot.

? Študent izračuna kristaliničnost PE z gostoto $0{,}940\,\mathrm{g/cm^3}$ ($\rho_c = 1{,}00$, $\rho_a = 0{,}855\,\mathrm{g/cm^3}$): (1) $\rho - \rho_a = 0{,}085$; (2) $\rho_c - \rho_a = 0{,}145$; (3) $\chi = 0{,}085/0{,}145 = 0{,}586$; (4) kristaliničnost je $58{,}6\,\%$. Kje je napaka?
- v koraku (1)
~ Razlika $0{,}940 - 0{,}855 = 0{,}085$ je pravilna.
- v koraku (2)
~ Razlika $1{,}00 - 0{,}855 = 0{,}145$ je pravilna.
+ v koraku (3)
> Razmerje razlik je volumski delež. Masni delež ima še faktor $\rho_c/\rho$: $\chi = 1{,}00 \cdot 0{,}085/(0{,}940 \cdot 0{,}145) \approx 0{,}624$, torej $62{,}4\,\%$.

? Primerjaj epoksidno smolo in polietilen pri segrevanju na $200\,^\circ\mathrm{C}$. Kaj se zgodi?
- Oba se stalita, ker so vsi polimeri pri visoki temperaturi tekoči.
~ Duromeri se ne stalijo: kovalentna mreža preprečuje, da bi verige drsele druga ob drugi.
- Epoksi se stali pri nižji temperaturi, ker je bolj krhek.
~ Krhkost pri sobni temperaturi ni povezana s taljenjem. Epoksi je krhek, ker je gosto zamrežen, prav zato pa se ne stali.
+ PE se stali in ga lahko ponovno oblikujemo; epoksi ostane trden in se pri še višji temperaturi razkroji.
> PE je termoplast iz linearnih verig s šibkimi silami med njimi (tališče okoli $135\,^\circ\mathrm{C}$). Epoksi je duromer z gosto mrežo kovalentnih vezi, ki se pri segrevanju ne zmehča, ampak razkroji.

? Plastična polica iz PP v toplem skladišču se po nekaj mesecih pod stalno težo kartonov opazno povesi, čeprav je bila napetost v njej daleč pod mejo tečenja. Kaj se je zgodilo?
- Polica je bila preobremenjena in je plastično stekla kot jeklo nad mejo tečenja.
~ Napetost je bila pod mejo tečenja; pri jeklu pri sobni temperaturi bi bila deformacija prožna in stalna. Pri polimeru deformacija s časom raste.
+ Polimer je lezel: pri stalni obremenitvi se viskoelastični material s časom deformira naprej, toplota to pospeši.
- PP je pri sobni temperaturi pod $T_g$ in zato krhek, zato se je zlomil in povesil.
~ PP ima $T_g \approx -10\,^\circ\mathrm{C}$, pri sobni temperaturi je nad njim. Krhkost bi povzročila lom, ne počasnega povesa.
> Lezenje je pri polimerih pomembno že pri sobni temperaturi in se pri višji temperaturi pospeši. Zato polimerne dele dimenzioniramo na podatke o lezenju za predvideni čas uporabe.

:::simboli
n | stopnja polimerizacije | n = \frac{M_n}{M_0} | – | število ponavljajočih se enot
M_n | številsko povprečje molske mase | M_n = \sum_i x_iM_i | g/mol
M_w | masno povprečje molske mase | M_w = \sum_i w_iM_i | g/mol | vedno $M_w \ge M_n$
M_0 | molska masa ponavljajoče enote | | g/mol
M_i | molska masa verig $i$-te vrste | | g/mol
x_i | delež števila verig | x_i = \frac{N_i}{\sum N_j} | –
w_i | masni delež verig | w_i = \frac{N_iM_i}{\sum N_jM_j} | –
N_i | število verig z molsko maso $M_i$ | | –
i | oznaka vrste verig | | –
s | standardni odklon molske mase | | g/mol
\mathrm{PDI} | indeks polidisperznosti | \mathrm{PDI} = \frac{M_w}{M_n} | – | najmanj 1
m_i | masa frakcije | | g
n_i | množina verig v frakciji | n_i = \frac{m_i}{M_i} | mol
\chi | stopnja kristaliničnosti (masni delež) | \chi = \frac{\rho_c(\rho - \rho_a)}{\rho(\rho_c - \rho_a)} | –
\rho | gostota vzorca | | g/cm^3
\rho_c | gostota povsem kristalnega polimera | | g/cm^3
\rho_a | gostota povsem amorfnega polimera | | g/cm^3
m | masa | m = \rho V | kg
m_c | masa kristalne faze | m_c = \chi m | kg
V | prostornina stene cevi | V = \frac{\pi}{4}(D^2 - d^2)L | m^3
D | zunanji premer cevi | | m
d | notranji premer cevi | d = D - 2t | m
t | debelina stene | | m
L | dolžina | | m
T_g | temperatura steklastega prehoda | | K
T_m | tališče | | K
T | temperatura | | K
G | strižni modul elastomera | G = \frac{\rho RT}{M_c} | Pa
E | natezni (Youngov) modul | E = 3G | Pa | elastomer, majhne deformacije
M_c | molska masa verige med vozliščema | M_c = \frac{3\rho RT}{E} | kg/mol
R | splošna plinska konstanta | | J/(mol\,K) | 8,314
\lambda | raztezek (razmerje dolžin) | \lambda = \frac{L}{L_0} | –
L_0 | začetna dolžina | | m
\sigma | napetost glede na začetni presek | \sigma = G\,(\lambda - 1/\lambda^2) | Pa
:::
