/-
vir: content/lessons/MAT-SS-4/matematicna-indukcija.md
sha256: 1f725cb7fd640f814b7481dc95b5114342591176da6f1f6ca19d5ebbbe900bdc
Ni v Leanu: zgodovina (Maurolico, Pascal); simulaciji (domine, Hanojski stolpi); analogija s plezalno
  steno; to, da je Hₙ res NAJMANJŠE število potez pri Hanojskih stolpih (lekcija ga podaja z zvezo
  H₁ = 1, Hₙ₊₁ = 2Hₙ + 1, dokazano je, kar iz te zveze sledi); razlage o pravilnem zapisu dokaza
  (»korak gre od P(n) k P(n + 1)«, »predpostavko res uporabi«) so navodila, ne matematične trditve —
  dokazan je primer, da iz neresnične trditve sledi resnična (1 = −1 ⇒ 1 = 1); »sto naključnih primerov
  ni dokaz« je dokazan s protiprimerom n² + n + 41; točkovanje.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.MatematicnaIndukcija

open Finset Filter Topology

/-! ## Razlaga -/

/-- Uvod in razlaga: 1 + 3 + 5 + … + (2n − 1) = n² za vsak n (P(n)); n-to liho število je 2n − 1.
trditev: MAT-SS-4/matematicna-indukcija#liha-vsota
besedilo: »$$P(n):\quad 1 + 3 + 5 + \dots + (2n - 1) = n^2$$« -/
theorem liha_vsota (n : ℕ) : ∑ k ∈ range n, (2 * k + 1) = n ^ 2 := by
  induction n with
  | zero => simp
  | succ n ih => rw [sum_range_succ, ih]; ring

/-- Razlaga: začetna primera: n = 1 da 1 = 1², n = 4 da 1 + 3 + 5 + 7 = 16 = 4².
trditev: MAT-SS-4/matematicna-indukcija#liha-primeri
besedilo: »Za $n = 1$: leva stran je $1$, desna $1^2 = 1$. Za $n = 4$: $1 + 3 + 5 + 7 = 16 = 4^2$. Trditev velja za začetne primere.« -/
theorem liha_primeri : 1 = 1 ^ 2 ∧ 1 + 3 + 5 + 7 = 16 ∧ 16 = 4 ^ 2 := by norm_num

/-- Razlaga, korak: naslednje liho število je 2(n + 1) − 1 = 2n + 1 in n² + 2n + 1 = (n + 1)²;
stožci: kvadrat n × n dopolni pas n + n + 1 = 2n + 1 stožcev.
trditev: MAT-SS-4/matematicna-indukcija#liha-korak
besedilo: »Naslednje liho število je $2(n + 1) - 1 = 2n + 1$.« -/
theorem liha_korak (n : ℤ) :
    2 * (n + 1) - 1 = 2 * n + 1 ∧ n ^ 2 + (2 * n + 1) = n ^ 2 + 2 * n + 1 ∧
    n ^ 2 + 2 * n + 1 = (n + 1) ^ 2 ∧ n + n + 1 = 2 * n + 1 := by
  refine ⟨by ring, by ring, by ring, by ring⟩

/-- Bolj natančno: načelo matematične indukcije, dokazano kot v lekciji z najmanjšim protiprimerom
m: P(1) velja, zato je m > 1, P(m − 1) velja, po koraku tudi P(m), protislovje.
trditev: MAT-SS-4/matematicna-indukcija#nacelo
besedilo: »Ker $P(1)$ velja, je $m > 1$, zato je $m - 1$ naravno število in $P(m - 1)$ velja, ker je $m$ najmanjši protiprimer.« -/
theorem nacelo (P : ℕ → Prop) (h1 : P 1) (hk : ∀ n, 1 ≤ n → P n → P (n + 1)) :
    ∀ n, 1 ≤ n → P n := by
  by_contra hc
  push Not at hc
  classical
  let m := Nat.find hc
  have hm : 1 ≤ m ∧ ¬ P m := Nat.find_spec hc
  have hmin : ∀ k < m, ¬ (1 ≤ k ∧ ¬ P k) := fun k hk => Nat.find_min hc hk
  have hm1 : m ≠ 1 := fun h => hm.2 (h ▸ h1)
  have hprev : P (m - 1) := by
    by_contra hp
    exact hmin (m - 1) (by omega) ⟨by omega, hp⟩
  have := hk (m - 1) (by omega) hprev
  rw [show m - 1 + 1 = m by omega] at this
  exact hm.2 this

/-- Bolj natančno, različice: indukcija z bazo pri n₀ (P(n₀) in korak za n ≥ n₀ ⇒ P(n) za vse n ≥ n₀).
trditev: MAT-SS-4/matematicna-indukcija#nacelo-n0
besedilo: »Različice.** Baza je lahko pri $n_0$ namesto pri $1$; dokaz velja za $n \ge n_0$. Pri **krepki indukciji** v koraku predpostavimo, da $P(k)$ velja za vse $k$ od $n_0$ do $n$, ne le za $n$; to je priročno, ko je izraz za $n + 1$ odvisen od več prejšnjih.« -/
theorem nacelo_n0 (P : ℕ → Prop) (n₀ : ℕ) (h0 : P n₀) (hk : ∀ n, n₀ ≤ n → P n → P (n + 1)) :
    ∀ n, n₀ ≤ n → P n := fun n hn => Nat.le_induction h0 hk n hn

