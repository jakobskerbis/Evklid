# Samodejne posodobitve

Evklid se posodablja sam. Vse, kar pride v vejo `main` na GitHubu (nove lekcije, igre,
orodja, prevodi, spremembe strežnika in baze), je v aplikaciji v približno 15 minutah.
Ročno ni treba narediti nič.

## Računalnik (Windows, Mac) in telefon prek računalnika

| Kdaj | Kaj se zgodi |
|---|---|
| Ob vsakem zagonu (`zagon-windows.bat`, `telefon-windows.bat`, bližnjica, samodejni zagon) | Najprej se prenese najnovejša različica, nato se aplikacija zažene. |
| Med tekom, vsakih 15 minut | Preveri GitHub (en majhen klic). Če je kaj novega: prenese, namesti nove knjižnice (če se je spremenil `package.json`), počaka na miren trenutek (nihče ne čaka na odgovor inštruktorja, največ 20 minut) in strežnik znova zažene. Povezava za telefon ostane ista. |
| Ob ponovnem zagonu strežnika | Baza se sama prilagodi novi različici (`server/db.js`), lekcije in naloge se naložijo na novo. |
| Telefon ali brskalnik, ki je bil odprt | Ko teče nova različica, se stran tiho osveži: ko se aplikacija vrne v ospredje (vsaj 1 minuto v ozadju) ali po 10 minutah brez dotika. Nikoli med tekmovanjem ali ko je v polju napisano, a neposlano besedilo. Izjema: stran, odprta pred manj kot 30 s (ali dobljena iz predpomnilnika, ker je omrežje zamujalo), se osveži takoj. Nove datoteke pridejo same: service worker datoteke aplikacije iste različice odpre takoj iz predpomnilnika (brez čakanja na omrežje), ob novi različici pa vsako najprej vpraša strežnik; vsak odgovor strežnika pove različico datotek (glava `X-Evklid-App`). Stara stran do osvežitve dobiva datoteke svoje različice: service worker si zapomni različico vsake strani, ki jo je naložil, stran, ki je ne pozna (po menjavi ali ponovnem zagonu service workerja), pa enkrat vpraša (do 0,4 s). Kratko okno ostane le, če je kopija stare različice že pobrisana (osvežitev sledi). Na domačem strežniku se nova različica datotek pokaže v nekaj sekundah po zapisu, še preden se strežnik znova zažene. Nove knjižnice dobijo nov predpomnilnik. |

Kaj ostane nedotaknjeno: `.env` (ključi, geslo, ngrok), mapa `data/` (učenci, napredek,
dnevnik) in `node_modules/`. Pobrišejo se samo datoteke, ki jih je prinesla prejšnja
posodobitev in jih v `main` ni več; lastnih datotek v mapi posodobitev ne briše.

Če se nova različica ne zažene v eni minuti, se vrne prejšnja (shranjena v
`data/posodobitev/prejsnja/`) in ta različica se preskoči, dokler na GitHubu ni novejše.
Kaj se je zgodilo, piše v oknu in v `data/dnevnik.txt`.

**Takoj posodobi:** dvakrat klikni `posodobi-windows.bat` (Mac: `posodobi-mac.command`). Če
Evklid teče, se posodobi v pol minute; sicer se posodobi in zažene.

**Kdaj ne deluje:** ko je računalnik ugasnjen ali Evklid ni zagnan. Ob naslednjem zagonu se
posodobi sam. Za zagon ob prižigu računalnika enkrat zaženi `samodejni-zagon-windows.bat`;
Windows Task Scheduler ni potreben.

## Render (evklid.app, od 30. 10. 2026)

Ob vsaki združitvi v `main` GitHub zažene preverbo (`.github/workflows/render-posodobitev.yml`, pravila v
`scripts/render-objava.js`; v `render.yaml` je `autoDeploy: false`). Ponovni zagon s trajnim diskom pomeni
približno minuto izpada, zato se nove različice objavljajo **samo ponoči med 3. in 5. uro** po ljubljanskem
času (j, 19. 11. 2026, »Noč zdaj, baza po pilotu«). Po pilotu (po 15. 12. 2026) se baza preseli izven
Renderja; takrat objava ne bo več pomenila izpada in nočno okno ne bo več potrebno.

**Do nadaljnjega (j, 24. 11. 2026): vsaka združitev v `main` se objavi takoj, ko so testi zeleni**, tudi
podnevi in med uporabo (vsakič ~1 minuta izpada). Spodnja nočna pravila spet veljajo, ko v
`scripts/render-objava.js` nastaviš `TAKOJ_DO = 0`.

| Stanje | Kdaj se objavi |
|---|---|
| Podnevi (izven 3.–5. ure) | počaka na naslednjo noč |
| Ponoči, nihče ne uporablja Evklida (10 minut nihče nič ne pošlje, nihče ne čaka na odgovor) | takoj (v nekaj minutah) |
| Ponoči, nekdo se ravno uči | počaka na miren trenutek, najkasneje ob 4.30 |
| Zadnja objava pred manj kot 1 uro | počaka (tudi ob 4.30) |
| Ista različica je bila že sprožena, a ne teče (objava ni uspela) | ne ponavlja 3 ure |
| Nujen popravek: `[nujno]` na začetku naslova PR (prva vrstica sporočila združitve v `main`) | takoj, ko so testi zeleni, tudi podnevi (enkrat; naslednje združitve spet čakajo na noč) |
| Ročno: GitHub → Actions → Render → Run workflow | takoj, ko so testi zeleni |
| Testi za ta commit so padli | ne objavi; objavi se, ko so testi zeleni (ponovni zagon padlih testov ali naslednja združitev) |

