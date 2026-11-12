---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na bolšjem sejmu je Eva za $120\,€$ kupila verižico. Prodajalec je prisegal, da je iz čistega zlata. Doma se je spomnila, da nima ne kisline ne zlatarja, ima pa kuhinjsko tehtnico in merilni valj od brata. Ali lahko s tem ugotovi, ali je naredila dober nakup?

Lahko. Vsaka čista snov ima svoje **lastnosti**, po katerih jo prepoznaš: gostoto, tališče, vrelišče, topnost v vodi, barvo, magnetnost. Iste lastnosti uporabimo tudi, ko želimo **zmes** (snov iz več čistih snovi) razstaviti na sestavine. Pri tekmovalnih nalogah se skoraj vedno vprašaš eno: v kateri lastnosti se sestavini razlikujeta?

## Razlaga

**1. Gostota na številski premici.** Predstavljaj si kocke z robom $1\,\mathrm{cm}$ iz različnih snovi. Na tehtnici kažejo različne mase. Kocka vode ima $1\,\mathrm{g}$, kocka aluminija $2{,}7\,\mathrm{g}$, kocka zlata kar $19{,}3\,\mathrm{g}$. Masa, ki jo ima $1\,\mathrm{cm^3}$ snovi, je **gostota** te snovi.

:::risba premica
opis: Številska premica gostot od 0 do 20 gramov na kubični centimeter. Voda je pri 1, aluminij pri 2,7, železo pri 7,9, srebro pri 10,5 in zlato pri 19,3.
od: 0
do: 20
korak: 1
oznake: 5
točka: 1 | voda | modra
točka: 2,7 | Al | siva
točka: 7,9 | Fe | siva
točka: 10,5 | Ag | siva
točka: 19,3 | Au | oranžna
:::

Na premici so voda, aluminij (Al), železo (Fe), srebro (Ag) in zlato (Au), gostote v $\mathrm{g/cm^3}$. Zlato je skoraj dvakrat gostejše od srebra. Zato zlata verižica pri enaki masi zavzame precej manj prostora kot ponaredek.

Gostota je **lastnost snovi**, ne predmeta. Majhen žebelj in velik železni tram imata enako gostoto, čeprav je tram veliko težji. Če kos prerežeš, se masa in prostornina razpolovita, gostota ostane.

Premica pove še nekaj: telo plava na tekočini, ki ima večjo gostoto od njega. Olje ($0{,}9\,\mathrm{g/cm^3}$) je levo od vode, zato plava na njej. Železo je desno, zato potone.

:::premisli
Led ima gostoto $0{,}92\,\mathrm{g/cm^3}$, alkohol (etanol) $0{,}79\,\mathrm{g/cm^3}$. Kaj napoveš: ali kocka ledu v kozarcu alkohola plava ali potone?
---
Potone. Gostota ledu je večja od gostote alkohola, zato je led na premici desno od alkohola. V vodi pa led plava, ker je voda gostejša od njega.
:::

**2. Topnost na grafu.** Ko sol vmešaš v vodo, nastane **raztopina**: sol je **topljenec**, voda **topilo**. Soli pa ne moreš raztopiti poljubno veliko. Ko se pri dani temperaturi ne raztopi nič več, je raztopina **nasičena**. **Topnost** je masa snovi, ki se raztopi v $100\,\mathrm{g}$ vode do nasičenja pri izbrani temperaturi.

:::risba graf
opis: Graf topnosti v gramih na 100 gramov vode v odvisnosti od temperature od 0 do 80 stopinj Celzija. Kalijev nitrat (polna modra črta) ima topnost 13 pri 0 °C, 32 pri 20 °C, 64 pri 40 °C, 110 pri 60 °C in 169 pri 80 °C. Natrijev klorid (črtkana oranžna črta) ima skoraj stalno topnost: 36 pri 0, 20 in 40 °C, 37 pri 60 °C in 38 pri 80 °C.
x: 0 .. 80 | 20 | T (°C)
y: 0 .. 180 | 20 | g na 100 g vode
črta: 0; 13 -> 20; 32 -> 40; 64 -> 60; 110 -> 80; 169 | modra
črta: 0; 36 -> 20; 36 -> 40; 36 -> 60; 37 -> 80; 38 | oranžna črtkano
točka: 20; 32 | 32 | desno | modra
točka: 60; 110 | 110 | levo | modra
točka: 80; 169 | 169 | levo | modra
napis: 40; 72 | KNO₃ | levo | modra
napis: 70; 40 | NaCl | nad | oranžna
:::

