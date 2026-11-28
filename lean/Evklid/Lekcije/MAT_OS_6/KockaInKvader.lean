/-
vir: content/lessons/MAT-OS-6/kocka-in-kvader.md
sha256: 3ab7ed66f763f1a85e73e8849245772d149827c419a3071cb86402ac5c1f5b45
Model: dolžine robov a, b, c so realna števila (enota cm, dm ali m je le v docstringih); decimalna števila so točni
ulomki. Prostornina kvadra je Lebesgueova mera `volume` kvadra `Set.Icc 0 ![a, b, c]` v ℝ³ (`Fin 3 → ℝ`), zato je
`V = a · b · c` dokazan iz mere, ne vzet kot definicija; pri štetju enotskih kock je število kock v kvadru
a × b × c (a, b, c naravna) moč množice `Fin a × Fin b × Fin c`. Površina je, kot pravi lekcija, vsota ploščin
šestih ploskev (pravokotnikov a · b, a · c, b · c, vsak dvakrat); dokazano je, da je ta vsota enaka formuli.
Kombinatorika kocke (in kvadra, ki ima isto zgradbo): oglišča so `Fin 3 → Bool` (vsaka koordinata 0 ali največja),
rob je par oglišč, ki se razlikujeta v natanko eni koordinati (vsak rob enkrat, urejen od manjše koordinate k večji),
ploskev je par (koordinata, vrednost) in vsebuje oglišča s to vrednostjo koordinate. Pretvorbe enot: 1 dm = 10 cm, 1 m = 10 dm, zato je kocka z robom 10 manjših enot
10 · 10 · 10 = 1000 manjših kubičnih enot; 1 l = 1 dm³ in 1 ml = 1 cm³ sta definiciji enot (le računi s 1000).
Ni v Leanu: zgodbe (Tilen, Maja, stric) kot opis, dokazani so njihovi računi; risbi mrež in simulacija »Kocka in
kvader: mreža, površina, prostornina« kot sliki; da je mreža kocke iz 6 skladnih kvadratov in mreža kvadra iz 6
pravokotnikov (geometrija razgrnitve; dokazana je le ploščina mreže = površina kot vsota), da obstaja natanko 11
mrež kocke in da šest kvadratov s kvadratom 2 × 2 ni mreža kocke (zahtevno, še ni dokazano; dokazano je le, da se
v vsakem oglišču stikajo natanko 3 robovi in vsako oglišče leži na natanko 3 ploskvah); skladnost nasprotnih
ploskev in »vse ploskve kocke so skladni kvadrati« (geometrijska skladnost, ni dokazana; dokazano je, da imajo pri
kvadru 8 × 5 × 3 ploskve različne ploščine, torej niso vse skladne); površina kot ploščina roba telesa v ℝ³
(Hausdorffova mera, zahtevno, še ni dokazano); postopek reševanja (točka 7) in nasveti v Pogostih napakah kot
navodilo; »enote so kvadratne/kubične« kot dogovor o enotah; »v resnici vzameš malo več papirja« in »več učencev
potrebuje več zraka« (opis); razlage napačnih odgovorov v kvizih, razen kjer so dokazane kot račun.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.KockaInKvader

open MeasureTheory

/-! ## Razlaga 1: deli kocke in kvadra -/

/-- Oglišče kocke: tri koordinate, vsaka 0 (`false`) ali največja (`true`). -/
abbrev Ogl := Bool × Bool × Bool

/-- i-ta koordinata oglišča. -/
def koord (i : Fin 3) (v : Ogl) : Bool := ![v.1, v.2.1, v.2.2] i

/-- V koliko koordinatah se oglišči razlikujeta. -/
def razlik (u v : Ogl) : ℕ := (Finset.univ.filter (fun i : Fin 3 => koord i u ≠ koord i v)).card

/-- Robovi kocke: pari oglišč, ki se razlikujeta v natanko eni koordinati; vsak rob je zapisan enkrat, kot par
(u, v) z u ≤ v v vsaki koordinati. -/
def robovi : Finset (Ogl × Ogl) :=
  Finset.univ.filter (fun e => razlik e.1 e.2 = 1 ∧ ∀ i : Fin 3, koord i e.1 ≤ koord i e.2)

