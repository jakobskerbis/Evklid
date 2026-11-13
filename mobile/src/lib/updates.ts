// Posodobitve aplikacije, ob zagonu (prijavi) in ob vrnitvi v aplikacijo po nekaj urah. Dve poti:
//  1. Nova gradnja APK (nova domorodna koda): samo APK s strani /prenesi na Androidu. Strežnik pove
//     versionCode naloženega APK (/api/app-links, server/mobile/apk-info.js). Če je večji od te gradnje,
//     ponudimo »Posodobi«: APK se prenese in odpre se sistemska namestitev (podatki ostanejo).
//  2. JavaScript (večina sprememb): expo-updates prenese novo različico z EAS Update (kanal gradnje v
//     eas.json, objava ob vsaki združitvi: .eas/workflows/posodobitev.yml) in jo sam uporabi ob
//     naslednjem zagonu. Ko je prenesena, ponudimo takojšen ponovni zagon.
// »Pozneje« velja do naslednjega zagona aplikacije.
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AppState, Linking, Platform } from "react-native";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { api, CHANNEL, webUrl } from "./api";
import { t } from "./i18n";

const RECHECK = 6 * 3600e3; // ob vrnitvi v aplikacijo preverimo znova po 6 urah
const APK_MIME = "application/vnd.android.package-archive";
const FLAG_GRANT_READ_URI_PERMISSION = 1;

type Links = { apk: string | null; apkVersion: { versionCode: number; versionName: string | null } | null };

// Povezava do novejšega APK ali null (trgovine posodabljajo same; iOS nima APK).
async function newerApk(): Promise<string | null> {
  if (Platform.OS !== "android" || CHANNEL !== "direct") return null;
  const mine = Number(Application.nativeBuildVersion);
  if (!Number.isInteger(mine)) return null;
  const l = await api<Links>("/api/app-links");
  if (!l.apk || !l.apkVersion || !(l.apkVersion.versionCode > mine)) return null;
  return /^https:\/\//.test(l.apk) ? l.apk : webUrl(l.apk);
}

// Ali je pripravljena nova različica JavaScripta (prenesena, uporabi se ob ponovnem zagonu).
async function jsUpdateReady(): Promise<boolean> {
  if (__DEV__ || !Updates.isEnabled) return false;
  const check = await Updates.checkForUpdateAsync();
  if (!check.isAvailable) return false;
  return (await Updates.fetchUpdateAsync()).isNew;
}

// Prenos APK v predpomnilnik in sistemska namestitev. Napredek 0–100.
async function installApk(url: string, onProgress: (pct: number) => void, started: (dl: FileSystem.DownloadResumable) => void) {
  const file = `${FileSystem.cacheDirectory}posodobitev.apk`;
  await FileSystem.deleteAsync(file, { idempotent: true });
  const dl = FileSystem.createDownloadResumable(url, file, {}, (p) => {
    if (p.totalBytesExpectedToWrite > 0) onProgress(Math.min(100, Math.round((100 * p.totalBytesWritten) / p.totalBytesExpectedToWrite)));
  });
  started(dl);
  const r = await dl.downloadAsync();
  if (!r || r.status !== 200) throw new Error(`download ${r?.status}`);
  const data = await FileSystem.getContentUriAsync(r.uri);
  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", { data, type: APK_MIME, flags: FLAG_GRANT_READ_URI_PERMISSION });
}

// Vrne napredek prenosa APK (0–100) ali null, ko se nič ne prenaša, in preklic prenosa (gumb nazaj).
export function useAppUpdates(active: boolean): [number | null, () => void] {
  const [progress, setProgress] = useState<number | null>(null);
  const last = useRef(0);
  const download = useRef<FileSystem.DownloadResumable | null>(null);
  const cancelled = useRef(false);
  const asked = useRef(false); // vprašamo največ enkrat na zagon

  const check = useCallback(async () => {
    if (asked.current || Date.now() - last.current < RECHECK) return;
    last.current = Date.now();
    const apk = await newerApk().catch(() => {
      last.current = 0; // brez povezave: poskusimo znova ob naslednji vrnitvi v aplikacijo
      return null;
    });
    if (apk) {
      asked.current = true;
      Alert.alert(t("mob.updateTitle"), t("mob.updateApk"), [
        { text: t("mob.updateLater"), style: "cancel" },
        {
          text: t("mob.updateNow"),
          onPress: () => {
            setProgress(0);
            cancelled.current = false;
            installApk(apk, setProgress, (dl) => (download.current = dl))
              .catch(() => {
                if (!cancelled.current) Linking.openURL(webUrl("/prenesi")).catch(() => {}); // stran za ročni prenos
              })
              .finally(() => {
                download.current = null;
                setProgress(null);
              });
          },
        },
      ]);
      return;
    }
    if (await jsUpdateReady().catch(() => false)) {
      asked.current = true;
      Alert.alert(t("mob.updateTitle"), t("mob.updateReady"), [
        { text: t("mob.updateLater"), style: "cancel" },
        { text: t("mob.updateNow"), onPress: () => Updates.reloadAsync().catch(() => {}) },
      ]);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    check();
    const sub = AppState.addEventListener("change", (s) => s === "active" && check());
    return () => sub.remove();
  }, [active, check]);

  const cancel = useCallback(() => {
    if (!download.current) return;
    cancelled.current = true;
    download.current.cancelAsync().catch(() => {});
  }, []);

  return [progress, cancel];
}
