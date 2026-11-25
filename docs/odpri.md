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
- **Podobna naloga** (P1-3, del A; j 25. 11. 2026, načrt treh prioritet): `<<ODPRI vaja="kvadratna enačba">>` →
  `server/vaja-po-razlagi.js` poišče temo učenčeve stopnje z generatorjem nalog (najprej `topicForName`; pri vsaj dveh
  besedah sicer prva lekcija, ki ima vse besede v naslovu in nobena druga s tem ne konkurira; ena sama beseda brez
  točnega imena teme, dvoumna poizvedba ali tema brez generatorja → ni gumba, nikoli napačna tema). Gumb »Podobna naloga«
  (`vr.vaja`) odpre temo v Vadnici in začne vajo (kot »Preveri se« v laboratoriju): nalogo ustvari generator, odgovor
  preveri koda (`progress.answer`), rezultat gre v napredek in šibke točke. Samo s stikalom `EVKLID_VAJA_PO_RAZLAGI=1`
  (privzeto izklopljeno), dokler profil B v pozivu ne doda pravila, kdaj inštruktor blok napiše (#539). »Nazaj« iz teme
  vodi na Učno pot (kot iz laboratorija), ne nazaj v pogovor; pogovor ostane v zgodovini.
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

## Faza B: posnetek stanja za inštruktorja (j, 24. 11. 2026)

- Ob »Vprašaj inštruktorja« odjemalec sestavi majhen posnetek (`state.ucniKontekst`): poskus (`public/sim/lab.js`
  `stanjePoskusa`: oznake in vrednosti kontrol, odčitki merilnikov, zadnjih 20 vrstic tabele meritev; samo iz zaslona,
  nič izračunanega), 3D model z izbranim delom ali struktura atlasa. Gre samo z naslednjim **vpisanim** sporočilom in
  enkrat; nad vnosnim poljem vrstica »Inštruktor bo videl …« (`#chat-kontekst`), dokler ni poslan.
- Strežnik (`server/ucni-kontekst.js`) poišče poskus, model, strukturo in lekcijo v svojih katalogih (imena vzame od
  tam), vrednosti očisti in omeji, zaklenjenega poskusa ali lekcije ne omeni, in doda skrit blok `<kontekst_ucenja>`
  (`server/skrite-opombe.js`). Pravila (ne trdi, da si meril; manjkajočih vrednosti ne ugibaj; predlagaj eno
  spremembo z napovedjo) so v bloku, prompt inštruktorja je nespremenjen. Ob opombi pole ga ni; ne gre v predpomnilnik
  odgovorov in ne sproži iskanja lekcije.
- Preizkusi: `test/ucni-kontekst.test.js`, `scripts/preveri-aplikacijo.cjs` (sporočilo iz poskusa nese posnetek).
