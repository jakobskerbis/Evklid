// Pomen črk za nalogo ali pogovor o temi: predmet teme in oznake njene lekcije (/api/topic: subject, symbols).
// Brez povezave ostane predmet iz oznake teme (FIZ-OS-9 → FIZ), brez oznak lekcije.
import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type { Fx } from "./formula-ctx";

const cache = new Map<string, { subject?: string; symbols?: unknown[] | null }>();

export function useTopicFx(topicId?: string | null, fallbackSubject?: string | null): Fx {
  const [info, setInfo] = useState(() => (topicId ? cache.get(topicId) : undefined));
  useEffect(() => {
    if (!topicId) return setInfo(undefined);
    if (cache.has(topicId)) return setInfo(cache.get(topicId));
    let live = true;
    setInfo(undefined);
    api<{ subject?: string; symbols?: unknown[] | null }>(`/api/topic?id=${encodeURIComponent(topicId)}`)
      .then((tp) => {
        const v = { subject: tp?.subject, symbols: tp?.symbols || null };
        cache.set(topicId, v);
        if (live) setInfo(v);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [topicId]);
  return useMemo<Fx>(() => {
    const idSubject = topicId && !/^UNI-/.test(topicId) ? /^[A-Z]+/.exec(topicId)?.[0] : null;
    const subject = info?.subject || idSubject || fallbackSubject || null;
    return subject ? { subject, symbols: info?.symbols || null } : null;
  }, [info, topicId, fallbackSubject]);
}
