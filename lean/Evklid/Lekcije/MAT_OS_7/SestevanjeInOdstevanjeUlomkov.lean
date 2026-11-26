/-
vir: content/lessons/MAT-OS-7/sestevanje-in-odstevanje-ulomkov.md
sha256: 75b08d17246f8d8fdc51c2d429398e37e3bca1298d5e07589c35d62e72ac7533
Model: ulomki so racionalna števila (`ℚ`); mešano število a b/c je a + b/c (tudi »nestandardna« oblika, npr.
2 15/12 = 2 + 15/12). Pogoji iz lekcije (imenovalci ≠ 0, k ≠ 0) so predpostavke; deljenje z ostankom je na
naravnih številih (`ℕ`). Najmanjši skupni večkratnik v(m, n) je `Nat.lcm`, največji skupni delitelj D(m, n)
`Nat.gcd`. Minute: x ure je 60 · x minut. Lean: x / 0 = 0, zato nekatera pravila veljajo tudi brez pogojev;
zapisana so s pogoji iz lekcije.
Ni v Leanu: trakovi, pita, kosi in simulacija kot slike (dokazani so računi v njih, npr. 3/6 + 2/6 = 5/6,
3/4 + 1/6 = 11/12); postopek v štirih korakih in »rezultat okrajšaj« kot navodilo (dokazani so koraki primerov);
pomen besede »manj« kot odštevanje (prevod besedila); analogija s kovanci kot primerjava (dokazan je le račun
2 · 50 + 3 · 20 = 160); »števila bi bila večja in rezultat bi morali še krajšati« in »najmanjši je najbolj
priročen« kot nasvet (dokazano je, da tudi imenovalca 12 in 24 dasta isti rezultat); »števec je večji od
imenovalca ali enak njemu« kot definicija nepravega ulomka; besedilo napačnih odgovorov v Preveri se (dokazane so
napačne vrednosti, ki jih razlaga navaja).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.SestevanjeInOdstevanjeUlomkov

/-! ## Splošna pravila -/

/-- Razlaga (prva posplošitev), Povzetek: a/c + b/c = (a + b)/c in a/c − b/c = (a − b)/c (c ≠ 0).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#enaka-imenovalca
besedilo: »Pri enakih imenovalcih seštejemo ali odštejemo števca, imenovalec ostane.« -/
theorem enaka_imenovalca (a b c : ℚ) (_hc : c ≠ 0) : a / c + b / c = (a + b) / c ∧ a / c - b / c = (a - b) / c :=
  ⟨(add_div a b c).symm, (sub_div a b c).symm⟩

/-- Predpostavka `enaka_imenovalca` se da izpolniti (c = 7). -/
example := enaka_imenovalca 2 3 7 (by norm_num)

/-- Bolj natančno: a/c je a kosov velikosti 1/c; a kosov in še b kosov iste velikosti je a + b kosov:
a · (1/c) + b · (1/c) = (a + b) · (1/c) = (a + b)/c.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#kosi
besedilo: »Če imamo $a$ kosov in še $b$ kosov iste velikosti, imamo $a + b$ kosov te velikosti, torej $\frac{a + b}{c}$.« -/
theorem kosi (a b c : ℚ) : a / c = a * (1 / c) ∧ a * (1 / c) + b * (1 / c) = (a + b) * (1 / c) ∧
    (a + b) * (1 / c) = (a + b) / c := by
  refine ⟨by ring, by ring, by ring⟩

/-- Bolj natančno, Povzetek: razširjanje je množenje z 1 = k/k: a/b = a/b · k/k = (a · k)/(b · k) (k ≠ 0).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#razsirjanje
besedilo: »\frac{a}{b} = \frac{a}{b} \cdot \frac{k}{k} = \frac{a \cdot k}{b \cdot k}« -/
theorem razsirjanje (a b k : ℚ) (hk : k ≠ 0) : a / b = a / b * (k / k) ∧ a / b * (k / k) = (a * k) / (b * k) := by
  refine ⟨by rw [div_self hk, mul_one], div_mul_div_comm a b k k⟩

/-- Predpostavka `razsirjanje` se da izpolniti (k = 3). -/
example := razsirjanje 1 4 3 (by norm_num)

