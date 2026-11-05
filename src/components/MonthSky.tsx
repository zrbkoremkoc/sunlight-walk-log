import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { BOARD_FRAME, BOARD_W, CELL, CELL_STAGGER_MS, Walk } from '../constants/config';
import theme from '../constants/theme';
import { heatColor, monthCells } from '../game/walkLog';
import { monthLabel, todayISO } from '../utils/format';

interface Props {
  walks: Walk[];
  weekStartsMon: boolean;
}

const GAP = 4;
const INNER = CELL - GAP;

const LEGEND = [
  { color: '#FFF6D4', label: 'NONE' },
  { color: '#FFE08A', label: '1-29' },
  { color: '#F4A300', label: '30-89' },
  { color: '#D98300', label: '90+' },
];

/**
 * Month Sky — one square per day, warmer the longer you were outside.
 * Cells fade in on a 12ms stagger (opacity only, native driver).
 */
function MonthSky({ walks, weekStartsMon }: Props) {
  const today = todayISO();
  const cells = useMemo(
    () => monthCells(walks, today, weekStartsMon),
    [walks, today, weekStartsMon],
  );

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 220 + cells.length * CELL_STAGGER_MS,
      useNativeDriver: true,
    }).start();
  }, [anim, cells.length]);

  const letters = weekStartsMon
    ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={styles.wrap}>
      <View style={styles.headRow}>
        <Text style={styles.month}>{monthLabel(today)}</Text>
        <Text style={styles.hint}>WARMER = LONGER OUTSIDE</Text>
      </View>

      <View style={styles.board}>
        <View style={styles.letterRow}>
          {letters.map((l, i) => (
            <View key={`l${i}`} style={styles.letterCell}>
              <Text style={styles.letter}>{l}</Text>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((c, i) => {
            if (c.blank) {
              return <View key={c.iso} style={styles.cellSlot} />;
            }
            const start = Math.min(0.85, (i * CELL_STAGGER_MS) / 900);
            const opacity = anim.interpolate({
              inputRange: [start, Math.min(1, start + 0.15)],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            });
            return (
              <View key={c.iso} style={styles.cellSlot}>
                <Animated.View
                  style={[
                    styles.cell,
                    {
                      opacity,
                      backgroundColor: heatColor(c.minutes),
                      borderColor: c.isToday ? theme.colors.accent : 'transparent',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.day,
                      c.minutes >= 30 ? styles.dayOnWarm : null,
                    ]}>
                    {c.day}
                  </Text>
                  {c.drizzle ? <View style={styles.drizzle} /> : null}
                </Animated.View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.legend}>
        {LEGEND.map(l => (
          <View key={l.label} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: l.color }]} />
            <Text style={styles.legendText}>{l.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  headRow: {
    width: BOARD_W,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  month: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  hint: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textSoft,
  },
  board: {
    width: BOARD_W,
    padding: BOARD_FRAME - 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.shadowWarm,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  letterRow: { flexDirection: 'row', marginBottom: 4 },
  letterCell: { width: CELL, alignItems: 'center' },
  letter: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.textSoft,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellSlot: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center' },
  cell: {
    width: INNER,
    height: INNER,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMid,
    fontVariant: ['tabular-nums'],
  },
  dayOnWarm: { color: '#FFFBE6', fontWeight: '900' },
  drizzle: {
    position: 'absolute',
    bottom: 4,
    width: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
  },
  legend: {
    width: BOARD_W,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.textMid,
  },
});

export default React.memo(MonthSky);
