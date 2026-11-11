---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na začetku 20. stoletja sta si dva matematika zastavila vprašanje, ki se zdi bolj za igralce kot za znanstvenike. Ameriški matematik Charles Bouton je popolnoma razrešil igro z jemanjem predmetov s kupčkov in ji dal ime **Nim**: za vsak položaj vnaprej pove, kdo bo zmagal. Nemški matematik Ernst Zermelo pa se je spraševal o šahu: ali ima eden od igralcev pot do zmage ne glede na to, kako igra nasprotnik?

Obema je šlo za isto spoznanje: če v igri ni sreče in oba igralca vidita vse, lahko izid **izračunaš** vnaprej. Kasneje so na tej ideji gradili prve računalniške igralce.

Na glasbenem taboru se Ana in Bor med odmorom igrata z bobnom: izmenično zaigrata $1$ ali $2$ udarca, kdor zaigra deseti udarec, zmaga. Ana začne. Ali lahko zmaga, kako dobro koli igra Bor? Na tekmovanjih so take igre pogoste, odgovor pa je strategija, ne sreča.

## Razlaga

**1. En primer do konca.** Rešimo igro z bobnom. Namesto odigranih udarcev štejemo, koliko udarcev je **še ostalo** do desetega. Začnemo od konca, kjer je vse jasno.

- Ostalo je $0$: nasprotnik je pravkar zaigral deseti udarec. Igralec na potezi je izgubil.
- Ostal je $1$ ali $2$: igralec na potezi zaigra vse in zmaga.
- Ostali so $3$: zaigraš $1$ in pustiš $2$, ali zaigraš $2$ in pustiš $1$. Obakrat nasprotnik zmaga. Izgubil si.
- Ostali so $4$ ali $5$: zaigraš toliko, da ostanejo $3$. Zdaj je v slabem položaju nasprotnik.

Na številski premici označimo s **P** položaj poraza in z **Z** položaj zmage, vedno za igralca, ki je **na potezi**:

:::risba premica
opis: Številska premica od 0 do 10 za število udarcev, ki so še ostali. Pri 0, 3, 6 in 9 je P (položaj poraza, prazen krožec), pri 1, 2, 4, 5, 7, 8 in 10 je Z (položaj zmage, poln krožec), vedno za igralca na potezi.
od: 0
do: 10
točka: 0 | P | prazna rdeča
točka: 1 | Z | zelena
točka: 2 | Z | zelena
točka: 3 | P | prazna rdeča
točka: 4 | Z | zelena
točka: 5 | Z | zelena
točka: 6 | P | prazna rdeča
točka: 7 | Z | zelena
točka: 8 | Z | zelena
točka: 9 | P | prazna rdeča
točka: 10 | Z | zelena
podnapis: Število pove, koliko udarcev je še ostalo. P: poraz (prazen krožec), Z: zmaga (poln krožec).
:::

Na začetku ostane $10$, to je **Z**. Ana zaigra $1$ udarec in Boru pusti $9$. Nato vsakič dopolni Borovo potezo do $3$: če Bor zaigra $1$, Ana $2$; če Bor zaigra $2$, Ana $1$. Ostanki gredo $9, 6, 3, 0$, in deseti udarec je Anin.

:::premisli
Kdo zmaga, če zmaga dvanajsti udarec namesto desetega? Napovej s premico, preden pogledaš.
---
Bor. Število $12$ je večkratnik števila $3$, zato je to položaj **P** za Ano. Kar koli zaigra, Bor dopolni do $3$ in ji spet pusti večkratnik števila $3$.
:::

**2. Pravili za položaje.** Iz primera preberemo dve pravili, ki veljata za vsako igro brez sreče, ki se gotovo konča:

- Položaj je **zmagovalni (Z)**, če obstaja *vsaj ena* poteza, ki nasprotniku pusti položaj **P**.
- Položaj je **izgubljen (P)**, če *vse* poteze vodijo v položaje **Z**. Tudi položaj brez poteze je **P**, kadar zmaga tisti, ki naredi zadnjo potezo.

