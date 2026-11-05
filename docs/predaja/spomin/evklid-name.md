---
name: evklid-name
description: App name is EVKLID (j, 18:49 29 Oct, after TMview check; PR #140); history STEMMind -> Kompreno (TM conflict) -> Evklid; brand.json, compat shims, guard test, what is left (repo, folder); name research <!-- brand:legacy -->
metadata:
  type: project
  modified: 2026-10-29T15:40:14.367Z
---

Naming research (thread "Research whether STEMMind is the best name", 2026-10-29). <!-- brand:legacy -->

- CURRENT NAME **Evklid** (j picked on decision card 18:49 after his own TMview check; PR #140 merged 29 Oct). Declined: sl »Evklida, v Evklidu, z Evklidom«, hr/bs/sr u Evklidu, cs v Evklidu, sk v Evklide, pl w Evklidzie, hu az Evklid/Evklidet/Evklidben, tr Evklid'in/'e/'i/'de, bn Evklid-এ. Wordmark Evkli<span>d</span>. Domain evklid.app bought by j on Cloudflare; named tunnel "evklid" (Healthy, installed as Windows service on urskatorkar, token in the service not .env; an unused Inactive tunnel "Evklid" also exists). Route evklid.app -> http://localhost:3000 set up by j 19:25 with guidance; j confirmed evklid.app opens on his phone (20:10). PR #145: telefon.js detects the service, checks https://evklid.app/manifest.webmanifest, shows evklid.app, else ngrok fallback; brand.json domain, EVKLID_JAVNI_NASLOV override (0 = off). Ids: env EVKLID_*, data/evklid.db, localStorage evklid.*, cookies evklid_geslo/_age, events evklid:*, markers EVKLID:NASTAVITVE / EVKLID-SAMOPOSODOBITEV, assets/evklid.ico, Stripe lookup evklid_*.
- Name lives ONLY in brand.json (name, slug, env, wordmark, legacy[] = Kompreno, STEMMind). Rename again = `node scripts/preimenuj.js <Ime>` (whole words, keeps .bat byte offsets, renames files, adds old name to legacy) then hand-fix declensions it lists. »Evklid« is also a maths word (Evklidov algoritem, sim id `evklid`): never mass-replace; on a future rename set legacy `match` so maths isn't flagged. <!-- brand:legacy -->
- Compat shims read brand.json legacy (keep): server/env.js (EVKLID_*/EVKLID_* -> EVKLID_*, import first), db.js VACUUM INTO from kompreno.db or stemmind.db (old kept), theme.js localStorage list, gate.js + accounts cookies, plans.js lookup keys, posodobitev.js markers, bliznjice.js Windows shortcuts. test/ime.test.js fails on any old name outside them. <!-- brand:legacy -->
- 2026-10-30 rename thread (PR #193 merged): code has no 'stemmind' left; repo name in brand.json `repo` (jakobskerbis/evklid) + legacy[].repo; posodobitev.js tries new name then old on 404, .bat use *-main folder. Shared folder renamed /mnt/project-files/stemmind -> /mnt/project-files/evklid (PDF ucbenik-evklid-vse.pdf). Waiting on j (steps in decisions list): rename GitHub repo to evklid, check Render repo link, update Project settings repo, rename PC folders Desktop\stemmind-main -> evklid-main and stemmind-sim -> evklid-sim (only when simulation thread idle). Old .env keys still work via shim. <!-- brand:legacy -->

- History: STEMMind dropped (STEM Minds Corp. TM in CA/US). Kompreno picked 15:57, renamed (PR #128/#136), then 18:36 j's TMview showed KOMPRENO registered (Benelux 35/41, DPMA, JP, MX). Rejected: Razumko-style -ko names (j: childish), Ejaj, Stemcell, Hipatija, Sciolo. Lesson: never commit to a name before j's own TMview check. <!-- brand:legacy -->

Related: [[evklid-growth]], [[evklid-project]]
- 2026-10-30 05:49: https://evklid.app WORKS (j's iPad screenshot: Evklid brand, profile password dialog). Tunnel + rename done. Only optional left: evklid.si.
- 2026-11-01 11:51: rename COMPLETE: GitHub repo jakobskerbis/Evklid, Render linked to it, project settings repo updated, PC folders evklid-main / evklid-sim-main. Only Desktop\stemmind-sim left (rename when simulation thread is idle). <!-- brand:legacy -->
