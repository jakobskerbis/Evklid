---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek: srebrov kromat ima več kot $150$-krat manjši topnostni produkt kot srebrov klorid. Je zato tudi manj topen? Večina reče »da« in se zmoti; zakaj, izveš v razdelku 3. Takšna majhna števila odločajo o rečeh na gradbišču in v delavnici: apnenčasta fasada se v kislem dežju počasi raztaplja, v grelniku vode se nabira kotlovec, keramiki barij iz glazur z obarjanjem odstranijo iz odpadne vode. V laboratoriju isto ravnotežje izkoristimo za **gravimetrijo**: ion oborimo in oborino stehtamo. Barijev sulfat, ki ga bolniki popijejo pred rentgenskim slikanjem, je kljub strupenim barijevim ionom varen prav zaradi izjemno majhne topnosti.

Na koncu boš znal:

- zapisati **topnostni produkt** $K_\mathrm{sp}$ in ga povezati s **topnostjo**,
- napovedati **obarjanje** s primerjavo ionskega produkta in $K_\mathrm{sp}$,
- razložiti vpliv **skupnega iona** in pH na topnost,
- izračunati rezultat **gravimetrične analize**.

## Razlaga

**1. Topnost.** **Topnost** je največja množina (ali masa) snovi, ki se pri dani temperaturi raztopi v danem volumnu raztopine; raztopina je takrat **nasičena**. Množinsko topnost označimo s $s$ in izrazimo v $\mathrm{mol/L}$, masno v $\mathrm{g/L}$. Za orientacijo: snov s topnostjo pod približno $0{,}01\,\mathrm{mol/L}$ imenujemo **težko topna**.

**2. Topnostni produkt.** V nasičeni raztopini težko topne ionske snovi je vzpostavljeno heterogeno ravnotežje med trdno snovjo in ioni v raztopini. Za splošno sol $\mathrm{A}_m\mathrm{B}_n$:

$$\mathrm{A}_m\mathrm{B}_n\mathrm{(s)} \rightleftharpoons m\,\mathrm{A}^{z_+}\mathrm{(aq)} + n\,\mathrm{B}^{z_-}\mathrm{(aq)}, \qquad K_\mathrm{sp} = [\mathrm{A}^{z_+}]^m\,[\mathrm{B}^{z_-}]^n.$$

**Definicija.** Naj bo raztopina pri temperaturi $T$ v ravnotežju s trdno soljo $\mathrm{A}_m\mathrm{B}_n$ (nasičena). Potem je **topnostni produkt** $K_\mathrm{sp}$ konstanta tega ravnotežja; zapis s koncentracijami (v $\mathrm{mol/L}$, deljenimi s $c^\circ$) velja, če je raztopina dovolj razredčena, da so aktivnostni koeficienti blizu $1$. *Izpeljava:* splošna konstanta je $K = a(\mathrm{A})^m a(\mathrm{B})^n / a(\mathrm{A}_m\mathrm{B}_n,\mathrm{s})$; čista trdna snov ima aktivnost $1$, ioni pa $a_i \approx [i]$, zato $K = K_\mathrm{sp}$. Trdna snov v izrazu torej ne nastopa, $K_\mathrm{sp}$ pa je odvisen le od temperature, ne od količine oborine ali drugih ionov v raztopini. Primeri:

- $\mathrm{AgCl(s) \rightleftharpoons Ag^+ + Cl^-}$: $K_\mathrm{sp} = [\mathrm{Ag^+}][\mathrm{Cl^-}] = 1{,}8 \cdot 10^{-10}$,
- $\mathrm{CaF_2(s) \rightleftharpoons Ca^{2+} + 2\,F^-}$: $K_\mathrm{sp} = [\mathrm{Ca^{2+}}][\mathrm{F^-}]^2 = 3{,}9 \cdot 10^{-11}$,
- $\mathrm{Ag_2CrO_4(s) \rightleftharpoons 2\,Ag^+ + CrO_4^{2-}}$: $K_\mathrm{sp} = [\mathrm{Ag^+}]^2[\mathrm{CrO_4^{2-}}] = 1{,}1 \cdot 10^{-12}$,
- $\mathrm{BaSO_4}$: $K_\mathrm{sp} = 1{,}1 \cdot 10^{-10}$ (vse vrednosti pri $25\,^\circ\mathrm{C}$).

:::premisli
V nasičeno raztopino AgCl, na dnu katere je še veliko oborine, dolijemo enako prostornino čiste vode in počakamo na ravnotežje. Napovej: se $[\mathrm{Ag^+}]$ zmanjša? Kaj se zgodi z oborino?
---
Takoj po dolivanju se razpolovi, po vzpostavitvi ravnotežja pa je enaka kot prej. Dokler je na dnu oborina, je raztopina nasičena in $[\mathrm{Ag^+}][\mathrm{Cl^-}] = 1{,}8 \cdot 10^{-10}$; količina trdne snovi v izrazu ne nastopa. Del oborine se raztopi, da nasiti še doliti del vode.
:::

**3. Povezava $K_\mathrm{sp}$ in topnosti.** **Izrek.** Naj se sol $\mathrm{A}_m\mathrm{B}_n$ raztaplja v čisti vodi, ioni naj ne sodelujejo v drugih ravnotežjih (protolizi, kompleksih, ionskih parih) in aktivnostni koeficienti naj bodo blizu $1$. Potem je

$$K_\mathrm{sp} = (ms)^m(ns)^n = m^m n^n\,s^{m+n}, \qquad s = \sqrt[m+n]{\frac{K_\mathrm{sp}}{m^m n^n}}.$$

*Dokaz.* Vsaka raztopljena formulska enota da $m$ kationov in $n$ anionov, drugih virov teh ionov ni, zato je $[\mathrm{A}] = ms$ in $[\mathrm{B}] = ns$; vstavimo v $K_\mathrm{sp}$. $\square$

| tip soli | primer | $K_\mathrm{sp}$ | $s$ |
|---|---|---|---|
| $\mathrm{AB}$ | $\mathrm{AgCl}$, $\mathrm{BaSO_4}$ | $s^2$ | $\sqrt{K_\mathrm{sp}}$ |
| $\mathrm{AB_2}$ ali $\mathrm{A_2B}$ | $\mathrm{CaF_2}$, $\mathrm{Ag_2CrO_4}$ | $4s^3$ | $\sqrt[3]{K_\mathrm{sp}/4}$ |
| $\mathrm{A_3B_2}$ | $\mathrm{Ca_3(PO_4)_2}$ | $108\,s^5$ | $\sqrt[5]{K_\mathrm{sp}/108}$ |

