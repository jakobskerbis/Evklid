---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. V receptu za pecivo piše $0{,}4\,\text{kg}$ moke. Pečeš le pol recepta, zato moko pomnožiš z $0{,}5$. Mama reče, da potrebuješ $0{,}2\,\text{kg}$. Brat trdi $2\,\text{kg}$, sestra pa $0{,}02\,\text{kg}$. Kdo ima prav? Poskusi odgovoriti, preden bereš naprej.

Pomaga zdrava pamet: polovica od $0{,}4\,\text{kg}$ mora biti manj kot $0{,}4\,\text{kg}$. Brat je zato zagotovo v zmoti. Med mamo in sestro pa odloči pravilo za vejico. Prav ima mama. Zakaj, pove pravilo za množenje v razlagi. V kuhinji, trgovini in pri merjenju računaš z decimalnimi števili vsak dan, zato se splača vedeti, kam postaviti vejico.

## Razlaga

Z naravnimi števili že znaš pisno seštevati, odštevati, množiti in deliti. Pri decimalnih številih računamo z istimi števkami na enak način. Novo je le eno: **kam gre vejica**. Zato bomo vsako operacijo postavili ob račun z naravnimi števili in poiskali razliko.

| Operacija | Naravna števila | Decimalna števila |
|---|---|---|
| seštevanje, odštevanje | enice pod enice | vejica pod vejico |
| množenje | nič ne poravnavamo | preštejemo decimalke |
| deljenje | ustavimo se pri ostanku | vejica v količnik, dopisujemo ničle |

**1. Seštevanje in odštevanje.** Pri naravnih številih podpišemo števili ob desnem robu, ker so tam enice. Pri decimalnih številih so enice tik pred vejico. Zato števili zapišemo **vejica pod vejico**. Manjkajoča mesta dopolnimo z ničlami, ki vrednosti ne spremenijo. V skledo daš $2{,}5\,\text{kg}$ krompirja in še $0{,}75\,\text{kg}$:

```
  2,50
+ 0,75
------
  3,25
```

Nato računamo kot pri naravnih številih in vejico zapišemo pod vejici. V skledi je $3{,}25\,\text{kg}$ krompirja.

**2. Množenje.** Tu je razlika največja: vejic **ne poravnavamo**. Vejici najprej spregledamo in zmnožimo naravni števili. Nato preštejemo decimalke obeh faktorjev skupaj. Toliko decimalk ima zmnožek.

Zakaj? Ena desetinka od ene desetinke je stotinka. Pri $0{,}3 \cdot 0{,}2$ zmnožimo $3 \cdot 2 = 6$, vsak del pa je stotinka, zato je $0{,}3 \cdot 0{,}2 = 0{,}06$.

Zdaj lahko rešiš uganko: $4 \cdot 5 = 20$, decimalki sta dve, torej $0{,}4 \cdot 0{,}5 = 0{,}20 = 0{,}2$. Sestra je ničlo na koncu prečrtala prezgodaj in dobila $0{,}02$. Ničlo smemo izbrisati šele, ko je vejica na pravem mestu.

:::premisli
Pri naravnih številih množenje nikoli ne zmanjša števila. Napovej: je $8 \cdot 0{,}5$ več ali manj kot $8$?
---
Manj: $8 \cdot 0{,}5 = 4$. Če množiš s številom, manjšim od $1$, vzameš le del števila. To je nova razlika glede na naravna števila.
:::

**3. Množenje in deljenje z $10$, $100$, $1000$.** Pri množenju se vejica premakne v desno za toliko mest, kolikor ničel ima množitelj: $3{,}47 \cdot 100 = 347$. Pri deljenju se premakne v levo: $45{,}6 : 10 = 4{,}56$.

**4. Deljenje z naravnim številom.** Delimo kot pri naravnih številih. Razlika je dvojna. Ko v deljencu prečkamo vejico, jo zapišemo tudi v količnik. Ko nam ostane ostanek, se ne ustavimo, ampak deljencu dopišemo ničlo in delimo naprej.

