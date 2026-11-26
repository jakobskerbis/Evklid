/-
vir: content/lessons/MAT-OS-7/odstotni-racun.md
sha256: 46efe7c026996722470a8987ae2011713dce08aec2b64261f911f33d1f115a9b
Model: vse količine so realna števila (osnova o, delež d, odstotek p, p % = p/100); decimalna števila so zapisana
kot ulomki (0,84 = 84/100). Enote (€, meti, točke) so izpuščene. »Uspešnejši« je večji odstotek.
Lean: x/0 = 0; zato imajo obrazci pogoje o ≠ 0 (in p ≠ 0 za o = d·100/p), kot jih zahteva deljenje.
Ni v Leanu: zgodbe (košarka, rokomet, igra, kopačke, članarina, Zala) kot besedilo, njihovi računi so dokazani;
pomen besed osnova, delež, odstotek in navodila (»najprej določi osnovo«, »preberi, kaj naloga sprašuje«, »vedno
zgoraj zapiši, kaj je 100 %«) so opis; slika dvojne premice in mreža ter simulacija »Odstotki na mreži in dvojni
premici« (dokazana sta premo sorazmerje d = o·p/100 in vrednosti 2, 12, 20 ter 150); »število zadetkov samo ne pove,
kako uspešen je bil strelec« (opis; dokazano na primerih Luka/Maja, Tim/Nik, Jan/Tilen in kvizu 2).
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.OdstotniRacun

/-! ## Razlaga: odstotek pomeni »od sto« -/

/-- Zakaj se tega učimo in Razlaga: 9/15 = 60/100, 12/20 = 60/100, 150/250 = 60/100: Luka, Maja in junak imajo
vsi 60 %; Maja ima več zadetkov (12 > 9), a enak odstotek.
trditev: MAT-OS-7/odstotni-racun#luka-maja-junak
besedilo: »Pri Luku, pri Maji in pri junaku je to natanko $60$ od vsakih $100$, torej $60\,\%$.« -/
theorem luka_maja_junak :
    (9 : ℝ) / 15 = 60 / 100 ∧ (12 : ℝ) / 20 = 60 / 100 ∧ (150 : ℝ) / 250 = 60 / 100 ∧ (9 : ℝ) < 12 := by
  norm_num

/-- Razlaga in Povzetek: 1 % = 1/100 = 0,01.
trditev: MAT-OS-7/odstotni-racun#en-odstotek
besedilo: »1\,\% = \frac{1}{100} = 0{,}01« -/
theorem en_odstotek : (1 : ℝ) / 100 = 0.01 := by norm_num

/-- Razlaga (premisli): 7/10 = 70/100 = 70 % je več kot 60 %, čeprav 7 < 9 < 12 zadetkov.
trditev: MAT-OS-7/odstotni-racun#tretji-igralec
besedilo: »$\dfrac{7}{10} = \dfrac{70}{100} = 70\,\%$, kar je več kot $60\,\%$, čeprav je zadel najmanj metov.« -/
theorem tretji_igralec : (7 : ℝ) / 10 = 70 / 100 ∧ (60 : ℝ) / 100 < 70 / 100 ∧ (7 : ℝ) < 9 := by norm_num

/-- Razlaga (tri količine): pri Maji je osnova 20, delež 12 in odstotek 60 %: 12 = 20·60/100.
trditev: MAT-OS-7/odstotni-racun#maja-kolicine
besedilo: »Pri Maji je osnova $20$ metov, delež $12$ zadetih metov, odstotek $60\,\%$.« -/
theorem maja_kolicine : (12 : ℝ) = 20 * (60 / 100) := by norm_num

/-! ## Obrazci -/

/-- Razlaga in Povzetek: iz d/o = p/100 sledijo d = o·p/100, p = d/o·100 in o = d·100/p (o ≠ 0, p ≠ 0); vse so
med seboj enakovredne.
trditev: MAT-OS-7/odstotni-racun#obrazci
besedilo: »$d = o \cdot \dfrac{p}{100}$, $p = \dfrac{d}{o} \cdot 100$, $o = \dfrac{d \cdot 100}{p}$; vse tri iz $\dfrac{d}{o} = \dfrac{p}{100}$.« -/
theorem obrazci (o d p : ℝ) (ho : o ≠ 0) (hp : p ≠ 0) :
    (d / o = p / 100 ↔ d = o * (p / 100)) ∧ (d / o = p / 100 ↔ p = d / o * 100) ∧
      (d / o = p / 100 ↔ o = d * 100 / p) := by
  refine ⟨⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩⟩
  · field_simp at h; linarith
  · rw [h]; field_simp
  · rw [h]; ring
  · rw [h]; ring
  · have hd : d = o * p / 100 := by field_simp at h; linarith
    rw [hd]; field_simp
  · rw [h]
    have hd : d ≠ 0 := by
      intro hd; rw [hd] at h; simp at h; exact ho h
    field_simp

