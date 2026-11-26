/-
vir: content/lessons/MAT-OS-7/premo-sorazmerje.md
sha256: 8cc917a31f5b2f4044d3d3aaec830c546a36c37069080d97dd2b62688e0216d8
Model: zveza med količinama je funkcija f : ℝ → ℝ (x ↦ y). Premo sorazmerje je `premo f`: obstaja k, da je
f x = k · x za vsak x (koeficient sorazmernosti k). Pravilo »kolikokrat povečamo eno, tolikokrat se poveča druga«
je f (t · x) = t · f x za vse t, x in je dokazano enakovredno definiciji (`pravilo`). Graf je množica točk
(x, f x); »premica skozi točki« je f x = m · x + n. Rešeni primeri so dokazani dvakrat: kot račun po korakih lekcije
in kot enoličnost (vsaka premo sorazmerna zveza z danim parom da isti rezultat). Enote (cm, km, l, €, h) so le v
docstringih, decimalna števila so točni ulomki v ℝ (2,5 = 5/2).
Lean: x/0 = 0; vsi količniki y : x imajo x ≠ 0 (pogoj je zapisan, kjer ga trditev potrebuje).
Ni v Leanu: zgodbe in uvodni prizori kot opis (dokazani so njihovi računi); simulacija »Premo sorazmerje« in risanje
grafa z ravnilom; »točke ležijo na isti premici« kot slika (dokazano je, da so vse točke na grafu y = k · x in da
graf gre skozi (0, 0)); »starost in višina otroka« (Pogoste napake, ni matematičnih podatkov); nasvet »vprašaj se,
kaj iščeš« in preizkus smiselnosti kot navodilo (dokazane so neenakosti 35 > 21, 12 > 7,5); opisi napačnih
odgovorov v kvizih (dokazano je, da napačne vrednosti niso rezultat); da je pri hoji oz. vožnji vlaka zveza premo
sorazmerna (predpostavka naloge, v trditvah je hipoteza `premo`); »1,8 h = obratno sorazmerje« kot razlaga napake
(dokazano je le 3 · 240 : 400 = 1,8 ≠ 5).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.PremoSorazmerje

/-- Premo sorazmerje: obstaja koeficient k, da je y = k · x za vsak x. -/
def premo (f : ℝ → ℝ) : Prop := ∃ k : ℝ, ∀ x, f x = k * x

/-! ## Razlaga -/

/-- Razlaga (Pravilo) in Povzetek 1: zveza je premo sorazmerna (y = k · x) natanko tedaj, ko velja »kolikokrat
povečamo (ali zmanjšamo) x, tolikokrat se poveča (ali zmanjša) y«: f (t · x) = t · f x za vse t in x. -/
theorem pravilo (f : ℝ → ℝ) : premo f ↔ ∀ t x, f (t * x) = t * f x := by
  constructor
  · rintro ⟨k, hk⟩ t x
    rw [hk, hk]; ring
  · intro h
    refine ⟨f 1, fun x => ?_⟩
    have := h x 1
    rw [mul_one] at this
    rw [this]; ring

/-- Razlaga (Tabela), Povzetek 2 in 3, Primer 1 (formula): za x ≠ 0 je točka (x, y) na zvezi y = k · x natanko
tedaj, ko je količnik y : x enak k. Test tabele: če je v vseh stolpcih (x ≠ 0) y : x = k, ležijo vsi pari na
y = k · x, in obratno. -/
theorem kolicnik (k x y : ℝ) (hx : x ≠ 0) : y / x = k ↔ y = k * x := by
  rw [div_eq_iff hx]

/-- Predpostavka trditve `kolicnik` se da izpolniti (x = 2). -/
example : (2 : ℝ) ≠ 0 := two_ne_zero

/-- Razlaga (Tabela) in Povzetek 2: k je vrednost za 1 enoto: pri y = k · x je y pri x = 1 enak k, in
količnik y : x je pri vsakem x ≠ 0 enak k. -/
theorem k_za_enoto (f : ℝ → ℝ) (k : ℝ) (hf : ∀ x, f x = k * x) : f 1 = k ∧ ∀ x, x ≠ 0 → f x / x = k := by
  refine ⟨by rw [hf]; ring, fun x hx => ?_⟩
  rw [hf, mul_div_assoc, div_self hx, mul_one]

