/-
vir: content/lessons/MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata.md
sha256: b9c4ccd7bd1c43ec860807be148714d3c14001d9e8a37d872bd7e506ab36b69b
Model: dolžini stranic a, b sta realni števili v isti enoti (cm, m …); obseg pravokotnika je `obseg a b = 2·(a + b)`,
ploščina `ploscina a b = a·b`, kvadrat je pravokotnik z b = a. Enote so v računih le števila: dolžine v cm, 1 m =
100 cm, ploščine v cm² (1 m² = 100·100 cm²). Ploščina kot »število kvadratkov« je dokazana za cela a, b (moč mreže
b vrst po a kvadratkov) in kot Lebesguova mera pravokotnika [0, a] × [0, b] v ravnini ℝ × ℝ. Obratni nalogi (deljenje
z a) imata pogoj a ≠ 0 (stranica ni nič; v Leanu je x/0 = 0).
»Približno« v kvizu 2 je dokazano kot: 798 je med ponujenimi odgovori (60, 120, 800, 8000) najbližje 800.
Ni v Leanu: enote in »cm · cm = cm²« (dimenzijska analiza, v modelu so le števila); »obseg meri v mm, cm, m, km« in
»kaj meri / kako dobim« v tabeli sta opis pojma; poskus s pekačem, vrvico in keksi, zgodbe (deska, prtiček, pekač,
ploščice, slika, soba) in nasveti (»Pred računom se vprašaj …«, »V trgovini …«) so okvir računov; risbe mrež
(dokazana so štetja 3·4, 6·2, 4·4); simulacija »Obseg in ploščina pravokotnika« (dokazana je podvojitev 4 × 3 → 8 × 6);
napačna odgovora kviza 3 o številu stranic in pečici sta opis.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.ObsegInPloscinaPravokotnikaInKvadrata

open MeasureTheory

/-- Obseg pravokotnika s stranicama a, b. -/
def obseg (a b : ℝ) : ℝ := 2 * (a + b)

/-- Ploščina pravokotnika s stranicama a, b. -/
def ploscina (a b : ℝ) : ℝ := a * b

/-! ## Razlaga: obseg in ploščina -/

/-- Razlaga (obseg je rob) in Povzetek: obseg pravokotnika je vsota vseh štirih stranic a + b + a + b = 2·(a + b).
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#obseg-pravokotnika
besedilo: »o = a + b + a + b = 2 \cdot (a + b)« -/
theorem obseg_pravokotnika (a b : ℝ) : a + b + a + b = obseg a b := by unfold obseg; ring

/-- Razlaga, Povzetek in Bolj natančno: kvadrat je pravokotnik z b = a: o = 2·(a + a) = 4·a, p = a·a = a².
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#kvadrat
besedilo: »Če v formulah za pravokotnik postaviš $b = a$, dobiš $o = 2 \cdot (a + a) = 4 \cdot a$ in $p = a \cdot a = a^2$.« -/
theorem kvadrat (a : ℝ) : obseg a a = 2 * (a + a) ∧ 2 * (a + a) = 4 * a ∧ ploscina a a = a * a ∧ a * a = a ^ 2 := by
  unfold obseg ploscina; refine ⟨rfl, by ring, rfl, by ring⟩

/-- Razlaga (zakaj množimo): v pravokotniku je b vrst po a kvadratkov, skupaj a·b kvadratkov (štetje mreže).
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#mreza
besedilo: »Na splošno je v pravokotniku $b$ vrst po $a$ kvadratkov:« -/
theorem mreza (a b : ℕ) : (Finset.range b ×ˢ Finset.range a).card = a * b := by
  rw [Finset.card_product, Finset.card_range, Finset.card_range, Nat.mul_comm]

/-- Razlaga in Povzetek: ploščina pravokotnika s stranicama a ≥ 0, b (mera lika [0, a] × [0, b]) je a·b.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#ploscina-pravokotnika
besedilo: »Pravokotnik: $p = a \cdot b$. Kvadrat: $p = a^2$.« -/
theorem ploscina_pravokotnika (a b : ℝ) (ha : 0 ≤ a) :
    volume (Set.Icc (0 : ℝ) a ×ˢ Set.Icc (0 : ℝ) b) = ENNReal.ofReal (ploscina a b) := by
  unfold ploscina
  rw [Measure.volume_eq_prod, Measure.prod_prod, Real.volume_Icc, Real.volume_Icc, sub_zero, sub_zero,
    ENNReal.ofReal_mul ha]

