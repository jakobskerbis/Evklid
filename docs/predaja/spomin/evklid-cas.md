---
name: evklid-cas
description: Evklid calculator symbolic algebra (CAS): all 3 phases merged 4 Nov 2026 (#361, #382, #428); code map and known limits
metadata:
  type: project
  modified: 2026-11-04T17:13:35.603Z
---

Plan (Claude Doc) https://claude.ai/artifact/15ugM9DmxowjTJV5aAZrcc. Thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt1fQ57TjYAbLQHpmK2oJiHs. All phases DONE 4 Nov.

Phase 1 (#361): public/graph/cas.js on Q/P from public/scan/algebra.js. `poenostavi/razvij/razstavi/reši(eq; v)` (English names too); buttons under expressions with letters, »Izrazi {v}«; Algebra group in ⋯ menu and keyboard f(x) (CAS_SL in tipkovnica-data.js). Every result verified numerically, else casUnverified; time limit 1.5 s (live 0.2 s). test/cas.test.js.

Phase 2 (#382): public/graph/calculus.js: `integriraj/limita/taylor`; always radians (note in DEG/GRA). test/cas2.test.js. ≈16 $.

Phase 3 (#428, 22.9 $): public/graph/casalg.js (roots/powers via generator variables with relations, |x|, rationalisation; trig identities; logs/exp), public/graph/casmat.js (`det`, `inverz`/inverse/inv, matrices [[a, b], [c, d]] or [[a; b]; [c; d]], ≤5×5). runCas falls back to casalg when phase 1 says unsupported. Verification: where shown conditions hold, both sides must exist. test/cas3.test.js.

Known limits: nested radicals, inverse trig/hyperbolic unsupported; merged radicals get stricter conditions (√(xy) → x, y ≥ 0); ln(x²) → 2 ln x with x > 0; trig denominators always rationalised (not always shortest); no »radicand ≥ 0« in solve; x²+ax+a²=0 → ∅; unsorted solve solutions; log(e) shows 1/(ln 2 + ln 5).

Related: [[evklid-graph-calculator]]
