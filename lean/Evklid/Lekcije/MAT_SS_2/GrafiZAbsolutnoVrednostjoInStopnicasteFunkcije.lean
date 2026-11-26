/-
vir: content/lessons/MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije.md
sha256: 2f80bb809cf13b1fb1f4e621b6dc21305f1e6b9a736c4ed428a7fdff73a31b72
Ni v Leanu: risbe, simulacija in opisi risanja (polna pika / prazen krožec, »korito«, prepogib, ogledalo,
navpično ravnilo; dokazano je, katera krajišča pripadajo stopnicam, in da je vsota razdalj najmanjša na
celi daljici), Premisli 1 in Preveri se 1 ter Ustno vprašanje 2 o tem, da funkcija vsakemu x priredi eno
vrednost (lastnost definicije funkcije, ne trditev lekcije o številih; dokazane so vrednosti na mejah, npr.
⌊600/300⌋ = 2), cena moke (premo sorazmerje, brez podatkov), Postopek in Pazi na (navodila), točkovanje.
Tarife »za vsako začeto uro / 10 minut« so zapisane s funkcijo navzgor zaokroženo ⌈·⌉ (`Int.ceil`), cenik
paketov v Preveri se 2 pa po intervalih s slike. Celi del je Mathlibov `Int.floor` (⌊·⌋).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.GrafiZAbsolutnoVrednostjoInStopnicasteFunkcije

open Real Set

/-! ## Celi del in štručke -/

/-- Razlaga 1 in 3: število štručk po 300 g je n = ⌊m/300⌋ in velja ⌊m/300⌋ = k natanko za 300k ≤ m < 300(k + 1)
(vsak k ∈ ℤ).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#strucke
besedilo: »$0 \le m < 300$« -/
theorem strucke (m : ℝ) (k : ℤ) : ⌊m / 300⌋ = k ↔ 300 * (k : ℝ) ≤ m ∧ m < 300 * ((k : ℝ) + 1) := by
  rw [Int.floor_eq_iff, le_div_iff₀ (by norm_num), div_lt_iff₀ (by norm_num)]
  constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith

/-- Razlaga 1, tabela: 0 ≤ m < 300 da 0 štručk, 300 ≤ m < 600 eno, 600 ≤ m < 900 dve, 900 ≤ m < 1200 tri.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#tabela
besedilo: »| $900 \le m < 1200$ | $3$ |« -/
theorem tabela (m : ℝ) :
    (0 ≤ m ∧ m < 300 → ⌊m / 300⌋ = 0) ∧ (300 ≤ m ∧ m < 600 → ⌊m / 300⌋ = 1) ∧
    (600 ≤ m ∧ m < 900 → ⌊m / 300⌋ = 2) ∧ (900 ≤ m ∧ m < 1200 → ⌊m / 300⌋ = 3) := by
  refine ⟨fun h => ?_, fun h => ?_, fun h => ?_, fun h => ?_⟩ <;> rw [strucke] <;> push_cast <;>
    constructor <;> linarith [h.1, h.2]

/-- Uganka 1, Razlaga 2 in 3 ter blok RACUN: iz 899 g sta 2 štručki, iz 900 g 3; iz natanko 300 g ena (točka
(300, 1)), iz 600 g dve; ⌊899/300⌋ = ⌊2,99…⌋ = 2.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#strucke-vrednosti
besedilo: »in iz $899\,\mathrm{g}$ dobiš $\lfloor 2{,}99\ldots \rfloor = 2$ štručki, iz $900\,\mathrm{g}$ pa $3$.« -/
theorem strucke_vrednosti :
    ⌊(899:ℝ) / 300⌋ = 2 ∧ ⌊(900:ℝ) / 300⌋ = 3 ∧ ⌊(300:ℝ) / 300⌋ = 1 ∧ ⌊(600:ℝ) / 300⌋ = 2 ∧
    (2.99 : ℝ) < 899 / 300 ∧ (899 : ℝ) / 300 < 3 := by
  refine ⟨?_, ?_, ?_, ?_, by norm_num, by norm_num⟩ <;> rw [strucke] <;> norm_num

/-- Razlaga 3 (definicija celega dela): ⌊x⌋ je največje celo število, ki ni večje od x: celo z je ≤ ⌊x⌋ natanko
tedaj, ko je z ≤ x; zato ⌊x⌋ ≤ x < ⌊x⌋ + 1 (Ponovitev); stopnice ležijo pod premico y = x za manj kot 1 in se je
dotaknejo natanko v celih številih.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#celi-del
besedilo: »Premica raste enakomerno, celi del skače. Polne pike ležijo na premici, vse ostalo pod njo, a za manj kot $1$: $\lfloor x \rfloor \le x < \lfloor x \rfloor + 1$.« -/
theorem celi_del (x : ℝ) :
    (∀ z : ℤ, z ≤ ⌊x⌋ ↔ (z : ℝ) ≤ x) ∧ ((⌊x⌋ : ℝ) ≤ x ∧ x < ⌊x⌋ + 1) ∧ x - ⌊x⌋ < 1 ∧
    ((⌊x⌋ : ℝ) = x ↔ ∃ n : ℤ, x = n) := by
  refine ⟨fun z => Int.le_floor, ⟨Int.floor_le x, Int.lt_floor_add_one x⟩, by linarith [Int.lt_floor_add_one x],
    ⟨fun h => ⟨⌊x⌋, h.symm⟩, ?_⟩⟩
  rintro ⟨n, rfl⟩; simp

/-- Razlaga 3, Pogoste napake, Povzetek, Ponovitev in Ustno vprašanje 1: ⌊2,7⌋ = 2, ⌊5⌋ = 5, ⌊−2,7⌋ = −3,
⌊−2,3⌋ = −3 (−2 ni rešitev, ker je −2 > −2,3 oz. −2 > −2,7).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#primeri-celi-del
besedilo: »Primeri: $\lfloor 2{,}7 \rfloor = 2$, $\lfloor 5 \rfloor = 5$, $\lfloor -2{,}7 \rfloor = -3$.« -/
theorem primeri_celi_del :
    ⌊(2.7:ℝ)⌋ = 2 ∧ ⌊(5:ℝ)⌋ = 5 ∧ ⌊(-2.7:ℝ)⌋ = -3 ∧ ⌊(-2.3:ℝ)⌋ = -3 ∧ (-2.7:ℝ) < -2 ∧ (-2.3:ℝ) < -2 := by
  refine ⟨?_, ?_, ?_, ?_, by norm_num, by norm_num⟩ <;> rw [Int.floor_eq_iff] <;> norm_num

/-! ## Parkirnina (Razlaga 4, Primer 1) -/

/-- Primer 1: cena parkiranja za t ur (prva ura 1 €, vsaka nadaljnja začeta ura 1,50 €): C(t) = 1 + 1,5·(⌈t⌉ − 1).
-/
noncomputable def C (t : ℝ) : ℝ := 1 + 1.5 * ((⌈t⌉ : ℝ) - 1)

/-- Pomožna trditev: za k − 1 < t ≤ k je ⌈t⌉ = k (polna pika na desnem krajišču stopnice).
pomozno -/
theorem ceil_na (t : ℝ) (k : ℤ) (h1 : (k : ℝ) - 1 < t) (h2 : t ≤ k) : ⌈t⌉ = k :=
  Int.ceil_eq_iff.mpr ⟨h1, h2⟩