/-- Bolj natančno, krepka indukcija: če iz P(k) za vse k od n₀ do n sledi P(n + 1) in velja P(n₀),
velja P(n) za vse n ≥ n₀.
trditev: MAT-SS-4/matematicna-indukcija#krepka
besedilo: »Pri **krepki indukciji** v koraku predpostavimo, da $P(k)$ velja za vse $k$ od $n_0$ do $n$, ne le za $n$; to je priročno, ko je izraz za $n + 1$ odvisen od več prejšnjih.« -/
theorem krepka (P : ℕ → Prop) (n₀ : ℕ) (h0 : P n₀)
    (hk : ∀ n, n₀ ≤ n → (∀ k, n₀ ≤ k → k ≤ n → P k) → P (n + 1)) : ∀ n, n₀ ≤ n → P n := by
  have : ∀ n, n₀ ≤ n → ∀ k, n₀ ≤ k → k ≤ n → P k := by
    intro n hn
    induction n, hn using Nat.le_induction with
    | base => intro k hk1 hk2; rwa [show k = n₀ by omega]
    | succ n hn ih =>
      intro k hk1 hk2
      rcases Nat.lt_or_ge k (n + 1) with h | h
      · exact ih k hk1 (by omega)
      · rw [show k = n + 1 by omega]; exact hk n hn ih
  exact fun n hn => this n hn n hn le_rfl

/-- Predpostavke trditve `krepka` se dajo izpolniti (P(n) := 1 ≤ n, n₀ = 1). -/
example : (fun n : ℕ => 1 ≤ n) 1 ∧
    ∀ n, 1 ≤ n → (∀ k, 1 ≤ k → k ≤ n → (fun n : ℕ => 1 ≤ n) k) → (fun n : ℕ => 1 ≤ n) (n + 1) :=
  ⟨le_rfl, fun n _ _ => by show 1 ≤ n + 1; omega⟩

/-- Predpostavke trditve `krepka` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (fun n : ℕ => 1 ≤ n) 1 ∧ ∀ n, 1 ≤ n → (∀ k, 1 ≤ k → k ≤ n → (fun n : ℕ => 1 ≤ n) k) → (fun n : ℕ => 1 ≤ n) (n + 1) :=
    ⟨le_rfl, fun n _ _ => by show 1 ≤ n + 1; omega⟩
  krepka (h0 := w.1) (hk := w.2)

/-- Primeri za načela (predpostavke so izpolnljive): P(n) := 1 ≤ n. Trditve: `nacelo` in `nacelo_n0` (n₀ = 1). -/
example : (fun n : ℕ => 1 ≤ n) 1 ∧ ∀ n, 1 ≤ n → (fun n : ℕ => 1 ≤ n) n → (fun n : ℕ => 1 ≤ n) (n + 1) :=
  ⟨le_rfl, fun n _ h => by simp only at h ⊢; omega⟩

/-- Predpostavke trditve `nacelo_n0` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (fun n : ℕ => 1 ≤ n) 1 ∧ ∀ n, 1 ≤ n → (fun n : ℕ => 1 ≤ n) n → (fun n : ℕ => 1 ≤ n) (n + 1) :=
    ⟨le_rfl, fun n _ h => by simp only at h ⊢; omega⟩
  nacelo_n0 (h0 := w.1) (hk := w.2)

/-- Predpostavke trditve `nacelo` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (fun n : ℕ => 1 ≤ n) 1 ∧ ∀ n, 1 ≤ n → (fun n : ℕ => 1 ≤ n) n → (fun n : ℕ => 1 ≤ n) (n + 1) :=
    ⟨le_rfl, fun n _ h => by simp only at h ⊢; omega⟩
  nacelo (h1 := w.1) (hk := w.2)

/-- Razlaga, »Premisli« in pogoste napake: za »2n + 1 je deljivo z 2« korak velja (2n + 1 deljivo z 2 ⇒
2(n + 1) + 1 = (2n + 1) + 2 deljivo z 2), baza ne (3 ni sodo), trditev ne velja za noben n.
trditev: MAT-SS-4/matematicna-indukcija#brez-baze
besedilo: »Ne vemo, ali katera domina sploh pade. Korak pove le, da padec ene povzroči padec naslednje. Trditev »$2n + 1$ je deljivo z $2$« ima pravilen korak ($2(n + 1) + 1$ je za $2$ večje od $2n + 1$), baza pa ne drži: $3$ ni sodo. Trditev ne velja za noben $n$.« -/
theorem brez_baze :
    (∀ n : ℕ, 2 ∣ 2 * n + 1 → 2 ∣ 2 * (n + 1) + 1) ∧ ¬ 2 ∣ 2 * 1 + 1 ∧ ∀ n : ℕ, ¬ 2 ∣ 2 * n + 1 := by
  refine ⟨fun n h => ?_, by decide, fun n => by omega⟩
  rw [show 2 * (n + 1) + 1 = (2 * n + 1) + 2 by ring]
  exact dvd_add h (dvd_refl 2)

/-- Razlaga, »Premisli«: iz neresnične trditve 1 = −1 s kvadriranjem dobimo resnično 1 = 1.
trditev: MAT-SS-4/matematicna-indukcija#iz-napacne
besedilo: »Iz napačne trditve lahko izpeljemo tudi resnično: iz $1 = -1$ s kvadriranjem dobimo $1 = 1$.« -/
theorem iz_napacne : (1 : ℤ) ≠ -1 ∧ ((1 : ℤ) = -1 → (1 : ℤ) ^ 2 = (-1) ^ 2) ∧ (1 : ℤ) ^ 2 = (-1) ^ 2 :=
  ⟨by norm_num, fun _ => by norm_num, by norm_num⟩

/-! ## Rešeni primeri -/

