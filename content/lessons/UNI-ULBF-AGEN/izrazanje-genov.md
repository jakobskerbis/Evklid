---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko so leta 2001 objavili prvo različico človeškega genoma, je presenetila številka: le okoli $20\,000$ genov za beljakovine, približno toliko kot pri drobni glisti. Še bolj presenetljiv je drug podatek: zaporedja, ki dejansko določajo beljakovine, zavzemajo le $1$–$2\,\%$ genoma. Gen za distrofin je dolg okoli $2{,}2$ milijona baznih parov, njegova zrela mRNA pa le okoli $14\,000$ nukleotidov; samo prepis enega gena traja približno $16$ ur.

Če bi bil gen preprosto »recept«, ki se prebere od začetka do konca, takih podatkov ne bi razumeli. Izražanje gena je večstopenjska obdelava informacije: prepis (**transkripcija**), obdelava prepisa, prevod (**translacija**) po **genskem kodu**. Vsak korak je merljiv: koliko nukleotidov, koliko kodonov, koliko aminokislin in koliko energije. Ti računi so vsakdan v laboratoriju, od načrtovanja začetnih oligonukleotidov do iskanja genov v zaporedjih.

## Razlaga

**1. Kje preprosta slika odpove.** »Gen je odsek DNA, ki se prebere kot besedilo; vsakemu genu ustreza ena beljakovina, mRNA pa je kopija gena.« Vsak del te povedi je pri evkariontih napačen ali nepopoln. Prepiše se le ena veriga in to v obratni smeri; iz prepisa se izrežejo deli; prevaja se le srednji del mRNA in to v trojkah; isti gen lahko da več beljakovin. Spodaj gremo korak za korakom.

**2. Centralna dogma in verigi gena.** Informacija teče DNA → RNA → beljakovina. **Gen** je odsek DNA, ki se prepiše v funkcionalno RNA (mRNA, tRNA, rRNA in druge); pri genih za beljakovine ta mRNA nato določa zaporedje aminokislin.

Verigi DNA sta antiparalelni. **Matrična** (nekodirajoča) veriga je tista, ki jo RNA-polimeraza bere; **kodirajoča** veriga ima enako zaporedje kot mRNA, le da je namesto T uracil U. Zaporedja pišemo od konca $5'$ proti koncu $3'$.

```
kodirajoča 5'-ATG AAA GCT-3'
matrična   3'-TAC TTT CGA-5'
mRNA       5'-AUG AAA GCU-3'
```

**3. Transkripcija.** **RNA-polimeraza** sintetizira RNA v smeri $5' \to 3'$ in pri tem bere matrično verigo v smeri $3' \to 5'$. Začetnega oligonukleotida ne potrebuje (za razliko od DNA-polimeraze).

- **Iniciacija:** polimeraza prepozna **promotor**. Pri bakterijah sta to zaporedji okoli $-35$ in $-10$ pred začetkom prepisa (prepozna ju podenota $\sigma$); pri evkariontih se na promotor (npr. škatlo TATA) najprej vežejo splošni transkripcijski dejavniki.
- **Elongacija:** polimeraza odvije okoli $15$ baznih parov DNA in dodaja ribonukleotide, komplementarne matrici; pri bakterijah okoli $40$–$80$ nukleotidov na sekundo.
- **Terminacija:** pri bakterijah lasnična zanka v RNA ali protein Rho; pri evkariontih se prepis odcepi za signalom za poliadenilacijo.

Evkarionti imajo tri jedrne RNA-polimeraze: I (večina rRNA), II (mRNA) in III (tRNA, 5S rRNA).

**4. Obdelava evkariontske pre-mRNA.** Prepis gena (pre-mRNA) se v jedru spremeni v zrelo mRNA:

- na konec $5'$ se doda **kapa** (7-metilgvanozin), ki ščiti pred razgradnjo in pomaga ribosomu najti mRNA;
- na konec $3'$ se doda **poli(A)-rep** iz približno $200$ adeninskih nukleotidov;
- **izrezovanje** (spajanje, angl. *splicing*): spliceosom odstrani **introne** (navadno se začnejo z GU in končajo z AG), **eksoni** se spojijo.

