---
stanje: osnutek
demo: enacbe
avtor: AI
---

## Zakaj se tega učimo

Kitaro pozabiš pol leta v vlažni kleti. Ko jo spet vzameš v roke, so jeklene strune rjave in zvenijo zamolklo. Na koncertu pa pirotehnik ob udarcu bobna prižge magnezijev trak: bel blisk, ki je mimo v sekundi.

Prvo traja mesece in je tiho. Drugo je hitro in bleščeče. Pa vendar se v obeh primerih zgodi isto: kovina se poveže s kisikom iz zraka in nastane oksid. Rja na struni je železov oksid, bel prah po blisku je magnezijev oksid.

Skupno jima je še nekaj, kar ni tako očitno. Atomi železa, magnezija in kisika ne izginejo in ne nastanejo iz nič, le prerazporedijo se. Kemijska enačba mora to pokazati: na levi in na desni mora biti enako atomov vsake vrste. Iz stehiometrije že veš, da brez take enačbe ne izračunaš, koliko kisika porabi blisk ali koliko rje nastane. Tu se naučiš enačbo urediti in reakcijo uvrstiti v eno od nekaj **vrst reakcij**.

## Razlaga

**1. Mamljiva bližnjica.** Zapišimo blisk. **Reaktanta** (snovi pred reakcijo) sta $\mathrm{Mg}$ in $\mathrm{O_2}$, **produkt** (nastala snov) je $\mathrm{MgO}$:

$$\mathrm{Mg + O_2 \rightarrow MgO}$$

Levo sta $2$ atoma kisika, desno $1$. Najhitrejši »popravek« se ponuja sam: desno napišeš $\mathrm{MgO_2}$ in atomi se ujemajo.

:::premisli
Zakaj ta popravek ne velja, čeprav je zdaj na obeh straneh $1$ atom $\mathrm{Mg}$ in $2$ atoma $\mathrm{O}$?
---
Ker $\mathrm{MgO_2}$ ni snov, ki nastane pri blisku. **Indeks** (malo število v formuli) pove, iz česa je snov. Ko ga spremeniš, zapišeš drugo snov, ne iste snovi v večji količini. Enako bi iz vode $\mathrm{H_2O}$ naredil vodikov peroksid $\mathrm{H_2O_2}$.
:::

**2. Kaj smemo spreminjati.** Formula snovi je določena: magnezijev oksid je vedno $\mathrm{MgO}$. Spremenimo lahko samo, **koliko** enot vsake snovi sodeluje. To pove **koeficient**, število pred formulo.

Koeficient pomnoži vse atome v formuli: $2\,\mathrm{MgO}$ pomeni $2$ atoma $\mathrm{Mg}$ in $2$ atoma $\mathrm{O}$. Indeks za oklepajem pomnoži vse v oklepaju. Zato ima $3\,\mathrm{Ca(OH)_2}$ $3$ atome $\mathrm{Ca}$, $3 \cdot 2 = 6$ atomov $\mathrm{O}$ in $6$ atomov $\mathrm{H}$.

**3. Štetje v tabeli.** Urejanje je knjigovodstvo atomov. Za blisk ga zapišemo vrstico za vrstico:

| Kaj smo spremenili | Mg (levo : desno) | O (levo : desno) |
|---|---|---|
| nič, $\mathrm{Mg + O_2 \rightarrow MgO}$ | $1 : 1$ | $2 : 1$ |
| desno $2\,\mathrm{MgO}$ | $1 : 2$ | $2 : 2$ |
| levo $2\,\mathrm{Mg}$ | $2 : 2$ | $2 : 2$ |

Popravek kisika je pokvaril magnezij, zato smo se vrnili k njemu. Tako je pogosto: en koeficient vpliva na več elementov. Urejena enačba je $\mathrm{2\,Mg + O_2 \rightarrow 2\,MgO}$.

**4. Postopek.**

1. Zapiši pravilne formule reaktantov in produktov. Teh potem ne spreminjaš več.
2. Začni z elementom, ki je v najmanj formulah.
3. Element, ki nastopa sam (na primer $\mathrm{O_2}$), uredi nazadnje: koeficient pred njim ne spremeni nobenega drugega elementa.
4. Koeficienti naj bodo najmanjša cela števila.
5. Na koncu preštej vse atome še enkrat.

V simulaciji spodaj (»Urejanje kemijskih enačb«) izberi reakcijo $\mathrm{H_2 + O_2 \rightarrow H_2O}$ in najprej spremeni samo koeficient pred vodo. Opazi, da se kisik uredi, vodik pa pokvari, in da so molekule ves čas iste, spreminja se le njihovo število.

