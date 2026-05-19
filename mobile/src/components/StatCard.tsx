import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

interface StatCardProps {
  value: string;
  label: string;
  accent: 'green' | 'amber' | 'blue';
}

export function StatCard({ value, label, accent }: StatCardProps) {
  const accentColor = {
    green: colors.brand,
    amber: colors.amber,
    blue: colors.blue,
  }[accent];

  return (
    <View style={[styles.card, { borderTopColor: accentColor }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderTopWidth: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  label: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 4,
  },
});
