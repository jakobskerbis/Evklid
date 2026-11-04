// Okno »Prijavi napako« (kot na spletu, public/prijave.js): razlogi, opomba, Pošlji / Prekliči.
// Lekcija: razlogi + neobvezna opomba. Skrbnik v klepetu: samo opis napake (obvezen).
import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";
import { t } from "@/lib/i18n";
import { radius, useTheme } from "@/lib/theme";
import { Button, Chip } from "@/components/ui";

type Props = {
  visible: boolean;
  ask: string;
  reasons?: [string, string][];
  notePh: string;
  needNote?: boolean;
  onSend: (r: { reason: string | null; note: string }) => Promise<void>;
  onClose: () => void;
};

export function ReportSheet({ visible, ask, reasons = [], notePh, needNote, onSend, onClose }: Props) {
  const th = useTheme();
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const close = () => {
    setReason(null);
    setNote("");
    setErr(null);
    onClose();
  };
  const send = async () => {
    if (reasons.length && !reason) return setErr(t("rep.pick"));
    if (needNote && !note.trim()) return setErr(t("bug.needNote"));
    setBusy(true);
    try {
      await onSend({ reason, note: note.trim() });
      close();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t("rep.cancel")} onPress={close} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.35)" }} />
        <View style={{ backgroundColor: th.surface, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, padding: 18, paddingBottom: 30, gap: 12 }}>
          <Text style={{ color: th.text, fontSize: 18, fontWeight: "700" }}>{ask}</Text>
          {reasons.length ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {reasons.map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  active={reason === key}
                  onPress={() => {
                    setReason(key);
                    setErr(null);
                  }}
                />
              ))}
            </View>
          ) : null}
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={notePh}
            placeholderTextColor={th.muted}
            accessibilityLabel={notePh}
            multiline
            maxLength={needNote ? 2000 : 500}
            style={{ minHeight: 80, color: th.text, borderWidth: 1, borderColor: th.border, borderRadius: 12, padding: 10, textAlignVertical: "top", fontSize: 16 }}
          />
          {err ? (
            <Text accessibilityRole="alert" style={{ color: th.text, borderLeftWidth: 3, borderColor: th.danger, paddingLeft: 8 }}>
              {err}
            </Text>
          ) : null}
          <Button title={t("rep.send")} loading={busy} onPress={send} />
          <Button title={t("rep.cancel")} kind="ghost" onPress={close} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
