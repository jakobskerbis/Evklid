// Vaje: rešen zgled, naloga, odgovor, postopni namigi, rešitev in »Vprašaj inštruktorja«.
// mode=topic (ena tema, deluje tudi brez povezave iz paketa), daily (Današnji trening), review (ponavljanje).
// Odziv je enak kot na spletu (public/app.js), z vibracijo ob pravilnem in napačnem odgovoru.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { api, ApiError } from "@/lib/api";
import { useStudent } from "@/lib/session";
import { t } from "@/lib/i18n";
import { radius, useTheme } from "@/lib/theme";
import { celebrate, failure, success, tap } from "@/lib/haptics";
import { offlineAnswer, offlineHint, offlineNext } from "@/lib/offline";
import { figureHtml, type Figure } from "@/lib/figures";
import { RichText } from "@/components/RichText";
import Storage from "expo-sqlite/kv-store";
import { key } from "@/lib/keys";
import { expectedMs, progressAt, addDuration } from "../../../public/check-progress.js";
import { Banner, Body, Button, Card, ErrorView, Icon, Loading, ProgressBar, Screen, Title } from "@/components/ui";

type Task = {
  id: number | string;
  mode?: string;
  text: string;
  topicName?: string;
  figure?: Figure | null;
  inputHint?: string | null;
  answerType: "number" | "fraction" | "choice" | "coefficients";
  unit?: string | null;
  options?: string[] | null;
  optionsTex?: boolean; // možnosti so formule brez $ (kot renderMath na spletu)
  coefficientCount?: number | null;
  data?: { given?: string[]; find?: string[] } | null;
  hintSteps?: number;
  solution?: string;
  hint?: string;
};
type Step = { kind: "data" | "formula" | "hint"; given?: string[]; find?: string[]; formula?: string[]; text?: string };
type Done = { finished: true; total: number; correct: number; empty?: boolean; xp?: { gained: number } };
type Result = {
  kind?: string;
  retry?: boolean;
  closed?: boolean;
  correct?: boolean;
  message?: string | null;
  code?: string;
  params?: Record<string, string | number>;
  mistake?: { message: string; code?: string; params?: Record<string, string | number> };
  hint?: string;
  solution?: string;
  attemptsLeft?: number;
  xp?: { gained: number };
  mastered?: boolean;
  levelUp?: number;
  levelDown?: number;
  selfExplain?: string;
  offline?: boolean;
  next?: ({ index: number; total: number; task: Task } & Partial<Done>) | null;
};

const fbText = (r: { code?: string; params?: Record<string, string | number>; message?: string | null }) => (r.code ? t(r.code, r.params || {}) : r.message || "");