Zrela mRNA ima tri dele: **5'-UTR** (neprevedena regija), **kodirajoče zaporedje** od začetnega kodona AUG do stop kodona in **3'-UTR**. Pri **alternativnem izrezovanju** se iz istega gena izrežejo različni eksoni, zato nastanejo različne beljakovine; pri človeku to velja za večino genov z več eksoni. Pri bakterijah introni v genih za beljakovine praktično niso prisotni, ovojnice jedra ni, zato se translacija začne, ko prepis še teče.

**5. Genski kod.** **Kodon** je trojka nukleotidov v mRNA, ki določa eno aminokislino ali konec.

**Lastnosti genskega koda.**

- **Tripletni:** $4^3 = 64$ kodonov; $61$ določa aminokisline, $3$ (UAA, UAG, UGA) so **stop** kodoni.
- **Začetek:** AUG določa metionin in označi začetek bralnega okvira.
- **Nedvoumen:** vsak kodon določa natanko eno aminokislino.
- **Izrojen (degeneriran):** večina aminokislin ima več kodonov (levcin, serin in arginin po $6$, metionin in triptofan po $1$); sinonimni kodoni se navadno razlikujejo na tretjem mestu.
- **Brez prekrivanja in brez ločil:** kodoni se berejo zaporedoma od AUG naprej, vsak nukleotid pripada enemu kodonu.
- **Skoraj univerzalen:** enak pri bakterijah, rastlinah in živalih, z redkimi izjemami (mitohondriji).

**Bralni okvir** določa, kje se začne prva trojka. Isto zaporedje ima tri bralne okvire na vsaki verigi. Vstavitev ali izbris enega nukleotida premakne okvir za vse nadaljnje kodone (**premik bralnega okvira**).

:::premisli
Zakaj kod ne more biti dvojiški (po dva nukleotida na aminokislino)? Kaj pove razlika med $64$ kodoni in $21$ pomeni ($20$ aminokislin in stop)?
---
Dvojic je le $4^2 = 16$, kar je manj kot $20$ aminokislin. Trojk je $64$, več kot potrebnih $21$, zato je kod izrojen. Presežek ni odveč: zaradi njega mnoge točkovne mutacije na tretjem mestu ne spremenijo beljakovine.
:::

**6. Translacija.** Prevod poteka na **ribosomu** (bakterije $70\mathrm{S}$ iz podenot $30\mathrm{S}$ in $50\mathrm{S}$; evkarionti $80\mathrm{S}$ iz $40\mathrm{S}$ in $60\mathrm{S}$). **tRNA** ima na eni strani **antikodon**, ki se antiparalelno pari s kodonom, na drugi pripeto aminokislino. Pravo aminokislino na tRNA pripne **aminoacil-tRNA-sintetaza**: za vsako aminokislino je navadno ena, zato so ravno sintetaze »prevajalci« koda.

- **Iniciacija:** pri bakterijah se mala podenota veže na **Shine-Dalgarnovo zaporedje** pred AUG, prva tRNA nosi formilmetionin. Pri evkariontih se mala podenota veže na kapo in **skenira** mRNA do prvega AUG v ugodnem okolju. Iniciatorska tRNA sedi na mestu P.
- **Elongacija:** aminoacil-tRNA vstopi na mesto **A**; **peptidil-transferaza** (aktivno mesto je rRNA, ribosom je ribocim) prenese rastočo verigo na aminokislino na mestu A; ribosom se pomakne za en kodon, prazna tRNA preide na mesto **E** in odide. Veriga raste od konca N proti koncu C.
- **Terminacija:** stop kodona ne prepozna nobena tRNA, ampak **sprostitveni dejavnik**; veriga se sprosti, ribosom razpade.

Energija: pripenjanje aminokisline porabi ATP do AMP (dve energijsko bogati vezi), vsak korak elongacije pa dva GTP. Za vsako peptidno vez so torej potrebne okoli $4$ energijsko bogate fosfatne vezi.

:::premisli
V kodirajočem zaporedju zamenjamo en nukleotid, drugič pa enega vstavimo. Katera sprememba bo verjetneje uničila delovanje beljakovine in zakaj?
---
Vstavitev. Zamenjava spremeni največ en kodon (morda sploh ne aminokisline, če je na tretjem mestu). Vstavitev premakne bralni okvir za vse nadaljnje kodone: zaporedje aminokislin za mestom je povsem drugo, prej ali slej pa se pojavi prezgodnji stop kodon.
:::

## Rešeni primeri

Pri primerih uporabi tabelo genskega koda iz učbenika; potrebni kodoni so navedeni v blokih s formulo.

### Primer 1 (lažji)

