# Predaja: posebni inštruktor, paket C (in kasneje D, B, E)

Cilj: j (4. 11. 2026) želi, da Evklidov inštruktor ni »še en LLM inštruktor«. Seznam 30 idej:
/mnt/project-files/evklid/instruktor-ideje/30-idej.md; j je izbral 22 (artifact https://claude.ai/artifact/1CkGziSWgrntTLdygMoqGw,
db izbira/ideje): 1,2,3,4,6,7,8,11,12,13,14,15,16,19,20,21,22,24,25,26,27,30. Načrt paketov: nacrt-gradnje.md v isti mapi.
Memory: evklid-tutor-unique.

Stanje
- Paket A (1,4,6,7,11,25,26) = PR #427 (branch claude/project-thread-oebsqn), zelen, trojni pregled opravljen. Čaka j-jevo
  potrditev prompta (kartica poslana v »Odločitve zate«). Merge in PR ostaneta v stari niti
  cmsg_011HYzNBAS5HRU1H7PcSE7JtQAaLuE15x5oLAxZF2haHgm. Mehanizem: docs/odpri.md (bloki <<ODPRI>>, <<GRAF>>, <<SKICA>>,
  server/odpri.js, public/odpri.js).
- Paket C zdaj (optimizator 4. 11. 15:49: A+C skupaj ≤ 60 $, A je porabil ~17 $ + 2 pregledovalca; ≤ 2 težka agenta, trojni
  pregled, sprememba prompta → kartica v »Odločitve zate« pred merge; ustavi se na optimizatorjevo besedo 95 %).
  B, D, E šele po 11. 11. (optimizator jih zbudi).

Paket C – ideje in kaj že obstaja
- 8 preverjeni računi: server/live-check.js ŽE preverja odgovore (solvecore, lesson-math, verify.js, Sonnet pregled).
  Manjka viden znak »✓ Računi preverjeni« pod odgovorom, ko je koda preverila ≥ 1 račun brez neujemanja (codeFindings).
- 14 vzorec napačnega razumevanja → 3 ciljane naloge: server/weaknesses.js (šibke teme iz META), prompt ima »Pogoste
  napačne predstave«. Ideja: META polje za napačno predstavo, ob ponovitvi ponudba 3 nalog iz Vadnice (server/practice).
- 15 lestvica gotovosti: po odgovoru na nalogo učenec izbere »Prepričan / Nisem prepričan / Ugibam«; posebej »prepričan,
  a narobe« (Vadnica in/ali klepet).
- 19 namerna napaka: nov način vaje »Poišči napako« (prompt + morda gumb).
- (21 naloge NPZ/mature na temo je iz paketa A izpuščena: content/exam-papers/*.json nimajo id-jev tem; predlog: orodje
  find_exam_task ali iskanje po besedilu naloge. Dodaj k C, če ostane proračun, sicer D.)

Pasti
- npm ci pred npm test (sicer 83 napak »express ni najden«). preveri-aplikacijo traja ~5 min.
- Nikoli `pkill -f` z vzorcem, ki je v lastnem ukazu (ubije lastni shell). Nikoli `git stash` med tekom testov v ozadju.
- Novi nizi: sl.js + 32 ui/*.json; overflow-x samo v dovoljenih pravilih (test/drsniki.test.js); odmiki zgoraj/spodaj prek
  --varno-zg/--varno-sp (test/brez-robov.test.js); gumbi ≥ 40 px (button.small je 38 px !important).
