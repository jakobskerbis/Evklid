---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nina vodi spletno trgovino s smučarsko opremo. Analitik ji pusti model mesečne prodaje v tisočih evrov:

$$P(t) = 50 + \operatorname{Re}\big(20\,e^{i\pi t/6}\big),$$

kjer je $t$ število mesecev od januarja. Nina mora do petka naročiti zalogo za maj in julij. Najprej sklepa: »Eksponentna funkcija je vedno pozitivna. Torej je prodaja vedno nad $50$ tisoč evrov in lahko naročim enako kot pozimi.«

Če bi tako naročila, bi poleti ostala s polnim skladiščem. Napaka ni v modelu, ampak v Ninini predstavi o tem, kaj je $e$ na kompleksno potenco. Kompleksna eksponentna funkcija opisuje vse, kar se ponavlja: sezonsko prodajo, izmenični tok, nihanje, valove. Z njo se trigonometrija prevede v računanje s potencami.

## Razlaga

**Skušnjava: »$e^{z}$ je pač $e$, pomnožen s sabo $z$-krat.«** Pri $z = 3$ to deluje. Pri $z = \tfrac12$ še razumemo koren. Pri $z = i$ pa stavek »pomnoži $e$ s sabo $i$-krat« nima nobenega pomena. Nina je pravilo »$e^{x} > 0$« prenesla v svet, kjer ga nihče ni dokazal. Potrebujemo definicijo, ki ne govori o ponavljanju množenja.

**Popravek: definicija z vrsto.** Iz prejšnje lekcije veš, da je za realne $x$

$$e^{x} = \sum_{n=0}^{\infty} \frac{x^{n}}{n!}$$

in da ima ta vrsta konvergenčni polmer $\infty$. V vrsto lahko vstavimo tudi kompleksno število $z$. Ker vrsta $\sum |z|^{n}/n!$ konvergira (njena vsota je $e^{|z|}$), vrsta $\sum z^{n}/n!$ konvergira absolutno. Zato definiramo **kompleksno eksponentno funkcijo**

$$e^{z} = \exp z = \sum_{n=0}^{\infty} \frac{z^{n}}{n!}, \qquad z \in \mathbb{C}.$$

Na realni osi se ujema s staro funkcijo, drugod pa je nova.

**Kaj se zgodi pri $z = ix$.** Potence števila $i$ se ponavljajo s periodo $4$:

| $n$ | $i^{n}$ | $n$ | $i^{n}$ |
|---|---|---|---|
| $0$ | $1$ | $4$ | $1$ |
| $1$ | $i$ | $5$ | $i$ |
| $2$ | $-1$ | $6$ | $-1$ |
| $3$ | $-i$ | $7$ | $-i$ |

V vrsti za $e^{ix}$ so sodi členi realni z izmeničnimi predznaki, lihi pa imaginarni:

$$e^{ix} = \Big(1 - \frac{x^{2}}{2!} + \frac{x^{4}}{4!} - \dots\Big)$$

$$\qquad + \, i\Big(x - \frac{x^{3}}{3!} + \frac{x^{5}}{5!} - \dots\Big).$$

Prepoznaš Taylorjevi vrsti kosinusa in sinusa. Sledi **Eulerjeva formula**

$$e^{ix} = \cos x + i \sin x, \qquad x \in \mathbb{R}.$$

Preureditev členov je dovoljena, ker vrsta konvergira absolutno.

**Slika: točka na enotski krožnici.** V kompleksni ravnini je $\cos x + i\sin x$ točka na krožnici s polmerom $1$, ki z realno osjo oklepa kot $x$ (v radianih). Ko $x$ raste, točka $e^{ix}$ teče po krožnici v pozitivni smeri:

| $x$ | $e^{ix}$ |
|---|---|
| $0$ | $1$ |
| $\pi/2$ | $i$ |
| $\pi$ | $-1$ |
| $3\pi/2$ | $-i$ |
| $2\pi$ | $1$ |

Tu je Ninina napaka na dlani: $e^{ix}$ ne raste, ampak kroži. Njegova absolutna vrednost je vedno $|e^{ix}| = \sqrt{\cos^{2}x + \sin^{2}x} = 1$.

:::premisli
Pri katerem mesecu $t$ je točka $e^{i\pi t/6}$ na levem koncu krožnice in kolikšna je takrat prodaja v Ninini trgovini?
---
Pri $t = 6$ (julij), saj je takrat kot $\pi$ in $e^{i\pi} = -1$. Prodaja je $P(6) = 50 + 20 \cdot (-1) = 30$ tisoč evrov, torej pod $50$, ne nad.
:::