/-- Predpostavke `ceil_na` se dajo izpolniti (t = k = 1). -/
example : ((1:ℤ) : ℝ) - 1 < 1 ∧ (1:ℝ) ≤ ((1:ℤ) : ℝ) := by norm_num

/-- Primer 1, koraki 1–3: C = 1 € na (0, 1], 1 + 1,5 = 2,50 € na (1, 2], 1 + 2·1,5 = 4 € na (2, 3] in
1 + 3·1,5 = 5,50 € na (3, 4] (pri natanko 1 uri druga ura še ni začeta: C(1) = 1).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#parkirnina
besedilo: »Za $2 < t \le 3$: $1 + 2 \cdot 1{,}5 = 4$, torej $4\,\text{€}$. Za $3 < t \le 4$: $1 + 3 \cdot 1{,}5 = 5{,}5$, torej $5{,}50\,\text{€}$.« -/
theorem parkirnina (t : ℝ) :
    (0 < t ∧ t ≤ 1 → C t = 1) ∧ (1 < t ∧ t ≤ 2 → C t = 1 + 1.5 ∧ (1:ℝ) + 1.5 = 2.5) ∧
    (2 < t ∧ t ≤ 3 → C t = 1 + 2 * 1.5 ∧ (1:ℝ) + 2 * 1.5 = 4) ∧
    (3 < t ∧ t ≤ 4 → C t = 1 + 3 * 1.5 ∧ (1:ℝ) + 3 * 1.5 = 5.5) := by
  refine ⟨?_, ?_, ?_, ?_⟩ <;> rintro ⟨h1, h2⟩
  · rw [C, ceil_na t 1 (by push_cast; linarith) (by push_cast; linarith)]; norm_num
  · rw [C, ceil_na t 2 (by push_cast; linarith) (by push_cast; linarith)]; norm_num
  · rw [C, ceil_na t 3 (by push_cast; linarith) (by push_cast; linarith)]; norm_num
  · rw [C, ceil_na t 4 (by push_cast; linarith) (by push_cast; linarith)]; norm_num

/-- Primer 1, koraka 5 in 6: C(2,5) = 4 €; za 4 € lahko parkiraš največ 3 ure: C(3) = 4 in za parkirni čas
t > 0 je C(t) ≤ 4 natanko tedaj, ko je t ≤ 3.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#parkirnina-odgovor
besedilo: »Odgovor: za $2{,}5$ ure plačaš $4\,\text{€}$, za $4\,\text{€}$ pa lahko parkiraš največ $3$ ure.« -/
theorem parkirnina_odgovor : C 2.5 = 4 ∧ C 3 = 4 ∧ ∀ t, 0 < t → (C t ≤ 4 ↔ t ≤ 3) := by
  refine ⟨?_, ?_, fun t _ => ?_⟩
  · rw [C, ceil_na 2.5 3 (by norm_num) (by norm_num)]; norm_num
  · rw [C, ceil_na 3 3 (by norm_num) (by norm_num)]; norm_num
  · have e : C t ≤ 4 ↔ ((⌈t⌉ : ℤ) : ℝ) ≤ ((3 : ℤ) : ℝ) := by
      rw [C]; push_cast; constructor <;> intro h <;> linarith
    rw [e, Int.cast_le, Int.ceil_le]; norm_num

/-! ## Vsota absolutnih vrednosti (Razlaga 5, Primer 3) -/

/-- Razlaga 5 (definicija): |a| = a za a ≥ 0 in |a| = −a za a < 0.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#definicija
besedilo: »$$|a| = -a, \quad \text{če je } a < 0$$« -/
theorem definicija (a : ℝ) : (0 ≤ a → |a| = a) ∧ (a < 0 → |a| = -a) :=
  ⟨abs_of_nonneg, abs_of_neg⟩

/-- Razlaga 5 (in blok RACUN): f(x) = |x − 1| + |x + 2| po primerih: za x < −2 je |x − 1| = 1 − x,
|x + 2| = −x − 2 in f(x) = −2x − 1; za −2 ≤ x < 1 je |x − 1| = 1 − x, |x + 2| = x + 2 in f(x) = 3; za x ≥ 1
je |x − 1| = x − 1, |x + 2| = x + 2 in f(x) = 2x + 1.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#korito-po-primerih
besedilo: »$-2 \le x < 1$: $\lvert x - 1 \rvert = 1 - x$ in $\lvert x + 2 \rvert = x + 2$, zato je $f(x) = 3$;« -/
theorem korito_po_primerih (x : ℝ) :
    (x < -2 → |x - 1| = 1 - x ∧ |x + 2| = -x - 2 ∧ (1 - x) + (-x - 2) = -2 * x - 1) ∧
    (-2 ≤ x ∧ x < 1 → |x - 1| = 1 - x ∧ |x + 2| = x + 2 ∧ (1 - x) + (x + 2) = 3) ∧
    (1 ≤ x → |x - 1| = x - 1 ∧ |x + 2| = x + 2 ∧ (x - 1) + (x + 2) = 2 * x + 1) := by
  refine ⟨fun h => ⟨?_, ?_, by ring⟩, fun h => ⟨?_, ?_, by ring⟩, fun h => ⟨?_, ?_, by ring⟩⟩
  · rw [abs_of_neg (by linarith)]; ring
  · rw [abs_of_neg (by linarith)]; ring
  · rw [abs_of_neg (by linarith [h.2])]; ring
  · rw [abs_of_nonneg (by linarith [h.1])]
  · rw [abs_of_nonneg (by linarith)]
  · rw [abs_of_nonneg (by linarith)]

/-- Razlaga 5 (Uganka 2) in Drugače: Na sliki: vsota razdalj |x − 1| + |x + 2| je vedno vsaj 3 m, enaka 3 natanko
za −2 ≤ x ≤ 1 (najboljših mest je neskončno mnogo); deska pri 2 je oddaljena 4 + 1 = 3 + 2·1 = 5. Razlaga 7:
enačba |x − 1| + |x + 2| = 2 nima rešitve.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#korito-dno
besedilo: »$f(-3) = |-3 - 1| + |-3 + 2| = 4 + 1 = 5$« -/
theorem korito_dno :
    (∀ x : ℝ, 3 ≤ |x - 1| + |x + 2|) ∧ (∀ x : ℝ, |x - 1| + |x + 2| = 3 ↔ -2 ≤ x ∧ x ≤ 1) ∧
    {x : ℝ | |x - 1| + |x + 2| = 3}.Infinite ∧ |(2:ℝ) - 1| + |(2:ℝ) + 2| = 5 ∧ (3:ℝ) + 2 * 1 = 5 ∧
    (∀ x : ℝ, |x - 1| + |x + 2| ≠ 2) := by
  have hmin : ∀ x : ℝ, 3 ≤ |x - 1| + |x + 2| := fun x => by
    rcases lt_or_ge x (-2) with h | h
    · rw [abs_of_neg (by linarith : x - 1 < 0), abs_of_neg (by linarith : x + 2 < 0)]; linarith
    rcases lt_or_ge x 1 with h' | h'
    · rw [abs_of_neg (by linarith : x - 1 < 0), abs_of_nonneg (by linarith : 0 ≤ x + 2)]; linarith
    · rw [abs_of_nonneg (by linarith : 0 ≤ x - 1), abs_of_nonneg (by linarith : 0 ≤ x + 2)]; linarith
  have heq : ∀ x : ℝ, |x - 1| + |x + 2| = 3 ↔ -2 ≤ x ∧ x ≤ 1 := fun x => by
    rcases lt_or_ge x (-2) with h | h
    · rw [abs_of_neg (by linarith : x - 1 < 0), abs_of_neg (by linarith : x + 2 < 0)]
      constructor
      · intro h'; exfalso; linarith
      · intro h'; linarith [h'.1]
    rcases lt_or_ge x 1 with h' | h'
    · rw [abs_of_neg (by linarith : x - 1 < 0), abs_of_nonneg (by linarith : 0 ≤ x + 2)]
      constructor
      · intro _; exact ⟨h, h'.le⟩
      · intro _; ring
    · rw [abs_of_nonneg (by linarith : 0 ≤ x - 1), abs_of_nonneg (by linarith : 0 ≤ x + 2)]
      constructor
      · intro h''; exact ⟨h, by linarith⟩
      · intro h''; linarith [h''.2]
  refine ⟨hmin, heq, ?_, by norm_num, by norm_num, fun x h => by linarith [hmin x]⟩
  have : {x : ℝ | |x - 1| + |x + 2| = 3} = Icc (-2) 1 := by
    ext x; simp only [mem_ofPred_eq, mem_Icc]; exact heq x
  rw [this]; exact Icc_infinite (by norm_num)