Graf beri tako: poišči temperaturo na vodoravni osi, pojdi navpično do krivulje in odčitaj topnost. Pri $20\,°\mathrm{C}$ se v $100\,\mathrm{g}$ vode raztopi $32\,\mathrm{g}$ kalijevega nitrata ($\mathrm{KNO_3}$) ali $36\,\mathrm{g}$ kuhinjske soli ($\mathrm{NaCl}$). Pri $80\,°\mathrm{C}$ pa kar $169\,\mathrm{g}$ kalijevega nitrata in le $38\,\mathrm{g}$ soli.

Strma krivulja pomeni, da se topnost s temperaturo močno spreminja. Če vročo nasičeno raztopino $\mathrm{KNO_3}$ ohladiš, voda ne more več zadržati vsega topljenca. Presežek se izloči kot kristali. Temu postopku rečemo **kristalizacija s hlajenjem**.

:::premisli
Imaš nasičeno raztopino kuhinjske soli pri $80\,°\mathrm{C}$. Ali dobiš veliko kristalov, če jo ohladiš na $20\,°\mathrm{C}$? Kako bi sol pridobil drugače?
---
Ne, krivulja $\mathrm{NaCl}$ je skoraj vodoravna, zato se izloči le okoli $2\,\mathrm{g}$ na $100\,\mathrm{g}$ vode. Sol dobiš z izparevanjem vode, kot v solinah.
:::

**3. Tabela postopkov.** Vsak postopek izkorišča eno razliko v lastnostih:

| razlika | postopek | primer |
|---|---|---|
| ena snov se ne raztopi | filtracija | pesek iz vode |
| gostota, tekočini se ne mešata | lij ločnik, dekantiranje | olje in voda |
| vrelišče | destilacija | čista voda iz morske |
| topnost pri različni temperaturi | kristalizacija | $\mathrm{KNO_3}$ iz raztopine |
| magnetnost | magnet | železni opilki iz peska |
| hitrost potovanja po papirju | kromatografija | barvila v flomastru |

Pri filtraciji ostane na filtrirnem papirju trdna snov, skozenj steče **filtrat**. Raztopljena sol gre skozi filter skupaj z vodo, saj so njeni delci premajhni. Pri **dekantiranju** zgornjo plast previdno odliješ, v **liju ločniku** pa spodnjo plast izpustiš skozi pipo. Pri **destilaciji** zmes segrevamo v bučki. Snov z nižjim vreliščem izpari, v hladilniku se para spet utekočini in kaplja v **predložko** (posodo, kamor zbiramo čisto tekočino).

V simulaciji spodaj (»Ločevanje z destilacijo«) se loči nafta na **frakcije**, to so skupine snovi s podobnim vreliščem. Pare se dvigajo po visoki koloni in se utekočinijo na različnih višinah. Znižaj temperaturo peči na $250\,°\mathrm{C}$ in opazuj, katere frakcije ne dobiš več. Opazi, da se snovi z nižjim vreliščem zberejo višje v koloni.

Zmes iz treh ali več snovi ločuješ v več korakih. Pravilo: najprej odstrani, kar gre brez vode (magnet), nato raztopi, filtriraj in na koncu izpari.

**4. Na koncu še simboli.** Gostoto izračunaš iz mase in prostornine:

$$\rho = \frac{m}{V}$$

Pri raztopinah velja, da se masa ohrani: masa raztopine je vsota mase vode in mase topljenca, $m_r = m_v + m_s$. Delež topljenca v raztopini je **masni delež** $w = \frac{m_s}{m_r}$. V nasičeni raztopini je na vsakih $100\,\mathrm{g}$ vode toliko gramov topljenca, kolikor znaša topnost.

## Rešeni primeri

### Primer 1: Evina verižica

Eva stehta verižico: $38{,}6\,\mathrm{g}$. V merilni valj nalije vodo do oznake $50{,}0\,\mathrm{mL}$ in vanjo spusti verižico; gladina se dvigne na $54{,}5\,\mathrm{mL}$. Ali je verižica iz zlata ($19{,}3\,\mathrm{g/cm^3}$)?

