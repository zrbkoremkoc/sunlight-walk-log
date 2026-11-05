import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

interface Props {
  items: string[];
  index: number;
  onChange: (i: number) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

interface SegProps {
  label: string;
  i: number;
  active: boolean;
  onChange: (i: number) => void;
}

function Segment({ label, i, active, onChange }: SegProps) {
  const press = useCallback(() => onChange(i), [i, onChange]);
  return (
    <Pressable
      onPress={press}
      hitSlop={HIT}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={styles.segPress}>
      <View style={[styles.seg, active ? styles.segActive : null]}>
        <Text style={[styles.text, active ? styles.textActive : null]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

/** Four-way segmented control for the Journal tabs. */
function SegmentedTabs({ items, index, onChange }: Props) {
  return (
    <View style={styles.track}>
      {items.map((it, i) => (
        <Segment key={it} label={it} i={i} active={i === index} onChange={onChange} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: 4,
  },
  segPress: { flex: 1, height: 36 },
  seg: {
    width: '100%',
    height: 36,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segActive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.textMid,
  },
  textActive: { color: theme.colors.text },
});

export default React.memo(SegmentedTabs);
