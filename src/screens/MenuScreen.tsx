import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Settings, Sun } from 'lucide-react-native';
import { bgGame, logo } from '../assets';
import { ENTRY_SPRING } from '../constants/config';
import theme from '../constants/theme';
import { DayStat } from '../game/walkLog';
import PrimaryButton from '../components/PrimaryButton';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import SunRow from '../components/SunRow';

interface Props {
  week: DayStat[];
  weekMinutes: number;
  streak: number;
  routeCount: number;
  revealKey: number;
  onStart: () => void;
  onManual: () => void;
  onJournal: () => void;
}

/** M4 asymmetric / editorial home: brand strip, hero figure, sun row, CTAs. */
function MenuScreen({
  week,
  weekMinutes,
  streak,
  routeCount,
  revealKey,
  onStart,
  onManual,
  onJournal,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const cardIn = useRef(new Animated.Value(0)).current;
  const ctaIn = useRef(new Animated.Value(0.9)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.timing(cardIn, {
      toValue: 1,
      duration: 280,
      delay: 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.spring(ctaIn, {
      toValue: 1,
      delay: 240,
      useNativeDriver: true,
      ...ENTRY_SPRING,
    }).start();
  }, [cardIn, ctaIn, enter]);

  useEffect(() => {
    pulse.setValue(0);
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 130, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 130, useNativeDriver: true }),
    ]).start();
  }, [weekMinutes, pulse]);

  const heroTranslate = enter.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] });
  const cardTranslate = cardIn.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const heroScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  const showStats = streak > 0 && routeCount > 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBE6" />
      <ImageBackground source={bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(255,251,230,0.92)', 'rgba(255,246,212,0.94)', 'rgba(255,239,179,0.96)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}>
          <View pointerEvents="none" style={styles.blobTeal} />
          <View pointerEvents="none" style={styles.blobGold} />

          <ScreenHeader
            tone="plain"
            title="SUNLIGHT WALK LOG"
            subtitle="A QUIET RECORD OF TIME OUTSIDE"
            leftSlot={<Image source={logo} style={styles.brandMark} />}
            rightSlot={
              <RoundIconButton
                label="Open the journal"
                Icon={Settings}
                tone="teal"
                onPress={onJournal}
              />
            }
          />

          <View style={styles.body}>
            <Animated.View
              pointerEvents="box-none"
              style={{ opacity: enter, transform: [{ translateY: heroTranslate }] }}>
              <Text style={styles.kicker}>THIS WEEK</Text>
              <View style={styles.heroRow}>
                <Animated.Text style={[styles.hero, { transform: [{ scale: heroScale }] }]}>
                  {weekMinutes}
                </Animated.Text>
                <Text style={styles.heroUnit}>MIN OUTSIDE</Text>
              </View>
              <View style={styles.hair} />
            </Animated.View>

            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.sunRowWrap,
                { opacity: cardIn, transform: [{ translateY: cardTranslate }] },
              ]}>
              <SunRow week={week} revealKey={revealKey} />
            </Animated.View>

            {showStats ? (
              <View style={styles.statsRow}>
                <View style={styles.statSlot}>
                  <StatCard value={streak} label="DAY STREAK" accent={theme.colors.primary} />
                </View>
                <View style={styles.statSlot}>
                  <StatCard value={routeCount} label="ROUTES" accent={theme.colors.accent} />
                </View>
              </View>
            ) : null}

            <View style={styles.spacer} />

            <Text style={styles.hint}>TAP START TO TIME A WALK · OR ADD MINUTES LATER</Text>

            <Animated.View
              pointerEvents="box-none"
              style={{ transform: [{ scale: ctaIn }], opacity: enter }}>
              <PrimaryButton label="START WALK" Icon={Sun} onPress={onStart} />
            </Animated.View>

            <View style={styles.secondaryWrap}>
              <SecondaryButton label="ADD MINUTES BY HAND" tone="teal" onPress={onManual} />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  bg: { flex: 1 },
  overlay: { flex: 1 },
  blobTeal: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(42,157,143,0.07)',
    top: -70,
    right: -80,
  },
  blobGold: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(244,163,0,0.09)',
    bottom: 120,
    left: -70,
  },
  brandMark: { width: 36, height: 36, resizeMode: 'contain' },
  body: { flex: 1, paddingHorizontal: 20, paddingBottom: 22 },
  kicker: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.accent,
  },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 2 },
  hero: {
    fontSize: 62,
    lineHeight: 70,
    fontWeight: '900',
    letterSpacing: -1,
    color: theme.colors.primary,
    fontVariant: ['tabular-nums'],
  },
  heroUnit: {
    paddingBottom: 12,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textMid,
  },
  hair: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: 6,
    marginBottom: 14,
  },
  sunRowWrap: { width: '100%' },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  statSlot: { flex: 1 },
  spacer: { flex: 1, minHeight: 12 },
  hint: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMid,
    marginBottom: 10,
  },
  secondaryWrap: { marginTop: 10 },
});

export default MenuScreen;
