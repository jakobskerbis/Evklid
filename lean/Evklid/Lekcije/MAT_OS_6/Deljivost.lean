/-
vir: content/lessons/MAT-OS-6/deljivost.md
sha256: 5e44da3f3b3d17172ca6a5cef0d6ea13ab5d4242ed462e14941afdcf5f0aec34
Model: naravna števila ℕ; »a je deljivo z b« je `b ∣ a`, »ni ostanka« je `a % b = 0` (v Leanu velja enakovrednost
za vsak b, tudi b = 0, kjer je a % 0 = a); »zadnja števka« je `n % 10`, »vsota števk« je `(Nat.digits 10 n).sum`;
sodo je `Even n`. Število z zamazano števko (47*, 3*5, 52*) je 4·100 + 7·10 + d z d < 10 (d je števka).
Stotični kvadrat (Na sliki): število n (1 ≤ n ≤ 100) je v vrsti (n − 1) / 10 + 1 in stolpcu (n − 1) % 10 + 1
(odštevanje v ℕ je pri n ≥ 1 pravo odštevanje).
Povzetek »Obratno ne velja vedno«: dokazano je, da iz deljivosti s 3 ne sledi deljivost z 9 (12) in iz deljivosti z 2
ali s 5 posebej ne deljivost z 10 (4, 5); iz deljivosti z 2 in s 5 hkrati deljivost z 10 sledi (premisli v razlagi 4).
Ni v Leanu: zgodbe (babica, menza, pekarna, krofi, sladkor, jagode) so le okvir računov; simulacija »Pravila
deljivosti v stotičnem kvadratu« in risba mreže (dokazana so pravila o stolpcih in vrstah); »Večkratniki števila 3
tvorijo več takih poševnih črt« je opis slike; razlogi napak (kdo se zmoti in zakaj) so opis.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.Deljivost

/-- Stolpec števila n v stotičnem kvadratu (vrste po deset). -/
def stolpec (n : ℕ) : ℕ := (n - 1) % 10 + 1

/-- Vrsta števila n v stotičnem kvadratu. -/
def vrsta (n : ℕ) : ℕ := (n - 1) / 10 + 1

/-! ## Razlaga 1–2: deljivo, večkratnik, soda in liha števila -/

/-- Razlaga 1 in Povzetek: a je deljivo z b natanko tedaj, ko pri a : b ni ostanka, in natanko tedaj, ko je a
večkratnik števila b (a = b·k).
trditev: MAT-OS-6/deljivost#deljivo
besedilo: »Število je deljivo z $b$, če pri deljenju z $b$ ni ostanka; tako število je večkratnik števila $b$.« -/
theorem deljivo (a b : ℕ) : (b ∣ a ↔ a % b = 0) ∧ (b ∣ a ↔ ∃ k, a = b * k) :=
  ⟨Nat.dvd_iff_mod_eq_zero, Iff.rfl⟩

/-- Razlaga 1: 18 : 6 = 3 brez ostanka, 18 je deljivo s 6 (18 = 6·3); 20 : 6 = 3, ostanek 2, 20 ni deljivo s 6.
trditev: MAT-OS-6/deljivost#razlaga-1
besedilo: »Pri $20 : 6 = 3$ pa ostaneta $2$, zato $20$ ni deljivo s $6$.« -/
theorem razlaga1 : 18 / 6 = 3 ∧ 18 % 6 = 0 ∧ 6 ∣ 18 ∧ 18 = 6 * 3 ∧ 20 / 6 = 3 ∧ 20 % 6 = 2 ∧ ¬ 6 ∣ 20 := by
  decide

/-- Razlaga 1, preizkus: 24 : 6 = 4, 24 je deljivo s 6.
trditev: MAT-OS-6/deljivost#preizkus-1
besedilo: »ne, $24 : 6 = 4$, torej je $24$ deljivo s $6$.« -/
theorem preizkus1 : 24 / 6 = 4 ∧ 24 % 6 = 0 ∧ 6 ∣ 24 := by decide

