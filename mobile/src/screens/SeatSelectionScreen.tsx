import React from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors } from '../styles/colors';
import { SearchResult } from '../app';

interface SeatSelectionScreenProps {
  activeResult: SearchResult;
  selectedSeats: string[];
  setSelectedSeats: (v: string[]) => void;
  totalFare: number;
  backToSearch: () => void;
  confirmSeats: () => void;
}

export function SeatSelectionScreen(props: SeatSelectionScreenProps) {
  const booked = new Set(['01', '02', '06', '10', '15', '16']);
  const toggleSeat = (seat: string) => {
    if (booked.has(seat)) return;
    props.setSelectedSeats(
      props.selectedSeats.includes(seat)
        ? props.selectedSeats.filter(s => s !== seat)
        : [...props.selectedSeats, seat]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollPad}>
      <View style={styles.seatHeader}>
        <Pressable onPress={props.backToSearch}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerRoute}>Select your seats</Text>
        <Text style={styles.headerMeta}>
          {props.activeResult.bus.registration_no} • {props.activeResult.route.origin} → {props.activeResult.route.destination}
        </Text>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.brandLight }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.brand }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EAF0EC' }]} />
          <Text style={styles.legendText}>Booked</Text>
        </View>
      </View>

      <View style={styles.busFrame}>
        <View style={styles.driverRow}>
          <Text style={styles.driverTag}>🚗 Driver</Text>
          <Text style={styles.doorTag}>🚪 Door</Text>
        </View>
        <View style={styles.seatGrid}>
          {Array.from({ length: 24 }).map((_, i) => {
            const seat = String(i + 1).padStart(2, '0');
            const selected = props.selectedSeats.includes(seat);
            const disabled = booked.has(seat);
            return (
              <Pressable
                key={seat}
                style={[styles.seat, selected && styles.seatSelected, disabled && styles.seatBooked]}
                onPress={() => toggleSeat(seat)}
              >
                <Text style={[styles.seatText, selected && styles.seatTextSelected, disabled && styles.seatTextBooked]}>
                  {seat}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Seats</Text>
          <Text style={styles.summaryValue}>{props.selectedSeats.join(', ') || 'None'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Per seat</Text>
          <Text style={styles.summaryValue}>Rs. {props.activeResult.fare}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryRowStrong]}>
          <Text style={[styles.summaryLabel, styles.summaryStrong]}>Total</Text>
          <Text style={[styles.summaryValue, styles.summaryStrong]}>Rs. {props.totalFare}</Text>
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={props.confirmSeats}>
        <Text style={styles.primaryText}>Continue to Booking →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollPad: { paddingBottom: 110 },
  seatHeader: { backgroundColor: colors.brandDark, padding: 18 },
  backText: { color: '#fff', fontWeight: '800', marginBottom: 10, fontSize: 14 },
  headerRoute: { fontSize: 18, color: '#fff', fontWeight: '900' },
  headerMeta: { fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 3 },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, paddingVertical: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 3, borderWidth: 1, borderColor: colors.line },
  legendText: { fontSize: 11, color: colors.text2, fontWeight: '700' },
  busFrame: { marginHorizontal: 16, backgroundColor: '#EDF2EF', borderRadius: 20, padding: 14, marginTop: 16 },
  driverRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  driverTag: { backgroundColor: '#fff', color: colors.text3, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, fontSize: 11 },
  doorTag: { backgroundColor: colors.brandLight, color: colors.brand, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, fontSize: 11, fontWeight: '800' },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  seat: { width: '21.8%', aspectRatio: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brandLight, borderWidth: 1, borderColor: colors.brandMid },
  seatSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
  seatBooked: { backgroundColor: '#EAF0EC', borderColor: colors.line },
  seatText: { fontSize: 12, fontWeight: '900', color: colors.brand },
  seatTextSelected: { color: '#fff' },
  seatTextBooked: { color: colors.text3 },
  summaryCard: { margin: 16, backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.line },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryRowStrong: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 2 },
  summaryLabel: { fontSize: 13, color: colors.text2 },
  summaryValue: { fontSize: 13, color: colors.brand, fontWeight: '900' },
  summaryStrong: { fontSize: 15, color: colors.text, fontWeight: '900' },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginBottom: 24 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