/-- Razlaga 1 (tabela), Povzetek 1: kocka (in kvader z isto zgradbo) ima 8 oglišč, 12 robov in 6 ploskev; v vsakem
oglišču se stikajo trije robovi, vsaka ploskev ima 4 oglišča, vsako oglišče leži na 3 ploskvah, robovi pa se delijo
v tri skupine (po smeri) po 4.
trditev: MAT-OS-6/kocka-in-kvader#deli
besedilo: »Kocka in kvader imata $6$ ploskev, $12$ robov in $8$ oglišč.« -/
theorem deli : Fintype.card Ogl = 8 ∧ robovi.card = 12 ∧ Fintype.card (Fin 3 × Bool) = 6 ∧
    (∀ v : Ogl, (Finset.univ.filter (fun u => razlik u v = 1)).card = 3) ∧
    (∀ i : Fin 3, ∀ b : Bool, (Finset.univ.filter (fun v : Ogl => koord i v = b)).card = 4) ∧
    (∀ v : Ogl, (Finset.univ.filter (fun f : Fin 3 × Bool => koord f.1 v = f.2)).card = 3) ∧
    (∀ i : Fin 3, (robovi.filter (fun e => koord i e.1 ≠ koord i e.2)).card = 4) := by
  decide

/-- Preveri se 1: kocka ima 6 ploskev, 12 robov in 8 oglišč (ne 8 robov in 12 oglišč).
trditev: MAT-OS-6/kocka-in-kvader#kviz1
besedilo: »Kocka in kvader imata $6$ ploskev, $12$ robov in $8$ oglišč.« -/
theorem kviz1 : Fintype.card (Fin 3 × Bool) = 6 ∧ robovi.card = 12 ∧ Fintype.card Ogl = 8 ∧
    robovi.card ≠ 8 ∧ Fintype.card Ogl ≠ 12 :=
  ⟨deli.2.2.1, deli.2.1, deli.1, by rw [deli.2.1]; decide, by rw [deli.1]; decide⟩

/-- Preveri se 1 (napačen odgovor): pri kvadru 8 × 5 × 3 (Primer 2) imajo ploskve ploščine 40, 24 in 15, ki so
različne, zato niso vse ploskve kvadra skladne.
trditev: MAT-OS-6/kocka-in-kvader#kviz1-skladne
besedilo: »Skladni sta le nasprotni ploskvi. Vse so skladne samo pri kocki.« -/
theorem kviz1_skladne : (8 : ℝ) * 5 ≠ 8 * 3 ∧ (8 : ℝ) * 5 ≠ 5 * 3 ∧ (8 : ℝ) * 3 ≠ 5 * 3 := by norm_num

/-! ## Razlaga 3: površina -/

/-- Razlaga 3 (tabela), Povzetek 3: površina kvadra je vsota ploščin šestih ploskev (spodnja in zgornja a · b,
sprednja in zadnja a · c, leva in desna b · c), torej P = 2 · (a · b + a · c + b · c).
trditev: MAT-OS-6/kocka-in-kvader#povrsina-kvadra
besedilo: »Pri kvadru so tri vrste ploskev, vsaka se pojavi dvakrat:« -/
theorem povrsina_kvadra (a b c : ℝ) :
    a * b + a * b + a * c + a * c + b * c + b * c = 2 * (a * b + a * c + b * c) := by ring

/-- Razlaga 3, Povzetek 2: pri kocki je 6 enakih kvadratov s ploščino a · a = a², zato P = 6 · a²; to je formula
kvadra pri a = b = c.
trditev: MAT-OS-6/kocka-in-kvader#povrsina-kocke
besedilo: »Pri kocki je $6$ enakih kvadratov s ploščino $a \cdot a = a^2$:« -/
theorem povrsina_kocke (a : ℝ) :
    a * a = a ^ 2 ∧ a * a + a * a + a * a + a * a + a * a + a * a = 6 * a ^ 2 ∧
      2 * (a * a + a * a + a * a) = 6 * a ^ 2 := by
  refine ⟨by ring, by ring, by ring⟩

/-! ## Razlaga 4: prostornina -/

