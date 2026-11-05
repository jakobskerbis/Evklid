# STANJE 4. 11. 14:30 UTC (nit cmsg_011HYzNBAS5HRU1H7PcSE7JtTw2vVCQo5mZXdLeQf9AR9E)
Rez j-ja 9.34 KONČAN: vse MAT SŠ (10 novih + 28 dvigov, PR #342, #366) in vse FIZ/KEM OŠ 8./9. (23 novih + 26 dvigov, PR #374, #381, #398) napisane in trikrat pregledane. Seja cost_usd 135,7 $. j 12.18: delo teče do 95 %; nit je ustavila nove pakete (optimizator). queue.json: OS prazen; stare-lekcije-za-pregled.txt brez MAT-SS/FIZ-OS/KEM-OS (39 ostalih). Dodatni paket 16:40 (85 %): PR #424, 17 novih (vse NOVE + FIZ SŠ sile/trenje/temperatura/plinska), seja 162 $. Naslednje: FIZ/KEM SŠ (queue SS, 15 parov) → NAR/BIO → TEK, po resetu 11. 11. Skripta s pool + extra: orodja/lesson-batch-v3.js. Opomnika: jutranji trig_014x4ndsE7J4X3WUfjGWk1d6 (07:40 Ljubljana, vklopljen), paketni trig_01EUav691KhbNAwG9bN99CRW (izklopljen).

# Predaja: Create textbook lessons (new key) — 4. 11. 2026 09:45 UTC (2. predaja)

## Cilj
Šolski učbenik Evklid: lekcije po letvici docs/kakovost.md, trikrat pregledane (pisec → pregledovalec → bralec, samo Opus/Fable, nikoli Sonnet), brez napak videza na telefonu (360 px) in namizju.

## j-jeve odločitve (novejše prej)
- **4. 11. 09:34 (cmsg_011HYzNBAS5HRU1H7PcSE7JtTw2vVCQo5mZXdLeQf9AR9E): »Dokončaj/naredi vse, kar sem ti poslal do zdaj, ne glede na limit, razen stvari, ki bi požrle cel limit; pri teh izberi najpomembnejše. Ko končaš, mi pošlji obvestilo.«** Optimizator (cmsg_011HYzNBAS5HRU1H7PcSE7JtRD8HLfR81B3wJiA5ayzef5, 09:38): rez za to nit = (1) vse manjkajoče MAT SŠ lekcije (pilot matura 15. 11.) + dvig MAT SŠ lekcij pod letvico, (2) nato FIZ/KEM OŠ po vrsti. Proračun ≤ 400 $ od 09:38 (cost_usd seje ob predaji 18,33 $). Paketi ZAPOREDOMA, ne enkrat na dan (≤ 4 težki agenti hkrati; five_hour warning → počakaj na resetsAt). Po vsakem paketu poročilo cost_usd optimizatorju; ko je rez končan, javi optimizatorju in j-ju (obvestilo).
- 4. 11. 06:26: optimalen effort po niti → ta nit `high` (set_effort_level).
- 2. 11.: simulacija na ISTEM koraku kot besedilo, ki jo omenja → narejeno.
- 1. 11.: napake kot »z·z̄ = a²−b²« se ne smejo ponoviti → varovalo narejeno. Oštevilčena točka na istem koraku (#269). Predlogi vsako jutro ob 8.00 Ljubljana kot sporočilo v niti (ne mail); izboljšave pravilnosti/delovanja/porabe brez vprašanja, videz čaka j.
- 31. 10.–1. 11.: vizualni pregled vseh lekcij, formule se zlagajo pri »=« (#250, #251, #254); trojni ponovni pregled starih lekcij.

## Narejeno v tej niti (PR #307, združen 07:19 UTC)
public/lesson-steps.js `demoSteps` + textbook.js `placeDemos` (simulacija na koraku, ki jo omenja; premakne se ob koraku); x̄/z̄ prek KaTeX in `.ovl` (kit.js), test/sim-crta.test.js; 18 barvnih besed v simulacijah usklajenih; server/lesson-identity.js = varovalo (naključna števila v vsako enakost z neznankami, i/j, :::simboli, kviz +, miselni vzorci, formule; check-lesson in check-gradivo javita »enakost ne velja za vse vrednosti«), test/identitete.test.js. 595 enakosti, 0 napak.

## Odprto delo (vrstni red)
1. **MAT SŠ (pilot 15. 11.):** manjkajoče MAT-SS lekcije: queue.json ključ SS (4 MAT-SS: MAT-SS-3/kroznica + elipsa-hiperbola-parabola, MAT-SS-4/statistika + mesane-maturitetne-naloge) in NOVE (6 MAT-SS); preveri še `node scripts/napredek.js` za manjkajoče MAT-SS teme. Dvig: 28 MAT-SS lekcij v /mnt/project-files/evklid/ucbenik/stare-lekcije-za-pregled.txt (93 skupaj). Paketi po 16 (8 parov), s pregledovalcem in bralcem.
2. **FIZ/KEM OŠ** po vrsti (queue OS, nato dvig FIZ/KEM OŠ s seznama starih).
3. Jutranji predlogi ob 8.00 (opomnik spodaj).
4. Opažanje za nit aplikacije (že obveščena 06:50): mobile/ ne prikaže simulacij v lekcijah.

## Postopek paketa (kot prej)
get_session (cost_usd pred, rate_limit_info) → `git checkout -B <veja> origin/main; npm ci` → samodejno shranjevanje v ozadju (zanka 4 min, git add content/lessons content/gradiva, commit, push -f) → Workflow scriptPath = kopija lesson-batch-v2.js, za dvige args `{"extra": "\nThis is an OLDER lesson under full re-review (j: every claim must be right). Besides the bar, check every definition, claim, rule and number already in the text (one `node -e` for all numbers) and fix what is wrong or missing; keep correct text.\n", "items":[{"ids":[a,b],"review":true,"read":true},…]}`; za nove `python3 build-args.py` → args.json → po koncu DVOM vrstice bralcev, check-lesson.js -q, check-gradivo.js -q, simboli.js --brez, preveri-videz-lekcij.cjs --vse --samo <id>, npm test → PR (atribucija), merge (ne med MERGE HOLD optimizatorja), PDF-ji (pdf.cjs, strežnik PORT=3078; kill v SAMOSTOJNEM klicu) → poročilo optimizatorju.

## Orodja
/mnt/project-files/evklid/ucbenik/orodja/: lesson-batch-v2.js, build-args.py (**popravi S na svoj scratchpad, R = /home/user/Evklid**), queue.json (stanje 4. 11. 09:45), pdf.cjs. Skripte v repo: lesson-brief.js [--review|--read], check-lesson.js -q, check-gradivo.js -q, simboli.js --brez, preveri-videz-lekcij.cjs, preveri-aplikacijo.cjs, napredek.js.

## Opomniki (IZKLOPLJENI ob predaji – ustvari znova v novi seji)
- trig_01QSw3ahCh1bXEQAJGdKFfUK »Naslednji paket lekcij« (bil 14:20 UTC dnevno; po novem pravilu le opomnik, paketi tečejo zaporedoma).
- trig_01VCiWy7is4imYpkR9kHyc9L »Učbenik: jutranji predlogi ob 8.00« (enkraten, 07:40 Europe/Ljubljana, vsak dan prestavi).

## Kaj čaka j-ja
Nič.

## PR-ji in veje
Veja claude/project-thread-45lh0w = main 82033c2 (čista). Zadnji PR #307.

## Pasti
- Heredoc z zapletenim besedilom v Bash sproži varnostno zavrnitev (»rm«); daljše skripte piši z Write v scratchpad in jih poženi.
- KaTeX 0.19; public/sirina.js zlaga formule; ne spreminjaj brez test/sirina.test.js.
- `pkill`/kill v istem Bash klicu kot drugi ukazi ubije lupino.
- Android (mobile/) izrisuje lekcije drugače (MathML, brez simulacij); pravilo j: splet = aplikacija.
- MERGE HOLD: optimizator sporoči, ko j teče test na Renderju (združitev ga prekine).
- Podagent ≈ 110 k žetonov na lekcijo.

## Spominske datoteke
evklid-textbook.md, evklid-textbook-features.md (obe ~4 KB, skrajšaj, preden dodaš).
