/-
vir: content/lessons/MAT-SS-1/naravna-in-cela-stevila.md
sha256: ac262d1d563dd69da29d7dfc1b9caa2b311ab9953df68e4e7ec07388527f80c2
Ni v Leanu: zgodba o škržatih in plenilcu kot biološka razlaga (dokazani so večkratniki v(13, 17) = 221, 2245,
v(4, 16) = 16, v(4, 17) = 68); šifriranje, temperatura, dolg, nadstropja, Mrtvo morje (zgledi iz življenja);
»štejemo in urejamo« (opis); risbe številske premice in Vennovega diagrama ter simulacija s kvadrati (dokazani so
koraki algoritma in množice deliteljev 12 in 18); utemeljitev zakonov s pikami v pravokotniku (zakoni so dokazani
splošno); trditev »0 ∉ ℕ« (dogovor o zapisu: v lekciji je ℕ = {1, 2, …}, v Leanu ℕ vsebuje 0, zato je lekcijin ℕ
zapisan kot {n | 1 ≤ n}, ℕ₀ pa kot Leanov ℕ); »ostanki se strogo manjšajo, zato se algoritem konča« je dokazan le
kot r < b (`Nat.mod_lt`); točkovanje.
Dogovori: v Leanu 0 ∣ 0 velja, lekcija pa a ∣ b opredeli le za a ≠ 0, zato imajo lastnosti deljivosti pogoj a ≠ 0,
kjer ga ima lekcija. Deljenje z ostankom je v ℤ (`Int.ediv`, `Int.emod`, ostanek je vedno 0 ≤ r < b pri b > 0).
D(a, b) je `Nat.gcd`, v(a, b) je `Nat.lcm`. Merila za deljivost so dokazana za naravna števila (ℕ₀).
Vrednosti »: « v RACUN so deljenja brez ostanka, zato je celoštevilsko deljenje enako pravemu.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.NaravnaInCelaStevila

/-! ## Razlaga 1–2: ℕ in ℤ -/

/-- Razlaga 1: vsota in produkt naravnih števil sta naravni števili, razlika ne vedno: 3 − 5 = −2 ni naravno.
trditev: MAT-SS-1/naravna-in-cela-stevila#vsota-produkt-razlika
besedilo: »Vsota in produkt dveh naravnih števil sta spet naravni števili, razlika pa ne vedno: $3 - 5$ ni naravno število.« -/
theorem vsota_produkt_razlika (a b : ℕ) (ha : 1 ≤ a) (hb : 1 ≤ b) :
    1 ≤ a + b ∧ 1 ≤ a * b ∧ ¬ ∃ n : ℕ, (n : ℤ) = 3 - 5 := by
  refine ⟨by omega, Nat.one_le_iff_ne_zero.mpr (by positivity), ?_⟩
  rintro ⟨n, hn⟩; omega

/-- Predpostavke `vsota_produkt_razlika` se dajo izpolniti (a = b = 1). -/
example : 1 ≤ (1 : ℕ) ∧ 1 ≤ (1 : ℕ) := ⟨le_rfl, le_rfl⟩

/-- Razlaga 2 in Povzetek: ℕ ⊂ ℕ₀ ⊂ ℤ (prave podmnožice; ℕ = {n ≥ 1}, ℕ₀ = {n ≥ 0}).
trditev: MAT-SS-1/naravna-in-cela-stevila#vkljucitve
besedilo: »in velja $\mathbb{N} \subset \mathbb{N}_0 \subset \mathbb{Z}$.« -/
theorem vkljucitve : {n : ℤ | 1 ≤ n} ⊂ {n : ℤ | 0 ≤ n} ∧ {n : ℤ | 0 ≤ n} ⊂ Set.univ := by
  refine ⟨⟨fun x (hx : 1 ≤ x) => (by omega : (0 : ℤ) ≤ x), fun h => ?_⟩,
    ⟨Set.subset_univ _, fun h => ?_⟩⟩
  · have : (1 : ℤ) ≤ 0 := h (show (0 : ℤ) ≤ 0 from le_rfl); omega
  · have : (0 : ℤ) ≤ -1 := h (Set.mem_univ (-1 : ℤ)); omega

/-- Razlaga 2: x + 5 = 3 nima naravne rešitve, v ℤ pa ima natanko rešitev x = −2.
trditev: MAT-SS-1/naravna-in-cela-stevila#enacba-x5
besedilo: »enačba $x + 5 = 3$ nima naravne rešitve, v $\mathbb{Z}$ pa ima rešitev $x = -2$« -/
theorem enacba_x5 : (∀ x : ℕ, x + 5 ≠ 3) ∧ ∀ x : ℤ, x + 5 = 3 ↔ x = -2 :=
  ⟨fun x => by omega, fun x => by omega⟩

/-- Razlaga 2: a + (−a) = 0; |−5| = 5; nasprotni števili sta enako daleč od 0 (|−a| = |a|).
trditev: MAT-SS-1/naravna-in-cela-stevila#nasprotno-absolutna
besedilo: »Vsako celo število $a$ ima nasprotno število $-a$, za katero je $a + (-a) = 0$. **Absolutna vrednost** $|a|$ je razdalja števila $a$ od $0$ na številski premici, na primer $|-5| = 5$. Na **številski premici** izberemo točko $0$ in enoto. Pozitivna števila nanašamo v desno, negativna v levo. Nasprotni števili ležita na različnih straneh ničle, enako daleč od nje:« -/
theorem nasprotno_absolutna (a : ℤ) : a + (-a) = 0 ∧ |(-5 : ℤ)| = 5 ∧ |-a| = |a| ∧ |a| = |a - 0| :=
  ⟨add_neg_cancel a, by norm_num, abs_neg a, by rw [sub_zero]⟩

/-- Razlaga 2: −5 < −2; 7 : 2 ni celo število; a − (−b) = a + b; |−7| + (−7) = 0 (Preveri).
trditev: MAT-SS-1/naravna-in-cela-stevila#cela-racunanje
besedilo: »zato je $-5 < -2$. V $\mathbb{Z}$ lahko vedno seštevamo, odštevamo in množimo, deliti pa ne vedno ($7 : 2$ ni celo število). Odštevanje je prištevanje nasprotnega števila: $a - (-b) = a + b$.« -/
theorem cela_racunanje (a b : ℤ) : (-5 : ℤ) < -2 ∧ ¬ (2 : ℤ) ∣ 7 ∧ a - (-b) = a + b ∧ |(-7 : ℤ)| + (-7) = 0 :=
  ⟨by norm_num, by decide, sub_neg_eq_add a b, by norm_num⟩

/-- Razlaga 2: produkt števil z enakim predznakom je pozitiven, z različnima negativen.
trditev: MAT-SS-1/naravna-in-cela-stevila#predznak-produkta
besedilo: »Produkt dveh števil z enakim predznakom je pozitiven, z različnima predznakoma pa negativen.« -/
theorem predznak_produkta (a b : ℤ) :
    (0 < a → 0 < b → 0 < a * b) ∧ (a < 0 → b < 0 → 0 < a * b) ∧ (a < 0 → 0 < b → a * b < 0) :=
  ⟨fun ha hb => mul_pos ha hb, fun ha hb => mul_pos_of_neg_of_neg ha hb, fun ha hb => mul_neg_of_neg_of_pos ha hb⟩

/-- Razlaga 2 (zakoni) in Povzetek: zamenljivost, združevalnost, nevtralna elementa, razčlenitev v ℤ.
trditev: MAT-SS-1/naravna-in-cela-stevila#zakoni
besedilo: »zamenljivost (komutativnost): $a + b = b + a$ in $a \cdot b = b \cdot a$, - združevalnost (asociativnost): $(a + b) + c = a + (b + c)$ in $(a \cdot b) \cdot c = a \cdot (b \cdot c)$, - nevtralna elementa: $a + 0 = a$ in $a \cdot 1 = a$, - **razčlenitev** (distributivnost), ki povezuje seštevanje in množenje: $a \cdot (b + c) = a \cdot b + a \cdot c$.« -/
theorem zakoni (a b c : ℤ) :
    a + b = b + a ∧ a * b = b * a ∧ (a + b) + c = a + (b + c) ∧ (a * b) * c = a * (b * c) ∧
    a + 0 = a ∧ a * 1 = a ∧ a * (b + c) = a * b + a * c :=
  ⟨add_comm a b, mul_comm a b, add_assoc a b c, mul_assoc a b c, add_zero a, mul_one a, mul_add a b c⟩

/-- Razlaga 2: primeri zakonov: 3 · 4 = 4 · 3; 6 · 13 = 6 · 10 + 6 · 3 = 78; (−7) + 12 = 12 + (−7) = 5;
((−2) · 5) · 7 = −70 = (−2) · (5 · 7); (−4) · (10 + 3) = −40 + (−12) = −52 = (−4) · 13.
trditev: MAT-SS-1/naravna-in-cela-stevila#zakoni-primeri
besedilo: »Zato je $3 \cdot 4 = 4 \cdot 3$. Pravokotnik $6 \times 13$ razrežemo na $6 \times 10$ in $6 \times 3$, zato je $6 \cdot 13 = 6 \cdot 10 + 6 \cdot 3 = 78$. Enako se izide z negativnimi števili: $(-7) + 12 = 12 + (-7) = 5$, $\big((-2) \cdot 5\big) \cdot 7 = -70 = (-2) \cdot (5 \cdot 7)$ in $(-4) \cdot (10 + 3) = -40 + (-12) = -52 = (-4) \cdot 13$.« -/
theorem zakoni_primeri :
    (3 : ℤ) * 4 = 4 * 3 ∧
    ((6 : ℤ) * 13 = 6 * 10 + 6 * 3 ∧ (6 : ℤ) * 10 + 6 * 3 = 78) ∧
    ((-7 : ℤ) + 12 = 12 + (-7) ∧ (12 : ℤ) + (-7) = 5) ∧
    (((-2 : ℤ) * 5) * 7 = -70 ∧ (-70 : ℤ) = (-2) * (5 * 7)) ∧
    ((-4 : ℤ) * (10 + 3) = -40 + (-12) ∧ (-40 : ℤ) + (-12) = -52 ∧ (-52 : ℤ) = (-4) * 13) := by norm_num

