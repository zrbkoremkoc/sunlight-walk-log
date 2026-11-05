import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
} from 'react-native';
import { ICON_BTN, ICON_SIZE, PRESS_SPRING } from '../constants/config';
import theme from '../constants/theme';

import type { IconCmp } from './iconTypes';

interface Props {
  onPress: () => void;
  label: string;
  source?: ImageSourcePropType;
  Icon?: IconCmp;
  tint?: string;
  tone?: 'teal' | 'sand';
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 48x48 flat icon button — explicit width AND height, always. */
function RoundIconButton({ onPress, label, source, Icon, tint, tone = 'teal' }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, ...PRESS_SPRING }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...PRESS_SPRING }).start();
  }, [scale]);

  const teal = tone === 'teal';
  const color = tint || (teal ? theme.colors.accent : theme.colors.primary);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.box,
          {
            transform: [{ scale }],
            backgroundColor: teal ? theme.colors.accentSoft : 'rgba(244,163,0,0.12)',
            borderColor: teal ? theme.colors.accentLine : 'rgba(244,163,0,0.28)',
          },
        ]}>
        {source ? <Image source={source} style={styles.img} /> : null}
        {Icon ? <Icon size={ICON_SIZE} color={color} strokeWidth={2.2} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: ICON_BTN, height: ICON_BTN },
  box: {
    width: ICON_BTN,
    height: ICON_BTN,
    borderRadius: ICON_BTN / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: { width: ICON_SIZE, height: ICON_SIZE, resizeMode: 'contain' },
});

export default React.memo(RoundIconButton);
