/-
vir: content/lessons/MAT-SS-1/gaussova-metoda-in-sistemi-linearnih-neenacb.md
sha256: 20f2bb2cb90d34463473d5cb6a32dc2459252a0d4d50e7b7c20e7779f832b163
Ni v Leanu: risbe in simulacija (številske premice, polravnine, »območje je trikotnik/štirikotnik«; dokazano
je, katere točke so rešitve, oglišča kot presečišča robov in kateri robovi pripadajo območju); simulacija
»B od« je dokazana za B = [b, ∞) (presek z [−1, 3) je prazen natanko pri b ≥ 3); geometrijska razlaga z
ravninami v prostoru (Ustno 2, Bolj natančno: ena točka / nobena / premica ali ravnina) in »če sta taki
vrstici dve, sta parametra dva« kot opis (dokazani so konkretni primeri: ena rešitev, nobena, enoparametrična
družina, tri sovpadajoče ravnine z dvema parametroma, vrstica 0 = 0 ob vrstici 0 = c ne da rešitev); splošno
pravilo »0 = 0 brez vrstice 0 = c ⇒ neskončno rešitev« za poljuben sistem: zahtevno, še ni dokazano; postopki v korakih (Gaussova metoda, Ponovitev, Ustno 1 in 3, razvrščanje korakov v Preveri se 2)
in nasveti (»najraje koeficient 1«, »uporabi novo drugo enačbo«, »vedno uporabi testno točko«, polna/črtkana
črta kot dogovor risanja) kot navodila; »polravnina« kot geometrijski pojem (dokazano: pri b > 0 je
ax + by < c ⇔ y < (c − ax)/b, pri b < 0 se znak obrne; rob pripada rešitvam natanko pri nestrogi neenačbi);
utemeljitev testne točke je dokazana v obliki: če ima ax + by − c v dveh točkah različen predznak, daljica
med njima seka premico ax + by = c; analogiji (stopnice, sita); vsebinski modeli (tekma, trenerka,
stojnica; dokazana je algebra, rešitve iščemo v ℝ); točkovanje maturitetnih nalog; besedilo napačnih
odgovorov v Preveri se (kjer gre, je dokazano, da napačna vrednost ni rešitev).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.GaussovaMetodaInSistemiLinearnihNeenacb

/-! ## Razlaga 1: tekma -/

/-- Razlaga 1: (2) − 3·(1) da −y − 2z = −32, po množenju z −1 y + 2z = 32; (3) − nova (2) da −4z = −32. -/
theorem r1_koraki (x y z : ℝ) (h1 : x + y + z = 30) (h2 : 3 * x + 2 * y + z = 58) (h3 : y - 2 * z = 0) :
    -y - 2 * z = -32 ∧ y + 2 * z = 32 ∧ -4 * z = -32 :=
  ⟨by linarith, by linarith, by linarith⟩

/-- Predpostavke `r1_koraki` se dajo izpolniti (6, 16, 8). -/
example : (6:ℝ) + 16 + 8 = 30 ∧ (3:ℝ) * 6 + 2 * 16 + 8 = 58 ∧ (16:ℝ) - 2 * 8 = 0 := by norm_num

/-- Razlaga 1: vstavljanje nazaj z = 8, y = 32 − 2·8 = 16, x = 30 − 16 − 8 = 6; preizkus 6 + 16 + 8 = 30,
3·6 + 2·16 + 8 = 58, 16 − 2·8 = 0. -/
theorem r1_nazaj : (32:ℝ) - 2 * 8 = 16 ∧ (30:ℝ) - 16 - 8 = 6 ∧ (6:ℝ) + 16 + 8 = 30 ∧
    (3:ℝ) * 6 + 2 * 16 + 8 = 58 ∧ (16:ℝ) - 2 * 8 = 0 := by norm_num

/-- Razlaga 1, RACUN: sistem tekme ima natanko rešitev (6, 16, 8) – 6 trojk. -/
theorem r1_sistem (x y z : ℝ) :
    (x + y + z = 30 ∧ 3 * x + 2 * y + z = 58 ∧ y - 2 * z = 0) ↔ (x = 6 ∧ y = 16 ∧ z = 8) := by
  constructor
  · rintro ⟨h1, h2, h3⟩; refine ⟨?_, ?_, ?_⟩ <;> linarith
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-- Razlaga 1 (trikotna oblika): sistem iz sheme x + y + z = 30, y + 2z = 32, −4z = −32 ima isto rešitev. -/
theorem r1_trikotna (x y z : ℝ) :
    (x + y + z = 30 ∧ y + 2 * z = 32 ∧ -4 * z = -32) ↔ (x = 6 ∧ y = 16 ∧ z = 8) := by
  constructor
  · rintro ⟨h1, h2, h3⟩; refine ⟨?_, ?_, ?_⟩ <;> linarith
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-! ## Razlaga 2: ekvivalentne preoblike -/

/-- Razlaga 2 (zamenjava vrstnega reda): vrstni red enačb ne spremeni rešitev. -/
theorem zamenjaj (P Q : Prop) : (P ∧ Q) ↔ (Q ∧ P) := and_comm

