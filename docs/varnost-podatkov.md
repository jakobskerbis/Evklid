# Varnost podatkov učencev

Kratek pregled za j in za prihodnje niti. Upravljavec podatkov je j (polnoleten), Evklid pa obdeluje
podatke učencev, med njimi mladoletnih (GDPR, ZVOP-2). Ob incidentu (vdor, izguba ključa, napačen
odgovor, ki je zakrožil): [krizni-nacrt.md](krizni-nacrt.md).

## Kaj je zaščiteno in kako

| Kaj | Zaščita | Koda |
|---|---|---|
| Pogovori (besedilo, fotografije nalog), naslovi in sprotni povzetki pogovorov, prijave napak, mnenja testerjev, urniki, kartice | šifrirano v bazi (AES-256-GCM) | `server/crypto-polje.js`, `server/zasebnost.js` |
| Gesla računov in profilov | scrypt (N = 2^17, r = 8, p = 1); stari zapisi se ob prijavi tiho zamenjajo | `server/accounts/auth.js` |
| Seje | v bazi le zgoščena vrednost žetona; piškotek HttpOnly, SameSite=Lax, Secure prek https | `server/accounts/auth.js` |
| Ugibanje gesel | omejitve: e-naslov + IP (10 / 15 min), e-naslov (30 / uro), IP (100 / 15 min), profil in račun (30 / uro), izbris računa | `server/accounts/index.js` |
| Brskalnik | varnostne glave (helmet): CSP brez vrinjenih skript, HSTS, nosniff, COOP, Permissions-Policy (kamera, mikrofon in senzorji le za Evklid; lokacija, plačila in USB izklopljeni), API brez predpomnjenja | `server/app.js` |
| Fotografije, ki niso učno gradivo | inštruktor jih zavrne (`flag=photo`), strežnik sliko takoj izbriše; skeniranje jih zavrne | `prompts/system_prompt.md`, `server/scan.js` |
| Dnevniki strežnika | brez e-naslovov, besedil pogovorov, žetonov in teles zahtev | |
| Odvisnosti | Dependabot (npm tedensko, GitHub Actions mesečno) | `.github/dependabot.yml` |

Nešifrirano ostane, kar baza potrebuje za iskanje ali ni osebno: ime (vzdevek) učenca (iskanje podvojenih
profilov), e-naslov starša (prijava), `answer_cache` (skupni preverjeni odgovori brez imen), `knowledge_items`
(le oznake nagrad), napredek in naloge iz Vadnice. Učitelji vidijo samo naloge in napredek, nikoli pogovorov.

## Ključ za šifriranje (EVKLID_DATA_KEY)

- **Nov ključ:** `node scripts/kljuc-podatkov.js` izpiše naključni ključ (32 bajtov, base64).
- **Kje živi:** samo v Render → evklid → Environment kot `EVKLID_DATA_KEY`. Ne v repozitoriju, ne v e-pošti, ne v klepetu.
- **Kopija:** shrani ga v upravitelj gesel (npr. 1Password, Bitwarden). **Brez ključa so pogovori, urniki in kartice v bazi
  za vedno neberljivi** (tudi iz varnostne kopije diska). Aplikacija namesto njih pokaže »Tega besedila ni mogoče prebrati«.
- **Prvi vklop:** ob naslednjem zagonu strežnik v ozadju zašifrira vse obstoječe vrstice (po paketih, aplikacija med tem deluje).
- **Preverjanje:** v Render → Shell `node scripts/kljuc-podatkov.js --preveri` izpiše, koliko vrstic je šifriranih,
  nešifriranih in neberljivih.
- **Brez ključa** (lokalno, testi) se podatki shranjujejo nešifrirani; na javnem strežniku (https ali `NODE_ENV=production`)
  strežnik ob zagonu to zapiše kot opozorilo. Datoteka `povratne-informacije.json` se s ključem ne piše več
  (mnenja so v bazi; `node scripts/povzetek-povratnih.js` jih prebere od tam).

