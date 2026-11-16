---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za doma: v kozarec nalij $10\,\mathrm{mL}$ kisa in dodaj žlico soka rdečega zelja. Raztopina postane rdeča. Nato z injekcijsko brizgo kapljaj raztopino sode bikarbone in štej kaplje. Raztopina se sicer peni (nastaja $\mathrm{CO_2}$), barva pa se dolgo ne spremeni. Potem se v nekaj kapljah barva preobrne v vijolično in nato modrikasto. Ponovi s pol manj kisa: kaplje, potrebne za preskok, se razpolovijo.

Število kapelj torej meri, koliko kisline je bilo v kozarcu. To je **titracija**. V laboratoriju namesto brizge uporabimo bireto, namesto zelja indikator ali pH-elektrodo. Sodobne elektrode se po Bluetoothu povežejo s telefonom ali tablico, ki med dodajanjem riše graf. Tako v tovarnah elektronike sproti preverjajo kisle kopeli za jedkanje bakra na tiskanih vezjih za telefone. Da razumeš, kaj tak graf pove, moraš vedeti, kje je skok, zakaj nastane in katero barvilo ga pokaže.

## Razlaga

**Postopek.** V čašo odpipetiramo natančen volumen raztopine kisline z neznano koncentracijo, **analit**. Iz birete dodajamo raztopino baze z natančno znano koncentracijo, **titrant**. Ves čas merimo pH. Graf pH v odvisnosti od dodanega volumna titranta je **titracijska krivulja**.

**Primer meritve.** Telefon je beležil pH med titracijo $25{,}00\,\mathrm{mL}$ HCl ($0{,}1000\,\mathrm{mol/L}$) z NaOH ($0{,}1000\,\mathrm{mol/L}$). Vrednosti lahko preveriš sam: pred skokom je presežek $\mathrm{H_3O^+}$, po njem presežek $\mathrm{OH^-}$, oboje v celotnem volumnu.

| $V(\mathrm{NaOH})$ [mL] | pH | sprememba pH |
|---|---|---|
| 0 | 1,00 | |
| 20,00 | 1,95 | $+0{,}95$ za 20 mL |
| 24,00 | 2,69 | $+0{,}74$ za 4 mL |
| 24,90 | 3,70 | $+1{,}01$ za 0,9 mL |
| 25,00 | 7,00 | $+3{,}30$ za 0,1 mL |
| 25,10 | 10,30 | $+3{,}30$ za 0,1 mL |
| 26,00 | 11,29 | $+0{,}99$ za 0,9 mL |
| 30,00 | 11,96 | $+0{,}67$ za 4 mL |

Zadnji stolpec pove bistvo. Prvih $24\,\mathrm{mL}$ dvigne pH za manj kot dve enoti. Okoli $25\,\mathrm{mL}$ pa $0{,}2\,\mathrm{mL}$ (približno štiri kaplje) dvigne pH s $3{,}7$ na $10{,}3$. Krivulja je položna, nato skoraj navpična, nato spet položna, kot črka S.

**Račun pri močni kislini.** Naj bo $V_\mathrm{b}$ dodani volumen NaOH. Pred EP je

$$c(\mathrm{H_3O^+}) = \frac{c_\mathrm{k}V_\mathrm{k} - c_\mathrm{b}V_\mathrm{b}}{V_\mathrm{k} + V_\mathrm{b}},$$

po EP pa $c(\mathrm{OH^-}) = \dfrac{c_\mathrm{b}V_\mathrm{b} - c_\mathrm{k}V_\mathrm{k}}{V_\mathrm{k} + V_\mathrm{b}}$. Obe formuli veljata, če je dobljena koncentracija mnogo večja od $10^{-7}\,\mathrm{mol/L}$; sicer moramo upoštevati še protolizo vode. Točno v EP $\mathrm{H_3O^+}$ in $\mathrm{OH^-}$ prispeva le voda, zato je tam $\mathrm{pH} = 7$ pri $25\,^\circ\mathrm{C}$.

:::premisli
Kje bi bil skok, če bi isto kislino titrirali z dvakrat bolj koncentriranim NaOH ($0{,}2000\,\mathrm{mol/L}$)? Napovej, preden bereš naprej.
---
Pri $12{,}50\,\mathrm{mL}$. Vsak mililiter titranta zdaj prinese dvakrat več $\mathrm{OH^-}$, množina kisline pa je enaka, zato zadošča pol volumna. Lega skoka meri množino kisline, ne volumna baze.
:::

**Ekvivalentna točka.** Skok leži tam, kjer je dodane baze točno toliko, kolikor je bilo kisline po enačbi reakcije. Za enoprotonsko kislino z NaOH velja:

$$n(\text{kislina}) = n(\mathrm{NaOH})$$
$$c_\mathrm{k} \cdot V_\mathrm{k} = c_\mathrm{b} \cdot V_\mathrm{b,EP}$$

To je **ekvivalentna točka** (EP). Natančno: naj analit A in titrant T reagirata po enačbi $\nu_\mathrm{A}\,\mathrm{A} + \nu_\mathrm{T}\,\mathrm{T} \rightarrow \text{produkti}$. Ekvivalentna točka je točka titracije, v kateri velja $\dfrac{n(\mathrm{T})}{\nu_\mathrm{T}} = \dfrac{n(\mathrm{A})}{\nu_\mathrm{A}}$. Za enoprotonsko kislino in NaOH je $\nu_\mathrm{A} = \nu_\mathrm{T} = 1$; za $\mathrm{H_2SO_4}$ z NaOH pa $n(\mathrm{NaOH}) = 2\,n(\mathrm{H_2SO_4})$. Iz volumna titranta v EP izračunamo neznano koncentracijo. Točko, kjer opazimo spremembo barve ali prevoj na krivulji, imenujemo **končna točka**. Dobra metoda poskrbi, da se končna točka čim bolj ujema z ekvivalentno.

