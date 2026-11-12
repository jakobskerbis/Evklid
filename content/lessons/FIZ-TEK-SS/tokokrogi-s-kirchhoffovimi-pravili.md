---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Kitarist ima efektni pedal na 9-voltno baterijo. Multimeter na sami bateriji pokaže skoraj $9\,\mathrm{V}$, a ko pedal vklopi, zvok začne prasketati. Drug prizor: v avtu zaženeš motor in avtoradio za trenutek utihne, čeprav je akumulator poln.

Baterija in akumulator nista pokvarjena. V obeh primerih je krivec isti: **vsak vir ima notranji upor.** Ko vir daje tok, del napetosti ostane v njem samem in na sponkah je je manj. Zaganjalnik potegne zelo velik tok, zato napetost pade tako globoko, da radio ugasne. Pri stari bateriji je notranji upor tako velik, da padec opazi že pedal.

Da razumeš take kroge, pa tudi vezja z več viri in razvejanimi žicami, potrebuješ dve pravili, ki ju je zapisal Gustav Kirchhoff. Prvo izhaja iz ohranitve naboja, drugo iz ohranitve energije. Z njima rešiš vsako vezje z enosmernim tokom, naj bo še tako zapleteno, in ugotoviš tudi, zakaj izrabljena baterija, vezana poleg nove, ojačevalniku škodi.

## Razlaga

**Stara baterija v pedalu.** Baterijo opišemo kot idealni vir (vir brez lastnega upora) z **gonilno napetostjo** $U_g = 9{,}0\,\mathrm{V}$, ki ima zaporedno vezan **notranji upor** $R_i$. Gonilna napetost je napetost na sponkah, ko vir ne daje toka. Pedal obravnavamo kot upornik $R = 300\,\Omega$, stara baterija ima $R_i = 60\,\Omega$.

Krog je en sam, zato skozi oba upora teče isti tok. Skupni upor je $360\,\Omega$:

$$I = \frac{9{,}0}{300 + 60}\,\mathrm{A} = 0{,}025\,\mathrm{A}$$

Napetost na pedalu, ki je hkrati napetost na sponkah baterije:

$$U = 0{,}025 \cdot 300\,\mathrm{V} = 7{,}5\,\mathrm{V}$$

Manjkajoči $1{,}5\,\mathrm{V}$ sta ostala na notranjem uporu. Brez obremenitve ni toka in ni padca, zato voltmeter na neobremenjeni bateriji kaže polnih $9{,}0\,\mathrm{V}$. Stare baterije tako ne prepoznaš.

| baterija | $R_i$ | $I$ | $U$ |
|---|---|---|---|
| brez toka | – | $0$ | $9{,}0\,\mathrm{V}$ |
| nova | $2\,\Omega$ | $29{,}8\,\mathrm{mA}$ | $8{,}94\,\mathrm{V}$ |
| stara | $60\,\Omega$ | $25{,}0\,\mathrm{mA}$ | $7{,}50\,\mathrm{V}$ |

V tabeli je $U$ napetost na sponkah. Splošno je napetost na sponkah vira

$$U = U_g - I R_i$$

:::premisli
Kaj se zgodi, če sponki nove baterije ($R_i = 2\,\Omega$) skleneš kar z žico? Kolikšen tok steče in kje se sprosti energija?
---
Steče tok $I = \frac{U_g}{R_i} = \frac{9{,}0\,\mathrm{V}}{2\,\Omega} = 4{,}5\,\mathrm{A}$, napetost na sponkah pade na nič. Vsa moč, okoli $40\,\mathrm{W}$, se sprosti v bateriji, ki se hitro segreje. Zato kratkega stika ne delaj.
:::

**Zančno pravilo.** Obhodi zgornji krog in spremljaj potencial. Začni na negativnem polu ($0\,\mathrm{V}$). Skozi idealni vir se potencial dvigne za $9{,}0\,\mathrm{V}$, na notranjem uporu pade za $1{,}5\,\mathrm{V}$, na pedalu za $7{,}5\,\mathrm{V}$. Ko se vrneš na začetek, si spet na $0\,\mathrm{V}$. Iz elektrostatike veš, da ima vsaka točka en sam potencial, zato to velja za vsako sklenjeno pot. **Vsota sprememb potenciala po vsaki sklenjeni zanki je nič.** To je ohranitev energije: naboj, ki obkroži zanko, ima na koncu enako energijo kot na začetku.

