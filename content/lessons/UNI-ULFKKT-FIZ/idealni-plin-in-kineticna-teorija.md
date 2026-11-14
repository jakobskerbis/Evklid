---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Po dolgi vožnji po avtocesti pokaže merilnik v pnevmatikah višji tlak kot zjutraj pred hišo. Zaprta vrečka čipsa, kupljena v dolini, je na vrhu Vršiča napeta kot balon. Enkrat se plin segreje, drugič se zmanjša zunanji tlak, a oba pojava opiše ista zveza med tlakom $p$, prostornino $V$ in temperaturo $T$: **plinska enačba** $pV = nRT$.

Kinetična teorija pokaže, **zakaj** ta enačba velja: tlak so sunki ogromnega števila molekul ob stene, temperatura pa meri, kako hitro se molekule gibljejo. Iz te slike sledita tudi **notranja energija** plina in njegove **toplotne kapacitete**, ki jih potrebuješ pri termodinamiki, kemijski kinetiki, difuziji in fiziologiji dihanja.

## Razlaga

### Najprej slika: molekule v škatli

Nariši si škatlo z redko posejanimi pikami, ki letijo v vse smeri, se odbijajo od sten in le redko zadenejo druga drugo. Vsak odboj je drobna puščica sunka na steno. Vse, kar sledi, je branje te slike: koliko je pik (množina), kako pogosto in kako močno udarjajo (tlak) in kako hitre so (temperatura).

**1. Model idealnega plina.** Idealni plin je model, v katerem:

- so molekule zelo majhne v primerjavi z razdaljami med njimi (njihova lastna prostornina je zanemarljiva),
- med molekulami ni privlačnih ali odbojnih sil, razen ob trkih,
- so trki med molekulami in s stenami prožni,
- je gibanje molekul naključno, vse smeri so enakovredne.

Model dobro opiše realne pline pri tlakih do nekaj barov in temperaturah daleč nad vreliščem.

**2. Množina snovi in temperatura.** Množina $n$ (enota $\mathrm{mol}$) je povezana s številom molekul $N$ prek Avogadrove konstante: $N = nN_A$, $N_A = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$. Masa je $m = nM$, kjer je $M$ molska masa. V plinskih enačbah je temperatura vedno **absolutna**, v kelvinih: $T/\mathrm{K} = t/{}^\circ\mathrm{C} + 273{,}15$.

### Od slike do enačb

**3. Plinska enačba.** Naj bo $n$ molov idealnega plina v ravnovesnem stanju (tlak in temperatura sta povsod v posodi enaka) pri absolutni temperaturi $T$. Potem velja **plinska enačba**

$$pV = nRT = Nk_BT,$$

kjer je $R = 8{,}314\,\mathrm{J/(mol\,K)}$ splošna plinska konstanta in $k_B = R/N_A = 1{,}381 \cdot 10^{-23}\,\mathrm{J/K}$ Boltzmannova konstanta. Za stalno množino plina, ki preide iz stanja 1 v stanje 2, velja $\dfrac{p_1V_1}{T_1} = \dfrac{p_2V_2}{T_2}$.

*Izpeljava iz plinskih zakonov.* Plin iz stanja $(p_1, V_1, T_1)$ najprej pri stalni temperaturi stisnemo do tlaka $p_2$; po Boylovem zakonu ($pV$ stalen) je $V' = p_1V_1/p_2$. Nato ga pri stalnem tlaku $p_2$ segrejemo na $T_2$; po Gay-Lussacovem zakonu ($V/T$ stalen) je $V_2 = V'T_2/T_1$. Iz obeh zvez sledi $p_2V_2/T_2 = p_1V_1/T_1$, torej je $pV/T$ za dano množino stalen. Po Avogadrovem zakonu (enake prostornine plinov pri enakih $p$ in $T$ vsebujejo enako število molekul) je ta stalnica sorazmerna z $n$, kar zapišemo kot $nR$. Posebni primeri so:

| Sprememba | Stalno | Zveza | Primer iz vsakdana |
|---|---|---|---|
| **izotermna** | $T$ | $pV = \text{konst.}$ (Boyle-Mariotte) | zrak v pljučih potapljača, ki se dviga |
| **izobarna** | $p$ | $V/T = \text{konst.}$ (Gay-Lussac) | mehka plastična vrečka z zrakom se na soncu napihne |
| **izohorna** | $V$ | $p/T = \text{konst.}$ | pnevmatika se med vožnjo segreje |

Pri $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$ zavzame $1\,\mathrm{mol}$ idealnega plina $22{,}4\,\mathrm{L}$. Iz plinske enačbe sledi tudi gostota plina $\rho = pM/(RT)$.

:::premisli
Zakaj se vrečka čipsa na prelazu napihne, čeprav vanjo ni prišel noben plin?
---
Množina plina v vrečki je enaka, temperatura skoraj tudi. Zunanji tlak je na višini manjši, zato se vrečka razteza, dokler se tlak v njej ne izenači z zunanjim; pri stalnem $nT$ manjši $p$ pomeni večjo $V$.
:::

**4. Tlak iz kinetične teorije.** **Izrek.** Naj bo v posodi s prostornino $V$ idealni plin iz $N$ enakih molekul z maso $m_0$, ki se prožno odbijajo od sten. Potem je

$$p = \frac{1}{3}\frac{N}{V}m_0\langle v^2\rangle = \frac{2}{3}\frac{N}{V}\langle W_k\rangle,$$

kjer oklepaja $\langle\ \rangle$ pomenita povprečje po vseh molekulah: $\langle v^2\rangle$ je povprečje kvadrata hitrosti, $\langle W_k\rangle = \tfrac{1}{2}m_0\langle v^2\rangle$ pa povprečna kinetična energija translacijskega gibanja ene molekule.

