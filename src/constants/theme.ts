/**
 * WARM_EARTHY preset + the brief's golden / sea-teal accent overrides.
 * The `name` field is the preset value and must stay exactly 'warm-earthy'.
 */
export const theme = {
  name: 'warm-earthy',

  colors: {
    // page
    bg: '#FFFBE6',
    bgMid: '#FFF6D4',
    bgDeep: '#FFEFB3',
    // surfaces
    surface: '#FFFFFF',
    surfaceAlt: '#F2EAD8',
    surfaceSand: '#FAF5EC',
    // lines
    border: '#F0E4C4',
    borderStrong: '#E8DDC4',
    // brand
    primary: '#F4A300',
    primaryDark: '#E08F00',
    primaryLight: '#FFD266',
    primaryPale: '#FFEFB3',
    accent: '#2A9D8F',
    accentDark: '#21806F',
    accentLight: '#35B8A6',
    accentSoft: 'rgba(42,157,143,0.12)',
    accentLine: 'rgba(42,157,143,0.28)',
    // text
    text: '#33290D',
    textMid: '#8A7A45',
    textSoft: '#B6A878',
    onDark: '#FFFBE6',
    // misc
    shadowWarm: '#D9A441',
    muted: '#D8C9A8',
    idle: '#F2EAD8',
  },

  gradients: {
    page: ['#FFFBE6', '#FFF6D4', '#FFEFB3'],
    gameArea: ['#FFFBE6', '#FFF3CF'],
    primary: ['#FFB81F', '#F4A300', '#E08F00'],
    accent: ['#35B8A6', '#2A9D8F', '#21806F'],
    loader: ['rgba(51,41,13,0.90)', 'rgba(124,84,16,0.86)', 'rgba(42,157,143,0.80)'],
    result: ['rgba(255,251,230,0.93)', 'rgba(255,239,179,0.96)'],
    journal: ['rgba(255,251,230,0.95)', 'rgba(242,234,216,0.96)'],
    bar: ['#FFEFB3', '#F4A300', '#2A9D8F'],
    sun: ['#FFD266', '#F4A300'],
  },

  // four+ distinct levels on every screen
  type: {
    hero: { fontSize: 64, fontWeight: '900' as const, letterSpacing: -1 },
    clock: { fontSize: 54, fontWeight: '900' as const, letterSpacing: 1 },
    display: { fontSize: 40, fontWeight: '900' as const, letterSpacing: 6 },
    title: { fontSize: 26, fontWeight: '900' as const, letterSpacing: 2 },
    section: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 3 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.5 },
  },

  radius: { xs: 4, sm: 10, md: 14, lg: 18, xl: 24, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 },

  shadow: {
    card: {
      shadowColor: '#D9A441',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    panel: {
      shadowColor: '#D9A441',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
      elevation: 6,
    },
    cta: {
      shadowColor: '#F4A300',
      shadowOpacity: 0.34,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    ctaTeal: {
      shadowColor: '#2A9D8F',
      shadowOpacity: 0.32,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
  },
};

export type Theme = typeof theme;
export default theme;
