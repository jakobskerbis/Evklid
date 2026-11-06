// Pošiljanje e-pošte prek Resend. Brez ključa se sporočilo izpiše v dnevnik (razvoj).
import { BRAND } from "../brand.js";

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export class Mailer {
  constructor({ apiKey = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM, fetchFn = globalThis.fetch, log = console.log } = {}) {
    this.key = apiKey;
    this.from = from || "Evklid <onboarding@resend.dev>";
    this.fetch = fetchFn;
    this.log = log;
    // Stanje pošiljanja od zagona (za /healthz/stanje): ali Resend sprejema sporočila, brez naslovov.
    this.stats = { poslanih: 0, napak: 0, zadnjiUspeh: null, zadnjaNapaka: null, razlog: null };
  }
  get enabled() {
    return !!this.key;
  }
  async send({ to, subject, html, text }) {
    if (!this.key) {
      // Na javnem strežniku brez e-naslova in vsebine (povezave za novo geslo so kot geslo); lokalno cela vsebina.
      const prod = process.env.NODE_ENV === "production" || /^https:/i.test(process.env.EVKLID_BASE_URL || "");
      this.log(prod ? `[evklid] E-pošta ni poslana (Resend ni nastavljen): ${subject}` : `[evklid] E-pošta (Resend ni nastavljen) za ${to}: ${subject}\n${text || ""}`);
      return { id: null, dev: true };
    }
    let res;
    try {
      res = await this.fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: this.from, to: [to], subject, html, text }),
      });
    } catch (err) {
      this.failed(`omrežje: ${err.message}`);
      throw err;
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = body?.message || `Resend ${res.status}`;
      this.failed(`${res.status} ${msg}`);
      throw new Error(msg);
    }
    this.stats.poslanih++;
    this.stats.zadnjiUspeh = new Date().toISOString();
    return body;
  }
  failed(reason) {
    this.stats.napak++;
    this.stats.zadnjaNapaka = new Date().toISOString();
    // Brez e-naslovov: stanje je javno.
    this.stats.razlog = String(reason).replace(/[^\s<>"']+@[^\s<>"']+/g, "…").slice(0, 200);
  }
  status() {
    return { nastavljena: this.enabled, ...this.stats };
  }
}

export function layout(title, inner, footer = "") {
  return `<!doctype html><html lang="sl"><body style="margin:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#1d2433">
<div style="max-width:560px;margin:0 auto;padding:24px">
<div style="font-size:22px;font-weight:bold;margin-bottom:16px">${BRAND.wordmark[0]}<span style="color:#4f6bed">${BRAND.wordmark[1]}</span></div>
<div style="background:#fff;border-radius:12px;padding:24px">
<h1 style="font-size:20px;margin:0 0 16px">${esc(title)}</h1>
${inner}
</div>
<p style="font-size:12px;color:#5f6779;margin-top:16px">${footer}</p>
</div></body></html>`;
}

export const button = (href, label) =>
  `<p style="margin:24px 0"><a href="${esc(href)}" style="background:#4f6bed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">${esc(label)}</a></p>`;

export function verifyEmail(url) {
  return {
    subject: "Potrdite e-naslov za Evklid",
    html: layout(
      "Potrdite svoj e-naslov",
      `<p>Pozdravljeni! S klikom na gumb potrdite svoj e-naslov in izjavite, da ste zakoniti zastopnik otroka, ki bo uporabljal Evklid.</p>${button(url, "Potrdite e-naslov")}<p style="font-size:13px;color:#5f6779">Povezava velja 7 dni. Če se niste registrirali, to sporočilo prezrite.</p>`,
    ),
    text: `Potrdite e-naslov za Evklid: ${url}\nPovezava velja 7 dni.`,
  };
}

// Prošnja otroka, mlajšega od starosti digitalne privolitve: starš dobi povezavo na stran za starše.
// Naslova starša ne shranimo; ime je neobvezno in že očiščeno (samo črke, presledki, vezaji).
export function parentInviteEmail(url, name = "") {
  const who = name ? esc(name) : "Vaš otrok";
  return {
    subject: "Prošnja za dovoljenje za Evklid", // stalna zadeva: ime, ki ga vpiše obiskovalec, je samo v besedilu
    html: layout(
      "Prošnja za dovoljenje",
      `<p>${who} bi rad(a) uporabljal(a) Evklid, inštruktorja AI za matematiko, fiziko in kemijo. Za otroke račun ustvari starš ali skrbnik.</p><p>Na spodnji povezavi piše, kaj je Evklid, katere podatke hranimo in koliko stane. Ko ustvarite račun in dodate otrokov profil, se lahko začne učiti.</p>${button(url, "Preberite več in ustvarite račun")}<p style="font-size:13px;color:#5f6779">Če otroka ne poznate, sporočilo prezrite. Vašega e-naslova nismo shranili.</p>`,
    ),
    text: `${name || "Vaš otrok"} bi rad(a) uporabljal(a) Evklid, inštruktorja AI za matematiko, fiziko in kemijo. Za otroke račun ustvari starš ali skrbnik. Več in registracija: ${url}`,
  };
}

export function resetEmail(url) {
  return {
    subject: "Novo geslo za Evklid",
    html: layout("Nastavite novo geslo", `<p>Za novo geslo kliknite spodnji gumb. Povezava velja 1 uro.</p>${button(url, "Nastavite novo geslo")}<p style="font-size:13px;color:#5f6779">Če niste zahtevali novega gesla, sporočilo prezrite.</p>`),
    text: `Novo geslo za Evklid (velja 1 uro): ${url}`,
  };
}

export function referralRewardEmail(appUrl) {
  return {
    subject: "Evklid: prislužili ste brezplačen mesec 🎁",
    html: layout("Hvala za priporočilo!", `<p>Družina, ki ste jo povabili, se je naročila na Evklid. Obe družini sta dobili en mesec brezplačno.</p>${button(appUrl, "Odpri Evklid")}`),
    text: `Družina, ki ste jo povabili, se je naročila na Evklid. Obe družini sta dobili en mesec brezplačno. ${appUrl}`,
  };
}

// Neuspelo plačilo naročnine: poln dostop ostane še nekaj dni, starš posodobi kartico v zavihku Račun.
export function paymentFailedEmail(appUrl, graceDays) {
  return {
    subject: "Evklid: plačilo naročnine ni uspelo",
    html: layout(
      "Plačilo ni uspelo",
      `<p>Zadnje plačilo naročnine ni uspelo. Poln dostop ostane še ${graceDays} dni.</p><p>V zavihku Račun kliknite »Upravljaj naročnino in račune« in posodobite kartico. Če tega ne storite, profili preidejo na brezplačni paket. Noben podatek se ne izbriše.</p>${button(appUrl, "Odpri Evklid")}`,
    ),
    text: `Plačilo naročnine za Evklid ni uspelo. Poln dostop ostane še ${graceDays} dni. Kartico posodobite v zavihku Račun: ${appUrl}`,
  };
}

// 7 dni pred koncem aktivacijske kode.
export function promoEndingEmail(untilText, appUrl) {
  return {
    subject: "Evklid: brezplačni dostop se kmalu konča",
    html: layout(
      "Brezplačni dostop se kmalu konča",
      `<p>Poln dostop z aktivacijsko kodo velja do ${esc(untilText)}. Potem profili preidejo na brezplačni paket, napredek pa ostane.</p><p>Če želite nadaljevati brez omejitev, izberite naročnino v zavihku Račun. Prvo plačilo bo šele po koncu kode.</p>${button(appUrl, "Odpri Evklid")}`,
    ),
    text: `Poln dostop z aktivacijsko kodo za Evklid velja do ${untilText}. Naročnino lahko izberete v zavihku Račun: ${appUrl}`,
  };
}

// Osebno ob šolski licenci: licenca ne velja več, zato se naročnina ob koncu obdobja ne podaljša.
export function schoolSubEndEmail(endText, regularText, appUrl) {
  const body = `Vaš otrok nima več šolske licence, zato se naročnina »Osebno ob šolski licenci« ne bo samodejno podaljšala.${endText ? ` Velja še do ${endText} in do takrat ostane vse kot zdaj.` : ""} Če želite Evklid uporabljati tudi potem, v zavihku Račun izberite redno naročnino (od ${regularText} na mesec).`;
  return {
    subject: "Evklid: naročnina ob šolski licenci se ne bo podaljšala",
    html: layout("Naročnina se ne bo podaljšala", `<p>${esc(body)}</p>${button(appUrl, "Odpri Evklid")}`),
    text: `${body} ${appUrl}`,
  };
}

// 30 dni pred samodejno obnovitvijo letne naročnine.
export function renewalEmail(dateText, amountText, appUrl) {
  return {
    subject: "Evklid: letna naročnina se bo obnovila",
    html: layout(
      "Letna naročnina se bo obnovila",
      `<p>Vaša letna naročnina na Evklid se bo samodejno obnovila ${esc(dateText)} za ${esc(amountText)}.</p><p>Če je ne želite podaljšati, jo do takrat prekličite v zavihku Račun (»Upravljaj naročnino in račune«).</p>${button(appUrl, "Odpri Evklid")}`,
    ),
    text: `Vaša letna naročnina na Evklid se bo samodejno obnovila ${dateText} za ${amountText}. Prekličete jo v zavihku Račun: ${appUrl}`,
  };
}

// Nova cena ob prehodu stopnje (j 2026-11-01): 30 dni pred podaljšanjem, ko velja nova cena.
// up: nova cena je višja (prehod navzgor), sicer nižja (prehod navzdol ali konec starega paketa).
export function planChangeEmail({ planText, amountText, dateText, up }, appUrl) {
  const n = BRAND.name;
  const body = up
    ? `Od ${dateText} bo vaša naročnina na ${n} veljala za paket ${planText}: ${amountText}. Do takrat ostane stara cena, profil ima novo stopnjo odprto že zdaj. Napredek ostane.`
    : `Od ${dateText} bo vaša naročnina na ${n} cenejša: paket ${planText}, ${amountText}. Do takrat ostane odprta tudi višja stopnja. Napredek ostane.`;
  return {
    subject: `${n}: nova cena naročnine od ${dateText}`,
    html: layout("Nova cena naročnine", `<p>${esc(body)}</p><p>Če naročnine ne želite podaljšati, jo do takrat prekličite v zavihku Račun (»Upravljaj naročnino in račune«).</p>${button(appUrl, `Odprite ${n}`)}`),
    text: `${body} Naročnino prekličete v zavihku Račun: ${appUrl}`,
  };
}

// Poraba podrobnih razlag pri profilu otroka, mlajšega od 15 let (j 2026-11-01): starš dobi e-pošto pri 80 % in
// 100 %. Brez zneskov: samo, koliko razlag je še ostalo. Inštruktor odgovarja naprej v hitrem načinu.
// Družina (pool): skupen delež vseh profilov, zato brez imena otroka.
export function allowanceEmail({ childName, stage, left, untilText, pool = false }, appUrl) {
  const n = BRAND.name;
  if (pool) childName = "Skupni delež družine";
  const body =
    stage === "out"
      ? `${childName}: podrobne razlage za ta mesec so porabljene. Inštruktor odgovarja naprej v hitrem načinu, nove razlage so na voljo ${untilText}.`
      : `${childName}: porabljenih je 80 % podrobnih razlag za ta mesec, ostalo jih je še približno ${left}. Ko jih zmanjka, inštruktor odgovarja naprej v hitrem načinu.`;
  return {
    subject: stage === "out" ? `${n}: podrobne razlage za ta mesec so porabljene` : `${n}: porabljenih 80 % podrobnih razlag`,
    html: layout("Podrobne razlage ta mesec", `<p>${esc(body)}</p><p>Več razlag lahko dokupite v zavihku Račun.</p>${button(appUrl, `Odprite ${n}`)}`),
    text: `${body} Več razlag dokupite v zavihku Račun: ${appUrl}`,
  };
}
