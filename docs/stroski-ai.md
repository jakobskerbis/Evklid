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
- **Varnostni pregled vsakega sporočila** (j 2026-11-10, PR #479, `server/nujno.js`, možnost B): ko lokalni zaznavalnik (`public/nujno.js`, strošek 0) ne najde ničesar, Haiku vzporedno z odgovorom inštruktorja prebere učenčevo sporočilo (kratko navodilo ~380 žetonov + sporočilo v oznakah `<sporocilo>`, do 2000 znakov), brez razmišljanja in predpomnilnika, `max_tokens` 16, rok 5 s, brez ponovitev; vrne eno besedo (vrsta nujnega primera ali NE). ~430 vhodnih in ~3 izhodni žetoni ≈ 0,00005 $ na sporočilo (najdaljše sporočilo ~0,00012 $). Tipičen učenec (200 sporočil na mesec) ~0,01 $ na mesec, zelo aktiven (750) ~0,04 $; vrsta `varnost`, `student_id NULL`: plača aplikacija, ne šteje v mejo učenca ali brezplačni bazen. Ne ob »Razloži podrobneje« (isto sporočilo) in ne ob porabljenem dobroimetju. Čez mejo porabe in ob izklopljenem klepetu ostane prejšnji pregled z varovalko `EVKLID_VARNOST_NA_DAN` (10 na profil na dan). `EVKLID_VARNOST_VSAKO=0` izklopi pregled vsakega sporočila. Neznan odgovor modela pri tem pregledu ne odpre okna (zapis v dnevnik), čez mejo ga odpre; zavrnitev modela (`stop_reason` `refusal`) odpre okno »stiska«. Živi preizkus filtra s pravim modelom: `docs/nujno-ziv-preizkus.md`.
- **Sprotni povzetek dolgega pogovora** (2026-11-04, `server/povzetek.js`): inštruktor dobi zadnjih 10–20 izmenjav; ko okno odreže starejših 10, jih Haiku (kratek način) strne v povzetek do 150 besed (naloga s števili, kaj je učenec že rešil in kje se je zmotil, kaj je bilo razloženo, kaj je odprto), ki gre pred prvo sporočilo v oknu. Povzetek se spremeni le ob novem rezu, zato predpomnilnik zgodovine deluje naprej. En klic na 10 izmenjav brez razmišljanja in brez predpomnilnika, največ 400 izhodnih žetonov (~0,0007 $, najslabše ~0,002 $), vrsta `povzetek`; ob napaki ali po 8 s gre zgodovina s prejšnjim povzetkom ali brez njega kot prej, nov poskus šele ob naslednjem rezu. Skrite opombe (pola z našo rešitvijo, preverjen račun) ne gredo v povzetek. Povzetek je v izvozu podatkov ob pogovoru (`summary`). Shranjen šifriran (tabela `conversation_summaries`), izbriše se s pogovorom. `EVKLID_CHAT_SUMMARY=0` izklopi. Ne velja za kratko zgodovino Opusa ob »Razloži podrobneje« (zadnje 3 izmenjave).
- **Srednja šola: Haiku z več razmisleka** (j 2026-11-04 »najdi najboljšo rešitev« po primerjavi modelov, `scripts/primerjava-modelov.js`, ocenjevalec Opus): na 50 rešenih primerih iz lekcij je imel navadni Haiku 12 % napak (OŠ 0 %, SŠ 27 %, tekmovanja 13 %, faks 8 %), Sonnet 2 % (SŠ 0 %), a je ~15–20× dražji (~3 cente na odgovor). Haiku z več razmisleka (način `think`) je na istih 23 nalogah SŠ in tekmovanj imel 4 % napak (SŠ 7 %, tekmovanja 0 %) za ~0,21 centa na odgovor. Zato srednješolci s plačljivim paketom, preizkusom ali šolsko licenco privzeto dobijo način `think` (tekmovanja ga že imajo), razen v varčnem načinu; brezplačni paket ostane pri navadnem Haikuju (0,2 $ na mesec bi sicer zadoščalo za ~3× manj odgovorov). Odgovor je nekaj sekund počasnejši; `EVKLID_MAX_TOKENS_THINK` je zato 8000 (prej 5000, razmišljanje je lahko odrezalo odgovor). Prva »Razloži podrobneje« je pri SŠ isti model s podrobnejšo prošnjo, druga gre višje kot doslej. Večina napak navadnega Haikuja je bila v stranskih trditvah in izmišljenih dodatnih vajah, ne v končnem rezultatu. `EVKLID_SS_THINK=0` vrne navadni Haiku.
- **Lekcija iz učbenika pri prvem vprašanju** (2026-11-04, `server/lekcija-za-vprasanje.js`): pri prvem vprašanju prostega pogovora (brez teme učne poti in brez pole) strežnik lokalno poišče lekcijo učbenika, ki se z vprašanjem jasno ujema (predmet učenca, do njegovega razreda, iskanje po besedah s težo redkosti, brez klica modela). Njen povzetek (do 1200 znakov) gre kot skrita opomba `<lekcija_ucbenika>` v prvo sporočilo: inštruktor razlaga z istimi oznakami in postopki kot učbenik in lahko učenca napoti na lekcijo. Opomba je shranjena s sporočilom, zato se začetek zgodovine ne spreminja (predpomnilnik). Strošek: ~300–500 vhodnih žetonov enkrat na pogovor (Haiku ~0,00005 $, nato iz predpomnilnika). Na vzorčnih vprašanjih najde lekcijo pri približno polovici vprašanj, za katera lekcija obstaja, in nobene pri klepetu ali vprašanjih z drugih področij; ena sama beseda iz večbesednega naslova ne zadošča (kocka pri metu kocke ni »Kocka in kvader«), tema brez lekcije ne dobi sosednje lekcije. j vklopil 4. 11.; `EVKLID_LESSON_SEARCH=0` izklopi.
- **Cena zapisa v predpomnilnik za 1 uro** (2026-11-04): zapis za 1 uro (stalni del prompta za Opus in Sonnet) stane 2× vhod, ne 1,25× kot zapis za 5 minut; `costUsd` ga zdaj šteje po `usage.cache_creation`, prej je bil podcenjen (3 nadgrajeni odgovori Opusa na strežniku so bili zabeleženi po ~11 centov, večinoma zapis; dejansko so stali do ~60 % več). Prilagodljiv čas hrambe (1 ura le ob razmikih 5–60 minut) je bil preverjen in opuščen: pri nekaj klicih Opusa na popoldne bi stal več, kot prihrani pri osamljenih klicih.
- **Dnevna meja vprašanj raste s proračunom** (j, 2026-11-04: namesto stalne meje naj se prilagaja proračunu AI): stalni meji paketov (Osebno 60, šolska licenca 15, skupaj 75) sta spodnja meja, zato obljube v ceniku in na strani za šole veljajo naprej. S proračunom meja zraste na (preostali del učenčevega deleža na začetku dneva + njegov del dokupljenega kredita, kredit računa razdeljen med otroke) / dni do konca meseca (z današnjim) / `EVKLID_QUESTION_USD` (0,005 $), največ `EVKLID_DAILY_QUESTIONS_MAX` (200). Lastna vprašanja meje čez dan ne znižajo (premakne jo lahko nov aktiven učenec ali poraba kredita); zadnji dan v mesecu dobi učenec ves ostanek, 1. v mesecu se začne znova. Strošek vprašanja je stalna ocena, ne izmerjeno povprečje, da nadgradnje modelov ob neporabljenem proračunu meje ne znižajo. Brezplačni paket ima svojo mejo (`EVKLID_FREE_DAILY_QUESTIONS`, 10). Mesečni delež še vedno velja: kdor vsak dan porabi več, kot da delež, ga porabi pred koncem meseca in nadaljuje z dokupom. Primer: pri 200 $ in 5 enakih plačljivih učencih (~38 $ na učenca) je meja 200 na dan; pri 200 enakih plačljivih učencih (~0,97 $ na učenca, ~6 na dan) velja stalnih 60, delež pa zadošča za ~190 vprašanj na mesec.
- **Omejitve na učenca**: Opus največ 5× na dan; nad 1 $ na mesec podrobne razlage pripravi Haiku z več razmisleka (učenec vidi kratko opombo); nad 3 $ na mesec inštruktor počaka do 1. v mesecu, Vadnica deluje naprej.
- **Brez klica modela**: pri »Vprašaj Evklida« iz Vadnice prvi odgovor sestavi koda iz generatorja (podatki, iskano, namig, vprašanje; formula ostane skrita). Prvi odgovor (tudi začetek teme z učne poti, »Začniva s temo …«) se shrani in ponovno uporabi pri učencih z enakimi nastavitvami in šibkimi točkami, a samo, če prompt ne nosi osebnih podatkov (PR #484, `hasPersonalPrompt` v server/app.js): brez zanimanj, cilja, urnika, šibkih točk v prostem pogovoru, lastnih rezultatov (Vadnica, pogovori s temo, stopnja teme), jezika ali imena v nelatinični pisavi. Pri aktivnih učencih zato skoraj ni zadetkov (ocena pregleda: največ ≈ +10 $/mesec pri 1 000 učencih); osebni odgovori ne sprožijo več dvojnega preverjanja (Sonnet + Opus), ki ga plača aplikacija, zato je neto verjetno prihranek.
- **Krajši odgovori**: zgornja meja žetonov po načinu (3000, lahki način 1200, Opus 6000) namesto 8000 za vse.
- **Branje rokopisa in anketa**: brez razmišljanja (samo prepis oz. kratko vprašanje).
- **Prompt**: razlage možnih vrednosti nastavitev so v stalnem (predpomnjenem) delu, v delu za učenca ostanejo samo vrednosti.
- **Pregled**: Nastavitve → Poraba AI kaže strošek v €, povprečje na učenca, na odgovor, oceno za mesec, število odgovorov brez AI in porabo po modelih. Starš v zavihku Račun vidi delež mesečne omejitve za vsakega otroka (brez zneskov).
- **Nastavitve iz klepeta** (j, 2026-10-29): orodji `get_settings` in `change_settings` (server/chat-settings.js, seznam nastavitev v public/settings-registry.js) sta stalni in pred sistemskim promptom, zato sta v istem predpomnjenem začetku (~1500 žetonov, pri Haiku branje iz predpomnilnika ~0,00002 $ na sporočilo). Drugi klic modela samo, ko učenec res spremeni nastavitev. Finančnih in osebnih podatkov orodji ne poznata.

## Sprotno preverjanje odgovorov (j, 2026-10-30)

j: »Kako vemo, da Haiku najprej ne da napačnega rezultata?« Koda (`server/live-check.js`) preveri vsak odgovor brez stroška: pred klicem reševalnik (`public/scan/solvecore.js`) reši enačbo, sistem, odvod ali račun z vsaj dvema operacijama iz učenčevega sporočila, model pa dobi preverjen rezultat v skriti opombi (~80 žetonov vhoda, samo v tisti potezi; predpomnjen začetek ostane enak); po odgovoru koda preračuna vsak račun in končne vrednosti neznank. Model se pokliče le ob najdeni napaki (en kratek »Popravek:« istega modela, vrsta `popravek`, ~0,001 $ pri Haikuju) in za pregled s Sonnetom, kjer je tveganje večje (tekmovanja, fakulteta, »Razloži podrobneje«; od 2026-11-11 tudi, kadar je koda preverila račun, ker koda trditev ne preveri), in pri SŠ za odgovore z označeno dodatno vajo ali z okvirjem »Zapomni si« v rešeni nalogi (2026-11-11; OŠ z `EVKLID_LIVE_REVIEW_OS=1`): samo Haikujevi odgovori, ne v lahkem načinu, ne v brezplačnem paketu, ne v varčnem načinu proračuna (raven ≤ 0).
  - **Meje pregleda** (vse dnevne): skupaj `EVKLID_LIVE_CHECK_DAILY_USD` (0,30 $, j 2026-10-30; največ ~9 $ na mesec) za vrsti `preverjanje` (tekmovanja, fakulteta, podrobna razlaga) in `preverjanje-sola` (SŠ/OŠ); od tega SŠ/OŠ največ `EVKLID_LIVE_REVIEW_SS_DAILY_USD` (privzeto pol skupne meje, 0,15 $), da šolski pregledi ne porabijo vsega za tekmovanja in fakulteto; na učenca največ `EVKLID_LIVE_REVIEW_PER_PUPIL` (6) pregledov na dan. Dnevni bazen rezervira `EVKLID_LIVE_REVIEW_RESERVE_USD` (0,02 $, pričakovani strošek) na pregled v teku, zato ga vzporedni pregledi presežejo največ za razliko do dejanskega stroška; meja učenca je rezervirana po najslabšem primeru (~0,10 $), strošek gre v mejo učenca, zato marža ≥ 75 % ostane.
  - **Strošek:** ~0,01–0,02 $ na pregled (Sonnet razmišlja); »Popravek:« je dodaten klic (Haiku `think`, ~0,001–0,005 $, vrsta `popravek`) in ni v dnevni meji pregledov, le v meji učenca. Pregledov pri fakulteti je zdaj več (preverjen račun jih ne izključi). Pilot (10 dijakov, ~100 odgovorov na dan): ocena ~20–30 upravičenih odgovorov SŠ na dan, šolski del 0,15 $ zadošča za ~8–15, zato bo meja v pilotu najbrž vezala.
  - **Rok:** pregled, ki ne konča v `EVKLID_LIVE_REVIEW_TIMEOUT_MS` (25 s) ali ga prekine učenec, odpade; odgovor ostane brez popravka.
  - **Preskočeni pregledi** (meja `dan`, `sola`, `ucenec`, `meja_ucenca`, rok `rok`) se štejejo po dnevu in stopnji v `kv` pod ključem `pregledi_preskoceni` (zadnjih 60 dni), da se meja po pilotu nastavi iz podatkov: `sqlite3 data/evklid.db "SELECT value FROM kv WHERE key='pregledi_preskoceni'"`.
  - `EVKLID_LIVE_CHECK=0` vse izklopi.

j (2026-11-01, digitalni razred): »Naj se nikoli ne zgodi«, da inštruktor potrdi napačen ali zavrne pravilen odgovor. Zato `server/live-check.js` 4: ko učenec pošlje rezultat ali trditev (število, »=« ali odgovor na inštruktorjevo vprašanje), se odgovor ne pretaka, dokler sodba ni preverjena. Če je naloga iz prvega sporočila rešljiva z reševalnikom, koda učenčevo vrednost primerja z rešitvijo in model dobi sodbo v skriti opombi (brez stroška). Sicer, kadar odgovor izreče sodbo (»točno«, »ni prav« …), jo pregleda Sonnet (vrsta `sodba`, ločen dnevni števec od vrste `preverjanje`, ~0,005–0,01 $, vsi modeli in paketi, ne v lahkem načinu, največ `EVKLID_VERDICT_DAILY_USD` = 2 $ na dan, ~200–400 pregledov); ob napačni sodbi isti model odgovori še enkrat z ugotovitvijo v skriti opombi (vrsta `popravek`). Učenec vidi šele končni odgovor (zamik nekaj sekund).

## Natančnost inštruktorja: meritve (j, 2026-11-10)

Stran evklid.app/zakaj-evklid pokaže zadnjo meritev iz `docs/meritve/natancnost-<datum>.json` (server/vidnost.js; test/vidnost.test.js preveri, da se stran ujema z datoteko). Na stran gredo samo izmerjene številke.

<!-- NATANCNOST:ZACETEK (piše scripts/primerjava-modelov.js, ne urejaj ročno) -->
Zadnja meritev: 4. 11. 2026, 50 rešenih primerov iz lekcij, ocenjevalec Opus (model AI) (`docs/meritve/natancnost-2026-11-04.json`).

| Kaj je merjeno | Odgovori z napako | Primeri |
|---|---|---|
| Hitri model | 12 % | 50 |
| Hitri model z več razmisleka (samo naloge srednje šole in tekmovanj) | 4 % | 23 |
| Zmogljivejši model | 2 % | 50 |

- Merjen je sam model (skripta mu naroči, naj nalogo reši po korakih), brez sprotnega preverjanja s programom (server/live-check.js).
- Meritev je bila pred spremembo navodil inštruktorja (docs/spremembe-prompta.md, 4. 11.).
- Ocenjevalec je model AI (primerja z rešitvijo iz lekcije), ne človek.
- Meritve celega odgovora s preverjanjem še ni: node scripts/primerjava-modelov.js --s-preverjanjem.
<!-- NATANCNOST:KONEC -->

**Meritev celega odgovora (s preverjanjem s programom).** `node scripts/primerjava-modelov.js --s-preverjanjem --max-usd 5` pošlje rešene primere iz lekcij skozi pravo pot klepeta (isti prompt, model po stopnji kot pri plačljivem paketu, `server/live-check.js`), vsakega dvakrat: z izklopljenim preverjanjem (`EVKLID_LIVE_CHECK=0`, sam model) in z vklopljenim (skrita opomba s preverjenim rezultatom, preračun računov, »Popravek:«, pregled z zmogljivejšim modelom pri tekmovanjih, fakulteti in odgovorih SŠ z vajo ali okvirjem »Zapomni si«). Končno besedilo oceni Opus proti rešitvi iz lekcije; oznako »Popravek:« skripta pred oceno odstrani, da ocenjevalec ne ve, kateri pogoj ocenjuje, šteje pa končno stanje odgovora po popravku. Koda dodatno preveri, ali so končna števila iz vrstice »Odgovor« v odgovoru (neujemanja so izpisana za ročni pregled, ne štejejo samodejno kot napaka). V povzetku so samo primeri, ocenjeni v obeh pogojih, delež odgovorov s podanim rezultatom in število parov, ki so se spremenili v vsako smer (bolje/slabše).

- **Kaj šteje kot napaka:** ocena »napaka« (napačen rezultat, formula ali trditev). Manjše napake so štete posebej; odgovor, ki samo vodi z vprašanji, šteje brez napake.
- **Šum:** oba pogoja sta ločena klica modela, isti model na isto nalogo ne odgovori vedno enako. Razlika nekaj primerov je lahko naključna; zato sta v povzetku para »bolje« in »slabše«, ne samo razlika.
- **Vzorec:** privzeto 100 primerov (OŠ 30, SŠ 30, tekmovanja 15, fakulteta 25; en primer na lekcijo, težji imajo prednost, seme 1), razvrščenih izmenično po stopnjah. Najmanj 40 primerov v obeh pogojih, sicer povzetka ni in `--iz-json` ga zavrne.
- **Strošek:** ocena ~0,095 $ na primer (večino stane ocenjevalec Opus), vseh 100 primerov ~9,5 $ in ~2 uri. Meja `--max-usd` velja za ves strošek meritve (tudi prejšnjih prekinjenih zagonov); zagon se ustavi, ko pod mejo ni več prostora za najdražji možni par (~1 $). Z `--max-usd 5` je to po previdni oceni 45 do 60 primerov (~1 ura). Neveljavna meja (vejica, 0, prazno) ustavi skripto pred klici.
- **Prekinitev:** vmesne vrstice z odgovori so v `data/natancnost-napredek.json`; isti ukaz nadaljuje, že ocenjeni odgovori se ne plačajo znova (višja `--max-usd` doda primere). `--znova` začne na novo.
- **Kaj meritev izklopi:** predpomnilnik odgovorov, nadgradnje po mesečnem proračunu, varnostni pregled sporočil in dnevno mejo pregledov z zmogljivejšim modelom (v aplikaciji 0,30 $ na dan za vse učence; ko je porabljena, pregleda ni). Meri torej plačljivi paket, dokler je meja prosta; stran to pove. `--resnicna-meja` pusti mejo aplikacije (polje `meja_pregledov` v JSON, besedilo strani se prilagodi). Uporabi bazo v pomnilniku, prave baze se ne dotakne.
- **Brez ključa** (ali z `EVKLID_MOCK=1`) skripta konča brez klica in brez zapisa; `--dry` izpiše izbor in oceno stroška.
- **Zagon na Renderju:** Render → evklid → **Shell**, vpiši `node scripts/primerjava-modelov.js --s-preverjanjem --max-usd 5` in počakaj do konca (med zagonom ne združuj ničesar v main, nova objava prekine Shell; po prekinitvi isti ukaz nadaljuje, če je `data/` na trajnem disku). Skripta teče ob aplikaciji kot drug proces (približno 200 do 250 MB pomnilnika: v preizkusnem načinu izmerjeno 203 MB za zagon skozi klepet in 158 MB za izbor primerov; s pravim API ni izmerjeno). Na strežniku ne piše v `docs/`: na koncu izpiše blok »POVZETEK ZA REPOZITORIJ«. Kopiraj ga in pošlji Claudu; ta ga shrani v datoteko in požene `node scripts/primerjava-modelov.js --iz-json <datoteka>`, ki preveri obliko in zapiše `docs/meritve/natancnost-<datum>.json` ter zgornjo tabelo (brez klicev).

## Števec porabe za skrbnika (2026-10-29)

- V zgornji vrstici je števec porabe AI (€ danes) za vse profile. Vidi ga samo skrbnik: na računalniku, kjer teče Evklid, ali račun z e-naslovom v `EVKLID_ADMIN_EMAILS`. Na računalniku lahko v števcu z gumbom »Pokaži števec tudi na mojem telefonu« svoj račun označiš kot skrbniški.
- Prek povezave za telefon (ngrok) ga drugi ne vidijo; `/api/usage` jim vrne 403.
- Klik odpre pregled: danes, ta mesec, ocena za mesec, po profilih z vrstico do mesečne meje, ter predlog meje in cene (`server/advice.js`). Predlog ničesar ne spremeni sam: meja je `EVKLID_STUDENT_MONTHLY_USD`, cena `server/accounts/plans.js`.
- Pravila predloga: najprej kakovost (če je ≥ 5 % učencev pri meji ali blizu nje, dvigni mejo do višine, pri kateri učenec še prinese 4 €), nato dobiček (cilj 6 € na naročnino). Cena po zanimanju iz končanih 7-dnevnih preizkusov (vsaj 10): ≥ 35 % naročnin → preizkusi +20 % za nove, ≤ 8 % → najprej izboljšaj prvi teden.

## Pilot in lastnik (j, 2026-11-06 12:14)

- **Član pilota**: potrjen e-naslov v `EVKLID_PILOT_EMAILS` (ločila `,` `;` ali presledek), do vključno `EVKLID_PILOT_DO` (privzeto 2026-12-15, do polnoči po slovenskem času; neobstoječ dan ali datum več kot eno leto naprej → privzeti datum in opozorilo v dnevniku). **Vsi profili računa** (j 2026-11-06 17:0x; med pilotom račun sme imeti do 4 profile, j 18:3x – po koncu ostanejo, novih ni nad paketom) imajo brezplačno mejo plačanega paketa: en profil = paket stopnje (`levelGuarantee`/`guaranteeUsd`), več profilov = ustrezna Družina s skupnim deležem (`familyPlanFor` + `planGuarantee`, j 19:0x), kot plačujoča družina (server/accounts/pilot-meja.js); strošek AI krije j. Meja velja za koledarski mesec. Stopnja je zaklenjena na RAČUN in mesec (najvišja stopnja profilov ob prvem pogledu v mesecu; mesečna meja in zaklep potrdil j 2026-11-06 19:5x): menjava stopnje, izbris profila ali nov profil višje stopnje sredi meseca meje ne dvignejo (in ne odprejo višjih stopenj), naslednji mesec velja nova. Poraba se šteje po e-naslovu: izbris računa in nov račun z istim naslovom meje ne ponastavita (ob izbrisu se do konca meseca zapišeta samo HMAC naslova s strežniško skrivnostjo in znesek; zapisi preteklih mesecev se brišejo ob zagonu in vsakih 30 min, ob koncu pilota vsi; zaklep stopnje je na računu in se ob izbrisu profila NE briše (izbris profila meje ne ponastavi), ob izbrisu računa pa se zaklep (stopnja in oblika meje) prenese v isti zapis HMAC, da nov račun z istim naslovom v istem mesecu podeduje zaklep (pregled #477 A3-1); public/zasebnost.html, besedilo potrdil j 2026-11-06 19:5x). Pilot in lastnik ne vidita ponudb (paket pred testom, naročnina, dokup). Za naslove s seznamov strežnik nikoli ne vrne razvojne povezave za potrditev. Po datumu konca račun samodejno spet dobi svoj običajni paket. Prava plačana naročnina ostane naročnina.
  - **Oblika meje (en profil ali Družina)**: `PILOT_LOCK_PROFILES` v server/accounts/pilot-meja.js (odločitev j, pregled #477 A3-2). `true` (privzeto): oblika ob prvem pogledu v mesecu velja ves mesec – nov (tudi prazen) profil sredi meseca meje ne dvigne na Družino, profili si delijo mejo enega paketa. `false`: oblika sproti po številu profilov.
  - **Zavihek Račun in nakupi** (pregled #477 B3): pilot vidi »Pilot: poln paket brezplačno do {datum}, do 4 profilov« (lastnik »Skrbnik: poln paket, inštruktor brez meje«) namesto preizkusa ali brezplačnega paketa; izbira naročnine in dokup sta skrita (splet in mobilna aplikacija), strežnik zavrne naročnino (`/api/billing/checkout`), dokup (`/api/billing/credit`) in paket pred testom (409). E-pošta ob 80 % / 100 % je brez stavka o dokupu; otrok ob meji dobi `block.shareOut` (»… Spet ga dobiš 1. v mesecu«), ne »obdobja paketa«. Nakupa v App Store / Google Play strežnik ne more preprečiti (le skrit je).
  - **Ključ HMAC**: `auditSecret` (iz `EVKLID_DATA_KEY`, brez ključa naključna skrivnost v bazi). Ob menjavi `EVKLID_DATA_KEY` se zapisi pilot_prej_* tekočega meseca ne ujemajo več (izbris + nova registracija tisti mesec spet dobi polno mejo) – ključa med pilotom ne menjaj.
  - **Meja meseca**: mesec meje in zaklepa je koledarski mesec po UTC (`datetime('now','start of month')`), konec pilota pa polnoč po slovenskem času. Prvi dan meseca od 0:00 do 1:00 (pozimi; poleti do 2:00) po slovenskem času še velja meja prejšnjega meseca – zamik, ne dodatna meja.
- **Lastnik**: potrjen e-naslov v `EVKLID_ADMIN_EMAILS`. Inštruktor brez meje (brez trde meje, dnevne meje vprašanj in zaustavitve zaradi proračuna); ustavi ga le prazno dobroimetje API. Poraba se še vedno zapiše. Zastavica `is_admin` v bazi in nepotrjen e-naslov izjeme ne dajo. **Vsak** potrjen naslov v `EVKLID_ADMIN_EMAILS` ima neomejen AI (tudi, če je dodan samo za vpogled v porabo); seznam se razbere enako kot za skrbniške pravice.
- **Poročilo marže** (števec porabe → predlog): pilot in lastnik nista v povprečju in marži plačnikov; prikazana sta posebej (število profilov, strošek ta mesec, ocena za mesec).

## Mesečni proračun API in dokup porabe (j, 2026-10-30)

j: izbira modela naj porabi čim bližje 200 $ kredita na mesec (Claude Max), a ga ne preseže; 200 $ si delijo učenci po paketu, nad svojim delom lahko dokupijo porabo, od nakupa ostane vsaj polovica.

- **Proračun** (`server/proracun.js`, `server/usage.js`): znesek je `EVKLID_MONTHLY_BUDGET_USD` (render.yaml 200), skrbnik ga spremeni ali doda kupljeni API kredit v števcu porabe (Poraba AI → Mesečni proračun API; shrani se v tabelo `kv`). Inštruktor se ustavi `EVKLID_BUDGET_RESERVE_PCT` (3 %) pred mejo, zato tudi hkratni odgovori ne gredo čez. Ni v nastavitvah iz klepeta (finančni podatek).
- **Raven modelov po hitrosti porabe** glede na del meseca, ki je minil: pod polovico načrta Opus tudi za običajne odgovore, pod 80 % Sonnet, okoli načrta kot doslej, nad 110 % samo hitri model (tudi »Razloži podrobneje«), zadnjih 5 % samo hitri model, nato ustavljeno. Ko je danes porabljeno več kot 2× dnevnega deleža (`EVKLID_BUDGET_BURST`), nadgradnje počakajo do jutri. Z več učenci poraba raste in raven sama pade.
- **Kdo dobi nadgradnjo**: Osebno do Opusa, aktivacijska koda in šolska licenca največ Sonnet, brezplačni paket nikoli (ostanejo tudi njegove stare meje), lahki način nikoli. Nadgrajen odgovor ohrani celo okno pogovora; v porabi je vrsta `boost`.
- **Delitev po profilih**: proračun se deli med učence, ki so v zadnjih 30 dneh uporabljali AI, po utežeh: naročnina po mesečni ceni na otroka v € (9,99), preizkus, koda, bonus in paket pred testom kot 9,99, šolska licenca 2 (`EVKLID_SHARE_SCHOOL`), brezplačni 1 (`EVKLID_SHARE_FREE`). Pri 80 % svojega dela učenec ne dobi več nadgradnje ne Opusa, pri 100 % inštruktor počaka do 1. v mesecu ali do dokupa. S proračunom stari meji na učenca (1 $ / 3 $) ne veljata.
- **Zajamčeni AI naročnine** (j 2026-11-04, `server/accounts/plans.js`, »Cene z najmanj 75 % dobička«, Predlog A): na profil na mesec OŠ 1,9 $, SŠ 2,9 $, faks 4,5 $ (letni paket 1,7 / 2,6 / 3,8 $; od 2026-11-06 največ 25 % cene brez DDV: faks 4,452 $, SŠ letno 2,58 $, faks letno 3,693 $, glej »Trda meja AI«); Družina en skupen delež za ves račun 3,5 $ (letno 2,9 $), Družina s študentom 5,5 $ (letno 4,3 $); Osebno ob šolski licenci 0,9 $ (šolsko leto 0,6 $); regijski paketi po pravilu 75 % iz cene v € (fiksni tečaji `EUR_PER_UNIT`). Paketi pred testom: OŠ/SŠ 0,8 / 1,5 / 2,9 $, faks 1,1 / 2,3 / 4,5 $. Vrednosti so ves mesečni strošek AI paketa (trda meja): podrobne razlage do vrednosti / 1,15 (to vidi učenec kot »še N razlag«), nato hitri model (Haiku) do meje (`FAST_TAIL` 15 % podrobnega dela, `detailedShare`), nato dnevna meja brezplačnega paketa do 1. v mesecu ali do dokupa.
- **Dokup** (`server/placila/krediti.js`, zavihek Račun): samo paketi 5 / 10 / 20 € (poljubnega zneska ni več, j 2026-11-04), kredit po pravilu 75 % (j 2026-11-04): (plačilo × 0,235 − 0,25 €) / 0,92 v $, od 2026-11-06 največ 25 % plačila brez DDV po najvišji stopnji EU (27 %): 5 / 10 / 20 € → 1,00 / 2,13 / 4,27 $ (`EVKLID_CREDIT_SHARE` ga lahko le zniža); učenec vidi samo ~število pogovorov, vezan na račun, velja za vse profile, ne poteče. Plača polnoleten imetnik računa z vpisanim datumom rojstva, preverjeno na strežniku (Stripe, obe potrditvi kot pri paketu pred testom). Poraba iz kredita ne šteje v skupni proračun, zato mora biti na API računu toliko dodatnega dobroimetja (samodejno polnjenje v konzoli Anthropic). Vračilo ali spor kredit odvzame; skrbnik vrne največ neporabljeni del (izračun na `GET /api/admin/withdrawal/:parentId`, `credits`).
- **Ni dobroimetja**: ob napaki »400 ni dobroimetja« inštruktor 10 minut ne kliče API-ja in pokaže jasno sporočilo; števec porabe to pokaže skrbniku.
- Poraba zunaj aplikacije z istim ključem (npr. simulacije na j-jevem računalniku) se ne šteje: zanjo naj bo ločen ključ ali manjši znesek proračuna.

## Trda meja AI: največ 25 % plačila brez DDV (j 2026-11-06 6:40, popravki po pregledih ~9:00)

j: »privzeto VEDNO ≥ 75 %« – strošek AI (vhodni in izhodni žetoni, predpomnilnik, skener, slike, ponovni poskusi, prekinjeni odgovori) ne sme preseči 25 % tega, kar uporabnik plača, za vsak paket in način. Brezplačni paketi imajo nizko stalno mejo. Cene niso spremenjene (to odloča j), samo meje porabe.

**Odločitve j (6. 11. ~9:00):**
- 25 % se računa od cene **brez DDV** države kupca (j 12:53; Slovenija 22 %, `VAT_RATES` v `server/accounts/plans.js`; neznana država 27 %), od **dejanskega plačila** obdobja (promocijske kode, proracije, vračila) in s **tečaji z rezervo** (glej »Krog 3« spodaj). Šolske licence: 22 % (status DDV šolskih cen še ni potrjen, `server/sole.js`).
- Preverjanje odgovorov in kartic iz pogovora (`answer_cache`, dva modela, `server/verify.js`) plača **aplikacija** iz skupnega dnevnega zneska `EVKLID_VERIFY_DAILY_USD` (1 $), ne meja učenca. Rezervacija je trda tudi tu (`usage.appHold`). Brezplačni profili dobijo kartice.
- **Odstop v 14 dneh**: vrne se del plačila za neporabljeno storitev, manjši od deleža preostalega časa in deleža neporabljene meje AI (`withdrawalRefundCents` v `server/accounts/billing.js`). Skrbnik vidi izračun na `GET /api/admin/withdrawal/:parentId` (samo prikaz; vračilo izvede v Stripu). Novo besedilo potrditve pred plačilom (`WITHDRAWAL_TEXT`, `pay.withdrawal` v 33 jezikih). **Besedilo pred zagonom plačil preveri pravnik (to ni pravni nasvet).**
- **Šolska licenca s ceno 0** (podarjena, pilot brez plačila): meja kot brezplačni paket, 0,2 $ na učenca na mesec; skrbnik ob vnosu take licence dobi opozorilo (`warning` v odgovoru).

**Kako deluje:**
- **Meja paketa** (`aiCapFromEur`): 25 % plačila brez DDV na mesec (letni paket in darilo: cena / 12; paket pred testom: ves paket; dokup: ves nakup), preračunano z 0,92 € za 1 $ (previdno). Zgornja meja velja za vse, tudi za `EVKLID_AI_GUARANTEE_*_USD`, `EVKLID_SCHOOL_AI_EUR`, mejo licence skrbnika (`ai_cap_usd_month`), shranjeno mejo paketa pred testom in kredit iz dokupa (10 € → 2,22 $, 20 € → 4,45 $).
- **Obdobje meje**: meja velja za plačano obdobje, ne za koledarski mesec. Naročnina, darilo in koda: mesečna okna, sidrana na konec obdobja (letni paket 12 oken). Preizkus (7 dni) in bonus (30 dni): ena meja za ves paket. Neuspelo plačilo (`past_due`): Stripe premakne konec obdobja, a nova meja se ne odpre, dokler račun ni plačan.
- **Naročnina v preizkusni dobi pri Stripu** (`trialing`, še brez plačanega računa): velja meja paketa, ki dejansko teče (preizkus, koda, darilo ali bonus), šele po prvem plačilu meja plačanega paketa.
- **Brez plačila** (`server/meje-ai.js`): brezplačni paket in gost 0,2 $ na profil na mesec in 10 $ vsi skupaj; preizkus, aktivacijska koda, bonus in stari profili brez računa 0,5 $ za ves račun (tudi pri več sedežih: brezplačni rep je znotraj te meje), vsi taki računi skupaj največ `EVKLID_NOPAY_POOL_USD` (privzeto 20 $ na mesec, **potrdi j**). Gost, ki se registrira: njegova poraba ostane v kvoti omrežja.
- **Uveljavitev na strežniku** (`server/usage.js` `hold`, `headroom`, `capsFor`): pred vsakim klicem modela strežnik rezervira najvišji možni strošek klica in klic dovoli le, če poraba + rezervacije klicev v teku + ta rezerva ostanejo pod vsemi mejami profila. Rezerva: vhod ≤ bajti besedila, naša stalna navodila bajti / 2, slika 4800 žetonov (modeli 4.7+ do 2576 px), vsak vhodni žeton po ceni zapisa v predpomnilnik za 1 h, izhod = `max_tokens`; neznan model po ceni najdražjega. Velja za odgovor inštruktorja in vsak dodaten krog orodij (tudi pri ponovnem odgovoru po napačni sodbi), povzetek, pregled sodbe in odgovora, popravek (rezerva po načinu popravka, pri Haikuju »think«, 8000 žetonov), skener, branje zapisa, urnik in anketo. Napaka pred pretakanjem sprosti pogovor in rezervacijo.
- **Prekinjen odgovor** (učenec zapre aplikacijo): API pošlje končni izhod (`message_delta`) šele tik pred koncem, zato prekinjen klic zapiše izhod = `max_tokens` kroga (razmišljanje je plačano, četudi ga ne vidimo), vsaj bajte vseh delt; brez `message_start` vhod iz rezerve. Prekinjeni odgovori štejejo v dnevno mejo Opusa, števec »Razloži podrobneje« se ob prekinitvi ne vrne. Prekinjen povzetek se zapiše.
- **Kredit**: porabi se nad mejo paketa tudi brez skupnega proračuna (`EVKLID_MONTHLY_BUDGET_USD=0`); paket pred testom porabe iz kredita ne šteje dvakrat; vsi profili računa s kreditom imajo skupni ključ `credit:<račun>`, da hkratni klici kredita ne presežejo.
- **Paket pred testom**: ko ne ostane prostora niti za najcenejši klic, profil preide v brezplačni paket (»Paket pred testom je porabljen. Nadaljuješ v brezplačnem paketu.«), ne ostane zaklenjen.
- **Sporočila (429)**: koda meje, ki je vezala (brezplačni paket z namigom za gosta ali starša); preizkus in bonus: poziv k naročnini; naročnina: »spet jih dobiš z novim obdobjem paketa«; če bi šel odgovor v novem pogovoru: »Ta pogovor je predolg za inštruktorja. Začni nov pogovor.« Najcenejši klic je dejanska rezerva »lite« (sistemski prompt, orodja, kratko vprašanje).
- **Fotografije v dolgem pogovoru** (`staleImages` v `server/usage.js`): slika gre modelu v svojem in naslednjem sporočilu (»Razloži podrobneje«, takojšnje vprašanje o sliki); v starejših sporočilih jo zamenja kratko besedilo (nalogo je inštruktor prepisal: »Prebral sem: …«). Baza se ne spremeni; sporočilo se spremeni enkrat in nato ostane enako, zato predpomnilnik dela naprej. `EVKLID_HISTORY_IMAGE_TURNS` (privzeto 1; 0 = slika samo v svojem sporočilu). Prihranek na sliko (~1440 žetonov pri 1200 px) na vsako naslednje sporočilo: Haiku 0,00001 $ (predpomnilnik) do 0,0002 $ (premor > 5 min), Sonnet 0,0003–0,004 $, Opus 0,0003–0,012 $; rezerva meje AI na sliko manjša za 0,001 $ (Haiku), 0,019 $ (Sonnet), 0,038 $ (Opus). Enkraten strošek ob zamenjavi: ponoven zapis konca zgodovine (Haiku ~0,0003 $).
- **Izbris profila ali pogovora ne ponastavi meje**: poraba ima lastnika računa (`usage.parent_id`), vprašanja so v `question_log`.
- **Krog 3 (pregleda A in B, j 6. 11. 12:46 in 12:53):**
  - **DDV po državi kupca** (`VAT_RATES`, `vatRateFor` v `server/accounts/plans.js`; OSS, splošne stopnje 2026, **potrdi računovodja**): naročnina po državi računa (`parents.country`, iz Cloudflare ob registraciji) ali po davku na računu Stripe; neznana država in paketi, kjer kupec ni znan (darilo, paket pred testom, dokup): najvišja stopnja EU 27 % (HU). Zunaj EU stopnja DDV/GST na digitalne storitve, zaokroženo navzgor. Šolske licence: Slovenija 22 %.
  - **Tečaji** (`server/tecaji.js`): tedensko iz odprtega vira brez ključa (fawazahmed0/exchange-api prek jsDelivr, `EVKLID_FX_URL`) z rezervo 10 %; brez svežih (datum podatkov starejši od 8 dni, vir ne deluje) stalni `EUR_PER_UNIT` z rezervo 20 %. Močnejša valuta od stalnega tečaja velja največ +10 % (napačen podatek), šibkejša vedno. XOF je vezan na evro. Rezerva tečaja ni za DDV. **Posledica:** paketi za 2 otroka letno v INR, BDT, IDR imajo mejo paketa 0 $ (ostane del brezplačnega repa) – odloči j (cena).
  - **Dejansko plačilo** (`server/placila/placano.js`, j 12:53): promocijske kode ostanejo; ob `invoice.paid` se vsaka vrstica računa naročnine zapiše z obdobjem in zneskom brez popustov in DDV (`kv` `ai_paid_<račun>`). Meja okna je največ 25 % denarja, ki pade v okno (vrstice po času, proracije tudi negativne); okno, plačano z 0 € (kupon 100 %), ima mejo aktivacijske kode (0,5 $, skupni bazen). Brez zapisa (naročnine pred to spremembo) cenik; obnovitev, ki še ni plačana: zadnje plačano okno (krog 4). Vračilo naročnine (`charge.refunded`, tudi delno ob odstopu) takoj zniža denar obdobja; vračilo za odstop se računa iz dejanskega plačila.
  - **Nadgradnja in preklop** (L1, L2): mešanje starega in novega paketa po oknu meje (obdobje naročnine), ne po koledarskem mesecu; preklop mesečno ↔ letno v portalu (Stripe premakne konec obdobja) ne odpre novega okna, dokler od začetka prejšnjega ni minil mesec (`kv` `ai_window_<račun>`). Denar iz plačila (zgoraj) mejo omeji tudi pri nadgradnji brez proracije.
  - **Haiku nad 100k žetonov poziva** stane 5× za ves klic (cenik Anthropic): cena v `PRICES.long`, rezerva po dolgi ceni, zgodovina Haikuja se odreže pod ~95k žetonov (`fitLongPrompt`).
  - **Strežniški nadomestni model** (`fallbacks: "default"`, Sonnet/Opus): zavrnjen poskus sredi toka je plačan posebej (`usage.iterations`, `fallbackExtraUsd`), zato rezerva dveh klicev; brez prostora zanju gre isti model brez nadomestnega (zavrnitev ostane zavrnitev), šele nato cenejši način.
  - **Prekinjen tok** (j 12:46): ob naši prekinitvi (učenec zapre aplikacijo → `res close` → `controller.abort`, povezava z API se takoj zapre) šteje dejansko napisano: bajti vseh delt + 10 %, razmišljanje po času bloka × največja hitrost modela (Haiku 400, Sonnet 250, Opus 200 žetonov/s), + 0,5 s pisanja po zaprtju; največ `max_tokens`. Druga napaka sredi toka (API, omrežje): previdno ves `max_tokens`. Prekinjeno pred zahtevo: klic ne odide in se ne šteje.
  - **Ponovni zagon strežnika med klicem**: rezervacija je v tabeli `ai_holds`; ob zagonu se ostanek zapiše kot poraba v višini rezerve (`recoverHolds`).
  - **Šolska licenca z mejo 0 $** pomeni brez šolskega AI (prej neomejeno): profil nadaljuje v brezplačnem paketu.
  - **Izčrpan skupni bazen preizkusov**: profil nadaljuje z mejami brezplačnega paketa (ne 429); poraba nad bazenom šteje v skupno mejo brezplačnih.
  - **Drugo**: skener zapiše prvi klic, če ponovitev pade; rezerva branja po dolžini navodil; poraba izbrisanih profilov brez dela iz kredita; sodba kode o nalogi s fotografije ostane, ko je slika nadomeščena; vsoti skupnih bazenov v predpomnilniku do 30 s ali do zapisa porabe.
- **Krog 4 (pregleda A3 in B3, j 6. 11.):**
  - **Obnovitev pred plačilom** (H1, K3-1): Stripe premakne konec obdobja takoj, račun je plačan šele čez uro (SEPA dneve, ali nikoli). Za naročnino z zapisom plačila velja do `invoice.paid` zadnje plačano okno (tudi ob koncu preizkusa: okno preizkusa z 0 € → meja kode).
  - **Mesec za priporočilo** (H2, K3-2, j: meja aktivacijske kode): račun, plačan z dobroimetjem, ki ni prišlo iz denarja (nagrada za priporočilo, ročni dobropis), ne šteje kot plačilo; dobroimetje iz proracije (račun z negativnim zneskom) šteje (`kv` `ai_paid_bal_<račun>`).
  - **Vračila** (H3, K3-3) ostanejo, ko `invoice.paid` pride za `charge.refunded` ali se ponovi (`kv` `ai_paid_refunds_<račun>`).
  - **Ponovni zagon** (H4, K3-5): rezervacije v teku se zapišejo kot `usage.log` (kredit, `onLog`, lastnik `ownerOf`); ob SIGTERM strežnik ne sprejema novih zahtev in počaka do 20 s na klice AI v teku (`server/index.js`).
  - **Tečaji** (H5, K3-4): svežost po datumu podatkov (`json.date`, največ 8 dni), različica vira pripeta po datumu (včerajšnji dan, ne `@latest`), rezervni naslov `{dan}.currency-api.pages.dev`, časovna omejitev 15 s, največ 1 MB; okrepitev valute nad stalni tečaj največ +10 %; preverjanje vsak dan, osvežitev, ko so podatki starejši od 6 dni.
  - **Šola** (H7): knjiga porabe ob zapisu (`ai_school_use`): poraba, ki je šla pod mejo šole, ostane v šoli tudi, ko učenec razred zapusti ali kupi osebni paket; velja večje od knjige in porabe sedanjih učencev.
  - **DDV v evrih**: največ od Slovenije (22 %) in države kupca (LU, MT ne zvišata meje; država se lahko ponaredi).
  - **Nizko**: razmišljanje pred prvim blokom šteje v prekinjen tok (K3-6); dolga cena Haikuja po klicu, ne po seštevku krogov orodij (K3-7).
  - **Odprto (nizko)**: naročnine brez nobenega zapisa plačila (pred to spremembo) ostanejo na ceniku do prvega `invoice.paid` (enkratna dopolnitev iz Stripa ni narejena; plačila še niso vklopljena); skener ob prekinitvi druge ponovitve ne zapiše njenega delnega stroška (rezerva ga krije); `ai_paid_<račun>` hrani največ 200 vrstic (teoretično bi > 100 preklopov intervala v letu odrezalo negativno proracijo); zavrnjen poskus nadomestnega modela se ob prekinitvi ne zapiše (rezerva ga krije).
- **Tveganje (odloči j pred vklopom plačil): garancija »Boljša ocena ali vrnemo denar«** (`server/placila/garancija.js`) vrne vsa plačila naročnine, porabljen AI pa ostane plačan: pri vračilu je strošek AI poljubno velik del plačila (izjema od pravila 75 %). Vedenje ni spremenjeno. Možnosti: odbiti porabljeni AI ali vrniti le neporabljeni del (kot pri odstopu).
- **Pogoj delovanja**: rezervacije klicev v teku (`inflight`) so v pomnilniku procesa – pravilno samo z enim primerkom strežnika (SQLite, `render.yaml` brez `numInstances`).
- **Testi**: `test/marza-ai.test.js`, `test/stroski-ai-meje.test.js`, `test/stroski-ai-popravki.test.js`, `test/stroski-ai-krog3.test.js`, `test/pregled-b-luknje.test.js` (L1–L4), `test/pregled-b3-luknje.test.js` (H1–H7), `test/pregled-a3-luknje.test.js` (A3-1–A3-4), `test/slike-zgodovina.test.js`, `test/stopnje-cene.test.js` (trialing, obdobje, kredit, paket pred testom, bazen, odstop, promocijska koda), `test/schools.test.js`, `test/accounts.test.js` (gost → registracija).
- **Odprto (informativno)**: brezplačni profil šteje porabo vseh izbrisanih profilov računa, tudi plačljivih (napačno blokiran, ne uhajanje). Zgodovina deleža za izbrisane profile po paketu bi potrebovala stolpec v `usage`.

Najslabši primer je vrednost paketa (meja + brezplačni rep), izračunana iz dejanskih cen modelov v `server/claude.js` (`PRICES`). Tabela: `node -e 'import("./server/meje-ai.js").then(m => console.table(m.aiCapRows()))'`.

| Paket | Plačilo z DDV (€) | Brez DDV (€) | DDV | Obdobje | Najslabši strošek AI ($) | Delež plačila brez DDV |
|---|---:|---:|---:|---|---:|---:|
| OŠ, mesečno | 9,99 | 8,19 | 22 % | mesec | 1,900 | 21,3 % |
| OŠ, šolsko leto | 8,25 | 6,76 | 22 % | mesec | 1,700 | 23,1 % |
| SŠ, mesečno | 13,99 | 11,47 | 22 % | mesec | 2,900 | 23,3 % |
| SŠ, šolsko leto | 11,58 | 9,49 | 22 % | mesec | 2,580 | 25,0 % |
| Faks, mesečno | 19,99 | 16,39 | 22 % | mesec | 4,452 | 25,0 % |
| Faks, študijsko leto | 16,58 | 13,59 | 22 % | mesec | 3,693 | 25,0 % |
| Družina, mesečno | 18,99 | 15,57 | 22 % | mesec | 3,200 | 18,9 % |
| Družina, šolsko leto | 15,75 | 12,91 | 22 % | mesec | 2,600 | 18,5 % |
| Družina s študentom, mesečno | 27,99 | 22,94 | 22 % | mesec | 5,500 | 22,1 % |
| Družina s študentom, šolsko leto | 22,42 | 18,37 | 22 % | mesec | 4,300 | 21,5 % |
| 2 otroka, mesečno | 15,99 | 13,11 | 22 % | mesec | 3,100 | 21,8 % |
| 2 otroka, šolsko leto | 11,58 | 9,49 | 22 % | mesec | 2,200 | 21,3 % |
| Osebno ob šolski licenci, mesečno | 5,99 | 4,91 | 22 % | mesec | 0,900 | 16,9 % |
| Osebno ob šolski licenci, šolsko leto | 4,08 | 3,35 | 22 % | mesec | 0,600 | 16,5 % |
| 1 otrok, mesečno (INR) | 3,13 | 2,65 | 18 % | mesec | 0,200 | 6,9 % |
| 1 otrok, šolsko leto (INR) | 2,29 | 1,94 | 18 % | mesec | 0,200 | 9,5 % |
| 2 otroka, mesečno (INR) | 5,09 | 4,31 | 18 % | mesec | 0,300 | 6,4 % |
| 2 otroka, šolsko leto (INR) | 3,72 | 3,16 | 18 % | mesec | 0,200 | 5,8 % |
| 1 otrok, mesečno (PKR) | 3,36 | 2,80 | 20 % | mesec | 0,200 | 6,6 % |
| 1 otrok, šolsko leto (PKR) | 2,40 | 2,00 | 20 % | mesec | 0,200 | 9,2 % |
| 2 otroka, mesečno (PKR) | 5,28 | 4,40 | 20 % | mesec | 0,400 | 8,4 % |
| 2 otroka, šolsko leto (PKR) | 3,80 | 3,17 | 20 % | mesec | 0,200 | 5,8 % |
| 1 otrok, mesečno (BDT) | 3,07 | 2,67 | 15 % | mesec | 0,100 | 3,4 % |
| 1 otrok, šolsko leto (BDT) | 2,24 | 1,95 | 15 % | mesec | 0,200 | 9,4 % |
| 2 otroka, mesečno (BDT) | 5,03 | 4,38 | 15 % | mesec | 0,300 | 6,3 % |
| 2 otroka, šolsko leto (BDT) | 3,73 | 3,25 | 15 % | mesec | 0,200 | 5,7 % |
| 1 otrok, mesečno (NGN) | 3,30 | 3,07 | 8 % | mesec | 0,200 | 6,0 % |
| 1 otrok, šolsko leto (NGN) | 2,35 | 2,18 | 8 % | mesec | 0,200 | 8,4 % |
| 2 otroka, mesečno (NGN) | 5,28 | 4,91 | 8 % | mesec | 0,400 | 7,5 % |
| 2 otroka, šolsko leto (NGN) | 3,78 | 3,51 | 8 % | mesec | 0,200 | 5,2 % |
| 1 otrok, mesečno (GHS) | 3,54 | 2,90 | 22 % | mesec | 0,300 | 9,5 % |
| 1 otrok, šolsko leto (GHS) | 2,49 | 2,05 | 22 % | mesec | 0,200 | 9,0 % |
| 2 otroka, mesečno (GHS) | 5,70 | 4,67 | 22 % | mesec | 0,500 | 9,8 % |
| 2 otroka, šolsko leto (GHS) | 3,99 | 3,27 | 22 % | mesec | 0,300 | 8,4 % |
| 1 otrok, mesečno (KES) | 3,37 | 2,91 | 16 % | mesec | 0,200 | 6,3 % |
| 1 otrok, šolsko leto (KES) | 2,43 | 2,09 | 16 % | mesec | 0,200 | 8,8 % |
| 2 otroka, mesečno (KES) | 5,45 | 4,70 | 16 % | mesec | 0,400 | 7,8 % |
| 2 otroka, šolsko leto (KES) | 3,90 | 3,36 | 16 % | mesec | 0,300 | 8,2 % |
| 1 otrok, mesečno (ZAR) | 3,42 | 2,97 | 15 % | mesec | 0,200 | 6,2 % |
| 1 otrok, šolsko leto (ZAR) | 2,49 | 2,17 | 15 % | mesec | 0,200 | 8,5 % |
| 2 otroka, mesečno (ZAR) | 5,72 | 4,98 | 15 % | mesec | 0,500 | 9,2 % |
| 2 otroka, šolsko leto (ZAR) | 4,00 | 3,48 | 15 % | mesec | 0,300 | 7,9 % |
| 1 otrok, mesečno (EGP) | 3,39 | 2,97 | 14 % | mesec | 0,200 | 6,2 % |
| 1 otrok, šolsko leto (EGP) | 2,49 | 2,19 | 14 % | mesec | 0,200 | 8,4 % |
| 2 otroka, mesečno (EGP) | 5,43 | 4,76 | 14 % | mesec | 0,400 | 7,7 % |
| 2 otroka, šolsko leto (EGP) | 3,97 | 3,48 | 14 % | mesec | 0,300 | 7,9 % |
| 1 otrok, mesečno (PHP) | 3,24 | 2,89 | 12 % | mesec | 0,200 | 6,4 % |
| 1 otrok, šolsko leto (PHP) | 2,32 | 2,07 | 12 % | mesec | 0,200 | 8,9 % |
| 2 otroka, mesečno (PHP) | 5,21 | 4,65 | 12 % | mesec | 0,400 | 7,9 % |
| 2 otroka, šolsko leto (PHP) | 3,77 | 3,37 | 12 % | mesec | 0,200 | 5,5 % |
| 1 otrok, mesečno (IDR) | 3,16 | 2,82 | 12 % | mesec | 0,200 | 6,5 % |
| 1 otrok, šolsko leto (IDR) | 2,33 | 2,08 | 12 % | mesec | 0,200 | 8,8 % |
| 2 otroka, mesečno (IDR) | 5,16 | 4,61 | 12 % | mesec | 0,300 | 6,0 % |
| 2 otroka, šolsko leto (IDR) | 3,83 | 3,42 | 12 % | mesec | 0,300 | 8,1 % |
| 1 otrok, mesečno (VND) | 3,30 | 3,00 | 10 % | mesec | 0,200 | 6,1 % |
| 1 otrok, šolsko leto (VND) | 2,34 | 2,13 | 10 % | mesec | 0,200 | 8,6 % |
| 2 otroka, mesečno (VND) | 5,09 | 4,63 | 10 % | mesec | 0,300 | 6,0 % |
| 2 otroka, šolsko leto (VND) | 3,84 | 3,49 | 10 % | mesec | 0,300 | 7,9 % |
| 1 otrok, mesečno (XOF) | 4,42 | 3,71 | 19 % | mesec | 0,500 | 12,4 % |
| 1 otrok, šolsko leto (XOF) | 3,18 | 2,67 | 19 % | mesec | 0,400 | 13,8 % |
| 2 otroka, mesečno (XOF) | 7,16 | 6,02 | 19 % | mesec | 0,900 | 13,8 % |
| 2 otroka, šolsko leto (XOF) | 5,08 | 4,27 | 19 % | mesec | 0,600 | 12,9 % |
| 1 otrok, mesečno (USD) | 3,39 | 2,67 | 27 % | mesec | 0,200 | 6,9 % |
| 1 otrok, šolsko leto (USD) | 2,44 | 1,92 | 27 % | mesec | 0,200 | 9,6 % |
| 2 otroka, mesečno (USD) | 5,43 | 4,28 | 27 % | mesec | 0,400 | 8,6 % |
| 2 otroka, šolsko leto (USD) | 3,91 | 3,08 | 27 % | mesec | 0,300 | 9,0 % |
| Paket pred testom 7 dni | 5,49 | 4,32 | 27 % | 7 dni | 0,800 | 17,0 % |
| Paket pred testom 14 dni | 8,49 | 6,69 | 27 % | 14 dni | 1,500 | 20,6 % |
| Paket pred testom faks 7 dni | 6,99 | 5,50 | 27 % | 7 dni | 1,100 | 18,4 % |
| Paket pred testom faks 14 dni | 11,49 | 9,05 | 27 % | 14 dni | 2,300 | 23,4 % |
| Darilna koda OS (1 leto, na mesec) | 8,25 | 6,50 | 27 % | mesec | 1,700 | 24,1 % |
| Darilna koda SS (1 leto, na mesec) | 11,58 | 9,12 | 27 % | mesec | 2,478 | 25,0 % |
| Darilna koda FAKS (1 leto, na mesec) | 16,58 | 13,06 | 27 % | mesec | 3,548 | 25,0 % |
| Darilna koda (stara, 49 €) | 4,08 | 3,22 | 27 % | mesec | 0,600 | 17,2 % |
| Šolska licenca class (na učenca) | 1,67 | 1,37 | 22 % | mesec | 0,370 | 24,9 % |
| Šolska licenca school (na učenca) | 1,17 | 0,96 | 22 % | mesec | 0,250 | 24,1 % |
| Šolska licenca pilot (na učenca) | 1,00 | 0,82 | 22 % | mesec | 0,220 | 24,7 % |
| Dokup 5 € | 5,00 | 3,94 | 27 % | nakup | 1,000 | 23,4 % |
| Dokup 10 € | 10,00 | 7,87 | 27 % | nakup | 2,130 | 24,9 % |
| Dokup 20 € | 20,00 | 15,75 | 27 % | nakup | 4,270 | 24,9 % |

Naročnine v evrih: kupec v Sloveniji (22 %); kupec drugje v EU dobi mejo po svoji stopnji (HU 27 % → do ~4 % nižja), neznana država 27 %. Regijske cene: € po stalnem tečaju z rezervo 20 % (s svežimi tečaji 10 %), DDV najvišji na trgu valute. Darilo, paket pred testom, dokup: 27 %. Dejanska meja naročnine je poleg tega največ 25 % dejanskega plačila obdobja (popusti, proracije, vračila).

| Brez plačila | Meja ($) | Obdobje |
|---|---:|---|
| Brezplačni paket / gost (na profil) | 0,20 | mesec |
| Brezplačni paket / gost (vsi skupaj) | 10,00 | mesec |
| Preizkus (7 dni, ves račun) | 0,50 | 7 dni |
| Aktivacijska koda (ves račun) | 0,50 | mesec |
| Bonus za priporočilo (ves račun) | 0,50 | 30 dni |
| Šolska licenca s ceno 0 (na učenca) | 0,20 | mesec |
| Preizkus, koda in bonus (vsi računi skupaj) | 20,00 | mesec |

Rezerva odgovora pri sistemskem promptu 50 KB in zgodovini 20 sporočil po 2 KB (Opus in Sonnet: 6 sporočil); dejanski odgovor stane običajno 3- do 10-krat manj.

| Način | Model | max_tokens | Rezerva enega odgovora ($) |
|---|---|---:|---:|
| lite | claude-haiku-5-5 | 1200 | 0,014 |
| chat | claude-haiku-5-5 | 3000 | 0,015 |
| think | claude-haiku-5-5 | 8000 | 0,017 |
| mid | claude-sonnet-5-5 | 6000 | 0,418 (brez nadomestnega modela 0,209) |
| deep | claude-opus-5-5 | 6000 | 0,836 (brez nadomestnega modela 0,418) |