**5. Deljenje z decimalnim številom.** Z decimalnim deliteljem pisno ne znamo deliti. Zato deljenec in delitelj **pomnožimo z istim številom** ($10$, $100$ ali $1000$), da delitelj postane naravno število. Količnik se pri tem ne spremeni. Primer iz kuhinje: koliko kozarcev po $0{,}6\,\text{l}$ napolniš iz $4{,}8\,\text{l}$? V decilitrih je to $48\,\text{dl} : 6\,\text{dl}$, torej $4{,}8 : 0{,}6 = 48 : 6 = 8$ kozarcev.

:::premisli
Zakaj je $3 : 0{,}5$ več kot $3$, čeprav pri naravnih številih deljenje ne poveča števila?
---
Sprašujemo, kolikokrat gre polovica v $3$. V vsako celo gresta dve polovici, zato $3 : 0{,}5 = 30 : 5 = 6$. Deljenje s številom, manjšim od $1$, rezultat poveča.
:::

**6. Ocena in preizkus.** Pred računom oceni rezultat z zaokroženimi števili. Po računu ga preveri z obratno operacijo: odštevanje s seštevanjem, deljenje z množenjem.

V simulaciji spodaj »Računanje z decimalnimi števili na premici« seštej $0{,}7$ in $0{,}5$. Preštej male korake po eno desetinko: koliko jih je skupaj? Opazi, zakaj je rezultat $1{,}2$ in ne $0{,}12$.

## Rešeni primeri

### Primer 1 (lažji): moka v shrambi

Za kruh zmešaš $1{,}25\,\text{kg}$ bele in $0{,}6\,\text{kg}$ polnozrnate moke. Koliko moke porabiš? Koliko je ostane od vrečke z $2\,\text{kg}$ moke?

**Podatki:** bela moka $1{,}25\,\text{kg}$, polnozrnata moka $0{,}6\,\text{kg}$, vrečka $2\,\text{kg}$
**Iščemo:** porabljeno moko in ostanek

:::formula
Seštevanje in odštevanje: vejica pod vejico, manjkajoča mesta dopolni z ničlami.
:::

**Rešitev:**

1. Dopolnimo ničlo, da imata števili enako decimalk: $1{,}25 + 0{,}60$.
2. Seštejemo: $1{,}25 + 0{,}6 = 1{,}85$. Ocena $1 + 1 = 2$ se ujema.
3. Za ostanek zapišemo $2{,}00 - 1{,}85$, ker $2$ nima decimalk.
4. Odštejemo: $2 - 1{,}85 = 0{,}15$. Preizkus: $1{,}85 + 0{,}15 = 2$.
5. Odgovor: porabiš $1{,}85\,\text{kg}$ moke, ostane je $0{,}15\,\text{kg}$.

### Primer 2: množenje in deljenje z naravnim številom

Izračunaj $2{,}4 \cdot 1{,}5$ in $7{,}56 : 4$.

**Podatki:** zmnožek $2{,}4 \cdot 1{,}5$, količnik $7{,}56 : 4$
**Iščemo:** vrednosti obeh računov

:::formula
Množenje: decimalke zmnožka = decimalke obeh faktorjev skupaj. Deljenje z naravnim številom: vejico zapišemo v količnik, ko jo prečkamo.
:::

**Rešitev:**

1. Vejici spregledamo: $24 \cdot 15 = 360$.
2. Faktorja imata skupaj dve decimalki, zato je $2{,}4 \cdot 1{,}5 = 3{,}60 = 3{,}6$. Ocena: $2 \cdot 1{,}5 = 3$, malo več je $3{,}6$.
3. Deljenje: $7 : 4 = 1$, ostane $3$. Prečkamo vejico in jo zapišemo v količnik.
4. Spustimo $5$: $35 : 4 = 8$, ostane $3$. Spustimo $6$: $36 : 4 = 9$, ostane $0$.
5. Odgovor: $2{,}4 \cdot 1{,}5 = 3{,}6$ in $7{,}56 : 4 = 1{,}89$. Preizkus: $1{,}89 \cdot 4 = 7{,}56$.