/-- Primer 1: 1 + 2 + … + n = n(n + 1)/2 za vsak n (v ℝ), z bazo 1 = 1·2/2 in korakom
n(n + 1)/2 + (n + 1) = (n + 1)(n/2 + 1) = (n + 1)(n + 2)/2.
trditev: MAT-SS-4/matematicna-indukcija#primer1
besedilo: »$\frac{n(n + 1)}{2} + (n + 1) = (n + 1)\left(\frac{n}{2} + 1\right) = \frac{(n + 1)(n + 2)}{2}$« -/
theorem primer1 (n : ℕ) : ∑ k ∈ range n, ((k : ℝ) + 1) = n * (n + 1) / 2 := by
  induction n with
  | zero => simp
  | succ n ih =>
    rw [sum_range_succ, ih]
    push_cast
    calc (n : ℝ) * (n + 1) / 2 + (n + 1) = (n + 1) * (n / 2 + 1) := by ring
      _ = (n + 1) * (n + 2) / 2 := by ring
      _ = (n + 1) * (n + 1 + 1) / 2 := by ring

/-- Primer 1, baza: pri n = 1 je 1 = 1·2/2.
trditev: MAT-SS-4/matematicna-indukcija#primer1-baza
besedilo: »Baza, $n = 1$: leva stran je $1$, desna $\frac{1 \cdot 2}{2} = 1$.« -/
theorem primer1_baza : (1 : ℝ) = 1 * 2 / 2 := by norm_num

/-- Primer 1: pri n + 1 ekipah je tekem 1 + 2 + … + n = C(n + 1, 2) (vsak par ekip enkrat);
pri 11 ekipah je to 10·11/2 = 55.
trditev: MAT-SS-4/matematicna-indukcija#primer1-tekme
besedilo: »Za $11$ ekip: $\frac{10 \cdot 11}{2} = 55$.« -/
theorem primer1_tekme (n : ℕ) :
    ∑ k ∈ range (n + 1), k = (n + 1).choose 2 ∧ (10 * 11 / 2 : ℝ) = 55 ∧ (11).choose 2 = 55 := by
  refine ⟨?_, by norm_num, by decide⟩
  rw [sum_range_id, Nat.choose_two_right]

/-- Primer 2: n³ + 2n je deljivo s 3 za vsak n; korak: (n + 1)³ + 2(n + 1) = n³ + 3n² + 5n + 3
= (n³ + 2n) + 3(n² + n + 1), in iz n³ + 2n = 3k sledi 3(k + n² + n + 1); baza 1 + 2 = 3; preizkus
n = 4: 72 = 3·24.
trditev: MAT-SS-4/matematicna-indukcija#primer2
besedilo: »Odgovor: $n^3 + 2n$ je deljivo s $3$ za vsako naravno število (preizkus: $n = 4$ da $72 = 3 \cdot 24$).« -/
theorem primer2 (n : ℕ) : 3 ∣ n ^ 3 + 2 * n := by
  induction n with
  | zero => simp
  | succ n ih =>
    obtain ⟨k, hk⟩ := ih
    refine ⟨k + n ^ 2 + n + 1, ?_⟩
    calc (n + 1) ^ 3 + 2 * (n + 1) = n ^ 3 + 3 * n ^ 2 + 5 * n + 3 := by ring
      _ = (n ^ 3 + 2 * n) + 3 * (n ^ 2 + n + 1) := by ring
      _ = 3 * k + 3 * (n ^ 2 + n + 1) := by rw [hk]
      _ = 3 * (k + n ^ 2 + n + 1) := by ring

/-- Primer 2: baza 1³ + 2·1 = 3 in preizkus n = 4: 4³ + 2·4 = 72 = 3·24.
trditev: MAT-SS-4/matematicna-indukcija#primer2-racuni
besedilo: »Odgovor: $n^3 + 2n$ je deljivo s $3$ za vsako naravno število (preizkus: $n = 4$ da $72 = 3 \cdot 24$).« -/
theorem primer2_racuni : 1 ^ 3 + 2 * 1 = 3 ∧ 4 ^ 3 + 2 * 4 = 72 ∧ 72 = 3 * 24 := by norm_num

/-- Primer 3, tabela: 2ⁿ = 2, 4, 8, 16, 32 in n² = 1, 4, 9, 16, 25 za n = 1, …, 5.
trditev: MAT-SS-4/matematicna-indukcija#primer3-tabela
besedilo: »$n = 1, 2, 3, 4, 5$ da $2^n = 2, 4, 8, 16, 32$ in $n^2 = 1, 4, 9, 16, 25$.« -/
theorem primer3_tabela :
    (List.range 5).map (fun k => 2 ^ (k + 1)) = [2, 4, 8, 16, 32] ∧
    (List.range 5).map (fun k => (k + 1) ^ 2) = [1, 4, 9, 16, 25] := by decide

/-- Primer 3, koraka 5–6: 2n² − (n + 1)² = (n − 1)² − 2; za n ≥ 5 je (n − 1)² ≥ 16, razlika je pozitivna
že za n ≥ 3 ((n − 1)² ≥ 2² > 2).
trditev: MAT-SS-4/matematicna-indukcija#primer3-pomozna
besedilo: »Za $n \ge 5$ je $(n - 1)^2 \ge 16$, zato je razlika pozitivna in $2^{n + 1} > (n + 1)^2$. (Razlika je pozitivna že od $n = 3$ naprej, saj je $2^2 - 2 > 0$; korak torej velja za $n \ge 3$.)« -/
theorem primer3_pomozna (n : ℤ) :
    2 * n ^ 2 - (n + 1) ^ 2 = (n - 1) ^ 2 - 2 ∧ (5 ≤ n → 16 ≤ (n - 1) ^ 2) ∧
    (3 ≤ n → 0 < (n - 1) ^ 2 - 2) := by
  refine ⟨by ring, fun h => by nlinarith, fun h => by nlinarith⟩

