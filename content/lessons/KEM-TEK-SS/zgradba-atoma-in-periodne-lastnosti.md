---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na kitari brenkneš prazno struno A. Slišiš ton $110\,\mathrm{Hz}$, poleg njega pa še šibke višje tone: $220\,\mathrm{Hz}$, $330\,\mathrm{Hz}$, $440\,\mathrm{Hz}$. Tona $150\,\mathrm{Hz}$ ta struna ne zaigra nikoli. Vpeta je na obeh koncih, zato na njej obstanejo le valovanja, pri katerih se na struno ujame celo število polovic valovne dolžine.

Zvečer greš mimo stare ulične svetilke z natrijevimi parami. Sveti skoraj samo rumeno, pri valovni dolžini $589\,\mathrm{nm}$. Zelene ali modre svetlobe iz nje ne dobiš, pa naj jo še tako segreješ.

Na videz nimata nič skupnega. Obakrat pa gre za isto idejo: **ujeto valovanje ima le določena dovoljena stanja**. Struna je ujeta med dve vpetji, elektron pa je ujet ob jedru. Ta ideja razloži, zakaj so elementi v periodnem sistemu razvrščeni tako, kot so, zakaj natrij zlahka odda elektron in zakaj fluor elektrone vleče k sebi. Na tekmovanjih iz tega nastanejo naloge, kjer iz niza števil ugotoviš, kateri element se skriva za črko X.

## Razlaga

**Mamljiva slika.** Večina si atom predstavlja kot majhen sončni sistem: elektroni krožijo po tirnicah, lupina je tirnica, in več protonov ko ima jedro, močneje drži vse elektrone. Iz te slike bi sledilo dvoje. Elektron bi lahko imel katerokoli energijo. Prva ionizacijska energija bi po periodi enakomerno rasla. Obe napovedi sta napačni. Popravimo ju po vrsti.

**1. Elektron kot stoječe valovanje.** Ton strune opiše eno celo število: kateri višji ton zveni. Elektron je ujet v treh razsežnostih, zato ga opišejo tri cela števila, četrto pa doda njegova lastna vrtilna količina, spin. To so **kvantna števila**:

| Število | Vrednosti | Pove |
|---|---|---|
| glavno $n$ | $1, 2, \ldots$ | lupino |
| stransko $l$ | $0, 1, \ldots, n-1$ | obliko |
| magnetno $m_l$ | $-l \ldots +l$ | usmerjenost |
| spinsko $m_s$ | $\pm\frac{1}{2}$ | spin |

Glavno število v največji meri določa tudi energijo elektrona. **Orbitala** je območje okoli jedra, ki ga določijo $n$, $l$ in $m_l$. Elektroni z istima $n$ in $l$ tvorijo **podlupino**. Vrednosti $l = 0, 1, 2, 3$ označimo s črkami $s, p, d, f$. Ker ima $m_l$ natanko $2l + 1$ vrednosti, ima podlupina $s$ eno orbitalo, $p$ tri, $d$ pet in $f$ sedem.

**Paulijevo izključitveno načelo** pravi, da v atomu nobena dva elektrona nimata vseh štirih kvantnih števil enakih. V eni orbitali sta torej največ dva elektrona, z nasprotnima spinoma. Lupina $n$ ima skupaj

$$N_\mathrm{orb} = n^2$$

orbital in zato največ $2n^2$ elektronov.

**Hundovo pravilo** pove, kako se polni podlupina: elektroni najprej zasedejo vsak svojo orbitalo z enakim spinom, šele nato se v orbitalah seznanijo.

**2. Ionizacijska energija.** **Prva ionizacijska energija** $E_{\mathrm{i},1}$ je energija, ki jo porabimo, da 1 mol atomov v plinastem stanju odda po en elektron:

$$\mathrm{X(g)} \rightarrow \mathrm{X^+(g)} + \mathrm{e^-}$$

