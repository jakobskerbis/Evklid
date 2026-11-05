# Predaja: Tipkovnica in kalkulator (stara nit cmsg_011HYzNBAS5HRU1H7PcSE7JtHopbYk45CMvTsf39vfxfFd, 4. 11. 2026)

## Cilj
Evklidova lastna zaslonska tipkovnica povsod (črke kot Gboard) in kalkulator z vsemi funkcijami Casio fx-991CW in TI-84 ali več (»najzmogljivejši na trgu«), nato korak CAS (simbolna algebra kot TI-Nspire CAS / HP Prime / ClassPad). Splet in aplikacija morata biti enaka (j 1. 11.).

## j-jeve odločitve in pravila
- 31. 10.: kalkulator = vse funkcije Casio fx-991CW + TI-84 ali več; ℂ v skupini množic; programiranje POZNEJE, v Pythonu (brez povezave) in preprost slovenski »Algoritem« za mlajše. Nikoli lastniških rešitev (TI-Basic ipd.) – spomin evklid-no-outdated-options.
- 31. 10.: predlogi besed na voljo, privzeto IZKLOPLJENI; tipkovnica privzeto vklopljena, izklop v Nastavitve → Vnos.
- 1. 11. 07:46: SAMO Evklidova tipkovnica povsod; telefonova le za prijavne podatke (e-pošta/geslo ob prijavi, registraciji, pozabljenem geslu). Nikoli dve hkrati. Polja za povezave imajo Prilepi.
- 1. 11.: ABC na dotik kot telefon (Gboard), ostale plasti obdržijo svoj videz.
- 2. 11. 17:32: na tablici čez celo širino (PR #275).
- 2. 11. cmsg_011HYzNBAS5HRU1H7PcSE7Jt5snLF31xVYjJYytDysJSMG / …6xVHYwL7tTxjfqUiNCxAKE: |x| namesto abs(); brez drsnika.
- 3. 11. cmsg_011HYzNBAS5HRU1H7PcSE7JtYTmzbhV7TsvQZBmzjrBsVm / …XRwF2HiuQv5BkPRgzpxKUH: črke po funkciji in animacijah kot Gboard, le pisava in barve Evklidove.
- 4. 11. 09:34 cmsg_011HYzNBAS5HRU1H7PcSE7JtTw2vVCQo5mZXdLeQf9AR9E: dokončaj vse brez omejitve porabe (postavko nad ~300 $ skrči na najpomembnejše), na koncu obvestilo j-ju.

## Narejeno (združeno)
#249 tipkovnica, #253 dvig, #255 ABC kot telefon, #259 samo Evklidova + Prilepi, #275 tablica, #280 |x|/brez drsnika/Gboard (predogled, številke v zgornji vrsti, velika začetnica, dva presledka, poteg po ⌫, samopopravek), #292 drsenje po črkah (glideDecode, seznam 12,7k besed iz vsebin, scripts/glide-besede.js, nastavitev keyboard_glide), #295 sum/prod, Int, frac, rand, randint, Pol, Rec, geometrijska/hipergeometrijska, #305 preizkusi domnev + intervali (public/graph/testcore.js, tools-test.js), regresije 4. st./logistična/sinusna, TVM, tabela vrednosti.

## 4. 11. nadaljevanje (nit cmsg_011HYzNBAS5HRU1H7PcSE7JtGJb1PzbmeMJHTeTJpWuUDm, veja claude/project-thread-2ugf5x)
Narejeno: iskalnik spustnih seznamov z Evklidovo tipkovnico (seznam nad njo), zunanje strani (tipkovnica-strani.js), Pol/Rec v izrazih in v grafu (public/graph/vektor.js), F-test, ANOVA, graf p-ploščine (pChart), Finance: TVM | Amortizacija | Denarni tokovi. Načrt CAS: https://claude.ai/artifact/15ugM9DmxowjTJV5aAZrcc (j odloči začetek, ~170–230 $ v 3 fazah).
#349 (združeno): začetni približek logistične/sinusne (leta kot x, zapis z x₀), modela a·e^{bx} in a+b/x, x̂ (regressionX), statistika 1 spr. s frekvencami in 2 spr. »Reg« (public/graph/tools-stats.js), Fisherjeva F, logične operacije 32 bitov v bazah, matrike sl A / A² / λ (Hessenberg QR).
Še odprto: (a) iz tabele Casio/TI manjka: M+/M−, enota GRA, vnos/izpis °′″, preglednica, zaporedja v načinu graf, »Poskusi« (kocka, kovanec, številska premica, preveri enakost), reševalec razmerij, enotska matrika; (b) matrika 3×3 z decimalkami na 360 px se v kartici malo pomika (potrebno pomanjšanje kot v Formulah); (c) gumbi .chip-row 36 px (globalna odločitev); (d) točka 6; (e) CAS faze (čaka j).

## Odprto delo (po vrsti) in naslednji korak
1. Kalkulator ostanek: ANOVA; amortizacijski načrt, denarni tokovi NPV/IRR; Pol/Rec sredi daljših izrazov (zdaj NaN, deluje samostojno) in v načinu graf; graf porazdelitve z obarvano p-ploščino; začetni približek za logistično/sinusno regresijo; 2-spremenljivčna statistika »Reg« v orodju statistika.
2. Primerjalna tabela Casio/TI v osnutku (/mnt/project-files/evklid/tipkovnica/osnutek.html, artefakt JtXyBj7bUsCy7Fn5J4Eosh) preveri do konca, kaj še manjka (npr. preglednica/spreadsheet, logični operatorji v bazah, °′″, GRA, M+/M−).
3. Korak CAS (simbolno: poenostavi, razstavi, razvij, simbolni odvod/integral, reši simbolno) – velik; najprej načrt in obseg.
4. Iskanje v spustnih seznamih (public/dropdown.js) še odpre telefonovo tipkovnico → krši pravilo 1. 11.; seznam se zapre ob dotiku zunaj in se ne postavi nad našo tipkovnico.
5. Strani zunaj glavne aplikacije (placaj, sole, starsi, ucitelj) še niso priklopljene na Evklidovo tipkovnico.
6. Predlogi in drsenje samo sl/en (en ima le kratek seznam).
7. Programiranje v Pythonu: j je rekel »kasneje« – ne začni brez j-ja.
Naslednji korak: točke 1, 4, 5 in načrt za 3 so narejeni; ostane seznam »Še odprto« zgoraj in CAS, ko j odloči.

## Kaj čaka j-ja
- Urejanje Design artefakta tipkovnice https://claude.ai/artifact/XDzoSvbSQdkfiz84Lwt4TD (j ga lahko uredi; spremembe prenesi v aplikacijo, ko reče).
- Nobene odprte kartice.

## PR-ji in veje
Vse združeno; veja claude/project-thread-r1nopi (vsakič znova iz origin/main). Repo je zdaj jakobskerbis/Evklid, seja ga vidi kot jakobskerbis/Evklid (MCP klici z repo »stemmind«). <!-- brand:legacy -->

## Artefakti
Osnutek in tabela Casio/TI: https://claude.ai/artifact/JtXyBj7bUsCy7Fn5J4Eosh · Design tipkovnice: https://claude.ai/artifact/XDzoSvbSQdkfiz84Lwt4TD

## Opomniki in rutine
Nobenih (opomnik za #305 izbrisan).

## Pasti
- `prettyIns`: polja, ki jih bere math.js, potrebujejo `parsed: true` (calc.js, scan.js).
- Pravila tipkovnice za tablico morajo biti NA KONCU tipkovnica.css (sicer jih osnovna povozijo).
- Pomočniki v worktree: test/mobile.test.js /prenesi in /kalkulator vrneta 404 zaradi `.claude` v poti → poženi v kopiji brez pike.
- Objava: workflow render-posodobitev.yml (workflow_dispatch). Pred združitvijo preveri, da ni zadržka zaradi j-jevih testov na Renderju.
- Vsaka sprememba: npm test, preveri-aplikacijo.cjs, 2 pregledovalca; nova besedila v sl.js + vseh 32 ui/*.json.

## Spominske datoteke
MEMORY.md (vrstica KEYBOARD/calculator in vrstica Keyboard), evklid-no-outdated-options.md.

## 4. 11. 11:10 – naloga za naslednici (optimizator: zapri vse »Še odprto« v 1–2 PR-jih, trojni pregled, nato »done« optimizatorju cmsg_011HYzNBAS5HRU1H7PcSE7JtEMiTgSpbZu2iAmVotBg46y; CAS ostane načrt)
Main je na 8052858 (#349). Vedno nova veja iz origin/main. Pred združitvijo preveri v niti optimizatorja, da ni zadržka (j-jevi testi na Renderju).

### PR A – znanstveni način (sci.js, math.js, scicore.js, scisolve.js, tools.js)
1. **GRA (gradi)**: enota kota je zdaj boolean `deg` povsod (math.js compile ctx.deg, scicore.compileLine `deg` + DEG_VAR, scisolve: periodTex, solveOne P = 360/2π, pair `k`, evalComplex `{deg}`, odvod/integral preklopi deg=false, sci.js st.deg + gumbi DEG/RAD v `.sc-angle`, model.js 11×, tools.js 6×). Predlog: dodaj `grad: bool` poleg `deg` (ne spreminjaj pomena `deg`): v math.js `const u = ctx.grad ? Math.PI/200 : deg ? DEG : 1`; TRIG naj vzame u namesto d (sin: Math.sin(x*u), arcsin: Math.asin(x)/u); vozlišče `°` (case "deg"): v*DEG/u; Pol/Rec k = u. V scisolve: P = grad ? 400 : …, periodTex z ^g, izpis kotov z ^{g}; scicore DEG_VAR = 1 v stopinjah, π/180 v rad, 0,9·… pazljivo (200/180) v gradih. Gumb GRA v sci.js, stanje shranjeno. Graf naj ostane DEG/RAD (Casio graf nima GRA) – preveri model.js.
2. **°′″ (DMS)**: vnos 30°15′20″ (parser math.js ima že postfiks `°`; dodaj ′ in ″ kot /60, /3600, tipka na tipkovnici `°′″`), izpis: gumb »°′″« pri rezultatu (kot Casio ⇄), ki pokaže kot v obliki 30°15′20″. Preizkusi v test/tools.test.js.
3. **M+ / M− / MR / MC**: spremenljivka M v st.vars (sci.js; vrstica »Spomin« že kaže spremenljivke), tipke M+ (M = M + zadnji rezultat), M−, MR vstavi M; ostane po ponovnem nalaganju kot ostale spremenljivke.
4. **Enotska matrika**: v orodju Matrike (tools.js ~vrstica 180, gumbi data-op 0–10) dodaj I_n (velikost iz A ali polje n) in morda A^n; M v toolscore.js.
5. **Reševalec razmerij** (Casio »Razmerje« a:b = c:x): novo pod-orodje v Orodja ali v reševalcu; vsaka neznanka na katerem koli mestu.
Nova besedila: sl.js + vseh 32 public/i18n/ui/*.json (prevajalec-agent s ključi v JSON, združi za sidrnim ključem z node skripto); besedilo za učence ne sme vsebovati »model/API/strežnik« (test/besedila.test.js).

### PR B – nova orodja
6. **Preglednica** (Casio Spreadsheet: 5×45 celic, formule =A1+B2, Fill, min/max/mean/sum po stolpcih) – novo orodje v Orodja (tools.js seznam orodij), Evklidova tipkovnica za vnos (pravilo: le naša tipkovnica), stanje v localStorage evklid.tool.sheet; brez vodoravnega drsenja na 360 px (stolpci se stisnejo ali celice v vrsticah).
7. **Zaporedja v načinu graf** (TI seq mode: u(n) = u(n−1)+…, u(nMin)=…; tabela in točke): model.js classify + plot.js; tabela vrednosti že obstaja.
8. **Poskusi** (Casio »Poskusi«: kocka, kovanec, številska premica, preveri enakost/neenakost): kocka/kovanec z N meti in histogramom relativnih frekvenc; »preveri« vrne Drži/Ne drži za vrstico z = ali <.

### Že ugotovljeno, ne ponavljaj
- Matrika 3×3 z decimalkami na 360 px se v kartici malo pomika (`.tl-mx-res` overflow-x auto); rešitev: pomanjšanje kot v Formulah (do 78 %).
- Gumbi `.chip-row` 36 px – globalna odločitev, ne v teh PR.
- Pregledovalca: 2 ločena agenta (delovanje; videz 360×740 in 1280×800, svetlo/temno, sl + ar, jezik prek `?lang=` in `?theme=`), testni strežnik na svojem vratu z izmetnim EVKLID_DB.

## 4. 11. 11:17 – j je izbral CAS samo 1. fazo (poenostavi, razvij, razstavi, ~60–80 $); 2. in 3. faza čakata j po 1. fazi. Naslednica prek koordinatorja.

### 4. 11. 11:45 – PR A združen (#359)
GRA, °′″ (vnos in izpis, tipka °′″), spomin M+/M−/MR/MC (2nd ( ) Ans in »⋯« Spomin), Iₙ in Aⁿ v Matrikah, sorazmerje a : b = c : d v Orodja → Enačbe. Kotne funkcije točne na pravih kotih. Odprto: kompleksna števila v GRA/DEG so v radianih (kot prej v DEG); sin(100)+i. PR B (preglednica, zaporedja v grafu, poskusi) še ni narejen.

## 4. 11. 12:15 – CAS 1. faza ZDRUŽENA (#361, nit cmsg_011HYzNBAS5HRU1H7PcSE7Jt1fQ57TjYAbLQHpmK2oJiHs)
Jedro public/graph/cas.js (NSD, razcep nad ℚ, ulomki s pogoji, »Izrazi črko« linearne/kvadratne), preverjanje s števili v 20 točkah, testi test/cas.test.js. Ukazi poenostavi/razvij/razstavi/reši (+ angleško). Ostane: pogoj »pod korenom ≥ 0«, x²+ax+a²=0 pri a=0, produkt dveh kubičnih faktorjev, casIrrational besedilo pri ° v RAD, rešitve niso urejene. Faza 2 (integral, limite, Taylor) in 3 (identitete, koreni, matrike s črkami) čakata j-ja.

## CAS 2. faza (4 Nov 2026, PR #382 merged)
- public/graph/calculus.js: runCalc/CALC_OPS for `integriraj(f; x)`, `limita(f; x; a)`, `taylor(f; x; a; n)` (English integrate/limit/lim/taylor also parsed). Hooked in cas.js runCas; result kind "cas" in sci.js.
- Every result is checked numerically; analysis always in radians (note sc.cas.radians in DEG/GRA).
- Keyboard f(x) group »ana«; buttons ∫ dx and Taylor under expressions. Tests test/cas2.test.js.
- Phase 3 (identities, roots, letter matrices) waits for week of 11 Nov.

## Tipkovnica gladkost (nit cmsg_011HYzNBAS5HRU1H7PcSE7JtHjaqnC5kpEnEWCfnm9YvQV, 4. 11. 2026)
- #403 združeno: pritisk ne preračuna vse strani (drsniki samo v tipkovnici, brez body:has/.tk:has), ⇧ na mestu (paintShift), enaka višina vseh plasti (.tk-multi), na dotik stalni pas predlogov v besedilnih poljih. Spomin evklid-tipkovnica-hitrost.
- #412 združeno (4. 11. 15:35): črke/znaki in ⌫ ob pritisku (undoPress za drsenje in različice), dvoklik ⌫ = beseda, troklik = poved (BS_MULTI_MS 350, sentenceBack), povečana črka brez animacije prikaza. Nič odprtega.

## CAS 3. faza (4 Nov 2026, PR #428 merged) – all CAS phases done
- public/graph/casalg.js: roots/powers (generators g^L = b, |b|, rationalisation by adjugate norm), trig identities (s² + c² = 1, DEG/GRA offsets), logs/exponentials; runCas falls back to it when phase 1 says unsupported/irrational.
- public/graph/casmat.js: `det`, `inverz`/`inverse`/`inv` for [[a, b], [c, d]] (comma mode [[a; b]; [c; d]]), ≤ 5×5.
- Verification: deterministic points; where shown conditions hold both sides must exist. Tests test/cas3.test.js.
- Known limits: nested radicals, inverse trig/hyperbolic unsupported; merged radicals may get stricter conditions (√(xy) → x, y ≥ 0); ln(x²) → 2 ln x with x > 0; trig denominators always rationalised.
