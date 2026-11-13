---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Na nogometnem igrišču je med tekmo $23$ ljudi: $22$ igralcev in sodnik. Leto ima $365$ dni. Kaj misliš, kolikšna je verjetnost, da imata vsaj dva od njih rojstni dan na isti dan?

Večina ugane nekaj odstotkov, saj je $23$ veliko manj kot $365$. Pravi odgovor je **več kot $50\,\%$**. Približno na vsaki drugi tekmi sta torej na igrišču dva »dvojčka po rojstnem dnevu«.

Za ta odgovor potrebuješ snov dveh poglavij hkrati: kombinatoriko za štetje in verjetnost za nasprotni dogodek. Natanko takšne so maturitetne naloge. Redko piše, iz katerega poglavja so; pogosto ena naloga poveže dve ali tri. Kdor zna prepoznati, katero orodje naloga kliče, reši tudi naloge, ki jih še ni videl.

## Razlaga

**Rešimo najprej paradoks z igrišča.** Vprašanje »vsaj dva imata isti dan« ima veliko možnosti: dva para, trije na isti dan, … Nasprotni dogodek je en sam: **vsi imajo različne rojstne dneve**. Računamo ga po korakih, človeka za človekom, in verjetnosti zaporednih korakov množimo:

- prvi ima lahko kateri koli dan: $\frac{365}{365}$,
- drugi mora imeti drugačen dan: $\frac{364}{365}$,
- tretji drugačen od obeh: $\frac{363}{365}$,
- … triindvajseti drugačen od $22$ dni: $\frac{343}{365}$.

Produkt vseh $23$ ulomkov je približno $0{,}493$. Torej je

$$P(\text{vsaj dva isti dan}) \approx 1 - 0{,}493 = 0{,}507$$

Zakaj tako veliko? Ker ne primerjamo enega igralca z ostalimi, ampak vsak par. Parov je $\binom{23}{2} = 253$, in vsak par je nova priložnost za ujemanje.

:::premisli
Na igrišče pride še rezervni vratar, ljudi je $24$. Napovej: se verjetnost poveča za malo ali za veliko? Zakaj?
---
Poveča se, a za malo (na približno $54\,\%$). Novi človek prinese $23$ novih parov, kar je le dobrih $9\,\%$ več parov kot prej ($253$).
:::

**Od primera k pravilu.** Kaj smo pravzaprav naredili? Štirje koraki so splošni:

1. **Ključna beseda.** »Vsaj« je skoraj vedno znak za nasprotni dogodek: $P(A) = 1 - P(\overline{A})$.
2. **Prevod v orodje.** Nasprotni dogodek smo prešteli z variacijami: ugodnih razporedov je $V_{365}^{23}$, vseh pa $365^{23}$ (dnevi se lahko ponavljajo).
3. **Račun.** Produkt ulomkov je isti račun kot $\frac{V_{365}^{23}}{365^{23}}$, le po delih.
4. **Smiselnost.** Rezultat je med $0$ in $1$. Ker je presenetljiv, smo ga podprli še s štetjem parov.

Isti štirje koraki delujejo pri vsaki mešani nalogi. Najtežji je drugi: iz besed naloge prepoznati orodje. Pomaga ti ta preglednica.

| v besedilu piše | orodje | zapis |
|---|---|---|
| največ, najmanj, najvišja točka | odvod $= 0$ | $f'(x) = 0$ |
| naklon tangente, hitrost spreminjanja | odvod v točki | $k = f'(x_0)$ |
| ploščina pod grafom, pot iz hitrosti | določeni integral | $\int_a^b f(x)\,dx$ |
| na koliko načinov, koliko tekem | kombinatorika | $n!$, $V_n^k$, $\binom{n}{k}$ |
| vsaj eden, vsaj dva | nasprotni dogodek | $1 - P(\overline{A})$ |
| vsako leto za $p\,\%$ | geometrijsko zaporedje | $a_n = a_1 q^{n-1}$ |
| tipična vrednost, razpršenost | statistika | $\bar x$, $\mathrm{Me}$, $\sigma$ |

