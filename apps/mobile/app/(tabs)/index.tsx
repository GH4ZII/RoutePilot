import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import StaffWebNotice from '@/components/StaffWebNotice';
import { useAuth } from '@/context/AuthContext';
import { authTheme } from '@/constants/authTheme';

export default function HomeScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.role !== 'DRIVER') {
    return <StaffWebNotice />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Min rute</Text>
      <Text style={styles.subtitle}>
        Hei, {user.name ?? user.email}. Dagens rute vises her når ruter er
        tilgjengelige.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ingen aktiv rute</Text>
        <Text style={styles.cardText}>
          Planlegger tildeler ruter via webappen. Dra ned for å oppdatere når
          det er klart.
        </Text>
      </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: authTheme.textMuted,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radius,
    borderWidth: 1,
    borderColor: authTheme.border,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: authTheme.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: authTheme.textMuted,
    lineHeight: 20,
  },
});
