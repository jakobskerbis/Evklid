---
name: evklid-tutor-unique
description: j's 22 picked ideas (4 Nov 2026) to make the tutor more than an LLM tutor; bundles A–E, plan file, pick artifact; building after optimizer slot (likely after 11 Nov reset)
metadata:
  type: project
  modified: 2026-11-04T14:30:25.954Z
---

j 4 Nov 14:17: »Naj inštruktor ne bo samo še en LLM inštruktor, najdi 30 stvari«. Thread cmsg_011HYzNBAS5HRU1H7PcSE7JtQAaLuE15x5oLAxZF2haHgm.
- 30 ideas: /mnt/project-files/evklid/instruktor-ideje/30-idej.md. j ticked on artifact https://claude.ai/artifact/1CkGziSWgrntTLdygMoqGw (db doc izbira/ideje): 1,2,3,4,6,7,8,11,12,13,14,15,16,19,20,21,22,24,25,26,27,30 (not 5,9,10,17,18,23,28,29).
- Plan /mnt/project-files/evklid/instruktor-ideje/nacrt-gradnje.md: A tutor opens app tools from chat (lab with values, 3D part, graph, sketch, NPZ tasks, textbook link, game) via one block/tool; C verified calculations + misconception diagnosis + confidence + deliberate error; D memory across chats, test plan from schedule, interests; B lab guidance + predict-observe-explain; E exam sim, real-world photo task, voice, league challenge, teacher rules. Order A→C→D→B→E. ~150 $ total.
- Key gap found: tutor has no way to open lab/3D/graph; entry points exist (laboratorij.js openLabExperiment, uci-se.js open3d).

- Bundle A (1,4,6,7,11,25,26) MERGED PR #427 4 Nov 17:05 UTC (j »Da, objavi« card). Mechanism docs/odpri.md: blocks <<ODPRI poskus|3d|ucbenik|igra|formula>>, <<GRAF>>, <<SKICA>>; server/odpri.js resolver, public/odpri.js UI. Idea 21 (NPZ tasks on topic) not in A.
- Bundle C handed to a new thread (handover /mnt/project-files/predaja/posebni-instruktor-c.md), cap ~40 $. Optimizer 4 Nov 17:04: C counts as not started, so it waits for the 11 Nov reset (first in /mnt/project-files/optimizator/vrsta-po-11-11.md); no code written yet. Then D, B, E.

**Why:** j wants Evklid's tutor distinctive by using its own features.
**How to apply:** Optimizator 2 (4 Nov 14:30): ALL bundles after 11 Nov reset, one thread, bundles in order, ≤2 heavy agents, triple review; optimizer wakes this thread week of 11 Nov with a cap. Prompt changes go to j as a card before merge. See [[evklid-prompt]], [[evklid-chat-settings]].