/-- Razlaga 2 in Povzetek: odštevanje in deljenje nista ne zamenljivi ne združevalni (protiprimeri lekcije):
5 − 3 = 2, 3 − 5 = −2; 8 : 2 = 4, 2 : 8 ni celo; (10 − 4) − 3 = 3, 10 − (4 − 3) = 9; (24 : 4) : 2 = 3,
24 : (4 : 2) = 12; 10 − 4 − 3 = 10 + (−4) + (−3).
trditev: MAT-SS-1/naravna-in-cela-stevila#odstevanje-deljenje
besedilo: »Odštevanje in deljenje nista ne zamenljivi ne združevalni. Za vsako trditev zadošča en protiprimer: $5 - 3 = 2$, a $3 - 5 = -2$; $8 : 2 = 4$, a $2 : 8$ ni celo število; $(10 - 4) - 3 = 3$, a $10 - (4 - 3) = 9$; $(24 : 4) : 2 = 3$, a $24 : (4 : 2) = 12$.« -/
theorem odstevanje_deljenje :
    (5 : ℤ) - 3 = 2 ∧ (3 : ℤ) - 5 = -2 ∧ (8 : ℤ) / 2 = 4 ∧ ¬ (8 : ℤ) ∣ 2 ∧
    ((10 : ℤ) - 4) - 3 = 3 ∧ (10 : ℤ) - (4 - 3) = 9 ∧ ((24 : ℤ) / 4) / 2 = 3 ∧ (24 : ℤ) / (4 / 2) = 12 ∧
    (10 : ℤ) - 4 - 3 = 10 + (-4) + (-3) := by decide

/-- Razlaga 2, premisli: (−1) · (−1) = 1 sledi iz razčlenitve: (−1) · (1 + (−1)) = 0 in
(−1) · (1 + (−1)) = −1 + (−1) · (−1).
trditev: MAT-SS-1/naravna-in-cela-stevila#minus-krat-minus
besedilo: »Iz $-1 + (-1) \cdot (-1) = 0$ sledi $(-1) \cdot (-1) = 1$.« -/
theorem minus_krat_minus : (-1 : ℤ) * (-1) = 1 := by
  have h1 : (-1 : ℤ) * (1 + (-1)) = 0 := by rw [add_neg_cancel, mul_zero]
  have h2 : (-1 : ℤ) * (1 + (-1)) = -1 + (-1) * (-1) := by rw [mul_add, mul_one]
  have h3 : -1 + (-1 : ℤ) * (-1) = 0 := h2 ▸ h1
  linarith

/-! ## Razlaga 3–4: deljivost in merila -/

/-- Razlaga 3 in Ustno vprašanje 1: 1 ∣ b; za a ≠ 0 je a ∣ a in a ∣ 0.
trditev: MAT-SS-1/naravna-in-cela-stevila#deljivost-osnovno
besedilo: »$1 \mid b$ za vsak $b$ ter $a \mid a$ in $a \mid 0$ za vsak $a \neq 0$« -/
theorem deljivost_osnovno (a b : ℤ) (_ha : a ≠ 0) : 1 ∣ b ∧ a ∣ a ∧ a ∣ 0 :=
  ⟨one_dvd b, dvd_refl a, dvd_zero a⟩

/-- Predpostavke `deljivost_osnovno` se dajo izpolniti (a = 1). -/
example : (1 : ℤ) ≠ 0 := one_ne_zero

/-- Razlaga 3, Povzetek in Ustno vprašanje 1: a ∣ b, a ∣ c ⇒ a ∣ (b + c), a ∣ (b − c) (b = ka, c = la ⇒
b ± c = (k ± l)a); a ∣ b, b ∣ c ⇒ a ∣ c.
trditev: MAT-SS-1/naravna-in-cela-stevila#deljivost-lastnosti
besedilo: »če $a \mid b$ in $a \mid c$, potem $a \mid (b + c)$ in $a \mid (b - c)$ (iz $b = ka$ in $c = la$ sledi $b \pm c = (k \pm l)a$)« -/
theorem deljivost_lastnosti (a b c k l : ℤ) (hb : b = k * a) (hc : c = l * a) :
    b + c = (k + l) * a ∧ b - c = (k - l) * a ∧ a ∣ b + c ∧ a ∣ b - c := by
  subst hb hc
  exact ⟨by ring, by ring, ⟨k + l, by ring⟩, ⟨k - l, by ring⟩⟩

/-- Predpostavke `deljivost_lastnosti` se dajo izpolniti (a = 1, b = k, c = l). -/
example : (2 : ℤ) = 2 * 1 ∧ (3 : ℤ) = 3 * 1 := by norm_num

/-- Razlaga 3 in Ustno vprašanje 1: prehodnost deljivosti.
trditev: MAT-SS-1/naravna-in-cela-stevila#deljivost-prehodna
besedilo: »če $a \mid b$ in $b \mid c$, potem $a \mid c$« -/
theorem deljivost_prehodna (a b c : ℤ) (h1 : a ∣ b) (h2 : b ∣ c) : a ∣ c := dvd_trans h1 h2

/-- Predpostavke `deljivost_prehodna` se dajo izpolniti (2 ∣ 4 ∣ 8). -/
example : (2 : ℤ) ∣ 4 ∧ (4 : ℤ) ∣ 8 := by decide

/-- Razlaga 3: 4 ∣ 28 (28 = 7 · 4), −3 ∣ 12 (12 = (−4) · (−3)), 7 ∤ 30, −6 ∣ 18 (18 = (−3) · (−6)).
trditev: MAT-SS-1/naravna-in-cela-stevila#deljivost-primeri
besedilo: »Na primer $4 \mid 28$, ker je $28 = 7 \cdot 4$, in $-3 \mid 12$, ker je $12 = (-4) \cdot (-3)$, medtem ko $7 \nmid 30$.« -/
theorem deljivost_primeri : ((28 : ℤ) = 7 * 4 ∧ (4 : ℤ) ∣ 28) ∧ ((12 : ℤ) = (-4) * (-3) ∧ (-3 : ℤ) ∣ 12) ∧
    ¬ (7 : ℤ) ∣ 30 ∧ ((18 : ℤ) = (-3) * (-6) ∧ (-6 : ℤ) ∣ 18) := by decide

/-- Razlaga 4: merila z 2, 5, 10 (zadnja števka), s 4 (zadnji dve), z 8 (zadnje tri).
trditev: MAT-SS-1/naravna-in-cela-stevila#merila-zadnje
besedilo: »merila: $2$, $5$ zadnja števka; $4$ zadnji dve; $8$ zadnje tri« -/
theorem merila_zadnje (n : ℕ) :
    (2 ∣ n ↔ 2 ∣ n % 10) ∧ (5 ∣ n ↔ 5 ∣ n % 10) ∧ (10 ∣ n ↔ n % 10 = 0) ∧
    (4 ∣ n ↔ 4 ∣ n % 100) ∧ (8 ∣ n ↔ 8 ∣ n % 1000) := by omega

/-- Razlaga 4 in Bolj natančno: merili s 3 in z 9 (vsota števk).
trditev: MAT-SS-1/naravna-in-cela-stevila#merila-vsota
besedilo: »Prvi oklepaj je deljiv z $9$, zato odloča le vsota števk. Enako velja za $3$.« -/
theorem merila_vsota (n : ℕ) : (3 ∣ n ↔ 3 ∣ (Nat.digits 10 n).sum) ∧ (9 ∣ n ↔ 9 ∣ (Nat.digits 10 n).sum) :=
  ⟨Nat.three_dvd_iff n, Nat.nine_dvd_iff n⟩

/-- Razlaga 4, premisli: 7316 = 73 · 100 + 16, 100 = 25 · 4, 1000 = 125 · 8.
trditev: MAT-SS-1/naravna-in-cela-stevila#merilo4-razlog
besedilo: »Število razstavimo na stotice in ostanek: $7\,316 = 73 \cdot 100 + 16$. Ker je $100 = 25 \cdot 4$, je del s stoticami vedno deljiv s $4$. Deljivost je zato odvisna le od zadnjih dveh števk. Pri $8$ je razlog $1\,000 = 125 \cdot 8$.« -/
theorem merilo4_razlog : 7316 = 73 * 100 + 16 ∧ 100 = 25 * 4 ∧ 1000 = 125 * 8 := by norm_num

