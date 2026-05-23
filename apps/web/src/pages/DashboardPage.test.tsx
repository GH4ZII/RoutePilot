import { describe, expect, it } from 'vitest'
import { DASHBOARD_ALERT_LABELS } from '../lib/labels'
import type { DashboardSummary } from '../types/domain'

describe('Dashboard', () => {
  it('defines alert labels for the operations dashboard', () => {
    expect(DASHBOARD_ALERT_LABELS.DEADLINE_AT_RISK).toBeTruthy()
    expect(DASHBOARD_ALERT_LABELS.FAILED_DELIVERY).toBeTruthy()
  })

  it('summary metrics include delivery totals', () => {
    const summary: DashboardSummary = {
      date: '2026-05-20',
      metrics: {
        deliveries: {
          total: 5,
          pending: 1,
          assigned: 1,
          inProgress: 1,
          delivered: 1,
          failed: 1,
          cancelled: 0,
        },
        routes: { active: 0, plannedToday: 1, completedToday: 0 },
        delayedDeliveries: 0,
        averageRouteDurationSeconds: null,
        totalEstimatedDistanceMeters: 0,
        capacityUtilizationPercent: null,
      },
      alerts: [],
    }
    expect(summary.metrics.deliveries.total).toBe(5)
  })
})