example := obrazci 20 12 60 (by norm_num) (by norm_num)

/-- Razlaga (dvojna premica): lestvici sta premo sorazmerni; pri Maji (o = 20) je 10 % → 2, 60 % → 12, 100 % → 20;
odstotek k-krat večji da k-krat večji delež.
trditev: MAT-OS-7/odstotni-racun#dvojna-premica
besedilo: »Obe lestvici se raztezata premo sorazmerno« -/
theorem dvojna_premica (o p k : ℝ) :
    o * ((k * p) / 100) = k * (o * (p / 100)) ∧ (20 : ℝ) * (10 / 100) = 2 ∧ (20 : ℝ) * (60 / 100) = 12 ∧
      (20 : ℝ) * (100 / 100) = 20 := by
  refine ⟨by ring, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga in Povzetek (sklepni račun): p % od o je p-krat 1 % od o: o·p/100 = (o/100)·p.
trditev: MAT-OS-7/odstotni-racun#sklepni-racun
besedilo: »Sklepni račun: najprej $1\,\%$, nato želeni odstotek.« -/
theorem sklepni_racun (o p : ℝ) : o * (p / 100) = (o / 100) * p := by ring

/-- Razlaga (simulacija): 60 % od 250 je 150.
trditev: MAT-OS-7/odstotni-racun#simulacija
besedilo: »na premici pa preberi delež: $150$, prav toliko točk ima Majin junak.« -/
theorem simulacija : (250 : ℝ) * (60 / 100) = 150 := by norm_num

/-! ## Popust in podražitev -/

/-- Razlaga in Povzetek: po popustu p % plačamo (100 − p) % prvotne cene, po podražitvi p % je nova cena
(100 + p) % prvotne.
trditev: MAT-OS-7/odstotni-racun#popust-podrazitev
besedilo: »Popust $p\,\%$: plačamo $(100 - p)\,\%$ prvotne cene. Podražitev $p\,\%$: nova cena je $(100 + p)\,\%$.« -/
theorem popust_podrazitev (o p : ℝ) :
    o - o * (p / 100) = o * ((100 - p) / 100) ∧ o + o * (p / 100) = o * ((100 + p) / 100) := by
  constructor <;> ring

/-- Razlaga: pri popustu 20 % plačamo 80 % = 0,8 prvotne cene, pri podražitvi 20 % 120 % = 1,2.
trditev: MAT-OS-7/odstotni-racun#dvajset-odstotkov
besedilo: »Pri popustu $20\,\%$ je to $80\,\%$, torej $0{,}8$ prvotne cene.« -/
theorem dvajset_odstotkov :
    (100 : ℝ) - 20 = 80 ∧ (80 : ℝ) / 100 = 0.8 ∧ (100 : ℝ) + 20 = 120 ∧ (120 : ℝ) / 100 = 1.2 := by
  norm_num

/-- Razlaga (premisli) in Pogoste napake 4: 100 € → 110 €, popust 10 % od 110 € je 11 €, nova cena 99 €;
podražitev je 10 % od 100 € = 10 €, popust 11 € je večji.
trditev: MAT-OS-7/odstotni-racun#kopacke-gor-dol
besedilo: »Pri $100\,\text{€}$: podražitev na $110\,\text{€}$, nato popust $10\,\%$ od $110\,\text{€}$, kar je $11\,\text{€}$, torej $99\,\text{€}$.« -/
theorem kopacke_gor_dol :
    (100 : ℝ) * (110 / 100) = 110 ∧ (110 : ℝ) * (10 / 100) = 11 ∧ (110 : ℝ) - 11 = 99 ∧ (99 : ℝ) < 100 ∧
      (100 : ℝ) * (10 / 100) = 10 ∧ (10 : ℝ) < 11 := by
  norm_num

