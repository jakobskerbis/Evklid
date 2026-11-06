---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Jedro helija ${}^4\mathrm{He}$ je sestavljeno iz dveh protonov in dveh nevtronov. Masa protona je $1{,}007276\,\mathrm{u}$, masa nevtrona $1{,}008665\,\mathrm{u}$, skupaj torej $4{,}031882\,\mathrm{u}$. Izmerjena masa helijevega jedra pa je $4{,}001506\,\mathrm{u}$. Celota je **lažja** od svojih delov, za $0{,}030376\,\mathrm{u}$. Kam je izginila masa?

Ni izginila: ko se nukleoni povežejo v jedro, se sprosti energija, in po $E = mc^2$ odnese s seboj maso. Ta **masni defekt** je merilo, kako trdno je jedro vezano. Iz njega razberemo, zakaj Sonce sveti, zakaj jedrski reaktor iz urana dobi energijo, in zakaj so nekatera jedra nestabilna ter razpadajo. Razpad nestabilnih jeder uporabljamo vsak dan: s fosforjem ${}^{32}\mathrm{P}$ v molekularni biologiji označujemo DNA, s tehnecijem ${}^{99\mathrm{m}}\mathrm{Tc}$ in fluorom ${}^{18}\mathrm{F}$ v nuklearni medicini slikamo organe, z ogljikom ${}^{14}\mathrm{C}$ določamo starost organskih ostankov. Za vse to potrebujemo štiri pojme: vezavno energijo, zakon radioaktivnega razpada, razpolovni čas in aktivnost.

## Razlaga

### Zgradba jedra in enote

Jedro ${}^A_Z\mathrm{X}$ ima $Z$ protonov (**vrstno število**) in $N = A - Z$ nevtronov; $A$ je **nukleonsko (masno) število**. Jedra z enakim $Z$ in različnim $N$ so **izotopi**. Polmer jedra je približno $r \approx r_0A^{1/3}$ z $r_0 \approx 1{,}2\,\mathrm{fm}$, zato je prostornina sorazmerna z $A$ in gostota jedrske snovi približno enaka za vsa jedra.

Mase merimo v **atomskih masnih enotah**: $1\,\mathrm{u}$ je dvanajstina mase atoma ${}^{12}\mathrm{C}$, $1\,\mathrm{u} = 1{,}66054 \cdot 10^{-27}\,\mathrm{kg}$. Energijo v jedrski fiziki merimo v $\mathrm{MeV}$, in masi $1\,\mathrm{u}$ ustreza energija

$$E_u = (1\,\mathrm{u})\,c^2 = 931{,}494\,\mathrm{MeV}.$$

### Vezavna energija: kaj kažejo podatki

**Definicija.** **Vezavna energija** jedra ${}^A_Z\mathrm{X}$ je energija, ki jo moramo dovesti, da jedro razstavimo na posamezne protone in nevtrone. Enaka je masnemu defektu, pomnoženemu s $c^2$:

$$W_v = \left[Z\,m(^1\mathrm{H}) + N\,m_n - m(^A\mathrm{X})\right]c^2.$$

V formuli so **atomske** mase (iz tabel), $m(^1\mathrm{H}) = 1{,}007825\,\mathrm{u}$ in $m_n = 1{,}008665\,\mathrm{u}$. Atomske mase lahko vstavimo, ker se mase $Z$ elektronov na obeh straneh odštejejo (vezavno energijo elektronov, nekaj $\mathrm{eV}$ do $\mathrm{keV}$, zanemarimo).

Izračunajmo $W_v$ in **vezavno energijo na nukleon** $W_v/A$ za nekaj jeder:

| jedro | $W_v$ / MeV | $W_v/A$ / MeV |
|---|---|---|
| ${}^2\mathrm{H}$ | $2{,}22$ | $1{,}11$ |
| ${}^4\mathrm{He}$ | $28{,}30$ | $7{,}07$ |
| ${}^{12}\mathrm{C}$ | $92{,}16$ | $7{,}68$ |
| ${}^{56}\mathrm{Fe}$ | $492{,}3$ | $8{,}79$ |
| ${}^{238}\mathrm{U}$ | $1802$ | $7{,}57$ |

Masni defekti, iz katerih so izračunane vrednosti, so po vrsti $0{,}002388$; $0{,}030377$; $0{,}098940$; $0{,}528463$ in $1{,}934202\,\mathrm{u}$.

Kaj opaziš? Celotna vezavna energija raste z $A$, kar ni presenetljivo. Toda $W_v/A$ najprej strmo naraste, okoli $A \approx 56$ (železo, nikelj) doseže največjo vrednost okoli $8{,}8\,\mathrm{MeV}$, potem pa počasi pada. Za večino jeder je med $7{,}5$ in $8{,}8\,\mathrm{MeV}$, skoraj stalna.

Iz tega vzorca sledita dve pravili:

1. **Jedrske sile imajo kratek doseg in se nasičijo.** Če bi vsak nukleon privlačil vse druge, bi $W_v$ rasla kot $A^2$ in $W_v/A$ kot $A$. Stalna $W_v/A$ pomeni, da nukleon čuti le sosede. Pri težkih jedrih $W_v/A$ pada, ker se vsi protoni med seboj odbijajo z elektrostatično silo dolgega dosega.
2. **Energija se sprosti, ko se jedra premaknejo proti vrhu krivulje.** Pri **zlivanju** (fuziji) lahkih jeder in pri **cepitvi** (fisiji) težkih je vsota vezavnih energij produktov večja od vsote vezavnih energij začetnih jeder. Razlika je sproščena energija.

Za jedrsko reakcijo ali razpad je sproščena energija **vrednost $Q$**: razlika mas pred in po, krat $c^2$,

