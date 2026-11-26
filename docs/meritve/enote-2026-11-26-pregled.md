## Pregled zaznanih napak

Vse trditve s statusom »napaka« (trije generatorji, 30 semen) je pregledal avtor preverjevalnika (model AI, ne
človek) proti besedilu naloge in rešitvi. Rezultati nalog so pravilni; napačen je zapis formule, v kateri ima število
enoto, ki ni zapisana:

- `dod-os-beljakovine` (raven 2): $m_{\check{z}} = \dfrac{m_b}{26} \cdot 100\ \mathrm{g}$. Podatek je »26 g beljakovin na
  100 g živila«, zato mora biti v imenovalcu $26\ \mathrm{g}$; brez enote formula da g². **Zapis**, popravek v ločenem PR.
- `exg-kem-polymers` (raven 3): $m_{\mathrm{H_2O}} = 2 \cdot 18 \cdot \dfrac{m}{M_0}$. Število 18 je molska masa vode v
  g/mol; brez enote formula da množino, ne mase. **Zapis**, popravek v ločenem PR.
- `mat-ss2-matura-iracionalne-enacbe` (raven 2): $v = \sqrt{200\,s}$, $v = \sqrt{10\,h}$, $T = 2\sqrt{l}$ so izkustvene
  formule iz besedila naloge (v v km/h, s v m), kakršne so na maturi. **Dogovor, ne napaka**: koeficient ima skrito
  enoto. Šteje kot lažni alarm vsebine.

Brez statusa (ne napaka) ostanejo formule s številom brez enote ob količini ($T = t + 273$, $30(t + 1) = 60t$), formule
z relativno atomsko maso ($M = 2 A_r(\mathrm{H}) + A_r(\mathrm{O})$, dogovor $M = M_r \cdot \mathrm{g/mol}$) in konstante
ravnotežja brez enote ($K_a$, dogovor $c/c^\circ$).
