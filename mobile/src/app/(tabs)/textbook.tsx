// Uči se (kot na spletu, public/uci-se.js): zavihki Učbenik | Laboratorij | 3D svet, odpre se zadnji uporabljeni.
// Učbenik: kazalo učne poti (vse lekcije po poglavjih) in iskanje po vseh učbenikih. 3D svet: zbirka strani /3d v
// WebView. Laboratorij ima samo splet (docs/mobilna-aplikacija.md): naravni zasloni so za čas brez povezave, zato
// zavihek pove, da potrebuje povezavo, in ponudi nov poskus spletne strani.
import React, { useEffect, useState } from "react";
import { Platform, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Storage from "expo-sqlite/kv-store";
import { api } from "@/lib/api";
import { useStudent } from "@/lib/session";
import { t } from "@/lib/i18n";
import { key } from "@/lib/keys";
import { font, radius, useTheme } from "@/lib/theme";
import { useLoad } from "@/lib/useLoad";
import { getPack } from "@/lib/offline";
import { Body, Button, Card, ErrorView, Icon, Loading, Seg, TabScreen } from "@/components/ui";
import { Web3D } from "@/components/Web3D";

type UciTab = "textbook" | "lab" | "3d";
const TAB_KEY = key("uciZavihek"); // isti ključ kot localStorage na spletu
const readTab = (): UciTab => {
  const v = Storage.getItemSync(TAB_KEY);
  return v === "lab" || v === "3d" ? v : "textbook";
};

export default function Learn() {
  const [tab, setTab] = useState<UciTab>(readTab);
  const pick = (v: UciTab) => {
    setTab(v);
    Storage.setItemSync(TAB_KEY, v);
  };
  const seg = (
    <Seg
      label={t("nav.learn")}
      value={tab}
      onChange={pick}
      items={[
        { key: "textbook", label: t("nav.textbook"), icon: { ios: "book", android: "menu_book" } },
        { key: "lab", label: t("nav.lab"), icon: { ios: "flask", android: "science" } },
        { key: "3d", label: t("a3.hubTitle"), icon: { ios: "cube", android: "view_in_ar" } },
      ]}
    />
  );
  if (tab === "3d") return <FullTab seg={seg}><Web3D /></FullTab>;
  if (tab === "lab") {
    return (
      <TabScreen title={t("nav.learn")}>
        {seg}
        <Card>
          <Body>{t("uci.labOffline")}</Body>
          <Button title={t("mob.retry")} kind="secondary" icon={{ ios: "arrow.clockwise", android: "refresh" }} onPress={() => router.replace("/web")} />
        </Card>
      </TabScreen>
    );
  }
  return <Textbook seg={seg} />;
}

// Zavihek čez preostali zaslon (WebView ne sme biti v ScrollView): naslov in preklopnik zgoraj, vsebina pod njima.
function FullTab({ seg, children }: { seg: React.ReactNode; children: React.ReactNode }) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: th.bg }}>
      <View style={{ paddingTop: insets.top + (Platform.OS === "android" ? 12 : 4), paddingHorizontal: 16, paddingBottom: 12, gap: 12 }}>
        <Text style={{ color: th.text, fontSize: 32, ...font(700) }} accessibilityRole="header" numberOfLines={1}>
          {t("nav.learn")}
        </Text>
        {seg}
      </View>
      {children}
    </View>
  );
}

type TocTopic = { id: string; name: string; lesson?: boolean; demo?: boolean; practice?: boolean };
type Toc = { key: string; label: string; units: { title: string; topics: TocTopic[] }[] };
type Hit = { id: string; name: string; unit: string; pathLabel: string; snippet?: string };

function Textbook({ seg }: { seg: React.ReactNode }) {
  const th = useTheme();
  const student = useStudent();
  const { data, error, loading, refreshing, pull, reload } = useLoad(async () => {
    try {
      const path = await api<{ key: string | null }>(`/api/students/${student.id}/path`);
      return path.key ? await api<Toc>(`/api/textbook/toc?path=${encodeURIComponent(path.key)}`) : null;
    } catch (err) {
      const pack = getPack(student.id);
      if (pack) return { key: pack.path, label: pack.view.label, units: pack.view.units } as Toc;
      throw err;
    }
  }, [student.id]);

  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) return setHits(null);
    const timer = setTimeout(() => {
      api<Hit[]>(`/api/textbook/search?q=${encodeURIComponent(query)}&system=${encodeURIComponent(student.settings?.school_system || "SI")}`)
        .then(setHits)
        .catch(() => setHits([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [q, student.settings?.school_system]);

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error.message} onRetry={reload} retryLabel={t("mob.retry")} />;

  const open = (id: string) => router.push({ pathname: "/topic/[id]", params: { id } });
  return (
    <TabScreen title={t("nav.learn")} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={pull} tintColor={th.accent} />}>
      {seg}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: th.surface2, borderRadius: radius.button, paddingHorizontal: 12 }}>
        <Icon name={{ ios: "magnifyingglass", android: "search" }} size={18} color={th.muted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={t("tbk.searchPh")}
          placeholderTextColor={th.muted}
          accessibilityLabel={t("tbk.searchAria")}
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={{ flex: 1, minHeight: 44, color: th.text, fontSize: 16 }}
        />
      </View>

      {hits ? (
        <Card>
          <Text style={{ color: th.muted, fontWeight: "700" }}>{hits.length ? t("tbk.hits", { q: q.trim() }) : t("tbk.noHits", { q: q.trim() })}</Text>
          {hits.map((h) => (
            <Pressable key={h.id} onPress={() => open(h.id)} accessibilityRole="button" style={({ pressed }) => ({ paddingVertical: 8, opacity: pressed ? 0.6 : 1 })}>
              <Text style={{ color: th.text, fontSize: 16, fontWeight: "600" }}>{h.name}</Text>
              <Text style={{ color: th.muted, fontSize: 13 }}>{h.pathLabel} · {h.unit}</Text>
              {h.snippet ? <Text style={{ color: th.muted, fontSize: 13 }} numberOfLines={2}>{h.snippet}</Text> : null}
            </Pressable>
          ))}
        </Card>
      ) : !data ? (
        <Body muted>{t("tbk.noBook")}</Body>
      ) : (
        <>
          <Text style={{ color: th.muted, fontSize: 15, fontWeight: "600" }}>{data.label}</Text>
          {data.units.map((u, i) => (
            <Card key={u.title + i}>
              <Text style={{ color: th.text, fontSize: 18, fontWeight: "700" }}>{u.title}</Text>
              {u.topics.map((tp) => (
                <Pressable key={tp.id} onPress={() => open(tp.id)} accessibilityRole="button" style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9, minHeight: 44, opacity: pressed ? 0.6 : 1 })}>
                  <Icon name={tp.lesson === false ? { ios: "doc", android: "description" } : { ios: "book.pages", android: "auto_stories" }} size={20} color={tp.lesson === false ? th.muted : th.accent} />
                  <Text style={{ flex: 1, color: th.text, fontSize: 16 }}>{tp.name}</Text>
                  <Icon name={{ ios: "chevron.right", android: "chevron_right" }} size={13} color={th.muted} />
                </Pressable>
              ))}
            </Card>
          ))}
        </>
      )}
    </TabScreen>
  );
}
