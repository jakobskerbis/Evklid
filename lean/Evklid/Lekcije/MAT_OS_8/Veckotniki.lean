/-
vir: content/lessons/MAT-OS-8/veckotniki.md
sha256: 52a4bc3fe578c6c67f3bd3b6f75fccb122c982b883b69d347687f63fdeb16e29
Model: oglišča n-kotnika so `Fin n`; stranice so povezave cikla `SimpleGraph.cycleGraph n` (sosednji
oglišči), diagonale so povezave njegovega komplementa (pari nesosednjih različnih oglišč); pri konveksnem
večkotniku je vsaka taka daljica diagonala. Število diagonal je dokazano kot število povezav tega grafa
(n ≥ 3). Koti so v stopinjah kot realna števila: S n = (n − 2) · 180, α = S n / n, α' = 360 / n (n ≥ 3 iz
lekcije, zato n ≠ 0 in ℕ-odštevanje n − 3 ni odrezano). Vsota kotov trikotnika (180° = π) je dokazana z
Mathlibovim izrekom za evklidsko ravnino.
Ni v Leanu: risbe in simulacija (dokazana so števila 0, 2, 5, 9, 14, 20 in rast vsote za 180°); pojmi
večkotnik, konveksnost, oglišče, stranica, pravilnost kot definicije (pravilnost je v računih vzeta kot
»vsi koti enaki«); vsota notranjih kotov S_n = (n − 2) · 180° za splošen (konveksni ali nekonveksni)
n-kotnik kot geometrijska trditev, tudi za štirikotnik (zahtevno, še ni dokazano; dokazana je za trikotnik,
S_n je v računih obrazec iz lekcije); da diagonale iz enega oglišča razrežejo lik na n − 2 trikotnikov, katerih
koti natanko zapolnijo kote večkotnika (pahljača, Na sliki; dokazano je le štetje (n − 3) + 1 = n − 2);
vsota zunanjih kotov 360° za splošen konveksni večkotnik in sprehod okoli igrišča (zahtevno, še ni dokazano;
dokazano za pravilni n-kotnik, n · 360/n = 360, in kot n · 180 − S_n = 360 iz obrazca); da notranji kot
pravilnega n-kotnika res meri (n − 2) · 180°/n kot geometrijski kot, da oglišča ležijo na krožnici,
karakteristični trikotniki (skladni, enakokraki, središčni kot 360°/n, kota ob osnovnici α/2) in »vse bolj
podoben krogu« (zahtevno, še ni dokazano; dokazana sta α/2 + α/2 + 360/n = 180 in α → 180); da ima romb s
kotom 70° kote 70° in 110° (sosednja kota paralelograma: geometrija, ni dokazano; dokazano je 180 − 70 = 110
in 70 ≠ 110), da romb, ki ni kvadrat, ni pravilen, in da je kvadrat edini pravilni štirikotnik; »v vsakem petkotniku kot meri 108°« ne velja
(protiprimer je nepravilen petkotnik: geometrija, ni dokazano; dokazano je 540 : 5 = 108); tlakovanje kot
geometrijska trditev in čebele (dokazano je 4 · 90 = 6 · 60 = 3 · 120 = 360 in da 360 : 108 ni celo
število); enote (°, cm); besedilo napačnih odgovorov v Preveri se (dokazane so napačne vrednosti).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.Veckotniki

open SimpleGraph Finset Filter Topology

/-- Vsota notranjih kotov n-kotnika v stopinjah (obrazec iz lekcije): S n = (n − 2) · 180. -/
noncomputable def S (n : ℕ) : ℝ := ((n:ℝ) - 2) * 180

/-- Notranji kot pravilnega n-kotnika v stopinjah: α = (n − 2) · 180 / n. -/
noncomputable def alfa (n : ℕ) : ℝ := S n / n

/-- Zunanji (in središčni) kot pravilnega n-kotnika v stopinjah: α' = 360 / n. -/
noncomputable def alfa' (n : ℕ) : ℝ := 360 / n

