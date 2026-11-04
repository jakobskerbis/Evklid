# Games that teach: design guide for IGRE

j (2026-10-29): find the best ways to weave learning content into games, with nice animations and
simple controls. This guide is for the IGRE thread and any agent that adds a game engine
(`public/games/`). English on purpose (agents read it, see `docs/token-rules.md`). Game names and
in-game text stay Slovenian + English as in `engines.js`. Every design here is original; genres are
fine as inspiration, copying a known game's rules, levels, characters or art is not.

## 0. The one rule: the math is the verb

The four engines now (Meteorji, Baloni, Tekač, Sortirnica) all work the same way: a question in the
HUD, four ready answers in the world, the player hits one. That is a quiz with a skin. It is fun and
fast, and good for fluency (times tables, trig values), but the game would play the same with any
other quiz inside. The research below says the biggest learning gain comes when **the thing the
player does to win is the thing we want them to learn**, and the game world *is* the
representation (number line, graph, force arrow, molecule).

Quick test for every design (»test brez matematike«): delete the math from the game. If the game
still works unchanged, the math is pasted on. In a good design the game falls apart, because aiming,
building or balancing *is* the math.

## 1. What the evidence says (short)

| Finding | Source | What it means for us |
|---|---|---|
| Intrinsic integration: same math, but built into the core mechanic → more learning, and children chose to play it ~7× longer than the quiz-between-levels version | Habgood & Ainsworth 2011 (*J. Learning Sciences*), »Zombie Division« | Core mechanic = math action. Quiz pop-ups only for fluency drills. |
| Games beat conventional lessons on learning and retention (d ≈ 0.3), but are **not** automatically more motivating; best with several sessions and alongside instruction | Wouters et al. 2013 (*J. Ed. Psych.*); Clark, Tanner-Smith & Killingsworth 2016 (*RER*) | Games sit next to the lesson (link to Učbenik topic), many short sessions, not one long one. |
| »Value-added« features that help: explanatory feedback, self-explanation prompts (pick from a list), pretraining of key terms, personalization | Mayer 2019 (*Annu. Rev. Psych.*), Moreno & Mayer 2005 | After a miss show *why* in one line; at chapter breaks a one-tap »Zakaj?« question. |
| A linear number board game (equal spaces, numbers in a line) improves number sense far more than the same game with colours | Siegler & Ramani 2008 (*Dev. Science*) | Space in the game should be proportional to quantity (distance = value). |
| Large online experiment: moderate difficulty keeps players longest; too hard drives them away, and »easier« did not mean less learning | Lomas et al. 2013 (CHI), number-line game | Aim at ~70–80 % success; tier up slowly (we already start at tier 1). |
| Decorative but irrelevant animation and story (»seductive details«) can lower learning | Harp & Mayer 1998; Mayer signalling principle | Juice must *point at the math*: the effect shows size and direction of the error, the answer moment, the quantity. |
| Feedback that names the error, not only right/wrong | Hattie & Timperley 2007; ASSISTments | Reuse `answer.mistakes` ideas: the world shows *what kind* of mistake (too short, wrong sign, ×10). |
| Retrieval, spacing, interleaving | Roediger & Karpicke 2006; Cepeda 2006; Rohrer 2012 | Mistakes come back later in the run; boss levels mix 2–3 concepts. |

No »learning styles« (not supported by evidence).

## 2. Ten design rules (checklist for every new engine)

1. **Produce, don't pick.** The answer is made by an action that carries the quantity: aim at a
   point, drag a length, set an angle, add pieces, tilt a balance. Multiple choice only where the
   concept is a category (sorting) or for pure fluency drills.
2. **Space means quantity.** Distances, sizes and angles on screen are to scale (fixed scale per
   level, like the sims' fidelity rule). A ¾ bridge is ¾ of the gap, not just labelled »¾«.
3. **Error has size and direction.** A miss shows where the player landed and where the target
   was (ghost marker), and how far (»za 0,2 premalo«). Never just a red X.
4. **The world explains the consequence.** The bridge is too short so the cart falls; the rocket
   has too little fuel so it stops below the platform. The cause is visible, not told.
5. **One idea per game, one verb per thumb.** One concept family, one main action (drag *or* tap
   *or* aim). Everything works with one finger on a phone and with keys on a computer.
6. **Thinking time, not reflex time.** At tier 1 nothing moves while the player decides (or it moves
   very slowly). Speed only in fluency games and only after the pace choice (Počasi/Srednje/Hitro).
7. **Tolerance shrinks with tier.** Tier 1 accepts ±10 % of the range, tier 2 ±5 %, tier 3 exact
   (or ±1 snap step). Snapping to sensible steps (½, 0,1, 5°) keeps it fair on a phone.
8. **After two misses, a worked step.** A short 2-line hint in the world (»¾ = 3 kosi po ¼«), then
   an easier item of the same kind. Never game over on the first concept the player doesn't know.
9. **Juice points at the math** (section 4). No decoration that competes with the quantity.
10. **Story needs the math.** The character's problem is the math problem (Bor must build bridges of
    the right length to cross the canyon), not a story beside it.

