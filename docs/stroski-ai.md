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
- **Sprotni povzetek dolgega pogovora** (2026-11-04, `server/povzetek.js`): inštruktor dobi zadnjih 10–20 izmenjav; ko okno odreže starejših 10, jih Haiku (kratek način) strne v povzetek do 150 besed (naloga s števili, kaj je učenec že rešil in kje se je zmotil, kaj je bilo razloženo, kaj je odprto), ki gre pred prvo sporočilo v oknu. Povzetek se spremeni le ob novem rezu, zato predpomnilnik zgodovine deluje naprej. En klic na 10 izmenjav brez razmišljanja in brez predpomnilnika, največ 400 izhodnih žetonov (~0,0007 $, najslabše ~0,002 $), vrsta `povzetek`; ob napaki ali po 8 s gre zgodovina s prejšnjim povzetkom ali brez njega kot prej, nov poskus šele ob naslednjem rezu. Skrite opombe (pola z našo rešitvijo, preverjen račun) ne gredo v povzetek. Povzetek je v izvozu podatkov ob pogovoru (`summary`). Shranjen šifriran (tabela `conversation_summaries`), izbriše se s pogovorom. `EVKLID_CHAT_SUMMARY=0` izklopi. Ne velja za kratko zgodovino Opusa ob »Razloži podrobneje« (zadnje 3 izmenjave).
- **Srednja šola: Haiku z več razmisleka** (j 2026-11-04 »najdi najboljšo rešitev« po primerjavi modelov, `scripts/primerjava-modelov.js`, ocenjevalec Opus): na 50 rešenih primerih iz lekcij je imel navadni Haiku 12 % napak (OŠ 0 %, SŠ 27 %, tekmovanja 13 %, faks 8 %), Sonnet 2 % (SŠ 0 %), a je ~15–20× dražji (~3 cente na odgovor). Haiku z več razmisleka (način `think`) je na istih 23 nalogah SŠ in tekmovanj imel 4 % napak (SŠ 7 %, tekmovanja 0 %) za ~0,21 centa na odgovor. Zato srednješolci s plačljivim paketom, preizkusom ali šolsko licenco privzeto dobijo način `think` (tekmovanja ga že imajo), razen v varčnem načinu; brezplačni paket ostane pri navadnem Haikuju (0,2 $ na mesec bi sicer zadoščalo za ~3× manj odgovorov). Odgovor je nekaj sekund počasnejši; `EVKLID_MAX_TOKENS_THINK` je zato 8000 (prej 5000, razmišljanje je lahko odrezalo odgovor). Prva »Razloži podrobneje« je pri SŠ isti model s podrobnejšo prošnjo, druga gre višje kot doslej. Večina napak navadnega Haikuja je bila v stranskih trditvah in izmišljenih dodatnih vajah, ne v končnem rezultatu. `EVKLID_SS_THINK=0` vrne navadni Haiku.
- **Lekcija iz učbenika pri prvem vprašanju** (2026-11-04, `server/lekcija-za-vprasanje.js`): pri prvem vprašanju prostega pogovora (brez teme učne poti in brez pole) strežnik lokalno poišče lekcijo učbenika, ki se z vprašanjem jasno ujema (predmet učenca, do njegovega razreda, iskanje po besedah s težo redkosti, brez klica modela). Njen povzetek (do 1200 znakov) gre kot skrita opomba `<lekcija_ucbenika>` v prvo sporočilo: inštruktor razlaga z istimi oznakami in postopki kot učbenik in lahko učenca napoti na lekcijo. Opomba je shranjena s sporočilom, zato se začetek zgodovine ne spreminja (predpomnilnik). Strošek: ~300–500 vhodnih žetonov enkrat na pogovor (Haiku ~0,00005 $, nato iz predpomnilnika). Na vzorčnih vprašanjih najde lekcijo pri približno polovici vprašanj, za katera lekcija obstaja, in nobene pri klepetu ali vprašanjih z drugih področij; ena sama beseda iz večbesednega naslova ne zadošča (kocka pri metu kocke ni »Kocka in kvader«), tema brez lekcije ne dobi sosednje lekcije. j vklopil 4. 11.; `EVKLID_LESSON_SEARCH=0` izklopi.
- **Cena zapisa v predpomnilnik za 1 uro** (2026-11-04): zapis za 1 uro (stalni del prompta za Opus in Sonnet) stane 2× vhod, ne 1,25× kot zapis za 5 minut; `costUsd` ga zdaj šteje po `usage.cache_creation`, prej je bil podcenjen (3 nadgrajeni odgovori Opusa na strežniku so bili zabeleženi po ~11 centov, večinoma zapis; dejansko so stali do ~60 % več). Prilagodljiv čas hrambe (1 ura le ob razmikih 5–60 minut) je bil preverjen in opuščen: pri nekaj klicih Opusa na popoldne bi stal več, kot prihrani pri osamljenih klicih.
- **Dnevna meja vprašanj raste s proračunom** (j, 2026-11-04: namesto stalne meje naj se prilagaja proračunu AI): stalni meji paketov (Osebno 60, šolska licenca 15, skupaj 75) sta spodnja meja, zato obljube v ceniku in na strani za šole veljajo naprej. S proračunom meja zraste na (preostali del učenčevega deleža na začetku dneva + njegov del dokupljenega kredita, kredit računa razdeljen med otroke) / dni do konca meseca (z današnjim) / `EVKLID_QUESTION_USD` (0,005 $), največ `EVKLID_DAILY_QUESTIONS_MAX` (200). Lastna vprašanja meje čez dan ne znižajo (premakne jo lahko nov aktiven učenec ali poraba kredita); zadnji dan v mesecu dobi učenec ves ostanek, 1. v mesecu se začne znova. Strošek vprašanja je stalna ocena, ne izmerjeno povprečje, da nadgradnje modelov ob neporabljenem proračunu meje ne znižajo. Brezplačni paket ima svojo mejo (`EVKLID_FREE_DAILY_QUESTIONS`, 10). Mesečni delež še vedno velja: kdor vsak dan porabi več, kot da delež, ga porabi pred koncem meseca in nadaljuje z dokupom. Primer: pri 200 $ in 5 enakih plačljivih učencih (~38 $ na učenca) je meja 200 na dan; pri 200 enakih plačljivih učencih (~0,97 $ na učenca, ~6 na dan) velja stalnih 60, delež pa zadošča za ~190 vprašanj na mesec.
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
- **Zajamčeni AI naročnine** (j 2026-11-04, `server/accounts/plans.js`, »Cene z najmanj 75 % dobička«, Predlog A): na profil na mesec OŠ 1,9 $, SŠ 2,9 $, faks 4,5 $ (letni paket 1,7 / 2,6 / 3,8 $); Družina en skupen delež za ves račun 3,5 $ (letno 2,9 $), Družina s študentom 5,5 $ (letno 4,3 $); Osebno ob šolski licenci 0,9 $ (šolsko leto 0,6 $); regijski paketi po pravilu 75 % iz cene v € (fiksni tečaji `EUR_PER_UNIT`). Paketi pred testom: OŠ/SŠ 0,8 / 1,5 / 2,9 $, faks 1,1 / 2,3 / 4,5 $. Vrednosti so ves mesečni strošek AI paketa (trda meja): podrobne razlage do vrednosti / 1,15 (to vidi učenec kot »še N razlag«), nato hitri model (Haiku) do meje (`FAST_TAIL` 15 % podrobnega dela, `detailedShare`), nato dnevna meja brezplačnega paketa do 1. v mesecu ali do dokupa.
- **Dokup** (`server/placila/krediti.js`, zavihek Račun): paketi 5 / 10 / 20 € (osnutek, potrdi j), kredit po pravilu 75 % (j 2026-11-04): (plačilo × 0,235 − 0,25 €) / 0,92 v $, npr. 5 / 10 / 20 € → 1,00 / 2,28 / 4,83 $ (`EVKLID_CREDIT_SHARE` ga lahko le zniža); učenec vidi samo ~število pogovorov, vezan na račun, velja za vse profile, ne poteče. Plača polnoleten imetnik računa (Stripe, obe potrditvi kot pri paketu pred testom). Poraba iz kredita ne šteje v skupni proračun, zato mora biti na API računu toliko dodatnega dobroimetja (samodejno polnjenje v konzoli Anthropic). Vračilo ali spor kredit odvzame.
- **Ni dobroimetja**: ob napaki »400 ni dobroimetja« inštruktor 10 minut ne kliče API-ja in pokaže jasno sporočilo; števec porabe to pokaže skrbniku.
- Poraba zunaj aplikacije z istim ključem (npr. simulacije na j-jevem računalniku) se ne šteje: zanjo naj bo ločen ključ ali manjši znesek proračuna.