Pomembno: topnosti soli **različnih tipov** ne moremo primerjati le po $K_\mathrm{sp}$. $\mathrm{Ag_2CrO_4}$ ima manjši $K_\mathrm{sp}$ ($1{,}1 \cdot 10^{-12}$) kot $\mathrm{AgCl}$ ($1{,}8 \cdot 10^{-10}$), a je bolj topen ($s = 6{,}5 \cdot 10^{-5}$ proti $1{,}3 \cdot 10^{-5}\,\mathrm{mol/L}$).

**4. Ionski produkt in obarjanje.** **Ionski produkt** $Q$ ima enako obliko kot $K_\mathrm{sp}$, vanj pa vstavimo trenutne koncentracije ionov (npr. takoj po mešanju raztopin; te koncentracije so zaradi mešanja že **razredčene**):

- $Q < K_\mathrm{sp}$: raztopina je nenasičena, oborina ne nastane (oziroma se raztaplja),
- $Q = K_\mathrm{sp}$: nasičena raztopina, ravnotežje,
- $Q > K_\mathrm{sp}$: prenasičena raztopina, nastaja **oborina**, dokler ni $Q = K_\mathrm{sp}$.

*Utemeljitev.* Za raztapljanje pri stalnih $T$ in $p$ je $\Delta_\mathrm{r}G = \Delta_\mathrm{r}G^\circ + RT\ln Q$ in $\Delta_\mathrm{r}G^\circ = -RT\ln K_\mathrm{sp}$, torej $\Delta_\mathrm{r}G = RT\ln(Q/K_\mathrm{sp})$. Proces poteka sam od sebe v smeri, v kateri je $\Delta G < 0$: pri $Q < K_\mathrm{sp}$ raztapljanje, pri $Q > K_\mathrm{sp}$ obratna reakcija, obarjanje. (Prenasičena raztopina se lahko zaradi počasne nukleacije nekaj časa obdrži; kriterij pove smer, ne hitrosti.)

**5. Vpliv skupnega iona.** Če raztopina že vsebuje enega od ionov soli (»skupni ion«), se ravnotežje po Le Chatelierju premakne v levo in **topnost se zmanjša**. Kvantitativno: naj bo sol $\mathrm{AB}_n$ v raztopini z anionom $\mathrm{B}$ koncentracije $c$, ki ga sol ne spremeni opazno ($ns \ll c$). Potem je $K_\mathrm{sp} = s\,(c + ns)^n \approx s\,c^n$, torej $s \approx K_\mathrm{sp}/c^n$; približek vedno preverimo. V raztopini $\mathrm{NaCl}$ je $\mathrm{AgCl}$ veliko manj topen kot v čisti vodi. Zato oborine v gravimetriji obarjamo s presežkom obarjalnega reagenta in jih spiramo z razredčeno raztopino skupnega iona, ne s čisto vodo.

**6. Vpliv pH in kompleksov.** Če je anion soli baza (npr. $\mathrm{OH^-}$, $\mathrm{CO_3^{2-}}$, $\mathrm{PO_4^{3-}}$, $\mathrm{F^-}$, oksalat), ga kislina veže in odstrani iz ravnotežja, zato se topnost v kislem **poveča**. Hidroksidi kovin se zato obarjajo šele nad določenim pH. Topnost poveča tudi tvorba kompleksov: $\mathrm{AgCl}$ se raztopi v amoniaku, ker nastane $\mathrm{[Ag(NH_3)_2]^+}$.

:::premisli
Zakaj se fasada ali kamnit kip iz apnenca ($\mathrm{CaCO_3}$) v kislem dežju počasi raztaplja, v čisti deževnici pa skoraj nič?
---
Ioni $\mathrm{H^+}$ vežejo karbonat v $\mathrm{HCO_3^-}$ (in naprej v $\mathrm{CO_2}$), zato $[\mathrm{CO_3^{2-}}]$ pade. Ionski produkt $[\mathrm{Ca^{2+}}][\mathrm{CO_3^{2-}}]$ je tedaj manjši od $K_\mathrm{sp}$ in raztapljanje se nadaljuje: karbonat je bazičen anion, zato je topnost v kislem večja.
:::

**7. Selektivno obarjanje.** Če raztopina vsebuje več ionov, ki z istim reagentom tvorijo oborine, se najprej obori tista sol, pri kateri ionski produkt najprej doseže $K_\mathrm{sp}$. Za vsak ion izračunamo koncentracijo reagenta, pri kateri je $Q = K_\mathrm{sp}$; najmanjša pove, kateri ion se obarja prvi. S postopnim dodajanjem reagenta lahko ione ločimo; ločitev je kvantitativna, če ob začetku obarjanja drugega iona prvega ostane v raztopini manj kot približno $0{,}1\,\%$.

**8. Gravimetrija.** Gravimetrična analiza je določanje snovi s tehtanjem. Postopek:

1. vzorec natančno natehtamo in raztopimo,
2. iskani ion **kvantitativno oborimo** (praktično v celoti, npr. sulfat kot $\mathrm{BaSO_4}$, klorid kot $\mathrm{AgCl}$, nikelj z dimetilglioksimom) s presežkom reagenta,
3. oborino pustimo **zoreti** (nastanejo večji kristali, ki jih lažje filtriramo, in manj nečistot),
4. **filtriramo** in **spiramo**,
5. **sušimo** ali **žarimo** do stalne mase in tehtamo **tehtalno obliko**,
6. iz mase tehtalne oblike izračunamo maso iskane snovi z **gravimetričnim faktorjem**:

$$m(\text{iskane snovi}) = m(\text{tehtalne oblike}) \cdot \frac{a\,M(\text{iskane snovi})}{b\,M(\text{tehtalne oblike})},$$

kjer sta $a$ in $b$ števili, ki uravnata število atomov ključnega elementa (pri sulfatu kot $\mathrm{BaSO_4}$ je $a = b = 1$).

Dobra oborina za gravimetrijo je zelo slabo topna, čista, lahko filtrabilna in ima znano, stalno sestavo.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj množinsko in masno topnost srebrovega klorida v čisti vodi pri $25\,^\circ\mathrm{C}$. $K_\mathrm{sp}(\mathrm{AgCl}) = 1{,}8 \cdot 10^{-10}$, $M(\mathrm{AgCl}) = 143{,}32\,\mathrm{g/mol}$.

