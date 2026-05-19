import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';
import { Input } from '../components/Input';
import { SectionTitle } from '../components/SectionTitle';

interface ContributeScreenProps {
  submitContribution: (data: Record<string, string>) => void;
  loading: boolean;
}

export function ContributeScreen(props: ContributeScreenProps) {
  const [type, setType] = useState<'new_route' | 'new_bus' | 'update_bus_info' | 'update_route_info'>('new_route');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmit = () => {
    props.submitContribution({
      type,
      description,
      contact_info: contactInfo,
    });
    setDescription('');
    setContactInfo('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollPad}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share your knowledge</Text>
        <Text style={styles.headerMeta}>Help us improve bus routes & schedules</Text>
      </View>

      <View style={styles.card}>
        <SectionTitle title="Contribution type" action="" />
        {(['new_route', 'new_bus', 'update_bus_info', 'update_route_info'] as const).map(t => (
          <Pressable
            key={t}
            style={[styles.typeOption, type === t && styles.typeOptionSelected]}
            onPress={() => setType(t)}
          >
            <View style={[styles.typeRadio, type === t && styles.typeRadioSelected]} />
            <View style={styles.flex}>
              <Text style={styles.typeLabel}>
                {t === 'new_route' && 'New Route'}
                {t === 'new_bus' && 'New Bus'}
                {t === 'update_bus_info' && 'Update Bus Info'}
                {t === 'update_route_info' && 'Update Route Info'}
              </Text>
              <Text style={styles.typeMeta}>
                {t === 'new_route' && 'Suggest a new travel route'}
                {t === 'new_bus' && 'Report a new bus or operator'}
                {t === 'update_bus_info' && 'Update existing bus information'}
                {t === 'update_route_info' && 'Update existing route information'}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Input
          label="Details"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the new route, bus, or update..."
          multiline
        />
        <Input
          label="Your contact (email/phone)"
          value={contactInfo}
          onChangeText={setContactInfo}
          placeholder="we might reach out for details"
        />
      </View>

      <Pressable style={styles.primaryButton} onPress={handleSubmit} disabled={props.loading}>
        {props.loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Submit contribution</Text>}
      </Pressable>

      <Text style={styles.footer}>💚 Every contribution helps 1M+ passengers find better journeys</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollPad: { paddingBottom: 110 },
  header: { backgroundColor: colors.brand, padding: 18 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerMeta: { fontSize: 12, color: 'rgba(255,255,255,0.64)', marginTop: 4 },
  card: { marginHorizontal: 16, marginTop: 16, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.line },
  typeOption: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  typeOptionSelected: { backgroundColor: colors.brandLight, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },
  typeRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.line, marginTop: 2 },
  typeRadioSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
  flex: { flex: 1 },
  typeLabel: { fontSize: 14, fontWeight: '900', color: colors.text },
  typeMeta: { fontSize: 11, color: colors.text3, marginTop: 2 },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  footer: { textAlign: 'center', fontSize: 12, color: colors.text3, marginHorizontal: 16, marginTop: 16 },
});
