---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vetrne elektrarne na odprtem morju pošiljajo energijo na kopno po podmorskih enosmernih kablih s tokom več kot tisoč amperov. Biologe je skrbelo, ali magnetno polje kablov zmede jegulje, morske pse in želve, ki se orientirajo po zemeljskem polju. Inženirji so odgovorili presenetljivo: tok ne teče po enem kablu, ampak po dveh tesno skupaj, z nasprotnima smerema. Isti tok, dva kabla, a polje nad dnom je **desetkrat** šibkejše, nekaj metrov više pa celo šestdesetkrat. Zakaj dva vodnika dasta manj kot en sam? Odgovor dasta zakona, ki povesta, kakšno polje ustvari tok: **Biot-Savartov** in **Amperov** zakon.

## Razlaga

### Slika polja okoli vodnika

Postavimo nekaj kompasov na karton, skozi katerega navpično teče tok. Igle se ne obrnejo k vodniku, ampak se postavijo **tangentno** na krožnice okoli njega. Bližje vodniku se igle ob vklopu toka odklonijo močneje; daleč stran jih polje toka komaj premakne in kažejo skoraj po zemeljskem polju.

```
       .---------.
     /   .-----.   \
    |   |   ⊙   |   |
     \   '-----'   /
       '---------'
  ⊙ tok teče iz lista;
  silnice so krožnice
```

Smer silnic da **pravilo desne roke**: palec v smeri toka, upognjeni prsti kažejo smer polja. Na sliki zgoraj (tok iz lista) silnice tečejo v nasprotni smeri urinega kazalca.

**Definicija.** Magnetno polje opišemo z vektorjem **gostote magnetnega polja** $\vec{B}$; enota je **tesla**, $1\,\mathrm{T} = 1\,\mathrm{V\,s/m^2}$. Silnice magnetnega polja so vedno sklenjene.

Za občutek, kako velike so gostote:

| Vir | $B$ |
|---|---|
| zemeljsko polje | okoli $50\,\mu\mathrm{T}$ |
| pod daljnovodom | do $10\,\mu\mathrm{T}$ |
| magnet na hladilniku | okoli $10\,\mathrm{mT}$ |
| naprava MRI | $1{,}5$ do $3\,\mathrm{T}$ |

### Biot-Savartov zakon: prispevek kosa vodnika

Vodnik si mislimo razrezan na kratke kose. Vsak kos $\mathrm{d}\vec{l}$ (vektor v smeri toka) prispeva k polju v točki $P$ majhen delček. Celotno polje je vektorska vsota vseh delčkov. To je **načelo superpozicije**.

**Izrek (Biot-Savartov zakon).** Naj bo tok $I$ stacionaren (časovno nespremenljiv) in naj bo okolica vakuum ali zrak. Kos vodnika $\mathrm{d}\vec{l}$ prispeva v točki na razdalji $r$

$$\mathrm{d}\vec{B} = \frac{\mu_0 I}{4\pi}\,\frac{\mathrm{d}\vec{l} \times \hat{r}}{r^2},$$

kjer je $\hat{r}$ enotski vektor od kosa proti točki in $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$ **indukcijska konstanta**. Velikost prispevka je $\mathrm{d}B = \frac{\mu_0 I}{4\pi}\,\frac{\mathrm{d}l\,\sin\varphi}{r^2}$, kjer je $\varphi$ kot med $\mathrm{d}\vec{l}$ in $\hat{r}$.

Iz zakona razberemo tri stvari. Prispevek pada s kvadratom razdalje. Kos ne prispeva nič v točkah na svoji premici ($\sin\varphi = 0$). Prispevek je pravokoten na kos in na smer proti točki.

**Ravni odsek vodnika.** Točka je na razdalji $a$ od premice odseka. Konca odseka vidimo pod kotoma $\beta_1$ in $\beta_2$, merjenima od pravokotnice na odsek. Vsi prispevki kažejo v isto smer, zato seštejemo kar velikosti.

*Izpeljava.* Kos na mestu $x$ od pravokotnice ima $r = \sqrt{x^2 + a^2}$ in $\sin\varphi = a/r$. Vpeljemo $x = a\tan\beta$, torej $\mathrm{d}x = a\,\mathrm{d}\beta/\cos^2\beta$ in $r = a/\cos\beta$. Prispevek je potem $\frac{\mu_0 I}{4\pi a}\cos\beta\,\mathrm{d}\beta$. Integral od $-\beta_1$ do $\beta_2$ da

$$B = \frac{\mu_0 I}{4\pi a}\left(\sin\beta_1 + \sin\beta_2\right).$$

Za neskončno dolg vodnik sta oba kota $90^\circ$, zato

$$B = \frac{\mu_0 I}{2\pi a}.$$

