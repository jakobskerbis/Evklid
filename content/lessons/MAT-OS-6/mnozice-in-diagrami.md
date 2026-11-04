---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Turistični vodnik po izletu prešteje svojo skupino. Piran je obiskalo $12$ izletnikov, Postojnsko jamo $9$ izletnikov. Vsak je bil vsaj na enem od obeh krajev. Vseh izletnikov pa je samo $16$.

Kako je to mogoče? Saj je $12 + 9 = 21$, ne $16$!

Nihče ni izginil. Nekateri izletniki so bili **na obeh** krajih, zato jih je vodnik štel dvakrat: enkrat pri Piranu in enkrat pri jami. Takih je $21 - 16 = 5$.

Ko podatke razvrstimo v pravi diagram, se taka »uganka« reši sama. Diagrami nam pomagajo urediti kraje na zemljevidu, potnike na avtobusu, znamke v albumu ali odgovore v anketi. Iz njih hitro preberemo, česa je koliko.

## Razlaga

**Množica in element.** Seznam krajev, ki jih je obiskala ena družina, je **množica**. Vsak kraj na tem seznamu je **element** množice. Množica je lahko dana s seznamom (Piran, Koper, Bled) ali z lastnostjo (vsi kraji ob slovenski obali). Pri vsakem predmetu moramo znati odločiti: ali je v množici ali ni.

**Euler-Vennov diagram.** Na list nariši velik pravokotnik. V njem so vsi kraji, o katerih govorimo. V pravokotnik nariši dva kroga, ki se delno prekrivata:

- levi krog $A$: kraji, ki jih je obiskala Ana;
- desni krog $B$: kraji, ki jih je obiskal Bor.

Tako dobiš štiri področja. Prekrivanje krogov je v sredini. Levo od njega je del »samo $A$«, desno del »samo $B$«. Zunaj obeh krogov, a še v pravokotniku, so kraji, kamor ni šel nihče od njiju.

Vsak element napišeš **natanko enkrat**, v tisto področje, kamor sodi. Kraj, ki sta ga obiskala oba, gre v prekrivanje, ne v vsak krog posebej.

:::premisli
Ana je bila v Kopru, Bor ni bil. Bor je bil v Kranju, Ana ni bila. Nihče od njiju ni bil v Celju. V katero področje napišeš vsakega od teh treh krajev?
---
Koper v levi del (samo $A$), Kranj v desni del (samo $B$), Celje pa v pravokotnik zunaj obeh krogov. Tudi Celje spada v diagram, ker je med kraji, o katerih govorimo.
:::

**Presek in unija.** Prekrivanje krogov je **presek**. V njem so elementi, ki so v $A$ **in** v $B$ hkrati. Ves prostor, ki ga pokrivata kroga skupaj, je **unija**. V njej so elementi, ki so v $A$ **ali** v $B$ (ali v obeh). Presek je vedno del unije.

**Carrollov diagram.** Kraje lahko razvrstimo tudi v tabelo. Vrstici povesta eno lastnost, stolpca drugo:

| | ob morju | ni ob morju |
|---|---|---|
| **ima železnico** | Koper | Ljubljana |
| **nima železnice** | Piran | Bovec |

Vsak kraj pade v **natanko eno** polje, ker na obe vprašanji odgovoriš z da ali ne. Polje levo zgoraj je presek lastnosti »ob morju« in »ima železnico«. Prva vrstica in prvi stolpec skupaj sta njuna unija.

:::premisli
Zakaj ima Carrollov diagram za dve lastnosti vedno $4$ polja, Vennov diagram pa tudi $4$ področja (s tistim zunaj krogov)?
---
Ker sta pri dveh lastnostih možne $4$ kombinacije odgovorov: da-da, da-ne, ne-da in ne-ne. Oba diagrama prikažeta iste $4$ skupine, le narisani sta drugače.
:::

V simulaciji spodaj »Vennov diagram: presek in unija« izberi za $A$ soda števila in za $B$ števila, deljiva s $3$. Preden preklopiš na presek, napovej, katera števila bodo v njem. Nato preveri: v preseku so samo $6$, $12$ in $18$, ker so ta števila hkrati soda in deljiva s $3$. Preklopi še na unijo in primerjaj.

