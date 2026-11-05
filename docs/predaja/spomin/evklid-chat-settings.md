---
name: evklid-chat-settings
description: Tutor changes app settings from chat (PR #103, 2026-10-29): tools, registry, scope rules from j (no financial/personal data)
metadata:
  type: project
  modified: 2026-10-29T13:48:44.844Z
---

j asked (2026-10-29 13:34–13:36): the Inštruktor can change settings when asked in chat (e.g. study year, customization); full access to ALL app settings EXCEPT financial info (plans, payments, prices, codes, account) and personal data (name, e-mail, password, age, parents, nickname).

Built in PR #103 (merged 2026-10-29):
- `public/settings-registry.js` = single list of every changeable setting (profile + device). New setting in the app → add an entry there; `test/chat-settings.test.js` fails if a Settings form field has no entry.
- `server/chat-settings.js`: model tools `get_settings` / `change_settings` (static, cached with the prompt ~1500 tokens), validation (programme by name, »drugi letnik«, course by name), mock-mode parser. School system / stage / grade-year / programme are only proposed → card »Spremenim šolo in letnik?« under the reply (button PUT) or »da« in chat (`confirmed=true` accepted only for the same pending proposal, kept in memory per conversation 30 min).
- `server/claude.js` streamReply has a tool loop (max 3 rounds, usage summed). Answers that used tools are not stored in answer_cache.
- Client: `public/chat-settings.js` applies device settings (theme/colours, reply speed, fullscreen, calculator, writing pad, game sound/speed) and sends a device snapshot with each message.

**Why:** j wants the tutor to act as a settings assistant, but never touch money or personal data.
**How to apply:** don't add financial/personal keys to the registry or tools; avatar/notification settings don't exist yet — add them to the registry when the games/avatar thread builds them. See [[evklid-prompt]], [[evklid-ui-design]].
