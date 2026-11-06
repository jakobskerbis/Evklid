# Pomen interaktivnih črk (j, 6. 11. 2026)

Črka v formuli je klikljiva le, če njen pomen zanesljivo poznamo **iz konteksta**. Raje nič kot napačno:
x₁ v Lagrangevem izreku (kartica »nedoločeni integral«) ni »prva rešitev (ničla)« kvadratne enačbe.

Koda: `public/formula-data.js` (slovar, `validIn`, `definitionsIn`), `public/rich.js` (blok in poved),
`public/formula-info.js` (okno), `public/formula-card.js` (vsebina okna). Testi: `test/crke-kontekst.test.js`
(pomeni), `test/crke-okno.test.js` (okno v brskalniku), `test/pomen-crk.test.js`, `test/formula-card.test.js`.

## 1. Vrstni red virov pomena

1. **Oznake lekcije** (`:::simboli`, `content/lessons/README.md`): kar lekcija našteje, velja v vsej lekciji
   in pri nalogah, namigih in klepetu o odprti temi. Imajo prednost pred vsem drugim.
2. **Definicija v istem besedilu** (kartica, naloga, razdelek lekcije, sporočilo inštruktorja):
   - »Naj bo $x_0 = …$«, »Označimo $…$«, »Vpeljemo/Uvedemo/Vzemimo $X = …$«, »kjer je $D = b^2 - 4ac$« velja
     v **odstavku**; »Za $X = …$« samo v **svoji povedi** (»Za $x = 2a$ je $f(x) = 4a^2$«) → okno »Oznaka iz
     besedila« z zvezo. Samo vrednost ni definicija: desna stran brez ukazov (`\dfrac`, `\circ`, `\,`) in brez
     enot v `\mathrm{…}`/`\text{…}` (tudi gnezdenih) mora imeti črko (»za $\alpha = 60^\circ$«, »za $x = \dfrac13$«,
     »za $g = 10\,\mathrm{\frac{m}{s^2}}$«, »$A = \{2, 4\}$« niso definicije).
   - »kjer je $v$ hitrost, $t$ čas in $s$ pot« (tudi »kjer sta/so«, »pri čemer je«) → ime iz besedila, a le
     samostalniška zveza (»en sam faktor«, »zvezna«, »se izniči«, »ena« niso imena).
   - Zanesljiv pomen slovarja ostane (z enoto in zvezo): ime je isto v obe smeri (»konstanta vzmeti« ⊂
     »prožnostni koeficient (konstanta vzmeti)«), formula ga potrdi (`ctx`, tudi definicija sama: »kjer je
     $D = b^2 - 4ac$«), ali pa je to edini pomen črke v predmetu in besedilo da le zvezo (»Naj bo $v = s/t$«).
     Pomen slovarja, ki velja samo po temi, pa definicija iz besedila izpodrine (»Naj bo $x_1 = …$« pri kvadratni enačbi).
3. **Slovar predmeta** (`FIZ`, `KEM`, `MAT`; NAR = FIZ nato KEM, BIO = KEM), a le, če se kontekst ujema:
   - `ctx`: formula sama pove pomen (a x² + b x + c, b² − 4ac, x₁,₂ = (−b ± √D)/2a, y = k x + n, M = r F, F = k x …);
   - `pov`: kot `ctx`, a za formule v isti povedi (»Premica $y = kx + n$ ima začetno vrednost $n$«);
   - `teme`: tema, sklop, druga stran kartice ali **poved** s formulo vsebuje korensko besedo teme (ne celo
     besedilo razdelka: »vzporedni premici« v drugem zgledu ne naredi n-ja v $m : n$ začetne vrednosti)
     (»kvadratna enačba/funkcija/neenačba«, »premic«, »linearna funkcija«, »krog«, »zaporedj«, »navor«, »vzmet«, »lom« …);
     »kvadratni koren«, »kvadratni centimeter« in »linearna enačba« namenoma ne štejejo; korenske besede, ki
     so lahko sredi druge besede, imajo `\b` (»leč« ni v »vleče«/»daleč«, »krog« ni v »okrog«, »sfer« ni v »atmosfera«);
   - `ne`: v tej temi, povedi ali kjerkoli v besedilu bloka ima črka drug pomen, zato `teme` ne velja (formula `ctx` še vedno);
   - `brez`: formula, kjer črka nima tega pomena (`dx` v integralu ni premer, `e^{…}` ni naboj);
   - `oba`: potrebna sta formula in tema (ploščina S, površina P, prostornina V, višina v, imaginarna enota i).
   - `zan`: formula sama zanesljivo pove pomen, tudi brez teme in pri `oba` (številka z enoto: S = 1,5 m², V = 2,00 L);
   - `samo`: po temi (brez `ctx`) velja le, če se formula ujema z vzorcem (a, b, c so koeficienti v »a = 1«, »a ≠ 0«,
     ne v »x = 2a« ali »f(x) = 4a²«).
