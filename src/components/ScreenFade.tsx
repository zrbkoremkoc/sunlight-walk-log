import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';
import { SCREEN_SLIDE_MS } from '../constants/config';

interface Props {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'none';
  style?: ViewStyle;
}

/** 240ms horizontal slide + fade on mount. transform/opacity only. */
function ScreenFade({ children, direction = 'right', style }: Props) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: SCREEN_SLIDE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [t]);

  const from = direction === 'left' ? -28 : direction === 'right' ? 28 : 0;
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [from, 0] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.fill, style, { opacity: t, transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

export default ScreenFade;
