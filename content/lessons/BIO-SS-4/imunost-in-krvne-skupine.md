---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Okoli leta 1900 je bila transfuzija krvi loterija: nekateri bolniki so po njej okrevali, drugi so v nekaj urah umrli. Nihče ni vedel, zakaj.

Dunajski zdravnik Karl Landsteiner je takrat v epruvetah mešal kri sodelavcev. Opazil je, da se rdeče krvničke ene osebe v plazmi druge včasih zlepijo v kepice, včasih pa ne. Tako je odkril krvne skupine A, B in O; skupino AB sta kmalu zatem opisala njegova sodelavca. Leta 1940 je s sodelavcem opisal še sistem Rh.

Danes transfuzijski center deluje kot skladišče trgovine. Vsaka vrečka krvi ima nalepko s skupino, rok uporabe in črtno kodo. Skladiščnik mora vedeti, katera vrečka sme k kateremu bolniku. Odgovor skriva imunski sistem. Zakaj napade kri, ki je popolnoma zdrava?

## Razlaga

**1. Mamljiva, a napačna predstava.** Veliko ljudi misli, da imunski sistem napade vse, kar je *škodljivo*. Potem ne bi zavrnil zdrave ledvice darovalca ali zdravih krvničk napačne skupine. A ju zavrne. Merilo torej ni škodljivost, ampak razlika med **lastnim in tujim**.

**2. Antigeni kot črtne kode.** Tujek imunski sistem prepozna po **antigenih**. Antigen je molekula, navadno beljakovina ali sladkorna veriga na površini celice ali virusa, na katero se imunski sistem odzove. Spomni se blagajne: čitalnik prebere črtno kodo, ne preverja kakovosti izdelka. Prav tako imunska celica »bere« antigen, ne nevarnosti.

**3. Patogeni.** Povzročitelji bolezni ali **patogeni** so virusi, bakterije, glive, praživali in zajedavci. Virusi niso celice; množijo se le v celicah gostitelja. Nekatere bakterije škodijo s strupi (toksini), na primer bakterija tetanusa.

**4. Dve obrambni črti.** Prva je **nespecifična (prirojena) obramba**: koža, sluznice, želodčna kislina, vnetje in **fagociti**. Fagociti (nevtrofilci in makrofagi) tujke požrejo s fagocitozo in jih razgradijo v lizosomih. Ukrepajo takoj, a na vsak tujek enako.

Druga je **specifična (pridobljena) obramba** limfocitov, ki so dveh vrst: limfociti B in celice T. Aktiviran limfocit B se spremeni v **plazmatko**, celico, ki izdeluje protitelesa. Vsak limfocit ima receptor za en sam antigen. Ob okužbi se v nekaj dneh namnožijo tisti, ki se z antigenom ujemajo.

| Celica | Kaj naredi | Obramba |
|---|---|---|
| fagocit | požre tujek; makrofag pokaže njegove antigene celicam T | nespecifična |
| limfocit B → plazmatka | plazmatka izloča **protitelesa** | specifična |
| celica T pomagalka | s signalnimi molekulami aktivira limfocite B in celice T ubijalke | specifična |
| celica T ubijalka | uniči okuženo ali rakavo celico | specifična |
| spominska celica | ob ponovnem stiku sproži hiter in močan odziv | specifična |

**Protitelo** (imunoglobulin) je beljakovina v obliki črke Y, ki se veže na točno določen antigen. Tujek označi za fagocite ali zlepi več tujkov skupaj. Cepivo vsebuje antigene patogena, a bolezni ne povzroči, zato spominske celice nastanejo vnaprej.

:::premisli
HIV uničuje celice T pomagalke. Napovej: zakaj oseba z aidsom ne zboli za eno samo boleznijo, ampak za vrsto okužb, ki zdravemu človeku ne škodijo?
---
Celice T pomagalke aktivirajo limfocite B in celice T ubijalke. Brez njih skoraj ne nastajajo nova protitelesa, okužene celice pa ostajajo. Oslabljena je specifična obramba proti vsem patogenom, ne le proti HIV.
:::

