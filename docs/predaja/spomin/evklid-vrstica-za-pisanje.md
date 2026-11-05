---
name: evklid-vrstica-za-pisanje
description: Chat input bar without a box + live Unicode math while typing (PR #431, 4 Nov 2026); follow-ups for reading screens
metadata:
  type: project
  modified: 2026-11-04T18:40:15.933Z
---

j (4 Nov 2026): the student's chat input should »samo piše po strani brez okna« and wherever we read, maximize space for text/graphs; powers, fractions, roots »itd.« should look like real math in the input.

- PR #431 merged 4 Nov: composer has no box/background/era band/arch stylobate, thin line only (2 px accent on focus), hint only in empty chat; 134 → 74 px desktop, 97 → 75 px phone. public/lepi-zapis.js converts while typing (x^2 → x², 3/4 → ³⁄₄, sqrt → √, a_n → aₙ, * → ·, <= → ≤; Backspace right after undoes). Complex formulas still use the preview above the field.
- Follow-ups (after 11 Nov) in /mnt/project-files/predaja/vec-prostora-za-branje.md: real math editor in the field (e.g. MathLive), hide chat header while scrolling, lesson/solution/graph full-screen reading.

Related: [[evklid-brez-robov]] [[evklid-windows]]