Proces je endotermen, zato je $E_{\mathrm{i},1}$ vedno pozitivna. Druga ionizacijska energija $E_{\mathrm{i},2}$ odtrga elektron z iona $\mathrm{X^+}$, tretja z $\mathrm{X^{2+}}$ in tako naprej.

Koliko zunanji elektron čuti jedro, pove **efektivni naboj jedra**. Notranji elektroni naboj jedra zasenčijo:

$$Z_\mathrm{ef} \approx Z - S$$

Tu je $Z$ vrstno število, $S$ pa število notranjih elektronov. Pri natriju je $Z_\mathrm{ef} \approx 11 - 10 = 1$, pri kloru $Z_\mathrm{ef} \approx 17 - 10 = 7$. Po periodi $Z_\mathrm{ef}$ raste, lupina pa ostane ista. Zato ionizacijska energija v grobem raste. Navzdol po skupini je zunanji elektron v višji lupini, dlje od jedra, zato ionizacijska energija pada.

:::risba stolpci
opis: Prve ionizacijske energije elementov 2. periode v kJ/mol: Li 520, Be 900, B 801, C 1086, N 1402, O 1314, F 1681, Ne 2081. Trend raste, a bor je nižje od berilija in kisik nižje od dušika.
podnapis: Prva ionizacijska energija v 2. periodi
os: kJ/mol
korak: 500
stolpec: Li | 520
stolpec: Be | 900
stolpec: B | 801
stolpec: C | 1086
stolpec: N | 1402
stolpec: O | 1314
stolpec: F | 1681
stolpec: Ne | 2081
:::

Trend raste, a z dvema zarezama. Bor je nižje od berilija: njegov zadnji elektron je v podlupini $2p$, ki ima višjo energijo kot $2s$ in jo $2s$ elektroni delno zasenčijo.

:::premisli
Kisik ima en proton več kot dušik, pa vendar nižjo prvo ionizacijsko energijo. Zakaj? Pomagaj si s tem, kako so razporejeni elektroni v $2p$.
---
Dušik ima $2p^3$: po Hundovem pravilu je v vsaki od treh orbital $2p$ en elektron. Kisik ima $2p^4$, zato sta v eni orbitali dva elektrona. Odbijata se, zato enega od njiju laže odtrgamo, čeprav je naboj jedra večji.
:::

**Zaporedne ionizacijske energije** vedno rastejo, saj odtrgaš elektron z vedno bolj pozitivnega iona. Ko pa začneš trgati iz notranje lupine z elektronsko konfiguracijo žlahtnega plina, ionizacijska energija skoči za večkratnik. Število elektronov pred tem skokom je število valenčnih elektronov.

**3. Elektronegativnost.** **Elektronegativnost** $\chi$ pove, kako močno atom v vezi vleče skupni elektronski par k sebi. Raste po periodi v desno in navzgor po skupini, iz istih razlogov kot ionizacijska energija. Najvišjo ima fluor, $\chi = 3{,}98$.

Pauling jo je izračunal iz energij vezi. Če bi si atoma A in B elektrona delila povsem enakomerno, bi bila energija vezi A–B povprečje energij vezi A–A in B–B. Resnična vez je močnejša. Presežek $\Delta$ izvira iz neenake delitve elektronov:

$$\Delta = D_\mathrm{AB} - \frac{D_\mathrm{AA} + D_\mathrm{BB}}{2}$$

$$|\chi_\mathrm{A} - \chi_\mathrm{B}| = \sqrt{\frac{\Delta}{96{,}5\,\mathrm{kJ/mol}}}$$

Število $96{,}5\,\mathrm{kJ/mol}$ je $1\,\mathrm{eV}$ na delec, preračunano na mol. Lestvico pritrdimo z dogovorom $\chi(\mathrm{H}) = 2{,}20$.

