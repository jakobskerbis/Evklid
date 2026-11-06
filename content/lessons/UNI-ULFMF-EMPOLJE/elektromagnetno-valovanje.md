---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 2010 je japonska vesoljska agencija poslala proti Veneri sondo IKAROS, ki za pospeševanje ni porabljala goriva: razprla je tanko jadro s ploščino okoli $200\,\mathrm{m^2}$ in **sončna svetloba jo je potiskala**. Svetloba, ki nima mase, prenaša gibalno količino in pritiska na ploskev, ki jo odbije. Pritisk je drobcen – na Zemljini oddaljenosti od Sonca okoli $9\,\mathrm{\mu Pa}$ na zrcalno ploskev –, a v vesolju, kjer ni trenja, je dovolj, da sonda pospešuje mesece.

To je posledica Maxwellovih enačb, ki jih že poznaš: iz njih sledi, da se električno in magnetno polje lahko širita sama, brez nabojev in tokov, kot **elektromagnetno valovanje**. Valovanje prenaša energijo (opiše jo **Poyntingov vektor**) in gibalno količino. Na meji dveh snovi se deloma odbije in deloma lomi – zato se v izložbenem steklu vidiš, zato svetloba ostane ujeta v optičnem vlaknu in zato polarizacijska očala ugasnejo blesk z mokre ceste. V laboratoriju vse to izmeriš z laserjem, polarizatorjem in fotodiodo.

## Razlaga

### Slika ravnega vala

Predstavljaj si val, ki potuje v smeri osi $z$. V vsaki točki na osi narišemo dve puščici:

```
     x (E)                     E največji, B največji
     ^       _               _
     |      / \             / \
  ---+-----/---\-----------/---\--------> z   (smer širjenja)
     |          \_       _/     \_
     |            \_____/
     y (B) kaže iz ravnine v isti fazi kot E
```

- Električno polje $\vec{E}$ niha v smeri $x$, magnetno $\vec{B}$ v smeri $y$, val potuje v smeri $z$: vsi trije so med seboj pravokotni. Valovanje je **transverzalno**.
- $\vec{E}$ in $\vec{B}$ nihata **v fazi**: kjer je eno največje, je največje tudi drugo.
- Smer širjenja kaže $\vec{E}\times\vec{B}$.
- Razmerje velikosti je v vsaki točki enako, $B = E/c$.

Ta slika je vse, kar si moraš zapomniti; zdaj jo izpeljemo iz Maxwellovih enačb.

### Valovna enačba

V praznem prostoru brez nabojev in tokov so Maxwellove enačbe

$$\nabla\cdot\vec{E} = 0, \quad \nabla\cdot\vec{B} = 0, \quad \nabla\times\vec{E} = -\frac{\partial\vec{B}}{\partial t}, \quad \nabla\times\vec{B} = \mu_0\varepsilon_0\frac{\partial\vec{E}}{\partial t}.$$

**Izpeljava.** Na tretjo enačbo delujemo z rotorjem in upoštevamo $\nabla\times(\nabla\times\vec{E}) = \nabla(\nabla\cdot\vec{E}) - \nabla^2\vec{E} = -\nabla^2\vec{E}$ (ker je $\nabla\cdot\vec{E} = 0$). Na desni zamenjamo vrstni red odvajanja in vstavimo četrto enačbo:

$$\nabla^2\vec{E} = \mu_0\varepsilon_0\frac{\partial^2\vec{E}}{\partial t^2}.$$

Enako dobimo za $\vec{B}$. To je **valovna enačba** s hitrostjo

$$c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} \approx 2{,}998 \cdot 10^8\,\mathrm{m/s}.$$

Da je izračunana hitrost enaka izmerjeni hitrosti svetlobe, je bil odločilni dokaz, da je svetloba elektromagnetno valovanje. V snovi z relativno dielektričnostjo $\varepsilon_r$ in permeabilnostjo $\mu_r$ je hitrost $v = c/n$ z **lomnim količnikom** $n = \sqrt{\varepsilon_r\mu_r}$; za nemagnetne snovi $n \approx \sqrt{\varepsilon_r}$ (pri frekvenci svetlobe).

### Ravni val

**Definicija.** **Ravni harmonični val**, ki potuje v smeri $z$ in je linearno polariziran v smeri $x$, je

$$\vec{E}(z, t) = E_0\cos(kz - \omega t)\,\vec{e}_x, \qquad \vec{B}(z, t) = B_0\cos(kz - \omega t)\,\vec{e}_y,$$

kjer je $k = 2\pi/\lambda$ valovno število in $\omega = 2\pi\nu$ krožna frekvenca. Vstavitev v valovno enačbo da $\omega = ck$, torej $c = \lambda\nu$.

**Izrek.** Za ravni val v praznem prostoru velja: $\vec{E} \perp \vec{k}$, $\vec{B} \perp \vec{k}$, $\vec{B} = \frac{1}{\omega}\vec{k}\times\vec{E}$ in zato $B_0 = E_0/c$.

