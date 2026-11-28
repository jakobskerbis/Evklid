// Revizija inštruktorja (P2-4, 25. 11. 2026): 208 kratkih odgovorov »Samo rezultat«, ~43 % subtilno napačnih.
// Kratki odgovori »Samo rezultat« (< 120 znakov), OŠ/SŠ/faks, MAT/FIZ/KEM. ok=false: subtilno napačen.
const C = [];
const add = (level, subj, q, a, ok, tag) => C.push({ level, subj, q, a, ok, tag });
const R = String.raw;
let seed = 7;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const fmt = (v) => String(+v.toPrecision(10)).replace(".", "{,}");
// OŠ aritmetika
for (let i = 0; i < 40; i++) {
  const a = 12 + Math.floor(rnd() * 80), b = 3 + Math.floor(rnd() * 9), c = 2 + Math.floor(rnd() * 20);
  const kind = i % 4;
  const [q, tex, v] = kind === 0 ? [`Koliko je ${a} · ${b} + ${c}?`, `${a} \\cdot ${b} + ${c}`, a * b + c]
    : kind === 1 ? [`Izračunaj ${a * b} : ${b} - ${c}`, `${a * b} : ${b} - ${c}`, a - c]
    : kind === 2 ? [`Koliko je ${a} + ${b} · ${c}?`, `${a} + ${b} \\cdot ${c}`, a + b * c]
    : [`Izračunaj ${a}% od ${c * 50}`, `${a}\\,\\% \\text{ od } ${c * 50}`, (a * c * 50) / 100];
  const wrong = i % 5 < 2;
  const w = pick([v + 1, v - 1, v * 10, v + 10]);
  // dve obliki: z računom ali samo rezultat
  const a1 = i % 2 ? `$${tex} = ${fmt(wrong ? w : v)}$` : `**Rezultat:** ${fmt(wrong ? w : v)}`;
  add("OS", "MAT", q, a1, !wrong, i % 2 ? "os-arit-racun" : "os-arit-gol");
}
// OŠ ulomki, ploščine
for (const [q, good, bad] of [
  ["Koliko je 3/4 + 1/8?", R`$\frac{3}{4} + \frac{1}{8} = \frac{7}{8}$`, R`$\frac{3}{4} + \frac{1}{8} = \frac{4}{12}$`],
  ["Koliko je 2/3 · 9?", R`$\frac{2}{3} \cdot 9 = 6$`, R`$\frac{2}{3} \cdot 9 = 3$`],
  ["Ploščina pravokotnika 7 cm × 4 cm?", R`$S = 7 \cdot 4 = 28\,\mathrm{cm^2}$`, R`$S = 7 \cdot 4 = 22\,\mathrm{cm^2}$`],
  ["Obseg kvadrata s stranico 6 cm?", R`$o = 4 \cdot 6 = 24\,\mathrm{cm}$`, R`$o = 6^2 = 36\,\mathrm{cm}$`],
  ["Koliko je 15 % od 80 €?", R`$0{,}15 \cdot 80 = 12\,€$`, R`$0{,}15 \cdot 80 = 15\,€$`],
  ["Pretvori 3,5 km v metre.", R`$3{,}5\,\mathrm{km} = 3500\,\mathrm{m}$`, R`$3{,}5\,\mathrm{km} = 350\,\mathrm{m}$`],
  ["Koliko minut je 2,5 h?", R`$2{,}5\,\mathrm{h} = 150\,\mathrm{min}$`, R`$2{,}5\,\mathrm{h} = 250\,\mathrm{min}$`],
  ["Koliko je 1000 - 1?", "**999**", "**990**"],
  ["Koliko je 7 · 8?", "**56**", "**54**"],
  ["Koliko je 144 : 12?", "**12**", "**14**"],
]) {
  add("OS", "MAT", q, good, true, "os-mix");
  add("OS", "MAT", q, bad, false, "os-mix");
}
// SŠ enačbe (presolve)
for (const [e, good, bad] of [
  ["2x + 3 = 11", "x = 4", "x = 5"], ["5x - 7 = 3x + 9", "x = 8", "x = -8"], ["3(x - 2) = 12", "x = 6", "x = 4"],
  ["x/4 + 1 = 3", "x = 8", "x = 2"], ["x^2 - 5x + 6 = 0", "x_1 = 2,\\ x_2 = 3", "x_1 = -2,\\ x_2 = -3"],
  ["x^2 = 49", "x_{1,2} = \\pm 7", "x = 7"], ["2x^2 - 8 = 0", "x_1 = -2,\\ x_2 = 2", "x_1 = -4,\\ x_2 = 4"],
  ["4x - 1 = 2x + 7", "x = 4", "x = 3"], ["7 - 2x = 1", "x = 3", "x = -3"], ["x^2 + 2x - 15 = 0", "x_1 = -5,\\ x_2 = 3", "x_1 = 5,\\ x_2 = -3"],
]) {
  add("SS", "MAT", `Reši enačbo ${e}`, `Rešitev: $${good}$.`, true, "ss-enacba");
  add("SS", "MAT", `Reši enačbo ${e}`, `Rešitev: $${bad}$.`, false, "ss-enacba");
}
// SŠ funkcije, trigonometrija, logaritmi, zaporedja (brez reševalnika)
for (const [q, good, bad] of [
  ["Izračunaj sin 30°.", R`$\sin 30^\circ = \frac{1}{2}$`, R`$\sin 30^\circ = \frac{\sqrt{3}}{2}$`],
  ["Izračunaj log_2 32.", R`$\log_2 32 = 5$`, R`$\log_2 32 = 16$`],
  ["Ničle funkcije f(x) = x^2 - 9?", R`$x_1 = -3,\ x_2 = 3$`, R`$x_1 = -9,\ x_2 = 9$`],
  ["Vsota prvih 10 naravnih števil?", R`$S_{10} = 55$`, R`$S_{10} = 45$`],
  ["Teme parabole y = x^2 - 4x + 1?", R`$T(2, -3)$`, R`$T(-2, -3)$`],
  ["Koliko je 5! ?", R`$5! = 120$`, R`$5! = 60$`],
  ["Koliko je \binom{6}{2}?", R`$\binom{6}{2} = 15$`, R`$\binom{6}{2} = 30$`],
  ["Razdalja med (1,2) in (4,6)?", R`$d = 5$`, R`$d = 7$`],
  ["Naklon premice skozi (0,1) in (2,5)?", R`$k = 2$`, R`$k = \frac{1}{2}$`],
  ["Izračunaj 2^{10}.", R`$2^{10} = 1024$`, R`$2^{10} = 1000$`],
  ["Koliko je \sqrt{0,49}?", R`$\sqrt{0{,}49} = 0{,}7$`, R`$\sqrt{0{,}49} = 0{,}07$`],
  ["Izračunaj cos 60°.", R`$\cos 60^\circ = 0{,}5$`, R`$\cos 60^\circ = 0{,}866$`],
]) {
  add("SS", "MAT", q, good, true, "ss-brez-resevalnika");
  add("SS", "MAT", q, bad, false, "ss-brez-resevalnika");
}
// SŠ fizika (enote)
for (const [q, good, bad] of [
  ["Hitrost 72 km/h v m/s?", R`$v = 72\,\mathrm{km/h} = 20\,\mathrm{m/s}$`, R`$v = 72\,\mathrm{km/h} = 200\,\mathrm{m/s}$`],
  ["Gostota telesa z maso 540 g in prostornino 200 cm³?", R`$\rho = \frac{540\,\mathrm{g}}{200\,\mathrm{cm^3}} = 2{,}7\,\mathrm{g/cm^3}$`, R`$\rho = \frac{540\,\mathrm{g}}{200\,\mathrm{cm^3}} = 27\,\mathrm{g/cm^3}$`],
  ["Tok pri U = 6 V in R = 12 Ω?", R`$I = \frac{6\,\mathrm{V}}{12\,\Omega} = 0{,}5\,\mathrm{A}$`, R`$I = \frac{6\,\mathrm{V}}{12\,\Omega} = 2\,\mathrm{A}$`],
  ["Sila na 2 kg telo s pospeškom 3 m/s²?", R`$F = 2\,\mathrm{kg} \cdot 3\,\mathrm{m/s^2} = 6\,\mathrm{N}$`, R`$F = 2\,\mathrm{kg} \cdot 3\,\mathrm{m/s^2} = 5\,\mathrm{N}$`],
  ["Teža 5 kg telesa (g = 9,81 m/s²)?", R`$F_g = 49{,}05\,\mathrm{N}$`, R`$F_g = 4{,}905\,\mathrm{N}$`],
  ["Kinetična energija 2 kg telesa pri 3 m/s?", R`$W_k = \frac{1}{2} \cdot 2 \cdot 3^2 = 9\,\mathrm{J}$`, R`$W_k = \frac{1}{2} \cdot 2 \cdot 3^2 = 18\,\mathrm{J}$`],
  ["Delo pri sili 10 N na poti 5 m?", R`$A = 50\,\mathrm{J}$`, R`$A = 2\,\mathrm{J}$`],
  ["Tlak sile 100 N na 2 m²?", R`$p = \frac{100\,\mathrm{N}}{2\,\mathrm{m^2}} = 50\,\mathrm{Pa}$`, R`$p = \frac{100\,\mathrm{N}}{2\,\mathrm{m^2}} = 200\,\mathrm{Pa}$`],
  ["Pot pri 15 m/s v 4 s?", R`$s = 15 \cdot 4 = 60\,\mathrm{m}$`, R`$s = 15 \cdot 4 = 600\,\mathrm{m}$`],
  ["Moč pri delu 600 J v 2 min?", R`$P = \frac{600\,\mathrm{J}}{120\,\mathrm{s}} = 5\,\mathrm{W}$`, R`$P = \frac{600\,\mathrm{J}}{2\,\mathrm{s}} = 300\,\mathrm{W}$`],
  ["Frekvenca pri nihajnem času 0,02 s?", R`$\nu = 50\,\mathrm{Hz}$`, R`$\nu = 5\,\mathrm{Hz}$`],
  ["Hitrost svetlobe v km/s?", R`$c \approx 300\,000\,\mathrm{km/s}$`, R`$c \approx 30\,000\,\mathrm{km/s}$`],
]) {
  add("SS", "FIZ", q, good, true, "ss-fiz");
  add("SS", "FIZ", q, bad, false, "ss-fiz");
}
// SŠ kemija
for (const [q, good, bad] of [
  ["Molska masa H2SO4?", R`$M(\mathrm{H_2SO_4}) = 98\,\mathrm{g/mol}$`, R`$M(\mathrm{H_2SO_4}) = 96\,\mathrm{g/mol}$`],
  ["Molska masa CO2?", R`$M = 12 + 2 \cdot 16 = 44\,\mathrm{g/mol}$`, R`$M = 12 + 16 = 28\,\mathrm{g/mol}$`],
  ["Koliko molov je 36 g vode?", R`$n = \frac{36\,\mathrm{g}}{18\,\mathrm{g/mol}} = 2\,\mathrm{mol}$`, R`$n = \frac{36\,\mathrm{g}}{18\,\mathrm{g/mol}} = 0{,}5\,\mathrm{mol}$`],
  ["pH raztopine s [H3O+] = 10^-3 mol/L?", R`$\mathrm{pH} = 3$`, R`$\mathrm{pH} = 11$`],
  ["Formula kalcijevega klorida?", R`$\mathrm{CaCl_2}$`, R`$\mathrm{CaCl}$`],
  ["Koliko elektronov ima Na+?", "**10 elektronov**", "**12 elektronov**"],
  ["Oksidacijsko število S v H2SO4?", "**+6**", "**+4**"],
  ["Masni delež soli v 20 g soli in 80 g vode?", R`$w = \frac{20}{100} = 20\,\%$`, R`$w = \frac{20}{80} = 25\,\%$`],
  ["Koncentracija 0,5 mol v 250 mL?", R`$c = \frac{0{,}5}{0{,}25} = 2\,\mathrm{mol/L}$`, R`$c = \frac{0{,}5}{0{,}25} = 0{,}2\,\mathrm{mol/L}$`],
  ["Uredi: H2 + O2 → H2O", R`$\mathrm{2H_2 + O_2 \rightarrow 2H_2O}$`, R`$\mathrm{H_2 + O_2 \rightarrow H_2O}$`],
]) {
  add("SS", "KEM", q, good, true, "ss-kem");
  add("SS", "KEM", q, bad, false, "ss-kem");
}
// faks
for (const [q, good, bad] of [
  ["Odvajaj f(x) = x^2 sin x", R`$f'(x) = 2x \sin x + x^2 \cos x$`, R`$f'(x) = 2x \cos x$`],
  ["Odvajaj f(x) = e^{3x}", R`$f'(x) = 3e^{3x}$`, R`$f'(x) = e^{3x}$`],
  ["Odvajaj x^3", R`$f'(x) = 3x^2$`, R`$f'(x) = 2x$`],
  ["Odvajaj f(x) = ln(x^2+1)", R`$f'(x) = \frac{2x}{x^2+1}$`, R`$f'(x) = \frac{1}{x^2+1}$`],
  ["Izračunaj ∫_0^3 x^2 dx", R`$\int_0^3 x^2\,dx = 9$`, R`$\int_0^3 x^2\,dx = 27$`],
  ["Izračunaj ∫_0^1 2x dx", R`$\int_0^1 2x\,dx = 1$`, R`$\int_0^1 2x\,dx = 2$`],
  ["lim_{x→0} sin(x)/x", R`$\lim_{x \to 0} \frac{\sin x}{x} = 1$`, R`$\lim_{x \to 0} \frac{\sin x}{x} = 0$`],
  ["Determinanta [[1,2],[3,4]]", R`$\det A = 1 \cdot 4 - 2 \cdot 3 = -2$`, R`$\det A = 1 \cdot 4 - 2 \cdot 3 = 2$`],
  ["Lastne vrednosti [[2,0],[0,3]]", R`$\lambda_1 = 2,\ \lambda_2 = 3$`, R`$\lambda_1 = 2,\ \lambda_2 = 6$`],
  ["Vsota vrste 1 + 1/2 + 1/4 + …", R`$S = 2$`, R`$S = 1$`],
  ["Rešite 2^x = 32", R`$x = 5$`, R`$x = 16$`],
  ["Rešite log_2 x = 3", R`$x = 8$`, R`$x = 6$`],
  ["Izračunaj ∫ cos x dx", R`$\int \cos x\,dx = \sin x + C$`, R`$\int \cos x\,dx = -\sin x + C$`],
  ["Koliko je i^2?", R`$i^2 = -1$`, R`$i^2 = 1$`],
  ["Rang matrike [[1,2],[2,4]]", "**Rang je 1.**", "**Rang je 2.**"],
  ["Povprečje 2, 4, 9?", R`$\bar{x} = 5$`, R`$\bar{x} = 4$`],
  ["P(dve šestici z dvema kockama)?", R`$P = \frac{1}{36}$`, R`$P = \frac{1}{12}$`],
  ["Energija fotona pri f = 5·10^14 Hz (h = 6,63·10^-34 Js)?", R`$E = h f \approx 3{,}3 \cdot 10^{-19}\,\mathrm{J}$`, R`$E = h f \approx 3{,}3 \cdot 10^{-20}\,\mathrm{J}$`],
  ["Odvod sin(2x)?", R`$f'(x) = 2\cos(2x)$`, R`$f'(x) = \cos(2x)$`],
  ["lim_{x→∞} (1+1/x)^x", R`$\lim_{x\to\infty} (1 + 1/x)^x = e$`, R`$\lim_{x\to\infty} (1 + 1/x)^x = 1$`],
]) {
  add("FAKS", "MAT", q, good, true, "faks");
  add("FAKS", "MAT", q, bad, false, "faks");
}
// dodatni pravilni kratki (da je ~40 % napačnih)
for (const [lvl, s, q, a] of [["OS", "MAT", "Koliko je 9 · 9?", "**81**"], ["OS", "MAT", "Koliko je 100 : 4?", "**25**"], ["OS", "MAT", "Koliko je 13 + 29?", "$13 + 29 = 42$"], ["SS", "MAT", "Izračunaj tan 45°.", R`$\tan 45^\circ = 1$`], ["SS", "FIZ", "Koliko je 1 kWh v J?", R`$1\,\mathrm{kWh} = 3{,}6 \cdot 10^6\,\mathrm{J}$`], ["SS", "KEM", "Avogadrovo število?", R`$N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$`], ["OS", "MAT", "Koliko je 0,5 · 0,4?", "$0{,}5 \\cdot 0{,}4 = 0{,}2$"], ["OS", "MAT", "Koliko je 3²?", "**9**"], ["SS", "MAT", "Izračunaj sin 90°.", R`$\sin 90^\circ = 1$`], ["FAKS", "MAT", "Odvajaj x^4", R`$f'(x) = 4x^3$`], ["OS", "MAT", "Koliko je 250 + 250?", "$250 + 250 = 500$"], ["SS", "FIZ", "Koliko je 36 km/h v m/s?", R`$36\,\mathrm{km/h} = 10\,\mathrm{m/s}$`], ["OS", "MAT", "Koliko je 5 + 3 · 2?", "$5 + 3 \\cdot 2 = 11$"], ["SS", "MAT", "Reši enačbo 3x = 12", "Rešitev: $x = 4$."], ["FAKS", "MAT", "Izračunaj ∫_0^2 x dx", R`$\int_0^2 x\,dx = 2$`], ["OS", "MAT", "Koliko je 48 : 6?", "$48 : 6 = 8$"], ["SS", "KEM", "Molska masa NaCl?", R`$M(\mathrm{NaCl}) = 58{,}5\,\mathrm{g/mol}$`], ["OS", "MAT", "Koliko je 1/2 + 1/4?", R`$\frac{1}{2} + \frac{1}{4} = \frac{3}{4}$`], ["SS", "FIZ", "Koliko je 2 h v s?", R`$2\,\mathrm{h} = 7200\,\mathrm{s}$`], ["OS", "MAT", "Koliko je 20 % od 60?", R`$20\,\% \cdot 60 = 12$`]]) add(lvl, s, q, a, true, "dodatni");
export default C;
