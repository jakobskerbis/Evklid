---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Neža poje v šolskem bendu. Na koncertu na igrišču ne bo mikrofona za napovedovanje skladb, zato si bo iz kartona zvila megafon. To je stožec brez dna, ki zvok njenega glasu usmeri naprej, proti publiki. Odprtina naj ima premer $14\,\text{cm}$. Od konice naravnost do sredine odprtine naj bo megafon dolg $24\,\text{cm}$.

Neža ima pred seboj ravno ploščo kartona. Kakšen lik mora izrezati, da se bo zvil v tak megafon? Koliko kartona porabi? In koliko zraka je v megafonu? Na ta vprašanja odgovarjata ploščina plašča in prostornina stožca.

## Razlaga

**1. Deli stožca na Nežinem megafonu.** Odprtina megafona je krog. To je **osnovna ploskev** stožca, njen polmer je $r = 7\,\text{cm}$. Konica, kjer bo Neža govorila, je **vrh**. Ukrivljena ploskev od roba odprtine do vrha je **plašč**. **Višina** $v$ je razdalja od vrha do osnovne ploskve; pri pokončnem stožcu pade v središče kroga. Pri Neži je $v = 24\,\text{cm}$. Daljica od vrha do roba osnovne ploskve leži na plašču. Imenujemo jo **stranica** stožca $s$.

**2. Stranica.** Višina, polmer in stranica tvorijo pravokotni trikotnik. Pravi kot je ob središču osnovne ploskve, stranica $s$ je hipotenuza.

:::risba skica
opis: Osni presek Nežinega megafona: enakokraki trikotnik z osnovnico 14 in višino 24. Navpična črtkana višina v = 24 ga razdeli na dva pravokotna trikotnika. Desna polovica osnovnice je polmer r = 7, desni krak je stranica s = 25. Pravi kot je ob središču osnovnice.
območje: 0; 0 .. 18; 26
enota: 12
lik: 2; 1 -> 16; 1 -> 9; 25 | modra
črta: 9; 1 -> 9; 25 | črtkano
pravikot: 9; 1 | 16; 1 | 9; 25
napis: 9; 13 | v = 24 | levo
napis: 12,5; 1 | r = 7 | pod
napis: 12,5; 13 | s = 25 | desno
napis: 9; 25 | vrh | nad
:::

Pitagorov izrek da $s = \sqrt{7^2 + 24^2} = \sqrt{625} = 25\,\text{cm}$. Enako velja za vsak pokončni stožec:

$$s^2 = r^2 + v^2$$

**3. Plašč je krožni izsek.** Neža megafon v mislih prereže vzdolž stranice in ga razgrne na mizo. Dobi **krožni izsek**. Njegov polmer je stranica $s = 25\,\text{cm}$, saj vsaka točka roba odprtine leži $25\,\text{cm}$ od vrha. Lok izseka se ovije okoli odprtine, zato je dolg toliko kot njen obseg: $2\pi \cdot 7 = 14\pi\,\text{cm}$.

Cel krog s polmerom $25\,\text{cm}$ ima obseg $50\pi\,\text{cm}$ in ploščino $625\pi\,\text{cm}^2$. Izsek ima lok $14\pi$ od $50\pi$, torej je $\frac{14}{50} = \frac{7}{25}$ celega kroga. Njegova ploščina je $\frac{7}{25} \cdot 625\pi = 175\pi \approx 549{,}78\,\text{cm}^2$. Središčni kot izseka je $\frac{7}{25} \cdot 360^\circ = 100{,}8^\circ$. Neža torej izreže izsek s polmerom $25\,\text{cm}$ in kotom $100{,}8^\circ$.

Zdaj splošno. Lok izseka je $2\pi r$, obseg celega kroga pa $2\pi s$. Izsek je zato vedno $\frac{r}{s}$ celega kroga s polmerom $s$. Ploščina plašča je zato $\frac{r}{s} \cdot \pi s^2$, kar se okrajša v

$$\mathrm{pl} = \pi r s$$

Središčni kot izseka je

$$\alpha = \frac{r}{s} \cdot 360^\circ$$

Zaprt stožec ima še osnovno ploskev. Njegova **površina** je

$$P = \pi r^2 + \pi r s$$