**Podatki:** $K_\mathrm{sp} = 1{,}8 \cdot 10^{-10}$, $M(\mathrm{AgCl}) = 143{,}32\,\mathrm{g/mol}$, topilo čista voda, $T = 25\,^\circ\mathrm{C}$
**Iščemo:** topnost $s$ v $\mathrm{mol/L}$ in v $\mathrm{g/L}$

:::formula
$K_\mathrm{sp} = [\mathrm{Ag^+}][\mathrm{Cl^-}] = s^2$, $\quad s = \sqrt{K_\mathrm{sp}}$, $\quad \gamma = s\,M$
:::

**Rešitev:**

1. Raztopi se $s$ mol AgCl na liter, torej $[\mathrm{Ag^+}] = [\mathrm{Cl^-}] = s$.
2. Ker je $K_\mathrm{sp} = s \cdot s$: $s^2 = 1{,}8 \cdot 10^{-10}$, $s = \sqrt{1{,}8 \cdot 10^{-10}} = 1{,}34 \cdot 10^{-5}\,\mathrm{mol/L}$.
3. Masna topnost (vsak mol tehta $M$ gramov): $\gamma = 1{,}34 \cdot 10^{-5}\,\mathrm{mol/L} \cdot 143{,}32\,\mathrm{g/mol} = 1{,}92 \cdot 10^{-3}\,\mathrm{g/L}$.
4. Odgovor: topnost AgCl v vodi je $1{,}34 \cdot 10^{-5}\,\mathrm{mol/L}$ oziroma približno $1{,}9\,\mathrm{mg}$ na liter.

### Primer 2

Izračunaj topnost kalcijevega fluorida v čisti vodi in v raztopini natrijevega fluorida s koncentracijo $0{,}010\,\mathrm{mol/L}$. Kolikokrat se topnost zmanjša? $K_\mathrm{sp}(\mathrm{CaF_2}) = 3{,}9 \cdot 10^{-11}$.

**Podatki:** $K_\mathrm{sp}(\mathrm{CaF_2}) = 3{,}9 \cdot 10^{-11}$, $c(\mathrm{NaF}) = 0{,}010\,\mathrm{mol/L}$ (popolnoma disociiran, $[\mathrm{F^-}]_0 = 0{,}010\,\mathrm{mol/L}$)
**Iščemo:** topnost $s_1$ v vodi, topnost $s_2$ v raztopini NaF in razmerje $s_1/s_2$

:::formula
$K_\mathrm{sp} = [\mathrm{Ca^{2+}}][\mathrm{F^-}]^2$; v vodi $K_\mathrm{sp} = s(2s)^2 = 4s^3$; s skupnim ionom $K_\mathrm{sp} = s\,(0{,}010 + 2s)^2 \approx s \cdot 0{,}010^2$
:::

**Rešitev:**

1. V vodi: $[\mathrm{Ca^{2+}}] = s_1$, $[\mathrm{F^-}] = 2s_1$ (vsaka formulska enota da dva fluoridna iona), $4s_1^3 = 3{,}9 \cdot 10^{-11}$.
2. $s_1 = \sqrt[3]{3{,}9 \cdot 10^{-11}/4} = \sqrt[3]{9{,}75 \cdot 10^{-12}} = 2{,}14 \cdot 10^{-4}\,\mathrm{mol/L}$.
3. V raztopini NaF: $[\mathrm{Ca^{2+}}] = s_2$, $[\mathrm{F^-}] = 0{,}010 + 2s_2 \approx 0{,}010\,\mathrm{mol/L}$ (ker bo $s_2$ zelo majhna).
4. $s_2 = \dfrac{3{,}9 \cdot 10^{-11}}{(0{,}010)^2} = 3{,}9 \cdot 10^{-7}\,\mathrm{mol/L}$.
5. Preizkus približka: $2s_2 = 7{,}8 \cdot 10^{-7} \ll 0{,}010$, približek velja.
6. Razmerje: $s_1/s_2 = 2{,}14 \cdot 10^{-4}/3{,}9 \cdot 10^{-7} \approx 550$.
7. Odgovor: v čisti vodi je topnost $2{,}1 \cdot 10^{-4}\,\mathrm{mol/L}$, v raztopini NaF $3{,}9 \cdot 10^{-7}\,\mathrm{mol/L}$; skupni ion zmanjša topnost približno $550$-krat.

### Primer 3 (težji)

Vsebnost amonijevega sulfata v gnojilu določamo gravimetrično. $0{,}5000\,\mathrm{g}$ vzorca raztopimo, sulfat oborimo s presežkom $\mathrm{BaCl_2}$, tako da je po obarjanju v $250\,\mathrm{mL}$ raztopine $[\mathrm{Ba^{2+}}] = 0{,}010\,\mathrm{mol/L}$, oborino filtriramo, speremo, žarimo in stehtamo $0{,}8250\,\mathrm{g}$ $\mathrm{BaSO_4}$. Izračunaj masni delež sulfata in amonijevega sulfata v vzorcu. Utemelji z računom, ali je obarjanje kvantitativno in zakaj je presežek $\mathrm{Ba^{2+}}$ potreben (primerjaj z obarjanjem brez presežka). Oceni še, koliko oborine bi izgubili, če bi jo sprali z $200\,\mathrm{mL}$ čiste vode, ki se nasiti z $\mathrm{BaSO_4}$. $M(\mathrm{BaSO_4}) = 233{,}39$, $M(\mathrm{SO_4^{2-}}) = 96{,}06$, $M(\mathrm{(NH_4)_2SO_4}) = 132{,}14\,\mathrm{g/mol}$, $K_\mathrm{sp}(\mathrm{BaSO_4}) = 1{,}1 \cdot 10^{-10}$.

