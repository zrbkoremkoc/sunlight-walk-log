import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  Vibration,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CheckCircle2 } from 'lucide-react-native';
import { bgGame, iconHome, iconPause } from '../assets';
import { BURST_MS, HAPTIC_PATTERN } from '../constants/config';
import theme from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import PrimaryButton from '../components/PrimaryButton';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatStrip from '../components/StatStrip';
import TimerDial from '../components/TimerDial';

interface Props {
  todayMinutes: number;
  weekMinutes: number;
  best: number;
  onGameOver: (elapsedSec: number) => void;
  onMenu: () => void;
}

/** G3 split panel: the turning sun on top, the live numbers and CTAs below. */
function GameScreen({ todayMinutes, weekMinutes, best, onGameOver, onMenu }: Props) {
  const { elapsedSec, paused, toggle, read } = useTimer(true);
  const [burst, setBurst] = useState(0);
  const endingRef = useRef(false);
  const panelIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(panelIn, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [panelIn]);

  useEffect(() => {
    endingRef.current = false;
    return () => {
      endingRef.current = true;
    };
  }, []);

  const stop = useCallback(() => {
    if (endingRef.current) {
      return;
    }
    endingRef.current = true;
    const secs = read();
    setBurst(b => b + 1);
    Vibration.vibrate(HAPTIC_PATTERN);
    setTimeout(() => onGameOver(secs), BURST_MS);
  }, [onGameOver, read]);

  const discard = useCallback(() => {
    endingRef.current = true;
    onMenu();
  }, [onMenu]);

  const panelTranslate = panelIn.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBE6" />
      <ImageBackground source={bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(255,251,230,0.96)', 'rgba(255,243,207,0.90)', 'rgba(255,251,230,0.96)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}>
          <ScreenHeader
            tone="light"
            title={paused ? 'WALK PAUSED' : 'WALK IN PROGRESS'}
            leftSlot={
              <RoundIconButton
                label="Back to the menu"
                source={iconHome}
                tone="sand"
                onPress={discard}
              />
            }
            rightSlot={
              <RoundIconButton
                label={paused ? 'Resume the walk' : 'Pause the walk'}
                source={iconPause}
                tone={paused ? 'teal' : 'sand'}
                onPress={toggle}
              />
            }
          />

          <View style={styles.area}>
            <TimerDial elapsedSec={elapsedSec} paused={paused} burstTrigger={burst} />
          </View>

          <Animated.View
            pointerEvents="box-none"
            style={[styles.panel, { transform: [{ translateY: panelTranslate }] }]}>
            <StatStrip today={todayMinutes} week={weekMinutes} best={best} />
            <View style={styles.panelBody}>
              <PrimaryButton
                label="STOP AND LOG"
                Icon={CheckCircle2}
                colors={theme.gradients.accent}
                shadowColor={theme.colors.accent}
                onPress={stop}
              />
              <View style={styles.discardWrap}>
                <SecondaryButton label="DISCARD THIS WALK" tone="sand" onPress={discard} />
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  bg: { flex: 1 },
  overlay: { flex: 1 },
  area: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  panel: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingBottom: 22,
    shadowColor: theme.colors.shadowWarm,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 6,
  },
  panelBody: { paddingTop: 16 },
  discardWrap: { marginTop: 10 },
});

export default GameScreen;
