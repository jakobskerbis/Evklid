---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Aluminijasti okvir telefona ima maso približno $27\,\mathrm{g}$. To je skoraj natanko en mol aluminija, torej okoli $6 \cdot 10^{23}$ atomov. Gostota aluminija je $2{,}70\,\mathrm{g/cm^3}$. Ali lahko gostoto izračunaš samo iz tega, kako veliki so atomi in kako so zloženi? In zakaj se okvir ob padcu upogne, namesto da bi se razletel kot steklo zaslona?

Odgovor se skriva v urejenosti. Pozimi na snežinki vidiš šest enakih krakov, ker se molekule vode zlagajo v pravilen šestkotni vzorec. Na pocinkani ograji ob cesti, ki leta stoji v dežju, vidiš lisaste »rože«, velike do nekaj centimetrov. Vsaka lisa je eno zrno cinka, v katerem so atomi zloženi v enak vzorec, le obrnjen drugače kot v sosednjem zrnu.

Tudi kovine so torej kristali. Iz načina zlaganja atomov sledijo gostota, kovnost, obnašanje pri mrazu in to, kaj se zgodi z jeklom pri toplotni obdelavi.

## Razlaga

**1. Kristal in mreža.** V kristalu so atomi razporejeni v vzorec, ki se ponavlja v vseh treh smereh. Ta vzorec opišemo s **kristalno mrežo**: z množico točk, kjer sedijo središča atomov. Nasprotje kristala je **amorfna** snov, na primer okensko steklo, kjer reda na daljših razdaljah ni.

*Preveri:* je kocka ledu kristalna ali amorfna? (Kristalna: njeno šestkotno mrežo pokaže snežinka.)

**2. Osnovna celica.** Dovolj je opisati najmanjši gradnik, ki z zlaganjem drug ob drugega zapolni ves prostor: **osnovna celica**. Pri kubičnih mrežah je to kocka s stranico $a$, ki ji rečemo **mrežni parameter**. Pri kovinah je $a$ okoli $0{,}3\,\mathrm{nm}$. V $1\,\mathrm{mm}$ železa se v eni vrsti zvrsti približno $3{,}5$ milijona celic.

*Preveri:* ali je $a$ večji ali manjši od premera enega atoma? (Večji ali enak: ogliščna atoma ob robu se ne smeta prekrivati.)

**3. Delitev atomov.** Atom v oglišču kocke si deli osem sosednjih celic, zato eni celici pripada le $\frac{1}{8}$ atoma. Atom na sredini ploskve si delita dve celici ($\frac{1}{2}$), atom v središču kocke pa pripada celici v celoti.

*Preveri:* koliko atomov pripada celici, ki ima atome samo v ogliščih? ($8 \cdot \frac{1}{8} = 1$.)

**4. Tri mreže kovin.** Večina tehničnih kovin ima eno od treh mrež:

| mreža | atomi na celico | sosedov | primeri |
|---|---|---|---|
| KPC (kubična prostorsko centrirana) | 2 | 8 | α-Fe, Cr, W, Mo |
| KPloC (kubična ploskovno centrirana) | 4 | 12 | Al, Cu, Au, Ni, γ-Fe |
| HGZ (heksagonalna gosto zložena) | 6 | 12 | Zn, Mg, Ti |

KPC je kocka z atomom v vsakem oglišču in enim v središču. KPloC je kocka z atomi v ogliščih in na sredini vsake od šestih ploskev. HGZ je šeststrana prizma, sestavljena iz plasti krogel, zloženih kot pomaranče na stojnici.

Število sosedov, ki se atoma dotikajo, imenujemo **koordinacijsko število**.

:::premisli
V KPloC in HGZ ima atom 12 sosedov, v KPC le 8. Napovej: v kateri mreži atomi bolje zapolnijo prostor in katera ima zato pri enakih atomih večjo gostoto?
---
KPloC in HGZ. Več sosedov pomeni tesnejše zlaganje: atomi zapolnijo $74\,\%$ prostora, v KPC pa le $68\,\%$. Zato se železo pri $912\,^\circ\mathrm{C}$, ko preide iz KPC v KPloC, skrči.
:::

**5. Kje se atomi dotikajo.** Atome si predstavljamo kot trde krogle s polmerom $r$. V KPC se dotikajo vzdolž telesne diagonale kocke, ki ima dolžino $a\sqrt{3}$, na njej pa so štirje polmeri. V KPloC se dotikajo vzdolž diagonale ploskve, $a\sqrt{2}$, ki prav tako meri štiri polmere:

$$a_\mathrm{KPC} = \frac{4r}{\sqrt{3}}$$

$$a_\mathrm{KPloC} = 2\sqrt{2}\,r$$

*Preveri:* katera mreža ima pri enakem $r$ daljši rob $a$? ($2\sqrt{2} \approx 2{,}83$ je več kot $\frac{4}{\sqrt{3}} \approx 2{,}31$, zato KPloC.)

**6. Gostota iz mreže.** Celica vsebuje $n$ atomov, vsak ima maso $\frac{M}{N_\mathrm{A}}$. Maso celice delimo z njeno prostornino $a^3$:

$$\rho = \frac{n \cdot M}{N_\mathrm{A} \cdot a^3}$$

Tu je $n$ število atomov na celico, $M$ molska masa in $N_\mathrm{A} = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$ Avogadrova konstanta.

**7. Alotropija.** Ista kovina ima lahko pri različnih temperaturah različno mrežo. Železo je do $912\,^\circ\mathrm{C}$ KPC (ferit, α-Fe), med $912$ in $1394\,^\circ\mathrm{C}$ KPloC (avstenit, γ-Fe) in nato spet KPC do tališča. Na tem sloni toplotna obdelava jekel.

Mreža vpliva tudi na obnašanje v mrazu. Kovine s KPloC (aluminij, baker, avstenitno nerjavno jeklo) ostanejo žilave tudi pri $-196\,^\circ\mathrm{C}$. Mnoga jekla s KPC pa pod neko temperaturo postanejo krhka, zato za jeklene mostove in ladje v polarnih morjih uporabljamo posebej preizkušena jekla.

*Preveri:* katero mrežo ima železo v vroči kovačnici pri $1000\,^\circ\mathrm{C}$? (KPloC, avstenit.)

**8. Napake v kristalih.** Pravi kristal ni popoln. Napake razvrstimo po tem, koliko razsežnosti imajo:

- **Točkaste napake.** *Praznina* je prazno mesto v mreži. *Intersticijski atom* je majhen tuj atom, stisnjen med atome mreže, na primer ogljik v železu. *Substitucijski atom* zamenja atom mreže, na primer cink v bakru pri medenini.
- **Črtne napake: dislokacije.** *Robna dislokacija* je rob vrinjene polravnine atomov, ki se konča sredi kristala. Pri *vijačni* so ravnine zasukane okoli črte kot polžasto stopnišče.
- **Ploskovne napake.** *Kristalna meja* loči dve zrni z različno usmerjeno mrežo, kot lise na pocinkani ograji. *Dvojčična meja* loči dva dela zrna, ki sta zrcalni sliki drug drugega.
- **Prostorske napake.** Pore, razpoke in vključki (na primer oksidi ali sulfidi).

*Preveri:* kakšna napaka je atom kroma v nerjavnem jeklu? (Substitucijski atom, točkasta napaka.)

**9. Zakaj so dislokacije tako pomembne.** Če bi ena atomska ravnina zdrsnila čez drugo naenkrat, bi morali hkrati pretrgati vse vezi. Za to bi bila potrebna napetost, ki je sto- do tisočkrat večja od izmerjene. Dislokacija pa se premika postopoma, eno vrsto atomov naenkrat. Pomisli na gosenico na listu: ne dvigne vsega telesa hkrati, ampak po njem pošilja grbo. Zato se kovine plastično deformirajo pri majhnih napetostih in se okvir telefona upogne.

:::premisli
Kovino želimo utrditi. Zakaj pomagajo tuji atomi v mreži, drobna zrna ali hladno preoblikovanje, čeprav so vsi po vrsti »napake«?
---
Vse ovirajo gibanje dislokacij. Tuji atomi popačijo mrežo, na kristalni meji se smer drsnih ravnin spremeni, pri hladnem preoblikovanju pa se dislokacije namnožijo in zapletejo med seboj. Težje gibanje dislokacij pomeni večjo trdnost, a navadno manjšo raztezljivost. Izjema so drobna zrna, ki izboljšajo tudi žilavost.
:::

## Rešeni primeri

### Primer 1: zlato zrno iz reke

V produ gorske reke najdeš zlato zrno. Zlato ima mrežo KPloC, polmer atoma je $r = 0{,}144\,\mathrm{nm}$. Koliko atomov pripada eni osnovni celici in kolikšen je mrežni parameter?