/-! ## Uvod: trikotnik -/

/-- Zakaj se tega učimo: vsota notranjih kotov trikotnika je 180° (= π radianov), dokazano v evklidski
ravnini za poljubne točke A, B, C z B ≠ A. To zajame vsak pravi trikotnik (tri nekolinearne točke), velja
pa tudi za izrojene (npr. C = A, kjer Mathlib kotu z ničelnim vektorjem pripiše π/2). -/
theorem trikotnik (A B C : EuclideanSpace ℝ (Fin 2)) (h : B ≠ A) :
    EuclideanGeometry.angle A B C + EuclideanGeometry.angle B C A + EuclideanGeometry.angle C A B =
      Real.pi :=
  EuclideanGeometry.angle_add_angle_add_angle_eq_pi C h

/-- Predpostavka trditve `trikotnik` se da izpolniti (dve različni točki ravnine; vsak pravi trikotnik
ima B ≠ A). -/
example : ∃ A B : EuclideanSpace ℝ (Fin 2), B ≠ A :=
  ⟨0, EuclideanSpace.single 0 1, fun h => by
    have := congrArg (fun v : EuclideanSpace ℝ (Fin 2) => v 0) h
    simp at this⟩

/-! ## Razlaga 2 in 4: diagonale -/

/-- Razlaga 1: n-kotnik (n ≥ 3) ima n oglišč in n stranic (cikel na n ogliščih ima n povezav). -/
theorem stranice (m : ℕ) : #(cycleGraph (m + 3)).edgeFinset = m + 3 := by
  have h := sum_degrees_eq_twice_card_edges (cycleGraph (m + 3))
  simp only [cycleGraph_degree_three_le, sum_const, card_univ, Fintype.card_fin, smul_eq_mul] at h
  omega

/-- Razlaga 2, Povzetek: iz vsakega oglišča n-kotnika (n ≥ 3) izhaja n − 3 diagonal. -/
theorem diagonale_iz_oglisca (m : ℕ) (v : Fin (m + 3)) : (cycleGraph (m + 3))ᶜ.degree v = m := by
  rw [degree_compl, cycleGraph_degree_three_le, Fintype.card_fin]
  omega

/-- Razlaga 4, Preveri se 3: vsako diagonalo štejemo iz obeh krajišč: n · (n − 3) = 2 · D_n (n ≥ 3). -/
theorem dvakrat_diagonale (m : ℕ) : 2 * #(cycleGraph (m + 3))ᶜ.edgeFinset = (m + 3) * m := by
  rw [← sum_degrees_eq_twice_card_edges]
  simp only [diagonale_iz_oglisca, sum_const, card_univ, Fintype.card_fin, smul_eq_mul]

/-- Razlaga 4, Povzetek: število vseh diagonal n-kotnika (n ≥ 3) je D_n = n(n − 3)/2. -/
theorem diagonale (n : ℕ) (hn : 3 ≤ n) : #(cycleGraph n)ᶜ.edgeFinset = n * (n - 3) / 2 := by
  obtain ⟨m, rfl⟩ := Nat.exists_eq_add_of_le' hn
  have := dvakrat_diagonale m
  rw [Nat.add_sub_cancel]
  omega

/-- Predpostavka `diagonale` se da izpolniti (n = 5). -/
example : 3 ≤ 5 := by norm_num

/-- Razlaga 2, Premisli: n − 3 diagonal iz enega oglišča razreže lik na (n − 3) + 1 = n − 2 trikotnikov;
šestkotnik 6 − 3 = 3 diagonale, 4 trikotniki; desetkotnik 10 − 3 = 7 diagonal, 8 trikotnikov. -/
theorem pahljaca (n : ℕ) (hn : 3 ≤ n) :
    (n - 3) + 1 = n - 2 ∧ 6 - 3 = 3 ∧ 6 - 2 = 4 ∧ 10 - 3 = 7 ∧ 10 - 2 = 8 := by omega

