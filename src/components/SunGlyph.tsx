import React, { useMemo } from 'react';
import Svg, { Circle, Defs, Line, LinearGradient, Stop } from 'react-native-svg';
import { MAX_RAYS } from '../constants/config';
import theme from '../constants/theme';
import { rayLength, raysFor } from '../game/walkLog';

interface Props {
  size: number;
  minutes: number;
  /** Force a full ring of rays (used by the big timer sun). */
  rayCount?: number;
  coreColor?: string;
  rayColor?: string;
  emptyCore?: string;
  emptyStroke?: string;
  strokeWidth?: number;
  gradientId?: string;
}

/**
 * The project's one sun. Core + rays are real SVG geometry — never a glyph,
 * never an emoji. Rays grow with the minutes logged that day.
 */
function SunGlyph({
  size,
  minutes,
  rayCount,
  coreColor = theme.colors.primary,
  rayColor = theme.colors.primary,
  emptyCore = '#F2EAD8',
  emptyStroke = theme.colors.borderStrong,
  strokeWidth = 2.5,
  gradientId,
}: Props) {
  const c = size / 2;
  const coreR = size * 0.24;
  const gap = size * 0.06;
  const maxLen = c - 1 - coreR - gap;
  const inner = coreR + gap;

  const count = rayCount !== undefined ? rayCount : raysFor(minutes);
  const lit = minutes > 0 || rayCount !== undefined;

  const lines = useMemo(() => {
    const total = rayCount !== undefined ? rayCount : MAX_RAYS;
    const len = rayCount !== undefined ? maxLen : maxLen * (rayLength(minutes) / 13);
    const out: Array<{ x1: number; y1: number; x2: number; y2: number; key: string }> = [];
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / total - Math.PI / 2;
      out.push({
        key: `r${i}`,
        x1: c + Math.cos(a) * inner,
        y1: c + Math.sin(a) * inner,
        x2: c + Math.cos(a) * (inner + len),
        y2: c + Math.sin(a) * (inner + len),
      });
    }
    return out;
  }, [c, count, inner, maxLen, minutes, rayCount]);

  const gid = gradientId || 'sunCoreGrad';

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={theme.colors.primaryLight} />
          <Stop offset="1" stopColor={coreColor} />
        </LinearGradient>
      </Defs>
      {lines.map(l => (
        <Line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={rayColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}
      <Circle
        cx={c}
        cy={c}
        r={coreR}
        fill={lit ? `url(#${gid})` : emptyCore}
        stroke={lit ? 'none' : emptyStroke}
        strokeWidth={lit ? 0 : 1.5}
      />
    </Svg>
  );
}

export default React.memo(SunGlyph);
