# Stroški AI na učenca

Ocena: `node scripts/ocena-stroska.js` (z `--db` še dejanska poraba iz `data/evklid.db`); skript ne kliče modela. Natančnost modelov: `node scripts/primerjava-modelov.js` (rešeni primeri iz lekcij, Haiku in Sonnet z navodili iz aplikacije, Opus oceni proti rešitvi; kliče API, `--dry` brez klicev, meja `--max-usd 5`). Cene (oktober 2026, USD na milijon žetonov): Haiku 5.5 0,10 vhod / 0,50 izhod / 0,01 branje predpomnilnika; Opus 5.5 4 / 20 / 0,20.

## Kje je bil strošek

En odgovor Haikuja stane okoli 0,0004 €, en odgovor Opusa okoli 0,07 €, torej skoraj 200-krat več. Pri tipičnem učencu je bila večina stroška v gumbu »Razloži podrobneje«, pri programu Tekmovanja pa je vsak odgovor šel prek Opusa.

| Učenec na mesec | Prej | Zdaj |
|---|---|---|
| Tipičen (20 dni × 10 vprašanj, 10 % podrobne razlage) | 1,51 € | 0,82 € |
| Zelo aktiven (25 dni × 30 vprašanj, 25 % podrobne razlage) | 13,72 € | 0,98 € |
| Tekmovalec (20 dni × 15 vprašanj) | 21,58 € | 0,86 € |

Številke so ocena iz velikosti prompta in predpostavk o dolžini odgovorov (v skriptu). Prave številke pokaže Nastavitve → Poraba AI, ko aplikacija teče s ključem.

## Kaj je spremenjeno

- **»Razloži podrobneje« je vedno na voljo (tudi po ponovni razlagi), čim ceneje** (j, 2026-10-29): prva ponovna razlaga je Haiku z več razmisleka (`think`, novi pristop iz prompta, predpomnjena zgodovina), Opus šele ob drugi prošnji zapored (števec `conversations.deep`, običajno sporočilo ga ponastavi). Prej je vsak pritisk šel k Opusu.
- **Opus samo za ponovno prošnjo zapored**, pri `effort: low` (druga razlaga snovi ne potrebuje dolgega razmišljanja), z zadnjimi 3 izmenjavami namesto 10 in z enourno hrambo stalnega dela prompta v predpomnilniku.
- **Tekmovanja**: Haiku z več razmisleka (`effort: high`); Opus na gumb. `EVKLID_COMPETITION_DEEP=1` vrne prejšnje vedenje.
- **Brezplačni paket nikoli ne dobi Opusa** (2026-10-29): brez naročnine, preizkusa ali kode »Razloži podrobneje« in Tekmovanja vedno pripravi Haiku z več razmisleka (opomba nad odgovorom). Prej je brezplačni učenec lahko porabil do ~0,9 € Opusa na mesec, oglasi pa bi pokrili samo ~0,0005 € na prikaz. Strošek brezplačnega učenca je zdaj največ ~0,12 € na mesec (10 vprašanj na dan). Zgornji meji: `EVKLID_FREE_POOL_USD` (vsi brezplačni skupaj, privzeto 10 $ na mesec) in `EVKLID_FREE_STUDENT_USD` (na učenca, privzeto 0,2 $); ko je meja dosežena, inštruktor brezplačnim do 1. v mesecu ne odgovarja, Vadnica in lekcije delujejo naprej.
- **Aktivacijska koda EVKLID3X** (j, 2026-10-30): 90 dni polnega dostopa za prvih 100 računov, a namesto Opusa večinoma Sonnet 5.5 (2 / 10 $ na milijon žetonov, pol cene Opusa): druga zaporedna »Razloži podrobneje«, Tekmovanja z gumbom in fotografija urnika gredo k Sonnetu; Opus pride šele ob tretji zaporedni »Razloži podrobneje« (z isto dnevno in mesečno omejitvijo kot pri naročnikih). Nastavitve `EVKLID_PROMO_CODE`, `EVKLID_PROMO_DAYS`, `EVKLID_PROMO_MODEL` (`opus` omejitev izklopi), model `EVKLID_MODEL_MID`. Opus ima za imetnike kode skrito omejitev (`EVKLID_PROMO_OPUS_DAILY`, privzeto 2 odgovora na dan, in `EVKLID_PROMO_OPUS_MONTH_USD`, privzeto 0,3 $ na mesec): nad njo tiho odgovori Sonnet, brez opombe.
- **Omejitve na učenca**: Opus največ 5× na dan; nad 1 $ na mesec podrobne razlage pripravi Haiku z več razmisleka (učenec vidi kratko opombo); nad 3 $ na mesec inštruktor počaka do 1. v mesecu, Vadnica deluje naprej.
- **Brez klica modela**: pri »Vprašaj Evklida« iz Vadnice prvi odgovor sestavi koda iz generatorja (podatki, iskano, namig, vprašanje; formula ostane skrita). Začetek teme z učne poti (»Začniva s temo …«) se shrani in ponovno uporabi pri učencih z enakimi nastavitvami in šibkimi točkami.
- **Krajši odgovori**: zgornja meja žetonov po načinu (3000, lahki način 1200, Opus 6000) namesto 8000 za vse.
- **Branje rokopisa in anketa**: brez razmišljanja (samo prepis oz. kratko vprašanje).
- **Prompt**: razlage možnih vrednosti nastavitev so v stalnem (predpomnjenem) delu, v delu za učenca ostanejo samo vrednosti.
- **Pregled**: Nastavitve → Poraba AI kaže strošek v €, povprečje na učenca, na odgovor, oceno za mesec, število odgovorov brez AI in porabo po modelih. Starš v zavihku Račun vidi delež mesečne omejitve za vsakega otroka (brez zneskov).
- **Nastavitve iz klepeta** (j, 2026-10-29): orodji `get_settings` in `change_settings` (server/chat-settings.js, seznam nastavitev v public/settings-registry.js) sta stalni in pred sistemskim promptom, zato sta v istem predpomnjenem začetku (~1500 žetonov, pri Haiku branje iz predpomnilnika ~0,00002 $ na sporočilo). Drugi klic modela samo, ko učenec res spremeni nastavitev. Finančnih in osebnih podatkov orodji ne poznata.

