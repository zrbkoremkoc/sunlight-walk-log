/** Date + number formatting helpers. No locale APIs — Android fallback safe. */

const DAY_MS = 86400000;

export const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/** Local-date ISO key (YYYY-MM-DD) — never UTC, so "today" matches the device. */
export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(s => parseInt(s, 10));
  return new Date(y, m - 1, d);
}

export function todayISO(): string {
  return toISO(new Date());
}

export function addDaysISO(iso: string, delta: number): string {
  return toISO(new Date(fromISO(iso).getTime() + delta * DAY_MS));
}

export function daysBetween(aISO: string, bISO: string): number {
  return Math.round((fromISO(bISO).getTime() - fromISO(aISO).getTime()) / DAY_MS);
}

/** 47 -> "47 MIN", 192 -> "3 H 12 MIN" */
export function formatMinutes(min: number): string {
  if (min < 60) {
    return `${min} MIN`;
  }
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} H` : `${h} H ${m} MIN`;
}

/** 125 -> "02:05" */
export function formatClock(totalSec: number): string {
  const safe = totalSec < 0 ? 0 : totalSec;
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/** "2026-11-05" -> "THU 05 NOV" */
export function formatDate(iso: string): string {
  const d = fromISO(iso);
  return `${DAY_NAMES[d.getDay()]} ${pad2(d.getDate())} ${MONTHS[d.getMonth()]}`;
}

export function monthLabel(iso: string): string {
  const d = fromISO(iso);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export { MONTHS, DAY_NAMES };