*Izpeljava (posoda je kocka s stranico $L$).* Molekula s komponento hitrosti $v_x$ se od stene odbije z $-v_x$ in steni preda gibalno količino $2m_0v_x$. Do iste stene se vrne po času $2L/v_x$, zato je njena povprečna sila na steno $2m_0v_x/(2L/v_x) = m_0v_x^2/L$. Vseh $N$ molekul deluje s silo $Nm_0\langle v_x^2\rangle/L$ na ploščino $L^2$, torej $p = Nm_0\langle v_x^2\rangle/V$. Ker so vse smeri enakovredne, je $\langle v_x^2\rangle = \tfrac{1}{3}\langle v^2\rangle$. (Izpeljava za posodo poljubne oblike je v razdelku »Bolj natančno«.)

**5. Pomen temperature.** Primerjamo izraz za tlak s plinsko enačbo $pV = Nk_BT$ in dobimo

$$\langle W_k\rangle = \tfrac{3}{2}k_BT.$$

**Absolutna temperatura je mera za povprečno kinetično energijo naključnega gibanja molekul.** Pri isti temperaturi imajo molekule vseh plinov enako povprečno kinetično energijo, lažje molekule pa se zato gibljejo hitreje. Koren povprečnega kvadrata hitrosti je

$$v_{\text{ef}} = \sqrt{\langle v^2\rangle} = \sqrt{\frac{3k_BT}{m_0}} = \sqrt{\frac{3RT}{M}}.$$

:::premisli
Molekule vodika ($M = 2\,\mathrm{g/mol}$) in kisika ($M = 32\,\mathrm{g/mol}$) so v isti posodi. Katere so hitrejše in kolikokrat?
---
Pri isti temperaturi imajo enako $\langle W_k\rangle$, zato je $v_{\text{ef}} \propto 1/\sqrt{M}$. Vodik je hitrejši za faktor $\sqrt{32/2} = 4$.
:::

### Energija plina

**6. Notranja energija in ekviparticijski izrek.** Notranja energija $W_n$ (v kemiji in tehniki $U$) idealnega plina je vsota energij vseh molekul. Ker med molekulami ni sil, je odvisna le od temperature. **Prostostna stopnja** je en neodvisen način, na katerega molekula hrani energijo, na primer gibanje vzdolž ene osi ali vrtenje okoli ene osi. **Ekviparticijski izrek.** Naj bo sistem v toplotnem ravnovesju pri temperaturi $T$ in naj bo $k_BT$ velik v primerjavi z razmiki med energijskimi nivoji (klasično obnašanje). Potem vsaka prostostna stopnja, ki v energiji molekule nastopa s kvadratnim členom (na primer $\tfrac{1}{2}m_0v_x^2$ ali kinetična energija vrtenja okoli ene osi), prispeva v povprečju $\tfrac{1}{2}k_BT$ na molekulo:

- **enoatomni plin** (He, Ne, Ar): 3 translacijske prostostne stopnje, $W_n = \tfrac{3}{2}nRT$;
- **dvoatomni plin** ($\mathrm{N_2}$, $\mathrm{O_2}$, zrak) pri sobni temperaturi: 3 translacijske in 2 rotacijski, $W_n = \tfrac{5}{2}nRT$;
- **večatomne nelinearne molekule** ($\mathrm{H_2O}$, $\mathrm{CH_4}$): 3 translacijske in 3 rotacijske, $W_n \approx 3nRT$.

Splošno je $W_n = \tfrac{f}{2}nRT$, kjer je $f$ število prostostnih stopenj. Nihanje vezi pri sobni temperaturi večinoma še ni vzbujeno (kvantni pojav), pri visokih temperaturah pa prispeva dodatno.

**7. Toplotne kapacitete.** Toplotna kapaciteta pove, koliko toplote potrebujemo, da telo segrejemo za $1\,\mathrm{K}$. Molski toplotni kapaciteti plina sta definirani kot $C_V = \dfrac{1}{n}\left(\dfrac{\mathrm{d}Q}{\mathrm{d}T}\right)_V$ in $C_p = \dfrac{1}{n}\left(\dfrac{\mathrm{d}Q}{\mathrm{d}T}\right)_p$:

- pri **stalni prostornini** plin ne opravlja dela, vsa toplota gre v notranjo energijo: $Q_V = nC_V\Delta T$, in ker je $W_n = \tfrac{f}{2}nRT$, je $C_V = \tfrac{f}{2}R$;
- pri **stalnem tlaku** se plin razteza in opravi delo $p\Delta V = nR\Delta T$, zato potrebuje več toplote: $Q_p = nC_p\Delta T$.

Za idealni plin velja **Mayerjeva enačba**

$$C_p = C_V + R.$$

*Dokaz.* Po prvem zakonu termodinamike je $Q = \Delta W_n + p\Delta V$. Notranja energija idealnega plina je odvisna le od $T$, zato je $\Delta W_n = nC_V\Delta T$ pri vsaki spremembi. Pri stalnem tlaku je iz plinske enačbe $p\Delta V = nR\Delta T$, torej $nC_p\Delta T = nC_V\Delta T + nR\Delta T$ in $C_p - C_V = R$.

Razmerje $\kappa = C_p/C_V$ (adiabatni eksponent) je $5/3 \approx 1{,}67$ za enoatomne in $7/5 = 1{,}40$ za dvoatomne pline. Tu sta $C_V$ in $C_p$ molski toplotni kapaciteti v $\mathrm{J/(mol\,K)}$; specifični toplotni kapaciteti (na kilogram) dobimo z deljenjem z molsko maso: $c = C/M$.

**8. Realni plini (na kratko).** Pri visokih tlakih ali nizkih temperaturah postanejo pomembni lastna prostornina molekul in privlak med njimi. Van der Waalsova enačba $\left(p + \dfrac{an^2}{V^2}\right)(V - nb) = nRT$ ju upošteva s konstantama $a$ in $b$, ki sta značilni za plin.

## Rešeni primeri