Odsek matrične verige DNA je $3'$-TAC TTT CGA ACC CTG ATT-$5'$. Zapiši kodirajočo verigo, mRNA in zaporedje aminokislin.

**Podatki:** matrična veriga $3'$-TAC TTT CGA ACC CTG ATT-$5'$
**Iščemo:** kodirajočo verigo, mRNA, zaporedje aminokislin

:::formula
Pari A–T (v RNA A–U) in G–C; mRNA je antiparalelna matrici. Kodoni: AUG Met, AAA Lys, GCU Ala, UGG Trp, GAC Asp, UAA stop.
:::

**Rešitev:**

1. mRNA je komplementarna matrici in antiparalelna: $5'$-AUG AAA GCU UGG GAC UAA-$3'$.
2. Kodirajoča veriga ima isto zaporedje s T: $5'$-ATG AAA GCT TGG GAC TAA-$3'$.
3. Prevod od AUG po trojkah: AUG Met, AAA Lys, GCU Ala, UGG Trp, GAC Asp, UAA stop.
4. Odgovor: peptid je Met–Lys–Ala–Trp–Asp (pet aminokislin; stop kodon aminokisline ne doda).

### Primer 2

Evkariontski gen je od začetka do konca prepisa dolg $12\,000$ baznih parov. Zrela mRNA brez poli(A)-repa ima $1500$ nukleotidov, od tega $60$ v 5'-UTR in $240$ v 3'-UTR. Koliko aminokislin ima beljakovina in kolikšna je njena približna molekulska masa (povprečno $110\,\mathrm{Da}$ na aminokislino)? Koliko časa traja prepis pri hitrosti $40$ nukleotidov na sekundo in prevod pri $5$ aminokislinah na sekundo?

**Podatki:** dolžina gena $12\,000\,\mathrm{bp}$; zrela mRNA $1500\,\mathrm{nt}$; 5'-UTR $60\,\mathrm{nt}$; 3'-UTR $240\,\mathrm{nt}$; $110\,\mathrm{Da}$ na aminokislino; prepis $40\,\mathrm{nt/s}$; prevod $5$ aminokislin na sekundo
**Iščemo:** število aminokislin, molekulsko maso, čas prepisa in prevoda

:::formula
kodirajoče zaporedje $= L_\mathrm{mRNA} - L_5 - L_3$; kodonov $= \frac{\text{kodirajoče}}{3}$; aminokislin $=$ kodonov $- 1$ (stop)
:::

**Rešitev:**

1. Kodirajoče zaporedje: $1500 - 60 - 240 = 1200\,\mathrm{nt}$, vključno s stop kodonom.
2. Kodonov je $\frac{1200}{3} = 400$; aminokislin je $400 - 1 = 399$.
3. Molekulska masa: $399 \cdot 110 = 43\,890\,\mathrm{Da}$, približno $44\,\mathrm{kDa}$.
4. Prepis zajame ves gen z introni: $\frac{12\,000}{40} = 300\,\mathrm{s}$, torej $5$ minut.
5. Prevod: $\frac{399}{5} = 79{,}8\,\mathrm{s}$, okoli $80$ sekund.
6. Introni skupaj: $12\,000 - 1500 = 10\,500\,\mathrm{nt}$, torej $87{,}5\,\%$ prepisa se izreže.
7. Odgovor: beljakovina ima $399$ aminokislin in okoli $44\,\mathrm{kDa}$; prepis traja okoli $5$ minut, prevod okoli $80$ sekund. Večino časa prepisa porabijo introni.

### Primer 3 (težji)

Zrela mRNA ima na začetku zaporedje $5'$-CUGCC AUG GCU CAA UGG AAA UGC UAA GG-$3'$ (presledki le zaradi preglednosti). (a) Določi bralni okvir in peptid. (b) Napovej učinek mutacij: (i) GCU → GCC; (ii) C v CAA → U; (iii) G na tretjem mestu UGG → U; (iv) vstavitev G takoj za AUG. Razvrsti jih kot tihe, smiselne (*missense*), nesmiselne (*nonsense*) ali s premikom okvira. (c) V zaporedju sta še dva AUG (v »CAA UGG« in »AAA UGC«). Zakaj ribosom ne začne tam?

**Podatki:** mRNA $5'$-CUGCC AUG GCU CAA UGG AAA UGC UAA GG-$3'$; mutacije (i)–(iv)
**Iščemo:** peptid, vrsta in učinek vsake mutacije, razlog za izbiro AUG

