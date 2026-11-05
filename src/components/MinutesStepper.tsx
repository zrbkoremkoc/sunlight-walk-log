import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MAX_MINUTES, MINUTE_STEP, MIN_MINUTES, PRESS_SPRING } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const STEP_BTN = 56;

interface StepProps {
  label: string;
  delta: number;
  value: number;
  onChange: (v: number) => void;
}

function clampMinutes(n: number): number {
  if (n < MIN_MINUTES) {
    return MIN_MINUTES;
  }
  return n > MAX_MINUTES ? MAX_MINUTES : n;
}

function Step({ label, delta, value, onChange }: StepProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, ...PRESS_SPRING }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...PRESS_SPRING }).start();
  }, [scale]);

  const press = useCallback(() => {
    onChange(clampMinutes(value + delta));
  }, [delta, onChange, value]);

  return (
    <Pressable
      onPress={press}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={delta > 0 ? 'Add five minutes' : 'Remove five minutes'}
      style={styles.stepPress}>
      <Animated.View pointerEvents="none" style={[styles.step, { transform: [{ scale }] }]}>
        <Text style={styles.stepText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** Big tabular minute count flanked by two 56px steppers. */
function MinutesStepper({ value, onChange }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pulse.setValue(0);
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 130, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 130, useNativeDriver: true }),
    ]).start();
  }, [value, pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <View style={styles.card}>
      <Step label="-5" delta={-MINUTE_STEP} value={value} onChange={onChange} />
      <View style={styles.center}>
        <Animated.Text style={[styles.value, { transform: [{ scale }] }]}>{value}</Animated.Text>
        <Text style={styles.unit}>MINUTES OUTSIDE</Text>
      </View>
      <Step label="+5" delta={MINUTE_STEP} value={value} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 92,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    shadowColor: theme.colors.shadowWarm,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  value: {
    fontSize: 42,
    fontWeight: '900',
    color: theme.colors.primary,
    lineHeight: 48,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMid,
  },
  stepPress: { width: STEP_BTN, height: STEP_BTN },
  step: {
    width: STEP_BTN,
    height: STEP_BTN,
    borderRadius: STEP_BTN / 2,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: theme.colors.accent,
  },
});

export default React.memo(MinutesStepper);
