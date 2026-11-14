---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Glasbene vilice udari rahlo, nato močno. Drugi ton je glasnejši, a natanko enako visok: kraki tudi pri večjem odmiku naredijo $440$ nihajev v sekundi. Na prvi pogled je to narobe, saj morajo pri večjem odmiku prepotovati daljšo pot. Uganko razreši **harmonična** sila: dlje kot je krak izmaknjen, močneje ga vleče nazaj, zato je tudi hitrejši in se vrne v istem času.

Isti model opiše strune glasbil, membrano zvočnika, atome, ki nihajo vzdolž vezi (infrardeči spektri), potresno varnost stavb in blažilnike v avtomobilu. Ko nihanje **dušimo**, ton vilic počasi utihne, in tudi to zna model izračunati.

## Razlaga

Začni pri enem samem nihalu: utež na vzmeti potegneš navzdol in spustiš. Vzmet jo vleče nazaj, utež gre skozi ravnovesno lego, se ustavi na drugi strani in se vrne. Ta primer najprej razstavimo na pojme, enačbo in rešitev, potem pa ga posplošimo na nihalo na vrvici, energijo in dušenje.

### Utež na vzmeti, korak za korakom

**1. Osnovni pojmi.** Nihalo se giblje okoli **ravnovesne lege**, kjer je vsota sil nanj enaka nič. Odmik od ravnovesne lege označimo z $x$. Največji odmik je **amplituda** $x_0$. **Nihajni čas** $t_0$ (v mnogih učbenikih $T$) je čas enega celega nihaja, **frekvenca** $\nu = 1/t_0$ (enota $\mathrm{Hz} = \mathrm{s^{-1}}$), **krožna frekvenca** pa $\omega = 2\pi\nu = 2\pi/t_0$.

**2. Harmonična sila in enačba nihanja.** **Definicija.** Naj se telo z maso $m$ giblje vzdolž osi $x$ in naj nanj v smeri gibanja deluje le sila, ki je sorazmerna z odmikom od ravnovesne lege in usmerjena proti njej:

$$F = -kx, \qquad k > 0.$$

Takšno silo imenujemo **harmonična sila**, gibanje pod njo pa **harmonično nihanje** (telo je **harmonični oscilator**). Po drugem Newtonovem zakonu je $m\ddot{x} = -kx$ oziroma

$$\ddot{x} + \omega_0^2 x = 0, \qquad \omega_0 = \sqrt{\frac{k}{m}}.$$

**Izrek.** Vsaka rešitev te enačbe ima obliko

$$x(t) = x_0\cos(\omega_0 t + \delta),$$

kjer sta amplituda $x_0 \ge 0$ in **fazni zamik** $\delta$ določena z začetno lego $x(0)$ in začetno hitrostjo $v(0)$ (amplituda enolično, pri $x_0 > 0$ pa $\delta$ enolično do večkratnika $2\pi$):

$$x_0 = \sqrt{x(0)^2 + \left(\frac{v(0)}{\omega_0}\right)^2},$$

$$\cos\delta = \frac{x(0)}{x_0}, \qquad \sin\delta = -\frac{v(0)}{\omega_0 x_0}.$$

*Dokaz (skica).* Z dvakratnim odvajanjem dobiš $\ddot{x} = -\omega_0^2x_0\cos(\omega_0 t + \delta) = -\omega_0^2x$, torej funkcija enačbo reši. Pri $t = 0$ je $x(0) = x_0\cos\delta$ in $v(0) = -\omega_0x_0\sin\delta$; kvadriramo in seštejemo, pa dobimo $x_0$. Da drugih rešitev ni, sledi iz izreka o enoličnosti za linearne enačbe drugega reda (razdelek »Bolj natančno«).

**3. Hitrost in pospešek.** Z odvajanjem dobimo

$$v = \dot{x} = -\omega_0 x_0\sin(\omega_0 t + \delta), \qquad a = \ddot{x} = -\omega_0^2 x_0\cos(\omega_0 t + \delta) = -\omega_0^2 x.$$

Največja hitrost $v_{\max} = \omega_0 x_0$ je v ravnovesni legi, največji pospešek $a_{\max} = \omega_0^2 x_0$ pa v skrajnih legah, kjer je hitrost nič. Nihajni čas $t_0 = 2\pi/\omega_0$ ni odvisen od amplitude; to je značilnost harmoničnega nihanja.

:::premisli
Krak glasbenih vilic udariš močneje, da se amplituda podvoji. Kaj se zgodi z največjo hitrostjo kraka in kaj z višino tona?
---
Največja hitrost $v_{\max} = \omega_0 x_0$ se podvoji, nihajni čas $t_0 = 2\pi/\omega_0$ pa se ne spremeni, ker $\omega_0$ ni odvisna od $x_0$. Ton je glasnejši, a enako visok.
:::

### Od vzmeti do nihala na vrvici

**4. Nihalo na vijačni vzmeti.** Vzmet s koeficientom $k$ (enota $\mathrm{N/m}$) in utež z maso $m$:

$$t_0 = 2\pi\sqrt{\frac{m}{k}}.$$

Pri navpični vzmeti teža le premakne ravnovesno lego za $mg/k$ navzdol; okoli nove ravnovesne lege utež niha z istim nihajnim časom. Masa vzmeti je v tem modelu zanemarjena.

Če utež obesimo na dve vzmeti, je pomembno, kako sta vezani. Pri **vzporedni** vezavi (vzmeti druga ob drugi) se raztezka ujemata, sili pa seštejeta, zato je $k = k_1 + k_2$ in nihalo niha hitreje. Pri **zaporedni** vezavi (vzmet pod vzmetjo) obe nosita isto silo, raztezka pa se seštejeta, zato je $1/k = 1/k_1 + 1/k_2$ in nihalo niha počasneje. Dve enaki vzmeti zaporedno imata polovični koeficient, vzporedno pa dvakratnega.