:::premisli
Klor ima 17 protonov, fluor le 9. Oceni $Z_\mathrm{ef}$ za oba. Če je enak, kaj potem odloči, da ima fluor večjo elektronegativnost?
---
Oba imata $Z_\mathrm{ef} \approx 7$, ker notranji elektroni zasenčijo vse ostale protone. Fluorovi valenčni elektroni so v lupini $n = 2$, klorovi v $n = 3$. Pri fluoru je skupni par bliže jedru, zato ga jedro močneje privlači.
:::

## Rešeni primeri

### Primer 1: kapaciteta lupine

Koliko podlupin, koliko orbital in največ koliko elektronov ima lupina $n = 4$?

**Podatki:** glavno kvantno število $n = 4$
**Iščemo:** možne vrednosti $l$, število orbital $N_\mathrm{orb}$, največje število elektronov

:::formula
$l = 0, 1, \ldots, n - 1$; vsaka podlupina ima $2l + 1$ orbital; v orbitali sta največ 2 elektrona.
:::

**Rešitev:**

1. Za $n = 4$ je $l = 0, 1, 2, 3$, torej štiri podlupine: $4s$, $4p$, $4d$, $4f$.
2. Število orbital po podlupinah je $1, 3, 5, 7$, ker ima $m_l$ po $2l + 1$ vrednosti.
3. Skupaj: $1 + 3 + 5 + 7 = 16$, kar se ujema z $n^2 = 16$.
4. Elektronov je največ $2 \cdot 16 = 32$, ker sta v vsaki orbitali največ dva.
5. Odgovor: lupina $n = 4$ ima 4 podlupine, 16 orbital in prostor za največ 32 elektronov.

### Primer 2: element X iz zaporednih ionizacijskih energij

Element X je v 3. periodi. Njegove prve štiri ionizacijske energije so $578$; $1817$; $2745$ in $11577\,\mathrm{kJ/mol}$. Kateri element je X?

**Podatki:** 3. perioda; $E_{\mathrm{i},1} = 578\,\mathrm{kJ/mol}$, $E_{\mathrm{i},2} = 1817\,\mathrm{kJ/mol}$, $E_{\mathrm{i},3} = 2745\,\mathrm{kJ/mol}$, $E_{\mathrm{i},4} = 11577\,\mathrm{kJ/mol}$
**Iščemo:** število valenčnih elektronov, skupino in element X

:::formula
Izračunaj količnike $\dfrac{E_{\mathrm{i},k+1}}{E_{\mathrm{i},k}}$. Največji količnik pokaže prehod v notranjo lupino.
:::

**Rešitev:**

1. $\dfrac{E_{\mathrm{i},2}}{E_{\mathrm{i},1}} = \dfrac{1817}{578} \approx 3{,}14$
2. $\dfrac{E_{\mathrm{i},3}}{E_{\mathrm{i},2}} = \dfrac{2745}{1817} \approx 1{,}51$
3. $\dfrac{E_{\mathrm{i},4}}{E_{\mathrm{i},3}} = \dfrac{11577}{2745} \approx 4{,}22$, največji skok.
4. Pred skokom so trije elektroni, torej ima X tri valenčne elektrone. Prvi količnik je sicer tudi velik, a gre le za prehod s $3p$ na $3s$ v isti lupini.
5. Odgovor: X je v 13. skupini in 3. periodi, to je aluminij, $\mathrm{Al}$.

### Primer 3: svetloba, ki ionizira natrij

Prva ionizacijska energija natrija je $496\,\mathrm{kJ/mol}$. Kolikšna je največja valovna dolžina svetlobe, ki še ionizira atom natrija? Kolikšna je njena frekvenca, primerjana s komornim tonom $440\,\mathrm{Hz}$? Ali natrij ionizira lastna rumena svetloba z $589\,\mathrm{nm}$?

**Podatki:** $E_{\mathrm{i},1} = 496\,\mathrm{kJ/mol}$, $N_\mathrm{A} = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$, $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$, $c = 2{,}998 \cdot 10^{8}\,\mathrm{m/s}$, $f_\mathrm{a} = 440\,\mathrm{Hz}$, $\lambda_\mathrm{rum} = 589\,\mathrm{nm}$
**Iščemo:** največjo valovno dolžino $\lambda$, frekvenco $f$ in odgovor da/ne