**Podatki:** $m(\text{vzorca}) = 0{,}5000\,\mathrm{g}$, $m(\mathrm{BaSO_4}) = 0{,}8250\,\mathrm{g}$, $V(\text{raztopine}) = 250\,\mathrm{mL}$, $[\mathrm{Ba^{2+}}]_\text{presežek} = 0{,}010\,\mathrm{mol/L}$, $V(\text{vode za spiranje}) = 200\,\mathrm{mL}$, $M(\mathrm{BaSO_4}) = 233{,}39\,\mathrm{g/mol}$, $M(\mathrm{SO_4^{2-}}) = 96{,}06\,\mathrm{g/mol}$, $M(\mathrm{(NH_4)_2SO_4}) = 132{,}14\,\mathrm{g/mol}$, $K_\mathrm{sp}(\mathrm{BaSO_4}) = 1{,}1 \cdot 10^{-10}$
**Iščemo:** $w(\mathrm{SO_4^{2-}})$, $w(\mathrm{(NH_4)_2SO_4})$, neoborjeni sulfat z in brez presežka $\mathrm{Ba^{2+}}$ ter izgubo mase pri spiranju

:::formula
$n(\mathrm{SO_4^{2-}}) = n(\mathrm{BaSO_4}) = \dfrac{m(\mathrm{BaSO_4})}{M(\mathrm{BaSO_4})}$, $\quad w = \dfrac{m(\text{iskane snovi})}{m(\text{vzorca})}$, $\quad s = \sqrt{K_\mathrm{sp}}$, s skupnim ionom $s \approx K_\mathrm{sp}/[\mathrm{Ba^{2+}}]$
:::

**Rešitev:**

1. $n(\mathrm{BaSO_4}) = 0{,}8250/233{,}39 = 3{,}535 \cdot 10^{-3}\,\mathrm{mol}$; vsak sulfatni ion da eno formulsko enoto $\mathrm{BaSO_4}$.
2. $m(\mathrm{SO_4^{2-}}) = 3{,}535 \cdot 10^{-3} \cdot 96{,}06 = 0{,}3396\,\mathrm{g}$ (gravimetrični faktor $96{,}06/233{,}39 = 0{,}4116$).
3. $w(\mathrm{SO_4^{2-}}) = 0{,}3396/0{,}5000 = 0{,}679 = 67{,}9\,\%$.
4. Amonijev sulfat: $m = 3{,}535 \cdot 10^{-3} \cdot 132{,}14 = 0{,}4671\,\mathrm{g}$, $w = 0{,}4671/0{,}5000 = 93{,}4\,\%$ (ob predpostavki, da je ves sulfat v obliki amonijevega sulfata).
5. Neoborjeni sulfat s presežkom: $\mathrm{Ba^{2+}}$ je skupni ion, zato $[\mathrm{SO_4^{2-}}] = 1{,}1 \cdot 10^{-10}/0{,}010 = 1{,}1 \cdot 10^{-8}\,\mathrm{mol/L}$; v $0{,}250\,\mathrm{L}$ je to $2{,}75 \cdot 10^{-9}\,\mathrm{mol}$ oziroma $0{,}64\,\mathrm{\mu g}$ $\mathrm{BaSO_4}$, relativno manj kot $10^{-4}\,\%$: obarjanje je kvantitativno.
6. Brez presežka bi bila raztopina le nasičena: $s(\mathrm{BaSO_4}) = \sqrt{1{,}1 \cdot 10^{-10}} = 1{,}05 \cdot 10^{-5}\,\mathrm{mol/L}$, v $0{,}250\,\mathrm{L}$ ostane $2{,}62 \cdot 10^{-6}\,\mathrm{mol}$, to je $0{,}61\,\mathrm{mg}$ oziroma $0{,}07\,\%$; presežek zmanjša izgubo okoli tisočkrat ($1{,}05 \cdot 10^{-5}/1{,}1 \cdot 10^{-8} \approx 950$).
7. Izguba pri spiranju s čisto vodo (tam skupnega iona ni): v $0{,}200\,\mathrm{L}$ se raztopi $1{,}05 \cdot 10^{-5} \cdot 0{,}200 = 2{,}10 \cdot 10^{-6}\,\mathrm{mol}$, kar je $2{,}10 \cdot 10^{-6} \cdot 233{,}39\,\mathrm{g} = 0{,}49\,\mathrm{mg}$.
8. Relativna napaka: $0{,}49\,\mathrm{mg}/825\,\mathrm{mg} \approx 0{,}06\,\%$, kar je manj od običajne natančnosti gravimetrične analize (okoli $0{,}1\,\%$); pri bolj topnih oborinah bi bila napaka večja.
9. Odgovor: vzorec vsebuje $67{,}9\,\%$ sulfata oziroma $93{,}4\,\%$ amonijevega sulfata; s presežkom $\mathrm{Ba^{2+}}$ ostane neoborjenega le $0{,}64\,\mathrm{\mu g}$ (brez njega $0{,}61\,\mathrm{mg}$), spiranje z $200\,\mathrm{mL}$ vode pa bi raztopilo največ okoli $0{,}5\,\mathrm{mg}$ oborine ($0{,}06\,\%$).

### Primer 4 – zdaj ti

Keramična delavnica ima odpadno vodo z barijevimi ioni iz glazur, $[\mathrm{Ba^{2+}}] = 0{,}0020\,\mathrm{mol/L}$. Keramik zmeša $100\,\mathrm{mL}$ te vode s $100\,\mathrm{mL}$ raztopine natrijevega sulfata s koncentracijo $0{,}0020\,\mathrm{mol/L}$. Ali nastane oborina $\mathrm{BaSO_4}$? $K_\mathrm{sp}(\mathrm{BaSO_4}) = 1{,}1 \cdot 10^{-10}$.

**Podatki:** $[\mathrm{Ba^{2+}}] = 0{,}0020\,\mathrm{mol/L}$ v $100\,\mathrm{mL}$, $c(\mathrm{Na_2SO_4}) = 0{,}0020\,\mathrm{mol/L}$ v $100\,\mathrm{mL}$, $K_\mathrm{sp}(\mathrm{BaSO_4}) = 1{,}1 \cdot 10^{-10}$
**Iščemo:** ionski produkt $Q$ po mešanju in ali nastane oborina

:::formula
$Q = [\mathrm{Ba^{2+}}][\mathrm{SO_4^{2-}}]$ z razredčenimi koncentracijami; oborina nastane pri $Q > K_\mathrm{sp}$.
:::

**Rešitev:**

1. Po mešanju je prostornina $200\,\mathrm{mL}$, zato se obe koncentraciji razpolovita: $[\mathrm{Ba^{2+}}] = [\mathrm{SO_4^{2-}}] = 0{,}0010\,\mathrm{mol/L}$.
2. Ionski produkt: $Q = 0{,}0010 \cdot 0{,}0010 = 1{,}0 \cdot 10^{-6}$.
3. Primerjaj $Q$ s $K_\mathrm{sp}$ in zapiši odgovor sam, nato preveri:

:::premisli
Ali je $Q$ večji od $K_\mathrm{sp}$ in kaj to pomeni za odpadno vodo?
---
$Q = 1{,}0 \cdot 10^{-6}$ je približno $9000$-krat večji od $K_\mathrm{sp} = 1{,}1 \cdot 10^{-10}$, zato je raztopina prenasičena in nastane bela oborina $\mathrm{BaSO_4}$. Barij se večinoma izloči, oborino keramik odfiltrira.
:::

## Pogoste napake

- **Pozabljeni koeficienti v $K_\mathrm{sp}$.** Za $\mathrm{CaF_2}$ je $K_\mathrm{sp} = s \cdot (2s)^2 = 4s^3$, ne $s \cdot 2s = 2s^2$ in ne $s^3$.
- **Primerjava topnosti le po $K_\mathrm{sp}$.** Pri solih različnih tipov ($\mathrm{AB}$ in $\mathrm{AB_2}$) izračunaj $s$; manjši $K_\mathrm{sp}$ ne pomeni nujno manjše topnosti.
- **Mešanje raztopin brez razredčenja.** Ko zmešamo $100\,\mathrm{mL}$ in $100\,\mathrm{mL}$, se koncentraciji obeh raztopin razpolovita. $Q$ računamo z razredčenimi koncentracijami.
- **$K_\mathrm{sp}$ se ne spremeni s skupnim ionom.** Spremeni se topnost, $K_\mathrm{sp}$ ostane enak (odvisen je le od temperature).
- **Spiranje z vodo.** Oborine v gravimetriji ne spiramo s preveč čiste vode; uporabimo malo tekočine z elektrolitom ali skupnim ionom, sicer del oborine izgubimo ali pa preide v koloidno stanje in gre skozi filter.
- **Gravimetrični faktor.** Pri izračunu mase iskane snovi pomnožimo maso oborine z razmerjem molskih mas, ne le z masnim deležem, in upoštevamo število atomov (npr. $\mathrm{Fe_2O_3}$ vsebuje dva atoma Fe: $m(\mathrm{Fe}) = m(\mathrm{Fe_2O_3}) \cdot 2M(\mathrm{Fe})/M(\mathrm{Fe_2O_3})$).

## Povzetek

- Topnost $s$ je koncentracija nasičene raztopine; za težko topne soli velja ravnotežje $\mathrm{A}_m\mathrm{B}_n\mathrm{(s)} \rightleftharpoons m\,\mathrm{A} + n\,\mathrm{B}$.
- $K_\mathrm{sp} = [\mathrm{A}]^m[\mathrm{B}]^n$; za $\mathrm{AB}$ je $K_\mathrm{sp} = s^2$, za $\mathrm{AB_2}$ $4s^3$, za $\mathrm{A_3B_2}$ $108\,s^5$.
- $Q > K_\mathrm{sp}$: obarjanje; $Q < K_\mathrm{sp}$: ni oborine; $Q$ po razredčenju zaradi mešanja.
- Skupni ion topnost zmanjša; kislina poveča topnost soli bazičnih anionov; kompleksi povečajo topnost.
- Pri več ionih se najprej obori sol, ki prva doseže $K_\mathrm{sp}$ (selektivno obarjanje).
- Gravimetrija: kvantitativno obarjanje, filtriranje, spiranje, sušenje ali žarjenje, tehtanje; $m(\text{snovi}) = m(\text{oborine}) \cdot$ gravimetrični faktor.

## Za izpit

Znati moraš povedati:

- definicijo topnosti in topnostnega produkta s pogoji (ravnotežje s trdno fazo, dana temperatura, koncentracije namesto aktivnosti le v razredčenih raztopinah) in izpeljavo iz splošne konstante ravnotežja;
- izrek $K_\mathrm{sp} = m^m n^n s^{m+n}$ s pogoji in dokazom ter zakaj topnosti soli različnih tipov ne primerjamo po $K_\mathrm{sp}$;
- kriterij obarjanja $Q$ proti $K_\mathrm{sp}$ in njegovo utemeljitev z $\Delta_\mathrm{r}G = RT\ln(Q/K_\mathrm{sp})$;
- izpeljavo $s \approx K_\mathrm{sp}/c^n$ za skupni ion in preverjanje približka;
- korake gravimetrije, lastnosti dobre oborine in gravimetrični faktor.

### Naloga 1

Raztopina vsebuje $0{,}010\,\mathrm{mol/L}$ $\mathrm{Fe^{3+}}$ in $0{,}010\,\mathrm{mol/L}$ $\mathrm{Mg^{2+}}$. Ione želimo ločiti z obarjanjem hidroksida ob nadzorovanem pH. (a) Pri katerem pH se začne obarjati $\mathrm{Fe(OH)_3}$ in pri katerem je oborjenega $99{,}9\,\%$ železa? (b) Pri katerem pH se začne obarjati $\mathrm{Mg(OH)_2}$? (c) Utemelji, ali je ločitev s pufrom pri $\mathrm{pH} = 4{,}0$ kvantitativna. $K_\mathrm{sp}(\mathrm{Fe(OH)_3}) = 2{,}8 \cdot 10^{-39}$, $K_\mathrm{sp}(\mathrm{Mg(OH)_2}) = 5{,}6 \cdot 10^{-12}$, $K_\mathrm{w} = 1{,}0 \cdot 10^{-14}$; spremembo prostornine zanemari.

**Rešitev:**

