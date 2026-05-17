import { useState, useCallback } from 'react';
import type { TweakValues } from '@/types';

const STORAGE_KEY = 'bh-tweaks';

function loadFromStorage(defaults: TweakValues): TweakValues {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {
    // storage unavailable
  }
  return defaults;
}

export function useTweaks(defaults: TweakValues) {
  const [values, setValues] = useState<TweakValues>(() => loadFromStorage(defaults));

  const setTweak = useCallback(<K extends keyof TweakValues>(key: K, value: TweakValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return [values, setTweak] as const;
}
