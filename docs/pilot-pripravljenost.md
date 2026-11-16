# Pripravljeno za pilot: seznam z dokazi (16. 11. 2026)

Zaprt pilot z 10–20 uporabniki (15. 11.–15. 12. 2026). Naročilo j, 15. 11. 2026: samo zanesljivost, varnost in
plačila, brez novih funkcij. Vsak korak ima svoj PR, teste, ki tečejo v CI ob vsaki spremembi, in dva pregleda.

**Povzetek:** vseh 6 tehničnih korakov je narejenih in združenih v `main`. Odprto ostane to, kar mora j narediti ročno
(spodaj, »Kaj narediš ročno«), in znane omejitve, ki za pilot niso ovira (spodaj, »Znano, a ne popravljeno«).

## Koraki in dokazi

| Korak | PR | Kaj dokazuje | Test v CI | Dokumentacija |
|---|---|---|---|---|
| 1. Iskalnik napak v CI | #734 | Podvojeni ključi v kodi in prevodih ustavijo PR; popravljeni `games.wishThanks` in `has_password` | posel `hrosci` (`scripts/najdi-hrosce.mjs`) | `docs/pregled.md` |
| 2. Vaja obnove iz kopije | #740 | Sveža namestitev se obnovi iz lokalne in iz šifrirane zunanje kopije; prijava, profil in šifriran pogovor delujejo | `test/vaja-obnove.test.js` | `docs/obnova.md` (vaja sama traja 21 s; prava obnova na Renderju ~5 min iz kopije na disku, ~20–30 min iz R2) |
| 3. Meja stroška AI | #744, #748 | Vzporedni klici ne presežejo meje stroška (dva profila hkrati, skupni delež Družine); 30 hkratnih vprašanj ne preseže dnevne meje vprašanj; rezerva pokrije najdražji odgovor; dodan ali izbrisan profil ne ponastavi klicev v teku | `test/meja-ai-napad.test.js`, `test/meja-ai-nov-profil.test.js` | opisi v testih in PR #744, #748; meje: `docs/stroski-ai.md` |
| 4. Plačila Stripe (testni način) | #749 | Naročnina: nakup, podaljšanje, neuspelo plačilo, preklic, vračilo, spor. Paket pred testom, dokup in darilna koda: nakup, vračilo, spor. Podpisani webhooki, dvojni dogodki | `test/stripe-poti.test.js` in drugi testi plačil (preglednica v `docs/placila-poti.md`) | `docs/placila-poti.md` |
| 5. Izbris in izvoz računa | #758, #763 | Po izbrisu računa ali profila v nobeni od 108 tabel in v `kv` ne ostane nič, kar kaže nanj; izvoz vsebuje vsako tabelo z vrsticami računa; ročne kopije največ 22 dni | `test/izbris-vse.test.js`, `test/kopije.test.js`, `test/varnost.test.js`, `test/pilot-naloge.test.js` | `docs/izbris-izvoz.md`, `docs/varnost-podatkov.md` |
| 6. Spremljanje in opozorila | #767 | Straža vsakih 15 min od zunaj; e-pošta skrbniku ob dnevnem strošku AI nad mejo in ob neuspelem preizkusu kopije | `test/opozorilo-ai.test.js`, `test/kopije-preveri.test.js` | `docs/spremljanje.md` |

Vsi testi tečejo v delovnem toku **Testi** (`.github/workflows/testi.yml`, posli `testi`, `preveri`, `hrosci`) ob
vsakem PR in vsaki spremembi `main`. Zadnji zagon na `main` pred tem dokumentom: uspešen (Actions → Testi).

### Stanje na živo (https://evklid.app/healthz/stanje, 16. 11. 2026 ob 10.20 UTC)

| Polje | Vrednost | Pomen |
|---|---|---|
| `kopije` | zadnja 2026-11-16, 7 kopij, `napaka: false` | dnevna kopija baze teče |
| `preverjanjeKopij` | 2026-11-16, `ok: true` | nočni preizkus obnove iz kopije je uspel |
| `posta` | `nastavljena: true`, 0 napak | e-pošta (Resend) je nastavljena |
| `aiStrosek` | `nadMejo: false` | opozorilo o strošku AI teče, danes pod mejo |
| `pomnilnik` | 276 MB od 512 MB (največ 62 % v 30 min) | dovolj prostora |
| `kopijeZunaj` | `null` | **kopija zunaj Renderja (R2) ni nastavljena** (ročno, spodaj) |

Straža (Actions → Straža) je v zadnjih zagonih uspešna, tudi po objavi #767.

Kako preveriš sam: odpri https://evklid.app/healthz/stanje v brskalniku ali poglej zadnji zagon Straže na GitHubu
(korak »Preveri živo spletišče« na koncu izpiše povzetek po slovensko).

## Kaj narediš ročno (pred prvim povabilom ali v prvem tednu)

