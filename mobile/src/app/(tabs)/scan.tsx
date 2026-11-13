// Skeniraj nalogo: kamera z okvirjem, svetilka, galerija. Fotografija gre inštruktorju v nov pogovor,
// ki nalogo prebere in jo z učencem reši po korakih.
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useIsFocused } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "@/lib/api";
import { useStudent } from "@/lib/session";
import { t } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { celebrate, tap } from "@/lib/haptics";
import { pickPhoto, preparePhoto, setPendingPhoto, type Photo } from "@/lib/images";
import { Body, Button, Icon, Title } from "@/components/ui";

export default function Scan() {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const student = useStudent();
  const [perm, requestPerm] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [busy, setBusy] = useState(false);
  const cam = useRef<CameraView>(null);

  const ask = async (photo: Photo | null) => {
    if (!photo) return;
    const conv = await api<{ id: number }>(`/api/students/${student.id}/conversations`, { body: {} });
    setPendingPhoto(photo);
    router.push({ pathname: "/chat/[id]", params: { id: String(conv.id), send: t("mob.scanAsk") } });
  };
  const run = async (fn: () => Promise<Photo | null>) => {
    if (busy) return;
    setBusy(true);
    try {
      await ask(await fn());
    } catch (err) {
      Alert.alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const shoot = () =>
    run(async () => {
      celebrate();
      const pic = await cam.current?.takePictureAsync({ quality: 0.9, skipProcessing: false });
      return pic ? preparePhoto(pic.uri, pic.width) : null;
    });

  if (!perm) return <View style={{ flex: 1, backgroundColor: th.bg }} />;
  if (!perm.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: th.bg, padding: 24, paddingTop: insets.top + 24, justifyContent: "center", gap: 16 }}>
        <Icon name={{ ios: "camera.viewfinder", android: "document_scanner" }} size={56} color={th.accent} />
        <Title>{t("mob.scanTitle")}</Title>
        <Body>{t("mob.scanPermission")}</Body>
        <Button title={perm.canAskAgain ? t("mob.allowCamera") : t("mob.openSettings")} onPress={() => (perm.canAskAgain ? requestPerm() : Linking.openSettings())} />
        <Button title={t("mob.fromLibrary")} kind="secondary" icon={{ ios: "photo.on.rectangle", android: "photo_library" }} loading={busy} onPress={() => run(() => pickPhoto("library"))} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {focused ? <CameraView ref={cam} style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} autofocus="on" /> : null}
      <View style={{ position: "absolute", top: insets.top + 12, left: 16, right: 16, alignItems: "center", gap: 6 }}>
        <Text style={styles.hint}>{t("mob.scanHint")}</Text>
      </View>
      {/* Okvir, v katerega učenec postavi nalogo. */}
      <View pointerEvents="none" style={{ position: "absolute", top: "22%", bottom: "30%", left: "8%", right: "8%" }}>
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <View key={c} style={[styles.corner, c[0] === "t" ? { top: 0, borderTopWidth: 4 } : { bottom: 0, borderBottomWidth: 4 }, c[1] === "l" ? { left: 0, borderLeftWidth: 4 } : { right: 0, borderRightWidth: 4 }]} />
        ))}
      </View>
      <View style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + 96, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
        <Pressable onPress={() => run(() => pickPhoto("library"))} accessibilityRole="button" accessibilityLabel={t("mob.fromLibrary")} style={styles.round}>
          <Icon name={{ ios: "photo.on.rectangle", android: "photo_library" }} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={shoot} disabled={busy} accessibilityRole="button" accessibilityLabel={t("chat.photo")} style={styles.shutter}>
          {busy ? <ActivityIndicator color="#000" /> : <View style={styles.shutterInner} />}
        </Pressable>
        <Pressable
          onPress={() => {
            tap();
            setTorch((v) => !v);
          }}
          accessibilityRole="switch"
          accessibilityState={{ checked: torch }}
          accessibilityLabel={t("mob.torch")}
          style={styles.round}
        >
          <Icon name={{ ios: torch ? "flashlight.on.fill" : "flashlight.off.fill", android: torch ? "flashlight_on" : "flashlight_off" }} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", textAlign: "center", backgroundColor: "rgba(0,0,0,0.45)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, overflow: "hidden" },
  corner: { position: "absolute", width: 36, height: 36, borderColor: "#FFFFFF", borderRadius: 4 },
  round: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  shutter: { width: 78, height: 78, borderRadius: 39, borderWidth: 4, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  shutterInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: "#FFFFFF" },
});