**Dokaz.** Za $\vec{E} = \vec{E}_0\cos(\vec{k}\cdot\vec{r} - \omega t)$ je $\nabla\cdot\vec{E} = -\vec{k}\cdot\vec{E}_0\sin(\dots) = 0$, torej $\vec{k}\cdot\vec{E}_0 = 0$; enako za $\vec{B}$. Iz $\nabla\times\vec{E} = -\partial\vec{B}/\partial t$: levo $-\vec{k}\times\vec{E}_0\sin(\dots)$, desno $-\omega\vec{B}_0\sin(\dots)$, torej $\vec{B}_0 = \vec{k}\times\vec{E}_0/\omega$. Ker je $\vec{k} \perp \vec{E}_0$, je $B_0 = kE_0/\omega = E_0/c$. $\square$

Smer, v kateri niha $\vec{E}$, je **polarizacija** vala. Naravna svetloba je mešanica vseh smeri (nepolarizirana); polarizator prepusti le eno.

:::premisli
Ali bi lahko obstajal elektromagnetni val v praznem prostoru, pri katerem bi $\vec{E}$ nihal v smeri širjenja (vzdolžni val)? Kateri Maxwellovi enačbi bi nasprotoval?
---
Ne. Pri $\vec{E} = E_0\cos(kz - \omega t)\,\vec{e}_z$ bi bil $\nabla\cdot\vec{E} = -kE_0\sin(\dots) \neq 0$, kar nasprotuje Gaussovemu zakonu brez nabojev ($\nabla\cdot\vec{E} = 0$). Elektromagnetni val v praznem prostoru je zato vedno transverzalen.
:::

### Energija in Poyntingov vektor

Gostota energije elektromagnetnega polja je

$$w = \frac{1}{2}\varepsilon_0E^2 + \frac{1}{2\mu_0}B^2.$$

Pri ravnem valu je $B = E/c$ in $1/(\mu_0c^2) = \varepsilon_0$, zato sta oba dela enaka in $w = \varepsilon_0E^2$: polovica energije je v električnem, polovica v magnetnem polju.

**Definicija.** **Poyntingov vektor**

$$\vec{S} = \frac{1}{\mu_0}\vec{E}\times\vec{B}$$

kaže smer prenosa energije, njegova velikost pa je moč, ki teče skozi enoto ploskve, pravokotne nanj (enota $\mathrm{W/m^2}$).

**Izrek (Poyntingov izrek).** Za vsak prostor $V$ z robom $\partial V$ velja

$$-\frac{\mathrm{d}}{\mathrm{d}t}\int_V w\,\mathrm{d}V = \oint_{\partial V}\vec{S}\cdot\mathrm{d}\vec{A} + \int_V\vec{j}\cdot\vec{E}\,\mathrm{d}V:$$

energija polja v $V$ se zmanjša za tisto, kar steče skozi rob, in za delo polja na tokovih ($\vec{j}\cdot\vec{E}$ je Joulova moč na prostornino). Izpelješ ga iz Maxwellovih enačb in identitete $\nabla\cdot(\vec{E}\times\vec{B}) = \vec{B}\cdot(\nabla\times\vec{E}) - \vec{E}\cdot(\nabla\times\vec{B})$.

Za ravni val je $S = \varepsilon_0cE_0^2\cos^2(kz - \omega t)$. Detektorji merijo časovno povprečje, **gostoto energijskega toka** (intenziteto):

$$I = \langle S\rangle = \frac{1}{2}\varepsilon_0cE_0^2 = \frac{E_0^2}{2\mu_0c},$$

ker je povprečje $\cos^2$ enako $1/2$. Intenziteta je sorazmerna s **kvadratom** amplitude.

**Gibalna količina.** Val z energijo $W$ nosi gibalno količino $W/c$. Zato na ploskev, ki ga pravokotno vpije, deluje **tlak sevanja** $p = I/c$, na zrcalo, ki ga odbije nazaj, pa $p = 2I/c$.

| | Sonce na Zemlji | laserski kazalnik |
|---|---|---|
| $I$ | $1361\,\mathrm{W/m^2}$ | okoli $1600\,\mathrm{W/m^2}$ |
| $E_0$ | okoli $1{,}0\,\mathrm{kV/m}$ | okoli $1{,}1\,\mathrm{kV/m}$ |
| tlak (vpito) | $4{,}5\,\mathrm{\mu Pa}$ | $5{,}3\,\mathrm{\mu Pa}$ |

### Odboj in lom

Val pade iz snovi z lomnim količnikom $n_1$ na ravno mejo s snovjo $n_2$ pod vpadnim kotom $\alpha$ (merjenim od pravokotnice). Nastaneta odbiti val pod kotom $\alpha'$ in lomljeni pod kotom $\beta$.

**Izrek (odbojni in lomni zakon).** Velja $\alpha' = \alpha$ in

$$n_1\sin\alpha = n_2\sin\beta.$$

Vpadni, odbiti in lomljeni žarek ter pravokotnica ležijo v isti ravnini.