:::premisli
Stožec splošči: polmer ostane enak, višina se zmanjša. Napovej, ali bo razgrnjen plašč večji ali manjši del kroga.
---
Večji del kroga. Pri manjši višini se zmanjša stranica $s$, polmer $r$ pa ostane. Razmerje $\frac{r}{s}$ se poveča, zato se poveča tudi središčni kot. Pri zelo ploščatem stožcu je $s$ skoraj enak $r$ in izsek je skoraj cel krog.
:::

**4. Prostornina.** Koliko zraka je v Nežinem megafonu? Primerjajmo ga z valjem z enako osnovno ploskvijo in enako višino. Ta ima prostornino $\pi \cdot 7^2 \cdot 24 = 1176\pi\,\text{cm}^3$. Poskus pokaže, da moramo stožčasto posodo napolniti z vodo in preliti v tak valj natanko trikrat, da je valj poln. Stožec ima torej tretjino prostornine valja: $1176\pi : 3 = 392\pi \approx 1231{,}50\,\text{cm}^3$, kar je malo več kot liter.

Splošno velja

$$V = \frac{\pi r^2 v}{3}$$

To je ista zveza kot pri piramidi, $V = \frac{O \cdot v}{3}$, le da je osnovna ploskev krog.

:::premisli
Stožec in valj imata enak polmer. Stožec je trikrat višji od valja. Katero telo ima večjo prostornino?
---
Enako veliko. Tretjina in trikrat večja višina se izničita: $\frac{\pi r^2 \cdot 3v}{3} = \pi r^2 v$.
:::

**5. Stožec kot vrtenina.** Desna polovica trikotnika na risbi je pravokotni trikotnik s katetama $7\,\text{cm}$ in $24\,\text{cm}$. Zavrtimo ga za cel obrat okoli katete $24\,\text{cm}$. Ta kateta ostane na mestu in postane višina. Druga kateta opiše krog, zato je polmer. Hipotenuza opiše plašč, zato je stranica. Nastane natanko Nežin megafon.

Splošno: z vrtenjem pravokotnega trikotnika okoli katete nastane pokončni stožec. Kateta ob osi je višina $v$, druga kateta je polmer $r$, hipotenuza je stranica $s$. Enak stožec nastane tudi, če enakokraki trikotnik zavrtimo okoli njegove višine na osnovnico.

**6. Osni presek.** Ravnina skozi os prereže stožec v enakokraki trikotnik z osnovnico $2r$ in krakoma $s$. Če je ta trikotnik enakostraničen, je $s = 2r$ in stožec je **enakostraničen**.

V simulaciji spodaj »3D: Stožec (krožni izsek in prerezi)« povleci »Razpri mrežo«. Opazuj, kako se plašč razgrne v krožni izsek, katerega lok se je prej prilegal robu osnovne ploskve.

**7. Enote.** Vse dolžine zapiši v isti enoti. Plašč in površina sta v $\text{cm}^2$, prostornina v $\text{cm}^3$, pri tem je $1000\,\text{cm}^3 = 1\,\text{l}$.

## Rešeni primeri

### Primer 1 (lažji): membrana zvočnika

Membrana zvočnika ima obliko plašča stožca brez osnovne ploskve. Njen polmer je $8\,\text{cm}$, globina (višina) pa $6\,\text{cm}$. Koliko papirja je v membrani? Kakšen krožni izsek je treba izrezati zanjo?

**Podatki:** $r = 8\,\text{cm}$, $v = 6\,\text{cm}$, membrana nima osnovne ploskve
**Iščemo:** stranico $s$, ploščino plašča $\mathrm{pl}$ in središčni kot $\alpha$

:::formula
$s^2 = r^2 + v^2$, $\mathrm{pl} = \pi r s$, $\alpha = \dfrac{r}{s} \cdot 360^\circ$
:::

**Rešitev:**

1. Plašč potrebuje stranico, zato jo najprej izračunamo: $s = \sqrt{8^2 + 6^2} = \sqrt{100} = 10\,\text{cm}$.
2. Plašč: $\mathrm{pl} = \pi \cdot 8 \cdot 10 = 80\pi \approx 251{,}33\,\text{cm}^2$.
3. Središčni kot: $\alpha = \dfrac{8}{10} \cdot 360^\circ = 288^\circ$.
4. Odgovor: v membrani je približno $251\,\text{cm}^2$ papirja. Izrežemo izsek s polmerom $10\,\text{cm}$ in kotom $288^\circ$. Kot je velik, ker je membrana plitva.

### Primer 2: dva stožca iz istega trikotnika

