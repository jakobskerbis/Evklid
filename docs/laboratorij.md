# Virtualni laboratorij

English summary for agents: simulated experiments where the student builds the setup (substances, equipment,
amounts, also wrong ones), measures with realistic instrument noise, records a table and a graph, sees the
consequences of mistakes and answers a conclusion question. Brief: j, point 8 of
`placljivi-paket/prompt-za-koordinatorja.md`. Quality bar: `docs/kakovost.md` §3 plus the rules below.

## Rules for every experiment

1. **Real laws and real data.** The model computes with the physical/chemical law and literature values
   (constants, densities, solubilities, indicator ranges, rates, gas volume at room conditions, heat losses).
   Every number in `public/sim/lab-model*.js` has a source in a comment or is marked »ocena« (estimate).
2. **Real equipment in real proportions** (fixed scale, a scale bar), real time, measurement noise from the
   instrument's datasheet accuracy (fixed calibration error + last-digit jitter, never more than the spec).
3. **Mistakes have consequences** that a real lab would show: overrange (OL), blown fuse, burnt resistor,
   short circuit (supply current limit), foam overflow, popped stopper, missing goggles.
4. **Table + graph + conclusion question** (one correct option, an explanation for every option).
5. **Simplifications are written in the sim** (`POENOSTAVITVE`, `POENOSTAVITVE_TITRACIJA`, `POENOSTAVITVE_ELEKTRIKA`, `POENOSTAVITVE_TOPLOTA`, `POENOSTAVITVE_INDIKATORJI`, »Kaj je poenostavljeno?«) and here.
6. **Test against literature** in `test/laboratorij.test.js` (titration: `test/laboratorij-titracija.test.js`, electricity: `test/laboratorij-elektrika.test.js`, heat: `test/laboratorij-toplota.test.js`, indicators: `test/laboratorij-indikatorji.test.js`) with the allowed deviation stated.
7. **Review:** pass 1 automatic, pass 2 an Opus expert check of the science and function, pass 3 look/phone/pedagogy
   (`docs/pregled.md`). Dangerous experiments are only simulated; a short video only when no realistic
   simulation is possible; home experiments get a safety note and an equipment list.

## Code

| File | What |
|---|---|
| `public/sim/lab-model.js` | models, no DOM (tests import it): `OhmBench`, `Co2Bench`, multimeter, fuse, lamp, `rng`/`gauss` |
| `public/sim/lab.js` | UI parts: `ticker` (real time, also with reduced motion), `lcd`, `dataTable`, `dataGraph`, `conclusion`, `eventLog`, `notes`, `fixed` |
| `public/sim/lab-fiz.js` | `labOhm` (engine `lab-ohm`) |
| `public/sim/lab-kem.js` | `labCo2` (engine `lab-co2`), `flaskLevel` |
| `public/sim/lab-model-titracija.js` | titration model, no DOM: `TitrBench`, `solvePH` (charge balance), indicators, burette/pipette/pH meter |
| `public/sim/lab-titracija.js` | `labTitracija` (engine `lab-titracija`) |
| `public/sim/lab-model-elektrika.js` | models, no DOM: `VezBench` (series/parallel/mixed netlist, reuses the `lab-model.js` meters, fuse, resistors, lamp, supply), `tester`, `MATERIALI` |
| `public/sim/lab-elektrika.js` | `labVezava` (engine `lab-vezava`), `labPrevodnost` (engine `lab-prevodnost`); circuit parts `drawMeter`, `drawResistor`, `drawLamp` shared with `labOhm` (`lab-fiz.js`) |
| `public/sim/lab-model-toplota.js` | heat models, no DOM: `Voda` (water + vessel, two nodes, losses through wall, bottom and surface incl. evaporation), `POSODE`, thermometer and balance, `GrelnikBench`, `MesanjeBench`, `FazeBench` (enthalpy model ice/brine/water/steam), `OhlajanjeBench`, `vrelisce` (Antoine), `talisceSoli` (CRC table) |
| `public/sim/lab-toplota.js` | `labGrelnik` (engine `lab-grelnik`), `labMesanje` (`lab-mesanje`), `labFaze` (`lab-faze`), `labOhlajanje` (`lab-ohlajanje`); time-speed control (×1 … ×300), auto-record at round times |
| `public/sim/lab-model-indikatorji.js` | indicator models, no DOM: `phMesanice` (charge balance with HCl, NaOH, acetic acid, carbonate, ammonia; `solvePH` from the titration model when only those three), `PH_VZORCI`, red cabbage scale `ZELJE`, universal paper `PAPIR`, `PhBench` (pH meter: calibration, carry-over), `DokazBench` (`ZIVILA`, `PRESKUSI`), `SlinaBench` (`AMILAZA`, `EPRUVETE`, `casRazgradnje`) |
| `public/sim/lab-indikatorji.js` | `labPh` (engine `lab-ph`), `labDokaz` (`lab-dokaz`), `labSlina` (`lab-slina`); CSS prefix `lab-ind-` |

