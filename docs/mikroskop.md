# Mikroskop

Virtualni mikroskop od 40× do 50 000 000× (j, 12. 11. 2026: »Naj ima povečavo do 50000000«, »TEM«, »Naj bo možno vsako
tkivo v 3D svetu pogledati z mikroskopom«). Trije načini (j, 13. 11. 2026: »optični, elektronski in TEM«): svetlobni
mikroskop do 1000×, vrstični elektronski mikroskop (SEM, površina) od 40× do 300 000× in presevni elektronski mikroskop
(TEM, rezina) do 50 000 000×. Ob drsniku povečave sta gumba − in + (tap en korak, držanje ponavlja).

## Kje je

- Stran `/3d#mikroskop?p=<id preparata>` (kartica »Mikroskop« v zbirki 3D sveta in v iskanju).
- Gumb »Poglej z mikroskopom« (`mk.open`): na kartici vsake strukture atlasa telesa, v glavi vsakega modela celice,
  organa in procesa ter v oknu dela organa iz GLB (del lahko izbere drug preparat, npr. aorta → arterija).
- V lekcijah kot simulacija `mikroskop` (`public/sim/katalog.js`; motor ni `lab-*`, ker potrebuje brskalnik in i18n).

## Datoteke (`public/mikroskop/`)

| datoteka | vsebina |
|---|---|
| `mikroskop.js` | vmesnik: oder (platno, igla v okularju, oznaka pod kazalcem, merilce), plošča z nadzorom, izbirnik preparatov |
| `optika.js` | objektivi, vidno polje, ločljivost, globinska ostrina, zamegljenost, ravni TEM in SEM (brez DOM, testi) |
| `pogled.js` | stanje → uniforme za izris |
| `upodobi.js` | WebGL2: preparat → Gaussova zamegljenost → sloj molekul → sestava (okrogel okular ali TEM čez ves oder) |
| `glsl.js` | skupni GLSL: šum, Voronoi celice, organeli, `ultra()` za TEM, `semVisina()` za SEM, membrane |
| `molekule.js` | sloj molekul in atomov: 37 prizorov (`P_*`), membrane, atomi po elementih, prehod ID za oznake |
| `molekule-vrste.js` | katalog 80 molekul (barva, gostota TEM, atomi), prizori po snovi, membrane, značilna mesta preparatov |
| `barvila.js` | barvanja kot Beer–Lambertova mešanica treh barvil (optične gostote) |
| `mapa.js` | struktura atlasa ali model → preparat |
| `preparati/` | 47 preparatov; `index.js` je seznam (id, datoteka, izvoz, ime, skupina) |

## Pogodba preparata

Objekt `{ id, ime, opis, barvanje, zacetek: { m, sredisce }, imena, snovi, isci, glsl }`. GLSL definira
`T tkivo(vec2 p, float px)` (p v µm, px = µm na točko) in vrne snov, barvila, mejo, središče celice in jedra.
TEM dobi isto `T` prek `ultra()`; posebnosti (diski paličic, prizme sklenine, virusi) gredo v
`temPosebno(...)` z `#define IMA_TEM_POSEBNO`. SEM izračuna višino površine `semVisina()` iz istega `T`
(posebnosti v `semPosebno(...)` z `#define IMA_SEM`). SEM je ločen program (`fragmentPreparata(koda, { sem: true })`),
ki ga upodobi.js prevede šele ob prvem izrisu SEM, ker trikratni `tkivo()` sicer upočasni prevajanje in svetlobni način; preparat s prosto ležečimi celicami (razmaz, kapljica) začne GLSL
z `#define SEM_PROSTE`, da so bakterije, kvasovke in levkociti kroglice ali valji na stekelcu. Nov preparat: datoteka v `preparati/`, vrstica v `index.js`,
po potrebi pravilo v `mapa.js`; `test/mikroskop.test.js` preveri, da se prevede v pravilni obliki in da ima vsaka
struktura atlasa in vsak model svoj preparat.

## Optika (kar je res)

- Vidno polje: številka polja okularja 18 mm · 10 / M (svetloba), zaslon 160 mm / M (TEM), slika 127 mm / M (SEM).
- Ločljivost: Rayleigh d = 1,22 λ / (NAobj + NAkond), λ = 0,55 µm; zaslonka določa NA kondenzorja.
- Globinska ostrina n λ / NA²; razostritev zamegli sliko, objektivi so skoraj parfokalni (odmik ≤ 0,8 µm).
- 100× brez imerzijskega olja: NA največ 0,95 in sferna aberacija, slika je mehka in temnejša (na odru se pokaže
  gumb »Kapni imerzijsko olje«).
- TEM: rezina 70 nm, kontrast s težkimi kovinami, ločljivost biološkega vzorca ≈ 1–2 nm. Nad ~800 000× se slika
  postopoma prelije v model molekul in atomov; vmesnik to jasno pove (besedilo pod podatki), ker TEM posameznih
  molekul v mehkem tkivu ne loči. Pri kosti in zobu visokoločljivi TEM res pokaže mrežo kristala hidroksiapatita.

