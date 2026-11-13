// Indija: izpitne naloge iz fizike (CBSE/NCERT, ICSE/ISC, državne šole, JEE, NEET), angleško in hindijsko.
// Vsak generator ima langs: ["en", "hi"] in gen(level, r, topic, lang); besedila z L = bi(lang).
// Vse naključne izbire so narejene pred izbiro besedil, zato da isto seme v obeh jezikih isto nalogo.
import { en, num, numM, task as baseTask, choiceWhy, bi, roundToL, fracTex, fraction, fractionM } from "./exam-util.js";

const T = (slug) => `FIZ-EXB/${slug}`;
const NAMES = [
  ["Aarav", "आरव"],
  ["Priya", "प्रिया"],
  ["Rohan", "रोहन"],
  ["Ananya", "अनन्या"],
  ["Kabir", "कबीर"],
  ["Meera", "मीरा"],
  ["Ishaan", "ईशान"],
  ["Diya", "दीया"],
];
// Količina v LaTeX: q("u", -15, "cm") → "u = -15\ \mathrm{cm}".
const q = (sym, x, u = "") => `${sym} = ${typeof x === "number" ? en(x) : x}${u ? `\\ \\mathrm{${u}}` : ""}`;
const near = (x, d) => Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-7;
// Navodilo za zaokroževanje le, kadar rezultat ni točen na d decimalk.
const RT = (x, d, lang) => (near(x, d) ? "" : roundToL(d, lang));
const rd = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
// "≈" ali "=" v rešitvi.
const eq = (x, d) => (near(x, d) ? "=" : "\\approx");
// Izbira z dvojezičnimi možnostmi: ok = [en, hi], wrong = [[[en, hi], [whyEn, whyHi]], …];
// napačne možnosti premeša (isti klici r v obeh jezikih), choiceWhy vzame prve tri.
const ch = (r, L, ok, wrong) => choiceWhy(r, L(...ok), r.shuffle(wrong).map(([o, w]) => [L(...o), L(...w)]));
const tx = (L, a) => `\\text{${L(...a)}}`;
// Rezultat: "= 484" (točno) ali "\approx 0.55" (zaokroženo na d decimalk).
const fx = (x, d) => (near(x, d) ? en(x) : en(x, d));
const ev = (x, d) => (near(x, d) ? `= ${en(x)}` : `\\approx ${en(x, d)}`);
// Zadnja vrstica rešitve, ki je samo račun, dobi "Answer:" / "उत्तर:".
const DEV = /[\u0900-\u097F]/;
const task = (o) => {
  const lines = String(o.solution || "").split("\n");
  const last = lines[lines.length - 1];
  if (last.startsWith("$")) lines[lines.length - 1] = (DEV.test(o.text) ? "उत्तर: " : "Answer: ") + last;
  return baseTask({ ...o, solution: lines.join("\n") });
};

// ---------- 1. Spherical mirrors (NCERT sign convention) ----------
const intOK = (x) => Math.abs(x - Math.round(x)) < 1e-9;
const MIR_REAL = [];
const MIR_VIRT = [];
const MIR_CVX = [];
for (const F of [5, 6, 8, 10, 12, 15, 16, 18, 20, 24, 25, 30]) {
  for (let U = 4; U <= 90; U++) {
    if (U > F && intOK((U * F) / (U - F)) && (U * F) / (U - F) <= 120) MIR_REAL.push([F, U]);
    if (U < F && intOK((U * F) / (F - U)) && (U * F) / (F - U) <= 120) MIR_VIRT.push([F, U]);
    if (U >= 6 && intOK((U * F) / (U + F))) MIR_CVX.push([F, U]);
  }
}
const mirV = (f, u) => 1 / (1 / f - 1 / u);

const MIRROR_USES = [
  {
    q: ["Which mirror is used as the rear-view mirror of a vehicle, and why?", "वाहनों में पश्च-दृश्य दर्पण के रूप में कौन-सा दर्पण लगाया जाता है, और क्यों?"],
    g: ["rear-view mirror", "पश्च-दृश्य दर्पण"],
    ok: ["Convex mirror: the image is always erect and diminished, and the field of view is wider", "उत्तल दर्पण: प्रतिबिंब सदैव सीधा और छोटा बनता है, तथा दृष्टि-क्षेत्र अधिक विस्तृत होता है"],
    wrong: [
      [["Concave mirror: it shows an enlarged image of the traffic behind", "अवतल दर्पण: यह पीछे के यातायात का बड़ा प्रतिबिंब दिखाता है"], ["For distant objects a concave mirror forms a real, inverted, diminished image, so it is not used here.", "दूर की वस्तुओं का अवतल दर्पण वास्तविक, उल्टा और छोटा प्रतिबिंब बनाता है, इसलिए इसे यहाँ नहीं लगाते।"]],
      [["Plane mirror: it gives the widest field of view", "समतल दर्पण: इससे दृष्टि-क्षेत्र सबसे अधिक विस्तृत होता है"], ["A convex mirror bulges outward and shows a wider area than a plane mirror of the same size.", "उत्तल दर्पण बाहर की ओर उभरा होता है और समान आकार के समतल दर्पण से बड़ा क्षेत्र दिखाता है।"]],
      [["Concave mirror: it always forms an erect image", "अवतल दर्पण: यह सदैव सीधा प्रतिबिंब बनाता है"], ["A concave mirror forms an erect image only when the object is between P and F.", "अवतल दर्पण सीधा प्रतिबिंब तभी बनाता है जब बिंब P और F के बीच हो।"]],
    ],
    sol: ["A convex mirror always gives a virtual, erect, diminished image and covers a wide area behind the vehicle.", "उत्तल दर्पण सदैव आभासी, सीधा और छोटा प्रतिबिंब बनाता है और वाहन के पीछे का बड़ा क्षेत्र दिखाता है।"],
  },
  {
    q: ["Which mirror is used as a shaving or make-up mirror, and why?", "दाढ़ी बनाने (शेविंग) या मेक-अप के लिए कौन-सा दर्पण प्रयोग होता है, और क्यों?"],
    g: ["shaving mirror", "शेविंग दर्पण"],
    ok: ["Concave mirror: with the face between P and F it gives an erect, enlarged image", "अवतल दर्पण: चेहरा P और F के बीच होने पर यह सीधा और बड़ा प्रतिबिंब बनाता है"],
    wrong: [
      [["Convex mirror: it gives an erect, enlarged image", "उत्तल दर्पण: यह सीधा और बड़ा प्रतिबिंब बनाता है"], ["A convex mirror always gives a diminished image.", "उत्तल दर्पण सदैव छोटा प्रतिबिंब बनाता है।"]],
      [["Plane mirror: it magnifies the face", "समतल दर्पण: यह चेहरे को आवर्धित करता है"], ["A plane mirror gives an image of the same size (m = 1).", "समतल दर्पण समान आकार का प्रतिबिंब बनाता है (m = 1)।"]],
      [["Concave mirror: with the face beyond C it gives an enlarged image", "अवतल दर्पण: चेहरा C से परे होने पर यह बड़ा प्रतिबिंब बनाता है"], ["Beyond C the image is real, inverted and diminished.", "C से परे रखने पर प्रतिबिंब वास्तविक, उल्टा और छोटा बनता है।"]],
    ],
    sol: ["Object between P and F of a concave mirror → virtual, erect, enlarged image behind the mirror.", "अवतल दर्पण के P और F के बीच बिंब → दर्पण के पीछे आभासी, सीधा और बड़ा प्रतिबिंब।"],
  },
  {
    q: ["Car headlights and torches use a mirror behind the bulb to send out a strong parallel beam. Which arrangement is correct?", "कार की हेडलाइट और टॉर्च में बल्ब के पीछे दर्पण लगाकर प्रकाश का प्रबल समांतर पुंज भेजा जाता है। कौन-सी व्यवस्था सही है?"],
    g: ["parallel beam", "समांतर पुंज"],
    ok: ["Concave mirror with the bulb at its principal focus", "अवतल दर्पण, जिसके मुख्य फोकस पर बल्ब हो"],
    wrong: [
      [["Concave mirror with the bulb at its centre of curvature", "अवतल दर्पण, जिसके वक्रता केंद्र पर बल्ब हो"], ["Rays from C are reflected back through C; they do not become parallel.", "C से चली किरणें परावर्तन के बाद वापस C से ही गुजरती हैं; वे समांतर नहीं होतीं।"]],
      [["Convex mirror with the bulb at its principal focus", "उत्तल दर्पण, जिसके मुख्य फोकस पर बल्ब हो"], ["The focus of a convex mirror is behind it, and a convex mirror spreads light out.", "उत्तल दर्पण का फोकस उसके पीछे होता है, और यह प्रकाश को फैलाता है।"]],
      [["Plane mirror placed close to the bulb", "बल्ब के पास रखा समतल दर्पण"], ["A plane mirror sends diverging light back still diverging.", "समतल दर्पण अपसारी प्रकाश को अपसारी ही लौटाता है।"]],
    ],
    sol: ["Rays from the principal focus of a concave mirror become parallel to the principal axis after reflection.", "अवतल दर्पण के मुख्य फोकस से चली किरणें परावर्तन के बाद मुख्य अक्ष के समांतर हो जाती हैं।"],
  },
  {
    q: ["A solar furnace concentrates sunlight to produce a high temperature. Which mirror is used and where is the furnace placed?", "सौर भट्टी में सूर्य का प्रकाश एक जगह केंद्रित करके उच्च ताप प्राप्त किया जाता है। कौन-सा दर्पण प्रयोग होता है और भट्टी कहाँ रखी जाती है?"],
    g: ["solar furnace", "सौर भट्टी"],
    ok: ["Concave mirror, furnace at its principal focus", "अवतल दर्पण, भट्टी उसके मुख्य फोकस पर"],
    wrong: [
      [["Concave mirror, furnace at its centre of curvature", "अवतल दर्पण, भट्टी उसके वक्रता केंद्र पर"], ["Parallel rays from the Sun meet at F, not at C.", "सूर्य से आने वाली समांतर किरणें C पर नहीं, F पर मिलती हैं।"]],
      [["Convex mirror, furnace at its principal focus", "उत्तल दर्पण, भट्टी उसके मुख्य फोकस पर"], ["A convex mirror diverges sunlight; it cannot concentrate it.", "उत्तल दर्पण सूर्य के प्रकाश को फैलाता है; वह उसे केंद्रित नहीं कर सकता।"]],
      [["Plane mirror, furnace in front of it", "समतल दर्पण, भट्टी उसके सामने"], ["A plane mirror reflects parallel light as parallel light; it does not concentrate it.", "समतल दर्पण समांतर प्रकाश को समांतर ही परावर्तित करता है; वह उसे केंद्रित नहीं करता।"]],
    ],
    sol: ["Parallel rays from the Sun converge at the principal focus of a concave mirror, so the heat is concentrated there.", "सूर्य की समांतर किरणें अवतल दर्पण के मुख्य फोकस पर अभिसरित होती हैं, इसलिए ऊष्मा वहीं केंद्रित होती है।"],
  },
];

// Narava slike glede na lego predmeta (konkavno in konveksno zrcalo).
const IMG = {
  beyondC: ["Real, inverted, diminished; between F and C", "वास्तविक, उल्टा, छोटा; F और C के बीच"],
  atC: ["Real, inverted, same size; at C", "वास्तविक, उल्टा, समान आकार; C पर"],
  betweenCF: ["Real, inverted, enlarged; beyond C", "वास्तविक, उल्टा, बड़ा; C से परे"],
  withinF: ["Virtual, erect, enlarged; behind the mirror", "आभासी, सीधा, बड़ा; दर्पण के पीछे"],
  convex: ["Virtual, erect, diminished; behind the mirror, between P and F", "आभासी, सीधा, छोटा; दर्पण के पीछे, P और F के बीच"],
};
const IMG_WHY = {
  beyondC: ["This image is formed only when the object is beyond C of a concave mirror.", "ऐसा प्रतिबिंब तभी बनता है जब बिंब अवतल दर्पण के C से परे हो।"],
  atC: ["This image is formed only when the object is exactly at C of a concave mirror.", "ऐसा प्रतिबिंब तभी बनता है जब बिंब अवतल दर्पण के ठीक C पर हो।"],
  betweenCF: ["This image is formed only when the object is between C and F of a concave mirror.", "ऐसा प्रतिबिंब तभी बनता है जब बिंब अवतल दर्पण के C और F के बीच हो।"],
  withinF: ["This image is formed only when the object is between P and F of a concave mirror.", "ऐसा प्रतिबिंब तभी बनता है जब बिंब अवतल दर्पण के P और F के बीच हो।"],
  convex: ["Only a convex mirror gives a diminished virtual image for every object position.", "बिंब की हर स्थिति में छोटा आभासी प्रतिबिंब केवल उत्तल दर्पण बनाता है।"],
};
const CVX_WHY = ["A convex mirror cannot form a real or an enlarged image of a real object.", "उत्तल दर्पण किसी वास्तविक बिंब का वास्तविक या बड़ा प्रतिबिंब नहीं बना सकता।"];

// Povečava → katero zrcalo in kje je predmet.
const MAG_CASES = [
  { m: ["+2", "+3", "+1.5", "+4"], ok: ["Concave mirror, object between P and F", "अवतल दर्पण, बिंब P और F के बीच"], why: ["$m > +1$: the image is erect and enlarged, which happens only for a concave mirror with the object between P and F.", "$m > +1$: प्रतिबिंब सीधा और बड़ा है, जो केवल अवतल दर्पण में बिंब के P और F के बीच होने पर बनता है।"] },
  { m: ["+0.5", "+0.25", "+\\frac{1}{3}", "+0.2"], ok: ["Convex mirror, object anywhere in front of it", "उत्तल दर्पण, बिंब सामने कहीं भी"], why: ["$0 < m < 1$: erect and diminished, which only a convex mirror gives.", "$0 < m < 1$: सीधा और छोटा प्रतिबिंब केवल उत्तल दर्पण बनाता है।"] },
  { m: ["-1"], ok: ["Concave mirror, object at C", "अवतल दर्पण, बिंब C पर"], why: ["$m = -1$: real, inverted, same size, so the object is at C of a concave mirror.", "$m = -1$: वास्तविक, उल्टा और समान आकार, अतः बिंब अवतल दर्पण के C पर है।"] },
  { m: ["-0.5", "-0.25", "-\\frac{1}{3}"], ok: ["Concave mirror, object beyond C", "अवतल दर्पण, बिंब C से परे"], why: ["$-1 < m < 0$: real, inverted, diminished, so the object is beyond C of a concave mirror.", "$-1 < m < 0$: वास्तविक, उल्टा और छोटा, अतः बिंब अवतल दर्पण के C से परे है।"] },
  { m: ["-2", "-3", "-1.5"], ok: ["Concave mirror, object between F and C", "अवतल दर्पण, बिंब F और C के बीच"], why: ["$m < -1$: real, inverted, enlarged, so the object is between F and C of a concave mirror.", "$m < -1$: वास्तविक, उल्टा और बड़ा, अतः बिंब अवतल दर्पण के F और C के बीच है।"] },
];
// Zakaj je napačna možnost napačna (za dano pravilno skupino): opis, kakšno m da ta možnost.
const MAG_OPT_WHY = [
  ["This arrangement gives $m > +1$ (erect, enlarged).", "इस व्यवस्था में $m > +1$ होता है (सीधा, बड़ा)।"],
  ["A convex mirror gives $0 < m < 1$ (erect, diminished).", "उत्तल दर्पण में $0 < m < 1$ होता है (सीधा, छोटा)।"],
  ["Object at C gives exactly $m = -1$.", "बिंब C पर हो तो ठीक $m = -1$ होता है।"],
  ["Object beyond C gives $-1 < m < 0$.", "बिंब C से परे हो तो $-1 < m < 0$ होता है।"],
  ["Object between F and C gives $m < -1$.", "बिंब F और C के बीच हो तो $m < -1$ होता है।"],
];

const MIRROR_FORMULA = "\\dfrac{1}{v} + \\dfrac{1}{u} = \\dfrac{1}{f}";
const MIRROR_HINT = [
  "Write u and f with their signs first: distances measured against the incident light (in front of the mirror) are negative.",
  "पहले u और f को चिह्न सहित लिखिए: आपतित प्रकाश के विपरीत (दर्पण के सामने) मापी गई दूरियाँ ऋणात्मक होती हैं।",
];

const exiMirrors = {
  id: "exi-fiz-spherical-mirrors",
  topics: [T("spherical-mirrors")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const vr = r.int(0, level === 1 ? 3 : 4);
    // Skupni izračun 1/v = 1/f − 1/u s prikazom ulomka.
    const solveV = (f, u) => {
      const v = mirV(f, u);
      return [v, `$\\dfrac{1}{v} = \\dfrac{1}{f} - \\dfrac{1}{u} = \\dfrac{1}{${f}} - \\dfrac{1}{(${u})} = ${fracTex(u - f, f * u)}$`];
    };
    if (level === 1) {
      if (vr === 0) {
        const [F, U] = r.pick(MIR_REAL);
        const f = -F, u = -U;
        const [v, s1] = solveV(f, u);
        return task({
          text: L(
            `An object is placed ${U} cm in front of a concave mirror of focal length ${F} cm. Using the NCERT sign convention, find the image distance $v$ in cm (with its sign).`,
            `${F} cm फोकस दूरी वाले अवतल दर्पण के सामने ${U} cm की दूरी पर एक बिंब रखा है। NCERT चिह्न परिपाटी से प्रतिबिंब की दूरी $v$ cm में (चिह्न सहित) ज्ञात कीजिए।`
          ),
          answer: numM(v, 1, [
            [-v, L("Check the sign: a real image of a concave mirror is in front of the mirror.", "चिह्न जाँचिए: अवतल दर्पण का वास्तविक प्रतिबिंब दर्पण के सामने बनता है।")],
            [1 / (1 / f + 1 / u), L("From the mirror formula, $1/v = 1/f - 1/u$; you added $1/u$.", "दर्पण सूत्र से $1/v = 1/f - 1/u$; आपने $1/u$ जोड़ दिया।")],
            [mirV(F, u), L("The focal length of a concave mirror is negative.", "अवतल दर्पण की फोकस दूरी ऋणात्मक होती है।")],
          ]),
          data: { given: [q("|u|", U, "cm"), q("|f|", F, "cm")], find: ["v"] },
          hint: L(...MIRROR_HINT),
          formula: MIRROR_FORMULA,
          solution: L(
            `$u = ${u}$ cm, $f = ${f}$ cm (object and focus are in front of the mirror)\n${s1}\n$v = ${en(v)}$ cm: the image is real, in front of the mirror.`,
            `$u = ${u}$ cm, $f = ${f}$ cm (बिंब और फोकस दर्पण के सामने हैं)\n${s1}\n$v = ${en(v)}$ cm: प्रतिबिंब वास्तविक है, दर्पण के सामने।`
          ),
        });
      }
      if (vr === 1) {
        const [F, U] = r.pick(MIR_CVX);
        const f = F, u = -U;
        const [v, s1] = solveV(f, u);
        const ctx = r.int(0, 2);
        const obj = L(...[["a toy car", "एक खिलौना कार"], ["a candle", "एक मोमबत्ती"], ["a pencil", "एक पेंसिल"]][ctx]);
        return task({
          text: L(
            `${who} holds ${obj} ${U} cm in front of a convex mirror of focal length ${F} cm. Using the NCERT sign convention, find the image distance $v$ in cm (with its sign).`,
            `${who} ${obj} को ${F} cm फोकस दूरी वाले उत्तल दर्पण के सामने ${U} cm की दूरी पर ${ni % 2 ? "पकड़ती" : "पकड़ता"} है। NCERT चिह्न परिपाटी से प्रतिबिंब की दूरी $v$ cm में (चिह्न सहित) ज्ञात कीजिए।`
          ),
          answer: numM(v, 1, [
            [-v, L("Check the sign: the image of a convex mirror is behind the mirror.", "चिह्न जाँचिए: उत्तल दर्पण का प्रतिबिंब दर्पण के पीछे बनता है।")],
            [mirV(-F, u), L("The focal length of a convex mirror is positive.", "उत्तल दर्पण की फोकस दूरी धनात्मक होती है।")],
            [1 / (1 / f + 1 / u), L("From the mirror formula, $1/v = 1/f - 1/u$; you added $1/u$.", "दर्पण सूत्र से $1/v = 1/f - 1/u$; आपने $1/u$ जोड़ दिया।")],
          ]),
          data: { given: [q("|u|", U, "cm"), q("|f|", F, "cm")], find: ["v"] },
          hint: L(...MIRROR_HINT),
          formula: MIRROR_FORMULA,
          solution: L(
            `$u = ${u}$ cm, $f = +${f}$ cm (the focus of a convex mirror is behind it)\n${s1}\n$v = +${en(v)}$ cm: virtual image behind the mirror.`,
            `$u = ${u}$ cm, $f = +${f}$ cm (उत्तल दर्पण का फोकस उसके पीछे होता है)\n${s1}\n$v = +${en(v)}$ cm: दर्पण के पीछे आभासी प्रतिबिंब।`
          ),
        });
      }
      if (vr === 2) {
        const [F, U] = r.pick(MIR_REAL);
        const u = -U;
        const v = Math.round(mirV(-F, u));
        const V = -v;
        const m = -v / u;
        return task({
          text: L(
            `${who} places an object ${U} cm in front of a concave mirror and gets a sharp image on a screen ${V} cm in front of the mirror. Find the magnification $m$ (with its sign).${RT(m, 2, lang)}`,
            `${who} एक बिंब को अवतल दर्पण के सामने ${U} cm पर ${ni % 2 ? "रखती" : "रखता"} है और दर्पण के सामने ${V} cm पर रखे परदे पर स्पष्ट प्रतिबिंब ${ni % 2 ? "पाती" : "पाता"} है। आवर्धन $m$ (चिह्न सहित) ज्ञात कीजिए।${RT(m, 2, lang)}`
          ),
          answer: numM(m, 2, [
            [-m, L("A real image is inverted, so $m$ is negative.", "वास्तविक प्रतिबिंब उल्टा होता है, अतः $m$ ऋणात्मक होता है।")],
            [u / v, L("Magnification is $m = -v/u$, not $u/v$.", "आवर्धन $m = -v/u$ होता है, $u/v$ नहीं।")],
          ]),
          data: { given: [q("|u|", U, "cm"), q("|v|", V, "cm")], find: ["m"] },
          hint: L("Both the object and the real image are in front of the mirror, so u and v are both negative.", "बिंब और वास्तविक प्रतिबिंब दोनों दर्पण के सामने हैं, अतः u और v दोनों ऋणात्मक हैं।"),
          formula: "m = -\\dfrac{v}{u} = \\dfrac{h'}{h}",
          solution: L(
            `$u = ${u}$ cm, $v = ${v}$ cm\n$m = -\\dfrac{v}{u} = -\\dfrac{${v}}{${u}}$\n$m ${ev(m, 2)}$ (real, inverted image)`,
            `$u = ${u}$ cm, $v = ${v}$ cm\n$m = -\\dfrac{v}{u} = -\\dfrac{${v}}{${u}}$\n$m ${ev(m, 2)}$ (वास्तविक, उल्टा प्रतिबिंब)`
          ),
        });
      }
      const it = r.pick(MIRROR_USES);
      const answer = ch(r, L, it.ok, it.wrong);
      return task({
        text: L(...it.q),
        answer,
        data: { given: [tx(L, it.g)], find: [tx(L, ["mirror", "दर्पण"])] },
        hint: L("Recall the kind of image each mirror forms and where rays through the principal focus go.", "याद कीजिए कि प्रत्येक दर्पण कैसा प्रतिबिंब बनाता है और मुख्य फोकस से गुजरने वाली किरणें कहाँ जाती हैं।"),
        formula: false,
        solution: L(`${it.sol[0]}\nAnswer: ${it.ok[0]}.`, `${it.sol[1]}\nउत्तर: ${it.ok[1]}।`),
      });
    }
    if (level === 2) {
      if (vr === 0 || vr === 1) {
        const cvx = vr === 1;
        const [F, U] = r.pick(cvx ? MIR_CVX : MIR_REAL);
        const h = r.pick([1, 1.5, 2, 2.5, 3, 4, 5]);
        const f = cvx ? F : -F, u = -U;
        const [v, s1] = solveV(f, u);
        const m = -v / u;
        const h2 = m * h;
        return task({
          text: L(
            `An object ${en(h)} cm tall stands ${U} cm in front of a ${cvx ? "convex" : "concave"} mirror of focal length ${F} cm. Find the height $h'$ of the image in cm (with its sign).${RT(h2, 2, lang)}`,
            `${en(h)} cm ऊँचा एक बिंब ${F} cm फोकस दूरी वाले ${cvx ? "उत्तल" : "अवतल"} दर्पण के सामने ${U} cm पर रखा है। प्रतिबिंब की ऊँचाई $h'$ cm में (चिह्न सहित) ज्ञात कीजिए।${RT(h2, 2, lang)}`
          ),
          answer: numM(h2, 2, [
            [-h2, L("An inverted image has negative height, an erect one positive.", "उल्टे प्रतिबिंब की ऊँचाई ऋणात्मक, सीधे की धनात्मक होती है।")],
            [h / m, L("Use $h' = m h$; you divided by $m$.", "$h' = m h$ लीजिए; आपने $m$ से भाग दे दिया।")],
            [(-mirV(-f, u) / u) * h, L(cvx ? "The focal length of a convex mirror is positive." : "The focal length of a concave mirror is negative.", cvx ? "उत्तल दर्पण की फोकस दूरी धनात्मक होती है।" : "अवतल दर्पण की फोकस दूरी ऋणात्मक होती है।")],
          ]),
          data: { given: [q("h", h, "cm"), q("|u|", U, "cm"), q("|f|", F, "cm")], find: ["h'"] },
          hint: L("First find v from the mirror formula, then the magnification.", "पहले दर्पण सूत्र से v ज्ञात कीजिए, फिर आवर्धन।"),
          formula: [MIRROR_FORMULA, "m = -\\dfrac{v}{u} = \\dfrac{h'}{h}"],
          solution: L(
            `$u = ${u}$ cm, $f = ${cvx ? "+" : ""}${f}$ cm\n${s1}\n$v = ${en(v)}$ cm\n$m = -\\dfrac{v}{u} = -\\dfrac{${en(v)}}{${u}} ${ev(m, 3)}$\n$h' = m h ${ev(h2, 2)}$ cm (${cvx ? "erect, diminished" : h2 < -h ? "inverted, enlarged" : h2 > -h ? "inverted, diminished" : "inverted, same size"})`,
            `$u = ${u}$ cm, $f = ${cvx ? "+" : ""}${f}$ cm\n${s1}\n$v = ${en(v)}$ cm\n$m = -\\dfrac{v}{u} = -\\dfrac{${en(v)}}{${u}} ${ev(m, 3)}$\n$h' = m h ${ev(h2, 2)}$ cm (${cvx ? "सीधा, छोटा" : h2 < -h ? "उल्टा, बड़ा" : h2 > -h ? "उल्टा, छोटा" : "उल्टा, समान आकार"})`
          ),
        });
      }
      if (vr === 2) {
        const [F, U] = r.pick(MIR_VIRT);
        const f = -F, u = -U;
        const [v, s1] = solveV(f, u);
        const m = -v / u;
        return task({
          text: L(
            `${who} looks into a concave shaving mirror of focal length ${F} cm, with the face ${U} cm from the mirror. Find the magnification $m$ of the image (with its sign).${RT(m, 2, lang)}`,
            `${who} अपना चेहरा ${F} cm फोकस दूरी वाले अवतल शेविंग दर्पण से ${U} cm दूर ${ni % 2 ? "रखती" : "रखता"} है। प्रतिबिंब का आवर्धन $m$ (चिह्न सहित) ज्ञात कीजिए।${RT(m, 2, lang)}`
          ),
          answer: numM(m, 2, [
            [-m, L("Inside F the image is erect, so $m$ is positive.", "F के भीतर प्रतिबिंब सीधा होता है, अतः $m$ धनात्मक होता है।")],
            [-mirV(F, u) / u, L("The focal length of a concave mirror is negative.", "अवतल दर्पण की फोकस दूरी ऋणात्मक होती है।")],
            [u / v, L("Magnification is $m = -v/u$, not $u/v$.", "आवर्धन $m = -v/u$ होता है, $u/v$ नहीं।")],
          ]),
          data: { given: [q("|u|", U, "cm"), q("|f|", F, "cm")], find: ["m"] },
          hint: L("Find v first; a positive v means the image is behind the mirror.", "पहले v ज्ञात कीजिए; धनात्मक v का अर्थ है कि प्रतिबिंब दर्पण के पीछे है।"),
          formula: [MIRROR_FORMULA, "m = -\\dfrac{v}{u}"],
          solution: L(
            `${s1}\n$v = +${en(v)}$ cm (virtual image behind the mirror)\n$m = -\\dfrac{v}{u} = -\\dfrac{${en(v)}}{${u}} ${ev(m, 2)}$ (erect, enlarged)`,
            `${s1}\n$v = +${en(v)}$ cm (दर्पण के पीछे आभासी प्रतिबिंब)\n$m = -\\dfrac{v}{u} = -\\dfrac{${en(v)}}{${u}} ${ev(m, 2)}$ (सीधा, बड़ा)`
          ),
        });
      }
      if (vr === 3) {
        // Narava slike iz lege predmeta.
        const kind = r.pick(["beyondC", "atC", "betweenCF", "withinF", "convex"]);
        const F = r.pick([10, 12, 15, 20, 25]);
        const U = kind === "beyondC" ? F * r.pick([3, 4]) : kind === "atC" ? 2 * F : kind === "betweenCF" ? F + F / 2 : kind === "withinF" ? F / 2 : F * r.pick([1, 2, 3]);
        const cvx = kind === "convex";
        const wrong = Object.keys(IMG).filter((k) => k !== kind).map((k) => [IMG[k], cvx ? CVX_WHY : IMG_WHY[k]]);
        const answer = ch(r, L, IMG[kind], wrong);
        const where = { beyondC: ["beyond C", "C से परे"], atC: ["at C", "C पर"], betweenCF: ["between F and C", "F और C के बीच"], withinF: ["between P and F", "P और F के बीच"], convex: ["in front of a convex mirror", "उत्तल दर्पण के सामने"] }[kind];
        return task({
          text: L(
            `An object is placed ${en(U)} cm in front of a ${cvx ? "convex" : "concave"} mirror of focal length ${F} cm. Which describes the image?`,
            `${F} cm फोकस दूरी वाले ${cvx ? "उत्तल" : "अवतल"} दर्पण के सामने ${en(U)} cm पर एक बिंब रखा है। प्रतिबिंब का सही वर्णन कौन-सा है?`
          ),
          answer,
          data: { given: [q("|u|", U, "cm"), q("|f|", F, "cm")], find: [tx(L, ["image", "प्रतिबिंब"])] },
          hint: L("Compare the object distance with f and with R = 2f.", "बिंब की दूरी की तुलना f से और R = 2f से कीजिए।"),
          formula: "R = 2f",
          solution: L(
            `$|f| = ${F}$ cm, $|R| = ${2 * F}$ cm, object distance ${en(U)} cm → the object is ${where[0]}.\nImage: ${IMG[kind][0]}.`,
            `$|f| = ${F}$ cm, $|R| = ${2 * F}$ cm, बिंब की दूरी ${en(U)} cm → बिंब ${where[1]} है।\nप्रतिबिंब: ${IMG[kind][1]}।`
          ),
        });
      }
      // vr 4: given R, find v
      const [F, U] = r.pick(MIR_REAL.filter(([F2]) => F2 !== 5));
      const f = -F, u = -U, R = 2 * F;
      const [v, s1] = solveV(f, u);
      return task({
        text: L(
          `The radius of curvature of a concave mirror is ${R} cm. An object is placed ${U} cm in front of it. Find the image distance $v$ in cm (with its sign).`,
          `एक अवतल दर्पण की वक्रता त्रिज्या ${R} cm है। उसके सामने ${U} cm पर एक बिंब रखा है। प्रतिबिंब की दूरी $v$ cm में (चिह्न सहित) ज्ञात कीजिए।`
        ),
        answer: numM(v, 1, [
          [mirV(-R, u), L("The mirror formula needs the focal length: $f = R/2$.", "दर्पण सूत्र में फोकस दूरी चाहिए: $f = R/2$।")],
          [-v, L("Check the sign: a real image is in front of the mirror.", "चिह्न जाँचिए: वास्तविक प्रतिबिंब दर्पण के सामने बनता है।")],
        ]),
        data: { given: [q("|R|", R, "cm"), q("|u|", U, "cm")], find: ["v"] },
        hint: L("First get the focal length from the radius of curvature.", "पहले वक्रता त्रिज्या से फोकस दूरी ज्ञात कीजिए।"),
        formula: ["f = \\dfrac{R}{2}", MIRROR_FORMULA],
        solution: L(
          `$f = \\dfrac{R}{2} = \\dfrac{${-R}}{2} = ${f}$ cm\n${s1}\n$v = ${en(v)}$ cm (real image in front of the mirror)`,
          `$f = \\dfrac{R}{2} = \\dfrac{${-R}}{2} = ${f}$ cm\n${s1}\n$v = ${en(v)}$ cm (दर्पण के सामने वास्तविक प्रतिबिंब)`
        ),
      });
    }
    // level 3
    if (vr === 0 || vr === 4) {
      const U = r.pick([10, 12, 15, 18, 20, 24, 30]);
      const n = r.pick([2, 3, 4]);
      const real = r.int(0, 1) === 1;
      const m = real ? -n : n;
      const u = -U;
      const v = -m * u;
      const f = (u * v) / (u + v);
      const fOther = real ? (-n * U) / (n - 1) : (-n * U) / (n + 1);
      return task({
        text: L(
          `A concave mirror forms a ${real ? "real" : "virtual"} image ${n} times the size of the object when the object is ${U} cm in front of it. Find the focal length $f$ in cm (with its sign).${RT(f, 1, lang)}`,
          `जब बिंब अवतल दर्पण के सामने ${U} cm पर है, तब दर्पण बिंब से ${n} गुना बड़ा ${real ? "वास्तविक" : "आभासी"} प्रतिबिंब बनाता है। फोकस दूरी $f$ cm में (चिह्न सहित) ज्ञात कीजिए।${RT(f, 1, lang)}`
        ),
        answer: numM(f, 1, [
          [fOther, L(real ? "A real image is inverted: take $m$ negative." : "A virtual image is erect: take $m$ positive.", real ? "वास्तविक प्रतिबिंब उल्टा होता है: $m$ ऋणात्मक लीजिए।" : "आभासी प्रतिबिंब सीधा होता है: $m$ धनात्मक लीजिए।")],
          [-f, L("The focal length of a concave mirror is negative.", "अवतल दर्पण की फोकस दूरी ऋणात्मक होती है।")],
        ]),
        data: { given: [q("|u|", U, "cm"), q("|m|", n)], find: ["v", "f"] },
        hint: L("Decide the sign of m from the nature of the image, then get v from $m = -v/u$.", "प्रतिबिंब की प्रकृति से m का चिह्न तय कीजिए, फिर $m = -v/u$ से v निकालिए।"),
        formula: ["m = -\\dfrac{v}{u}", MIRROR_FORMULA],
        solution: L(
          `${real ? "Real image → inverted" : "Virtual image → erect"}: $m = ${m > 0 ? "+" + m : m}$\n$v = -m u = ${-m} \\cdot (${u}) = ${v}$ cm\n$\\dfrac{1}{f} = \\dfrac{1}{v} + \\dfrac{1}{u} = \\dfrac{1}{${v}} + \\dfrac{1}{${u}} = ${fracTex(u + v, u * v)}$\n$f ${ev(f, 1)}$ cm`,
          `${real ? "वास्तविक प्रतिबिंब → उल्टा" : "आभासी प्रतिबिंब → सीधा"}: $m = ${m > 0 ? "+" + m : m}$\n$v = -m u = ${-m} \\cdot (${u}) = ${v}$ cm\n$\\dfrac{1}{f} = \\dfrac{1}{v} + \\dfrac{1}{u} = \\dfrac{1}{${v}} + \\dfrac{1}{${u}} = ${fracTex(u + v, u * v)}$\n$f ${ev(f, 1)}$ cm`
        ),
      });
    }
    if (vr === 1) {
      const F = r.pick([10, 12, 15, 18, 20, 25, 30, 40]);
      const n = r.pick([2, 3, 4, 5]);
      const u = -(n - 1) * F;
      return task({
        text: L(
          `${who} wants the image in a convex mirror of focal length ${F} cm to be $\\frac{1}{${n}}$ of the size of the object. Find the object distance $u$ in cm (with its sign).`,
          `${who} ${ni % 2 ? "चाहती" : "चाहता"} है कि ${F} cm फोकस दूरी वाले उत्तल दर्पण में प्रतिबिंब बिंब के आकार का $\\frac{1}{${n}}$ हो। बिंब की दूरी $u$ cm में (चिह्न सहित) ज्ञात कीजिए।`
        ),
        answer: numM(u, 1, [
          [-u, L("The object is in front of the mirror, so u is negative.", "बिंब दर्पण के सामने है, अतः u ऋणात्मक है।")],
          [-(n + 1) * F, L("A convex mirror gives an erect image, so $m$ is positive.", "उत्तल दर्पण सीधा प्रतिबिंब बनाता है, अतः $m$ धनात्मक है।")],
          [-n * F, L("Use $v = -m u$ in the mirror formula; do not take $u = n f$.", "दर्पण सूत्र में $v = -m u$ रखिए; $u = n f$ मत लीजिए।")],
        ]),
        data: { given: [q("f", "+" + F, "cm"), q("m", `+\\frac{1}{${n}}`)], find: ["u"] },
        hint: L("Write v in terms of u using $m = -v/u$, then put it into the mirror formula.", "$m = -v/u$ से v को u के पदों में लिखिए, फिर दर्पण सूत्र में रखिए।"),
        formula: ["m = -\\dfrac{v}{u}", MIRROR_FORMULA],
        solution: L(
          `$m = +\\frac{1}{${n}}$ → $v = -\\dfrac{u}{${n}}$\n$\\dfrac{1}{v} + \\dfrac{1}{u} = -\\dfrac{${n}}{u} + \\dfrac{1}{u} = -\\dfrac{${n - 1}}{u} = \\dfrac{1}{f}$\n$u = ${n === 2 ? "-f" : `-${n - 1} f = -${n - 1} \\cdot ${F}`} = ${u}$ cm`,
          `$m = +\\frac{1}{${n}}$ → $v = -\\dfrac{u}{${n}}$\n$\\dfrac{1}{v} + \\dfrac{1}{u} = -\\dfrac{${n}}{u} + \\dfrac{1}{u} = -\\dfrac{${n - 1}}{u} = \\dfrac{1}{f}$\n$u = ${n === 2 ? "-f" : `-${n - 1} f = -${n - 1} \\cdot ${F}`} = ${u}$ cm`
        ),
      });
    }
    if (vr === 2) {
      const [F, U] = r.pick(MIR_REAL.filter(([F2, U2]) => F2 >= 8 && U2 < 2 * F2 + 30));
      const h = r.pick([1.5, 2, 2.5, 3, 4]);
      const R = 2 * F, f = -F, u = -U;
      const [v, s1] = solveV(f, u);
      const m = -v / u;
      const h2 = m * h;
      const vWrong = mirV(-R, u);
      return task({
        text: L(
          `A ${en(h)} cm tall candle flame is ${U} cm in front of a concave mirror of radius of curvature ${R} cm. ${who} places a screen to get a sharp image. Find the height $h'$ of the image in cm (with its sign).${RT(h2, 2, lang)}`,
          `${en(h)} cm ऊँची मोमबत्ती की लौ ${R} cm वक्रता त्रिज्या वाले अवतल दर्पण के सामने ${U} cm पर है। ${who} स्पष्ट प्रतिबिंब के लिए एक परदा ${ni % 2 ? "रखती" : "रखता"} है। प्रतिबिंब की ऊँचाई $h'$ cm में (चिह्न सहित) ज्ञात कीजिए।${RT(h2, 2, lang)}`
        ),
        answer: numM(h2, 2, [
          [(-vWrong / u) * h, L("Use $f = R/2$ in the mirror formula, not R.", "दर्पण सूत्र में R नहीं, $f = R/2$ लीजिए।")],
          [-h2, L("An image on a screen is real and inverted, so $h'$ is negative.", "परदे पर बना प्रतिबिंब वास्तविक और उल्टा होता है, अतः $h'$ ऋणात्मक है।")],
          [h / m, L("Use $h' = m h$; you divided by $m$.", "$h' = m h$ लीजिए; आपने $m$ से भाग दे दिया।")],
        ]),
        data: { given: [q("h", h, "cm"), q("|u|", U, "cm"), q("|R|", R, "cm")], find: ["v", "h'"] },
        hint: L("Three steps: f from R, then v from the mirror formula, then h' from the magnification.", "तीन चरण: R से f, फिर दर्पण सूत्र से v, फिर आवर्धन से h'।"),
        formula: ["f = \\dfrac{R}{2}", MIRROR_FORMULA, "m = -\\dfrac{v}{u} = \\dfrac{h'}{h}"],
        solution: L(
          `$f = \\dfrac{R}{2} = ${f}$ cm\n${s1}\n$v = ${en(v)}$ cm (screen ${en(-v)} cm in front of the mirror)\n$m = -\\dfrac{v}{u} ${ev(m, 3)}$\n$h' = m h ${ev(h2, 2)}$ cm (real, inverted)`,
          `$f = \\dfrac{R}{2} = ${f}$ cm\n${s1}\n$v = ${en(v)}$ cm (परदा दर्पण के सामने ${en(-v)} cm पर)\n$m = -\\dfrac{v}{u} ${ev(m, 3)}$\n$h' = m h ${ev(h2, 2)}$ cm (वास्तविक, उल्टा)`
        ),
      });
    }
    // vr 3: povečava → zrcalo in lega
    const ci = r.int(0, MAG_CASES.length - 1);
    const c = MAG_CASES[ci];
    const mTex = r.pick(c.m);
    const wrong = MAG_CASES.map((o, i) => [o.ok, MAG_OPT_WHY[i]]).filter((_, i) => i !== ci);
    const answer = ch(r, L, c.ok, wrong);
    return task({
      text: L(
        `The magnification produced by a spherical mirror for a real object is $m = ${mTex}$. Which mirror is it, and where is the object?`,
        `किसी वास्तविक बिंब के लिए एक गोलीय दर्पण द्वारा उत्पन्न आवर्धन $m = ${mTex}$ है। यह कौन-सा दर्पण है और बिंब कहाँ है?`
      ),
      answer,
      data: { given: [q("m", mTex)], find: [tx(L, ["mirror", "दर्पण"])] },
      hint: L("The sign of m tells erect (+) or inverted (−); its size tells enlarged (>1) or diminished (<1).", "m का चिह्न बताता है कि प्रतिबिंब सीधा (+) है या उल्टा (−); उसका परिमाण बताता है कि बड़ा (>1) है या छोटा (<1)।"),
      formula: "m = \\dfrac{h'}{h} = -\\dfrac{v}{u}",
      solution: L(`${c.why[0]}\nAnswer: ${c.ok[0]}.`, `${c.why[1]}\nउत्तर: ${c.ok[1]}।`),
    });
  },
};