**Dokaz.** Na meji morajo biti tangencialne komponente $\vec{E}$ (in $\vec{H}$) zvezne v vsaki točki meje in ob vsakem času. To je mogoče le, če imajo vsi trije valovi na meji enako frekvenco in enako fazo $\vec{k}\cdot\vec{r}$ za vse točke meje. Komponente valovnih vektorjev vzdolž meje so zato enake: $k_1\sin\alpha = k_1\sin\alpha' = k_2\sin\beta$. Ker je $k = n\omega/c$, sledita $\alpha' = \alpha$ in $n_1\sin\alpha = n_2\sin\beta$. $\square$

**Koliko se odbije.** Delež odbite intenzitete (odbojnost $R$) da Fresnelova formula; pri pravokotnem vpadu je

$$R = \left(\frac{n_1 - n_2}{n_1 + n_2}\right)^2.$$

Za mejo zrak–steklo ($n = 1{,}50$) je $R = 0{,}04$: steklo odbije $4\,\%$ svetlobe na vsaki površini.

**Totalni odboj.** Pri prehodu v optično redkejšo snov ($n_1 > n_2$) lomni zakon nima rešitve, ko bi bil $\sin\beta > 1$. Pri vpadnih kotih nad **mejnim kotom**

$$\sin\alpha_m = \frac{n_2}{n_1}$$

se vsa svetloba odbije.

**Brewstrov kot.** Pri vpadnem kotu $\tan\alpha_B = n_2/n_1$ sta odbiti in lomljeni žarek pravokotna, odbije pa se le svetloba, polarizirana pravokotno na vpadno ravnino. Odbita svetloba je tedaj popolnoma polarizirana.

:::premisli
Žarek gre iz vode ($n = 1{,}33$) v zrak. Postopoma povečuješ vpadni kot. Kaj se dogaja z lomljenim žarkom in z odbito svetlobo, ko se bližaš $48{,}8^\circ$?
---
Lomni kot raste hitreje od vpadnega in se bliža $90^\circ$; lomljeni žarek je vse šibkejši in drsi ob gladini. Odbita svetloba je vse močnejša. Pri $48{,}8^\circ$ ($\sin\alpha_m = 1/1{,}33$) lomljenega žarka ni več: nad mejnim kotom se vsa svetloba odbije nazaj v vodo.
:::

## Rešeni primeri

### Primer 1 (lažji)

Laserski kazalnik z močjo $5{,}0\,\mathrm{mW}$ ima žarek s premerom $2{,}0\,\mathrm{mm}$. Predpostavi, da je intenziteta po prerezu enakomerna. Kolikšne so intenziteta, amplituda električnega in magnetnega polja ter tlak, s katerim žarek pritiska na črno ploskev?

**Podatki:** $P = 5{,}0\,\mathrm{mW}$, $d = 2{,}0\,\mathrm{mm}$, $\varepsilon_0 = 8{,}854 \cdot 10^{-12}\,\mathrm{As/(Vm)}$, $c = 2{,}998 \cdot 10^8\,\mathrm{m/s}$
**Iščemo:** $I$, $E_0$, $B_0$, $p$

:::formula
$I = \dfrac{P}{\pi d^2/4}$; $I = \tfrac{1}{2}\varepsilon_0cE_0^2$; $B_0 = \dfrac{E_0}{c}$; $p = \dfrac{I}{c}$
:::

**Rešitev:**

1. Prerez žarka: $\pi(1{,}0 \cdot 10^{-3}\,\mathrm{m})^2 \approx 3{,}14 \cdot 10^{-6}\,\mathrm{m^2}$.
2. Intenziteta: $I = 5{,}0 \cdot 10^{-3}/3{,}14 \cdot 10^{-6}\,\mathrm{W/m^2} \approx 1590\,\mathrm{W/m^2}$, malo več od sončne.
3. Amplituda: $E_0 = \sqrt{2I/(\varepsilon_0c)} = \sqrt{2 \cdot 1590/(8{,}854 \cdot 10^{-12} \cdot 2{,}998 \cdot 10^8)}\,\mathrm{V/m} \approx 1100\,\mathrm{V/m}$.
4. Magnetno polje: $B_0 = 1100/2{,}998 \cdot 10^8\,\mathrm{T} \approx 3{,}7 \cdot 10^{-6}\,\mathrm{T}$, okoli desetina Zemljinega polja.
5. Tlak na črno ploskev: $p = 1590/2{,}998 \cdot 10^8\,\mathrm{Pa} \approx 5{,}3 \cdot 10^{-6}\,\mathrm{Pa}$.
6. Odgovor: $I \approx 1{,}6\,\mathrm{kW/m^2}$, $E_0 \approx 1{,}1\,\mathrm{kV/m}$, $B_0 \approx 3{,}7\,\mathrm{\mu T}$, $p \approx 5{,}3\,\mathrm{\mu Pa}$. Kazalnik je nevaren za oko zaradi intenzitete, ne zaradi moči: leča ga zbere v še mnogo manjšo piko.

### Primer 2