$$Q = \left(\sum m_{pred} - \sum m_{po}\right)c^2.$$

Pri $Q > 0$ se energija sprosti (kot kinetična energija produktov in sevanje gama).

:::premisli
Pri cepitvi ${}^{235}\mathrm{U}$ nastaneta dve jedri z $A$ okoli $95$ in $140$, kjer je $W_v/A$ okoli $8{,}5\,\mathrm{MeV}$, pri uranu pa okoli $7{,}6\,\mathrm{MeV}$. Oceni, koliko energije se sprosti pri eni cepitvi.
---
Na nukleon se vezavna energija poveča za približno $0{,}9\,\mathrm{MeV}$, nukleonov je okoli $235$, torej se sprosti približno $235 \cdot 0{,}9 \approx 200\,\mathrm{MeV}$. To je res izmerjena energija cepitve, nekaj deset milijonkrat več kot pri gorenju ene molekule (nekaj $\mathrm{eV}$).
:::

### Radioaktivni razpad

Nestabilna jedra spontano razpadajo. Glavne vrste:

| razpad | proces | $A$, $Z$ |
|---|---|---|
| $\alpha$ | izseva ${}^4\mathrm{He}$ | $-4$, $-2$ |
| $\beta^-$ | $n \to p + e^- + \bar\nu_e$ | $0$, $+1$ |
| $\beta^+$ | $p \to n + e^+ + \nu_e$ | $0$, $-1$ |
| $\gamma$ | prehod v nižje stanje | $0$, $0$ |

Enako spremembo kot $\beta^+$ da zajetje elektrona iz ovojnice ($p + e^- \to n + \nu_e$).

Vrednost $Q$ računamo z atomskimi masami starševskega ($X$) in hčerinskega ($Y$) atoma. Pri $\beta^-$ in zajetju elektrona je $Q = [m(X) - m(Y)]c^2$, ker se elektroni ovojnic izenačijo. Pri $\beta^+$ ima hčerinski atom en elektron manj, iz jedra pa odleti še pozitron, zato $Q = [m(X) - m(Y) - 2m_e]c^2$ z $2m_ec^2 = 1{,}022\,\mathrm{MeV}$; razpad $\beta^+$ je mogoč le, če je atomska masa starša za več kot $2m_e$ večja od hčerinske.

Pri vsakem razpadu se ohranjata nukleonsko število in naboj. Oznaka »m« (${}^{99\mathrm{m}}\mathrm{Tc}$) pomeni metastabilno vzbujeno stanje, ki razpade z izsevanjem žarka $\gamma$.

Ključna izkušnja: razpad posameznega jedra je **naključen**. Jedro nima »starosti«: verjetnost, da razpade v naslednji sekundi, je enaka, ne glede na to, koliko časa že obstaja. To verjetnost na enoto časa imenujemo **razpadna konstanta** $\lambda$.

**Izrek (zakon radioaktivnega razpada).** Če ima vzorec ob času $t = 0$ $N_0$ nerazpadlih jeder istega izotopa z razpadno konstanto $\lambda$, je pričakovano število nerazpadlih jeder ob času $t$

$$N(t) = N_0\,e^{-\lambda t}.$$

**Izpeljava.** V kratkem času $\mathrm{d}t$ razpade vsako jedro z verjetnostjo $\lambda\,\mathrm{d}t$, torej razpade v povprečju $N\lambda\,\mathrm{d}t$ jeder: $\mathrm{d}N = -\lambda N\,\mathrm{d}t$. Ločimo spremenljivki, $\mathrm{d}N/N = -\lambda\,\mathrm{d}t$, in integriramo od $0$ do $t$: $\ln(N/N_0) = -\lambda t$. $\square$

**Razpolovni čas** $t_{1/2}$ je čas, v katerem razpade polovica jeder. Iz $N_0/2 = N_0e^{-\lambda t_{1/2}}$ sledi

$$t_{1/2} = \frac{\ln 2}{\lambda}.$$

Zakon lahko zapišemo kot $N = N_0 \cdot 2^{-t/t_{1/2}}$: po vsakem razpolovnem času ostane polovica tistega, kar je bilo. **Povprečni življenjski čas** jedra je $\tau = 1/\lambda = t_{1/2}/\ln 2 \approx 1{,}44\,t_{1/2}$.

:::premisli
Vzorec ima po dveh razpolovnih časih še četrtino jeder. Koliko jih bo po treh razpolovnih časih, in ali bo po dvakrat daljšem času (štirih razpolovnih časih) razpadlo vse?
---
Po treh razpolovnih časih ostane osmina, po štirih šestnajstina. Pričakovano število jeder nikoli ne pade na nič: vsak razpolovni čas razpolovi ostanek, ne prvotne količine. Linearno sklepanje »v dveh polovicah vse« je napačno.
:::

### Aktivnost

**Definicija.** **Aktivnost** $R$ vzorca (v nekaterih učbenikih $A$) je število razpadov na enoto časa,

$$R = -\frac{\mathrm{d}N}{\mathrm{d}t} = \lambda N.$$

Enota je **becquerel**, $1\,\mathrm{Bq} = 1$ razpad na sekundo. Starejša enota je curie, $1\,\mathrm{Ci} = 3{,}7 \cdot 10^{10}\,\mathrm{Bq}$. Ker je $R$ sorazmerna z $N$, pada z istim zakonom:

$$R(t) = R_0\,e^{-\lambda t}.$$

Iz $R = \lambda N$ sledi pomembna posledica: pri enaki aktivnosti ima izotop z daljšim razpolovnim časom **več** jeder. Zato je ${}^{238}\mathrm{U}$ z $t_{1/2} \approx 4{,}5 \cdot 10^9$ let v kamninah prisoten v velikih količinah, a ima majhno aktivnost na gram, ${}^{18}\mathrm{F}$ z $t_{1/2} \approx 110\,\mathrm{min}$ pa ima že v nanogramih aktivnost, primerno za slikanje.

