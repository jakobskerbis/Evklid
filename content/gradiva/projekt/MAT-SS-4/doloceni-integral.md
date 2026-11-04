---
naslov: Kako veliko je jezero?
cas: 1 teden
avtor: AI
stanje: pregledano
---

## Izziv

Kolikšna je ploščina jezera, ribnika ali parka v tvoji okolici? Izračunaj jo iz zemljevida z vsotami pravokotnikov in z določenim integralom ter ugotovi, kateri način je najbližje pravi ploščini.

## Potrebuješ

- spletni zemljevid z orodjem za merjenje razdalj (npr. Google Zemljevidi: desni klik na zemljevid, nato merjenje razdalje)
- natisnjeno zaslonsko sliko zemljevida ali sliko na tablici, kjer lahko rišeš
- ravnilo in svinčnik
- kalkulator, preglednico ali GeoGebro

## Koraki

1. Izberi jezero, ribnik ali park z ukrivljenim robom. Zemljevid povečaj, da lik zapolni zaslon, in naredi zaslonsko sliko.
2. Na sliki nariši os $x$ vzdolž najdaljše smeri lika: od najbolj leve točke ($x = 0$) do najbolj desne ($x = L$). Dolžino $L$ izmeri z orodjem na zemljevidu v metrih in z ravnilom na sliki v milimetrih. Iz obeh izračunaj merilo: koliko metrov v naravi pomeni $1\,\mathrm{mm}$ na sliki.
3. Os razdeli na $8$ enakih delov, $\Delta x = \frac{L}{8}$. V vsaki od sedmih notranjih delilnih točk nariši črto, pravokotno na os, in izmeri, kako široko je jezero vzdolž te črte. Širine $w_1, \dots, w_7$ pretvori v metre. Na robovih je $w_0 = w_8 = 0$. Če črta seka jezero dvakrat ali prečka otok, seštej le dele, ki so v vodi.
4. Širina je razlika med zgornjim in spodnjim robom, $w(x) = g(x) - f(x)$, zato je ploščina $\int_0^L w(x)\,dx$. Izračunaj vsoto pravokotnikov z $8$ deli, $S_8 = (w_1 + w_2 + \dots + w_7)\,\Delta x$, in s $4$ deli, $S_4 = (w_2 + w_4 + w_6) \cdot 2\Delta x$. V obeh je višina pravokotnika širina jezera na levem robu dela.
5. Rob jezera opiši s preprostim modelom: širina naj bo parabola z ničlama $0$ in $L$, ki gre skozi izmerjeno točko na sredini, $w(x) = k\,x\,(L - x)$, kjer $k$ določiš iz $w\!\left(\frac{L}{2}\right) = w_4$. Ploščino modela izračunaj z Newton-Leibnizovo formulo. Model in izmerjene točke nariši na isti graf.
6. Poišči primerjalno ploščino: uradni podatek o ploščini (spletna stran občine, parka ali enciklopedija) ali meritev v Google Zemlji v brskalniku (earth.google.com): z ravnilom (merjenje razdalje in ploščine) obkroži jezero in pot skleni v začetni točki, nato odčitaj ploščino.
7. Za $S_4$, $S_8$ in integral modela izračunaj odstopanje od primerjalne ploščine v odstotkih. Rezultate zapiši v $\mathrm{m^2}$ in v hektarih ($1\,\mathrm{ha} = 10\,000\,\mathrm{m^2}$).

## Kaj oddaš

Sliko zemljevida z vrisano osjo, delilnimi črtami in merilom, tabelo širin, izračune $S_4$, $S_8$ in integrala modela, graf modela z izmerjenimi točkami ter kratek komentar primerjave.

## Merila

- Na sliki so vrisani os, dolžina $L$ in delilne črte; merilo je izračunano, širine so pretvorjene v metre.
- Vsoti $S_4$ in $S_8$ sta pravilno izračunani s pravo širino delov.
- Integral modela je izračunan z Newton-Leibnizovo formulo, rezultat ima enoto $\mathrm{m^2}$ in je pretvorjen v hektare.
- Vsi trije rezultati so primerjani s primerjalno ploščino v odstotkih.
- Komentar razloži, zakaj je vsota z več pravokotniki navadno bližje pravi ploščini in kje se model s parabolo slabo prilega robu jezera.
