import { useCallback, useMemo, useState } from 'react';
import { SEED_ROUTES, SEED_WALKS, Walk } from '../constants/config';
import {
  bestWalk,
  makeId,
  minutesOn,
  routeTotals,
  streakDays,
  sumMinutes,
  weekStats,
} from '../game/walkLog';
import { todayISO } from '../utils/format';

export interface WalkDraft {
  minutes: number;
  sky: Walk['sky'];
  route: string;
  note: string;
}

export function useWalkLog() {
  const [walks, setWalks] = useState<Walk[]>(SEED_WALKS);
  const [routes, setRoutes] = useState<string[]>(SEED_ROUTES);
  const [weekStartsMon, setWeekStartsMon] = useState(true);

  const week = useMemo(() => weekStats(walks, weekStartsMon), [walks, weekStartsMon]);
  const weekMinutes = useMemo(() => sumMinutes(week), [week]);
  const todayMinutes = useMemo(() => minutesOn(walks, todayISO()), [walks]);
  const streak = useMemo(() => streakDays(walks), [walks]);
  const best = useMemo(() => bestWalk(walks), [walks]);
  const totalsByRoute = useMemo(() => routeTotals(walks, routes), [walks, routes]);
  const notes = useMemo(
    () => walks.filter(w => w.note.length > 0).sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)),
    [walks],
  );
  const history = useMemo(
    () => walks.slice().sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)),
    [walks],
  );

  const addWalk = useCallback((draft: WalkDraft) => {
    const entry: Walk = {
      id: makeId(),
      dateISO: todayISO(),
      minutes: draft.minutes,
      sky: draft.sky,
      route: draft.route,
      note: draft.note,
    };
    setWalks(prev => [...prev, entry]);
    return entry;
  }, []);

  const addRoute = useCallback((name: string) => {
    const clean = name.trim();
    if (clean.length === 0) {
      return;
    }
    setRoutes(prev => (prev.indexOf(clean) >= 0 ? prev : [...prev, clean]));
  }, []);

  const toggleWeekStart = useCallback(() => {
    setWeekStartsMon(prev => !prev);
  }, []);

  return {
    walks,
    routes,
    week,
    weekMinutes,
    todayMinutes,
    streak,
    best,
    totalsByRoute,
    notes,
    history,
    weekStartsMon,
    addWalk,
    addRoute,
    toggleWeekStart,
  };
}

export type WalkLog = ReturnType<typeof useWalkLog>;