**Podatki:** mreža KPloC, $r = 0{,}144\,\mathrm{nm}$; 8 atomov v ogliščih, 6 na ploskvah
**Iščemo:** število atomov na celico $n$ in mrežni parameter $a$

:::formula
$n = 8 \cdot \frac{1}{8} + 6 \cdot \frac{1}{2}$ in $a = 2\sqrt{2}\,r$
:::

**Rešitev:**

1. Ogliščni atomi: $8 \cdot \frac{1}{8} = 1$, ker si vsakega deli osem celic.
2. Ploskovni atomi: $6 \cdot \frac{1}{2} = 3$, ker si vsakega delita dve celici.
3. Skupaj: $n = 1 + 3 = 4$.
4. Atomi se dotikajo vzdolž diagonale ploskve: $a = 2\sqrt{2} \cdot 0{,}144\,\mathrm{nm} \approx 0{,}407\,\mathrm{nm}$.
5. Odgovor: celici zlata pripadajo 4 atomi, njen rob meri približno $0{,}407\,\mathrm{nm}$.

### Primer 2: gostota železne ograje

Železna ograja pri vremenski postaji je pri zunanji temperaturi iz ferita (α-Fe, KPC). Polmer atoma železa je $r = 0{,}1241\,\mathrm{nm}$, molska masa $M = 55{,}85\,\mathrm{g/mol}$. Izračunaj gostoto železa.

**Podatki:** mreža KPC ($n = 2$), $r = 0{,}1241\,\mathrm{nm}$, $M = 55{,}85\,\mathrm{g/mol}$, $N_\mathrm{A} = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** gostoto $\rho$ v $\mathrm{g/cm^3}$

:::formula
$a = \dfrac{4r}{\sqrt{3}}$, nato $\rho = \dfrac{n \cdot M}{N_\mathrm{A} \cdot a^3}$
:::

**Rešitev:**

1. Mrežni parameter: $a = \dfrac{4 \cdot 0{,}1241\,\mathrm{nm}}{\sqrt{3}} \approx 0{,}2866\,\mathrm{nm}$, ker se atomi dotikajo vzdolž telesne diagonale.
2. V centimetre, ker gostoto želimo v $\mathrm{g/cm^3}$: $0{,}2866\,\mathrm{nm} = 0{,}2866 \cdot 10^{-7}\,\mathrm{cm}$.
3. Prostornina celice: $a^3 \approx 2{,}354 \cdot 10^{-23}\,\mathrm{cm^3}$.
4. Masa atomov v celici: $n \cdot M = 2 \cdot 55{,}85 = 111{,}7\,\mathrm{g/mol}$.
5. Imenovalec: $N_\mathrm{A} \cdot a^3 \approx 14{,}18\,\mathrm{cm^3/mol}$.
6. $\rho = \dfrac{111{,}7}{14{,}18}\,\mathrm{g/cm^3} \approx 7{,}88\,\mathrm{g/cm^3}$.
7. Odgovor: gostota železa je približno $7{,}88\,\mathrm{g/cm^3}$; tabelirana vrednost je $7{,}87\,\mathrm{g/cm^3}$.

### Primer 3: katero mrežo ima aluminij?

Vrnimo se k okvirju telefona. Rentgenska analiza da mrežni parameter $a = 0{,}4049\,\mathrm{nm}$ in kubično mrežo, gostota je $2{,}70\,\mathrm{g/cm^3}$, molska masa $26{,}98\,\mathrm{g/mol}$. Ali je mreža KPC ali KPloC? Koliko osnovnih celic je v okvirju z maso $27\,\mathrm{g}$?

**Podatki:** $a = 0{,}4049\,\mathrm{nm}$, $\rho = 2{,}70\,\mathrm{g/cm^3}$, $M = 26{,}98\,\mathrm{g/mol}$, $m = 27\,\mathrm{g}$, $N_\mathrm{A} = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** število atomov na celico $n$ (in s tem mrežo) ter število celic $N_\mathrm{c}$

:::formula
$n = \dfrac{\rho \cdot N_\mathrm{A} \cdot a^3}{M}$, nato $N_\mathrm{c} = \dfrac{m}{M} \cdot \dfrac{N_\mathrm{A}}{n}$
:::

**Rešitev:**