Razpolovni časi izotopov, ki jih pogosto srečaš v biologiji in medicini:

| izotop | razpad | $t_{1/2}$ | uporaba |
|---|---|---|---|
| ${}^{18}\mathrm{F}$ | $\beta^+$ | $110\,\mathrm{min}$ | PET |
| ${}^{99\mathrm{m}}\mathrm{Tc}$ | $\gamma$ | $6{,}0\,\mathrm{h}$ | SPECT |
| ${}^{32}\mathrm{P}$ | $\beta^-$ | $14{,}3\,\mathrm{d}$ | DNA |
| ${}^{14}\mathrm{C}$ | $\beta^-$ | $5730$ let | datiranje |

## Rešeni primeri

### Primer 1 (lažji)

V oddelku za nuklearno medicino ob 7.00 pripravijo raztopino ${}^{99\mathrm{m}}\mathrm{Tc}$ z aktivnostjo $800\,\mathrm{MBq}$. Razpolovni čas je $6{,}0\,\mathrm{h}$. Kolikšna je aktivnost ob 13.00 in ob 16.00?

**Podatki:** $R_0 = 800\,\mathrm{MBq}$, $t_{1/2} = 6{,}0\,\mathrm{h}$, $t_1 = 6{,}0\,\mathrm{h}$, $t_2 = 9{,}0\,\mathrm{h}$
**Iščemo:** $R(t_1)$, $R(t_2)$

:::formula
$R(t) = R_0 \cdot 2^{-t/t_{1/2}}$
:::

**Rešitev:**

1. Ob 13.00 je minil točno en razpolovni čas: $R = 800 \cdot 2^{-1}\,\mathrm{MBq} = 400\,\mathrm{MBq}$.
2. Ob 16.00 je minilo $9{,}0/6{,}0 = 1{,}5$ razpolovnega časa: $R = 800 \cdot 2^{-1{,}5}\,\mathrm{MBq} \approx 800 \cdot 0{,}354\,\mathrm{MBq} \approx 283\,\mathrm{MBq}$.
3. Smiselnost: vrednost je med $400\,\mathrm{MBq}$ (en razpolovni čas) in $200\,\mathrm{MBq}$ (dva), a ne na sredini ($300\,\mathrm{MBq}$), ker aktivnost pada eksponentno, ne linearno.
4. Odgovor: ob 13.00 je aktivnost $400\,\mathrm{MBq}$, ob 16.00 približno $283\,\mathrm{MBq}$.

### Primer 2

Izračunaj vezavno energijo in vezavno energijo na nukleon za ${}^{16}\mathrm{O}$ (atomska masa $15{,}994915\,\mathrm{u}$). Ali bi se energija sprostila ali porabila, če bi iz štirih jeder ${}^4\mathrm{He}$ ($4{,}002603\,\mathrm{u}$) nastalo eno jedro ${}^{16}\mathrm{O}$?

**Podatki:** $m(^{16}\mathrm{O}) = 15{,}994915\,\mathrm{u}$, $Z = 8$, $N = 8$, $m(^1\mathrm{H}) = 1{,}007825\,\mathrm{u}$, $m_n = 1{,}008665\,\mathrm{u}$, $m(^4\mathrm{He}) = 4{,}002603\,\mathrm{u}$, $E_u = 931{,}494\,\mathrm{MeV}$
**Iščemo:** $W_v$, $W_v/A$ za ${}^{16}\mathrm{O}$; $Q$ za $4\,{}^4\mathrm{He} \to {}^{16}\mathrm{O}$

:::formula
$W_v = \left[Z\,m(^1\mathrm{H}) + N\,m_n - m(^A\mathrm{X})\right]c^2$; $Q = \left(\sum m_{pred} - \sum m_{po}\right)c^2$
:::

**Rešitev:**

1. Masa delov: $8 \cdot 1{,}007825 + 8 \cdot 1{,}008665 = 8{,}062600 + 8{,}069320 = 16{,}131920\,\mathrm{u}$.
2. Masni defekt: $16{,}131920 - 15{,}994915 = 0{,}137005\,\mathrm{u}$.
3. Vezavna energija: $W_v = 0{,}137005 \cdot 931{,}494\,\mathrm{MeV} \approx 127{,}6\,\mathrm{MeV}$; na nukleon $127{,}6/16 \approx 7{,}98\,\mathrm{MeV}$.
4. Vrednost $Q$: $4 \cdot 4{,}002603 - 15{,}994915 = 0{,}015497\,\mathrm{u}$, torej $Q \approx 0{,}015497 \cdot 931{,}494\,\mathrm{MeV} \approx 14{,}4\,\mathrm{MeV} > 0$.
5. Preizkus z vezavnimi energijami: $127{,}6 - 4 \cdot 28{,}30 = 14{,}4\,\mathrm{MeV}$. ✓ Elektronske mase se pri obeh računih odštejejo.
6. Odgovor: ${}^{16}\mathrm{O}$ ima $W_v \approx 127{,}6\,\mathrm{MeV}$ in $7{,}98\,\mathrm{MeV}$ na nukleon, kar je več kot helij ($7{,}07\,\mathrm{MeV}$). Pri nastanku kisika iz helija se sprosti okoli $14{,}4\,\mathrm{MeV}$. V zvezdah kisik ne nastane naenkrat, ampak v korakih: $3\,{}^4\mathrm{He} \to {}^{12}\mathrm{C}$, nato ${}^{12}\mathrm{C} + {}^4\mathrm{He} \to {}^{16}\mathrm{O}$.