/-- Razlaga 2 (množenje s številom l ≠ 0): enačba ax + by + cz = d je enakovredna
(la)x + (lb)y + (lc)z = ld. -/
theorem pomnozi (a b c d l x y z : ℝ) (hl : l ≠ 0) :
    a * x + b * y + c * z = d ↔ (l * a) * x + (l * b) * y + (l * c) * z = l * d := by
  constructor
  · intro h; linear_combination l * h
  · intro h
    have : l * (a * x + b * y + c * z - d) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h0 | h0
    · exact absurd h0 hl
    · linarith

/-- Predpostavka `pomnozi` se da izpolniti (l = −1). -/
example : (-1:ℝ) ≠ 0 := by norm_num

/-- Razlaga 2 in Bolj natančno (prištevanje večkratnika): sistem (1), (2) ima iste rešitve kot (1),
(2) − k·(1); nazaj dobimo staro (2) = nova (2) + k·(1). -/
theorem odstej_veckratnik (a₁ b₁ c₁ d₁ a₂ b₂ c₂ d₂ k x y z : ℝ) :
    (a₁ * x + b₁ * y + c₁ * z = d₁ ∧ a₂ * x + b₂ * y + c₂ * z = d₂) ↔
      (a₁ * x + b₁ * y + c₁ * z = d₁ ∧
        (a₂ - k * a₁) * x + (b₂ - k * b₁) * y + (c₂ - k * c₁) * z = d₂ - k * d₁) := by
  constructor
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linear_combination h2 - k * h1⟩
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linear_combination h2 + k * h1⟩

/-- Razlaga 2, Premisli in Povzetek: vrstica 0 = c s c ≠ 0 nima rešitve (nobena trojka je ne izpolni). -/
theorem vrstica_protislovje (c : ℝ) (hc : c ≠ 0) : ∀ x y z : ℝ, ¬ (0 * x + 0 * y + 0 * z = c) := by
  intro x y z h
  exact hc (by linarith)

/-- Predpostavka `vrstica_protislovje` se da izpolniti (c = 7). -/
example : (7:ℝ) ≠ 0 := by norm_num

/-- Pogoste napake 3 in Povzetek: vrstica 0 = 0 velja za vsako trojko (ne pove, da je rešitev 0). -/
theorem vrstica_nic (x y z : ℝ) : 0 * x + 0 * y + 0 * z = (0:ℝ) := by ring

/-- Formula, Pogoste napake 3, Povzetek: vrstica 0 = 0 da neskončno rešitev le, če ni vrstice 0 = c s c ≠ 0;
sistem z vrsticama 0 = 0 in 0 = 5 nima nobene rešitve. -/
theorem nic_in_protislovje (x y z : ℝ) :
    ¬ (0 * x + 0 * y + 0 * z = (0:ℝ) ∧ 0 * x + 0 * y + 0 * z = (5:ℝ)) := by
  rintro ⟨-, h⟩; norm_num at h

/-- Bolj natančno: če vse tri ravnine sovpadajo (x + y + z = 1, 2x + 2y + 2z = 2, 3x + 3y + 3z = 3),
so rešitve vsa ravnina, z dvema parametroma: (1 − s − t, s, t), s, t ∈ ℝ. -/
theorem sovpadajoce_ravnine (x y z : ℝ) :
    (x + y + z = 1 ∧ 2 * x + 2 * y + 2 * z = 2 ∧ 3 * x + 3 * y + 3 * z = 3) ↔
      ∃ s t : ℝ, x = 1 - s - t ∧ y = s ∧ z = t := by
  constructor
  · rintro ⟨h1, -, -⟩; exact ⟨y, z, by linarith, rfl, rfl⟩
  · rintro ⟨s, t, rfl, rfl, rfl⟩; refine ⟨?_, ?_, ?_⟩ <;> ring

/-! ## Razlaga 3: ko izgine zadnja neznanka -/

/-- Razlaga 3, RACUN: druga − prva in tretja − 2·prva dasta y + 2z = 2 in y + 2z = 3; sistem nima rešitve. -/
theorem r3_nobene (x y z : ℝ) :
    ((x + y + z = 3 ∧ x + 2 * y + 3 * z = 5 ∧ 2 * x + 3 * y + 4 * z = 9) →
      y + 2 * z = 2 ∧ y + 2 * z = 3) ∧
    ¬ (x + y + z = 3 ∧ x + 2 * y + 3 * z = 5 ∧ 2 * x + 3 * y + 4 * z = 9) := by
  refine ⟨fun ⟨h1, h2, h3⟩ => ⟨by linarith, by linarith⟩, ?_⟩
  rintro ⟨h1, h2, h3⟩; linarith

/-- Razlaga 3, RACUN: z desno stranjo 8 so rešitve natanko (1 + t, 2 − 2t, t); za t = 0 je to (1, 2, 0),
za t = 1 (2, 0, 1); 2(1 + t) + 3(2 − 2t) + 4t = 8. -/
theorem r3_neskoncno (x y z : ℝ) :
    (x + y + z = 3 ∧ x + 2 * y + 3 * z = 5 ∧ 2 * x + 3 * y + 4 * z = 8) ↔
      ∃ t : ℝ, x = 1 + t ∧ y = 2 - 2 * t ∧ z = t := by
  constructor
  · rintro ⟨h1, h2, h3⟩; exact ⟨z, by linarith, by linarith, rfl⟩
  · rintro ⟨t, rfl, rfl, rfl⟩; refine ⟨?_, ?_, ?_⟩ <;> ring

