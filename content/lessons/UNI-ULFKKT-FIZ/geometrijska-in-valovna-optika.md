---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pri gastroskopiji zdravnik skozi upogljivo cevko vidi steno želodca, čeprav cevka večkrat zavije; potapljač, ki pogleda poševno navzgor, vidi gladino kot srebrno ogledalo. Za obema stoji **totalni odboj**: svetloba, ki iz gostejše snovi pod dovolj poševnim kotom zadene mejo z redkejšo, se v celoti odbije.

Na zakonih optike delujejo mikroskop, refraktometer in optično vlakno. Optiko obravnavamo na dva načina:

- **Geometrijska optika** opisuje svetlobo z žarki, ki se odbijajo in lomijo; velja, kadar so ovire in odprtine veliko večje od valovne dolžine.
- **Valovna optika** upošteva, da je svetloba valovanje, in razloži **interferenco** in **uklon**, ki omejuje ločljivost mikroskopa.

## Razlaga

Mikavna predstava je, da je svetloba le snop ravnih žarkov in da je ločljivost mikroskopa omejena samo s tem, kako dobro so brušene leče: z dovolj popolnim steklom bi videli poljubno drobne podrobnosti. Prvi del te predstave je zelo uporaben in z njim razložimo lom, totalni odboj in leče. Drugi del je napačen; popravi ga šele valovna narava svetlobe.

### Žarki: lom, odboj in leče

**1. Lomni količnik.** Svetloba ima v praznem prostoru hitrost $c_0 = 3{,}00 \cdot 10^8\,\mathrm{m/s}$, v snovi pa manjšo hitrost $c$. **Lomni količnik** snovi je

$$n = \frac{c_0}{c} \ge 1.$$

Za zrak je $n \approx 1{,}00$, za vodo $1{,}33$, za navadno steklo okoli $1{,}5$. Pri prehodu v drugo snov se frekvenca ne spremeni, valovna dolžina pa se v snovi skrajša na $\lambda = \lambda_0/n$, kjer je $\lambda_0$ valovna dolžina v praznem prostoru.

:::premisli
Rdeča svetloba z valovno dolžino $650\,\mathrm{nm}$ preide iz zraka v vodo. Ali je v vodi še vedno rdeča?
---
Da. Barvo določa frekvenca, ta pa se pri prehodu ne spremeni. Valovna dolžina se v vodi sicer skrajša na $650/1{,}33 \approx 489\,\mathrm{nm}$, a to ni »modra« svetloba, saj ima nespremenjeno frekvenco rdeče.
:::

**2. Odbojni in lomni zakon.** Kote merimo od **vpadne pravokotnice** (normale na mejno ploskev). Naj svetloba pade na gladko mejo med homogenima izotropnima snovema z lomnima količnikoma $n_1$ in $n_2$. Potem vpadni, odbiti in lomljeni žarek ležijo z vpadno pravokotnico v isti ravnini, odbojni kot je enak vpadnemu, za lomni kot pa velja **lomni zakon** (Snellov zakon):

$$n_1\sin\alpha = n_2\sin\beta.$$

*Izpeljava* (Huygensovo načelo): ravno valovno čelo zadene mejo poševno. V času $t$, ko en njegov rob v prvi snovi prepotuje še $c_1t$ do meje, se elementarni val iz drugega roba, ki je mejo že zadel, v drugi snovi razširi do $c_2t$. Obe razdalji sta kateti pravokotnih trikotnikov s skupno hipotenuzo $l$ na meji, zato $c_1t = l\sin\alpha$ in $c_2t = l\sin\beta$. Kvocient da $\sin\alpha/\sin\beta = c_1/c_2 = n_2/n_1$.

Pri prehodu v optično gostejšo snov ($n_2 > n_1$) se žarek lomi **k pravokotnici**, pri prehodu v redkejšo pa **od nje**.

**3. Totalni odboj.** Pri prehodu iz gostejše v redkejšo snov lomni kot doseže $90^\circ$ pri **mejnem kotu**

$$\sin\alpha_m = \frac{n_2}{n_1}.$$

*Izpeljava:* pri $n_1 > n_2$ je $\sin\beta = (n_1/n_2)\sin\alpha > \sin\alpha$, zato lomni kot doseže $90^\circ$ že pri $\sin\alpha = n_2/n_1$. Pri večjih vpadnih kotih bi moral biti $\sin\beta > 1$, lomljenega žarka ni in svetloba se v celoti odbije. Totalni odboj ni odboj od posebej gladke ali zrcalne ploskve: zgodi se na povsem prozorni meji, a le pri prehodu iz optično gostejše v optično redkejšo snov. Na tem delujejo optična vlakna, prizme v daljnogledih in refraktometri.

**4. Disperzija.** Lomni količnik je odvisen od valovne dolžine; v steklu je za modro svetlobo večji kot za rdečo. Zato prizma razkloni belo svetlobo v spekter in zato nastane mavrica.

