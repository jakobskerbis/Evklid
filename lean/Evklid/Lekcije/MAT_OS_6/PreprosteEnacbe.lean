/-
vir: content/lessons/MAT-OS-6/preproste-enacbe.md
sha256: 986ff76e5fa192b0249adce4732ad36cb57a7d7fe67dc2dec545a316909b8649
Model: neznanka x je realno število (ℝ), »:« je deljenje `/`; rešitev enačbe je zapisana kot `↔` (enačba velja
natanko za to število, torej je rešitev ena sama). Decimalna števila so točni ulomki (10,8 = 108/10).
Lean: x / 0 = 0, zato imajo pravila za množenje in deljenje pogoj a ≠ 0.
Povzetek: enačbi x − a = b in x : a = b sta dokazani brez pogojev (deljenje z a ≠ 0); »večja od b« je dokazano
s pogojema iz lekcije: a > 0 pri odštevanju ter a > 1 in b > 0 pri deljenju.
Ni v Leanu: zgodba o uganki in tehtnica (slika; dokazano je, da odvzem istega števila z obeh strani ohrani
enakost); misel »naredi, kar piše« kot opis zmote (dokazano, da 17 ni rešitev x + 5 = 12); »pametno preizkušanje
ne ugiba na slepo« (opis; dokazano, da leva stran 3 · x + 2 z x raste); napotek za simulacijo (dokazana je rešitev
2 · x + 3 = 11 in ohranitev ravnovesja); »vsaka enačba je taka kratka zgodba« (opis).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.PreprosteEnacbe

/-! ## Zakaj se tega učimo -/

/-- Uvod: x : 4 = 8 ima edino rešitev x = 32 (32 : 4 = 8); 32 je večje od 4 in 8.
trditev: MAT-OS-6/preproste-enacbe#uvod
besedilo: »Odgovor je $32$ taktov, ker je $32 : 4 = 8$.« -/
theorem uvod (x : ℝ) : (x / 4 = 8 ↔ x = 32) ∧ (32 : ℝ) / 4 = 8 ∧ (4 : ℝ) < 32 ∧ (8 : ℝ) < 32 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

/-! ## Razlaga -/

/-- Razlaga: 17 ni rešitev x + 5 = 12, ker je 17 + 5 = 22 ≠ 12.
trditev: MAT-OS-6/preproste-enacbe#ni-17
besedilo: »Namesto $x$ vstavi $17$: $17 + 5 = 22$. To ni $12$.« -/
theorem ni_17 : (17 : ℝ) + 5 = 22 ∧ (17 : ℝ) + 5 ≠ 12 := by norm_num

/-- Razlaga (sklepanje): x + 5 = 12 natanko tedaj, ko x = 12 − 5 = 7.
trditev: MAT-OS-6/preproste-enacbe#sklepanje
besedilo: »Če je nekdo prištel $5$ in dobil $12$, mu $5$ odvzemi: $x = 12 - 5 = 7$.« -/
theorem sklepanje (x : ℝ) : x + 5 = 12 ↔ x = 12 - 5 ∧ (12 : ℝ) - 5 = 7 := by
  constructor
  · intro h; exact ⟨by linarith, by norm_num⟩
  · rintro ⟨h, -⟩; rw [h]; norm_num

/-- Razlaga (tehtnica): če z obeh strani enakosti odvzamemo isto število, ravnovesje ostane (in obratno).
trditev: MAT-OS-6/preproste-enacbe#tehtnica
besedilo: »Na tehtnici z obeh strani odvzameš $5$ kroglic in ravnovesje ostane.« -/
theorem tehtnica (L D c : ℝ) : L = D ↔ L - c = D - c := (sub_left_inj).symm