**5. Vrste reakcij.** Reakcije so si pogosto podobne po obliki. Po tej obliki jih uvrstimo v pet vrst:

| Vrsta | Vzorec | Primer |
|---|---|---|
| spajanje (sinteza) | $\mathrm{A + B \rightarrow AB}$ | $\mathrm{2\,Zn + O_2 \rightarrow 2\,ZnO}$ (baterija v slušnem aparatu) |
| razpad | $\mathrm{AB \rightarrow A + B}$ | $\mathrm{2\,NaN_3 \rightarrow 2\,Na + 3\,N_2}$ (glasen pok zračne blazine) |
| zgorevanje | snov $+\ \mathrm{O_2}$ | ogljikovodik $+\ \mathrm{O_2} \rightarrow \mathrm{CO_2 + H_2O}$ |
| izpodrivanje | $\mathrm{A + BC \rightarrow AC + B}$ | $\mathrm{Fe + CuSO_4 \rightarrow FeSO_4 + Cu}$ |
| dvojna zamenjava | $\mathrm{AB + CD \rightarrow AD + CB}$ | $\mathrm{AgNO_3 + NaCl \rightarrow AgCl + NaNO_3}$ |

Pri izpodrivanju je eden od reaktantov element. Pri dvojni zamenjavi sta oba spojini, pogosto nastane oborina ali voda.

Ena reakcija lahko spada v dve vrsti. Magnezij gori s plamenom v kisiku, zato je blisk zgorevanje. Ker iz dveh snovi nastane ena, je hkrati spajanje. Vrsta reakcije ne spremeni pravila urejanja: atomov mora biti na obeh straneh enako.

:::premisli
Pri žganju apnenca poteče $\mathrm{CaCO_3 \rightarrow CaO + CO_2}$. Napovej: katera vrsta reakcije je to in ali jo je treba še urejati?
---
Razpad: iz ene snovi nastaneta dve. Urejena je že: levo $1\,\mathrm{Ca}$, $1\,\mathrm{C}$, $3\,\mathrm{O}$; desno $1\,\mathrm{Ca}$, $1\,\mathrm{C}$ in $1 + 2 = 3$ atomi $\mathrm{O}$. Vsi koeficienti so $1$.
:::

## Rešeni primeri

### Primer 1 (lažji): »pok« vodika

Pri vaji ujamemo vodik v epruveto in jo približamo plamenu. Zasliši se kratek »pok«: vodik reagira s kisikom iz zraka in nastane voda. Uredi enačbo $\mathrm{H_2 + O_2 \rightarrow H_2O}$ in določi vrsto reakcije.

**Podatki:** neurejena enačba $\mathrm{H_2 + O_2 \rightarrow H_2O}$; reaktanta vodik in kisik, produkt voda
**Iščemo:** koeficiente in vrsto reakcije

:::formula
Za vsak element: število atomov levo $=$ število atomov desno. Spreminjamo samo koeficiente.
:::

**Rešitev:**

1. Preštejemo: levo $2\,\mathrm{H}$ in $2\,\mathrm{O}$, desno $2\,\mathrm{H}$ in $1\,\mathrm{O}$. Kisika je desno premalo.
2. Pred vodo napišemo $2$, ker indeksa ne smemo spremeniti. Desno je zdaj $4\,\mathrm{H}$ in $2\,\mathrm{O}$.
3. Vodika je zdaj levo premalo, zato pred $\mathrm{H_2}$ napišemo $2$: levo so $2 \cdot 2 = 4$ atomi $\mathrm{H}$.
4. Preverimo: levo $4\,\mathrm{H}$ in $2\,\mathrm{O}$, desno $4\,\mathrm{H}$ in $2\,\mathrm{O}$.
5. Iz dveh snovi nastane ena, zato je to spajanje. Ker vodik pri tem gori, je hkrati zgorevanje.

Urejena enačba je $\mathrm{2\,H_2 + O_2 \rightarrow 2\,H_2O}$, reakcija je spajanje.

### Primer 2: grelnik ob odru

Na zimskem koncertu na prostem ob odru gorijo plinski grelniki na propan $\mathrm{C_3H_8}$. Pri popolnem zgorevanju nastaneta ogljikov dioksid in voda. Uredi enačbo.

**Podatki:** neurejena enačba $\mathrm{C_3H_8 + O_2 \rightarrow CO_2 + H_2O}$
**Iščemo:** koeficiente