/-- Razlaga 4: primeri tabele: 2 ∣ 1358; 4521 (vsota 12) deljivo s 3; 7316 (16 = 4 · 4) s 4; 2045 s 5; 1332 s 6;
5120 (120 = 8 · 15) z 8; 6354 (vsota 18) z 9; 830 z 10.
trditev: MAT-SS-1/naravna-in-cela-stevila#merila-primeri
besedilo: »| $2$ | zadnja števka je $0, 2, 4, 6$ ali $8$; npr. $1\,358$ | | $3$ | vsota števk je deljiva s $3$; npr. $4\,521$ ($4+5+2+1=12$) | | $4$ | zadnji dve števki tvorita število, deljivo s $4$; npr. $7\,316$ ($16 = 4 \cdot 4$) | | $5$ | zadnja števka je $0$ ali $5$; npr. $2\,045$ | | $6$ | deljivo z $2$ in s $3$; npr. $1\,332$ | | $8$ | zadnje tri števke tvorijo število, deljivo z $8$; npr. $5\,120$ ($120 = 8 \cdot 15$) | | $9$ | vsota števk je deljiva z $9$; npr. $6\,354$ ($6+3+5+4=18$) | | $10$ | zadnja števka je $0$; npr. $830$ |« -/
theorem merila_primeri :
    2 ∣ 1358 ∧ (4 + 5 + 2 + 1 = 12 ∧ 3 ∣ 4521) ∧ (16 = 4 * 4 ∧ 4 ∣ 7316) ∧ 5 ∣ 2045 ∧
    (2 ∣ 1332 ∧ 3 ∣ 1332 ∧ 6 ∣ 1332) ∧ (120 = 8 * 15 ∧ 8 ∣ 5120) ∧ (6 + 3 + 5 + 4 = 18 ∧ 9 ∣ 6354) ∧
    10 ∣ 830 := by decide

/-- Razlaga 4 in Povzetek: tuji m, n, ki delita b ⇒ m · n ∣ b (od tod merili za 6 = 2 · 3 in 36 = 4 · 9).
trditev: MAT-SS-1/naravna-in-cela-stevila#tuja-delitelja
besedilo: »Če sta števili $m$ in $n$ tuji (nimata skupnega pozitivnega delitelja razen $1$) in obe delita $b$, potem tudi njun produkt $m \cdot n$ deli $b$.« -/
theorem tuja_delitelja (m n b : ℕ) (h : Nat.Coprime m n) (hm : m ∣ b) (hn : n ∣ b) : m * n ∣ b :=
  Nat.Coprime.mul_dvd_of_dvd_of_dvd h hm hn

/-- Predpostavke `tuja_delitelja` se dajo izpolniti (2, 3 tuji, oba delita 6). -/
example : Nat.Coprime 2 3 ∧ 2 ∣ 6 ∧ 3 ∣ 6 := by decide

/-- Razlaga 4: merili za 6 in 36; 2 in 3 ter 4 in 9 sta tuja para.
trditev: MAT-SS-1/naravna-in-cela-stevila#merilo6-36
besedilo: »Zato je število deljivo s $6$, če je deljivo z $2$ in s $3$, ter s $36$, če je deljivo s $4$ in z $9$.« -/
theorem merilo6_36 (b : ℕ) : (6 ∣ b ↔ 2 ∣ b ∧ 3 ∣ b) ∧ (36 ∣ b ↔ 4 ∣ b ∧ 9 ∣ b) := by omega

/-- Razlaga 4, Pogoste napake 2 in Preveri se 1: za netuja 2 in 4 ne velja: 2 ∣ 12, 4 ∣ 12, 8 ∤ 12.
trditev: MAT-SS-1/naravna-in-cela-stevila#netuja
besedilo: »Za števili, ki nista tuji, to ne velja: $2$ in $4$ delita $12$, število $8$ pa ne.« -/
theorem netuja : ¬ Nat.Coprime 2 4 ∧ 2 ∣ 12 ∧ 4 ∣ 12 ∧ ¬ 8 ∣ 12 := by decide

/-! ## Razlaga 5: deljenje z ostankom -/

/-- Razlaga 5 in Povzetek: za celo a in b > 0 sta q in r z a = q · b + r, 0 ≤ r < b natanko določena
(q = a / b, r = a % b).
trditev: MAT-SS-1/naravna-in-cela-stevila#deljenje-z-ostankom
besedilo: »Za celo število $a$ in naravno število $b$ obstajata natanko določeni celi števili $q$ (količnik) in $r$ (ostanek), da velja $$a = q \cdot b + r, \qquad 0 \le r < b.$$« -/
theorem deljenje_z_ostankom (a b q r : ℤ) (hb : 0 < b) :
    (a = q * b + r ∧ 0 ≤ r ∧ r < b) ↔ (q = a / b ∧ r = a % b) := by
  constructor
  · rintro ⟨rfl, h0, h1⟩
    have hb0 : b ≠ 0 := hb.ne'
    have hr : r / b = 0 := Int.ediv_eq_zero_of_lt h0 h1
    constructor
    · rw [show q * b + r = r + q * b by ring, Int.add_mul_ediv_right r q hb0, hr, zero_add]
    · rw [show q * b + r = r + q * b by ring, Int.add_mul_emod_self_right, Int.emod_eq_of_lt h0 h1]
  · rintro ⟨rfl, rfl⟩
    refine ⟨?_, Int.emod_nonneg a hb.ne', Int.emod_lt_of_pos a hb⟩
    have := Int.ediv_mul_add_emod a b
    linarith

/-- Predpostavke `deljenje_z_ostankom` se dajo izpolniti (b = 5). -/
example : (0 : ℤ) < 5 := by norm_num

/-- Razlaga 5: b ∣ a natanko tedaj, ko je ostanek 0.
trditev: MAT-SS-1/naravna-in-cela-stevila#deli-ostanek-nic
besedilo: »Število $b$ deli $a$ natanko tedaj, ko je ostanek $r = 0$.« -/
theorem deli_ostanek_nic (a b : ℤ) : b ∣ a ↔ a % b = 0 := Int.dvd_iff_emod_eq_zero

/-- Razlaga 5, Preveri, Pogoste napake 5 in Preveri se 3: 47 = 9 · 5 + 2, −17 = (−4) · 5 + 3, −9 = (−3) · 4 + 3,
17 = 3 · 5 + 2; ostanka pri 17 in −17 sta 2 in 3.
trditev: MAT-SS-1/naravna-in-cela-stevila#ostanki
besedilo: »Na primer $47 = 9 \cdot 5 + 2$ in $-17 = (-4) \cdot 5 + 3$.« -/
theorem ostanki :
    ((47 : ℤ) = 9 * 5 + 2 ∧ (47 : ℤ) / 5 = 9 ∧ (47 : ℤ) % 5 = 2) ∧
    ((-17 : ℤ) = (-4) * 5 + 3 ∧ (-17 : ℤ) / 5 = -4 ∧ (-17 : ℤ) % 5 = 3) ∧
    ((-9 : ℤ) = (-3) * 4 + 3 ∧ (-9 : ℤ) % 4 = 3) ∧ ((17 : ℤ) = 3 * 5 + 2 ∧ (17 : ℤ) % 5 = 2) := by decide

/-- Pogoste napake 5 in Preveri se 3: 47 = 8 · 5 + 7 in −17 = (−3) · 5 − 2 sta pravilni enakosti, a nista
deljenje z ostankom (7 ≥ 5, −2 < 0).
trditev: MAT-SS-1/naravna-in-cela-stevila#napacni-ostanki
besedilo: »Zapišeš $47 = 8 \cdot 5 + 7$ ali $-17 = (-3) \cdot 5 - 2$. Razlog: ostanek mora ležati v območju $0 \le r < b$.« -/
theorem napacni_ostanki : (47 : ℤ) = 8 * 5 + 7 ∧ ¬ (7 : ℤ) < 5 ∧ (-17 : ℤ) = (-3) * 5 + (-2) ∧ ¬ (0 : ℤ) ≤ -2 := by
  decide

/-! ## Razlaga 6: praštevila in razcep -/

/-- Razlaga 6 in Povzetek: p je praštevilo natanko tedaj, ko ima natanko dva pozitivna delitelja.
trditev: MAT-SS-1/naravna-in-cela-stevila#prastevilo-dva-delitelja
besedilo: »Naravno število $p > 1$ je **praštevilo**, če ima natanko dva pozitivna delitelja, $1$ in $p$.« -/
theorem prastevilo_dva_delitelja (p : ℕ) : Nat.Prime p ↔ p.divisors.card = 2 := by
  constructor
  · intro hp
    rw [Nat.Prime.divisors hp, Finset.card_pair hp.one_lt.ne]
  · intro h
    have hp0 : p ≠ 0 := by rintro rfl; simp at h
    have hp1 : p ≠ 1 := by rintro rfl; simp at h
    have hsub : ({1, p} : Finset ℕ) ⊆ p.divisors := by
      intro x hx
      simp only [Finset.mem_insert, Finset.mem_singleton] at hx
      rcases hx with rfl | rfl
      · exact Nat.one_mem_divisors.mpr hp0
      · exact Nat.mem_divisors_self _ hp0
    have heq : ({1, p} : Finset ℕ) = p.divisors :=
      Finset.eq_of_subset_of_card_le hsub (by rw [h, Finset.card_pair (Ne.symm hp1)])
    refine Nat.prime_def.mpr ⟨by omega, fun m hm => ?_⟩
    have : m ∈ ({1, p} : Finset ℕ) := heq ▸ Nat.mem_divisors.mpr ⟨hm, hp0⟩
    simpa using this

/-- Razlaga 6, Pogoste napake 1 in Preveri se 1: 1 ni praštevilo in ni sestavljeno (ni večje od 1); 9 ima tri
delitelje 1, 3, 9; 1 ima en sam delitelj; 9, 15, 21 in 91 = 7 · 13 so liha sestavljena števila.
trditev: MAT-SS-1/naravna-in-cela-stevila#ena-in-liha
besedilo: »Razlog: praštevilo mora imeti natanko dva pozitivna delitelja, število $1$ ima en sam delitelj, število $9$ pa tri ($1$, $3$ in $9$). Pravilno: preštej delitelje. Liha števila $9$, $15$ in $21$ so sestavljena.« -/
theorem ena_in_liha : ¬ Nat.Prime 1 ∧ ¬ (1 < 1) ∧ Nat.divisors 1 = {1} ∧ (Nat.divisors 9 = {1, 3, 9}) ∧ ¬ Nat.Prime 9 ∧
    ¬ Nat.Prime 15 ∧ ¬ Nat.Prime 21 ∧ 91 = 7 * 13 ∧ ¬ Nat.Prime 91 := by
  refine ⟨Nat.not_prime_one, by omega, by decide, by decide, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga 6: 2 je edino sodo praštevilo.