**Šibka kislina.** Ponovimo enako titracijo, le da je v čaši ocetna kislina ($0{,}1000\,\mathrm{mol/L}$, $\mathrm{p}K_\mathrm{a} = 4{,}76$):

| $V(\mathrm{NaOH})$ [mL] | pH (HCl) | pH ($\mathrm{CH_3COOH}$) |
|---|---|---|
| 0 | 1,00 | 2,88 |
| 12,50 (polovica EP) | 1,48 | 4,76 |
| 24,00 | 2,69 | 6,14 |
| 25,00 (EP) | 7,00 | 8,73 |
| 26,00 | 11,29 | 11,29 |

Razlike so tri, volumen EP pa je enak, ker je množina kisline enaka.

- **Začetek je višje**, ker ocetna kislina le delno protolizira. Naj bo $c$ koncentracija šibke kisline in $x = c(\mathrm{H_3O^+})$. Iz $K_\mathrm{a} = \dfrac{x^2}{c - x}$ sledi: če je protolizirani delež majhen ($x \ll c$, v praksi $c/K_\mathrm{a} > 100$) in $K_\mathrm{a}c \gg K_\mathrm{w}$, potem $c(\mathrm{H_3O^+}) \approx \sqrt{K_\mathrm{a}c}$. Za ocetno kislino: $\sqrt{1{,}75 \cdot 10^{-5} \cdot 0{,}1000} \approx 1{,}32 \cdot 10^{-3}\,\mathrm{mol/L}$, $\mathrm{pH} \approx 2{,}88$.
- **Skok je krajši**, ker pred EP pH drži pufer HA/A⁻. Zanj velja Henderson-Hasselbalchova enačba $\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log\dfrac{c(\mathrm{A^-})}{c(\mathrm{HA})}$. *Izpeljava:* $K_\mathrm{a} = \dfrac{c(\mathrm{H_3O^+})\,c(\mathrm{A^-})}{c(\mathrm{HA})}$ logaritmiramo in pomnožimo z $-1$: $-\log c(\mathrm{H_3O^+}) = -\log K_\mathrm{a} + \log\dfrac{c(\mathrm{A^-})}{c(\mathrm{HA})}$. Pri tem vstavimo analitski koncentraciji, kar je dovoljeno le, če sta obe mnogo večji od $c(\mathrm{H_3O^+})$ in $c(\mathrm{OH^-})$: enačba velja v sredini krivulje, ne na začetku in ne v EP. Po dodatku $V_\mathrm{b}$ je $n(\mathrm{A^-}) = c_\mathrm{b}V_\mathrm{b}$ in $n(\mathrm{HA}) = c_\mathrm{k}V_\mathrm{k} - c_\mathrm{b}V_\mathrm{b}$; skupni volumen se v razmerju krajša. Pri polovici EP je pol kisline pretvorjene v acetat, $c(\mathrm{HA}) = c(\mathrm{A^-})$, logaritem je $0$ in $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$.
- **V EP pH ni $7$, ampak $8{,}73$**, ker je v čaši samo natrijev acetat, acetat pa je šibka baza. Njeno moč opiše **konstanta baze** $K_\mathrm{b} = \dfrac{c(\mathrm{HA})\,c(\mathrm{OH^-})}{c(\mathrm{A^-})}$ za reakcijo $\mathrm{A^- + H_2O \rightleftharpoons HA + OH^-}$. *Izrek:* za konjugirani par HA/A⁻ velja $K_\mathrm{a}K_\mathrm{b} = K_\mathrm{w}$. *Dokaz:* $K_\mathrm{a}K_\mathrm{b} = \dfrac{c(\mathrm{H_3O^+})\,c(\mathrm{A^-})}{c(\mathrm{HA})} \cdot \dfrac{c(\mathrm{HA})\,c(\mathrm{OH^-})}{c(\mathrm{A^-})} = c(\mathrm{H_3O^+})\,c(\mathrm{OH^-}) = K_\mathrm{w}$. Z enakim približkom kot na začetku je $c(\mathrm{OH^-}) = \sqrt{K_\mathrm{b}\,c(\mathrm{A^-})}$; logaritmiranje da $\mathrm{pH} = 7 + \tfrac12\mathrm{p}K_\mathrm{a} + \tfrac12\log c(\mathrm{A^-})$ (pri $25\,^\circ\mathrm{C}$). Za $c(\mathrm{A^-}) = 0{,}0500\,\mathrm{mol/L}$: $\mathrm{pH} = 7 + 2{,}38 - 0{,}65 = 8{,}73$.

**Pravilo.** Pri titraciji močne kisline z močno bazo je v EP $\mathrm{pH} = 7$. Pri šibki kislini z močno bazo je $\mathrm{pH} > 7$, pri šibki bazi z močno kislino $\mathrm{pH} < 7$. Lega EP (volumen) je odvisna samo od množine analita, višina in lega skoka po pH pa od moči kisline ali baze in od koncentracij.