## 3. Answer modes (new engine types beyond 4-choice)

These are the building blocks. Each one is a different *verb*; most concepts fit at least one.

| Mode | Verb | Input | Fits (current concept ids, examples) |
|---|---|---|---|
| **Postavi** (place) | put a marker at a value on a line, axis or dial | drag/tap; arrows ±step, Enter | `frac_compare`, `frac_dec`, `dec_add`, negatives (`nt`), `pct_of`, `fval`, `abs_eq`, rounding, estimation, `coord_dist`, `angles_*`, `log_val`, `sq` (next term) |
| **Odmeri** (size) | stretch/fill to an amount | drag a handle; arrows | `frac_add`, `frac_mul`, `ratio`, `prop`, `pct_change`, `area`, `perimeter`, `volume`, `similar`, units |
| **Nameri** (aim) | set angle and/or power so a shot lands | drag back and release (slingshot) or two sliders | `slope`, `line_eq`, `quad_vertex`, `quad_zero`, vectors (`la`), trig angles, physics trajectories |
| **Uravnovesi** (balance) | keep two sides equal by doing the same to both | tap operation cards (+3, ÷2) applied to both pans | `lin1`, `lin2`, `lin_frac`, `system`, `ineq` (tilt shows <, >), chemical equations |
| **Sestavi** (build) | combine pieces to hit a target | tap/drag pieces into a slot | `frac_add` (unit-fraction tiles), `add`/`mul` (area arrays), `polygon_angle`, factor trees (`nt`), molecules, circuits |
| **Uravnaj** (tune) | turn a parameter until the curve/shape matches a ghost | drag on the graph or a slider | `fn` (a, k, n, vertex), `compose`, `inverse` (mirror), `an` (tangent slope), `discr` (how many hits), statistics (mean/spread) |
| **Razvrsti** (sort) | already exists (Sortirnica) | tap a bin | classification: types of numbers, reactions, organisms |
| **Hitri strel** (fluency) | already exists (Meteorji, Baloni, Tekač) | tap one of 3–4 | facts that must be automatic: times tables, squares, trig values, PSE symbols |

### Generator contract (proposal for `topics.js`)

Keep `gen(tier) → { q, a, w }` for the quiz engines and add an optional second generator per
concept for the new modes, so old games keep working:

```js
// value modes (Postavi, Odmeri, Nameri, Uravnaj)
{ mode: "place", q: "¾", value: 0.75, min: 0, max: 2, step: 0.25, unit: "", labels: [0, 1, 2],
  show: "fraction" | "decimal" | "percent" | "angle",
  tol: { 1: 0.1, 2: 0.05, 3: 0 },          // share of (max−min), by tier
  why: { "0.57": "Si zamenjal števec in imenovalec?" } }   // same idea as answer.mistakes
// balance
{ mode: "balance", left: [["x",2],["n",3]], right: [["n",11]], ops: ["−3","÷2","+3","·2"], solve: 4 }
// build
{ mode: "build", target: "7/12", parts: ["1/2","1/3","1/4","1/6","1/12"], max: 3, check: (parts) => … }
```

A concept lists the modes it supports (`modes: ["place","quiz"]`); the portal shows a tile only for
pairs that fit, so the tile grid stays honest (no »engine × every concept« padding).

## 4. Animation and feel (»juice« that teaches)

Old-Flash look stays: `--gm-ink` outlines, bright fills, sunburst, chunky bevel buttons, chiptune
beeps. Inside that style:

- **Anticipation → action → follow-through.** Before the result, a short wind-up (0,15–0,25 s: the
  cannon pulls back, the bridge piece swings into place); then the result; then a settle (bounce,
  squash-and-stretch on landing). Ease-out for things that arrive, ease-in for things that leave.
- **Show the answer moment slowly.** The deciding moment (marker meets target, bridge meets the far
  edge, pans level out) gets 0,3–0,5 s and a tiny hit-pause (60–100 ms freeze). That is where the
  student's eyes must be.
- **Measure in the animation.** On a miss, draw a dashed bracket between the guess and the target
  with the difference (»+0,25«). On a hit, the quantity flashes on the object (»¾ = 0,75«), linking
  representations.
