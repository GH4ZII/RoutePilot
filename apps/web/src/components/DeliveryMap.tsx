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
import { DELIVERY_MARKER_COLORS, DEPOT_MARKER_COLOR } from '../lib/map-colors'
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

type DeliveryMapProps = {
  deliveries: Delivery[]
  depots?: DepotPoint[]
  selectedDeliveryId?: string | null
  onSelectDelivery?: (delivery: Delivery | null) => void
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

export default function DeliveryMap({
  deliveries,
  depots = [],
  selectedDeliveryId,
  onSelectDelivery,
  className = '',
}: DeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const deliveryLayersRef = useRef<L.LayerGroup | null>(null)
  const depotLayersRef = useRef<L.LayerGroup | null>(null)
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

    deliveryLayersRef.current = L.layerGroup().addTo(map)
    depotLayersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      deliveryLayersRef.current = null
      depotLayersRef.current = null
      markerByIdRef.current.clear()
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const deliveryLayers = deliveryLayersRef.current
    const depotLayers = depotLayersRef.current
    if (!map || !deliveryLayers || !depotLayers) return

    deliveryLayers.clearLayers()
    depotLayers.clearLayers()
    markerByIdRef.current.clear()

    const boundsPoints: L.LatLngExpression[] = []

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

    for (const delivery of deliveries) {
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

    if (boundsPoints.length > 0) {
      const bounds = L.latLngBounds(boundsPoints)
      map.fitBounds(bounds.pad(0.12), { maxZoom: 14 })
    }
  }, [deliveries, depots, onSelectDelivery])

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