/-- Razlaga (tabela obratnih operacij), Povzetek: seštevanje in odštevanje sta obratni:
x + a = b ⇔ x = b − a, x − a = b ⇔ x = b + a.
trditev: MAT-OS-6/preproste-enacbe#obratno-plus-minus
besedilo: »seštevanje in odštevanje sta obratni, prav tako množenje in deljenje.« -/
theorem obratno_plus_minus (x a b : ℝ) : (x + a = b ↔ x = b - a) ∧ (x - a = b ↔ x = b + a) :=
  ⟨eq_sub_iff_add_eq.symm, sub_eq_iff_eq_add⟩

/-- Razlaga (tabela obratnih operacij), Povzetek: množenje in deljenje sta obratni: za a ≠ 0 je
a · x = b ⇔ x = b : a in x : a = b ⇔ x = b · a.
trditev: MAT-OS-6/preproste-enacbe#obratno-krat-deljeno
besedilo: »Plus in minus sta obratna, krat in deljeno tudi.« -/
theorem obratno_krat_deljeno (x a b : ℝ) (ha : a ≠ 0) : (a * x = b ↔ x = b / a) ∧ (x / a = b ↔ x = b * a) := by
  constructor
  · rw [eq_div_iff ha, mul_comm x a]
  · exact div_eq_iff ha

example := obratno_krat_deljeno 6 3 18 (by norm_num)

/-- Razlaga (tabela): x + 5 = 12 ⇔ x = 7, x − 4 = 9 ⇔ x = 13, 3 · x = 18 ⇔ x = 6, x : 4 = 8 ⇔ x = 32.
trditev: MAT-OS-6/preproste-enacbe#tabela
besedilo: »| $+$ | $-$ | $x + 5 = 12$, $x = 12 - 5 = 7$ | | $-$ | $+$ | $x - 4 = 9$, $x = 9 + 4 = 13$ | | $\cdot$ | $:$ | $3 \cdot x = 18$, $x = 18 : 3 = 6$ | | $:$ | $\cdot$ | $x : 4 = 8$, $x = 8 \cdot 4 = 32$ |« -/
theorem tabela (x : ℝ) : (x + 5 = 12 ↔ x = 7) ∧ (x - 4 = 9 ↔ x = 13) ∧ (3 * x = 18 ↔ x = 6) ∧
    (x / 4 = 8 ↔ x = 32) := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩⟩

/-- Razlaga (premisli) in Pogoste napake 2: x − 4 = 9 ⇔ x = 9 + 4 = 13, rešitev je večja od 9; 9 − 4 = 5 ni
rešitev.
trditev: MAT-OS-6/preproste-enacbe#minus-vecja
besedilo: »Od neznanega števila smo vzeli $4$ in ostalo jih je še $9$, torej jih je bilo prej več: $x = 9 + 4 = 13$.« -/
theorem minus_vecja (x : ℝ) : (x - 4 = 9 ↔ x = 9 + 4) ∧ (9 : ℝ) + 4 = 13 ∧ (9 : ℝ) < 13 ∧ (5 : ℝ) - 4 ≠ 9 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga (preizkus): pri x = 7 je leva stran 7 + 5 = 12, enaka desni.
trditev: MAT-OS-6/preproste-enacbe#preizkus
besedilo: »Pri $x = 7$: leva stran $7 + 5 = 12$, desna stran $12$. Enaki sta, rešitev je prava.« -/
theorem preizkus : (7 : ℝ) + 5 = 12 := by norm_num

/-- Razlaga (preizkušanje): 3 · 4 + 2 = 14, 3 · 5 + 2 = 17, 3 · 6 + 2 = 20; edina rešitev 3 · x + 2 = 20 je x = 6.
trditev: MAT-OS-6/preproste-enacbe#preizkusanje
besedilo: »Rešitev je $x = 6$.« -/
theorem preizkusanje (x : ℝ) : (3 : ℝ) * 4 + 2 = 14 ∧ (3 : ℝ) * 5 + 2 = 17 ∧ (3 : ℝ) * 6 + 2 = 20 ∧
    (3 * x + 2 = 20 ↔ x = 6) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun h => by linarith, fun h => by rw [h]; norm_num⟩