- **Particles and shake only for meaning.** Confetti colour = area colour; screen shake only on a
  miss and small (≤ 4 px); particles fly in the direction of the error (overshoot → forward).
- **Grow with the player.** Each chapter changes palette and adds one visual layer (stars, rain,
  parallax hills). Never more moving things during thinking time.
- **Pixel/chunky but readable.** Numbers and labels are never pixel art: crisp vector text with an
  ink stroke (`fitText`), ≥ 18 px on phones. Characters can be simple chunky shapes (circle body,
  two eyes, a hat) drawn in code; no external sprite sheets needed.
- **Accessibility.** `G.reduced`: no shake, no sunburst spin, instant transitions, keep the measure
  bracket. Never information only in colour (hit/miss also by icon and text). Sound has a toggle.
- **Performance.** One canvas, ≤ 200 particles, no shadows/blur filters on phones; draw static
  backgrounds once to an offscreen canvas.

## 5. Controls

- **One thumb.** Every mode is playable with drag or tap only. Drag handles have a ≥ 44 px hit area
  even when drawn smaller; dragging never scrolls the page (`touch-action: none` on the canvas).
- **Keyboard parity.** Arrows move by `step` (Shift = ×5), Enter/Space confirms, Tab cycles pieces,
  Esc pauses. Show the keys once on the start card on computers.
- **Confirm separately from moving.** For value modes: the player moves freely, then presses a big
  »Spusti!/Fire!« button (or releases the slingshot). No accidental answers from a twitchy thumb.
- **Live readout optional by tier.** Tier 1 shows the value under the marker while dragging (learn
  the scale), tier 2 shows it only for the axis labels, tier 3 hides it (estimate).
- **Undo in build/balance modes.** One »Nazaj« step; a balance move that breaks equality tips the
  scale and lets the player undo instead of losing a life.

## 6. Feedback and the learning loop

- **Immediate in-world consequence** (≤ 0,3 s), then a one-line reason in the HUD feedback box
  (`.gm-fb`, `aria-live`). Use the generator's `why` for known mistakes (reciprocal, sign, ×10,
  forgot to convert units), otherwise »za X preveč/premalo«.
- **Two misses on the same item:** show the worked step (2 lines, the representation drawn on the
  canvas), then an easier item. Mark the concept for the review list (already exists in `core.js`).
- **Comeback.** A missed item returns 3–5 items later in a new form (spacing within the run).
- **Boss level per chapter** mixes 2–3 related concepts of the area (interleaving), e.g. a canyon
  where some gaps are fractions, some decimals, some percent.
- **Self-explanation at chapter break.** One tap question about *why* the last mistake happened
  (»Most je bil prekratek, ker …« with 3 options). Mayer: select-from-list prompts help; free text
  slows games down.
- **Pretraining card.** The start card shows the one picture the game is built on (»Številska
  premica: 0 levo, 1 na sredini, 2 desno«) in one line, with a link to the Učbenik topic.
- **Mastery, not grind.** Coins and XP come from correct answers at the player's current tier and
  from fixing a mistake later; the daily cap stays (server/games.js). No rewards for replaying
  tier 1 forever.

## 7. Patterns per subject (original designs)

Each line: **name** (mode) – what you do – what the world shows – how a miss teaches.

### Mathematics

- **Mostogradnja** (Odmeri) – Bor drags a plank to fill a gap of »¾ m« on a ruler drawn to scale
  – the cart rolls over or falls – the plank stays, a ghost plank shows ¾, bracket »manjka ¼«.
  Fractions, decimals, percent, ratio, unit conversion (gap in cm, plank in m).
- **Skok po premici** (Postavi) – a frog jumps to the stone at the asked value on a number line
  that scrolls with chapters (negatives, fractions, then √2, π) – splash and a ripple at the true
  spot. Tier 3: the line has only 0 and one other tick.
- **Tehtnica** (Uravnovesi) – both pans carry boxes (x) and weights; tap operations that act on
  both sides until one x is alone – pans tilt in real time; an operation on one side only is not
  possible (the rule *is* the mechanic). Linear equations, then fractions, then systems (two
  scales), inequalities (scale may stay tilted the right way).
- **Ploščice** (Sestavi) – fill a garden bed of area 24 with rectangular tiles; or reach exactly
  7/12 of a tank with unit-fraction cups – overflow animates. Area, factors, multiplication arrays,
  fraction addition with unlike denominators.
- **Topničar** (Nameri) – set the slope (k) and intercept (n) of a laser line to hit two crystals –
  the line draws through the grid; a miss leaves the drawn line so the player sees which parameter
  is off. Linear functions; later a parabola cannon (vertex, zeros), sine wave tuning (amplitude,
  period).
