/-
vir: content/lessons/MAT-OS-7/razsirjanje-in-krajsanje-ulomkov.md
sha256: 0187de9fc2b1b509d0d91a030b70bb08c8c5736fc59c471f7f6abe66363c3c1a
Model: ulomek a/b je racionalno število (a : ℚ) / b; števec in imenovalec konkretnih ulomkov sta naravni števili,
splošna pravila za razširjanje in enakovrednost so v ℚ. »Enakovredna« pomeni enaka vrednost v ℚ. Krajšanje je
deljenje v ℕ (`a / n` z n ∣ a, brez ostanka). D(a, b) je `Nat.gcd a b`, »tuji števili« je `Nat.Coprime`, okrajšan
ulomek a/b je ulomek s `Nat.Coprime a b`.
Lean: x/0 = 0, zato pravili razširjanja in krajšanja veljata v Leanu tudi pri b = 0 (trditvi sta zapisani brez
pogoja b ≠ 0, torej močneje); pogoj n ≠ 0 pri razširjanju je potreben in je zapisan.
Ni v Leanu: zgodbe (Egipt, hekat, medicinska sestra, farmacevt) kot opis, razen računa 2/4 = 1/2; trakovi, številska
premica, krog, piksli in simulacija »Razširjanje in krajšanje ulomkov« kot slike (dokazane so enakosti ulomkov, ki
jih prikazujejo); »pobarvana dolžina je ista« in »kosi so manjši« kot opis (dokazana je enaka vrednost); »po 4 kose
ne gre, ena skupina bi bila napol pobarvana« (dokazano je le, da 4 deli 12, ne pa 6); pravilo deljivosti s 3 prek
vsote števk (dokazan je le primer: 9 in 24 sta deljivi s 3, vsoti števk sta 9 in 6); »meja primerjave« pri
analogiji in nasveti »popravek« kot navodilo; razlage napačnih odgovorov v kvizih (dokazano je, da so napačni
odgovori res napačni).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.RazsirjanjeInKrajsanjeUlomkov

/-! ## Splošna pravila -/

/-- Razlaga (Zapis s simboli), Povzetek 2, Primer 1 (formula): razširjanje s številom n ≠ 0 ne spremeni vrednosti:
a/b = (a · n)/(b · n).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#razsirjanje
besedilo: »Razširjanje s številom $n \ne 0$: $$\frac{a}{b} = \frac{a \cdot n}{b \cdot n}$$« -/
theorem razsirjanje (a b n : ℚ) (hn : n ≠ 0) : a / b = (a * n) / (b * n) :=
  (mul_div_mul_right a b hn).symm

/-- Predpostavka trditve `razsirjanje` se da izpolniti, izrek uporabljen na primeru (n = 4). -/
example := razsirjanje 3 5 4 (by norm_num)

/-- Bolj natančno: (a · n)/(b · n) = a/b · n/n = a/b · 1, ker je n/n = 1 (n ≠ 0, b ≠ 0).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#razsirjanje-zakaj
besedilo: »$$\frac{a \cdot n}{b \cdot n} = \frac{a}{b} \cdot \frac{n}{n} = \frac{a}{b} \cdot 1$$ Ulomek $\dfrac{n}{n}$ je enak $1$« -/
theorem razsirjanje_zakaj (a b n : ℚ) (hb : b ≠ 0) (hn : n ≠ 0) :
    (a * n) / (b * n) = a / b * (n / n) ∧ a / b * (n / n) = a / b * 1 ∧ n / n = 1 := by
  refine ⟨by field_simp, by rw [div_self hn], div_self hn⟩

/-- Predpostavke trditve `razsirjanje_zakaj` se dajo izpolniti, izrek uporabljen na primeru (b = 5, n = 4). -/
example := razsirjanje_zakaj 3 5 4 (by norm_num) (by norm_num)