/-- Razlaga 2: soda števila so deljiva z 2; 8 predmetov da 4 pare, pri 7 eden ostane; 0 je sodo (0 : 2 = 0).
trditev: MAT-OS-6/deljivost#soda
besedilo: »Tudi $0$ je sodo, ker je $0 : 2 = 0$ brez ostanka.« -/
theorem soda (n : ℕ) :
    (Even n ↔ 2 ∣ n) ∧ 8 = 2 * 4 ∧ 7 % 2 = 1 ∧ Even 0 ∧ 0 / 2 = 0 ∧ 0 % 2 = 0 ∧ Even 2 ∧ Even 4 ∧ Even 6 ∧
      Even 8 ∧ Even 10 ∧ ¬ Even 1 ∧ ¬ Even 3 ∧ ¬ Even 5 ∧ ¬ Even 7 ∧ ¬ Even 9 :=
  ⟨even_iff_two_dvd, by decide⟩

/-- Razlaga 2, preizkus: 15 je liho, en predmet ostane brez para (15 = 2·7 + 1).
trditev: MAT-OS-6/deljivost#preizkus-2
besedilo: »liho, en predmet ostane brez para.« -/
theorem preizkus2 : ¬ Even 15 ∧ 15 = 2 * 7 + 1 := by decide

/-- Povzetek: soda števila se končajo na 0, 2, 4, 6, 8, liha na 1, 3, 5, 7, 9.
trditev: MAT-OS-6/deljivost#soda-liha-zadnja
besedilo: »Soda števila so deljiva z $2$ in se končajo na $0, 2, 4, 6, 8$; liha se končajo na $1, 3, 5, 7, 9$.« -/
theorem soda_liha_zadnja (n : ℕ) :
    (Even n ↔ n % 10 = 0 ∨ n % 10 = 2 ∨ n % 10 = 4 ∨ n % 10 = 6 ∨ n % 10 = 8) ∧
      (¬ Even n ↔ n % 10 = 1 ∨ n % 10 = 3 ∨ n % 10 = 5 ∨ n % 10 = 7 ∨ n % 10 = 9) := by
  rw [Nat.even_iff]; omega

/-! ## Razlaga 3–4: deljivost z 10, 5 in 2 -/

/-- Razlaga 3: vsaka desetica, stotica in tisočica je deljiva z 10.
trditev: MAT-OS-6/deljivost#desetice
besedilo: »Vsaka desetica je deljiva z $10$, prav tako vsaka stotica in tisočica.« -/
theorem desetice (k : ℕ) : 10 ∣ 10 * k ∧ 10 ∣ 100 * k ∧ 10 ∣ 1000 * k := by omega

/-- Razlaga 3 in Povzetek: število je deljivo z 10 natanko tedaj, ko se konča na 0.
trditev: MAT-OS-6/deljivost#deljivost-10
besedilo: »Pravilo: število je deljivo z $10$, če se **konča na $0$**.« -/
theorem deljivost_10 (n : ℕ) : 10 ∣ n ↔ n % 10 = 0 := Nat.dvd_iff_mod_eq_zero

/-- Razlaga 3: 4370 = 4000 + 300 + 70 je deljivo z 10; pri 4373 ostanejo 3 enice.
trditev: MAT-OS-6/deljivost#razlaga-3
besedilo: »Število $4\,370 = 4\,000 + 300 + 70$ je zato deljivo z $10$.« -/
theorem razlaga3 : 4370 = 4000 + 300 + 70 ∧ 10 ∣ 4370 ∧ 4373 % 10 = 3 ∧ ¬ 10 ∣ 4373 := by decide

/-- Razlaga 4 in Povzetek: 10 = 2·5, desetice so deljive z 2 in s 5; deljivost z 2 in s 5 je odvisna le od zadnje
števke: z 2 soda zadnja števka, s 5 zadnja števka 0 ali 5.
trditev: MAT-OS-6/deljivost#zadnja-stevka
besedilo: »Z $2$: zadnja števka soda. S $5$: zadnja števka $0$ ali $5$. Z $10$: zadnja števka $0$.« -/
theorem zadnja_stevka (n k : ℕ) :
    10 = 2 * 5 ∧ 2 ∣ 10 * k ∧ 5 ∣ 10 * k ∧ (2 ∣ n ↔ 2 ∣ n % 10) ∧ (5 ∣ n ↔ 5 ∣ n % 10) ∧
      (2 ∣ n ↔ n % 10 = 0 ∨ n % 10 = 2 ∨ n % 10 = 4 ∨ n % 10 = 6 ∨ n % 10 = 8) ∧
      (5 ∣ n ↔ n % 10 = 0 ∨ n % 10 = 5) ∧ (10 ∣ n ↔ n % 10 = 0) := by
  omega

