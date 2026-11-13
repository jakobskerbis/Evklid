// Kalkulator med vajo: spletni kalkulator (znanstveni, grafični, orodja, PSE) s strani /kalkulator
// (server/mobile/calculator.js) v WebView, da je enak kot na spletu brez prepisa v React Native.
// Tema in jezik gresta v naslov; povezave na druge strani se odprejo v brskalniku.
import React, { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { API_URL, webUrl } from "@/lib/api";
import { currentLanguage, t } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { ErrorView, Loading } from "@/components/ui";

const MODES = ["sci", "graph", "tools", "pse"];

export default function Calculator() {
  const th = useTheme();
  const params = useLocalSearchParams<{ mode?: string; subject?: string }>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const query: Record<string, string> = {
    mode: MODES.includes(params.mode || "") ? params.mode! : "sci",
    lang: currentLanguage() || "sl",
    theme: th.dark ? "dark" : "light",
    ...(params.subject ? { subject: params.subject } : {}),
  };
  const uri = webUrl(`/kalkulator?${Object.entries(query).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")}`);

  if (failed) {
    return <ErrorView message={t("mob.calcOffline")} onRetry={() => (setFailed(false), setAttempt((a) => a + 1))} retryLabel={t("mob.retry")} />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: th.bg }}>
      <WebView
        key={`${attempt}-${th.dark}`}
        source={{ uri }}
        style={{ flex: 1, backgroundColor: th.bg }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: th.bg }}>
            <Loading />
          </View>
        )}
        onError={() => setFailed(true)}
        onHttpError={(e: { nativeEvent: { statusCode: number } }) => e.nativeEvent.statusCode >= 500 && setFailed(true)}
        onShouldStartLoadWithRequest={(req: { url: string }) => {
          if (req.url === API_URL || req.url.startsWith(`${API_URL}/`) || !/^https?:/.test(req.url)) return true; // ne evklid.app.drugo
          WebBrowser.openBrowserAsync(req.url).catch(() => {});
          return false;
        }}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        allowsLinkPreview={false}
        overScrollMode="never"
        bounces={false}
      />
    </View>
  );
}
