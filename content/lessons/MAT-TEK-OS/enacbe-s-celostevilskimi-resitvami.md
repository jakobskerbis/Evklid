---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve zgodbi z izleta:

- Ana na počitnicah kupuje vozovnice: za mestni avtobus po $3$ €, za vlak po $5$ €. Skupaj porabi natanko $31$ €. Koliko vozovnic vsake vrste je kupila?
- Miha na zemljevidu pohodniških poti sestavlja krožno pot. Odseki med kočami merijo $3\,\mathrm{km}$ ali $5\,\mathrm{km}$, on pa želi prehoditi natanko $31\,\mathrm{km}$. Koliko odsekov katere dolžine naj izbere?

Zgodbi sta različni, račun je isti: iščemo števili $x$ in $y$, za kateri velja $3x + 5y = 31$. Ena enačba z dvema neznankama ima običajno neskončno mnogo rešitev. Tukaj pa ne moremo kupiti $2{,}5$ vozovnice ali prehoditi $-1$ odseka. Prav ta omejitev, da so rešitve **cela števila**, iz nedoločene naloge naredi rešljivo uganko. Takih nalog je na tekmovanjih veliko, in vse se lotiš z istima orodjema: **omejevanjem** in **preizkušanjem**.

## Razlaga

**Najprej do konca rešimo Anino nalogo.** Naj bo $x$ število avtobusnih in $y$ število vlakovnih vozovnic. Obe števili sta cela in nenegativna.

Vlakovnih vozovnic Ana ne more kupiti veliko: že same stanejo $5y$ €, to pa ne sme preseči $31$, torej je $y$ največ $6$. Za vsak $y$ od $0$ do $6$ izračunamo, koliko denarja ostane za avtobus, in preverimo, ali je to večkratnik $3$:

| $y$ | ostane $31 - 5y$ | deljivo s $3$? | $x$ |
|---|---|---|---|
| $0$ | $31$ | ne | – |
| $1$ | $26$ | ne | – |
| $2$ | $21$ | da | $7$ |
| $3$ | $16$ | ne | – |
| $4$ | $11$ | ne | – |
| $5$ | $6$ | da | $2$ |
| $6$ | $1$ | ne | – |

Rešitvi sta dve: $7$ avtobusnih in $2$ vlakovni vozovnici ali $2$ avtobusni in $5$ vlakovnih. Obe preverimo: $21 + 10 = 31$ in $6 + 25 = 31$.

**Zdaj posplošimo, kaj smo naredili.** Enačbi, pri kateri iščemo le celoštevilske rešitve, rečemo **diofantska enačba** (po grškem matematiku Diofantu). Postopek ima tri korake.

*Omejevanje.* Neznanke so nenegativne, zato vsak člen leve strani ne sme preseči desne. Iz $5y \le 31$ sledi $y \le 6$. Tako iz neskončno mnogo možnosti nastane končen seznam.

*Preizkušanje.* Seznam pregledaš po vrsti. Izberi neznanko z **večjim koeficientom**, ker ima manj možnosti: za $y$ jih je $7$, za $x$ bi jih bilo $11$ (od $0$ do $10$).

*Krajšanje z ostanki.* Iz tabele vidiš, da je $31 - 5y$ deljivo s $3$ le pri vsakem tretjem $y$. To ni naključje: ostanki pri deljenju s $3$ se pri večanju $y$ ponavljajo v krogu dolžine $3$. Ko najdeš prvo rešitev, naslednjo dobiš brez preizkušanja.

:::premisli
Primerjaj rešitvi $(7, 2)$ in $(2, 5)$: za koliko se spremeni $x$ in za koliko $y$? Zakaj se pri tem znesek ne spremeni in ali obstaja še tretja rešitev?
---
$5 \cdot 3 = 15$ in $3 \cdot 5 = 15$: oba paketa staneta $15$ €. Iz rešitve $(7, 2)$ odvzameš $5$ avtobusnih in dodaš $3$ vlakovne, pa dobiš $(2, 5)$. Še en tak korak bi dal $x = -3$, kar ni dovoljeno, zato drugih rešitev ni.
:::