/-- Razlaga 4 (tabela): 570 je deljivo z 10; 265 in 340 s 5; 3478 z 2.
trditev: MAT-OS-6/deljivost#tabela
besedilo: »| $5$ | $0$ ali $5$ | $265$, $340$ |« -/
theorem tabela : 10 ∣ 570 ∧ 5 ∣ 265 ∧ 5 ∣ 340 ∧ 2 ∣ 3478 := by decide

/-- Razlaga 4, preizkus: 575 je deljivo s 5 (konča se na 5), z 10 ne.
trditev: MAT-OS-6/deljivost#preizkus-4
besedilo: »s $5$ da (konča se na $5$), z $10$ ne.« -/
theorem preizkus4 : 575 % 10 = 5 ∧ 5 ∣ 575 ∧ ¬ 10 ∣ 575 := by decide

/-- Razlaga 4, premisli: število, deljivo z 2 in s 5, je deljivo z 10 (in obratno); obema pogojema za zadnjo
števko ustreza le 0.
trditev: MAT-OS-6/deljivost#dva-in-pet
besedilo: »Obema pogojema hkrati ustreza le $0$, to pa je ravno pravilo za $10$.« -/
theorem dva_in_pet (n : ℕ) : (2 ∣ n ∧ 5 ∣ n ↔ 10 ∣ n) ∧
    ∀ d < 10, (2 ∣ d ∧ (d = 0 ∨ d = 5) ↔ d = 0) :=
  ⟨by omega, fun d _ => by omega⟩

example := (dva_in_pet 10).2 0 (by norm_num)

/-! ## Razlaga 5–6: deljivost s 3 in z 9 -/

/-- Razlaga 5 in Povzetek: število je deljivo s 3 natanko tedaj, ko je vsota njegovih števk deljiva s 3.
trditev: MAT-OS-6/deljivost#deljivost-3
besedilo: »Pravilo: število je deljivo s $3$, če je vsota njegovih števk deljiva s $3$.« -/
theorem deljivost_3 (n : ℕ) : 3 ∣ n ↔ 3 ∣ (Nat.digits 10 n).sum := Nat.three_dvd_iff n

/-- Razlaga 6 in Povzetek: število je deljivo z 9 natanko tedaj, ko je vsota njegovih števk deljiva z 9.
trditev: MAT-OS-6/deljivost#deljivost-9
besedilo: »število je deljivo z $9$, če je vsota števk deljiva z $9$.« -/
theorem deljivost_9 (n : ℕ) : 9 ∣ n ↔ 9 ∣ (Nat.digits 10 n).sum := Nat.nine_dvd_iff n

/-- Razlaga 5: 13 in 33 se končata na 3, 13 ni deljivo s 3, 33 je; 1245: 1 + 2 + 4 + 5 = 12, deljivo s 3.
trditev: MAT-OS-6/deljivost#razlaga-5
besedilo: »Primer: pri $1\,245$ je vsota $1 + 2 + 4 + 5 = 12$, $12$ je deljivo s $3$, zato je deljivo tudi $1\,245$.« -/
theorem razlaga5 :
    13 % 10 = 3 ∧ 33 % 10 = 3 ∧ ¬ 3 ∣ 13 ∧ 3 ∣ 33 ∧ (Nat.digits 10 1245).sum = 1 + 2 + 4 + 5 ∧
      1 + 2 + 4 + 5 = 12 ∧ 3 ∣ 12 ∧ 3 ∣ 1245 := by
  refine ⟨by decide, by decide, by decide, by decide, by norm_num, by decide, by decide, by decide⟩

/-- Razlaga 5, preizkus: 72 je deljivo s 3, ker je 7 + 2 = 9 deljivo s 3.
trditev: MAT-OS-6/deljivost#preizkus-5
besedilo: »da, $7 + 2 = 9$, $9$ pa je deljivo s $3$.« -/
theorem preizkus5 : (Nat.digits 10 72).sum = 7 + 2 ∧ 7 + 2 = 9 ∧ 3 ∣ 9 ∧ 3 ∣ 72 := by
  refine ⟨by norm_num, by decide, by decide, by decide⟩

/-- Razlaga 5, premisli: 10 ni deljivo s 3; vsaka desetica pusti pri deljenju s 3 ostanek 1.
trditev: MAT-OS-6/deljivost#desetica-ostanek
besedilo: »Ker $10$ ni deljivo s $3$. Desetice zato niso »varne«: vsaka pri deljenju s $3$ pusti ostanek $1$.« -/
theorem desetica_ostanek : ¬ 3 ∣ 10 ∧ 10 % 3 = 1 := by decide