1. Za $\mathrm{Fe(OH)_3}$ je $K_\mathrm{sp} = [\mathrm{Fe^{3+}}][\mathrm{OH^-}]^3$; obarjanje se začne, ko je $Q = K_\mathrm{sp}$: $[\mathrm{OH^-}] = \sqrt[3]{2{,}8 \cdot 10^{-39}/0{,}010} = 6{,}5 \cdot 10^{-13}\,\mathrm{mol/L}$.
2. $\mathrm{pOH} = -\log[\mathrm{OH^-}] = 12{,}18$, torej $\mathrm{pH} = 14{,}00 - 12{,}18 = 1{,}82$.
3. Pri $99{,}9\,\%$ oborjenega železa ostane $[\mathrm{Fe^{3+}}] = 1{,}0 \cdot 10^{-5}\,\mathrm{mol/L}$: $[\mathrm{OH^-}] = \sqrt[3]{2{,}8 \cdot 10^{-39}/1{,}0 \cdot 10^{-5}} = 6{,}5 \cdot 10^{-12}\,\mathrm{mol/L}$, $\mathrm{pH} = 2{,}82$ (tisočkrat manjša koncentracija kovine pri hidroksidu s tremi $\mathrm{OH^-}$ premakne pH le za $1/3 \cdot \log 1000 = 1$).
4. Za $\mathrm{Mg(OH)_2}$: $[\mathrm{OH^-}] = \sqrt{5{,}6 \cdot 10^{-12}/0{,}010} = 2{,}4 \cdot 10^{-5}\,\mathrm{mol/L}$, $\mathrm{pOH} = 4{,}63$, $\mathrm{pH} = 9{,}37$.
5. Pri $\mathrm{pH} = 4{,}0$ je $[\mathrm{OH^-}] = 1{,}0 \cdot 10^{-10}\,\mathrm{mol/L}$. Železa ostane $[\mathrm{Fe^{3+}}] = 2{,}8 \cdot 10^{-39}/(1{,}0 \cdot 10^{-10})^3 = 2{,}8 \cdot 10^{-9}\,\mathrm{mol/L}$, kar je $2{,}8 \cdot 10^{-5}\,\%$ začetnega.
6. Za magnezij je $Q = 0{,}010 \cdot (1{,}0 \cdot 10^{-10})^2 = 1{,}0 \cdot 10^{-22} \ll 5{,}6 \cdot 10^{-12}$, zato se ne obarja nič.
7. Odgovor: $\mathrm{Fe(OH)_3}$ se začne obarjati pri $\mathrm{pH} \approx 1{,}8$ in je pri $\mathrm{pH} \approx 2{,}8$ oborjen $99{,}9\,\%$, $\mathrm{Mg(OH)_2}$ šele pri $\mathrm{pH} \approx 9{,}4$; pri $\mathrm{pH} = 4{,}0$ je ločitev kvantitativna (železo praktično v celoti v oborini, magnezij v celoti v raztopini).

### Naloga 2

Natančno navedi zvezo med topnostnim produktom in topnostjo soli $\mathrm{A}_m\mathrm{B}_n$ v čisti vodi s pogoji in jo dokaži. Utemelji, ali ima sol z manjšim $K_\mathrm{sp}$ vedno manjšo topnost, in povej, kdaj primerjava po $K_\mathrm{sp}$ velja.

**Rešitev:**

1. Izrek: če se sol raztaplja v čisti vodi, ioni ne sodelujejo v drugih ravnotežjih in so aktivnostni koeficienti blizu $1$, potem je $K_\mathrm{sp} = m^m n^n s^{m+n}$.
2. Dokaz: iz $s$ mol raztopljene soli na liter nastane $ms$ mol kationov in $ns$ mol anionov, drugih virov ni; vstavimo $[\mathrm{A}] = ms$, $[\mathrm{B}] = ns$ v $K_\mathrm{sp} = [\mathrm{A}]^m[\mathrm{B}]^n$.
3. Trditev ne velja splošno. Protiprimer: $K_\mathrm{sp}(\mathrm{Ag_2CrO_4}) = 1{,}1 \cdot 10^{-12} < K_\mathrm{sp}(\mathrm{AgCl}) = 1{,}8 \cdot 10^{-10}$, a $s(\mathrm{Ag_2CrO_4}) = \sqrt[3]{1{,}1 \cdot 10^{-12}/4} = 6{,}5 \cdot 10^{-5}\,\mathrm{mol/L}$ je večja od $s(\mathrm{AgCl}) = \sqrt{1{,}8 \cdot 10^{-10}} = 1{,}3 \cdot 10^{-5}\,\mathrm{mol/L}$.
4. Razlog: $s$ je odvisna od $K_\mathrm{sp}$ prek korena stopnje $m + n$ in faktorja $m^m n^n$, ki sta za različne tipe soli različna.
5. Za soli istega tipa (enaka $m$ in $n$) je $s = (K_\mathrm{sp}/m^m n^n)^{1/(m+n)}$ strogo naraščajoča funkcija $K_\mathrm{sp}$, zato tam manjši $K_\mathrm{sp}$ res pomeni manjšo topnost.
6. Odgovor: zveza velja pod navedenimi pogoji; manjši $K_\mathrm{sp}$ pomeni manjšo topnost le pri solih istega tipa, sicer je treba izračunati $s$.

## Drugače: Na sliki

Nasičeno raztopino si predstavljaj kot kristal na dnu čaše, iz katerega ioni stalno odhajajo v raztopino, iz raztopine pa se enako hitro vračajo nanj:

```
        raztopina:   Ag+    Cl-      Ag+
                        Cl-     Ag+     Cl-
                     ↑ raztapljanje   ↓ obarjanje
        ===============[ AgCl(s) ]===============
```

Pri $Q < K_\mathrm{sp}$ je »odhajanje« hitrejše in kristal se manjša. Pri $Q > K_\mathrm{sp}$ je »vračanje« hitrejše in kristal raste (nastaja oborina).

Vpliv skupnega iona: če v čašo dodaš veliko ionov $\mathrm{Cl^-}$ (kuhinjsko sol), se ioni $\mathrm{Ag^+}$ veliko pogosteje srečajo s kloridom in se vrnejo v kristal. V raztopini ostane manj srebra.

## Drugače: Uporaba v stroki

**Analiza vod.** Sulfat v pitni in odpadni vodi standardno določajo gravimetrično kot $\mathrm{BaSO_4}$, klorid pa z Mohrovo titracijo s kromatnim indikatorjem (razdelek spodaj).

**Čiščenje odpadnih vod.** Komunalne čistilne naprave odstranjujejo fosfat z doziranjem železovih ali aluminijevih soli, ki tvorijo netopne fosfate. Galvanski obrati težke kovine obarjajo kot hidrokside: pH nastavijo na vrednost, pri kateri je preostala koncentracija kovine pod mejno vrednostjo za izpust; previsok pH ni dober, ker se amfoterni hidroksidi ($\mathrm{Zn(OH)_2}$, $\mathrm{Al(OH)_3}$) spet raztapljajo.

**Mehčanje vode in kotlovec.** V kotlovnicah in hladilnih sistemih se $\mathrm{CaCO_3}$ izloča, ko pri segrevanju uhaja $\mathrm{CO_2}$ in naraste $[\mathrm{CO_3^{2-}}]$. Pri mehčanju z apnom in sodo trdoto namerno oborijo kot $\mathrm{CaCO_3}$ in $\mathrm{Mg(OH)_2}$.