## Trda meja AI: največ 25 % plačila (j 2026-11-06 6:40)

j: »privzeto VEDNO ≥ 75 %« – strošek AI (vhodni in izhodni žetoni, predpomnilnik, skener, slike, ponovni poskusi, prekinjeni odgovori, preverjanja) ne sme preseči 25 % tega, kar uporabnik plača, za vsak paket in način. Brezplačni paketi imajo nizko stalno mejo. Cene niso spremenjene (to odloča j), samo meje porabe.

- **Meja paketa** (`server/accounts/plans.js` `aiCapFromEur`): 25 % plačila na mesec (letni paket in darilo: cena / 12; paket pred testom: ves paket), preračunano z 0,92 € za 1 $ (previdno). Vrednosti zajamčenega AI (Predlog A) so že pod to mejo; nova je zgornja meja za vse, tudi za nastavitve `EVKLID_AI_GUARANTEE_*_USD`, `EVKLID_SCHOOL_AI_EUR`, mejo licence, ki jo vpiše skrbnik (`ai_cap_usd_month`), in shranjeno mejo paketa pred testom. Šolska licenca: 25 % vpisane cene licence (`price_eur`), brez nje cene iz cenika.
- **Brez plačila** (`server/meje-ai.js` `NOPAY_USD`): brezplačni paket in gost 0,2 $ na profil na mesec in 10 $ vsi skupaj (kot doslej); preizkus, aktivacijska koda, bonus za priporočilo in stari profili brez računa 0,5 $ na mesec za ves račun (`EVKLID_TRIAL_AI_USD`, `EVKLID_PROMO_AI_USD`, `EVKLID_BONUS_AI_USD`, `EVKLID_LEGACY_AI_USD`), z brezplačnim repom kot naročnina (prej delež skupnega proračuna po utežeh, brez stalne meje).
- **Uveljavitev na strežniku** (`server/usage.js` `hold`, `headroom`, `capsFor`): pred vsakim klicem modela strežnik rezervira najvišji možni strošek klica in klic dovoli le, če poraba + rezervacije klicev v teku + ta rezerva ostanejo pod mejo. Zadnji klic in hkratni klici (več pogovorov, več naprav, cela šola) zato meje ne prestopijo. Rezerva: vhod ≤ bajti besedila (vsak žeton ima vsaj en bajt), naša stalna navodila bajti / 2, slika 2000 žetonov, vsak vhodni žeton po ceni zapisa v predpomnilnik za 1 h (2× vhod), izhod = `max_tokens`; neznan model po ceni najdražjega. Velja za odgovor inštruktorja (in vsak dodaten krog orodij), povzetek pogovora, pregled sodbe in odgovora (Sonnet), ponovni odgovor, popravek, preverjanje za ponovno uporabo in kartice (dva modela), skener (branje in reševanje z eno ponovitvijo), branje zapisa, fotografijo urnika in anketo.
- **Ko rezerva ne gre več pod mejo**: »Razloži podrobneje« dobi cenejši način (Sonnet, Haiku z več razmisleka, Haiku, kratek način); brez prostora niti za najcenejši klic inštruktor odgovori z obvestilom o porabljenem paketu (429). Pregledi in popravki brez prostora odpadejo (odgovor ostane), odgovor se ne shrani za druge učence in kartice se ne ustvarijo. Šola brez prostora za najcenejši klic velja kot porabljena (učenec nadaljuje v brezplačnem paketu).
- **Kdo plača preverjanje**: preverjanje za ponovno uporabo in kartic (`server/verify.js`) je prej šlo na nikogar (vrsta `verify`, skupaj do 1 $ na dan); zdaj gre v porabo učenca, čigar odgovor se preverja.
- **Izbris profila ne ponastavi meje**: poraba ima lastnika računa (`usage.parent_id`, migracija iz `students`); poraba izbrisanih profilov ta mesec šteje v paket računa in v brezplačno mejo njegovih profilov. Ob izbrisu računa se lastnik odklopi (sprožilec v `server/accounts/schema.js`).
- **En števec**: strežnik in računi uporabljata isti `Usage` (prej dva: klepet ni poznal skupnega deleža družine `poolOf`).
- **Test** `test/marza-ai.test.js`: za vsak paket iz tabele spodaj najslabši primer ≤ 25 %; nastavitve skrbnika ne gredo čez; rezerva ≥ dejanskega stroška pri največjem vhodu in izhodu; zaporedni in hkratni klici ne gredo čez mejo; klepet, v katerem vsak odgovor stane največ, kolikor sme, ostane pod mejo in konča z 429.

