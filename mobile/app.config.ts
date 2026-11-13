/// <reference types="node" />
// Nastavitve aplikacije Evklid za iPhone, iPad in Android (Expo, CNG: mapi ios/ in android/ nastaneta ob gradnji).
// Ime in id-ji so v ../brand.json (enako kot za strežnik). Kanal razdeljevanja določi EXPO_PUBLIC_CHANNEL (eas.json):
//   store  – App Store / Google Play: naročnina samo prek nakupa v aplikaciji (zahteva obeh trgovin);
//   direct – APK s strani evklid.app/prenesi: naročnina prek obstoječega plačila na spletu (Stripe).
import type { ExpoConfig } from "expo/config";
import fs from "node:fs";
import path from "node:path";
import brand from "../brand.json";

// Jeziki vmesnika (isti kot na spletu): iOS po njih izbere jezik sistema in desno-levo postavitev (arabščina, perzijščina, urdu).
const LOCALES = ["sl", ...fs.readdirSync(path.join(__dirname, "../public/i18n/ui")).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5))];
const channel = process.env.EXPO_PUBLIC_CHANNEL === "direct" ? "direct" : "store";
const id = brand.app.bundle_id;
const EAS_PROJECT = process.env.EAS_PROJECT_ID || brand.app.eas_project_id;
// Besedila dovoljenj (slovensko; angleško in druge jezike sistema v locales/).
const CAMERA = `${brand.name} uporabi kamero, da poslikaš nalogo in jo inštruktor razloži po korakih.`;
const PHOTOS = `${brand.name} odpre fotografijo naloge, ki jo izbereš, da jo inštruktor razloži.`;

const config: ExpoConfig = {
  name: brand.name,
  slug: brand.slug,
  // Račun na expo.dev, ki mu pripada projekt EAS (brand.json app.expo_owner).
  owner: brand.app.expo_owner || undefined,
  scheme: brand.slug,
  version: "1.0.0",
  orientation: "default",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  backgroundColor: "#F6F7F9",
  ios: {
    bundleIdentifier: id,
    supportsTablet: true,
    usesAppleSignIn: true,
    config: { usesNonExemptEncryption: false },
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      NSCameraUsageDescription: CAMERA,
      NSPhotoLibraryUsageDescription: PHOTOS,
    },
  },
  locales: { en: "./locales/en.json", sl: "./locales/sl.json" },
  android: {
    package: id,
    adaptiveIcon: {
      backgroundColor: "#2353D1",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    // Namestitev novega APK iz aplikacije (src/lib/updates.ts) samo v APK s strani /prenesi; Google Play tega dovoljenja ne dovoli.
    permissions: ["android.permission.CAMERA", "android.permission.POST_NOTIFICATIONS", "android.permission.VIBRATE", ...(channel === "direct" ? ["android.permission.REQUEST_INSTALL_PACKAGES"] : [])],
    blockedPermissions: ["android.permission.RECORD_AUDIO", "android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_COARSE_LOCATION"],
    predictiveBackGestureEnabled: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-sqlite",
    "expo-web-browser",
    ["expo-localization", { supportsRTL: true, supportedLocales: { ios: LOCALES } }],
    "expo-apple-authentication",
    ["expo-splash-screen", { image: "./assets/splash-icon.png", imageWidth: 160, backgroundColor: "#F6F7F9", dark: { backgroundColor: "#0D1117" } }],
    ["expo-camera", { cameraPermission: CAMERA, recordAudioAndroid: false, barcodeScannerEnabled: false }],
    // cameraPermission mora biti besedilo, ne false: false v tem vtičniku kamero BLOKIRA (odstrani CAMERA iz Androida
    // in NSCameraUsageDescription iz iOS), zato je zavihek Skeniraj ne more dobiti (APK 5, 1. 11.).
    ["expo-image-picker", { photosPermission: PHOTOS, cameraPermission: CAMERA, microphonePermission: false }],
    ["expo-notifications", { color: "#2353D1", defaultChannel: "opomniki" }],
    "expo-iap", // nakupi v aplikaciji; APK za neposredni prenos jih ne kliče (glej src/lib/billing.ts)
  ],
  experiments: { typedRoutes: true },
  // Posodobitve JavaScripta z EAS Update (src/lib/updates.ts). Različica izvajalnika je prstni odtis domorodne
  // kode: posodobitev dobijo samo gradnje z enako domorodno kodo, za novo domorodno kodo je potreben nov APK.
  runtimeVersion: { policy: "fingerprint" },
  updates: EAS_PROJECT ? { url: `https://u.expo.dev/${EAS_PROJECT}`, checkAutomatically: "ON_LOAD", fallbackToCacheTimeout: 0 } : { enabled: false },
  extra: {
    channel,
    apiUrl: process.env.EXPO_PUBLIC_API_URL || `https://${brand.domain}`,
    // Id projekta EAS (expo.dev): v brand.json app.eas_project_id ali v spremenljivki EAS_PROJECT_ID.
    eas: EAS_PROJECT ? { projectId: EAS_PROJECT } : undefined,
  },
};

export default config;
