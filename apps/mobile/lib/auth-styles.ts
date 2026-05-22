import { Platform, StyleSheet } from 'react-native';

import { authTheme } from '@/constants/authTheme';

export const authStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: authTheme.background,
    padding: 24,
  },
  card: {
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radius,
    borderWidth: 1,
    borderColor: authTheme.border,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: authTheme.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: authTheme.text,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    color: authTheme.textMuted,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: authTheme.text,
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: authTheme.textMuted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: authTheme.border,
    borderRadius: authTheme.inputRadius,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    color: authTheme.text,
    backgroundColor: authTheme.surface,
  },
  field: {
    marginBottom: 4,
  },
  error: {
    color: authTheme.errorText,
    backgroundColor: authTheme.errorBackground,
    borderWidth: 1,
    borderColor: authTheme.errorBorder,
    borderRadius: authTheme.inputRadius,
    padding: 10,
    marginBottom: 14,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    borderRadius: authTheme.inputRadius,
    padding: 14,
    alignItems: 'center',
    backgroundColor: authTheme.primary,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: authTheme.textMuted,
  },
  link: {
    color: authTheme.primary,
    fontWeight: '600',
  },
});
