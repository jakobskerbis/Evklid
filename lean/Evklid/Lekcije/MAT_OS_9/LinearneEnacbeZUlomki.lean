/-
vir: content/lessons/MAT-OS-9/linearne-enacbe-z-ulomki.md
sha256: 50c9a107b89820b88b899e3b9ee53ac73596dfce03c33422b7c0d4dfa41f3db4
Ni v Leanu: simulacija s tehtnico in risba traku kot sliki (dokazan je račun traku: 1 − ½ − ⅓ = ⅙,
3 + 2 + 1 = 6, x/6 = 40 ⇔ x = 240); postopek v šestih korakih in nasveti (»hitro se zmotiš«, »najmanj
priložnosti za napako«, »preizkus je kontrola postopka«, »napaka v predznaku se pokaže šele pri preizkusu«)
kot navodila; Premisli »zakaj preizkus v prvotni enačbi« je dokazan na Matičevem primeru (napačna enačba
x + 3 = 5 ima rešitev 2, ki prvotni ne ustreza); besedilne naloge (teleskop, sonda, voda) kot modeli: dokazana
je enačba, ki jo lekcija zapiše; ocena v Preveri se 2 je dokazana kot konkretne neenakosti (2/3 + 2/4 = 7/6,
50/3 > 16 > 7, x/3 + x/4 = 7x/12 > x/2, rešitev 12 < 14); besedilo napačnih odgovorov (dokazano je, da
napačne vrednosti niso pravilne). Najmanjši skupni večkratnik je `Nat.lcm`; da je najmanjši, je dokazano
kot lcm ≤ vsak pozitiven skupni večkratnik.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.LinearneEnacbeZUlomki

/-! ## Zakaj se tega učimo in Razlaga 5: teleskop -/

/-- Zakaj se tega učimo in Razlaga 5: x/2 + x/3 + 40 = x ⇔ (·6) 3x + 2x + 240 = 6x ⇔ 5x + 240 = 6x ⇔
x = 240 (teleskop stane 240 €, edina rešitev).
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#teleskop
besedilo: »Za teleskop: množimo s $6$, dobimo $3x+2x+240=6x$, torej $5x+240=6x$ in $x=240$.« -/
theorem teleskop (x : ℝ) : x / 2 + x / 3 + 40 = x ↔ x = 240 := by
  calc x / 2 + x / 3 + 40 = x ↔ 3 * x + 2 * x + 240 = 6 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 5 * x + 240 = 6 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 240 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 5 (preizkus): 240/2 + 240/3 + 40 = 120 + 80 + 40 = 240.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#teleskop-preizkus
besedilo: »Preizkus: $\dfrac{240}{2}+\dfrac{240}{3}+40=120+80+40=240$.« -/
theorem teleskop_preizkus : (240:ℝ) / 2 + 240 / 3 + 40 = 240 := by
  calc (240:ℝ) / 2 + 240 / 3 + 40 = 120 + 80 + 40 := by norm_num
    _ = 240 := by norm_num

/-- Na sliki: polovica so 3 deli, tretjina 2 dela od 6; ostane 1 − ½ − ⅓ = ⅙ (1 del); en del je 40 €, zato
x/6 = 40 ⇔ x = 6·40 = 240.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#trak
besedilo: »Polovica so $3$ deli, tretjina $2$ dela. Ostane natanko $1$ del, ki je vreden $40\,€$. Ves trak ima $6$ delov, torej je cena $6\cdot 40=240\,€$.« -/
theorem trak (x : ℝ) :
    (1:ℝ) / 2 = 3 / 6 ∧ (1:ℝ) / 3 = 2 / 6 ∧ (1:ℝ) - 1 / 2 - 1 / 3 = 1 / 6 ∧ (3:ℕ) + 2 + 1 = 6 ∧
      (x / 6 = 40 ↔ x = 6 * 40) ∧ (6:ℝ) * 40 = 240 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-! ## Razlaga 1 in Bolj natančno: ekvivalentna enačba -/