// ---------- 2. Electric power and household circuits (NCERT: 220 V) ----------
const APPL = [
  ["electric bulb", "विद्युत बल्ब", [40, 60, 100]],
  ["ceiling fan", "छत का पंखा", [60, 75]],
  ["television", "टेलीविज़न", [100, 120, 150]],
  ["refrigerator", "रेफ्रिजरेटर", [150, 200, 250]],
  ["electric iron", "विद्युत इस्त्री", [750, 1000, 1100], true],
  ["toaster", "टोस्टर", [800, 1000, 1200]],
  ["electric kettle", "विद्युत केतली", [1500, 2000], true],
  ["room heater", "रूम हीटर", [1000, 1500, 2000]],
  ["geyser (water heater)", "गीज़र (वाटर हीटर)", [2000, 3000]],
  ["air conditioner", "एयर कंडीशनर", [1500, 2200]],
];
// Hindijski spol naprave (true = ženski: इस्त्री, केतली).
const fem = (i, m, f) => (APPL[i][3] ? f : m);
const FUSES = [1, 2, 3, 5, 10, 15, 20, 30];

const HOUSE_FACTS = [
  {
    q: ["How are the appliances in a house connected to the mains, and why?", "घर के विद्युत साधित्र मुख्य आपूर्ति से किस प्रकार जोड़े जाते हैं, और क्यों?"],
    g: ["household wiring", "घरेलू वायरिंग"],
    ok: ["In parallel: each gets the full 220 V and can be switched on or off on its own", "पार्श्व (समांतर) क्रम में: प्रत्येक को पूरा 220 V मिलता है और उसे अलग से चालू-बंद किया जा सकता है"],
    wrong: [
      [["In series: the same current flows through all of them", "श्रेणी क्रम में: सबमें एक ही धारा बहती है"], ["In series the 220 V would be shared, and one switched-off appliance would stop all the others.", "श्रेणी क्रम में 220 V बँट जाता, और एक साधित्र बंद करने पर सभी बंद हो जाते।"]],
      [["In series: this keeps the total resistance small", "श्रेणी क्रम में: इससे कुल प्रतिरोध कम रहता है"], ["Resistors in series add up, so the total resistance becomes larger, not smaller.", "श्रेणी क्रम में प्रतिरोध जुड़ते हैं, अतः कुल प्रतिरोध बढ़ता है, घटता नहीं।"]],
      [["In parallel: so that all of them draw the same current", "पार्श्व क्रम में: ताकि सभी समान धारा लें"], ["In parallel each appliance draws its own current $I = P/V$; the voltage, not the current, is the same.", "पार्श्व क्रम में प्रत्येक साधित्र अपनी धारा $I = P/V$ लेता है; धारा नहीं, विभवांतर समान रहता है।"]],
    ],
    sol: ["In parallel every appliance has the full mains voltage across it and has its own switch.", "पार्श्व क्रम में हर साधित्र पर पूरा मुख्य विभवांतर रहता है और उसका अपना स्विच होता है।"],
  },
  {
    q: ["Where is the fuse placed in a household circuit, and what is it made of?", "घरेलू परिपथ में फ्यूज़ कहाँ लगाया जाता है, और वह किस पदार्थ का बना होता है?"],
    g: ["fuse", "फ्यूज़"],
    ok: ["In series with the live wire; a wire of low melting point", "विद्युन्मय (लाइव) तार के श्रेणी क्रम में; कम गलनांक वाला तार"],
    wrong: [
      [["In series with the neutral wire; a wire of low melting point", "उदासीन तार के श्रेणी क्रम में; कम गलनांक वाला तार"], ["A fuse in the neutral wire would leave the appliance connected to the live wire after it melts.", "उदासीन तार में फ्यूज़ हो तो उसके पिघलने के बाद भी साधित्र विद्युन्मय तार से जुड़ा रहता।"]],
      [["In parallel with the appliance; a thick copper wire", "साधित्र के पार्श्व क्रम में; मोटा ताँबे का तार"], ["A fuse must carry the same current as the circuit (series), and copper melts only at a very high temperature.", "फ्यूज़ में परिपथ जितनी ही धारा बहनी चाहिए (श्रेणी क्रम), और ताँबा बहुत अधिक ताप पर पिघलता है।"]],
      [["In series with the earth wire; a wire of high melting point", "भू-संपर्क तार के श्रेणी क्रम में; उच्च गलनांक वाला तार"], ["Normally no current flows in the earth wire, and a fuse must melt easily.", "सामान्यतः भू-संपर्क तार में धारा नहीं बहती, और फ्यूज़ को आसानी से पिघलना चाहिए।"]],
    ],
    sol: ["The fuse is in series with the live wire; a large current heats its low-melting-point wire, which melts and breaks the circuit.", "फ्यूज़ विद्युन्मय तार के श्रेणी क्रम में होता है; अधिक धारा से उसका कम गलनांक वाला तार गरम होकर पिघल जाता है और परिपथ टूट जाता है।"],
  },
  {
    q: ["Why is the metal body of an electric iron connected to the earth wire?", "विद्युत इस्त्री के धात्विक आवरण को भू-संपर्क तार से क्यों जोड़ा जाता है?"],
    g: ["earthing", "भू-संपर्कण"],
    ok: ["If the live wire touches the body, current flows to earth and the user does not get a severe shock", "यदि विद्युन्मय तार आवरण को छू जाए तो धारा भूमि में चली जाती है और उपयोगकर्ता को तीव्र झटका नहीं लगता"],
    wrong: [
      [["To make the iron heat up faster", "इस्त्री को जल्दी गरम करने के लिए"], ["The earth wire carries no current in normal use; it does not change the heating.", "सामान्य उपयोग में भू-संपर्क तार में धारा नहीं बहती; इससे तापन नहीं बदलता।"]],
      [["To complete the circuit so that the iron can work", "परिपथ पूरा करने के लिए ताकि इस्त्री काम करे"], ["The live and neutral wires complete the circuit; the earth wire is only a safety path.", "परिपथ विद्युन्मय और उदासीन तार पूरा करते हैं; भू-संपर्क तार केवल सुरक्षा का मार्ग है।"]],
      [["To reduce the electricity bill", "बिजली का बिल कम करने के लिए"], ["Energy used depends on power and time; earthing does not change it.", "खपत ऊर्जा शक्ति और समय पर निर्भर है; भू-संपर्कण उसे नहीं बदलता।"]],
    ],
    sol: ["The earth wire gives a low-resistance path to the ground, so a leakage current does not pass through the user.", "भू-संपर्क तार भूमि तक कम प्रतिरोध का मार्ग देता है, इसलिए क्षरण धारा उपयोगकर्ता से होकर नहीं बहती।"],
  },
];

const exiPower = {
  id: "exi-fiz-electric-power",
  topics: [T("electric-power-and-household-circuits")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const V = 220;
    const vr = r.int(0, level === 2 ? 4 : 3);
    const ap = (i) => L(APPL[i][0], APPL[i][1]);
    if (level === 1) {
      if (vr === 0) {
        const i = r.int(0, APPL.length - 1);
        const P = r.pick(APPL[i][2]);
        const I = P / V;
        return task({
          text: L(`An ${ap(i)} is rated ${P} W, 220 V. What current does it draw from the mains, in A?${RT(I, 2, lang)}`.replace(/^An ([^aeiou])/i, "A $1"), `एक ${ap(i)} 220 V, ${P} W अनुमतांकित है। यह मुख्य आपूर्ति से कितनी विद्युत धारा (A में) ${fem(i, "लेता", "लेती")} है?${RT(I, 2, lang)}`),
          answer: numM(I, 2, [
            [V / P, L("Current is power divided by voltage, not the other way round.", "धारा = शक्ति ÷ विभवांतर, उल्टा नहीं।")],
            [(V * V) / P / 100, L("Use $I = P/V$.", "$I = P/V$ लीजिए।")],
          ]),
          data: { given: [q("P", P, "W"), q("V", V, "V")], find: ["I"] },
          hint: L("Power, voltage and current are linked by one formula.", "शक्ति, विभवांतर और धारा एक ही सूत्र से जुड़े हैं।"),
          formula: "P = VI",
          solution: L(`$I = \\dfrac{P}{V} = \\dfrac{${P}}{${V}}$\n$I ${ev(I, 2)}$ A`, `$I = \\dfrac{P}{V} = \\dfrac{${P}}{${V}}$\n$I ${ev(I, 2)}$ A`),
        });
      }
      if (vr === 1) {
        const i = r.int(0, APPL.length - 1);
        const P = r.pick(APPL[i][2]);
        const h = P >= 700 ? r.pick([0.5, 1, 1.5, 2, 3]) : r.pick([2, 3, 4, 5, 6, 8, 10]);
        const E = (P * h) / 1000;
        return task({
          text: L(`${who} runs a ${P} W ${ap(i)} for ${en(h)} hours. How much electrical energy is used, in kWh (units)?`, `${who} के घर में ${P} W ${fem(i, "का", "की")} ${ap(i)} ${en(h)} घंटे ${fem(i, "चलता", "चलती")} है। कितनी विद्युत ऊर्जा खर्च होती है, kWh (यूनिट) में?`),
          answer: numM(E, 2, [
            [P * h, L("Convert watts to kilowatts before multiplying by hours.", "घंटों से गुणा करने से पहले वाट को किलोवाट में बदलिए।")],
            [P / 1000 / h, L("Energy = power × time; you divided by the time.", "ऊर्जा = शक्ति × समय; आपने समय से भाग दे दिया।")],
          ]),
          data: { given: [q("P", P, "W"), q("t", h, "h")], find: ["E"] },
          hint: L("1 unit = 1 kWh = energy used by a 1 kW appliance in 1 hour.", "1 यूनिट = 1 kWh = 1 kW साधित्र द्वारा 1 घंटे में खर्च ऊर्जा।"),
          formula: "E = P t",
          solution: L(`$P = ${P}\\ \\mathrm{W} = ${en(P / 1000)}\\ \\mathrm{kW}$\n$E = P t = ${en(P / 1000)} \\cdot ${h} = ${en(E)}$ kWh`, `$P = ${P}\\ \\mathrm{W} = ${en(P / 1000)}\\ \\mathrm{kW}$\n$E = P t = ${en(P / 1000)} \\cdot ${h} = ${en(E)}$ kWh`),
        });
      }
      if (vr === 2) {
        const P = r.pick([25, 40, 60, 100, 200]);
        const R = (V * V) / P;
        return task({
          text: L(`A filament bulb is marked "${P} W, 220 V". Find the resistance of its filament when it glows normally, in Ω.${RT(R, 1, lang)}`, `एक बल्ब पर "${P} W, 220 V" अंकित है। सामान्य रूप से जलते समय उसके तंतु का प्रतिरोध Ω में ज्ञात कीजिए।${RT(R, 1, lang)}`),
          answer: numM(R, 1, [
            [V / P, L("$V/P$ is not a resistance; use $P = V^2/R$.", "$V/P$ प्रतिरोध नहीं है; $P = V^2/R$ लीजिए।")],
            [P / V, L("Use $R = V^2/P$.", "$R = V^2/P$ लीजिए।")],
          ]),
          data: { given: [q("P", P, "W"), q("V", V, "V")], find: ["R"] },
          hint: L("Choose the power formula that contains V and R only.", "शक्ति का वह सूत्र चुनिए जिसमें केवल V और R हों।"),
          formula: "P = \\dfrac{V^2}{R}",
          solution: L(`$R = \\dfrac{V^2}{P} = \\dfrac{${V}^2}{${P}} = \\dfrac{${V * V}}{${P}}$\n$R ${ev(R, 1)}\\ \\Omega$`, `$R = \\dfrac{V^2}{P} = \\dfrac{${V}^2}{${P}} = \\dfrac{${V * V}}{${P}}$\n$R ${ev(R, 1)}\\ \\Omega$`),
        });
      }
      const i = r.int(4, APPL.length - 1);
      const I = r.pick([2, 2.5, 3, 4, 5, 6, 7.5, 8, 10]);
      const P = V * I;
      return task({
        text: L(`An ${ap(i)} connected to the 220 V mains draws a current of ${en(I)} A. Find its power in W.`.replace(/^An ([^aeiou])/i, "A $1"), `220 V की मुख्य आपूर्ति से ${fem(i, "जुड़ा", "जुड़ी")} एक ${ap(i)} ${en(I)} A धारा ${fem(i, "लेता", "लेती")} है। उसकी शक्ति W में ज्ञात कीजिए।`),
        answer: numM(P, 1, [
          [V / I, L("$V/I$ gives resistance, not power.", "$V/I$ से प्रतिरोध मिलता है, शक्ति नहीं।")],
          [I * I * V, L("Power is $P = VI$; square neither quantity.", "शक्ति $P = VI$ है; किसी राशि का वर्ग मत लीजिए।")],
        ]),
        data: { given: [q("V", V, "V"), q("I", I, "A")], find: ["P"] },
        hint: L("Power is the product of voltage and current.", "शक्ति विभवांतर और धारा का गुणनफल है।"),
        formula: "P = VI",
        solution: L(`$P = VI = ${V} \\cdot ${en(I)}$\n$P = ${en(P)}$ W`, `$P = VI = ${V} \\cdot ${en(I)}$\n$P = ${en(P)}$ W`),
      });
    }
    if (level === 2) {
      if (vr === 0) {
        const nb = r.pick([3, 4, 5, 6]);
        const Pb = r.pick([20, 40, 60]);
        const hb = r.pick([4, 5, 6]);
        const j = r.pick([4, 6, 7, 8]);
        const Pj = r.pick(APPL[j][2]);
        const hj = r.pick([0.5, 1, 2]);
        const rate = r.pick([5, 6, 6.5, 7, 7.5, 8]);
        const units = ((nb * Pb * hb + Pj * hj) * 30) / 1000;
        const cost = units * rate;
        return task({
          text: L(
            `In ${who}'s house, ${nb} lamps of ${Pb} W each are used ${hb} h a day and a ${Pj} W ${ap(j)} is used ${en(hj)} h a day. Find the electricity cost for 30 days at ₹${en(rate)} per unit, in ₹.${RT(cost, 2, lang)}`,
            `${who} के घर में ${Pb} W के ${nb} लैंप प्रतिदिन ${hb} घंटे और ${Pj} W ${fem(j, "का", "की")} एक ${ap(j)} प्रतिदिन ${en(hj)} घंटे चलते हैं। ₹${en(rate)} प्रति यूनिट की दर से 30 दिनों का बिजली खर्च ₹ में ज्ञात कीजिए।${RT(cost, 2, lang)}`
          ),
          answer: numM(cost, 2, [
            [cost / 30, L("That is the cost for one day; the question asks for 30 days.", "यह एक दिन का खर्च है; प्रश्न 30 दिनों का है।")],
            [(((Pb * hb + Pj * hj) * 30) / 1000) * rate, L(`There are ${nb} lamps, not one.`, `लैंप ${nb} हैं, एक नहीं।`)],
            [cost * 1000, L("1 unit is 1 kWh: convert W·h to kWh.", "1 यूनिट = 1 kWh: W·h को kWh में बदलिए।")],
          ]),
          data: { given: [`P = ${nb} \\times ${Pb}\\ \\mathrm{W},\\ t = ${hb}\\ \\mathrm{h}`, `P = ${Pj}\\ \\mathrm{W},\\ t = ${en(hj)}\\ \\mathrm{h}`, `${tx(L, ["time", "समय"])} = 30\\ ${tx(L, ["days", "दिन"])}`, `${tx(L, ["rate", "दर"])} = \\text{₹}\\,${en(rate)}\\ /\\ \\mathrm{kWh}`], find: [L("\\text{cost}", "\\text{खर्च}")] },
          hint: L("Find the energy used in one day in kWh first.", "पहले एक दिन में खर्च ऊर्जा kWh में ज्ञात कीजिए।"),
          formula: ["E = P t", "\\text{cost} = E \\cdot \\text{rate}"],
          solution: L(
            `Lamps: $${nb} \\cdot ${Pb} \\cdot ${hb} = ${nb * Pb * hb}$ Wh/day\n${ap(j)}: $${Pj} \\cdot ${en(hj)} = ${en(Pj * hj)}$ Wh/day\nPer day: $${en(nb * Pb * hb + Pj * hj)}$ Wh $= ${en((nb * Pb * hb + Pj * hj) / 1000)}$ kWh\n30 days: $E = ${en(units)}$ kWh\nCost $= ${en(units)} \\cdot \\text{₹}\\,${en(rate)} ${near(cost, 2) ? "=" : "\\approx"} \\text{₹}\\,${near(cost, 2) ? en(cost) : en(cost, 2)}$`,
            `लैंप: $${nb} \\cdot ${Pb} \\cdot ${hb} = ${nb * Pb * hb}$ Wh/दिन\n${ap(j)}: $${Pj} \\cdot ${en(hj)} = ${en(Pj * hj)}$ Wh/दिन\nप्रतिदिन: $${en(nb * Pb * hb + Pj * hj)}$ Wh $= ${en((nb * Pb * hb + Pj * hj) / 1000)}$ kWh\n30 दिन: $E = ${en(units)}$ kWh\nखर्च $= ${en(units)} \\cdot \\text{₹}\\,${en(rate)} ${near(cost, 2) ? "=" : "\\approx"} \\text{₹}\\,${near(cost, 2) ? en(cost) : en(cost, 2)}$`
          ),
        });
      }
      if (vr === 1) {
        // Varovalka: najmanjša standardna, ki je večja od toka.
        const cands = [];
        APPL.forEach((a, i) => a[2].forEach((P) => {
          const I = P / V;
          const k = FUSES.findIndex((x) => x >= I * 1.05);
          if (k >= 1 && k <= FUSES.length - 3 && FUSES[k - 1] < I * 0.97) cands.push([i, P, k]);
        }));
        const [i, P, k] = r.pick(cands);
        const I = P / V;
        const A = (x) => `${x} A`;
        const wrong = [
          [[A(FUSES[k - 1]), A(FUSES[k - 1])], ["Smaller than the normal current: this fuse would melt every time the appliance is used.", "सामान्य धारा से कम: हर बार साधित्र चलाने पर यह फ्यूज़ पिघल जाएगा।"]],
          [[A(FUSES[k + 1]), A(FUSES[k + 1])], ["Too large: a moderate overload would not melt it, so it would not protect the appliance.", "बहुत बड़ा: थोड़ी अधिक धारा पर यह नहीं पिघलेगा, अतः साधित्र की रक्षा नहीं करेगा।"]],
          [[A(FUSES[k + 2]), A(FUSES[k + 2])], ["Far too large: the wiring could overheat before this fuse melts.", "बहुत ही बड़ा: इसके पिघलने से पहले ही तार अधिक गरम हो सकते हैं।"]],
        ];
        const answer = ch(r, L, [A(FUSES[k]), A(FUSES[k])], wrong);
        return task({
          text: L(`An ${ap(i)} rated ${P} W, 220 V is to be protected by a fuse. Which fuse rating is the most suitable?`.replace(/^An ([^aeiou])/i, "A $1"), `220 V, ${P} W अनुमतांक ${fem(i, "वाले", "वाली")} ${ap(i)} की सुरक्षा के लिए फ्यूज़ लगाना है। कौन-सा फ्यूज़ अनुमतांक सबसे उपयुक्त है?`),
          answer,
          data: { given: [q("P", P, "W"), q("V", V, "V")], find: [L("\\text{fuse rating}", "\\text{फ्यूज़ अनुमतांक}")] },
          hint: L("Find the normal current first; the fuse rating should be a little above it.", "पहले सामान्य धारा ज्ञात कीजिए; फ्यूज़ का अनुमतांक उससे थोड़ा अधिक होना चाहिए।"),
          formula: "I = \\dfrac{P}{V}",
          solution: L(
            `$I = \\dfrac{P}{V} = \\dfrac{${P}}{${V}} ${ev(I, 2)}$ A\nThe smallest rating above ${fx(I, 2)} A is ${FUSES[k]} A.`,
            `$I = \\dfrac{P}{V} = \\dfrac{${P}}{${V}} ${ev(I, 2)}$ A\n${fx(I, 2)} A से अधिक सबसे छोटा अनुमतांक ${FUSES[k]} A है।`
          ),
        });
      }
      if (vr === 2) {
        const R = r.pick([22, 44, 55, 88, 110]);
        const h = r.pick([0.5, 1, 1.5, 2, 3]);
        const P = (V * V) / R;
        const E = (P * h) / 1000;
        return task({
          text: L(`A heater coil of resistance ${R} Ω is connected to the 220 V mains for ${en(h)} h. How much energy does it use, in kWh?${RT(E, 2, lang)}`, `${R} Ω प्रतिरोध वाली हीटर की कुंडली 220 V मुख्य आपूर्ति से ${en(h)} घंटे जुड़ी रहती है। वह कितनी ऊर्जा खर्च करती है, kWh में?${RT(E, 2, lang)}`),
          answer: numM(E, 2, [
            [(V * h) / R / 1000, L("Power is $V^2/R$, not $V/R$ (that is the current).", "शक्ति $V^2/R$ है, $V/R$ नहीं (वह धारा है)।")],
            [P * h, L("Convert W·h to kWh.", "W·h को kWh में बदलिए।")],
          ]),
          data: { given: [q("R", R, "\\Omega"), q("V", V, "V"), q("t", h, "h")], find: ["P", "E"] },
          hint: L("Find the power from V and R first, then multiply by time.", "पहले V और R से शक्ति ज्ञात कीजिए, फिर समय से गुणा कीजिए।"),
          formula: ["P = \\dfrac{V^2}{R}", "E = P t"],
          solution: L(
            `$P = \\dfrac{V^2}{R} = \\dfrac{${V * V}}{${R}} = ${en(P)}$ W $= ${en(P / 1000)}$ kW\n$E = P t = ${en(P / 1000)} \\cdot ${en(h)} ${ev(E, 2)}$ kWh`,
            `$P = \\dfrac{V^2}{R} = \\dfrac{${V * V}}{${R}} = ${en(P)}$ W $= ${en(P / 1000)}$ kW\n$E = P t = ${en(P / 1000)} \\cdot ${en(h)} ${ev(E, 2)}$ kWh`
          ),
        });
      }
      if (vr === 3) {
        const i = r.pick([4, 5, 6]);
        const P = r.pick(APPL[i][2]);
        const mins = r.pick([15, 20, 30, 40, 45]);
        const E = ((P / 1000) * (mins / 60)) * 30;
        return task({
          text: L(`${who} uses a ${P} W ${ap(i)} for ${mins} minutes every day. How many units (kWh) does it use in 30 days?${RT(E, 2, lang)}`, `${who} प्रतिदिन ${P} W ${fem(i, "का", "की")} ${ap(i)} ${mins} मिनट ${ni % 2 ? "चलाती" : "चलाता"} है। 30 दिनों में कितनी यूनिट (kWh) ऊर्जा खर्च होती है?${RT(E, 2, lang)}`),
          answer: numM(E, 2, [
            [(P / 1000) * mins * 30, L("Convert minutes to hours: divide by 60.", "मिनट को घंटों में बदलिए: 60 से भाग दीजिए।")],
            [(P / 1000) * (mins / 60), L("This is for one day; multiply by 30 days.", "यह एक दिन का है; 30 दिनों से गुणा कीजिए।")],
          ]),
          data: { given: [q("P", P, "W"), q("t", `${mins}\\ \\mathrm{min} \\times 30`)], find: ["E"] },
          hint: L("Use kW and hours, so the energy comes out in kWh.", "kW और घंटे लीजिए, तब ऊर्जा kWh में आएगी।"),
          formula: "E = P t",
          solution: L(
            `$P = ${en(P / 1000)}$ kW, $t = 30 \\cdot \\dfrac{${mins}}{60} = ${en((30 * mins) / 60)}$ h\n$E = ${en(P / 1000)} \\cdot ${en((30 * mins) / 60)} ${ev(E, 2)}$ kWh`,
            `$P = ${en(P / 1000)}$ kW, $t = 30 \\cdot \\dfrac{${mins}}{60} = ${en((30 * mins) / 60)}$ h\n$E = ${en(P / 1000)} \\cdot ${en((30 * mins) / 60)} ${ev(E, 2)}$ kWh`
          ),
        });
      }
      const it = r.pick(HOUSE_FACTS);
      const answer = ch(r, L, it.ok, it.wrong);
      return task({
        text: L(...it.q),
        answer,
        data: { given: [tx(L, it.g)], find: [tx(L, ["reason", "कारण"])] },
        hint: L("Think about what must stay the same for every appliance and what keeps the user safe.", "सोचिए कि हर साधित्र के लिए क्या समान रहना चाहिए और उपयोगकर्ता को क्या सुरक्षित रखता है।"),
        formula: false,
        solution: L(`${it.sol[0]}\nAnswer: ${it.ok[0]}.`, `${it.sol[1]}\nउत्तर: ${it.ok[1]}।`),
      });
    }
    // level 3
    if (vr === 0) {
      const Pb = r.pick([40, 60, 75, 100]);
      const If = r.pick([2, 3, 5]);
      const n = Math.floor((V * If) / Pb);
      return task({
        text: L(`A 220 V line in ${who}'s shop is protected by a ${If} A fuse. What is the largest number of ${Pb} W, 220 V bulbs that can be lit together on it?`, `${who} की दुकान की 220 V लाइन में ${If} A का फ्यूज़ लगा है। उस पर 220 V, ${Pb} W के अधिक से अधिक कितने बल्ब एक साथ जलाए जा सकते हैं?`),
        answer: numM(n, 0, [
          [n + 1, L("One more bulb would draw more current than the fuse allows.", "एक और बल्ब लगाने पर धारा फ्यूज़ की सीमा से अधिक होगी।")],
          [Math.floor(V / Pb), L("The maximum power is $V I_{max}$; multiply by the fuse current first.", "अधिकतम शक्ति $V I_{max}$ है; पहले फ्यूज़ की धारा से गुणा कीजिए।")],
        ]),
        data: { given: [q("V", V, "V"), q("I_{max}", If, "A"), q("P_1", Pb, "W")], find: ["n"] },
        hint: L("Find the largest total power the fuse allows.", "फ्यूज़ द्वारा अनुमत अधिकतम कुल शक्ति ज्ञात कीजिए।"),
        formula: ["P_{max} = V I_{max}", "n \\le \\dfrac{P_{max}}{P_1}"],
        solution: L(
          `$P_{max} = ${V} \\cdot ${If} = ${V * If}$ W\n$\\dfrac{${V * If}}{${Pb}} ${ev((V * If) / Pb, 2)}$\nOnly whole bulbs, and not more than this: $n = ${n}$`,
          `$P_{max} = ${V} \\cdot ${If} = ${V * If}$ W\n$\\dfrac{${V * If}}{${Pb}} ${ev((V * If) / Pb, 2)}$\nबल्ब पूरे ही होंगे और इससे अधिक नहीं: $n = ${n}$`
        ),
      });
    }
    if (vr === 1) {
      const set = r.shuffle([0, 1, 2, 4, 5, 6, 7]).slice(0, 3);
      const Ps = set.map((i) => r.pick(APPL[i][2]));
      const cnt = set.map((i) => (i <= 1 ? r.pick([2, 3, 4]) : 1));
      const Pt = Ps.reduce((s, P, k) => s + P * cnt[k], 0);
      const I = Pt / V;
      const parts = set.map((i, k) => cnt[k] > 1 ? L(`${cnt[k]} ${APPL[i][0]}s of ${Ps[k]} W each`, `${Ps[k]} W के ${cnt[k]} ${i === 1 ? "छत के पंखे" : APPL[i][1]}`) : `${Ps[k]} W ${L(APPL[i][0], APPL[i][1])}`);
      return task({
        text: L(`These run together on a 220 V line: ${parts.join(", ")}. Find the total current in the main line, in A.${RT(I, 2, lang)}`, `220 V की लाइन पर ये एक साथ चल रहे हैं: ${parts.join(", ")}। मुख्य लाइन में कुल धारा A में ज्ञात कीजिए।${RT(I, 2, lang)}`),
        answer: numM(I, 2, [
          [(Ps.reduce((s, P) => s + P, 0)) / V, L("Count every appliance, including those that appear more than once.", "हर साधित्र गिनिए, उन्हें भी जो एक से अधिक बार हैं।")],
          [I / set.length, L("In parallel the currents add; do not average them.", "पार्श्व क्रम में धाराएँ जुड़ती हैं; उनका औसत मत लीजिए।")],
        ]),
        data: { given: [q("V", V, "V"), q("P_{total}", Ps.map((P, k) => (cnt[k] > 1 ? `${cnt[k]} \\cdot ${P}` : P)).join(" + "), "W")], find: ["I"] },
        hint: L("Appliances on a household line are in parallel: add their powers (or their currents).", "घरेलू लाइन पर साधित्र पार्श्व क्रम में होते हैं: उनकी शक्तियाँ (या धाराएँ) जोड़िए।"),
        formula: ["P_{total} = P_1 + P_2 + \\ldots", "I = \\dfrac{P_{total}}{V}"],
        solution: L(
          `$P_{total} = ${Ps.map((P, k) => (cnt[k] > 1 ? `${cnt[k]} \\cdot ${P}` : P)).join(" + ")} = ${Pt}$ W\n$I = \\dfrac{${Pt}}{${V}} ${ev(I, 2)}$ A`,
          `$P_{total} = ${Ps.map((P, k) => (cnt[k] > 1 ? `${cnt[k]} \\cdot ${P}` : P)).join(" + ")} = ${Pt}$ W\n$I = \\dfrac{${Pt}}{${V}} ${ev(I, 2)}$ A`
        ),
      });
    }
    if (vr === 2) {
      const P = r.pick([60, 100, 200, 500, 1000]);
      const V2 = r.pick([110, 165, 176, 198, 200]);
      const P2 = P * (V2 / V) ** 2;
      return task({
        text: L(`A ${P} W, 220 V appliance is run at a low supply voltage of ${V2} V. Assuming its resistance stays the same, find the power it uses, in W.${RT(P2, 1, lang)}`, `220 V, ${P} W का एक साधित्र ${V2} V की कम आपूर्ति वोल्टता पर चलता है। प्रतिरोध को अपरिवर्तित मानकर उसकी शक्ति W में ज्ञात कीजिए।${RT(P2, 1, lang)}`),
        answer: numM(P2, 1, [
          [(P * V2) / V, L("Power depends on $V^2$, not on $V$.", "शक्ति $V^2$ पर निर्भर है, $V$ पर नहीं।")],
          [P, L("The rated power applies only at 220 V.", "अनुमतांकित शक्ति केवल 220 V पर लागू है।")],
        ]),
        data: { given: [q("P", P, "W"), q("V", V, "V"), q("V'", V2, "V")], find: ["P'"] },
        hint: L("Find the resistance from the rating; it does not change.", "अनुमतांक से प्रतिरोध ज्ञात कीजिए; वह नहीं बदलता।"),
        formula: ["R = \\dfrac{V^2}{P}", "P' = \\dfrac{V'^2}{R}"],
        solution: L(
          `$R = \\dfrac{${V}^2}{${P}} ${ev((V * V) / P, 2)}\\ \\Omega$\n$P' = \\dfrac{V'^2}{R} = P \\left(\\dfrac{V'}{V}\\right)^2 = ${P} \\cdot \\left(\\dfrac{${V2}}{${V}}\\right)^2$\n$P' ${ev(P2, 1)}$ W`,
          `$R = \\dfrac{${V}^2}{${P}} ${ev((V * V) / P, 2)}\\ \\Omega$\n$P' = \\dfrac{V'^2}{R} = P \\left(\\dfrac{V'}{V}\\right)^2 = ${P} \\cdot \\left(\\dfrac{${V2}}{${V}}\\right)^2$\n$P' ${ev(P2, 1)}$ W`
        ),
      });
    }
    // vr 3: bill → power
    const rate = r.pick([5, 6, 7, 8]);
    const h = r.pick([2, 3, 4, 5]);
    const Pw = r.pick([500, 750, 1000, 1200, 1500, 2000]);
    const bill = (Pw / 1000) * h * 30 * rate;
    return task({
      text: L(`${who}'s family pays ₹${en(bill)} in 30 days for one heater only, used ${h} h every day. The rate is ₹${rate} per unit. Find the power of the heater, in W.`, `${who} का परिवार केवल एक हीटर के लिए, जो प्रतिदिन ${h} घंटे चलता है, 30 दिनों में ₹${en(bill)} चुकाता है। दर ₹${rate} प्रति यूनिट है। हीटर की शक्ति W में ज्ञात कीजिए।`),
      answer: numM(Pw, 0, [
        [Pw / 1000, L("The energy came out in kWh, so the power is in kW; convert it to W.", "ऊर्जा kWh में आई, अतः शक्ति kW में है; उसे W में बदलिए।")],
        [Pw * 30, L("Divide by the total time, $30 \\times$ hours per day.", "कुल समय, $30 \\times$ प्रतिदिन घंटे, से भाग दीजिए।")],
      ]),
      data: { given: [`${tx(L, ["bill", "बिल"])} = \\text{₹}\\,${en(bill)}`, `${tx(L, ["rate", "दर"])} = \\text{₹}\\,${rate}\\ /\\ \\mathrm{kWh}`, q("t", `30 \\cdot ${h}`, "h")], find: ["P"] },
      hint: L("The bill and the rate give the number of units (kWh).", "बिल और दर से यूनिटों (kWh) की संख्या मिलती है।"),
      formula: ["E = \\dfrac{\\text{bill}}{\\text{rate}}", "P = \\dfrac{E}{t}"],
      solution: L(
        `$E = \\dfrac{${en(bill)}}{${rate}} = ${en(bill / rate)}$ kWh\n$t = 30 \\cdot ${h} = ${30 * h}$ h\n$P = \\dfrac{${en(bill / rate)}}{${30 * h}} = ${en(Pw / 1000)}$ kW $= ${Pw}$ W`,
        `$E = \\dfrac{${en(bill)}}{${rate}} = ${en(bill / rate)}$ kWh\n$t = 30 \\cdot ${h} = ${30 * h}$ h\n$P = \\dfrac{${en(bill / rate)}}{${30 * h}} = ${en(Pw / 1000)}$ kW $= ${Pw}$ W`
      ),
    });
  },
};