Sončna svetloba ima nad ozračjem intenziteto $1361\,\mathrm{W/m^2}$. Sončno jadro s površino $200\,\mathrm{m^2}$ je pravokotno na žarke in jih popolnoma odbije. Kolikšni sta amplituda električnega polja sončne svetlobe in sila na jadro? Koliko časa bi trajalo, da bi jadro s sondo, skupaj $300\,\mathrm{kg}$, doseglo hitrost $1\,\mathrm{m/s}$, če bi bila sila stalna?

**Podatki:** $I = 1361\,\mathrm{W/m^2}$, $A = 200\,\mathrm{m^2}$, popoln odboj pravokotno, $m = 300\,\mathrm{kg}$, $\Delta v = 1\,\mathrm{m/s}$, $c = 2{,}998 \cdot 10^8\,\mathrm{m/s}$, $\varepsilon_0 = 8{,}854 \cdot 10^{-12}\,\mathrm{As/(Vm)}$
**Iščemo:** $E_0$, $F$, $t$

:::formula
$E_0 = \sqrt{\dfrac{2I}{\varepsilon_0c}}$; $p = \dfrac{2I}{c}$; $F = pA$; $t = \dfrac{m\,\Delta v}{F}$
:::

**Rešitev:**

1. $E_0 = \sqrt{2 \cdot 1361/(8{,}854 \cdot 10^{-12} \cdot 2{,}998 \cdot 10^8)}\,\mathrm{V/m} \approx 1010\,\mathrm{V/m}$.
2. Odboj nazaj obrne gibalno količino, zato je tlak dvakrat večji kot pri vpijanju: $p = 2 \cdot 1361/2{,}998 \cdot 10^8\,\mathrm{Pa} \approx 9{,}08 \cdot 10^{-6}\,\mathrm{Pa}$.
3. Sila: $F = 9{,}08 \cdot 10^{-6} \cdot 200\,\mathrm{N} \approx 1{,}82 \cdot 10^{-3}\,\mathrm{N}$.
4. Čas: $t = 300 \cdot 1/1{,}82 \cdot 10^{-3}\,\mathrm{s} \approx 1{,}65 \cdot 10^5\,\mathrm{s}$, okoli dva dni.
5. Odgovor: $E_0 \approx 1{,}0\,\mathrm{kV/m}$, sila na jadro je okoli $1{,}8\,\mathrm{mN}$ (na Zemlji teža telesa z maso okoli $0{,}2\,\mathrm{g}$), sonda pa bi se v dveh dneh pospešila za $1\,\mathrm{m/s}$, v letu za okoli $190\,\mathrm{m/s}$.

### Primer 3 (težji)

Optično vlakno ima jedro z $n_1 = 1{,}48$ in plašč z $n_2 = 1{,}46$. (a) Kolikšen je mejni kot totalnega odboja na meji jedro–plašč? (b) Pod kolikšnim največjim kotom glede na os vlakna sme žarek vpasti iz zraka na čelno ploskev, da ostane ujet v jedru (numerična apertura)? (c) Kolikšen del svetlobe se pri pravokotnem vpadu odbije na čelni ploskvi?

**Podatki:** $n_1 = 1{,}48$, $n_2 = 1{,}46$, zunaj zrak $n_0 = 1{,}00$; čelna ploskev pravokotna na os
**Iščemo:** $\alpha_m$, največji vpadni kot $\theta_{max}$, odbojnost $R$

:::formula
$\sin\alpha_m = \dfrac{n_2}{n_1}$; lomni zakon na čelni ploskvi $n_0\sin\theta = n_1\sin\theta_1$ z $\theta_1 = 90^\circ - \alpha_m$; $R = \left(\dfrac{n_1 - n_0}{n_1 + n_0}\right)^2$
:::

**Rešitev:**

1. (a) $\sin\alpha_m = 1{,}46/1{,}48 \approx 0{,}9865$, torej $\alpha_m \approx 80{,}6^\circ$. Žarek mora na plašč vpadati zelo položno.
2. (b) V jedru oklepa žarek z osjo kot $\theta_1$, s pravokotnico na plašč pa $90^\circ - \theta_1$. Ujet je, če je $90^\circ - \theta_1 \geq \alpha_m$, torej $\theta_1 \leq 9{,}43^\circ$.
3. Lomni zakon na čelni ploskvi: $\sin\theta_{max} = n_1\sin\theta_{1,max} = n_1\cos\alpha_m = \sqrt{n_1^2 - n_2^2}$.
4. $\sqrt{1{,}48^2 - 1{,}46^2} = \sqrt{2{,}1904 - 2{,}1316} = \sqrt{0{,}0588} \approx 0{,}2425$. To je **numerična apertura**.
5. $\theta_{max} \approx \arcsin 0{,}2425 \approx 14{,}0^\circ$.
6. (c) $R = (0{,}48/2{,}48)^2 \approx 0{,}0375$; na čelni ploskvi se izgubi okoli $3{,}7\,\%$ svetlobe (enako še na izstopu).
7. Odgovor: mejni kot je $80{,}6^\circ$; vlakno ujame žarke do $14{,}0^\circ$ od osi (numerična apertura $0{,}24$); na vsaki čelni ploskvi se odbije okoli $3{,}7\,\%$.

