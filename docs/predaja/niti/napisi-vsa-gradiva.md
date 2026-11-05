# Predaja: Napiši vsa gradiva (videi, projekti, domači poskusi)

## STANJE 4. 11. 17:05 UTC (nit »Napiši vsa gradiva (nadaljevanje)« cmsg_011HYzNBAS5HRU1H7PcSE7JtXnaqDyfDLiMJPJC1bAEgJS, 37,75 $)
- Spojeno: PR #394 (6 videov MAT-SS-2 + sim popravki), PR #416 (6 videov MAT-SS-1 + neenacba/sistem/potence), PR #426 17:05 (6 videov MAT-SS-1: mnozice, realna-stevila-in-intervali, algebrski-izrazi, trikotnik, stirikotniki-in-krog, obdelava-podatkov + povrsinski/venn/trikotnik/statistika popravki + neodvisen prehod 2 za #416). Odprtih vej ni.
- STOP (optimizator 17:02, tedenski limit 93 %): nadaljuj šele po resetu sreda 11. 11. 03:00.
- Optimizator 15:50: ≤ 20 $ za nadaljevanje MAT-SS-1; porabljenih ~11 $, zato sem ustavil (naslednji paket ~11 $). Nadaljuje nova nit / po odobritvi optimizatorja.
- Pravilo j 4. 11. 15:23: majhni popravki = prehod 1 + en pregledovalec; simulacije in vsa vsebina ostanejo dva ločena pregledovalca.
- Dobra razporeditev (≈ 11 $ za 6 videov): 2 pisca po 3 teme → 1 agent popravi simulacije → 2 pregledovalca (vsak 3 videi + prehod 2 svojih simulacij) → 2 bralca (vsak 3 videi + prehod 3 svojih simulacij) → prehod 1 sam.
- Preostale MAT-SS-1 teme (6): naravna-in-cela-stevila (evklid, dvvenn), racionalna-stevila (periode), ulomljeni-izrazi (graf), osnovni-geometrijski-pojmi (premice, pari-kotov), osnove-logike (logika), pravokotni-koordinatni-sistem-v-ravnini (koord-trikotnik). Nato MAT-OS-9 (16, NPZ).
- Orodja: dump.cjs/steps.cjs zdaj z locale sl-SI (angleški »Show/Grid« je bil artefakt orodja).
- video.mjs v dolgem zaporednem teku (60+ videov) včasih javi »TIMEOUT scene 0«; ob ponovnem teku samo tistih je čisto. Ne poganjaj vzporedno z drugim preveri-simulacije (isti port 3998).
- Naslednje MAT-SS-1 teme (12): mnozice, naravna-in-cela-stevila, racionalna-stevila, realna-stevila-in-intervali, algebrski-izrazi, ulomljeni-izrazi, osnovni-geometrijski-pojmi, trikotnik, stirikotniki-in-krog, obdelava-podatkov, osnove-logike, pravokotni-koordinatni-sistem-v-ravnini; nato MAT-OS-9.
- Strošek te niti 26,03 $ (od 40 $).

Prejšnja nit: cmsg_011HYzNBAS5HRU1H7PcSE7JtWVC2XeqQ5Z5zkaFVMBEPyr (»Napiši vsa gradiva«, 4. 11. 09:42–~12:30 UTC, predano pri ~270k konteksta). Starejši predaji: napisi-prvi-paket-gradiv.md, gradiva.md. Spomin: `/tmp/claude/memory/team/silo/evklid-gradiva.md`.

## Cilj in odločitve j
- j-jev brief točka 7: kratki videi iz simulacij, domači poskusi, projekti.
- j 4. 11. 09:34 (cmsg_011HYzNBAS5HRU1H7PcSE7JtTw2vVCQo5mZXdLeQf9AR9E): dokončaj vse ne glede na limit; ko končaš, obvestilo j-ju.
- Optimizator 2 (cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB): ta teden ≤ 200 $ za gradiva; najprej pilot (MAT SŠ), nato OŠ glavni predmeti; ostalo v načrt za naslednji teden. Poročilo optimizatorju ob vsakem spojenem PR (cost_usd) in »končano« na koncu. Ustavi vsebino, če optimizator reče (95 %).
- j 11:20 (cmsg_011HYzNBAS5HRU1H7PcSE7JtGskbGA4kz1rqyw8H3sictb): vsaka odločitev za j je kartica v niti »Odločitve zate« cmsg_011HYzNBAS5HRU1H7PcSE7Jt6zBtvecoWzGJyRTNXXvC1w (message_thread: vprašanje, 2–4 možnosti s posledico, priporočilo).
- Trije prehodi (Opus pisec → Opus pregledovalec effort high → Opus bralec), največ 2 agenta hkrati, brez workflowa. Koda v public/: prehod 2 (funkcija) in 3 (videz) z ločenima agentoma (docs/pregled.md).

