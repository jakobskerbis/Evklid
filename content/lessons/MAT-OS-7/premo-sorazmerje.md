---
stanje: osnutek
demo: linearna
avtor: AI
---

## Zakaj se tega učimo

Prvi prizor: na planinskem zemljevidu piše, da $1\,\text{cm}$ pomeni $2\,\text{km}$ v naravi. Pot do koče je na zemljevidu dolga $3\,\text{cm}$, torej $6\,\text{km}$. Pot do jezera je dolga $6\,\text{cm}$, torej $12\,\text{km}$.

Drugi prizor: na bencinski črpalki stane liter goriva $1{,}60\,\text{€}$. Za $20$ litrov plačaš $32\,\text{€}$, za $40$ litrov pa $64\,\text{€}$.

Prizora sta si na videz daleč narazen: eden govori o centimetrih in kilometrih, drugi o litrih in evrih. A v obeh velja isto pravilo. Kolikokrat daljša je črta na zemljevidu, tolikokrat daljša je pot. Kolikokrat več litrov natočiš, tolikokrat več plačaš. Takšni zvezi rečemo **premo sorazmerje**.

Ko jo prepoznaš, iz enega znanega para izračunaš vse druge: razdaljo do vsakega kraja, ceno vsakega tankanja, čas vsake vožnje. Za to imaš tri orodja: **tabelo**, **graf** in **sklepni račun**.

## Razlaga

**Najprej past.** Veliko učencev misli: »Če ena količina raste, ko raste druga, sta premo sorazmerni.« Poglej taksi. Vožnja stane $3\,\text{€}$ ob vstopu in še $1\,\text{€}$ za vsak kilometer. Za $5\,\text{km}$ plačaš $8\,\text{€}$, za $10\,\text{km}$ pa $13\,\text{€}$. Cena raste s potjo, toda pot se je podvojila, cena pa ne. To ni premo sorazmerje.

:::premisli
Avtobus ima vozovnico za $1{,}50\,\text{€}$ na postajo, brez vstopnine. Napovej: ali za $10$ postaj plačaš dvakrat toliko kot za $5$? V čem se razlikuje od taksija?
---
Da: $5$ postaj stane $7{,}50\,\text{€}$; $10$ postaj $15\,\text{€}$. Pri avtobusu ni začetnega zneska, zato $0$ postaj stane $0\,\text{€}$ in cena se res podvoji. Pri taksiju podvojitev prepreči vstopnina $3\,\text{€}$.
:::

**Pravilo.** Dve količini sta **premo sorazmerni**, če velja: kolikokrat povečamo (ali zmanjšamo) eno, tolikokrat se poveča (ali zmanjša) druga. Rast sama ni dovolj. Rasti morata v istem razmerju.

**Tabela.** Pare vrednosti zapišemo v tabelo. Za zemljevid, kjer $1\,\text{cm}$ pomeni $2\,\text{km}$:

| na zemljevidu $x$ (cm) | $1$ | $2$ | $3$ |
|---|---|---|---|
| v naravi $y$ (km) | $2$ | $4$ | $6$ |

V vsakem stolpcu delimo spodnje število z zgornjim: $2 : 1 = 2$, $4 : 2 = 2$, $6 : 3 = 2$. Količnik je vedno enak. To je vrednost razmerja $y : x$, ki jo že poznaš. Pri premem sorazmerju jo imenujemo **koeficient sorazmernosti** in označimo s $k$. Pove, koliko je $y$, ko je $x = 1$. Velja zveza $y = k \cdot x$.

Test za vsako tabelo: izračunaj $y : x$ v vseh stolpcih. Če so vsi količniki enaki, je zveza premo sorazmerna.

**Graf.** Vsak stolpec tabele je ena točka v koordinatnem sistemu: na vodoravni osi $x$, na navpični $y$. Točke $(1, 2)$, $(2, 4)$, $(3, 6)$ ležijo na isti premici. Z ravnilom jo podaljšaj navzdol in zadela bo točko $(0, 0)$, **izhodišče**.