// ---------- 3. Machines (ICSE Class 10) ----------
// Primeri vzvodov: [en, hi, razred, opis leg (en, hi)]
const LEVERS = [
  ["a pair of scissors", "कैंची", 1, ["the rivet (fulcrum) is between the handles (effort) and the cloth being cut (load)", "कील (आलंब) हत्थों (आयास) और कटने वाले कपड़े (भार) के बीच है"]],
  ["a see-saw", "सी-सॉ", 1, ["the pivot (fulcrum) is between the two children (load and effort)", "धुरी (आलंब) दोनों बच्चों (भार और आयास) के बीच है"]],
  ["a beam balance", "भौतिक तुला", 1, ["the fulcrum is at the middle, between the two pans", "आलंब बीच में, दोनों पलड़ों के बीच है"]],
  ["a pair of pliers", "प्लास", 1, ["the rivet (fulcrum) is between the handles (effort) and the jaws (load)", "कील (आलंब) हत्थों (आयास) और जबड़ों (भार) के बीच है"]],
  ["a wheelbarrow", "हाथ-ठेला (व्हीलबैरो)", 2, ["the load in the tray is between the wheel (fulcrum) and the handles (effort)", "ट्रे का भार पहिए (आलंब) और हत्थों (आयास) के बीच है"]],
  ["a nutcracker", "सरौता (नटक्रैकर)", 2, ["the nut (load) is between the hinge (fulcrum) and the handles (effort)", "मेवा (भार) कब्ज़े (आलंब) और हत्थों (आयास) के बीच है"]],
  ["a bottle opener", "बोतल ओपनर", 2, ["the cap edge (load) is between the fulcrum on top of the cap and the hand (effort)", "ढक्कन का किनारा (भार) ढक्कन के ऊपर के आलंब और हाथ (आयास) के बीच है"]],
  ["a lemon squeezer", "नींबू-निचोड़क", 2, ["the lemon (load) is between the hinge (fulcrum) and the handles (effort)", "नींबू (भार) कब्ज़े (आलंब) और हत्थों (आयास) के बीच है"]],
  ["a pair of fire tongs", "चिमटा", 3, ["the hand (effort) is between the hinge (fulcrum) and the coal held at the tips (load)", "हाथ (आयास) कब्ज़े (आलंब) और सिरों पर पकड़े कोयले (भार) के बीच है"]],
  ["a pair of sugar tongs", "चीनी उठाने की चिमटी", 3, ["the fingers (effort) are between the hinge (fulcrum) and the sugar cube (load)", "उँगलियाँ (आयास) कब्ज़े (आलंब) और चीनी के टुकड़े (भार) के बीच हैं"]],
  ["the human forearm lifting a load", "भार उठाती मानव अग्रबाहु", 3, ["the biceps muscle (effort) pulls between the elbow (fulcrum) and the load in the hand", "द्विशिर पेशी (आयास) कोहनी (आलंब) और हाथ के भार के बीच खींचती है"]],
  ["a fishing rod", "मछली पकड़ने की छड़", 3, ["the front hand (effort) is between the end held at the body (fulcrum) and the fish (load)", "आगे वाला हाथ (आयास) शरीर से टिके सिरे (आलंब) और मछली (भार) के बीच है"]],
];
const LEVER_OPTS = [
  null,
  ["Class I: fulcrum between load and effort", "प्रथम वर्ग: आलंब, भार और आयास के बीच"],
  ["Class II: load between fulcrum and effort", "द्वितीय वर्ग: भार, आलंब और आयास के बीच"],
  ["Class III: effort between fulcrum and load", "तृतीय वर्ग: आयास, आलंब और भार के बीच"],
];
const LEVER_TRAP = ["Class II: effort between fulcrum and load", "द्वितीय वर्ग: आयास, आलंब और भार के बीच"];

const MACHINE_FACTS = [
  {
    q: ["For a real machine the mechanical advantage is always less than its velocity ratio. Why?", "किसी वास्तविक मशीन का यांत्रिक लाभ सदैव उसके वेग अनुपात से कम होता है। क्यों?"],
    g: ["MA < VR", "MA < VR"],
    ok: ["Part of the work input is lost against friction and in lifting the moving parts", "निवेशी कार्य का कुछ भाग घर्षण के विरुद्ध और गतिशील भागों को उठाने में व्यय हो जाता है"],
    wrong: [
      [["The load moves farther than the effort", "भार, आयास से अधिक दूरी तय करता है"], ["Velocity ratio depends only on the design of the machine; friction lowers MA, not VR.", "वेग अनुपात केवल मशीन की बनावट पर निर्भर है; घर्षण MA घटाता है, VR नहीं।"]],
      [["The velocity ratio of a real machine increases because of friction", "घर्षण के कारण वास्तविक मशीन का वेग अनुपात बढ़ जाता है"], ["VR is fixed by the design (distances moved); friction does not change it.", "VR बनावट (तय की गई दूरियों) से निश्चित होता है; घर्षण उसे नहीं बदलता।"]],
      [["Energy is created in the machine", "मशीन में ऊर्जा उत्पन्न होती है"], ["No machine creates energy; work output is never more than work input.", "कोई मशीन ऊर्जा उत्पन्न नहीं करती; निर्गत कार्य कभी निवेशी कार्य से अधिक नहीं होता।"]],
    ],
    sol: ["$\\eta = \\dfrac{MA}{VR} < 1$ because some work input is wasted against friction and the weight of moving parts.", "$\\eta = \\dfrac{MA}{VR} < 1$, क्योंकि निवेशी कार्य का कुछ भाग घर्षण और गतिशील भागों के भार के विरुद्ध व्यर्थ जाता है।"],
  },
  {
    q: ["In a block and tackle, more pulleys are added (same load). What happens?", "एक घिरनी-तंत्र (ब्लॉक और टैकल) में और घिरनियाँ जोड़ी जाती हैं (भार वही)। क्या होता है?"],
    g: ["n \\uparrow", "n \\uparrow"],
    ok: ["VR increases, but the efficiency decreases (heavier lower block, more friction)", "VR बढ़ता है, परंतु दक्षता घटती है (निचला ब्लॉक भारी, घर्षण अधिक)"],
    wrong: [
      [["VR and efficiency both increase", "VR और दक्षता दोनों बढ़ते हैं"], ["More pulleys make the lower block heavier and add friction, so less of the work input lifts the load.", "अधिक घिरनियों से निचला ब्लॉक भारी होता है और घर्षण बढ़ता है, अतः निवेशी कार्य का कम भाग भार उठाता है।"]],
      [["VR stays the same, efficiency increases", "VR वही रहता है, दक्षता बढ़ती है"], ["For a block and tackle VR equals the number of pulleys, so VR does change.", "घिरनी-तंत्र में VR घिरनियों की संख्या के बराबर होता है, अतः VR बदलता है।"]],
      [["VR decreases, efficiency stays 100 %", "VR घटता है, दक्षता 100 % रहती है"], ["VR grows with the number of pulleys, and a real machine is never 100 % efficient.", "VR घिरनियों की संख्या के साथ बढ़ता है, और कोई वास्तविक मशीन 100 % दक्ष नहीं होती।"]],
    ],
    sol: ["VR = n grows with n; the heavier lower block and extra friction waste more work, so the efficiency falls.", "VR = n, n के साथ बढ़ता है; भारी निचला ब्लॉक और अतिरिक्त घर्षण अधिक कार्य व्यर्थ करते हैं, अतः दक्षता घटती है।"],
  },
  {
    q: ["Why is a single fixed pulley used even though its ideal mechanical advantage is only 1?", "एकल स्थिर घिरनी का आदर्श यांत्रिक लाभ केवल 1 है, फिर भी इसका उपयोग क्यों किया जाता है?"],
    g: ["MA = 1", "MA = 1"],
    ok: ["It changes the direction of the effort to a convenient one (pulling down)", "यह आयास की दिशा को सुविधाजनक दिशा (नीचे की ओर खींचना) में बदल देती है"],
    wrong: [
      [["It halves the effort needed", "यह आवश्यक आयास को आधा कर देती है"], ["Halving the effort is what a single movable pulley does (VR = 2).", "आयास को आधा एकल चल घिरनी करती है (VR = 2)।"]],
      [["It makes the load move faster than the effort", "इससे भार आयास से तेज़ चलता है"], ["For a fixed pulley VR = 1: load and effort move the same distance.", "स्थिर घिरनी में VR = 1: भार और आयास समान दूरी तय करते हैं।"]],
      [["Its efficiency is always 100 %", "इसकी दक्षता सदैव 100 % होती है"], ["Friction at the axle makes the efficiency of a real fixed pulley less than 100 %.", "धुरी पर घर्षण के कारण वास्तविक स्थिर घिरनी की दक्षता 100 % से कम होती है।"]],
    ],
    sol: ["A fixed pulley gives no force gain (MA ≈ 1) but lets us pull downward, using our own weight.", "स्थिर घिरनी बल में लाभ नहीं देती (MA ≈ 1), पर हम नीचे की ओर खींच सकते हैं और अपने भार का उपयोग कर सकते हैं।"],
  },
];

const exiMachines = {
  id: "exi-fiz-machines",
  topics: [T("machines")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const vr = r.int(0, 4);
    if (level === 1) {
      if (vr === 0) {
        const E = r.pick([20, 25, 40, 50, 80, 100, 120, 150]);
        const MA = r.pick([1.5, 2, 2.5, 3, 4, 5, 6]);
        const Ld = E * MA;
        return task({
          text: L(`A machine lifts a load of ${en(Ld)} N when an effort of ${E} N is applied. Find its mechanical advantage.`, `एक मशीन ${E} N का आयास लगाने पर ${en(Ld)} N का भार उठाती है। उसका यांत्रिक लाभ ज्ञात कीजिए।`),
          answer: numM(MA, 2, [[E / Ld, L("Mechanical advantage is load ÷ effort, not effort ÷ load.", "यांत्रिक लाभ = भार ÷ आयास, आयास ÷ भार नहीं।")], [Ld - E, L("MA is a ratio, not a difference.", "MA एक अनुपात है, अंतर नहीं।")]]),
          data: { given: [q("L", Ld, "N"), q("E", E, "N")], find: ["MA"] },
          hint: L("MA tells how many times the load is bigger than the effort.", "MA बताता है कि भार आयास का कितने गुना है।"),
          formula: "MA = \\dfrac{L}{E}",
          solution: L(`$MA = \\dfrac{L}{E} = \\dfrac{${en(Ld)}}{${E}}$\n$MA = ${en(MA)}$ (no unit)`, `$MA = \\dfrac{L}{E} = \\dfrac{${en(Ld)}}{${E}}$\n$MA = ${en(MA)}$ (कोई मात्रक नहीं)`),
        });
      }
      if (vr === 1) {
        // Brez tehtnice (enaki ročici, MA = 1 ne glede na mult).
        const k0 = r.int(0, LEVERS.length - 2);
        const k = k0 >= 2 ? k0 + 1 : k0;
        const cls = LEVERS[k][2];
        const base = r.pick([2, 3, 4, 5, 6, 8]);
        const mult = r.pick([2, 3, 4]);
        // II: ročica sile daljša; III: krajša; I: lahko oboje.
        const [ea, la] = cls === 2 ? [base * mult, base] : cls === 3 ? [base, base * mult] : mult === 3 ? [base, base * 1.5] : [base * mult, base];
        const MA = ea / la;
        return task({
          text: L(`In ${LEVERS[k][0]}, the effort arm is ${en(ea)} cm and the load arm is ${la} cm. Find the mechanical advantage.${RT(MA, 2, lang)}`, `${LEVERS[k][1]} में आयास भुजा ${en(ea)} cm और भार भुजा ${la} cm है। यांत्रिक लाभ ज्ञात कीजिए।${RT(MA, 2, lang)}`),
          answer: numM(MA, 2, [[la / ea, L("MA = effort arm ÷ load arm; you inverted it.", "MA = आयास भुजा ÷ भार भुजा; आपने उल्टा कर दिया।")], [ea * la, L("MA is a ratio of the arms, not a product.", "MA भुजाओं का अनुपात है, गुणनफल नहीं।")]]),
          data: { given: [q("\\text{effort arm}", ea, "cm").replace("effort arm", L("effort arm", "आयास भुजा")), q("\\text{load arm}", la, "cm").replace("load arm", L("load arm", "भार भुजा"))], find: ["MA"] },
          hint: L("By the principle of moments, L × load arm = E × effort arm.", "आघूर्णों के सिद्धांत से, L × भार भुजा = E × आयास भुजा।"),
          formula: "MA = \\dfrac{\\text{effort arm}}{\\text{load arm}}".replace("effort arm", L("effort arm", "आयास भुजा")).replace("load arm", L("load arm", "भार भुजा")),
          solution: L(`$MA = \\dfrac{${en(ea)}}{${la}}$\n$MA ${ev(MA, 2)}$`, `$MA = \\dfrac{${en(ea)}}{${la}}$\n$MA ${ev(MA, 2)}$`),
        });
      }
      if (vr === 2) {
        const VR = r.pick([2, 3, 4, 5, 6]);
        const eta = r.pick([50, 60, 65, 70, 75, 80, 85, 90]);
        const MA = (VR * eta) / 100;
        return task({
          text: L(`A machine has velocity ratio ${VR} and mechanical advantage ${en(MA)}. Find its efficiency in %.`, `एक मशीन का वेग अनुपात ${VR} और यांत्रिक लाभ ${en(MA)} है। उसकी दक्षता % में ज्ञात कीजिए।`),
          answer: numM(eta, 1, [[(100 * VR) / MA, L("Efficiency is MA ÷ VR; you inverted it.", "दक्षता = MA ÷ VR; आपने उल्टा कर दिया।")], [MA * VR, L("Divide MA by VR, then multiply by 100 %.", "MA को VR से भाग दीजिए, फिर 100 % से गुणा कीजिए।")]]),
          data: { given: [q("VR", VR), q("MA", MA)], find: ["\\eta"] },
          hint: L("Efficiency compares MA with VR.", "दक्षता MA की तुलना VR से करती है।"),
          formula: "\\eta = \\dfrac{MA}{VR} \\times 100\\,\\%",
          solution: L(`$\\eta = \\dfrac{${en(MA)}}{${VR}} \\times 100\\,\\%$\n$\\eta = ${eta}\\,\\%$`, `$\\eta = \\dfrac{${en(MA)}}{${VR}} \\times 100\\,\\%$\n$\\eta = ${eta}\\,\\%$`),
        });
      }
      if (vr === 3) {
        const Ld = r.pick([100, 150, 200, 240, 300, 360, 500]);
        const fixed = r.int(0, 1) === 1;
        const E = fixed ? Ld : Ld / 2;
        return task({
          text: L(`${who} lifts a load of ${Ld} N using a single ${fixed ? "fixed" : "movable"} pulley. Ignoring friction and the weight of the pulley, what effort is needed, in N?`, `${who} एकल ${fixed ? "स्थिर" : "चल"} घिरनी से ${Ld} N का भार ${ni % 2 ? "उठाती" : "उठाता"} है। घर्षण और घिरनी का भार नगण्य मानकर कितना आयास (N में) लगेगा?`),
          answer: numM(E, 1, [[fixed ? Ld / 2 : Ld, L(fixed ? "A fixed pulley only changes the direction of the force; VR = 1." : "A movable pulley is held by two segments of the rope; VR = 2.", fixed ? "स्थिर घिरनी केवल बल की दिशा बदलती है; VR = 1।" : "चल घिरनी रस्सी के दो भागों पर टिकी होती है; VR = 2।")], [2 * Ld, L("An ideal pulley never needs more effort than the load.", "आदर्श घिरनी में आयास कभी भार से अधिक नहीं होता।")]]),
          data: { given: [q("L", Ld, "N")], find: ["E"] },
          hint: L("For an ideal machine MA = VR. Count the rope segments that hold the load.", "आदर्श मशीन में MA = VR। भार को थामने वाली रस्सी के भाग गिनिए।"),
          formula: "E = \\dfrac{L}{MA},\\quad MA = VR",
          solution: L(`${fixed ? "Fixed pulley: VR = 1" : "Movable pulley: VR = 2"}, ideal → MA = VR\n$E = \\dfrac{${Ld}}{${fixed ? 1 : 2}} = ${E}$ N`, `${fixed ? "स्थिर घिरनी: VR = 1" : "चल घिरनी: VR = 2"}, आदर्श → MA = VR\n$E = \\dfrac{${Ld}}{${fixed ? 1 : 2}} = ${E}$ N`),
        });
      }
      const k = r.int(0, LEVERS.length - 1);
      const [nEn, nHi, cls, desc] = LEVERS[k];
      const MID = [null, ["fulcrum", "आलंब"], ["load", "भार"], ["effort", "आयास"]];
      const RN = [null, ["I", "प्रथम"], ["II", "द्वितीय"], ["III", "तृतीय"]];
      const wrong = [1, 2, 3].filter((c) => c !== cls).map((c) => [LEVER_OPTS[c], [`In class ${RN[c][0]} the ${MID[c][0]} is in the middle, but here ${desc[0]}.`, `${RN[c][1]} वर्ग में बीच में ${MID[c][1]} होता है, पर यहाँ ${desc[1]}।`]]);
      wrong.push([LEVER_TRAP, ["In class II the load, not the effort, is in the middle; effort in the middle is class III.", "द्वितीय वर्ग में बीच में भार होता है, आयास नहीं; बीच में आयास हो तो तृतीय वर्ग होता है।"]]);
      const answer = ch(r, L, LEVER_OPTS[cls], wrong);
      return task({
        text: L(`To which class of levers does ${nEn} belong?`, `${nHi} किस वर्ग का उत्तोलक है?`),
        answer,
        data: { given: [tx(L, [nEn, nHi])], find: [tx(L, ["class", "वर्ग"])] },
        hint: L("Find what lies in the middle: the fulcrum, the load or the effort.", "देखिए कि बीच में क्या है: आलंब, भार या आयास।"),
        formula: false,
        solution: L(`In ${nEn}, ${desc[0]}.\nAnswer: ${LEVER_OPTS[cls][0]}.`, `${nHi} में ${desc[1]}।\nउत्तर: ${LEVER_OPTS[cls][1]}।`),
      });
    }
    if (level === 2) {
      if (vr === 0) {
        const MC = [];
        for (const e of [50, 60, 80, 100, 120, 150]) for (const v of [3, 4, 5, 6, 8]) for (const h of [60, 70, 75, 80, 90]) if ((e * v * h) % 100 === 0) MC.push([e, v, h]);
        const [E, VR, eta] = r.pick(MC);
        const Ld = (E * VR * eta) / 100;
        const dL = r.pick([0.5, 1, 1.5, 2]);
        const dE = dL * VR;
        return task({
          text: L(`In a machine an effort of ${E} N moves through ${en(dE)} m while the load of ${en(Ld)} N rises by ${en(dL)} m. Find the efficiency of the machine in %.`, `एक मशीन में ${E} N का आयास ${en(dE)} m चलता है, जबकि ${en(Ld)} N का भार ${en(dL)} m ऊपर उठता है। मशीन की दक्षता % में ज्ञात कीजिए।`),
          answer: numM(eta, 1, [[(100 * Ld) / E, L("You found MA only; divide it by VR.", "आपने केवल MA निकाला; उसे VR से भाग दीजिए।")], [(100 * VR * E) / Ld, L("Efficiency is MA ÷ VR; you inverted it.", "दक्षता = MA ÷ VR; आपने उल्टा कर दिया।")]]),
          data: { given: [q("E", E, "N"), q("d_E", dE, "m"), q("L", Ld, "N"), q("d_L", dL, "m")], find: ["MA", "VR", "\\eta"] },
          hint: L("Find MA from the forces and VR from the distances.", "बलों से MA और दूरियों से VR ज्ञात कीजिए।"),
          formula: ["MA = \\dfrac{L}{E}", "VR = \\dfrac{d_E}{d_L}", "\\eta = \\dfrac{MA}{VR} \\times 100\\,\\%"],
          solution: L(
            `$MA = \\dfrac{${en(Ld)}}{${E}} = ${en(Ld / E)}$\n$VR = \\dfrac{${en(dE)}}{${en(dL)}} = ${VR}$\n$\\eta = \\dfrac{${en(Ld / E)}}{${VR}} \\times 100\\,\\% = ${eta}\\,\\%$`,
            `$MA = \\dfrac{${en(Ld)}}{${E}} = ${en(Ld / E)}$\n$VR = \\dfrac{${en(dE)}}{${en(dL)}} = ${VR}$\n$\\eta = \\dfrac{${en(Ld / E)}}{${VR}} \\times 100\\,\\% = ${eta}\\,\\%$`
          ),
        });
      }
      if (vr === 1) {
        const BC = [];
        for (const nn of [3, 4, 5, 6]) for (const e of [100, 120, 125, 150, 200, 250]) for (const h of [60, 70, 75, 80, 90]) if ((e * nn * h) % 500 === 0) BC.push([nn, e, h]);
        const [n, E, eta] = r.pick(BC);
        const Ld = (E * n * eta) / 100;
        const lower = Math.floor(n / 2);
        return task({
          text: L(`A block and tackle has ${n} pulleys in all. ${who} lifts a load of ${en(Ld)} N with an effort of ${E} N. Find the efficiency in %.`, `एक घिरनी-तंत्र (ब्लॉक और टैकल) में कुल ${n} घिरनियाँ हैं। ${who} ${E} N के आयास से ${en(Ld)} N का भार ${ni % 2 ? "उठाती" : "उठाता"} है। दक्षता % में ज्ञात कीजिए।`),
          answer: numM(eta, 1, [[(100 * Ld) / E / lower, L("VR is the total number of pulleys in both blocks, not only the lower block.", "VR दोनों ब्लॉकों की कुल घिरनियों की संख्या है, केवल निचले ब्लॉक की नहीं।")], [(100 * Ld) / E, L("You found MA × 100; divide MA by VR first.", "आपने MA × 100 निकाला; पहले MA को VR से भाग दीजिए।")]]),
          data: { given: [q("n", n), q("L", Ld, "N"), q("E", E, "N")], find: ["\\eta"] },
          hint: L("In a block and tackle VR equals the total number of pulleys.", "घिरनी-तंत्र में VR घिरनियों की कुल संख्या के बराबर होता है।"),
          formula: ["VR = n", "\\eta = \\dfrac{MA}{VR} \\times 100\\,\\%"],
          solution: L(
            `$VR = n = ${n}$\n$MA = \\dfrac{${en(Ld)}}{${E}} = ${en(Ld / E)}$\n$\\eta = \\dfrac{${en(Ld / E)}}{${n}} \\times 100\\,\\% = ${eta}\\,\\%$`,
            `$VR = n = ${n}$\n$MA = \\dfrac{${en(Ld)}}{${E}} = ${en(Ld / E)}$\n$\\eta = \\dfrac{${en(Ld / E)}}{${n}} \\times 100\\,\\% = ${eta}\\,\\%$`
          ),
        });
      }
      if (vr === 2 || vr === 3) {
        // vr 2: samokolnica (II. razred), vr 3: podlaket (III. razred); g = 10 m/s²
        const barrow = vr === 2;
        const m = barrow ? r.pick([40, 50, 60, 75, 80, 90]) : r.pick([2, 3, 4, 5, 6]);
        const a = barrow ? r.pick([30, 40, 50]) : r.pick([3, 4, 5]);
        const b = barrow ? r.pick([120, 140, 150, 160]) : r.pick([30, 32, 35, 40]);
        const W = m * 10;
        const E = barrow ? (W * a) / b : (W * b) / a;
        const txt = barrow
          ? L(`${who} carries ${m} kg of bricks in a wheelbarrow. The load acts ${a} cm from the wheel axle and ${who} lifts the handles ${b} cm from the axle. Find the effort needed, in N (g = 10 m/s²).${RT(E, 1, lang)}`, `${who} हाथ-ठेले में ${m} kg ईंटें ${ni % 2 ? "ले जाती" : "ले जाता"} है। भार पहिए की धुरी से ${a} cm पर है और हत्थे धुरी से ${b} cm पर उठाए जाते हैं। आवश्यक आयास N में ज्ञात कीजिए (g = 10 m/s²)।${RT(E, 1, lang)}`)
          : L(`${who} holds a ${m} kg ball in the hand, ${b} cm from the elbow. The biceps muscle pulls on the forearm ${a} cm from the elbow. Find the force of the muscle, in N (g = 10 m/s², ignore the weight of the forearm).${RT(E, 1, lang)}`, `${who} हाथ में ${m} kg की गेंद पकड़े है, जो कोहनी से ${b} cm दूर है। द्विशिर पेशी अग्रबाहु को कोहनी से ${a} cm पर खींचती है। पेशी का बल N में ज्ञात कीजिए (g = 10 m/s², अग्रबाहु का भार नगण्य)।${RT(E, 1, lang)}`);
        return task({
          text: txt,
          answer: numM(E, 1, [
            [barrow ? (m * a) / b : (m * b) / a, L("Convert the mass to weight: W = mg.", "द्रव्यमान को भार में बदलिए: W = mg।")],
            [barrow ? (W * b) / a : (W * a) / b, L("Effort × effort arm = load × load arm; you swapped the arms.", "आयास × आयास भुजा = भार × भार भुजा; आपने भुजाएँ बदल दीं।")],
          ]),
          data: { given: [q("m", m, "kg"), q("g", 10, "m/s^2"), q(L("\\text{load arm}", "\\text{भार भुजा}"), barrow ? a : b, "cm"), q(L("\\text{effort arm}", "\\text{आयास भुजा}"), barrow ? b : a, "cm")], find: ["E"] },
          hint: L("Take moments about the fulcrum: the wheel axle / the elbow.", "आलंब के परितः आघूर्ण लीजिए: पहिए की धुरी / कोहनी।"),
          formula: "E \\cdot \\text{effort arm} = L \\cdot \\text{load arm}".replace("effort arm", L("effort arm", "आयास भुजा")).replace("load arm", L("load arm", "भार भुजा")),
          solution: L(
            `$L = mg = ${m} \\cdot 10 = ${W}$ N\n$E \\cdot ${barrow ? b : a} = ${W} \\cdot ${barrow ? a : b}$\n$E ${ev(E, 1)}$ N (${barrow ? "class II lever: E < L" : "class III lever: E > L"})`,
            `$L = mg = ${m} \\cdot 10 = ${W}$ N\n$E \\cdot ${barrow ? b : a} = ${W} \\cdot ${barrow ? a : b}$\n$E ${ev(E, 1)}$ N (${barrow ? "द्वितीय वर्ग का उत्तोलक: E < L" : "तृतीय वर्ग का उत्तोलक: E > L"})`
          ),
        });
      }
      const it = r.pick(MACHINE_FACTS);
      const answer = ch(r, L, it.ok, it.wrong);
      return task({
        text: L(...it.q),
        answer,
        data: { given: [it.g[0]], find: [tx(L, ["reason", "कारण"])] },
        hint: L("Separate what depends only on the design (VR) from what depends on friction and weights (MA, η).", "जो केवल बनावट पर निर्भर है (VR) उसे, घर्षण और भार पर निर्भर राशियों (MA, η) से अलग कीजिए।"),
        formula: "\\eta = \\dfrac{MA}{VR}",
        solution: L(`${it.sol[0]}\nAnswer: ${it.ok[0]}.`, `${it.sol[1]}\nउत्तर: ${it.ok[1]}।`),
      });
    }
    // level 3
    if (vr === 0) {
      const n = r.pick([2, 3, 4, 5, 6]);
      const w = r.pick([20, 30, 40, 50, 60]);
      const Ld = r.pick([300, 400, 500, 600, 750, 900]);
      const E = (Ld + w) / n;
      const eta = (100 * Ld) / (Ld + w);
      const askE = r.int(0, 1) === 1;
      const val = askE ? E : eta;
      return task({
        text: L(
          `A block and tackle has ${n} pulleys; its lower (movable) block weighs ${w} N. It lifts a load of ${Ld} N. Ignoring friction, find ${askE ? "the effort, in N" : "the efficiency, in %"}.${RT(val, 1, lang)}`,
          `एक घिरनी-तंत्र में ${n} घिरनियाँ हैं; उसके निचले (चल) ब्लॉक का भार ${w} N है। यह ${Ld} N का भार उठाता है। घर्षण नगण्य मानकर ${askE ? "आयास N में" : "दक्षता % में"} ज्ञात कीजिए।${RT(val, 1, lang)}`
        ),
        answer: numM(val, 1, askE
          ? [[Ld / n, L("The effort also lifts the lower block: use L + w.", "आयास निचले ब्लॉक को भी उठाता है: L + w लीजिए।")], [(Ld - w) / n, L("The block's weight adds to the load; it does not help.", "ब्लॉक का भार भार में जुड़ता है; वह सहायता नहीं करता।")]]
          : [[100, L("The weight of the lower block is also lifted, so the efficiency is below 100 %.", "निचला ब्लॉक भी उठाया जाता है, इसलिए दक्षता 100 % से कम है।")], [(100 * (Ld - w)) / Ld, L("Useful work lifts L; total work lifts L + w. Use L/(L + w).", "उपयोगी कार्य L को उठाता है; कुल कार्य L + w को। L/(L + w) लीजिए।")]]),
        data: { given: [q("n", n), q("w", w, "N"), q("L", Ld, "N")], find: [askE ? "E" : "\\eta"] },
        hint: L("The n rope segments hold the load and the lower block together.", "रस्सी के n भाग भार और निचले ब्लॉक को साथ-साथ थामते हैं।"),
        formula: askE ? "E = \\dfrac{L + w}{n}" : "\\eta = \\dfrac{MA}{VR} = \\dfrac{L}{L + w}",
        solution: L(
          `$VR = ${n}$\n$E = \\dfrac{L + w}{n} = \\dfrac{${Ld} + ${w}}{${n}} ${ev(E, 2)}$ N\n${askE ? `Effort $E ${ev(E, 1)}$ N` : `$MA = \\dfrac{L}{E} ${ev(Ld / E, 3)}$\n$\\eta = \\dfrac{MA}{VR} \\times 100\\,\\% = \\dfrac{${Ld}}{${Ld + w}} \\times 100\\,\\% ${ev(eta, 1)}\\,\\%$`}`,
          `$VR = ${n}$\n$E = \\dfrac{L + w}{n} = \\dfrac{${Ld} + ${w}}{${n}} ${ev(E, 2)}$ N\n${askE ? `आयास $E ${ev(E, 1)}$ N` : `$MA = \\dfrac{L}{E} ${ev(Ld / E, 3)}$\n$\\eta = \\dfrac{MA}{VR} \\times 100\\,\\% = \\dfrac{${Ld}}{${Ld + w}} \\times 100\\,\\% ${ev(eta, 1)}\\,\\%$`}`
        ),
      });
    }
    if (vr === 1) {
      const n = r.pick([3, 4, 5, 6]);
      const eta = r.pick([60, 70, 75, 80, 90]);
      const m = r.pick([60, 80, 100, 120, 150, 200]);
      const W = m * 10;
      const E = W / ((n * eta) / 100);
      return task({
        text: L(`A block and tackle with ${n} pulleys has an efficiency of ${eta} %. What effort is needed to lift a ${m} kg crate with it, in N? (g = 10 m/s²)${RT(E, 1, lang)}`, `${n} घिरनियों वाले घिरनी-तंत्र की दक्षता ${eta} % है। इससे ${m} kg का बक्सा उठाने के लिए कितना आयास (N में) चाहिए? (g = 10 m/s²)${RT(E, 1, lang)}`),
        answer: numM(E, 1, [[W / n, L("That is the ideal effort; with efficiency below 100 % more effort is needed.", "यह आदर्श आयास है; 100 % से कम दक्षता पर अधिक आयास लगता है।")], [(W / n) * (eta / 100), L("Real MA = η × VR; divide the load by it, do not multiply by η.", "वास्तविक MA = η × VR; भार को इससे भाग दीजिए, η से गुणा मत कीजिए।")], [m / ((n * eta) / 100), L("Convert the mass to weight: W = mg.", "द्रव्यमान को भार में बदलिए: W = mg।")]]),
        data: { given: [q("n", n), q("\\eta", `${eta}\\,\\%`), q("m", m, "kg"), q("g", 10, "m/s^2")], find: ["E"] },
        hint: L("Find VR, then the real MA from the efficiency.", "VR ज्ञात कीजिए, फिर दक्षता से वास्तविक MA।"),
        formula: ["VR = n", "MA = \\eta \\cdot VR", "E = \\dfrac{L}{MA}"],
        solution: L(
          `$L = mg = ${W}$ N, $VR = ${n}$\n$MA = ${en(eta / 100)} \\cdot ${n} = ${en((n * eta) / 100)}$\n$E = \\dfrac{${W}}{${en((n * eta) / 100)}} ${ev(E, 1)}$ N`,
          `$L = mg = ${W}$ N, $VR = ${n}$\n$MA = ${en(eta / 100)} \\cdot ${n} = ${en((n * eta) / 100)}$\n$E = \\dfrac{${W}}{${en((n * eta) / 100)}} ${ev(E, 1)}$ N`
        ),
      });
    }
    if (vr === 2) {
      const w = r.pick([10, 20, 25, 40, 50]);
      const Ld = r.pick([100, 150, 200, 250, 300, 400]);
      const E = (Ld + w) / 2;
      const MA = Ld / E;
      return task({
        text: L(`A single movable pulley weighing ${w} N is used to lift a load of ${Ld} N. Ignoring friction, find the mechanical advantage.${RT(MA, 2, lang)}`, `${w} N भार वाली एकल चल घिरनी से ${Ld} N का भार उठाया जाता है। घर्षण नगण्य मानकर यांत्रिक लाभ ज्ञात कीजिए।${RT(MA, 2, lang)}`),
        answer: numM(MA, 2, [[2, L("2 is the ideal value; the pulley's own weight must also be lifted.", "2 आदर्श मान है; घिरनी का अपना भार भी उठाना पड़ता है।")], [(Ld - w) / (Ld / 2), L("The pulley's weight adds to the load on the rope.", "घिरनी का भार रस्सी पर भार में जुड़ता है।")]]),
        data: { given: [q("w", w, "N"), q("L", Ld, "N")], find: ["E", "MA"] },
        hint: L("Two rope segments hold the load and the pulley together.", "रस्सी के दो भाग भार और घिरनी दोनों को थामते हैं।"),
        formula: ["2E = L + w", "MA = \\dfrac{L}{E}"],
        solution: L(
          `$E = \\dfrac{L + w}{2} = \\dfrac{${Ld} + ${w}}{2} = ${en(E)}$ N\n$MA = \\dfrac{${Ld}}{${en(E)}} ${ev(MA, 2)}$ (less than VR = 2)`,
          `$E = \\dfrac{L + w}{2} = \\dfrac{${Ld} + ${w}}{2} = ${en(E)}$ N\n$MA = \\dfrac{${Ld}}{${en(E)}} ${ev(MA, 2)}$ (VR = 2 से कम)`
        ),
      });
    }
    if (vr === 3) {
      const E = r.pick([50, 75, 100, 120, 150]);
      const VR = r.pick([2, 3, 4]);
      const dE = VR * r.pick([0.5, 1, 1.5, 2]);
      const eta = r.pick([60, 70, 75, 80]);
      const Ld = (E * VR * eta) / 100;
      const dL = dE / VR;
      const waste = E * dE - Ld * dL;
      return task({
        text: L(`Using a machine, ${who} applies ${E} N through ${dE} m and raises a load of ${en(Ld)} N by ${en(dL)} m. How much energy is wasted, in J?${RT(waste, 1, lang)}`, `एक मशीन से ${who} ${E} N का आयास ${dE} m तक ${ni % 2 ? "लगाती" : "लगाता"} है और ${en(Ld)} N का भार ${en(dL)} m ऊपर ${ni % 2 ? "उठाती" : "उठाता"} है। कितनी ऊर्जा व्यर्थ होती है, J में?${RT(waste, 1, lang)}`),
        answer: numM(waste, 1, [[E * dE, L("This is the work input; subtract the useful work.", "यह निवेशी कार्य है; इसमें से उपयोगी कार्य घटाइए।")], [Ld * dL, L("This is the useful work output, not the energy wasted.", "यह उपयोगी निर्गत कार्य है, व्यर्थ ऊर्जा नहीं।")]]),
        data: { given: [q("E", E, "N"), q("d_E", dE, "m"), q("L", Ld, "N"), q("d_L", dL, "m")], find: ["W_{in}", "W_{out}", "W_{waste}"] },
        hint: L("Work input = effort × its distance; work output = load × its distance.", "निवेशी कार्य = आयास × उसकी दूरी; निर्गत कार्य = भार × उसकी दूरी।"),
        formula: ["W_{in} = E d_E,\\quad W_{out} = L d_L", "W_{waste} = W_{in} - W_{out}"],
        solution: L(
          `$W_{in} = ${E} \\cdot ${dE} = ${E * dE}$ J\n$W_{out} = ${en(Ld)} \\cdot ${en(dL)} ${ev(Ld * dL, 1)}$ J\n$W_{waste} ${ev(waste, 1)}$ J`,
          `$W_{in} = ${E} \\cdot ${dE} = ${E * dE}$ J\n$W_{out} = ${en(Ld)} \\cdot ${en(dL)} ${ev(Ld * dL, 1)}$ J\n$W_{waste} ${ev(waste, 1)}$ J`
        ),
      });
    }
    // vr 4: konceptualno – razred vzvoda z MA (zakaj ima III. razred vedno MA < 1)
    const cls = r.pick([2, 3]);
    const okT = cls === 3
      ? ["Class III, because the effort arm is always shorter than the load arm", "तृतीय वर्ग, क्योंकि आयास भुजा सदैव भार भुजा से छोटी होती है"]
      : ["Class II, because the effort arm is always longer than the load arm", "द्वितीय वर्ग, क्योंकि आयास भुजा सदैव भार भुजा से बड़ी होती है"];
    const wrong = [
      [cls === 3 ? ["Class II, because the load is between the fulcrum and the effort", "द्वितीय वर्ग, क्योंकि भार आलंब और आयास के बीच है"] : ["Class III, because the effort is between the fulcrum and the load", "तृतीय वर्ग, क्योंकि आयास आलंब और भार के बीच है"], cls === 3 ? ["In class II the effort arm is longer, so MA > 1.", "द्वितीय वर्ग में आयास भुजा बड़ी होती है, अतः MA > 1।"] : ["In class III the effort arm is shorter, so MA < 1.", "तृतीय वर्ग में आयास भुजा छोटी होती है, अतः MA < 1।"]],
      [["Class I, because the fulcrum is in the middle", "प्रथम वर्ग, क्योंकि आलंब बीच में है"], ["In class I, MA can be more than, equal to or less than 1, depending on where the fulcrum is.", "प्रथम वर्ग में आलंब की स्थिति के अनुसार MA 1 से अधिक, बराबर या कम हो सकता है।"]],
      [["Every class, because friction always reduces MA", "हर वर्ग, क्योंकि घर्षण सदैव MA घटाता है"], ["For an ideal lever MA is decided by the ratio of the arms, not by friction.", "आदर्श उत्तोलक में MA भुजाओं के अनुपात से तय होता है, घर्षण से नहीं।"]],
    ];
    const answer = ch(r, L, okT, wrong);
    return task({
      text: cls === 3
        ? L("Which class of lever always has a mechanical advantage less than 1, and why? (Ideal levers)", "किस वर्ग के उत्तोलक का यांत्रिक लाभ सदैव 1 से कम होता है, और क्यों? (आदर्श उत्तोलक)")
        : L("Which class of lever always has a mechanical advantage more than 1, and why? (Ideal levers)", "किस वर्ग के उत्तोलक का यांत्रिक लाभ सदैव 1 से अधिक होता है, और क्यों? (आदर्श उत्तोलक)"),
      answer,
      data: { given: [cls === 3 ? "MA < 1" : "MA > 1"], find: [tx(L, ["class", "वर्ग"])] },
      hint: L("For an ideal lever MA = effort arm ÷ load arm. Which arm is longer in each class?", "आदर्श उत्तोलक में MA = आयास भुजा ÷ भार भुजा। प्रत्येक वर्ग में कौन-सी भुजा बड़ी है?"),
      formula: "MA = \\dfrac{\\text{effort arm}}{\\text{load arm}}".replace("effort arm", L("effort arm", "आयास भुजा")).replace("load arm", L("load arm", "भार भुजा")),
      solution: L(
        `${cls === 3 ? "Effort in the middle → effort arm < load arm" : "Load in the middle → effort arm > load arm"}\nAnswer: ${okT[0]}.`,
        `${cls === 3 ? "बीच में आयास → आयास भुजा < भार भुजा" : "बीच में भार → आयास भुजा > भार भुजा"}\nउत्तर: ${okT[1]}।`
      ),
    });
  },
};