/-- Predpostavka trditve `k_za_enoto` se da izpolniti (f x = 2x, k = 2). -/
example : ∀ x : ℝ, (fun x : ℝ => 2 * x) x = 2 * x := fun _ => rfl

/-- Razlaga (Graf), premisli 2, Povzetek 4, Pogoste napake 4: graf premega sorazmerja gre skozi izhodišče
(f 0 = 0); zveza, katere graf zgreši izhodišče (f 0 ≠ 0), ni premo sorazmerna. -/
theorem izhodisce (f : ℝ → ℝ) (hf : premo f) : f 0 = 0 := by
  obtain ⟨k, hk⟩ := hf
  rw [hk, mul_zero]

/-- Predpostavka trditve `izhodisce` se da izpolniti (f x = 2x). -/
example : premo (fun x => 2 * x) := ⟨2, fun _ => rfl⟩

/-- Pogoste napake 4 (obrat `izhodisce`): če f 0 ≠ 0, zveza ni premo sorazmerna. -/
theorem ne_skozi_izhodisce (f : ℝ → ℝ) (h : f 0 ≠ 0) : ¬ premo f := fun hf => h (izhodisce f hf)

/-- Predpostavka trditve `ne_skozi_izhodisce` se da izpolniti (taksi: f x = 3 + x, f 0 = 3). -/
example : (fun x : ℝ => 3 + x) 0 ≠ 0 := by norm_num

/-- Razlaga (Graf) in Povzetek 4: večji k pomeni strmejšo premico: pri k₁ < k₂ je za vsak x > 0 vrednost
k₁ · x manjša od k₂ · x (premica s k₂ se dviga hitreje). -/
theorem strmina (k₁ k₂ x : ℝ) (hk : k₁ < k₂) (hx : 0 < x) : k₁ * x < k₂ * x :=
  mul_lt_mul_of_pos_right hk hx

/-- Predpostavke trditve `strmina` se dajo izpolniti (k₁ = 2, k₂ = 5, x = 1: zemljevid 2 km proti 5 km). -/
example : (2 : ℝ) < 5 ∧ (0 : ℝ) < 1 := by norm_num

/-- Razlaga (Sklepni račun), Povzetek 5: iz enega znanega para (x₀, f x₀) z x₀ ≠ 0 dobimo vse vrednosti: najprej
sklep na enoto (f x₀ : x₀ = k), nato množenje z želenim številom enot. -/
theorem sklepni_racun (f : ℝ → ℝ) (hf : premo f) (x₀ : ℝ) (h0 : x₀ ≠ 0) : ∀ x, f x = (f x₀ / x₀) * x := by
  obtain ⟨k, hk⟩ := hf
  intro x
  rw [hk x, hk x₀, mul_div_assoc, div_self h0, mul_one]

/-- Predpostavke trditve `sklepni_racun` se dajo izpolniti (f x = 2x, x₀ = 1). -/
example : premo (fun x => 2 * x) ∧ (1 : ℝ) ≠ 0 := ⟨⟨2, fun _ => rfl⟩, one_ne_zero⟩

/-- Pomožno (enoličnost): če je zveza premo sorazmerna in f x₀ = y₀ (x₀ ≠ 0), je f x = (y₀ : x₀) · x. -/
theorem iz_para (f : ℝ → ℝ) (hf : premo f) {x₀ y₀ : ℝ} (h0 : x₀ ≠ 0) (h : f x₀ = y₀) (x : ℝ) :
    f x = (y₀ / x₀) * x := by
  rw [sklepni_racun f hf x₀ h0 x, h]

/-- Predpostavke trditve `iz_para` se dajo izpolniti (f x = 2,5x, x₀ = 2, y₀ = 5). -/
example : premo (fun x => 5 / 2 * x) ∧ (2 : ℝ) ≠ 0 ∧ (fun x : ℝ => 5 / 2 * x) 2 = 5 :=
  ⟨⟨5 / 2, fun _ => rfl⟩, two_ne_zero, by norm_num⟩