/-- Razlaga (premisli): leva stran 3 · x + 2 z večjim x raste; pri 14 < 20 je zato treba večji x.
trditev: MAT-OS-6/preproste-enacbe#raste
besedilo: »Leva stran ($14$) je premajhna, z večjim $x$ pa leva stran raste, ker $3 \cdot x$ postane večje.« -/
theorem raste : StrictMono (fun x : ℝ => 3 * x + 2) ∧ (3 : ℝ) * 4 + 2 < 20 ∧
    ∀ x : ℝ, 3 * x + 2 = 20 → 4 < x := by
  refine ⟨fun a b h => by simp only; linarith, by norm_num, fun x h => by linarith⟩

example := raste.2.2 6 (by norm_num)

/-- Razlaga (simulacija): 2 · x + 3 = 11 ⇔ x = 4; odvzem 1 z obeh strani ohrani ravnovesje.
trditev: MAT-OS-6/preproste-enacbe#simulacija
besedilo: »Nato z obeh strani odvzemi po $1$ in opazuj, da tehtnica ostane v ravnovesju.« -/
theorem simulacija (x : ℝ) : (2 * x + 3 = 11 ↔ x = 4) ∧ (2 * x + 3 = 11 ↔ 2 * x + 3 - 1 = 11 - 1) := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, (sub_left_inj).symm⟩

/-! ## Rešeni primeri -/

/-- Primer 1: x + 5 = 17 ⇔ x = 17 − 5 = 12; preizkus 12 + 5 = 17.
trditev: MAT-OS-6/preproste-enacbe#primer1
besedilo: »Odgovor: Maja je imela na začetku $12$ skladb.« -/
theorem primer1 (x : ℝ) : (x + 5 = 17 ↔ x = 12) ∧ (12 : ℝ) + 5 = 17 := by
  refine ⟨⟨fun h => ?_, fun h => by rw [h]; norm_num⟩, by norm_num⟩
  calc x = 17 - 5 := by linarith
    _ = 12 := by norm_num

/-- Primer 2: 4 · x = 96 ⇔ x = 96 : 4 = 24; preizkus 4 · 24 = 96.
trditev: MAT-OS-6/preproste-enacbe#primer2
besedilo: »Odgovor: skladba ima $24$ taktov.« -/
theorem primer2 (x : ℝ) : (4 * x = 96 ↔ x = 24) ∧ (4 : ℝ) * 24 = 96 := by
  refine ⟨⟨fun h => ?_, fun h => by rw [h]; norm_num⟩, by norm_num⟩
  calc x = 96 / 4 := by linarith
    _ = 24 := by norm_num

/-- Primer 3: poskusi 2 · 10 + 3 = 23, 2 · 11 + 3 = 25, 2 · 12 + 3 = 27; sklepanje nazaj 27 − 3 = 24, 24 : 2 = 12;
2 · x + 3 = 27 ⇔ x = 12.
trditev: MAT-OS-6/preproste-enacbe#primer3
besedilo: »Odgovor: ena vstopnica stane $12\,\text{€}$.« -/
theorem primer3 (x : ℝ) : (2 : ℝ) * 10 + 3 = 23 ∧ (2 : ℝ) * 11 + 3 = 25 ∧ (2 : ℝ) * 12 + 3 = 27 ∧
    (2 * x + 3 = 27 ↔ x = 12) := by
  refine ⟨by norm_num, by norm_num, by norm_num, ⟨fun h => ?_, fun h => by rw [h]; norm_num⟩⟩
  have h1 : 2 * x = 27 - 3 := by linarith
  calc x = (27 - 3) / 2 := by linarith
    _ = 24 / 2 := by norm_num
    _ = 12 := by norm_num

