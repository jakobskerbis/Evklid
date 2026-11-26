## Neodvisna pregleda (prehoda 2 in 3, modela AI, ne človek)

**Prehod 2 (koda).** Pregledovalec je ročno pregledal vseh 152 parov, ki jih iz besedila poti izlušči `korakiPoti`:
vsi so pravi koraki izpeljave. Našel je štiri luknje, ki v sedanjih polah ne nastopijo, a bi lahko dale napačno
potrditev ali lažni alarm; vse so popravljene in imajo teste:

1. Prva formula brez realne rešitve v obliki »ali« ali kot neenačba ($x^2 + 1 < 0$, torej $x^2 < -5$) je bila potrjena.
2. Sklep po pogojih, povezanih z »in«, se je povezal le z zadnjim pogojem ($x - 2 > 0$ in $x + 1 > 0$, torej $x > -1$).
3. »Oziroma« je pomenil veznik, čeprav pogosto pomeni »po vrsti«.
4. Vstavljene napake so pokvarile le drugo formulo koraka; zdaj tudi prvo (prazne premise, nadmnožice).

**Prehod 3 (rezultati).** Drugi pregledovalec je ponovil popis (številke se ujemajo) in ročno preveril naključni vzorec
(seme 20261126) 40 potrjenih korakov in 40 potrjenih računov proti besedilu pol: vsi so trditve, ki jih rešitev res
naredi, in vsi so pravilni; napačno potrjenih 0/80 (95 % interval 0–4,6 %). Preveril je tudi 10 nalog brez statusa in
10 delnih: statusi so pošteni. Našel je, da je status naloge »numerično« obljubljal preveč: 20 od 29 takih nalog
je imelo končni odgovor s črko ali besedo, ki ga noben račun ne preveri. Popravek: del brez preverjenega končnega
odgovora je brez statusa. Oznake nalog imajo zdaj tudi sklop (A/B na maturi).

**Ponovni pregled popravkov (prehod 2).** Popravki so potrjeni. Pregledovalec je našel, da je prvo pravilo pokritosti
odgovora še štelo števila iz formul snovi (C₆H₁₂) in iz ene od več vrednosti, ter da je »⇒« v formuli za pogojem z »in«
še tvoril par. Popravek: šteje vsako število odgovora, brez indeksov in eksponentov; izbira, opis ali odgovor brez števila
so brez statusa. Nalog s statusom »numerično« je zato le 2: popis je strog, ker večina odgovorov na polah ni zapisana
kot rezultat enega računa (besedilo, več vrednosti, enote v besedilu). To je pokritost, ne napaka.
