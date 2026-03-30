ALTER TABLE request_service."ReliefRequest"
ADD COLUMN "addressLine" TEXT;

UPDATE request_service."ReliefRequest"
SET "addressLine" = CONCAT("city", ', ', "district")
WHERE "addressLine" IS NULL;

ALTER TABLE request_service."ReliefRequest"
ALTER COLUMN "addressLine" SET NOT NULL;

ALTER TABLE request_service."ReliefRequest"
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION,
ADD COLUMN "lastStatusUpdatedBy" TEXT;
