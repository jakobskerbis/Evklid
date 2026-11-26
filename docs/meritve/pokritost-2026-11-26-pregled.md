## Pregled zaznanih napak

Vseh 9 je 26. 11. 2026 pregledal model AI Claude, ne človek; dva ločena agenta AI (prav tako modela) sta izid
ponovila. Nobena ni napačen rezultat:
- Napačen preračun v `server/lesson-math.js` (datoteka profila B, AUDIT-087 v revizijskem registru):
  $10^4 \cdot 10^1 = 10^5$ (potenco pred `\cdot` prebere kot $10^{40}$) in $\text{št. skupine} - 10$ (`\text{…}`
  vzame kot enoto).
- Zapis, ki ga preračun ne pozna (ni v registru): pretvorba h → min v isti verigi (exi-mat-solids) in ocena reda
  velikosti z ≈ ($2^{10} \approx 10^3$, $(10^3)^4 \approx 2^{40}$), ki jo lesson-math preverja strogo.
- Nenatančen zapis v naši vsebini (rezultat pravilen, enačba med znakoma $ dobesedno ne drži; popravek v ločenem PR):
  tek-simetrija-os piše uro kot račun z decimalkami ($12.00 - 7.05 = 4.55$), tek-fiz-elektrostatika in
  tek-kem-termokemija skrijeta pretvorbo enote (F → pF, J → kJ).
