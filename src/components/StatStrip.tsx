import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

interface Props {
  today: number;
  week: number;
  best: number;
}

interface CellProps {
  label: string;
  value: number;
  color: string;
  divider: boolean;
}

function Cell({ label, value, color, divider }: CellProps) {
  return (
    <View style={[styles.cell, divider ? styles.divider : null]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.unit}>MIN</Text>
      </View>
    </View>
  );
}

/** The G3 split-panel thin strip: TODAY · WEEK · BEST. */
function StatStrip({ today, week, best }: Props) {
  return (
    <View style={styles.wrap}>
      <Cell label="TODAY" value={today} color={theme.colors.primary} divider={true} />
      <Cell label="WEEK" value={week} color={theme.colors.text} divider={true} />
      <Cell label="BEST" value={best} color={theme.colors.accent} divider={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  divider: { borderRightWidth: 1, borderRightColor: theme.colors.border },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.textMid,
  },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 2 },
  value: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 21,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 14,
    color: theme.colors.textSoft,
  },
});

export default React.memo(StatStrip);
