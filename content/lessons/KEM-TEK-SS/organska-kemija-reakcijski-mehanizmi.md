---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tilen na krožku za tekmovanje razlaga: »Zaslon LCD v starejšem telefonu vsebuje kiralni dodatek, ki tekoče kristale zasuka v vijačnico. Nekateri taki dodatki so estri oktan-2-ola. Če kemik iz (R)-2-bromooktana z $\mathrm{NaOH}$ naredi alkohol, dobi (R)-oktan-2-ol. Skupina OH pač sede na mesto, kjer je bil Br.«

Zveni logično, a je narobe. Pri pravih pogojih nastane (S)-oktan-2-ol, pri drugih pa zmes obeh oblik ali celo alken namesto alkohola. Napačna oblika dodatka zasuka kristale v napačno smer in zaslon ne deluje.

Da ugotoviš, kaj res nastane, ni dovolj vedeti, *katera* reakcija poteče. Vedeti moraš, *kako* poteče: v katerem vrstnem redu se vezi trgajo in tvorijo ter s katere strani pride napadalec. Temu rečemo **reakcijski mehanizem**.

## Razlaga

**Znano: baza vzame proton.** Pri kislinah in bazah si spoznal, da $\mathrm{OH^-}$ s prostim elektronskim parom zgrabi $\mathrm{H^+}$. Isti par lahko napade tudi atom ogljika, ki je delno pozitiven. Delec, ki z elektronskim parom napade ogljik, imenujemo **nukleofil** (»ljubitelj jedra«). Delec, ki sprejme elektronski par, je **elektrofil**.

**Razlika 1: kaj napade $\mathrm{OH^-}$.** V 2-bromobutanu je vez $\mathrm{C–Br}$ polarna, ker je brom bolj elektronegativen. Ion $\mathrm{OH^-}$ ima dve možnosti:

- napade ogljik z bromom; brom odide kot $\mathrm{Br^-}$ (**izstopajoča skupina**), na njegovo mesto pride OH. To je **substitucija**: ena skupina zamenja drugo.
- vzame proton s sosednjega ogljika (ogljik $\beta$); hkrati odide $\mathrm{Br^-}$ in med ogljikoma nastane dvojna vez. To je **eliminacija**: iz molekule odstopi HBr.

Isti reagent je enkrat nukleofil, drugič baza. Visoka temperatura, močna in velika baza ter razvejan halogenoalkan dajejo prednost eliminaciji: velika baza se težko prebije do ogljika, proton na robu molekule pa doseže zlahka.

**Razlika 2: eliminacija in adicija sta si obratni.** Pri **adiciji** se dvojna vez odpre in na oba ogljika se nekaj veže. Pri $\mathrm{HBr}$ najprej elektrofil $\mathrm{H^+}$ zgrabi elektrone dvojne vezi. Nastane **karbokation**, ion s pozitivnim ogljikom, ki ima le tri vezi. Nato se nanj veže $\mathrm{Br^-}$.

Karbokation je stabilnejši, če ima pozitivni ogljik več alkilnih skupin, ker te potiskajo elektrone proti njemu: terciarni > sekundarni > primarni. Pozitivni naboj ostane na tistem ogljiku dvojne vezi, na katerega se $\mathrm{H^+}$ *ni* vezal. Zato se $\mathrm{H^+}$ veže na tisti ogljik dvojne vezi, ki že ima več vodikov (**Markovnikovo pravilo**). V simulaciji spodaj »Vrste organskih reakcij« izberi najprej »Eliminacija vode (dehidracija)«, nato »Adicija vode (hidratacija)«. Opazi, da sta reaktant in produkt zamenjala vlogi.

**Razlika 3: en korak ali dva.** Substitucija in eliminacija imata vsaka dve poti. V preglednici je RX halogenoalkan, Nu nukleofil in B baza; zadnjo vrstico razložimo pri stereokemiji.

| | $\mathrm{S_N2}$ | $\mathrm{S_N1}$ | E2 |
|---|---|---|---|
| koraki | en, hkraten | dva, prek karbokationa | en, hkraten |
| hitrost | $k \cdot [\mathrm{RX}] \cdot [\mathrm{Nu}]$ | $k \cdot [\mathrm{RX}]$ | $k \cdot [\mathrm{RX}] \cdot [\mathrm{B}]$ |
| substrat | metil > primarni > sekundarni | terciarni > sekundarni | sekundarni, terciarni |
| stereokemija | inverzija | racemizacija | H in X anti |

