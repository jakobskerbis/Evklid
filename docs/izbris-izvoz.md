# Izbris računa in izvoz podatkov: kaj je preverjeno (pilot, 15. 11. 2026)

Test `test/izbris-vse.test.js` ne zaupa seznamu tabel. Vzame **vse** tabele v bazi (108 ob pisanju) in v vsako, ki ima
stolpec računa ali profila (ali kaže na tabelo z njim, npr. povzetek pogovora), vpiše vrstico tega računa, v `kv` pa
ključe računa in profilov (meja AI, plačila, pilot, števec varnostnih pregledov). Pravi podatki pridejo prek API (registracija, dva profila,
pogovor s sporočili, urnik), ostalo neposredno v bazo. Nato račun ali profil izbriše prek API in pregleda vse tabele
ter ključe `kv`. Nova tabela, ki je izbris ne pobriše ali je izvoz ne vsebuje, test podre. Podrobno o zaščiti
podatkov: [varnost-podatkov.md](varnost-podatkov.md).

## Izbris računa (`DELETE /api/account`)

Po izbrisu v nobeni tabeli ni vrstice, ki bi kazala na račun ali njegove profile ali vsebovala njihov e-naslov, ime ali
besedilo, razen spodnjih. Drug račun ostane nedotaknjen (test to preveri). Kopija mnenj na disku (`data/povratne-informacije.json`,
samo brez šifrirnega ključa) se prepiše brez podatkov računa.

Ostane brez povezave na račun (stolpci računa so `NULL`):

| Tabela | Zakaj |
|---|---|
| `billing_consents` | soglasje plačnika z e-naslovom: dokaz o soglasju ob nakupu |
| `gifts`, `podari_fund`, `referral_rewards`, `store_subscriptions` | zapis plačila za vračilo in obračun |
| `guarantees` | garancija: e-naslov samo zgoščen, 10 let (zasebnost.html §5) |
| `audit_log` | dnevnik dostopov, 1 leto |
| `answer_cache` | splošen odgovor inštruktorja brez imena učenca, deljen med učenci (uporabi se in hrani 30 dni) |
| `pilot_mnenja_prenehalo` | naključna oznaka mnenja, da skrbnik umakne objavo |
| `schools`, `class_assignments` | šola in naloga v razredu drugega učitelja ostaneta, avtor postane `NULL` |
| `ai_school_use` | poraba AI, ki je šla pod mejo šole, ostane šoli (`student_id` = `NULL`) |
| `school_licences`, `school_orders` | licenca in naročilo šole ostaneta s šolo (podatki šole, ne računa) |

Ostane in še kaže na id: `ai_holds` (rezervacija klica v teku; pobriše jo konec klica ali ponovni zagon) in
`guest_invites.created_by` (povabilo ustvari skrbnik aplikacije).