:::formula
Vrstni red: ogljik, vodik, kisik nazadnje. Za vsak element: levo $=$ desno.
:::

**Rešitev:**

1. Ogljik: levo $3\,\mathrm{C}$, zato desno $3\,\mathrm{CO_2}$.
2. Vodik: levo $8\,\mathrm{H}$, zato desno $4\,\mathrm{H_2O}$, saj je $4 \cdot 2 = 8$.
3. Kisik desno: $3 \cdot 2 + 4 = 10$ atomov. Ena molekula $\mathrm{O_2}$ ima $2$ atoma, zato potrebujemo $10 : 2 = 5$ molekul.
4. Preverimo: levo $3\,\mathrm{C}$, $8\,\mathrm{H}$, $10\,\mathrm{O}$; desno $3\,\mathrm{C}$, $8\,\mathrm{H}$, $10\,\mathrm{O}$.

Urejena enačba je $\mathrm{C_3H_8 + 5\,O_2 \rightarrow 3\,CO_2 + 4\,H_2O}$. To je zgorevanje.

### Primer 3 (težji): koliko kisika porabi blisk

Pirotehnični blisk na koncertu vsebuje aluminijev prah, ki zgori v aluminijev oksid $\mathrm{Al_2O_3}$. Koliko gramov kisika porabi $5{,}4\,\mathrm{g}$ aluminija?

**Podatki:** $m(\mathrm{Al}) = 5{,}4\,\mathrm{g}$, $M(\mathrm{Al}) = 27\,\mathrm{g/mol}$, $M(\mathrm{O_2}) = 32\,\mathrm{g/mol}$, neurejena enačba $\mathrm{Al + O_2 \rightarrow Al_2O_3}$
**Iščemo:** maso kisika $m(\mathrm{O_2})$

:::formula
Najprej urejena enačba. Nato $n = \dfrac{m}{M}$ in

$\dfrac{n(\mathrm{O_2})}{n(\mathrm{Al})} = \dfrac{\nu(\mathrm{O_2})}{\nu(\mathrm{Al})}$
:::

**Rešitev:**

1. Kisik: levo $2$, desno $3$ atomi. Najmanjši skupni večkratnik je $6$, zato napišemo $3\,\mathrm{O_2}$ in $2\,\mathrm{Al_2O_3}$, saj je $3 \cdot 2 = 6$ in $2 \cdot 3 = 6$.
2. Desno so zdaj $2 \cdot 2 = 4$ atomi $\mathrm{Al}$, zato levo $4\,\mathrm{Al}$: $\mathrm{4\,Al + 3\,O_2 \rightarrow 2\,Al_2O_3}$.
3. Množina aluminija: $n(\mathrm{Al}) = \dfrac{5{,}4\,\mathrm{g}}{27\,\mathrm{g/mol}} = 0{,}2\,\mathrm{mol}$.
4. Zdaj ti: iz razmerja koeficientov $4 : 3$ izračunaj $n(\mathrm{O_2})$ in nato maso kisika.

:::premisli
Koliko molov kisika porabi blisk in koliko gramov je to?
---
$n(\mathrm{O_2}) = 0{,}2\,\mathrm{mol} \cdot \dfrac{3}{4} = 0{,}15\,\mathrm{mol}$, $m(\mathrm{O_2}) = 0{,}15\,\mathrm{mol} \cdot 32\,\mathrm{g/mol} = 4{,}8\,\mathrm{g}$. Blisk porabi $4{,}8\,\mathrm{g}$ kisika. Preverba z ohranitvijo mase: nastane $0{,}1\,\mathrm{mol}$ $\mathrm{Al_2O_3}$ ($M = 102\,\mathrm{g/mol}$), to je $10{,}2\,\mathrm{g}$, kar je ravno $5{,}4\,\mathrm{g} + 4{,}8\,\mathrm{g}$.
:::

## Pogoste napake

