# Status generatorjev nalog (PV-10), 2026-11-26

- Commit: `2a124c4f4c579d7fe04c1cff78d024ff5aad6baa`; ukaz: `node scripts/status-generatorjev.mjs --semena 5 --strogo --json docs/meritve/generatorji-2026-11-26.json --porocilo docs/meritve/generatorji-2026-11-26.md --dodatek docs/meritve/generatorji-2026-11-26-pregled.md`; brez modela AI; SymPy prek server/cas.js (ukaz korak, PV-06)
- Vzorec: vsak generator, ravni 1–3, semena 1–5 (prva tema generatorja). Imenovalec deležev so generatorji (704).
- Status generatorja je najšibkejši člen trditev »račun« in »korak« v vzorcu (statusOdgovora); »odgovor« v status
  ne šteje (skladnost prikaza). Rešitev pokaže odgovor pri vseh številskih nalogah: 332/704 (47,2 %; 95-% interval 43,5 %–50,9 %) generatorjev.
- Generator s statusom nižjim od
  »napaka« ni napačen; trditev brez statusa ni napačna, le noben program je ne preveri.

## Generatorji po statusu

| Status | Generatorjev |
| --- | --- |
| dokazano | 0/704 (0,0 %; 95-% interval 0,0 %–0,5 %) |
| izracunano | 0/704 (0,0 %; 95-% interval 0,0 %–0,5 %) |
| numericno | 12/704 (1,7 %; 95-% interval 1,0 %–3,0 %) |
| delno | 454/704 (64,5 %; 95-% interval 60,9 %–67,9 %) |
| napaka | 3/704 (0,4 %; 95-% interval 0,1 %–1,2 %) |
| nepreverjeno | 235/704 (33,4 %; 95-% interval 30,0 %–36,9 %) |

## Trditve po viru

| Vir | Trditev | izracunano | numericno | delno | napaka | nepreverjeno |
| --- | --- | --- | --- | --- | --- | --- |
| racun | 16.948 | 0 | 1.825 | 5.435 | 7 | 9.681 |
| korak | 305 | 301 | 0 | 0 | 0 | 4 |
| odgovor | 6.690 | 0 | 5.563 | 0 | 0 | 1.127 |

## Zaznane napake

- `periodni-sistem` (raven 2, seme 5, racun): `N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 17 - 10 = 7`
- `periodni-sistem` (raven 3, seme 5, racun): `N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 17 - 10 = 7`
- `dod-fiz-ss-plinska-enacba` (raven 2, seme 1, racun): `n = \dfrac{pV}{RT} = \dfrac{1{,}6 \cdot 10^{7} \cdot 4{,}6 \cdot 10^{-2}}{8{,}31 \cdot 303}\ \mathrm{mol} \approx 297{,}`
- `dod-fiz-ss-plinska-enacba` (raven 2, seme 2, racun): `n = \dfrac{pV}{RT} = \dfrac{1{,}2 \cdot 10^{7} \cdot 4{,}4 \cdot 10^{-2}}{8{,}31 \cdot 287}\ \mathrm{mol} \approx 228{,}`
- `dod-fiz-ss-plinska-enacba` (raven 2, seme 4, racun): `n = \dfrac{pV}{RT} = \dfrac{1{,}3 \cdot 10^{7} \cdot 3{,}2 \cdot 10^{-2}}{8{,}31 \cdot 278}\ \mathrm{mol} \approx 185{,}`
- `exk-mole` (raven 2, seme 1, racun): `1.1250 \cdot 6.022 \approx 6.775 \times 10^{23}`
- `exk-mole` (raven 2, seme 3, racun): `1.6667 \cdot 6.022 \approx 10.037 \times 10^{23}`

## Koraki z izgubljeno rešitvijo

Izgubljene posamezne rešitve (a² = 289 → a = 17): pravilno le, če jih izloči kontekst naloge (dolžina,
koncentracija, celo število). Brez statusa. Izgubljen interval ali zoženo območje je napaka (zgoraj).

- `exk-equilibrium` (raven 3, seme 1): `\dfrac{x^2}{(2 - x)^2} = 25 → \dfrac{x}{2 - x} = 5` (izgubljena rešitev x = 5/2)
- `exk-equilibrium` (raven 3, seme 2): `\dfrac{x^2}{(1.5 - x)^2} = 9 → \dfrac{x}{1.5 - x} = 3` (izgubljena rešitev x = 2.25000000000000)
- `exk-equilibrium` (raven 3, seme 3): `\dfrac{x^2}{(0.5 - x)^2} = 25 → \dfrac{x}{0.5 - x} = 5` (izgubljena rešitev x = 0.625000000000000)
- `exk-equilibrium` (raven 3, seme 4): `\dfrac{x^2}{(0.5 - x)^2} = 9 → \dfrac{x}{0.5 - x} = 3` (izgubljena rešitev x = 0.750000000000000)

## Pregled zaznanih napak

Vseh sedem trditev s statusom »napaka« (trije generatorji) je pregledal model AI (ne človek) proti besedilu naloge
in kodi generatorja.

