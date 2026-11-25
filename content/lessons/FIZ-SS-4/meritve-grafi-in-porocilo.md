---
stanje: osnutek
demo: lab-nihalo
avtor: AI
---

## Zakaj se tega učimo

Nika bi rada študirala fizioterapijo. Na praksi v zdravstvenem domu je slišala fizioterapevtko: »Noga pri hoji niha kot nihalo. Zato otroci s kratkimi nogami delajo hitre, drobne korake.« Doma je pomislila na maturitetno vajo, ki jo čaka: s nitnim nihalom mora izmeriti težni pospešek $g$.

Prejšnje Nikino poročilo se je vrnilo s pripombami: »Rezultat brez napake ni rezultat. Točke na grafu niso povezane s cikcak črto. Kje je sklep?« Do mature ima še dva tedna. Potrebuje tri stvari: računati z napakami, narisati graf, iz katerega nekaj izračuna, in napisati poročilo, kot ga zahteva maturitetna naloga »merjenje«.

## Razlaga

**Nikina tabela.** Nika je spreminjala dolžino nihala $l$ in s štoparico merila čas desetih nihajev $t_{10}$. Iz njega je izračunala nihajni čas $T = t_{10}/10$:

| $l$ [m] | $t_{10}$ [s] | $T$ [s] | $T^2$ [s²] |
|---|---|---|---|
| 0,20 | 9,0 | 0,90 | 0,81 |
| 0,40 | 12,7 | 1,27 | 1,61 |
| 0,60 | 15,5 | 1,55 | 2,40 |
| 0,80 | 17,9 | 1,79 | 3,20 |
| 1,00 | 20,1 | 2,01 | 4,04 |

Štoparico sproži in ustavi roka, zato je napaka časa okoli $0{,}2\,\mathrm{s}$. Ker se ta napaka razdeli na deset nihajev, je napaka nihajnega časa le $0{,}02\,\mathrm{s}$.

V simulaciji spodaj (»Laboratorij: nihajni čas in težni pospešek«) nastavi pet dolžin in pri vsaki izmeri čas desetih nihajev. Opazuj, kako se tvoja tabela ujema z Nikino.

**Razlika dveh meritev.** Dolžino $80\,\mathrm{cm}$ je Nika dobila posredno. Kavelj, na katerem visi nit, je $182{,}0\,\mathrm{cm}$ nad tlemi, središče kroglice pa $102{,}0\,\mathrm{cm}$. Obe višini je izmerila na $\pm 0{,}2\,\mathrm{cm}$. Kako negotova je razlika?

Najslabši primer pove vse. Če je kavelj v resnici najvišje ($182{,}2$) in kroglica najnižje ($101{,}8$), je $l = 80{,}4\,\mathrm{cm}$. V obratnem primeru je $l = 79{,}6\,\mathrm{cm}$. Na številski premici:

:::risba premica
opis: Številska premica od 79,5 do 80,5 centimetra. Označen je interval od 79,6 do 80,4, sredina pri 80,0. Interval je širok 0,8 cm, torej 0,4 cm na vsako stran.
od: 79,5
do: 80,5
korak: 0,1
oznake: 0,5
interval: 79,6 .. 80,4 | l = (80,0 ± 0,4) cm
točka: 80 | 80,0
:::

Napaki sta se **sešteli**, čeprav smo višini odšteli. To velja za vsoto in razliko: **absolutna napaka** rezultata (napaka v enotah količine, tu $0{,}4\,\mathrm{cm}$) je vsota absolutnih napak. Za $x = a + b$ ali $x = a - b$ je

$$\Delta x = \Delta a + \Delta b$$

**Produkt na pravokotniku.** Ploščina pravokotnika je produkt stranic $a \cdot b$. Če je vsaka stranica malo daljša, se ploščina poveča za dva tanka pasova:

:::risba skica
opis: Pravokotnik s stranicama a (vodoravno) in b (navpično). Desno je ozek pas širine Δa in višine b, zgoraj ozek pas višine Δb in dolžine a, v kotu zgoraj desno je drobcen kvadratek Δa krat Δb.
območje: 0; 0 .. 10; 5
enota: 30
pravokotnik: 1; 0,8 .. 7; 3,8 | modra
pravokotnik: 7; 0,8 .. 7,8; 3,8 | oranžna ozadje
pravokotnik: 1; 3,8 .. 7; 4,4 | zelena ozadje
pravokotnik: 7; 3,8 .. 7,8; 4,4 | siva
napis: 4; 0,4 | a | sredina
napis: 0,6; 2,3 | b | sredina
napis: 8,5; 2,3 | Δa · b | desno
napis: 4; 2,3 | a · b | sredina
napis: 4; 4,75 | a · Δb | sredina
:::

Desni pas ima ploščino $\Delta a \cdot b$, zgornji $a \cdot \Delta b$; kvadratek v kotu je zanemarljiv. Oba pasova deliš s ploščino $a \cdot b$ in dobiš delež, za katerega se ploščina poveča: $\Delta a / a + \Delta b / b$. Pri produktu in količniku se torej seštejejo **relativne** napake $\delta = \Delta x / x$. Za $x = a \cdot b$ ali $x = a / b$ je

$$\delta_x = \delta_a + \delta_b$$

Kvadrat je produkt dveh enakih faktorjev: $T^2 = T \cdot T$. Relativna napaka kvadrata je zato dvakratna, kuba trikratna. Za potenco $x = a^n$ je

$$\delta_x = n\,\delta_a$$

Težni pospešek iz nihala je $g = 4\pi^2 l / T^2$, zato je $\delta_g = \delta_l + 2\,\delta_T$. Število $4\pi^2$ je natančno in napake ne prinese.

:::premisli
Nika ima $\delta_l = 0{,}5\,\%$ in $\delta_T = 1{,}1\,\%$. Lahko kupi boljši meter ali pa meri čas dvajsetih nihajev namesto desetih. Kaj bolj zmanjša napako $g$?
---
Čas. Nihajni čas je v formuli na kvadrat, zato prispeva $2 \cdot 1{,}1\,\% = 2{,}2\,\%$, dolžina le $0{,}5\,\%$. Z dvajsetimi nihaji se $\delta_T$ prepolovi in $\delta_g$ pade z $2{,}7\,\%$ na okoli $1{,}6\,\%$. Boljši meter bi prihranil največ pol odstotka.
:::

**Graf: od točk do premice.** Nika riše $T^2$ v odvisnosti od $l$:

:::risba graf
opis: Graf kvadrata nihajnega časa v odvisnosti od dolžine nihala. Pet merskih točk: (0,2; 0,81), (0,4; 1,61), (0,6; 2,40), (0,8; 3,20) in (1,0; 4,04), vsaka s kratko navpično daljico napake. Skozi izhodišče in med točkami poteka premica najboljšega prileganja z naklonom 4,02. Na premici sta označeni točki A (0,10; 0,40) in B (0,95; 3,82).
x: 0 .. 1,1 | 0,1 | l [m]
y: 0 .. 4,5 | 0,5 | T^2 [s^2]
f: 4,02*x | modra | 0 .. 1,1
črta: 0,2; 0,774 -> 0,2; 0,846 | debelo
črta: 0,4; 1,562 -> 0,4; 1,664 | debelo
črta: 0,6; 2,341 -> 0,6; 2,465 | debelo
črta: 0,8; 3,132 -> 0,8; 3,276 | debelo
črta: 1,0; 3,960 -> 1,0; 4,120 | debelo
točka: 0,2; 0,81 | | desno | oranžna
točka: 0,4; 1,61 | | desno | oranžna
točka: 0,6; 2,40 | | desno | oranžna
točka: 0,8; 3,20 | | desno | oranžna
točka: 1,0; 4,04 | | desno | oranžna
točka: 0,10; 0,40 | A | nad levo
točka: 0,95; 3,82 | B | nad levo
:::

Pravila, ki jih ocenjevalec preveri:

- **Osi.** Na vodoravno os gre količina, ki jo spreminjaš ($l$), na navpično tista, ki jo meriš ($T^2$). Ob osi sta ime in enota.
- **Merilo.** Okrogli koraki (1, 2 ali 5 enot na kvadratek); graf zavzame vsaj pol strani.
- **Napake.** Vsaka točka dobi navpično daljico $\pm \Delta(T^2)$. Pri Niki so kratke, okoli $\pm 0{,}04$ do $\pm 0{,}08\,\mathrm{s^2}$.
- **Premica najboljšega prileganja.** Točk ne povezuješ. Premico narišeš z ravnilom tako, da je približno enako točk nad njo in pod njo in da gre skozi čim več daljic napake. Če fizika pravi, da gre skozi izhodišče, naj gre.
- **Naklon.** Izbereš dve točki **na premici**, čim bolj narazen (ne merskih točk), in izračunaš $k = \Delta y / \Delta x$ z enotami osi.

**Zakaj $T^2$ in ne $T$?** Točke $T$ proti $l$ ležijo na krivulji, ker je $T = 2\pi\sqrt{l/g}$. Na krivulji naklona ne odčitaš. Če obe strani kvadriraš, dobiš enačbo nihala

$$T^2 = \frac{4\pi^2}{g}\,l$$

Zveza je premosorazmerna in graf je premica s smernim koeficientom $k = 4\pi^2/g$. Temu rečemo **linearizacija**. Iz naklona dobiš

$$g = \frac{4\pi^2}{k}$$

Enako ravnaš pri obratnem sorazmerju. Pri brizgi z zaprto konico je tlak zraka obratno sorazmeren s prostornino, $p \cdot V$ je stalen. Graf $p$ proti $V$ je krivulja, graf $p$ proti $1/V$ pa premica skozi izhodišče.

:::premisli
Sošolec je dolžino meril od kavlja do vrha kroglice, ne do njenega središča. Kako bo videti njegova premica $T^2$ proti $l$?
---
Vse njegove dolžine so prekratke za polmer kroglice $r$. Prava zveza je $T^2 = k(l + r)$, zato premica seka navpično os nad izhodiščem, pri $k \cdot r$. Naklon in s tem $g$ ostaneta pravilna; premik pove, da je pri merjenju sistematična napaka.
:::

**Odčitavanje z grafa.** Premica velja tudi med merskimi točkami. Za katero dolžino je $T = 1{,}5\,\mathrm{s}$? Izračunaš $T^2 = 2{,}25\,\mathrm{s^2}$, na navpični osi greš do premice in navzdol na vodoravno os: $l \approx 0{,}56\,\mathrm{m}$. Daleč zunaj merjenega območja (na primer pri $l = 5\,\mathrm{m}$) graf le podaljšuješ in odčitek je manj zanesljiv.

**Poročilo za maturo.** Ocenjevalec išče sedem delov v tem vrstnem redu:

1. **Namen**: kaj meriš (»Z nitnim nihalom izmeriti $g$.«).
2. **Pripomočki** z natančnostjo: meter ($\pm 0{,}2\,\mathrm{cm}$), štoparica.
3. **Potek dela**: skica in kratki koraki, tudi zakaj meriš deset nihajev.
4. **Tabela meritev** z enotami v glavi.
5. **Graf** po zgornjih pravilih.
6. **Izračun z napako**: naklon, $g$, $\Delta g$; rezultat kot $(g \pm \Delta g)$ enota.
7. **Sklep**: rezultat primerjaš s pričakovanim ($9{,}81\,\mathrm{m/s^2}$) in poveš, kaj je največji vir napake.

## Rešeni primeri

### Primer 1: koliko je zrasla

Medicinska sestra je dečka lani izmerila $148{,}5\,\mathrm{cm}$, letos $153{,}0\,\mathrm{cm}$, obakrat z napako $\pm 0{,}2\,\mathrm{cm}$. Koliko je zrasel in kolikšna je relativna napaka rasti?

**Podatki:** $h_1 = (148{,}5 \pm 0{,}2)\,\mathrm{cm}$; $h_2 = (153{,}0 \pm 0{,}2)\,\mathrm{cm}$
**Iščemo:** rast $r$ z napako $\Delta r$ in relativno napako $\delta_r$