Hitrost reakcije je sorazmerna koncentracijam delcev, ki sodelujejo v najpočasnejšem koraku; sorazmernostni faktor $k$ je konstanta hitrosti. Pri $\mathrm{S_N2}$ nukleofil napade ogljik z nasprotne strani broma, ker tam ni ničesar na poti. V edinem koraku sta torej oba delca:

$$v_2 = k_2 \cdot [\mathrm{RBr}] \cdot [\mathrm{OH^-}]$$

Pri $\mathrm{S_N1}$ najprej počasi odide $\mathrm{Br^-}$, nato nukleofil hitro zapolni prazno mesto. V počasnem koraku nukleofila ni, zato njegova koncentracija na hitrost ne vpliva:

$$v_1 = k_1 \cdot [\mathrm{RBr}]$$

E1 je dvojček $\mathrm{S_N1}$: iz istega karbokationa odide $\mathrm{H^+}$ namesto vezave nukleofila. Pri eliminaciji večinoma nastane bolj substituirani alken, torej tisti z več alkilnimi skupinami na ogljikih dvojne vezi (**Zajcevo pravilo**).

:::premisli
Zakaj 2-bromo-2-metilpropan s hidroksidom skoraj ne reagira po $\mathrm{S_N2}$, čeprav je vez $\mathrm{C–Br}$ enako polarna kot v bromometanu?
---
Pri $\mathrm{S_N2}$ mora nukleofil priti do ogljika z nasprotne strani broma. Tam pri terciarnem ogljiku stojijo tri metilne skupine in mu zaprejo pot. Terciarni halogenoalkan zato reagira po $\mathrm{S_N1}$ ali E.
:::

**Stereokemija.** Ogljik s štirimi različnimi substituenti je **stereocenter**. Molekula s takim centrom je **kiralna**: obstaja kot dve zrcalni sliki, ki se ne prekrijeta (**enantiomera**), kot leva in desna roka. Oznako določiš s pravili CIP: substituentom daš prioritete po vrstnem številu vezanega atoma ($\mathrm{Br} > \mathrm{O} > \mathrm{C} > \mathrm{H}$). Če sta vezana atoma enaka, odločajo atomi, ki so vezani nanju. Najnižjo obrneš stran od sebe; če si preostale sledijo v smeri urinega kazalca, je **R**, sicer **S**.

Enantiomera zasučeta ravnino polarizirane svetlobe za enak kot v nasprotni smeri. Zmes $1 : 1$ (**racemna zmes**) je optično neaktivna.

- $\mathrm{S_N2}$: nukleofil napade od zadaj, preostale tri skupine se obrnejo kot dežnik v vetru. To je **inverzija**.
- $\mathrm{S_N1}$: karbokation je planaren, nukleofil ga napade z obeh strani enako verjetno. Nastane racemna zmes.
- E2: H in izstopajoča skupina morata stati na nasprotnih straneh vezi C–C (**anti**).
- Adicija $\mathrm{Br_2}$: atoma broma se vežeta z nasprotnih strani (anti). Iz cikloheksena nastane *trans*-1,2-dibromocikloheksan.

Pri dvojni vezi se skupine ne vrtijo. Če ima vsak ogljik dvojne vezi dva različna substituenta, obstajata izomera **Z** (prioritetni skupini na isti strani) in **E** (na nasprotnih straneh).

:::premisli
Optično čisti terciarni halogenoalkan s stereocentrom pustiš stati v vodi, dokler ne zreagira. Ali bo produkt sukal ravnino polarizirane svetlobe?
---
Ne (oziroma skoraj ne). Prek planarnega karbokationa nastaneta oba enantiomera v razmerju približno $1 : 1$; njuna zasuka se izničita.
:::

## Rešeni primeri

### Primer 1 (lažji): adicija in masa produkta

Na $5{,}611\,\mathrm{g}$ 2-metilpropena uvajamo $\mathrm{HBr}$ v prebitku. Kateri produkt nastane pretežno in kolikšna je njegova masa pri popolni pretvorbi?

**Podatki:** $m(\mathrm{C_4H_8}) = 5{,}611\,\mathrm{g}$, $M(\mathrm{C_4H_8}) = 56{,}11\,\mathrm{g/mol}$, $M(\mathrm{C_4H_9Br}) = 137{,}02\,\mathrm{g/mol}$, $\mathrm{HBr}$ v prebitku
**Iščemo:** produkt in njegovo maso $m$