/-- Razlaga 4, Povzetek 3: kvader z dolžino a, širino b in višino c ima prostornino V = a · b · c (mera kvadra
v ℝ³; zadošča a, b ≥ 0, pri c < 0 sta obe strani 0).
trditev: MAT-OS-6/kocka-in-kvader#prostornina-kvadra
besedilo: »Kvader z dolžino $a$, širino $b$ in višino $c$ ima prostornino $$V = a \cdot b \cdot c$$« -/
theorem prostornina_kvadra (a b c : ℝ) (ha : 0 ≤ a) (hb : 0 ≤ b) :
    volume (Set.Icc (0 : Fin 3 → ℝ) ![a, b, c]) = ENNReal.ofReal (a * b * c) := by
  rw [Real.volume_Icc_pi, Fin.prod_univ_three]
  simp [ENNReal.ofReal_mul, ha, hb, mul_nonneg]

/-- Predpostavke trditve `prostornina_kvadra` se dajo izpolniti, izrek uporabljen na kvadru 8 × 5 × 3. -/
example := prostornina_kvadra 8 5 3 (by norm_num) (by norm_num)

/-- Razlaga 4, Povzetek 2: kocka z robom a ≥ 0 ima prostornino V = a · a · a = a³.
trditev: MAT-OS-6/kocka-in-kvader#prostornina-kocke
besedilo: »Pri kocki so vsi trije robovi enaki, zato velja: $$V = a \cdot a \cdot a = a^3$$« -/
theorem prostornina_kocke (a : ℝ) (ha : 0 ≤ a) :
    volume (Set.Icc (0 : Fin 3 → ℝ) ![a, a, a]) = ENNReal.ofReal (a * a * a) ∧ a * a * a = a ^ 3 :=
  ⟨prostornina_kvadra a a a ha ha, by ring⟩

/-- Predpostavka trditve `prostornina_kocke` se da izpolniti, izrek uporabljen na kocki z robom 5. -/
example := prostornina_kocke 5 (by norm_num)

/-- Razlaga 4 (enotske kocke): v kvader z dolžino a, širino b in višino c (naravna števila) gre a · b · c enotskih
kock: v eni plasti jih je a · b (ploščina dna), plasti je c.
trditev: MAT-OS-6/kocka-in-kvader#enotske-kocke
besedilo: »V eni plasti je toliko kock, kolikšna je ploščina dna $a \cdot b$, plasti pa je toliko, kolikšna je višina $c$.« -/
theorem enotske_kocke (a b c : ℕ) :
    Fintype.card (Fin a × Fin b) = a * b ∧ Fintype.card ((Fin a × Fin b) × Fin c) = a * b * c := by
  simp

/-- Razlaga 4 (tabela): dno 3 · 2 = 6 kock; 1, 2, 3 plasti dajo 6, 12, 18 kock (6 · plasti).
trditev: MAT-OS-6/kocka-in-kvader#tabela-plasti
besedilo: »Dno naj bo dolgo $3$ kocke in široko $2$ kocki, plasti pa dodajamo.« -/
theorem tabela_plasti : 3 * 2 = 6 ∧ 6 * 1 = 6 ∧ 6 * 2 = 12 ∧ 6 * 3 = 18 ∧
    Fintype.card ((Fin 3 × Fin 2) × Fin 3) = 18 := by
  refine ⟨rfl, rfl, rfl, rfl, by simp⟩

/-- Razlaga 4, premisli: v kvader 5 × 4 × 3 gre 60 enotskih kock (5 · 4 = 20 v plasti, 20 · 3 = 60).
trditev: MAT-OS-6/kocka-in-kvader#premisli-60
besedilo: »$60$ kock. V eno plast gre $5 \cdot 4 = 20$ kock, plasti so $3$, zato je kock $20 \cdot 3 = 60$.« -/
theorem premisli_60 : 5 * 4 = 20 ∧ 20 * 3 = 60 ∧ Fintype.card ((Fin 5 × Fin 4) × Fin 3) = 60 := by
  refine ⟨rfl, rfl, by simp⟩

/-! ## Razlaga 5: enote -/

/-- Razlaga 5, Povzetek 5: kocka z robom 1 dm = 10 cm vsebuje 10 · 10 · 10 = 1000 enotskih kock po 1 cm³, zato je
1 dm³ = 1000 cm³ in prav tako 1 m³ = 1000 dm³ (1 m = 10 dm); pri površinah 10 · 10 = 100 (1 dm² = 100 cm²,
1 m² = 100 dm²).
trditev: MAT-OS-6/kocka-in-kvader#enote
besedilo: »kocka z robom $1\,\text{dm} = 10\,\text{cm}$ vsebuje $10 \cdot 10 \cdot 10 = 1000$ enotskih kock po $1\,\text{cm}^3$.« -/
theorem enote : (10 : ℝ) * 10 * 10 = 1000 ∧ (10 : ℝ) ^ 3 = 1000 ∧ (10 : ℝ) * 10 = 100 ∧
    Fintype.card ((Fin 10 × Fin 10) × Fin 10) = 1000 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by simp⟩