/-- Bolj natančno: a/b + c/d = (a · d + c · b)/(b · d) (b ≠ 0, d ≠ 0).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#splosna-vsota
besedilo: »V splošnem: $\frac{a}{b} + \frac{c}{d} = \frac{a \cdot d + c \cdot b}{b \cdot d}$.« -/
theorem splosna_vsota (a b c d : ℚ) (hb : b ≠ 0) (hd : d ≠ 0) : a / b + c / d = (a * d + c * b) / (b * d) := by
  field_simp

/-- Predpostavki `splosna_vsota` se dajo izpolniti (b = 4, d = 6). -/
example := splosna_vsota 1 4 1 6 (by norm_num) (by norm_num)

/-- Razlaga (mešana števila), Povzetek: a b/c = a + b/c = (a · c + b)/c (c ≠ 0).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#mesano
besedilo: »Mešano število je vsota: $a\frac{b}{c} = a + \frac{b}{c} = \frac{a \cdot c + b}{c}$.« -/
theorem mesano (a b c : ℚ) (hc : c ≠ 0) : a + b / c = (a * c + b) / c := by field_simp

/-- Predpostavka `mesano` se da izpolniti (c = 5). -/
example := mesano 2 3 5 (by norm_num)

/-- Razlaga (mešana števila): nazaj z deljenjem z ostankom: če je n = q · d + r (d ≠ 0), je n/d = q r/d = q + r/d.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#nazaj-v-mesano
besedilo: »Nazaj gre z deljenjem z ostankom.« -/
theorem nazaj_v_mesano (n q r d : ℕ) (hd : d ≠ 0) (h : n = q * d + r) : (n:ℚ) / d = q + r / d := by
  subst h
  have : (d:ℚ) ≠ 0 := by exact_mod_cast hd
  push_cast; field_simp

/-- Predpostavki `nazaj_v_mesano` se dajo izpolniti (17 = 3 · 5 + 2). -/
example := nazaj_v_mesano 17 3 2 5 (by norm_num) (by norm_num)

/-- Razlaga (računanje z mešanimi števili), Povzetek, Pogoste napake 5: sposojena celota: a b/c = (a − 1) (b + c)/c
(c ≠ 0); če ulomku dodamo c/c = 1, celemu delu pa ne vzamemo 1, število zraste za 1.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#sposodi
besedilo: »pri odštevanju si po potrebi sposodimo celoto in celi del zmanjšamo za $1$.« -/
theorem sposodi (a b c : ℚ) (hc : c ≠ 0) :
    a + b / c = (a - 1) + (b + c) / c ∧ a + (b + c) / c = (a + b / c) + 1 := by
  constructor <;> field_simp <;> ring

/-- Predpostavka `sposodi` se da izpolniti (c = 12). -/
example := sposodi 3 3 12 (by norm_num)

/-! ## Zakaj se tega učimo in razlaga -/

/-- Razlaga (Nikin dan): 1/2 = 3/6, 1/3 = 2/6, 3 + 2 = 5, 1/2 + 1/3 = 3/6 + 2/6 = 5/6 km (in 5/6 pite).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#nika
besedilo: »Nika je preplavala $\frac{5}{6}$ km.« -/
theorem nika : (1:ℚ) / 2 = 3 / 6 ∧ (1:ℚ) / 3 = 2 / 6 ∧ (3:ℚ) + 2 = 5 ∧ (1:ℚ) / 2 + 1 / 3 = 5 / 6 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc (1:ℚ) / 2 + 1 / 3 = 3 / 6 + 2 / 6 := by norm_num
    _ = 5 / 6 := by norm_num

/-- Razlaga, premisli, Pogoste napake 1: 2/5 < 1/2 (2 · 2 < 5); če polovici prišteješ nenegativno število x,
ne dobiš manj kot polovico; zato 1/2 + 1/3 ≠ 2/5 (pravilno 5/6).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#premisli-2-5
besedilo: »$\frac{2}{5}$ je manj kot $\frac{1}{2}$, ker je $2 \cdot 2 < 5$. Če polovici nekaj prišteješ, ne more nastati manj kot polovica.« -/
theorem premisli_2_5 (x : ℚ) (hx : 0 ≤ x) : (2 * 2 : ℚ) < 5 ∧ (2:ℚ) / 5 < 1 / 2 ∧ 1 / 2 ≤ 1 / 2 + x ∧
    (1:ℚ) / 2 + 1 / 3 ≠ 2 / 5 := by
  refine ⟨by norm_num, by norm_num, by linarith, by norm_num⟩

