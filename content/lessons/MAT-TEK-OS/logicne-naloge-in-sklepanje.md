---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nekdo je pojedel zadnji piškot. Trije bratje rečejo vsak svoje, ti pa veš, da je natanko eden od njih lagal. Kdo je bil? Potrebuješ le urejeno sklepanje: kaj sledi iz česa in katera možnost se ne izide.

Na tekmovanjih, kot sta Kenguru in Vegovo, so take naloge skoraj vedno zraven. Naučil se boš treh orodij: **predpostavi in preveri**, **tabela vseh možnosti** in **mreža za izključevanje**.

## Razlaga

**1. Izjava.** **Izjava** je poved, ki je bodisi **resnična** bodisi **lažna**. »Ljubljana je glavno mesto Slovenije« je resnična izjava. »$7$ je sodo število« je lažna izjava. »Zapri okno!« ni izjava, ker ni ne resnična ne lažna.

**2. Zanikanje.** **Zanikanje** izjave je izjava, ki je resnična natanko takrat, ko je prvotna lažna. Pri besedah »vsi«, »oba« in »vsaj eden« se tu največ ljudi zmoti:

| Izjava | Njeno zanikanje |
|---|---|
| Oba sva oprodi. | Vsaj eden od naju je vitez. |
| Vsi so prišli. | Vsaj eden ni prišel. |
| Vsaj eden je lagal. | Nihče ni lagal. |
| Natanko eden je kriv. | Krivih je $0$ ali več kot eden. |

Zanikanje izjave »Oba sva oprodi« **ni** »Oba sva viteza«. Med njima je še možnost, da je en vitez in en oproda.

**3. Vitezi in oprode.** Na izmišljenem otoku živita dve vrsti ljudi. **Vitez** vedno govori resnico. **Oproda** vedno laže. Ključno pravilo: če je govorec vitez, je njegova izjava resnična; če je oproda, je njegova izjava lažna.
:::premisli
Ali lahko kdo na otoku reče »Jaz sem oproda«? Zakaj?
---
Ne more. Vitez bi s tem lagal, kar vitez ne počne. Oproda bi s tem povedal resnico. Kdor to reče, ni z otoka.
:::

Obratno pa izjavo »Jaz sem vitez« lahko reče vsak: vitez po resnici, oproda z lažjo. Taka izjava sama zase ne pove ničesar.

**4. Orodje 1: predpostavi in preveri.** Izberi eno osebo in predpostavi, da je vitez. Iz tega izpelji, kaj vse mora veljati. Če prideš do **protislovja** (nečesa, kar je hkrati res in ni res), je bila predpostavka napačna, torej je ta oseba oproda. Nato preveri še drugo možnost, ker tudi tam lahko pride do protislovja.

**5. Orodje 2: tabela vseh možnosti.** Vsaka oseba je vitez (V) ali oproda (O). Za dve osebi so možnosti štiri: VV, VO, OV, OO. Za vsako vrstico preveriš, ali se vse izjave ujemajo z vrsto govorcev. Recimo, da A reče: »Oba sva oprodi.«

| A | B | Je izjava »Oba sva oprodi« resnična? | Skladno? |
|---|---|---|---|
| V | V | ne | ✗ (vitez bi lagal) |
| V | O | ne | ✗ (vitez bi lagal) |
| O | V | ne | ✓ (oproda laže) |
| O | O | da | ✗ (oproda bi govoril resnico) |

Ostane ena vrstica: A je oproda, B je vitez. Tabela je počasna, a zanesljiva.

:::premisli
Koliko vrstic ima tabela za $3$ osebe in koliko za $4$? Kdaj se ti tabela še splača?
---
Vsaka nova oseba vsako vrstico razcepi na dve (V ali O), zato se število vrstic podvoji: $3$ osebe dajo $8$ vrstic, $4$ osebe $16$. Pri treh osebah je tabela še obvladljiva. Pri več osebah najprej sklepaj in tabelo uporabi le za možnosti, ki ostanejo.
:::

**6. Orodje 3: mreža in izključevanje.** Pri nalogah »kdo ima kaj« nariši mrežo: v vrstice osebe, v stolpce predmete. Vsak podatek prepiši v znak: ✗ pomeni »ne«, ✓ pomeni »da«. Ko v polje vpišeš ✓, v isti vrstici in istem stolpcu povsod vpiši ✗, ker ima vsak natanko en predmet in vsak predmet natanko enega lastnika. Če v vrstici ali stolpcu ostane eno samo prazno polje, vanj sodi ✓.

