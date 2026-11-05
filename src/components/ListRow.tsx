import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  value?: string;
  valueColor?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  compact?: boolean;
}

/** One generic journal row — routes, notes and walks all reuse it. */
function ListRow({
  title,
  subtitle,
  value,
  valueColor = theme.colors.primary,
  leftSlot,
  rightSlot,
  compact = false,
}: Props) {
  return (
    <View style={[styles.row, compact ? styles.rowCompact : null]}>
      {leftSlot ? <View style={styles.left}>{leftSlot}</View> : null}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {rightSlot ? <View style={styles.right}>{rightSlot}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rowCompact: { minHeight: 56 },
  left: { marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  right: { marginLeft: 10, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.textMid,
  },
  value: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(ListRow);