**Splošen eksponent.** Za eksponentno funkcijo velja adicijski izrek $e^{z+w} = e^{z}e^{w}$ za vse $z, w \in \mathbb{C}$. Dokažemo ga tako, da zmnožimo dve absolutno konvergentni vrsti in uporabimo binomsko formulo. Za $z = x + iy$ zato dobimo

$$e^{x+iy} = e^{x}\,(\cos y + i \sin y).$$

Realni del eksponenta določa **velikost**, $|e^{z}| = e^{\operatorname{Re} z}$. Imaginarni del določa **smer**: kot števila $e^{z}$ je $\operatorname{Im} z$. Iz tega sledita dve lastnosti:

- $e^{z} \neq 0$ za vsak $z$, ker je $e^{x} > 0$.
- $e^{z + 2\pi i} = e^{z}$: funkcija je **periodična s periodo $2\pi i$**, zato ni injektivna.

:::premisli
Poišči vse rešitve enačbe $e^{z} = 1$ v $\mathbb{C}$. Koliko jih leži na realni osi? Napovej, preden prebereš.
---
Neskončno. Iz $e^{x}(\cos y + i\sin y) = 1$ sledi $e^{x} = 1$ in kot $y$ je večkratnik $2\pi$. Rešitve so $z = 2k\pi i$, $k \in \mathbb{Z}$. Na realni osi je bila rešitev le $z = 0$.
:::

**Kosinus in sinus kompleksnega števila.** Če Eulerjevo formulo zapišemo za $x$ in $-x$ ter seštejemo oziroma odštejemo, dobimo

$$\cos z = \frac{e^{iz} + e^{-iz}}{2}, \qquad \sin z = \frac{e^{iz} - e^{-iz}}{2i}.$$

Ti formuli vzamemo za definicijo pri kompleksnem $z$. Ujemata se s Taylorjevima vrstama. Pozor: kompleksni kosinus ni omejen: že $\cos i = \dfrac{e^{-1} + e}{2} \approx 1{,}543$ je večji od $1$, $\cos(iy) = \dfrac{e^{-y} + e^{y}}{2}$ pa z $y$ raste čez vse meje.

**Logaritem.** Ker $\exp$ ni injektiven, ima enačba $e^{w} = z$ za $z \neq 0$ neskončno rešitev: $w = \ln|z| + i(\varphi + 2k\pi)$, kjer je $\varphi$ kot števila $z$. Kompleksni logaritem je zato večličen: vsako $z \neq 0$ ima neskončno logaritmov. Za računanje izberemo eno vejo (en izbor $k$), običajno tisto s $\varphi \in (-\pi, \pi]$.

## Rešeni primeri

### Primer 1 (lažji): vrednosti eksponentne funkcije

Izračunaj $e^{i\pi/3}$, $e^{2 + i\pi/2}$ in $e^{\ln 2 + i\pi/4}$ v obliki $a + bi$.

**Podatki:** $z_1 = i\pi/3$, $z_2 = 2 + i\pi/2$, $z_3 = \ln 2 + i\pi/4$
**Iščemo:** $e^{z_1}$, $e^{z_2}$, $e^{z_3}$ v obliki $a + bi$

:::formula
$e^{x+iy} = e^{x}(\cos y + i\sin y)$
:::

**Rešitev:**

1. Pri $z_1$ je $x = 0$, zato je $e^{i\pi/3} = \cos\frac{\pi}{3} + i\sin\frac{\pi}{3} = \frac12 + \frac{\sqrt3}{2}i \approx 0{,}5 + 0{,}866i$.
2. Pri $z_2$ je $\cos\frac{\pi}{2} = 0$ in $\sin\frac{\pi}{2} = 1$, zato je $e^{2+i\pi/2} = e^{2}\,i \approx 7{,}389\,i$. Število leži na imaginarni osi, ker je kot pravi.
3. Pri $z_3$ je $e^{\ln 2} = 2$, torej $e^{z_3} = 2\big(\frac{\sqrt2}{2} + \frac{\sqrt2}{2}i\big) = \sqrt2 + \sqrt2\,i \approx 1{,}414 + 1{,}414i$.
4. Odgovor: $e^{i\pi/3} \approx 0{,}5 + 0{,}866i$, $e^{2+i\pi/2} = e^{2} i$, $e^{\ln 2 + i\pi/4} = \sqrt2 + \sqrt2\,i$.

