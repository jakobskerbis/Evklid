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

## Obratna smer: iz poskusa ali 3D modela v klepet in nazaj (j, 24. 11. 2026, faza A načrta »povezan učni prostor«)

- »Vprašaj inštruktorja« je v odprtem (odklenjenem) poskusu pod opisom (`public/laboratorij.js`, `data-lab-ask`), v oknu
  izbranega dela vsakega 3D modela na strani `/3d` (`pregledovalnik.js`, `opts.vprasaj` iz `stran.js`) in v atlasu.
  Vse tri poti gredo skozi `app.js` → `askTutorFrom(text, back)`: klepet z **vpisanim** vprašanjem (pošlje ga učenec
  sam), `state.chatReturn = { view, open, oznaka }`.
- 3D v okvirju pošlje staršu `{ tip: "vprasaj", besedilo, vrni, oznaka }` (`public/3d/vgrajeno.js`
  `vprasajInstruktorja`); `vrni` je naslov pogleda (`atlas?izberi=<id>`, `<model>?del=<id>`), ki ga `uci-se.js`
  `vrnitev3d` preveri (id modela, kratki parametri) in ob vrnitvi z `open3d` odpre isti model z istim delom.
- Vrnitev: ← v glavi klepeta (telefon), tipka Nazaj in gumb »Nazaj na: …« nad vnosnim poljem (`#chat-return`, viden,
  kadar ima `chatReturn` oznako). Poskus ostane, kot je bil (DOM laboratorija se ne zbriše); poskus iz lekcije se po
  vrnitvi s tipko Nazaj še vedno vrne v lekcijo. Tema iz poskusa (»Odpri temo v učbeniku«): Nazaj iz lekcije vrne v
  poskus (`uci-se.js` `lessonFromLab`).
- Aplikacija iz trgovine, ko je `/3d` odprt kot samostojen zaslon (`mobile/src/components/Web3D.tsx`), vprašanje še
  vedno pošlje takoj in nima vrnitve; to se spremeni šele z novo različico aplikacije.
- Preizkusi: `test/uci-se.test.js`, `scripts/preveri-aplikacijo.cjs` (laboratorij na računalniku in telefonu, 3D na
  telefonu).