/-- Predpostavka `premisli_2_5` se da izpolniti (x = 1/3). -/
example := premisli_2_5 (1 / 3) (by norm_num)

/-- Razlaga (zakaj šestine): v(2, 3) = 6; tudi 12 in 18 sta skupna večkratnika 2 in 3, z 12 pa dobiš
6/12 + 4/12 = 10/12, kar je treba krajšati na 5/6.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#zakaj-sestine
besedilo: »Najmanjši tak je $v(2, 3) = 6$.« -/
theorem zakaj_sestine : Nat.lcm 2 3 = 6 ∧ (2 ∣ 12 ∧ 3 ∣ 12) ∧ (2 ∣ 18 ∧ 3 ∣ 18) ∧
    (6:ℚ) / 12 + 4 / 12 = 10 / 12 ∧ (10:ℚ) / 12 = 5 / 6 := by
  refine ⟨by norm_num, by decide, by decide, by norm_num, by norm_num⟩

/-- Razlaga (prva posplošitev): 2/7 + 3/7 = 5/7. Druga posplošitev: 1/2 − 1/3 = 3/6 − 2/6 = 1/6.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#razlaga-primeri
besedilo: »Odštevanje teče enako: $\frac{1}{2} - \frac{1}{3} = \frac{3}{6} - \frac{2}{6} = \frac{1}{6}$.« -/
theorem razlaga_primeri : (2:ℚ) / 7 + 3 / 7 = 5 / 7 ∧ (1:ℚ) / 2 - 1 / 3 = 1 / 6 := by
  refine ⟨by norm_num, ?_⟩
  calc (1:ℚ) / 2 - 1 / 3 = 3 / 6 - 2 / 6 := by norm_num
    _ = 1 / 6 := by norm_num

/-- Razlaga (mešana števila): 2 3/5 = (2 · 5 + 3)/5 = 13/5; 17 = 3 · 5 + 2, zato 17/5 = 3 2/5; sposoja:
3 3/12 = 2 15/12, ker je 1 = 12/12.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#mesana-primeri
besedilo: »2\frac{3}{5} = \frac{2 \cdot 5 + 3}{5} = \frac{13}{5}« -/
theorem mesana_primeri : (2:ℚ) + 3 / 5 = (2 * 5 + 3) / 5 ∧ ((2:ℚ) * 5 + 3) / 5 = 13 / 5 ∧
    (17:ℕ) = 3 * 5 + 2 ∧ (17:ℚ) / 5 = 3 + 2 / 5 ∧ (3:ℚ) + 3 / 12 = 2 + 15 / 12 ∧ (1:ℚ) = 12 / 12 := by
  norm_num

/-- Razlaga, premisli: 3 1/4 − 1 = 2 1/4; 5/6 > 1/4, zato je 3 1/4 − 1 5/6 manj kot 2 (natanko 1 5/12).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#premisli-manj-kot-2
besedilo: »Nato odštejemo še $\frac{5}{6}$, kar je več kot $\frac{1}{4}$, zato pademo pod $2$.« -/
theorem premisli_manj_kot_2 : (3:ℚ) + 1 / 4 - 1 = 2 + 1 / 4 ∧ (1:ℚ) / 4 < 5 / 6 ∧
    (3:ℚ) + 1 / 4 - (1 + 5 / 6) < 2 ∧ (3:ℚ) + 1 / 4 - (1 + 5 / 6) = 1 + 5 / 12 := by norm_num

/-- Razlaga (simulacija): v(4, 6) = 12 in 3/4 + 1/6 = 9/12 + 2/12 = 11/12.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#simulacija
besedilo: »Preveri, da je kosov $v(4, 6) = 12$ in da je vsota $\frac{11}{12}$.« -/
theorem simulacija : Nat.lcm 4 6 = 12 ∧ (3:ℚ) / 4 + 1 / 6 = 11 / 12 := by
  refine ⟨by norm_num, ?_⟩
  calc (3:ℚ) / 4 + 1 / 6 = 9 / 12 + 2 / 12 := by norm_num
    _ = 11 / 12 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: v(8, 4) = 8 (8 je večkratnik 4); 1/4 = (1 · 2)/(4 · 2) = 2/8; 3/8 + 1/4 = 3/8 + 2/8 = 5/8; 5 in 8