trditev: MAT-SS-1/naravna-in-cela-stevila#dva-edino-sodo
besedilo: »Število $2$ je edino sodo praštevilo.« -/
theorem dva_edino_sodo (p : ℕ) (hp : Nat.Prime p) (h : Even p) : p = 2 :=
  (Nat.Prime.even_iff hp).mp h

/-- Predpostavke `dva_edino_sodo` se dajo izpolniti (p = 2). -/
example : Nat.Prime 2 ∧ Even 2 := ⟨Nat.prime_two, even_two⟩

/-- Razlaga 6: praštevila do 50.
trditev: MAT-SS-1/naravna-in-cela-stevila#prastevila-do-50
besedilo: »Praštevila do $50$ so: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47$.« -/
theorem prastevila_do_50 : (Finset.range 51).filter Nat.Prime =
    {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47} := by decide

/-- Razlaga 6: če je n = a · b in a ≤ b, je a² ≤ n (lekcija uporabi 1 < a ≤ b; izrek velja tudi brez 1 < a).
trditev: MAT-SS-1/naravna-in-cela-stevila#delitelj-kvadrat
besedilo: »Če je namreč $n = a \cdot b$ z $1 < a \le b$, je $a^2 \le a \cdot b = n$.« -/
theorem delitelj_kvadrat (n a b : ℕ) (h : n = a * b) (hab : a ≤ b) : a ^ 2 ≤ n := by
  subst h; rw [sq]; exact Nat.mul_le_mul_left a hab

/-- Predpostavke `delitelj_kvadrat` se dajo izpolniti (n = 6 = 2 · 3). -/
example : (6 : ℕ) = 2 * 3 ∧ 2 ≤ 3 := by decide

/-- Razlaga 6: sestavljeno število n > 1 ima prafaktor p s p² ≤ n (zato zadošča poskusiti praštevila s p² ≤ n).
trditev: MAT-SS-1/naravna-in-cela-stevila#prafaktor-kvadrat
besedilo: »Sestavljeno število ima torej delitelj $a$ z $a^2 \le n$, in tak delitelj je tudi vsak prafaktor števila $a$.« -/
theorem prafaktor_kvadrat (n : ℕ) (hn : 1 < n) (h : ¬ Nat.Prime n) :
    ∃ p, Nat.Prime p ∧ p ∣ n ∧ p ^ 2 ≤ n :=
  ⟨n.minFac, Nat.minFac_prime (by omega), Nat.minFac_dvd n, Nat.minFac_sq_le_self (by omega) h⟩

/-- Predpostavke `prafaktor_kvadrat` se dajo izpolniti (n = 4). -/
example : 1 < 4 ∧ ¬ Nat.Prime 4 := ⟨by norm_num, by norm_num⟩

/-- Razlaga 6, Preveri: 97 je praštevilo; ne delijo ga 2, 3, 5, 7, in 11² = 121 > 97.
trditev: MAT-SS-1/naravna-in-cela-stevila#p97
besedilo: »Da: ne delijo ga $2$, $3$, $5$ in $7$, naslednje praštevilo pa ima $11^2 = 121 > 97$.« -/
theorem p97 : Nat.Prime 97 ∧ ¬ 2 ∣ 97 ∧ ¬ 3 ∣ 97 ∧ ¬ 5 ∣ 97 ∧ ¬ 7 ∣ 97 ∧ 11 ^ 2 = 121 ∧ 97 < 121 :=
  ⟨by norm_num, by decide, by decide, by decide, by decide, by norm_num, by norm_num⟩

/-- Preveri se 1: 59 je praštevilo; praštevila s p² ≤ 59 so 2, 3, 5, 7 in nobeno ne deli 59.
trditev: MAT-SS-1/naravna-in-cela-stevila#p59
besedilo: »Praštevila $p$ s $p^2 \le 59$ so $2$, $3$, $5$ in $7$. Nobeno ne deli $59$, zato je $59$ praštevilo.« -/
theorem p59 : Nat.Prime 59 ∧ ¬ 2 ∣ 59 ∧ ¬ 3 ∣ 59 ∧ ¬ 5 ∣ 59 ∧ ¬ 7 ∣ 59 ∧ 7 ^ 2 ≤ 59 ∧ 59 < 11 ^ 2 :=
  ⟨by norm_num, by decide, by decide, by decide, by decide, by norm_num, by norm_num⟩

/-- Razlaga 6 (osnovni izrek aritmetike): vsako n > 1 je produkt praštevil, in to na en sam način do vrstnega reda
(vsak seznam praštevil s produktom n je permutacija seznama `primeFactorsList n`).
trditev: MAT-SS-1/naravna-in-cela-stevila#osnovni-izrek
besedilo: »vsako naravno število $n > 1$ je produkt praštevil, in to na en sam način (do vrstnega reda faktorjev)« -/
theorem osnovni_izrek (n : ℕ) (hn : 1 < n) :
    (n.primeFactorsList.prod = n ∧ ∀ p ∈ n.primeFactorsList, Nat.Prime p) ∧
    ∀ l : List ℕ, l.prod = n → (∀ p ∈ l, Nat.Prime p) → l.Perm n.primeFactorsList :=
  ⟨⟨Nat.prod_primeFactorsList (by omega), fun _ hp => Nat.prime_of_mem_primeFactorsList hp⟩,
    fun _ h1 h2 => Nat.primeFactorsList_unique h1 h2⟩

/-- Predpostavke `osnovni_izrek` se dajo izpolniti (n = 360). -/
example : 1 < 360 := by norm_num

/-- Razlaga 6: 360 = 2 · 2 · 2 · 3 · 3 · 5 = 2³ · 3² · 5 in to je razcep na praštevila.
trditev: MAT-SS-1/naravna-in-cela-stevila#razcep-360
besedilo: »Na primer $360 = 2 \cdot 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5 = 2^3 \cdot 3^2 \cdot 5$.« -/
theorem razcep_360 : (360 = 2 * 2 * 2 * 3 * 3 * 5 ∧ 2 * 2 * 2 * 3 * 3 * 5 = 2 ^ 3 * 3 ^ 2 * 5) ∧
    [2, 2, 2, 3, 3, 5].Perm (Nat.primeFactorsList 360) :=
  ⟨by norm_num, Nat.primeFactorsList_unique (by norm_num) (by
    intro p hp; simp only [List.mem_cons, List.not_mem_nil, or_false] at hp
    rcases hp with rfl | rfl | rfl | rfl | rfl | rfl <;> norm_num)⟩

/-- Razlaga 6: praštevil je neskončno mnogo.
trditev: MAT-SS-1/naravna-in-cela-stevila#neskoncno-prastevil
besedilo: »Praštevil je neskončno mnogo.« -/
theorem neskoncno_prastevil : {p : ℕ | Nat.Prime p}.Infinite := Nat.infinite_setOfPred_prime

/-- Ustno vprašanje 2 in Bolj natančno: za vsako končno množico praštevil S nobeno praštevilo iz S ne deli
N = (produkt S) + 1, N > 1 pa ima prafaktor (ki zato ni v S).
trditev: MAT-SS-1/naravna-in-cela-stevila#evklidov-dokaz
besedilo: »Pri deljenju z vsakim $p_i$ da ostanek $1$, torej ga nobeno od njih ne deli. Toda $N > 1$ ima nek prafaktor, ki je praštevilo, a ni nobeno od $p_1, \dots, p_n$.« -/
theorem evklidov_dokaz (S : Finset ℕ) (hS : ∀ p ∈ S, Nat.Prime p) :
    (∀ p ∈ S, ¬ p ∣ S.prod id + 1) ∧ 1 < S.prod id + 1 ∧ ∃ q, Nat.Prime q ∧ q ∣ S.prod id + 1 ∧ q ∉ S := by
  have hdv : ∀ p ∈ S, ¬ p ∣ S.prod id + 1 := by
    intro p hp h
    have h1 : p ∣ S.prod id := Finset.dvd_prod_of_mem id hp
    have : p ∣ 1 := (Nat.dvd_add_right h1).mp h
    exact (hS p hp).one_lt.ne' (Nat.dvd_one.mp this)
  have hpos : 0 < S.prod id := Finset.prod_pos (fun p hp => (hS p hp).pos)
  refine ⟨hdv, by omega, (S.prod id + 1).minFac, Nat.minFac_prime (by omega), Nat.minFac_dvd _, ?_⟩
  intro hq; exact hdv _ hq (Nat.minFac_dvd _)

/-- Predpostavke `evklidov_dokaz` se dajo izpolniti (S = {2, 3}). -/
example : ∀ p ∈ ({2, 3} : Finset ℕ), Nat.Prime p := by
  intro p hp; simp only [Finset.mem_insert, Finset.mem_singleton] at hp; rcases hp with rfl | rfl <;> norm_num

/-! ## Razlaga 7–8: D, v in Evklidov algoritem -/