**5. Krvne skupine ABO.** Na membrani eritrocitov so sladkorne verige, ki delujejo kot antigeni: A, B, oba ali nobeden. V plazmi so že od prvega leta starosti protitelesa proti antigenu, ki ga človek sam **nima**.

| Skupina | Antigen na eritrocitih | Protitelesa v plazmi | Genotip |
|---|---|---|---|
| A | A | anti-B | $I^AI^A$ ali $I^Ai$ |
| B | B | anti-A | $I^BI^B$ ali $I^Bi$ |
| AB | A in B | nobenih | $I^AI^B$ |
| O | nobenega | anti-A in anti-B | $ii$ |

Ko protitelesa naletijo na svoj antigen, eritrocite zlepijo (**aglutinacija**) in razgradijo (**hemoliza**). Te kepice je videl Landsteiner.

**6. Kodominanca.** Gen za skupino ABO ima v populaciji tri alele: $I^A$, $I^B$ in $i$. Vsak človek ima dva. Alela $I^A$ in $I^B$ sta **kodominantna**: v heterozigotu $I^AI^B$ se izrazita oba in eritrocit nosi oba antigena. To ni mešanica »pol A, pol B«. Alel $i$ je recesiven.

Alela $I^A$ in $I^B$ zapisujeta encima, ki na isto sladkorno verigo pripneta različen sladkor. V najpogostejši različici alela $i$ izpad enega nukleotida premakne bralni okvir, zato encim ne deluje.

V simulaciji spodaj »Dedovanje krvnih skupin« izberi starša $I^Ai$ in $I^Bi$. Opazuj, da imata lahko otroka vseh štirih skupin.

**7. Sistem Rh.** Drugi pomemben antigen eritrocitov je **antigen D**. Kdor ga ima, je Rh+ (alel $D$ je dominanten); kdor ga nima, je Rh− (genotip $dd$). Razlika od sistema ABO: človek Rh− protiteles anti-D od rojstva **nima**. Izdela jih šele po stiku s krvničkami Rh+: po transfuziji ali ob porodu, ko otrokova kri zaide v materin obtok.

:::premisli
Mati je Rh−, oče in oba otroka so Rh+. Zakaj je navadno ogrožen šele drugi otrok, prvi pa ne?
---
Z otrokovimi eritrociti Rh+ pride mati v stik predvsem ob prvem porodu; šele takrat nastanejo anti-D in spominske celice. V drugi nosečnosti anti-D prehajajo skozi posteljico in razgrajujejo otrokove eritrocite (hemolitična bolezen novorojenčka). Preprečijo jo z injekcijo anti-D materi po porodu: ta odstranijo otrokove krvničke, preden si jih materin imunski sistem »zapomni«.
:::

**8. Transfuzija.** Pravilo je eno: eritrociti darovalca ne smejo nositi antigena, proti kateremu ima prejemnik protitelesa. Zato je O− **univerzalni darovalec eritrocitov**: nima ne A ne B ne D. Skupina AB+ je **univerzalni prejemnik**: nima ne anti-A ne anti-B ne anti-D. Pri plazmi velja obratno: plazma O vsebuje anti-A in anti-B, univerzalna je plazma AB. V praksi dajejo kri iste skupine in prej naredijo **navzkrižni preizkus**: darovalčeve eritrocite zmešajo s prejemnikovo plazmo in preverijo, ali se zlepijo.

**9. Presaditve.** Pri organih ABO ni dovolj. Celice z jedrom nosijo še tkivne antigene **HLA**, po katerih celice T prepoznajo lastno. Genov HLA je več, vsak z mnogo aleli, zato se tujca skoraj nikoli ne ujemata. Brat ali sestra se v vseh antigenih HLA ujemata z verjetnostjo $\frac{1}{4}$, enojajčni dvojček vedno. Prejemnik organa vse življenje jemlje zdravila, ki zavirajo imunski odziv (imunosupresivi), in je zato bolj dovzeten za okužbe.

## Rešeni primeri

### Primer 1 (lažji): katera vrečka s police?

Bolnik s krvno skupino B, Rh+ potrebuje eritrocite. Na polici transfuzijskega centra so štiri vrečke: O−, A+, B− in AB+. Katere sme dobiti?

