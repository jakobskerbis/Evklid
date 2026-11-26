# Prevod trditev v Lean (PV-13)

Ustvari `node scripts/lean-prevod.mjs --lekcije --porocilo …` (brez AI; Lean 4.36, Mathlib v4.36.0). Pri vsakem
merilu je imenovalec, interval je Wilsonov 95-%.

## Referenčni nabor (nabor-v2.json, 1.020 trditev)

| Merilo | k/n | % | 95 % interval |
|---|---|---|---|
| Prevedene trditve (v obsegu prevoda) / vse | 564/1020 | 55,3 | 52,2–58,3 |
| Dokazane / prevedene pravilne točne | 273/275 | 99,3 | 97,4–99,8 |
| Napačno dokazane / prevedene napačne | 0/282 | 0,0 | 0,0–1,3 |
| Neskladni prevodi / prevedene | 0/564 | 0,0 | 0,0–0,7 |
| Tuji aksiomi / prevedene | 0/564 | 0,0 | 0,0–0,7 |

Zaokroženi odgovori (»najvec« pod »dokazano«, npr. 0,414 za 1 − √2) se prevedejo točno in ostanejo nedokazani: 0 od 7 dokazanih.

| Skupina | prevedene | dokazane pravilne | napačno dokazane |
|---|---|---|---|
| abs | 39 | 19/19 | 0/20 |
| druge | 9 | 5/5 | 0/4 |
| ekvivalentno | 32 | 14/16 | 0/16 |
| identiteta | 18 | 9/9 | 0/9 |
| koren | 20 | 10/10 | 0/10 |
| koren-nicle | 20 | 10/10 | 0/10 |
| luknja | 20 | 10/10 | 0/10 |
| neenacba | 30 | 15/15 | 0/15 |
| neenacba2 | 54 | 27/27 | 0/27 |
| polinom | 80 | 40/40 | 0/40 |
| priblizek | 8 | 0/0 | 0/4 |
| racun | 44 | 22/22 | 0/22 |
| racun2 | 108 | 54/54 | 0/54 |
| sistem | 60 | 30/30 | 0/30 |
| skoraj | 16 | 5/5 | 0/8 |
| velika | 6 | 3/3 | 0/3 |

Zunaj obsega prevoda (ostanejo pri SymPy):

| Razlog | trditev |
|---|---|
| izraz zunaj obsega | 104 |
| relacija zunaj obsega | 97 |
| ukaz diff ni v obsegu prevoda | 94 |
| ukaz int ni v obsegu prevoda | 70 |
| ukaz units ni v obsegu prevoda | 41 |
| ukaz limit ni v obsegu prevoda | 40 |
| trditev zunaj obsega (približek, parameter ali vsa števila) | 5 |
| rešitev zunaj obsega | 3 |
| koren izraza s spremenljivko v identiteti | 2 |

## Napačni prevodi (lean-formalizacije-v1.json)

Nabor je napisal ločen model AI brez branja kode primerjave (ne človek).

| Merilo | k/n | % | 95 % interval |
|---|---|---|---|
| Zaznani napačni prevodi / napačni | 113/113 | 100,0 | 96,7–100,0 |
| Sprejeti pravilni prevodi / pravilni | 72/75 | 96,0 | 88,9–98,6 |

| Vrsta napake | zaznani |
|---|---|
| cela števila namesto realnih | 4/4 |
| celoštevilsko deljenje | 2/2 |
| dodana rešitev | 3/3 |
| dodatna predpostavka (oslabitev) | 5/5 |
| identiteta kot enačba | 2/2 |
| identiteta oslabljena na enake ničle | 1/1 |
| implikacija namesto ekvivalence | 4/4 |
| izpuščena absolutna vrednost | 3/3 |
| izpuščena enačba sistema | 2/2 |
| izpuščena rešitev | 6/6 |
| konstantna trditev | 3/3 |
| kvadrirana enačba namesto korenske | 1/1 |
| le preizkus rešitve (brez enoličnosti) | 2/2 |
| manjkajoč pogoj imenovalec ≠ 0 | 5/5 |
| manjkajoč pogoj koren ≥ 0 | 1/1 |
| manjkajoči oklepaji | 2/2 |
| napačen obseg korena | 1/1 |
| napačen pogoj za imenovalec | 1/1 |
| napačna asociativnost potenc | 1/1 |
| napačna prednost operacij | 1/1 |
| napačna spremenljivka | 3/3 |
| naravna števila namesto realnih | 3/3 |
| neenakost namesto enakosti | 1/1 |
| neenačba namesto enačbe | 1/1 |
| obrnjen znak neenačbe | 3/3 |
| obrnjena smer rešitve | 1/1 |
| odprto namesto zaprtega krajišča | 3/3 |
| pogoj kot predpostavka namesto konjunkcije | 1/1 |
| presek namesto unije | 1/1 |
| privzeti tip ℕ (brez tipa) | 3/3 |
| protislovne predpostavke (prazna trditev) | 3/3 |
| samo obratna smer | 5/5 |
| spremenjen koeficient | 3/3 |
| spremenjen predznak | 5/5 |
| spremenjena meja intervala | 1/1 |
| spremenjeno število | 1/1 |
| stroga namesto nestroge neenačbe | 1/1 |
| trivialna trditev (desna stran prepisana) | 1/1 |
| trivialna trditev | 1/1 |
| unija namesto preseka | 1/1 |
| x ^ (1/2) namesto korena | 2/2 |
| x^2 zapisano kot x*2 | 3/3 |
| zamenjan števec in imenovalec | 1/1 |
| zamenjana x in y v sistemu | 3/3 |
| zaokroženo število | 4/4 |
| zaprto namesto odprtega krajišča | 2/2 |
| ∃ namesto ∀ | 4/4 |
| ∨ namesto ∧ med enačbami sistema | 1/1 |
| ∨ namesto ∧ v rešitvi sistema | 1/1 |