/-- Razlaga 5: 1 ml = 1 cm³ izhaja iz 1 l = 1 dm³ = 1000 cm³ in 1 l = 1000 ml (računano v cm³).
trditev: MAT-OS-6/kocka-in-kvader#liter
besedilo: »Za tekočine pa že poznaš $1\,\text{l} = 1\,\text{dm}^3$ in $1\,\text{ml} = 1\,\text{cm}^3$.« -/
theorem liter (l ml : ℝ) (hl : l = 1000) (hml : 1000 * ml = l) : ml = 1 := by linarith

/-- Predpostavke trditve `liter` se dajo izpolniti, izrek uporabljen na l = 1000, ml = 1. -/
example := liter 1000 1 rfl (by norm_num)

/-! ## Razlaga 6: ima Tilen prav? -/

/-- Razlaga 6, Povzetek 7: če vse robove kvadra podvojimo, se površina poveča 4-krat, prostornina pa 8-krat.
trditev: MAT-OS-6/kocka-in-kvader#podvojitev
besedilo: »Enako velja za vsak kvader, tudi za škatlo telefona: dvakrat daljši robovi pomenijo $4$-krat več kartona in $8$-krat več prostora.« -/
theorem podvojitev (a b c : ℝ) :
    2 * ((2 * a) * (2 * b) + (2 * a) * (2 * c) + (2 * b) * (2 * c)) = 4 * (2 * (a * b + a * c + b * c)) ∧
      (2 * a) * (2 * b) * (2 * c) = 8 * (a * b * c) := by
  constructor <;> ring

/-- Razlaga 6: pri pozitivnih robovih Tilen nima prav: podvojeni robovi ne dajo dvakratne površine ne dvakratne
prostornine.
trditev: MAT-OS-6/kocka-in-kvader#tilen
besedilo: »Tilen torej nima prav.« -/
theorem tilen (a b c : ℝ) (ha : 0 < a) (hb : 0 < b) (hc : 0 < c) :
    2 * ((2 * a) * (2 * b) + (2 * a) * (2 * c) + (2 * b) * (2 * c)) ≠ 2 * (2 * (a * b + a * c + b * c)) ∧
      (2 * a) * (2 * b) * (2 * c) ≠ 2 * (a * b * c) := by
  have h1 : 0 < a * b + a * c + b * c := by positivity
  have h2 : 0 < a * b * c := by positivity
  constructor
  · intro h; nlinarith
  · intro h; nlinarith

