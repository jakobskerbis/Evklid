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