example := ploscina_pravokotnika 4 3 (by norm_num)

/-- Razlaga: pravokotnik 4 cm × 3 cm: 3·4 = 12 kvadratkov (12 cm²); rob 4 + 3 + 4 + 3 = 14 cm.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#stiri-tri
besedilo: »Rob istega lika pa meri $4 + 3 + 4 + 3 = 14\,\text{cm}$.« -/
theorem stiri_tri : (Finset.range 3 ×ˢ Finset.range 4).card = 3 * 4 ∧ 3 * 4 = 12 ∧ ploscina 4 3 = 12 ∧
    (4 : ℝ) + 3 + 4 + 3 = 14 ∧ obseg 4 3 = 14 := by
  unfold ploscina obseg; refine ⟨by decide, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga (premisli): 4 + 3 = 7 ni ploščina; 3 vrste po 4 kvadratke da 3·4 = 12.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#premisli-sestevanje
besedilo: »Notranjost ima $3$ cele vrste po $4$ kvadratke, zato je treba množiti: $3 \cdot 4 = 12$.« -/
theorem premisli_sestevanje : (4 : ℝ) + 3 = 7 ∧ (3 : ℝ) * 4 = 12 ∧ ploscina 4 3 ≠ 4 + 3 := by
  unfold ploscina; norm_num

/-- Razlaga (ista enota): 0,4 m = 40 cm (1 m = 100 cm).
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#ista-enota
besedilo: »Pekač, dolg $0{,}4\,\text{m}$ in širok $25\,\text{cm}$, najprej zapiši kot $40\,\text{cm}$ in $25\,\text{cm}$.« -/
theorem ista_enota : (0.4 : ℝ) * 100 = 40 := by norm_num

/-- Razlaga (premisli) in Povzetek: če podvojiš obe stranici, se obseg podvoji, ploščina pa poveča štirikrat.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#podvojitev
besedilo: »Če podvojiš obe stranici, se obseg podvoji, ploščina pa poveča štirikrat.« -/
theorem podvojitev (a b : ℝ) : obseg (2 * a) (2 * b) = 2 * obseg a b ∧ ploscina (2 * a) (2 * b) = 4 * ploscina a b := by
  unfold obseg ploscina; constructor <;> ring

/-- Razlaga (premisli): 4 cm × 3 cm → 8 cm × 6 cm: obseg s 14 cm na 28 cm, ploščina z 12 cm² na 48 cm².
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#premisli-podvojitev
besedilo: »Ploščina pa je štirikrat večja: z $12\,\text{cm}^2$ na $48\,\text{cm}^2$.« -/
theorem premisli_podvojitev : obseg 4 3 = 14 ∧ obseg 8 6 = 28 ∧ (28 : ℝ) = 2 * 14 ∧ ploscina 4 3 = 12 ∧
    ploscina 8 6 = 48 ∧ (48 : ℝ) = 4 * 12 := by
  unfold obseg ploscina; norm_num

/-- Razlaga (obratna naloga) in Povzetek: pri a ≠ 0 je p = a·b natanko tedaj, ko b = p : a.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#obratna-ploscina
besedilo: »Ker je $p = a \cdot b$, drugo stranico dobiš z deljenjem: $b = p : a$.« -/
theorem obratna_ploscina (a b p : ℝ) (ha : a ≠ 0) : ploscina a b = p ↔ b = p / a := by
  unfold ploscina
  constructor
  · rintro rfl; field_simp
  · rintro rfl; field_simp

example := obratna_ploscina 40 30 1200 (by norm_num)

/-- Razlaga (obratna naloga) in Povzetek: iz obsega: a + b = o : 2, in b = o : 2 − a natanko tedaj, ko je o obseg.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#obratna-obseg
besedilo: »Neznana stranica: $b = p : a$ ali $b = o : 2 - a$.« -/
theorem obratna_obseg (a b o : ℝ) : obseg a b = o ↔ b = o / 2 - a := by
  unfold obseg; constructor <;> intro h <;> linarith

