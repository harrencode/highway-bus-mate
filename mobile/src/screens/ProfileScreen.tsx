import React from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';
import { BookingResponse } from '../services/api';
import { SectionTitle } from '../components/SectionTitle';

type Tab = 'home' | 'search' | 'seats' | 'ticket' | 'profile' | 'contribute' | 'login';

interface ProfileScreenProps {
  isLoggedIn: boolean;
  bookings: BookingResponse[];
  loadBookings: () => void;
  loading: boolean;
  handleLogout: () => void;
  setTab: (tab: Tab) => void;
}

export function ProfileScreen(props: ProfileScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollPad}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.profileName}>Kasun Perera</Text>
        <Text style={styles.profilePhone}>{props.isLoggedIn ? 'kasun@busmate.com' : 'Sign in to see details'}</Text>
        <View style={styles.profileStats}>
          <View style={styles.statMini}>
            <Text style={styles.statMiniValue}>{props.bookings.length}</Text>
            <Text style={styles.statMiniLabel}>Bookings</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statMiniValue}>5</Text>
            <Text style={styles.statMiniLabel}>Saved</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statMiniValue}>150</Text>
            <Text style={styles.statMiniLabel}>Points</Text>
          </View>
        </View>
      </View>

      {props.isLoggedIn ? (
        <>
          <Pressable style={styles.primaryButton} onPress={props.loadBookings} disabled={props.loading}>
            {props.loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Reload bookings</Text>}
          </Pressable>

          <SectionTitle title="My Bookings" action={`${props.bookings.length} total`} />
          {props.bookings.length ? (
            props.bookings.map(booking => (
              <View style={styles.bookingItem} key={booking.id}>
                <View style={styles.bookingDot} />
                <View style={styles.flex}>
                  <Text style={styles.bookingRoute}>Trip #{booking.trip_id}</Text>
                  <Text style={styles.mutedSmall}>{booking.booking_ref}</Text>
                </View>
                <View style={styles.alignRight}>
                  <Text style={styles.price}>Rs. {booking.total_fare}</Text>
                  <Text style={styles.statusPill}>{booking.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.mutedSmall}>No bookings yet</Text>
          )}

          <Pressable style={styles.dangerButton} onPress={props.handleLogout} disabled={props.loading}>
            <Text style={styles.dangerText}>Log out</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.searchCard}>
            <Text style={styles.cardTitle}>Sign in to your account</Text>
            <Text style={styles.cardMeta}>Access your bookings and preferences</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={() => props.setTab('login' as any)}>
            <Text style={styles.primaryText}>Sign in</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollPad: { paddingBottom: 110 },
  profileHeader: { backgroundColor: colors.brandDark, padding: 18 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28 },
  profileName: { color: '#fff', fontSize: 20, fontWeight: '900' },
  profilePhone: { color: 'rgba(255,255,255,0.64)', marginTop: 4, fontSize: 12 },
  profileStats: { flexDirection: 'row', marginTop: 16, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' },
  statMini: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statMiniValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
  statMiniLabel: { color: 'rgba(255,255,255,0.56)', fontSize: 10 },
  searchCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.line },
  cardTitle: { fontSize: 14, fontWeight: '800', color: colors.text2, marginBottom: 4 },
  cardMeta: { fontSize: 12, color: colors.text3 },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  dangerButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16 },
  dangerText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  bookingItem: { marginHorizontal: 16, marginBottom: 10, backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 10 },
  bookingDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.brandMid },
  flex: { flex: 1 },
  bookingRoute: { fontSize: 14, fontWeight: '900', color: colors.text },
  mutedSmall: { fontSize: 11, color: colors.text3, marginTop: 2 },
  alignRight: { alignItems: 'flex-end' },
  price: { fontSize: 17, fontWeight: '900', color: colors.brand },
  statusPill: { overflow: 'hidden', borderRadius: 999, backgroundColor: colors.brandLight, color: colors.brand, fontSize: 10, paddingHorizontal: 8, paddingVertical: 4, fontWeight: '900', marginTop: 4 },
});