/-- Razlaga 3: x = 3 − y − z = 1 + t pri y = 2 − 2t, z = t; trojki (1, 2, 0) in (2, 0, 1) prestaneta preizkus. -/
theorem r3_trojki (t : ℝ) : 3 - (2 - 2 * t) - t = 1 + t ∧ 2 * (1 + t) + 3 * (2 - 2 * t) + 4 * t = 8 ∧
    ((1:ℝ) + 2 + 0 = 3 ∧ (1:ℝ) + 2 * 2 + 3 * 0 = 5 ∧ (2:ℝ) * 1 + 3 * 2 + 4 * 0 = 8) ∧
    ((2:ℝ) + 0 + 1 = 3 ∧ (2:ℝ) + 2 * 0 + 3 * 1 = 5 ∧ (2:ℝ) * 2 + 3 * 0 + 4 * 1 = 8) :=
  ⟨by ring, by ring, by norm_num, by norm_num⟩

/-! ## Razlaga 4: sistem neenačb z eno neznanko -/

/-- Razlaga 4: rešitev sistema x ≥ −1, x < 3 je presek, interval [−1, 3). -/
theorem r4_presek (x : ℝ) : (x ≥ -1 ∧ x < 3) ↔ x ∈ Set.Ico (-1:ℝ) 3 := by
  rw [Set.mem_Ico]

/-- Razlaga 4: če se intervala ne prekrivata, sistem nima rešitve. -/
theorem ne_prekrivata (A B : Set ℝ) (h : Disjoint A B) : ∀ x, ¬ (x ∈ A ∧ x ∈ B) :=
  fun _ ⟨ha, hb⟩ => Set.disjoint_left.mp h ha hb

/-- Predpostavka `ne_prekrivata` se da izpolniti ([−1, 3) in [3, ∞)). -/
example : Disjoint (Set.Ico (-1:ℝ) 3) (Set.Ici 3) :=
  Set.disjoint_left.mpr fun _ hx hy => absurd (Set.mem_Ici.mp hy) (not_le.mpr hx.2)

/-- Razlaga 4 (simulacija): presek [−1, 3) z B = [b, ∞) je prazen natanko pri b ≥ 3 (3 ni v A). -/
theorem simulacija (b : ℝ) : Set.Ico (-1:ℝ) 3 ∩ Set.Ici b = ∅ ↔ 3 ≤ b := by
  constructor
  · intro h
    by_contra hb
    rw [not_le] at hb
    have hm : max b (-1) ∈ Set.Ico (-1:ℝ) 3 ∩ Set.Ici b :=
      ⟨⟨le_max_right _ _, max_lt hb (by norm_num)⟩, le_max_left _ _⟩
    rw [h] at hm
    exact hm
  · intro hb
    ext x
    simp only [Set.mem_inter_iff, Set.mem_Ico, Set.mem_Ici, Set.mem_empty_iff_false, iff_false]
    rintro ⟨⟨_, h2⟩, h3⟩
    linarith

/-! ## Razlaga 5 in 6: polravnine -/

/-- Razlaga 5: pri b > 0 je ax + by < c ⇔ y < (c − ax)/b (polravnina pod premico ax + by = c). -/
theorem polravnina_pod (a b c x y : ℝ) (hb : 0 < b) : a * x + b * y < c ↔ y < (c - a * x) / b := by
  rw [lt_div_iff₀ hb]
  constructor <;> intro h <;> linarith

/-- Predpostavka `polravnina_pod` se da izpolniti (b = 3). -/
example : (0:ℝ) < 3 := by norm_num

/-- Razlaga 5 in Pogoste napake 5: pri b < 0 se znak obrne: ax + by < c ⇔ y > (c − ax)/b. -/
theorem polravnina_obrne (a b c x y : ℝ) (hb : b < 0) : a * x + b * y < c ↔ (c - a * x) / b < y := by
  rw [div_lt_iff_of_neg hb]
  constructor <;> intro h <;> linarith

/-- Predpostavka `polravnina_obrne` se da izpolniti (b = −1). -/
example : (-1:ℝ) < 0 := by norm_num

/-- Razlaga 5: točke z y > 2 so nad premico y = 2, z y < 2 pod njo, točke premice niso v nobeni
(vsaka točka je natanko v eni od treh možnosti). -/
theorem r5_y2 (y : ℝ) : (y > 2 ∨ y < 2 ∨ y = 2) ∧ ¬ (y > 2 ∧ y < 2) ∧ (y = 2 → ¬ (y > 2) ∧ ¬ (y < 2)) := by
  refine ⟨?_, fun ⟨h1, h2⟩ => by linarith, fun h => ⟨by linarith, by linarith⟩⟩
  rcases lt_trichotomy y 2 with h | h | h
  · exact Or.inr (Or.inl h)
  · exact Or.inr (Or.inr h)
  · exact Or.inl h

/-- Razlaga 5: točke roba ax + by = c so rešitve ax + by ≤ c, niso pa rešitve ax + by < c (polno/črtkano). -/
theorem rob (a b c x y : ℝ) (h : a * x + b * y = c) : a * x + b * y ≤ c ∧ ¬ (a * x + b * y < c) :=
  ⟨h.le, fun h' => absurd h (ne_of_lt h')⟩