### Primer 3 (težji)

Laboratorij za molekularno biologijo kupi raztopino ${}^{32}\mathrm{P}$ z aktivnostjo $37\,\mathrm{MBq}$ ($1\,\mathrm{mCi}$) na referenčni dan. Razpolovni čas je $14{,}27\,\mathrm{d}$, atomska masa ${}^{32}\mathrm{P}$ je $31{,}973907\,\mathrm{u}$, ${}^{32}\mathrm{S}$ pa $31{,}972071\,\mathrm{u}$. Izračunaj: (a) razpadno konstanto v $\mathrm{s^{-1}}$, število jeder in maso fosforja ${}^{32}\mathrm{P}$; (b) aktivnost po $30\,\mathrm{d}$; (c) koliko dni mora odpadek stati, da aktivnost pade pod $10\,\mathrm{kBq}$; (d) največjo energijo, ki jo pri razpadu $\beta^-$ lahko odnese elektron.

**Podatki:** $R_0 = 37\,\mathrm{MBq} = 3{,}7 \cdot 10^7\,\mathrm{Bq}$; $t_{1/2} = 14{,}27\,\mathrm{d}$; $m(^{32}\mathrm{P}) = 31{,}973907\,\mathrm{u}$; $m(^{32}\mathrm{S}) = 31{,}972071\,\mathrm{u}$; $1\,\mathrm{u} = 1{,}66054 \cdot 10^{-27}\,\mathrm{kg}$; $t = 30\,\mathrm{d}$, meja $R_m = 10\,\mathrm{kBq}$
**Iščemo:** $\lambda$, $N_0$, $m$; $R(30\,\mathrm{d})$; $t_m$; $Q$

:::formula
$\lambda = \dfrac{\ln 2}{t_{1/2}}$, $N = \dfrac{R}{\lambda}$, $R(t) = R_0\,e^{-\lambda t}$, $t_m = \dfrac{1}{\lambda}\ln\dfrac{R_0}{R_m}$, $Q = \left[m(^{32}\mathrm{P}) - m(^{32}\mathrm{S})\right]c^2$
:::

**Rešitev:**

1. (a) Razpolovni čas v sekundah: $t_{1/2} = 14{,}27 \cdot 86\,400\,\mathrm{s} \approx 1{,}233 \cdot 10^6\,\mathrm{s}$, zato $\lambda = 0{,}6931/1{,}233 \cdot 10^6\,\mathrm{s^{-1}} \approx 5{,}62 \cdot 10^{-7}\,\mathrm{s^{-1}}$.
2. Število jeder: $N_0 = R_0/\lambda = 3{,}7 \cdot 10^7/5{,}62 \cdot 10^{-7} \approx 6{,}58 \cdot 10^{13}$. Aktivnost je v $\mathrm{s^{-1}}$, zato mora biti tudi $\lambda$ v $\mathrm{s^{-1}}$.
3. Masa: $m = N_0 \cdot 31{,}97\,\mathrm{u} \approx 6{,}58 \cdot 10^{13} \cdot 31{,}97 \cdot 1{,}66054 \cdot 10^{-27}\,\mathrm{kg} \approx 3{,}49 \cdot 10^{-12}\,\mathrm{kg}$, torej okoli $3{,}5\,\mathrm{ng}$.
4. (b) $R = 37\,\mathrm{MBq} \cdot 2^{-30/14{,}27} \approx 37 \cdot 0{,}233\,\mathrm{MBq} \approx 8{,}6\,\mathrm{MBq}$.
5. (c) Iz $R_m = R_0 \cdot 2^{-t_m/t_{1/2}}$: $t_m = t_{1/2}\log_2(R_0/R_m) = 14{,}27\,\mathrm{d} \cdot \log_2 3700 \approx 14{,}27 \cdot 11{,}85\,\mathrm{d} \approx 169\,\mathrm{d}$.
6. (d) Pri razpadu $\beta^-$ ima hčerinski atom eno več elektronov v ovojnici, kar atomske mase že upoštevajo, zato $Q = (31{,}973907 - 31{,}972071) \cdot 931{,}494\,\mathrm{MeV} \approx 0{,}001836 \cdot 931{,}494\,\mathrm{MeV} \approx 1{,}71\,\mathrm{MeV}$.
7. Energija se razdeli med elektron in antinevtrino (odboj jedra je zanemarljiv), zato je $1{,}71\,\mathrm{MeV}$ največja energija elektrona; povprečna je okoli $0{,}7\,\mathrm{MeV}$, približno $40\,\%$ največje.
8. Odgovor: $\lambda \approx 5{,}62 \cdot 10^{-7}\,\mathrm{s^{-1}}$, $N_0 \approx 6{,}6 \cdot 10^{13}$ jeder z maso le okoli $3{,}5\,\mathrm{ng}$; po $30\,\mathrm{d}$ ostane $8{,}6\,\mathrm{MBq}$, pod $10\,\mathrm{kBq}$ pade po okoli $169$ dneh (skoraj $12$ razpolovnih časov); elektroni imajo največ $1{,}71\,\mathrm{MeV}$, zato za zaščito uporabljamo pleksi steklo in ne svinec, v katerem bi nastalo zavorno sevanje.

### Primer 4 – zdaj ti

Lesen ostanek iz arheološkega izkopa ima na gram ogljika le še $30\,\%$ aktivnosti ${}^{14}\mathrm{C}$, ki jo ima les živih dreves. Razpolovni čas je $5730$ let. Koliko je star ostanek?

**Podatki:** $R/R_0 = 0{,}30$, $t_{1/2} = 5730$ let
**Iščemo:** starost $t$