Pazi na **skrite podatke**: »Cene in lastnik psa hodita skupaj v šolo« pove, da Cene nima psa, saj ne hodi sam s sabo.

V **simulaciji spodaj** (»Vitezi in oprode«) izberi uganko 2 in klikaj osebi, da jima menjaš vrsto. Opazuj, pod katero izjavo se izpiše »✗ protislovje«. Nato vklopi tabelo vseh možnosti in preveri, da je skladna vrstica samo ena.

## Rešeni primeri

### Primer 1 (Kenguru, lažji)

Na otoku vitezov in oprod srečaš A in B. A reče: »Oba sva oprodi.« B molči. Kdo je kdo?

**Podatki:** osebi A in B; vitez vedno govori resnico, oproda vedno laže; A reče: »Oba sva oprodi.«
**Iščemo:** vrsto osebe A in vrsto osebe B

:::formula
Predpostavi in preveri: če je govorec vitez, je izjava resnična; če je oproda, je lažna.
:::

**Rešitev:**

1. Predpostavimo, da je A vitez. Potem je izjava resnična, torej je tudi A oproda. To je protislovje, zato A ni vitez.
2. A je torej oproda in njegova izjava je lažna.
3. Zanikanje izjave »Oba sva oprodi« je »Vsaj eden od naju je vitez«. Ker A ni vitez, je vitez B.
4. Odgovor: A je oproda, B je vitez.

### Primer 2 (mreža, srednji)

Ana, Bor in Cene imajo vsak eno žival: psa, mačko in papigo, vsak drugo. Velja:
(1) Lastnik mačke je Anin bratranec.
(2) Bor nima psa.
(3) Cene in lastnik psa vsak dan skupaj hodita v šolo.
(4) Lastnik papige je starejši od Ceneta.
Kdo ima katero žival?

**Podatki:** osebe Ana, Bor, Cene; živali pes, mačka, papiga; vsak ima natanko eno; namigi (1)–(4)
**Iščemo:** lastnika vsake živali

:::formula
Mreža oseba × žival; vsak namig prepiši v ✗ ali ✓; ko vpišeš ✓, zapolni vrstico in stolpec z ✗.
:::

**Rešitev:**

1. Iz (1): Ana ni svoj bratranec, zato nima mačke. Ana–mačka: ✗.
2. Iz (2): Bor–pes: ✗.
3. Iz (3): Cene ne hodi sam s sabo, zato nima psa. Cene–pes: ✗.
4. V stolpcu »pes« je ostalo le eno prazno polje, zato ima psa Ana. Ana–pes: ✓, Ana–papiga: ✗.
5. Iz (4): Cene ni starejši od samega sebe, zato nima papige. Cene–papiga: ✗, torej Cene–mačka: ✓.
6. Boru ostane papiga. Noben namig ni kršen.

| | pes | mačka | papiga |
|---|---|---|---|
| Ana | ✓ | ✗ | ✗ |
| Bor | ✗ | ✗ | ✓ |
| Cene | ✗ | ✓ | ✗ |

7. Odgovor: Ana ima psa, Bor papigo, Cene mačko.

### Primer 3 (natanko eden govori resnico, težji)

Eden od štirih otrok je razbil vazo. Jan reče: »Razbila jo je Kaja.« Kaja reče: »Razbila jo je Nina.« Luka reče: »Jaz je nisem razbil.« Nina reče: »Kaja laže.« Natanko ena od štirih izjav je resnična. Kdo je razbil vazo?

**Podatki:** štirje otroci, krivec je natanko eden; štiri izjave; resnična je natanko ena
**Iščemo:** krivca

:::formula
Poišči par izjav, od katerih je vedno resnična natanko ena; ostale izjave so potem vse lažne.
:::

**Rešitev:**

1. Nina pravi, da Kaja laže. Če je Kajina izjava resnična, je Ninina lažna; če je Kajina lažna, je Ninina resnična. Med njima je torej vedno **natanko ena** resnična izjava.
2. Resnična je le ena izjava, in ta je pri Kaji ali Nini. Zato sta Janova in Lukova izjava lažni.
3. Lukova izjava »Jaz je nisem razbil« je lažna, torej je vazo razbil Luka.
4. Preverimo: Jan (»Kaja«) laže, Kaja (»Nina«) laže, Luka laže, Nina (»Kaja laže«) govori resnico. Resnična je natanko ena izjava.
5. Kontrola s tabelo:

| Krivec | Resnične izjave | Število | Ustreza? |
|---|---|---|---|
| Jan | Luka, Nina | $2$ | ✗ |
| Kaja | Jan, Luka, Nina | $3$ | ✗ |
| Luka | Nina | $1$ | ✓ |
| Nina | Kaja, Luka | $2$ | ✗ |

6. Odgovor: vazo je razbil Luka.

### Primer 4 – zdaj ti

Srečaš A, B in C. A reče: »Med nami tremi je natanko en vitez.« B reče: »A je oproda.« C reče: »B in jaz sva iste vrste.« Kdo je kdo?

**Podatki:** osebe A, B, C; vitez vedno govori resnico, oproda vedno laže; tri izjave
**Iščemo:** vrsto vsake osebe

:::formula
Pri izjavi »X in jaz sva iste vrste« preveri obe možnosti za govorca.
:::

**Rešitev:**

1. Izjava C: če je C vitez, sta B in C iste vrste, torej je B vitez. Če je C oproda, je izjava lažna, torej sta B in C različna, in spet je B vitez. V obeh primerih je **B vitez**.
2. B govori resnico, zato je **A oproda**.
3. A laže, torej število vitezov **ni** $1$. Sklepaj naprej sam: kaj to pove o C?

:::premisli
Kakšen je C in kakšen je končni odgovor?
---
B je že gotovo vitez. Če bi bil C oproda, bi bil vitez natanko eden in A bi govoril resnico, kar ni mogoče. Torej je C vitez. Odgovor: A je oproda, B in C sta viteza. Preverba: vitezov sta $2$, zato A res laže; B pove resnico o A; C pove resnico, ker sta B in C oba viteza.
:::

## Pogoste napake

- **Napačno zanikanje »oba« ali »vsi«.** Učenec misli: »Oproda reče ›Oba sva oprodi‹, torej sva oba viteza.« Napačno, ker je zanikanje »vsaj eden je vitez«, kar dopušča tudi enega viteza in enega oprodo. Popravek: zanikanje »vsi so …« je »vsaj eden ni …«.
- **»Jaz sem vitez« naj bi dokazalo, da je govorec vitez.** To izjavo lahko reče tudi oproda, saj laže. Popravek: izjava, ki jo lahko izreče vsakdo, ne pove ničesar. Išči izjave o drugih osebah.
- **Ustaviš se pri prvi skladni možnosti.** Morda je rešitev več ali pa prva možnost krši izjavo, ki je nisi preveril. Popravek: preveri *vse* izjave in pokaži, da so ostale možnosti protislovne.
- **Zamenjava »natanko eden« in »vsaj eden«.** »Natanko eden laže« pomeni, da vsi drugi govorijo resnico; »vsaj eden« dovoli več lažnivcev. Popravek: te besede podčrtaj in zapiši v podatke.
- **Pozabljeni ✗ v mreži.** Učenec vpiše ✓, ne prečrta pa stolpca, in da isto žival dvema. Popravek: vsak ✓ takoj spremljajo ✗ v isti vrstici in stolpcu.

## Povzetek

- Izjava je resnična ali lažna. Vitez vedno govori resnico, oproda vedno laže.
- Zanikanje: »vsi/oba« → »vsaj eden ni«; »vsaj eden« → »nihče«.
- Izjave »Jaz sem oproda« ne more reči nihče; »Jaz sem vitez« ne pove ničesar.
- Predpostavi in preveri: protislovje ovrže predpostavko. Preveri obe možnosti.
- Tabela vseh možnosti: $n$ oseb da $2 \cdot 2 \cdots 2$ ($n$-krat) vrstic; za $3$ osebe $8$.
- Mreža »kdo ima kaj«: ✓ v polju pomeni ✗ v vrstici in stolpcu; pazi na skrite podatke.
- »Natanko eden govori resnico«: poišči par nasprotnih izjav.

## Drugače: Na sliki

Sklepanje si nariši kot **drevo**. Iz korena gresta dve veji: »A je vitez« in »A je oproda«. Na vsaki veji zapiši, kaj iz tega sledi. Veja, ki pripelje do protislovja, se odreže (prečrtaj jo z ✗).

