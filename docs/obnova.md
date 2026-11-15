# Obnova baze iz varnostne kopije (preizkušeno 15. 11. 2026)

Postopek, kako Evklid vrnemo na delujoče stanje, ko se pokvari baza ali izgubimo cel strežnik. Vsi koraki so
preizkušeni na sveži namestitvi z vajo `scripts/vaja-obnove.mjs` (teče tudi v CI kot `test/vaja-obnove.test.js`).
Splošno o kopijah: [objava.md → Varnostna kopija](objava.md#varnostna-kopija).

## Kaj imamo (stanje 15. 11. 2026, `https://evklid.app/healthz/stanje`)

| Kopija | Kje | Stanje |
|---|---|---|
| Dnevna kopija baze (7 dni) + ročne (3) | Render disk, `/var/data/kopije` | deluje (`kopije.kopij` 7, nočni preizkus `preverjanjeKopij.ok` true) |
| Posnetek celega diska (7 dni) | Render → Disks | samodejno, Render |
| Šifrirana kopija zunaj Renderja | Cloudflare R2 | **ni nastavljena** (`kopijeZunaj` null) |

Brez R2 pomaga ob izgubi celega Render računa ali diska samo Renderjev posnetek diska. Nastavitev R2: objava.md →
»Kopija zunaj Renderja (Cloudflare R2)«.

## Izmerjeni časi

Vaja na sveži namestitvi (2-jedrni strežnik v oblaku, Node 22, preizkusni način brez pravih ključev). »Pilot« je
20 učencev × 30 dni (≈ 1 pogovor na dan s 6 sporočili) + 3 pravi računi; »velika« je 1000 učencev × 30 dni.

| Korak | Pilot (3,7 MB) | Velika (140 MB) |
|---|---|---|
| Kopija med delovanjem (`--zdaj`) | 0,1 s | 0,8 s |
| Preizkus kopije (`--preveri`) | 0,2 s | 4,0 s |
| Nalaganje šifrirane kopije v R2 (`--oblak-zdaj`) | 0,1 s | 1,2 s |
| Prvi zagon sveže namestitve (prazna baza) | 1,9 s | 1,9 s |
| Prenos kopije iz R2 + odšifriranje (`--oblak-prenesi`) | 0,2 s | 1,3 s |
| Priprava obnove (`obnovi-kopijo.js <datum>`) | 0,1 s | 0,8 s |
| Ponovni zagon z obnovo | 1,9 s | 2,1 s |
| Preverjanje: prijava z geslom, profil, šifrirani pogovor | 2,9 s | 2,9 s |
| **Vse skupaj (vaja, brez namestitve)** | **21 s** | **47 s** |

Nova namestitev kode (enkrat, pred obnovo na novem strežniku): `git clone` 20 s, `npm ci` 16 s. Na Renderju
gradnjo in objavo naredi Render sam (Render → Events pokaže dejanski čas; običajno nekaj minut).

Po obnovi so se ujemala števila vrstic (starši, profili, pogovori, sporočila, poraba) z izvirno bazo, pogovori so
bili berljivi, kopija v R2 pa ni vsebovala berljivega besedila.

**Pričakovan čas do delovanja na Renderju:** pokvarjena baza, kopija na disku: **~5 min** (od tega večino čaka
Restart service). Izgubljen strežnik, kopija v R2: nov Render strežnik z istimi nastavitvami + obnova **~20–30 min**.

## Postopek A: pokvarjena baza, strežnik deluje (najpogostejše)

V Render → evklid → **Shell**:

1. `node scripts/obnovi-kopijo.js` – seznam kopij (časi so UTC). Izberi zadnjo pred napako.
2. `node scripts/obnovi-kopijo.js --preveri <datum>` – mora pisati »OBNOVA BI USPELA«.
3. `node scripts/obnovi-kopijo.js <datum>` – pripravi obnovo.
4. **V naslednji uri:** Render → Manual Deploy → **Restart service**. Pozneje obnova ne velja več (varovalka).
5. Preveri: `https://evklid.app/healthz/stanje` → `kopije.obnovaCaka` je `false`; prijavi se in odpri profil.
6. Če je obnova slabša od prej: `node scripts/obnovi-kopijo.js --razveljavi` in še en Restart service (14 dni).

Izgubi se vse, kar se je zgodilo po izbrani kopiji.

## Postopek B: izgubljen cel strežnik ali disk (nova namestitev)

1. Render → New → Blueprint iz repozitorija (objava.md → Koraki) z **istimi** nastavitvami okolja, predvsem
   **isti `EVKLID_DATA_KEY`** iz upravitelja gesel. Z drugim ključem pogovorov ni mogoče prebrati (vaja to preveri:
   `--preveri` z napačnim ključem javi napako).
2. Počakaj na prvi zagon. **Ta korak je obvezen:** `obnovi-kopijo.js` brez obstoječe baze napiše »Baze … ni« in
   ne naredi ničesar; prvi zagon ustvari prazno bazo.
3. Kopija:
   - iz R2: `node scripts/obnovi-kopijo.js --oblak` (seznam), nato `node scripts/obnovi-kopijo.js --oblak-prenesi <LLLL-MM-DD>`;
     kopija dobi ime `<datum>-0000`;
   - ali iz Renderjevega posnetka diska: Render → Disks → Restore snapshot (cel disk, nato samo Restart).
4. `node scripts/obnovi-kopijo.js --preveri <datum>-0000`, nato `node scripts/obnovi-kopijo.js <datum>-0000`.
5. V naslednji uri Restart service, nato preveri kot v postopku A (5.).
6. Če se je spremenil naslov: `EVKLID_BASE_URL` in Cloudflare CNAME (objava.md → Lastna domena), Stripe webhook.

## Kaj vidijo učenci po obnovi

- Naprava, ki je bila prijavljena pred kopijo, ostane prijavljena (seja je v kopiji); ponovna prijava ni potrebna.
- Na novi napravi se prijavijo z geslom. Profil, ki je bil v kopiji »odprt« na drugi napravi, aplikacija ponudi
  prevzeti (isto kot sicer, ko je profil odprt drugje).
- Kar so napisali po kopiji (novi pogovori, XP, nakupi), v bazi manjka. Dogodkov Stripe, ki jih je stari strežnik
  že prejel, Stripe sam ne pošlje znova: po obnovi v Stripe → Developers → Events poišči dogodke po času kopije in
  jih pošlji znova (Resend); dvojnih ne obdela dvakrat (tabela `billing_events`).

## Vaja

- Samodejno: `node scripts/vaja-obnove.mjs` (privzeto 20 učencev; `--ucencev 1000` za veliko bazo, `--json`).
  Vse teče v začasni mapi, brez pravih ključev, R2 nadomesti lokalni strežnik.
- Na Renderju enkrat pred pilotom in nato enkrat na mesec (objava.md → Vaja obnove): `--zdaj`, `--preveri`, prava
  obnova iz ročne kopije, Restart, preveri prijavo, `--razveljavi`, Restart. Med vajo ne sme nihče uporabljati
  Evklida (kar se vpiše med vajo, se izgubi).
