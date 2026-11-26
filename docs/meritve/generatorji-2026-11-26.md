# Status generatorjev nalog (PV-10), 2026-11-26

- Commit: `3227dd5930bf19a47ad51a6c6c7fe107165ef0f7`; ukaz: `node scripts/status-generatorjev.mjs --semena 5 --strogo --json docs/meritve/generatorji-2026-11-26.json --porocilo docs/meritve/generatorji-2026-11-26.md --dodatek docs/meritve/generatorji-2026-11-26-pregled.md`; brez modela AI; SymPy prek server/cas.js (ukaz korak, PV-06)
- Vzorec: vsak generator, ravni 1–3, semena 1–5 (prva tema generatorja). Imenovalec deležev so generatorji (704).
- Status generatorja je najšibkejši člen vseh trditev v vzorcu (statusOdgovora). Generator s statusom nižjim od
  »napaka« ni napačen; trditev brez statusa ni napačna, le noben program je ne preveri.

## Generatorji po statusu

| Status | Generatorjev |
| --- | --- |
| dokazano | 0/704 (0,0 %; 95-% interval 0,0 %–0,5 %) |
| izracunano | 0/704 (0,0 %; 95-% interval 0,0 %–0,5 %) |
| numericno | 5/704 (0,7 %; 95-% interval 0,3 %–1,7 %) |
| delno | 509/704 (72,3 %; 95-% interval 68,9 %–75,5 %) |
| napaka | 3/704 (0,4 %; 95-% interval 0,1 %–1,2 %) |
| nepreverjeno | 187/704 (26,6 %; 95-% interval 23,4 %–29,9 %) |

## Trditve po viru

| Vir | Trditev | izracunano | numericno | delno | napaka | nepreverjeno |
| --- | --- | --- | --- | --- | --- | --- |
| racun | 16.948 | 0 | 1.825 | 5.435 | 7 | 9.681 |
| korak | 328 | 307 | 0 | 0 | 0 | 21 |
| odgovor | 6.690 | 0 | 5.564 | 0 | 0 | 1.126 |

## Zaznane napake

- `periodni-sistem` (raven 2, seme 5, racun): `N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 17 - 10 = 7`
- `periodni-sistem` (raven 3, seme 5, racun): `N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 17 - 10 = 7`
- `dod-fiz-ss-plinska-enacba` (raven 2, seme 1, racun): `n = \dfrac{pV}{RT} = \dfrac{1{,}6 \cdot 10^{7} \cdot 4{,}6 \cdot 10^{-2}}{8{,}31 \cdot 303}\ \mathrm{mol} \approx 297{,}`
- `dod-fiz-ss-plinska-enacba` (raven 2, seme 2, racun): `n = \dfrac{pV}{RT} = \dfrac{1{,}2 \cdot 10^{7} \cdot 4{,}4 \cdot 10^{-2}}{8{,}31 \cdot 287}\ \mathrm{mol} \approx 228{,}`
- `dod-fiz-ss-plinska-enacba` (raven 2, seme 4, racun): `n = \dfrac{pV}{RT} = \dfrac{1{,}3 \cdot 10^{7} \cdot 3{,}2 \cdot 10^{-2}}{8{,}31 \cdot 278}\ \mathrm{mol} \approx 185{,}`
- `exk-mole` (raven 2, seme 1, racun): `1.1250 \cdot 6.022 \approx 6.775 \times 10^{23}`
- `exk-mole` (raven 2, seme 3, racun): `1.6667 \cdot 6.022 \approx 10.037 \times 10^{23}`

## Koraki z izgubljeno rešitvijo

Pravilni le, če izgubljeno rešitev izloči kontekst naloge (dolžina, koncentracija, celo število). Brez statusa.

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

## Omejitve

- Vzorec semen, ne vse naloge: generator brez napake v vzorcu lahko pri drugem semenu da napako.
- »korak« preveri le zaporedni (ne)enačbi z isto eno neznanko v sosednjih vrsticah, ki ju zna prevesti iz TeX;
  besedni koraki, sistemi in koraki s parametri ostanejo brez statusa.
- »odgovor« pove le, ali rešitev pripelje do odgovora naloge (končna vrednost katere od relacij); to je skladnost
  prikaza, ne neodvisen preračun, in brez ujemanja ni napaka (rešitev lahko odgovor pove z besedo).