**Krožna zanka, točka na osi.** Zanka s polmerom $R$, točka na osi na razdalji $z$ od središča. Vsak kos je pravokoten na smer proti točki, zato je $\mathrm{d}B = \frac{\mu_0 I\,\mathrm{d}l}{4\pi(R^2 + z^2)}$. Prečne komponente nasprotnih kosov se odštejejo; ostane komponenta vzdolž osi, pomnožena z $R/\sqrt{R^2 + z^2}$. Vsota vseh $\mathrm{d}l$ je obseg $2\pi R$:

$$B = \frac{\mu_0 I R^2}{2\left(R^2 + z^2\right)^{3/2}}.$$

V središču ($z = 0$) je $B = \mu_0 I/(2R)$. Tuljava z $N$ tesno navitimi ovoji ima $N$-krat večje polje.

:::premisli
Daleč od zanke ($z$ mnogo večji od $R$) kako hitro pada polje na osi: z $1/z$, $1/z^2$ ali $1/z^3$? Zakaj hitreje kot pri ravnem vodniku?
---
Z $1/z^3$: v imenovalcu ostane $(z^2)^{3/2} = z^3$. Tok v zanki teče na nasprotnih straneh v nasprotnih smereh, zato se prispevka nasprotnih kosov od daleč skoraj izničita. Pri ravnem vodniku takega izničenja ni.
:::

### Amperov zakon: obhod okoli toka

Biot-Savartov zakon zna vse, a integrali hitro postanejo težki. Kadar ima razporeditev toka veliko simetrije, je hitrejša druga pot.

**Izrek (Amperov zakon).** Naj bodo tokovi stacionarni in okolica vakuum ali zrak. Potem za vsako sklenjeno pot velja

$$\oint \vec{B} \cdot \mathrm{d}\vec{s} = \mu_0 I_{obj},$$

kjer je $I_{obj}$ vsota tokov skozi ploskev, ki jo pot objema. Tok šteje pozitivno, če ima smer palca desne roke, ko prsti kažejo smer obhoda. Tokovi zunaj poti ne prispevajo nič, čeprav ustvarjajo polje na sami poti.

*Dokaz za raven vodnik.* Polje je $\mu_0 I/(2\pi r)$ in kaže tangentno na krožnico. Za kos poti je zato $\vec{B} \cdot \mathrm{d}\vec{s} = \frac{\mu_0 I}{2\pi r}\,r\,\mathrm{d}\phi = \frac{\mu_0 I}{2\pi}\,\mathrm{d}\phi$, kjer je $\mathrm{d}\phi$ kot, pod katerim kos vidimo iz vodnika. Pot, ki vodnik objame, naredi poln obhod ($2\pi$), zato je integral $\mu_0 I$. Pot, ki vodnika ne objame, se vrne na isti kot, zato je integral nič.

V elektrotehniki pogosto pišemo z **magnetno poljsko jakostjo** $\vec{H} = \vec{B}/\mu_0$ (v vakuumu, enota $\mathrm{A/m}$): $\oint \vec{H} \cdot \mathrm{d}\vec{s} = I_{obj}$. Kaj se spremeni v železu, pove lekcija o magnetnih materialih.

**Kako uporabimo zakon.** Izberemo pot, na kateri je $B$ zaradi simetrije povsod enako velik in vzporeden s potjo (ali pa pravokoten nanjo, da kos prispeva nič). Integral je potem $B$ krat dolžina poti.

- **Debel okrogel vodnik** s polmerom $R$, tok enakomerno po preseku. Zunaj ($r \ge R$) je $B = \mu_0 I/(2\pi r)$, kot da bi bil ves tok v osi. Znotraj krožnica s polmerom $r$ objame le delež $r^2/R^2$ toka:
$$B = \frac{\mu_0 I r}{2\pi R^2}.$$
Polje narašča linearno do površine, kjer je največje, nato pada z $1/r$.
- **Toroid** z $N$ ovoji (obroč, navit z žico). Krožnica s polmerom $r$ v notranjosti obroča objame $N$ vodnikov, zato $B \cdot 2\pi r = \mu_0 N I$ in
$$B = \frac{\mu_0 N I}{2\pi r}.$$
Zunaj toroida je polje nič, ker vsaka zunanja krožnica objame enako toka v obe smeri.
- **Dolga tuljava** z $N$ ovoji na dolžini $l$: v notranjosti $B = \mu_0 N I/l$. To je meja toroida, ko polmer zelo naraste.

:::premisli
Koaksialni kabel ima notranji vodnik in okoli njega vodnik v obliki cevi; po njiju teče isti tok v nasprotnih smereh. Kolikšno je polje zunaj kabla in zakaj je to pomembno za sosednje naprave?
---
Nič. Krožnica okoli celega kabla objame tok $I - I = 0$, polje pa je zaradi simetrije na krožnici povsod enako, zato je $B \cdot 2\pi r = 0$. Kabel ne moti sosednjih naprav in ga zunanja polja ne motijo.
:::