### Menjava ključa

1. Ustvari nov ključ (`node scripts/kljuc-podatkov.js`) in ga shrani v upravitelj gesel.
2. V Render nastavi `EVKLID_DATA_KEY=<nov>` in `EVKLID_DATA_KEYS_OLD=star:<prejšnji>` (več starih: z vejico).
3. Ob zagonu strežnik vse vrstice znova zašifrira z novim ključem.
4. Ko `--preveri` ne pokaže več vrstic »s starim ključem«, `EVKLID_DATA_KEYS_OLD` odstrani. Stari ključ hrani še
   toliko časa, kolikor se hranijo varnostne kopije: 7 dni na disku, 30 dni zunaj Renderja (kopije zunaj so
   šifrirane s ključem, izpeljanim iz `EVKLID_DATA_KEY`; brez starega ključa se jih ne da odpreti).

Ključ zamenjaj takoj, če je kdaj prišel v napačne roke (in sledi kriznemu načrtu).

## Roki hrambe

Vse vrednosti so v `server/zasebnost.js` (`RETENTION`); čiščenje teče ob zagonu in nato enkrat na dan.

| Podatek | Rok |
|---|---|
| Fotografije nalog v pogovorih | 7 dni (`EVKLID_IMAGE_DAYS`); nato opomba namesto slike, besedilo ostane |
| Fotografija, ki ni učno gradivo | se ne shrani |
| Potekle seje in odklepi profilov | izbrisani takoj po poteku |
| Dnevnik e-pošte (preprečuje dvojna sporočila) | 1 leto |
| Dnevnik obvestil na telefon | 90 dni |
| Dnevnik dostopov | 1 leto |
| Plačilo Stripa, ki ga ni mogoče pripisati računu (`kv` `stripe_unmatched:*`: id-ji Stripa, znesek, razlog, `parent_uid`; brez e-naslova) | 365 dni, nato izbris (`server/zasebnost.js` `runRetention`) |
| Račun brez potrjenega e-naslova, brez profilov, plačil in seje | 30 dni |
| Gostje brez seje | 30 dni (`server/accounts/guest.js`) |
| Pogovori, napredek | dokler jih uporabnik ne izbriše ali izbriše računa |

## Dnevnik dostopov

Tabela `audit_log` beleži prijave (uspešne in neuspešne), odjave, zahteve in ponastavitve gesla, izvoz in izbris računa,
nastavitev gesla profila in napačne odklepe, dejanja skrbnika (šole, licence, aktivacijske kode), izvoz razreda (učitelj)
in izvoz za šolo. Naslov IP ni shranjen, le zgoščena vrednost (HMAC s skrivnostjo strežnika): enaki vrednosti pomenita isti
naslov. Ob izbrisu računa vrstice ostanejo brez povezave na račun. Branje: `node scripts/dnevnik-dostopov.js [e-naslov]`.

## Naprava, izvoz in izbris (2026-11-06)

