import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Elapsed seconds live in a ref (callback-safe, rule #8); state mirrors it once
 * per second purely for display.
 */
export function useTimer(autoStart: boolean) {
  const elapsedRef = useRef(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [paused, setPaused] = useState(!autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (paused) {
      clear();
      return;
    }
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsedSec(elapsedRef.current);
    }, 1000);
    return clear;
  }, [paused, clear]);

  // cleanup on unmount
  useEffect(() => clear, [clear]);

  const toggle = useCallback(() => {
    setPaused(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    elapsedRef.current = 0;
    setElapsedSec(0);
    setPaused(false);
  }, []);

  const read = useCallback(() => elapsedRef.current, []);

  return { elapsedSec, paused, toggle, reset, read };
}
