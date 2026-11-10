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
5. **Simplifications are written in the sim** (`POENOSTAVITVE`, `POENOSTAVITVE_TITRACIJA`, `POENOSTAVITVE_ELEKTRIKA`, `POENOSTAVITVE_TOPLOTA`, `POENOSTAVITVE_SILE`, `POENOSTAVITVE_INDIKATORJI`, `POENOSTAVITVE_OPTIKA`, `POENOSTAVITVE_ELEKTROKEMIJA`, `POENOSTAVITVE_GIBANJE`, `POENOSTAVITVE_MAGNETIZEM`, `POENOSTAVITVE_REAKCIJE`, »Kaj je poenostavljeno?«) and here.
6. **Test against literature** in `test/laboratorij.test.js` (titration: `test/laboratorij-titracija.test.js`, electricity: `test/laboratorij-elektrika.test.js`, heat: `test/laboratorij-toplota.test.js`, forces: `test/laboratorij-sile.test.js`, indicators: `test/laboratorij-indikatorji.test.js`, optics: `test/laboratorij-optika.test.js`, electrochemistry: `test/laboratorij-elektrokemija.test.js`, motion: `test/laboratorij-gibanje.test.js`, electromagnetism: `test/laboratorij-magnetizem.test.js`, reactions: `test/laboratorij-reakcije.test.js`) with the allowed deviation stated.
7. **Na telefonu ostane risba vidna** (j, 2026-11-04: »s scrollanjem do gumbov skriješ animacijo«). Shared, nothing per
   experiment: `mountSim` (`public/sim/index.js`) calls `pripni(el)` (`public/sim/lab.js`) for every engine that marks
   itself `.lab`. It puts the drawing (`.demo-stage`, with the meters `.lab-meters` and status) and the controls
   (`.demo-controls`) into one `.lab-tit-top` (wraps them when the engine used `layout({ stage, controls })`), adds the
   toggle »Pripni sliko« (`.lab-pin`, `sim.lab.pin`, `aria-pressed`, remembered in `localStorage` `evklid.lab.pripni`),
   measures the visible height of the scroll area (`--lab-okno`, `--lab-vrh`) and sizes the drawing (`--lab-risba-h`,
   aspect from the SVG viewBox). CSS in `public/textbook.css` (»Na telefonu ostane risba vidna«, container `labtit` on
   `.demo.lab`): narrow (container < 800 px) → drawing + meters sticky at the top of the scroll area below the app
   header, together ~45 % of the visible height (~52 % for an upright drawing such as the titration, 60 % with a mouse),
   compact LCDs (note up to 3 lines, never cut to »…«), shadow once stuck, controls scroll under it and carry
   `scroll-margin-top: var(--lab-pin-h)` so `scrollIntoView`/focus never park one under the drawing; landscape phone (height ≤ 560 px, container ≥ 520 px) and wide (container ≥ 800 px) → drawing
   pinned left beside the controls and fully visible; a wide drawing (viewBox ≥ 1,55 : 1, `.lab-siroka`: track, circuit) in a wide container is instead pinned full width on top (~45 % of the visible height, meters right of it, toggle shown) with the controls below in two columns. Pinning lives only inside `.lab-tit-top`, so the table, graph and
   conclusion below are never covered. Very low visible height (< 330 px, e.g. keyboard on a small phone) unpins in
   portrait (`.lab-nizko`); a focused control under the drawing or under the keyboard is scrolled into view. The phone
   bottom bar hides in an open experiment like in a lesson (`touch.css`). Every lab table (`dataTable`) scrolls in its
   `.lab-table-wrap`, not in the table, so the header row stays visible (sticky `thead th`). Check: `test/laboratorij-telefon.test.js`
   (every `lab-` engine at 360 × 740: drawing ≥ 80 % visible at every control, no control under it, ≤ 62 % of the
   view; toggle; landscape and desktop beside; at 1280 × 800 a wide drawing on top, ≥ 600 px for the track, ≥ 480 px otherwise). A new experiment only needs `el.classList.add("lab")` and its drawing
   in a `.demo-stage` directly followed by `.demo-controls` (or both inside `.lab-tit-top`).
8. **Review:** pass 1 automatic, pass 2 an Opus expert check of the science and function, pass 3 look/phone/pedagogy
   (`docs/pregled.md`). Dangerous experiments are only simulated; a short video only when no realistic
   simulation is possible; home experiments get a safety note and an equipment list.

## Code