/-- Razlaga 7: D(a, b) deli a in b in je največji tak (za a, b > 0); v(a, b) je pozitiven skupni večkratnik in
najmanjši tak.
trditev: MAT-SS-1/naravna-in-cela-stevila#d-in-v
besedilo: »Največji skupni delitelj $D(a, b)$ je največje naravno število, ki deli $a$ in $b$. Najmanjši skupni večkratnik $v(a, b)$ je najmanjše naravno število, ki ga delita $a$ in $b$.« -/
theorem d_in_v (a b : ℕ) (ha : 0 < a) (hb : 0 < b) :
    (Nat.gcd a b ∣ a ∧ Nat.gcd a b ∣ b ∧ ∀ d, d ∣ a → d ∣ b → d ≤ Nat.gcd a b) ∧
    (0 < Nat.lcm a b ∧ a ∣ Nat.lcm a b ∧ b ∣ Nat.lcm a b ∧ ∀ m, 0 < m → a ∣ m → b ∣ m → Nat.lcm a b ≤ m) := by
  refine ⟨⟨Nat.gcd_dvd_left a b, Nat.gcd_dvd_right a b, fun d hda hdb =>
    Nat.le_of_dvd (Nat.gcd_pos_of_pos_left b ha) (Nat.dvd_gcd hda hdb)⟩,
    ⟨Nat.lcm_pos ha hb, Nat.dvd_lcm_left a b, Nat.dvd_lcm_right a b, fun m hm ham hbm =>
    Nat.le_of_dvd hm (Nat.lcm_dvd ham hbm)⟩⟩

/-- Predpostavke `d_in_v` se dajo izpolniti (a = 12, b = 18). -/
example : 0 < 12 ∧ 0 < 18 := by norm_num

/-- Razlaga 7 (jezik množic) in Na sliki: skupni delitelji so delitelji D(a, b), zato je D(a, b) največji element
preseka množic deliteljev.
trditev: MAT-SS-1/naravna-in-cela-stevila#presek-deliteljev
besedilo: »V jeziku množic: $D(a, b)$ je največji element preseka množic deliteljev« -/
theorem presek_deliteljev (a b : ℕ) (ha : a ≠ 0) (hb : b ≠ 0) :
    a.divisors ∩ b.divisors = (Nat.gcd a b).divisors ∧ Nat.gcd a b ∈ a.divisors ∩ b.divisors ∧
    ∀ d ∈ a.divisors ∩ b.divisors, d ≤ Nat.gcd a b := by
  have hg : Nat.gcd a b ≠ 0 := Nat.gcd_ne_zero_left ha
  refine ⟨?_, ?_, ?_⟩
  rotate_left
  · simp only [Finset.mem_inter, Nat.mem_divisors]
    exact ⟨⟨Nat.gcd_dvd_left a b, ha⟩, Nat.gcd_dvd_right a b, hb⟩
  · intro d hd
    simp only [Finset.mem_inter, Nat.mem_divisors] at hd
    exact Nat.le_of_dvd (Nat.pos_of_ne_zero hg) (Nat.dvd_gcd hd.1.1 hd.2.1)
  ext d
  simp only [Finset.mem_inter, Nat.mem_divisors, Nat.dvd_gcd_iff]
  constructor
  · rintro ⟨⟨h1, _⟩, h2, _⟩; exact ⟨⟨h1, h2⟩, Nat.gcd_ne_zero_left ha⟩
  · rintro ⟨⟨h1, h2⟩, _⟩; exact ⟨⟨h1, ha⟩, h2, hb⟩

/-- Predpostavke `presek_deliteljev` se dajo izpolniti (a = 12, b = 18). -/
example : (12 : ℕ) ≠ 0 ∧ (18 : ℕ) ≠ 0 := by norm_num

/-- Drugače: Na sliki: delitelji 12 in 18: samo 12: {4, 12}, samo 18: {9, 18}, skupni {1, 2, 3, 6}, največji
D(12, 18) = 6; prvi skupni večkratnik v(12, 18) = 36.
trditev: MAT-SS-1/naravna-in-cela-stevila#venn-12-18
besedilo: »Samo v levem krogu (delitelji števila $12$) sta $4$ in $12$. Samo v desnem krogu (delitelji števila $18$) sta $9$ in $18$. V prekrivanju so skupni delitelji $1, 2, 3, 6$. Največji element prekrivanja je $D(12, 18) = 6$. Podobno velja pri večkratnikih: večkratniki števila $12$ so $12, 24, 36, 48, \dots$, večkratniki števila $18$ pa $18, 36, 54, 72, \dots$ Prvi skupni večkratnik je $36$, torej $v(12, 18) = 36$.« -/
theorem venn_12_18 :
    Nat.divisors 12 \ Nat.divisors 18 = {4, 12} ∧ Nat.divisors 18 \ Nat.divisors 12 = {9, 18} ∧
    Nat.divisors 12 ∩ Nat.divisors 18 = {1, 2, 3, 6} ∧ Nat.gcd 12 18 = 6 ∧ Nat.lcm 12 18 = 36 ∧
    (Finset.Icc 1 35).filter (fun m => 12 ∣ m ∧ 18 ∣ m) = ∅ := by decide

/-- Razlaga 7: D(a, b) ima v razcepu manjši eksponent vsakega praštevila, v(a, b) večjega.
trditev: MAT-SS-1/naravna-in-cela-stevila#d-v-eksponenti
besedilo: »$D(a, b)$ je produkt prafaktorjev, ki nastopajo v *obeh* številih, vsakega z *manjšim* eksponentom, - $v(a, b)$ je produkt *vseh* prafaktorjev, ki nastopajo v vsaj enem številu, vsakega z *večjim* eksponentom« -/
theorem d_v_eksponenti (a b : ℕ) (ha : a ≠ 0) (hb : b ≠ 0) :
    (Nat.gcd a b).factorization = a.factorization ⊓ b.factorization ∧
    (Nat.lcm a b).factorization = a.factorization ⊔ b.factorization :=
  ⟨Nat.factorization_gcd ha hb, Nat.factorization_lcm ha hb⟩

/-- Predpostavke `d_v_eksponenti` se dajo izpolniti (a = 252, b = 420). -/
example : (252 : ℕ) ≠ 0 ∧ (420 : ℕ) ≠ 0 := by norm_num

/-- Razlaga 7, Povzetek (višja raven) in Bolj natančno: D(a, b) · v(a, b) = a · b; razlog: min(α, β) + max(α, β)
= α + β za poljubna α, β (za eksponente praštevila v a in b skupaj z `d_v_eksponenti`).
trditev: MAT-SS-1/naravna-in-cela-stevila#d-krat-v
besedilo: »za naravni števili $a$ in $b$ velja $D(a, b) \cdot v(a, b) = a \cdot b$« -/
theorem d_krat_v (a b : ℕ) (α β : ℕ) : Nat.gcd a b * Nat.lcm a b = a * b ∧ min α β + max α β = α + β :=
  ⟨Nat.gcd_mul_lcm a b, min_add_max α β⟩

/-- Razlaga 7: različni praštevili sta tuji in v(p, q) = p · q.
trditev: MAT-SS-1/naravna-in-cela-stevila#prastevili-tuji
besedilo: »sta različni praštevili, zato sta tuji« -/
theorem prastevili_tuji (p q : ℕ) (hp : Nat.Prime p) (hq : Nat.Prime q) (h : p ≠ q) :
    Nat.Coprime p q ∧ Nat.lcm p q = p * q :=
  ⟨(Nat.coprime_primes hp hq).mpr h, Nat.Coprime.lcm_eq_mul ((Nat.coprime_primes hp hq).mpr h)⟩

/-- Predpostavke `prastevili_tuji` se dajo izpolniti (13 in 17). -/
example : Nat.Prime 13 ∧ Nat.Prime 17 ∧ (13 : ℕ) ≠ 17 := by norm_num

/-- Razlaga 7 (uganka in premisli): v(13, 17) = 13 · 17 = 221, 2024 + 221 = 2245; v(4, 16) = 16, v(4, 17) = 68 =
4 · 17 (vsak četrti pojav).
trditev: MAT-SS-1/naravna-in-cela-stevila#skrzati
besedilo: »$v(13, 17) = 13 \cdot 17 = 221$. Obe vrsti se spet pojavita hkrati leta $2024 + 221 = 2245$.« -/
theorem skrzati : Nat.lcm 13 17 = 13 * 17 ∧ 13 * 17 = 221 ∧ 2024 + 221 = 2245 ∧ Nat.lcm 4 16 = 16 ∧
    Nat.lcm 4 17 = 68 ∧ 68 = 4 * 17 := by decide

/-- Razlaga 8, Ustno vprašanje 3 in Bolj natančno: če je a = q · b + r, imata a, b in b, r iste skupne
delitelje, zato D(a, b) = D(b, r) (da je ostanek manjši od b, je v `ostanek_manjsi`).
trditev: MAT-SS-1/naravna-in-cela-stevila#evklid-korak
besedilo: »Števili $a$, $b$ in števili $b$, $r$ imata torej iste skupne delitelje, zato tudi isti največji skupni delitelj.« -/
theorem evklid_korak (a b q r : ℕ) (h : a = q * b + r) :
    (∀ d, (d ∣ a ∧ d ∣ b) ↔ (d ∣ b ∧ d ∣ r)) ∧ Nat.gcd a b = Nat.gcd b r := by
  subst h
  have key : ∀ d, (d ∣ q * b + r ∧ d ∣ b) ↔ (d ∣ b ∧ d ∣ r) := by
    intro d
    constructor
    · rintro ⟨h1, h2⟩; exact ⟨h2, (Nat.dvd_add_right (Dvd.dvd.mul_left h2 q)).mp h1⟩
    · rintro ⟨h1, h2⟩; exact ⟨Nat.dvd_add (Dvd.dvd.mul_left h1 q) h2, h1⟩
  refine ⟨key, Nat.dvd_antisymm ?_ ?_⟩
  · have := (key _).mp ⟨Nat.gcd_dvd_left _ _, Nat.gcd_dvd_right _ _⟩
    exact Nat.dvd_gcd this.1 this.2
  · have := (key _).mpr ⟨Nat.gcd_dvd_left _ _, Nat.gcd_dvd_right _ _⟩
    exact Nat.dvd_gcd this.1 this.2