1. Obrnemo enačbo za gostoto, ker je neznanka zdaj $n$.
2. $a^3 = (0{,}4049 \cdot 10^{-7}\,\mathrm{cm})^3 \approx 6{,}638 \cdot 10^{-23}\,\mathrm{cm^3}$.
3. $\rho \cdot N_\mathrm{A} \cdot a^3 \approx 107{,}9\,\mathrm{g/mol}$.
4. $n = \dfrac{107{,}9}{26{,}98} \approx 4{,}00$. Štirje atomi na celico pomenijo KPloC.
5. Atomov v okvirju: $\dfrac{27}{26{,}98} \cdot 6{,}022 \cdot 10^{23} \approx 6{,}03 \cdot 10^{23}$.
6. Celic: $\dfrac{6{,}03 \cdot 10^{23}}{4} \approx 1{,}5 \cdot 10^{23}$.
7. Odgovor: aluminij ima mrežo KPloC; okvir sestavlja okoli $1{,}5 \cdot 10^{23}$ osnovnih celic.

### Primer 4: zdaj ti

Kolikšen delež prostornine celice KPC zapolnijo atomi? Ta delež imenujemo **faktor zapolnitve** $f$.

**Podatki:** mreža KPC, $n = 2$, $a = \dfrac{4r}{\sqrt{3}}$, atom je krogla s polmerom $r$
**Iščemo:** faktor zapolnitve $f$

:::formula
$f = \dfrac{n \cdot \frac{4}{3}\pi r^3}{a^3}$
:::

**Rešitev:**

1. Prostornina atomov v celici: $2 \cdot \frac{4}{3}\pi r^3 = \frac{8}{3}\pi r^3$.
2. Prostornina celice: $a^3 = \dfrac{64\,r^3}{3\sqrt{3}}$, ker je $(\sqrt{3})^3 = 3\sqrt{3}$.
3. Deli in poenostavi sam. Polmer $r$ se mora pokrajšati.

:::premisli
Koliko je $f$ za KPC?
---
$f = \dfrac{\frac{8}{3}\pi r^3 \cdot 3\sqrt{3}}{64\,r^3} = \dfrac{\pi\sqrt{3}}{8} \approx 0{,}68$. Atomi zapolnijo $68\,\%$ prostora, ne glede na to, kako veliki so.
:::

## Pogoste napake

- **Vsak atom šteje cel.** Kdor prešteje vse narisane krogle, dobi za KPC 9 in za KPloC 14 atomov. Narobe: atom v oglišču si deli 8 celic, atom na ploskvi 2. Pravilno: KPC ima 2, KPloC 4 atome na celico.
- **$a = 2r$ v vsaki kubični mreži.** To velja le za preprosto kubično mrežo, kjer se atomi dotikajo vzdolž roba. V KPC se dotikajo vzdolž telesne diagonale ($a = \frac{4r}{\sqrt{3}}$), v KPloC vzdolž diagonale ploskve ($a = 2\sqrt{2}\,r$).
- **»Kovina ni kristal, ker nima ploskev kot kremen.«** Zrna so običajno premajhna, da bi jih videl s prostim očesom, in vsako je obrnjeno drugače. Pokaže jih mikroskop po jedkanju.
- **Dislokacija je drobna razpoka.** V dislokaciji ni praznega prostora. Je črta, ob kateri je mreža popačena, kristal pa ostane sklenjen. Razpoka kovino oslabi, gibanje dislokacij pa omogoča, da se kovina upogne in ne poči.

## Povzetek

- Kovine so kristalne: atomi tvorijo mrežo, ki jo opiše osnovna celica z mrežnim parametrom $a$.
- KPC: 2 atoma na celico, 8 sosedov, $a = \frac{4r}{\sqrt{3}}$, $f = 0{,}68$ (α-Fe, Cr, W).
- KPloC: 4 atomi, 12 sosedov, $a = 2\sqrt{2}\,r$, $f = 0{,}74$ (Al, Cu, Au, γ-Fe). HGZ: 6 atomov, 12 sosedov, $f = 0{,}74$ (Zn, Mg, Ti).
- Gostota iz mreže: $\rho = \frac{n M}{N_\mathrm{A} a^3}$.
- Železo je alotropno: do $912\,^\circ\mathrm{C}$ KPC (ferit), med $912$ in $1394\,^\circ\mathrm{C}$ KPloC (avstenit).
- Napake: točkaste (praznine, intersticijski in substitucijski atomi), črtne (dislokacije), ploskovne (kristalne meje), prostorske (pore, vključki).
- Plastična deformacija poteka z gibanjem dislokacij; vse, kar jih ovira, kovino utrdi.