/-- Pogoste napake: |x − 1| + |x + 2| ni |2x + 1| (pri x = 0 je leva stran 3, desna 1); za x < 1 je
|x − 1| = −(x − 1) = −x + 1, ne −x − 1; vsota absolutnih vrednosti ni nikoli negativna.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#napake-abs
besedilo: »(višja raven) **Združevanje absolutnih vrednosti.** »$|x - 1| + |x + 2| = |2x + 1|$.« Pri $x = 0$ je leva stran $3$, desna $1$. Vsoto absolutnih vrednosti razstaviš po primerih, ne zložiš v eno absolutno vrednost.« -/
theorem napake_abs :
    |(0:ℝ) - 1| + |(0:ℝ) + 2| = 3 ∧ |2 * (0:ℝ) + 1| = 1 ∧ (∀ x : ℝ, x < 1 → |x - 1| = -x + 1 ∧ |x - 1| ≠ -x - 1) ∧
    ∀ a b : ℝ, 0 ≤ |a| + |b| := by
  refine ⟨by norm_num, by norm_num, fun x hx => ⟨by rw [abs_of_neg (by linarith)]; ring, ?_⟩,
    fun a b => by positivity⟩
  rw [abs_of_neg (by linarith)]; intro h; linarith

/-- Primer 3 (in blok RACUN): |x − 1| + |x + 2| ≤ 5 ⟺ x ∈ [−3, 2]; meji −2x − 1 = 5 ⟺ x = −3 in 2x + 1 = 5 ⟺
x = 2; preizkus f(−3) = 4 + 1 = 5, f(2) = 1 + 4 = 5.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#primer3
besedilo: »Preizkus: $f(-3) = |-3 - 1| + |-3 + 2| = 4 + 1 = 5$ in $f(2) = 1 + 4 = 5$.« -/
theorem primer3 :
    (∀ x : ℝ, |x - 1| + |x + 2| ≤ 5 ↔ -3 ≤ x ∧ x ≤ 2) ∧ (∀ x : ℝ, -2 * x - 1 = 5 ↔ x = -3) ∧
    (∀ x : ℝ, 2 * x + 1 = 5 ↔ x = 2) ∧ |(-3:ℝ) - 1| + |(-3:ℝ) + 2| = 4 + 1 ∧ (4:ℝ) + 1 = 5 ∧
    |(2:ℝ) - 1| + |(2:ℝ) + 2| = 1 + 4 ∧ (1:ℝ) + 4 = 5 := by
  refine ⟨fun x => ?_, fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  rcases lt_or_ge x (-2) with h | h
  · rw [abs_of_neg (by linarith : x - 1 < 0), abs_of_neg (by linarith : x + 2 < 0)]
    constructor
    · intro h'; exact ⟨by linarith, by linarith⟩
    · intro h'; linarith [h'.1]
  rcases lt_or_ge x 1 with h' | h'
  · rw [abs_of_neg (by linarith : x - 1 < 0), abs_of_nonneg (by linarith : 0 ≤ x + 2)]
    constructor
    · intro _; exact ⟨by linarith, by linarith⟩
    · intro _; linarith
  · rw [abs_of_nonneg (by linarith : 0 ≤ x - 1), abs_of_nonneg (by linarith : 0 ≤ x + 2)]
    constructor
    · intro h''; exact ⟨by linarith, by linarith⟩
    · intro h''; linarith [h''.2]

/-! ## |f(x)| in f(|x|) (Razlaga 6) -/

/-- Razlaga 6, Povzetek in Ustno vprašanje 3: |f(x)| = f(x), kjer je f(x) ≥ 0, in −f(x), kjer je f(x) < 0 (graf
ni pod osjo x); f(|x|) = f(x) za x ≥ 0, f(|x|) = f(−x) za x < 0, zato je f(|x|) soda funkcija.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#abs-f-in-f-abs
besedilo: »Za $x < 0$ je $f(|x|) = f(-x)$,« -/
theorem abs_f_in_f_abs (f : ℝ → ℝ) (x : ℝ) :
    (0 ≤ f x → |f x| = f x) ∧ (f x < 0 → |f x| = -f x) ∧ 0 ≤ |f x| ∧ (0 ≤ x → f |x| = f x) ∧
    (x < 0 → f |x| = f (-x)) ∧ f |(-x)| = f |x| := by
  refine ⟨abs_of_nonneg, abs_of_neg, abs_nonneg _, fun h => by rw [abs_of_nonneg h], fun h => by
    rw [abs_of_neg h], by rw [abs_neg]⟩

/-- Razlaga 6 (sliki) in Pogoste napake: za f(x) = x − 2 ima |x − 2| teme (2, 0) (najmanjša vrednost 0 natanko
pri x = 2), |x| − 2 pa teme (0, −2) (najmanjša vrednost −2 natanko pri x = 0, graf je lahko pod osjo x).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#dve-temeni
besedilo: »(višja raven) **Zamenjava $|f(x)|$ in $f(|x|)$.** Učenec pri $y = |x| - 2$ prezrcali del pod osjo $x$ navzgor, kot pri $|x - 2|$. Pri $f(|x|)$ pa se desna polovica prezrcali čez os $y$; graf je lahko tudi pod osjo $x$.« -/
theorem dve_temeni :
    (∀ x : ℝ, 0 ≤ |x - 2| ∧ (|x - 2| = 0 ↔ x = 2)) ∧ (∀ x : ℝ, -2 ≤ |x| - 2 ∧ (|x| - 2 = -2 ↔ x = 0)) ∧
    |(1:ℝ)| - 2 < 0 := by
  refine ⟨fun x => ⟨abs_nonneg _, by rw [abs_eq_zero, sub_eq_zero]⟩,
    fun x => ⟨by linarith [abs_nonneg x], ⟨fun h => abs_eq_zero.mp (by linarith), by rintro rfl; norm_num⟩⟩,
    by norm_num⟩