- `dod-fiz-ss-plinska-enacba`, raven 2 (semena 1, 2, 4): **prava napaka zapisa.** Tlak v nalogi je npr. 163 bar,
  rešitev ga izpiše na eno decimalko znanstvenega zapisa ($1{,}6 \cdot 10^{7}\ \mathrm{Pa}$), rezultat pa izračuna iz
  163 bar. Prikazani račun da 292,3 mol, zapisano je 297,8 mol (odgovor naloge 297,8 je pravilen). Popravek v
  ločenem PR: tlak izpisan z dvema decimalkama.
- `exk-mole`, raven 2 (semena 1, 3): **prava napaka zapisa.** $1.1250 \cdot 6.022 \approx 6.775 \times 10^{23}$:
  levi strani manjka $\times 10^{23}$ (odgovor v enotah $10^{23}$ je pravilen). Popravek v ločenem PR.
- `periodni-sistem`, raven 2 in 3 (seme 5): **lažni alarm preračuna** `server/lesson-math.js`. Formula
  $N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 17 - 10 = 7$ je pravilna; preračun prebere besedilo v
  `\text{…}` kot enoto (že zapisano kot AUDIT-087 za profil B).

Koraki z izgubljeno rešitvijo (`exk-equilibrium`, raven 3: $\frac{x^2}{(2-x)^2} = 25 \to \frac{x}{2-x} = 5$) so
pravilni v kontekstu naloge (koncentracija je med 0 in začetno vrednostjo), zato so brez statusa in ne napaka.

## Neodvisni vzorec zgrešenih napak

Drugi pregledovalec (model AI, ne človek) je iz 701 generatorjev s statusom numerično, delno ali nepreverjeno z
naključnim semenom 20261126 izbral 30 generatorjev in za vsakega ročno preračunal nalogi ravni 2 in 3 (seme 1),
skupaj 60 nalog: račune, algebro, predznake, kote linearnega programa, stehiometrijo, pH, topnost in biološka štetja.

- Napake, ki spremenijo matematiko: **0/30** (95 % Wilsonov interval 0–11 %). Generatorji s pravo napako, ki jih
  popis spregleda, so torej verjetno redki, a vzorec je majhen.
- Zaokrožena vrednost, zapisana z »=« namesto »≈«: **3/30** (3–26 %): `tek-fiz-kirchhoff` ($U = 3{,}7895$ V, točno
  3,78947…), `tek-fiz-energija-izkoristek` ($A = 5690$ J, točno 5689,8), `tek-kem-ph` ($[\mathrm{H^+}] = 9{,}397
  \cdot 10^{-4}$). Popis jih ne zazna, ker preračun dopušča zaokroževanje na prikazane decimalke. To je slog zapisa,
  ne napačen rezultat; strožje pravilo (»=« le za točne vrednosti) je stvar PV-07 (zaokroževanje).
- Polovica vzorca (okoli 15 generatorjev) nima nobene trditve, ki bi jo popis preveril (izbirni odgovori, besedilo).
  Tam pokritosti ni, ne glede na status.
- Manjše opombe brez vpliva na rezultat: `0,1^{3}` brez `{,}` v `bio-ss-3-pretok-energije-in-krozenje-snovi`;
  `uni-raztopine` in `uni-energijske-bilance` dasta pri ravni 2 in 3 isto nalogo.

## Pregled kode (model AI, ne človek) in popravki

- Dve zaporedni identiteti (razširjena kvadrata dveh podnalog) sta šli skozi ukaz korak kot »enakovredni« (obe
  množici ℝ; dve napačni identiteti obe ∅). Popravek: identiteta ob enačbi in par dveh »enačb« brez rešitve nista
  korak (`niKorak`); identitete preveri »račun«.
- Izgubljen interval (2x > 4 → x > 3) je bil brez statusa kot izgubljena posamezna rešitev. Popravek: brez statusa
  ostane le izgubljena končna množica točk, izgubljen interval ali zoženo območje je napaka.
- Vrstice, ki se začnejo z »=« (nadaljevanje računa), in imaginarna enota i niso več deli korakov; prej je 17 takih
  parov ostalo brez statusa kot »veriga relacij«.
- Ujemanje odgovora je imelo pas po decimalkah zapisa (z = 2 je »potrdil« odgovor 2,28). Zdaj šteje pas decimalk
  odgovora.
- »odgovor« je skladnost prikaza, ne preračun, zato ne šteje več v status generatorja; poročilo ga navede posebej.
- `\log` brez osnove (v šoli desetiški, v workerju naravni), mešano število `2\frac{1}{2}` in `x^{2}3` se ne
  prevedejo več v korak.

## Omejitve

- Vzorec semen, ne vse naloge: generator brez napake v vzorcu lahko pri drugem semenu da napako.
- »korak« preveri le zaporedni (ne)enačbi z isto eno neznanko v sosednjih vrsticah, ki ju zna prevesti iz TeX;
  besedni koraki, sistemi in koraki s parametri ostanejo brez statusa. Identiteta ob enačbi (razširjen kvadrat)
  ni korak. Korak »posledica« (kvadriranje, tuja rešitev) je izračunan kot račun; ali rešitev potem izloči tujo
  rešitev, preveri le končni »x = …« v isti verigi.
- »odgovor« pove le, ali rešitev pripelje do odgovora naloge (končna vrednost katere od relacij); to je skladnost
  prikaza, ne neodvisen preračun, in brez ujemanja ni napaka (rešitev lahko odgovor pove z besedo).