### Primer 2: adicijski izrek za kosinus brez risanja

Z Eulerjevo formulo izpelji formulo za $\cos(a + b)$, kjer sta $a, b \in \mathbb{R}$.

**Podatki:** $a, b \in \mathbb{R}$; velja $e^{i(a+b)} = e^{ia}e^{ib}$
**Iščemo:** $\cos(a+b)$, izražen s $\cos a$, $\sin a$, $\cos b$, $\sin b$

:::formula
$e^{ix} = \cos x + i\sin x$ in $e^{z+w} = e^{z}e^{w}$
:::

**Rešitev:**

1. Leva stran: $e^{i(a+b)} = \cos(a+b) + i\sin(a+b)$.
2. Desna stran: $(\cos a + i\sin a)(\cos b + i\sin b)$. Zmnožimo in upoštevamo $i^{2} = -1$:
   $= (\cos a\cos b - \sin a\sin b) + i(\sin a\cos b + \cos a\sin b)$.
3. Kompleksni števili sta enaki natanko tedaj, ko se ujemata realna in imaginarna dela. Realna dela dasta
   $\cos(a+b) = \cos a\cos b - \sin a\sin b$.
4. Odgovor: dobili smo adicijski izrek za kosinus; imaginarna dela dasta še izrek za sinus.

### Primer 3 (težji): Ninina naročila

Vrnimo se k modelu $P(t) = 50 + \operatorname{Re}\big(20\,e^{i\pi t/6}\big)$ v tisočih evrov, $t = 0$ je januar. Kolikšna je pričakovana prodaja v maju? V katerem mesecu je prodaja najmanjša in kolikšna je?

**Podatki:** $P(t) = 50 + \operatorname{Re}(20\,e^{i\pi t/6})$ (tisoč €), maj je $t = 4$
**Iščemo:** $P(4)$ ter $t$, pri katerem je $P$ najmanjši, in $P$ pri njem

:::formula
$\operatorname{Re}\big(e^{iy}\big) = \cos y$, zato $P(t) = 50 + 20\cos\dfrac{\pi t}{6}$
:::

**Rešitev:**

1. Z Eulerjevo formulo zapišemo model brez kompleksnih števil: $P(t) = 50 + 20\cos\frac{\pi t}{6}$.
2. Maj: $\frac{\pi \cdot 4}{6} = \frac{2\pi}{3}$ in $\cos\frac{2\pi}{3} = -\frac12$. Torej $P(4) = 50 + 20 \cdot (-0{,}5) = 40$.
3. Najmanjšo vrednost dobimo, ko je kosinus enak $-1$, torej ko je točka $e^{i\pi t/6}$ na levem koncu krožnice: $\frac{\pi t}{6} = \pi$, $t = 6$.
4. $P(6) = 50 - 20 = 30$.
5. Odgovor: v maju Nina pričakuje $40$ tisoč €, najmanj pa v juliju, $30$ tisoč €. Zaloga za poletje mora biti manjša od zimske.

### Primer 4: zdaj ti

Reši enačbo $e^{z} = -2$ v $\mathbb{C}$.

**Podatki:** $e^{z} = -2$, $z = x + iy$
**Iščemo:** vse rešitve $z$

:::formula
$|e^{z}| = e^{x}$, kot števila $e^{z}$ je $y$
:::

**Rešitev:**

1. Absolutni vrednosti se morata ujemati: $e^{x} = |-2| = 2$, torej $x = \ln 2$.
2. Število $-2$ leži na negativni realni osi, njegov kot je $\pi$.
3. Zapiši še pogoj za $y$ in vse rešitve, nato preveri:

:::premisli
Kateri $y$ so dovoljeni in kako se glasijo vse rešitve?
---
Kot je določen do večkratnika $2\pi$: $y = \pi + 2k\pi$. Rešitve so $z = \ln 2 + i(2k+1)\pi$, $k \in \mathbb{Z}$, na primer $\ln 2 + i\pi \approx 0{,}693 + 3{,}142i$.
:::

## Pogoste napake

