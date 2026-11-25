// Zažene server/index.js kot ločen proces na vratih, ki jih izbere sistem (PORT=0), in počaka, da strežnik izpiše
// »Evklid teče na http://localhost:<vrata>«. Prej so testi izbirali naključna vrata 39000–39899: v CI (4 deli, datoteke
// hkrati) so ta vrata že imeli drugi strežniki (listen(0) jemlje iz istega območja 32768–60999), proces je padel z
// EADDRINUSE, test pa je 15 s čakal zaman (»fetch failed«) ali pa dobil izhod namesto tekočega strežnika.
// Vrne { srv, base, konec }: base je null, če se je proces končal pred zagonom (konec → { code, stderr }).
import { spawn } from "node:child_process";

export async function zazeniStreznik(env, { rokMs = 60000 } = {}) {
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { env: { ...env, PORT: "0" }, stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";
  srv.stderr.on("data", (d) => (stderr += d));
  const konec = new Promise((resolve) => srv.on("exit", (code) => resolve({ code, stderr })));
  const base = await new Promise((resolve, reject) => {
    const rok = setTimeout(() => reject(new Error(`strežnik se ni zagnal v ${rokMs} ms: ${stdout} ${stderr}`)), rokMs);
    srv.stdout.on("data", (d) => {
      stdout += d;
      const m = /teče na http:\/\/localhost:(\d+)/.exec(stdout);
      if (m) {
        clearTimeout(rok);
        resolve(`http://127.0.0.1:${m[1]}`);
      }
    });
    konec.then(() => {
      clearTimeout(rok);
      resolve(null);
    });
  }).catch((e) => {
    srv.kill();
    throw e;
  });
  return { srv, base, konec };
}