:::formula
$\lambda = \dfrac{\ln 2}{t_{1/2}}$, $t = \dfrac{1}{\lambda}\ln\dfrac{R_0}{R}$
:::

**Rešitev:**

1. Razpadna konstanta: $\lambda = 0{,}6931/5730$ na leto $\approx 1{,}210 \cdot 10^{-4}$ na leto.
2. Živ organizem izmenjuje ogljik z ozračjem, zato ima stalno razmerje ${}^{14}\mathrm{C}/{}^{12}\mathrm{C}$; po smrti ${}^{14}\mathrm{C}$ le razpada.
3. Zdaj ti: izračunaj $t$ in preveri, ali je med dvema in tremi razpolovnimi časi.

:::premisli
Koliko let je star ostanek?
---
$t = \ln(1/0{,}30)/1{,}210 \cdot 10^{-4}$ let $\approx 1{,}204/1{,}210 \cdot 10^{-4}$ let $\approx 9950$ let. Dva razpolovna časa bi dala $25\,\%$, en $50\,\%$; $30\,\%$ je malo nad $25\,\%$, zato je starost malo manj od $2 \cdot 5730 = 11\,460$ let. ✓
:::

## Pogoste napake

- **Linearni razpad.** »V enem razpolovnem času polovica, v dveh vse.« Razpad je eksponenten: po dveh razpolovnih časih ostane četrtina.
- **Enote $\lambda$.** Aktivnost v $\mathrm{Bq}$ je na sekundo; če $\lambda$ izračunaš iz razpolovnega časa v dneh, je $N = R/\lambda$ napačen za faktor $86\,400$.
- **Aktivnost kot količina snovi.** Velika aktivnost ne pomeni veliko jeder: pri enaki aktivnosti ima kratkoživ izotop mnogo manj jeder ($N = R/\lambda$).
- **Masa protona namesto atoma vodika.** Če v $W_v$ vzameš atomsko maso jedra $X$ in maso protona, se elektroni ne odštejejo. Uporabljaj dosledno atomske mase: $m(^1\mathrm{H})$ in $m(^A\mathrm{X})$.
- **Največja vezavna energija = najtežje jedro.** Celotna $W_v$ res raste z $A$, stabilnost pa meri $W_v/A$, ki ima vrh pri železu in niklju.

## Povzetek

- Jedro ${}^A_Z\mathrm{X}$: $Z$ protonov, $N = A - Z$ nevtronov; $1\,\mathrm{u}\,c^2 = 931{,}494\,\mathrm{MeV}$.
- Vezavna energija $W_v = [Z\,m(^1\mathrm{H}) + N\,m_n - m(^A\mathrm{X})]c^2$; $W_v/A$ ima vrh okoli $8{,}8\,\mathrm{MeV}$ pri $A \approx 56$.
- Zlivanje lahkih in cepitev težkih jeder sproščata energijo; $Q = (\sum m_{pred} - \sum m_{po})c^2$.
- Razpadi $\alpha$, $\beta^\pm$, $\gamma$ ohranjajo $A$ in naboj.
- Zakon razpada $N = N_0e^{-\lambda t}$; $t_{1/2} = \ln 2/\lambda$, $\tau = 1/\lambda$.
- Aktivnost $R = \lambda N = R_0e^{-\lambda t}$, enota $\mathrm{Bq}$.

## Za izpit

Znati moraš povedati:

- definicijo vezavne energije in zakaj smemo v formuli uporabiti atomske mase;
- obliko krivulje $W_v/A$ in kaj iz nje sledi za jedrske sile, zlivanje in cepitev;
- izpeljavo zakona radioaktivnega razpada iz $\mathrm{d}N = -\lambda N\,\mathrm{d}t$ in zvezi $t_{1/2} = \ln 2/\lambda$, $\tau = 1/\lambda$;
- definicijo aktivnosti, enoto in zvezo $R = \lambda N$;
- vrste razpadov z ohranitvenimi zakoni in računanje vrednosti $Q$.

### Naloga 1

Generator tehnecija vsebuje ${}^{99}\mathrm{Mo}$ ($t_{1/2,1} = 65{,}94\,\mathrm{h}$), ki razpada v ${}^{99\mathrm{m}}\mathrm{Tc}$ ($t_{1/2,2} = 6{,}01\,\mathrm{h}$). Ob $t = 0$ tehnecij izperemo (ga je nič), aktivnost molibdena je $10{,}0\,\mathrm{GBq}$. Predpostavi, da vsak razpad ${}^{99}\mathrm{Mo}$ da ${}^{99\mathrm{m}}\mathrm{Tc}$ (v resnici okoli $88\,\%$). (a) Izpelji aktivnost tehnecija $R_2(t)$. (b) Kdaj je največja in kolikšna je? (c) Kolikšno je razmerje $R_2/R_1$ po $24\,\mathrm{h}$ in po $72\,\mathrm{h}$, proti kateri vrednosti gre in zakaj?

**Rešitev:**

