/-
vir: content/lessons/MAT-OS-6/zapis-in-urejanje-velikih-stevil.md
sha256: d0f2ca59a14f4f4c85de8a82697c594ac516d895d8c28d5696c2b7fbf6e3ee46
Model: naravna števila ℕ; »število mest« je `(Nat.digits 10 n).length`, števka na mestu 10ᵏ je (n / 10ᵏ) % 10,
razredi so zapis n = a·10⁶ + b·10³ + c. Zaokroževanje na mesto m (m = 10, 100, 1000, …) je
`zaokrozi m n = (n + m/2) / m · m` (polovica navzgor, kot dogovor v lekciji); pravilo »pogledaš eno števko desno« je
dokazano kot enakost z `zaokrozi` za tisočice in stotisočice. »Skoraj devetkrat večje« je 8· < · < 9·.
»Več kot 2 700 let« je dokazano kot 2 700 let po 366 dni < 1 000 000 dni (velja tudi s prestopnimi leti).
Ni v Leanu: branje števil z besedami (»šest milijonov osemdeset tisoč …«) in imena mest/razredov so jezik (dokazani
so zapisi s števkami in razčlenitve na razrede); stari Rimljani (zgodovina); angleški »billion« (jezik; dokazano je
milijarda = 10⁹, bilijon = 10¹²); risba številske premice in simulacija »Mestne vrednosti in zaokroževanje«
(dokazana je lega 23 680 desno od sredine 23 500); analogija z bankovci kot zgodba (dokazani so deseteriški menjalni
koraki); »Zaokroženo število ni napačno« je opis dogovora.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.ZapisInUrejanjeVelikihStevil

/-- Zaokroževanje naravnega števila n na mesto m (m = 10, 100, 1000, …), polovica navzgor. -/
def zaokrozi (m n : ℕ) : ℕ := (n + m / 2) / m * m

/-! ## Zakaj se tega učimo: milijon in milijarda -/

/-- Zakaj se tega učimo: milijon evrov po 1 000 € na dan zadošča za 1 000 dni (manj kot tri leta, 3·365 = 1 095);
milijarda za 1 000 000 dni, kar je več kot 2 700 let (2 700·366 < 1 000 000); milijarda je tisočkrat milijon.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#zapravljanje
besedilo: »Z milijardo evrov in enakim zapravljanjem pa bi zdržal več kot $2\,700$ let.« -/
theorem zapravljanje :
    1000000 / 1000 = 1000 ∧ 1000 < 3 * 365 ∧ 1000000000 / 1000 = 1000000 ∧ 2700 * 366 < 1000000 ∧
      1000000000 = 1000 * 1000000 := by
  norm_num

/-- Zakaj se tega učimo, Razlaga in Povzetek: milijon ima šest ničel, milijarda devet; tisoč tisočev je milijon,
tisoč milijonov je milijarda.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#nicle
besedilo: »Milijon ima šest ničel, milijarda devet; milijarda je tisoč milijonov.« -/
theorem nicle :
    (Nat.digits 10 1000000).count 0 = 6 ∧ (Nat.digits 10 1000000000).count 0 = 9 ∧ 1000 * 1000 = 1000000 ∧
      1000 * 1000000 = 1000000000 ∧ (1000000 : ℕ) = 10 ^ 6 ∧ (1000000000 : ℕ) = 10 ^ 9 := by
  norm_num

/-! ## Razlaga: razredi in mestna vrednost -/

/-- Razlaga (najprej en primer) in Povzetek: 6 080 250 = 6 milijonov + 080 tisoč + 250 (razredi po tri števke);
števke od desne 0, 5, 2, 0, 8, 0, 6.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#razredi
besedilo: »Velika števila pišemo v skupinah po tri števke od desne: $6\,080\,250$.« -/
theorem razredi :
    6080250 = 6 * 10 ^ 6 + 80 * 10 ^ 3 + 250 ∧ 80 = 0 * 100 + 8 * 10 + 0 ∧ 250 = 2 * 100 + 5 * 10 + 0 ∧
      Nat.digits 10 6080250 = [0, 5, 2, 0, 8, 0, 6] := by
  norm_num