## Narejeno
- PR #354 spojen 4. 11. 11:49: 22 videov MAT-SS-3/4, 6 projektov MAT-SS-3/4, ~25 popravkov simulacij in predvajalnika (barve v videu, izpis pod sliko, potrditvena polja, izbire »vektorja« in »trikotnik«, …).
- PR #368 spojen 12:14: 6 videov MAT-SS-2 (kvadratna-funkcija, kvadratna-enacba, kvadratna-neenacba, eksponentna-funkcija, logaritem, kotne-funkcije-v-pravokotnem-trikotniku), trije prehodi.
- Strošek prejšnje niti: 46,85 $ (cost_usd ob predaji 12:25).
- j 12:18 (cmsg_011HYzNBAS5HRU1H7PcSE7Jt8yRRraWNUpk7u29tPnmFeX): delo teče do 95 % tedenskega limita; optimizator 2: ≤ 40 $ od 12:19 za vse gradiva skupaj (nova nit vključno), največ 2 težka agenta, trdi stop, ko optimizator javi 95 %.

## Odprto: veja claude/project-thread-b19i8i, commit f7b8299 (potisnjen, ni PR, NE spajaj pred pregledom)
1. Drugi krog popravkov simulacij (13 točk, agent popravki-sim-2; v mat-funkcije.js, mat-trig.js, mat-telesa.js, mat-stevila.js, mat-geo.js + textbook.css: v videu je vrstica »Prikaži« pod izpisom) ter popravek izpisa eksponentne funkcije (»Ko se x poveča za 1 …«). Testi: npm test 1079/0, preveri-simulacije 531/0. MANJKA: prehod 2 (funkcija+matematika) in prehod 3 (videz 360/1280, svetlo/temno) z ločenima agentoma (docs/pregled.md), nato preveri-aplikacijo, vsi videi v video.mjs, PR, spoji.
2. 6 osnutkov videov MAT-SS-2 (koreni, potence-z-racionalnimi-eksponenti, kompleksna-stevila, eksponentne-enacbe, logaritemska-funkcija-in-enacbe, podobnost): samo pisec. Pregledovalec naj preveri podnapise na POPRAVLJENIH simulacijah (koren »√16 = 4«, potencna samo x ≥ 0, eksponentna-enacba brez \log, kompleksna brez kotov, podobnost »2-krat krajša«), nato bralec. Lahko v isti PR kot točka 1.
3. Še odprte napake simulacij: sim-napake.md (telesa majhno na telefonu, podobnost pri negativnem k delno izven slike: obe zahtevata predelavo).
4. Naslednje po pilotni prednosti: videi MAT-SS-1 (17 tem), nato MAT-OS-9 (16, NPZ); potem OŠ FIZ/KEM/BIO/NAR videi, projekti, domači poskusi.
5. Ob koncu: »končano« + cost_usd optimizatorju 2, obvestilo j-ju v niti, posodobi spomin evklid-gradiva.md.

## Postopek
- Brief za vse agente: `/mnt/project-files/evklid/gradiva-orodja/brief.md` (pisec/pregledovalec/bralec). Agentu daš samo vlogo, seznam datotek/tem, TOOL_PORT (vsak svoja vrata, npr. 37xx) in scratch mapo. Paketi po 5–6 datotek.
- Orodja: dump.cjs, steps.cjs (`["toggle","<napis>"]` za potrditveno polje), video.mjs; vse berejo `TOOL_PORT`.
- Teme: `node --input-type=module -e 'import {SIM_TOPICS} from "./public/sim/katalog.js"; import fs from "fs"; for (const [k,v] of Object.entries(SIM_TOPICS)) { if (!/^MAT-(SS-1|OS-9)\//.test(k)) continue; const ids=(Array.isArray(v[0])?v:[v]).map(x=>x[0]).filter(x=>!/^(uvrsti|razvrsti|lab-)/.test(x)); if (fs.existsSync("content/lessons/"+k+".md") && ids.length) console.log(k, ids.join(",")); }'`
- Pred PR: `npm test`, `node scripts/preveri-aplikacijo.cjs`, `node scripts/preveri-simulacije.cjs`, `node scripts/check-gradivo.js -q content/gradiva/*/*/*.md`, vsi videi v video.mjs brez »Video: v simulaciji ni«/PAGEERROR/TIMEOUT.

## Pasti
- Pisci najdejo veliko napak v simulacijah: ne popravljajo jih sami, zbiraj jih v sim-napake.md in jih daj enemu agentu za popravke; potem pregledovalci preverijo podnapise na popravljeni simulaciji.
- Na telefonu je izpis pod sliko (od #354), »Poskusi« je v videu skrit; podnapisi kažejo na barve/pike/črte v sliki ali na prve vrstice izpisa.
- Po merge je veja stara: `git fetch origin main && git checkout -B claude/project-thread-b19i8i origin/main` (nova nit dobi svojo vejo).
- Konflikt z main v public/sim/index.js je bil (3d/m3 pogoj); pri spajanju obdrži oboje.

## Kartice, bujenja, PR-ji
Kartic za j ni. Načrtovanih bujenj ni. Odprtih PR ni (ob predaji preveri, ali je ostal commit na veji, ki še ni v PR).