**5. Matematično nihalo.** Točkasta utež na lahki neraztegljivi vrvici dolžine $l$. Če je odklon $\varphi$, je tangentna komponenta teže $-mg\sin\varphi$, lok pa $s = l\varphi$, zato je pospešek vzdolž loka $\ddot{s} = l\ddot{\varphi}$. Drugi Newtonov zakon vzdolž loka da

$$ml\ddot{\varphi} = -mg\sin\varphi.$$

Pri **majhnih odklonih** ($\varphi \lesssim 10^\circ$) je $\sin\varphi \approx \varphi$ (v radianih) in dobimo harmonično nihanje z

$$\omega_0 = \sqrt{\frac{g}{l}}, \qquad t_0 = 2\pi\sqrt{\frac{l}{g}}.$$

Nihajni čas ni odvisen od mase uteži. Pri večjih odklonih je nihanje še vedno periodično, ni pa več točno harmonično in nihajni čas z amplitudo počasi narašča.

:::premisli
Pri vzmeti težja utež niha počasneje. Zakaj se pri matematičnem nihalu masa uteži pokrajša?
---
Sila, ki vrača utež, je del teže $mg\sin\varphi$ in je sorazmerna z maso, sorazmerna z maso pa je tudi vztrajnost $m$ na levi strani enačbe. Pri vzmeti sila $kx$ od mase ni odvisna, zato tam masa ostane v $t_0$.
:::

### Energija, dušenje in resonanca

**6. Energija nihanja.** Pri nihalu na vzmeti se kinetična energija $\tfrac{1}{2}mv^2$ in prožnostna energija $\tfrac{1}{2}kx^2$ izmenjujeta, njuna vsota pa je stalna:

$$W = \tfrac{1}{2}mv^2 + \tfrac{1}{2}kx^2 = \tfrac{1}{2}kx_0^2 = \tfrac{1}{2}mv_{\max}^2.$$

*Dokaz.* Odvajamo vsoto po času: $\dot{W} = mv\dot{v} + kx\dot{x} = v(m\ddot{x} + kx) = 0$, ker je po enačbi gibanja $m\ddot{x} + kx = 0$. Energija je torej stalna; v skrajni legi je $v = 0$ in $W = \tfrac{1}{2}kx_0^2$.

Energija je sorazmerna s **kvadratom amplitude**. Iz $\tfrac{1}{2}mv^2 + \tfrac{1}{2}kx^2 = \tfrac{1}{2}kx_0^2$ in $k/m = \omega_0^2$ dobimo hitrost pri poljubnem odmiku: $v = \pm\omega_0\sqrt{x_0^2 - x^2}$.

**7. Dušeno nihanje.** V resnici nihanje zaradi trenja in upora počasi zamre. Pri majhnih hitrostih je sila upora sorazmerna s hitrostjo, $F_u = -bv$. Enačba gibanja je

$$m\ddot{x} + b\dot{x} + kx = 0,$$

kar po deljenju z $m$ zapišemo kot

$$\ddot{x} + 2\beta\dot{x} + \omega_0^2 x = 0, \qquad \beta = \frac{b}{2m}.$$

Nastavek $x = e^{\lambda t}$ da karakteristično enačbo $\lambda^2 + 2\beta\lambda + \omega_0^2 = 0$ s koreni $\lambda = -\beta \pm \sqrt{\beta^2 - \omega_0^2}$. Glede na velikost **koeficienta dušenja** $\beta$ (predznak diskriminante) ločimo tri primere:

- **šibko dušenje** ($\beta < \omega_0$): $x(t) = x_0\,e^{-\beta t}\cos(\omega t + \delta)$ z $\omega = \sqrt{\omega_0^2 - \beta^2}$; amplituda eksponentno pojema, energija pa kot $e^{-2\beta t}$;
- **kritično dušenje** ($\beta = \omega_0$): telo se najhitreje vrne v ravnovesno lego brez nihanja;
- **nadkritično dušenje** ($\beta > \omega_0$): telo se počasi, brez nihanja, plazi v ravnovesno lego.

Pri šibkem dušenju se amplituda v času $t_{1/2} = \ln 2/\beta$ razpolovi. Ker je navadno $\beta \ll \omega_0$, se krožna frekvenca zaradi dušenja skoraj ne spremeni. Energija vedno pojema, ker je moč sile upora $\dot{W} = F_uv = -bv^2 \le 0$.

**8. Vsiljeno nihanje in resonanca (na kratko).** Če na dušen oscilator deluje sila $F_0\cos\omega_vt$, po prehodnem času niha s krožno frekvenco sile in amplitudo

$$x_0(\omega_v) = \frac{F_0/m}{\sqrt{(\omega_0^2 - \omega_v^2)^2 + 4\beta^2\omega_v^2}}.$$

Če je $\beta < \omega_0/\sqrt{2}$, je amplituda največja pri $\omega_v = \sqrt{\omega_0^2 - 2\beta^2}$, torej blizu $\omega_0$ (**resonanca**), in tem večja, čim šibkejše je dušenje.

## Rešeni primeri

### Primer 1 (lažji)

Utež z maso $0{,}25\,\mathrm{kg}$ visi na vijačni vzmeti s koeficientom $40\,\mathrm{N/m}$. Utež izmaknemo za $4{,}0\,\mathrm{cm}$ iz ravnovesne lege in spustimo. Kolikšni so nihajni čas, frekvenca, največja hitrost in največji pospešek?

