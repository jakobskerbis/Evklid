/-
vir: content/lessons/MAT-OS-8/besedilne-naloge-z-enacbami.md
sha256: 7952b584033b2778e459fe33414cd2dc47d769c7bfce06d828525316713a99d9
Model: količine so realna števila brez enot (€, cm, leta so le v docstringih); decimalna števila so točni
ulomki v ℝ (1,20 = 6/5). Reševanje enačbe je veriga `calc` ekvivalenc (↔) z vmesnimi enačbami iz lekcije, zato je
dokazana celotna množica rešitev. Primer 4 (zaporedna naravna števila) je v ℕ.
Ni v Leanu: prevod zgodbe v enačbo (izbira neznanke, »kaj pomeni x«, tabela besedilo → izraz kot dogovor zapisa;
dokazano je le, da sta napačna zapisa iz Premisli in Pogostih napak drugačna izraza), postopek v šestih korakih,
navodila »preizkus v besedilu«, »odgovori s stavkom« (in pogosta napaka »odgovor je samo x«), »zapiši enoto« in kviz 1 (navodila, ne matematične trditve);
Premisli z x = 24,5 učenca in »rešitev mora biti smiselna« (razlaga pomena); simulacija »Od besedila do enačbe«
(dokazana je le njena enačba 4x + 4 = 40); risba s trakovi (dokazana je enačba 4x = 36 in 36 : 4 = 9);
nasvet »izberi neznanko brez ulomkov« (nasvet; dokazano je, da obe izbiri neznanke dasta isti rezultat).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.BesedilneNalogeZEnacbami

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo (zvezki): 3x + 1,20 = 7,20 ima natanko rešitev x = 2; na pamet:
(7,20 − 1,20) : 3 = 2.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#zvezki
besedilo: »od 7,20 € odšteješ svinčnik in ostanek razdeliš na tri dele, torej zvezek stane 2 €« -/
theorem zvezki (x : ℝ) : 3 * x + 6 / 5 = 36 / 5 ↔ x = 2 := by
  constructor <;> intro h <;> linarith

/-- Zakaj se tega učimo, račun na pamet: (7,20 − 1,20) : 3 = 2.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#zvezki-na-pamet
besedilo: »od 7,20 € odšteješ svinčnik in ostanek razdeliš na tri dele, torej zvezek stane 2 €« -/
theorem zvezki_na_pamet : ((36 : ℝ) / 5 - 6 / 5) / 3 = 2 := by norm_num

/-! ## Razlaga -/

/-- Razlaga 1, Premisli in Pogoste napake (obrnjeno odštevanje): za Ano z 20 € ima Bor x − 5 = 15 €, napačni
izraz 5 − x pa da −15; izraza sta torej različna.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#obrnjeno-odstevanje
besedilo: »Če ima Ana $20$ evrov, ima Bor $15$ evrov, izraz $5 - 20$ pa da $-15$.« -/
theorem obrnjeno_odstevanje : (20 : ℝ) - 5 = 15 ∧ (5 : ℝ) - 20 = -15 ∧ (20 : ℝ) - 5 ≠ 5 - 20 := by norm_num

/-- Razlaga 1 in Pogoste napake: »za 3 več« (x + 3) in »trikrat toliko« (3x) sta različna izraza, npr. pri
x = 2 (5 ≠ 6).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#za-vec-ni-krat
besedilo: »Pazi na razliko: »za $3$ več« pomeni prištevanje ($x + 3$), »trikrat toliko« (pogovorno tudi »trikrat več«) pa množenje ($3x$).« -/
theorem za_vec_ni_krat : ∃ x : ℝ, x + 3 ≠ 3 * x := ⟨2, by norm_num⟩

/-- Razlaga 2 in 3: x + 3x = 36 ima natanko rešitev x = 9 (4x = 36).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#ana-bor
besedilo: »V našem primeru: $4x = 36$, zato $x = 9$.« -/
theorem ana_bor (x : ℝ) : x + 3 * x = 36 ↔ x = 9 := by
  calc x + 3 * x = 36 ↔ 4 * x = 36 := by constructor <;> intro h <;> linarith
    _ ↔ x = 9 := by constructor <;> intro h <;> linarith