- SEM: povečava se nanaša na sliko širine 127 mm; ločljivost ≈ 3 nm (zlata prevleka); globinska ostrina
  D = 2 · (0,1 mm / M) / α z α = 5 mrad, torej mnogo večja kot pri svetlobnem mikroskopu. Svetlost je ponazoritev
  sekundarnih elektronov: strme ploskve in robovi so svetli (robni učinek), detektor ob strani da senco, jame so temne.
  Višina površine je izračunana iz preparata (eritrocit po Evansu in Fungu, celice v tkivu kot blazinice, vlakna kot
  snopi, relief preloma je samopodoben), zato vmesnik pove, da je to ponazoritev.

## Molekule (j, 13. 11. 2026)

Nad ~800 000× (TEM) se slika prelije v ponazoritev molekul, ki jih v izbranem preparatu na tem mestu res najdemo
(slog D. Goodsella: obrisi molekul v pravem merilu, ne posnetek).

- Sonda (`pogled.js`) da snov in vrsto celice na obeh straneh najbližje membrane. `molekule-vrste.js` iz tega izbere prizor
  (`prizor`: kri → hemoglobin s hemom in karboanhidrazo, plazma → albumin, IgG, fibrinogen, mišica → miozin, aktin, titin,
  glava T4 → DNK v kapsidi gp23 s Hoc, rep → gp18/gp19, hrustanec → agrekan, hialuronan, kolagen II …) in membrano
  (dvosloj z ATP-sintazo v mitohondriju, fotosistemom v kloroplastu, pas 3 v eritrocitu, črpalko Na⁺/K⁺ v nevronu;
  ovojnica z bodicami pri SARS-CoV-2 (S, ~16 nm: projekcija vseh bodic v ~60 nm debeli rezini, na virionu jih je 24–40)
  in HIV (Env le 7–14 na virion, ~60 nm narazen, nizek; pod ovojnico matriksna beljakovina MA (p17)); mikrovili:
  snop aktina z vilinom in fimbrinom, brez ribosomov.
- Reže: 0–5 stran A, 6–11 stran B, 12–15 membrana. Barve, gostote TEM in vrsta atomov gredo v shader kot uniforme
  (`uBarvaMol`, `uGostMol`, `uAtMol`), prizora kot `uPA`/`uPB`.
- Oznake: upodobi.js nariše prehod ID (48 × 48, reža + 1 v rdečem kanalu), mikroskop.js za vsako molekulo izbere
  najglobljo vidno točko in pokaže do 5 imen brez prekrivanja; pod sliko je seznam z vlogo (`mk.mol.*`, `mk.molv.*`
  v vseh jezikih). Pri atomih (pod 0,06 nm na točko) je še legenda elementov (barve CPK).
- Značilno mesto (`ZNACILNO`): ob prehodu na SEM ali TEM, dokler uporabnik preparata ni sam premikal, gre pogled na
  vnaprej izračunano točko globoko v značilni snovi (`ZNACILNA_TOCKA`: kri → eritrocit, mišica → miofibrila, T4/SARS/HIV →
  dedni zapis v virusu, arterija → elastična membrana …). Točke so izračunane z mrežo sond (256 × 256, korak 0,25 µm, pri
  virusih 4 nm) kot najbližje mesto, ki je vsaj 1 µm (virusi 20 nm) od roba snovi. Če se oblika preparata spremeni in točka
  ne ustreza več, mikroskop išče v njeni okolici (do 5 µm) in nato okoli sredine (do 100 µm).

Viri: PDB 2HHB (hemoglobin), 1AO6 (albumin), 1IGT (mišji IgG2a), 1KX5 (nukleosom), 2MYS (miozin), 5VF3 (gp23 T4),
6VXX (S SARS-CoV-2); Goodsell, *The Machinery of Life* (2009); Alberts, *Molecular Biology of the Cell*, 7. izd.

## Viri

- Ross MH, Pawlina W. *Histology: A Text and Atlas*, 8. izd. Wolters Kluwer 2020 (zgradba tkiv in organov).
- Young B, O'Dowd G, Woodford P. *Wheater's Functional Histology*, 6. izd. Elsevier 2014 (videz preparatov HE).
- Ruifrok AC, Johnston DA. Quantification of histochemical staining by color deconvolution. *Anal Quant Cytol
  Histol* 2001;23:291–299 (optične gostote barvil).
- Murphy DB, Davidson MW. *Fundamentals of Light Microscopy and Electronic Imaging*, 2. izd. Wiley 2012 (ločljivost,
  globinska ostrina, imerzija).
- Goldstein JI et al. *Scanning Electron Microscopy and X-Ray Microanalysis*, 4. izd. Springer 2018 (SEM, sekundarni
  elektroni, robni učinek, globinska ostrina).
- Evans E, Fung YC. Improved measurements of the erythrocyte geometry. *Microvasc Res* 1972;4:335–347 (oblika
  eritrocita).
- Williams DB, Carter CB. *Transmission Electron Microscopy*, 2. izd. Springer 2009 (TEM, kontrast, defokus).
- Ke Z et al. Structures and distributions of SARS-CoV-2 spike proteins on intact virions. *Nature* 2020;588:498–502.
- Briggs JAG, Kräusslich HG. The molecular architecture of HIV. *J Mol Biol* 2011;410:491–500.
- Leiman PG et al. Morphogenesis of the T4 tail and tail fibers. *Virol J* 2010;7:355.
- Raven PH et al. *Biology of Plants*, 8. izd. Freeman 2013 (rastlinski preparati).