**Podatki:** $m = 0{,}25\,\mathrm{kg}$, $k = 40\,\mathrm{N/m}$, $x_0 = 4{,}0\,\mathrm{cm} = 0{,}040\,\mathrm{m}$
**Iščemo:** $t_0$, $\nu$, $v_{\max}$, $a_{\max}$

:::formula
$\omega_0 = \sqrt{k/m}$, $t_0 = 2\pi/\omega_0$, $\nu = 1/t_0$, $v_{\max} = \omega_0 x_0$, $a_{\max} = \omega_0^2 x_0$
:::

**Rešitev:**

1. Najprej krožna frekvenca, ker iz nje sledijo vse druge količine: $\omega_0 = \sqrt{40\,\mathrm{N/m} / 0{,}25\,\mathrm{kg}} = \sqrt{160}\,\mathrm{s^{-1}} \approx 12{,}6\,\mathrm{s^{-1}}$.
2. $t_0 = 2\pi/12{,}65\,\mathrm{s^{-1}} \approx 0{,}497\,\mathrm{s}$, $\nu = 1/t_0 \approx 2{,}01\,\mathrm{Hz}$.
3. Največja hitrost (v ravnovesni legi): $v_{\max} = 12{,}65\,\mathrm{s^{-1}} \cdot 0{,}040\,\mathrm{m} \approx 0{,}506\,\mathrm{m/s}$.
4. Največji pospešek je v skrajni legi, kjer je sila vzmeti največja: $a_{\max} = 160\,\mathrm{s^{-2}} \cdot 0{,}040\,\mathrm{m} = 6{,}4\,\mathrm{m/s^2}$.
5. Odgovor: utež niha z nihajnim časom približno $0{,}50\,\mathrm{s}$ (frekvenca $2{,}0\,\mathrm{Hz}$), največja hitrost je približno $0{,}51\,\mathrm{m/s}$, največji pospešek pa $6{,}4\,\mathrm{m/s^2}$.

### Primer 2

Matematično nihalo ima dolžino $1{,}20\,\mathrm{m}$. Utež izmaknemo tako, da je vodoravni odmik $5{,}0\,\mathrm{cm}$, in jo spustimo. Kolikšen je nihajni čas in kolikšna je največja hitrost uteži? Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $l = 1{,}20\,\mathrm{m}$, $x_0 = 5{,}0\,\mathrm{cm} = 0{,}050\,\mathrm{m}$ (majhen odklon), $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** nihajni čas $t_0$ in največjo hitrost $v_{\max}$

:::formula
$\omega_0 = \sqrt{g/l}$, $t_0 = 2\pi\sqrt{l/g}$, $v_{\max} = \omega_0 x_0$
:::

**Rešitev:**

1. Odklon je majhen: $\varphi_0 \approx 0{,}050/1{,}20 \approx 0{,}042\,\mathrm{rad} \approx 2{,}4^\circ$, zato velja harmonični približek.
2. Ker velja $\sin\varphi \approx \varphi$, je $\omega_0 = \sqrt{9{,}81/1{,}20}\,\mathrm{s^{-1}} \approx 2{,}86\,\mathrm{s^{-1}}$.
3. $t_0 = 2\pi/2{,}859\,\mathrm{s^{-1}} \approx 2{,}20\,\mathrm{s}$.
4. Pri majhnem odklonu je lok skoraj enak vodoravnemu odmiku, zato $v_{\max} = 2{,}859\,\mathrm{s^{-1}} \cdot 0{,}050\,\mathrm{m} \approx 0{,}143\,\mathrm{m/s}$.
5. Preizkus z energijo: dvig uteži je $h = l(1 - \cos\varphi_0) \approx l\varphi_0^2/2 \approx 1{,}04\,\mathrm{mm}$, $v = \sqrt{2gh} \approx 0{,}143\,\mathrm{m/s}$. ✓
6. Odgovor: nihajni čas je približno $2{,}20\,\mathrm{s}$, največja hitrost pa približno $0{,}14\,\mathrm{m/s}$.

### Primer 3 (težji)

Utež z maso $0{,}50\,\mathrm{kg}$ niha na vzmeti s koeficientom $50\,\mathrm{N/m}$ v zraku. Amplituda se v $8{,}0\,\mathrm{s}$ zmanjša z $10\,\mathrm{cm}$ na $5{,}0\,\mathrm{cm}$. Kolikšna sta koeficient dušenja in koeficient upora $b$? Koliko nihajev naredi utež v tem času, koliko mehanske energije se v tem času pretvori v notranjo energijo zraka in po kolikšnem času je amplituda le še $1\,\%$ začetne? Kolikšen bi moral biti koeficient upora, da bi bilo dušenje kritično?

**Podatki:** $m = 0{,}50\,\mathrm{kg}$, $k = 50\,\mathrm{N/m}$, $x_0 = 10\,\mathrm{cm}$, po $t_1 = 8{,}0\,\mathrm{s}$ je amplituda $5{,}0\,\mathrm{cm}$, upor $F_u = -bv$
**Iščemo:** $\beta$, $b$, število nihajev v $8{,}0\,\mathrm{s}$, izgubo energije $\Delta W$, čas $t_2$, ko je amplituda $1\,\%$ začetne, koeficient upora $b_k$ za kritično dušenje

:::formula
Amplituda $x_0e^{-\beta t}$, $\beta = b/(2m)$, $\omega = \sqrt{\omega_0^2 - \beta^2}$, $t_0 = 2\pi/\omega$, $W = \tfrac{1}{2}kx_0^2$, kritično dušenje pri $\beta = \omega_0$
:::

**Rešitev:**

