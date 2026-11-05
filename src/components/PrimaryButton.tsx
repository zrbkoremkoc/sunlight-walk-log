import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CTA_H, ICON_SIZE, PRESS_SPRING } from '../constants/config';
import theme from '../constants/theme';

import type { IconCmp } from './iconTypes';

interface Props {
  label: string;
  onPress: () => void;
  Icon?: IconCmp;
  colors?: string[];
  shadowColor?: string;
  textColor?: string;
  height?: number;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Gradient CTA. Pressable is the PARENT, the Animated.View lives inside it. */
function PrimaryButton({
  label,
  onPress,
  Icon,
  colors = theme.gradients.primary,
  shadowColor = theme.colors.primary,
  textColor = theme.colors.onDark,
  height = CTA_H,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, ...PRESS_SPRING }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...PRESS_SPRING }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shadow,
          { height, shadowColor, shadowOpacity: 0.34, elevation: 6, transform: [{ scale }] },
        ]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.grad, { height }]}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON_SIZE} color={textColor} strokeWidth={2.4} /> : null}
            <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    alignSelf: 'stretch',
  },
  shadow: {
    width: '100%',
    borderRadius: theme.radius.md + 2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  grad: {
    width: '100%',
    borderRadius: theme.radius.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1.6,
    lineHeight: ICON_SIZE,
  },
});

export default React.memo(PrimaryButton);