**Strategija** je navodilo, kaj narediti v vsakem položaju. Zmagovalna strategija pomeni: nasprotniku vedno puščaj položaje **P**.

**3. Posplošitev.** Namesto udarcev pogosto jemljemo žetone s kupčka. Če smeš vzeti od $1$ do $k$ žetonov in zmaga, kdor vzame zadnjega, so položaji **P** natanko večkratniki števila $k + 1$. Kar koli vzame nasprotnik, ti dopolniš do $k + 1$. V simulaciji spodaj (Igra z žetoni: najdi zmagovalno strategijo) nastavi $16$ žetonov in največ $3$ na potezo, nato vklopi »pokaži strategijo«. Opazi, da so izgubljeni položaji razmaknjeni za $4$.

**4. Simetrija.** Nekatere igre rešiš brez tabele. Recimo, da sta na mizi dva **enaka kupčka**, igralec pa na potezi vzame poljubno število žetonov z enega kupčka. Drugi igralec vsakič vzame enako število z drugega kupčka. Tako sta kupčka po njegovi potezi spet enaka. Če ima prvi še potezo, jo ima tudi drugi; zadnji žeton zato vzame drugi. Temu rečemo **zrcalna strategija**.

:::premisli
Zakaj zrcalna strategija ne deluje, če sta kupčka različna, na primer $5$ in $3$, in je na potezi prvi igralec?
---
Ker zrcali tisti, ki *prejme* enaka kupčka. Pri $5$ in $3$ prvi vzame $2$ z večjega kupčka, naredi $3$ in $3$ in od tedaj zrcali sam. Zrcalna strategija tu pripada prvemu igralcu.
:::

**5. Postopek.** Končni položaj → nazaj označuj **P** in **Z** → poišči vzorec ali simetrijo → opiši potezo, ki nasprotniku vedno pusti **P**.

## Rešeni primeri

### Primer 1 (lažji): $21$ udarcev

Dva bobnarja izmenično zaigrata $1$, $2$ ali $3$ udarce. Kdor zaigra enaindvajseti udarec, zmaga. Kdo ima zmagovalno strategijo in kakšna je prva poteza?

**Podatki:** $21$ udarcev, na potezo $1$ do $3$ udarci, zadnji udarec zmaga
**Iščemo:** kdo zmaga in s kakšno strategijo

:::formula
Položaji **P** so večkratniki števila $k + 1$; tu je $k = 3$, torej večkratniki števila $4$.
:::

**Rešitev:**

1. Izgubljeni položaji (ostanek udarcev): $0, 4, 8, 12, 16, 20$.
2. Na začetku ostane $21$, to ni večkratnik števila $4$, zato je položaj **Z** za prvega.
3. Prvi zaigra $21 - 20 = 1$ udarec in nasprotniku pusti $20$.
4. Nato vedno dopolni nasprotnikovo potezo do $4$: ostanki so $16, 12, 8, 4, 0$.
5. Odgovor: zmaga prvi bobnar; najprej zaigra $1$ udarec, nato vsakič toliko, da je v krogu skupaj $4$.

### Primer 2: dva kupčka not

Na stojalu sta dva kupčka notnih listov: $9$ in $6$. Igralca izmenično vzameta poljubno število listov (vsaj enega) z **enega** kupčka. Kdor vzame zadnji list, zmaga. Kdo zmaga?

**Podatki:** kupčka $9$ in $6$, ena poteza vzame $1$ ali več listov z enega kupčka, zadnji list zmaga
**Iščemo:** zmagovalca in njegovo strategijo

:::formula
Dva enaka kupčka sta položaj **P** za igralca na potezi (zrcalna strategija nasprotnika).
:::

**Rešitev:**