/-- Razlaga (obratna naloga): pri znanem obsegu je a + b = o : 2.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#pol-obsega
besedilo: »Če poznaš obseg pravokotnika in eno stranico, najprej izračunaš $a + b = o : 2$, nato odšteješ znano stranico.« -/
theorem pol_obsega (a b : ℝ) : a + b = obseg a b / 2 := by unfold obseg; ring

/-- Povzetek in Pogoste napake 4: enak obseg ne pomeni enake ploščine: 20 × 20 in 30 × 10 imata obseg 80,
ploščini 400 in 300.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#enak-obseg
besedilo: »Ne drži: $20 \times 20$ in $30 \times 10$ imata oba obseg $80\,\text{cm}$, ploščini pa $400\,\text{cm}^2$ in $300\,\text{cm}^2$.« -/
theorem enak_obseg :
    obseg 20 20 = 80 ∧ obseg 30 10 = 80 ∧ ploscina 20 20 = 400 ∧ ploscina 30 10 = 300 ∧
      ¬ ∀ a b c d : ℝ, obseg a b = obseg c d → ploscina a b = ploscina c d := by
  refine ⟨by unfold obseg; norm_num, by unfold obseg; norm_num, by unfold ploscina; norm_num,
    by unfold ploscina; norm_num, fun h => ?_⟩
  have := h 20 20 30 10 (by unfold obseg; norm_num)
  unfold ploscina at this; norm_num at this

/-- Kviz 3 (splošno): pri enakem obsegu ima kvadrat večjo ploščino kot pravokotnik z različnima stranicama
(stranica kvadrata z obsegom 2·(a + b) je (a + b)/2).
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#kvadrat-najvec
besedilo: »Pri enakem obsegu ima kvadrat večjo ploščino kot podolgovat pravokotnik.« -/
theorem kvadrat_najvec (a b : ℝ) (hab : a ≠ b) :
    obseg ((a + b) / 2) ((a + b) / 2) = obseg a b ∧ ploscina a b < ploscina ((a + b) / 2) ((a + b) / 2) := by
  unfold obseg ploscina
  refine ⟨by ring, ?_⟩
  have : 0 < (a - b) ^ 2 := by positivity
  nlinarith

example := kvadrat_najvec 30 10 (by norm_num)

/-! ## Rešeni primeri -/

/-- Primer 1: o = 2·(30 + 20) = 2·50 = 100 cm, p = 30·20 = 600 cm².
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#primer-1
besedilo: »Odgovor: potrebuješ $100\,\text{cm}$ traku in $600\,\text{cm}^2$ folije.« -/
theorem primer1 : obseg 30 20 = 100 ∧ ploscina 30 20 = 600 := by
  constructor
  · calc obseg 30 20 = 2 * (30 + 20) := rfl
      _ = 2 * 50 := by norm_num
      _ = 100 := by norm_num
  · calc ploscina 30 20 = 30 * 20 := rfl
      _ = 600 := by norm_num

/-- Primer 2: o = 4·32 = 128 cm = 1,28 m; p = 32·32 = 1024 cm².
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#primer-2
besedilo: »Odgovor: babica potrebuje $1{,}28\,\text{m}$ čipke, prtiček ima ploščino $1024\,\text{cm}^2$.« -/
theorem primer2 : obseg 32 32 = 4 * 32 ∧ (4 : ℝ) * 32 = 128 ∧ (128 : ℝ) / 100 = 1.28 ∧ ploscina 32 32 = 32 * 32 ∧
    (32 : ℝ) * 32 = 1024 := by
  unfold obseg ploscina; norm_num

/-- Primer 3: 40·b = 1200 natanko pri b = 1200 : 40 = 30 cm; preverimo 40·30 = 1200; o = 2·(40 + 30) = 2·70 = 140 cm.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#primer-3
besedilo: »Odgovor: pekač je širok $30\,\text{cm}$, za rob potrebuješ $140\,\text{cm}$ traku.« -/
theorem primer3 (b : ℝ) : (ploscina 40 b = 1200 ↔ b = 30) ∧ (1200 : ℝ) / 40 = 30 ∧ (40 : ℝ) * 30 = 1200 ∧
    obseg 40 30 = 140 := by
  refine ⟨?_, by norm_num, by norm_num, ?_⟩
  · rw [obratna_ploscina 40 b 1200 (by norm_num)]; norm_num
  · calc obseg 40 30 = 2 * (40 + 30) := rfl
      _ = 2 * 70 := by norm_num
      _ = 140 := by norm_num