/-- Razlaga 3, preizkus: Bor ima 3 · 9 = 27, 9 + 27 = 36 in 27 = 3 · 9.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#ana-bor-preizkus
besedilo: »Ana ima $9$ evrov, Bor $27$ evrov. Preizkus: $9 + 27 = 36$ in $27 = 3 \cdot 9$.« -/
theorem ana_bor_preizkus : (3 : ℝ) * 9 = 27 ∧ (9 : ℝ) + 27 = 36 ∧ (27 : ℝ) = 3 * 9 := by norm_num

/-- Razlaga 4 (simulacija, »za koliko več« = 4): 4x + 4 = 40 ima natanko rešitev x = 9.
pomozno – besedilo ob simulaciji pove le enačbo 4x + 4 = 40, njene rešitve x = 9 ne navede -/
theorem simulacija (x : ℝ) : 4 * x + 4 = 40 ↔ x = 9 := by
  constructor <;> intro h <;> linarith

/-! ## Rešeni primeri -/

/-- Primer 1 (mišljeno število): 3x + 7 = 34 ima natanko rešitev x = 9, po korakih 3x = 27, x = 9.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#primer1
besedilo: »Odgovor: mislim si število $9$.« -/
theorem primer1 (x : ℝ) : 3 * x + 7 = 34 ↔ x = 9 := by
  calc 3 * x + 7 = 34 ↔ 3 * x = 27 := by constructor <;> intro h <;> linarith
    _ ↔ x = 9 := by constructor <;> intro h <;> linarith

/-- Primer 1, preizkus: 9 · 3 = 27 in 27 + 7 = 34.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#primer1-preizkus
besedilo: »Preizkus v besedilu: $9 \cdot 3 = 27$ in $27 + 7 = 34$. Drži.« -/
theorem primer1_preizkus : (9 : ℝ) * 3 = 27 ∧ (27 : ℝ) + 7 = 34 := by norm_num

/-- Primer 2 (pravokotnik z obsegom 54 cm): 2(x + 7) + 2x = 54 ima natanko rešitev x = 10, po korakih
2x + 14 + 2x = 54, 4x + 14 = 54, 4x = 40, x = 10.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#primer2
besedilo: »Odštejemo $14$: $4x = 40$. Delimo s $4$: $x = 10$.« -/
theorem primer2 (x : ℝ) : 2 * (x + 7) + 2 * x = 54 ↔ x = 10 := by
  calc 2 * (x + 7) + 2 * x = 54 ↔ 2 * x + 14 + 2 * x = 54 := by
        constructor <;> intro h <;> linarith
    _ ↔ 4 * x + 14 = 54 := by constructor <;> intro h <;> linarith
    _ ↔ 4 * x = 40 := by constructor <;> intro h <;> linarith
    _ ↔ x = 10 := by constructor <;> intro h <;> linarith

/-- Primer 2, korak 5 in preizkus: dolžina 10 + 7 = 17, 17 − 10 = 7 in 2 · 17 + 2 · 10 = 54.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#primer2-preizkus
besedilo: »Preizkus: $17 - 10 = 7$ in $2 \cdot 17 + 2 \cdot 10 = 54$. Oba pogoja držita.« -/
theorem primer2_preizkus : (10 : ℝ) + 7 = 17 ∧ (17 : ℝ) - 10 = 7 ∧ (2 : ℝ) * 17 + 2 * 10 = 54 := by norm_num

/-- Primer 3 (oče in sin): 3x + 12 = 2(x + 12) ima natanko rešitev x = 12, po korakih 3x + 12 = 2x + 24,
x = 12.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#primer3
besedilo: »Odštejemo $2x$ in $12$: $x = 12$.« -/
theorem primer3 (x : ℝ) : 3 * x + 12 = 2 * (x + 12) ↔ x = 12 := by
  calc 3 * x + 12 = 2 * (x + 12) ↔ 3 * x + 12 = 2 * x + 24 := by
        constructor <;> intro h <;> linarith
    _ ↔ x = 12 := by constructor <;> intro h <;> linarith