Engines are registered in `public/sim/index.js` and shown at topics through `public/sim/katalog.js`.
The »Laboratorij« tab (`public/laboratorij.js`, `server/laboratorij.js`, `GET /api/students/:id/lab`) lists every `lab-` engine
once (deduped by engine + opts) with the topics it belongs to; a new experiment needs an entry in `LAB_INFO` in `katalog.js`
(subject, title, one-line description), which `test/laboratorij-pogled.test.js` checks. Lock = the textbook's lesson lock.

## Experiments

### `lab-ohm` – Ohm's law (FIZ-OS-9 tok in napetost, upor in Ohmov zakon; FIZ-SS-2 električni tok)
Supply 0–12 V with 1 A current limit; 0,5 W resistors 47/100/220/470 Ω (±5 %, colour bands) or a 6 V / 0,1 A lamp;
ammeter and voltmeter each in series, parallel or disconnected, with ranges. Data: 3½-digit multimeter
±(0,5 % + 2) V, ±(1 % + 2) mA, ±(2 % + 5) 10 A; 10 MΩ voltmeter; shunts 10/1/0,01 Ω; F fuses per IEC 60127-2 (hold at 1,5 In, blow above);
lamp P ∝ U^1,6, cold filament R/10. Tests: Ohm's law with burden to 0,01 %; R from the slope within tolerance;
voltmeter in series; ammeter in parallel blows the fuse; resistor burns at ~3 W, survives 1,44 W; lamp exponent.

### `lab-co2` – baking soda and acid, proof of CO₂ (KEM-OS-8 kisline in baze; KEM-OS-9 računanje z množino; KEM-SS-1 stehiometrija)
Lemon juice / vinegar / HCl 1 mol/L / water in a 100 mL Erlenmeyer flask on a 0,01 g balance; soda weighed on a boat;
no stopper, stopper with a tube into limewater or water, or a closed stopper; burning splint; stopwatch; Δm(t) graph.
Data: molar masses (IUPAC), citric acid 46,7 g/L (Penniston 2008), CO₂ solubility 0,038 mol/L at 20 °C (Sander 2015),
Ca(OH)₂ 1,73 g/L (CRC), Vm = 24,05 L/mol, CO₂ in the headspace weighs 0,63 g/L more than the air it replaced. Estimates: reaction time constants, foam lifetime, bubble absorption
in limewater, stopper pop pressure, CO₂ leaving an open flask. Tests: 1 g NaHCO₃ → 0,524 g CO₂ (after 1 h, ±0,005 g),
dissolved CO₂ and CO₂ in the headspace lower the loss at 30 s, limiting reagent, triprotic citric acid, limewater milky then clear,
splint below 15 % O₂, overflow and popped stopper.