### Primer 3 (težji): sok v kozarcih

V vrču je $1{,}8\,\text{l}$ soka. En kozarec drži $0{,}15\,\text{l}$. Koliko kozarcev napolniš? Vrč soka stane $3{,}60\,€$. Koliko stane en kozarec soka?

**Podatki:** sok $1{,}8\,\text{l}$, kozarec $0{,}15\,\text{l}$, cena vrča $3{,}60\,€$
**Iščemo:** število kozarcev in ceno enega kozarca

:::formula
Število kozarcev $= 1{,}8 : 0{,}15$, cena kozarca $= 3{,}60 : \text{število kozarcev}$
:::

**Rešitev:**

1. Delitelj $0{,}15$ ima dve decimalki, zato oba člena pomnožimo s $100$: $180 : 15$.
2. Delimo: $180 : 15 = 12$. Preizkus: $0{,}15 \cdot 12 = 1{,}8$.
3. Cena enega kozarca: $3{,}6 : 12$. Ker je $3 : 12 = 0$, v količnik zapišemo $0$ in vejico.
4. Spustimo $6$: $36 : 12 = 3$, torej $3{,}6 : 12 = 0{,}3$.
5. Odgovor: napolniš $12$ kozarcev, en kozarec soka stane $0{,}30\,€$.

### Primer 4: zdaj ti

Juho, ki je je $2{,}7\,\text{l}$, enakomerno razdeliš v $6$ krožnikov. Koliko juhe je v enem krožniku?

**Podatki:** juha $2{,}7\,\text{l}$, krožnikov $6$
**Iščemo:** juho v enem krožniku

:::formula
Deljenje z naravnim številom: $2{,}7 : 6$
:::

**Rešitev:**

1. Ocena: $3 : 6$ je pol, rezultat bo okoli $0{,}5\,\text{l}$.
2. $2 : 6 = 0$, zato v količnik zapišemo $0$, nato vejico.
3. Spustimo $7$: $27 : 6 = 4$, ostane $3$. Nadaljuj sam, nato preveri:

:::premisli
Kako končaš deljenje in koliko juhe je v krožniku?
---
Deljencu dopišemo ničlo: $30 : 6 = 5$, ostane $0$. V krožniku je $2{,}7 : 6 = 0{,}45\,\text{l}$ juhe. Preizkus: $0{,}45 \cdot 6 = 2{,}7$.
:::

## Pogoste napake

- **Poravnava po desnem robu.** Pri $12{,}75 + 3{,}4$ učenec podpiše $4$ pod $5$, kot je navajen pri naravnih številih, in dobi $13{,}09$. Tako je seštel stotinke z desetinkami. Pravilno: $12{,}75 + 3{,}40 = 16{,}15$, vejica pod vejico.
- **Premalo decimalk v zmnožku.** Pri $0{,}4 \cdot 0{,}3$ učenec misli: »Vsak faktor ima eno decimalko, zato jo ima tudi rezultat« in napiše $1{,}2$. Decimalke se seštejejo: $1 + 1 = 2$, torej $0{,}12$. Ocena pomaga: oba faktorja sta manjša od $1$, zato mora biti tudi zmnožek manjši od $1$.
- **»Množenje vedno poveča.«** Pri naravnih številih to drži, pri decimalnih ne. Pomnožiti s številom pod $1$ pomeni vzeti del: $8 \cdot 0{,}5 = 4$. Podobno deljenje s številom pod $1$ rezultat poveča.
- **Pozabljena ničla v količniku.** Pri $2{,}7 : 6$ učenec začne kar s $27 : 6$ in napiše $4{,}5$. Ker gre $6$ v $2$ ničkrat, mora količnik začeti z $0{,}$, torej $0{,}45$. Preizkus z množenjem napako takoj pokaže.
- **Pomnožen le delitelj.** Pri $6{,}3 : 0{,}7$ učenec delitelj spremeni v $7$, deljenca pa ne, in dobi $0{,}9$. Količnik ostane enak le, če oba člena pomnožimo z istim številom: $63 : 7 = 9$.

## Povzetek

