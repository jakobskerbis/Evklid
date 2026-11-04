// 3D atlas človeškega telesa in 3D modeli čez cel zaslon (Jaz → 3D svet): stran /3d v WebView (src/components/Web3D.tsx).
// Parameter »model« odpre en model, sicer atlas. Zbirka vseh modelov je v zavihku Uči se → 3D svet.
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Web3D } from "@/components/Web3D";

export default function Atlas() {
  const params = useLocalSearchParams<{ model?: string }>();
  const hash = /^[a-z0-9-]{2,60}$/.test(params.model || "") ? params.model : "atlas";
  return <Web3D hash={hash} />;
}