1. Kupčka nista enaka, zato prvi lahko naredi enaka: z večjega kupčka vzame $9 - 6 = 3$ liste.
2. Drugi zdaj dobi $6$ in $6$, to je položaj **P**.
3. Kar drugi vzame z enega kupčka, prvi vzame enako z drugega. Po vsaki potezi prvega sta kupčka enaka.
4. Ko drugi izprazni en kupček, prvi izprazni drugega in vzame zadnji list.
5. Odgovor: zmaga prvi igralec; najprej vzame $3$ liste z večjega kupčka, nato zrcali.

### Primer 3 (težji): igra s tipkami

Na igrači je vrsta $15$ tipk, oštevilčenih od $1$ do $15$. Igralca izmenično pritisneta **eno** tipko ali **dve sosednji** tipki. Pritisnjena tipka ostane spuščena in je ne smeš več pritisniti. Kdor ne more več igrati, izgubi. Kdo ima zmagovalno strategijo?

**Podatki:** $15$ tipk v vrsti; poteza: ena tipka ali dve sosednji prosti tipki; brez poteze izgubiš
**Iščemo:** zmagovalca in njegovo strategijo

:::formula
Simetrija: prvi ustvari dve enaki skupini, nato tipko $t$ zrcali na tipko $16 - t$.
:::

**Rešitev:**

1. Tabela položajev bi bila predolga, zato iščemo simetrijo okrog srednje tipke $8$.
2. Prvi pritisne tipko $8$. Ostaneta dve ločeni skupini: tipke $1$ do $7$ in $9$ do $15$, po $7$ tipk.
3. Če drugi pritisne tipko $t$, prvi pritisne $16 - t$. Če drugi pritisne sosednji $t$ in $t + 1$, prvi pritisne $15 - t$ in $16 - t$. Te tipke so na drugi strani in še proste, ker je položaj pred potezo drugega simetričen.
4. Po vsaki potezi prvega je položaj spet simetričen, zato ima prvi vedno odgovor. Brez poteze ostane drugi.
5. Odgovor: zmaga prvi igralec; začne s srednjo tipko in nato zrcali. (Pri $14$ tipkah bi prvi pritisnil srednji sosednji tipki $7$ in $8$.)

### Primer 4 – zdaj ti: zadnji udarec izgubi

Pravila so kot v primeru 1, a z eno spremembo: kdor zaigra **zadnji** udarec, **izgubi**. Udarcev je $22$, na potezo $1$ do $3$.

**Podatki:** $22$ udarcev, na potezo $1$ do $3$, zadnji udarec izgubi
**Iščemo:** prvo potezo zmagovalca

:::formula
Cilj: nasprotniku pustiti natanko $1$ udarec. Izgubljeni položaji so za $4$ narazen.
:::

**Rešitev:**

1. Če nasprotniku pustiš $1$ udarec, ga mora zaigrati in izgubi. Torej je ostanek $1$ položaj **P**.
2. Ker dopolnjuješ do $4$, so položaji **P**: $1, 5, 9, 13, 17, 21$.
3. Dokončaj sam:

:::premisli
Ali zmaga prvi? Koliko udarcev zaigra na začetku?
---
Da. Iz $22$ zaigra $22 - 21 = 1$ udarec in nasprotniku pusti $21$, ki je položaj **P**. Nato vsakič dopolni do $4$; nasprotniku na koncu ostane en sam udarec.
:::

## Pogoste napake