### `lab-titracija` – acid–base titration with an indicator (KEM-OS-8 nevtralizacija in soli; KEM-SS-2 šibke kisline in baze, titracija)
Goggles; rinse the 50 mL burette with titrant, fill it with NaOH 0,1000 mol/L (exact, as a standardised solution), let the air out of the tip;
pipette 25,00 mL of HCl, acetic acid or vinegar diluted 1 : 10 (unknown c, seeded 0,08–0,12 mol/L) into a 100 mL Erlenmeyer flask on a white tile;
indicator (none, phenolphthalein, methyl orange, bromothymol blue) and optional pH meter; stopcock closed / drops (~2/s) / stream (~1 mL/s) / one drop;
the student reads the meniscus in a 15× zoom and types the readings; table of trials, concordance (0,10 mL), mean, computed c checked against
the student's own data and then against the true value with the likely causes; pH(V) graph 0–50 mL, pH 0–14, equivalence point from the steepest segment.
Model: pH from the charge balance (H⁺, OH⁻, Na⁺, Cl⁻, acetate with Ka), bisection on log[H⁺], ideal solutions. Data: Kw = 1,0·10⁻¹⁴ (25 °C),
Ka(CH₃COOH) = 1,75·10⁻⁵, pKa 4,756 (CRC Handbook; Harris); indicator ranges phenolphthalein 8,2–10,0, methyl orange 3,1–4,4, bromothymol blue 6,0–7,6
(CRC), pKIn 3,46 / 7,1 (Harris), 9,4 for phenolphthalein; colour from the In⁻ fraction (Henderson–Hasselbalch) through estimated absorbances.
End colour seen: two-colour indicators at the top of the range, phenolphthalein at the first faint pink (8,2). Burette class A ±0,05 mL (ISO 385,
smooth calibration error ≤ 0,04 mL between two readings), pipette class A ±0,03 mL (ISO 648), drop ~0,05 mL ±10 % (Harris).
Estimates: stream 1 mL/s and drops 0,1 mL/s, 0,8 mL water left in an unrinsed burette (titrant ~1,6 % weaker on the first fill), air bubble 0,2–0,5 mL
pushed out by a stream after 0,3–1,5 mL (drops do not move it), pH meter ±0,02 (0,01 resolution), indicator absorbances, transient colour at the drop
(0,3 s far from the end point, up to ~2,5 s near it), pipetting shortened to 3 s, 0,2 mL water in a pipette not rinsed with the sample (−0,8 %),
0,5 mL left on the wall of a rinsed flask (water: no error; sample: +2 %). Mistakes: no goggles (nothing starts), overshoot, wrong indicator,
no indicator, unrinsed burette, air bubble, wrong reading (hint), final reading below the initial one (refused), burette run to the 50 mL mark;
in the model only (no control yet): wet pipette and flask rinsed with the sample (`pipette(id, { pipeta, erlenmajerica })`). Tests (`test/laboratorij-titracija.test.js`):
initial pH of 0,1 M HCl 1,00 (±0,01) and acetic acid 2,88 (±0,02); equivalence 7,00 (±0,01) and 8,72 (±0,03), half-equivalence = pKa 4,76 (±0,02), +10 mL 1,37 / 4,58 and +30 mL 11,96 (±0,01, dilution by the added volume);
phenolphthalein within 0,05 mL and bromothymol blue within 0,1 mL of equivalence with HCl; methyl orange with acetic acid at 25–35 % of the
equivalence volume; careful titrations recover c within ±0,3 % (10 seeds, three samples); overshoot > +5 %; unrinsed burette +1,1 to +2,2 % on the first
titration, and that dilution shrinks after each top-up; air bubble adds its volume (±0,1 mL); wet pipette −0,5 to −1,1 %,
flask rinsed with sample +1,5 to +2,5 %, flask wet with water ±0,3 %; topping up never lowers the level, volume is conserved, the level stops at 50 mL; pipette, burette and pH meter within spec over 500 seeds; drops and flow; deterministic seed.

### `lab-vezava` – series and parallel circuits (FIZ-OS-9 električni krog; FIZ-SS-2 električna vezja)
Same supply, multimeter, fuses, 0,5 W resistors (47/100/220/470 Ω ±5 %) and 6 V / 0,1 A lamps as `lab-ohm` (each lamp ±5 % resistance, ocena; brightness ∝ P^(3,4/1,6)), plus a wire (0,02 Ω, ocena) and an
empty socket. Series or parallel with 2–3 elements, or mixed 1 + (2 ∥ 3); ammeter and voltmeter each in series or in parallel, at the supply
(series = main line, parallel = supply terminals) or at element 1–3. Netlist solved by nodal analysis with lamp iteration. Summary per circuit
(type, parts, U₀): I = I₁ + I₂, U = U₁ + U₂, U/I vs the total from the colour code; graph measured U/I vs computed R_total with y = x;
three conclusion questions (series voltages, parallel currents, lamps dim in series and a removed lamp breaks only a series circuit).
Mistakes: voltmeter in series (I ≈ 0), ammeter in parallel (fuse), wire across a branch (1 A current limit), 47 Ω at 12 V burns, lamps at 12 V in parallel burn.
Tests (`test/laboratorij-elektrika.test.js`): nominal totals; Kirchhoff sums in the model to 10⁻⁶ (series sum includes the 1 Ω ammeter burden);
measured U/I = R_true + R_ammeter within the summed meter specs and R_true within ±5 % of the colour code (200 seeds, 5 circuits);
lamps: parallel 0,9–1,1 of nominal and two parallel lamps differ in current by < 11 %, series 0,05–0,15 ((3/6)^3,4 = 0,095), removed lamp: series off, parallel unchanged ±0,02; the mistakes above; deterministic seed.