- **Senčni graf** (Uravnaj) – drag a curve until it covers its shadow; the parameters show only
  after the match. Function transformations, inverse (mirror over y = x), composition.
- **Kotomer** (Postavi on a dial) – a lighthouse beam must be set to an angle (degrees, then
  radians, then »sin x = ½«) to light a ship – the beam sweeps; a miss shows the arc between.
- **Vrečka z žogicami** (Odmeri) – choose how many red/blue balls to put in a bag so the chance of
  red is ⅔; 20 animated draws show the long-run frequency. Probability, ratio, expected value.
- **Strmina** (Uravnaj, analysis) – a skier on a function curve: set the tangent board to match the
  slope at the marked point; later area under the curve as snow to shovel. Derivative, integral.
- Fluency (keep the quiz engines): times tables, squares, divisibility, trig values, log values.

### Physics (when FIZ games start)

- **Sila na sani** (Nameri/Odmeri) – drag force arrows (to scale) so a sled stops exactly at the
  flag; friction shown as an opposing arrow. Newton's laws, resultant force.
- **Rakete in gorivo** (Odmeri) – fuel = energy; fill so the rocket just reaches the platform at
  height h (mgh). Energy conservation, power over time.
- **Električni labirint** (Sestavi) – connect resistors/bulbs so the lamp gets the asked current;
  brightness and moving dots show current. Ohm's law, series/parallel.
- **Žarek** (Nameri) – rotate mirrors and set refraction to guide light to a crystal; angle arcs
  drawn. Reflection, refraction.
- **Valovi** (Uravnaj) – tune frequency and wavelength until your wave matches the shadow wave;
  v = λf shown live.

### Chemistry (when KEM games start)

- **Kuhinja molekul** (Sestavi) – drag atoms with free bonds (bond count drawn as hands) to build the
  asked molecule; a wrong valence leaves a hand empty and wobbling. Valence, formulas, organics.
- **Kemijska tehtnica** (Uravnovesi) – add coefficients so atom counts on both sides match; atoms are
  coloured balls piled per side. Balancing equations.
- **Recept** (Odmeri) – mix moles of reactants for a reaction; leftover reactant visibly stays in the
  pot. Stoichiometry, limiting reagent.
- **Mavrični lonec** (Uravnaj) – add acid/base drops to reach a target pH; indicator colour *and*
  a pH number line change together. pH, neutralization.
- **Hiša elementov** (Postavi) – drop an element into the right cell of the periodic table; the
  row/column lights up with the reason (valence electrons, shells).

### Biology and Naravoslovje

- **Vrt potomcev** (Sestavi) – fill a Punnett square from parent cards, plants grow with the
  predicted ratio. Genetics crosses.
- **Prehranjevalna veriga** (Sestavi/Razvrsti) – connect organisms with energy arrows; the pyramid
  shrinks by ~10 % per level. Food chains, energy flow.
- **Celica v vodi** (Uravnaj) – set the salt concentration outside a cell; the cell swells or shrinks.
  Osmosis.
- Sorting (Sortirnica) stays the right tool for NAR classification sets (`public/sim/nar-data.js`).

## 8. Story that needs the math