- **Spreminjanje indeksov.** »Desno manjka kisik, napišem $\mathrm{MgO_2}$.« Indeks je del formule, zato zapišeš drugo snov, tako kot $\mathrm{H_2O_2}$ ni voda. Spreminjaj samo koeficiente.
- **Koeficient ali indeks velja le za del formule.** »$2\,\mathrm{H_2O}$ ima $2\,\mathrm{H}$ in $1\,\mathrm{O}$« ali »v $\mathrm{H_2O}$ sta $2$ atoma kisika, ker je tam dvojka«. Koeficient pomnoži vso formulo ($4\,\mathrm{H}$ in $2\,\mathrm{O}$), indeks pa velja samo za atom ali oklepaj tik pred njim.
- **Kisik najprej.** Pri zgorevanju je kisik v obeh produktih. Če ga urediš prvega, ga po vsakem popravku ogljika ali vodika urejaš znova. Uredi ga zadnjega.
- **Ulomki in neskrajšani koeficienti.** $\mathrm{2\,Al + \tfrac{3}{2}\,O_2 \rightarrow Al_2O_3}$ ima pravo število atomov, a pol molekule ne obstaja: pomnoži z $2$. Enačbo $\mathrm{4\,H_2 + 2\,O_2 \rightarrow 4\,H_2O}$ pa deli z $2$.
- **Zamenjava vrst.** »Levo dve snovi, desno dve, torej dvojna zamenjava.« Pri izpodrivanju je eden od reaktantov element, na primer $\mathrm{Zn}$ ali $\mathrm{Fe}$. Dvojna zamenjava ima levo dve spojini.

## Povzetek

- V kemijski enačbi je število atomov vsakega elementa levo enako kot desno, ker se atomi pri reakciji le prerazporedijo.
- Urejamo samo s koeficienti, indeksov ne spreminjamo. Koeficient pomnoži vse atome v formuli.
- Postopek: element v najmanj formulah najprej, samostojni element (npr. $\mathrm{O_2}$) nazadnje, najmanjša cela števila, na koncu preštej vse.
- Vrste reakcij: spajanje, razpad, zgorevanje, izpodrivanje (element + spojina), dvojna zamenjava (dve spojini). Ena reakcija lahko spada v dve vrsti.
- Primera: $\mathrm{2\,H_2 + O_2 \rightarrow 2\,H_2O}$, $\mathrm{C_3H_8 + 5\,O_2 \rightarrow 3\,CO_2 + 4\,H_2O}$.

## Drugače: Kot zgodba

Po koncertu simfoničnega orkestra glasbeniki ne gredo domov. V avli se razdelijo v nove zasedbe: godalni kvartet, jazzovski trio, nekaj duov. Pri vratih stoji redar. Zvečer je preštel, koliko violinistov, pianistov in bobnarjev je prišlo. Ob polnoči jih prešteje ob izhodu.

Če mu violinist manjka, ve, da je nekje napaka. Glasbenik ne more izginiti, niti se ne more pojaviti nov. Tako je z atomi pri reakciji: glasbeniki so atomi, zasedbe so molekule.

Redar si zapisuje tudi zasedbe. Ne sme pa napisati, da ima kvartet pet članov, saj je kvartet po definiciji štiričlanski. To bi bilo spreminjanje indeksa. Lahko pa napiše, da sta nastala *dva* kvarteta. To je koeficient.

Tudi vrste reakcij so v zgodbi. Dva dua se združita v kvartet: spajanje. Kvartet se razide v dva dua: razpad. Samostojni pianist zamenja pianista v triu, ta pa ostane sam: izpodrivanje. Dva dua si izmenjata po enega člana: dvojna zamenjava.

## Drugače: Korak za korakom s številkami

Uredimo rjavenje jeklenih strun, $\mathrm{Fe + O_2 \rightarrow Fe_2O_3}$, in po vsakem koraku preštejmo.

| Korak | Enačba | Fe (L : D) | O (L : D) |
|---|---|---|---|
| začetek | $\mathrm{Fe + O_2 \rightarrow Fe_2O_3}$ | $1 : 2$ | $2 : 3$ |
| kisik | $\mathrm{Fe + 3\,O_2 \rightarrow 2\,Fe_2O_3}$ | $1 : 4$ | $6 : 6$ |
| železo | $\mathrm{4\,Fe + 3\,O_2 \rightarrow 2\,Fe_2O_3}$ | $4 : 4$ | $6 : 6$ |

Kisik ima levo $2$ in desno $3$ atome. Najmanjši skupni večkratnik je $6$. Levo ga dobimo s $3\,\mathrm{O_2}$ ($3 \cdot 2 = 6$), desno z $2\,\mathrm{Fe_2O_3}$ ($2 \cdot 3 = 6$).

Pri tem desno nastanejo $2 \cdot 2 = 4$ atomi železa, zato pred $\mathrm{Fe}$ napišemo $4$.

Rezultat: $\mathrm{4\,Fe + 3\,O_2 \rightarrow 2\,Fe_2O_3}$. Vrsta: spajanje.

## Preveri se