:::formula
Kodoni: GCU in GCC Ala, CAA Gln, UAA stop, UGG Trp, UGU Cys, AAA Lys, UGC Cys, GGC Gly, UCA Ser, GAA Glu, CUA Leu, AGG Arg.
:::

**Rešitev:**

1. (a) Prvi AUG je za CUGCC; od tam po trojkah: AUG Met, GCU Ala, CAA Gln, UGG Trp, AAA Lys, UGC Cys, UAA stop.
2. Peptid: Met–Ala–Gln–Trp–Lys–Cys (šest aminokislin).
3. (b)(i) GCC je prav tako Ala: **tiha** mutacija, peptid enak.
4. (ii) CAA → UAA: tretji kodon postane stop kodon, **nesmiselna** mutacija; peptid se konča z Met–Ala.
5. (iii) UGG → UGU: Trp → Cys, **smiselna** mutacija (ena aminokislina drugačna).
6. (iv) Nov okvir: AUG GGC UCA AUG GAA AUG CUA AGG …: Met–Gly–Ser–Met–Glu–Met–Leu–Arg …; prvotni stop UAA ni več v okviru, branje teče naprej do prvega stop kodona v novem okviru. **Premik bralnega okvira**: vse za mestom vstavitve je drugače.
7. (c) Notranja AUG (drugi in tretji, CA**AUG**G in AA**AUG**C) ležita v drugem bralnem okviru, zamaknjenem za en nukleotid; v (iv) sta zato postala Met. Evkariontski ribosom skenira od kape in začne pri prvem ustreznem AUG; od tam je okvir določen.
8. Odgovor: peptid Met–Ala–Gln–Trp–Lys–Cys; (i) tiha, (ii) nesmiselna (Met–Ala), (iii) smiselna (Trp → Cys), (iv) premik okvira, najhujša posledica. Notranja AUG sta zunaj okvira in se ne uporabita.

### Primer 4 – zdaj ti

Koliko različnih zaporedij mRNA (od AUG do vključno stop kodona) kodira peptid Met–Lys–Phe–Gly?

**Podatki:** peptid Met–Lys–Phe–Gly; število kodonov: Met $1$, Lys $2$, Phe $2$, Gly $4$, stop $3$
**Iščemo:** število možnih kodirajočih zaporedij mRNA

:::formula
Neodvisne izbire se množijo: število $=$ produkt števil kodonov za vsako mesto.
:::

**Rešitev:**

1. Za vsako mesto je izbira kodona neodvisna od drugih.
2. Pomnoži števila kodonov za vseh pet mest (štiri aminokisline in stop).

:::premisli
Koliko je zaporedij?
---
$1 \cdot 2 \cdot 2 \cdot 4 \cdot 3 = 48$. Zato iz zaporedja beljakovine ne moremo enolično rekonstruirati gena; obratno pa mRNA v danem bralnem okviru enolično določa zaporedje aminokislin (kod je nedvoumen).
:::

## Pogoste napake

