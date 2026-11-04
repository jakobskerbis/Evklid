---
naslov: Kdaj prideš iz hišice?
cas: 1 teden
avtor: AI
stanje: pregledano
---

## Izziv

Pri igri Človek, ne jezi se figura pride iz hišice šele, ko vržeš šestico. Ko so vse tvoje figure v hišici, imaš po pogostem pravilu tri mete. Kako verjetno je, da prideš ven že v prvem krogu? Je to res tako redko, kot se zdi med igro?

## Potrebuješ

- navadno šeststrano igralno kocko
- škatlo ali pladenj z robom, v katerega mečeš kocko
- zvezek ali preglednico
- po želji 3–4 sošolce, ki naredijo enak poskus

## Koraki

1. Pred poskusom izračunaj verjetnost dogodka $A$: »v največ treh metih pade šestica«. Pomagaj si z nasprotnim dogodkom.
2. Nariši drevo in izračunaj verjetnosti, da prva šestica pade v 1., 2. ali 3. metu, ter verjetnost, da je ni. Preveri, da je vsota vseh štirih enaka $1$. Napovej, koliko od $100$ poskusov bo uspešnih.
3. Naredi $100$ poskusov. En poskus je največ trije meti: ko pade šestica, nehaš. Kocko vsakič dobro pretresi v dlani in jo vrzi v škatlo. Za vsak poskus zapiši, v katerem metu je padla šestica ($1$, $2$ ali $3$), ali $0$, če je ni bilo.
4. Po vsakih $10$ poskusih izračunaj relativno frekvenco uspeha (poskus je uspešen, če je šestica padla): število uspešnih poskusov do tedaj, deljeno s številom vseh poskusov do tedaj. Nariši graf (vodoravno število poskusov, navpično relativna frekvenca) in vanj vriši vodoravno črto pri izračunani verjetnosti $P(A)$.
5. V tabeli primerjaj relativne frekvence izidov $1$, $2$, $3$ in $0$ z verjetnostmi iz drevesa.
6. Naj bo $B$ dogodek »šestica pade v prvem metu«. Izračunaj pogojno verjetnost $P(B \mid A)$, da je šestica padla že v prvem metu, če veš, da si prišel iz hišice. Nato med svojimi uspešnimi poskusi preštej tiste, kjer je padla v prvem metu, in izračunaj njihov delež. Primerjaj.
7. Združi svoje podatke s podatki sošolcev (ali naredi še $100$ poskusov) in ponovno izračunaj relativno frekvenco uspeha. Kaj pričakuješ pri več poskusih in kaj se je res zgodilo? Pri $100$ poskusih je razlika med relativno frekvenco in verjetnostjo nekaj stotink povsem običajna, včasih je tudi okoli $0{,}1$.

## Kaj oddaš

Tabelo vseh $100$ poskusov, graf relativne frekvence uspeha, primerjalno tabelo izračunanih verjetnosti in relativnih frekvenc (izidi $1$, $2$, $3$, $0$ in pogojna verjetnost) ter kratek zaključek.

## Merila

- Verjetnost $P(A)$ je izračunana prek nasprotnega dogodka; verjetnosti na drevesu so pravilne in njihova vsota je $1$.
- Zapisanih je vseh $100$ poskusov, relativne frekvence so pravilno izračunane.
- Graf ima označeni osi in izračunano verjetnost kot vodoravno črto.
- Pogojna verjetnost je izračunana s $P(B \mid A) = \dfrac{P(A \cdot B)}{P(A)}$ in primerjana z deležem iz poskusa.
- Zaključek pove, za koliko se relativna frekvenca razlikuje od verjetnosti pri $100$ in pri več poskusih, in razloži, zakaj se ne ujemata natančno.