## Drugače: Na sliki

Nariši kvadrat s stranico $4\,\mathrm{cm}$ in vanj kroge s polmerom $1{,}41\,\mathrm{cm}$ v vsakem oglišču ter enega v središču. To je ploskev celice KPloC: krogi se dotikajo vzdolž diagonale, ob robu pa ne. Diagonala meri $4\sqrt{2} \approx 5{,}66\,\mathrm{cm}$, kar so natanko štirje polmeri.

Zdaj zlagaj pomaranče. V spodnji plasti ima vsaka šest sosed. Druga plast leži v vdolbinah prve. Če tretja plast leži točno nad prvo (vzorec ABAB), dobiš HGZ. Če leži v vdolbinah, ki jih druga plast še ni uporabila (ABCABC), dobiš KPloC. Obe zlaganji sta enako tesni, $74\,\%$.

Dislokacijo nariši kot mrežo navpičnih črt, kjer se ena črta od zgoraj konča na sredini slike. Ob vrinjeni črti, nad njenim koncem, so sosednje črte stisnjene, pod koncem pa razmaknjene. Ko zgornjo polovico potisneš v desno, se konec vrinjene črte premakne za eno mesto. Ko pride do roba, je zgornja polovica zdrsnila za en atomski razmik.

## Drugače: Bolj natančno

**Faktor zapolnitve KPloC.** $n = 4$, $a = 2\sqrt{2}\,r$, $a^3 = 16\sqrt{2}\,r^3$:

$$f_\mathrm{KPloC} = \frac{4 \cdot \frac{4}{3}\pi r^3}{16\sqrt{2}\,r^3} = \frac{\pi}{3\sqrt{2}} \approx 0{,}740$$

**Intersticijske praznine.** V KPloC je največja praznina (oktaedrska) velika za kroglo s polmerom $(\sqrt{2}-1)\,r \approx 0{,}414\,r$; v γ-Fe je to okoli $0{,}053\,\mathrm{nm}$. V KPC je tetraedrska praznina manjša: ima polmer okoli $0{,}29\,r$, v α-Fe okoli $0{,}036\,\mathrm{nm}$. Atom ogljika je večji od obeh, zato mrežo razširi. V avstenitu se raztopi do $2{,}11\,\%$ ogljika, v feritu le do $0{,}022\,\%$. Ta razlika je ključ do kaljenja jekla.

**Burgersov vektor.** Dislokacijo opišemo z Burgersovim vektorjem $\vec{b}$: za koliko in v katero smer se kristal zamakne, ko dislokacija preide čez. Pri robni dislokaciji je $\vec{b}$ pravokoten na dislokacijsko črto, pri vijačni vzporeden. Drsenje poteka po najgosteje zasedenih ravninah v najgosteje zasedenih smereh. KPloC ima 12 takih drsnih sistemov, ki so aktivni že pri majhni napetosti. Zato so kovine s KPloC zelo kovne.

**Velikost zrn.** Meja plastičnosti narašča z manjšanjem zrn po Hall-Petchevi zvezi $R_\mathrm{e} = \sigma_0 + k_\mathrm{y}/\sqrt{d}$, kjer je $d$ povprečni premer zrna. Drobna zrna hkrati povečajo trdnost in žilavost.

## Preveri se

? Katera vrstica pravilno opiše mrežo KPC?
- 8 atomov v ogliščih, 1 v središču, celici pripada 9 atomov, 8 sosedov
~ Ogliščni atom si deli 8 celic, zato celici prispeva le $\frac{1}{8}$; skupaj $1 + 1 = 2$.
+ 8 atomov v ogliščih, 1 v središču, celici pripadata 2 atoma, 8 sosedov
- atomi v ogliščih in na ploskvah, celici pripadajo 4 atomi, 12 sosedov
~ To je opis KPloC, ne KPC.
- atomi v ogliščih in v središču, celici pripadata 2 atoma, 12 sosedov
~ Atom v središču se dotika le osmih ogliščnih atomov; 12 sosedov imata KPloC in HGZ.
> KPC: $8 \cdot \frac{1}{8} + 1 = 2$ atoma; središčni atom ima 8 najbližjih sosedov v ogliščih.