1. Amplituda pojema kot $x_0e^{-\beta t}$ in se v $t_1$ razpolovi, zato iz $e^{-\beta t_1} = 1/2$ sledi $\beta = \ln 2/t_1 = 0{,}693/8{,}0\,\mathrm{s} \approx 0{,}0866\,\mathrm{s^{-1}}$.
2. Koeficient upora: $b = 2m\beta = 2 \cdot 0{,}50\,\mathrm{kg} \cdot 0{,}0866\,\mathrm{s^{-1}} \approx 0{,}0866\,\mathrm{kg/s}$.
3. Lastna krožna frekvenca: $\omega_0 = \sqrt{50/0{,}50}\,\mathrm{s^{-1}} = 10\,\mathrm{s^{-1}}$. Ker je $\beta \ll \omega_0$, je $\omega = \sqrt{100 - 0{,}0075}\,\mathrm{s^{-1}} \approx 10{,}0\,\mathrm{s^{-1}}$ in $t_0 \approx 0{,}628\,\mathrm{s}$.
4. Število nihajev v $8{,}0\,\mathrm{s}$ (čas, deljen z nihajnim časom): $8{,}0/0{,}628 \approx 12{,}7$.
5. Energija je sorazmerna s kvadratom amplitude: na začetku $W_1 = \tfrac{1}{2} \cdot 50\,\mathrm{N/m} \cdot (0{,}10\,\mathrm{m})^2 = 0{,}25\,\mathrm{J}$, po $8{,}0\,\mathrm{s}$ pa $\tfrac{1}{2} \cdot 50 \cdot 0{,}050^2\,\mathrm{J} = 0{,}0625\,\mathrm{J}$. Sila upora pretvori $\Delta W = 0{,}25 - 0{,}0625 \approx 0{,}19\,\mathrm{J}$.
6. Amplituda $1\,\%$: $e^{-\beta t_2} = 0{,}01$, torej $t_2 = \ln 100/\beta = 4{,}605/0{,}0866\,\mathrm{s} \approx 53\,\mathrm{s}$.
7. Kritično dušenje zahteva $\beta = \omega_0$, torej $b_k = 2m\omega_0 = 2 \cdot 0{,}50\,\mathrm{kg} \cdot 10\,\mathrm{s^{-1}} = 10\,\mathrm{kg/s}$, kar je približno $115$-krat več od dejanskega $b$.
8. Odgovor: koeficient dušenja je približno $0{,}087\,\mathrm{s^{-1}}$, koeficient upora približno $0{,}087\,\mathrm{kg/s}$; v $8{,}0\,\mathrm{s}$ utež naredi približno $12{,}7$ nihaja in izgubi približno $0{,}19\,\mathrm{J}$ (tri četrtine) energije, amplituda pade na $1\,\%$ po približno $53\,\mathrm{s}$. Za kritično dušenje bi potrebovali $b_k = 10\,\mathrm{kg/s}$, na primer utež v viskoznem olju.

### Primer 4 – zdaj ti

Membrana nizkotonskega zvočnika ima skupaj s tuljavo maso $20\,\mathrm{g}$, prožno vpetje pa jo vleče nazaj s koeficientom $2000\,\mathrm{N/m}$. Pri kateri frekvenci zvočnik sam od sebe najraje niha in kolikšna sta največja hitrost in največji pospešek membrane, ko niha z amplitudo $2{,}0\,\mathrm{mm}$?

**Podatki:** $m = 20\,\mathrm{g} = 0{,}020\,\mathrm{kg}$, $k = 2000\,\mathrm{N/m}$, $x_0 = 2{,}0\,\mathrm{mm} = 0{,}0020\,\mathrm{m}$
**Iščemo:** lastno frekvenco $\nu_0$, $v_{\max}$, $a_{\max}$

:::formula
$\omega_0 = \sqrt{k/m}$, $\nu_0 = \omega_0/(2\pi)$, $v_{\max} = \omega_0 x_0$, $a_{\max} = \omega_0^2 x_0$
:::

**Rešitev:**

1. Membrana z vpetjem je nihalo na vzmeti, zato $\omega_0 = \sqrt{2000/0{,}020}\,\mathrm{s^{-1}} = \sqrt{100\,000}\,\mathrm{s^{-1}} \approx 316\,\mathrm{s^{-1}}$.
2. Lastna frekvenca: $\nu_0 = 316/(2\pi)\,\mathrm{Hz} \approx 50{,}3\,\mathrm{Hz}$, globok bas.
3. Izračunaj $v_{\max}$ in $a_{\max}$ sam, nato preveri:

:::premisli
Kolikšna sta $v_{\max}$ in $a_{\max}$ membrane? Kolikokrat je $a_{\max}$ večji od $g$?
---
$v_{\max} = 316\,\mathrm{s^{-1}} \cdot 0{,}0020\,\mathrm{m} \approx 0{,}63\,\mathrm{m/s}$, $a_{\max} = 100\,000\,\mathrm{s^{-2}} \cdot 0{,}0020\,\mathrm{m} = 200\,\mathrm{m/s^2}$, kar je približno $20$-krat več od $g$.
:::

## Pogoste napake

- **Stopinje v $\sin\varphi \approx \varphi$.** Približek velja le, če je kot v radianih. Tudi v $\cos(\omega_0 t + \delta)$ mora biti kalkulator nastavljen na radiane.
- **Mešanje $\omega$ in $\nu$.** $\omega = 2\pi\nu$. Formula $t_0 = 2\pi\sqrt{m/k}$ že vsebuje faktor $2\pi$; ne deli še enkrat.
- **Nihajni čas odvisen od amplitude.** Pri harmoničnem nihanju ni. Pri matematičnem nihalu je odvisnost opazna šele pri velikih odklonih.
- **Masa pri matematičnem nihalu.** Nihajni čas matematičnega nihala ni odvisen od mase uteži; nihalo na vzmeti pa z večjo maso niha počasneje.
- **Največja hitrost v skrajni legi.** V skrajni legi je hitrost nič, pospešek pa največji. V ravnovesni legi je obratno.
- **Dušenje in energija.** Amplituda pojema kot $e^{-\beta t}$, energija pa kot $e^{-2\beta t}$. Ko se amplituda razpolovi, ostane le četrtina energije.

