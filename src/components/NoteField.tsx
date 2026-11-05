import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { NOTE_MAX } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

/** One line about what you noticed. 90 characters, nothing measured. */
function NoteField({ value, onChange }: Props) {
  return (
    <View style={styles.box}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="WHAT DID YOU NOTICE?"
        placeholderTextColor={theme.colors.textSoft}
        maxLength={NOTE_MAX}
        multiline={true}
        style={styles.input}
        textAlignVertical="top"
        accessibilityLabel="Note about this walk"
      />
      <Text style={styles.counter}>
        {value.length} / {NOTE_MAX}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: 72,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textSoft,
  },
});

export default React.memo(NoteField);
