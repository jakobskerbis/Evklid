/-
vir: content/lessons/MAT-OS-6/sklepni-racun.md
sha256: 6a41aa534f547cdf62a3e21160de44edf59d19e39db77e7389e4f2cd5e6dcb5f
Model: »z več kosi se poveča tudi cena« je zveza f : ℝ → ℝ (količina ↦ cena) z `premo f`: obstaja cena za
eno enoto k, da je f x = k · x za vsak x. »Stalni znesek si deli več ljudi« je `delitev p C`: za vsako
število ljudi n ≠ 0 je n · p n = C (vsi skupaj plačajo stalni znesek C). Rešeni primeri so dokazani kot
enoličnost: vsaka zveza tega tipa z danim znanim parom da isti rezultat, vmesni koraki pa so vrstice `calc`.
Decimalna števila so točni ulomki v ℝ (4,50 = 9/2); enote (€, kg, g, lakti, zlatniki) so le v docstringih.
Lean: x/0 = 0, zato imajo trditve, ki delijo s številom kosov ali ljudi, pogoj ≠ 0.
Ni v Leanu: zgodovina (italijanski trgovci, Fibonacci, Liber Abaci, Benetke) in raba v vsakdanu (opis); da so v
nalogah zveze res premo sorazmerne oz. delitev stalnega zneska (predpostavka naloge, v trditvah je hipoteza
`premo` oz. `delitev`); kviz 1 kot razvrstitev vsakdanjih primerov (dokazano: pri `premo` se vrednost podvoji,
pri `delitev` s C ≠ 0 se razpolovi in ne podvoji); urejanje tabele in »vprašanje pred računom« kot navodilo
(dokazana so pravila deljenja in množenja obeh strani in smer spremembe); simulacija (dokazano je pravilo
podvojitve); »množimo z decimalnim številom tako kot z naravnim« (navodilo).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.SklepniRacun

/-- Več kosov, višja cena: obstaja cena enote k, da je f x = k · x. -/
def premo (f : ℝ → ℝ) : Prop := ∃ k : ℝ, ∀ x, f x = k * x

/-- Stalni znesek C si enakomerno deli n ljudi: n · p n = C za vsak n ≠ 0. -/
def delitev (p : ℝ → ℝ) (C : ℝ) : Prop := ∀ n, n ≠ 0 → n * p n = C

/-! ## Razlaga -/

/-- Razlaga (sklep na enoto), Povzetek 4: če poznamo ceno x₀ ≠ 0 kosov, je cena enega kosa f x₀ : x₀, cena x kosov
pa x · (f x₀ : x₀); najprej delimo, nato množimo.
trditev: MAT-OS-6/sklepni-racun#sklep-na-enoto
besedilo: »Če se z več kosi poveča tudi cena: najprej delimo (cena enega kosa), nato množimo.« -/
theorem sklep_na_enoto (f : ℝ → ℝ) (hf : premo f) (x₀ : ℝ) (h0 : x₀ ≠ 0) (x : ℝ) :
    f 1 = f x₀ / x₀ ∧ f x = x * (f x₀ / x₀) := by
  obtain ⟨k, hk⟩ := hf
  rw [hk, hk, hk, mul_div_assoc, div_self h0]
  constructor <;> ring

example := sklep_na_enoto (fun x => 3 / 2 * x) ⟨3 / 2, fun _ => rfl⟩ 3 three_ne_zero 5

/-- Razlaga (Tabela), Povzetek 3: kar naredimo z eno stranjo vrstice, naredimo z drugo: če je (x, f x) vrstica
tabele, je tudi (t · x, t · f x) vrstica (množenje ali deljenje obeh strani z istim številom).
trditev: MAT-OS-6/sklepni-racun#obe-strani
besedilo: »Kar narediš na levi strani, narediš tudi na desni.« -/
theorem obe_strani (f : ℝ → ℝ) (hf : premo f) (t x : ℝ) : f (t * x) = t * f x := by
  obtain ⟨k, hk⟩ := hf
  rw [hk, hk]; ring