:::formula
Markovnikovo pravilo; $n = \dfrac{m}{M}$; razmerje $1 : 1$
:::

**Rešitev:**

1. Dvojna vez je med $\mathrm{CH_2}$ in ogljikom z dvema metiloma. $\mathrm{H^+}$ se veže na $\mathrm{CH_2}$, ker tako nastane terciarni karbokation $(\mathrm{CH_3})_3\mathrm{C^+}$.
2. Nanj se veže $\mathrm{Br^-}$: nastane 2-bromo-2-metilpropan.
3. $n = \dfrac{5{,}611\,\mathrm{g}}{56{,}11\,\mathrm{g/mol}} = 0{,}1000\,\mathrm{mol}$; adicija je $1 : 1$, zato je toliko tudi produkta.
4. $m = 0{,}1000\,\mathrm{mol} \cdot 137{,}02\,\mathrm{g/mol} = 13{,}70\,\mathrm{g}$.

Odgovor: nastane $13{,}70\,\mathrm{g}$ 2-bromo-2-metilpropana.

### Primer 2: kinetika razkrije mehanizem

Pri $[\mathrm{RBr}] = 0{,}10\,\mathrm{mol/L}$ in $[\mathrm{OH^-}] = 0{,}10\,\mathrm{mol/L}$ je začetna hitrost $2{,}0 \cdot 10^{-5}\,\mathrm{mol/(L\,s)}$. Kolikšna bo pri $[\mathrm{RBr}] = 0{,}050\,\mathrm{mol/L}$ in $[\mathrm{OH^-}] = 0{,}30\,\mathrm{mol/L}$, če reakcija poteka po $\mathrm{S_N2}$, in kolikšna, če po $\mathrm{S_N1}$?

**Podatki:** $v = 2{,}0 \cdot 10^{-5}\,\mathrm{mol/(L\,s)}$ pri $0{,}10\,\mathrm{mol/L}$ obeh; nove koncentracije $0{,}050\,\mathrm{mol/L}$ (RBr) in $0{,}30\,\mathrm{mol/L}$ ($\mathrm{OH^-}$)
**Iščemo:** novo hitrost za oba mehanizma

:::formula
$v_2 = k_2 \cdot [\mathrm{RBr}] \cdot [\mathrm{OH^-}]$ in $v_1 = k_1 \cdot [\mathrm{RBr}]$
:::

**Rešitev:**

1. $\mathrm{S_N2}$: $k_2 = \dfrac{2{,}0 \cdot 10^{-5}}{0{,}10 \cdot 0{,}10} = 2{,}0 \cdot 10^{-3}\,\mathrm{L/(mol\,s)}$.
2. $v_2 = 2{,}0 \cdot 10^{-3} \cdot 0{,}050 \cdot 0{,}30 = 3{,}0 \cdot 10^{-5}\,\mathrm{mol/(L\,s)}$; hitrost naraste, ker trikratni $\mathrm{OH^-}$ preglasi polovični RBr.
3. $\mathrm{S_N1}$: $k_1 = \dfrac{2{,}0 \cdot 10^{-5}}{0{,}10} = 2{,}0 \cdot 10^{-4}\,\mathrm{s^{-1}}$.
4. $v_1 = 2{,}0 \cdot 10^{-4} \cdot 0{,}050 = 1{,}0 \cdot 10^{-5}\,\mathrm{mol/(L\,s)}$; $\mathrm{OH^-}$ ni v počasnem koraku.

Odgovor: po $\mathrm{S_N2}$ $3{,}0 \cdot 10^{-5}\,\mathrm{mol/(L\,s)}$, po $\mathrm{S_N1}$ $1{,}0 \cdot 10^{-5}\,\mathrm{mol/(L\,s)}$. Meritev tako loči mehanizma.

### Primer 3 (težji): kiralni dodatek za zaslon

Iz optično čistega (R)-2-bromooktana in $\mathrm{NaOH}$ v vodnem acetonu pripravijo oktan-2-ol za kiralni dodatek zaslona. Čisti (S)-oktan-2-ol bi v polarimetru zasukal ravnino za $+9{,}90°$, vzorec produkta jo zasuka za $+7{,}92°$. Katera oblika prevladuje in kolikšna deleža enantiomerov sta v produktu?

**Podatki:** izhodna snov (R), $\alpha_0 = +9{,}90°$ za čisti (S), izmerjeno $\alpha = +7{,}92°$
**Iščemo:** prevladujoči enantiomer, deleža $x_S$ in $x_R$

