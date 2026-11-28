/-
vir: content/lessons/MAT-OS-8/linearne-enacbe.md
sha256: 295b982456ca37f0e77e628fa7ce07c3e2abfa5432effec60735433e8d8220c7
Ni v Leanu: zgodbe (pot do koče, vozovnice, taksi, Mina in dedek) kot modeli: dokazana je enačba, ki jo
lekcija zapiše, in njena rešitev; tehtnica in simulacija kot slike (da je tehtnica v ravnovesju le pri pravi
rešitvi, je enolična rešitev ↔); opredelitev linearne enačbe in rešitve ter imena korakov (ekvivalentno
preoblikovanje, preizkus, »prenos čez enačaj«) kot definicije oz. besedilo; postopek v petih korakih in
nasveti (»lažje je najprej odšteti«, »v rešitvah vedno povemo«) kot navodila; Premisli o Neži (preizkus v
vmesni enačbi) nima konkretne enačbe, zato ni dokazan (dokazano je, da Janova napačna vmesna enačba
x + 6 = 10 ni ekvivalentna prvotni); Preveri se 1 in 2 (ime koraka, vrstni red korakov) kot besedilo, dokazana
je veriga rešitve iz razlage odgovora in preizkus. Vse trditve so v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.LinearneEnacbe

/-! ## Zakaj se tega učimo in Razlaga 1–2: 3x + 6 = 30 -/

/-- Zakaj se tega učimo: obe situaciji (6 km z gondolo in 3 etape do 30 km; 3 vozovnice in 6 € do 30 €)
opiše ista enačba: 6 + 3x = 30 je ista kot 3x + 6 = 30.
trditev: MAT-OS-8/linearne-enacbe#ista-enacba
besedilo: »Ko pa neznano število označiš z $x$, obe opiše **ista enačba**: $$3x + 6 = 30$$« -/
theorem ista_enacba (x : ℝ) : 6 + 3 * x = 30 ↔ 3 * x + 6 = 30 := by
  rw [add_comm]

/-- Razlaga 2 (tehtnica): 3x + 6 = 30 ⇔ (odvzamemo 6) 3x = 24 ⇔ (delimo s 3) x = 8 (edina rešitev;
Razlaga 3: rešitev je 8).
trditev: MAT-OS-8/linearne-enacbe#tehtnica
besedilo: »Na tehtnici z obeh skled odvzamemo $6$ uteži in ostane $3x = 24$. Nato vsebino obeh skled razdelimo na $3$ enake dele: $x = 8$.« -/
theorem tehtnica (x : ℝ) : 3 * x + 6 = 30 ↔ x = 8 := by
  calc 3 * x + 6 = 30 ↔ 3 * x = 24 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 8 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 1: delimo celo stran: (3x + 6) : 3 = x + 2.
trditev: MAT-OS-8/linearne-enacbe#deli-celo-stran
besedilo: »Ko delimo stran enačbe, delimo **celo** stran: $(3x + 6) : 3 = x + 2$.« -/
theorem deli_celo_stran (x : ℝ) : (3 * x + 6) / 3 = x + 2 := by ring

/-- Razlaga 1 (premisli): s 3 delimo celo levo in celo desno stran: 3x + 6 = 30 ⇔ x + 2 = 10 ⇔ x = 8;
preizkus 3 · 8 + 6 = 30.
trditev: MAT-OS-8/linearne-enacbe#premisli-jan
besedilo: »$x + 2 = 10$, torej $x = 8$. Preizkus: $3 \cdot 8 + 6 = 30$.« -/
theorem premisli_jan (x : ℝ) : (3 * x + 6 = 30 ↔ x + 2 = 10) ∧ (x + 2 = 10 ↔ x = 8) ∧
    (3 : ℝ) * 8 + 6 = 30 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num⟩