/-! ## Zakaj se tega učimo, past s taksijem, premisli -/

/-- Zakaj se tega učimo: zemljevid 1 cm → 2 km da 3 cm → 6 km in 6 cm → 12 km; gorivo 1,60 € za liter da
20 l → 32 € in 40 l → 64 €. -/
theorem uvod : (2 : ℝ) * 3 = 6 ∧ (2 : ℝ) * 6 = 12 ∧ (1.60 : ℝ) * 20 = 32 ∧ (1.60 : ℝ) * 40 = 64 := by
  norm_num

/-- Razlaga (past), Pogoste napake 1, Povzetek 6: taksi (3 € vstopnine in 1 € na km, f x = 3 + 1 · x) da
5 km → 8 €, 10 km → 13 €; cena raste s potjo, a pot se podvoji, cena pa ne (13 ≠ 2 · 8), zato zveza ni premo
sorazmerna. -/
theorem taksi :
    (3 : ℝ) + 1 * 5 = 8 ∧ (3 : ℝ) + 1 * 10 = 13 ∧ (13 : ℝ) ≠ 2 * 8 ∧
      StrictMono (fun x : ℝ => 3 + 1 * x) ∧ ¬ premo (fun x : ℝ => 3 + 1 * x) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun a b h => by simp only; linarith, ?_⟩
  exact ne_skozi_izhodisce _ (by norm_num)

/-- Premisli 1 (avtobus, 1,50 € na postajo, brez vstopnine): 5 postaj stane 7,50 €, 10 postaj 15 € = 2 · 7,50 €;
0 postaj stane 0 €; zveza je premo sorazmerna. -/
theorem avtobus :
    (1.50 : ℝ) * 5 = 7.50 ∧ (1.50 : ℝ) * 10 = 15 ∧ (15 : ℝ) = 2 * 7.50 ∧ (1.50 : ℝ) * 0 = 0 ∧
      premo (fun x : ℝ => 1.50 * x) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ⟨1.50, fun _ => rfl⟩⟩

/-- Razlaga (Tabela, Graf): pri zemljevidu 1 cm → 2 km so količniki 2 : 1 = 4 : 2 = 6 : 3 = 2; točke (1, 2), (2, 4),
(3, 6) in (0, 0) so na grafu y = 2x. -/
theorem tabela :
    (2 : ℝ) / 1 = 2 ∧ (4 : ℝ) / 2 = 2 ∧ (6 : ℝ) / 3 = 2 ∧
      (2 : ℝ) * 1 = 2 ∧ (2 : ℝ) * 2 = 4 ∧ (2 : ℝ) * 3 = 6 ∧ (2 : ℝ) * 0 = 0 := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1, korak 1–3: količniki 5 : 2 = 10 : 4 = 15 : 6 = 2,5, zato k = 2,5; za 10 cm je 2,5 · 10 = 25 km. -/
theorem primer1 : (5 : ℝ) / 2 = 2.5 ∧ (10 : ℝ) / 4 = 2.5 ∧ (15 : ℝ) / 6 = 2.5 ∧ (2.5 : ℝ) * 10 = 25 := by
  norm_num

/-- Primer 1 (sklep iz tabele): vsi trije pari (2, 5), (4, 10), (6, 15) imajo isti količnik k = 2,5 (5 = k · 2,
10 = k · 4, 15 = k · 6), zato je tabela del premo sorazmerne zveze y = 2,5 · x. -/
theorem primer1_premo : ∃ k : ℝ, (5 : ℝ) = k * 2 ∧ (10 : ℝ) = k * 4 ∧ (15 : ℝ) = k * 6 ∧
    premo (fun x => k * x) := ⟨2.5, by norm_num, by norm_num, by norm_num, ⟨2.5, fun _ => rfl⟩⟩

/-- Primer 1 (enoličnost): vsi trije pari (2, 5), (4, 10), (6, 15) ležijo na y = 2,5 · x; in vsaka premo
sorazmerna zveza s f 2 = 5 da f 10 = 25. -/
theorem primer1_enolicno (f : ℝ → ℝ) (hf : premo f) (h : f 2 = 5) :
    f 4 = 10 ∧ f 6 = 15 ∧ f 10 = 25 := by
  have e := iz_para f hf two_ne_zero h
  refine ⟨?_, ?_, ?_⟩
  · rw [e]; norm_num
  · rw [e]; norm_num
  · calc f 10 = 5 / 2 * 10 := e 10
      _ = 2.5 * 10 := by norm_num
      _ = 25 := by norm_num