export default function Practice() {
  const th = useTheme();
  const student = useStudent();
  const sid = student.id;
  const { mode = "topic", topic } = useLocalSearchParams<{ mode?: "topic" | "daily" | "review"; topic?: string }>();
  // Predmet kot calcSubject() na spletu: iz oznake teme, sicer iz nastavitev učenca.
  const subject = (topic && /^[A-Z]+/.exec(topic)?.[0]) || student.settings?.subject || "MAT";
  const openCalc = () => router.push({ pathname: "/calculator", params: { mode: subject === "KEM" ? "pse" : "sci", subject } });

  const [example, setExample] = useState<Task | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [progress, setProgress] = useState<{ index: number; total: number } | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [checking, setChecking] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [hintTotal, setHintTotal] = useState(0);
  const [helping, setHelping] = useState(false);
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);

  const show = useCallback((next: Task | null) => {
    setTask(next);
    setAnswer("");
    setResult(null);
    setSteps([]);
    setHintTotal(next?.hintSteps ?? 0);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === "topic") {
        const out = await api<{ example?: Task; task?: Task }>(`/api/students/${sid}/practice/next`, { body: { topic_id: topic } });
        setOffline(false);
        if (out.example) {
          setExample(out.example);
          show(null);
        } else {
          setExample(null);
          show(out.task || null);
        }
      } else {
        const out = await api<any>(`/api/students/${sid}/${mode === "daily" ? "daily" : "review"}`, { body: {} });
        if (out.finished) setDone(out);
        else {
          setProgress({ index: out.index, total: out.total });
          show(out.task);
        }
      }
    } catch (err) {
      const off = mode === "topic" && topic && err instanceof ApiError && err.offline ? offlineNext(sid, topic) : null;
      if (off) {
        setOffline(true);
        setExample(null);
        show(off.task as Task);
      } else setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [mode, sid, topic, show]);

  useEffect(() => {
    load();
  }, [load]);

  const check = async () => {
    if (!task || checking) return;
    if (!answer.trim()) {
      setResult({ retry: true, message: t("chk.empty") });
      failure();
      return;
    }
    setChecking(true);
    const started = Date.now();
    try {
      let r: Result | null = null;
      if (offline) r = offlineAnswer(sid, String(task.id), answer) as Result | null;
      else
        try {
          r = await api<Result>(`/api/students/${sid}/tasks/${task.id}/answer`, { body: { answer } });
        } catch (err) {
          if (!(err instanceof ApiError)) throw err;
          setResult({ retry: true, message: err.offline ? t("task.checkError", { msg: err.message }) : t("task.checkFailed", { msg: err.message }) });
          failure();
          return;
        }
      if (!r) return;
      setResult(r);
      if (r.retry) failure();
      else if (r.correct) (r.mastered || r.next?.finished ? celebrate : success)();
      else failure();
    } finally {
      setChecking(false);
      if (!offline) saveCheckTime(Date.now() - started);
    }
  };

  const hint = async () => {
    if (!task) return;
    tap();
    const step = steps.length + 1;
    const out = offline ? offlineHint(step) : await api<{ steps: Step[]; total: number }>(`/api/students/${sid}/tasks/${task.id}/hint`, { body: { step } }).catch(() => null);
    if (out) {
      setSteps(out.steps);
      setHintTotal(out.total);
    }
  };

  const help = async (kind?: "explain" | "review") => {
    if (!task || offline) return;
    setHelping(true);
    try {
      const out = await api<{ conversation: { id: number }; text: string }>(`/api/students/${sid}/tasks/${task.id}/help`, { body: kind ? { kind } : {} });
      router.push({ pathname: "/chat/[id]", params: { id: String(out.conversation.id), send: out.text } });
    } catch (err) {
      setResult((r) => ({ ...(r || {}), retry: true, message: (err as Error).message }));
    } finally {
      setHelping(false);
    }
  };

  const advance = () => {
    const n = result?.next;
    if (n?.finished) setDone(n as Done);
    else if (n?.task) {
      setProgress({ index: n.index, total: n.total });
      show(n.task);
    } else load();
  };

  const title = mode === "daily" ? t("daily.title") : mode === "review" ? t("session.review") : task?.topicName || t("mob.practice");
  if (loading) return <Loading />;
  if (error) return <ErrorView message={t("task.loadError", { msg: error })} onRetry={load} retryLabel={t("mob.retry")} />;

  if (done) {
    return (
      <Screen>
        <Stack.Screen options={{ title }} />
        <Card style={{ alignItems: "center", paddingVertical: 28 }}>
          <Icon name={{ ios: done.empty ? "checkmark.circle" : "trophy.fill", android: done.empty ? "check_circle" : "emoji_events" }} size={48} color={done.empty ? th.ok : th.gold} />
          {done.empty ? (
            <Body center>{mode === "daily" ? t("session.dailyEmpty") : t("session.reviewEmpty")}</Body>
          ) : (
            <>
              <Title>{(mode === "daily" ? t("sessionDone.daily") : t("sessionDone.review")) + "!"}</Title>
              <Body center>
                {t("result.firstTry", { correct: done.correct, total: done.total }).replace(/<[^>]+>/g, "")}
                {done.xp ? ` · +${done.xp.gained} XP` : ""}
              </Body>
            </>
          )}
          <Button title={t("result.toPath")} onPress={() => router.back()} style={{ alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  // Rešen zgled pred prvo nalogo teme (učenje iz zgleda).
  if (example) {
    return (
      <Screen>
        <Stack.Screen options={{ title }} />
        <Card tone="accent">
          <Text style={{ color: th.accent, fontWeight: "800", fontSize: 13, letterSpacing: 0.5 }}>{t("task.example").toUpperCase()}</Text>
          <RichText text={example.text} />
          {figureHtml(example.figure, th) ? <RichText text="" html={figureHtml(example.figure, th)} /> : null}
          <RichText text={solutionMd(example, example.solution || "")} />
        </Card>
        <Button title={t("task.yourTurn")} icon={{ ios: "arrow.right", android: "arrow_forward" }} onPress={load} />
      </Screen>
    );
  }

  if (!task) return <ErrorView message={t("mob.noTasks")} onRetry={() => router.back()} retryLabel={t("result.toPath")} />;
  const closed = !!result && !result.retry && (result.correct || !!result.solution || !!result.closed);
  const fig = figureHtml(task.figure, th);

  return (
    <Screen>
      <Stack.Screen options={{ title }} />
      {offline ? <Banner text={t("mob.offlinePractice")} tone="gold" icon={{ ios: "wifi.slash", android: "wifi_off" }} /> : null}
      {progress ? (
        <View style={{ gap: 6 }}>
          {/* Naloga v seriji kot na spletu (»3 / 12«); »Korak« velja za korake lekcije, ne za naloge. */}
          <Text style={{ color: th.muted, fontWeight: "600" }}>{`${progress.index} / ${progress.total}`}</Text>
          <ProgressBar value={(progress.index - 1) / Math.max(1, progress.total)} />
        </View>
      ) : null}

      <Card>
        {task.topicName && mode !== "topic" ? <Text style={{ color: th.muted, fontSize: 13, fontWeight: "700" }}>{task.topicName}</Text> : null}
        <RichText text={task.text} />
        {fig ? <RichText text="" html={fig} /> : null}
        {task.inputHint ? <Body muted small>{task.inputHint}</Body> : null}
      </Card>

      {steps.length ? (
        <Card tone="gold">
          {steps.map((s, i) => (
            <View key={i} style={{ gap: 4 }}>
              <Text style={{ color: th.warm, fontWeight: "800" }}>{t("task.hintStep", { n: i + 1, total: hintTotal })}</Text>
              <RichText text={stepMd(s)} size={16} />
            </View>
          ))}
        </Card>
      ) : null}

      {!closed ? (
        <AnswerInput task={task} value={answer} onChange={setAnswer} onSubmit={check} inputRef={input} />
      ) : null}

      {result ? <Feedback r={result} task={task} /> : null}

      {!closed ? (
        <View style={{ gap: 10 }}>
          <Button title={checking ? t("task.checking") : t("task.check")} onPress={check} loading={checking} />
          {checking && !offline ? <CheckWait /> : null}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {steps.length < (hintTotal || 1) && hintTotal > 0 ? (
              <Button title={steps.length ? t("task.hintMore") : t("task.hintBtn")} kind="secondary" icon={{ ios: "lightbulb", android: "lightbulb" }} onPress={hint} style={{ flex: 1 }} />
            ) : null}
            {!offline ? <Button title={t("task.askTutor")} kind="ghost" icon={{ ios: "bubble.left", android: "chat_bubble_outline" }} loading={helping} onPress={() => help(result?.correct === false ? undefined : "explain")} style={{ flex: 1 }} /> : null}
            {/* Kalkulator kot na spletu (openCalcOverlay): pri kemiji periodni sistem, sicer znanstveni. Potrebuje povezavo. */}
            {!offline ? <Button title={t("nav.graph")} iconOnly kind="secondary" icon={{ ios: "plus.forwardslash.minus", android: "calculate" }} onPress={openCalc} /> : null}
          </View>
          {result?.correct === false && !offline && result.attemptsLeft ? <Body muted small center>{t("task.attemptsLeft", { n: result.attemptsLeft })}</Body> : null}
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          {result?.next?.finished ? (
            <Button title={t("mob.finish")} icon={{ ios: "trophy", android: "emoji_events" }} onPress={advance} />
          ) : (
            <Button title={mode === "topic" && !result?.correct ? t("task.similar") : t("task.next")} icon={{ ios: "arrow.right", android: "arrow_forward" }} onPress={advance} />
          )}
          {!offline ? (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button title={t("task.explain")} kind="secondary" loading={helping} onPress={() => help("explain")} style={{ flex: 1 }} />
              <Button title={t("task.reviewTutor")} kind="ghost" onPress={() => help("review")} style={{ flex: 1 }} />
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

function AnswerInput({ task, value, onChange, onSubmit, inputRef }: { task: Task; value: string; onChange: (v: string) => void; onSubmit: () => void; inputRef: React.RefObject<React.ComponentRef<typeof TextInput> | null> }) {
  const th = useTheme();
  if (task.answerType === "choice" && task.options?.length) {
    return (
      <View style={{ gap: 8 }} accessibilityRole="radiogroup">
        {task.options.map((o, i) => {
          const on = value === String(i);
          return (
            <Pressable
              key={i}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => {
                tap();
                onChange(String(i));
              }}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: radius.card, borderWidth: on ? 2 : 1, borderColor: on ? th.accent : th.border, backgroundColor: on ? th.accentSoft : th.surface }}
            >
              <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: on ? th.accent : th.surface2 }}>
                <Text style={{ color: on ? th.accentText : th.text, fontWeight: "800" }}>{String.fromCharCode(65 + i)}</Text>
              </View>
              <View style={{ flex: 1 }} pointerEvents="none">
                <RichText text={task.optionsTex ? `$${o}$` : o} size={16} />
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  }
  const placeholder = task.answerType === "coefficients" ? t("task.phCoef") : task.unit ? t("task.phUnit", { unit: task.unit }) : t("task.phResult");
  const keys = ["−", ",", "/", ...(task.unit ? [task.unit] : [])];
  const insert = (k: string) => {
    tap();
    const add = k === "−" ? "-" : k === task.unit ? ` ${k}` : k;
    onChange(value + add);
    inputRef.current?.focus();
  };
  return (
    <View style={{ gap: 8 }}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={th.muted}
        accessibilityLabel={placeholder}
        keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        style={{ minHeight: 56, borderRadius: radius.button, borderWidth: 2, borderColor: th.accent, backgroundColor: th.surface, color: th.text, paddingHorizontal: 16, fontSize: 22, fontWeight: "600" }}
      />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {keys.map((k) => (
          <Pressable key={k} onPress={() => insert(k)} accessibilityRole="button" accessibilityLabel={k} style={({ pressed }) => ({ minWidth: 48, minHeight: 44, paddingHorizontal: 12, borderRadius: radius.button, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? th.accentSoft : th.surface2 })}>
            <Text style={{ color: th.text, fontSize: 18, fontWeight: "700" }}>{k}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Feedback({ r, task }: { r: Result; task: Task }) {
  const th = useTheme();
  if (r.retry) return <Banner text={fbText(r)} icon={{ ios: "info.circle", android: "info" }} />;
  if (r.correct) {
    return (
      <View style={{ gap: 10 }}>
        <Card tone="ok" style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name={{ ios: "checkmark.circle.fill", android: "check_circle" }} color={th.ok} size={28} />
          <Text style={{ flex: 1, color: th.text, fontSize: 18, fontWeight: "800" }}>
            {t("task.correctBang")}
            <Text style={{ fontWeight: "400", fontSize: 15 }}>{r.levelUp ? t("task.harder") : ""}</Text>
          </Text>
          <Text style={{ color: th.ok, fontWeight: "800" }}>{r.offline ? t("off.xpLater") : r.xp ? `+${r.xp.gained} XP` : ""}</Text>
        </Card>
        {r.closed ? <Banner text={t("task.alreadyChecked")} /> : null}
        {r.mastered ? <Banner text={t("task.mastered")} tone="gold" icon={{ ios: "trophy.fill", android: "emoji_events" }} /> : null}
        {r.solution ? <Solution task={task} solution={r.solution} label={t("task.solution")} /> : null}
        {r.selfExplain ? <Banner text={t("mob.selfExplain")} icon={{ ios: "questionmark.circle", android: "help" }} /> : null}
      </View>
    );
  }
  return (
    <View style={{ gap: 10 }}>
      <Card tone="danger" style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name={{ ios: "xmark.circle.fill", android: "cancel" }} color={th.danger} size={26} />
        <Text style={{ flex: 1, color: th.text, fontSize: 16, lineHeight: 22 }}>{fbText(r) || t("task.wrong")}</Text>
      </Card>
      {r.closed ? <Banner text={t("task.alreadyChecked")} /> : null}
      {r.mistake ? (
        <Card tone="accent" style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name={{ ios: "magnifyingglass", android: "search" }} color={th.accent} size={18} />
          <View style={{ flex: 1 }}>
            <RichText text={r.mistake.code ? t(r.mistake.code, r.mistake.params || {}) : r.mistake.message} size={15} />
          </View>
        </Card>
      ) : null}
      {r.levelDown ? <Body muted small>{t("task.easier")}</Body> : null}
      {r.hint && !r.solution ? (
        <Card tone="gold">
          <Text style={{ color: th.warm, fontWeight: "800" }}>{t("task.hint")}</Text>
          <RichText text={r.hint} size={16} />
        </Card>
      ) : null}
      {r.solution ? <Solution task={task} solution={r.solution} label={t("task.example")} /> : null}
    </View>
  );
}

function Solution({ task, solution, label }: { task: Task; solution: string; label: string }) {
  const th = useTheme();
  return (
    <Card>
      <Text style={{ color: th.muted, fontWeight: "800", fontSize: 13, letterSpacing: 0.5 }}>{label.toUpperCase()}</Text>
      <RichText text={solutionMd(task, solution)} size={16} />
    </Card>
  );
}

// Rešitev s podatki iz besedila (Podatki / Iščemo), kot na spletu.
function solutionMd(task: Task, solution: string) {
  const given = task.data?.given?.filter(Boolean) || [];
  const find = task.data?.find?.filter(Boolean) || [];
  const data = given.length ? `**${t("task.given")}:** ${given.map((x) => `$${x}$`).join(", ")}${find.length ? `  \n**${t("task.find")}:** ${find.map((x) => `$${x} = \\,?$`).join(", ")}` : ""}\n\n` : "";
  return data + solution.split("\n").join("  \n");
}

function stepMd(s: Step) {
  if (s.kind === "data") {
    const g = (s.given || []).map((x) => `$${x}$`).join(", ");
    const f = (s.find || []).map((x) => `$${x} = \\,?$`).join(", ");
    return `${t("task.hintData")}\n\n**${t("task.given")}:** ${g}${f ? `  \n**${t("task.find")}:** ${f}` : ""}`;
  }
  if (s.kind === "formula") return `${t("task.hintFormula")}\n\n${(s.formula || []).map((x) => `$$${x}$$`).join("\n\n")}`;
  return s.text || "";
}

// Preverjanje nad 2 s: vrstica napredka z oceno preostalega časa, kot na spletu (public/check-progress.js).
const CHECK_TIMES = key("checkTimes");
const checkTimes = (): number[] => {
  try {
    return JSON.parse(Storage.getItemSync(CHECK_TIMES) || "[]");
  } catch {
    return [];
  }
};
const saveCheckTime = (ms: number) => Storage.setItemSync(CHECK_TIMES, JSON.stringify(addDuration(checkTimes(), ms)));

function CheckWait() {
  const th = useTheme();
  const [state] = useState(() => ({ start: Date.now(), expected: expectedMs(checkTimes()) }));
  const [p, setP] = useState<{ pct: number; left: number } | null>(null);
  useEffect(() => {
    const id = setInterval(() => setP(progressAt(Date.now() - state.start, state.expected)), 250);
    return () => clearInterval(id);
  }, [state]);
  if (!p) return null;
  return (
    <View style={{ gap: 8 }} accessibilityLiveRegion="polite">
      <Text style={{ color: th.muted, fontWeight: "600" }}>{`${t("task.checking")} ${p.left ? t("task.checkLeft", { n: p.left }) : t("task.checkAlmost")}`}</Text>
      <ProgressBar value={p.pct} />
    </View>
  );
}