**Indikatorji.** Indikator je sam šibka kislina, katere kisla oblika $\mathrm{HIn}$ ima drugo barvo kot bazična $\mathrm{In^-}$. Barva se spremeni v območju približno $\mathrm{p}K_\mathrm{a}(\mathrm{HIn}) \pm 1$. *Utemeljitev:* po Henderson-Hasselbalchu je $\mathrm{pH} = \mathrm{p}K_\mathrm{a}(\mathrm{HIn}) + \log\dfrac{c(\mathrm{In^-})}{c(\mathrm{HIn})}$; oko vidi čisto barvo ene oblike, ko je ta vsaj desetkrat v prebitku, torej pri $\log\dfrac{c(\mathrm{In^-})}{c(\mathrm{HIn})} \leq -1$ oziroma $\geq 1$. Izberemo indikator, katerega območje leži znotraj navpičnega dela krivulje.

| Indikator | območje pH | barva (kislo → bazično) |
|---|---|---|
| metiloranž | 3,1–4,4 | rdeča → rumena |
| metilrdeče | 4,4–6,2 | rdeča → rumena |
| bromtimolmodro | 6,0–7,6 | rumena → modra |
| fenolftalein | 8,2–10,0 | brezbarvna → rožnata |

Pri HCl skok sega od $3{,}7$ do $10{,}3$, zato ustrezajo vsi štirje (metiloranž na robu). Pri ocetni kislini se skok začne šele okoli $\mathrm{pH} \approx 7$, zato ustreza le fenolftalein. Dodamo le nekaj kapljic: indikator je kislina in tudi on porabi nekaj titranta.

:::premisli
Zakaj bi metiloranž pri titraciji ocetne kisline dal napačen rezultat? Ali bi bil izmerjeni volumen premajhen ali prevelik?
---
Premajhen. Metiloranž preskoči že pri $\mathrm{pH} \approx 4$, to je pred polovico EP ($\mathrm{pH} = 4{,}76$ pri $12{,}5\,\mathrm{mL}$). Titracijo bi končali, ko je nevtralizirane šele manj kot polovica kisline.
:::

Titracijo vedno ponovimo vsaj trikrat in rezultat podamo kot povprečje z intervalom zaupanja, kot pri vsaki kvantitativni analizi.

## Rešeni primeri

### Primer 1: koncentracija kisline v kopeli

Iz jedkalne kopeli za tiskana vezja vzamemo vzorec, ga razredčimo in odpipetiramo $20{,}00\,\mathrm{mL}$. Titriramo z NaOH ($0{,}1000\,\mathrm{mol/L}$); ob preskoku fenolftaleina je poraba $18{,}40\,\mathrm{mL}$. Kolikšna je koncentracija HCl v razredčenem vzorcu?

**Podatki:** $V(\mathrm{HCl}) = 20{,}00\,\mathrm{mL}$, $c(\mathrm{NaOH}) = 0{,}1000\,\mathrm{mol/L}$, $V_\mathrm{EP}(\mathrm{NaOH}) = 18{,}40\,\mathrm{mL}$
**Iščemo:** $c(\mathrm{HCl})$

:::formula
$n(\mathrm{HCl}) = n(\mathrm{NaOH}) = c(\mathrm{NaOH}) \cdot V_\mathrm{EP}$, $\quad c(\mathrm{HCl}) = \dfrac{n(\mathrm{HCl})}{V(\mathrm{HCl})}$
:::

**Rešitev:**

1. Volumne pretvorimo v litre: $18{,}40\,\mathrm{mL} = 0{,}01840\,\mathrm{L}$; $20{,}00\,\mathrm{mL} = 0{,}02000\,\mathrm{L}$.
2. Množina NaOH: $0{,}1000 \cdot 0{,}01840 = 0{,}001840\,\mathrm{mol}$. Toliko je tudi HCl, ker reagirata v razmerju $1 : 1$.
3. $c(\mathrm{HCl}) = 0{,}001840 / 0{,}02000 = 0{,}09200\,\mathrm{mol/L}$.
4. Odgovor: razredčeni vzorec vsebuje $0{,}09200\,\mathrm{mol/L}$ HCl (štiri značilne števke, kot podatki).

### Primer 2: pH pred ekvivalentno točko

K $25{,}00\,\mathrm{mL}$ HCl ($0{,}1000\,\mathrm{mol/L}$) dodamo $20{,}00\,\mathrm{mL}$ NaOH ($0{,}1000\,\mathrm{mol/L}$). Kolikšen je pH?

**Podatki:** $V(\mathrm{HCl}) = 25{,}00\,\mathrm{mL}$, $c(\mathrm{HCl}) = 0{,}1000\,\mathrm{mol/L}$, $V(\mathrm{NaOH}) = 20{,}00\,\mathrm{mL}$, $c(\mathrm{NaOH}) = 0{,}1000\,\mathrm{mol/L}$
**Iščemo:** pH zmesi

:::formula
$c(\mathrm{H_3O^+}) = \dfrac{n(\mathrm{HCl}) - n(\mathrm{NaOH})}{V_\mathrm{skupaj}}$, $\quad \mathrm{pH} = -\log c(\mathrm{H_3O^+})$
:::

**Rešitev:**

