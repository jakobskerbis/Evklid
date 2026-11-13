# Mikroskop

Virtualni mikroskop od 40× do 50 000 000× (j, 12. 11. 2026: »Naj ima povečavo do 50000000«, »TEM«, »Naj bo možno vsako
tkivo v 3D svetu pogledati z mikroskopom«). Svetlobni mikroskop do 1000×, nad tem presevni elektronski mikroskop (TEM).

## Kje je

- Stran `/3d#mikroskop?p=<id preparata>` (kartica »Mikroskop« v zbirki 3D sveta in v iskanju).
- Gumb »Poglej z mikroskopom« (`mk.open`): na kartici vsake strukture atlasa telesa, v glavi vsakega modela celice,
  organa in procesa ter v oknu dela organa iz GLB (del lahko izbere drug preparat, npr. aorta → arterija).
- V lekcijah kot simulacija `mikroskop` (`public/sim/katalog.js`; motor ni `lab-*`, ker potrebuje brskalnik in i18n).

## Datoteke (`public/mikroskop/`)

| datoteka | vsebina |
|---|---|
| `mikroskop.js` | vmesnik: oder (platno, igla v okularju, oznaka pod kazalcem, merilce), plošča z nadzorom, izbirnik preparatov |
| `optika.js` | objektivi, vidno polje, ločljivost, globinska ostrina, zamegljenost, ravni TEM (brez DOM, testi) |
| `pogled.js` | stanje → uniforme za izris |
| `upodobi.js` | WebGL2: preparat → Gaussova zamegljenost → sloj molekul → sestava (okrogel okular ali TEM čez ves oder) |
| `glsl.js` | skupni GLSL: šum, Voronoi celice, organeli, `ultra()` za TEM, membrane |
| `molekule.js` | sloj molekul in atomov (fosfolipidi, kolagen, DNK, hidroksiapatit …) |
| `barvila.js` | barvanja kot Beer–Lambertova mešanica treh barvil (optične gostote) |
| `mapa.js` | struktura atlasa ali model → preparat |
| `preparati/` | 47 preparatov; `index.js` je seznam (id, datoteka, izvoz, ime, skupina) |

## Pogodba preparata

Objekt `{ id, ime, opis, barvanje, zacetek: { m, sredisce }, imena, snovi, isci, glsl }`. GLSL definira
`T tkivo(vec2 p, float px)` (p v µm, px = µm na točko) in vrne snov, barvila, mejo, središče celice in jedra.
TEM dobi isto `T` prek `ultra()`; posebnosti (diski paličic, prizme sklenine, virusi) gredo v
`temPosebno(...)` z `#define IMA_TEM_POSEBNO`. Nov preparat: datoteka v `preparati/`, vrstica v `index.js`,
po potrebi pravilo v `mapa.js`; `test/mikroskop.test.js` preveri, da se prevede v pravilni obliki in da ima vsaka
struktura atlasa in vsak model svoj preparat.

## Optika (kar je res)

- Vidno polje: številka polja okularja 18 mm · 10 / M (svetloba), zaslon 160 mm / M (TEM).
- Ločljivost: Rayleigh d = 1,22 λ / (NAobj + NAkond), λ = 0,55 µm; zaslonka določa NA kondenzorja.
- Globinska ostrina n λ / NA²; razostritev zamegli sliko, objektivi so skoraj parfokalni (odmik ≤ 0,8 µm).
- 100× brez imerzijskega olja: NA največ 0,95 in sferna aberacija, slika je mehka in temnejša (na odru se pokaže
  gumb »Kapni imerzijsko olje«).
- TEM: rezina 70 nm, kontrast s težkimi kovinami, ločljivost biološkega vzorca ≈ 1–2 nm. Nad ~800 000× se slika
  postopoma prelije v model molekul in atomov; vmesnik to jasno pove (besedilo pod podatki), ker TEM posameznih
  molekul v mehkem tkivu ne loči. Pri kosti in zobu visokoločljivi TEM res pokaže mrežo kristala hidroksiapatita.

## Viri

- Ross MH, Pawlina W. *Histology: A Text and Atlas*, 8. izd. Wolters Kluwer 2020 (zgradba tkiv in organov).
- Young B, O'Dowd G, Woodford P. *Wheater's Functional Histology*, 6. izd. Elsevier 2014 (videz preparatov HE).
- Ruifrok AC, Johnston DA. Quantification of histochemical staining by color deconvolution. *Anal Quant Cytol
  Histol* 2001;23:291–299 (optične gostote barvil).
- Murphy DB, Davidson MW. *Fundamentals of Light Microscopy and Electronic Imaging*, 2. izd. Wiley 2012 (ločljivost,
  globinska ostrina, imerzija).
- Williams DB, Carter CB. *Transmission Electron Microscopy*, 2. izd. Springer 2009 (TEM, kontrast, defokus).
- Ke Z et al. Structures and distributions of SARS-CoV-2 spike proteins on intact virions. *Nature* 2020;588:498–502.
- Briggs JAG, Kräusslich HG. The molecular architecture of HIV. *J Mol Biol* 2011;410:491–500.
- Leiman PG et al. Morphogenesis of the T4 tail and tail fibers. *Virol J* 2010;7:355.
- Raven PH et al. *Biology of Plants*, 8. izd. Freeman 2013 (rastlinski preparati).