/-- Primer 3: 2ⁿ > n² za vsak n ≥ 5 (baza 32 > 25; korak 2ⁿ⁺¹ = 2·2ⁿ > 2n² ≥ (n + 1)²).
trditev: MAT-SS-4/matematicna-indukcija#primer3
besedilo: »Tabela: $n = 1, 2, 3, 4, 5$ da $2^n = 2, 4, 8, 16, 32$ in $n^2 = 1, 4, 9, 16, 25$.« -/
theorem primer3 : ∀ n : ℕ, 5 ≤ n → n ^ 2 < 2 ^ n := by
  intro n hn
  induction n, hn using Nat.le_induction with
  | base => norm_num
  | succ n hn ih =>
    have h2 : (n + 1) ^ 2 ≤ 2 * n ^ 2 := by nlinarith
    calc (n + 1) ^ 2 ≤ 2 * n ^ 2 := h2
      _ < 2 * 2 ^ n := by omega
      _ = 2 ^ (n + 1) := by ring

/-- Primer 3, odgovor: najmanjši n₀, od katerega naprej je vedno 2ⁿ > n², je 5: pri n = 4 trditev ne
velja (16 = 16), pri n = 3 tudi ne (8 < 9), pri 2 sta enaka (2² = 4 = 2²).
trditev: MAT-SS-4/matematicna-indukcija#primer3-n0
besedilo: »Tabela: $n = 1, 2, 3, 4, 5$ da $2^n = 2, 4, 8, 16, 32$ in $n^2 = 1, 4, 9, 16, 25$. Pri $n = 3$ je kvadrat večji, pri $2$ in $4$ sta enaka, od $5$ naprej vodi podvajanje. Domneva: $n_0 = 5$.« -/
theorem primer3_n0 :
    (∀ n : ℕ, 5 ≤ n → n ^ 2 < 2 ^ n) ∧ ¬ (4 ^ 2 < 2 ^ 4) ∧ 2 ^ 3 < 3 ^ 2 ∧
    ((fun n : ℕ => 2 ^ n) 2 = 4 ∧ (fun n : ℕ => n ^ 2) 2 = 4) ∧
    ∀ n₀ : ℕ, (∀ n, n₀ ≤ n → n ^ 2 < 2 ^ n) → 5 ≤ n₀ := by
  refine ⟨primer3, by norm_num, by norm_num, ⟨rfl, rfl⟩, fun n₀ h => ?_⟩
  by_contra hc
  have := h 4 (by omega)
  norm_num at this

/-- Primer 4: H₁ = 1, Hₙ₊₁ = 2Hₙ + 1 ⇒ Hₙ = 2ⁿ − 1 (korak 2(2ⁿ − 1) + 1 = 2ⁿ⁺¹ − 2 + 1 = 2ⁿ⁺¹ − 1),
H₆ = 2⁶ − 1 = 63; »Preveri se« 2: H₇ = 127 (ne 128, 49 ali 14).
trditev: MAT-SS-4/matematicna-indukcija#primer4
besedilo: »$H_{n + 1} = 2(2^n - 1) + 1 = 2^{n + 1} - 2 + 1 = 2^{n + 1} - 1$, kar je $P(n + 1)$. Za šest ploščic potrebuješ $H_6 = 2^6 - 1 = 63$ potez.« -/
theorem primer4 (H : ℕ → ℤ) (h1 : H 1 = 1) (h : ∀ n, 1 ≤ n → H (n + 1) = 2 * H n + 1) :
    (∀ n, 1 ≤ n → H n = 2 ^ n - 1) ∧ H 6 = 63 ∧ H 7 = 127 ∧
    ((2 : ℤ) ^ 7 = 128 ∧ (7 : ℤ) ^ 2 = 49 ∧ (2 : ℤ) * 7 = 14) := by
  have e : ∀ n, 1 ≤ n → H n = 2 ^ n - 1 := by
    intro n hn
    induction n, hn using Nat.le_induction with
    | base => rw [h1]; norm_num
    | succ n hn ih =>
      calc H (n + 1) = 2 * (2 ^ n - 1) + 1 := by rw [h n hn, ih]
        _ = 2 ^ (n + 1) - 2 + 1 := by ring
        _ = 2 ^ (n + 1) - 1 := by ring
  refine ⟨e, ?_, ?_, by norm_num⟩
  · rw [e 6 (by norm_num)]; norm_num
  · rw [e 7 (by norm_num)]; norm_num

/-- Predpostavke trditve `primer4` se dajo izpolniti. -/
example : ∃ H : ℕ → ℤ, H 1 = 1 ∧ ∀ n, 1 ≤ n → H (n + 1) = 2 * H n + 1 :=
  ⟨fun n => 2 ^ n - 1, by norm_num, fun n _ => by simp only [pow_succ]; ring⟩

/-! ## Pogoste napake -/

/-- Predpostavke trditve `primer4` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ H : ℕ → ℤ, H 1 = 1 ∧ ∀ n, 1 ≤ n → H (n + 1) = 2 * H n + 1 :=
    ⟨fun n => 2 ^ n - 1, by norm_num, fun n _ => by simp only [pow_succ]; ring⟩
  (fun _ => trivial) (primer4 (H := w.choose) (h1 := w.choose_spec.1) (h := w.choose_spec.2))