1. Začetna množina kisline: $0{,}1000 \cdot 25{,}00 = 2{,}5\,\mathrm{mmol}$ (mol/L krat mL da mmol).
2. Dodana baza: $0{,}1000 \cdot 20{,}00 = 2\,\mathrm{mmol}$; toliko kisline se nevtralizira.
3. Ostane $2{,}5 - 2 = 0{,}5\,\mathrm{mmol}$ $\mathrm{H_3O^+}$ v $25{,}00 + 20{,}00 = 45\,\mathrm{mL}$.
4. $c(\mathrm{H_3O^+}) = 0{,}5 / 45 \approx 0{,}0111\,\mathrm{mol/L}$.
5. $\mathrm{pH} = -\log 0{,}0111 \approx 1{,}95$.
6. Odgovor: pH je $1{,}95$. Čeprav je nevtraliziranih že $80\,\%$ kisline, je raztopina še močno kisla, zato je krivulja tu položna.

### Primer 3: kis, telefon in izbira indikatorja

Kis za čiščenje polnilnih kontaktov razredčimo in $10{,}00\,\mathrm{mL}$ titriramo z NaOH ($0{,}1000\,\mathrm{mol/L}$). Krivulja na telefonu pokaže EP pri $16{,}80\,\mathrm{mL}$. Izračunaj koncentracijo ocetne kisline, pH v EP ter pH $0{,}10\,\mathrm{mL}$ pred EP in $0{,}10\,\mathrm{mL}$ po njej. Na tej podlagi izberi indikator za ponovitev brez elektrode in utemelji, zakaj metilrdeče ($4{,}4$–$6{,}2$) ni primerno. $K_\mathrm{a}(\mathrm{CH_3COOH}) = 1{,}75 \cdot 10^{-5}$, $K_\mathrm{w} = 1{,}0 \cdot 10^{-14}$.

**Podatki:** $V(\mathrm{kis}) = 10{,}00\,\mathrm{mL}$, $c(\mathrm{NaOH}) = 0{,}1000\,\mathrm{mol/L}$, $V_\mathrm{EP} = 16{,}80\,\mathrm{mL}$, $K_\mathrm{a} = 1{,}75 \cdot 10^{-5}$, $K_\mathrm{w} = 1{,}0 \cdot 10^{-14}$
**Iščemo:** $c(\mathrm{CH_3COOH})$, pH v EP, pH pri $16{,}70\,\mathrm{mL}$ in $16{,}90\,\mathrm{mL}$, indikator

:::formula
$c_\mathrm{k} = \dfrac{c_\mathrm{b} V_\mathrm{EP}}{V_\mathrm{k}}$; v EP: $K_\mathrm{b} = \dfrac{K_\mathrm{w}}{K_\mathrm{a}}$, $c(\mathrm{OH^-}) = \sqrt{K_\mathrm{b} \cdot c(\mathrm{A^-})}$; pred EP: $\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log\dfrac{n(\mathrm{A^-})}{n(\mathrm{HA})}$; po EP: $c(\mathrm{OH^-}) = \dfrac{n_\text{presežek}}{V_\mathrm{skupaj}}$
:::

**Rešitev:**

1. Množina kisline: $0{,}1000 \cdot 16{,}80 = 1{,}68\,\mathrm{mmol}$, zato $c = 1{,}68 / 10{,}00 = 0{,}1680\,\mathrm{mol/L}$.
2. V EP je vsa kislina pretvorjena v acetat: $1{,}68\,\mathrm{mmol}$ v $10{,}00 + 16{,}80 = 26{,}8\,\mathrm{mL}$, torej $c(\mathrm{A^-}) \approx 0{,}0627\,\mathrm{mol/L}$.
3. Acetat je šibka baza: $K_\mathrm{b} = 1{,}0 \cdot 10^{-14} / 1{,}75 \cdot 10^{-5} \approx 5{,}71 \cdot 10^{-10}$.
4. $c(\mathrm{OH^-}) = \sqrt{5{,}71 \cdot 10^{-10} \cdot 0{,}0627} \approx 5{,}99 \cdot 10^{-6}\,\mathrm{mol/L}$, $\mathrm{pOH} \approx 5{,}22$.
5. $\mathrm{pH} = 14{,}00 - 5{,}22 = 8{,}78$.
6. Pri $16{,}70\,\mathrm{mL}$ je dodano $1{,}670\,\mathrm{mmol}$ $\mathrm{OH^-}$: nastane $1{,}670\,\mathrm{mmol}$ $\mathrm{A^-}$, ostane $0{,}010\,\mathrm{mmol}$ HA. Obe množini sta še mnogo večji od $\mathrm{H_3O^+}$, zato velja Henderson-Hasselbalch: $\mathrm{p}K_\mathrm{a} = -\log(1{,}75 \cdot 10^{-5}) \approx 4{,}76$, $\mathrm{pH} = 4{,}76 + \log\dfrac{1{,}670}{0{,}010} \approx 4{,}76 + 2{,}22 = 6{,}98$.
7. Pri $16{,}90\,\mathrm{mL}$ je presežek $0{,}010\,\mathrm{mmol}$ $\mathrm{OH^-}$ v $26{,}90\,\mathrm{mL}$: $c(\mathrm{OH^-}) \approx 3{,}72 \cdot 10^{-4}\,\mathrm{mol/L}$, $\mathrm{pOH} \approx 3{,}43$, $\mathrm{pH} \approx 10{,}57$. Acetat ob tem prispeva zanemarljivo $\mathrm{OH^-}$ (glej korak 4).
8. Odgovor: razredčeni kis vsebuje $0{,}1680\,\mathrm{mol/L}$ ocetne kisline, pH v EP je $8{,}78$, skok pa sega od $6{,}98$ do $10{,}57$. Območje fenolftaleina ($8{,}2$–$10{,}0$) leži v skoku, zato izberemo fenolftalein. Metilrdeče bi preskočilo že pred $16{,}70\,\mathrm{mL}$, izmerjeni volumen bi bil premajhen.

