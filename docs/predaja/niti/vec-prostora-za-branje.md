# Več prostora za vsebino pri branju (j, 4. 11. 2026)

j: »kadarkoli je nek razdelek, ko beremo, naj se čimbolj poveča prostor za tekst/grafe«.

## Narejeno (nit »Free up screen space in the chat input«, 4. 11.)
- Vrstica za pisanje v klepetu brez okna: brez okvirja, podlage in pasu obdobja, le tanka črta; namig le v praznem
  klepetu; gumbi 38 px. Višina 134 → 74 px (računalnik), 97 → 75 px (telefon). Predogled formul brez okvirja.
- Lep zapis med pisanjem (`public/lepi-zapis.js`, test `test/lepi-zapis.test.js`): x^2 → x², 3/4 → ³⁄₄, sqrt → √,
  a_n → aₙ, * → ·, <= → ≤, (3)/(4) in √(2) s tipkovnice → ³⁄₄, √2.

## Ostane za po 11. 11. (po vrsti koristi)
1. **Prava matematika v polju** za zapletene formule ((x+1)/(x−1), ∫, ∑, koren čez več členov): urejevalnik formul
   v polju (npr. MathLive, MIT) namesto textarea + predogleda. Večje delo (tipkovnica, glas, razpri.js, mobilna app).
2. **Glava klepeta na telefonu se skrije med branjem** (drsenje navzdol skrije `.chat-head` in vrstico čipov, gor ju
   pokaže), kot spodnja vrstica (touch.css, body.tb-peek).
3. **Odprta lekcija v Učbeniku / Uči se**: zgornja vrstica in preklopnik zavihkov se umakneta pri drsenju; gumb
   »Celozaslonsko branje«.
4. **Rešitve (Razloži podrobneje)**: okno na telefonu čez cel zaslon, brez robov kartice.
5. **Grafični kalkulator**: na telefonu seznam funkcij zložljiv (graf čez ves zaslon), na računalniku skrij stranski
   stolpec z gumbom.
6. **Tema (lekcija, naloge, simulacije)** in **Laboratorij**: zložljiva glava, pripeta risba manjša, ko bereš besedilo.
7. Obvestili »Preizkusni način« / »Testna različica« na vrhu zavzameta ~90 px: po zaprtju naj ostaneta zaprti za vedno
   in se na telefonu skrčita v eno vrstico.
