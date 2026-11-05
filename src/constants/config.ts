import { Dimensions } from 'react-native';
import { addDaysISO, todayISO } from '../utils/format';

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/* ------------------------------------------------------------------ timings */
/** EXACTLY 8000 — shorter races the screenshot gate (pipeline rule #13). */
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_MS = 320;
export const SCREEN_SLIDE_MS = 240;
export const BURST_MS = 450;
export const RAY_STAGGER_MS = 40;
export const SUN_SPIN_MS = 24000;
export const TOAST_MS = 1400;
export const CELL_STAGGER_MS = 12;

export const PRESS_SPRING = { tension: 300, friction: 12 } as const;
export const ENTRY_SPRING = { tension: 50, friction: 7 } as const;

/** Warm double haptic fired on stop + save. Needs android.permission.VIBRATE. */
export const HAPTIC_PATTERN: number[] = [0, 35, 70, 35];

/* ------------------------------------------------------------------ geometry */
export const HEADER_PAD_TOP = 44;
export const HEADER_H = 72;
export const CTA_H = 60;
export const SECONDARY_H = 48;
export const ICON_BTN = 48;
export const ICON_SIZE = 24;

/** Calendar board — parent padding + border are part of the frame (rule #4/#5). */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 8;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
export const CELL = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / 7);
export const BOARD_W = CELL * 7 + 2 * BOARD_FRAME;

/* ------------------------------------------------------------------ domain */
export type SkyId = 'clear' | 'partly' | 'cloudy' | 'drizzle' | 'golden';

export interface SkyOption {
  id: SkyId;
  label: string;
  spriteIndex: number; // 0..4 -> sprite_1..sprite_5
}

export const SKY_OPTIONS: SkyOption[] = [
  { id: 'clear', label: 'CLEAR', spriteIndex: 0 },
  { id: 'partly', label: 'PARTLY', spriteIndex: 1 },
  { id: 'cloudy', label: 'CLOUDY', spriteIndex: 2 },
  { id: 'drizzle', label: 'DRIZZLE', spriteIndex: 3 },
  { id: 'golden', label: 'GOLDEN', spriteIndex: 4 },
];

export interface Walk {
  id: string;
  dateISO: string;
  minutes: number;
  sky: SkyId;
  route: string;
  note: string;
}

export const SEED_ROUTES: string[] = ['Park Loop', 'River Path', 'Morning Block'];

/** Minute maths for the sun glyphs. */
export const MAX_RAYS = 8;
export const MINUTES_PER_RAY = 8;
export const RAY_FULL_MINUTES = 90;
export const MINUTE_STEP = 5;
export const MIN_MINUTES = 1;
export const MAX_MINUTES = 600;
export const NOTE_MAX = 90;

/** Four walks already on the board so the Sun Row is never empty on launch. */
function seedWalks(): Walk[] {
  const t = todayISO();
  const raw: Array<[number, number, SkyId, string, string]> = [
    [-1, 22, 'clear', 'Park Loop', 'Low sun through the birches'],
    [-2, 35, 'partly', 'River Path', 'Two herons on the far bank'],
    [-4, 48, 'golden', 'Morning Block', 'Whole street went amber at once'],
    [-6, 27, 'cloudy', 'Park Loop', 'Soft grey, smelled of rain'],
    [-9, 64, 'clear', 'River Path', 'Longest one this month so far'],
    [-12, 18, 'drizzle', 'Morning Block', 'Light drizzle, kept walking'],
    [-15, 41, 'partly', 'Park Loop', 'Wind off the water'],
    [-19, 33, 'golden', 'River Path', 'Stayed out for the last light'],
  ];
  return raw.map(([off, minutes, sky, route, note], i) => ({
    id: `seed-${i}`,
    dateISO: addDaysISO(t, off),
    minutes,
    sky,
    route,
    note,
  }));
}

export const SEED_WALKS: Walk[] = seedWalks();
