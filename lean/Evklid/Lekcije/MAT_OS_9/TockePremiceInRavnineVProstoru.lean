/-
vir: content/lessons/MAT-OS-9/tocke-premice-in-ravnine-v-prostoru.md
sha256: 8d21ea5830b086b0a696982e557edcc22fe30ce7d189fe709a8ab1a0c23eefd0
Model (koordinate): točke so trojice ℝ × ℝ × ℝ, `sk` je skalarni produkt, premica PQ je {P + t(Q − P)},
ravnina je {X | n·X = c} z n ≠ 0. »Ležita v isti ravnini« pomeni, da obstaja ravnina, ki vsebuje obe
premici; sekajoči = v isti ravnini z natanko eno skupno točko; vzporedni = v isti ravnini in brez skupne
točke (ali sovpadata); mimobežni = nista v isti ravnini in nimata skupne točke. Pravokotnost je
pravokotnost smeri (skalarni produkt 0). Nožišče točke T na ravnini n·X = c je T − ((n·T − c)/(n·n))·n,
razdalja je dolžina TT'. Kocka ABCDEFGH v kvalitativnih trditvah ima rob 1: A(0,0,0), B(1,0,0), C(1,1,0),
D(0,1,0), E(0,0,1), F(1,0,1), G(1,1,1), H(0,1,1) (lege robov so pri vsakem robu enake); v Primerih 3, 4, Korak
za korakom in Preveri se 2 so koordinate z robovi iz lekcije, v Primeru 2 kvader s poljubnimi robovi
a, c > 0 (in poljubnim b). Zaokrožene vrednosti so dokazane kot |točna − približek| < pol enote zadnjega mesta.
Ni v Leanu: risbe, simulacija in »križanje na risbi je le videz« kot trditev o risbi (dokazano je, da DC in
BF nimata skupne točke in nista v isti ravnini); Žanov rob stropa in črta na tleh ter pajkova nit in rob
v zgodbi kot opisa brez koordinat (isti položaj kot AB in FG oziroma EF in CG v kocki je dokazan); splošno
pravilo »ravnino natanko določajo tri nekolinearne točke, premica in točka zunaj nje, dve sekajoči ali
dve vzporedni premici« (zahtevno, še ni dokazano; dokazano je za A, B, C kocke, da je ravnina skozi njih ena
sama in G ne leži v njej, ter da gre skozi tri kolinearne točke neskončno ravnin); splošno »dve ravnini sta
vzporedni ali se sekata v premici« (zahtevno, še ni dokazano; dokazana sta primera ABCD ∥ EFGH in
ABCD ∩ BCGF = BC); pravilo pravokotnosti na ravnino je dokazano v obliki »pravokotna na smeri u in v ⇒
pravokotna na vsako smer αu + βv« in za tla kocke (vsaka smer v tleh); da je vsaka smer splošne ravnine
oblike αu + βv, ni dokazano (zahtevno, še ni dokazano); vrtenje »kot vrata« v premisli je opis (dokazano
je, da je pri eni pravokotnici smeri več, pri dveh pa le navpična); fizika (teža, napeta nit, majanje
stojala) in poimenovanja; Preveri se (3) in (5) sta dokazani kot pravili, ne kot besedilo odgovorov; splošno »dve premici v prostoru
so natanko ena od: sekajoči, vzporedni, mimobežni« in »v ravnini se dve premici sekata ali sta vzporedni«
(zahtevno, še ni dokazano; dokazani so primeri v kocki); pri premici in ravnini je dokazano, da velja vsaj
ena od treh leg, da se izključujejo, ni dokazano (zahtevno, še ni dokazano); v Korak za korakom »HG je
vzporeden z AB« in »HE je vzporeden z BC« (dokazani sta nožišči in razdalji); besedilo napačnih odgovorov
v Preveri se (dokazano je, da so napačne vrednosti take, kot pravi razlaga).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.TockePremiceInRavnineVProstoru

open Real

/-- Točka (ali smer) v prostoru. -/
abbrev V3 := ℝ × ℝ × ℝ

/-- Skalarni produkt. -/
def sk (u v : V3) : ℝ := u.1 * v.1 + u.2.1 * v.2.1 + u.2.2 * v.2.2

/-- Premica skozi P in Q. -/
def premica (P Q : V3) : Set V3 := {X | ∃ t : ℝ, X = P + t • (Q - P)}

/-- Ravnina n·X = c. -/
def ravnina (n : V3) (c : ℝ) : Set V3 := {X | sk n X = c}

/-- Množici ležita v isti ravnini. -/
def vIstiRavnini (S T : Set V3) : Prop := ∃ n c, n ≠ 0 ∧ S ⊆ ravnina n c ∧ T ⊆ ravnina n c

/-- Sekajoči: v isti ravnini, natanko ena skupna točka. -/
def sekajoci (S T : Set V3) : Prop := vIstiRavnini S T ∧ ∃! X, X ∈ S ∧ X ∈ T

/-- Vzporedni: v isti ravnini in brez skupne točke ali sovpadata. -/
def vzporedni (S T : Set V3) : Prop := vIstiRavnini S T ∧ (Disjoint S T ∨ S = T)

/-- Mimobežni: nista v isti ravnini in nimata skupne točke. -/
def mimobezni (S T : Set V3) : Prop := ¬ vIstiRavnini S T ∧ Disjoint S T

/-- Oglišča kocke z robom 1. -/
def kA : V3 := (0, 0, 0)
def kB : V3 := (1, 0, 0)
def kC : V3 := (1, 1, 0)
def kD : V3 := (0, 1, 0)
def kE : V3 := (0, 0, 1)
def kF : V3 := (1, 0, 1)
def kG : V3 := (1, 1, 1)
def kH : V3 := (0, 1, 1)