/-- Razlaga 6 in Zakaj se tega učimo: 7 + 3 + 8 = 18 = 2·9, zato je 738 deljivo z 9; 738 : 9 = 82.
trditev: MAT-OS-6/deljivost#slive
besedilo: »Pri babičinih slivah je $7 + 3 + 8 = 18 = 2 \cdot 9$, zato je $738$ deljivo z $9$.« -/
theorem slive :
    (Nat.digits 10 738).sum = 7 + 3 + 8 ∧ 7 + 3 + 8 = 18 ∧ 18 = 2 * 9 ∧ 9 ∣ 738 ∧ 738 / 9 = 82 ∧ 738 % 9 = 0 := by
  refine ⟨by norm_num, by decide, by decide, by decide, by decide, by decide⟩

/-- Zakaj se tega učimo: v vsak kozarec gre 82 sliv (9·82 = 738).
trditev: MAT-OS-6/deljivost#kozarci
besedilo: »Če si rekel »da«, imaš prav: v vsak kozarec gre $82$ sliv.« -/
theorem kozarci : 9 * 82 = 738 := by decide

/-- Razlaga 6 in Povzetek: vsako število, deljivo z 9, je deljivo tudi s 3 (9 = 3·3).
trditev: MAT-OS-6/deljivost#devet-tri
besedilo: »Vsako število, deljivo z $9$, je deljivo tudi s $3$, ker je $9 = 3 \cdot 3$.« -/
theorem devet_tri (n : ℕ) (h : 9 ∣ n) : 3 ∣ n ∧ 9 = 3 * 3 :=
  ⟨Nat.dvd_trans (by norm_num) h, rfl⟩

example := devet_tri 18 (by norm_num)

/-- Razlaga 6 in Pogoste napake 4: obratno ne velja: 12 je deljivo s 3, z 9 pa ne.
trditev: MAT-OS-6/deljivost#obratno-ne
besedilo: »Obratno ne velja: $12$ je deljivo s $3$, z $9$ pa ne.« -/
theorem obratno_ne : 3 ∣ 12 ∧ ¬ 9 ∣ 12 ∧ ¬ (∀ n : ℕ, 3 ∣ n → 9 ∣ n) := by
  refine ⟨by decide, by decide, fun h => ?_⟩
  have := h 12 (by decide)
  omega

/-- Razlaga 6, preizkus: 1236 ima vsoto števk 12, ki ni deljiva z 9, zato 1236 ni deljivo z 9; s 3 je.
trditev: MAT-OS-6/deljivost#preizkus-6
besedilo: »vsota je $12$, ki ni deljiva z $9$, zato ne. S $3$ pa je deljivo.« -/
theorem preizkus6 : (Nat.digits 10 1236).sum = 12 ∧ ¬ 9 ∣ 12 ∧ ¬ 9 ∣ 1236 ∧ 3 ∣ 1236 := by
  refine ⟨by norm_num, by decide, by decide, by decide⟩

/-- Povzetek: deljivo z 10 pomeni tudi deljivo z 2 in s 5; obratno ne velja vedno: 4 je deljivo z 2 in 5 s 5,
nobeno ni deljivo z 10 (iz 3 pa ne sledi 9, glej `obratno_ne`).
trditev: MAT-OS-6/deljivost#deset-dva-pet
besedilo: »Deljivo z $9$ pomeni tudi deljivo s $3$; deljivo z $10$ pomeni tudi deljivo z $2$ in s $5$. Obratno ne velja vedno.« -/
theorem deset_dva_pet (n : ℕ) (h : 10 ∣ n) : (2 ∣ n ∧ 5 ∣ n) ∧ (2 ∣ 4 ∧ ¬ 10 ∣ 4) ∧ (5 ∣ 5 ∧ ¬ 10 ∣ 5) :=
  ⟨by omega, by decide, by decide⟩

example := deset_dva_pet 4090 (by norm_num)

/-! ## Rešeni primeri -/

