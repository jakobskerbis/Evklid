/-
vir: content/lessons/MAT-OS-6/prikazi-podatkov.md
sha256: 1a35783a0b2492820fa14a9885a385de8e23f4ebcce456aaebb158af5d216381
Model: vreme enega dne je `Vreme` (S, O, D), seznam opazovanj je `List Vreme`, število dni s kategorijo je
`List.count`. Višina stolpca, vrednost in merilo so realna števila: višina = vrednost : merilo,
vrednost = višina · merilo (merilo ≠ 0). Navpična os, ki se začne pri z, da stolpcu za vrednost v višino
(v − z) : merilo. Zaporedne meritve (temperature) so funkcija `Fin n → ℤ`; porast/padec je razlika zaporednih
vrednosti. Enote (dnevi, ptice, °C, mm, cm) so le v docstringih.
Lean: x/0 = 0, zato imajo pravila za merilo pogoj merilo ≠ 0; razlike števil ptic in dni so v ℕ zapisane le, kjer
je zmanjševanec večji (12 − 3, 35 − 20, …), zato odštevanje v ℕ ne odreže pri 0.
Ni v Leanu: risbe (črtice, peterčki kot slika, stolpci, črtični prikaz; dokazane so njihove številke); kako se
podatki zbirajo (štetje, merjenje, anketa) in definicije pojmov (podatek, preglednica, kategorija, stolpčni in
črtični prikaz, Carrollov diagram); pravila dobrega prikaza (naslov, oznake osi, enako široki stolpci, enota) in
postopek branja prikaza (navodila; dokazano je le pravilo osi od 0 in pravilo merila); »črta med vrstami ptic
nima smisla«, »povezujemo le vrednosti, ki si sledijo po času« (premisli 2, Pogoste napake 4, kviz 1 – odločitev o
smislu, ni matematična trditev); »širši stolpec ne pomeni večjega števila« (kviz 1, opis risanja); simulacija;
vremenska napoved, vodostaj reke (opis); kviz 4 – odčitavanje z risbe (dokazan je vrstni red 95 > 80 > 60 > 45).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.PrikaziPodatkov

/-- Vreme enega dne: sončno, oblačno, deževno. -/
inductive Vreme
  | S | O | D
  deriving DecidableEq

open Vreme

/-- Vremenarjev seznam iz uganke (20 dni). -/
def uganka : List Vreme := [S, D, S, O, S, S, D, O, S, D, O, S, S, O, D, S, O, D, S, O]

/-! ## Razlaga -/

/-- Razlaga 1 (rešitev uganke): v seznamu je 9 sončnih, 6 oblačnih in 5 deževnih dni; sončnih je največ.
trditev: MAT-OS-6/prikazi-podatkov#uganka
besedilo: »Rešitev uganke: največ je bilo sončnih dni, $9$.« -/
theorem uganka_resitev : uganka.length = 20 ∧ uganka.count S = 9 ∧ uganka.count O = 6 ∧ uganka.count D = 5 ∧
    uganka.count O < uganka.count S ∧ uganka.count D < uganka.count S := by
  decide

/-- Razlaga 1 (peterčki): 9 = 5 + 4, 6 = 5 + 1, 5 = 5 (en peterček in še nekaj črtic).
trditev: MAT-OS-6/prikazi-podatkov#petercki
besedilo: »Peterčke štejemo po pet, zato se ne zmotimo.« -/
theorem petercki : (9 : ℕ) = 5 + 4 ∧ (6 : ℕ) = 5 + 1 ∧ (5 : ℕ) = 5 * 1 := by norm_num

/-- Razlaga 2 (vrstica »Skupaj« je preizkus), premisli 1, Povzetek 1: ker ima vsak dan natanko eno vreme, je
vsota števil vseh kategorij enaka številu dni; pri uganki 9 + 6 + 5 = 20, vsota 19 bi pomenila napako.
trditev: MAT-OS-6/prikazi-podatkov#skupaj
besedilo: »Vsak dan ima natanko eno vreme, zato mora biti vsota enaka številu dni, $20$.« -/
theorem skupaj (l : List Vreme) : l.count S + l.count O + l.count D = l.length := by
  induction l with
  | nil => rfl
  | cons v l ih => cases v <;> simp <;> omega

/-- Razlaga 2 (preglednica): 9 + 6 + 5 = 20; sošolčeva vsota 19 ni 20.
trditev: MAT-OS-6/prikazi-podatkov#preglednica
besedilo: »Vrstica »Skupaj« je preizkus: $9 + 6 + 5 = 20$, toliko dni je vremenar opazoval.« -/
theorem preglednica : (9 : ℕ) + 6 + 5 = 20 ∧ uganka.count S + uganka.count O + uganka.count D = uganka.length ∧
    (19 : ℕ) ≠ 20 := by
  refine ⟨by norm_num, skupaj uganka, by norm_num⟩

