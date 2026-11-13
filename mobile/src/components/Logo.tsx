// Znak aplikacije (ikona iz assets/icon.png, ista kot na začetnem zaslonu telefona).
import React from "react";
import { Image } from "react-native";

export function Logo({ size = 48 }: { size?: number }) {
  return <Image source={require("../../assets/icon.png")} style={{ width: size, height: size, borderRadius: size * 0.22 }} accessibilityIgnoresInvertColors accessible={false} />;
}