:::premisli
Zakaj mora graf vsakega premega sorazmerja iti skozi izhodišče? Odgovori na primeru zemljevida.
---
Črta dolžine $0\,\text{cm}$ na zemljevidu pomeni $0\,\text{km}$ v naravi. Na splošno: iz $y = k \cdot x$ pri $x = 0$ dobimo $y = 0$. Taksijev graf zato ne gre skozi izhodišče, ker že pri $0\,\text{km}$ plačaš $3\,\text{€}$.
:::

Večji kot je $k$, strmejša je premica. Na zemljevidu, kjer $1\,\text{cm}$ pomeni $5\,\text{km}$, se premica dviga hitreje kot pri $2\,\text{km}$.

V simulaciji spodaj »Premo sorazmerje« premakni drsnik za kilograme s $2$ na $4$. Opazuj, da se cena podvoji in da točka ostane na isti premici skozi izhodišče. Nato spremeni ceno za $1\,\text{kg}$ in poglej, kako se premica nagne.

**Sklepni račun.** Ko poznaš en par, gre račun v dveh korakih:

1. **Sklep na enoto:** delimo, da dobimo vrednost za $1$ (za $1\,\text{cm}$, $1$ liter, $1$ uro).
2. **Sklep na želeno število:** to vrednost pomnožimo z želenim številom enot.

Vrednost za $1$ enoto je natanko koeficient $k$. Sklepni račun je torej isto kot $y = k \cdot x$, le povedano z besedami.

## Rešeni primeri

### Primer 1 (lažji): tabela z zemljevida

Lana izmeri na zemljevidu tri razdalje in zapiše, koliko so dolge v naravi: $2\,\text{cm}$ je $5\,\text{km}$, $4\,\text{cm}$ je $10\,\text{km}$, $6\,\text{cm}$ je $15\,\text{km}$. Ali sta količini premo sorazmerni? Koliko kilometrov pomeni $10\,\text{cm}$?

**Podatki:** $2\,\text{cm} \to 5\,\text{km}$, $4\,\text{cm} \to 10\,\text{km}$, $6\,\text{cm} \to 15\,\text{km}$; nova razdalja $x = 10\,\text{cm}$
**Iščemo:** ali je zveza premo sorazmerna, koeficient $k$ in razdaljo $y$ za $10\,\text{cm}$

:::formula
Premo sorazmerje: $\dfrac{y}{x} = k$ je v vseh stolpcih enak, $y = k \cdot x$
:::

**Rešitev:**

1. Količniki: $5 : 2 = 2{,}5$; $10 : 4 = 2{,}5$; $15 : 6 = 2{,}5$.
2. Vsi so enaki, zato je zveza premo sorazmerna in $k = 2{,}5$: $1\,\text{cm}$ pomeni $2{,}5\,\text{km}$.
3. Za $10\,\text{cm}$: $2{,}5 \cdot 10 = 25$.

Količini sta premo sorazmerni; $10\,\text{cm}$ na zemljevidu pomeni $25\,\text{km}$ v naravi.

### Primer 2: gorivo za daljšo pot

Družina se pelje na morje. Avto na prvih $300\,\text{km}$ porabi $21$ litrov goriva. Do cilja je skupaj $500\,\text{km}$. Koliko litrov porabi na vsej poti, če vozi enakomerno?

**Podatki:** $300\,\text{km} \to 21\,\text{l}$; vsa pot $500\,\text{km}$; poraba je enakomerna
**Iščemo:** porabo goriva za $500\,\text{km}$

:::formula
Sklepni račun: vrednost za $1\,\text{km}$ $=$ poraba $:$ pot, nato pomnožimo z novo potjo.
:::

**Rešitev:**

1. Sklep na enoto: na $1\,\text{km}$ avto porabi $21 : 300 = 0{,}07$ litra.
2. Sklep na želeno število: na $500\,\text{km}$ porabi $0{,}07 \cdot 500 = 35$ litrov.
3. Smiselnost: pot je daljša od $300\,\text{km}$, zato mora biti tudi poraba večja od $21\,\text{l}$. Tako je.