- Each engine keeps 4 chapters (`story: {sl, en}`); the chapter goal is a math goal in story words
  (»Bor mora čez kanjon s petimi vrzelmi«). Chapter screens are a single line; they never stop
  play for more than ~1,5 s (PR #95 rule).
- Characters are original, simple and recurring across engines (Vega, Bor, Lina, Zobko). A
  character can »own« a subject (Lina = chemistry kitchen) so the portal feels like one world.
- The avatar the student buys with coins (planned) appears inside the games (on the sled, in the
  rocket, as the frog's hat): the only student-chosen visible thing (j's rule), and a reason to play.

## 9. Priority for the IGRE thread

Highest learning value per engine, and widest reuse of the 120 concepts:

1. **Postavi engine** (number line / dial / axis) + `place` generators for ~35 concepts (fr, nt, ar
   estimation, fn values, angles, log).
2. **Uravnovesi engine** (Tehtnica) for `eq` (11 concepts); later KEM balancing.
3. **Odmeri engine** (Mostogradnja) for fractions, percent, ratio, units, area/volume.
4. **Nameri engine** (Topničar) for `fn` slope/intercept/vertex, vectors, trig.
5. **Sestavi engine** (Ploščice) for area, factors, fraction sums.
6. **Uravnaj engine** (Senčni graf) for transformations and `an`.
7. Keep the 4 quiz engines for fluency concepts only; drop tiles where the quiz skin adds nothing
   over the task page (e.g. multi-step equations in Meteorji).
8. FIZ/KEM/BIO engines from section 7 once the math modes are stable.

## 10. Done criteria for a new engine

- Passes the »test brez matematike« (section 0) and rules 1–10 (section 2).
- Tested at 360 px and on desktop; one-finger play; keyboard-only play; `G.reduced` path.
- No console errors; 60 fps on a mid phone (no blur/shadow, offscreen background).
- A speed class in `PACE` (`public/games/unlock.js`); every new concept gets its curriculum topic(s) in
  `public/games/lessons.js` (or none, if no lesson teaches it).
- Generators: correct value computed in code, tolerance by tier, `why` for 1–3 typical mistakes,
  tested in `test/games.test.js` (40 seeds × 3 tiers, value inside `[min, max]`).
- UI strings in `public/i18n/sl.js` + all `public/i18n/ui/*.json`.
- Screenshot pair (phone + computer) in `/mnt/project-files/evklid/posnetki-igre/`.

## 11. Unlocking: play only what you can already solve (switched off)

**Switched off (j, 2026-10-29 18:04: »Odstrani zaporo iger«).** `LOCKS_ON = false` in
`public/games/unlock.js`: every game is open to every student. The rules below stay in the code
so they can be turned back on; new engines still get a PACE value and new concepts a lessons
mapping.
Instead the portal marks the path (j: »Naj bodo samo označene poti, preko katerih lažje pridejo do
razumevanja«): a game whose concept the student knows by the rules below, from their own or the
previous year (or mastered on the learning path), and whose speed class is the next one after the
fastest cleared game of that concept, gets a gold border and a compass and is listed first.

j (2026-10-29): »igre naj bodo zaklenjene, dokler nimajo učenci določenega nivoja znanja, da bodo
sploh sposobni reševati tako hitro kot zahtevajo«. This applies to every existing and future game.
Logic is in `public/games/unlock.js` (shared by the portal and the server); the server stores
results in `game_scores.cleared` and passed checks in `game_unlocks`.

1. **Know the topic first.** A concept is known when the student has mastered one of its topics on
   the learning path (`lessons.js` maps concept → topics; »I already know this« self-marks do not
   count), or when the concept is first taught in an earlier school year than the student's, or
   when the student passes the short check in the games (5 untimed questions, 4 right).
2. **Then speed, step by step.** Every engine has a speed class: 1 calm (maze, castle, bubbles,
   cannon, marble, orb), 2 medium, 3 fast (runner, heli, moles, jumper, slicer). `fun.js` (2026-10-29): pet, pairs, water,
   mines are calm; diner, hills, catcher medium. `retro.js` (2026-10-30): match, cards calm; blocks medium. `deduction.js` (2026-10-30): impostor calm. Calm games open as soon
   as the topic is known. Medium games open after one calm game on that topic with at least 8
   right and at least 80 % right; fast games after one such medium game.
3. **A locked tile explains itself.** It is grey with a lock and stays clickable: the card says
   what is missing and offers the way forward (open the topic with lesson and practice, take the
   check, or play the calmer game that unlocks it). Unlocked tiles are listed first.
4. **New engines** must declare their speed class in `PACE` (a test checks this). Judge it by the
   time a student has per answer and how much dexterity the game needs at the same time.

## 12. Games and the learning path (j, 2026-11-01)

Logic in `public/games/learn-link.js` (shared by server and portal), offer in `public/games/reward.js`.
**Reward game:** when a daily training ends (or any session ends with today's XP goal reached), the
done card offers »Igraj nagradno igro«: one game on a concept of the topics just practised (`reward`
in the finished session, topic → concept via `lessons.js`), produce-the-answer games first
(`REWARD_ENGINES`), else a calm game. Only an offer on the done screen, never during learning; none
with »Skrij igre«; calm look for SŠ and faculty. **»Ponovi šibke teme«:** a row at the top of the
grid (first page, no search) with up to 6 games for the concepts with the most mistakes in the last
7 days (wrong first answers on the learning path plus wrong answers in games, `weakFor` in
`server/games.js`), each tile says why (»3 napake ta teden«); no data → no row. **Pilot metrics**
(`GET /api/games/pilot`, admin or the server's own computer, like the weekly votes; card under it in
Games): per student and day only counters (`game_days`, `game_concept_days`, kept 120 days): games
played, games followed by a learning-path answer within 30 min (»vrnitev na pot«), and game
accuracy on the student's weak concepts vs. others. The report sums over students, no names or ids,
and shows numbers only from 3 players on.