/-- Pogoste napake 1: n² + n + 41 je praštevilo za vse n od 1 do 39, pri n = 40 pa 1681 = 41².
trditev: MAT-SS-4/matematicna-indukcija#euler
besedilo: »»Preveril sem dovolj primerov.«** Izraz $n^2 + n + 41$ da praštevilo za vse $n$ od $1$ do $39$, pri $n = 40$ pa $1681 = 41^2$.« -/
theorem euler :
    (∀ n ∈ Finset.Icc 1 39, Nat.Prime (n ^ 2 + n + 41)) ∧ 40 ^ 2 + 40 + 41 = 1681 ∧ 1681 = 41 ^ 2 ∧
    ¬ Nat.Prime (40 ^ 2 + 40 + 41) := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  intro n hn
  simp only [Finset.mem_Icc] at hn
  obtain ⟨h1, h2⟩ := hn
  interval_cases n <;> norm_num

/-- Pogoste napake 3: pri 2ⁿ > n² je baza n = 1 resnična (2 > 1), korak iz 1 v 2 odpove (4 > 4 ne
drži), n = 3 ni baza (8 < 9).
trditev: MAT-SS-4/matematicna-indukcija#baza-napacna
besedilo: »Baza na napačnem mestu.** Pri $2^n > n^2$ je baza $n = 1$ resnična ($2 > 1$), vendar korak iz $1$ v $2$ odpove ($4 > 4$ ne drži), dokazali pa smo ga le za $n \ge 3$.« -/
theorem baza_napacna : 1 ^ 2 < 2 ^ 1 ∧ ¬ (2 ^ 2 < 2 ^ 2) ∧ 2 ^ 3 < 3 ^ 2 := by norm_num

/-! ## Za maturo -/

/-- Naloga 1: a₁ = 2, aₙ₊₁ = 3aₙ − 2 ⇒ a₂ = 4, a₃ = 10, a₄ = 28, a₅ = 82 (minus 1: 1, 3, 9, 27, 81);
aₙ = 3ⁿ⁻¹ + 1 (korak 3(3ⁿ⁻¹ + 1) − 2 = 3ⁿ + 1); aₙ = 730 ⇔ 3ⁿ⁻¹ = 729 = 3⁶ ⇔ n = 7.
trditev: MAT-SS-4/matematicna-indukcija#matura1
besedilo: »Odgovor: a) $a_2 = 4$, $a_3 = 10$, $a_4 = 28$, $a_5 = 82$, domneva $a_n = 3^{n-1} + 1$; b) domneva je dokazana; c) $730$ je sedmi člen.« -/
theorem matura1 (a : ℕ → ℤ) (h1 : a 1 = 2) (h : ∀ n, 1 ≤ n → a (n + 1) = 3 * a n - 2) :
    (a 2 = 4 ∧ a 3 = 10 ∧ a 4 = 28 ∧ a 5 = 82) ∧
    (a 1 - 1 = 1 ∧ a 2 - 1 = 3 ∧ a 3 - 1 = 9 ∧ a 4 - 1 = 27 ∧ a 5 - 1 = 81) ∧
    (∀ n, 1 ≤ n → a n = 3 ^ (n - 1) + 1) ∧ (∀ n, 1 ≤ n → (a n = 730 ↔ n = 7)) := by
  have a2 : a 2 = 4 := by rw [h 1 le_rfl, h1]; norm_num
  have a3 : a 3 = 10 := by rw [h 2 (by norm_num), a2]; norm_num
  have a4 : a 4 = 28 := by rw [h 3 (by norm_num), a3]; norm_num
  have a5 : a 5 = 82 := by rw [h 4 (by norm_num), a4]; norm_num
  have e : ∀ n, 1 ≤ n → a n = 3 ^ (n - 1) + 1 := by
    intro n hn
    induction n, hn using Nat.le_induction with
    | base => rw [h1]; norm_num
    | succ n hn ih =>
      obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
      calc a (k + 1 + 1) = 3 * (3 ^ k + 1) - 2 := by rw [h (k + 1) hn, ih]; simp
        _ = 3 ^ (k + 1) + 1 := by ring
        _ = 3 ^ (k + 1 + 1 - 1) + 1 := by simp
  refine ⟨⟨a2, a3, a4, a5⟩, ⟨by rw [h1]; norm_num, by rw [a2]; norm_num, by rw [a3]; norm_num,
    by rw [a4]; norm_num, by rw [a5]; norm_num⟩, e, fun n hn => ?_⟩
  rw [e n hn]
  constructor
  · intro hc
    have h729 : (3 : ℤ) ^ (n - 1) = 3 ^ 6 := by linarith
    have := Nat.pow_right_injective (by norm_num : 2 ≤ 3) (show 3 ^ (n - 1) = 3 ^ 6 by exact_mod_cast h729)
    omega
  · rintro rfl; norm_num

/-- Predpostavke trditve `matura1` se dajo izpolniti. -/
example : ∃ a : ℕ → ℤ, a 1 = 2 ∧ ∀ n, 1 ≤ n → a (n + 1) = 3 * a n - 2 := by
  refine ⟨fun n => 3 ^ (n - 1) + 1, by norm_num, fun n hn => ?_⟩
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
  simp only [show k + 1 + 1 - 1 = k + 1 by omega, Nat.add_sub_cancel, pow_succ]; ring

/-- Naloga 2: Sₙ = 1/(1·2) + … + 1/(n(n + 1)). -/
noncomputable def S (n : ℕ) : ℝ := ∑ k ∈ range n, 1 / (((k : ℝ) + 1) * (k + 2))