### Primer 4 – zdaj ti

V praktikumu sončno svetlobo, odbito od vodne gladine ($n = 1{,}33$), opazuješ skozi polarizator. Pri katerem vpadnem kotu lahko polarizator odbito svetlobo popolnoma ugasne? Kolikšen je tedaj lomni kot?

**Podatki:** $n_1 = 1{,}00$ (zrak), $n_2 = 1{,}33$ (voda)
**Iščemo:** Brewstrov kot $\alpha_B$ in lomni kot $\beta$

:::formula
$\tan\alpha_B = \dfrac{n_2}{n_1}$; $n_1\sin\alpha = n_2\sin\beta$
:::

**Rešitev:**

1. Odbita svetloba je popolnoma polarizirana pri Brewstrovem kotu; polarizator, zasukan pravokotno na to smer, jo ugasne.
2. $\tan\alpha_B = 1{,}33$.
3. Zdaj ti: izračunaj $\alpha_B$ in $\beta$ ter preveri, ali sta odbiti in lomljeni žarek pravokotna.

:::premisli
Kolikšna sta $\alpha_B$ in $\beta$?
---
$\alpha_B = \arctan 1{,}33 \approx 53{,}1^\circ$. Iz lomnega zakona $\sin\beta = \sin 53{,}1^\circ/1{,}33 \approx 0{,}601$, torej $\beta \approx 36{,}9^\circ$. Vsota $53{,}1^\circ + 36{,}9^\circ = 90^\circ$: odbiti žarek oklepa z lomljenim pravi kot. ✓
:::

## Pogoste napake

- **Intenziteta sorazmerna z amplitudo.** $I \propto E_0^2$: dvakratna amplituda da štirikratno intenziteto.
- **Pozabljen faktor $\tfrac12$.** $\varepsilon_0cE_0^2$ je največja vrednost $S$, povprečje je pol manjše. Pri efektivni vrednosti $E_{ef} = E_0/\sqrt2$ pa je $I = \varepsilon_0cE_{ef}^2$.
- **Totalni odboj pri prehodu v gostejšo snov.** Totalni odboj je mogoč le pri prehodu v snov z **manjšim** lomnim količnikom.
- **$B$ in $E$ kot neodvisni polji.** V ravnem valu sta povezani, $B_0 = E_0/c$, in nihata v fazi; magnetnega polja ne računaš posebej.
- **Tlak sevanja vedno $I/c$.** Pri popolnem odboju nazaj je dvakrat večji, $2I/c$, ker se gibalna količina obrne.

## Povzetek

- Iz Maxwellovih enačb v praznem prostoru sledi valovna enačba s hitrostjo $c = 1/\sqrt{\mu_0\varepsilon_0}$; v snovi $v = c/n$.
- Ravni val: $\vec{E} \perp \vec{B} \perp \vec{k}$, nihata v fazi, $B_0 = E_0/c$, $\omega = ck$.
- Gostota energije $w = \varepsilon_0E^2$ (pol električne, pol magnetne); Poyntingov vektor $\vec{S} = \vec{E}\times\vec{B}/\mu_0$; intenziteta $I = \tfrac12\varepsilon_0cE_0^2$.
- Tlak sevanja $I/c$ (vpijanje), $2I/c$ (odboj).
- Odboj $\alpha' = \alpha$, lom $n_1\sin\alpha = n_2\sin\beta$; pri pravokotnem vpadu $R = ((n_1 - n_2)/(n_1 + n_2))^2$.
- Totalni odboj nad $\sin\alpha_m = n_2/n_1$; Brewstrov kot $\tan\alpha_B = n_2/n_1$.

## Za izpit

Znati moraš povedati:

- izpeljavo valovne enačbe iz Maxwellovih enačb v praznem prostoru in izraz za $c$;
- dokaz, da je ravni val transverzalen in da je $B_0 = E_0/c$;
- definicijo Poyntingovega vektorja, pomen Poyntingovega izreka in izpeljavo $I = \tfrac12\varepsilon_0cE_0^2$;
- izpeljavo odbojnega in lomnega zakona iz robnih pogojev (ujemanje faz);
- pogoje za totalni odboj in Brewstrov kot.

### Naloga 1

Natančno izpelji valovno enačbo za $\vec{E}$ iz Maxwellovih enačb v praznem prostoru. Pokaži, da $\vec{E} = E_0\cos(kz - \omega t)\,\vec{e}_x$ reši enačbo natanko tedaj, ko je $\omega = ck$, in iz Faradayevega zakona določi pripadajoče $\vec{B}$. Dokaži, da je gostota električne energije v vsaki točki enaka gostoti magnetne.

**Rešitev:**

