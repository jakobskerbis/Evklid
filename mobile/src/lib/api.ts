// Klici strežnika Evklid. Seja je v varni shrambi telefona (Keychain / Keystore), ne v piškotku:
// pošljemo jo v glavi Authorization, strežnik novo sejo vrne v glavi X-App-Session (server/mobile/index.js).
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import { fetch } from "expo/fetch";
import brand from "../../../brand.json";
import { t } from "./i18n";

export const API_URL: string = (Constants.expoConfig?.extra?.apiUrl as string) || `https://${brand.domain}`;
// Kanal gradnje: najprej kanal EAS Update, zapisan v sami gradnji (eas.json), ki ga posodobitev ne spremeni.
export const CHANNEL: "store" | "direct" = (Updates.channel || Constants.expoConfig?.extra?.channel) === "direct" ? "direct" : "store";
const APP_HEADER = `${Platform.OS}/${Constants.expoConfig?.version ?? "1"}`;
const SESSION_KEY = `${brand.slug}.session`;
const DEVICE_KEY = `${brand.slug}.device`;

let session: string | null = null;
let device: string | null = null;
const listeners = new Set<() => void>();

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any, message?: string) {
    super(message || body?.error || t("common.error", { status }));
    this.status = status;
    this.body = body || {};
  }
  get offline() {
    return this.status === 0;
  }
}

const b64url = (bytes: Uint8Array) => {
  let s = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  for (const b of bytes) s += chars[b & 63];
  return s;
};

// Naključni niz (za id naprave in enkratni niz prijave z Apple).
export const randomString = (n = 32) => b64url(Crypto.getRandomBytes(n));

export async function loadSession() {
  [session, device] = await Promise.all([SecureStore.getItemAsync(SESSION_KEY), SecureStore.getItemAsync(DEVICE_KEY)]);
  if (!device) {
    device = randomString(32);
    await SecureStore.setItemAsync(DEVICE_KEY, device);
  }
  return session;
}

export const hasSession = () => !!session;
// Za spletno stran v aplikaciji (src/app/web.tsx): ista seja in naprava kot zahteve aplikacije.
export const appHeaders = (): Record<string, string> => ({ "x-app-client": APP_HEADER, "x-app-device": device || "", ...(session ? { authorization: `Bearer ${session}` } : {}) });
export const onSessionChange = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

async function setSession(value: string | null) {
  if (value === session) return;
  session = value;
  if (value) await SecureStore.setItemAsync(SESSION_KEY, value);
  else await SecureStore.deleteItemAsync(SESSION_KEY);
  listeners.forEach((fn) => fn());
}
export const clearSession = () => setSession(null);

let onTaken: ((studentId: number) => void) | null = null;
export const setTakenHandler = (fn: ((studentId: number) => void) | null) => {
  onTaken = fn;
};

type Opts = { method?: string; body?: unknown; signal?: AbortSignal; stream?: boolean };

const BUSY_WAIT = [2000, 3000, 5000, 8000, 10000, 12000, 15000, 15000]; // skupaj ~70 s
// čakanje, ki ga prekliče signal zahteve (zapuščen zaslon)
const pause = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((ok, fail) => {
    const abort = () => (clearTimeout(id), fail(Object.assign(new Error("aborted"), { name: "AbortError" })));
    const id = setTimeout(() => (signal?.removeEventListener("abort", abort), ok()), ms);
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
  });
export const hostBusy = (res: Response) =>
  [502, 503, 504].includes(res.status) && !/json/i.test(res.headers.get("content-type") || "");
// Zaslon lahko med čakanjem pokaže »Evklid se posodablja …« (setBusyListener).
let onBusy: ((busy: boolean) => void) | null = null;
export const setBusyListener = (fn: ((busy: boolean) => void) | null) => {
  onBusy = fn;
};

// Vrne odgovor (Response) za tokove, sicer razčlenjen JSON. Napaka: ApiError (status 0 = brez povezave).
export async function request(path: string, opts: Opts = {}) {
  const headers: Record<string, string> = {
    accept: opts.stream ? "text/event-stream" : "application/json",
    "x-app-client": APP_HEADER,
    "x-app-device": device || "",
  };
  if (session) headers.authorization = `Bearer ${session}`;
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  let res!: Response;
  // Med objavo nove različice gostitelj ~1 minuto vrača 502/503 brez JSON: tiho ponovimo (kot splet, public/app.js).
  try {
    for (let i = 0; ; i++) {
      try {
        res = (await fetch(API_URL + path, {
          method: opts.method || (opts.body !== undefined ? "POST" : "GET"),
          headers,
          body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
          signal: opts.signal,
          credentials: "omit",
        })) as unknown as Response;
      } catch (err: any) {
        if (err?.name === "AbortError") throw err;
        throw new ApiError(0, { offline: true }, t("off.noConnection"));
      }
      if (!hostBusy(res) || i >= BUSY_WAIT.length) break;
      onBusy?.(true);
      await pause(BUSY_WAIT[i], opts.signal);
    }
  } finally {
    onBusy?.(false);
  }
  const s = res.headers.get("x-app-session");
  if (s !== null) await setSession(s && s !== "-" ? s : null);
  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    if (body?.login) await setSession(null);
    throw new ApiError(401, body);
  }
  if (opts.stream && res.ok) return res;
  const type = res.headers.get("content-type") || "";
  const body = type.includes("json") ? await res.json().catch(() => ({})) : await res.text();
  // Profil je odprt na drugi napravi (server/accounts/index.js): ponudimo prevzem (_layout.tsx).
  if (res.status === 409 && body?.taken && onTaken) onTaken(Number(body.student_id));
  // Strežnik ne odgovori (npr. med objavo nove različice vrne gostitelj stran 502/503 brez JSON):
  // prijazno sporočilo namesto začetka strani HTML.
  if (!res.ok && typeof body !== "object" && [502, 503, 504, 530].includes(res.status)) throw new ApiError(res.status, { serverBusy: true }, t("off.serverBusy"));
  if (!res.ok) throw new ApiError(res.status, typeof body === "object" ? body : { error: String(body).slice(0, 200) });
  return body;
}

export const api = <T = any>(path: string, opts: Opts = {}): Promise<T> => request(path, opts) as Promise<T>;
export const webUrl = (path = "/") => API_URL + path;