/-- Razlaga 8: ostanek je manjši od delitelja, zato ostanki v algoritmu padajo.
trditev: MAT-SS-1/naravna-in-cela-stevila#ostanek-manjsi
besedilo: »Ostanki so nenegativni in se strogo manjšajo« -/
theorem ostanek_manjsi (a b : ℕ) (hb : 0 < b) : a % b < b := Nat.mod_lt a hb

/-- Predpostavke `ostanek_manjsi` se dajo izpolniti. -/
example : (0 : ℕ) < 18 := by norm_num

/-- Razlaga 8 (in simulacija): 48 = 2 · 18 + 12, 18 = 1 · 12 + 6, 12 = 2 · 6 + 0, zato D(48, 18) = 6.
trditev: MAT-SS-1/naravna-in-cela-stevila#evklid-48-18
besedilo: »$48 = 2 \cdot 18 + 12$, $18 = 1 \cdot 12 + 6$, $12 = 2 \cdot 6 + 0$, zato je $D(48, 18) = 6$.« -/
theorem evklid_48_18 : Nat.gcd 48 18 = 6 := by
  calc Nat.gcd 48 18 = Nat.gcd 18 12 := (evklid_korak 48 18 2 12 (by norm_num)).2
    _ = Nat.gcd 12 6 := (evklid_korak 18 12 1 6 (by norm_num)).2
    _ = Nat.gcd 6 0 := (evklid_korak 12 6 2 0 (by norm_num)).2
    _ = 6 := Nat.gcd_zero_right 6

/-- Razlaga 8, Preveri: 35 = 1 · 21 + 14, 21 = 1 · 14 + 7, 14 = 2 · 7 + 0, zato D(35, 21) = 7.
trditev: MAT-SS-1/naravna-in-cela-stevila#evklid-35-21
besedilo: »$35 = 1 \cdot 21 + 14$, $21 = 1 \cdot 14 + 7$, $14 = 2 \cdot 7 + 0$, torej $7$.« -/
theorem evklid_35_21 : Nat.gcd 35 21 = 7 := by
  calc Nat.gcd 35 21 = Nat.gcd 21 14 := (evklid_korak 35 21 1 14 (by norm_num)).2
    _ = Nat.gcd 14 7 := (evklid_korak 21 14 1 7 (by norm_num)).2
    _ = Nat.gcd 7 0 := (evklid_korak 14 7 2 0 (by norm_num)).2
    _ = 7 := Nat.gcd_zero_right 7

/-! ## Rešeni primeri -/

/-- Primer 1: 4536: zadnja števka 6 (deljivo z 2, ne s 5), vsota števk 4 + 5 + 3 + 6 = 18 (deljivo s 3 in 9),
36 = 4 · 9 (deljivo s 4), zato tudi s 36: 4536 = 36 · 126.
trditev: MAT-SS-1/naravna-in-cela-stevila#primer1
besedilo: »Odgovor: število $4\,536$ je deljivo z $2$, $3$, $4$ in $9$, s $5$ pa ni deljivo. Ker sta $4$ in $9$ tuji števili, je deljivo tudi s $36$: $4\,536 = 36 \cdot 126$.« -/
theorem primer1 :
    4536 % 10 = 6 ∧ 2 ∣ 4536 ∧ ¬ 5 ∣ 4536 ∧ Nat.digits 10 4536 = [6, 3, 5, 4] ∧ 4 + 5 + 3 + 6 = 18 ∧
    3 ∣ 4536 ∧ 9 ∣ 4536 ∧ 4536 % 100 = 36 ∧ 36 = 4 * 9 ∧ 4 ∣ 4536 ∧ Nat.Coprime 4 9 ∧ 4536 = 36 * 126 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by decide, by norm_num⟩

/-- Primer 2: 252 = 2 · 126 = 2 · 2 · 63 = 2 · 2 · 3 · 3 · 7 = 2² · 3² · 7; 420 = 2 · 210 = 2 · 2 · 105 =
2 · 2 · 3 · 5 · 7 = 2² · 3 · 5 · 7; D = 2² · 3 · 7 = 4 · 3 · 7 = 84; v = 4 · 9 · 5 · 7 = 1260; preizkus
84 · 1260 = 105840 = 252 · 420.
trditev: MAT-SS-1/naravna-in-cela-stevila#primer2
besedilo: »Odgovor: $D(252, 420) = 84$ in $v(252, 420) = 1\,260$.« -/
theorem primer2 :
    (252 = 2 * 126 ∧ 2 * 126 = 2 * 2 * 63 ∧ 2 * 2 * 63 = 2 * 2 * 3 * 3 * 7 ∧ 2 * 2 * 3 * 3 * 7 = 2 ^ 2 * 3 ^ 2 * 7) ∧
    (420 = 2 * 210 ∧ 2 * 210 = 2 * 2 * 105 ∧ 2 * 2 * 105 = 2 * 2 * 3 * 5 * 7 ∧
      2 * 2 * 3 * 5 * 7 = 2 ^ 2 * 3 * 5 * 7) ∧
    (Nat.gcd 252 420 = 2 ^ 2 * 3 * 7 ∧ 2 ^ 2 * 3 * 7 = 4 * 3 * 7 ∧ 4 * 3 * 7 = 84) ∧
    (Nat.lcm 252 420 = 4 * 9 * 5 * 7 ∧ 4 * 9 * 5 * 7 = 1260) ∧
    (84 * 1260 = 105840 ∧ 252 * 420 = 105840) := by
  refine ⟨by norm_num, by norm_num, ⟨by decide, by norm_num, by norm_num⟩, ⟨by decide, by norm_num⟩, by norm_num⟩

/-- Primer 3, koraki 1–3: ostanek 3 pri deljenju s 4, 5 in 6 ⇔ 4, 5, 6 delijo n − 3 ⇔ n = 60k + 3
(v(4, 5, 6) = 2² · 3 · 5 = 60).
trditev: MAT-SS-1/naravna-in-cela-stevila#primer3-oblika
besedilo: »Vsak skupni večkratnik je večkratnik števila $60$, zato je $n - 3 = 60k$ in $n = 60k + 3$.« -/
theorem primer3_oblika (n : ℕ) :
    (n % 4 = 3 ∧ n % 5 = 3 ∧ n % 6 = 3) ↔ ∃ k, n = 60 * k + 3 := by
  constructor
  · intro h; exact ⟨n / 60, by omega⟩
  · rintro ⟨k, rfl⟩; omega

/-- Primer 3: v(4, 5, 6) = 2² · 3 · 5 = 60.
trditev: MAT-SS-1/naravna-in-cela-stevila#v-456
besedilo: »$v(4, 5, 6) = 2^2 \cdot 3 \cdot 5 = 60$« -/
theorem v_456 : Nat.lcm 4 (Nat.lcm 5 6) = 2 ^ 2 * 3 * 5 ∧ 2 ^ 2 * 3 * 5 = 60 := by decide

/-- Primer 3: najmanjše število sadik ≥ 100 z ostankom 3 pri deljenju s 4, 5, 6 je 123 (k = 1 da 63 < 100);
123 = 30 · 4 + 3 = 24 · 5 + 3 = 20 · 6 + 3.
trditev: MAT-SS-1/naravna-in-cela-stevila#primer3
besedilo: »Odgovor: gozdarji imajo najmanj $123$ sadik.« -/
theorem primer3 :
    IsLeast {n : ℕ | 100 ≤ n ∧ n % 4 = 3 ∧ n % 5 = 3 ∧ n % 6 = 3} 123 ∧
    60 * 1 + 3 = 63 ∧ 63 < 100 ∧ 60 * 2 + 3 = 123 ∧
    123 = 30 * 4 + 3 ∧ 123 = 24 * 5 + 3 ∧ 123 = 20 * 6 + 3 := by
  refine ⟨⟨by norm_num, fun n hn => ?_⟩, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩
  obtain ⟨h1, h2, h3, h4⟩ := hn
  omega

/-- Primer 4: 1071 = 2 · 462 + 147 (2 · 462 = 924, 1071 − 924 = 147), 462 = 3 · 147 + 21 (3 · 147 = 441),
147 = 7 · 21 + 0, zato D(1071, 462) = 21; 1071 = 21 · 51, 462 = 21 · 22, v = 1071 · 462 : 21 = 51 · 462 = 23562.
trditev: MAT-SS-1/naravna-in-cela-stevila#primer4
besedilo: »$147 = 7 \cdot 21 + 0$, zato je $D(1071, 462) = 21$. Res je $1\,071 = 21 \cdot 51$ in $462 = 21 \cdot 22$. Ker je $1\,071 : 21 = 51$, je $v = \dfrac{1\,071 \cdot 462}{21} = 51 \cdot 462 = 23\,562$.« -/
theorem primer4 :
    (1071 = 2 * 462 + 147 ∧ 2 * 462 = 924 ∧ 1071 - 924 = 147) ∧ (462 = 3 * 147 + 21 ∧ 3 * 147 = 441) ∧
    147 = 7 * 21 + 0 ∧ Nat.gcd 1071 462 = 21 ∧ 1071 = 21 * 51 ∧ 462 = 21 * 22 ∧ 1071 / 21 = 51 ∧
    Nat.lcm 1071 462 = 1071 * 462 / 21 ∧ 1071 * 462 / 21 = 51 * 462 ∧ 51 * 462 = 23562 := by
  have hg : Nat.gcd 1071 462 = 21 := by
    calc Nat.gcd 1071 462 = Nat.gcd 462 147 := (evklid_korak 1071 462 2 147 (by norm_num)).2
      _ = Nat.gcd 147 21 := (evklid_korak 462 147 3 21 (by norm_num)).2
      _ = Nat.gcd 21 0 := (evklid_korak 147 21 7 0 (by norm_num)).2
      _ = 21 := Nat.gcd_zero_right 21
  refine ⟨by norm_num, by norm_num, by norm_num, hg, by norm_num, by norm_num, by norm_num, ?_, by norm_num,
    by norm_num⟩
  rw [Nat.lcm, hg]