/-- Razlaga 4 in Povzetek 5: pravilo merila: višina = vrednost : merilo natanko tedaj, ko je
vrednost = višina · merilo (merilo ≠ 0).
trditev: MAT-OS-6/prikazi-podatkov#merilo
besedilo: »Višino stolpca v kvadratkih dobimo z deljenjem, vrednost iz višine pa z množenjem:« -/
theorem merilo (visina vrednost m : ℝ) (hm : m ≠ 0) : visina = vrednost / m ↔ vrednost = visina * m := by
  rw [eq_div_iff hm, eq_comm]

example := merilo 4 8 2 two_ne_zero

/-- Razlaga 3, kviz 1: če se navpična os začne pri 0, je stolpec dvakrat višji natanko tedaj, ko je število
dvakrat večje (višina (v − 0) : m).
trditev: MAT-OS-6/prikazi-podatkov#os-od-0
besedilo: »Samo če se os začne pri $0$, je dvakrat višji stolpec res dvakrat večje število.« -/
theorem os_od_0 (v₁ v₂ m : ℝ) (hm : m ≠ 0) : (v₂ - 0) / m = 2 * ((v₁ - 0) / m) ↔ v₂ = 2 * v₁ := by
  rw [sub_zero, sub_zero, mul_div_assoc', div_left_inj₀ hm]

example := os_od_0 5 10 1 one_ne_zero

/-- Razlaga 3 (»samo če«), Pogoste napake 2, Drugače (na sliki), kviz 5: pri osi od 46 sta stolpca za 48 in 50
visoka 48 − 46 = 2 in 50 − 46 = 4 enote; drugi je dvakrat višji, število pa ni dvakrat večje (razlika je le 2).
trditev: MAT-OS-6/prikazi-podatkov#os-od-46
besedilo: »$50 - 48 = 2$. Ker se os začne pri $46$, sta stolpca visoka $2$ in $4$ enote, zato je drugi videti dvakrat višji.« -/
theorem os_od_46 : (48 : ℝ) - 46 = 2 ∧ (50 : ℝ) - 46 = 4 ∧ (4 : ℝ) = 2 * 2 ∧ (50 : ℝ) ≠ 2 * 48 ∧
    (50 : ℝ) - 48 = 2 := by norm_num

/-- Drugače (na sliki): desno je stolpec za 50 visok 50 − 46 = 4 enote, za 48 pa 48 − 46 = 2 enoti.
trditev: MAT-OS-6/prikazi-podatkov#na-sliki
besedilo: »Desno je stolpec za $50$ visok $50 - 46 = 4$ enote, stolpec za $48$ pa $48 - 46 = 2$ enoti.« -/
theorem na_sliki : (50 : ℝ) - 46 = 4 ∧ (48 : ℝ) - 46 = 2 ∧ (50 : ℝ) - 48 = 2 := by norm_num

/-- Razlaga 5 (črtični prikaz temperature): pon 12, tor 15, sre 15, čet 18, pet 14; med torkom in sredo je
povezava vodoravna (15 = 15), od pon do tor in od sre do čet narašča, od čet do pet pada.
trditev: MAT-OS-6/prikazi-podatkov#vodoravna
besedilo: »Med torkom in sredo je vodoravna, ker je bilo oba dneva $15\,^\circ\text{C}$.« -/
theorem vodoravna : (12 : ℤ) < 15 ∧ (15 : ℤ) = 15 ∧ (15 : ℤ) < 18 ∧ (14 : ℤ) < 18 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 12 + 9 + 6 + 3 = 30 ptic; sinic je za 12 − 3 = 9 več kot kosov in 12 : 3 = 4-krat toliko
(12 = 4 · 3).
trditev: MAT-OS-6/prikazi-podatkov#primer-1
besedilo: »Odgovor: videli so $30$ ptic; sinic je bilo za $9$ več kot kosov, to je $4$-krat toliko.« -/
theorem primer1 : (12 : ℕ) + 9 + 6 + 3 = 30 ∧ (12 : ℕ) - 3 = 9 ∧ (12 : ℕ) / 3 = 4 ∧ (4 : ℕ) * 3 = 12 := by
  norm_num

/-- Primer 2: z merilom 2 dneva na kvadratek so višine 8 : 2 = 4, 12 : 2 = 6, 14 : 2 = 7, 10 : 2 = 5; majski stolpec
je najvišji; skupaj 8 + 12 + 14 + 10 = 44 dni.
trditev: MAT-OS-6/prikazi-podatkov#primer-2
besedilo: »Odgovor: stolpci so visoki $4$, $6$, $7$ in $5$ kvadratkov; deževnih dni je bilo $44$.« -/
theorem primer2 : (8 : ℝ) / 2 = 4 ∧ (12 : ℝ) / 2 = 6 ∧ (14 : ℝ) / 2 = 7 ∧ (10 : ℝ) / 2 = 5 ∧
    (4 : ℝ) < 7 ∧ (6 : ℝ) < 7 ∧ (5 : ℝ) < 7 ∧ (8 : ℝ) + 12 + 14 + 10 = 44 := by norm_num

/-- Jutranje temperature iz primera 3 (pon … sob). -/
def jutro : Fin 6 → ℤ := ![4, 7, 9, 9, 6, 2]

/-- Primer 3, koraka 1 in 2: največja temperatura je 9 °C, najmanjša 2 °C; razpon 9 − 2 = 7 °C.
trditev: MAT-OS-6/prikazi-podatkov#primer-3-razpon
besedilo: »Razpon: $9 - 2 = 7\,^\circ\text{C}$.« -/
theorem primer3_razpon : (∀ i, jutro i ≤ 9) ∧ (∀ i, 2 ≤ jutro i) ∧ jutro 2 = 9 ∧ jutro 3 = 9 ∧ jutro 5 = 2 ∧
    (9 : ℤ) - 2 = 7 := by
  refine ⟨by decide, by decide, rfl, rfl, rfl, by norm_num⟩

/-- Primer 3, koraki 3–5: spremembe po dnevih 7 − 4 = 3, 9 − 7 = 2 (narašča), 9 = 9 (enaka), padca 9 − 6 = 3 in
6 − 2 = 4; največji padec med zaporednima dnevoma je 4 °C, od petka do sobote.
trditev: MAT-OS-6/prikazi-podatkov#primer-3-padec
besedilo: »najbolj je temperatura padla od petka do sobote, za $4\,^\circ\text{C}$.« -/
theorem primer3_padec : jutro 1 - jutro 0 = 3 ∧ jutro 2 - jutro 1 = 2 ∧ jutro 3 = jutro 2 ∧
    jutro 3 - jutro 4 = 3 ∧ jutro 4 - jutro 5 = 4 ∧
    ∀ i : Fin 5, jutro i.castSucc - jutro i.succ ≤ 4 := by
  refine ⟨rfl, rfl, rfl, rfl, rfl, by decide⟩

/-- Primer 4 in premisli: z merilom 5 ptic na kvadratek je sinic 7 · 5 = 35, stolpec kosov 7 − 3 = 4 kvadratke,
kosov 4 · 5 = 20, razlika 35 − 20 = 15 = 3 · 5; odgovor 3 (brez merila) je napačen.
trditev: MAT-OS-6/prikazi-podatkov#primer-4
besedilo: »Kosov je $4 \cdot 5 = 20$, sinic je za $35 - 20 = 15$ več. Krajše: razlika $3$ kvadratkov pomeni $3 \cdot 5 = 15$ ptic.« -/
theorem primer4 : (7 : ℕ) * 5 = 35 ∧ (7 : ℕ) - 3 = 4 ∧ (4 : ℕ) * 5 = 20 ∧ (35 : ℕ) - 20 = 15 ∧ (3 : ℕ) * 5 = 15 ∧
    (3 : ℕ) ≠ 15 := by norm_num

/-- Primer 4 (krajše, splošno): razlika vrednosti je razlika višin, pomnožena z merilom.
trditev: MAT-OS-6/prikazi-podatkov#razlika-visin
besedilo: »Krajše: razlika $3$ kvadratkov pomeni $3 \cdot 5 = 15$ ptic.« -/
theorem razlika_visin (h₁ h₂ m : ℝ) : h₁ * m - h₂ * m = (h₁ - h₂) * m := by ring

/-! ## Pogoste napake, Drugače -/

/-- Pogoste napake 1: 6 kvadratkov pri merilu 5 je 6 · 5 = 30 ptic, ne 6.
trditev: MAT-OS-6/prikazi-podatkov#napaka-1
besedilo: »Pravilno: višino pomnožimo z merilom, $6 \cdot 5 = 30$ ptic.« -/
theorem napaka1 : (6 : ℕ) * 5 = 30 ∧ (6 : ℕ) ≠ 30 := by norm_num

/-- Pogoste napake 3: oznake 0, 5, 10, 20, 25 niso enakomerne (razmika 5 in 10), oznake 0, 5, 10, 15, 20, 25 so
(vsi razmiki 5).
trditev: MAT-OS-6/prikazi-podatkov#napaka-3
besedilo: »Enak razmik pa mora pomeniti enako število, sicer višine lažejo.« -/
theorem napaka3 : (10 : ℕ) - 5 ≠ 20 - 10 ∧
    (∀ i : Fin 5, (![0, 5, 10, 15, 20, 25] : Fin 6 → ℕ) i.succ - (![0, 5, 10, 15, 20, 25] : Fin 6 → ℕ) i.castSucc = 5) := by
  refine ⟨by norm_num, by decide⟩

/-- Drugače (iz vsakdanjega življenja, fižol): 2, 5, 9, 14 cm; prirastki 5 − 2 = 3, 9 − 5 = 4, 14 − 9 = 5
naraščajo.
trditev: MAT-OS-6/prikazi-podatkov#fizol
besedilo: »Tedenski prirastki so $3$, $4$ in $5$ centimetrov, zato se povezava vsak teden dviga bolj strmo: rastlina raste vedno hitreje.« -/
theorem fizol : (5 : ℕ) - 2 = 3 ∧ (9 : ℕ) - 5 = 4 ∧ (14 : ℕ) - 9 = 5 ∧ (3 : ℕ) < 4 ∧ (4 : ℕ) < 5 := by norm_num

/-! ## Preveri se -/

/-- Kviz 2: 6 kvadratkov po 5 dni je 6 · 5 = 30 dni; napačna 6 in 6 + 5 = 11.
trditev: MAT-OS-6/prikazi-podatkov#kviz-2
besedilo: »$\text{vrednost} = \text{višina} \cdot \text{merilo} = 6 \cdot 5 = 30$ dni.« -/
theorem kviz2 : (6 : ℕ) * 5 = 30 ∧ (6 : ℕ) + 5 = 11 ∧ (6 : ℕ) ≠ 30 ∧ (11 : ℕ) ≠ 30 := by norm_num

/-- Kviz 3: sinic je 8 · 2 = 16 (korak 1 pravilen), kosov 3 · 2 = 6, ne 3 (korak 2 napačen); pravilna razlika
16 − 6 = 10, ne 16 − 3 = 13.
trditev: MAT-OS-6/prikazi-podatkov#kviz-3
besedilo: »V koraku (2) je pozabljeno merilo: kosov je $3 \cdot 2 = 6$, razlika pa $16 - 6 = 10$.« -/
theorem kviz3 : (8 : ℕ) * 2 = 16 ∧ (3 : ℕ) * 2 = 6 ∧ (16 : ℕ) - 6 = 10 ∧ (16 : ℕ) - 3 = 13 ∧ (13 : ℕ) ≠ 10 ∧
    (16 : ℕ) - 3 * 2 = 10 := by norm_num

/-- Kviz 4: padavine april 95 > marec 80 > januar 60 > februar 45 mm.
trditev: MAT-OS-6/prikazi-podatkov#kviz-4
besedilo: »Višine so april $95\,\text{mm}$, marec $80\,\text{mm}$, januar $60\,\text{mm}$, februar $45\,\text{mm}$.« -/
theorem kviz4 : (95 : ℕ) > 80 ∧ (80 : ℕ) > 60 ∧ (60 : ℕ) > 45 := by norm_num

/-- RACUN: vse vrstice bloka (9 + 6 + 5 = 20, …, 16 − 3 · 2 = 10).
pomozno – vrstice bloka RACUN, ki ni vidno besedilo -/
theorem racun : (9 : ℕ) + 6 + 5 = 20 ∧ (12 : ℕ) + 9 + 6 + 3 = 30 ∧ (12 : ℕ) - 3 = 9 ∧ (12 : ℕ) / 3 = 4 ∧
    (8 : ℕ) / 2 = 4 ∧ (12 : ℕ) / 2 = 6 ∧ (14 : ℕ) / 2 = 7 ∧ (10 : ℕ) / 2 = 5 ∧ (8 : ℕ) + 12 + 14 + 10 = 44 ∧
    (9 : ℕ) - 2 = 7 ∧ (6 : ℕ) - 2 = 4 ∧ (9 : ℕ) - 6 = 3 ∧ (7 : ℕ) - 4 = 3 ∧ (9 : ℕ) - 7 = 2 ∧ (7 : ℕ) - 3 = 4 ∧
    (7 : ℕ) * 5 = 35 ∧ (4 : ℕ) * 5 = 20 ∧ (35 : ℕ) - 20 = 15 ∧ (6 : ℕ) * 5 = 30 ∧ (16 : ℕ) - 3 * 2 = 10 := by
  norm_num

end Evklid.Lekcije.MAT_OS_6.PrikaziPodatkov
