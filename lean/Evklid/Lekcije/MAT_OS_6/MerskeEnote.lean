/-
vir: content/lessons/MAT-OS-6/merske-enote.md
sha256: 2b312e8e3cdd4278cb1a549a18377195ac7fb63b154095683eb549e4a861915f
Model: količina je število krat enota; vsaka enota je racionalno število, izraženo v najmanjši enoti svoje vrste
(dolžina v mm, masa v g, prostornina v ml, čas v s, denar v centih). Enote so definirane z lestvijo iz lekcije
(km = 1000 m, m = 10 dm, dm = 10 cm, cm = 10 mm; t = 1000 kg, kg = 100 dag, dag = 10 g; hl = 100 l, l = 10 dl,
dl = 10 cl, cl = 10 ml; dan = 24 h, h = 60 min, min = 60 s), vse druge zveze (npr. 1 m = 1000 mm, 1 kg = 1000 g,
1 l = 1000 ml) so dokazane. »Ista količina« pomeni enako število v osnovni enoti. Decimalna števila so točni ulomki
v ℚ. Čas »x h y min« je x · h + y · min; ura »16:00« je 16 · h od polnoči.
Ni v Leanu: zgodbi (kitarist, pesem, bend) kot opis, dokazani so njuni računi; lestvi kot sliki in simulacija
(dokazani so njuni faktorji in rezultati 90 min, 650 mm); »premakne se le decimalna vejica« kot opis zapisa
(dokazano je množenje in deljenje z 10, 100, 1000); 1 l = 1 dm³ in 1 ml = 1 cm³ kot zveza z enotami za prostornino
teles (dogovor o enotah, ni dokazan); »preveri smiselnost« in nasveti »popravek« kot navodilo; da se metrov in
centimetrov »ne more kar sešteti« (dokazano je, da je pravilni zapis 250 cm in ne 52 cm ali 52 m); razlage napačnih
odgovorov v kvizih, razen kjer so dokazane kot račun.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.MerskeEnote

/-! ## Enote (v najmanjši enoti svoje vrste) -/

/-- Milimeter (osnovna enota dolžine v modelu). -/
def mm : ℚ := 1
/-- Centimeter: 1 cm = 10 mm. -/
def cm : ℚ := 10 * mm
/-- Decimeter: 1 dm = 10 cm. -/
def dm : ℚ := 10 * cm
/-- Meter: 1 m = 10 dm. -/
def m : ℚ := 10 * dm
/-- Kilometer: 1 km = 1000 m. -/
def km : ℚ := 1000 * m

/-- Gram (osnovna enota mase v modelu). -/
def g : ℚ := 1
/-- Dekagram: 1 dag = 10 g. -/
def dag : ℚ := 10 * g
/-- Kilogram: 1 kg = 100 dag. -/
def kg : ℚ := 100 * dag
/-- Tona: 1 t = 1000 kg. -/
def t : ℚ := 1000 * kg

/-- Mililiter (osnovna enota prostornine v modelu). -/
def ml : ℚ := 1
/-- Centiliter: 1 cl = 10 ml. -/
def cl : ℚ := 10 * ml
/-- Deciliter: 1 dl = 10 cl. -/
def dl : ℚ := 10 * cl
/-- Liter: 1 l = 10 dl. -/
def l : ℚ := 10 * dl
/-- Hektoliter: 1 hl = 100 l. -/
def hl : ℚ := 100 * l

/-- Sekunda (osnovna enota časa v modelu). -/
def s : ℚ := 1
/-- Minuta: 1 min = 60 s. -/
def mi : ℚ := 60 * s
/-- Ura: 1 h = 60 min. -/
def h : ℚ := 60 * mi
/-- Dan: 1 dan = 24 h. -/
def dan : ℚ := 24 * h

/-! ## Splošno pravilo -/

/-- Razlaga (Pravilo, zapisano na kratko), Povzetek 1 in 2: če je večja enota U = f · u (f > 1), je x U = (x · f) u
(navzdol množimo) in y u = (y : f) U (navzgor delimo); količina ostane enaka, pri pozitivnem številu pa je število v
manjši enoti večje in v večji enoti manjše.
trditev: MAT-OS-6/merske-enote#pravilo
besedilo: »V manjšo enoto **množimo**, v večjo **delimo**. Manjša enota pomeni večje število.« -/
theorem pravilo (U u f x y : ℚ) (hU : U = f * u) (hf : 1 < f) (hx : 0 < x) (hy : 0 < y) :
    x * U = (x * f) * u ∧ y * u = (y / f) * U ∧ x < x * f ∧ y / f < y := by
  have hf0 : 0 < f := by linarith
  refine ⟨by rw [hU]; ring, by rw [hU]; field_simp, by nlinarith, (div_lt_self hy hf)⟩