**5. Tanke leče.** Zbiralna leča zbere vzporedne žarke v **gorišču** na razdalji $f$ (**goriščna razdalja**) za lečo; razpršilna leča jih razprši, kot da prihajajo iz navideznega gorišča pred njo, zato ji pripišemo $f < 0$. Naj bo leča tanka (njena debelina je zanemarljiva v primerjavi z $a$, $b$ in $f$), naj bo na obeh straneh leče ista snov in naj žarki z osjo oklepajo majhne kote (**obosni žarki**). Če je predmet na razdalji $a$ pred lečo, nastane slika na razdalji $b$ za njo, pri čemer velja **enačba leče**

$$\frac{1}{a} + \frac{1}{b} = \frac{1}{f}.$$

*Izpeljava* (zbiralna leča, $a > f$): žarek skozi središče leče gre naravnost, zato podobna trikotnika dasta $|y'|/y = b/a$. Žarek, vzporeden z osjo, gre za lečo skozi gorišče; trikotnika z vrhom v gorišču dasta $|y'|/y = (b - f)/f$. Iz $b/a = (b - f)/f$ sledi $bf = ab - af$, deljenje z $abf$ pa da enačbo leče.

Če dobimo $b > 0$, je slika **realna** (lahko jo ujamemo na zaslon) in obrnjena; če je $b < 0$, je slika **navidezna**, pokončna in na isti strani kot predmet. **Povečava** je