**Podatki:** $m = 38{,}6\,\mathrm{g}$; $V_1 = 50{,}0\,\mathrm{mL}$; $V_2 = 54{,}5\,\mathrm{mL}$; $\rho_\text{zlato} = 19{,}3\,\mathrm{g/cm^3}$; cena $120\,€$
**Iščemo:** gostoto verižice $\rho$

:::formula
$V = V_2 - V_1$, nato $\rho = \dfrac{m}{V}$
:::

**Rešitev:**

1. Prostornina verižice je dvig gladine: $54{,}5 - 50{,}0 = 4{,}5\,\mathrm{mL} = 4{,}5\,\mathrm{cm^3}$.
2. Gostota: $\rho = \frac{38{,}6\,\mathrm{g}}{4{,}5\,\mathrm{cm^3}} \approx 8{,}6\,\mathrm{g/cm^3}$.
3. Na premici je to med železom in srebrom, daleč od zlata. Zlata verižica z enako maso bi imela le $\frac{38{,}6}{19{,}3} = 2\,\mathrm{cm^3}$.
4. Odgovor: verižica ni iz zlata. Gostota $8{,}6\,\mathrm{g/cm^3}$ ustreza medenini (zlitini bakra in cinka), zato Eva za $120\,€$ ni naredila dobrega nakupa.

### Primer 2: slanica za kumarice

Tina v trgovini kupi $1\,\mathrm{kg}$ kuhinjske soli za $0{,}60\,€$. Za vlaganje kumaric potrebuje nasičeno raztopino iz $250\,\mathrm{g}$ vode pri $20\,°\mathrm{C}$. Koliko soli raztopi, koliko stane ta sol in kolikšen je masni delež soli v slanici?

**Podatki:** $m_v = 250\,\mathrm{g}$; topnost $\mathrm{NaCl}$ pri $20\,°\mathrm{C}$: $36\,\mathrm{g}$ na $100\,\mathrm{g}$ vode; cena $0{,}60\,€$ za $1000\,\mathrm{g}$
**Iščemo:** $m_s$, ceno soli, masni delež $w$

:::formula
$m_s = \dfrac{m_v}{100\,\mathrm{g}} \cdot 36\,\mathrm{g}$, $m_r = m_v + m_s$, $w = \dfrac{m_s}{m_r}$
:::

**Rešitev:**

1. Vode je $2{,}5$-krat več kot $100\,\mathrm{g}$, zato se raztopi $2{,}5$-krat več soli: $36 \cdot 2{,}5 = 90\,\mathrm{g}$.
2. Cena: $\frac{90}{1000} \cdot 0{,}60\,€ = 0{,}054\,€$, okoli $5$ centov.
3. Masa raztopine: $250 + 90 = 340\,\mathrm{g}$, saj se masa pri raztapljanju ohrani.
4. Masni delež: $w = \frac{90}{340} \approx 0{,}265 = 26{,}5\,\%$.
5. Odgovor: Tina raztopi $90\,\mathrm{g}$ soli za približno $5$ centov; slanica ima $26{,}5\,\%$ soli.

### Primer 3: čiščenje solitra

Tim kupi poceni tehnični kalijev nitrat (soliter). V vrečki je $150\,\mathrm{g}$ $\mathrm{KNO_3}$ in $10\,\mathrm{g}$ $\mathrm{NaCl}$ kot nečistoča. Vse skupaj raztopi v $100\,\mathrm{g}$ vode pri $80\,°\mathrm{C}$ in raztopino ohladi na $20\,°\mathrm{C}$. Koliko čistih kristalov $\mathrm{KNO_3}$ dobi? Koliko so vredni, če čisti $\mathrm{KNO_3}$ v trgovini stane $6\,€$ za $100\,\mathrm{g}$?

