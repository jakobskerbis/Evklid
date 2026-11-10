# Evklid kot aplikacija na telefonu

Evklid je spletna aplikacija, ki jo uporabnik namesti na začetni zaslon (PWA). Ne potrebuje
trgovine z aplikacijami: dobi svojo ikono, odpre se čez cel zaslon brez vrstice brskalnika in
deluje tudi brez povezave (shranjene naloge, učbenik, kalkulator).

Poleg tega ima Evklid pravo aplikacijo za iPhone, iPad in Android (mapa `mobile/`): glej
[mobilna-aplikacija.md](mobilna-aplikacija.md).

## Kako jo uporabnik namesti

Aplikacija to ponudi sama: kartica »Evklid kot aplikacija« na Učni poti (lahko jo skrije za
3 tedne), vrstica »Namesti aplikacijo« pod zavihkom Jaz in kartica v Nastavitvah. V že nameščeni
aplikaciji se ne pokažejo.

| Naprava | Kaj se zgodi ob dotiku |
|---|---|
| Android (Chrome, Edge, Samsung Internet) | Odpre se okno »Namesti« s posnetki zaslona; ena potrditev. |
| iPhone, iPad (Safari, Chrome) | Trije koraki: Deli → Dodaj na začetni zaslon → Dodaj. Apple drugače ne dovoli. |
| Odprto v Instagramu, Messengerju … | Navodilo, naj stran najprej odpre v brskalniku. |
| Računalnik (Chrome, Edge) | Okno »Namesti Evklid«; aplikacija se odpre v svojem oknu. |

Na iPhonu ima nameščena aplikacija svoje piškotke, zato se mora uporabnik ob prvem odprtju
morda še enkrat prijaviti (to piše tudi v navodilih).

## Kaj še zna

- Dolg pritisk na ikono (Android, računalnik): bližnjice Učna pot, Inštruktor, Učbenik, Kalkulator
  (`/?pogled=chat` …).
- Tipka Nazaj (Android, nameščena aplikacija, APK, brskalnik) gre po plasteh (`public/app.js` → `backStep`):
  najprej zapre okno, meni ali Evklidovo tipkovnico, nato podstran (iz lekcije na seznam lekcij, iz 3D modela
  v 3D svet, iz Nastavitev na Jaz), sicer na Učno pot. Na Učni poti sta za izhod potrebna dva pritiska
  (ob prvem obvestilo »Še enkrat pritisni Nazaj za izhod.«). Zgodovina ima tri zapise in se ne nabira.
- Aplikacija se odpre na zadnjem zaslonu (tudi odprta tema ali lekcija Učbenika); na Učno pot samo, če je od
  zadnjega obiska minilo več kot 12 ur. Odločitev pade pred prvim izrisom (`public/zacetek.js` v `<head>`,
  zapis `evklid.zadnji-zaslon`), zato Učna pot ne utripne.
- Opis aplikacije (`/manifest.webmanifest`) je v jeziku vmesnika (`server/webapp.js`).
- Posnetki zaslona za okno »Namesti« so v `public/icons/screen-*.png`; ob večji spremembi videza
  jih je dobro posneti znova (telefon 390 × 844 pri 2×, računalnik 1440 × 900).

Namestitev deluje samo na naslovu `https://…` (evklid.app, ngrok, Cloudflare, Render) ali `http://localhost`.

## Naslov evklid.app

Na računalniku z aplikacijo teče tunel Cloudflare kot storitev Windows (namestitev iz nadzorne plošče
Cloudflare: Zero Trust → Networks → Tunnels → ukaz `cloudflared service install …`; javni naslov
`evklid.app` → `http://localhost:3000`). Storitev se zažene sama ob prižigu računalnika, žeton je v
njej in ne v `.env`. `scripts/telefon.js` storitev zazna (`sc query cloudflared`), preveri, da
`https://evklid.app/manifest.webmanifest` vrne Evklid, in pokaže ta naslov namesto naslova ngrok. Če se ne
odpre, izpiše, kaj preveriti, in odpre ngrok ali začasno povezavo. Domena je v `brand.json`
(`domain`), drug naslov se nastavi z `EVKLID_JAVNI_NASLOV` v `.env` (`0` izklopi).

Aplikacija, nameščena z naslova ngrok, je za telefon druga aplikacija: odpri `https://evklid.app`,
se prijavi in jo znova dodaj na začetni zaslon (napredek je na strežniku, zato se nič ne izgubi);
staro ikono lahko izbrišeš.

## Pozneje: v trgovini Google Play in App Store

Ni nujno, a nekateri starši aplikacijo iščejo v trgovini. Oboje zahteva stalni naslov, ki deluje
tudi, ko je računalnik ugasnjen (npr. Render, glej `docs/objava.md`).

1. **Google Play (priporočeno najprej).** Isto aplikacijo zapakiramo kot »Trusted Web Activity«
   (orodje PWABuilder ali Bubblewrap), brez nove kode. Potrebno: razvijalski račun Google Play
   (enkratno 25 $), ime paketa (npr. `si.evklid.app`) in prstni odtis podpisnega ključa. Ta dva
   vpišemo v `.env`:

   ```
   ANDROID_PACKAGE=si.evklid.app
   ANDROID_SHA256=AB:CD:…
   ```

   Strežnik ju objavi na `/.well-known/assetlinks.json`, da Android aplikacijo odpre brez vrstice
   brskalnika. Posodobitve gredo samodejno s strežnika, nove različice v trgovino niso potrebne.
2. **App Store.** Ovoj s Capacitorjem. Potrebno: Apple Developer (99 $ na leto) in Mac za
   gradnjo. Apple zavrne aplikacije, ki so samo spletna stran v okvirju, zato bi prej dodali
   kaj, kar zna samo telefon (npr. obvestila za ponavljanje). Do takrat je na iPhonu najboljša pot
   »Dodaj na začetni zaslon«.