**Zapis s simboli.** Ko je slika jasna, jo zapišemo krajše:

- množico zapišemo z zavitimi oklepaji: $A = \{\text{Piran}, \text{Koper}, \text{Bled}\}$;
- $\text{Bled} \in A$ beremo »Bled je element množice $A$«, $\text{Kranj} \notin A$ pa »Kranj ni element množice $A$«;
- presek zapišemo $A \cap B$, unijo $A \cup B$.

Znak $\cap$ je kot podkev, obrnjena navzdol: »in«. Znak $\cup$ je kot posoda, ki zajame vse: »ali«.

## Rešeni primeri

### Primer 1 (lažji): Carrollov diagram z zemljevida

Na turističnem zemljevidu doline je pri vsakem kraju oznaka. Lipa: grad, kopališče. Breg: grad. Vrh: kopališče. Log: nič. Gaj: grad, kopališče. Razvrsti kraje v Carrollov diagram.

**Podatki:** pet krajev z oznakami (Lipa: grad in kopališče; Breg: grad; Vrh: kopališče; Log: brez obojega; Gaj: grad in kopališče)
**Iščemo:** razvrstitev v diagram z vrsticama »ima grad / nima gradu« in stolpcema »ima kopališče / nima kopališča«

:::formula
Za vsak kraj odgovori na dve vprašanji: ima grad? ima kopališče? Odgovora določita natanko eno polje.
:::

**Rešitev:**

1. Lipa in Gaj imata oboje, zato gresta v polje »grad in kopališče«.
2. Breg ima le grad: polje »grad, brez kopališča«.
3. Vrh ima le kopališče: polje »brez gradu, s kopališčem«.
4. Log nima ničesar, zato gre v polje »brez gradu, brez kopališča«. Tudi ta kraj sodi v diagram.

| | ima kopališče | nima kopališča |
|---|---|---|
| **ima grad** | Lipa, Gaj | Breg |
| **nima gradu** | Vrh | Log |

Odgovor: v vsakem polju je vsaj en kraj, največ krajev (dva) je v polju »grad in kopališče«.

### Primer 2: presek in unija dveh potovanj

Ana je poleti obiskala kraje $A = \{\text{Piran}, \text{Koper}, \text{Bled}, \text{Postojna}\}$, Bor pa $B = \{\text{Bled}, \text{Postojna}, \text{Ptuj}\}$. Določi presek in unijo. Koliko različnih krajev sta obiskala skupaj?

**Podatki:** množica $A$ s $4$ elementi, množica $B$ s $3$ elementi
**Iščemo:** $A \cap B$, $A \cup B$ in število elementov unije

:::formula
Presek: elementi, ki so v $A$ in v $B$. Unija: elementi, ki so v $A$ ali v $B$, vsak napisan enkrat.
:::

**Rešitev:**

1. Poiščemo skupne kraje, ker gredo v prekrivanje krogov: $A \cap B = \{\text{Bled}, \text{Postojna}\}$.
2. Samo v $A$ sta Piran in Koper, samo v $B$ je Ptuj.
3. Uniji pripadajo vsa tri področja, vsak kraj enkrat: $A \cup B = \{\text{Piran}, \text{Koper}, \text{Bled}, \text{Postojna}, \text{Ptuj}\}$.
4. Preštejemo: $2 + 2 + 1 = 5$.

Odgovor: skupaj sta obiskala $5$ različnih krajev, Bled in Postojno sta videla oba.

### Primer 3 (težji): manjkajoča polja v tabeli

Na zbirnem mestu je $40$ planincev in kopalcev. Z vlakom jih je prišlo $22$, ostali z avtobusom. Na morje jih gre $25$, ostali v gore. Z vlakom in na morje jih gre $14$. Koliko jih je v vsakem polju Carrollovega diagrama?

**Podatki:** vseh $40$, z vlakom $22$, na morje $25$, z vlakom in na morje $14$
**Iščemo:** števila v vseh štirih poljih

:::formula
Polja v eni vrstici dajo skupaj vrstico, polja v enem stolpcu dajo skupaj stolpec, vsa štiri polja dajo vse.
:::

**Rešitev:**