1. (a) Enačbi: $\dot N_1 = -\lambda_1N_1$, $\dot N_2 = \lambda_1N_1 - \lambda_2N_2$ (tehnecij nastaja iz molibdena in razpada sam).
2. Prva da $N_1 = N_{10}e^{-\lambda_1t}$. Drugo rešimo z nastavkom $N_2 = C\,(e^{-\lambda_1t} - e^{-\lambda_2t})$, ki izpolni $N_2(0) = 0$; vstavitev da $C = \lambda_1N_{10}/(\lambda_2 - \lambda_1)$.
3. Z $R_2 = \lambda_2N_2$ in $R_{10} = \lambda_1N_{10}$: $R_2(t) = R_{10}\dfrac{\lambda_2}{\lambda_2 - \lambda_1}\left(e^{-\lambda_1t} - e^{-\lambda_2t}\right)$.
4. Konstanti: $\lambda_1 = 0{,}6931/65{,}94\,\mathrm{h^{-1}} \approx 0{,}01051\,\mathrm{h^{-1}}$, $\lambda_2 = 0{,}6931/6{,}01\,\mathrm{h^{-1}} \approx 0{,}1153\,\mathrm{h^{-1}}$.
5. (b) Maksimum: $\mathrm{d}R_2/\mathrm{d}t = 0$ da $\lambda_1e^{-\lambda_1t} = \lambda_2e^{-\lambda_2t}$, torej $t_{max} = \ln(\lambda_2/\lambda_1)/(\lambda_2 - \lambda_1) \approx \ln 10{,}97/0{,}1048\,\mathrm{h} \approx 22{,}9\,\mathrm{h}$.
6. $R_2(t_{max}) \approx 10{,}0 \cdot 1{,}100 \cdot (e^{-0{,}2402} - e^{-2{,}636})\,\mathrm{GBq} \approx 10{,}0 \cdot 1{,}100 \cdot (0{,}7865 - 0{,}0716)\,\mathrm{GBq} \approx 7{,}86\,\mathrm{GBq}$.
7. (c) Po $24\,\mathrm{h}$: $R_1 = 10{,}0\,e^{-0{,}2523}\,\mathrm{GBq} \approx 7{,}77\,\mathrm{GBq}$ in $R_2 \approx 7{,}86\,\mathrm{GBq}$, razmerje $\approx 1{,}01$: smo tik za maksimumom, v katerem je $R_2 = R_1$ (iz $\lambda_1N_1 = \lambda_2N_2$). Po $72\,\mathrm{h}$: $R_1 \approx 4{,}69\,\mathrm{GBq}$, $R_2 \approx 5{,}16\,\mathrm{GBq}$, razmerje $\approx 1{,}10$.
8. Splošno je $R_2/R_1 = \frac{\lambda_2}{\lambda_2 - \lambda_1}\left(1 - e^{-(\lambda_2 - \lambda_1)t}\right)$. Ker je $\lambda_2 \gg \lambda_1$, po nekaj razpolovnih časih tehnecija člen $e^{-(\lambda_2 - \lambda_1)t}$ izgine in ostane $R_2/R_1 = \lambda_2/(\lambda_2 - \lambda_1) \approx 1{,}10$ – **prehodno ravnovesje**: tehnecij »sledi« molibdenu.
9. Odgovor: $R_2(t) = R_{10}\frac{\lambda_2}{\lambda_2 - \lambda_1}(e^{-\lambda_1t} - e^{-\lambda_2t})$; največja aktivnost okoli $7{,}9\,\mathrm{GBq}$ po približno $23\,\mathrm{h}$, zato bolnišnice generator izpirajo enkrat na dan.

### Naloga 2

Natančno navedi predpostavke, iz katerih sledi zakon radioaktivnega razpada, in ga izpelji. Dokaži, da je povprečni življenjski čas jedra $\tau = 1/\lambda$, in pokaži, da je $\tau = t_{1/2}/\ln 2$. Utemelji, ali se razpolovni čas spremeni, če vzorec segrejemo ali razdelimo na pol.

**Rešitev:**

1. Predpostavke: jedra razpadajo neodvisno drugo od drugega; verjetnost razpada v intervalu $\mathrm{d}t$ je $\lambda\,\mathrm{d}t$, ista za vsa jedra in neodvisna od časa obstoja.
2. Izpeljava: $\mathrm{d}N = -\lambda N\,\mathrm{d}t$, $\int_{N_0}^{N}\mathrm{d}N'/N' = -\lambda\int_0^t\mathrm{d}t'$, torej $N = N_0e^{-\lambda t}$.
3. Življenjski čas: v intervalu $[t, t + \mathrm{d}t]$ razpade $\lambda N_0e^{-\lambda t}\,\mathrm{d}t$ jeder, vsako je živelo $t$. Povprečje: $\tau = \frac{1}{N_0}\int_0^\infty t\,\lambda N_0e^{-\lambda t}\,\mathrm{d}t = \lambda\int_0^\infty te^{-\lambda t}\,\mathrm{d}t = \lambda \cdot \frac{1}{\lambda^2} = \frac{1}{\lambda}$ (integral po delih).
4. Iz $t_{1/2} = \ln 2/\lambda$ sledi $\tau = t_{1/2}/\ln 2 \approx 1{,}44\,t_{1/2}$.
5. Segrevanje: $\lambda$ določajo jedrski procesi z energijami $\mathrm{MeV}$, toplotne energije so le okoli $0{,}03\,\mathrm{eV}$, zato se $t_{1/2}$ ne spremeni (redke izjeme pri zajetju elektrona so pod $1\,\%$).
6. Delitev: $\lambda$ je lastnost jedra, ne vzorca; vsaka polovica ima isti $t_{1/2}$ in pol manjšo aktivnost.

### Naloga 3

Radij ${}^{226}\mathrm{Ra}$ ($226{,}025410\,\mathrm{u}$) razpade z razpadom $\alpha$ v radon. Zapiši enačbo razpada, izračunaj vrednost $Q$ ($m(^{222}\mathrm{Rn}) = 222{,}017578\,\mathrm{u}$, $m(^4\mathrm{He}) = 4{,}002603\,\mathrm{u}$) in kinetično energijo delca $\alpha$, če radij pred razpadom miruje.

**Rešitev:**