example := obe_strani (fun x => 3 / 2 * x) ⟨3 / 2, fun _ => rfl⟩ 2 3

/-- Pogoste napake 1, kviz 3: cena se poveča tolikokrat, kolikokrat se poveča število kosov: trikrat več
vstopnic stane trikrat več (ne za 3 € več, razen v izjemi f x = 1,5).
trditev: MAT-OS-6/sklepni-racun#tolikokrat
besedilo: »Vsaka vstopnica stane enako, zato trikrat več vstopnic stane trikrat več.« -/
theorem tolikokrat (f : ℝ → ℝ) (hf : premo f) (x : ℝ) : f (3 * x) = 3 * f x := obe_strani f hf 3 x

example := tolikokrat (fun x => 8 * x) ⟨8, fun _ => rfl⟩ 2

/-- Razlaga (mamljiva bližnjica) in premisli 1: Mojčino pravilo »vsak dodatni zvezek doda en evro«
(g n = 4,50 + (n − 3)) da za 6 zvezkov 4,50 + 3 = 7,50 €, dva paketa po tri pa 2 · 4,50 = 9 €; zato pravilo ni
sklepni račun (ni premo sorazmerno), pravilna cena je 9 €.
trditev: MAT-OS-6/sklepni-racun#mojca
besedilo: »Isti nakup ne more imeti dveh cen, zato je pravilo napačno. Pravilna cena je $9$ €.« -/
theorem mojca :
    (4.50 : ℝ) + 3 = 7.50 ∧ (2 : ℝ) * 4.50 = 9 ∧ (7.50 : ℝ) ≠ 9 ∧
      ¬ premo (fun n : ℝ => 4.50 + (n - 3)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  rintro ⟨k, hk⟩
  have h0 := hk 0
  norm_num at h0

/-- Razlaga (Popravek: sklep na enoto, tabela): 3 zvezki stanejo 4,50 €, en 4,50 : 3 = 1,5 €, pet 5 · 1,5 = 7,5 €
(za vsako premo sorazmerno zvezo s f 3 = 4,50); Mojčinih 6,50 € je premalo.
trditev: MAT-OS-6/sklepni-racun#zvezki
besedilo: »Pet zvezkov stane petkrat toliko: $5 \cdot 1{,}5 = 7{,}5$ €. Mojca bi torej plačala premalo.« -/
theorem zvezki (f : ℝ → ℝ) (hf : premo f) (h3 : f 3 = 4.50) : f 1 = 1.5 ∧ f 5 = 7.5 ∧ (6.50 : ℝ) < 7.5 := by
  have e := sklep_na_enoto f hf 3 three_ne_zero
  refine ⟨?_, ?_, by norm_num⟩
  · calc f 1 = 4.50 / 3 := by rw [(e 1).1, h3]
      _ = 1.5 := by norm_num
  · calc f 5 = 5 * (4.50 / 3) := by rw [(e 5).2, h3]
      _ = 5 * 1.5 := by norm_num
      _ = 7.5 := by norm_num

example := zvezki (fun x => 3 / 2 * x) ⟨3 / 2, fun _ => rfl⟩ (by norm_num)

/-- Razlaga (bližnjica, ki deluje): šest je dvakrat tri, zato šest zvezkov stane 2 · 4,50 = 9 €.
trditev: MAT-OS-6/sklepni-racun#bliznjica
besedilo: »Šest je dvakrat tri, zato je cena dvakrat $4{,}50$ €, torej $9$ €.« -/
theorem bliznjica (f : ℝ → ℝ) (hf : premo f) (h3 : f 3 = 4.50) : f 6 = 9 := by
  calc f 6 = f (2 * 3) := by norm_num
    _ = 2 * f 3 := obe_strani f hf 2 3
    _ = 2 * 4.50 := by rw [h3]
    _ = 9 := by norm_num

example := bliznjica (fun x => 3 / 2 * x) ⟨3 / 2, fun _ => rfl⟩ (by norm_num)

/-- Razlaga (druga past), Povzetek 5: pri delitvi stalnega zneska je delež p n = C : n; najprej množimo (cel znesek
C = n₀ · p n₀), nato delimo.
trditev: MAT-OS-6/sklepni-racun#delitev
besedilo: »Če si stalni znesek deli več ljudi: najprej množimo (cel znesek), nato delimo.« -/
theorem delez (p : ℝ → ℝ) (C : ℝ) (hp : delitev p C) (n₀ n : ℝ) (h0 : n₀ ≠ 0) (hn : n ≠ 0) :
    C = n₀ * p n₀ ∧ p n = (n₀ * p n₀) / n := by
  have e0 := hp n₀ h0
  have en := hp n hn
  refine ⟨e0.symm, ?_⟩
  rw [e0, eq_div_iff hn, mul_comm, en]

example := delez (fun n => 36 / n) 36 (fun _ hn => mul_div_cancel₀ 36 hn) 4 6 (by norm_num) (by norm_num)

/-- Razlaga (druga past), Pogoste napake 2: več ljudi pomeni manjši delež za vsakega (C > 0, 0 < n < m).
trditev: MAT-OS-6/sklepni-racun#vec-ljudi
besedilo: »Več ljudi pomeni manjši delež za vsakega.« -/
theorem vec_ljudi (p : ℝ → ℝ) (C : ℝ) (hp : delitev p C) (hC : 0 < C) (n m : ℝ) (hn : 0 < n) (hnm : n < m) :
    p m < p n := by
  have e := delez p C hp n m hn.ne' (by linarith)
  have en := hp n hn.ne'
  rw [e.2, en, div_lt_iff₀ (by linarith)]
  have : p n * n = C := by rw [mul_comm]; exact en
  have hpn : 0 < p n := by
    by_contra h; nlinarith [not_lt.mp h]
  nlinarith

example := vec_ljudi (fun n => 36 / n) 36 (fun _ hn => mul_div_cancel₀ 36 hn) (by norm_num) 4 6 (by norm_num)
  (by norm_num)

/-- Razlaga (druga past): 4 prijatelji po 9 € = 4 · 9 = 36 €; pri šestih vsak 36 : 6 = 6 € (za vsako delitev
stalnega zneska s p 4 = 9).
trditev: MAT-OS-6/sklepni-racun#darilo
besedilo: »Zdaj ga deli šest ljudi, zato vsak plača $36 : 6 = 6$ €.« -/
theorem darilo (p : ℝ → ℝ) (C : ℝ) (hp : delitev p C) (h4 : p 4 = 9) : C = 36 ∧ p 6 = 6 := by
  have e := delez p C hp 4 6 (by norm_num) (by norm_num)
  refine ⟨by rw [e.1, h4]; norm_num, ?_⟩
  calc p 6 = (4 * 9) / 6 := by rw [e.2, h4]
    _ = 36 / 6 := by norm_num
    _ = 6 := by norm_num

example := darilo (fun n => 36 / n) 36 (fun _ hn => mul_div_cancel₀ 36 hn) (by norm_num)

/-- Razlaga (premisli 2): pri dvanajstih prijateljih vsak plača 36 : 12 = 3 € < 6 €.
trditev: MAT-OS-6/sklepni-racun#premisli-2
besedilo: »Manj, ker je ljudi več kot šest, darilo pa stane enako. Vsak plača $36 : 12 = 3$ €.« -/
theorem premisli2 (p : ℝ → ℝ) (hp : delitev p 36) : p 12 = 3 ∧ (3 : ℝ) < 6 := by
  have e := hp 12 (by norm_num)
  refine ⟨by linarith, by norm_num⟩

example := premisli2 (fun n => 36 / n) (fun _ hn => mul_div_cancel₀ 36 hn)

/-- Razlaga (pred vsakim računom vprašanje), preizkus smiselnosti: pri ceni enote k > 0 več kosov stane več.
trditev: MAT-OS-6/sklepni-racun#vec-kosov
besedilo: »Ko se ena količina poveča, ali se druga poveča ali zmanjša?« -/
theorem vec_kosov (k x y : ℝ) (hk : 0 < k) (hxy : x < y) : k * x < k * y := mul_lt_mul_of_pos_left hxy hk

example := vec_kosov 1.5 4 10 (by norm_num) (by norm_num)

/-! ## Rešeni primeri -/

/-- Primer 1: 4 čokolade za 6 €; ena 6 : 4 = 1,5 €, deset 10 · 1,5 = 15 € (za vsako premo sorazmerno zvezo s
f 4 = 6); preizkus 15 > 6.
trditev: MAT-OS-6/sklepni-racun#primer-1
besedilo: »Deset čokolad stane $15$ €.« -/
theorem primer1 (f : ℝ → ℝ) (hf : premo f) (h4 : f 4 = 6) : f 1 = 1.5 ∧ f 10 = 15 ∧ (15 : ℝ) > 6 := by
  have e := sklep_na_enoto f hf 4 (by norm_num)
  refine ⟨?_, ?_, by norm_num⟩
  · calc f 1 = 6 / 4 := by rw [(e 1).1, h4]
      _ = 1.5 := by norm_num
  · calc f 10 = 10 * (6 / 4) := by rw [(e 10).2, h4]
      _ = 10 * 1.5 := by norm_num
      _ = 15 := by norm_num

example := primer1 (fun x => 3 / 2 * x) ⟨3 / 2, fun _ => rfl⟩ (by norm_num)

/-- Primer 2: 3 kg za 4,20 €; 1 kg 4,2 : 3 = 1,4 €, 2,5 kg 2,5 · 1,4 = 3,5 €; preizkus 3,5 < 4,20.
trditev: MAT-OS-6/sklepni-racun#primer-2
besedilo: »Za $2{,}5$ kg jabolk plačaš $3{,}50$ €.« -/
theorem primer2 (f : ℝ → ℝ) (hf : premo f) (h3 : f 3 = 4.20) : f 1 = 1.4 ∧ f 2.5 = 3.50 ∧ (3.5 : ℝ) < 4.20 := by
  have e := sklep_na_enoto f hf 3 three_ne_zero
  refine ⟨?_, ?_, by norm_num⟩
  · calc f 1 = 4.2 / 3 := by rw [(e 1).1, h3]; norm_num
      _ = 1.4 := by norm_num
  · calc f 2.5 = 2.5 * (4.2 / 3) := by rw [(e 2.5).2, h3]; norm_num
      _ = 2.5 * 1.4 := by norm_num
      _ = 3.50 := by norm_num

example := primer2 (fun x => 1.4 * x) ⟨1.4, fun _ => rfl⟩ (by norm_num)

/-- Primer 3: 24 učencev po 15 €; ostane 24 − 4 = 20 učencev; cena avtobusa 24 · 15 = 360 €; vsak plača
360 : 20 = 18 € (za vsako delitev stalnega zneska s p 24 = 15); preizkus 20 · 18 = 360 in 18 > 15.
trditev: MAT-OS-6/sklepni-racun#primer-3
besedilo: »Vsak od dvajsetih učencev plača $18$ €.« -/
theorem primer3 (p : ℝ → ℝ) (C : ℝ) (hp : delitev p C) (h24 : p 24 = 15) :
    (24 : ℝ) - 4 = 20 ∧ C = 360 ∧ p 20 = 18 ∧ (20 : ℝ) * 18 = 360 ∧ (18 : ℝ) > 15 := by
  have e := delez p C hp 24 20 (by norm_num) (by norm_num)
  refine ⟨by norm_num, by rw [e.1, h24]; norm_num, ?_, by norm_num, by norm_num⟩
  calc p 20 = (24 * 15) / 20 := by rw [e.2, h24]
    _ = 360 / 20 := by norm_num
    _ = 18 := by norm_num

example := primer3 (fun n => 360 / n) 360 (fun _ hn => mul_div_cancel₀ 360 hn) (by norm_num)

/-- Primer 4 in premisli: 1,5 kg za 2,70 €; 1 kg 2,7 : 1,5 = 1,8 €; za 4,50 € dobiš m kg natanko tedaj, ko je
m = 4,5 : 1,8 = 2,5 (za vsako premo sorazmerno zvezo s f 1,5 = 2,70); 2,5 > 1,5.
trditev: MAT-OS-6/sklepni-racun#primer-4
besedilo: »$4{,}5 : 1{,}8 = 2{,}5$, torej $2{,}5$ kg.« -/
theorem primer4 (f : ℝ → ℝ) (hf : premo f) (h : f 1.5 = 2.70) (m : ℝ) :
    f 1 = 1.8 ∧ (f m = 4.50 ↔ m = 2.5) ∧ (4.5 : ℝ) / 1.8 = 2.5 ∧ (2.5 : ℝ) > 1.5 := by
  have e := sklep_na_enoto f hf 1.5 (by norm_num)
  have h1 : f 1 = 1.8 := by
    calc f 1 = 2.7 / 1.5 := by rw [(e 1).1, h]; norm_num
      _ = 1.8 := by norm_num
  refine ⟨h1, ?_, by norm_num, by norm_num⟩
  rw [(e m).2, h]
  constructor
  · intro hm; norm_num at hm; linarith
  · intro hm; rw [hm]; norm_num

example := primer4 (fun x => 1.8 * x) ⟨1.8, fun _ => rfl⟩ (by norm_num) 2.5

/-! ## Pogoste napake -/

/-- Pogoste napake 3: 3 kg za 2,40 €; 3 : 2,40 = 1,25 ni cena kilograma (kg za en evro); cena 1 kg je
2,40 : 3 = 0,80 €.
trditev: MAT-OS-6/sklepni-racun#napaka-3
besedilo: »To ni cena enega kilograma, ampak koliko kilogramov dobiš za en evro.« -/
theorem napaka3 (f : ℝ → ℝ) (hf : premo f) (h3 : f 3 = 2.40) :
    (3 : ℝ) / 2.40 = 1.25 ∧ f 1 = 0.80 ∧ f 1 ≠ 1.25 ∧ f 1.25 = 1 := by
  have e := sklep_na_enoto f hf 3 three_ne_zero
  have h1 : f 1 = 0.80 := by rw [(e 1).1, h3]; norm_num
  refine ⟨by norm_num, h1, by rw [h1]; norm_num, ?_⟩
  rw [(e 1.25).2, h3]; norm_num

example := napaka3 (fun x => 0.8 * x) ⟨0.8, fun _ => rfl⟩ (by norm_num)

/-- Pogoste napake 4: 500 g = 0,5 kg (1 kg = 1000 g).
trditev: MAT-OS-6/sklepni-racun#napaka-4
besedilo: »Popravek: pred računanjem vse zapiši v isti enoti.« -/
theorem napaka4 : (500 : ℝ) / 1000 = 0.5 := by norm_num

/-! ## Drugače -/

/-- Drugače (zgodba): 7 laktov za 21 zlatnikov; en laket 21 : 7 = 3, deset 10 · 3 = 30 (za vsako premo
sorazmerno zvezo s f 7 = 21); vajenčevih 24 je napačno.
trditev: MAT-OS-6/sklepni-racun#zgodba
besedilo: »Nato postavi deset kupčkov po tri: $10 \cdot 3 = 30$ zlatnikov.« -/
theorem zgodba (f : ℝ → ℝ) (hf : premo f) (h7 : f 7 = 21) : f 1 = 3 ∧ f 10 = 30 ∧ f 10 ≠ 24 := by
  have e := sklep_na_enoto f hf 7 (by norm_num)
  have h1 : f 1 = 3 := by rw [(e 1).1, h7]; norm_num
  have h10 : f 10 = 30 := by
    calc f 10 = 10 * (21 / 7) := by rw [(e 10).2, h7]
      _ = 10 * 3 := by norm_num
      _ = 30 := by norm_num
  exact ⟨h1, h10, by rw [h10]; norm_num⟩

example := zgodba (fun x => 3 * x) ⟨3, fun _ => rfl⟩ (by norm_num)

/-- Drugače (korak za korakom): 5 svinčnikov za 4 €; en 4 : 5 = 0,8 €, osem 8 · 0,8 = 6,4 € (za vsako premo
sorazmerno zvezo s f 5 = 4); ocena: malo manj kot 2 · 4 = 8 €.
trditev: MAT-OS-6/sklepni-racun#svincniki
besedilo: »Odgovor: osem svinčnikov stane $6{,}40$ €.« -/
theorem svincniki (f : ℝ → ℝ) (hf : premo f) (h5 : f 5 = 4) : f 1 = 0.8 ∧ f 8 = 6.40 ∧ (6.4 : ℝ) < 2 * 4 := by
  have e := sklep_na_enoto f hf 5 (by norm_num)
  refine ⟨by rw [(e 1).1, h5]; norm_num, ?_, by norm_num⟩
  calc f 8 = 8 * (4 / 5) := by rw [(e 8).2, h5]
    _ = 8 * 0.8 := by norm_num
    _ = 6.40 := by norm_num

example := svincniki (fun x => 0.8 * x) ⟨0.8, fun _ => rfl⟩ (by norm_num)

/-! ## Preveri se -/

/-- Kviz 1: pri premo sorazmerni zvezi se vrednost ob podvojitvi podvoji; pri delitvi stalnega zneska C ≠ 0 pa
plača vsak polovico (p (2n) = p n / 2), ne dvakrat več.
trditev: MAT-OS-6/sklepni-racun#kviz-1
besedilo: »Če ga deli dvakrat več prijateljev, plača vsak polovico, ne dvakrat več.« -/
theorem kviz1 (p : ℝ → ℝ) (C : ℝ) (hp : delitev p C) (hC : C ≠ 0) (n : ℝ) (hn : n ≠ 0) :
    p (2 * n) = p n / 2 ∧ p (2 * n) ≠ 2 * p n := by
  have e := delez p C hp n (2 * n) hn (mul_ne_zero two_ne_zero hn)
  have en := hp n hn
  have hpn : p n ≠ 0 := by intro h; rw [h, mul_zero] at en; exact hC en.symm
  have h2 : p (2 * n) = p n / 2 := by
    rw [e.2]; field_simp
  refine ⟨h2, ?_⟩
  rw [h2]; intro h; apply hpn; linarith

example := kviz1 (fun n => 36 / n) 36 (fun _ hn => mul_div_cancel₀ 36 hn) (by norm_num) 4 (by norm_num)

/-- Kviz 1 (premo sorazmerni pari): dvakrat več kilogramov, vstopnic ali litrov stane dvakrat toliko.
trditev: MAT-OS-6/sklepni-racun#kviz-1-podvoji
besedilo: »Dva kilograma staneta dvakrat toliko kot en kilogram, zato ta par spada zraven.« -/
theorem kviz1_podvoji (f : ℝ → ℝ) (hf : premo f) (x : ℝ) : f (2 * x) = 2 * f x := obe_strani f hf 2 x

example := kviz1_podvoji (fun x => 1.4 * x) ⟨1.4, fun _ => rfl⟩ 1

/-- Kviz 2: 5 zvezkov za 7 €; en 7 : 5 = 1,40 €, osem 8 · 1,40 = 11,20 € (za vsako premo sorazmerno zvezo s
f 5 = 7); napačni 7 + 3 = 10, 7 · 5 : 8 = 4,375 in 7 · 8 = 56 niso cena.
trditev: MAT-OS-6/sklepni-racun#kviz-2
besedilo: »En zvezek stane $7 : 5 = 1{,}40$ €, osem zvezkov pa $8 \cdot 1{,}40 = 11{,}20$ €.« -/
theorem kviz2 (f : ℝ → ℝ) (hf : premo f) (h5 : f 5 = 7) :
    f 1 = 1.40 ∧ f 8 = 11.20 ∧ (7 : ℝ) + 3 = 10 ∧ (7 : ℝ) * 5 / 8 = 4.375 ∧ (7 : ℝ) * 8 = 56 ∧
      f 8 ≠ 10 ∧ f 8 ≠ 4.375 ∧ f 8 ≠ 56 := by
  have e := sklep_na_enoto f hf 5 (by norm_num)
  have h8 : f 8 = 11.20 := by
    calc f 8 = 8 * (7 / 5) := by rw [(e 8).2, h5]
      _ = 8 * 1.40 := by norm_num
      _ = 11.20 := by norm_num
  refine ⟨by rw [(e 1).1, h5]; norm_num, h8, by norm_num, by norm_num, by norm_num, ?_, ?_, ?_⟩ <;>
    rw [h8] <;> norm_num

example := kviz2 (fun x => 1.4 * x) ⟨1.4, fun _ => rfl⟩ (by norm_num)

/-- Kviz 3: potrojitev ni prištevanje 3: pri ceni vstopnice 8 € stanejo 3 vstopnice 24 €, ne 8 + 3 = 11 €.
trditev: MAT-OS-6/sklepni-racun#kviz-3
besedilo: »Potrojiti pomeni pomnožiti s $3$, ne prišteti $3$.« -/
theorem kviz3 : (3 : ℝ) * 8 = 24 ∧ (8 : ℝ) + 3 = 11 ∧ (24 : ℝ) ≠ 11 := by norm_num

/-- Kviz 4: 3 kg moke za 2,40 €; cena 1 kg je 2,40 : 3 = 0,80 €, 5 kg stane 5 · 0,80 = 4 €; Lukova 3 : 2,40 = 1,25 in
5 · 1,25 = 6,25 sta napačni (6 kg stane 4,80 € < 6,25 €).
trditev: MAT-OS-6/sklepni-racun#kviz-4
besedilo: »Cena 1 kg je $2{,}40 : 3 = 0{,}80$ €, torej $5$ kg stane $5 \cdot 0{,}80 = 4$ €.« -/
theorem kviz4 (f : ℝ → ℝ) (hf : premo f) (h3 : f 3 = 2.40) :
    f 1 = 0.80 ∧ f 5 = 4 ∧ (3 : ℝ) / 2.40 = 1.25 ∧ (5 : ℝ) * 1.25 = 6.25 ∧ f 6 = 4.80 ∧ f 5 ≠ 6.25 ∧
      (4.80 : ℝ) < 6.25 := by
  have e := sklep_na_enoto f hf 3 three_ne_zero
  have h5 : f 5 = 4 := by
    calc f 5 = 5 * (2.40 / 3) := by rw [(e 5).2, h3]
      _ = 5 * 0.80 := by norm_num
      _ = 4 := by norm_num
  refine ⟨by rw [(e 1).1, h3]; norm_num, h5, by norm_num, by norm_num, by rw [(e 6).2, h3]; norm_num,
    by rw [h5]; norm_num, by norm_num⟩

example := kviz4 (fun x => 0.8 * x) ⟨0.8, fun _ => rfl⟩ (by norm_num)

/-- Kviz 5: dvorana 120 €; 20 + 4 = 24 učencev, vsak 120 : 24 = 5 € (za vsako delitev zneska 120); napačni 6 (stari
delež 120 : 20), 7,20 (= 6 · 24 : 20) in 6 + 4 = 10.
trditev: MAT-OS-6/sklepni-racun#kviz-5
besedilo: »Vseh učencev je $24$, zato vsak plača $120 : 24 = 5$ €.« -/
theorem kviz5 (p : ℝ → ℝ) (hp : delitev p 120) :
    (20 : ℝ) + 4 = 24 ∧ p 24 = 5 ∧ p 20 = 6 ∧ (6 : ℝ) * 24 / 20 = 7.20 ∧ (6 : ℝ) + 4 = 10 ∧ p 24 ≠ 6 ∧
      p 24 ≠ 7.20 ∧ p 24 ≠ 10 := by
  have e24 := hp 24 (by norm_num)
  have e20 := hp 20 (by norm_num)
  have h24 : p 24 = 5 := by linarith
  refine ⟨by norm_num, h24, by linarith, by norm_num, by norm_num, ?_, ?_, ?_⟩ <;> rw [h24] <;> norm_num

example := kviz5 (fun n => 120 / n) (fun _ hn => mul_div_cancel₀ 120 hn)

end Evklid.Lekcije.MAT_OS_6.SklepniRacun
