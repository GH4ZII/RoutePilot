import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { authTheme } from '@/constants/authTheme';

export default function TabLayout() {
  const { user } = useAuth();
  const isDriver = user?.role === 'DRIVER';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: authTheme.primary,
        tabBarInactiveTintColor: authTheme.textMuted,
        tabBarStyle: {
          backgroundColor: authTheme.surface,
          borderTopColor: authTheme.border,
        },
        headerStyle: {
          backgroundColor: authTheme.surface,
        },
        headerTintColor: authTheme.text,
        headerTitleStyle: { fontWeight: '600' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: isDriver ? 'Hjem' : 'RoutePilot',
          headerTitle: isDriver ? 'Min rute' : 'RoutePilot',
          tabBarIcon: ({ color }) => (
            <Ionicons name="map-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          href: isDriver ? undefined : null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