/-- Primer 1: 348 (zadnja 8) je deljivo z 2, ne s 5 in ne z 10; 1275 (zadnja 5) s 5, ne z 2 in ne z 10;
4090 (zadnja 0) z 2, s 5 in z 10.
trditev: MAT-OS-6/deljivost#primer-1
besedilo: »Odgovor: jabolka gredo v vrečke po $2$, orehi v vrečke po $5$, lešniki v vrečke po $2$, $5$ ali $10$.« -/
theorem primer1 :
    (348 % 10 = 8 ∧ 2 ∣ 348 ∧ ¬ 5 ∣ 348 ∧ ¬ 10 ∣ 348) ∧ (1275 % 10 = 5 ∧ 5 ∣ 1275 ∧ ¬ 2 ∣ 1275 ∧ ¬ 10 ∣ 1275) ∧
      (4090 % 10 = 0 ∧ 2 ∣ 4090 ∧ 5 ∣ 4090 ∧ 10 ∣ 4090) := by
  decide

/-- Primer 2: 5241 (vsota 12) deljivo s 3, ne z 9; 7326 (vsota 18) s 3 in z 9, 9·814 = 7326; 4805 (vsota 17)
ne s 3 ne z 9.
trditev: MAT-OS-6/deljivost#primer-2
besedilo: »Odgovor: v škatle po $3$ gresta prva in druga serija, v škatle po $9$ samo druga.« -/
theorem primer2 :
    ((Nat.digits 10 5241).sum = 5 + 2 + 4 + 1 ∧ 5 + 2 + 4 + 1 = 12 ∧ 3 ∣ 5241 ∧ ¬ 9 ∣ 5241) ∧
      ((Nat.digits 10 7326).sum = 7 + 3 + 2 + 6 ∧ 7 + 3 + 2 + 6 = 18 ∧ 3 ∣ 7326 ∧ 9 ∣ 7326 ∧ 9 * 814 = 7326 ∧
        7326 / 9 = 814) ∧
      ((Nat.digits 10 4805).sum = 4 + 8 + 0 + 5 ∧ 4 + 8 + 0 + 5 = 17 ∧ ¬ 3 ∣ 4805 ∧ ¬ 9 ∣ 4805) := by
  refine ⟨⟨by norm_num, by decide, by decide, by decide⟩, ⟨by norm_num, by decide, by decide, by decide, by decide,
    by decide⟩, ⟨by norm_num, by decide, by decide, by decide⟩⟩

/-- Primer 3, koraki 1–4: 4 + 7 = 11; večkratniki števila 3 med 11 in 20 so 12, 15, 18; zato je * lahko 1, 4 ali 7
(natanko te števke); od njih je soda samo 4.
trditev: MAT-OS-6/deljivost#primer-3-koraki
besedilo: »Zato je $*$ lahko $1$, $4$ ali $7$, saj $11 + 1 = 12$, $11 + 4 = 15$ in $11 + 7 = 18$.« -/
theorem primer3_koraki :
    4 + 7 = 11 ∧ (Finset.Icc 11 20).filter (3 ∣ ·) = {12, 15, 18} ∧
      (∀ d < 10, 3 ∣ 11 + d ↔ d = 1 ∨ d = 4 ∨ d = 7) ∧ 11 + 1 = 12 ∧ 11 + 4 = 15 ∧ 11 + 7 = 18 ∧
      ¬ Even 1 ∧ Even 4 ∧ ¬ Even 7 := by
  refine ⟨rfl, by decide, by omega, rfl, rfl, rfl, by decide, by decide, by decide⟩

example := primer3_koraki.2.2.1 4 (by norm_num)

/-- Primer 3: število 47* (* števka) je deljivo s 3 in sodo natanko pri * = 4, torej 474; preizkus 3·158 = 474.
trditev: MAT-OS-6/deljivost#primer-3
besedilo: »Odgovor: naročili so $474$ krofov.« -/
theorem primer3 (d : ℕ) (hd : d < 10) : (3 ∣ 4 * 100 + 7 * 10 + d ∧ Even (4 * 100 + 7 * 10 + d)) ↔ d = 4 := by
  rw [Nat.even_iff]; omega

example := primer3 4 (by norm_num)

/-- Primer 3, preizkus: 3·158 = 474, 474 je deljivo s 3.
trditev: MAT-OS-6/deljivost#primer-3-preizkus
besedilo: »Preizkus: $3 \cdot 158 = 474$, torej je $474$ res deljivo s $3$.« -/
theorem primer3_preizkus : 3 * 158 = 474 ∧ 3 ∣ 474 := by decide