Večkoračna naloga je **veriga** takih orodij. Primer: »Žoga leti po tiru $h(t)$. Kdaj je najvišje in kdaj pade na tla?« Prvi del je odvod, drugi kvadratna enačba iz 1. letnika. Vsak člen verige reši posebej in rezultat prvega zapiši, preden začneš drugega.

:::premisli
Naloga sprašuje: »Kolikšna je največja hitrost kolesarja in kolikšno pot prevozi do ustavitve?« Dana je hitrost $v(t)$. Kateri dve orodji potrebuješ in zakaj ne istega dvakrat?
---
Za največjo hitrost odvod $v'(t) = 0$, ker iščemo maksimum funkcije $v$. Za pot integral $\int v(t)\,dt$, ker je pot ploščina pod grafom hitrosti. Prvo vprašanje je o vrednosti funkcije, drugo o vsoti njenih vrednosti skozi čas.
:::

V simulaciji spodaj (Zbirka simulacij za maturo) odpri Odvod in poišči točko, kjer je tangenta vodoravna. Opazi, da je tam odvod enak $0$, funkcija pa ima vrh ali dno; nato v Integralu opazuj, kako ploščino pod grafom vse bolje približajo pravokotniki.

## Rešeni primeri

### Primer 1 (lažji): trije prosti meti

Košarkarica zadene prosti met z verjetnostjo $0{,}8$, meti so neodvisni. Izvede tri mete. Kolikšna je verjetnost, da vsaj enkrat zgreši?

**Podatki:** $P(\text{zadetek}) = 0{,}8$; $3$ neodvisni meti
**Iščemo:** $P(\text{vsaj en zgrešen})$

:::formula
$P(A) = 1 - P(\overline{A})$; pri neodvisnih dogodkih $P(A \cdot B) = P(A) \cdot P(B)$
:::

**Rešitev:**

1. Ključna beseda »vsaj« kliče nasprotni dogodek: vsi trije meti so zadetki.
2. Meti so neodvisni, zato množimo: $0{,}8 \cdot 0{,}8 \cdot 0{,}8 = 0{,}512$.
3. $P(\text{vsaj en zgrešen}) = 1 - 0{,}512 = 0{,}488$.
4. Odgovor: verjetnost, da vsaj enkrat zgreši, je $0{,}488$, skoraj polovica.

### Primer 2: let žoge

Vratar izbije žogo. Njena višina je $h(t) = -5t^2 + 10t + 1$, kjer je $t$ čas v sekundah in $h$ višina v metrih. Kdaj in kako visoko je žoga najvišje? Kdaj pade na tla?

**Podatki:** $h(t) = -5t^2 + 10t + 1$ ($h$ v m, $t$ v s, $t \ge 0$)
**Iščemo:** čas in višino vrha, čas padca

:::formula
vrh: $h'(t) = 0$; padec: $h(t) = 0$, rešitev kvadratne enačbe $t = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
:::

**Rešitev:**

1. Odvajamo: $h'(t) = -10t + 10$.
2. Vrh je tam, kjer se žoga neha dvigovati: $-10t + 10 = 0$, torej $t = 1\,\mathrm{s}$.
3. Višino dobimo z vstavljanjem v $h$, ne v $h'$: $-5 \cdot 1^2 + 10 \cdot 1 + 1 = 6$, torej $6\,\mathrm{m}$.
4. Na tleh je $h(t) = 0$: $-5t^2 + 10t + 1 = 0$, kar pomnožimo z $-1$ v $5t^2 - 10t - 1 = 0$.
5. Diskriminanta: $D = 100 + 20 = 120$, torej $t = \dfrac{10 \pm \sqrt{120}}{10}$.
6. Negativna rešitev ni smiselna (čas pred udarcem), ostane $t \approx 2{,}10\,\mathrm{s}$.
7. Odgovor: žoga je najvišje po $1\,\mathrm{s}$, na višini $6\,\mathrm{m}$, na tla pade po približno $2{,}1\,\mathrm{s}$.

