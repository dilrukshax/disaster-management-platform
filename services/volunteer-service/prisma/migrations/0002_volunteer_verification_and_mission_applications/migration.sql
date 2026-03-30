CREATE TYPE volunteer_service."VolunteerVerificationStatus" AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE volunteer_service."MissionApplicationStatus" AS ENUM ('pending', 'accepted', 'rejected');

ALTER TABLE volunteer_service."Volunteer"
ADD COLUMN "verificationStatus" volunteer_service."VolunteerVerificationStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN "verificationNotes" TEXT,
ADD COLUMN "verifiedBy" TEXT,
ADD COLUMN "verifiedAt" TIMESTAMP(3);

CREATE TABLE volunteer_service."MissionApplication" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "volunteerId" TEXT NOT NULL,
  "message" TEXT,
  "status" volunteer_service."MissionApplicationStatus" NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MissionApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MissionApplication_requestId_idx" ON volunteer_service."MissionApplication"("requestId");
CREATE INDEX "MissionApplication_status_idx" ON volunteer_service."MissionApplication"("status");
CREATE UNIQUE INDEX "MissionApplication_requestId_volunteerId_key" ON volunteer_service."MissionApplication"("requestId", "volunteerId");

ALTER TABLE volunteer_service."MissionApplication"
ADD CONSTRAINT "MissionApplication_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES volunteer_service."Volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE volunteer_service."Assignment"
ADD COLUMN "applicationId" TEXT;

ALTER TABLE volunteer_service."Assignment"
ADD CONSTRAINT "Assignment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES volunteer_service."MissionApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