### Primer 4: zdaj ti

Telefon je posnel titracijsko krivuljo neznane šibke enoprotonske kisline z NaOH. EP je pri $22{,}0\,\mathrm{mL}$, pri $11{,}0\,\mathrm{mL}$ pa je pH $4{,}20$. Kolikšna je konstanta kisline $K_\mathrm{a}$?

**Podatki:** $V_\mathrm{EP} = 22{,}0\,\mathrm{mL}$, pH pri $11{,}0\,\mathrm{mL}$ je $4{,}20$
**Iščemo:** $K_\mathrm{a}$

:::formula
pri polovici EP: $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$, $\quad K_\mathrm{a} = 10^{-\mathrm{p}K_\mathrm{a}}$
:::

**Rešitev:**

1. $11{,}0\,\mathrm{mL}$ je točno polovica od $22{,}0\,\mathrm{mL}$, torej smo pri polovici EP.
2. Tam je $c(\mathrm{HA}) = c(\mathrm{A^-})$, zato $\mathrm{p}K_\mathrm{a} = 4{,}20$.
3. Izračunaj $K_\mathrm{a}$ sam, nato preveri:

:::premisli
Koliko je $K_\mathrm{a}$?
---
$K_\mathrm{a} = 10^{-4{,}20} \approx 6{,}3 \cdot 10^{-5}$. Takšno vrednost ima benzojska kislina.
:::

## Pogoste napake

- **»V ekvivalentni točki je pH vedno 7.«** To velja le za močno kislino z močno bazo. V EP je v čaši sol; če je njen anion šibka baza (acetat), je pH nad $7$. Popravek: pomisli, kaj je v čaši v EP, in izračunaj njegov pH.
- **»Šibka kislina porabi manj baze.«** Šibka kislina res slabše protolizira, a baza sproti odvzema protone, dokler ne zreagira vsa. Za enako množino kisline je volumen EP enak. Razlikuje se samo oblika krivulje.
- **Ekvivalentna in končna točka sta isto.** EP je računska točka (stehiometrija), končna točka je tisto, kar opazimo. Napačen indikator ju razmakne in da sistematsko napako. Popravek: območje indikatorja mora ležati v skoku.
- **»Več indikatorja, lepša barva.«** Indikator je kislina in porabi titrant. Popravek: le dve ali tri kapljice.
- **pH pri polovici EP je polovica pH v EP.** Pri polovici EP velja $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$; to ni povezano s pH v EP.

## Povzetek

- Titracijska krivulja: pH v odvisnosti od volumna titranta; oblike S, s skokom pri EP.
- Ekvivalentna točka: $n(\text{kislina}) = n(\text{baza})$ po enačbi reakcije; za $1:1$ velja $c_\mathrm{k} V_\mathrm{k} = c_\mathrm{b} V_\mathrm{b,EP}$.
- pH v EP: močna–močna $= 7$; šibka kislina z močno bazo $> 7$; šibka baza z močno kislino $< 7$.
- Pri polovici EP šibke kisline je $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$.
- Indikator: območje preskoka ($\approx \mathrm{p}K_\mathrm{a}(\mathrm{HIn}) \pm 1$) mora ležati v skoku krivulje; za ocetno kislino fenolftalein, za amoniak metilrdeče.
- Končna točka je opažena, EP je računska; dobra metoda ju približa.

## Za izpit

Znati moraš povedati:

- natančno definicijo ekvivalentne točke ($n(\mathrm{T})/\nu_\mathrm{T} = n(\mathrm{A})/\nu_\mathrm{A}$) in razliko do končne točke;
- izpeljavo $c(\mathrm{H_3O^+}) \approx \sqrt{K_\mathrm{a}c}$ s pogoji ($x \ll c$, $K_\mathrm{a}c \gg K_\mathrm{w}$);
- izpeljavo Henderson-Hasselbalchove enačbe, kdaj velja, in dokaz, da je pri polovici EP $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$;
- dokaz $K_\mathrm{a}K_\mathrm{b} = K_\mathrm{w}$ in izpeljavo pH v EP šibke kisline z močno bazo;
- zakaj indikator preskoči v območju $\mathrm{p}K_\mathrm{a}(\mathrm{HIn}) \pm 1$ in kako ga izbereš glede na skok.

### Naloga 1

$0{,}3050\,\mathrm{g}$ neznane enoprotonske šibke kisline raztopimo v vodi do $50{,}00\,\mathrm{mL}$ in titriramo z NaOH ($0{,}1000\,\mathrm{mol/L}$). EP je pri $25{,}00\,\mathrm{mL}$, po dodatku $10{,}00\,\mathrm{mL}$ pa pH-elektroda pokaže $4{,}02$. Izračunaj molsko maso kisline, $K_\mathrm{a}$ in pH v EP ter izberi indikator. $K_\mathrm{w} = 1{,}0 \cdot 10^{-14}$.

**Rešitev:**

