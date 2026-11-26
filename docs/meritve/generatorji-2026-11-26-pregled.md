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
