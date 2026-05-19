import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { Tab } from '../app';

interface BottomNavProps {
  current: Tab;
  onChange: (tab: Tab) => void;
  unreadCount?: number;
}

export function BottomNav({ current, onChange, unreadCount }: BottomNavProps) {
  const tabs: Tab[] = ['home', 'search', 'seats', 'profile', 'contribute'];
  const labels = ['Home', 'Search', 'Tickets', 'Profile', 'Contribute'];
  const icons = ['🏠', '🔍', '🎫', '👤', '💚'];

  return (
    <View style={styles.nav}>
      {tabs.map((tab, idx) => (
        <Pressable
          key={tab}
          style={[styles.tab, current === tab && styles.tabActive]}
          onPress={() => onChange(tab)}
        >
          <Text style={styles.icon}>{icons[idx]}</Text>
          <Text style={[styles.label, current === tab && styles.labelActive]}>{labels[idx]}</Text>
          {tab === 'seats' && unreadCount ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabActive: {},
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: colors.text3,
    fontWeight: '700',
  },
  labelActive: {
    color: colors.brand,
    fontWeight: '900',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: 2,
    backgroundColor: colors.red,
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
});