### Primer 1 (lažji)

Za bazni tabor alpinistične odprave na osemtisočak napolnijo jeklenko s prostornino $20\,\mathrm{L}$; vsebuje kisik pod tlakom $150\,\mathrm{bar}$ pri temperaturi $20\,^\circ\mathrm{C}$. Kolikšna sta množina in masa kisika? Kolikšno prostornino bi ta kisik zavzel pri $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$? Kisik obravnavaj kot idealni plin.

**Podatki:** $V = 20\,\mathrm{L} = 0{,}020\,\mathrm{m^3}$, $p = 150\,\mathrm{bar} = 1{,}50 \cdot 10^7\,\mathrm{Pa}$, $T = 293{,}15\,\mathrm{K}$, $M(\mathrm{O_2}) = 32\,\mathrm{g/mol}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$; normalni pogoji $T_0 = 273{,}15\,\mathrm{K}$, $p_0 = 101\,325\,\mathrm{Pa}$
**Iščemo:** množino $n$, maso $m$, prostornino $V_0$ pri normalnih pogojih

:::formula
$pV = nRT \Rightarrow n = \dfrac{pV}{RT}$, $m = nM$, $V_0 = \dfrac{nRT_0}{p_0}$
:::

**Rešitev:**

1. Množina iz plinske enačbe (tlak v $\mathrm{Pa}$ in prostornina v $\mathrm{m^3}$, da se enote ujemajo z $R$): $n = \dfrac{1{,}50 \cdot 10^7\,\mathrm{Pa} \cdot 0{,}020\,\mathrm{m^3}}{8{,}314\,\mathrm{J/(mol\,K)} \cdot 293{,}15\,\mathrm{K}} = \dfrac{3{,}00 \cdot 10^5\,\mathrm{J}}{2437\,\mathrm{J/mol}} \approx 123\,\mathrm{mol}$.
2. $m = 123{,}1\,\mathrm{mol} \cdot 32\,\mathrm{g/mol} \approx 3{,}94 \cdot 10^3\,\mathrm{g} = 3{,}94\,\mathrm{kg}$.
3. Ista množina pri drugih $p$ in $T$, spet iz plinske enačbe: $V_0 = \dfrac{123{,}1 \cdot 8{,}314 \cdot 273{,}15}{101\,325}\,\mathrm{m^3} \approx 2{,}76\,\mathrm{m^3}$.
4. Odgovor: v jeklenki je približno $123\,\mathrm{mol}$ oziroma $3{,}94\,\mathrm{kg}$ kisika, ki bi pri normalnih pogojih zavzel približno $2{,}76\,\mathrm{m^3}$. (Pri $150\,\mathrm{bar}$ je model idealnega plina le približek; napaka je nekaj odstotkov.)

### Primer 2

Kolikšna je povprečna translacijska kinetična energija molekule plina pri $300\,\mathrm{K}$? Kolikšna je pri tej temperaturi efektivna hitrost $v_{\text{ef}}$ molekul dušika in atomov helija?

**Podatki:** $T = 300\,\mathrm{K}$, $k_B = 1{,}381 \cdot 10^{-23}\,\mathrm{J/K}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$, $M(\mathrm{N_2}) = 28\,\mathrm{g/mol}$, $M(\mathrm{He}) = 4{,}0\,\mathrm{g/mol}$
**Iščemo:** $\langle W_k\rangle$, $v_{\text{ef}}(\mathrm{N_2})$, $v_{\text{ef}}(\mathrm{He})$

:::formula
$\langle W_k\rangle = \tfrac{3}{2}k_BT$, $v_{\text{ef}} = \sqrt{\dfrac{3RT}{M}}$
:::

**Rešitev:**

1. $\langle W_k\rangle = 1{,}5 \cdot 1{,}381 \cdot 10^{-23}\,\mathrm{J/K} \cdot 300\,\mathrm{K} \approx 6{,}21 \cdot 10^{-21}\,\mathrm{J}$. Velja za vse pline, ker je odvisna le od temperature.
2. Dušik: $v_{\text{ef}} = \sqrt{\dfrac{3 \cdot 8{,}314 \cdot 300}{0{,}028}}\,\mathrm{m/s} \approx 517\,\mathrm{m/s}$ (molska masa v $\mathrm{kg/mol}$!).
3. Helij: $v_{\text{ef}} = \sqrt{\dfrac{3 \cdot 8{,}314 \cdot 300}{0{,}0040}}\,\mathrm{m/s} \approx 1{,}37 \cdot 10^3\,\mathrm{m/s}$.
4. Ker je $v_{\text{ef}} \propto 1/\sqrt{M}$, je razmerje hitrosti $\sqrt{28/4{,}0} = \sqrt{7} \approx 2{,}65$.
5. Odgovor: povprečna kinetična energija je približno $6{,}21 \cdot 10^{-21}\,\mathrm{J}$; molekule dušika imajo efektivno hitrost približno $517\,\mathrm{m/s}$, atomi helija pa približno $1370\,\mathrm{m/s}$.

### Primer 3 (težji)

$2{,}0\,\mathrm{mol}$ dušika v valju z batom ima temperaturo $300\,\mathrm{K}$ in tlak $1{,}00\,\mathrm{bar}$. Plin segrejemo na $400\,\mathrm{K}$, enkrat pri stalni prostornini in enkrat pri stalnem tlaku. Koliko toplote potrebujemo v vsakem primeru? Kolikšna je sprememba notranje energije in koliko dela opravi plin pri stalnem tlaku? Nato obrnemo vprašanje: za koliko se plin segreje in kolikšna je njegova končna prostornina, če mu pri stalnem tlaku $1{,}00\,\mathrm{bar}$ dovedemo toliko toplote, kot je pri stalni prostornini potrebuje za segretje na $400\,\mathrm{K}$? Dušik obravnavaj kot idealni dvoatomni plin.