**Podatki:** prejemnik B, Rh+; vrečke O−, A+, B−, AB+
**Iščemo:** vrečke, ki so za prejemnika varne

:::formula
Eritrociti darovalca ne smejo nositi antigena, proti kateremu ima prejemnik protitelesa.
:::

**Rešitev:**

1. Skupina B ima v plazmi anti-A; ker je Rh+, anti-D ne izdela. Prepovedan je le antigen A.
2. O− nima antigenov, B− le B: obe sta varni.
3. A+ in AB+ nosita antigen A, zato bi ju anti-A zlepila.
4. Odgovor: bolnik sme dobiti vrečki O− in B−.

### Primer 2: otroci staršev A in B

Mati ima skupino A, njen oče skupino O. Oče otrok ima skupino B, njegova mati skupino O. S kolikšno verjetnostjo ima njun otrok posamezno skupino?

**Podatki:** mati A, njen oče O; oče B, njegova mati O
**Iščemo:** verjetnosti skupin A, B, AB in O pri otroku

:::formula
Otrok dobi en alel od matere in enega od očeta. Verjetnost genotipa $= \dfrac{\text{število ugodnih polj}}{\text{vsa polja}}$ v križanju.
:::

**Rešitev:**

1. Mati je od svojega očeta (skupina O, $ii$) dobila alel $i$, zato je $I^Ai$.
2. Oče je od svoje matere dobil $i$, zato je $I^Bi$.
3. Križanje (vrstice so jajčne celice, stolpci semenčice):

| ♀ \ ♂ | $I^B$ | $i$ |
|---|---|---|
| $I^A$ | $I^AI^B$ (AB) | $I^Ai$ (A) |
| $i$ | $I^Bi$ (B) | $ii$ (O) |

4. Vsako od štirih polj je enako verjetno, zato je vsaka skupina verjetna $\frac{1}{4} = 0{,}25$.
5. Odgovor: otrok ima skupino A, B, AB ali O, vsako z verjetnostjo $25\,\%$. Skupina AB je posledica kodominance.

### Primer 3 (težji): naročilo za porodnišnico

Porodnišnica kupuje zaščito anti-D za prihodnje leto. Pričakuje $1200$ porodov. Denimo, da je $15\,\%$ mater Rh−, otrok matere Rh− pa je Rh+ z verjetnostjo približno $60\,\%$. Dozo po porodu dobi le mati Rh−, ki rodi otroka Rh+. Ena doza stane $50$ €. Koliko doz naj naročijo in koliko bo to stalo?

**Podatki:** $N = 1200$ porodov, $p_1 = 0{,}15$ (delež mater Rh−), $p_2 = 0{,}60$ (verjetnost otroka Rh+), $c = 50$ € na dozo
**Iščemo:** število doz $n_2$ in strošek $C$

:::formula
$n_1 = N \cdot p_1$, $\quad n_2 = n_1 \cdot p_2$, $\quad C = n_2 \cdot c$
:::

**Rešitev:**

1. Mater Rh−: $n_1 = 1200 \cdot 0{,}15 = 180$.
2. Anti-D izdela le mati Rh−, ki rodi otroka Rh+, zato pomnožimo še z $p_2$: $n_2 = 180 \cdot 0{,}6 = 108$.
3. Strošek: $C = 108 \cdot 50 = 5400$ €.
4. Odgovor: naročijo $108$ doz, ki stanejo $5400$ €.

### Primer 4 – zdaj ti: kdo je lahko oče?

Otrok ima skupino O, mati skupino A. Katero skupino ima lahko oče? Ali je oče lahko AB?

**Podatki:** otrok O, mati A
**Iščemo:** možne skupine očeta

:::formula
Otrok $ii$ dobi alel $i$ od vsakega starša.
:::

**Rešitev:**

1. Otrok s skupino O je $ii$, torej je en $i$ dobil od matere: mati je $I^Ai$.
2. Drugi $i$ mora priti od očeta, zato mora oče imeti vsaj en alel $i$.
3. Sklepaj sam: katere skupine imajo genotip z alelom $i$ in ali ga ima kdo s skupino AB?

