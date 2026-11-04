// Lekcija teme: po korakih (kratke kartice z vprašanji »Preveri se« vmes, public/lesson-steps.js)
// ali vsa naenkrat, »Razloži drugače«, nato Vadi naloge ali razlaga z inštruktorjem.
import React, { useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import Storage from "expo-sqlite/kv-store";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { lessonSteps } from "../../../../public/lesson-steps.js";
import { api } from "@/lib/api";
import { key } from "@/lib/keys";
import { useStudent } from "@/lib/session";
import { t } from "@/lib/i18n";
import { radius, useTheme } from "@/lib/theme";
import { failure, success, tap } from "@/lib/haptics";
import { useLoad } from "@/lib/useLoad";
import { RichText } from "@/components/RichText";
import { FormulaCtx, type Fx } from "@/lib/formula-ctx";
import { Banner, Body, Button, Card, Chip, ErrorView, Icon, Loading, ProgressBar, Screen, Title } from "@/components/ui";
import { ReportSheet } from "@/components/ReportSheet";

type Check = { q: string; options: string[]; correct: number; why?: string; optionWhy?: string[] };
type Section = { title: string; md: string };
type Lesson = {
  id: string;
  name: string;
  goals?: string;
  unit?: string;
  pathLabel?: string;
  subject?: string;
  lesson: { sections: Section[]; alternatives?: Section[]; checks?: Check[]; symbols?: unknown[] } | null;
  explanation?: string | null;
  practice: boolean;
  interactive: boolean;
  demos?: { id: string; title: string }[];
  locked?: { demo: string | null };
  prev: { id: string; name: string } | null;
  next: { id: string; name: string } | null;
};
type Step = { type: "text"; title: string; md: string; section: number } | { type: "check"; checks: number[]; final: boolean };

const STEP_PREF = key("lessonSteps");

export default function Topic() {
  const th = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const student = useStudent();
  const { data: L, error, loading, reload } = useLoad(() => api<Lesson>(`/api/students/${student.id}/lesson?id=${encodeURIComponent(id)}`), [id, student.id]);
  const [byStep, setByStep] = useState(() => Storage.getItemSync(STEP_PREF) !== "0");
  const [step, setStep] = useState(0);
  const [alt, setAlt] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  // Klikljive črke s pomenom iz predmeta in oznak te lekcije (kot na spletu).
  const fx = useMemo<Fx>(() => (L ? { subject: L.subject || (/^UNI-/.test(L.id) ? null : /^[A-Z]+/.exec(L.id)?.[0]) || student.settings?.subject || "MAT", symbols: L.lesson?.symbols || null } : null), [L, student.settings?.subject]);
  const steps = useMemo<Step[]>(() => (L?.lesson ? (lessonSteps(L.lesson.sections, L.lesson.checks?.length || 0) as Step[]) : []), [L]);

  if (loading) return <Loading />;
  if (error || !L) return <ErrorView message={error?.message || ""} onRetry={reload} retryLabel={t("mob.retry")} />;
  const lesson = L.lesson;

  // »Razloži« ob označenem besedilu lekcije: isto sporočilo kot na spletu (public/textbook.js, MAX_QUOTE 800).
  const explain = (sel: string) => {
    if (starting) return;
    const quote = sel.length > 800 ? `${sel.slice(0, 800)} …` : sel;
    learnWithTutor(t("mob.explainAsk", { name: L.name, quote }));
  };
  const setMode = (v: boolean) => {
    tap();
    setByStep(v);
    Storage.setItemSync(STEP_PREF, v ? "1" : "0");
  };
  const learnWithTutor = async (send = t("topic.startMsg", { name: L.name })) => {
    setStarting(true);
    try {
      const conv = await api<{ id: number }>(`/api/students/${student.id}/conversations`, { body: { topic_id: L.id } });
      router.push({ pathname: "/chat/[id]", params: { id: String(conv.id), send } });
    } catch (err) {
      Alert.alert((err as Error).message);
    } finally {
      setStarting(false);
    }
  };
  const markKnown = () =>
    Alert.alert(t("topic.known"), t("topic.confirmKnown"), [
      { text: t("mob.cancel"), style: "cancel" },
      {
        text: t("topic.known"),
        onPress: async () => {
          await api(`/api/students/${student.id}/topic-status`, { body: { topic_id: L.id, status: "mastered" } }).catch(() => null);
          success();
          Alert.alert(t("topic.markedKnown"));
        },
      },
    ]);
  const goTo = (topic: { id: string } | null) => topic && router.replace({ pathname: "/topic/[id]", params: { id: topic.id } });

  const cur = steps[Math.min(step, steps.length - 1)];
  const lastStep = step >= steps.length - 1;

  return (
    <FormulaCtx.Provider value={fx}>
    <Screen>
      <Stack.Screen options={{ title: L.name }} />
      <View style={{ gap: 4 }}>
        {L.unit ? <Text style={{ color: th.muted, fontWeight: "600" }}>{L.unit}</Text> : null}
        <Title size={26}>{L.name}</Title>
        {L.goals ? <Body muted>{L.goals}</Body> : null}
        {/* »Prijavi napako« v vsaki lekciji (kot na spletu): prijava gre skrbniku (server/reports.js). */}
        <Pressable
          onPress={() => setReporting(true)}
          disabled={reported}
          accessibilityRole="button"
          hitSlop={8}
          style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, minHeight: 40 }}
        >
          <Icon name={{ ios: reported ? "checkmark" : "flag", android: reported ? "check" : "flag" }} size={15} color={th.accent} />
          <Text style={{ color: th.accent, fontWeight: "600" }}>{reported ? t("rep.done") : t("rep.btn")}</Text>
        </Pressable>
      </View>
      <ReportSheet
        visible={reporting}
        ask={t("rep.ask")}
        reasons={[["wrong", t("lrep.wrong")], ["unclear", t("lrep.unclear")], ["broken", t("lrep.broken")], ["other", t("rep.other")]]}
        notePh={t("lrep.notePh")}
        onClose={() => setReporting(false)}
        onSend={async ({ reason, note }) => {
          await api(`/api/students/${student.id}/lesson-report`, {
            body: { topic: L.id, reason, note, step: lesson && byStep && steps.length > 1 ? Math.min(step, steps.length - 1) + 1 : null, device: "app" },
          });
          setReported(true);
          Alert.alert(t("lrep.thanks"));
        }}
      />

      {lesson && steps.length > 1 ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Chip label={t("tb.steps.byStep")} active={byStep} onPress={() => setMode(true)} />
          <Chip label={t("tb.steps.all")} active={!byStep} onPress={() => setMode(false)} />
        </View>
      ) : null}

      {!lesson ? (
        <Card>{L.explanation ? <RichText text={L.explanation} onExplain={explain} /> : <Body>{t("topic.noExplanation")}</Body>}</Card>
      ) : byStep && cur ? (
        <>
          <View style={{ gap: 6 }}>
            <Text style={{ color: th.muted, fontWeight: "600" }}>{t("tb.steps.count", { n: step + 1, m: steps.length })}</Text>
            <ProgressBar value={(step + 1) / steps.length} />
          </View>
          {cur.type === "text" ? (
            <Card>
              {cur.title ? <Title size={19}>{cur.title}</Title> : null}
              <RichText key={step} text={cur.md} onExplain={explain} />
            </Card>
          ) : (
            <Checks checks={cur.checks.map((i) => lesson.checks![i])} title={cur.final ? t("mob.checkYourself") : t("tb.steps.quick")} interactive={L.interactive} />
          )}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button title={t("tb.steps.prev")} kind="secondary" disabled={step === 0} onPress={() => setStep((s) => Math.max(0, s - 1))} style={{ flex: 1 }} />
            {!lastStep ? <Button title={t("tb.steps.next")} onPress={() => setStep((s) => s + 1)} style={{ flex: 1 }} /> : null}
          </View>
        </>
      ) : (
        <>
          {lesson.sections.map((s, i) => (
            <Card key={i}>
              {s.title ? <Title size={19}>{s.title}</Title> : null}
              <RichText text={s.md} onExplain={explain} />
            </Card>
          ))}
          {lesson.checks?.length ? <Checks checks={lesson.checks} title={t("mob.checkYourself")} interactive={L.interactive} /> : null}
        </>
      )}

      {lesson?.alternatives?.length && (!byStep || lastStep) ? (
        <Card>
          <Title size={18}>{t("mob.explainOther")}</Title>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {lesson.alternatives.map((a, i) => (
              <Chip key={i} label={a.title} active={alt === i} onPress={() => setAlt(alt === i ? null : i)} />
            ))}
          </View>
          {alt != null ? <RichText key={alt} text={lesson.alternatives[alt].md} onExplain={explain} /> : null}
        </Card>
      ) : null}

      {L.locked?.demo ? <Banner text={t("mob.demoLocked", { name: L.locked.demo })} tone="gold" icon={{ ios: "lock.fill", android: "lock" }} /> : null}

      {!lesson || !byStep || lastStep ? (
        <View style={{ gap: 10, marginTop: 4 }}>
          {L.practice ? <Button title={t("topic.practice")} icon={{ ios: "pencil.and.list.clipboard", android: "edit_note" }} onPress={() => router.push({ pathname: "/practice", params: { mode: "topic", topic: L.id } })} /> : null}
          <Button title={t("topic.learn")} kind="secondary" icon={{ ios: "bubble.left.and.bubble.right", android: "forum" }} loading={starting} onPress={() => learnWithTutor()} />
          <Button title={t("topic.known")} kind="ghost" onPress={markKnown} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            {L.prev ? <NavLink label={L.prev.name} dir="prev" onPress={() => goTo(L.prev)} /> : <View style={{ flex: 1 }} />}
            {L.next ? <NavLink label={L.next.name} dir="next" onPress={() => goTo(L.next)} /> : <View style={{ flex: 1 }} />}
          </View>
        </View>
      ) : null}
    </Screen>
    </FormulaCtx.Provider>
  );
}