/-- Razlaga 1 in Pogoste napake 1: Janova bližnjica (deli samo 3x) da x + 6 = 10, torej x = 4, a preizkus
3 · 4 + 6 = 18 ≠ 30; enačba x + 6 = 10 ni ekvivalentna 3x + 6 = 30 (pri x = 8 prva ne velja).
trditev: MAT-OS-8/linearne-enacbe#jan-napaka
besedilo: »Preverimo: $3 \cdot 4 + 6 = 18$, desna stran pa je $30$. Rešitev ni prava.« -/
theorem jan_napaka :
    (∀ x : ℝ, x + 6 = 10 ↔ x = 4) ∧ (3 : ℝ) * 4 + 6 = 18 ∧ (18 : ℝ) ≠ 30 ∧
      ¬ (∀ x : ℝ, 3 * x + 6 = 30 → x + 6 = 10) := by
  refine ⟨fun x => ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num, ?_⟩
  intro h
  have := h 8 (by norm_num)
  norm_num at this

/-! ## Razlaga 2 in Bolj natančno: ekvivalentna preoblikovanja -/

/-- Razlaga 2 in Bolj natančno: prištevanje istega števila (ali člena) c na obeh straneh je ekvivalentno
preoblikovanje: A = B ⇔ A + c = B + c (razveljavimo ga z odštevanjem c).
trditev: MAT-OS-8/linearne-enacbe#pristej
besedilo: »Rešitev pri tem ne izgubimo, ker gre vsak korak tudi **nazaj**. Prištevanje $c$ razveljavimo z odštevanjem $c$« -/
theorem pristej (A B c : ℝ) : A = B ↔ A + c = B + c := (add_left_inj c).symm

/-- Razlaga 2: odštevanje istega števila na obeh straneh: A = B ⇔ A − c = B − c.
trditev: MAT-OS-8/linearne-enacbe#odstej
besedilo: »na obeh straneh prištejemo ali odštejemo isto število ali isti člen z $x$« -/
theorem odstej (A B c : ℝ) : A = B ↔ A - c = B - c := (sub_left_inj).symm

/-- Bolj natančno: iz A = B sledi A + c = B + c in A · c = B · c (za vsak c).
trditev: MAT-OS-8/linearne-enacbe#enako-na-obeh
besedilo: »iz $A = B$ sledi $A + c = B + c$. Enako velja za množenje: iz $A = B$ sledi $A \cdot c = B \cdot c$.« -/
theorem enako_na_obeh (A B c : ℝ) (h : A = B) : A + c = B + c ∧ A * c = B * c := by
  rw [h]; exact ⟨rfl, rfl⟩

/-- Predpostavka `enako_na_obeh` se da izpolniti (A = B = 1). -/
example : (1 : ℝ) = 1 := rfl