Najslabši primer je vrednost paketa (meja + brezplačni rep, z rezervo vred), izračunana iz dejanskih cen modelov v `server/claude.js` (`PRICES`). Tabela: `node -e 'import("./server/meje-ai.js").then(m => console.table(m.aiCapRows()))'`.

| Paket | Plačilo (€) | Obdobje | Najslabši strošek AI ($) | Delež plačila |
|---|---:|---|---:|---:|
| OŠ, mesečno | 9,99 | mesec | 1,900 | 17,5 % |
| OŠ, šolsko leto | 8,25 | mesec | 1,700 | 19,0 % |
| SŠ, mesečno | 13,99 | mesec | 2,900 | 19,1 % |
| SŠ, šolsko leto | 11,58 | mesec | 2,600 | 20,7 % |
| Faks, mesečno | 19,99 | mesec | 4,500 | 20,7 % |
| Faks, študijsko leto | 16,58 | mesec | 3,800 | 21,1 % |
| Družina, mesečno | 18,99 | mesec | 3,200 | 15,5 % |
| Družina, šolsko leto | 15,75 | mesec | 2,600 | 15,2 % |
| Družina s študentom, mesečno | 27,99 | mesec | 5,500 | 18,1 % |
| Družina s študentom, šolsko leto | 22,42 | mesec | 4,300 | 17,6 % |
| 2 otroka, mesečno | 15,99 | mesec | 3,100 | 17,8 % |
| 2 otroka, šolsko leto | 11,58 | mesec | 2,200 | 17,5 % |
| Osebno ob šolski licenci, mesečno | 5,99 | mesec | 0,900 | 13,8 % |
| Osebno ob šolski licenci, šolsko leto | 4,08 | mesec | 0,600 | 13,5 % |
| 1 otrok, mesečno (INR) | 3,91 | mesec | 0,400 | 9,4 % |
| 1 otrok, šolsko leto (INR) | 2,86 | mesec | 0,300 | 9,7 % |
| 2 otroka, mesečno (INR) | 6,36 | mesec | 0,700 | 10,1 % |
| 2 otroka, šolsko leto (INR) | 4,65 | mesec | 0,500 | 9,9 % |
| 1 otrok, mesečno (PKR) | 4,20 | mesec | 0,400 | 8,8 % |
| 1 otrok, šolsko leto (PKR) | 3,00 | mesec | 0,400 | 12,3 % |
| 2 otroka, mesečno (PKR) | 6,60 | mesec | 0,700 | 9,8 % |
| 2 otroka, šolsko leto (PKR) | 4,75 | mesec | 0,500 | 9,7 % |
| 1 otrok, mesečno (BDT) | 3,84 | mesec | 0,300 | 7,2 % |
| 1 otrok, šolsko leto (BDT) | 2,80 | mesec | 0,300 | 9,9 % |
| 2 otroka, mesečno (BDT) | 6,29 | mesec | 0,600 | 8,8 % |
| 2 otroka, šolsko leto (BDT) | 4,67 | mesec | 0,500 | 9,9 % |
| 1 otrok, mesečno (NGN) | 4,13 | mesec | 0,400 | 8,9 % |
| 1 otrok, šolsko leto (NGN) | 2,93 | mesec | 0,400 | 12,5 % |
| 2 otroka, mesečno (NGN) | 6,60 | mesec | 0,700 | 9,8 % |
| 2 otroka, šolsko leto (NGN) | 4,72 | mesec | 0,500 | 9,7 % |
| 1 otrok, mesečno (GHS) | 4,43 | mesec | 0,500 | 10,4 % |
| 1 otrok, šolsko leto (GHS) | 3,12 | mesec | 0,400 | 11,8 % |
| 2 otroka, mesečno (GHS) | 7,13 | mesec | 0,800 | 10,3 % |
| 2 otroka, šolsko leto (GHS) | 4,99 | mesec | 0,600 | 11,1 % |
| 1 otrok, mesečno (KES) | 4,22 | mesec | 0,400 | 8,7 % |
| 1 otrok, šolsko leto (KES) | 3,03 | mesec | 0,400 | 12,1 % |
| 2 otroka, mesečno (KES) | 6,82 | mesec | 0,800 | 10,8 % |
| 2 otroka, šolsko leto (KES) | 4,87 | mesec | 0,500 | 9,4 % |
| 1 otrok, mesečno (ZAR) | 4,27 | mesec | 0,400 | 8,6 % |
| 1 otrok, šolsko leto (ZAR) | 3,12 | mesec | 0,400 | 11,8 % |
| 2 otroka, mesečno (ZAR) | 7,15 | mesec | 0,900 | 11,6 % |
| 2 otroka, šolsko leto (ZAR) | 5,00 | mesec | 0,600 | 11,0 % |
| 1 otrok, mesečno (EGP) | 4,23 | mesec | 0,400 | 8,7 % |
| 1 otrok, šolsko leto (EGP) | 3,12 | mesec | 0,400 | 11,8 % |
| 2 otroka, mesečno (EGP) | 6,78 | mesec | 0,800 | 10,9 % |
| 2 otroka, šolsko leto (EGP) | 4,96 | mesec | 0,500 | 9,3 % |
| 1 otrok, mesečno (PHP) | 4,05 | mesec | 0,400 | 9,1 % |
| 1 otrok, šolsko leto (PHP) | 2,90 | mesec | 0,300 | 9,5 % |
| 2 otroka, mesečno (PHP) | 6,51 | mesec | 0,700 | 9,9 % |
| 2 otroka, šolsko leto (PHP) | 4,71 | mesec | 0,500 | 9,8 % |
| 1 otrok, mesečno (IDR) | 3,95 | mesec | 0,400 | 9,3 % |
| 1 otrok, šolsko leto (IDR) | 2,91 | mesec | 0,300 | 9,5 % |
| 2 otroka, mesečno (IDR) | 6,45 | mesec | 0,700 | 10,0 % |
| 2 otroka, šolsko leto (IDR) | 4,79 | mesec | 0,500 | 9,6 % |
| 1 otrok, mesečno (VND) | 4,13 | mesec | 0,400 | 8,9 % |
| 1 otrok, šolsko leto (VND) | 2,93 | mesec | 0,300 | 9,4 % |
| 2 otroka, mesečno (VND) | 6,37 | mesec | 0,700 | 10,1 % |
| 2 otroka, šolsko leto (VND) | 4,80 | mesec | 0,500 | 9,6 % |
| 1 otrok, mesečno (XOF) | 4,42 | mesec | 0,500 | 10,4 % |
| 1 otrok, šolsko leto (XOF) | 3,18 | mesec | 0,400 | 11,6 % |
| 2 otroka, mesečno (XOF) | 7,16 | mesec | 0,900 | 11,6 % |
| 2 otroka, šolsko leto (XOF) | 5,08 | mesec | 0,600 | 10,9 % |
| 1 otrok, mesečno (USD) | 4,24 | mesec | 0,400 | 8,7 % |
| 1 otrok, šolsko leto (USD) | 3,05 | mesec | 0,400 | 12,1 % |
| 2 otroka, mesečno (USD) | 6,79 | mesec | 0,800 | 10,8 % |
| 2 otroka, šolsko leto (USD) | 4,89 | mesec | 0,500 | 9,4 % |
| Paket pred testom 7 dni | 5,49 | 7 dni | 0,800 | 13,4 % |
| Paket pred testom 14 dni | 8,49 | 14 dni | 1,500 | 16,3 % |
| Paket pred testom 30 dni | 13,99 | 30 dni | 2,900 | 19,1 % |
| Paket pred testom faks 7 dni | 6,99 | 7 dni | 1,100 | 14,5 % |
| Paket pred testom faks 14 dni | 11,49 | 14 dni | 2,300 | 18,4 % |
| Paket pred testom faks 30 dni | 19,99 | 30 dni | 4,500 | 20,7 % |
| Darilna koda OS (1 leto, na mesec) | 8,25 | mesec | 1,700 | 19,0 % |
| Darilna koda SS (1 leto, na mesec) | 11,58 | mesec | 2,600 | 20,7 % |
| Darilna koda FAKS (1 leto, na mesec) | 16,58 | mesec | 3,800 | 21,1 % |
| Darilna koda (stara, 49 €) | 4,08 | mesec | 0,600 | 13,5 % |
| Šolska licenca class (na učenca) | 1,67 | mesec | 0,450 | 24,8 % |
| Šolska licenca school (na učenca) | 1,17 | mesec | 0,310 | 24,4 % |
| Šolska licenca pilot (na učenca) | 1,00 | mesec | 0,270 | 24,8 % |
| Dokup 5 € | 5,00 | nakup | 1,000 | 18,4 % |
| Dokup 10 € | 10,00 | nakup | 2,280 | 21,0 % |
| Dokup 20 € | 20,00 | nakup | 4,830 | 22,2 % |

| Brez plačila | Meja ($) | Obdobje |
|---|---:|---|
| Brezplačni paket / gost (na profil) | 0,20 | mesec |
| Brezplačni paket / gost (vsi skupaj) | 10,00 | mesec |
| Preizkus (7 dni, ves račun) | 0,50 | mesec |
| Aktivacijska koda (ves račun) | 0,50 | mesec |
| Bonus za priporočilo (ves račun) | 0,50 | mesec |

Rezerva odgovora pri sistemskem promptu 50 KB in zgodovini 20 sporočil po 2 KB (Opus in Sonnet: 6 sporočil); dejanski odgovor stane običajno 3- do 10-krat manj.

| Način | Model | max_tokens | Rezerva enega odgovora ($) |
|---|---|---:|---:|
| lite | claude-haiku-5-5 | 1200 | 0,014 |
| chat | claude-haiku-5-5 | 3000 | 0,015 |
| think | claude-haiku-5-5 | 8000 | 0,017 |
| mid | claude-sonnet-5-5 | 6000 | 0,209 |
| deep | claude-opus-5-5 | 6000 | 0,418 |