**Podatki:** $n = 2{,}0\,\mathrm{mol}$, $T_1 = 300\,\mathrm{K}$, $T_2 = 400\,\mathrm{K}$, $p = 1{,}00\,\mathrm{bar} = 1{,}00 \cdot 10^5\,\mathrm{Pa}$, dvoatomni plin ($f = 5$), $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** $Q_V$, $Q_p$, $\Delta W_n$, delo plina pri stalnem tlaku $A'$; pri dovedeni toploti $Q_V$ in stalnem tlaku še $\Delta T'$, končno temperaturo $T'$ in končno prostornino $V'$

:::formula
$C_V = \tfrac{5}{2}R$, $C_p = C_V + R = \tfrac{7}{2}R$; $Q_V = nC_V\Delta T$, $Q_p = nC_p\Delta T$, $\Delta W_n = nC_V\Delta T$, $A' = p\Delta V = nR\Delta T$, $V = nRT/p$
:::

**Rešitev:**

1. $\Delta T = 100\,\mathrm{K}$, $C_V = 2{,}5 \cdot 8{,}314 \approx 20{,}8\,\mathrm{J/(mol\,K)}$, $C_p \approx 29{,}1\,\mathrm{J/(mol\,K)}$.
2. Pri stalni prostornini: $Q_V = 2{,}0 \cdot 20{,}785 \cdot 100\,\mathrm{J} \approx 4{,}16\,\mathrm{kJ}$.
3. Pri stalnem tlaku: $Q_p = 2{,}0 \cdot 29{,}10 \cdot 100\,\mathrm{J} \approx 5{,}82\,\mathrm{kJ}$.
4. Notranja energija idealnega plina je odvisna le od temperature, zato je v obeh primerih $\Delta W_n = nC_V\Delta T \approx 4{,}16\,\mathrm{kJ}$.
5. Delo plina pri stalnem tlaku: $A' = nR\Delta T = 2{,}0 \cdot 8{,}314 \cdot 100\,\mathrm{J} \approx 1{,}66\,\mathrm{kJ}$. Preizkus: $Q_p - \Delta W_n = 5{,}82 - 4{,}16 = 1{,}66\,\mathrm{kJ}$. ✓
6. Obratno vprašanje: pri stalnem tlaku dovedemo $Q_V$, zato $\Delta T' = \dfrac{Q_V}{nC_p} = \dfrac{nC_V\Delta T}{nC_p} = \dfrac{\Delta T}{\kappa} = \dfrac{100\,\mathrm{K}}{1{,}40} \approx 71{,}4\,\mathrm{K}$ in $T' \approx 371{,}4\,\mathrm{K}$. Segretje je manjše, ker gre del toplote v delo.
7. Začetna prostornina iz plinske enačbe: $V_1 = \dfrac{2{,}0 \cdot 8{,}314 \cdot 300}{1{,}00 \cdot 10^5}\,\mathrm{m^3} \approx 0{,}0499\,\mathrm{m^3} = 49{,}9\,\mathrm{L}$. Pri stalnem tlaku je $V \propto T$: $V' = V_1T'/T_1 = 49{,}9\,\mathrm{L} \cdot 371{,}4/300 \approx 61{,}8\,\mathrm{L}$.
8. Odgovor: pri stalni prostornini potrebujemo približno $4{,}16\,\mathrm{kJ}$, pri stalnem tlaku približno $5{,}82\,\mathrm{kJ}$ toplote. Notranja energija se v obeh primerih poveča za $4{,}16\,\mathrm{kJ}$; pri stalnem tlaku gre razlika, $1{,}66\,\mathrm{kJ}$, v delo, ki ga plin opravi pri razširjanju. Če pri stalnem tlaku dovedemo le $4{,}16\,\mathrm{kJ}$, se plin segreje za okoli $71\,\mathrm{K}$ (na $371\,\mathrm{K}$), njegova prostornina pa naraste s $49{,}9\,\mathrm{L}$ na okoli $61{,}8\,\mathrm{L}$.

### Primer 4 – zdaj ti

Pred odhodom na morje je absolutni tlak zraka v pnevmatiki pri $15\,^\circ\mathrm{C}$ enak $3{,}20\,\mathrm{bar}$. Po dveh urah vožnje se zrak v pnevmatiki segreje na $45\,^\circ\mathrm{C}$. Kolikšen je takrat absolutni tlak in kolikšen nadtlak pokaže merilnik, če je zunanji tlak $1{,}00\,\mathrm{bar}$? Prostornina pnevmatike se skoraj ne spremeni.

**Podatki:** $p_1 = 3{,}20\,\mathrm{bar}$, $t_1 = 15\,^\circ\mathrm{C}$, $t_2 = 45\,^\circ\mathrm{C}$, $V$ stalna, zunanji tlak $p_z = 1{,}00\,\mathrm{bar}$
**Iščemo:** absolutni tlak $p_2$ in nadtlak $p_2 - p_z$

:::formula
$\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2}$ (izohorna sprememba), $T/\mathrm{K} = t/{}^\circ\mathrm{C} + 273{,}15$
:::

**Rešitev:**

1. Plinska enačba zahteva absolutno temperaturo: $T_1 = 288{,}15\,\mathrm{K}$, $T_2 = 318{,}15\,\mathrm{K}$.
2. Množina in prostornina sta stalni, zato je $p \propto T$: $p_2 = p_1 \cdot T_2/T_1$.
3. Vstavi temperaturi v kelvinih, izračunaj $p_2$ in od njega odštej zunanji tlak; rezultat primerjaj spodaj:

:::premisli
Kolikšna sta $p_2$ in nadtlak? Za koliko odstotkov je zrasel nadtlak, ki ga pokaže merilnik?
---
$p_2 = 3{,}20\,\mathrm{bar} \cdot 318{,}15/288{,}15 \approx 3{,}53\,\mathrm{bar}$, nadtlak je $3{,}53 - 1{,}00 \approx 2{,}53\,\mathrm{bar}$ (zjutraj $2{,}20\,\mathrm{bar}$). Absolutni tlak je zrasel za okoli $10\,\%$, nadtlak pa za okoli $15\,\%$, ker od obeh odštejemo isti zunanji tlak $1{,}00\,\mathrm{bar}$.
:::

## Pogoste napake

- **Temperatura v stopinjah Celzija.** V $pV = nRT$, $\tfrac{3}{2}k_BT$ in $v_{\text{ef}}$ mora biti $T$ v kelvinih. Segrevanje zaprte posode s $27\,^\circ\mathrm{C}$ na $127\,^\circ\mathrm{C}$ poveča tlak za faktor $400/300$, ne $127/27$.
- **Molska masa v g/mol.** V $\sqrt{3RT/M}$ vstavi $M$ v $\mathrm{kg/mol}$, sicer dobiš hitrost, ki je $\sqrt{1000} \approx 32$-krat premajhna.
- **Mešanje enot tlaka in prostornine.** Z $R = 8{,}314\,\mathrm{J/(mol\,K)}$ uporabljaj $\mathrm{Pa}$ in $\mathrm{m^3}$ (ali dosledno $\mathrm{kPa}$ in $\mathrm{L}$). $1\,\mathrm{bar} = 10^5\,\mathrm{Pa}$, $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^3}$.
- **Ena toplotna kapaciteta za plin.** Plin ima različno toplotno kapaciteto pri stalnem tlaku in pri stalni prostornini; $C_p > C_V$, ker pri stalnem tlaku plin opravlja delo.
- **$\tfrac{3}{2}nRT$ za vse pline.** Ta izraz je le translacijski del. Dvoatomni plini imajo pri sobni temperaturi $W_n = \tfrac{5}{2}nRT$.
- **Povprečna hitrost in efektivna hitrost.** $v_{\text{ef}} = \sqrt{\langle v^2\rangle}$ ni enaka povprečni velikosti hitrosti $\langle v\rangle$; razlikujeta se za nekaj odstotkov.

## Povzetek

- Idealni plin: $pV = nRT = Nk_BT$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$, $k_B = 1{,}381 \cdot 10^{-23}\,\mathrm{J/K}$; $T$ v kelvinih.
- Kinetična teorija: $p = \tfrac{1}{3}\tfrac{N}{V}m_0\langle v^2\rangle$, $\langle W_k\rangle = \tfrac{3}{2}k_BT$, $v_{\text{ef}} = \sqrt{3RT/M}$.
- Notranja energija idealnega plina je odvisna le od $T$: $W_n = \tfrac{f}{2}nRT$ ($f = 3$ enoatomni, $f = 5$ dvoatomni).
- $C_V = \tfrac{f}{2}R$, $C_p = C_V + R$, $\kappa = C_p/C_V$ ($1{,}67$ oziroma $1{,}40$).

## Za izpit

Znati moraš povedati:

- predpostavke modela idealnega plina in plinsko enačbo s pogoji (ravnovesno stanje, absolutna temperatura, stalna množina pri $p_1V_1/T_1 = p_2V_2/T_2$) ter njeno izpeljavo iz Boylovega, Gay-Lussacovega in Avogadrovega zakona;
- izpeljavo $p = \tfrac{1}{3}\tfrac{N}{V}m_0\langle v^2\rangle$ in iz nje $\langle W_k\rangle = \tfrac{3}{2}k_BT$ ter $v_{\text{ef}} = \sqrt{3RT/M}$;
- ekviparticijski izrek s pogoji in $W_n = \tfrac{f}{2}nRT$ za enoatomne, dvoatomne in nelinearne molekule;
- definiciji $C_V$ in $C_p$, dokaz Mayerjeve enačbe in utemeljitev, zakaj je $\Delta W_n = nC_V\Delta T$ pri vsaki spremembi idealnega plina.

### Naloga 1

Togi posodi A ($V_A = 2{,}0\,\mathrm{L}$) in B ($V_B = 3{,}0\,\mathrm{L}$) sta povezani s tanko cevko z zaprtim ventilom; obe sta toplotno izolirani od okolice. V A je helij pri $300\,\mathrm{K}$ in $2{,}0\,\mathrm{bar}$, v B helij pri $450\,\mathrm{K}$ in $1{,}0\,\mathrm{bar}$. Ventil odpremo in počakamo, da se vzpostavi ravnovesje. Izračunaj končni tlak, končno temperaturo in končno efektivno hitrost atomov helija. Utemelji, ali bi se končni tlak spremenil, če bi bil v obeh posodah namesto helija dušik. $R = 8{,}314\,\mathrm{J/(mol\,K)}$, $M(\mathrm{He}) = 4{,}0\,\mathrm{g/mol}$; prostornino cevke zanemari.

**Rešitev:**