// ---------- 4. Moments and equilibrium (ICSE) ----------
const MOMENT_FACTS = [
  {
    q: ["Where is the centre of gravity of a uniform circular ring?", "एकसमान वृत्ताकार वलय का गुरुत्व केंद्र कहाँ होता है?"],
    g: ["ring", "वलय"],
    ok: ["At the centre of the ring, where there is no material", "वलय के केंद्र पर, जहाँ कोई पदार्थ नहीं है"],
    wrong: [
      [["On the ring itself, at its lowest point", "वलय पर ही, उसके सबसे निचले बिंदु पर"], ["The centre of gravity does not move with the position of the ring; by symmetry it is at the centre.", "गुरुत्व केंद्र वलय की स्थिति के साथ नहीं बदलता; सममिति से वह केंद्र पर है।"]],
      [["Anywhere on the rim", "परिधि पर कहीं भी"], ["A body has one definite centre of gravity; for a ring it is at the centre.", "किसी वस्तु का एक निश्चित गुरुत्व केंद्र होता है; वलय के लिए वह केंद्र पर है।"]],
      [["A ring has no centre of gravity because its centre is empty", "वलय का कोई गुरुत्व केंद्र नहीं होता क्योंकि उसका केंद्र खाली है"], ["The centre of gravity can lie outside the material of the body.", "गुरुत्व केंद्र वस्तु के पदार्थ के बाहर भी हो सकता है।"]],
    ],
    sol: ["By symmetry the weight of a uniform ring acts at its geometric centre, even though there is no material there.", "सममिति से एकसमान वलय का भार उसके ज्यामितीय केंद्र पर कार्य करता है, यद्यपि वहाँ कोई पदार्थ नहीं है।"],
  },
  {
    q: ["Why is the handle of a door fixed far from the hinges?", "दरवाज़े का हत्था कब्ज़ों से दूर क्यों लगाया जाता है?"],
    g: ["door", "दरवाज़ा"],
    ok: ["A larger perpendicular distance gives a larger moment for the same force", "अधिक लंबवत दूरी से उसी बल का आघूर्ण अधिक होता है"],
    wrong: [
      [["It reduces the friction in the hinges", "इससे कब्ज़ों का घर्षण घटता है"], ["The position of the handle does not change the friction in the hinges.", "हत्थे की स्थिति कब्ज़ों के घर्षण को नहीं बदलती।"]],
      [["It increases the force we apply", "इससे लगाया गया बल बढ़ जाता है"], ["The force is the same; the moment is larger because the distance is larger.", "बल वही है; दूरी अधिक होने से आघूर्ण अधिक होता है।"]],
      [["It makes the moment of the force zero", "इससे बल का आघूर्ण शून्य हो जाता है"], ["The moment is zero only when the force acts through the hinges.", "आघूर्ण तभी शून्य होता है जब बल कब्ज़ों से होकर लगे।"]],
    ],
    sol: ["Moment = F × d; far from the hinges d is large, so a small force turns the door easily.", "आघूर्ण = F × d; कब्ज़ों से दूर d अधिक है, अतः कम बल से दरवाज़ा आसानी से घूमता है।"],
  },
  {
    q: ["Two equal and opposite parallel forces act on a body along different lines (a couple). What do they produce?", "किसी वस्तु पर दो बराबर और विपरीत समांतर बल अलग-अलग रेखाओं पर लगते हैं (बलयुग्म)। इनसे क्या उत्पन्न होता है?"],
    g: ["couple", "बलयुग्म"],
    ok: ["Only rotation: the net force is zero but the net moment is not", "केवल घूर्णन: परिणामी बल शून्य है पर परिणामी आघूर्ण नहीं"],
    wrong: [
      [["Only translation in the direction of the larger force", "केवल बड़े बल की दिशा में स्थानांतरण"], ["The forces are equal, so the net force is zero and there is no translation.", "बल बराबर हैं, अतः परिणामी बल शून्य है और स्थानांतरण नहीं होता।"]],
      [["Both rotation and translation", "घूर्णन और स्थानांतरण दोनों"], ["A couple has zero net force, so it cannot produce translation.", "बलयुग्म का परिणामी बल शून्य है, अतः वह स्थानांतरण नहीं कर सकता।"]],
      [["Nothing, because the forces cancel", "कुछ नहीं, क्योंकि बल एक-दूसरे को निरस्त कर देते हैं"], ["The forces cancel, but their moments add because they act along different lines.", "बल निरस्त होते हैं, पर अलग रेखाओं पर लगने से उनके आघूर्ण जुड़ जाते हैं।"]],
    ],
    sol: ["A couple has zero resultant force but a moment F × d (d = perpendicular distance between the forces), so it only rotates the body.", "बलयुग्म का परिणामी बल शून्य होता है पर आघूर्ण F × d होता है (d = बलों के बीच लंबवत दूरी), अतः वह वस्तु को केवल घुमाता है।"],
  },
  {
    q: ["What is the SI unit of the moment of a force?", "बल आघूर्ण का SI मात्रक क्या है?"],
    g: ["\\tau = F d", "\\tau = F d"],
    ok: ["newton metre (N m)", "न्यूटन मीटर (N m)"],
    wrong: [
      [["newton per metre (N/m)", "न्यूटन प्रति मीटर (N/m)"], ["Moment is force multiplied by distance, not divided by it.", "आघूर्ण बल और दूरी का गुणनफल है, भागफल नहीं।"]],
      [["joule (J), because it is the same as work", "जूल (J), क्योंकि यह कार्य के समान है"], ["N m and J have the same base units, but the moment of a force is not work, so it is written in N m.", "N m और J के मूल मात्रक समान हैं, पर बल आघूर्ण कार्य नहीं है, अतः इसे N m में लिखते हैं।"]],
      [["newton (N)", "न्यूटन (N)"], ["Newton is the unit of force; moment also includes the distance.", "न्यूटन बल का मात्रक है; आघूर्ण में दूरी भी शामिल है।"]],
    ],
    sol: ["Moment = force (N) × perpendicular distance (m), so its unit is N m.", "आघूर्ण = बल (N) × लंबवत दूरी (m), अतः मात्रक N m है।"],
  },
];

const exiMoments = {
  id: "exi-fiz-moments",
  topics: [T("moments-and-equilibrium")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const vr = r.int(0, 3);
    if (level === 1) {
      if (vr === 0) {
        const F = r.pick([5, 8, 10, 12, 15, 20, 25, 40]);
        const dcm = r.pick([20, 25, 30, 40, 50, 60, 75, 80]);
        const M = (F * dcm) / 100;
        const ctx = r.int(0, 2);
        const what = [["pushes a door", "दरवाज़े को धकेलता"], ["pulls a spanner", "स्पैनर को खींचता"], ["pushes the handle of a hand pump", "हैंडपंप के हत्थे को दबाता"]][ctx];
        const piv = [["the hinges", "कब्ज़ों"], ["the nut", "नट"], ["the pivot", "धुरी"]][ctx];
        return task({
          text: L(`${who} ${what[0]} with a force of ${F} N at right angles, ${dcm} cm from ${piv[0]}. Find the moment of the force about ${piv[0]}, in N m.`, `${who} ${piv[1]} से ${dcm} cm दूर, लंबवत ${F} N का बल लगाकर ${what[1].replace("ता", ni % 2 ? "ती" : "ता")} है। ${piv[1]} के परितः बल का आघूर्ण N m में ज्ञात कीजिए।`),
          answer: numM(M, 2, [[F * dcm, L("Convert cm to m before multiplying.", "गुणा करने से पहले cm को m में बदलिए।")], [F / (dcm / 100), L("Moment is force × distance, not force ÷ distance.", "आघूर्ण = बल × दूरी, बल ÷ दूरी नहीं।")]]),
          data: { given: [q("F", F, "N"), q("d", dcm, "cm")], find: ["\\tau"] },
          hint: L("Use the perpendicular distance in metres.", "लंबवत दूरी मीटर में लीजिए।"),
          formula: "\\tau = F \\cdot d",
          solution: L(`$d = ${dcm}$ cm $= ${en(dcm / 100)}$ m\n$\\tau = ${F} \\cdot ${en(dcm / 100)} = ${en(M)}$ N m`, `$d = ${dcm}$ cm $= ${en(dcm / 100)}$ m\n$\\tau = ${F} \\cdot ${en(dcm / 100)} = ${en(M)}$ N m`),
        });
      }
      if (vr === 1) {
        const F = r.pick([10, 15, 20, 25, 30, 40]);
        const D = r.pick([30, 35, 40, 42, 45, 50]);
        const M = (F * D) / 100;
        return task({
          text: L(`A driver turns a steering wheel of diameter ${D} cm by applying two equal and opposite forces of ${F} N each, tangentially at opposite ends of a diameter. Find the moment of the couple, in N m.`, `एक चालक ${D} cm व्यास वाले स्टीयरिंग व्हील पर एक व्यास के विपरीत सिरों पर स्पर्शरेखीय दिशा में ${F} N के दो बराबर और विपरीत बल लगाता है। बलयुग्म का आघूर्ण N m में ज्ञात कीजिए।`),
          answer: numM(M, 2, [[M / 2, L("The arm of a couple is the distance between the two forces: the whole diameter.", "बलयुग्म की भुजा दोनों बलों के बीच की दूरी है: पूरा व्यास।")], [F * D, L("Convert cm to m.", "cm को m में बदलिए।")], [0, L("The forces cancel, but their moments add up.", "बल निरस्त होते हैं, पर उनके आघूर्ण जुड़ जाते हैं।")]]),
          data: { given: [q("F", F, "N"), q("d", D, "cm")], find: ["\\tau"] },
          hint: L("Moment of a couple = one force × perpendicular distance between the forces.", "बलयुग्म का आघूर्ण = एक बल × बलों के बीच लंबवत दूरी।"),
          formula: "\\tau = F \\cdot d",
          solution: L(`$d = ${D}$ cm $= ${en(D / 100)}$ m\n$\\tau = ${F} \\cdot ${en(D / 100)} = ${en(M)}$ N m`, `$d = ${D}$ cm $= ${en(D / 100)}$ m\n$\\tau = ${F} \\cdot ${en(D / 100)} = ${en(M)}$ N m`),
        });
      }
      if (vr === 2) {
        const tau = r.pick([20, 24, 30, 36, 40, 45, 50, 60]);
        const l = r.pick([20, 25, 30, 40, 50]);
        const F = tau / (l / 100);
        return task({
          text: L(`A nut needs a moment of ${tau} N m to loosen it. ${who} uses a spanner and pulls at right angles ${l} cm from the nut. What least force is needed, in N?${RT(F, 1, lang)}`, `एक नट को ढीला करने के लिए ${tau} N m आघूर्ण चाहिए। ${who} स्पैनर को नट से ${l} cm दूर लंबवत ${ni % 2 ? "खींचती" : "खींचता"} है। कम से कम कितना बल (N में) चाहिए?${RT(F, 1, lang)}`),
          answer: numM(F, 1, [[tau / l, L("Convert the distance to metres.", "दूरी को मीटर में बदलिए।")], [tau * (l / 100), L("F = τ ÷ d, not τ × d.", "F = τ ÷ d, τ × d नहीं।")]]),
          data: { given: [q("\\tau", tau, "N\\,m"), q("d", l, "cm")], find: ["F"] },
          hint: L("Rearrange τ = F d for F, with d in metres.", "τ = F d को F के लिए बदलिए, d मीटर में।"),
          formula: "\\tau = F \\cdot d",
          solution: L(`$d = ${en(l / 100)}$ m\n$F = \\dfrac{\\tau}{d} = \\dfrac{${tau}}{${en(l / 100)}} ${ev(F, 1)}$ N`, `$d = ${en(l / 100)}$ m\n$F = \\dfrac{\\tau}{d} = \\dfrac{${tau}}{${en(l / 100)}} ${ev(F, 1)}$ N`),
        });
      }
      const it = r.pick(MOMENT_FACTS);
      const answer = ch(r, L, it.ok, it.wrong);
      return task({
        text: L(...it.q),
        answer,
        data: { given: [it.g[0].startsWith("\\") ? it.g[0] : tx(L, it.g)], find: [tx(L, ["answer", "उत्तर"])] },
        hint: L("Moment depends on the force and on its perpendicular distance from the axis.", "आघूर्ण बल पर और अक्ष से उसकी लंबवत दूरी पर निर्भर है।"),
        formula: "\\tau = F \\cdot d",
        solution: L(`${it.sol[0]}\nAnswer: ${it.ok[0]}.`, `${it.sol[1]}\nउत्तर: ${it.ok[1]}।`),
      });
    }
    if (level === 2) {
      if (vr === 0 || vr === 1) {
        // Uniform metre rule balanced at the 50 cm mark.
        const a1 = r.pick([10, 15, 20, 25, 30, 35]);
        const W1 = r.pick([20, 30, 40, 50, 60]);
        const W2 = r.pick([25, 40, 50, 60, 75, 80, 100].filter((w) => w !== W1 && (W1 * (50 - a1)) / w <= 48));
        const d2 = (W1 * (50 - a1)) / W2;
        const x = 50 + d2;
        if (vr === 0) {
          return task({
            text: L(`A uniform metre rule balances at its 50 cm mark. A weight of ${W1} gf hangs at the ${a1} cm mark. At which mark must a weight of ${W2} gf hang to balance the rule?${RT(x, 1, lang)}`, `एक एकसमान मीटर पैमाना 50 cm चिह्न पर संतुलित है। ${a1} cm चिह्न पर ${W1} gf का भार लटका है। पैमाने को संतुलित रखने के लिए ${W2} gf का भार किस चिह्न पर लटकाना होगा?${RT(x, 1, lang)}`),
            answer: numM(x, 1, [[d2, L("That is the distance from the pivot; give the mark on the rule.", "यह धुरी से दूरी है; पैमाने का चिह्न बताइए।")], [50 - d2, L("The second weight must be on the other side of the pivot.", "दूसरा भार धुरी के दूसरी ओर होना चाहिए।")], [50 + (W2 * (50 - a1)) / W1, L("Weight × its distance: you swapped the weights.", "भार × उसकी दूरी: आपने भार आपस में बदल दिए।")]]),
            data: { given: [q("W_1", W1, "gf"), q("x_1", a1, "cm"), q("W_2", W2, "gf")], find: ["x_2"] },
            hint: L("The rule's own weight acts at the pivot, so it gives no moment. Measure distances from the 50 cm mark.", "पैमाने का अपना भार धुरी पर लगता है, अतः उसका कोई आघूर्ण नहीं। दूरियाँ 50 cm चिह्न से मापिए।"),
            formula: "W_1 d_1 = W_2 d_2",
            solution: L(
              `$d_1 = 50 - ${a1} = ${50 - a1}$ cm\n$${W1} \\cdot ${50 - a1} = ${W2} \\cdot d_2 \\Rightarrow d_2 ${ev(d2, 2)}$ cm\nMark: $50 + ${fx(d2, 2)} ${ev(x, 1)}$ cm`,
              `$d_1 = 50 - ${a1} = ${50 - a1}$ cm\n$${W1} \\cdot ${50 - a1} = ${W2} \\cdot d_2 \\Rightarrow d_2 ${ev(d2, 2)}$ cm\nचिह्न: $50 + ${fx(d2, 2)} ${ev(x, 1)}$ cm`
            ),
          });
        }
        const b = r.pick([60, 65, 70, 75, 80, 90].filter((v) => v !== x));
        const W = (W1 * (50 - a1)) / (b - 50);
        return task({
          text: L(`A uniform metre rule is pivoted at its 50 cm mark. ${who} hangs ${W1} gf at the ${a1} cm mark. What weight at the ${b} cm mark balances the rule, in gf?${RT(W, 1, lang)}`, `एक एकसमान मीटर पैमाना 50 cm चिह्न पर धुरी पर टिका है। ${who} ${a1} cm चिह्न पर ${W1} gf ${ni % 2 ? "लटकाती" : "लटकाता"} है। ${b} cm चिह्न पर कितना भार (gf में) पैमाने को संतुलित करेगा?${RT(W, 1, lang)}`),
          answer: numM(W, 1, [[(W1 * a1) / b, L("Measure the distances from the pivot (50 cm mark), not from the zero end.", "दूरियाँ धुरी (50 cm चिह्न) से मापिए, शून्य सिरे से नहीं।")], [(W1 * (b - 50)) / (50 - a1), L("Weight × its own distance: you swapped the distances.", "भार × उसकी अपनी दूरी: आपने दूरियाँ बदल दीं।")]]),
          data: { given: [q("W_1", W1, "gf"), q("x_1", a1, "cm"), q("x_2", b, "cm")], find: ["W_2"] },
          hint: L("Anticlockwise moment = clockwise moment, with distances from the pivot.", "वामावर्त आघूर्ण = दक्षिणावर्त आघूर्ण, दूरियाँ धुरी से।"),
          formula: "W_1 d_1 = W_2 d_2",
          solution: L(
            `$d_1 = ${50 - a1}$ cm, $d_2 = ${b} - 50 = ${b - 50}$ cm\n$${W1} \\cdot ${50 - a1} = W_2 \\cdot ${b - 50}$\n$W_2 ${ev(W, 1)}$ gf`,
            `$d_1 = ${50 - a1}$ cm, $d_2 = ${b} - 50 = ${b - 50}$ cm\n$${W1} \\cdot ${50 - a1} = W_2 \\cdot ${b - 50}$\n$W_2 ${ev(W, 1)}$ gf`
          ),
        });
      }
      if (vr === 2) {
        const F = r.pick([10, 12, 15, 20, 25, 30]);
        const d = r.pick([0.4, 0.5, 0.6, 0.8, 1.0, 1.2]);
        const th = r.pick([30, 60, 90, 150]);
        const s = { 30: 0.5, 60: Math.sqrt(3) / 2, 90: 1, 150: 0.5 }[th];
        const M = F * d * s;
        const c = Math.cos((th * Math.PI) / 180);
        return task({
          text: L(`A force of ${F} N is applied at the free end of a ${en(d)} m long rod hinged at the other end. The force makes an angle of ${th}° with the rod. Find the moment about the hinge, in N m.${RT(M, 2, lang)}`, `एक सिरे पर कब्ज़े से जुड़ी ${en(d)} m लंबी छड़ के मुक्त सिरे पर ${F} N का बल लगाया जाता है। बल छड़ से ${th}° का कोण बनाता है। कब्ज़े के परितः आघूर्ण N m में ज्ञात कीजिए।${RT(M, 2, lang)}`),
          answer: numM(M, 2, th === 90 ? [[F / d, L("Moment is force × distance, not force ÷ distance.", "आघूर्ण = बल × दूरी, बल ÷ दूरी नहीं।")]] : [[F * d, L("Only the perpendicular distance counts: $d \\sin\\theta$.", "केवल लंबवत दूरी गिनी जाती है: $d \\sin\\theta$।")], [Math.abs(F * d * c), L("The perpendicular distance uses sin θ, not cos θ (θ is measured from the rod).", "लंबवत दूरी में sin θ लगता है, cos θ नहीं (θ छड़ से मापा गया है)।")]]),
          data: { given: [q("F", F, "N"), q("d", d, "m"), q("\\theta", `${th}^\\circ`)], find: ["\\tau"] },
          hint: L("Find the perpendicular distance from the hinge to the line of action of the force.", "कब्ज़े से बल की क्रिया-रेखा तक की लंबवत दूरी ज्ञात कीजिए।"),
          formula: "\\tau = F d \\sin\\theta",
          solution: L(
            `Perpendicular distance: $d \\sin ${th}^\\circ ${ev(d * s, 3)}$ m\n$\\tau = ${F} \\cdot ${fx(d * s, 3)} ${ev(M, 2)}$ N m`,
            `लंबवत दूरी: $d \\sin ${th}^\\circ ${ev(d * s, 3)}$ m\n$\\tau = ${F} \\cdot ${fx(d * s, 3)} ${ev(M, 2)}$ N m`
          ),
        });
      }
      // vr 3: dve sili na obeh straneh – neto moment
      const a = r.pick([10, 20, 30, 40]);
      const b = r.pick([60, 70, 80, 90]);
      const W1 = r.pick([20, 30, 40, 50]);
      const W2 = r.pick([10, 20, 30, 40, 50]);
      const anti = W1 * (50 - a);
      const clock = W2 * (b - 50);
      const net = Math.abs(anti - clock);
      return task({
        text: L(`A uniform metre rule is pivoted at its 50 cm mark. ${W1} gf hangs at the ${a} cm mark and ${W2} gf at the ${b} cm mark. Find the magnitude of the resultant moment about the pivot, in gf cm.`, `एक एकसमान मीटर पैमाना 50 cm चिह्न पर धुरी पर टिका है। ${a} cm चिह्न पर ${W1} gf और ${b} cm चिह्न पर ${W2} gf लटका है। धुरी के परितः परिणामी आघूर्ण का परिमाण gf cm में ज्ञात कीजिए।`),
        answer: numM(net, 0, [[anti + clock, L("The two moments act in opposite senses; subtract them.", "दोनों आघूर्ण विपरीत दिशाओं में हैं; उन्हें घटाइए।")], [Math.abs(W1 * a - W2 * b), L("Measure distances from the pivot at 50 cm, not from the zero mark.", "दूरियाँ 50 cm की धुरी से मापिए, शून्य चिह्न से नहीं।")]]),
        data: { given: [q("W_1", W1, "gf"), q("x_1", a, "cm"), q("W_2", W2, "gf"), q("x_2", b, "cm")], find: ["\\tau_{net}"] },
        hint: L("One weight turns the rule anticlockwise, the other clockwise.", "एक भार पैमाने को वामावर्त घुमाता है, दूसरा दक्षिणावर्त।"),
        formula: "\\tau_{net} = |W_1 d_1 - W_2 d_2|",
        solution: L(
          `Anticlockwise: $${W1} \\cdot ${50 - a} = ${anti}$ gf cm\nClockwise: $${W2} \\cdot ${b - 50} = ${clock}$ gf cm\n$\\tau_{net} = ${net}$ gf cm${net === 0 ? " (the rule is balanced)" : anti > clock ? " (anticlockwise)" : " (clockwise)"}`,
          `वामावर्त: $${W1} \\cdot ${50 - a} = ${anti}$ gf cm\nदक्षिणावर्त: $${W2} \\cdot ${b - 50} = ${clock}$ gf cm\n$\\tau_{net} = ${net}$ gf cm${net === 0 ? " (पैमाना संतुलित है)" : anti > clock ? " (वामावर्त)" : " (दक्षिणावर्त)"}`
        ),
      });
    }
    // level 3
    if (vr === 0) {
      // masa ravnila iz ravnovesja izven sredine
      const x0 = r.pick([30, 35, 40, 42, 45]);
      const a = r.pick([0, 5, 10, 15, 20].filter((v) => v < x0 - 5));
      const m = r.pick([20, 25, 40, 50, 60, 100]);
      const M = (m * (x0 - a)) / (50 - x0);
      return task({
        text: L(`A uniform metre rule balances at the ${x0} cm mark when a mass of ${m} g hangs at the ${a} cm mark. Find the mass of the metre rule, in g.${RT(M, 1, lang)}`, `जब ${a} cm चिह्न पर ${m} g का द्रव्यमान लटका हो, तब एक एकसमान मीटर पैमाना ${x0} cm चिह्न पर संतुलित होता है। मीटर पैमाने का द्रव्यमान g में ज्ञात कीजिए।${RT(M, 1, lang)}`),
        answer: numM(M, 1, [[(m * (50 - x0)) / (x0 - a), L("Each weight is multiplied by its own distance from the pivot; you swapped them.", "हर भार को धुरी से उसकी अपनी दूरी से गुणा कीजिए; आपने दूरियाँ बदल दीं।")], [(m * x0) / 50, L("The rule's weight acts at the 50 cm mark; measure both distances from the pivot.", "पैमाने का भार 50 cm चिह्न पर लगता है; दोनों दूरियाँ धुरी से मापिए।")]]),
        data: { given: [q("x_0", x0, "cm"), q("m", m, "g"), q("x", a, "cm")], find: ["M"] },
        hint: L("The weight of a uniform rule acts at its centre of gravity, the 50 cm mark.", "एकसमान पैमाने का भार उसके गुरुत्व केंद्र, 50 cm चिह्न, पर लगता है।"),
        formula: "m\\,(x_0 - x) = M\\,(50 - x_0)",
        solution: L(
          `Distance of ${m} g from pivot: $${x0} - ${a} = ${x0 - a}$ cm\nDistance of the rule's CG: $50 - ${x0} = ${50 - x0}$ cm\n$${m} \\cdot ${x0 - a} = M \\cdot ${50 - x0}$\n$M ${ev(M, 1)}$ g`,
          `धुरी से ${m} g की दूरी: $${x0} - ${a} = ${x0 - a}$ cm\nपैमाने के गुरुत्व केंद्र की दूरी: $50 - ${x0} = ${50 - x0}$ cm\n$${m} \\cdot ${x0 - a} = M \\cdot ${50 - x0}$\n$M ${ev(M, 1)}$ g`
        ),
      });
    }
    if (vr === 1) {
      // deska na dveh podporah
      const len = r.pick([2, 3, 4, 5, 6]);
      const Mp = r.pick([10, 20, 30, 40]);
      const mp = r.pick([30, 40, 45, 50, 60]);
      const x = r.pick([0.5, 1, 1.5, 2].filter((v) => v < len));
      const g = 10;
      const RB = (Mp * g * len / 2 + mp * g * x) / len;
      const RA = (Mp + mp) * g - RB;
      const askA = r.int(0, 1) === 1;
      const val = askA ? RA : RB;
      return task({
        text: L(`A uniform plank ${len} m long and of mass ${Mp} kg rests on supports at its ends A and B. ${who} (mass ${mp} kg) stands ${en(x)} m from A. Find the force exerted by support ${askA ? "A" : "B"}, in N (g = 10 m/s²).${RT(val, 1, lang)}`, `${len} m लंबा और ${Mp} kg द्रव्यमान का एकसमान तख्ता अपने सिरों A और B पर टेकों पर टिका है। ${who} (द्रव्यमान ${mp} kg) A से ${en(x)} m पर ${ni % 2 ? "खड़ी" : "खड़ा"} है। टेक ${askA ? "A" : "B"} द्वारा लगाया गया बल N में ज्ञात कीजिए (g = 10 m/s²)।${RT(val, 1, lang)}`),
        answer: numM(val, 1, [[askA ? (mp * g * (len - x)) / len : (mp * g * x) / len, L("Include the plank's own weight, acting at its middle.", "तख्ते का अपना भार भी लीजिए, जो उसके मध्य पर लगता है।")], [((Mp + mp) * g) / 2, L("The supports share the load equally only when it is symmetric.", "टेक भार को बराबर तभी बाँटते हैं जब वह सममित हो।")], [askA ? RB : RA, L("You found the force at the other support.", "आपने दूसरे टेक का बल निकाल दिया।")]]),
        data: { given: [q("\\ell", len, "m"), q("M", Mp, "kg"), q("m", mp, "kg"), q("x", x, "m"), q("g", 10, "m/s^2")], find: [askA ? "R_A" : "R_B"] },
        hint: L(askA ? "Take moments about B so that the unknown force at B drops out." : "Take moments about A so that the unknown force at A drops out.", askA ? "B के परितः आघूर्ण लीजिए ताकि B का अज्ञात बल हट जाए।" : "A के परितः आघूर्ण लीजिए ताकि A का अज्ञात बल हट जाए।"),
        formula: ["\\sum \\tau_A = 0", "R_A + R_B = (M + m) g"],
        solution: L(
          `Weights: plank $${Mp * g}$ N at $${en(len / 2)}$ m, person $${mp * g}$ N at $${en(x)}$ m from A\nMoments about A: $R_B \\cdot ${len} = ${Mp * g} \\cdot ${en(len / 2)} + ${mp * g} \\cdot ${en(x)}$ → $R_B ${ev(RB, 1)}$ N\n${askA ? `$R_A = ${(Mp + mp) * g} - ${fx(RB, 2)} ${ev(RA, 1)}$ N` : `$R_B ${ev(RB, 1)}$ N`}`,
          `भार: तख्ता $${Mp * g}$ N, A से $${en(len / 2)}$ m पर; व्यक्ति $${mp * g}$ N, A से $${en(x)}$ m पर\nA के परितः आघूर्ण: $R_B \\cdot ${len} = ${Mp * g} \\cdot ${en(len / 2)} + ${mp * g} \\cdot ${en(x)}$ → $R_B ${ev(RB, 1)}$ N\n${askA ? `$R_A = ${(Mp + mp) * g} - ${fx(RB, 2)} ${ev(RA, 1)}$ N` : `$R_B ${ev(RB, 1)}$ N`}`
        ),
      });
    }
    if (vr === 2) {
      // ravnotežna točka ravnila z utežjo na koncu
      const M = r.pick([50, 60, 80, 100, 120, 150]);
      const m = r.pick([20, 25, 30, 40, 50, 60].filter((v) => v !== M));
      const x = (50 * M) / (M + m);
      return task({
        text: L(`A uniform metre rule of mass ${M} g has a ${m} g mass attached at its 0 cm mark. At which mark will the rule balance on a knife edge?${RT(x, 1, lang)}`, `${M} g द्रव्यमान वाले एकसमान मीटर पैमाने के 0 cm चिह्न पर ${m} g का द्रव्यमान बँधा है। पैमाना किस चिह्न पर चाकू की धार पर संतुलित होगा?${RT(x, 1, lang)}`),
        answer: numM(x, 1, [[(50 * m) / (M + m), L("Each mass is multiplied by its own distance from the knife edge; check which side is which.", "हर द्रव्यमान को धार से उसकी अपनी दूरी से गुणा कीजिए; जाँचिए कि कौन किस ओर है।")], [50, L("The extra mass shifts the balance point towards it.", "अतिरिक्त द्रव्यमान संतुलन बिंदु को अपनी ओर खिसका देता है।")], [(50 * M) / m > 100 ? 50 - m / 2 : (50 * M) / m, L("Write the moment equation about the knife edge: $m x = M (50 - x)$.", "धार के परितः आघूर्ण समीकरण लिखिए: $m x = M (50 - x)$।")]]),
        data: { given: [q("M", M, "g"), q("m", m, "g")], find: ["x"] },
        hint: L("Let the knife edge be at x cm; the extra mass is x cm away on one side, the rule's CG (50 − x) cm on the other.", "मान लीजिए धार x cm पर है; अतिरिक्त द्रव्यमान एक ओर x cm दूर है, पैमाने का गुरुत्व केंद्र दूसरी ओर (50 − x) cm दूर।"),
        formula: "m x = M (50 - x)",
        solution: L(
          `$${m} x = ${M} (50 - x)$\n$${m + M} x = ${50 * M}$\n$x ${ev(x, 1)}$ cm`,
          `$${m} x = ${M} (50 - x)$\n$${m + M} x = ${50 * M}$\n$x ${ev(x, 1)}$ cm`
        ),
      });
    }
    // vr 3: tri uteži, poišči lego tretje
    const cands = [];
    for (const a0 of [10, 20, 30]) for (const W10 of [20, 40, 50]) for (const b0 of [60, 70, 80]) for (const W20 of [10, 20, 30, 50]) for (const W30 of [20, 25, 40, 50]) {
      const nd = W10 * (50 - a0) - W20 * (b0 - 50);
      if (nd !== 0 && Math.abs(nd) / W30 <= 45 && Math.abs(nd) / W30 >= 3) cands.push([a0, W10, b0, W20, W30]);
    }
    const [a, W1, b, W2, W3] = r.pick(cands);
    const need = W1 * (50 - a) - W2 * (b - 50);
    const d3 = Math.abs(need) / W3;
    const x3 = need >= 0 ? 50 + d3 : 50 - d3;
    return task({
      text: L(`A uniform metre rule is pivoted at 50 cm. It carries ${W1} gf at the ${a} cm mark and ${W2} gf at the ${b} cm mark. At which mark must ${W3} gf be hung to balance it?${RT(x3, 1, lang)}`, `एक एकसमान मीटर पैमाना 50 cm पर धुरी पर टिका है। उस पर ${a} cm चिह्न पर ${W1} gf और ${b} cm चिह्न पर ${W2} gf लटके हैं। संतुलन के लिए ${W3} gf किस चिह्न पर लटकाना होगा?${RT(x3, 1, lang)}`),
      answer: numM(x3, 1, [[need >= 0 ? 50 - d3 : 50 + d3, L("Check the side: the third weight must oppose the larger moment.", "पक्ष जाँचिए: तीसरा भार बड़े आघूर्ण का विरोध करना चाहिए।")], [50 + (W1 * (50 - a) + W2 * (b - 50)) / W3, L("The two given moments act in opposite senses; subtract them.", "दिए गए दोनों आघूर्ण विपरीत दिशाओं में हैं; उन्हें घटाइए।")], [d3, L("That is the distance from the pivot; give the mark.", "यह धुरी से दूरी है; चिह्न बताइए।")]]),
      data: { given: [q("W_1", W1, "gf"), q("x_1", a, "cm"), q("W_2", W2, "gf"), q("x_2", b, "cm"), q("W_3", W3, "gf")], find: ["x_3"] },
      hint: L("Find the net moment of the two given weights first, then see on which side the third must go.", "पहले दिए गए दो भारों का परिणामी आघूर्ण निकालिए, फिर देखिए कि तीसरा भार किस ओर जाएगा।"),
      formula: "\\sum \\tau_{\\circlearrowleft} = \\sum \\tau_{\\circlearrowright}",
      solution: L(
        `Anticlockwise: $${W1} \\cdot ${50 - a} = ${W1 * (50 - a)}$ gf cm; clockwise: $${W2} \\cdot ${b - 50} = ${W2 * (b - 50)}$ gf cm\nThe ${W3} gf must give $${Math.abs(need)}$ gf cm ${need >= 0 ? "clockwise (right of the pivot)" : "anticlockwise (left of the pivot)"}\n$d_3 = \\dfrac{${Math.abs(need)}}{${W3}} ${ev(d3, 2)}$ cm → mark $${fx(x3, 1)}$ cm`,
        `वामावर्त: $${W1} \\cdot ${50 - a} = ${W1 * (50 - a)}$ gf cm; दक्षिणावर्त: $${W2} \\cdot ${b - 50} = ${W2 * (b - 50)}$ gf cm\n${W3} gf को $${Math.abs(need)}$ gf cm ${need >= 0 ? "दक्षिणावर्त (धुरी के दाईं ओर)" : "वामावर्त (धुरी के बाईं ओर)"} आघूर्ण देना है\n$d_3 = \\dfrac{${Math.abs(need)}}{${W3}} ${ev(d3, 2)}$ cm → चिह्न $${fx(x3, 1)}$ cm`
      ),
    });
  },
};