| File | What |
|---|---|
| `public/sim/lab-model.js` | models, no DOM (tests import it): `OhmBench`, `Co2Bench`, multimeter, fuse, lamp, `rng`/`gauss` |
| `public/sim/lab.js` | UI parts: `ticker` (real time, also with reduced motion), `lcd`, `dataTable`, `dataGraph`, `conclusion`, `eventLog`, `notes`, `fixed`; `pripni` (drawing stays visible on a phone, rule 7) |
| `public/sim/materiali.js` | materials for every experiment (j, 2026-11-10): one hidden `<svg id="mat-defs">` with gradients and one `<style id="mat-slog">` per page (no raster images, no filters). `kit.js` → `s()` calls `okrasi(el, class)`; after the synchronous draw (microtask) it adds the decoration by class: `lab-glass` (gradient, inner wall line, body for a tube drawn as two walls, soft shadow under a flat-bottomed vessel), liquids `lab-liq`, `lab-ind-liq`, `lab-tit-sol`, `lab-top-water`, `lab-sil-tek` (edge shading, surface glow, meniscus on a rect), metals (`lab-tit-rod`, `lab-sil-mass` …: brushed sheen), devices (`lab-box` …: top light and shadow), `lab-tit-bench` (line becomes a worktop), `lab-wire`, wood. The drawing's backdrop is the stage (`.lab-tit-top > .demo-stage`, full width). New experiments keep using these classes; add a new class to `VRSTE` instead of drawing highlights by hand. Colours of edges, worktop and backdrop are `--mat-*` variables (light, dark, era themes). Round 2 (j, 2026-11-10, closer to a photograph and physically correct): glass has a wall thickness (light band with an inner edge, 2,6 / 1,8 / 1,1 drawing units by vessel width), window reflections, a mouth ellipse, a thick greenish base and a caustic next to the shadow; liquids get a surface ellipse; chrome cylinders (`mat-valj-x/-y` by orientation; the sheen of a resistor lies over its colour bands); engraved graduation marks (`lab-mark`); grainy solids (`lab-powder`, `lab-ppt` …); bubbles as lenses; **refraction**: a probe or stirring rod (`lab-top-probe`, `lab-top-rod`) below the water surface is drawn displaced from the beaker axis and thicker by n = 1,33 (`LOM_VODA`). `lab.js` → `pripni` adds »Povečaj risbo« (`.lab-zoom`, key `sim.lab.zoom`): the stage as a top-layer popover over the whole screen, drawing as tall as the screen, wide drawings pan; Esc or the same button closes; pinned drawing on touch is now ~50 % (tall drawings ~58 %) of the visible height. Round 3 (independent review, 2026-11-10): **wall and base thickness follow the drawing's scale** (`debelinaStekla`: real 1,1 mm for tubes, 1,8 mm for beakers and flasks, base 2,5 mm; the scale in units per mm is read from the experiment's scale bar `.lab-scale` and its label »2 cm«; a minimum of 0,6 units is only a visual reserve, capped at 9 % of the width; in a magnified cut-out (`[clip-path]` window) no wall is drawn, so the meniscus stays uncovered); reflections vary with the vessel's shape and its place relative to the light (tube: long strip, beaker: window with a bar, conical flask: slanted strip); refraction is now a clipped copy of the same shape stretched about the beaker axis (also the heater coil and its lead); the 12 newer experiments get reflections on `lab-ek-glass`, sheen, cable shadows; circuits drawn as diagrams (`svg.lab-circuit`: Ohm, vezava, prevodnost) stay pure diagrams (no sheen, shadows or thick wires). **Speed:** decorations are cached per SVG by the element's shape (`svg._mat`) and the same nodes are re-inserted on every redraw (steady state: no new nodes); if building takes too long several times, a light mode drops the costliest decorations (`lahkiNacin()`). »Povečaj risbo« is a dialog (`role=dialog`, the rest of the page `inert`), fits the whole drawing (a wide drawing is rotated on a portrait phone) and is closed by Back (`app.js` → `backStep`). Tests: `test/laboratorij-telefon.test.js` (zoom, Back), `test/materiali.test.js` (class map, path box, every `url(#mat-…)` defined, AA contrast of labels on the backdrop, size) |
| `public/sim/lab-fiz.js` | `labOhm` (engine `lab-ohm`) |
| `public/sim/lab-kem.js` | `labCo2` (engine `lab-co2`), `flaskLevel` |
| `public/sim/lab-model-titracija.js` | titration model, no DOM: `TitrBench`, `solvePH` (charge balance), indicators, burette/pipette/pH meter |
| `public/sim/lab-titracija.js` | `labTitracija` (engine `lab-titracija`) |
| `public/sim/lab-model-elektrika.js` | models, no DOM: `VezBench` (series/parallel/mixed netlist, reuses the `lab-model.js` meters, fuse, resistors, lamp, supply), `tester`, `MATERIALI` |
| `public/sim/lab-elektrika.js` | `labVezava` (engine `lab-vezava`), `labPrevodnost` (engine `lab-prevodnost`); circuit parts `drawMeter`, `drawResistor`, `drawLamp` shared with `labOhm` (`lab-fiz.js`) |
| `public/sim/lab-model-toplota.js` | heat models, no DOM: `Voda` (water + vessel, two nodes, losses through wall, bottom and surface incl. evaporation), `POSODE`, thermometer and balance, `GrelnikBench`, `MesanjeBench`, `FazeBench` (enthalpy model ice/brine/water/steam), `OhlajanjeBench`, `vrelisce` (Antoine), `talisceSoli` (CRC table) |
| `public/sim/lab-toplota.js` | `labGrelnik` (engine `lab-grelnik`), `labMesanje` (`lab-mesanje`), `labFaze` (`lab-faze`), `labOhlajanje` (`lab-ohlajanje`); time-speed control (×1 … ×300), auto-record at round times |
| `public/sim/lab-model-optika.js` | optics models, no DOM: `sledi` (2D ray tracer on the optical disc: flat face, curved face, mirror, Fresnel split of every ray), `snell`, `mejniKot`, `fresnel`, `LomBench`, `LecaBench` (thin lens, blur circle, depth of focus), `slika`, `nejasnost`, `fIzMeritev` |
| `public/sim/lab-optika.js` | `labLom` (engine `lab-lom`), `labLeca` (`lab-leca`); no clock, the drawing is redrawn on every change |
| `public/sim/lab-model-sile.js` | »Silomer in uteži«, no DOM: `HookeBench` (springs, M3 masses, elastic–plastic spring, swinging, parallax), `GostotaBench` (balance ±0,1 g, 100 mL cylinder class B, samples, meniscus), `VzgonBench` (5 N spring scale, level rise, bottom contact), `TlakBench` (membrane probe, water U-tube, leak), `G_LJ`, `TEKOCINE`, `naklonSkoziIzhodisce` |
| `public/sim/lab-sile.js` | `labHooke` (`lab-hooke`), `labGostota` (`lab-gostota`), `labVzgon` (`lab-vzgon`), `labTlak` (`lab-tlak`); `lupa` = magnified analog scale (ruler, meniscus, spring scale, manometer legs) |
| `public/sim/lab-model-indikatorji.js` | indicator models, no DOM: `phMesanice` (charge balance with HCl, NaOH, acetic acid, carbonate, ammonia; `solvePH` from the titration model when only those three), `PH_VZORCI`, red cabbage scale `ZELJE`, universal paper `PAPIR`, `PhBench` (pH meter: calibration, carry-over), `DokazBench` (`ZIVILA`, `PRESKUSI`), `SlinaBench` (`AMILAZA`, `EPRUVETE`, `casRazgradnje`) |
| `public/sim/lab-indikatorji.js` | `labPh` (engine `lab-ph`), `labDokaz` (`lab-dokaz`), `labSlina` (`lab-slina`); CSS prefix `lab-ind-` |
| `public/sim/lab-model-elektrokemija.js` | electrochemistry models, no DOM: `ElektrolizaBench` (Hofmann apparatus: Tafel kinetics on Pt/graphite, competing O₂/Cl₂ at the anode, arm pH, gas dissolution, ρgΔh and water vapour in the tubes, Joule heating, fuse), `GalvanBench` (half-cells, Nernst, Mg mixed potential, foreign salts, bridge resistance, loads), `KovineBench` (metal + acid rate law, displacement by diffusion, heat, foam, gas syringe), `faradayMol`, `nernst`, `hH2SO4`, `barvaRaztopine` (Beer–Lambert), `KOVINE`, `SOLI`, `TEKOCINE_EL`; reuses the multimeter, fuse, supply, `rng`/`gauss` (`lab-model.js`), thermometer and `pNas` (`lab-model-toplota.js`), LED (`lab-model-elektrika.js`), indicator colours (`lab-model-indikatorji.js`) |
| `public/sim/lab-elektrokemija.js` | `labElektroliza` (engine `lab-elektroliza`), `labGalvanski` (`lab-galvanski`), `labKovine` (`lab-kovine`); drawing helpers for glass (thickness, highlight), metals with sheen, DMM, bench supply, crocodile clips, stand and clamp, bubbles (CSS animation, phase from the clock, still under reduced motion), magnifiers; CSS prefix `lab-ek-` |
| `public/sim/lab-model-gibanje.js` | motion models, no DOM: `ProgaBench` (aluminium track 1,2 m, cart with wheel inertia and rolling resistance, blocks or shim, table tilt and spirit level, light gates with beam height and edge jitter, 4-channel gate timer in »from release« or »gate 1 → 2« mode, holding magnet / hand / push, bumper; with `skripec: true` a string over a pulley to a hanger with 10 g masses, string angle, hanger landing on the floor), `PadBench` (free fall with drag ½ρcAv², buoyancy and added mass, magnet or clamp release delay, gate offset and chord), `PREDMETI`, `CASOVNIK`/`casovnikRead`, `gostotaZraka`, `koncnaHitrost`, `pospesekKlanec`, `pospesekNewton`, `zastira`; reuses `rng`/`gauss`, `M_ZRAK` (`lab-model.js`), `G_LJ`, M3 masses and line fits (`lab-model-sile.js`) |
| `public/sim/lab-gibanje.js` | `labKlanec` (engine `lab-klanec`), `labProstiPad` (`lab-prosti-pad`), `labNewton2` (`lab-newton2`); one SVG per bench, moving parts are groups whose `transform` changes per frame (rAF; 10 fps under reduced motion, same real time); slow-motion replay ×0,1 labelled in the drawing; magnifiers: cross-section at the gate (flag vs beam height), top view of beam and fall line; CSS prefix `lab-gib-` |
| `public/sim/lab-model-magnetizem.js` | electromagnetism models, no DOM: thick-coil on-axis field `bTuljavaOs` (Montgomery), thin `bSolenoid`, numeric `bBiotSavart` (helix, for the test), magnetised cylinder `bValj`, demagnetising factor `razmagnetilni` (Osborn), B–H curve `bZelezo`/`hZelezo`, open core `magnetizacijaPalice`; `ElektromagnetBench` (coils 250/500/1000 turns, air/soft-iron rod/steel nail/U-core with yoke and spacers, CV/CC supply, ammeter in series or parallel with fuses, coil heating with R(T) and thermal cut-out, Hall teslameter with zero, orientation and ranges, clips with remanence, compass), `TehtnicaBench` (current balance: magnets in a steel holder on a 0,01 g balance, PCB wire loops 1–8 cm, height and angle, tare and drift), `IndukcijaBench` (NdFeB magnet falling or pushed through a coil, flux by reciprocity, 12-bit voltage sensor with ranges and sampling, hum, jam, ballistic galvanometer), `POENOSTAVITVE_MAGNETIZEM`; reuses `rng`/`gauss`/`makeMeter`/`meterRead`/`fuseRate`/`AM_RANGES` (`lab-model.js`) and `G_LJ`, line fits (`lab-model-sile.js`) |
| `public/sim/lab-magnetizem.js` | `labElektromagnet` (engine `lab-elektromagnet`), `labSilaVodnik` (`lab-sila-vodnik`), `labIndukcija` (`lab-indukcija`); one SVG per bench with a fixed scale and scale bar, copper windings drawn turn by turn, bench supply, DMM, teslameter, data logger and laptop trace; top-view inset of the magnet gap; falling magnet animated in real time (rAF) with a ×0,1 replay; CSS prefix `lab-mag-` |
| `public/sim/lab-model-reakcije.js` | reaction models, no DOM: `Osnova` (goggles, unthermostated water bath, stopwatch with human reaction time), `MarmorBench` (CaCO₃ + HCl on a 0,01 g balance: rate ∝ area·[H⁺], limiting reagent, dissolved CO₂, heavy CO₂ in the flask, cotton wool, spray, foam), `MagnezijBench` (wraps `KovineBench`), `Brizga` (100 mL syringe with plunger friction, leaking stopper, pop at 110 mL), `TiosulfatBench` (»disappearing cross«), `PeroksidBench` (H₂O₂ with MnO₂, KI, catalase; splint, filtering), `KalorimeterBench` (polystyrene cup or beaker via `Voda`, lid, stirring and layers, digital or glass thermometer, neutralisation, dissolving, Mg, thermometric titration), `ekstrapolacija`, `entalpija`, `PlamenBench` (NIST lines, molecular bands, CIE 1931 colour, cobalt glass, loop cleaning), `POENOSTAVITVE_REAKCIJE`; reuses `KovineBench`/`KINETIKA`/`OBLIKE`/`KOVINE`/`laboratorij`/`TOPNOST` (`lab-model-elektrokemija.js`), `Voda`/`POSODE`/thermometer/`pNas` (`lab-model-toplota.js`), `rng`/`gauss`/`M`/`CO2_TOPNOST`/`BUCKA` (`lab-model.js`) |
| `public/sim/lab-reakcije.js` | `labHitrost` (engine `lab-hitrost`), `labEnergija` (`lab-energija`), `labPlamenska` (`lab-plamenska`); Erlenmeyer flask, syringe, balance, stopwatch, water bath, polystyrene cup in cross-section, glass-thermometer magnifier, Bunsen burner with air collar, flickering flame and hand spectroscope; glass, bubbles, stand from `lab-elektrokemija.js` (exported there); CSS prefix `lab-rk-` |

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

### Forces: shared data (`lab-model-sile.js`)
The model uses g = 9,806 m/s² (Ljubljana: GRS 80 formula at 46,05° plus free-air correction for 295 m), the student computes with 9,81. Liquids at 20 °C: water 0,9982,
4 % NaCl 1,0268, ethanol 0,7893 (CRC), sunflower oil 0,920 (Engineering ToolBox); meniscus heights 1,3–2 mm (ocena). A data test checks every density, the M3 table, cylinder class B and the spring-scale budget against these sources. Analog scales are read in a magnifier (`lupa`).

### `lab-hooke` – spring, masses and Hooke's law (FIZ-OS-8 sila in merjenje sile; FIZ-SS-1 prožnost)
Stand, 50 cm ruler (1 mm, read to 1 mm), three springs 15/30/60 N/m ±5 % with elastic limits 2,5/3/8 N (ocena), masses 10, 20, 20, 50, 100, 200 g within OIML R111 class M3.
Above the limit a bilinear model (slope k/2, ocena) leaves a permanent extension (F − Fy)/k; the unloaded reading then shows it and the spring is drawn »raztegnjena«.
Hanging a mass starts a damped swing (30 % of the step, τ 2,5 s, ocena; »Umiri z roko« to 3 %); reading while it swings warns. Eye above/below the pointer: parallax ±1,7 mm (ocena).
Table m, F, reading, x; graph F(x) per spring with a line through the origin; k in N/cm and N/m vs the label. Tests: fit k within ±3 % (3 springs × 30 seeds), ideal 100 g → 6,54 cm,
no permanent set below the limit and (F − Fy)/k ±3 mm above it, swing > 1 mm right after hanging, parallax, masses within M3 (500 seeds).

### `lab-gostota` – density of solids and liquids (FIZ-OS-8 gostota)
Balance 0,1 g ±0,1 g; 100 mL cylinder class B ±1 mL (ISO 4788; scale error a·V/100 + b), read to 0,5 mL at the bottom or (mistake) top of the meniscus. Samples Ø 2 cm in three sizes:
Al 2,70, Cu 8,96 (CRC), steel 7,85, brass 8,47, PVC 1,38, granite 2,65 (irregular ±10 %), spruce 0,45 (Engineering ToolBox). Displacement V = V₂ − V₁; liquids: empty and full cylinder on the balance.
Mistakes: dropping the sample (air bubble 0,4–1,0 mL, ocena), wood floats unless pushed under with a thin wire (0,05 mL), too little water (sample not covered), overflow, meniscus top (cancels for
displacement, not for liquids). Graph m(V) per material, slope = ρ. Tests: Al 30 cm³ 2,70 ±3 % (100 seeds), other sinking samples ±6 %, floating wood reads ≈ 1,00 and 0,45 ±5 % with the wire,
bubble lower, uncovered higher, liquids ±3 % and lower at the meniscus top, cylinder and balance within spec (500 seeds).

### `lab-vzgon` – buoyancy with a spring scale (FIZ-OS-8 vzgon; FIZ-SS-1 tlak in vzgon)
Spring scale 0–5 N, 0,05 N divisions, read to 0,025 N, ±0,05 N (gain ≤ 0,5 %, ocena); zero offset 0,08–0,20 N until »Naravnaj ničlo«. Al 100 cm³ or steel 50 cm³ cylinder with 1 cm rings
in a 1000 mL beaker (Ø 9,5 cm, 800 mL, ocena); the level rise is included (d = s·A/(A − a)). Touching the bottom: the scale spring (50 N/m) unloads by k·δ. Table and graph F_vzg(V_izp) per liquid,
ρ = slope/g. Tests: 100 cm³ in water 0,981 N ±2 %, salt water > water > oil > ethanol, readings ±0,06 N (50 seeds × 4 liquids), level rise and Archimedes exact, bottom −0,5 N per cm, offset cancels.

### `lab-tlak` – hydrostatic pressure with a U-tube manometer (FIZ-OS-8 tlak; FIZ-SS-1 tlak in vzgon)
Membrane probe to 30 cm in water, salt water or oil; water U-tube ±15 cm, legs read to 1 mm. Membrane takes 1 % (ocena), settling τ 0,8 s, leak τ 15 s (ocena), Δh > 30 cm spills (refill button).
Orientation down/up/side gives the same reading (shown in the log). Mistakes: one leg only (half), leaking tube (drifts to zero), overfilling. Tests: 981 Pa at 10 cm ±0,5 %, Δh 100 ±3 mm,
oil less and salt water more, orientation identical, linear in depth (9,9 mm/cm), one leg = half, leak < 5 % after 60 s, spill and refill.
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
### `lab-lom` – reflection and refraction on the optical disc (FIZ-OS-8 odboj svetlobe, lom svetlobe; FIZ-SS-3 geometrijska optika)
Optical disc with a 1° scale (radius 120 mm, ocena), red 650 nm class 2 laser (safety note on switch-on: never into the eye), plane mirror (R 90 %, ocena) or a
semicircular block (radius 50 mm, ocena) of acrylic PMMA n = 1,4881 (Sultanova 2009), glass N-BK7 1,5145 (Schott) or water 1,3314 (Daimon & Masumura 2007), air 1,00028
(Ciddor 1996; all at 650 nm, refractiveindex.info). Light from air into the block through the flat face, or from the block into air (enters radially through the curved face).
Every ray is traced in 2D and split by the Fresnel equations (unpolarised), so the weak reflected ray (3,85 % at normal incidence for PMMA) is drawn faint and its share is shown.
Reading: the disc is set to a mark within ±0,25° (ocena), angles are read to 0,5° with an eye error ≤ 0,24° (total ±0,5°). Table α, odbojni, β, sin α, sin β; graph sin β vs sin α
with a fit through the origin, slope 1/n (air → block) or n (block → air); total internal reflection above the critical angle (PMMA 42,2°). Mistakes: angles measured from the surface,
laser 0,5–5 mm off the centre (the ray then also bends at the curved face, readings are off). Tests: Snell 30° → 19,6° ± 0,3°, reflection = incidence (mirror and block, both directions),
critical angles PMMA 42,2 / water 48,7 / BK7 41,3 (±0,3°) and TIR above, Fresnel 3,85 % and n(PMMA) from Sultanova's Sellmeier formula, slope 1/n ± 2 % (3 materials × 20 seeds) and n from block → air, readings within ±0,5° (500 seeds),
3 mm offset changes both readings by > 0,5°, a 4 mm offset spoils the slope by > 2 %, measuring from the surface makes sin β/sin α non-constant, deterministic seeds.

### `lab-leca` – converging lens on an optical bench (FIZ-OS-8 lom svetlobe (leče); FIZ-SS-3 geometrijska optika)
1 m rail with a mm scale, a 20 mm LED arrow, converging lenses f = 50/100/150 mm (true f within ±2 % of the label, ocena), aperture 30 mm (ocena), screen. Riders 15 mm apart at least,
lens and arrow centre up to ±1 mm from the rider's mark (ocena). Sharpness from the blur circle c = D·|1 − s(1/f − 1/a)|; the image looks sharp while c ≤ 0,5 mm (per student 0,35–0,65 mm, ocena),
so the »sharp« screen position is an interval of a few mm and readings scatter. Screen view shows the image (chief-ray size −h·s/a, blurred by c); image size read with a ruler to 0,5 mm (±0,45 mm).
a < f: no image on the screen, »Poglej skozi lečo« shows the upright virtual image (M = f/(f − a), magnifier). Table a, b, image size and orientation, 1/a, 1/b; graph 1/b vs 1/a with the line of slope −1
through 1/f = mean of 1/a + 1/b; conclusion question. Mistakes: object inside f, a and b read from the rail end instead of the lens centre, screen closer than 4f to the object (never sharp; refused with the reason), unsharp image (refused).
Tests: a = 2f → b = 2f and M = −1, a < f virtual and upright (M = 2,5 at a = 60, f = 100), f from students' readings within ±3 % (20 seeds × 3 lenses, screen placed randomly inside the sharp interval),
a < f never sharp on the whole rail, object–screen 3,8f never sharp but 4,2f is, reading from the rail end shifts a by the object position, image size within ±0,5 mm (300 seeds), deterministic seeds.

### Electrochemistry: shared data (`lab-model-elektrokemija.js`)
F = 96 485,332 C/mol (CODATA 2018); Nernst factor RT/zF at the lab temperature; E° (CRC »Electrochemical series«): Mg −2,372, Zn −0,7618, Fe −0,447, Pb −0,1262, Cu +0,3419, Ag +0,7996 V;
ΔfH of ions (NBS tables, Wagman 1982): Mg²⁺ −466,85, Zn²⁺ −153,89, Fe²⁺ −89,1, Cu²⁺ +64,77, Ag⁺ +105,58 kJ/mol; ion diffusion coefficients (CRC); Ka2(H₂SO₄) = 1,02·10⁻² (CRC).
Lab: 20–24 °C and ~98 kPa (Ljubljana, ISA), digital barometer ±0,2 kPa (ocena). Every `lab-model*` number has a source or »ocena«.

### `lab-elektroliza` – electrolysis in a Hofmann apparatus (KEM-SS-2 galvanski členi in elektroliza; KEM-TEK-SS redoks in elektrokemija; KEM-OS-8 kemijska reakcija, ionska vez)
Liquids: distilled water, tap water, dilute H₂SO₄, Na₂SO₄, NaOH, NaCl (0,1 / 0,5 / 1 mol/L); Pt or graphite electrodes; optional universal indicator. Apparatus (ocena from suppliers): tubes 0–50 mL by 0,1 mL,
Ø 14,1 mm, 7 mL below the 50 mark before gas escapes, reservoir bulb 12 cm², cell constant 700 m⁻¹, scale error ≤ 0,1 mL. Supply 0–12 V with adjustable current limit (CV/CC), multimeter as ammeter in series
(F 200 mA fuse on the mA input), stopwatch, thermometer probe in the bulb, barometer. Physics: κ at 20 °C (CRC, +2 %/K), I from U = E_rev + η_a + η_c + IR with Tafel/asinh kinetics
(H₂ on Pt i₀ 10⁻³ A/cm², Bard & Faulkner; O₂ and Cl₂ on Pt, all on graphite: ocena), E_rev = 1,229 V + 0,059·(pH_cathode − pH_anode) (both arms' pH tracked from the charge),
Cl₂ and O₂ compete at the anode (E°(Cl₂) 1,358 V, chloride mass-transport limit F·D·c/δ, δ 0,025 cm under bubbles, ocena), graphite oxidises (8 % of anode charge → CO₂, ocena). Gas: n = Q/zF, a share dissolves near the electrode
(Henry constants Sander 2015; Cl₂ 0,10 mol/L CRC; fraction ocena), V = nRT/(p + ρgΔh − p_H₂O) with the liquid column to the bulb. Joule heat (U − U_tn)·I, U_tn = 1,481 V for O₂, 2,311 V for Cl₂ (2NaCl + 2H₂O, NBS ΔfH), 0,462 V for CO₂, weighted by the current shares. Universal indicator bleached by dissolved Cl₂ (ocena).
Mistakes: taps closed while filling (air trapped), tap open (gas escapes), distilled water (µA, no gas), polarity swapped (H₂ under the other tube), 200 mA range at ~0,5 A (fuse), high current (warming, CC),
tube full (gas escapes under the tube), NaCl (chlorine, warning, ratio ≫ 2). Gas tests: glowing splint relights above 50 % O₂ (ocena), burning splint pops with H₂, moist litmus bleached by Cl₂.
Table t, I, V(katoda), V(anoda); graph V vs Q (Q from the student's own readings, trapezoid) with the Faraday lines at the measured p and T; F computed from the student's data; conclusion 2 : 1 and why.
Tests: 1,000 A · 965 s → 5,00 mmol H₂ (±0,5 %), gas collected ≥ 99,5 %; V(H₂)/V(O₂) > 2,05 at 2 mL (O₂ lag) and 2,00 ± 0,05 at 40 mL (H₂SO₄, Na₂SO₄, NaOH); ρgΔh and p_H₂O in V (±0,01 mL);
Pt onset 1,6–1,9 V, none below 1,23 V, graphite higher; distilled water at 12 V < 1 mA, H₂SO₄ and Na₂SO₄ 0,5 M > 30 mA; swapped polarity; open tap; trapped air; heating > 3 K in 10 min at ~0,5 A and < 0,6 K at 50 mA with the supply in CC; U_tn(Cl₂) = 2,311 V from ΔfH (±1 mV); fuse;
NaCl Cl₂ share > 0,8 at 1 M (less at 0,1 M), ratio > 2,5, pH > 11 / < 4; graphite ratio > 2,08; splint tests; indicator in Na₂SO₄; ammeter within spec and tube reading within 0,1 + 0,05 mL (300 seeds).

### `lab-galvanski` – galvanic cell (KEM-SS-2 galvanski členi in elektroliza; KEM-TEK-SS redoks in elektrokemija)
Two 100 mL beakers, strips of Mg, Zn, Fe, Pb, Cu, Ag (polish with sandpaper or not), any of six salt solutions (0,001–1 mol/L), salt bridge: none, filter paper with KNO₃ (8 kΩ, ocena), dry paper (5 GΩ), agar U-tube (0,4 kΩ);
voltmeter 10 MΩ ±(0,5 % + 2), red/black lead on either beaker, load (100 Ω–100 kΩ, red LED, small motor) with ammeter. Model: Nernst with activities a = γ± c (`GAMA`, 25 °C, Robinson & Stokes 1959 app. 8.10 and CRC »Mean activity coefficients«: CuSO₄ 0,74 / 0,41 / 0,150 / 0,0423 at 0,001 / 0,01 / 0,1 / 1 mol/L, ZnSO₄, MgSO₄, AgNO₃; Pb(NO₃)₂ outside 0,1 M and FeSO₄ ocena; log interpolation, γ = 1 at 10⁻⁵ M); `napovedNernst` is the ideal (concentration) prediction, `napovedAktivnost` the activity one; they cancel in a Daniell cell with equal c, a Cu 0,01 | Cu 1 cell gives 0,030 V instead of the ideal 0,059 V, E° at 25 °C with RT/zF at the lab temperature;
Mg mixed potential −1,55 V vs SHE (Song & Atrens 1999 give ~−1,7 V vs SCE ≈ −1,46 V vs SHE in dilute chloride; school Mg | Cu 1,7–2,0 V; weak c dependence and ±15 mV drift, ocena); oxide film on unpolished metals (ocena); metal in a foreign salt: coated (drifts to the deposited metal's potential, τ 90 s) or undefined (trace ions 10⁻⁶ M, drift);
internal resistance = bridge + solutions (κ ≈ κ₁·c^0,8, ocena); terminal voltage from (E − U)/Ri = U/R_V + I_load(U); LED exponential (Vf 1,8 V at 20 mA), motor starts at 15 mA (ocena); open input floats ±6 mV.
Table pairs, U, ΔE°; graph U vs ΔE° with y = x (Mg below); graph U (mV) vs lg(c ratio) for concentration cells: ideal Nernst line RT ln10/2F, activity prediction (triangles) and measured points below the line; two conclusion questions (negative pole and series distance; concentration cell).
Tests: Daniell 1,10 ± 0,01 V (EMF and reading, also at 0,01 | 0,01); ideal Nernst slope 0,0296 ± 0,0005 V (n = 2) and 0,0592 (Ag); with activities Zn 1 | Cu 1→0,001 drops 0,052 ± 0,003 V and Ag 0,0497 ± 0,002 V per decade; Cu 0,01 | Cu 1 = 0,030 ± 0,003 V (γ± uncertainty ~10 %), ideal 0,059; same metal and c < 5 mV; no or dry bridge |U| < 0,01 V (100 seeds × 20 readings);
swapped leads negative, negative pole is the more reactive metal, U grows with series distance; Mg ≥ 0,5 V below E° prediction, unpolished Zn lower; 1 kΩ load drops U to 0,05–0,3 V and I = E/(Ri + R) ± 2 µA, LED and motor off for Daniell, LED faintly on for Mg | Ag, OL on 2 V;
Zn in CuSO₄ drifts > 0,9 V towards Cu; voltmeter within spec (500 seeds).

### `lab-kovine` – metals in acids and salt solutions (KEM-OS-8 kovine; KEM-SS-2 redoks reakcije; KEM-TEK-SS redoks in elektrokemija)
Goggles first. 50 mL of HCl (0,5–2, 6 mol/L = mistake, ~20 %, irritating HCl vapour; only ~37 % fumes visibly) or H₂SO₄ (0,5–2) in a 100 mL Erlenmeyer flask with a 100 mL gas syringe, or MgSO₄, ZnSO₄, FeSO₄, CuSO₄ (0,1 / 0,5), AgNO₃ (0,05 / 0,1) in a beaker;
Mg, Zn, Fe, Cu as strip, granules or powder, 0,05–0,5 g (0,01 g balance); shaking; time ×1/×10/×60. Model: r = k·A·[H⁺]·Arrhenius (Ea 40 kJ/mol, k: Mg 1,0·10⁻⁵ from RSC »Disappearing magnesium«, Zn 6·10⁻⁷, Fe 6·10⁻⁸, Cu 0; ocena),
area from shape (strip 2/(dρ), granules, powder; shrinking), [H⁺] of H₂SO₄ from Ka2, acid can run out; Mg + water slowly; displacement only when E°(metal) < E°(ion), flux D·c/δ (δ 0,02 cm still, 0,004 cm shaken; ocena)
with a driving-force factor (ΔE°/0,8)³ (ocena); Mg in a salt of a nobler metal evolves H₂ on the deposit (micro-cells, 1,5·10⁻⁷ mol/(s cm²) at full cover, ×0,1 on Zn, ocena; ΔH −355,2 kJ/mol with ΔfH(OH⁻) NBS), coating cover 1 − e^(−n/(A·5·10⁻⁷)); heat from ΔfH; foam (1,2 mL per mL gas, τ 3 s) over 130 mL spills; syringe reads gas plus headspace expansion and water vapour, plunger pops at 110 mL.
Colours: CuSO₄ blue and FeSO₄ pale green by Beer–Lambert (effective absorptivities, ocena), deposits Cu red-brown, Ag grey crystals, Fe black, Zn dark grey; ~4× magnifier of the metal in a salt solution.
Student fills a ✓/✗ grid (4 metals × 7 liquids) after observing ≥ 30 s, records V(t) and T, orders the 5 metals; conclusion question on the reactivity series.
Tests: rate Mg > 10× Zn > 5× Fe > 0, Cu no gas and no mass loss in 2 M HCl after 10 min, 1 M H₂SO₄ ≈ 1 M HCl initially (±3 %); 0,05 g Mg in 1 M HCl: 95 % in 40–200 s, n(H₂) = n(Mg), ΔT > 3 K; displacement grid matches Mg > Zn > Fe > Cu > Ag after 10 min;
Zn powder bleaches 0,1 M CuSO₄ (shaken, 30 min), zinc limiting in 0,5 M; Mg in CuSO₄ bubbles (≥ »zmerno«) and warms, in MgSO₄ ≤ single bubbles, on a Zn deposit < 1/3; Cu in AgNO₃: one Cu²⁺ per 2 Ag; goggles, 6 M fumes, powder foam overflow and popped plunger, acid limiting (0,196 ± 0,002 g Mg left); syringe within ±0,95 mL (200 seeds), deterministic seed.

### Motion: shared data (`lab-model-gibanje.js`)
g = 9,806 m/s² (`G_LJ`). Gate timer: 0,1 ms resolution, ±(0,01 % + 1 digit) (PASCO ME-8930 Smart Timer: 100 μs, 0,01 %): a fixed calibration error per device (≤ half the spec) and rounding to the last digit. Light gates: IR beam ~1 mm, the blocking object looks 0,2 mm wider (switching thresholds), edge jitter σ 0,05 mm, gate set on the track scale σ 0,5 mm (all ocena).
Holding electromagnet release delay 5 ± 1,5 ms per device and ±0,3 ms per drop; clamp with a switch 12 ± 4 ms; hand + start key σ 40 ms; push 0,15–0,35 m/s (all ocena). Air ρ = pM/RT (M = 28,96 g/mol, ISO 2533), lab 22 ± 2 °C, 98 ± 0,9 kPa (Ljubljana).

### `lab-klanec` – cart on an inclined track (FIZ-OS-8 pospešeno gibanje; FIZ-SS-1 enakomerno pospešeno gibanje; FIZ-TEK-OS grafi gibanja; FIZ-TEK-SS Newtonovi zakoni s trenjem in klanci)
Aluminium track 1,2 m with a cm scale (PASCO ME-9493), feet 1,00 m apart, 0–5 wooden blocks of 2,0 cm under the left foot (sin θ = h/100 cm); the table tilts 3–6 mm/m until levelled with a spirit level (±0,3 mm/m). Cart 250 g (+0–2 bars of 250 g), 17 cm, flag 20,0 mm at 4,5–9 cm,
four wheels ΣI/r² = 10 g, rolling resistance μr 0,0025–0,0045 (ocena). Two gates at 20–110 cm, beam height 5–110 mm (below 8 mm it hits the track profile, 8–45 mm the cart body blocks it, above 90 mm nothing). Bumper with restitution 0,35 (ocena).
Motion integrated with 0,2 ms steps; a = g(sin θ − μr cos θ)/(1 + I/(mr²)). Table s, t, Δt, v = d/Δt per gate (mean speed while the flag blocks the beam = the speed at the middle of Δt, i.e. at t + Δt/2, not at the gate; the 0,2 mm wider effective flag makes it ~1 % low); graphs s(t²) and v(t) with lines through the origin; a = 2k compared with g sin θ.
Mistakes: table not level (cart drifts or stays at 0 blocks, ~25 % error at 1 block), push (t shorter, s(t²) not through the origin), hand release with the start key (offset), gates in the wrong order in »gate 1 → 2« mode (timer never stops), beam above the flag (no signal), on the cart body (Δt ×8), on the track (LED always on).
Tests: frictionless a = g sin θ/(1 + I/mr²) within 0,5 % (1, 3, 5 blocks); with μr within 0,5 % (20 seeds); v = d/Δt within 2 % of the true speed at mid-blocking (30 seeds); timer within ±(0,01 % + 0,1 ms) (500 seeds, and 100 runs on the track); a = 2k from s(t²) within 2 %; one test per mistake; bumper bounce.

### `lab-prosti-pad` – free fall with a light gate (FIZ-OS-9 prosti pad; FIZ-SS-1 prosti pad in navpični met; FIZ-TEK-OS načrtovanje poskusa in obdelava meritev)
Stand with an electromagnet (holds only steel) or a clamp with a switch, the object's bottom 2,20 m above the floor; gate 2–200 cm lower on a tape measure (mounting σ 0,5 mm), moved back and forth (the mount is 2–6 mm off until aligned in the top-view magnifier). A person 1,70 m for scale.
Objects: steel ball Ø 16 mm (16,8 g), table-tennis ball 40 mm 2,7 g (ITTF), paper cone 2 g Ø 10 cm, coffee filter 1 g Ø 12 cm, feather 0,1 g (swings ±2,5 cm). Drag ½ρcAv² with c = 0,47 for spheres (NASA Glenn »Shape Effects on Drag«), cone 0,8, filter 1,2 (tuned to ~1,1 m/s, Vernier »Air Resistance«), feather v_t ≈ 0,6 m/s (ocena);
spheres with buoyancy and added mass ½ρV (Lamb). RK4, 0,25 ms. Timer: t from the release signal to the beam and Δt of the blocking (v = L/Δt). Table, graphs h(t²) and v(t) (v plotted at t + Δt/2, the middle of the blocking), g = 2k (»2k« only, with the drag share at the gate, for the ping-pong ball and paper), terminal speeds; two conclusion questions.
Mistakes: ping-pong ball on the magnet (falls off), gate offset > radius (ball misses the beam, the timer runs on), partial chord (Δt short, v too big), gate 2 cm below (delay ~8 % of t, g > 10 % low).
Tests: steel ball from 1,000 m t = 0,4517 s ± 1 ms (drag at 2 m ~1,3 % of the weight; ping-pong ~50 %, its 2k from h(t²) > 5 % below g); g from h(t²) within 2 % (10 seeds; the release delay lowers the slope by ~δ/t ≈ 1 %, intercept < 0); ρ air 1,157 at 22 °C and 98 kPa, 1,2922 at 0 °C and 101,325 kPa;
ping-pong v_t 8–9,5 m/s (literature ~8–9) and > 20 ms behind the steel ball from 2 m; coffee filter v_t 1,0–1,3 m/s, reached within 2 % after 0,5 m; feather 0,6 ± 0,05 m/s; release delays; mistakes.

### `lab-newton2` – Newton's second law with a cart and a pulley (FIZ-OS-9 Newtonovi zakoni; FIZ-SS-1 Newtonovi zakoni; FIZ-TEK-SS Newtonovi zakoni s trenjem in klanci)
Same track and cart on a 90 cm bench (ocena), string over a pulley (I/r² = 4 g, bearing 0,5 mN, ocena) to a 10 g hanger; six 10 g masses (OIML R111 M3, ±20 mg) each in one place (`kje`: cart, hanger or box; `prestavi` moves that very mass, so nothing is counted twice), two 250 g bars; shim 0–8 mm under the left foot to compensate rolling resistance;
pulley at hook height or 5 cm higher/lower (string angle); the hanger starts 82 cm above the floor (ocena) and lands after 82 cm of travel. a = (m_o g − F_p + M g sin θ − μr M g cos θ)/(M + m_o + I_k/r² + I_p/r²), with the string angle solved for the tension.
Table m, F = m_o g, v₁, v₂, a = (v₂² − v₁²)/2s (gate 1 → 2) or 2s/t² (from release); graphs a(F) per total mass (general line: the intercept shows friction) and a(1/m) per force; friction check with the string off and a push (Δt₁ vs Δt₂); two conclusion questions (a ∝ F/m; why masses move from the cart to the hanger).
Tests: formula within 0,5 % (4 mass combinations); constant total mass when moving masses, each mass in one place (moving one keeps the exact set), a(F) through the origin when compensated (|b| < 0,02 m/s²) and an intercept without; a ∝ 1/m within 6 %; hanger lands after 82 cm (a from v² < 95 %); pulley 5 cm high lowers a near the pulley by ~1 %; string off: no motion; push test even only with the right shim; M3 masses (200 seeds).

### Electromagnetism: shared data (`lab-model-magnetizem.js`)
μ0 = 1,25663706212·10⁻⁶ (CODATA 2018). Earth's field in Ljubljana 48 µT, inclination 63° (NOAA WMM2025 for 2026, rounded: vertical 42,8 µT, horizontal 21,8 µT). Copper ρ 1,72·10⁻⁸ Ω m, α = 0,0039 /K (CRC).
Coils from a demountable-transformer kit (LD Didactic 562 13/14/15): 250 turns 0,6 Ω 5 A, 500 turns 2,5 Ω 2,5 A, 1000 turns 9,5 Ω 1,25 A; winding 6 cm long, radii 2,4–3,4 cm (ocena from the bobbin). Heating: one block, C 250 J/K, R_th 3,5 K/W (~70 K at Imax), thermal cut-out 120 °C, reclose 90 °C, lacquer smell above 105 °C (all ocena).
Bench supplies 0–12 V with CV/CC (3 A fixed for the electromagnet, 0–5 A knob for the balance); DMM 10 A / mA ranges with fuses as in `lab-model.js`.

### `lab-elektromagnet` – magnetic field of a coil, electromagnet (FIZ-OS-9 elektromagnet, magneti in magnetno polje; FIZ-SS-3 magnetno polje)
The student picks a coil and a core (none, soft-iron rod Ø 20 × 120 mm, hardened steel nail Ø 5 × 100 mm, laminated U-core 40 × 40 mm with a yoke and 0 / 0,5 / 1 / 2 mm plastic spacers), wires supply → ammeter → coil (ammeter in series or, wrongly, in parallel; 10 A or mA input; leads on or off; swap the terminals),
sets the voltage, zeroes the teslameter and moves the axial Hall probe along the axis (−10…+15 cm from the middle; a flat transverse probe fits into the spacer gap ≥ 0,5 mm); clips (0,5 g, 60 in the box) on the bottom pole; compass 11 cm beside the lower end. Time ×1/×10/×60.
Physics: thick-coil on-axis formula; open cores as uniformly magnetised cylinders with Osborn's demagnetising factor (rod N_d 0,043, so only ~20–30× stronger, not μr); B–H J = Js(2/π)atan(πχμ0H/2Js), soft iron Js 1,85 T, χ 2500, Hc 80 A/m (1,43 T at 1 kA/m, like measured mild-steel curves), steel Js 1,6 T, χ 400, Hc 1,5 kA/m (ocena);
U-core as a magnetic circuit NI = H_Fe(B)·l + B·g/μ0 (l 48 cm, contact gap 0,03 mm each, fringing (a/(a+g))², ocena), saturates at ~1,7–1,8 T; remanence M_r = min(0,6 M_max, Hc/N_d,ef), nail N_d,ef 0,007 and 35 % decay with τ 4 s (ocena, so one clip hangs for a moment);
clip force V_ef·M_s·|dB/dz| (V_ef = pole area × 12,5 µm, χ 12, tuned to ~16 clips for the rod at 3 A, ocena), tangling 85–100 %; compass from a two-pole model plus Earth's horizontal field. Teslameter (PHYWE 13610-93, LD 524 0381): 20/200/2000 mT, ±(2 % + 1 digit) (gain ≤ 1,6 %, jitter ≤ ½ digit), Hall offset ±0,03 mT before zeroing (ocena), 1,5° tilt when turned.
Table N, core, probe position, I, B, clips; graphs B(I), B(N) and B(z) (one graph at a time, each with its own axis); conclusion question (B ∝ NI, core).
Mistakes: ammeter in parallel (mA fuse blows; on 10 A the coil gets almost nothing and the supply goes CC), mA range in series (fuse), current above the coil rating (warning, heating to the cut-out, smell), teslameter not zeroed (Earth's field + offset), zeroed with the current on (reads −B after switch-off), probe turned 90° (~0), 20 mT range at the pole (OL), probe pushed into the core (stops at the end), U-core without spacers (no room for the probe).
Tests: long solenoid μ0NI/L within 1 % (thin and thick), closed formula vs Biot–Savart within 0,1 %, thick = mean of thin layers within 0,1 %, 500 turns at 2 A ~15 mT (±10 %); rod > 20× at the pole, B–H < 2 T and 1,43 T at 1 kA/m, U-core 4× NI gives < 15 % more B, linear with 2 mm spacers within 1 %;
clips (rod 10–30, air 0, nail keeps 1 then drops it, soft iron 0, a newly inserted core inherits no remanence); compass reverses; teslameter within spec (40 seeds × 3 positions) and OL; one test per mistake; R(T), CV current drop > 10 %, cut-out after 1500–4000 s at 3 A, reclose at 90 °C, steady < 100 °C at Imax.

### `lab-sila-vodnik` – force on a current-carrying wire, current balance (FIZ-SS-3 magnetna sila; FIZ-TEK-SS magnetno polje in Lorentzova sila)
A steel U-holder with 1–6 ferrite magnets (1,4 cm wide each, N pole in front or behind, holder across or along the wire) stands on a 300 g / 0,01 g balance (KERN EMB 200-2); a PCB with a copper loop (horizontal part 1, 2, 4 or 8 cm; PASCO SF-8607 style) hangs from a stand in the gap, at the edge or 1 cm above;
supply in CC (current knob 0–5 A, circuit ~0,08 Ω), DMM on 10 A or mA; TARE button. Physics: B0 0,09 T ±8 % per magnet (ocena for school sets), field along the gap as a sum of tanh steps (edge length 1,5 mm, ocena) integrated analytically (ln cosh); height factors 1 / 0,6 / 0,08, »along« keeps sin 1°;
F = I∫B dl, Δm = F/g (Newton's third law on the magnet). Axes x right, y back, z up: N in front → B to the back, current to the right → wire pushed up → reading rises. Balance: 0,01 g, calibration ≤ 0,05 %, drift ≤ 0,01 g with τ 120 s after taring, jitter ≤ ½ digit (ocena). PCB warms (0,75 W at 5 A, 40 K/W, τ 60 s, ocena) without changing F.
Table magnets, L, I, Δm, F; graphs F(I) and F(L) with lines through the origin; B from the slope; top-view inset with field arrows, current and the ⊙/⊗ force symbol; conclusion question (F ∝ IL, direction).
Mistakes: not tared (~174 g), wire above the gap (8 %), at the edge (60 %), field along the wire (~2 %), reversed current or poles (negative Δm), mA range (fuse), long run at 5 A (warm PCB, F unchanged).
Tests: F = BIL within 1 % for 1/2/4 cm and 1/3/5 A, 8 cm = I∫B dl, analytic integral = Simpson within 10⁻⁶; sign of the reading for both flips; Δm within ±0,01 g + 0,05 % right after taring (30 seeds × 40 readings) and drift ≤ 0,01 g after 10 min; untared, height and angle factors, heating and fuse, half the magnets ~half the force, magnet spread ≤ 3σ.

### `lab-indukcija` – induced voltage of a falling magnet (FIZ-SS-3 indukcija)
Acrylic tube 60 cm (inner Ø 14 mm, or wrongly 12 mm) on a foam pad, held by a stand with a ruler; the coil (same kit) clamped 10–35 cm below the release point; NdFeB magnet Ø 12 × 20 mm (Br 1,25 T, N38–N42 range 1,22–1,32 T; m ≈ 2,25 A m², 17 g), N or S pole down; dropped from the fingers or (»z roko«) pushed down 20 cm at 0,1–1 m/s and pulled back (3 m/s², more above 0,77 m/s so the speed is still reached; ocena).
Meter: voltage sensor in a data logger (PASCO PS-2115 / Vernier DVP-BTA style: ±10 V or ±1 V, 12 bits, noise 0,5 LSB, ±1 %, 1 MΩ, 100 Hz / 1 kHz / 10 kHz with a random phase; open input picks up 20 mV of 50 Hz hum, ocena) with the trace on a laptop, or a centre-zero galvanometer (±1 mA, 100 Ω, T0 1,6 s, ζ 0,3, ocena).
Physics: flux per turn by reciprocity (uniformly magnetised cylinder, second-order off-axis term), summed over a 6 × 24 grid of the winding; U = −dΛ/dt = dΛ/dz·v with Λ counted upward (N pole down: first peak positive, second negative); free fall from rest (no drag, no braking: the sensor draws no current). Analysis as in logger software: both peaks and the areas under them, split at the zero crossing.
Table N, h, v = √(2gh), U₁, U₂, ∫U dt; graphs U_peak(v) and ∫U dt(h); the trace (shaded areas) in its own large SVG; ×0,1 replay; conclusion question (U ∝ v and N, area = NΔΦ independent of speed, second peak larger and opposite).
Mistakes: ±1 V range (clipped), 100 Hz (misses the peak), leads off (hum only), narrow tube (magnet jams), galvanometer with a falling magnet (two opposite pulses in ~30 ms barely move it; a slow push does).
Tests: flux per turn = exact coaxial-loop mutual inductance (Maxwell, elliptic integrals) within 0,1 % and the far dipole within 0,5 %; ∫U dt = NΔΦ within 2 % for h = 10, 20, 35 cm (both peaks), equal areas at 20 and 35 cm; U_peak/v constant within 5 % (4 heights, both peaks), free-fall speed, U ∝ N within 2 %, second peak larger and opposite; pole flip and Lenz sign; clipping at 1 V; 100 Hz lower on average and never above (30 seeds); noise 0,3–1 LSB; hum < 50 mV; jam; galvanometer drop < 0,25 vs push > 0,5 of full scale, equal areas there and back; hand motion continuous up to 1 m/s.

The colours of graph series (`--demo-a/b/c`) are now also defined for the Laboratorij tab (`.lab-view` in `textbook.css`); before, points there were black.

### Reactions: shared data (`lab-model-reakcije.js`)
Lab room and pressure from `laboratorij` (20–24 °C, ~98 kPa). Water bath without thermostat (τ 40 min, ocena); flask in the bath follows it with τ 60 s. Human reaction time 0,25 ± 0,04 s (0,15–0,4). Balance 0,01 g (tared, gain ≤ 0,05 %, jitter ≤ 0,004 g, ±0,02 g while fizzing; ocena after KERN EMB 200-2). Syringe 100 mL: ±0,4 mL calibration, reading to 0,5 mL, static friction 0,3 kPa (dry: 4 kPa), kinetic half, leak 1,4·10⁻⁸ mol/(s Pa), pops at 110 mL (ocena). Gas solubility CO₂ 0,038, O₂ 1,3·10⁻³ mol/(L atm) (Sander 2015), saturating with τ 30 s, escaping with τ 300 s (ocena).

### `lab-hitrost` – reaction rate (KEM-SS-2 hitrost reakcij; KEM-OS-8 kemijska reakcija with `{ raven: "os" }`)
Four benches chosen by the student, one water bath (20–50 °C), stopwatch started with the addition (reaction time) or by hand (late start), auto-record every 10/30 s, time ×1/×5/×20.
(a) 40 mL HCl 0,5/1/2 mol/L in a 100 mL Erlenmeyer on the balance, marble 1/2/5 g as 12/6/3 mm chips or powder, cotton wool. r = k·A·[H⁺]·Arrhenius, k = 5·10⁻⁶ mol/(s cm² mol/L) (ocena after RSC; Plummer–Wigley–Parkhurst 1978: first order in H⁺ at pH < 3,5), Ea 15 kJ/mol (diffusion-limited, ocena), chips ×1,5 roughness, powder 10 % wetted (ocena), ΔH −14,6 kJ/mol (NBS); dissolved CO₂, CO₂ heavier than air in the headspace (diffuses out through the wool, τ 600 s), evaporation 0,16 mg/min (wool) / 0,5 mg/min, spray 5 % of CO₂ mass above 3 mL/s without wool, foam as in `lab-kovine` (2 g lost when it spills). Table t, m, Δm (first row at the addition); graph Δm(t) per run, r₀(c) graph and the order from two concentrations.
(b) 50 mL HCl with 3–12 cm Mg ribbon (0,0104 g/cm) and the syringe; kinetics, heat and foam from `KovineBench`; smooth/dry plunger, tight/leaking stopper.
(c) 50 mL of 10–50 mL thiosulfate stock (40 g/L Na₂S₂O₃·5H₂O) + water, 5 mL 2 M HCl; r = k[S₂O₃²⁻], cross gone at [S] = 1·10⁻³ mol/L (ocena), calibrated to 45 s at 0,161 mol/L and 20 °C (RSC, ocena), Ea 52 kJ/mol (ocena, Q10 ≈ 2), flask cools to the room (τ 1000 s); the student stops the stopwatch by eye (top view of the cross fades, ±1,5 % judgement); graphs 1/t(c) and 1/t(T), Ea from two temperatures.
(d) 5/10/20 mL 3 % H₂O₂ + water to 25 mL; first order; uncatalysed k ≈ 1·10⁻⁷ /s, Ea 75 kJ/mol (ocena); ΔH −94,7 kJ/mol (NBS, aq); MnO₂ 0,12 /s per g (ocena), KI k = 0,0115 L/(mol s) at 25 °C, Ea 56 kJ/mol (Liebhafsky & Mohammad 1933), catalase: raw potato cubes 0,006 /s, grated 0,02 /s, liver 0,08 /s, boiled 0 (ocena), denatured above ~52 °C; glowing splint relights above 50 % O₂ or > 0,3 mL/s (ocena); MnO₂ filtered and weighed back (−3 mg on the paper).
Mistakes: no goggles (nothing is poured), no cotton wool (mass loss too large), powder + 2 M (foam over the rim), late stopwatch, dry plunger (lags and jumps), leaking stopper (less gas), too much Mg or H₂O₂ (> 100 mL, plunger pops), boiled catalase (no gas), stopping too early at the cross.
Tests: mass loss = stoichiometric CO₂ of the limiting reagent within 2 % (5 cases, 40 min); powder > small > medium > large; rate ∝ [H⁺] within 5 %; 30/20 °C factor 1,1–1,4; early deficit 0,02–0,15 g then ≈ 0; wool vs none (> 3 %), foam; balance within ±0,01 g + 0,05 % (200 seeds); Mg: r₀ ∝ c within 5 %, n(H₂) = n(Mg) ±0,5 %, syringe within spec, smooth lag < 1 mL, dry > 3 mL, leak > 3 mL less, 12 cm pops, 8 cm does not; thiosulfate 1/t ∝ c within 5 %, 40–55 s at 50 mL, Q10 2,0 ± 0,2, analytic time within 3 %; reaction time 0,15–0,4 s, mean 0,25 ± 0,02; late start; catalysts faster than none, boiled ≈ none (±0,5 mL), more MnO₂ and grated potato faster, total O₂ = n/2 ±1 %, warm faster, 50 °C kills catalase; splint; MnO₂ mass ±0,012 g (30 seeds); 10/20 mL overflow; goggles; cross judged by eye within ±4,5 % of the model time (20 seeds), stopwatch stopped while the cross is still half visible < 0,3 × the true time.

### `lab-energija` – energy in reactions, calorimeter (KEM-SS-1 energija pri reakcijah; KEM-OS-8 energija pri reakcijah and nevtralizacija in soli with `{ raven: "os" }`)
Polystyrene cup (in a beaker, cross-section drawn) or a 400 mL glass beaker, lid, stirring, digital (±0,5 °C, 0,1 °C, τ 4 s) or glass thermometer (0,5 °C divisions, ±0,3 °C, τ 10 s, 4 J/K; ocena), time ×1/×5/×20, auto-record every 15/30 s.
Processes: 50 mL HCl or CH₃COOH + 50 mL NaOH (1, 2 or 4 mol/L, 4 = corrosive warning), NH₄NO₃ / NaOH / CaCl₂ 2–10 g in 100 mL water, Mg powder or ribbon in 50 mL 1 M HCl (kinetics from `KINETIKA`), thermometric titration of 25 mL HCl with NaOH from a 50 mL burette (1/2/5 mL steps).
Data: −57,1 kJ/mol (strong acid + base, ~1 mol/L, Atkins; −55,8 at infinite dilution from NBS ΔfH), CH₃COOH −56,1 (ocena), solution enthalpies NH₄NO₃ +25,69, NaOH −44,51, CaCl₂ −81,33 kJ/mol (CRC), ΔfH(Mg²⁺) −466,85 (NBS). Heat losses: `Voda` with `POSODE.stiropor`/`casa400`. Mixing τ 2 s stirred / 8 s not; probe offset 30 % of the step, decaying τ 90 s / 3 s; dissolution τ 25/60/30 s, ×4 unstirred (ocena).
Analysis: T₀ = mean of the readings before mixing (and of the second solution), cooling line fitted after the extreme and extrapolated to the mixing time, ΔH = −m c ΔT / n with the student's numbers and the literature value; titration graph T(V) with the maximum at equivalence. Conclusion: exo/endo (OŠ) or why |ΔH| is below the literature value (SŠ).
Tests: ideal run within 5 % of −57,1 (and within 7 % for 20 noisy seeds), glass beaker −35 … −50 and < 0,88 of the cup, no lid not better; unstirred early reading > 0,5 K low; acetic |ΔH| smaller; 4 M warning; NH₄NO₃ ΔT < −2 K, NaOH, CaCl₂ > 2 K, ΔH within 10 % of CRC; Mg ΔT > 10 K and ΔH within 8 %; titration maximum within one step of equivalence (3 step sizes × cup and beaker); glass thermometer 0,5 °C steps.

### `lab-plamenska` – flame test (KEM-SS-1 zgradba atoma; KEM-SS-2 alkalijske kovine in halogeni; KEM-OS-8 razporeditev elektronov with `{ raven: "os" }`)
Bunsen burner (air collar closed / half / open: luminous sooty flame or non-luminous with a blue inner cone, flickering, still under reduced motion), nichrome loop (starts dirty with Na from fingers; dip in conc. HCl and heat removes 85 % per cycle, ocena; without HCl the salt sticks at 15 %), chlorides of Li, Na, K, Ca, Sr, Ba, Cu and four unknowns per seed (one is Na + K), cobalt-blue glass, hand spectroscope 400–780 nm.
Data: NIST ASD air wavelengths Li 670,78, 610,36, 460,29; Na 588,995/589,592; K 766,49, 769,90, 404,41/404,72; Ca 422,67; Sr 460,73; Ba 553,55; Cu 510,55, 515,32, 521,82 nm; molecular bands CaOH 554/622, SrOH 606/682, SrCl 646, BaCl/BaOH 513/524/532, CuCl 435/444/488/498 nm (peaks ocena, Pearse & Gaydon); intensities and evaporation times ocena (Na ~100× brighter to the eye than Li; K strong but where the eye is ~1000× less sensitive). Colour: CIE 1931 2° observer (Wyman–Sloan–Shirley 2013 fit, exponential tail above 680 nm fitted to the CIE table) → sRGB with desaturation; cobalt glass transmits 0,1 % at 589 nm, ~60 % blue, 75 % above 720 nm (ocena); spectroscope reading ±1,5 nm.
Table: sample, colour (student), lines read (SŠ), ion (student), ✓/✗; E = hc/λ of the brightest line; conclusion (electron transitions, E = hc/λ; OŠ: each element its own colour).
Mistakes: dirty loop (yellow masks everything), luminous flame (salt share < 20 %), loop not dipped in HCl (weak colour), K with Na without cobalt glass, no goggles.
Tests: lines within 0,1 nm of NIST and the reading within 1,5 nm; hues (Li/Sr red, Na yellow-orange, Ca orange, Ba green, Cu blue-green, K violet); Na share > 95 % in Na + K, K > 60 % through cobalt glass; dirty loop Na > 60 %, 2–4 cleanings, clean Li > 70 %, luminous flame < 20 %; no HCl dip; K evaporates first; unknowns contain one Na + K (20 seeds); E(Na D) = 2,105 eV; fuzz (no NaN) for all three engines, also for a paused step (dt = 0).

## Next (from j's list)
FIZ: pendulum and stopwatch; motion part B: collisions of two carts on the track (momentum, magnets/Velcro), uniform motion with a motion sensor, nested coffee filters (v_t ∝ √m), a(θ) on the incline to find μr; optics: concave mirror on the optical bench (`lab-zrcalo`, reuses `LecaBench` with 1/a + 1/b = 2/R), diverging lens with a converging one, dispersion with a prism (white light), lens defects; forces: series/parallel springs and a digital force sensor, Pascal's vessels, a typed reading (student enters the value) in `lab-hooke`/`lab-gostota`. KEM: electroplating (copper on a key, mass vs charge, reuses `ElektrolizaBench` kinetics), corrosion of iron (nails in water, salt water, oil, with zinc/copper contact), Daniell cell with a Zn | Cu series battery for an LED, electrolysis of CuSO₄ with copper electrodes (mass change).
NAR: the same engines on more NAR-OS-6/7 topics. Indicators: enzyme pH dependence (amylase at pH 4/7/9, reuses `SlinaBench`), the 0 °C tube warmed to 37 °C, a home version of `lab-ph` with only red cabbage, Sudan III for fats, pH meter alkaline error. Heat: specific heat of metals (hot metal block into a calorimeter, reuses `MesanjeBench`),
solidification curve (cooling of stearic acid / salol), a separate stopwatch for `lab-grelnik` (now started by the switch), stirring as a choice in `lab-faze`. Each one: model + test first, then UI, then the three reviews.
Electromagnetism: transformer with the demountable U-core (U₂/U₁ = N₂/N₁, reuses the coils and `JEDRA.u`), eddy-current brake (magnet in a copper tube vs the acrylic one; not done), Earth's field with a tangent galvanometer, iron core in `lab-indukcija` hand mode (not done).
