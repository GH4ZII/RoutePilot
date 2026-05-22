import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import { authTheme } from '@/constants/authTheme';

export default function StaffWebNotice() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bruk webappen</Text>
      <Text style={styles.subtitle}>
        Admin og planlegger bruker RoutePilot i nettleseren. Logg inn på samme
        organisasjon der.
      </Text>
      {user ? (
        <View style={styles.card}>
          <Text style={styles.label}>Innlogget som</Text>
          <Text style={styles.value}>{user.name ?? user.email}</Text>
          <Text style={[styles.label, styles.spaced]}>Rolle</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      ) : null}
      <Pressable style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Logg ut</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: authTheme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: authTheme.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: authTheme.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radius,
    borderWidth: 1,
    borderColor: authTheme.border,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: authTheme.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: authTheme.text,
  },
  spaced: {
    marginTop: 12,
  },
  button: {
    backgroundColor: authTheme.primary,
    borderRadius: authTheme.inputRadius,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
