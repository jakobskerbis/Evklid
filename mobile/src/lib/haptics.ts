// Tresljaji: rahel dotik gumba, uspeh ob pravilnem odgovoru, opozorilo ob napačnem.
// Uporabnik jih izklopi v zavihku Jaz (shranjeno na napravi).
import * as Haptics from "expo-haptics";
import Storage from "expo-sqlite/kv-store";
import { key } from "./keys";

const KEY = key("haptics");
let on = Storage.getItemSync(KEY) !== "0";

export const hapticsOn = () => on;
export function setHaptics(v: boolean) {
  on = v;
  Storage.setItemSync(KEY, v ? "1" : "0");
}

export const tap = () => on && Haptics.selectionAsync().catch(() => {});
export const success = () => on && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
export const failure = () => on && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
export const celebrate = () => on && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