/-- Predpostavke trditve `matura1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ a : ℕ → ℤ, a 1 = 2 ∧ ∀ n, 1 ≤ n → a (n + 1) = 3 * a n - 2 := by
    refine ⟨fun n => 3 ^ (n - 1) + 1, by norm_num, fun n hn => ?_⟩
    obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
    simp only [show k + 1 + 1 - 1 = k + 1 by omega, Nat.add_sub_cancel, pow_succ]; ring
  (fun _ => trivial) (matura1 (a := w.choose) (h1 := w.choose_spec.1) (h := w.choose_spec.2))

/-- Naloga 2 a): S₁ = 1/2, S₂ = 1/2 + 1/6 = 2/3, S₃ = 2/3 + 1/12 = 3/4.
trditev: MAT-SS-4/matematicna-indukcija#matura2a
besedilo: »a) $S_1 = \dfrac{1}{2}$, $S_2 = \dfrac{1}{2} + \dfrac{1}{6} = \dfrac{2}{3}$, $S_3 = \dfrac{2}{3} + \dfrac{1}{12} = \dfrac{3}{4}$.« -/
theorem matura2a : S 1 = 1 / 2 ∧ S 2 = 1 / 2 + 1 / 6 ∧ (1 / 2 + 1 / 6 : ℝ) = 2 / 3 ∧
    S 3 = 2 / 3 + 1 / 12 ∧ (2 / 3 + 1 / 12 : ℝ) = 3 / 4 := by
  refine ⟨?_, ?_, ?_, ?_, ?_⟩ <;> norm_num [S, sum_range_succ]

/-- Naloga 2 b): Sₙ = n/(n + 1); korak n/(n + 1) + 1/((n + 1)(n + 2)) = (n² + 2n + 1)/((n + 1)(n + 2))
= (n + 1)²/((n + 1)(n + 2)) = (n + 1)/(n + 2); baza S₁ = 1/2 = 1/(1 + 1).
trditev: MAT-SS-4/matematicna-indukcija#matura2b
besedilo: »$S_{n+1} = S_n + \dfrac{1}{(n + 1)(n + 2)} = \dfrac{n}{n + 1} + \dfrac{1}{(n + 1)(n + 2)} = \dfrac{n^2 + 2n + 1}{(n + 1)(n + 2)} = \dfrac{(n + 1)^2}{(n + 1)(n + 2)} = \dfrac{n + 1}{n + 2}$« -/
theorem matura2b (n : ℕ) : S n = n / (n + 1) := by
  induction n with
  | zero => simp [S]
  | succ n ih =>
    rw [S, sum_range_succ, ← S, ih]
    push_cast
    have h1 : (0 : ℝ) < n + 1 := by positivity
    have h2 : (0 : ℝ) < n + 2 := by positivity
    calc (n : ℝ) / (n + 1) + 1 / ((n + 1) * (n + 2))
        = (n ^ 2 + 2 * n + 1) / ((n + 1) * (n + 2)) := by field_simp
      _ = (n + 1) ^ 2 / ((n + 1) * (n + 2)) := by ring
      _ = (n + 1) / (n + 2) := by field_simp
      _ = (n + 1) / (n + 1 + 1) := by ring

/-- Naloga 2 c): vsota vrste je lim n/(n + 1) = lim 1/(1 + 1/n) = 1; 1 − Sₙ = 1/(n + 1);
1/(n + 1) < 0,01 ⇔ n > 99; najmanjši n je 100, pri n = 99 je razlika natanko 0,01.
trditev: MAT-SS-4/matematicna-indukcija#matura2c
besedilo: »c) Razlika do vsote je $1 - S_n = 1 - \dfrac{n}{n + 1} = \dfrac{1}{n + 1}$. Pogoj $\dfrac{1}{n + 1} < 0{,}01$ da $n + 1 > 100$, torej $n > 99$.« -/
theorem matura2c :
    Tendsto S atTop (𝓝 1) ∧ (∀ n : ℕ, 1 - (n : ℝ) / (n + 1) = 1 / (n + 1)) ∧
    (∀ n : ℕ, 1 - S n < 0.01 ↔ 99 < n) ∧ 1 - S 99 = 0.01 := by
  have d : ∀ n : ℕ, 1 - (n : ℝ) / (n + 1) = 1 / (n + 1) := fun n => by field_simp; ring
  have lt : ∀ n : ℕ, 1 - S n < 0.01 ↔ 99 < n := fun n => by
    rw [matura2b, d, div_lt_iff₀ (by positivity)]
    constructor
    · intro h; have : (99 : ℝ) < n := by linarith
      exact_mod_cast this
    · intro h; have : (99 : ℝ) < n := by exact_mod_cast h
      linarith
  refine ⟨?_, d, lt, by rw [matura2b]; norm_num⟩
  have : S = fun n : ℕ => 1 - 1 / ((n : ℝ) + 1) := by
    funext n; rw [matura2b, ← d]; ring
  rw [this]
  simpa using (tendsto_const_nhds (x := (1 : ℝ))).sub (tendsto_one_div_add_atTop_nhds_zero_nat (𝕜 := ℝ))

/-- Naloga 2 c), korak 5: n/(n + 1) = 1/(1 + 1/n) za n ≥ 1.
trditev: MAT-SS-4/matematicna-indukcija#matura2c-deljenje
besedilo: »$S = \lim\limits_{n \to \infty} \dfrac{n}{n + 1} = \lim\limits_{n \to \infty} \dfrac{1}{1 + \frac{1}{n}} = 1$« -/
theorem matura2c_deljenje (n : ℕ) (hn : 1 ≤ n) : (n : ℝ) / (n + 1) = 1 / (1 + 1 / n) := by
  have : (0 : ℝ) < n := by exact_mod_cast hn
  field_simp

/-- Predpostavka trditve `matura2c_deljenje` se da izpolniti (n = 1). -/
example : 1 ≤ (1:ℕ) := le_rfl

/-- Predpostavke trditve `matura2c_deljenje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 1 ≤ (1:ℕ) := le_rfl
  matura2c_deljenje (hn := w)

