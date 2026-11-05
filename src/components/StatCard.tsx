import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

interface Props {
  value: string | number;
  label: string;
  accent: string;
}

/**
 * Editorial stat pill: accent dot, big tabular number, uppercase caption.
 * No raster icon — every pill is identical in shape, colour carries meaning.
 * Renders null when there is nothing to show (never an empty box).
 */
function StatCard({ value, label, accent }: Props) {
  const numeric = typeof value === 'number' ? value : parseFloat(value);
  if (typeof value === 'number' && value <= 0) {
    return null;
  }
  if (typeof value === 'string' && (value.length === 0 || numeric === 0)) {
    return null;
  }

  return (
    <View style={[styles.card, { borderColor: `${accent}55` }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // width 100% + intrinsic height — never flex:1 inside a flex:1 slot.
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    shadowColor: theme.colors.shadowWarm,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  value: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.textMid,
  },
});

export default React.memo(StatCard);
