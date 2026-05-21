# Logistics Optimization Platform

A fullstack logistics and route optimization platform for delivery companies, courier services, field workers, and businesses that need to plan efficient delivery routes across multiple drivers and vehicles.

The system allows an organization to register deliveries, vehicles, drivers, and delivery constraints. It then generates optimized routes based on distance, driving time, vehicle capacity, delivery deadlines, time windows, and priority.

---

## Project Goal

The goal of this project is to build a logistics platform that can answer questions such as:

* Which driver should handle each delivery?
* What is the most efficient route for each driver?
* Which deliveries are urgent or at risk of being late?
* How much distance and time can be saved by optimizing the route?
* How can a dispatcher monitor delivery progress during the day?

The platform should support a realistic logistics workflow where an admin/dispatcher plans routes on the web app, while drivers use a native mobile app (Expo) to complete deliveries.

---

## Core Concept

The system is based on the advanced version of route optimization, also known as the Vehicle Routing Problem with constraints.

Instead of only finding the shortest route for one driver, the system must handle:

* Multiple drivers
* Multiple vehicles
* Vehicle capacity limits
* Package size or weight
* Delivery deadlines
* Delivery time windows
* Delivery priority
* Driver availability
* Route status tracking
* Failed deliveries
* Proof of delivery

Example scenario:

> A company has 4 drivers, 4 vans, and 85 deliveries for today. Some packages must be delivered before 12:00, some vehicles have limited capacity, and some deliveries have higher priority. The system should automatically assign deliveries to drivers and generate efficient routes.

---

## Main Features

## 1. Authentication and Organization Setup

Users should be able to log in and belong to an organization/company.

### Roles

* Admin
* Dispatcher
* Driver

### Admin can:

* Manage company settings
* Add users
* Add drivers
* Add vehicles
* View all deliveries and routes

### Dispatcher can:

* Create deliveries
* Generate optimized routes
* Assign routes to drivers
* Monitor active deliveries

### Driver can:

* View assigned route
* Navigate through stops
* Mark deliveries as completed or failed
* Upload proof of delivery

---

## 2. Delivery Management

The system must allow users to create and manage deliveries.

Each delivery should include:

* Customer name
* Customer phone number
* Address
* Latitude and longitude
* Package weight
* Package volume or size
* Priority level
* Delivery deadline
* Optional time window
* Delivery notes
* Status

### Delivery statuses

* Pending
* Assigned
* In progress
* Delivered
* Failed
* Cancelled

### Example delivery

```json
{
  "customerName": "Ola Nordmann",
  "phone": "+47 999 99 999",
  "address": "Markens gate 10, Kristiansand",
  "latitude": 58.1467,
  "longitude": 7.9956,
  "weightKg": 8.5,
  "volumeM3": 0.04,
  "priority": "HIGH",
  "deadline": "2026-06-12T14:00:00",
  "timeWindowStart": "2026-06-12T10:00:00",
  "timeWindowEnd": "2026-06-12T14:00:00",
  "status": "PENDING"
}
```

---

## 3. Driver Management

The system should support multiple drivers.

Each driver should have:

* Name
* Phone number
* Email
* Availability status
* Assigned vehicle
* Active route

### Driver statuses

* Available
* On route
* Unavailable
* Off duty

---

## 4. Vehicle Management

The system should support different vehicles with different capacities.

Each vehicle should include:

* Vehicle name
* Registration number
* Max weight capacity
* Max volume capacity
* Start location / depot
* End location / depot
* Availability status

### Vehicle statuses

* Available
* In use
* Maintenance
* Unavailable

Example:

```json
{
  "name": "Van 01",
  "registrationNumber": "AB12345",
  "maxWeightKg": 750,
  "maxVolumeM3": 5.5,
  "startLatitude": 58.1599,
  "startLongitude": 8.0182,
  "endLatitude": 58.1599,
  "endLongitude": 8.0182,
  "status": "AVAILABLE"
}
```

---

## 5. Advanced Route Optimization

This is the most important part of the project.

The route optimization engine should generate routes based on realistic constraints.