1. Enačba: ${}^{226}_{88}\mathrm{Ra} \to {}^{222}_{86}\mathrm{Rn} + {}^4_2\mathrm{He}$; $226 = 222 + 4$, $88 = 86 + 2$. ✓
2. $Q = (226{,}025410 - 222{,}017578 - 4{,}002603) \cdot 931{,}494\,\mathrm{MeV} \approx 0{,}005229 \cdot 931{,}494\,\mathrm{MeV} \approx 4{,}87\,\mathrm{MeV}$.
3. Gibalna količina se ohrani: $p_\alpha = p_{Rn}$. Ker je $W_k = p^2/(2m)$, se energija razdeli obratno sorazmerno z masama: $W_\alpha = Q\,\dfrac{m_{Rn}}{m_{Rn} + m_\alpha}$.
4. $W_\alpha \approx 4{,}87 \cdot 222{,}0/226{,}0\,\mathrm{MeV} \approx 4{,}78\,\mathrm{MeV}$; jedro radona odnese ostanek, okoli $0{,}09\,\mathrm{MeV}$.
5. Odgovor: $Q \approx 4{,}87\,\mathrm{MeV}$, delec $\alpha$ ima $4{,}78\,\mathrm{MeV}$. Ker ima razpad dva produkta, imajo vsi delci $\alpha$ iz tega prehoda isto energijo – spekter $\alpha$ je črtast, spekter $\beta$ pa zvezen (tretji delec, nevtrino).

## Drugače: Korak za korakom s številkami

Koliko jeder ${}^{18}\mathrm{F}$ je v odmerku za PET z aktivnostjo $370\,\mathrm{MBq}$, in kolikšna je njihova masa? $t_{1/2} = 109{,}8\,\mathrm{min}$, atomska masa $18{,}0\,\mathrm{u}$.

1. **Razpolovni čas v sekundah:** $109{,}8 \cdot 60\,\mathrm{s} = 6588\,\mathrm{s}$.
2. **Razpadna konstanta:** $\lambda = 0{,}6931/6588\,\mathrm{s^{-1}} \approx 1{,}052 \cdot 10^{-4}\,\mathrm{s^{-1}}$.
3. **Število jeder:** $N = R/\lambda = 3{,}7 \cdot 10^8/1{,}052 \cdot 10^{-4} \approx 3{,}52 \cdot 10^{12}$.
4. **Masa:** $m = 3{,}52 \cdot 10^{12} \cdot 18{,}0 \cdot 1{,}66054 \cdot 10^{-27}\,\mathrm{kg} \approx 1{,}05 \cdot 10^{-13}\,\mathrm{kg}$, okoli $0{,}1\,\mathrm{ng}$.
5. **Po dveh urah transporta:** $R = 370 \cdot 2^{-120/109{,}8}\,\mathrm{MBq} \approx 370 \cdot 0{,}469\,\mathrm{MBq} \approx 174\,\mathrm{MBq}$. Zato ciklotroni za PET stojijo blizu bolnišnic.

## Drugače: Bolj natančno

**Kapljični model in semiempirična masna formula.** Vzorec iz tabele vezavnih energij opiše Weizsäckerjeva formula, ki jedro obravnava kot kapljo nestisljive tekočine:

$$W_v = a_vA - a_sA^{2/3} - a_c\frac{Z(Z-1)}{A^{1/3}} - a_a\frac{(A - 2Z)^2}{A} + \delta.$$

Členi pomenijo prostorninsko vezavo (nasičenje sil, $\propto A$), manjšo vezavo nukleonov na površju ($\propto A^{2/3}$), elektrostatični odboj protonov, nesimetrijo med številom protonov in nevtronov (Paulijevo načelo) ter sparitveni člen $\delta$ (sodo-soda jedra so bolj vezana). S konstantami, prilagojenimi meritvam ($a_v \approx 15{,}8\,\mathrm{MeV}$, $a_s \approx 18{,}3\,\mathrm{MeV}$, $a_c \approx 0{,}71\,\mathrm{MeV}$, $a_a \approx 23{,}2\,\mathrm{MeV}$), napove $W_v$ težjih jeder na približno $1\,\%$ in pojasni, zakaj imajo stabilna težka jedra več nevtronov kot protonov.

**Statistika štetja.** Število razpadov, ki jih detektor prešteje v času $t$, sledi Poissonovi porazdelitvi: pri pričakovani vrednosti $\bar n$ je standardni odklon $\sqrt{\bar n}$. Pri $10\,000$ sunkih je relativna negotovost $1\,\%$, pri $100$ sunkih $10\,\%$. Zakon razpada velja za pričakovano vrednost; pri majhnem številu jeder so odstopanja velika.

**Zaporedni razpadi.** Za verigo $1 \to 2 \to 3$ splošna rešitev (Batemanove enačbe) vodi v tri primere: $\lambda_1 \ll \lambda_2$ (trajno ravnovesje, $R_2 = R_1$, npr. radij in radon), $\lambda_1 < \lambda_2$ (prehodno ravnovesje, generator tehnecija) in $\lambda_1 > \lambda_2$ (ni ravnovesja).

## Preveri se

? Katera trditev o vezavni energiji na nukleon je pravilna?
- Največja je pri uranu, ker ima uran največ nukleonov.
~ Največjo celotno vezavno energijo ima res težko jedro, na nukleon pa je pri uranu manjša ($7{,}6\,\mathrm{MeV}$) kot pri železu.
+ Največja je okoli železa in niklja, zato zlivanje lahkih in cepitev težkih jeder sproščata energijo.
- Za vsa jedra je točno enaka, ker so jedrske sile nasičene.
~ Nasičenje pojasni, zakaj je $W_v/A$ skoraj stalna, ne točno enaka: pri lahkih jedrih je manjša (površje), pri težkih pa jo zmanjša elektrostatični odboj.
> Krivulja $W_v/A$ ima vrh okoli $8{,}8\,\mathrm{MeV}$ pri $A \approx 56$. Premik proti vrhu (zlivanje z leve, cepitev z desne) poveča vezavno energijo in jo sprosti.