**Farmacija.** Barijev sulfat za rentgensko slikanje mora imeti zelo nizko vsebnost topnih barijevih soli, ker so ioni $\mathrm{Ba^{2+}}$ strupeni, sam $\mathrm{BaSO_4}$ pa je zaradi $s \approx 10^{-5}\,\mathrm{mol/L}$ varen. Pri razvoju zdravil izbirajo sol učinkovine glede na topnost, ki je za šibko bazične ali kisle učinkovine močno odvisna od pH v prebavilih.

## Drugače: Korak za korakom s številkami

Raztopina vsebuje $0{,}010\,\mathrm{mol/L}$ $\mathrm{Cl^-}$ in $0{,}010\,\mathrm{mol/L}$ $\mathrm{CrO_4^{2-}}$. Počasi dodajamo $\mathrm{AgNO_3}$ (prostornino zanemarimo). Katera oborina nastane prva in koliko klorida je še v raztopini, ko se začne obarjati druga? $K_\mathrm{sp}(\mathrm{AgCl}) = 1{,}8 \cdot 10^{-10}$, $K_\mathrm{sp}(\mathrm{Ag_2CrO_4}) = 1{,}1 \cdot 10^{-12}$.

1. **Začetek obarjanja AgCl:** $[\mathrm{Ag^+}] = K_\mathrm{sp}/[\mathrm{Cl^-}] = 1{,}8 \cdot 10^{-10}/0{,}010 = 1{,}8 \cdot 10^{-8}\,\mathrm{mol/L}$.
2. **Začetek obarjanja $\mathrm{Ag_2CrO_4}$:** $[\mathrm{Ag^+}] = \sqrt{K_\mathrm{sp}/[\mathrm{CrO_4^{2-}}]} = \sqrt{1{,}1 \cdot 10^{-12}/0{,}010} = 1{,}05 \cdot 10^{-5}\,\mathrm{mol/L}$.
3. **Primerjava:** za AgCl zadošča veliko manjša koncentracija srebra, zato se najprej obarja **AgCl**, čeprav ima $\mathrm{Ag_2CrO_4}$ manjši $K_\mathrm{sp}$.
4. **Klorid ob začetku obarjanja kromata:** $[\mathrm{Cl^-}] = 1{,}8 \cdot 10^{-10}/1{,}05 \cdot 10^{-5} = 1{,}7 \cdot 10^{-5}\,\mathrm{mol/L}$.
5. **Delež oborjenega klorida:** $1 - 1{,}7 \cdot 10^{-5}/0{,}010 = 0{,}9983$, torej $99{,}83\,\%$.
6. **Uporaba:** na tem temelji **Mohrova titracija** klorida s srebrovim nitratom. Kromat je indikator: ko se ves klorid praktično obori, se pojavi rdečerjava oborina $\mathrm{Ag_2CrO_4}$, ki pokaže končno točko. Ostanek $0{,}17\,\%$ je nad mejo $0{,}1\,\%$ iz razdelka 7, zato v praksi uporabijo manj kromata in rezultat popravijo s slepo titracijo.

## Drugače: Bolj natančno

**Aktivnosti in ionska moč.** Natančno je $K_\mathrm{sp} = a(\mathrm{A})^m\,a(\mathrm{B})^n$, kjer je aktivnost $a_i = \gamma_i\,c_i/c^\circ$. V raztopinah z veliko ioni (večja ionska moč $I = \tfrac12\sum c_i z_i^2$) so aktivnostni koeficienti $\gamma_i < 1$, zato morajo biti koncentracije večje, da je produkt aktivnosti enak $K_\mathrm{sp}$. Topnost težko topne soli se zato v raztopini inertnega elektrolita (npr. $\mathrm{KNO_3}$) nekoliko **poveča**: to je **solni učinek**, nasproten učinku skupnega iona. Za razredčene raztopine $\gamma_i$ ocenimo z Debye-Hücklovim limitnim zakonom $\log\gamma_i = -0{,}509\,z_i^2\sqrt{I}$ (voda, $25\,^\circ\mathrm{C}$).

**Odvisnost topnosti od pH, kvantitativno.** Za hidrokside: iz $K_\mathrm{sp}(\mathrm{Mg(OH)_2}) = 5{,}6 \cdot 10^{-12}$ in $[\mathrm{Mg^{2+}}] = 0{,}010\,\mathrm{mol/L}$ se oborina začne tvoriti pri $[\mathrm{OH^-}] = \sqrt{5{,}6 \cdot 10^{-12}/0{,}010} = 2{,}4 \cdot 10^{-5}\,\mathrm{mol/L}$, torej pri $\mathrm{pH} \approx 9{,}4$. Za sol šibke kisline $\mathrm{MA}$ s konstanto $K_\mathrm{a}$ kisline $\mathrm{HA}$ je skupna topnost

$$s = \sqrt{K_\mathrm{sp}\left(1 + \frac{[\mathrm{H^+}]}{K_\mathrm{a}}\right)},$$

ker je le del raztopljenega aniona v obliki $\mathrm{A^-}$. Pri $[\mathrm{H^+}] \gg K_\mathrm{a}$ topnost raste s korenom koncentracije $\mathrm{H^+}$.

**Termodinamika raztapljanja.** $K_\mathrm{sp}$ je povezan s standardno Gibbsovo energijo raztapljanja, $\Delta G^\circ = -RT\ln K_\mathrm{sp}$. Za $\mathrm{AgCl}$ je $\Delta G^\circ = -8{,}314 \cdot 298 \cdot \ln(1{,}8 \cdot 10^{-10})\,\mathrm{J/mol} \approx +55{,}6\,\mathrm{kJ/mol}$. Temperaturno odvisnost opisuje van 't Hoffova enačba; večina soli je pri višji temperaturi bolj topna, ker je raztapljanje endotermno.

**Kakovost gravimetrične oborine.** Velikost delcev je odvisna od **relativne prenasičenosti** $(Q - S)/S$ (von Weimarn), kjer je $S$ ravnotežna topnost. Velika prenasičenost da veliko drobnih kristalnih jeder (koloidna oborina, težko filtrabilna), majhna pa manj večjih kristalov. Zato obarjamo iz razredčenih, vročih raztopin s počasnim dodajanjem reagenta ob mešanju in oborino pustimo zoreti (Ostwaldovo zorenje: majhni kristali se raztapljajo, veliki rastejo). Nečistote v oborini (**soobarjanje**, okluzija, adsorpcija) so glavni vir sistematskih napak gravimetrije.