Predznake določi smer obhoda, ki jo izbereš sam:

| element | obhod | sprememba |
|---|---|---|
| upornik | s tokom | $-IR$ |
| upornik | proti toku | $+IR$ |
| vir | od $-$ do $+$ | $+U_g$ |
| vir | od $+$ do $-$ | $-U_g$ |

**Pravilo vozlišča.** Vozlišče je točka, kjer se stikajo vsaj tri žice. Del vezja med dvema sosednjima vozliščema je **veja**; skozi vse elemente ene veje teče isti tok. Naboj se v vozlišču ne kopiči in ne izginja, zato je vsota tokov, ki pritečejo v vozlišče, enaka vsoti tokov, ki iz njega odtečejo. To je ohranitev naboja.

**Postopek za vsako vezje.**

1. V vsaki veji izberi smer toka (poljubno) in tok označi.
2. Zapiši pravilo vozlišča za vsa vozlišča razen enega (zadnje ne da nič novega).
3. Zapiši zančno pravilo za toliko zank, da imaš toliko enačb kot neznanih tokov. Vsaka nova zanka naj zajame vsaj eno novo vejo.
4. Reši sistem. Negativen tok ni napaka: teče le v nasprotno smer, kot si jo izbral.

V simulaciji spodaj »Kirchhoffova pravila« (gonilni napetosti sta označeni z $E_1$ in $E_2$) nastavi $E_1 = 9\,\mathrm{V}$, $R_1 = 1\,\Omega$, $E_2 = 6\,\mathrm{V}$, $R_2 = 2\,\Omega$, $R_3 = 6\,\Omega$. To je Primer 2. Opazuj puščico toka $I_2$, nato $E_2$ počasi povečuj. Med $7\,\mathrm{V}$ in $8\,\mathrm{V}$ tok skozi drugo baterijo zamenja smer.

**Moč.** Na uporniku se sprošča moč $P = UI = I^2 R$. Vir odda moč $U_g I$, od tega ostane $I^2 R_i$ v njem kot toplota. Če je na vir priključen en sam porabnik, skozi oba upora teče tok $I = \frac{U_g}{R + R_i}$, zato je moč na porabniku $I^2 R$:

$$P = \frac{U_g^2 R}{(R + R_i)^2}$$

:::premisli
Na isti vir priključuješ zvočnike z različnimi upori. Pri kakšnem uporu je moč na zvočniku največja: pri zelo majhnem, zelo velikem ali nekje vmes? Zakaj?
---
Nekje vmes, natanko pri $R = R_i$. Pri zelo majhnem uporu teče velik tok, napetost na zvočniku pa je skoraj nič. Pri zelo velikem je napetost skoraj $U_g$, tok pa skoraj nič. Moč je zmnožek obeh, zato je največja vmes: $P_{max} = \frac{U_g^2}{4R_i}$. Takrat gre v zvočnik le polovica moči vira.
:::

## Rešeni primeri

### Primer 1: notranji upor baterije v pedalu

Neobremenjena baterija pedala kaže $9{,}0\,\mathrm{V}$. Ko pedal deluje, voltmeter na sponkah kaže $8{,}4\,\mathrm{V}$, ampermeter pa $30\,\mathrm{mA}$. Kolikšen je notranji upor baterije in kolikšen upor pedala?

**Podatki:** $U_g = 9{,}0\,\mathrm{V}$, $U = 8{,}4\,\mathrm{V}$, $I = 30\,\mathrm{mA} = 0{,}030\,\mathrm{A}$
**Iščemo:** notranji upor $R_i$, upor pedala $R$

:::formula
$U = U_g - I R_i$, $R = \dfrac{U}{I}$
:::

**Rešitev:**

