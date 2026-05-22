-- Add human-readable depot addresses on vehicles (coordinates still used for routing).
ALTER TABLE "vehicles" ADD COLUMN "startAddress" TEXT;
ALTER TABLE "vehicles" ADD COLUMN "endAddress" TEXT;

UPDATE "vehicles"
SET
  "startAddress" = COALESCE("startAddress", 'Ukjent depotadresse'),
  "endAddress" = COALESCE("endAddress", 'Ukjent depotadresse')
WHERE "startAddress" IS NULL OR "endAddress" IS NULL;

ALTER TABLE "vehicles" ALTER COLUMN "startAddress" SET NOT NULL;
ALTER TABLE "vehicles" ALTER COLUMN "endAddress" SET NOT NULL;