/-- Primer 4: 6 strun po 2 € stane 12 € > 10,80 €, zato je x < 2; 6 · x = 10,8 ⇔ x = 10,8 : 6 = 1,8; preizkus
6 · 1,8 = 10,8.
trditev: MAT-OS-6/preproste-enacbe#primer4
besedilo: »Natančno: $x = 10{,}8 : 6 = 1{,}8$, ena struna stane $1{,}80\,\text{€}$. Preizkus: $6 \cdot 1{,}8 = 10{,}8$.« -/
theorem primer4 (x : ℝ) : (6 : ℝ) * 2 = 12 ∧ (108 / 10 : ℝ) < 12 ∧ (6 * x = 108 / 10 → x < 2) ∧
    (6 * x = 108 / 10 ↔ x = 108 / 10 / 6) ∧ (108 / 10 / 6 : ℝ) = 18 / 10 ∧ (6 : ℝ) * (18 / 10) = 108 / 10 := by
  refine ⟨by norm_num, by norm_num, fun h => by linarith, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    by norm_num, by norm_num⟩

example := (primer4 (18 / 10)).2.2.1 (by norm_num)

/-! ## Pogoste napake -/

/-- Pogoste napake 1: pri x + 5 = 12 je 17 napačno, pravilno x = 12 − 5 = 7.
trditev: MAT-OS-6/preproste-enacbe#napaka1
besedilo: »Pojdi nazaj z obratno operacijo: $12 - 5 = 7$.« -/
theorem napaka1 (x : ℝ) : (x + 5 = 12 ↔ x = 12 - 5) ∧ (12 : ℝ) - 5 = 7 ∧ (17 : ℝ) + 5 ≠ 12 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; ring⟩, by norm_num, by norm_num⟩

/-- Pogoste napake 3: pri x : 4 = 8 je 8 : 4 = 2 napačno (2 : 4 ≠ 8), pravilno x = 8 · 4 = 32.
trditev: MAT-OS-6/preproste-enacbe#napaka3
besedilo: »Preizkus $2 : 4$ ni $8$. Pravilno: $x = 8 \cdot 4 = 32$.« -/
theorem napaka3 (x : ℝ) : (8 : ℝ) / 4 = 2 ∧ (2 : ℝ) / 4 ≠ 8 ∧ (x / 4 = 8 ↔ x = 8 * 4) ∧ (8 : ℝ) * 4 = 32 := by
  refine ⟨by norm_num, by norm_num, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Pogoste napake 4 in Preveri se 5: 5 · x + 8 = 43 ⇔ 5 · x = 43 − 8 = 35 ⇔ x = 35 : 5 = 7; 35 ni rešitev.
trditev: MAT-OS-6/preproste-enacbe#napaka4
besedilo: »Treba je še deliti s $5$: $x = 7$.« -/
theorem napaka4 (x : ℝ) : (5 * x + 8 = 43 ↔ 5 * x = 43 - 8) ∧ (43 : ℝ) - 8 = 35 ∧ (5 * x + 8 = 43 ↔ x = 7) ∧
    (5 : ℝ) * 35 + 8 ≠ 43 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Pogoste napake 5 in Preveri se 1: rešitev x + 5 = 17 ni 17 (17 + 5 ≠ 17) ne 22 (22 + 5 = 27), ampak 12.
trditev: MAT-OS-6/preproste-enacbe#napaka5
besedilo: »Rešitev je število, pri katerem obe strani dasta isto: $12 + 5 = 17$.« -/
theorem napaka5 (x : ℝ) : (x + 5 = 17 ↔ x = 12) ∧ (17 : ℝ) + 5 ≠ 17 ∧ (22 : ℝ) + 5 = 27 ∧ (22 : ℝ) + 5 ≠ 17 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

/-! ## Povzetek -/

/-- Povzetek: pri x − a = b je rešitev b + a večja od b, če je a > 0.
trditev: MAT-OS-6/preproste-enacbe#povzetek-minus
besedilo: »Pri $x - a = b$ je $x = b + a$, pri $x : a = b$ je $x = b \cdot a$.« -/
theorem povzetek_minus (x a b : ℝ) (ha : 0 < a) (h : x - a = b) : x = b + a ∧ b < x := by
  constructor <;> linarith

