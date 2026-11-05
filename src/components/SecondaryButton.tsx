import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { PRESS_SPRING, SECONDARY_H } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  tone?: 'teal' | 'sand';
  flex?: boolean;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Flat rgba + hairline border button, h48. No icon — label only (rule #20). */
function SecondaryButton({ label, onPress, tone = 'teal', flex = false }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, ...PRESS_SPRING }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...PRESS_SPRING }).start();
  }, [scale]);

  const teal = tone === 'teal';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, flex ? styles.flex : styles.full]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.box,
          {
            transform: [{ scale }],
            backgroundColor: teal ? theme.colors.accentSoft : 'rgba(216,201,168,0.22)',
            borderColor: teal ? theme.colors.accentLine : theme.colors.borderStrong,
          },
        ]}>
        <View style={styles.row}>
          <Text
            style={[styles.label, { color: teal ? theme.colors.accent : theme.colors.textMid }]}
            numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { height: SECONDARY_H },
  full: { width: '100%', alignSelf: 'stretch' },
  flex: { flex: 1 },
  box: {
    width: '100%',
    height: SECONDARY_H,
    borderRadius: theme.radius.md,
    borderWidth: 1,
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
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    lineHeight: 18,
  },
});

export default React.memo(SecondaryButton);