/-- Primer 4: 3 + 5 = 8; 18 bi zahtevalo * = 10; število 3*5 je deljivo z 9 natanko pri * = 1; 315 : 9 = 35.
trditev: MAT-OS-6/deljivost#primer-4
besedilo: »$* = 1$, ker je $8 + 1 = 9$. Kock je $315$ in $315 : 9 = 35$, saj je $9 \cdot 35 = 315$.« -/
theorem primer4 (d : ℕ) (hd : d < 10) :
    (9 ∣ 3 * 100 + d * 10 + 5 ↔ d = 1) ∧ 3 + 5 = 8 ∧ 8 + 1 = 9 ∧ 18 - 8 = 10 ∧ 315 / 9 = 35 ∧ 9 * 35 = 315 := by
  refine ⟨by omega, rfl, rfl, rfl, by decide, by decide⟩

example := primer4 1 (by norm_num)

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 25 je deljivo s 5, čeprav 2 + 5 = 7 ni.
trditev: MAT-OS-6/deljivost#napaka-25
besedilo: »Pri teh deliteljih šteje le zadnja števka, ker so desetice že deljive.« -/
theorem napaka25 : 2 + 5 = 7 ∧ ¬ 5 ∣ 7 ∧ 5 ∣ 25 := by decide

/-- Pogoste napake 2 in kviz 3: 1243 se konča na 3, vsota števk 1 + 2 + 4 + 3 = 10 ni deljiva s 3, zato 1243 ni
deljivo s 3.
trditev: MAT-OS-6/deljivost#napaka-1243
besedilo: »Ni: vsota števk je $10$, ta ni deljiva s $3$.« -/
theorem napaka1243 :
    1243 % 10 = 3 ∧ (Nat.digits 10 1243).sum = 1 + 2 + 4 + 3 ∧ 1 + 2 + 4 + 3 = 10 ∧ ¬ 3 ∣ 10 ∧ ¬ 3 ∣ 1243 := by
  refine ⟨by decide, by norm_num, by decide, by decide, by decide⟩

/-- Pogoste napake 3: 45 je deljivo s 5, z 10 pa ne.
trditev: MAT-OS-6/deljivost#napaka-45
besedilo: »$45$ se konča na $5$, zato je deljivo s $5$, z $10$ pa ne.« -/
theorem napaka45 : 45 % 10 = 5 ∧ 5 ∣ 45 ∧ ¬ 10 ∣ 45 := by decide

/-- Pogoste napake 4: vsota 12 je deljiva s 3, z 9 pa ne (iz 9 sledi 3, glej `devet_tri`).
trditev: MAT-OS-6/deljivost#napaka-3-9
besedilo: »Ne velja, $12$ ni deljivo z $9$. Velja le obratno: iz $9$ sledi $3$.« -/
theorem napaka_3_9 : 3 ∣ 12 ∧ ¬ 9 ∣ 12 := by decide

/-- Pogoste napake 5: 0 je sodo, 0 : 2 = 0 brez ostanka.
trditev: MAT-OS-6/deljivost#nic-sodo
besedilo: »Število $0$ je sodo, ker je $0 : 2 = 0$ brez ostanka.« -/
theorem nic_sodo : Even 0 ∧ 0 / 2 = 0 ∧ 0 % 2 = 0 := by decide

/-! ## Drugače: Na sliki (stotični kvadrat) -/

/-- Na sliki: večkratniki števila 10 so v zadnjem stolpcu, števila 5 v petem in zadnjem, soda števila v vsakem
drugem (sodem) stolpcu; v vsakem stolpcu je zadnja števka ista.
trditev: MAT-OS-6/deljivost#stolpci
besedilo: »Večkratniki števila $10$ so vsi v zadnjem stolpcu. Večkratniki števila $5$ so v petem in zadnjem stolpcu.« -/
theorem stolpci (n m : ℕ) (hn : 1 ≤ n) (hm : 1 ≤ m) :
    (10 ∣ n ↔ stolpec n = 10) ∧ (5 ∣ n ↔ stolpec n = 5 ∨ stolpec n = 10) ∧ (2 ∣ n ↔ 2 ∣ stolpec n) ∧
      (stolpec n = stolpec m ↔ n % 10 = m % 10) := by
  unfold stolpec; omega

example := stolpci 25 35 (by norm_num) (by norm_num)

