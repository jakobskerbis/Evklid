// Klepet z inštruktorjem: odgovor prihaja sproti, formule in tabele kot na spletu, fotografija naloge
// (kamera ali galerija), »Razloži podrobneje«, predlog spremembe šole in letnika, osvojena tema.
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActionSheetIOS, Alert, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Network from "expo-network";
import { api, ApiError } from "@/lib/api";
import { sendMessage, type ChatEvent } from "@/lib/chat";
import { useSession, useStudent } from "@/lib/session";
import { t } from "@/lib/i18n";
import { radius, useTheme } from "@/lib/theme";
import { celebrate, failure, success, tap } from "@/lib/haptics";
import { pickPhoto, takePendingPhoto, type Photo } from "@/lib/images";
import { RichText } from "@/components/RichText";
import { toHtml } from "@/lib/rich";
import { FormulaCtx } from "@/lib/formula-ctx";
import { useTopicFx } from "@/lib/useTopicFx";
import { Banner, Button, Card, ErrorView, Icon, Loading } from "@/components/ui";
import { appDevice, ReportSheet } from "@/components/ReportSheet";

type Msg = { id: number | string; role: "user" | "assistant"; text: string; has_image?: boolean; photo?: string; error?: boolean; streaming?: boolean };
type Proposal = { settings: Record<string, string>; from: Desc; to: Desc; state?: "done" | "kept" };
type Desc = { system?: string; track?: string; level?: string; program?: string };

const levelText = (d: Desc) => {
  const m = /^(\d+)\. (razred|letnik)(.*)$/.exec(d.level || "");
  const level = m ? t(m[2] === "razred" ? "lp.grade" : "path.year", { n: m[1] }) + m[3] : d.level;
  const track = d.system ? null : ({ OSNOVNA_SOLA: t("lp.os"), SREDNJA_SOLA: t("lp.ss"), UNIVERZA: t("lp.uni") } as Record<string, string>)[d.track || ""];
  return [d.system, track, level, d.program].filter(Boolean).join(" · ");
};