sta tuji, 5/8 je okrajšan.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#primer1
besedilo: »Odgovor: Matic je v dveh urah prevozil $\frac{5}{8}$ proge.« -/
theorem primer1 : Nat.lcm 8 4 = 8 ∧ 4 ∣ 8 ∧ (1:ℚ) / 4 = (1 * 2) / (4 * 2) ∧ ((1:ℚ) * 2) / (4 * 2) = 2 / 8 ∧
    (3:ℚ) / 8 + 1 / 4 = 5 / 8 ∧ Nat.Coprime 5 8 := by
  refine ⟨by norm_num, by decide, by norm_num, by norm_num, ?_, by norm_num⟩
  calc (3:ℚ) / 8 + 1 / 4 = 3 / 8 + 2 / 8 := by norm_num
    _ = 5 / 8 := by norm_num

/-- Primer 2: 6 = 2 · 3, 10 = 2 · 5, v(6, 10) = 2 · 3 · 5 = 30; 5/6 − 1/10 = 25/30 − 3/30 = 22/30 = 11/15 km
(D(22, 30) = 2).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#primer2
besedilo: »Odgovor: Tim je preplaval $\frac{11}{15}$ km.« -/
theorem primer2 : (6:ℕ) = 2 * 3 ∧ (10:ℕ) = 2 * 5 ∧ Nat.lcm 6 10 = 2 * 3 * 5 ∧ 2 * 3 * 5 = 30 ∧
    (5:ℚ) / 6 = 25 / 30 ∧ (1:ℚ) / 10 = 3 / 30 ∧ Nat.gcd 22 30 = 2 ∧ (5:ℚ) / 6 - 1 / 10 = 11 / 15 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  calc (5:ℚ) / 6 - 1 / 10 = 25 / 30 - 3 / 30 := by norm_num
    _ = 22 / 30 := by norm_num
    _ = 11 / 15 := by norm_num

/-- Primer 3: t = 3 1/4 − (1 1/2 + 1/3) = 3 1/4 − (1 3/6 + 2/6) = 3 1/4 − 1 5/6 = 13/4 − 11/6 = 39/12 − 22/12
= 17/12 = 1 5/12 ure (v(2, 3) = 6, v(4, 6) = 12).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#primer3
besedilo: »Odgovor: za tretjo etapo ostane $1\frac{5}{12}$ ure, to je $1$ ura in $25$ minut.« -/
theorem primer3 : (3 + 1 / 4 : ℚ) - ((1 + 1 / 2) + 1 / 3) = 1 + 5 / 12 := by
  calc (3 + 1 / 4 : ℚ) - ((1 + 1 / 2) + 1 / 3) = (3 + 1 / 4) - ((1 + 3 / 6) + 2 / 6) := by norm_num
    _ = (3 + 1 / 4) - (1 + 5 / 6) := by norm_num
    _ = 13 / 4 - 11 / 6 := by norm_num
    _ = 39 / 12 - 22 / 12 := by norm_num
    _ = 17 / 12 := by norm_num
    _ = 1 + 5 / 12 := by norm_num

/-- Primer 3, koraki 1–7: v(2, 3) = 6, 1 1/2 = 1 3/6, 1/3 = 2/6, 3/6 + 2/6 = 5/6; 3 1/4 = 13/4, 1 5/6 = 11/6;
v(4, 6) = 12, 13/4 = 39/12, 11/6 = 22/12, 39/12 − 22/12 = 17/12; 17 = 1 · 12 + 5; 1/12 ure = 5 min, 5/12 ure = 5 · 5 = 25
min; preizkus: 3 1/4 = 3 3/12, 1 5/6 = 1 10/12; 3 3/12 − 1 10/12 = 2 15/12 − 1 10/12 = 1 5/12 (3/12 < 10/12).
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#primer3-koraki
besedilo: »si sposodimo celoto: $2\frac{15}{12} - 1\frac{10}{12} = 1\frac{5}{12}$.« -/
theorem primer3_koraki : Nat.lcm 2 3 = 6 ∧ (1 + 1 / 2 : ℚ) = 1 + 3 / 6 ∧ (1:ℚ) / 3 = 2 / 6 ∧
    (3:ℚ) / 6 + 2 / 6 = 5 / 6 ∧ (3 + 1 / 4 : ℚ) = 13 / 4 ∧ (1 + 5 / 6 : ℚ) = 11 / 6 ∧ Nat.lcm 4 6 = 12 ∧
    (13:ℚ) / 4 = 39 / 12 ∧ (11:ℚ) / 6 = 22 / 12 ∧ (39:ℚ) / 12 - 22 / 12 = 17 / 12 ∧
    (3 + 1 / 4 : ℚ) = 3 + 3 / 12 ∧ (1 + 5 / 6 : ℚ) = 1 + 10 / 12 ∧ (17:ℕ) = 1 * 12 + 5 ∧ (1:ℚ) / 12 * 60 = 5 ∧
    (5:ℚ) / 12 * 60 = 5 * 5 ∧ (5:ℚ) * 5 = 25 ∧ (3:ℚ) / 12 < 10 / 12 ∧
    (3 + 3 / 12 : ℚ) - (1 + 10 / 12) = (2 + 15 / 12) - (1 + 10 / 12) ∧
    (2 + 15 / 12 : ℚ) - (1 + 10 / 12) = 1 + 5 / 12 := by norm_num

