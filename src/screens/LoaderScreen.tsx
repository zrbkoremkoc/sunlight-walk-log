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
import Svg, { Line } from 'react-native-svg';
import { bgGame, logo } from '../assets';
import { LOADER_DURATION_MS, LOADER_FADE_MS } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  onDone: () => void;
}

const RAY_BOX = 236;
const BAR_W = 212;

const RAYS = (() => {
  const c = RAY_BOX / 2;
  const inner = 86;
  const outer = 114;
  const out: Array<{ key: string; x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
    out.push({
      key: `lr${i}`,
      x1: c + Math.cos(a) * inner,
      y1: c + Math.sin(a) * inner,
      x2: c + Math.cos(a) * outer,
      y2: c + Math.sin(a) * outer,
    });
  }
  return out;
})();

/**
 * Splash. Deep dusk overlay on the shared background — deliberately nothing
 * like the bright butter Menu. Non-interactive brand card: no chips, no CTA,
 * no touchables at all — it auto-advances via setTimeout(onDone).
 */
function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;
  const logoIn = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const raysIn = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoIn, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(raysIn, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    // width is a layout prop -> JS driver only, never useNativeDriver: true
    const barAnim = Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    barAnim.start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      loop.stop();
      barAnim.stop();
    };
  }, [bar, fade, logoIn, logoScale, onDone, raysIn, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const barWidth = bar.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <StatusBar barStyle="light-content" backgroundColor="#33290D" />
      <ImageBackground source={bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={theme.gradients.loader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overlay}>
          <View style={styles.center}>
            <View style={styles.markBox}>
              <View style={styles.blob} />
              <Animated.View
                pointerEvents="none"
                style={[styles.rayBox, { opacity: raysIn, transform: [{ rotate }] }]}>
                <Svg width={RAY_BOX} height={RAY_BOX} viewBox={`0 0 ${RAY_BOX} ${RAY_BOX}`}>
                  {RAYS.map(r => (
                    <Line
                      key={r.key}
                      x1={r.x1}
                      y1={r.y1}
                      x2={r.x2}
                      y2={r.y2}
                      stroke="rgba(255,239,179,0.35)"
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  ))}
                </Svg>
              </Animated.View>
              <Animated.View
                pointerEvents="none"
                style={{ opacity: logoIn, transform: [{ scale: logoScale }] }}>
                <Image source={logo} style={styles.logo} />
              </Animated.View>
            </View>

            <Text style={styles.titleTop}>SUNLIGHT</Text>
            <Text style={styles.titleBottom}>WALK LOG</Text>
            <Text style={styles.sub}>MINUTES UNDER THE SKY</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.track}>
              <Animated.View style={[styles.fillWrap, { width: barWidth }]}>
                <LinearGradient
                  colors={theme.gradients.bar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.fill}
                />
              </Animated.View>
            </View>
            <Text style={styles.loading}>LOADING...</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#33290D' },
  bg: { flex: 1 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center' },
  markBox: {
    width: RAY_BOX,
    height: RAY_BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(244,163,0,0.18)',
  },
  rayBox: { position: 'absolute', width: RAY_BOX, height: RAY_BOX },
  logo: { width: 148, height: 148, resizeMode: 'contain' },
  titleTop: {
    marginTop: 18,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#FFEFB3',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleBottom: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 6,
    color: theme.colors.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  sub: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(255,251,230,0.72)',
  },
  footer: { position: 'absolute', bottom: 64, alignItems: 'center' },
  track: {
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,251,230,0.18)',
    overflow: 'hidden',
  },
  fillWrap: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { flex: 1, borderRadius: 3 },
  loading: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'rgba(255,251,230,0.6)',
  },
});

export default LoaderScreen;
