// Gradniki zaslonov (po docs/oblikovanje.md: kartice, gumbi, seznami, opozorila), z barvami iz useTheme().
import React from "react";
import { ActivityIndicator, Keyboard, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle, type StyleProp, type ScrollViewProps } from "react-native";
import { SymbolView, type AndroidSymbol } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SFSymbol } from "sf-symbols-typescript";
import { font, radius, useTheme } from "@/lib/theme";
import { tap } from "@/lib/haptics";

export type IconName = { ios: SFSymbol; android: AndroidSymbol };

// Puščice »naprej« se v jezikih od desne proti levi (arabščina, perzijščina, urdujščina) obrnejo.
const DIRECTIONAL = new Set(["chevron.right", "arrow.right"]);

export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color?: string }) {
  const th = useTheme();
  const flip = I18nManager.isRTL && DIRECTIONAL.has(name.ios as string);
  return <SymbolView name={name} size={size} tintColor={color || th.text} style={flip ? { transform: [{ scaleX: -1 }] } : undefined} />;
}

// Višina tipkovnice na Androidu (prikaz od roba do roba: okno se ob tipkovnici ne pomanjša samo).
export function useAndroidKeyboard() {
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    if (Platform.OS !== "android") return;
    const show = Keyboard.addListener("keyboardDidShow", (e) => setHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener("keyboardDidHide", () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return height;
}

export function Screen({ children, refreshControl, style, contentContainerStyle, ...rest }: ScrollViewProps & { children: React.ReactNode }) {
  const th = useTheme();
  const keyboard = useAndroidKeyboard();
  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: th.bg }, style]}
      contentContainerStyle={[{ padding: 16, paddingBottom: 48 + keyboard, gap: 12 }, contentContainerStyle]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      refreshControl={refreshControl}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

// Zaslon zavihka: velik naslov na vrhu (zavihki nimajo naslovne vrstice).
export function TabScreen({ title, right, children, ...rest }: ScrollViewProps & { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Screen {...rest} contentContainerStyle={{ paddingTop: Platform.OS === "android" ? insets.top + 12 : 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ color: th.text, fontSize: 32, ...font(700), flexShrink: 1 }} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        {right}
      </View>
      {children}
    </Screen>
  );
}

export function Card({ children, style, tone }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: "accent" | "ok" | "danger" | "gold" }) {
  const th = useTheme();
  const bg = tone === "accent" ? th.accentSoft : tone === "ok" ? th.okSoft : tone === "danger" ? th.dangerSoft : tone === "gold" ? th.goldSoft : th.surface;
  return <View style={[{ backgroundColor: bg, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, borderColor: th.border, padding: 16, gap: 10 }, style]}>{children}</View>;
}

export function Title({ children, size = 22 }: { children: React.ReactNode; size?: number }) {
  const th = useTheme();
  return <Text style={{ color: th.text, fontSize: size, ...font(700) }} accessibilityRole="header">{children}</Text>;
}

export function Body({ children, muted, small, style, center }: { children: React.ReactNode; muted?: boolean; small?: boolean; center?: boolean; style?: object }) {
  const th = useTheme();
  return <Text style={[{ color: muted ? th.muted : th.text, ...font(), fontSize: small ? 14 : 16, lineHeight: small ? 20 : 23, textAlign: center ? "center" : undefined }, style]}>{children}</Text>;
}

// iconOnly: samo ikona (npr. kalkulator ob Namigu), title je napis za bralnik zaslona.
type ButtonProps = { title: string; onPress?: () => void; kind?: "primary" | "secondary" | "ghost" | "danger"; icon?: IconName; loading?: boolean; disabled?: boolean; iconOnly?: boolean; style?: StyleProp<ViewStyle> };
export function Button({ title, onPress, kind = "primary", icon, loading, disabled, iconOnly, style }: ButtonProps) {
  const th = useTheme();
  const bg = kind === "primary" ? th.accent : kind === "danger" ? th.danger : "transparent";
  const fg = kind === "primary" ? th.accentText : kind === "danger" ? th.dangerText : th.accent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={iconOnly ? title : undefined}
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      disabled={disabled || loading}
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          minHeight: 50,
          borderRadius: radius.button,
          backgroundColor: bg,
          borderWidth: kind === "secondary" ? 1.5 : 0,
          borderColor: th.accent,
          paddingHorizontal: iconOnly ? 14 : 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Icon name={icon} size={iconOnly ? 22 : 18} color={fg} /> : null}
      {iconOnly ? null : <Text style={{ color: fg, fontSize: 17, ...font(700) }}>{title}</Text>}
    </Pressable>
  );
}