- **mRNA je enaka matrični verigi.** mRNA je komplementarna matrični in ima zaporedje **kodirajoče** verige (z U). Pri prepisu iz matrice ne pozabi obrniti smeri, da pišeš $5' \to 3'$.
- **Prevajanje od začetka mRNA.** Kodoni se štejejo od AUG, ne od konca $5'$. Del pred AUG (5'-UTR) in za stop kodonom (3'-UTR) se ne prevede.
- **Stop kodon kot aminokislina.** $400$ kodonov da $399$ aminokislin. Stop kodona ne prepozna tRNA, ampak sprostitveni dejavnik.
- **Introni se prevedejo.** Dolžina gena ni dolžina mRNA. Beljakovino določajo le eksoni, pa še ti ne v celoti (UTR).
- **»Ena mutacija, ena spremenjena aminokislina.«** Zamenjava na tretjem mestu je pogosto tiha, nesmiselna mutacija skrajša beljakovino, vstavitev ali izbris premakne okvir za vse nadaljnje kodone.
- **En gen, ena beljakovina.** Z alternativnim izrezovanjem nastanejo iz istega gena različne mRNA in beljakovine.

## Povzetek

- DNA → RNA → beljakovina; RNA-polimeraza bere matrično verigo $3' \to 5'$ in sintetizira RNA $5' \to 3'$; mRNA ima zaporedje kodirajoče verige z U.
- Transkripcija: promotor, iniciacija, elongacija, terminacija; pri evkariontih tri jedrne RNA-polimeraze.
- Obdelava pre-mRNA: kapa na $5'$, poli(A)-rep na $3'$, izrezovanje intronov; alternativno izrezovanje.
- Genski kod: tripletni, $64$ kodonov, $61$ smiselnih, $3$ stop, AUG začetek; nedvoumen, izrojen, brez prekrivanja, skoraj univerzalen.
- Translacija: ribosom, tRNA z antikodonom, aminoacil-tRNA-sintetaze; mesta A, P, E; okoli $4$ energijsko bogate vezi na peptidno vez.
- Aminokislin je (kodirajoče nukleotide $\div 3$) $- 1$.

## Za izpit

Znati moraš povedati:

- definicijo gena, matrične in kodirajoče verige, kodona in bralnega okvira,
- potek transkripcije pri bakterijah in razlike pri evkariontih,
- tri korake obdelave pre-mRNA in pomen alternativnega izrezovanja,
- lastnosti genskega koda z utemeljitvijo, zakaj je tripletni in izrojen,
- potek translacije (iniciacija, elongacija z mesti A, P, E, terminacija) in razlike med bakterijami in evkarionti,
- vrste točkovnih mutacij in njihov učinek na beljakovino.

### Naloga 1

Evkariontski gen ima tri eksone: ekson 1 ima $210\,\mathrm{nt}$, od tega prvih $50$ v 5'-UTR; ekson 2 ima $145\,\mathrm{nt}$; v eksonu 3 je kodirajočih prvih $301\,\mathrm{nt}$ (vključno s stop kodonom), ostalo je 3'-UTR. (a) Koliko aminokislin ima beljakovina iz mRNA z vsemi tremi eksoni? (b) V nekem tkivu se ekson 2 izreže skupaj z introni. Utemelji, ali ostane okvir za ekson 3 enak. (c) Kaj bi se pri izpustu eksona 2 zgodilo, če bi imel ekson 2 namesto $145$ nukleotidov $144$, kodirajoči del eksona 3 pa $302$ (spet s stop kodonom na koncu)?

**Rešitev:**

1. (a) Kodirajoči del: $(210 - 50) + 145 + 301 = 606\,\mathrm{nt}$.
2. Kodonov je $\frac{606}{3} = 202$, aminokislin $201$.
3. (b) Brez eksona 2 manjka $145$ nukleotidov. Ker je $145 = 3 \cdot 48 + 1$, ostanek pri deljenju s $3$ ni nič.
4. Ekson 3 se zato bere v premaknjenem okviru: od stika eksonov 1 in 3 naprej so kodoni drugačni, prvotni stop kodon ni v okviru. Beljakovina ima enakih le prvih okoli $53$ aminokislin iz eksona 1 ($160 = 3 \cdot 53 + 1$), nato drugačno zaporedje do naključnega stop kodona.
5. (c) Celotna mRNA ima tedaj $160 + 144 + 302 = 606\,\mathrm{nt}$, spet $201$ aminokislin. Ker je $144 = 3 \cdot 48$, izpust eksona 2 okvir ohrani: ostane $160 + 302 = 462\,\mathrm{nt}$, torej $154$ kodonov in $153$ aminokisline, $48$ manj. Konec C je enak; spremeni se lahko le aminokislina na stiku eksonov 1 in 3 (kodon na stiku sestavljata en nukleotid eksona 1 in dva nukleotida eksona 3).
6. Odgovor: (a) $201$ aminokislin; (b) izpust eksona s $145\,\mathrm{nt}$ premakne okvir za ekson 3, ker $145$ ni deljivo s $3$; (c) pri $144\,\mathrm{nt}$ bi nastala krajša beljakovina z ohranjenim koncem C. Zato so eksoni, ki se alternativno izrezujejo, pogosto dolgi večkratnik $3$.

### Naloga 2

Opiši translacijo pri bakterijah od vezave ribosoma do sprostitve verige in navedi tri razlike pri evkariontih. Nato izračunaj, koliko energijsko bogatih fosfatnih vezi porabi celica za elongacijo in pripenjanje aminokislin pri beljakovini s $400$ aminokislinami.

**Rešitev:**

1. Iniciacija: mala podenota $30\mathrm{S}$ se z rRNA pari s Shine-Dalgarnovim zaporedjem; iniciatorska tRNA s formilmetioninom se pari z AUG na mestu P; pridruži se velika podenota $50\mathrm{S}$ (porabi se GTP).
2. Elongacija: aminoacil-tRNA z ustreznim antikodonom vstopi na mesto A; peptidil-transferaza (rRNA velike podenote) naredi peptidno vez in prenese verigo na tRNA na mestu A.
3. Translokacija: ribosom se pomakne za en kodon v smeri $3'$; tRNA z verigo je na P, prazna na E in odide; mesto A je prosto za naslednji kodon.
4. Terminacija: ko je na mestu A stop kodon, se veže sprostitveni dejavnik; veriga se hidrolitsko sprosti, podenoti razpadeta.
5. Razlike pri evkariontih: ribosom $80\mathrm{S}$; mala podenota se veže na kapo in skenira do AUG (ni Shine-Dalgarnovega zaporedja); prva aminokislina je metionin, ne formilmetionin; translacija je ločena od transkripcije (jedro, citoplazma).
6. Energija: vsako aminokislino pripne sintetaza z ATP do AMP, kar sta $2$ vezi: $400 \cdot 2 = 800$.
7. Elongacija: $399$ peptidnih vezi po $2$ GTP: $399 \cdot 2 = 798$.
8. Odgovor: skupaj okoli $800 + 798 = 1598$ energijsko bogatih vezi (iniciacija in terminacija dodata še nekaj). Sinteza beljakovin je zato eden največjih porabnikov energije v celici.

## Drugače: Uporaba v stroki

- **Bioinformatika.** Programi iščejo gene tako, da v vseh šestih bralnih okvirih (trije na vsaki verigi) iščejo dolge odprte bralne okvire od AUG do stop kodona. Naključno zaporedje ima stop kodon povprečno vsakih $\frac{64}{3} \approx 21$ kodonov, zato je okvir s stotinami kodonov brez stopa skoraj gotovo gen.
- **Biotehnologija.** Za proizvodnjo človeških beljakovin v bakterijah (npr. inzulina) uporabijo cDNA brez intronov, saj bakterije ne izrezujejo. Ker organizmi različno pogosto uporabljajo sinonimne kodone, zaporedje »optimizirajo« na kodone, ki jih gostitelj prevaja hitro.
- **Medicina.** Antibiotiki streptomicin, tetraciklin in kloramfenikol zavirajo bakterijski ribosom $70\mathrm{S}$, človeškega $80\mathrm{S}$ pa bistveno manj. Cepiva mRNA vsebujejo kapo, 5'-UTR, kodirajoče zaporedje, 3'-UTR in poli(A)-rep, kot naravna mRNA.
- **Merjenje izražanja.** Z RT-qPCR in sekvenciranjem RNA merijo, koliko mRNA posameznega gena je v tkivu; različne izoforme alternativnega izrezovanja ločijo po stikih eksonov.

## Drugače: Korak za korakom s številkami

Od gena do beljakovine iz Primera 2, števila po vrsti:

1. DNA gena: $12\,000\,\mathrm{bp}$.
2. Pre-mRNA: $12\,000\,\mathrm{nt}$ (prepiše se vse, tudi introni).
3. Po izrezovanju: $1500\,\mathrm{nt}$ (izreže se $10\,500\,\mathrm{nt}$).
4. Dodan poli(A)-rep: okoli $1700\,\mathrm{nt}$.
5. Prevedeni del: $1200\,\mathrm{nt} = 400$ kodonov.
6. Beljakovina: $399$ aminokislin, okoli $44\,\mathrm{kDa}$.
7. Energija: okoli $4 \cdot 399 \approx 1600$ energijsko bogatih vezi.

Zaporedje se na poti krajša (izjema je dodani rep, ki ne nosi zapisa za beljakovino), razen pri zadnjem koraku, kjer se zaporedje nukleotidov spremeni v zaporedje druge vrste gradnikov.

## Drugače: Bolj natančno

**Majavo parjenje (wobble).** Tretje mesto kodona se z antikodonom pari ohlapneje: G v antikodonu se pari z U ali C, inozin (I) z U, C ali A. Zato celica za $61$ kodonov potrebuje manj tRNA (bakterije nekaj več kot $40$).

**Izjeme genskega koda.** V mitohondrijih vretenčarjev UGA pomeni triptofan, AGA in AGG pa sta stop kodona. UGA lahko v posebnem okolju (zanka SECIS) določa selenocistein, »21. aminokislino«, UAG pri nekaterih arhejah pirolizin.

**Obdelava in kontrola kakovosti.** Na stikih eksonov ostanejo beljakovinski kompleksi; če ribosom naleti na stop kodon pred takim stikom, mRNA razgradi **nesmiselno posredovana razgradnja** (NMD). Tako se celica znebi mRNA s prezgodnjimi stop kodoni. Uravnavanje izražanja (operoni, transkripcijski dejavniki) je naslednja tema.

## Preveri se

? Raziskovalka v podatkovni zbirki najde zaporedje $5'$-ATGGCC…-$3'$, ki je enako zaporedju mRNA (s T namesto U). Katera veriga DNA je to?
- matrična veriga
~ Matrična veriga je komplementarna mRNA; mRNA bi bila $5'$-…GGCCAU-$3'$.
+ kodirajoča veriga
- antikodon
~ Antikodon je trojka na tRNA, ne veriga DNA.
- intron
~ Intron se iz mRNA izreže, zato zaporedja zrele mRNA ne vsebuje.
> Kodirajoča veriga ima enako zaporedje kot mRNA, le T namesto U; zato zbirke navadno navajajo prav njo.

? Razvrsti dogodke pri izražanju evkariontskega gena po časovnem zaporedju.
- translacija, izrezovanje intronov, transkripcija, izvoz iz jedra
~ Translacija je zadnja; v citoplazmi se ne izrezuje.
+ transkripcija in dodajanje kape, izrezovanje intronov in poliadenilacija, izvoz iz jedra, translacija
- transkripcija, translacija, izrezovanje intronov, izvoz iz jedra
~ Tako je pri bakterijah delno sočasno, pri evkariontih pa se mRNA obdela v jedru pred prevodom.
- izvoz iz jedra, transkripcija, izrezovanje intronov, translacija
~ DNA ne zapusti jedra; izvozi se zrela mRNA.
> Kapa se doda že med prepisom, nato se izrežejo introni in doda rep, zrela mRNA gre skozi jedrne pore, prevod pa poteka v citoplazmi.

? Kaj se zgodi, če se v kodirajočem zaporedju na sredini gena izbrišejo trije zaporedni nukleotidi, ki tvorijo en kodon?
- Okvir se premakne za vse nadaljnje kodone.
~ Premik povzroči izbris števila nukleotidov, ki ni deljivo s $3$.
+ Beljakovina izgubi eno aminokislino, ostalo zaporedje ostane enako.
- Nastane stop kodon, beljakovina se prekine.
~ Izbris celega kodona ohrani okvir; stop nastane le, če ga stik slučajno ustvari.
- Nič, ker je kod izrojen.
~ Izrojenost pomeni več kodonov za isto aminokislino, ne da kodon lahko manjka.
> Izbris $3$ nukleotidov odstrani en kodon in ohrani bralni okvir (tako je pri najpogostejši mutaciji pri cistični fibrozi, izbrisu fenilalanina 508).

? Zrela mRNA ima $2100$ nukleotidov; 5'-UTR je dolg $90$, 3'-UTR pa $510$ nukleotidov. Koliko aminokislin ima beljakovina?
- $700$
~ To je $\frac{2100}{3}$: všteti so UTR.
- $500$
~ To je število kodonov; stop kodon ne doda aminokisline.
+ $499$
- $1500$
~ To je število kodirajočih nukleotidov, ne aminokislin.
> Kodirajočih je $2100 - 90 - 510 = 1500$ nukleotidov, kar je $500$ kodonov, od tega en stop: $499$ aminokislin.

? Koliko različnih kodirajočih zaporedij (brez stop kodona) je za peptid Trp–Leu–Ser?
- $13$
~ To je vsota $1 + 6 + 6$; izbire se množijo, ne seštevajo.
+ $36$
- $3$
~ Upoštevan je le en kodon na aminokislino; levcin in serin imata po $6$ kodonov.
- $64$
~ $64$ je število vseh kodonov, ne zaporedij za ta peptid.
> Triptofan ima $1$ kodon, levcin in serin po $6$: $1 \cdot 6 \cdot 6 = 36$.

:::simboli
L_\mathrm{mRNA} | dolžina zrele mRNA brez poli(A)-repa | | nt
L_5 | dolžina 5'-UTR | | nt
L_3 | dolžina 3'-UTR | | nt
:::
