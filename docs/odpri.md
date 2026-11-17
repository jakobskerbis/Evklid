# Inštruktor odpre orodja aplikacije

j, 4. 11. 2026 (ideje 1, 4, 6, 7, 11, 25, 26 s seznama »30 idej«): inštruktor ni le še en klepetalnik, ampak učencu
sredi pogovora pokaže Evklidova orodja.

- Model zapiše bloke na koncu odgovora (prompt, razdelek »Orodja aplikacije«): `<<ODPRI poskus|3d|ucbenik|igra|formula="…">>`,
  `<<GRAF [...]>>`, `<<SKICA {...}>>`. Iskalne besede so slovenske, model ne pozna id-jev.
- `server/odpri.js` blok prebere in poišče vsebino: simulacije in poskusi (`public/sim/katalog.js`), 3D modeli
  (`public/3d/modeli/*/index.js`) in strukture atlasa (`public/3d/atlas-imena.json`), lekcije (`rankLessons`), igre
  (`TOPIC_CONCEPTS`), formule (`content/formulas/*.md`). Najprej učenčeva pot; v naslovu morata biti vsaj dve tretjini
  besed poizvedbe. Nič pravega → ni gumba. Zaklenjen poskus (kot v učbeniku) dobi ključavnico in odpre Laboratorij.
- Strežnik pošlje seznam `open` v dogodku `done` in pri ponovnem odprtju pogovora; `stripMeta` in pretakanje bloke skrijeta.
- `public/odpri.js` nariše gumbe pod sporočilom: poskus se odpre v oknu nad pogovorom (× , Esc, Nazaj) z nastavljenimi
  drsniki (`nastavi`, po oznaki drsnika), 3D model z osvetljenim delom (`#organ-srce?del=…`, pregledovalnik.js) ali
  struktura v atlasu (`#atlas?izberi=…`), lekcija, igra (`openReward`), formula v sporočilu z gumbom »Zbirka formul«,
  premičen graf v sporočilu (vrstice `a = 1` so drsniki, »Odpri v kalkulatorju«) in skica v SVG. Okvir z grafom,
  skico ali formulo je takoj za besedilom, pred gumbi z izbirami in »Razloži podrobneje«.
- Okno grafa (`public/graph/okno.js`): pokaže ničle, pole, presečišče z osjo y, ekstreme in prevoje (vrednosti ob polu
  le do 5./95. percentila, razmerje osi med 1 : 5 in 8 : 1); navpične, vodoravne in poševne asimptote so črtkane z
  oznako (`x = 1`, `y = x + 1`). Neobvezno okno v bloku, `<<GRAF ["y = 1/x", {"x": [-3, 3], "y": [-4, 4]}]>>` (ena
  ali obe osi), ostane nespremenjeno; inštruktorjev prompt ga (še) ne omenja. Ob krožnici, parametrični ali polarni
  krivulji ali območju ostane običajno okno.
- Preizkus brez API ključa: v klepet napiši »pokaži poskus« (vnaprej pripravljen odgovor v `server/claude.js`).