**Kdaj rešitve sploh ni.** Vzemimo $6x + 9y = 31$. Oba člena leve strani sta deljiva s $3$, zato je deljiva s $3$ tudi vsota. Število $31$ pa ni deljivo s $3$. Enačba nima nobene celoštevilske rešitve, niti negativne, in preizkušati sploh ni treba. Pri vsaki nalogi se zato najprej vprašaj: ali imata koeficienta skupni delitelj, ki ne deli desne strani?

V simulaciji spodaj »Celoštevilske rešitve enačbe ax + by = c« nastavi $a = 6$ in $b = 9$, nato počasi spreminjaj $c$. Opazuj, pri katerih $c$ se na premici pojavijo celoštevilske točke in kaj imajo ta števila skupnega.

:::premisli
Ali ima $6x + 9y = 30$ kakšno nenegativno celoštevilsko rešitev? Napovej, preden računaš.
---
Ima. Zdaj $3$ deli tudi $30$, zato enačbo smemo deliti s $3$: $2x + 3y = 10$. Rešitvi sta $x = 5$, $y = 0$ in $x = 2$, $y = 2$.
:::

## Rešeni primeri

### Primer 1 (lažji): čolni na otok

Turistična skupina s $23$ ljudmi se pelje na otok s čolni. Na voljo so čolni s $4$ sedeži in čolni s $3$ sedeži. Vsi najeti čolni morajo biti polni. Na koliko načinov lahko izberejo čolne?

**Podatki:** $23$ ljudi; čoln s $4$ sedeži (štirised); čoln s $3$ sedeži (trised); vsi sedeži zasedeni
**Iščemo:** vse možne pare (število štirisedov $x$, število trisedov $y$)

:::formula
$4x + 3y = 23$, $x, y$ cela in nenegativna
:::

**Rešitev:**

1. Omejimo: $4x \le 23$, zato je $x$ največ $5$. Preizkusimo $x = 0, 1, \dots, 5$.
2. Ostane $23 - 4x$ ljudi za trisede: $23, 19, 15, 11, 7, 3$.
3. Deljivi s $3$ sta le $15$ (pri $x = 2$) in $3$ (pri $x = 5$). Torej $y = 5$ oziroma $y = 1$.
4. Preverimo: $8 + 15 = 23$ in $20 + 3 = 23$.
5. Odgovor: na dva načina, $2$ štiriseda in $5$ trisedov ali $5$ štirisedov in $1$ trised.

### Primer 2: vozovnice za vzpenjačo

Skupina izletnikov je za vzpenjačo plačala $65$ €. Vozovnica za odraslega stane $7$ €, za otroka $4$ €. Otrok je bilo več kot odraslih. Koliko je bilo odraslih in koliko otrok?

**Podatki:** odrasli $7$ €, otrok $4$ €; skupaj $65$ €; otrok je več kot odraslih
**Iščemo:** število odraslih $x$ in otrok $y$

:::formula
$7x + 4y = 65$; $65 - 7x$ mora biti deljivo s $4$
:::

**Rešitev:**

1. Omejimo: $7x \le 65$, zato je $x$ največ $9$.
2. Namesto desetih preizkusov uporabimo ostanke pri deljenju s $4$. Ker mora biti $65 - 7x$ deljivo s $4$, morata $65$ in $7x$ dati enak ostanek. Število $65$ da ostanek $1$, $7x = 4x + 3x$ pa enak ostanek kot $3x$.
3. Potrebujemo $3x$ z ostankom $1$ pri $4$: $3 \cdot 1 = 3$, $3 \cdot 2 = 6$ (ostanek $2$), $3 \cdot 3 = 9$ (ostanek $1$). Ustreza $x = 3$, nato vsak četrti: $x = 3$ ali $x = 7$.
4. Pri $x = 3$: $4y = 65 - 21 = 44$, $y = 11$. Pri $x = 7$: $4y = 65 - 49 = 16$, $y = 4$.
5. Pogoj »več otrok kot odraslih« izpolni le prva rešitev: $11 > 3$, medtem ko je $4 < 7$.
6. Odgovor: $3$ odrasli in $11$ otrok.