/-- Na sliki: večkratniki števila 9 do 81 se v vsaki naslednji vrsti premaknejo za eno polje v levo; do 90 je pri
vseh vsota števk 9.
trditev: MAT-OS-6/deljivost#devetke
besedilo: »Do $81$ se v vsaki naslednji vrsti premaknejo za eno polje v levo. Do $90$ je pri vseh vsota števk $9$.« -/
theorem devetke :
    (∀ k, 1 ≤ k → k ≤ 8 → vrsta (9 * (k + 1)) = vrsta (9 * k) + 1 ∧ stolpec (9 * (k + 1)) + 1 = stolpec (9 * k)) ∧
      ∀ k, 1 ≤ k → k ≤ 10 → (Nat.digits 10 (9 * k)).sum = 9 := by
  refine ⟨fun k h1 h8 => ?_, fun k h1 h10 => ?_⟩
  · interval_cases k <;> decide
  · interval_cases k <;> norm_num

example := And.intro (devetke.1 1 (by norm_num) (by norm_num)) (devetke.2 10 (by norm_num) (by norm_num))

/-! ## Drugače: Bolj natančno -/

/-- Bolj natančno: 3478 = 3470 + 8; 3470 je večkratnik 10, zato deljiv z 2, s 5 in z 10.
trditev: MAT-OS-6/deljivost#razstavi-3478
besedilo: »Del $3\,470$ je večkratnik števila $10$, zato je deljiv z $2$, s $5$ in z $10$.« -/
theorem razstavi3478 : 3478 = 3470 + 8 ∧ 10 ∣ 3470 ∧ 2 ∣ 3470 ∧ 5 ∣ 3470 := by decide

/-- Bolj natančno: 10, 100, 1000 so za 1 večja od 9, 99, 999, ki so deljiva z 9 in s 3.
trditev: MAT-OS-6/deljivost#devetice
besedilo: »Števila $10$, $100$, $1\,000$ so za $1$ večja od $9$, $99$, $999$, ki so vsa deljiva z $9$ (in s $3$).« -/
theorem devetice :
    10 = 9 + 1 ∧ 100 = 99 + 1 ∧ 1000 = 999 + 1 ∧ 9 ∣ 9 ∧ 9 ∣ 99 ∧ 9 ∣ 999 ∧ 3 ∣ 9 ∧ 3 ∣ 99 ∧ 3 ∣ 999 := by
  decide

/-- Bolj natančno (splošno): trimestno število 100a + 10b + c je del, deljiv z 9, plus vsota števk a + b + c.
trditev: MAT-OS-6/deljivost#razcep-splosno
besedilo: »O deljivosti z $9$ (ali s $3$) zato odloča le vsota števk $3 + 4 + 8 = 15$.« -/
theorem razcep_splosno (a b c : ℕ) :
    100 * a + 10 * b + c = (a * 99 + b * 9) + (a + b + c) ∧ 9 ∣ a * 99 + b * 9 := by
  constructor
  · ring
  · exact Dvd.dvd.add (Dvd.dvd.mul_left (by norm_num) a) (Dvd.dvd.mul_left (by norm_num) b)

/-- Bolj natančno: 348 = 3·100 + 4·10 + 8 = 3·(99 + 1) + 4·(9 + 1) + 8 = 3·99 + 4·9 + (3 + 4 + 8).
trditev: MAT-OS-6/deljivost#razcep-348
besedilo: »= \underbrace{3 \cdot 99 + 4 \cdot 9}_{\text{deljivo z } 9} + \underbrace{(3 + 4 + 8)}_{\text{vsota števk}}« -/
theorem razcep348 : 348 = 3 * 99 + 4 * 9 + (3 + 4 + 8) := by
  calc 348 = 3 * 100 + 4 * 10 + 8 := by norm_num
    _ = 3 * (99 + 1) + 4 * (9 + 1) + 8 := by norm_num
    _ = 3 * 99 + 4 * 9 + (3 + 4 + 8) := by norm_num

/-- Bolj natančno: prvi del 297 + 36 = 333 je deljiv z 9; vsota 3 + 4 + 8 = 15 je deljiva s 3, z 9 ne; zato je
348 deljivo s 3 (348 : 3 = 116), z 9 pa ne.
trditev: MAT-OS-6/deljivost#stevilo-348
besedilo: »Ker je $15$ deljivo s $3$, z $9$ pa ne, je $348$ deljivo s $3$ ($348 : 3 = 116$), z $9$ pa ne.« -/
theorem stevilo348 :
    3 * 99 = 297 ∧ 4 * 9 = 36 ∧ 297 + 36 = 333 ∧ 9 ∣ 333 ∧ 3 + 4 + 8 = 15 ∧ 3 ∣ 15 ∧ ¬ 9 ∣ 15 ∧ 3 ∣ 348 ∧
      348 / 3 = 116 ∧ ¬ 9 ∣ 348 := by
  decide