/-- Razlaga (premisli), Pogoste napake 4 in kviz 3 (splošno): po podražitvi za p % in popustu za p % je cena
o·(1 − (p/100)²), torej nižja od prvotne o (o > 0, p ≠ 0).
trditev: MAT-OS-7/odstotni-racun#gor-dol-manj
besedilo: »Drugi odstotek računamo od večje osnove, zato je odvzetih evrov več, kot jih je bilo dodanih.« -/
theorem gor_dol_manj (o p : ℝ) (ho : 0 < o) (hp : p ≠ 0) :
    o * (1 + p / 100) * (1 - p / 100) = o * (1 - (p / 100) ^ 2) ∧ o * (1 + p / 100) * (1 - p / 100) < o := by
  refine ⟨by ring, ?_⟩
  have h : 0 < (p / 100) ^ 2 := by positivity
  nlinarith

example := gor_dol_manj 100 10 (by norm_num) (by norm_num)

/-! ## Rešeni primeri -/

/-- Primer 1: 40/100 = 0,4, d = 30·0,4 = 12 zmag.
trditev: MAT-OS-7/odstotni-racun#primer-1
besedilo: »$d = 30 \cdot 0{,}4 = 12$.« -/
theorem primer1 : (40 : ℝ) / 100 = 0.4 ∧ (30 : ℝ) * (40 / 100) = 12 := by
  refine ⟨by norm_num, ?_⟩
  calc (30 : ℝ) * (40 / 100) = 30 * 0.4 := by norm_num
    _ = 12 := by norm_num

/-- Primer 2 in Pogoste napake 1: Tim 18/24 = 0,75 = 75 %, Nik 21/30 = 0,7 = 70 %; Nik ima več zadetkov
(21 > 18), uspešnejši je Tim (75 > 70).
trditev: MAT-OS-7/odstotni-racun#primer-2
besedilo: »Odgovor: uspešnejši je Tim ($75\,\%$ proti $70\,\%$).« -/
theorem primer2 :
    (18 : ℝ) / 24 = 0.75 ∧ (18 : ℝ) / 24 * 100 = 75 ∧ (21 : ℝ) / 30 = 0.7 ∧ (21 : ℝ) / 30 * 100 = 70 ∧
      (70 : ℝ) < 75 ∧ (18 : ℝ) < 21 := by
  norm_num

/-- Primer 3: po popustu 25 % plačamo 100 − 25 = 75 %; cena po popustu je 63 € natanko tedaj, ko je prvotna cena
84 €.
trditev: MAT-OS-7/odstotni-racun#primer-3
besedilo: »Odgovor: kopačke so stale $84\,\text{€}$.« -/
theorem primer3 (o : ℝ) : o * ((100 - 25) / 100) = 63 ↔ o = 84 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Primer 3 (koraki): 100 − 25 = 75; 1 % je 63 : 75 = 0,84 €; 100 % je 0,84·100 = 84 €; preizkus 25 % od 84 € je
21 €, 84 − 21 = 63.
trditev: MAT-OS-7/odstotni-racun#primer-3-koraki
besedilo: »Preizkus: $25\,\%$ od $84\,\text{€}$ je $21\,\text{€}$, in $84 - 21 = 63$.« -/
theorem primer3_koraki :
    (100 : ℝ) - 25 = 75 ∧ (63 : ℝ) / 75 = 0.84 ∧ (0.84 : ℝ) * 100 = 84 ∧ (84 : ℝ) * (25 / 100) = 21 ∧
      (84 : ℝ) - 21 = 63 := by
  norm_num

/-- Primer 4: nova članarina je 100 + 15 = 115 % = 1,15 stare: 240·1,15 = 276 €; drugače 240·0,15 = 36 €,
240 + 36 = 276 €.
trditev: MAT-OS-7/odstotni-racun#primer-4
besedilo: »$240 \cdot 1{,}15 = 276\,\text{€}$. Drugače: podražitev je $240 \cdot 0{,}15 = 36\,\text{€}$, nova cena $240 + 36 = 276\,\text{€}$.« -/
theorem primer4 :
    (100 : ℝ) + 15 = 115 ∧ (115 : ℝ) / 100 = 1.15 ∧ (240 : ℝ) * 1.15 = 276 ∧ (240 : ℝ) * 0.15 = 36 ∧
      (240 : ℝ) + 36 = 276 := by
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 2: 20 % od 30 € je 6 €, plačamo 24 €; 30 − 20 = 10 € je napačno.
trditev: MAT-OS-7/odstotni-racun#napaka-evri
besedilo: »$20\,\%$ od $30\,\text{€}$ je $6\,\text{€}$, plačamo $24\,\text{€}$.« -/
theorem napaka_evri : (30 : ℝ) * (20 / 100) = 6 ∧ (30 : ℝ) - 6 = 24 ∧ (30 : ℝ) - 20 = 10 ∧ (10 : ℝ) ≠ 24 := by
  norm_num