? Približno koliko osnovnih celic železa ($a \approx 0{,}29\,\mathrm{nm}$) se zvrsti v eni vrsti vzdolž $1\,\mathrm{mm}$?
- okoli $3\,500$
~ Pozabil si, da je $1\,\mathrm{mm} = 10^{6}\,\mathrm{nm}$, ne $10^{3}\,\mathrm{nm}$.
+ okoli $3{,}5$ milijona
- okoli $1{,}2 \cdot 10^{13}$
~ To bi bilo število celic v kvadratu $1\,\mathrm{mm} \times 1\,\mathrm{mm}$, ne v eni vrsti.
> $\dfrac{10^{6}\,\mathrm{nm}}{0{,}29\,\mathrm{nm}} \approx 3{,}5 \cdot 10^{6}$ celic.

? Zakaj se kovina plastično deformira pri napetosti, ki je sto- do tisočkrat manjša od teoretične trdnosti popolnega kristala?
- Ker ima kovina v sebi drobne razpoke, ob katerih se pretrga.
~ Razpoke vodijo v lom, ne v plastično deformacijo. Dislokacija ni razpoka; kristal ob njej ostane sklenjen.
- Ker je kovina amorfna in atomi nimajo stalnih mest.
~ Kovine so kristalne. Amorfno steklo se pri sobni temperaturi ne deformira plastično, ampak poči.
+ Ker se dislokacije premikajo postopoma in naenkrat pretrgajo le eno vrsto vezi.
> Zdrs ravnine poteka z gibanjem dislokacije, podobno kot grba potuje po gosenici. Za to je potrebna majhna napetost.

? V kubični kovini je izmerjeni mrežni parameter $a = 0{,}3615\,\mathrm{nm}$, polmer atoma $r = 0{,}1278\,\mathrm{nm}$. Katera je mreža?
- preprosta kubična, ker se atomi vedno dotikajo vzdolž roba
~ Pri $a = 2r$ bi bil rob $0{,}2556\,\mathrm{nm}$. Izmerjeni rob je precej daljši, zato se atomi ob robu ne dotikajo.
- KPC
~ Za KPC bi veljalo $\frac{a}{r} = \frac{4}{\sqrt{3}} \approx 2{,}31$, tu pa je razmerje večje.
+ KPloC
> $\frac{a}{r} = \frac{0{,}3615}{0{,}1278} \approx 2{,}83 = 2\sqrt{2}$, torej KPloC. To je baker.

? Za rezervoar tekočega dušika ($-196\,^\circ\mathrm{C}$) iščeš material, ki v mrazu ne bo postal krhek. Kaj izbereš?
- navadno konstrukcijsko jeklo s KPC, ker je najtrše
~ Ravno jekla s KPC pri nizkih temperaturah lahko postanejo krhka. Trdota ni isto kot žilavost.
+ aluminijevo zlitino ali avstenitno nerjavno jeklo s KPloC
- poljubno kovino, ker so vse kovine zaradi dislokacij vedno žilave
~ Pri KPC se v mrazu gibanje dislokacij močno oteži, zato žilavost pade. Pomembna je mreža.
> V KPloC je veliko drsnih sistemov, ki delujejo tudi pri zelo nizkih temperaturah, zato aluminij in avstenitna jekla ostanejo žilavi.

:::simboli
a | mrežni parameter (rob osnovne celice) | | nm
a_\mathrm{KPC} | mrežni parameter mreže KPC | a = \frac{4r}{\sqrt{3}} | nm
a_\mathrm{KPloC} | mrežni parameter mreže KPloC | a = 2\sqrt{2}\,r | nm
r | polmer atoma | | nm
n | število atomov na osnovno celico | | – | KPC 2, KPloC 4, HGZ 6
\rho | gostota | \rho = \frac{n M}{N_\mathrm{A} a^3} | g/cm^3
M | molska masa | | g/mol
N_\mathrm{A} | Avogadrova konstanta | | mol^{-1} | $6{,}022 \cdot 10^{23}$
N_\mathrm{c} | število osnovnih celic v kosu | N_\mathrm{c} = \frac{m}{M}\cdot\frac{N_\mathrm{A}}{n} | –
m | masa kosa | | g
f | faktor zapolnitve prostora | f = \frac{n \cdot \frac{4}{3}\pi r^3}{a^3} | – | KPC $0{,}68$, KPloC $0{,}74$
f_\mathrm{KPloC} | faktor zapolnitve mreže KPloC | f = \frac{\pi}{3\sqrt{2}} | –
:::