/-! ## Preveri se -/

/-- Kviz 1: število, ki se konča na 0, je deljivo z 2, s 5 in z 10; napačne trditve: 12 je deljivo s 3, z 9 ne;
0 je sodo; 13 se konča na 3, a ni deljivo s 3.
trditev: MAT-OS-6/deljivost#kviz-1
besedilo: »Če se število konča na $0$, je večkratnik števila $10$, $10$ pa je deljivo z $2$ in s $5$.« -/
theorem kviz1 (n : ℕ) (h : n % 10 = 0) :
    (10 ∣ n ∧ 2 ∣ n ∧ 5 ∣ n) ∧ (3 ∣ 12 ∧ ¬ 9 ∣ 12) ∧ Even 0 ∧ (13 % 10 = 3 ∧ ¬ 3 ∣ 13) :=
  ⟨by omega, by decide, by decide, by decide⟩

example := kviz1 570 (by norm_num)

/-- Kviz 2: število 52* (* števka) je deljivo z 9 natanko pri * = 2 (5 + 2 = 7, do 9 manjkata 2); 9·58 = 522;
napačni: 5 + 2 + 9 = 16 in 5 + 2 + 5 = 12 nista deljivi z 9 (12 je deljivo s 3).
trditev: MAT-OS-6/deljivost#kviz-2
besedilo: »Vsota znanih števk je $5 + 2 = 7$. Do $9$ manjkata $2$, zato je $* = 2$. Preizkus: $9 \cdot 58 = 522$.« -/
theorem kviz2 (d : ℕ) (hd : d < 10) :
    (9 ∣ 5 * 100 + 2 * 10 + d ↔ d = 2) ∧ 5 + 2 = 7 ∧ 9 - 7 = 2 ∧ 9 * 58 = 522 ∧ 5 + 2 + 9 = 16 ∧ ¬ 9 ∣ 16 ∧
      5 + 2 + 5 = 12 ∧ 3 ∣ 12 ∧ ¬ 9 ∣ 12 := by
  refine ⟨by omega, by decide⟩

example := kviz2 2 (by norm_num)

/-- Kviz 3: liho število je lahko deljivo s 3, na primer 15.
trditev: MAT-OS-6/deljivost#kviz-3
besedilo: »Liho število je lahko deljivo s $3$, na primer $15$.« -/
theorem kviz3 : ¬ Even 15 ∧ 3 ∣ 15 := by decide

/-- Kviz 4: 2340 in 2345 sta deljivi s 5, z 10 samo 2340; 2345 ni sodo.
trditev: MAT-OS-6/deljivost#kviz-4
besedilo: »Obe se končata na $0$ ali $5$, zato sta deljivi s $5$. Za $10$ potrebuješ zadnjo števko $0$, kar ima le $2\,340$.« -/
theorem kviz4 : 5 ∣ 2340 ∧ 5 ∣ 2345 ∧ 10 ∣ 2340 ∧ ¬ 10 ∣ 2345 ∧ Even 2340 ∧ ¬ Even 2345 := by decide

/-- Kviz 5: vsota števk 1 + 3 + 5 = 9, 135 je deljivo z 9, 135 : 9 = 15 (vsak gost 15 jagod); 135 : 3 = 45;
liho število 135 je deljivo z 9.
trditev: MAT-OS-6/deljivost#kviz-5
besedilo: »Vsota števk je $1 + 3 + 5 = 9$, zato je $135$ deljivo z $9$: $135 : 9 = 15$.« -/
theorem kviz5 :
    (Nat.digits 10 135).sum = 1 + 3 + 5 ∧ 1 + 3 + 5 = 9 ∧ 9 ∣ 135 ∧ 135 / 9 = 15 ∧ 135 % 9 = 0 ∧ 135 / 3 = 45 ∧
      45 ≠ 15 ∧ ¬ Even 135 := by
  refine ⟨by norm_num, by decide, by decide, by decide, by decide, by decide, by decide, by decide⟩

end Evklid.Lekcije.MAT_OS_6.Deljivost