1. Neobremenjena baterija ne daje toka, zato kaže gonilno napetost.
2. Padec na notranjem uporu je razlika napetosti: $R_i = \dfrac{9{,}0 - 8{,}4}{0{,}030}\,\Omega = 20\,\Omega$.
3. Na pedalu je napetost na sponkah: $R = \dfrac{8{,}4}{0{,}030}\,\Omega = 280\,\Omega$.
4. Odgovor: notranji upor baterije je $20\,\Omega$, upor pedala $280\,\Omega$.

### Primer 2: dve bateriji za ulični ojačevalnik

Ulični glasbenik na ojačevalnik (obravnavaj ga kot upornik $6\,\Omega$) vzporedno priključi dve bateriji: novo z $U_{g1} = 9\,\mathrm{V}$ in $R_1 = 1\,\Omega$ ter izrabljeno z $U_{g2} = 6\,\mathrm{V}$ in $R_2 = 2\,\Omega$. Kolikšni so tokovi skozi bateriji in ojačevalnik?

:::risba skica
opis: Vezje s tremi vzporednimi vejami med zgornjo in spodnjo žico. Leva veja: baterija 9 V s pozitivnim polom zgoraj in nad njo notranji upor 1 Ω, tok I₁ teče navzgor. Srednja veja: ojačevalnik kot upornik 6 Ω, tok I teče navzdol. Desna veja: baterija 6 V s pozitivnim polom zgoraj in nad njo notranji upor 2 Ω, tok I₂ teče navzgor.
območje: -2; 0 .. 14; 6
enota: 19
črta: 1; 5,5 -> 11; 5,5
črta: 1; 0,5 -> 11; 0,5
črta: 1; 0,5 -> 1; 1,8
črta: 0,6; 1,8 -> 1,4; 1,8 | debelo
črta: 0,3; 2,2 -> 1,7; 2,2
črta: 1; 2,2 -> 1; 3,2
pravokotnik: 0,6; 3,2 .. 1,4; 4,6
črta: 1; 4,6 -> 1; 5,5
črta: 6; 0,5 -> 6; 2,3
pravokotnik: 5,6; 2,3 .. 6,4; 3,7
črta: 6; 3,7 -> 6; 5,5
črta: 11; 0,5 -> 11; 1,8
črta: 10,6; 1,8 -> 11,4; 1,8 | debelo
črta: 10,3; 2,2 -> 11,7; 2,2
črta: 11; 2,2 -> 11; 3,2
pravokotnik: 10,6; 3,2 .. 11,4; 4,6
črta: 11; 4,6 -> 11; 5,5
napis: 0,1; 2 | 9 V | levo
napis: 0,3; 3,9 | 1 Ω | levo
napis: 5,4; 3 | 6 Ω | levo
napis: 11,9; 2 | 6 V | desno
napis: 11,7; 3,9 | 2 Ω | desno
napis: 1,9; 2,4 | + | desno
napis: 10,1; 2,4 | + | levo
puščica: 2,2; 3,2 -> 2,2; 4,8 | I_1 | desno | rdeča
puščica: 6,9; 4,6 -> 6,9; 3 | I | desno | rdeča
puščica: 9,8; 3,2 -> 9,8; 4,8 | I_2 | levo | rdeča
:::

**Podatki:** $U_{g1} = 9\,\mathrm{V}$, $R_1 = 1\,\Omega$, $U_{g2} = 6\,\mathrm{V}$, $R_2 = 2\,\Omega$, $R = 6\,\Omega$
**Iščemo:** tokove $I_1$, $I_2$, $I$

:::formula
vozlišče: $I_1 + I_2 = I$; zanka z levo baterijo: $U_{g1} - I_1 R_1 - I R = 0$; zanka z desno baterijo: $U_{g2} - I_2 R_2 - I R = 0$
:::

**Rešitev:**

