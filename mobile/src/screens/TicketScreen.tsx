import React from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';
import { SearchResult } from '../app';

interface TicketScreenProps {
  activeResult: SearchResult;
  selectedSeats: string[];
  totalFare: number;
  bookingRef: string;
  createBooking: () => void;
  loading: boolean;
  backToSeats: () => void;
}

export function TicketScreen(props: TicketScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollPad}>
      <View style={styles.seatHeader}>
        <Pressable onPress={props.backToSeats}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerRoute}>Confirm booking</Text>
      </View>

      <View style={styles.ticketCard}>
        <View style={styles.ticketTop}>
          <View>
            <Text style={styles.ticketCity}>{props.activeResult.route.origin}</Text>
            <Text style={styles.mutedTiny}>{props.activeResult.route.province_origin}</Text>
          </View>
          <Text style={styles.ticketIcon}>✈️</Text>
          <View style={styles.alignRight}>
            <Text style={styles.ticketCity}>{props.activeResult.route.destination}</Text>
            <Text style={styles.mutedTiny}>{props.activeResult.route.province_destination}</Text>
          </View>
        </View>
        <View style={styles.ticketDetails}>
          <SummaryRow label="Bus" value={props.activeResult.bus.registration_no} />
          <SummaryRow label="Operator" value={props.activeResult.bus.operator_name} />
          <SummaryRow label="Time" value={`${props.activeResult.departure} - ${props.activeResult.arrival}`} />
          <SummaryRow label="Seats" value={props.selectedSeats.join(', ')} />
          <SummaryRow label="Total" value={`Rs. ${props.totalFare}`} strong />
        </View>
      </View>

      <View style={styles.qrRow}>
        <View style={styles.qrBox}>
          {Array.from({ length: 25 }).map((_, i) => (
            <View key={i} style={[styles.qrCell, i % 3 === 0 && styles.qrCellOff]} />
          ))}
        </View>
        <Text style={styles.qrText}>QR generated on booking</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={props.createBooking} disabled={props.loading}>
        {props.loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Complete booking</Text>}
      </Pressable>
    </ScrollView>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={[styles.summaryRow, strong && styles.summaryRowStrong]}>
      <Text style={[styles.summaryLabel, strong && styles.summaryStrong]}>{label}</Text>
      <Text style={[styles.summaryValue, strong && styles.summaryStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollPad: { paddingBottom: 110 },
  seatHeader: { backgroundColor: colors.brandDark, padding: 18 },
  backText: { color: '#fff', fontWeight: '800', marginBottom: 10, fontSize: 14 },
  headerRoute: { fontSize: 18, color: '#fff', fontWeight: '900' },
  ticketCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: colors.surface, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  ticketTop: { backgroundColor: colors.brandLight, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ticketCity: { fontSize: 18, color: colors.brandDark, fontWeight: '900' },
  ticketIcon: { fontSize: 24 },
  mutedTiny: { fontSize: 10, color: colors.text3, marginTop: 2 },
  alignRight: { alignItems: 'flex-end' },
  ticketDetails: { padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryRowStrong: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 2 },
  summaryLabel: { fontSize: 13, color: colors.text2 },
  summaryValue: { fontSize: 13, color: colors.brand, fontWeight: '900' },
  summaryStrong: { fontSize: 15, color: colors.text, fontWeight: '900' },
  qrRow: { margin: 16, marginTop: 0, backgroundColor: colors.bg, borderRadius: 14, padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  qrBox: { width: 64, height: 64, backgroundColor: '#fff', borderRadius: 8, padding: 5, flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  qrCell: { width: 8, height: 8, backgroundColor: colors.text, borderRadius: 1 },
  qrCellOff: { backgroundColor: 'transparent' },
  qrText: { flex: 1, color: colors.text2, fontSize: 12, lineHeight: 18 },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginBottom: 24 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
