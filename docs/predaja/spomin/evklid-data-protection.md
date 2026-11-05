---
name: evklid-data-protection
description: Evklid student-data protection work (2026-10-30): audit result, what the PR builds, env key EVKLID_DATA_KEY, owner thread
metadata:
  type: project
  modified: 2026-10-30T10:50:54.248Z
---

j (2026-10-30 09:49): »naredi state of the art sistem za zaščito podatkov učencev, lahko ga tudi uvoziš«. Owner thread "Zaščiti podatke učencev" (cmsg_011HYzNBAS5HRU1H7PcSE7JtQ2D6UeusvQ2gfcbrJzs3aT). j is an adult and is the data controller (confirmed 30 Oct).

Audit (30 Oct): scrypt passwords, export/delete, cascades, teacher never sees chats, npm audit clean were already fine. Gaps: no security headers, chats + homework photos stored plaintext forever, no audit log, login throttle only per email|ip.

PR #195 MERGED 30 Oct ~11:00 UTC (follow-up #203 audit of /api/kozmetika/export). Also: tutor + scan reject non-learning photos (flag=photo, never stored; j 09:52). Helpers for other threads: server/crypto-polje.js seal/unseal, server/dnevnik-dostopov.js audit(db,{req,actor,action,target}), retention values in server/zasebnost.js RETENTION; new personal free-text columns should be sealed and new sensitive endpoints audited. It builds: helmet CSP/HSTS, AES-256-GCM field encryption (env EVKLID_DATA_KEY; old keys EVKLID_DATA_KEYS_OLD; losing the key = losing chat history), photos removed after 7 days, retention job, audit_log with HMAC'd IPs, stronger throttles + scrypt N=2^17 with rehash, Dependabot, docs/varnost-podatkov.md. j-only step: generate key and set it in Render env + keep a copy. Incidents still go to [[evklid-crisis]].
