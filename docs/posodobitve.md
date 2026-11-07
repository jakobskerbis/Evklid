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
| Telefon ali brskalnik, ki je bil odprt | Ko teče nova različica, se stran tiho osveži: ko se aplikacija vrne v ospredje (vsaj 1 minuto v ozadju) ali po 10 minutah brez dotika. Nikoli med tekmovanjem ali ko je v polju napisano, a neposlano besedilo. Izjema: stran, odprta pred manj kot 30 s (ali dobljena iz predpomnilnika, ker je omrežje zamujalo), se osveži takoj. Nove datoteke pridejo same: service worker datoteke aplikacije iste različice odpre takoj iz predpomnilnika (brez čakanja na omrežje), ob novi različici pa vsako najprej vpraša strežnik; vsak odgovor strežnika pove različico datotek (glava `X-Evklid-App`). Stara stran do osvežitve dobiva datoteke svoje različice, nikoli mešanice stare in nove. Na domačem strežniku se nova različica datotek pokaže v nekaj sekundah po zapisu, še preden se strežnik znova zažene. Nove knjižnice dobijo nov predpomnilnik. |

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

Ob vsaki združitvi v `main` GitHub zažene preverbo, ki počaka na miren trenutek in vmes preverja vsakih
5 minut; novejša združitev jo zamenja. Urnik vsako uro je le rezerva, ker GitHub urnike pogosto zamakne za ure
(`.github/workflows/render-posodobitev.yml`,
pravila v `scripts/render-objava.js`; v `render.yaml` je `autoDeploy: false`). Ponovni zagon s trajnim
diskom pomeni približno minuto izpada, zato:

| Stanje | Kdaj se objavi |
|---|---|
| Nihče ne uporablja Evklida (10 minut nihče nič ne pošlje, nihče ne čaka na odgovor) | takoj (v nekaj minutah) |
| Nekdo se ravno uči | počaka na miren trenutek, najdlje 3 ure od združitve spremembe |
| Zadnja objava pred manj kot 1 uro | počaka (razen po 3 urah čakanja) |
| Ista različica je bila že sprožena, a ne teče (objava ni uspela) | ne ponavlja 3 ure |
| Ročno: GitHub → Actions → Render → Run workflow | takoj |

Strežnik pove svojo različico in zasedenost na `/healthz/stanje`. Enkratna nastavitev: v Renderju
odpri storitev evklid > Settings > Deploy Hook in povezavo kopiraj v GitHub > Settings > Secrets and
variables > Actions kot skrivnost `RENDER_DEPLOY_HOOK`.

## Nastavitve v `.env`

| Nastavitev | Pomen |
|---|---|
| `EVKLID_POSODOBITEV_MINUTE=15` | Kako pogosto preveri (v minutah). |
| `EVKLID_POSODOBITEV=0` | Izklopi samodejne posodobitve. |

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