/-- Primer 5: A = (−25) · 37 · 4 = ((−25) · 4) · 37 = (−100) · 37 = −3700 (zamenljivost, združevalnost).
trditev: MAT-SS-1/naravna-in-cela-stevila#primer5-a
besedilo: »$A = \big((-25) \cdot 4\big) \cdot 37 = (-100) \cdot 37 = -3\,700$« -/
theorem primer5_A : (-25 : ℤ) * 37 * 4 = -3700 := by
  calc (-25 : ℤ) * 37 * 4 = ((-25) * 4) * 37 := by rw [mul_assoc, mul_comm 37 4, ← mul_assoc]
    _ = (-100) * 37 := by norm_num
    _ = -3700 := by norm_num

/-- Primer 5: B = (−38) + 57 + (−62) + 43 = ((−38) + (−62)) + (57 + 43) = −100 + 100 = 0.
trditev: MAT-SS-1/naravna-in-cela-stevila#primer5-b
besedilo: »$B = \big((-38) + (-62)\big) + (57 + 43) = -100 + 100 = 0$« -/
theorem primer5_B : (-38 : ℤ) + 57 + (-62) + 43 = 0 := by
  calc (-38 : ℤ) + 57 + (-62) + 43 = ((-38) + (-62)) + (57 + 43) := by ring
    _ = -100 + 100 := by norm_num
    _ = 0 := by norm_num

/-- Primer 5: C = (−19) · 99 = (−19) · (100 + (−1)) = (−19) · 100 + (−19) · (−1) = −1900 + 19 = −1881
(razčlenitev).
trditev: MAT-SS-1/naravna-in-cela-stevila#primer5-c
besedilo: »$C = (-19) \cdot 100 + (-19) \cdot (-1) = -1\,900 + 19 = -1\,881$« -/
theorem primer5_C : (-19 : ℤ) * 99 = -1881 := by
  calc (-19 : ℤ) * 99 = (-19) * (100 + (-1)) := by norm_num
    _ = (-19) * 100 + (-19) * (-1) := mul_add _ _ _
    _ = -1900 + 19 := by norm_num
    _ = -1881 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 4: −3 − (−5) = −3 + 5 = 2, ne −8.
trditev: MAT-SS-1/naravna-in-cela-stevila#napaka-predznak
besedilo: »Pravilno: $-3 - (-5) = -3 + 5 = 2$.« -/
theorem napaka_predznak : (-3 : ℤ) - (-5) = -3 + 5 ∧ (-3 : ℤ) + 5 = 2 ∧ (-3 : ℤ) - (-5) ≠ -8 := by norm_num

/-- Pogoste napake 3: D ne presega nobenega od števil, v ni manjši od nobenega (za a, b > 0).
trditev: MAT-SS-1/naravna-in-cela-stevila#d-v-meje
besedilo: »$D$ ne sme biti večji od nobenega od števil, $v$ pa ne manjši od nobenega« -/
theorem d_v_meje (a b : ℕ) (ha : 0 < a) (hb : 0 < b) :
    Nat.gcd a b ≤ a ∧ Nat.gcd a b ≤ b ∧ a ≤ Nat.lcm a b ∧ b ≤ Nat.lcm a b :=
  ⟨Nat.le_of_dvd ha (Nat.gcd_dvd_left a b), Nat.le_of_dvd hb (Nat.gcd_dvd_right a b), Nat.le_of_dvd (Nat.lcm_pos ha hb) (Nat.dvd_lcm_left a b),
    Nat.le_of_dvd (Nat.lcm_pos ha hb) (Nat.dvd_lcm_right a b)⟩

/-- Predpostavke `d_v_meje` se dajo izpolniti. -/
example : 0 < 12 ∧ 0 < 18 := by norm_num

/-! ## Za maturo -/

/-- Naloga 1: 531x2 = 53102 + 10x je deljivo s 36 natanko pri x = 7 (0 ≤ x ≤ 9); 36 = 4 · 9 s tujima faktorjema;
s 4 je deljivo pri lihem x (12, 32, 52, 72, 92); vsota števk 11 + x = 18; 53172 = 36 · 1477.
trditev: MAT-SS-1/naravna-in-cela-stevila#naloga1
besedilo: »Odgovor: $x = 7$. Res je $53\,172 = 36 \cdot 1\,477$.« -/
theorem naloga1 (x : ℕ) (hx : x ≤ 9) :
    (36 ∣ 53102 + 10 * x ↔ x = 7) ∧ (4 ∣ 10 * x + 2 ↔ x % 2 = 1) ∧ (9 ∣ 5 + 3 + 1 + x + 2 ↔ x = 7) := by
  refine ⟨?_, ?_, ?_⟩ <;> omega

/-- Predpostavke `naloga1` se dajo izpolniti; številke: 36 = 4 · 9 (tuja), 5 + 3 + 1 + 7 + 2 = 18,
53172 = 36 · 1477. -/
example : (7 : ℕ) ≤ 9 ∧ 36 = 4 * 9 ∧ Nat.Coprime 4 9 ∧ 5 + 3 + 1 + 7 + 2 = 18 ∧ 53172 = 36 * 1477 := by decide

/-- Naloga 2 a): 336 = 2 · 168 = 2 · 2 · 84 = 2 · 2 · 2 · 42 = 2 · 2 · 2 · 2 · 21 = 2⁴ · 3 · 7;
210 = 2 · 105 = 2 · 3 · 35 = 2 · 3 · 5 · 7.
trditev: MAT-SS-1/naravna-in-cela-stevila#naloga2a
besedilo: »$336 = 2 \cdot 168 = 2 \cdot 2 \cdot 84 = 2 \cdot 2 \cdot 2 \cdot 42 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 21 = 2^4 \cdot 3 \cdot 7$. 2. a) $210 = 2 \cdot 105 = 2 \cdot 3 \cdot 35 = 2 \cdot 3 \cdot 5 \cdot 7$.« -/
theorem naloga2a :
    (336 = 2 * 168 ∧ 2 * 168 = 2 * 2 * 84 ∧ 2 * 2 * 84 = 2 * 2 * 2 * 42 ∧ 2 * 2 * 2 * 42 = 2 * 2 * 2 * 2 * 21 ∧
      2 * 2 * 2 * 2 * 21 = 2 ^ 4 * 3 * 7) ∧
    (210 = 2 * 105 ∧ 2 * 105 = 2 * 3 * 35 ∧ 2 * 3 * 35 = 2 * 3 * 5 * 7) := by norm_num

/-- Naloga 2 b): največja stranica, ki deli obe stranici, je D(336, 210) = 2 · 3 · 7 = 42.
trditev: MAT-SS-1/naravna-in-cela-stevila#naloga2b
besedilo: »$D(336, 210) = 2 \cdot 3 \cdot 7 = 42$. Stranica ploščice meri $42\,\text{cm}$.« -/
theorem naloga2b : IsGreatest {s : ℕ | s ∣ 336 ∧ s ∣ 210} 42 ∧ Nat.gcd 336 210 = 2 * 3 * 7 ∧ 2 * 3 * 7 = 42 := by
  refine ⟨⟨by norm_num, fun s hs => ?_⟩, by decide, by norm_num⟩
  exact Nat.le_of_dvd (by norm_num) (by simpa using Nat.dvd_gcd hs.1 hs.2)

/-- Naloga 2 c), d): 336 : 42 = 8, 210 : 42 = 5, 8 · 5 = 40 ploščic; 336 = 8 · 40 + 16 z 0 ≤ 16 < 40.
trditev: MAT-SS-1/naravna-in-cela-stevila#naloga2cd
besedilo: »Ob daljši stranici je $336 : 42 = 8$ ploščic, ob krajši $210 : 42 = 5$ ploščic. Skupaj je to $8 \cdot 5 = 40$ ploščic. 6. d) $336 = 8 \cdot 40 + 16$, ostanek $16$ je med $0$ in $40$.« -/
theorem naloga2cd : 336 / 42 = 8 ∧ 210 / 42 = 5 ∧ 8 * 5 = 40 ∧ 336 = 8 * 40 + 16 ∧ 16 < 40 ∧
    336 / 40 = 8 ∧ 336 % 40 = 16 := by decide

/-- Naloga 3 a), b): 154 = 1 · 126 + 28, 126 = 4 · 28 + 14 (4 · 28 = 112), 28 = 2 · 14 + 0, D(154, 126) = 14;
v = 154 · 126 : 14 = 11 · 126 = 1386.
trditev: MAT-SS-1/naravna-in-cela-stevila#naloga3ab
besedilo: »Zadnji ostanek, ki ni $0$, je $14$, zato je $D(154, 126) = 14$. 4. b) $v(154, 126) = \dfrac{154 \cdot 126}{14} = 11 \cdot 126 = 1\,386$.« -/
theorem naloga3ab :
    Nat.gcd 154 126 = 14 ∧ 4 * 28 = 112 ∧ Nat.lcm 154 126 = 154 * 126 / 14 ∧ 154 * 126 / 14 = 11 * 126 ∧
    11 * 126 = 1386 := by
  have hg : Nat.gcd 154 126 = 14 := by
    calc Nat.gcd 154 126 = Nat.gcd 126 28 := (evklid_korak 154 126 1 28 (by norm_num)).2
      _ = Nat.gcd 28 14 := (evklid_korak 126 28 4 14 (by norm_num)).2
      _ = Nat.gcd 14 0 := (evklid_korak 28 14 2 0 (by norm_num)).2
      _ = 14 := Nat.gcd_zero_right 14
  exact ⟨hg, by norm_num, by rw [Nat.lcm, hg], by norm_num, by norm_num⟩