// ---------- 5. Calorimetry (ICSE/NCERT; c(water) = 4.2 J g⁻¹ °C⁻¹, L(ice) = 336 J g⁻¹, L(steam) = 2260 J g⁻¹) ----------
const CW = 4.2;
const LF = 336;
const LV = 2260;
const METALS = [
  ["copper", "ताँबा", 0.4],
  ["aluminium", "ऐलुमिनियम", 0.9],
  ["iron", "लोहा", 0.45],
  ["brass", "पीतल", 0.38],
  ["lead", "सीसा", 0.13],
];
// Hindijski tvorilnik (ताँबा → ताँबे के, लोहा → लोहे की).
const oblHi = (s) => s.replace(/ा$/, "े");
const CALOR_FACTS = [
  {
    q: ["Why does a burn from steam at 100 °C hurt more than one from boiling water at 100 °C?", "100 °C की भाप से जलना 100 °C के उबलते पानी से जलने की तुलना में अधिक कष्टदायक क्यों होता है?"],
    g: ["L_v", "L_v"],
    ok: ["Steam gives out its latent heat of vaporisation (2260 J per g) as it condenses on the skin", "भाप त्वचा पर संघनित होते समय वाष्पन की गुप्त ऊष्मा (2260 J प्रति g) छोड़ती है"],
    wrong: [
      [["Steam is at a higher temperature than boiling water", "भाप का ताप उबलते पानी से अधिक होता है"], ["Both are at 100 °C here; the difference is the latent heat.", "यहाँ दोनों 100 °C पर हैं; अंतर गुप्त ऊष्मा का है।"]],
      [["Steam has a higher specific heat capacity than water", "भाप की विशिष्ट ऊष्मा धारिता पानी से अधिक है"], ["Water actually has the larger specific heat capacity; the extra heat is latent heat.", "वास्तव में पानी की विशिष्ट ऊष्मा धारिता अधिक है; अतिरिक्त ऊष्मा गुप्त ऊष्मा है।"]],
      [["Steam moves faster and so hits the skin harder", "भाप तेज़ चलती है इसलिए त्वचा से ज़ोर से टकराती है"], ["Burns are caused by heat given to the skin, not by the force of impact.", "जलन त्वचा को मिली ऊष्मा से होती है, टक्कर के बल से नहीं।"]],
    ],
    sol: ["Each gram of steam first releases 2260 J while condensing and then more heat while cooling as water.", "भाप का प्रत्येक ग्राम पहले संघनित होते समय 2260 J और फिर पानी के रूप में ठंडा होते समय और ऊष्मा देता है।"],
  },
  {
    q: ["Why does ice at 0 °C cool a drink better than the same mass of water at 0 °C?", "0 °C की बर्फ़ किसी पेय को उतने ही द्रव्यमान के 0 °C के पानी से अधिक ठंडा क्यों करती है?"],
    g: ["L_f", "L_f"],
    ok: ["Ice absorbs 336 J per g of latent heat while melting, before it starts to warm up", "गर्म होने से पहले बर्फ़ पिघलते समय 336 J प्रति g गुप्त ऊष्मा अवशोषित करती है"],
    wrong: [
      [["Ice is at a lower temperature than water at 0 °C", "बर्फ़ का ताप 0 °C के पानी से कम होता है"], ["Both are at 0 °C; the difference is the heat absorbed in melting.", "दोनों 0 °C पर हैं; अंतर पिघलने में अवशोषित ऊष्मा का है।"]],
      [["Ice has a higher specific heat capacity than water", "बर्फ़ की विशिष्ट ऊष्मा धारिता पानी से अधिक है"], ["Ice has a lower specific heat capacity than water; the reason is latent heat.", "बर्फ़ की विशिष्ट ऊष्मा धारिता पानी से कम है; कारण गुप्त ऊष्मा है।"]],
      [["Ice gives out cold to the drink", "बर्फ़ पेय को ठंडक देती है"], ["Cold is not a quantity that flows; heat flows from the drink into the ice.", "ठंडक कोई बहने वाली राशि नहीं है; ऊष्मा पेय से बर्फ़ में जाती है।"]],
    ],
    sol: ["Melting needs latent heat: every gram of ice takes 336 J from the drink without its own temperature rising.", "पिघलने के लिए गुप्त ऊष्मा चाहिए: बर्फ़ का प्रत्येक ग्राम अपना ताप बढ़ाए बिना पेय से 336 J लेता है।"],
  },
  {
    q: ["Farmers flood their fields with water on a frosty night. Why does this protect the crops?", "पाले वाली रात में किसान खेतों में पानी भर देते हैं। इससे फसल की रक्षा क्यों होती है?"],
    g: ["c_{water}", "c_{water}"],
    ok: ["Water has a high specific heat capacity, so it gives out a lot of heat as it cools and the soil stays warmer", "पानी की विशिष्ट ऊष्मा धारिता अधिक है, इसलिए ठंडा होते समय वह बहुत ऊष्मा देता है और मिट्टी गर्म रहती है"],
    wrong: [
      [["Water has a low specific heat capacity, so it warms the soil quickly", "पानी की विशिष्ट ऊष्मा धारिता कम है, इसलिए वह मिट्टी को जल्दी गर्म करता है"], ["Water's specific heat capacity is high, not low.", "पानी की विशिष्ट ऊष्मा धारिता अधिक है, कम नहीं।"]],
      [["Water stops the air from touching the plants", "पानी हवा को पौधों तक पहुँचने से रोकता है"], ["The protection comes from the heat given out by the water, not from blocking air.", "रक्षा पानी द्वारा दी गई ऊष्मा से होती है, हवा रोकने से नहीं।"]],
      [["Water freezes and the ice keeps the plants cold", "पानी जम जाता है और बर्फ़ पौधों को ठंडा रखती है"], ["Keeping the plants cold is the opposite of protecting them from frost.", "पौधों को ठंडा रखना पाले से रक्षा का उल्टा है।"]],
    ],
    sol: ["$Q = mc\\Delta T$: with a large c, each degree of cooling releases a lot of heat to the surroundings.", "$Q = mc\\Delta T$: c अधिक होने से ताप के हर डिग्री गिरने पर आसपास को बहुत ऊष्मा मिलती है।"],
  },
  {
    q: ["While ice is melting at 0 °C, its temperature does not rise although heat is supplied. Where does the heat go?", "0 °C पर पिघलती बर्फ़ को ऊष्मा देने पर भी उसका ताप नहीं बढ़ता। ऊष्मा कहाँ जाती है?"],
    g: ["\\Delta T = 0", "\\Delta T = 0"],
    ok: ["It is used as latent heat to change the state from solid to liquid", "यह गुप्त ऊष्मा के रूप में ठोस से द्रव में अवस्था बदलने में लगती है"],
    wrong: [
      [["It is lost to the surroundings", "यह परिवेश में नष्ट हो जाती है"], ["Even with perfect insulation the temperature stays at 0 °C until all the ice melts.", "पूर्ण ऊष्मारोधन में भी सारी बर्फ़ पिघलने तक ताप 0 °C ही रहता है।"]],
      [["It raises the specific heat capacity of the ice", "यह बर्फ़ की विशिष्ट ऊष्मा धारिता बढ़ाती है"], ["Specific heat capacity is a property of the material; heat does not increase it.", "विशिष्ट ऊष्मा धारिता पदार्थ का गुण है; ऊष्मा उसे नहीं बढ़ाती।"]],
      [["It increases the kinetic energy of the molecules, but the thermometer cannot show it", "यह अणुओं की गतिज ऊर्जा बढ़ाती है, पर तापमापी उसे नहीं दिखा पाता"], ["If the average kinetic energy rose, the temperature would rise; here the heat changes the state.", "औसत गतिज ऊर्जा बढ़ती तो ताप बढ़ता; यहाँ ऊष्मा अवस्था बदलती है।"]],
    ],
    sol: ["During a change of state the heat supplied is latent heat ($Q = mL$); the temperature stays constant.", "अवस्था परिवर्तन के समय दी गई ऊष्मा गुप्त ऊष्मा होती है ($Q = mL$); ताप स्थिर रहता है।"],
  },
];
const CONST_W = ["Take $c = 4.2$ J g⁻¹ °C⁻¹ for water.", "पानी के लिए $c = 4.2$ J g⁻¹ °C⁻¹ लीजिए।"];

const exiCalorimetry = {
  id: "exi-fiz-calorimetry",
  topics: [T("calorimetry")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const vr = r.int(0, 4);
    if (level === 1) {
      if (vr === 0) {
        const m = r.pick([50, 100, 150, 200, 250, 500]);
        const T1 = r.pick([15, 20, 25, 30]);
        const T2 = r.pick([40, 50, 60, 70, 80, 90]);
        const Q = m * CW * (T2 - T1);
        return task({
          text: L(`How much heat is needed to warm ${m} g of water from ${T1} °C to ${T2} °C, in J? ${CONST_W[0]}`, `${m} g पानी को ${T1} °C से ${T2} °C तक गर्म करने के लिए कितनी ऊष्मा (J में) चाहिए? ${CONST_W[1]}`),
          answer: numM(Q, 0, [[m * CW * T2, L("Use the temperature change ΔT, not the final temperature.", "अंतिम ताप नहीं, ताप परिवर्तन ΔT लीजिए।")], [m * (T2 - T1), L("Multiply by the specific heat capacity too.", "विशिष्ट ऊष्मा धारिता से भी गुणा कीजिए।")]]),
          data: { given: [q("m", m, "g"), q("c", 4.2, "J\\,g^{-1}\\,{}^\\circ C^{-1}"), q("\\Delta T", `${T2} - ${T1}`, "{}^\\circ C")], find: ["Q"] },
          hint: L("Find the rise in temperature first.", "पहले ताप में वृद्धि ज्ञात कीजिए।"),
          formula: "Q = m c \\Delta T",
          solution: L(`$\\Delta T = ${T2} - ${T1} = ${T2 - T1}$ °C\n$Q = ${m} \\cdot 4.2 \\cdot ${T2 - T1} = ${en(Q)}$ J`, `$\\Delta T = ${T2} - ${T1} = ${T2 - T1}$ °C\n$Q = ${m} \\cdot 4.2 \\cdot ${T2 - T1} = ${en(Q)}$ J`),
        });
      }
      if (vr === 1) {
        const k = r.int(0, METALS.length - 1);
        const [mEn, mHi, c] = METALS[k];
        const m = r.pick([100, 200, 250, 400, 500, 1000]);
        const C = m * c;
        return task({
          text: L(`Find the heat capacity of a ${m} g ${mEn} block, in J °C⁻¹. (Specific heat capacity of ${mEn}: ${en(c)} J g⁻¹ °C⁻¹)`, `${m} g के ${oblHi(mHi)} के गुटके की ऊष्मा धारिता J °C⁻¹ में ज्ञात कीजिए। (${oblHi(mHi)} की विशिष्ट ऊष्मा धारिता: ${en(c)} J g⁻¹ °C⁻¹)`),
          answer: numM(C, 1, [[m / c, L("Heat capacity = mass × specific heat capacity.", "ऊष्मा धारिता = द्रव्यमान × विशिष्ट ऊष्मा धारिता।")], [c, L("That is per gram; the heat capacity is for the whole block.", "यह प्रति ग्राम है; ऊष्मा धारिता पूरे गुटके की होती है।")]]),
          data: { given: [q("m", m, "g"), q("c", c, "J\\,g^{-1}\\,{}^\\circ C^{-1}")], find: ["C"] },
          hint: L("Heat capacity is the heat needed to raise the whole body by 1 °C.", "ऊष्मा धारिता पूरी वस्तु का ताप 1 °C बढ़ाने के लिए आवश्यक ऊष्मा है।"),
          formula: "C = m c",
          solution: L(`$C = m c = ${m} \\cdot ${en(c)}$\n$C = ${en(C)}$ J °C⁻¹`, `$C = m c = ${m} \\cdot ${en(c)}$\n$C = ${en(C)}$ J °C⁻¹`),
        });
      }
      if (vr === 2) {
        const m = r.pick([10, 20, 25, 50, 80, 100, 150]);
        const steam = r.int(0, 1) === 1;
        const Lh = steam ? LV : LF;
        const Q = m * Lh;
        return task({
          text: steam
            ? L(`How much heat is needed to change ${m} g of water at 100 °C into steam at 100 °C, in J? (Latent heat of vaporisation of water = 2260 J g⁻¹)`, `100 °C के ${m} g पानी को 100 °C की भाप में बदलने के लिए कितनी ऊष्मा (J में) चाहिए? (पानी के वाष्पन की गुप्त ऊष्मा = 2260 J g⁻¹)`)
            : L(`How much heat is needed to melt ${m} g of ice at 0 °C into water at 0 °C, in J? (Latent heat of fusion of ice = 336 J g⁻¹)`, `0 °C की ${m} g बर्फ़ को 0 °C के पानी में पिघलाने के लिए कितनी ऊष्मा (J में) चाहिए? (बर्फ़ के गलन की गुप्त ऊष्मा = 336 J g⁻¹)`),
          answer: numM(Q, 0, [[m * CW * (steam ? 100 : 1), L("A change of state happens at constant temperature: use $Q = mL$.", "अवस्था परिवर्तन स्थिर ताप पर होता है: $Q = mL$ लीजिए।")], [Lh / m, L("Multiply the mass by the latent heat.", "द्रव्यमान को गुप्त ऊष्मा से गुणा कीजिए।")]]),
          data: { given: [q("m", m, "g"), q(steam ? "L_v" : "L_f", Lh, "J\\,g^{-1}")], find: ["Q"] },
          hint: L("The temperature does not change, so only latent heat is needed.", "ताप नहीं बदलता, अतः केवल गुप्त ऊष्मा चाहिए।"),
          formula: "Q = m L",
          solution: L(`$Q = m L = ${m} \\cdot ${Lh}$\n$Q = ${Q}$ J`, `$Q = m L = ${m} \\cdot ${Lh}$\n$Q = ${Q}$ J`),
        });
      }
      if (vr === 3) {
        const k = r.int(0, METALS.length - 1);
        const [mEn, mHi, c] = METALS[k];
        const m = r.pick([100, 200, 250, 500]);
        const dT = r.pick([10, 20, 25, 40, 50]);
        const Q = m * c * dT;
        return task({
          text: L(`${who} supplies ${en(Q)} J of heat to a ${m} g metal block and its temperature rises by ${dT} °C. Find the specific heat capacity of the metal, in J g⁻¹ °C⁻¹.`, `${who} ${m} g के धातु के गुटके को ${en(Q)} J ऊष्मा ${ni % 2 ? "देती" : "देता"} है और उसका ताप ${dT} °C बढ़ जाता है। धातु की विशिष्ट ऊष्मा धारिता J g⁻¹ °C⁻¹ में ज्ञात कीजिए।`),
          answer: numM(c, 2, [[Q / m, L("Divide by the temperature rise as well.", "ताप वृद्धि से भी भाग दीजिए।")], [(m * dT) / Q, L("You inverted the ratio: $c = Q/(m\\Delta T)$.", "आपने अनुपात उल्टा कर दिया: $c = Q/(m\\Delta T)$।")]]),
          data: { given: [q("Q", Q, "J"), q("m", m, "g"), q("\\Delta T", dT, "{}^\\circ C")], find: ["c"] },
          hint: L("Rearrange $Q = mc\\Delta T$ for c.", "$Q = mc\\Delta T$ को c के लिए बदलिए।"),
          formula: "c = \\dfrac{Q}{m \\Delta T}",
          solution: L(`$c = \\dfrac{${en(Q)}}{${m} \\cdot ${dT}} = \\dfrac{${en(Q)}}{${m * dT}}$\n$c = ${en(c)}$ J g⁻¹ °C⁻¹ (${mEn})`, `$c = \\dfrac{${en(Q)}}{${m} \\cdot ${dT}} = \\dfrac{${en(Q)}}{${m * dT}}$\n$c = ${en(c)}$ J g⁻¹ °C⁻¹ (${mHi})`),
        });
      }
      const it = r.pick(CALOR_FACTS);
      const answer = ch(r, L, it.ok, it.wrong);
      return task({
        text: L(...it.q),
        answer,
        data: { given: [it.g[0]], find: [tx(L, ["reason", "कारण"])] },
        hint: L("Ask yourself: is the temperature changing (use c) or the state changing (use latent heat)?", "स्वयं से पूछिए: ताप बदल रहा है (c लीजिए) या अवस्था बदल रही है (गुप्त ऊष्मा लीजिए)?"),
        formula: ["Q = m c \\Delta T", "Q = m L"],
        solution: L(`${it.sol[0]}\nAnswer: ${it.ok[0]}.`, `${it.sol[1]}\nउत्तर: ${it.ok[1]}।`),
      });
    }
    if (level === 2) {
      if (vr === 0) {
        const m1 = r.pick([100, 150, 200, 250, 300]);
        const m2 = r.pick([50, 100, 200, 300, 400].filter((v) => v !== m1));
        const T1 = r.pick([10, 15, 20, 25]);
        const T2 = r.pick([60, 70, 80, 90]);
        const T = (m1 * T1 + m2 * T2) / (m1 + m2);
        return task({
          text: L(`${who} mixes ${m1} g of water at ${T1} °C with ${m2} g of water at ${T2} °C. Assuming no heat is lost, find the final temperature in °C.${RT(T, 1, lang)}`, `${who} ${T1} °C के ${m1} g पानी को ${T2} °C के ${m2} g पानी में ${ni % 2 ? "मिलाती" : "मिलाता"} है। ऊष्मा की कोई हानि न मानकर अंतिम ताप °C में ज्ञात कीजिए।${RT(T, 1, lang)}`),
          answer: numM(T, 1, [[(T1 + T2) / 2, L("A simple average works only for equal masses.", "साधारण औसत केवल समान द्रव्यमानों के लिए सही है।")], [(m2 * T1 + m1 * T2) / (m1 + m2), L("Each mass goes with its own temperature; you swapped them.", "हर द्रव्यमान अपने ही ताप के साथ जाता है; आपने उन्हें बदल दिया।")]]),
          data: { given: [q("m_1", m1, "g"), q("T_1", T1, "{}^\\circ C"), q("m_2", m2, "g"), q("T_2", T2, "{}^\\circ C")], find: ["T"] },
          hint: L("Heat lost by the hot water = heat gained by the cold water.", "गर्म पानी द्वारा दी गई ऊष्मा = ठंडे पानी द्वारा ली गई ऊष्मा।"),
          formula: "m_2 c (T_2 - T) = m_1 c (T - T_1)",
          solution: L(
            `$${m2} (${T2} - T) = ${m1} (T - ${T1})$ (c cancels)\n$${m1 + m2}\\,T = ${m1 * T1} + ${m2 * T2} = ${m1 * T1 + m2 * T2}$\n$T ${ev(T, 1)}$ °C`,
            `$${m2} (${T2} - T) = ${m1} (T - ${T1})$ (c कट जाता है)\n$${m1 + m2}\\,T = ${m1 * T1} + ${m2 * T2} = ${m1 * T1 + m2 * T2}$\n$T ${ev(T, 1)}$ °C`
          ),
        });
      }
      if (vr === 1) {
        const m = r.pick([20, 25, 50, 80, 100, 200]);
        const T = r.pick([10, 20, 25, 30, 40, 50]);
        const Q = m * (LF + CW * T);
        return task({
          text: L(`How much heat is needed to change ${m} g of ice at 0 °C into water at ${T} °C, in J? (L of ice = 336 J g⁻¹, c of water = 4.2 J g⁻¹ °C⁻¹)`, `0 °C की ${m} g बर्फ़ को ${T} °C के पानी में बदलने के लिए कितनी ऊष्मा (J में) चाहिए? (बर्फ़ की गुप्त ऊष्मा = 336 J g⁻¹, पानी की c = 4.2 J g⁻¹ °C⁻¹)`),
          answer: numM(Q, 0, [[m * LF, L("After melting, the water must also be warmed from 0 °C.", "पिघलने के बाद पानी को 0 °C से गर्म भी करना है।")], [m * CW * T, L("First the ice must melt: add $mL$.", "पहले बर्फ़ को पिघलना है: $mL$ जोड़िए।")]]),
          data: { given: [q("m", m, "g"), q("L_f", LF, "J\\,g^{-1}"), q("c", 4.2, "J\\,g^{-1}\\,{}^\\circ C^{-1}"), q("T", T, "{}^\\circ C")], find: ["Q_1", "Q_2", "Q"] },
          hint: L("Two stages: melting at 0 °C, then warming the water.", "दो चरण: 0 °C पर पिघलना, फिर पानी को गर्म करना।"),
          formula: "Q = m L_f + m c (T - 0)",
          solution: L(
            `Melting: $Q_1 = ${m} \\cdot 336 = ${m * LF}$ J\nWarming: $Q_2 = ${m} \\cdot 4.2 \\cdot ${T} = ${en(m * CW * T)}$ J\n$Q = ${en(Q)}$ J`,
            `पिघलना: $Q_1 = ${m} \\cdot 336 = ${m * LF}$ J\nगर्म करना: $Q_2 = ${m} \\cdot 4.2 \\cdot ${T} = ${en(m * CW * T)}$ J\n$Q = ${en(Q)}$ J`
          ),
        });
      }
      if (vr === 2) {
        const k = r.int(0, METALS.length - 1);
        const [mEn, mHi, c] = METALS[k];
        const mm = r.pick([100, 200, 250, 300, 500]);
        const Tm = r.pick([80, 90, 100]);
        const mw = r.pick([100, 150, 200, 250, 300]);
        const Tw = r.pick([20, 25, 30]);
        const T = (mm * c * Tm + mw * CW * Tw) / (mm * c + mw * CW);
        return task({
          text: L(`A ${mm} g ${mEn} ball at ${Tm} °C is dropped into ${mw} g of water at ${Tw} °C. Neglecting heat losses, find the final temperature in °C. (c: ${mEn} ${en(c)}, water 4.2 J g⁻¹ °C⁻¹)${RT(T, 1, lang)}`, `${Tm} °C पर ${mm} g की ${oblHi(mHi)} की गेंद को ${Tw} °C के ${mw} g पानी में डाला जाता है। ऊष्मा हानि नगण्य मानकर अंतिम ताप °C में ज्ञात कीजिए। (c: ${mHi} ${en(c)}, पानी 4.2 J g⁻¹ °C⁻¹)${RT(T, 1, lang)}`),
          answer: numM(T, 1, [[(mm * Tm + mw * Tw) / (mm + mw), L("The specific heat capacities differ; include c for each body.", "विशिष्ट ऊष्मा धारिताएँ अलग हैं; हर वस्तु के लिए c लीजिए।")], [(Tm + Tw) / 2, L("A simple average ignores the masses and heat capacities.", "साधारण औसत द्रव्यमानों और ऊष्मा धारिताओं को छोड़ देता है।")]]),
          data: { given: [q("m_1", mm, "g"), q("c_1", c, "J\\,g^{-1}\\,{}^\\circ C^{-1}"), q("T_1", Tm, "{}^\\circ C"), q("m_2", mw, "g"), q("T_2", Tw, "{}^\\circ C")], find: ["T"] },
          hint: L("Heat lost by the metal = heat gained by the water.", "धातु द्वारा दी गई ऊष्मा = पानी द्वारा ली गई ऊष्मा।"),
          formula: "m_1 c_1 (T_1 - T) = m_2 c_2 (T - T_2)",
          solution: L(
            `$m_1 c_1 = ${mm} \\cdot ${en(c)} = ${en(mm * c)}$ J/°C, $m_2 c_2 = ${mw} \\cdot 4.2 = ${en(mw * CW)}$ J/°C\n$${en(mm * c)} (${Tm} - T) = ${en(mw * CW)} (T - ${Tw})$\n$T = \\dfrac{${en(mm * c * Tm)} + ${en(mw * CW * Tw)}}{${en(mm * c + mw * CW)}} ${ev(T, 1)}$ °C`,
            `$m_1 c_1 = ${mm} \\cdot ${en(c)} = ${en(mm * c)}$ J/°C, $m_2 c_2 = ${mw} \\cdot 4.2 = ${en(mw * CW)}$ J/°C\n$${en(mm * c)} (${Tm} - T) = ${en(mw * CW)} (T - ${Tw})$\n$T = \\dfrac{${en(mm * c * Tm)} + ${en(mw * CW * Tw)}}{${en(mm * c + mw * CW)}} ${ev(T, 1)}$ °C`
          ),
        });
      }
      if (vr === 3) {
        const m = r.pick([5, 10, 15, 20, 25]);
        const T = r.pick([30, 40, 50, 60]);
        const Q = m * (LV + CW * (100 - T));
        return task({
          text: L(`${m} g of steam at 100 °C condenses and the water formed cools to ${T} °C. How much heat is given out, in J? (L of steam = 2260 J g⁻¹, c of water = 4.2 J g⁻¹ °C⁻¹)`, `100 °C की ${m} g भाप संघनित होती है और बना पानी ${T} °C तक ठंडा होता है। कितनी ऊष्मा (J में) निकलती है? (भाप की गुप्त ऊष्मा = 2260 J g⁻¹, पानी की c = 4.2 J g⁻¹ °C⁻¹)`),
          answer: numM(Q, 0, [[m * LV, L("The condensed water also cools from 100 °C; add that heat.", "संघनित पानी 100 °C से ठंडा भी होता है; वह ऊष्मा जोड़िए।")], [m * CW * (100 - T), L("Condensation releases latent heat too: add $mL$.", "संघनन में गुप्त ऊष्मा भी निकलती है: $mL$ जोड़िए।")], [m * (LV + CW * T), L("The water cools by $(100 - T)$, not by T.", "पानी $(100 - T)$ से ठंडा होता है, T से नहीं।")]]),
          data: { given: [q("m", m, "g"), q("L_v", LV, "J\\,g^{-1}"), q("c", 4.2, "J\\,g^{-1}\\,{}^\\circ C^{-1}"), q("T", T, "{}^\\circ C")], find: ["Q"] },
          hint: L("Two stages: condensing at 100 °C, then cooling the water.", "दो चरण: 100 °C पर संघनन, फिर पानी का ठंडा होना।"),
          formula: "Q = m L_v + m c (100 - T)",
          solution: L(
            `Condensing: $${m} \\cdot 2260 = ${m * LV}$ J\nCooling: $${m} \\cdot 4.2 \\cdot ${100 - T} = ${en(m * CW * (100 - T))}$ J\n$Q = ${en(Q)}$ J`,
            `संघनन: $${m} \\cdot 2260 = ${m * LV}$ J\nठंडा होना: $${m} \\cdot 4.2 \\cdot ${100 - T} = ${en(m * CW * (100 - T))}$ J\n$Q = ${en(Q)}$ J`
          ),
        });
      }
      // vr 4: power heater: time to heat water
      const P = r.pick([500, 750, 1000, 1500, 2000]);
      const m = r.pick([500, 1000, 1500, 2000]);
      const T1 = r.pick([20, 25, 30]);
      const T2 = r.pick([60, 70, 80, 100]);
      const t = (m * CW * (T2 - T1)) / P;
      return task({
        text: L(`An immersion heater of ${P} W warms ${m / 1000} kg of water from ${T1} °C to ${T2} °C. Assuming no heat loss, how long does it take, in s? ${CONST_W[0]}${RT(t, 0, lang)}`, `${P} W का एक निमज्जन हीटर ${m / 1000} kg पानी को ${T1} °C से ${T2} °C तक गर्म करता है। ऊष्मा हानि न मानकर इसमें कितना समय (s में) लगेगा? ${CONST_W[1]}${RT(t, 0, lang)}`),
        answer: numM(t, 0, [[(m / 1000) * CW * (T2 - T1) / P, L("c is given per gram: use the mass in grams.", "c प्रति ग्राम दिया है: द्रव्यमान ग्राम में लीजिए।")], [(m * CW * T2) / P, L("Use the temperature rise, not the final temperature.", "अंतिम ताप नहीं, ताप वृद्धि लीजिए।")]]),
        data: { given: [q("P", P, "W"), q("m", m / 1000, "kg"), q("T_1", T1, "{}^\\circ C"), q("T_2", T2, "{}^\\circ C"), q("c", 4.2, "J\\,g^{-1}\\,{}^\\circ C^{-1}")], find: ["Q", "t"] },
        hint: L("Find the heat needed, then use P = Q/t.", "आवश्यक ऊष्मा ज्ञात कीजिए, फिर P = Q/t लीजिए।"),
        formula: ["Q = m c \\Delta T", "t = \\dfrac{Q}{P}"],
        solution: L(
          `$m = ${en(m / 1000)}$ kg $= ${m}$ g\n$Q = ${m} \\cdot 4.2 \\cdot ${T2 - T1} = ${en(m * CW * (T2 - T1))}$ J\n$t = \\dfrac{${en(m * CW * (T2 - T1))}}{${P}} ${ev(t, 0)}$ s`,
          `$m = ${en(m / 1000)}$ kg $= ${m}$ g\n$Q = ${m} \\cdot 4.2 \\cdot ${T2 - T1} = ${en(m * CW * (T2 - T1))}$ J\n$t = \\dfrac{${en(m * CW * (T2 - T1))}}{${P}} ${ev(t, 0)}$ s`
        ),
      });
    }
    // level 3
    if (vr === 0) {
      // led v topli vodi: končna temperatura (vsi led se stali)
      let mw, Tw, mi;
      const cands = [];
      for (const a of [200, 250, 300, 400, 500]) for (const b of [40, 50, 60, 70, 80]) for (const c of [20, 25, 40, 50, 60]) if (a * CW * b - c * LF > 0 && (a * CW * b - c * LF) / ((a + c) * CW) >= 2) cands.push([a, b, c]);
      [mw, Tw, mi] = r.pick(cands);
      const T = (mw * CW * Tw - mi * LF) / ((mw + mi) * CW);
      return task({
        text: L(`${who} drops ${mi} g of ice at 0 °C into ${mw} g of water at ${Tw} °C. All the ice melts. Find the final temperature in °C (no heat loss; L = 336 J g⁻¹, c = 4.2 J g⁻¹ °C⁻¹).${RT(T, 1, lang)}`, `${who} 0 °C की ${mi} g बर्फ़ को ${Tw} °C के ${mw} g पानी में ${ni % 2 ? "डालती" : "डालता"} है। सारी बर्फ़ पिघल जाती है। अंतिम ताप °C में ज्ञात कीजिए (ऊष्मा हानि नहीं; L = 336 J g⁻¹, c = 4.2 J g⁻¹ °C⁻¹)।${RT(T, 1, lang)}`),
        answer: numM(T, 1, [[(mw * CW * Tw - mi * LF) / (mw * CW), L("The melted ice (now water at 0 °C) also warms up to T.", "पिघली बर्फ़ (अब 0 °C का पानी) भी T तक गर्म होती है।")], [(mw * Tw) / (mw + mi), L("Melting needs latent heat: include $m_{ice} L$.", "पिघलने में गुप्त ऊष्मा लगती है: $m_{ice} L$ शामिल कीजिए।")]]),
        data: { given: [q("m_{ice}", mi, "g"), q("m_w", mw, "g"), q("T_w", Tw, "{}^\\circ C"), q("L_f", LF, "J\\,g^{-1}"), q("c", 4.2, "J\\,g^{-1}\\,{}^\\circ C^{-1}")], find: ["T"] },
        hint: L("Heat lost by the warm water = heat to melt the ice + heat to warm the melted ice to T.", "गर्म पानी द्वारा दी गई ऊष्मा = बर्फ़ पिघलाने की ऊष्मा + पिघली बर्फ़ को T तक गर्म करने की ऊष्मा।"),
        formula: "m_w c (T_w - T) = m_{ice} L_f + m_{ice} c (T - 0)",
        solution: L(
          `$${mw} \\cdot 4.2 (${Tw} - T) = ${mi} \\cdot 336 + ${mi} \\cdot 4.2\\,T$\n$${en(mw * CW * Tw)} - ${en(mw * CW)}T = ${mi * LF} + ${en(mi * CW)}T$\n$${en((mw + mi) * CW)}\\,T = ${en(mw * CW * Tw - mi * LF)}$\n$T ${ev(T, 1)}$ °C`,
          `$${mw} \\cdot 4.2 (${Tw} - T) = ${mi} \\cdot 336 + ${mi} \\cdot 4.2\\,T$\n$${en(mw * CW * Tw)} - ${en(mw * CW)}T = ${mi * LF} + ${en(mi * CW)}T$\n$${en((mw + mi) * CW)}\\,T = ${en(mw * CW * Tw - mi * LF)}$\n$T ${ev(T, 1)}$ °C`
        ),
      });
    }
    if (vr === 1) {
      const mw = r.pick([200, 250, 300, 400, 500]);
      const T1 = r.pick([30, 35, 40, 45]);
      const T2 = r.pick([5, 10, 15, 20]);
      const mi = (mw * CW * (T1 - T2)) / (LF + CW * T2);
      return task({
        text: L(`What mass of ice at 0 °C must be added to ${mw} g of lemonade (treat as water) at ${T1} °C to cool it to ${T2} °C, in g? (L = 336 J g⁻¹, c = 4.2 J g⁻¹ °C⁻¹, no heat loss)${RT(mi, 1, lang)}`, `${T1} °C के ${mw} g नींबू पानी (पानी मानिए) को ${T2} °C तक ठंडा करने के लिए 0 °C की कितनी बर्फ़ (g में) डालनी होगी? (L = 336 J g⁻¹, c = 4.2 J g⁻¹ °C⁻¹, ऊष्मा हानि नहीं)${RT(mi, 1, lang)}`),
        answer: numM(mi, 1, [[(mw * CW * (T1 - T2)) / LF, L("The melted ice must also warm from 0 °C to the final temperature.", "पिघली बर्फ़ को भी 0 °C से अंतिम ताप तक गर्म होना है।")], [(mw * CW * T1) / (LF + CW * T2), L("The lemonade cools by $(T_1 - T_2)$, not by $T_1$.", "नींबू पानी $(T_1 - T_2)$ से ठंडा होता है, $T_1$ से नहीं।")]]),
        data: { given: [q("m_w", mw, "g"), q("T_1", T1, "{}^\\circ C"), q("T_2", T2, "{}^\\circ C"), q("L_f", LF, "J\\,g^{-1}"), q("c", 4.2, "J\\,g^{-1}\\,{}^\\circ C^{-1}")], find: ["m_{ice}"] },
        hint: L("Heat given by the lemonade = heat taken by the ice to melt and then warm to the final temperature.", "नींबू पानी द्वारा दी गई ऊष्मा = बर्फ़ द्वारा पिघलने और फिर अंतिम ताप तक गर्म होने में ली गई ऊष्मा।"),
        formula: "m_w c (T_1 - T_2) = m_{ice} (L_f + c T_2)",
        solution: L(
          `Heat given: $${mw} \\cdot 4.2 \\cdot ${T1 - T2} = ${en(mw * CW * (T1 - T2))}$ J\nPer gram of ice: $336 + 4.2 \\cdot ${T2} = ${en(LF + CW * T2)}$ J\n$m_{ice} = \\dfrac{${en(mw * CW * (T1 - T2))}}{${en(LF + CW * T2)}} ${ev(mi, 1)}$ g`,
          `दी गई ऊष्मा: $${mw} \\cdot 4.2 \\cdot ${T1 - T2} = ${en(mw * CW * (T1 - T2))}$ J\nबर्फ़ के प्रति ग्राम: $336 + 4.2 \\cdot ${T2} = ${en(LF + CW * T2)}$ J\n$m_{ice} = \\dfrac{${en(mw * CW * (T1 - T2))}}{${en(LF + CW * T2)}} ${ev(mi, 1)}$ g`
        ),
      });
    }
    if (vr === 2) {
      const mw = r.pick([200, 300, 400, 500]);
      const T1 = r.pick([15, 20, 25]);
      const T = r.pick([40, 45, 50, 60]);
      const ms = (mw * CW * (T - T1)) / (LV + CW * (100 - T));
      return task({
        text: L(`Steam at 100 °C is passed into ${mw} g of water at ${T1} °C until the temperature reaches ${T} °C. What mass of steam condenses, in g? (L of steam = 2260 J g⁻¹, c = 4.2 J g⁻¹ °C⁻¹, no heat loss)${RT(ms, 1, lang)}`, `100 °C की भाप को ${T1} °C के ${mw} g पानी में तब तक प्रवाहित किया जाता है जब तक ताप ${T} °C न हो जाए। कितनी भाप (g में) संघनित होती है? (भाप की गुप्त ऊष्मा = 2260 J g⁻¹, c = 4.2 J g⁻¹ °C⁻¹, ऊष्मा हानि नहीं)${RT(ms, 1, lang)}`),
        answer: numM(ms, 1, [[(mw * CW * (T - T1)) / LV, L("The condensed steam also cools from 100 °C to the final temperature.", "संघनित भाप भी 100 °C से अंतिम ताप तक ठंडी होती है।")], [(mw * CW * (T - T1)) / (CW * (100 - T)), L("Condensing releases latent heat; include $L_v$.", "संघनन में गुप्त ऊष्मा निकलती है; $L_v$ शामिल कीजिए।")]]),
        data: { given: [q("m_w", mw, "g"), q("T_1", T1, "{}^\\circ C"), q("T", T, "{}^\\circ C"), q("L_v", LV, "J\\,g^{-1}"), q("c", 4.2, "J\\,g^{-1}\\,{}^\\circ C^{-1}")], find: ["m_s"] },
        hint: L("Each gram of steam gives $L_v$ while condensing plus $c(100 - T)$ while cooling.", "भाप का प्रत्येक ग्राम संघनन में $L_v$ और ठंडा होने में $c(100 - T)$ देता है।"),
        formula: "m_s [L_v + c (100 - T)] = m_w c (T - T_1)",
        solution: L(
          `Heat gained by the water: $${mw} \\cdot 4.2 \\cdot ${T - T1} = ${en(mw * CW * (T - T1))}$ J\nPer gram of steam: $2260 + 4.2 \\cdot ${100 - T} = ${en(LV + CW * (100 - T))}$ J\n$m_s = \\dfrac{${en(mw * CW * (T - T1))}}{${en(LV + CW * (100 - T))}} ${ev(ms, 1)}$ g`,
          `पानी द्वारा ली गई ऊष्मा: $${mw} \\cdot 4.2 \\cdot ${T - T1} = ${en(mw * CW * (T - T1))}$ J\nभाप के प्रति ग्राम: $2260 + 4.2 \\cdot ${100 - T} = ${en(LV + CW * (100 - T))}$ J\n$m_s = \\dfrac{${en(mw * CW * (T - T1))}}{${en(LV + CW * (100 - T))}} ${ev(ms, 1)}$ g`
        ),
      });
    }
    if (vr === 3) {
      // specifična toplota kovine s kalorimetrom (bakreni kalorimeter, c = 0.4)
      const k = r.int(0, METALS.length - 1);
      const [mEn, mHi, cTrue] = METALS[k];
      const mm = r.pick([100, 150, 200, 250]);
      const Tm = 100;
      const mc = r.pick([50, 80, 100]);
      const mw = r.pick([100, 150, 200]);
      const T1 = r.pick([20, 25, 30]);
      const H = mw * CW + mc * 0.4;
      const T = rd((mm * cTrue * Tm + H * T1) / (mm * cTrue + H), 1);
      const c = (H * (T - T1)) / (mm * (Tm - T));
      return task({
        text: L(`A ${mm} g metal piece at 100 °C is put into a copper calorimeter (${mc} g, c = 0.4 J g⁻¹ °C⁻¹) holding ${mw} g of water at ${T1} °C. The final temperature is ${en(T)} °C. Find c of the metal in J g⁻¹ °C⁻¹ (c of water 4.2).${RT(c, 2, lang)}`, `100 °C के ${mm} g धातु के टुकड़े को ताँबे के कैलोरीमीटर (${mc} g, c = 0.4 J g⁻¹ °C⁻¹) में रखे ${T1} °C के ${mw} g पानी में डाला जाता है। अंतिम ताप ${en(T)} °C है। धातु की c J g⁻¹ °C⁻¹ में ज्ञात कीजिए (पानी की c = 4.2)।${RT(c, 2, lang)}`),
        answer: numM(c, 2, [[(mw * CW * (T - T1)) / (mm * (Tm - T)), L("The calorimeter also gains heat; include $m_{cal} c_{cal}$.", "कैलोरीमीटर भी ऊष्मा लेता है; $m_{cal} c_{cal}$ शामिल कीजिए।")], [(H * (T - T1)) / (mm * Tm), L("The metal cools by $(100 - T)$, not by 100 °C.", "धातु $(100 - T)$ से ठंडी होती है, 100 °C से नहीं।")]]),
        data: { given: [q("m", mm, "g"), q("m_{cal}", mc, "g"), q("c_{cal}", 0.4, "J\\,g^{-1}\\,{}^\\circ C^{-1}"), q("m_w", mw, "g"), q("T_1", T1, "{}^\\circ C"), q("T", T, "{}^\\circ C")], find: ["c"] },
        hint: L("Heat lost by the metal = heat gained by the water + heat gained by the calorimeter.", "धातु द्वारा दी गई ऊष्मा = पानी द्वारा ली गई ऊष्मा + कैलोरीमीटर द्वारा ली गई ऊष्मा।"),
        formula: "m c (100 - T) = (m_w c_w + m_{cal} c_{cal})(T - T_1)",
        solution: L(
          `$m_w c_w + m_{cal} c_{cal} = ${en(mw * CW)} + ${en(mc * 0.4)} = ${en(H)}$ J/°C\nHeat gained: $${en(H)} \\cdot ${fx(T - T1, 1)} ${ev(H * (T - T1), 1)}$ J\n$c = \\dfrac{${fx(H * (T - T1), 1)}}{${mm} \\cdot ${fx(Tm - T, 1)}} ${ev(c, 2)}$ J g⁻¹ °C⁻¹`,
          `$m_w c_w + m_{cal} c_{cal} = ${en(mw * CW)} + ${en(mc * 0.4)} = ${en(H)}$ J/°C\nली गई ऊष्मा: $${en(H)} \\cdot ${fx(T - T1, 1)} ${ev(H * (T - T1), 1)}$ J\n$c = \\dfrac{${fx(H * (T - T1), 1)}}{${mm} \\cdot ${fx(Tm - T, 1)}} ${ev(c, 2)}$ J g⁻¹ °C⁻¹`
        ),
      });
    }
    // vr 4: led 0 °C → para 100 °C
    const m = r.pick([5, 10, 20, 25, 50]);
    const Q = m * (LF + CW * 100 + LV);
    return task({
      text: L(`How much heat is needed to change ${m} g of ice at 0 °C into steam at 100 °C, in J? (L of ice = 336 J g⁻¹, c of water = 4.2 J g⁻¹ °C⁻¹, L of steam = 2260 J g⁻¹)`, `0 °C की ${m} g बर्फ़ को 100 °C की भाप में बदलने के लिए कितनी ऊष्मा (J में) चाहिए? (बर्फ़ की गुप्त ऊष्मा = 336 J g⁻¹, पानी की c = 4.2 J g⁻¹ °C⁻¹, भाप की गुप्त ऊष्मा = 2260 J g⁻¹)`),
      answer: numM(Q, 0, [[m * (LF + LV), L("Between melting and boiling, the water must be warmed from 0 °C to 100 °C.", "पिघलने और उबलने के बीच पानी को 0 °C से 100 °C तक गर्म करना है।")], [m * (LF + CW * 100), L("Boiling into steam needs latent heat of vaporisation too.", "भाप बनने के लिए वाष्पन की गुप्त ऊष्मा भी चाहिए।")], [m * CW * 100, L("Both changes of state need latent heat.", "दोनों अवस्था परिवर्तनों में गुप्त ऊष्मा लगती है।")]]),
      data: { given: [q("m", m, "g"), q("L_f", LF, "J\\,g^{-1}"), q("c", 4.2, "J\\,g^{-1}\\,{}^\\circ C^{-1}"), q("L_v", LV, "J\\,g^{-1}")], find: ["Q"] },
      hint: L("Three stages: melt, warm from 0 °C to 100 °C, boil.", "तीन चरण: पिघलना, 0 °C से 100 °C तक गर्म होना, उबलना।"),
      formula: "Q = m L_f + m c \\cdot 100 + m L_v",
      solution: L(
        `Melting: $${m} \\cdot 336 = ${m * LF}$ J\nWarming: $${m} \\cdot 4.2 \\cdot 100 = ${en(m * 420)}$ J\nBoiling: $${m} \\cdot 2260 = ${m * LV}$ J\n$Q = ${en(Q)}$ J`,
        `पिघलना: $${m} \\cdot 336 = ${m * LF}$ J\nगर्म होना: $${m} \\cdot 4.2 \\cdot 100 = ${en(m * 420)}$ J\nउबलना: $${m} \\cdot 2260 = ${m * LV}$ J\n$Q = ${en(Q)}$ J`
      ),
    });
  },
};