/-- Predpostavke trditve `primer1_enolicno` se dajo izpolniti (f x = 2,5x). -/
example : premo (fun x => 2.5 * x) ∧ (fun x : ℝ => 2.5 * x) 2 = 5 := ⟨⟨2.5, fun _ => rfl⟩, by norm_num⟩

/-- Primer 2, korak 1–3: sklep na enoto 21 : 300 = 0,07 l na km, nato 0,07 · 500 = 35 l; smiselnost 35 > 21. -/
theorem primer2 : (21 : ℝ) / 300 = 0.07 ∧ (0.07 : ℝ) * 500 = 35 ∧ (35 : ℝ) > 21 := by norm_num

/-- Primer 2 (enoličnost): pri enakomerni porabi (poraba premo sorazmerna s potjo) in f 300 = 21 je f 500 = 35. -/
theorem primer2_enolicno (f : ℝ → ℝ) (hf : premo f) (h : f 300 = 21) : f 500 = 35 := by
  calc f 500 = 21 / 300 * 500 := iz_para f hf (by norm_num) h 500
    _ = 0.07 * 500 := by norm_num
    _ = 35 := by norm_num

/-- Predpostavke trditve `primer2_enolicno` se dajo izpolniti (f x = 0,07x). -/
example : premo (fun x => 0.07 * x) ∧ (fun x : ℝ => 0.07 * x) 300 = 21 := ⟨⟨0.07, fun _ => rfl⟩, by norm_num⟩

/-- Primer 3, korak 1–4: 15 : 6 = 2,5; 8,4 · 2,5 = 21 km; 21 : 4 = 5,25 h; 0,25 · 60 = 15 min; 5,25 h = 5 h 15 min. -/
theorem primer3 : (15 : ℝ) / 6 = 2.5 ∧ (8.4 : ℝ) * 2.5 = 21 ∧ (21 : ℝ) / 4 = 5.25 ∧ (0.25 : ℝ) * 60 = 15 ∧
    (5.25 : ℝ) = 5 + 15 / 60 := by norm_num

/-- Primer 3 (enoličnost): zemljevid f (cm → km) je premo sorazmeren s f 6 = 15, čas hoje g (km → h) premo
sorazmeren z g 4 = 1; potem je f 8,4 = 21 in g 21 = 5,25 = 5 + 15/60 ur. -/
theorem primer3_enolicno (f g : ℝ → ℝ) (hf : premo f) (hg : premo g) (h1 : f 6 = 15) (h2 : g 4 = 1) :
    f 8.4 = 21 ∧ g (f 8.4) = 5.25 ∧ g (f 8.4) = 5 + 15 / 60 := by
  have e1 : f 8.4 = 21 := by
    calc f 8.4 = 15 / 6 * 8.4 := iz_para f hf (by norm_num) h1 8.4
      _ = 8.4 * 2.5 := by norm_num
      _ = 21 := by norm_num
  have e2 : g 21 = 5.25 := by
    calc g 21 = 1 / 4 * 21 := iz_para g hg (by norm_num) h2 21
      _ = 21 / 4 := by norm_num
      _ = 5.25 := by norm_num
  refine ⟨e1, by rw [e1, e2], by rw [e1, e2]; norm_num⟩

/-- Predpostavke trditve `primer3_enolicno` se dajo izpolniti (f x = 2,5x, g x = x/4). -/
example : premo (fun x => 2.5 * x) ∧ premo (fun x => 1 / 4 * x) ∧ (fun x : ℝ => 2.5 * x) 6 = 15 ∧
    (fun x : ℝ => 1 / 4 * x) 4 = 1 := ⟨⟨2.5, fun _ => rfl⟩, ⟨1 / 4, fun _ => rfl⟩, by norm_num, by norm_num⟩