:::formula
Energija na atom $E = \dfrac{E_{\mathrm{i},1}}{N_\mathrm{A}}$; energija fotona $E = hf = \dfrac{hc}{\lambda}$
:::

**Rešitev:**

1. Ionizacijska energija je podana za mol, en foton pa ionizira en atom: $E = \dfrac{496\,000\,\mathrm{J/mol}}{6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}} \approx 8{,}24 \cdot 10^{-19}\,\mathrm{J}$.
2. Daljša valovna dolžina pomeni manjšo energijo, zato mejni foton nosi natanko $E$: $\lambda = \dfrac{hc}{E} \approx 2{,}41 \cdot 10^{-7}\,\mathrm{m} = 241\,\mathrm{nm}$. To je ultravijolična svetloba.
3. Frekvenca: $f = \dfrac{E}{h} \approx 1{,}24 \cdot 10^{15}\,\mathrm{Hz}$, kar je približno $2{,}8 \cdot 10^{12}$-krat več od $440\,\mathrm{Hz}$.
4. Rumena svetloba ima $589\,\mathrm{nm} > 241\,\mathrm{nm}$, torej manj energije na foton. Atom lahko le vzbudi ($3s \rightarrow 3p$), ionizirati ga ne more.
5. Odgovor: natrij ionizira svetloba z valovno dolžino do $241\,\mathrm{nm}$ (frekvenca vsaj $1{,}24 \cdot 10^{15}\,\mathrm{Hz}$); lastna rumena svetloba ga ne ionizira.

### Primer 4: zdaj ti

Iz energij vezi določi elektronegativnost klora: $D(\mathrm{H{-}Cl}) = 431\,\mathrm{kJ/mol}$, $D(\mathrm{H{-}H}) = 436\,\mathrm{kJ/mol}$, $D(\mathrm{Cl{-}Cl}) = 242\,\mathrm{kJ/mol}$, $\chi(\mathrm{H}) = 2{,}20$.

**Podatki:** $D_\mathrm{HCl} = 431\,\mathrm{kJ/mol}$, $D_\mathrm{HH} = 436\,\mathrm{kJ/mol}$, $D_\mathrm{ClCl} = 242\,\mathrm{kJ/mol}$, $\chi(\mathrm{H}) = 2{,}20$
**Iščemo:** $\chi(\mathrm{Cl})$

:::formula
$\Delta = D_\mathrm{AB} - \dfrac{D_\mathrm{AA} + D_\mathrm{BB}}{2}$, $|\chi_\mathrm{A} - \chi_\mathrm{B}| = \sqrt{\dfrac{\Delta}{96{,}5\,\mathrm{kJ/mol}}}$
:::

**Rešitev:**

1. Povprečje nepolarnih vezi: $\dfrac{436 + 242}{2} = 339$, v $\mathrm{kJ/mol}$.
2. Presežek: $\Delta = 431 - 339 = 92$, v $\mathrm{kJ/mol}$.
3. Klor je nekovina desno zgoraj, zato bo imel večjo elektronegativnost kot vodik. Izračunaj razliko in $\chi(\mathrm{Cl})$ sam, nato preveri:

:::premisli
Koliko je $\chi(\mathrm{Cl})$?
---
$|\chi_\mathrm{Cl} - \chi_\mathrm{H}| = \sqrt{\dfrac{92}{96{,}5}} \approx 0{,}98$, zato je $\chi(\mathrm{Cl}) \approx 2{,}20 + 0{,}98 = 3{,}18$. V tabelah piše $3{,}16$: metoda je dobra na nekaj stotink.
:::

## Pogoste napake

