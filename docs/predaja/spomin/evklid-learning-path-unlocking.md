---
name: evklid-learning-path-unlocking
description: Learning path (Učna pot) has no locks since PR #248 (31 Oct 2026); units only get a recommendation
metadata:
  type: project
  modified: 2026-10-31T20:13:17.836Z
---

j (31 Oct 2026) said lesson unlocking "makes no sense" and picked "Vse odprto, samo nasveti". PR #248 merged 31 Oct 20:13 UTC.

- No unit or topic on the learning path is ever locked. `pathView` (server/progress.js) marks a unit `ahead` (previous practice unit not mastered and this one not started) and adds `suggest: {unit, topic}` pointing to where the student currently is.
- UI: unit note "Priporočamo, da najprej osvojiš sklop »X«", topic screen hint with a button to the suggested topic, placement test = "Preskoči s preizkusom znanja" (80 % → unit mastered).
- Daily training, class review, offline pack and default test units still skip `ahead` units, so automatic practice stays where the student is.
- Games keep their own unlock system (public/games/unlock.js), unchanged.
- Open, not urgent: the mobile app does not show the recommendation text.

**Why:** students follow their teacher's order; locks blocked even reading a lesson, and a failed placement test unlocked the unit anyway.
**How to apply:** do not reintroduce hard locks on the path without asking j; new path features should use `ahead`/`suggest`.