/-- Predpostavke trditve `pravilo` se dajo izpolniti, izrek uporabljen na m = 100 cm, x = 0,65, y = 65. -/
example := pravilo m cm 100 (65 / 100) 65 (by norm_num [m, dm, cm]; ring) (by norm_num) (by norm_num) (by norm_num)

/-- Premisli 1, Pogoste napake 2: faktorje stopnic množimo: od m do mm 10 · 10 · 10 = 1000 (ne 10 + 10 + 10 = 30
in ne 100), zato je 0,65 m = 650 mm.
trditev: MAT-OS-6/merske-enote#tri-stopnice
besedilo: »S $1000$, ker je $10 \cdot 10 \cdot 10 = 1000$. Zato je $0{,}65\,\text{m} = 650\,\text{mm}$.« -/
theorem tri_stopnice : m = 10 * 10 * 10 * mm ∧ (10 : ℚ) * 10 * 10 = 1000 ∧ m = 1000 * mm ∧
    (10 : ℚ) + 10 + 10 = 30 ∧ m ≠ 30 * mm ∧ m ≠ 100 * mm ∧ 65 / 100 * m = 650 * mm := by
  norm_num [m, dm, cm, mm]

/-! ## Razlaga -/

/-- Zakaj se tega učimo: 650 mm = 65 cm (nihče se ni zmotil); 210 s = 3 min 30 s (3:30).
trditev: MAT-OS-6/merske-enote#zakaj
besedilo: »Struna je ena sama, pesem traja enako dolgo.« -/
theorem zakaj : 650 * mm = 65 * cm ∧ 210 * s = 3 * mi + 30 * s := by norm_num [cm, mm, mi, s]

/-- Razlaga (lestev in tabela): struna 0,65 m = 65 cm = 650 mm; v manjši enoti večje število (0,65 < 65 < 650).
trditev: MAT-OS-6/merske-enote#struna
besedilo: »Vsi trije zapisi opisujejo isto struno. Ko greš v tabeli desno (v manjšo enoto), število raste.« -/
theorem struna : 65 / 100 * m = 65 * cm ∧ 65 * cm = 650 * mm ∧ (65 / 100 : ℚ) < 65 ∧ (65 : ℚ) < 650 := by
  norm_num [m, dm, cm, mm]

/-- Razlaga (Masa in prostornina), Povzetek: 1 t = 1000 kg, 1 kg = 100 dag = 1000 g, 1 dag = 10 g; 1 hl = 100 l,
1 l = 10 dl = 1000 ml.
trditev: MAT-OS-6/merske-enote#masa-prostornina
besedilo: »Iz tabel razbereš, da je $1\,\text{kg} = 100\,\text{dag} = 1000\,\text{g}$ in $1\,\text{l} = 10\,\text{dl} = 1000\,\text{ml}$.« -/
theorem masa_prostornina : t = 1000 * kg ∧ kg = 100 * dag ∧ kg = 1000 * g ∧ dag = 10 * g ∧ hl = 100 * l ∧
    l = 10 * dl ∧ l = 1000 * ml := by
  norm_num [t, kg, dag, g, hl, l, dl, cl, ml]

/-- Povzetek (dolžina): 1 km = 1000 m, 1 m = 10 dm = 100 cm = 1000 mm.
trditev: MAT-OS-6/merske-enote#dolzina
besedilo: »Dolžina: $1\,\text{km} = 1000\,\text{m}$, $1\,\text{m} = 10\,\text{dm} = 100\,\text{cm} = 1000\,\text{mm}$.« -/
theorem dolzina : km = 1000 * m ∧ m = 10 * dm ∧ m = 100 * cm ∧ m = 1000 * mm := by
  norm_num [km, m, dm, cm, mm]

/-- Razlaga (Čas), Povzetek: 1 dan = 24 h, 1 h = 60 min, 1 min = 60 s; pol ure je 30 min, četrt ure 15 min; pri
času faktor ni 10 ali 100.
trditev: MAT-OS-6/merske-enote#cas
besedilo: »Pol ure je $30$ minut, četrt ure $15$ minut.« -/
theorem cas : dan = 24 * h ∧ h = 60 * mi ∧ mi = 60 * s ∧ h / 2 = 30 * mi ∧ h / 4 = 15 * mi ∧
    h ≠ 100 * mi ∧ mi ≠ 100 * s := by
  norm_num [dan, h, mi, s]

