-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('terminal', 'custom');

-- CreateEnum
CREATE TYPE "TriderStatus" AS ENUM ('offline', 'online', 'busy');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('pending', 'accepted', 'picked_up', 'completed', 'cancelled', 'waiting_for_trider');

-- CreateTable
CREATE TABLE "Toda" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Toda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "toda_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trider" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "toda_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "current_latitude" DOUBLE PRECISION,
    "current_longitude" DOUBLE PRECISION,
    "last_online" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriderQueueItem" (
    "id" TEXT NOT NULL,
    "trider_id" TEXT NOT NULL,
    "toda_id" TEXT NOT NULL,
    "queue_position" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TriderQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RideRequest" (
    "id" TEXT NOT NULL,
    "booking_code" TEXT NOT NULL,
    "passenger_id" TEXT NOT NULL,
    "toda_id" TEXT NOT NULL,
    "pickup_location_id" TEXT NOT NULL,
    "dropoff_location_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "estimated_fare" DOUBLE PRECISION NOT NULL,
    "estimated_time" INTEGER NOT NULL,
    "route_distance" DOUBLE PRECISION,
    "route_duration" DOUBLE PRECISION,
    "route_geometry" TEXT,
    "trider_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),
    "picked_up_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" TEXT,

    CONSTRAINT "RideRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RideRequest_booking_code_key" ON "RideRequest"("booking_code");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_toda_id_fkey" FOREIGN KEY ("toda_id") REFERENCES "Toda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trider" ADD CONSTRAINT "Trider_toda_id_fkey" FOREIGN KEY ("toda_id") REFERENCES "Toda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriderQueueItem" ADD CONSTRAINT "TriderQueueItem_trider_id_fkey" FOREIGN KEY ("trider_id") REFERENCES "Trider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriderQueueItem" ADD CONSTRAINT "TriderQueueItem_toda_id_fkey" FOREIGN KEY ("toda_id") REFERENCES "Toda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideRequest" ADD CONSTRAINT "RideRequest_toda_id_fkey" FOREIGN KEY ("toda_id") REFERENCES "Toda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideRequest" ADD CONSTRAINT "RideRequest_pickup_location_id_fkey" FOREIGN KEY ("pickup_location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideRequest" ADD CONSTRAINT "RideRequest_dropoff_location_id_fkey" FOREIGN KEY ("dropoff_location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideRequest" ADD CONSTRAINT "RideRequest_trider_id_fkey" FOREIGN KEY ("trider_id") REFERENCES "Trider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