/-- Razlaga (mestna vrednost): v 6 080 250 pomeni osmica 80 000, petica 50.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#mestna-vrednost
besedilo: »V številu $6\,080\,250$ pomeni osmica $80\,000$, petica pa le $50$.« -/
theorem mestna_vrednost :
    (6080250 / 10 ^ 4) % 10 = 8 ∧ 8 * 10 ^ 4 = 80000 ∧ (6080250 / 10) % 10 = 5 ∧ 5 * 10 = 50 ∧
      6080250 = 6 * 10 ^ 6 + 0 * 10 ^ 5 + 8 * 10 ^ 4 + 0 * 10 ^ 3 + 2 * 10 ^ 2 + 5 * 10 + 0 := by
  norm_num

/-- Razlaga in Povzetek: vsako mesto je desetkrat vredno toliko kot mesto desno od njega; mesto 10ᵏ⁺¹ je
10·10ᵏ.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#desetkrat
besedilo: »Vsako mesto je desetkrat vredno toliko kot mesto desno od njega. Ničle držijo števke na pravih mestih.« -/
theorem desetkrat (k : ℕ) : 10 ^ (k + 1) = 10 * 10 ^ k := by ring

/-- Razlaga: 6 080 250 in 680 250 se razlikujeta za eno ničlo, prvo število je skoraj devetkrat večje.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#nicla
besedilo: »$6\,080\,250$ in $680\,250$ se razlikujeta samo za eno ničlo, prvo število pa je skoraj devetkrat večje.« -/
theorem nicla :
    8 * 680250 < 6080250 ∧ 6080250 < 9 * 680250 ∧ Nat.digits 10 680250 = [0, 5, 2, 0, 8, 6] := by
  norm_num

/-- Razlaga (premisli): 1 000 000 = 999 999 + 1 je večje za 1; 999 999 ima šest mest, 1 000 000 sedem.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#premisli-milijon
besedilo: »Večji je milijon, in sicer za $1$.« -/
theorem premisli_milijon :
    999999 + 1 = 1000000 ∧ (Nat.digits 10 999999).length = 6 ∧ (Nat.digits 10 1000000).length = 7 := by
  norm_num

/-! ## Razlaga: urejanje -/

/-- Razlaga (urejanje), Povzetek in Pogoste napake 1: število z več mesti je večje.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#vec-mest
besedilo: »Število z več mesti je večje.« -/
theorem vec_mest (n m : ℕ) (h : (Nat.digits 10 n).length < (Nat.digits 10 m).length) : n < m := by
  have hm : m ≠ 0 := by
    rintro rfl; simp at h
  have h1 : n < 10 ^ (Nat.digits 10 n).length := Nat.lt_base_pow_length_digits (by norm_num)
  have h2 : 10 ^ (Nat.digits 10 m).length ≤ 10 * m := Nat.base_pow_length_digits_le 10 m (by norm_num) hm
  have h3 : 10 ^ ((Nat.digits 10 n).length + 1) ≤ 10 ^ (Nat.digits 10 m).length :=
    Nat.pow_le_pow_right (by norm_num) h
  rw [pow_succ] at h3
  omega

example := vec_mest 98900 312500 (by norm_num)

/-- Razlaga (urejanje) in Povzetek: pri enakem začetku p odloči prva različna števka: če je a < b in je ostanek
r manjši od 10ᵏ (s poljuben), je p·10ᵏ⁺¹ + a·10ᵏ + r < p·10ᵏ⁺¹ + b·10ᵏ + s.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#prva-razlicna
besedilo: »Če imata števili enako mest, primerjamo od leve proti desni. Prva števka, ki se razlikuje, odloči.« -/
theorem prva_razlicna (p a b r s k : ℕ) (hab : a < b) (hr : r < 10 ^ k) :
    p * 10 ^ (k + 1) + a * 10 ^ k + r < p * 10 ^ (k + 1) + b * 10 ^ k + s := by
  have : (a + 1) * 10 ^ k ≤ b * 10 ^ k := Nat.mul_le_mul_right _ hab
  nlinarith

example := prva_razlicna 2 5 8 8900 5400 4 (by norm_num) (by norm_num)

/-- Razlaga (urejanje): stanovanji A = 285 400 in B = 258 900 imata šest mest, stotisočici 2, desettisočici 8 > 5,
zato je A dražje.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#stanovanji
besedilo: »Ker je $8 > 5$, je A dražje: $285\,400 > 258\,900$.« -/
theorem stanovanji :
    (Nat.digits 10 285400).length = 6 ∧ (Nat.digits 10 258900).length = 6 ∧ 285400 = 2 * 10 ^ 5 + 8 * 10 ^ 4 + 5400 ∧
      258900 = 2 * 10 ^ 5 + 5 * 10 ^ 4 + 8900 ∧ 8 > 5 ∧ 285400 > 258900 := by
  norm_num