1. Smeri tokov izberemo kot na sliki: iz obeh baterij navzgor, skozi ojačevalnik navzdol. Pravilo zgornjega vozlišča: $I_1 + I_2 = I$.
2. Leva zanka (baterija 1 in ojačevalnik), obhod od spodaj navzgor skozi baterijo: $9 - 1 \cdot I_1 - 6 I = 0$, torej $I_1 = 9 - 6I$ (v amperih).
3. Desna zanka (baterija 2 in ojačevalnik): $6 - 2 I_2 - 6 I = 0$, torej $I_2 = 3 - 3I$.
4. Vstavimo v pravilo vozlišča: $9 - 6I + 3 - 3I = I$, torej $12 = 10 I$ in $I = 1{,}2\,\mathrm{A}$.
5. Nazaj: $I_1 = 9 - 6 \cdot 1{,}2 = 1{,}8\,\mathrm{A}$ in $I_2 = 3 - 3 \cdot 1{,}2 = -0{,}6\,\mathrm{A}$.
6. Negativni $I_2$ pomeni, da tok skozi izrabljeno baterijo teče navzdol: nova baterija jo polni. Napetost na ojačevalniku je $6 \cdot 1{,}2 = 7{,}2\,\mathrm{V}$, kar je več od gonilne napetosti izrabljene baterije ($6\,\mathrm{V}$), zato tok teče vanjo.
7. Preizkus z energijo: prva baterija odda $9 \cdot 1{,}8 = 16{,}2\,\mathrm{W}$. Porazdeli se kot $1{,}8^2 \cdot 1 + 1{,}2^2 \cdot 6 + 0{,}6^2 \cdot 2 + 6 \cdot 0{,}6 = 16{,}2\,\mathrm{W}$ (oba notranja upora, ojačevalnik in polnjenje druge baterije).
8. Odgovor: skozi novo baterijo teče $1{,}8\,\mathrm{A}$, skozi ojačevalnik $1{,}2\,\mathrm{A}$, skozi izrabljeno baterijo $0{,}6\,\mathrm{A}$ v obratni smeri. Izrabljena baterija ojačevalniku ne pomaga, temveč jemlje energijo.

### Primer 3: kateri zvočnik bo najglasnejši

Ojačevalnik za vajo v poenostavljenem modelu za enosmerni tok deluje kot vir z $U_g = 12\,\mathrm{V}$ in $R_i = 4\,\Omega$. Na voljo so zvočniki z upori $2\,\Omega$, $4\,\Omega$ in $8\,\Omega$. Na katerem je moč največja? Kitarist ima še star zvočnik s $16\,\Omega$. S kakšnim drugim uporom bi dobil enako moč kot s tem?

**Podatki:** $U_g = 12\,\mathrm{V}$, $R_i = 4\,\Omega$, upori zvočnikov $2\,\Omega$, $4\,\Omega$, $8\,\Omega$ in $16\,\Omega$
**Iščemo:** moč $P$ na vsakem zvočniku; upor, ki da enako moč kot $16\,\Omega$

:::formula
$P = \dfrac{U_g^2 R}{(R + R_i)^2}$
:::

**Rešitev:**

1. Zvočnik $2\,\Omega$: $P = \dfrac{12^2 \cdot 2}{(2 + 4)^2}\,\mathrm{W} = 8\,\mathrm{W}$.
2. Zvočnik $4\,\Omega$: $P = \dfrac{12^2 \cdot 4}{(4 + 4)^2}\,\mathrm{W} = 9\,\mathrm{W}$. To je največ, ker je $R = R_i$.
3. Zvočnik $8\,\Omega$: $P = \dfrac{12^2 \cdot 8}{(8 + 4)^2}\,\mathrm{W} = 8\,\mathrm{W}$. Enako kot pri $2\,\Omega$, a z boljšim izkoristkom: v zvočnik gre $\frac{8}{12}$ moči vira namesto $\frac{2}{6}$.
4. Opazi: $2 \cdot 8 = 16 = R_i^2$. Upora z enako močjo imata zmnožek $R_i^2$.
5. Zdaj ti: izračunaj moč na zvočniku $16\,\Omega$, poišči drugi upor po pravilu iz koraka 4 in ga preveri.