:::premisli
Katere skupine pridejo v poštev za očeta?
---
Oče je lahko $I^Ai$ (A), $I^Bi$ (B) ali $ii$ (O). Skupina AB ($I^AI^B$) nima alela $i$, zato tak moški ne more biti oče tega otroka.
:::

## Pogoste napake

- **»Imunski sistem napade, kar je škodljivo.«** Potem zdrava ledvica ne bi bila zavrnjena. Prepozna tuje antigene, ne škodljivosti.
- **Antigen in protitelo zamenjaš.** »Skupina A ima anti-A« bi pomenilo, da človek zlepi lastno kri. Skupina A nosi antigen A, v plazmi ima anti-B. Protitelesa so vedno proti antigenu, ki ga *nimaš*.
- **Kodominanca kot mešanica.** AB ni »pol A, pol B«: eritrocit nosi oba polna antigena.
- **»O− je univerzalen za vse.«** Le za eritrocite. Plazma O vsebuje anti-A in anti-B in bi zlepila eritrocite prejemnika A, B ali AB.
- **»Rh− ima anti-D že od rojstva.«** Potem bi bil ogrožen že prvi otrok. Anti-D nastanejo šele po stiku z antigenom D.

## Povzetek

- Imunski sistem loči lastno od tujega po antigenih; patogeni so virusi, bakterije, glive, praživali, zajedavci.
- Nespecifična obramba (koža, sluznice, fagociti, vnetje) deluje takoj; specifična po nekaj dneh: plazmatke izločajo protitelesa, celice T pomagalke aktivirajo, celice T ubijalke uničujejo okužene celice, spominske celice ostanejo.
- ABO: aleli $I^A$, $I^B$ (kodominantna) in $i$ (recesiven); v plazmi so protitelesa proti antigenu, ki ga človek nima.
- Rh: Rh− izdela anti-D šele po stiku (transfuzija, porod), zato je ogrožen drugi otrok Rh+.
- Transfuzija: eritrociti darovalca brez antigena, proti kateremu ima prejemnik protitelesa; O− univerzalni darovalec eritrocitov, AB+ univerzalni prejemnik.
- Presaditve: ujemati se morajo antigeni HLA; prejemnik jemlje imunosupresive.

## Drugače: Kot zgodba

Vrečka O− je prispela v skladišče v ponedeljek. Na nalepki je pisalo: brez A, brez B, brez D. »Sem kot izdelek brez črtne kode,« je pomislila. V torek so jo odnesli k ponesrečencu neznane skupine. Katera koli protitelesa je imel v plazmi, na njenih eritrocitih niso našla ničesar, na kar bi se prijela. Bolnik je preživel.

Sosednja vrečka A+ je šla k bolniku s skupino B, a na navzkrižnem preizkusu so bolnikova anti-A zlepila njene eritrocite. Vrnili so jo na polico.

Pri transfuziji ne odloča, ali je kri »dobra«, ampak katere »kode« nosi in katera protitelesa čakajo v prejemniku.

## Drugače: Korak za korakom s številkami

1. Zapiši antigene prejemnika (A, B, D).
2. Zapiši njegova protitelesa: anti-A, če nima A; anti-B, če nima B; pri Rh− še anti-D (ta nastanejo šele po stiku, a jih upoštevamo vnaprej).
3. Darovalec je primeren, če nima nobenega antigena, ki ga prejemnik nima.

Za štiri od osmih skupin dobiš toliko primernih skupin darovalca:

| Prejemnik | Primerne skupine darovalca | Število |
|---|---|---|
| O− | O− | $1$ |
| A+ | O−, O+, A−, A+ | $4$ |
| B− | O−, B− | $2$ |
| AB+ | vseh osem | $8$ |

Vsak antigen prejemnika podvoji število možnosti: AB+ ima tri antigene in $2 \cdot 2 \cdot 2 = 8$ možnosti, A+ dva in $2 \cdot 2 = 4$.

## Preveri se

