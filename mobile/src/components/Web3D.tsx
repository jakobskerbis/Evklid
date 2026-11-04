// 3D svet in atlas telesa: spletna stran /3d (server/tri-d.js, public/3d/) v WebView, enako kot kalkulator
// (calculator.tsx), da sta splet in aplikacija enaka. Brez id-ja (hash "") pokaže zbirko vseh modelov, z id-jem en
// model ali atlas čez zaslon. Jezik gre v naslov; »Vprašaj inštruktorja« pošlje stran kot sporočilo
// ({ tip: "vprasaj", besedilo }), aplikacija odpre nov pogovor in vprašanje pošlje.
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { API_URL, api, webUrl } from "@/lib/api";
import { useStudent } from "@/lib/session";
import { currentLanguage, t } from "@/lib/i18n";
import { ErrorView, Loading } from "@/components/ui";

const STAGE = "#0b0f16"; // oder 3D je vedno temen (public/3d/3d.css)

export function Web3D({ hash = "" }: { hash?: string }) {
  const student = useStudent();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
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
    return <ErrorView message={t("a3.offline")} onRetry={() => (setFailed(false), setAttempt((a) => a + 1))} retryLabel={t("mob.retry")} />;
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
        onError={() => setFailed(true)}
        onHttpError={(ev: { nativeEvent: { statusCode: number } }) => ev.nativeEvent.statusCode >= 500 && setFailed(true)}
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