/-- Razvije definicije in koordinate. -/
macro "razvij" : tactic => `(tactic| simp only [sk, ravnina, premica, kA, kB, kC, kD, kE, kF, kG, kH,
  Set.mem_ofPred_eq, Prod.ext_iff, Prod.fst_add, Prod.snd_add, Prod.smul_fst, Prod.smul_snd, Prod.fst_sub,
  Prod.snd_sub, smul_eq_mul, Prod.fst_zero, Prod.snd_zero, Prod.mk_add_mk, Prod.mk_sub_mk, Prod.smul_mk,
  Prod.mk.injEq] at *)

/-! ## Splošna orodja -/

/-- Orodje: P leži na premici PQ (t = 0).
pomozno – orodje za druge dokaze (vektorski zapis premice/ravnine), lekcija ga ne izreče -/
theorem levo (P Q : V3) : P ∈ premica P Q := ⟨0, by simp⟩
/-- Orodje: Q leži na premici PQ (t = 1).
pomozno – orodje za druge dokaze (vektorski zapis premice/ravnine), lekcija ga ne izreče -/
theorem desno (P Q : V3) : Q ∈ premica P Q := ⟨1, by simp⟩

/-- Orodje: n·(P + t·d) = n·P + t·(n·d).
pomozno – orodje za druge dokaze (vektorski zapis premice/ravnine), lekcija ga ne izreče -/
theorem sk_premica (n P d : V3) (t : ℝ) : sk n (P + t • d) = sk n P + t * sk n d := by
  simp only [sk, Prod.fst_add, Prod.snd_add, Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring

/-- Kvadrat dolžine neničelnega vektorja je pozitiven.
pomozno – orodje za druge dokaze (vektorski zapis premice/ravnine), lekcija ga ne izreče -/
theorem sk_pos (w : V3) (hw : w ≠ 0) : 0 < sk w w := by
  obtain ⟨a, b, d⟩ := w
  simp only [sk]
  by_contra h
  apply hw
  have ha : a = 0 := by nlinarith [sq_nonneg a, sq_nonneg b, sq_nonneg d]
  have hb : b = 0 := by nlinarith [sq_nonneg a, sq_nonneg b, sq_nonneg d]
  have hd : d = 0 := by nlinarith [sq_nonneg a, sq_nonneg b, sq_nonneg d]
  simp [ha, hb, hd]

/-- Predpostavka trditve `sk_pos` se da izpolniti. -/
example : (kA + kB) ≠ 0 := by simp [kA, kB, Prod.ext_iff]

/-- Orodje: kvadrat dolžine vektorja ni negativen.
pomozno – orodje za druge dokaze (vektorski zapis premice/ravnine), lekcija ga ne izreče -/
theorem sk_nonneg (w : V3) : 0 ≤ sk w w := by
  simp only [sk]; nlinarith [mul_self_nonneg w.1, mul_self_nonneg w.2.1, mul_self_nonneg w.2.2]

/-- Orodje: vektor z ničelnimi koordinatami je ničelni vektor.
pomozno – orodje za druge dokaze (vektorski zapis premice/ravnine), lekcija ga ne izreče -/
theorem nic {a b c : ℝ} (h1 : a = 0) (h2 : b = 0) (h3 : c = 0) : ((a, b, c) : V3) = 0 := by
  subst h1 h2 h3; rfl

/-- Razlaga (premica in ravnina): premica leži v ravnini, če ležita v njej dve njeni točki.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#lezi
besedilo: »premica **leži** v ravnini, če ležita v njej dve njeni točki« -/
theorem lezi (P Q n : V3) (c : ℝ) (hP : P ∈ ravnina n c) (hQ : Q ∈ ravnina n c) :
    premica P Q ⊆ ravnina n c := by
  rintro X ⟨t, rfl⟩
  simp only [ravnina, Set.mem_ofPred_eq] at *
  rw [sk_premica]
  have : sk n (Q - P) = sk n Q - sk n P := by
    simp only [sk, Prod.fst_sub, Prod.snd_sub]; ring
  rw [this, hP, hQ]; ring

/-- Predpostavke trditve `lezi` se dajo izpolniti (E, F v ravnini z = 1). -/
example : kE ∈ ravnina (0, 0, 1) 1 ∧ kF ∈ ravnina (0, 0, 1) 1 := by norm_num [kE, kF, ravnina, sk]

/-- Razlaga, Povzetek: premica in ravnina imajo tri možne lege: velja vsaj ena od: premica leži v ravnini,
je z njo vzporedna (nimata skupne točke) ali jo prebada v natanko eni točki (prebodišču); izključevanje ni
dokazano (glej glavo).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#premica-ravnina
besedilo: »Premica in ravnina: premica leži v ravnini, je z njo vzporedna ali jo prebada v prebodišču.« -/
theorem premica_ravnina (P Q n : V3) (c : ℝ) :
    premica P Q ⊆ ravnina n c ∨ Disjoint (premica P Q) (ravnina n c) ∨
      ∃! X, X ∈ premica P Q ∧ X ∈ ravnina n c := by
  by_cases ha : sk n (Q - P) = 0
  · by_cases hb : sk n P = c
    · left; rintro X ⟨t, rfl⟩
      simp only [ravnina, Set.mem_ofPred_eq]; rw [sk_premica, ha, hb]; ring
    · right; left
      rw [Set.disjoint_left]
      rintro X ⟨t, rfl⟩ hX
      simp only [ravnina, Set.mem_ofPred_eq] at hX; rw [sk_premica, ha] at hX
      exact hb (by linarith)
  · right; right
    refine ⟨P + ((c - sk n P) / sk n (Q - P)) • (Q - P), ⟨⟨_, rfl⟩, ?_⟩, ?_⟩
    · simp only [ravnina, Set.mem_ofPred_eq]; rw [sk_premica]; field_simp; ring
    · rintro Y ⟨⟨t, rfl⟩, hY⟩
      simp only [ravnina, Set.mem_ofPred_eq] at hY; rw [sk_premica] at hY
      have : t = (c - sk n P) / sk n (Q - P) := by field_simp; linarith
      rw [this]

/-- Razlaga (pravokotnost na ravnino): smer d, pravokotna na dve smeri u in v ravnine, je pravokotna na
vsako smer αu + βv.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#pravokotna-na-dve
besedilo: »Tedaj je pravokotna na vsako premico ravnine skozi prebodišče.« -/
theorem pravokotna_na_dve (d u v : V3) (hu : sk d u = 0) (hv : sk d v = 0) (α β : ℝ) :
    sk d (α • u + β • v) = 0 := by
  have : sk d (α • u + β • v) = α * sk d u + β * sk d v := by
    simp only [sk, Prod.fst_add, Prod.snd_add, Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring
  rw [this, hu, hv]; ring

/-- Predpostavke trditve `pravokotna_na_dve` se dajo izpolniti (AE na AB in AD). -/
example : sk (kE - kA) (kB - kA) = 0 ∧ sk (kE - kA) (kD - kA) = 0 := by
  norm_num [sk, kA, kB, kD, kE]

/-! ## Razdalja točke od ravnine -/

/-- Nožišče (pravokotna projekcija) točke T na ravnino n·X = c. -/
noncomputable def nozisce (T n : V3) (c : ℝ) : V3 := T - ((sk n T - c) / sk n n) • n

/-- Razdalja točke T od ravnine: dolžina TT'. -/
noncomputable def razdalja (T n : V3) (c : ℝ) : ℝ :=
  √(sk (T - nozisce T n c) (T - nozisce T n c))

/-- Razlaga (razdalja), Pogoste napake (tretja), Povzetek, Kot zgodba: nožišče T' leži v ravnini; TT' je
pravokotna na vsako smer ravnine; za vsako točko X ravnine je TX² = TT'² + T'X² (Pitagorov izrek), zato
je vsaka druga daljica TX (X ≠ T') daljša od TT': razdalja je najkrajša daljica, nožišče pa edino.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#nozisce-lastnosti
besedilo: »Vsaka druga daljica od $T$ do ravnine je poševna in daljša, ker je hipotenuza pravokotnega trikotnika s kateto $TT'$.« -/
theorem nozisce_lastnosti (T n : V3) (c : ℝ) (hn : n ≠ 0) :
    nozisce T n c ∈ ravnina n c ∧
    (∀ X ∈ ravnina n c, ∀ Y ∈ ravnina n c, sk (T - nozisce T n c) (X - Y) = 0) ∧
    (∀ X ∈ ravnina n c, sk (T - X) (T - X) =
      sk (T - nozisce T n c) (T - nozisce T n c) + sk (nozisce T n c - X) (nozisce T n c - X)) ∧
    ∀ X ∈ ravnina n c, X ≠ nozisce T n c → razdalja T n c < √(sk (T - X) (T - X)) := by
  have hnn := sk_pos n hn
  set k := (sk n T - c) / sk n n with hkdef
  have hk : k * sk n n = sk n T - c := by rw [hkdef]; field_simp
  obtain ⟨n1, n2, n3⟩ := n
  obtain ⟨t1, t2, t3⟩ := T
  have pit : ∀ X ∈ ravnina (n1, n2, n3) c, sk ((t1, t2, t3) - X) ((t1, t2, t3) - X) =
      sk ((t1, t2, t3) - nozisce (t1, t2, t3) (n1, n2, n3) c)
        ((t1, t2, t3) - nozisce (t1, t2, t3) (n1, n2, n3) c) +
      sk (nozisce (t1, t2, t3) (n1, n2, n3) c - X) (nozisce (t1, t2, t3) (n1, n2, n3) c - X) := by
    rintro ⟨x1, x2, x3⟩ hX
    simp only [nozisce, ← hkdef]
    simp only [sk, ravnina, Set.mem_ofPred_eq, smul_eq_mul, Prod.mk_sub_mk, Prod.smul_mk] at hX hk ⊢
    linear_combination (-2 * k) * hk + (-2 * k) * hX
  refine ⟨?_, ?_, pit, ?_⟩
  · simp only [nozisce, ← hkdef]
    simp only [sk, ravnina, Set.mem_ofPred_eq, smul_eq_mul, Prod.mk_sub_mk, Prod.smul_mk] at hk ⊢
    linear_combination -hk
  · rintro ⟨x1, x2, x3⟩ hX ⟨y1, y2, y3⟩ hY
    simp only [nozisce, ← hkdef]
    simp only [sk, ravnina, Set.mem_ofPred_eq, smul_eq_mul, Prod.mk_sub_mk, Prod.smul_mk] at hX hY ⊢
    linear_combination k * hX - k * hY
  · intro X hX hne
    rw [razdalja, pit X hX]
    have h0 : 0 ≤ sk ((t1, t2, t3) - nozisce (t1, t2, t3) (n1, n2, n3) c)
        ((t1, t2, t3) - nozisce (t1, t2, t3) (n1, n2, n3) c) := by
      exact sk_nonneg _
    have h1 := sk_pos (nozisce (t1, t2, t3) (n1, n2, n3) c - X) (sub_ne_zero.mpr hne.symm)
    exact Real.sqrt_lt_sqrt h0 (by linarith)

/-- Predpostavka trditve `nozisce_lastnosti` se da izpolniti (n = (0, 0, 1)). -/
example : ((0:ℝ), (0:ℝ), (1:ℝ)) ≠ 0 := by simp [Prod.ext_iff]

/-- Orodje za račun razdalje: če je nožišče T' in TT'² = d² z d ≥ 0, je razdalja d.
pomozno – orodje za račun razdalje iz nožišča, lekcija ga ne izreče -/
theorem razdalja_eq {T n T' : V3} {c d : ℝ} (h : nozisce T n c = T') (hd : sk (T - T') (T - T') = d ^ 2)
    (hd0 : 0 ≤ d) : razdalja T n c = d := by
  rw [razdalja, h, hd, Real.sqrt_sq hd0]

/-- Predpostavke trditve `razdalja_eq` se dajo izpolniti (T v ravnini, d = 0). -/
example : nozisce kA (0, 0, 1) 0 = kA ∧ sk (kA - kA) (kA - kA) = 0 ^ 2 := by
  refine ⟨?_, by norm_num [sk, kA]⟩
  simp [nozisce, sk, kA]

/-! ## Dve premici v prostoru (tabela, premisli) -/

/-- Razlaga (tabela): AB in BC sta sekajoči (skupna točka B, ravnina ABCD).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ab-bc
besedilo: »| $AB$, $BC$ | $B$ | da | sekajoči |« -/
theorem AB_BC : sekajoci (premica kA kB) (premica kB kC) := by
  refine ⟨⟨(0, 0, 1), 0, by simp [Prod.ext_iff], lezi _ _ _ _ (by norm_num [ravnina, sk, kA])
    (by norm_num [ravnina, sk, kB]), lezi _ _ _ _ (by norm_num [ravnina, sk, kB])
    (by norm_num [ravnina, sk, kC])⟩, kB, ⟨desno _ _, levo _ _⟩, ?_⟩
  rintro Y ⟨⟨t, rfl⟩, ⟨s, hs⟩⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  refine ⟨by linarith, by linarith, by linarith⟩

/-- Razlaga (tabela), Preveri se (1): AB in DC sta vzporedni (ravnina ABCD, brez skupne točke).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ab-dc
besedilo: »| $AB$, $DC$ | ni | da | vzporedni |« -/
theorem AB_DC : vzporedni (premica kA kB) (premica kD kC) := by
  refine ⟨⟨(0, 0, 1), 0, by simp [Prod.ext_iff], lezi _ _ _ _ (by norm_num [ravnina, sk, kA])
    (by norm_num [ravnina, sk, kB]), lezi _ _ _ _ (by norm_num [ravnina, sk, kD])
    (by norm_num [ravnina, sk, kC])⟩, Or.inl ?_⟩
  rw [Set.disjoint_left]
  rintro X ⟨t, rfl⟩ ⟨s, hs⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  linarith

/-- Iz ravnine, ki vsebuje premici PQ in RS, dobimo enačbe za vse štiri točke.
pomozno – orodje: enačbe ravnine za štiri točke dveh premic v isti ravnini -/
theorem stiri_tocke {P Q R S : V3} (h : vIstiRavnini (premica P Q) (premica R S)) :
    ∃ n : V3, ∃ c : ℝ, n ≠ 0 ∧ sk n P = c ∧ sk n Q = c ∧ sk n R = c ∧ sk n S = c := by
  obtain ⟨n, c, hn, h1, h2⟩ := h
  exact ⟨n, c, hn, h1 (levo P Q), h1 (desno P Q), h2 (levo R S), h2 (desno R S)⟩

/-- Razlaga (mamljiva zamisel, tabela), Pogoste napake (prva), Preveri se (1): AB in CG sta mimobežni.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ab-cg
besedilo: »$AB$ in $CG$ nimata skupne točke in ne ležita v isti ravnini, zato sta mimobežna.« -/
theorem AB_CG : mimobezni (premica kA kB) (premica kC kG) := by
  refine ⟨fun h => ?_, ?_⟩
  · obtain ⟨⟨n1, n2, n3⟩, c, hn, h1, h2, h3, h4⟩ := stiri_tocke h
    razvij
    exact hn (nic (by linarith) (by linarith) (by linarith))
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ ⟨s, hs⟩
    razvij
    obtain ⟨h1, h2, h3⟩ := hs
    linarith

/-- Razlaga (premisli): BG in CF (diagonali ploskve BCGF) sta sekajoči, sekata se v središču (1, ½, ½).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#bg-cf
besedilo: »Obe sta diagonali stranske ploskve $BCGF$, torej ležita v isti ravnini in se sekata« -/
theorem BG_CF : sekajoci (premica kB kG) (premica kC kF) := by
  refine ⟨⟨(1, 0, 0), 1, by simp [Prod.ext_iff], lezi _ _ _ _ (by norm_num [ravnina, sk, kB])
    (by norm_num [ravnina, sk, kG]), lezi _ _ _ _ (by norm_num [ravnina, sk, kC])
    (by norm_num [ravnina, sk, kF])⟩, (1, 1 / 2, 1 / 2), ⟨⟨1 / 2, ?_⟩, ⟨1 / 2, ?_⟩⟩, ?_⟩
  · razvij; norm_num
  · razvij; norm_num
  · rintro Y ⟨⟨t, rfl⟩, ⟨s, hs⟩⟩
    razvij
    obtain ⟨h1, h2, h3⟩ := hs
    refine ⟨by linarith, by linarith, by linarith⟩

/-- Razlaga (premisli): DC in BF nimata skupne točke in ne ležita v isti ravnini (mimobežni).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#dc-bf
besedilo: »Pri $DC$ in $BF$ pa je križanje na risbi le videz, ker ne ležita v isti ravnini.« -/
theorem DC_BF : mimobezni (premica kD kC) (premica kB kF) := by
  refine ⟨fun h => ?_, ?_⟩
  · obtain ⟨⟨n1, n2, n3⟩, c, hn, h1, h2, h3, h4⟩ := stiri_tocke h
    razvij
    exact hn (nic (by linarith) (by linarith) (by linarith))
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ ⟨s, hs⟩
    razvij
    obtain ⟨h1, h2, h3⟩ := hs
    linarith

/-! ## Primer 1 in Preveri se (1), (4) -/

/-- Primer 1 (1): EH in HG sta sekajoči (skupna točka H).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#eh-hg
besedilo: »$EH$ in $HG$ imata skupno točko $H$: sekajoči.« -/
theorem EH_HG : sekajoci (premica kE kH) (premica kH kG) := by
  refine ⟨⟨(0, 0, 1), 1, by simp [Prod.ext_iff], lezi _ _ _ _ (by norm_num [ravnina, sk, kE])
    (by norm_num [ravnina, sk, kH]), lezi _ _ _ _ (by norm_num [ravnina, sk, kH])
    (by norm_num [ravnina, sk, kG])⟩, kH, ⟨desno _ _, levo _ _⟩, ?_⟩
  rintro Y ⟨⟨t, rfl⟩, ⟨s, hs⟩⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  refine ⟨by linarith, by linarith, by linarith⟩

/-- Vzporednost dveh premic iz ravnine n·X = c skozi vse štiri točke in iz tega, da nimata skupne
točke.
pomozno – orodje: vzporednost iz skupne ravnine in disjunktnosti, lekcija ga ne izreče kot trditev -/
theorem vzporedni_iz {P Q R S n : V3} {c : ℝ} (hn : n ≠ 0) (hP : P ∈ ravnina n c) (hQ : Q ∈ ravnina n c)
    (hR : R ∈ ravnina n c) (hS : S ∈ ravnina n c) (hd : Disjoint (premica P Q) (premica R S)) :
    vzporedni (premica P Q) (premica R S) :=
  ⟨⟨n, c, hn, lezi P Q n c hP hQ, lezi R S n c hR hS⟩, Or.inl hd⟩

/-- Predpostavke trditve `vzporedni_iz` se dajo izpolniti (`AB_DC`). -/
example : ∃ n : V3, ∃ c : ℝ, n ≠ 0 ∧ kA ∈ ravnina n c ∧ kB ∈ ravnina n c ∧ kD ∈ ravnina n c ∧
    kC ∈ ravnina n c ∧ Disjoint (premica kA kB) (premica kD kC) := by
  refine ⟨(0, 0, 1), 0, by simp [Prod.ext_iff], by norm_num [ravnina, sk, kA], by norm_num [ravnina, sk, kB],
    by norm_num [ravnina, sk, kD], by norm_num [ravnina, sk, kC], ?_⟩
  rw [Set.disjoint_left]
  rintro X ⟨t, rfl⟩ ⟨s, hs⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  linarith

/-- Primer 1 (2): EF in DC sta vzporedni (ravnina EFCD: y + z = 1).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ef-dc
besedilo: »$EF$ in $DC$ ležita v ravnini $EFCD$, ki kocko prereže poševno, in nimata skupne točke: vzporedni.« -/
theorem EF_DC : vzporedni (premica kE kF) (premica kD kC) := by
  refine vzporedni_iz (n := (0, 1, 1)) (c := 1) (by simp [Prod.ext_iff]) (by norm_num [ravnina, sk, kE])
    (by norm_num [ravnina, sk, kF]) (by norm_num [ravnina, sk, kD]) (by norm_num [ravnina, sk, kC]) ?_
  rw [Set.disjoint_left]
  rintro X ⟨t, rfl⟩ ⟨s, hs⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  linarith

/-- Primer 1 (3): BF in DH sta vzporedni (ravnina BDHF: x + y = 1).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#bf-dh
besedilo: »$BF$ in $DH$ sta navpična robova, ležita v ravnini $BDHF$: vzporedni.« -/
theorem BF_DH : vzporedni (premica kB kF) (premica kD kH) := by
  refine vzporedni_iz (n := (1, 1, 0)) (c := 1) (by simp [Prod.ext_iff]) (by norm_num [ravnina, sk, kB])
    (by norm_num [ravnina, sk, kF]) (by norm_num [ravnina, sk, kD]) (by norm_num [ravnina, sk, kH]) ?_
  rw [Set.disjoint_left]
  rintro X ⟨t, rfl⟩ ⟨s, hs⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  linarith

/-- Primer 1 (4): AD in FG sta vzporedni (ravnina ADGF: x − z = 0).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ad-fg
besedilo: »$AD$ in $FG$ ležita v ravnini $ADGF$ in kažeta v isto smer: vzporedni.« -/
theorem AD_FG : vzporedni (premica kA kD) (premica kF kG) := by
  refine vzporedni_iz (n := (1, 0, -1)) (c := 0) (by simp [Prod.ext_iff]) (by norm_num [ravnina, sk, kA])
    (by norm_num [ravnina, sk, kD]) (by norm_num [ravnina, sk, kF]) (by norm_num [ravnina, sk, kG]) ?_
  rw [Set.disjoint_left]
  rintro X ⟨t, rfl⟩ ⟨s, hs⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  linarith

/-- Primer 1 (5): EF in CG sta mimobežni.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ef-cg
besedilo: »Skupne točke nimata, v nobeni ravnini nista skupaj: mimobežni.« -/
theorem EF_CG : mimobezni (premica kE kF) (premica kC kG) := by
  refine ⟨fun h => ?_, ?_⟩
  · obtain ⟨⟨n1, n2, n3⟩, c, hn, h1, h2, h3, h4⟩ := stiri_tocke h
    razvij
    exact hn (nic (by linarith) (by linarith) (by linarith))
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ ⟨s, hs⟩
    razvij
    obtain ⟨h1, h2, h3⟩ := hs
    linarith

/-- Preveri se (1): EF in HG sta vzporedni (ploskev EFGH).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ef-hg
besedilo: »Ležita v ploskvi $EFGH$ in nimata skupne točke: vzporedna.« -/
theorem EF_HG : vzporedni (premica kE kF) (premica kH kG) := by
  refine vzporedni_iz (n := (0, 0, 1)) (c := 1) (by simp [Prod.ext_iff]) (by norm_num [ravnina, sk, kE])
    (by norm_num [ravnina, sk, kF]) (by norm_num [ravnina, sk, kH]) (by norm_num [ravnina, sk, kG]) ?_
  rw [Set.disjoint_left]
  rintro X ⟨t, rfl⟩ ⟨s, hs⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  linarith

/-- Preveri se (1): AE in CG sta vzporedni (ravnina ACGE: x − y = 0).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ae-cg
besedilo: »Oba sta navpična in ležita v ravnini $ACGE$: vzporedna.« -/
theorem AE_CG : vzporedni (premica kA kE) (premica kC kG) := by
  refine vzporedni_iz (n := (1, -1, 0)) (c := 0) (by simp [Prod.ext_iff]) (by norm_num [ravnina, sk, kA])
    (by norm_num [ravnina, sk, kE]) (by norm_num [ravnina, sk, kC]) (by norm_num [ravnina, sk, kG]) ?_
  rw [Set.disjoint_left]
  rintro X ⟨t, rfl⟩ ⟨s, hs⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  linarith

/-- Preveri se (4): BC in EH sta vzporedni (ravnina BCHE: x + z = 1), koraka (1) in (2) sta pravilna.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#bc-eh
besedilo: »Pri $BC$ in $EH$ je ravnina $BCHE$, zato sta vzporedna.« -/
theorem BC_EH : vzporedni (premica kB kC) (premica kE kH) := by
  refine vzporedni_iz (n := (1, 0, 1)) (c := 1) (by simp [Prod.ext_iff]) (by norm_num [ravnina, sk, kB])
    (by norm_num [ravnina, sk, kC]) (by norm_num [ravnina, sk, kE]) (by norm_num [ravnina, sk, kH]) ?_
  rw [Set.disjoint_left]
  rintro X ⟨t, rfl⟩ ⟨s, hs⟩
  razvij
  obtain ⟨h1, h2, h3⟩ := hs
  linarith

/-- Preveri se (4): AB in FG nimata skupne točke (korak 3 je pravilen), a sta mimobežni, ne vzporedni
(korak 4 je napačen).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ab-fg
besedilo: »$AB$ in $FG$ nimata skupne točke in ne ležita v isti ravnini, zato sta mimobežna.« -/
theorem AB_FG : mimobezni (premica kA kB) (premica kF kG) ∧ ¬ vzporedni (premica kA kB) (premica kF kG) := by
  have m : mimobezni (premica kA kB) (premica kF kG) := by
    refine ⟨fun h => ?_, ?_⟩
    · obtain ⟨⟨n1, n2, n3⟩, c, hn, h1, h2, h3, h4⟩ := stiri_tocke h
      razvij
      exact hn (nic (by linarith) (by linarith) (by linarith))
    · rw [Set.disjoint_left]
      rintro X ⟨t, rfl⟩ ⟨s, hs⟩
      razvij
      obtain ⟨h1, h2, h3⟩ := hs
      linarith
  exact ⟨m, fun h => m.1 h.1⟩

/-! ## Točka, premica in ravnina; dve ravnini -/

/-- Razlaga: E leži v ravnini EFGH (z = 1), A ne.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#e-a
besedilo: »Točka $E$ leži v ravnini $EFGH$, točka $A$ pa ne.« -/
theorem E_A : kE ∈ ravnina (0, 0, 1) 1 ∧ kA ∉ ravnina (0, 0, 1) 1 := by
  constructor <;> norm_num [ravnina, sk, kE, kA]

/-- Razlaga (premica in ravnina): EF leži v EFGH, EF je vzporedna z ABCD (z = 0), AE prebada ABCD
natanko v točki A.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#premica-ravnina-kocka
besedilo: »$AE$ prebada $ABCD$ v točki $A$« -/
theorem premica_ravnina_kocka :
    premica kE kF ⊆ ravnina (0, 0, 1) 1 ∧ Disjoint (premica kE kF) (ravnina (0, 0, 1) 0) ∧
    ∀ X, X ∈ premica kA kE ∧ X ∈ ravnina (0, 0, 1) 0 ↔ X = kA := by
  refine ⟨lezi _ _ _ _ (by norm_num [ravnina, sk, kE]) (by norm_num [ravnina, sk, kF]), ?_, fun X => ?_⟩
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ hX
    razvij
    linarith
  · constructor
    · rintro ⟨⟨t, rfl⟩, hX⟩
      razvij
      refine ⟨by linarith, by linarith, by linarith⟩
    · rintro rfl
      exact ⟨levo _ _, by norm_num [ravnina, sk, kA]⟩

/-- Razlaga (dve ravnini): ABCD (z = 0) in EFGH (z = 1) sta vzporedni (nimata skupne točke); ABCD in BCGF
(x = 1) se sekata v presečnici BC.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#dve-ravnini
besedilo: »Ravnini $ABCD$ in $EFGH$ sta vzporedni, ravnini $ABCD$ in $BCGF$ se sekata v premici $BC$.« -/
theorem dve_ravnini :
    Disjoint (ravnina (0, 0, 1) 0) (ravnina (0, 0, 1) 1) ∧
    ravnina (0, 0, 1) 0 ∩ ravnina (1, 0, 0) 1 = premica kB kC := by
  refine ⟨?_, ?_⟩
  · rw [Set.disjoint_left]
    intro X h1 h2
    razvij
    linarith
  · ext ⟨x, y, z⟩
    simp only [Set.mem_inter_iff]
    constructor
    · rintro ⟨h1, h2⟩
      refine ⟨y, ?_⟩
      razvij
      refine ⟨by linarith, by linarith, by linarith⟩
    · rintro ⟨t, ht⟩
      razvij
      obtain ⟨h1, h2, h3⟩ := ht
      constructor <;> linarith

/-- Preveri se (5): skozi A, B, C kocke gre ena sama ravnina (z = 0): vsaka ravnina skozi A, B, C je
ravnina z = 0; G v njej ne leži (četrta točka ne leži nujno v ravnini prvih treh).
pomozno – kviz 5: razlaga (~) govori le o nogah trinožnika, splošno pravilo o treh točkah pa izrek dokaže le za A, B, C kocke -/
theorem tri_tocke (n : V3) (c : ℝ) (hn : n ≠ 0) (hA : kA ∈ ravnina n c) (hB : kB ∈ ravnina n c)
    (hC : kC ∈ ravnina n c) : ravnina n c = ravnina (0, 0, 1) 0 ∧ kG ∉ ravnina n c := by
  obtain ⟨n1, n2, n3⟩ := n
  simp only [ravnina, sk, kA, kB, kC, Set.mem_ofPred_eq] at hA hB hC
  have e1 : n1 = 0 := by linarith
  have e2 : n2 = 0 := by linarith
  have e3 : n3 ≠ 0 := fun h => hn (nic e1 e2 h)
  have ec : c = 0 := by linarith
  subst e1 e2 ec
  refine ⟨?_, ?_⟩
  · ext ⟨x, y, z⟩
    simp only [ravnina, sk, Set.mem_ofPred_eq]
    constructor
    · intro h
      have : n3 * z = 0 := by linarith
      rcases mul_eq_zero.mp this with h' | h'
      · exact absurd h' e3
      · rw [h']; ring
    · intro h
      have : z = 0 := by linarith
      rw [this]; ring
  · intro h
    simp only [ravnina, sk, kG, Set.mem_ofPred_eq] at h
    exact e3 (by linarith)

/-- Predpostavke trditve `tri_tocke` se dajo izpolniti (n = (0, 0, 1), c = 0). -/
example : ((0:ℝ), (0:ℝ), (1:ℝ)) ≠ 0 ∧ kA ∈ ravnina (0, 0, 1) 0 ∧ kB ∈ ravnina (0, 0, 1) 0 ∧
    kC ∈ ravnina (0, 0, 1) 0 := by
  refine ⟨by simp [Prod.ext_iff], ?_, ?_, ?_⟩ <;> norm_num [ravnina, sk, kA, kB, kC]

/-- Pogoste napake (zadnja): skozi tri točke na eni premici (A, B in razpolovišče AB) gre neskončno
ravnin: ravnine y = k·z jih vse vsebujejo in so za različne k različne.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#kolinearne
besedilo: »Skozi tri točke na eni premici gre neskončno ravnin.« -/
theorem kolinearne (k k' : ℝ) :
    (kA ∈ ravnina (0, 1, -k) 0 ∧ kB ∈ ravnina (0, 1, -k) 0 ∧ ((1:ℝ) / 2, (0:ℝ), (0:ℝ)) ∈ ravnina (0, 1, -k) 0) ∧
    (k ≠ k' → ravnina (0, 1, -k) 0 ≠ ravnina (0, 1, -k') 0) := by
  refine ⟨⟨by norm_num [ravnina, sk, kA], by norm_num [ravnina, sk, kB], by norm_num [ravnina, sk]⟩, ?_⟩
  intro hk h
  have hm : ((0:ℝ), k, (1:ℝ)) ∈ ravnina (0, 1, -k) 0 := by norm_num [ravnina, sk]
  rw [h] at hm
  simp only [ravnina, sk, Set.mem_ofPred_eq] at hm
  exact hk (by linarith)

/-! ## Pravokotnost -/

/-- Druga mamljiva zamisel, Pogoste napake (druga): AF je pravokotna na AD, a ne na AB: z AB oklepa 45°,
zato ni pravokotna na tla; AE je pravokotna na AB in AD.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#af-ni-pravokotna
besedilo: »Ne: z robom $AB$ oklepa kot $45^\circ$, torej je nagnjena.« -/
theorem AF_ni_pravokotna :
    sk (kF - kA) (kD - kA) = 0 ∧ sk (kF - kA) (kB - kA) = 1 ∧
    arccos (sk (kF - kA) (kB - kA) / (√(sk (kF - kA) (kF - kA)) * √(sk (kB - kA) (kB - kA)))) * 180 / π
      = 45 ∧ sk (kE - kA) (kB - kA) = 0 ∧ sk (kE - kA) (kD - kA) = 0 := by
  refine ⟨by norm_num [sk, kF, kA, kD], by norm_num [sk, kF, kA, kB], ?_, by norm_num [sk, kE, kA, kB],
    by norm_num [sk, kE, kA, kD]⟩
  have e : sk (kF - kA) (kB - kA) / (√(sk (kF - kA) (kF - kA)) * √(sk (kB - kA) (kB - kA))) = √2 / 2 := by
    norm_num [sk, kF, kA, kB]
    field_simp
    rw [Real.sq_sqrt (by norm_num)]
  rw [e, ← cos_pi_div_four, arccos_cos (by linarith [pi_pos]) (by linarith [pi_pos])]
  field_simp; ring

/-- Razlaga (pravilo, premisli): smer d je pravokotna na AB in AD natanko tedaj, ko je navpična (d = l·AE):
dve pravokotnici določita smer; pri eni sami (AD) ostane več smeri, npr. navpična AE in nagnjena AF.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#dve-dolocita
besedilo: »Druga pravokotna premica v drugi smeri to vrtenje ustavi, zato ostane le ena lega.« -/
theorem dve_dolocita (d : V3) :
    (sk d (kB - kA) = 0 ∧ sk d (kD - kA) = 0 ↔ ∃ l : ℝ, d = l • (kE - kA)) ∧
    sk (kE - kA) (kD - kA) = 0 ∧ sk (kF - kA) (kD - kA) = 0 ∧ sk (kF - kA) (kB - kA) ≠ 0 := by
  obtain ⟨d1, d2, d3⟩ := d
  refine ⟨⟨fun ⟨h1, h2⟩ => ⟨d3, ?_⟩, ?_⟩, by norm_num [sk, kE, kA, kD], by norm_num [sk, kF, kA, kD],
    by norm_num [sk, kF, kA, kB]⟩
  · razvij
    refine ⟨by linarith, by linarith, by ring⟩
  · rintro ⟨l, h⟩
    razvij
    obtain ⟨h1, h2, h3⟩ := h
    subst h1 h2
    constructor <;> ring

/-- Razlaga (pravilo za tla): rob AE je pravokoten na vsako premico tal ABCD skozi prebodišče A (na vsako
smer X − A z X v tleh).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#ae-na-tla
besedilo: »Rob $AE$ je pravokoten na $AB$ in na $AD$, zato je pravokoten na ravnino $ABCD$.« -/
theorem AE_na_tla (X : V3) (hX : X ∈ ravnina (0, 0, 1) 0) : sk (kE - kA) (X - kA) = 0 := by
  obtain ⟨x, y, z⟩ := X
  razvij
  linarith

/-- Predpostavka trditve `AE_na_tla` se da izpolniti (X = B). -/
example : kB ∈ ravnina (0, 0, 1) 0 := by norm_num [ravnina, sk, kB]

/-- Razlaga (simulacija): nožišče točke G kocke z robom a > 0 na ravnini ABCD je C(a, a, 0), razdalja je a.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#g-na-abcd
besedilo: »Simulacija pokaže nožišče $C$ in razdaljo, enako robu kocke.« -/
theorem G_na_ABCD (a : ℝ) (ha : 0 < a) :
    nozisce (a, a, a) (0, 0, 1) 0 = (a, a, 0) ∧ razdalja (a, a, a) (0, 0, 1) 0 = a := by
  have h : nozisce (a, a, a) (0, 0, 1) 0 = (a, a, 0) := by simp [nozisce, sk]
  exact ⟨h, razdalja_eq h (by simp [sk]; ring) ha.le⟩

/-- Predpostavka trditve `G_na_ABCD` se da izpolniti (a = 1). -/
example : (0:ℝ) < 1 := one_pos

/-! ## Primer 2: telovadnica kot kvader -/

/-- Primer 2 (kvader z robovi a, b, c, a > 0, c > 0; tla z = 0, strop z = c, stena ABFE y = 0): (a) navpična vrv iz
V(p, q, c) je vzporedna z AE, AE je pravokoten na AB in AD, vrv prebada tla natanko v (p, q, 0) in je
pravokotna na vsako smer v tleh; (b) EF je vzporeden s tlemi; (c) AB leži v tleh; (d) strop in tla sta
vzporedna; (e) tla in stena se sekata v AB.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#primer2
besedilo: »Odgovor: vrv prebada tla pravokotno, $EF$ je vzporeden s tlemi, $AB$ leži v tleh, strop in tla sta vzporedna, tla in stena se sekata v $AB$.« -/
theorem primer2 (a b c p q : ℝ) (ha : 0 < a) (hc : 0 < c) :
    ((p, q, (0:ℝ)) - (p, q, c) = (-1 : ℝ) • (((0:ℝ), (0:ℝ), c) - (0, 0, 0)) ∧
      sk (((0:ℝ), (0:ℝ), c) - (0, 0, 0)) ((a, 0, 0) - (0, 0, 0)) = 0 ∧
      sk (((0:ℝ), (0:ℝ), c) - (0, 0, 0)) ((0, b, 0) - (0, 0, 0)) = 0 ∧
      (∀ X, X ∈ premica (p, q, c) (p, q, 0) ∧ X ∈ ravnina (0, 0, 1) 0 ↔ X = (p, q, 0)) ∧
      ∀ X ∈ ravnina (0, 0, 1) 0, ∀ Y ∈ ravnina (0, 0, 1) 0, sk ((p, q, 0) - (p, q, c)) (X - Y) = 0) ∧
    Disjoint (premica (0, 0, c) (a, 0, c)) (ravnina (0, 0, 1) 0) ∧
    premica (0, 0, 0) (a, 0, 0) ⊆ ravnina (0, 0, 1) 0 ∧
    Disjoint (ravnina (0, 0, 1) c) (ravnina (0, 0, 1) 0) ∧
    ravnina (0, 0, 1) 0 ∩ ravnina (0, 1, 0) 0 = premica (0, 0, 0) (a, 0, 0) := by
  have hc' : c ≠ 0 := hc.ne'
  have ha' : a ≠ 0 := ha.ne'
  refine ⟨⟨?_, by simp [sk], by simp [sk], fun X => ⟨?_, ?_⟩, ?_⟩, ?_, ?_, ?_, ?_⟩
  · simp
  · rintro ⟨⟨t, rfl⟩, hX⟩
    razvij
    have ht : t = 1 := by field_simp at hX ⊢; nlinarith
    subst ht
    refine ⟨by ring, by ring, by ring⟩
  · rintro rfl
    exact ⟨desno _ _, by simp [ravnina, sk]⟩
  · rintro ⟨x1, x2, x3⟩ hX ⟨y1, y2, y3⟩ hY
    razvij
    nlinarith
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ hX
    razvij
    exact hc' (by linarith)
  · exact lezi _ _ _ _ (by simp [ravnina, sk]) (by simp [ravnina, sk])
  · rw [Set.disjoint_left]
    intro X h1 h2
    razvij
    exact hc' (by linarith)
  · ext ⟨x, y, z⟩
    simp only [Set.mem_inter_iff]
    constructor
    · rintro ⟨h1, h2⟩
      refine ⟨x / a, ?_⟩
      razvij
      refine ⟨by field_simp; ring, by linarith, by linarith⟩
    · rintro ⟨t, ht⟩
      razvij
      obtain ⟨h1, h2, h3⟩ := ht
      constructor <;> linarith

/-- Predpostavke trditve `primer2` se dajo izpolniti (a = c = 1). -/
example : (0:ℝ) < 1 ∧ (0:ℝ) < 1 := ⟨one_pos, one_pos⟩

/-! ## Primer 3: razdalja oglišča od diagonalne ravnine -/

/-- Primer 3 (kocka z robom 2: A(0,0,0), B(2,0,0), C(2,2,0), D(0,2,0), E(0,0,2), G(2,2,2); ravnina ACGE:
x − y = 0; S(1, 1, 0)): (1) diagonali se sekata v S (razpolovišče obeh) in BS ⊥ AC; (2) navpična premica
skozi S leži v ACGE in je pravokotna na BS; (3) S je nožišče točke B; (4) e = |BD| = √8 = 2√2 ≈ 2,83;
(5) d = |BS| = √2 = e/2 ≈ 1,41.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#primer3
besedilo: »Odgovor: oglišče $B$ je od ravnine prereza oddaljeno približno $1{,}41\,\text{cm}$.« -/
theorem primer3 :
    ((1:ℝ), (1:ℝ), (0:ℝ)) = (0, 0, 0) + (1 / 2 : ℝ) • (((2:ℝ), (2:ℝ), (0:ℝ)) - (0, 0, 0)) ∧
    ((1:ℝ), (1:ℝ), (0:ℝ)) = (2, 0, 0) + (1 / 2 : ℝ) • (((0:ℝ), (2:ℝ), (0:ℝ)) - (2, 0, 0)) ∧
    sk ((1, 1, 0) - (2, 0, 0)) ((2, 2, 0) - (0, 0, 0)) = 0 ∧
    premica (1, 1, 0) (1, 1, 2) ⊆ ravnina (1, -1, 0) 0 ∧ sk ((1, 1, 0) - (2, 0, 0)) ((1, 1, 2) - (1, 1, 0)) = 0 ∧
    (((0:ℝ), (0:ℝ), (0:ℝ)) ∈ ravnina (1, -1, 0) 0 ∧ ((2:ℝ), (2:ℝ), (0:ℝ)) ∈ ravnina (1, -1, 0) 0 ∧
      ((2:ℝ), (2:ℝ), (2:ℝ)) ∈ ravnina (1, -1, 0) 0 ∧ ((0:ℝ), (0:ℝ), (2:ℝ)) ∈ ravnina (1, -1, 0) 0) ∧
    nozisce (2, 0, 0) (1, -1, 0) 0 = (1, 1, 0) ∧
    √(sk ((0, 2, 0) - (2, 0, 0)) ((0, 2, 0) - (2, 0, 0))) = √8 ∧ √(8:ℝ) = 2 * √2 ∧
    |2 * √2 - 2.83| < 0.005 ∧
    razdalja (2, 0, 0) (1, -1, 0) 0 = √2 ∧ √2 = 2 * √2 / 2 ∧ |√2 - 1.41| < 0.005 := by
  have s1 : (1.41421356 : ℝ) < √2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : √2 < (1.41421357 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have hn : nozisce (2, 0, 0) (1, -1, 0) 0 = ((1:ℝ), (1:ℝ), (0:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  refine ⟨by norm_num [Prod.ext_iff], by norm_num [Prod.ext_iff], by norm_num [sk],
    lezi _ _ _ _ (by norm_num [ravnina, sk]) (by norm_num [ravnina, sk]), by norm_num [sk],
    ⟨by norm_num [ravnina, sk], by norm_num [ravnina, sk], by norm_num [ravnina, sk],
      by norm_num [ravnina, sk]⟩, hn, by norm_num [sk], ?_, ?_, ?_, by ring, ?_⟩
  · rw [show (8:ℝ) = 2 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  · rw [abs_lt]; constructor <;> linarith
  · rw [razdalja, hn]
    norm_num [sk]
  · rw [abs_lt]; constructor <;> linarith

/-! ## Primer 4, Korak za korakom, Preveri se (2) -/

/-- Primer 4 (A(0,0,0), B(30,0,0), C(30,18,0), F(30,0,7), G(30,18,7)): nožišče G na tleh je C, razdalja
GC = AE = 7 m; nožišče na steni ABFE (y = 0) je F, razdalja GF = BC = 18 m; GF je vzporeden z BC, ta pa
pravokoten na AB in BF.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#primer4
besedilo: »Rob $GF$: vzporeden je z $BC$, ki je pravokoten na $AB$ in na $BF$. Nožišče je $F$, razdalja je $GF = BC = 18\,\text{m}$.« -/
theorem primer4 :
    nozisce (30, 18, 7) (0, 0, 1) 0 = (30, 18, 0) ∧ razdalja (30, 18, 7) (0, 0, 1) 0 = 7 ∧
    nozisce (30, 18, 7) (0, 1, 0) 0 = (30, 0, 7) ∧ razdalja (30, 18, 7) (0, 1, 0) 0 = 18 ∧
    ((30:ℝ), (0:ℝ), (7:ℝ)) - (30, 18, 7) = (-1 : ℝ) • (((30:ℝ), (18:ℝ), (0:ℝ)) - (30, 0, 0)) ∧
    sk ((30, 18, 0) - (30, 0, 0)) ((30, 0, 0) - (0, 0, 0)) = 0 ∧
    sk ((30, 18, 0) - (30, 0, 0)) ((30, 0, 7) - (30, 0, 0)) = 0 := by
  have h1 : nozisce (30, 18, 7) (0, 0, 1) 0 = ((30:ℝ), (18:ℝ), (0:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  have h2 : nozisce (30, 18, 7) (0, 1, 0) 0 = ((30:ℝ), (0:ℝ), (7:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  exact ⟨h1, razdalja_eq h1 (by norm_num [sk]) (by norm_num), h2,
    razdalja_eq h2 (by norm_num [sk]) (by norm_num), by norm_num [Prod.ext_iff], by norm_num [sk],
    by norm_num [sk]⟩

/-- Korak za korakom (kvader 4 × 3 × 2, H(0, 3, 2)): razdalja do ABCD (z = 0) je 2 (nožišče D), do BCGF
(x = 4) je 4 (nožišče G), do ABFE (y = 0) je 3 (nožišče E); ADHE (x = 0), DCGH (y = 3) in EFGH (z = 2)
vsebujejo H, razdalja je 0.
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#korak-za-korakom
besedilo: »Ravnine $ADHE$, $DCGH$ in $EFGH$ vsebujejo točko $H$, zato je razdalja do njih $0\,\text{cm}$.« -/
theorem korak_za_korakom :
    nozisce (0, 3, 2) (0, 0, 1) 0 = (0, 3, 0) ∧ razdalja (0, 3, 2) (0, 0, 1) 0 = 2 ∧
    nozisce (0, 3, 2) (1, 0, 0) 4 = (4, 3, 2) ∧ razdalja (0, 3, 2) (1, 0, 0) 4 = 4 ∧
    nozisce (0, 3, 2) (0, 1, 0) 0 = (0, 0, 2) ∧ razdalja (0, 3, 2) (0, 1, 0) 0 = 3 ∧
    razdalja (0, 3, 2) (1, 0, 0) 0 = 0 ∧ razdalja (0, 3, 2) (0, 1, 0) 3 = 0 ∧
    razdalja (0, 3, 2) (0, 0, 1) 2 = 0 := by
  have h1 : nozisce (0, 3, 2) (0, 0, 1) 0 = ((0:ℝ), (3:ℝ), (0:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  have h2 : nozisce (0, 3, 2) (1, 0, 0) 4 = ((4:ℝ), (3:ℝ), (2:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  have h3 : nozisce (0, 3, 2) (0, 1, 0) 0 = ((0:ℝ), (0:ℝ), (2:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  have h4 : nozisce (0, 3, 2) (1, 0, 0) 0 = ((0:ℝ), (3:ℝ), (2:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  have h5 : nozisce (0, 3, 2) (0, 1, 0) 3 = ((0:ℝ), (3:ℝ), (2:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  have h6 : nozisce (0, 3, 2) (0, 0, 1) 2 = ((0:ℝ), (3:ℝ), (2:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  exact ⟨h1, razdalja_eq h1 (by norm_num [sk]) (by norm_num), h2,
    razdalja_eq h2 (by norm_num [sk]) (by norm_num), h3, razdalja_eq h3 (by norm_num [sk]) (by norm_num),
    razdalja_eq h4 (by norm_num [sk]) le_rfl, razdalja_eq h5 (by norm_num [sk]) le_rfl,
    razdalja_eq h6 (by norm_num [sk]) le_rfl⟩

/-- Preveri se (2): kocka z robom 5, H(0, 5, 5), ravnina BCGF (x = 5): nožišče je G(5, 5, 5), razdalja 5;
napačni: |HC| = √50 ≈ 7,07 (poševna daljica, daljša), 5/2 = 2,5 ≠ 5 (to je razdalja središča kocke
(2,5; 2,5; 2,5) od BCGF).
trditev: MAT-OS-9/tocke-premice-in-ravnine-v-prostoru#preveri2
besedilo: »Rob $HG$ je pravokoten na ploskev $BCGF$, nožišče je $G$. Razdalja je enaka robu, $5\,\text{cm}$.« -/
theorem preveri2 :
    nozisce (0, 5, 5) (1, 0, 0) 5 = (5, 5, 5) ∧ razdalja (0, 5, 5) (1, 0, 0) 5 = 5 ∧
    sk ((0, 5, 5) - (5, 5, 0)) ((0, 5, 5) - (5, 5, 0)) = 50 ∧ |√(50:ℝ) - 7.07| < 0.005 ∧
    (5:ℝ) < √50 ∧ (5:ℝ) / 2 = 2.5 ∧ razdalja (2.5, 2.5, 2.5) (1, 0, 0) 5 = 2.5 := by
  have h1 : nozisce (0, 5, 5) (1, 0, 0) 5 = ((5:ℝ), (5:ℝ), (5:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  have a1 : (7.065 : ℝ) < √50 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have a2 : √50 < (7.075 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have h2 : nozisce (2.5, 2.5, 2.5) (1, 0, 0) 5 = ((5:ℝ), (2.5:ℝ), (2.5:ℝ)) := by
    norm_num [nozisce, sk, Prod.ext_iff]
  refine ⟨h1, razdalja_eq h1 (by norm_num [sk]) (by norm_num), by norm_num [sk], ?_, by linarith,
    by norm_num, razdalja_eq h2 (by norm_num [sk]) (by norm_num)⟩
  rw [abs_lt]; constructor <;> linarith

end Evklid.Lekcije.MAT_OS_9.TockePremiceInRavnineVProstoru