/-- Naloga 2 d): T₁ = 1/3 = 1/(1 + 2), T₂ = 1/3 + 1/8 = 11/24, domneva Tₙ = n/(n + 2) pa da
T₂ = 2/(2 + 2) = 1/2 = 12/24 ≠ 11/24, torej je n = 2 protiprimer.
trditev: MAT-SS-4/matematicna-indukcija#matura2d
besedilo: »d) $T_2 = \dfrac{1}{3} + \dfrac{1}{8} = \dfrac{11}{24}$, domneva pa napove $T_2 = \dfrac{2}{2 + 2} = \dfrac{1}{2} = \dfrac{12}{24}$.« -/
theorem matura2d :
    (1 / (1 * 3) : ℝ) = 1 / 3 ∧ (1 / 3 : ℝ) = 1 / (1 + 2) ∧
    (1 / (1 * 3) + 1 / (2 * 4) : ℝ) = 1 / 3 + 1 / 8 ∧ (1 / 3 + 1 / 8 : ℝ) = 11 / 24 ∧
    (2 / (2 + 2) : ℝ) = 1 / 2 ∧ (1 / 2 : ℝ) = 12 / 24 ∧ (11 / 24 : ℝ) ≠ 1 / 2 := by norm_num

/-! ## Ustna vprašanja -/

/-- Ustno vprašanje 2: 1 + 2 + 2² + … + 2ⁿ⁻¹ = 2ⁿ − 1; korak 2ⁿ − 1 + 2ⁿ = 2·2ⁿ − 1 = 2ⁿ⁺¹ − 1.
trditev: MAT-SS-4/matematicna-indukcija#ustno2
besedilo: »$2^n - 1 + 2^n = 2 \cdot 2^n - 1 = 2^{n+1} - 1$« -/
theorem ustno2 (n : ℕ) : ∑ k ∈ range n, (2 : ℤ) ^ k = 2 ^ n - 1 := by
  induction n with
  | zero => simp
  | succ n ih =>
    rw [sum_range_succ, ih]
    calc (2 : ℤ) ^ n - 1 + 2 ^ n = 2 * 2 ^ n - 1 := by ring
      _ = 2 ^ (n + 1) - 1 := by ring

/-- Ustno vprašanje 3: n! > 2ⁿ za vse n ≥ 4 (baza 4! = 24 > 16 = 2⁴; korak (n + 1)! = (n + 1)·n!
> (n + 1)·2ⁿ > 2·2ⁿ = 2ⁿ⁺¹); za n = 3 ne velja (3! = 6 < 8).
trditev: MAT-SS-4/matematicna-indukcija#ustno3
besedilo: »Primer je neenakost $n! > 2^n$, ki velja za vse $n \ge 4$, za $n = 3$ pa ne, saj je $3! = 6 < 8$.« -/
theorem ustno3 : (∀ n : ℕ, 4 ≤ n → 2 ^ n < n.factorial) ∧ (3).factorial = 6 ∧ 6 < 2 ^ 3 ∧
    (4).factorial = 24 ∧ 2 ^ 4 = 16 := by
  refine ⟨fun n hn => ?_, by decide, by norm_num, by decide, by norm_num⟩
  induction n, hn using Nat.le_induction with
  | base => decide
  | succ n hn ih =>
    rw [Nat.factorial_succ, pow_succ]
    have hp : 0 < 2 ^ n := by positivity
    calc 2 ^ n * 2 < 2 ^ n * (n + 1) := Nat.mul_lt_mul_of_pos_left (by omega) hp
      _ < (n + 1) * n.factorial := by nlinarith

/-! ## Preveri se -/

/-- Preveri se 3: baza pri 5 in korak za n ≥ 3 dasta veljavnost za vse n ≥ 5.
trditev: MAT-SS-4/matematicna-indukcija#kviz3
besedilo: »baza pri $5$ in korak za $n \ge 3$ (torej tudi za $n \ge 5$) dasta veljavnost za vse $n \ge 5$.« -/
theorem kviz3 (P : ℕ → Prop) (h5 : P 5) (hk : ∀ n, 3 ≤ n → P n → P (n + 1)) : ∀ n, 5 ≤ n → P n :=
  nacelo_n0 P 5 h5 (fun n hn => hk n (by omega))

/-- Predpostavke trditve `kviz3` se dajo izpolniti. -/
example : ∃ P : ℕ → Prop, P 5 ∧ ∀ n, 3 ≤ n → P n → P (n + 1) :=
  ⟨fun n => n ^ 2 < 2 ^ n ∨ n < 5, Or.inl (by norm_num), fun n hn h => by
    rcases Nat.lt_or_ge n 5 with h' | h'
    · by_cases h4 : n = 4
      · subst h4; left; norm_num
      · right; omega
    · left; exact primer3 (n + 1) (by omega)⟩

