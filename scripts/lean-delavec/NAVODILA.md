# Delavec Lean na prenosniku: navodila

Delavec je majhen program na tvojem prenosniku. Vsakih 20 sekund vpraša evklid.app, ali je kakšna matematična
trditev za dokaz (npr. »za vsako realno število x je (x + 1)² = x² + 2x + 1«). Če je, jo dokaže z Leanom in pošlje
izid nazaj. Nič drugega ne dobi: ne imen, ne pogovorov, ne podatkov učencev. Prenosnik ničesar ne odpira navzven:
samo on kliče evklid.app.

Delavec teče kot poseben omejen uporabnik **evklid-lean** (ne kot ti). Tako Lean ne more brati tvojih datotek. Teče
v ozadju, tudi ko nisi prijavljen; okna zanj ni.

Ko je prenosnik ugasnjen, aplikacija dela naprej, le pri trditvah piše »ni preverjeno z Lean«.

Potrebuješ: Windows 10 ali 11, okoli 10 GB prostora na disku C:, internet. Prvič traja dolgo (prenos okoli 7 GB).

## Namestitev (enkrat)

1. Mapo `lean-delavec` dobiš od Claude ali z GitHuba (`scripts/lean-delavec` v repozitoriju Evklid). Kje je, ni
   pomembno: program se sam skopira v `C:\Evklid\lean-delavec` (ne na namizje in ne v OneDrive).
2. Odpri mapo in **dvakrat klikni `zazeni.bat`**.
   - Če Windows pokaže modro okno »Windows je zaščitil vaš računalnik«, klikni **Več informacij** → **Vseeno zaženi**.
   - Windows vpraša »Ali želite tej aplikaciji dovoliti, da spremeni napravo?« → **Da**.
3. Počakaj. Program sam prenese Node, Git, Lean in Mathlib (vsak prenos preveri s kontrolno vsoto SHA-256).
   Mathlib je velik: to lahko traja od pol ure do nekaj ur. Okno pusti odprto.
   - **Ne klikaj v okno.** Klik ustavi izpis (in prenos počaka). Če se je izpis ustavil, pritisni **Esc**.
4. Okno izpiše **NOV ŽETON** (dolga vrsta črk in števk). To je geslo med prenosnikom in evklid.app. Shranjen je tudi
   v `C:\Evklid\lean-delavec\nastavitve.json`. Žetona ne pošiljaj nikomur in ga ne prilepi v klepet.
5. Žeton vpiši na Render:
   - Odpri <https://dashboard.render.com> → storitev **evklid** → **Environment** → **Add Environment Variable**.
   - Key: `EVKLID_LEAN_TOKEN`, Value: žeton iz okna (označi ga z miško, desni klik kopira) → **Save Changes**.
   - Render se znova zažene (nekaj minut).
   - **Dokler žetona ni na Renderju, je v dnevniku vrstica »NAPAKA … HTTP 404«. To je pričakovano**, ni treba
     ničesar narediti; izgine, ko se Render znova zažene.
6. Okno na koncu izpiše **KONČANO**. Zapri ga. Delavec zdaj teče v ozadju in se sam zažene ob vsakem vklopu.
7. Pokrov: program na polnilcu nastavi »ko zapreš pokrov: ne naredi nič«, da prenosnik ne zaspi. Preveriš v
   **Nadzorna plošča** → **Možnosti porabe energije** → **Izberite, kaj naredi zapiranje pokrova** → stolpec
   »Priključen« → **Ne naredi ničesar**. Na bateriji zapiranje pokrova prenosnik še vedno uspava.

## Kako vidim, da dela

- Odpri `C:\Evklid\lean-delavec\delo\dnevnik.txt` (z Beležnico). Vrstica »naloga … proved (ring)« pomeni, da je Lean
  trditev dokazal.
- `C:\Evklid\lean-delavec\delo\stanje.json`: `"stanje": "caka"` (čaka nalogo) ali `"dela"`, `"utrip"` je čas
  zadnjega klica.
- Claude lahko preveri na strežniku: `/healthz/stanje` → `leanDelavec.naVoljo: true`.

## Kako ga ustavim

Dvakrat klikni **`ustavi.bat`** (v `C:\Evklid\lean-delavec`) in klikni **Da**. Delavec se ustavi in se ob vklopu ne
zažene več. Znova ga vklopiš z dvoklikom na `zazeni.bat` (hitro, nič se ne prenaša znova).
Dokler delavec teče, prenosnik ne zaspi sam od sebe (zaslon sme ugasniti).

## Posodobitev

1. Claude ti da novo mapo `lean-delavec` (ali jo prenesi z GitHuba), kamorkoli.
2. Dvakrat klikni `zazeni.bat` v novi mapi. Program ustavi delavca, skopira nove datoteke v `C:\Evklid\lean-delavec`
   (žeton v `nastavitve.json` in prenesen Mathlib ostaneta) in ga znova zažene. Če se je spremenila različica Leana ali
   Mathliba, ju sam prenese znova.

## Če gre kaj narobe

- Okno izpiše **NAPAKA**: naredi sliko okna in jo pošlji Claudu, nato znova dvakrat klikni `zazeni.bat`.
- V `delo\dnevnik.txt` je vrstica **NAPAKA**: pošlji Claudu `dnevnik.txt` (razen »HTTP 404« pred 5. korakom).
- Delavec se sam znova zažene, če se kdaj ustavi; ob izpadu interneta počaka in poskusi znova.
- Nov žeton: zaženi `ustavi.bat`, izbriši `C:\Evklid\lean-delavec\nastavitve.json`, zaženi `zazeni.bat` in nov
  žeton vpiši na Render (5. korak).
