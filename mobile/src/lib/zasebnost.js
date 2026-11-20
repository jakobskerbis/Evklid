// Podatki računa na telefonu: kaj se ob koncu seje (odjava, izbris računa, potekla seja) pobriše in kaj ostane.
// Čiste funkcije brez React Native (shramba se poda kot parameter): uporabljajo jih src/lib/session.tsx,
// src/lib/offline.ts in src/app/web.tsx, preizkus test/mobile-odjava-brisanje.test.js.
//
// Shramba telefona (expo-sqlite/kv-store): ključi »<slug>.<ime>«. Ostanejo samo nastavitve naprave (NAPRAVA);
// vse drugo z imenom aplikacije je od računa (izbrani profil, račun in profili za zagon brez povezave, paketi vaj
// z rešitvami in neposlani odgovori, časi preverjanja, zadnji zavihek Uči) in se pobriše. Nov ključ je tako
// privzeto zaseben; nastavitev naprave je treba dodati sem.
// Seja (SecureStore) se briše v src/lib/api.ts; id naprave ostane.

// haptics: tresljaji ob dotiku; reminder: ura dnevnega opomnika (nastavitev telefona, kot budilka);
// pushToken: žeton obvestil te namestitve (signOut ga odjavi na strežniku); web.pocisti: zastavica spodaj.
export const NAPRAVA = ["haptics", "reminder", "pushToken", "web.pocisti"];

// Ključ je od računa: ima ime aplikacije (ali prejšnje ime iz brand.json → legacy) in ni nastavitev naprave.
export function jeZasebenKljuc(k, slug, prejsnji = []) {
  if (typeof k !== "string") return false;
  if (k.startsWith(`${slug}.`)) return !NAPRAVA.includes(k.slice(slug.length + 1));
  return prejsnji.some((s) => s && k.startsWith(`${s}.`));
}

// Pobriše vse ključe računa iz shrambe (getAllKeysSync, removeItemSync). Vrne pobrisane ključe.
export function pocistiShrambo(storage, slug, prejsnji = []) {
  let keys = [];
  try {
    keys = storage.getAllKeysSync();
  } catch {
    return [];
  }
  const out = [];
  for (const k of keys) {
    if (!jeZasebenKljuc(k, slug, prejsnji)) continue;
    try {
      storage.removeItemSync(k);
      out.push(k);
    } catch {}
  }
  return out;
}

// --- Vaje brez povezave: ključi paketa in vrste so vezani na račun in na profil ---
// Id profila se po izbrisu lahko ponovi (students.id brez AUTOINCREMENT), zato ključ vsebuje tudi id računa
// in čas nastanka profila (created_at iz /api/students): nov profil z istim id-jem ne vidi starega paketa.
const zig = (createdAt) => String(createdAt || "").replace(/\D/g, "") || "0";
export const offlineKljuc = (slug, vrsta, parentId, student) => `${slug}.offline.${vrsta}.${parentId}.${student.id}.${zig(student.created_at)}`;

// Čas nastanka profila v ms (SQLite datetime('now') je UTC brez pasu) ali NaN.
const nastal = (createdAt) => Date.parse(String(createdAt || "").replace(" ", "T") + (/[zZ]|[+-]\d\d:?\d\d$/.test(String(createdAt || "")) ? "" : "Z"));

// Prenos ključev iz prejšnje oblike (»<slug>.offline.pack.<sid>«, »….queue.<sid>«) ob prvem zagonu nove različice.
// Paket se pobriše (ob povezavi se prenese znova). Neposlani odgovori se ohranijo samo za profil tega računa
// in samo tisti, nastali po nastanku profila (starejši so od izbrisanega profila z istim id-jem); drugo se pobriše.
export function preseliStare(storage, slug, parentId, students) {
  let keys = [];
  try {
    keys = storage.getAllKeysSync();
  } catch {
    return;
  }
  const re = new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.offline\\.(pack|queue)\\.(\\d+)$`);
  for (const k of keys) {
    const m = re.exec(k);
    if (!m) continue;
    try {
      const s = m[1] === "queue" && parentId != null ? students.find((x) => String(x.id) === m[2]) : null;
      const od = s ? nastal(s.created_at) : NaN;
      if (s && Number.isFinite(od)) {
        let stari = [];
        try {
          stari = JSON.parse(storage.getItemSync(k) || "[]");
        } catch {}
        const nasi = (Array.isArray(stari) ? stari : []).filter((r) => r && Date.parse(r.at) >= od);
        if (nasi.length) {
          const nov = offlineKljuc(slug, "queue", parentId, s);
          let zdaj = [];
          try {
            zdaj = JSON.parse(storage.getItemSync(nov) || "[]");
          } catch {}
          storage.setItemSync(nov, JSON.stringify([...(Array.isArray(zdaj) ? zdaj : []), ...nasi]));
        }
      }
      storage.removeItemSync(k);
    } catch {}
  }
}

// --- Spletna stran v aplikaciji (WebView, src/app/web.tsx) ---
// Enak seznam kot public/offline.js (PRIVATE_KEYS, PRIVATE_EXACT; test/mobile-odjava-brisanje.test.js preveri,
// da se ujemata). Nastavitve videza (jezik, tema, enote …) ostanejo.
export const spletVzorec = (slug) =>
  `^${slug}\\.(offline\\.|scan\\.|work\\.|graph\\.|sci\\.|goalSeen\\.|schedule|ours\\.|levelup\\.|zadnji-zaslon$|zadnji-posnetek$)`;
export const spletTocno = (slug) => ["teacherClasses", "studentId", `${slug}_invite_name`, `${slug}_koda`, `${slug}_ref`, `${slug}.vabilo`];
export const spletJeZasebno = (k, slug) => typeof k === "string" && (new RegExp(spletVzorec(slug)).test(k) || spletTocno(slug).includes(k));

// Skript za WebView: kot clearPrivate v public/offline.js pobriše osebne ključe localStorage in predpomnilnik API.
// Teče sinhrono pred skripti strani (injectedJavaScriptBeforeContentLoaded), zato stran ne prebere starih podatkov.
// V odprti strani najprej (kot clearPrivate) evklidZacetek.pozabi: stran ob zapiranju ne zapiše znova zadnjega zaslona.
export const spletPocistiJs = (slug) =>
  `(function(){try{var z=window.evklidZacetek;if(z&&z.pozabi)z.pozabi();}catch(e){}try{var re=new RegExp(${JSON.stringify(spletVzorec(slug))}),ex=${JSON.stringify(spletTocno(slug))},ks=[],i;` +
  `for(i=0;i<localStorage.length;i++)ks.push(localStorage.key(i));` +
  `for(i=0;i<ks.length;i++)if(re.test(ks[i])||ex.indexOf(ks[i])>=0)localStorage.removeItem(ks[i]);}catch(e){}` +
  `try{if(typeof caches!=='undefined')caches.keys().then(function(n){n.forEach(function(x){if(/-api(-|$)/.test(x))caches.delete(x);});}).catch(function(){});}catch(e){}` +
  `})();true;`;
