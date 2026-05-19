import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}

export function Input({ label, placeholder, value, onChangeText, multiline }: InputProps) {
  return (
    <TextInput
      placeholder={placeholder || label}
      placeholderTextColor={colors.text3}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      style={[styles.input, multiline && styles.inputMulti]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  inputMulti: {
    paddingVertical: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});
