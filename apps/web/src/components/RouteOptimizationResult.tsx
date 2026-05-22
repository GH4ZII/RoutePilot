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
  vehicles?: Vehicle[]
  drivers?: Driver[]
  job?: OptimizationJob
  route?: OptimizationRouteResult
  routes?: OptimizationRouteResult[]
  routeDetail?: RouteDetail
}

function SingleRouteView({
  route,
  routeDetail,
  deliveries,
  vehicle,
  driver,
  vehicles,
  drivers,
}: {
  route: OptimizationRouteResult
  routeDetail?: RouteDetail
  deliveries: Delivery[]
  vehicle?: Vehicle
  driver?: Driver
  vehicles?: Vehicle[]
  drivers?: Driver[]
}) {
  const totalDistanceMeters =
    route.totalDistanceMeters ?? routeDetail?.totalDistanceMeters ?? 0
  const totalDurationSeconds =
    route.totalDurationSeconds ?? routeDetail?.totalDurationSeconds ?? 0
  const stops =
    route.stops ??
    routeDetail?.stops.map((s) => ({
      deliveryId: s.delivery.id,
      order: s.stopOrder,
      estimatedArrival: s.estimatedArrival,
    })) ??
    []

  const resolvedVehicle =
    vehicle ??
    vehicles?.find((v) => v.id === route.vehicleId) ??
    routeDetail?.vehicle ??
    undefined
  const resolvedDriver =
    driver ?? drivers?.find((d) => d.id === route.driverId)

  const deliveryById = new Map(deliveries.map((d) => [d.id, d]))

  return (
    <article className="route-result__single">
      <header className="route-result__single-header">
        <h3>
          {resolvedVehicle?.name ?? 'Kjøretøy'}
          {resolvedDriver ? ` · ${resolvedDriver.name}` : ''}
        </h3>
        <p className="page-muted route-result__mono">{route.routeId}</p>
      </header>

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
        {route.capacityUsedKg != null ? (
          <div>
            <dt>Kapasitet brukt</dt>
            <dd>{route.capacityUsedKg.toFixed(1)} kg</dd>
          </div>
        ) : null}
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
    </article>
  )
}

export default function RouteOptimizationResult({
  job,
  route,
  routes,
  routeDetail,
  deliveries,
  vehicle,
  driver,
  vehicles,
  drivers,
}: RouteOptimizationResultProps) {
  const plannedDate =
    job?.plannedDate ?? routeDetail?.plannedDate?.slice(0, 10) ?? '—'
  const allRoutes = routes ?? (route ? [route] : [])
  const unassigned = job?.result?.unassignedDeliveries ?? []
  const warnings = job?.result?.warnings ?? []

  return (
    <section className="route-result" aria-labelledby="route-result-title">
      <div className="route-result__header">
        <div>
          <h2 id="route-result-title">
            {allRoutes.length > 1
              ? `Optimaliserte ruter (${allRoutes.length})`
              : 'Optimalisert rute'}
          </h2>
          <p className="page-muted">Planlagt {plannedDate}</p>
        </div>
        <Link to="/map" className="btn-secondary">
          Vis på kart
        </Link>
      </div>

      {unassigned.length > 0 ? (
        <div className="route-result__alert" role="status">
          <strong>Ufordelte leveringer ({unassigned.length})</strong>
          <ul>
            {unassigned.map((id) => {
              const d = deliveries.find((x) => x.id === id)
              return (
                <li key={id}>
                  {d?.customerName ?? id}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <ul className="route-result__warnings">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

      <div className="route-result__routes">
        {allRoutes.map((r) => (
          <SingleRouteView
            key={r.routeId}
            route={r}
            routeDetail={routeDetail?.id === r.routeId ? routeDetail : undefined}
            deliveries={deliveries}
            vehicle={vehicle}
            driver={driver}
            vehicles={vehicles}
            drivers={drivers}
          />
        ))}
      </div>
    </section>
  )
}