/-- Razlaga, premisli 2: 1,5 min = 1 min 30 s = 90 s, ne 1 min 50 s (minuta ima 60 s).
trditev: MAT-OS-6/merske-enote#poldruga-minuta
besedilo: »Torej $1{,}5\,\text{min} = 1\,\text{min}\,30\,\text{s} = 90\,\text{s}$.« -/
theorem poldruga_minuta : 3 / 2 * mi = 1 * mi + 30 * s ∧ 1 * mi + 30 * s = 90 * s ∧
    3 / 2 * mi ≠ 1 * mi + 50 * s ∧ mi / 2 = 30 * s := by
  norm_num [mi, s]

/-- Razlaga (simulacija), Povzetek: 1,5 h = 90 min, ne 150 min.
trditev: MAT-OS-6/merske-enote#poldruga-ura
besedilo: »Tu vejica ne pomaga: $1{,}5\,\text{h} = 90\,\text{min}$.« -/
theorem poldruga_ura : 3 / 2 * h = 90 * mi ∧ 3 / 2 * h ≠ 150 * mi := by norm_num [h, mi, s]

/-! ## Rešeni primeri -/

/-- Primer 1: 65 cm v m: 65 : 100 = 0,65; v mm: 65 · 10 = 650; struna je 0,65 m oziroma 650 mm.
trditev: MAT-OS-6/merske-enote#primer1
besedilo: »Odgovor: struna je dolga $0{,}65\,\text{m}$ oziroma $650\,\text{mm}$.« -/
theorem primer1 : (65 : ℚ) / 100 = 65 / 100 ∧ (65 : ℚ) * 10 = 650 ∧ 65 * cm = 65 / 100 * m ∧
    65 * cm = 650 * mm ∧ m = 100 * cm ∧ cm = 10 * mm := by
  norm_num [m, dm, cm, mm]

/-- Primer 2: 2,4 kg: 2,4 · 100 = 240 dag, faktor 100 · 10 = 1000, 2,4 · 1000 = 2400 g.
trditev: MAT-OS-6/merske-enote#primer2
besedilo: »Odgovor: kitara ima maso $240\,\text{dag}$ oziroma $2400\,\text{g}$.« -/
theorem primer2 : (24 / 10 : ℚ) * 100 = 240 ∧ (100 : ℚ) * 10 = 1000 ∧ (24 / 10 : ℚ) * 1000 = 2400 ∧
    24 / 10 * kg = 240 * dag ∧ 24 / 10 * kg = 2400 * g := by
  norm_num [kg, dag, g]

/-- Primer 3: 1 h 45 min = 60 + 45 = 105 min = 105 · 60 = 6300 s; pesem 3 · 60 + 30 = 210 s; 6300 : 210 = 30 (n
pesmi traja n · 210 s, kar je 6300 s natanko pri n = 30); preizkus 30 · 3,5 = 105 min.
trditev: MAT-OS-6/merske-enote#primer3
besedilo: »Odgovor: bend lahko zaigra $30$ pesmi.« -/
theorem primer3 (n : ℚ) : 1 * h + 45 * mi = (60 + 45) * mi ∧ (60 : ℚ) + 45 = 105 ∧ (105 : ℚ) * 60 = 6300 ∧
    1 * h + 45 * mi = 6300 * s ∧ 3 * mi + 30 * s = 210 * s ∧ (3 : ℚ) * 60 + 30 = 210 ∧ (6300 : ℚ) / 210 = 30 ∧
    (n * (3 * mi + 30 * s) = 1 * h + 45 * mi ↔ n = 30) ∧ (30 : ℚ) * (7 / 2) = 105 := by
  refine ⟨by norm_num [h, mi, s], by norm_num, by norm_num, by norm_num [h, mi, s], by norm_num [mi, s],
    by norm_num, by norm_num, ⟨fun e => ?_, fun e => by rw [e]; norm_num [h, mi, s]⟩, by norm_num⟩
  norm_num [h, mi, s] at e
  linarith

