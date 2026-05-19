import React from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors } from '../styles/colors';

interface LoginScreenProps {
  loginUsername: string;
  loginPassword: string;
  setLoginUsername: (v: string) => void;
  setLoginPassword: (v: string) => void;
  handleLogin: () => void;
  loginLoading: boolean;
  onBack?: () => void;
}

export function LoginScreen(props: LoginScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollPad}>
      <View style={styles.loginHeader}>
        <Text style={styles.logo}>Bus<Text style={{ color: colors.amber }}>Mate</Text></Text>
        <Text style={styles.loginTitle}>Sign In</Text>
        <Text style={styles.loginMeta}>Access your bookings and preferences</Text>
      </View>

      <View style={styles.searchCard}>
        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            value={props.loginUsername}
            onChangeText={props.setLoginUsername}
            placeholderTextColor={colors.text3}
            style={styles.input}
            placeholder="demo"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            value={props.loginPassword}
            onChangeText={props.setLoginPassword}
            secureTextEntry
            placeholderTextColor={colors.text3}
            style={styles.input}
            placeholder="password"
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={props.handleLogin}>
          {props.loginLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Sign in</Text>}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Demo credentials: demo / password</Text>
        <Text style={styles.footerText}>Contact support to create new account</Text>
      </View>

      {props.onBack && (
        <Pressable onPress={props.onBack} style={styles.backLink}>
          <Text style={styles.backText}>← Back to home</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollPad: { paddingBottom: 110 },
  loginHeader: { backgroundColor: colors.brandDark, paddingHorizontal: 16, paddingTop: 40, paddingBottom: 24, alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: '800', color: '#fff' },
  loginTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 12 },
  loginMeta: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  searchCard: { margin: 16, marginTop: -14, backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.line },
  inputWrap: { marginBottom: 10 },
  inputLabel: { fontSize: 11, color: colors.text3, marginBottom: 5, fontWeight: '700' },
  input: { minHeight: 44, borderRadius: 10, backgroundColor: colors.bg, paddingHorizontal: 12, color: colors.text, fontWeight: '600', borderWidth: 1, borderColor: colors.line },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  footer: { paddingHorizontal: 16, marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 12, color: colors.text3, marginBottom: 6 },
  backLink: { paddingHorizontal: 16, paddingVertical: 16 },
  backText: { color: colors.brand, fontWeight: '800', fontSize: 14 },
});
