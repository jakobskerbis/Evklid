# Evklid

(Ime aplikacije je na enem mestu v `brand.json`; za novo ime zaženi `node scripts/preimenuj.js <Ime>`. Nastavitve, baza, piškotki in bližnjice s prejšnjimi imeni se ob zagonu prenesejo sami. Repozitorij na GitHubu se še imenuje po prvem imenu.)

Osebni AI inštruktor za matematiko, fiziko in kemijo za slovenske učence (OŠ 6.–9. razred) in dijake (SŠ). Teče na Claude API.

## Kaj zna

- **Klepet** s pretakanjem odgovorov, izrisom formul (KaTeX) in fotografijami nalog (kamera ali prilepljena slika).
- **Nastavitve** na učenca: predmet, šola, raven, program (redni / tekmovanja), način A (vodenje) ali B (celotna rešitev), osebnost/tema, ročno vnesene šibke točke.
- **Spremembe iz klepeta** (»zdaj kemija«, »daj mi celo rešitev«) model upošteva sam; glava klepeta pokaže trenutni predmet in način.
- **Analitika**: model na konec vsakega odgovora doda vrstico `<<META …>>`. Strežnik jo odstrani še preden jo učenec vidi (tudi med pretakanjem), jo shrani in iz nje izračuna šibke točke.
- **Samodejne šibke točke**: tema z vsaj 3 potezami in vsaj 40 % napak v zadnjih 60 dneh se doda v prompt kot šibka točka.
- **Napredek**: šibke točke, aktivnost po dnevih, teme z deležem napak in opozorila (stiska, nevarna prošnja, poskus obiti pravila).
- **Učna pot**: 20 poti po učnem načrtu (MAT, FIZ, KEM; OŠ in SŠ, 255 tem). Naslednji sklop se odklene, ko je prejšnji osvojen (8 od zadnjih 10 pravilnih in vsaj 2 težji nalogi) ali s preizkusom znanja.
- **Vadnica**: koda sestavi naloge in izračuna rezultate (37 vrst nalog). Preverjanje dopušča zaokroževanje, preveri enote in razloži napačno zaokroževanje. Težavnost se prilagaja, ob napaki je namig, po treh poskusih rešen zgled.
- **Vnos z dotikom**: gumb ✍️ odpre ploščo s tipkami ali površino za pisanje s prstom, miško ali pisalom. Na telefonu je spodaj in besedilo naloge ostane pripeto zgoraj, na računalniku in ležeči tablici je ob strani. Napisano prebere model (»Prebral sem: … Je prav?«), preveri pa koda. Na napravah na dotik se plošča odpre sama.
- **Ponavljanje** v razmikih 1, 3, 7 in 21 dni, mešane naloge iz več tem, XP, dnevni niz in tedenska lestvica.
- **Načini učenja** (spodnja vrstica, vedno dosegljiva): *Nova snov* nadaljuje tam, kjer je učenec ostal; *Ponavljanje* pokaže število nalog na vrsti; *Priprava na test* (izbrani sklopi in datum, bližje kot je test, težje so naloge); *Današnji trening* (~15 min, 70 % nove snovi in 30 % ponavljanja, obrne se, ko se nabere več kot 15 nalog za ponavljanje). Preklop kadar koli: nedokončana seja ali naloga počaka na isto mesto. Vsak odklenjen sklop lahko vadiš posebej (»Vadi sklop«).
- **Poraba**: vsak klic se zabeleži (žetoni in strošek), z dnevnimi in mesečnimi omejitvami. Pregled je v Nastavitvah.
- **Preizkusni način**: brez API ključa vrača pripravljene odgovore, da lahko preizkusiš vse ostalo.

## Zagon

Potrebuješ Node.js 22.13 ali novejši.

```bash
npm install
cp .env.example .env      # vpiši ANTHROPIC_API_KEY
npm start                 # http://localhost:3000
```

Brez ključa se aplikacija zažene v preizkusnem načinu. Teste zaženeš z `npm test`.