Pravokotni trikotnik s katetama $5\,\text{cm}$ in $12\,\text{cm}$ zavrtimo okoli daljše katete, nato pa še okoli krajše. Izračunaj prostornino in površino obeh stožcev.

**Podatki:** kateti $5\,\text{cm}$ in $12\,\text{cm}$; os vrtenja najprej daljša, nato krajša kateta
**Iščemo:** $V_1$, $P_1$ (os ob daljši kateti) ter $V_2$, $P_2$ (os ob krajši kateti)

:::formula
$V = \dfrac{\pi r^2 v}{3}$, $P = \pi r^2 + \pi r s$; kateta ob osi je $v$, druga kateta je $r$, hipotenuza je $s$
:::

**Rešitev:**

1. Hipotenuza je v obeh primerih stranica: $s = \sqrt{5^2 + 12^2} = \sqrt{169} = 13\,\text{cm}$.
2. Os ob daljši kateti: $v = 12\,\text{cm}$, $r = 5\,\text{cm}$. $V_1 = \dfrac{\pi \cdot 5^2 \cdot 12}{3} = 100\pi \approx 314{,}16\,\text{cm}^3$.
3. $P_1 = \pi \cdot 5^2 + \pi \cdot 5 \cdot 13 = 25\pi + 65\pi = 90\pi \approx 282{,}74\,\text{cm}^2$.
4. Os ob krajši kateti: vlogi se zamenjata, $v = 5\,\text{cm}$, $r = 12\,\text{cm}$. $V_2 = \dfrac{\pi \cdot 12^2 \cdot 5}{3} = 240\pi \approx 753{,}98\,\text{cm}^3$.
5. $P_2 = \pi \cdot 12^2 + \pi \cdot 12 \cdot 13 = 144\pi + 156\pi = 300\pi \approx 942{,}48\,\text{cm}^2$.
6. Odgovor: prvi stožec ima $V_1 \approx 314\,\text{cm}^3$ in $P_1 \approx 283\,\text{cm}^2$, drugi $V_2 \approx 754\,\text{cm}^3$ in $P_2 \approx 942\,\text{cm}^2$. Drugi je večji, ker je pri njem daljša kateta polmer, ta pa je v formulah kvadriran.

### Primer 3 (težji): rog iz izseka

Tim za glasbeni pouk izreže iz kartona krožni izsek s polmerom $10\,\text{cm}$ in središčnim kotom $216^\circ$. Zvije ga v stožčast rog, tako da se ravna robova izseka natanko stakneta. Koliko zraka je v rogu?

**Podatki:** polmer izseka $10\,\text{cm}$, središčni kot $\alpha = 216^\circ$
**Iščemo:** prostornino stožca $V$

:::formula
lok izseka $l = \dfrac{\alpha}{360^\circ} \cdot 2\pi s$, ta je enak obsegu osnovne ploskve $2\pi r$; nato $s^2 = r^2 + v^2$ in $V = \dfrac{\pi r^2 v}{3}$
:::

**Rešitev:**

1. Polmer izseka postane stranica stožca: $s = 10\,\text{cm}$.
2. Lok izseka: $l = \dfrac{216}{360} \cdot 2\pi \cdot 10 = 12\pi\,\text{cm}$.
3. Lok se ovije okoli osnovne ploskve, zato je $2\pi r = 12\pi$ in $r = 6\,\text{cm}$.
4. Zdaj ti: izračunaj višino $v$ in prostornino $V$.

:::premisli
Kolikšna sta višina in prostornina roga?
---
$v = \sqrt{10^2 - 6^2} = \sqrt{64} = 8\,\text{cm}$ (iščemo kateto, zato odštevamo). $V = \dfrac{\pi \cdot 6^2 \cdot 8}{3} = 96\pi \approx 301{,}59\,\text{cm}^3$, torej približno $0{,}3\,\text{l}$ zraka.
:::

## Pogoste napake