1. Z vlakom v gore: vrstica »vlak« ima $22$, od tega $14$ na morje, torej $22 - 14 = 8$.
2. Z avtobusom na morje: stolpec »morje« ima $25$, od tega $14$ z vlakom, torej $25 - 14 = 11$.
3. Z avtobusom v gore: od vseh odštejemo vrstico »vlak« in polje iz koraka 2, $40 - 22 - 11 = 7$.
4. Preizkus: $14 + 8 + 11 + 7 = 40$.

| | morje | gore |
|---|---|---|
| **vlak** | $14$ | $8$ |
| **avtobus** | $11$ | $7$ |

Odgovor: z vlakom na morje $14$, z vlakom v gore $8$, z avtobusom na morje $11$ in z avtobusom v gore $7$ potnikov.

### Primer 4 – zdaj ti

V razredu je $30$ učencev. Z letalom jih je že letelo $18$, z ladjo se jih je peljalo $12$, oboje je doživelo $7$ učencev. Koliko učencev ni bilo še ne na letalu ne na ladji?

**Podatki:** vseh $30$, letalo $18$, ladja $12$, oboje $7$
**Iščemo:** število učencev zunaj obeh krogov

:::formula
Število v uniji = samo letalo + oboje + samo ladja. Zunaj krogov = vsi − unija.
:::

**Rešitev:**

1. V presek vpišemo $7$.
2. Samo letalo: $18 - 7 = 11$. Samo ladja: $12 - 7 = 5$.
3. Izračunaj unijo in nato še število zunaj krogov.

:::premisli
Koliko je v uniji in koliko zunaj obeh krogov?
---
V uniji je $11 + 7 + 5 = 23$ učencev, zunaj krogov pa $30 - 23 = 7$ učencev.
:::

## Pogoste napake

- **Dvojno štetje.** »Piran $12$, jama $9$, skupaj $21$.« Tako izletnike iz preseka štejemo dvakrat. Pravilno: vsak element je v diagramu le enkrat. Seštej področja ali od vsote odštej presek: $12 + 9 - 5 = 16$.
- **Zamenjava »in« ter »ali«.** Učenec v presek napiše vse kraje obeh družin. Presek pa zahteva oboje hkrati, zato je manjši. Vprašaj se: ali mora element imeti obe lastnosti (presek) ali zadošča ena (unija)?
- **Pozabljeno področje zunaj krogov.** Kraj, ki ga ni obiskal nihče, učenec izpusti. Tudi ta kraj je element pravokotnika. Pri nalogah »koliko nobenega« je ravno to področje odgovor.
- **Isti element v dveh poljih.** Bled napišemo v krog $A$ in še enkrat v krog $B$, namesto v prekrivanje. Diagram potem kaže, kot da sta to dva kraja. Element, ki je v obeh množicah, sodi v presek, in to le enkrat.

## Povzetek

- Množica je skupina predmetov, vsak od njih je element. $x \in A$: $x$ je v $A$; $x \notin A$: ni v $A$.
- Euler-Vennov diagram: krogi v pravokotniku. Prekrivanje je presek, oba kroga skupaj sta unija, zunaj krogov so elementi brez obeh lastnosti.
- Presek $A \cap B$: elementi v $A$ **in** v $B$. Unija $A \cup B$: elementi v $A$ **ali** v $B$.
- Carrollov diagram: tabela, vrstici za eno lastnost, stolpca za drugo; vsak element v natanko enem polju.
- Vsak element vpišeš enkrat. Pri štetju unije preseka ne šteješ dvakrat.

## Drugače: Z analogijo

Kroga si predstavljaj kot dva kroga svetlobe, ki ju na tla mečeta dve svetilki in se delno prekrivata. Kjer sveti samo leva svetilka, je »samo $A$«. Kjer svetita obe, so tla osvetljena dvojno: to je presek. Kjer ne sveti nobena, je temno: to so elementi zunaj krogov.

Če vprašaš »kje je svetlo?«, je odgovor ves osvetljen del, ne glede na to, katera svetilka sveti. To je unija. Če vprašaš »kje svetita obe?«, je odgovor le dvojni del. To je presek. Dvojno osvetljen košček tal je še vedno en sam košček, zato ga ne šteješ dvakrat.

## Drugače: Iz vsakdanjega življenja

