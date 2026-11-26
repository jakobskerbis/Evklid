## Pregled zaznanih napak

Vse trditve s statusom »napaka« (trije generatorji, 30 semen, commit pred #1171) je pregledal avtor preverjevalnika
(model AI, ne človek) proti besedilu naloge in rešitvi. Rezultati nalog so pravilni; napačen je zapis formule, v kateri
ima število enoto, ki ni zapisana:

- `dod-os-beljakovine` (raven 2): $m_{\check{z}} = \dfrac{m_b}{26} \cdot 100\ \mathrm{g}$. Podatek je »26 g beljakovin na
  100 g živila«, zato mora biti v imenovalcu $26\ \mathrm{g}$; brez enote formula da g². **Zapis**, popravljen v #1171.
- `exg-kem-polymers` (raven 3): $m_{\mathrm{H_2O}} = 2 \cdot 18 \cdot \dfrac{m}{M_0}$. Število 18 je molska masa vode v
  g/mol; brez enote formula da množino, ne mase. **Zapis**, popravljen v #1171.
- `mat-ss2-matura-iracionalne-enacbe` (raven 2): $v = \sqrt{200\,s}$, $v = \sqrt{10\,h}$, $T = 2\sqrt{l}$ so izkustvene
  formule iz besedila naloge (v v km/h, s v m), kakršne so na maturi. **Dogovor, ne napaka**: koeficient ima skrito
  enoto. Šteje kot lažni alarm vsebine.

Brez statusa (ne napaka) ostanejo formule s številom brez enote ob količini ($T = t + 273$, $30(t + 1) = 60t$), formule
z relativno atomsko maso ($M = 2 A_r(\mathrm{H}) + A_r(\mathrm{O})$, dogovor $M = M_r \cdot \mathrm{g/mol}$) in konstante
ravnotežja brez enote ($K_a$, dogovor $c/c^\circ$).

## Neodvisni pregled kode (prehod 2, model AI, ne človek)

Pregledovalec je prejel kodo brez avtorjevih sklepov. Ugotovitve in popravki:

1. **Formule brez dimenzije so bile potrjene ne glede na vsebino** (koti, odstotki, verjetnosti; s 3 semeni 112 od 826
   potrjenih). Popravek: ukaz `dim` vrne »brez statusa«, kadar so vsi deli brez dimenzije.
2. **Vrednost podatka je šla v formulo**, zato je $v_0 = 0$ izbrisal člen in $m_1 + v - v_0$ se je odštel. Popravek: v
   formulo gre le enota podatka, vsaka količina dobi svoj iracionalni faktor.
3. **Napačna definicija vmesne količine bi se prenesla v naslednje formule.** Popravek: trditev, ki uporabi enoto iz
   definicije v nalogi, je največ »delno«.
4. **Enota `percent` je spremenila izid ukaza `units`** (tudi tutorjeve trditve »enote:«): 50 % = 0,5 je postal
   »napaka«. Popravek: odstotek je pred pretvorbo 1/100. Sprememba workerja je objavljena na #539.
5. Decimalni eksponent ($(2gh)^{0{,}5}$) je dal lažni alarm, pretvorba °C ↔ K tudi. Popravek: eksponent kot ulomek,
   pretvorba s °C je brez statusa.
6. Funkcija in oklepaj sta bila prevedena kot množenje (sin·(…)), zato preverba argumenta sin/exp ni tekla. Popravek.
7. 22 generatorjev je imelo navodilo za zaokroževanje, ki ga skript ni prepoznal (»na cente«, »na dve decimalki« brez
   »zaokroži«, »na cel mililiter«, »nearest tenth«). Popravek; »na centimeter« ostane brez statusa (odvisno od enote).

Vsi popravki imajo teste v `test/enote-generatorjev.test.js`.