/-- Primer 3, korak 5 in preizkus: oče je star 3 · 12 = 36; čez 12 let 36 + 12 = 48 in 12 + 12 = 24,
48 = 2 · 24.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#primer3-preizkus
besedilo: »Preizkus v besedilu: danes $36 = 3 \cdot 12$. Čez $12$ let bo oče star $48$, sin $24$ let, in $48 = 2 \cdot 24$. Drži.« -/
theorem primer3_preizkus :
    (3 : ℝ) * 12 = 36 ∧ (36 : ℝ) + 12 = 48 ∧ (12 : ℝ) + 12 = 24 ∧ (48 : ℝ) = 2 * 24 := by norm_num

/-- Primer 4 (tri zaporedna naravna števila z vsoto 72): x + (x + 1) + (x + 2) = 72 je isto kot 3x + 3 = 72,
3x = 69 in ima v ℕ natanko rešitev x = 23.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#primer4
besedilo: »$3x = 69$, $x = 23$.« -/
theorem primer4 (x : ℕ) : x + (x + 1) + (x + 2) = 72 ↔ x = 23 := by
  calc x + (x + 1) + (x + 2) = 72 ↔ 3 * x + 3 = 72 := by constructor <;> intro h <;> omega
    _ ↔ 3 * x = 69 := by constructor <;> intro h <;> omega
    _ ↔ x = 23 := by constructor <;> intro h <;> omega

/-- Primer 4, Premisli, preizkus: števila so 23, 24, 25 in 23 + 24 + 25 = 72.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#primer4-preizkus
besedilo: »Števila so $23$, $24$ in $25$. Preizkus: $23 + 24 + 25 = 72$.« -/
theorem primer4_preizkus : 23 + 1 = 24 ∧ 23 + 2 = 25 ∧ 23 + 24 + 25 = 72 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake (manjkajoč oklepaj): 2x − 4 in 2(x − 4) se pri vsakem x razlikujeta (za 4).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#manjkajoc-oklepaj
besedilo: »Popravek: $2(x - 4)$; oklepaj ohrani vrstni red iz besedila.« -/
theorem manjkajoc_oklepaj (x : ℝ) : 2 * x - 4 ≠ 2 * (x - 4) := by
  intro h; linarith

/-- Pogoste napake (starosti): 2x + 12 in 2(x + 12) se pri vsakem x razlikujeta (za 12).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#manjkajoc-oklepaj-starost
besedilo: »Enako pri starostih: pravilno je $2(x + 12)$, ne $2x + 12$.« -/
theorem manjkajoc_oklepaj_starost (x : ℝ) : 2 * x + 12 ≠ 2 * (x + 12) := by
  intro h; linarith

/-- Pogoste napake (čas le eni osebi): napačna enačba 3x + 12 = 2x ima rešitev x = −12, ne 12.
pomozno – lekcija napačne enačbe 3x + 12 = 2x ne reši (rešitve −12 ne navede) -/
theorem cas_le_eni (x : ℝ) : 3 * x + 12 = 2 * x ↔ x = -12 := by
  constructor <;> intro h <;> linarith

/-! ## Drugače -/

/-- Na sliki: štirje trakovi merijo 36, en trak 36 : 4 = 9; enačba 4x = 36 ima natanko rešitev x = 9.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#trakovi
besedilo: »Skupaj so štirje trakovi, ki merijo $36$. En trak je torej $36 : 4 = 9$. To je natanko enačba $4x = 36$.« -/
theorem trakovi (x : ℝ) : (36 : ℝ) / 4 = 9 ∧ (4 * x = 36 ↔ x = 9) :=
  ⟨by norm_num, by constructor <;> intro h <;> linarith⟩

/-- Na sliki (pravokotnik): štirje trakovi x in dva koščka 7 so 2(x + 7) + 2x = 4x + 14.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#trakovi-pravokotnik
besedilo: »Obseg sestavljajo štirje trakovi $x$ in dva koščka $7$« -/
theorem trakovi_pravokotnik (x : ℝ) : 2 * (x + 7) + 2 * x = 4 * x + 14 := by ring