/-- Predpostavke trditve `kviz3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ P : ℕ → Prop, P 5 ∧ ∀ n, 3 ≤ n → P n → P (n + 1) :=
    ⟨fun n => n ^ 2 < 2 ^ n ∨ n < 5, Or.inl (by norm_num), fun n hn h => by
      rcases Nat.lt_or_ge n 5 with h' | h'
      · by_cases h4 : n = 4
        · subst h4; left; norm_num
        · right; omega
      · left; exact primer3 (n + 1) (by omega)⟩
  (fun _ => trivial) (kviz3 (P := w.choose) (h5 := w.choose_spec.1) (hk := w.choose_spec.2))

/-- Preveri se 4: za napačno trditev 1 + … + n = (n² + n + 2)/2 je korak pravilen (obe strani sta
(n² + 3n + 4)/2), baza pa ne (pri n = 1 je leva stran 1, desna 2).
trditev: MAT-SS-4/matematicna-indukcija#kviz4
besedilo: »Korak je pravilen: obe strani sta $\frac{n^2 + 3n + 4}{2}$.« -/
theorem kviz4 (n : ℝ) :
    (n ^ 2 + n + 2) / 2 + (n + 1) = ((n + 1) ^ 2 + (n + 1) + 2) / 2 ∧
    (n ^ 2 + n + 2) / 2 + (n + 1) = (n ^ 2 + 3 * n + 4) / 2 ∧
    ((1 : ℝ) ^ 2 + 1 + 2) / 2 = 2 ∧ (1 : ℝ) ≠ 2 := by
  refine ⟨by ring, by ring, by norm_num, by norm_num⟩

/-- Preveri se 5: domine 1, …, 500; prva pade, korak velja pri vseh prehodih razen 120 → 121; padejo
vse domine od 1. do 120.
trditev: MAT-SS-4/matematicna-indukcija#kviz5
besedilo: »0 | Prva pade, korak pa velja pri vseh prehodih do $120.$ domine, zato padejo vse do te vrzeli.« -/
theorem kviz5 (P : ℕ → Prop) (h1 : P 1) (hk : ∀ n, 1 ≤ n → n < 500 → n ≠ 120 → P n → P (n + 1)) :
    ∀ n, 1 ≤ n → n ≤ 120 → P n := by
  intro n hn
  induction n, hn using Nat.le_induction with
  | base => intro _; exact h1
  | succ n hn ih => intro h; exact hk n hn (by omega) (by omega) (ih (by omega))

/-- Preveri se 5: predpostavke ne zahtevajo, da pade 121. domina: »padejo natanko domine 1–120«
(P(n) := n ≤ 120) jih izpolni, zato pade natanko 120 domin. Trditev: `kviz5`. -/
example : (fun n : ℕ => n ≤ 120) 1 ∧
    (∀ n, 1 ≤ n → n < 500 → n ≠ 120 → (fun n : ℕ => n ≤ 120) n → (fun n : ℕ => n ≤ 120) (n + 1)) ∧
    ¬ (fun n : ℕ => n ≤ 120) 121 :=
  ⟨by norm_num, fun n _ _ h1 h2 => by simp only at h2 ⊢; omega, by norm_num⟩

/-- RAČUN: 3·2 − 2 = 4, 3·4 − 2 = 10, 3·10 − 2 = 28, 3·28 − 2 = 82, 1/2 + 1/6 = 2/3,
1/2 + 1/6 + 1/12 = 3/4, 1/3 + 1/8 = 11/24, 2/(2 + 2) = 1/2, 4! = 24; 3(3ⁿ⁻¹ + 1) − 2 = 3ⁿ + 1 (n ≥ 1);
2ⁿ − 1 + 2ⁿ = 2ⁿ⁺¹ − 1; 1/(n + 1) = 1/100 ⇔ n = 99.
trditev: MAT-SS-4/matematicna-indukcija#racun
besedilo: »a) $a_2 = 3 \cdot 2 - 2 = 4$, $a_3 = 3 \cdot 4 - 2 = 10$, $a_4 = 3 \cdot 10 - 2 = 28$, $a_5 = 3 \cdot 28 - 2 = 82$.« -/
theorem racun :
    (3 * 2 - 2 : ℤ) = 4 ∧ (3 * 4 - 2 : ℤ) = 10 ∧ (3 * 10 - 2 : ℤ) = 28 ∧ (3 * 28 - 2 : ℤ) = 82 ∧
    (1 / 2 + 1 / 6 : ℝ) = 2 / 3 ∧ (1 / 2 + 1 / 6 + 1 / 12 : ℝ) = 3 / 4 ∧
    (1 / 3 + 1 / 8 : ℝ) = 11 / 24 ∧ (2 / (2 + 2) : ℝ) = 1 / 2 ∧ (4).factorial = 24 ∧
    (∀ n : ℕ, 1 ≤ n → 3 * ((3 : ℤ) ^ (n - 1) + 1) - 2 = 3 ^ n + 1) ∧
    (∀ n : ℕ, (2 : ℤ) ^ n - 1 + 2 ^ n = 2 ^ (n + 1) - 1) ∧
    (∀ x : ℝ, x ≠ -1 → (1 / (x + 1) = 1 / 100 ↔ x = 99)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by decide, fun n hn => ?_, fun n => by ring, fun x hx => ?_⟩
  · obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
    simp only [Nat.add_sub_cancel, pow_succ]; ring
  · have : x + 1 ≠ 0 := fun h => hx (by linarith)
    rw [div_eq_div_iff this (by norm_num)]
    constructor <;> intro h <;> linarith

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `kviz5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (fun n : ℕ => n ≤ 120) 1 ∧ (∀ n, 1 ≤ n → n < 500 → n ≠ 120 → (fun n : ℕ => n ≤ 120) n → (fun n : ℕ => n ≤ 120) (n + 1)) ∧ ¬ (fun n : ℕ => n ≤ 120) 121 :=
    ⟨by norm_num, fun n _ _ h1 h2 => by simp only at h2 ⊢; omega, by norm_num⟩
  kviz5 (h1 := w.1) (hk := w.2.1)

/-- Predpostavke trditve `primer3_n0` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  primer3_n0.2.2.2.2 5 primer3_n0.1

end Evklid.Lekcije.MAT_SS_4.MatematicnaIndukcija