$$M = \frac{y'}{y} = -\frac{b}{a};$$

negativen predznak pomeni obrnjeno sliko. **Lomnost** leče je $1/f$, enota je **dioptrija**, $1\,\mathrm{dpt} = 1\,\mathrm{m^{-1}}$. Lomnosti tankih leč, ki so tesno skupaj, se seštejejo. Goriščno razdaljo določajo krivinski radiji ploskev in lomni količnik: $1/f = (n - 1)(1/r_1 + 1/r_2)$ za izbočeni ploskvi v zraku (izdolbeno ploskev vzamemo z negativnim radijem).

### Kjer žarki ne zadoščajo: svetloba kot valovanje

Žarkovna slika ne pove, zakaj se milni mehurček obarva ali zakaj dva snopa svetlobe skupaj lahko dasta temo. Za to potrebujemo valovanje.

**6. Svetloba kot valovanje: interferenca.** Ko se srečata dve **koherentni** valovanji (z enako frekvenco in stalno fazno razliko, ne pravokotno polarizirani), se njuni polji seštejeta. Če izvora nihata v fazi, velja: kjer je razlika poti $\Delta$ celoštevilski večkratnik valovne dolžine, je **ojačitev**, kjer je liho število polovic valovne dolžine, je **oslabitev**:

$$\Delta = m\lambda \;\;(\text{ojačitev}), \qquad \Delta = \left(m + \tfrac{1}{2}\right)\lambda \;\;(\text{oslabitev}), \qquad m = 0, \pm1, \pm2, \dots$$

**7. Dve reži (Youngov poskus).** Reži na razdalji $d$ osvetlimo z enobarvno svetlobo. Pod kotom $\theta$ je razlika poti $d\sin\theta$, zato so svetle proge pri

$$d\sin\theta = m\lambda.$$

*Izpeljava:* zaslon je na razdalji $L$; pri $L \gg d$ sta žarka iz rež proti isti točki zaslona skoraj vzporedna, zato je razlika poti kateta $d\sin\theta$ pravokotnega trikotnika s hipotenuzo $d$. Pri majhnih kotih je $y_m = L\tan\theta_m \approx L\sin\theta_m = m\lambda L/d$, zato so proge enakomerno razmaknjene za $\Delta y = \lambda L/d$.

**8. Uklonska mrežica.** Mrežica ima veliko enako razmaknjenih rež s **konstanto mrežice** $d$ (npr. $600$ rež na milimeter pomeni $d = 1{,}67\,\mu\mathrm{m}$). Ojačitve so pri istih kotih kot pri dveh režah, $d\sin\theta = m\lambda$, a so zelo ozke in svetle. Ker je kot ojačitve odvisen od $\lambda$, mrežica razkloni svetlobo v spekter, zato je srce mnogih spektrometrov. Največji red je $m \le d/\lambda$, ker je $\sin\theta \le 1$.

**9. Interferenca na tankih plasteh.** Svetloba, odbita na zgornji in spodnji ploskvi tanke plasti z debelino $h$ in lomnim količnikom $n$, interferira. Pri pravokotnem vpadu je razlika poti $2nh$, pri odboju na optično gostejši snovi pa se faza dodatno spremeni za pol valovne dolžine. Pri plasti v zraku (milnica) ima ta skok le en odboj, zato je odbita svetloba ojačena pri $2nh = (m + \tfrac{1}{2})\lambda_0$. Pri protiodbojni plasti na steklu ($n_\mathrm{zrak} < n < n_\mathrm{steklo}$) ga imata oba odboja, zato je odbita svetloba oslabljena pri $2nh = (m + \tfrac{1}{2})\lambda_0$, najtanjša plast ima $h = \lambda_0/(4n)$. Od tod barve milnih mehurčkov in oljnih madežev ter protiodbojne plasti na lečah.

### Uklon: meja, ki je ne odpravi nobena leča

Zdaj lahko popravimo mikavno predstavo z začetka. Tudi popolna leča ima končno odprtino, svetloba pa se na vsaki odprtini ukloni.

**10. Uklon.** Valovanje se za oviro ali odprtino ukloni, torej zaide tudi v geometrijsko senco. Pri reži s širino $D$ so temne proge pri $D\sin\theta = m\lambda$ ($m = \pm1, \pm2, \dots$); osrednja svetla proga ima kotno polširino $\sin\theta \approx \lambda/D$. *Utemeljitev* prvega minimuma: režo razdelimo na polovici; pri $D\sin\theta = \lambda$ ima vsak žarek iz zgornje polovice v spodnji partnerja z razliko poti $\lambda/2$, zato se paroma oslabijo. Pri okrogli odprtini s premerom $D$ je prvi temni kolobar pri $\sin\theta \approx 1{,}22\,\lambda/D$. Ta kot je **mejna ločljivost** (**Rayleighov kriterij**: točki sta še ločeni, ko osrednji maksimum ene leži v prvem minimumu druge); dveh točk, ki ju vidimo pod manjšim kotom, z napravo ne moremo ločiti.

:::premisli
Ali loči mikroskop drobnejše podrobnosti z modro ali z rdečo svetlobo? Zakaj?
---
Z modro. Mejni kot je sorazmeren z $\lambda/D$, zato krajša valovna dolžina pomeni manjši mejni kot in ločitev bližjih točk. Iz istega razloga elektronski mikroskop z mnogo krajšo valovno dolžino loči še veliko drobnejše podrobnosti.
:::

## Rešeni primeri

### Primer 1 (lažji)

Laserski žarek pada iz zraka na vodno gladino pod kotom $40^\circ$ glede na vpadno pravokotnico. Pod kolikšnim kotom se lomi? Kolikšen je mejni kot za totalni odboj, ko svetloba prehaja iz vode v zrak? Lomni količnik vode je $1{,}33$, zraka $1{,}00$.

**Podatki:** $\alpha = 40^\circ$, $n_1 = 1{,}00$ (zrak), $n_2 = 1{,}33$ (voda)
**Iščemo:** lomni kot $\beta$ in mejni kot $\alpha_m$ pri prehodu iz vode v zrak

:::formula
$n_1\sin\alpha = n_2\sin\beta$, $\sin\alpha_m = n_\mathrm{zrak}/n_\mathrm{voda}$
:::

**Rešitev:**

1. Iz lomnega zakona: $\sin\beta = 1{,}00 \cdot \sin 40^\circ/1{,}33 = 0{,}643/1{,}33 \approx 0{,}483$.
2. $\beta = \arcsin 0{,}483 \approx 28{,}9^\circ$. Kot je manjši od vpadnega, ker se žarek lomi k pravokotnici.
3. Mejni kot: $\sin\alpha_m = 1{,}00/1{,}33 \approx 0{,}752$, torej $\alpha_m \approx 48{,}8^\circ$; pri tem vpadnem kotu je lomni kot $90^\circ$, $\sin 90^\circ = 1$.
4. Odgovor: žarek se v vodi lomi pod kotom približno $28{,}9^\circ$; pri prehodu iz vode v zrak pride do totalnega odboja pri vpadnih kotih nad približno $48{,}8^\circ$.

### Primer 2

Na optični klopi v praktikumu postavimo predmet, visok $2{,}0\,\mathrm{cm}$, $15\,\mathrm{cm}$ pred zbiralno lečo z goriščno razdaljo $10\,\mathrm{cm}$. Kje nastane slika, kolikšna je povečava in kakšna je slika? Kaj se spremeni, če predmet premaknemo na razdaljo $6{,}0\,\mathrm{cm}$ pred lečo?

**Podatki:** $y = 2{,}0\,\mathrm{cm}$, $a_1 = 15\,\mathrm{cm}$, $a_2 = 6{,}0\,\mathrm{cm}$, $f = 10\,\mathrm{cm}$ (zbiralna leča)
**Iščemo:** razdaljo slike $b$, povečavo $M$, velikost slike $y'$ in vrsto slike za obe legi predmeta

:::formula
$\dfrac{1}{a} + \dfrac{1}{b} = \dfrac{1}{f}$, $M = -\dfrac{b}{a}$, $y' = My$
:::

**Rešitev:**

1. Prva lega, iz enačbe leče: $1/b = 1/10 - 1/15 = 1/30\,\mathrm{cm^{-1}}$, torej $b = 30\,\mathrm{cm}$; slika je za lečo, ker je predmet dlje od gorišča.
2. $M = -30/15 = -2{,}0$, $y' = -2{,}0 \cdot 2{,}0\,\mathrm{cm} = -4{,}0\,\mathrm{cm}$. Slika je realna, obrnjena (negativna povečava) in dvakrat povečana.
3. Druga lega: $1/b = 1/10 - 1/6{,}0 = -1/15\,\mathrm{cm^{-1}}$, torej $b = -15\,\mathrm{cm}$; $b$ je negativen, ker je predmet znotraj goriščne razdalje.
4. $M = -(-15)/6{,}0 = 2{,}5$, $y' = 5{,}0\,\mathrm{cm}$. Slika je navidezna, pokončna, $2{,}5$-krat povečana in leži $15\,\mathrm{cm}$ pred lečo, na strani predmeta. Tako deluje lupa.
5. Odgovor: v prvem primeru nastane realna obrnjena slika $30\,\mathrm{cm}$ za lečo, visoka $4{,}0\,\mathrm{cm}$; v drugem navidezna pokončna slika $15\,\mathrm{cm}$ pred lečo, visoka $5{,}0\,\mathrm{cm}$.

### Primer 3 (težji)

Zeleni laser z valovno dolžino $532\,\mathrm{nm}$ pravokotno osvetli uklonsko mrežico s $600$ režami na milimeter. Zaslon je $1{,}00\,\mathrm{m}$ za mrežico in vzporeden z njo. Pod kolikšnima kotoma sta ojačitvi prvega in drugega reda in kako daleč od osrednje pege sta na zaslonu? Koliko redov lahko največ opazimo na vsako stran? Nato zeleni laser zamenjamo z rdečim in ojačitev prvega reda je na zaslonu $0{,}410\,\mathrm{m}$ od osrednje pege. Kolikšna je valovna dolžina rdečega laserja in koliko redov rdeče svetlobe vidimo?

**Podatki:** $\lambda = 532\,\mathrm{nm} = 5{,}32 \cdot 10^{-7}\,\mathrm{m}$, $600$ rež na $\mathrm{mm}$, $L = 1{,}00\,\mathrm{m}$, pravokoten vpad, rdeča svetloba: $y_1' = 0{,}410\,\mathrm{m}$
**Iščemo:** kota $\theta_1$, $\theta_2$, odmika $y_1$, $y_2$ na zaslonu, največji red $m_{\max}$; valovno dolžino $\lambda'$ rdeče svetlobe in njen največji red

:::formula
$d\sin\theta_m = m\lambda$, $y_m = L\tan\theta_m$, $m_{\max} \le d/\lambda$
:::

**Rešitev:**

1. Konstanta mrežice: $d = 1\,\mathrm{mm}/600 \approx 1{,}667 \cdot 10^{-6}\,\mathrm{m}$, ker je na milimetru $600$ enako razmaknjenih rež.
2. Prvi red: $\sin\theta_1 = 5{,}32 \cdot 10^{-7}/1{,}667 \cdot 10^{-6} = 0{,}319$, $\theta_1 \approx 18{,}6^\circ$.
3. Drugi red: $\sin\theta_2 = 0{,}638$, $\theta_2 \approx 39{,}7^\circ$; sinus je dvakrat večji, ker je $m = 2$, kot sam pa ni dvakrat večji.
4. Odmika: $y_1 = 1{,}00\,\mathrm{m} \cdot \tan 18{,}6^\circ \approx 0{,}337\,\mathrm{m}$, $y_2 = 1{,}00\,\mathrm{m} \cdot \tan 39{,}7^\circ \approx 0{,}829\,\mathrm{m}$. Ker kot ni majhen, približka $y = m\lambda L/d$ tu ne smemo uporabiti.
5. Največji red: $d/\lambda = 1{,}667 \cdot 10^{-6}/5{,}32 \cdot 10^{-7} \approx 3{,}13$, torej $m_{\max} = 3$ (kot $\theta_3 \approx 73{,}3^\circ$).
6. Obratna naloga za rdečo svetlobo: iz odmika najprej kot, $\tan\theta_1' = 0{,}410/1{,}00$, $\theta_1' \approx 22{,}3^\circ$, ker je zaslon pravokoten na smer osrednje pege.
7. $\lambda' = d\sin\theta_1' = 1{,}667 \cdot 10^{-6} \cdot 0{,}3793\,\mathrm{m} \approx 6{,}32 \cdot 10^{-7}\,\mathrm{m} = 632\,\mathrm{nm}$, ker je $m = 1$.
8. $d/\lambda' = 1{,}667 \cdot 10^{-6}/6{,}32 \cdot 10^{-7} \approx 2{,}64$, zato rdeča svetloba da le dva reda na vsako stran; tretji bi zahteval $\sin\theta > 1$.
9. Odgovor: ojačitvi prvega in drugega reda zelene svetlobe sta pod kotoma približno $18{,}6^\circ$ in $39{,}7^\circ$, na zaslonu $33{,}7\,\mathrm{cm}$ in $82{,}9\,\mathrm{cm}$ od osrednje pege; na vsako stran opazimo največ tri rede (na dovolj velikem zaslonu). Rdeči laser ima valovno dolžino okoli $632\,\mathrm{nm}$ in da le dva reda.

### Primer 4 – zdaj ti

Zenica očesa ima pri dnevni svetlobi premer $3{,}0\,\mathrm{mm}$. Oko je najbolj občutljivo za svetlobo z valovno dolžino $550\,\mathrm{nm}$. Kolikšna je uklonska mejna ločljivost očesa in s kolikšne največje razdalje še ločimo dve točki, ki sta $1{,}0\,\mathrm{mm}$ narazen?

**Podatki:** $D = 3{,}0\,\mathrm{mm} = 3{,}0 \cdot 10^{-3}\,\mathrm{m}$, $\lambda = 550\,\mathrm{nm} = 5{,}50 \cdot 10^{-7}\,\mathrm{m}$, razmik točk $s = 1{,}0\,\mathrm{mm} = 1{,}0 \cdot 10^{-3}\,\mathrm{m}$
**Iščemo:** mejni kot $\theta$, največjo razdaljo $L$

:::formula
$\sin\theta \approx 1{,}22\,\lambda/D$, pri majhnih kotih $s \approx L\theta$
:::

**Rešitev:**

1. Mejni kot: $\theta \approx 1{,}22 \cdot 5{,}50 \cdot 10^{-7}/3{,}0 \cdot 10^{-3} \approx 2{,}24 \cdot 10^{-4}\,\mathrm{rad}$, ker uklon na okrogli odprtini zenice razmaže vsako točko v kolobarček.
2. Kot je tako majhen, da je $\sin\theta \approx \tan\theta \approx \theta$ v radianih, zato velja $s \approx L\theta$.
3. Izračunaj sam največjo razdaljo $L$.

:::premisli
S kolikšne razdalje še ločiš točki, ki sta $1{,}0\,\mathrm{mm}$ narazen?
---
$L = s/\theta = 1{,}0 \cdot 10^{-3}/2{,}24 \cdot 10^{-4}\,\mathrm{m} \approx 4{,}5\,\mathrm{m}$. Z večje razdalje se kolobarčka točk prekrivata in vidimo eno samo točko. V resnici je oko zaradi napak leče in gostote čepkov nekoliko slabše.
:::

## Pogoste napake

- **Kot od ploskve namesto od pravokotnice.** Kot med žarkom in gladino najprej odštej od $90^\circ$.
- **Totalni odboj v napačni smeri.** Mogoč je le pri prehodu v optično redkejšo snov.
- **Predznaki pri lečah.** Razpršilna leča ima $f < 0$, navidezna slika $b < 0$.
- **Dioptrije in centimetri.** $f$ mora biti v **metrih**: $f = 25\,\mathrm{cm}$ pomeni $4\,\mathrm{dpt}$.
- **Približek majhnih kotov pri mrežici.** $\Delta y = \lambda L/d$ velja le pri majhnih kotih; pri mrežici računaj s $\sin$ in $\tan$.
- **Uklonske ojačitve pri eni reži.** Pri eni reži da $D\sin\theta = m\lambda$ **temne** proge, pri mrežici $d\sin\theta = m\lambda$ **svetle**.

## Povzetek

- $n = c_0/c$, $\lambda = \lambda_0/n$; lomni zakon $n_1\sin\alpha = n_2\sin\beta$; mejni kot $\sin\alpha_m = n_2/n_1$ ($n_1 > n_2$).
- Leča: $1/a + 1/b = 1/f$, $M = -b/a$; $b < 0$ navidezna slika, $f < 0$ razpršilna leča; lomnost $1/f$ v dioptrijah.
- Interferenca: ojačitev pri razliki poti $m\lambda$, oslabitev pri $(m + \tfrac{1}{2})\lambda$.
- Dve reži in mrežica: $d\sin\theta = m\lambda$; dve reži pri majhnih kotih $\Delta y = \lambda L/d$.
- Uklon na reži: temne proge pri $D\sin\theta = m\lambda$; okrogla odprtina: mejna ločljivost $\sin\theta \approx 1{,}22\lambda/D$.

## Za izpit

Znati moraš povedati:

- lomni zakon z vsemi pogoji in njegovo izpeljavo iz Huygensovega načela (ali Fermatovega načela iz razdelka Bolj natančno);
- pogoj za totalni odboj ($n_1 > n_2$) in izpeljavo mejnega kota;
- enačbo tanke leče s pogoji in dogovorom o predznakih, njeno izpeljavo iz dveh značilnih žarkov in povečavo $M = -b/a$;
- pogoje za interferenco, izpeljavo $d\sin\theta = m\lambda$, $\Delta y = \lambda L/d$ in $m_{\max} \le d/\lambda$ ter pogoj za tanko plast s faznim skokom;
- uklon na reži (prvi minimum) in Rayleighov kriterij $\sin\theta \approx 1{,}22\,\lambda/D$.

### Naloga 1

Optično vlakno ima jedro z lomnim količnikom $1{,}48$ in plašč z lomnim količnikom $1{,}46$. Kolikšen je mejni kot na meji jedro–plašč? Pod kolikšnim največjim kotom glede na os sme žarek iz zraka vpasti na ravno čelo vlakna, da ostane ujet v jedru? Za koliko pride v $1{,}00\,\mathrm{km}$ dolgem vlaknu najbolj poševen ujet žarek kasneje od žarka vzdolž osi? $c_0 = 3{,}00 \cdot 10^8\,\mathrm{m/s}$.

**Rešitev:**

1. Mejni kot: $\sin\alpha_m = 1{,}46/1{,}48 \approx 0{,}9865$, $\alpha_m \approx 80{,}6^\circ$; totalni odboj je mogoč, ker je jedro optično gostejše.
2. Pravokotnica na plašč je pravokotna na os, zato ujet žarek z osjo oklepa največ $\gamma = 90^\circ - \alpha_m \approx 9{,}4^\circ$.
3. Lom na čelu: $1{,}00 \cdot \sin\theta_0 = n_1\sin\gamma = n_1\cos\alpha_m = n_1\sqrt{1 - (n_2/n_1)^2} = \sqrt{n_1^2 - n_2^2}$.
4. $\sin\theta_0 = \sqrt{1{,}48^2 - 1{,}46^2} = \sqrt{0{,}0588} \approx 0{,}242$, torej $\theta_0 \approx 14{,}0^\circ$.
5. Osni žarek potuje s hitrostjo $c_0/n_1$: $t_0 = Ln_1/c_0 = 1000 \cdot 1{,}48/3{,}00 \cdot 10^8\,\mathrm{s} \approx 4{,}93 \cdot 10^{-6}\,\mathrm{s}$.
6. Najbolj poševen žarek prepotuje pot $L/\cos\gamma = L/\sin\alpha_m = Ln_1/n_2$, zato $t_1 = t_0n_1/n_2 = 4{,}933 \cdot 10^{-6} \cdot 1{,}48/1{,}46\,\mathrm{s} \approx 5{,}00 \cdot 10^{-6}\,\mathrm{s}$.
7. Zamik: $\Delta t = t_0(n_1/n_2 - 1) = 4{,}933 \cdot 10^{-6} \cdot 0{,}0137\,\mathrm{s} \approx 6{,}8 \cdot 10^{-8}\,\mathrm{s}$.
8. Odgovor: mejni kot je okoli $80{,}6^\circ$, žarek mora vpasti pod kotom največ okoli $14{,}0^\circ$ glede na os, najbolj poševen ujet žarek pa po $1\,\mathrm{km}$ zamuja okoli $68\,\mathrm{ns}$; zato se kratek utrip po vlaknu razširi.

### Naloga 2

Natančno navedi enačbo tanke leče z vsemi pogoji in dogovorom o predznakih ter jo izpelji za zbiralno lečo in realno sliko. Izpelji povečavo. Utemelji, ali lahko razpršilna leča realnega predmeta da realno sliko.

**Rešitev:**

1. Pogoji: leča je tanka, žarki so obosni, na obeh straneh je ista snov. Predznaki: $a > 0$ za predmet pred lečo; $b > 0$ za realno sliko za lečo, $b < 0$ za navidezno sliko pred njo; $f > 0$ za zbiralno, $f < 0$ za razpršilno lečo.
2. Predmet z višino $y$ stoji na razdalji $a > f$, slika z višino $|y'|$ nastane na razdalji $b$. Žarek skozi središče se ne lomi, zato podobna trikotnika dasta $|y'|/y = b/a$.
3. Žarek, vzporeden z osjo, zadene lečo na višini $y$ in gre skozi gorišče za lečo; podobna trikotnika s katetama $f$, $y$ in $b - f$, $|y'|$ dasta $|y'|/y = (b - f)/f$.
4. Izenačimo: $b/a = (b - f)/f$, torej $bf = ab - af$; deljenje z $abf$ da $1/a + 1/b = 1/f$.
5. Povečava: realna slika je obrnjena, zato je $y'$ negativen in $M = y'/y = -b/a$; za navidezne slike in razpršilne leče isti postopek z dogovorom o predznakih da isti enačbi.
6. Razpršilna leča: $f < 0$ in $a > 0$, zato $1/b = 1/f - 1/a < 0$ in $b < 0$ za vsak $a$. Ker je $1/|b| = 1/|f| + 1/a > 1/a$, je $|b| < a$ in $0 < M < 1$.
7. Odgovor: ne; razpršilna leča da realnemu predmetu vedno navidezno, pokončno in pomanjšano sliko med predmetom in lečo.

## Drugače: Na sliki

Lom na meji zrak–voda (pravokotnica je navpična črta):

```
          |
   \      |        zrak  n = 1,00
     \ 40°|
       \  |
  ------\-+----------------  gladina
          |\
          | \ 28,9°    voda  n = 1,33
          |  \
```

Slika z lečo nastane v presečišču žarka, vzporednega z osjo, in žarka skozi središče; pri $a < f$ se sekata le podaljška nazaj.

## Drugače: Uporaba v stroki

**Refraktometrija.** Refraktometer meri mejni kot totalnega odboja med prizmo in vzorcem; ker lomni količnik narašča s koncentracijo, kaže kar masni delež sladkorja.

**Optična vlakna.** Totalni odboj vodi svetlobo kilometre daleč in v endoskopih prenaša sliko; zamik iz Naloge 1 omejuje hitrost prenosa.

**Protiodbojne plasti.** Plast $\mathrm{MgF_2}$ ($n = 1{,}38$) z debelino $h = \lambda_0/(4n) \approx 550\,\mathrm{nm}/(4 \cdot 1{,}38) \approx 100\,\mathrm{nm}$ na lečah skoraj odpravi odboj zelene svetlobe.

**Ločljivost mikroskopa.** Zaradi uklona svetlobni mikroskop ne loči podrobnosti pod okoli $0{,}2\,\mu\mathrm{m}$; viruse vidimo šele z elektronskim mikroskopom.

## Drugače: Bolj natančno

**Lomni zakon iz Fermatovega načela.** Svetloba izbere pot s stacionarnim časom. Žarek gre iz točke $A$ na višini $h_1$ nad mejo do točke $B$ na globini $h_2$, vodoravno za $D$; če prečka mejo pri $x$, je čas

$$t(x) = \frac{n_1\sqrt{h_1^2 + x^2}}{c_0} + \frac{n_2\sqrt{h_2^2 + (D - x)^2}}{c_0}.$$

Pogoj $t'(x) = 0$ da $n_1\,x/\sqrt{h_1^2 + x^2} = n_2\,(D - x)/\sqrt{h_2^2 + (D - x)^2}$, kar je ravno $n_1\sin\alpha = n_2\sin\beta$.

**Jakost pri dveh režah.** Polji s fazno razliko $\delta = 2\pi d\sin\theta/\lambda$ dasta amplitudo $2E_0\cos(\delta/2)$, jakost pa je sorazmerna s kvadratom amplitude:

$$j(\theta) = 4j_1\cos^2\!\left(\frac{\pi d\sin\theta}{\lambda}\right).$$

Pri mrežici z $N$ režami so glavne ojačitve $N^2$-krat svetlejše in široke le okoli $\lambda/(Nd)$, zato ima mrežica **ločljivost** $\lambda/\Delta\lambda = mN$.

## Preveri se

? Kolikšen je mejni kot za totalni odboj pri prehodu svetlobe iz stekla z lomnim količnikom $1{,}50$ v zrak?
- $48{,}6^\circ$
~ To je $\arcsin 0{,}75$, mejni kot za vodo z $n \approx 1{,}33$; vzel si lomni količnik vode namesto stekla.
+ $41{,}8^\circ$
- $56{,}3^\circ$
~ To je $\arctan 1{,}50$; pri mejnem kotu velja $\sin\alpha_m = n_2/n_1$, ne tangens.
> $\sin\alpha_m = 1{,}00/1{,}50 = 0{,}667$, torej $\alpha_m \approx 41{,}8^\circ$.

? Predmet je $40\,\mathrm{cm}$ pred zbiralno lečo z goriščno razdaljo $20\,\mathrm{cm}$. Kakšna je slika?
+ Realna, obrnjena, enako velika, $40\,\mathrm{cm}$ za lečo.
- Navidezna, pokončna, dvakrat povečana, $20\,\mathrm{cm}$ pred lečo.
~ Navidezna slika nastane le, ko je predmet znotraj goriščne razdalje ($a < f$); tu je $a = 2f$.
- Realna, obrnjena, dvakrat pomanjšana, $20\,\mathrm{cm}$ za lečo.
~ Misliš, da slika nastane v gorišču; tam nastane le slika zelo oddaljenega predmeta. Enačba leče da $b = 40\,\mathrm{cm}$.
> $1/b = 1/20 - 1/40 = 1/40$, torej $b = 40\,\mathrm{cm}$ in $M = -40/40 = -1$.

? Pri poskusu z dvema režama razdaljo med režama podvojimo. Kaj se zgodi z razmikom med svetlimi progami na zaslonu?
- Podvoji se.
~ Zamenjal si sorazmernost: pri večjem razmiku rež je ista razlika poti $\lambda$ dosežena že pri manjšem kotu, zato so proge bliže.
- Ostane enak.
~ Razlika poti $d\sin\theta$ je odvisna od razmika rež, zato se spremenijo tudi koti ojačitev.
+ Razpolovi se.
> $\Delta y = \lambda L/d$ je obratno sorazmeren z $d$.

? Kolikšna je lomnost zbiralne leče z goriščno razdaljo $25\,\mathrm{cm}$?
- $0{,}04\,\mathrm{dpt}$
~ To je $1/25$ s centimetri; dioptrija je $\mathrm{m^{-1}}$, zato mora biti $f$ v metrih.
- $25\,\mathrm{dpt}$
~ Lomnost ni goriščna razdalja, temveč njena obratna vrednost v metrih.
+ $4\,\mathrm{dpt}$
> Lomnost je $1/f$ z $f$ v metrih: $1/0{,}25\,\mathrm{m} = 4\,\mathrm{m^{-1}} = 4\,\mathrm{dpt}$.

? Pri katerem prehodu svetlobe je mogoč totalni odboj?
- Iz zraka v steklo
~ Pri prehodu v optično gostejšo snov se žarek lomi k pravokotnici, zato je lomni kot vedno manjši od $90^\circ$ in lomljeni žarek vedno obstaja.
+ Iz vode v zrak
- Pri vsakem prehodu, če je vpadni kot dovolj velik
~ Misliš, da dovolj velik vpadni kot vedno zadošča; mejni kot obstaja le, če je $n_2/n_1 < 1$; pri prehodu v gostejšo snov enačba $\sin\alpha_m = n_2/n_1$ nima rešitve.
> Totalni odboj je mogoč le pri prehodu iz optično gostejše v redkejšo snov, tu pri vpadnih kotih nad $48{,}8^\circ$.

:::simboli
n | lomni količnik snovi | n = \frac{c_0}{c} | – | zrak 1,00, voda 1,33, steklo okoli 1,5
n_1 | lomni količnik snovi, iz katere svetloba prihaja | | –
n_2 | lomni količnik snovi, v katero svetloba prehaja | | –
n_\mathrm{zrak} | lomni količnik zraka | | – | 1,00
n_\mathrm{voda} | lomni količnik vode | | – | 1,33
c_0 | hitrost svetlobe v praznem prostoru | | m/s | 3,00 · 10⁸ m/s
c | hitrost svetlobe v snovi | c = \frac{c_0}{n} | m/s
\alpha | vpadni kot | | ° | merjen od pravokotnice na mejo
\beta | lomni kot | | ° | merjen od pravokotnice na mejo
\alpha_m | mejni kot totalnega odboja | \sin\alpha_m = \frac{n_2}{n_1} | ° | le pri prehodu v optično redkejšo snov
a | razdalja predmeta od leče | | m
b | razdalja slike od leče | | m | b < 0: navidezna slika
f | goriščna razdalja leče | | m | razpršilna leča: f < 0
M | povečava slike | M = \frac{y'}{y} = -\frac{b}{a} | – | negativna: slika je obrnjena
y | velikost predmeta | | m
y' | velikost slike | y' = My | m | negativna: slika je obrnjena
m | red ojačitve (interferenčni red) | | – | m = 0, ±1, ±2, …
m_{\max} | največji red ojačitve | m_{\max} \le \frac{d}{\lambda} | –
\lambda | valovna dolžina svetlobe | \lambda = \frac{\lambda_0}{n} | m | v snovi krajša kot v praznem prostoru
\lambda_0 | valovna dolžina svetlobe v praznem prostoru | | m
d | razdalja med režama (konstanta mrežice) | | m
\theta | kot uklona (smer proti progi) | | °
\theta_m | kot ojačitve m-tega reda | d\sin\theta_m = m\lambda | °
y_m | odmik m-te proge od sredine zaslona | y_m = L\tan\theta_m | m
L | razdalja do zaslona | | m
t | čas potovanja svetlobe | | s
x | mesto, kjer žarek prečka mejo | | m
h_1 | višina točke A nad mejo | | m
h_2 | globina točke B pod mejo | | m
D | vodoravna razdalja med točkama A in B | | m | pri uklonu širina reže ali premer odprtine
j | jakost svetlobe | | W/m^2
j_1 | jakost svetlobe iz ene reže | | W/m^2
s | razdalja med točkama, ki ju ločimo | s \approx L\theta | m
:::