1. $\nabla\times(\nabla\times\vec{E}) = -\frac{\partial}{\partial t}(\nabla\times\vec{B}) = -\mu_0\varepsilon_0\frac{\partial^2\vec{E}}{\partial t^2}$.
2. Leva stran: $\nabla(\nabla\cdot\vec{E}) - \nabla^2\vec{E} = -\nabla^2\vec{E}$, ker je $\nabla\cdot\vec{E} = 0$. Torej $\nabla^2\vec{E} = \mu_0\varepsilon_0\,\partial^2\vec{E}/\partial t^2$.
3. Vstavitev: $\nabla^2\vec{E} = -k^2\vec{E}$, $\partial^2\vec{E}/\partial t^2 = -\omega^2\vec{E}$; enačba velja, ko je $k^2 = \mu_0\varepsilon_0\omega^2$, torej $\omega = ck$.
4. Faraday: $\nabla\times\vec{E} = \frac{\partial E_x}{\partial z}\vec{e}_y = -kE_0\sin(kz - \omega t)\,\vec{e}_y = -\partial\vec{B}/\partial t$.
5. Integriramo po času: $\vec{B} = \frac{k}{\omega}E_0\cos(kz - \omega t)\,\vec{e}_y = \frac{E_0}{c}\cos(kz - \omega t)\,\vec{e}_y$ (stalni del, ki ni val, izpustimo).
6. Gostoti: $\frac{B^2}{2\mu_0} = \frac{E^2}{2\mu_0c^2} = \frac{\varepsilon_0E^2}{2}$, ker je $\mu_0\varepsilon_0c^2 = 1$.

### Naloga 2

Sončna svetloba pada na Zemljo z intenziteto $1361\,\mathrm{W/m^2}$ (nad ozračjem). Zemlja ima polmer $6{,}371 \cdot 10^6\,\mathrm{m}$ in maso $5{,}972 \cdot 10^{24}\,\mathrm{kg}$, Sonce maso $1{,}989 \cdot 10^{30}\,\mathrm{kg}$, razdalja med njima je $1{,}496 \cdot 10^{11}\,\mathrm{m}$, $G = 6{,}674 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$. Izračunaj skupno moč sončne svetlobe, ki pade na Zemljo, silo svetlobe na Zemljo (predpostavi, da je vsa vpita) in razmerje te sile do gravitacijske sile Sonca. Utemelji, zakaj je za majhna telesa (prašni delci, sončno jadro) razmerje lahko blizu $1$.

**Rešitev:**

1. Zemlja prestreže svetlobo s prerezom kroga: $P = \pi R^2I = \pi \cdot (6{,}371 \cdot 10^6)^2 \cdot 1361\,\mathrm{W} \approx 1{,}74 \cdot 10^{17}\,\mathrm{W}$.
2. Sila pri vpijanju: $F_s = P/c \approx 1{,}74 \cdot 10^{17}/2{,}998 \cdot 10^8\,\mathrm{N} \approx 5{,}8 \cdot 10^8\,\mathrm{N}$.
3. Gravitacijska sila: $F_g = GMm/r^2 \approx 6{,}674 \cdot 10^{-11} \cdot 1{,}989 \cdot 10^{30} \cdot 5{,}972 \cdot 10^{24}/(1{,}496 \cdot 10^{11})^2\,\mathrm{N} \approx 3{,}54 \cdot 10^{22}\,\mathrm{N}$.
4. Razmerje: $F_s/F_g \approx 1{,}6 \cdot 10^{-14}$.
5. Tlak sevanja je sorazmeren s prerezom ($\propto R^2$), gravitacija z maso ($\propto R^3$). Razmerje je zato $\propto 1/(\rho R)$: pri zelo majhnih ali zelo tankih telesih postane primerljivo z $1$. Oba prispevka padata kot $1/r^2$, zato razmerje od oddaljenosti od Sonca ni odvisno.
6. Odgovor: $P \approx 1{,}7 \cdot 10^{17}\,\mathrm{W}$, $F_s \approx 5{,}8 \cdot 10^8\,\mathrm{N}$, kar je le $1{,}6 \cdot 10^{-14}$ gravitacijske sile; sončni veter in tlak svetlobe pa odnašata prah in usmerjata repe kometov.

### Naloga 3

Iz robnih pogojev izpelji odbojnost pri pravokotnem vpadu na mejo dveh nemagnetnih dielektrikov. Izračunaj jo za mejo zrak–steklo ($n = 1{,}50$) in zrak–voda ($n = 1{,}33$) ter delež svetlobe, ki gre skozi stekleno ploščo (dve površini, absorpcijo in večkratne odboje zanemari). Kakšna naj bo enoplastna protiodbojna prevleka na steklu za valovno dolžino $550\,\mathrm{nm}$?

**Rešitev:**