/-- Iz vsakdanjega življenja (taksi): 3 + 1,2x = 15 ima natanko rešitev x = 10, po korakih 1,2x = 12, x = 10.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#taksi
besedilo: »Odšteješ stalni del: $1{,}2x = 12$, nato deliš: $x = 10$.« -/
theorem taksi (x : ℝ) : 3 + 6 / 5 * x = 15 ↔ x = 10 := by
  calc 3 + 6 / 5 * x = 15 ↔ 6 / 5 * x = 12 := by constructor <;> intro h <;> linarith
    _ ↔ x = 10 := by constructor <;> intro h <;> linarith

/-- Korak za korakom (tabela): obseg 2(b + 7) + 2b pri širinah 8, 9, 10 je 46, 50, 54 (dolžine 15, 16, 17).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#tabela-obsegov
besedilo: »| $8$ | $15$ | $46$ | | $9$ | $16$ | $50$ | | $10$ | $17$ | $54$ |« -/
theorem tabela_obsegov :
    (8 : ℝ) + 7 = 15 ∧ (9 : ℝ) + 7 = 16 ∧ (10 : ℝ) + 7 = 17 ∧
    2 * ((8 : ℝ) + 7) + 2 * 8 = 46 ∧ 2 * ((9 : ℝ) + 7) + 2 * 9 = 50 ∧ 2 * ((10 : ℝ) + 7) + 2 * 10 = 54 := by
  norm_num

/-- Korak za korakom: ko se širina poveča za 1, se obseg poveča za 4 (koeficient v 4x + 14).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#obseg-raste-za-4
besedilo: »Opazi še: ko se širina poveča za $1$, se obseg poveča za $4$.« -/
theorem obseg_raste_za_4 (b : ℝ) : 2 * ((b + 1) + 7) + 2 * (b + 1) = (2 * (b + 7) + 2 * b) + 4 := by ring

/-- Bolj natančno (neznanka y = očetova starost): y + 12 = 2(y/3 + 12) ima natanko rešitev y = 36, po korakih
y + 12 = 2y/3 + 24, y/3 = 12, y = 36 (isti rezultat kot v primeru 3).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#oce-y
besedilo: »Odpraviš oklepaj: $y + 12 = \dfrac{2y}{3} + 24$, zato $\dfrac{y}{3} = 12$ in $y = 36$.« -/
theorem oce_y (y : ℝ) : y + 12 = 2 * (y / 3 + 12) ↔ y = 36 := by
  calc y + 12 = 2 * (y / 3 + 12) ↔ y + 12 = 2 * y / 3 + 24 := by
        constructor <;> intro h <;> linarith
    _ ↔ y / 3 = 12 := by constructor <;> intro h <;> linarith
    _ ↔ y = 36 := by constructor <;> intro h <;> linarith

/-- Bolj natančno: s samim pogojem »oče je trikrat starejši« (o = 3s) ima naloga neskončno mnogo rešitev
(s, o).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#manjka-pogoj
besedilo: »Če pogoj manjka (na primer samo »oče je trikrat starejši«), ima naloga neskončno mnogo rešitev.« -/
theorem manjka_pogoj : Set.Infinite {p : ℝ × ℝ | p.2 = 3 * p.1} := by
  refine Set.infinite_of_injective_forall_mem (f := fun s : ℝ => (s, 3 * s)) ?_ ?_
  · intro a b h
    exact (Prod.ext_iff.mp h).1
  · intro s
    simp

/-! ## Preveri se -/

/-- Preveri se, vprašanje 2: »x zmanjšamo za 4 in rezultat podvojimo« je 2(x − 4) = 2x − 8, kar ni enako
2x − 4 (glej `manjkajoc_oklepaj`) in pri x = 0 ni enako 4 − 2x.
pomozno – razlaga (>) in povratni informaciji ne navedejo 2(x − 4) = 2x − 8 in ne primerjave s 4 − 2x pri x = 0 -/
theorem kviz2 (x : ℝ) : 2 * (x - 4) = 2 * x - 8 ∧ 2 * ((0 : ℝ) - 4) ≠ 4 - 2 * 0 :=
  ⟨by ring, by norm_num⟩