| # | Kaj | Kje | Zakaj | Podrobno |
|---|---|---|---|---|
| 1 | Nastavi kopijo baze zunaj Renderja (R2) | Cloudflare R2 + Render → Environment | Okvaro diska pokrije Renderjev posnetek; ob izgubi cele storitve ali računa na Renderju brez R2 ni nobene kopije | `docs/obnova.md` |
| 1a | Vaja obnove na Renderju (enkrat pred pilotom, nato enkrat na mesec), ko nihče ne uporablja Evklida | Render → Shell | Preveri, da obnova deluje na pravem strežniku | `docs/obnova.md` → Vaja |
| 2 | Različica API webhooka Stripe `2024-06-20` | Stripe → Developers → Webhooks → endpoint | Z novejšo vračilo naročnine ne zniža meje AI | `docs/placila-poti.md` |
| 3 | En ročni testni nakup (kartice 4242…, 4000…0341, preklic, vračilo) | Stripe testni način + aplikacija | Preveri prave ključe in webhook; vsak dogodek mora dobiti 200 | `docs/placila-poti.md` |
| 4 | E-pošta GitHuba za neuspele delovne tokove: »Email« vklopljen, »Only notify for failed workflows« obkljukan | GitHub → Settings → Notifications → System → Actions | Brez tega Straža pade tiho | `docs/spremljanje.md` |
| 5 | Poskusni alarm (Run workflow z `https://evklid.app/ni-strani`) | GitHub → Actions → Straža | Preveri, da e-pošta res pride | `docs/spremljanje.md` |
| 6 | Zadnja sprememba vrstice `cron` v `straza.yml` mora biti tvoja | GitHub → straza.yml → History | Samodejni alarmi gredo tistemu, ki jo je zadnji spremenil | `docs/spremljanje.md` |
| 7 | Preveri `EVKLID_ADMIN_EMAILS` in Resend (`RESEND_API_KEY`) | Render → Environment | Sicer strežnik e-pošte o strošku AI in kopiji ne pošlje | `docs/spremljanje.md` |
| 8 | Pobriši `data/povratne-informacije-povzetek.md` in `data/povratne-informacije.json`, če obstajata | Render → Shell | Lahko vsebujeta imena in mnenja, izbris računa ju ne doseže | `docs/izbris-izvoz.md` (7) |
| 9 | Mesečna meja porabe | Anthropic Console → Settings → Limits | Varovalka zunaj aplikacije (šteje tudi meritve po objavi) | `docs/spremljanje.md` |
| 10 | Po prvem tednu nastavi `EVKLID_OPOZORILO_AI_USD` malo nad običajno dnevno porabo | Render → Environment | Privzetih 3 $ je ocena | `docs/spremljanje.md` |

Ko so 1–8 narejene (z 1a), je Evklid z vidika tehnike pripravljen za povabila. 9 in 10 sta priporočeni.

## Znano, a ne popravljeno

Za pilot nobena ni ovira; vse so zapisane, da se odloči j.

**Varnost podatkov in zasebnost**
- `public/zasebnost.html` §5 ne omenja, kaj po izbrisu ostane brez povezave na račun (predpomnjeni odgovori,
  nagrade za priporočilo, šola, naloge v razredu drugega učitelja). Besedilo je za drug profil (`docs/izbris-izvoz.md` 6).
- Obnova iz kopije vrne račune, izbrisane po datumu kopije. Po obnovi ročno ponovi zahteve za izbris iz tega obdobja
  (`docs/izbris-izvoz.md` 8) in v Stripe → Developers → Events znova pošlji dogodke od časa kopije (`docs/obnova.md`).
- Stranka v Stripu (e-naslov, ime) ostane po izbrisu računa (`docs/izbris-izvoz.md` 9).
- R2: rok 30 dni nima rezerve; predlog 28 dni, ko bo R2 nastavljen (`docs/izbris-izvoz.md` 10).
- Resend hrani poslana sporočila po svojih pravilih (`docs/izbris-izvoz.md` 11).

**Plačila** (`docs/placila-poti.md`)
- Dobljen spor (sredstva vrnjena) ni obdelan: skrbnik dostop vrne ročno.
- Delno vračilo dokupa odvzame cel paket kredita.

**Meja AI** (iz pregledov PR #744 in #748)
- Gost ob registraciji in konec paketa sredi klica lahko enkrat presežeta brezplačno mejo za znesek klicev v teku
  (centi; obstajalo že prej).
- Obnova rezervacij po ponovnem zagonu (`recoverHolds`) preskoči izbrisane profile.
- Strošek meritve po objavi ni v opozorilu o strošku AI; ima svojo mejo (`server/meritev-po-objavi.js`).

**Spremljanje** (`docs/spremljanje.md`, »Česar ni«)
- GitHub lahko zagon Straže zamakne za nekaj minut.
- Po 60 dneh brez sprememb v repozitoriju GitHub Stražo izklopi; takrat jo znova vklopi.

**Repozitorij**
- Od #475 je v `main` datoteka `node_modules`, ki kaže na neobstoječo mapo (sporočilo #755 napačno pravi, da je
  odstranjena). Render jo ob gradnji (`npm ci`) zamenja, zato objava deluje; na novi lokalni kopiji kode pa testi padejo, dokler je ne pobrišeš (`rm node_modules`, nato
  `npm ci`). Popravek je ena vrstica v ločenem PR.