:::formula
$p = \dfrac{\alpha}{\alpha_0}$; $x_S = \dfrac{1 + p}{2}$; $x_R = \dfrac{1 - p}{2}$
:::

**Rešitev:**

1. Prioritete v bromidu: $\mathrm{Br} > \mathrm{C_6H_{13}} > \mathrm{CH_3} > \mathrm{H}$; v alkoholu $\mathrm{OH} > \mathrm{C_6H_{13}} > \mathrm{CH_3} > \mathrm{H}$. Heksil je pred metilom, ker ima njegov prvi ogljik vezan še en C, metilni pa le H. OH zasede isto mesto v vrstnem redu kot Br.
2. $\mathrm{S_N2}$ obrne geometrijo; ker je vrstni red enak, se R spremeni v S. Tilen se je motil.
3. Vzorec suče v smer (S), a manj od čistega: del je reagiral po $\mathrm{S_N1}$ in se racemiziral. Racemni del ne suče, zato je zasuk sorazmeren presežku (S) nad (R): $p = \dfrac{7{,}92}{9{,}90} = 0{,}80$.
4. Iz $x_S - x_R = p$ in $x_S + x_R = 1$ izračunaj deleža sam, nato preveri.

:::premisli
Kolikšna sta $x_S$ in $x_R$?
---
$x_S = \dfrac{1 + 0{,}80}{2} = 0{,}90$ in $x_R = \dfrac{1 - 0{,}80}{2} = 0{,}10$: produkt vsebuje $90\,\%$ (S) in $10\,\%$ (R) oktan-2-ola.
:::

## Pogoste napake

- **»Nova skupina sede na mesto stare.«** Pri $\mathrm{S_N2}$ nukleofil pride z nasprotne strani in geometrija se obrne. Nariši napad od zadaj, preden določiš konfiguracijo.
- **»Inverzija vedno pomeni R → S.«** Črka je odvisna od prioritet, ne od geometrije same. Če nova skupina ne zasede istega mesta v vrstnem redu kot stara, črka lahko ostane. Vedno znova določi prioritete.
- **Markovnikovo pravilo narobe.** »Br gre tja, kjer je več H« je zamenjava. $\mathrm{H^+}$ gre na ogljik z več H, ker tako nastane stabilnejši karbokation; Br pride na bolj substituirani ogljik.
- **Več nukleofila pospeši $\mathrm{S_N1}$.** Ne: nukleofil ni v počasnem koraku, zato $v_1$ od njega ni odvisna.
- **Pozabljeni ali izmišljeni stereoizomeri.** But-2-en ima izomera E in Z. 2-bromo-2-metilpropan pa nima stereocentra (tri enake metilne skupine), zato tu ni enantiomerov.

## Povzetek

- Nukleofil napade ogljik, baza vzame $\beta$-H: isti $\mathrm{OH^-}$ da substitucijo ali eliminacijo. Toplota, močna velika baza in razvejan substrat dajejo eliminacijo.
- $\mathrm{S_N2}$: en korak, napad od zadaj, inverzija, $v = k[\mathrm{RX}][\mathrm{Nu}]$, najlažje metilni in primarni substrati.
- $\mathrm{S_N1}$ in E1: prek karbokationa (terciarni > sekundarni > primarni), $v = k[\mathrm{RX}]$, racemizacija.
- Adicija HX: Markovnikovo pravilo. Eliminacija: Zajcevo pravilo, pri E2 sta H in X anti. Adicija $\mathrm{Br_2}$ je anti.
- Stereocenter ima štiri različne substituente; R/S po prioritetah CIP; E/Z pri dvojni vezi. Racemna zmes ne suče svetlobe.

## Drugače: Na sliki

:::risba skica
opis: Napad pri SN2. Na levi je hidroksidni ion OH⁻, puščica kaže od njega proti ogljiku C v sredini. Na desni je brom, druga puščica kaže, da brom odide kot bromidni ion. Napad poteka z nasprotne strani broma.
območje: 0; 0 .. 10; 3
enota: 30
napis: 1; 1,5 | OH⁻ | sredina | debelo
puščica: 1,9; 1,5 -> 4,2; 1,5 | napad od zadaj | nad
napis: 5; 1,5 | C | sredina | debelo
puščica: 5,8; 1,5 -> 8,1; 1,5 | Br⁻ odide | nad
napis: 9; 1,5 | Br | sredina | debelo
:::

