---
name: evklid-skener-pilot
description: Scanner prep before 15 Nov pilot: on-device blur/dark/tilt check (PR #429), results of 32 bad-photo reading test and 20 tutor jailbreaks, READ_PROMPT reworked (#430)
metadata:
  type: project
  modified: 2026-11-04T17:57:51.001Z
---

4 Nov 2026 (thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt6JFybRhmUNnSJ1ZbhNAjKz, handover /mnt/project-files/predaja/skener.md):
- PR #429 merged: public/scan/kakovost.js, live hint + pre-read warning; LIMITS.blur 0.03 at 1600 px calibrated on j's 32 photos (flags 01, 03, 28; 31 dark). Not yet tried on a real phone.
- Reading test (Sonnet 5.5 + READ_PROMPT, Opus judge): 6 OK / 22 partial / 1 fail / 3 unreadable. Photo quality barely matters; READ_PROMPT drops second problems and givens (points, pole, asymptote), sometimes takes a work line. Report /mnt/project-files/evklid/skeniranje-test/rezultati-2026-11-04.md.
- PR #430 merged same evening: READ_PROMPT reads all tasks + "given" conditions (shown under the task, sent to AI solve), exact log bases; answer facts one per line; chat graph splits at \iff. Re-run on the 32 photos fixed most misses.
- 20 jailbreaks on Haiku with the real system prompt: 0 succeeded; shield over-triggers on [SYSTEM UPDATE] + real task.
- No ANTHROPIC_API_KEY in cloud containers: tests simulate with Agent models.
- j's test photos are private (hand, room): never commit.

**Why:** pilot 15 Nov; next: real-API check of #430 and real-phone blur threshold (2 Opus reviews; tutor-prompt changes need j's card).