**Kdaj Amperov zakon ne pomaga.** Zakon velja vedno (pri stacionarnih tokovih), uporaben pa je le ob simetriji. Za končni odsek, krožno zanko ali kvadratno zanko poti z enakim $B$ ni; tam računamo z Biot-Savartovim zakonom.

## Rešeni primeri

### Primer 1 (lažji)

Enosmerni podmorski kabel s tokom $1200\,\mathrm{A}$ je zakopan $1{,}0\,\mathrm{m}$ pod morskim dnom. Kabel obravnavaj kot dolg raven vodnik. Kolikšna je gostota njegovega polja na dnu neposredno nad kablom in kolikšna $5{,}0\,\mathrm{m}$ od kabla? Primerjaj z zemeljskim poljem $50\,\mu\mathrm{T}$.

**Podatki:** $I = 1200\,\mathrm{A}$, $a_1 = 1{,}0\,\mathrm{m}$, $a_2 = 5{,}0\,\mathrm{m}$, $B_Z = 50\,\mu\mathrm{T}$, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** gostoti $B_1$ in $B_2$, razmerje z $B_Z$

:::formula
$B = \dfrac{\mu_0 I}{2\pi a}$
:::

**Rešitev:**

1. Kabel je mnogo daljši od razdalje do točke, zato velja polje dolgega vodnika. Pomagamo si z $\mu_0/(2\pi) = 2 \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$.
2. Na dnu: $B_1 = 2 \cdot 10^{-7} \cdot 1200/1{,}0\,\mathrm{T} = 2{,}4 \cdot 10^{-4}\,\mathrm{T} = 240\,\mu\mathrm{T}$.
3. Na razdalji $5{,}0\,\mathrm{m}$: polje pada z $1/a$, zato $B_2 = 240\,\mu\mathrm{T}/5 = 48\,\mu\mathrm{T}$.
4. Primerjava: $240\,\mu\mathrm{T}/50\,\mu\mathrm{T} = 4{,}8$.
5. Odgovor: na dnu je polje $240\,\mu\mathrm{T}$, skoraj petkrat močnejše od zemeljskega; pri $5\,\mathrm{m}$ je $48\,\mu\mathrm{T}$, primerljivo z zemeljskim. Kompas nad kablom bi kazal napačno.

### Primer 2

Za merjenje v laboratoriju, ki proučuje magnetno orientacijo živali, želimo v središču krožne tuljave ustvariti polje $50\,\mu\mathrm{T}$, nasprotno zemeljskemu, da ga izničimo. Tuljava ima $40$ ovojev s polmerom $20\,\mathrm{cm}$. Kolikšen tok potrebujemo? Kolikšno je polje tuljave na osi $10\,\mathrm{cm}$ od središča?

**Podatki:** $B_0 = 50\,\mu\mathrm{T}$, $N = 40$, $R = 0{,}20\,\mathrm{m}$, $z = 0{,}10\,\mathrm{m}$, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** tok $I$, gostoto $B(z)$ na osi

:::formula
$B(z) = \dfrac{\mu_0 N I R^2}{2\left(R^2 + z^2\right)^{3/2}}$, v središču $B_0 = \dfrac{\mu_0 N I}{2R}$
:::

**Rešitev:**

1. Iz polja v središču izrazimo tok: $I = 2RB_0/(\mu_0 N)$.
2. $I = 2 \cdot 0{,}20 \cdot 5{,}0 \cdot 10^{-5}/(4\pi \cdot 10^{-7} \cdot 40)\,\mathrm{A} \approx 0{,}398\,\mathrm{A}$.
3. Na osi delimo $B(z)$ z $B_0$; tok in število ovojev se krajšata: $B(z)/B_0 = \left(R^2/(R^2 + z^2)\right)^{3/2}$.
4. $R^2/(R^2 + z^2) = 0{,}04/0{,}05 = 0{,}8$, in $0{,}8^{3/2} \approx 0{,}716$.
5. $B(z) \approx 0{,}716 \cdot 50\,\mu\mathrm{T} \approx 35{,}8\,\mu\mathrm{T}$.
6. Odgovor: potrebujemo tok okoli $0{,}40\,\mathrm{A}$. Že $10\,\mathrm{cm}$ od središča pa je polje za skoraj tretjino manjše, zato ena tuljava polja ne izniči v večjem prostoru.

### Primer 3 (težji)

Dva podmorska kabla ležita vodoravno drug ob drugem, osi sta $10\,\mathrm{cm}$ narazen, $1{,}0\,\mathrm{m}$ pod morskim dnom. Po vsakem teče $1200\,\mathrm{A}$, v nasprotnih smereh. a) Kolikšna je gostota polja na dnu neposredno nad sredino med kabloma in kam kaže? b) Kolikšno je to polje v primerjavi s poljem enega kabla na isti razdalji? c) Kolikšno je polje $5{,}0\,\mathrm{m}$ nad dnom (nad sredino) in kolikšno razmerje s poljem enega kabla?