## Povzetek

- Harmonično nihanje: $F = -kx$, $\ddot{x} + \omega_0^2x = 0$, $x = x_0\cos(\omega_0 t + \delta)$.
- $v_{\max} = \omega_0x_0$ (v ravnovesni legi), $a_{\max} = \omega_0^2x_0$ (v skrajni legi); $t_0 = 2\pi/\omega_0$, $\nu = 1/t_0$.
- Vzmet: $t_0 = 2\pi\sqrt{m/k}$; matematično nihalo (majhni odkloni): $t_0 = 2\pi\sqrt{l/g}$.
- Energija: $W = \tfrac{1}{2}kx_0^2 = \tfrac{1}{2}mv_{\max}^2$, sorazmerna s kvadratom amplitude.
- Dušenje: $\ddot{x} + 2\beta\dot{x} + \omega_0^2x = 0$; šibko: amplituda $\propto e^{-\beta t}$, $\omega = \sqrt{\omega_0^2 - \beta^2}$; kritično pri $\beta = \omega_0$.

## Za izpit

Znati moraš povedati:

- definicijo harmonične sile in harmoničnega nihanja, enačbo $\ddot{x} + \omega_0^2x = 0$ in izrek o njeni rešitvi, vključno z izračunom $x_0$ in $\delta$ iz začetne lege in hitrosti;
- izpeljavo $t_0 = 2\pi\sqrt{m/k}$ ter $t_0 = 2\pi\sqrt{l/g}$ s pogojem majhnih odklonov ($\sin\varphi \approx \varphi$, kot v radianih);
- izpeljavo koeficienta zaporedne in vzporedne vezave vzmeti;
- dokaz ohranitve energije nedušenega nihala in izpeljavo $v = \pm\omega_0\sqrt{x_0^2 - x^2}$;
- enačbo dušenega nihanja, karakteristično enačbo, tri vrste dušenja s pogoji in pojemanje amplitude ($e^{-\beta t}$) ter energije ($e^{-2\beta t}$).

### Naloga 1

Dve vzmeti s koeficientoma $k_1 = 60\,\mathrm{N/m}$ in $k_2 = 30\,\mathrm{N/m}$ sta vezani zaporedno, zgornja je pritrjena na strop, na spodnjo obesimo utež z maso $0{,}40\,\mathrm{kg}$. (a) Za koliko je raztegnjena vsaka vzmet, ko utež miruje? (b) Utež izmaknemo tako, da je ob $t = 0$ $3{,}0\,\mathrm{cm}$ pod ravnovesno lego in se giblje navzgor s hitrostjo $0{,}25\,\mathrm{m/s}$. Kolikšna sta nihajni čas in amplituda in ob katerem času je utež prvič v najvišji legi? (c) Kolikšni sta največja in najmanjša sila v zgornji vzmeti in ali sta vzmeti ves čas napeti? Masi vzmeti in upor zanemari, $g = 9{,}81\,\mathrm{m/s^2}$.

**Rešitev:**

1. Zaporedna vezava: $1/k = 1/60 + 1/30 = 3/60\,\mathrm{m/N}$, torej $k = 20\,\mathrm{N/m}$.
2. Obe vzmeti nosita isto silo $mg = 0{,}40 \cdot 9{,}81\,\mathrm{N} \approx 3{,}92\,\mathrm{N}$, zato $\Delta l_1 = 3{,}924/60\,\mathrm{m} \approx 6{,}5\,\mathrm{cm}$ in $\Delta l_2 = 3{,}924/30\,\mathrm{m} \approx 13{,}1\,\mathrm{cm}$; skupaj $mg/k \approx 19{,}6\,\mathrm{cm}$.
3. $\omega_0 = \sqrt{20/0{,}40}\,\mathrm{s^{-1}} = \sqrt{50}\,\mathrm{s^{-1}} \approx 7{,}07\,\mathrm{s^{-1}}$, $t_0 = 2\pi/7{,}071\,\mathrm{s} \approx 0{,}889\,\mathrm{s}$.
4. Os $x$ usmerimo navzdol, izhodišče je v ravnovesni legi: $x(0) = 0{,}030\,\mathrm{m}$, $v(0) = -0{,}25\,\mathrm{m/s}$. Amplituda: $x_0 = \sqrt{0{,}030^2 + (0{,}25/7{,}071)^2}\,\mathrm{m} = \sqrt{0{,}00215}\,\mathrm{m} \approx 0{,}0464\,\mathrm{m}$.
5. Fazni zamik: $\cos\delta = x(0)/x_0 = 0{,}030/0{,}04637 \approx 0{,}647$, $\sin\delta = -v(0)/(\omega_0x_0) = 0{,}25/(7{,}071 \cdot 0{,}04637) \approx 0{,}762$, torej $\delta \approx 0{,}867\,\mathrm{rad}$.
6. Najvišja lega je $x = -x_0$, kar zahteva $\omega_0t + \delta = \pi$: $t = (\pi - 0{,}867)/7{,}071\,\mathrm{s} \approx 0{,}322\,\mathrm{s}$.
7. Sila v vzmeteh je $F = k(mg/k + x) = mg + kx$: največja v spodnji legi, $F_{\max} = 3{,}924 + 20 \cdot 0{,}04637 \approx 4{,}85\,\mathrm{N}$, najmanjša v zgornji, $F_{\min} = 3{,}924 - 0{,}927 \approx 3{,}00\,\mathrm{N}$.
8. Odgovor: vzmeti sta v mirovanju raztegnjeni za $6{,}5\,\mathrm{cm}$ in $13{,}1\,\mathrm{cm}$; utež niha z $t_0 \approx 0{,}89\,\mathrm{s}$ in amplitudo $4{,}6\,\mathrm{cm}$ ter je prvič v najvišji legi ob $t \approx 0{,}32\,\mathrm{s}$. Sila v vzmeteh se giblje med $3{,}0\,\mathrm{N}$ in $4{,}9\,\mathrm{N}$; ker je ves čas pozitivna, sta vzmeti ves čas napeti in model velja.