:::premisli
Kolikšna je moč na zvočniku $16\,\Omega$ in kateri drugi upor da enako moč?
---
$P = \frac{12^2 \cdot 16}{(16 + 4)^2}\,\mathrm{W} = 5{,}76\,\mathrm{W}$. Drugi upor je $\frac{R_i^2}{16\,\Omega} = \frac{16}{16}\,\Omega = 1\,\Omega$. Preizkus: $\frac{12^2 \cdot 1}{(1 + 4)^2}\,\mathrm{W} = 5{,}76\,\mathrm{W}$.
:::

## Pogoste napake

- **»Vir ima vedno napetost, ki piše na njem.«** Na sponkah je $U_g$ le, ko vir ne daje toka. Pri toku $I$ je napetost $U_g - IR_i$. Kdor to pozabi, dobi pri večjem toku preveliko napetost in pri merjenju ne razloči stare baterije od nove.
- **Napetosti virov se vedno seštejejo.** V zanki je predznak odvisen od smeri obhoda: vir, ki ga prehodiš od $+$ do $-$, prispeva $-U_g$. Vira, ki sta obrnjena drug proti drugemu, se odštejeta.
- **Negativen tok pomeni napačen račun.** Ne: smer toka si izbral sam. Minus pove le, da tok teče obratno. Rezultata ne popravljaj, samo ga pravilno razloži.
- **Najmanjši upor porabnika da največjo moč.** Tok je res največji, napetost na porabniku pa skoraj nič. Moč je največja pri $R = R_i$, izkoristek takrat le $50\,\%$.
- **Preveč enačb vozlišč.** Pri $n$ vozliščih so neodvisne le $n - 1$ enačbe. Manjkajoče enačbe dobiš iz zank.

## Povzetek

- Realni vir: gonilna napetost $U_g$ in notranji upor $R_i$; napetost na sponkah $U = U_g - IR_i$. Kratkostični tok je $\frac{U_g}{R_i}$.
- Pravilo vozlišča (ohranitev naboja): vsota tokov v vozlišče je enaka vsoti tokov iz njega.
- Zančno pravilo (ohranitev energije): vsota sprememb potenciala po sklenjeni zanki je nič. Upornik v smeri toka $-IR$, vir od $-$ do $+$ $+U_g$.
- Postopek: označi tokove, $n - 1$ enačb vozlišč, preostale iz zank, reši sistem. Negativen tok teče v obratno smer.
- Moč: $P = UI = I^2 R$; na porabniku $P = \frac{U_g^2 R}{(R + R_i)^2}$, največja pri $R = R_i$, $P_{max} = \frac{U_g^2}{4R_i}$, izkoristek takrat $50\,\%$.
- Upora z zmnožkom $R_i^2$ dobita enako moč.

## Drugače: Z analogijo

Predstavljaj si gorsko pohodniško pot z razcepi. Potencial je nadmorska višina, tok je število pohodnikov na minuto.

- **Vir** je vzpenjača: pohodnike dvigne za $U_g$ metrov višine. Notranji upor je gneča na vzpenjači, ki pri velikem navalu »odžre« del vzpona.
- **Upornik** je strm spust: pohodniki izgubijo višino.
- **Zanka:** kdor obhodi krožno pot in se vrne na izhodišče, se je spustil natanko toliko, kot se je povzpel.
- **Vozlišče:** na razcepu poti nihče ne izgine in nihče se ne pojavi. Koliko pohodnikov pride, toliko jih odide.

Negativen tok pomeni, da pohodniki hodijo v drugo smer, kot si narisal puščico. V Primeru 2 šibkejša »vzpenjača« pohodnikov ne dviguje: močnejša jih požene po njej navzdol, v obratni smeri.

## Drugače: Bolj natančno

- **Število enačb.** Vezje z $n$ vozlišči in $m$ vejami ima $m$ neznanih tokov. Neodvisnih enačb vozlišč je $n - 1$, neodvisnih zank $m - n + 1$. Skupaj je enačb natanko $m$.
- **Napetost vozlišča.** Pri vezjih z dvema vozliščema je hitreje iskati napetost $U$ med njima. V Primeru 2 iz enačbe $\frac{9 - U}{1} + \frac{6 - U}{2} = \frac{U}{6}$ dobiš $U = 7{,}2\,\mathrm{V}$, tokove pa nato vsakega posebej.
- **Zakaj enaka moč pri $R \cdot R' = R_i^2$.** Če postaviš $R = \frac{R_i^2}{R'}$ v izraz za moč in ulomek razširiš z $R'^2$, dobiš enak izraz kot za $R'$. Največja moč je tam, kjer se par zlije v en sam upor: $R = R_i$.
- **Zamenjava z enim virom.** Vsako vezje iz virov in uporov se med dvema sponkama obnaša kot en vir z neko gonilno napetostjo in notranjim uporom. Gonilna napetost je napetost odprtih sponk, notranji upor je njen količnik s kratkostičnim tokom. To pogosto skrajša tekmovalne naloge.