/-- Primer 4: 2 2/3 = 8/3, 1 3/4 = 7/4; v(3, 4) = 12; 8/3 = 32/12, 7/4 = 21/12; 8/3 + 7/4 = 32/12 + 21/12 = 53/12 = 4 5/12 ure (53 = 4 · 12 + 5),
to so 4 ure in 25 minut.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#primer4
besedilo: »$\frac{53}{12} = 4\frac{5}{12}$, ker je $53 = 4 \cdot 12 + 5$. To so $4$ ure in $25$ minut.« -/
theorem primer4 : (2 + 2 / 3 : ℚ) = 8 / 3 ∧ (1 + 3 / 4 : ℚ) = 7 / 4 ∧ Nat.lcm 3 4 = 12 ∧
    (8:ℚ) / 3 = 32 / 12 ∧ (7:ℚ) / 4 = 21 / 12 ∧
    (2 + 2 / 3 : ℚ) + (1 + 3 / 4) = 4 + 5 / 12 ∧ (53:ℕ) = 4 * 12 + 5 ∧ (5:ℚ) / 12 * 60 = 25 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  calc (2 + 2 / 3 : ℚ) + (1 + 3 / 4) = 8 / 3 + 7 / 4 := by norm_num
    _ = 32 / 12 + 21 / 12 := by norm_num
    _ = 53 / 12 := by norm_num
    _ = 4 + 5 / 12 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 2: 1/12 je trikrat manj kot 1/4 (1/4 = 3 · 1/12); pravilno 1/4 = 3/12.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#napaka-imenovalec
besedilo: »Popravek: števec pomnoži z istim številom kot imenovalec, $\frac{1}{4} = \frac{3}{12}$.« -/
theorem napaka_imenovalec : (1:ℚ) / 4 = 3 * (1 / 12) ∧ (1:ℚ) / 4 = 3 / 12 ∧ (1:ℚ) / 4 ≠ 1 / 12 := by norm_num

/-- Pogoste napake 3: 2 3/5 ni 2 · 3/5 = 6/5, ampak 2 + 3/5 = 13/5.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#napaka-zmnozek
besedilo: »Popravek: $2\frac{3}{5} = 2 + \frac{3}{5} = \frac{13}{5}$.« -/
theorem napaka_zmnozek : (2:ℚ) * (3 / 5) = 6 / 5 ∧ (2:ℚ) + 3 / 5 = 13 / 5 ∧ (2:ℚ) + 3 / 5 ≠ 6 / 5 := by norm_num

/-- Pogoste napake 4 in 5: 4 2/6 − 2 3/6 = 3 8/6 − 2 3/6 = 1 5/6, ne 2 1/6; 4 8/6 je za 1 več kot 4 2/6,
pravilno 4 2/6 = 3 8/6.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#napaka-sposoja
besedilo: »Popravek: sposodi si celoto, $3\frac{8}{6} - 2\frac{3}{6} = 1\frac{5}{6}$.« -/
theorem napaka_sposoja : (4 + 2 / 6 : ℚ) - (2 + 3 / 6) = (3 + 8 / 6) - (2 + 3 / 6) ∧
    (3 + 8 / 6 : ℚ) - (2 + 3 / 6) = 1 + 5 / 6 ∧ (4 + 2 / 6 : ℚ) - (2 + 3 / 6) ≠ 2 + 1 / 6 ∧
    (4 + 8 / 6 : ℚ) = (4 + 2 / 6) + 1 ∧ (4 + 2 / 6 : ℚ) = 3 + 8 / 6 ∧ (6:ℚ) / 6 = 1 := by norm_num

