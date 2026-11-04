// Inštruktor: seznam pogovorov in nov pogovor.
import React, { useState } from "react";
import { Alert, Pressable, RefreshControl, Text, View } from "react-native";
import { router } from "expo-router";
import { api } from "@/lib/api";
import { useStudent } from "@/lib/session";
import { t } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useLoad } from "@/lib/useLoad";
import { Body, Button, Card, ErrorView, Icon, Loading, TabScreen } from "@/components/ui";

type Conv = { id: number; title: string | null; updated_at: string };

export default function Tutor() {
  const th = useTheme();
  const student = useStudent();
  const [creating, setCreating] = useState(false);
  const { data, error, loading, refreshing, pull, reload, setData } = useLoad(() => api<Conv[]>(`/api/students/${student.id}/conversations`), [student.id], { refocus: true });

  const start = async (send?: string) => {
    setCreating(true);
    try {
      const c = await api<Conv>(`/api/students/${student.id}/conversations`, { body: {} });
      router.push({ pathname: "/chat/[id]", params: { id: String(c.id), ...(send ? { send } : {}) } });
    } catch (err) {
      Alert.alert((err as Error).message);
    } finally {
      setCreating(false);
    }
  };
  // Brisanje z enim dotikom, brez potrditve (kot na spletu, j 4. 11.).
  const remove = async (c: Conv) => {
    setData((list) => (list || []).filter((x) => x.id !== c.id));
    await api(`/api/conversations/${c.id}`, { method: "DELETE" }).catch(() => reload());
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error.message} onRetry={reload} retryLabel={t("mob.retry")} />;
  return (
    <TabScreen title={t("nav.chat")} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={pull} tintColor={th.accent} />}>
      <Button title={t("chat.new")} icon={{ ios: "square.and.pencil", android: "edit_square" }} loading={creating} onPress={() => start()} />
      {!data?.length ? (
        <Card>
          <Text style={{ color: th.text, fontSize: 18, fontWeight: "700" }}>{t("chat.hello", { name: student.name })}</Text>
          <Body>{t("chat.intro")}</Body>
          {[t("chat.idea1"), t("chat.idea2"), t("chat.idea3")].map((idea) => (
            <Button key={idea} title={idea} kind="ghost" onPress={() => start(idea)} style={{ justifyContent: "flex-start" }} />
          ))}
        </Card>
      ) : (
        <Card style={{ paddingVertical: 4 }}>
          {data.map((c, i) => (
            <Pressable
              key={c.id}
              onPress={() => router.push({ pathname: "/chat/[id]", params: { id: String(c.id) } })}
              onLongPress={() => remove(c)}
              accessibilityRole="button"
              accessibilityHint={t("chat.delete")}
              accessibilityActions={[{ name: "delete", label: t("chat.delete") }]}
              onAccessibilityAction={(e) => e.nativeEvent.actionName === "delete" && remove(c)}
              style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: th.border, opacity: pressed ? 0.6 : 1 })}
            >
              <Icon name={{ ios: "bubble.left", android: "chat_bubble_outline" }} size={20} color={th.accent} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: th.text, fontSize: 16, fontWeight: "600" }} numberOfLines={1}>{c.title || t("chat.new")}</Text>
                <Text style={{ color: th.muted, fontSize: 13 }}>{new Date(c.updated_at.replace(" ", "T") + "Z").toLocaleDateString()}</Text>
              </View>
              <Icon name={{ ios: "chevron.right", android: "chevron_right" }} size={13} color={th.muted} />
            </Pressable>
          ))}
        </Card>
      )}
    </TabScreen>
  );
}