/-- Preveri se, vprašanje 3: 4x + 5 = 3(x + 5) ima natanko rešitev x = 10; preizkus 4 · 10 = 40,
40 + 5 = 45 = 3 · 15.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#kviz3
besedilo: »Rešitev je $x = 10$« -/
theorem kviz3 (x : ℝ) : 4 * x + 5 = 3 * (x + 5) ↔ x = 10 := by
  constructor <;> intro h <;> linarith

/-- Preveri se, vprašanje 3, preizkus: oče 4 · 10 = 40, čez 5 let 45 = 3 · 15.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#kviz3-preizkus
besedilo: »sin $10$ let, oče $40$ let, čez $5$ let $45 = 3 \cdot 15$.« -/
theorem kviz3_preizkus : (4 : ℝ) * 10 = 40 ∧ (40 : ℝ) + 5 = 45 ∧ (45 : ℝ) = 3 * (10 + 5) := by norm_num

/-- Preveri se, vprašanje 3, napačni enačbi: 4x + 5 = 3x + 5 da x = 0, 4x = 3(x + 5) da x = 15 (ne 10).
pomozno – povratni informaciji ne povesta, da napačni enačbi dasta x = 0 in x = 15 -/
theorem kviz3_napacni (x : ℝ) : (4 * x + 5 = 3 * x + 5 ↔ x = 0) ∧ (4 * x = 3 * (x + 5) ↔ x = 15) :=
  ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith⟩

/-- Preveri se, vprašanje 4: (x + 8)/2 = 11 ima natanko rešitev x = 14 (x + 8 = 22).
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#kviz4
besedilo: »$\dfrac{x + 8}{2} = 11$, zato $x + 8 = 22$ in $x = 14$.« -/
theorem kviz4 (x : ℝ) : (x + 8) / 2 = 11 ↔ x = 14 := by
  calc (x + 8) / 2 = 11 ↔ x + 8 = 22 := by constructor <;> intro h <;> linarith
    _ ↔ x = 14 := by constructor <;> intro h <;> linarith

/-- Preveri se, vprašanje 4, napačna odgovora: x/2 + 8 = 11 da x = 6; 22 + 8 = 30, pravilno 22 − 8 = 14;
preizkus 14 + 8 = 22, 22 : 2 = 11.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#kviz4-napacni
besedilo: »Pri obratnem računanju si $8$ prištel namesto odštel: $22 + 8$. Pravilno je $22 - 8$.« -/
theorem kviz4_napacni (x : ℝ) :
    (x / 2 + 8 = 11 ↔ x = 6) ∧ (22 : ℝ) + 8 = 30 ∧ (22 : ℝ) - 8 = 14 ∧ (14 : ℝ) + 8 = 22 ∧ (22 : ℝ) / 2 = 11 :=
  ⟨by constructor <;> intro h <;> linarith, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se, vprašanje 5: 2 · 2x + 2x = 36 ima natanko rešitev x = 6 (6x = 36); dolžina 2 · 6 = 12.
trditev: MAT-OS-8/besedilne-naloge-z-enacbami#kviz5
besedilo: »Širina $x$, dolžina $2x$: $2 \cdot 2x + 2x = 36$, $6x = 36$, $x = 6$.« -/
theorem kviz5 (x : ℝ) : 2 * (2 * x) + 2 * x = 36 ↔ x = 6 := by
  calc 2 * (2 * x) + 2 * x = 36 ↔ 6 * x = 36 := by constructor <;> intro h <;> linarith
    _ ↔ x = 6 := by constructor <;> intro h <;> linarith

/-- Preveri se, vprašanje 5, napačna odgovora: 36 : 4 = 9 (kot kvadrat); x + 2x = 36 da x = 12.
pomozno – povratni informaciji ne navedeta vrednosti 36 : 4 = 9 in x = 12 iz napačnih enačb -/
theorem kviz5_napacni (x : ℝ) : (36 : ℝ) / 4 = 9 ∧ (x + 2 * x = 36 ↔ x = 12) ∧ (2 : ℝ) * 6 = 12 :=
  ⟨by norm_num, by constructor <;> intro h <;> linarith, by norm_num⟩

end Evklid.Lekcije.MAT_OS_8.BesedilneNalogeZEnacbami