- Decimalna števila seštevamo in odštevamo **vejica pod vejico**, manjkajoča mesta dopolnimo z ničlami.
- Pri množenju množimo kot naravni števili, v zmnožku ima število toliko decimalk, kot jih imata faktorja skupaj.
- Pri deljenju z naravnim številom delimo kot običajno in vejico zapišemo v količnik, ko jo prečkamo; ostanku dopisujemo ničle.
- Pri deljenju z decimalnim številom deljenec in delitelj pomnožimo z istim številom ($10$, $100$ ali $1000$), da je delitelj naravno število.
- Množenje z $10$, $100$, $1000$ premakne vejico v desno, deljenje v levo.
- Množenje s številom, manjšim od $1$, zmanjša, deljenje z njim poveča.
- Vedno ocenimo rezultat in ga po možnosti preverimo z obratno računsko operacijo.

## Drugače: Na sliki

Predstavljaj si kvadrat, ki je velik $1$. Razdeljen je na $10$ stolpcev, torej je en stolpec $0{,}1$. Če vsak stolpec razdeliš še na $10$ kvadratkov, je en kvadratek $0{,}01$ (stotinka).

Zdaj si oglej $0{,}3 \cdot 0{,}2$. Kvadrat razdelimo na $10$ vodoravnih in $10$ navpičnih pasov. Označimo $3$ stolpce in $2$ vrstici. V preseku je $3 \cdot 2 = 6$ kvadratkov, vsak je velik $0{,}01$. Torej je $0{,}3 \cdot 0{,}2 = 0{,}06$.

Slika pokaže, zakaj ima zmnožek **dve** decimalki: desetinka od desetinke je stotinka. Pokaže tudi, zakaj je zmnožek manjši od obeh faktorjev: presek je le majhen del kvadrata.

Pri seštevanju si predstavljaj številsko premico, na kateri so enote razdeljene na desetinke. $3{,}4 + 0{,}7$ pomeni skok od $3{,}4$ za sedem malih korakov. Pristanemo pri $4{,}1$.

## Drugače: Iz vsakdanjega življenja

**Denar.** Cene so decimalna števila z dvema decimalkama: $1{,}35\,€$ pomeni $1$ evro in $35$ centov.

Kupiš kruh za $1{,}35\,€$ in mleko za $0{,}89\,€$:

$$1{,}35 + 0{,}89 = 2{,}24$$

Skupaj plačaš $2{,}24\,€$. Če plačaš s $5\,€$, ti vrnejo $5{,}00 - 2{,}24 = 2{,}76\,€$.

**Množenje.** Trije enaki sladoledi po $1{,}80\,€$ stanejo $3 \cdot 1{,}80 = 5{,}40\,€$. Pomisli: $3 \cdot 180$ centov je $540$ centov.

**Deljenje.** Pica stane $9{,}60\,€$, štirje prijatelji si račun razdelijo na enake dele. Vsak da $9{,}60 : 4 = 2{,}40\,€$.

Denar je dober način za preverjanje: če računaš v centih (naravna števila) in nato vejico vrneš nazaj, dobiš isti rezultat.

## Drugače: Bolj natančno

Zakaj pravila delujejo? Decimalna števila lahko zapišemo kot desetiške ulomke z imenovalci $10$, $100$ ali $1000$.

**Množenje.** $0{,}3 \cdot 0{,}07 = \dfrac{3}{10} \cdot \dfrac{7}{100} = \dfrac{21}{1000} = 0{,}021$. Imenovalca se zmnožita: $10 \cdot 100 = 1000$, to pomeni tri decimalke. Zato seštejemo število decimalk.

**Seštevanje.** $0{,}4 + 0{,}25 = \dfrac{40}{100} + \dfrac{25}{100} = \dfrac{65}{100} = 0{,}65$. Stotinke lahko seštejemo le s stotinkami. Zato števili izenačimo z dopisovanjem ničel (vejica pod vejico).

**Deljenje.** Količnik se ne spremeni, če deljenec in delitelj pomnožimo z istim neničelnim številom: $4{,}8 : 0{,}6 = 48 : 6 = 8$. Če bi pomnožili le delitelj, bi delili z desetkrat večjim številom in dobili desetkrat manjši rezultat.