// ---------- 6. Alternating current (CBSE/ISC Class 12) ----------
const AC_FACTS = [
  {
    q: ["An ac voltage is applied to a pure inductor. How is the current related to the voltage?", "एक शुद्ध प्रेरक पर ac वोल्टता लगाई जाती है। धारा का वोल्टता से क्या संबंध है?"],
    g: ["\\text{pure } L", "\\text{शुद्ध } L"],
    ok: ["The current lags the voltage by π/2", "धारा वोल्टता से π/2 पीछे रहती है"],
    wrong: [
      [["The current leads the voltage by π/2", "धारा वोल्टता से π/2 आगे रहती है"], ["Current leads by π/2 in a pure capacitor, not in an inductor.", "धारा π/2 आगे शुद्ध संधारित्र में रहती है, प्रेरक में नहीं।"]],
      [["The current is in phase with the voltage", "धारा वोल्टता की कला में रहती है"], ["Current and voltage are in phase only in a pure resistor.", "धारा और वोल्टता केवल शुद्ध प्रतिरोधक में समान कला में होती हैं।"]],
      [["The current lags the voltage by π", "धारा वोल्टता से π पीछे रहती है"], ["The phase difference in a pure inductor is π/2, not π.", "शुद्ध प्रेरक में कलांतर π/2 होता है, π नहीं।"]],
    ],
    sol: ["For $v = v_m \\sin\\omega t$ across L, $i = i_m \\sin(\\omega t - \\pi/2)$: the current lags by π/2.", "L पर $v = v_m \\sin\\omega t$ हो तो $i = i_m \\sin(\\omega t - \\pi/2)$: धारा π/2 पीछे रहती है।"],
  },
  {
    q: ["What is the average power used by an ideal capacitor (or ideal inductor) over a complete ac cycle?", "एक आदर्श संधारित्र (या आदर्श प्रेरक) द्वारा ac के पूरे चक्र में उपयोग की गई औसत शक्ति कितनी है?"],
    g: ["\\cos\\phi", "\\cos\\phi"],
    ok: ["Zero, because the phase difference is π/2 and cos φ = 0", "शून्य, क्योंकि कलांतर π/2 है और cos φ = 0"],
    wrong: [
      [["V_rms × I_rms, as in a resistor", "प्रतिरोधक की तरह V_rms × I_rms"], ["$P = V_{rms} I_{rms} \\cos\\phi$; for φ = π/2 the power factor is zero.", "$P = V_{rms} I_{rms} \\cos\\phi$; φ = π/2 के लिए शक्ति गुणांक शून्य है।"]],
      [["½ V₀ I₀, half the peak product", "½ V₀ I₀, शिखर मानों के गुणनफल का आधा"], ["That is the average power in a pure resistor.", "यह शुद्ध प्रतिरोधक में औसत शक्ति है।"]],
      [["It is infinite at resonance", "अनुनाद पर यह अनंत होती है"], ["Energy stored in one quarter-cycle is returned in the next; the average is zero.", "एक चौथाई चक्र में संचित ऊर्जा अगले में लौट जाती है; औसत शून्य है।"]],
    ],
    sol: ["$P_{av} = V_{rms} I_{rms} \\cos\\phi$ and $\\cos(\\pi/2) = 0$: the energy taken is returned to the source.", "$P_{av} = V_{rms} I_{rms} \\cos\\phi$ और $\\cos(\\pi/2) = 0$: ली गई ऊर्जा स्रोत को लौटा दी जाती है।"],
  },
  {
    q: ["At resonance in a series LCR circuit, which statement is correct?", "श्रेणी LCR परिपथ में अनुनाद पर कौन-सा कथन सही है?"],
    g: ["X_L = X_C", "X_L = X_C"],
    ok: ["Impedance is minimum (Z = R), current is maximum and the power factor is 1", "प्रतिबाधा न्यूनतम (Z = R), धारा अधिकतम और शक्ति गुणांक 1 होता है"],
    wrong: [
      [["Impedance is maximum and current is minimum", "प्रतिबाधा अधिकतम और धारा न्यूनतम होती है"], ["At resonance the reactances cancel, so Z falls to R, its least value.", "अनुनाद पर प्रतिघात एक-दूसरे को निरस्त करते हैं, अतः Z घटकर R (न्यूनतम) हो जाता है।"]],
      [["The power factor is zero", "शक्ति गुणांक शून्य होता है"], ["At resonance φ = 0, so cos φ = 1.", "अनुनाद पर φ = 0, अतः cos φ = 1।"]],
      [["The voltages across L and C are both zero", "L और C पर वोल्टताएँ दोनों शून्य होती हैं"], ["They are equal and opposite, not zero; each can even exceed the source voltage.", "वे बराबर और विपरीत होती हैं, शून्य नहीं; प्रत्येक स्रोत वोल्टता से अधिक भी हो सकती है।"]],
    ],
    sol: ["$X_L = X_C$ → $Z = \\sqrt{R^2 + 0} = R$, so $I = V/R$ is largest and $\\cos\\phi = R/Z = 1$.", "$X_L = X_C$ → $Z = \\sqrt{R^2 + 0} = R$, अतः $I = V/R$ अधिकतम और $\\cos\\phi = R/Z = 1$।"],
  },
  {
    q: ["Why does a capacitor block steady dc but allow ac to flow in the circuit?", "संधारित्र स्थिर dc को क्यों रोकता है पर ac को परिपथ में बहने देता है?"],
    g: ["X_C", "X_C"],
    ok: ["For dc, f = 0, so the reactance X_C is infinite; for ac it is finite", "dc के लिए f = 0, अतः प्रतिघात X_C अनंत है; ac के लिए यह परिमित है"],
    wrong: [
      [["For dc, X_C is zero", "dc के लिए X_C शून्य है"], ["$X_C = 1/(2\\pi f C)$ grows without limit as f → 0.", "f → 0 होने पर $X_C = 1/(2\\pi f C)$ असीमित रूप से बढ़ता है।"]],
      [["Charges cross the gap between the plates only when the voltage alternates", "वोल्टता बदलने पर ही आवेश प्लेटों के बीच का अंतराल पार करते हैं"], ["No charge crosses the dielectric; the plates charge and discharge in turn.", "कोई आवेश परावैद्युत को पार नहीं करता; प्लेटें बारी-बारी से आवेशित और अनावेशित होती हैं।"]],
      [["Its capacitance becomes larger with dc", "dc के साथ इसकी धारिता बढ़ जाती है"], ["Capacitance depends on the build of the capacitor, not on the type of current.", "धारिता संधारित्र की बनावट पर निर्भर है, धारा के प्रकार पर नहीं।"]],
    ],
    sol: ["$X_C = \\dfrac{1}{2\\pi f C}$: f = 0 gives an infinite reactance (no steady current); for ac the reactance is finite.", "$X_C = \\dfrac{1}{2\\pi f C}$: f = 0 पर प्रतिघात अनंत (कोई स्थिर धारा नहीं); ac के लिए प्रतिघात परिमित है।"],
  },
];
// Pitagorejske trojke za Z (R, X, Z)
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [9, 12, 15], [8, 15, 17], [15, 8, 17], [20, 15, 25]];

const exiAC = {
  id: "exi-fiz-alternating-current",
  topics: [T("alternating-current")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const vr = r.int(0, level === 3 ? 3 : 4);
    const PI = Math.PI;
    if (level === 1) {
      if (vr === 0) {
        const rev = r.int(0, 1) === 1;
        const Vr = r.pick([110, 120, 220, 230, 240]);
        const V0 = r.pick([100, 141, 200, 282, 311, 325, 340]);
        const val = rev ? Vr * Math.SQRT2 : V0 / Math.SQRT2;
        return task({
          text: rev
            ? L(`The rms value of an ac mains voltage is ${Vr} V. Find its peak value $V_0$, in V.${RT(val, 1, lang)}`, `ac मुख्य आपूर्ति की वोल्टता का वर्ग माध्य मूल (rms) मान ${Vr} V है। उसका शिखर मान $V_0$ V में ज्ञात कीजिए।${RT(val, 1, lang)}`)
            : L(`An ac voltage has a peak value of ${V0} V. Find its rms value, in V.${RT(val, 1, lang)}`, `एक ac वोल्टता का शिखर मान ${V0} V है। उसका वर्ग माध्य मूल (rms) मान V में ज्ञात कीजिए।${RT(val, 1, lang)}`),
          answer: numM(val, 1, rev ? [[Vr / Math.SQRT2, L("The peak value is larger than the rms value: multiply by √2.", "शिखर मान rms मान से बड़ा होता है: √2 से गुणा कीजिए।")], [Vr * 2, L("The factor is √2, not 2.", "गुणक √2 है, 2 नहीं।")]] : [[V0 * Math.SQRT2, L("The rms value is smaller than the peak: divide by √2.", "rms मान शिखर मान से छोटा होता है: √2 से भाग दीजिए।")], [V0 / 2, L("The factor is √2, not 2.", "गुणक √2 है, 2 नहीं।")]]),
          data: { given: [rev ? q("V_{rms}", Vr, "V") : q("V_0", V0, "V")], find: [rev ? "V_0" : "V_{rms}"] },
          hint: L("For a sinusoidal voltage, peak and rms values differ by a factor of √2.", "ज्यावक्रीय वोल्टता में शिखर और rms मानों में √2 का गुणक होता है।"),
          formula: "V_{rms} = \\dfrac{V_0}{\\sqrt{2}}",
          solution: rev
            ? L(`$V_0 = \\sqrt{2}\\,V_{rms} = 1.414 \\cdot ${Vr}$\n$V_0 \\approx ${fx(val, 1)}$ V`, `$V_0 = \\sqrt{2}\\,V_{rms} = 1.414 \\cdot ${Vr}$\n$V_0 \\approx ${fx(val, 1)}$ V`)
            : L(`$V_{rms} = \\dfrac{${V0}}{\\sqrt{2}} = \\dfrac{${V0}}{1.414}$\n$V_{rms} \\approx ${fx(val, 1)}$ V`, `$V_{rms} = \\dfrac{${V0}}{\\sqrt{2}} = \\dfrac{${V0}}{1.414}$\n$V_{rms} \\approx ${fx(val, 1)}$ V`),
        });
      }
      if (vr === 1) {
        const Lm = r.pick([50, 100, 150, 200, 250, 300, 500]);
        const f = r.pick([50, 60, 100]);
        const XL = 2 * PI * f * Lm / 1000;
        return task({
          text: L(`Find the reactance of a ${Lm} mH inductor at a frequency of ${f} Hz, in Ω.${RT(XL, 1, lang)}`, `${f} Hz आवृत्ति पर ${Lm} mH प्रेरक का प्रेरणिक प्रतिघात Ω में ज्ञात कीजिए।${RT(XL, 1, lang)}`),
          answer: numM(XL, 1, [[(f * Lm) / 1000, L("$X_L = \\omega L = 2\\pi f L$; include 2π.", "$X_L = \\omega L = 2\\pi f L$; 2π शामिल कीजिए।")], [2 * PI * f * Lm, L("Convert mH to H.", "mH को H में बदलिए।")], [1000 / (2 * PI * f * Lm), L("That is the form of $X_C$; for an inductor $X_L = \\omega L$.", "यह $X_C$ का रूप है; प्रेरक के लिए $X_L = \\omega L$।")]]),
          data: { given: [q("L", Lm, "mH"), q("f", f, "Hz")], find: ["X_L"] },
          hint: L("Convert L to henry and ω = 2πf.", "L को हेनरी में बदलिए और ω = 2πf लीजिए।"),
          formula: "X_L = \\omega L = 2\\pi f L",
          solution: L(`$L = ${en(Lm / 1000)}$ H\n$X_L = 2\\pi \\cdot ${f} \\cdot ${en(Lm / 1000)} ${ev(XL, 1)}\\ \\Omega$`, `$L = ${en(Lm / 1000)}$ H\n$X_L = 2\\pi \\cdot ${f} \\cdot ${en(Lm / 1000)} ${ev(XL, 1)}\\ \\Omega$`),
        });
      }
      if (vr === 2) {
        const C = r.pick([5, 10, 20, 25, 50, 100]);
        const f = r.pick([50, 60, 100]);
        const XC = 1 / (2 * PI * f * C * 1e-6);
        return task({
          text: L(`Find the reactance of a ${C} µF capacitor at a frequency of ${f} Hz, in Ω.${RT(XC, 1, lang)}`, `${f} Hz आवृत्ति पर ${C} µF संधारित्र का धारितीय प्रतिघात Ω में ज्ञात कीजिए।${RT(XC, 1, lang)}`),
          answer: numM(XC, 1, [[1 / (f * C * 1e-6), L("$X_C = 1/(2\\pi f C)$; include 2π.", "$X_C = 1/(2\\pi f C)$; 2π शामिल कीजिए।")], [2 * PI * f * C * 1e-6, L("Capacitive reactance is $1/(\\omega C)$, not $\\omega C$.", "धारितीय प्रतिघात $1/(\\omega C)$ है, $\\omega C$ नहीं।")], [1 / (2 * PI * f * C * 1e-3), L("1 µF = 10⁻⁶ F.", "1 µF = 10⁻⁶ F।")]]),
          data: { given: [q("C", C, "\\mu F"), q("f", f, "Hz")], find: ["X_C"] },
          hint: L("Convert µF to F, then use ω = 2πf.", "µF को F में बदलिए, फिर ω = 2πf लीजिए।"),
          formula: "X_C = \\dfrac{1}{\\omega C} = \\dfrac{1}{2\\pi f C}",
          solution: L(`$C = ${C} \\times 10^{-6}$ F\n$X_C = \\dfrac{1}{2\\pi \\cdot ${f} \\cdot ${C} \\times 10^{-6}} ${ev(XC, 1)}\\ \\Omega$`, `$C = ${C} \\times 10^{-6}$ F\n$X_C = \\dfrac{1}{2\\pi \\cdot ${f} \\cdot ${C} \\times 10^{-6}} ${ev(XC, 1)}\\ \\Omega$`),
        });
      }
      if (vr === 3) {
        const Vp = r.pick([220, 230, 240]);
        const Np = r.pick([500, 1000, 1100, 1200, 2000, 2200]);
        const ratio = r.pick([0.05, 0.1, 0.2, 0.5, 2, 5, 10]);
        const Ns = Math.round(Np * ratio);
        const Vs = (Vp * Ns) / Np;
        return task({
          text: L(`An ideal transformer has ${Np} turns in the primary and ${Ns} turns in the secondary. The primary is connected to ${Vp} V ac. Find the secondary voltage, in V.`, `एक आदर्श ट्रांसफ़ॉर्मर की प्राथमिक कुंडली में ${Np} और द्वितीयक कुंडली में ${Ns} फेरे हैं। प्राथमिक को ${Vp} V ac से जोड़ा गया है। द्वितीयक वोल्टता V में ज्ञात कीजिए।`),
          answer: numM(Vs, 1, [[(Vp * Np) / Ns, L("$V_s/V_p = N_s/N_p$; you inverted the turns ratio.", "$V_s/V_p = N_s/N_p$; आपने फेरों का अनुपात उल्टा कर दिया।")], [Vp, L("A transformer changes the voltage in the ratio of the turns.", "ट्रांसफ़ॉर्मर फेरों के अनुपात में वोल्टता बदलता है।")]]),
          data: { given: [q("N_p", Np), q("N_s", Ns), q("V_p", Vp, "V")], find: ["V_s"] },
          hint: L("Voltage per turn is the same in both coils.", "प्रति फेरा वोल्टता दोनों कुंडलियों में समान होती है।"),
          formula: "\\dfrac{V_s}{V_p} = \\dfrac{N_s}{N_p}",
          solution: L(`$V_s = V_p \\dfrac{N_s}{N_p} = ${Vp} \\cdot \\dfrac{${Ns}}{${Np}}$\n$V_s = ${en(Vs)}$ V (${ratio > 1 ? "step-up" : "step-down"})`, `$V_s = V_p \\dfrac{N_s}{N_p} = ${Vp} \\cdot \\dfrac{${Ns}}{${Np}}$\n$V_s = ${en(Vs)}$ V (${ratio > 1 ? "उच्चायी" : "अपचायी"})`),
        });
      }
      const it = r.pick(AC_FACTS.slice(0, 2));
      const answer = ch(r, L, it.ok, it.wrong);
      return task({
        text: L(...it.q),
        answer,
        data: { given: [L(...it.g)], find: ["\\phi"] },
        hint: L("Recall the phase between current and voltage for R, L and C separately.", "R, L और C के लिए अलग-अलग धारा और वोल्टता के बीच की कला याद कीजिए।"),
        formula: "P_{av} = V_{rms} I_{rms} \\cos\\phi",
        solution: L(`${it.sol[0]}\nAnswer: ${it.ok[0]}.`, `${it.sol[1]}\nउत्तर: ${it.ok[1]}।`),
      });
    }
    if (level === 2) {
      if (vr === 0 || vr === 1) {
        const [a, b, c] = r.pick(TRIPLES);
        const s = r.pick([2, 4, 5, 10]);
        const R = a * s, X = b * s, Z = c * s;
        const XC = r.pick([10, 20, 30, 40, 50]);
        const lead = r.int(0, 1) === 1; // X_C > X_L ?
        const XL = lead ? XC : XC + X;
        const XC2 = lead ? XC + X : XC;
        const V = r.pick([100, 110, 200, 220, 230]);
        const I = V / Z;
        const pf = R / Z;
        if (vr === 0) {
          return task({
            text: L(`A series LCR circuit has R = ${R} Ω, $X_L$ = ${XL} Ω and $X_C$ = ${XC2} Ω. It is connected to a ${V} V (rms) ac source. Find the rms current, in A.${RT(I, 2, lang)}`, `एक श्रेणी LCR परिपथ में R = ${R} Ω, $X_L$ = ${XL} Ω और $X_C$ = ${XC2} Ω हैं। इसे ${V} V (rms) ac स्रोत से जोड़ा गया है। rms धारा A में ज्ञात कीजिए।${RT(I, 2, lang)}`),
            answer: numM(I, 2, [[V / (R + XL + XC2), L("Impedance is not a simple sum; use $Z = \\sqrt{R^2 + (X_L - X_C)^2}$.", "प्रतिबाधा साधारण योग नहीं है; $Z = \\sqrt{R^2 + (X_L - X_C)^2}$ लीजिए।")], [V / Math.sqrt(R * R + (XL + XC2) ** 2), L("$X_L$ and $X_C$ act in opposite phase: subtract them.", "$X_L$ और $X_C$ विपरीत कला में हैं: उन्हें घटाइए।")], [V / R, L("Include the net reactance in the impedance.", "प्रतिबाधा में परिणामी प्रतिघात भी शामिल कीजिए।")]]),
            data: { given: [q("R", R, "\\Omega"), q("X_L", XL, "\\Omega"), q("X_C", XC2, "\\Omega"), q("V", V, "V")], find: ["Z", "I"] },
            hint: L("Find the impedance first.", "पहले प्रतिबाधा ज्ञात कीजिए।"),
            formula: ["Z = \\sqrt{R^2 + (X_L - X_C)^2}", "I = \\dfrac{V}{Z}"],
            solution: L(
              `$X_L - X_C = ${XL - XC2}\\ \\Omega$\n$Z = \\sqrt{${R}^2 + ${XL - XC2}^2} = ${Z}\\ \\Omega$\n$I = \\dfrac{${V}}{${Z}} ${ev(I, 2)}$ A`.replace(`${XL - XC2}^2`, `(${XL - XC2})^2`),
              `$X_L - X_C = ${XL - XC2}\\ \\Omega$\n$Z = \\sqrt{${R}^2 + ${XL - XC2}^2} = ${Z}\\ \\Omega$\n$I = \\dfrac{${V}}{${Z}} ${ev(I, 2)}$ A`.replace(`${XL - XC2}^2`, `(${XL - XC2})^2`)
            ),
          });
        }
        return task({
          text: L(`In a series LCR circuit R = ${R} Ω, $X_L$ = ${XL} Ω and $X_C$ = ${XC2} Ω. Find the power factor of the circuit.${RT(pf, 2, lang)}`, `एक श्रेणी LCR परिपथ में R = ${R} Ω, $X_L$ = ${XL} Ω और $X_C$ = ${XC2} Ω हैं। परिपथ का शक्ति गुणांक ज्ञात कीजिए।${RT(pf, 2, lang)}`),
          answer: numM(pf, 2, [[R / (R + XL + XC2), L("Use the impedance Z, not the sum of R, $X_L$ and $X_C$.", "R, $X_L$ और $X_C$ के योग के बजाय प्रतिबाधा Z लीजिए।")], [X / Z, L("cos φ = R/Z; you used the reactance.", "cos φ = R/Z; आपने प्रतिघात ले लिया।")], [R / Math.sqrt(R * R + (XL + XC2) ** 2), L("Subtract the reactances: $X_L - X_C$.", "प्रतिघात घटाइए: $X_L - X_C$।")]]),
          data: { given: [q("R", R, "\\Omega"), q("X_L", XL, "\\Omega"), q("X_C", XC2, "\\Omega")], find: ["Z", "\\cos\\phi"] },
          hint: L("The power factor is the ratio of resistance to impedance.", "शक्ति गुणांक प्रतिरोध और प्रतिबाधा का अनुपात है।"),
          formula: ["Z = \\sqrt{R^2 + (X_L - X_C)^2}", "\\cos\\phi = \\dfrac{R}{Z}"],
          solution: L(
            `$Z = \\sqrt{${R}^2 + (${XL - XC2})^2} = ${Z}\\ \\Omega$\n$\\cos\\phi = \\dfrac{${R}}{${Z}} ${ev(pf, 2)}$ (${lead ? "current leads" : "current lags"})`,
            `$Z = \\sqrt{${R}^2 + (${XL - XC2})^2} = ${Z}\\ \\Omega$\n$\\cos\\phi = \\dfrac{${R}}{${Z}} ${ev(pf, 2)}$ (${lead ? "धारा आगे" : "धारा पीछे"})`
          ),
        });
      }
      if (vr === 2) {
        const Vp = r.pick([220, 230, 240]);
        const Vs = r.pick([6, 11, 12, 22, 24, 110, 440, 2200]);
        const Ip = r.pick([0.1, 0.2, 0.5, 1, 2, 5]);
        const Is = (Vp * Ip) / Vs;
        return task({
          text: L(`An ideal transformer steps ${Vs < Vp ? "down" : "up"} ${Vp} V to ${Vs} V. The current in the primary is ${en(Ip)} A. Find the current in the secondary, in A.${RT(Is, 2, lang)}`, `एक आदर्श ट्रांसफ़ॉर्मर ${Vp} V को ${Vs} V में ${Vs < Vp ? "घटाता" : "बढ़ाता"} है। प्राथमिक में धारा ${en(Ip)} A है। द्वितीयक में धारा A में ज्ञात कीजिए।${RT(Is, 2, lang)}`),
          answer: numM(Is, 2, [[(Vs * Ip) / Vp, L("Power is conserved: when the voltage goes down, the current goes up.", "शक्ति संरक्षित रहती है: वोल्टता घटे तो धारा बढ़ती है।")], [Ip, L("The current changes in the inverse ratio of the voltages.", "धारा वोल्टताओं के व्युत्क्रम अनुपात में बदलती है।")]]),
          data: { given: [q("V_p", Vp, "V"), q("V_s", Vs, "V"), q("I_p", Ip, "A")], find: ["I_s"] },
          hint: L("In an ideal transformer, input power = output power.", "आदर्श ट्रांसफ़ॉर्मर में निवेशी शक्ति = निर्गत शक्ति।"),
          formula: "V_p I_p = V_s I_s",
          solution: L(`$I_s = \\dfrac{V_p I_p}{V_s} = \\dfrac{${Vp} \\cdot ${en(Ip)}}{${Vs}}$\n$I_s ${ev(Is, 2)}$ A`, `$I_s = \\dfrac{V_p I_p}{V_s} = \\dfrac{${Vp} \\cdot ${en(Ip)}}{${Vs}}$\n$I_s ${ev(Is, 2)}$ A`),
        });
      }
      if (vr === 3) {
        const C = r.pick([2, 5, 10, 20, 50]);
        const V = r.pick([110, 220, 230]);
        const f = 50;
        const XC = 1 / (2 * PI * f * C * 1e-6);
        const ImA = (V / XC) * 1000;
        return task({
          text: L(`A ${C} µF capacitor is connected to a ${V} V, 50 Hz ac supply. Find the rms current, in mA.${RT(ImA, 1, lang)}`, `${C} µF का एक संधारित्र ${V} V, 50 Hz ac आपूर्ति से जुड़ा है। rms धारा mA में ज्ञात कीजिए।${RT(ImA, 1, lang)}`),
          answer: numM(ImA, 1, [[ImA / 1000, L("Convert A to mA.", "A को mA में बदलिए।")], [V * f * C * 1e-6 * 1000, L("$X_C = 1/(2\\pi f C)$; include 2π.", "$X_C = 1/(2\\pi f C)$; 2π शामिल कीजिए।")], [ImA * Math.SQRT2, L(`${V} V is already an rms value; do not multiply by √2.`, `${V} V पहले से ही rms मान है; √2 से गुणा मत कीजिए।`)]]),
          data: { given: [q("C", C, "\\mu F"), q("V", V, "V"), q("f", 50, "Hz")], find: ["X_C", "I"] },
          hint: L("Find the capacitive reactance, then I = V/X_C.", "धारितीय प्रतिघात ज्ञात कीजिए, फिर I = V/X_C।"),
          formula: ["X_C = \\dfrac{1}{2\\pi f C}", "I = \\dfrac{V}{X_C}"],
          solution: L(`$X_C = \\dfrac{1}{2\\pi \\cdot 50 \\cdot ${C} \\times 10^{-6}} \\approx ${fx(XC, 1)}\\ \\Omega$\n$I = \\dfrac{${V}}{${fx(XC, 1)}} \\approx ${fx(V / XC, 4)}$ A\n$I ${ev(ImA, 1)}$ mA`, `$X_C = \\dfrac{1}{2\\pi \\cdot 50 \\cdot ${C} \\times 10^{-6}} \\approx ${fx(XC, 1)}\\ \\Omega$\n$I = \\dfrac{${V}}{${fx(XC, 1)}} \\approx ${fx(V / XC, 4)}$ A\n$I ${ev(ImA, 1)}$ mA`),
        });
      }
      const it = r.pick(AC_FACTS.slice(2));
      const answer = ch(r, L, it.ok, it.wrong);
      return task({
        text: L(...it.q),
        answer,
        data: { given: [it.g[0]], find: [tx(L, ["statement", "कथन"])] },
        hint: L("Look at how $X_C$ (or the impedance) depends on the frequency.", "देखिए कि $X_C$ (या प्रतिबाधा) आवृत्ति पर कैसे निर्भर है।"),
        formula: ["X_L = \\omega L,\\quad X_C = \\dfrac{1}{\\omega C}", "Z = \\sqrt{R^2 + (X_L - X_C)^2}"],
        solution: L(`${it.sol[0]}\nAnswer: ${it.ok[0]}.`, `${it.sol[1]}\nउत्तर: ${it.ok[1]}।`),
      });
    }
    // level 3
    if (vr === 0) {
      const Lm = r.pick([10, 20, 50, 100, 200, 500]);
      const C = r.pick([1, 2, 5, 10, 20, 50]);
      const f0 = 1 / (2 * PI * Math.sqrt((Lm / 1000) * C * 1e-6));
      return task({
        text: L(`A series LCR circuit has L = ${Lm} mH and C = ${C} µF. Find its resonant frequency, in Hz.${RT(f0, 0, lang)}`, `एक श्रेणी LCR परिपथ में L = ${Lm} mH और C = ${C} µF है। उसकी अनुनादी आवृत्ति Hz में ज्ञात कीजिए।${RT(f0, 0, lang)}`),
        answer: numM(f0, 0, [[2 * PI * f0, L("That is the angular frequency ω₀; divide by 2π to get f₀.", "यह कोणीय आवृत्ति ω₀ है; f₀ के लिए 2π से भाग दीजिए।")], [1 / (2 * PI * Math.sqrt(Lm * C)), L("Convert mH to H and µF to F.", "mH को H में और µF को F में बदलिए।")]]),
        data: { given: [q("L", Lm, "mH"), q("C", C, "\\mu F")], find: ["f_0"] },
        hint: L("At resonance $X_L = X_C$; convert L and C to SI units first.", "अनुनाद पर $X_L = X_C$; पहले L और C को SI मात्रकों में बदलिए।"),
        formula: "f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}",
        solution: L(
          `$LC = ${en(Lm / 1000)} \\cdot ${C} \\times 10^{-6} ${ev((Lm / 1000) * C, 4)} \\times 10^{-6}\\ \\mathrm{s^2}$\n$\\omega_0 = \\dfrac{1}{\\sqrt{LC}} ${ev(2 * PI * f0, 1)}$ rad/s\n$f_0 = \\dfrac{\\omega_0}{2\\pi} ${ev(f0, 0)}$ Hz`,
          `$LC = ${en(Lm / 1000)} \\cdot ${C} \\times 10^{-6} ${ev((Lm / 1000) * C, 4)} \\times 10^{-6}\\ \\mathrm{s^2}$\n$\\omega_0 = \\dfrac{1}{\\sqrt{LC}} ${ev(2 * PI * f0, 1)}$ rad/s\n$f_0 = \\dfrac{\\omega_0}{2\\pi} ${ev(f0, 0)}$ Hz`
        ),
      });
    }
    if (vr === 1) {
      const [a, b, c] = r.pick(TRIPLES);
      const s = r.pick([2, 4, 5, 10]);
      const R = a * s, X = b * s, Z = c * s;
      const XC = r.pick([20, 30, 40, 60]);
      const XL = XC + X;
      const V = r.pick([100, 200, 220, 250]);
      const I = V / Z;
      const P = I * I * R;
      return task({
        text: L(`A series circuit with R = ${R} Ω, $X_L$ = ${XL} Ω and $X_C$ = ${XC} Ω is connected to ${V} V (rms) ac. Find the average power drawn, in W.${RT(P, 1, lang)}`, `R = ${R} Ω, $X_L$ = ${XL} Ω और $X_C$ = ${XC} Ω वाला एक श्रेणी परिपथ ${V} V (rms) ac से जुड़ा है। परिपथ द्वारा ली गई औसत शक्ति W में ज्ञात कीजिए।${RT(P, 1, lang)}`),
        answer: numM(P, 1, [[V * I, L("Average power includes the power factor: $P = V I \\cos\\phi$.", "औसत शक्ति में शक्ति गुणांक भी आता है: $P = V I \\cos\\phi$।")], [(V * V) / R, L("The current is limited by Z, not by R alone.", "धारा केवल R से नहीं, Z से सीमित होती है।")], [I * I * Z, L("Only the resistor dissipates power: use $I^2 R$.", "शक्ति केवल प्रतिरोधक में व्यय होती है: $I^2 R$ लीजिए।")]]),
        data: { given: [q("R", R, "\\Omega"), q("X_L", XL, "\\Omega"), q("X_C", XC, "\\Omega"), q("V_{rms}", V, "V")], find: ["Z", "I", "P"] },
        hint: L("Find Z, then I, then the power in the resistor.", "Z ज्ञात कीजिए, फिर I, फिर प्रतिरोधक में शक्ति।"),
        formula: ["Z = \\sqrt{R^2 + (X_L - X_C)^2}", "P = I_{rms}^2 R = V_{rms} I_{rms} \\cos\\phi"],
        solution: L(
          `$Z = \\sqrt{${R}^2 + ${X}^2} = ${Z}\\ \\Omega$\n$I = \\dfrac{${V}}{${Z}} ${ev(I, 3)}$ A, $\\cos\\phi = \\dfrac{${R}}{${Z}} ${ev(R / Z, 2)}$\n$P = I^2 R ${ev(P, 1)}$ W`,
          `$Z = \\sqrt{${R}^2 + ${X}^2} = ${Z}\\ \\Omega$\n$I = \\dfrac{${V}}{${Z}} ${ev(I, 3)}$ A, $\\cos\\phi = \\dfrac{${R}}{${Z}} ${ev(R / Z, 2)}$\n$P = I^2 R ${ev(P, 1)}$ W`
        ),
      });
    }
    if (vr === 2) {
      const Lm = r.pick([10, 20, 25, 50, 100, 200]);
      const f = r.pick([50, 100, 200, 500, 1000]);
      const C = 1 / (4 * PI * PI * f * f * (Lm / 1000)) * 1e6;
      return task({
        text: L(`A radio circuit has an inductor of ${Lm} mH. What capacitance is needed for resonance at ${f} Hz, in µF?${RT(C, 2, lang)}`, `एक रेडियो परिपथ में ${Lm} mH का प्रेरक है। ${f} Hz पर अनुनाद के लिए कितनी धारिता (µF में) चाहिए?${RT(C, 2, lang)}`),
        answer: numM(C, 2, [[(1 / (f * f * (Lm / 1000))) * 1e6, L("ω = 2πf: square the factor 2π as well.", "ω = 2πf: 2π का भी वर्ग लीजिए।")], [(1 / (4 * PI * PI * f * (Lm / 1000))) * 1e6, L("Use $\\omega^2$: the frequency must be squared.", "$\\omega^2$ लीजिए: आवृत्ति का वर्ग होना चाहिए।")]]),
        data: { given: [q("L", Lm, "mH"), q("f_0", f, "Hz")], find: ["C"] },
        hint: L("Solve $\\omega_0^2 = 1/(LC)$ for C.", "$\\omega_0^2 = 1/(LC)$ को C के लिए हल कीजिए।"),
        formula: "C = \\dfrac{1}{4\\pi^2 f_0^2 L}",
        solution: L(
          `$\\omega_0 = 2\\pi \\cdot ${f} ${ev(2 * PI * f, 1)}$ rad/s\n$C = \\dfrac{1}{\\omega_0^2 L} = \\dfrac{1}{${fx(2 * PI * f, 1)}^2 \\cdot ${en(Lm / 1000)}}$\n$C ${ev(C, 2)}\\ \\mu$F`,
          `$\\omega_0 = 2\\pi \\cdot ${f} ${ev(2 * PI * f, 1)}$ rad/s\n$C = \\dfrac{1}{\\omega_0^2 L} = \\dfrac{1}{${fx(2 * PI * f, 1)}^2 \\cdot ${en(Lm / 1000)}}$\n$C ${ev(C, 2)}\\ \\mu$F`
        ),
      });
    }
    // vr 3: napetost na tuljavi pri resonanci (past: večja od napetosti vira)
    const [Lh, Cu] = r.pick([[0.1, 10], [0.2, 5], [0.5, 2], [0.4, 2.5], [0.25, 4], [0.1, 40], [0.5, 8], [1, 1]]);
    const w0 = 1 / Math.sqrt(Lh * Cu * 1e-6);
    const R = r.pick([10, 20, 25, 40, 50].filter((x) => w0 * Lh >= 2 * x));
    const V = r.pick([10, 20, 50, 100]);
    const I = V / R;
    const VL = I * w0 * Lh;
    return task({
      text: L(`A series LCR circuit (L = ${en(Lh)} H, C = ${en(Cu)} µF, R = ${R} Ω) is driven by a ${V} V (rms) source of variable frequency. At resonance, find the rms voltage across the inductor, in V.${RT(VL, 0, lang)}`, `एक श्रेणी LCR परिपथ (L = ${en(Lh)} H, C = ${en(Cu)} µF, R = ${R} Ω) परिवर्ती आवृत्ति के ${V} V (rms) स्रोत से चलता है। अनुनाद पर प्रेरक के सिरों पर rms वोल्टता V में ज्ञात कीजिए।${RT(VL, 0, lang)}`),
      answer: numM(VL, 0, [[V, L("At resonance $V_L$ is not the source voltage; it is $I X_L$ and can be much larger.", "अनुनाद पर $V_L$ स्रोत वोल्टता नहीं है; यह $I X_L$ है और बहुत अधिक हो सकती है।")], [0, L("$V_L$ and $V_C$ cancel each other, but each one alone is not zero.", "$V_L$ और $V_C$ एक-दूसरे को निरस्त करते हैं, पर अकेले कोई भी शून्य नहीं है।")], [(V / R) * Lh * w0 / (2 * PI), L("$X_L = \\omega_0 L$ with ω₀ in rad/s; do not divide by 2π.", "$X_L = \\omega_0 L$, ω₀ rad/s में; 2π से भाग मत दीजिए।")]]),
      data: { given: [q("L", Lh, "H"), q("C", Cu, "\\mu F"), q("R", R, "\\Omega"), q("V", V, "V")], find: ["\\omega_0", "I", "V_L"] },
      hint: L("At resonance Z = R. Find ω₀, the current, then $V_L = I X_L$.", "अनुनाद पर Z = R। ω₀, धारा, फिर $V_L = I X_L$ ज्ञात कीजिए।"),
      formula: ["\\omega_0 = \\dfrac{1}{\\sqrt{LC}}", "I = \\dfrac{V}{R}", "V_L = I \\omega_0 L"],
      solution: L(
        `$\\omega_0 = \\dfrac{1}{\\sqrt{${en(Lh)} \\cdot ${en(Cu)} \\times 10^{-6}}} = ${en(w0)}$ rad/s\n$I = \\dfrac{${V}}{${R}} = ${en(I)}$ A\n$X_L = \\omega_0 L = ${en(w0 * Lh)}\\ \\Omega$\n$V_L = ${en(I)} \\cdot ${en(w0 * Lh)} ${ev(VL, 0)}$ V (larger than the source voltage)`,
        `$\\omega_0 = \\dfrac{1}{\\sqrt{${en(Lh)} \\cdot ${en(Cu)} \\times 10^{-6}}} = ${en(w0)}$ rad/s\n$I = \\dfrac{${V}}{${R}} = ${en(I)}$ A\n$X_L = \\omega_0 L = ${en(w0 * Lh)}\\ \\Omega$\n$V_L = ${en(I)} \\cdot ${en(w0 * Lh)} ${ev(VL, 0)}$ V (स्रोत वोल्टता से अधिक)`
      ),
    });
  },
};