/-! ## Razlaga: zaokroževanje -/

/-- Razlaga (zaokroževanje): 23 680 ≈ 24 000 (na tisočice); 23 680 leži desno od sredine 23 500, bližje 24 000.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#avto
besedilo: »Zapišemo $23\,680 \approx 24\,000$.« -/
theorem avto : zaokrozi 1000 23680 = 24000 ∧ 23500 < 23680 ∧ 24000 - 23680 < 23680 - 23000 := by
  unfold zaokrozi; norm_num

/-- Razlaga (postopek) in Povzetek: pri zaokroževanju na tisočice pogledaš samo števko stotic: 0–4 navzdol, 5–9
navzgor (tisočica + 1), desno same ničle.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#pravilo-tisocice
besedilo: »Zaokroževanje: pogledaš eno števko desno od izbranega mesta; $0$ do $4$ navzdol, $5$ do $9$ navzgor; desno vse ničle.« -/
theorem pravilo_tisocice (n : ℕ) :
    zaokrozi 1000 n = if (n / 100) % 10 < 5 then n / 1000 * 1000 else (n / 1000 + 1) * 1000 := by
  unfold zaokrozi; split_ifs <;> omega

/-- Primer 4 in kviz 4: isto pravilo za stotisočice (odloča števka desettisočic).
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#pravilo-stotisocice
besedilo: »Pri drugem ne gledamo devetic desno, ker odloča samo števka $4$.« -/
theorem pravilo_stotisocice (n : ℕ) :
    zaokrozi 100000 n = if (n / 10000) % 10 < 5 then n / 100000 * 100000 else (n / 100000 + 1) * 100000 := by
  unfold zaokrozi; split_ifs <;> omega

/-- Razlaga (premisli) in Bolj natančno: na 24 000 (tisočice) se zaokrožijo natanko števila od 23 500 do 24 499;
levo od 24 000 je 500 takih števil (23 500 … 23 999), desno 500 (24 000 … 24 499).
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#razmik-24000
besedilo: »Na $24\,000$ se zaokrožijo vsa naravna števila od $23\,500$ do vključno $24\,499$.« -/
theorem razmik24000 (n : ℕ) :
    (zaokrozi 1000 n = 24000 ↔ 23500 ≤ n ∧ n ≤ 24499) ∧ (Finset.Icc 23500 23999).card = 500 ∧
      (Finset.Icc 24000 24499).card = 500 := by
  refine ⟨by unfold zaokrozi; omega, by simp, by simp⟩

/-- Razlaga (premisli): najnižja cena z zaokroženo vrednostjo 24 000 je 23 500, najvišja 24 499 (24 500 da že
25 000).
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#premisli-24000
besedilo: »Najvišja je $24\,499$ €, ker se $24\,500$ zaokroži že na $25\,000$.« -/
theorem premisli24000 :
    IsLeast {n : ℕ | zaokrozi 1000 n = 24000} 23500 ∧ IsGreatest {n : ℕ | zaokrozi 1000 n = 24000} 24499 ∧
      zaokrozi 1000 24500 = 25000 := by
  refine ⟨⟨by unfold zaokrozi; norm_num, fun n hn => ?_⟩, ⟨by unfold zaokrozi; norm_num, fun n hn => ?_⟩,
    by unfold zaokrozi; norm_num⟩ <;>
  · simp only [Set.mem_ofPred_eq] at hn; unfold zaokrozi at hn; omega

/-! ## Rešeni primeri -/

/-- Primer 1 in Pogoste napake 2: pet milijonov dvajset tisoč osem = 5·10⁶ + 020·10³ + 008 = 5 020 008 (ne 5 208,
ne 520 008).
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#primer-1
besedilo: »Vsak razred razen prvega mora imeti tri števke, zato $5\,020\,008$.« -/
theorem primer1 :
    5 * 10 ^ 6 + 20 * 10 ^ 3 + 8 = 5020008 ∧ 20 = 0 * 100 + 2 * 10 + 0 ∧ 8 = 0 * 100 + 0 * 10 + 8 ∧
      5208 ≠ 5020008 ∧ 520008 ≠ 5020008 := by
  norm_num

