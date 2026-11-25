// 3D svet in atlas telesa: spletna stran /3d (server/tri-d.js, public/3d/) v WebView, enako kot kalkulator
// (calculator.tsx), da sta splet in aplikacija enaka. Brez id-ja (hash "") pokaže zbirko vseh modelov, z id-jem en
// model ali atlas čez zaslon. Jezik gre v naslov; »Vprašaj inštruktorja« pošlje stran kot sporočilo
// ({ tip: "vprasaj", besedilo }), aplikacija odpre nov pogovor in vprašanje pošlje.
import React, { useRef, useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { API_URL, CHANNEL, api, webUrl } from "@/lib/api";
import { useStudent } from "@/lib/session";
import { currentLanguage, t } from "@/lib/i18n";
import { ErrorView, Loading } from "@/components/ui";

const STAGE = "#0b0f16"; // oder 3D je vedno temen (public/3d/3d.css)

// Napaka nalaganja: brez povezave (iOS NSURLErrorDomain, Android WebViewClient.ERROR_* in net::ERR_*) ali kaj drugega.
// Prej je vsaka napaka rekla »potrebuje povezavo«, tudi ko je bila povezava v redu.
const OFFLINE_CODES = new Set([-1009, -1005, -1004, -1003, -1001, -2, -6, -8]);
const OFFLINE_TEXT = /internet_disconnected|name_not_resolved|address_unreachable|network_changed|timed_out|offline|not connected|connection was lost|could not connect|timed out/i;
type LoadError = { kind: "offline" | "memory" | "other"; code: string };
export function loadErrorOf(code?: number, description?: string): LoadError {
  if ((typeof code === "number" && OFFLINE_CODES.has(code)) || OFFLINE_TEXT.test(description || "")) return { kind: "offline", code: "" };
  return { kind: "other", code: [code, description].filter((x) => x !== undefined && x !== "").join(" ").slice(0, 120) };
}

export function Web3D({ hash = "" }: { hash?: string }) {
  const student = useStudent();
  const [failed, setFailed] = useState<LoadError | null>(null);
  const [attempt, setAttempt] = useState(0);
  // Sistem je ugasnil proces strani (iOS: premalo pomnilnika, aplikacija dolgo v ozadju): stran naložimo znova; ob
  // tretjem padcu (do ročnega »Poskusi znova«) pokažemo napako, sicer bi se nalagala v nedogled.
  const crashes = useRef(0);
  const reloadAfterCrash = () => {
    crashes.current += 1;
    if (crashes.current > 2) setFailed({ kind: "memory", code: "" });
    else setAttempt((a) => a + 1);
  };
  const uri = webUrl(`/3d?lang=${encodeURIComponent(currentLanguage() || "sl")}${hash ? `#${hash}` : ""}`);

  const onMessage = async (e: { nativeEvent: { data: string } }) => {
    let msg: { tip?: string; besedilo?: string } = {};
    try {
      msg = JSON.parse(e.nativeEvent.data);
    } catch {
      return;
    }
    if (msg.tip !== "vprasaj" || !msg.besedilo) return;
    try {
      const c = await api<{ id: number }>(`/api/students/${student.id}/conversations`, { body: {} });
      router.push({ pathname: "/chat/[id]", params: { id: String(c.id), send: msg.besedilo.slice(0, 2000) } });
    } catch (err) {
      Alert.alert((err as Error).message);
    }
  };

  if (failed) {
    const message =
      failed.kind === "offline"
        ? t("a3.offline")
        : failed.kind === "memory"
          ? t("a3.lowMemory")
          : `${t("a3.otherError")}${failed.code ? `\n${t("a3.errorTech", { koda: failed.code })}` : ""}`;
    const retry = () => {
      crashes.current = 0;
      setFailed(null);
      setAttempt((a) => a + 1);
    };
    return <ErrorView message={message} onRetry={retry} retryLabel={t("mob.retry")} />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: STAGE }}>
      <WebView
        key={attempt}
        source={{ uri }}
        style={{ flex: 1, backgroundColor: STAGE }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: STAGE }}>
            <Loading />
          </View>
        )}
        onMessage={onMessage}
        applicationNameForUserAgent={`EvklidApp/${Constants.expoConfig?.version ?? "1"} ${CHANNEL}`}
        onError={(ev: { nativeEvent: { code?: number; description?: string } }) => setFailed(loadErrorOf(ev.nativeEvent.code, ev.nativeEvent.description))}
        onHttpError={(ev: { nativeEvent: { statusCode: number } }) => ev.nativeEvent.statusCode >= 500 && setFailed({ kind: "other", code: `HTTP ${ev.nativeEvent.statusCode}` })}
        onContentProcessDidTerminate={reloadAfterCrash}
        onRenderProcessGone={reloadAfterCrash}
        onShouldStartLoadWithRequest={(req: { url: string }) => {
          if (req.url === API_URL || req.url.startsWith(`${API_URL}/`) || !/^https?:/.test(req.url)) return true;
          WebBrowser.openBrowserAsync(req.url).catch(() => {});
          return false;
        }}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        allowsLinkPreview={false}
        allowsInlineMediaPlayback
        overScrollMode="never"
        bounces={false}
      />
    </View>
  );
}