Zavrnjeni pravilni prevodi (lažni alarm, prevod ostane brez dokaza):

- f-049: izrek ni prepoznan: znak »ℚ« ni dovoljen
- f-052: izrek ni prepoznan: eksponent ni celo število
- f-062: pogoji območja se ne ujemajo

## Bloki RACUN v lekcijah

Resnica ni označena; SymPy je te trditve že preveril (PV-04). Lean dokaže samo resnične trditve.

| Merilo | k/n | % | 95 % interval |
|---|---|---|---|
| Prevedene / vse trditve RACUN | 4504/5629 | 80,0 | 78,9–81,0 |
| Dokazane / prevedene | 3811/4504 | 84,6 | 83,5–85,6 |
| Neskladni prevodi / prevedene | 0/4504 | 0,0 | 0,0–0,1 |

Nedokazane prevedene trditve lekcij (prvih 30):

- BIO-OS-8/celicna-delitev.md#11: `["value",["140/24","5.8"]]`
- BIO-OS-8/dna-in-dedna-informacija.md#11: `["value",["2000000/6","333333.33"]]`
- BIO-OS-8/izlocala.md#6: `["value",["178.5/180*100","99.2"]]`
- BIO-OS-8/od-celice-do-organizma.md#1: `["value",["30000000000000/31536000","951293.76"]]`
- BIO-OS-8/od-celice-do-organizma.md#6: `["value",["25000/30000","0.83"]]`
- BIO-OS-8/okostje-in-misice.md#4: `["value",["20/30*100","66.7"]]`
- BIO-OS-8/okostje-in-misice.md#6: `["value",["10/30*100","33.3"]]`
- BIO-OS-8/prebavila-in-prehrana.md#9: `["value",["370/1084*100","34.13"]]`
- BIO-OS-8/prebavila-in-prehrana.md#11: `["value",["10000/600","16.67"]]`
- BIO-OS-9/biotehnologija.md#10: `["value",["400/60","6.67"]]`
- BIO-OS-9/biotehnologija.md#15: `["value",["100/277","0.36"]]`
- BIO-OS-9/biotska-pestrost.md#5: `["value",["20273/510000000*100","0.004"]]`
- BIO-OS-9/biotska-pestrost.md#13: `["value",["1-(0.97^2+3*0.01^2)","0.06"]]`
- BIO-OS-9/dedovanje-lastnosti.md#1: `["value",["6022/2001","3.01"]]`
- BIO-OS-9/dedovanje-lastnosti.md#5: `["value",["412/136","3.03"]]`
- BIO-OS-9/dedovanje-lastnosti.md#8: `["value",["2/3*412","274.67"]]`
- BIO-OS-9/ekosistemi-in-biomi.md#10: `["value",["40*20/6371","0.13"]]`
- BIO-OS-9/naravni-izbor.md#5: `["value",["180/270","0.67"]]`
- BIO-OS-9/snovi-v-zivih-bitjih.md#6: `["value",["185/17","10.9"]]`
- BIO-OS-9/zgodovina-zivljenja.md#4: `["value",["0.3/4600*100","0.0065"]]`
- BIO-OS-9/zgodovina-zivljenja.md#13: `["value",["24*(1-3500/4600)","5.74"]]`
- BIO-OS-9/zgodovina-zivljenja.md#14: `["value",["24*(1-2400/4600)","11.48"]]`
- BIO-OS-9/zgodovina-zivljenja.md#15: `["value",["24*(1-450/4600)","21.65"]]`
- BIO-OS-9/zgodovina-zivljenja.md#16: `["value",["24*(1-252/4600)","22.69"]]`
- BIO-OS-9/zgodovina-zivljenja.md#17: `["value",["24*(1-66/4600)","23.66"]]`
- BIO-OS-9/zgodovina-zivljenja.md#18: `["value",["0.3/4600*86400","5.63"]]`
- BIO-OS-9/zgodovina-zivljenja.md#19: `["value",["450/4600*105","10.27"]]`
- BIO-OS-9/zgodovina-zivljenja.md#20: `["value",["0.3/4600*105000","6.85"]]`
- BIO-SS-1/celicno-dihanje-in-vrenje.md#12: `["value",["10000000/30","333333.33"]]`
- BIO-SS-1/fotosinteza.md#7: `["value",["14.4*180/264","9.82"]]`