Tek ob združitvi počaka na okno le, če se odpre v naslednjih ~3 urah; sicer objavo opravi nočni urnik
(0:47 in 1:47 UTC) ali urnik vsako uro. Ker se podnevi nič ne objavi, združitev med dnevom ne prekine
testa v Render Shell.

### Objava samo po zelenih testih

Od 20. 11. 2026 gre sprememba na evklid.app (Render) in na telefone (posodobitev aplikacije) šele, ko so za
**točno ta commit** v `main` uspeli vsi štirje posli testov (`.github/workflows/testi.yml`): `testi`, `preveri`,
`hrosci` in `tipi` (TypeScript mobilne aplikacije). Testi trajajo 10–30 minut.

- Render (`scripts/render-objava.js`): dokler testi tečejo, čaka; ko se končajo, se preverba zažene znova, zato
  `[nujno]` pride na strežnik nekaj minut po zelenih testih. Če je testom spodletelo, se ta commit ne objavi
  (v dnevniku teka piše, kateri posel je padel). Render dobi točno preverjeni commit.
- Telefoni (`.github/workflows/ota.yml`): posodobitev se objavi samo po uspešnih testih.
- Samo v sili: Actions → Render → Run workflow → kljukica »brez_testov« objavi brez testov.

Da v `main` sploh ne pride nič brez zelenih testov, enkrat vklopi zaščito veje (samo j, na GitHubu):
1. github.com/jakobskerbis/Evklid → **Settings** → **Rules** → **Rulesets** → **New ruleset** → **New branch ruleset**
   (ali Settings → **Branches** → **Add branch protection rule**). Ime npr. `main`, Enforcement status **Active**.
2. Target branches → **Add target** → **Include default branch** (`main`).
3. Vklopi **Require a pull request before merging** in **Require status checks to pass**; pod njim
   **Add checks** in dodaj `testi`, `preveri`, `hrosci` in `tipi` (pokažejo se, ko so enkrat tekli na PR).
4. **Create** (ali **Save changes**). Od zdaj gumb za združitev PR ostane siv, dokler vsi štirje niso zeleni.

Strežnik pove svojo različico in zasedenost na `/healthz/stanje`. Enkratna nastavitev: v Renderju
odpri storitev evklid > Settings > Deploy Hook in povezavo kopiraj v GitHub > Settings > Secrets and
variables > Actions kot skrivnost `RENDER_DEPLOY_HOOK`.

## Nastavitve v `.env`

| Nastavitev | Pomen |
|---|---|
| `EVKLID_POSODOBITEV_MINUTE=15` | Kako pogosto preveri (v minutah). |
| `EVKLID_POSODOBITEV=0` | Izklopi samodejne posodobitve. |
| `EVKLID_GITHUB_TOKEN=` | Samo če je repozitorij na GitHubu zaseben. Brez ključa posodobitve zasebnega repozitorija ne delujejo (v oknu piše, kaj vpisati). |

### Ključ za zaseben repozitorij

1. GitHub → klikni svojo sliko → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
2. Repository access: **Only select repositories** → samo `Evklid`.
3. Permissions → Repository permissions → **Contents: Read-only**. Nič drugega.
4. Ključ kopiraj v `.env` na vsakem računalniku z Evklidom: `EVKLID_GITHUB_TOKEN=github_pat_…`.
5. Preden poteče, naredi novega in ga zamenjaj v `.env`.

Ključ gre samo v glavo zahteve za GitHub (pri git prek `GIT_CONFIG_*` v okolju), nikoli v ukaz ali izpis.

## Kako deluje (za razvijalce)

- `scripts/posodobitev.js`: zadnja različica prek GitHub API, prenos `tar.gz` samo ob spremembi,
  razpakira Node (brez git, unzip ali tar), prepiše le spremenjene datoteke, stanje v
  `data/posodobitev.json`. V klonu z git namesto tega `git merge --ff-only origin/main`
  (samo na veji main brez neshranjenih sprememb).
- `scripts/nadzor.js`: strežnik kot podproces (ob padcu se zažene znova), urnik posodobitev,
  miren trenutek prek `/healthz/stanje`, vrnitev ob napaki.
- `scripts/zaganjalnik.js`: zažene `zagon.js` ali `telefon.js` in ju zažene znova, ko se
  posodobita sama (izhodna koda 75).
- Zagonske datoteke `.bat`/`.command` imajo oznako `EVKLID-SAMOPOSODOBITEV`: dolgi ukazi so v
  eni vrstici z `exit /b` (Mac: vse v funkciji `main`), zato jih posodobitev lahko prepiše med
  tekom. Datoteke brez oznake (stare različice) med tekom ne prepiše.
- `server/razlicica.js`: različica za `/healthz/stanje`, ime predpomnilnika v `/sw.js` in `staticVersion()`
  (commit + prstni odtis mape `public/`, izračun ob zagonu strežnika) = `APP` v `/sw.js`: kopija datoteke
  aplikacije, ki jo je shranila ista `APP`, se odpre brez omrežja; API in strani strežnika gredo vedno najprej
  na omrežje (`test/sw-hitrost.test.js`).
- `server/vstopna-stran.js`: `index.html` z `<link rel="modulepreload">` za vse module prvega odprtja
  (seznam iz `server/startup-files.js`), proračun velikosti v `test/hitrost-proracun.test.js`.