/-- Predpostavka `rob` se da izpolniti (točka (3, 0) na 2x + 3y = 6). -/
example : (2:ℝ) * 3 + 3 * 0 = 6 := by norm_num

/-- Razlaga 5 in Ustno 3, Bolj natančno (testna točka): če je ax + by − c v točki P negativen in v Q pozitiven,
daljica PQ seka premico ax + by = c (predznak se zamenja le na premici). -/
theorem testna_tocka (a b c x₁ y₁ x₂ y₂ : ℝ) (h1 : a * x₁ + b * y₁ - c < 0) (h2 : 0 < a * x₂ + b * y₂ - c) :
    ∃ t : ℝ, 0 < t ∧ t < 1 ∧
      a * (x₁ + t * (x₂ - x₁)) + b * (y₁ + t * (y₂ - y₁)) = c := by
  set u := a * x₁ + b * y₁ - c with hu
  set v := a * x₂ + b * y₂ - c with hv
  have hd : 0 < v - u := by linarith
  refine ⟨-u / (v - u), div_pos (by linarith) hd, (div_lt_one hd).mpr (by linarith), ?_⟩
  have hc : -u / (v - u) * (v - u) = -u := div_mul_cancel₀ _ hd.ne'
  linear_combination hc

/-- Predpostavke `testna_tocka` se dajo izpolniti (2x + 3y − 6 v (0, 0) in (3, 3)). -/
example : (2:ℝ) * 0 + 3 * 0 - 6 < 0 ∧ (0:ℝ) < 2 * 3 + 3 * 3 - 6 := by norm_num

/-- Razlaga 5, Premisli: (0, 0) ne leži v 2x + 3y > 6 (0 > 6 ne velja); rešitev je polravnina nad premico
(2x + 3y > 6 ⇔ y > (6 − 2x)/3), rob ni rešitev. -/
theorem r5_premisli (x y : ℝ) : ¬ ((2:ℝ) * 0 + 3 * 0 > 6) ∧ (2 * x + 3 * y > 6 ↔ y > (6 - 2 * x) / 3) ∧
    (2 * x + 3 * y = 6 → ¬ (2 * x + 3 * y > 6)) := by
  refine ⟨by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩, fun h h' => by linarith⟩

/-! ## Primer 1 -/

/-- Primer 1, korak 1: 3x − 2 ≤ 10 ⇔ 3x ≤ 12 ⇔ x ≤ 4 (RACUN: (−∞, 4]). -/
theorem p1_prva (x : ℝ) : 3 * x - 2 ≤ 10 ↔ x ≤ 4 := by
  calc 3 * x - 2 ≤ 10 ↔ 3 * x ≤ 12 := by constructor <;> intro h <;> linarith
    _ ↔ x ≤ 4 := by constructor <;> intro h <;> linarith

/-- Primer 1, korak 2: 5 − 2x < 9 ⇔ −2x < 4 ⇔ x > −2 (deljenje z −2 obrne znak; RACUN: (−2, ∞)). -/
theorem p1_druga (x : ℝ) : 5 - 2 * x < 9 ↔ x > -2 := by
  calc 5 - 2 * x < 9 ↔ -2 * x < 4 := by constructor <;> intro h <;> linarith
    _ ↔ x > -2 := by constructor <;> intro h <;> linarith

/-- Primer 1, koraka 3 in 5, Pogoste napake 4: rešitev sistema je presek (−2, 4] (ne unija, ne vsa števila). -/
theorem p1_sistem (x : ℝ) : (3 * x - 2 ≤ 10 ∧ 5 - 2 * x < 9) ↔ x ∈ Set.Ioc (-2:ℝ) 4 := by
  rw [p1_prva, p1_druga, Set.mem_Ioc, and_comm]

/-- Primer 1, korak 4 in Pogoste napake 4: x = 0 ustreza obema (−2 ≤ 10, 5 < 9); x = 5 ni rešitev, čeprav
ustreza x > −2 (rešitev ni »vsa števila«). -/
theorem p1_preizkus : ((3:ℝ) * 0 - 2 = -2 ∧ (-2:ℝ) ≤ 10 ∧ (5:ℝ) - 2 * 0 = 5 ∧ (5:ℝ) < 9) ∧
    ((5:ℝ) > -2 ∧ ¬ ((3:ℝ) * 5 - 2 ≤ 10)) := by norm_num

/-! ## Primer 2 -/

/-- Primer 2, koraki 1–4: (2) − 2·(1): −3y − z = −9; (3) − (1): y − 2z = −4; druga + 3·prva: −7z = −21, z = 3. -/
theorem p2_koraki (x y z : ℝ) (h1 : x + y + z = 6) (h2 : 2 * x - y + z = 3) (h3 : x + 2 * y - z = 2) :
    -3 * y - z = -9 ∧ y - 2 * z = -4 ∧ -7 * z = -21 ∧ z = 3 :=
  ⟨by linarith, by linarith, by linarith, by linarith⟩

/-- Predpostavke `p2_koraki` se dajo izpolniti (1, 2, 3). -/
example : (1:ℝ) + 2 + 3 = 6 ∧ (2:ℝ) * 1 - 2 + 3 = 3 ∧ (1:ℝ) + 2 * 2 - 3 = 2 := by norm_num

