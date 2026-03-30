"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { subscribeMissionChannel, subscribeUserChannel } from "../../lib/realtime/socket";
import { SERVICE_URLS } from "../../lib/api/urls";

type SessionUser = {
  id: string;
  district?: string;
  city?: string;
};

type VolunteerProfile = {
  id: string;
  userId: string;
  district: string;
  city: string;
  availabilityStatus: string;
  verificationStatus: "pending" | "approved" | "rejected";
  verificationNotes?: string | null;
  createdAt: string;
};

type ReliefRequest = {
  id: string;
  category: string;
  district: string;
  city: string;
  addressLine: string;
  status: string;
  urgency: string;
};

type MissionApplication = {
  id: string;
  requestId: string;
  status: "pending" | "accepted" | "rejected";
  message?: string | null;
  createdAt: string;
};

export default function VolunteersPage() {
  const user = typeof window === "undefined" ? null : getUser<SessionUser>();
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile | null>(null);
  const [missions, setMissions] = useState<ReliefRequest[]>([]);
  const [myApplications, setMyApplications] = useState<MissionApplication[]>([]);
  const [skillSet, setSkillSet] = useState("first aid,logistics");
  const [applicationMessage, setApplicationMessage] = useState("I can support this mission quickly");
  const [message, setMessage] = useState("");

  const isApprovedVolunteer = volunteerProfile?.verificationStatus === "approved";

  const applicationLookup = useMemo(() => {
    const map = new Map<string, MissionApplication>();
    myApplications.forEach((record) => map.set(record.requestId, record));
    return map;
  }, [myApplications]);

  const loadProfile = async () => {
    try {
      const profile = await apiFetch<VolunteerProfile>(SERVICE_URLS.volunteer, "/api/v1/volunteers/me");
      setVolunteerProfile(profile);
    } catch {
      setVolunteerProfile(null);
    }
  };

  const loadMissions = async () => {
    try {
      const list = await apiFetch<ReliefRequest[]>(SERVICE_URLS.request, "/api/v1/requests");
      setMissions(list.filter((mission) => !["completed", "cancelled"].includes(mission.status)));
    } catch {
      setMissions([]);
    }
  };

  const loadMyApplications = async () => {
    try {
      const list = await apiFetch<MissionApplication[]>(SERVICE_URLS.volunteer, "/api/v1/applications/mine");
      setMyApplications(list);
    } catch {
      setMyApplications([]);
    }
  };

  const loadAll = async () => {
    await Promise.all([loadProfile(), loadMissions(), loadMyApplications()]);
  };

  useEffect(() => {
    loadAll().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cleanup: (() => void) | null = null;

    subscribeUserChannel(user.id)
      .then((socket) => {
        const refresh = () => {
          loadAll().catch(() => undefined);
        };

        socket.on("volunteer:verification-updated", refresh);
        socket.on("mission:application-updated", refresh);
        socket.on("mission:assignment-updated", refresh);

        cleanup = () => {
          socket.off("volunteer:verification-updated", refresh);
          socket.off("mission:application-updated", refresh);
          socket.off("mission:assignment-updated", refresh);
        };
      })
      .catch(() => undefined);

    return () => {
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    missions.forEach((mission) => {
      subscribeMissionChannel(mission.id).catch(() => undefined);
    });
  }, [missions]);

  const onRegister = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Login required");
      return;
    }

    try {
      await apiFetch(SERVICE_URLS.volunteer, "/api/v1/volunteers", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          skillSet: skillSet.split(",").map((item) => item.trim()).filter(Boolean),
          district: user.district ?? "Colombo",
          city: user.city ?? "Colombo",
          availabilityStatus: "available"
        })
      });

      setMessage("Volunteer profile submitted for super admin approval");
      await loadProfile();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to register volunteer");
    }
  };

  const applyToMission = async (requestId: string) => {
    setMessage("");

    try {
      await apiFetch(SERVICE_URLS.volunteer, `/api/v1/missions/${requestId}/applications`, {
        method: "POST",
        body: JSON.stringify({ message: applicationMessage })
      });
      setMessage("Applied to mission successfully");
      await loadMyApplications();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to apply for mission");
    }
  };

  return (
    <>
      <NavBar />
      <div className="card">
        <h1>Volunteer Mission Center</h1>
        {!volunteerProfile ? (
          <form onSubmit={onRegister}>
            <input value={skillSet} onChange={(e) => setSkillSet(e.target.value)} placeholder="Skills comma separated" />
            <button type="submit">Register as Volunteer</button>
          </form>
        ) : (
          <>
            <p>Volunteer ID: {volunteerProfile.id}</p>
            <p>
              Location: {volunteerProfile.city}, {volunteerProfile.district}
            </p>
            <p>
              Verification: <span className={`status-pill ${volunteerProfile.verificationStatus}`}>{volunteerProfile.verificationStatus}</span>
            </p>
            {volunteerProfile.verificationNotes ? <p>Review notes: {volunteerProfile.verificationNotes}</p> : null}
            <p>
              Availability: <span className={`status-pill ${volunteerProfile.availabilityStatus}`}>{volunteerProfile.availabilityStatus}</span>
            </p>
          </>
        )}
      </div>

      <div className="card">
        <h3 className="section-title">Mission Application Note</h3>
        <textarea
          value={applicationMessage}
          onChange={(e) => setApplicationMessage(e.target.value)}
          placeholder="Short note to admin before applying"
        />
      </div>

      {missions.map((mission) => {
        const existingApplication = applicationLookup.get(mission.id);

        return (
          <div className="card" key={mission.id}>
            <strong>{mission.category}</strong> - {mission.urgency}
            <p>{mission.addressLine}</p>
            <p>
              {mission.city}, {mission.district}
            </p>
            <p>Status: {mission.status === "in_progress" ? "ongoing" : mission.status}</p>
            <p>ID: {mission.id}</p>
            {existingApplication ? (
              <p>
                Application: <span className={`status-pill ${existingApplication.status}`}>{existingApplication.status}</span>
              </p>
            ) : (
              <button
                type="button"
                disabled={!isApprovedVolunteer}
                onClick={() => applyToMission(mission.id)}
              >
                {isApprovedVolunteer ? "Apply to Mission" : "Approval Required Before Applying"}
              </button>
            )}
          </div>
        );
      })}

      {message ? (
        <div className="card">
          <p>{message}</p>
        </div>
      ) : null}
    </>
  );
}