/-- Razlaga 6, Premisli 2: za f(x) = x² − 4 je f(|x|) = f(x) (soda funkcija, graf se ne spremeni).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#premisli2
besedilo: »Napovej: kako je videti graf $y = f(|x|)$ za $f(x) = x^2 - 4$? Se kaj spremeni?« -/
theorem premisli2 (x : ℝ) : |x| ^ 2 - 4 = x ^ 2 - 4 := by rw [sq_abs]

/-- Razlaga 7: rešitve f(x) = c so abscise presečišč grafa s premico y = c, rešitve f(x) ≤ c pa x, kjer graf leži
pod premico ali na njej.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#enacba-z-grafa
besedilo: »Neenačbo $f(x) \le c$ rešijo tisti $x$, pri katerih graf leži pod premico ali na njej.« -/
theorem enacba_z_grafa (f : ℝ → ℝ) (c : ℝ) :
    {x | f x = c} = Prod.fst '' ({P : ℝ × ℝ | P.2 = f P.1} ∩ {P | P.2 = c}) ∧
    {x | f x ≤ c} = {x | ∃ y, y = f x ∧ y ≤ c} := by
  constructor
  · ext x
    constructor
    · intro h; exact ⟨(x, c), ⟨(h : f x = c).symm, rfl⟩, rfl⟩
    · rintro ⟨⟨u, v⟩, ⟨h1, h2⟩, rfl⟩
      change v = f u at h1
      change v = c at h2
      change f u = c
      rw [← h1, h2]
  · ext x; simp

/-! ## Primer 2 in Primer 4: |x² − 4| -/

/-- Primer 2, koraki 1–3: x² − 4 = 0 ⟺ x = −2 ali x = 2; x² − 4 ≥ 0 natanko za x ≤ −2 ali x ≥ 2 (to je |x| ≥ 2),
tam |x² − 4| = x² − 4; za −2 < x < 2 je x² − 4 < 0 in |x² − 4| = −(x² − 4) = 4 − x².
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#primer2-po-primerih
besedilo: »Za $-2 < x < 2$ je $x^2 - 4 < 0$, zato $f(x) = -(x^2 - 4) = 4 - x^2$.« -/
theorem primer2_po_primerih (x : ℝ) :
    (x ^ 2 - 4 = 0 ↔ x = -2 ∨ x = 2) ∧ (0 ≤ x ^ 2 - 4 ↔ x ≤ -2 ∨ 2 ≤ x) ∧ (x ≤ -2 ∨ 2 ≤ x ↔ 2 ≤ |x|) ∧
    (x ≤ -2 ∨ 2 ≤ x → |x ^ 2 - 4| = x ^ 2 - 4) ∧
    (-2 < x ∧ x < 2 → x ^ 2 - 4 < 0 ∧ |x ^ 2 - 4| = -(x ^ 2 - 4) ∧ -(x ^ 2 - 4) = 4 - x ^ 2) := by
  have hge : 0 ≤ x ^ 2 - 4 ↔ x ≤ -2 ∨ 2 ≤ x := by
    constructor
    · intro h
      rcases le_or_gt x (-2) with h1 | h1
      · exact Or.inl h1
      rcases le_or_gt 2 x with h2 | h2
      · exact Or.inr h2
      nlinarith
    · rintro (h | h)
      · nlinarith [mul_nonneg (by linarith : (0:ℝ) ≤ -2 - x) (by linarith : (0:ℝ) ≤ 2 - x)]
      · nlinarith [mul_nonneg (by linarith : (0:ℝ) ≤ x - 2) (by linarith : (0:ℝ) ≤ x + 2)]
  refine ⟨?_, hge, le_abs'.symm, fun h => abs_of_nonneg (hge.mpr h), fun h => ?_⟩
  · constructor
    · intro h
      have : (x + 2) * (x - 2) = 0 := by ring_nf; linarith
      rcases mul_eq_zero.mp this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num
  · have hp := mul_pos (by linarith [h.1] : (0:ℝ) < x + 2) (by linarith [h.2] : (0:ℝ) < 2 - x)
    exact ⟨by nlinarith, abs_of_neg (by nlinarith), by ring⟩

/-- Primer 2, korak 5 (in blok RACUN): f(0) = 4 − 0 = 4, f(1) = 4 − 1 = 3, f(3) = 9 − 4 = 5; ničli −2 in 2; vrh
prepognjenega dela je (0, 4) (na (−2, 2) je f ≤ 4).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#primer2-vrednosti
besedilo: »Odgovor: $f(x) = x^2 - 4$ za $|x| \ge 2$ (to je $x \le -2$ ali $x \ge 2$), $f(x) = 4 - x^2$ za $|x| < 2$. Ničli: $-2$ in $2$; $f(0) = 4$, $f(1) = 3$, $f(3) = 5$.« -/
theorem primer2_vrednosti :
    |(0:ℝ) ^ 2 - 4| = 4 - 0 ∧ (4:ℝ) - 0 = 4 ∧ |(1:ℝ) ^ 2 - 4| = 4 - 1 ∧ (4:ℝ) - 1 = 3 ∧
    |(3:ℝ) ^ 2 - 4| = 9 - 4 ∧ (9:ℝ) - 4 = 5 ∧ |(-2:ℝ) ^ 2 - 4| = 0 ∧ |(2:ℝ) ^ 2 - 4| = 0 ∧
    ∀ x : ℝ, -2 < x → x < 2 → |x ^ 2 - 4| ≤ 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    fun x h1 h2 => ?_⟩
  have hp := mul_pos (by linarith : (0:ℝ) < x + 2) (by linarith : (0:ℝ) < 2 - x)
  rw [abs_of_neg (by nlinarith)]; nlinarith [sq_nonneg x]