Na vsej poti avto porabi $35$ litrov goriva.

### Primer 3 (težji): od zemljevida do ure prihoda

Na zemljevidu Lana prebere, da $6\,\text{cm}$ pomeni $15\,\text{km}$. Pohodna pot do koče je na zemljevidu dolga $8{,}4\,\text{cm}$. Lana prehodi $4\,\text{km}$ v eni uri. Koliko časa bo hodila?

**Podatki:** $6\,\text{cm} \to 15\,\text{km}$; pot na zemljevidu $8{,}4\,\text{cm}$; hitrost hoje $4\,\text{km}$ na uro
**Iščemo:** čas hoje

:::formula
Dve premi sorazmerji zapored: najprej razdalja v naravi $y = k \cdot x$, nato čas $=$ pot $:$ pot v eni uri.
:::

**Rešitev:**

1. Koeficient zemljevida: $15 : 6 = 2{,}5$, torej $1\,\text{cm}$ pomeni $2{,}5\,\text{km}$.
2. Pot v naravi: $8{,}4 \cdot 2{,}5 = 21$, torej $21\,\text{km}$.
3. Pri hoji sta čas in pot premo sorazmerna. V $1$ uri Lana prehodi $4\,\text{km}$, za $21\,\text{km}$ potrebuje $21 : 4 = 5{,}25$ ure.
4. Ostanek $0{,}25$ ure pretvorimo v minute: $0{,}25 \cdot 60 = 15$.

Lana bo hodila $5$ ur in $15$ minut.

### Primer 4: zdaj ti

Graf porabe goriva nekega avtomobila je premica skozi izhodišče in točko $(150, 9)$: na $150\,\text{km}$ avto porabi $9$ litrov. Koliko litrov porabi na $350\,\text{km}$?

**Podatki:** premica skozi $(0, 0)$ in $(150, 9)$; $x$ je pot v km, $y$ poraba v litrih; nova pot $350\,\text{km}$
**Iščemo:** porabo $y$ za $350\,\text{km}$

:::formula
$k = \dfrac{y}{x}$, nato $y = k \cdot x$
:::

**Rešitev:**

1. Graf je premica skozi izhodišče, zato gre za premo sorazmerje.
2. Koeficient: $9 : 150 = 0{,}06$ litra na kilometer.
3. Izračunaj sam še porabo za $350\,\text{km}$.

:::premisli
Koliko litrov avto porabi na $350\,\text{km}$?
---
$0{,}06 \cdot 350 = 21$, torej $21$ litrov. Preizkus: $21 : 350 = 0{,}06$, količnik je enak kot pri točki $(150, 9)$.
:::

## Pogoste napake

- **Vsaka rast je premo sorazmerje.** Taksi z vstopnino, starost in višina otroka: obe količini rasteta, a ne v istem razmerju. Preveri, ali je $y : x$ v vseh parih enak.
- **Prištevanje namesto množenja.** »$2\,\text{cm}$ je $5\,\text{km}$, torej je $4\,\text{cm}$ $7\,\text{km}$, ker sem prištel $2$.« Pri premem sorazmerju se količini **množita** z istim številom: $2\,\text{cm}$ krat $2$ je $4\,\text{cm}$, zato $5\,\text{km}$ krat $2$ je $10\,\text{km}$.
- **Deljenje v napačno smer.** Pri sklepu na enoto učenec izračuna $300 : 21$ namesto $21 : 300$. Vprašaj se, kaj iščeš: litre na $1$ kilometer, zato litre deliš s kilometri.
- **Graf, ki zgreši izhodišče.** Učenec nariše premico skozi točke, a ne preveri, ali gre skozi $(0, 0)$. Premica, ki ne gre skozi izhodišče, ne prikazuje premega sorazmerja.
- **Zamenjava s »stalno porabo«.** Pri krajši poti je poraba na $1\,\text{km}$ ($k$) enaka, skupna poraba pa manjša. Ločuj koeficient $k$ od vrednosti $y$.

