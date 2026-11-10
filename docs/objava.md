# Objava Evklida na spletu (Render)

Aplikacija je pripravljena za Render. Datoteka `render.yaml` vse nastavi sama: strežnik v Frankfurtu, Node 22 in trajni disk za bazo učencev (podatki ostanejo ob vsaki posodobitvi).

Strošek: paket Starter ≈ 7 $/mesec + disk 1 GB ≈ 0,25 $/mesec. Brezplačni paket ne pride v poštev, ker nima trajnega diska (baza bi se izbrisala ob vsakem zagonu).

## Koraki (približno 10 minut)

1. Prijavi se na <https://render.com> z GitHub računom.
2. Klikni **New → Blueprint** in izberi repozitorij `jakobskerbis/evklid`.
3. Render prebere `render.yaml` in prosi za vrednosti, ki jih ne sme poznati nihče drug. Vpiši jih tam (nikoli v klepet):
   - `ANTHROPIC_API_KEY` – iz <https://console.anthropic.com> → API Keys.
   - `EVKLID_PASSWORD` – začasno skupno geslo, samo brez računov (z `EVKLID_ACCOUNTS=1` ne velja; `EVKLID_GATE=1` ga obdrži).
   - `EVKLID_BASE_URL` – pusti prazno; po prvem zagonu vpiši naslov, ki ga dobiš (npr. `https://evklid.onrender.com`).
   - `EVKLID_ADMIN_EMAILS` – tvoj e-naslov.
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM` – lahko pustiš prazno; brez njih plačila niso vklopljena, e-pošta pa se le izpiše v dnevnik.
4. Klikni **Apply**. Po nekaj minutah je aplikacija na naslovu `https://evklid….onrender.com`.
5. Vsaka sprememba, ki pride v `main`, se objavi sama, ko nihče ne uporablja aplikacije (docs/posodobitve.md).

## Pred javno objavo (obvezno)

- **Uporaba brez registracije** je odstranjena (2026-10-29), nastavitev `EVKLID_GUEST` ni več potrebna.

## Po prvem zagonu

- **Potrditev e-naslova brez e-pošte:** dokler `RESEND_API_KEY` ni nastavljen, Evklid ne pošilja e-pošte, povezava za potrditev pa se zaradi varnosti pokaže samo na računalniku, kjer teče strežnik. Registriraj se na spletnem naslovu, nato v Render → evklid → **Shell** poženi `node scripts/potrdi-racun.js tvoj@naslov.si` in osveži stran. Naslov iz `EVKLID_ADMIN_EMAILS` je po potrditvi skrbniški.
- **Node:** `NODE_VERSION` mora biti vsaj 22.13 (prej `node:sqlite` ne obstaja brez zastavice); `render.yaml` nastavi `22`.

- **Stripe webhook:** v Stripe → Developers → Webhooks dodaj `https://<tvoj-naslov>/api/stripe/webhook`, nato skopiraj `whsec_…` v Render → Environment → `STRIPE_WEBHOOK_SECRET`.
- **Lastna domena (npr. evklid.si):** Render → Settings → Custom Domains; pri registrarju dodaj CNAME, ki ga pokaže Render. Nato posodobi `EVKLID_BASE_URL`.
- **Razlage in učbenik:** enkrat poženi generiranje (v Render → Shell):
  `node scripts/generate-explanations.js --yes` in `node scripts/generate-lessons.js --yes --model claude-sonnet-5-5`.

## Omejitve stroškov AI (že nastavljene)

- `EVKLID_STUDENT_MONTHLY_USD=1.5` – največ 1,5 $ na učenca na mesec.
- `EVKLID_FREE_DAILY_QUESTIONS=10` – brezplačni paket: 10 vprašanj na dan.
- `EVKLID_FREE_POOL_USD=10` – brezplačni paket: vsi brezplačni učenci skupaj porabijo največ 10 $ (≈ 8,7 €) na mesec, nato do 1. v mesecu samo Vadnica in lekcije.
- `EVKLID_FREE_STUDENT_USD=0.2` – brezplačni paket: največ 0,2 $ na brezplačnega učenca na mesec.
- `EVKLID_MONTHLY_BUDGET_USD=50` – opozorilo v dnevniku pri 80 % porabe.

Vse lahko spremeniš v Render → Environment.

**Šifriranje podatkov:** nastavi tudi `EVKLID_DATA_KEY` (navodila v [varnost-podatkov.md](varnost-podatkov.md)).

## Varnostna kopija

Render → Disks naredi dnevni posnetek diska samodejno (hrani se 7 dni).

Poleg tega Evklid sam naredi kopijo baze **enkrat na dan** (prvič 2 minuti po zagonu; datum je v času UTC) v `/var/data/kopije/evklid-LLLL-MM-DD.db` in hrani zadnjih 7 (`server/kopije.js`). Ko zmanjkuje prostora na disku, najprej pobriše najstarejše kopije. Taka kopija pomaga, ko je pokvarjena samo baza (napaka v posodobitvi, pomotoma izbrisani podatki), posnetek diska pa, ko odpove cel disk. Stanje: `https://evklid.app/healthz/stanje` → `kopije` (`zadnja`, `kopij`, `napaka`, `obnovaCaka`). `EVKLID_BACKUPS=0` kopije izklopi.