/-- Predpostavka `pahljaca` se da izpolniti (n = 6). -/
example : 3 ≤ 6 := by norm_num

/-- Razlaga 4: D_5 = 5 · 2/2 = 5, D_6 = 6 · 3/2 = 9. -/
theorem d5_d6 :
    #(cycleGraph 5)ᶜ.edgeFinset = 5 ∧ #(cycleGraph 6)ᶜ.edgeFinset = 9 ∧ 5 * 2 / 2 = 5 ∧
    6 * 3 / 2 = 9 := by
  refine ⟨?_, ?_, by norm_num, by norm_num⟩
  · rw [diagonale 5 (by norm_num)]
  · rw [diagonale 6 (by norm_num)]

/-- Razlaga 5 (simulacija): število diagonal pri n = 3, …, 8 je 0, 2, 5, 9, 14, 20. -/
theorem simulacija_diagonale :
    #(cycleGraph 3)ᶜ.edgeFinset = 0 ∧ #(cycleGraph 4)ᶜ.edgeFinset = 2 ∧
    #(cycleGraph 5)ᶜ.edgeFinset = 5 ∧ #(cycleGraph 6)ᶜ.edgeFinset = 9 ∧
    #(cycleGraph 7)ᶜ.edgeFinset = 14 ∧ #(cycleGraph 8)ᶜ.edgeFinset = 20 := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩ <;> rw [diagonale _ (by norm_num)]

/-! ## Razlaga 3: vsota notranjih kotov (obrazec) -/

/-- Razlaga 3, tabela: S_3 = 180, S_4 = 360, S_5 = 540, S_6 = 720, S_8 = 1080; število diagonal iz oglišča
n − 3 je 0, 1, 2, 3, 5, število trikotnikov n − 2 je 1, 2, 3, 4, 6, za ena več (v ℕ). -/
theorem tabela_vsot :
    S 3 = 1 * 180 ∧ S 4 = 2 * 180 ∧ S 5 = 3 * 180 ∧ S 6 = 4 * 180 ∧ S 8 = 6 * 180 ∧
    S 3 = 180 ∧ S 4 = 360 ∧ S 5 = 540 ∧ S 6 = 720 ∧ S 8 = 1080 ∧
    (3 - 3 = 0 ∧ 4 - 3 = 1 ∧ 5 - 3 = 2 ∧ 6 - 3 = 3 ∧ 8 - 3 = 5) ∧
    (3 - 2 = 1 ∧ 4 - 2 = 2 ∧ 5 - 2 = 3 ∧ 6 - 2 = 4 ∧ 8 - 2 = 6) ∧
    (0 + 1 = 1 ∧ 1 + 1 = 2 ∧ 2 + 1 = 3 ∧ 3 + 1 = 4 ∧ 5 + 1 = 6) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, by decide, by decide, by decide⟩ <;>
    (simp only [S]; norm_num)

/-- Razlaga 3 in 5: ko dodamo eno oglišče, vsota kotov zraste za 180°. -/
theorem vsota_raste (n : ℕ) : S (n + 1) - S n = 180 := by
  simp only [S]; push_cast; ring

/-! ## Razlaga 6–8: pravilni večkotnik, zunanji kot -/

/-- Razlaga 6, Pogoste napake: notranji kot pravilnega n-kotnika (n ≥ 3) je α = 180° − 360°/n. -/
theorem alfa_eq (n : ℕ) (hn : 3 ≤ n) : alfa n = 180 - 360 / n := by
  have : (n:ℝ) ≠ 0 := by positivity
  simp only [alfa, S]
  field_simp
  ring

/-- Predpostavka `alfa_eq` (in drugih trditev z n ≥ 3) se da izpolniti (n = 6). -/
example : 3 ≤ 6 := by norm_num