4. **Črka z indeksom** (a₂₀, D_f, k_tr) podeduje pomen osnovne črke le, če ga potrdi formula ali je pomen edini
   (v₁ je hitrost); samo po temi ne (a₂₀ v zaporedju ni »vodilni koeficient«). x₁, a_n, s_n imajo v slovarju svoj
   pomen: kjer ta ne velja, ne podedujejo oznake lekcije za x ali a (a_n v polinomu ni »osnova logaritma«).
5. **Sicer črka ni klikljiva.**

Kontekst za `teme` je ime teme in sklopa (ali tema in druga stran kartice) ter poved okoli formule; za `ne`
še celotno besedilo bloka. Viri konteksta po delih aplikacije:

| Del | Predmet | Tema (scope) | Blok |
|---|---|---|---|
| Ponavljanje (kartice) | `subject` kartice | `topic` kartice + druga stran kartice | stran kartice |
| Tema, razlaga, Bistvo | tema | ime teme · sklop | besedilo |
| Naloge, namigi, rešitve | odprta tema / nastavitve | ime teme · sklop (samo v pogledu teme) | besedilo naloge |
| Učbenik (lekcija) | predmet lekcije | ime lekcije · sklop | razdelek |
| Inštruktor (klepet) | predmet pogovora | tema pogovora, če je | sporočilo |
| Formule (list) | predmet lista | – | razdelek z naslovom (npr. »Kvadratna enačba«) |
| Učbenik, fakultetna lekcija | predmet tečaja iz podatkov (`lessonView` → KEM, FIZ …), nikoli »UNI« | ime lekcije · sklop | razdelek |
| Naše izpitne pole | predmet pole | – | besedilo |
| Aplikacija (Expo) | `useTopicFx` | ime teme · sklop | besedilo |

Imena tem v drugih jezikih (npr. hindijščina) se s slovenskimi korenskimi besedami ne ujemajo: tam je
klikljivih črk manj (varna smer).

## 2. Dvoumne črke in njihova pravila