1. Množini iz plinske enačbe: $n_A = \dfrac{2{,}0 \cdot 10^5 \cdot 2{,}0 \cdot 10^{-3}}{8{,}314 \cdot 300}\,\mathrm{mol} \approx 0{,}160\,\mathrm{mol}$, $n_B = \dfrac{1{,}0 \cdot 10^5 \cdot 3{,}0 \cdot 10^{-3}}{8{,}314 \cdot 450}\,\mathrm{mol} \approx 0{,}0802\,\mathrm{mol}$, skupaj $n \approx 0{,}241\,\mathrm{mol}$.
2. Posodi sta togi in izolirani, zato plin ne prejme toplote in ne opravi dela: skupna notranja energija se ohrani.
3. Za enoatomni plin je $W_n = \tfrac{3}{2}nRT = \tfrac{3}{2}pV$. Ohranitev energije da $\tfrac{3}{2}(p_AV_A + p_BV_B) = \tfrac{3}{2}p(V_A + V_B)$, torej $p = \dfrac{2{,}0 \cdot 2{,}0 + 1{,}0 \cdot 3{,}0}{5{,}0}\,\mathrm{bar} = 1{,}4\,\mathrm{bar}$.
4. Končna temperatura: $T = \dfrac{p(V_A + V_B)}{nR} = \dfrac{1{,}4 \cdot 10^5 \cdot 5{,}0 \cdot 10^{-3}}{0{,}2406 \cdot 8{,}314}\,\mathrm{K} \approx 350\,\mathrm{K}$. Preizkus z ohranitvijo energije: $T = (n_AT_A + n_BT_B)/n = (0{,}1604 \cdot 300 + 0{,}0802 \cdot 450)/0{,}2406\,\mathrm{K} \approx 350\,\mathrm{K}$. ✓
5. Efektivna hitrost: $v_{\text{ef}} = \sqrt{3 \cdot 8{,}314 \cdot 350/0{,}0040}\,\mathrm{m/s} \approx 1{,}48 \cdot 10^3\,\mathrm{m/s}$.
6. Za dušik je $W_n = \tfrac{5}{2}pV$; faktor $\tfrac{f}{2}$ se v enačbi iz točke 3 pokrajša, zato je končni tlak spet $1{,}4\,\mathrm{bar}$ (in tudi $T$ enaka), dokler je plin v obeh posodah isti.
7. Odgovor: končni tlak je $1{,}4\,\mathrm{bar}$, končna temperatura okoli $350\,\mathrm{K}$, efektivna hitrost atomov helija okoli $1480\,\mathrm{m/s}$; z dušikom bi bil tlak enak.

### Naloga 2

Natančno navedi ekviparticijski izrek s pogoji. Izpelji molski toplotni kapaciteti $C_V$ in $C_p$ za enoatomni in dvoatomni idealni plin pri sobni temperaturi, dokaži Mayerjevo enačbo in utemelji, ali je adiabatni eksponent vodne pare (nelinearna molekula) pri zmernih temperaturah večji ali manjši od $1{,}40$.

**Rešitev:**

1. Izrek: v toplotnem ravnovesju pri temperaturi $T$, kadar je $k_BT$ velik v primerjavi z razmiki energijskih nivojev, vsaka prostostna stopnja, ki v energiji nastopa s kvadratnim členom, prispeva povprečno $\tfrac{1}{2}k_BT$ na molekulo.
2. Ker med molekulami idealnega plina ni sil, je $W_n = N\tfrac{f}{2}k_BT = \tfrac{f}{2}nRT$. Pri stalni prostornini je $Q = \Delta W_n$, zato $C_V = \tfrac{1}{n}\tfrac{\mathrm{d}W_n}{\mathrm{d}T} = \tfrac{f}{2}R$.
3. Mayerjeva enačba: $Q = \Delta W_n + p\Delta V$, $\Delta W_n = nC_V\Delta T$ (odvisna le od $T$), pri stalnem tlaku $p\Delta V = nR\Delta T$, torej $C_p = C_V + R$.
4. Enoatomni plin ($f = 3$, le translacija): $C_V = \tfrac{3}{2}R \approx 12{,}5\,\mathrm{J/(mol\,K)}$, $C_p = \tfrac{5}{2}R \approx 20{,}8\,\mathrm{J/(mol\,K)}$, $\kappa = 5/3$.
5. Dvoatomni plin ($f = 5$: tri translacijske in dve rotacijski stopnji; vrtenje okoli osi molekule in nihanje nista vzbujena): $C_V = \tfrac{5}{2}R \approx 20{,}8\,\mathrm{J/(mol\,K)}$, $C_p = \tfrac{7}{2}R \approx 29{,}1\,\mathrm{J/(mol\,K)}$, $\kappa = 1{,}40$.
6. Nelinearna molekula $\mathrm{H_2O}$ ima tri rotacijske stopnje, $f = 6$: $C_V = 3R$, $C_p = 4R$, $\kappa = 4/3 \approx 1{,}33$.
7. Odgovor: več prostostnih stopenj pomeni večji $C_V$ ob isti razliki $C_p - C_V = R$, zato je $\kappa = 1 + R/C_V$ manjši; za vodno paro je $\kappa \approx 1{,}33 < 1{,}40$ (nihanja vezi bi ga še nekoliko znižala).

## Drugače: Na sliki

Kroglice v škatli letijo v vse smeri; milijarde drobnih sunkov ob stene na sekundo se zlijejo v enakomeren tlak.

```
 +---------------------------+
 |  o->      <-o     o       |
 |      o          ^         |  <- vsak odboj od stene
 |   v    o->      o     <-o |     prenese 2 m0 v_x
 |         o          o      |
 +---------------------------+
```

- Pol manjša škatla (enaka $T$): dvakrat pogostejši udarci, dvakratni tlak.
- Toplejši plin: udarci so močnejši **in** pogostejši, zato $p \propto \langle v^2\rangle \propto T$.

V diagramu $p(V)$ so izoterme hiperbole $p = nRT/V$; izoterma pri višji temperaturi leži više in bolj desno.

## Drugače: Uporaba v stroki

**Molska masa iz gostote pare.** Iz $\rho = pM/(RT)$ sledi $M = \rho RT/p$: posodo znane prostornine pri znanih $T$ in $p$ napolnijo s paro snovi in paro stehtajo (Dumasova metoda). Za zrak ($M \approx 29\,\mathrm{g/mol}$) pri $20\,^\circ\mathrm{C}$ in $101\,\mathrm{kPa}$ dobiš $\rho \approx 1{,}20\,\mathrm{kg/m^3}$.

**Vakuumska tehnika.** Srednja prosta pot molekule je pri stalni temperaturi obratno sorazmerna s tlakom. Pri atmosferskem tlaku meri okoli $70\,\mathrm{nm}$ (difuzija je zato počasna), pri $10^{-4}\,\mathrm{Pa}$ v masnem spektrometru pa desetine metrov: ioni preletijo komoro brez trkov.