/-- Razlaga 7, Povzetek: notranji in zunanji kot skupaj tvorita iztegnjeni kot, α + α' = 180°. -/
theorem alfa_plus_alfa' (n : ℕ) (hn : 3 ≤ n) : alfa n + alfa' n = 180 := by
  rw [alfa_eq n hn, alfa']; ring

/-- Razlaga 7: v pravilnem n-kotniku je vsota n enakih zunanjih kotov n · 360/n = 360°. -/
theorem vsota_zunanjih_pravilni (n : ℕ) (hn : 3 ≤ n) : n * alfa' n = 360 := by
  have : (n:ℝ) ≠ 0 := by positivity
  simp only [alfa']
  field_simp

/-- Bolj natančno: vsota notranjih in zunanjih kotov je n · 180, zato je vsota zunanjih kotov
n · 180 − (n − 2) · 180 = 2 · 180 = 360 (neodvisno od n). -/
theorem vsota_zunanjih (n : ℕ) : (n:ℝ) * 180 - S n = 2 * 180 ∧ (2:ℝ) * 180 = 360 := by
  simp only [S]; constructor <;> ring

/-- Razlaga 6 in 7: pravilni šestkotnik α = 720/6 = 120, α' = 60, 120 + 60 = 180. -/
theorem sestkotnik : alfa 6 = 720 / 6 ∧ (720:ℝ) / 6 = 120 ∧ alfa' 6 = 60 ∧ (120:ℝ) + 60 = 180 := by
  simp only [alfa, alfa', S]; norm_num

/-- Razlaga 7, Premisli: notranji kot raste z n (3 ≤ n < m ⇒ α_n < α_m) … -/
theorem alfa_raste (n m : ℕ) (hn : 3 ≤ n) (hnm : n < m) : alfa n < alfa m := by
  rw [alfa_eq n hn, alfa_eq m (by omega)]
  have h1 : (0:ℝ) < n := by positivity
  have h2 : (n:ℝ) < m := by exact_mod_cast hnm
  have h3 : (360:ℝ) / m < 360 / n := by
    rw [div_lt_div_iff₀ (by linarith) h1]; nlinarith
  linarith

/-- Predpostavke `alfa_raste` se dajo izpolniti (n = 3, m = 4). -/
example : 3 ≤ 3 ∧ 3 < 4 := by norm_num

/-- Razlaga 7, Premisli: … a 180° nikoli ne doseže (zunanji kot je vedno večji od 0°), se mu pa
poljubno približa. Vrednosti 60, 90, 108, 120. -/
theorem alfa_pod_180 (n : ℕ) (hn : 3 ≤ n) :
    alfa n < 180 ∧ 0 < alfa' n ∧ Tendsto alfa atTop (𝓝 180) ∧
    alfa 3 = 60 ∧ alfa 4 = 90 ∧ alfa 5 = 108 ∧ alfa 6 = 120 := by
  have hpos : (0:ℝ) < 360 / n := by positivity
  refine ⟨by rw [alfa_eq n hn]; linarith, hpos, ?_, ?_, ?_, ?_, ?_⟩
  · have h : Tendsto (fun k : ℕ => 180 - 360 / (k:ℝ)) atTop (𝓝 (180 - 0)) :=
      (tendsto_const_div_atTop_nhds_zero_nat 360).const_sub 180
    rw [sub_zero] at h
    refine h.congr' ?_
    filter_upwards [eventually_ge_atTop 3] with k hk
    exact (alfa_eq k hk).symm
  all_goals simp only [alfa, S]; norm_num

/-- Razlaga 8: kota ob osnovnici karakterističnega trikotnika (vsak α/2) in središčni kot 360°/n dajo
skupaj 180°, in središčni kot je enak zunanjemu (oba sta 360/n). -/
theorem karakteristicni (n : ℕ) (hn : 3 ≤ n) :
    alfa n / 2 + alfa n / 2 + 360 / n = 180 ∧ alfa' n = 360 / n :=
  ⟨by rw [alfa_eq n hn]; ring, rfl⟩

/-! ## Rešeni primeri -/

/-- Primer 1: S_7 = (7 − 2) · 180 = 5 · 180 = 900. -/
theorem primer1 : S 7 = 900 := by
  calc S 7 = ((7:ℝ) - 2) * 180 := by simp [S]
    _ = 5 * 180 := by norm_num
    _ = 900 := by norm_num

/-- Primer 2: S_12 = 10 · 180 = 1800, α = 1800/12 = 150; kontrola α' = 360/12 = 30, 180 − 30 = 150;
12 − 3 = 9 diagonal iz oglišča, D_12 = 12 · 9/2 = 54. -/
theorem primer2 :
    S 12 = 10 * 180 ∧ (10:ℝ) * 180 = 1800 ∧ alfa 12 = 1800 / 12 ∧ (1800:ℝ) / 12 = 150 ∧
    alfa' 12 = 30 ∧ (180:ℝ) - 30 = 150 ∧ 12 - 3 = 9 ∧ #(cycleGraph 12)ᶜ.edgeFinset = 12 * 9 / 2 ∧
    12 * 9 / 2 = 54 := by
  refine ⟨?_, by norm_num, ?_, by norm_num, ?_, by norm_num, by norm_num, ?_, by norm_num⟩
  · simp only [S]; norm_num
  · simp only [alfa, S]; norm_num
  · simp only [alfa']; norm_num
  · rw [diagonale 12 (by norm_num)]

/-- Primer 3: α' = 180 − 140 = 40, n = 360/40 = 9; D_9 = 9 · 6/2 = 27. -/
theorem primer3_racuni :
    (180:ℝ) - 140 = 40 ∧ (360:ℝ) / 40 = 9 ∧ #(cycleGraph 9)ᶜ.edgeFinset = 9 * 6 / 2 ∧
    9 * 6 / 2 = 27 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num⟩
  rw [diagonale 9 (by norm_num)]

/-- Primer 3, korak 3: enačba (n − 2) · 180 = 140n ima edino rešitev n = 9
(180n − 360 = 140n, 40n = 360). -/
theorem primer3_enacba (n : ℝ) : (n - 2) * 180 = 140 * n ↔ n = 9 := by
  constructor
  · intro h
    have h1 : 180 * n - 360 = 140 * n := by linarith
    have h2 : 40 * n = 360 := by linarith
    linarith
  · rintro rfl; norm_num

/-- Primer 3: pravilni n-kotnik (n ≥ 3) ima notranji kot 140° natanko tedaj, ko je n = 9; enako
zunanji kot 40° natanko pri n = 9. -/
theorem primer3 (n : ℕ) (hn : 3 ≤ n) : (alfa n = 140 ↔ n = 9) ∧ (alfa' n = 40 ↔ n = 9) := by
  have h0 : (n:ℝ) ≠ 0 := by positivity
  have key : (360:ℝ) / n = 40 ↔ n = 9 := by
    rw [div_eq_iff h0]
    constructor
    · intro h; exact_mod_cast (show (n:ℝ) = 9 by linarith)
    · rintro rfl; norm_num
  refine ⟨?_, key⟩
  rw [alfa_eq n hn, ← key]
  constructor <;> intro h <;> linarith

/-- Primer 4 s Premisli: (n − 2) · 180 = 1440 natanko tedaj, ko je n − 2 = 8, torej n = 10 (desetkotnik);
preizkus 8 · 180 = 1440. -/
theorem primer4 (n : ℕ) : S n = 1440 ↔ n = 10 := by
  simp only [S]
  constructor
  · intro h
    have h8 : (n:ℝ) - 2 = 8 := by linarith
    exact_mod_cast (show (n:ℝ) = 10 by linarith)
  · rintro rfl; norm_num

/-- Primer 4, preizkus: 1440 : 180 = 8 in 8 · 180 = 1440. -/
theorem primer4_preizkus : (1440:ℝ) / 180 = 8 ∧ (8:ℝ) * 180 = 1440 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: n · 180 da za petkotnik 900 in za trikotnik 540, pravilno S_5 = 540, S_3 = 180;
diagonale osemkotnika 8 · 5 = 40 je dvojno štetje, D_8 = 8 · 5/2 = 20, D_8 ≠ 8 − 3; 360/6 = 60 je zunanji
kot, notranji je 180 − 60 = 120; 540 : 5 = 108 velja le za pravilni petkotnik. -/
theorem pogoste_napake :
    (5:ℝ) * 180 = 900 ∧ (3:ℝ) * 180 = 540 ∧ S 5 = 540 ∧ S 3 = 180 ∧ 8 * 5 = 40 ∧
    #(cycleGraph 8)ᶜ.edgeFinset = 8 * 5 / 2 ∧ 8 * 5 / 2 = 20 ∧ #(cycleGraph 8)ᶜ.edgeFinset ≠ 8 - 3 ∧
    (360:ℝ) / 6 = 60 ∧ alfa 6 = 180 - 360 / 6 ∧ (180:ℝ) - 60 = 120 ∧ S 5 / 5 = 108 := by
  have h8 : #(cycleGraph 8)ᶜ.edgeFinset = 20 := by rw [diagonale 8 (by norm_num)]
  refine ⟨by norm_num, by norm_num, ?_, ?_, by norm_num, by rw [h8], by norm_num, by rw [h8]; norm_num,
    by norm_num, alfa_eq 6 (by norm_num), by norm_num, ?_⟩ <;> simp only [S] <;> norm_num

/-- Pogoste napake, Preveri se 2: romb s kotom 70° ima sosednji kot 180 − 70 = 110, ki ni enak 70, zato
koti niso vsi enaki. -/
theorem romb : (180:ℝ) - 70 = 110 ∧ (70:ℝ) ≠ 110 := by norm_num

/-! ## Drugače -/

/-- Na sliki: petkotnik razpade na 3 trikotnike, 3 · 180 = 540; pri šestkotniku 4, pri sedemkotniku 5
trikotnikov. -/
theorem na_sliki : (5 - 2 = 3 ∧ (3:ℝ) * 180 = 540) ∧ 6 - 2 = 4 ∧ 7 - 2 = 5 := by norm_num

/-- Iz vsakdanjega življenja, tlakovanje: 4 · 90 = 360, 6 · 60 = 360, 3 · 120 = 360; pravilni petkotnik ima
kot 108°, in 360 : 108 ni celo število. -/
theorem tlakovanje :
    (4:ℝ) * 90 = 360 ∧ (6:ℝ) * 60 = 360 ∧ (3:ℝ) * 120 = 360 ∧ alfa 5 = 108 ∧
    ¬ ∃ k : ℕ, (k:ℝ) * 108 = 360 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by simp only [alfa, S]; norm_num, ?_⟩
  rintro ⟨k, hk⟩
  have hk' : k * 108 = 360 := by exact_mod_cast hk
  omega

/-- Korak za korakom (pravilni petkotnik): 5 − 2 = 3, 3 · 180 = 540, 540 : 5 = 108, 360 : 5 = 72,
108 + 72 = 180, 5 − 3 = 2, D_5 = 5 · 2/2 = 5. -/
theorem petkotnik :
    5 - 2 = 3 ∧ (3:ℝ) * 180 = 540 ∧ (540:ℝ) / 5 = 108 ∧ alfa 5 = 108 ∧ alfa' 5 = 72 ∧
    (108:ℝ) + 72 = 180 ∧ 5 - 3 = 2 ∧ #(cycleGraph 5)ᶜ.edgeFinset = 5 * 2 / 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_, by norm_num, by norm_num, ?_⟩
  · simp only [alfa, S]; norm_num
  · simp only [alfa']; norm_num
  · rw [diagonale 5 (by norm_num)]

/-- Korak za korakom, tabela pravilnih večkotnikov: (α, α') = (60, 120), (90, 90), (120, 60), (135, 45),
(144, 36) za n = 3, 4, 6, 8, 10; v vsaki vrstici je vsota 180. -/
theorem tabela_pravilnih :
    (alfa 3 = 60 ∧ alfa' 3 = 120) ∧ (alfa 4 = 90 ∧ alfa' 4 = 90) ∧ (alfa 6 = 120 ∧ alfa' 6 = 60) ∧
    (alfa 8 = 135 ∧ alfa' 8 = 45) ∧ (alfa 10 = 144 ∧ alfa' 10 = 36) := by
  simp only [alfa, alfa', S]; norm_num

/-- Bolj natančno: parov oglišč (povezav polnega grafa) je n(n − 1)/2, med njimi je n stranic, ostale so
diagonale: D_n = n(n − 1)/2 − n (n ≥ 3). -/
theorem diagonale_drugace (m : ℕ) :
    #(⊤ : SimpleGraph (Fin (m + 3))).edgeFinset = (m + 3) * (m + 3 - 1) / 2 ∧
    #(cycleGraph (m + 3)).edgeFinset = m + 3 ∧
    #(cycleGraph (m + 3))ᶜ.edgeFinset = (m + 3) * (m + 3 - 1) / 2 - (m + 3) := by
  have h1 : #(⊤ : SimpleGraph (Fin (m + 3))).edgeFinset = (m + 3) * (m + 3 - 1) / 2 := by
    rw [card_edgeFinset_top_eq_card_choose_two, Fintype.card_fin, Nat.choose_two_right]
  refine ⟨h1, stranice m, ?_⟩
  have h2 := dvakrat_diagonale m
  have h3 : (m + 3) * (m + 3 - 1) = (m + 3) * m + 2 * (m + 3) := by
    rw [show m + 3 - 1 = m + 2 by omega]; ring
  rw [h3]
  omega

/-- Bolj natančno: n(n − 1)/2 − n = (n² − 3n)/2 = n(n − 3)/2 (računano v ℝ). -/
theorem diagonale_racun (n : ℝ) : n * (n - 1) / 2 - n = (n ^ 2 - 3 * n) / 2 ∧
    (n ^ 2 - 3 * n) / 2 = n * (n - 3) / 2 := ⟨by ring, by ring⟩

/-! ## Preveri se -/

/-- Preveri se 1: vsota je (n − 2) · 180, ne n · 180 (razlika 360) in ne 360 (velja le za n = 4). -/
theorem preveri1 (n : ℕ) : (n:ℝ) * 180 - S n = 360 ∧ (S n = 360 ↔ n = 4) := by
  refine ⟨by simp only [S]; ring, ?_⟩
  simp only [S]
  constructor
  · intro h; exact_mod_cast (show (n:ℝ) = 4 by linarith)
  · rintro rfl; norm_num

/-- Preveri se 4: α = 6 · 180/8 = 1080/8 = 135; napačni odgovori: 360/8 = 45 (zunanji kot), 1080 (vsota),
8 · 180/8 = 180. -/
theorem preveri4 :
    alfa 8 = 6 * 180 / 8 ∧ (6:ℝ) * 180 / 8 = 1080 / 8 ∧ (1080:ℝ) / 8 = 135 ∧ alfa' 8 = 45 ∧
    (180:ℝ) - 45 = 135 ∧ S 8 = 1080 ∧ (8:ℝ) * 180 / 8 = 180 := by
  refine ⟨?_, by norm_num, by norm_num, ?_, by norm_num, ?_, by norm_num⟩
  · simp only [alfa, S]; norm_num
  · simp only [alfa']; norm_num
  · simp only [S]; norm_num

/-- Preveri se 5: D_7 = 7 · 4/2 = 14; napačna odgovora 7 · 4 = 28 in 7 − 3 = 4. -/
theorem preveri5 :
    #(cycleGraph 7)ᶜ.edgeFinset = 7 * 4 / 2 ∧ 7 * 4 / 2 = 14 ∧ 7 * 4 = 28 ∧ 7 - 3 = 4 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [diagonale 7 (by norm_num)]

end Evklid.Lekcije.MAT_OS_8.Veckotniki
