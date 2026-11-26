/-
vir: content/lessons/MAT-OS-6/ulomek-kot-del-celote.md
sha256: 97e44a283167cc46e6f8461f1e8befa7ab0a50c7e6a319702d4407429548a0cf
Model: ulomek a/b (a, b naravni) je racionalno število (a : ℚ) / b; »a/b od količine k« je (k : b) · a. Točka
a/b na številski premici z enoto, dolgo E kvadratkov, leži (E : b) · a kvadratkov desno od 0. Mešano število
q r/b je q + r/b. Celi del in ostanek pri pretvorbi sta deljenje z ostankom v ℕ (`a / b`, `a % b`). Vmesne črtice
enote, razdeljene na b delov, so točke k/b z 0 < k < b (`Finset.Ioo 0 b`). Enote (€, kvadratki) so le v
docstringih.
Lean: x/0 = 0 in odštevanje v ℕ se ustavi pri 0; zato imajo pravila, ki to potrebujejo, pogoj b ≠ 0 (oz. 0 < b), kot
v lekciji (»imenovalec ni nikoli 0«), število vmesnih črtic b − 1 pa je zapisano za b ≥ 1.
Ni v Leanu: zgodovina (Egipt, Rhindov papirus, pisarji) in zgodbe kot opis, dokazani so njihovi računi; tabeli imen
in branja ulomkov kot poimenovanje; »deli morajo biti enaki« in neenako razrezana pita (dogovor o pomenu ulomka;
dokazano je le, da so ulomki deli enakih kosov v modelu); risbe (pravokotnik, številski premici) in simulacija kot
sliki (dokazani so njihovi računi); »celote ne moremo razdeliti na nič delov« kot razlog za pogoj b ≠ 0; vrstni
red korakov v Preveri se 1 kot postopek (dokazano je, da je a/b enako a delom velikosti 1/b); razlage napačnih
odgovorov v kvizih, razen kjer so dokazane kot račun.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.UlomekKotDelCelote

/-! ## Splošna pravila -/

/-- Razlaga 2, Povzetek 2, Preveri se 1: ulomek a/b je a delov velikosti 1/b (b ≠ 0), b delov da celoto.
trditev: MAT-OS-6/ulomek-kot-del-celote#stevec-imenovalec
besedilo: »Ulomek $\dfrac{a}{b}$ pomeni $a$ delov celote, razdeljene na $b$ enakih delov.« -/
theorem stevec_imenovalec (a b : ℕ) (hb : b ≠ 0) :
    (a : ℚ) / b = a * (1 / (b : ℚ)) ∧ (b : ℚ) * (1 / (b : ℚ)) = 1 := by
  have : (b : ℚ) ≠ 0 := by exact_mod_cast hb
  refine ⟨by ring, by field_simp⟩

/-- Predpostavka trditve `stevec_imenovalec` se da izpolniti, izrek uporabljen na 3/5. -/
example := stevec_imenovalec 3 5 (by norm_num)

/-- Preveri se 1: imenovalec pove, na koliko delov razdelimo enoto, števec, koliko delov preštejemo od 0: točka a/b
je a korakov dolžine 1/b od 0 (npr. 3/5 = 3 · 1/5).
trditev: MAT-OS-6/ulomek-kot-del-celote#kviz1
besedilo: »Imenovalec pove, na koliko delov razdelimo enoto, števec, koliko delov preštejemo od $0$.« -/
theorem kviz1 : (3 : ℚ) / 5 = 3 * (1 / 5) ∧ (5 : ℚ) * (1 / 5) = 1 := by norm_num

/-- Razlaga 4, Povzetek 4, Pogoste napake 2: enota, razdeljena na b ≥ 1 delov, ima b − 1 vmesnih črtic (točke k/b
z 0 < k < b), ena manj kot delov.
trditev: MAT-OS-6/ulomek-kot-del-celote#crtice
besedilo: »Na številski premici: enoto od $0$ do $1$ razdelimo na $b$ delov (to je $b - 1$ vmesnih črtic) in od $0$ preštejemo $a$ delov.« -/
theorem crtice (b : ℕ) : (Finset.Ioo 0 b).card = b - 1 ∧
    ∀ k ∈ Finset.Ioo 0 b, 0 < (k : ℚ) / b ∧ (k : ℚ) / b < 1 := by
  refine ⟨by simp, fun k hk => ?_⟩
  rw [Finset.mem_Ioo] at hk
  have hb : (0 : ℚ) < b := by exact_mod_cast (lt_trans hk.1 hk.2)
  have hk0 : (0 : ℚ) < k := by exact_mod_cast hk.1
  have hkb : (k : ℚ) < b := by exact_mod_cast hk.2
  exact ⟨div_pos hk0 hb, (div_lt_one hb).mpr hkb⟩

