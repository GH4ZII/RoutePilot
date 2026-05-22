import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Text as ThemedText } from '@/components/Themed';
import StaffWebNotice from '@/components/StaffWebNotice';
import { useAuth } from '@/context/AuthContext';
import { authTheme } from '@/constants/authTheme';
import * as api from '@/lib/api';
import { ApiError } from '@/lib/api';
import {
  formatDateTime,
  formatDuration,
  formatPlannedDate,
  formatWeight,
} from '@/lib/format';
import { mapsAppLabel, openRouteInMaps } from '@/lib/navigation';
import type { DriverRoute, RouteStop } from '@/types/routes';

const ROUTE_STATUS_LABELS: Record<string, string> = {
  PLANNED: 'Planlagt',
  ASSIGNED: 'Tildelt',
  IN_PROGRESS: 'Pågår',
  COMPLETED: 'Fullført',
  CANCELLED: 'Avbrutt',
};

function nextPendingStop(route: DriverRoute): RouteStop | undefined {
  return route.stops.find((s) => s.status === 'PENDING');
}

function allStopsHandled(route: DriverRoute): boolean {
  return route.stops.every(
    (s) => s.status === 'COMPLETED' || s.status === 'FAILED',
  );
}

const MY_ROUTES_QUERY_KEY = ['my-routes'] as const;

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failStopId, setFailStopId] = useState<string | null>(null);
  const [failReason, setFailReason] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const {
    data: routes = [],
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useQuery({
    queryKey: MY_ROUTES_QUERY_KEY,
    queryFn: () => api.getMyRoutes(),
    enabled: user?.role === 'DRIVER',
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (routes.length === 0) {
      setSelectedRouteId(null);
      return;
    }
    if (
      !selectedRouteId ||
      !routes.some((r) => r.id === selectedRouteId)
    ) {
      setSelectedRouteId(routes[0].id);
    }
  }, [routes, selectedRouteId]);

  const route = useMemo(
    () =>
      routes.find((r) => r.id === selectedRouteId) ?? routes[0] ?? undefined,
    [routes, selectedRouteId],
  );

  const nextStop = useMemo(() => (route ? nextPendingStop(route) : undefined), [route]);

  const patchRoutesCache = useCallback(
    (updated: DriverRoute) => {
      queryClient.setQueryData<DriverRoute[]>(MY_ROUTES_QUERY_KEY, (old) => {
        if (updated.status === 'COMPLETED') {
          return old?.filter((r) => r.id !== updated.id) ?? [];
        }
        return old?.map((r) => (r.id === updated.id ? updated : r)) ?? [updated];
      });
    },
    [queryClient],
  );

  const runAction = useCallback(
    async (fn: () => Promise<DriverRoute | null>) => {
      setActionError(null);
      setBusy(true);
      try {
        const updated = await fn();
        if (updated) {
          patchRoutesCache(updated);
        } else {
          await refetch();
        }
      } catch (err) {
        setActionError(err instanceof ApiError ? err.message : 'Handling feilet');
      } finally {
        setBusy(false);
      }
    },
    [patchRoutesCache, refetch],
  );

  if (!user) {
    return null;
  }

  if (user.role !== 'DRIVER') {
    return <StaffWebNotice />;
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={authTheme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          tintColor={authTheme.primary}
        />
      }>
      <ThemedText style={styles.title}>Mine ruter</ThemedText>
      <ThemedText style={styles.subtitle}>
        Hei, {user.name ?? user.email}. Viser dagens og kommende tildelte ruter.
      </ThemedText>

      {error ? (
        <Text style={styles.error}>
          {error instanceof ApiError ? error.message : 'Kunne ikke hente rute'}
        </Text>
      ) : null}
      {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

      {routes.length > 1 ? (
        <View style={styles.routePicker}>
          <Text style={styles.sectionLabel}>Velg rute</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.routePickerScroll}>
            {routes.map((r) => {
              const selected = r.id === route?.id;
              return (
                <Pressable
                  key={r.id}
                  style={[
                    styles.routeChip,
                    selected && styles.routeChipActive,
                  ]}
                  onPress={() => setSelectedRouteId(r.id)}>
                  <Text
                    style={[
                      styles.routeChipDate,
                      selected && styles.routeChipDateActive,
                    ]}>
                    {formatPlannedDate(r.plannedDate)}
                  </Text>
                  <Text
                    style={[
                      styles.routeChipStatus,
                      selected && styles.routeChipStatusActive,
                    ]}>
                    {ROUTE_STATUS_LABELS[r.status]} · {r.stops.length} stopp
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      {!route ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingen kommende ruter</Text>
          <Text style={styles.cardText}>
            Når planlegger har tildelt deg en rute (i dag eller fremover), vises
            den her. Dra ned for å oppdatere.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>
                {route.vehicle?.name ?? 'Rute'} · {route.stops.length} stopp
              </Text>
              <Text style={styles.badge}>{ROUTE_STATUS_LABELS[route.status]}</Text>
            </View>
            <Text style={styles.cardMeta}>
              Planlagt {formatPlannedDate(route.plannedDate)}
              {route.totalDurationSeconds
                ? ` · ca. ${formatDuration(route.totalDurationSeconds)}`
                : ''}
            </Text>
            {route.capacityUsedKg != null ? (
              <Text style={styles.cardMeta}>
                Last: {formatWeight(route.capacityUsedKg)}
              </Text>
            ) : null}
          </View>

          {route.stops.length > 0 ? (
            <Pressable
              style={[styles.btnSecondary, styles.btnRouteMaps]}
              disabled={busy}
              onPress={() => {
                openRouteInMaps(route).catch(() => {
                  setActionError(`Kunne ikke åpne ${mapsAppLabel()}`);
                });
              }}>
              <Text style={styles.btnSecondaryText}>
                Åpne hele ruten i {mapsAppLabel()} ({route.stops.length} stopp)
              </Text>
            </Pressable>
          ) : null}

          {(route.status === 'PLANNED' || route.status === 'ASSIGNED') && (
            <Pressable
              style={[styles.btnPrimary, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={() =>
                runAction(() => api.startRoute(route.id))
              }>
              <Text style={styles.btnPrimaryText}>Start rute</Text>
            </Pressable>
          )}

          {route.status === 'IN_PROGRESS' && nextStop ? (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Neste stopp</Text>
              <Text style={styles.stopTitle}>
                {nextStop.stopOrder}. {nextStop.delivery.customerName}
              </Text>
              <Text style={styles.stopAddress}>{nextStop.delivery.address}</Text>
              {nextStop.delivery.phone ? (
                <Text style={styles.stopMeta}>Tlf: {nextStop.delivery.phone}</Text>
              ) : null}
              {nextStop.delivery.notes ? (
                <Text style={styles.stopNotes}>{nextStop.delivery.notes}</Text>
              ) : null}
              <Text style={styles.stopMeta}>
                {formatWeight(nextStop.delivery.weightKg)}
                {nextStop.delivery.volumeM3 != null
                  ? ` · ${nextStop.delivery.volumeM3} m³`
                  : ''}
              </Text>
              <Text style={styles.stopMeta}>
                ETA {formatDateTime(nextStop.estimatedArrival)}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  style={styles.btnSecondary}
                  disabled={busy}
                  onPress={() => {
                    openRouteInMaps(route).catch(() => {
                      setActionError(`Kunne ikke åpne ${mapsAppLabel()}`);
                    });
                  }}>
                  <Text style={styles.btnSecondaryText}>
                    Navigasjon ({mapsAppLabel()})
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.btnPrimary, busy && styles.btnDisabled]}
                  disabled={busy}
                  onPress={() =>
                    runAction(async () => {
                      const updated = await api.completeRouteStop(nextStop.id);
                      Alert.alert(
                        'Levert',
                        'Vil du registrere leveringsbevis (foto/GPS)?',
                        [
                          { text: 'Hopp over', style: 'cancel' },
                          {
                            text: 'Ja',
                            onPress: () =>
                              router.push(
                                `/stop/${nextStop.id}` as Href,
                              ),
                          },
                        ],
                      );
                      return updated;
                    })
                  }>
                  <Text style={styles.btnPrimaryText}>Levert</Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.btnDangerOutline}
                disabled={busy}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Alert.prompt(
                      'Mislykket levering',
                      'Valgfri årsak',
                      async (reason) => {
                        await runAction(() =>
                          api.failRouteStop(nextStop.id, reason ?? undefined),
                        );
                      },
                    );
                  } else {
                    setFailReason('');
                    setFailStopId(nextStop.id);
                  }
                }}>
                <Text style={styles.btnDangerText}>Kunne ikke levere</Text>
              </Pressable>
            </View>
          ) : null}

          {route.status === 'IN_PROGRESS' && !nextStop && allStopsHandled(route) ? (
            <Pressable
              style={[styles.btnPrimary, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={() =>
                runAction(async () => {
                  await api.finishRoute(route.id);
                  await queryClient.invalidateQueries({
                    queryKey: MY_ROUTES_QUERY_KEY,
                  });
                  return null;
                })
              }>
              <Text style={styles.btnPrimaryText}>Fullfør rute</Text>
            </Pressable>
          ) : null}

          {route.status === 'IN_PROGRESS' && !nextStop && !allStopsHandled(route) ? (
            <Text style={styles.cardText}>Ingen ventende stopp.</Text>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Alle stopp</Text>
            {route.stops.map((stop) => (
              <View key={stop.id} style={styles.stopRow}>
                <Text style={styles.stopRowOrder}>{stop.stopOrder}</Text>
                <View style={styles.stopRowBody}>
                  <Text style={styles.stopRowName}>{stop.delivery.customerName}</Text>
                  <Text style={styles.stopRowStatus}>{stop.status}</Text>
                </View>
                {stop.status === 'COMPLETED' ? (
                  <Pressable
                    onPress={() =>
                      router.push(`/stop/${stop.id}` as Href)
                    }>
                    <Text style={styles.link}>Bevis</Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        </>
      )}
      <Modal
        visible={failStopId != null}
        transparent
        animationType="fade"
        onRequestClose={() => setFailStopId(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mislykket levering</Text>
            <TextInput
              style={styles.modalInput}
              value={failReason}
              onChangeText={setFailReason}
              placeholder="Valgfri årsak"
              placeholderTextColor={authTheme.textMuted}
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.btnSecondary}
                onPress={() => setFailStopId(null)}>
                <Text style={styles.btnSecondaryText}>Avbryt</Text>
              </Pressable>
              <Pressable
                style={styles.btnDangerSolid}
                disabled={busy}
                onPress={async () => {
                  const id = failStopId;
                  setFailStopId(null);
                  if (id) {
                    await runAction(() =>
                      api.failRouteStop(id, failReason.trim() || undefined),
                    );
                  }
                }}>
                <Text style={styles.btnPrimaryText}>Registrer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authTheme.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: authTheme.text,
    flex: 1,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    color: authTheme.primary,
    backgroundColor: `${authTheme.primary}18`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardMeta: {
    fontSize: 13,
    color: authTheme.textMuted,
    marginTop: 6,
  },
  cardText: {
    fontSize: 14,
    color: authTheme.textMuted,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: authTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  stopTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: authTheme.text,
    marginBottom: 4,
  },
  stopAddress: {
    fontSize: 15,
    color: authTheme.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  stopMeta: {
    fontSize: 13,
    color: authTheme.textMuted,
    marginBottom: 4,
  },
  stopNotes: {
    fontSize: 14,
    color: authTheme.text,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 10,
  },
  btnPrimary: {
    backgroundColor: authTheme.primary,
    borderRadius: authTheme.radius,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: authTheme.border,
    borderRadius: authTheme.radius,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: authTheme.surface,
  },
  btnRouteMaps: {
    flex: undefined,
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  btnSecondaryText: {
    color: authTheme.text,
    fontSize: 15,
    fontWeight: '600',
  },
  btnDangerOutline: {
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: authTheme.radius,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnDangerText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  error: {
    color: '#dc2626',
    marginBottom: 12,
    fontSize: 14,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: authTheme.border,
    gap: 10,
  },
  stopRowOrder: {
    width: 28,
    fontWeight: '700',
    color: authTheme.primary,
    fontSize: 16,
  },
  stopRowBody: {
    flex: 1,
  },
  stopRowName: {
    fontSize: 15,
    color: authTheme.text,
    fontWeight: '500',
  },
  stopRowStatus: {
    fontSize: 12,
    color: authTheme.textMuted,
    marginTop: 2,
  },
  link: {
    color: authTheme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  routePicker: {
    marginBottom: 16,
  },
  routePickerScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  routeChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: authTheme.radius,
    borderWidth: 1,
    borderColor: authTheme.border,
    backgroundColor: authTheme.surface,
    minWidth: 140,
  },
  routeChipActive: {
    borderColor: authTheme.primary,
    backgroundColor: `${authTheme.primary}14`,
  },
  routeChipDate: {
    fontSize: 15,
    fontWeight: '700',
    color: authTheme.text,
  },
  routeChipDateActive: {
    color: authTheme.primary,
  },
  routeChipStatus: {
    fontSize: 12,
    color: authTheme.textMuted,
    marginTop: 4,
  },
  routeChipStatusActive: {
    color: authTheme.text,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: authTheme.surface,
    borderRadius: authTheme.radius,
    padding: 20,
    borderWidth: 1,
    borderColor: authTheme.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: authTheme.text,
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: authTheme.border,
    borderRadius: authTheme.radius,
    padding: 12,
    minHeight: 72,
    color: authTheme.text,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnDangerSolid: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: authTheme.radius,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