## Povzetek

- Količini sta premo sorazmerni, če se ob povečanju (zmanjšanju) ene za nekajkrat druga poveča (zmanjša) za enakokrat.
- Količnik $y : x$ je stalen; to je koeficient sorazmernosti $k$, zveza je $y = k \cdot x$. $k$ je vrednost za $1$ enoto.
- Tabela: v vsakem stolpcu izračunaj $y : x$; vsi količniki morajo biti enaki.
- Graf: točke ležijo na premici skozi izhodišče $(0, 0)$; večji $k$ pomeni strmejšo premico.
- Sklepni račun: najprej sklep na enoto (deljenje), nato na želeno število enot (množenje); preveri smiselnost.
- Rast ni dovolj: taksi z vstopnino ni premo sorazmerje.

## Drugače: Kot zgodba

Dedek in Lana sta pred izletom razgrnila zemljevid. V kotu je pisalo: $2\,\text{cm}$ na zemljevidu je $1\,\text{km}$ v naravi.

»Do slapa je $9\,\text{cm}$,« je rekla Lana. »Je to $9\,\text{km}$?« Dedek je odkimal. »Vsaka $2\,\text{cm}$ sta en kilometer. Koliko kilometrov je potem en sam centimeter?« Lana je razmislila: pol kilometra. »Torej je $9\,\text{cm}$ devetkrat po pol kilometra, $4{,}5\,\text{km}$.«

»In koliko časa bova hodila?« je vprašal dedek. »Midva prehodiva $3\,\text{km}$ na uro.« Lana je spet šla prek ene enote: v $1$ uri $3\,\text{km}$, za $4{,}5\,\text{km}$ torej poldrugo uro, ker je $4{,}5 : 3 = 1{,}5$.

Ob slapu je dedek pokazal še nekaj. »Če bi pot narisali dvakrat daljšo, bi bila dvakrat daljša tudi hoja. Če bi narisali nič centimetrov, bi hodila nič minut.« Lana je to dopolnila: »Zato bi bil graf premica, ki se začne v izhodišču.«

## Drugače: Korak za korakom s številkami

Naloga: $5$ avtobusnih vozovnic stane $7{,}50\,\text{€}$. Koliko stane $8$ vozovnic?

**Pot 1: sklepni račun.**

1. $5$ vozovnic stane $7{,}50\,\text{€}$.
2. $1$ vozovnica stane $7{,}50 : 5 = 1{,}50$, torej $1{,}50\,\text{€}$ (deljenje: od več proti eni).
3. $8$ vozovnic stane $1{,}50 \cdot 8 = 12$, torej $12\,\text{€}$ (množenje: od ene proti več).

**Pot 2: tabela s koeficientom.**

| vozovnice $x$ | $1$ | $5$ | $8$ |
|---|---|---|---|
| cena $y$ (€) | $1{,}50$ | $7{,}50$ | ? |

1. $k = 7{,}50 : 5 = 1{,}50$.
2. $y = 1{,}50 \cdot x$.
3. Za $x = 8$: $y = 1{,}50 \cdot 8 = 12$.

Obe poti dasta $12\,\text{€}$. Preizkus smiselnosti: $8$ je več kot $5$, zato mora biti cena večja od $7{,}50\,\text{€}$.

## Preveri se

? Pri vožnji s stalno hitrostjo sta čas in prevožena pot premo sorazmerna. Kaj to pomeni?
- Le to, da pot narašča, ko narašča čas.
~ To velja tudi za taksi z vstopnino, ki ni premo sorazmerje. Pomembno je, da rasteta v istem razmerju.
+ Kolikokrat daljši je čas vožnje, tolikokrat daljša je pot.
- Ko se čas podvoji, se pot razpolovi.
~ Tako se obnašata količini v obratnem sorazmerju. Pri premem sorazmerju se pot podvoji.
- Vsako uro se pot podaljša, začne pa se pri $10\,\text{km}$.
~ Če se pot ne začne pri $0$, graf ne gre skozi izhodišče in zveza ni premo sorazmerna.
> Premo sorazmerje: kolikokrat se poveča ena količina, tolikokrat se poveča druga. V $2$-krat daljšem času prevoziš $2$-krat daljšo pot.

