// Stanje prijave: račun (starš ali dijak sam), profili in izbrani profil.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Storage from "expo-sqlite/kv-store";
import { Directory, File, Paths } from "expo-file-system";
import brand from "../../../brand.json";
import { api, ApiError, clearSession, hasSession, loadSession, onSessionChange } from "./api";
import { setLanguage } from "./i18n";
import { key } from "./keys";
import { cancelReminders, registerPush, reminderTime, unregisterPush } from "./notifications";
import { forgetOffline, sendAllQueued, setOfflineOwner } from "./offline";
import { pocistiShrambo } from "./zasebnost.js";
import { requestWebClear } from "./web-state";

export type Parent = {
  id: number;
  email: string | null;
  name: string;
  minor: boolean;
  verified: boolean;
  is_admin?: boolean;
  trial_ends_at: string | null;
  subscription: { status: string; plan: string; seats: number; period_end: string | null; cancel_at_period_end: boolean } | null;
};
export type Student = {
  id: number;
  name: string;
  locked?: boolean;
  needs_password?: boolean;
  birth_year?: number;
  settings?: Record<string, any>;
  created_at?: string; // čas nastanka profila (ključi vaj brez povezave, src/lib/offline.ts)
};

type Ctx = {
  ready: boolean;
  parent: Parent | null;
  students: Student[];
  student: Student | null;
  signedIn: boolean;
  refresh: () => Promise<void>;
  select: (id: number | null) => Promise<void>;
  setParent: (p: Parent | null) => void;
  updateStudent: (s: Student) => void;
  signOut: () => Promise<void>;
};

const SessionCtx = createContext<Ctx | null>(null);
const STUDENT_KEY = key("student");
const CACHE_KEY = key("account"); // zadnji znani račun in profili za zagon brez povezave
const LEGACY_SLUGS = (brand.legacy || []).map((l: { slug?: string }) => l.slug || "").filter(Boolean);

