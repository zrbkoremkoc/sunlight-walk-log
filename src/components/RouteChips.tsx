import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NOTE_MAX } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  routes: string[];
  value: string;
  onChange: (name: string) => void;
  onCreate: (name: string) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

interface ChipProps {
  name: string;
  active: boolean;
  onChange: (name: string) => void;
}

function Chip({ name, active, onChange }: ChipProps) {
  const press = useCallback(() => onChange(active ? '' : name), [active, name, onChange]);
  return (
    <Pressable
      onPress={press}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={'Route ' + name}
      style={[styles.chip, active ? styles.chipActive : null]}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]} numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}

/** Wrapped route chips plus a one-line "+ NEW ROUTE" field. */
function RouteChips({ routes, value, onChange, onCreate }: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const openAdd = useCallback(() => setAdding(true), []);

  const commit = useCallback(() => {
    const clean = draft.trim();
    if (clean.length > 0) {
      onCreate(clean);
      onChange(clean);
    }
    setDraft('');
    setAdding(false);
  }, [draft, onChange, onCreate]);

  return (
    <View style={styles.wrap}>
      {routes.map(r => (
        <Chip key={r} name={r} active={value === r} onChange={onChange} />
      ))}
      {adding ? (
        <View style={styles.inputChip}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onBlur={commit}
            onSubmitEditing={commit}
            autoFocus={true}
            maxLength={NOTE_MAX}
            placeholder="ROUTE NAME"
            placeholderTextColor={theme.colors.textSoft}
            style={styles.input}
            returnKeyType="done"
          />
        </View>
      ) : (
        <Pressable
          onPress={openAdd}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Add a new route"
          style={[styles.chip, styles.chipNew]}>
          <Text style={styles.chipNewText}>+ NEW ROUTE</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    height: 40,
    minWidth: 92,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(42,157,143,0.14)',
    borderColor: theme.colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.textMid,
  },
  chipTextActive: { color: theme.colors.accent, fontWeight: '800' },
  chipNew: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.borderStrong,
    borderStyle: 'dashed',
  },
  chipNewText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.textSoft,
  },
  inputChip: {
    height: 40,
    minWidth: 150,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    justifyContent: 'center',
  },
  input: {
    padding: 0,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
});

export default React.memo(RouteChips);
