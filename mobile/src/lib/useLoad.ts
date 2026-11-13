// Nalaganje podatkov zaslona: stanje nalaganja, napaka, osvežitev s potegom navzdol.
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = [], { refocus = false } = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const loadRef = useRef(load);
  loadRef.current = load;

  const run = useCallback(async (pull = false) => {
    if (pull) setRefreshing(true);
    try {
      setData(await loadRef.current());
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void run(), deps);
  useFocusEffect(
    useCallback(() => {
      if (refocus) run();
    }, [refocus, run]),
  );
  return { data, error, loading, refreshing, reload: () => run(), pull: () => run(true), setData };
}
