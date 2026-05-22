import { useMemo, useState } from 'react'
import DeliveryMap, { type DepotPoint } from '../components/DeliveryMap'
import PageToolbar from '../components/PageToolbar'
import StatusBadge from '../components/StatusBadge'
import * as api from '../lib/api'
import { formatDateTime } from '../lib/format'
import {
  DELIVERY_PRIORITY_LABELS,
  DELIVERY_STATUS_LABELS,
  deliveryPriorityClass,
  deliveryStatusClass,
} from '../lib/labels'
import { useAsync } from '../lib/useAsync'
import type { Delivery, DeliveryStatus, Vehicle } from '../types/domain'

const STATUSES: DeliveryStatus[] = [
  'PENDING',
  'ASSIGNED',
  'IN_PROGRESS',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
]

function buildDepots(vehicles: Vehicle[]): DepotPoint[] {
  const seen = new Set<string>()
  const depots: DepotPoint[] = []

  for (const vehicle of vehicles) {
    const key = `${vehicle.startLatitude},${vehicle.startLongitude}`
    if (!seen.has(key)) {
      seen.add(key)
      depots.push({
        id: `start-${vehicle.id}`,
        label: vehicle.name,
        address: vehicle.startAddress,
        latitude: vehicle.startLatitude,
        longitude: vehicle.startLongitude,
      })
    }

    const endKey = `${vehicle.endLatitude},${vehicle.endLongitude}`
    if (endKey !== key && !seen.has(endKey)) {
      seen.add(endKey)
      depots.push({
        id: `end-${vehicle.id}`,
        label: `${vehicle.name} (retur)`,
        address: vehicle.endAddress,
        latitude: vehicle.endLatitude,
        longitude: vehicle.endLongitude,
      })
    }
  }

  return depots
}

export default function MapPage() {
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | ''>('')
  const [selected, setSelected] = useState<Delivery | null>(null)

  const {
    data: deliveries,
    error: deliveriesError,
    isLoading: deliveriesLoading,
  } = useAsync(
    () => api.listDeliveries(statusFilter || undefined),
    [statusFilter],
  )

  const { data: vehicles } = useAsync(() => api.listVehicles(), [])

  const depots = useMemo(
    () => (vehicles ? buildDepots(vehicles) : []),
    [vehicles],
  )

  const error = deliveriesError

  return (
    <div className="page-content map-page">
      <PageToolbar
        title="Kart"
        description="Leveranser og depot på kart. Klikk en markør for detaljer."
      />

      <div className="filter-bar map-page-filters">
        <label>
          Filtrer leveringsstatus
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as DeliveryStatus | '')
              setSelected(null)
            }}
          >
            <option value="">Alle</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {DELIVERY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <div className="map-legend">
          <span className="map-legend-item">
            <span
              className="map-legend-dot"
              style={{ background: '#7c3aed' }}
            />
            Depot
          </span>
          <span className="map-legend-item">
            <span
              className="map-legend-dot"
              style={{ background: '#64748b' }}
            />
            Leveranse
          </span>
        </div>
      </div>

      {error ? <p className="page-error" role="alert">{error}</p> : null}

      {deliveriesLoading ? (
        <p className="page-muted">Laster kartdata…</p>
      ) : (
        <div className="map-layout">
          <DeliveryMap
            className="map-layout-map"
            deliveries={deliveries ?? []}
            depots={depots}
            selectedDeliveryId={selected?.id ?? null}
            onSelectDelivery={setSelected}
          />

          <aside className="map-detail-panel" aria-label="Leveringsdetaljer">
            {selected ? (
              <>
                <h2>{selected.customerName}</h2>
                <p className="map-detail-address">{selected.address}</p>

                <dl className="map-detail-list">
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <StatusBadge
                        label={DELIVERY_STATUS_LABELS[selected.status]}
                        className={deliveryStatusClass(selected.status)}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt>Prioritet</dt>
                    <dd>
                      <StatusBadge
                        label={DELIVERY_PRIORITY_LABELS[selected.priority]}
                        className={deliveryPriorityClass(selected.priority)}
                      />
                    </dd>
                  </div>
                  {selected.phone ? (
                    <div>
                      <dt>Telefon</dt>
                      <dd>{selected.phone}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Vekt</dt>
                    <dd>{selected.weightKg} kg</dd>
                  </div>
                  {selected.volumeM3 != null ? (
                    <div>
                      <dt>Volum</dt>
                      <dd>{selected.volumeM3} m³</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Deadline</dt>
                    <dd>{formatDateTime(selected.deadline)}</dd>
                  </div>
                  {selected.notes ? (
                    <div>
                      <dt>Notater</dt>
                      <dd>{selected.notes}</dd>
                    </div>
                  ) : null}
                </dl>

                <button
                  type="button"
                  className="btn-secondary map-detail-close"
                  onClick={() => setSelected(null)}
                >
                  Lukk
                </button>
              </>
            ) : (
              <p className="page-muted map-detail-empty">
                Klikk en leveranse på kartet for å se detaljer her.
                {(deliveries?.length ?? 0) === 0
                  ? ' Ingen leveranser å vise med valgt filter.'
                  : null}
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