/-- Primer 4 (in blok RACUN): |x² − 4| = 3 ⟺ x² − 4 = 3 ali x² − 4 = −3 ⟺ x ∈ {−√7, −1, 1, √7}; √7 ≈ 2,65.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#primer4
besedilo: »Iz $x^2 - 4 = 3$ sledi $x^2 = 7$, torej $x = -\sqrt{7}$ ali $x = \sqrt{7}$ ($\sqrt{7} \approx 2{,}65$).« -/
theorem primer4 (x : ℝ) :
    (|x ^ 2 - 4| = 3 ↔ x ^ 2 - 4 = 3 ∨ 4 - x ^ 2 = 3) ∧ (x ^ 2 - 4 = 3 ↔ x = -√7 ∨ x = √7) ∧
    (4 - x ^ 2 = 3 ↔ x = -1 ∨ x = 1) ∧
    (|x ^ 2 - 4| = 3 ↔ x = -√7 ∨ x = -1 ∨ x = 1 ∨ x = √7) ∧ |√7 - 2.65| < 0.005 := by
  have h7 : √7 ^ 2 = (7:ℝ) := Real.sq_sqrt (by norm_num)
  have e1 : x ^ 2 - 4 = 3 ↔ x = -√7 ∨ x = √7 := by
    rw [show x ^ 2 - 4 = 3 ↔ x ^ 2 = √7 ^ 2 by rw [h7]; constructor <;> intro h <;> linarith,
      sq_eq_sq_iff_eq_or_eq_neg]; tauto
  have e2 : 4 - x ^ 2 = 3 ↔ x = -1 ∨ x = 1 := by
    rw [show 4 - x ^ 2 = 3 ↔ x ^ 2 = 1 ^ 2 by constructor <;> intro h <;> linarith,
      sq_eq_sq_iff_eq_or_eq_neg]; tauto
  have e0 : |x ^ 2 - 4| = 3 ↔ x ^ 2 - 4 = 3 ∨ 4 - x ^ 2 = 3 := by
    rw [abs_eq (by norm_num)]
    constructor
    · rintro (h | h)
      · exact Or.inl h
      · exact Or.inr (by linarith)
    · rintro (h | h)
      · exact Or.inl h
      · exact Or.inr (by linarith)
  refine ⟨e0, e1, e2, by rw [e0, e1, e2]; tauto, ?_⟩
  have s1 : (2.645 : ℝ) < √7 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : √7 < (2.655 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  rw [abs_lt]; constructor <;> linarith

/-! ## Za maturo -/

/-- Naloga 1 (in blok RACUN): ⌊(x + 1)/2⌋ = −1 ⟺ −1 ≤ (x + 1)/2 < 0 ⟺ −2 ≤ x + 1 < 0 ⟺ −3 ≤ x < −1, torej
x ∈ [−3, −1); posebej (x + 1)/2 ≥ −1 ⟺ x ≥ −3 in (x + 1)/2 < 0 ⟺ x < −1.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga1
besedilo: »Točkovanje:** 1 točka za dvojno neenačbo $-1 \le \dfrac{x + 1}{2} < 0$, 1 točka za $-3 \le x < -1$, 1 točka za interval $[-3, -1)$ s pravilnima krajiščema.« -/
theorem naloga1 (x : ℝ) :
    (⌊(x + 1) / 2⌋ = -1 ↔ -1 ≤ (x + 1) / 2 ∧ (x + 1) / 2 < 0) ∧
    (-1 ≤ (x + 1) / 2 ∧ (x + 1) / 2 < 0 ↔ -2 ≤ x + 1 ∧ x + 1 < 0) ∧
    (-2 ≤ x + 1 ∧ x + 1 < 0 ↔ -3 ≤ x ∧ x < -1) ∧ (⌊(x + 1) / 2⌋ = -1 ↔ x ∈ Ico (-3) (-1)) ∧
    ((x + 1) / 2 ≥ -1 ↔ -3 ≤ x) ∧ ((x + 1) / 2 < 0 ↔ x < -1) := by
  have e1 : ⌊(x + 1) / 2⌋ = -1 ↔ -1 ≤ (x + 1) / 2 ∧ (x + 1) / 2 < 0 := by
    rw [Int.floor_eq_iff]; push_cast; norm_num
  have e2 : -1 ≤ (x + 1) / 2 ∧ (x + 1) / 2 < 0 ↔ -2 ≤ x + 1 ∧ x + 1 < 0 := by
    constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith
  have e3 : -2 ≤ x + 1 ∧ x + 1 < 0 ↔ -3 ≤ x ∧ x < -1 := by
    constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith
  exact ⟨e1, e2, e3, by rw [e1, e2, e3, mem_Ico], ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Naloga 1, korak 3 (in blok RACUN): pri x = −3 je ⌊−1⌋ = −1 (−3 je rešitev), pri x = −1 je ⌊0⌋ = 0 (−1 ni).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga1-krajisci
besedilo: »Preizkus krajišč: pri $x = -3$ je $\left\lfloor -1 \right\rfloor = -1$, pri $x = -1$ pa $\left\lfloor 0 \right\rfloor = 0$, zato $-3$ spada k rešitvam, $-1$ pa ne.« -/
theorem naloga1_krajisci : ⌊((-3:ℝ) + 1) / 2⌋ = -1 ∧ ⌊((-1:ℝ) + 1) / 2⌋ = 0 := by
  constructor <;> rw [Int.floor_eq_iff] <;> norm_num

/-- Naloga 2: cena vožnje s skirojem za s minut, 1 € + 0,50 € za vsakih začetih 10 minut: K(s) = 1 + 0,5·⌈s/10⌉.
-/
noncomputable def K (s : ℝ) : ℝ := 1 + 0.5 * (⌈s / 10⌉ : ℝ)

/-- Sošolčev predpis iz Naloge 2 c): 1 + 0,5·(⌊s/10⌋ + 1). -/
noncomputable def S (s : ℝ) : ℝ := 1 + 0.5 * ((⌊s / 10⌋ : ℝ) + 1)

/-- Naloga 2 a) (in blok RACUN): K(10) = 1 + 0,5 = 1,50 € in K(25) = 1 + 3·0,5 = 2,50 € (začeti trije intervali).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga2-a
besedilo: »a) Pri $25$ minutah so začeti trije intervali (od $0$ do $10$, od $10$ do $20$ in od $20$ do $25$ minut): $K(25) = 1 + 3 \cdot 0{,}5 = 2{,}50\,\text{€}$.« -/
theorem naloga2_a : K 10 = 1 + 0.5 ∧ (1:ℝ) + 0.5 = 1.5 ∧ K 25 = 1 + 3 * 0.5 ∧ (1:ℝ) + 3 * 0.5 = 2.5 ∧
    ⌈(25:ℝ) / 10⌉ = 3 := by
  have h10 : ⌈(10:ℝ) / 10⌉ = 1 := Int.ceil_eq_iff.mpr (by norm_num)
  have h25 : ⌈(25:ℝ) / 10⌉ = 3 := Int.ceil_eq_iff.mpr (by norm_num)
  refine ⟨by rw [K, h10]; norm_num, by norm_num, by rw [K, h25]; norm_num, by norm_num, h25⟩

/-- Naloga 2 b): K(s) = 1,50 € za 0 < s ≤ 10, 2 € za 10 < s ≤ 20, 2,50 € za 20 < s ≤ 30 in 3 € za 30 < s ≤ 40
(desno krajišče pripada stopnici).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga2-b
besedilo: »b) $K(s) = 1{,}50\,\text{€}$ za $0 < s \le 10$, $K(s) = 2\,\text{€}$ za $10 < s \le 20$, $K(s) = 2{,}50\,\text{€}$ za $20 < s \le 30$ in $K(s) = 3\,\text{€}$ za $30 < s \le 40$.« -/
theorem naloga2_b (s : ℝ) :
    (0 < s ∧ s ≤ 10 → K s = 1.5) ∧ (10 < s ∧ s ≤ 20 → K s = 2) ∧ (20 < s ∧ s ≤ 30 → K s = 2.5) ∧
    (30 < s ∧ s ≤ 40 → K s = 3) := by
  refine ⟨fun h => ?_, fun h => ?_, fun h => ?_, fun h => ?_⟩
  · rw [K, ceil_na (s / 10) 1 (by push_cast; linarith [h.1]) (by push_cast; linarith [h.2])]; norm_num
  · rw [K, ceil_na (s / 10) 2 (by push_cast; linarith [h.1]) (by push_cast; linarith [h.2])]; norm_num
  · rw [K, ceil_na (s / 10) 3 (by push_cast; linarith [h.1]) (by push_cast; linarith [h.2])]; norm_num
  · rw [K, ceil_na (s / 10) 4 (by push_cast; linarith [h.1]) (by push_cast; linarith [h.2])]; norm_num