### Naloga 2

Natančno navedi, kdaj je nihanje harmonično, in za nedušeno nihalo na vzmeti dokaži, da je vsota kinetične in prožnostne energije stalna; iz tega izpelji hitrost v odvisnosti od odmika. Utemelji, ali je matematično nihalo harmonični oscilator pri poljubnem odklonu, in izpelji njegov nihajni čas pri majhnih odklonih.

**Rešitev:**

1. Nihanje je harmonično, če na telo deluje sila $F = -kx$ s $k > 0$, sorazmerna z odmikom od ravnovesne lege in usmerjena proti njej; potem velja $\ddot{x} + \omega_0^2x = 0$ z $\omega_0 = \sqrt{k/m}$.
2. Energija $W = \tfrac{1}{2}m\dot{x}^2 + \tfrac{1}{2}kx^2$ ima odvod $\dot{W} = \dot{x}(m\ddot{x} + kx) = 0$, zato je stalna. V skrajni legi je $\dot{x} = 0$, torej $W = \tfrac{1}{2}kx_0^2$.
3. Iz $\tfrac{1}{2}mv^2 = \tfrac{1}{2}k(x_0^2 - x^2)$ sledi $v = \pm\omega_0\sqrt{x_0^2 - x^2}$.
4. Pri matematičnem nihalu je tangentna komponenta teže $-mg\sin\varphi$, lok $s = l\varphi$, zato $ml\ddot{\varphi} = -mg\sin\varphi$. Vračajoča sila je sorazmerna s $\sin\varphi$, ne z lokom $s$, zato nihanje pri poljubnem odklonu **ni** harmonično; posledica je, da nihajni čas z amplitudo narašča.
5. Pri majhnih odklonih je $\sin\varphi \approx \varphi$ (kot v radianih; pri $10^\circ$ je napaka okoli $0{,}5\,\%$). Enačba preide v $\ddot{\varphi} + (g/l)\varphi = 0$, ki ima obliko iz točke 1.
6. Odgovor: pri majhnih odklonih je $\omega_0 = \sqrt{g/l}$ in $t_0 = 2\pi\sqrt{l/g}$, neodvisno od mase in amplitude; pri velikih odklonih nihalo niha periodično, a ne harmonično.

## Drugače: Na sliki

Harmonično nihanje je **senca enakomernega kroženja**. Predstavljaj si kroglico, ki enakomerno kroži s kotno hitrostjo $\omega_0$ po krožnici s polmerom $x_0$, in njeno senco na steni:

```
     krog                 senca na osi x
      .--.
    /  o   \    ---->   |-----o----|----------|
   |   +    |           -x0        0         x0
    \      /
      '--'
```

Ko kroglica obkroži krožnico enkrat, senca naredi en cel nihaj. Projekcija lege je $x_0\cos\omega_0 t$, projekcija hitrosti $-\omega_0x_0\sin\omega_0 t$, projekcija radialnega pospeška $-\omega_0^2x$. Iz te slike je jasno, zakaj je senca najhitrejša na sredini in se v skrajnih legah ustavi.

Graf dušenega nihanja je kosinusna krivulja, ki jo od zgoraj in spodaj omejujeta eksponentni ovojnici $\pm x_0e^{-\beta t}$. Pri kritičnem dušenju krivulja (če telo spustimo iz mirovanja) le enkrat pade proti ničli, ne da bi jo prečkala.

## Drugače: Uporaba v stroki

**Infrardeča spektroskopija.** Vez med atomoma se pri majhnih odmikih obnaša kot vzmet. Za $\mathrm{HCl}$ je koeficient vezi okoli $516\,\mathrm{N/m}$, reducirana masa $\mu = m_\mathrm{H}m_\mathrm{Cl}/(m_\mathrm{H} + m_\mathrm{Cl}) \approx 1{,}63 \cdot 10^{-27}\,\mathrm{kg}$, frekvenca $\nu = \frac{1}{2\pi}\sqrt{k/\mu} \approx 9{,}0 \cdot 10^{13}\,\mathrm{Hz}$ (infrardeče). Pri zamenjavi $\mathrm{H}$ z devterijem se $k$ ne spremeni, $\mu$ pa se skoraj podvoji, zato se trak premakne na okoli $1/\sqrt{2}$ prvotne frekvence; z izotopsko zamenjavo spektroskopisti ugotovijo, kateri trak pripada kateri vezi.

**Mikroskop na atomsko silo (AFM).** Merilna ročica je vzmet s $k$ med približno $0{,}1$ in $40\,\mathrm{N/m}$. Njen $k$ umerijo iz toplotnega šuma: po ekviparticijskem izreku je povprečna prožnostna energija $\tfrac{1}{2}k\langle x^2\rangle = \tfrac{1}{2}k_BT$ ($k_B$ je Boltzmannova konstanta, $T$ temperatura). V dinamičnem načinu ročico vzbujajo blizu resonance; sila konice premakne resonančno frekvenco, iz premika pa dobijo sliko površine.

**Kvarčna mikrotehtnica in senzorji.** Kristal kvarca niha z ostro resonanco (nekaj $\mathrm{MHz}$). Ko se nanj adsorbira tanka plast, se frekvenca zniža; tako merijo nanograme snovi v tankih plasteh in biosenzorjih.