- **»Ionizacijska energija po periodi vedno raste.«** Kdor tako sklepa, razvrsti $\mathrm{Mg}$ pred $\mathrm{Al}$. Zareze pri 13. in 16. skupini so resnične: elektron v novi podlupini $p$ in prvi seznanjeni elektron $p$ gresta laže. Pred razvrščanjem preveri, kateri element začne podlupino $p$ ali v njej prvič seznani elektrone.
- **»Več protonov pomeni močnejši privlak.«** Navzdol po skupini $Z$ raste, ionizacijska energija in elektronegativnost pa padata. Šteje $Z_\mathrm{ef}$ in razdalja od jedra, ne golo število protonov.
- **Napačne vrednosti $l$ in $m_l$.** Orbitala $2d$ ne obstaja, ker je $l \le n - 1$. Vrednosti $m_l$ gredo od $-l$ do $+l$, ne od $0$ do $l$, zato ima $p$ tri orbitale, ne dve.
- **Napačno mesto skoka.** Pri zaporednih ionizacijskih energijah je število valenčnih elektronov enako številu energij *pred* največjim skokom. Kdor prišteje še energijo za skokom, dobi skupino previsoko.
- **Pauling brez korena ali brez $96{,}5$.** Razlika elektronegativnosti je koren iz $\Delta$ v elektronvoltih. Brez korena dobiš premajhno razliko, brez deljenja pa nesmiselno veliko.

## Povzetek

- Stanje elektrona opišejo štiri kvantna števila: $n \ge 1$, $0 \le l \le n - 1$, $-l \le m_l \le l$, $m_s = \pm\frac{1}{2}$.
- Podlupina ima $2l + 1$ orbital, lupina $n^2$ orbital in največ $2n^2$ elektronov (Paulijevo načelo).
- Prva ionizacijska energija raste po periodi (večji $Z_\mathrm{ef}$) in pada po skupini (večji $n$); zarezi sta pri 13. in 16. skupini.
- Zaporedne ionizacijske energije rastejo; največji skok pokaže število valenčnih elektronov.
- Elektronegativnost raste desno in navzgor; Paulingova razlika je $\sqrt{\Delta / 96{,}5\,\mathrm{kJ/mol}}$, kjer je $\Delta$ presežek energije vezi.

## Drugače: Kot zgodba

Elektron Nejc živi v natrijevem atomu, v orbitali $3s$. Pod njim je deset elektronov v lupinah $n = 1$ in $n = 2$. Ko pogleda proti jedru, enajstih protonov skoraj ne vidi: deset jih zakrijejo spodnji sosedje. Čuti le privlak enega naboja. Ko pride ultravijolični foton z dovolj energije, Nejc brez težav odide. To je $496\,\mathrm{kJ/mol}$.

Za njim ostane njegova soseda Ana v orbitali $2p$. Ona je v lupini $n = 2$, tik ob jedru, in nad sabo nima nikogar. Zasenčita jo le dva elektrona v lupini $n = 1$, zato čuti skoraj devet protonov. Da bi odšla, rabi več kot devetkrat več energije: $4562\,\mathrm{kJ/mol}$.

Klorov elektron v $3p$ ima drugačno usodo. Pod njim je prav tako deset elektronov, a v jedru je 17 protonov, zato čuti sedem nabojev. Ne le, da ne odide rad: ko klor tvori vez z vodikom, skupni par potegne k sebi. Tako se začne zgodba o elektronegativnosti.

## Drugače: Korak za korakom s številkami

Naloge »koliko elektronov ima lahko …« rešiš vedno enako. Primer: koliko elektronov ima lahko $n = 4$ in $m_l = 0$?

1. Zapiši dovoljene $l$ za dani $n$: $l = 0, 1, 2, 3$.
2. Za vsak $l$ preveri, ali dovoli dani $m_l$. Vrednost $m_l = 0$ dovolijo vsi štirje.
3. Vsak dovoljen par $(l, m_l)$ je ena orbitala: 4 orbitale.
4. Pomnoži z 2 zaradi spina: $4 \cdot 2 = 8$ elektronov.
5. Če je podan tudi $m_s$, ne množi z 2.