? Vzorec ima aktivnost $1000\,\mathrm{Bq}$. Kolikšna je aktivnost po treh razpolovnih časih?
- $0\,\mathrm{Bq}$
~ Razpad ni linearen; po vsakem razpolovnem času ostane polovica ostanka, nikoli nič.
- $333\,\mathrm{Bq}$
~ Aktivnosti si delil s številom razpolovnih časov. Pravilno jo razpoloviš trikrat: $2^{-3}$.
+ $125\,\mathrm{Bq}$
> $R = 1000 \cdot 2^{-3}\,\mathrm{Bq} = 125\,\mathrm{Bq}$.

? Kje je napaka v rešitvi? »Aktivnost ${}^{32}\mathrm{P}$ je $37\,\mathrm{MBq}$, $t_{1/2} = 14{,}27\,\mathrm{d}$. (1) $\lambda = \ln 2/14{,}27 \approx 0{,}0486$. (2) $N = R/\lambda = 3{,}7 \cdot 10^7/0{,}0486 \approx 7{,}6 \cdot 10^8$ jeder. (3) Masa je $7{,}6 \cdot 10^8 \cdot 32\,\mathrm{u}$.«
- v koraku 1
~ $\ln 2/14{,}27 \approx 0{,}0486$ je pravilno – a v enotah $\mathrm{d^{-1}}$, kar postane težava v naslednjem koraku.
+ v koraku 2
- v koraku 3
~ Če bi bil $N$ pravilen, bi bila masa res $N \cdot 32\,\mathrm{u}$. Napaka je prej.
> Aktivnost je v razpadih na sekundo, $\lambda$ pa na dan. Pravilno $\lambda \approx 5{,}62 \cdot 10^{-7}\,\mathrm{s^{-1}}$ in $N \approx 6{,}6 \cdot 10^{13}$ – število je bilo za faktor $86\,400$ premajhno.

? Vzorca ${}^{18}\mathrm{F}$ ($t_{1/2} = 110\,\mathrm{min}$) in ${}^{32}\mathrm{P}$ ($t_{1/2} = 14{,}3\,\mathrm{d}$) imata enako aktivnost. Kateri ima več jeder?
- Oba enako, ker imata enako aktivnost.
~ Aktivnost je $\lambda N$; pri različnih $\lambda$ enaka aktivnost pomeni različen $N$.
- ${}^{18}\mathrm{F}$, ker hitreje razpada.
~ Hitreje razpada vsako posamezno jedro, zato za isto število razpadov na sekundo zadošča manj jeder.
+ ${}^{32}\mathrm{P}$, približno $190$-krat več.
> $N = R/\lambda = R\,t_{1/2}/\ln 2$. Razmerje razpolovnih časov je $14{,}3 \cdot 1440/110 \approx 190$, zato ima fosfor okoli $190$-krat več jeder.

? Pravilnik v laboratoriju pravi, da sme kratkoživ radioaktivni odpadek v običajne odpadke šele po »desetih razpolovnih časih«. Na koliko se v tem času zmanjša aktivnost?
- na desetino
~ To bi veljalo, če bi aktivnost padala linearno do nič v desetih korakih. Vsak razpolovni čas jo razpolovi.
+ na približno tisočino ($2^{-10} \approx 1/1024$)
- na nič, ker po desetih razpolovnih časih razpade vse
~ Eksponentni razpad nikoli ne doseže nič; ostane $2^{-10}$ začetne aktivnosti.
> Po desetih razpolovnih časih ostane $2^{-10} = 1/1024$ začetne aktivnosti, torej približno $0{,}1\,\%$. Pri ${}^{32}\mathrm{P}$ to pomeni skoraj pet mesecev hrambe.

:::simboli
A | nukleonsko (masno) število | A = Z + N | –
Z | vrstno (protonsko) število | | –
N | število nevtronov ali nerazpadlih jeder | | – | pomen je odvisen od razdelka
r | polmer jedra | r \approx r_0A^{1/3} | fm
r_0 | konstanta polmera jedra | | fm | okoli 1,2 fm
E_u | energija, ki ustreza masi 1 u | E_u = (1\,\mathrm{u})\,c^2 | MeV | 931,494 MeV
c | hitrost svetlobe | | m/s
W_v | vezavna energija jedra | W_v = \left[Z\,m(^1\mathrm{H}) + N\,m_n - m(^A\mathrm{X})\right]c^2 | MeV
m_n | masa nevtrona | | u
Q | sproščena energija reakcije | Q = \left(\sum m_{pred} - \sum m_{po}\right)c^2 | MeV
m_{pred} | masa delcev pred reakcijo | | u
m_{po} | masa delcev po reakciji | | u
N_0 | začetno število jeder | | –
\lambda | razpadna konstanta | \lambda = \frac{\ln 2}{t_{1/2}} | s^{-1}
t | čas | | s
e | osnova naravnega logaritma | | – | e ≈ 2,718
t_{1/2} | razpolovni čas | t_{1/2} = \frac{\ln 2}{\lambda} | s
\tau | povprečni življenjski čas | \tau = \frac{1}{\lambda} | s
R | aktivnost | R = \lambda N | Bq
R_0 | začetna aktivnost | | Bq
R_m | mejna aktivnost | | Bq
t_m | čas, da aktivnost pade na mejo | t_m = \frac{1}{\lambda}\ln\frac{R_0}{R_m} | d
m | masa vzorca | | kg
a_v, a_s, a_c, a_a | konstante masne formule | | MeV
\delta | sparitveni člen | | MeV
:::