## Sprotno preverjanje odgovorov (j, 2026-10-30)

j: »Kako vemo, da Haiku najprej ne da napačnega rezultata?« Koda (`server/live-check.js`) preveri vsak odgovor brez stroška: pred klicem reševalnik (`public/scan/solvecore.js`) reši enačbo, sistem, odvod ali račun z vsaj dvema operacijama iz učenčevega sporočila, model pa dobi preverjen rezultat v skriti opombi (~80 žetonov vhoda, samo v tisti potezi; predpomnjen začetek ostane enak); po odgovoru koda preračuna vsak račun in končne vrednosti neznank. Model se pokliče le ob najdeni napaki (en kratek »Popravek:« istega modela, vrsta `popravek`, ~0,001 $ pri Haikuju) in za pregled s Sonnetom, kjer koda ni preverila ničesar, tveganje pa je večje (tekmovanja, fakulteta, »Razloži podrobneje«): samo Haikujevi odgovori, ne v lahkem načinu, ne v brezplačnem paketu, ne v varčnem načinu proračuna (raven ≤ 0), največ `EVKLID_LIVE_CHECK_DAILY_USD` (0,30 $, j 2026-10-30; ~25 pregledov, največ ~9 $ na mesec) na dan, vrsta `preverjanje` (~0,005–0,02 $ na pregled, Sonnet razmišlja) šteje v mesečni proračun. `EVKLID_LIVE_CHECK=0` vse izklopi.

j (2026-11-01, digitalni razred): »Naj se nikoli ne zgodi«, da inštruktor potrdi napačen ali zavrne pravilen odgovor. Zato `server/live-check.js` 4: ko učenec pošlje rezultat ali trditev (število, »=« ali odgovor na inštruktorjevo vprašanje), se odgovor ne pretaka, dokler sodba ni preverjena. Če je naloga iz prvega sporočila rešljiva z reševalnikom, koda učenčevo vrednost primerja z rešitvijo in model dobi sodbo v skriti opombi (brez stroška). Sicer, kadar odgovor izreče sodbo (»točno«, »ni prav« …), jo pregleda Sonnet (vrsta `sodba`, ločen dnevni števec od vrste `preverjanje`, ~0,005–0,01 $, vsi modeli in paketi, ne v lahkem načinu, največ `EVKLID_VERDICT_DAILY_USD` = 2 $ na dan, ~200–400 pregledov); ob napačni sodbi isti model odgovori še enkrat z ugotovitvijo v skriti opombi (vrsta `popravek`). Učenec vidi šele končni odgovor (zamik nekaj sekund).

## Števec porabe za skrbnika (2026-10-29)