/-- Primer 2, koraka 5–6: y = −4 + 2·3 = 2, x = 6 − 2 − 3 = 1; preizkus 1 + 2 + 3 = 6, 2·1 − 2 + 3 = 3,
1 + 2·2 − 3 = 2. -/
theorem p2_nazaj : (-4:ℝ) + 2 * 3 = 2 ∧ (6:ℝ) - 2 - 3 = 1 ∧ (1:ℝ) + 2 + 3 = 6 ∧ (2:ℝ) * 1 - 2 + 3 = 3 ∧
    (1:ℝ) + 2 * 2 - 3 = 2 := by norm_num

/-- Primer 2, korak 7, RACUN: sistem ima natanko rešitev (1, 2, 3). -/
theorem p2_sistem (x y z : ℝ) :
    (x + y + z = 6 ∧ 2 * x - y + z = 3 ∧ x + 2 * y - z = 2) ↔ (x = 1 ∧ y = 2 ∧ z = 3) := by
  constructor
  · rintro ⟨h1, h2, h3⟩; refine ⟨?_, ?_, ?_⟩ <;> linarith
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-! ## Primer 3 -/

/-- Pomožno: trenerkin načrt x + y ≤ 10, y < x, y ≥ 2. -/
def nacrt (x y : ℝ) : Prop := x + y ≤ 10 ∧ y < x ∧ y ≥ 2

/-- Primer 3, korak 2: testni točki (0, 0) za x + y ≤ 10 (0 ≤ 10) in (1, 0) za y < x (0 < 1). -/
theorem p3_testni : (0:ℝ) + 0 ≤ 10 ∧ (0:ℝ) < 1 := by norm_num

/-- Primer 3, korak 3, RACUN: oglišča: y = 2, x + y = 10 v (8, 2); y = x, x + y = 10 v (5, 5); y = 2, y = x
v (2, 2); (8, 2) je rešitev, oglišči na črtkanem robu (5, 5), (2, 2) nista. -/
theorem p3_oglisca (x y : ℝ) : ((y = 2 ∧ x + y = 10) ↔ (x = 8 ∧ y = 2)) ∧
    ((y = x ∧ x + y = 10) ↔ (x = 5 ∧ y = 5)) ∧ ((y = 2 ∧ y = x) ↔ (x = 2 ∧ y = 2)) ∧
    nacrt 8 2 ∧ ¬ nacrt 5 5 ∧ ¬ nacrt 2 2 := by
  refine ⟨⟨fun ⟨h1, h2⟩ => ⟨by linarith, h1⟩, fun ⟨h1, h2⟩ => ⟨h2, by linarith⟩⟩,
    ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩⟩,
    ⟨fun ⟨h1, h2⟩ => ⟨by linarith, h1⟩, fun ⟨h1, h2⟩ => ⟨h2, by linarith⟩⟩, ?_, ?_, ?_⟩ <;>
    norm_num [nacrt]

/-- Primer 3, koraka 4–5: T(5, 3) je rešitev (5 + 3 = 8 ≤ 10, 3 < 5, 3 ≥ 2), (4, 4) ni (4 < 4 ne velja). -/
theorem p3_tocki : ((5:ℝ) + 3 = 8 ∧ nacrt 5 3) ∧ ¬ nacrt 4 4 := by
  norm_num [nacrt]

/-- Primer 3, koraka 6–7: največje celo število ur moči je 4 (pri y ≥ 5 bi moralo biti x > 5 in x ≤ 5);
pri y = 4 ustrezata x = 5 in x = 6. -/
theorem p3_najvec : IsGreatest {y : ℤ | ∃ x : ℝ, nacrt x y} 4 ∧ nacrt 5 4 ∧ nacrt 6 4 := by
  refine ⟨⟨⟨5, by norm_num [nacrt]⟩, ?_⟩, by norm_num [nacrt], by norm_num [nacrt]⟩
  rintro y ⟨x, h1, h2, h3⟩
  by_contra hy
  have h5 : (5:ℤ) ≤ y := by omega
  have : (5:ℝ) ≤ y := by exact_mod_cast h5
  linarith

/-! ## Primer 4 -/

/-- Primer 4, koraka 1–2: druga − 2·prva in tretja − 4·prva dasta 3y − 3z = 3, torej y − z = 1 (dvakrat);
razlika je 0 = 0. -/
theorem p4_koraki (x y z : ℝ) (h1 : x - y + z = 1) (h2 : 2 * x + y - z = 5) (h3 : 4 * x - y + z = 7) :
    3 * y - 3 * z = 3 ∧ y - z = 1 ∧ (4 * x - y + z) - 4 * (x - y + z) = 3 ∧
      (4 * x - y + z - 4 * (x - y + z)) - (2 * x + y - z - 2 * (x - y + z)) = 0 :=
  ⟨by linarith, by linarith, by rw [h3, h1]; norm_num, by ring⟩

/-- Predpostavke `p4_koraki` se dajo izpolniti (2, 1, 0). -/
example : (2:ℝ) - 1 + 0 = 1 ∧ (2:ℝ) * 2 + 1 - 0 = 5 ∧ (4:ℝ) * 2 - 1 + 0 = 7 := by norm_num