**Izolacija tresljajev.** Analitske tehtnice, mikroskopi in laserske mize stojijo na podlagah z nizko lastno frekvenco (okoli $1\,\mathrm{Hz}$) z zmernim dušenjem, ki omeji nihanje pri resonanci: tresljaji stavbe s frekvencami precej nad lastno frekvenco podlage se prenesejo močno oslabljeni. Stroje in centrifuge pa vodijo hitro skozi njihovo resonančno frekvenco.

## Drugače: Korak za korakom s številkami

Utež z maso $0{,}20\,\mathrm{kg}$ visi na vzmeti s $k = 20\,\mathrm{N/m}$. Ob $t = 0$ je $3{,}0\,\mathrm{cm}$ od ravnovesne lege in se giblje s hitrostjo $0{,}40\,\mathrm{m/s}$ stran od nje (v smeri odmika, torej $v(0) > 0$). Kolikšna je amplituda?

1. **Krožna frekvenca:** $\omega_0 = \sqrt{20/0{,}20}\,\mathrm{s^{-1}} = 10\,\mathrm{s^{-1}}$.
2. **Energija ob $t = 0$:** $W = \tfrac{1}{2} \cdot 20 \cdot 0{,}030^2 + \tfrac{1}{2} \cdot 0{,}20 \cdot 0{,}40^2 = 0{,}0090 + 0{,}016 = 0{,}025\,\mathrm{J}$.
3. **Amplituda iz energije:** $\tfrac{1}{2}kx_0^2 = 0{,}025\,\mathrm{J}$, torej $x_0 = \sqrt{2 \cdot 0{,}025/20}\,\mathrm{m} = 0{,}050\,\mathrm{m}$.
4. **Preizkus s formulo:** $x_0 = \sqrt{x(0)^2 + (v(0)/\omega_0)^2} = \sqrt{0{,}030^2 + 0{,}040^2}\,\mathrm{m} = 0{,}050\,\mathrm{m}$. ✓
5. **Največja hitrost:** $v_{\max} = \omega_0x_0 = 10 \cdot 0{,}050\,\mathrm{m/s} = 0{,}50\,\mathrm{m/s}$.
6. **Fazni zamik** (za $x = x_0\cos(\omega_0t + \delta)$): $\cos\delta = 0{,}030/0{,}050 = 0{,}60$ in $\sin\delta = -v(0)/(\omega_0x_0) = -0{,}80$, torej $\delta \approx -0{,}93\,\mathrm{rad}$.

## Drugače: Bolj natančno

**Rešitev enačbe nihanja.** Enačba $\ddot{x} + \omega_0^2x = 0$ je linearna s konstantnimi koeficienti. Nastavek $x = e^{\lambda t}$ da karakteristično enačbo $\lambda^2 + \omega_0^2 = 0$ z rešitvama $\lambda = \pm i\omega_0$. Realna splošna rešitev je $x = A\cos\omega_0t + B\sin\omega_0t = x_0\cos(\omega_0t + \delta)$ z $x_0 = \sqrt{A^2 + B^2}$. Konstanti določita začetna pogoja $x(0) = A$ in $\dot{x}(0) = B\omega_0$; po izreku o enoličnosti je rešitev s temi pogoji ena sama.

**Dušeno nihanje.** Za $\ddot{x} + 2\beta\dot{x} + \omega_0^2x = 0$ je karakteristična enačba $\lambda^2 + 2\beta\lambda + \omega_0^2 = 0$, torej $\lambda = -\beta \pm \sqrt{\beta^2 - \omega_0^2}$. Pri $\beta < \omega_0$ sta korena kompleksna, $\lambda = -\beta \pm i\omega$, in rešitev je $x_0e^{-\beta t}\cos(\omega t + \delta)$. Pri $\beta = \omega_0$ je dvojni koren in $x = (A + Bt)e^{-\beta t}$. Pri $\beta > \omega_0$ sta oba korena realna in negativna, zato je rešitev vsota dveh pojemajočih eksponentnih funkcij brez nihanja. Moč sile upora je $P = F_uv = -bv^2$, zato je $\mathrm{d}W/\mathrm{d}t = -bv^2 \le 0$.

**Matematično nihalo pri velikih odklonih.** Iz ohranitve energije $\tfrac{1}{2}ml^2\dot{\varphi}^2 = mgl(\cos\varphi - \cos\varphi_0)$ dobimo natančen nihajni čas kot eliptični integral. Razvoj da

$$t_0 = 2\pi\sqrt{\frac{l}{g}}\left(1 + \frac{\varphi_0^2}{16} + \dots\right).$$

Pri $\varphi_0 = 20^\circ$ ($0{,}35\,\mathrm{rad}$) je popravek manj kot $1\,\%$.

**Fizično nihalo.** Togo telo, ki niha okoli vodoravne osi na razdalji $d$ od masnega središča, ima enačbo $J\ddot{\varphi} = -mgd\sin\varphi$ in pri majhnih odklonih $t_0 = 2\pi\sqrt{J/(mgd)}$. Za točkasto maso je $J = ml^2$ in $d = l$, kar da formulo za matematično nihalo.

**Zakaj je harmonično nihanje tako splošno.** Potencialno energijo okoli minimuma pri $x = 0$ razvijemo v Taylorjevo vrsto: $W_p(x) \approx W_p(0) + \tfrac{1}{2}W_p''(0)x^2$, ker je $W_p'(0) = 0$. Sila $F = -W_p'(x) \approx -W_p''(0)x$ je v prvem približku harmonična s $k = W_p''(0)$.

## Preveri se