1. Vpadni val $E_0$, odbiti $E_r$, prepuščeni $E_t$; pri pravokotnem vpadu sta $\vec{E}$ in $\vec{H}$ tangencialni.
2. Zveznost $E$: $E_0 + E_r = E_t$. Zveznost $H$ ($H = nE/(\mu_0c)$, odbiti val ima nasprotno smer): $n_1(E_0 - E_r) = n_2E_t$.
3. Iz obeh: $r = E_r/E_0 = (n_1 - n_2)/(n_1 + n_2)$; odbojnost $R = r^2$ (intenziteti sta v isti snovi, zato le kvadrat).
4. Zrak–steklo: $R = (0{,}50/2{,}50)^2 = 0{,}040$; zrak–voda: $R = (0{,}33/2{,}33)^2 \approx 0{,}020$.
5. Plošča: na vsaki površini gre skozi $96\,\%$, skupaj $0{,}96^2 \approx 0{,}922$, torej okoli $92\,\%$.
6. Prevleka: odboja na obeh mejah prevleke se izničita, če sta enako močna in v protifazi. Enaka moč zahteva $n_p = \sqrt{n_1n_2} = \sqrt{1{,}50} \approx 1{,}22$; protifaza zahteva pot $2d = \lambda/(2n_p)$, torej $d = \lambda/(4n_p) \approx 550/(4 \cdot 1{,}22)\,\mathrm{nm} \approx 112\,\mathrm{nm}$.
7. Odgovor: $R = 4{,}0\,\%$ za steklo, $2{,}0\,\%$ za vodo; plošča prepusti okoli $92\,\%$; prevleka z $n \approx 1{,}22$ in debelino okoli $112\,\mathrm{nm}$ (v praksi $\mathrm{MgF_2}$ z $n = 1{,}38$, ki odboj zmanjša na okoli $1\,\%$).

## Drugače: Z analogijo

**Val na vrvi.** Elektromagnetni val je kot val na napeti vrvi, ki jo stresaš gor in dol: motnja potuje vzdolž vrvi, sama vrv pa se giblje prečno. Polarizacija je smer stresanja: gor–dol ali levo–desno. Polarizator je kot ozka navpična reža v ograji, skozi katero gre le val, ki niha navpično.

**Lom kot vojaki v blatu.** Vrsta vojakov koraka poševno s ceste na njivo, kjer hodijo počasneje. Kdor prvi stopi na njivo, se upočasni, drugi še hodijo hitro – vrsta se zato zasuka proti pravokotnici. To je lomni zakon: smer se spremeni, ker se spremeni hitrost. Pri vrnitvi na cesto se zasuka stran od pravokotnice; če je poševnost prevelika, vojaki cesto »zgrešijo« – totalni odboj.

**Kje analogija odpove.** Vrv potrebuje snov, elektromagnetni val pa ne: širi se tudi skozi prazen prostor, ker sprememba električnega polja ustvarja magnetno in obratno.

## Drugače: Uporaba v stroki

**Optične komunikacije.** Svetloba v vlaknih ostane ujeta s totalnim odbojem; numerična apertura iz Primera 3 določi, kako natančno moramo poravnati laser z vlaknom. Fresnelove izgube na spojih zmanjšamo z gelom z enakim lomnim količnikom.

**Optika in laboratorij.** Leče in objektivi imajo protiodbojne prevleke, sicer bi objektiv z desetimi površinami izgubil skoraj tretjino svetlobe. Laserji z Brewstrovimi okni oddajajo polarizirano svetlobo brez izgub na oknih. Fotodiode merijo intenziteto, nikoli neposredno $E_0$.

**Vesolje in merjenje.** Tlak sevanja moti tirnice satelitov GPS in ga je treba upoštevati v računih tirnic. V optičnih pincetah fokusiran laserski žarek s tlakom sevanja in lomom drži mikrometrske kroglice ali celice in meri sile reda pikonewtonov.

## Preveri se

? V laboratorijskem poročilu piše: »Poyntingov vektor kaže na detektor in ima velikost $20\,\mathrm{W/m^2}$.« Kaj to pomeni?
+ Energija teče proti detektorju in skozi vsak kvadratni meter, pravokoten na tok, preteče $20\,\mathrm{J}$ na sekundo.
- Električno polje kaže na detektor in je veliko $20\,\mathrm{V/m}$.
~ Električno polje je pravokotno na smer širjenja; Poyntingov vektor ni polje $\vec{E}$, ampak gostota energijskega toka.
- Detektor prejme skupno moč $20\,\mathrm{W}$.
~ Enota je $\mathrm{W/m^2}$; skupno moč dobiš šele, ko pomnožiš s površino detektorja.
> $\vec{S} = \vec{E}\times\vec{B}/\mu_0$ kaže smer prenosa energije, njegova velikost je moč na enoto ploskve.

? Razvrsti snovi po mejnem kotu totalnega odboja proti zraku, od najmanjšega do največjega: diamant ($n = 2{,}42$), steklo ($n = 1{,}50$), voda ($n = 1{,}33$).
- voda, steklo, diamant
~ Večji lomni količnik pomeni manjši $\sin\alpha_m = 1/n$, torej manjši mejni kot; vrstni red je obrnjen.
+ diamant, steklo, voda
- steklo, diamant, voda
~ Mejni kot pada z naraščajočim $n$: diamant ($24{,}4^\circ$) ima najmanjšega.
> $\alpha_m = \arcsin(1/n)$: diamant $24{,}4^\circ$, steklo $41{,}8^\circ$, voda $48{,}8^\circ$. Majhen mejni kot je razlog, da diamant tako »iskri«.