:::formula
$r = h_2 - h_1$; $\Delta r = \Delta h_1 + \Delta h_2$; $\delta_r = \dfrac{\Delta r}{r}$
:::

**Rešitev:**

1. $r = 153{,}0 - 148{,}5 = 4{,}5$ (v cm).
2. Pri razliki se absolutni napaki seštejeta: $\Delta r = 0{,}2 + 0{,}2 = 0{,}4$ (v cm).
3. Relativna napaka, okoli $9\,\%$:

   $$\delta_r = \frac{0{,}4}{4{,}5} = 0{,}089$$
4. Odgovor: deček je zrasel $(4{,}5 \pm 0{,}4)\,\mathrm{cm}$. Vsaka višina ima relativno napako le $0{,}13\,\%$, rast pa $9\,\%$: razlika dveh podobnih števil je negotova.

### Primer 2: indeks telesne mase

Indeks telesne mase (ITM) je masa, deljena s kvadratom višine. Pacientka ima maso $(64{,}0 \pm 0{,}5)\,\mathrm{kg}$ in višino $(1{,}72 \pm 0{,}01)\,\mathrm{m}$. Izračunaj ITM z napako.

**Podatki:** $m = 64{,}0\,\mathrm{kg}$; $\Delta m = 0{,}5\,\mathrm{kg}$; $h = 1{,}72\,\mathrm{m}$; $\Delta h = 0{,}01\,\mathrm{m}$
**Iščemo:** $\mathrm{ITM}$ in $\Delta\mathrm{ITM}$

:::formula
$\mathrm{ITM} = \dfrac{m}{h^2}$; $\delta_\mathrm{ITM} = \delta_m + 2\,\delta_h$; $\Delta\mathrm{ITM} = \delta_\mathrm{ITM} \cdot \mathrm{ITM}$
:::

**Rešitev:**

1. Vrednost v $\mathrm{kg/m^2}$:

   $$\mathrm{ITM} = \frac{64{,}0}{1{,}72^2} = 21{,}63$$

2. Relativni napaki, $0{,}78\,\%$ in $0{,}58\,\%$:

   $$\delta_m = \frac{0{,}5}{64{,}0} = 0{,}0078$$

   $$\delta_h = \frac{0{,}01}{1{,}72} = 0{,}0058$$
3. Višina je v kvadratu, zato šteje dvakrat:

   $$\delta_\mathrm{ITM} = 0{,}78\,\% + 2 \cdot 0{,}58\,\%$$

   $$\delta_\mathrm{ITM} = 1{,}94\,\%$$

4. Absolutna napaka, zaokrožena na eno mesto $0{,}4$:

   $$\Delta\mathrm{ITM} = 0{,}0194 \cdot 21{,}63$$

   $$\Delta\mathrm{ITM} = 0{,}42$$
5. Odgovor: $\mathrm{ITM} = (21{,}6 \pm 0{,}4)\,\mathrm{kg/m^2}$. Napaka višine prispeva več kot napaka mase, ker je višina v kvadratu.

### Primer 3: težni pospešek z grafa

Z Nikinega grafa določi težni pospešek. Nato odčitaj, kolikšen bi bil nihajni čas nihala z dolžino $0{,}50\,\mathrm{m}$.

**Podatki:** točki na premici $A(0{,}10\,\mathrm{m}; 0{,}40\,\mathrm{s^2})$ in $B(0{,}95\,\mathrm{m}; 3{,}82\,\mathrm{s^2})$; $l = 0{,}50\,\mathrm{m}$
**Iščemo:** naklon $k$, težni pospešek $g$, nihajni čas $T$ pri $l = 0{,}50\,\mathrm{m}$

:::formula
$k = (T_B^2 - T_A^2)/(l_B - l_A)$; $g = 4\pi^2/k$; $T^2 = k \cdot l$
:::

**Rešitev:**

1. Točki sta na premici in daleč narazen, zato je naklon (v $\mathrm{s^2/m}$) natančen:

   $$k = \frac{3{,}82 - 0{,}40}{0{,}95 - 0{,}10} = 4{,}02$$