/-- Predpostavka »k ∈ Ioo 0 b« v sklepu trditve `crtice` se da izpolniti, izrek uporabljen na b = 5, k = 3. -/
example := (crtice 5).2 3 (by decide)

/-- Razlaga 4: točka a/b na premici z enoto, dolgo E kvadratkov, leži (E : b) · a kvadratkov desno od 0, to je
a/b · E (b ≠ 0).
trditev: MAT-OS-6/ulomek-kot-del-celote#premica
besedilo: »Ena $b$-ina enote je $\text{enota} : b$. Ulomek $\dfrac{a}{b}$ leži $a$ takih delov desno od $0$.« -/
theorem premica (a b E : ℚ) : E / b * a = a / b * E := by ring

/-- Razlaga 5, Povzetek 6: pravi ulomek (a < b) je manjši od 1 in leži med 0 in 1; nepravi (a ≥ b, b > 0) je večji
ali enak 1; pri a = b je a/b = 1.
trditev: MAT-OS-6/ulomek-kot-del-celote#pravi-nepravi
besedilo: »Pravi ulomek ($a < b$) je manjši od $1$; nepravi ($a \ge b$) je večji ali enak $1$« -/
theorem pravi_nepravi (a b : ℕ) (hb : 0 < b) :
    (a < b ↔ (a : ℚ) / b < 1) ∧ (b ≤ a ↔ 1 ≤ (a : ℚ) / b) ∧ 0 ≤ (a : ℚ) / b ∧ (a = b → (a : ℚ) / b = 1) := by
  have hb' : (0 : ℚ) < b := by exact_mod_cast hb
  refine ⟨?_, ?_, by positivity, fun h => by rw [h]; exact div_self hb'.ne'⟩
  · rw [div_lt_one hb']; exact_mod_cast Iff.rfl
  · rw [one_le_div hb']; exact_mod_cast Iff.rfl

/-- Predpostavka trditve `pravi_nepravi` se da izpolniti, izrek uporabljen na 7/4. -/
example := pravi_nepravi 7 4 (by norm_num)

/-- Predpostavka »a = b« v sklepu trditve `pravi_nepravi` se da izpolniti, izrek uporabljen na 5/5. -/
example := (pravi_nepravi 5 5 (by norm_num)).2.2.2 rfl

/-- Razlaga 5 (pretvorba): nepravi ulomek v mešano število: a/b = (a : b) + (ostanek)/b (količnik je celi del,
ostanek števec, b ≠ 0); mešano število v ulomek: q + r/b = (q · b + r)/b.
trditev: MAT-OS-6/ulomek-kot-del-celote#mesano
besedilo: »Nepravi ulomek v mešano število: števec delimo z imenovalcem. Količnik je celi del, ostanek je števec, imenovalec ostane isti.« -/
theorem mesano (a b q r : ℕ) (hb : b ≠ 0) :
    (a : ℚ) / b = ((a / b : ℕ) : ℚ) + ((a % b : ℕ) : ℚ) / b ∧ (q : ℚ) + r / b = ((q * b + r : ℕ) : ℚ) / b := by
  have hb' : (b : ℚ) ≠ 0 := by exact_mod_cast hb
  constructor
  · have h := Nat.div_add_mod a b
    have : ((b * (a / b) + a % b : ℕ) : ℚ) = (a : ℚ) := by rw [h]
    push_cast at this
    rw [← this]
    field_simp
  · push_cast; field_simp

/-- Predpostavka trditve `mesano` se da izpolniti, izrek uporabljen na 7/4 in 2 3/5. -/
example := mesano 7 4 2 3 (by norm_num)

/-- Razlaga 2 (premisli), Pogoste napake 3, Povzetek 5: pri enakem (pozitivnem) števcu je večji ulomek tisti z
manjšim imenovalcem: večji imenovalec pomeni manjše dele.
trditev: MAT-OS-6/ulomek-kot-del-celote#vecji-imenovalec
besedilo: »Pravilno: pri enakem števcu je večji ulomek tisti z manjšim imenovalcem.« -/
theorem vecji_imenovalec (a b d : ℚ) (ha : 0 < a) (hb : 0 < b) (hbd : b < d) : a / d < a / b :=
  div_lt_div_of_pos_left ha hb hbd

/-- Predpostavke trditve `vecji_imenovalec` se dajo izpolniti, izrek uporabljen na 1/8 < 1/4. -/
example := vecji_imenovalec 1 4 8 (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 6, Povzetek 7: a/b od k je (k : b) · a: delimo z imenovalcem, množimo s števcem.
trditev: MAT-OS-6/ulomek-kot-del-celote#kolicina
besedilo: »Pravilo: delimo z imenovalcem, množimo s števcem.« -/
theorem kolicina (a b k : ℚ) : k / b * a = a / b * k := by ring

/-- Razlaga 7, Povzetek 7, Primer 3 (formula): če je a/b celote C enako k (a, b ≠ 0), je celota natanko
C = (k : a) · b: delimo s števcem, množimo z imenovalcem.
trditev: MAT-OS-6/ulomek-kot-del-celote#celota
besedilo: »Iz dela do celote: delimo s števcem, množimo z imenovalcem.« -/
theorem celota (a b k C : ℚ) (ha : a ≠ 0) (hb : b ≠ 0) : a / b * C = k ↔ C = k / a * b := by
  constructor
  · intro h; rw [← h]; field_simp
  · intro h; rw [h]; field_simp

/-- Predpostavke trditve `celota` se dajo izpolniti, izrek uporabljen na 2/3 celote = 12. -/
example := celota 2 3 12 18 (by norm_num) (by norm_num)

/-! ## Razlaga -/

/-- Razlaga 2 (premisli): 1/4 pice je več kot 1/8, čeprav je 8 > 4.
trditev: MAT-OS-6/ulomek-kot-del-celote#pica
besedilo: »Večji je $\dfrac{1}{4}$.« -/
theorem pica : (1 : ℚ) / 8 < 1 / 4 ∧ (4 : ℚ) < 8 := by norm_num

/-- Razlaga 3 (lik): 6 enakih delov, 4 pobarvani: pobarvane so 4/6, prazni 2/6, skupaj cela.
trditev: MAT-OS-6/ulomek-kot-del-celote#lik
besedilo: »Pobarvane so torej $\dfrac{4}{6}$ celote, prazna sta $2$ dela, to je $\dfrac{2}{6}$.« -/
theorem lik : (6 : ℕ) - 4 = 2 ∧ (4 : ℚ) / 6 + 2 / 6 = 1 := by norm_num

/-- Razlaga 4: za 3/4 z enoto 8 kvadratkov je ena četrtina 8 : 4 = 2 kvadratka, 3/4 leži 3 · 2 = 6 kvadratkov od 0.
trditev: MAT-OS-6/ulomek-kot-del-celote#tri-cetrtine-premica
besedilo: »Ena četrtina je $8 : 4 = 2$ kvadratka, torej $\dfrac{3}{4}$ leži $3 \cdot 2 = 6$ kvadratkov desno od $0$.« -/
theorem tri_cetrtine_premica : (8 : ℚ) / 4 = 2 ∧ (3 : ℚ) * 2 = 6 ∧ (3 : ℚ) / 4 * 8 = 6 ∧
    (Finset.Ioo 0 4).card = 3 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by simp⟩

/-- Razlaga 4 (premisli): za petine so vmesne črtice 4 (ne 5), 3/5 leži pri tretji (3 · 1/5).
trditev: MAT-OS-6/ulomek-kot-del-celote#tina
besedilo: »Tina nima prav: vmesne črtice so $4$, ena manj kot delov.« -/
theorem tina : (Finset.Ioo 0 5).card = 4 ∧ (Finset.Ioo 0 5).card ≠ 5 ∧ (3 : ℚ) / 5 = 3 * (1 / 5) := by
  refine ⟨by simp, by simp, by norm_num⟩

/-- Razlaga 5: 3/5 < 1, 7/4 ≥ 1, 5/5 = 1; 7/4 = 1 3/4 (7 : 4 = 1, ostanek 3); 2 3/5 = (2 · 5 + 3)/5 = 13/5.
trditev: MAT-OS-6/ulomek-kot-del-celote#primeri-razlaga5
besedilo: »Štiri četrtine so ena cela, ostanejo še tri četrtine, zato je $\dfrac{7}{4} = 1\dfrac{3}{4}$.« -/
theorem primeri_razlaga5 : (3 : ℚ) / 5 < 1 ∧ 1 ≤ (7 : ℚ) / 4 ∧ (5 : ℚ) / 5 = 1 ∧ (4 : ℚ) / 4 = 1 ∧
    (7 : ℚ) / 4 = 1 + 3 / 4 ∧ 7 / 4 = 1 ∧ 7 % 4 = 3 ∧ 2 * 5 + 3 = 13 ∧ (2 : ℚ) + 3 / 5 = 13 / 5 := by
  norm_num

/-- Razlaga 6: 3/4 od 20 €: 20 : 4 = 5, 5 · 3 = 15 (€); 12 učencev ne moreš razdeliti na 5 enakih skupin.
trditev: MAT-OS-6/ulomek-kot-del-celote#dvajset-evrov
besedilo: »Torej so $\dfrac{3}{4}$ od $20\,€$ enake $15\,€$.« -/
theorem dvajset_evrov : (20 : ℚ) / 4 = 5 ∧ (5 : ℚ) * 3 = 15 ∧ (20 : ℚ) / 4 * 3 = 15 ∧ ¬ (5 ∣ 12) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by decide⟩

/-- Razlaga 7: 2/3 celote je 12: ena tretjina 12 : 2 = 6, celota 6 · 3 = 18 (enolično).
trditev: MAT-OS-6/ulomek-kot-del-celote#dve-tretjini
besedilo: »Če sta $\dfrac{2}{3}$ celote enaki $12$, najprej poiščemo eno tretjino ($12 : 2 = 6$), nato celoto s tremi tretjinami ($6 \cdot 3 = 18$).« -/
theorem dve_tretjini (C : ℚ) : (12 : ℚ) / 2 = 6 ∧ (6 : ℚ) * 3 = 18 ∧ (2 / 3 * C = 12 ↔ C = 18) := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [celota 2 3 12 C (by norm_num) (by norm_num)]; norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 12 = 3 · 4 kock, pojedla 5/12, ostalo 12 − 5 = 7 kock, 7/12; 5 + 7 = 12, 5/12 + 7/12 = 1.
trditev: MAT-OS-6/ulomek-kot-del-celote#primer1
besedilo: »Odgovor: Maja je pojedla $\dfrac{5}{12}$ čokolade, ostalo je $\dfrac{7}{12}$.« -/
theorem primer1 : 3 * 4 = 12 ∧ 12 - 5 = 7 ∧ 5 + 7 = 12 ∧ (5 : ℚ) / 12 + 7 / 12 = 1 ∧ (1 : ℚ) - 5 / 12 = 7 / 12 := by
  norm_num

/-- Primer 2: enota 10 kvadratkov, petina 10 : 5 = 2; 3/5 pri 3 · 2 = 6, 5/5 pri 5 · 2 = 10 (točka 1), 7/5 pri
7 · 2 = 14 (4 desno od 1); 7 : 5 = 1, ostanek 2, 7/5 = 1 2/5; 10 + 2 · 2 = 14.
trditev: MAT-OS-6/ulomek-kot-del-celote#primer2
besedilo: »Odgovor: točke ležijo $6$, $10$ in $14$ kvadratkov desno od $0$, $\dfrac{7}{5} = 1\dfrac{2}{5}$.« -/
theorem primer2 : (10 : ℚ) / 5 = 2 ∧ (3 : ℚ) / 5 * 10 = 3 * 2 ∧ (3 : ℚ) * 2 = 6 ∧ (5 : ℚ) / 5 * 10 = 5 * 2 ∧
    (5 : ℚ) * 2 = 10 ∧ (5 : ℚ) / 5 = 1 ∧ (7 : ℚ) / 5 * 10 = 7 * 2 ∧ (7 : ℚ) * 2 = 14 ∧ (14 : ℚ) - 10 = 4 ∧
    7 / 5 = 1 ∧ 7 % 5 = 2 ∧ (7 : ℚ) / 5 = 1 + 2 / 5 ∧ (10 : ℚ) + 2 * 2 = 14 := by
  norm_num

/-- Primer 3: 3/5 prihrankov je 15 €: petina 15 : 3 = 5, prihranki 5 · 5 = 25 € (enolično); ostalo 2/5, to je
2 · 5 = 10 €; preizkus 25 − 15 = 10.
trditev: MAT-OS-6/ulomek-kot-del-celote#primer3
besedilo: »Odgovor: Lana je imela $25\,€$, ostalo ji je $10\,€$, to sta $\dfrac{2}{5}$ prihrankov.« -/
theorem primer3 (C : ℚ) : (15 : ℚ) / 3 = 5 ∧ (5 : ℚ) * 5 = 25 ∧ (3 / 5 * C = 15 ↔ C = 25) ∧ (1 : ℚ) - 3 / 5 = 2 / 5 ∧
    (2 : ℚ) * 5 = 10 ∧ (2 : ℚ) / 5 * 25 = 10 ∧ (25 : ℚ) - 15 = 10 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [celota 3 5 15 C (by norm_num) (by norm_num)]; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 4: 3/4 od 20 € ni 20 : 3 krat 3 (20 : 3 ni ena četrtina); pravilno 20 : 4 = 5, 5 · 3 = 15.
trditev: MAT-OS-6/ulomek-kot-del-celote#napaka4
besedilo: »Pravilno: delimo z imenovalcem ($20 : 4 = 5$), nato množimo s števcem ($5 \cdot 3 = 15$).« -/
theorem napaka4 : (20 : ℚ) / 3 ≠ 20 / 4 ∧ (20 : ℚ) / 4 = 5 ∧ (5 : ℚ) * 3 = 15 := by norm_num

/-- Pogoste napake 5, Preveri se 2: 7/4 = 1 3/4 (več kot 1), 4/7 je manj kot 1, zato 4/7 ≠ 7/4; sedem četrtin je
1 + 3/4.
trditev: MAT-OS-6/ulomek-kot-del-celote#napaka5
besedilo: »Pravilno: $\dfrac{7}{4} = 1\dfrac{3}{4}$, ulomek $\dfrac{4}{7}$ pa je manjši od $1$.« -/
theorem napaka5 : (7 : ℚ) / 4 = 1 + 3 / 4 ∧ (4 : ℚ) / 7 < 1 ∧ 1 < (7 : ℚ) / 4 ∧ (4 : ℚ) / 7 ≠ 7 / 4 ∧
    (7 : ℚ) * (1 / 4) = 7 / 4 := by norm_num

/-! ## Drugače -/

/-- Kot zgodba: 3 hlebci po 4 četrtine je 3 · 4 = 12 četrtin, vsak od 4 delavcev 12 : 4 = 3 četrtine = 3/4 hlebca,
kar je 3 : 4; 3/4 = 1/2 + 1/4 (»polovica in četrtina«).
trditev: MAT-OS-6/ulomek-kot-del-celote#zgodba
besedilo: »Vsak delavec vzame $12 : 4 = 3$ četrtine, to je $\dfrac{3}{4}$ hlebca.« -/
theorem zgodba : 3 * 4 = 12 ∧ 12 / 4 = 3 ∧ (3 : ℚ) * (1 / 4) = 3 / 4 ∧ (3 : ℚ) / 4 = 1 / 2 + 1 / 4 ∧
    (12 : ℚ) * (1 / 4) / 4 = 3 / 4 := by norm_num

/-- Korak za korakom A: 5/6 od 42 €: 42 : 6 = 7 (6 deli 42), 5 · 7 = 35 (€).
trditev: MAT-OS-6/ulomek-kot-del-celote#korak-a
besedilo: »Odgovor: $\dfrac{5}{6}$ od $42\,€$ je $35\,€$.« -/
theorem korak_a : 6 ∣ 42 ∧ (42 : ℚ) / 6 = 7 ∧ (5 : ℚ) * 7 = 35 ∧ (42 : ℚ) / 6 * 5 = 35 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num⟩

/-- Korak za korakom B (tabela, enota 12 kvadratkov): 3/4: 12 : 4 = 3, 3 · 3 = 9; 5/6: 12 : 6 = 2, 5 · 2 = 10;
7/3: 12 : 3 = 4, 7 · 4 = 28; 28 − 24 = 4 desno od 2; 7 : 3 = 2, ostanek 1, 7/3 = 2 1/3.
trditev: MAT-OS-6/ulomek-kot-del-celote#korak-b
besedilo: »Res je $7 : 3 = 2$, ostanek $1$, torej $\dfrac{7}{3} = 2\dfrac{1}{3}$.« -/
theorem korak_b : (12 : ℚ) / 4 = 3 ∧ (3 : ℚ) * 3 = 9 ∧ (12 : ℚ) / 6 = 2 ∧ (5 : ℚ) * 2 = 10 ∧ (12 : ℚ) / 3 = 4 ∧
    (7 : ℚ) * 4 = 28 ∧ (2 : ℚ) * 12 = 24 ∧ (28 : ℚ) - 24 = 4 ∧ 7 / 3 = 2 ∧ 7 % 3 = 1 ∧
    (7 : ℚ) / 3 = 2 + 1 / 3 ∧ (3 : ℚ) / 4 * 12 = 9 ∧ (5 : ℚ) / 6 * 12 = 10 ∧ (7 : ℚ) / 3 * 12 = 28 := by
  norm_num

/-- Korak za korakom C: 17 : 5 = 3, ostanek 2, 17/5 = 3 2/5; nazaj 3 · 5 + 2 = 17; 4 2/3 = (4 · 3 + 2)/3 = 14/3.
trditev: MAT-OS-6/ulomek-kot-del-celote#korak-c
besedilo: »$4\dfrac{2}{3}$ v nepravi ulomek: $4 \cdot 3 + 2 = 14$, torej $\dfrac{14}{3}$.« -/
theorem korak_c : 17 / 5 = 3 ∧ 17 % 5 = 2 ∧ (17 : ℚ) / 5 = 3 + 2 / 5 ∧ 3 * 5 + 2 = 17 ∧ 4 * 3 + 2 = 14 ∧
    (4 : ℚ) + 2 / 3 = 14 / 3 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: 4/7 je manj kot 1, ostali trije zapisi pomenijo 7/4 = 1 3/4, kar je več kot 1.
trditev: MAT-OS-6/ulomek-kot-del-celote#kviz2
besedilo: »Ostali trije zapisi pomenijo $\dfrac{7}{4} = 1\dfrac{3}{4}$, kar je več kot $1$.« -/
theorem kviz2 : (4 : ℚ) / 7 < 1 ∧ (7 : ℚ) / 4 = 1 + 3 / 4 ∧ 1 < (7 : ℚ) / 4 ∧ (4 : ℚ) / 7 ≠ 7 / 4 := by norm_num

/-- Preveri se 3: iz 1/4 v 1/8 se ulomek zmanjša.
trditev: MAT-OS-6/ulomek-kot-del-celote#kviz3
besedilo: »Zato je $\dfrac{1}{8}$ manj kot $\dfrac{1}{4}$.« -/
theorem kviz3 : (1 : ℚ) / 8 < 1 / 4 ∧ (1 : ℚ) / 8 ≠ 1 / 4 := by norm_num

/-- Preveri se 4: 3/4 od 28 €: 28 : 4 = 7, 7 · 3 = 21 (€); 7 je četrtina, 84 = 28 · 3.
trditev: MAT-OS-6/ulomek-kot-del-celote#kviz4
besedilo: »Ena četrtina: $28 : 4 = 7$, torej $7\,€$. Tri četrtine: $7 \cdot 3 = 21$, torej $21\,€$.« -/
theorem kviz4 : (28 : ℚ) / 4 = 7 ∧ (7 : ℚ) * 3 = 21 ∧ (3 : ℚ) / 4 * 28 = 21 ∧ (28 : ℚ) * 3 = 84 ∧
    (3 : ℚ) / 4 * 28 ≠ 7 ∧ (3 : ℚ) / 4 * 28 ≠ 84 := by norm_num

/-- Preveri se 5: tri vmesne črtice razdelijo enoto na 4 dele (b − 1 = 3 natanko pri b = 4), zato je točka pri
tretji črtici 3/4, ne 3/3 = 1.
trditev: MAT-OS-6/ulomek-kot-del-celote#kviz5
besedilo: »Tri vmesne črtice razdelijo enoto na $4$ dele, zato je imenovalec $4$. Točka je $\dfrac{3}{4}$, ne $1$.« -/
theorem kviz5 (b : ℕ) : ((Finset.Ioo 0 b).card = 3 ↔ b = 4) ∧ (3 : ℚ) / 3 = 1 ∧ (3 : ℚ) / 4 ≠ 1 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  simp only [Nat.card_Ioo]
  omega

end Evklid.Lekcije.MAT_OS_6.UlomekKotDelCelote