// ---------- 7. Rotational motion (JEE/NEET, NCERT Class 11) ----------
// Telesa: [en, hi, k = I/(MR²) (števec, imenovalec), LaTeX formula]
const BODIES = [
  ["ring (about its axis)", "वलय (अपने अक्ष के परितः)", [1, 1], "MR^2"],
  ["uniform disc (about its axis)", "एकसमान डिस्क (अपने अक्ष के परितः)", [1, 2], "\\tfrac{1}{2}MR^2"],
  ["solid sphere (about a diameter)", "ठोस गोला (व्यास के परितः)", [2, 5], "\\tfrac{2}{5}MR^2"],
  ["thin spherical shell (about a diameter)", "पतला गोलीय कोश (व्यास के परितः)", [2, 3], "\\tfrac{2}{3}MR^2"],
  ["solid cylinder (about its axis)", "ठोस बेलन (अपने अक्ष के परितः)", [1, 2], "\\tfrac{1}{2}MR^2"],
];
// Kotaleča telesa (brez valja, ki je enak disku).
const ROLLERS = [
  ["ring", "वलय", [1, 1]],
  ["disc", "डिस्क", [1, 2]],
  ["solid sphere", "ठोस गोला", [2, 5]],
  ["hollow sphere", "खोखला गोला", [2, 3]],
];
const kv = ([a, b]) => a / b;

const exiRotation = {
  id: "exi-fiz-rotational-motion",
  topics: [T("rotational-motion")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const vr = r.int(0, level === 3 ? 4 : 3);
    if (level === 1) {
      if (vr === 0) {
        const bi0 = r.int(0, BODIES.length - 1);
        const [bEn, bHi, k, ftex] = BODIES[bi0];
        const M = r.pick([0.5, 1, 2, 2.5, 4, 5]);
        const Rcm = r.pick([10, 20, 25, 40, 50]);
        const R = Rcm / 100;
        const I = kv(k) * M * R * R;
        return task({
          text: L(`Find the moment of inertia of a ${bEn} of mass ${en(M)} kg and radius ${Rcm} cm, in kg m².${RT(I, 4, lang)}`, `${en(M)} kg द्रव्यमान और ${Rcm} cm त्रिज्या ${bi0 === 1 ? "वाली" : "वाले"} ${bHi.replace("गोला", "गोले").replace("पतला", "पतले")} का जड़त्व आघूर्ण kg m² में ज्ञात कीजिए।${RT(I, 4, lang)}`),
          answer: numM(I, 4, [[k[0] === k[1] ? I / 2 : M * R * R, L(k[0] === k[1] ? "For a ring all the mass is at distance R: $I = MR^2$." : `Use the factor for this body: $I = ${ftex}$.`, k[0] === k[1] ? "वलय में पूरा द्रव्यमान दूरी R पर है: $I = MR^2$।" : `इस वस्तु का गुणक लीजिए: $I = ${ftex}$।`)], [kv(k) * M * Rcm * Rcm, L("Convert cm to m before squaring.", "वर्ग करने से पहले cm को m में बदलिए।")], [kv(k) * M * R, L("The radius must be squared.", "त्रिज्या का वर्ग लेना है।")]]),
          data: { given: [q("M", M, "kg"), q("R", Rcm, "cm")], find: ["I"] },
          hint: L("Recall the standard formula for this body and use R in metres.", "इस वस्तु का मानक सूत्र याद कीजिए और R मीटर में लीजिए।"),
          formula: `I = ${ftex}`,
          solution: L(`$R = ${en(R)}$ m\n$I = ${ftex === "MR^2" ? "" : ftex.replace("MR^2", "") + " \\cdot "}${en(M)} \\cdot ${en(R)}^2 ${ev(I, 4)}$ kg m²`, `$R = ${en(R)}$ m\n$I = ${ftex === "MR^2" ? "" : ftex.replace("MR^2", "") + " \\cdot "}${en(M)} \\cdot ${en(R)}^2 ${ev(I, 4)}$ kg m²`),
        });
      }
      if (vr === 1) {
        const I = r.pick([0.2, 0.5, 0.8, 1.2, 2, 2.5, 4]);
        const tau = r.pick([1, 2, 3, 4, 5, 6, 10]);
        const al = tau / I;
        return task({
          text: L(`A torque of ${tau} N m acts on a wheel whose moment of inertia is ${en(I)} kg m². Find its angular acceleration, in rad/s².${RT(al, 2, lang)}`, `${en(I)} kg m² जड़त्व आघूर्ण वाले एक पहिए पर ${tau} N m का बल आघूर्ण लगता है। उसका कोणीय त्वरण rad/s² में ज्ञात कीजिए।${RT(al, 2, lang)}`),
          answer: numM(al, 2, [[tau * I, L("$\\alpha = \\tau / I$; you multiplied.", "$\\alpha = \\tau / I$; आपने गुणा कर दिया।")], [I / tau, L("You inverted the ratio: $\\alpha = \\tau / I$.", "आपने अनुपात उल्टा कर दिया: $\\alpha = \\tau / I$।")]]),
          data: { given: [q("\\tau", tau, "N\\,m"), q("I", I, "kg\\,m^2")], find: ["\\alpha"] },
          hint: L("This is Newton's second law for rotation.", "यह घूर्णन के लिए न्यूटन का दूसरा नियम है।"),
          formula: "\\tau = I \\alpha",
          solution: L(`$\\alpha = \\dfrac{\\tau}{I} = \\dfrac{${tau}}{${en(I)}}$\n$\\alpha ${ev(al, 2)}$ rad/s²`, `$\\alpha = \\dfrac{\\tau}{I} = \\dfrac{${tau}}{${en(I)}}$\n$\\alpha ${ev(al, 2)}$ rad/s²`),
        });
      }
      if (vr === 2) {
        const I = r.pick([0.1, 0.2, 0.4, 0.5, 1, 2]);
        const w = r.pick([5, 10, 12, 15, 20, 30]);
        const K = 0.5 * I * w * w;
        return task({
          text: L(`A flywheel with moment of inertia ${en(I)} kg m² spins at ${w} rad/s. Find its rotational kinetic energy, in J.`, `${en(I)} kg m² जड़त्व आघूर्ण वाला एक गतिपालक चक्र ${w} rad/s से घूम रहा है। उसकी घूर्णी गतिज ऊर्जा J में ज्ञात कीजिए।`),
          answer: numM(K, 2, [[I * w * w, L("Do not forget the factor ½.", "गुणक ½ मत भूलिए।")], [0.5 * I * w, L("The angular speed must be squared.", "कोणीय वेग का वर्ग लेना है।")]]),
          data: { given: [q("I", I, "kg\\,m^2"), q("\\omega", w, "rad/s")], find: ["K"] },
          hint: L("It is like ½mv², with I in place of m and ω in place of v.", "यह ½mv² जैसा है, m के स्थान पर I और v के स्थान पर ω।"),
          formula: "K = \\tfrac{1}{2} I \\omega^2",
          solution: L(`$K = \\tfrac{1}{2} \\cdot ${en(I)} \\cdot ${w}^2$\n$K = ${en(K)}$ J`, `$K = \\tfrac{1}{2} \\cdot ${en(I)} \\cdot ${w}^2$\n$K = ${en(K)}$ J`),
        });
      }
      const M = r.pick([0.3, 0.6, 1.2, 1.5, 2, 3]);
      const lcm = r.pick([40, 50, 60, 80, 100, 120]);
      const l = lcm / 100;
      const end = r.int(0, 1) === 1;
      const I = (M * l * l) / (end ? 3 : 12);
      return task({
        text: L(`A thin uniform rod of mass ${en(M)} kg and length ${lcm} cm rotates about an axis perpendicular to it through its ${end ? "end" : "centre"}. Find its moment of inertia, in kg m².${RT(I, 4, lang)}`, `${en(M)} kg द्रव्यमान और ${lcm} cm लंबाई की पतली एकसमान छड़ अपने ${end ? "सिरे" : "केंद्र"} से गुजरने वाले लंबवत अक्ष के परितः घूमती है। उसका जड़त्व आघूर्ण kg m² में ज्ञात कीजिए।${RT(I, 4, lang)}`),
        answer: numM(I, 4, [[(M * l * l) / (end ? 12 : 3), L(end ? "About the end it is $ML^2/3$; $ML^2/12$ is about the centre." : "About the centre it is $ML^2/12$; $ML^2/3$ is about the end.", end ? "सिरे के परितः यह $ML^2/3$ है; $ML^2/12$ केंद्र के परितः है।" : "केंद्र के परितः यह $ML^2/12$ है; $ML^2/3$ सिरे के परितः है।")], [(M * lcm * lcm) / (end ? 3 : 12), L("Convert the length to metres.", "लंबाई को मीटर में बदलिए।")]]),
        data: { given: [q("M", M, "kg"), q("L", lcm, "cm")], find: ["I"] },
        hint: L("Check where the axis passes: through the centre or through an end.", "देखिए अक्ष कहाँ से गुजरता है: केंद्र से या सिरे से।"),
        formula: end ? "I = \\dfrac{ML^2}{3}" : "I = \\dfrac{ML^2}{12}",
        solution: L(`$L = ${en(l)}$ m\n$I = \\dfrac{${en(M)} \\cdot ${en(l)}^2}{${end ? 3 : 12}} ${ev(I, 4)}$ kg m²`, `$L = ${en(l)}$ m\n$I = \\dfrac{${en(M)} \\cdot ${en(l)}^2}{${end ? 3 : 12}} ${ev(I, 4)}$ kg m²`),
      });
    }
    if (level === 2) {
      if (vr === 0) {
        // izrek o vzporednih oseh
        const cases = [
          { en: "a uniform disc about an axis perpendicular to its plane through a point on its rim", hi: "एकसमान डिस्क, उसके तल के लंबवत और परिधि के एक बिंदु से गुजरने वाले अक्ष के परितः", cm: [1, 2], d: 1, ctex: "\\tfrac{1}{2}MR^2" },
          { en: "a ring about an axis perpendicular to its plane through a point on the ring", hi: "वलय, उसके तल के लंबवत और वलय के एक बिंदु से गुजरने वाले अक्ष के परितः", cm: [1, 1], d: 1, ctex: "MR^2" },
          { en: "a solid sphere about a tangent to its surface", hi: "ठोस गोला, उसके पृष्ठ की स्पर्शरेखा के परितः", cm: [2, 5], d: 1, ctex: "\\tfrac{2}{5}MR^2" },
          { en: "a thin spherical shell about a tangent to its surface", hi: "पतला गोलीय कोश, उसके पृष्ठ की स्पर्शरेखा के परितः", cm: [2, 3], d: 1, ctex: "\\tfrac{2}{3}MR^2" },
        ];
        const c = r.pick(cases);
        const M = r.pick([0.5, 1, 2, 3, 4]);
        const Rcm = r.pick([10, 20, 30, 40, 50]);
        const R = Rcm / 100;
        const Icm = kv(c.cm) * M * R * R;
        const I = Icm + M * R * R;
        return task({
          text: L(`Find the moment of inertia of ${c.en}. Mass ${en(M)} kg, radius ${Rcm} cm. Give it in kg m².${RT(I, 4, lang)}`, `${c.hi} जड़त्व आघूर्ण ज्ञात कीजिए। द्रव्यमान ${en(M)} kg, त्रिज्या ${Rcm} cm। उत्तर kg m² में दीजिए।${RT(I, 4, lang)}`),
          answer: numM(I, 4, [[Icm, L("This is about the axis through the centre; add $Md^2$ for the shifted axis.", "यह केंद्र से गुजरने वाले अक्ष के परितः है; खिसके अक्ष के लिए $Md^2$ जोड़िए।")], [M * R * R, L("Add the moment of inertia about the centre of mass too.", "द्रव्यमान केंद्र के परितः जड़त्व आघूर्ण भी जोड़िए।")], [Icm + M * R, L("The distance between the axes must be squared: $Md^2$.", "अक्षों के बीच की दूरी का वर्ग लेना है: $Md^2$।")]]),
          data: { given: [q("M", M, "kg"), q("R", Rcm, "cm"), q("d", "R")], find: ["I"] },
          hint: L("The new axis is parallel to an axis through the centre, at distance R from it.", "नया अक्ष केंद्र से गुजरने वाले अक्ष के समांतर है और उससे R दूरी पर है।"),
          formula: ["I = I_{cm} + M d^2", `I_{cm} = ${c.ctex}`],
          solution: L(
            `$I_{cm} = ${c.ctex} ${ev(Icm, 4)}$ kg m²\n$Md^2 = ${en(M)} \\cdot ${en(R)}^2 ${ev(M * R * R, 4)}$ kg m²\n$I ${ev(I, 4)}$ kg m²`,
            `$I_{cm} = ${c.ctex} ${ev(Icm, 4)}$ kg m²\n$Md^2 = ${en(M)} \\cdot ${en(R)}^2 ${ev(M * R * R, 4)}$ kg m²\n$I ${ev(I, 4)}$ kg m²`
          ),
        });
      }
      if (vr === 1) {
        const I1 = r.pick([2, 2.4, 3, 3.6, 4, 5]);
        const f = r.pick([0.4, 0.5, 0.6, 0.75]);
        const I2 = rd(I1 * f, 2);
        const n1 = r.pick([1, 1.5, 2, 2.5, 3]);
        const n2 = (I1 * n1) / I2;
        return task({
          text: L(`A figure skater spins at ${en(n1)} rev/s with arms stretched out (I = ${en(I1)} kg m²). Pulling the arms in reduces I to ${en(I2)} kg m². Find the new rate of spin, in rev/s.${RT(n2, 2, lang)}`, `एक स्केटर बाँहें फैलाकर ${en(n1)} चक्कर/s से घूम रहा है (I = ${en(I1)} kg m²)। बाँहें समेटने पर I घटकर ${en(I2)} kg m² हो जाता है। घूमने की नई दर चक्कर/s में ज्ञात कीजिए।${RT(n2, 2, lang)}`),
          answer: numM(n2, 2, [[(I2 * n1) / I1, L("Smaller I means faster spin: $I_1\\omega_1 = I_2\\omega_2$.", "कम I का अर्थ तेज़ घूमना: $I_1\\omega_1 = I_2\\omega_2$।")], [n1 * Math.sqrt(I1 / I2), L("Angular momentum, not kinetic energy, is conserved here.", "यहाँ गतिज ऊर्जा नहीं, कोणीय संवेग संरक्षित है।")]]),
          data: { given: [q("I_1", I1, "kg\\,m^2"), q("n_1", n1, "rev/s"), q("I_2", I2, "kg\\,m^2")], find: ["n_2"] },
          hint: L("No external torque acts about the vertical axis.", "ऊर्ध्वाधर अक्ष के परितः कोई बाह्य बल आघूर्ण नहीं लगता।"),
          formula: "I_1 \\omega_1 = I_2 \\omega_2",
          solution: L(`$L$ is conserved: $I_1 n_1 = I_2 n_2$\n$n_2 = \\dfrac{${en(I1)} \\cdot ${en(n1)}}{${en(I2)}} ${ev(n2, 2)}$ rev/s`, `$L$ संरक्षित: $I_1 n_1 = I_2 n_2$\n$n_2 = \\dfrac{${en(I1)} \\cdot ${en(n1)}}{${en(I2)}} ${ev(n2, 2)}$ चक्कर/s`),
        });
      }
      if (vr === 2) {
        const M = r.pick([2, 4, 5, 8, 10]);
        const Rm = r.pick([0.1, 0.2, 0.25, 0.4, 0.5]);
        const F = r.pick([5, 10, 15, 20, 25]);
        const t = r.pick([2, 3, 4, 5]);
        const I = 0.5 * M * Rm * Rm;
        const al = (F * Rm) / I;
        const w = al * t;
        return task({
          text: L(`A rope is wound round a uniform disc-shaped pulley (mass ${M} kg, radius ${en(Rm)} m) free to turn about its axis. ${who} pulls the rope with a steady ${F} N. Starting from rest, find the angular speed after ${t} s, in rad/s.${RT(w, 1, lang)}`, `अपने अक्ष के परितः घूमने को स्वतंत्र एकसमान डिस्क-आकार की घिरनी (द्रव्यमान ${M} kg, त्रिज्या ${en(Rm)} m) पर रस्सी लिपटी है। ${who} रस्सी को ${F} N के स्थिर बल से ${ni % 2 ? "खींचती" : "खींचता"} है। विरामावस्था से शुरू करके ${t} s बाद कोणीय वेग rad/s में ज्ञात कीजिए।${RT(w, 1, lang)}`),
          answer: numM(w, 1, [[al, L("That is the angular acceleration; multiply by the time.", "यह कोणीय त्वरण है; समय से गुणा कीजिए।")], [((F * Rm) / (M * Rm * Rm)) * t, L("A disc has $I = \\frac{1}{2}MR^2$, not $MR^2$.", "डिस्क के लिए $I = \\frac{1}{2}MR^2$ है, $MR^2$ नहीं।")], [(F / I) * t, L("Torque is $\\tau = F R$; include the radius.", "बल आघूर्ण $\\tau = F R$ है; त्रिज्या शामिल कीजिए।")]]),
          data: { given: [q("M", M, "kg"), q("R", Rm, "m"), q("F", F, "N"), q("t", t, "s")], find: ["\\alpha", "\\omega"] },
          hint: L("Torque = F × R, then α = τ/I, then ω = αt.", "बल आघूर्ण = F × R, फिर α = τ/I, फिर ω = αt।"),
          formula: ["\\tau = F R = I\\alpha", "I = \\tfrac{1}{2}MR^2", "\\omega = \\alpha t"],
          solution: L(
            `$\\tau = ${F} \\cdot ${en(Rm)} = ${en(F * Rm)}$ N m, $I = \\tfrac{1}{2} \\cdot ${M} \\cdot ${en(Rm)}^2 = ${en(I)}$ kg m²\n$\\alpha = \\dfrac{${en(F * Rm)}}{${en(I)}} ${ev(al, 2)}$ rad/s²\n$\\omega = \\alpha t ${ev(w, 1)}$ rad/s`,
            `$\\tau = ${F} \\cdot ${en(Rm)} = ${en(F * Rm)}$ N m, $I = \\tfrac{1}{2} \\cdot ${M} \\cdot ${en(Rm)}^2 = ${en(I)}$ kg m²\n$\\alpha = \\dfrac{${en(F * Rm)}}{${en(I)}} ${ev(al, 2)}$ rad/s²\n$\\omega = \\alpha t ${ev(w, 1)}$ rad/s`
          ),
        });
      }
      // vr 3: gmota položena na vrteč disk
      const M = r.pick([2, 4, 5, 6, 10]);
      const Rm = r.pick([0.2, 0.3, 0.4, 0.5]);
      const m = r.pick([0.2, 0.5, 1, 1.5]);
      const w1 = r.pick([10, 12, 15, 20, 30]);
      const I = 0.5 * M * Rm * Rm;
      const w2 = (I * w1) / (I + m * Rm * Rm);
      return task({
        text: L(`A uniform disc (mass ${M} kg, radius ${en(Rm)} m) rotates freely at ${w1} rad/s about its axis. ${who} gently places a ${en(m)} kg lump of clay on its rim, where it sticks. Find the new angular speed, in rad/s.${RT(w2, 2, lang)}`, `एक एकसमान डिस्क (द्रव्यमान ${M} kg, त्रिज्या ${en(Rm)} m) अपने अक्ष के परितः ${w1} rad/s से स्वतंत्र रूप से घूम रही है। ${who} उसकी परिधि पर धीरे से ${en(m)} kg का मिट्टी का लोंदा ${ni % 2 ? "रखती" : "रखता"} है, जो चिपक जाता है। नया कोणीय वेग rad/s में ज्ञात कीजिए।${RT(w2, 2, lang)}`),
        answer: numM(w2, 2, [[(M * w1) / (M + m), L("Use moments of inertia, not just masses: the disc has $\\frac{1}{2}MR^2$.", "केवल द्रव्यमान नहीं, जड़त्व आघूर्ण लीजिए: डिस्क का $\\frac{1}{2}MR^2$ है।")], [(M * Rm * Rm * w1) / (M * Rm * Rm + m * Rm * Rm), L("The disc has $I = \\frac{1}{2}MR^2$, not $MR^2$.", "डिस्क के लिए $I = \\frac{1}{2}MR^2$ है, $MR^2$ नहीं।")], [w1, L("Adding mass at the rim increases I, so ω must fall.", "परिधि पर द्रव्यमान जोड़ने से I बढ़ता है, अतः ω घटता है।")]]),
        data: { given: [q("M", M, "kg"), q("R", Rm, "m"), q("m", m, "kg"), q("\\omega_1", w1, "rad/s")], find: ["\\omega_2"] },
        hint: L("Angular momentum about the axis is conserved; the clay adds $mR^2$ to I.", "अक्ष के परितः कोणीय संवेग संरक्षित है; मिट्टी I में $mR^2$ जोड़ती है।"),
        formula: ["I_1 \\omega_1 = I_2 \\omega_2", "I_2 = \\tfrac{1}{2}MR^2 + mR^2"],
        solution: L(
          `$I_1 = \\tfrac{1}{2} \\cdot ${M} \\cdot ${en(Rm)}^2 = ${en(I)}$ kg m²\n$I_2 = ${en(I)} + ${en(m)} \\cdot ${en(Rm)}^2 = ${en(I + m * Rm * Rm)}$ kg m²\n$\\omega_2 = \\dfrac{${en(I)} \\cdot ${w1}}{${en(I + m * Rm * Rm)}} ${ev(w2, 2)}$ rad/s`,
          `$I_1 = \\tfrac{1}{2} \\cdot ${M} \\cdot ${en(Rm)}^2 = ${en(I)}$ kg m²\n$I_2 = ${en(I)} + ${en(m)} \\cdot ${en(Rm)}^2 = ${en(I + m * Rm * Rm)}$ kg m²\n$\\omega_2 = \\dfrac{${en(I)} \\cdot ${w1}}{${en(I + m * Rm * Rm)}} ${ev(w2, 2)}$ rad/s`
        ),
      });
    }
    // level 3
    if (vr === 0) {
      const k = r.int(0, ROLLERS.length - 1);
      const [bEn, bHi, kk] = ROLLERS[k];
      const th = r.pick([30, 37, 53]);
      const s = { 30: 0.5, 37: 0.6, 53: 0.8 }[th];
      const g = r.pick([9.8, 10]);
      const a = (g * s) / (1 + kv(kk));
      return task({
        text: L(`A ${bEn} rolls without slipping down an incline making ${th}° with the horizontal${th === 30 ? "" : ` (take sin ${th}° = ${en(s)})`}. Find its acceleration, in m/s². (g = ${en(g)} m/s²)${RT(a, 2, lang)}`, `एक ${bHi} क्षैतिज से ${th}° पर झुके आनत तल पर बिना फिसले ${k === 1 ? "लुढ़कती" : "लुढ़कता"} है${th === 30 ? "" : ` (sin ${th}° = ${en(s)} लीजिए)`}। उसका त्वरण m/s² में ज्ञात कीजिए। (g = ${en(g)} m/s²)${RT(a, 2, lang)}`),
        answer: numM(a, 2, [[g * s, L("That is for sliding without friction; rolling also needs rotational energy.", "यह बिना घर्षण फिसलने का है; लुढ़कने में घूर्णी ऊर्जा भी लगती है।")], [(g * s) / (1 + 1 / kv(kk)), L("The denominator is $1 + I/(mR^2)$; you inverted the ratio.", "हर $1 + I/(mR^2)$ है; आपने अनुपात उल्टा कर दिया।")], [(g * s) * kv(kk), L("Use $a = g\\sin\\theta / (1 + I/(mR^2))$.", "$a = g\\sin\\theta / (1 + I/(mR^2))$ लीजिए।")]]),
        data: { given: [q("\\theta", `${th}^\\circ`), q("g", g, "m/s^2")], find: ["a"] },
        hint: L("Find $I/(mR^2)$ for this body first.", "पहले इस वस्तु के लिए $I/(mR^2)$ ज्ञात कीजिए।"),
        formula: "a = \\dfrac{g \\sin\\theta}{1 + \\dfrac{I}{mR^2}}",
        solution: L(
          `$\\dfrac{I}{mR^2} = ${fracTex(kk[0], kk[1])}$\n$a = \\dfrac{${en(g)} \\cdot ${en(s)}}{1 + ${fracTex(kk[0], kk[1])}} = \\dfrac{${en(g * s)}}{${fx(1 + kv(kk), 3)}}$\n$a ${ev(a, 2)}$ m/s²`,
          `$\\dfrac{I}{mR^2} = ${fracTex(kk[0], kk[1])}$\n$a = \\dfrac{${en(g)} \\cdot ${en(s)}}{1 + ${fracTex(kk[0], kk[1])}} = \\dfrac{${en(g * s)}}{${fx(1 + kv(kk), 3)}}$\n$a ${ev(a, 2)}$ m/s²`
        ),
      });
    }
    if (vr === 1) {
      const k = r.int(0, ROLLERS.length - 1);
      const [bEn, bHi, kk] = ROLLERS[k];
      const h = r.pick([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5]);
      const g = r.pick([9.8, 10]);
      const v = Math.sqrt((2 * g * h) / (1 + kv(kk)));
      return task({
        text: L(`${who} releases a ${bEn} from rest at a height of ${en(h)} m on a slope. It rolls down without slipping. Find its speed at the bottom, in m/s. (g = ${en(g)} m/s²)${RT(v, 2, lang)}`, `${who} एक ${bHi.replace("खोखला", "खोखले").replace("गोला", "गोले")} को ढलान पर ${en(h)} m ऊँचाई से विरामावस्था से ${ni % 2 ? "छोड़ती" : "छोड़ता"} है। ${k === 1 ? "वह बिना फिसले नीचे लुढ़कती है" : "वह बिना फिसले नीचे लुढ़कता है"}। तल पर उसकी चाल m/s में ज्ञात कीजिए। (g = ${en(g)} m/s²)${RT(v, 2, lang)}`),
        answer: numM(v, 2, [[Math.sqrt(2 * g * h), L("Part of the energy goes into rotation: include $I/(mR^2)$.", "ऊर्जा का कुछ भाग घूर्णन में जाता है: $I/(mR^2)$ शामिल कीजिए।")], [(2 * g * h) / (1 + kv(kk)), L("This is $v^2$; take the square root.", "यह $v^2$ है; वर्गमूल लीजिए।")]]),
        data: { given: [q("h", h, "m"), q("g", g, "m/s^2")], find: ["v"] },
        hint: L("Energy conservation: mgh = ½mv² + ½Iω², with ω = v/R.", "ऊर्जा संरक्षण: mgh = ½mv² + ½Iω², जहाँ ω = v/R।"),
        formula: "v = \\sqrt{\\dfrac{2gh}{1 + \\dfrac{I}{mR^2}}}",
        solution: L(
          `$mgh = \\tfrac{1}{2}mv^2\\left(1 + ${fracTex(kk[0], kk[1])}\\right)$\n$v^2 = \\dfrac{2 \\cdot ${en(g)} \\cdot ${en(h)}}{${fx(1 + kv(kk), 3)}} ${ev((2 * g * h) / (1 + kv(kk)), 3)}$\n$v ${ev(v, 2)}$ m/s`,
          `$mgh = \\tfrac{1}{2}mv^2\\left(1 + ${fracTex(kk[0], kk[1])}\\right)$\n$v^2 = \\dfrac{2 \\cdot ${en(g)} \\cdot ${en(h)}}{${fx(1 + kv(kk), 3)}} ${ev((2 * g * h) / (1 + kv(kk)), 3)}$\n$v ${ev(v, 2)}$ m/s`
        ),
      });
    }
    if (vr === 2) {
      const k = r.int(0, ROLLERS.length - 1);
      const [bEn, bHi, kk] = ROLLERS[k];
      const [p, qq] = kk;
      const askRot = r.int(0, 1) === 1;
      const n = askRot ? p : qq;
      const d = p + qq;
      const ans = fractionM(n, d, askRot
        ? [[p / qq, L("That is rotational : translational; the question asks for a fraction of the total.", "यह घूर्णी : स्थानांतरीय अनुपात है; प्रश्न कुल का भाग पूछता है।")], [qq / d, L("That is the translational fraction.", "यह स्थानांतरीय भाग है।")]]
        : [[p / d, L("That is the rotational fraction.", "यह घूर्णी भाग है।")], [0.5, L("The split is equal only for a ring.", "बराबर बँटवारा केवल वलय के लिए होता है।")]]);
      return task({
        text: L(`A ${bEn} rolls without slipping on a level floor. What fraction of its total kinetic energy is ${askRot ? "rotational" : "translational"}? Give a fraction.`, `एक ${bHi} समतल फ़र्श पर बिना फिसले ${k === 1 ? "लुढ़क रही" : "लुढ़क रहा"} है। उसकी कुल गतिज ऊर्जा का कितना भाग ${askRot ? "घूर्णी" : "स्थानांतरीय"} है? भिन्न के रूप में दीजिए।`),
        answer: ans,
        data: { given: ["v = \\omega R"], find: [askRot ? "\\dfrac{K_{rot}}{K}" : "\\dfrac{K_{tr}}{K}"] },
        hint: L("Write $K_{rot} = \\frac{1}{2}I\\omega^2$ using ω = v/R, and compare with $\\frac{1}{2}mv^2$.", "ω = v/R लेकर $K_{rot} = \\frac{1}{2}I\\omega^2$ लिखिए और $\\frac{1}{2}mv^2$ से तुलना कीजिए।"),
        formula: ["K_{tr} = \\tfrac{1}{2}mv^2", "K_{rot} = \\tfrac{1}{2}I\\omega^2 = \\tfrac{1}{2}mv^2 \\cdot \\dfrac{I}{mR^2}"],
        solution: L(
          `$K_{rot} : K_{tr} = \\dfrac{I}{mR^2} = ${fracTex(p, qq)}$, i.e. $${p} : ${qq}$\n$\\dfrac{K_{${askRot ? "rot" : "tr"}}}{K} = \\dfrac{${n}}{${p} + ${qq}} = ${fracTex(n, d)}$`,
          `$K_{rot} : K_{tr} = \\dfrac{I}{mR^2} = ${fracTex(p, qq)}$, अर्थात $${p} : ${qq}$\n$\\dfrac{K_{${askRot ? "rot" : "tr"}}}{K} = \\dfrac{${n}}{${p} + ${qq}} = ${fracTex(n, d)}$`
        ),
      });
    }
    if (vr === 3) {
      // dva diska se spojita
      const I1 = r.pick([0.1, 0.2, 0.3, 0.4, 0.5]);
      const I2 = r.pick([0.1, 0.2, 0.3, 0.6].filter((v) => v !== I1));
      const w1 = r.pick([20, 30, 40, 50, 60]);
      const w2 = r.pick([0, 10, 20].filter((v) => v < w1));
      const w = (I1 * w1 + I2 * w2) / (I1 + I2);
      const loss = 0.5 * I1 * w1 * w1 + 0.5 * I2 * w2 * w2 - 0.5 * (I1 + I2) * w * w;
      return task({
        text: L(`Disc A (I = ${en(I1)} kg m²) spins at ${w1} rad/s and coaxial disc B (I = ${en(I2)} kg m²) ${w2 ? `spins at ${w2} rad/s in the same sense` : "is at rest"}. They are pressed together and move as one. Find the loss of kinetic energy, in J.${RT(loss, 2, lang)}`, `डिस्क A (I = ${en(I1)} kg m²) ${w1} rad/s से और समाक्ष डिस्क B (I = ${en(I2)} kg m²) ${w2 ? `उसी दिशा में ${w2} rad/s से घूम रही है` : "विराम में है"}। दोनों को दबाकर जोड़ दिया जाता है और वे एक साथ घूमती हैं। गतिज ऊर्जा में हानि J में ज्ञात कीजिए।${RT(loss, 2, lang)}`),
        answer: numM(loss, 2, [[0, L("Angular momentum is conserved, but kinetic energy is not: the discs rub until they move together.", "कोणीय संवेग संरक्षित है, पर गतिज ऊर्जा नहीं: डिस्कें साथ घूमने तक रगड़ती हैं।")], [0.5 * (I1 + I2) * w * w, L("That is the final kinetic energy; subtract it from the initial.", "यह अंतिम गतिज ऊर्जा है; इसे प्रारंभिक से घटाइए।")], [0.5 * I1 * w1 * w1 + 0.5 * I2 * w2 * w2 - 0.5 * (I1 + I2) * ((w1 + w2) / 2) ** 2, L("The common ω is not the simple average; use $I_1\\omega_1 + I_2\\omega_2 = (I_1 + I_2)\\omega$.", "उभयनिष्ठ ω साधारण औसत नहीं है; $I_1\\omega_1 + I_2\\omega_2 = (I_1 + I_2)\\omega$ लीजिए।")]]),
        data: { given: [q("I_1", I1, "kg\\,m^2"), q("\\omega_1", w1, "rad/s"), q("I_2", I2, "kg\\,m^2"), q("\\omega_2", w2, "rad/s")], find: ["\\omega", "\\Delta K"] },
        hint: L("First find the common angular speed from conservation of angular momentum.", "पहले कोणीय संवेग संरक्षण से उभयनिष्ठ कोणीय वेग ज्ञात कीजिए।"),
        formula: ["I_1\\omega_1 + I_2\\omega_2 = (I_1 + I_2)\\omega", "K = \\tfrac{1}{2}I\\omega^2"],
        solution: L(
          `$\\omega = \\dfrac{${en(I1)} \\cdot ${w1} + ${en(I2)} \\cdot ${w2}}{${en(I1 + I2)}} ${ev(w, 3)}$ rad/s\n$K_i ${ev(0.5 * I1 * w1 * w1 + 0.5 * I2 * w2 * w2, 3)}$ J, $K_f = \\tfrac{1}{2} \\cdot ${en(I1 + I2)} \\cdot \\omega^2 ${ev(0.5 * (I1 + I2) * w * w, 3)}$ J\n$\\Delta K = K_i - K_f ${ev(loss, 2)}$ J`,
          `$\\omega = \\dfrac{${en(I1)} \\cdot ${w1} + ${en(I2)} \\cdot ${w2}}{${en(I1 + I2)}} ${ev(w, 3)}$ rad/s\n$K_i ${ev(0.5 * I1 * w1 * w1 + 0.5 * I2 * w2 * w2, 3)}$ J, $K_f = \\tfrac{1}{2} \\cdot ${en(I1 + I2)} \\cdot \\omega^2 ${ev(0.5 * (I1 + I2) * w * w, 3)}$ J\n$\\Delta K = K_i - K_f ${ev(loss, 2)}$ J`
        ),
      });
    }
    // vr 4: dirka po klancu (koncept)
    const first = r.int(0, 1) === 1;
    const sorted = ROLLERS.map((b, i) => [kv(b[2]), i]).sort((x, y) => x[0] - y[0]);
    const ci = first ? sorted[0][1] : sorted[sorted.length - 1][1];
    const opt = (i) => [ROLLERS[i][0].replace(/^./, (c) => c.toUpperCase()), ROLLERS[i][1]];
    const wrong = ROLLERS.map((b, i) => i).filter((i) => i !== ci).map((i) => [opt(i), [`Its $I/(mR^2) = ${fracTex(...ROLLERS[i][2])}$, so its acceleration is ${first ? "smaller" : "larger"} than that of the ${ROLLERS[ci][0]}.`, `इसका $I/(mR^2) = ${fracTex(...ROLLERS[i][2])}$ है, अतः इसका त्वरण ${ROLLERS[ci][1]} से ${first ? "कम" : "अधिक"} है।`]]);
    const answer = ch(r, L, opt(ci), wrong);
    return task({
      text: L(`A ring, a disc, a solid sphere and a hollow sphere of the same mass and radius are released together from rest at the top of an incline and roll without slipping. Which reaches the bottom ${first ? "first" : "last"}?`, `समान द्रव्यमान और त्रिज्या वाले एक वलय, एक डिस्क, एक ठोस गोले और एक खोखले गोले को आनत तल के शीर्ष से एक साथ विरामावस्था से छोड़ा जाता है और वे बिना फिसले लुढ़कते हैं। तल पर ${first ? "सबसे पहले" : "सबसे बाद में"} कौन पहुँचेगा?`),
      answer,
      data: { given: [`\\dfrac{I}{mR^2}:\\ 1,\\ \\tfrac{1}{2},\\ \\tfrac{2}{5},\\ \\tfrac{2}{3}`], find: ["a"] },
      hint: L("The acceleration depends only on $I/(mR^2)$, not on mass or radius.", "त्वरण केवल $I/(mR^2)$ पर निर्भर है, द्रव्यमान या त्रिज्या पर नहीं।"),
      formula: "a = \\dfrac{g \\sin\\theta}{1 + \\dfrac{I}{mR^2}}",
      solution: L(
        `Smaller $I/(mR^2)$ → larger a. Order: solid sphere $\\tfrac{2}{5}$ < disc $\\tfrac{1}{2}$ < hollow sphere $\\tfrac{2}{3}$ < ring $1$.\nAnswer: ${opt(ci)[0]}.`,
        `कम $I/(mR^2)$ → अधिक a। क्रम: ठोस गोला $\\tfrac{2}{5}$ < डिस्क $\\tfrac{1}{2}$ < खोखला गोला $\\tfrac{2}{3}$ < वलय $1$।\nउत्तर: ${opt(ci)[1]}।`
      ),
    });
  },
};

