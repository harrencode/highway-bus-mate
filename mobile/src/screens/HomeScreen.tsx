import React from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';
import { Input } from '../components/Input';
import { StatCard } from '../components/StatCard';
import { SectionTitle } from '../components/SectionTitle';
import { RouteResponse, TripResponse, BookingResponse } from '../services/api';

type Tab = 'home' | 'search' | 'seats' | 'ticket' | 'profile' | 'contribute' | 'login';

interface HomeScreenProps {
  origin: string;
  destination: string;
  tripDate: string;
  routes: RouteResponse[];
  trips: TripResponse[];
  bookings: BookingResponse[];
  loading: boolean;
  apiNote: string;
  isLoggedIn: boolean;
  setOrigin: (v: string) => void;
  setDestination: (v: string) => void;
  setTripDate: (v: string) => void;
  searchTrips: () => void;
  setTab: (tab: Tab) => void;
}

export function HomeScreen(props: HomeScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollPad}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoRow}>
          <Text style={styles.logo}>
            Bus<Text style={{ color: colors.amber }}>Mate</Text>
          </Text>
          <View style={styles.bell}>
            <Text style={styles.bellText}>🔔</Text>
          </View>
        </View>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.greetingName}>Ready to travel? 🚌</Text>
      </View>

      {/* Search Card */}
      <View style={styles.searchCard}>
        <Text style={styles.cardTitle}>Where to go?</Text>
        <Input label="From" value={props.origin} onChangeText={props.setOrigin} />
        <Input label="To" value={props.destination} onChangeText={props.setDestination} />
        <Input label="Date" value={props.tripDate} onChangeText={props.setTripDate} />
        <Pressable style={styles.primaryButton} onPress={props.searchTrips} disabled={props.loading}>
          {props.loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Search buses</Text>}
        </Pressable>
      </View>

      {/* Popular Routes */}
      <SectionTitle title="Popular routes" action="View all" />
      <View style={styles.chipRow}>
        {props.routes.slice(0, 2).map(route => (
          <View style={styles.chip} key={route.id}>
            <Text style={styles.chipText}>⭐ {route.origin} → {route.destination}</Text>
          </View>
        ))}
      </View>

      {/* Stats Grid */}
      <View style={styles.statGrid}>
        <StatCard value={String(props.bookings.length)} label="My bookings" accent="green" />
        <StatCard value={String(props.routes.length)} label="Routes" accent="amber" />
        <StatCard value={String(props.trips.length)} label="Available" accent="blue" />
        <StatCard value="1M+" label="Users" accent="green" />
      </View>

      {/* CTA Card */}
      {!props.isLoggedIn && (
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Unlock full features</Text>
          <Text style={styles.ctaMeta}>Log in to book, save routes & more</Text>
          <Pressable style={styles.primaryButton} onPress={() => props.setTab('login')}>
            <Text style={styles.primaryText}>Sign in →</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.apiNote}>{props.apiNote}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollPad: { paddingBottom: 110 },
  hero: { backgroundColor: colors.brandDark, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 34 },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  logo: { fontSize: 24, fontWeight: '800', color: '#fff' },
  bell: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  bellText: { fontSize: 18 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.66)' },
  greetingName: { fontSize: 24, lineHeight: 31, fontWeight: '800', color: '#fff', marginTop: 4 },
  searchCard: { margin: 16, marginTop: -14, backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.line },
  cardTitle: { fontSize: 14, fontWeight: '800', color: colors.text2, marginBottom: 12 },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  chip: { backgroundColor: colors.brandLight, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  chipText: { color: colors.brand, fontSize: 12, fontWeight: '800' },
  statGrid: { paddingHorizontal: 16, marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  apiNote: { paddingHorizontal: 16, marginTop: 16, color: colors.text2, fontSize: 12, lineHeight: 18 },
  ctaCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: colors.brandLight, borderRadius: 16, padding: 16 },
  ctaTitle: { fontSize: 16, fontWeight: '900', color: colors.brandDark, marginBottom: 4 },
  ctaMeta: { fontSize: 12, color: colors.text3, marginBottom: 12 },
});