**Podatki:** $m(\mathrm{KNO_3}) = 150\,\mathrm{g}$, $m(\mathrm{NaCl}) = 10\,\mathrm{g}$, $m_v = 100\,\mathrm{g}$; topnosti z grafa: $\mathrm{KNO_3}$ $169\,\mathrm{g}$ pri $80\,°\mathrm{C}$ in $32\,\mathrm{g}$ pri $20\,°\mathrm{C}$, $\mathrm{NaCl}$ $38\,\mathrm{g}$ pri $80\,°\mathrm{C}$ in $36\,\mathrm{g}$ pri $20\,°\mathrm{C}$; cena $6\,€$ za $100\,\mathrm{g}$
**Iščemo:** maso kristalov in njihovo vrednost

:::formula
masa kristalov $=$ raztopljena masa $-$ topnost pri nižji temperaturi (za $100\,\mathrm{g}$ vode)
:::

**Rešitev:**

1. Pri $80\,°\mathrm{C}$ se raztopi vse: $150 < 169$ in $10 < 38$.
2. Pri $20\,°\mathrm{C}$ voda zadrži le $32\,\mathrm{g}$ $\mathrm{KNO_3}$, zato se izloči $150 - 32 = 118\,\mathrm{g}$.
3. $\mathrm{NaCl}$ ostane raztopljen, ker je $10\,\mathrm{g}$ manj od $36\,\mathrm{g}$. Kristali so zato čisti.
4. Vrednost: $\frac{118}{100} \cdot 6\,€ = 7{,}08\,€$.
5. Odgovor: Tim dobi $118\,\mathrm{g}$ čistega $\mathrm{KNO_3}$, vrednega približno $7\,€$. Nečistoča in $32\,\mathrm{g}$ $\mathrm{KNO_3}$ ostanejo v raztopini.

### Primer 4 – zdaj ti: zmes s police

Učiteljica pripravi $50\,\mathrm{g}$ zmesi železnih opilkov, peska in kuhinjske soli. Z magnetom pobereš $8\,\mathrm{g}$ opilkov. Ostanek raztopiš v vodi in prefiltriraš; posušen pesek na filtru ima $30\,\mathrm{g}$. Koliko je soli in kolikšen je njen masni delež v zmesi?

**Podatki:** $m_\text{zmes} = 50\,\mathrm{g}$, $m(\mathrm{Fe}) = 8\,\mathrm{g}$, $m(\text{pesek}) = 30\,\mathrm{g}$
**Iščemo:** maso soli in njen masni delež $w$

:::formula
$m(\text{sol}) = m_\text{zmes} - m(\mathrm{Fe}) - m(\text{pesek})$, $w = \dfrac{m(\text{sol})}{m_\text{zmes}}$
:::

**Rešitev:**

1. Sol je v filtratu, saj je raztopljena in gre skozi filter.
2. Izračunaj maso soli in masni delež sam, nato preveri:

:::premisli
Koliko soli je v zmesi in kolikšen je njen delež?
---
$m(\text{sol}) = 50 - 8 - 30 = 12\,\mathrm{g}$, $w = \frac{12}{50} = 0{,}24 = 24\,\%$. Sol bi dobil nazaj z izparevanjem filtrata.
:::

## Pogoste napake

- **»Težji predmet ima večjo gostoto.«** Velik kos lesa je težji od kovanca, a ima manjšo gostoto. Gostota je masa na enoto prostornine, zato primerjaš $\frac{m}{V}$, ne samih mas.
- **»S filtracijo ločiš sol iz slane vode.«** Raztopljeni delci gredo skozi filter. Filtracija loči le netopno trdno snov; sol dobiš z izparevanjem ali destilacijo.
- **Topnost na $100\,\mathrm{g}$ raztopine.** Topnost $36\,\mathrm{g}$ velja za $100\,\mathrm{g}$ **vode**, kar da $136\,\mathrm{g}$ raztopine. Kdor misli, da je v $100\,\mathrm{g}$ raztopine $36\,\mathrm{g}$ soli, dobi preveč soli.
- **»Pri raztapljanju snov izgine.«** Sol se le razprši med molekule vode. Masa raztopine je vsota mas, $m_r = m_v + m_s$.
- **»Raztopljena sol pri destilaciji pade na dno, ker je težja.«** Raztopljena snov se ne useda. V bučki ostane, ker ima zelo visoko vrelišče in ne izpari.

## Povzetek