/-- Primer 4: 3 m = 300 cm; v vrsto 300 : 20 = 15 ploščic, vrst 60 : 20 = 3, skupaj 15·3 = 45; s ploščinami:
300·60 = 18000, 20·20 = 400, 18000 : 400 = 45.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#primer-4
besedilo: »pas meri $300 \cdot 60 = 18000\,\text{cm}^2$, ploščica $20 \cdot 20 = 400\,\text{cm}^2$, in $18000 : 400 = 45$.« -/
theorem primer4 :
    (3 : ℝ) * 100 = 300 ∧ (300 : ℝ) / 20 = 15 ∧ (60 : ℝ) / 20 = 3 ∧ (15 : ℝ) * 3 = 45 ∧ ploscina 300 60 = 18000 ∧
      ploscina 20 20 = 400 ∧ (18000 : ℝ) / 400 = 45 := by
  unfold ploscina; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 2: 6 + 4 = 10 je le pol roba; o = 2·(6 + 4) = 20 cm.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#napaka-pol-roba
besedilo: »Stranic so štiri: $o = 2 \cdot (6 + 4) = 20\,\text{cm}$.« -/
theorem napaka_pol_roba : (6 : ℝ) + 4 = 10 ∧ obseg 6 4 = 20 ∧ obseg 6 4 = 2 * (6 + 4) := by
  unfold obseg; norm_num

/-- Pogoste napake 5 in kviz 4: 30·b = 600 natanko pri b = 600 : 30 = 20 (ne 600 − 30 = 570, ne 600 : 2 − 30 = 270,
ne 600·30 = 18000); preizkus 30·20 = 600.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#obratna-600
besedilo: »$b = p : a = 600 : 30 = 20\,\text{cm}$. Preizkus: $30 \cdot 20 = 600$.« -/
theorem obratna600 (b : ℝ) : (ploscina 30 b = 600 ↔ b = 20) ∧ (600 : ℝ) / 30 = 20 ∧ (30 : ℝ) * 20 = 600 ∧
    (600 : ℝ) - 30 = 570 ∧ (600 : ℝ) / 2 - 30 = 270 ∧ (600 : ℝ) * 30 = 18000 ∧ ploscina 30 570 ≠ 600 ∧
    ploscina 30 270 ≠ 600 ∧ ploscina 30 18000 ≠ 600 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by unfold ploscina; norm_num,
    by unfold ploscina; norm_num, by unfold ploscina; norm_num⟩
  rw [obratna_ploscina 30 b 600 (by norm_num)]; norm_num

/-! ## Drugače -/

/-- Na sliki: pekač A (6 × 2) in B (4 × 4): oba roba merita 16 (6 + 2 + 6 + 2 = 4 + 4 + 4 + 4 = 16), A ima 12,
B pa 16 kvadratkov.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#na-sliki
besedilo: »Kvadratni pekač sprejme več testa, čeprav ima enako dolg rob.« -/
theorem na_sliki :
    (6 : ℝ) + 2 + 6 + 2 = 16 ∧ (4 : ℝ) + 4 + 4 + 4 = 16 ∧ obseg 6 2 = obseg 4 4 ∧
      (Finset.range 2 ×ˢ Finset.range 6).card = 12 ∧ (Finset.range 4 ×ˢ Finset.range 4).card = 16 ∧
      ploscina 6 2 < ploscina 4 4 := by
  refine ⟨by norm_num, by norm_num, by unfold obseg; norm_num, by decide, by decide, by unfold ploscina; norm_num⟩

/-- Iz vsakdanjega življenja: trak okrog slike 2·(40 + 25) = 130 cm; soba 4 m × 3 m: parket 4·3 = 12 m², letvice
(obseg) 14 m.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#vsakdan
besedilo: »Za parket potrebuješ $4 \cdot 3 = 12\,\text{m}^2$. Za letvice ob steni pa bi računal obseg, $14\,\text{m}$.« -/
theorem vsakdan : obseg 40 25 = 130 ∧ ploscina 4 3 = 12 ∧ obseg 4 3 = 14 := by
  unfold obseg ploscina; norm_num