2. Težni pospešek v $\mathrm{m/s^2}$:

   $$g = \frac{4\pi^2}{4{,}02} = 9{,}82$$
3. Pri $l = 0{,}50\,\mathrm{m}$ z grafa ali iz premice: $T^2 = 4{,}02 \cdot 0{,}50 = 2{,}01$ (v $\mathrm{s^2}$).
4. $T = \sqrt{2{,}01} = 1{,}42$ (v s).
5. Odgovor: $g = 9{,}82\,\mathrm{m/s^2}$, kar se dobro ujema s pričakovano vrednostjo; nihalo dolžine $0{,}50\,\mathrm{m}$ ima nihajni čas $1{,}42\,\mathrm{s}$.

### Primer 4: zdaj ti

Iz ene same meritve, $l = (0{,}800 \pm 0{,}004)\,\mathrm{m}$ in $T = (1{,}79 \pm 0{,}02)\,\mathrm{s}$, izračunaj $g$ z napako.

**Podatki:** $l = 0{,}800\,\mathrm{m}$; $\Delta l = 0{,}004\,\mathrm{m}$; $T = 1{,}79\,\mathrm{s}$; $\Delta T = 0{,}02\,\mathrm{s}$
**Iščemo:** $g$ in $\Delta g$

:::formula
$g = 4\pi^2 l/T^2$; $\delta_g = \delta_l + 2\,\delta_T$; $\Delta g = \delta_g \cdot g$
:::

**Rešitev:**

1. Težni pospešek v $\mathrm{m/s^2}$:

   $$g = \frac{4\pi^2 \cdot 0{,}800}{1{,}79^2} = 9{,}857$$

2. Relativni napaki, $0{,}5\,\%$ in $1{,}12\,\%$:

   $$\delta_l = \frac{0{,}004}{0{,}800} = 0{,}005$$

   $$\delta_T = \frac{0{,}02}{1{,}79} = 0{,}0112$$
3. Izračunaj $\delta_g$ in $\Delta g$ ter zapiši rezultat, nato preveri:

:::premisli
Koliko je $\delta_g$ in kako zapišeš $g$?
---
$$\delta_g = 0{,}5\,\% + 2 \cdot 1{,}12\,\%$$

$$\delta_g = 2{,}74\,\%$$

$$\Delta g = 0{,}0274 \cdot 9{,}857 = 0{,}27$$

Zaokroženo je $\Delta g = 0{,}3\,\mathrm{m/s^2}$. Rezultat: $g = (9{,}9 \pm 0{,}3)\,\mathrm{m/s^2}$. Graf v primeru 3 je dal vrednost, bližjo pričakovani, ker upošteva vseh pet meritev.
:::

## Pogoste napake

- **Pri razliki napaki odšteješ.** »$0{,}2 - 0{,}2 = 0$, rast je točno $4{,}5\,\mathrm{cm}$.« Napake ne vedo, v katero smer odstopajo; v najslabšem primeru se sešteje. Pri vsoti in razliki se absolutni napaki vedno seštejeta.
- **Eksponent pozabiš.** $\delta_g = \delta_l + \delta_T$ je premalo, ker je $T$ v kvadratu. Pri potenci relativno napako pomnožiš z eksponentom.
- **Točke povežeš.** Cikcak črta ali premica skozi prvo in zadnjo točko ni premica najboljšega prileganja. Ta gre med vsemi točkami.
- **Naklon iz kvadratkov ali merskih točk.** Naklon računaš iz vrednosti na oseh in z enotami ($\mathrm{s^2/m}$), iz dveh oddaljenih točk na premici.
- **Preveč mest.** $g = (9{,}857 \pm 0{,}2695)\,\mathrm{m/s^2}$ se pretvarja v natančnost, ki je ni. Napako zaokroži na eno veljavno mesto, rezultat na isto decimalno mesto: $(9{,}9 \pm 0{,}3)\,\mathrm{m/s^2}$.

## Povzetek