/-- Pogoste napake 3: 63 + 25 % od 63 = 78,75 €, kar ni prvotna cena 84 € (cena po popustu je 75 % prvotne).
trditev: MAT-OS-7/odstotni-racun#napaka-osnova
besedilo: »Toda $25\,\%$ je del prvotne cene, ne nove. Popravek: nova cena je $75\,\%$ prvotne;« -/
theorem napaka_osnova :
    (63 : ℝ) + 63 * (25 / 100) = 78.75 ∧ (78.75 : ℝ) ≠ 84 ∧ (84 : ℝ) * (75 / 100) = 63 := by
  norm_num

/-- Pogoste napake 5: če igra vzame 30 % točk, ostane 70 %.
trditev: MAT-OS-7/odstotni-racun#napaka-ostanek
besedilo: »Če igra vzame $30\,\%$ točk, je $30\,\%$ izguba; ostane $70\,\%$.« -/
theorem napaka_ostanek (o : ℝ) : o - o * (30 / 100) = o * (70 / 100) := by ring

/-! ## Drugače -/

/-- Kot zgodba: Jan 8/10 = 80/100, Tilen 12/16 = 3/4 = 75/100; Tilen je zadel več (12 > 8), Jan je uspešnejši
(80 > 75).
trditev: MAT-OS-7/odstotni-racun#jan-tilen
besedilo: »Jan zadene $8$ od $10$, torej $80$ od $100$. Tilen zadene $12$ od $16$; to je $3$ od $4$, torej $75$ od $100$.« -/
theorem jan_tilen :
    (8 : ℝ) / 10 = 80 / 100 ∧ (12 : ℝ) / 16 = 3 / 4 ∧ (3 : ℝ) / 4 = 75 / 100 ∧ (75 : ℝ) < 80 ∧ (8 : ℝ) < 12 := by
  norm_num

/-- Kot zgodba: dres 50 €, popust 20 %: 20 % od 50 € je 10 €, plačala je 40 €.
trditev: MAT-OS-7/odstotni-racun#dres
besedilo: »je izračunala $20\,\%$ od $50\,\text{€}$, kar je $10\,\text{€}$, in plačala $40\,\text{€}$.« -/
theorem dres : (50 : ℝ) * (20 / 100) = 10 ∧ (50 : ℝ) - 10 = 40 := by norm_num

/-- Korak za korakom (delež): 1 % od 240 € je 240 : 100 = 2,4 €, 15 % je 15·2,4 = 36 €.
trditev: MAT-OS-7/odstotni-racun#korak-delez
besedilo: »| $15\,\%$ | $15 \cdot 2{,}4 = 36\,\text{€}$ |« -/
theorem korak_delez : (240 : ℝ) / 100 = 2.4 ∧ (15 : ℝ) * 2.4 = 36 ∧ (240 : ℝ) * (15 / 100) = 36 := by norm_num

/-- Korak za korakom (osnova): 75 % je 63 €, 1 % je 63 : 75 = 0,84 €, 100 % je 0,84·100 = 84 €.
trditev: MAT-OS-7/odstotni-racun#korak-osnova
besedilo: »| $100\,\%$ | $0{,}84 \cdot 100 = 84\,\text{€}$ |« -/
theorem korak_osnova : (63 : ℝ) / 75 = 0.84 ∧ (0.84 : ℝ) * 100 = 84 := by norm_num

/-- Korak za korakom (odstotek): 18/24·100 = 75, torej 75 %.
trditev: MAT-OS-7/odstotni-racun#korak-odstotek
besedilo: »$\dfrac{18}{24} \cdot 100 = 75$, torej $75\,\%$.« -/
theorem korak_odstotek : (18 : ℝ) / 24 * 100 = 75 := by norm_num

/-! ## Preveri se -/

/-- Kviz 1: 6 od 8 strelov je 75 %: delež 6 = osnova 8 · 75/100 (osnova je 8, ne 6, 75 ali 100).
trditev: MAT-OS-7/odstotni-racun#kviz-1
besedilo: »Osnova je celota, torej vseh $8$ strelov. Delež je $6$ zadetih, odstotek $75\,\%$.« -/
theorem kviz1 : (6 : ℝ) / 8 * 100 = 75 ∧ (6 : ℝ) = 8 * (75 / 100) ∧ (6 : ℝ) ≠ 6 * (75 / 100) ∧
    (6 : ℝ) ≠ 100 * (75 / 100) ∧ (6 : ℝ) ≠ 75 * (75 / 100) := by
  norm_num