Na šolski ekskurziji učiteljica sprašuje:

- »Dvignite roko, kdor ima s seboj zemljevid.« Roke dvigne množica $A$.
- »Dvignite roko, kdor ima telefon.« Roke dvigne množica $B$.
- »Zdaj naj stoji, kdor ima zemljevid **in** telefon.« Stojijo le učenci iz preseka.
- »Na avtobus naj gre vsak, ki ima zemljevid **ali** telefon.« Na avtobus gre unija, tudi tisti z obojim, a vsak sede le na en sedež.

Kdor nima ne enega ne drugega, ostane na pločniku. Tudi on je del razreda, le zunaj obeh krogov.

## Preveri se

? Na zemljevidu je $A$ množica krajev ob morju, $B$ pa množica krajev z gradom. Kaj je presek $A \cap B$?
- Vsi kraji, ki so ob morju ali imajo grad.
~ To je unija. Pri preseku mora kraj imeti obe lastnosti hkrati.
+ Kraji, ki so ob morju in imajo grad.
- Kraji, ki niso ob morju in nimajo gradu.
~ To so kraji zunaj obeh krogov, nimajo nobene od lastnosti.
> Presek so elementi, ki so v $A$ in v $B$ hkrati: kraj mora biti ob morju in imeti grad.

? Ana: $A = \{\text{Piran}, \text{Koper}, \text{Bled}, \text{Ptuj}, \text{Celje}\}$. Bor: $B = \{\text{Bled}, \text{Ptuj}, \text{Kranj}\}$. Uredi po številu elementov od najmanjše do največje.
- $B$, $A \cap B$, $A$, $A \cup B$
~ Presek je del vsake od obeh množic, zato ne more imeti več elementov kot $B$.
- $A \cap B$, $B$, $A \cup B$, $A$
~ Unija vsebuje vse elemente iz $A$ in še Kranj, zato ima več elementov kot $A$.
+ $A \cap B$, $B$, $A$, $A \cup B$
> Presek ima $2$ elementa, $B$ jih ima $3$, $A$ jih ima $5$, unija pa $6$. Presek je vedno najmanjši, unija največja.

? Ana je bila v Kopru, Bor ne. Kaj se zgodi s presekom $A \cap B$ in unijo $A \cup B$, če Bor zdaj obišče še Koper?
- Unija dobi en element več, presek ostane enak.
~ Koper je že v uniji, ker je v $A$. Element v množici zapišemo le enkrat.
+ Presek dobi en element več, unija ostane enaka.
- Presek in unija dobita vsak en element več.
~ Unija se ne spremeni, ker je bil Koper v njej že prej, pri Ani.
> Koper je zdaj v $A$ in v $B$, zato se preseli v presek. Unija ostane enaka, ker je Koper v njej že bil.

? Na izletu je $20$ otrok. Plavalo jih je $13$, na pohod jih je šlo $10$, vsak je naredil vsaj eno od tega. Koliko jih je plavalo in šlo na pohod?
- $23$
~ To je $13 + 10$. Ta vsota šteje otroke iz preseka dvakrat in je večja od vseh otrok.
+ $3$
- $7$
~ To je $20 - 13$: otroci, ki niso plavali. Ti so šli samo na pohod.
> $13 + 10 = 23$, kar je $3$ več od $20$. Teh $3$ otrok je vsota štela dvakrat, ker so v preseku.

? V razredu je $32$ učencev. Na morju jih je bilo $20$, v gorah $15$, na obeh $9$. Koliko jih ni bilo ne na morju ne v gorah?
- $26$
~ To je število v uniji, torej tistih, ki so bili vsaj nekje. Odšteti ga moraš od vseh.
- $9$
~ $9$ jih je bilo na obeh, to je presek, ne področje zunaj krogov.
+ $6$
- $0$
~ Pri $20 + 15 = 35$ se zdi, da so bili vsi nekje, a $9$ učencev je vsota štela dvakrat.
> V uniji je $20 + 15 - 9 = 26$ učencev, zunaj krogov pa $32 - 26 = 6$.

:::simboli
A | množica $A$ (na primer kraji, ki jih je obiskala Ana) | |
B | množica $B$ (na primer kraji, ki jih je obiskal Bor) | |
:::