### Primer 3 (težji): park na zemljevidu

Na zemljevidu v mreži kvadratkov je park pravokotnik s stranicama $x$ in $y$ kvadratkov (cela števila). Število kvadratkov v parku je enako številu stranic kvadratkov na njegovem robu. Kakšne so lahko mere parka?

**Podatki:** pravokotnik $x \times y$ kvadratkov; $x, y$ naravni števili; število kvadratkov $=$ število enotskih stranic na robu
**Iščemo:** vse pare $x$, $y$

:::formula
Kvadratkov je $x \cdot y$, stranic na robu $2x + 2y$; enačba $xy = 2x + 2y$
:::

**Rešitev:**

1. Pravokotnik $x \times y$ je enak $y \times x$, zato smemo vzeti $x \le y$.
2. Omejimo: ker je $x \le y$, je $2x + 2y \le 4y$. Torej $xy \le 4y$ in po deljenju z $y$: $x \le 4$.
3. Preizkusimo $x = 1, 2, 3, 4$ v $xy = 2x + 2y$.
4. $x = 1$: $y = 2 + 2y$, kar da $y = -2$, ni dovoljeno. $x = 2$: $2y = 4 + 2y$, kar da $0 = 4$, nemogoče.
5. $x = 3$: $3y = 6 + 2y$, torej $y = 6$. Preverimo: $3 \cdot 6 = 18$ in $6 + 12 = 18$.
6. $x = 4$: $4y = 8 + 2y$, torej $y = 4$. Preverimo: $4 \cdot 4 = 16$ in $8 + 8 = 16$.
7. Odgovor: park meri $3 \times 6$ ali $4 \times 4$ kvadratkov.

### Primer 4 – zdaj ti: kolesarska tura

Kolesarska tura po Sloveniji meri $500\,\mathrm{km}$. Sestavljena je iz kratkih etap po $40\,\mathrm{km}$ in dolgih po $55\,\mathrm{km}$. Koliko je kratkih in koliko dolgih etap?

**Podatki:** kratka etapa $40\,\mathrm{km}$; dolga etapa $55\,\mathrm{km}$; skupaj $500\,\mathrm{km}$
**Iščemo:** število kratkih $x$ in dolgih etap $y$

:::formula
$40x + 55y = 500$, po deljenju s $5$: $8x + 11y = 100$
:::

**Rešitev:**

1. Vsa tri števila so deljiva s $5$, zato enačbo delimo: $8x + 11y = 100$.
2. Omejimo: $11y \le 100$, torej je $y$ največ $9$.
3. Parnost: $8x$ in $100$ sta soda, zato mora biti sod tudi $11y$, torej $y$. Ostanejo $y = 0, 2, 4, 6, 8$.
4. Preizkusi sam: pri katerem sodem $y$ je $100 - 11y$ deljivo z $8$?

:::premisli
Kateri $y$ ustreza in koliko etap je vsake vrste?
---
Vrednosti $100 - 11y$ so $100, 78, 56, 34, 12$. Z $8$ je deljivo le $56$ pri $y = 4$, torej $x = 7$. Tura ima $7$ kratkih in $4$ dolge etape: $280 + 220 = 500$.
:::

## Pogoste napake

- **Necela ali negativna »rešitev«.** Par $x = 2{,}5$, $y = 4{,}7$ res da $3x + 5y = 31$, a pol vozovnice ne obstaja. Pri vsaki rešitvi preveri: ali sta števili celi in ali ju besedilo dovoli (ni negativnih ljudi).
- **Ustavim se pri prvi rešitvi.** Diofantska enačba ima pogosto več rešitev. Naloga je rešena šele, ko pregledaš vse možnosti do meje ali s korakom zamenjave pokažeš, da drugih ni.
- **Napačna meja.** Iz $5y \le 31$ sledi $y \le 6$, ne $y < 6$. Kdor izpusti krajno vrednost, lahko izgubi rešitev, kot je $x = 5$ pri $4x + 3y = 23$ (Primer 1).
- **Prezrt pogoj iz besedila.** »Vsaj ena vozovnica vsake vrste«, »več otrok kot odraslih« ali »vsi čolni polni« izločijo nekatere rešitve. Pogoje beri na začetku in še enkrat na koncu.
- **Spregledan skupni delitelj.** Kdor pri $6x + 9y = 31$ začne preizkušati, izgublja čas. Če skupni delitelj koeficientov ne deli desne strani, rešitve ni.