Na ogljiku so poleg broma še tri skupine. Pred napadom kažejo proti levi, kot rebra dežnika. V prehodnem stanju ležijo v ravnini skozi ogljik, OH in Br sta delno vezana na nasprotnih straneh. Ko Br odide, kažejo tri skupine na desno. Dežnik se je obrnil.

Pri $\mathrm{S_N1}$ bi namesto puščice z leve najprej odšel Br. Ostal bi ploščat karbokation, na katerega lahko OH pride z leve ali z desne.

## Drugače: Iz vsakdanjega življenja

Pomisli na menjavo baterije v telefonu.

- **$\mathrm{S_N2}$** je menjava, pri kateri novo baterijo potiskaš v ležišče z ene strani in ta staro izrine na drugo. Delo je hitrejše, če imaš več novih baterij pri roki, in če ležišče z zadnje strani ni zastrto.
- **$\mathrm{S_N1}$** je servis, kjer najprej počasi odlepijo staro baterijo. Ko je zunaj, novo vstavijo v trenutku. Tempo določa le odlepljanje, zato ga kup novih baterij ne pospeši.
- **Eliminacija** je kot to, da serviser namesto nove baterije odstrani še sosednji vijak in ohišje stisne skupaj: nič novega ne pride notri, dva dela gresta ven.

Tudi kabel polnilnika je povezan s tem: vinilklorid za izolacijo iz PVC dobijo z eliminacijo $\mathrm{HCl}$ iz 1,2-dikloroetana.

## Preveri se

? Katera trditev o reakciji $\mathrm{S_N2}$ je pravilna?
- Nukleofil napade ogljik z iste strani, kjer je izstopajoča skupina.
~ Tam je pot zaprta z bromom. Napad je od zadaj, zato se geometrija obrne.
+ Poteka v enem koraku; nukleofil napade od zadaj in geometrija se obrne.
- Hitrost je odvisna le od koncentracije halogenoalkana.
~ To velja za $\mathrm{S_N1}$. Pri $\mathrm{S_N2}$ sta v edinem koraku oba delca, zato $v = k[\mathrm{RX}][\mathrm{Nu}]$.
- Najhitreje poteka pri terciarnih halogenoalkanih.
~ Terciarni ogljik je od zadaj zastrt s tremi alkilnimi skupinami; tam prevladata $\mathrm{S_N1}$ in eliminacija.
> $\mathrm{S_N2}$ je en hkraten korak z napadom od zadaj (inverzija), najlažje pri metilnih in primarnih substratih.

? Spojino na sliki segrevamo s $\mathrm{KOH}$ v etanolu. Koliko različnih alkenov (štej tudi stereoizomere) lahko nastane z eliminacijo $\mathrm{HBr}$?
:::risba molekula
opis: Strukturna formula 2-bromobutana: veriga štirih atomov ogljika, na drugi ogljik je vezan brom, na vse ostale proste položaje pa atomi vodika.
---
    H   Br  H   H
    |   |   |   |
H – C – C – C – C – H
    |   |   |   |
    H   H   H   H
:::
= 3
~ 2 | Pozabil si, da ima but-2-en izomera E in Z.
~ 1 | To je le glavni produkt po Zajcevem pravilu; nastaneta tudi but-1-en in drugi izomer but-2-ena.
> H lahko odide z ogljika 1 (but-1-en) ali z ogljika 3 (but-2-en). But-2-en ima na vsakem ogljiku dvojne vezi H in $\mathrm{CH_3}$, zato obstaja kot E in Z. Skupaj $3$ alkeni.

? Nik je rešil nalogo o adiciji $\mathrm{HBr}$ na 2-metilpropen. Kateri korak je napačen?
(1) $\mathrm{H^+}$ se veže na ogljik, ki ima več vodikov. (2) Nastane terciarni karbokation $(\mathrm{CH_3})_3\mathrm{C^+}$. (3) $\mathrm{Br^-}$ ga napade z obeh strani ploskve. (4) Nastane racemna zmes (R)- in (S)-2-bromo-2-metilpropana.
- korak (1)
~ Ta korak je Markovnikovo pravilo in je pravilen: tako nastane stabilnejši karbokation.
- korak (2)
~ Pozitivni ogljik ima tri metilne skupine, zato je karbokation res terciaren.
- korak (3)
~ Karbokation je planaren, napad z obeh strani je mogoč; napaka nastane šele pri sklepu.
+ korak (4)
> Ogljik z bromom nosi tri enake metilne skupine, zato ni stereocenter. Nastane ena sama, nekiralna spojina.