Ista pot (`server/accounts/izbris.js` `eraseAccount`/`eraseProfiles`) velja še za (#747, pregled 2):
- **samodejni izbris nepotrjenega računa** (`server/zasebnost.js` `deleteStaleUnverified`): brez profilov 30 dni po
  registraciji brez veljavne seje (kot prej); s profili 30 dni brez dejavnosti (vprašanja, dogodki učenja, točke,
  odprtje profila na napravi), seja tu ne šteje;
- **prevzem nepotrjenega računa** (»Računa nisem ustvaril jaz«, novo geslo prek e-pošte, prijava z Apple): izbrišejo se
  samo profili in shranjena aktivacijska koda, račun ostane lastniku naslova.
V vseh primerih poraba ostane šteta za omrežje (`guest_spent`).

## Izbris profila (`DELETE /api/students/:id`)

Od profila ne ostane nič, račun in drugi profil ostaneta cela. Pri računu ostanejo: poraba kredita (`ai_credit_use`),
garancija, mesečno število strani zapiskov (`zapiski_strani`; vse s `student_id` = `NULL`), dnevnik dodajanja in
brisanja profilov (`profile_changes`, omejitev zlorab) in povezava za odpiranje aplikacije (`app_links`, poteče v 1 dnevu).
Test preveri, da poraba kredita, garancija in strani zapiskov ostanejo računu in ne kažejo več na profil.

## Izvoz (`POST /api/account/export`)

Za vsako tabelo z vrsticami računa ali profila je vsaj ena njena vrednost v izvozu; e-naslov, imena profilov, besedilo
pogovora in urnik so v njem. Namenoma ni v izvozu (varnost): seje, gesla profilov, odklepi naprav, povezave za plačilo,
kode za prevzem in potrditve skrbnika. Gesla in žetoni niso v izvozu (test to preveri). Fotografije nalog iz pogovorov
niso v izvozu (hranijo se 7 dni, varnost-podatkov.md).

## Varnostne kopije

Izbrisani podatki ostanejo v kopijah, dokler kopije ne potečejo:

- dnevna kopija na disku: 7 dni;
- posnetek diska pri Renderju: 7 dni;
- šifrirana kopija v R2 (nastavljena 17. 11. 2026, vedro v EU s pravilom »izbriši po 30 dneh«): 30 dni (`EVKLID_KOPIJE_OBLAK_DNI`);
- **ročne kopije** (`obnovi-kopijo.js --zdaj`, tudi prenesene iz R2): zadnje 3, nobena pa ne starejša od 22 dni
  (22 + 7 dni posnetka diska + 1 dan do čiščenja = 30). Pobriše jih dnevna kopija, ročna kopija, zagon strežnika ali
  dnevno čiščenje po rokih hrambe (tudi z `EVKLID_BACKUPS=0`);
- **baza pred obnovo** (`<baza>.pred-obnovo-*`, za razveljavitev obnove): 14 dni (+ 7 dni posnetka diska).

## Najdbe (zapisano 15. 11. 2026)

Popravljeno 16. 11. 2026 (j je izbral »vse v bazi«; test vsake je v oklepaju):

1. Ročne varnostne kopije so imele samo omejitev števila: zdaj se pobrišejo po 22 dneh (`server/kopije.js`
   `MANUAL_MAX_DAYS`, `pocistiStare`), tudi z `EVKLID_BACKUPS=0`; tudi baza pred obnovo se zdaj briše v dnevnem
   čiščenju, ne samo ob zagonu (`test/kopije.test.js`).
2. Knjiga porabe AI šole (`ai_school_use`) je obdržala id izbrisanega profila: sprožilec ob izbrisu profila ga nastavi
   na `NULL`, ob zagonu enkrat še za prej izbrisane (`server/db.js`; `test/izbris-vse.test.js`).
3. Ena pokvarjena vrstica je skrila ves razdelek `pilot` v izvozu: vsak del je zdaj posebej, pokvarjen seznam težav
   gre v izvoz kot besedilo (`test/pilot-naloge.test.js`).
4. Predpomnjeni odgovori (`answer_cache`) se po 30 dneh izbrišejo v dnevnem čiščenju (`server/zasebnost.js`
   `RETENTION.answerCacheDays`; `test/varnost.test.js`).
5. Dnevni števec varnostnih pregledov (`kv` `varnost_<dan>_<profil>`) se izbriše s profilom (`server/db.js`;
   `test/izbris-vse.test.js`).

Odprto:

6. `public/zasebnost.html` §5 ne omenja, da po izbrisu ostanejo (brez povezave na račun) predpomnjeni odgovori,
   nagrade za priporočilo, šola in naloge v razredu drugega učitelja. Besedilo je za drug profil; zapisano za j.

Zunaj baze (pregled 3; test jih ne vidi):

7. **Datoteke z mnenji na disku.** `scripts/povzetek-povratnih.js` piše `data/povratne-informacije-povzetek.md` z
   imeni in besedili mnenj; izbris ga ne prepiše. `data/povratne-informacije.json` se z nastavljenim `EVKLID_DATA_KEY`
   ne piše več; če je na disku nastal prej, ostane nešifriran. Na Renderju preveri, ali datoteki obstajata, in ju
   pobriši. Tudi samodejni čiščenji (gost po 30 dneh, nepotrjen račun) kopije mnenj ne prepišeta.
8. **Obnova iz kopije vrne izbrisane račune.** Obnova kopije z dne D vrne vse račune, izbrisane po D, seznama za
   ponoven izbris pa ni (dnevnik dostopov po izbrisu nima id-ja računa). Med pilotom: po obnovi ročno preveri zahteve
   za izbris iz tega obdobja (e-pošta) in jih ponovi. Dopolniti `docs/obnova.md`.
9. **Stranka v Stripu ostane.** Izbris računa prekliče naročnino, stranke (e-naslov, ime, id računa v metapodatkih) pa
   ne izbriše, tudi po opuščenem nakupu. Za pilot opomba (nakupi pilotnih računov so zaprti).
10. **R2:** kopije, starejše od 30 dni, se brišejo samo ob uspešnem nalaganju; če nalaganje odpove, ostanejo. Kopija,
    prenesena iz R2 (`--oblak-prenesi`), je ročna kopija in spada pod točko 1 (ker ima datum izvirne kopije, se lahko
    pobriše že naslednji dan; pred obnovo jo po potrebi prenesi znova). Rok 30 dni nima rezerve: kopija se pobriše ob
    prvem nalaganju po 30 dneh; če nalaganje odpove, kopijo po 30 dneh izbriše pravilo vedra (j potrdil 17. 11. 2026). Predlog:
    privzeto 28 dni (`EVKLID_KOPIJE_OBLAK_DNI`).
11. **Resend** hrani poslana sporočila (tudi ime otroka v opomniku cilja in tedenskem poročilu) po svojih pravilih;
    brez nastavljenega Resenda gre zadeva sporočila v dnevnik Renderja.