? Maso uteži na vzmeti povečamo na štirikratno vrednost. Kako se spremeni nihajni čas?
- Poveča se štirikrat.
~ Nihajni čas ni sorazmeren z maso, ampak s korenom mase: pod korenom v $t_0 = 2\pi\sqrt{m/k}$.
+ Poveča se dvakrat.
- Ostane enak.
~ Neodvisnost od mase velja za matematično nihalo; pri vzmeti ista sila $kx$ pospešuje večjo maso, zato niha počasneje.
> $t_0 = 2\pi\sqrt{m/k}$, zato je nihajni čas sorazmeren s $\sqrt{m}$; $\sqrt{4} = 2$.

? Lega nihala je $x = 0{,}10\,\mathrm{m}\cdot\cos(4{,}0\,\mathrm{s^{-1}}\cdot t)$. Kolikšna je največja hitrost?
- $0{,}10\,\mathrm{m/s}$
~ To je amplituda $x_0$ z napačno enoto; pomnožiti jo moraš še s krožno frekvenco $\omega_0$.
- $1{,}6\,\mathrm{m/s}$
~ To je $\omega_0^2x_0$, torej največji pospešek v $\mathrm{m/s^2}$, ne hitrost.
+ $0{,}40\,\mathrm{m/s}$
> $v_{\max} = \omega_0x_0 = 4{,}0\,\mathrm{s^{-1}} \cdot 0{,}10\,\mathrm{m} = 0{,}40\,\mathrm{m/s}$. $1{,}6$ je največji pospešek v $\mathrm{m/s^2}$.

? Kolikšen je nihajni čas matematičnega nihala z dolžino $1{,}0\,\mathrm{m}$ ($g = 9{,}81\,\mathrm{m/s^2}$)?
+ $2{,}0\,\mathrm{s}$
- $0{,}32\,\mathrm{s}$
~ To je le $\sqrt{l/g}$; pozabljen je faktor $2\pi$.
- $1{,}0\,\mathrm{s}$
~ To je čas polnihaja (od ene skrajne lege do druge); nihajni čas je čas celega nihaja tja in nazaj.
> $t_0 = 2\pi\sqrt{1{,}0/9{,}81}\,\mathrm{s} \approx 2{,}0\,\mathrm{s}$. $0{,}32\,\mathrm{s}$ je $\sqrt{l/g}$ brez faktorja $2\pi$.

? Amplituda šibko dušenega nihala se razpolovi. Kolikšen del začetne energije mu ostane?
- Polovica.
~ Energija ni sorazmerna z amplitudo, ampak z njenim kvadratom, $W = \tfrac{1}{2}kx_0^2$.
+ Četrtina.
- Osmina.
~ Osmina bi bila $(1/2)^3$; energija je odvisna od kvadrata amplitude, ne od kuba.
> Energija je sorazmerna s kvadratom amplitude: $(1/2)^2 = 1/4$.

? Glasbene vilice za ton A nihajo s $440\,\mathrm{Hz}$. Katero količino podaja ta podatek?
- Nihajni čas.
~ Nihajni čas je čas enega nihaja, tu $1/440\,\mathrm{s} \approx 2{,}3\,\mathrm{ms}$; meri se v sekundah, ne v hercih.
+ Frekvenca.
- Krožna frekvenca.
~ Krožna frekvenca je $2\pi$-krat večja, $\omega = 2\pi\nu \approx 2760\,\mathrm{s^{-1}}$.
> Frekvenca $\nu = 1/t_0$ je število nihajev v sekundi, enota $\mathrm{Hz} = \mathrm{s^{-1}}$.

:::simboli
F | sila vzmeti (vračajoča sila) | F = -kx | N
k | koeficient vzmeti | | N/m
x | odmik od ravnovesne lege | x(t) = x_0\cos(\omega_0 t + \delta) | m
x_0 | amplituda | | m | največji odmik
\omega_0 | lastna krožna frekvenca | \omega_0 = \sqrt{\frac{k}{m}} | s^{-1} | pri matematičnem nihalu ω₀ = √(g/l)
\omega | krožna frekvenca dušenega nihanja | \omega = \sqrt{\omega_0^2 - \beta^2} | s^{-1}
m | masa uteži | | kg
t | čas | | s
\delta | fazni zamik | | rad | določen z začetno lego in hitrostjo
\dot{x} | hitrost (odvod odmika po času) | \dot{x} = \frac{\mathrm{d}x}{\mathrm{d}t} | m/s
v | hitrost uteži | v = \dot{x} = -\omega_0 x_0\sin(\omega_0 t + \delta) | m/s
v_{\max} | največja hitrost | v_{\max} = \omega_0 x_0 | m/s | v ravnovesni legi
a | pospešek uteži | a = \ddot{x} = -\omega_0^2 x | m/s^2
a_{\max} | največji pospešek | a_{\max} = \omega_0^2 x_0 | m/s^2 | v skrajnih legah
t_0 | nihajni čas | t_0 = \frac{2\pi}{\omega_0} | s | v mnogih učbenikih T
\nu | frekvenca | \nu = \frac{1}{t_0} | Hz
\nu_0 | lastna frekvenca | \nu_0 = \frac{\omega_0}{2\pi} | Hz
l | dolžina vrvice nihala | | m
\varphi | odklon nihala od navpičnice | | rad
\varphi_0 | amplituda odklona (največji odklon) | | rad
g | težni pospešek | | m/s^2 | 9,81 m/s²
W | energija nihanja | W = \tfrac{1}{2}kx_0^2 = \tfrac{1}{2}mv_{\max}^2 | J
b | koeficient upora | | kg/s | sila upora F_u = -bv
\beta | koeficient dušenja | \beta = \frac{b}{2m} | s^{-1}
e | osnova naravnega logaritma | | – | e ≈ 2,718
:::