```
            A?
          /    \
     A = V      A = O
       |          |
  »oba O« res   »oba O« laž
       |          |
  A = O ✗      B = V ✓
```

Ostane veja, ki ni odrezana. Pri treh osebah ima drevo $8$ listov, a veliko vej odrežeš že zgodaj.

## Drugače: Korak za korakom s številkami

1. **Podčrtaj** »natanko«, »vsaj«, »vsi«, »nihče«.
2. **Zapiši podatke** kratko: »Bor ≠ pes«.
3. **Izberi orodje:** vitezi in oprode → predpostavi in preveri; »kdo ima kaj« → mreža; do $8$ možnosti → tabela.
4. **Začni z najmočnejšo izjavo**, ki pove največ.
5. **Preveri rešitev** z vsemi izjavami.

## Drugače: Bolj natančno

Zanikanje »$p$ in $q$« je »ne $p$ ali ne $q$«; zanikanje »$p$ ali $q$« je »ne $p$ in ne $q$«. Zato oproda, ki reče »A in B sta viteza«, pove le, da vsaj eden od njiju **ni** vitez.

Uporaben trik: če kdo reče »X in jaz sva iste vrste«, je X gotovo vitez, ne glede na to, kdo govori. To smo pokazali v primeru 4.

## Preveri se

? Kaj velja za oprodo na otoku vitezov in oprod?
- Včasih laže, včasih govori resnico.
~ To bi bil »navaden človek«. Oproda laže *vedno*, zato iz njegovih izjav lahko sklepamo.
+ Vsaka njegova izjava je lažna.
- Laže samo, kadar govori o sebi.
~ Oproda laže o vsem, tudi o drugih osebah in o svetu.
> Oproda vedno laže, zato je vsaka njegova izjava lažna, vitez pa vedno govori resnico.

? Katera izjava je zanikanje izjave »Vsi učenci so prišli«?
- »Noben učenec ni prišel.«
~ To je preveč. Da izjava »vsi so prišli« ne velja, zadošča, da manjka en sam učenec.
- »Vsaj en učenec je prišel.«
~ To ni nasprotje: ta izjava je lahko resnična hkrati z izjavo »vsi so prišli«.
+ »Vsaj en učenec ni prišel.«
> Izjava »vsi so prišli« je lažna natanko takrat, ko vsaj eden manjka.

? Oseba z otoka reče: »Jaz sem vitez.« Kaj lahko sklepaš?
- Je vitez.
~ Tudi oproda bi to rekel, ker bi lagal. Izjava tega ne dokaže.
- Je oproda.
~ Vitez lahko to reče po resnici, zato ni nujno oproda.
+ Iz te izjave ne moremo sklepati ničesar.
> Vitez to reče po resnici, oproda z lažjo. Izjavo lahko izreče vsakdo, zato ne izključi nobene možnosti.

? A reče: »B je oproda.« B reče: »A in jaz sva iste vrste.« Kdo je kdo?
- Oba sta viteza.
~ Če bi bil A vitez, bi bil B res oproda, ne vitez. Preveri vsako izjavo posebej.
+ A je vitez, B je oproda.
- A je oproda, B je vitez.
~ Potem bi B govoril resnico, torej bi bila iste vrste. A sta različna: protislovje.
> Če je A vitez, je B oproda in B laže, ko pravi, da sta iste vrste. Vse se ujema. Če je A oproda, je B vitez, a potem bi bila iste vrste, kar ni res.

? Eden od bratov Jure, Miha in Tine je pojedel torto. Jure: »Nisem jaz.« Miha: »Bil je Jure.« Tine: »Bil je Miha.« Natanko eden laže. Kdo je pojedel torto?
- Jure
~ Potem bi lagala Jure in Tine, torej dva, ne natanko eden.
+ Miha
- Tine
~ Potem bi lagala Miha in Tine. »Natanko eden« pomeni, da drugi govorijo resnico.
> Če je bil Miha: Jure pove resnico, Miha laže, Tine pove resnico. Laže natanko eden. Pri drugih dveh krivcih bi lagala dva.

:::simboli
n | število oseb v nalogi | | | tabela vseh možnosti ima $2^n$ vrstic
p, q | izjavi | | | vsaka je resnična ali lažna
:::