Brez ukazne vrstice: dvakrat klikni `zagon-windows.bat` (Windows) ali `zagon-mac.command` (Mac). Skript ob prvem zagonu vpraša za ključ, namesti knjižnice in odpre brskalnik. `ustvari-bliznjico.bat` / `ustvari-bliznjico-mac.command` naredi bližnjico Evklid na namizju.

**Na telefonu (testno):** dvakrat klikni `telefon-windows.bat` (ali `node scripts/telefon.js`). Skript posodobi aplikacijo, brez računov ob prvem zagonu vpraša za skupno geslo (`EVKLID_PASSWORD` v `.env`; z računi ga ni, vsak se prijavi v svoj račun), zažene strežnik in odpre povezavo z interneta. **Lastna domena** (`https://evklid.app`): na računalniku je nameščen tunel Cloudflare kot storitev (Cloudflare → Zero Trust → Networks → Tunnels, javni naslov `evklid.app` → `http://localhost:3000`); skript ga zazna sam in preveri, da naslov res pripelje do strežnika (domena je v `brand.json`, drug naslov v `EVKLID_JAVNI_NASLOV`). Žeton tunela je v storitvi, ne v `.env`. Če se naslov ne odpre, skript izpiše, kaj preveriti, in odpre ngrok. **Stalna povezava ngrok** (ista ob vsakem zagonu): ob prvem zagonu prilepi žeton in brezplačni naslov iz računa [ngrok](https://dashboard.ngrok.com/signup); shranita se v `.env` (`NGROK_AUTHTOKEN`, `NGROK_DOMAIN`). Brez tega (Enter) se odpre začasna povezava Cloudflare (`https://…trycloudflare.com`), ki je ob vsakem zagonu nova. Povezava se izpiše v oknu in shrani v `data/telefon-povezava.txt`; povezava za prijatelje z geslom (`…/?geslo=…`) se kopira v odložišče in shrani v `data/povezava-za-prijatelje.txt`. Deluje, dokler je okno odprto in računalnik prižgan. Na telefonu v meniju brskalnika izberi »Dodaj na začetni zaslon« (ikona in `manifest.webmanifest`). Ko je računalnik ugasnjen, se aplikacija na telefonu odpre iz shranjene kopije (vaje brez povezave). `samodejni-zagon-windows.bat` vklopi (ali izklopi) zagon ob prižigu računalnika in po želji prepreči spanje na elektriki.

**Posodobitve so samodejne**: ob vsakem zagonu in nato vsakih 15 minut aplikacija sama preveri in prenese najnovejšo različico z GitHuba (vse nove lekcije, igre, orodja, prevode in spremembe strežnika), namesti nove knjižnice in se v mirnem trenutku znova zažene; ključ `.env` in podatki `data/` ostanejo, odprte strani na telefonu se osvežijo same. Takoj: dvakrat klikni `posodobi-windows.bat` ali `posodobi-mac.command`. Podrobno: [docs/posodobitve.md](docs/posodobitve.md).

## Nastavitve okolja

| Spremenljivka | Privzeto | Pomen |
|---|---|---|
| `ANTHROPIC_API_KEY` | – | Ključ iz console.anthropic.com. Brez njega preizkusni način. |
| `EVKLID_PASSWORD` | – | Samo brez računov (z `EVKLID_ACCOUNTS=1` je vstop prijava v račun; `EVKLID_GATE=1` skupno geslo obdrži tudi z računi). Če je nastavljeno, stran zahteva geslo: stran za prijavo, ki si geslo zapomni v piškotku za eno leto (deluje tudi v aplikaciji na začetnem zaslonu). Povezava `/?geslo=…` prijavi takoj. Star način HTTP Basic še deluje. |
| `EVKLID_JAVNI_NASLOV` | domena iz `brand.json`, ko teče tunel Cloudflare | Naslov lastne domene za `scripts/telefon.js` (npr. `evklid.app`); `0` izklopi. |
| `NGROK_AUTHTOKEN` / `NGROK_DOMAIN` | – | Za stalno povezavo v `scripts/telefon.js` (brezplačen račun ngrok). |
| `EVKLID_MODEL` | `claude-haiku-5-5` | Privzeti model za klepet (poceni). |
| `EVKLID_MODEL_DEEP` | `claude-opus-5-5` | Za »Razloži podrobneje« (največ `EVKLID_DAILY_DEEP` na dan). |
| `EVKLID_MODEL_MID` | `claude-sonnet-5-5` | Namesto Opusa za imetnike aktivacijske kode. |
| `EVKLID_EFFORT` / `EVKLID_EFFORT_DEEP` / `EVKLID_EFFORT_THINK` | `low` / `low` / `high` | Koliko model razmišlja: Haiku, Opus, Haiku z več razmisleka (Tekmovanja, nad omejitvijo Opusa). |
| `EVKLID_MAX_TOKENS` (`_LITE`, `_THINK`, `_DEEP`) | `3000` (`1200`, `5000`, `6000`) | Najdaljši odgovor po načinu (z razmišljanjem vred). |
| `EVKLID_COMPETITION_DEEP` | `0` | `1` = program Tekmovanja vedno z Opusom (prej privzeto, ~20× dražje). |
| `EVKLID_DEEP_HISTORY_TURNS` | `3` | Koliko zadnjih izmenjav dobi Opus. |
| `EVKLID_DEEP_CACHE_TTL` | `1h` | Predpomnilnik prompta za Opus (`5m` = privzeti API). |
| `EVKLID_OCR_MODEL` | = `EVKLID_MODEL` | Model za branje rokopisa. |
| `EVKLID_HISTORY_TURNS` | `10` | Koliko izmenjav zgodovine gre v API (starejše se odrežejo po kosih, da predpomnilnik deluje). |
| `EVKLID_ANSWER_CACHE` | `1` | Enaka prva vprašanja dobijo shranjen odgovor brez klica API. |
| `EVKLID_DAILY_QUESTIONS` | `0` | Vprašanj za inštruktorja na učenca na dan (0 = brez omejitve). Vadnica je vedno neomejena. |
| `EVKLID_MONTHLY_BUDGET_USD` | `0` | Skupni mesečni proračun v $; pri 80 % opozorilo, pri 100 % se klepet ustavi. |
| `EVKLID_STUDENT_SOFT_USD` | `1` | Nad to mesečno porabo na učenca (v $) podrobne razlage pripravi hitri model. |
| `EVKLID_STUDENT_MONTHLY_USD` | `3` | Trda mesečna omejitev na učenca v $ (nato samo Vadnica do 1. v mesecu). `0` = brez. |
| `EVKLID_DAILY_DEEP` | `5` | Odgovorov Opusa na učenca na dan; nato Haiku z več razmisleka. `0` = brez omejitve. |
| `EVKLID_EUR_PER_USD` | `0.87` | Tečaj za prikaz stroškov v evrih (Nastavitve → Poraba AI). |
| `EVKLID_EXPLANATIONS` | `content/explanations.json` | Datoteka z vnaprej pripravljenimi razlagami tem. |
| `EVKLID_EXPLAIN_MODEL` | `claude-opus-5-5` | Model za skript z razlagami. |
| `EVKLID_DB` | `data/evklid.db` | Pot do baze SQLite. Mora biti na trajnem disku. |
| `EVKLID_DEBUG` | `0` | `1` omogoči `/api/students/:id/prompt` (ogled sestavljenega prompta). |
| `EVKLID_FEEDBACK_PROMPT` | `1` | Kartica »Kako ti je všeč Evklid?« na Učni poti in zavihek Mnenje (za testno različico). `0` ju skrije; vprašalnik ostane pod Jaz. |
| `EVKLID_FEEDBACK_AI` | `0` | `1` = pogovor za povratne informacije vodi Haiku (največ 6 vprašanj, ~0,1 ¢ na pogovor). Privzeto pripravljena vprašanja, brez stroškov. |
| `PORT` | `3000` | Vrata strežnika. |

## Starševski računi in plačila

Vklopiš jih z `EVKLID_ACCOUNTS=1`. Brez tega aplikacija deluje kot prej (brez prijave).

- **Prijava staršev**: registracija z e-naslovom in geslom, potrditev e-naslova, pozabljeno geslo. Vsi klici `/api` zahtevajo prijavo; starš vidi samo svoje otroke in njihove pogovore.
- **Soglasje (GDPR čl. 8, ZVOP-2)**: otroka doda starš z letnico rojstva in izjavo zakonitega zastopnika. Soglasje se shrani (različica, besedilo, e-naslov, čas). Obvestilo o zasebnosti je na `/zasebnost.html` (vpiši podatke upravljavca, označene rumeno).
- **Paketi**: 7 dni brezplačnega preizkusa brez kartice (do 2 otroka), nato brezplačni paket (vadnica neomejeno, `EVKLID_FREE_DAILY_QUESTIONS` vprašanj na dan) ali naročnina po stopnji profila: OŠ 9,99 €/mesec ali 99 €/leto, SŠ 13,99 / 139 €, faks 19,99 / 199 €, Družina (2–4 profili OŠ/SŠ) 18,99 / 189 €, Družina s študentom 27,99 / 269 € (vsak paket ≥ 75 % dobička tudi, ko je porabljen ves zajamčeni AI; zneski in deleži v `server/accounts/plans.js`).
- **Aktivacijske kode** so v bazi (tabela `promo_codes`). Skrbnik jih v zavihku Račun ustvari, izklopi in vidi porabo (dni, število uporab, otroci, najzmogljivejši model, rok). Koda iz `.env` (`EVKLID_PROMO_CODE`, privzeto `EVKLID3X`, z `EVKLID_PROMO_LIMIT`, `EVKLID_PROMO_DAYS`, `EVKLID_PROMO_SEATS`, `EVKLID_PROMO_MODEL`) se ob zagonu vpiše v bazo; če jo skrbnik izklopi, ostane izklopljena. Pri kodi z omejenim modelom (`sonnet`) gre druga zaporedna »Razloži podrobneje« k Sonnetu, Opus šele tretja. Vsak račun porabi eno kodo; preostanek se ob naročnini prenese v Stripe kot brezplačno obdobje.
- **Stripe**: izdelek, cene in portal za stranke aplikacija ustvari sama ob prvem plačilu (`lookup_key` `evklid_1_month` …). Če se starš naroči med preizkusom, Stripe prvič zaračuna šele po koncu preizkusa. Paket, kartico, račune in odpoved ureja v portalu. Pred vsakim plačilom sta obvezni dve potrditvi (polnoletnost in takojšen začetek z vedenjem o 14-dnevnem odstopu); shranita se v `billing_consents`.
- **Paketi pred testom** (`PASSES` v `server/accounts/plans.js`): enkratno plačilo za 7 ali 14 dni polnega dostopa (OŠ/SŠ 5,49 / 8,49 €, faks 6,99 / 11,49 €), vsak z lastno omejitvijo porabe AI. Kartica se pokaže v Urniku samo, če ima učenec v naslednjih 14 dneh test in nima aktivne naročnine (ali preizkusa oz. kode, ki pokrije dan testa). Vračilo ali spor v Stripu paket takoj konča.
- **Prosi starše za plačilo**: mladoletni imetnik računa ne more plačati sam; ustvari povezavo `placaj.html?t=…` (velja 7 dni, največ 5 odprtih), ki jo starš odpre brez prijave. Stran ne pokaže e-naslova računa.
- **Neuspelo plačilo**: naročnina v stanju `past_due` ostane aktivna še 7 dni; starš dobi e-pošto enkrat na račun. Vsako noč (po 3.00) aplikacija uskladi naročnine s Stripom, zapre neplačane pakete in pošlje opomnik 7 dni pred koncem kode in 30 dni pred letnim podaljšanjem.
- **Webhook**: v Stripe → Developers → Webhooks dodaj `https://<naslov>/api/stripe/webhook` z dogodki `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`, `charge.dispute.created` in vpiši `STRIPE_WEBHOOK_SECRET`. Vsak dogodek se obdela enkrat (`billing_events`); zadnjih 10 vidi skrbnik v zavihku Račun. Lokalno webhook ni nujen: stanje se prebere ob vrnitvi s plačilne strani in iz portala.
- **Priporočila**: vsak starš ima kodo in povezavo `/?ref=KODA`. Ko povabljeni prvič plača, oba dobita mesec brezplačno (dobropis v Stripu ali 30 dni dostopa, če naročnine nima).
- **Tedensko poročilo** (Resend): vsako nedeljo po 17. uri staršem s potrjenim e-naslovom; aktivni dnevi, rešene naloge, natančnost, XP, osvojene in šibke teme ter nasvet. Odjava s povezavo v sporočilu.
- **Brez skupnega gesla** (z računi): kdor ni prijavljen, vidi prijavo v račun. Zato: povezava za potrditev e-naslova ali novo geslo se brez e-pošte (`RESEND_API_KEY`) pokaže samo na računalniku, kjer teče strežnik; skrbnik (`EVKLID_ADMIN_EMAILS`) postane skrbnik šele po potrditvi e-naslova; z enega naslova IP največ `EVKLID_SIGNUPS_PER_DAY` (5) novih računov na dan.
- **Geslo profila**: vsak profil ima poleg gesla računa svoje geslo (vsaj 4 znaki, shranjeno zgoščeno, `server/accounts/profile-lock.js`). Nov profil ga dobi ob ustvarjanju; stari profili brez gesla ga dobijo ob prvem odprtju. Geslo profila se na vsaki napravi vpiše samo enkrat (j, 2026-10-30: geslo samo enkrat): profil ostane odklenjen tudi ob menjavi profilov in po odjavi. Znova ga zahtevata samo novo geslo profila in »Odjavi vse druge naprave« (na drugih napravah). Tudi prijava v račun velja 365 dni. Pozabljeno geslo: lastnik računa nastavi novo z geslom računa (na zaslonu za geslo ali v zavihku Račun). Gost (brez računa) gesla profila nima.
- **Zaklep računa** (privzeto izklopljen, `EVKLID_ACCOUNT_LOCK=1` vklopi): zavihek Račun, naročnina ter nov ali izbrisan profil zahtevajo geslo računa na tej napravi; odklep poteče po `EVKLID_ACCOUNT_UNLOCK_MIN` (10) minutah nedejavnosti ali ko zapustiš zavihek Račun. Izvoz podatkov in izbris računa geslo računa zahtevata vedno.
- **Zaščita pred deljenjem**: število profilov je enako paketu (1 ali 2; preizkus 2, brezplačno 1). Profil zamenjaš (izbris + nov) največ enkrat na 30 dni. Profil je hkrati odprt samo na eni napravi: druga naprava vidi »Profil je odprt drugje« in ga lahko prevzame (»Nadaljuj tukaj«), stara se ob naslednjem kliku ustavi; po 30 minutah nedejavnosti prevzem ni potreben. Če je profil v 30 dneh odprt na več kot `EVKLID_DEVICE_WARN` (3) napravah, starš v zavihku Račun vidi opozorilo in gumb »Odjavi vse druge naprave«.
- **Pravice staršev**: izvoz vseh podatkov (JSON) in izbris računa z vsemi otroki (naročnina se prekliče).
- **Uporaba brez registracije je odstranjena** (j, 2026-10-29): vstop je samo prijava v račun; brez prijave se odpre stran za prijavo. Skriti vhod (dotik logotipa) ne obstaja več in `EVKLID_GUEST` ničesar ne vklopi. Stari gostje vidijo samo »Ustvari račun in obdrži napredek« (ali prijavo v obstoječi račun, ki profil prenese). Koda kvot gostov (`server/accounts/guest.js`) ostane zanje in za teste.

## Razlage tem

Razlage tem se ustvarijo enkrat z Message Batches API (pol cene) in se nato strežejo brez stroška:

```bash
node scripts/generate-explanations.js            # samo ocena stroška (Opus ≈ 4 $, Haiku ≈ 0,15 $ za vse teme)
node scripts/generate-explanations.js --yes      # ustvari razlage za vse teme
node scripts/generate-explanations.js --yes --path MAT-OS-8 --model claude-haiku-5-5
```

Dokler razlag ni, gumb »Uči se z Evklidom« temo razloži v klepetu.

## Učbenik

Zavihek **Učbenik** ima za vsako temo učne poti lekcijo: zakaj se tega učimo, razlaga, rešeni primeri od lažjega do težjega, interaktivni poskus, pogoste napake, povzetek, gumb **Razloži drugače** (na sliki, iz vsakdanjega življenja, s številkami, bolj natančno) in kratko preverjanje. Na koncu sta gumba **Vadi naloge** (generator nalog) in **Vprašaj tutorja**. Iskanje pregleda naslove, cilje in besedilo lekcij.

- Lekcije so datoteke Markdown v `content/lessons/<pot>/<tema>.md` (oblika v `content/lessons/README.md`), da jih učitelj lahko pregleda in popravi. Branje ne stane nič; tutor dobi v kontekst samo povzetek lekcije.
- Interaktivne simulacije so vse lastne (`public/sim/`, brez zunanjih strani): vsaka tema učnih načrtov in tekmovanj ima vsaj eno. Katera simulacija sodi h kateri temi, določa `public/sim/katalog.js`; skupna orodja (drsniki, osi, vlečenje, animacija) so v `public/sim/kit.js`.
- **PDF**: celoten učbenik razreda je na `/ucbenik/<pot>` (npr. `/ucbenik/MAT-OS-8`), ena lekcija na `/ucbenik/<pot>/<tema>`. Strani so brezplačne in brez prijave; gumb »Shrani kot PDF« odpre tiskanje brskalnika.
- **Paketi**: ko so računi vklopljeni (`EVKLID_ACCOUNTS=1`), so poskusi, simulacije in sprotno preverjanje na voljo samo s plačljivim paketom ali med preizkusom. Brezplačni paket vidi besedilo lekcije in vprašanja z rešitvami.
- Lekcije za preostale teme ustvari skripta (Batch API, osnutki za pregled):

```bash
node scripts/generate-lessons.js                     # ocena stroška za teme z vajami
node scripts/generate-lessons.js --yes --limit 5     # preizkus na petih temah
node scripts/generate-lessons.js --yes --path FIZ-OS-9 --model claude-sonnet-5-5
```

## Fakultete (1. stopnja)

Ob ustvarjanju profila (ali v Nastavitvah) učenec po korakih izbere šolo: OŠ → razred, SŠ → letnik in raven, fakulteta → univerza → fakulteta → študijski program → letnik (`public/level-picker.js`). Zajeti so univerzitetni programi 1. stopnje: UL FKKT (Kemija, Biokemija, Kemijsko inženirstvo, Tehniška varnost), UL FS (Strojništvo – RRP), UL FMF (Matematika, Finančna matematika, Fizika), UM FKKT (Kemija, Kemijsko inženirstvo), UL BF (8 programov), UL NTF (5), UL FFA (Laboratorijska biomedicina, Kozmetologija), UL ZF (Sanitarno inženirstvo), UL FGG (Vodarstvo in okoljsko inženirstvo), UL FMF+FRI (Računalništvo in matematika), UM FNM (Matematika, Fizika, Biologija, Ekologija z naravovarstvom), UM FKBV (2), UM FE (Energetika), UP FAMNIT (7) in UNG (Fizika in astrofizika, Okolje): skupaj 44 programov.

- Študenti imajo poleg matematike, fizike in kemije še strokovne predmete programa: biologija (BIO), geologija in okolje (GEO), računalništvo (RAC) in ekonomija (EKO), glej `server/subjects.js`. Dodatne fakultete in predmeti so v `server/university-extra.js` (uvoz: `scripts/uvozi-fakultete.py`), viri in negotovosti pa v `docs/predmetniki-naravoslovne-fakultete.md`.

- Predmeti po letnikih in njihove teme so v `server/university-data.js`, povzeti po javnih predmetnikih fakultet (povezava na vir je ob vsakem programu in se pokaže tudi v aplikaciji). Zajeti so obvezni predmeti z matematično, fizikalno, kemijsko ali inženirsko vsebino; praktikumi in izbirni predmeti brez take vsebine niso. Vsebine tem naj pred javno objavo preveri asistent ali študent višjega letnika; popravke vnesi kar v to datoteko.
- Vsak predmet je učna pot (ključ `UNI-<fakulteta>-<predmet>`, npr. `UNI-ULFS-ANDE`) z vajami, ponavljanjem, pripravo na test in učbenikom kot pri OŠ/SŠ. Generatorji nalog za fakultetne teme so v `server/practice/generators/uni*.js`; vežejo se na naslov teme, zato isti generator velja za vse fakultete, ki imajo to temo.
- Tutor v univerzitetnem načinu (razdelek »Univerza« v `prompts/system_prompt.md`) razlaga formalno, z izpeljavami in izpitnimi nalogami, pri FMF zahteva dokaze, pri FKKT/FS poudarja enote SI in presojo rezultata.
- Preverjanje vseh generatorjev: `node scripts/preveri-generatorje.js` (ali `node scripts/preveri-generatorje.js uni-` samo za fakultete).
- Zbrani predmetniki z viri in opombami so v `docs/predmetniki-1-stopnja-UN.md`.

## Objava

Aplikacija je en proces Node z bazo v eni datoteki, zato potrebuje gostovanje s **trajnim diskom**:

- **Render (priporočeno)**: en klik prek `render.yaml`, navodila v [docs/objava.md](docs/objava.md).
- **Docker**: `docker build -t evklid . && docker run -p 3000:3000 -v evklid-data:/data -e ANTHROPIC_API_KEY=... evklid`

## Zgradba

```
prompts/system_prompt.md   sistemski prompt: stalni del (predpomnjen), pod oznako EVKLID:NASTAVITVE {nastavitve} učenca
server/app.js              API in klepet (SSE)
server/claude.js           klic Claude API + preizkusni način
server/meta.js             branje/odstranjevanje META, filter za pretakanje
server/prompt.js           sestavljanje prompta iz nastavitev
server/weaknesses.js       zaznavanje šibkih točk
server/db.js               SQLite (učenci, pogovori, sporočila, dogodki, naloge, XP, poraba)
server/curriculum*.js      učne poti po učnem načrtu (osnutek, naj ga pregleda učitelj)
server/practice/           generatorji nalog in preverjanje odgovorov
server/progress.js         napredovanje, ponavljanje, preizkus znanja, XP
server/usage.js            beleženje porabe in omejitve
server/feedback.js         povratne informacije testerjev (vprašalnik, pogovor, povzetek); glej docs/povratne-informacije.md
public/pad.js              vnos z dotikom (tipke, pisanje, branje rokopisa)
scripts/                   ustvarjanje razlag (Batch API)
public/                    vmesnik (brez ogrodja)
docs/                      opombe k promptu in seznam za preizkušanje
```

## Pomembno pred uporabo z učenci

- **Zasebnost**: uporabniki so mladoletni. Za otroke, mlajše od 15 let, je v Sloveniji za take storitve potrebno soglasje staršev. Pripravi kratko obvestilo o zasebnosti. Pogovori in fotografije se hranijo v bazi.
- **Prijava**: zdaj je le skupno geslo in izbira učenca. Za več družin ali razredov dodaj prave račune.
- **Kakovost**: preden aplikacijo daš učencem, naj učitelj preizkusi naloge iz `docs/preizkus.md`.
- **Digitalni razred**: `npm run sim` pusti 16 simuliranih učencev (različne starosti, znanje, napačne predstave, tipkarske napake, stiska, jailbreak) do inštruktorja in vsak pogovor oceni; prvi zagon shrani kot referenco in z njo primerjaj vsako spremembo prompta. Glej `sim/README.md`.
- **Stroški**: v konzoli Anthropic nastavi mesečno omejitev porabe. Fotografije se pošljejo ob vsakem naslednjem odgovoru v istem pogovoru, zato je pri dolgih pogovorih s slikami bolje začeti nov pogovor.