### Optimization inputs

The algorithm should receive:

* List of pending deliveries
* List of available drivers
* List of available vehicles
* Depot/start location
* Distance matrix
* Travel time matrix
* Vehicle capacity limits
* Delivery deadlines
* Delivery time windows
* Delivery priority

### Optimization output

The algorithm should return:

* Routes per driver
* Ordered stops per route
* Estimated arrival time per stop
* Estimated route duration
* Estimated route distance
* Capacity usage per vehicle
* Late delivery warnings
* Unassigned deliveries if constraints cannot be satisfied

### Constraints to support

#### Multiple vehicles

The system must distribute deliveries across several vehicles, not just one route.

#### Vehicle capacity

A vehicle cannot be assigned more packages than it can carry.

Capacity can be based on:

* Total weight
* Total volume
* Number of packages

#### Time windows

Some deliveries may only be delivered within a specific time range.

Example:

> Deliver between 10:00 and 12:00.

The route optimizer must respect this when possible.

#### Deadlines

Some deliveries must be completed before a deadline.

Example:

> Deliver before 14:00.

#### Priority

High-priority deliveries should be preferred when the system has to make tradeoffs.

Example priority levels:

* Low
* Normal
* High
* Critical

#### Driver availability

Only available drivers should receive routes.

#### Vehicle availability

Only available vehicles should be used for route planning.

#### Start and end depot

Routes should normally start and end at a depot location.

Example:

> Driver starts at warehouse, completes deliveries, then returns to warehouse.

---

## 6. Distance and Travel Time Calculation

The system needs a way to calculate distance and travel time between delivery points.

Possible approach:

### Use a routing engine such as:

* OSRM
* OpenRouteService
* GraphHopper
* Google Maps Distance Matrix API

The routing service should generate a distance matrix and travel time matrix.

Example matrix:

```txt
Depot -> Delivery A = 8 min
Depot -> Delivery B = 14 min
Delivery A -> Delivery B = 6 min
Delivery B -> Delivery C = 11 min
```

The optimization engine uses this matrix to calculate efficient routes.

---

## 7. Map Interface

The frontend should include an interactive map.

The map should show:

* Depot location
* Delivery locations
* Driver routes
* Numbered route stops
* Route lines
* Delivery status markers
* Failed delivery markers
* Active driver position later

Recommended map libraries:

* Leaflet
* MapLibre GL
* OpenStreetMap tiles

### Map functionality

Users should be able to:

* View all deliveries
* Click a delivery marker to view details
* View optimized route per driver
* Toggle route visibility
* See route order visually
* See estimated arrival times

---

## 8. Route Planning Workflow

The route planning workflow should work like this:

1. Dispatcher creates or imports deliveries.
2. Dispatcher registers available drivers and vehicles.
3. Dispatcher clicks `Generate optimized routes`.
4. Backend builds distance and travel time matrix.
5. Optimization engine calculates best route plan.
6. System stores generated routes in the database.
7. Dispatcher reviews the result.
8. Dispatcher assigns routes to drivers.
9. Drivers complete deliveries through their interface.
10. Dispatcher monitors progress from dashboard.

---

## 9. Driver Interface

The driver interface is a dedicated **Expo mobile app** (`apps/mobile`) — simple, touch-first, and usable in the field.

Driver should see:

* Today's assigned route
* Next stop
* Address
* Customer phone number
* Delivery notes
* Estimated arrival time
* Package info
* Delivery status

Driver actions:

* Start route
* Open navigation
* Mark delivery as delivered
* Mark delivery as failed
* Upload photo proof
* Add delivery note
* Finish route

---

## 10. Proof of Delivery

For completed deliveries, the driver should be able to add proof.

Proof can include:

* Photo
* Signature
* Timestamp
* GPS location
* Driver note

This makes the system more realistic and business-oriented.

---

## 11. Real-Time Tracking and Updates

The dashboard should update when deliveries change status.

Possible implementation:

* WebSocket
* Server-Sent Events
* Supabase Realtime
* Polling for MVP

Real-time events:

* Route started
* Delivery completed
* Delivery failed
* Driver delayed
* Route finished

---

## 12. Dashboard

The dashboard should give the dispatcher an overview of the operation.

Dashboard metrics:

* Total deliveries today
* Pending deliveries
* Assigned deliveries
* Completed deliveries
* Failed deliveries
* Active routes
* Delayed deliveries
* Average route duration
* Total estimated distance
* Capacity utilization

The dashboard should also show warnings:

* Delivery deadline at risk
* Vehicle over capacity
* No available driver
* Route cannot satisfy all constraints
* Failed delivery needs follow-up

---

## 13. Reports and Analytics

The system should generate useful reports.

Possible reports:

* Daily delivery summary
* Driver performance
* Failed deliveries report
* Route efficiency report
* Distance saved by optimization
* Late deliveries report

Example metrics:

* Planned distance vs actual distance
* Planned duration vs actual duration
* Deliveries per driver
* Failed deliveries per day
* Average delay

---

## 14. Import Deliveries

To make the system realistic, users should be able to import deliveries from CSV.

Example CSV columns:

```csv
customer_name,phone,address,weight_kg,volume_m3,priority,deadline,time_window_start,time_window_end,notes
Ola Nordmann,+4799999999,Markens gate 10 Kristiansand,8.5,0.04,HIGH,2026-06-12 14:00,2026-06-12 10:00,2026-06-12 14:00,Leave at reception
```

The backend should:

* Validate the CSV
* Convert addresses to coordinates
* Store deliveries
* Report invalid rows

---

## 15. Address Geocoding

When a user enters an address, the system should convert it into latitude and longitude.

Possible services:

* Nominatim / OpenStreetMap
* Google Geocoding API
* Mapbox Geocoding API

The system should store both:

* Human-readable address
* Latitude and longitude

---

## 16. Tech Stack

### Web (dispatcher / admin)

* React
* TypeScript
* Vite
* Tailwind CSS
* Leaflet or MapLibre
* Recharts
* React Query

### Mobile (driver)

* Expo (React Native)
* TypeScript
* Expo Router
* React Query
* Expo Location (GPS for proof of delivery)
* Expo Image Picker / Camera (delivery photos)

### Backend

* NestJS with TypeScript


### Database

* PostgreSQL
* PostGIS extension for geospatial queries

### Optimization

* Google OR-Tools

Possible integration options:

* Run OR-Tools in a Python microservice
* Call Python optimizer from the backend
* Keep optimization as a separate service

Recommended architecture:

* Main backend: NestJS
* Optimization service: Python + FastAPI or simple worker service
* Database: PostgreSQL/PostGIS

### Queue / Background jobs

* Redis
* BullMQ

Useful for:

* Route optimization jobs
* CSV imports
* Geocoding many addresses
* Report generation

### Deployment

* Web: Vercel
* Mobile: Expo EAS Build → App Store / Google Play (or EAS Update for OTA)
* Backend: Railway, Fly.io, Render, or VPS
* Database: Supabase, Neon, Railway PostgreSQL, or managed Postgres
* Redis: Upstash or Railway Redis

---

## 17. Project Architecture

```txt
RoutePilot
│
├── Web App
│   └── React + TypeScript + Vite + Tailwind CSS
│       Used by admins and dispatchers
│
├── Mobile App
│   └── Expo + React Native + TypeScript
│       Used by drivers
│
├── Backend API
│   └── NestJS + TypeScript
│       Handles auth, roles, deliveries, vehicles, routes,        dashboard and reports
│
├── Optimization Service
│   └── Python + Google OR-Tools
│       Calculates optimized routes with constraints
│
├── Background Jobs
│   └── Redis + BullMQ, optional
│       Handles long-running jobs such as optimization, CSV import and geocoding
│
└── Database
    └── PostgreSQL + PostGIS
        Stores users, organizations, drivers, vehicles, deliveries, routes and geospatial data
```

---

## 18. Database Tables

Suggested tables:

* organizations
* users
* drivers
* vehicles
* deliveries
* routes
* route_stops
* proof_of_delivery
* route_events
* optimization_jobs

