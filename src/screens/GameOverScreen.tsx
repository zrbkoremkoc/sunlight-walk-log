import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Sun } from 'lucide-react-native';
import { bgGame } from '../assets';
import { BURST_MS, HAPTIC_PATTERN, MIN_MINUTES, SkyId } from '../constants/config';
import theme from '../constants/theme';
import { WalkDraft } from '../hooks/useWalkLog';
import GoldenBurst from '../components/GoldenBurst';
import MinutesStepper from '../components/MinutesStepper';
import NoteField from '../components/NoteField';
import PrimaryButton from '../components/PrimaryButton';
import RouteChips from '../components/RouteChips';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SkyTileRow from '../components/SkyTileRow';
import SunGlyph from '../components/SunGlyph';
import ToastPill from '../components/ToastPill';

export type SaveTarget = 'game' | 'menu' | 'journal';

interface Props {
  elapsedSec: number;
  routes: string[];
  onSave: (draft: WalkDraft, target: SaveTarget) => void;
  onAddRoute: (name: string) => void;
}

function minutesFromSeconds(sec: number): number {
  const m = Math.round(sec / 60);
  return m < MIN_MINUTES ? MIN_MINUTES : m;
}

/** The result screen: confirm the minutes, pick the sky, keep a line about it. */
function GameOverScreen({ elapsedSec, routes, onSave, onAddRoute }: Props) {
  const [minutes, setMinutes] = useState(() => minutesFromSeconds(elapsedSec));
  const [sky, setSky] = useState<SkyId>('clear');
  const [route, setRoute] = useState('');
  const [note, setNote] = useState('');
  const [burst, setBurst] = useState(0);
  const [toast, setToast] = useState(0);
  const savingRef = useRef(false);

  const stage = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.stagger(
      60,
      stage.map(v =>
        Animated.timing(v, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [stage]);

  const commit = useCallback(
    (target: SaveTarget) => {
      if (savingRef.current) {
        return;
      }
      savingRef.current = true;
      setBurst(b => b + 1);
      setToast(t => t + 1);
      Vibration.vibrate(HAPTIC_PATTERN);
      const draft: WalkDraft = { minutes, sky, route, note: note.trim() };
      setTimeout(() => onSave(draft, target), BURST_MS + 70);
    },
    [minutes, note, onSave, route, sky],
  );

  const saveAgain = useCallback(() => commit('game'), [commit]);
  const saveMenu = useCallback(() => commit('menu'), [commit]);
  const saveJournal = useCallback(() => commit('journal'), [commit]);

  const stageStyle = useMemo(
    () =>
      stage.map(v => ({
        opacity: v,
        transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
      })),
    [stage],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBE6" />
      <ImageBackground source={bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={theme.gradients.result}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}>
          <ScreenHeader
            tone="plain"
            title={elapsedSec > 0 ? 'WALK LOGGED' : 'ADD MINUTES'}
            subtitle={`${minutes} MINUTES OUTSIDE`}
            leftSlot={
              <View style={styles.decor}>
                <SunGlyph size={38} minutes={minutes} strokeWidth={2.4} gradientId="resultSun" />
              </View>
            }
          />

          <View style={styles.body}>
            <View pointerEvents="none" style={styles.burstBox}>
              <GoldenBurst trigger={burst} size={210} />
            </View>

            <Animated.View pointerEvents="box-none" style={stageStyle[0]}>
              <MinutesStepper value={minutes} onChange={setMinutes} />
            </Animated.View>

            <Animated.View pointerEvents="box-none" style={[styles.block, stageStyle[1]]}>
              <Text style={styles.label}>SKY YOU WALKED UNDER</Text>
              <SkyTileRow value={sky} onChange={setSky} />
            </Animated.View>

            <Animated.View pointerEvents="box-none" style={[styles.block, stageStyle[2]]}>
              <Text style={styles.label}>ROUTE</Text>
              <RouteChips
                routes={routes}
                value={route}
                onChange={setRoute}
                onCreate={onAddRoute}
              />
            </Animated.View>

            <Animated.View pointerEvents="box-none" style={[styles.block, stageStyle[3]]}>
              <Text style={styles.label}>NOTICED</Text>
              <NoteField value={note} onChange={setNote} />
            </Animated.View>

            <View style={styles.spacer} />

            <Text style={styles.hint}>SAVED ON THIS DEVICE ONLY · NOTHING IS SCORED</Text>

            <PrimaryButton label="SAVE AND WALK AGAIN" Icon={Sun} onPress={saveAgain} />

            <View style={styles.footerRow}>
              <SecondaryButton label="SAVE AND MENU" tone="teal" flex={true} onPress={saveMenu} />
              <SecondaryButton label="JOURNAL" tone="sand" flex={true} onPress={saveJournal} />
            </View>
          </View>

          <ToastPill text="WALK SAVED ✓" trigger={toast} />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  bg: { flex: 1 },
  overlay: { flex: 1 },
  decor: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, paddingHorizontal: 20, paddingBottom: 22, paddingTop: 4 },
  burstBox: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  block: { marginTop: 14 },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.accent,
    marginBottom: 8,
  },
  spacer: { flex: 1, minHeight: 10 },
  hint: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMid,
    marginBottom: 10,
  },
  footerRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
});

export default GameOverScreen;