/-! ## Drugače -/

/-- Z analogijo: 2 · 50 + 3 · 20 = 160 centov.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#kovanci
besedilo: »$2 \cdot 50 + 3 \cdot 20 = 160$ centov.« -/
theorem kovanci : (2:ℕ) * 50 + 3 * 20 = 160 := by norm_num

/-- Iz vsakdanjega življenja: 1 1/2 = 1 2/4; 1 2/4 + 3/4 = 1 5/4 = 2 1/4 skodelice; 1 3/4 + 2/4 = 1 5/4 = 2 1/4 h,
to sta 2 uri in 15 minut.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#vsakdanje
besedilo: »Skupaj je $1\frac{2}{4} + \frac{3}{4} = 1\frac{5}{4} = 2\frac{1}{4}$ skodelice.« -/
theorem vsakdanje : (1 + 1 / 2 : ℚ) = 1 + 2 / 4 ∧ (1 + 2 / 4 : ℚ) + 3 / 4 = 1 + 5 / 4 ∧
    (1 + 5 / 4 : ℚ) = 2 + 1 / 4 ∧ (1:ℚ) / 2 = 2 / 4 ∧ (1 + 3 / 4 : ℚ) + 2 / 4 = 1 + 5 / 4 ∧ (1:ℚ) / 4 * 60 = 15 := by
  norm_num

/-- Bolj natančno: 1/4 + 1/6 = 6/24 + 4/24 = 10/24 = 5/12, z v(4, 6) = 12 pa 3/12 + 2/12 = 5/12.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#dva-imenovalca
besedilo: »Z najmanjšim skupnim večkratnikom ($12$) pridemo do istega rezultata hitreje: $\frac{3}{12} + \frac{2}{12} = \frac{5}{12}$.« -/
theorem dva_imenovalca : (1:ℚ) / 4 + 1 / 6 = 5 / 12 ∧ (1:ℚ) / 4 + 1 / 6 = 3 / 12 + 2 / 12 ∧
    (3:ℚ) / 12 + 2 / 12 = 5 / 12 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc (1:ℚ) / 4 + 1 / 6 = 6 / 24 + 4 / 24 := by norm_num
    _ = 10 / 24 := by norm_num
    _ = 5 / 12 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: 1 3/4 = 1 + 3/4 = (1 · 4 + 3)/4 = 7/4 ure; 3/4 ure = 3 · 15 = 45 minut; napačno:
1 · 3/4 = 3/4, 13/4 ≠ 7/4.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#preveri1
besedilo: »$1\frac{3}{4} = 1 + \frac{3}{4} = \frac{7}{4}$ ure. Tri četrtine ure so $3 \cdot 15 = 45$ minut.« -/
theorem preveri1 : (1 + 3 / 4 : ℚ) = (1 * 4 + 3) / 4 ∧ ((1:ℚ) * 4 + 3) / 4 = 7 / 4 ∧ (3:ℚ) / 4 * 60 = 3 * 15 ∧
    (3:ℚ) * 15 = 45 ∧ (1:ℚ) * (3 / 4) = 3 / 4 ∧ (13:ℚ) / 4 ≠ 7 / 4 := by norm_num

/-- Preveri se 2: Ana 1/2 + 1/4 = 3/4 = 9/12, Bor 2/3 = 8/12, Cene 1/3 + 1/2 = 5/6 = 10/12: Bor < Ana < Cene.
Napačno seštevanje števcev in imenovalcev: (1 + 1)/(2 + 4) = 2/6, (1 + 1)/(3 + 2) = 2/5.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#preveri2
besedilo: »Ana: $\frac{3}{4} = \frac{9}{12}$, Bor: $\frac{2}{3} = \frac{8}{12}$, Cene: $\frac{5}{6} = \frac{10}{12}$. Od najkrajše razdalje: Bor, Ana, Cene.« -/
theorem preveri2 : (1:ℚ) / 2 + 1 / 4 = 9 / 12 ∧ (2:ℚ) / 3 = 8 / 12 ∧ (1:ℚ) / 3 + 1 / 2 = 10 / 12 ∧
    (2:ℚ) / 3 < 1 / 2 + 1 / 4 ∧ (1:ℚ) / 2 + 1 / 4 < 1 / 3 + 1 / 2 ∧ ((1:ℚ) + 1) / (2 + 4) = 2 / 6 ∧
    ((1:ℚ) + 1) / (3 + 2) = 2 / 5 := by norm_num

