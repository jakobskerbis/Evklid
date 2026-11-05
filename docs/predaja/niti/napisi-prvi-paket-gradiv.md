# Predaja: Gradiva, vsa vsebina (točka 7 j-jevega briefa)

Prejšnji niti: cmsg_011HYzNBAS5HRU1H7PcSE7JtQggKMZ4A1XQh3NZ4m8jwUh (koda), cmsg_011HYzNBAS5HRU1H7PcSE7JtLiQtzcbSesb5tT8hXRJMM8 (»Napiši prvi paket gradiv«, predano 4. 11. ~09:45 UTC pri 215k konteksta). Starejša predaja: gradiva.md.
Spomin: `/tmp/claude/memory/team/silo/evklid-gradiva.md` (posodobi ga ti).

## Cilj
j-jev brief `/mnt/project-files/evklid/placljivi-paket/prompt-za-koordinatorja.md`, točka 7: kratki videi »1–2 min na pojem, iz obstoječih simulacij«, domači poskusi z navodili, projekti iz resničnega življenja. Vsa koda je spojena (#177, #186, #198, #206). Ostala je samo vsebina.

## Odločitve j
- 4. 11. 09:34 (cmsg_011HYzNBAS5HRU1H7PcSE7JtTw2vVCQo5mZXdLeQf9AR9E, prek optimizatorja): dokončaj vse, kar je j naročil, ne glede na tedenski limit, brez $ omejitve. Samo postavko, ki bi sama stala > ~300 $, skrajšaj na najpomembnejše (pri gradivih najprej predmeti in razredi pilota 15. 11.). Ostane: trojni pregled, npm test, `five_hour` opozorilo → počakaj na resetsAt, NE spajaj med j-jevimi testi na Renderju (koordinator javi zamrznitev), nič k ljudem brez j. Ko je vse končano: eno sporočilo optimizatorju (nit cmsg_011HYzNBAS5HRU1H7PcSE7JtRD8HLfR81B3wJiA5ayzef5) z »končano«, `usage.cost_usd` in kar ostane za pozneje; j-ju obvestilo v niti.
- Vsebino piše in pregleda samo Opus (ali Fable), trije prehodi: pisec → pregledovalec (effort high) → bralec z očmi učenca. Največ 2 agenta hkrati, brez workflowa (j ga ni zahteval).

## Narejeno
PR #304 (spojen 4. 11. 06:39): 6 poskusov (FIZ-OS-8 gostota, lom-svetlobe; FIZ-OS-9 prosti-pad, prenos-toplote; KEM-OS-9 raztopine; NAR-OS-7 zgradba-snovi), 4 projekti (FIZ-OS-9 elektricno-delo-in-moc, FIZ-OS-8 enakomerno-gibanje, KEM-SS-1 raztopine, NAR-OS-6 naravoslovni-postopki), 4 videi (FIZ-OS-8 lom-svetlobe, FIZ-OS-9 prosti-pad, KEM-OS-9 raztopine, NAR-OS-7 zgradba-snovi). Strošek ~5,6 $ + 3 agenti (~227k subagent_tokens).

## Odprto: vsa ostala vsebina (ocena ~1 $ na datoteko s tremi pregledi)
232 tem z lekcijo (OŠ, SŠ, TEK); 220 ima pravo simulacijo v `public/sim/katalog.js` (brez `uvrsti`/`razvrsti`/`lab-*`).
1. **Videi, pilot najprej:** MAT-SS-4 (11), MAT-SS-3 (11), nato MAT-SS-1/2, MAT-OS-9 (NPZ), nato ostale MAT, FIZ, KEM, BIO, NAR. ~216 videov ≈ 200 $ (pod 300 $, ne krajšaj).
2. **Projekti:** najprej MAT-SS-4/3 (obrestni račun, statistika, odvod v praksi …), potem en projekt na enoto v FIZ, KEM, BIO, NAR in ostalih MAT. ~60.
3. **Domači poskusi:** samo FIZ, KEM, NAR, BIO, kjer je varen domač poskus mogoč (~45).
Pisec dobi 4–6 datotek iste poti; pregledovalec in bralec po 6–8. Pipeline brez pregrade (pisec B piše, medtem ko pregledovalec pregleduje A).

## Postopek za vsak paket
- Pisec: `node scripts/lesson-topic.js <id>` (raven, goals, previousSummaries), »Povzetek« lekcije (`awk '/^## Povzetek/{p=1;next} /^## /{p=0} p'`), pravila v `docs/gradiva.md`, primeri v `content/gradiva/`.
- Orodja v `/mnt/project-files/evklid/gradiva-orodja/` (zaženi iz `/home/user/Evklid`, ker `require("playwright")` dela od tam): `dump.cjs '[["zarki",{"mode":"lom"}]]'` izpiše kontrole simulacije (oznake drsnikov, možnosti izbir, gumbe, besedilo); `steps.cjs <sim> '<opts>' '<prizori>' [ms]` pokaže besedilo sim po vsakem prizoru dejanj; `video.mjs <mapa-za-posnetke> <POT/tema> …` predvaja videe v pravem predvajalniku `openVideo` (javi `Video: v simulaciji ni …`, PAGEERROR, TIMEOUT; posnetki 390 px po prizorih; brez izpisa = vse dela). Vrata: dump 3457, steps 3458, video 3460; agenti naj v svoji kopiji spremenijo PORT.
- Nato `node scripts/check-gradivo.js -q <datoteke>`, po tretjem pregledu `stanje: pregledano`, `npm test`, en PR na paket (~20–40 datotek), spoji sam, ko ni zamrznitve.

## Pasti
- Izbira z »=« v napisu (»Zemlja (g = 9,81 m/s²)«) se ne izvede (razrez pri zadnjem »=«): uporabi vrednost možnosti (`kraj = 1`). Zapisano v docs/gradiva.md.
- Playwright: `page.route` dela samo z `newContext({ serviceWorkers: "block" })` (aplikacija ima service worker).
- Podnapis nikoli ne imenuje vrednosti, ki je sim takrat ne kaže, in ne snovi, ki je tema ne uči (npr. nasičenost v KEM-OS-9, popolni odboj v FIZ-OS-8).
- Simulacija `delci` (snovi): temperatura sliko komaj spremeni, ne gradi prizora na njej.
- Pregledovalci so našli: staro jajce plava že v vodi, nerjavna žlica prevaja počasi (maslo 2–3 cm nad gladino), listi različnih velikosti (pošten poskus). Pri poskusih vedno preveri resnično izvedljivost.
- Več serverjev v isti seji: ubijaj po vratih (`fuser -k 3460/tcp`), nikoli `pkill -f`. Po menjavi main `npm ci`.
- Veja po merge je stara: `git fetch origin main && git checkout -B <veja> origin/main`.

## Kartice, ki čakajo na j
Ni jih.

## Načrtovana bujenja
Ni jih.

## PR-ji in veje
Odprtih ni. `claude/project-thread-z68laq` je spojena (#304).