### Primer 3 (težji): kolesarski šprint

Kolesar na treningu spelje, pospešuje in nato zavira do ustavitve. Hitrost je $v(t) = 3t - 0{,}25t^2$ (v $\mathrm{m/s}$) za $0 \le t \le 12\,\mathrm{s}$. Kolikšna je največja hitrost in kolikšno pot prevozi?

**Podatki:** $v(t) = 3t - 0{,}25t^2$, $v$ v $\mathrm{m/s}$, $t$ v $\mathrm{s}$, $0 \le t \le 12$
**Iščemo:** $v_{\max}$ in pot $s$

:::formula
maksimum: $v'(t) = 0$; pot: $s = \int_{0}^{12} v(t)\,dt$
:::

**Rešitev:**

1. Prvi člen verige je odvod: $v'(t) = 3 - 0{,}5t$.
2. $3 - 0{,}5t = 0$ da $t = 6\,\mathrm{s}$. Pred tem je $v' > 0$ (pospešuje), po tem $v' < 0$ (zavira), zato je to maksimum.
3. $v_{\max} = 3 \cdot 6 - 0{,}25 \cdot 36 = 9$, torej $9\,\mathrm{m/s}$.
4. Drugi člen verige je integral. Primitivna funkcija je $1{,}5t^2 - \dfrac{t^3}{12}$.
5. Po Newton-Leibnizovi formuli: $1{,}5 \cdot 144 - \dfrac{1728}{12} = 216 - 144 = 72$, spodnja meja da $0$.
6. Preverimo smiselnost: $v(12) = 36 - 36 = 0$, kolesar se res ustavi.
7. Odgovor: največja hitrost je $9\,\mathrm{m/s}$ (po $6\,\mathrm{s}$), kolesar prevozi $72\,\mathrm{m}$.

### Primer 4 – zdaj ti

Klub je v prvi sezoni prodal $2000$ sezonskih vstopnic, vsako naslednjo sezono $5\,\%$ več. Koliko jih proda v 6. sezoni in koliko v vseh šestih skupaj?

**Podatki:** $a_1 = 2000$, rast $5\,\%$ na sezono, $n = 6$
**Iščemo:** $a_6$ in $S_6$

:::formula
$a_n = a_1 q^{n-1}$, $S_n = a_1 \dfrac{q^n - 1}{q - 1}$
:::

**Rešitev:**

1. »Vsako sezono za $5\,\%$« pomeni geometrijsko zaporedje s $q = 1{,}05$.
2. Šesti člen: $a_6 = 2000 \cdot 1{,}05^5 \approx 2553$ vstopnic (eksponent je $n - 1 = 5$).
3. Vsoto izračunaj sam, nato preveri:

:::premisli
Koliko je $S_6 = 2000 \cdot \dfrac{1{,}05^6 - 1}{0{,}05}$?
---
$S_6 \approx 13\,604$ vstopnic v šestih sezonah.
:::

## Pogoste napake

- **Seštevanje verjetnosti pri »vsaj eden«.** Za »vsaj en zgrešen od treh metov« vsota $0{,}2 + 0{,}2 + 0{,}2$ ni prav, ker dogodki niso nezdružljivi (lahko zgreši dvakrat). Pri štirih metih z verjetnostjo zgrešitve $0{,}3$ bi dobil celo več kot $1$. Računaj z nasprotnim dogodkom.
- **Odgovor je čas namesto višine.** Iz $h'(t) = 0$ dobiš, *kdaj* je vrh. Vprašanje »kako visoko« zahteva še $h(t)$. Na koncu preberi vprašanje še enkrat.
- **Kombinacije namesto variacij pri ligi.** Če vsaka ekipa igra z vsako doma in v gosteh, je vrstni red pomemben: $V_{10}^2 = 90$ tekem, ne $\binom{10}{2} = 45$.
- **Eksponent $n$ namesto $n - 1$.** V $a_n = a_1 q^{n-1}$ je prvi člen že $a_1$. Za 6. sezono je rast petkrat, ne šestkrat.
- **Integral namesto prevožene poti.** Če hitrost kdaj postane negativna, integral odšteje pot nazaj. Za prevoženo pot razdeli interval pri ničli in seštej absolutne vrednosti.