1. Množina kisline: $n = 0{,}1000 \cdot 25{,}00 = 2{,}500\,\mathrm{mmol}$, zato $M = 305{,}0\,\mathrm{mg} / 2{,}500\,\mathrm{mmol} = 122{,}0\,\mathrm{g/mol}$.
2. Pri $10{,}00\,\mathrm{mL}$: $n(\mathrm{A^-}) = 0{,}1000 \cdot 10{,}00 = 1{,}000\,\mathrm{mmol}$, $n(\mathrm{HA}) = 2{,}500 - 1{,}000 = 1{,}500\,\mathrm{mmol}$.
3. Pogoj za Henderson-Hasselbalcha: $c(\mathrm{HA}) = 1{,}500/60{,}00 = 0{,}0250\,\mathrm{mol/L}$, kar je mnogo več od $c(\mathrm{H_3O^+}) = 10^{-4{,}02} \approx 9{,}5 \cdot 10^{-5}\,\mathrm{mol/L}$, torej enačba velja.
4. $\mathrm{p}K_\mathrm{a} = \mathrm{pH} - \log\dfrac{1{,}000}{1{,}500} = 4{,}02 + 0{,}18 = 4{,}20$, $K_\mathrm{a} = 10^{-4{,}20} \approx 6{,}3 \cdot 10^{-5}$.
5. V EP je $2{,}500\,\mathrm{mmol}$ $\mathrm{A^-}$ v $50{,}00 + 25{,}00 = 75{,}00\,\mathrm{mL}$: $c(\mathrm{A^-}) = 0{,}03333\,\mathrm{mol/L}$.
6. $\mathrm{pH} = 7 + \tfrac12 \cdot 4{,}20 + \tfrac12\log 0{,}03333 = 7 + 2{,}10 - 0{,}74 = 8{,}36$.
7. Odgovor: $M = 122{,}0\,\mathrm{g/mol}$ (ustreza benzojski kislini), $K_\mathrm{a} \approx 6{,}3 \cdot 10^{-5}$, pH v EP je $8{,}36$; v skok nad $\mathrm{pH}\ 8$ pade fenolftalein, zato izberemo njega.

### Naloga 2

Natančno navedi Henderson-Hasselbalchovo enačbo s pogoji veljavnosti in jo izpelji. Dokaži, da je pri polovici EP titracije šibke kisline z močno bazo $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$. Izpelji še $\mathrm{pH} = 7 + \tfrac12\mathrm{p}K_\mathrm{a} + \tfrac12\log c(\mathrm{A^-})$ za EP in utemelji, ali Henderson-Hasselbalchova enačba velja na začetku titracije in v EP.

**Rešitev:**

1. Naj bo HA šibka kislina s konstanto $K_\mathrm{a}$: $\mathrm{HA + H_2O \rightleftharpoons H_3O^+ + A^-}$, $K_\mathrm{a} = \dfrac{c(\mathrm{H_3O^+})\,c(\mathrm{A^-})}{c(\mathrm{HA})}$ (ravnotežne koncentracije, razredčena raztopina, stalna temperatura).
2. Izrazimo $c(\mathrm{H_3O^+}) = K_\mathrm{a}\dfrac{c(\mathrm{HA})}{c(\mathrm{A^-})}$, logaritmiramo in pomnožimo z $-1$: $\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log\dfrac{c(\mathrm{A^-})}{c(\mathrm{HA})}$.
3. Pogoj: ravnotežne koncentracije zamenjamo z analitskima (koliko HA in A⁻ smo pripravili). To je dovoljeno le, če sta obe mnogo večji od $c(\mathrm{H_3O^+})$ in $c(\mathrm{OH^-})$, sicer protoliza HA ali A⁻ opazno spremeni razmerje.
4. Polovica EP: dodali smo $n(\mathrm{OH^-}) = \tfrac12 n_0(\mathrm{HA})$, zato $n(\mathrm{A^-}) = n(\mathrm{HA}) = \tfrac12 n_0$. Razmerje je $1$, $\log 1 = 0$ in $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$, če je izpolnjen pogoj iz koraka 3.
5. EP: v čaši je le $\mathrm{A^-}$ s koncentracijo $c$. $\mathrm{A^- + H_2O \rightleftharpoons HA + OH^-}$, $K_\mathrm{b} = K_\mathrm{w}/K_\mathrm{a}$ (ker $K_\mathrm{a}K_\mathrm{b} = c(\mathrm{H_3O^+})\,c(\mathrm{OH^-})$). Nastane $c(\mathrm{HA}) \approx c(\mathrm{OH^-}) = y$, in če je $y \ll c$ ter $K_\mathrm{b}c \gg K_\mathrm{w}$ (da je $\mathrm{OH^-}$ iz vode zanemarljiv), je $K_\mathrm{b} \approx y^2/c$, torej $y = \sqrt{K_\mathrm{w}c/K_\mathrm{a}}$.
6. $\mathrm{pOH} = \tfrac12(\mathrm{p}K_\mathrm{w} - \mathrm{p}K_\mathrm{a} - \log c) = 7 - \tfrac12\mathrm{p}K_\mathrm{a} - \tfrac12\log c$ pri $\mathrm{p}K_\mathrm{w} = 14$, zato $\mathrm{pH} = 14 - \mathrm{pOH} = 7 + \tfrac12\mathrm{p}K_\mathrm{a} + \tfrac12\log c$.
7. Na začetku je $c(\mathrm{A^-}) = 0$ (logaritem gre proti $-\infty$), v EP je $c(\mathrm{HA}) = 0$ (proti $+\infty$). V obeh točkah je pogoj iz koraka 3 kršen.
8. Odgovor: Henderson-Hasselbalchova enačba velja le v pufrskem območju med začetkom in EP. Na začetku računamo $\sqrt{K_\mathrm{a}c}$, v EP pa $\mathrm{pH} = 7 + \tfrac12\mathrm{p}K_\mathrm{a} + \tfrac12\log c(\mathrm{A^-})$.

