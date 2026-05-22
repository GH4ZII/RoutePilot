import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';
import { authStyles } from '@/lib/auth-styles';
import { validatePassword } from '@/lib/auth-validation';
import { authTheme } from '@/constants/authTheme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [organizationSlug, setOrganizationSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ organizationSlug, email, password });
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Innlogging mislyktes. Prøv igjen.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={authStyles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={authStyles.page}
        keyboardShouldPersistTaps="handled">
        <View style={authStyles.card}>
          <Text style={authStyles.title}>RoutePilot</Text>
          <Text style={authStyles.subtitle}>Logg inn på organisasjonen din</Text>

          <View style={authStyles.field}>
            <Text style={authStyles.label}>Organisasjon (slug)</Text>
            <TextInput
              style={authStyles.input}
              placeholder="min-bedrift"
              placeholderTextColor={authTheme.hint}
              value={organizationSlug}
              onChangeText={setOrganizationSlug}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>

          <View style={authStyles.field}>
            <Text style={authStyles.label}>E-post</Text>
            <TextInput
              style={authStyles.input}
              placeholder="din@epost.no"
              placeholderTextColor={authTheme.hint}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>

          <View style={authStyles.field}>
            <Text style={authStyles.label}>Passord</Text>
            <TextInput
              style={authStyles.input}
              placeholder="••••••••"
              placeholderTextColor={authTheme.hint}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isSubmitting}
            />
          </View>

          {error ? <Text style={authStyles.error}>{error}</Text> : null}

          <Pressable
            style={authStyles.button}
            onPress={handleLogin}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>Logg inn</Text>
            )}
          </Pressable>

          <Text style={authStyles.footer}>
            Har du ikke konto?{' '}
            <Link href="/signup" style={authStyles.link}>
              Registrer deg
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