/-- Predpostavke trditve `tilen` se dajo izpolniti, izrek uporabljen na škatli 8 × 5 × 3. -/
example := tilen 8 5 3 (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 6 (tabela in premisli): kocka z robom 2 ima P = 24, V = 8, z robom 4 P = 96, V = 64; površina se
poveča 96 : 24 = 4-krat, prostornina 64 : 8 = 8-krat; 2 · 2 = 4, 2 · 2 · 2 = 8.
trditev: MAT-OS-6/kocka-in-kvader#tabela-tilen
besedilo: »Površina se je povečala $4$-krat ($96 : 24 = 4$), prostornina $8$-krat ($64 : 8 = 8$).« -/
theorem tabela_tilen : (6 : ℝ) * 2 ^ 2 = 24 ∧ (2 : ℝ) ^ 3 = 8 ∧ (6 : ℝ) * 4 ^ 2 = 96 ∧ (4 : ℝ) ^ 3 = 64 ∧
    (96 : ℝ) / 24 = 4 ∧ (64 : ℝ) / 8 = 8 ∧ (2 : ℝ) * 2 = 4 ∧ (2 : ℝ) * 2 * 2 = 8 ∧
    6 * (4 : ℝ) ^ 2 / (6 * 2 ^ 2) = 4 ∧ (4 : ℝ) ^ 3 / 2 ^ 3 = 8 := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: kocka z robom 5 cm: P = 6 · 5² = 6 · 25 = 150 (cm²), V = 5³ = 5 · 5 · 5 = 125 (cm³).
trditev: MAT-OS-6/kocka-in-kvader#primer1
besedilo: »Odgovor: površina kocke je $150\,\text{cm}^2$, prostornina pa $125\,\text{cm}^3$.« -/
theorem primer1 : (6 : ℝ) * 5 ^ 2 = 150 ∧ (5 : ℝ) ^ 3 = 125 := by
  constructor
  · calc (6 : ℝ) * 5 ^ 2 = 6 * 25 := by norm_num
      _ = 150 := by norm_num
  · calc (5 : ℝ) ^ 3 = 5 * 5 * 5 := by norm_num
      _ = 125 := by norm_num

/-- Primer 2: kvader 8 × 5 × 3: ploščine 8 · 5 = 40, 8 · 3 = 24, 5 · 3 = 15, vsota 40 + 24 + 15 = 79,
P = 2 · 79 = 158 (cm²); V = 8 · 5 · 3 = 40 · 3 = 120 (cm³).
trditev: MAT-OS-6/kocka-in-kvader#primer2
besedilo: »Odgovor: za škatlo potrebujemo $158\,\text{cm}^2$ kartona, njena prostornina je $120\,\text{cm}^3$.« -/
theorem primer2 : (8 : ℝ) * 5 = 40 ∧ (8 : ℝ) * 3 = 24 ∧ (5 : ℝ) * 3 = 15 ∧ (40 : ℝ) + 24 + 15 = 79 ∧
    (2 : ℝ) * (8 * 5 + 8 * 3 + 5 * 3) = 158 ∧ (8 : ℝ) * 5 * 3 = 120 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · calc (2 : ℝ) * (8 * 5 + 8 * 3 + 5 * 3) = 2 * (40 + 24 + 15) := by norm_num
      _ = 2 * 79 := by norm_num
      _ = 158 := by norm_num
  · calc (8 : ℝ) * 5 * 3 = 40 * 3 := by norm_num
      _ = 120 := by norm_num

/-- Primer 3: akvarij brez pokrova 80 × 40 × 50: dno 80 · 40 = 3200, večji steni 2 · 80 · 50 = 8000, manjši
2 · 40 · 50 = 4000, skupaj 15 200 cm² = 152 dm²; voda do 35 cm: V = 80 · 40 · 35 = 112 000 cm³ = 112 dm³ = 112 l.
trditev: MAT-OS-6/kocka-in-kvader#primer3
besedilo: »Odgovor: steklar potrebuje $15\,200\,\text{cm}^2$ ($152\,\text{dm}^2$) stekla, v akvariju pa je $112$ litrov vode.« -/
theorem primer3 : (80 : ℝ) * 40 = 3200 ∧ (2 : ℝ) * 80 * 50 = 8000 ∧ (2 : ℝ) * 40 * 50 = 4000 ∧
    (80 : ℝ) * 40 + 2 * 80 * 50 + 2 * 40 * 50 = 15200 ∧ (15200 : ℝ) / 100 = 152 ∧
    (80 : ℝ) * 40 * 35 = 112000 ∧ (112000 : ℝ) / 1000 = 112 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  calc (80 : ℝ) * 40 + 2 * 80 * 50 + 2 * 40 * 50 = 3200 + 8000 + 4000 := by norm_num
    _ = 15200 := by norm_num

/-- Primer 4: dno 16 · 9 = 144; višina je enolično c = 720 : 144 = 5 (16 · 9 · c = 720 natanko pri c = 5);
P = 2 · (144 + 16 · 5 + 9 · 5) = 2 · (144 + 80 + 45) = 2 · 269 = 538 (cm²).
trditev: MAT-OS-6/kocka-in-kvader#primer4
besedilo: »$c = 720 : 144 = 5\,\text{cm}$. Površina: $P = 2 \cdot (144 + 16 \cdot 5 + 9 \cdot 5) = 2 \cdot (144 + 80 + 45) = 2 \cdot 269 = 538\,\text{cm}^2$.« -/
theorem primer4 (c : ℝ) : (16 : ℝ) * 9 = 144 ∧ (16 * 9 * c = 720 ↔ c = 5) ∧ (720 : ℝ) / 144 = 5 ∧
    (2 : ℝ) * (144 + 16 * 5 + 9 * 5) = 538 := by
  refine ⟨by norm_num, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, ?_⟩
  calc (2 : ℝ) * (144 + 16 * 5 + 9 * 5) = 2 * (144 + 80 + 45) := by norm_num
    _ = 2 * 269 := by norm_num
    _ = 538 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 2: za a = 4 je 3 · a = 12, prostornina pa a³ = 4 · 4 · 4 = 64, ne 12.
trditev: MAT-OS-6/kocka-in-kvader#napaka2
besedilo: »Pravilno: $a^3 = a \cdot a \cdot a$, torej $4 \cdot 4 \cdot 4 = 64\,\text{cm}^3$.« -/
theorem napaka2 : (3 : ℝ) * 4 = 12 ∧ (4 : ℝ) ^ 3 = 4 * 4 * 4 ∧ (4 : ℝ) * 4 * 4 = 64 ∧ (4 : ℝ) ^ 3 ≠ 12 := by
  norm_num

/-- Pogoste napake 3: samo tri ploščine a · b + a · c + b · c sta le polovica površine; pri pozitivnih robovih je
to manj kot površina.
trditev: MAT-OS-6/kocka-in-kvader#napaka3
besedilo: »Pravilno: kvader ima $6$ ploskev, zato vsoto treh ploščin pomnožimo z $2$.« -/
theorem napaka3 (a b c : ℝ) (ha : 0 < a) (hb : 0 < b) (hc : 0 < c) :
    a * b + a * c + b * c < 2 * (a * b + a * c + b * c) := by
  have : 0 < a * b + a * c + b * c := by positivity
  linarith

/-- Predpostavke trditve `napaka3` se dajo izpolniti, izrek uporabljen na škatli 5 × 4 × 2. -/
example := napaka3 5 4 2 (by norm_num) (by norm_num) (by norm_num)

/-- Pogoste napake 4: 1 dm³ = 10 · 10 · 10 = 1000 cm³, ne 10 cm³; 2 m = 200 cm.
trditev: MAT-OS-6/kocka-in-kvader#napaka4
besedilo: »Pravilno: kocka z robom $1\,\text{dm} = 10\,\text{cm}$ ima prostornino $10 \cdot 10 \cdot 10 = 1000\,\text{cm}^3$.« -/
theorem napaka4 : (10 : ℝ) * 10 * 10 = 1000 ∧ (10 : ℝ) * 10 * 10 ≠ 10 ∧ (2 : ℝ) * 100 = 200 := by norm_num

/-- Pogoste napake 5: ploščina ploskve se ob podvojitvi obeh mer poveča 2 · 2 = 4-krat, prostornina
2 · 2 · 2 = 8-krat.
trditev: MAT-OS-6/kocka-in-kvader#napaka5
besedilo: »Pravilno: ploščina vsake ploskve se poveča $2 \cdot 2 = 4$-krat, prostornina $2 \cdot 2 \cdot 2 = 8$-krat.« -/
theorem napaka5 (a b c : ℝ) : (2 * a) * (2 * b) = (2 * 2) * (a * b) ∧
    (2 * a) * (2 * b) * (2 * c) = (2 * 2 * 2) * (a * b * c) ∧ (2 : ℝ) * 2 = 4 ∧ (2 : ℝ) * 2 * 2 = 8 := by
  refine ⟨by ring, by ring, by norm_num, by norm_num⟩

/-! ## Drugače: Iz vsakdanjega življenja -/

/-- Zavijanje darila: 30 · 20 = 600, 30 · 10 = 300, 20 · 10 = 200, skupaj 1100, krat 2 je 2200 (cm²).
trditev: MAT-OS-6/kocka-in-kvader#darilo
besedilo: »Izračunaš: $30 \cdot 20 = 600$, $30 \cdot 10 = 300$, $20 \cdot 10 = 200$, skupaj $1100$, krat $2$ je $2200\,\text{cm}^2$.« -/
theorem darilo : (30 : ℝ) * 20 = 600 ∧ (30 : ℝ) * 10 = 300 ∧ (20 : ℝ) * 10 = 200 ∧ (600 : ℝ) + 300 + 200 = 1100 ∧
    (2 : ℝ) * 1100 = 2200 := by norm_num

/-- Liter mleka: kocka z robom 10 cm ima 10 · 10 · 10 = 1000 cm³; rob kocke s prostornino 1000 je enolično 10.
trditev: MAT-OS-6/kocka-in-kvader#mleko
besedilo: »Če bi bila embalaža kocka, bi bil njen rob $1\,\text{dm} = 10\,\text{cm}$, saj je $10 \cdot 10 \cdot 10 = 1000\,\text{cm}^3$.« -/
theorem mleko (a : ℝ) (ha : 0 ≤ a) : (10 : ℝ) * 10 * 10 = 1000 ∧ (a ^ 3 = 1000 ↔ a = 10) := by
  refine ⟨by norm_num, fun h => ?_, fun h => by rw [h]; norm_num⟩
  have h10 : (10 : ℝ) ^ 3 = 1000 := by norm_num
  rw [← h10] at h
  exact (pow_left_inj₀ ha (by norm_num) (by norm_num)).mp h

/-- Predpostavka trditve `mleko` se da izpolniti, izrek uporabljen na a = 10. -/
example := mleko 10 (by norm_num)

/-- Učilnica 8 × 6 × 3: V = 144 (m³); bazen 10 × 5 × 2: V = 100 m³ = 100 · 1000 = 100 000 l; čarobna kocka:
3 · 3 · 3 = 27 kock, 3 · 3 = 9 kvadratkov na strani, 6 · 9 = 54.
trditev: MAT-OS-6/kocka-in-kvader#vsakdan
besedilo: »Njena prostornina je $8 \cdot 6 \cdot 3 = 144\,\text{m}^3$.« -/
theorem vsakdan : (8 : ℝ) * 6 * 3 = 144 ∧ (10 : ℝ) * 5 * 2 = 100 ∧ (100 : ℝ) * 1000 = 100000 ∧
    (3 : ℝ) * 3 * 3 = 27 ∧ (3 : ℝ) * 3 = 9 ∧ (6 : ℝ) * 9 = 54 := by norm_num

/-! ## Drugače: Korak za korakom -/

/-- Korak za korakom A in B: kvader 9 × 4 × 5: V = 9 · 4 · 5 = 36 · 5 = 180 (cm³); ab = 36, ac = 45, bc = 20,
vsota 101, P = 2 · 101 = 202 (cm²).
trditev: MAT-OS-6/kocka-in-kvader#korak-ab
besedilo: »Najprej $9 \cdot 4 = 36$ (to je ploščina dna v $\text{cm}^2$), nato $36 \cdot 5 = 180$.« -/
theorem korak_ab : (9 : ℝ) * 4 * 5 = 180 ∧ (2 : ℝ) * (9 * 4 + 9 * 5 + 4 * 5) = 202 := by
  constructor
  · calc (9 : ℝ) * 4 * 5 = 36 * 5 := by norm_num
      _ = 180 := by norm_num
  · calc (2 : ℝ) * (9 * 4 + 9 * 5 + 4 * 5) = 2 * (36 + 45 + 20) := by norm_num
      _ = 2 * 101 := by norm_num
      _ = 202 := by norm_num

/-- Korak za korakom C: 360 = 10 · 6 · c natanko tedaj, ko je c = 6 (360 = 60 · c, c = 360 : 60 = 6), preizkus
10 · 6 · 6 = 360; robovi 10, 6, 6 niso kocka.
trditev: MAT-OS-6/kocka-in-kvader#obratna
besedilo: »Odgovor: višina kvadra je $6\,\text{cm}$.« -/
theorem obratna (c : ℝ) : (360 = 10 * 6 * c ↔ c = 6) ∧ (10 : ℝ) * 6 = 60 ∧ (360 : ℝ) / 60 = 6 ∧
    (10 : ℝ) * 6 * 6 = 360 ∧ (10 : ℝ) ≠ 6 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-! ## Drugače: Kot zgodba -/

/-- Zgodba: 40 : 20 = 2, 30 : 10 = 3, 2 · 3 = 6 v plasti, 20 : 5 = 4 plasti, 6 · 4 = 24 škatel; 40 · 30 · 20 = 24 000,
20 · 10 · 5 = 1000, 24 000 : 1000 = 24; papir 1200 + 800 + 600 = 2600, 2 · 2600 = 5200 cm² = 52 dm².
trditev: MAT-OS-6/kocka-in-kvader#zgodba
besedilo: »Potrebujeta vsaj $5200\,\text{cm}^2$, to je $52\,\text{dm}^2$ papirja.« -/
theorem zgodba : (40 : ℝ) / 20 = 2 ∧ (30 : ℝ) / 10 = 3 ∧ (2 : ℝ) * 3 = 6 ∧ (20 : ℝ) / 5 = 4 ∧ (6 : ℝ) * 4 = 24 ∧
    (40 : ℝ) * 30 * 20 = 24000 ∧ (20 : ℝ) * 10 * 5 = 1000 ∧ (24000 : ℝ) / 1000 = 24 ∧
    (40 : ℝ) * 30 = 1200 ∧ (40 : ℝ) * 20 = 800 ∧ (30 : ℝ) * 20 = 600 ∧ (1200 : ℝ) + 800 + 600 = 2600 ∧
    (2 : ℝ) * (40 * 30 + 40 * 20 + 30 * 20) = 5200 ∧ (5200 : ℝ) / 100 = 52 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: Jure: 5 · 4 = 20, 5 · 2 = 10, 4 · 2 = 8 in 20 + 10 + 8 = 38 sta pravilna, korak 3 ne: P = 2 · 38
= 76 (cm²) ≠ 38.
trditev: MAT-OS-6/kocka-in-kvader#kviz2
besedilo: »Vsaka ploskev se pojavi dvakrat, zato je $P = 2 \cdot 38 = 76\,\text{cm}^2$.« -/
theorem kviz2 : (5 : ℝ) * 4 = 20 ∧ (5 : ℝ) * 2 = 10 ∧ (4 : ℝ) * 2 = 8 ∧ (20 : ℝ) + 10 + 8 = 38 ∧
    (2 : ℝ) * (5 * 4 + 5 * 2 + 4 * 2) = 2 * 38 ∧ (2 : ℝ) * 38 = 76 ∧ (2 : ℝ) * (5 * 4 + 5 * 2 + 4 * 2) ≠ 38 := by
  norm_num

/-- Preveri se 3: kocka A (rob 3): P = 54, V = 27; kocka B (rob 6): P = 216, V = 216; 216 : 54 = 4, 216 : 27 = 8
(ne 2 in 2, ne 8 in 4).
trditev: MAT-OS-6/kocka-in-kvader#kviz3
besedilo: »Kocka $A$: $P = 54\,\text{cm}^2$, $V = 27\,\text{cm}^3$. Kocka $B$: $P = 216\,\text{cm}^2$, $V = 216\,\text{cm}^3$. Res $216 : 54 = 4$ in $216 : 27 = 8$.« -/
theorem kviz3 : (6 : ℝ) * 3 ^ 2 = 54 ∧ (3 : ℝ) ^ 3 = 27 ∧ (6 : ℝ) * 6 ^ 2 = 216 ∧ (6 : ℝ) ^ 3 = 216 ∧
    (216 : ℝ) / 54 = 4 ∧ (216 : ℝ) / 27 = 8 ∧ (216 : ℝ) / 54 ≠ 2 ∧ (216 : ℝ) / 27 ≠ 2 ∧ (216 : ℝ) / 54 ≠ 8 := by
  norm_num

/-- Preveri se 4: dno 3 × 2, višina 1: V = 3 · 2 · 1 = 6 (cm³); 22 je površina 2 · (6 + 3 + 2), 12 = 3 · 2 · 2 je
napačna višina 2.
trditev: MAT-OS-6/kocka-in-kvader#kviz4
besedilo: »$V = 3 \cdot 2 \cdot 1 = 6\,\text{cm}^3$.« -/
theorem kviz4 : (3 : ℝ) * 2 * 1 = 6 ∧ (2 : ℝ) * (3 * 2 + 3 * 1 + 2 * 1) = 22 ∧ (3 : ℝ) * 2 * 2 = 12 := by norm_num

/-- Preveri se 5: 2500 cm³ = 2500 : 1000 = 2,5 dm³ = 2,5 l (ne 2500, 25 ali 250).
trditev: MAT-OS-6/kocka-in-kvader#kviz5
besedilo: »$1\,\text{l} = 1\,\text{dm}^3 = 1000\,\text{cm}^3$, zato je $2500\,\text{cm}^3 = 2{,}5\,\text{dm}^3 = 2{,}5\,\text{l}$.« -/
theorem kviz5 : (2500 : ℝ) / 1000 = 5 / 2 ∧ (2500 : ℝ) / 1000 ≠ 2500 ∧ (2500 : ℝ) / 1000 ≠ 25 ∧
    (2500 : ℝ) / 1000 ≠ 250 ∧ (2500 : ℝ) / 100 = 25 ∧ (2500 : ℝ) / 10 = 250 := by norm_num

end Evklid.Lekcije.MAT_OS_6.KockaInKvader