/-- Primer 4, Premisli, RACUN: rešitve so natanko (2, 1 + t, t), t ∈ ℝ (x = 1 + y − z = 2);
2 − (1 + t) + t = 1, 2·2 + (1 + t) − t = 5, 4·2 − (1 + t) + t = 7. -/
theorem p4_sistem (x y z : ℝ) :
    (x - y + z = 1 ∧ 2 * x + y - z = 5 ∧ 4 * x - y + z = 7) ↔ ∃ t : ℝ, x = 2 ∧ y = 1 + t ∧ z = t := by
  constructor
  · rintro ⟨h1, h2, h3⟩; exact ⟨z, by linarith, by linarith, rfl⟩
  · rintro ⟨t, rfl, rfl, rfl⟩; refine ⟨?_, ?_, ?_⟩ <;> ring

/-- Primer 4, Premisli: (2, 1, 0) in (2, 2, 1) sta rešitvi; preizkus 2 − 1 + 0 = 1, 4 + 1 − 0 = 5,
8 − 1 + 0 = 7. -/
theorem p4_preizkus : ((2:ℝ) - 1 + 0 = 1 ∧ (4:ℝ) + 1 - 0 = 5 ∧ (8:ℝ) - 1 + 0 = 7) ∧
    ((2:ℝ) - 2 + 1 = 1 ∧ (2:ℝ) * 2 + 2 - 1 = 5 ∧ (4:ℝ) * 2 - 2 + 1 = 7) := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: trikratnik prve enačbe x + y + z = 30 je 3x + 3y + 3z = 90 (tudi desna stran). -/
theorem napaka_desna (x y z : ℝ) : 3 * (x + y + z) = 3 * x + 3 * y + 3 * z ∧ (3:ℝ) * 30 = 90 :=
  ⟨by ring, by norm_num⟩

/-- Pogoste napake 2: odstranjevanje y iz (3) tekme s pomočjo prve enačbe vrne x: (3) − (1) = −x − 3z. -/
theorem napaka_prva (x y z : ℝ) : (y - 2 * z) - (x + y + z) = -x - 3 * z := by ring

/-- Pogoste napake 5: 2x − y > 4 ⇔ y < 2x − 4 (pod premico, čeprav je znak >). -/
theorem napaka_polravnina (x y : ℝ) : 2 * x - y > 4 ↔ y < 2 * x - 4 :=
  ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Za maturo -/

/-- Naloga 1 a), koraki 1–3: (2) − 2·(1): −3y − 3z = −3, y + z = 1; (3) − 3·(1): −y − 7z = −13, y + 7z = 13;
razlika 6z = 12. -/
theorem m1_koraki (x y z : ℝ) (h1 : x + y + 2 * z = 6) (h2 : 2 * x - y + z = 9) (h3 : 3 * x + 2 * y - z = 5) :
    -3 * y - 3 * z = -3 ∧ y + z = 1 ∧ -y - 7 * z = -13 ∧ y + 7 * z = 13 ∧ 6 * z = 12 :=
  ⟨by linarith, by linarith, by linarith, by linarith, by linarith⟩

/-- Predpostavke `m1_koraki` se dajo izpolniti (3, −1, 2). -/
example : (3:ℝ) + (-1) + 2 * 2 = 6 ∧ (2:ℝ) * 3 - (-1) + 2 = 9 ∧ (3:ℝ) * 3 + 2 * (-1) - 2 = 5 := by norm_num

/-- Naloga 1 a), RACUN: y + z = 1, y + 7z = 13 ⇔ y = −1, z = 2. -/
theorem m1_dve (y z : ℝ) : (y + z = 1 ∧ y + 7 * z = 13) ↔ (y = -1 ∧ z = 2) := by
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 1 a), koraki 4–5: z = 2, y = 1 − 2 = −1, x = 6 − (−1) − 2·2 = 3; preizkus 3 − 1 + 4 = 6,
6 + 1 + 2 = 9, 9 − 2 − 2 = 5. -/
theorem m1_nazaj : (1:ℝ) - 2 = -1 ∧ (6:ℝ) - (-1) - 2 * 2 = 3 ∧ (3:ℝ) - 1 + 4 = 6 ∧ (6:ℝ) + 1 + 2 = 9 ∧
    (9:ℝ) - 2 - 2 = 5 := by norm_num

/-- Naloga 1 a), RACUN: sistem ima natanko rešitev (3, −1, 2). -/
theorem m1_sistem (x y z : ℝ) :
    (x + y + 2 * z = 6 ∧ 2 * x - y + z = 9 ∧ 3 * x + 2 * y - z = 5) ↔ (x = 3 ∧ y = -1 ∧ z = 2) := by
  constructor
  · rintro ⟨h1, h2, h3⟩; refine ⟨?_, ?_, ?_⟩ <;> linarith
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-- Naloga 1 b), korak 7: nova tretja − 3·(1): 3x + 3z − 3x − 3y − 6z = −3y − 3z, 15 − 18 = −3. -/
theorem m1_b_korak (x y z : ℝ) : 3 * x + 3 * z - 3 * x - 3 * y - 6 * z = -3 * y - 3 * z ∧ (15:ℝ) - 18 = -3 :=
  ⟨by ring, by norm_num⟩