/-- Primer 4, korak 1: premica y = m · x + n, ki gre skozi izhodišče, je premo sorazmerje (n = 0). -/
theorem premica_skozi_izhodisce (f : ℝ → ℝ) (m n : ℝ) (hf : ∀ x, f x = m * x + n) (h0 : f 0 = 0) : premo f := by
  refine ⟨m, fun x => ?_⟩
  have : n = 0 := by rw [hf] at h0; linarith
  rw [hf, this, add_zero]

/-- Predpostavke trditve `premica_skozi_izhodisce` se dajo izpolniti (f x = 0,06x + 0). -/
example : (∀ x : ℝ, (fun x : ℝ => 0.06 * x) x = 0.06 * x + 0) ∧ (fun x : ℝ => 0.06 * x) 0 = 0 :=
  ⟨fun _ => by ring, by norm_num⟩

/-- Primer 4, korak 2 in premisli 3: 9 : 150 = 0,06 l na km, 0,06 · 350 = 21 l, preizkus 21 : 350 = 0,06. -/
theorem primer4 : (9 : ℝ) / 150 = 0.06 ∧ (0.06 : ℝ) * 350 = 21 ∧ (21 : ℝ) / 350 = 0.06 := by norm_num

/-- Primer 4 (enoličnost): graf je premica skozi (0, 0) in (150, 9), torej je f 350 = 21. -/
theorem primer4_enolicno (f : ℝ → ℝ) (m n : ℝ) (hf : ∀ x, f x = m * x + n) (h0 : f 0 = 0) (h : f 150 = 9) :
    f 350 = 21 := by
  have hp := premica_skozi_izhodisce f m n hf h0
  calc f 350 = 9 / 150 * 350 := iz_para f hp (by norm_num) h 350
    _ = 0.06 * 350 := by norm_num
    _ = 21 := by norm_num

/-- Predpostavke trditve `primer4_enolicno` se dajo izpolniti (f x = 0,06x). -/
example : (∀ x : ℝ, (fun x : ℝ => 0.06 * x) x = 0.06 * x + 0) ∧ (fun x : ℝ => 0.06 * x) 0 = 0 ∧
    (fun x : ℝ => 0.06 * x) 150 = 9 := ⟨fun _ => by ring, by norm_num, by norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 2: pri f 2 = 5 je f 4 = 10 (množenje z 2), ne 7 (prištevanje 2). -/
theorem napaka_pristevanje (f : ℝ → ℝ) (hf : premo f) (h : f 2 = 5) : f 4 = 10 ∧ f 4 ≠ 7 := by
  have e : f 4 = 10 := by rw [iz_para f hf two_ne_zero h]; norm_num
  exact ⟨e, by rw [e]; norm_num⟩

/-- Predpostavke trditve `napaka_pristevanje` se dajo izpolniti (f x = 2,5x). -/
example : premo (fun x => 2.5 * x) ∧ (fun x : ℝ => 2.5 * x) 2 = 5 := ⟨⟨2.5, fun _ => rfl⟩, by norm_num⟩

/-- Pogoste napake 3: deljenje v napačno smer da drugo število: 300 : 21 ≠ 21 : 300. -/
theorem napaka_smer : (300 : ℝ) / 21 ≠ 21 / 300 := by norm_num

/-- Pogoste napake 5: pri istem koeficientu k > 0 je na krajši poti (0 < x₁ < x₂) skupna poraba manjša. -/
theorem napaka_stalna_poraba (k x₁ x₂ : ℝ) (hk : 0 < k) (h : x₁ < x₂) : k * x₁ < k * x₂ :=
  mul_lt_mul_of_pos_left h hk

/-- Predpostavke trditve `napaka_stalna_poraba` se dajo izpolniti (k = 0,06, x₁ = 150, x₂ = 350). -/
example : (0 : ℝ) < 0.06 ∧ (150 : ℝ) < 350 := by norm_num

/-! ## Drugače -/