## Drugače: Korak za korakom s številkami

Kako izračunaš pH v katerikoli točki titracije šibke kisline HA z NaOH ($25{,}00\,\mathrm{mL}$, oboje $0{,}1000\,\mathrm{mol/L}$, $\mathrm{p}K_\mathrm{a} = 4{,}76$):

1. **Začetek** ($0\,\mathrm{mL}$): samo šibka kislina, $c(\mathrm{H_3O^+}) = \sqrt{K_\mathrm{a} c}$, $\mathrm{pH} \approx 2{,}88$.
2. **Pred EP** (npr. $20{,}00\,\mathrm{mL}$): pufer HA/A⁻. Nastalo je $2\,\mathrm{mmol}$ A⁻, ostalo $0{,}5\,\mathrm{mmol}$ HA. $\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log\dfrac{2}{0{,}5} \approx 4{,}76 + 0{,}60 = 5{,}36$.
3. **Polovica EP** ($12{,}50\,\mathrm{mL}$): razmerje $1$, $\log 1 = 0$, $\mathrm{pH} = 4{,}76$.
4. **EP** ($25{,}00\,\mathrm{mL}$): samo A⁻ ($0{,}05\,\mathrm{mol/L}$), računaš kot šibko bazo, $\mathrm{pH} \approx 8{,}73$.
5. **Po EP** ($26{,}00\,\mathrm{mL}$): odloča presežek OH⁻, $0{,}1\,\mathrm{mmol}$ v $51\,\mathrm{mL}$, $\mathrm{pH} \approx 11{,}29$, enako kot pri HCl.

V vsakem območju najprej vprašaš: kaj je v čaši? Šele potem izbereš formulo.

## Drugače: Kot zgodba

Predstavljaj si, da je v čaši dvorana, polna protonov, ki bi radi odšli. Iz birete prihajajo hidroksidni ioni, vsak odpelje en proton in z njim postane voda.

Dokler je protonov veliko, odhoda nekaj sto ne opazi nihče: pH se komaj premakne. Ko jih ostane le še peščica, pa vsak nov hidroksid odpelje velik del preostalih. Ko odide zadnji, novi hidroksidi nimajo s kom oditi in ostanejo v dvorani. Ozračje se v trenutku obrne iz kislega v bazično. To je skok.

Pri ocetni kislini so protoni sramežljivi: večina jih ostaja vezana na molekule, zato je dvorana na začetku manj kisla. Hidroksidi jih morajo trgati z molekul, a odpeljejo jih ravno toliko kot prej. Ko odide zadnji, v dvorani ostanejo acetatni ioni, ki si sami malo izposojajo protone od vode in pustijo za sabo nekaj OH⁻. Zato dvorana v EP že rahlo diši po bazi, pH je okoli $8{,}7$.

Indikator je stražar ob vratih, ki zamenja uniformo pri določeni kislosti. Če ga postaviš na napačno mesto, bo oznanil konec prezgodaj ali prepozno.

## Drugače: Uporaba v stroki

- **Standardizacija.** NaOH ni primarni standard: je higroskopen in veže $\mathrm{CO_2}$ iz zraka. Njegovo koncentracijo zato določimo s titracijo natančno odtehtanega kalijevega hidrogenftalata, ki je stabilen, čist in ima veliko molsko maso.
- **Avtomatski titratorji** v kontrolnih laboratorijih dodajajo titrant po delih in EP poiščejo kot maksimum odvoda $\Delta\mathrm{pH}/\Delta V$, torej prevoj krivulje, brez indikatorja.
- **Kjeldahlova metoda** za beljakovine v živilih: dušik pretvorimo v $\mathrm{NH_4^+}$, z bazo sprostimo $\mathrm{NH_3}$, ga predestiliramo v borovo kislino in titriramo s HCl. V EP je amonijev ion, zato je indikator v kislem območju.
- **Kislinsko število** olj in biodizla (mg KOH na gram vzorca) določimo s titracijo s KOH v alkoholu.
- **Šibke baze v zdravilih** (amini) titriramo v brezvodni ocetni kislini s perklorno kislino, ker v vodi skok ni dovolj visok.

## Preveri se

? Katero zaporedje pH (pri $0$, polovici EP, EP in malo po EP) ustreza titraciji ocetne kisline z NaOH?
- $1{,}0 \to 1{,}5 \to 7{,}0 \to 11{,}3$
~ To je krivulja močne kisline: nizek začetek in pH $7$ v EP.
+ $2{,}9 \to 4{,}8 \to 8{,}7 \to 11{,}3$
- $2{,}9 \to 4{,}8 \to 7{,}0 \to 11{,}3$
~ V EP je v čaši acetat, ki je šibka baza, zato pH ni $7$.
- $11{,}3 \to 8{,}7 \to 4{,}8 \to 2{,}9$
~ To bi bila titracija baze s kislino; pri dodajanju NaOH pH raste.
> Šibka kislina začne višje (delna protoliza), pri polovici EP je $\mathrm{pH} = \mathrm{p}K_\mathrm{a} = 4{,}76$, v EP je pH nad $7$, po EP odloča presežek OH⁻.

