# Predaja: nit »Login/Render« (cmsg_011HYzNBAS5HRU1H7PcSE7JtPiY8RRPEg61WV3A3TCYhmu)

Stanje 4. 11. 2026 ~02:30 UTC. Vse PR te niti so združeni, nobena veja ni odprta. Opomnikov (send_later) ni.

## Prvo delo nove niti
1. Preveri produkcijo po združitvah: `npm test` na `main`, nato živi preizkus na https://evklid.app
   (`curl https://evklid.app/healthz/stanje` → `razlicica` = zadnji commit main; prijava, profil, /prenesi).
2. Odprto vprašanje e-pošte (spodaj).

## Odprto: potrditveni e-mail ne pride (j, 3. 11. 18:28 UTC)
- Naslov: <Lukov e-naslov> (Lukov račun). j: »Zakaj evklid ne pošilja confirmation mailov«.
- Preverjeno: DNS za Resend na evklid.app je v redu (resend._domainkey TXT, send.evklid.app MX/SPF
  → forge.rmta.net, MX root Cloudflare Email Routing). Koda pošiljanja (server/accounts/email.js,
  register v server/accounts/index.js ~l. 458 `sendMail`) se od 30. 10. ni spremenila. Napaka pošiljanja
  se samo zapiše v dnevnik Renderja (`[evklid] pošiljanje e-pošte ni uspelo:`), registracija uspe vseeno.
- j sem prosil (sporočilo v niti): Resend → Emails poišči naslov (Delivered/Bounced/ga ni), Luka naj
  pogleda Spam/Promocije. Hitra rešitev: Render → evklid → Shell →
  `node scripts/potrdi-racun.js <Lukov e-naslov>`. **j še ni odgovoril.**
- Če ga v Resend ni: preveri Render dnevnik (j pošlje posnetek) – morda RESEND_API_KEY potekel/preklican
  ali omejitev brezplačnega Resend (100/dan, 3000/mesec).
- Možna izboljšava (ni narejena): v aplikaciji pokazati, da pošiljanje ni uspelo, in gumb »Pošlji znova«
  že obstaja (/api/auth/resend-verification).

## Narejeno v tej niti (vse združeno)
- Selitev na Render (30. 10.): render.yaml, NODE_VERSION 22, disk /var/data, evklid.app → Render
  (Cloudflare CNAME, DNS only). Pomnilnik: evklid-render.md.
- Samodejne objave: .github/workflows/render-posodobitev.yml + scripts/render-objava.js (PR #183, #205):
  ob vsaki združitvi v main počaka miren strežnik (nihče aktiven 10 min), najdlje 3 h, med objavama ≥ 1 h.
- PR #225 Geslo samo enkrat na napravo: seja 365 dni, odklep profila 365 dni na napravo, odjava ne zaklepa,
  zaklep zavihka Račun privzeto izklopljen (`EVKLID_ACCOUNT_LOCK=1` ga vklopi). j izbral »Da, geslo res samo enkrat«.
- PR #229 Aplikacija: ostani prijavljen iz brskalnika (server/mobile/app-link.js, /prenesi gumb
  »Odpri Evklid in ostani prijavljen«, evklid://prijava?t=…, 15 min, enkrat, potrditev računa v aplikaciji),
  aplikacija začne na prijavi (redirectTo), detectLanguage brez Intl.Locale. Do telefonov pride z
  naslednjim APK (j zgradi na expo.dev; dodano na seznam odločitev).
- PR #234 Geslo profila samo pri več profilih (j izbral na kartici »Samo pri več profilih«); ob drugem
  profilu se nastavi geslo tudi obstoječim; homeLanguage: angleška naprava v Europe/Ljubljana → slovenščina.

## Odločitve j
- Začni na novo na Renderju (stara baza ostane na PC).
- Geslo samo enkrat na napravo; otrok na napravi, kjer je starš prijavljen, lahko odpre Račun (izvoz/izbris
  vseeno zahtevata geslo računa).
- Geslo profila samo pri več profilih.

## Skrivnosti (samo kje, brez vrednosti)
- Render → evklid → Environment: ANTHROPIC_API_KEY, RESEND_API_KEY, RESEND_FROM, EVKLID_BASE_URL,
  EVKLID_EXPORT_TOKEN, EVKLID_DATA_KEY, Stripe ključi, NODE_VERSION. Vpisuje jih j sam.
- GitHub → Settings → Secrets → Actions: RENDER_DEPLOY_HOOK (Render Deploy Hook URL).
- Resend: domena evklid.app (EU), j ima račun.

## Povezave
- PR: #179, #183, #205, #225, #229, #234 (github.com/jakobskerbis/Evklid).
- Seznam odločitev za j: https://claude.ai/artifact/BUjXwR9kj1ZUwouhV4yuxm
- Dokumentacija: docs/objava.md, docs/posodobitve.md, docs/mobilna-aplikacija.md.
