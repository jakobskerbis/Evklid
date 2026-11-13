// Izpitne naloge iz fizike (angleško in hindijsko) za JEE, NEET, gaokao in CBSE: mehanika, nihanje,
// valovanje, toplota, elektrika, magnetizem, optika in moderna fizika.
// Enota je v besedilu (»in m/s«), odgovor je samo število. g = 10 m/s², kot na teh izpitih.
// Dvojezično: gen(level, r, _topic, lang), L = bi(lang); vse naključne izbire so pred izbiro besedil,
// zato isto seme v obeh jezikih da isto nalogo. Angleško besedilo je nespremenjeno.
import { en, num, numM, dq, roundToL, bi, task as baseTask } from "./exam-util.js";

const T = (slug) => `FIZ-EXB/${slug}`;
const G = 10;
const rad = (deg) => (deg * Math.PI) / 180;
// Hindijska rešitev: zadnja vrstica, ki je samo račun, dobi »उत्तर:« (angleška ostane nespremenjena).
const DEV = /[\u0900-\u097F]/;
const task = (o) => {
  if (!DEV.test(o.text)) return baseTask(o);
  const lines = String(o.solution || "").split("\n");
  const last = lines.length - 1;
  if (lines[last].startsWith("$")) lines[last] = "उत्तर: " + lines[last];
  return baseTask({ ...o, solution: lines.join("\n") });
};
const takeG = (L) => L(" (Take $g = 10\\ \\text{m/s}^2$.)", " ($g = 10\\ \\text{m/s}^2$ लीजिए।)");

