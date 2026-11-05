import {
  MAX_RAYS,
  MINUTES_PER_RAY,
  RAY_FULL_MINUTES,
  SkyId,
  Walk,
} from '../constants/config';
import { addDaysISO, daysBetween, fromISO, toISO, todayISO } from '../utils/format';

export interface DayStat {
  iso: string;
  letter: string;
  minutes: number;
  isToday: boolean;
  isFuture: boolean;
}

export interface MonthCell {
  iso: string;
  day: number;
  minutes: number;
  drizzle: boolean;
  isToday: boolean;
  blank: boolean;
}

export interface RouteTotal {
  name: string;
  minutes: number;
  walks: number;
}

const MON_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const SUN_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Monday-first (or Sunday-first) start of the week containing `iso`. */
export function startOfWeekISO(iso: string, weekStartsMon: boolean): string {
  const d = fromISO(iso);
  const dow = d.getDay(); // 0 = Sunday
  const back = weekStartsMon ? (dow + 6) % 7 : dow;
  return addDaysISO(iso, -back);
}

export function minutesByDay(walks: Walk[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (let i = 0; i < walks.length; i++) {
    const w = walks[i];
    map[w.dateISO] = (map[w.dateISO] || 0) + w.minutes;
  }
  return map;
}

export function skyByDay(walks: Walk[]): Record<string, SkyId> {
  const map: Record<string, SkyId> = {};
  for (let i = 0; i < walks.length; i++) {
    map[walks[i].dateISO] = walks[i].sky;
  }
  return map;
}

export function weekStats(walks: Walk[], weekStartsMon: boolean): DayStat[] {
  const today = todayISO();
  const start = startOfWeekISO(today, weekStartsMon);
  const byDay = minutesByDay(walks);
  const letters = weekStartsMon ? MON_LETTERS : SUN_LETTERS;
  const out: DayStat[] = [];
  for (let i = 0; i < 7; i++) {
    const iso = addDaysISO(start, i);
    out.push({
      iso,
      letter: letters[i],
      minutes: byDay[iso] || 0,
      isToday: iso === today,
      isFuture: daysBetween(today, iso) > 0,
    });
  }
  return out;
}

export function sumMinutes(days: DayStat[]): number {
  let total = 0;
  for (let i = 0; i < days.length; i++) {
    total += days[i].minutes;
  }
  return total;
}

export function minutesOn(walks: Walk[], iso: string): number {
  return minutesByDay(walks)[iso] || 0;
}

/** Consecutive days with minutes > 0, counted back from today (or yesterday). */
export function streakDays(walks: Walk[]): number {
  const byDay = minutesByDay(walks);
  const today = todayISO();
  let cursor = (byDay[today] || 0) > 0 ? today : addDaysISO(today, -1);
  let streak = 0;
  while ((byDay[cursor] || 0) > 0 && streak < 400) {
    streak += 1;
    cursor = addDaysISO(cursor, -1);
  }
  return streak;
}

/** Longest single walk ever logged, in minutes. */
export function bestWalk(walks: Walk[]): number {
  let best = 0;
  for (let i = 0; i < walks.length; i++) {
    if (walks[i].minutes > best) {
      best = walks[i].minutes;
    }
  }
  return best;
}

export function routeTotals(walks: Walk[], routes: string[]): RouteTotal[] {
  const totals: Record<string, RouteTotal> = {};
  for (let i = 0; i < routes.length; i++) {
    totals[routes[i]] = { name: routes[i], minutes: 0, walks: 0 };
  }
  for (let i = 0; i < walks.length; i++) {
    const w = walks[i];
    if (!w.route) {
      continue;
    }
    if (!totals[w.route]) {
      totals[w.route] = { name: w.route, minutes: 0, walks: 0 };
    }
    totals[w.route].minutes += w.minutes;
    totals[w.route].walks += 1;
  }
  return Object.keys(totals)
    .map(k => totals[k])
    .sort((a, b) => b.minutes - a.minutes);
}

/** Calendar cells for the month containing `anchorISO`, padded to whole weeks. */
export function monthCells(walks: Walk[], anchorISO: string, weekStartsMon: boolean): MonthCell[] {
  const anchor = fromISO(anchorISO);
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dow = first.getDay();
  const lead = weekStartsMon ? (dow + 6) % 7 : dow;

  const byDay = minutesByDay(walks);
  const skies = skyByDay(walks);
  const today = todayISO();
  const cells: MonthCell[] = [];

  for (let i = 0; i < lead; i++) {
    cells.push({ iso: `blank-${i}`, day: 0, minutes: 0, drizzle: false, isToday: false, blank: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toISO(new Date(year, month, d));
    cells.push({
      iso,
      day: d,
      minutes: byDay[iso] || 0,
      drizzle: skies[iso] === 'drizzle',
      isToday: iso === today,
      blank: false,
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({
      iso: `tail-${cells.length}`,
      day: 0,
      minutes: 0,
      drizzle: false,
      isToday: false,
      blank: true,
    });
  }
  return cells;
}

/* ----------------------------------------------------------------- ray maths */

export function raysFor(minutes: number): number {
  const n = Math.round(minutes / MINUTES_PER_RAY);
  if (n < 0) {
    return 0;
  }
  return n > MAX_RAYS ? MAX_RAYS : n;
}

export function rayLength(minutes: number): number {
  const len = 4 + (minutes / RAY_FULL_MINUTES) * 9;
  return len > 13 ? 13 : len;
}

/** 0 -> pale, 90+ -> deep gold. Used by the Month Sky grid. */
export function heatColor(minutes: number): string {
  if (minutes <= 0) {
    return '#FFF6D4';
  }
  if (minutes < 30) {
    return '#FFE08A';
  }
  if (minutes < 90) {
    return '#F4A300';
  }
  return '#D98300';
}

export function makeId(): string {
  return `w-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