example := povzetek_minus 13 4 9 (by norm_num) (by norm_num)

/-- Povzetek: pri x : a = b z a > 1 in b > 0 je rešitev b · a večja od b.
trditev: MAT-OS-6/preproste-enacbe#povzetek-deljeno
besedilo: »pri deljenju, če je $a$ večji od $1$ in $b$ večji od $0$« -/
theorem povzetek_deljeno (x a b : ℝ) (ha : 1 < a) (hb : 0 < b) (h : x / a = b) : x = b * a ∧ b < x := by
  have hx : x = b * a := (div_eq_iff (by linarith)).mp h
  refine ⟨hx, ?_⟩
  rw [hx]
  nlinarith

example := povzetek_deljeno 32 4 8 (by norm_num) (by norm_num) (by norm_num)

/-- Povzetek: pri dveh operacijah (2 · x + 3 = 27) gremo nazaj v obratnem vrstnem redu: najprej −3, nato :2.
trditev: MAT-OS-6/preproste-enacbe#obratni-vrstni-red
besedilo: »Pri dveh operacijah ($2 \cdot x + 3 = 27$) gremo nazaj v obratnem vrstnem redu: najprej $-3$, nato $:2$.« -/
theorem obratni_vrstni_red (x : ℝ) : 2 * x + 3 = 27 ↔ x = (27 - 3) / 2 := by
  constructor <;> intro h <;> linarith

/-! ## Drugače -/

/-- Drugače (zgodba): (x − 5) : 3 = 4 ⇔ x = 4 · 3 + 5 = 17; preveri 17 − 5 = 12, 12 : 3 = 4.
trditev: MAT-OS-6/preproste-enacbe#zgodba
besedilo: »Tim si je zamislil $17$. Preveri naprej: $17 - 5 = 12$, $12 : 3 = 4$.« -/
theorem zgodba (x : ℝ) : ((x - 5) / 3 = 4 ↔ x = 4 * 3 + 5) ∧ (4 : ℝ) * 3 = 12 ∧ (12 : ℝ) + 5 = 17 ∧
    (17 : ℝ) - 5 = 12 ∧ (12 : ℝ) / 3 = 4 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Drugače (recept za sklepanje): x − 6 = 10 ⇔ x = 10 + 6 = 16; preizkus 16 − 6 = 10.
trditev: MAT-OS-6/preproste-enacbe#recept-sklepanje
besedilo: »| 3 | uporabi jo na desni strani | $10 + 6 = 16$ |« -/
theorem recept_sklepanje (x : ℝ) : (x - 6 = 10 ↔ x = 10 + 6) ∧ (10 : ℝ) + 6 = 16 ∧ (16 : ℝ) - 6 = 10 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num⟩

/-- Drugače (recept za preizkušanje): 3 · 5 = 15, 3 · 6 = 18, 3 · 7 = 21, 3 · 8 = 24 > 21; 3 · x = 21 ⇔ x = 7.
trditev: MAT-OS-6/preproste-enacbe#recept-preizkusanje
besedilo: »Števila $8$ ni treba preizkusiti: dalo bi $24$, kar je že preveč.« -/
theorem recept_preizkusanje (x : ℝ) : (3 : ℝ) * 5 = 15 ∧ (3 : ℝ) * 6 = 18 ∧ (3 : ℝ) * 7 = 21 ∧ (3 : ℝ) * 8 = 24 ∧
    (21 : ℝ) < 24 ∧ (3 * x = 21 ↔ x = 7) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩⟩

/-! ## Preveri se -/

