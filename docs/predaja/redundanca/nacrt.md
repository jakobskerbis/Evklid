# Nit »Odprava podvojenih elementov« – načrt

Stanje: samo načrt (4. 11. 2026, poraba tedna ~97 %). Gradnja po ponastavitvi 11. 11.

**Odločitve j (4. 11. 21:51):** 1) »Samo Cilj« – Program odstranimo (najdba #1 kot predlagano). 2) »Očitne popravi sama« – jasne podvojitve nit odstrani brez vprašanja, kartice v »Odločitve zate« samo za dvomljive.

## Cilj
Na vseh zaslonih (splet: telefon, tablica, računalnik; Android aplikacija je ista kot splet) najti in odstraniti:
1. **podvojene izbire** – dva gumba/izbirnika, ki nastavita isto stvar (primer: »Program« in »Cilj«),
2. **prekrivajoče možnosti** – ista možnost pod dvema imenoma (Tekmovanja / Tekmovanje, »NPZ / matura« / Matura),
3. **mrtve elemente** – gumbi brez učinka, skriti elementi, ki se nikoli ne pokažejo, zasloni, do katerih ni poti, neuporabljena besedila.

Namerno podvojeno ostane (ne šteje kot napaka): zgornji meni na računalniku + spodnja vrstica na telefonu; bližnjice na Učni poti, ki so tudi v meniju (j, 1. 11.).

## Primer iz posnetka (najdba #1) – potrjeno v kodi
- `public/index.html` vrstica 265: izbirnik **Program** (`track`: REGULAR = »Redni pouk (NPZ / matura)«, COMPETITION = »Tekmovanja«).
- Takoj pod njim **Cilj** (`public/goal-data.js`): Sprotno učenje / Test v šoli / NPZ ali Matura / Tekmovanje.
- Tekmovanje in Matura/NPZ sta tako izbrana dvakrat; učenec lahko izbere celo nasprotje (Program = Tekmovanja, Cilj = Matura).
- **Predlog:** izbirnik Program odstranimo. Cilj »Tekmovanje« sam nastavi tekmovalni način, vsi drugi cilji redni pouk. Inštruktor in strežnik delata naprej enako (notranja nastavitev `track` ostane, le izračuna se iz cilja). Obstoječim učencem z »Tekmovanja« ob prvem odprtju nastavimo cilj Tekmovanje.
- Velikost: majhen popravek (~40 vrstic + test), ena pregledna runda.

## Kandidati za preveriti (še ne potrjeno)
- Tekmovanja so dosegljiva na treh mestih: zavihek »Tekmovanja«, bližnjica pri cilju Tekmovanje in nastavitev Program. Verjetno ostane le zavihek + bližnjica.
- Nastavitve, ki jih lahko spremeni tudi inštruktor v klepetu (`public/settings-registry.js`), so morda še kje drugje na zaslonu (npr. videz, hitrost izpisa) – pregled pokaže, ali so na istem zaslonu dvakrat.

## Kako bo nit iskala (sistematično)
1. **Popis** (skripta, brez AI): odpre vsak zaslon (`data-view` v `index.html`, ~17) pri treh širinah, plus odprte menije in okna, in zapiše vsak gumb, izbirnik, čip, zavihek in povezavo: besedilo, kaj nastavi ali odpre, ali je viden. Shrani posnetke.
2. **Samodejno iskanje:** isti napis dvakrat na istem zaslonu; dva elementa, ki pišeta v isto nastavitev ali v nastavitvi, ki se dasta izračunati ena iz druge; podobni napisi (tekmovanje/tekmovanja); elementi brez učinka ali nikoli vidni; besedila v `i18n`, ki jih nihče ne uporablja; zasloni brez poti do njih.
3. **Pregled z očmi:** en pregledovalec (Opus) gre čez posnetke in seznam ter vsako najdbo označi: podvojeno / nepotrebno / namerno.
4. **Očitne najdbe popravi nit sama** (j, 4. 11.). Le dvomljive gredo kot kartice v »Odločitve zate«, združene v nekaj paketov. Na koncu j dobi seznam vsega, kar je bilo odstranjeno.
5. **Popravki:** majhni PR-ji po paketih, vsak en pregled (pravilo za majhne popravke), splet in aplikacija hkrati, besedila v vseh 33 jezikih.
6. **Varovalka:** test, ki pade, če se na istem zaslonu spet pojavita dva elementa za isto nastavitev. Skripta ostane v repozitoriju (`scripts/`), da se pregled lahko ponovi pred vsako večjo izdajo.

## Ocena stroška
| Korak | Ocena |
|---|---|
| Popis + samodejno iskanje (skripta) | 10–15 $ |
| Pregled posnetkov in seznam najdb | 15–20 $ |
| Popravek #1 (Program/Cilj) | 5–8 $ |
| Ostali popravki (odvisno od števila, ~5–10 paketov) | 25–50 $ |
| **Skupaj** | **~55–95 $ (≈ 3–4 % tedna)** |

Brez gradnje pred 11. 11.