? Kaj se zgodi z intenziteto vala, če se amplituda električnega polja podvoji?
- Podvoji se.
~ Intenziteta je sorazmerna s kvadratom amplitude, $I = \tfrac12\varepsilon_0cE_0^2$.
- Ostane enaka, ker se magnetno polje razpolovi.
~ Magnetno polje se tudi podvoji, ker je $B_0 = E_0/c$.
+ Poveča se na štirikratno vrednost.
> $I \propto E_0^2$, torej $2^2 = 4$.

? Laser z močjo $1{,}0\,\mathrm{mW}$ ima žarek s premerom $1{,}0\,\mathrm{mm}$. Kolikšna je približno njegova intenziteta?
- $1{,}0\,\mathrm{W/m^2}$
~ Moč si delil z $1\,\mathrm{m^2}$ namesto s prerezom žarka.
+ $1{,}3 \cdot 10^3\,\mathrm{W/m^2}$
- $3{,}2 \cdot 10^2\,\mathrm{W/m^2}$
~ Vzel si premer namesto polmera v $\pi r^2$ ($\pi d^2$): prerez je bil štirikrat prevelik.
> Prerez je $\pi(0{,}5 \cdot 10^{-3})^2 \approx 7{,}85 \cdot 10^{-7}\,\mathrm{m^2}$, zato $I \approx 10^{-3}/7{,}85 \cdot 10^{-7} \approx 1{,}27 \cdot 10^3\,\mathrm{W/m^2}$.

? Svetloba pada pravokotno iz zraka na steklo z $n = 1{,}50$. Kolikšen delež intenzitete se odbije?
- $20\,\%$
~ To je amplitudni odbojni koeficient $r = 0{,}5/2{,}5$; odbojnost je njegov kvadrat.
- $50\,\%$
~ Razlika lomnih količnikov ni delež odbite svetlobe; uporabi Fresnelovo formulo.
+ $4\,\%$
> $R = ((1{,}50 - 1)/(1{,}50 + 1))^2 = 0{,}2^2 = 0{,}04$.

:::simboli
\vec{E} | električna poljska jakost | | V/m
\vec{B} | gostota magnetnega polja | | T
E | velikost električnega polja | | V/m
B | velikost magnetnega polja | B = \frac{E}{c} | T | v ravnem valu
E_0 | amplituda električnega polja | | V/m
B_0 | amplituda magnetnega polja | B_0 = \frac{E_0}{c} | T
\mu_0 | indukcijska konstanta | | V\,s/(A\,m)
\varepsilon_0 | influenčna konstanta | | A\,s/(V\,m)
c | hitrost svetlobe v praznem prostoru | c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} | m/s
n | lomni količnik | n = \sqrt{\varepsilon_r\mu_r} | –
n_1, n_2 | lomna količnika snovi ob meji | | –
n_0 | lomni količnik zraka | | –
k | valovno število | k = \frac{2\pi}{\lambda} | m^{-1}
\omega | krožna frekvenca | \omega = ck | s^{-1}
z | lega vzdolž smeri širjenja | | m
t | čas | | s
\vec{e}_x, \vec{e}_y | enotska vektorja osi $x$ in $y$ | | –
\vec{k} | valovni vektor | | m^{-1}
w | gostota energije polja | w = \frac{1}{2}\varepsilon_0E^2 + \frac{1}{2\mu_0}B^2 | J/m^3
\vec{S} | Poyntingov vektor | \vec{S} = \frac{1}{\mu_0}\vec{E}\times\vec{B} | W/m^2
S | velikost Poyntingovega vektorja | | W/m^2
I | gostota energijskega toka (intenziteta) | I = \frac{1}{2}\varepsilon_0cE_0^2 | W/m^2
\vec{j} | gostota električnega toka | | A/m^2
V | prostor (prostornina) | | m^3
\vec{A} | ploskev (vektor) | | m^2
p | tlak sevanja | p = \frac{I}{c} | Pa | pri odboju nazaj 2I/c
P | moč | | W
d | premer žarka | | m
A | površina jadra | | m^2
F | sila | F = pA | N
m | masa | | kg
\Delta v | sprememba hitrosti | | m/s
\alpha | vpadni kot | | °
\alpha' | odbojni kot | | °
\beta | lomni kot | | °
R | odbojnost | R = \left(\frac{n_1 - n_2}{n_1 + n_2}\right)^2 | – | pri pravokotnem vpadu
\alpha_m | mejni kot totalnega odboja | \sin\alpha_m = \frac{n_2}{n_1} | °
\alpha_B | Brewstrov kot | \tan\alpha_B = \frac{n_2}{n_1} | °
\theta | vpadni kot na čelno ploskev vlakna | | °
\theta_1 | kot žarka z osjo v jedru | | °
:::