- V zgornji vrstici je števec porabe AI (€ danes) za vse profile. Vidi ga samo skrbnik: na računalniku, kjer teče Evklid, ali račun z e-naslovom v `EVKLID_ADMIN_EMAILS`. Na računalniku lahko v števcu z gumbom »Pokaži števec tudi na mojem telefonu« svoj račun označiš kot skrbniški.
- Prek povezave za telefon (ngrok) ga drugi ne vidijo; `/api/usage` jim vrne 403.
- Klik odpre pregled: danes, ta mesec, ocena za mesec, po profilih z vrstico do mesečne meje, ter predlog meje in cene (`server/advice.js`). Predlog ničesar ne spremeni sam: meja je `EVKLID_STUDENT_MONTHLY_USD`, cena `server/accounts/plans.js`.
- Pravila predloga: najprej kakovost (če je ≥ 5 % učencev pri meji ali blizu nje, dvigni mejo do višine, pri kateri učenec še prinese 4 €), nato dobiček (cilj 6 € na naročnino). Cena po zanimanju iz končanih 7-dnevnih preizkusov (vsaj 10): ≥ 35 % naročnin → preizkusi +20 % za nove, ≤ 8 % → najprej izboljšaj prvi teden.

## Mesečni proračun API in dokup porabe (j, 2026-10-30)

j: izbira modela naj porabi čim bližje 200 $ kredita na mesec (Claude Max), a ga ne preseže; 200 $ si delijo učenci po paketu, nad svojim delom lahko dokupijo porabo, od nakupa ostane vsaj polovica.

- **Proračun** (`server/proracun.js`, `server/usage.js`): znesek je `EVKLID_MONTHLY_BUDGET_USD` (render.yaml 200), skrbnik ga spremeni ali doda kupljeni API kredit v števcu porabe (Poraba AI → Mesečni proračun API; shrani se v tabelo `kv`). Inštruktor se ustavi `EVKLID_BUDGET_RESERVE_PCT` (3 %) pred mejo, zato tudi hkratni odgovori ne gredo čez. Ni v nastavitvah iz klepeta (finančni podatek).
- **Raven modelov po hitrosti porabe** glede na del meseca, ki je minil: pod polovico načrta Opus tudi za običajne odgovore, pod 80 % Sonnet, okoli načrta kot doslej, nad 110 % samo hitri model (tudi »Razloži podrobneje«), zadnjih 5 % samo hitri model, nato ustavljeno. Ko je danes porabljeno več kot 2× dnevnega deleža (`EVKLID_BUDGET_BURST`), nadgradnje počakajo do jutri. Z več učenci poraba raste in raven sama pade.
- **Kdo dobi nadgradnjo**: Osebno do Opusa, aktivacijska koda in šolska licenca največ Sonnet, brezplačni paket nikoli (ostanejo tudi njegove stare meje), lahki način nikoli. Nadgrajen odgovor ohrani celo okno pogovora; v porabi je vrsta `boost`.
- **Delitev po profilih**: proračun se deli med učence, ki so v zadnjih 30 dneh uporabljali AI, po utežeh: naročnina po mesečni ceni na otroka v € (9,99), preizkus, koda, bonus in paket pred testom kot 9,99, šolska licenca 2 (`EVKLID_SHARE_SCHOOL`), brezplačni 1 (`EVKLID_SHARE_FREE`). Pri 80 % svojega dela učenec ne dobi več nadgradnje ne Opusa, pri 100 % inštruktor počaka do 1. v mesecu ali do dokupa. S proračunom stari meji na učenca (1 $ / 3 $) ne veljata.
- **Dokup** (`server/placila/krediti.js`, zavihek Račun): paketi 5 / 10 / 20 € (osnutek, potrdi j), kredit = 50 % plačila v $ (`EVKLID_CREDIT_SHARE`, največ 0,5), vezan na račun, velja za vse profile, ne poteče. Plača polnoleten imetnik računa (Stripe, obe potrditvi kot pri paketu pred testom). Poraba iz kredita ne šteje v skupni proračun, zato mora biti na API računu toliko dodatnega dobroimetja (samodejno polnjenje v konzoli Anthropic). Vračilo ali spor kredit odvzame.
- **Ni dobroimetja**: ob napaki »400 ni dobroimetja« inštruktor 10 minut ne kliče API-ja in pokaže jasno sporočilo; števec porabe to pokaže skrbniku.
- Poraba zunaj aplikacije z istim ključem (npr. simulacije na j-jevem računalniku) se ne šteje: zanjo naj bo ločen ključ ali manjši znesek proračuna.
