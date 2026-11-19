# Krizni načrt: ko se zgodi kaj neljubega

Celoten načrt (vloge, stopnje, časovnica, pripravljena sporočila za omrežja, starše, učitelje in medije):
[Evklid – krizni načrt za neljube dogodke](https://claude.ai/artifact/SDR71FXmRVsb6T5YzzQwhC).
Dogodek javi v projektni niti »Pripravi krizni načrt za neljube dogodke«. Javne objave potrdi samo j.

## Orodja v aplikaciji

- **Trojno preverjanje shranjenih odgovorov** (j, 2026-10-30: »lahko se shranjuje, ampak naj bo dovoljkrat
  pregledano za popolno točnost«, `server/verify.js`). Odgovor, ki bi ga dobili drugi učenci (`answer_cache`),
  in kartice za ponavljanje so vidni šele, ko jih preverijo (1) koda, ki znova izračuna vsak račun v `$…$`,
  ter (2) in (3) dva neodvisna AI pregleda z različnima modeloma (privzeto Sonnet in Opus, `EVKLID_VERIFY_MODELS`).
  Če kateri od treh pregledov najde napako ali dvomi, se odgovor ne shrani. Strošek je omejen z `EVKLID_VERIFY_DAILY_USD`
  (privzeto 1 $ na dan); nad tem se nič novega ne shrani. Stari, nepreverjeni shranjeni odgovori so skriti.

- **Prijavi napako** pod vsakim odgovorom inštruktorja: učenec izbere razlog (napačen odgovor, neprimerna
  vsebina, drugo) in po želji napiše, kaj bi moralo pisati. Prijava se shrani v tabelo `message_reports`
  in odgovor se takoj izbriše iz predpomnilnika (`answer_cache`), da ga ne dobi noben drug učenec.
  Seznam: skrbnik v Računu → »Prijave napak« (`GET /api/admin/reports`, prenos v Markdownu
  `/api/admin/reports/export` za popravke, gumb »Popravljeno«); na računalniku s strežnikom tudi `GET /api/reports`.
- **Prijavi napako v vsaki lekciji** (splet in aplikacija): razlog (napaka v besedilu ali računu, nejasno,
  nekaj ne deluje, drugo), opomba in korak lekcije; tabela `bug_reports` (`kind = lesson`). Skrbnik ima v
  glavi klepeta še svoj gumb za napako v aplikaciji ali pri inštruktorju (`kind = app`, priloži zadnjih
  10 sporočil pogovora). Prijave pregledamo in popravimo v nekaj dneh, nato jih označimo »Popravljeno«.
- **Koda sporočila** (npr. `#00YA`) pod vsakim odgovorom. Če kroži posnetek zaslona, s kodo takoj najdemo
  sporočilo v bazi; če ga ni, je posnetek ponarejen ali iz druge aplikacije.
- **Oznaka stiske** (#856): ko inštruktor označi stisko, skrbnik (in neobvezni namestnik) dobi e-mail brez imena
  in vsebine. Vsako oznako v 24 urah odpri na `/api/admin/stiske` (prijava skrbnika), po potrebi pogovor najdi s
  kodo sporočila (`node scripts/najdi-sporocilo.js`) in oznako označi »Označi kot pregledano«. Stran pokaže, koliko
  oznak je čez rok.
- **Opozorilo** pod poljem za pisanje: »Evklid se lahko zmoti. Pomembne rezultate preveri.«
  (preglednost po AI Act, čl. 50).
- **Stikalo** `EVKLID_CHAT_OFF=1` v `.env` (nato ponovni zagon): klepet z inštruktorjem je izklopljen za
  vse in pokaže obvestilo; Vadnica, učbenik in igre delujejo naprej.

## Ukazi

```
node scripts/najdi-sporocilo.js "#00YA"            # sporočilo s posnetka, pogovor okoli njega, oznake, predpomnilnik
node scripts/najdi-sporocilo.js --besedilo "= 54"  # iskanje po delu besedila odgovora
node scripts/najdi-sporocilo.js --prijave          # zadnje prijave napak
node scripts/najdi-sporocilo.js --odstrani "#00YA" # odstrani odgovor iz predpomnilnika
```

Ukaz samo bere bazo (razen `--odstrani`). Pregleda se samo pogovor, ki je povezan z dogodkom.

Druga stikala za nujne primere: `EVKLID_ANSWER_CACHE=0` (brez ponovne uporabe odgovorov),
`EVKLID_FREE_POOL_USD=0` (brez AI za brezplačne učence), `EVKLID_MODEL` (večji model inštruktorja).

## Kršitev varstva osebnih podatkov (čl. 33 in 34 GDPR)

Kršitev je tudi nenamerno razkritje ali dostop (npr. API vrne podatke drugega računa), ne glede na to, ali je kdo pogledal.
1. **Ustavi uhajanje** (popravek ali stikalo) in zavaruj dokaze (commit, od kdaj, dnevniki Renderja).
2. **Ugotovi dejstva:** kateri podatki, čigavi (otroci?), koliko oseb, od kdaj, kdo je lahko videl, kopije na napravah.
3. **Oceni tveganje in odloči (j, upravljavec), rok 72 ur od seznanitve:**
   - verjetno tveganje → prijava Informacijskemu pooblaščencu (čl. 33(1)); kar še ni znano, se dopolni pozneje;
   - visoko tveganje → še obvestilo prizadetim (staršem) v preprostem jeziku (čl. 34);
   - ni verjetnega tveganja → brez prijave.
   - Če gre za podatke razreda (upravljavec je šola), šolo obvesti brez nepotrebnega odlašanja; o prijavi odloča šola (čl. 33(2)).
4. **Vedno zapiši evidenco** (čl. 33(5)): kaj, od kdaj, kdo je lahko videl, ocena in odločitev z razlogom, ukrepi.
   Evidenco vodi j v **zasebnem** dokumentu projekta `pravo/evidenca-krsitev.md` (j, 2026-11-17), polja so v
   `docs/krsitve/PREDLOGA.md`. **Nikoli v repozitorij** (je javen, zgodovine git ni mogoče izbrisati): v repozitorij
   gresta samo tehnični popravek in test. Opis PR, sporočilo commita in ime veje opišejo napako v kodi, ne pa,
   čigavi podatki so bili razkriti, koliko oseb, katera šola ali razred.
5. **Prepreči ponovitev:** test, ki pade na stari kodi (npr. `test/zasebnost-vse-poti.test.js`).

## Oznaka stiske: namen, pravna podlaga in protokol (točka 17 načrta izboljšav, 19. 11. 2026)

Zunanji pregled (Gemini, 18. 11.) je opozoril na Akt o UI čl. 5(1)(f) (prepoved sistemov za prepoznavanje čustev
na delovnem mestu in v izobraževalnih ustanovah) in na GDPR čl. 9 (podatki o zdravju). Stanje v kodi:

**Kaj Evklid počne in česa ne.**
- Oznaka `distress` (`server/meta.js`) ima en sam namen: varnost učenca. Postavi jo inštruktor, ko učenec sam v
  besedilu omeni samopoškodovanje, samomor, nasilje, nevarnost ali hudo stisko (`prompts/system_prompt.md`, Meje),
  ali jo najde varnostni pregled (`server/nujno.js`: ZDRAVJE, STISKA, NASILJE, NEVARNOST). Učenec takoj dobi potrjeno
  okno s pomočjo (112, odrasla oseba), skrbnik pa e-mail brez vsebine (`server/stiska-obvestilo.js`).
- Oznaka ne vpliva na ocene, učno pot, ravni, lige, poročila staršem ali karkoli drugega. Ni »zaznave frustracije«
  kot ločenega sistema: poziv inštruktorju le naroči, naj se odzove na to, kar učenec napiše (»nikoli mi ne bo šlo«),
  z manjšimi koraki. Nič se ne shrani kot ocena čustev.
- Ni biometrije: zvoka ne snemamo (govor v besedilo pretvori brskalnik, `public/ustno/ustno.js`), obrazov na
  fotografijah ne analiziramo. Akt o UI v čl. 3(39) opredeli sistem za prepoznavanje čustev kot sistem, ki čustva
  sklepa **iz biometričnih podatkov**; Evklid jih ne obdeluje. Evklid tudi ni v izobraževalni ustanovi, dokler šole
  nimajo licenc (ponudba za šole je zamrznjena, točka 37). Ocena pregledovalca in ta razlaga nista pravni nasvet:
  potrdi pravnik ob DPIA.

**Podatki.** Oznaka je šifrirana v bazi (`server/crypto-polje.js`, oznake so poravnane, da se iz baze ne vidi, katera
je stiska), pri stiski se tema pogovora ne shrani (`server/db.js`), oznaka se po 90 dneh izbriše (`server/zasebnost.js`,
`flagDays`). Oznaka je lahko podatek o zdravju (GDPR čl. 9). **Za pravnika:** podlaga je verjetno čl. 9(2)(c)
(zaščita življenjskih interesov, ko oseba ne more dati privolitve) za takojšnje okno s pomočjo in obvestilo skrbniku;
za hrambo 90 dni in pregled skrbnika pa izrecna privolitev staršev ali učenca nad 15 let ob registraciji. To mora v
DPIA in pogoje.

**Protokol, ko pride e-mail o oznaki stiske.**
1. V 24 urah odpri `/api/admin/stiske` (prijava skrbnika). Stran pokaže oznake čez rok.
2. Preberi samo pogovor okoli oznake (`node scripts/najdi-sporocilo.js "#koda"`), nič drugega.
3. Če je oznaka napačna (npr. »umrl bom od dolgčasa« pri nalogi), jo označi kot pregledano. Konec.
4. Če je učenec morda v nevarnosti zdaj: Evklid nima podatkov za stik z otrokom in ne kliče sam. Pri otroku pod
   15 let ima račun starš: pošlji staršu kratko sporočilo brez vsebine pogovora (»V Evklidu je otrok napisal nekaj,
   kar kaže na stisko. Prosimo, pogovorite se z njim. Pomoč: TOM telefon 116 111, v nujnem primeru 112.«). Pri učencu
   nad 15 let z lastnim računom pošlji isto sporočilo njemu, z enakimi številkami.
5. Ob neposredni nevarnosti za življenje in znani identiteti pokliči 112 in povej, kar veš. Zapiši v zasebno evidenco
   (ne v repozitorij), kdaj in komu si sporočil.
6. Oznako označi kot pregledano. Vsebine pogovora ne kopiraj nikamor.
