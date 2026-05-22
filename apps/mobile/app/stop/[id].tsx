import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { authTheme } from '@/constants/authTheme';
import * as api from '@/lib/api';
import { ApiError } from '@/lib/api';

export default function ProofOfDeliveryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function capturePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Kamera', 'Kameratilgang er nødvendig for leveringsbevis.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        const mime = asset.mimeType ?? 'image/jpeg';
        setPhotoUri(`data:${mime};base64,${asset.base64}`);
      } else {
        setPhotoUri(asset.uri);
      }
    }
  }

  async function submit() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      let latitude: number | undefined;
      let longitude: number | undefined;
      const locPerm = await Location.requestForegroundPermissionsAsync();
      if (locPerm.granted) {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      }

      await api.submitProofOfDelivery(id, {
        note: note.trim() || undefined,
        latitude,
        longitude,
        photoUrl: photoUri ?? undefined,
      });

      await queryClient.invalidateQueries({ queryKey: ['my-route-today'] });
      Alert.alert('Lagret', 'Leveringsbevis er registrert.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Kunne ikke lagre bevis');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Leveringsbevis' }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Ta bilde og registrer GPS-posisjon som dokumentasjon på leveringen.
        </Text>

        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.preview} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.placeholderText}>Ingen bilde ennå</Text>
          </View>
        )}

        <Pressable style={styles.btnSecondary} onPress={capturePhoto}>
          <Text style={styles.btnSecondaryText}>Ta bilde</Text>
        </Pressable>

        <Text style={styles.label}>Notat (valgfritt)</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Ekstra info om leveringen"
          placeholderTextColor={authTheme.textMuted}
          multiline
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.btnPrimary, busy && styles.btnDisabled]}
          disabled={busy}
          onPress={submit}>
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnPrimaryText}>Lagre leveringsbevis</Text>
          )}
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authTheme.background,
  },
  content: {
    padding: 24,
  },
  intro: {
    fontSize: 15,
    color: authTheme.textMuted,
    lineHeight: 22,
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: authTheme.radius,
    marginBottom: 12,
  },
  previewPlaceholder: {
    height: 160,
    borderRadius: authTheme.radius,
    borderWidth: 1,
    borderColor: authTheme.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    color: authTheme.textMuted,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: authTheme.text,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: authTheme.border,
    borderRadius: authTheme.radius,
    padding: 12,
    minHeight: 80,
    color: authTheme.text,
    backgroundColor: authTheme.surface,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: authTheme.primary,
    borderRadius: authTheme.radius,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: authTheme.border,
    borderRadius: authTheme.radius,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: authTheme.surface,
  },
  btnSecondaryText: {
    color: authTheme.text,
    fontSize: 15,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  error: {
    color: '#dc2626',
    marginBottom: 12,
  },
});