export default function Chat() {
  // Formule v odgovorih: predmet pogovora in, pri pogovoru o temi, oznake lekcije te teme (kot na spletu).
  const [convFx, setConvFx] = useState<{ topic: string | null; subject: string | null }>({ topic: null, subject: null });
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const { id, send: initial } = useLocalSearchParams<{ id: string; send?: string }>();
  const student = useStudent();
  const fx = useTopicFx(convFx.topic, convFx.subject || student.settings?.subject || "MAT");
  const { refresh, updateStudent, parent } = useSession();
  // Skrbnik: »Prijavi napako« v glavi klepeta (kot na spletu, public/prijave.js).
  const [bugOpen, setBugOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [busy, setBusy] = useState(false);
  const [deepOk, setDeepOk] = useState(false);
  // »Pokaži celoten postopek« po treh korakih vodenja (strežnik: full_offer), kot na spletu.
  const [fullOk, setFullOk] = useState(false);
  // Gumbi z izbirami pod zadnjim odgovorom (strežnik: choices iz <<IZBIRE [...]>>), kot na spletu.
  const [choices, setChoices] = useState<string[]>([]);
  const [notes, setNotes] = useState<{ key: string; text: string; tone?: "gold" | "ok" | "info" }[]>([]);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const list = useRef<FlatList<Msg>>(null);
  const abort = useRef<AbortController | null>(null);
  const started = useRef(false);
  const root = useRef<React.ComponentRef<typeof View>>(null);
  const [top, setTop] = useState(0);

  const send = useCallback(
    async (body: { text?: string; image?: Photo | null; deep?: boolean }) => {
      if (busy) return;
      const msgText = body.text?.trim() || "";
      if (!msgText && !body.image) return;
      tap();
      setBusy(true);
      setDeepOk(false);
      setFullOk(false);
      setChoices([]);
      setProposal(null);
      const reply: Msg = { id: `r${Date.now()}`, role: "assistant", text: "", streaming: true };
      const userId = `u${Date.now()}`;
      setMessages((m) => [...m, { id: userId, role: "user", text: msgText || t("chat.photoNote"), photo: body.image?.uri, has_image: !!body.image }, reply]);
      const patch = (fn: (m: Msg) => Msg) => setMessages((all) => all.map((m) => (m.id === reply.id ? fn(m) : m)));
      const net = await Network.getNetworkStateAsync().catch(() => null);
      const lite = net?.type === Network.NetworkStateType.CELLULAR;
      abort.current = new AbortController();
      try {
        await sendMessage(
          Number(id),
          { text: msgText || undefined, image: body.image ? { media_type: body.image.media_type, data: body.image.data } : undefined, deep: body.deep || undefined, lite },
          (e: ChatEvent) => {
            if (e.event === "delta") patch((m) => ({ ...m, text: m.text + (e.data.text || "") }));
            else if (e.event === "done") {
              patch((m) => ({ ...m, id: e.data.id ?? m.id, text: e.data.text ?? m.text, streaming: false }));
              if (e.data.title) setTitle(e.data.title);
              // Predmet, ki ga je inštruktor pravkar določil (nov pogovor brez teme), kot na spletu.
              if (e.data.state?.subject) setConvFx((c) => (c.subject === e.data.state.subject ? c : { ...c, subject: e.data.state.subject }));
              // Ves delež podrobnih razlag porabljen (ai_out): brez »Razloži podrobneje«, kot na spletu.
              setDeepOk(!e.data.deep && !e.data.ai_out);
              setFullOk(!!e.data.full_offer);
              setChoices(Array.isArray(e.data.choices) ? e.data.choices.slice(0, 4) : []);
              if (e.data.settings) refresh().catch(() => {});
            } else if (e.event === "error") {
              patch((m) => ({ ...m, text: e.data.error, error: true, streaming: false }));
              failure();
            } else if (e.event === "mastered") {
              setNotes((n) => [...n, { key: `m${Date.now()}`, text: t("chat.mastered", { topic: e.data.topic || "" }), tone: "gold" }]);
              celebrate();
            } else if (e.event === "cards") {
              setNotes((n) => [...n, { key: `c${Date.now()}`, text: t("mob.cardsAdded", { n: e.data.cards?.length || 0 }) }]);
            } else if (e.event === "allowance") {
              // Zajamčena poraba naročnika (kot na spletu): 80 % obvestilo, 100 % hitri način; brez zneskov.
              // Družina: skupen delež za vse profile (ai.pool).
              const base = e.data.stage === "out" ? t("ai.out") : `${t("ai.low")}\n${t("ai.left", { n: e.data.left ?? 0 })}`;
              const text = e.data.pool ? `${base}\n${t("ai.pool")}` : base;
              setNotes((n) => [...n, { key: `a${Date.now()}`, text, tone: "info" }]);
            } else if (e.event === "proposal") setProposal(e.data);
          },
          abort.current.signal,
        );
        patch((m) => ({ ...m, streaming: false }));
      } catch (err) {
        // Ustavljen odgovor: strežnik potezo zavrže, zato jo odstranimo tudi tu in vrnemo besedilo v polje.
        if ((err as Error).name === "AbortError") {
          setMessages((all) => all.filter((m) => m.id !== reply.id && m.id !== userId));
          if (!body.deep) {
            setText(msgText);
            if (body.image) setPhoto(body.image);
          }
          return;
        }
        const msg = err instanceof ApiError ? (err.offline ? t("mob.offlineChat") : err.message) : (err as Error).message;
        patch((m) => ({ ...m, text: msg, error: true, streaming: false }));
        failure();
        // Kot na spletu: brez povezave (ali strežnik zaseden) se besedilo vrne v polje, da se ne izgubi;
        // ob meji porabe (429) ostane polje prazno, sporočilo je v oblačku.
        const lost = !(err instanceof ApiError) || err.offline || err.status >= 500 || err.status === 409;
        if (lost && !body.deep) {
          setText((cur) => (cur.trim() ? cur : msgText));
          if (body.image) setPhoto((cur) => cur || body.image || null);
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, id, refresh],
  );

  useEffect(() => {
    let alive = true;
    api<{ title: string | null; messages: Msg[]; topic?: { id: string } | null; state?: { subject?: string } | null }>(`/api/conversations/${id}`)
      .then((c) => {
        if (!alive) return;
        setTitle(c.title || "");
        setConvFx({ topic: c.topic?.id || null, subject: c.state?.subject || null });
        setMessages(c.messages);
        const lastMsg = c.messages[c.messages.length - 1] as (Msg & { full_offer?: boolean; choices?: string[] }) | undefined;
        setFullOk(!!lastMsg?.full_offer);
        setChoices(Array.isArray(lastMsg?.choices) ? lastMsg.choices.slice(0, 4) : []);
        setLoading(false);
        // Prvo sporočilo (iz lekcije, naloge ali skeniranja) se pošlje samo v prazen pogovor.
        if (started.current || c.messages.length) return;
        started.current = true;
        const pending = takePendingPhoto();
        if (initial || pending) send({ text: initial, image: pending });
      })
      .catch((err) => {
        if (!alive) return;
        setError((err as Error).message);
        setLoading(false);
      });
    return () => {
      alive = false;
      abort.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const attach = () => {
    const pick = async (source: "camera" | "library") => {
      try {
        const p = await pickPhoto(source);
        if (p) setPhoto(p);
      } catch (err) {
        Alert.alert((err as Error).message);
      }
    };
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions({ options: [t("chat.photo"), t("mob.fromLibrary"), t("mob.cancel")], cancelButtonIndex: 2 }, (i) => {
        if (i === 0) pick("camera");
        if (i === 1) pick("library");
      });
    } else {
      Alert.alert(t("chat.photo"), undefined, [
        { text: t("mob.camera"), onPress: () => pick("camera") },
        { text: t("mob.fromLibrary"), onPress: () => pick("library") },
        { text: t("mob.cancel"), style: "cancel" },
      ]);
    }
  };

  const submit = () => {
    const body = { text, image: photo };
    setText("");
    setPhoto(null);
    send(body);
  };

  const answerProposal = async (yes: boolean) => {
    if (!proposal) return;
    if (!yes) return setProposal({ ...proposal, state: "kept" });
    try {
      const updated = await api(`/api/students/${student.id}`, { method: "PUT", body: { settings: proposal.settings } });
      updateStudent(updated);
      success();
      setProposal({ ...proposal, state: "done" });
    } catch (err) {
      Alert.alert((err as Error).message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} retryLabel={t("mob.retry")} />;

  const last = messages[messages.length - 1];
  // Odmik tipkovnice = kje se zaslon začne (pod naslovno vrstico); izmerjen, ker se višina vrstice razlikuje.
  return (
    <FormulaCtx.Provider value={fx}>
    <View ref={root} onLayout={() => root.current?.measureInWindow((_x: number, y: number) => setTop(y))} style={{ flex: 1, backgroundColor: th.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={top}>
        <Stack.Screen
          options={{
            title: title || t("nav.chat"),
            headerRight: parent?.is_admin
              ? () => (
                  <Pressable onPress={() => setBugOpen(true)} accessibilityRole="button" accessibilityLabel={t("bug.btn")} hitSlop={10} style={{ padding: 6 }}>
                    <Icon name={{ ios: "flag", android: "flag" }} size={20} color={th.accent} />
                  </Pressable>
                )
              : undefined,
          }}
        />
        <ReportSheet
          visible={bugOpen}
          ask={t("bug.ask")}
          notePh={t("bug.notePh")}
          needNote
          onClose={() => setBugOpen(false)}
          onSend={async ({ note }) => {
            await api(`/api/students/${student.id}/bug`, { body: { note, conversation_id: Number(id), view: "chat", ...appDevice() } });
            Alert.alert(t("bug.thanks"));
          }}
        />
        <FlatList
          ref={list}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <Card>
              <Text style={{ color: th.text, fontSize: 18, fontWeight: "700" }}>{t("chat.hello", { name: student.name })}</Text>
              <Text style={{ color: th.muted, fontSize: 15 }}>{t("chat.intro")}</Text>
            </Card>
          }
          renderItem={({ item }) => <Bubble m={item} conv={id} />}
          ListFooterComponent={
            <View style={{ gap: 10 }}>
              {notes.map((n) => (
                <Banner key={n.key} text={n.text} tone={n.tone === "info" ? undefined : n.tone} icon={n.tone === "gold" ? { ios: "trophy.fill", android: "emoji_events" } : n.tone === "info" ? { ios: "info.circle", android: "info" } : { ios: "rectangle.stack", android: "style" }} />
              ))}
              {proposal ? (
                <Card tone="accent">
                  <Text style={{ color: th.text, fontWeight: "800" }}>{t("chat.setAsk")}</Text>
                  <Text style={{ color: th.muted }}>
                    {levelText(proposal.from)} → <Text style={{ color: th.text, fontWeight: "700" }}>{levelText(proposal.to)}</Text>
                  </Text>
                  {proposal.state ? (
                    <Text style={{ color: proposal.state === "done" ? th.ok : th.muted, fontWeight: "600" }}>{proposal.state === "done" ? t("chat.setDone") : t("chat.setKept")}</Text>
                  ) : (
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <Button title={t("chat.setYes")} onPress={() => answerProposal(true)} style={{ flex: 1 }} />
                      <Button title={t("chat.setNo")} kind="secondary" onPress={() => answerProposal(false)} style={{ flex: 1 }} />
                    </View>
                  )}
                </Card>
              ) : null}
              {choices.length >= 2 && !busy && last?.role === "assistant" && !last.error ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {choices.map((c) => (
                    <Pressable
                      key={c}
                      accessibilityRole="button"
                      // Napisano besedilo in fotografija ostaneta: izbira gre pred besedilo, učenec pošlje sam (kot na spletu).
                      onPress={() => {
                        tap();
                        setChoices([]);
                        if (text.trim() || photo) setText(text.trim() ? `${c}, ${text.trim()}` : c);
                        else send({ text: c });
                      }}
                      style={{ minHeight: 44, maxWidth: "100%", justifyContent: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.button, backgroundColor: th.accentSoft, borderWidth: 1, borderColor: th.accent }}
                    >
                      <Text style={{ color: th.text, fontWeight: "600", fontSize: 15, flexShrink: 1 }}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              {deepOk && !busy && last?.role === "assistant" && !last.error ? (
                <Button
                  title={t("chat.deeper")}
                  kind="secondary"
                  icon={{ ios: "sparkles", android: "auto_awesome" }}
                  onPress={() => send({ text: t("chat.deeperMsg"), deep: true })}
                  style={{ alignSelf: "flex-start" }}
                />
              ) : null}
              {fullOk && !busy && last?.role === "assistant" && !last.error ? (
                <Button
                  title={t("chat.full")}
                  kind="secondary"
                  icon={{ ios: "list.number", android: "format_list_numbered" }}
                  onPress={() => send({ text: t("chat.fullMsg") })}
                  style={{ alignSelf: "flex-start" }}
                />
              ) : null}
            </View>
          }
        />
        <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 8), borderTopWidth: 1, borderColor: th.border, backgroundColor: th.surface, gap: 8 }}>
          {photo ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Image source={{ uri: photo.uri }} style={{ width: 56, height: 56, borderRadius: 8 }} accessibilityLabel={t("chat.photoPreview")} />
              <Pressable onPress={() => setPhoto(null)} accessibilityRole="button" accessibilityLabel={t("chat.removeImage")} hitSlop={10}>
                <Icon name={{ ios: "xmark.circle.fill", android: "cancel" }} color={th.muted} />
              </Pressable>
            </View>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
            <Pressable onPress={attach} accessibilityRole="button" accessibilityLabel={t("chat.photo")} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
              <Icon name={{ ios: "camera.fill", android: "photo_camera" }} color={th.accent} size={24} />
            </Pressable>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={t("chat.placeholder")}
              placeholderTextColor={th.muted}
              accessibilityLabel={t("chat.placeholder")}
              multiline
              maxLength={4000}
              style={{ flex: 1, minHeight: 44, maxHeight: 140, borderRadius: 22, backgroundColor: th.surface2, color: th.text, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 11, fontSize: 16 }}
            />
            <Pressable
              onPress={busy ? () => abort.current?.abort() : submit}
              disabled={!busy && !text.trim() && !photo}
              accessibilityRole="button"
              accessibilityLabel={busy ? t("mob.stop") : t("chat.send")}
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: busy || text.trim() || photo ? th.accent : th.surface2 }}
            >
              <Icon name={busy ? { ios: "stop.fill", android: "stop" } : { ios: "arrow.up", android: "arrow_upward" }} color={busy || text.trim() || photo ? th.accentText : th.muted} size={20} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
    </FormulaCtx.Provider>
  );
}

// »Prijavi napako« pod odgovorom (kot na spletu, server/reports.js). Trgovini zahtevata, da uporabnik
// neprimerno vsebino AI prijavi v aplikaciji (Google Play: AI-generated content, Apple 1.2).
function ReportButton({ conv, mid, text }: { conv: string; mid: number; text: string }) {
  const th = useTheme();
  const fx = useContext(FormulaCtx);
  const [done, setDone] = useState(false);
  // shown: isti HTML, kot ga je izrisal RichText (skrbnik vidi napako izrisa, kot jo je videl učenec).
  const shown = () => {
    try {
      const html = toHtml(text, { ai: true, fx, owner: {}, ownPage: true });
      return html.length <= 200000 ? html : undefined;
    } catch {
      return undefined;
    }
  };
  const report = (reason: string) =>
    api(`/api/conversations/${conv}/messages/${mid}/report`, { body: { reason, shown: shown(), ...appDevice() } })
      .then(() => {
        setDone(true);
        Alert.alert(t("rep.thanks"));
      })
      .catch((err) => Alert.alert((err as Error).message));
  const ask = () => {
    const reasons: [string, string][] = [
      ["wrong", t("rep.wrong")],
      ["unsafe", t("rep.unsafe")],
      ["other", t("rep.other")],
    ];
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions({ title: t("rep.ask"), options: [...reasons.map((r) => r[1]), t("rep.cancel")], cancelButtonIndex: 3 }, (i) => {
        if (i < 3) report(reasons[i][0]);
      });
    } else {
      // Android pokaže največ tri gumbe: prekličeš z dotikom ob oknu ali gumbom nazaj.
      Alert.alert(
        t("rep.ask"),
        undefined,
        reasons.map(([reason, text]) => ({ text, onPress: () => report(reason) })),
        { cancelable: true },
      );
    }
  };
  return (
    <Pressable
      onPress={ask}
      disabled={done}
      accessibilityRole="button"
      hitSlop={8}
      style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, minHeight: 32, marginTop: 6 }}
    >
      <Icon name={{ ios: done ? "checkmark" : "flag", android: done ? "check" : "flag" }} size={14} color={th.muted} />
      <Text style={{ color: th.muted, fontSize: 13 }}>{done ? t("rep.done") : t("rep.btn")}</Text>
    </Pressable>
  );
}

function Bubble({ m, conv }: { m: Msg; conv: string }) {
  const th = useTheme();
  if (m.role === "user") {
    return (
      <View style={{ alignSelf: "flex-end", maxWidth: "85%", gap: 6, alignItems: "flex-end" }}>
        {m.photo ? <Image source={{ uri: m.photo }} style={{ width: 180, height: 180, borderRadius: 12 }} resizeMode="cover" /> : null}
        <View style={{ backgroundColor: th.accent, borderRadius: 18, borderBottomEndRadius: 6, paddingHorizontal: 14, paddingVertical: 10 }}>
          <Text style={{ color: th.accentText, fontSize: 16, lineHeight: 22 }} selectable>
            {m.has_image && !m.photo ? "📷 " : ""}
            {m.text}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={{ alignSelf: "stretch", backgroundColor: m.error ? th.dangerSoft : th.surface, borderRadius: radius.card, borderWidth: 1, borderColor: m.error ? th.danger : th.border, padding: 14 }}>
      {m.text ? <RichText text={m.text} ai streaming={m.streaming} size={16} ownPage /> : <Text style={{ color: th.muted, fontSize: 22 }}>…</Text>}
      {typeof m.id === "number" && !m.streaming && !m.error ? <ReportButton conv={conv} mid={m.id} text={m.text} /> : null}
    </View>
  );
}
