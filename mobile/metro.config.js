// Metro: aplikacija uporablja tudi skupne datoteke iz korena repozitorija
// (prevodi public/i18n, preverjanje odgovorov server/practice/check.js, ravni XP, brand.json),
// zato Metro gleda ves repozitorij, a brez strežniških odvisnosti in podatkov.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const root = path.resolve(__dirname, "..");
const esc = (p) => p.replace(/[/\\]/g, "[/\\\\]").replace(/\./g, "\\.");
config.watchFolders = [root];
config.resolver.nodeModulesPaths = [path.join(__dirname, "node_modules")];
config.resolver.blockList = [
  new RegExp(`^${esc(path.join(root, "node_modules"))}[/\\\\].*`),
  new RegExp(`^${esc(path.join(root, "data"))}[/\\\\].*`),
  new RegExp(`^${esc(path.join(root, "sim-results"))}[/\\\\].*`),
];
module.exports = config;
