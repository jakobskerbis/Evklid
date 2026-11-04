---
naslov: Kupiti zdaj na kredit ali varčevati?
cas: 1 teden
avtor: AI
stanje: pregledano
---

## Izziv

Želiš si nekaj, kar stane nekaj sto ali tisoč evrov: računalnik, skuter, vozniški izpit ali potovanje po maturi. Koliko evrov več plačaš, če to kupiš takoj na kredit ali na obroke, in koliko mesecev bi moral varčevati z enakim mesečnim zneskom, da bi plačal z gotovino?

## Potrebuješ

- spletno ponudbo izbrane stvari s ceno
- spletno ponudbo kredita, nakupa na obroke ali lizinga (informativni izračun banke, trgovine ali prodajalca)
- spletno ponudbo varčevanja z letno obrestno mero (varčevalni račun ali vezava)
- preglednico (Excel ali Google Preglednice) ali kalkulator

## Koraki

1. Izberi stvar, zapiši njeno ceno $C$ in spletni naslov ponudbe.
2. Poišči ponudbo kredita ali nakupa na obroke za znesek $C$. V informativni izračun ne vpisuj osebnih podatkov (EMŠO, naslova, telefona), saj kredita ne najemaš zares. Zapiši število obrokov $n$, mesečni obrok $a$, stroške odobritve in druge stroške ter skupni znesek, ki ga po ponudbi plačaš.
3. Izračunaj, koliko plačaš skupaj: $n \cdot a$, ki mu prišteješ vse stroške. Rezultat primerjaj s skupnim zneskom iz ponudbe. Koliko evrov preplačaš in koliko odstotkov cene $C$ je to?
4. Poišči ponudbo varčevanja in zapiši letno obrestno mero $p$. Predpostavi, da vsak mesec ob koncu meseca vložiš znesek $a$ (enak obroku kredita) in da banka obresti pripisuje mesečno z relativno obrestno mero $\frac{p}{12}$. Mesečni obrestovalni faktor je torej $r = 1 + \frac{p}{1200}$.
5. V preglednici izračunaj stanje po vsakem mesecu: novo stanje $=$ prejšnje stanje $\cdot\, r + a$ (začneš pri $0\,\text{€}$). Poišči prvi mesec $m$, ko stanje doseže ceno $C$.
6. Stanje po $m$ mesecih preveri še z vsoto geometrijskega zaporedja: $S_m = a \cdot \dfrac{r^m - 1}{r - 1}$ (količnik zaporedja je $r$). Za kontrolo preglednice: pri $a = 100\,\text{€}$, $p = 2$ in $24$ mesecih dobiš približno $2446{,}57\,\text{€}$. Koliko si vložil sam ($m \cdot a$) in koliko so ti prinesle obresti?
7. Med varčevanjem se cena lahko zviša. Na spletni strani Statističnega urada RS (stat.si) poišči zadnjo letno inflacijo $i$ (rast cen v odstotkih) in oceni ceno čez $k$ let: $C_k = C \cdot \left(1 + \frac{i}{100}\right)^k$. Za $k$ vzemi čas varčevanja v letih, $k = \frac{m}{12}$. Ali stanje na računu še vedno zadošča? Če ne, v preglednici dodaj stolpec s ceno po vsakem mesecu, $C \cdot \left(1 + \frac{i}{100}\right)^{\frac{m}{12}}$, in poišči prvi mesec, ko stanje doseže ceno.
8. Primerjaj obe poti: koliko te stvar stane na kredit in koliko z varčevanjem ter koliko mesecev prej jo imaš, če vzameš kredit.

## Kaj oddaš

Poročilo na eni strani: podatki vseh treh ponudb z viri, tabela stanja na varčevalnem računu po mesecih, primerjava (koliko plačaš na kredit, koliko z varčevanjem, razlika v evrih in mesecih) in tvoja odločitev z utemeljitvijo.

## Merila

- Cena, kredit in varčevanje so iz resničnih ponudb z navedenim virom; vsi zneski imajo enote.
- Skupni znesek kredita in preplačilo (v evrih in v odstotkih cene) sta pravilno izračunana.
- Stanje varčevanja je izračunano z mesečnim obrestovalnim faktorjem $r = 1 + \frac{p}{1200}$, ne z $1 + \frac{p}{100}$, in preverjeno s formulo za vsoto geometrijskega zaporedja.
- Podražitev cene je izračunana z obrestnim obrestovanjem, ne s $k$-kratnikom odstotka.
- Odločitev je utemeljena s številkami (razlika v evrih in v času), ne le z mnenjem.
