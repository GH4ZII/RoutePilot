import { useEffect, useRef } from 'react'
import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import type { Delivery } from '../types/domain'
import {
  DELIVERY_PRIORITY_LABELS,
  DELIVERY_STATUS_LABELS,
} from '../lib/labels'
import {
  DELIVERY_MARKER_COLORS,
  DEPOT_MARKER_COLOR,
  DRIVER_MARKER_COLOR,
  ROUTE_LINE_COLOR,
} from '../lib/map-colors'
// Fix default marker icons when bundling with Vite
const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

export type DepotPoint = {
  id: string
  label: string
  address: string
  latitude: number
  longitude: number
}

export type RouteLine = {
  id: string
  positions: L.LatLngExpression[]
  color?: string
  label?: string
}

export type NumberedStop = {
  id: string
  stopOrder: number
  latitude: number
  longitude: number
  label?: string
  color?: string
}

export type DriverMarker = {
  id: string
  label: string
  latitude: number
  longitude: number
}

type DeliveryMapProps = {
  deliveries: Delivery[]
  depots?: DepotPoint[]
  driverMarkers?: DriverMarker[]
  routeLines?: RouteLine[]
  numberedStops?: NumberedStop[]
  selectedDeliveryId?: string | null
  onSelectDelivery?: (delivery: Delivery | null) => void
  /** Refit map bounds only when this value changes (e.g. selected route id). */
  fitBoundsKey?: string
  className?: string
}