**Osmozni tlak.** Za razredčene raztopine velja van 't Hoffova enačba $\Pi = cRT$ (oblika plinske enačbe $p = \frac{n}{V}RT$); z osmometrijo določajo molske mase polimerov in beljakovin.

**Ločevanje izotopov in difuzija.** Hitrost izlivanja plina skozi drobne pore je sorazmerna z $v_{\text{ef}} \propto 1/\sqrt{M}$. Pri plinastem $\mathrm{UF_6}$ se hitrosti molekul z izotopoma urana razlikujeta le za faktor $\sqrt{352/349} \approx 1{,}004$, zato so difuzijske obogatitvene naprave potrebovale več kot tisoč zaporednih stopenj.

## Drugače: Korak za korakom s številkami

Koliko molekul je v $1\,\mathrm{cm^3}$ zraka pri $20\,^\circ\mathrm{C}$ in $101\,325\,\mathrm{Pa}$?

1. **Enote:** $V = 1\,\mathrm{cm^3} = 1{,}0 \cdot 10^{-6}\,\mathrm{m^3}$, $T = 293{,}15\,\mathrm{K}$.
2. **Plinska enačba z molekulami:** $N = \dfrac{pV}{k_BT}$.
3. **Števec in imenovalec:** $pV = 101\,325 \cdot 1{,}0 \cdot 10^{-6}\,\mathrm{J} \approx 0{,}101\,\mathrm{J}$, $k_BT = 1{,}381 \cdot 10^{-23} \cdot 293{,}15\,\mathrm{J} \approx 4{,}05 \cdot 10^{-21}\,\mathrm{J}$.
4. **Rezultat:** $N \approx 0{,}101 / 4{,}05 \cdot 10^{-21} \approx 2{,}5 \cdot 10^{19}$ molekul.
5. **Preizkus:** pri $20\,^\circ\mathrm{C}$ je molska prostornina $24{,}1\,\mathrm{L}$; $N_A/(24{,}1 \cdot 10^{3}\,\mathrm{cm^3}) \approx 2{,}5 \cdot 10^{19}\,\mathrm{cm^{-3}}$. ✓

## Drugače: Bolj natančno

**Izpeljava tlaka.** Opazujmo steno s ploščino $S$, pravokotno na os $x$. V času $\Delta t$ steno zadenejo tiste molekule s komponento hitrosti $v_x > 0$, ki so od nje oddaljene manj kot $v_x\Delta t$; teh je $\tfrac{N}{V}Sv_x\Delta t$ (če štejemo le molekule s to $v_x$). Vsaka preda gibalno količino $2m_0v_x$. Povprečimo po vseh molekulah, pri čemer upoštevamo, da se proti steni giblje le polovica:

$$p = \frac{F}{S} = \frac{1}{S\Delta t}\cdot\frac{1}{2}\frac{N}{V}S\Delta t\cdot 2m_0\langle v_x^2\rangle = \frac{N}{V}m_0\langle v_x^2\rangle.$$

Ker so vse smeri enakovredne, je $\langle v_x^2\rangle = \langle v_y^2\rangle = \langle v_z^2\rangle = \tfrac{1}{3}\langle v^2\rangle$ in dobimo $p = \tfrac{1}{3}\tfrac{N}{V}m_0\langle v^2\rangle$. Trki med molekulami rezultata ne spremenijo, ker se pri njih ohranjata gibalna količina in energija.

**Maxwellova porazdelitev.** Hitrosti molekul niso enake, ampak porazdeljene po Maxwellovi porazdelitvi

$$f(v) = 4\pi\left(\frac{m_0}{2\pi k_BT}\right)^{3/2}v^2\,e^{-m_0v^2/(2k_BT)}.$$

Iz nje sledijo najverjetnejša hitrost $\sqrt{2k_BT/m_0}$, povprečna $\sqrt{8k_BT/(\pi m_0)}$ in efektivna $\sqrt{3k_BT/m_0}$, v razmerju približno $1 : 1{,}13 : 1{,}22$. Delež molekul z energijo nad pragom $E_a$ je sorazmeren z Boltzmannovim faktorjem $e^{-E_a/(k_BT)}$, kar razloži Arrheniusovo odvisnost hitrosti kemijskih reakcij od temperature.

**Meje ekviparticije.** Za vrtenje $\mathrm{N_2}$ je pogoj izreka izpolnjen že pri nizkih temperaturah, za nihanje šele pri več tisoč kelvinih; zato je $C_V(\mathrm{N_2}) \approx \tfrac{5}{2}R$ pri sobni temperaturi in narašča pri zelo visokih.

## Preveri se

? Idealnemu plinu pri stalni temperaturi zmanjšamo prostornino na polovico. Kaj se zgodi s tlakom?
- Zmanjša se na polovico.
~ Zamenjano sorazmerje: pri stalni temperaturi sta $p$ in $V$ obratno sorazmerna, ker molekule v manjši posodi pogosteje zadevajo stene.
+ Podvoji se.
- Ostane enak.
~ Hitrost molekul se res ne spremeni, a v polovični prostornini zadene vsako steno dvakrat več molekul na sekundo.
> Pri izotermni spremembi je $pV = \text{konst.}$, zato pri polovični prostornini tlak naraste na dvakratno vrednost.

? Absolutno temperaturo plina podvojimo. Kako se spremeni efektivna hitrost molekul?
- Podvoji se.
~ Dvakrat se poveča povprečna kinetična energija, ki je sorazmerna z $v^2$; hitrost raste le s $\sqrt{T}$.
- Poveča se štirikrat.
~ Hitrost ni sorazmerna s $T^2$; v $v_{\text{ef}} = \sqrt{3RT/M}$ je temperatura pod korenom.
+ Poveča se za faktor $\sqrt{2}$.
> $v_{\text{ef}} = \sqrt{3RT/M} \propto \sqrt{T}$, zato se pri dvakratni temperaturi hitrost poveča za $\sqrt{2} \approx 1{,}41$. Dvakrat se poveča povprečna kinetična energija.

