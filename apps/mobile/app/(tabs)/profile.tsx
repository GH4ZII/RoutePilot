import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import { authTheme } from '@/constants/authTheme';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Navn</Text>
        <Text style={styles.value}>{user.name ?? '—'}</Text>
        <Text style={[styles.label, styles.spaced]}>E-post</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={[styles.label, styles.spaced]}>Organisasjon</Text>
        <Text style={styles.value}>{user.organization.name}</Text>
      </View>
      <Text style={styles.hint}>Flere innstillinger kommer senere.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: authTheme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: authTheme.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radius,
    borderWidth: 1,
    borderColor: authTheme.border,
    padding: 16,
    marginBottom: 16,
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
  hint: {
    fontSize: 14,
    color: authTheme.textMuted,
  },
});
