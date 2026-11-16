#!/usr/bin/env node
// Ciljna meritev natančnosti po spremembi lekcij ali prompta v main; teče v GitHubu (.github/workflows/meritev-po-objavi.yml),
// ne na strežniku (Render starter 512 MB: strežnik in meritev skupaj sta ga presegla, j 16. 11. 2026).
// Vse varovalke stroška so v server/meritev-po-objavi.js (1 $ na zagon, 15 $ na teden, en zagon na commit).
// Stanje in knjiga stroška: mapa baze (EVKLID_DB), v delovnem toku .meritev v predpomnilniku Actions.
// Brez ključa ANTHROPIC_API_KEY (skrivnost v GitHubu) se ne zgodi nič in nič ne stane.
import fs from "node:fs";
import { vklopljeno, zaženi, preberiStanje, stateFile, knjigaFile, porabaKnjige, isoTeden, povzetekBesedilo } from "../server/meritev-po-objavi.js";

if (!vklopljeno(process.env)) {
  console.log("Meritev po objavi: izklopljena (ni GitHub Actions, ni EVKLID_MERITEV_PO_OBJAVI=1 ali ni skrivnosti ANTHROPIC_API_KEY).");
  if (process.env.GITHUB_STEP_SUMMARY)
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, "Meritev po objavi ni tekla: v GitHubu ni skrivnosti ANTHROPIC_API_KEY (Settings > Secrets and variables > Actions).\n");
  process.exit(0);
}

await zaženi({ env: process.env });
const s = preberiStanje(stateFile()) || { zgodovina: [] };
const besedilo = povzetekBesedilo(s, { knjiga: porabaKnjige(knjigaFile(), isoTeden()) });
console.log(besedilo);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, "```\n" + besedilo + "```\n");