// Konec seje (odjava, izbris računa, potekla seja; ob zagonu brez seje še ostanki prejšnjih različic): s telefona
// gre vse, kar je od računa (src/lib/zasebnost.js): izbrani profil, račun in profili, paketi vaj in neposlani
// odgovori vseh profilov, časi preverjanja, zavihek Uči, deljene slike in fotografije nalog v predpomnilniku; spletna stran
// v aplikaciji pobriše svoje osebne podatke (web-state.ts requestWebClear). Nastavitve naprave ostanejo.
function clearDevice() {
  forgetOffline();
  pocistiShrambo(Storage, brand.slug, LEGACY_SLUGS);
  requestWebClear();
  try {
    // Slike v predpomnilniku: deljene s spletne strani (src/app/web.tsx shareImage: <ime>.png na vrhu) in fotografije
    // nalog (src/lib/images.ts: expo-image-picker in expo-image-manipulator pišeta v svoji mapi, iOS včasih na vrh).
    for (const f of new Directory(Paths.cache).list()) {
      const slika = f instanceof File ? /\.(png|jpe?g|heic)$/i.test(f.name) : /^Image(Picker|Manipulator)$/.test(f.name);
      try {
        if (slika) f.delete();
      } catch {}
    }
  } catch {}
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [parent, setParent] = useState<Parent | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const loaded = useRef(false);

  const apply = useCallback(async (p: Parent | null, list: Student[]) => {
    loaded.current = true;
    setOfflineOwner(p?.id, list);
    setParent(p);
    setStudents(list);
    // Profil brez gesla se ne odpre sam: ob prvem odprtju ga je treba nastaviti (kot na spletu).
    const open = (s: Student) => !s.locked && !s.needs_password;
    const saved = Number(await Storage.getItem(STUDENT_KEY)) || null;
    const pick = list.find((s) => s.id === saved && open(s)) || (list.length === 1 && open(list[0]) ? list[0] : null);
    setStudentId(pick?.id ?? null);
  }, []);

  const refresh = useCallback(async () => {
    if (!hasSession()) {
      setParent(null);
      setStudents([]);
      return;
    }
    try {
      const [status, list] = await Promise.all([api("/api/account/status"), api<Student[]>("/api/students")]);
      // Seja se je med čakanjem končala (odjava): odgovor ne sme znova zapisati računa na telefon.
      if (!hasSession()) return;
      await Storage.setItem(CACHE_KEY, JSON.stringify({ parent: status.parent, students: list })).catch(() => {});
      await apply(status.parent, list);
    } catch (err) {
      if (!(err instanceof ApiError) || !err.offline) throw err;
      // Brez povezave ostane zadnje znano stanje; ob zagonu brez povezave ga preberemo s telefona,
      // da učna pot in vaje brez povezave delujejo (sicer bi se odprl prazen zaslon s profili).
      if (loaded.current || !hasSession()) return;
      const cached = await Storage.getItem(CACHE_KEY).catch(() => null);
      const c = cached ? (JSON.parse(cached) as { parent: Parent | null; students: Student[] }) : null;
      if (c && hasSession()) await apply(c.parent, c.students || []);
    }
  }, [apply]);

  useEffect(() => {
    (async () => {
      await loadSession();
      // Brez seje (npr. odjava v starejši različici, ki podatkov ni brisala): ostanki prejšnjega računa gredo.
      if (!hasSession()) clearDevice();
      setSignedIn(hasSession());
      await refresh().catch(() => {});
      setReady(true);
      // Strežnik po ponastavitvi gesla ali prevzemu pobriše žetone obvestil (dropForeignAccess); ob zagonu in prijavi
      // jih znova prijavimo, če je opomnik vklopljen (pregled #492 A P2-3). Na strežniku je prijava idempotentna.
      if (hasSession() && reminderTime()) registerPush();
    })();
    return onSessionChange(() => {
      setSignedIn(hasSession());
      if (hasSession() && reminderTime()) registerPush();
      if (!hasSession()) {
        // Odjava, izbris računa ali potekla seja: proč s podatki računa na telefonu.
        loaded.current = false;
        setParent(null);
        setStudents([]);
        setStudentId(null);
        clearDevice();
        cancelReminders();
      }
    });
  }, [refresh]);

  const student = students.find((s) => s.id === studentId) || null;
  useEffect(() => setLanguage(student?.settings?.language || null), [student?.settings?.language]);

  const select = useCallback(async (id: number | null) => {
    setStudentId(id);
    if (id) await Storage.setItem(STUDENT_KEY, String(id));
    else await Storage.removeItem(STUDENT_KEY);
  }, []);

  const signOut = useCallback(async () => {
    // Neposlani odgovori vaj brez povezave gredo pred odjavo na strežnik (nato se pobrišejo s telefona).
    await sendAllQueued();
    await unregisterPush();
    await api("/api/auth/logout", { body: {} }).catch(() => {});
    await clearSession();
    await Storage.removeItem(STUDENT_KEY);
  }, []);

  const updateStudent = useCallback((s: Student) => setStudents((list) => list.map((x) => (x.id === s.id ? { ...x, ...s } : x))), []);

  const value = useMemo(
    () => ({ ready, parent, students, student, signedIn, refresh, select, setParent, updateStudent, signOut }),
    [ready, parent, students, student, signedIn, refresh, select, updateStudent, signOut],
  );
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  const c = useContext(SessionCtx);
  if (!c) throw new Error("useSession zunaj SessionProvider");
  return c;
}

// Izbrani profil (zasloni pod zavihki ga vedno imajo).
// Ob odjavi ali menjavi profila zaslon do zaprtja še vidi zadnji profil (namesto napake).
export function useStudent() {
  const { student } = useSession();
  const last = useRef(student);
  if (student) last.current = student;
  if (!last.current) throw new Error("ni izbranega profila");
  return last.current;
}