- **Pohlepna igra.** »Vzamem čim več, da bom prej pri cilju.« Ni pomembno, koliko vzameš, ampak kakšen položaj pustiš. Pri $10$ udarcih in potezah $1$ ali $2$ Ana z $2$ udarcema pusti $8$, kar je **Z** za Bora.
- **Večkratniki $k$ namesto $k + 1$.** Kdor sme vzeti do $3$, misli, da so izgubljeni večkratniki števila $3$. Dopolnjuješ pa do $k + 1 = 4$, ker nasprotnik vzame $1$ do $3$, ti pa ostanek do $4$.
- **Obrnjeni pravili.** Položaj ni zmagovalni, če lahko greš v **Z**. Zmagovalni je, če lahko greš v **P**; izgubljen je šele, če *vse* poteze vodijo v **Z**.
- **Za koga velja oznaka.** **P** in **Z** veljata za igralca, ki je *na potezi*, ne za tistega, ki je pravkar igral. Dober položaj je, ko nasprotnik prejme **P**.
- **Zrcaljenje brez simetrije.** Zrcalna strategija zahteva simetrijo *po tvoji potezi*. Če začneš ti in simetrije ni, jo najprej ustvari; če je že simetrično in si na potezi ti, zrcali nasprotnik.

## Povzetek

- Igre brez sreče, kjer oba vidita vse, lahko rešiš vnaprej.
- **P** (izgubljen) in **Z** (zmagovalni) veljata za igralca na potezi.
- **Z**: obstaja poteza v **P**. **P**: vse poteze vodijo v **Z** (ali poteze ni, če zadnja poteza zmaga).
- Analiza nazaj: od konca proti začetku označuj **P** in **Z**, nato poišči vzorec.
- Jemanje $1$ do $k$, zadnji zmaga: **P** so večkratniki $k + 1$; dopolnjuješ do $k + 1$.
- Zadnji izgubi: **P** so $1, k + 2, 2(k + 1) + 1, \dots$ (ostanek $1$ pri deljenju s $k + 1$).
- Dva enaka kupčka sta **P**: nasprotnik zrcali. Pri različnih kupčkih ju izenači.
- Simetrija na vrsti ali plošči: zasedi sredino, nato zrcali.

## Drugače: Z analogijo

Predstavljaj si skladbo, ki se konča na točno določeni noti. Glasbenik, ki ve, kam pade konec, sestavi fraze tako, da sklepni ton pripade njemu. Položaji **P** so kot »težke dobe« v taktu: vsak $4$. udarec. Kdor zna vedno pristati na težki dobi, določi konec skladbe.

Zrcalna strategija je kot odmev. Kar zaigra prvi, odmev ponovi na drugi strani dvorane. Odmev nikoli ne ostane brez »poteze«, ker vedno samo ponavlja. Zadnji zvok v dvorani je zato odmev.

## Drugače: Bolj natančno

Zakaj ima vsak položaj natanko eno oznako, **P** ali **Z**? Igra se gotovo konča, zato ima vsak položaj le končno mnogo nadaljevanj. Končne položaje označimo takoj. Vsakemu drugemu položaju določimo oznako, ko so označeni vsi položaji, v katere lahko gremo: če je med njimi vsaj en **P**, je **Z**, sicer **P**. Ker gremo vedno korak nazaj, pridemo do začetka.

To je jedro Zermelovega razmisleka: v končni igri brez sreče in brez remija ima eden od igralcev zmagovalno strategijo. Pri šahu je remi možen, zato velja: eden od igralcev si lahko zagotovi zmago, ali pa si oba lahko zagotovita vsaj remi. Kateri od teh primerov velja za šah, ne ve nihče, ker je položajev preveč.

Za igro z več kupčki je Bouton odkril pravilo z dvojiškim zapisom števil. Za dva kupčka se poenostavi v to, kar že znaš: položaj je **P** natanko tedaj, ko sta kupčka enaka.

## Preveri se

? Igra: vzameš $1$ ali $2$ žetona, kdor vzame zadnjega, zmaga. Kateri položaj (število žetonov pred tvojo potezo) **ne sodi** med ostale?
- $6$
~ $6$ je večkratnik števila $3$, zato je izgubljen kot ostali trije.
- $9$
~ $9$ je večkratnik števila $3$, zato je izgubljen kot ostali trije.
+ $8$
- $12$
~ $12$ je večkratnik števila $3$, zato je izgubljen kot ostali trije.
> Položaji **P** so večkratniki števila $1 + 2 = 3$: $6$, $9$ in $12$. Pri $8$ vzameš $2$ in nasprotniku pustiš $6$, zato je $8$ položaj **Z**.

