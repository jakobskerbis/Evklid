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
        signal: AbortSignal.timeout(30_000), // obdelava dogodka Stripe ne sme čakati na pošto dlje od prevzema (točka A7)
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

// minor: mladoletni imetnik (15–17 let, račun zase; #747 točka 2) dobi besedilo s »ti« brez izjave zakonitega
// zastopnika (za otroka mlajšega od 15 let profil ustvari starš s svojim računom). Polnoletni: besedilo kot prej.
export function verifyEmail(url, { minor = false } = {}) {
  if (minor)
    return {
      subject: "Potrdi e-naslov za Evklid",
      html: layout(
        "Potrdi svoj e-naslov",
        `<p>Živjo! S klikom na gumb potrdiš svoj e-naslov za Evklid. Učiš se lahko že zdaj, s potrditvijo pa račun zavaruješ in dobiš več vprašanj za inštruktorja.</p>${button(url, "Potrdi e-naslov")}<p style="font-size:13px;color:#5f6779">Povezava velja 7 dni. Če se nisi registriral(a), sporočilo prezri.</p>`,
      ),
      text: `Potrdi e-naslov za Evklid: ${url}\nPovezava velja 7 dni.`,
    };
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
      `<p>${who} bi rad(a) uporabljal(a) Evklid, inštruktorja AI za matematiko, fiziko, kemijo, biologijo in naravoslovje. Za otroke račun ustvari starš ali skrbnik.</p><p>Na spodnji povezavi piše, kaj je Evklid, katere podatke hranimo in koliko stane. Ko ustvarite račun in dodate otrokov profil, se lahko začne učiti.</p>${button(url, "Preberite več in ustvarite račun")}<p style="font-size:13px;color:#5f6779">Če otroka ne poznate, sporočilo prezrite. Vašega e-naslova nismo shranili.</p>`,
    ),
    text: `${name || "Vaš otrok"} bi rad(a) uporabljal(a) Evklid, inštruktorja AI za matematiko, fiziko, kemijo, biologijo in naravoslovje. Za otroke račun ustvari starš ali skrbnik. Več in registracija: ${url}`,
  };
}

export function resetEmail(url) {
  return {
    subject: "Novo geslo za Evklid",
    html: layout("Nastavite novo geslo", `<p>Za novo geslo kliknite spodnji gumb. Povezava velja 1 uro.</p>${button(url, "Nastavite novo geslo")}<p style="font-size:13px;color:#5f6779">Če niste zahtevali novega gesla, sporočilo prezrite.</p>`),
    text: `Novo geslo za Evklid (velja 1 uro): ${url}`,
  };
}