/-- Preveri se 3: z imenovalcem 24 (24 : 6 = 4): 1/4 = 6/24, 1/6 = 4/24, vsota 10/24 = 5/12, isti rezultat.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#preveri3
besedilo: »$\frac{1}{4} = \frac{6}{24}$ in $\frac{1}{6} = \frac{4}{24}$, vsota je $\frac{10}{24} = \frac{5}{12}$.« -/
theorem preveri3 : (24:ℕ) / 6 = 4 ∧ (1:ℚ) / 4 = 6 / 24 ∧ (1:ℚ) / 6 = 4 / 24 ∧ (6:ℚ) / 24 + 4 / 24 = 10 / 24 ∧
    (10:ℚ) / 24 = 5 / 12 := by norm_num

/-- Preveri se 4: v(4, 3) = 12; 3/4 + 2/3 = 9/12 + 8/12 = 17/12 = 1 5/12 ure = 1 ura 25 minut; napačna: seštevanje števcev in imenovalcev (3 + 2)/(4 + 3) = 5/7, razširjena le imenovalca
3/12 + 2/12 = 5/12; nobena ni pravi rezultat.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#preveri4
besedilo: »Vsota je $\frac{17}{12} = 1\frac{5}{12}$ ure, to je $1$ ura in $25$ minut.« -/
theorem preveri4 : Nat.lcm 4 3 = 12 ∧ (3:ℚ) / 4 + 2 / 3 = 1 + 5 / 12 ∧ (5:ℚ) / 12 * 60 = 25 ∧
    ((3:ℚ) + 2) / (4 + 3) = 5 / 7 ∧ (3:ℚ) / 12 + 2 / 12 = 5 / 12 ∧
    (3:ℚ) / 4 + 2 / 3 ≠ 5 / 7 ∧ (3:ℚ) / 4 + 2 / 3 ≠ 5 / 12 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (3:ℚ) / 4 + 2 / 3 = 9 / 12 + 8 / 12 := by norm_num
    _ = 17 / 12 := by norm_num
    _ = 1 + 5 / 12 := by norm_num

/-- Preveri se 5: 4 1/3 − 2 1/2 = 4 2/6 − 2 3/6 = 3 8/6 − 2 3/6 = 1 5/6 km; preizkus 2 3/6 + 1 5/6 = 3 8/6 = 4 2/6;
napačni odgovori: obrnjena ulomka (4 − 2) + (3/6 − 2/6) = 2 1/6; celota sposojena, celi del ne zmanjšan
4 8/6 − 2 3/6 = 2 5/6; celi del zmanjšan, ulomka obrnjena (3 − 2) + (3/6 − 2/6) = 1 1/6; nobeden ni pravi.
trditev: MAT-OS-7/sestevanje-in-odstevanje-ulomkov#preveri5
besedilo: »$4\frac{1}{3} - 2\frac{1}{2} = 4\frac{2}{6} - 2\frac{3}{6} = 3\frac{8}{6} - 2\frac{3}{6} = 1\frac{5}{6}$ km.« -/
theorem preveri5 : (4 + 1 / 3 : ℚ) - (2 + 1 / 2) = 1 + 5 / 6 ∧ (2 + 3 / 6 : ℚ) + (1 + 5 / 6) = 3 + 8 / 6 ∧
    (3 + 8 / 6 : ℚ) = 4 + 2 / 6 ∧ ((4:ℚ) - 2) + (3 / 6 - 2 / 6) = 2 + 1 / 6 ∧
    (4 + 8 / 6 : ℚ) - (2 + 3 / 6) = 2 + 5 / 6 ∧ ((3:ℚ) - 2) + (3 / 6 - 2 / 6) = 1 + 1 / 6 ∧
    (1 + 5 / 6 : ℚ) ≠ 2 + 1 / 6 ∧ (1 + 5 / 6 : ℚ) ≠ 2 + 5 / 6 ∧
    (1 + 5 / 6 : ℚ) ≠ 1 + 1 / 6 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  calc (4 + 1 / 3 : ℚ) - (2 + 1 / 2) = (4 + 2 / 6) - (2 + 3 / 6) := by norm_num
    _ = (3 + 8 / 6) - (2 + 3 / 6) := by norm_num
    _ = 1 + 5 / 6 := by norm_num

end Evklid.Lekcije.MAT_OS_7.SestevanjeInOdstevanjeUlomkov
