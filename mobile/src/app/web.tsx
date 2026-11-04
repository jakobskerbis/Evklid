// Aplikacija pokaže pravo spletno stran Evklida (j, 2026-11-04: »Splet znotraj aplikacije«), da sta splet in
// aplikacija vedno enaka po videzu in delovanju. Naravno ostane: prijava (src/app/sign-in.tsx), posodobitve,
// obvestila in vaje brez povezave (zavihki), ko strežnik ni dosegljiv.
// - Prvi naslov je /api/mobile/web z glavami aplikacije: strežnik isto sejo zapiše v piškotek WebView-a
//   (server/mobile/web-session.js), zato je stran prijavljena.
// - Odjava na spletu (»/?odjava=1«) odjavi tudi aplikacijo; povezave na druge strani odpre brskalnik.
// - Vrstici telefona (ura zgoraj, gumbi spodaj) dobita barvo roba strani, tudi ko učenec slog zamenja.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Linking, Platform, Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { API_URL, appHeaders } from "@/lib/api";
import { useSession } from "@/lib/session";
import { t } from "@/lib/i18n";
import { font, useTheme } from "@/lib/theme";

const ORIGIN = API_URL.replace(/\/+$/, "");
const START = `${ORIGIN}/api/mobile/web?to=${encodeURIComponent("/")}`;

// Barva zgornjega in spodnjega roba strani (zgornja vrstica, spodnji zavihki ali polje za pisanje): vrstici
// telefona (ura, gumbi) dobita isto barvo, tudi ko učenec zamenja slog ali zaslon. Pošlje le ob spremembi.
const BAR_JS = `(function(){
  var last="";
  // Barve vseh plasti v točki (spredaj → zadaj), npr. temna podlaga odprtega okna čez zgornjo vrstico.
  function col(y){var els=document.elementsFromPoint(Math.round(innerWidth/2),y),r=0,g=0,b=0,a=0;
    for(var i=0;i<els.length&&a<0.99;i++){var m=/rgba?\\(([\\d.]+)[, ]+([\\d.]+)[, ]+([\\d.]+)(?:[,/ ]+([\\d.]+))?/.exec(getComputedStyle(els[i]).backgroundColor);
      if(!m)continue;var k=(m[4]===undefined?1:+m[4])*(1-a);if(!k)continue;r+=m[1]*k;g+=m[2]*k;b+=m[3]*k;a+=k;}
    if(a<0.99){var w=(1-a)*255;r+=w;g+=w;b+=w;}
    return 'rgb('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+')';}
  function send(){try{var v=col(1)+'|'+col(innerHeight-2);if(v!==last&&window.ReactNativeWebView){last=v;var p=v.split('|');
    window.ReactNativeWebView.postMessage(JSON.stringify({t:'bar',top:p[0],bottom:p[1]}));}}catch(e){}}
  new MutationObserver(send).observe(document.documentElement,{attributes:true});
  addEventListener('scroll',send,{passive:true,capture:true});addEventListener('resize',send);setInterval(send,1000);send();
})();true;`;

// Izbrani profil iz aplikacije, če ga splet na tej napravi še nima (public/app.js bere »studentId«).
const studentJs = (id: number | null) =>
  `(function(){try{if(${id ? "true" : "false"}&&!localStorage.getItem('studentId'))localStorage.setItem('studentId','${id ?? ""}');}catch(e){}})();true;`;

// #rgb, #rrggbb ali rgb(): svetla barva → temne ikone v vrstici stanja.
function isLight(c: string) {
  let r = 0, g = 0, b = 0;
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  } else {
    const m = /rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/.exec(c);
    if (!m) return null;
    [r, g, b] = [m[1], m[2], m[3]].map(Number);
  }
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