## Preveri se

? Na bateriji za brezžični mikrofon piše $1{,}5\,\mathrm{V}$. Kdaj je na njenih sponkah res tolikšna napetost?
- Pri vsakem toku.
~ Pri toku je na sponkah manj, $U = U_g - IR_i$, ker del napetosti ostane na notranjem uporu.
+ Samo takrat, ko baterija ne daje toka.
- Takrat, ko porabniku oddaja največjo moč.
~ Največja moč je pri $R = R_i$. Takrat je na sponkah le polovica gonilne napetosti, druga polovica ostane na notranjem uporu.
> Napis pove gonilno napetost $U_g$. Na sponkah obremenjene baterije je napetost manjša.

? Na baterijo je priključen en porabnik. Vzporedno z njim priključimo še enega. Kaj se zgodi z napetostjo na sponkah baterije?
- Ostane enaka, ker imajo vzporedno vezani porabniki isto napetost.
~ Isto napetost imata porabnika med seboj, a ta je odvisna od skupnega toka iz baterije. Pozabil si na notranji upor.
+ Se zmanjša.
- Se poveča, ker je skupni upor manjši.
~ Manjši skupni upor pomeni večji tok, ta pa večji padec $IR_i$ v bateriji, torej manjšo napetost na sponkah.
> Skupni upor se zmanjša, tok iz baterije se poveča, zato $U = U_g - IR_i$ pade.

? Na vir z $U_g = 12\,\mathrm{V}$ in $R_i = 3\,\Omega$ priključujemo po en zvočnik naenkrat. Razvrsti zvočnike od največje do najmanjše moči na zvočniku.
1. $4\,\Omega$
2. $2\,\Omega$
3. $8\,\Omega$
4. $1\,\Omega$
> $P = \frac{U_g^2 R}{(R + R_i)^2}$ da $11{,}76\,\mathrm{W}$ ($4\,\Omega$), $11{,}52\,\mathrm{W}$ ($2\,\Omega$), $9{,}52\,\mathrm{W}$ ($8\,\Omega$) in $9\,\mathrm{W}$ ($1\,\Omega$). Moč je največja blizu $R = R_i = 3\,\Omega$; najmanjši upor ne da največ.

? Z vezja na sliki odčitaj podatke. Notranji upor leve baterije je $1\,\Omega$, desne $0{,}5\,\Omega$. Kolikšen tok teče v zanki?
:::risba skica
opis: Sklenjena zanka. Na levi navpični stranici je baterija 12 V, na desni baterija 3 V, na zgornji stranici upornik 3 Ω. Obe bateriji imata pozitivni pol (daljša črtica) zgoraj, zato v zanki delujeta ena proti drugi.
območje: -2; 0 .. 14; 7
enota: 19
črta: 2; 1 -> 10; 1
črta: 2; 1 -> 2; 3,3
črta: 1,6; 3,3 -> 2,4; 3,3 | debelo
črta: 1,2; 3,7 -> 2,8; 3,7
črta: 2; 3,7 -> 2; 6
črta: 2; 6 -> 5; 6
pravokotnik: 5; 5,6 .. 7; 6,4
črta: 7; 6 -> 10; 6
črta: 10; 1 -> 10; 3,3
črta: 9,6; 3,3 -> 10,4; 3,3 | debelo
črta: 9,2; 3,7 -> 10,8; 3,7
črta: 10; 3,7 -> 10; 6
napis: 1; 3,5 | 12 V | levo
napis: 11; 3,5 | 3 V | desno
napis: 6; 6,5 | 3 Ω | nad
napis: 2,9; 4 | + | desno
napis: 9,1; 4 | + | levo
:::
= 2 A | 0,01
~ 3,33 | Napetosti si seštel, kot da vira delujeta v isto smer. Vira sta obrnjena drug proti drugemu, zato $12 - 3$.
~ 3 | Pozabil si notranja upora: tok omejujejo vsi trije upori.
> Obhod v smeri urinega kazalca: $12 - 3 - I(1 + 0{,}5 + 3) = 0$, torej $I = \frac{9}{4{,}5}\,\mathrm{A} = 2\,\mathrm{A}$. Desna baterija se pri tem polni.