/-- Razlaga 1 in Bolj natančno: pri k ≠ 0 je A = B ⇔ kA = kB (enačbi imata natanko iste rešitve).
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#mnozenje-ekvivalentno
besedilo: »Če obe strani enačbe pomnožimo z istim številom, ki ni $0$, dobimo ekvivalentno enačbo.« -/
theorem mnozenje_ekvivalentno (k A B : ℝ) (hk : k ≠ 0) : A = B ↔ k * A = k * B :=
  (mul_right_inj' hk).symm

/-- Predpostavka `mnozenje_ekvivalentno` se da izpolniti (k = 6). -/
example : (6:ℝ) ≠ 0 := by norm_num

/-- Bolj natančno: iz A = B sledi kA = kB za vsak k.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#mnozenje
besedilo: »Če je $A=B$, je tudi $k\cdot A=k\cdot B$ za vsako število $k$.« -/
theorem mnozenje (k A B : ℝ) (h : A = B) : k * A = k * B := by rw [h]

/-- Predpostavka `mnozenje` se da izpolniti (A = B = 1). -/
example : (1:ℝ) = 1 := rfl

/-- Bolj natančno: pri k = 0 dobimo 0 = 0 za vsak x (tudi tam, kjer A ≠ B): informacija se izgubi.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#mnozenje-z-0
besedilo: »z $0$ bi dobili $0=0$, kar velja za vsak $x$, in izgubili bi vso informacijo« -/
theorem mnozenje_z_0 : (∀ A B : ℝ, 0 * A = 0 * B) ∧ (0:ℝ) * 1 = 0 * 2 ∧ (1:ℝ) ≠ 2 := by
  refine ⟨fun A B => by ring, by norm_num, by norm_num⟩

/-- Razlaga 1: x/2 = 4 ⇔ (·2) x = 8.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#razlaga1
besedilo: »Enačba $\dfrac{x}{2}=4$ ima rešitev $8$. Ko obe strani pomnožimo z $2$, dobimo $x=8$: rešitev je ista.« -/
theorem razlaga1 (x : ℝ) : x / 2 = 4 ↔ x = 8 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 1, hitro preverjanje: 10x = 30 ima isto (edino) rešitev kot x = 3.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#razlaga1-preverjanje
besedilo: »Da: prva je druga, pomnožena z $10$.« -/
theorem razlaga1_preverjanje (x : ℝ) : 10 * x = 30 ↔ x = 3 := ⟨fun h => by linarith, fun h => by linarith⟩

/-! ## Razlaga 2 in Bolj natančno: najmanjši skupni večkratnik -/

/-- Razlaga 2 in primeri: lcm(2, 3) = 6, lcm(2, 3, 4) = 12, lcm(4, 6) = 12, lcm(3, 5) = 15,
lcm(4, 6, 2, 3) = 12.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#nsv
besedilo: »Za imenovalca $2$ in $3$ v enačbi s teleskopom je to $6$. Za imenovalce $2$, $3$ in $4$ je to $12$.« -/
theorem nsv :
    Nat.lcm 2 3 = 6 ∧ Nat.lcm (Nat.lcm 2 3) 4 = 12 ∧ Nat.lcm 4 6 = 12 ∧ Nat.lcm 3 5 = 15 ∧
      Nat.lcm (Nat.lcm (Nat.lcm 4 6) 2) 3 = 12 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga 2: tudi 24 je skupni večkratnik 2, 3 in 4 (deluje), a ni najmanjši (12 < 24); pri 4 in 6
je 12 deljivo s 4 in 6.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#nsv-24
besedilo: »Deloval bi tudi večji skupni večkratnik, na primer $24$, a bi dobili večja števila.« -/
theorem nsv_24 : 2 ∣ 24 ∧ 3 ∣ 24 ∧ 4 ∣ 24 ∧ 12 < 24 ∧ 4 ∣ 12 ∧ 6 ∣ 12 := by decide

/-- Razlaga 2 in Bolj natančno: lcm(a, b) je najmanjši pozitiven skupni večkratnik (deli vsakega).
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#nsv-najmanjsi
besedilo: »Vzamemo najmanjše tako število, **najmanjši skupni večkratnik**.« -/
theorem nsv_najmanjsi (a b c : ℕ) (hc : 0 < c) (ha : a ∣ c) (hb : b ∣ c) : Nat.lcm a b ≤ c :=
  Nat.le_of_dvd hc (Nat.lcm_dvd ha hb)

/-- Predpostavke `nsv_najmanjsi` se dajo izpolniti (a = 2, b = 3, c = 24). -/
example : 0 < 24 ∧ 2 ∣ 24 ∧ 3 ∣ 24 := by decide

/-- Bolj natančno: vsak skupni večkratnik c odpravi ulomek z imenovalcem d (d ∣ c, d ≠ 0): c·(a/d) = m·a
za celo število m = c/d.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#vecekratnik-odpravi
besedilo: »Vsak skupni večkratnik odpravi ulomke, ker se z njim pokrajša vsak imenovalec.« -/
theorem vecekratnik_odpravi (c d : ℕ) (hd : d ≠ 0) (h : d ∣ c) (a : ℝ) :
    ∃ m : ℕ, (c:ℝ) * (a / d) = m * a := by
  obtain ⟨m, rfl⟩ := h
  refine ⟨m, ?_⟩
  have : (d:ℝ) ≠ 0 := by exact_mod_cast hd
  push_cast
  field_simp

/-- Predpostavki `vecekratnik_odpravi` se dasta izpolniti (d = 4, c = 12). -/
example : (4:ℕ) ≠ 0 ∧ 4 ∣ 12 := by decide

/-! ## Razlaga 3 in 4: vsak člen, oklepaji -/

/-- Razlaga 3 (tabela): 12·(x/4) = 3x, 12·((x + 1)/3) = 4(x + 1), 12·5 = 60.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#tabela
besedilo: »| $\dfrac{x}{4}$ | $12\cdot\dfrac{x}{4}$ | $3x$ | | $\dfrac{x+1}{3}$ | $12\cdot\dfrac{x+1}{3}$ | $4(x+1)$ | | $5$ | $12\cdot 5$ | $60$ |« -/
theorem tabela (x : ℝ) : 12 * (x / 4) = 3 * x ∧ 12 * ((x + 1) / 3) = 4 * (x + 1) ∧ (12:ℝ) * 5 = 60 := by
  refine ⟨by ring, by ring, by norm_num⟩

/-- Razlaga 4: 12·((x − 2)/6) = 2(x − 2) = 2x − 4 in −2(x − 2) = −2x + 4.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#razlaga4
besedilo: »Iz $12\cdot\dfrac{x-2}{6}$ dobimo $2(x-2)$, nato oklepaj odpravimo: $2x-4$. Oklepaj je posebej pomemben, kadar je pred ulomkom minus. Takrat minus spremeni predznak **vsakemu** členu v oklepaju: $-2(x-2)=-2x+4$.« -/
theorem razlaga4 (x : ℝ) : 12 * ((x - 2) / 6) = 2 * (x - 2) ∧ 2 * (x - 2) = 2 * x - 4 ∧
    -2 * (x - 2) = -2 * x + 4 := by
  refine ⟨by ring, by ring, by ring⟩

/-- Razlaga 4, hitro preverjanje: −6·((x + 1)/3) = −2(x + 1) = −2x − 2.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#razlaga4-preverjanje
besedilo: »Nastane $-2(x+1)=-2x-2$.« -/
theorem razlaga4_preverjanje (x : ℝ) : -6 * ((x + 1) / 3) = -2 * (x + 1) ∧ -2 * (x + 1) = -2 * x - 2 := by
  refine ⟨by ring, by ring⟩

/-- Razlaga 3, Premisli; Pogoste napake 1; Preveri se 3: x/2 + 3 = 5 ⇔ (·2, vsak člen) x + 6 = 10 ⇔ x = 4;
preizkus 4/2 + 3 = 5. Matičev x = 2 ni rešitev (2/2 + 3 = 4 ≠ 5), čeprav reši napačno enačbo x + 3 = 5.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#matic
besedilo: »Pri $x=2$ je leva stran $\dfrac{2}{2}+3=4$, ne $5$. Matic je pozabil pomnožiti člena $3$ in $5$. Pravilno je $x+6=10$, torej $x=4$; preizkus: $\dfrac{4}{2}+3=5$.« -/
theorem matic (x : ℝ) :
    (x / 2 + 3 = 5 ↔ x + 6 = 10) ∧ (x + 6 = 10 ↔ x = 4) ∧ (4:ℝ) / 2 + 3 = 5 ∧
      (2:ℝ) / 2 + 3 = 4 ∧ (4:ℝ) ≠ 5 ∧ (x + 3 = 5 ↔ x = 2) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num, by norm_num, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Pogoste napake 2: −(x − 2) = −x + 2, nikoli −x − 2.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#napaka-minus
besedilo: »Minus pa velja za cel števec, ne le za $x$. Pravilno: $-(x-2)=-x+2$.« -/
theorem napaka_minus (x : ℝ) : -(x - 2) = -x + 2 ∧ -(x - 2) ≠ -x - 2 := by
  refine ⟨by ring, fun h => by linarith⟩

/-- Pogoste napake 3: 12·((3x − 1)/4) = 3(3x − 1) = 9x − 3, nikoli 9x − 1.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#napaka-krajsanje
besedilo: »S $3$ pa je treba pomnožiti cel števec. Pravilno: $3(3x-1)=9x-3$.« -/
theorem napaka_krajsanje (x : ℝ) :
    12 * ((3 * x - 1) / 4) = 3 * (3 * x - 1) ∧ 3 * (3 * x - 1) = 9 * x - 3 ∧ 9 * x - 3 ≠ 9 * x - 1 := by
  refine ⟨by ring, by ring, fun h => by linarith⟩

/-- Pogoste napake 4 (množenje samo ene strani): pri x/3 + x/2 = 5 bi 6·(x/3 + x/2) = 5 dalo x = 1, ki ni
rešitev prvotne enačbe (1/3 + 1/2 ≠ 5).
pomozno – lekcija napako opiše splošno; enačbe x/3 + x/2 = 5 z napačno rešitvijo x = 1 ne zapiše -/
theorem napaka_ena_stran (x : ℝ) : (6 * (x / 3 + x / 2) = 5 ↔ x = 1) ∧ (1:ℝ) / 3 + 1 / 2 ≠ 5 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-! ## Bolj natančno: distributivnost -/

/-- Bolj natančno: 6(x/3 + x/2) = 6·(x/3) + 6·(x/2) = 2x + 3x.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#distributivnost
besedilo: »6\left(\frac{x}{3}+\frac{x}{2}\right)=6\cdot\frac{x}{3}+6\cdot\frac{x}{2}=2x+3x« -/
theorem distributivnost (x : ℝ) : 6 * (x / 3 + x / 2) = 2 * x + 3 * x := by
  calc 6 * (x / 3 + x / 2) = 6 * (x / 3) + 6 * (x / 2) := by ring
    _ = 2 * x + 3 * x := by ring

/-! ## Rešeni primeri -/

/-- Primer 1: x/3 + x/2 = 5 ⇔ 6·(x/3) + 6·(x/2) = 6·5 ⇔ 2x + 3x = 30 ⇔ 5x = 30 ⇔ x = 6.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#primer1
besedilo: »Odgovor: rešitev enačbe je $x=6$.« -/
theorem primer1 (x : ℝ) : x / 3 + x / 2 = 5 ↔ x = 6 := by
  calc x / 3 + x / 2 = 5 ↔ 6 * (x / 3) + 6 * (x / 2) = 6 * 5 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 2 * x + 3 * x = 30 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 5 * x = 30 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 6 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 1, korak 6 (preizkus): 6/3 + 6/2 = 2 + 3 = 5.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#primer1-preizkus
besedilo: »leva stran je $\dfrac{6}{3}+\dfrac{6}{2}=2+3=5$, desna stran je $5$« -/
theorem primer1_preizkus : (6:ℝ) / 3 + 6 / 2 = 5 := by
  calc (6:ℝ) / 3 + 6 / 2 = 2 + 3 := by norm_num
    _ = 5 := by norm_num

/-- Primer 2: (x + 1)/2 − (2x − 1)/3 = 1 ⇔ 6·(x + 1)/2 − 6·(2x − 1)/3 = 6·1 ⇔ 3(x + 1) − 2(2x − 1) = 6 ⇔
3x + 3 − 4x + 2 = 6 ⇔ −x + 5 = 6 ⇔ −x = 1 ⇔ x = −1.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#primer2
besedilo: »Odgovor: rešitev enačbe je $x=-1$.« -/
theorem primer2 (x : ℝ) : (x + 1) / 2 - (2 * x - 1) / 3 = 1 ↔ x = -1 := by
  calc (x + 1) / 2 - (2 * x - 1) / 3 = 1 ↔ 6 * ((x + 1) / 2) - 6 * ((2 * x - 1) / 3) = 6 * 1 :=
        ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 3 * (x + 1) - 2 * (2 * x - 1) = 6 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 3 * x + 3 - 4 * x + 2 = 6 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -x + 5 = 6 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ -x = 1 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = -1 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 2, korak 6 (preizkus): (−1 + 1)/2 − (2·(−1) − 1)/3 = 0/2 − (−3)/3 = 0 − (−1) = 1.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#primer2-preizkus
besedilo: »leva stran je $\dfrac{-1+1}{2}-\dfrac{2\cdot(-1)-1}{3}=\dfrac{0}{2}-\dfrac{-3}{3}=0-(-1)=1$, desna stran je $1$« -/
theorem primer2_preizkus : ((-1:ℝ) + 1) / 2 - (2 * (-1) - 1) / 3 = 1 := by
  calc ((-1:ℝ) + 1) / 2 - (2 * (-1) - 1) / 3 = 0 / 2 - (-3) / 3 := by norm_num
    _ = 0 - (-1) := by norm_num
    _ = 1 := by norm_num

/-- Primer 3: x/3 + 2x/5 + 120 = x ⇔ (·15) 5x + 6x + 1800 = 15x ⇔ 11x + 1800 = 15x ⇔ 1800 = 4x ⇔ x = 450
(vsa pot je 450 milijonov km, edina rešitev).
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#primer3
besedilo: »Odgovor: vsa pot sonde je dolga $450$ milijonov kilometrov.« -/
theorem primer3 (x : ℝ) : x / 3 + 2 * x / 5 + 120 = x ↔ x = 450 := by
  calc x / 3 + 2 * x / 5 + 120 = x ↔ 5 * x + 6 * x + 1800 = 15 * x :=
        ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 11 * x + 1800 = 15 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 1800 = 4 * x := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 450 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 3, korak 7 (preizkus): 450/3 = 150, 2·450/5 = 180, 150 + 180 + 120 = 450.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#primer3-preizkus
besedilo: »Preizkus: $\dfrac{450}{3}=150$, $\dfrac{2\cdot 450}{5}=180$ in $150+180+120=450$.« -/
theorem primer3_preizkus : (450:ℝ) / 3 = 150 ∧ 2 * (450:ℝ) / 5 = 180 ∧ (150:ℝ) + 180 + 120 = 450 := by
  norm_num

/-- Primer 4 in Premisli: (3x − 1)/4 − (x − 2)/6 = x/2 + 1/3 ⇔ (·12) 3(3x − 1) − 2(x − 2) = 6x + 4 ⇔
9x − 3 − 2x + 4 = 6x + 4 ⇔ 7x + 1 = 6x + 4 ⇔ 7x − 6x = 4 − 1 ⇔ x = 3.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#primer4
besedilo: »$7x-6x=4-1$, torej $x=3$.« -/
theorem primer4 (x : ℝ) : (3 * x - 1) / 4 - (x - 2) / 6 = x / 2 + 1 / 3 ↔ x = 3 := by
  calc (3 * x - 1) / 4 - (x - 2) / 6 = x / 2 + 1 / 3 ↔ 3 * (3 * x - 1) - 2 * (x - 2) = 6 * x + 4 :=
        ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 9 * x - 3 - 2 * x + 4 = 6 * x + 4 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 7 * x + 1 = 6 * x + 4 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 7 * x - 6 * x = 4 - 1 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 3 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Primer 4, Premisli (preizkus): leva (3·3 − 1)/4 − (3 − 2)/6 = 2 − 1/6 = 11/6, desna 3/2 + 1/3 =
9/6 + 2/6 = 11/6.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#primer4-preizkus
besedilo: »leva stran je $\dfrac{3\cdot 3-1}{4}-\dfrac{3-2}{6}=2-\dfrac{1}{6}=\dfrac{11}{6}$, desna stran je $\dfrac{3}{2}+\dfrac{1}{3}=\dfrac{9}{6}+\dfrac{2}{6}=\dfrac{11}{6}$« -/
theorem primer4_preizkus :
    ((3:ℝ) * 3 - 1) / 4 - (3 - 2) / 6 = 11 / 6 ∧ (3:ℝ) / 2 + 1 / 3 = 11 / 6 := by
  constructor
  · calc ((3:ℝ) * 3 - 1) / 4 - (3 - 2) / 6 = 2 - 1 / 6 := by norm_num
      _ = 11 / 6 := by norm_num
  · calc (3:ℝ) / 2 + 1 / 3 = 9 / 6 + 2 / 6 := by norm_num
      _ = 11 / 6 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: 6·(x/2) = 3x, 6·(2/3) = 4, 6·(5/6) = 5, zato je pravilna C (3x + 4 = 5); A ima 2 ≠ 4,
B ima desno 5/6 ≠ 5. Enačba je ekvivalentna C.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#preveri1
besedilo: »$6\cdot\dfrac{x}{2}=3x$, $6\cdot\dfrac{2}{3}=4$ in $6\cdot\dfrac{5}{6}=5$, torej $3x+4=5$.« -/
theorem preveri1 (x : ℝ) :
    6 * (x / 2) = 3 * x ∧ (6:ℝ) * (2 / 3) = 4 ∧ (6:ℝ) * (5 / 6) = 5 ∧ (2:ℝ) ≠ 4 ∧ (5:ℝ) / 6 ≠ 5 ∧
      (x / 2 + 2 / 3 = 5 / 6 ↔ 3 * x + 4 = 5) := by
  refine ⟨by ring, by norm_num, by norm_num, by norm_num, by norm_num,
    ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Preveri se 2: x/3 + x/4 = 7 ⇔ 4x + 3x = 84 ⇔ 7x = 84 ⇔ x = 12; preizkus 12/3 + 12/4 = 4 + 3 = 7.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#preveri2
besedilo: »množimo z $12$, $4x+3x=84$, $7x=84$, $x=12$; preizkus $4+3=7$.« -/
theorem preveri2 (x : ℝ) : x / 3 + x / 4 = 7 ↔ x = 12 := by
  calc x / 3 + x / 4 = 7 ↔ 4 * x + 3 * x = 84 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ 7 * x = 84 := ⟨fun h => by linarith, fun h => by linarith⟩
    _ ↔ x = 12 := ⟨fun h => by linarith, fun h => by linarith⟩

/-- Preveri se 2 (preizkus in ocena): 12/3 + 12/4 = 4 + 3 = 7; tretjina in četrtina sta 7/12 > ½ števila
(pri x > 0); pri x = 2 je vsota 7/6 (≈ 1); 50/3 > 16 > 7; rešitev 12 < 14.
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#preveri2-ocena
besedilo: »Tretjina in četrtina skupaj sta malo več kot polovica števila. Polovica števila je malo manj kot $7$, torej je $x$ malo manj kot $14$.« -/
theorem preveri2_ocena :
    (12:ℝ) / 3 + 12 / 4 = 4 + 3 ∧ (4:ℝ) + 3 = 7 ∧ (∀ x : ℝ, x / 3 + x / 4 = 7 / 12 * x) ∧
      (1:ℝ) / 2 < 7 / 12 ∧ (2:ℝ) / 3 + 2 / 4 = 7 / 6 ∧ (16:ℝ) < 50 / 3 ∧ (7:ℝ) < 16 ∧ (12:ℝ) < 14 := by
  refine ⟨by norm_num, by norm_num, fun x => by ring, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Preveri se 4: Nikina enačba x/2 − (x − 1)/3 = 2, pomnožena s 6, je 3x − 2(x − 1) = 12 (6·(x/2) = 3x,
6·((x − 1)/3) = 2(x − 1), 6·2 = 12); pri desni 12 bi dobili 72; 6·(x/3) = 2x ≠ 3x (pri x ≠ 0).
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#preveri4
besedilo: »$6\cdot\dfrac{x}{2}=3x$, $6\cdot\dfrac{x-1}{3}=2(x-1)$ in $6\cdot 2=12$.« -/
theorem preveri4 (x : ℝ) :
    6 * (x / 2 - (x - 1) / 3) = 3 * x - 2 * (x - 1) ∧ (6:ℝ) * 2 = 12 ∧ (6:ℝ) * 12 = 72 ∧
      6 * (x / 3) = 2 * x ∧ (x ≠ 0 → 2 * x ≠ 3 * x) ∧
      (x / 2 - (x - 1) / 3 = 2 ↔ 3 * x - 2 * (x - 1) = 12) := by
  refine ⟨by ring, by norm_num, by norm_num, by ring, fun hx h => hx (by linarith),
    ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Preveri se 5: x/2 + x/3 + 30 = x ⇔ 3x + 2x + 180 = 6x ⇔ x = 180; preizkus 90 + 60 + 30 = 180. Napačno
3x + 2x + 30 = 6x da x = 30; 30 l je šestina od 180, pet šestin od 36 pa je 30 (napačen odgovor 36).
trditev: MAT-OS-9/linearne-enacbe-z-ulomki#preveri5
besedilo: »$\dfrac{x}{2}+\dfrac{x}{3}+30=x$; množimo s $6$: $3x+2x+180=6x$, torej $x=180$. Preizkus: $90+60+30=180$.« -/
theorem preveri5 (x : ℝ) :
    (x / 2 + x / 3 + 30 = x ↔ 3 * x + 2 * x + 180 = 6 * x) ∧ (3 * x + 2 * x + 180 = 6 * x ↔ x = 180) ∧
      (180:ℝ) / 2 + 180 / 3 + 30 = 180 ∧ (90:ℝ) + 60 + 30 = 180 ∧ (3 * x + 2 * x + 30 = 6 * x ↔ x = 30) ∧
      (180:ℝ) / 6 = 30 ∧ (5:ℝ) / 6 * 36 = 30 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_OS_9.LinearneEnacbeZUlomki