/-- Kot zgodba: 2 cm → 1 km, torej 1 cm → 0,5 km in 9 cm → 4,5 km (ne 9 km); pri 3 km na uro je čas
4,5 : 3 = 1,5 h; 0 cm → 0 km in 0 minut hoje, dvakrat daljša pot na zemljevidu → dvakrat daljša pot in dvakrat
daljša hoja (g ∘ f: cm → km → h). -/
theorem zgodba (f g : ℝ → ℝ) (hf : premo f) (hg : premo g) (h1 : f 2 = 1) (h2 : g 3 = 1) :
    f 1 = 0.5 ∧ f 9 = 4.5 ∧ f 9 ≠ 9 ∧ g 4.5 = 1.5 ∧ (4.5 : ℝ) / 3 = 1.5 ∧ f 0 = 0 ∧
      (∀ x, f (2 * x) = 2 * f x) ∧ g (f 0) = 0 ∧ ∀ x, g (f (2 * x)) = 2 * g (f x) := by
  have e := iz_para f hf two_ne_zero h1
  have eg := iz_para g hg (by norm_num) h2
  have e9 : f 9 = 4.5 := by rw [e]; norm_num
  refine ⟨by rw [e]; norm_num, e9, by rw [e9]; norm_num, by rw [eg]; norm_num, by norm_num,
    izhodisce f hf, fun x => (pravilo f).mp hf 2 x, by rw [izhodisce f hf, izhodisce g hg], fun x => ?_⟩
  rw [(pravilo f).mp hf 2 x, (pravilo g).mp hg 2 (f x)]

/-- Predpostavke trditve `zgodba` se dajo izpolniti (f x = x/2, g x = x/3). -/
example : premo (fun x => 1 / 2 * x) ∧ premo (fun x => 1 / 3 * x) ∧ (fun x : ℝ => 1 / 2 * x) 2 = 1 ∧
    (fun x : ℝ => 1 / 3 * x) 3 = 1 := ⟨⟨1 / 2, fun _ => rfl⟩, ⟨1 / 3, fun _ => rfl⟩, by norm_num, by norm_num⟩

/-- Korak za korakom (pot 1 in 2): 7,50 : 5 = 1,50 €, 1,50 · 8 = 12 €, k = 1,50 in y = 1,50 · x; preizkus
12 > 7,50. -/
theorem vozovnice : (7.50 : ℝ) / 5 = 1.50 ∧ (1.50 : ℝ) * 8 = 12 ∧ (12 : ℝ) > 7.50 := by norm_num

/-- Korak za korakom (enoličnost): vsaka premo sorazmerna cena s f 5 = 7,50 da f 1 = 1,50 in f 8 = 12. -/
theorem vozovnice_enolicno (f : ℝ → ℝ) (hf : premo f) (h : f 5 = 7.50) : f 1 = 1.50 ∧ f 8 = 12 := by
  have e := iz_para f hf (by norm_num) h
  refine ⟨by rw [e]; norm_num, ?_⟩
  calc f 8 = 7.50 / 5 * 8 := e 8
    _ = 1.50 * 8 := by norm_num
    _ = 12 := by norm_num

/-- Predpostavke trditve `vozovnice_enolicno` se dajo izpolniti (f x = 1,50x). -/
example : premo (fun x => 1.50 * x) ∧ (fun x : ℝ => 1.50 * x) 5 = 7.50 := ⟨⟨1.50, fun _ => rfl⟩, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: pri premem sorazmerju (pot od časa) se v dvakrat daljšem času prevozi dvakrat daljša pot; ne
pa polovica (pri f t ≠ 0); zveza, ki se začne pri 10 km (f 0 = 10), ni premo sorazmerna. -/
theorem kviz1 (f : ℝ → ℝ) (hf : premo f) (t : ℝ) (ht : f t ≠ 0) :
    f (2 * t) = 2 * f t ∧ f (2 * t) ≠ f t / 2 ∧ ∀ g : ℝ → ℝ, g 0 = 10 → ¬ premo g := by
  have e := (pravilo f).mp hf 2 t
  refine ⟨e, fun h => ht (by linarith), fun g hg => ne_skozi_izhodisce g (by rw [hg]; norm_num)⟩

/-- Predpostavke trditve `kviz1` se dajo izpolniti (f t = 60t, t = 1). -/
example : premo (fun t => 60 * t) ∧ (fun t : ℝ => 60 * t) 1 ≠ 0 := ⟨⟨60, fun _ => rfl⟩, by norm_num⟩