- **»$e^{z}$ je vedno pozitiven.«** To velja le za realne $z$. Ninin primer: $e^{i\pi} = -1$. Pri kompleksnem eksponentu je pozitivna le absolutna vrednost $|e^{z}| = e^{\operatorname{Re} z}$.
- **Seštevanje namesto množenja.** Kdor piše $e^{x+iy} = e^{x} + e^{iy}$, zamenja pravilo za potence s pravilom za vsote. Pravilno je $e^{x+iy} = e^{x}e^{iy}$.
- **Koti v stopinjah.** Eulerjeva formula izhaja iz Taylorjevih vrst, te pa veljajo le za radiane. $e^{i\cdot 90}$ ni $i$; pravilno je $e^{i\pi/2} = i$.
- **»$|e^{z}| = e^{|z|}$.«** Velikost določa le realni del. Na primer $|e^{3i}| = 1$, ne $e^{3}$.
- **Ena rešitev enačbe $e^{z} = w$ ($w \neq 0$).** Ker je $\exp$ periodičen s periodo $2\pi i$, je rešitev neskončno, vse se razlikujejo za $2k\pi i$.

## Povzetek

- Kompleksno eksponentno funkcijo definiramo z vrsto $e^{z} = \sum z^{n}/n!$, ki konvergira za vse $z \in \mathbb{C}$.
- Eulerjeva formula: $e^{ix} = \cos x + i\sin x$; točka $e^{ix}$ leži na enotski krožnici pod kotom $x$ (radiani). Posebej $e^{i\pi} = -1$.
- $e^{x+iy} = e^{x}(\cos y + i\sin y)$, $|e^{z}| = e^{\operatorname{Re} z}$, $e^{z+w} = e^{z}e^{w}$.
- $e^{z} \neq 0$, funkcija je periodična s periodo $2\pi i$; logaritem je zato večličen.
- $\cos z = \frac{e^{iz}+e^{-iz}}{2}$, $\sin z = \frac{e^{iz}-e^{-iz}}{2i}$; za kompleksne $z$ nista omejena.

## Drugače: Kot zgodba

Trgovec Boris ima račun z obrestovanjem, ki se pripisuje vsak trenutek. Pri obrestni meri $1$ velja za stanje $K'(t) = K(t)$, zato stanje raste kot $e^{t}$: vsak hip se doda košček v smeri sedanjega stanja.

Neke noči sanja čudno banko. Obresti so tam »imaginarne«: vsak hip se doda košček, ki je za $90^{\circ}$ zasukan glede na trenutno stanje. To je $K'(t) = i\,K(t)$, rešitev pa $K(t) = e^{it}$, če začne z $1$.

Kaj se zgodi z Borisovim denarjem? Premik je vedno pravokoten na smer od izhodišča do stanja, tako kot pri vrvici, ki jo vrtiš nad glavo. Razdalja od izhodišča se zato ne spremeni, stanje pa kroži po enotski krožnici. Po času $\pi$ je Boris na nasprotni strani: dolguje toliko, kolikor je imel. Po času $2\pi$ je spet na začetku. Zbudi se z Eulerjevo formulo v glavi: realne obresti raztezajo, imaginarne vrtijo.

## Drugače: Korak za korakom s številkami

Seštejmo vrsto $\sum (i\pi)^{n}/n!$ člen za členom, z zaokroženimi vrednostmi. Delne vsote $S_n$ (od $n = 4$ naprej le vsaka druga vrstica):

| $n$ | člen | $S_n$ |
|---|---|---|
| $0$ | $1$ | $1$ |
| $1$ | $3{,}1416\,i$ | $1 + 3{,}1416\,i$ |
| $2$ | $-4{,}9348$ | $-3{,}9348 + 3{,}1416\,i$ |
| $3$ | $-5{,}1677\,i$ | $-3{,}9348 - 2{,}0261\,i$ |
| $4$ | $4{,}0587$ | $0{,}1239 - 2{,}0261\,i$ |
| $6$ | $-1{,}3353$ | $-1{,}2114 + 0{,}5240\,i$ |
| $8$ | $0{,}2353$ | $-0{,}9760 - 0{,}0752\,i$ |
| $10$ | $-0{,}0258$ | $-1{,}0018 + 0{,}0069\,i$ |
| $12$ | $0{,}0019$ | $-0{,}9999 - 0{,}0004\,i$ |

1. Členi se izmenično sukajo za $90^{\circ}$ (množenje z $i$), zato delne vsote skačejo po ravnini kot spirala.
2. Ker $n!$ hitro raste, so koraki vedno krajši.
3. Spirala se ustali pri $-1$: to je $e^{i\pi} = -1$, izračunano brez trigonometrije.