/-- Primer 4: 8 · 150 = 1200 ml; 1200 : 1000 = 1,2, torej 1,2 l, manj kot 1200 (liter je večja enota).
trditev: MAT-OS-6/merske-enote#primer4
besedilo: »$1200 : 1000 = 1{,}2$, torej porabiš $1{,}2\,\text{l}$ vode.« -/
theorem primer4 : (8 : ℚ) * 150 = 1200 ∧ 8 * (150 * ml) = 1200 * ml ∧ (1200 : ℚ) / 1000 = 12 / 10 ∧
    1200 * ml = 12 / 10 * l ∧ (12 / 10 : ℚ) < 1200 := by
  norm_num [ml, l, dl, cl]

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 65 cm ni 6500 m (65 · 100 = 6500 m = 6,5 km, struna bi bila dolga več kilometrov), pravilno je
65 : 100 = 0,65 m.
trditev: MAT-OS-6/merske-enote#napaka1
besedilo: »Struna bi bila dolga več kilometrov.« -/
theorem napaka1 : 65 * cm ≠ 6500 * m ∧ 6500 * m = 13 / 2 * km ∧ 1 * km < 6500 * m ∧ 65 * cm = 65 / 100 * m := by
  norm_num [km, m, dm, cm, mm]

/-- Pogoste napake 3: 1 dag = 10 g, korak kg → dag pa ima faktor 100 (1 kg = 1000 g), zato 2,4 kg = 240 dag, ne
24 dag.
trditev: MAT-OS-6/merske-enote#napaka3
besedilo: »zato je $2{,}4\,\text{kg} = 240\,\text{dag}$.« -/
theorem napaka3 : dag = 10 * g ∧ kg = 100 * dag ∧ kg = 1000 * g ∧ 24 / 10 * kg = 240 * dag ∧
    24 / 10 * kg ≠ 24 * dag := by
  norm_num [kg, dag, g]

/-- Pogoste napake 4: 1 h 30 min = 1,5 h (ne 1,30 h); 3 min 45 s = 3 · 60 + 45 = 225 s (ne 345 s).
trditev: MAT-OS-6/merske-enote#napaka4
besedilo: »Pravilno: $1\,\text{h}\,30\,\text{min} = 1{,}5\,\text{h}$ in $3 \cdot 60 + 45 = 225$ sekund.« -/
theorem napaka4 : 1 * h + 30 * mi = 3 / 2 * h ∧ 1 * h + 30 * mi ≠ 130 / 100 * h ∧ (3 : ℚ) * 60 + 45 = 225 ∧
    3 * mi + 45 * s = 225 * s ∧ 3 * mi + 45 * s ≠ 345 * s := by
  norm_num [h, mi, s]

/-- Pogoste napake 5: 2 m + 50 cm = 200 cm + 50 cm = 250 cm (ne 52 cm in ne 52 m).
trditev: MAT-OS-6/merske-enote#napaka5
besedilo: »Najprej obe količini v isto enoto: $200\,\text{cm} + 50\,\text{cm} = 250\,\text{cm}$.« -/
theorem napaka5 : 2 * m = 200 * cm ∧ 2 * m + 50 * cm = 250 * cm ∧ 2 * m + 50 * cm ≠ 52 * cm ∧
    2 * m + 50 * cm ≠ 52 * m := by
  norm_num [m, dm, cm, mm]

/-! ## Drugače -/

/-- Z analogijo: celinka = 2 polovinki, polovinka = 2 četrtinki, četrtinka = 2 osminki; takt (ena celinka) je
4 četrtinke ali 8 osmink; 1 € = 100 centov (število stokrat večje, denar enak).
trditev: MAT-OS-6/merske-enote#analogija
besedilo: »Takt, ki traja eno celinko, lahko zapolniš s $4$ četrtinkami ali z $8$ osminkami.« -/
theorem analogija (c : ℚ) : c = 2 * (c / 2) ∧ c / 2 = 2 * (c / 4) ∧ c / 4 = 2 * (c / 8) ∧ c = 4 * (c / 4) ∧
    c = 8 * (c / 8) := by
  refine ⟨by ring, by ring, by ring, by ring, by ring⟩