/-- Naloga 3 c): zoba se prvič spet dotakneta po najmanjšem pozitivnem skupnem večkratniku 1386 zob; večji zobnik
naredi 1386 : 154 = 9, manjši 1386 : 126 = 11 obratov.
trditev: MAT-SS-1/naravna-in-cela-stevila#naloga3c
besedilo: »Prvič se to zgodi po $v(154, 126) = 1\,386$ zobeh. 6. c) Večji zobnik naredi $1\,386 : 154 = 9$ obratov, manjši pa $1\,386 : 126 = 11$ obratov.« -/
theorem naloga3c : IsLeast {m : ℕ | 0 < m ∧ 154 ∣ m ∧ 126 ∣ m} 1386 ∧ 1386 / 154 = 9 ∧ 1386 / 126 = 11 := by
  refine ⟨⟨by norm_num, fun m hm => ?_⟩, by norm_num, by norm_num⟩
  have h := Nat.lcm_dvd hm.2.1 hm.2.2
  have : Nat.lcm 154 126 = 1386 := by decide
  rw [this] at h; exact Nat.le_of_dvd hm.1 h

set_option maxRecDepth 8000 in
/-- Naloga 3 d): za 20 < z < 154 je v(154, z) = 2 · 154 = 308 natanko pri z = 28 ali z = 44; delitelji 308, deljivi
s 4, so 4, 28, 44, 308; 154 = 2 · 7 · 11, 308 = 2² · 7 · 11.
trditev: MAT-SS-1/naravna-in-cela-stevila#naloga3d
besedilo: »Delitelji števila $308$, deljivi s $4$, so $4$, $28$, $44$ in $308$. Pogoju $20 < z < 154$ ustrezata $z = 28 = 2^2 \cdot 7$ in $z = 44 = 2^2 \cdot 11$. Preverba: $v(154, 28) = 2^2 \cdot 7 \cdot 11 = 308$ in $v(154, 44) = 2^2 \cdot 7 \cdot 11 = 308$.« -/
theorem naloga3d :
    (∀ z ∈ Finset.Ioo 20 154, (Nat.lcm 154 z = 2 * 154 ↔ z = 28 ∨ z = 44)) ∧ 2 * 154 = 308 ∧
    (Nat.divisors 308).filter (fun d => 4 ∣ d) = {4, 28, 44, 308} ∧ 154 = 2 * 7 * 11 ∧ 308 = 2 ^ 2 * 7 * 11 ∧
    Nat.lcm 154 28 = 308 ∧ Nat.lcm 154 44 = 308 := by decide

/-! ## Preveri se -/

/-- Preveri se 2: D(48, 36) = 12 (48 = 2⁴ · 3, 36 = 2² · 3², D = 2² · 3); 6 je skupni delitelj, a ne največji;
v(48, 36) = 2⁴ · 3² = 144.
trditev: MAT-SS-1/naravna-in-cela-stevila#kviz2
besedilo: »$48 = 2^4 \cdot 3$ in $36 = 2^2 \cdot 3^2$. Skupna prafaktorja z manjšima eksponentoma dasta $D = 2^2 \cdot 3 = 12$.« -/
theorem kviz2 : Nat.gcd 48 36 = 12 ∧ 48 = 2 ^ 4 * 3 ∧ 36 = 2 ^ 2 * 3 ^ 2 ∧ 2 ^ 2 * 3 = 12 ∧ 6 ∣ 48 ∧ 6 ∣ 36 ∧
    6 < 12 ∧ Nat.lcm 48 36 = 2 ^ 4 * 3 ^ 2 ∧ 2 ^ 4 * 3 ^ 2 = 144 := by decide

/-- Preveri se 3 (Nika): 12 = 2² · 3, 18 = 2 · 3²; v(12, 18) = 2² · 3² = 36, 2 · 3 = 6 je D(12, 18);
preizkus 6 · 36 = 216 = 12 · 18.
trditev: MAT-SS-1/naravna-in-cela-stevila#kviz3
besedilo: »Pri $v$ vzamemo vse prafaktorje z večjim eksponentom: $v = 4 \cdot 9 = 36$. Preizkus: $6 \cdot 36 = 216 = 12 \cdot 18$.« -/
theorem kviz3 : 12 = 2 ^ 2 * 3 ∧ 18 = 2 * 3 ^ 2 ∧ Nat.lcm 12 18 = 2 ^ 2 * 3 ^ 2 ∧ 2 ^ 2 * 3 ^ 2 = 36 ∧
    Nat.gcd 12 18 = 2 * 3 ∧ 6 * 36 = 216 ∧ 12 * 18 = 216 := by decide

/-- Preveri se 5: v(15, 20) = 2² · 3 · 5 = 60 minut (13.00); D(15, 20) = 5; 35 ni večkratnik 15; 300 je skupni
večkratnik, a ne najmanjši.
trditev: MAT-SS-1/naravna-in-cela-stevila#kviz5
besedilo: »$15 = 3 \cdot 5$ in $20 = 2^2 \cdot 5$, zato je $v(15, 20) = 2^2 \cdot 3 \cdot 5 = 60$ minut, torej ena ura.« -/
theorem kviz5 : Nat.lcm 15 20 = 2 ^ 2 * 3 * 5 ∧ 2 ^ 2 * 3 * 5 = 60 ∧ Nat.gcd 15 20 = 5 ∧ ¬ 15 ∣ 35 ∧
    15 ∣ 300 ∧ 20 ∣ 300 ∧ 60 < 300 := by decide

/-- Preveri se 6: (−23) · 101 = (−23) · 100 + (−23) · 1 = −2300 + (−23) = −2323.
trditev: MAT-SS-1/naravna-in-cela-stevila#kviz6
besedilo: »$(-23) \cdot 101 = (-23) \cdot 100 + (-23) \cdot 1 = -2\,300 + (-23) = -2\,323$.« -/
theorem kviz6 : (-23 : ℤ) * 101 = -2323 := by
  calc (-23 : ℤ) * 101 = (-23) * (100 + 1) := by norm_num
    _ = (-23) * 100 + (-23) * 1 := mul_add _ _ _
    _ = -2300 + (-23) := by norm_num
    _ = -2323 := by norm_num

/-- Bolj natančno (merilo za 9): 4536 = (4 · 999 + 5 · 99 + 3 · 9) + (4 + 5 + 3 + 6), prvi oklepaj je deljiv z 9.
trditev: MAT-SS-1/naravna-in-cela-stevila#merilo9-razlog
besedilo: »Ker je $1\,000 = 999 + 1$, $100 = 99 + 1$ in $10 = 9 + 1$, je $4\,536 = (4 \cdot 999 + 5 \cdot 99 + 3 \cdot 9) + (4 + 5 + 3 + 6)$.« -/
theorem merilo9_razlog : 4536 = (4 * 999 + 5 * 99 + 3 * 9) + (4 + 5 + 3 + 6) ∧ 9 ∣ 4 * 999 + 5 * 99 + 3 * 9 ∧
    1000 = 999 + 1 ∧ 100 = 99 + 1 ∧ 10 = 9 + 1 := by decide

/-- RACUN: vse vrstice bloka (deljenja so brez ostanka).
pomozno – vrstice bloka RACUN (ni vidno besedilo); iste vrednosti dokažejo zakoni_primeri, odstevanje_deljenje, primer5_* in kviz6 -/
theorem racun :
    (-25 : ℤ) * 37 * 4 = -3700 ∧ (-38 : ℤ) + 57 + (-62) + 43 = 0 ∧ (-19 : ℤ) * 99 = -1881 ∧
    (-19 : ℤ) * 100 + (-19) * (-1) = -1881 ∧ (-23 : ℤ) * 101 = -2323 ∧ (6 : ℤ) * 10 + 6 * 3 = 78 ∧
    (-4 : ℤ) * (10 + 3) = -52 ∧ (-2 : ℤ) * (5 * 7) = -70 ∧ (-7 : ℤ) + 12 = 5 ∧ (8 : ℤ) / 2 = 4 ∧
    ((10 : ℤ) - 4) - 3 = 3 ∧ (10 : ℤ) - (4 - 3) = 9 ∧ ((24 : ℤ) / 4) / 2 = 3 ∧ (24 : ℤ) / (4 / 2) = 12 ∧
    5 + 3 + 1 + 7 + 2 = 18 ∧ 72 / 4 = 18 ∧ 53172 / 36 = 1477 ∧ 2 ^ 4 * 3 * 7 = 336 ∧ 2 * 3 * 5 * 7 = 210 ∧
    Nat.gcd 336 210 = 42 ∧ (336 / 42) * (210 / 42) = 40 ∧ 8 * 40 + 16 = 336 ∧ 154 - 1 * 126 = 28 ∧
    126 - 4 * 28 = 14 ∧ Nat.gcd 154 126 = 14 ∧ 154 * 126 / 14 = 1386 ∧ Nat.lcm 154 126 = 1386 ∧
    1386 / 154 = 9 ∧ 1386 / 126 = 11 ∧ 2 * 154 = 308 ∧ Nat.lcm 154 28 = 308 ∧ Nat.lcm 154 44 = 308 ∧
    Nat.gcd 48 36 = 12 ∧ Nat.lcm 48 36 = 144 := by decide

end Evklid.Lekcije.MAT_SS_1.NaravnaInCelaStevila