/-- Bolj natančno: 1 m = 100 cm, zato 1 m² = 100·100 cm² = 10000 cm² (100 vrst po 100 kvadratnih centimetrov).
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#m2-cm2
besedilo: »$1\,\text{m}^2 = 100 \cdot 100\,\text{cm}^2 = 10000\,\text{cm}^2$.« -/
theorem m2_cm2 : ploscina 100 100 = 100 * 100 ∧ (100 : ℝ) * 100 = 10000 ∧
    (Finset.range 100 ×ˢ Finset.range 100).card = 10000 := by
  unfold ploscina; refine ⟨rfl, by norm_num, by simp⟩

/-! ## Preveri se -/

/-- Kviz 1: pladenj 6 × 4: o = 2·(6 + 4) = 20 cm, p = 6·4 = 24 cm²; zamenjava (o = 24, p = 20) in o = 10 nista
pravilni.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#kviz-1
besedilo: »$o = 2 \cdot (6 + 4) = 20\,\text{cm}$, $p = 6 \cdot 4 = 24\,\text{cm}^2$.« -/
theorem kviz1 : obseg 6 4 = 20 ∧ ploscina 6 4 = 24 ∧ obseg 6 4 ≠ 24 ∧ ploscina 6 4 ≠ 20 ∧ obseg 6 4 ≠ 10 := by
  unfold obseg ploscina; norm_num

/-- Kviz 2: 40·20 = 800, natančno 38·21 = 798 cm²; obseg 2·(38 + 21) = 118 cm, vsota stranic 38 + 21 = 59; od
ponujenih 60, 120, 800, 8000 je 798 najbližje 800.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#kviz-2
besedilo: »Zaokrožimo: $40 \cdot 20 = 800$. Natančno: $38 \cdot 21 = 798\,\text{cm}^2$.« -/
theorem kviz2 : (40 : ℝ) * 20 = 800 ∧ ploscina 38 21 = 798 ∧ obseg 38 21 = 118 ∧ (38 : ℝ) + 21 = 59 ∧
    |(798 : ℝ) - 800| < |(798 : ℝ) - 60| ∧ |(798 : ℝ) - 800| < |(798 : ℝ) - 120| ∧
    |(798 : ℝ) - 800| < |(798 : ℝ) - 8000| := by
  unfold ploscina obseg
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_, ?_⟩ <;> norm_num [abs_eq_max_neg]

/-- Kviz 3: ploščini 20·20 = 400 cm² in 30·10 = 300 cm² (enak obseg 80 cm), kvadratni pekač sprejme več.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#kviz-3
besedilo: »Preštej kvadratke: $20 \cdot 20 = 400$, $30 \cdot 10 = 300$.« -/
theorem kviz3 : ploscina 20 20 = 400 ∧ ploscina 30 10 = 300 ∧ ploscina 30 10 < ploscina 20 20 ∧
    obseg 20 20 = obseg 30 10 := by
  unfold ploscina obseg; norm_num

/-- Kviz 5: ob stranici 24 : 6 = 4 koščki, 4 vrste, 4·4 = 16 (ne 4, 8 ali 24); s ploščinami 576 : 36 = 16.
trditev: MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata#kviz-5
besedilo: »Ob stranici gredo $24 : 6 = 4$ koščki, vrst je $4$, skupaj $4 \cdot 4 = 16$. S ploščinami: $576 : 36 = 16$.« -/
theorem kviz5 : (24 : ℝ) / 6 = 4 ∧ (4 : ℝ) * 4 = 16 ∧ ploscina 24 24 = 576 ∧ ploscina 6 6 = 36 ∧
    (576 : ℝ) / 36 = 16 ∧ (4 : ℝ) + 4 = 8 ∧ (Finset.range 4 ×ˢ Finset.range 4).card = 16 := by
  unfold ploscina; refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by decide⟩

end Evklid.Lekcije.MAT_OS_6.ObsegInPloscinaPravokotnikaInKvadrata