/-- Preveri se 2: koeficienti 5 > 2 > 0,5, zato je pri vsakem x > 0 premica B (k = 5) nad A (k = 2) nad C
(k = 0,5): vrstni red od najbolj strme je B, A, C. -/
theorem kviz2 (x : ℝ) (hx : 0 < x) : (0.5 : ℝ) * x < 2 * x ∧ (2 : ℝ) * x < 5 * x :=
  ⟨strmina _ _ _ (by norm_num) hx, strmina _ _ _ (by norm_num) hx⟩

/-- Predpostavka trditve `kviz2` se da izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Preveri se 3: f 300 = 18 da na tretjini poti f 100 = 18 : 3 = 6 l (ne 15, ne 54, ne 18). -/
theorem kviz3 (f : ℝ → ℝ) (hf : premo f) (h : f 300 = 18) :
    f (300 / 3) = 6 ∧ (18 : ℝ) / 3 = 6 ∧ f (300 / 3) ≠ 15 ∧ f (300 / 3) ≠ 54 ∧ f (300 / 3) ≠ 18 := by
  have e : f (300 / 3) = 6 := by rw [iz_para f hf (by norm_num) h]; norm_num
  rw [e]; norm_num

/-- Predpostavke trditve `kviz3` se dajo izpolniti (f x = 0,06x). -/
example : premo (fun x => 0.06 * x) ∧ (fun x : ℝ => 0.06 * x) 300 = 18 := ⟨⟨0.06, fun _ => rfl⟩, by norm_num⟩

/-- Preveri se 4: f 4 = 10 da 1 cm → 10 : 4 = 2,5 km in 7 cm → 7 · 2,5 = 17,5 km (ne 13, ne 28 = 7 · 4, ne 2,8
= 7 · 0,4 z obrnjenim deljenjem 4 : 10 = 0,4). -/
theorem kviz4 (f : ℝ → ℝ) (hf : premo f) (h : f 4 = 10) :
    f 7 = 17.5 ∧ (10 : ℝ) / 4 = 2.5 ∧ (7 : ℝ) * 2.5 = 17.5 ∧ (4 : ℝ) / 10 = 0.4 ∧ (7 : ℝ) * 0.4 = 2.8 ∧
      (7 : ℝ) * 4 = 28 ∧ f 7 ≠ 13 ∧ f 7 ≠ 28 ∧ f 7 ≠ 2.8 := by
  have e : f 7 = 17.5 := by rw [iz_para f hf (by norm_num) h]; norm_num
  rw [e]; norm_num

/-- Predpostavke trditve `kviz4` se dajo izpolniti (f x = 2,5x). -/
example : premo (fun x => 2.5 * x) ∧ (fun x : ℝ => 2.5 * x) 4 = 10 := ⟨⟨2.5, fun _ => rfl⟩, by norm_num⟩

/-- Preveri se 5: čas je premo sorazmeren s potjo, g 240 = 3; v 1 uri vlak prevozi 240 : 3 = 80 km, za 400 km
potrebuje 400 : 80 = 5 h (ne 1,8 = 3 · 240 : 400 in ne 4); 160 km traja 160 : 80 = 2 h. -/
theorem kviz5 (g : ℝ → ℝ) (hg : premo g) (h : g 240 = 3) :
    g 400 = 5 ∧ (240 : ℝ) / 3 = 80 ∧ (400 : ℝ) / 80 = 5 ∧ (160 : ℝ) / 80 = 2 ∧ (3 : ℝ) * 240 / 400 = 1.8 ∧
      g 400 ≠ 1.8 ∧ g 400 ≠ 4 := by
  have e : g 400 = 5 := by rw [iz_para g hg (by norm_num) h]; norm_num
  rw [e]; norm_num

/-- Predpostavke trditve `kviz5` se dajo izpolniti (g x = x/80). -/
example : premo (fun x => 1 / 80 * x) ∧ (fun x : ℝ => 1 / 80 * x) 240 = 3 := ⟨⟨1 / 80, fun _ => rfl⟩, by norm_num⟩

end Evklid.Lekcije.MAT_OS_7.PremoSorazmerje