export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string | null }) {
  const th = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: th.muted, fontSize: 14, ...font(600) }}>{label}</Text>
      <TextInput
        placeholderTextColor={th.muted}
        style={{ minHeight: 50, borderRadius: radius.button, borderWidth: 1.5, borderColor: error ? th.danger : th.border, backgroundColor: th.surface, color: th.text, paddingHorizontal: 14, fontSize: 17, ...font() }}
        accessibilityLabel={label}
        {...props}
      />
      {error ? <Text style={{ color: th.danger, fontSize: 14, ...font() }}>{error}</Text> : null}
    </View>
  );
}

export function Row({ title, subtitle, icon, onPress, right, danger }: { title: string; subtitle?: string; icon?: IconName; onPress?: () => void; right?: React.ReactNode; danger?: boolean }) {
  const th = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, opacity: pressed ? 0.6 : 1 })}
    >
      {icon ? (
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: danger ? th.dangerSoft : th.accentSoft, alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={18} color={danger ? th.danger : th.accent} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={{ color: danger ? th.danger : th.text, fontSize: 16, ...font(600) }}>{title}</Text>
        {subtitle ? <Text style={{ color: th.muted, fontSize: 14, marginTop: 2, ...font() }}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <Icon name={{ ios: "chevron.right", android: "chevron_right" }} size={14} color={th.muted} /> : null)}
    </Pressable>
  );
}

export function Banner({ text, tone = "accent", icon }: { text: string; tone?: "accent" | "danger" | "gold" | "ok"; icon?: IconName }) {
  const th = useTheme();
  const fg = tone === "danger" ? th.danger : tone === "gold" ? th.gold : tone === "ok" ? th.ok : th.accent;
  return (
    <Card tone={tone} style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
      {icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <Text style={{ color: th.text, flex: 1, fontSize: 15, lineHeight: 21, ...font() }}>{text}</Text>
    </Card>
  );
}

export function ProgressBar({ value, color, height = 8 }: { value: number; color?: string; height?: number }) {
  const th = useTheme();
  return (
    <View style={{ height, borderRadius: height, backgroundColor: th.surface2, overflow: "hidden" }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height, backgroundColor: color || th.accent, borderRadius: height }} />
    </View>
  );
}

export function Loading() {
  const th = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: th.bg, padding: 32 }}>
      <ActivityIndicator size="large" color={th.accent} />
    </View>
  );
}

export function ErrorView({ message, onRetry, retryLabel }: { message: string; onRetry?: () => void; retryLabel: string }) {
  const th = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: th.bg, padding: 32, gap: 16 }}>
      <Icon name={{ ios: "wifi.exclamationmark", android: "wifi_off" }} size={40} color={th.muted} />
      <Body center muted>{message}</Body>
      {onRetry ? <Button title={retryLabel} onPress={onRetry} kind="secondary" /> : null}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const th = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: active ? th.accent : th.surface, borderWidth: 1, borderColor: active ? th.accent : th.border }}
    >
      <Text style={{ color: active ? th.accentText : th.text, ...font(600) }}>{label}</Text>
    </Pressable>
  );
}

// Preklopnik (spletni .seg, docs/oblikovanje.md): 2–4 možnosti, izbrana je bela s poudarkom na sivo-modri podlagi.
export function Seg<T extends string>({ items, value, onChange, label }: { items: { key: T; label: string; icon?: IconName }[]; value: T; onChange: (key: T) => void; label?: string }) {
  const th = useTheme();
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} style={{ flexDirection: "row", backgroundColor: th.surface2, borderRadius: radius.pill, padding: 4, gap: 2 }}>
      {items.map((it) => {
        const on = it.key === value;
        return (
          <Pressable
            key={it.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              if (on) return;
              tap();
              onChange(it.key);
            }}
            style={{ flex: 1, minHeight: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 8, borderRadius: radius.pill, backgroundColor: on ? th.surface : "transparent" }}
          >
            {it.icon ? <Icon name={it.icon} size={16} color={on ? th.accent : th.muted} /> : null}
            <Text numberOfLines={1} style={{ color: on ? th.accent : th.muted, ...font(700), fontSize: 14, flexShrink: 1 }}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