### `lab-prevodnost` – metals and non-metals, what conducts? (NAR-OS-7 elementi in spojine; KEM-OS-8 kovine)
Tester: 4,5 V flat battery (internal resistance 1,5 Ω, ocena), E10 lamp 3,8 V / 0,3 A (same lamp rules as ZARNICA) or a red LED (1,8 V) with 150 Ω,
two crocodile clips, optional ammeter (200 mA / 10 A; ~0,3 A through a metal shows OL on 200 mA). Samples 6 cm long: Cu, Al, Fe wire Ø 1 mm,
pencil lead Ø 0,5 mm, sulfur, glass, plastic, wood, rubber, paper, solid salt (1 cm² section); liquids between two copper plates (cell constant 50 m⁻¹, ocena):
NaCl 1/5/20 %, tap, distilled and sugar water. Data: ρ Cu 1,68·10⁻⁸, Al 2,65·10⁻⁸, Fe 9,7·10⁻⁸, S 2·10¹⁵ Ω m (CRC); NaCl solutions 1,6 / 7,0 / 19,6 S/m
(CRC, concentrative properties); estimates: pencil lead 3·10⁻⁵ Ω m, insulators 10¹⁰–10¹⁴ Ω m, tap water 0,05 S/m, distilled water on air 10⁻⁴ S/m,
decomposition voltage 2,1 V (bubbles), visibility limits (lamp 3 % of nominal light, LED 0,05 mA). Magnet, lustre and bend buttons; the student
sorts each sample into kovina / nekovina / drugo and checks (graphite conducts but is a non-metal; copper is a metal though not magnetic).
Graph: current vs salt % (lamp and LED). Tests: R of copper from ρ; metals light, graphite and 20 % salt water weakly, 1 % salt water not with the lamp
but with the LED (and bubbles), insulators and distilled/sugar water dark with both (< 0,1 mA); current rises with concentration; copper 0,3 A ± 10 %, and with the 200 mA range (1 Ω) below 1,5 In so the F 200 mA fuse holds (IEC 60127-2);
brightness Cu > graphite > 5 % salt; only iron is magnetic; metals and non-metals classified as in the textbook.

### Heat: shared model (`lab-model-toplota.js`)
Water and its vessel are two nodes (water T, vessel Tv). Water → vessel: 250 W/(m²·K) in series with half the wall (ocena); vessel → room:
half the wall in series with natural convection 4,5 W/(m²·K) (ocena) + radiation 4εσT³; bottom on the table 3 W/(m²·K) (ocena). Open surface: convection
6 W/(m²·K) (ocena), radiation (ε 0,96) and evaporation by the Chilton–Colburn analogy (Le 0,85) with vapour density from the Antoine equation and 50 % room
humidity (ocena); a lid replaces this with conduction through the lid. Vessels (masses, diameters, wall thickness are ocena): 400/600 mL borosilicate beaker
(c 830 at 20 °C, ~900 at 100 °C, model 840; k 1,14, Schott), styrofoam cup (k 0,035, EN 13163), porcelain cup (c 1085, k 1,5), enamelled mug, thermos (G = 0,01 W/K with stopper, ocena from ~10 K in 6 h).
Data: c water 4182 J/(kg·K) at 20 °C (IAPWS/CRC), ice 2100, L_f 334 kJ/kg, L_v 2257 kJ/kg at 100 °C (linear to 2454 at 20 °C), NaCl c 864 (CRC).
Digital thermometer ±0,5 °C, 0,1 °C, response time 4 s (offset ≤ 0,25, gain ≤ 0,1 %, jitter ≤ 0,06: worst case 0,48 °C at 120 °C); balance 0,1 g, ±0,2 g. Euler steps of 0,2 s.
Room 20 °C, tap water 18 °C (ocena).