/-- Preveri se 2: rešitve so D: 5 · x = 10 ⇔ x = 2, A: x + 6 = 10 ⇔ x = 4, B: x − 6 = 10 ⇔ x = 16,
C: x : 2 = 10 ⇔ x = 20; urejeno 2 < 4 < 16 < 20 (D, A, B, C).
trditev: MAT-OS-6/preproste-enacbe#preveri2
besedilo: »Rešitve: D $x = 10 : 5 = 2$, A $x = 10 - 6 = 4$, B $x = 10 + 6 = 16$, C $x = 10 \cdot 2 = 20$.« -/
theorem preveri2 (x : ℝ) : (5 * x = 10 ↔ x = 10 / 5) ∧ (10 / 5 : ℝ) = 2 ∧ (x + 6 = 10 ↔ x = 10 - 6) ∧
    (10 - 6 : ℝ) = 4 ∧ (x - 6 = 10 ↔ x = 10 + 6) ∧ (10 + 6 : ℝ) = 16 ∧ (x / 2 = 10 ↔ x = 10 * 2) ∧
    (10 * 2 : ℝ) = 20 ∧ (2 : ℝ) < 4 ∧ (4 : ℝ) < 16 ∧ (16 : ℝ) < 20 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 3: x + 3 = 10 ⇔ x = 7, x + 3 = 12 ⇔ x = 9; splošno se rešitev x + a = b poveča za toliko kot
desna stran.
trditev: MAT-OS-6/preproste-enacbe#preveri3
besedilo: »Prej $x = 10 - 3 = 7$, zdaj $x = 12 - 3 = 9$. Rešitev se poveča za toliko kot desna stran.« -/
theorem preveri3 (x : ℝ) : (x + 3 = 10 ↔ x = 7) ∧ (x + 3 = 12 ↔ x = 9) ∧
    ∀ a b d y : ℝ, (y + a = b + d ↔ y = (b - a) + d) := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    fun a b d y => ⟨fun h => by linarith, fun h => by rw [h]; ring⟩⟩

/-- Preveri se 4: x : 3 = 7 ⇔ x = 7 · 3 = 21; preizkus 21 : 3 = 7; 7 : 3 ≈ 2,3 ni rešitev ((7 : 3) : 3 ≠ 7).
trditev: MAT-OS-6/preproste-enacbe#preveri4
besedilo: »$x = 7 \cdot 3 = 21$. Preizkus: $21 : 3 = 7$.« -/
theorem preveri4 (x : ℝ) : (x / 3 = 7 ↔ x = 7 * 3) ∧ (7 : ℝ) * 3 = 21 ∧ (21 : ℝ) / 3 = 7 ∧ (7 / 3 : ℝ) / 3 ≠ 7 ∧
    (7 : ℝ) - 3 ≠ 21 ∧ (7 : ℝ) + 3 ≠ 21 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Preveri se 5: 5 · x = 43 − 8 = 35, x = 35 : 5 = 7, preizkus 5 · 7 + 8 = 43; napačni 35, 10,20 = (43 + 8) : 5
in 8,60 = 43 : 5 niso rešitve.
trditev: MAT-OS-6/preproste-enacbe#preveri5
besedilo: »$5 \cdot x = 43 - 8 = 35$, $x = 35 : 5 = 7$. Preizkus: $5 \cdot 7 + 8 = 43$.« -/
theorem preveri5 (x : ℝ) : (5 * x + 8 = 43 ↔ x = (43 - 8) / 5) ∧ (43 : ℝ) - 8 = 35 ∧ (35 : ℝ) / 5 = 7 ∧
    (5 : ℝ) * 7 + 8 = 43 ∧ (43 + 8 : ℝ) / 5 = 102 / 10 ∧ (43 : ℝ) / 5 = 86 / 10 ∧
    (5 : ℝ) * 35 + 8 ≠ 43 ∧ (5 : ℝ) * (102 / 10) + 8 ≠ 43 ∧ (5 : ℝ) * (86 / 10) + 8 ≠ 43 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_OS_6.PreprosteEnacbe