/-- Naloga 1 b), RACUN: novi sistem ima natanko rešitve (5 − t, 1 − t, t), t ∈ ℝ
(x = 6 − (1 − t) − 2t = 5 − t); pri t = 2 dobimo (3, −1, 2). -/
theorem m1_b (x y z : ℝ) :
    (x + y + 2 * z = 6 ∧ 2 * x - y + z = 9 ∧ 3 * x + 3 * z = 15) ↔
      ∃ t : ℝ, x = 5 - t ∧ y = 1 - t ∧ z = t := by
  constructor
  · rintro ⟨h1, h2, h3⟩; exact ⟨z, by linarith, by linarith, rfl⟩
  · rintro ⟨t, rfl, rfl, rfl⟩; refine ⟨?_, ?_, ?_⟩ <;> ring

/-- Naloga 1 b), RACUN: 6 − (1 − t) − 2t = 5 − t; (5 − t) + (1 − t) + 2t = 6; 2(5 − t) − (1 − t) + t = 9;
3(5 − t) + 3t = 15; pri t = 2 je trojka (3, −1, 2). -/
theorem m1_b_preizkus (t : ℝ) : 6 - (1 - t) - 2 * t = 5 - t ∧ (5 - t) + (1 - t) + 2 * t = 6 ∧
    2 * (5 - t) - (1 - t) + t = 9 ∧ 3 * (5 - t) + 3 * t = 15 ∧
    ((5:ℝ) - 2 = 3 ∧ (1:ℝ) - 2 = -1) :=
  ⟨by ring, by ring, by ring, by ring, by norm_num⟩

/-- Naloga 1 b), korak 8: novi sistem ima neskončno mnogo rešitev. -/
theorem m1_b_neskoncno :
    Set.Infinite {p : ℝ × ℝ × ℝ | p.1 + p.2.1 + 2 * p.2.2 = 6 ∧ 2 * p.1 - p.2.1 + p.2.2 = 9 ∧
      3 * p.1 + 3 * p.2.2 = 15} := by
  refine Set.infinite_of_injective_forall_mem (f := fun t : ℝ => (5 - t, 1 - t, t)) ?_ ?_
  · intro a b h
    exact (Prod.ext_iff.mp (Prod.ext_iff.mp h).2).2
  · intro t
    exact (m1_b _ _ _).mpr ⟨t, rfl, rfl, rfl⟩

/-- Pomožno: pogoji stojnice x + y ≤ 9, 2x + y ≤ 14, y ≥ 2, x > 0. -/
def stojnica (x y : ℝ) : Prop := x + y ≤ 9 ∧ 2 * x + y ≤ 14 ∧ y ≥ 2 ∧ x > 0

/-- Naloga 2 b): točke na robovih: (0, 9), (9, 0) na x + y = 9; (7, 0), (6, 2) na 2x + y = 14; (0, 0) ustreza
x + y ≤ 9 in 2x + y ≤ 14; točke roba x = 0 niso rešitve (črtkano), točke na ostalih robovih so lahko. -/
theorem m2_b (y : ℝ) : ((0:ℝ) + 9 = 9 ∧ (9:ℝ) + 0 = 9 ∧ (2:ℝ) * 7 + 0 = 14 ∧ (2:ℝ) * 6 + 2 = 14) ∧
    ((0:ℝ) + 0 ≤ 9 ∧ (2:ℝ) * 0 + 0 ≤ 14) ∧ ¬ stojnica 0 y ∧ stojnica 6 2 ∧ stojnica 5 4 := by
  refine ⟨by norm_num, by norm_num, fun h => absurd h.2.2.2 (lt_irrefl 0), ?_, ?_⟩ <;>
    norm_num [stojnica]

/-- Naloga 2 c), RACUN: oglišča: x + y = 9, 2x + y = 14 ⇔ (5, 4); 2x + y = 14, y = 2 ⇔ (6, 2); y = 2, x = 0
da (0, 2); x + y = 9, x = 0 da (0, 9); (0, 2) in (0, 9) nista rešitvi. -/
theorem m2_c (x y : ℝ) : ((x + y = 9 ∧ 2 * x + y = 14) ↔ (x = 5 ∧ y = 4)) ∧
    ((2 * x + y = 14 ∧ y = 2) ↔ (x = 6 ∧ y = 2)) ∧ ((y = 2 ∧ x = 0) ↔ (x = 0 ∧ y = 2)) ∧
    ((x + y = 9 ∧ x = 0) ↔ (x = 0 ∧ y = 9)) ∧ ¬ stojnica 0 2 ∧ ¬ stojnica 0 9 := by
  refine ⟨⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩⟩,
    ⟨fun ⟨h1, h2⟩ => ⟨by linarith, h2⟩, fun ⟨h1, h2⟩ => ⟨by linarith, h2⟩⟩,
    ⟨fun ⟨h1, h2⟩ => ⟨h2, h1⟩, fun ⟨h1, h2⟩ => ⟨h2, h1⟩⟩,
    ⟨fun ⟨h1, h2⟩ => ⟨h2, by linarith⟩, fun ⟨h1, h2⟩ => ⟨by linarith, h1⟩⟩,
    fun h => absurd h.2.2.2 (lt_irrefl 0), fun h => absurd h.2.2.2 (lt_irrefl 0)⟩

