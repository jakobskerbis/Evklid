/-
vir: content/lessons/MAT-OS-7/ulomki-v-besedilnih-nalogah.md
sha256: 55a42841f3b4d3dbd3fb229126e47e98dc39d58384de685ee3d7cb0244026cdf
Ni v Leanu: zgodbe (ptice, junij, knjiga, žepnina, gozd, pica, recept, pot, metulji, sodi) so dokazane
samo kot račun s števili; risbe (trakovi) in simulacija kot slike, dokazan je račun, ki ga kažejo (en del
6, celota 48; pri števcu 6 celota 24 < 48; trak 12 kvadratkov za Anino žepnino); koraki »Kako se lotiš
naloge«, »odgovori v stavku«, »preberi vprašanje« (Pogoste napake 4) in »imenovalec pove, na koliko delov
razdelimo celoto« so opis postopka oziroma pomena zapisa, ne matematična trditev (dokazani so računi
c : b · a = a/b · c in d : a · b = d : (a/b)); enote (l, km, ha, g, €) so izpuščene, računa se s števili v ℚ.
Model: »a/b od c« je a/b · c; neznana celota c je rešitev enačbe a/b · c = d (dokazano kot ↔, torej
enolično). Kjer se deli z a ali b, sta a, b ≠ 0 predpostavki (Leanov dogovor x/0 = 0 se ne uporabi).
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso rešitve.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.UlomkiVBesedilnihNalogah

/-! ## Splošna pravila (Razlaga, Povzetek, Bolj natančno) -/

/-- Razlaga 2, Povzetek in Bolj natančno: a/b od c je c : b · a = a/b · c (vseeno, ali najprej delimo
ali množimo).
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#del-celote
besedilo: »$$\frac{a}{b} \text{ od } c = c : b \cdot a = \frac{a}{b} \cdot c$$« -/
theorem del_celote (a b c : ℚ) : c / b * a = a / b * c ∧ c / b * a = c * a / b := by
  constructor <;> ring

/-- Razlaga 3, Povzetek in Bolj natančno: če je a/b celote c enako d (a, b ≠ 0), je celota natanko
c = d : a · b = d : (a/b) = d · (b/a).
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#celota-iz-dela
besedilo: »Celota iz dela: če je $\dfrac{a}{b}$ celote enako $d$, je celota $d : a \cdot b = d : \dfrac{a}{b}$.« -/
theorem celota_iz_dela (a b c d : ℚ) (ha : a ≠ 0) (hb : b ≠ 0) :
    (a / b * c = d ↔ c = d / a * b) ∧ d / a * b = d / (a / b) ∧ d / (a / b) = d * (b / a) := by
  refine ⟨?_, by field_simp, by rw [div_div_eq_mul_div, mul_div_assoc]⟩
  constructor
  · rintro rfl; field_simp
  · rintro rfl; field_simp

/-- Predpostavke trditve `celota_iz_dela` se dajo izpolniti (a = 3, b = 8). -/
example := celota_iz_dela 3 8 48 18 (by norm_num) (by norm_num)

/-- Razlaga 3 in Bolj natančno: pri ulomku, manjšem od 1, je del manjši od celote c > 0;
pri ulomku, večjem od 1, je »del« večji od celote.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#del-manjsi
besedilo: »Če je ulomek manjši od $1$, je del manjši od celote.« -/
theorem del_manjsi (q c : ℚ) (hc : 0 < c) : (q < 1 → q * c < c) ∧ (1 < q → c < q * c) := by
  constructor <;> intro h <;> nlinarith

/-- Predpostavke trditve `del_manjsi` se dajo izpolniti (c = 18, q = 3/8 < 1). -/
example := (del_manjsi (3 / 8) 18 (by norm_num)).1 (by norm_num)

/-- Predpostavke trditve `del_manjsi` se dajo izpolniti (c = 40, q = 5/4 > 1). -/
example := (del_manjsi (5 / 4) 40 (by norm_num)).2 (by norm_num)