Še en primer z istim postopkom: $n = 3$, $m_s = +\frac{1}{2}$. Lupina ima $3^2 = 9$ orbital, v vsaki je en elektron z $m_s = +\frac{1}{2}$. Odgovor je 9.

## Preveri se

? Kitarist igra flažolet: struna niha s tremi polovicami valovne dolžine. Pri elektronu ima podobno vlogo celo število. Elektron je v orbitali $3p$. Katero kvantno število pove, da je orbitala tipa $p$ in ne $s$ ali $d$?
- glavno kvantno število $n = 3$
~ $n$ pove lupino in velikost orbitale. V lupini $n = 3$ so orbitale $s$, $p$ in $d$.
+ stransko kvantno število $l = 1$
- magnetno kvantno število $m_l$
~ $m_l$ pove le, kako je orbitala usmerjena v prostoru, na primer $p_x$ ali $p_z$.
- spinsko kvantno število $m_s$
~ $m_s$ opiše elektron, ne oblike orbitale; v isti orbitali sta lahko dva elektrona z različnima $m_s$.
> Obliko orbitale določa $l$: $l = 0$ je $s$, $l = 1$ je $p$, $l = 2$ je $d$.

? Razvrsti elemente po prvi ionizacijski energiji od najmanjše do največje.
1. $\mathrm{Na}$
2. $\mathrm{Al}$
3. $\mathrm{Mg}$
4. $\mathrm{Si}$
> $\mathrm{Na}$ $496$, $\mathrm{Al}$ $578$, $\mathrm{Mg}$ $738$, $\mathrm{Si}$ $786\,\mathrm{kJ/mol}$. Aluminij je pod magnezijem, ker je njegov zadnji elektron v novi podlupini $3p$.

? Kaj se zgodi s prvo ionizacijsko energijo, ko v 2. periodi greš od dušika ($Z = 7$) do kisika ($Z = 8$)?
- Naraste, ker ima kisik en proton več.
~ To je splošni trend, a tu ga preglasi odboj dveh elektronov v isti orbitali $2p$.
+ Se zmanjša, ker sta pri kisiku v eni orbitali $2p$ prvič dva elektrona, ki se odbijata.
- Ostane enaka, ker sta oba elementa v isti lupini.
~ Ista lupina ne pomeni iste energije: $Z_\mathrm{ef}$ in razporeditev elektronov se spremenita.
- Močno skoči, ker kisik začne novo lupino.
~ Velik skok vidiš pri *zaporednih* ionizacijskih energijah istega atoma, ko trgaš iz notranje lupine. Kisik nove lupine ne začne.
> Dušik: $1402$, kisik: $1314\,\mathrm{kJ/mol}$. Seznanjeni elektron v $2p^4$ je laže odtrgati.

? Stolpci kažejo prve štiri zaporedne ionizacijske energije elementa X iz 3. periode. Koliko valenčnih elektronov ima X?
:::risba stolpci
opis: Zaporedne ionizacijske energije elementa X v kJ/mol: prva 738, druga 1451, tretja 7733, četrta 10543.
os: kJ/mol
korak: 2000
stolpec: 1. | 738
stolpec: 2. | 1451
stolpec: 3. | 7733
stolpec: 4. | 10543
:::
= 2
~ 3 | Šteješ tudi tretjo energijo, ki je že za skokom. Valenčni so elektroni pred skokom.
~ 4 | Vsi narisani elektroni niso valenčni. Poišči največji skok med sosednjima stolpcema.
~ 1 | Druga energija je sicer dvakrat večja od prve, a to je običajna rast. Pravi skok je med drugo in tretjo, za faktor približno 5.
> Med 2. in 3. energijo je skok za faktor $7733 / 1451 \approx 5{,}3$. X ima dva valenčna elektrona: to je magnezij.