/-- Naloga 2 d): (5, 3) je rešitev (5 + 3 = 8 ≤ 9, 10 + 3 = 13 ≤ 14, 3 ≥ 2, 5 > 0). -/
theorem m2_d_tocka : (5:ℝ) + 3 = 8 ∧ (2:ℝ) * 5 + 3 = 10 + 3 ∧ (10:ℝ) + 3 = 13 ∧ stojnica 5 3 := by
  norm_num [stojnica]

/-- Naloga 2 d), RACUN: pri x = 4: 4 + y ≤ 9 ⇔ y ≤ 5, 8 + y ≤ 14 ⇔ y ≤ 6; največ y je 5. -/
theorem m2_d_najvec : (∀ y : ℝ, (4 + y ≤ 9 ↔ y ≤ 5) ∧ (8 + y ≤ 14 ↔ y ≤ 6)) ∧
    IsGreatest {y : ℝ | stojnica 4 y} 5 := by
  refine ⟨fun y => ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩⟩,
    ⟨by norm_num [stojnica], ?_⟩⟩
  rintro y ⟨h1, _, _, _⟩
  linarith

/-! ## Preveri se -/

/-- Preveri se 1: trikotni sistem x + y + z = 4, y − z = 1, 2z = 6 ima natanko rešitev z = 3 (nato y = 4,
x = −3). -/
theorem preveri_1 (x y z : ℝ) : (x + y + z = 4 ∧ y - z = 1 ∧ 2 * z = 6) ↔ (x = -3 ∧ y = 4 ∧ z = 3) := by
  constructor
  · rintro ⟨h1, h2, h3⟩; refine ⟨?_, ?_, ?_⟩ <;> linarith
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-- Preveri se 3: pri y ≤ x namesto y < x se stran ne spremeni (testna točka (3, 1) ustreza obema), (3, 3)
pa postane rešitev; vsaka rešitev starega sistema je rešitev novega. -/
theorem preveri_3 : ((1:ℝ) ≥ 1 ∧ (1:ℝ) < 3 ∧ (3:ℝ) ≤ 5) ∧ ((1:ℝ) ≥ 1 ∧ (1:ℝ) ≤ 3 ∧ (3:ℝ) ≤ 5) ∧
    ((3:ℝ) ≥ 1 ∧ (3:ℝ) ≤ 3 ∧ (3:ℝ) ≤ 5) ∧ ¬ ((3:ℝ) < 3) ∧
    (∀ x y : ℝ, (y ≥ 1 ∧ y < x ∧ x ≤ 5) → (y ≥ 1 ∧ y ≤ x ∧ x ≤ 5)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun x y ⟨h1, h2, h3⟩ => ⟨h1, h2.le, h3⟩⟩

/-- Preveri se 4, RACUN: druga − prva: y + 2z = 5; tretja − prva: −2y + z = 0; 5z = 10; rešitev natanko
(1, 1, 2), z = 2 (ne 3,6, 2,8 ali 1). -/
theorem preveri_4 (x y z : ℝ) :
    ((x + y + z = 4 ∧ x + 2 * y + 3 * z = 9 ∧ x - y + 2 * z = 4) →
      y + 2 * z = 5 ∧ -2 * y + z = 0 ∧ 5 * z = 10) ∧
    ((x + y + z = 4 ∧ x + 2 * y + 3 * z = 9 ∧ x - y + 2 * z = 4) ↔ (x = 1 ∧ y = 1 ∧ z = 2)) ∧
    (2:ℝ) ≠ 3.6 ∧ (2:ℝ) ≠ 2.8 ∧ (2:ℝ) ≠ 1 := by
  refine ⟨fun ⟨h1, h2, h3⟩ => ⟨by linarith, by linarith, by linarith⟩, ⟨?_, ?_⟩, by norm_num, by norm_num,
    by norm_num⟩
  · rintro ⟨h1, h2, h3⟩; refine ⟨?_, ?_, ?_⟩ <;> linarith
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-- Preveri se 5, RACUN: 2x + 1 > −5 ⇔ x > −3, 4 − x ≥ 1 ⇔ x ≤ 3; rešitev (−3, 3]. -/
theorem preveri_5 (x : ℝ) : (2 * x + 1 > -5 ↔ x > -3) ∧ (4 - x ≥ 1 ↔ x ≤ 3) ∧
    ((2 * x + 1 > -5 ∧ 4 - x ≥ 1) ↔ x ∈ Set.Ioc (-3:ℝ) 3) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩, ?_⟩
  rw [Set.mem_Ioc]
  exact ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩⟩

/-- Preveri se 5: cela števila, ki rešijo sistem, so natanko −2, −1, 0, 1, 2, 3 – teh je 6. -/
theorem preveri_5_cela : (∀ x : ℤ, (2 * x + 1 > -5 ∧ 4 - x ≥ 1) ↔ x ∈ Finset.Ioc (-3:ℤ) 3) ∧
    Finset.Ioc (-3:ℤ) 3 = {-2, -1, 0, 1, 2, 3} ∧ (Finset.Ioc (-3:ℤ) 3).card = 6 := by
  refine ⟨fun x => ?_, by decide, by decide⟩
  rw [Finset.mem_Ioc]
  exact ⟨fun ⟨h1, h2⟩ => ⟨by omega, by omega⟩, fun ⟨h1, h2⟩ => ⟨by omega, by omega⟩⟩

end Evklid.Lekcije.MAT_SS_1.GaussovaMetodaInSistemiLinearnihNeenacb