## Povzetek

- Diofantska enačba: iščemo le celoštevilske (pogosto nenegativne) rešitve, npr. število vozovnic.
- Omejevanje: iz nenegativnosti dobiš mejo, npr. $5y \le 31$ da $y \le 6$.
- Preizkušanje: pregleduj neznanko z večjim koeficientom; ostanki in parnost skrajšajo seznam.
- Pri $ax + by = c$ se rešitve ponavljajo: $x$ se zmanjša za $b$, $y$ pa poveča za $a$, ali obratno (če $a$ in $b$ nimata skupnega delitelja, večjega od $1$).
- Če skupni delitelj $a$ in $b$ ne deli $c$, rešitve ni.
- Pri $xy$ v enačbi uredi neznanki ($x \le y$) in iz tega dobiš mejo za manjšo.
- Na koncu preveri vse pogoje iz besedila.

## Drugače: Z analogijo

Predstavljaj si menjalnico na železniški postaji. Za $5$ avtobusnih vozovnic po $3$ € ti brez doplačila da $3$ vlakovne po $5$ €, saj je oboje vredno $15$ €. Če imaš eno košarico vozovnic za $31$ €, lahko z menjavami dobiš vse druge:

- $(7, 2)$ → zamenjaš $5$ avtobusnih za $3$ vlakovne → $(2, 5)$;
- naslednja menjava bi zahtevala še $5$ avtobusnih, imaš pa le $2$.

Enako velja na zemljevidu: $5$ odsekov po $3\,\mathrm{km}$ je enako dolgih kot $3$ odseki po $5\,\mathrm{km}$. Pot iste dolžine dobiš tako, da en paket zamenjaš z drugim. Ko najdeš eno rešitev, je iskanje ostalih le še štetje menjav, ki jih »blagajna« dovoli.

## Drugače: Bolj natančno

Naj bo $D$ največji skupni delitelj števil $a$ in $b$. Enačba $ax + by = c$ ima celoštevilske rešitve natanko tedaj, ko $D$ deli $c$. Če je $(x_0, y_0)$ ena rešitev, so vse rešitve
$$x = x_0 + \frac{b}{D}\,t, \qquad y = y_0 - \frac{a}{D}\,t,$$
kjer je $t$ poljubno celo število. Pogoj $x \ge 0$, $y \ge 0$ omeji $t$ na končno mnogo vrednosti. Pri $D = 1$ je nenegativnih rešitev približno $\dfrac{c}{ab}$, pri $3x + 5y = 31$ torej približno $2$.

Enačbo iz Primera 3 lahko rešiš tudi z razcepom. Iz $xy - 2x - 2y = 0$ dobiš, ko obema stranema prišteješ $4$:
$$(x - 2)(y - 2) = 4.$$
Zmnožek dveh celih števil je $4$: možnosti so $1 \cdot 4$, $2 \cdot 2$, $4 \cdot 1$ (negativni pari dajo $x \le 1$ ali $y \le 1$, kar ne ustreza). Dobiš $(3, 6)$, $(4, 4)$, $(6, 3)$. Ta trik poskusi vedno, ko enačba vsebuje $xy$, $x$ in $y$.

## Preveri se