## Preveri se

? Katero od teh števil **ne** leži na enotski krožnici?
- $e^{i\pi/7}$
~ Eksponent je čisto imaginaren, zato je $|e^{i\pi/7}| = e^{0} = 1$.
- $e^{-3i}$
~ Tudi negativen kot da točko na krožnici: $|e^{-3i}| = 1$.
+ $e^{1+i}$
- $e^{100i}$
~ Velik kot le večkrat obkroži krožnico; absolutna vrednost ostane $1$.
> $|e^{z}| = e^{\operatorname{Re} z}$. Le pri $e^{1+i}$ je realni del $1$, zato je $|e^{1+i}| = e \approx 2{,}718$.

? Koliko je $e^{2 + i\pi}$?
- $e^{2} - 1 \approx 6{,}389$
~ To dobiš, če potenco razbiješ na vsoto $e^{2} + e^{i\pi}$. Pravilno je produkt $e^{2}e^{i\pi}$.
+ $-e^{2} \approx -7{,}389$
- $e^{2} \approx 7{,}389$
~ Tako misliš, če je $e^{z}$ vedno pozitiven, a $e^{i\pi} = -1$ obrne predznak.
> $e^{2+i\pi} = e^{2}(\cos\pi + i\sin\pi) = -e^{2}$.

? Zakaj enačba $e^{z} = 0$ nima rešitve v $\mathbb{C}$?
- Ker je $e^{z}$ za vsak $z$ pozitivno realno število.
~ Ni res: $e^{i\pi} = -1$, $e^{i\pi/2} = i$. Pozitivna je le absolutna vrednost.
+ Ker je $|e^{z}| = e^{\operatorname{Re} z} > 0$ za vsak $z$.
- Ker vrsta $\sum z^{n}/n!$ za velike $|z|$ ne konvergira.
~ Vrsta ima konvergenčni polmer $\infty$ in konvergira za vsak $z$.
> Število z absolutno vrednostjo $e^{x} > 0$ ne more biti $0$.

? Študent računa $|e^{3+4i}|$: (1) $e^{3+4i} = e^{3}e^{4i}$; (2) $|e^{3+4i}| = e^{3}\,|e^{4i}|$; (3) $|e^{4i}| = e^{4}$; (4) rezultat $e^{7}$. Kateri korak je napačen?
- Korak (1)
~ Adicijski izrek $e^{z+w} = e^{z}e^{w}$ velja za vse kompleksne $z$ in $w$.
- Korak (2)
~ Absolutna vrednost produkta je produkt absolutnih vrednosti, $e^{3} > 0$.
+ Korak (3)
- Korak (4)
~ Korak (4) le pravilno sledi iz napačnega koraka (3). Napaka je prej.
> $e^{4i}$ leži na enotski krožnici, zato je $|e^{4i}| = 1$ in $|e^{3+4i}| = e^{3}$.

? Trgovina z rolkami ima model mesečne prodaje $P(t) = 80 + \operatorname{Re}\big(30\,e^{i\pi t/6}\big)$ v tisočih €, $t = 0$ je januar. Kolikšna je pričakovana prodaja v marcu ($t = 2$)?
- $110$ tisoč €
~ Tu je $e^{i\pi/3}$ obravnavan kot $1$. Točka je na krožnici, a pod kotom $\pi/3$, njen realni del je $\tfrac12$.
+ $95$ tisoč €
- približno $106$ tisoč €
~ To je $80 + 30\sin\frac{\pi}{3}$: vzet je imaginarni del namesto realnega.
> $\operatorname{Re}(e^{i\pi/3}) = \cos\frac{\pi}{3} = \frac12$, zato $P(2) = 80 + 30 \cdot 0{,}5 = 95$.

:::simboli
P | mesečna prodaja v trgovini | P(t) = 50 + \operatorname{Re}\big(20\,e^{i\pi t/6}\big) | | v tisočih evrov
t | število mesecev od januarja | | | t = 0 je januar
e | Eulerjevo število | | | e ≈ 2,718
i | imaginarna enota | | | i² = −1
z | kompleksno število | z = x + iy
x | realni del kompleksnega števila z | | | v vrsti za eˣ realno število
y | imaginarni del kompleksnega števila z
w | kompleksno število (eksponent, logaritem) | | | eʷ = z
n | zaporedna številka člena vrste
:::