? Energije vezi so $D(\mathrm{H{-}Br}) = 366\,\mathrm{kJ/mol}$, $D(\mathrm{H{-}H}) = 436\,\mathrm{kJ/mol}$ in $D(\mathrm{Br{-}Br}) = 193\,\mathrm{kJ/mol}$, $\chi(\mathrm{H}) = 2{,}20$. Izračunaj Paulingovo elektronegativnost broma na dve decimalki.
= 2,93 | 0,02
~ 2,73 | Pozabil si koren: $\frac{51{,}5}{96{,}5} = 0{,}53$ je kvadrat razlike, ne razlika.
~ 9,38 | Pozabil si deliti s $96{,}5\,\mathrm{kJ/mol}$, zato je razlika nesmiselno velika.
~ 1,47 | Razliko si odštel. Brom je bolj elektronegativen od vodika, zato jo prišteješ.
> $\Delta = 366 - \frac{436 + 193}{2} = 51{,}5\,\mathrm{kJ/mol}$, $\sqrt{51{,}5 / 96{,}5} \approx 0{,}73$, $\chi(\mathrm{Br}) \approx 2{,}93$ (v tabelah $2{,}96$).

<<RACUN
vrednost: 11-10 | 1
vrednost: 17-10 | 7
vrednost: 1+3+5+7 | 16
vrednost: 2*16 | 32
vrednost: 1817/578 | 3.14
vrednost: 2745/1817 | 1.51
vrednost: 11577/2745 | 4.22
vrednost: 496000/(6.022*10^23) | 8.24*10^-19
vrednost: 6.626*10^-34*2.998*10^8*6.022*10^23/496000 | 2.41*10^-7
vrednost: 496000/(6.022*10^23*6.626*10^-34) | 1.24*10^15
vrednost: 496000/(6.022*10^23*6.626*10^-34)/440 | 2.8*10^12
vrednost: (436+242)/2 | 339
vrednost: 431-339 | 92
vrednost: 2.20+sqrt(92/96.5) | 3.18
vrednost: 4562/496 | 9.2
vrednost: 7733/1451 | 5.3
vrednost: 366-(436+193)/2 | 51.5
vrednost: 2.20+sqrt(51.5/96.5) | 2.93
>>

:::simboli
N_\mathrm{orb} | število orbital v lupini | N_\mathrm{orb} = n^2 | – |
n | glavno kvantno število | | – | lupina: $1, 2, 3, \ldots$
l | stransko kvantno število | | – | od $0$ do $n - 1$
m_l | magnetno kvantno število | | – | od $-l$ do $+l$
m_s | spinsko kvantno število | | – | $+\frac{1}{2}$ ali $-\frac{1}{2}$
Z_\mathrm{ef} | efektivni naboj jedra | Z_\mathrm{ef} \approx Z - S | – | naboj, ki ga čuti zunanji elektron
Z | vrstno število | | – |
S | število notranjih elektronov (senčenje) | | – |
D_\mathrm{AB} | energija vezi A–B | | kJ/mol |
D_\mathrm{AA}, D_\mathrm{BB} | energija nepolarne vezi A–A oziroma B–B | | kJ/mol |
\chi_\mathrm{A}, \chi_\mathrm{B} | elektronegativnost atoma A oziroma B | | – | Paulingova lestvica, $\chi(\mathrm{H}) = 2{,}20$
E_{\mathrm{i},1} | prva ionizacijska energija | | kJ/mol | na mol atomov v plinu
E_{\mathrm{i},k} | $k$-ta zaporedna ionizacijska energija | | kJ/mol |
E | energija fotona oziroma ionizacije enega atoma | E = hf = \frac{hc}{\lambda} | J |
N_\mathrm{A} | Avogadrova konstanta | | mol^{-1} | $6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$
h | Planckova konstanta | | J\,s | $6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$
f | frekvenca svetlobe | f = \frac{E}{h} | Hz |
c | hitrost svetlobe | | m/s |
\lambda | valovna dolžina svetlobe | \lambda = \frac{hc}{E} | m |
:::
