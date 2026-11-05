import React, { useCallback, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SCREEN_W, SKY_OPTIONS, SkyId } from '../constants/config';
import theme from '../constants/theme';
import { SKY_SPRITES } from '../assets';

interface Props {
  value: SkyId;
  onChange: (id: SkyId) => void;
}

const GAP = 8;
const TILE = Math.floor((Math.min(SCREEN_W, 440) - 40 - GAP * 4) / 5);
const SPRITE = Math.round(TILE * 0.56);
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

interface TileProps {
  index: number;
  label: string;
  id: SkyId;
  active: boolean;
  onChange: (id: SkyId) => void;
}

function SkyTile({ index, label, id, active, onChange }: TileProps) {
  const wob = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.94, tension: 300, friction: 12, useNativeDriver: true }).start();
    wob.setValue(0);
    Animated.timing(wob, {
      toValue: 1,
      duration: 180,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [scale, wob]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);

  const press = useCallback(() => onChange(id), [id, onChange]);

  const rotate = wob.interpolate({
    inputRange: [0, 0.35, 0.7, 1],
    outputRange: ['0deg', '-3deg', '3deg', '0deg'],
  });

  return (
    <Pressable
      onPress={press}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Sky ${label}`}
      style={[styles.press, index === 4 ? null : styles.pressGap]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.tile,
          active ? styles.tileActive : null,
          { transform: [{ scale }, { rotate }] },
        ]}>
        <Image source={SKY_SPRITES[index]} style={styles.sprite} />
      </Animated.View>
      <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Five illustrated sky tiles — the sprites sit plainly on the tile, unmasked. */
function SkyTileRow({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {SKY_OPTIONS.map(opt => (
        <SkyTile
          key={opt.id}
          index={opt.spriteIndex}
          id={opt.id}
          label={opt.label}
          active={value === opt.id}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  press: { width: TILE },
  pressGap: { marginRight: GAP },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bgMid,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileActive: {
    backgroundColor: theme.colors.primaryPale,
    borderColor: theme.colors.primary,
  },
  sprite: { width: SPRITE, height: SPRITE, resizeMode: 'contain' },
  label: {
    marginTop: 6,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
    color: theme.colors.textMid,
  },
  labelActive: { color: theme.colors.primaryDark },
});

export default React.memo(SkyTileRow);