? V šolski vaji kapnejo klorovodikovo kislino na cink: $\mathrm{Zn + 2\,HCl \rightarrow ZnCl_2 + H_2}$. Nastali vodik nato ob plamenu »poči«. Kateri vrsti pripada prva reakcija?
- dvojna zamenjava
~ Dve snovi levo in dve desno še ne pomenita dvojne zamenjave. Tu je $\mathrm{Zn}$ element, ne spojina.
+ izpodrivanje
- spajanje
~ Pri spajanju nastane ena sama snov, tu pa nastaneta dve.
- razpad
~ Pri razpadu je levo ena sama snov, tu pa reagirata dve.
> Element cink izpodrine vodik iz spojine $\mathrm{HCl}$, kar ustreza vzorcu $\mathrm{A + BC \rightarrow AC + B}$.

? Urediti moraš $\mathrm{C_2H_6 + O_2 \rightarrow CO_2 + H_2O}$. Pri katerem vrstnem redu boš najmanj popravljal?
+ ogljik, vodik, nazadnje kisik
- kisik, ogljik, vodik
~ Kisik je v obeh produktih. Če ga urediš prvega, ga po vsakem popravku ogljika ali vodika urejaš znova.
- vodik, kisik, ogljik
~ Ko na koncu urediš ogljik, se spremeni število $\mathrm{CO_2}$ in s tem kisik desno, zato kisika še nisi končal.
> Ogljik in vodik sta vsak v eni formuli na vsaki strani. Koeficient pred $\mathrm{O_2}$ ne pokvari ničesar drugega. Rezultat je $\mathrm{2\,C_2H_6 + 7\,O_2 \rightarrow 4\,CO_2 + 6\,H_2O}$.

? Sošolec »uredi« $\mathrm{H_2 + O_2 \rightarrow H_2O}$ tako, da napiše $\mathrm{H_2 + O_2 \rightarrow H_2O_2}$. Kaj se zgodi s tem zapisom?
- Enačba je pravilno urejena, ker se atomi ujemajo.
~ Atomi se res ujemajo, a zapis zdaj opisuje drugo snov, ne tiste, ki nastane.
+ Opisuje nastanek vodikovega peroksida, ne vode, zato ne opisuje več »poka« vodika.
- Na desni je zdaj preveč kisika.
~ Preštej: desno sta $2$ atoma $\mathrm{O}$, levo tudi. Napaka ni v številu atomov, ampak v snovi.
> Indeks je del formule. Pri »poku« nastane voda, zato je pravilno $\mathrm{2\,H_2 + O_2 \rightarrow 2\,H_2O}$.

? Kolikšen koeficient stoji pred $\mathrm{O_2}$ v urejeni enačbi $\mathrm{CH_4 + O_2 \rightarrow CO_2 + H_2O}$?
- $1$
~ Z eno molekulo $\mathrm{O_2}$ sta levo le $2$ atoma kisika, desno pa so po urejanju vodika $4$.
+ $2$
- $4$
~ $4$ je število atomov kisika na desni. Ena molekula $\mathrm{O_2}$ ima dva atoma, zato je molekul pol manj.
- $\tfrac{3}{2}$
~ Tako dobiš, če vode ne urediš in šteješ desno le $3$ atome kisika. Najprej uredi vodik ($2\,\mathrm{H_2O}$), koeficienti pa morajo biti cela števila.
> $\mathrm{CH_4 + 2\,O_2 \rightarrow CO_2 + 2\,H_2O}$: desno so $2 + 2 = 4$ atomi kisika, to sta $4 : 2 = 2$ molekuli $\mathrm{O_2}$.

? Grelnik ob odru kuri butan: $\mathrm{2\,C_4H_{10} + 13\,O_2 \rightarrow 8\,CO_2 + 10\,H_2O}$. Koliko atomov kisika je na desni strani?
- $13$
~ $13$ je število molekul $\mathrm{O_2}$ na levi, ne število atomov. Vsaka molekula ima $2$ atoma.
- $18$
~ V $8\,\mathrm{CO_2}$ si štel le $8$ atomov kisika, a vsaka molekula $\mathrm{CO_2}$ ima $2$ atoma $\mathrm{O}$.
+ $26$
- $36$
~ Indeks $2$ v $\mathrm{H_2O}$ velja samo za vodik. V vsaki molekuli vode je en atom kisika.
> Desno: $8 \cdot 2 + 10 = 26$ atomov kisika. Levo: $13 \cdot 2 = 26$. Enačba je urejena.

:::simboli
n | množina snovi | n = \dfrac{m}{M} | mol
m | masa snovi | | g
M | molska masa | | g/mol
\nu | stehiometrijski koeficient | | – | število pred formulo v urejeni enačbi
:::
