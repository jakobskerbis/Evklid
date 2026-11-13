// Windows: bližnjice s prejšnjimi imeni aplikacije (brand.json → legacy) na namizju in v samodejnem
// zagonu ob zagonu preimenujemo v trenutno ime, z novo ikono. Cilj (zagon-windows.bat /
// telefon-windows.bat) ostane enak, zato uporabniku ni treba storiti ničesar. Napake tiho preskočimo.
import path from "node:path";
import { execFile } from "node:child_process";
import { BRAND, LEGACY } from "../server/brand.js";

const q = (s) => `'${String(s).replace(/'/g, "''")}'`; // niz za PowerShell

export function renameLegacyShortcuts(root) {
  if (process.platform !== "win32" || !LEGACY.length) return;
  const icon = path.join(root, "assets", `${BRAND.slug}.ico`);
  const pairs = LEGACY.flatMap((l) => [
    `@($desk, ${q(`${l.name}.lnk`)}, ${q(`${BRAND.name}.lnk`)}, ${q(`Odpri ${BRAND.name}`)})`,
    `@($startup, ${q(`${l.name} za telefon.lnk`)}, ${q(`${BRAND.name} za telefon.lnk`)}, ${q(`${BRAND.name} za telefon`)})`,
  ]);
  const ps = [
    "$ws = New-Object -ComObject WScript.Shell",
    "$desk = [Environment]::GetFolderPath('Desktop')",
    "$startup = Join-Path $env:APPDATA 'Microsoft\\Windows\\Start Menu\\Programs\\Startup'",
    `$pairs = @(${pairs.join(", ")})`,
    "foreach ($p in $pairs) {",
    "  $old = Join-Path $p[0] $p[1]; $new = Join-Path $p[0] $p[2]",
    "  if (-not (Test-Path -LiteralPath $old)) { continue }",
    "  if (-not (Test-Path -LiteralPath $new)) {",
    "    $o = $ws.CreateShortcut($old); $n = $ws.CreateShortcut($new)",
    "    $n.TargetPath = $o.TargetPath; $n.Arguments = $o.Arguments; $n.WorkingDirectory = $o.WorkingDirectory",
    `    $n.WindowStyle = $o.WindowStyle; $n.IconLocation = ${q(icon)}; $n.Description = $p[3]; $n.Save()`,
    "  }",
    "  Remove-Item -LiteralPath $old",
    "}",
  ].join("\n");
  const encoded = Buffer.from(ps, "utf16le").toString("base64"); // brez težav z narekovaji in vrsticami
  execFile("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encoded], { windowsHide: true }, () => {});
}