/-- Primer 2: 98 900 ima pet mest, ostali šest; 321 050 ima desettisočico 2, ostala 1; 312 500 > 312 050 (stotice
5 > 0); naraščajoče 98 900 < 312 050 < 312 500 < 321 050.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#primer-2
besedilo: »Zapis: $98\,900 < 312\,050 < 312\,500 < 321\,050$.« -/
theorem primer2 :
    (Nat.digits 10 98900).length = 5 ∧ (Nat.digits 10 312500).length = 6 ∧ (Nat.digits 10 321050).length = 6 ∧
      (Nat.digits 10 312050).length = 6 ∧ (321050 / 10 ^ 4) % 10 = 2 ∧ (312500 / 10 ^ 4) % 10 = 1 ∧
      (312500 / 100) % 10 = 5 ∧ (312050 / 100) % 10 = 0 ∧ 98900 < 312050 ∧ 312050 < 312500 ∧ 312500 < 321050 := by
  norm_num

/-- Primer 3: na 15 000 (tisočice) se zaokrožijo natanko cene od 14 500 do 15 499; 14 499 ≈ 14 000,
15 500 ≈ 16 000.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#primer-3
besedilo: »Prava cena je lahko od $14\,500$ € do $15\,499$ €.« -/
theorem primer3 (n : ℕ) :
    (zaokrozi 1000 n = 15000 ↔ 14500 ≤ n ∧ n ≤ 15499) ∧ zaokrozi 1000 14499 = 14000 ∧
      zaokrozi 1000 15500 = 16000 := by
  refine ⟨by unfold zaokrozi; omega, by unfold zaokrozi; norm_num, by unfold zaokrozi; norm_num⟩

/-- Primer 4: 2 349 950 ≈ 2 350 000 (tisočice; števka stotic 9, prenos v desettisočice) in ≈ 2 300 000
(stotisočice; števka desettisočic 4).
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#primer-4
besedilo: »Na tisočice $2\,350\,000$ €, na stotisočice $2\,300\,000$ €.« -/
theorem primer4 :
    (2349950 / 1000) % 10 = 9 ∧ (2349950 / 100) % 10 = 9 ∧ zaokrozi 1000 2349950 = 2350000 ∧
      (2349950 / 100000) % 10 = 3 ∧ (2349950 / 10000) % 10 = 4 ∧ zaokrozi 100000 2349950 = 2300000 := by
  unfold zaokrozi; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 98 900 < 312 500, čeprav je 9 > 3 (šestmestno je večje od petmestnega).
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#napaka-prva-stevka
besedilo: »Šestmestno število je vedno večje od petmestnega.« -/
theorem napaka_prva_stevka : 9 > 3 ∧ 98900 < 312500 ∧ ∀ n m : ℕ, (Nat.digits 10 n).length = 5 →
    (Nat.digits 10 m).length = 6 → n < m :=
  ⟨by norm_num, by norm_num, fun n m hn hm => vec_mest n m (by omega)⟩

example := napaka_prva_stevka.2.2 98900 312500 (by norm_num) (by norm_num)

/-- Pogoste napake 3: 14 457 na tisočice je 14 000 (stotice 4); zaokroževanje po korakih (14 460, 14 500, 15 000)
da napačen rezultat.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#napaka-po-korakih
besedilo: »Pravilno je pogledati samo stotice: $4$ pomeni navzdol, torej $14\,000$.« -/
theorem napaka_po_korakih :
    (14457 / 100) % 10 = 4 ∧ zaokrozi 1000 14457 = 14000 ∧ zaokrozi 10 14457 = 14460 ∧ zaokrozi 100 14460 = 14500 ∧
      zaokrozi 1000 14500 = 15000 ∧ (15000 : ℕ) ≠ 14000 := by
  unfold zaokrozi; norm_num

/-- Pogoste napake 4: 199 600 na tisočice je 200 000 (prenos: deset tisočic je desettisočica, deset desettisočic
stotisočica), ne 190 000.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#napaka-prenos
besedilo: »Zato $199\,600 \approx 200\,000$.« -/
theorem napaka_prenos :
    zaokrozi 1000 199600 = 200000 ∧ (199 + 1) * 1000 = 200000 ∧ 10 * 10 ^ 3 = 10 ^ 4 ∧ 10 * 10 ^ 4 = 10 ^ 5 ∧
      (190000 : ℕ) ≠ 200000 := by
  unfold zaokrozi; norm_num

/-! ## Drugače -/

/-- Z analogijo: deset svežnjev da en sveženj večje vrste: 10·1 = 10, 10·10 = 100, 10·100 = 1 000, …,
10·100 000 = 1 000 000; prenos 999 999 + 1 = 1 000 000.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#svezenji
besedilo: »Prav to je prenos pri $999\,999 + 1$ in pri zaokroževanju $199\,600$ navzgor.« -/
theorem svezenji :
    10 * 1 = 10 ∧ 10 * 10 = 100 ∧ 10 * 100 = 1000 ∧ 10 * 1000 = 10000 ∧ 10 * 10000 = 100000 ∧
      10 * 100000 = 1000000 ∧ 999999 + 1 = 1000000 := by
  norm_num