function NavLink({ label, dir, onPress }: { label: string; dir: "prev" | "next"; onPress: () => void }) {
  const th = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={({ pressed }) => ({ flex: 1, padding: 12, borderRadius: radius.card, backgroundColor: th.surface, borderWidth: 1, borderColor: th.border, opacity: pressed ? 0.6 : 1, alignItems: dir === "next" ? "flex-end" : "flex-start" })}>
      <Text style={{ color: th.muted, fontSize: 13 }}>{dir === "next" ? t("tb.steps.next") : t("tb.steps.prev")}</Text>
      <Text style={{ color: th.accent, fontWeight: "700" }} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
}

// »Preveri se«: z dotikom odgovora (v paketu in preizkusu); sicer vprašanja z rešitvijo na dotik.
function Checks({ checks, title, interactive }: { checks: Check[]; title: string; interactive: boolean }) {
  return (
    <Card tone="accent">
      <Title size={18}>{title}</Title>
      {checks.map((c, i) => (
        <CheckItem key={c.q + i} c={c} interactive={interactive} />
      ))}
    </Card>
  );
}

function CheckItem({ c, interactive }: { c: Check; interactive: boolean }) {
  const th = useTheme();
  const [picked, setPicked] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const ok = picked === c.correct;
  const answered = ok || (!interactive && shown);
  return (
    <View style={{ gap: 8, paddingVertical: 6 }}>
      <RichText text={c.q} size={16} />
      {c.options.map((o, oi) => {
        const state = picked === oi ? (oi === c.correct ? "ok" : "bad") : answered && oi === c.correct ? "ok" : null;
        return (
          <Pressable
            key={oi}
            disabled={!interactive || ok}
            accessibilityRole="button"
            accessibilityState={{ selected: picked === oi }}
            onPress={() => {
              setPicked(oi);
              (oi === c.correct ? success : failure)();
            }}
            style={{ flexDirection: "row", gap: 10, alignItems: "center", padding: 10, borderRadius: radius.button, borderWidth: state ? 2 : 1, borderColor: state === "ok" ? th.ok : state === "bad" ? th.danger : th.border, backgroundColor: state === "ok" ? th.okSoft : state === "bad" ? th.dangerSoft : th.surface }}
          >
            <Text style={{ color: th.muted, fontWeight: "800" }}>{"abcdefgh"[oi]})</Text>
            <View style={{ flex: 1 }} pointerEvents="none">
              <RichText text={o} size={16} noFx />
            </View>
            {state ? <Icon name={state === "ok" ? { ios: "checkmark.circle.fill", android: "check_circle" } : { ios: "xmark.circle.fill", android: "cancel" }} color={state === "ok" ? th.ok : th.danger} size={20} /> : null}
          </Pressable>
        );
      })}
      {interactive && picked != null ? (
        <RichText text={ok ? `**${t("task.correctBang")}** ${c.why || ""}` : `${t("mob.notQuite")} ${c.optionWhy?.[picked] || t("mob.thinkAgain")}`} size={15} />
      ) : null}
      {!interactive ? (
        shown ? (
          c.why ? <RichText text={c.why} size={15} /> : null
        ) : (
          <Button title={t("task.solution")} kind="ghost" onPress={() => setShown(true)} style={{ alignSelf: "flex-start", minHeight: 40 }} />
        )
      ) : null}
    </View>
  );
}
