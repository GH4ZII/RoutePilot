export type MapPoint = {
  latitude: number
  longitude: number
}

const OSRM_BASE =
  import.meta.env.VITE_OSRM_BASE_URL?.replace(/\/$/, '') ??
  'https://router.project-osrm.org'

type OsrmRouteResponse = {
  code: string
  routes?: Array<{
    geometry?: {
      coordinates?: [number, number][]
    }
  }>
}

/** Driving route geometry along roads (GeoJSON coords → Leaflet [lat, lng]). */
export async function fetchDrivingRouteGeometry(
  points: MapPoint[],
): Promise<[number, number][]> {
  if (points.length < 2) {
    return points.map((p) => [p.latitude, p.longitude])
  }

  const path = points.map((p) => `${p.longitude},${p.latitude}`).join(';')
  const params = new URLSearchParams({
    overview: 'full',
    geometries: 'geojson',
  })

  const response = await fetch(
    `${OSRM_BASE}/route/v1/driving/${path}?${params}`,
    { headers: { Accept: 'application/json' } },
  )

  if (!response.ok) {
    return fallbackStraightLine(points)
  }

  const body = (await response.json()) as OsrmRouteResponse
  const coordinates = body.routes?.[0]?.geometry?.coordinates
  if (body.code !== 'Ok' || !coordinates?.length) {
    return fallbackStraightLine(points)
  }

  return coordinates.map(([lon, lat]) => [lat, lon])
}

function fallbackStraightLine(points: MapPoint[]): [number, number][] {
  return points.map((p) => [p.latitude, p.longitude])
}
