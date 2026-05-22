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
import {
  normalizeOrganizationSlug,
  validateOrganizationSlug,
  validatePassword,
} from '@/lib/auth-validation';
import { authTheme } from '@/constants/authTheme';

export default function SignupScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState('');
  const [organizationSlug, setOrganizationSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup() {
    setError(null);

    const slugError = validateOrganizationSlug(organizationSlug);
    if (slugError) {
      setError(slugError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        organizationName,
        organizationSlug,
        email,
        password,
        ...(name.trim() ? { name: name.trim() } : {}),
      });
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registrering mislyktes. Prøv igjen.');
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
          <Text style={authStyles.subtitle}>Opprett konto og organisasjon</Text>

          <View style={authStyles.field}>
            <Text style={authStyles.label}>Organisasjonsnavn</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Min Bedrift AS"
              placeholderTextColor={authTheme.hint}
              value={organizationName}
              onChangeText={setOrganizationName}
              editable={!isSubmitting}
            />
          </View>

          <View style={authStyles.field}>
            <Text style={authStyles.label}>Organisasjon (slug)</Text>
            <Text style={authStyles.hint}>
              Kun små bokstaver, tall og bindestrek
            </Text>
            <TextInput
              style={authStyles.input}
              placeholder="min-bedrift"
              placeholderTextColor={authTheme.hint}
              value={organizationSlug}
              onChangeText={(value) =>
                setOrganizationSlug(normalizeOrganizationSlug(value))
              }
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
            <Text style={authStyles.hint}>Minst 8 tegn</Text>
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

          <View style={authStyles.field}>
            <Text style={authStyles.label}>Navn (valgfritt)</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Ola Nordmann"
              placeholderTextColor={authTheme.hint}
              value={name}
              onChangeText={setName}
              editable={!isSubmitting}
            />
          </View>

          {error ? <Text style={authStyles.error}>{error}</Text> : null}

          <Pressable
            style={authStyles.button}
            onPress={handleSignup}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>Opprett konto</Text>
            )}
          </Pressable>

          <Text style={authStyles.footer}>
            Har du allerede konto?{' '}
            <Link href="/login" style={authStyles.link}>
              Logg inn
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