? Ko na baterijo priključimo upornik $4\,\Omega$, teče $0{,}5\,\mathrm{A}$; z upornikom $9\,\Omega$ teče $0{,}25\,\mathrm{A}$. Kolikšna je gonilna napetost baterije v voltih?
= 2,5 V | 0,01
~ 2 | To je le napetost na uporniku $4\,\Omega$ ($0{,}5 \cdot 4$). Pozabil si padec na notranjem uporu.
~ 2,25 | To je napetost na uporniku $9\,\Omega$. Ker se z $2{,}0\,\mathrm{V}$ ne ujema, je jasno, da notranjega upora ne smeš zanemariti.
> Iz $U_g = I(R + R_i)$ dobiš enačbo $0{,}5(4 + R_i) = 0{,}25(9 + R_i)$, torej $R_i = 1\,\Omega$ in $U_g = 0{,}5 \cdot 5\,\mathrm{V} = 2{,}5\,\mathrm{V}$.

<<RACUN
vrednost: 9/(300+60) | 0.025
vrednost: 0.025*300 | 7.5
vrednost: 9/302*300 | 8.94
vrednost: 9/2 | 4.5
vrednost: (9-8.4)/0.03 | 20
vrednost: 8.4/0.03 | 280
resi: a+b=c, 9-a-6*c=0, 6-2*b-6*c=0 | a, b, c | a=1.8, b=-0.6, c=1.2
vrednost: 9*1.8 | 16.2
vrednost: 1.8^2*1+1.2^2*6+0.6^2*2+6*0.6 | 16.2
vrednost: 12^2*2/(2+4)^2 | 8
vrednost: 12^2*4/(4+4)^2 | 9
vrednost: 12^2*8/(8+4)^2 | 8
vrednost: 12^2*16/(16+4)^2 | 5.76
vrednost: 12^2*1/(1+4)^2 | 5.76
vrednost: 12^2*4/(4+3)^2 | 11.76
vrednost: 12^2*8/(8+3)^2 | 9.52
vrednost: 12^2*2/(2+3)^2 | 11.52
vrednost: 12^2*1/(1+3)^2 | 9
vrednost: 6*1.2 | 7.2
resi: (9-x)/1+(6-x)/2=x/6 | x | 7.2
vrednost: (12+3)/(1+0.5+3) | 3.33
vrednost: 0.5*(4+1) | 2.5
vrednost: (12-3)/(1+0.5+3) | 2
resi: 0.5*(4+x)=0.25*(9+x) | x | 1
>>

:::simboli
U_g | gonilna napetost | | V | napetost neobremenjenega vira
R_i | notranji upor vira | R_i = \frac{U_g - U}{I} | \Omega
I | električni tok (skozi porabnik) | I = \frac{U_g}{R + R_i} | A | obrazec velja za en vir in en porabnik
U | napetost na sponkah vira | U = U_g - I R_i | V
R | upor porabnika (pedal, zvočnik, ojačevalnik) | R = \frac{U}{I} | \Omega
P | moč na porabniku | P = I^2 R | W
P_{max} | največja moč na porabniku | P_{max} = \frac{U_g^2}{4R_i} | W | pri $R = R_i$
U_{g1}, U_{g2} | gonilni napetosti prve in druge baterije | | V
R_1, R_2 | notranja upora prve in druge baterije | | \Omega
I_1, I_2 | tokova skozi prvo in drugo baterijo | | A
:::
