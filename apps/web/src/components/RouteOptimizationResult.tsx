import { Link } from 'react-router-dom'
import { formatDateTime, formatDistance, formatDuration } from '../lib/format'
import type {
  Delivery,
  Driver,
  OptimizationJob,
  OptimizationRouteResult,
  RouteDetail,
  Vehicle,
} from '../types/domain'

type RouteOptimizationResultProps = {
  deliveries: Delivery[]
  vehicle?: Vehicle
  driver?: Driver
  /** From optimization job flow */
  job?: OptimizationJob
  route?: OptimizationRouteResult
  /** From GET /routes */
  routeDetail?: RouteDetail
}

export default function RouteOptimizationResult({
  job,
  route,
  routeDetail,
  deliveries,
  vehicle,
  driver,
}: RouteOptimizationResultProps) {
  const plannedDate =
    job?.plannedDate ?? routeDetail?.plannedDate?.slice(0, 10) ?? '—'
  const routeId = route?.routeId ?? routeDetail?.id ?? '—'
  const totalDistanceMeters =
    route?.totalDistanceMeters ?? routeDetail?.totalDistanceMeters ?? 0
  const totalDurationSeconds =
    route?.totalDurationSeconds ?? routeDetail?.totalDurationSeconds ?? 0
  const stops =
    route?.stops ??
    routeDetail?.stops.map((s) => ({
      deliveryId: s.delivery.id,
      order: s.stopOrder,
      estimatedArrival: s.estimatedArrival,
    })) ??
    []

  const deliveryById = new Map(deliveries.map((d) => [d.id, d]))

  return (
    <section className="route-result" aria-labelledby="route-result-title">
      <div className="route-result__header">
        <div>
          <h2 id="route-result-title">Optimalisert rute</h2>
          <p className="page-muted">
            Planlagt {plannedDate}
            {vehicle?.name ?? routeDetail?.vehicle?.name
              ? ` · ${vehicle?.name ?? routeDetail?.vehicle?.name}`
              : ''}
            {driver ? ` · ${driver.name}` : ''}
          </p>
        </div>
        <Link to="/map" className="btn-secondary">
          Vis på kart
        </Link>
      </div>

      <dl className="route-result__stats">
        <div>
          <dt>Total distanse</dt>
          <dd>
            {totalDistanceMeters > 0
              ? formatDistance(totalDistanceMeters)
              : '—'}
          </dd>
        </div>
        <div>
          <dt>Estimert kjøretid</dt>
          <dd>
            {totalDurationSeconds > 0
              ? formatDuration(totalDurationSeconds)
              : '—'}
          </dd>
        </div>
        <div>
          <dt>Stopp</dt>
          <dd>{stops.length}</dd>
        </div>
        <div>
          <dt>Rute-ID</dt>
          <dd className="route-result__mono">{routeId}</dd>
        </div>
      </dl>

      <ol className="route-stops-list">
        {stops.map((stop) => {
          const delivery = deliveryById.get(stop.deliveryId)
          return (
            <li key={stop.deliveryId} className="route-stops-list__item">
              <span className="route-stops-list__order">{stop.order}</span>
              <div className="route-stops-list__body">
                <strong>{delivery?.customerName ?? stop.deliveryId}</strong>
                <span className="route-stops-list__address">
                  {delivery?.address ?? 'Ukjent adresse'}
                </span>
                <span className="route-stops-list__eta">
                  ETA {formatDateTime(stop.estimatedArrival)}
                </span>
              </div>
            </li>
          )
        })}
      </ol>

      {job?.result?.warnings?.length ? (
        <p className="field-hint">{job.result.warnings.join(' ')}</p>
      ) : null}
    </section>
  )
}
