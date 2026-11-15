# Izbris računa in izvoz podatkov: kaj je preverjeno (pilot, 15. 11. 2026)

Test `test/izbris-vse.test.js` ne zaupa seznamu tabel. Vzame **vse** tabele v bazi (108 ob pisanju) in v vsako, ki ima
stolpec računa ali profila, vpiše vrstico tega računa. Pravi podatki pridejo prek API (registracija, dva profila,
pogovor s sporočili, urnik), ostalo neposredno v bazo. Nato račun ali profil izbriše prek API in pregleda vse tabele
ter ključe `kv`. Nova tabela, ki je izbris ne pobriše ali je izvoz ne vsebuje, test podre. Podrobno o zaščiti
podatkov: [varnost-podatkov.md](varnost-podatkov.md).

## Izbris računa (`DELETE /api/account`)

Po izbrisu v nobeni tabeli ni vrstice, ki bi kazala na račun ali njegove profile ali vsebovala njihov e-naslov, ime ali
besedilo, razen spodnjih. Drug račun ostane nedotaknjen (test to preveri). Kopija mnenj na disku (`feedback.json`, brez
šifrirnega ključa) se prepiše brez podatkov računa.

Ostane brez povezave na račun (stolpci računa so `NULL`):

| Tabela | Zakaj |
|---|---|
| `billing_consents` | soglasje plačnika z e-naslovom: dokaz o soglasju ob nakupu |
| `gifts`, `podari_fund`, `referral_rewards`, `store_subscriptions` | zapis plačila za vračilo in obračun |
| `guarantees` | garancija: e-naslov samo zgoščen, 10 let (zasebnost.html §5) |
| `audit_log` | dnevnik dostopov, 1 leto |
| `answer_cache` | splošen odgovor inštruktorja brez imena učenca, deljen med učenci (uporabi se 30 dni; glej najdbe) |
| `pilot_mnenja_prenehalo` | naključna oznaka mnenja, da skrbnik umakne objavo |
| `schools`, `class_assignments` | šola in naloga v razredu drugega učitelja ostaneta, avtor postane `NULL` |

Ostane in še kaže na id: `ai_holds` (rezervacija klica v teku; pobriše jo konec klica ali ponovni zagon) in
`guest_invites.created_by` (povabilo ustvari skrbnik aplikacije).

## Izbris profila (`DELETE /api/students/:id`)

Od profila ne ostane nič, račun in drugi profil ostaneta cela. Pri računu ostanejo: poraba kredita (`ai_credit_use`),
garancija, mesečno število strani zapiskov (`zapiski_strani`; vse s `student_id` = `NULL`), dnevnik dodajanja in
brisanja profilov (`profile_changes`, omejitev zlorab) in povezava za odpiranje aplikacije (`app_links`, poteče v 1 dnevu).

## Izvoz (`POST /api/account/export`)

Za vsako tabelo z vrsticami računa ali profila je vsaj ena njena vrednost v izvozu; e-naslov, imena profilov, besedilo
pogovora in urnik so v njem. Namenoma ni v izvozu (varnost): seje, gesla profilov, odklepi naprav, povezave za plačilo,
kode za prevzem in potrditve skrbnika. Gesla in žetoni niso v izvozu (test to preveri). Fotografije nalog iz pogovorov
niso v izvozu (hranijo se 7 dni, varnost-podatkov.md).

## Varnostne kopije

Izbrisani podatki ostanejo v kopijah, dokler kopije ne potečejo:

- dnevna kopija na disku: 7 dni;
- posnetek diska pri Renderju: 7 dni;
- šifrirana kopija v R2 (ko bo nastavljena): 30 dni (`EVKLID_KOPIJE_OBLAK_DNI`);
- **ročne kopije** (`obnovi-kopijo.js --zdaj`): ostanejo zadnje 3 ne glede na starost (glej najdbe).

## Najdbe (zapisano 15. 11. 2026, ni popravljeno; odloči j)

1. **Ročne varnostne kopije nimajo roka.** `server/kopije.js` `prune` hrani zadnje 3 ročne kopije ne glede na starost.
   Če ročne kopije ne delamo pogosto (vaja obnove enkrat na mesec), ostane izbrisan račun v ročni kopiji dlje od
   30 dni, ki jih obljublja `public/zasebnost.html` §5. Popravek: ročne kopije, starejše od 30 dni, pobriše (ali 7 dni).
   Do takrat ročne kopije po vaji sproti pobriši.
2. **Knjiga porabe AI šole** (`ai_school_use`) obdrži id izbrisanega profila (`student_id` ni tuji ključ). Id se lahko
   ponovno uporabi za nov profil. Popravek: ob izbrisu profila `student_id` → `NULL`.
3. **Izvoz pilota**: ena nepravilna vrstica (npr. pokvarjen JSON v `pilot_scans.problems`) skrije ves razdelek
   `pilot` profila v izvozu (`try … catch` okoli vsega). Pri pravih podatkih se to ne zgodi; popravek je majhen.
4. **Predpomnilnik odgovorov** (`answer_cache`) se uporablja 30 dni, starejših vrstic pa nobeno čiščenje ne pobriše.
   Odgovori so brez imena učenca, a lahko vsebujejo besedilo vprašanja. Popravek: v dnevnem čiščenju
   (`server/zasebnost.js`) brisati vrstice, starejše od 30 dni.
