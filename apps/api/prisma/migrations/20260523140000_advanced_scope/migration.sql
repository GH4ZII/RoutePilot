-- Advanced scope: depots, driver locations, notifications, route summaries, route metrics

CREATE TYPE "NotificationChannel" AS ENUM ('SMS', 'EMAIL');
CREATE TYPE "NotificationType" AS ENUM ('ETA', 'DELIVERED', 'FAILED');
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TABLE "depots" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "depots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "driver_locations" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "heading" DECIMAL(6,2),
    "speed" DECIMAL(8,2),
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_locations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "route_summaries" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "model" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_summaries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "customer_notifications" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_notifications_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "vehicles" ADD COLUMN "depotId" TEXT;

ALTER TABLE "routes" ADD COLUMN "actualDistanceMeters" INTEGER,
ADD COLUMN "actualDurationSeconds" INTEGER;

CREATE UNIQUE INDEX "driver_locations_driverId_key" ON "driver_locations"("driverId");
CREATE INDEX "driver_locations_recordedAt_idx" ON "driver_locations"("recordedAt");
CREATE INDEX "depots_organizationId_idx" ON "depots"("organizationId");
CREATE UNIQUE INDEX "route_summaries_routeId_key" ON "route_summaries"("routeId");
CREATE INDEX "customer_notifications_organizationId_idx" ON "customer_notifications"("organizationId");
CREATE INDEX "customer_notifications_deliveryId_idx" ON "customer_notifications"("deliveryId");
CREATE INDEX "customer_notifications_status_idx" ON "customer_notifications"("status");
CREATE INDEX "customer_notifications_createdAt_idx" ON "customer_notifications"("createdAt");
CREATE INDEX "vehicles_depotId_idx" ON "vehicles"("depotId");

ALTER TABLE "depots" ADD CONSTRAINT "depots_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "driver_locations" ADD CONSTRAINT "driver_locations_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "route_summaries" ADD CONSTRAINT "route_summaries_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "customer_notifications" ADD CONSTRAINT "customer_notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "customer_notifications" ADD CONSTRAINT "customer_notifications_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_depotId_fkey" FOREIGN KEY ("depotId") REFERENCES "depots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