/-- Naloga 2 c), koraka 5 in 6 (in blok RACUN): sošolčev predpis da pri s = 25 ⌊2,5⌋ = 2 in 1 + 0,5·3 = 2,50 €
(prav), pri s = 10 ⌊1⌋ = 1 in 1 + 0,5·2 = 2 € (narobe, prava cena je 1,50 €).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga2-c-primera
besedilo: »c) Pri $s = 25$: $\left\lfloor 2{,}5 \right\rfloor = 2$ in $1 + 0{,}5 \cdot 3 = 2{,}50\,\text{€}$, kar je prava cena.« -/
theorem naloga2_c_primera :
    ⌊(25:ℝ) / 10⌋ = 2 ∧ S 25 = 1 + 0.5 * 3 ∧ (1:ℝ) + 0.5 * 3 = 2.5 ∧ S 25 = K 25 ∧
    ⌊(10:ℝ) / 10⌋ = 1 ∧ S 10 = 1 + 0.5 * 2 ∧ (1:ℝ) + 0.5 * 2 = 2 ∧ K 10 = 1.5 := by
  have f25 : ⌊(25:ℝ) / 10⌋ = 2 := by rw [Int.floor_eq_iff]; norm_num
  have f10 : ⌊(10:ℝ) / 10⌋ = 1 := by rw [Int.floor_eq_iff]; norm_num
  have c25 : ⌈(25:ℝ) / 10⌉ = 3 := Int.ceil_eq_iff.mpr (by norm_num)
  have c10 : ⌈(10:ℝ) / 10⌉ = 1 := Int.ceil_eq_iff.mpr (by norm_num)
  refine ⟨f25, by rw [S, f25]; norm_num, by norm_num, by rw [S, K, f25, c25]; norm_num, f10,
    by rw [S, f10]; norm_num, by norm_num, by rw [K, c10]; norm_num⟩

/-- Naloga 2 c), korak 7: za 0 < s ≤ 40 da sošolčev predpis napačno ceno natanko pri s ∈ {10, 20, 30, 40}
(večkratniki 10), tam je 0,50 € previsoka.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga2-c
besedilo: »Predpis je napačen za $s = 10$, $20$, $30$ in $40$, kjer da $0{,}50\,\text{€}$ previsoko ceno.« -/
theorem naloga2_c (s : ℝ) (h0 : 0 < s) (h1 : s ≤ 40) :
    (S s ≠ K s ↔ s = 10 ∨ s = 20 ∨ s = 30 ∨ s = 40) ∧
    (s = 10 ∨ s = 20 ∨ s = 30 ∨ s = 40 → S s = K s + 0.5) := by
  have key : S s = K s ↔ ⌈s / 10⌉ = ⌊s / 10⌋ + 1 := by
    rw [S, K]
    constructor
    · intro h
      have : ((⌈s / 10⌉ : ℤ) : ℝ) = ((⌊s / 10⌋ + 1 : ℤ) : ℝ) := by push_cast; linarith
      exact_mod_cast this
    · intro h; rw [h]; push_cast; ring
  have mult : (s / 10 ∈ range (Int.cast : ℤ → ℝ)) ↔ s = 10 ∨ s = 20 ∨ s = 30 ∨ s = 40 := by
    constructor
    · rintro ⟨n, hn⟩
      have hs : s = 10 * (n : ℝ) := by rw [hn]; ring
      have a : (0:ℝ) < n := by linarith
      have b : (n:ℝ) ≤ 4 := by linarith
      have a' : 0 < n := by exact_mod_cast a
      have b' : n ≤ 4 := by exact_mod_cast b
      interval_cases n <;> (push_cast at hs; rw [hs]; norm_num)
    · rintro (rfl | rfl | rfl | rfl)
      · exact ⟨1, by norm_num⟩
      · exact ⟨2, by norm_num⟩
      · exact ⟨3, by norm_num⟩
      · exact ⟨4, by norm_num⟩
  constructor
  · rw [Ne, key, Int.ceil_eq_floor_add_one_iff_notMem, not_not, mult]
  · intro h
    obtain ⟨n, hn⟩ := mult.mpr h
    rw [S, K, ← hn, Int.floor_intCast, Int.ceil_intCast]; ring

/-- Predpostavke `naloga2_c` se dajo izpolniti (s = 10). -/
example : (0:ℝ) < 10 ∧ (10:ℝ) ≤ 40 := by norm_num

/-- Naloga 3 a) (in blok RACUN): f(x) = |x + 1| − |x − 3| po primerih: za x < −1 je (−x − 1) − (−x + 3) = −4, za
−1 ≤ x < 3 je (x + 1) − (−x + 3) = 2x − 2, za x ≥ 3 je (x + 1) − (x − 3) = 4.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga3-a
besedilo: »a) Za $-1 \le x < 3$ je $|x + 1| = x + 1$ in $|x - 3| = -x + 3$, zato $f(x) = (x + 1) - (-x + 3) = 2x - 2$.« -/
theorem naloga3_a (x : ℝ) :
    (x < -1 → |x + 1| = -x - 1 ∧ |x - 3| = -x + 3 ∧ (-x - 1) - (-x + 3) = -4) ∧
    (-1 ≤ x ∧ x < 3 → |x + 1| = x + 1 ∧ |x - 3| = -x + 3 ∧ (x + 1) - (-x + 3) = 2 * x - 2) ∧
    (3 ≤ x → |x + 1| = x + 1 ∧ |x - 3| = x - 3 ∧ (x + 1) - (x - 3) = 4) := by
  refine ⟨fun h => ⟨?_, ?_, by ring⟩, fun h => ⟨?_, ?_, by ring⟩, fun h => ⟨?_, ?_, by ring⟩⟩
  · rw [abs_of_neg (by linarith)]; ring
  · rw [abs_of_neg (by linarith)]; ring
  · rw [abs_of_nonneg (by linarith [h.1])]
  · rw [abs_of_neg (by linarith [h.2])]; ring
  · rw [abs_of_nonneg (by linarith)]
  · rw [abs_of_nonneg (by linarith)]

/-- Pomožna trditev: vrednost f(x) = |x + 1| − |x − 3| na treh intervalih.
pomozno -/
theorem f3 (x : ℝ) :
    (x < -1 → |x + 1| - |x - 3| = -4) ∧ (-1 ≤ x → x < 3 → |x + 1| - |x - 3| = 2 * x - 2) ∧
    (3 ≤ x → |x + 1| - |x - 3| = 4) := by
  obtain ⟨a, b, c⟩ := naloga3_a x
  refine ⟨fun h => ?_, fun h h' => ?_, fun h => ?_⟩
  · obtain ⟨a1, a2, a3⟩ := a h; rw [a1, a2, a3]
  · obtain ⟨b1, b2, b3⟩ := b ⟨h, h'⟩; rw [b1, b2, b3]
  · obtain ⟨c1, c2, c3⟩ := c h; rw [c1, c2, c3]