```
          P  (dno)
          |
          | h = 1,0 m
          |
      ⊙---+---⊗
        d = 10 cm
```

**Podatki:** $d = 0{,}10\,\mathrm{m}$, $h = 1{,}0\,\mathrm{m}$, $I = 1200\,\mathrm{A}$ (nasprotni smeri), višina $5{,}0\,\mathrm{m}$ nad dnom, torej $h_2 = 6{,}0\,\mathrm{m}$ nad kabloma, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** $B_P$ in smer, razmerje z enim kablom, $B$ pri $h_2$

:::formula
$B_1 = \dfrac{\mu_0 I}{2\pi r}$ za vsak kabel; vektorska vsota; od daleč $B \approx \dfrac{\mu_0 I d}{2\pi h^2}$
:::

**Rešitev:**

1. Razdalja od vsakega kabla do $P$: $r = \sqrt{h^2 + (d/2)^2} = \sqrt{1{,}0025}\,\mathrm{m} \approx 1{,}0012\,\mathrm{m}$.
2. Velikost polja vsakega kabla v $P$: $B_1 = \mu_0 I/(2\pi r) \approx 2{,}397 \cdot 10^{-4}\,\mathrm{T}$. Velikosti sta enaki, smeri pa ne.
3. Vsak vektor je pravokoten na zveznico kabel–$P$. Ker sta tokova nasprotna, se **vodoravni** komponenti odštejeta, **navpični** pa seštejeta. Navpična komponenta posameznega polja je $B_1 \cdot (d/2)/r$.
4. Skupaj: $B_P = 2B_1 \cdot \dfrac{d/2}{r} = \dfrac{\mu_0 I d}{2\pi r^2}$.
5. $B_P = 2 \cdot 10^{-7} \cdot 1200 \cdot 0{,}10/1{,}0025\,\mathrm{T} \approx 2{,}39 \cdot 10^{-5}\,\mathrm{T} = 23{,}9\,\mu\mathrm{T}$, navpično.
6. b) En kabel na razdalji $1{,}0\,\mathrm{m}$ (Primer 1) da $240\,\mu\mathrm{T}$; razmerje je $240/23{,}9 \approx 10$.
7. c) Pri $h_2 = 6{,}0\,\mathrm{m}$ je $d/2$ zanemarljiv: $B \approx 2 \cdot 10^{-7} \cdot 1200 \cdot 0{,}10/36\,\mathrm{T} \approx 6{,}7 \cdot 10^{-7}\,\mathrm{T} = 0{,}67\,\mu\mathrm{T}$.
8. En kabel: $2 \cdot 10^{-7} \cdot 1200/6{,}0\,\mathrm{T} = 4{,}0 \cdot 10^{-5}\,\mathrm{T} = 40\,\mu\mathrm{T}$; razmerje $40/0{,}67 \approx 60$.
9. Odgovor: par kablov da na dnu navpično polje okoli $24\,\mu\mathrm{T}$, desetkrat manj kot en kabel. Polje para pada z $1/h^2$, polje enega kabla z $1/h$, zato je $5\,\mathrm{m}$ nad dnom razlika že šestdesetkratna, polje para pa okoli $75$-krat šibkejše od zemeljskega.

### Primer 4 – zdaj ti

Okrogla bakrena zbiralka v razdelilni postaji ima polmer $1{,}5\,\mathrm{cm}$; po njej teče enosmerni tok $900\,\mathrm{A}$, enakomerno po preseku. Kolikšna je gostota polja $0{,}50\,\mathrm{cm}$ od osi, na površini in $3{,}0\,\mathrm{cm}$ od osi?

**Podatki:** $R = 0{,}015\,\mathrm{m}$, $I = 900\,\mathrm{A}$ (enakomerno po preseku), $r_1 = 0{,}0050\,\mathrm{m}$, $r_2 = R$, $r_3 = 0{,}030\,\mathrm{m}$, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** $B(r_1)$, $B(R)$, $B(r_3)$

:::formula
znotraj $B = \dfrac{\mu_0 I r}{2\pi R^2}$, zunaj $B = \dfrac{\mu_0 I}{2\pi r}$
:::

**Rešitev:**

1. Simetrija je osna, zato vzamemo krožnice okoli osi; $B$ je na njih povsod enak in tangenten.
2. Na površini: $B(R) = 2 \cdot 10^{-7} \cdot 900/0{,}015\,\mathrm{T} = 0{,}012\,\mathrm{T} = 12\,\mathrm{mT}$.
3. Preostali točki izračunaj sam: katera formula velja za $r_1$ in katera za $r_3$?