### `lab-grelnik` – heater, Q = mcΔT vs W = UIt, efficiency (FIZ-OS-9 toplota, električno delo in moč, moč in izkoristek)
12 V / 50 W immersion heater (R = 2,88 Ω ±5 %) in a 400 mL beaker with 100–350 g of tap water (pour ±2 %, weighed on the balance), supply 0–30 V with a current limit
0,5–10 A (CC), ammeter 10 A (0,01 Ω) in series and voltmeter (autorange) across the heater, thermometer at the side, lid, stirring rod, stopwatch from the first switch-on,
time speed ×1/×10/×60, auto-record every 30 s. Table t, U, I, T; graph T(t); W = ŪĪt, Q = mcΔT (start T at t = 0, highest T after switch-off), η, warnings for ΔT < 3 K
and for an unstirred final reading. Heater: sheath 10 J/K, 2,0 W/K to water, 0,1 W/K to air, wire 2,5 K/W above the sheath (all ocena); thermal fuse 250 °C, wire burns at 650 °C (ocena).
Coil 0,5–3 cm above the bottom (less water → part of it in air). Unstirred water: the side probe reads up to 0,06 K/W · P lower (τ 120 s, stirring 4 s; ocena).
Mistakes: heater on dry (thermal fuse in ~1 min, voltmeter then shows the supply voltage and I = 0), shallow water, above 12 V (warning; the wire burns at ≥ 26 V within seconds and at 24 V after ~6 min as the water warms, only if the current limit lets more than ~8 A through; with the default 5 A limit it survives),
low current limit (CC), too much water (small ΔT, large relative error), reading without stirring, boiling.
Tests: R and 50 W ±10 % at 12 V; ideal 200 g, 50 W, 120 s → ΔT 7,17 K ±0,01 and Q = W; student's η 60–95 % over 20 seeds, lid + stirring > open + unstirred by ≥ 5 points
(means > 84 % and < 80 %), η below the water's share of the heat capacity; ΔT and relative error for 350 g vs 150 g; dry heater trips in 30–120 s, 30 V burns, 13 V survives 10 min, CC at 2 A.

### `lab-mesanje` – mixing warm and cold water (FIZ-OS-9 toplota; FIZ-SS-2 notranja energija in toplota; NAR-OS-6 toplota in temperatura)
Styrofoam cup (with or without lid) or glass beaker; cold water 50–150 g at 10–25 °C, warm water 50–150 g at 40–80 °C; weighed (balance) or poured to the mark (±5 %, ocena).
Cold water goes into the vessel at room temperature; the warm water is measured just before pouring, loses ~0,3 K while pouring (ocena) and floats on top: the probe at the bottom
reads low by 60 % of the mixing step (ocena), decaying with τ 150 s unstirred, 3 s stirred. Table (vessel, m₁ T₁, m₂ T₂, measured, computed), formula with the student's numbers,
graph T(t) after pouring with the computed T as a line. Mistakes: reading before stirring, not weighing, waiting long (cooling).
Tests: ideal 100 g 80 °C + 100 g 20 °C = 50,00 °C; styrofoam + lid within −1,5/+0,5 K of the student's formula, glass ≥ 1,5 K lower, unstirred ≥ 1 K lower (20 seeds).