/-- Iz vsakdanjega življenja: 0,5 kg = 500 g; 1,5 l = 15 dl, 15 − 2 = 13 dl; 1,2 km = 1200 m = 3 · 400 m; 90 min =
60 min + 30 min = 1 h 30 min, 16:00 + 1 h 30 min = 17:30.
trditev: MAT-OS-6/merske-enote#vsakdan
besedilo: »Ker je $1\,\text{km} = 1000\,\text{m}$, je to $1200\,\text{m}$, natanko trije krogi na atletski stezi s $400\,\text{m}$.« -/
theorem vsakdan : 1 / 2 * kg = 500 * g ∧ 3 / 2 * l = 15 * dl ∧ 15 * dl - 2 * dl = 13 * dl ∧
    12 / 10 * km = 1200 * m ∧ 1200 * m = 3 * (400 * m) ∧ 90 * mi = 60 * mi + 30 * mi ∧
    60 * mi + 30 * mi = 1 * h + 30 * mi ∧ 16 * h + 90 * mi = 17 * h + 30 * mi := by
  norm_num [kg, dag, g, l, dl, cl, ml, km, m, dm, cm, mm, h, mi, s]

/-! ## Preveri se -/

/-- Preveri se 1: 1,5 m = 1,5 · 100 cm = 150 cm, kabla sta enako dolga.
trditev: MAT-OS-6/merske-enote#kviz1
besedilo: »$1{,}5\,\text{m} = 1{,}5 \cdot 100\,\text{cm} = 150\,\text{cm}$.« -/
theorem kviz1 : 3 / 2 * m = 3 / 2 * (100 * cm) ∧ 3 / 2 * (100 * cm) = 150 * cm := by norm_num [m, dm, cm, mm]

/-- Preveri se 2: B = 3 · 60 + 10 = 190 s, A = 200 s, C = 3,5 · 60 = 210 s, zato B < A < C; z »minuto po 100 s«
bi dobil 310 s in 350 s.
trditev: MAT-OS-6/merske-enote#kviz2
besedilo: »B: $3 \cdot 60 + 10 = 190\,\text{s}$, A: $200\,\text{s}$, C: $3{,}5 \cdot 60 = 210\,\text{s}$. Torej B, A, C.« -/
theorem kviz2 : 3 * mi + 10 * s = 190 * s ∧ 7 / 2 * mi = 210 * s ∧ 3 * mi + 10 * s < 200 * s ∧
    200 * s < 7 / 2 * mi ∧ (3 : ℚ) * 100 + 10 = 310 ∧ (7 / 2 : ℚ) * 100 = 350 := by
  norm_num [mi, s]

/-- Preveri se 3: 1 m = 1000 mm, zato je število milimetrov 1000-krat večje od števila metrov (x m = (1000 · x) mm),
npr. 0,65 m = 650 mm.
trditev: MAT-OS-6/merske-enote#kviz3
besedilo: »$1\,\text{m} = 1000\,\text{mm}$, zato je število milimetrov $1000$-krat večje od števila metrov, na primer $0{,}65\,\text{m} = 650\,\text{mm}$.« -/
theorem kviz3 (x : ℚ) : m = 1000 * mm ∧ x * m = (1000 * x) * mm ∧ 65 / 100 * m = 650 * mm := by
  refine ⟨by norm_num [m, dm, cm, mm], by norm_num [m, dm, cm, mm]; ring, by norm_num [m, dm, cm, mm]⟩

/-- Preveri se 4: 1 kg = 100 dag, 3,2 · 100 = 320 dag (ne 32, 3200 ali 0,032 dag); 3200 je število gramov.
trditev: MAT-OS-6/merske-enote#kviz4
besedilo: »$1\,\text{kg} = 100\,\text{dag}$, zato $3{,}2 \cdot 100 = 320$; boben ima maso $320\,\text{dag}$.« -/
theorem kviz4 : kg = 100 * dag ∧ (32 / 10 : ℚ) * 100 = 320 ∧ 32 / 10 * kg = 320 * dag ∧ 32 / 10 * kg ≠ 32 * dag ∧
    32 / 10 * kg ≠ 3200 * dag ∧ 32 / 10 * kg ≠ 32 / 1000 * dag ∧ 32 / 10 * kg = 3200 * g := by
  norm_num [kg, dag, g]

/-- Preveri se 5: 2700 s = 2700 : 60 = 45 min (ne 27, 2,7 ali 162 000 min).
trditev: MAT-OS-6/merske-enote#kviz5
besedilo: »Iz $\text{s}$ v $\text{min}$ gremo navzgor, zato delimo s $60$: $2700 : 60 = 45$. Album traja $45$ minut.« -/
theorem kviz5 : (2700 : ℚ) / 60 = 45 ∧ 2700 * s = 45 * mi ∧ 2700 * s ≠ 27 * mi ∧ 2700 * s ≠ 27 / 10 * mi ∧
    2700 * s ≠ 162000 * mi := by
  norm_num [mi, s]

end Evklid.Lekcije.MAT_OS_6.MerskeEnote