## Povzetek

- Mešana naloga je veriga orodij iz različnih letnikov; vsak člen reši in zapiši posebej.
- Postopek: ključna beseda → orodje → račun → preverba smiselnosti.
- »Vsaj« → nasprotni dogodek $1 - P(\overline{A})$.
- »Največ, najmanj« → $f'(x) = 0$, nato vrednost funkcije v tej točki.
- »Pot iz hitrosti, ploščina« → določeni integral.
- »Na koliko načinov« → osnovni izrek, $n!$, $V_n^k$, $\binom{n}{k}$; vprašaj, ali je vrstni red pomemben.
- »Vsako leto za $p\,\%$« → $a_n = a_1 q^{n-1}$ in $S_n = a_1 \frac{q^n - 1}{q - 1}$.
- Paradoks rojstnih dni: pri $23$ ljudeh je verjetnost skupnega rojstnega dne približno $0{,}507$.

## Drugače: Z analogijo

Trener ne izumi nove taktike za vsako akcijo nasprotnika. Pozna nekaj vzorcev (protinapad, prekršek pred kazenskim prostorom, kot) in za vsakega ima pripravljeno potezo. Ko prepozna vzorec, ve, kaj narediti.

Maturitetna naloga je ista igra. »Najvišja točka« je protinapad: odgovor je vedno $f'(x) = 0$. »Vsaj en zadetek« je kot: odgovor je vedno nasprotni dogodek. Naloga se zdi nova, ker je oblečena v drugo zgodbo (žoga, kolesar, vstopnice), vzorec pod njo pa je star. Preglednica v razlagi je tvoja knjiga potez.

## Drugače: Bolj natančno

Za $n$ ljudi je verjetnost, da imajo vsi različne rojstne dneve,

$$P(\overline{A}) = \frac{V_{365}^{n}}{365^{n}}$$

pri čemer predpostavimo, da je vsak od $365$ dni enako verjeten (29. februar izpustimo). Številke rastejo hitreje, kot bi pričakoval:

| $n$ | $P(\text{vsaj dva isti dan})$ |
|---|---|
| $10$ | $0{,}117$ |
| $23$ | $0{,}507$ |
| $30$ | $0{,}706$ |
| $50$ | $0{,}970$ |

Razlog je število parov $\binom{n}{2} = \frac{n(n-1)}{2}$, ki raste s kvadratom $n$. Pri $23$ ljudeh je pričakovano število parov z istim dnem $\frac{253}{365} \approx 0{,}69$, kar je že blizu $1$. Paradoks torej ni napaka v računu, ampak napaka v intuiciji: ljudje štejemo osebe, verjetnost pa šteje pare.

## Preveri se

? V nalogi piše: »Izračunaj naklon tangente na tir žoge $h(t)$ v trenutku $t = 1$.« Kaj je naklon tangente?
- Višina žoge $h(1)$.
~ $h(1)$ je točka na grafu, skozi katero gre tangenta, ne njen naklon.
+ Vrednost odvoda $h'(1)$.
- Ploščina pod grafom $h$ od $0$ do $1$.
~ Ploščina je integral, ta meri vsoto, ne strmine v eni točki.
> Naklon tangente v točki $x_0$ je $k = f'(x_0)$: odvod meri, kako strmo graf raste v tem trenutku.

? Naloga sprašuje po najvišji točki tira žoge $h(t)$. Kateri vrstni red korakov je pravilen?
- Vstavi $t$ v $h(t)$, odvajaj, izenači z $0$.
~ Ne veš še, kateri $t$ vstaviti; ta pride šele iz $h'(t) = 0$.
+ Odvajaj, izenači $h'(t)$ z $0$, reši za $t$, vstavi $t$ v $h(t)$.
- Izenači $h(t)$ z $0$, reši za $t$, vstavi $t$ v $h'(t)$.
~ $h(t) = 0$ da trenutek, ko je žoga na tleh, ne vrh.
> Odvod je na vrhu $0$, zato iz $h'(t) = 0$ dobiš čas vrha, iz $h(t)$ pa njegovo višino.