? Kolikšna je molska toplotna kapaciteta pri stalni prostornini za enoatomni idealni plin?
+ $12{,}5\,\mathrm{J/(mol\,K)}$
- $20{,}8\,\mathrm{J/(mol\,K)}$
~ To je $\tfrac{5}{2}R$: velja za $C_V$ dvoatomnega plina ali za $C_p$ enoatomnega; enoatomni plin ima le $3$ prostostne stopnje.
- $8{,}31\,\mathrm{J/(mol\,K)}$
~ To je $R$, razlika $C_p - C_V$ po Mayerjevi enačbi, ne sama $C_V$.
> $C_V = \tfrac{3}{2}R = 1{,}5 \cdot 8{,}314\,\mathrm{J/(mol\,K)} \approx 12{,}5\,\mathrm{J/(mol\,K)}$. $20{,}8$ velja za $C_p$ enoatomnega ali $C_V$ dvoatomnega plina.

? Zaprto jeklenko s plinom segrejemo s $27\,^\circ\mathrm{C}$ na $127\,^\circ\mathrm{C}$. Za kolikšen faktor se poveča tlak?
- $4{,}7$
~ To je $127/27$: temperaturi v stopinjah Celzija; plinska enačba zahteva kelvine.
+ $1{,}33$
- $1{,}15$
~ To je $\sqrt{T_2/T_1}$, za kolikor naraste efektivna hitrost molekul; tlak je sorazmeren z $\langle v^2\rangle$, torej s $T$.
> Pri stalni prostornini je $p \propto T$ v kelvinih: $400{,}15/300{,}15 \approx 1{,}33$. Faktor $4{,}7$ dobiš, če napačno deliš temperaturi v stopinjah Celzija.

? Zrak v kabini letala ima temperaturo $22\,^\circ\mathrm{C}$. Kaj ta temperatura po kinetični teoriji pove o molekulah zraka?
- Vse molekule se gibljejo z isto hitrostjo, ki jo določa temperatura.
~ Hitrosti molekul so porazdeljene (Maxwellova porazdelitev); temperatura določa le povprečje, posamezne molekule so hitrejše ali počasnejše.
+ Kolikšna je povprečna kinetična energija naključnega gibanja ene molekule.
- Kolikšna je celotna notranja energija zraka v kabini.
~ Notranja energija $W_n = \tfrac{f}{2}nRT$ je odvisna tudi od množine plina in prostostnih stopenj; temperatura je mera na eno molekulo.
> $\langle W_k\rangle = \tfrac{3}{2}k_BT$: absolutna temperatura je mera za povprečno translacijsko kinetično energijo ene molekule, ne glede na to, koliko je plina.

:::simboli
p | tlak plina | pV = nRT | Pa
p_1, p_2 | tlak plina v stanju 1 in 2 | | Pa
p_0 | normalni zračni tlak | | Pa | 1,013 · 10⁵ Pa
p_z | zunanji (zračni) tlak | | Pa | nadtlak je p − p_z
V | prostornina plina | | m^3
V_0 | prostornina plina pri normalnih pogojih | V_0 = \frac{nRT_0}{p_0} | m^3
n | množina snovi | n = \frac{N}{N_A} | mol | iz plinske enačbe n = pV/(RT)
N | število molekul | N = nN_A | –
N_A | Avogadrova konstanta | | mol^{-1} | 6,022 · 10²³ mol⁻¹
R | splošna plinska konstanta | | J/(mol K) | 8,314 J/(mol K)
k_B | Boltzmannova konstanta | k_B = \frac{R}{N_A} | J/K | 1,381 · 10⁻²³ J/K
T | absolutna temperatura | | K
T_0 | temperatura pri normalnih pogojih | | K | 273,15 K
T_1, T_2 | temperatura plina v stanju 1 in 2 | | K
t | temperatura v stopinjah Celzija | T/\mathrm{K} = t/{}^\circ\mathrm{C} + 273{,}15 | °C
m_0 | masa ene molekule | | kg
m | masa plina | m = nM | kg
M | molska masa | | kg/mol | v nalogah pogosto v g/mol
v | hitrost molekule | | m/s
v_x | komponenta hitrosti molekule v smeri x | | m/s
v_{\text{ef}} | efektivna hitrost molekul | v_{\text{ef}} = \sqrt{\langle v^2\rangle} = \sqrt{\frac{3RT}{M}} | m/s | malo večja od povprečne hitrosti
W_k | kinetična energija molekule | \langle W_k\rangle = \tfrac{3}{2}k_BT | J | ⟨ ⟩ pomeni povprečje
W_n | notranja energija plina | W_n = \tfrac{f}{2}nRT | J | f je število prostostnih stopenj
\Delta W_n | sprememba notranje energije plina | \Delta W_n = nC_V\Delta T | J | velja za vsako spremembo
C_V | molska toplotna kapaciteta pri stalni prostornini | C_V = \tfrac{f}{2}R | J/(mol K)
C_p | molska toplotna kapaciteta pri stalnem tlaku | C_p = C_V + R | J/(mol K)
Q_V | toplota pri stalni prostornini | Q_V = nC_V\Delta T | J
Q_p | toplota pri stalnem tlaku | Q_p = nC_p\Delta T | J
A' | delo plina pri stalnem tlaku | A' = p\Delta V = nR\Delta T | J
F | sila molekul na steno | | N
\Delta t | čas, v katerem štejemo trke s steno | | s
S | ploščina stene | | m^2
f | Maxwellova porazdelitev hitrosti | | s/m | tudi število prostostnih stopenj v C_V = (f/2)R
e | osnova naravnega logaritma | | – | e ≈ 2,718
:::
