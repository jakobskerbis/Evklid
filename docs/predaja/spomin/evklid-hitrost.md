---
name: evklid-hitrost
description: Why evklid.app felt slow on 4 Nov 2026 (deploy downtime, sync brotli after restart, games 2 MB eager) and what was fixed
metadata:
  type: project
  modified: 2026-11-04T08:26:04.524Z
---

j 4 Nov 2026 08:09 UTC: »zakaj spletna stran deluje zelo počasi« + Android app showed »Ni povezave« (thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt6qhqFxoFFhcs2EhGFGkA6x).

Measured: server healthy (TTFB ~0.2 s from US, RSS ~180 MB idle, boot 1.3 s). Causes:
- Every Render deploy = ~1 min outage (persistent disk → no zero-downtime); the app's WebView (mobile/src/app/web.tsx) shows »Ni povezave« on any load error, so outages look like »no internet«. Many merges on 4 Nov → deploys (max 1/h via scripts/render-objava.js).
- server/compress.js compressed each static file with brotliCompressSync q9 on first request after every restart → event loop blocked for seconds on 0.5 CPU.
- First page load pulled 3.9 MB JS (148 requests), ~2 MB of it public/games/** statically imported by app.js.
Fix PR #325 (merged 4 Nov 08:46 UTC, live checked: 116 instead of 148 requests, 787 KB instead of 1389 KB): async compression + warm() after listen (server/startup-files.js), games via import() on first open or idle 3 s after boot. Phone emulation 3.2 s → 2.4 s, transfer −45 %.
Tried and rejected: modulepreload hints (no gain).
PR #334 (merged 4 Nov ~09:56 UTC): app WebView waits through 5xx/dropped connection with spinner + »Evklid se posodablja …« (BUSY_WAIT ~70 s) instead of »Ni povezave«; ships with next OTA/APK (needs j's Expo login).
Idea left: version query on files to allow long caching (all app files are `no-cache` → ~110 revalidations per open).

Related: [[evklid-render]].