/-- Naloga 3 b), c) (in blok RACUN): ničla f je le x = 1 (2x − 2 = 0), Z_f = [−4, 4]; f(x) > 2 ⟺ x > 2 (na srednjem
intervalu 2x − 2 > 2 ⟺ x > 2, desno je f = 4 > 2, levo f = −4).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga3-bc
besedilo: »Odgovor: $f(x) = -4$ za $x < -1$, $f(x) = 2x - 2$ za $-1 \le x < 3$, $f(x) = 4$ za $x \ge 3$; ničla $1$, $Z_f = [-4, 4]$; $f(x) > 2$ za $x \in (2, \infty)$; $|f(x)| = 2$ za $x = 0$ in $x = 2$; $|f(x)| = 4$ ima neskončno rešitev ($x \le -1$ ali $x \ge 3$).« -/
theorem naloga3_bc :
    (∀ x : ℝ, |x + 1| - |x - 3| = 0 ↔ x = 1) ∧ range (fun x : ℝ => |x + 1| - |x - 3|) = Icc (-4) 4 ∧
    (∀ x : ℝ, 2 * x - 2 > 2 ↔ x > 2) ∧ (∀ x : ℝ, |x + 1| - |x - 3| > 2 ↔ x ∈ Ioi 2) := by
  refine ⟨fun x => ?_, ?_, fun x => ⟨fun h => by linarith, fun h => by linarith⟩, fun x => ?_⟩
  · obtain ⟨a, b, c⟩ := f3 x
    rcases lt_or_ge x (-1) with h | h
    · rw [a h]; constructor <;> intro h' <;> linarith
    rcases lt_or_ge x 3 with h' | h'
    · rw [b h h']; constructor <;> intro h'' <;> linarith
    · rw [c h']; constructor <;> intro h'' <;> linarith
  · ext y
    simp only [mem_range, mem_Icc]
    constructor
    · rintro ⟨x, rfl⟩
      obtain ⟨a, b, c⟩ := f3 x
      rcases lt_or_ge x (-1) with h | h
      · rw [a h]; norm_num
      rcases lt_or_ge x 3 with h' | h'
      · rw [b h h']; constructor <;> linarith
      · rw [c h']; norm_num
    · rintro ⟨h1, h2⟩
      rcases lt_or_ge y 4 with h | h
      · refine ⟨(y + 2) / 2, ?_⟩
        rw [(f3 ((y + 2) / 2)).2.1 (by linarith) (by linarith)]; ring
      · refine ⟨3, ?_⟩
        rw [(f3 3).2.2 le_rfl]; linarith
  · obtain ⟨a, b, c⟩ := f3 x
    rw [mem_Ioi]
    rcases lt_or_ge x (-1) with h | h
    · rw [a h]; constructor <;> intro h' <;> linarith
    rcases lt_or_ge x 3 with h' | h'
    · rw [b h h']; constructor <;> intro h'' <;> linarith
    · rw [c h']; constructor <;> intro h'' <;> linarith

/-- Naloga 3 d): |f(x)| = 4 za x < −1, 2 − 2x za −1 ≤ x < 1, 2x − 2 za 1 ≤ x < 3 in 4 za x ≥ 3; |f(x)| = 2 ⟺
x = 0 ali x = 2; za −1 < x < 3 je |2x − 2| < 4, |f(x)| = 4 ⟺ x ≤ −1 ali x ≥ 3, rešitev je neskončno mnogo.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#naloga3-d
besedilo: »d) Za $-1 < x < 3$ je $|2x - 2| < 4$, za vse $x \le -1$ in vse $x \ge 3$ pa je $|f(x)| = 4$. Enačba $|f(x)| = 4$ ima neskončno mnogo rešitev.« -/
theorem naloga3_d :
    (∀ x : ℝ, (x < -1 → |(|x + 1| - |x - 3|)| = 4) ∧ (-1 ≤ x → x < 1 → |(|x + 1| - |x - 3|)| = 2 - 2 * x) ∧
      (1 ≤ x → x < 3 → |(|x + 1| - |x - 3|)| = 2 * x - 2) ∧ (3 ≤ x → |(|x + 1| - |x - 3|)| = 4)) ∧
    (∀ x : ℝ, |(|x + 1| - |x - 3|)| = 2 ↔ x = 0 ∨ x = 2) ∧
    (∀ x : ℝ, -1 < x → x < 3 → |2 * x - 2| < 4) ∧
    (∀ x : ℝ, |(|x + 1| - |x - 3|)| = 4 ↔ x ≤ -1 ∨ 3 ≤ x) ∧
    {x : ℝ | |(|x + 1| - |x - 3|)| = 4}.Infinite := by
  have pp : ∀ x : ℝ, (x < -1 → |(|x + 1| - |x - 3|)| = 4) ∧
      (-1 ≤ x → x < 1 → |(|x + 1| - |x - 3|)| = 2 - 2 * x) ∧
      (1 ≤ x → x < 3 → |(|x + 1| - |x - 3|)| = 2 * x - 2) ∧ (3 ≤ x → |(|x + 1| - |x - 3|)| = 4) := by
    intro x
    obtain ⟨a, b, c⟩ := f3 x
    refine ⟨fun h => by rw [a h]; norm_num, fun h h' => ?_, fun h h' => ?_, fun h => by rw [c h]; norm_num⟩
    · rw [b h (by linarith), abs_of_neg (by linarith)]; ring
    · rw [b (by linarith) h', abs_of_nonneg (by linarith)]
  have e4 : ∀ x : ℝ, |(|x + 1| - |x - 3|)| = 4 ↔ x ≤ -1 ∨ 3 ≤ x := by
    intro x
    obtain ⟨a, b, c, d⟩ := pp x
    rcases lt_or_ge x (-1) with h | h
    · rw [a h]; exact ⟨fun _ => Or.inl h.le, fun _ => rfl⟩
    rcases lt_or_ge x 1 with h' | h'
    · rw [b h h']; constructor
      · intro h''; left; linarith
      · rintro (h'' | h'') <;> linarith
    rcases lt_or_ge x 3 with h'' | h''
    · rw [c h' h'']; constructor
      · intro h3; right; linarith
      · rintro (h3 | h3) <;> linarith
    · rw [d h'']; exact ⟨fun _ => Or.inr h'', fun _ => rfl⟩
  refine ⟨pp, fun x => ?_, fun x h1 h2 => by rw [abs_lt]; constructor <;> linarith, e4, ?_⟩
  · obtain ⟨a, b, c, d⟩ := pp x
    rcases lt_or_ge x (-1) with h | h
    · rw [a h]
      constructor
      · intro h'; norm_num at h'
      · rintro (h' | h') <;> linarith
    rcases lt_or_ge x 1 with h' | h'
    · rw [b h h']; constructor
      · intro h''; left; linarith
      · rintro (h'' | h'') <;> linarith
    rcases lt_or_ge x 3 with h'' | h''
    · rw [c h' h'']; constructor
      · intro h3; right; linarith
      · rintro (h3 | h3) <;> linarith
    · rw [d h'']
      constructor
      · intro h3; norm_num at h3
      · rintro (h3 | h3) <;> linarith
  · exact (Ici_infinite 3).mono fun x hx => by
      simp only [mem_ofPred_eq]; rw [e4]; exact Or.inr hx

/-! ## Drugače in Preveri se -/

/-- Drugače: Iz vsakdanjega življenja: kilogramske vrečke moke ⌈2,2⌉ = 3 in ⌈2⌉ = 2; polni pladnji ⌊35/12⌋ = 2;
termostat miruje, dokler je |T − 180| ≤ 5, torej natanko za 175 ≤ T ≤ 185.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#vsakdan
besedilo: »Termostat miruje, dokler je $|T - 180| \le 5$, torej od $175$ do $185\,{}^\circ\mathrm{C}$.« -/
theorem vsakdan :
    ⌈(2.2:ℝ)⌉ = 3 ∧ ⌈(2:ℝ)⌉ = 2 ∧ ⌊(35:ℝ) / 12⌋ = 2 ∧ ∀ T : ℝ, |T - 180| ≤ 5 ↔ 175 ≤ T ∧ T ≤ 185 := by
  refine ⟨Int.ceil_eq_iff.mpr (by norm_num), Int.ceil_eq_iff.mpr (by norm_num), by rw [Int.floor_eq_iff]; norm_num,
    fun T => ?_⟩
  rw [abs_le]; constructor <;> rintro ⟨h1, h2⟩ <;> constructor <;> linarith

/-- Preveri se 2: cenik paketov s slike (polna pika desno): 3 € za 0 < m ≤ 2, 4 € za 2 < m ≤ 5, 6 € za 5 < m ≤ 10. -/
noncomputable def cena_paketa (m : ℝ) : ℝ := if m ≤ 2 then 3 else if m ≤ 5 then 4 else 6

/-- Preveri se 2: paketa z 2 kg in 5,2 kg staneta 3 + 6 = 9 €; napačna branja dajo 4 + 6 = 10, 3 + 4 = 7, 4 + 4 = 8.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#kviz2
besedilo: »Pri $m = 2$ je polna pika na stopnici $3\,\text{€}$. Masa $5{,}2\,\mathrm{kg}$ leži nad stopnico $6\,\text{€}$. Skupaj $3 + 6 = 9\,\text{€}$.« -/
theorem kviz2 : cena_paketa 2 = 3 ∧ cena_paketa 5.2 = 6 ∧ cena_paketa 2 + cena_paketa 5.2 = 9 ∧
    (4:ℝ) + 6 = 10 ∧ (3:ℝ) + 4 = 7 ∧ (4:ℝ) + 4 = 8 := by
  have a : cena_paketa 2 = 3 := by rw [cena_paketa]; norm_num
  have b : cena_paketa 5.2 = 6 := by rw [cena_paketa]; norm_num
  refine ⟨a, b, by rw [a, b]; norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 3: za f(x) = |x − 3| + |x| je za x < 0 f(x) = −2x + 3 (Nejčev −2x − 3 je napačen: pri x = −1 da −1,
prava vrednost je 5); za 0 ≤ x < 3 je f(x) = 3, za x ≥ 3 je f(x) = 2x − 3.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#kviz3
besedilo: »Za $x < 0$ je $|x - 3| = -(x - 3) = -x + 3$, zato $f(x) = -2x + 3$. Nejčev predpis da pri $x = -1$ negativno vrednost $-1$, prava je $5$.« -/
theorem kviz3 :
    (∀ x : ℝ, x < 0 → |x - 3| + |x| = -2 * x + 3) ∧ (∀ x : ℝ, 0 ≤ x → x < 3 → |x - 3| + |x| = 3) ∧
    (∀ x : ℝ, 3 ≤ x → |x - 3| + |x| = 2 * x - 3) ∧ -2 * (-1:ℝ) - 3 = -1 ∧ |(-1:ℝ) - 3| + |(-1:ℝ)| = 5 := by
  refine ⟨fun x h => ?_, fun x h h' => ?_, fun x h => ?_, by norm_num, by norm_num⟩
  · rw [abs_of_neg (by linarith), abs_of_neg h]; ring
  · rw [abs_of_neg (by linarith), abs_of_nonneg h]; ring
  · rw [abs_of_nonneg (by linarith), abs_of_nonneg (by linarith)]; ring

/-- Preveri se 4: za f(x) = 2x − 4 je g(x) = |2x − 4| in h(x) = f(|x|) = 2|x| − 4; g(0) = 4, h(0) = −4; ujemata se
natanko za x ≥ 2; g ima najmanjšo vrednost 0 natanko pri x = 2, h najmanjšo vrednost −4 natanko pri x = 0.
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#kviz4
besedilo: »$g$ ima najmanjšo vrednost $0$ pri $x = 2$, $h$ pa najmanjšo vrednost $-4$ pri $x = 0$.« -/
theorem kviz4 :
    |2 * (0:ℝ) - 4| = 4 ∧ 2 * |(0:ℝ)| - 4 = -4 ∧ (∀ x : ℝ, |2 * x - 4| = 2 * |x| - 4 ↔ 2 ≤ x) ∧
    (∀ x : ℝ, 0 ≤ |2 * x - 4| ∧ (|2 * x - 4| = 0 ↔ x = 2)) ∧
    (∀ x : ℝ, -4 ≤ 2 * |x| - 4 ∧ (2 * |x| - 4 = -4 ↔ x = 0)) := by
  refine ⟨by norm_num, by norm_num, fun x => ?_, fun x => ⟨abs_nonneg _, ?_⟩, fun x => ⟨by linarith [abs_nonneg x],
    ?_⟩⟩
  · rcases lt_or_ge x 0 with h | h
    · rw [abs_of_neg (by linarith), abs_of_neg h]; constructor <;> intro h' <;> linarith
    rcases lt_or_ge x 2 with h' | h'
    · rw [abs_of_neg (by linarith), abs_of_nonneg h]; constructor <;> intro h'' <;> linarith
    · rw [abs_of_nonneg (by linarith), abs_of_nonneg h]; exact ⟨fun _ => h', fun _ => rfl⟩
  · rw [abs_eq_zero]; constructor <;> intro h <;> linarith
  · constructor
    · intro h; have : |x| = 0 := by linarith
      exact abs_eq_zero.mp this
    · rintro rfl; norm_num

/-- Preveri se 5 (in blok RACUN): ⌊−3,7⌋ + ⌊3,7⌋ = −4 + 3 = −1 (odrezane decimalke ali zaokroževanje bi dalo
−3 + 3 = 0 oz. −4 + 4 = 0, zaokroževanje navzgor −3 + 4 = 1).
trditev: MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije#kviz5
besedilo: »0 | Odrezal si decimalke ($-3 + 3$) ali zaokrožil na najbližje celo število ($-4 + 4$). Celi del vedno zaokroži navzdol: $\lfloor -3{,}7 \rfloor = -4$, ker je $-3$ večje od $-3{,}7$.« -/
theorem kviz5 : ⌊(-3.7:ℝ)⌋ = -4 ∧ ⌊(3.7:ℝ)⌋ = 3 ∧ ⌊(-3.7:ℝ)⌋ + ⌊(3.7:ℝ)⌋ = -1 ∧
    (-3:ℤ) + 3 = 0 ∧ (-4:ℤ) + 4 = 0 ∧ (-3:ℤ) + 4 = 1 := by
  have a : ⌊(-3.7:ℝ)⌋ = -4 := by rw [Int.floor_eq_iff]; norm_num
  have b : ⌊(3.7:ℝ)⌋ = 3 := by rw [Int.floor_eq_iff]; norm_num
  refine ⟨a, b, by rw [a, b]; norm_num, by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_SS_2.GrafiZAbsolutnoVrednostjoInStopnicasteFunkcije