- Čiste snovi prepoznaš in ločiš po lastnostih: gostoti, topnosti, vrelišču, magnetnosti.
- Gostota $\rho = \frac{m}{V}$ (v $\mathrm{g/cm^3}$) je lastnost snovi. Telo plava na tekočini z večjo gostoto.
- Topnost: masa snovi, ki se raztopi v $100\,\mathrm{g}$ vode do nasičenja pri dani temperaturi. Pri $\mathrm{KNO_3}$ močno raste s temperaturo, pri $\mathrm{NaCl}$ skoraj ne.
- Kristali pri hlajenju: raztopljena masa minus topnost pri nižji temperaturi.
- Postopki: filtracija (netopno), lij ločnik (tekočini, ki se ne mešata), destilacija (vrelišče), kristalizacija, magnet, kromatografija.
- Zmes treh snovi: magnet, raztapljanje, filtracija, izparevanje.
- $m_r = m_v + m_s$, masni delež $w = \frac{m_s}{m_r}$.

## Drugače: Z analogijo

Ločevanje zmesi je kot razvrščanje drobiža iz hranilnika. Kovance lahko ločiš po velikosti (sito, kot filtracija), po barvi (kot kromatografija loči barvila) ali po tem, ali se primejo magneta (kovanci za $1$, $2$ in $5$ centov se primejo, za $10$, $20$ in $50$ centov ne). Vedno izbereš lastnost, v kateri se kovanci razlikujejo. Po teži v roki jih ne ločiš dobro, ker sta lahko kovanca različne velikosti enako težka.

Nasičena raztopina je kot polna avtobusna postaja v dežju. Pod nadstrešek gre le določeno število ljudi; kdor pride kasneje, ostane zunaj (neraztopljena sol na dnu). V toplem vremenu je »nadstrešek« pri $\mathrm{KNO_3}$ veliko večji. Ko se ohladi, se skrči in ljudje, ki ne gredo več pod streho, izstopijo kot kristali.

## Drugače: Iz vsakdanjega življenja

- **Cedilo za testenine** je filtracija: testenine ostanejo, voda steče skozi.
- **Mastna juha v hladilniku** je ločevanje po gostoti: maščoba se nabere na vrhu in jo poberemo z žlico.
- **Soline** pridobivajo sol z izparevanjem morske vode. Kristalizacija s hlajenjem bi tu odpovedala, ker topnost soli skoraj ni odvisna od temperature.
- **Odkupovalec zlata** najprej stehta nakit in izmeri prostornino, prav kot Eva, in tako hitro odkrije ponaredek.

## Preveri se

? Tri zmesi lahko ločiš s filtracijo. Katera ne spada zraven?
- pesek in voda
~ Pesek se v vodi ne raztopi, zato ostane na filtrirnem papirju.
- kreda in voda
~ Kreda je netopna, njeni delci so preveliki za pore filtra.
+ sol in voda
- železni opilki in voda
~ Opilki se ne raztopijo, zato jih filter zadrži. Lahko jih poberemo tudi z magnetom.
> Sol se raztopi, njeni delci gredo s filtratom skozi filter. Ločiš jo z izparevanjem ali destilacijo.

? Z grafa odčitaj topnost kalijevega nitrata. Nasičeno raztopino iz $100\,\mathrm{g}$ vode pri $60\,°\mathrm{C}$ ohladiš na $20\,°\mathrm{C}$. Koliko gramov kristalov se izloči?
:::risba graf
opis: Graf topnosti kalijevega nitrata v gramih na 100 gramov vode v odvisnosti od temperature od 0 do 80 stopinj Celzija. Topnost je 13 pri 0 °C, 32 pri 20 °C, 64 pri 40 °C, 110 pri 60 °C in 169 pri 80 °C.
x: 0 .. 80 | 20 | T (°C)
y: 0 .. 180 | 20 | g na 100 g vode
črta: 0; 13 -> 20; 32 -> 40; 64 -> 60; 110 -> 80; 169 | modra
točka: 20; 32 | 32 | desno | modra
točka: 60; 110 | 110 | levo | modra
:::
= 78 g | 2
~ 110 | To je vsa raztopljena masa pri $60\,°\mathrm{C}$. Del ($32\,\mathrm{g}$) ostane raztopljen tudi pri $20\,°\mathrm{C}$.
~ 32 | To ostane raztopljeno pri $20\,°\mathrm{C}$. Kristali so razlika $110 - 32$.
~ 142 | Topnosti si seštel. Kristali so razlika: raztopljeno prej minus raztopljeno potem.
> Pri $60\,°\mathrm{C}$ je raztopljenih $110\,\mathrm{g}$, pri $20\,°\mathrm{C}$ voda zadrži $32\,\mathrm{g}$: izloči se $110 - 32 = 78\,\mathrm{g}$.