### `lab-faze` – melting ice and boiling water (NAR-OS-6 agregatna stanja; FIZ-SS-2 notranja energija in toplota)
100/150/200 g crushed ice at −15 °C (ocena) in a 600 mL beaker on a hot plate (stage 1/2/3 → 80/150/250 W into the beaker, warm-up τ 90 s, cool-down 240 s; ocena),
optional 10 or 30 g NaCl (dissolves with τ 40 s, ocena), place: sea level, Ljubljana 295 m, Rogla 1517 m, Kredarica 2515 m (ISA pressure). Enthalpy model: ice and brine
in equilibrium on the liquidus (CRC freezing points of NaCl solutions, eutectic 23,3 % / −21,1 °C), above it water, at the boiling point (Antoine, plus boiling-point
elevation K_b·2·φ·b up to saturation 39,1 g/100 g) water evaporates. Probe in the middle or touching the bottom (+0,06 K/W · P, ocena). Auto-record every 30 s, graph T(t) in minutes,
two conclusion questions (constant T while melting; boiling point and pressure). Mistakes: probe on the bottom, boiling dry (plate switched off, warning).
Tests: ideal plateau length m L_f / P (±1,5 s); real heat during melting = m L_f ±10 % and readings 0,0 ± 0,5 °C; Antoine 100,0 at 101,325 kPa, 98,49 at 96 kPa (IF97), 99,0 in Ljubljana,
91,6 on Kredarica; boiling plateau in the model ±0,2 K and the reading ±0,7; boiling evaporates P/L_v (ideal ±1 %, real 80–100 %); CRC table vs ΔT = K_f·2·φ·b (±0,12 K); 10 g salt in 150 g ice: last ice melts at −3,93 ± 0,15 °C;
30 g salt cools to −21,1 °C; probe on the bottom reads > 4 K more.

### `lab-ohlajanje` – cooling of tea (FIZ-OS-9 prenos toplote; FIZ-SS-2 prevajanje toplote in sevanje; NAR-OS-6 toplota in temperatura)
200 g of tea at 90 °C (ocena) into up to three vessels at room temperature: porcelain cup with/without a saucer lid, enamelled mug, styrofoam cup with lid, thermos with/without stopper.
Same `Voda` model (Newton cooling through the wall plus evaporation from an open surface), three thermometers, speed ×10/×60/×300, auto-record every minute, graph T(t)
with three series, conclusion question (thermos, lid, evaporation). Tests: porcelain 90 → 55–68 °C in 10 min (ocena), lid and thermos slower, closed thermos k constant ±15 %, full closed thermos (350 g) loses 8–12 K in 6 h (calibration). Meters: thermometer at −20…120 °C within ±0,5 (500 seeds and the worst-case sum), balance ±0,2 g.

### `lab-ph` – pH of household substances (KEM-OS-8 kisline in baze, pH lestvica; KEM-SS-2 pH)
Goggles first (nothing starts without them). 13 samples: lemon juice, vinegar, cola, coffee, milk, tap water, distilled water, 1 % baking soda, soap,
toothpaste slurry, ammonia cleaner, drain cleaner, HCl 0,1 mol/L. Computed from the charge balance where one solute fits (vinegar 0,8 M acetic acid, 1 % NaHCO₃
= 0,119 M, 1 M NH₃, 0,5 M NaOH, HCl, distilled water with CO₂ from air: kH 0,034 mol/(L·atm), 420 ppm, pKa 6,35/10,33, NH₄⁺ 9,25, CRC); these can be diluted
1 : 10 and 1 : 100. Others take a seeded value in a literature range (FDA Approximate pH of Foods: lemon 2,0–2,6, vinegar 2,4–3,4, milk 6,4–6,8; cola 2,3–2,5
Reddy 2016; soap 9–10 Tarun 2014; coffee 4,8–5,2 Rao & Fuller 2018; tap water 7,2–7,7, toothpaste 7,5–9,5 ocena). Three ways to measure: red cabbage extract (8 colour bands,
Fossen 1998 / RSC scale, shown as a pH range), universal indicator paper (chart 0–14, read to the nearest field, error ≤ 1), pH meter (uncalibrated: offset
0,3–0,8, slope 90–97 %, ocena; calibrated with buffers 4,01/7,00/10,01: ±0,05; not rinsed between samples: 15 % of the difference to the previous sample,
decaying with τ 30 s, ocena). Coloured samples (cola, coffee) mask the indicator colour. The student sorts each measured sample into kislo/nevtralno/bazično
(true pH < 6,5 / 6,5–7,5 / > 7,5, both accepted within 0,2 of a boundary) on a pH line; table, scatter graph pH vs sample number per method; conclusion question
after five sorted samples and a second one after measuring a diluted acid. Tests: 0,8 M acetic acid 2,43 (±0,1), 1 % NaHCO₃ 8,34 (±0,2, unchanged by dilution),
0,1 M HCl 1,00, distilled water 5,6, NH₃ 11,6, NaOH 13,7; dilution 10× +1,00 (HCl) and +0,50 (vinegar); literature ranges; paper within ±1 (2000 draws);
cabbage bands; uncalibrated offset ≥ 0,15 at pH 5,6, calibrated within ±0,05 over 300 seeds × 5 samples; carry-over from drain cleaner > 0,5 pH.

