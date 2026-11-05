import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { BURST_MS } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  trigger: number;
  size?: number;
}

/** Ten SVG rays flaring out of the centre, 450ms. transform + opacity only. */
function GoldenBurst({ trigger, size = 180 }: Props) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger <= 0) {
      return;
    }
    t.setValue(0);
    Animated.timing(t, {
      toValue: 1,
      duration: BURST_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [trigger, t]);

  const rays = useMemo(() => {
    const c = size / 2;
    const inner = size * 0.2;
    const outer = size * 0.46;
    const out: Array<{ key: string; x1: number; y1: number; x2: number; y2: number }> = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
      out.push({
        key: `b${i}`,
        x1: c + Math.cos(a) * inner,
        y1: c + Math.sin(a) * inner,
        x2: c + Math.cos(a) * outer,
        y2: c + Math.sin(a) * outer,
      });
    }
    return out;
  }, [size]);

  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.9] });
  const opacity = t.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.9, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, { width: size, height: size, opacity, transform: [{ scale }] }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {rays.map(r => (
          <Line
            key={r.key}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke={theme.colors.primaryLight}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});

export default React.memo(GoldenBurst);
