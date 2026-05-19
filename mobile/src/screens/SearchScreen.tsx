import React from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { SearchResult } from '../app';
import { formatBusType, formatDuration } from '../utils/formatters';

type Tab = 'home' | 'search' | 'seats' | 'ticket' | 'profile' | 'contribute' | 'login';

interface SearchScreenProps {
  origin: string;
  destination: string;
  tripDate: string;
  results: SearchResult[];
  selectBus: (result: SearchResult) => void;
  setTab: (tab: Tab) => void;
}

export function SearchScreen(props: SearchScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.resultsHeader}>
        <Pressable onPress={() => props.setTab('home')}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerRoute}>{props.origin} → {props.destination}</Text>
        <Text style={styles.headerMeta}>{props.tripDate} • {props.results.length} buses</Text>
        <View style={styles.filterRow}>
          {['All', 'Earliest', 'Cheapest', 'AC'].map((filter, i) => (
            <View key={filter} style={[styles.filterPill, i === 0 && styles.filterPillActive]}>
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{filter}</Text>
            </View>
          ))}
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.listPad}>
        {props.results.map(result => (
          <BusCard key={`${result.trip.id}-${result.bus.id}`} result={result} onPress={() => props.selectBus(result)} />
        ))}
      </ScrollView>
    </View>
  );
}

function BusCard({ result, onPress }: { result: SearchResult; onPress: () => void }) {
  const duration = formatDuration(result.route.estimated_minutes || 165);
  return (
    <View style={styles.busCard}>
      <View style={styles.busTop}>
        <View style={styles.flex}>
          <Text style={styles.busNo}>{result.bus.registration_no} • {formatBusType(result.bus.bus_type)}</Text>
          <Text style={styles.muted}>{result.bus.operator_name}</Text>
        </View>
        <View>
          <Text style={styles.price}>Rs. {result.fare}</Text>
          <Text style={styles.priceLabel}>per seat</Text>
        </View>
      </View>
      <View style={styles.seatsBadge}>
        <Text style={styles.seatsBadgeText}>{result.trip.available_seats} seats available</Text>
      </View>
      <View style={styles.timeRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{result.departure}</Text>
          <Text style={styles.mutedSmall}>{result.route.origin}</Text>
        </View>
        <View style={styles.durationLine}>
          <View style={styles.line} />
          <Text style={styles.mutedTiny}>{duration}</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{result.arrival}</Text>
          <Text style={styles.mutedSmall}>{result.route.destination}</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <Pressable style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Call</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Save</Text>
        </Pressable>
        <Pressable style={styles.bookAction} onPress={onPress}>
          <Text style={styles.bookActionText}>Choose seats</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  resultsHeader: { backgroundColor: colors.brand, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 16 },
  backText: { color: '#fff', fontWeight: '800', marginBottom: 10, fontSize: 14 },
  headerRoute: { fontSize: 18, color: '#fff', fontWeight: '900' },
  headerMeta: { fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 3 },
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  filterPill: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)', paddingHorizontal: 12, paddingVertical: 7 },
  filterPillActive: { backgroundColor: '#fff' },
  filterText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  filterTextActive: { color: colors.brand },
  listPad: { padding: 12, paddingBottom: 96 },
  busCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.line },
  busTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  flex: { flex: 1 },
  busNo: { fontSize: 15, fontWeight: '900', color: colors.text },
  muted: { fontSize: 12, color: colors.text3, marginTop: 3 },
  price: { fontSize: 17, fontWeight: '900', color: colors.brand },
  priceLabel: { fontSize: 10, color: colors.text3, textAlign: 'right' },
  seatsBadge: { alignSelf: 'flex-start', backgroundColor: colors.amberLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginTop: 10 },
  seatsBadgeText: { fontSize: 11, color: '#9A690B', fontWeight: '800' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  timeBlock: { flex: 1, alignItems: 'center' },
  timeText: { fontSize: 18, fontWeight: '900', color: colors.text },
  mutedSmall: { fontSize: 11, color: colors.text3, marginTop: 2 },
  mutedTiny: { fontSize: 10, color: colors.text3, marginTop: 2 },
  durationLine: { flex: 1.1, alignItems: 'center' },
  line: { height: 1, width: '100%', backgroundColor: colors.line, marginBottom: 5 },
  actionRow: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: colors.line, marginTop: 14, paddingTop: 12 },
  secondaryAction: { flex: 1, backgroundColor: colors.bg, borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  secondaryActionText: { fontSize: 12, color: colors.text2, fontWeight: '800' },
  bookAction: { flex: 1.8, backgroundColor: colors.brand, borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  bookActionText: { fontSize: 12, color: '#fff', fontWeight: '900' },
});