Vsako noč (med 4.30 in 8.00 po ljubljanskem času) strežnik sam naredi isti preizkus obnove kot `--preveri` (spodaj) na najnovejši dnevni kopiji, v ločeni niti, in preveri, ali je kopija današnja ter (če je nastavljena) tudi zunaj strežnika (`server/kopije-preveri.js`). Ob napaki zapiše vrstico `[evklid] NAPAKA: preizkus varnostne kopije ni uspel: …` in pošlje en e-mail na dan naslovom iz `EVKLID_ADMIN_EMAILS` (prek Resend); ob uspehu nič. Stanje: `/healthz/stanje` → `preverjanjeKopij` (`datum`, `ok`). `EVKLID_KOPIJE_PREVERI=0` preizkus izklopi.

V Render → evklid → **Shell**:

| Ukaz | Kaj naredi |
|---|---|
| `node scripts/obnovi-kopijo.js` | seznam kopij; pove tudi, če obnova čaka |
| `node scripts/obnovi-kopijo.js --zdaj` | dodatna kopija takoj (npr. pred tvegano spremembo); obstoječih ne prepiše, ročne se hranijo 3 |
| `node scripts/obnovi-kopijo.js --preveri` | **preizkus obnove** brez spreminjanja: kopija je cela, pogovori se dajo prebrati s sedanjim ključem, števila vrstic |
| `node scripts/obnovi-kopijo.js 2026-11-04` | pripravi obnovo iz te kopije. V naslednji uri: Manual Deploy → **Restart service**. Pozneje ne velja več. |
| `node scripts/obnovi-kopijo.js --preklici` | prekliče pripravljeno obnovo |
| `node scripts/obnovi-kopijo.js --razveljavi` | po obnovi: pripravi vrnitev na bazo izpred obnove (hrani se 14 dni), nato Restart service |

Obnova izgubi vse, kar se je zgodilo po kopiji. Pogovori v kopiji so šifrirani z `EVKLID_DATA_KEY`, zato mora ključ ostati isti (docs/varnost-podatkov.md). Kopije so na istem disku kot baza; ob odpovedi diska pomagata posnetek diska v Render → Disks in kopija zunaj Renderja (spodaj).

### Kopija zunaj Renderja (Cloudflare R2)

Če odpove cel Render (ne samo disk), pomaga kopija drugje. Strežnik najnovejšo dnevno kopijo 10 minut po zagonu in nato vsako uro, ko je nova, **zašifrira** (AES-256-GCM, ključ izpeljan iz `EVKLID_DATA_KEY`) in naloži v Cloudflare R2; kopije, starejše od 30 dni, pobriše (`server/kopije-oblak.js`). Brez `EVKLID_DATA_KEY` ne naloži ničesar. Stanje: `https://evklid.app/healthz/stanje` → `kopijeZunaj` (`zadnja`, `napaka`).

Nastavitev (enkrat):
1. Cloudflare → **R2 Object Storage** → **Create bucket**: ime `evklid-kopije`, Location **Specify jurisdiction → European Union**. Prvih 10 GB je brezplačnih; ob prvem vklopu R2 Cloudflare zahteva plačilno kartico (**Add R2 subscription**).
   V vedru še **Settings → Object lifecycle rules → Add rule**: Delete objects after **30 days** (varovalka, če nalaganje dlje ne bi delovalo).
2. R2 → **Manage API tokens** → **Create API token**: Permission **Object Read & Write**, Specify bucket **evklid-kopije**, TTL Forever. Kopiraj **Access Key ID**, **Secret Access Key** in endpoint pod **European Union (EU)** (`https://<račun>.eu.r2.cloudflarestorage.com`; ne privzetega brez `.eu`, ki vedra v EU ne najde). Ključa se prikažeta samo enkrat; endpoint je tudi v vedru pod **Settings → S3 API**.
3. Render → evklid → **Environment**: `EVKLID_KOPIJE_S3_URL` (endpoint brez `/evklid-kopije` na koncu), `EVKLID_KOPIJE_S3_BUCKET=evklid-kopije`, `EVKLID_KOPIJE_S3_KEY_ID`, `EVKLID_KOPIJE_S3_SECRET`, nato **Save, rebuild, and deploy**.
4. Preizkus v Render → **Shell**: `node scripts/obnovi-kopijo.js --oblak-zdaj` (mora pisati »Naložena kopija …«), nato `node scripts/obnovi-kopijo.js --oblak` (seznam).

Obnova od zunaj (npr. na novem strežniku z istim `EVKLID_DATA_KEY`): `node scripts/obnovi-kopijo.js --oblak-prenesi 2026-11-04` prenese, odšifrira in preveri kopijo ter jo shrani kot lokalno `2026-11-04-0000`; naprej kot zgoraj (`--preveri 2026-11-04-0000`, nato `node scripts/obnovi-kopijo.js 2026-11-04-0000` in Restart service). Brez `EVKLID_DATA_KEY` (ali starega ključa v `EVKLID_DATA_KEYS_OLD`) se kopije od zunaj ne da odpreti, zato ključ hrani tudi v upravitelju gesel.

### Vaja obnove (enkrat pred pilotom, nato enkrat na mesec)

1. `node scripts/obnovi-kopijo.js --zdaj`, nato `node scripts/obnovi-kopijo.js --preveri`: mora pisati »OBNOVA BI USPELA«.
2. Prava vaja (ko nihče ne uporablja Evklida; kar se vpiše med vajo, se izgubi): `node scripts/obnovi-kopijo.js <datum ročne kopije iz 1. koraka>`, Restart service, preveri prijavo in profil, nato `--razveljavi` in še en Restart service.