? Pri destilaciji slane vode se v predložki nabere čista voda. Zakaj sol ostane v bučki?
- Ker je sol težja od vode in se usede na dno.
~ Raztopljena sol se ne useda, delci so enakomerno razporejeni po raztopini. Odloča vrelišče, ne gostota.
+ Ker ima sol veliko višje vrelišče, zato pri segrevanju izpari le voda.
- Ker hladilnik zadrži sol.
~ Hladilnik paro le ohladi, da se utekočini. Soli v pari sploh ni.
> Destilacija loči snovi po vrelišču: voda izpari pri $100\,°\mathrm{C}$, sol ostane v bučki.

? Ana računa, koliko soli je v $340\,\mathrm{g}$ nasičene raztopine $\mathrm{NaCl}$ pri $20\,°\mathrm{C}$. Korak 1: topnost je $36\,\mathrm{g}$ na $100\,\mathrm{g}$ vode. Korak 2: v $100\,\mathrm{g}$ raztopine je torej $36\,\mathrm{g}$ soli. Korak 3: v $340\,\mathrm{g}$ raztopine je $3{,}4 \cdot 36 = 122{,}4\,\mathrm{g}$ soli. Kateri korak je napačen?
- Korak 1
~ Topnost $\mathrm{NaCl}$ pri $20\,°\mathrm{C}$ je res $36\,\mathrm{g}$ na $100\,\mathrm{g}$ vode; to se odčita z grafa.
+ Korak 2
- Korak 3
~ Račun $3{,}4 \cdot 36$ je pravilen, a sloni na napačnem koraku 2.
- Noben, rezultat je pravilen.
~ Rezultat $122{,}4\,\mathrm{g}$ je prevelik: $340\,\mathrm{g}$ raztopine vsebuje $90\,\mathrm{g}$ soli.
> $100\,\mathrm{g}$ vode in $36\,\mathrm{g}$ soli dasta $136\,\mathrm{g}$ raztopine. V $340\,\mathrm{g}$ raztopine je $\frac{340}{136} \cdot 36 = 90\,\mathrm{g}$ soli.

? Razvrsti korake za ločevanje zmesi železnih opilkov, peska in soli.
1. Z magnetom poberi železne opilke.
2. Ostanku dolij vodo in mešaj, da se sol raztopi.
3. Zmes prefiltriraj: pesek ostane na filtru.
4. Filtrat segrevaj, da voda izpari in ostane sol.
> Magnet deluje na suho zmes; sol se mora raztopiti, preden filtriraš; izparevanje je zadnje, ker potrebuješ filtrat.

:::simboli
\rho | gostota | \rho = \frac{m}{V} | g/cm^3
m | masa | m = \rho V | g
V | prostornina | V = V_2 - V_1 | cm^3
V_1 | gladina vode pred potopitvijo | | mL
V_2 | gladina vode s potopljeno verižico | | mL
\rho_\text{zlato} | gostota zlata | | g/cm^3
m_v | masa vode (topila) | | g
m_s | masa topljenca | | g
m_r | masa raztopine | m_r = m_v + m_s | g
w | masni delež | w = \frac{m_s}{m_r} | – | pogosto v odstotkih
m_\text{zmes} | masa zmesi | | g
:::

<<RACUN
vrednost: 54.5-50.0 | 4.5
vrednost: 38.6/4.5 | 8.6
vrednost: 38.6/19.3 | 2
vrednost: 36*2.5 | 90
vrednost: 90/1000*0.60 | 0.054
vrednost: 250+90 | 340
vrednost: 90/340 | 0.265
vrednost: 150-32 | 118
vrednost: 118/100*6 | 7.08
vrednost: 50-8-30 | 12
vrednost: 12/50 | 0.24
vrednost: 110-32 | 78
vrednost: 38-36 | 2
vrednost: 3.4*36 | 122.4
vrednost: 340/136*36 | 90
>>