? Kaj od naštetega **ne** spada med patogene?
- virus gripe
~ Virus ni celica, a povzroča bolezen: razmnoži se v celicah gostitelja.
- bakterija tetanusa
~ Ta bakterija je patogen; škodi predvsem s strupom (toksinom).
+ protitelo
- gliva kandida
~ Tudi glive so patogeni; kandida povzroča okužbe sluznic.
> Protitelo izdela plazmatka našega telesa; je orožje proti patogenom, ne patogen.

? Oče ima skupino AB, mati skupino O. S kolikšno verjetnostjo ima otrok skupino A?
- $\frac{1}{4}$
~ To velja za starša $I^Ai$ in $I^Bi$ iz Primera 2. Tu ima mati le alel $i$.
+ $\frac{1}{2}$
- $0$
~ Otrok ne podeduje skupine staršev, ampak po en alel: $I^A$ od očeta in $i$ od matere dasta A.
- $\frac{3}{4}$
~ $I^A$ je le eden od dveh očetovih alelov, zato ga otrok dobi v polovici primerov.
> Mati da vedno $i$, oče $I^A$ ali $I^B$ z enako verjetnostjo. Otrok je $I^Ai$ (A) ali $I^Bi$ (B), vsak z verjetnostjo $\frac{1}{2}$.

? Kaj je posledica tega, da HIV uniči celice T pomagalke?
+ Limfociti B in celice T ubijalke se slabo aktivirajo, zato bolnika ogrožajo tudi sicer nenevarne okužbe.
- Imunski sistem začne napadati zdrave celice, ker ne loči več škodljivega od koristnega.
~ Imunski sistem ne loči po škodljivosti; brez pomagalk je odziv šibkejši, ne napačno usmerjen.
- Izginejo fagociti, specifična obramba pa deluje naprej.
~ Fagocitov HIV ne uniči; prizadeta je specifična obramba.
> Celice T pomagalke aktivirajo limfocite B in celice T ubijalke. Brez njih specifična obramba oslabi proti vsem patogenom.

? Tina razmišlja: (1) Bolnik ima skupino A. (2) V plazmi ima zato protitelesa anti-A. (3) Ta bi zlepila eritrocite skupine A. (4) Zato mu eritrocitov skupine A ne smemo dati. V katerem koraku je prva napaka?
- v koraku 1
~ Korak 1 je podatek naloge, ne sklep.
+ v koraku 2
- v koraku 3
~ Korak 3 pravilno sledi iz koraka 2; napaka je že v koraku 2.
- v koraku 4
~ Korak 4 je napačen, ker temelji na koraku 2; prva napaka je prej.
> Skupina A ima v plazmi anti-B; anti-A bi zlepila lastno kri. Bolnik A sme dobiti eritrocite A.

? Marku odpovedujeta ledvici. Ledvico mu želijo darovati oče, prijatelj z isto krvno skupino in enojajčni brat dvojček. Kdo je imunsko najboljši darovalec?
- oče
~ Oče ima z Markom skupen le en komplet genov HLA; drugega je Marko dobil od matere.
- prijatelj z isto krvno skupino
~ Ujemanje ABO ni dovolj: tkivni antigeni HLA se pri tujcu skoraj nikoli ne ujemajo.
+ enojajčni brat dvojček
> Enojajčni dvojček ima enake gene HLA in ABO, zato imunski sistem njegove celice prepozna kot lastne.

<<RACUN
vrednost: 1/4 | 0.25
vrednost: 1200*0.15 | 180
vrednost: 180*0.6 | 108
vrednost: 108*50 | 5400
vrednost: 2*2*2 | 8
vrednost: 2*2 | 4
>>

:::simboli
i | recesivni alel gena ABO (skupina O) | | – | genotip $ii$ da skupino O
N | število porodov v letu | | –
p_1 | delež mater Rh− | | – | število med $0$ in $1$
p_2 | verjetnost, da je otrok matere Rh− Rh+ | | – | število med $0$ in $1$
n_1 | število mater Rh− | n_1 = N \cdot p_1 | –
n_2 | število potrebnih doz anti-D | n_2 = n_1 \cdot p_2 | –
c | cena ene doze | | €
C | skupni strošek | C = n_2 \cdot c | €
:::