- **Vsota ali razlika**: absolutni napaki se seštejeta, $\Delta x = \Delta a + \Delta b$.
- **Produkt ali količnik**: relativni napaki se seštejeta, $\delta_x = \delta_a + \delta_b$.
- **Potenca** $a^n$: relativna napaka je $n\,\delta_a$; za nihalo $\delta_g = \delta_l + 2\,\delta_T$.
- **Graf**: neodvisna količina na vodoravni osi, okroglo merilo, daljice napak, premica najboljšega prileganja (točk ne povezuješ).
- **Naklon** iz dveh oddaljenih točk na premici, z enotami; nihalo: $k = 4\pi^2/g$.
- **Linearizacija**: rišeš $T^2$ proti $l$ ali $p$ proti $1/V$, da dobiš premico.
- **Poročilo**: namen, pripomočki, potek, tabela, graf, izračun z napako, sklep.

## Drugače: Z analogijo

Napake si predstavljaj kot **odstopanja pri kosih pohištva**. Če zložiš dve omari drugo vrh druge in je vsaka visoka $\pm 1\,\mathrm{cm}$, je skupna višina negotova za $\pm 2\,\mathrm{cm}$. Če eno omaro postaviš na tla in drugo obesiš nad njo, je tudi razmik med njima negotov za $\pm 2\,\mathrm{cm}$: odštevanje negotovosti ne pobriše.

Pri produktu misli na **cene v odstotkih**. Če kupiš $5\,\%$ več blaga, ki je $3\,\%$ dražje, plačaš okoli $8\,\%$ več. Odstotki se pri množenju seštejejo, tako kot relativne napake. Kvadrat je nakup, pri katerem se količina in cena povečata za isti odstotek: plačaš dvakrat toliko odstotkov več.

## Drugače: Iz vsakdanjega življenja

V ambulanti so napake vsakdanje. Tehtnica kaže na $0{,}1\,\mathrm{kg}$, toplomer na $0{,}1\,\mathrm{^\circ C}$. Odmerek sirupa za otroka zdravnik pogosto izračuna kot $10\,\mathrm{mg}$ na kilogram mase: odmerek je produkt, zato ima vsaj tako veliko relativno napako kot tehtanje.

Tudi graf poznaš: rastna krivulja v otroški knjižici je graf višine v odvisnosti od starosti. Pediater ne poveže dveh zadnjih pik z ravnilom in ne podaljša črte do 30 let. Gleda celoten potek, kot ti gledaš premico najboljšega prileganja.

## Preveri se

? Razvrsti dele laboratorijskega poročila v pravilni vrstni red.
1. Namen: kaj merimo
2. Pripomočki z natančnostjo merilnikov
3. Potek dela s skico
4. Tabela meritev
5. Graf in izračun z napako
6. Sklep: primerjava in glavni vir napake
> Najprej poveš, kaj meriš in s čim, nato kako; sledijo podatki, njihova obdelava in na koncu ocena rezultata.

? Tri pravila za računanje z napakami so pravilna, eno ne sodi zraven. Katero?
- Pri vsoti se absolutni napaki seštejeta.
~ To pravilo drži: najslabša primera obeh meritev se pri seštevanju združita.
- Pri količniku se relativni napaki seštejeta.
~ To pravilo drži: tudi pri količniku se relativni napaki seštejeta, kot pri produktu.
- Pri kvadratu se relativna napaka podvoji.
~ To drži: kvadrat je produkt dveh enakih faktorjev, zato se ista relativna napaka sešteje dvakrat.
+ Pri razliki se absolutni napaki odštejeta.
> Pri razliki se absolutni napaki prav tako seštejeta. Rast $(4{,}5 \pm 0{,}4)\,\mathrm{cm}$ iz primera 1 ni natančna na $0$.

