---
name: evklid-goal-adapt
description: Evklid home screen follows the student's goal (PR #343 merged 4 Nov 2026): two shortcuts on Učna pot, phone 4th tab
metadata:
  type: project
---

DONE 4 Nov 2026, PR #343 merged. The goal (public/goal-data.js: sprotno, test, npz, matura, tekmovanje, izpit) now drives:
- `goalShortcuts()` → `#goal-modes` row on Učna pot (two buttons, same `.modes` look), above the mode bar for npz/matura/tekmovanje/izpit; goal test puts »Priprava na test« first (only that button moves; student's drag order kept).
- `goalTabbarView()` → phone 4th tab: exams (NPZ/matura), competition (tekmovanje), else lab.
Not done (plan item): harder default tasks on Učna pot for competition goal — the Tekmovalni trening shortcut covers it.
Thread "Adapt Evklid to each student's goal" cmsg_011HYzNBAS5HRU1H7PcSE7JtD5sAJgCerdqG7FoBtX7UuB. Screenshots /mnt/project-files/evklid/cilj-prilagoditev/posnetki/.
Side finding »0.00 €« in top bar fixed in PR #356 (amounts use locale() from public/i18n.js; test forbids toLocaleString(undefined)).