? V ligi vsaka ekipa igra z vsako doma in v gosteh. Kaj se zgodi s številom tekem, če se število ekip poveča z $10$ na $20$?
- Podvoji se (z $90$ na $180$).
~ Število tekem ni sorazmerno s številom ekip: vsaka nova ekipa igra z vsemi, tudi z novimi.
+ Poveča se približno štirikrat (z $90$ na $380$).
- Poveča se za $10$ tekem.
~ Vsaka od $10$ novih ekip odigra več kot eno tekmo, kar $2 \cdot 19 = 38$ tekem.
> $V_{20}^2 = 20 \cdot 19 = 380$, $V_{10}^2 = 10 \cdot 9 = 90$. Število tekem raste približno s kvadratom števila ekip.

? Napadalec zadene enajstmetrovko z verjetnostjo $0{,}7$. Izvede dve neodvisni. Kolikšna je verjetnost, da zadene vsaj eno?
- $1{,}4$
~ To je $0{,}7 + 0{,}7$. Verjetnost ne more biti večja od $1$; dogodka nista nezdružljiva.
- $0{,}49$
~ To je verjetnost, da zadene **obe**, ne vsaj eno.
+ $0{,}91$
> Nasprotni dogodek: zgreši obe, $0{,}3 \cdot 0{,}3 = 0{,}09$. Torej $1 - 0{,}09 = 0{,}91$.

? Višina žoge je $h(t) = -5t^2 + 15t$ ($h$ v m, $t$ v s). Kolikšna je največja višina?
- $1{,}5\,\mathrm{m}$
~ $1{,}5$ je čas vrha v sekundah iz $h'(t) = -10t + 15 = 0$. Vstavi ga še v $h(t)$.
- $22{,}5\,\mathrm{m}$
~ To je le $15 \cdot 1{,}5$; pozabil si člen $-5t^2$.
+ $11{,}25\,\mathrm{m}$
> $h'(t) = -10t + 15 = 0$ da $t = 1{,}5\,\mathrm{s}$; $h(1{,}5) = -11{,}25 + 22{,}5 = 11{,}25\,\mathrm{m}$.

:::simboli
P | verjetnost | | – |
A | dogodek | | | pri rojstnih dnevih: vsaj dva imata isti dan
\overline{A} | nasprotni dogodek | P(\overline{A}) = 1 - P(A) | | pri rojstnih dnevih: vsi imajo različne dneve
V_n, V_{365} | variacije | | | $V_n^k = \frac{n!}{(n-k)!}$, vrstni red je pomemben
B | dogodek | | |
n | število ljudi oziroma elementov ali zaporedna številka člena | | |
f | funkcija | | |
x, x_0 | spremenljivka, izbrana točka | | |
k | naklon tangente ali število izbranih elementov | | | $k = f'(x_0)$; v $V_n^k$ število izbranih
a, b, c | meji integrala; koeficienti kvadratne enačbe | | |
d | znak diferenciala v $dx$, $dt$ | | |
h | višina žoge | | m |
t | čas | | s |
v | hitrost kolesarja | v = s' | m/s |
s | pot | s = \int v(t)\,dt | m |
a_1 | prvi člen zaporedja | | | vstopnice v 1. sezoni
a_n, a_6 | $n$-ti člen zaporedja | a_n = a_1 q^{n-1} | |
q | količnik geometrijskega zaporedja | | – | $q = 1{,}05$ pri rasti $5\,\%$
S_n, S_6 | vsota prvih $n$ členov | S_n = a_1 \frac{q^n - 1}{q - 1} | |
p | odstotek rasti | | \% |
D | diskriminanta | D = b^2 - 4ac | |
:::