// ---------- 8. Semiconductors and logic gates (NCERT Class 12; logic gates: JEE Main, NEET, ISC) ----------
const GATES = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  NAND: (a, b) => 1 - (a & b),
  NOR: (a, b) => 1 - (a | b),
};
const GATE_RULE = {
  AND: ["AND gives 1 only when both inputs are 1.", "AND का निर्गत 1 तभी होता है जब दोनों निवेश 1 हों।"],
  OR: ["OR gives 1 when at least one input is 1.", "OR का निर्गत 1 होता है जब कम से कम एक निवेश 1 हो।"],
  NAND: ["NAND is AND followed by NOT: it gives 0 only when both inputs are 1.", "NAND, AND के बाद NOT है: इसका निर्गत 0 तभी होता है जब दोनों निवेश 1 हों।"],
  NOR: ["NOR is OR followed by NOT: it gives 1 only when both inputs are 0.", "NOR, OR के बाद NOT है: इसका निर्गत 1 तभी होता है जब दोनों निवेश 0 हों।"],
  NOT: ["NOT inverts its input.", "NOT अपने निवेश को उलट देता है।"],
};
const an = (g) => (g === "AND" || g === "OR" ? "an" : "a");
const GATE_TEX = { AND: "A \\cdot B", OR: "A + B", NAND: "\\overline{A \\cdot B}", NOR: "\\overline{A + B}" };
const SEMI_FACTS = [
  {
    q: ["A p-n junction diode is forward biased. What happens to the depletion layer and the potential barrier?", "एक p-n संधि डायोड अग्रदिशिक बायस में है। ह्रासी परत और विभव प्राचीर का क्या होता है?"],
    g: ["p \\to +,\\ n \\to -", "p \\to +,\\ n \\to -"],
    ok: ["Both decrease, so a large current flows", "दोनों घटते हैं, इसलिए अधिक धारा बहती है"],
    wrong: [
      [["Both increase, so almost no current flows", "दोनों बढ़ते हैं, इसलिए लगभग कोई धारा नहीं बहती"], ["That happens in reverse bias (p to −, n to +).", "ऐसा पश्चदिशिक बायस में होता है (p ऋण से, n धन से)।"]],
      [["The depletion layer widens but the barrier falls", "ह्रासी परत चौड़ी होती है पर प्राचीर घटता है"], ["The width and the barrier change together; in forward bias both decrease.", "चौड़ाई और प्राचीर साथ-साथ बदलते हैं; अग्रदिशिक बायस में दोनों घटते हैं।"]],
      [["Nothing changes; only the temperature rises", "कुछ नहीं बदलता; केवल ताप बढ़ता है"], ["The applied voltage opposes the built-in barrier, so the barrier is lowered.", "लगाई गई वोल्टता अंतर्निहित प्राचीर का विरोध करती है, अतः प्राचीर कम होता है।"]],
    ],
    sol: ["In forward bias the applied voltage opposes the barrier potential: the depletion layer narrows and the barrier height falls.", "अग्रदिशिक बायस में लगाई गई वोल्टता प्राचीर विभव का विरोध करती है: ह्रासी परत पतली होती है और प्राचीर की ऊँचाई घटती है।"],
  },
  {
    q: ["Pure silicon is doped with a small amount of phosphorus (a pentavalent element). What kind of semiconductor is formed?", "शुद्ध सिलिकॉन में थोड़ा फॉस्फोरस (पंचसंयोजी तत्व) अपमिश्रित किया जाता है। किस प्रकार का अर्धचालक बनता है?"],
    g: ["Si + P", "Si + P"],
    ok: ["n-type: electrons are the majority carriers", "n-प्रकार: इलेक्ट्रॉन बहुसंख्यक वाहक हैं"],
    wrong: [
      [["p-type: holes are the majority carriers", "p-प्रकार: होल बहुसंख्यक वाहक हैं"], ["A trivalent dopant (B, Al, In) makes p-type; P has 5 valence electrons.", "त्रिसंयोजी अपमिश्रक (B, Al, In) p-प्रकार बनाता है; P के 5 संयोजी इलेक्ट्रॉन हैं।"]],
      [["n-type: holes are the majority carriers", "n-प्रकार: होल बहुसंख्यक वाहक हैं"], ["In n-type material the extra electrons from the donor are the majority carriers.", "n-प्रकार में दाता से मिले अतिरिक्त इलेक्ट्रॉन बहुसंख्यक वाहक होते हैं।"]],
      [["Still intrinsic: electrons and holes stay equal", "अब भी नैज: इलेक्ट्रॉन और होल बराबर रहते हैं"], ["Doping adds extra electrons, so $n_e > n_h$.", "अपमिश्रण से अतिरिक्त इलेक्ट्रॉन आते हैं, अतः $n_e > n_h$।"]],
    ],
    sol: ["Each P atom uses 4 electrons for bonds and donates the 5th: n-type, electrons are majority carriers.", "प्रत्येक P परमाणु 4 इलेक्ट्रॉन बंधों में लगाता है और 5वाँ दान करता है: n-प्रकार, इलेक्ट्रॉन बहुसंख्यक वाहक।"],
  },
  {
    q: ["Why does a p-n junction diode act as a rectifier?", "p-n संधि डायोड दिष्टकारी के रूप में क्यों कार्य करता है?"],
    g: ["R_{forward} \\ll R_{reverse}", "R_{forward} \\ll R_{reverse}"],
    ok: ["It conducts easily in forward bias but hardly at all in reverse bias", "यह अग्रदिशिक बायस में आसानी से चालन करता है पर पश्चदिशिक बायस में लगभग नहीं"],
    wrong: [
      [["It conducts equally in both directions", "यह दोनों दिशाओं में बराबर चालन करता है"], ["Then the ac would pass unchanged; rectification needs one-way conduction.", "तब ac बिना बदले गुजर जाती; दिष्टकरण के लिए एक दिशा में चालन चाहिए।"]],
      [["It stores charge like a capacitor and releases it slowly", "यह संधारित्र की तरह आवेश संचित कर धीरे-धीरे छोड़ता है"], ["Smoothing is done by a filter capacitor; the diode's job is one-way conduction.", "समतलन फ़िल्टर संधारित्र करता है; डायोड का कार्य एक दिशा में चालन है।"]],
      [["It conducts only in reverse bias", "यह केवल पश्चदिशिक बायस में चालन करता है"], ["Reverse bias gives only a tiny current (until breakdown); the large current is in forward bias.", "पश्चदिशिक बायस में (भंजन तक) केवल बहुत कम धारा बहती है; अधिक धारा अग्रदिशिक बायस में।"]],
    ],
    sol: ["Low resistance in forward bias and very high resistance in reverse bias let current flow one way only.", "अग्रदिशिक बायस में कम और पश्चदिशिक बायस में बहुत अधिक प्रतिरोध से धारा केवल एक दिशा में बहती है।"],
  },
];

const exiSemi = {
  id: "exi-fiz-semiconductors",
  topics: [T("semiconductors-and-logic-gates")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const vr = r.int(0, 3);
    const gnames = Object.keys(GATES);
    if (level === 1) {
      if (vr === 0 || vr === 1) {
        const g = r.pick([...gnames, "NOT"]);
        const A = r.int(0, 1);
        const B = r.int(0, 1);
        const y = g === "NOT" ? 1 - A : GATES[g](A, B);
        return task({
          text: g === "NOT"
            ? L(`The input of a NOT gate is A = ${A}. What is the output Y? Enter 0 or 1.`, `एक NOT गेट का निवेश A = ${A} है। निर्गत Y क्या है? 0 या 1 लिखिए।`)
            : L(`The inputs of ${an(g)} ${g} gate are A = ${A} and B = ${B}. What is the output Y? Enter 0 or 1.`, `एक ${g} गेट के निवेश A = ${A} और B = ${B} हैं। निर्गत Y क्या है? 0 या 1 लिखिए।`),
          answer: numM(y, 0, [[1 - y, L(`Check the truth table: ${GATE_RULE[g][0]}`, `सत्यमान सारणी जाँचिए: ${GATE_RULE[g][1]}`)]]),
          data: { given: g === "NOT" ? [q("A", A)] : [q("A", A), q("B", B)], find: ["Y"] },
          hint: L("Recall the Boolean expression of the gate.", "गेट का बूलियन व्यंजक याद कीजिए।"),
          formula: g === "NOT" ? "Y = \\overline{A}" : `Y = ${GATE_TEX[g]}`,
          solution: L(`${GATE_RULE[g][0]}\n$Y = ${y}$`, `${GATE_RULE[g][1]}\n$Y = ${y}$`),
        });
      }
      if (vr === 2) {
        const f = r.pick([50, 60, 100, 400]);
        const full = r.int(0, 1) === 1;
        const fo = full ? 2 * f : f;
        return task({
          text: L(`The input to a ${full ? "full-wave" : "half-wave"} rectifier is an ac voltage of frequency ${f} Hz. What is the fundamental frequency of the output (ripple frequency), in Hz?`, `एक ${full ? "पूर्णतरंग" : "अर्धतरंग"} दिष्टकारी का निवेश ${f} Hz आवृत्ति की ac वोल्टता है। निर्गत की मूल आवृत्ति (उर्मिका आवृत्ति) Hz में कितनी है?`),
          answer: numM(fo, 0, full ? [[f, L("A full-wave rectifier uses both halves of each cycle: two pulses per cycle.", "पूर्णतरंग दिष्टकारी हर चक्र के दोनों अर्धभागों का उपयोग करता है: प्रति चक्र दो स्पंद।")], [f / 2, L("Rectifying does not lower the frequency.", "दिष्टकरण आवृत्ति कम नहीं करता।")]] : [[2 * f, L("A half-wave rectifier passes only one half of each cycle: one pulse per cycle.", "अर्धतरंग दिष्टकारी हर चक्र का केवल एक अर्धभाग गुजारता है: प्रति चक्र एक स्पंद।")], [f / 2, L("Rectifying does not lower the frequency.", "दिष्टकरण आवृत्ति कम नहीं करता।")]]),
          data: { given: [q("f_{in}", f, "Hz")], find: ["f_{out}"] },
          hint: L("Count the output pulses in one input cycle.", "एक निवेशी चक्र में निर्गत स्पंद गिनिए।"),
          formula: full ? "f_{out} = 2 f_{in}" : "f_{out} = f_{in}",
          solution: L(`${full ? "Two" : "One"} output pulse${full ? "s" : ""} per input cycle\n$f_{out} = ${full ? `2 \\cdot ${f} = ` : ""}${fo}$ Hz`, `प्रति निवेशी चक्र ${full ? "दो" : "एक"} निर्गत स्पंद\n$f_{out} = ${full ? `2 \\cdot ${f} = ` : ""}${fo}$ Hz`),
        });
      }
      const it = r.pick(SEMI_FACTS);
      const answer = ch(r, L, it.ok, it.wrong);
      return task({
        text: L(...it.q),
        answer,
        data: { given: [it.g[0]], find: [tx(L, ["result", "परिणाम"])] },
        hint: L("Think about the majority carriers and the barrier at the junction.", "बहुसंख्यक वाहकों और संधि के प्राचीर के बारे में सोचिए।"),
        formula: false,
        solution: L(`${it.sol[0]}\nAnswer: ${it.ok[0]}.`, `${it.sol[1]}\nउत्तर: ${it.ok[1]}।`),
      });
    }
    if (level === 2) {
      if (vr === 0 || vr === 1) {
        const g1 = r.pick(gnames);
        const g2 = r.pick([...gnames, "NOT"]);
        const A = r.int(0, 1), B = r.int(0, 1), C = r.int(0, 1);
        const y1 = GATES[g1](A, B);
        const y = g2 === "NOT" ? 1 - y1 : GATES[g2](y1, C);
        const wrongFirst = g2 === "NOT" ? y1 : GATES[g2](1 - y1, C);
        return task({
          text: g2 === "NOT"
            ? L(`Inputs A = ${A} and B = ${B} go into ${an(g1)} ${g1} gate, whose output goes into a NOT gate. What is the final output Y? Enter 0 or 1.`, `निवेश A = ${A} और B = ${B} एक ${g1} गेट में जाते हैं, जिसका निर्गत एक NOT गेट में जाता है। अंतिम निर्गत Y क्या है? 0 या 1 लिखिए।`)
            : L(`Inputs A = ${A} and B = ${B} go into ${an(g1)} ${g1} gate. Its output and C = ${C} go into ${an(g2)} ${g2} gate. What is the output Y? Enter 0 or 1.`, `निवेश A = ${A} और B = ${B} एक ${g1} गेट में जाते हैं। उसका निर्गत और C = ${C} एक ${g2} गेट में जाते हैं। निर्गत Y क्या है? 0 या 1 लिखिए।`),
          answer: numM(y, 0, [[wrongFirst !== y ? wrongFirst : 1 - y, L(`Find the first output carefully: ${GATE_RULE[g1][0]}`, `पहला निर्गत ध्यान से ज्ञात कीजिए: ${GATE_RULE[g1][1]}`)]]),
          data: { given: g2 === "NOT" ? [q("A", A), q("B", B)] : [q("A", A), q("B", B), q("C", C)], find: ["Y_1", "Y"] },
          hint: L("Work gate by gate: find the output of the first gate, then use it as an input of the second.", "गेट-दर-गेट चलिए: पहले गेट का निर्गत ज्ञात कीजिए, फिर उसे दूसरे गेट का निवेश बनाइए।"),
          formula: g2 === "NOT" ? `Y = \\overline{${GATE_TEX[g1]}}` : `Y_1 = ${GATE_TEX[g1]}`,
          solution: L(
            `First gate (${g1}): $Y_1 = ${y1}$\nSecond gate (${g2}) with ${g2 === "NOT" ? `input ${y1}` : `inputs ${y1} and ${C}`}: $Y = ${y}$`,
            `पहला गेट (${g1}): $Y_1 = ${y1}$\nदूसरा गेट (${g2}), ${g2 === "NOT" ? `निवेश ${y1}` : `निवेश ${y1} और ${C}`}: $Y = ${y}$`
          ),
        });
      }
      if (vr === 2) {
        const V = r.pick([2, 3, 4.5, 5, 6, 9, 12]);
        const R = r.pick([100, 150, 200, 220, 330, 470, 1000]);
        const I = ((V - 0.7) / R) * 1000;
        return task({
          text: L(`A silicon diode (forward voltage drop 0.7 V) is connected in forward bias in series with a ${R} Ω resistor across a ${en(V)} V battery. Find the current, in mA.${RT(I, 2, lang)}`, `एक सिलिकॉन डायोड (अग्र वोल्टता पात 0.7 V) अग्रदिशिक बायस में ${R} Ω प्रतिरोधक के साथ श्रेणी में ${en(V)} V की बैटरी से जुड़ा है। धारा mA में ज्ञात कीजिए।${RT(I, 2, lang)}`),
          answer: numM(I, 2, [[(V / R) * 1000, L("Subtract the 0.7 V that drops across the diode.", "डायोड पर गिरने वाले 0.7 V घटाइए।")], [(V - 0.7) / R, L("Convert A to mA.", "A को mA में बदलिए।")], [((V + 0.7) / R) * 1000, L("The diode takes away 0.7 V; it does not add it.", "डायोड 0.7 V लेता है; वह इसे जोड़ता नहीं।")]]),
          data: { given: [q("V", V, "V"), q("V_D", 0.7, "V"), q("R", R, "\\Omega")], find: ["I"] },
          hint: L("The voltage across the resistor is the battery voltage minus the diode drop.", "प्रतिरोधक पर वोल्टता = बैटरी वोल्टता − डायोड पात।"),
          formula: "I = \\dfrac{V - V_D}{R}",
          solution: L(`$V_R = ${en(V)} - 0.7 = ${en(V - 0.7)}$ V\n$I = \\dfrac{${en(V - 0.7)}}{${R}} ${ev(I / 1000, 5)}$ A\n$I ${ev(I, 2)}$ mA`, `$V_R = ${en(V)} - 0.7 = ${en(V - 0.7)}$ V\n$I = \\dfrac{${en(V - 0.7)}}{${R}} ${ev(I / 1000, 5)}$ A\n$I ${ev(I, 2)}$ mA`),
        });
      }
      // vr 3: čas med impulzi
      const f = r.pick([50, 60, 100, 200]);
      const full = r.int(0, 1) === 1;
      const tms = 1000 / (full ? 2 * f : f);
      return task({
        text: L(`The mains frequency is ${f} Hz. In a ${full ? "full-wave" : "half-wave"} rectifier, what is the time between successive output pulses, in ms?${RT(tms, 2, lang)}`, `मुख्य आपूर्ति की आवृत्ति ${f} Hz है। एक ${full ? "पूर्णतरंग" : "अर्धतरंग"} दिष्टकारी में क्रमागत निर्गत स्पंदों के बीच समय ms में कितना है?${RT(tms, 2, lang)}`),
        answer: numM(tms, 2, [[full ? 1000 / f : 500 / f, L(full ? "A full-wave rectifier gives two pulses per cycle." : "A half-wave rectifier gives one pulse per cycle.", full ? "पूर्णतरंग दिष्टकारी प्रति चक्र दो स्पंद देता है।" : "अर्धतरंग दिष्टकारी प्रति चक्र एक स्पंद देता है।")], [1 / (full ? 2 * f : f), L("Convert seconds to milliseconds.", "सेकंड को मिलीसेकंड में बदलिए।")]]),
        data: { given: [q("f", f, "Hz")], find: ["f_{out}", "T"] },
        hint: L("Find the output pulse frequency first; the time between pulses is its reciprocal.", "पहले निर्गत स्पंद आवृत्ति ज्ञात कीजिए; स्पंदों के बीच समय उसका व्युत्क्रम है।"),
        formula: ["f_{out} = " + (full ? "2f" : "f"), "T = \\dfrac{1}{f_{out}}"],
        solution: L(`$f_{out} = ${full ? 2 * f : f}$ Hz\n$T = \\dfrac{1}{${full ? 2 * f : f}}$ s $${ev(tms, 2)}$ ms`, `$f_{out} = ${full ? 2 * f : f}$ Hz\n$T = \\dfrac{1}{${full ? 2 * f : f}}$ s $${ev(tms, 2)}$ ms`),
      });
    }
    // level 3
    if (vr === 0) {
      // ekvivalentna vrata
      const COMBOS = [
        { en: "both inputs of a NAND gate are joined together", hi: "एक NAND गेट के दोनों निवेश आपस में जोड़ दिए जाते हैं", eq: "NOT", why: "$Y = \\overline{A \\cdot A} = \\overline{A}$" },
        { en: "both inputs of a NOR gate are joined together", hi: "एक NOR गेट के दोनों निवेश आपस में जोड़ दिए जाते हैं", eq: "NOT", why: "$Y = \\overline{A + A} = \\overline{A}$" },
        { en: "the output of a NAND gate is passed through a NOT gate", hi: "एक NAND गेट का निर्गत एक NOT गेट से गुजारा जाता है", eq: "AND", why: "$Y = \\overline{\\overline{A \\cdot B}} = A \\cdot B$" },
        { en: "the output of a NOR gate is passed through a NOT gate", hi: "एक NOR गेट का निर्गत एक NOT गेट से गुजारा जाता है", eq: "OR", why: "$Y = \\overline{\\overline{A + B}} = A + B$" },
        { en: "A and B each pass through a NOT gate, and the two outputs go into a NAND gate", hi: "A और B अलग-अलग NOT गेट से गुजरते हैं, और दोनों निर्गत एक NAND गेट में जाते हैं", eq: "OR", why: "$Y = \\overline{\\overline{A} \\cdot \\overline{B}} = A + B$ (De Morgan)" },
        { en: "A and B each pass through a NOT gate, and the two outputs go into a NOR gate", hi: "A और B अलग-अलग NOT गेट से गुजरते हैं, और दोनों निर्गत एक NOR गेट में जाते हैं", eq: "AND", why: "$Y = \\overline{\\overline{A} + \\overline{B}} = A \\cdot B$ (De Morgan)" },
        { en: "the output of an AND gate is passed through a NOT gate", hi: "एक AND गेट का निर्गत एक NOT गेट से गुजारा जाता है", eq: "NAND", why: "$Y = \\overline{A \\cdot B}$" },
        { en: "the output of an OR gate is passed through a NOT gate", hi: "एक OR गेट का निर्गत एक NOT गेट से गुजारा जाता है", eq: "NOR", why: "$Y = \\overline{A + B}$" },
      ];
      const c = r.pick(COMBOS);
      const all = ["AND", "OR", "NOT", "NAND", "NOR"];
      const GW = {
        AND: ["AND gives 1 only for A = B = 1; check the truth table of the circuit for A = B = 1.", "AND का निर्गत केवल A = B = 1 पर 1 होता है; परिपथ की सत्यमान सारणी A = B = 1 पर जाँचिए।"],
        OR: ["OR gives 0 only for A = B = 0; check the circuit for A = B = 0.", "OR का निर्गत केवल A = B = 0 पर 0 होता है; परिपथ को A = B = 0 पर जाँचिए।"],
        NOT: ["A NOT gate has only one input; check whether the circuit really uses one input.", "NOT गेट का केवल एक निवेश होता है; जाँचिए कि परिपथ में सच में एक ही निवेश है या नहीं।"],
        NAND: ["NAND gives 0 only for A = B = 1; check the circuit for A = B = 1.", "NAND का निर्गत केवल A = B = 1 पर 0 होता है; परिपथ को A = B = 1 पर जाँचिए।"],
        NOR: ["NOR gives 1 only for A = B = 0; check the circuit for A = B = 0.", "NOR का निर्गत केवल A = B = 0 पर 1 होता है; परिपथ को A = B = 0 पर जाँचिए।"],
      };
      const wrong = all.filter((x) => x !== c.eq).map((x) => [[`${x} gate`, `${x} गेट`], GW[x]]);
      const answer = ch(r, L, [`${c.eq} gate`, `${c.eq} गेट`], wrong);
      return task({
        text: L(`In a circuit, ${c.en}. The whole circuit is equivalent to which single gate?`, `एक परिपथ में ${c.hi}। पूरा परिपथ किस एकल गेट के तुल्य है?`),
        answer,
        data: { given: ["Y = " + c.why.replace(/\$/g, "").split(" = ")[1].replace(/ \(De Morgan\)$/, "")], find: [tx(L, ["gate", "गेट"])] },
        hint: L("Write the Boolean expression of the circuit and simplify it (double NOT cancels; De Morgan's laws).", "परिपथ का बूलियन व्यंजक लिखिए और सरल कीजिए (दो NOT कट जाते हैं; डी मॉर्गन के नियम)।"),
        formula: ["\\overline{\\overline{X}} = X", "\\overline{A \\cdot B} = \\overline{A} + \\overline{B},\\quad \\overline{A + B} = \\overline{A} \\cdot \\overline{B}"],
        solution: L(`${c.why}\nAnswer: ${c.eq} gate.`, `${c.why.replace("(De Morgan)", "(डी मॉर्गन)")}\nउत्तर: ${c.eq} गेट।`),
      });
    }
    if (vr === 1) {
      // dvostopenjsko vezje s štirimi vhodi
      const g1 = r.pick(gnames);
      const g2 = r.pick(gnames);
      const g3 = r.pick(gnames);
      const A = r.int(0, 1), B = r.int(0, 1), C = r.int(0, 1), D = r.int(0, 1);
      const y1 = GATES[g1](A, B);
      const y2 = GATES[g2](C, D);
      const y = GATES[g3](y1, y2);
      return task({
        text: L(`A = ${A}, B = ${B} feed ${an(g1)} ${g1} gate; C = ${C}, D = ${D} feed ${an(g2)} ${g2} gate. The two outputs feed ${an(g3)} ${g3} gate. Find the final output Y (0 or 1).`, `A = ${A}, B = ${B} एक ${g1} गेट में; C = ${C}, D = ${D} एक ${g2} गेट में जाते हैं। दोनों निर्गत एक ${g3} गेट में जाते हैं। अंतिम निर्गत Y (0 या 1) ज्ञात कीजिए।`),
        answer: numM(y, 0, [[1 - y, L(`Recheck each stage. ${GATE_RULE[g3][0]}`, `हर चरण दोबारा जाँचिए। ${GATE_RULE[g3][1]}`)]]),
        data: { given: [q("A", A), q("B", B), q("C", C), q("D", D)], find: ["Y_1", "Y_2", "Y"] },
        hint: L("Find the two first-stage outputs separately, then the last gate.", "पहले चरण के दोनों निर्गत अलग-अलग ज्ञात कीजिए, फिर अंतिम गेट।"),
        formula: `Y = ${g3}(Y_1, Y_2)`.replace(/(\w+)\(/, "\\text{$1}("),
        solution: L(
          `$Y_1$ (${g1} of ${A}, ${B}) $= ${y1}$\n$Y_2$ (${g2} of ${C}, ${D}) $= ${y2}$\n$Y$ (${g3} of ${y1}, ${y2}) $= ${y}$`,
          `$Y_1$ (${A}, ${B} का ${g1}) $= ${y1}$\n$Y_2$ (${C}, ${D} का ${g2}) $= ${y2}$\n$Y$ (${y1}, ${y2} का ${g3}) $= ${y}$`
        ),
      });
    }
    if (vr === 2) {
      // manjšinski nosilci: n_e n_h = n_i²
      const ni = 1.5e16;
      const mant = r.pick([1, 2, 2.5, 4.5, 5, 7.5]);
      const ex = r.pick([20, 21, 22]);
      const Nd = mant * 10 ** ex;
      const nType = r.int(0, 1) === 1;
      const nm = (ni * ni) / Nd;
      const k = Math.floor(Math.log10(nm) + 1e-9);
      const val = nm / 10 ** k;
      return task({
        text: L(`Pure silicon has $n_i = 1.5 \\times 10^{16}\\ \\mathrm{m^{-3}}$. It is doped with $${en(mant)} \\times 10^{${ex}}\\ \\mathrm{m^{-3}}$ ${nType ? "donor (pentavalent)" : "acceptor (trivalent)"} atoms. Find the ${nType ? "hole" : "electron"} density in units of $10^{${k}}\\ \\mathrm{m^{-3}}$.${RT(val, 2, lang)}`, `शुद्ध सिलिकॉन में $n_i = 1.5 \\times 10^{16}\\ \\mathrm{m^{-3}}$ है। इसमें $${en(mant)} \\times 10^{${ex}}\\ \\mathrm{m^{-3}}$ ${nType ? "दाता (पंचसंयोजी)" : "ग्राही (त्रिसंयोजी)"} परमाणु अपमिश्रित किए जाते हैं। ${nType ? "होल" : "इलेक्ट्रॉन"} घनत्व $10^{${k}}\\ \\mathrm{m^{-3}}$ के मात्रकों में ज्ञात कीजिए।${RT(val, 2, lang)}`),
        answer: numM(val, 2, [[1.5e16 / 10 ** k, L("Doping changes the minority-carrier density: use $n_e n_h = n_i^2$.", "अपमिश्रण अल्पसंख्यक वाहक घनत्व बदल देता है: $n_e n_h = n_i^2$ लीजिए।")], [(ni / Nd) / 10 ** k, L("Square $n_i$: $n_e n_h = n_i^2$.", "$n_i$ का वर्ग लीजिए: $n_e n_h = n_i^2$।")]]),
        data: { given: [q("n_i", "1.5 \\times 10^{16}", "m^{-3}"), q(nType ? "N_D" : "N_A", `${en(mant)} \\times 10^{${ex}}`, "m^{-3}")], find: [nType ? "n_h" : "n_e"] },
        hint: L(`The majority-carrier density is about equal to the dopant density; then use the mass-action law.`, "बहुसंख्यक वाहक घनत्व लगभग अपमिश्रक घनत्व के बराबर होता है; फिर द्रव्य-अनुपाती क्रिया नियम लीजिए।"),
        formula: "n_e n_h = n_i^2",
        solution: L(
          `$${nType ? "n_e" : "n_h"} \\approx ${en(mant)} \\times 10^{${ex}}\\ \\mathrm{m^{-3}}$ (majority carriers)\n$${nType ? "n_h" : "n_e"} = \\dfrac{n_i^2}{${nType ? "n_e" : "n_h"}} = \\dfrac{2.25 \\times 10^{32}}{${en(mant)} \\times 10^{${ex}}}$\n$${nType ? "n_h" : "n_e"} ${ev(val, 2)} \\times 10^{${k}}\\ \\mathrm{m^{-3}}$`,
          `$${nType ? "n_e" : "n_h"} \\approx ${en(mant)} \\times 10^{${ex}}\\ \\mathrm{m^{-3}}$ (बहुसंख्यक वाहक)\n$${nType ? "n_h" : "n_e"} = \\dfrac{n_i^2}{${nType ? "n_e" : "n_h"}} = \\dfrac{2.25 \\times 10^{32}}{${en(mant)} \\times 10^{${ex}}}$\n$${nType ? "n_h" : "n_e"} ${ev(val, 2)} \\times 10^{${k}}\\ \\mathrm{m^{-3}}$`
        ),
      });
    }
    // vr 3: diode orientation in a circuit with two diodes: current through the resistor
    const V = r.pick([5, 6, 9, 10, 12]);
    const R = r.pick([100, 200, 250, 500, 1000]);
    const nOn = r.int(0, 1); // 0: obe diodi v prevodni smeri zaporedno, 1: ena v zaporni
    const I = nOn === 0 ? ((V - 1.4) / R) * 1000 : 0;
    return task({
      text: nOn === 0
        ? L(`Two identical silicon diodes (0.7 V drop each) are in series with a ${R} Ω resistor across a ${V} V battery, both forward biased. Find the current, in mA.${RT(I, 2, lang)}`, `दो सर्वसम सिलिकॉन डायोड (प्रत्येक का पात 0.7 V) ${R} Ω प्रतिरोधक के साथ श्रेणी में ${V} V बैटरी से जुड़े हैं, दोनों अग्रदिशिक बायस में। धारा mA में ज्ञात कीजिए।${RT(I, 2, lang)}`)
        : L(`Two identical silicon diodes are in series with a ${R} Ω resistor across a ${V} V battery; the first is forward biased and the second reverse biased. Treating them as ideal in reverse, find the current, in mA.`, `दो सर्वसम सिलिकॉन डायोड ${R} Ω प्रतिरोधक के साथ श्रेणी में ${V} V बैटरी से जुड़े हैं; पहला अग्रदिशिक और दूसरा पश्चदिशिक बायस में है। पश्चदिशा में उन्हें आदर्श मानकर धारा mA में ज्ञात कीजिए।`),
      answer: numM(I, 2, nOn === 0 ? [[((V - 0.7) / R) * 1000, L("Each diode drops 0.7 V: subtract 1.4 V in total.", "प्रत्येक डायोड पर 0.7 V गिरता है: कुल 1.4 V घटाइए।")], [(V / R) * 1000, L("Subtract the diode drops from the battery voltage.", "बैटरी वोल्टता में से डायोड पात घटाइए।")]] : [[((V - 0.7) / R) * 1000, L("A reverse-biased diode in series blocks the current in the whole loop.", "श्रेणी में पश्चदिशिक बायस डायोड पूरे लूप की धारा रोक देता है।")], [(V / R) * 1000, L("In series, one blocking diode stops the current everywhere.", "श्रेणी क्रम में एक अवरोधक डायोड हर जगह धारा रोक देता है।")]]),
      data: { given: [q("V", V, "V"), q("R", R, "\\Omega"), ...(nOn === 0 ? [q("V_D", 0.7, "V")] : [])], find: ["I"] },
      hint: L("In a series loop the same current passes through every element. Check each diode's bias first.", "श्रेणी लूप में हर अवयव से एक ही धारा बहती है। पहले हर डायोड का बायस जाँचिए।"),
      formula: "I = \\dfrac{V - \\sum V_D}{R}",
      solution: nOn === 0
        ? L(`Both conduct: $V_R = ${V} - 2 \\cdot 0.7 = ${en(V - 1.4)}$ V\n$I = \\dfrac{${en(V - 1.4)}}{${R}}$ A $${ev(I, 2)}$ mA`, `दोनों चालन करते हैं: $V_R = ${V} - 2 \\cdot 0.7 = ${en(V - 1.4)}$ V\n$I = \\dfrac{${en(V - 1.4)}}{${R}}$ A $${ev(I, 2)}$ mA`)
        : L(`The reverse-biased diode does not conduct (ideal: infinite resistance).\nThe loop is in series, so $I = 0$ mA.`, `पश्चदिशिक बायस डायोड चालन नहीं करता (आदर्श: अनंत प्रतिरोध)।\nलूप श्रेणी में है, अतः $I = 0$ mA।`),
    });
  },
};

export const EXAM_IN_FIZ = [exiMirrors, exiPower, exiMachines, exiMoments, exiCalorimetry, exiAC, exiRotation, exiSemi];
