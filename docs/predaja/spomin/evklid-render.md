---
name: evklid-render
description: Evklid hosting on Render (live 2026-10-30): URL, settings, fresh DB, how to verify accounts without email, remaining steps
metadata:
  type: project
  modified: 2026-10-30T19:09:46.019Z
---

Evklid runs on Render since 2026-10-30 (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtPiY8RRPEg61WV3A3TCYhmu; j asked »Ali lahko nastavimo na render«). Blueprint `evklid` from render.yaml, Starter plan, Frankfurt, disk /var/data, URL https://evklid-a6az.onrender.com, real Anthropic key set by j in Render (never in chat).

- NODE_VERSION must be ≥ 22.13 (node:sqlite unflagged); 22.12.0 crashed the first deploy. render.yaml now "22" (PR #179).
- j chose a fresh start: old data stays on the PC DB, nothing migrated.
- No Resend yet → verify links hidden for remote requests; confirm an account with `node scripts/potrdi-racun.js email` in Render → Shell (PR #179).
- j's card was first declined (balance/limit), then worked.
- autoDeploy false; auto deploy via .github/workflows/render-posodobitev.yml (PR #183, #205; j asked to optimise the 2 h interval): runs on every push to main (GitHub cron was delayed for hours, hourly cron only a fallback), scripts/render-objava.js waits for a quiet server (/healthz/stanje), max 3 h, min 1 h between deploys. Secret RENDER_DEPLOY_HOOK added by j 30 Oct; first automatic deploy 11:03 UTC worked.
- evklid.app → Render done 30 Oct (Cloudflare tunnel record deleted, CNAME @ and www → evklid-a6az.onrender.com, DNS only); EVKLID_BASE_URL=https://evklid.app. PC/telefon-windows.bat no longer needed.
- Resend LIVE 30 Oct 13:26 UTC: domain evklid.app verified (EU eu-west-1, records send/rsend/resend._domainkey via Cloudflare auto-configure, no root MX change), RESEND_FROM="Evklid <info@evklid.app>", reset mail test OK. j also fixed misspelt env EVLID_BASE_URL → EVKLID_BASE_URL. Still to do: Stripe webhook.

- 30 Oct j: »uporabnik naj se prijavi samo enkrat« → PR #225 (session 365 days, profile unlock 365 days per device, logout no longer relocks, account lock off unless EVKLID_ACCOUNT_LOCK=1; also fixes smoke test odjava-prijava). j chose »geslo res samo enkrat« (child on a logged-in device may open Račun; export/delete still need account password). Merged 30 Oct 15:19 UTC.
- 30 Oct PR #229 (j: installed app opened on English »Forgot password«; »naj ostane prijavljen«): /prenesi in a signed-in phone browser has »Odpri Evklid in ostani prijavljen« → one-time evklid://prijava?t= link (server/mobile/app-link.js, 15 min, bound to browser session); app confirms account first. Causes fixed: expo-router fallback picked first route alphabetically (now redirectTo), detectLanguage needed Intl.Locale (Hermes lacks it). Needs new APK.
- 30 Oct PR #234 (j: »nočem, da se ta zaslon prikazuje«, chose card »Samo pri več profilih«): profile password only when the account has 2+ profiles (profileLockOn in server/accounts/index.js); adding the 2nd profile also sets passwords for existing ones; homeLanguage(): English device in Europe/Ljubljana → Slovenian (web + app).

Related: [[evklid-release]], [[evklid-accounts-billing]].
- 4 Nov: login/Render thread is now cmsg_011HYzNBAS5HRU1H7PcSE7JtD87vR3YznDhaphjmhNt5Lr. PR #281: `curl https://evklid.app/healthz/stanje` → `posta` {nastavljena, poslanih, napak, zadnjaNapaka, razlog} shows Resend failures since last start without Render logs.
- 4 Nov PR #303 live: daily DB backups /var/data/kopije (7 + 3 manual), `node scripts/obnovi-kopijo.js [--zdaj|--preveri|<datum>|--preklici|--razveljavi]` (restore applies at restart within 1 h); healthz `kopije`. Restore drill for j in docs/objava.md not yet done on Render. Under-15: POST /api/auth/ask-parent emails parent (web+app). PR #321: admin may have profiles open on several devices.