- **Service worker** (`public/sw.js`) shrani samo javne odgovore API (teme, lekcije `/api/lesson`, poti, programi, viri, formule, učbenik, pole) in nikoli odgovora z `Cache-Control: private` ali `no-store`. Profili, pogovori, napredek, račun in šola gredo samo prek omrežja. Stari predpomnilnik z vsemi odgovori (`…-api`) se ob novi različici pobriše.
- **Lekcije brez povezave**: osebna pot `/api/students/:id/lesson` (test predznanja, paket) se ne shrani; ob ogledu lekcije service worker shrani javno kopijo `/api/lesson?id=` (samo besedilo, brez učenčevih polj), ki jo učbenik brez povezave odpre.
- **Brez povezave** se aplikacija odpre z očiščenimi nastavitvami (`/api/config` brez skrbniških zastavic), seznamom profilov (id, ime, nastavitve) in paketom vaj v `localStorage` (`public/offline.js`); pogovorov brez povezave ni.
- **Osebni podatki na napravi** (`PRIVATE_KEYS` v `public/offline.js`): `evklid.offline.*` (paketi, vrsta, profili, lastnik), `scan.*`, `work.*`, `graph.*`, `sci.*`, `goalSeen.*`, `schedule*`, `ours.*`, `levelup.*`, `teacherClasses` (učiteljev ključ razreda!), `evklid_invite_name`, `evklid_koda`, `evklid_ref`, `studentId`. Nastavitve videza ostanejo.
- **Kdaj se naprava pobriše** (`clearPrivate`): odjava (tudi z zaklenjenega profila), izbris računa, vsak drug konec seje (iztek, »Odjavi vse druge naprave«, odjava drugje: `initAccount` in `route()` ob `!logged_in`, kadar je naprava imela lastnika) in prijava v drug račun (`checkOwner`; tudi prva prijava po namestitvi, kadar so na napravi podatki brez znanega lastnika). Izbris profila pobriše njegove ključe (`clearProfile`). Neposlani odgovori vaj gredo pred odjavo na strežnik (največ 6 s, nato se odjava nadaljuje).
- **Izvoz vseh podatkov** (zavihek Račun): profili, pogovori, prijave napak (vseh vrst), mnenja, kartice (tudi nepreverjene), igre in urnik ter vse ostale tabele z vrsticami računa ali profilov (`other`, `server/zasebnost.js` `exportOtherTables`: `student_id`, `parent_id`, lastnik razreda, kupec in prejemnik darila, priporočila, ustanovitelj šole, avtor naloge razreda), brez gesel, žetonov (tudi `store_account_token`) in zgoščenih vrednosti; šifrirano odšifrirano. Podatki z naprave (`device`: zgodovina skenerja, neposlani odgovori, kalkulator, zapis postopka) samo za profile tega računa. **Ni v izvozu**: fotografije nalog iz pogovorov (`messages.api_content`, hranijo se 7 dni; izvoz ima le oznako `has_image`).
- **Izbris profila ali računa**: vse tabele profila se izbrišejo prek tujih ključev; mnenja (`feedback`), dnevnik obvestil (`push_log`), članstvo učitelja v šoli (`school_teachers`) in učiteljevi razredi (`classes` z `owner_parent_id`, s člani, oznakami in nalogami) prek sprožilcev; `schools.created_by` in `class_assignments.created_by` postaneta NULL. Kopija mnenj v JSON (brez šifriranja) se po izbrisu prepiše. Ostanejo samo zapisi, ki jih zahteva zakon ali obračun, brez povezave na račun: plačila in soglasja plačnika (`billing_consents` z `payer_email`, `store_subscriptions`, `guarantees`, `podari_fund`), darila (`gifts`), poraba AI brez profila (`usage`) in dnevnik dostopov (1 leto). Tako piše tudi `public/zasebnost.html` §5.
- **Predpomnilnik odgovorov** (`answer_cache`, P3): ime učenca se zamenja z `{{IME}}` kot cela beseda (`giu`). Če ime ostane kot začetek besede (sklonjena oblika »Jakobu«, »Lanom«, »Ani«), se odgovor za druge učence ne shrani.
- **Vaje brez povezave** (P2): sinhronizacija sprejme samo naloge, ki jih je strežnik izdal (`offline_issued`, 14 dni). Vse štejejo v napredek, XP (in s tem lige) pa samo prvih 10 na dan (`RULES.offlineXpPerDay`, kot dnevni sklop). Največ 8 paketov na dan na profil (`offline_packs`).

## Spremenljivke okolja

- `EVKLID_DATA_KEY` – ključ za šifriranje (obvezno na javnem strežniku).
- `EVKLID_DATA_KEYS_OLD` – stari ključi med menjavo (`id:ključ,id:ključ`).
- `EVKLID_IMAGE_DAYS` – koliko dni ostanejo fotografije nalog (privzeto 7).
