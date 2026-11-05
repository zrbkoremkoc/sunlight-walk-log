import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADER_PAD_TOP } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'light' | 'plain';
}

/** One header for every screen — Menu, Game, GameOver, Journal (rule #12). */
function ScreenHeader({ title, subtitle, leftSlot, rightSlot, tone = 'light' }: Props) {
  return (
    <View style={[styles.wrap, tone === 'light' ? styles.toneLight : null]}>
      <View style={styles.slot}>{leftSlot ? leftSlot : null}</View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.slotRight}>{rightSlot ? rightSlot : null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: HEADER_PAD_TOP,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toneLight: {
    backgroundColor: 'rgba(51,41,13,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  slot: { width: 48, alignItems: 'flex-start', justifyContent: 'center' },
  slotRight: { width: 48, alignItems: 'flex-end', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  title: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2.4,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.accent,
    textAlign: 'center',
  },
});

export default React.memo(ScreenHeader);