/-- Kviz 2: A 16/20 = 80 %, B 9/12 = 75 %, C 14/25 = 56 %, razvrstitev A, B, C; po zadetkih bi bilo A, C, B
(16 > 14 > 9), po zgrešenih B, A, C (3 < 4 < 11).
trditev: MAT-OS-7/odstotni-racun#kviz-2
besedilo: »A: $80\,\%$, B: $75\,\%$, C: $56\,\%$. Uspešnost primerjamo z odstotki.« -/
theorem kviz2 :
    (16 : ℝ) / 20 * 100 = 80 ∧ (9 : ℝ) / 12 * 100 = 75 ∧ (14 : ℝ) / 25 * 100 = 56 ∧ (75 : ℝ) < 80 ∧ (56 : ℝ) < 75 ∧
      (9 : ℝ) < 14 ∧ (14 : ℝ) < 16 ∧ (12 : ℝ) - 9 < 20 - 16 ∧ (20 : ℝ) - 16 < 25 - 14 := by
  norm_num

/-- Kviz 3: pri 100 €: 100·1,2 = 120 €, nato 120·0,8 = 96 €, cena je nižja za 4 €.
trditev: MAT-OS-7/odstotni-racun#kviz-3
besedilo: »Pri $100\,\text{€}$: $100 \cdot 1{,}2 = 120\,\text{€}$, nato $120 \cdot 0{,}8 = 96\,\text{€}$. Cena je nižja za $4\,\text{€}$.« -/
theorem kviz3 : (100 : ℝ) * 1.2 = 120 ∧ (120 : ℝ) * 0.8 = 96 ∧ (100 : ℝ) - 96 = 4 ∧ (96 : ℝ) < 100 := by norm_num

/-- Kviz 4: izguba 250·0,3 = 75 točk, ostane 250 − 75 = 175 točk, kar je 70 %; 220 = 250 − 30 je napačno.
trditev: MAT-OS-7/odstotni-racun#kviz-4
besedilo: »Izguba: $250 \cdot 0{,}3 = 75$ točk. Ostane $250 - 75 = 175$ točk, kar je $70\,\%$.« -/
theorem kviz4 :
    (250 : ℝ) * 0.3 = 75 ∧ (250 : ℝ) - 75 = 175 ∧ (175 : ℝ) / 250 * 100 = 70 ∧ (250 : ℝ) - 30 = 220 ∧
      (220 : ℝ) ≠ 175 ∧ (75 : ℝ) ≠ 175 := by
  norm_num

/-- Kviz 5: lopar stane po popustu 20 % 48 € natanko tedaj, ko je prvotna cena 60 €.
trditev: MAT-OS-7/odstotni-racun#kviz-5
besedilo: »$48\,\text{€}$ je $80\,\%$ prvotne cene. $1\,\%$ je $48 : 80 = 0{,}6\,\text{€}$; $100\,\%$ je $60\,\text{€}$.« -/
theorem kviz5 (o : ℝ) : o * ((100 - 20) / 100) = 48 ↔ o = 60 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Kviz 5 (koraki in napačni odgovori): 48 € je 80 %, 1 % je 48 : 80 = 0,6 €, 100 % je 60 €, preizkus
60·0,8 = 48; 48 + 20 % od 48 = 57,60, 48 + 20 = 68 in 48 − 20 % od 48 = 38,40 niso 60.
trditev: MAT-OS-7/odstotni-racun#kviz-5-koraki
besedilo: »Preizkus: $60 \cdot 0{,}8 = 48$.« -/
theorem kviz5_koraki :
    (48 : ℝ) / 80 = 0.6 ∧ (0.6 : ℝ) * 100 = 60 ∧ (60 : ℝ) * 0.8 = 48 ∧ (48 : ℝ) + 48 * 0.2 = 57.6 ∧
      (57.6 : ℝ) ≠ 60 ∧ (48 : ℝ) + 20 = 68 ∧ (68 : ℝ) ≠ 60 ∧ (48 : ℝ) - 48 * 0.2 = 38.4 ∧ (38.4 : ℝ) ≠ 60 := by
  norm_num

end Evklid.Lekcije.MAT_OS_7.OdstotniRacun