### organizations

Stores company information.

### users

Stores login users and their role.

### drivers

Stores driver profiles.

### vehicles

Stores vehicles and capacity information.

### deliveries

Stores delivery jobs.

### routes

Stores planned routes.

### route_stops

Stores the ordered stops for each route.

### proof_of_delivery

Stores delivery proof such as photo, signature, note, timestamp, and GPS position.

### route_events

Stores event log for route activity.

Examples:

* Route started
* Stop completed
* Stop failed
* Route finished

### optimization_jobs

Stores background optimization job status.

---

## 19. Example API Endpoints

### Auth

```txt
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Organizations

```txt
GET    /organizations/me
PATCH  /organizations/me
```

### Drivers

```txt
GET    /drivers
POST   /drivers
GET    /drivers/:id
PATCH  /drivers/:id
DELETE /drivers/:id
```

### Vehicles

```txt
GET    /vehicles
POST   /vehicles
GET    /vehicles/:id
PATCH  /vehicles/:id
DELETE /vehicles/:id
```

### Deliveries

```txt
GET    /deliveries
POST   /deliveries
POST   /deliveries/import-csv
GET    /deliveries/:id
PATCH  /deliveries/:id
DELETE /deliveries/:id
```

### Route Optimization

```txt
POST /optimization/jobs
GET  /optimization/jobs/:id
POST /optimization/jobs/:id/run
```

### Routes

```txt
GET   /routes
GET   /routes/:id
POST  /routes/:id/assign
POST  /routes/:id/start
POST  /routes/:id/finish
```

### Route Stops

```txt
POST /route-stops/:id/complete
POST /route-stops/:id/fail
POST /route-stops/:id/proof
```

### Dashboard

```txt
GET /dashboard/summary
GET /dashboard/routes/live
GET /dashboard/deliveries/status
```

### Reports

```txt
GET /reports/daily
GET /reports/driver-performance
GET /reports/route-efficiency
```

---

## 20. Optimization Job Example

Request:

```json
{
  "date": "2026-06-12",
  "depotId": "depot_123",
  "driverIds": ["driver_1", "driver_2", "driver_3"],
  "vehicleIds": ["vehicle_1", "vehicle_2", "vehicle_3"],
  "deliveryIds": ["delivery_1", "delivery_2", "delivery_3"],
  "objective": "MINIMIZE_TOTAL_TIME",
  "respectTimeWindows": true,
  "respectCapacity": true,
  "returnToDepot": true
}
```

Response:

```json
{
  "jobId": "job_123",
  "status": "COMPLETED",
  "routes": [
    {
      "driverId": "driver_1",
      "vehicleId": "vehicle_1",
      "totalDistanceMeters": 34200,
      "totalDurationSeconds": 5400,
      "capacityUsedKg": 320,
      "stops": [
        {
          "deliveryId": "delivery_1",
          "order": 1,
          "estimatedArrival": "2026-06-12T09:25:00"
        },
        {
          "deliveryId": "delivery_2",
          "order": 2,
          "estimatedArrival": "2026-06-12T10:05:00"
        }
      ]
    }
  ],
  "unassignedDeliveries": [],
  "warnings": []
}
```

---

## 21. Optimization Objectives

The system can support different optimization goals.

### Minimize total distance

Best when fuel cost is most important.

### Minimize total travel time

Best when fast delivery is most important.

### Balance workload

Tries to give drivers similar route lengths.

### Prioritize urgent deliveries

Makes sure high-priority or deadline-sensitive deliveries are handled first.

### Minimize late deliveries

Tries to reduce the number of deliveries that miss their time window.

---

## 22. MVP Scope

The first version should include:

* User authentication
* Organization workspace
* Admin/dispatcher/driver roles
* Driver CRUD
* Vehicle CRUD
* Delivery CRUD
* Address geocoding
* Map with delivery markers
* Route optimization for multiple vehicles
* Capacity constraints
* Time windows
* Route assignment
* Expo mobile app — driver route view
* Mark stop as delivered or failed (mobile)
* Dispatcher dashboard (web)

---

## 23. Advanced Scope

After MVP, add:

* CSV delivery import
* Proof of delivery with photo/signature
* Real-time updates
* Live driver location
* Route re-optimization during the day
* Customer notifications
* Reports and analytics
* PDF/CSV export
* Multi-depot routing
* Traffic-aware routing
* AI-generated route summary

---

## 24. Example User Stories

### Dispatcher

As a dispatcher, I want to create deliveries so that the system can plan routes for the day.

As a dispatcher, I want to generate optimized routes so that drivers spend less time on the road.

As a dispatcher, I want to see delayed deliveries so that I can react quickly.

As a dispatcher, I want to assign routes to drivers so that each driver knows what to do.

### Driver

As a driver, I want to see my route so that I know which deliveries to complete.

As a driver, I want to mark a delivery as completed so that the dispatcher can see progress.

As a driver, I want to report failed delivery attempts so that the company can follow up.

### Admin

As an admin, I want to manage users and roles so that employees only access relevant features.

As an admin, I want to manage vehicles so that route planning respects real capacity limits.

---

## 25. Development Phases

## Phase 1: Project Setup

* Set up web (`apps/web`)
* Set up mobile (`apps/mobile`, Expo + Expo Router)
* Set up backend (`apps/api`)
* Set up PostgreSQL database
* Set up authentication (shared across web and mobile)
* Set up basic layout and navigation (web: dispatcher/admin, mobile: driver)

## Phase 2: Core CRUD

* Organizations
* Users
* Drivers
* Vehicles
* Deliveries

## Phase 3: Map and Geocoding

* Add map view
* Add delivery markers
* Add address-to-coordinate conversion
* Store coordinates in database

## Phase 4: Basic Optimization

* Create distance matrix
* Implement simple optimization for multiple stops
* Generate route order
* Store routes and stops

## Phase 5: Advanced Optimization

* Multiple vehicles
* Vehicle capacity
* Time windows
* Deadlines
* Priority handling
* Unassigned delivery handling

## Phase 6: Driver Workflow (Expo `apps/mobile`)

* Driver route screens
* Start route
* Complete stop
* Fail stop
* Proof of delivery (photo, GPS)
* Finish route

## Phase 7: Dashboard

* Delivery status overview
* Active routes
* Delayed deliveries
* Route warnings
* Basic analytics

## Phase 8: Reports and Polish

* Daily summary
* Route efficiency report
* Better UI
* Error handling
* Deployment

---

## 26. Testing Strategy

The project should include both backend and frontend testing.

### Backend tests

* Auth tests
* Delivery validation tests
* Vehicle capacity tests
* Route generation tests
* Optimization constraint tests
* API endpoint tests

### Optimization tests

Test that:

* A vehicle is never assigned more than max capacity
* A delivery is not assigned twice
* Routes start at depot
* Routes return to depot when required
* Time windows are respected when possible
* High-priority deliveries are not ignored
* Unassignable deliveries are reported

### Web tests

* Login flow
* Delivery form validation
* Dashboard rendering
* Route map rendering

### Mobile tests

* Driver login
* Route and stop screens
* Complete / fail stop actions

---

## 27. Security Considerations

The system should include:

* Authentication
* Role-based access control
* Organization-based data isolation
* Input validation
* Secure file upload for proof of delivery
* Rate limiting for API endpoints
* Audit logs for important actions

Important rule:

Users from one organization must never access deliveries, drivers, vehicles, or routes from another organization.

---


## 28. Final Product Vision

The final product should feel like a lightweight version of a professional dispatch and logistics system.

A small company should be able to:

1. Add drivers and vehicles.
2. Import deliveries for the day.
3. Generate optimized routes.
4. Assign routes to drivers.
5. Track delivery progress.
6. Handle failed deliveries.
7. View reports after the route is finished.

The main technical challenge is the route optimization engine, especially when combining multiple vehicles, capacity constraints, deadlines, time windows, and priority.

The main product challenge is making the workflow simple enough for dispatchers and drivers to actually use.