:::premisli
Kolikšni sta $B(r_1)$ in $B(r_3)$?
---
$r_1$ je znotraj, krožnica objame tretjino polmera, torej $1/9$ toka: $B(r_1) = 2 \cdot 10^{-7} \cdot 900 \cdot 0{,}0050/0{,}015^2\,\mathrm{T} = 4{,}0\,\mathrm{mT}$ (tretjina vrednosti na površini, ker polje znotraj raste linearno). $r_3$ je zunaj, dvakrat dlje od osi kot površina: $B(r_3) = 12\,\mathrm{mT}/2 = 6{,}0\,\mathrm{mT}$.
:::

## Pogoste napake

- **Zamenjana formula zanke in vodnika.** Zapis $\mu_0 I/(2\pi R)$ za središče zanke je napačen: tam je $\mu_0 I/(2R)$, za faktor $\pi$ več. Ravni vodnik ima $2\pi$, ker je dolžina krožnice $2\pi r$; zanka nima te krožnice v imenovalcu.
- **Amperov zakon brez simetrije.** »Krožnica skozi središče zanke objame tok $I$, torej $B \cdot 2\pi r = \mu_0 I$« je napačno: $B$ na taki poti ni povsod enak in vzporeden s potjo. Zakon velja, a $B$ ne moremo izpostaviti iz integrala.
- **Ves tok znotraj debelega vodnika.** Pot znotraj vodnika objame le delež $r^2/R^2$ toka. Kdor vzame ves tok, dobi polje, ki proti osi neskončno naraste, v resnici pa je v osi nič.
- **Seštete velikosti namesto vektorjev.** Pri dveh kablih z nasprotnima tokovoma »$2 \cdot 240\,\mu\mathrm{T}$« ni pravilno; seštevamo vektorje, ki so skoraj nasprotni. Narišimo smer vsakega polja, preden seštevamo.
- **Polje vodnika z $1/r^2$.** S kvadratom razdalje pada prispevek kratkega kosa (Biot-Savart), polje dolgega vodnika pa z $1/r$.

## Povzetek

- Tok ustvarja magnetno polje; silnice ravnega vodnika so krožnice, smer da pravilo desne roke.
- Biot-Savart: $\mathrm{d}\vec{B} = \frac{\mu_0 I}{4\pi}\,\frac{\mathrm{d}\vec{l} \times \hat{r}}{r^2}$; celotno polje je vektorska vsota prispevkov.
- Odsek: $B = \frac{\mu_0 I}{4\pi a}(\sin\beta_1 + \sin\beta_2)$; dolg vodnik $\mu_0 I/(2\pi a)$; zanka na osi $\mu_0 I R^2/(2(R^2 + z^2)^{3/2})$, v središču $\mu_0 I/(2R)$.
- Amper: $\oint \vec{B} \cdot \mathrm{d}\vec{s} = \mu_0 I_{obj}$ za stacionarne tokove; uporaben ob simetriji.
- Debel vodnik: znotraj $\mu_0 I r/(2\pi R^2)$; toroid $\mu_0 N I/(2\pi r)$; koaksialni kabel zunaj nič.
- Par nasprotnih tokov: od daleč $B \approx \mu_0 I d/(2\pi h^2)$.

## Za izpit

Znati moraš povedati:

- Biot-Savartov zakon s pogoji in pomenom vseh količin ter smer prispevka;
- izpeljavo polja končnega ravnega odseka in limito za dolg vodnik;
- izpeljavo polja na osi krožne zanke in obnašanje daleč od zanke;
- Amperov zakon s pogoji, pravilo predznaka objetega toka in dokaz za raven vodnik;
- izpeljave polja debelega vodnika (znotraj in zunaj), toroida in dolge tuljave ter utemeljitev, kdaj Amperov zakon ne zadošča.

### Naloga 1

Koaksialni kabel ima notranji vodnik s polmerom $a = 1{,}0\,\mathrm{mm}$ in zunanji vodnik v obliki cevi z notranjim polmerom $b = 3{,}5\,\mathrm{mm}$ in zunanjim $c = 4{,}0\,\mathrm{mm}$. Po notranjem teče $10\,\mathrm{A}$, po zunanjem enako nazaj; tok je v obeh enakomerno porazdeljen po preseku. Izpelji $B(r)$ v vseh štirih območjih in izračunaj polje pri $r = 0{,}50\,\mathrm{mm}$; $2{,}0\,\mathrm{mm}$; $3{,}8\,\mathrm{mm}$ in $5{,}0\,\mathrm{mm}$. Kje je polje največje?

**Rešitev:**