/-- Razlaga 2, Povzetek in Bolj natančno: množenje obeh strani s c ≠ 0 je ekvivalentno preoblikovanje:
A = B ⇔ A · c = B · c (razveljavimo ga z deljenjem s c).
trditev: MAT-OS-8/linearne-enacbe#pomnozi
besedilo: »množenje s $c \ne 0$ pa z deljenjem s $c$. Zato imata enačbi pred korakom in po njem iste rešitve.« -/
theorem pomnozi (A B c : ℝ) (hc : c ≠ 0) : A = B ↔ A * c = B * c := (mul_left_inj' hc).symm

/-- Razlaga 2 in Povzetek: deljenje obeh strani s c ≠ 0 je ekvivalentno preoblikovanje: A = B ⇔ A/c = B/c.
trditev: MAT-OS-8/linearne-enacbe#deli
besedilo: »obe strani pomnožimo ali delimo z istim številom, ki ni $0$« -/
theorem deli (A B c : ℝ) (hc : c ≠ 0) : A = B ↔ A / c = B / c := (div_left_inj₀ hc).symm

/-- Predpostavka `pomnozi` in `deli` se da izpolniti (c = 3). -/
example : (3 : ℝ) ≠ 0 := by norm_num

/-- Bolj natančno: množenje z 0 vsako enačbo spremeni v 0 = 0 in ga ne moremo razveljaviti: A · 0 = B · 0
velja za vse A, B, tudi za A = 3 ≠ 7 = B.
trditev: MAT-OS-8/linearne-enacbe#mnozenje-z-nic
besedilo: »množenje z $0$ bi vsako enačbo spremenilo v $0 = 0$ in tega koraka ne moremo razveljaviti.« -/
theorem mnozenje_z_nic : (∀ A B : ℝ, A * 0 = B * 0) ∧ (3 : ℝ) * 0 = 7 * 0 ∧ (3 : ℝ) ≠ 7 := by
  refine ⟨fun A B => by simp, by norm_num, by norm_num⟩

/-! ## Razlaga 4: »prenesi čez enačaj« -/

/-- Razlaga 4 in Pogoste napake 3: x + 4 = 9 ⇔ (odštejemo 4 na obeh straneh) x = 9 − 4 ⇔ x = 5;
x = 9 + 4 = 13 ni rešitev.
trditev: MAT-OS-8/linearne-enacbe#prenos
besedilo: »Iz $x + 4 = 9$ ne sledi $x = 9 + 4$. »Prenos« je v resnici odštevanje $4$ na obeh straneh: $x = 9 - 4 = 5$.« -/
theorem prenos (x : ℝ) : (x + 4 = 9 ↔ x = 9 - 4) ∧ (9 : ℝ) - 4 = 5 ∧ (9 + 4 : ℝ) + 4 ≠ 9 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

/-! ## Razlaga 7: ko x izgine -/

/-- Razlaga 7 in Povzetek: ko se členi z x odštejejo (ax + b = ax + d ⇔ b = d), resnična enakost b = d
pomeni, da je vsako število rešitev, neresnična b ≠ d pa, da rešitve ni.
trditev: MAT-OS-8/linearne-enacbe#x-izgine
besedilo: »Če $x$ izgine: resnična enakost pomeni neskončno mnogo rešitev, neresnična pomeni, da rešitve ni.« -/
theorem x_izgine (a b d : ℝ) :
    (∀ x : ℝ, a * x + b = a * x + d ↔ b = d) ∧ (b = d → ∀ x : ℝ, a * x + b = a * x + d) ∧
      (b ≠ d → ∀ x : ℝ, a * x + b ≠ a * x + d) := by
  refine ⟨fun x => add_right_inj (a * x), fun h x => by rw [h], fun h x hx => h ?_⟩
  exact (add_right_inj (a * x)).mp hx

/-- Razlaga 7, primera: 5 = 5 je resnična (neskončno mnogo rešitev), 3 = 7 ni (ni rešitve).
pomozno – izrek le preveri, da 5 = 5 drži in 3 = 7 ne; stavka v Razlagi 7 trdita še o rešitvah (to je x_izgine) -/
theorem x_izgine_primera : (5 : ℝ) = 5 ∧ (3 : ℝ) ≠ 7 := by norm_num

/-! ## Primer 1: vožnja s taksijem -/

/-- Primer 1: 3x + 5 = 20 ⇔ (odštejemo 5) 3x = 20 − 5 ⇔ 3x = 15 ⇔ (delimo s 3) x = 15 : 3 ⇔ x = 5.
trditev: MAT-OS-8/linearne-enacbe#primer1
besedilo: »Odgovor: vožnja je bila dolga $5\,\text{km}$.« -/
theorem primer1 (x : ℝ) : 3 * x + 5 = 20 ↔ x = 5 := by
  calc 3 * x + 5 = 20 ↔ 3 * x = 20 - 5 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 3 * x = 15 := by norm_num
    _ ↔ x = 15 / 3 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 5 := by norm_num

/-- Primer 1, korak 3, in Preveri se 1 (Mojčin preizkus): levo 3 · 5 + 5 = 20, desno 20.
trditev: MAT-OS-8/linearne-enacbe#primer1-preizkus
besedilo: »Preizkus v prvotni enačbi: levo $3 \cdot 5 + 5 = 20$, desno $20$.« -/
theorem primer1_preizkus : (3 : ℝ) * 5 + 5 = 20 := by norm_num

/-! ## Primer 2: neznanka na obeh straneh -/

/-- Primer 2: 5x − 7 = 2x + 8 ⇔ (−2x) 3x − 7 = 8 ⇔ (+7) 3x = 15 ⇔ (: 3) x = 5.
trditev: MAT-OS-8/linearne-enacbe#primer2
besedilo: »Odgovor: rešitev je $x = 5$.« -/
theorem primer2 (x : ℝ) : 5 * x - 7 = 2 * x + 8 ↔ x = 5 := by
  calc 5 * x - 7 = 2 * x + 8 ↔ 3 * x - 7 = 8 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 3 * x = 15 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 5 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 2, preizkus: levo 5 · 5 − 7 = 18, desno 2 · 5 + 8 = 18.
trditev: MAT-OS-8/linearne-enacbe#primer2-preizkus
besedilo: »Preizkus: levo $5 \cdot 5 - 7 = 18$, desno $2 \cdot 5 + 8 = 18$.« -/
theorem primer2_preizkus : (5 : ℝ) * 5 - 7 = 18 ∧ (2 : ℝ) * 5 + 8 = 18 := by norm_num

/-! ## Primer 3: kdaj imata izraza enako vrednost -/

/-- Primer 3, korak 1 (in Pogoste napake 2): odprava oklepajev: 2(x − 3) − 4 = 2x − 6 − 4 in
5x + 2(1 − x) = 5x + 2 − 2x.
trditev: MAT-OS-8/linearne-enacbe#primer3-oklepaji
besedilo: »Odpravimo oklepaje, vsak člen pomnožimo: $2x - 6 - 4 = 5x + 2 - 2x$.« -/
theorem primer3_oklepaji (x : ℝ) :
    2 * (x - 3) - 4 = 2 * x - 6 - 4 ∧ 5 * x + 2 * (1 - x) = 5 * x + 2 - 2 * x := by
  constructor <;> ring

/-- Primer 3: 2(x − 3) − 4 = 5x + 2(1 − x) ⇔ 2x − 6 − 4 = 5x + 2 − 2x ⇔ 2x − 10 = 3x + 2 ⇔ (−3x)
−x − 10 = 2 ⇔ (+10) −x = 12 ⇔ (· (−1)) x = −12.
trditev: MAT-OS-8/linearne-enacbe#primer3
besedilo: »izraza imata enako vrednost pri $x = -12$« -/
theorem primer3 (x : ℝ) : 2 * (x - 3) - 4 = 5 * x + 2 * (1 - x) ↔ x = -12 := by
  calc 2 * (x - 3) - 4 = 5 * x + 2 * (1 - x) ↔ 2 * x - 6 - 4 = 5 * x + 2 - 2 * x := by
        constructor <;> intro h <;> linarith
    _ ↔ 2 * x - 10 = 3 * x + 2 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -x - 10 = 2 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -x = 12 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = -12 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 3, preizkus: levo 2 · (−12 − 3) − 4 = 2 · (−15) − 4 = −34; desno 5 · (−12) + 2 · (1 − (−12)) =
5 · (−12) + 2 · 13 = −60 + 26 = −34 (oba izraza sta tedaj −34).
trditev: MAT-OS-8/linearne-enacbe#primer3-preizkus
besedilo: »Levo: $2 \cdot (-15) - 4 = -34$. Desno: $5 \cdot (-12) + 2 \cdot 13 = -60 + 26 = -34$.« -/
theorem primer3_preizkus :
    (2 : ℝ) * (-12 - 3) - 4 = -34 ∧ (5 : ℝ) * (-12) + 2 * (1 - (-12)) = -34 := by
  constructor
  · calc (2 : ℝ) * (-12 - 3) - 4 = 2 * (-15) - 4 := by norm_num
      _ = -34 := by norm_num
  · calc (5 : ℝ) * (-12) + 2 * (1 - (-12)) = 5 * (-12) + 2 * 13 := by norm_num
      _ = -60 + 26 := by norm_num
      _ = -34 := by norm_num

/-- Pogoste napake 4: −x = 12 ⇔ x = −12; x = 12 ni rešitev.
trditev: MAT-OS-8/linearne-enacbe#napaka-minus
besedilo: »Rešitev je $x = -12$, ne $x = 12$.« -/
theorem napaka_minus (x : ℝ) : (-x = 12 ↔ x = -12) ∧ -(12 : ℝ) ≠ 12 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-- Pogoste napake 2: 2(x − 3) = 2x − 6 in ni 2x − 3 (za noben x).
trditev: MAT-OS-8/linearne-enacbe#napaka-oklepaj
besedilo: »$2(x - 3)$ je $2x - 6$, ne $2x - 3$.« -/
theorem napaka_oklepaj (x : ℝ) : 2 * (x - 3) = 2 * x - 6 ∧ 2 * (x - 3) ≠ 2 * x - 3 := by
  refine ⟨by ring, fun h => by linarith⟩

/-- Pogoste napake 1: lažje je najprej odšteti 6 in nato deliti: 3x = 24, x = 8 (24 : 3 = 8).
trditev: MAT-OS-8/linearne-enacbe#napaka-deli
besedilo: »Lažje je najprej odšteti $6$ in šele nato deliti: $3x = 24$, $x = 8$.« -/
theorem napaka_deli (x : ℝ) : (3 * x + 6 = 30 ↔ 3 * x = 24) ∧ (3 * x = 24 ↔ x = 24 / 3) ∧
    (24 : ℝ) / 3 = 8 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num⟩

/-! ## Primer 4 – zdaj ti -/

/-- Primer 4: 4(x + 2) = 2x + 20 ⇔ 4x + 8 = 2x + 20 ⇔ (−2x, −8) 2x = 12 ⇔ x = 12 : 2 ⇔ x = 6.
trditev: MAT-OS-8/linearne-enacbe#primer4
besedilo: »$x = 12 : 2 = 6$.« -/
theorem primer4 (x : ℝ) : 4 * (x + 2) = 2 * x + 20 ↔ x = 6 := by
  calc 4 * (x + 2) = 2 * x + 20 ↔ 4 * x + 8 = 2 * x + 20 := by
        constructor <;> intro h <;> linarith
    _ ↔ 2 * x = 12 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 12 / 2 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 6 := by norm_num

/-- Primer 4, preizkus: levo 4 · (6 + 2) = 32, desno 2 · 6 + 20 = 32.
trditev: MAT-OS-8/linearne-enacbe#primer4-preizkus
besedilo: »Preizkus: levo $4 \cdot (6 + 2) = 32$, desno $2 \cdot 6 + 20 = 32$.« -/
theorem primer4_preizkus : (4 : ℝ) * (6 + 2) = 32 ∧ (2 : ℝ) * 6 + 20 = 32 := by norm_num

/-! ## Drugače: Kot zgodba -/

/-- Kot zgodba: 2x + 5 = x + 9 ⇔ (vzamemo nahrbtnik) x + 5 = 9 ⇔ (vzamemo 5 uteži) x = 4.
trditev: MAT-OS-8/linearne-enacbe#zgodba
besedilo: »V jeziku enačb je to $2x + 5 = x + 9$, nato $x + 5 = 9$ in nazadnje $x = 4$.« -/
theorem zgodba (x : ℝ) : 2 * x + 5 = x + 9 ↔ x = 4 := by
  calc 2 * x + 5 = x + 9 ↔ x + 5 = 9 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Kot zgodba, preizkus: levo 2 · 4 + 5 = 13, desno 4 + 9 = 13.
trditev: MAT-OS-8/linearne-enacbe#zgodba-preizkus
besedilo: »Za preizkus je Mina vse vrnila nazaj: levo $2 \cdot 4 + 5 = 13$, desno $4 + 9 = 13$.« -/
theorem zgodba_preizkus : (2 : ℝ) * 4 + 5 = 13 ∧ (4 : ℝ) + 9 = 13 := by norm_num

/-- Kot zgodba: če uteži vzamemo le z ene sklede, ravnovesje ni ohranjeno: x + 5 = 9 in x = 9 nista hkrati
mogoči (pri x = 4 je 4 ≠ 9).
trditev: MAT-OS-8/linearne-enacbe#zgodba-ena-skleda
besedilo: »Če bi uteži vzela le z ene sklede, bi se tehtnica nagnila.« -/
theorem zgodba_ena_skleda (x : ℝ) (h : x + 5 = 9) : x ≠ 9 := by
  intro hx; rw [hx] at h; norm_num at h

/-- Predpostavka `zgodba_ena_skleda` se da izpolniti (x = 4). -/
example : (4 : ℝ) + 5 = 9 := by norm_num

/-! ## Drugače: Korak za korakom s številkami -/

/-- Korak za korakom, koraki 1–4: x/2 + 3 = x/4 + 5 ⇔ (· 4) 4 · (x/2) + 4 · 3 = 4 · (x/4) + 4 · 5 ⇔
2x + 12 = x + 20 ⇔ (−x) x + 12 = 20 ⇔ (−12) x = 8.
trditev: MAT-OS-8/linearne-enacbe#korak-za-korakom
besedilo: »| 4 | Odštejemo $12$ na obeh straneh | $x = 8$ |« -/
theorem korak_za_korakom (x : ℝ) : x / 2 + 3 = x / 4 + 5 ↔ x = 8 := by
  calc x / 2 + 3 = x / 4 + 5 ↔ 4 * (x / 2) + 4 * 3 = 4 * (x / 4) + 4 * 5 :=
        ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 2 * x + 12 = x + 20 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x + 12 = 20 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 8 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Korak za korakom, koraka 5–6 (preizkus): 8/2 + 3 = 4 + 3 = 7 in 8/4 + 5 = 2 + 5 = 7.
trditev: MAT-OS-8/linearne-enacbe#korak-za-korakom-preizkus
besedilo: »| 5 | Preizkus, leva stran | $\dfrac{8}{2} + 3 = 4 + 3 = 7$ | | 6 | Preizkus, desna stran | $\dfrac{8}{4} + 5 = 2 + 5 = 7$ |« -/
theorem korak_za_korakom_preizkus : (8 : ℝ) / 2 + 3 = 7 ∧ (8 : ℝ) / 4 + 5 = 7 := by
  constructor
  · calc (8 : ℝ) / 2 + 3 = 4 + 3 := by norm_num
      _ = 7 := by norm_num
  · calc (8 : ℝ) / 4 + 5 = 2 + 5 := by norm_num
      _ = 7 := by norm_num

/-! ## Drugače: Bolj natančno: splošna enačba -/

/-- Bolj natančno: za a ≠ 0 je ax + b = c ⇔ (−b) ax = c − b ⇔ (: a) x = (c − b)/a.
trditev: MAT-OS-8/linearne-enacbe#splosna
besedilo: »Splošna enačba $ax + b = c$ za $a \ne 0$: odštejemo $b$ in dobimo $ax = c - b$, nato delimo z $a$: $$x = \frac{c - b}{a}$$« -/
theorem splosna (a b c x : ℝ) (ha : a ≠ 0) : a * x + b = c ↔ x = (c - b) / a := by
  calc a * x + b = c ↔ a * x = c - b := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = (c - b) / a := by
      rw [eq_div_iff ha, mul_comm]

/-- Predpostavka `splosna` se da izpolniti (a = 3). -/
example : (3 : ℝ) ≠ 0 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: 2(x + 1) + x = 14 ⇔ 2x + 2 + x = 14 ⇔ 3x + 2 = 14 ⇔ 3x = 12 ⇔ x = 4.
trditev: MAT-OS-8/linearne-enacbe#preveri2
besedilo: »$2x + 2 + x = 14$, $3x + 2 = 14$, $3x = 12$, $x = 4$.« -/
theorem preveri2 (x : ℝ) : 2 * (x + 1) + x = 14 ↔ x = 4 := by
  calc 2 * (x + 1) + x = 14 ↔ 2 * x + 2 + x = 14 := by constructor <;> intro h <;> linarith
    _ ↔ 3 * x + 2 = 14 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 3 * x = 12 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 4 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Preveri se 2, preizkus: 2 · (4 + 1) + 4 = 14.
trditev: MAT-OS-8/linearne-enacbe#preveri2-preizkus
besedilo: »Preizkus: $2 \cdot (4 + 1) + 4 = 14$.« -/
theorem preveri2_preizkus : (2 : ℝ) * (4 + 1) + 4 = 14 := by norm_num

/-- Preveri se 3: 2x + 4 = 2x + 9 ⇔ (−2x) 4 = 9, kar ne drži: enačba nima rešitve (tudi x = 0 ni rešitev).
trditev: MAT-OS-8/linearne-enacbe#preveri3
besedilo: »Po odštevanju $2x$ ostane $4 = 9$. Ta enakost ne drži za noben $x$, zato enačba nima rešitve.« -/
theorem preveri3 (x : ℝ) : (2 * x + 4 = 2 * x + 9 ↔ (4 : ℝ) = 9) ∧ 2 * x + 4 ≠ 2 * x + 9 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, fun h => by linarith⟩

/-- Preveri se 4: 4x − 9 = 11 ⇔ (+9) 4x = 20 ⇔ (: 4) x = 5.
trditev: MAT-OS-8/linearne-enacbe#preveri4
besedilo: »Na obeh straneh prištejemo $9$: $4x = 20$, nato delimo s $4$: $x = 5$.« -/
theorem preveri4 (x : ℝ) : 4 * x - 9 = 11 ↔ x = 5 := by
  calc 4 * x - 9 = 11 ↔ 4 * x = 20 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 5 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Preveri se 4: preizkus 4 · 5 − 9 = 11; napačni odgovori 1/2, 20, −5 niso rešitve (−5 dobiš, če obema
številoma daš napačen predznak: 4x = −11 − 9 = −20, x = −20 : 4 = −5).
trditev: MAT-OS-8/linearne-enacbe#preveri4-preizkus
besedilo: »Preizkus: $4 \cdot 5 - 9 = 11$.« -/
theorem preveri4_preizkus :
    (4 : ℝ) * 5 - 9 = 11 ∧ (4 : ℝ) * (1 / 2) - 9 ≠ 11 ∧ (4 : ℝ) * 20 - 9 ≠ 11 ∧ (4 : ℝ) * (-5) - 9 ≠ 11 ∧
      (-11 : ℝ) - 9 = -20 ∧ (-20 : ℝ) / 4 = -5 := by
  norm_num

/-- Preveri se 5: 2(x − 3) = x + 4 ⇔ 2x − 6 = x + 4 ⇔ (−x) x − 6 = 4 ⇔ (+6) x = 10.
trditev: MAT-OS-8/linearne-enacbe#preveri5
besedilo: »$2x - 6 = x + 4$; odštejemo $x$: $x - 6 = 4$; prištejemo $6$: $x = 10$.« -/
theorem preveri5 (x : ℝ) : 2 * (x - 3) = x + 4 ↔ x = 10 := by
  calc 2 * (x - 3) = x + 4 ↔ 2 * x - 6 = x + 4 := by constructor <;> intro h <;> linarith
    _ ↔ x - 6 = 4 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 10 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Preveri se 5: preizkus 2 · (10 − 3) = 14 in 10 + 4 = 14; napačni odgovori 7, −2, 10/3 niso rešitve.
trditev: MAT-OS-8/linearne-enacbe#preveri5-preizkus
besedilo: »Preizkus: $2 \cdot (10 - 3) = 14$ in $10 + 4 = 14$.« -/
theorem preveri5_preizkus :
    (2 : ℝ) * (10 - 3) = 14 ∧ (10 : ℝ) + 4 = 14 ∧ (2 : ℝ) * (7 - 3) ≠ 7 + 4 ∧
      (2 : ℝ) * (-2 - 3) ≠ -2 + 4 ∧ (2 : ℝ) * (10 / 3 - 3) ≠ 10 / 3 + 4 := by
  norm_num

end Evklid.Lekcije.MAT_OS_8.LinearneEnacbe