? Na zemljevidu A pomeni $1\,\text{cm}$ v naravi $2\,\text{km}$, na B $5\,\text{km}$, na C $0{,}5\,\text{km}$. Za vsakega narišemo graf (razdalja v naravi glede na razdaljo na zemljevidu). Uredi premice od najbolj strme do najbolj položne.
- C, A, B
~ Vrstni red si obrnil. Večji koeficient pomeni, da $y$ hitreje raste, zato je premica bolj strma.
+ B, A, C
- A, B, C
~ To je le vrstni red, v katerem so zemljevidi našteti. Primerjaj koeficiente $5$, $2$ in $0{,}5$.
> Strmina je odvisna od $k$: B ($k = 5$) je najbolj strma, nato A ($k = 2$), najbolj položna je C ($k = 0{,}5$).

? Avto na $300\,\text{km}$ porabi $18$ litrov goriva. Kaj se zgodi, če pot skrajšamo na tretjino in vozi enako?
- Porabi $3$ litre manj, torej $15$ litrov.
~ Tretjina pomeni deljenje s $3$, ne odštevanje $3$. Pri premem sorazmerju se količini množita ali delita z istim številom.
+ Porabi tretjino goriva, torej $6$ litrov.
- Porabi trikrat več, torej $54$ litrov.
~ Krajša pot ne more porabiti več goriva. Ko se pot zmanjša, se zmanjša tudi poraba.
- Porabi še vedno $18$ litrov, ker je avto isti.
~ Isti ostane koeficient (litri na $1\,\text{km}$), ne skupna poraba. Na krajši poti avto porabi manj.
> Pot se zmanjša na tretjino, zato se tudi poraba: $18 : 3 = 6$ litrov.

? Na zemljevidu $4\,\text{cm}$ pomeni $10\,\text{km}$. Koliko kilometrov pomeni $7\,\text{cm}$?
- $13\,\text{km}$
~ Prištel si $3$, ker je $7$ za $3$ več kot $4$. Pri premem sorazmerju množimo, ne prištevamo.
- $28\,\text{km}$
~ To je $7 \cdot 4$. Najprej izračunaj, koliko kilometrov pomeni $1\,\text{cm}$.
+ $17{,}5\,\text{km}$
- $2{,}8\,\text{km}$
~ Deljenje si obrnil in dobil $0{,}4$ namesto $2{,}5$. Večja razdalja na zemljevidu pomeni večjo razdaljo v naravi.
> $1\,\text{cm}$ pomeni $10 : 4 = 2{,}5\,\text{km}$, zato $7\,\text{cm}$ pomeni $7 \cdot 2{,}5 = 17{,}5\,\text{km}$.

? Vlak s stalno hitrostjo v $3$ urah prevozi $240\,\text{km}$. Koliko časa potrebuje za $400\,\text{km}$?
- $1{,}8\,\text{h}$
~ Računal si, kot da daljša pot traja manj časa (obratno sorazmerje). Za daljšo pot vlak potrebuje več časa.
- $4\,\text{h}$
~ Za $160\,\text{km}$ več si prištel eno uro. V $1$ uri vlak prevozi $80\,\text{km}$, zato $160\,\text{km}$ traja $2$ uri.
+ $5\,\text{h}$
> V $1$ uri vlak prevozi $240 : 3 = 80\,\text{km}$. Za $400\,\text{km}$ potrebuje $400 : 80 = 5$ ur.

:::simboli
x | prva količina, na primer razdalja na zemljevidu | |
y | druga količina, na primer razdalja v naravi | y = k \cdot x |
k | koeficient sorazmernosti | k = \dfrac{y}{x} | | koliko je y, ko je x = 1
:::