? Imaš $10\,\mathrm{mL}$ kisline s koncentracijo približno $0{,}5\,\mathrm{mol/L}$ in NaOH s koncentracijo $0{,}1\,\mathrm{mol/L}$. Koliko titranta boš približno porabil?
- okoli $2\,\mathrm{mL}$
~ Obrnil si razmerje koncentracij; titrant je bolj razredčen, zato ga potrebuješ več, ne manj.
- okoli $10\,\mathrm{mL}$
~ Enak volumen velja le, če sta koncentraciji enaki.
+ okoli $50\,\mathrm{mL}$
> $V_\mathrm{b} = c_\mathrm{k} V_\mathrm{k} / c_\mathrm{b} = 0{,}5 \cdot 10 / 0{,}1 = 50\,\mathrm{mL}$. Vzorec je smiselno razredčiti, da porabe ne bo več kot ena bireta.

? Zakaj je pri titraciji šibke kisline z močno bazo pH v ekvivalentni točki višji od $7$?
- Ker je v EP še nekaj NaOH v presežku.
~ V EP presežka ni; dodali smo točno ekvivalentno množino baze.
+ Ker v čaši ostane konjugirana baza šibke kisline, ki z vodo tvori OH⁻.
- Ker šibka kislina porabi več baze kot močna.
~ Za enako množino kisline je poraba baze enaka; razlikuje se samo oblika krivulje.
> Npr. acetat reagira z vodo: $\mathrm{CH_3COO^-} + \mathrm{H_2O} \rightleftharpoons \mathrm{CH_3COOH} + \mathrm{OH^-}$, zato je raztopina rahlo bazična.

? Pri polovici ekvivalentne točke titracije neznane šibke kisline telefon pokaže $\mathrm{pH} = 3{,}75$. Kolikšna je $K_\mathrm{a}$?
- $K_\mathrm{a} = 3{,}75$
~ $3{,}75$ je $\mathrm{p}K_\mathrm{a}$, logaritemska vrednost, ne sama konstanta.
- $K_\mathrm{a} = 10^{-7{,}5}$
~ pH pri polovici EP si podvojil; pri polovici EP velja kar $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$.
+ $K_\mathrm{a} \approx 1{,}8 \cdot 10^{-4}$
> Pri polovici EP je $c(\mathrm{HA}) = c(\mathrm{A^-})$, zato $\mathrm{p}K_\mathrm{a} = 3{,}75$ in $K_\mathrm{a} = 10^{-3{,}75} \approx 1{,}8 \cdot 10^{-4}$ (mravljinčna kislina).

? Čistilo za steklo in zaslone vsebuje amoniak (šibka baza). Titriraš ga s HCl; v EP je $\mathrm{pH} \approx 5{,}3$. Kateri indikator izbereš?
- fenolftalein ($8{,}2$–$10{,}0$)
~ Fenolftalein ustreza šibki kislini z močno bazo; tu je v EP raztopina $\mathrm{NH_4^+}$, ki je kisla.
+ metilrdeče ($4{,}4$–$6{,}2$)
- bromtimolmodro ($6{,}0$–$7{,}6$)
~ Izbira temelji na predpostavki, da je v EP pH $7$; pri šibki bazi je pH v EP pod $7$.
> V EP je amonijev ion, šibka kislina, zato je pH okoli $5{,}3$. To leži v območju metilrdečega.

:::simboli
\mathrm{pH} | pH raztopine | \mathrm{pH} = -\log c(\mathrm{H_3O^+}) | – | pri polovici EP pri šibki kislini pH = pKₐ
n | množina snovi | | mol | v EP: n(kislina) = n(baza) po enačbi reakcije
c | množinska koncentracija | | mol/L
V | prostornina | | mL
c_\mathrm{k} | koncentracija kisline | c_\mathrm{k} = \dfrac{c_\mathrm{b} V_\mathrm{EP}}{V_\mathrm{k}} | mol/L
V_\mathrm{k} | prostornina titrirane kisline | | mL
c_\mathrm{b} | koncentracija baze (titranta) | | mol/L
V_\mathrm{b,EP} | prostornina baze do ekvivalentne točke | | mL
V_\mathrm{EP} | prostornina titranta v ekvivalentni točki | | mL
V_\mathrm{skupaj} | skupna prostornina raztopine v čaši | | mL | prostornina kisline + dodanega titranta
K_\mathrm{a} | konstanta kisline | K_\mathrm{a} = 10^{-\mathrm{p}K_\mathrm{a}} | mol/L | ocetna kislina: 1,75 · 10⁻⁵
\mathrm{p}K_\mathrm{a} | negativni logaritem konstante kisline | \mathrm{p}K_\mathrm{a} = -\log K_\mathrm{a} | – | ocetna kislina: 4,76
K_\mathrm{b} | konstanta baze | K_\mathrm{b} = \dfrac{K_\mathrm{w}}{K_\mathrm{a}} | mol/L | za konjugirano bazo, npr. acetat
K_\mathrm{w} | ionski produkt vode | | mol^2/L^2 | 1,0 · 10⁻¹⁴ pri 25 °C
:::