- **Višina in stranica zamenjani.** Učenec v formulo za prostornino vstavi $s$, ker je »dolžina stožca«. Prostornina potrebuje višino, ki je pravokotna na osnovno ploskev, plašč pa stranico, ki leži na njem. Pred računom na skici označi, katera daljica je $v$ in katera $s$.
- **Pozabljena tretjina.** $\pi r^2 v$ je prostornina valja z enako osnovno ploskvijo in višino. Stožec ima le tretjino tega, zato vedno deli s $3$.
- **$s = r + v$.** Učenec stranice sešteje. Stranica je hipotenuza pravokotnega trikotnika, zato velja $s = \sqrt{r^2 + v^2}$, kar je manj kot $r + v$. Ko iščeš kateto ($v$ ali $r$), pod korenom odštevaš.
- **Osnovna ploskev preveč ali premalo.** Megafon, lijak ali membrana nimajo dna, zato je material le plašč $\pi r s$. Zaprt stožec ima površino $\pi r^2 + \pi r s$. Preberi, ali je stožec odprt.
- **Obrnjen kot izseka.** Učenec računa $\frac{s}{r} \cdot 360^\circ$ in dobi več kot $360^\circ$. Ker je $r < s$, je izsek vedno manjši od celega kroga: $\alpha = \frac{r}{s} \cdot 360^\circ$.

## Povzetek

- Pokončni stožec ima osnovno ploskev (krog s polmerom $r$), plašč in vrh. Višina $v$ je pravokotna na osnovno ploskev, stranica $s$ leži na plašču.
- $s^2 = r^2 + v^2$, zato $s = \sqrt{r^2 + v^2}$.
- Razgrnjen plašč je krožni izsek s polmerom $s$ in lokom $2\pi r$; središčni kot je $\alpha = \frac{r}{s} \cdot 360^\circ$.
- Plašč: $\mathrm{pl} = \pi r s$. Površina: $P = \pi r^2 + \pi r s$.
- Prostornina: $V = \dfrac{\pi r^2 v}{3}$, tretjina valja z enako osnovno ploskvijo in višino.
- Stožec je vrtenina: pravokotni trikotnik zavrtimo okoli katete. Kateta ob osi je $v$, druga kateta $r$, hipotenuza $s$.
- Osni presek je enakokraki trikotnik; enakostranični stožec ima $s = 2r$.

## Drugače: Z analogijo

**Stožec je valju to, kar je piramida prizmi.** Prizma in valj imata dve osnovni ploskvi in prostornino $O \cdot v$. Piramida in stožec imata eno osnovno ploskev in vrh, zato le tretjino: $\frac{O \cdot v}{3}$. Če znaš piramido, za stožec samo zamenjaš osnovno ploskev s krogom, $O = \pi r^2$.

**Plašč je kot pahljača.** Odprta papirnata pahljača je krožni izsek. Ko jo zvijemo, da se zunanja robova stakneta, nastane stožčast klobuček. Rebra pahljače postanejo stranice stožca, zato je polmer izseka $s$. Zgornji rob pahljače se ovije okoli odprtine klobučka, zato je lok izseka dolg $2\pi r$. Pri tem se papir ne raztegne, zato je ploščina pahljače enaka ploščini plašča.

## Drugače: Bolj natančno

**Plašč še enkrat.** Izsek razrežemo na zelo veliko ozkih trikotnikov z vrhom v središču. Vsak ima višino skoraj $s$. Njihove osnovnice skupaj tvorijo lok $2\pi r$. Vsota ploščin je zato $\frac{2\pi r \cdot s}{2} = \pi r s$. Izsek se torej obnaša kot trikotnik z osnovnico $2\pi r$ in višino $s$.

**Zakaj tretjina?** Pravilni piramidi z zelo veliko stranicami osnovne ploskve se stožec čedalje bolj prilega. Za vsako tako piramido velja $V = \frac{O \cdot v}{3}$, zato velja tudi za stožec. Strog dokaz presega 9. razred, poskus s prelivanjem vode pa formulo potrdi.

**Enakostranični stožec.** Ker je $s = 2r$, je $\frac{r}{s} = \frac{1}{2}$ in razgrnjen plašč je polkrog ($180^\circ$). Plašč je $\pi r \cdot 2r = 2\pi r^2$, površina pa $\pi r^2 + 2\pi r^2 = 3\pi r^2$.

## Preveri se

? Pravokotni trikotnik zavrtimo okoli ene od katet. Kaj postane druga kateta v nastalem stožcu?
- višina stožca
~ Višina je kateta ob osi, ki se ne premakne. Druga kateta je pravokotna na os.
- premer osnovne ploskve
~ Kateta sega od osi le do roba kroga, torej do polovice premera.
+ polmer osnovne ploskve
- stranica stožca
~ Stranica je hipotenuza, ki povezuje vrh z robom osnovne ploskve.
> Druga kateta se vrti okoli osi in opiše krog, katerega središče je na osi. Njena dolžina je zato polmer, ne premer.