? Nika meri čas desetih nihajev in ga deli z $10$, namesto da bi merila en sam nihaj. Kaj je posledica?
- Napaka nihajnega časa se poveča, ker se napaka pri vsakem nihaju prišteje.
~ Napako povzroča roka ob začetku in koncu merjenja, ne vsak nihaj posebej; meri se le enkrat.
+ Napaka nihajnega časa se zmanjša na desetino, ker se napaka štoparice razdeli na deset nihajev.
- Nihajni čas pride desetkrat večji, zato je $g$ napačen.
~ Ker čas deli z $10$, dobi nihajni čas enega nihaja; pozabiti deljenja ne sme.
- Nič se ne spremeni, saj je štoparica ista.
~ Napaka štoparice je res enaka, a je zdaj razdeljena na desetkrat daljši čas.
> $\Delta T = \Delta t_{10}/10 = 0{,}02\,\mathrm{s}$; relativna napaka časa je desetkrat manjša.

? Luka je narisal graf $T^2$ proti $l$ in premico najboljšega prileganja. Z grafa odčitaj naklon in izračunaj težni pospešek (v $\mathrm{m/s^2}$).
:::risba graf
opis: Graf kvadrata nihajnega časa v odvisnosti od dolžine. Premica gre skozi izhodišče in skozi točko na premici (0,8; 3,2). Merske točke ležijo blizu premice: (0,2; 0,83), (0,4; 1,58), (0,6; 2,43).
x: 0 .. 1 | 0,1 | l [m]
y: 0 .. 4 | 0,5 | T^2 [s^2]
f: 4*x | modra | 0 .. 1
točka: 0,2; 0,83 | | desno | oranžna
točka: 0,4; 1,58 | | desno | oranžna
točka: 0,6; 2,43 | | desno | oranžna
točka: 0,8; 3,2 | (0,8; 3,2) | levo
:::
= 9,87 m/s² | 0,05
~ 4 | To je naklon $k$ v $\mathrm{s^2/m}$. Težni pospešek je $g = \dfrac{4\pi^2}{k}$.
~ 158 | Pomnožil si $4\pi^2 \cdot k$. Naklon je $\dfrac{4\pi^2}{g}$, zato $g = \dfrac{4\pi^2}{k}$.
~ 0,25 | To je $\dfrac{1}{k}$; manjka faktor $4\pi^2$.
> $k = \dfrac{3{,}2\,\mathrm{s^2}}{0{,}8\,\mathrm{m}} = 4{,}0\,\mathrm{s^2/m}$, $g = \dfrac{4\pi^2}{4{,}0} = 9{,}87\,\mathrm{m/s^2}$.

? Ana je izmerila $l = (0{,}500 \pm 0{,}002)\,\mathrm{m}$ in $T = (1{,}42 \pm 0{,}02)\,\mathrm{s}$ ter dobila $g = 9{,}79\,\mathrm{m/s^2}$. Napako je računala tako. **Korak 1:** $\delta_l = 0{,}002/0{,}500 = 0{,}4\,\%$. **Korak 2:** $\delta_T = 0{,}02/1{,}42 = 1{,}4\,\%$. **Korak 3:** $\delta_g = \delta_l + \delta_T = 1{,}8\,\%$. **Korak 4:** $\Delta g = 0{,}018 \cdot 9{,}79\,\mathrm{m/s^2} \approx 0{,}2\,\mathrm{m/s^2}$. Kateri korak je napačen?
- Korak 1.
~ Relativna napaka dolžine je pravilna: absolutna napaka, deljena z izmerjeno vrednostjo.
- Korak 2.
~ Tudi $\delta_T$ je pravilna; napaka je v tem, kako jo Ana uporabi naprej.
+ Korak 3.
- Korak 4.
~ Korak 4 pravilno pretvori relativno napako v absolutno; napačen je le zato, ker je napačen $\delta_g$.
> $T$ je v formuli na kvadrat, zato $\delta_g = 0{,}4\,\% + 2 \cdot 1{,}4\,\% = 3{,}2\,\%$ in $\Delta g \approx 0{,}3\,\mathrm{m/s^2}$.