? Ana kupuje vozovnice po $3$ € in $5$ € in porabi $31$ €, torej $3x + 5y = 31$. Kateri par je rešitev naloge?
- $x = 2{,}5$, $y = 4{,}7$
~ Enačbo izpolni, a vozovnic ne moreš kupiti po pol. V diofantski nalogi štejejo le cela števila.
- $x = 12$, $y = -1$
~ $36 - 5 = 31$ drži, a negativno število vozovnic nima smisla. Besedilo zahteva nenegativni števili.
+ $x = 2$, $y = 5$
- $x = 5$, $y = 3$
~ $15 + 15 = 30$, ne $31$. Vsak par preveri z vstavljanjem.
> $3 \cdot 2 + 5 \cdot 5 = 6 + 25 = 31$, obe števili sta celi in nenegativni.

? Uredi enačbe po številu nenegativnih celoštevilskih rešitev od najmanj do največ: A: $6x + 9y = 31$, B: $3x + 5y = 31$, C: $x + y = 4$.
+ A, B, C
- B, A, C
~ A nima nobene rešitve: leva stran je deljiva s $3$, $31$ pa ne. Večji koeficienti ne pomenijo več rešitev.
- C, B, A
~ To je obratni vrstni red. Pri $x + y = 4$ ustreza vsak $x$ od $0$ do $4$, to je $5$ rešitev.
- A, C, B
~ B ima le $2$ rešitvi, C pa $5$. Ko sta koeficienta $1$, je vsako preizkušanje uspešno.
> A: $0$ rešitev, B: $2$ rešitvi, C: $5$ rešitev.

? Kaj se zgodi s številom nenegativnih rešitev, če v $3x + 5y = 31$ desno stran povečaš za $15$ (na $3x + 5y = 46$)?
- Ostane enako.
~ Dodatnih $15$ € omogoči še eno menjavo $5$ avtobusnih za $3$ vlakovne vozovnice.
+ Poveča se za $1$.
- Podvoji se.
~ $46$ ni dvakrat $31$, in število rešitev raste z zneskom le počasi, za eno na vsakih $15$ €.
- Poveča se za $15$.
~ $15$ je znesek enega paketa, ne število novih rešitev. En paket prinese eno novo rešitev.
> Rešitve so $(12, 2)$, $(7, 5)$, $(2, 8)$: tri namesto dveh.

? V hostlu so sobe s $4$ in s $6$ posteljami. Skupina $38$ popotnikov zasede vse postelje v izbranih sobah. Na koliko načinov lahko izberejo sobe?
- $1$
~ Ustavil si se pri prvi rešitvi. Preveri vse $y$ do meje.
- $2$
~ Verjetno si izpustil zadnjo možnost $y = 5$, $x = 2$. Iz $6y \le 38$ sledi $y \le 6$, zato preveri vse $y$ do $6$.
+ $3$
- $6$
~ $6$ je meja za število šestposteljnih sob, ne število rešitev. Vsak $y$ ne da celega $x$.
> $4x + 6y = 38$ oziroma $2x + 3y = 19$. $y$ mora biti lih: $y = 1, 3, 5$ da $x = 8, 5, 2$.

? Pohodna pot meri $66\,\mathrm{km}$ in je sestavljena iz etap po $5\,\mathrm{km}$ in $8\,\mathrm{km}$. Najmanj koliko etap ima?
+ $9$
- $12$
~ To je prva najdena rešitev ($10$ kratkih in $2$ dolgi). Preveri še ostale: z več dolgimi etapami jih je manj.
- $8$
~ $66 : 8$ zaokroženo da $8$, a $8 \cdot 8 = 64$, ne $66$. Rešitev mora dati natanko $66$.
> $5x + 8y = 66$ ima rešitvi $(10, 2)$ in $(2, 7)$. Druga ima $2 + 7 = 9$ etap.

:::simboli
x, y | celoštevilski neznanki | | | v Aninem primeru števili avtobusnih in vlakovnih vozovnic
x_0, y_0 | ena znana rešitev enačbe | | |
a, b | koeficienta enačbe ax + by = c | | |
D | največji skupni delitelj števil a in b | | | rešitve obstajajo natanko tedaj, ko D deli c
t | poljubno celo število (parameter) | | |
:::