## Preveri se

? Kateri je pravilni izraz za topnostni produkt srebrovega kromata $\mathrm{Ag_2CrO_4}$?
- $K_\mathrm{sp} = [\mathrm{Ag^+}][\mathrm{CrO_4^{2-}}]$
~ Formula ima dva srebrova iona, zato koeficient $2$ postane eksponent; brez njega izraz velja za sol tipa AB.
+ $K_\mathrm{sp} = [\mathrm{Ag^+}]^2[\mathrm{CrO_4^{2-}}]$
- $K_\mathrm{sp} = \dfrac{[\mathrm{Ag^+}]^2[\mathrm{CrO_4^{2-}}]}{[\mathrm{Ag_2CrO_4}]}$
~ To je zapis kot pri homogenem ravnotežju; trdna snov ima aktivnost $1$ in v izrazu ne nastopa.
> Iz $\mathrm{Ag_2CrO_4(s) \rightleftharpoons 2\,Ag^+ + CrO_4^{2-}}$ dobimo koeficient $2$ kot eksponent. Trdne snovi v izrazu ne pišemo.

? Topnost soli tipa $\mathrm{AB}$ v vodi je $2{,}0 \cdot 10^{-4}\,\mathrm{mol/L}$. Kolikšen je njen $K_\mathrm{sp}$?
- $2{,}0 \cdot 10^{-4}$
~ To je kar topnost $s$; za sol AB sta v izrazu dve koncentraciji, zato je $K_\mathrm{sp} = s \cdot s$.
- $1{,}4 \cdot 10^{-2}$
~ Topnost je bila korenjena namesto kvadrirana; $K_\mathrm{sp}$ je manjši od $s$, ne večji.
+ $4{,}0 \cdot 10^{-8}$
> Za sol $\mathrm{AB}$ je $K_\mathrm{sp} = s^2 = (2{,}0 \cdot 10^{-4})^2 = 4{,}0 \cdot 10^{-8}$. $1{,}4 \cdot 10^{-2}$ je koren topnosti, ne kvadrat.

? Ionski produkt v raztopini je večji od $K_\mathrm{sp}$. Kaj se zgodi?
+ nastaja oborina
- sol se raztaplja
~ Raztapljanje poteka pri $Q < K_\mathrm{sp}$; tu je ionov preveč, ne premalo.
- nič, raztopina je nasičena
~ Nasičena je pri $Q = K_\mathrm{sp}$; pri večjem $Q$ je prenasičena in ravnotežje se šele vzpostavlja.
> Pri $Q > K_\mathrm{sp}$ je raztopina prenasičena; ioni se izločajo kot oborina, dokler ni $Q = K_\mathrm{sp}$.

? Kaj se zgodi s topnostjo srebrovega klorida, če v nasičeno raztopino dodamo kuhinjsko sol?
- poveča se
~ Zdi se, da več soli v raztopini »pomaga« raztapljanju, a $\mathrm{Cl^-}$ je skupni ion in ravnotežje potisne v levo.
+ zmanjša se
- ostane enaka
~ Enak ostane $K_\mathrm{sp}$, ne topnost: pri večjem $[\mathrm{Cl^-}]$ mora biti $[\mathrm{Ag^+}]$ manjši.
> Dodani $\mathrm{Cl^-}$ je skupni ion; ravnotežje $\mathrm{AgCl(s) \rightleftharpoons Ag^+ + Cl^-}$ se premakne v levo, del AgCl se obori in topnost se zmanjša.

? Študent računa topnost $\mathrm{CaF_2}$ v čisti vodi takole: $K_\mathrm{sp} = s^2$, $s = \sqrt{3{,}9 \cdot 10^{-11}} = 6{,}2 \cdot 10^{-6}\,\mathrm{mol/L}$. Kje je napaka?
+ Ker je $[\mathrm{F^-}] = 2s$, velja $K_\mathrm{sp} = 4s^3$ in $s = 2{,}1 \cdot 10^{-4}\,\mathrm{mol/L}$.
- Koren je izračunan narobe, prav je $6{,}2 \cdot 10^{-5}\,\mathrm{mol/L}$.
~ Koren je pravilen; napaka je že v izrazu za $K_\mathrm{sp}$, ki ne upošteva dveh fluoridnih ionov.
- Prav je $s = \sqrt[3]{K_\mathrm{sp}} = 3{,}4 \cdot 10^{-4}\,\mathrm{mol/L}$.
~ Eksponent $3$ je pravi, manjka pa koeficient: $(2s)^2 = 4s^2$, zato je $K_\mathrm{sp} = 4s^3$, ne $s^3$.
- Napake ni, $\mathrm{CaF_2}$ je sol tipa AB.
~ Ena formulska enota da en ion $\mathrm{Ca^{2+}}$ in dva iona $\mathrm{F^-}$, zato je to sol tipa $\mathrm{AB_2}$.
> Za sol $\mathrm{AB_2}$ je $K_\mathrm{sp} = s(2s)^2 = 4s^3$, zato $s = \sqrt[3]{3{,}9 \cdot 10^{-11}/4} = 2{,}1 \cdot 10^{-4}\,\mathrm{mol/L}$, kot v Primeru 2.

:::simboli
m | število kationov v formulski enoti | | – | m(…) pomeni maso snovi v g
n | število anionov v formulski enoti | | – | n(…) pomeni množino snovi v mol
z | naboj iona | | – | z₊ kationa, z₋ aniona
K_\mathrm{sp} | topnostni produkt | K_\mathrm{sp} = (ms)^m(ns)^n | – | koncentracije v mol/L brez enote
Q | ionski produkt | Q = [\mathrm{A}]^m[\mathrm{B}]^n | – | trenutne koncentracije po mešanju
s | množinska topnost | | mol/L
\gamma | masna topnost | \gamma = s\,M | g/L
M | molska masa | | g/mol
a, b | števili, ki uravnata atome ključnega elementa | | – | gravimetrični faktor; za BaSO₄ a = b = 1
K_\mathrm{a} | konstanta kislosti šibke kisline HA | | –
w | masni delež iskane snovi v vzorcu | w = \frac{m(\text{iskane snovi})}{m(\text{vzorca})} | –
:::
