-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DISPATCHER', 'DRIVER');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('AVAILABLE', 'ON_ROUTE', 'UNAVAILABLE', 'OFF_DUTY');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'DELIVERED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('PLANNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RouteStopStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "OptimizationJobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "OptimizationObjective" AS ENUM ('MINIMIZE_TOTAL_DISTANCE', 'MINIMIZE_TOTAL_TIME', 'BALANCE_WORKLOAD', 'PRIORITIZE_URGENT', 'MINIMIZE_LATE_DELIVERIES');

-- CreateEnum
CREATE TYPE "RouteEventType" AS ENUM ('ROUTE_STARTED', 'STOP_COMPLETED', 'STOP_FAILED', 'ROUTE_FINISHED', 'DRIVER_DELAYED');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "vehicleId" TEXT,
    "activeRouteId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "status" "DriverStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "maxWeightKg" DECIMAL(10,2) NOT NULL,
    "maxVolumeM3" DECIMAL(10,3) NOT NULL,
    "startLatitude" DECIMAL(10,7) NOT NULL,
    "startLongitude" DECIMAL(10,7) NOT NULL,
    "endLatitude" DECIMAL(10,7) NOT NULL,
    "endLongitude" DECIMAL(10,7) NOT NULL,
    "startLocation" geography(Point,4326),
    "endLocation" geography(Point,4326),
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "location" geography(Point,4326),
    "weightKg" DECIMAL(10,2) NOT NULL,
    "volumeM3" DECIMAL(10,3),
    "priority" "DeliveryPriority" NOT NULL DEFAULT 'NORMAL',
    "deadline" TIMESTAMP(3),
    "timeWindowStart" TIMESTAMP(3),
    "timeWindowEnd" TIMESTAMP(3),
    "notes" TEXT,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "driverId" TEXT,
    "vehicleId" TEXT,
    "status" "RouteStatus" NOT NULL DEFAULT 'PLANNED',
    "plannedDate" DATE NOT NULL,
    "totalDistanceMeters" INTEGER,
    "totalDurationSeconds" INTEGER,
    "capacityUsedKg" DECIMAL(10,2),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_stops" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "stopOrder" INTEGER NOT NULL,
    "estimatedArrival" TIMESTAMP(3),
    "actualArrival" TIMESTAMP(3),
    "status" "RouteStopStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proof_of_delivery" (
    "id" TEXT NOT NULL,
    "routeStopId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "signatureUrl" TEXT,
    "note" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "location" geography(Point,4326),
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proof_of_delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_events" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "type" "RouteEventType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "route_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optimization_jobs" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" "OptimizationJobStatus" NOT NULL DEFAULT 'PENDING',
    "objective" "OptimizationObjective" NOT NULL DEFAULT 'MINIMIZE_TOTAL_TIME',
    "plannedDate" DATE NOT NULL,
    "request" JSONB NOT NULL,
    "result" JSONB,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "optimization_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "users_organizationId_email_key" ON "users"("organizationId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_userId_key" ON "drivers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_activeRouteId_key" ON "drivers"("activeRouteId");

-- CreateIndex
CREATE INDEX "drivers_organizationId_idx" ON "drivers"("organizationId");

-- CreateIndex
CREATE INDEX "drivers_status_idx" ON "drivers"("status");

-- CreateIndex
CREATE INDEX "vehicles_organizationId_idx" ON "vehicles"("organizationId");

-- CreateIndex
CREATE INDEX "vehicles_status_idx" ON "vehicles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_organizationId_registrationNumber_key" ON "vehicles"("organizationId", "registrationNumber");

-- CreateIndex
CREATE INDEX "deliveries_organizationId_idx" ON "deliveries"("organizationId");

-- CreateIndex
CREATE INDEX "deliveries_status_idx" ON "deliveries"("status");

-- CreateIndex
CREATE INDEX "deliveries_deadline_idx" ON "deliveries"("deadline");

-- CreateIndex
CREATE INDEX "deliveries_priority_idx" ON "deliveries"("priority");

-- CreateIndex
CREATE INDEX "routes_organizationId_idx" ON "routes"("organizationId");

-- CreateIndex
CREATE INDEX "routes_driverId_idx" ON "routes"("driverId");

-- CreateIndex
CREATE INDEX "routes_status_idx" ON "routes"("status");

-- CreateIndex
CREATE INDEX "routes_plannedDate_idx" ON "routes"("plannedDate");

-- CreateIndex
CREATE INDEX "route_stops_routeId_idx" ON "route_stops"("routeId");

-- CreateIndex
CREATE INDEX "route_stops_deliveryId_idx" ON "route_stops"("deliveryId");

-- CreateIndex
CREATE UNIQUE INDEX "route_stops_routeId_deliveryId_key" ON "route_stops"("routeId", "deliveryId");

-- CreateIndex
CREATE UNIQUE INDEX "route_stops_routeId_stopOrder_key" ON "route_stops"("routeId", "stopOrder");

-- CreateIndex
CREATE UNIQUE INDEX "proof_of_delivery_routeStopId_key" ON "proof_of_delivery"("routeStopId");

-- CreateIndex
CREATE INDEX "route_events_routeId_idx" ON "route_events"("routeId");

-- CreateIndex
CREATE INDEX "route_events_type_idx" ON "route_events"("type");

-- CreateIndex
CREATE INDEX "optimization_jobs_organizationId_idx" ON "optimization_jobs"("organizationId");

-- CreateIndex
CREATE INDEX "optimization_jobs_status_idx" ON "optimization_jobs"("status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_activeRouteId_fkey" FOREIGN KEY ("activeRouteId") REFERENCES "routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliveries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proof_of_delivery" ADD CONSTRAINT "proof_of_delivery_routeStopId_fkey" FOREIGN KEY ("routeStopId") REFERENCES "route_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_events" ADD CONSTRAINT "route_events_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimization_jobs" ADD CONSTRAINT "optimization_jobs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