1. Simetrija je osna: pot je krožnica s polmerom $r$, $\oint \vec{B} \cdot \mathrm{d}\vec{s} = B \cdot 2\pi r = \mu_0 I_{obj}(r)$.
2. $r \le a$: $I_{obj} = I r^2/a^2$, zato $B = \mu_0 I r/(2\pi a^2)$. Pri $0{,}50\,\mathrm{mm}$: $B = 2 \cdot 10^{-7} \cdot 10 \cdot 0{,}0005/0{,}001^2\,\mathrm{T} = 1{,}0\,\mathrm{mT}$.
3. $a \le r \le b$: $I_{obj} = I$, $B = \mu_0 I/(2\pi r)$. Pri $2{,}0\,\mathrm{mm}$: $B = 2 \cdot 10^{-7} \cdot 10/0{,}002\,\mathrm{T} = 1{,}0\,\mathrm{mT}$.
4. $b \le r \le c$: v cevi je od povratnega toka objet delež $(r^2 - b^2)/(c^2 - b^2)$, zato $I_{obj} = I\left(1 - \frac{r^2 - b^2}{c^2 - b^2}\right) = I\,\frac{c^2 - r^2}{c^2 - b^2}$ in $B = \frac{\mu_0 I}{2\pi r} \cdot \frac{c^2 - r^2}{c^2 - b^2}$.
5. Pri $3{,}8\,\mathrm{mm}$: $\frac{16 - 14{,}44}{16 - 12{,}25} = 0{,}416$, torej $I_{obj} = 4{,}16\,\mathrm{A}$ in $B = 2 \cdot 10^{-7} \cdot 4{,}16/0{,}0038\,\mathrm{T} \approx 0{,}219\,\mathrm{mT}$.
6. $r \ge c$: $I_{obj} = I - I = 0$, zato $B = 0$; tudi pri $5{,}0\,\mathrm{mm}$.
7. Polje znotraj narašča, za $r > a$ pada. Največje je na površini notranjega vodnika: $B(a) = 2 \cdot 10^{-7} \cdot 10/0{,}001\,\mathrm{T} = 2{,}0\,\mathrm{mT}$.
8. Odgovor: $B$ je $1{,}0\,\mathrm{mT}$; $1{,}0\,\mathrm{mT}$; $0{,}22\,\mathrm{mT}$ in $0$. Največje polje, $2{,}0\,\mathrm{mT}$, je na površini notranjega vodnika; zunaj kabla polja ni.

### Naloga 2

Iz Biot-Savartovega zakona izpelji gostoto polja na osi krožne zanke s polmerom $R$ in tokom $I$. Pokaži, da je daleč od zanke $B \approx \mu_0 m/(2\pi z^3)$, kjer je $m = I\pi R^2$ magnetni moment zanke. Utemelji, zakaj tega polja ne moremo izračunati z Amperovim zakonom.

**Rešitev:**

1. Vsak kos $\mathrm{d}\vec{l}$ je pravokoten na zveznico do točke na osi, zato je $\sin\varphi = 1$ in $\mathrm{d}B = \frac{\mu_0 I\,\mathrm{d}l}{4\pi(R^2 + z^2)}$.
2. Prispevek je pravokoten na zveznico. Razstavimo ga na komponento vzdolž osi in prečno. Nasproten kos zanke ima nasprotno prečno komponento, zato se prečne odštejejo.
3. Osna komponenta je $\mathrm{d}B \cdot \frac{R}{\sqrt{R^2 + z^2}}$; vsi kosi imajo isto razdaljo in isti kot.
4. Seštejemo po obsegu, $\oint \mathrm{d}l = 2\pi R$: $B = \frac{\mu_0 I}{4\pi(R^2 + z^2)} \cdot \frac{R}{\sqrt{R^2 + z^2}} \cdot 2\pi R = \frac{\mu_0 I R^2}{2(R^2 + z^2)^{3/2}}$.
5. Za $z \gg R$ je $(R^2 + z^2)^{3/2} \approx z^3$, torej $B \approx \frac{\mu_0 I R^2}{2z^3} = \frac{\mu_0 I\pi R^2}{2\pi z^3} = \frac{\mu_0 m}{2\pi z^3}$.
6. Amperov zakon velja tudi tu, a ni poti, na kateri bi bil $B$ povsod enako velik in vzporeden s potjo: polje zanke nima osne simetrije okoli kake premice v smeri toka. Integrala ne moremo zapisati kot $B$ krat dolžina.
7. Odgovor: $B = \mu_0 I R^2/(2(R^2 + z^2)^{3/2})$; daleč od zanke pada z $1/z^3$ kot polje dipola; Amperov zakon tu ne da rešitve, ker manjka simetrija.

## Drugače: Z analogijo

Iz elektrostatike že poznaš par zakonov, ki se obnaša enako:

- **Coulombov zakon ↔ Biot-Savartov zakon.** Oba dasta polje majhnega izvora, ki pada s $1/r^2$; skupno polje dobimo s seštevanjem (integralom) prispevkov.
- **Gaussov zakon ↔ Amperov zakon.** Gauss šteje naboj **znotraj sklenjene ploskve**, Amper tok **skozi sklenjeno pot**. Oba sta vedno pravilna, a uporabna le ob simetriji: Gauss za kroglo, valj in ravnino, Amper za vodnik, toroid in tuljavo.
- **Razlika.** Silnice električnega polja se začnejo in končajo na nabojih; magnetne silnice so sklenjene okoli tokov. Zato Gauss »objema« izvor s ploskvijo, Amper pa ga »obide« s potjo.

Kdor zna z Gaussovim zakonom izračunati polje nabitega valja, zna z Amperovim polje debelega vodnika: korak za korakom je ista pot, le $\varepsilon_0$ in naboj zamenjata $\mu_0$ in tok.

## Drugače: Uporaba v stroki

**Tokovne klešče in Rogowskijeva tuljava.** Elektrikar izmeri tok v kablu brez prekinitve tokokroga: obroč klešč objame vodnik, senzor meri polje, $\oint \vec{B} \cdot \mathrm{d}\vec{s}$ pa je po Amperovem zakonu sorazmeren s tokom ne glede na to, kje v obroču leži vodnik.

**Polaganje kablov.** Pri podmorskih in podzemnih kablih vodnike z nasprotnima tokovoma polagajo tesno skupaj ali kot koaksialni kabel, da se polji odštejeta (Primer 3). Tako manj motijo morske živali in navigacijo ladij.

**Varstvo pred sevanjem.** Pri daljnovodih in transformatorskih postajah računajo polje s superpozicijo prispevkov vseh vodnikov. Mednarodna komisija ICNIRP priporoča za prebivalstvo pri $50\,\mathrm{Hz}$ mejo $200\,\mu\mathrm{T}$; slovenski predpisi so za stanovanja, šole in vrtce strožji.

**Kompenzacija zemeljskega polja.** Laboratoriji za magnetometrijo in biologijo uporabljajo pare tuljav (Helmholtzov par: dve tuljavi na razdalji enega polmera), ker ena tuljava da preveč nehomogeno polje (Primer 2).

## Drugače: Korak za korakom s številkami

Kvadratna zanka s stranico $0{,}20\,\mathrm{m}$, tok $5{,}0\,\mathrm{A}$. Kolikšno je polje v središču?

1. Vsaka stranica je odsek; središče je od nje oddaljeno $a = 0{,}10\,\mathrm{m}$.
2. Konca stranice vidimo iz središča pod kotoma $\beta_1 = \beta_2 = 45^\circ$.
3. Ena stranica: $B_s = 10^{-7} \cdot 5{,}0/0{,}10 \cdot 2\sin 45^\circ\,\mathrm{T} \approx 7{,}07\,\mu\mathrm{T}$.
4. Vse štiri stranice dajo polje v isto smer: $B = 4B_s \approx 28{,}3\,\mu\mathrm{T}$.
5. Za primerjavo, včrtana krožna zanka s polmerom $0{,}10\,\mathrm{m}$: $\mu_0 I/(2R) \approx 31{,}4\,\mu\mathrm{T}$. Kvadrat ima tok v povprečju dlje od središča, zato je polje nekoliko manjše.

## Preveri se

? Okoli snopa treh vodnikov s tokovi $+5\,\mathrm{A}$, $+3\,\mathrm{A}$ in $-2\,\mathrm{A}$ (predznak glede na smer obhoda) položimo sklenjeno pot; četrti vodnik s tokom $10\,\mathrm{A}$ leži zunaj poti. Koliko je $\oint \vec{B} \cdot \mathrm{d}\vec{s}$?
- $\mu_0 \cdot 20\,\mathrm{A}$
~ Prištel si še zunanji vodnik in vse tokove vzel s pozitivnim predznakom; šteje le objeti tok s predznakom.
- $\mu_0 \cdot 10\,\mathrm{A}$
~ Upošteval si vse tri objete tokove s pozitivnim predznakom; tok $-2\,\mathrm{A}$ teče v nasprotno smer in se odšteje.
+ $\mu_0 \cdot 6\,\mathrm{A}$
> Objeti tok je $5 + 3 - 2 = 6\,\mathrm{A}$. Zunanji vodnik spremeni polje na poti, ne pa integrala.

? Tok $I$ teče po krožni zanki s polmerom $R$, po dolgem ravnem vodniku in po koaksialnem kablu. Uredi gostoto polja od največje do najmanjše: v središču zanke, na razdalji $R$ od ravnega vodnika, na razdalji $R$ od osi kabla (zunaj kabla).
+ zanka, ravni vodnik, kabel
- ravni vodnik, zanka, kabel
~ Pri zanki je ves tok na razdalji $R$ in vsi prispevki kažejo v isto smer; $\mu_0 I/(2R)$ je $\pi$-krat več kot $\mu_0 I/(2\pi R)$.
- kabel, zanka, ravni vodnik
~ Kabel ima dva vodnika, a z nasprotnima tokovoma: objeti tok zunaj je nič, zato je polje nič.
> $\mu_0 I/(2R) > \mu_0 I/(2\pi R) > 0$.

