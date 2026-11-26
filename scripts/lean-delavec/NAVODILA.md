# Delavec Lean na prenosniku: navodila

Delavec je majhen program na tvojem prenosniku. Vsakih 20 sekund vpraša evklid.app, ali je kakšna matematična
trditev za dokaz (npr. »(x + 1)² = x² + 2x + 1«). Če je, jo dokaže z Leanom in pošlje izid nazaj. Nič drugega ne
dobi: ne imen, ne pogovorov, ne podatkov učencev. Prenosnik ničesar ne odpira navzven: samo on kliče evklid.app.

Ko je prenosnik ugasnjen, aplikacija dela naprej, le pri trditvah piše »ni preverjeno z Lean«.

Potrebuješ: Windows 10 ali 11, okoli 10 GB prostora na disku, internet. Prvič traja dolgo (prenos okoli 7 GB).

## Namestitev (enkrat)

1. Claude ti skopira mapo `lean-delavec` na namizje: `C:\Users\jakob\Desktop\Evklid\lean-delavec`.
   (Če je ne, jo prenesi z GitHuba: `scripts/lean-delavec` v repozitoriju Evklid, in jo daj tja.)
2. Odpri mapo in **dvakrat klikni `zazeni.bat`**. Če Windows pokaže modro okno »Windows je zaščitil vaš
   računalnik«, klikni **Več informacij** → **Vseeno zaženi**.
3. Počakaj. Program sam prenese Node, Git, Lean in Mathlib (vsak prenos preveri s kontrolno vsoto SHA-256).
   Mathlib je velik: to lahko traja od pol ure do nekaj ur. Okno pusti odprto.
4. Ko je prenos končan, okno izpiše **NOV ŽETON** (dolga vrsta črk in števk). To je geslo med prenosnikom in
   evklid.app. Shranjen je tudi v datoteki `nastavitve.json` v tej mapi.
   - Odpri <https://dashboard.render.com> → storitev **evklid** → **Environment** → **Add Environment Variable**.
   - Key: `EVKLID_LEAN_TOKEN`, Value: žeton iz okna (označi ga z miško, desni klik kopira) → **Save Changes**.
   - Žetona ne pošiljaj nikomur in ga ne prilepi v klepet.
5. Render se znova zažene (nekaj minut). Okno delavca nato kaže »Delavec teče«.

## Kako vidim, da dela

- V oknu se izpisujejo vrstice z datumom. Vrstica »naloga … proved (ring)« pomeni, da je Lean trditev dokazal.
- V mapi je `stanje.json`: `"stanje": "caka"` (čaka nalogo) ali `"dela"`, `"utrip"` je čas zadnjega klica.
- `dnevnik.txt` je ves zapis (velik največ ~1 MB, starejši deli so v `dnevnik.txt.1`, `.2`).
- Claude lahko preveri na strežniku: `/healthz/stanje` → `leanDelavec.naVoljo: true`.

## Kako ga ustavim

Zapri okno (križec zgoraj desno). Nič se ne pokvari; naloge počakajo, dokler ga spet ne zaženeš.
Dokler je okno odprto, prenosnik ne zaspi (zaslon sme ugasniti).

## Samodejno ob vklopu prenosnika (neobvezno)

Desni klik na `zazeni.bat` → **Pokaži več možnosti** → **Ustvari bližnjico**. Pritisni tipki **Windows + R**,
vpiši `shell:startup`, Enter. Bližnjico povleci v mapo, ki se odpre.

## Posodobitev

1. Zapri okno delavca (pomembno: `zazeni.bat` se ne sme zamenjati, ko teče).
2. Claude skopira nove datoteke čez stare (ali jih prenesi z GitHuba). **Ne briši** `nastavitve.json`, `orodja\`
   in `projekt\.lake\` (tam sta žeton in prenesen Mathlib).
3. Dvakrat klikni `zazeni.bat`. Če se je spremenila različica Leana, program sam prenese novo.

## Če gre kaj narobe

- Okno izpiše **NAPAKA**: naredi sliko okna ali pošlji Claudu `dnevnik.txt`, nato znova dvakrat klikni `zazeni.bat`.
- Program se sam znova zažene, če se kdaj ustavi; ob izpadu interneta počaka in poskusi znova.
- Nov žeton: zapri okno, izbriši `nastavitve.json`, zaženi `zazeni.bat` in nov žeton vpiši na Render (4. korak).