### `lab-dokaz` – food tests (KEM-OS-9 ogljikovi hidrati, beljakovine; BIO-OS-8 prebavila in prehrana)
Samples: white bread, raw potato, apple juice, honey, egg white, milk, sunflower oil, table sugar, glucose, water (control); composition per 100 g from USDA
FoodData Central; solids mashed ~1 g in 5 mL (ocena), milk 1 : 1, egg white 1 : 4 (its ~0,4 % glucose then stays below the Fehling limit, so egg white is negative, as in school tables). Tests: iodine (Lugol) yellow-brown → blue-black with starch (≥ 0,01 %, ocena); Fehling's reagent only in a
boiling water bath (otherwise stays blue: mistake), colour steps blue/green/yellow/orange/brick-red as the Benedict semi-quantitative scale (0,1/0,5/1/1,5 %);
sucrose negative unless hydrolysed with a drop of HCl; biuret light blue → violet (≥ 0,2 %, ocena); grease spot on paper (≥ 2 % faint, ≥ 20 % clear; ocena).
Dirty dropper carries 5 % of the previous sample (false positive). The student decides »present / absent«; table with colour swatches, colour grid
(foods × tests) as the graph, conclusion about reducing sugars. Tests: starch–iodine, sucrose negative, hydrolysed sucrose and heated glucose positive,
unheated glucose negative, egg white Fehling negative, egg white and milk biuret positive, oil grease spot, water control negative in all four, dirty dropper false positive, goggles.

### `lab-slina` – salivary amylase digests starch (NAR-OS-7 prehranjevanje in prebava; BIO-OS-8 prebavila; BIO-OS-9 načrtovanje poskusa)
Six tubes of 1 % (or 5 %, mistake) starch with diluted saliva at 0, 20, 37, 70 °C, boiled saliva at 37 °C and a control without saliva; real minutes with
time speed ×1/×10/×60, an iodine drop from each tube every minute (colour by remaining starch: blue-black / dark blue / violet-brown / yellow-brown below 0,1 %, ocena).
Model (shape ocena, optimum ~37 °C and inactivation above ~60 °C as in Bernfeld 1955): V(T) = V37 · 2^((T−37)/10) · f(T)/f(37) with reversible loss
f = 1/(1 + e^((T−42)/4)), irreversible denaturation half-life 1 min at 60 °C (e-fold per 3 K), Michaelis–Menten Km 0,2 %, V37 so that 1 % starch clears in ~5 min;
saliva activity ±15 % per seed. Same dropper for all tubes carries 0,8 % of the enzyme into the next tube (boiled saliva then digests: mistake). Graph: time to
yellow-brown vs temperature; conclusion after 15 min. Tests: 37 °C in 5 ± 1 min, faster than 20 °C, faster than 0 °C; 70 °C and boiled never; curve peak 38 ± 3 °C;
5 % starch > 3× slower; with sampling 0 °C, 70 °C, boiled and control stay blue for 30 min; dirty dropper lets boiled saliva digest; deterministic seeds.

The colours of graph series (`--demo-a/b/c`) are now also defined for the Laboratorij tab (`.lab-view` in `textbook.css`); before, points there were black.

## Next (from j's list)
FIZ: pendulum and stopwatch, density and buoyancy in a measuring cylinder, refraction through a lens. KEM: flame test, electrolysis of water.
NAR: the same engines on more NAR-OS-6/7 topics. Indicators: enzyme pH dependence (amylase at pH 4/7/9, reuses `SlinaBench`), the 0 °C tube warmed to 37 °C, a home version of `lab-ph` with only red cabbage, Sudan III for fats, pH meter alkaline error. Heat: specific heat of metals (hot metal block into a calorimeter, reuses `MesanjeBench`),
solidification curve (cooling of stearic acid / salol), a separate stopwatch for `lab-grelnik` (now started by the switch), stirring as a choice in `lab-faze`. Each one: model + test first, then UI, then the three reviews.
