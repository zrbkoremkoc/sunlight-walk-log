import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { TOAST_MS } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  text: string;
  trigger: number;
}

/** Fades in, holds, fades out. Lives above everything, never eats taps. */
function ToastPill({ text, trigger }: Props) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger <= 0) {
      return;
    }
    a.setValue(0);
    Animated.sequence([
      Animated.timing(a, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(TOAST_MS - 500),
      Animated.timing(a, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [trigger, a]);

  const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.pill, { opacity: a, transform: [{ translateY }] }]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 26,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.text,
    shadowColor: theme.colors.shadowWarm,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.onDark,
  },
});

export default React.memo(ToastPill);