function buildDeliveryPopup(delivery: Delivery): string {
  return `
    <div class="map-popup">
      <strong>${escapeHtml(delivery.customerName)}</strong>
      <p>${escapeHtml(delivery.address)}</p>
      <p><span class="map-popup-label">Status:</span> ${escapeHtml(DELIVERY_STATUS_LABELS[delivery.status])}</p>
      <p><span class="map-popup-label">Prioritet:</span> ${escapeHtml(DELIVERY_PRIORITY_LABELS[delivery.priority])}</p>
    </div>
  `
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function createNumberedIcon(order: number, color: string): L.DivIcon {
  return L.divIcon({
    className: 'numbered-stop-marker',
    html: `<span class="numbered-stop-marker__badge" style="background:${color}">${order}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

export default function DeliveryMap({
  deliveries,
  depots = [],
  driverMarkers = [],
  routeLines = [],
  numberedStops = [],
  selectedDeliveryId,
  onSelectDelivery,
  fitBoundsKey,
  className = '',
}: DeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const lastFitBoundsKeyRef = useRef<string | undefined>(undefined)
  const deliveryLayersRef = useRef<L.LayerGroup | null>(null)
  const depotLayersRef = useRef<L.LayerGroup | null>(null)
  const driverLayersRef = useRef<L.LayerGroup | null>(null)
  const routeLayersRef = useRef<L.LayerGroup | null>(null)
  const numberedLayersRef = useRef<L.LayerGroup | null>(null)
  const markerByIdRef = useRef<Map<string, L.CircleMarker>>(new Map())

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      scrollWheelZoom: true,
    }).setView([58.15, 7.99], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    routeLayersRef.current = L.layerGroup().addTo(map)
    numberedLayersRef.current = L.layerGroup().addTo(map)
    deliveryLayersRef.current = L.layerGroup().addTo(map)
    depotLayersRef.current = L.layerGroup().addTo(map)
    driverLayersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      routeLayersRef.current = null
      numberedLayersRef.current = null
      deliveryLayersRef.current = null
      depotLayersRef.current = null
      driverLayersRef.current = null
      markerByIdRef.current.clear()
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const deliveryLayers = deliveryLayersRef.current
    const depotLayers = depotLayersRef.current
    const driverLayers = driverLayersRef.current
    const routeLayers = routeLayersRef.current
    const numberedLayers = numberedLayersRef.current
    if (
      !map ||
      !deliveryLayers ||
      !depotLayers ||
      !driverLayers ||
      !routeLayers ||
      !numberedLayers
    ) {
      return
    }

    routeLayers.clearLayers()
    numberedLayers.clearLayers()
    deliveryLayers.clearLayers()
    depotLayers.clearLayers()
    driverLayers.clearLayers()
    markerByIdRef.current.clear()

    const boundsPoints: L.LatLngExpression[] = []

    for (const line of routeLines) {
      if (line.positions.length < 2) continue
      const polyline = L.polyline(line.positions, {
        color: line.color ?? ROUTE_LINE_COLOR,
        weight: 5,
        opacity: 0.85,
        lineJoin: 'round',
      })
      const lineTitle = line.label ? escapeHtml(line.label) : 'Rute'
      polyline.bindPopup(
        `<div class="map-popup"><strong>${lineTitle}</strong><p>Kjørerute langs vei</p></div>`,
      )
      routeLayers.addLayer(polyline)
      for (const pos of line.positions) {
        boundsPoints.push(pos)
      }
    }

    for (const depot of depots) {
      const marker = L.circleMarker([depot.latitude, depot.longitude], {
        radius: 10,
        fillColor: DEPOT_MARKER_COLOR,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.95,
      })
      marker.bindPopup(
        `<div class="map-popup"><strong>${escapeHtml(depot.label)}</strong><p>${escapeHtml(depot.address)}</p><p><span class="map-popup-label">Depot</span></p></div>`,
      )
      depotLayers.addLayer(marker)
      boundsPoints.push([depot.latitude, depot.longitude])
    }

    for (const driver of driverMarkers) {
      const marker = L.circleMarker([driver.latitude, driver.longitude], {
        radius: 11,
        fillColor: DRIVER_MARKER_COLOR,
        color: '#ffffff',
        weight: 3,
        fillOpacity: 1,
      })
      marker.bindPopup(
        `<div class="map-popup"><strong>${escapeHtml(driver.label)}</strong><p><span class="map-popup-label">Sjåfør (live)</span></p></div>`,
      )
      driverLayers.addLayer(marker)
      boundsPoints.push([driver.latitude, driver.longitude])
    }

    const numberedStopIds = new Set(numberedStops.map((stop) => stop.id))

    for (const stop of numberedStops) {
      const latLng: L.LatLngExpression = [stop.latitude, stop.longitude]
      boundsPoints.push(latLng)
      const color = stop.color ?? ROUTE_LINE_COLOR
      const marker = L.marker(latLng, {
        icon: createNumberedIcon(stop.stopOrder, color),
        zIndexOffset: 1000,
      })
      const title = stop.label
        ? `${stop.stopOrder}. ${escapeHtml(stop.label)}`
        : `Stopp ${stop.stopOrder}`
      marker.bindPopup(`<div class="map-popup"><strong>${title}</strong></div>`)
      const delivery = deliveries.find((d) => d.id === stop.id)
      if (delivery) {
        marker.on('click', () => {
          onSelectDelivery?.(delivery)
        })
        marker.on('popupopen', () => {
          onSelectDelivery?.(delivery)
        })
      }
      numberedLayers.addLayer(marker)
    }

    for (const delivery of deliveries) {
      if (numberedStopIds.has(delivery.id)) {
        continue
      }
      const latLng: L.LatLngExpression = [
        delivery.latitude,
        delivery.longitude,
      ]
      boundsPoints.push(latLng)

      const marker = L.circleMarker(latLng, {
        radius: 9,
        fillColor: DELIVERY_MARKER_COLORS[delivery.status],
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.95,
      })

      marker.bindPopup(buildDeliveryPopup(delivery))
      marker.on('click', () => {
        onSelectDelivery?.(delivery)
      })
      marker.on('popupopen', () => {
        onSelectDelivery?.(delivery)
      })

      deliveryLayers.addLayer(marker)
      markerByIdRef.current.set(delivery.id, marker)
    }

    if (
      fitBoundsKey != null &&
      fitBoundsKey !== lastFitBoundsKeyRef.current &&
      boundsPoints.length > 0
    ) {
      lastFitBoundsKeyRef.current = fitBoundsKey
      const bounds = L.latLngBounds(boundsPoints)
      map.fitBounds(bounds.pad(0.12), { maxZoom: 14 })
    }
  }, [
    deliveries,
    depots,
    driverMarkers,
    routeLines,
    numberedStops,
    onSelectDelivery,
    fitBoundsKey,
  ])

  useEffect(() => {
    for (const [id, marker] of markerByIdRef.current) {
      const selected = id === selectedDeliveryId
      marker.setStyle({
        radius: selected ? 12 : 9,
        weight: selected ? 3 : 2,
      })
      if (selected) {
        marker.openPopup()
      }
    }
  }, [selectedDeliveryId])

  return (
    <div
      ref={containerRef}
      className={`delivery-map ${className}`.trim()}
      role="application"
      aria-label="Kart over leveranser"
    />
  )
}