| Črka | Pomen v slovarju | Velja, ko | Ni ta pomen (primeri) |
|---|---|---|---|
| x₁, x₂, x₁,₂ (MAT) | rešitev (ničla) kvadratne enačbe | formula rešitev / Vieta, tema kvadratna enačba/funkcija/neenačba, diskriminanta, Vieta | točke na intervalu (Lagrange, Rolle, Cauchy), člena zaporedja, povprečje, integral, odvod |
| a, b, c (MAT) | koeficienti kvadratne enačbe | a x² (ne a x³, ne log_a), b² − 4ac, −b ± √, Vieta ob x₁/x₂; tema kvadratna | stranice trikotnika, poljubna števila, polosi elipse/hiperbole, y = c/x, zaporedje; b v a x² + b (prosti člen) |
| D (MAT) | diskriminanta | b² − 4ac, √D; tema kvadratna | oglišče D, definicijsko območje |
| k (MAT) | smerni koeficient | y = k x + n; tema premica, linearna funkcija | indeks, celo število (kπ), binomski simbol, zaporedje, lekcija o linearnih enačbah ali sistemih (množitelj ±k) |
| n (MAT) | začetna vrednost | y = k x + n v isti formuli ali povedi (j, pregled 463: ne vsak n v temi) | naravno število, n-ti koren, mnogokotnik, razmerje m : n |
| p, q (MAT) | koordinati temena / središča | (x − p)² + (y − q)² → središče S(p, q); y = a(x − p)² + q, tema teme/temenska oblika → teme | verjetnost, praštevilo, premik grafa f(x − p) + q, stožnice (y² = 2px) |
| r, d (MAT) | polmer, premer | π v formuli ali tema krog/valj/stožec/krogla | `dx`, integral, vsota, limita, kotne funkcije, »okrog«; d kot razdalja (sekanta, tangenta) |
| o, S, P, V, v (MAT) | obseg, ploščina, površina, prostornina, višina | `X =` in geometrijska tema | vsota S, S v stopinjah (vsota kotov), verjetnost P (met kocke), hitrost v |
| e (MAT) | Eulerjevo število | e^…, ln, exp, lim | linearna ekscentričnost (e² = a² − b², ε = e/a) |
| i (MAT) | imaginarna enota | Eulerjeva oblika (e^{iφ}, cos φ ± i sin φ, i² = −1) sama; i², 3 + 4i in tema kompleksna/kvadratna | indeks i, enotski vektor \vec i |
| a_n, a_1, s_n (MAT) | zaporedje | tema zaporedje/vrsta | koeficienti polinoma |
| α, β, γ (MAT) | kot | sin/cos/tan, °, ∠ ali geometrijska tema | »ravnina α«, stopnja tveganja α, parameter, skalar (α f + β g, α, β ∈ ℝ, vektorski prostor), e^{αt}, cos βt, λ = α ± iβ |
| M (FIZ) | navor | M = r F (tudi r · F), tema navor/vzvod/ravnovesje | masa Zemlje ali Sonca (gravitacija), molska masa (KEM ima svoj M) |
| k, x (FIZ) | konstanta vzmeti, raztezek | F = k x (tudi k · x, k × x, k Δx), tema vzmet/prožnost/nihanje | Boltzmannova konstanta, valovno število, lega x |
| n (FIZ) | lomni količnik | n = c₀/c, sin, tema lom/leča/optika | množina snovi (p V = n R T), število nihajev ali meritev, red uklona |
| e (FIZ) | naboj | privzeto | e^{−t/τ} (Eulerjevo število) |
| A (FIZ) | delo | privzeto | amplituda pri nihanju in valovanju; ploščina preseka (torzija, nosilci, $FL/(EA)$) |
| F (FIZ) | sila | privzeto | gorišče pri lečah in zrcalih |
| a (FIZ) | pospešek | F = m a, v = v₀ + a t, a = v²/r, F/m, enota m/s²; tema gibanje, sile, kroženje | razdalja predmeta (leče), rob kvadra, mrežni parameter, ročica (torzija), stranica preseka |
| c (FIZ) | hitrost svetlobe (valovanja) | c = λν, mc², hc; tema svetloba, valovanje, zvok, optika | rob kvadra; c_p ne podeduje; specifična toplota ima svojo različico (Q =, ΔT) |
| t (FIZ, KEM, BIO) | čas / temperatura v °C | °C: T = t + 273, število s °C za = ali ≈; sicer čas (BIO le z enoto časa) | Δt = 300 °C / hitrost je čas |
| E, T (FIZ) | energija, temperatura | privzeto | modul elastičnosti in navor v mehaniki trdnin (torzija, upogib, nosilci) |
| B, G (FIZ) | gostota magnetnega polja, gibalna količina | formula (Φ = B S, G = m v), enota T, tema magnetizem / trki | podpora nosilca, teža G, gravitacijska konstanta, Gibbsova energija ΔG |
| S (FIZ) | ploščina | privzeto | ΔS (entropija) |
| p, n (KEM) | tlak, množina snovi | p privzeto; n z enoto mol, n = m/M, m = n M ali privzeto | proton p⁺, nevtron n⁰, orbitala np², lupina n = 4, n = 10 meritev, n = 0, 1, 2, kromosomi |
| Q (KEM) | reakcijski kvocient / toplota | Q < K, Q = K, Q = [ … ] → kvocient; sicer toplota | – |
| R, S, w (KEM) | plinska konstanta, entropija, masni delež | R T, −ΔH/R; ΔS, T ΔS; w = m/…; ustrezna tema | R_f, R_s, natezna trdnost R_m; substrat [S]; širina vrha w |
| črke iz kemije (BIO) | m, n, c, V, T, t, ΔG | le z enoto ali formulo; oznake z indeksom (K_a, N_A …) ostanejo | p = 0,05 (p-vrednost), Vv (alel), 4n (garnitura), w = W/W_max (fitnes), R = p/q |
| H, F, G, ξ (MAT) | – (ni v slovarju) | samo definicija v besedilu ali oznake lekcije | primitivni funkciji F, G, vmesna točka ξ |
| m, v, s … (FIZ) | masa, hitrost, pot … | privzeto v fiziki | – |

Nov vnos v slovar: če ima črka v predmetu več kot en pogost pomen, mora imeti `ctx` ali `teme` (in po
potrebi `ne`/`brez`); sicer bi bila klikljiva povsod. Pomene piše in pregleduje Opus (CLAUDE.md).

## 3. Okno pomena

- Odpre se ob tapu ali Enter na črki. Tap na črko, tap v oknu in zapiranje okna **ne sprožijo elementa okoli**
  (kartica v Ponavljanju se ne obrne, razdelek se ne odpre, vrstica se ne izbere): `formula-info.js` posluša v
  fazi zajemanja in dotik ustavi. Velja za vse klikljive vsebnike v aplikaciji.
- Okno **ne prekrije formule ali odstavka**, na katerega se nanaša: računalnik pod odstavkom, nad njim, pod/nad
  vrstico ali ob robu; telefon (≤ 640 px) spodnji list nad spodnjim menijem, formula po potrebi zdrsne nad list.
- Zapre se s tapom v prazno (tap se tam konča), ✕, Esc, Nazaj (zapis v zgodovini, `app.js` popstate; menjava
  črke ob odprtem oknu ne doda novega zapisa), drsenjem in obratom zaslona (nova širina; nova višina ne).
  Pravi gumbi, povezave, zavihki (`[role=tab]`) in `[role=link]` zunaj okna delujejo že ob prvem dotiku.
- Tipkovnica: Enter na črki odpre okno in premakne fokus vanj (Tab → ✕), Esc ga zapre in vrne fokus na črko;
  črka ima `aria-controls="fx-pop"`, dokler je okno odprto.
- Aplikacija (Expo, `mobile/src/components/RichText.tsx`): spodnji list v `Modal`, zapre se s tapom v ozadje,
  ✕ in Nazaj (`onRequestClose`).
