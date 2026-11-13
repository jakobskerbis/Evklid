// Predlogi besed nad črkami (Nastavitve → Vnos → Predlogi besed, privzeto izklopljeno).
// Preprost seznam na napravi, brez povezave: pogoste besede in izrazi iz matematike, fizike in kemije.
// Vrstni red je pogostost: prej v seznamu = prej med predlogi.
export const WORDS = {
  sl: `je in da se na v ne za kaj kako zakaj ali to so pa tudi še kot bi sem si smo ste lahko kje koliko
ker če kdaj potem zdaj prosim hvala razloži pomagaj pokaži izračunaj reši preveri napiši nariši
naloga nalogo naloge rešitev rešitve odgovor odgovora vprašanje primer primera korak koraki postopek
ne razumem vem mislim zakaj kateri katera katero vedno nikoli nekaj vse vsak več manj zelo malo
enačba enačbo enačbe neenačba neenačbo sistem rešiti rešuj spremenljivka neznanka koeficient
funkcija funkcijo funkcije graf grafa odvod odvoda integral integrala limita zaporedje vrsta
ulomek ulomka ulomki ulomke decimalno število števila številka vsota razlika produkt količnik
potenca potence koren korena kvadrat kvadratna kvadratni kub logaritem eksponent eksponentna
trikotnik trikotnika pravokotnik kvadrata krog kroga krožnica premica premice točka točke daljica
kot kota koti stranica stranice ploščina ploščino obseg prostornina prostornino površina površino
polmer premer višina dolžina širina središče simetrala pravokoten vzporeden Pitagorov izrek
sinus kosinus tangens kotangens radian stopinj stopinje vektor vektorja matrika matrike determinanta
verjetnost verjetnosti statistika povprečje mediana odstotek odstotkov razmerje sorazmerje
hitrost hitrosti pospešek pospeška sila sile masa mase teža energija energije delo moč tlak
gostota temperatura toplota čas časa pot razdalja gibanje enakomerno pospešeno nihanje valovanje
napetost tok upor električni magnetno polje naboj frekvenca valovna dolžina svetloba lom odboj
kemija atom atoma atomi molekula molekule ion ioni elektron elektroni proton protoni nevtron
element elementi spojina spojine reakcija reakcije kislina kisline baza baze sol soli oksid
raztopina raztopine koncentracija mol molov molska množina snovi topnost oksidacija redukcija
kisik vodik ogljik dušik žveplo klor natrij kalij kalcij železo baker voda ogljikov dioksid
periodni sistem vezava vez kovalentna ionska enačbo urejanje stehiometrija pH nevtralizacija
biologija celica celice gen geni beljakovine fotosinteza dihanje ekosistem
test kontrolna matura NPZ ocena učitelj šola razred letnik domača naloga vaja vaje ponovi
enota enote meter metrov kilometer kilogram gram sekunda sekunde minuta ura liter newton joule watt`.split(/\s+/),
  en: `the and to of a in is it you that what how why can i do this for be with on are not or if
please thanks explain help show calculate solve check write draw step steps answer question example
equation inequality system variable unknown coefficient function graph derivative integral limit
sequence series fraction decimal number sum difference product quotient power root square cube
logarithm exponent triangle rectangle circle line point segment angle side area perimeter volume
surface radius diameter height length width vector matrix determinant probability statistics mean
median percent ratio velocity speed acceleration force mass weight energy work pressure density
temperature heat time distance motion voltage current resistance charge frequency wavelength light
chemistry atom molecule ion electron proton neutron element compound reaction acid base salt oxide
solution concentration mole molar oxidation reduction oxygen hydrogen carbon nitrogen water
periodic table bond covalent ionic balance stoichiometry test exam homework`.split(/\s+/),
};

// Ko se beseda še ne piše, vrstica predlogov ni prazna: na začetku polja začetki vprašanj, med besedami pogoste vezne besede.
export const ZACETKI = {
  sl: { start: ["Kako", "Zakaj", "Razloži"], next: ["je", "in", "da"] },
  en: { start: ["How", "Why", "Explain"], next: ["the", "is", "to"] },
};