/-- Razlaga 3 in Pogoste napake 2: pri 0 < a/b < 1 in d > 0 je celota d : (a/b) večja od dela d, množenje
d · (a/b) pa da manj kot d.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#celota-vecja
besedilo: »ker bi dobil manj kot $96$, celota pa mora biti večja od svojega dela.« -/
theorem celota_vecja (q d : ℚ) (hq : 0 < q) (hq1 : q < 1) (hd : 0 < d) : d < d / q ∧ q * d < d := by
  refine ⟨?_, by nlinarith⟩
  rw [lt_div_iff₀ hq]; nlinarith

/-- Predpostavke trditve `celota_vecja` se dajo izpolniti (q = 3/8, d = 18). -/
example := celota_vecja (3 / 8) 18 (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 4 in Povzetek: ko od celote vzameš a/b (b ≠ 0), ostane 1 − a/b = (b − a)/b celote.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#ostanek
besedilo: »Ostanek po odvzemu $\dfrac{a}{b}$ je $1 - \dfrac{a}{b}$ celote.« -/
theorem ostanek (a b : ℚ) (hb : b ≠ 0) : 1 - a / b = (b - a) / b := by
  field_simp

/-- Predpostavka trditve `ostanek` se da izpolniti (b = 3). -/
example := ostanek 1 3 (by norm_num)

/-- Razlaga 5 in Povzetek: p/q ostanka (ko je vzeto a/b celote c) je p/q · (1 − a/b) prvotne celote.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#del-ostanka
besedilo: »Pri delu ostanka je ostanek nova celota: $\dfrac{p}{q}$ ostanka je $\dfrac{p}{q} \cdot \text{ostanek}$.« -/
theorem del_ostanka (p q a b c : ℚ) : p / q * (c - a / b * c) = (p / q * (1 - a / b)) * c := by ring

/-- Razlaga 4: če se je 1/3 snega stopilo, je še 2/3 snega.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#sneg
besedilo: »Če se je $\dfrac{1}{3}$ snega že stopilo, je še $\dfrac{2}{3}$ snega.« -/
theorem sneg : (1 : ℚ) - 1 / 3 = 2 / 3 := by norm_num

/-- Razlaga 5 (premisli in račun): 1/4 ostanka 2/3 je 1/4 · 2/3 = 2/12 = 1/6 celote; 1/4 = 3/12 je več
kot 1/6 = 2/12.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#cetrtina-ostanka
besedilo: »$$\frac{1}{4} \cdot \frac{2}{3} = \frac{2}{12} = \frac{1}{6} \text{ prvotne celote.}$$« -/
theorem cetrtina_ostanka : (1 : ℚ) / 4 * (2 / 3) = 2 / 12 ∧ (2 : ℚ) / 12 = 1 / 6 ∧ (1 : ℚ) / 4 = 3 / 12 ∧
    (1 : ℚ) / 6 = 2 / 12 ∧ (1 : ℚ) / 6 < 1 / 4 := by norm_num

/-! ## Zakaj se tega učimo in Razlaga 3: ptice -/

/-- Zakaj se tega učimo in Razlaga 3: 18 sinic je 3/8 vseh ptic natanko tedaj, ko je ptic 48 (en del
18 : 3 = 6, celota 6·8 = 48); Galov račun 3/8 · 18 = 6,75 da manj kot 18 in ni rešitev.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#ptice
besedilo: »En del je $18 : 3 = 6$ ptic, celota ($8$ delov) pa $6 \cdot 8 = 48$ ptic.« -/
theorem ptice (c : ℚ) : ((3 : ℚ) / 8 * c = 18 ↔ c = 48) ∧ (18 : ℚ) / 3 = 6 ∧ (6 : ℚ) * 8 = 48 ∧
    (3 : ℚ) / 8 * 18 = 6.75 ∧ (6.75 : ℚ) < 18 ∧ (3 : ℚ) / 8 * 6.75 ≠ 18 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Razlaga 2: 3/4 od 28 je 28 : 4 · 3 = 7 · 3 = 21.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#tri-cetrtine-28
besedilo: »Na primer $\dfrac{3}{4}$ od $28$ je $28 : 4 \cdot 3 = 7 \cdot 3 = 21$.« -/
theorem tri_cetrtine_28 : (28 : ℚ) / 4 * 3 = 21 := by
  calc (28 : ℚ) / 4 * 3 = 7 * 3 := by norm_num
    _ = 21 := by norm_num

/-- Razlaga 6 (simulacija): pri števcu 6 isti znani del 18 pomeni celoto 18 : 6 · 8 = 24 < 48.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#simulacija
besedilo: »Nato povečaj števec na $6$: celota se zmanjša, ker isti znani del zdaj pomeni več delov.« -/
theorem simulacija : (18 : ℚ) / 6 * 8 = 24 ∧ (24 : ℚ) < 48 := by norm_num

/-! ## Primer 1 -/

/-- Primer 1: 2/5 od 30 dni: 30 : 5 = 6, 6 · 2 = 12; preizkus 2/5 · 30 = 60/5 = 12.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#primer1
besedilo: »Preverimo z množenjem ulomka: $\dfrac{2}{5} \cdot 30 = \dfrac{60}{5} = 12$.« -/
theorem primer1 : (30 : ℚ) / 5 = 6 ∧ (6 : ℚ) * 2 = 12 ∧ (2 : ℚ) / 5 * 30 = 60 / 5 ∧ (60 : ℚ) / 5 = 12 := by
  norm_num

/-! ## Primer 2 -/

/-- Primer 2: 2/5 knjige je 96 strani natanko tedaj, ko ima knjiga 240 strani; en del 96 : 2 = 48,
48 · 5 = 240; ostane 1 − 2/5 = 3/5, to je 48 · 3 = 144 strani; 96 + 144 = 240.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#primer2
besedilo: »Odgovor: knjiga ima $240$ strani, Marko mora prebrati še $144$ strani.« -/
theorem primer2 (c : ℚ) : ((2 : ℚ) / 5 * c = 96 ↔ c = 240) ∧ (96 : ℚ) / 2 = 48 ∧ (48 : ℚ) * 5 = 240 ∧
    (1 : ℚ) - 2 / 5 = 3 / 5 ∧ (48 : ℚ) * 3 = 144 ∧ (3 : ℚ) / 5 * 240 = 144 ∧ (96 : ℚ) + 144 = 240 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-! ## Primer 3 -/

/-- Primer 3, koraki 1–4: 1 − 1/3 = 2/3; 1/4 · 2/3 = 2/12 = 1/6; 2/3 − 1/6 = 4/6 − 1/6 = 3/6 = 1/2;
18 : 1/2 = 18 · 2 = 36.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#primer3-koraki
besedilo: »Na koncu ostane $\dfrac{2}{3} - \dfrac{1}{6} = \dfrac{4}{6} - \dfrac{1}{6} = \dfrac{3}{6} = \dfrac{1}{2}$ žepnine.« -/
theorem primer3_koraki : (1 : ℚ) - 1 / 3 = 2 / 3 ∧ (1 : ℚ) / 4 * (2 / 3) = 2 / 12 ∧ (2 : ℚ) / 12 = 1 / 6 ∧
    (2 : ℚ) / 3 - 1 / 6 = 1 / 2 ∧ (18 : ℚ) / (1 / 2) = 36 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · calc (2 : ℚ) / 3 - 1 / 6 = 4 / 6 - 1 / 6 := by norm_num
      _ = 3 / 6 := by norm_num
      _ = 1 / 2 := by norm_num
  · calc (18 : ℚ) / (1 / 2) = 18 * 2 := by norm_num
      _ = 36 := by norm_num

/-- Primer 3 (odgovor): če Ana od žepnine c porabi 1/3 za kino in 1/4 ostanka za knjigo ter ji ostane
18 €, je c natanko 36 €.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#primer3
besedilo: »Odgovor: Ana je imela na začetku $36$ € žepnine.« -/
theorem primer3 (c : ℚ) : (c - 1 / 3 * c) - 1 / 4 * (c - 1 / 3 * c) = 18 ↔ c = 36 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Primer 3, korak 5 (preizkus): 36 : 3 = 12, ostane 24; 24 : 4 = 6, ostane 24 − 6 = 18.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#primer3-preizkus
besedilo: »Preverimo: kino $36 : 3 = 12$ €, ostane $24$ €; knjiga $24 : 4 = 6$ €, ostane $24 - 6 = 18$ €.« -/
theorem primer3_preizkus : (36 : ℚ) / 3 = 12 ∧ (36 : ℚ) - 12 = 24 ∧ (24 : ℚ) / 4 = 6 ∧ (24 : ℚ) - 6 = 18 := by
  norm_num

/-! ## Primer 4 -/

/-- Primer 4 in premisli: 1 − 3/5 = 2/5, 1/2 · 2/5 = 1/5; 40 · 5 = 200; preizkus 3/5 · 200 = 120, ostane
80, polovica 40.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#primer4-koraki
besedilo: »Smreka pokriva polovico ostanka: $\dfrac{1}{2} \cdot \dfrac{2}{5} = \dfrac{1}{5}$ površine gozda.« -/
theorem primer4_koraki : (1 : ℚ) - 3 / 5 = 2 / 5 ∧ (1 : ℚ) / 2 * (2 / 5) = 1 / 5 ∧ (40 : ℚ) * 5 = 200 ∧
    (3 : ℚ) / 5 * 200 = 120 ∧ (200 : ℚ) - 120 = 80 ∧ (80 : ℚ) / 2 = 40 := by norm_num

/-- Primer 4 (odgovor): bukev 3/5 površine c, smreka 1/2 ostanka = 40 ha natanko tedaj, ko je c = 200 ha.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#primer4
besedilo: »En del od petih je $40\,\text{ha}$, zato je celota $40 \cdot 5 = 200$, torej $200\,\text{ha}$.« -/
theorem primer4 (c : ℚ) : 1 / 2 * (c - 3 / 5 * c) = 40 ↔ c = 200 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 1/3 žepnine in 1/4 ostanka nista 1/3 + 1/4 = 7/12 žepnine, ampak 1/3 + 1/6 = 1/2.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#napaka-ostanek
besedilo: »Zato tudi $\dfrac{1}{3}$ žepnine in $\dfrac{1}{4}$ ostanka nista skupaj $\dfrac{7}{12}$ žepnine« -/
theorem napaka_ostanek : (1 : ℚ) / 3 + 1 / 4 = 7 / 12 ∧ (1 : ℚ) / 3 + 1 / 4 * (1 - 1 / 3) = 1 / 2 ∧
    (7 : ℚ) / 12 ≠ 1 / 2 := by norm_num

/-- Pogoste napake 2: 2/5 · 96 = 38,4 < 96 ni celota; pravilno 96 : 2/5 = 96 : 2 · 5 = 240.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#napaka-mnozenje
besedilo: »Pravilno je $96 : \dfrac{2}{5} = 96 : 2 \cdot 5 = 240$.« -/
theorem napaka_mnozenje : (2 : ℚ) / 5 * 96 = 38.4 ∧ (38.4 : ℚ) < 96 ∧ (96 : ℚ) / (2 / 5) = 96 / 2 * 5 ∧
    (96 : ℚ) / 2 * 5 = 240 := by norm_num

/-- Pogoste napake 3 in Preveri se 4: 3/4 > 2/3, a 3/4 od 20 je 15, 2/3 od 24 pa 16 (več iz soda B);
en del je 20 : 4 = 5 oziroma 24 : 3 = 8.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#napaka-primerjava
besedilo: »$\dfrac{3}{4}$ je več kot $\dfrac{2}{3}$, a $\dfrac{3}{4}$ od $20\,\text{l}$ je $15\,\text{l}$, $\dfrac{2}{3}$ od $24\,\text{l}$ pa $16\,\text{l}$.« -/
theorem napaka_primerjava : (2 : ℚ) / 3 < 3 / 4 ∧ (3 : ℚ) / 4 * 20 = 15 ∧ (2 : ℚ) / 3 * 24 = 16 ∧
    (15 : ℚ) < 16 ∧ (20 : ℚ) / 4 = 5 ∧ (24 : ℚ) / 3 = 8 := by norm_num

/-- Pogoste napake 3: večji ulomek pomeni večji del pri isti celoti: q₁ < q₂ in c > 0 ⇒ q₁·c < q₂·c.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#vecji-ulomek-ista-celota
besedilo: »Večji ulomek pomeni večji del le pri isti celoti.« -/
theorem vecji_ulomek_ista_celota (q₁ q₂ c : ℚ) (hq : q₁ < q₂) (hc : 0 < c) : q₁ * c < q₂ * c :=
  mul_lt_mul_of_pos_right hq hc

/-- Predpostavki trditve `vecji_ulomek_ista_celota` se dasta izpolniti (2/3 < 3/4, c = 20). -/
example := vecji_ulomek_ista_celota (2 / 3) (3 / 4) 20 (by norm_num) (by norm_num)

/-! ## Drugače -/

/-- Na sliki: trak 12 kvadratkov; 12 : 3 = 4 (kino), ostane 8; 8 : 4 = 2 (knjiga), ostane 6 = 1/2 traku;
18 : 6 = 3 € na kvadratek, cel trak 12 · 3 = 36 €.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#na-sliki
besedilo: »Ker je to $6$ kvadratkov, je en kvadratek vreden $3$ €, cel trak pa $12 \cdot 3 = 36$ €.« -/
theorem na_sliki : (12 : ℚ) / 3 = 4 ∧ (12 : ℚ) - 4 = 8 ∧ (8 : ℚ) / 4 = 2 ∧ (8 : ℚ) - 2 = 6 ∧
    (6 : ℚ) / 12 = 1 / 2 ∧ (18 : ℚ) / 6 = 3 ∧ (12 : ℚ) * 3 = 36 := by norm_num

/-- Iz vsakdanjega življenja: pica 800 g, kos 800 : 8 = 100 g, 3 kosi 300 g; 3/8 pice = 360 g natanko pri
960 g (kos 120 g); 3/4 od 1000 g = 750 g.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#pica
besedilo: »Trije kosi so $360$ g, en kos $120$ g, osem kosov pa $960$ g.« -/
theorem pica (c : ℚ) : ((800 : ℚ) / 8 = 100 ∧ (100 : ℚ) * 3 = 300) ∧ ((3 : ℚ) / 8 * c = 360 ↔ c = 960) ∧
    (360 : ℚ) / 3 = 120 ∧ (120 : ℚ) * 8 = 960 ∧ (3 : ℚ) / 4 * 1000 = 750 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Korak za korakom: 5/6 poti je 45 km natanko pri poti 54 km (en del 45 : 5 = 9, 6 · 9 = 54); ostanek
1 − 5/6 = 1/6 je 9 km; 45 + 9 = 54. Del: 2/9 od 63 je 63 : 9 = 7, 7 · 2 = 14.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#korak
besedilo: »Cela pot: $6 \cdot 9 = 54$ km.« -/
theorem korak (c : ℚ) : ((5 : ℚ) / 6 * c = 45 ↔ c = 54) ∧ (45 : ℚ) / 5 = 9 ∧ (6 : ℚ) * 9 = 54 ∧
    (1 : ℚ) - 5 / 6 = 1 / 6 ∧ (1 : ℚ) / 6 * 54 = 9 ∧ (45 : ℚ) + 9 = 54 ∧ (63 : ℚ) / 9 = 7 ∧
    (7 : ℚ) * 2 = 14 ∧ (2 : ℚ) / 9 * 63 = 14 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Bolj natančno: 5/4 od 40 je 50 (več od celote); 1/4 od 2/3 celote je 1/6 celote.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#bolj-natancno
besedilo: »Del dela izračunaš z zmnožkom ulomkov: $\dfrac{1}{4}$ od $\dfrac{2}{3}$ celote je $\dfrac{1}{6}$ celote.« -/
theorem bolj_natancno : (5 : ℚ) / 4 * 40 = 50 ∧ (40 : ℚ) < 50 ∧ (1 : ℚ) / 4 * (2 / 3) = 1 / 6 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: znani del pomnožen z ulomkom (3/8 · 18 = 6,75) ni celota 48; 1/4 ostanka (1/6) ni 1/4
celote; pravilno: znani del deliš s števcem in množiš z imenovalcem (18 : 3 · 8 = 48).
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#kviz1
besedilo: »Znani del deliš s števcem, da dobiš en del, nato množiš z imenovalcem, ker ima celota toliko delov.« -/
theorem kviz1 : (3 : ℚ) / 8 * 18 ≠ 48 ∧ (1 : ℚ) / 4 * (1 - 1 / 3) ≠ 1 / 4 ∧ (18 : ℚ) / 3 * 8 = 48 := by
  norm_num

/-- Preveri se 2: 14 citrončkov je 2/7 vseh metuljev natanko pri 49 metuljih (14 : 2 = 7, 7 · 7 = 49);
napačni 4 = 2/7 · 14, 28 = 14 · 2 in 7 (en del) niso rešitve.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#kviz2
besedilo: »En del je $14 : 2 = 7$ metuljev, celota ima $7$ delov: $7 \cdot 7 = 49$ metuljev.« -/
theorem kviz2 (c : ℚ) : ((2 : ℚ) / 7 * c = 14 ↔ c = 49) ∧ (14 : ℚ) / 2 = 7 ∧ (7 : ℚ) * 7 = 49 ∧
    (2 : ℚ) / 7 * 14 = 4 ∧ (2 : ℚ) / 7 * 4 ≠ 14 ∧ (2 : ℚ) / 7 * 28 ≠ 14 ∧ (2 : ℚ) / 7 * 7 ≠ 14 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Preveri se 3: 3/5 poti je 12 km natanko pri poti 20 km (12 : 3 = 4, 4 · 5 = 20); Tilnov račun
12 : 5 = 2,4, 2,4 · 3 = 7,2 ni rešitev (7,2 < 12), prav tako ne 2,4 · 5 = 12 in deljenje s 15.
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#kviz3
besedilo: »En del je $12 : 3 = 4\,\text{km}$, pot ima $5$ delov: $4 \cdot 5 = 20\,\text{km}$.« -/
theorem kviz3 (c : ℚ) : ((3 : ℚ) / 5 * c = 12 ↔ c = 20) ∧ (12 : ℚ) / 3 = 4 ∧ (4 : ℚ) * 5 = 20 ∧
    (12 : ℚ) / 5 = 2.4 ∧ (2.4 : ℚ) * 3 = 7.2 ∧ (7.2 : ℚ) < 12 ∧ (3 : ℚ) / 5 * 7.2 ≠ 12 ∧
    (2.4 : ℚ) * 5 = 12 ∧ (3 : ℚ) / 5 * 12 ≠ 12 ∧ (3 : ℚ) / 5 * (12 / 15) ≠ 12 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num⟩
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Preveri se 5: 120 l, 2/5 za zalivanje: 120 : 5 · 2 = 48, ostane 72; polovica ostanka 36, ostane 36 l.
Napačni: 12 = 72 − 120/2, 72 (le po zalivanju), 48 (zalivanje).
trditev: MAT-OS-7/ulomki-v-besedilnih-nalogah#kviz5
besedilo: »Polovica ostanka je $36\,\text{l}$, zato v sodu ostane $36\,\text{l}$.« -/
theorem kviz5 : (120 : ℚ) / 5 * 2 = 48 ∧ (120 : ℚ) - 48 = 72 ∧ (72 : ℚ) / 2 = 36 ∧ (72 : ℚ) - 36 = 36 ∧
    (72 : ℚ) - 120 / 2 = 12 ∧ (12 : ℚ) ≠ 36 ∧ (72 : ℚ) ≠ 36 ∧ (48 : ℚ) ≠ 36 := by norm_num

/-! ## Blok RACUN -/

/-- Blok RACUN: vse vrstice »vrednost«.
pomozno – vrednosti skritega bloka RACUN (ni vidno besedilo); iste račune pokrivajo ptice, primer1–primer4, kviz2, kviz3, kviz5, napaka_primerjava -/
theorem racun :
    (18 : ℚ) / 3 * 8 = 48 ∧ (30 : ℚ) / 5 * 2 = 12 ∧ (96 : ℚ) / 2 * 5 = 240 ∧ (96 : ℚ) / 2 * 3 = 144 ∧
      ((1 : ℚ) - 1 / 3) * (1 - 1 / 4) = 1 / 2 ∧ (18 : ℚ) / (1 / 2) = 36 ∧ (1 : ℚ) / 2 * (1 - 3 / 5) = 1 / 5 ∧
      (40 : ℚ) / (1 / 5) = 200 ∧ (14 : ℚ) / 2 * 7 = 49 ∧ (12 : ℚ) / 3 * 5 = 20 ∧ (3 : ℚ) / 4 * 20 = 15 ∧
      (2 : ℚ) / 3 * 24 = 16 ∧ (120 : ℚ) * (1 - 2 / 5) * (1 - 1 / 2) = 36 := by
  norm_num

end Evklid.Lekcije.MAT_OS_7.UlomkiVBesedilnihNalogah