? Kateri bromid hitreje reagira z vodo po mehanizmu $\mathrm{S_N1}$?
+ 2-bromo-2-metilpropan (terciarni)
- 1-bromobutan (primarni)
~ Manj zastrt ogljik pomaga pri $\mathrm{S_N2}$. Pri $\mathrm{S_N1}$ šteje stabilnost karbokationa, primarni je najmanj stabilen.
- oba enako hitro, ker imata isto formulo $\mathrm{C_4H_9Br}$
~ Enaka formula ne pomeni enake zgradbe. Hitrost določa, kako stabilen karbokation nastane.
> Terciarni karbokation stabilizirajo tri alkilne skupine, zato je prvi korak $\mathrm{S_N1}$ pri terciarnem bromidu mnogo hitrejši.

? Proizvajalec dodatka za zaslone potrebuje čim bolj čisti (R)-oktan-2-ol. Kaj izbere?
- (R)-2-bromooktan in $\mathrm{NaOH}$ v vodnem acetonu pri sobni temperaturi
~ $\mathrm{S_N2}$ obrne geometrijo; iz (R)-bromida dobi (S)-alkohol, ker OH zasede isto mesto prioritete kot Br.
+ (S)-2-bromooktan in $\mathrm{NaOH}$ v vodnem acetonu pri sobni temperaturi
- (S)-2-bromooktan v topli vodi brez $\mathrm{NaOH}$
~ V vodi s šibkim nukleofilom poteka $\mathrm{S_N1}$ prek planarnega karbokationa: nastane skoraj racemna zmes.
- (R)-2-bromooktan in $\mathrm{KOH}$ v vročem etanolu
~ Vroče in močna baza dajeta prednost eliminaciji: nastanejo okteni, ne alkohol.
> $\mathrm{S_N2}$ z inverzijo: iz (S)-bromida nastane (R)-alkohol. Nizka temperatura zavira eliminacijo.

<<RACUN
vrednost: 5.611/56.11 | 0.1000
vrednost: 0.1000*137.02 | 13.70
molska: C4H8 | 56.11
molska: C4H9Br | 137.02
kemija: C4H8 + HBr -> C4H9Br
vrednost: 2.0e-5/(0.10*0.10) | 2.0e-3
vrednost: 2.0e-3*0.050*0.30 | 3.0e-5
vrednost: 2.0e-5/0.10 | 2.0e-4
vrednost: 2.0e-4*0.050 | 1.0e-5
vrednost: 7.92/9.90 | 0.80
vrednost: (1+0.80)/2 | 0.90
vrednost: (1-0.80)/2 | 0.10
kemija: C8H17Br + NaOH -> C8H18O + NaBr
kemija: C4H9Br + KOH -> C4H8 + KBr + H2O
kemija: C2H4Cl2 -> C2H3Cl + HCl
kemija: C6H10 + Br2 -> C6H10Br2
>>

:::simboli
v_2 | hitrost reakcije $\mathrm{S_N2}$ | v_2 = k_2 \cdot [\mathrm{RBr}] \cdot [\mathrm{OH^-}] | mol/(L\,s)
v_1 | hitrost reakcije $\mathrm{S_N1}$ | v_1 = k_1 \cdot [\mathrm{RBr}] | mol/(L\,s)
k_2 | konstanta hitrosti $\mathrm{S_N2}$ | | L/(mol\,s)
k_1 | konstanta hitrosti $\mathrm{S_N1}$ | | s^{-1}
\mathrm{RBr} | halogenoalkan | | – | $[\mathrm{RBr}]$ je njegova koncentracija v mol/L
\mathrm{OH^-} | hidroksidni ion (nukleofil) | | – | $[\mathrm{OH^-}]$ je njegova koncentracija v mol/L
\alpha | izmerjeni kot zasuka ravnine | | ° | vzorec produkta
\alpha_0 | kot zasuka čistega (S)-enantiomera | | °
p | enantiomerni presežek | p = \dfrac{\alpha}{\alpha_0} | – | $p = x_S - x_R$
x_S | delež (S)-enantiomera | x_S = \dfrac{1 + p}{2} | –
x_R | delež (R)-enantiomera | x_R = \dfrac{1 - p}{2} | –
n | množina | n = \dfrac{m}{M} | mol
m | masa | | g
M | molska masa | | g/mol
:::