## Preveri se

? Katera trditev je pravilna?
- Pri množenju decimalnih števil pišemo vejico pod vejico.
~ Vejico pod vejico pišemo le pri seštevanju in odštevanju. Pri množenju štejemo decimalke.
+ Pri seštevanju decimalnih števil pišemo vejico pod vejico.
- Zmnožek ima toliko decimalk kot faktor z več decimalkami.
~ Decimalke obeh faktorjev se seštejejo: $0{,}4 \cdot 0{,}3 = 0{,}12$ ima dve.
- Pri deljenju z decimalnim številom z $10$ pomnožimo le delitelj.
~ Če pomnožiš le delitelj, se količnik spremeni. Pomnožiti moraš oba člena.
> Vejica pod vejico poskrbi, da so enice pod enicami, desetinke pod desetinkami in stotinke pod stotinkami.

? Lan je zapisal: $0{,}4 \cdot 0{,}3 = 1{,}2$. Kje je napaka?
- Napake ni, vsak faktor ima eno decimalko in rezultat tudi.
~ Decimalk ne prepišemo, ampak jih seštejemo. Zmnožek dveh števil pod $1$ ne more biti večji od $1$.
+ Zmnožek mora imeti dve decimalki, pravilno je $0{,}12$.
- Lan je narobe zmnožil, pravilno je $0{,}7$.
~ $0{,}7$ je vsota $0{,}4 + 0{,}3$, ne zmnožek.
- Zmnožek mora imeti tri decimalke, pravilno je $0{,}012$.
~ Faktorja imata skupaj $1 + 1 = 2$ decimalki, ne tri.
> $4 \cdot 3 = 12$, decimalki sta skupaj dve, zato $0{,}4 \cdot 0{,}3 = 0{,}12$.

? Kateri račun ima največji rezultat?
- $5 \cdot 0{,}8$
~ Množenje s številom pod $1$ zmanjša: $5 \cdot 0{,}8 = 4$.
- $5 + 0{,}8$
~ Vsota je $5{,}8$, kar je res več kot $5$, a deljenje z $0{,}8$ da še več.
+ $5 : 0{,}8$
- $5 - 0{,}8$
~ Razlika je $4{,}2$, manj kot $5$.
> $5 : 0{,}8 = 50 : 8 = 6{,}25$. Deljenje s številom pod $1$ rezultat poveča, zato je to največ.

? Koliko je $6{,}3 : 0{,}7$?
- $0{,}9$
~ Pomnožil si le delitelj: $6{,}3 : 7 = 0{,}9$. Pomnožiti moraš oba člena.
- $90$
~ Deljenec si pomnožil s $100$, delitelj pa z $10$. Oba moraš pomnožiti z istim številom.
+ $9$
> Deljenec in delitelj pomnožimo z $10$: $63 : 7 = 9$. Preizkus: $9 \cdot 0{,}7 = 6{,}3$.

? Kilogram jabolk za zavitek stane $1{,}60\,€$. Koliko plačaš za $2{,}5\,\text{kg}$?
- $4{,}10\,€$
~ To je vsota $1{,}6 + 2{,}5$. Ceno za več kilogramov dobiš z množenjem.
- $40\,€$
~ Zmnožek $16 \cdot 25 = 400$ ima premalo decimalk. Faktorja imata skupaj dve.
+ $4\,€$
- $0{,}40\,€$
~ Zapisal si tri decimalke namesto dveh. Ocena: več kot $2\,\text{kg}$ po $1{,}6\,€$ mora stati več kot $3\,€$.
> $16 \cdot 25 = 400$, dve decimalki: $1{,}6 \cdot 2{,}5 = 4{,}00 = 4$. Plačaš $4\,€$.

:::simboli
\text{število kozarcev} | koliko kozarcev napolnimo iz vrča soka | \text{število kozarcev} = 1{,}8 : 0{,}15 | | prostornina vrča : prostornina kozarca
:::
