import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SUN_SPIN_MS } from '../constants/config';
import theme from '../constants/theme';
import { formatClock } from '../utils/format';
import GoldenBurst from './GoldenBurst';
import SunGlyph from './SunGlyph';

interface Props {
  elapsedSec: number;
  paused: boolean;
  burstTrigger: number;
}

const DIAL = 178;

/** Slowly turning sun + tabular clock. Rotation is transform-only, native driver. */
function TimerDial({ elapsedSec, paused, burstTrigger }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (paused) {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }
      return;
    }
    spin.setValue(0);
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: SUN_SPIN_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loopRef.current = loop;
    loop.start();
    return () => {
      loop.stop();
      loopRef.current = null;
    };
  }, [paused, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const minutes = Math.floor(elapsedSec / 60);

  return (
    <View style={styles.wrap}>
      <View style={styles.blob} />
      <View style={styles.dialBox}>
        <GoldenBurst trigger={burstTrigger} size={DIAL} />
        <Animated.View pointerEvents="none" style={{ transform: [{ rotate }] }}>
          <SunGlyph
            size={DIAL}
            minutes={1}
            rayCount={16}
            coreColor={paused ? theme.colors.muted : theme.colors.primary}
            rayColor={paused ? theme.colors.muted : theme.colors.primary}
            strokeWidth={5}
            gradientId="timerSun"
          />
        </Animated.View>
      </View>

      <Text style={styles.clock}>{formatClock(elapsedSec)}</Text>
      <Text style={styles.caption}>
        {minutes > 0 ? `${minutes} MIN LOGGED SO FAR` : 'UNDER A MINUTE SO FAR'}
      </Text>
      {paused ? <Text style={styles.paused}>PAUSED · TAP THE PAUSE ICON TO RESUME</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  blob: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: 'rgba(244,163,0,0.10)',
    top: 0,
  },
  dialBox: {
    width: DIAL,
    height: DIAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: {
    marginTop: 18,
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.textMid,
  },
  paused: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.accent,
  },
});

export default React.memo(TimerDial);