? Na mizi je $32$ žetonov. Izmenično vzameta $1$ do $4$ žetone, zadnji žeton zmaga. Koliko žetonov naj vzame prvi?
- Prvi nima zmagovalne poteze.
~ Tako sklepaš, če misliš, da so izgubljeni večkratniki števila $4$. Dopolnjuješ do $k + 1 = 5$.
- $4$
~ Pohlepna poteza. Pustila bi $28$, kar ni večkratnik števila $5$, zato bi nasprotnik vzel $3$ in ti pustil $25$.
+ $2$
- $1$
~ Pustila bi $31$, kar ni večkratnik števila $5$; nasprotnik vzame $1$ in pusti $30$.
> Izgubljeni so večkratniki števila $5$. Ker $32 = 30 + 2$, prvi vzame $2$ in pusti $30$, nato vsakič dopolni do $5$.

? Kupčka sta $5$ in $5$. Igralca smeta vzeti poljubno število z enega kupčka, zadnji zmaga. Začne Ana. Kaj je vzrok, da zmaga Bor?
- Bor ima na voljo več potez kot Ana.
~ Oba imata enaka pravila. Odloča položaj, ki ga dobi igralec, ne število možnosti.
+ Po vsaki Borovi potezi sta kupčka spet enaka, zato ima Bor vedno odgovor in vzame zadnji žeton.
- Ana mora vzeti cel kupček naenkrat.
~ Ana sme vzeti poljubno število. Kar koli vzame, Bor vzame enako z drugega kupčka.
> Enaka kupčka sta položaj **P** za Ano. Bor zrcali, zato je po njegovi potezi položaj spet simetričen in zadnji žeton vzame on.

? Igra: vzameš $1$ ali $2$, zadnji zmaga. Luka analizira položaje. Kateri korak je napačen?
- Korak 1: $0$ je **P**, ker igralec na potezi nima poteze.
~ Ta korak je pravilen: ko žetonov ni, je nasprotnik vzel zadnjega in zmagal.
- Korak 2: $1$ in $2$ sta **Z**, ker lahko vzameš vse.
~ Ta korak je pravilen: z eno potezo pustiš $0$, ki je **P**.
- Korak 3: $3$ je **P**, ker obe potezi vodita v **Z**.
~ Ta korak je pravilen: iz $3$ greš le v $2$ ali $1$, oba sta **Z**.
+ Korak 4: $4$ je **P**, ker lahko z eno potezo prideš v $3$, ki je **P**.
> Če obstaja poteza v **P**, je položaj **Z**. Iz $4$ vzameš $1$, nasprotniku pustiš $3$ in zmagaš.

? Z bratom štejeta na glas od $1$ naprej. Izmenično rečeta $1$, $2$ ali $3$ zaporedna števila. Kdor reče $21$, izgubi. Ali je bolje začeti?
- Da, prvi lahko vedno zmaga.
~ Tako bi bilo, če bi $21$ zmagalo. Ker $21$ izgubi, ciljaš na $20$, in tega prvi ne more vsiliti.
+ Ne, zmaga drugi, če vsakič reče do naslednjega večkratnika števila $4$.
- Odloča sreča, strategije ni.
~ V igri ni sreče in oba vidita vse, zato ima eden od igralcev zmagovalno strategijo.
> Kdor reče $20$, zmaga. Ciljna števila so $4, 8, 12, 16, 20$. Prvi lahko reče največ do $3$, zato drugi reče do $4$ in nato vsakič dopolni do $4$.

:::simboli
k | največje število žetonov v eni potezi | | | položaji P so večkratniki k + 1
t | številka tipke, ki jo pritisne drugi igralec | | | prvi igralec odgovori s tipko 16 − t
:::
