// Besedilo z Markdownom in formulami. Kratko besedilo brez formul je naravno besedilo; ostalo
// izriše WebView brez drsenja, ki je visok toliko kot vsebina (povezave se odprejo v brskalniku).
// html: že pripravljen HTML (npr. slika k nalogi). Ko se besedilo spreminja (odgovor inštruktorja
// prihaja sproti), WebView ostane naložen in se zamenja le vsebina, brez utripanja.
// onExplain (samo besedilo lekcije, ne klepet): v meniju označenega besedila je »Razloži«, kot na spletu
// gumb ob izboru v public/textbook.js. Android ob lastnih postavkah skrije sistemske, zato tam še »Kopiraj«.
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Clipboard, Modal, Platform, Pressable, Text, useWindowDimensions, View } from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { docHtml, formulaCard, isPlain, MEASURE_JS, toHtml } from "@/lib/rich";
import { FormulaCtx } from "@/lib/formula-ctx";
import { API_URL } from "@/lib/api";
import { font, useTheme } from "@/lib/theme";
import { isRtl, t } from "@/lib/i18n";

// noFx: brez klikljivih črk (izbire v nalogah in kvizu: dotik izbere odgovor, kartica bi izdala rešitev).
type Props = { text: string; html?: string; ai?: boolean; streaming?: boolean; size?: number; center?: boolean; minHeight?: number; onExplain?: (selected: string) => void; noFx?: boolean };

const replaceJs = (body: string) => `(function(){var c=document.getElementById('c');if(c)c.innerHTML=${JSON.stringify(body)};if(window.__fit)window.__fit();})();true;`;

function RichTextImpl({ text, html: rawHtml, ai = false, streaming = false, size = 17, center = false, minHeight = 0, onExplain, noFx = false }: Props) {
  const th = useTheme();
  const ctxFx = useContext(FormulaCtx);
  const fx = noFx ? null : ctxFx;
  const [card, setCard] = useState<{ label: string; html: string } | null>(null);
  // Velikost pisave v WebView sledi nastavitvi telefona (Dynamic Type, Android »Velikost pisave«), kot pri Text.
  const { fontScale } = useWindowDimensions();
  // Z »Razloži« vedno WebView: naravni Text nima lastnih postavk v meniju izbora.
  const plain = !rawHtml && !onExplain && isPlain(text);
  const body = useMemo(() => (plain ? "" : (rawHtml ?? toHtml(text, { ai, streaming, fx }))), [plain, rawHtml, text, ai, streaming, fx]);
  const [height, setHeight] = useState(minHeight || size * 1.6);
  const ref = useRef<React.ComponentRef<typeof WebView>>(null);
  const loaded = useRef(false);
  const latest = useRef(body);
  latest.current = body;
  // Dokument se zgradi znova samo ob menjavi teme ali velikosti; vsebina se nato zamenja na mestu.
  const doc = useMemo(() => {
    loaded.current = false;
    return docHtml(latest.current, th, { size: Math.round(size * fontScale), center });
  }, [th, size, center, fontScale]);

  useEffect(() => {
    if (loaded.current) ref.current?.injectJavaScript(replaceJs(body));
  }, [body]);

  if (plain) {
    return <Text style={{ color: th.text, fontSize: size, lineHeight: size * 1.5, textAlign: center ? "center" : undefined, ...font() }} selectable>{text.trim()}</Text>;
  }
  return (
    <View style={{ height, minHeight }}>
      <WebView
        ref={ref}
        // baseUrl: pisave, KaTeX in sirina.js s strežnika (kot na spletu), brez povezave ostane MathML.
        source={{ html: doc, baseUrl: `${API_URL}/` }}
        // Seznam primerja le izvor (brez poti): `${API_URL}/*` ne bi ujel baseUrl in iOS bi ga odprl v Safariju.
        originWhitelist={["about:blank", "data:*", API_URL]}
        style={{ backgroundColor: "transparent", flex: 1 }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        injectedJavaScript={MEASURE_JS}
        onLoadEnd={() => {
          loaded.current = true;
          ref.current?.injectJavaScript(replaceJs(latest.current));
        }}
        onMessage={(e: { nativeEvent: { data: string } }) => {
          const d = e.nativeEvent.data;
          if (d.startsWith("fx:")) {
            setCard(formulaCard(d.slice(3)));
            return;
          }
          const h = Number(d);
          if (h > 0) setHeight(Math.max(minHeight, h));
        }}
        onShouldStartLoadWithRequest={(req: { url: string }) => {
          // Sam dokument (baseUrl) se naloži v WebView, povezave v besedilu odpre brskalnik.
          if (req.url === `${API_URL}/`) return true;
          if (/^https?:/.test(req.url)) {
            WebBrowser.openBrowserAsync(req.url).catch(() => {});
            return false;
          }
          return true;
        }}
        javaScriptEnabled
        allowsLinkPreview={false}
        textInteractionEnabled
        setSupportMultipleWindows={false}
        menuItems={onExplain ? [{ key: "explain", label: t("mob.explain") }, ...(Platform.OS === "android" ? [{ key: "copy", label: t("sc.copy") }] : [])] : undefined}
        onCustomMenuSelection={onExplain ? (e: { nativeEvent: { key: string; selectedText: string } }) => {
          const sel = e.nativeEvent.selectedText.replace(/[ \t]+/g, " ").trim();
          if (sel.length < 2) return;
          if (e.nativeEvent.key === "copy") Clipboard.setString(sel);
          else onExplain(sel);
        } : undefined}
        accessible
      />
      {card ? <FormulaCard card={card} onClose={() => { setCard(null); ref.current?.injectJavaScript("window.__fxClose&&window.__fxClose();true;"); }} /> : null}
    </View>
  );
}

// Kartica oznake kot spodnji list (na spletu okence ob znaku): ime, zveza, sestavni deli in enota.
function FormulaCard({ card, onClose }: { card: { label: string; html: string }; onClose: () => void }) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }} onPress={onClose} accessible={false}>
        <Pressable onPress={() => {}} accessible={false} style={{ backgroundColor: th.surface, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16, paddingBottom: 16 + Math.max(12, insets.bottom), borderWidth: 1, borderColor: th.border }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <RichText text="" html={`<div class="fx-card"${isRtl() ? ' dir="rtl"' : ""}>${card.html}</div>`} size={16} noFx />
            </View>
            <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel={t("fx.close")} style={{ minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: th.muted, fontSize: 24 }}>×</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const RichText = memo(RichTextImpl);