// Na račun je bila dodana prijava z Apple (server/mobile/apple-signin.js): vse druge naprave so odjavljene.
export function appleLinkedEmail() {
  return {
    subject: "Prijava z Apple za Evklid",
    html: layout(
      "Dodana je prijava z Apple",
      "<p>Na vaš račun Evklid je bila pravkar dodana prijava z Apple.</p><p>Če tega niste naredili vi, takoj nastavite novo geslo s povezavo »Pozabljeno geslo« na strani za prijavo: s tem odstranimo prijavo z Apple in odjavimo vse naprave.</p>",
    ),
    text: "Na vaš račun Evklid je bila pravkar dodana prijava z Apple. Če tega niste naredili vi, takoj nastavite novo geslo s povezavo »Pozabljeno geslo« na strani za prijavo: s tem odstranimo prijavo z Apple in odjavimo vse naprave.",
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
export function allowanceEmail({ childName, stage, left, untilText, pool = false, topup = true }, appUrl) {
  const n = BRAND.name;
  if (pool) childName = "Skupni delež družine";
  const body =
    stage === "out"
      ? `${childName}: podrobne razlage za to obdobje so porabljene. Inštruktor odgovarja naprej v hitrem načinu, nove razlage so na voljo ${untilText}.`
      : `${childName}: porabljenih je 80 % podrobnih razlag za to obdobje, ostalo jih je še približno ${left}. Ko jih zmanjka, inštruktor odgovarja naprej v hitrem načinu.`;
  return {
    subject: stage === "out" ? `${n}: podrobne razlage za to obdobje so porabljene` : `${n}: porabljenih 80 % podrobnih razlag`,
    // topup false: pilot in lastnik (brez ponudbe dokupa, pregled #477 B3).
    html: layout("Podrobne razlage v tem obdobju", `<p>${esc(body)}</p>${topup ? "<p>Več razlag lahko dokupite v zavihku Račun.</p>" : ""}${button(appUrl, `Odprite ${n}`)}`),
    text: topup ? `${body} Več razlag dokupite v zavihku Račun: ${appUrl}` : `${body} ${appUrl}`,
  };
}

// Enkratno obvestilo o spremenjeni politiki zasebnosti (scripts/obvestilo-zasebnost.js). Besedilo potrdi j, preden
// se pošlje; skripta brez --poslji ničesar ne pošlje. Točke opisujejo trenutno različico (PRIVACY_VERSION 2026-11-18,
// #817); prejšnja (6. 11. 2026) je v zgodovini git. dateText poda klicatelj (privacyDateText).
const MESECI = ["januarja", "februarja", "marca", "aprila", "maja", "junija", "julija", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
export const privacyDateText = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return `${d}. ${MESECI[m - 1]} ${y}`;
};
export function privacyChangeEmail(policyUrl, dateText) {
  const points = [
    "Fotografije nalog v pogovorih z inštruktorjem hranimo 7 dni, nato ostane samo besedilo pogovora.",
    "Natančneje piše, kdo vidi otrokove podatke: celoten profil vidite samo vi in otrok. Če je otrok v razredu, učitelj vidi samo vzdevek in avatar, oznako, ki jo vpiše učitelj, točke na lestvici razreda ter rezultate pri temah in kvizih, ki jih da razredu.",
    "Pri šolski licenci je za podatke razreda upravljavec šola, za otrokov profil pa ostanemo upravljavec mi.",
    "Enkrat na dan naredimo šifrirano varnostno kopijo baze, ki je shranjena v EU in jo izbrišemo po 30 dneh.",
  ];

  const text = `Pozdravljeni,\n\n${dateText} smo posodobili pravila zasebnosti za Evklid. Glavne spremembe:\n\n${points.map((p) => `- ${p}`).join("\n")}\n\nNič vam ni treba narediti. Celotna pravila: ${policyUrl}\n\nEkipa Evklid`;
  return {
    subject: "Evklid: posodobili smo pravila zasebnosti",
    text,
    html: layout(
      "Posodobili smo pravila zasebnosti",
      `<p>${esc(dateText)} smo posodobili pravila zasebnosti za Evklid. Glavne spremembe:</p><ul>${points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul><p>Nič vam ni treba narediti.</p>${button(policyUrl, "Preberite pravila")}`,
    ),
  };
}

// Enkratna koda za potrditev imetnika računa brez gesla (prijava z Apple): skrivanje obvestila o zasebnosti,
// odgovor o plačilu, izbris fotografij pilota.
// Točka A9: koda za skrbniški dostop. Če je skrbnik ni zahteval, nekdo pozna njegovo geslo.
export function skrbnikKodaEmail(code) {
  const opomba = "Velja 10 minut. Če je niste zahtevali, nekdo pozna vaše geslo: takoj ga zamenjajte.";
  return {
    subject: "Evklid: koda za skrbniški dostop",
    text: `Vaša koda za skrbniški dostop v Evklidu: ${code}\n\n${opomba}`,
    html: layout("Koda za skrbniški dostop", `<p>Vaša koda za skrbniški dostop v Evklidu:</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${esc(code)}</p><p style="font-size:13px;color:#5f6779">${esc(opomba)}</p>`),
  };
}

export function ownerCodeEmail(code) {
  return {
    subject: "Evklid: koda za potrditev",
    text: `Vaša koda za potrditev v Evklidu: ${code}\n\nVelja 10 minut. Če je niste zahtevali, sporočilo prezrite.`,
    html: layout("Koda za potrditev", `<p>Vaša koda za potrditev v Evklidu:</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${esc(code)}</p><p style="font-size:13px;color:#5f6779">Velja 10 minut. Če je niste zahtevali, sporočilo prezrite.</p>`),
  };
}

// Potrdilo o nakupu (trajni nosilec, ZVPot-1; #765 točka 3, j 2026-11-17): kaj je kupljeno, cena (pri preizkusu še
// prvo plačilo), potrditve, ki jih je plačnik označil (tudi izjava o odstopu), različica pogojev in kako odstopi
// (withdrawal: kaj vrnemo po vrsti nakupa, server/accounts/potrdilo.js withdrawalNote). Vikanje (plačnik je odrasel).
export function purchaseEmail({ item, paidText, firstCharge = "", dateText, statements = [], lang = "sl", termsUrl, termsVersion, withdrawUrl, contact, withdrawal = "", appUrl }) {
  const n = BRAND.name;
  const list = statements.map((s) => `<li>${esc(s)}</li>`).join("");
  const translated = lang && lang !== "sl" ? `V aplikaciji ste potrditve brali v prevodu (jezik: ${lang}); tu je slovensko besedilo, ki smo ga shranili.` : "";
  const how = `V 14 dneh od nakupa lahko od pogodbe odstopite brez navedbe razloga: na strani ${withdrawUrl} (»Kliknite tukaj za odstop od pogodbe«) ali z jasno izjavo na ${contact}.`;
  return {
    subject: `${n}: potrdilo o nakupu`,
    html: layout(
      "Potrdilo o nakupu",
      `<p>Hvala za nakup. To sporočilo shranite: je vaše potrdilo o sklenjeni pogodbi.</p>
<p><b>Kupljeno:</b> ${esc(item)}<br><b>Plačano ob nakupu:</b> ${esc(paidText)}${firstCharge ? `<br><b>Prvo plačilo:</b> ${esc(firstCharge)}` : ""}<br><b>Datum:</b> ${esc(dateText)}</p>
<p><b>Pred plačilom ste potrdili:</b></p><ul>${list}</ul>${translated ? `<p>${esc(translated)}</p>` : ""}
<p><b>Splošni pogoji uporabe</b>, različica ${esc(termsVersion)}: <a href="${esc(termsUrl)}">${esc(termsUrl)}</a></p>
<p><b>Odstop od pogodbe.</b> V 14 dneh od nakupa lahko od pogodbe odstopite brez navedbe razloga: <a href="${esc(withdrawUrl)}">kliknite tukaj za odstop od pogodbe</a> ali pošljite jasno izjavo na <a href="mailto:${esc(contact)}">${esc(contact)}</a>.${withdrawal ? ` ${esc(withdrawal)}` : ""}</p>
<p>Račune najdete v zavihku Račun (»Upravljaj naročnino in račune«).</p>${button(appUrl, `Odprite ${n}`)}`,
    ),
    text: [
      "Potrdilo o nakupu",
      "Hvala za nakup. To sporočilo shranite: je vaše potrdilo o sklenjeni pogodbi.",
      `Kupljeno: ${item}`,
      `Plačano ob nakupu: ${paidText}`,
      ...(firstCharge ? [`Prvo plačilo: ${firstCharge}`] : []),
      `Datum: ${dateText}`,
      "Pred plačilom ste potrdili:",
      ...statements.map((s) => `- ${s}`),
      ...(translated ? [translated] : []),
      `Splošni pogoji uporabe, različica ${termsVersion}: ${termsUrl}`,
      `Odstop od pogodbe: ${how}${withdrawal ? ` ${withdrawal}` : ""}`,
      `Račune najdete v zavihku Račun (»Upravljaj naročnino in račune«): ${appUrl}`,
    ].join("\n"),
  };
}

// Potrdilo o prejemu spletnega obvestila o odstopu od pogodbe (ZVPot-1A, 138.a člen, 4. odstavek): na trajnem nosilcu
// (e-pošta), brez nepotrebnega odlašanja, z vsebino obvestila ter datumom in uro oddaje. Vikanje (plačnik je odrasel).
// auto: odstop izvedemo takoj (prijavljen imetnik, pogodba v roku); sicer ga pregledamo in vam odgovorimo.
// Brez prijave pošljemo samo besedilo (text), brez HTML in povezav (server/placila/odstop.js).
export function withdrawalAckEmail({ name, email, contract, details = "", submitted, refundText = "", auto = false, contact, appUrl = "" }) {
  const n = BRAND.name;
  const next = auto
    ? `Odstop izvedemo takoj: naročnino ali nakup prekličemo${refundText ? `, vračilo ${refundText} pa pošljemo na isto plačilno sredstvo (banka ga običajno pripiše v 5–10 dneh)` : ""}. Če kaj ne uspe, vam pišemo.`
    : "Obvestilo bomo pregledali in vam v nekaj dneh odgovorili. Vračilo izvedemo na isto plačilno sredstvo najpozneje v 14 dneh od prejema obvestila.";
  const rows = [
    ["Ime in priimek", name],
    ["E-naslov za potrdilo", email],
    ["Pogodba", contract],
    ...(details ? [["Dodatno", details]] : []),
    ["Oddano", submitted],
  ];
  const intro = "Prejeli smo vaše obvestilo o odstopu od pogodbe. To sporočilo je potrdilo o prejemu vašega obvestila z datumom in uro oddaje.";
  return {
    subject: `${n}: potrdilo o prejemu odstopa od pogodbe`,
    html: layout(
      "Potrdilo o prejemu odstopa od pogodbe",
      `<p>${esc(intro)}</p>
<p><b>Vsebina obvestila</b></p>
<p>Obveščam vas, da odstopam od pogodbe.<br>${rows.map(([k, v]) => `<b>${esc(k)}:</b> ${esc(v)}`).join("<br>")}</p>
<p>${esc(next)}</p>
<p>Vprašanja: ${esc(contact)}</p>${appUrl ? button(appUrl, `Odprite ${n}`) : ""}`,
    ),
    text: ["Potrdilo o prejemu odstopa od pogodbe", intro, "", "Vsebina obvestila:", "Obveščam vas, da odstopam od pogodbe.", ...rows.map(([k, v]) => `${k}: ${v}`), "", next, `Vprašanja: ${contact}`].join("\n"),
  };
}

// Skrbniku: obvestilo o odstopu, ki ni bilo izvedeno samodejno (vračilo mora biti v 14 dneh od prejema).
export function withdrawalAdminEmail({ id, status, source, submitted, contract, note = "", ackOk }) {
  const text = [
    `Novo obvestilo o odstopu od pogodbe št. ${id} čaka obdelavo.`,
    `Oddano: ${submitted} (${source === "app" ? "prijavljen imetnik" : "brez prijave"})`,
    `Pogodba: ${contract}`,
    `Stanje: ${status}${note ? ` (${note})` : ""}`,
    `Potrdilo kupcu: ${ackOk === 1 ? "poslano" : ackOk === -1 ? "zadržano (meja)" : "NI poslano"}`,
    "Obdelaj v zavihku Račun → Odstopi od pogodbe. Vračilo mora biti izvedeno najpozneje v 14 dneh od prejema.",
  ];
  return { subject: `${BRAND.name}: odstop od pogodbe čaka (št. ${id})`, text: text.join("\n"), html: layout("Odstop od pogodbe čaka", text.map((l) => `<p>${esc(l)}</p>`).join("")) };
}

// Neaktiven račun (server/accounts/neaktivni.js): več kot 12 mesecev brez prijave. Samo imetniku računa; minor:
// mladoletni imetnik ali račun samo »Zame« brez datuma rojstva dobi besedilo s »ti«. Servisno sporočilo, ne oglas.
export const INACTIVE_FOOTER =
  `To sporočilo dobite kot imetnik računa Evklid; ni oglasno. Namesto klika lahko odprete ${BRAND.domain} sami. Upravljavec: Jakob Skerbiš, zasebnost@${BRAND.domain}.`;
const INACTIVE_FOOTER_TI =
  `To sporočilo dobiš kot imetnik računa Evklid; ni oglasno. Namesto klika lahko odpreš ${BRAND.domain} sam(a). Upravljavec: Jakob Skerbiš, zasebnost@${BRAND.domain}.`;
export function inactiveEmail({ appUrl, accountUrl, dateText, minor = false }) {
  const t = minor
    ? {
        body: `V Evklid se že več kot eno leto nisi prijavil(a). Če računa do ${dateText} ne uporabiš (s prijavo ali uporabo aplikacije), ga bomo z vsemi podatki profilov izbrisali.`,
        keep: "Račun obdržiš s prijavo.",
        btn: "Prijavi se",
        del: (a) => `Če računa ne potrebuješ več, ga lahko ${a} sam(a) v zavihku Račun (»Izbriši račun in vse podatke«).`,
        delWord: "izbrišeš",
        hello: "Živjo",
        subject: "Evklid: ali še uporabljaš svoj račun?",
        title: "Ali še uporabljaš svoj račun?",
        foot: INACTIVE_FOOTER_TI,
      }
    : {
        body: `V Evklid se že več kot eno leto niste prijavili. Če računa do ${dateText} ne uporabite (s prijavo ali uporabo aplikacije), ga bomo z vsemi podatki profilov izbrisali.`,
        keep: "Račun obdržite s prijavo.",
        btn: "Prijavite se",
        del: (a) => `Če računa ne potrebujete več, ga lahko ${a} sami v zavihku Račun (»Izbriši račun in vse podatke«).`,
        delWord: "izbrišete",
        hello: "Pozdravljeni",
        subject: "Evklid: ali še uporabljate svoj račun?",
        title: "Ali še uporabljate svoj račun?",
        foot: INACTIVE_FOOTER,
      };
  return {
    subject: t.subject,
    text: `${t.hello},\n\n${t.body}\n\n${t.keep} ${appUrl}\n${t.del(t.delWord)} ${accountUrl}\n\nEkipa Evklid\n\n${t.foot}`,
    html: layout(
      t.title,
      `<p>${esc(t.body)}</p><p>${esc(t.keep)}</p>${button(appUrl, t.btn)}<p style="font-size:13px;color:#5f6779">${t.del(`<a href="${esc(accountUrl)}">${t.delWord}</a>`)}</p>`,
      esc(t.foot),
    ),
  };
}