/-- Razlaga (Zapis s simboli), Povzetek 3: krajšanje s skupnim deliteljem n (n ∣ a, n ∣ b, n ≠ 0) ne spremeni
vrednosti: a/b = (a : n)/(b : n).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#krajsanje
besedilo: »Krajšanje s skupnim deliteljem $n$ števca in imenovalca: $$\frac{a}{b} = \frac{a : n}{b : n}$$« -/
theorem krajsanje (a b n : ℕ) (hn : n ≠ 0) (ha : n ∣ a) (hb : n ∣ b) :
    (a : ℚ) / b = ((a / n : ℕ) : ℚ) / ((b / n : ℕ) : ℚ) := by
  have hn' : (n : ℚ) ≠ 0 := by exact_mod_cast hn
  rw [Nat.cast_div ha hn', Nat.cast_div hb hn', div_div_div_cancel_right₀ hn']

/-- Predpostavke trditve `krajsanje` se dajo izpolniti, izrek uporabljen na primeru (a = 12, b = 18, n = 6). -/
example := krajsanje 12 18 6 (by decide) (by decide) (by decide)

/-- Razlaga (Okrajšan ulomek), Povzetek 4 in 5, Primer 2 (formula), simboli: deljenje z D(a, b) (b > 0) da
enakovreden ulomek, katerega števec in imenovalec sta tuji števili, torej okrajšan ulomek, v enem koraku.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#okrajsan
besedilo: »Do okrajšanega ulomka pridemo z deljenjem z največjim skupnim deliteljem.« -/
theorem okrajsan (a b : ℕ) (hb : 0 < b) :
    (a : ℚ) / b = ((a / Nat.gcd a b : ℕ) : ℚ) / ((b / Nat.gcd a b : ℕ) : ℚ) ∧
      Nat.Coprime (a / Nat.gcd a b) (b / Nat.gcd a b) := by
  have hg : 0 < Nat.gcd a b := Nat.gcd_pos_of_pos_right a hb
  exact ⟨krajsanje a b _ hg.ne' (Nat.gcd_dvd_left a b) (Nat.gcd_dvd_right a b),
    Nat.coprime_div_gcd_div_gcd hg⟩

/-- Predpostavka trditve `okrajsan` se da izpolniti, izrek uporabljen na primeru (b = 32). -/
example := okrajsan 12 32 (by norm_num)

/-- Primer 3 (formula), Povzetek 6: dva ulomka a/b in c/d (b, d > 0) sta enakovredna natanko tedaj, ko ju
okrajšanje (deljenje z D) pripelje do istega okrajšanega ulomka (isti števec in isti imenovalec).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#enakovredna-okrajsana
besedilo: »Dva ulomka sta enakovredna, če ju skrajšamo do istega okrajšanega ulomka.« -/
theorem enakovredna_okrajsana (a b c d : ℕ) (hb : 0 < b) (hd : 0 < d) :
    (a : ℚ) / b = c / d ↔
      (a / Nat.gcd a b = c / Nat.gcd c d ∧ b / Nat.gcd a b = d / Nat.gcd c d) := by
  obtain ⟨k1, c1⟩ := okrajsan a b hb
  obtain ⟨k2, c2⟩ := okrajsan c d hd
  constructor
  · intro h
    rw [k1, k2] at h
    have hg1 : 0 < Nat.gcd a b := Nat.gcd_pos_of_pos_right a hb
    have hg2 : 0 < Nat.gcd c d := Nat.gcd_pos_of_pos_right c hd
    have p1 : 0 < b / Nat.gcd a b := Nat.div_pos (Nat.gcd_le_right a hb) hg1
    have p2 : 0 < d / Nat.gcd c d := Nat.div_pos (Nat.gcd_le_right c hd) hg2
    have := Rat.div_int_inj (a := ((a / Nat.gcd a b : ℕ) : ℤ)) (b := ((b / Nat.gcd a b : ℕ) : ℤ))
      (c := ((c / Nat.gcd c d : ℕ) : ℤ)) (d := ((d / Nat.gcd c d : ℕ) : ℤ))
      (by exact_mod_cast p1) (by exact_mod_cast p2)
      (by rw [Int.natAbs_natCast, Int.natAbs_natCast]; exact c1)
      (by rw [Int.natAbs_natCast, Int.natAbs_natCast]; exact c2)
      (by rw [Int.cast_natCast, Int.cast_natCast, Int.cast_natCast, Int.cast_natCast]; exact h)
    exact ⟨by exact_mod_cast this.1, by exact_mod_cast this.2⟩
  · rintro ⟨h1, h2⟩
    rw [k1, k2, h1, h2]

/-- Predpostavke trditve `enakovredna_okrajsana` se dajo izpolniti, izrek uporabljen na primeru (b = 45, d = 60). -/
example := enakovredna_okrajsana 18 45 24 60 (by norm_num) (by norm_num)

/-- Bolj natančno: ulomka a/b in c/d (b, d ≠ 0) sta enakovredna natanko tedaj, ko je a · d = b · c.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#navzkriz
besedilo: »Dva ulomka $\dfrac{a}{b}$ in $\dfrac{c}{d}$ sta enakovredna natanko tedaj, ko je $a \cdot d = b \cdot c$.« -/
theorem navzkriz (a b c d : ℚ) (hb : b ≠ 0) (hd : d ≠ 0) : a / b = c / d ↔ a * d = b * c := by
  rw [div_eq_div_iff hb hd, mul_comm c b]

/-- Predpostavke trditve `navzkriz` se dajo izpolniti, izrek uporabljen na primeru (b = 45, d = 60). -/
example := navzkriz 18 45 24 60 (by norm_num) (by norm_num)

/-! ## Zakaj se tega učimo, Razlaga -/

/-- Zakaj se tega učimo: dve četrtini sta ena polovica, 2/4 = 1/2.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#egipt
besedilo: »Odgovor je da: isto količino lahko zapišemo z različnimi ulomki.« -/
theorem egipt : (2 : ℚ) / 4 = 1 / 2 := by norm_num

/-- Razlaga (trakovi, številska premica): 1/2 = 2/4 = 3/6 = 4/8 (enakovredni ulomki); premisli 1: 3/4 = 6/8
(vsako četrtino prerežemo na pol: 3 · 2 = 6, 4 · 2 = 8).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#trakovi
besedilo: »Ulomki $\dfrac{1}{2}$, $\dfrac{2}{4}$, $\dfrac{3}{6}$ in $\dfrac{4}{8}$ padejo v isto točko.« -/
theorem trakovi : (1 : ℚ) / 2 = 2 / 4 ∧ (2 : ℚ) / 4 = 3 / 6 ∧ (3 : ℚ) / 6 = 4 / 8 ∧
    (3 : ℚ) / 4 = (3 * 2) / (4 * 2) ∧ (3 * 2 : ℚ) / (4 * 2) = 6 / 8 := by norm_num

/-- Razlaga (Razširjanje, Krajšanje): 2/4 razširimo s 3: 4 · 3 = 12, 2 · 3 = 6, 2/4 = 6/12; 6/12 skrajšamo z 2 v
3/6 in s 6 v 1/2; po 4 kose ne gre: 4 deli 12, ne deli pa 6.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#razsiri-skrajsaj
besedilo: »Pobarvana dolžina je ostala ista, zato $\dfrac{2}{4} = \dfrac{6}{12}$.« -/
theorem razsiri_skrajsaj : (4 : ℕ) * 3 = 12 ∧ (2 : ℕ) * 3 = 6 ∧ (2 : ℚ) / 4 = 6 / 12 ∧
    (6 : ℚ) / 12 = (6 / 2 : ℕ) / (12 / 2 : ℕ) ∧ ((6 / 2 : ℕ) : ℚ) / (12 / 2 : ℕ) = 3 / 6 ∧
    (6 : ℚ) / 12 = (6 / 6 : ℕ) / (12 / 6 : ℕ) ∧ ((6 / 6 : ℕ) : ℚ) / (12 / 6 : ℕ) = 1 / 2 ∧
    (4 ∣ 12 ∧ ¬ 4 ∣ 6) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by decide⟩

/-- Razlaga (Okrajšan ulomek): 1/2 je okrajšan (D(1, 2) = 1), 6/12 ni (D(6, 12) = 6 > 1); D(6, 12) = 6 da v enem
koraku 1/2.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#okrajsan-1-2
besedilo: »Ulomek $\dfrac{1}{2}$ je okrajšan, $\dfrac{6}{12}$ ni.« -/
theorem okrajsan_1_2 : Nat.Coprime 1 2 ∧ ¬ Nat.Coprime 6 12 ∧ Nat.gcd 6 12 = 6 ∧ 6 / 6 = 1 ∧ 12 / 6 = 2 := by
  decide

/-- Premisli 2: 12/18 skrajšan z 2 je 6/9, ki ni okrajšan (D(6, 9) = 3), 6/9 = 2/3; D(12, 18) = 6 in 12 : 6 = 2,
18 : 6 = 3.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#premisli2
besedilo: »Števili $6$ in $9$ sta še deljivi s $3$, zato $\dfrac{6}{9} = \dfrac{2}{3}$. Število $2$ je skupni delitelj, ni pa največji: $D(12, 18) = 6$.« -/
theorem premisli2 : (12 : ℚ) / 18 = 6 / 9 ∧ Nat.gcd 6 9 = 3 ∧ (6 : ℚ) / 9 = 2 / 3 ∧ Nat.gcd 12 18 = 6 ∧
    12 / 6 = 2 ∧ 18 / 6 = 3 := by
  refine ⟨by norm_num, by decide, by norm_num, by decide, by decide, by decide⟩

/-- Razlaga (Zapis s simboli): 3/5 = (3 · 4)/(5 · 4) = 12/20 in 12/18 = (12 : 6)/(18 : 6) = 2/3.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#zapis-s-simboli
besedilo: »Na primer $\dfrac{3}{5} = \dfrac{3 \cdot 4}{5 \cdot 4} = \dfrac{12}{20}$ in $\dfrac{12}{18} = \dfrac{12 : 6}{18 : 6} = \dfrac{2}{3}$.« -/
theorem zapis_s_simboli : (3 : ℚ) / 5 = (3 * 4) / (5 * 4) ∧ (3 * 4 : ℚ) / (5 * 4) = 12 / 20 ∧
    (12 : ℚ) / 18 = ((12 / 6 : ℕ) : ℚ) / ((18 / 6 : ℕ) : ℚ) ∧ ((12 / 6 : ℕ) : ℚ) / ((18 / 6 : ℕ) : ℚ) = 2 / 3 := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1 (enolično): 3/4 = x/20 natanko tedaj, ko je x = 15.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#primer1
besedilo: »Odgovor: odteči mora $15$ od $20$ razdelkov.« -/
theorem primer1 (x : ℚ) : 3 / 4 = x / 20 ↔ x = 15 := by
  constructor
  · intro h; field_simp at h; linarith
  · rintro rfl; norm_num

/-- Primer 1, korak 1–4: n = 20 : 4 = 5, x = 3 · 5 = 15, 3/4 = 15/20, preizkus (15 : 5)/(20 : 5) = 3/4.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#primer1-koraki
besedilo: »Zapis: $\dfrac{3}{4} = \dfrac{15}{20}$.« -/
theorem primer1_koraki : 20 / 4 = 5 ∧ 3 * 5 = 15 ∧ (3 : ℚ) / 4 = 15 / 20 ∧
    ((15 / 5 : ℕ) : ℚ) / ((20 / 5 : ℕ) : ℚ) = 3 / 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Primer 2: 12 = 2² · 3, 32 = 2⁵, D(12, 32) = 2² = 4, (12 : 4)/(32 : 4) = 3/8, 3 in 8 sta tuji; kočniki so 3/8
vseh zob.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#primer2
besedilo: »Odgovor: kočniki so $\dfrac{3}{8}$ vseh stalnih zob.« -/
theorem primer2 : (12 : ℕ) = 2 ^ 2 * 3 ∧ (32 : ℕ) = 2 ^ 5 ∧ Nat.gcd 12 32 = 2 ^ 2 ∧ (2 : ℕ) ^ 2 = 4 ∧
    (12 : ℚ) / 32 = ((12 / 4 : ℕ) : ℚ) / ((32 / 4 : ℕ) : ℚ) ∧ ((12 / 4 : ℕ) : ℚ) / ((32 / 4 : ℕ) : ℚ) = 3 / 8 ∧
    Nat.Coprime 3 8 := by
  refine ⟨by norm_num, by norm_num, by decide, by norm_num, by norm_num, by norm_num, by decide⟩

/-- Primer 3: 18 = 2 · 3², 45 = 3² · 5, D(18, 45) = 9, 18/45 = 2/5; 24 = 2³ · 3, 60 = 2² · 3 · 5, D(24, 60) = 12,
24/60 = 2/5; okrajšana ulomka sta enaka, zato sta deleža enakovredna (2 od vsakih 5).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#primer3
besedilo: »Okrajšana ulomka sta enaka, zato sta deleža enakovredna.« -/
theorem primer3 : (18 : ℕ) = 2 * 3 ^ 2 ∧ (45 : ℕ) = 3 ^ 2 * 5 ∧ Nat.gcd 18 45 = 9 ∧
    ((18 / 9 : ℕ) : ℚ) / ((45 / 9 : ℕ) : ℚ) = 2 / 5 ∧
    (24 : ℕ) = 2 ^ 3 * 3 ∧ (60 : ℕ) = 2 ^ 2 * 3 * 5 ∧ Nat.gcd 24 60 = 12 ∧
    ((24 / 12 : ℕ) : ℚ) / ((60 / 12 : ℕ) : ℚ) = 2 / 5 ∧ (18 : ℚ) / 45 = 24 / 60 := by
  refine ⟨by norm_num, by norm_num, by decide, by norm_num, by norm_num, by norm_num, by decide, by norm_num,
    by norm_num⟩

/-- Primer 3 po pravilu `enakovredna_okrajsana`: 18/45 = 24/60, ker se oba okrajšata v 2/5.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#primer3-pravilo
besedilo: »Odgovor: da, oba dneva sta skupino A imela $2$ od vsakih $5$ krvodajalcev.« -/
theorem primer3_pravilo : (18 : ℚ) / 45 = (24 : ℕ) / (60 : ℕ) := by
  have := (enakovredna_okrajsana 18 45 24 60 (by norm_num) (by norm_num)).mpr (by decide)
  exact_mod_cast this

/-- Bolj natančno (Primer 3): 18 · 60 = 1080 = 45 · 24, zato sta 18/45 in 24/60 enakovredna.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#primer3-navzkriz
besedilo: »Za ulomka iz Primera 3 je $18 \cdot 60 = 1080$ in $45 \cdot 24 = 1080$. Produkta sta enaka, zato sta ulomka enakovredna« -/
theorem primer3_navzkriz : (18 : ℚ) * 60 = 1080 ∧ (45 : ℚ) * 24 = 1080 ∧ (18 : ℚ) / 45 = 24 / 60 :=
  ⟨by norm_num, by norm_num, (navzkriz 18 45 24 60 (by norm_num) (by norm_num)).mpr (by norm_num)⟩

/-- Primer 4: 16 = 2⁴, 24 = 2³ · 3, D(16, 24) = 2³ = 8, (16 : 8)/(24 : 8) = 2/3 (dve tretjini dneva).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#primer4
besedilo: »$\dfrac{16 : 8}{24 : 8} = \dfrac{2}{3}$. Novorojenček prespi približno dve tretjini dneva.« -/
theorem primer4 : (16 : ℕ) = 2 ^ 4 ∧ (24 : ℕ) = 2 ^ 3 * 3 ∧ Nat.gcd 16 24 = 2 ^ 3 ∧ (2 : ℕ) ^ 3 = 8 ∧
    (16 : ℚ) / 24 = ((16 / 8 : ℕ) : ℚ) / ((24 / 8 : ℕ) : ℚ) ∧ ((16 / 8 : ℕ) : ℚ) / ((24 / 8 : ℕ) : ℚ) = 2 / 3 ∧
    Nat.Coprime 2 3 := by
  refine ⟨by norm_num, by norm_num, by decide, by norm_num, by norm_num, by norm_num, by decide⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 2/3 ≠ 2/12; 2/12 je četrtina vrednosti 2/3; pravilno 2/3 = 8/12.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#napaka1
besedilo: »$\dfrac{2}{12}$ je le četrtina vrednosti $\dfrac{2}{3}$.« -/
theorem napaka1 : (2 : ℚ) / 3 ≠ 2 / 12 ∧ (2 : ℚ) / 12 = 1 / 4 * (2 / 3) ∧ (2 : ℚ) / 3 = 8 / 12 := by norm_num

/-- Pogoste napake 2: prištevanje 2 obema da (1 + 2)/(2 + 2) = 3/4, ki ni 1/2, ampak več.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#napaka2
besedilo: »Na traku pa $\dfrac{3}{4}$ pokrije več kot $\dfrac{1}{2}$.« -/
theorem napaka2 : ((1 : ℚ) + 2) / (2 + 2) = 3 / 4 ∧ (1 : ℚ) / 2 ≠ 3 / 4 ∧ (1 : ℚ) / 2 < 3 / 4 := by norm_num

/-- Pogoste napake 3: (2 + 3)/(2 + 5) = 5/7, kar ni 3/5.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#napaka3
besedilo: »Toda $\dfrac{2 + 3}{2 + 5} = \dfrac{5}{7}$, kar ni $\dfrac{3}{5}$.« -/
theorem napaka3 : ((2 : ℚ) + 3) / (2 + 5) = 5 / 7 ∧ (5 : ℚ) / 7 ≠ 3 / 5 := by norm_num

/-- Pogoste napake 4: 24/36 = 12/18 je pravilno, a 12/18 ni okrajšan (D(12, 18) = 6); D(24, 36) = 12 da 2/3.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#napaka4
besedilo: »$\dfrac{24}{36} = \dfrac{12}{18}$ je pravilno, a ulomek še ni okrajšan.« -/
theorem napaka4 : (24 : ℚ) / 36 = 12 / 18 ∧ Nat.gcd 12 18 = 6 ∧ Nat.gcd 24 36 = 12 ∧
    ((24 / 12 : ℕ) : ℚ) / ((36 / 12 : ℕ) : ℚ) = 2 / 3 := by
  refine ⟨by norm_num, by decide, by decide, by norm_num⟩

/-- Pogoste napake 5: 15/20 ni več kot 3/4, je enak (okrajšan ulomek 3/4).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#napaka5
besedilo: »Na traku pokrijeta isto dolžino, le kosi so manjši.« -/
theorem napaka5 : (15 : ℚ) / 20 = 3 / 4 ∧ ¬ ((3 : ℚ) / 4 < 15 / 20) ∧ Nat.gcd 15 20 = 5 := by
  refine ⟨by norm_num, by norm_num, by decide⟩

/-! ## Drugače -/

/-- Z analogijo: 1 od 2 kvadratkov je 4 od 8 (vsak kvadratek na 4 manjše: 2 · 4 = 8, 1 · 4 = 4), 1/2 = 4/8.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#analogija
besedilo: »Slika je ista, le mreža je finejša: $\dfrac{1}{2} = \dfrac{4}{8}$.« -/
theorem analogija : (2 : ℕ) * 4 = 8 ∧ (1 : ℕ) * 4 = 4 ∧ (1 : ℚ) / 2 = 4 / 8 := by norm_num

/-- Iz vsakdanjega življenja: 6/12 = (6 : 6)/(12 : 6) = 1/2; 30/60 = 1/2; 15/60 = 1/4; 1/2 = 2/4, dvakrat po
1/4 skodelice je 1/2.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#vsakdan
besedilo: »$30$ minut od $60$ je $\dfrac{30}{60} = \dfrac{1}{2}$ ure. $15$ minut je $\dfrac{15}{60} = \dfrac{1}{4}$ ure.« -/
theorem vsakdan : (6 : ℚ) / 12 = ((6 / 6 : ℕ) : ℚ) / ((12 / 6 : ℕ) : ℚ) ∧
    ((6 / 6 : ℕ) : ℚ) / ((12 / 6 : ℕ) : ℚ) = 1 / 2 ∧ (30 : ℚ) / 60 = 1 / 2 ∧ (15 : ℚ) / 60 = 1 / 4 ∧
    (1 : ℚ) / 2 = 2 / 4 ∧ 2 * ((1 : ℚ) / 4) = 1 / 2 := by norm_num

/-- Korak za korakom: 18/48 = 9/24 (z 2) = 3/8 (s 3; 9 in 24 sta deljivi s 3, vsoti števk 9 in 2 + 4 = 6); 3 in 8
sta tuji; v enem koraku D(18, 48) = 6 in (18 : 6)/(48 : 6) = 3/8.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#korak-za-korakom
besedilo: »V enem koraku: $D(18, 48) = 6$, zato $\dfrac{18 : 6}{48 : 6} = \dfrac{3}{8}$.« -/
theorem korak_za_korakom : ((18 / 2 : ℕ) : ℚ) / ((48 / 2 : ℕ) : ℚ) = 9 / 24 ∧ (18 : ℚ) / 48 = 9 / 24 ∧
    (3 ∣ 9 ∧ 3 ∣ 24) ∧ 2 + 4 = 6 ∧ ((9 / 3 : ℕ) : ℚ) / ((24 / 3 : ℕ) : ℚ) = 3 / 8 ∧ Nat.Coprime 3 8 ∧
    Nat.gcd 18 48 = 6 ∧ ((18 / 6 : ℕ) : ℚ) / ((48 / 6 : ℕ) : ℚ) = 3 / 8 := by
  refine ⟨by norm_num, by norm_num, by decide, by norm_num, by norm_num, by decide, by decide, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: števec in imenovalec pomnožimo s 3, vrednost ostane enaka; pri a/b ≠ 0 se ne potroji, ne zmanjša
na tretjino in ne poveča za 3.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#kviz1
besedilo: »To je razširjanje: $\dfrac{a \cdot 3}{b \cdot 3} = \dfrac{a}{b}$.« -/
theorem kviz1 (a b : ℚ) (h : a / b ≠ 0) :
    (a * 3) / (b * 3) = a / b ∧ (a * 3) / (b * 3) ≠ 3 * (a / b) ∧ (a * 3) / (b * 3) ≠ a / b / 3 ∧
      (a * 3) / (b * 3) ≠ a / b + 3 := by
  rw [← razsirjanje a b 3 (by norm_num)]
  refine ⟨rfl, fun e => h (by linarith), fun e => h (by linarith), fun e => by linarith⟩

/-- Predpostavka trditve `kviz1` se da izpolniti, izrek uporabljen na primeru (a/b = 2/5). -/
example := kviz1 2 5 (by norm_num)

/-- Preveri se 2: 4/10, 14/35 (14 = 2 · 7, 35 = 5 · 7) in 10/25 so enakovredni 2/5; 6/12 = 1/2 ni (6 = 3 · 2,
12 ≠ 3 · 5 = 15).
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#kviz2
besedilo: »$\dfrac{4}{10}$, $\dfrac{14}{35}$ in $\dfrac{10}{25}$ se skrajšajo na $\dfrac{2}{5}$. Ulomek $\dfrac{6}{12}$ pa se skrajša na $\dfrac{1}{2}$« -/
theorem kviz2 : (4 : ℚ) / 10 = 2 / 5 ∧ (14 : ℕ) = 2 * 7 ∧ (35 : ℕ) = 5 * 7 ∧ (14 : ℚ) / 35 = 2 / 5 ∧
    (10 : ℚ) / 25 = 2 / 5 ∧ (6 : ℚ) / 12 = 1 / 2 ∧ (6 : ℚ) / 12 ≠ 2 / 5 ∧ (6 : ℕ) = 3 * 2 ∧ (12 : ℕ) ≠ 3 * 5 := by
  norm_num

/-- Preveri se 3: Luka: 36/48 = 18/24 (z 2), 18/24 = 6/8 (s 3) sta pravilna; korak 3 je napačen: 6/8 ni okrajšan
(D(6, 8) = 2), 6/8 = 3/4; D(36, 48) = 12 in (36 : 12)/(48 : 12) = 3/4.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#kviz3
besedilo: »$6$ in $8$ imata skupni delitelj $2$, zato $\dfrac{6}{8} = \dfrac{3}{4}$.« -/
theorem kviz3 : (36 : ℚ) / 48 = 18 / 24 ∧ (18 : ℚ) / 24 = 6 / 8 ∧ ¬ Nat.Coprime 6 8 ∧ Nat.gcd 6 8 = 2 ∧
    (6 : ℚ) / 8 = 3 / 4 ∧ Nat.gcd 36 48 = 12 ∧ ((36 / 12 : ℕ) : ℚ) / ((48 / 12 : ℕ) : ℚ) = 3 / 4 := by
  refine ⟨by norm_num, by norm_num, by decide, by decide, by norm_num, by decide, by norm_num⟩

/-- Preveri se 4: 42 = 2 · 3 · 7, 56 = 2³ · 7, D(42, 56) = 2 · 7 = 14 in (42 : 14)/(56 : 14) = 3/4; 21/28 in 6/8
nista okrajšana (D = 7 in 2), 7/8 (42 : 6, 56 : 7) ni enakovreden 42/56.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#kviz4
besedilo: »$D(42, 56) = 2 \cdot 7 = 14$ in $\dfrac{42 : 14}{56 : 14} = \dfrac{3}{4}$.« -/
theorem kviz4 : (42 : ℕ) = 2 * 3 * 7 ∧ (56 : ℕ) = 2 ^ 3 * 7 ∧ Nat.gcd 42 56 = 2 * 7 ∧ 2 * 7 = 14 ∧
    ((42 / 14 : ℕ) : ℚ) / ((56 / 14 : ℕ) : ℚ) = 3 / 4 ∧ Nat.Coprime 3 4 ∧ Nat.gcd 21 28 = 7 ∧ Nat.gcd 6 8 = 2 ∧
    42 / 6 = 7 ∧ 56 / 7 = 8 ∧ (42 : ℚ) / 56 ≠ 7 / 8 := by
  refine ⟨by norm_num, by norm_num, by decide, by norm_num, by norm_num, by decide, by decide, by decide,
    by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 5: 6/8 = (6 : 2)/(8 : 2) = 3/4; 2/4 (odšteti 4) je le pol žličke, manj kot 6/8; 6/4 je več kot cela
žlička in dvakrat več od 6/8.
trditev: MAT-OS-7/razsirjanje-in-krajsanje-ulomkov#kviz5
besedilo: »$\dfrac{6}{8}$ skrajšamo z $2$: $\dfrac{6 : 2}{8 : 2} = \dfrac{3}{4}$.« -/
theorem kviz5 : ((6 / 2 : ℕ) : ℚ) / ((8 / 2 : ℕ) : ℚ) = 3 / 4 ∧ (6 : ℚ) / 8 = 3 / 4 ∧ (2 : ℚ) / 4 = 1 / 2 ∧
    (2 : ℚ) / 4 < 6 / 8 ∧ (1 : ℚ) < 6 / 4 ∧ (6 : ℚ) / 4 = 2 * (6 / 8) := by norm_num

end Evklid.Lekcije.MAT_OS_7.RazsirjanjeInKrajsanjeUlomkov