export const EXAM_FIZ = [
  {
    id: "exf-kinematics",
    topics: [T("kinematics")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const u = r.int(0, 20), a = r.int(1, 6), t = r.int(2, 10);
      if (level === 1) {
        return task({
          text: L(
            `A car starts with a speed of ${u} m/s and accelerates uniformly at ${a} m/s² for ${t} s. What is its final speed, in m/s?`,
            `एक कार की प्रारंभिक चाल ${u} m/s है। वह ${t} s तक ${a} m/s² के एकसमान त्वरण से चलती है। उसकी अंतिम चाल m/s में ज्ञात कीजिए।`,
          ),
          answer: num(u + a * t),
          hint: L("$v = u + at$.", "सूत्र $v = u + at$ का प्रयोग कीजिए।"),
          formula: "v = u + at",
          solution: `$v = ${u} + ${a} \\cdot ${t} = ${u + a * t}\\ \\text{m/s}$`,
        });
      }
      if (level === 2) {
        const s = u * t + 0.5 * a * t * t;
        return task({
          text: L(
            `A body moving at ${u} m/s accelerates uniformly at ${a} m/s². How far does it travel in ${t} s, in meters?`,
            `${u} m/s से गतिमान एक पिंड ${a} m/s² के एकसमान त्वरण से त्वरित होता है। ${t} s में उसके द्वारा तय की गई दूरी मीटर में ज्ञात कीजिए।`,
          ),
          answer: num(s),
          hint: L("$s = ut + \\tfrac12 at^2$.", "सूत्र $s = ut + \\tfrac12 at^2$ का प्रयोग कीजिए।"),
          formula: "s = ut + \\tfrac12 at^2",
          solution: `$s = ${u} \\cdot ${t} + \\tfrac12 \\cdot ${a} \\cdot ${t}^2 = ${en(s)}\\ \\text{m}$`,
        });
      }
      const v = r.int(10, 40), d = r.int(20, 100);
      const dec = (v * v) / (2 * d);
      return task({
        text: L(
          `A train moving at ${v} m/s is brought to rest over a distance of ${d} m with uniform deceleration. What is the magnitude of the deceleration, in m/s²?${roundToL(2, lang)}`,
          `${v} m/s से चल रही एक रेलगाड़ी एकसमान मंदन से ${d} m की दूरी में रुक जाती है। मंदन का परिमाण m/s² में ज्ञात कीजिए।${roundToL(2, lang)}`,
        ),
        answer: num(dec, 2),
        hint: L("$v^2 = u^2 + 2as$ with final speed 0.", "$v^2 = u^2 + 2as$ का प्रयोग कीजिए; अंतिम चाल 0 है।"),
        formula: "v^2 = u^2 + 2as",
        solution: `$0 = ${v}^2 - 2a \\cdot ${d} \\Rightarrow a = \\dfrac{${v * v}}{${2 * d}} \\approx ${en(dec, 2)}\\ \\text{m/s}^2$`,
      });
    },
  },
  {
    id: "exf-projectile",
    topics: [T("projectile-motion")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const gtxt = takeG(L);
      const u = r.pick([10, 20, 30, 40, 50]);
      if (level === 1) {
        const h = r.pick([5, 20, 45, 80, 125]);
        const t = Math.sqrt((2 * h) / G);
        return task({
          text: L(
            `A ball is thrown horizontally at ${u} m/s from the top of a cliff ${h} m high. How far from the foot of the cliff does it land, in meters? (Take $g = 10\\ \\text{m/s}^2$.)`,
            `${h} m ऊँची एक खड़ी चट्टान के शिखर से एक गेंद ${u} m/s की चाल से क्षैतिज दिशा में फेंकी जाती है। गेंद चट्टान के आधार से कितनी दूरी पर गिरती है? मीटर में ज्ञात कीजिए।${gtxt}`,
          ),
          answer: num(u * t),
          hint: L("Find the time of fall from $h = \\tfrac12 g t^2$, then $x = ut$.", "पहले $h = \\tfrac12 g t^2$ से गिरने का समय ज्ञात कीजिए, फिर $x = ut$।"),
          formula: "h = \\tfrac12 g t^2, \\quad x = u t",
          solution: `$t = \\sqrt{2h/g} = \\sqrt{${2 * h}/10} = ${en(t)}\\ \\text{s}$\n$x = ${u} \\cdot ${en(t)} = ${en(u * t)}\\ \\text{m}$`,
        });
      }
      const ang = r.pick([15, 30, 45, 60, 75]);
      if (level === 2) {
        const R = (u * u * Math.sin(rad(2 * ang))) / G;
        return task({
          text: L(
            `A projectile is launched at ${u} m/s at ${ang}° above the horizontal on level ground. What is its horizontal range, in meters? (Take $g = 10\\ \\text{m/s}^2$.)${roundToL(1, lang)}`,
            `समतल भूमि पर एक प्रक्षेप्य को क्षैतिज से ${ang}° के कोण पर ${u} m/s की चाल से प्रक्षेपित किया जाता है। उसकी क्षैतिज परास मीटर में ज्ञात कीजिए।${gtxt}${roundToL(1, lang)}`,
          ),
          answer: num(R, 1),
          hint: L("$R = \\dfrac{u^2 \\sin 2\\theta}{g}$.", "परास का सूत्र: $R = \\dfrac{u^2 \\sin 2\\theta}{g}$।"),
          formula: "R = \\dfrac{u^2 \\sin 2\\theta}{g}",
          solution: `$R = \\dfrac{${u}^2 \\cdot \\sin ${2 * ang}^\\circ}{10} \\approx ${en(R, 1)}\\ \\text{m}$`,
        });
      }
      const H = (u * Math.sin(rad(ang))) ** 2 / (2 * G);
      return task({
        text: L(
          `A projectile is launched at ${u} m/s at ${ang}° above the horizontal. What is the maximum height it reaches, in meters? (Take $g = 10\\ \\text{m/s}^2$.)${roundToL(1, lang)}`,
          `एक प्रक्षेप्य को क्षैतिज से ${ang}° के कोण पर ${u} m/s की चाल से प्रक्षेपित किया जाता है। वह जिस अधिकतम ऊँचाई तक पहुँचता है, उसे मीटर में ज्ञात कीजिए।${gtxt}${roundToL(1, lang)}`,
        ),
        answer: num(H, 1),
        hint: L("Only the vertical component matters: $H = \\dfrac{(u\\sin\\theta)^2}{2g}$.", "यहाँ केवल वेग का ऊर्ध्वाधर घटक काम आता है: $H = \\dfrac{(u\\sin\\theta)^2}{2g}$।"),
        formula: "H = \\dfrac{u^2 \\sin^2\\theta}{2g}",
        solution: `$H = \\dfrac{(${u} \\sin ${ang}^\\circ)^2}{2 \\cdot 10} \\approx ${en(H, 1)}\\ \\text{m}$`,
      });
    },
  },
  {
    id: "exf-newton",
    topics: [T("laws-of-motion")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const gtxt = takeG(L);
      if (level === 1) {
        const m = r.int(2, 20), F = r.int(10, 100);
        return task({
          text: L(
            `A net force of ${F} N acts on a ${m} kg block on a frictionless surface. What is its acceleration, in m/s²?${roundToL(2, lang)}`,
            `घर्षणरहित सतह पर रखे ${m} kg के एक गुटके पर ${F} N का नेट बल लगता है। उसका त्वरण m/s² में ज्ञात कीजिए।${roundToL(2, lang)}`,
          ),
          answer: num(F / m, 2),
          hint: L("$F = ma$.", "न्यूटन का दूसरा नियम: $F = ma$।"),
          formula: "F = ma",
          solution: `$a = F/m = ${F}/${m} \\approx ${en(F / m, 2)}\\ \\text{m/s}^2$`,
        });
      }
      if (level === 2) {
        const m = r.int(2, 10), F = r.int(30, 80), mu = r.pick([0.1, 0.2, 0.25, 0.3]);
        const a = (F - mu * m * G) / m;
        if (a <= 0) return null;
        return task({
          text: L(
            `A horizontal force of ${F} N pulls a ${m} kg box across a floor. The coefficient of kinetic friction is ${mu}. What is the box's acceleration, in m/s²? (Take $g = 10\\ \\text{m/s}^2$.)${roundToL(2, lang)}`,
            `${F} N का एक क्षैतिज बल ${m} kg के एक बक्से को फर्श पर खींचता है। गतिज घर्षण गुणांक ${mu} है। बक्से का त्वरण m/s² में ज्ञात कीजिए।${gtxt}${roundToL(2, lang)}`,
          ),
          answer: num(a, 2),
          hint: L("Net force = applied force − friction, with friction $= \\mu m g$.", "नेट बल = लगाया गया बल − घर्षण बल, जहाँ घर्षण बल $= \\mu m g$।"),
          formula: "ma = F - \\mu m g",
          solution: `$F_f = ${mu} \\cdot ${m} \\cdot 10 = ${en(mu * m * G)}\\ \\text{N}$\n$a = \\dfrac{${F} - ${en(mu * m * G)}}{${m}} \\approx ${en(a, 2)}\\ \\text{m/s}^2$`,
        });
      }
      const m1 = r.int(2, 8), m2 = r.int(1, 8);
      const a = ((m1 - m2) * G) / (m1 + m2);
      if (m1 === m2) return null;
      const big = Math.max(m1, m2), small = Math.min(m1, m2);
      const acc = ((big - small) * G) / (big + small), T2 = (2 * big * small * G) / (big + small);
      void a;
      return task({
        text: L(
          `Two masses of ${big} kg and ${small} kg hang on either side of a light, frictionless pulley (Atwood machine). What is the tension in the string, in newtons? (Take $g = 10\\ \\text{m/s}^2$.)${roundToL(2, lang)}`,
          `${big} kg और ${small} kg के दो द्रव्यमान एक हल्की, घर्षणरहित घिरनी के दोनों ओर लटके हैं (एटवुड मशीन)। डोरी में तनाव न्यूटन में ज्ञात कीजिए।${gtxt}${roundToL(2, lang)}`,
        ),
        answer: num(T2, 2),
        hint: L("First find the acceleration $a = \\dfrac{(m_1 - m_2)g}{m_1 + m_2}$, then $T = m_2(g + a)$.", "पहले त्वरण $a = \\dfrac{(m_1 - m_2)g}{m_1 + m_2}$ ज्ञात कीजिए, फिर $T = m_2(g + a)$।"),
        formula: "T = \\dfrac{2 m_1 m_2 g}{m_1 + m_2}",
        solution: `$a = \\dfrac{(${big} - ${small}) \\cdot 10}{${big + small}} \\approx ${en(acc, 2)}\\ \\text{m/s}^2$\n$T = \\dfrac{2 \\cdot ${big} \\cdot ${small} \\cdot 10}{${big + small}} \\approx ${en(T2, 2)}\\ \\text{N}$`,
      });
    },
  },
  {
    id: "exf-energy",
    topics: [T("work-energy-and-power")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const gtxt = takeG(L);
      const half = L("You forgot the factor ½.", "आप ½ का गुणक भूल गए।");
      if (level === 1) {
        const v = r.int(0, 4);
        if (v === 0) {
          const m = r.pick([0.5, 1, 2, 3, 4, 5, 8, 10]), vv = r.int(2, 20);
          const E = 0.5 * m * vv * vv;
          return task({
            text: L(
              `What is the kinetic energy of a ${en(m)} kg object moving at ${vv} m/s, in joules?`,
              `${vv} m/s की चाल से गतिमान ${en(m)} kg की एक वस्तु की गतिज ऊर्जा जूल में ज्ञात कीजिए।`,
            ),
            answer: numM(E, null, [[m * vv * vv, half], [0.5 * m * vv, L("The speed must be squared.", "चाल का वर्ग लेना आवश्यक है।")]]),
            data: { given: [dq("m", m, "kg"), dq("v", vv, "m/s")], find: ["E_k"] },
            hint: L("Kinetic energy depends on the square of the speed.", "गतिज ऊर्जा चाल के वर्ग पर निर्भर करती है।"),
            formula: "E_k = \\tfrac12 m v^2",
            solution: `$E_k = \\tfrac12 \\cdot ${en(m)} \\cdot ${vv}^2$\n$E_k = ${en(E)}\\ \\text{J}$`,
          });
        }
        if (v === 1) {
          const m = r.pick([0.2, 0.5, 2, 5, 12, 40, 60]), h = r.pick([1.5, 2, 3, 5, 8, 12, 20]);
          const E = m * G * h;
          return task({
            text: L(
              `A ${en(m)} kg object is lifted ${en(h)} m. By how much does its gravitational potential energy increase, in joules?${gtxt}`,
              `${en(m)} kg की एक वस्तु को ${en(h)} m ऊपर उठाया जाता है। उसकी गुरुत्वीय स्थितिज ऊर्जा में वृद्धि जूल में ज्ञात कीजिए।${gtxt}`,
            ),
            answer: numM(E, null, [[m * h, L("Multiply by $g$ as well.", "$g$ से भी गुणा कीजिए।")], [0.5 * m * G * h, L("There is no ½ in $mgh$.", "$mgh$ में ½ नहीं होता।")]]),
            data: { given: [dq("m", m, "kg"), dq("h", h, "m"), dq("g", 10, "m/s^2")], find: ["\\Delta E_p"] },
            hint: L("Potential energy gained = weight × height.", "स्थितिज ऊर्जा में वृद्धि = भार × ऊँचाई।"),
            formula: "\\Delta E_p = m g h",
            solution: `$\\Delta E_p = ${en(m)} \\cdot 10 \\cdot ${en(h)}$\n$\\Delta E_p = ${en(E)}\\ \\text{J}$`,
          });
        }
        if (v === 2) {
          const F = r.int(5, 60), d = r.int(2, 25), th = r.pick([0, 60]);
          const W = F * d * Math.cos((th * Math.PI) / 180);
          return task({
            text: L(
              `A force of ${F} N pulls a box ${d} m along the floor. The force makes an angle of ${th}° with the direction of motion. How much work does the force do, in joules?`,
              `${F} N का एक बल एक बक्से को फर्श पर ${d} m खींचता है। बल गति की दिशा से ${th}° का कोण बनाता है। बल द्वारा किया गया कार्य जूल में ज्ञात कीजिए।`,
            ),
            answer: numM(Math.round(W * 1e6) / 1e6, null, [[th ? F * d : NaN, L("Only the component of the force along the motion does work: multiply by $\\cos\\theta$.", "केवल गति की दिशा में बल का घटक कार्य करता है: $\\cos\\theta$ से गुणा कीजिए।")], [F / d, L("Work is force times distance, not force divided by distance.", "कार्य = बल × दूरी, न कि बल ÷ दूरी।")]]),
            data: { given: [dq("F", F, "N"), dq("s", d, "m"), `\\theta = ${th}^\\circ`], find: ["W"] },
            hint: L("Use the component of the force along the displacement.", "विस्थापन की दिशा में बल के घटक का प्रयोग कीजिए।"),
            formula: "W = F s \\cos\\theta",
            solution: `$W = ${F} \\cdot ${d} \\cdot \\cos ${th}^\\circ$\n$W = ${en(W)}\\ \\text{J}$`,
          });
        }
        if (v === 3) {
          const W = r.pick([600, 1200, 1800, 2400, 3000, 4500, 9000]), t = r.pick([3, 5, 6, 10, 12, 15, 20, 30]);
          return task({
            text: L(
              `A motor does ${W} J of work in ${t} s. What is its average power, in watts?${roundToL(1, lang)}`,
              `एक मोटर ${t} s में ${W} J कार्य करती है। उसकी औसत शक्ति वाट में ज्ञात कीजिए।${roundToL(1, lang)}`,
            ),
            answer: numM(W / t, 1, [[W * t, L("Power is work divided by time.", "शक्ति = कार्य ÷ समय।")], [t / W, L("You inverted the ratio: $P = W/t$.", "आपने अनुपात उलट दिया: $P = W/t$।")]]),
            data: { given: [dq("W", W, "J"), dq("t", t, "s")], find: ["P"] },
            hint: L("Power is the rate of doing work.", "कार्य करने की दर को शक्ति कहते हैं।"),
            formula: "P = \\dfrac{W}{t}",
            solution: `$P = \\dfrac{${W}}{${t}}$\n$P \\approx ${en(W / t, 1)}\\ \\text{W}$`,
          });
        }
        const k = r.pick([50, 100, 200, 400, 500, 800]), x = r.pick([0.02, 0.05, 0.1, 0.15, 0.2]);
        const E = 0.5 * k * x * x;
        return task({
          text: L(
            `A spring with spring constant ${k} N/m is compressed by ${en(x)} m. How much elastic potential energy does it store, in joules?${roundToL(3, lang)}`,
            `${k} N/m स्प्रिंग नियतांक वाली एक स्प्रिंग को ${en(x)} m संपीडित किया जाता है। उसमें संचित प्रत्यास्थ स्थितिज ऊर्जा जूल में ज्ञात कीजिए।${roundToL(3, lang)}`,
          ),
          answer: numM(E, 3, [[k * x * x, half], [0.5 * k * x, L("The compression must be squared.", "संपीडन का वर्ग लेना आवश्यक है।")]]),
          data: { given: [dq("k", k, "N/m"), dq("x", x, "m")], find: ["E_{el}"] },
          hint: L("Elastic energy depends on the square of the compression.", "प्रत्यास्थ ऊर्जा संपीडन के वर्ग पर निर्भर करती है।"),
          formula: "E_{el} = \\tfrac12 k x^2",
          solution: `$E_{el} = \\tfrac12 \\cdot ${k} \\cdot ${en(x)}^2$\n$E_{el} \\approx ${en(E, 3)}\\ \\text{J}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const h = r.pick([1.25, 1.8, 3.2, 5, 7.2, 11.25, 20, 31.25, 45, 80]);
          const vv = Math.sqrt(2 * G * h);
          return task({
            text: L(
              `A stone is dropped from a height of ${en(h)} m. Ignoring air resistance, what is its speed just before it hits the ground, in m/s?${gtxt}`,
              `एक पत्थर ${en(h)} m की ऊँचाई से गिराया जाता है। वायु प्रतिरोध की उपेक्षा करते हुए, भूमि से टकराने के ठीक पहले उसकी चाल m/s में ज्ञात कीजिए।${gtxt}`,
            ),
            answer: numM(vv, null, [[G * h * 2, L("Take the square root: $v^2 = 2gh$.", "वर्गमूल लीजिए: $v^2 = 2gh$।")], [Math.sqrt(G * h), L("Energy: $mgh = \\tfrac12 mv^2$, so $v = \\sqrt{2gh}$ (do not drop the 2).", "ऊर्जा: $mgh = \\tfrac12 mv^2$, अतः $v = \\sqrt{2gh}$ (2 को न छोड़ें)।")]]),
            data: { given: [dq("h", h, "m"), dq("g", 10, "m/s^2")], find: ["v"] },
            hint: L("Potential energy turns into kinetic energy: $mgh = \\tfrac12 m v^2$; the mass cancels.", "स्थितिज ऊर्जा गतिज ऊर्जा में बदलती है: $mgh = \\tfrac12 m v^2$; द्रव्यमान कट जाता है।"),
            formula: "mgh = \\tfrac12 m v^2",
            solution: `$v^2 = 2gh = 2 \\cdot 10 \\cdot ${en(h)} = ${en(2 * G * h)}$\n$v = \\sqrt{${en(2 * G * h)}} = ${en(vv)}\\ \\text{m/s}$`,
          });
        }
        if (v === 1) {
          const m = r.pick([800, 1000, 1200, 1500]), kmh = r.pick([36, 54, 72, 90, 108]), F = r.pick([4000, 5000, 6000, 8000]);
          const vv = kmh / 3.6, d = (0.5 * m * vv * vv) / F;
          return task({
            text: L(
              `A ${m} kg car travelling at ${kmh} km/h brakes with a constant braking force of ${F} N. What is its stopping distance, in meters?${roundToL(1, lang)}`,
              `${kmh} km/h से चल रही ${m} kg की एक कार ${F} N के नियत ब्रेक बल से रुकती है। उसके रुकने की दूरी मीटर में ज्ञात कीजिए।${roundToL(1, lang)}`,
            ),
            answer: numM(d, 1, [[(0.5 * m * kmh * kmh) / F, L("Convert km/h to m/s first (divide by 3.6).", "पहले km/h को m/s में बदलिए (3.6 से भाग दीजिए)।")], [(m * vv * vv) / F, L("Kinetic energy has a factor ½.", "गतिज ऊर्जा में ½ का गुणक होता है।")]]),
            data: { given: [dq("m", m, "kg"), dq("v", kmh, "km/h"), dq("F", F, "N")], find: ["s"] },
            hint: L("The braking force does work equal to the car's kinetic energy.", "ब्रेक बल द्वारा किया गया कार्य कार की गतिज ऊर्जा के बराबर होता है।"),
            formula: "F s = \\tfrac12 m v^2",
            solution: `$v = ${kmh} / 3.6 = ${en(vv)}\\ \\text{m/s}$\n$E_k = \\tfrac12 \\cdot ${m} \\cdot ${en(vv)}^2 = ${en(0.5 * m * vv * vv)}\\ \\text{J}$\n$s = \\dfrac{${en(0.5 * m * vv * vv)}}{${F}} \\approx ${en(d, 1)}\\ \\text{m}$`,
          });
        }
        if (v === 2) {
          const k = r.pick([100, 200, 400, 500, 800]), x = r.pick([0.05, 0.1, 0.2]), m = r.pick([0.1, 0.2, 0.5, 1]);
          const vv = x * Math.sqrt(k / m);
          return task({
            text: L(
              `A spring (k = ${k} N/m) compressed by ${en(x)} m launches a ${en(m)} kg block on a frictionless table. What is the block's speed when it leaves the spring, in m/s?${roundToL(2, lang)}`,
              `${en(x)} m संपीडित एक स्प्रिंग (k = ${k} N/m) घर्षणरहित मेज़ पर रखे ${en(m)} kg के गुटके को धकेलती है। स्प्रिंग से अलग होते समय गुटके की चाल m/s में ज्ञात कीजिए।${roundToL(2, lang)}`,
            ),
            answer: numM(vv, 2, [[x * x * Math.sqrt(k / m), L("Set $\\tfrac12 kx^2 = \\tfrac12 mv^2$ and solve: $v = x\\sqrt{k/m}$.", "$\\tfrac12 kx^2 = \\tfrac12 mv^2$ रखकर हल कीजिए: $v = x\\sqrt{k/m}$।")], [(k * x * x) / m, L("Take the square root to get $v$ from $v^2$.", "$v^2$ से $v$ पाने के लिए वर्गमूल लीजिए।")]]),
            data: { given: [dq("k", k, "N/m"), dq("x", x, "m"), dq("m", m, "kg")], find: ["v"] },
            hint: L("Elastic energy of the spring becomes kinetic energy of the block.", "स्प्रिंग की प्रत्यास्थ ऊर्जा गुटके की गतिज ऊर्जा में बदल जाती है।"),
            formula: "\\tfrac12 k x^2 = \\tfrac12 m v^2",
            solution: `$E = \\tfrac12 \\cdot ${k} \\cdot ${en(x)}^2 = ${en(0.5 * k * x * x)}\\ \\text{J}$\n$v = \\sqrt{\\dfrac{2E}{m}} = \\sqrt{\\dfrac{${en(k * x * x)}}{${en(m)}}} \\approx ${en(vv, 2)}\\ \\text{m/s}$`,
          });
        }
        const V = r.pick([200, 500, 1000, 1500, 2000]), h = r.pick([5, 8, 10, 15, 20]), t = r.pick([60, 120, 300, 600]);
        const P = (V * G * h) / t;
        return task({
          text: L(
            `A pump lifts ${V} L of water (1 L has mass 1 kg) through a height of ${h} m in ${t} s. What is the useful power of the pump, in watts?${roundToL(1, lang)}${gtxt}`,
            `एक पंप ${t} s में ${V} L पानी (1 L का द्रव्यमान 1 kg) को ${h} m की ऊँचाई तक उठाता है। पंप की उपयोगी शक्ति वाट में ज्ञात कीजिए।${roundToL(1, lang)}${gtxt}`,
          ),
          answer: numM(P, 1, [[V * G * h, L("That is the work; divide by the time.", "यह कार्य है; इसे समय से भाग दीजिए।")], [(V * h) / t, L("Work against gravity is $mgh$: include $g$.", "गुरुत्व के विरुद्ध कार्य $mgh$ है: $g$ को शामिल कीजिए।")]]),
          data: { given: [dq("V", V, "L"), dq("h", h, "m"), dq("t", t, "s"), dq("g", 10, "m/s^2")], find: ["P"] },
          hint: L("Find the mass of water, the work $mgh$ done on it, and divide by the time.", "पानी का द्रव्यमान और उस पर किया गया कार्य $mgh$ ज्ञात कीजिए, फिर समय से भाग दीजिए।"),
          formula: "P = \\dfrac{mgh}{t}",
          solution: `$m = ${V}\\ \\text{kg}$\n$W = ${V} \\cdot 10 \\cdot ${h} = ${V * G * h}\\ \\text{J}$\n$P = \\dfrac{${V * G * h}}{${t}} \\approx ${en(P, 1)}\\ \\text{W}$`,
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const m = r.int(50, 120), h = r.int(3, 15), t = r.int(5, 30), eta = r.pick([0.2, 0.25]);
        const P = (m * G * h) / t;
        return task({
          text: L(
            `A ${m} kg person climbs a staircase ${h} m high in ${t} s. The body converts food energy into mechanical work with an efficiency of ${en(eta * 100)}%. What power must the body supply from food, in watts?${roundToL(1, lang)}${gtxt}`,
            `${m} kg का एक व्यक्ति ${t} s में ${h} m ऊँची सीढ़ियाँ चढ़ता है। शरीर भोजन की ऊर्जा को ${en(eta * 100)}% दक्षता से यांत्रिक कार्य में बदलता है। शरीर को भोजन से कितनी शक्ति देनी होगी? वाट में ज्ञात कीजिए।${roundToL(1, lang)}${gtxt}`,
          ),
          answer: numM(P / eta, 1, [[P, L("That is the useful (mechanical) power; divide by the efficiency.", "यह उपयोगी (यांत्रिक) शक्ति है; इसे दक्षता से भाग दीजिए।")], [P * eta, L("Divide by the efficiency: the input is larger than the output.", "दक्षता से भाग दीजिए: निवेशी शक्ति निर्गत शक्ति से अधिक होती है।")]]),
          data: { given: [dq("m", m, "kg"), dq("h", h, "m"), dq("t", t, "s"), `\\eta = ${en(eta * 100)}\\%`, dq("g", 10, "m/s^2")], find: ["P_{in}"] },
          hint: L("Find the useful power $mgh/t$, then the input power from the efficiency.", "पहले उपयोगी शक्ति $mgh/t$ ज्ञात कीजिए, फिर दक्षता से निवेशी शक्ति ज्ञात कीजिए।"),
          formula: ["P = \\dfrac{mgh}{t}", "\\eta = \\dfrac{P}{P_{in}}"],
          solution: `$W = ${m} \\cdot 10 \\cdot ${h} = ${m * G * h}\\ \\text{J}$\n$P = ${m * G * h} / ${t} \\approx ${en(P, 2)}\\ \\text{W}$\n$P_{in} = P / ${en(eta)} \\approx ${en(P / eta, 1)}\\ \\text{W}$`,
        });
      }
      if (v === 1) {
        const m = r.pick([2, 5, 10, 20]), h = r.pick([2, 3, 4, 5, 8]), vb = r.pick([4, 5, 6, 7, 8]);
        if (vb * vb >= 2 * G * h) return null;
        const Wf = m * G * h - 0.5 * m * vb * vb;
        return task({
          text: L(
            `A ${m} kg box slides from rest down a rough ramp from a height of ${h} m and reaches the bottom at ${vb} m/s. How much energy was lost to friction, in joules?${gtxt}`,
            `${m} kg का एक बक्सा विरामावस्था से ${h} m की ऊँचाई से एक खुरदरे ढलान पर नीचे फिसलता है और ${vb} m/s की चाल से तल पर पहुँचता है। घर्षण में व्यय हुई ऊर्जा जूल में ज्ञात कीजिए।${gtxt}`,
          ),
          answer: numM(Wf, null, [[0.5 * m * vb * vb, L("That is the kinetic energy at the bottom; the loss is $mgh - \\tfrac12 mv^2$.", "यह तल पर गतिज ऊर्जा है; हानि $mgh - \\tfrac12 mv^2$ है।")], [m * G * h, L("That is the starting potential energy; part of it became kinetic energy.", "यह प्रारंभिक स्थितिज ऊर्जा है; इसका एक भाग गतिज ऊर्जा बन गया।")]]),
          data: { given: [dq("m", m, "kg"), dq("h", h, "m"), dq("v", vb, "m/s"), dq("g", 10, "m/s^2")], find: ["W_{fr}"] },
          hint: L("Compare the energy at the top with the energy at the bottom.", "शीर्ष पर और तल पर ऊर्जा की तुलना कीजिए।"),
          formula: "W_{fr} = mgh - \\tfrac12 m v^2",
          solution: `${L("Top", "शीर्ष पर")}: $E_p = ${m} \\cdot 10 \\cdot ${h} = ${m * G * h}\\ \\text{J}$\n${L("Bottom", "तल पर")}: $E_k = \\tfrac12 \\cdot ${m} \\cdot ${vb}^2 = ${en(0.5 * m * vb * vb)}\\ \\text{J}$\n${L("Lost", "हानि")}: $${m * G * h} - ${en(0.5 * m * vb * vb)} = ${en(Wf)}\\ \\text{J}$`,
        });
      }
      if (v === 2) {
        const len = r.pick([0.4, 0.8, 1, 1.6, 2, 2.5]), th = r.pick([30, 45, 60, 90]);
        const vv = Math.sqrt(2 * G * len * (1 - Math.cos((th * Math.PI) / 180)));
        return task({
          text: L(
            `A pendulum of length ${en(len)} m is released from rest with the string at ${th}° to the vertical. What is the speed of the bob at the lowest point, in m/s?${roundToL(2, lang)}${gtxt}`,
            `${en(len)} m लंबाई के एक लोलक को, डोरी को ऊर्ध्वाधर से ${th}° पर रखकर, विरामावस्था से छोड़ा जाता है। निम्नतम बिंदु पर गोलक की चाल m/s में ज्ञात कीजिए।${roundToL(2, lang)}${gtxt}`,
          ),
          answer: numM(vv, 2, [[Math.sqrt(2 * G * len), L("The bob does not fall the full length $L$: the drop is $L(1 - \\cos\\theta)$.", "गोलक पूरी लंबाई $L$ जितना नीचे नहीं आता: ऊँचाई में कमी $L(1 - \\cos\\theta)$ है।")], [Math.sqrt(2 * G * len * Math.cos((th * Math.PI) / 180)), L("The height drop is $L - L\\cos\\theta$, not $L\\cos\\theta$.", "ऊँचाई में कमी $L - L\\cos\\theta$ है, न कि $L\\cos\\theta$।")]]),
          data: { given: [dq("L", len, "m"), `\\theta = ${th}^\\circ`, dq("g", 10, "m/s^2")], find: ["v"] },
          hint: L("Find how far the bob drops vertically, then use conservation of energy.", "ज्ञात कीजिए कि गोलक ऊर्ध्वाधर दिशा में कितना नीचे आता है, फिर ऊर्जा संरक्षण का प्रयोग कीजिए।"),
          formula: ["h = L(1 - \\cos\\theta)", "v = \\sqrt{2gh}"],
          solution: `$h = ${en(len)}(1 - \\cos ${th}^\\circ) \\approx ${en(len * (1 - Math.cos((th * Math.PI) / 180)), 3)}\\ \\text{m}$\n$v = \\sqrt{2 \\cdot 10 \\cdot ${en(len * (1 - Math.cos((th * Math.PI) / 180)), 3)}} \\approx ${en(vv, 2)}\\ \\text{m/s}$`,
        });
      }
      const Pw = r.pick([20, 30, 40, 60, 75]), kmh = r.pick([72, 90, 108, 126]), dist = r.pick([10, 20, 50, 100]);
      const vv = kmh / 3.6, F = (Pw * 1000) / vv, W = F * dist * 1000;
      return task({
        text: L(
          `A car's engine delivers ${Pw} kW while the car moves at a constant ${kmh} km/h. How much work does the engine do against resistive forces over ${dist} km, in megajoules?${roundToL(1, lang)}`,
          `एक कार ${kmh} km/h की नियत चाल से चल रही है और उसका इंजन ${Pw} kW शक्ति देता है। ${dist} km की दूरी में प्रतिरोधी बलों के विरुद्ध इंजन द्वारा किया गया कार्य मेगाजूल में ज्ञात कीजिए।${roundToL(1, lang)}`,
        ),
        answer: numM(W / 1e6, 1, [[(Pw * 1000 * dist * 1000) / kmh / 1e6, L("Convert km/h to m/s before dividing.", "भाग देने से पहले km/h को m/s में बदलिए।")], [(F * dist) / 1e6, L("Convert the distance to meters.", "दूरी को मीटर में बदलिए।")]]),
        data: { given: [dq("P", Pw, "kW"), dq("v", kmh, "km/h"), dq("s", dist, "km")], find: ["W"] },
        hint: L("At constant speed the engine force equals the resistance: $F = P/v$. Then $W = Fs$.", "नियत चाल पर इंजन का बल प्रतिरोधी बल के बराबर होता है: $F = P/v$। फिर $W = Fs$।"),
        formula: ["P = F v", "W = F s"],
        solution: `$v = ${kmh}/3.6 = ${en(vv)}\\ \\text{m/s}$\n$F = \\dfrac{${Pw * 1000}}{${en(vv)}} \\approx ${en(F, 1)}\\ \\text{N}$\n$W = ${en(F, 1)} \\cdot ${dist * 1000} \\approx ${en(W / 1e6, 1)}\\ \\text{MJ}$`,
      });
    },
  },
  {
    id: "exf-momentum",
    topics: [T("momentum-and-collisions")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const m1 = r.int(1, 8), m2 = r.int(1, 8), v1 = r.int(2, 12);
      if (level === 1) {
        const F = r.int(10, 200), t = r.pick([0.1, 0.2, 0.5, 2]);
        return task({
          text: L(
            `A force of ${F} N acts on a ball for ${t} s. What is the change in the ball's momentum, in kg·m/s?`,
            `एक गेंद पर ${t} s तक ${F} N का बल लगता है। गेंद के संवेग में परिवर्तन kg·m/s में ज्ञात कीजिए।`,
          ),
          answer: num(F * t),
          hint: L("Impulse $= F\\,\\Delta t = \\Delta p$.", "आवेग $= F\\,\\Delta t = \\Delta p$।"),
          formula: "\\Delta p = F \\Delta t",
          solution: `$\\Delta p = ${F} \\cdot ${t} = ${en(F * t)}\\ \\text{kg·m/s}$`,
        });
      }
      if (level === 2) {
        const v = (m1 * v1) / (m1 + m2);
        return task({
          text: L(
            `A ${m1} kg trolley moving at ${v1} m/s collides with a stationary ${m2} kg trolley and they stick together. What is their common speed after the collision, in m/s?${roundToL(2, lang)}`,
            `${v1} m/s से चल रही ${m1} kg की एक ट्रॉली ${m2} kg की एक स्थिर ट्रॉली से टकराती है और दोनों आपस में चिपक जाती हैं। टक्कर के बाद उनकी उभयनिष्ठ चाल m/s में ज्ञात कीजिए।${roundToL(2, lang)}`,
          ),
          answer: num(v, 2),
          hint: L("Momentum is conserved: $m_1 v_1 = (m_1 + m_2) v$.", "संवेग संरक्षित रहता है: $m_1 v_1 = (m_1 + m_2) v$।"),
          formula: "m_1 v_1 = (m_1 + m_2)v",
          solution: `$v = \\dfrac{${m1} \\cdot ${v1}}{${m1} + ${m2}} \\approx ${en(v, 2)}\\ \\text{m/s}$`,
        });
      }
      const v1f = ((m1 - m2) / (m1 + m2)) * v1, v2f = ((2 * m1) / (m1 + m2)) * v1;
      void v1f;
      return task({
        text: L(
          `A ${m1} kg ball moving at ${v1} m/s makes a perfectly elastic head-on collision with a stationary ${m2} kg ball. What is the speed of the second ball after the collision, in m/s?${roundToL(2, lang)}`,
          `${v1} m/s से चल रही ${m1} kg की एक गेंद ${m2} kg की एक स्थिर गेंद से आमने-सामने पूर्णतः प्रत्यास्थ टक्कर करती है। टक्कर के बाद दूसरी गेंद की चाल m/s में ज्ञात कीजिए।${roundToL(2, lang)}`,
        ),
        answer: num(v2f, 2),
        hint: L("For an elastic collision with the second body at rest: $v_2' = \\dfrac{2m_1}{m_1 + m_2} v_1$.", "प्रत्यास्थ संघट्ट में, जब दूसरा पिंड विराम में हो: $v_2' = \\dfrac{2m_1}{m_1 + m_2} v_1$।"),
        formula: "v_2' = \\dfrac{2 m_1}{m_1 + m_2} v_1",
        solution: `$v_2' = \\dfrac{2 \\cdot ${m1}}{${m1} + ${m2}} \\cdot ${v1} \\approx ${en(v2f, 2)}\\ \\text{m/s}$`,
      });
    },
  },
  {
    id: "exf-circular",
    topics: [T("circular-motion-and-gravitation")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const gtxt = takeG(L);
      const sq = L("The speed must be squared.", "चाल का वर्ग लेना आवश्यक है।");
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const m = r.int(1, 5), vv = r.int(2, 12), R = r.pick([0.5, 0.8, 1, 1.5, 2, 4]);
          const F = (m * vv * vv) / R;
          return task({
            text: L(
              `A ${m} kg stone is whirled in a horizontal circle of radius ${en(R)} m at ${vv} m/s. What is the centripetal force, in newtons?${roundToL(1, lang)}`,
              `${m} kg का एक पत्थर ${en(R)} m त्रिज्या के क्षैतिज वृत्त में ${vv} m/s की चाल से घुमाया जाता है। अभिकेंद्र बल न्यूटन में ज्ञात कीजिए।${roundToL(1, lang)}`,
            ),
            answer: numM(F, 1, [[(m * vv) / R, sq], [m * vv * vv * R, L("Divide by the radius, do not multiply.", "त्रिज्या से भाग दीजिए, गुणा नहीं।")]]),
            data: { given: [dq("m", m, "kg"), dq("v", vv, "m/s"), dq("r", R, "m")], find: ["F"] },
            hint: L("The centripetal force grows with the square of the speed.", "अभिकेंद्र बल चाल के वर्ग के अनुपात में बढ़ता है।"),
            formula: "F = \\dfrac{m v^2}{r}",
            solution: `$F = \\dfrac{${m} \\cdot ${vv}^2}{${en(R)}}$\n$F \\approx ${en(F, 1)}\\ \\text{N}$`,
          });
        }
        if (v === 1) {
          const R = r.pick([0.2, 0.5, 1, 2, 5, 10]), Tp = r.pick([0.5, 1, 2, 4, 5]);
          const vv = (2 * Math.PI * R) / Tp;
          return task({
            text: L(
              `A point on a wheel moves in a circle of radius ${en(R)} m and makes one revolution every ${en(Tp)} s. What is its speed, in m/s?${roundToL(2, lang)}`,
              `एक पहिए पर स्थित एक बिंदु ${en(R)} m त्रिज्या के वृत्त में घूमता है और प्रत्येक ${en(Tp)} s में एक चक्कर पूरा करता है। उसकी चाल m/s में ज्ञात कीजिए।${roundToL(2, lang)}`,
            ),
            answer: numM(vv, 2, [[(Math.PI * R) / Tp, L("The circumference is $2\\pi r$, not $\\pi r$.", "परिधि $2\\pi r$ है, न कि $\\pi r$।")], [(2 * Math.PI * R) * Tp, L("Divide the circumference by the period.", "परिधि को आवर्तकाल से भाग दीजिए।")]]),
            data: { given: [dq("r", R, "m"), dq("T", Tp, "s")], find: ["v"] },
            hint: L("In one period the point travels one circumference.", "एक आवर्तकाल में बिंदु एक परिधि के बराबर दूरी तय करता है।"),
            formula: "v = \\dfrac{2\\pi r}{T}",
            solution: `$v = \\dfrac{2\\pi \\cdot ${en(R)}}{${en(Tp)}}$\n$v \\approx ${en(vv, 2)}\\ \\text{m/s}$`,
          });
        }
        const vv = r.int(2, 30), R = r.pick([0.5, 2, 5, 10, 20, 50]);
        return task({
          text: L(
            `A car moves at a constant ${vv} m/s around a curve of radius ${en(R)} m. What is its centripetal acceleration, in m/s²?${roundToL(2, lang)}`,
            `एक कार ${en(R)} m त्रिज्या वाले मोड़ पर ${vv} m/s की नियत चाल से चलती है। उसका अभिकेंद्र त्वरण m/s² में ज्ञात कीजिए।${roundToL(2, lang)}`,
          ),
          answer: numM((vv * vv) / R, 2, [[vv / R, sq], [R / (vv * vv), L("You inverted the ratio: $a = v^2/r$.", "आपने अनुपात उलट दिया: $a = v^2/r$।")]]),
          data: { given: [dq("v", vv, "m/s"), dq("r", R, "m")], find: ["a_c"] },
          hint: L("Centripetal acceleration depends on the speed squared and the radius.", "अभिकेंद्र त्वरण चाल के वर्ग और त्रिज्या पर निर्भर करता है।"),
          formula: "a_c = \\dfrac{v^2}{r}",
          solution: `$a_c = \\dfrac{${vv}^2}{${en(R)}}$\n$a_c \\approx ${en((vv * vv) / R, 2)}\\ \\text{m/s}^2$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const k = r.pick([1.5, 2, 3, 4, 5, 10]);
          const g = 9.8 / (k * k);
          return task({
            text: L(
              `The acceleration due to gravity at the Earth's surface is $9.8\\ \\text{m/s}^2$. What is it at a distance of ${en(k)} Earth radii from the Earth's centre, in m/s²?${roundToL(2, lang)}`,
              `पृथ्वी की सतह पर गुरुत्वीय त्वरण $9.8\\ \\text{m/s}^2$ है। पृथ्वी के केंद्र से ${en(k)} पृथ्वी-त्रिज्या की दूरी पर इसका मान m/s² में ज्ञात कीजिए।${roundToL(2, lang)}`,
            ),
            answer: numM(g, 2, [[9.8 / k, L("Gravity falls off as $1/r^2$, not $1/r$.", "गुरुत्व $1/r^2$ के अनुसार घटता है, न कि $1/r$ के अनुसार।")], [9.8 / ((k - 1) * (k - 1)), L("Distance is measured from the Earth's centre, not from the surface.", "दूरी पृथ्वी के केंद्र से मापी जाती है, सतह से नहीं।")]]),
            data: { given: [dq("g_0", 9.8, "m/s^2"), `r = ${en(k)} R`], find: ["g"] },
            hint: L("Gravity falls off as the inverse square of the distance from the centre.", "गुरुत्व, केंद्र से दूरी के वर्ग के व्युत्क्रम के अनुपात में घटता है।"),
            formula: "g(r) = g_0 \\left(\\dfrac{R}{r}\\right)^2",
            solution: `$\\left(\\dfrac{R}{r}\\right)^2 = \\dfrac{1}{${en(k * k)}}$\n$g = 9.8 / ${en(k * k)} \\approx ${en(g, 2)}\\ \\text{m/s}^2$`,
          });
        }
        if (v === 1) {
          const mu = r.pick([0.3, 0.4, 0.5, 0.6, 0.8]), R = r.pick([20, 30, 40, 50, 80, 100]);
          const vv = Math.sqrt(mu * G * R);
          return task({
            text: L(
              `A car rounds a flat curve of radius ${R} m. The coefficient of static friction between the tyres and the road is ${en(mu)}. What is the maximum speed without skidding, in m/s?${roundToL(1, lang)}${gtxt}`,
              `एक कार ${R} m त्रिज्या वाले समतल (बिना झुकाव के) मोड़ पर मुड़ती है। टायरों और सड़क के बीच स्थैतिक घर्षण गुणांक ${en(mu)} है। बिना फिसले कार की अधिकतम चाल m/s में ज्ञात कीजिए।${roundToL(1, lang)}${gtxt}`,
            ),
            answer: numM(vv, 1, [[mu * G * R, L("Take the square root: friction gives $v^2 = \\mu g r$.", "वर्गमूल लीजिए: घर्षण से $v^2 = \\mu g r$ मिलता है।")], [Math.sqrt(G * R), L("Friction provides the centripetal force; include $\\mu$.", "घर्षण ही अभिकेंद्र बल प्रदान करता है; $\\mu$ को शामिल कीजिए।")]]),
            data: { given: [dq("r", R, "m"), `\\mu = ${en(mu)}`, dq("g", 10, "m/s^2")], find: ["v_{max}"] },
            hint: L("Maximum static friction $\\mu mg$ provides the centripetal force $mv^2/r$.", "अधिकतम स्थैतिक घर्षण $\\mu mg$ ही अभिकेंद्र बल $mv^2/r$ प्रदान करता है।"),
            formula: "\\mu m g = \\dfrac{m v^2}{r}",
            solution: `$v^2 = \\mu g r = ${en(mu)} \\cdot 10 \\cdot ${R} = ${en(mu * G * R)}$\n$v = \\sqrt{${en(mu * G * R)}} \\approx ${en(vv, 1)}\\ \\text{m/s}$`,
          });
        }
        if (v === 2) {
          const vv = r.pick([10, 15, 20, 25]), R = r.pick([50, 80, 100, 150, 200]);
          const th = (Math.atan((vv * vv) / (R * G)) * 180) / Math.PI;
          return task({
            text: L(
              `At what angle should a road curve of radius ${R} m be banked so that a car at ${vv} m/s needs no friction, in degrees?${roundToL(1, lang)}${gtxt}`,
              `${R} m त्रिज्या वाले सड़क के मोड़ को किस कोण पर झुकाया (बैंकिंग) जाए ताकि ${vv} m/s से चलती कार को घर्षण की आवश्यकता न पड़े? यह कोण डिग्री में ज्ञात कीजिए।${roundToL(1, lang)}${gtxt}`,
            ),
            answer: numM(th, 1, [[(Math.atan((R * G) / (vv * vv)) * 180) / Math.PI, L("You inverted the ratio: $\\tan\\theta = v^2/(rg)$.", "आपने अनुपात उलट दिया: $\\tan\\theta = v^2/(rg)$।")], [(Math.asin(Math.min(1, (vv * vv) / (R * G))) * 180) / Math.PI, L("Use the tangent: the normal force's components give $\\tan\\theta$.", "स्पर्शज्या ($\\tan$) का प्रयोग कीजिए: अभिलंब बल के घटकों से $\\tan\\theta$ मिलता है।")]]),
            data: { given: [dq("r", R, "m"), dq("v", vv, "m/s"), dq("g", 10, "m/s^2")], find: ["\\theta"] },
            hint: L("The horizontal component of the normal force provides the centripetal force; the vertical one balances the weight.", "अभिलंब बल का क्षैतिज घटक अभिकेंद्र बल देता है; ऊर्ध्वाधर घटक भार को संतुलित करता है।"),
            formula: "\\tan\\theta = \\dfrac{v^2}{r g}",
            solution: `$\\tan\\theta = \\dfrac{${vv}^2}{${R} \\cdot 10} = ${en((vv * vv) / (R * G), 4)}$\n$\\theta \\approx ${en(th, 1)}^\\circ$`,
          });
        }
        const T1 = r.pick([1, 2, 3]), x = r.pick([2, 3, 4, 9]);
        const T2 = T1 * x ** 1.5;
        return task({
          text: L(
            `A satellite orbits a planet with period ${T1} h. Another satellite orbits the same planet at ${x} times the orbital radius. What is its period, in hours?${roundToL(1, lang)}`,
            `एक उपग्रह किसी ग्रह की परिक्रमा ${T1} h के आवर्तकाल से करता है। उसी ग्रह का दूसरा उपग्रह ${x} गुनी कक्षीय त्रिज्या पर परिक्रमा करता है। दूसरे उपग्रह का आवर्तकाल घंटों में ज्ञात कीजिए।${roundToL(1, lang)}`,
          ),
          answer: numM(T2, 1, [[T1 * x, L("Period is not proportional to the radius: $T^2 \\propto r^3$.", "आवर्तकाल त्रिज्या के अनुक्रमानुपाती नहीं है: $T^2 \\propto r^3$।")], [T1 * x * x, L("Kepler's law: $T \\propto r^{3/2}$, not $r^2$.", "केप्लर का नियम: $T \\propto r^{3/2}$, न कि $r^2$।")]]),
          data: { given: [dq("T_1", T1, "h"), `r_2 = ${x} r_1`], find: ["T_2"] },
          hint: L("Use Kepler's third law in ratio form.", "केप्लर के तीसरे नियम का अनुपात रूप में प्रयोग कीजिए।"),
          formula: "\\dfrac{T_2^2}{T_1^2} = \\dfrac{r_2^3}{r_1^3}",
          solution: `$T_2 = T_1 \\left(\\dfrac{r_2}{r_1}\\right)^{3/2} = ${T1} \\cdot ${x}^{3/2}$\n$${x}^{3/2} \\approx ${en(x ** 1.5, 3)}$\n$T_2 \\approx ${en(T2, 1)}\\ \\text{h}$`,
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const R = r.pick([0.4, 0.9, 1.6, 2.5, 3.6, 4.9]), m = r.pick([0.2, 0.5, 1]);
        const vt = Math.sqrt(G * R), vb = Math.sqrt(5 * G * R), Tb = 6 * m * G;
        const ask = r.int(0, 1);
        const setupHi = `डोरी से बँधी ${en(m)} kg की एक गेंद ${en(R)} m त्रिज्या के ऊर्ध्वाधर वृत्त में घूमती है। उसकी चाल वह न्यूनतम चाल है जो शीर्ष पर डोरी को तनी रखने के लिए आवश्यक है।`;
        return task({
          text: ask === 0
            ? L(
              `A ${en(m)} kg ball on a string moves in a vertical circle of radius ${en(R)} m with the minimum speed needed to keep the string taut at the top. What is its speed at the bottom, in m/s?${roundToL(2, lang)}${gtxt}`,
              `${setupHi} निम्नतम बिंदु पर उसकी चाल m/s में ज्ञात कीजिए।${roundToL(2, lang)}${gtxt}`,
            )
            : L(
              `A ${en(m)} kg ball on a string moves in a vertical circle of radius ${en(R)} m with the minimum speed needed to keep the string taut at the top. What is the tension in the string at the bottom, in newtons?${gtxt}`,
              `${setupHi} निम्नतम बिंदु पर डोरी में तनाव न्यूटन में ज्ञात कीजिए।${gtxt}`,
            ),
          answer: ask === 0
            ? numM(vb, 2, [[vt, L("That is the speed at the top; the ball gains energy falling $2r$.", "यह शीर्ष पर चाल है; $2r$ नीचे आने में गेंद गतिज ऊर्जा प्राप्त करती है।")], [Math.sqrt(3 * G * R), L("The ball falls $2r$ (a diameter), not $r$.", "गेंद $2r$ (एक व्यास) नीचे आती है, न कि $r$।")]])
            : numM(Tb, null, [[m * G, L("At the bottom the tension must also provide the centripetal force.", "निम्नतम बिंदु पर तनाव को अभिकेंद्र बल भी देना होता है।")], [5 * m * G, L("Tension = $mg + mv^2/r$: add the weight.", "तनाव = $mg + mv^2/r$: भार भी जोड़िए।")]]),
          data: { given: [dq("m", m, "kg"), dq("r", R, "m"), dq("g", 10, "m/s^2")], find: [ask === 0 ? "v_b" : "T_b"] },
          hint: L("At the top gravity alone gives the centripetal force. Then use energy conservation down to the bottom (drop $2r$).", "शीर्ष पर केवल गुरुत्व अभिकेंद्र बल देता है। फिर निम्नतम बिंदु तक ऊर्जा संरक्षण लगाइए (ऊँचाई में कमी $2r$)।"),
          formula: ["mg = \\dfrac{m v_t^2}{r}", "v_b^2 = v_t^2 + 2g(2r)", "T_b - mg = \\dfrac{m v_b^2}{r}"],
          solution: `${L("Top", "शीर्ष पर")}: $v_t^2 = g r = ${en(G * R)}$\n${L("Bottom", "निम्नतम बिंदु पर")}: $v_b^2 = v_t^2 + 4gr = 5gr = ${en(5 * G * R)}$, $v_b \\approx ${en(vb, 2)}\\ \\text{m/s}$${ask === 1 ? `\n$T_b = mg + \\dfrac{m v_b^2}{r} = mg + 5mg = 6mg = ${en(Tb)}\\ \\text{N}$` : ""}`,
        });
      }
      if (v === 1) {
        const m = r.pick([0.2, 0.5, 1, 2]), R = r.pick([0.5, 0.8, 1, 1.2]), vv = r.pick([4, 5, 6, 8]);
        const Tt = (m * vv * vv) / R - m * G;
        if (Tt <= 0) return null;
        return task({
          text: L(
            `A ${en(m)} kg ball on a string moves in a vertical circle of radius ${en(R)} m. At the top of the circle its speed is ${vv} m/s. What is the tension in the string at the top, in newtons?${roundToL(1, lang)}${gtxt}`,
            `डोरी से बँधी ${en(m)} kg की एक गेंद ${en(R)} m त्रिज्या के ऊर्ध्वाधर वृत्त में घूमती है। वृत्त के शीर्ष पर उसकी चाल ${vv} m/s है। शीर्ष पर डोरी में तनाव न्यूटन में ज्ञात कीजिए।${roundToL(1, lang)}${gtxt}`,
          ),
          answer: numM(Tt, 1, [[(m * vv * vv) / R + m * G, L("At the top weight and tension both point down (toward the centre): subtract $mg$.", "शीर्ष पर भार और तनाव दोनों नीचे (केंद्र की ओर) लगते हैं: $mg$ घटाइए।")], [(m * vv * vv) / R, L("Gravity also acts toward the centre at the top.", "शीर्ष पर गुरुत्व भी केंद्र की ओर लगता है।")]]),
          data: { given: [dq("m", m, "kg"), dq("r", R, "m"), dq("v", vv, "m/s"), dq("g", 10, "m/s^2")], find: ["T"] },
          hint: L("At the top both the tension and the weight point toward the centre.", "शीर्ष पर तनाव और भार दोनों केंद्र की ओर लगते हैं।"),
          formula: "T + mg = \\dfrac{m v^2}{r}",
          solution: `$\\dfrac{m v^2}{r} = \\dfrac{${en(m)} \\cdot ${vv}^2}{${en(R)}} = ${en((m * vv * vv) / R, 2)}\\ \\text{N}$\n$mg = ${en(m * G)}\\ \\text{N}$\n$T = ${en((m * vv * vv) / R, 2)} - ${en(m * G)} \\approx ${en(Tt, 1)}\\ \\text{N}$`,
        });
      }
      if (v === 2) {
        const [pl, g0, Rkm, plHi] = r.pick([["Earth", 10, 6400, "पृथ्वी"], ["the Moon", 1.6, 1740, "चंद्रमा"], ["Mars", 3.7, 3390, "मंगल"], ["Mercury", 3.7, 2440, "बुध"]]);
        const ve = Math.sqrt(2 * g0 * Rkm * 1000) / 1000;
        return task({
          text: L(
            `The surface gravity of ${pl} is $${en(g0)}\\ \\text{m/s}^2$ and its radius is ${Rkm} km. What is the escape speed from its surface, in km/s?${roundToL(2, lang)}`,
            `${plHi} की सतह पर गुरुत्वीय त्वरण $${en(g0)}\\ \\text{m/s}^2$ है और उसकी त्रिज्या ${Rkm} km है। उसकी सतह से पलायन चाल km/s में ज्ञात कीजिए।${roundToL(2, lang)}`,
          ),
          answer: numM(ve, 2, [[ve / Math.SQRT2, L("That is the orbital speed near the surface; escape speed is $\\sqrt2$ times larger.", "यह सतह के निकट कक्षीय चाल है; पलायन चाल इससे $\\sqrt2$ गुना होती है।")], [Math.sqrt(2 * g0 * Rkm) / 1000, L("Convert the radius to meters before using the formula.", "सूत्र लगाने से पहले त्रिज्या को मीटर में बदलिए।")]]),
          data: { given: [dq("g", g0, "m/s^2"), dq("R", Rkm, "km")], find: ["v_e"] },
          hint: L("Use $GM = gR^2$ in the escape speed formula.", "पलायन चाल के सूत्र में $GM = gR^2$ रखिए।"),
          formula: ["v_e = \\sqrt{\\dfrac{2GM}{R}}", "GM = g R^2"],
          solution: `$v_e = \\sqrt{2 g R}$\n$v_e = \\sqrt{2 \\cdot ${en(g0)} \\cdot ${Rkm * 1000}}\\ \\text{m/s}$\n$v_e \\approx ${en(ve * 1000, 0)}\\ \\text{m/s} \\approx ${en(ve, 2)}\\ \\text{km/s}$`,
        });
      }
      const h = r.pick([300, 400, 600, 1000, 2000]), R = 6400;
      const rr = (R + h) * 1000, vo = Math.sqrt((10 * (R * 1000) ** 2) / rr), Tm = (2 * Math.PI * rr) / vo / 60;
      return task({
        text: L(
          `A satellite orbits the Earth at a height of ${h} km above the surface. Earth's radius is ${R} km and $g = 10\\ \\text{m/s}^2$ at the surface. What is its orbital period, in minutes?${roundToL(0, lang)}`,
          `एक उपग्रह पृथ्वी की सतह से ${h} km की ऊँचाई पर पृथ्वी की परिक्रमा करता है। पृथ्वी की त्रिज्या ${R} km है और सतह पर $g = 10\\ \\text{m/s}^2$ है। उपग्रह का कक्षीय आवर्तकाल मिनट में ज्ञात कीजिए।${roundToL(0, lang)}`,
        ),
        answer: numM(Tm, 0, [[(2 * Math.PI * h * 1000) / Math.sqrt((10 * (R * 1000) ** 2) / (h * 1000)) / 60, L("Measure the orbital radius from the Earth's centre: $r = R + h$.", "कक्षीय त्रिज्या पृथ्वी के केंद्र से मापिए: $r = R + h$।")], [(2 * Math.PI * rr) / Math.sqrt(10 * rr) / 60, L("Gravity is weaker at height: use $g_0 R^2 / r$, not $g_0$.", "ऊँचाई पर गुरुत्व कम होता है: $g_0$ के स्थान पर $g_0 R^2 / r$ का प्रयोग कीजिए।")]]),
        data: { given: [dq("h", h, "km"), dq("R", R, "km"), dq("g_0", 10, "m/s^2")], find: ["T"] },
        hint: L("Gravity provides the centripetal force; use $GM = g_0R^2$ and $r = R + h$.", "गुरुत्व बल ही अभिकेंद्र बल प्रदान करता है; $GM = g_0R^2$ और $r = R + h$ का प्रयोग कीजिए।"),
        formula: ["\\dfrac{GMm}{r^2} = \\dfrac{m v^2}{r}", "GM = g_0 R^2", "T = \\dfrac{2\\pi r}{v}"],
        solution: `$r = ${R} + ${h} = ${R + h}\\ \\text{km}$\n$v = \\sqrt{\\dfrac{g_0 R^2}{r}} \\approx ${en(vo, 0)}\\ \\text{m/s}$\n$T = \\dfrac{2\\pi r}{v} \\approx ${en(Tm * 60, 0)}\\ \\text{s} \\approx ${en(Tm, 0)}\\ \\text{min}$`,
      });
    },
  },
  {
    id: "exf-shm",
    topics: [T("oscillations")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const gtxt = takeG(L);
      const TP = 2 * Math.PI;
      const no2pi = L("You forgot the factor $2\\pi$.", "आप $2\\pi$ का गुणक भूल गए।");
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0) {
          const len = r.pick([0.1, 0.25, 0.4, 0.9, 1.6, 2.5, 3.6]);
          const T = TP * Math.sqrt(len / G);
          return task({
            text: L(
              `What is the period of a simple pendulum of length ${en(len)} m, in seconds?${roundToL(2, lang)}${gtxt}`,
              `${en(len)} m लंबाई वाले सरल लोलक का आवर्तकाल सेकंड में ज्ञात कीजिए।${roundToL(2, lang)}${gtxt}`,
            ),
            answer: numM(T, 2, [[TP * Math.sqrt(G / len), L("You inverted the ratio under the root: it is $L/g$.", "आपने मूल के अंदर का अनुपात उलट दिया: यह $L/g$ है।")], [Math.sqrt(len / G), no2pi]]),
            data: { given: [dq("L", len, "m"), dq("g", 10, "m/s^2")], find: ["T"] },
            hint: L("The period depends only on the length and $g$.", "आवर्तकाल केवल लंबाई और $g$ पर निर्भर करता है।"),
            formula: "T = 2\\pi\\sqrt{\\dfrac{L}{g}}",
            solution: `$T = 2\\pi\\sqrt{${en(len)}/10} = 2\\pi \\cdot ${en(Math.sqrt(len / G), 4)}$\n$T \\approx ${en(T, 2)}\\ \\text{s}$`,
          });
        }
        if (v === 1) {
          const m = r.pick([0.1, 0.2, 0.5, 1, 2]), k = r.pick([20, 50, 80, 100, 200, 400]);
          const T = TP * Math.sqrt(m / k);
          return task({
            text: L(
              `A mass of ${en(m)} kg oscillates on a spring with spring constant ${k} N/m. What is the period of oscillation, in seconds?${roundToL(3, lang)}`,
              `${en(m)} kg का एक द्रव्यमान ${k} N/m स्प्रिंग नियतांक वाली स्प्रिंग पर दोलन करता है। दोलन का आवर्तकाल सेकंड में ज्ञात कीजिए।${roundToL(3, lang)}`,
            ),
            answer: numM(T, 3, [[TP * Math.sqrt(k / m), L("You inverted the ratio under the root: it is $m/k$.", "आपने मूल के अंदर का अनुपात उलट दिया: यह $m/k$ है।")], [Math.sqrt(m / k), no2pi]]),
            data: { given: [dq("m", m, "kg"), dq("k", k, "N/m")], find: ["T"] },
            hint: L("A heavier mass oscillates more slowly, a stiffer spring faster.", "भारी द्रव्यमान धीमे दोलन करता है, कठोर स्प्रिंग तेज़।"),
            formula: "T = 2\\pi\\sqrt{\\dfrac{m}{k}}",
            solution: `$T = 2\\pi\\sqrt{${en(m)}/${k}} = 2\\pi \\cdot ${en(Math.sqrt(m / k), 4)}$\n$T \\approx ${en(T, 3)}\\ \\text{s}$`,
          });
        }
        if (v === 2) {
          const A = r.pick([0.02, 0.05, 0.1, 0.2, 0.3]), w = r.int(2, 12);
          return task({
            text: L(
              `A particle performs simple harmonic motion with amplitude ${en(A)} m and angular frequency ${w} rad/s. What is its maximum speed, in m/s?`,
              `एक कण ${en(A)} m आयाम और ${w} rad/s कोणीय आवृत्ति से सरल आवर्त गति करता है। उसकी अधिकतम चाल m/s में ज्ञात कीजिए।`,
            ),
            answer: numM(Math.round(A * w * 1e6) / 1e6, null, [[A * w * w, L("That is the maximum acceleration $A\\omega^2$.", "यह अधिकतम त्वरण $A\\omega^2$ है।")], [A / w, L("Multiply the amplitude by $\\omega$.", "आयाम को $\\omega$ से गुणा कीजिए।")]]),
            data: { given: [dq("A", A, "m"), dq("\\omega", w, "rad/s")], find: ["v_{max}"] },
            hint: L("The maximum speed is reached at the equilibrium position.", "अधिकतम चाल साम्यावस्था की स्थिति पर होती है।"),
            formula: "v_{max} = A\\omega",
            solution: `$v_{max} = A\\omega = ${en(A)} \\cdot ${w}$\n$v_{max} = ${en(A * w)}\\ \\text{m/s}$`,
          });
        }
        const A = r.pick([0.02, 0.05, 0.1, 0.2]), w = r.int(2, 10);
        return task({
          text: L(
            `A body in simple harmonic motion has amplitude ${en(A)} m and angular frequency ${w} rad/s. What is its maximum acceleration, in m/s²?`,
            `सरल आवर्त गति करते एक पिंड का आयाम ${en(A)} m और कोणीय आवृत्ति ${w} rad/s है। उसका अधिकतम त्वरण m/s² में ज्ञात कीजिए।`,
          ),
          answer: numM(Math.round(A * w * w * 1e6) / 1e6, null, [[A * w, L("That is the maximum speed $A\\omega$; acceleration needs $\\omega^2$.", "यह अधिकतम चाल $A\\omega$ है; त्वरण के लिए $\\omega^2$ चाहिए।")], [A * A * w, L("It is $A\\omega^2$, not $A^2\\omega$.", "यह $A\\omega^2$ है, न कि $A^2\\omega$।")]]),
          data: { given: [dq("A", A, "m"), dq("\\omega", w, "rad/s")], find: ["a_{max}"] },
          hint: L("The acceleration is largest at the turning points.", "त्वरण चरम स्थितियों पर (जहाँ पिंड लौटता है) अधिकतम होता है।"),
          formula: "a_{max} = A\\omega^2",
          solution: `$a_{max} = A\\omega^2 = ${en(A)} \\cdot ${w}^2$\n$a_{max} = ${en(A * w * w)}\\ \\text{m/s}^2$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const T = r.pick([1, 1.5, 2, 2.5, 3]);
          const len = G * (T / TP) ** 2;
          return task({
            text: L(
              `What length must a simple pendulum have to have a period of ${en(T)} s, in meters?${roundToL(3, lang)}${gtxt}`,
              `${en(T)} s आवर्तकाल वाले सरल लोलक की लंबाई कितनी होनी चाहिए? मीटर में ज्ञात कीजिए।${roundToL(3, lang)}${gtxt}`,
            ),
            answer: numM(len, 3, [[G * T / TP, L("Square $T/(2\\pi)$ when solving for $L$.", "$L$ के लिए हल करते समय $T/(2\\pi)$ का वर्ग लीजिए।")], [G * T * T, L("You forgot to divide by $(2\\pi)^2$.", "आप $(2\\pi)^2$ से भाग देना भूल गए।")]]),
            data: { given: [dq("T", T, "s"), dq("g", 10, "m/s^2")], find: ["L"] },
            hint: L("Solve $T = 2\\pi\\sqrt{L/g}$ for $L$: square both sides.", "$T = 2\\pi\\sqrt{L/g}$ को $L$ के लिए हल कीजिए: दोनों पक्षों का वर्ग कीजिए।"),
            formula: "L = g\\left(\\dfrac{T}{2\\pi}\\right)^2",
            solution: `$\\dfrac{T}{2\\pi} = ${en(T / TP, 4)}$\n$L = 10 \\cdot ${en(T / TP, 4)}^2 \\approx ${en(len, 3)}\\ \\text{m}$`,
          });
        }
        if (v === 1) {
          const x = r.pick([0.01, 0.02, 0.04, 0.05, 0.1]);
          const T = TP * Math.sqrt(x / G);
          return task({
            text: L(
              `A mass hung on a spring stretches it by ${en(x)} m at equilibrium. If the mass is pulled down slightly and released, what is the period of oscillation, in seconds?${roundToL(3, lang)}${gtxt}`,
              `एक स्प्रिंग पर लटकाया गया द्रव्यमान साम्यावस्था में स्प्रिंग को ${en(x)} m खींच देता है। यदि द्रव्यमान को थोड़ा नीचे खींचकर छोड़ दिया जाए, तो दोलन का आवर्तकाल सेकंड में ज्ञात कीजिए।${roundToL(3, lang)}${gtxt}`,
            ),
            answer: numM(T, 3, [[TP * Math.sqrt(G / x), L("At equilibrium $kx = mg$, so $m/k = x/g$ (not $g/x$).", "साम्यावस्था में $kx = mg$, अतः $m/k = x/g$ (न कि $g/x$)।")], [Math.sqrt(x / G), no2pi]]),
            data: { given: [dq("x", x, "m"), dq("g", 10, "m/s^2")], find: ["T"] },
            hint: L("From the equilibrium condition $kx = mg$ find $m/k$.", "साम्यावस्था की शर्त $kx = mg$ से $m/k$ ज्ञात कीजिए।"),
            formula: ["k x = m g", "T = 2\\pi\\sqrt{\\dfrac{m}{k}}"],
            solution: `$\\dfrac{m}{k} = \\dfrac{x}{g} = \\dfrac{${en(x)}}{10} = ${en(x / G)}$\n$T = 2\\pi\\sqrt{${en(x / G)}} \\approx ${en(T, 3)}\\ \\text{s}$`,
          });
        }
        if (v === 2) {
          const m = r.pick([0.1, 0.2, 0.5, 1, 2]), k = r.pick([20, 50, 80, 200, 500]), A = r.pick([0.02, 0.05, 0.1]);
          const vm = A * Math.sqrt(k / m);
          return task({
            text: L(
              `A ${en(m)} kg block on a spring (k = ${k} N/m) oscillates with amplitude ${en(A)} m. What is its maximum speed, in m/s?${roundToL(3, lang)}`,
              `एक स्प्रिंग (k = ${k} N/m) से जुड़ा ${en(m)} kg का गुटका ${en(A)} m आयाम से दोलन करता है। उसकी अधिकतम चाल m/s में ज्ञात कीजिए।${roundToL(3, lang)}`,
            ),
            answer: numM(vm, 3, [[A * Math.sqrt(m / k), L("$\\omega = \\sqrt{k/m}$, not $\\sqrt{m/k}$.", "$\\omega = \\sqrt{k/m}$ होता है, न कि $\\sqrt{m/k}$।")], [(A * k) / m, L("That is the maximum acceleration $A\\omega^2$.", "यह अधिकतम त्वरण $A\\omega^2$ है।")]]),
            data: { given: [dq("m", m, "kg"), dq("k", k, "N/m"), dq("A", A, "m")], find: ["v_{max}"] },
            hint: L("Find $\\omega$ from $k$ and $m$ first, then $v_{max} = A\\omega$.", "पहले $k$ और $m$ से $\\omega$ ज्ञात कीजिए, फिर $v_{max} = A\\omega$।"),
            formula: ["\\omega = \\sqrt{\\dfrac{k}{m}}", "v_{max} = A\\omega"],
            solution: `$\\omega = \\sqrt{${k}/${en(m)}} \\approx ${en(Math.sqrt(k / m), 3)}\\ \\text{rad/s}$\n$v_{max} = ${en(A)} \\cdot ${en(Math.sqrt(k / m), 3)} \\approx ${en(vm, 3)}\\ \\text{m/s}$`,
          });
        }
        const m = r.pick([0.2, 0.5, 1, 2]), f = r.pick([0.5, 1, 2, 2.5, 5]);
        const k = m * (TP * f) ** 2;
        return task({
          text: L(
            `A ${en(m)} kg mass on a spring oscillates with a frequency of ${en(f)} Hz. What is the spring constant, in N/m?${roundToL(1, lang)}`,
            `स्प्रिंग से जुड़ा ${en(m)} kg का एक द्रव्यमान ${en(f)} Hz की आवृत्ति से दोलन करता है। स्प्रिंग नियतांक N/m में ज्ञात कीजिए।${roundToL(1, lang)}`,
          ),
          answer: numM(k, 1, [[m * TP * f, L("Square $\\omega$: $k = m\\omega^2$.", "$\\omega$ का वर्ग लीजिए: $k = m\\omega^2$।")], [m * f * f, L("Convert frequency to angular frequency: $\\omega = 2\\pi f$.", "आवृत्ति को कोणीय आवृत्ति में बदलिए: $\\omega = 2\\pi f$।")]]),
          data: { given: [dq("m", m, "kg"), dq("f", f, "Hz")], find: ["k"] },
          hint: L("Convert the frequency to angular frequency, then use $\\omega^2 = k/m$.", "आवृत्ति को कोणीय आवृत्ति में बदलिए, फिर $\\omega^2 = k/m$ का प्रयोग कीजिए।"),
          formula: ["\\omega = 2\\pi f", "k = m\\omega^2"],
          solution: `$\\omega = 2\\pi \\cdot ${en(f)} \\approx ${en(TP * f, 3)}\\ \\text{rad/s}$\n$k = ${en(m)} \\cdot ${en(TP * f, 3)}^2 \\approx ${en(k, 1)}\\ \\text{N/m}$`,
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const A = r.pick([0.05, 0.1, 0.2]), w = r.int(2, 10), fr = r.pick([0.25, 0.4, 0.5, 0.6, 0.8]);
        const x = A * fr, vv = w * Math.sqrt(A * A - x * x);
        return task({
          text: L(
            `A particle in SHM has amplitude ${en(A)} m and angular frequency ${w} rad/s. What is its speed when it is ${en(x)} m from equilibrium, in m/s?${roundToL(3, lang)}`,
            `सरल आवर्त गति करते एक कण का आयाम ${en(A)} m और कोणीय आवृत्ति ${w} rad/s है। साम्यावस्था से ${en(x)} m की दूरी पर उसकी चाल m/s में ज्ञात कीजिए।${roundToL(3, lang)}`,
          ),
          answer: numM(vv, 3, [[A * w, L("That is the maximum speed (at equilibrium); here the particle is displaced.", "यह अधिकतम चाल है (साम्यावस्था पर); यहाँ कण विस्थापित है।")], [w * (A - x), L("Use $\\sqrt{A^2 - x^2}$, not $A - x$.", "$A - x$ नहीं, $\\sqrt{A^2 - x^2}$ का प्रयोग कीजिए।")], [w * x, L("The speed is largest at $x = 0$: use $\\sqrt{A^2 - x^2}$.", "चाल $x = 0$ पर अधिकतम होती है: $\\sqrt{A^2 - x^2}$ का प्रयोग कीजिए।")]]),
          data: { given: [dq("A", A, "m"), dq("\\omega", w, "rad/s"), dq("x", x, "m")], find: ["v"] },
          hint: L("Use energy conservation: $\\tfrac12 kA^2 = \\tfrac12 kx^2 + \\tfrac12 mv^2$, which gives $v = \\omega\\sqrt{A^2 - x^2}$.", "ऊर्जा संरक्षण का प्रयोग कीजिए: $\\tfrac12 kA^2 = \\tfrac12 kx^2 + \\tfrac12 mv^2$, जिससे $v = \\omega\\sqrt{A^2 - x^2}$ मिलता है।"),
          formula: "v = \\omega\\sqrt{A^2 - x^2}",
          solution: `$A^2 - x^2 = ${en(A * A)} - ${en(x * x)} = ${en(A * A - x * x)}$\n$\\sqrt{${en(A * A - x * x)}} \\approx ${en(Math.sqrt(A * A - x * x), 4)}$\n$v = ${w} \\cdot ${en(Math.sqrt(A * A - x * x), 4)} \\approx ${en(vv, 3)}\\ \\text{m/s}$`,
        });
      }
      if (v === 1) {
        const T0 = r.pick([1, 1.5, 2, 2.4]), a = r.pick([2, 2.5, 4, 5]), up = r.next() < 0.5;
        const T = T0 * Math.sqrt(G / (up ? G + a : G - a));
        return task({
          text: L(
            `A pendulum has a period of ${en(T0)} s in a lift at rest. What is its period when the lift accelerates ${up ? "upward" : "downward"} at ${en(a)} m/s², in seconds?${roundToL(2, lang)}${gtxt}`,
            `विराम में स्थित लिफ़्ट में एक लोलक का आवर्तकाल ${en(T0)} s है। जब लिफ़्ट ${en(a)} m/s² से ${up ? "ऊपर" : "नीचे"} की ओर त्वरित होती है, तब लोलक का आवर्तकाल सेकंड में ज्ञात कीजिए।${roundToL(2, lang)}${gtxt}`,
          ),
          answer: numM(T, 2, [[T0 * Math.sqrt(G / (up ? G - a : G + a)), up ? L("Accelerating upward increases the effective gravity to $g + a$.", "ऊपर की ओर त्वरण प्रभावी गुरुत्व को बढ़ाकर $g + a$ कर देता है।") : L("Accelerating downward reduces the effective gravity to $g - a$.", "नीचे की ओर त्वरण प्रभावी गुरुत्व को घटाकर $g - a$ कर देता है।")], [T0, L("The effective gravity changes, so the period changes.", "प्रभावी गुरुत्व बदलता है, इसलिए आवर्तकाल भी बदलता है।")], [T0 * (G / (up ? G + a : G - a)), L("The period depends on $\\sqrt{1/g}$: take the square root of the ratio.", "आवर्तकाल $\\sqrt{1/g}$ पर निर्भर करता है: अनुपात का वर्गमूल लीजिए।")]]),
          data: { given: [dq("T_0", T0, "s"), dq("a", a, "m/s^2"), dq("g", 10, "m/s^2")], find: ["T"] },
          hint: L("In an accelerating lift replace $g$ by the effective gravity, then compare with the period at rest.", "त्वरित लिफ़्ट में $g$ के स्थान पर प्रभावी गुरुत्व रखिए, फिर विराम वाले आवर्तकाल से तुलना कीजिए।"),
          formula: ["g_{eff} = g " + (up ? "+" : "-") + " a", "T = T_0\\sqrt{\\dfrac{g}{g_{eff}}}"],
          solution: `$g_{eff} = 10 ${up ? "+" : "-"} ${en(a)} = ${en(up ? G + a : G - a)}\\ \\text{m/s}^2$\n$T = ${en(T0)}\\sqrt{\\dfrac{10}{${en(up ? G + a : G - a)}}}$\n$T \\approx ${en(T, 2)}\\ \\text{s}$`,
        });
      }
      if (v === 2) {
        const k = r.pick([100, 200, 400, 800]), A = r.pick([0.05, 0.1, 0.2]), fr = r.pick([0.25, 0.5, 0.6, 0.8]);
        const x = A * fr, Ek = 0.5 * k * (A * A - x * x);
        return task({
          text: L(
            `A block on a spring (k = ${k} N/m) oscillates with amplitude ${en(A)} m. What is its kinetic energy when the displacement is ${en(x)} m, in joules?${roundToL(3, lang)}`,
            `एक स्प्रिंग (k = ${k} N/m) से जुड़ा गुटका ${en(A)} m आयाम से दोलन करता है। जब विस्थापन ${en(x)} m हो, तब उसकी गतिज ऊर्जा जूल में ज्ञात कीजिए।${roundToL(3, lang)}`,
          ),
          answer: numM(Ek, 3, [[0.5 * k * x * x, L("That is the elastic energy at that point; KE is total minus elastic.", "यह उस बिंदु पर प्रत्यास्थ ऊर्जा है; गतिज ऊर्जा = कुल ऊर्जा − प्रत्यास्थ ऊर्जा।")], [0.5 * k * A * A, L("That is the total energy; subtract the elastic energy at $x$.", "यह कुल ऊर्जा है; $x$ पर प्रत्यास्थ ऊर्जा घटाइए।")], [0.5 * k * (A - x) ** 2, L("Use $A^2 - x^2$, not $(A - x)^2$.", "$(A - x)^2$ नहीं, $A^2 - x^2$ का प्रयोग कीजिए।")]]),
          data: { given: [dq("k", k, "N/m"), dq("A", A, "m"), dq("x", x, "m")], find: ["E_k"] },
          hint: L("Total energy $\\tfrac12 kA^2$ is shared between elastic and kinetic energy.", "कुल ऊर्जा $\\tfrac12 kA^2$ प्रत्यास्थ और गतिज ऊर्जा में बँटी रहती है।"),
          formula: "E_k = \\tfrac12 k (A^2 - x^2)",
          solution: `${L("Total", "कुल ऊर्जा")}: $\\tfrac12 \\cdot ${k} \\cdot ${en(A)}^2 = ${en(0.5 * k * A * A)}\\ \\text{J}$\n${L("Elastic at $x$", "$x$ पर प्रत्यास्थ ऊर्जा")}: $\\tfrac12 \\cdot ${k} \\cdot ${en(x)}^2 = ${en(0.5 * k * x * x)}\\ \\text{J}$\n$E_k = ${en(0.5 * k * A * A)} - ${en(0.5 * k * x * x)} \\approx ${en(Ek, 3)}\\ \\text{J}$`,
        });
      }
      const T0 = r.pick([0.4, 0.5, 0.6, 0.8, 1]), mode = r.pick(["series", "parallel", "half"]);
      const fac = mode === "series" ? Math.SQRT2 : 1 / Math.SQRT2;
      const T = T0 * fac;
      const setup = mode === "series"
        ? L("two identical springs joined end to end (in series)", "सिरे से सिरा जोड़ी गई (श्रेणीक्रम में) दो सर्वसम स्प्रिंगों")
        : mode === "parallel"
          ? L("two identical springs side by side (in parallel)", "अगल-बगल लगी (पार्श्वक्रम में) दो सर्वसम स्प्रिंगों")
          : L("one half of the spring (the spring is cut in two equal pieces)", "स्प्रिंग को दो बराबर टुकड़ों में काटकर उसके एक टुकड़े");
      return task({
        text: L(
          `A mass on a single spring oscillates with period ${en(T0)} s. What is the period if the same mass hangs from ${setup}, in seconds?${roundToL(3, lang)}`,
          `एक अकेली स्प्रिंग पर लटका द्रव्यमान ${en(T0)} s आवर्तकाल से दोलन करता है। यदि वही द्रव्यमान ${setup} से लटकाया जाए, तो आवर्तकाल सेकंड में ज्ञात कीजिए।${roundToL(3, lang)}`,
        ),
        answer: numM(T, 3, [[mode === "series" ? T0 / Math.SQRT2 : T0 * Math.SQRT2, mode === "series" ? L("Springs in series are softer ($k/2$), so the period gets longer.", "श्रेणीक्रम में स्प्रिंगें अधिक नरम होती हैं ($k/2$), इसलिए आवर्तकाल बढ़ता है।") : L("This arrangement is stiffer ($2k$), so the period gets shorter.", "यह व्यवस्था अधिक कठोर है ($2k$), इसलिए आवर्तकाल घटता है।")], [mode === "series" ? 2 * T0 : T0 / 2, L("The period depends on $\\sqrt{1/k}$: use the square root of the factor.", "आवर्तकाल $\\sqrt{1/k}$ पर निर्भर करता है: गुणक का वर्गमूल लीजिए।")]]),
        data: { given: [dq("T_0", T0, "s")], find: ["T"] },
        hint: L("Find the new spring constant first ($k/2$ for two in series; $2k$ in parallel or for half a spring), then use $T \\propto 1/\\sqrt{k}$.", "पहले नया स्प्रिंग नियतांक ज्ञात कीजिए (श्रेणीक्रम में दो स्प्रिंगों के लिए $k/2$; पार्श्वक्रम में या आधी स्प्रिंग के लिए $2k$), फिर $T \\propto 1/\\sqrt{k}$ का प्रयोग कीजिए।"),
        formula: ["T = 2\\pi\\sqrt{\\dfrac{m}{k}}", mode === "series" ? "k_{eff} = \\dfrac{k}{2}" : "k_{eff} = 2k"],
        solution: `$k_{eff} = ${mode === "series" ? "k/2" : "2k"}$\n$T = T_0\\sqrt{\\dfrac{k}{k_{eff}}} = ${en(T0)} \\cdot ${mode === "series" ? "\\sqrt2" : "\\tfrac{1}{\\sqrt2}"}$\n$T \\approx ${en(T, 3)}\\ \\text{s}$`,
      });
    },
  },
  {
    id: "exf-waves",
    topics: [T("waves-and-sound")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const f = r.pick([50, 100, 256, 440, 512, 1000]), lam = r.pick([0.34, 0.5, 0.68, 1.36, 2]);
        return task({
          text: L(
            `A sound wave has a frequency of ${f} Hz and a wavelength of ${lam} m. What is its speed, in m/s?`,
            `एक ध्वनि तरंग की आवृत्ति ${f} Hz और तरंगदैर्ध्य ${lam} m है। उसकी चाल m/s में ज्ञात कीजिए।`,
          ),
          answer: num(f * lam),
          hint: L("$v = f\\lambda$.", "सूत्र $v = f\\lambda$ का प्रयोग कीजिए।"),
          formula: "v = f\\lambda",
          solution: `$v = ${f} \\cdot ${lam} = ${en(f * lam)}\\ \\text{m/s}$`,
        });
      }
      if (level === 2) {
        const len = r.pick([0.5, 0.6, 0.8, 1]), v = r.pick([200, 300, 400]), n = r.int(1, 3);
        const f = (n * v) / (2 * len);
        const rt = Number.isInteger(f) ? "" : roundToL(1, lang);
        return task({
          text: L(
            `A string of length ${len} m is fixed at both ends. Waves travel along it at ${v} m/s. What is the frequency of the ${n === 1 ? "fundamental mode" : `harmonic number ${n}`}, in Hz?${rt}`,
            `${len} m लंबी एक डोरी दोनों सिरों पर बँधी है। उस पर तरंगें ${v} m/s की चाल से चलती हैं। ${n === 1 ? "मूल विधा" : `${n === 2 ? "द्वितीय" : "तृतीय"} गुणावृत्ति (n = ${n})`} की आवृत्ति Hz में ज्ञात कीजिए।${rt}`,
          ),
          answer: num(f, 1),
          hint: L("For a string fixed at both ends: $f_n = \\dfrac{n v}{2L}$.", "दोनों सिरों पर बँधी डोरी के लिए: $f_n = \\dfrac{n v}{2L}$।"),
          formula: "f_n = \\dfrac{n v}{2L}",
          solution: `$f_{${n}} = \\dfrac{${n} \\cdot ${v}}{2 \\cdot ${len}} ${Number.isInteger(f) ? "=" : "\\approx"} ${en(f, Number.isInteger(f) ? null : 1)}\\ \\text{Hz}$`,
        });
      }
      const f = r.pick([400, 500, 600]), vs = r.int(10, 40), v = 340;
      const f2 = (f * v) / (v - vs);
      return task({
        text: L(
          `An ambulance siren emits ${f} Hz and moves towards a stationary listener at ${vs} m/s. The speed of sound is 340 m/s. What frequency does the listener hear, in Hz?${roundToL(1, lang)}`,
          `एक एम्बुलेंस, जिसका सायरन ${f} Hz की ध्वनि उत्सर्जित करता है, ${vs} m/s की चाल से एक स्थिर श्रोता की ओर आ रही है। ध्वनि की चाल 340 m/s है। श्रोता को सुनाई देने वाली आवृत्ति Hz में ज्ञात कीजिए।${roundToL(1, lang)}`,
        ),
        answer: num(f2, 1),
        hint: L("Source moving towards the listener: $f' = f\\dfrac{v}{v - v_s}$.", "स्रोत श्रोता की ओर गतिमान है: $f' = f\\dfrac{v}{v - v_s}$।"),
        formula: "f' = f \\dfrac{v}{v - v_s}",
        solution: `$f' = ${f} \\cdot \\dfrac{340}{340 - ${vs}} \\approx ${en(f2, 1)}\\ \\text{Hz}$`,
      });
    },
  },
  {
    id: "exf-thermal",
    topics: [T("thermal-physics")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const m = r.pick([0.5, 1, 2, 3]), dT = r.int(10, 60), c = 4200;
        return task({
          text: L(
            `How much heat is needed to raise the temperature of ${m} kg of water by ${dT} °C, in kJ? (Specific heat capacity of water: 4200 J/(kg·K).)`,
            `${m} kg पानी का ताप ${dT} °C बढ़ाने के लिए आवश्यक ऊष्मा kJ में ज्ञात कीजिए। (पानी की विशिष्ट ऊष्मा धारिता: 4200 J/(kg·K)।)`,
          ),
          answer: num((m * c * dT) / 1000),
          hint: L("$Q = mc\\Delta T$.", "सूत्र $Q = mc\\Delta T$ का प्रयोग कीजिए।"),
          formula: "Q = m c \\Delta T",
          solution: `$Q = ${m} \\cdot 4200 \\cdot ${dT} = ${en(m * c * dT)}\\ \\text{J} = ${en((m * c * dT) / 1000)}\\ \\text{kJ}$`,
        });
      }
      if (level === 2) {
        const p1 = r.pick([100, 150, 200]), V1 = r.int(2, 10), T1 = r.pick([300, 280, 320]), T2 = T1 + r.int(20, 150), V2 = r.int(2, 12);
        const p2 = (p1 * V1 * T2) / (T1 * V2);
        return task({
          text: L(
            `A gas at ${p1} kPa occupies ${V1} L at ${T1} K. It is changed to ${V2} L at ${T2} K. What is its new pressure, in kPa?${roundToL(1, lang)}`,
            `${p1} kPa दाब और ${T1} K ताप पर एक गैस का आयतन ${V1} L है। फिर उसका ताप ${T2} K और आयतन ${V2} L कर दिया जाता है। गैस का नया दाब kPa में ज्ञात कीजिए।${roundToL(1, lang)}`,
          ),
          answer: num(p2, 1),
          hint: L("Combined gas law: $\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$.", "संयुक्त गैस नियम: $\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$।"),
          formula: "\\dfrac{p_1 V_1}{T_1} = \\dfrac{p_2 V_2}{T_2}",
          solution: `$p_2 = \\dfrac{${p1} \\cdot ${V1} \\cdot ${T2}}{${T1} \\cdot ${V2}} \\approx ${en(p2, 1)}\\ \\text{kPa}$`,
        });
      }
      const Th = r.pick([500, 600, 800, 1000]), Tc = r.pick([300, 250, 350]);
      const eta = (1 - Tc / Th) * 100;
      return task({
        text: L(
          `What is the maximum (Carnot) efficiency of a heat engine working between ${Th} K and ${Tc} K, in percent?${roundToL(1, lang)}`,
          `${Th} K और ${Tc} K के बीच कार्य करने वाले ऊष्मा इंजन की अधिकतम (कार्नो) दक्षता प्रतिशत में ज्ञात कीजिए।${roundToL(1, lang)}`,
        ),
        answer: num(eta, 1),
        hint: L("$\\eta = 1 - \\dfrac{T_c}{T_h}$.", "कार्नो दक्षता: $\\eta = 1 - \\dfrac{T_c}{T_h}$ (ताप केल्विन में)।"),
        formula: "\\eta = 1 - \\dfrac{T_c}{T_h}",
        solution: `$\\eta = 1 - \\dfrac{${Tc}}{${Th}} = ${en(eta / 100, 4)} \\approx ${en(eta, 1)}\\%$`,
      });
    },
  },
  {
    id: "exf-electrostatics",
    topics: [T("electrostatics-and-capacitors")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const q1 = r.int(1, 9), q2 = r.int(1, 9), d = r.pick([0.1, 0.2, 0.3, 0.5]);
        const F = (9e9 * q1 * 1e-6 * q2 * 1e-6) / (d * d);
        return task({
          text: L(
            `Two point charges of ${q1} μC and ${q2} μC are ${d} m apart in vacuum. What is the force between them, in newtons? (Take $k = 9 \\times 10^9\\ \\text{N·m}^2/\\text{C}^2$.)${roundToL(2, lang)}`,
            `निर्वात में ${q1} μC और ${q2} μC के दो बिंदु आवेश एक-दूसरे से ${d} m की दूरी पर हैं। उनके बीच लगने वाला बल न्यूटन में ज्ञात कीजिए। ($k = 9 \\times 10^9\\ \\text{N·m}^2/\\text{C}^2$ लीजिए।)${roundToL(2, lang)}`,
          ),
          answer: num(F, 2),
          hint: L("Coulomb's law: $F = k\\dfrac{q_1 q_2}{r^2}$.", "कूलॉम का नियम: $F = k\\dfrac{q_1 q_2}{r^2}$।"),
          formula: "F = k \\dfrac{q_1 q_2}{r^2}",
          solution: `$F = 9 \\times 10^9 \\cdot \\dfrac{${q1} \\times 10^{-6} \\cdot ${q2} \\times 10^{-6}}{${d}^2} \\approx ${en(F, 2)}\\ \\text{N}$`,
        });
      }
      if (level === 2) {
        const C1 = r.int(2, 12), C2 = r.int(2, 12), series = r.next() < 0.5;
        const C = series ? (C1 * C2) / (C1 + C2) : C1 + C2;
        return task({
          text: L(
            `Capacitors of ${C1} μF and ${C2} μF are connected in ${series ? "series" : "parallel"}. What is the equivalent capacitance, in μF?${series ? roundToL(2, lang) : ""}`,
            `${C1} μF और ${C2} μF के दो संधारित्र ${series ? "श्रेणीक्रम" : "पार्श्वक्रम"} में जुड़े हैं। तुल्य धारिता μF में ज्ञात कीजिए।${series ? roundToL(2, lang) : ""}`,
          ),
          answer: num(C, series ? 2 : null),
          hint: series ? L("In series: $\\dfrac1C = \\dfrac1{C_1} + \\dfrac1{C_2}$.", "श्रेणीक्रम में: $\\dfrac1C = \\dfrac1{C_1} + \\dfrac1{C_2}$।") : L("In parallel capacitances add.", "पार्श्वक्रम में धारिताएँ सीधे जुड़ती हैं।"),
          formula: series ? "\\dfrac{1}{C} = \\dfrac{1}{C_1} + \\dfrac{1}{C_2}" : "C = C_1 + C_2",
          solution: series ? `$C = \\dfrac{${C1} \\cdot ${C2}}{${C1} + ${C2}} \\approx ${en(C, 2)}\\ \\mu\\text{F}$` : `$C = ${C1} + ${C2} = ${C}\\ \\mu\\text{F}$`,
        });
      }
      const C = r.int(2, 50), V = r.int(5, 100);
      const E = 0.5 * C * 1e-6 * V * V * 1000;
      return task({
        text: L(
          `A ${C} μF capacitor is charged to ${V} V. How much energy does it store, in mJ?${roundToL(2, lang)}`,
          `${C} μF के एक संधारित्र को ${V} V तक आवेशित किया जाता है। उसमें संचित ऊर्जा mJ में ज्ञात कीजिए।${roundToL(2, lang)}`,
        ),
        answer: num(E, 2),
        hint: L("$E = \\tfrac12 C V^2$.", "संधारित्र में संचित ऊर्जा: $E = \\tfrac12 C V^2$।"),
        formula: "E = \\tfrac12 C V^2",
        solution: `$E = \\tfrac12 \\cdot ${C} \\times 10^{-6} \\cdot ${V}^2 \\approx ${en(E / 1000, 5)}\\ \\text{J} = ${en(E, 2)}\\ \\text{mJ}$`,
      });
    },
  },
  {
    id: "exf-circuits",
    topics: [T("current-electricity")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const R1 = r.int(2, 20), R2 = r.int(2, 20), V = r.pick([6, 9, 12, 24]);
      if (level === 1) {
        return task({
          text: L(
            `Resistors of ${R1} Ω and ${R2} Ω are connected in series to a ${V} V battery. What is the current in the circuit, in amperes?${roundToL(2, lang)}`,
            `${R1} Ω और ${R2} Ω के दो प्रतिरोधक श्रेणीक्रम में ${V} V की बैटरी से जुड़े हैं। परिपथ में धारा ऐम्पियर में ज्ञात कीजिए।${roundToL(2, lang)}`,
          ),
          answer: num(V / (R1 + R2), 2),
          hint: L("In series the resistances add; then $I = V/R$.", "श्रेणीक्रम में प्रतिरोध जुड़ते हैं; फिर $I = V/R$।"),
          formula: "I = \\dfrac{V}{R_1 + R_2}",
          solution: `$I = \\dfrac{${V}}{${R1} + ${R2}} \\approx ${en(V / (R1 + R2), 2)}\\ \\text{A}$`,
        });
      }
      if (level === 2) {
        const Rp = (R1 * R2) / (R1 + R2);
        return task({
          text: L(
            `Resistors of ${R1} Ω and ${R2} Ω are connected in parallel. What is their equivalent resistance, in ohms?${roundToL(2, lang)}`,
            `${R1} Ω और ${R2} Ω के दो प्रतिरोधक पार्श्वक्रम में जुड़े हैं। उनका तुल्य प्रतिरोध ओम में ज्ञात कीजिए।${roundToL(2, lang)}`,
          ),
          answer: num(Rp, 2),
          hint: L("$\\dfrac1R = \\dfrac1{R_1} + \\dfrac1{R_2}$.", "पार्श्वक्रम में: $\\dfrac1R = \\dfrac1{R_1} + \\dfrac1{R_2}$।"),
          formula: "R = \\dfrac{R_1 R_2}{R_1 + R_2}",
          solution: `$R = \\dfrac{${R1} \\cdot ${R2}}{${R1} + ${R2}} \\approx ${en(Rp, 2)}\\ \\Omega$`,
        });
      }
      const E = r.pick([6, 9, 12]), rr = r.pick([0.5, 1, 2]), R = r.int(3, 20);
      const I = E / (R + rr), Vt = I * R;
      return task({
        text: L(
          `A battery with emf ${E} V and internal resistance ${rr} Ω is connected to a ${R} Ω resistor. What is the terminal voltage, in volts?${roundToL(2, lang)}`,
          `${E} V विद्युत वाहक बल (emf) और ${rr} Ω आंतरिक प्रतिरोध वाली एक बैटरी ${R} Ω के प्रतिरोधक से जुड़ी है। बैटरी की टर्मिनल वोल्टता वोल्ट में ज्ञात कीजिए।${roundToL(2, lang)}`,
        ),
        answer: num(Vt, 2),
        hint: L("$I = \\dfrac{\\varepsilon}{R + r}$ and the terminal voltage is $IR$.", "$I = \\dfrac{\\varepsilon}{R + r}$ और टर्मिनल वोल्टता $IR$ है।"),
        formula: "U = \\varepsilon - I r",
        solution: `$I = \\dfrac{${E}}{${R} + ${rr}} \\approx ${en(I, 3)}\\ \\text{A}$\n$U = IR \\approx ${en(Vt, 2)}\\ \\text{V}$`,
      });
    },
  },
  {
    id: "exf-magnetism",
    topics: [T("magnetism-and-induction")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const B = r.pick([0.1, 0.2, 0.5, 1.5]), I = r.int(1, 10), len = r.pick([0.2, 0.5, 1, 2]);
        return task({
          text: L(
            `A straight wire of length ${len} m carries a current of ${I} A at right angles to a uniform magnetic field of ${B} T. What is the force on the wire, in newtons?`,
            `${len} m लंबे एक सीधे तार में ${I} A धारा बह रही है। तार ${B} T के एकसमान चुंबकीय क्षेत्र के लंबवत है। तार पर लगने वाला बल न्यूटन में ज्ञात कीजिए।`,
          ),
          answer: num(B * I * len),
          hint: L("$F = BIL\\sin\\theta$ with $\\theta = 90^\\circ$.", "$F = BIL\\sin\\theta$, जहाँ $\\theta = 90^\\circ$।"),
          formula: "F = B I L \\sin\\theta",
          solution: `$F = ${B} \\cdot ${I} \\cdot ${len} = ${en(B * I * len)}\\ \\text{N}$`,
        });
      }
      if (level === 2) {
        const N = r.pick([50, 100, 200, 500]), dPhi = r.pick([0.002, 0.005, 0.01, 0.02]), dt = r.pick([0.1, 0.2, 0.5]);
        const emf = (N * dPhi) / dt;
        return task({
          text: L(
            `The magnetic flux through a coil of ${N} turns changes by ${dPhi} Wb in ${dt} s. What is the magnitude of the induced emf, in volts?`,
            `${N} फेरों वाली एक कुंडली से गुजरने वाला चुंबकीय फ्लक्स ${dt} s में ${dPhi} Wb बदलता है। प्रेरित विद्युत वाहक बल (emf) का परिमाण वोल्ट में ज्ञात कीजिए।`,
          ),
          answer: num(emf),
          hint: L("Faraday's law: $\\varepsilon = N\\dfrac{\\Delta\\Phi}{\\Delta t}$.", "फैराडे का नियम: $\\varepsilon = N\\dfrac{\\Delta\\Phi}{\\Delta t}$।"),
          formula: "\\varepsilon = N\\dfrac{\\Delta \\Phi}{\\Delta t}",
          solution: `$\\varepsilon = ${N} \\cdot \\dfrac{${dPhi}}{${dt}} = ${en(emf)}\\ \\text{V}$`,
        });
      }
      const v = r.pick([1, 2, 5]) * 1e6, B = r.pick([0.1, 0.2, 0.5]);
      const R = (9.11e-31 * v) / (1.6e-19 * B) * 1000;
      return task({
        text: L(
          `An electron moves at ${en(v / 1e6)} × 10⁶ m/s perpendicular to a magnetic field of ${B} T. What is the radius of its circular path, in mm? (Electron mass $9.11 \\times 10^{-31}$ kg, charge $1.6 \\times 10^{-19}$ C.)${roundToL(3, lang)}`,
          `एक इलेक्ट्रॉन ${B} T के चुंबकीय क्षेत्र के लंबवत ${en(v / 1e6)} × 10⁶ m/s की चाल से गतिमान है। उसके वृत्तीय पथ की त्रिज्या mm में ज्ञात कीजिए। (इलेक्ट्रॉन का द्रव्यमान $9.11 \\times 10^{-31}$ kg, आवेश $1.6 \\times 10^{-19}$ C।)${roundToL(3, lang)}`,
        ),
        answer: num(R, 3),
        hint: L("The magnetic force provides the centripetal force: $qvB = \\dfrac{mv^2}{r}$.", "चुंबकीय बल ही अभिकेंद्र बल प्रदान करता है: $qvB = \\dfrac{mv^2}{r}$।"),
        formula: "r = \\dfrac{m v}{q B}",
        solution: `$r = \\dfrac{9.11 \\times 10^{-31} \\cdot ${en(v / 1e6)} \\times 10^6}{1.6 \\times 10^{-19} \\cdot ${B}} \\approx ${en(R, 3)}\\ \\text{mm}$`,
      });
    },
  },
  {
    id: "exf-optics",
    topics: [T("optics")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const rad = (d) => (d * Math.PI) / 180, deg = (x) => (x * 180) / Math.PI;
      // Hindijsko ime snovi je v sklonski obliki (»हीरे का«, »हीरे में«).
      const MED = [["water", 1.33, "जल"], ["glass", 1.5, "काँच"], ["diamond", 2.42, "हीरे"], ["ethanol", 1.36, "एथेनॉल"], ["quartz", 1.46, "क्वार्ट्ज़"], ["flint glass", 1.62, "फ्लिंट काँच"]];
      const [mnEn, n, mnHi] = r.pick(MED);
      const mn = L(mnEn, mnHi);
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0) {
          const vv = 3 / n;
          return task({
            text: L(
              `The refractive index of ${mn} is ${en(n)}. What is the speed of light in it, in units of $10^8$ m/s? (Speed of light in vacuum: $3 \\times 10^8$ m/s.)${roundToL(2, lang)}`,
              `${mn} का अपवर्तनांक ${en(n)} है। उसमें प्रकाश की चाल $10^8$ m/s की इकाई में ज्ञात कीजिए। (निर्वात में प्रकाश की चाल: $3 \\times 10^8$ m/s।)${roundToL(2, lang)}`,
            ),
            answer: numM(vv, 2, [[3 * n, L("Light is slower in a medium: divide by $n$.", "माध्यम में प्रकाश धीमा चलता है: $n$ से भाग दीजिए।")]]),
            data: { given: [`n = ${en(n)}`, "c = 3 \\times 10^8\\ \\mathrm{m/s}"], find: ["v"] },
            hint: L("The refractive index tells how many times slower light is in the medium.", "अपवर्तनांक बताता है कि माध्यम में प्रकाश निर्वात की तुलना में कितने गुना धीमा चलता है।"),
            formula: "n = \\dfrac{c}{v}",
            solution: `$v = \\dfrac{c}{n} = \\dfrac{3 \\times 10^8}{${en(n)}}$\n$v \\approx ${en(vv, 2)} \\times 10^8\\ \\text{m/s}$`,
          });
        }
        if (v === 1) {
          const i = r.int(15, 75);
          const ref = deg(Math.asin(Math.sin(rad(i)) / n));
          return task({
            text: L(
              `A ray of light passes from air into ${mn} (refractive index ${en(n)}) at an angle of incidence of ${i}°. What is the angle of refraction, in degrees?${roundToL(1, lang)}`,
              `प्रकाश की एक किरण ${i}° के आपतन कोण पर वायु से ${mn} (अपवर्तनांक ${en(n)}) में प्रवेश करती है। अपवर्तन कोण डिग्री में ज्ञात कीजिए।${roundToL(1, lang)}`,
            ),
            answer: numM(ref, 1, [[i / n, L("Snell's law relates the sines of the angles, not the angles.", "स्नेल का नियम कोणों की ज्याओं ($\\sin$) को जोड़ता है, स्वयं कोणों को नहीं।")], [90 - ref, L("Angles are measured from the normal, not from the surface.", "कोण अभिलंब से मापे जाते हैं, सतह से नहीं।")]]),
            data: { given: [`i = ${i}^\\circ`, `n = ${en(n)}`], find: ["r"] },
            hint: L("Snell's law with $n_1 = 1$ for air.", "वायु के लिए $n_1 = 1$ लेकर स्नेल का नियम लगाइए।"),
            formula: "n_1 \\sin i = n_2 \\sin r",
            solution: `$\\sin r = \\dfrac{\\sin ${i}^\\circ}{${en(n)}} = ${en(Math.sin(rad(i)) / n, 4)}$\n$r \\approx ${en(ref, 1)}^\\circ$`,
          });
        }
        if (v === 2) {
          const f = r.pick([10, 20, 25, 40, 50, 80]), conv = r.next() < 0.6;
          const P = (conv ? 100 : -100) / f;
          return task({
            text: L(
              `A ${conv ? "converging" : "diverging"} lens has a focal length of ${conv ? f : -f} cm. What is its power, in dioptres?${roundToL(2, lang)}${conv ? "" : " (A diverging lens has negative power.)"}`,
              `एक ${conv ? "अभिसारी" : "अपसारी"} लेंस की फोकस दूरी ${conv ? f : -f} cm है। उसकी क्षमता डाइऑप्टर में ज्ञात कीजिए।${roundToL(2, lang)}${conv ? "" : " (अपसारी लेंस की क्षमता ऋणात्मक होती है।)"}`,
            ),
            answer: numM(P, 2, [[(conv ? 1 : -1) / f, L("Convert the focal length to meters first.", "पहले फोकस दूरी को मीटर में बदलिए।")], [-P, L("Converging lenses have positive power, diverging lenses negative.", "अभिसारी लेंस की क्षमता धनात्मक और अपसारी लेंस की ऋणात्मक होती है।")]]),
            data: { given: [dq("f", conv ? f : -f, "cm")], find: ["P"] },
            hint: L("Power is the reciprocal of the focal length in meters.", "लेंस की क्षमता, मीटर में फोकस दूरी का व्युत्क्रम होती है।"),
            formula: "P = \\dfrac{1}{f}",
            solution: `$f = ${conv ? "" : "-"}${en(f / 100)}\\ \\text{m}$\n$P = \\dfrac{1}{${conv ? "" : "-"}${en(f / 100)}} = ${en(P, 2)}\\ \\text{D}$`,
          });
        }
        const R = r.pick([10, 16, 20, 30, 40, 50]);
        return task({
          text: L(
            `A concave mirror has a radius of curvature of ${R} cm. What is its focal length, in cm?`,
            `एक अवतल दर्पण की वक्रता त्रिज्या ${R} cm है। उसकी फोकस दूरी cm में ज्ञात कीजिए।`,
          ),
          answer: numM(R / 2, null, [[R, L("The focal length is half the radius of curvature.", "फोकस दूरी वक्रता त्रिज्या की आधी होती है।")], [2 * R, L("The focal length is half the radius, not double.", "फोकस दूरी त्रिज्या की आधी होती है, दुगुनी नहीं।")]]),
          data: { given: [dq("R", R, "cm")], find: ["f"] },
          hint: L("For a spherical mirror the focus lies halfway between the mirror and the centre of curvature.", "गोलीय दर्पण का फोकस दर्पण और वक्रता केंद्र के ठीक बीच में होता है।"),
          formula: "f = \\dfrac{R}{2}",
          solution: `$f = \\dfrac{R}{2} = \\dfrac{${R}}{2}$\n$f = ${en(R / 2)}\\ \\text{cm}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const f = r.pick([10, 12, 15, 20, 25]), u = f + r.pick([5, 8, 10, 15, 20, 30]);
          const vv = (u * f) / (u - f);
          return task({
            text: L(
              `An object is placed ${u} cm in front of a converging lens of focal length ${f} cm. How far from the lens is the image formed, in cm?${roundToL(1, lang)}`,
              `${f} cm फोकस दूरी वाले एक अभिसारी लेंस के सामने ${u} cm की दूरी पर एक बिंब रखा है। लेंस से प्रतिबिंब की दूरी cm में ज्ञात कीजिए।${roundToL(1, lang)}`,
            ),
            answer: numM(vv, 1, [[(u * f) / (u + f), L("Subtract: $\\tfrac1v = \\tfrac1f - \\tfrac1u$.", "घटाइए: $\\tfrac1v = \\tfrac1f - \\tfrac1u$।")], [u - f, L("Work with reciprocals, not with the distances themselves.", "दूरियों से सीधे नहीं, उनके व्युत्क्रमों से गणना कीजिए।")]]),
            data: { given: [dq("u", u, "cm"), dq("f", f, "cm")], find: ["v"] },
            hint: L("Thin lens equation: $\\dfrac1f = \\dfrac1u + \\dfrac1v$ (real-is-positive convention).", "पतले लेंस का समीकरण: $\\dfrac1f = \\dfrac1u + \\dfrac1v$ (वास्तविक दूरियाँ धनात्मक मानने वाली परिपाटी)।"),
            formula: "\\dfrac{1}{f} = \\dfrac{1}{u} + \\dfrac{1}{v}",
            solution: `$\\dfrac1v = \\dfrac1{${f}} - \\dfrac1{${u}} = \\dfrac{${u - f}}{${u * f}}$\n$v = \\dfrac{${u * f}}{${u - f}} \\approx ${en(vv, 1)}\\ \\text{cm}$`,
          });
        }
        if (v === 1) {
          const f = r.pick([10, 15, 20]), u = f + r.pick([5, 10, 20, 30]), h = r.pick([1, 2, 3, 4, 5]);
          const vv = (u * f) / (u - f), hi = (h * vv) / u;
          return task({
            text: L(
              `A ${h} cm tall object stands ${u} cm in front of a converging lens of focal length ${f} cm. How tall is the real image, in cm?${roundToL(2, lang)}`,
              `${h} cm ऊँचा एक बिंब ${f} cm फोकस दूरी वाले अभिसारी लेंस के सामने ${u} cm की दूरी पर रखा है। वास्तविक प्रतिबिंब की ऊँचाई cm में ज्ञात कीजिए।${roundToL(2, lang)}`,
            ),
            answer: numM(hi, 2, [[(h * u) / vv, L("Magnification is $v/u$, not $u/v$.", "आवर्धन $v/u$ है, न कि $u/v$।")], [vv, L("That is the image distance; you need the image height.", "यह प्रतिबिंब की दूरी है; आपको प्रतिबिंब की ऊँचाई चाहिए।")]]),
            data: { given: [dq("h", h, "cm"), dq("u", u, "cm"), dq("f", f, "cm")], find: ["h'"] },
            hint: L("Find the image distance $v$ first, then the magnification $v/u$.", "पहले प्रतिबिंब की दूरी $v$ ज्ञात कीजिए, फिर आवर्धन $v/u$।"),
            formula: ["\\dfrac{1}{f} = \\dfrac{1}{u} + \\dfrac{1}{v}", "\\dfrac{h'}{h} = \\dfrac{v}{u}"],
            solution: `$v = \\dfrac{${u} \\cdot ${f}}{${u} - ${f}} \\approx ${en(vv, 2)}\\ \\text{cm}$\n$m = \\dfrac{v}{u} \\approx ${en(vv / u, 3)}$\n$h' = ${h} \\cdot ${en(vv / u, 3)} \\approx ${en(hi, 2)}\\ \\text{cm}$`,
          });
        }
        if (v === 2) {
          const c = deg(Math.asin(1 / n));
          return task({
            text: L(
              `What is the critical angle for light going from ${mn} (refractive index ${en(n)}) into air, in degrees?${roundToL(1, lang)}`,
              `${mn} (अपवर्तनांक ${en(n)}) से वायु में जाने वाले प्रकाश के लिए क्रांतिक कोण डिग्री में ज्ञात कीजिए।${roundToL(1, lang)}`,
            ),
            answer: numM(c, 1, [[90 - c, L("The critical angle is measured from the normal.", "क्रांतिक कोण अभिलंब से मापा जाता है।")], [deg(Math.atan(1 / n)), L("Use the sine: $\\sin C = 1/n$.", "ज्या ($\\sin$) का प्रयोग कीजिए: $\\sin C = 1/n$।")]]),
            data: { given: [`n = ${en(n)}`], find: ["C"] },
            hint: L("At the critical angle the refracted ray grazes the surface ($r = 90^\\circ$).", "क्रांतिक कोण पर अपवर्तित किरण सतह को छूती हुई निकलती है ($r = 90^\\circ$)।"),
            formula: "\\sin C = \\dfrac{1}{n}",
            solution: `$\\sin C = \\dfrac{1}{${en(n)}} = ${en(1 / n, 4)}$\n$C \\approx ${en(c, 1)}^\\circ$`,
          });
        }
        const f1 = r.pick([10, 20, 25, 40, 50]), f2 = r.pick([-50, -40, 20, 25, 50, 100]);
        if (f1 + f2 === 0) return null;
        const P = 100 / f1 + 100 / f2, f = 100 / P;
        return task({
          text: L(
            `Two thin lenses with focal lengths ${f1} cm and ${f2} cm are placed in contact. What is the focal length of the combination, in cm?${roundToL(1, lang)}`,
            `${f1} cm और ${f2} cm फोकस दूरी वाले दो पतले लेंस एक-दूसरे के संपर्क में रखे हैं। इस संयोजन की फोकस दूरी cm में ज्ञात कीजिए।${roundToL(1, lang)}`,
          ),
          answer: numM(f, 1, [[f1 + f2, L("Powers add, not focal lengths: $1/f = 1/f_1 + 1/f_2$.", "फोकस दूरियाँ नहीं, क्षमताएँ जुड़ती हैं: $1/f = 1/f_1 + 1/f_2$।")], [P, L("That is the power in dioptres; convert it to a focal length.", "यह डाइऑप्टर में क्षमता है; इसे फोकस दूरी में बदलिए।")]]),
          data: { given: [dq("f_1", f1, "cm"), dq("f_2", f2, "cm")], find: ["f"] },
          hint: L("For lenses in contact the powers add.", "संपर्क में रखे लेंसों की क्षमताएँ जुड़ती हैं।"),
          formula: "\\dfrac{1}{f} = \\dfrac{1}{f_1} + \\dfrac{1}{f_2}",
          solution: `$P = \\dfrac{100}{${f1}} + \\dfrac{100}{${f2}} = ${en(P, 3)}\\ \\text{D}$\n$f = \\dfrac{100}{${en(P, 3)}} \\approx ${en(f, 1)}\\ \\text{cm}$`,
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const len = r.pick([60, 80, 90, 100, 120]), m = r.pick([2, 3, 4]);
        const u = len / (m + 1), vv = m * u, f = (u * vv) / len;
        return task({
          text: L(
            `A screen is ${len} cm from an object. A converging lens placed between them forms a sharp image ${m} times larger than the object on the screen. What is the focal length of the lens, in cm?${roundToL(1, lang)}`,
            `एक परदा बिंब से ${len} cm दूर है। उनके बीच रखा एक अभिसारी लेंस परदे पर बिंब से ${m} गुना बड़ा स्पष्ट प्रतिबिंब बनाता है। लेंस की फोकस दूरी cm में ज्ञात कीजिए।${roundToL(1, lang)}`,
          ),
          answer: numM(f, 1, [[u, L("That is the object distance; use the lens equation to find $f$.", "यह बिंब की दूरी है; $f$ के लिए लेंस समीकरण का प्रयोग कीजिए।")], [len / 4, L("$f = L/4$ only when the image is the same size as the object.", "$f = L/4$ केवल तब होता है जब प्रतिबिंब बिंब के बराबर आकार का हो।")], [len / m, L("$u + v = L$ and $v = mu$: solve for $u$ and $v$ first.", "$u + v = L$ और $v = mu$: पहले $u$ और $v$ ज्ञात कीजिए।")]]),
          data: { given: [dq("L", len, "cm"), `m = ${m}`], find: ["f"] },
          hint: L("Use $u + v = L$ and $v = m u$ to find $u$ and $v$, then the lens equation.", "$u + v = L$ और $v = m u$ से $u$ और $v$ ज्ञात कीजिए, फिर लेंस समीकरण लगाइए।"),
          formula: ["u + v = L", "v = m u", "\\dfrac{1}{f} = \\dfrac{1}{u} + \\dfrac{1}{v}"],
          solution: `$u + ${m}u = ${len} \\Rightarrow u = ${en(u, 2)}\\ \\text{cm}$\n$v = ${m}u = ${en(vv, 2)}\\ \\text{cm}$\n$f = \\dfrac{uv}{u + v} = \\dfrac{${en(u, 2)} \\cdot ${en(vv, 2)}}{${len}} \\approx ${en(f, 1)}\\ \\text{cm}$`,
        });
      }
      if (v === 1) {
        const h = r.pick([0.8, 1, 1.2, 1.5, 2, 2.5]), nw = r.pick([1.33, 1.36]);
        const C = Math.asin(1 / nw), R = h * Math.tan(C);
        return task({
          text: L(
            `A small lamp lies at the bottom of a pool ${en(h)} m deep, filled with a liquid of refractive index ${en(nw)}. Light leaves the surface only through a bright circle above the lamp. What is the radius of this circle, in meters?${roundToL(2, lang)}`,
            `${en(h)} m गहरे एक कुंड की तली पर एक छोटा लैंप रखा है; कुंड ${en(nw)} अपवर्तनांक वाले द्रव से भरा है। प्रकाश सतह से केवल लैंप के ऊपर बने एक चमकीले वृत्त से ही बाहर निकलता है। इस वृत्त की त्रिज्या मीटर में ज्ञात कीजिए।${roundToL(2, lang)}`,
          ),
          answer: numM(R, 2, [[h * Math.sin(C), L("Radius $= h\\tan C$, not $h\\sin C$ (draw the right triangle).", "त्रिज्या $= h\\tan C$, न कि $h\\sin C$ (समकोण त्रिभुज बनाइए)।")], [h / Math.tan(C), L("$\\tan C$ = radius / depth, not depth / radius.", "$\\tan C$ = त्रिज्या / गहराई, न कि गहराई / त्रिज्या।")], [2 * R, L("That is the diameter of the circle.", "यह वृत्त का व्यास है।")]]),
          data: { given: [dq("h", h, "m"), `n = ${en(nw)}`], find: ["R"] },
          hint: L("Outside the circle the rays are totally internally reflected. Find the critical angle, then use the right triangle.", "वृत्त के बाहर पहुँचने वाली किरणों का पूर्ण आंतरिक परावर्तन होता है। क्रांतिक कोण ज्ञात कीजिए, फिर समकोण त्रिभुज का प्रयोग कीजिए।"),
          formula: ["\\sin C = \\dfrac{1}{n}", "R = h \\tan C"],
          solution: `$\\sin C = 1/${en(nw)} = ${en(1 / nw, 4)}$, $C \\approx ${en(deg(C), 2)}^\\circ$\n$\\tan C \\approx ${en(Math.tan(C), 4)}$\n$R = ${en(h)} \\cdot ${en(Math.tan(C), 4)} \\approx ${en(R, 2)}\\ \\text{m}$`,
        });
      }
      if (v === 2) {
        const A = r.pick([30, 45, 60]), np = r.pick([1.5, 1.52, 1.6]);
        const dm = 2 * deg(Math.asin(np * Math.sin(rad(A / 2)))) - A;
        return task({
          text: L(
            `A prism with apex angle ${A}° is made of glass with refractive index ${en(np)}. What is the angle of minimum deviation, in degrees?${roundToL(1, lang)}`,
            `${A}° प्रिज़्म कोण वाला एक प्रिज़्म ${en(np)} अपवर्तनांक वाले काँच से बना है। न्यूनतम विचलन कोण डिग्री में ज्ञात कीजिए।${roundToL(1, lang)}`,
          ),
          answer: numM(dm, 1, [[(np - 1) * A, L("$(n-1)A$ is only a thin-prism approximation; compute exactly.", "$(n-1)A$ केवल पतले प्रिज़्म के लिए सन्निकटन है; सटीक गणना कीजिए।")], [deg(Math.asin(np * Math.sin(rad(A / 2)))), L("That is the angle of incidence $i$; deviation is $2i - A$.", "यह आपतन कोण $i$ है; विचलन $2i - A$ है।")]]),
          data: { given: [`A = ${A}^\\circ`, `n = ${en(np)}`], find: ["\\delta_{min}"] },
          hint: L("At minimum deviation the ray inside the prism makes the angle $A/2$ with the normal; find $i$ and use $\\delta = 2i - A$.", "न्यूनतम विचलन पर प्रिज़्म के अंदर किरण अभिलंब से $A/2$ कोण बनाती है; $i$ ज्ञात कीजिए और $\\delta = 2i - A$ का प्रयोग कीजिए।"),
          formula: ["\\sin i = n \\sin\\dfrac{A}{2}", "\\delta_{min} = 2i - A"],
          solution: `$r = A/2 = ${A / 2}^\\circ$\n$\\sin i = ${en(np)} \\sin ${A / 2}^\\circ = ${en(np * Math.sin(rad(A / 2)), 4)}$, $i \\approx ${en(deg(Math.asin(np * Math.sin(rad(A / 2)))), 2)}^\\circ$\n$\\delta_{min} = 2i - ${A}^\\circ \\approx ${en(dm, 1)}^\\circ$`,
        });
      }
      const n2 = r.pick([1.33, 1.5]), real = r.pick([1, 1.5, 2, 3]);
      const app = real / n2;
      return task({
        text: L(
          `A fish is ${en(real)} m below the surface of ${n2 === 1.33 ? "water (n = 1.33)" : "a liquid with n = 1.5"}. A bird looks at it from directly above. How much closer to the surface does the fish appear, in meters?${roundToL(2, lang)}`,
          `एक मछली ${n2 === 1.33 ? "पानी (n = 1.33)" : "n = 1.5 वाले एक द्रव"} की सतह से ${en(real)} m नीचे है। एक पक्षी उसे ठीक ऊपर से देखता है। मछली अपनी वास्तविक स्थिति की तुलना में सतह के कितना अधिक निकट दिखाई देती है? मीटर में ज्ञात कीजिए।${roundToL(2, lang)}`,
        ),
        answer: numM(real - app, 2, [[app, L("That is the apparent depth; the question asks for the difference.", "यह आभासी गहराई है; प्रश्न में अंतर पूछा गया है।")], [real * n2 - real, L("Seen from air, objects in water appear shallower: divide by $n$.", "वायु से देखने पर पानी में रखी वस्तुएँ कम गहराई पर दिखती हैं: $n$ से भाग दीजिए।")]]),
        data: { given: [dq("d", real, "m"), `n = ${en(n2)}`], find: ["\\Delta d"] },
        hint: L("For near-normal viewing, apparent depth = real depth / $n$.", "लगभग अभिलंब दिशा से देखने पर, आभासी गहराई = वास्तविक गहराई / $n$।"),
        formula: ["d' = \\dfrac{d}{n}", "\\Delta d = d - d'"],
        solution: `$d' = \\dfrac{${en(real)}}{${en(n2)}} \\approx ${en(app, 3)}\\ \\text{m}$\n$\\Delta d = ${en(real)} - ${en(app, 3)} \\approx ${en(real - app, 2)}\\ \\text{m}$`,
      });
    },
  },
  {
    id: "exf-modern",
    topics: [T("modern-physics")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const HC = L("(Use $hc = 1240\\ \\text{eV·nm}$.)", "($hc = 1240\\ \\text{eV·nm}$ लीजिए।)");
      const inv = L("You inverted the ratio", "आपने अनुपात उलट दिया");
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0) {
          const T = r.pick([2, 3, 5, 8, 10, 12]), k = r.int(2, 5), N0 = r.pick([800, 1600, 3200, 6400, 12800]);
          return task({
            text: L(
              `A radioactive isotope has a half-life of ${T} days. Starting with ${N0} nuclei, how many remain undecayed after ${T * k} days?`,
              `एक रेडियोऐक्टिव समस्थानिक की अर्धायु ${T} दिन है। आरंभ में ${N0} नाभिक हों, तो ${T * k} दिन बाद कितने नाभिक अविघटित बचेंगे?`,
            ),
            answer: numM(N0 / 2 ** k, null, [[N0 / (2 * k), L("Halve the number once per half-life; do not divide by twice the number of half-lives.", "प्रत्येक अर्धायु में संख्या एक बार आधी कीजिए; अर्धायुओं की संख्या के दुगुने से भाग न दीजिए।")], [N0 - N0 / 2 ** k, L("That is the number that decayed; the question asks how many remain.", "यह विघटित नाभिकों की संख्या है; प्रश्न में बचे हुए नाभिक पूछे गए हैं।")]]),
            data: { given: [dq("T_{1/2}", T, "days"), dq("N_0", N0), dq("t", T * k, "days")], find: ["N"] },
            hint: L("Count the half-lives and halve that many times.", "अर्धायुओं की संख्या गिनिए और संख्या को उतनी बार आधा कीजिए।"),
            formula: "N = N_0 \\left(\\tfrac12\\right)^{t/T_{1/2}}",
            solution: `$t/T_{1/2} = ${T * k}/${T} = ${k}$ ${L("half-lives", "अर्धायु")}\n$N = ${N0}/2^{${k}} = ${N0 / 2 ** k}$`,
          });
        }
        if (v === 1) {
          const lam = r.pick([310, 400, 450, 496, 550, 620, 656, 248]);
          const E = 1240 / lam;
          return task({
            text: L(
              `What is the energy of a photon of wavelength ${lam} nm, in eV? ${HC}${roundToL(2, lang)}`,
              `${lam} nm तरंगदैर्ध्य वाले फोटॉन की ऊर्जा eV में ज्ञात कीजिए। ${HC}${roundToL(2, lang)}`,
            ),
            answer: numM(E, 2, [[lam / 1240, `${inv}: $E = hc/\\lambda$${L(".", "।")}`], [1240 * lam, L("Divide $hc$ by the wavelength.", "$hc$ को तरंगदैर्ध्य से भाग दीजिए।")]]),
            data: { given: [dq("\\lambda", lam, "nm"), "hc = 1240\\ \\mathrm{eV\\,nm}"], find: ["E"] },
            hint: L("Photon energy is inversely proportional to the wavelength.", "फोटॉन की ऊर्जा तरंगदैर्ध्य के व्युत्क्रमानुपाती होती है।"),
            formula: "E = \\dfrac{hc}{\\lambda}",
            solution: `$E = \\dfrac{1240}{${lam}}$\n$E \\approx ${en(E, 2)}\\ \\text{eV}$`,
          });
        }
        if (v === 2) {
          const V = r.pick([25, 50, 100, 150, 200, 400, 900]);
          const lam = 1.227 / Math.sqrt(V);
          return task({
            text: L(
              `An electron is accelerated from rest through a potential difference of ${V} V. What is its de Broglie wavelength, in nm? (Use $\\lambda = \\dfrac{1.227}{\\sqrt{V}}$ nm.)${roundToL(3, lang)}`,
              `एक इलेक्ट्रॉन को विरामावस्था से ${V} V के विभवांतर द्वारा त्वरित किया जाता है। उसकी दे ब्रॉग्ली तरंगदैर्ध्य nm में ज्ञात कीजिए। ($\\lambda = \\dfrac{1.227}{\\sqrt{V}}$ nm लीजिए।)${roundToL(3, lang)}`,
            ),
            answer: numM(lam, 3, [[1.227 / V, L("Take the square root of the voltage.", "वोल्टता का वर्गमूल लीजिए।")], [1.227 * Math.sqrt(V), L("Divide by $\\sqrt V$, do not multiply.", "$\\sqrt V$ से भाग दीजिए, गुणा नहीं।")]]),
            data: { given: [dq("V", V, "V")], find: ["\\lambda"] },
            hint: L("Substitute the voltage into the given formula.", "दिए गए सूत्र में वोल्टता का मान रखिए।"),
            formula: "\\lambda = \\dfrac{1.227}{\\sqrt{V}}\\ \\text{nm}",
            solution: `$\\sqrt{${V}} \\approx ${en(Math.sqrt(V), 3)}$\n$\\lambda = \\dfrac{1.227}{${en(Math.sqrt(V), 3)}} \\approx ${en(lam, 3)}\\ \\text{nm}$`,
          });
        }
        const W = r.pick([1.9, 2.1, 2.3, 2.5, 3.1, 4.1, 4.3, 4.7]);
        const l0 = 1240 / W;
        return task({
          text: L(
            `A metal has a work function of ${en(W)} eV. What is the longest wavelength of light that can eject electrons from it, in nm? ${HC}${roundToL(0, lang)}`,
            `एक धातु का कार्य फलन ${en(W)} eV है। प्रकाश की वह अधिकतम तरंगदैर्ध्य nm में ज्ञात कीजिए, जो इस धातु से इलेक्ट्रॉन उत्सर्जित कर सके। ${HC}${roundToL(0, lang)}`,
          ),
          answer: numM(l0, 0, [[W * 1240, L("Divide $hc$ by the work function.", "$hc$ को कार्य फलन से भाग दीजिए।")], [W / 1240, `${inv}: $\\lambda_0 = hc/W$${L(".", "।")}`]]),
          data: { given: [dq("W", W, "eV"), "hc = 1240\\ \\mathrm{eV\\,nm}"], find: ["\\lambda_0"] },
          hint: L("At the threshold the photon energy just equals the work function.", "देहली पर फोटॉन की ऊर्जा ठीक कार्य फलन के बराबर होती है।"),
          formula: "\\lambda_0 = \\dfrac{hc}{W}",
          solution: `$\\lambda_0 = \\dfrac{1240}{${en(W)}}$\n$\\lambda_0 \\approx ${en(l0, 0)}\\ \\text{nm}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const lam = r.pick([200, 220, 250, 280, 300, 350, 400]), W = r.pick([2, 2.3, 2.5, 3, 4.2, 4.5]);
          const E = 1240 / lam, K = E - W;
          if (K <= 0.1) return null;
          const stop = r.next() < 0.5;
          return task({
            text: L(
              `Light of wavelength ${lam} nm falls on a metal with work function ${en(W)} eV. What is ${stop ? "the stopping potential, in volts" : "the maximum kinetic energy of the emitted photoelectrons, in eV"}? ${HC}${roundToL(2, lang)}`,
              `${lam} nm तरंगदैर्ध्य का प्रकाश ${en(W)} eV कार्य फलन वाली एक धातु पर पड़ता है। ${stop ? "निरोधी विभव वोल्ट में" : "उत्सर्जित प्रकाश-इलेक्ट्रॉनों की अधिकतम गतिज ऊर्जा eV में"} ज्ञात कीजिए। ${HC}${roundToL(2, lang)}`,
            ),
            answer: numM(K, 2, [[E, L("Subtract the work function from the photon energy.", "फोटॉन की ऊर्जा में से कार्य फलन घटाइए।")], [E + W, L("The work function is used up, so subtract it.", "कार्य फलन के बराबर ऊर्जा इलेक्ट्रॉन को बाहर निकालने में खर्च होती है, इसलिए उसे घटाइए।")]]),
            data: { given: [dq("\\lambda", lam, "nm"), dq("W", W, "eV"), "hc = 1240\\ \\mathrm{eV\\,nm}"], find: [stop ? "V_s" : "K_{max}"] },
            hint: L("Find the photon energy, then subtract the work function.", "फोटॉन की ऊर्जा ज्ञात कीजिए, फिर उसमें से कार्य फलन घटाइए।"),
            formula: stop ? ["E = \\dfrac{hc}{\\lambda}", "eV_s = E - W"] : ["E = \\dfrac{hc}{\\lambda}", "K_{max} = E - W"],
            solution: `$E = 1240/${lam} \\approx ${en(E, 3)}\\ \\text{eV}$\n$K_{max} = ${en(E, 3)} - ${en(W)} \\approx ${en(K, 2)}\\ \\text{eV}$${stop ? `\n$V_s = K_{max}/e \\approx ${en(K, 2)}\\ \\text{V}$` : ""}`,
          });
        }
        if (v === 1) {
          const T = r.pick([4, 5, 6, 8, 10]), t = r.pick([3, 7, 9, 12, 15]), N0 = r.pick([1000, 2000, 5000]);
          if (t % T === 0) return null;
          const N = N0 * 2 ** (-t / T);
          return task({
            text: L(
              `A sample contains ${N0} radioactive nuclei with a half-life of ${T} h. How many remain after ${t} h?${roundToL(0, lang)}`,
              `एक नमूने में ${N0} रेडियोऐक्टिव नाभिक हैं, जिनकी अर्धायु ${T} h है। ${t} h बाद कितने नाभिक बचेंगे?${roundToL(0, lang)}`,
            ),
            answer: numM(N, 0, [[N0 * (1 - t / (2 * T)), L("Decay is exponential, not linear: use $2^{-t/T}$.", "क्षय चरघातांकी है, रैखिक नहीं: $2^{-t/T}$ का प्रयोग कीजिए।")], [N0 / 2 ** Math.round(t / T), L("The number of half-lives need not be a whole number.", "अर्धायुओं की संख्या का पूर्णांक होना आवश्यक नहीं है।")]]),
            data: { given: [dq("N_0", N0), dq("T_{1/2}", T, "h"), dq("t", t, "h")], find: ["N"] },
            hint: L("Find the (non-integer) number of half-lives $t/T$, then use $N = N_0 \\cdot 2^{-t/T}$.", "अर्धायुओं की (भिन्नात्मक) संख्या $t/T$ ज्ञात कीजिए, फिर $N = N_0 \\cdot 2^{-t/T}$ का प्रयोग कीजिए।"),
            formula: "N = N_0 \\cdot 2^{-t/T_{1/2}}",
            solution: `$t/T_{1/2} = ${t}/${T} = ${en(t / T, 3)}$\n$2^{-${en(t / T, 3)}} \\approx ${en(2 ** (-t / T), 4)}$\n$N = ${N0} \\cdot ${en(2 ** (-t / T), 4)} \\approx ${en(N, 0)}$`,
          });
        }
        if (v === 2) {
          const k = r.int(2, 5), t = r.pick([6, 8, 10, 12, 15, 20, 24]) * k, N0 = r.pick([1600, 3200, 6400]);
          const N = N0 / 2 ** k;
          return task({
            text: L(
              `A sample's activity falls from ${N0} Bq to ${N} Bq in ${t} minutes. What is the half-life, in minutes?`,
              `एक नमूने की ऐक्टिवता ${t} मिनट में ${N0} Bq से घटकर ${N} Bq रह जाती है। अर्धायु मिनट में ज्ञात कीजिए।`,
            ),
            answer: numM(t / k, null, [[t / 2, L("The activity halved more than once: count the halvings.", "ऐक्टिवता एक से अधिक बार आधी हुई है: गिनिए कि कितनी बार।")], [(t * N) / N0, L("Find how many times the activity halved, then divide the time by that number.", "ज्ञात कीजिए कि ऐक्टिवता कितनी बार आधी हुई, फिर समय को उस संख्या से भाग दीजिए।")]]),
            data: { given: [dq("A_0", N0, "Bq"), dq("A", N, "Bq"), dq("t", t, "min")], find: ["T_{1/2}"] },
            hint: L("How many times must you halve the starting activity to get the final activity?", "प्रारंभिक ऐक्टिवता को कितनी बार आधा करने पर अंतिम ऐक्टिवता मिलती है?"),
            formula: "\\dfrac{A}{A_0} = 2^{-t/T_{1/2}}",
            solution: `$\\dfrac{A_0}{A} = \\dfrac{${N0}}{${N}} = ${2 ** k} = 2^{${k}}$\n${L("So", "अतः")} $t = ${k}\\,T_{1/2}$\n$T_{1/2} = ${t}/${k} = ${t / k}\\ \\text{min}$`,
          });
        }
        const n1 = r.pick([1, 2]), n2 = n1 + r.int(1, 3);
        const E = 13.6 * (1 / (n1 * n1) - 1 / (n2 * n2)), lam = 1240 / E;
        return task({
          text: L(
            `An electron in a hydrogen atom drops from $n = ${n2}$ to $n = ${n1}$. What is the wavelength of the emitted photon, in nm? (Use $E_n = -13.6/n^2$ eV and $hc = 1240$ eV·nm.)${roundToL(0, lang)}`,
            `हाइड्रोजन परमाणु में एक इलेक्ट्रॉन $n = ${n2}$ से $n = ${n1}$ स्तर पर संक्रमण करता है। उत्सर्जित फोटॉन की तरंगदैर्ध्य nm में ज्ञात कीजिए। ($E_n = -13.6/n^2$ eV और $hc = 1240$ eV·nm लीजिए।)${roundToL(0, lang)}`,
          ),
          answer: numM(lam, 0, [[1240 / (13.6 / (n2 * n2)), L("Use the energy difference between the two levels, not one level.", "केवल एक स्तर की नहीं, दोनों स्तरों के ऊर्जा-अंतर का प्रयोग कीजिए।")], [1240 / (13.6 * (1 / n1 - 1 / n2)), L("The energies go as $1/n^2$: square the quantum numbers.", "ऊर्जा $1/n^2$ के अनुसार बदलती है: क्वांटम संख्याओं का वर्ग लीजिए।")]]),
          data: { given: [`n_i = ${n2}`, `n_f = ${n1}`, "hc = 1240\\ \\mathrm{eV\\,nm}"], find: ["\\lambda"] },
          hint: L("Find the energy difference of the two levels, then $\\lambda = hc/\\Delta E$.", "दोनों स्तरों का ऊर्जा-अंतर ज्ञात कीजिए, फिर $\\lambda = hc/\\Delta E$।"),
          formula: ["\\Delta E = 13.6\\left(\\dfrac{1}{n_1^2} - \\dfrac{1}{n_2^2}\\right)\\ \\text{eV}", "\\lambda = \\dfrac{hc}{\\Delta E}"],
          solution: `$\\Delta E = 13.6\\left(\\dfrac1{${n1 * n1}} - \\dfrac1{${n2 * n2}}\\right) \\approx ${en(E, 3)}\\ \\text{eV}$\n$\\lambda = \\dfrac{1240}{${en(E, 3)}} \\approx ${en(lam, 0)}\\ \\text{nm}$`,
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const lam = r.pick([200, 250, 300, 310, 400]), Vs = r.pick([0.5, 0.8, 1, 1.2, 1.5, 2]);
        const W = 1240 / lam - Vs;
        if (W <= 0.5) return null;
        return task({
          text: L(
            `When light of wavelength ${lam} nm shines on a metal, the stopping potential is ${en(Vs)} V. What is the work function of the metal, in eV? ${HC}${roundToL(2, lang)}`,
            `${lam} nm तरंगदैर्ध्य का प्रकाश एक धातु पर पड़ने पर निरोधी विभव ${en(Vs)} V होता है। धातु का कार्य फलन eV में ज्ञात कीजिए। ${HC}${roundToL(2, lang)}`,
          ),
          answer: numM(W, 2, [[1240 / lam + Vs, L("The work function is the photon energy minus the electrons' kinetic energy.", "कार्य फलन = फोटॉन की ऊर्जा − इलेक्ट्रॉनों की अधिकतम गतिज ऊर्जा।")], [1240 / lam, L("Subtract the kinetic energy $eV_s$ of the electrons.", "इलेक्ट्रॉनों की गतिज ऊर्जा $eV_s$ घटाइए।")]]),
          data: { given: [dq("\\lambda", lam, "nm"), dq("V_s", Vs, "V"), "hc = 1240\\ \\mathrm{eV\\,nm}"], find: ["W"] },
          hint: L("The stopping potential gives the maximum kinetic energy in eV directly.", "निरोधी विभव (वोल्ट में) से अधिकतम गतिज ऊर्जा सीधे eV में मिल जाती है।"),
          formula: ["E = \\dfrac{hc}{\\lambda}", "W = E - eV_s"],
          solution: `$E = 1240/${lam} \\approx ${en(1240 / lam, 3)}\\ \\text{eV}$\n$K_{max} = eV_s = ${en(Vs)}\\ \\text{eV}$\n$W = ${en(1240 / lam, 3)} - ${en(Vs)} \\approx ${en(W, 2)}\\ \\text{eV}$`,
        });
      }
      if (v === 1) {
        const T = r.pick([5, 8, 10, 12, 30]), pct = r.pick([10, 20, 25, 40, 60, 75, 90]);
        const t = T * Math.log2(100 / pct);
        return task({
          text: L(
            `A radioactive isotope has a half-life of ${T} years. How long does it take until only ${pct}% of the original nuclei remain, in years?${roundToL(1, lang)}`,
            `एक रेडियोऐक्टिव समस्थानिक की अर्धायु ${T} वर्ष है। मूल नाभिकों में से केवल ${pct}% बचने में कितना समय लगेगा? वर्षों में ज्ञात कीजिए।${roundToL(1, lang)}`,
          ),
          answer: numM(t, 1, [[T * Math.log2(100 / (100 - pct)), L(`That is the time until ${pct}% have DECAYED.`, `यह ${pct}% नाभिकों के विघटित होने तक का समय है।`)], [T * (100 - pct) / 50, L("Decay is exponential: use logarithms, not a straight line.", "क्षय चरघातांकी है: सीधी रेखा नहीं, लघुगणक का प्रयोग कीजिए।")]]),
          data: { given: [dq("T_{1/2}", T, "years"), `N/N_0 = ${pct}\\%`], find: ["t"] },
          hint: L("Solve $\\tfrac{N}{N_0} = 2^{-t/T}$ for $t$ with logarithms.", "$\\tfrac{N}{N_0} = 2^{-t/T}$ को लघुगणक की सहायता से $t$ के लिए हल कीजिए।"),
          formula: "t = T_{1/2} \\log_2\\dfrac{N_0}{N}",
          solution: `$\\dfrac{N_0}{N} = \\dfrac{100}{${pct}} = ${en(100 / pct, 4)}$\n$\\log_2 ${en(100 / pct, 4)} = \\dfrac{\\ln ${en(100 / pct, 4)}}{\\ln 2} \\approx ${en(Math.log2(100 / pct), 4)}$\n$t = ${T} \\cdot ${en(Math.log2(100 / pct), 4)} \\approx ${en(t, 1)}\\ \\text{${L("years", "वर्ष")}}$`,
        });
      }
      if (v === 2) {
        const P = r.pick([1, 2, 5, 10]), lam = r.pick([405, 532, 633, 650]);
        const E = (6.63e-34 * 3e8) / (lam * 1e-9), N = (P * 1e-3) / E / 1e15;
        return task({
          text: L(
            `A ${P} mW laser emits light of wavelength ${lam} nm. How many photons does it emit per second, in units of $10^{15}$? (Use $h = 6.63 \\times 10^{-34}$ J·s and $c = 3 \\times 10^8$ m/s.)${roundToL(2, lang)}`,
            `${P} mW का एक लेज़र ${lam} nm तरंगदैर्ध्य का प्रकाश उत्सर्जित करता है। वह प्रति सेकंड कितने फोटॉन उत्सर्जित करता है? उत्तर $10^{15}$ की इकाई में दीजिए। ($h = 6.63 \\times 10^{-34}$ J·s और $c = 3 \\times 10^8$ m/s लीजिए।)${roundToL(2, lang)}`,
          ),
          answer: numM(N, 2, [[(P / E) / 1e15, L("Convert milliwatts to watts.", "मिलीवाट को वाट में बदलिए।")], [(P * 1e-3 * E) / 1e15, L("Number of photons = power ÷ energy of one photon.", "फोटॉनों की संख्या = शक्ति ÷ एक फोटॉन की ऊर्जा।")]]),
          data: { given: [dq("P", P, "mW"), dq("\\lambda", lam, "nm"), "h = 6.63 \\times 10^{-34}\\ \\mathrm{J\\,s}", "c = 3 \\times 10^8\\ \\mathrm{m/s}"], find: ["N"] },
          hint: L("Find the energy of one photon in joules, then divide the power by it.", "एक फोटॉन की ऊर्जा जूल में ज्ञात कीजिए, फिर शक्ति को उससे भाग दीजिए।"),
          formula: ["E = \\dfrac{hc}{\\lambda}", "N = \\dfrac{P}{E}"],
          solution: `$E = \\dfrac{6.63 \\times 10^{-34} \\cdot 3 \\times 10^8}{${lam} \\times 10^{-9}} \\approx ${en(E * 1e19, 3)} \\times 10^{-19}\\ \\text{J}$\n$N = \\dfrac{${en(P * 1e-3)}}{${en(E * 1e19, 3)} \\times 10^{-19}} \\approx ${en(N, 2)} \\times 10^{15}\\ \\text{s}^{-1}$`,
        });
      }
      const [nuc, Z, A, mass] = r.pick([["^{4}_{2}\\mathrm{He}", 2, 4, 4.0026], ["^{12}_{6}\\mathrm{C}", 6, 12, 12], ["^{16}_{8}\\mathrm{O}", 8, 16, 15.9949], ["^{7}_{3}\\mathrm{Li}", 3, 7, 7.016], ["^{56}_{26}\\mathrm{Fe}", 26, 56, 55.9349]]);
      const mH = 1.0078, mn = 1.0087;
      const dm = Z * mH + (A - Z) * mn - mass, Eb = dm * 931.5, per = Eb / A;
      return task({
        text: L(
          `The atomic mass of $${nuc}$ is ${en(mass)} u. Using $m(^1\\mathrm{H}) = 1.0078$ u, $m_n = 1.0087$ u and 1 u = 931.5 MeV, what is the binding energy per nucleon, in MeV?${roundToL(2, lang)}`,
          `$${nuc}$ का परमाणु द्रव्यमान ${en(mass)} u है। $m(^1\\mathrm{H}) = 1.0078$ u, $m_n = 1.0087$ u और 1 u = 931.5 MeV लेकर प्रति न्यूक्लिऑन बंधन ऊर्जा MeV में ज्ञात कीजिए।${roundToL(2, lang)}`,
        ),
        answer: numM(per, 2, [[Eb, L("That is the total binding energy; divide by the number of nucleons.", "यह कुल बंधन ऊर्जा है; इसे न्यूक्लिऑनों की संख्या से भाग दीजिए।")], [Eb / Z, L("Divide by all nucleons $A$, not only the protons.", "केवल प्रोटॉनों की संख्या से नहीं, सभी न्यूक्लिऑनों $A$ से भाग दीजिए।")]]),
        data: { given: [dq("m", mass, "u"), dq("m_H", 1.0078, "u"), dq("m_n", 1.0087, "u"), `Z = ${Z}`, `A = ${A}`, "1\\ \\mathrm{u} = 931.5\\ \\mathrm{MeV}"], find: ["E_b/A"] },
        hint: L("Find the mass defect (mass of separate nucleons minus the atom's mass), convert it to energy, then divide by $A$.", "द्रव्यमान क्षति (अलग-अलग न्यूक्लिऑनों का कुल द्रव्यमान − परमाणु का द्रव्यमान) ज्ञात कीजिए, उसे ऊर्जा में बदलिए, फिर $A$ से भाग दीजिए।"),
        formula: ["\\Delta m = Z m_H + (A - Z) m_n - m", "E_b = \\Delta m \\cdot 931.5\\ \\text{MeV/u}"],
        solution: `$\\Delta m = ${Z} \\cdot 1.0078 + ${A - Z} \\cdot 1.0087 - ${en(mass)} = ${en(dm, 4)}\\ \\text{u}$\n$E_b = ${en(dm, 4)} \\cdot 931.5 \\approx ${en(Eb, 1)}\\ \\text{MeV}$\n$E_b/A = ${en(Eb, 1)}/${A} \\approx ${en(per, 2)}\\ \\text{MeV}$`,
      });
    },
  },
];
