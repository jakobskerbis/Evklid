// Vnaprej pripravljene razlage tem (ustvarjene enkrat z Batch API, glej
// scripts/generate-explanations.js). Strežemo jih brez stroškov.
import "./env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const EXPLANATIONS_PATH = process.env.EVKLID_EXPLANATIONS || path.join(here, "..", "content", "explanations.json");

let cache = null;
let mtime = 0;
export function loadExplanations() {
  try {
    const st = fs.statSync(EXPLANATIONS_PATH);
    if (!cache || st.mtimeMs !== mtime) {
      cache = JSON.parse(fs.readFileSync(EXPLANATIONS_PATH, "utf8"));
      mtime = st.mtimeMs;
    }
  } catch {
    cache = {};
  }
  return cache;
}

export function getExplanation(topicId) {
  return loadExplanations()[topicId] || null;
}