export default function Web() {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const { student, signOut } = useSession();
  const ref = useRef<React.ComponentRef<typeof WebView>>(null);
  const canBack = useRef(false);
  const [bar, setBar] = useState<{ top: string; bottom: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [key, setKey] = useState(0);
  const [source] = useState(() => ({ uri: START, headers: appHeaders() }));

  // Android: gumb nazaj gre nazaj po spletni strani (zgodovina v public/app.js), na začetku zapre aplikacijo.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!canBack.current || failed) return false;
      ref.current?.goBack();
      return true;
    });
    return () => sub.remove();
  }, [failed]);

  const retry = useCallback(() => {
    setFailed(false);
    setLoading(true);
    setKey((k) => k + 1);
  }, []);

  const top = bar?.top || th.bg;
  const bottom = bar?.bottom || th.bg;
  const light = isLight(top);
  const offline = () => router.push(student ? "/(tabs)" : "/profiles");

  return (
    <View style={{ flex: 1, backgroundColor: top, paddingTop: insets.top }}>
      <StatusBar style={light === null ? "auto" : light ? "dark" : "light"} />
      {failed ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 24, backgroundColor: th.bg }}>
          <Text style={[{ color: th.text, fontSize: 17, textAlign: "center" }, font(600)]}>{t("off.noConnection")}</Text>
          <Pressable accessibilityRole="button" onPress={retry} style={{ backgroundColor: th.accent, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 22 }}>
            <Text style={[{ color: th.accentText, fontSize: 16 }, font(700)]}>{t("mob.retry")}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={offline} style={{ borderColor: th.accent, borderWidth: 1.5, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 22 }}>
            <Text style={[{ color: th.accent, fontSize: 16 }, font(700)]}>{t("mob.offlineTitle")}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: bottom, paddingBottom: insets.bottom }}>
          <WebView
            key={key}
            ref={ref}
            source={source}
            style={{ flex: 1, backgroundColor: th.bg }}
            applicationNameForUserAgent={`EvklidApp/${Constants.expoConfig?.version ?? "1"}`}
            originWhitelist={["*"]}
            injectedJavaScriptBeforeContentLoaded={studentJs(student?.id ?? null)}
            injectedJavaScript={BAR_JS}
            onMessage={(e: { nativeEvent: { data: string } }) => {
              try {
                const m = JSON.parse(e.nativeEvent.data);
                if (m?.t === "bar") setBar({ top: String(m.top || ""), bottom: String(m.bottom || "") });
              } catch {}
            }}
            onNavigationStateChange={(s: { url: string; canGoBack: boolean }) => {
              canBack.current = s.canGoBack;
              // Odjava na spletu (public/account.js → location.replace("/?odjava=1")).
              if (s.url.startsWith(ORIGIN) && /[?&]odjava=1\b/.test(s.url)) signOut().catch(() => {});
            }}
            onShouldStartLoadWithRequest={(req: { url: string; isTopFrame?: boolean }) => {
              if (req.isTopFrame === false) return true;
              if (req.url.startsWith(ORIGIN + "/") || req.url === ORIGIN || /^(about|data|blob):/.test(req.url)) return true;
              if (/^https?:/.test(req.url)) WebBrowser.openBrowserAsync(req.url).catch(() => {});
              // mailto: (zasebnost, povabilo staršem), tel: … odpre sistem (originWhitelist "*" jih ne odpre sam).
              else if (/^(mailto|tel|sms):/i.test(req.url)) Linking.openURL(req.url).catch(() => {});
              return false;
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => setFailed(true)}
            onHttpError={(e: { nativeEvent: { url: string; statusCode: number } }) => {
              // Seja aplikacije ne velja več (npr. odjava na drugi napravi ali novo geslo): nazaj na prijavo.
              if (e.nativeEvent.url.includes("/api/mobile/web") && e.nativeEvent.statusCode === 401) signOut().catch(() => {});
              else if (e.nativeEvent.url.includes("/api/mobile/web")) setFailed(true);
            }}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            allowsBackForwardNavigationGestures
            allowsInlineMediaPlayback
            mediaCapturePermissionGrantType="grant"
            allowFileAccess={false}
            setSupportMultipleWindows={false}
            allowsLinkPreview={false}
          />
          {loading ? (
            <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: th.bg }}>
              <ActivityIndicator color={th.accent} />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