:::simboli
l | dolžina nihala | | m | od pritrdišča do središča kroglice
t_{10} | čas desetih nihajev | | s |
T | nihajni čas | T = \frac{t_{10}}{10} | s |
g | težni pospešek | g = \frac{4\pi^2 l}{T^2} | m/s^2 |
x | izračunana količina | | | rezultat iz $a$ in $b$
a, b | izmerjeni količini | | |
\Delta x | absolutna napaka rezultata | | | enota kot $x$
\Delta a, \Delta b | absolutni napaki izmerjenih količin | | |
\delta_x | relativna napaka rezultata | \delta_x = \frac{\Delta x}{x} | – | navadno v odstotkih
\delta_a, \delta_b | relativni napaki izmerjenih količin | | – |
n | eksponent | | – |
\delta_g | relativna napaka težnega pospeška | \delta_g = \delta_l + 2\,\delta_T | – |
\delta_l | relativna napaka dolžine | \delta_l = \frac{\Delta l}{l} | – |
\delta_T | relativna napaka nihajnega časa | \delta_T = \frac{\Delta T}{T} | – |
\Delta g | absolutna napaka težnega pospeška | \Delta g = \delta_g \cdot g | m/s^2 |
\Delta l | absolutna napaka dolžine | | m |
\Delta T | absolutna napaka nihajnega časa | | s |
k | naklon premice $T^2(l)$ | k = \frac{4\pi^2}{g} | s^2/m |
T_A, T_B | nihajni čas v točkah A in B na premici | | s | na grafu beremo $T_A^2$ in $T_B^2$
l_A, l_B | dolžini v točkah A in B na premici | | m |
r | rast (razlika višin) | r = h_2 - h_1 | cm |
h_1, h_2 | višina lani in letos | | cm |
\Delta r | absolutna napaka rasti | \Delta r = \Delta h_1 + \Delta h_2 | cm |
\Delta h_1, \Delta h_2 | absolutni napaki višin | | cm |
\delta_r | relativna napaka rasti | \delta_r = \frac{\Delta r}{r} | – |
\mathrm{ITM} | indeks telesne mase | \mathrm{ITM} = \frac{m}{h^2} | kg/m^2 |
m | masa pacientke | | kg |
h | višina pacientke | | m |
\delta_\mathrm{ITM} | relativna napaka ITM | \delta_\mathrm{ITM} = \delta_m + 2\,\delta_h | – |
\delta_m | relativna napaka mase | \delta_m = \frac{\Delta m}{m} | – |
\delta_h | relativna napaka višine | \delta_h = \frac{\Delta h}{h} | – |
\Delta\mathrm{ITM} | absolutna napaka ITM | \Delta\mathrm{ITM} = \delta_\mathrm{ITM} \cdot \mathrm{ITM} | kg/m^2 |
:::

<<RACUN
vrednost: 182.0-102.0 | 80
vrednost: 0.2+0.2 | 0.4
vrednost: 153.0-148.5 | 4.5
vrednost: 0.4/4.5 | 0.089
vrednost: 0.2/153*100 | 0.13
vrednost: 64.0/1.72^2 | 21.63
vrednost: 0.5/64.0*100 | 0.78
vrednost: 0.01/1.72*100 | 0.58
vrednost: 0.78+2*0.58 | 1.94
vrednost: 0.0194*21.63 | 0.42
vrednost: (3.82-0.40)/(0.95-0.10) | 4.02
vrednost: 4*pi^2/4.02 | 9.82
vrednost: 4.02*0.50 | 2.01
vrednost: sqrt(2.01) | 1.42
vrednost: 2.25/4.02 | 0.56
vrednost: 4*pi^2*0.800/1.79^2 | 9.857
vrednost: 0.004/0.800*100 | 0.5
vrednost: 0.02/1.79*100 | 1.12
vrednost: 0.5+2*1.12 | 2.74
vrednost: 0.0274*9.857 | 0.27
vrednost: 0.2/10 | 0.02
vrednost: 3.2/0.8 | 4
vrednost: 4*pi^2/4.0 | 9.87
vrednost: 4*pi^2*4 | 157.9
vrednost: 4*pi^2*0.500/1.42^2 | 9.79
vrednost: 0.002/0.500*100 | 0.4
vrednost: 0.02/1.42*100 | 1.41
vrednost: 0.4+2*1.4 | 3.2
vrednost: 0.018*9.79 | 0.176
vrednost: 0.032*9.79 | 0.313
>>
