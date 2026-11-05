import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { RAY_STAGGER_MS } from '../constants/config';
import theme from '../constants/theme';
import { DayStat } from '../game/walkLog';
import SunGlyph from './SunGlyph';

interface Props {
  week: DayStat[];
  /** Change this value to re-run the stagger (e.g. after a walk is saved). */
  revealKey: number;
  sunSize?: number;
}

/** Seven suns, one per day. Each one swells in on a 40ms stagger. */
function SunRow({ week, revealKey, sunSize = 34 }: Props) {
  const anims = useRef(week.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    anims.forEach(a => a.setValue(0));
    Animated.stagger(
      RAY_STAGGER_MS,
      anims.map(a =>
        Animated.timing(a, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [anims, revealKey]);

  const cells = useMemo(
    () =>
      week.map((d, i) => ({
        day: d,
        anim: anims[i],
        key: d.iso,
      })),
    [week, anims],
  );

  return (
    <View style={styles.card}>
      <View style={styles.capRow}>
        <Text style={styles.cap}>SUNS THIS WEEK</Text>
        <Text style={styles.capRight}>RAYS = MINUTES</Text>
      </View>
      <View style={styles.hair} />
      <View style={styles.row}>
        {cells.map(c => (
          <View key={c.key} style={styles.cell}>
            <View style={styles.dotSlot}>
              {c.day.isToday ? <View style={styles.todayDot} /> : null}
            </View>
            <Animated.View
              style={[
                styles.sunSlot,
                {
                  opacity: c.anim,
                  transform: [
                    {
                      scale: c.anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.55, 1],
                      }),
                    },
                  ],
                },
              ]}>
              <SunGlyph size={sunSize} minutes={c.day.minutes} strokeWidth={2.4} />
            </Animated.View>
            <Text
              style={[
                styles.letter,
                c.day.isToday ? styles.letterToday : null,
                c.day.isFuture ? styles.letterFuture : null,
              ]}>
              {c.day.letter}
            </Text>
            {c.day.minutes > 0 ? (
              <Text style={styles.mins}>{c.day.minutes}</Text>
            ) : (
              <Text style={styles.minsEmpty}>·</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    shadowColor: theme.colors.shadowWarm,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  capRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cap: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.accent,
  },
  capRight: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textSoft,
  },
  hair: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: 10,
    marginBottom: 6,
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  cell: { flex: 1, alignItems: 'center' },
  dotSlot: { height: 8, justifyContent: 'center' },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.accent,
  },
  sunSlot: { marginTop: 2, alignItems: 'center', justifyContent: 'center' },
  letter: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.textMid,
  },
  letterToday: { color: theme.colors.accent, fontWeight: '900' },
  letterFuture: { color: theme.colors.textSoft },
  mins: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
    fontVariant: ['tabular-nums'],
  },
  minsEmpty: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.textSoft,
  },
});

export default React.memo(SunRow);