? Kaj se zgodi s poljem nad sredino para kablov z nasprotnima tokovoma daleč stran (Primer 3), če razdaljo do kablov podvojimo?
- Zmanjša se na polovico.
~ Tako pada polje enega dolgega vodnika; pri paru se prispevka skoraj odštejeta in ostane $1/h^2$.
+ Zmanjša se na četrtino.
- Ostane enako, ker sta tokova enaka.
~ Polje se z razdaljo vedno zmanjšuje; enaka tokova povesta le, da sta prispevka enako velika.
> Od daleč $B \approx \mu_0 I d/(2\pi h^2)$, zato podvojitev $h$ da četrtino polja.

? Toroid ima $1000$ ovojev, tok je $0{,}50\,\mathrm{A}$. Kolikšna je gostota polja v obroču na razdalji $10\,\mathrm{cm}$ od osi toroida?
+ $1{,}0\,\mathrm{mT}$
- $6{,}3\,\mathrm{mT}$
~ Uporabil si formulo tuljave z dolžino $l = 0{,}10\,\mathrm{m}$; dolžina silnice v toroidu je obseg $2\pi r$.
- $0$
~ Nič je polje zunaj toroida; v obroču krožnica objame vseh $1000$ ovojev.
> $B = \mu_0 N I/(2\pi r) = 2 \cdot 10^{-7} \cdot 1000 \cdot 0{,}50/0{,}10\,\mathrm{T} = 1{,}0\,\mathrm{mT}$.

? Krožna zanka s polmerom $5{,}0\,\mathrm{cm}$ ima tok $10\,\mathrm{A}$. Kolikšna je gostota polja v njenem središču?
- $40\,\mu\mathrm{T}$
~ To je polje ravnega vodnika na razdalji $5\,\mathrm{cm}$, $\mu_0 I/(2\pi R)$; pri zanki ni faktorja $\pi$ v imenovalcu.
- $63\,\mu\mathrm{T}$
~ Namesto polmera si vstavil premer; v formuli $\mu_0 I/(2R)$ je $R$ polmer.
+ $126\,\mu\mathrm{T}$
> $B = \mu_0 I/(2R) = 4\pi \cdot 10^{-7} \cdot 10/0{,}10\,\mathrm{T} \approx 1{,}26 \cdot 10^{-4}\,\mathrm{T}$.

:::simboli
\vec{B} | vektor gostote magnetnega polja | | T
B | gostota magnetnega polja | | T
B_0 | gostota polja v središču tuljave | B_0 = \frac{\mu_0 N I}{2R} | T
B_1, B_2 | gostota polja v dveh točkah oz. enega kabla | | T
B_P | gostota polja para kablov v točki P | | T
B_Z | gostota zemeljskega polja | | T | okoli 50 µT
B_s | prispevek ene stranice kvadrata | | T
\mathrm{d}B | velikost prispevka kosa vodnika | | T
\vec{l} | vektor kosa vodnika v smeri toka | | m | v zakonu nastopa kos $\mathrm{d}\vec{l}$
\vec{s} | vektor vzdolž sklenjene poti | | m | v Amperovem zakonu kos $\mathrm{d}\vec{s}$
\mathrm{d}l | dolžina kosa vodnika | | m
\hat{r} | enotski vektor od kosa proti točki | | –
r | razdalja od kosa ali osi do točke | | m
\varphi | kot med kosom vodnika in smerjo proti točki | | °
I | električni tok | | A
I_{obj} | objeti tok (s predznakom) | | A
\mu_0 | indukcijska konstanta | | V\,s/(A\,m) | 4π · 10⁻⁷ V s/(A m)
a | razdalja točke od premice vodnika | | m | pri koaksialnem kablu polmer notranjega vodnika
a_1, a_2 | razdalji od kabla | | m
\beta_1, \beta_2 | kota, pod katerima vidimo konca odseka | | ° | merjena od pravokotnice
R | polmer zanke ali debelega vodnika | | m
z | razdalja točke na osi od središča zanke | | m
N | število ovojev | | –
\vec{H} | magnetna poljska jakost | \vec{H} = \frac{\vec{B}}{\mu_0} | A/m | v vakuumu
l | dolžina tuljave | | m
d | razdalja med osema kablov | | m
h | razdalja od kablov do točke | | m
h_2 | višina točke nad kabloma | | m
m | magnetni moment zanke | m = I\pi R^2 | A\,m^2
b, c | notranji in zunanji polmer zunanjega vodnika | | m
r_1, r_2, r_3 | razdalje od osi zbiralke | | m
:::