/-- Bolj natančno: tisoč = 10·10·10, milijon = 10⁶, milijarda = 10⁹, bilijon = tisoč milijard = 10¹² (dvanajst ničel).
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#potence
besedilo: »Za milijardo sledi **bilijon** (tisoč milijard, dvanajst ničel).« -/
theorem potence :
    10 * 10 * 10 = 1000 ∧ 10 ^ 6 = 1000000 ∧ 10 ^ 9 = 1000000000 ∧ 1000 * 10 ^ 9 = 10 ^ 12 ∧
      (Nat.digits 10 (10 ^ 12)).count 0 = 12 := by
  norm_num

/-! ## Preveri se -/

/-- Kviz 1: v 245 300 je od desne enice 0, desetice 0, stotice 3, tisočice 5, desettisočice 4; štirica pomeni
40 000 €.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#kviz-1
besedilo: »Od desne: enice $0$, desetice $0$, stotice $3$, tisočice $5$, desettisočice $4$. Štirica pomeni $40\,000$ €.« -/
theorem kviz1 : Nat.digits 10 245300 = [0, 0, 3, 5, 4, 2] ∧ (245300 / 10 ^ 4) % 10 = 4 ∧ 4 * 10 ^ 4 = 40000 := by
  norm_num

/-- Kviz 2: naraščajoče je 97 000 < 99 500 < 105 000 < 120 000; ostale razvrstitve niso resnične.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#kviz-2
besedilo: »Med petmestnima odloči tisočica ($97\,000 < 99\,500$), med šestmestnima desettisočica ($105\,000 < 120\,000$).« -/
theorem kviz2 :
    97000 < 99500 ∧ 99500 < 105000 ∧ 105000 < 120000 ∧ ¬ (105000 < 99500) ∧ ¬ (120000 < 105000) ∧
      ¬ (120000 < 97000) := by
  norm_num

/-- Kviz 3: dopisana ničla: 52 000·10 = 520 000 (desetkrat), ne 52 010 in ne tisočkrat (52 000 000).
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#kviz-3
besedilo: »Vsaka števka se premakne za eno mesto v levo, vsako mesto je desetkrat več vredno, zato je cena desetkrat večja: $520\,000$ €.« -/
theorem kviz3 (n : ℕ) : Nat.ofDigits 10 (0 :: Nat.digits 10 n) = 10 * n ∧ 52000 * 10 = 520000 ∧
    52000 * 10 ≠ 52000 + 10 ∧ 52000 * 10 ≠ 52000 * 1000 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [Nat.ofDigits_cons, Nat.ofDigits_digits]; ring

/-- Kviz 4: 2 649 500 na stotisočice je 2 600 000 (desno je 4); 2 650 000 je na desettisočice, po korakih 2 700 000,
na milijone 3 000 000.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#kviz-4
besedilo: »Števka stotisočic je $6$, desno od nje je $4$. Zaokrožimo navzdol: $2\,600\,000$ €.« -/
theorem kviz4 :
    (2649500 / 100000) % 10 = 6 ∧ (2649500 / 10000) % 10 = 4 ∧ zaokrozi 100000 2649500 = 2600000 ∧
      zaokrozi 10000 2649500 = 2650000 ∧ zaokrozi 100000 2650000 = 2700000 ∧ zaokrozi 1000000 2649500 = 3000000 := by
  unfold zaokrozi; norm_num

/-- Kviz 5: 1 000 000 : 100 = 10 000 bankovcev; 1 000·100 = 100 000, 100 000·100 = 10 000 000, 100·100 = 10 000.
trditev: MAT-OS-6/zapis-in-urejanje-velikih-stevil#kviz-5
besedilo: »$1\,000\,000 : 100 = 10\,000$. Milijonu odvzameš dve ničli, ker ima sto dve ničli.« -/
theorem kviz5 :
    1000000 / 100 = 10000 ∧ 10000 * 100 = 1000000 ∧ 1000 * 100 = 100000 ∧ 100000 * 100 = 10000000 ∧
      100 * 100 = 10000 := by
  norm_num

end Evklid.Lekcije.MAT_OS_6.ZapisInUrejanjeVelikihStevil