? Stožec ima $r = 9\,\text{cm}$ in $v = 12\,\text{cm}$. Kolikšen je središčni kot razgrnjenega plašča?
- $270^\circ$
~ Vstavil si višino namesto stranice: $\frac{9}{12} \cdot 360^\circ$. Polmer izseka je stranica $s$.
- $600^\circ$
~ Obrnil si ulomek: $\frac{s}{r} \cdot 360^\circ$. Izsek je vedno manjši od celega kroga.
- $108^\circ$
~ Cel krog ima $360^\circ$, ne $180^\circ$.
+ $216^\circ$
> $s = \sqrt{9^2 + 12^2} = 15\,\text{cm}$, $\alpha = \frac{9}{15} \cdot 360^\circ = 216^\circ$.

? Stožec ima $r = 5\,\text{cm}$ in $v = 12\,\text{cm}$. Učenec je računal: (1) $s = \sqrt{25 + 144} = 13\,\text{cm}$; (2) $O = 25\pi\,\text{cm}^2$; (3) $\mathrm{pl} = \pi \cdot 5 \cdot 13 = 65\pi\,\text{cm}^2$; (4) $V = \frac{\pi \cdot 25 \cdot 13}{3}\,\text{cm}^3$. V katerem koraku se je zmotil?
- korak (1)
~ Stranica je res hipotenuza: $\sqrt{5^2 + 12^2} = 13$.
- korak (2)
~ Ploščina kroga s polmerom $5$ je res $25\pi$.
- korak (3)
~ Plašč res potrebuje stranico: $\pi r s = 65\pi$.
+ korak (4)
> V prostornino spada višina, ne stranica: $V = \frac{\pi \cdot 25 \cdot 12}{3} = 100\pi\,\text{cm}^3$.

? Stožec ima $r = 6\,\text{cm}$ in $v = 8\,\text{cm}$. Kolikšna je njegova prostornina?
- $288\pi\,\text{cm}^3$
~ To je prostornina valja $\pi r^2 v$. Stožec ima tretjino tega.
- $120\pi\,\text{cm}^3$
~ Vstavil si stranico $s = 10\,\text{cm}$ namesto višine.
- $16\pi\,\text{cm}^3$
~ Pozabil si kvadrirati polmer: $\frac{\pi \cdot 6 \cdot 8}{3}$.
+ $96\pi\,\text{cm}^3$
> $V = \frac{\pi \cdot 6^2 \cdot 8}{3} = \frac{288\pi}{3} = 96\pi\,\text{cm}^3$.

? Pevke zbora bodo na nastopu nosile stožčaste klobučke brez dna s polmerom $10\,\text{cm}$ in višino $24\,\text{cm}$. Koliko papirja potrebujejo za en klobuček (brez lepilnega roba)?
- približno $754\,\text{cm}^2$
~ Namesto stranice si vstavil višino: $\pi \cdot 10 \cdot 24$. Plašč potrebuje $s$.
+ približno $817\,\text{cm}^2$
- približno $1131\,\text{cm}^2$
~ Prištel si osnovno ploskev $100\pi$, klobuček pa nima dna.
- približno $2513\,\text{cm}^2$
~ To je število iz prostornine $\frac{\pi r^2 v}{3}$, ki je v $\text{cm}^3$ in ne pove, koliko je papirja.
> $s = \sqrt{10^2 + 24^2} = 26\,\text{cm}$, plašč $\pi \cdot 10 \cdot 26 = 260\pi \approx 817\,\text{cm}^2$.

:::simboli
r | polmer osnovne ploskve | | |
v | višina stožca | | | pravokotna na osnovno ploskev
s | stranica stožca | s = \sqrt{r^2 + v^2} | | hipotenuza trikotnika z $v$ in $r$
\mathrm{pl} | ploščina plašča | \mathrm{pl} = \pi r s | | razgrnjen plašč je krožni izsek
\alpha | središčni kot razgrnjenega plašča | \alpha = \frac{r}{s} \cdot 360^\circ | ° |
P | površina stožca | P = \pi r^2 + \pi r s | | osnovna ploskev in plašč
V | prostornina stožca | V = \frac{\pi r^2 v}{3} | |
O | ploščina osnovne ploskve | O = \pi r^2 | |
l | dolžina loka izseka | l = \frac{\alpha}{360^\circ} \cdot 2\pi s | | enaka obsegu $2\pi r$
:::
