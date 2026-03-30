"use client";

import { FormEvent, useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { subscribeUserChannel } from "../../lib/realtime/socket";
import { SERVICE_URLS } from "../../lib/api/urls";

type SessionUser = {
  id: string;
  role: "requester" | "volunteer" | "coordinator" | "admin";
};

type VolunteerRecord = {
  id: string;
  userId: string;
  district: string;
  city: string;
  verificationStatus: "pending" | "approved" | "rejected";
  verificationNotes?: string | null;
  createdAt: string;
};

type MissionApplication = {
  id: string;
  requestId: string;
  volunteerId: string;
  status: "pending" | "accepted" | "rejected";
  message?: string | null;
  volunteer: VolunteerRecord;
};

export default function AdminPage() {
  const user = typeof window === "undefined" ? null : getUser<SessionUser>();
  const [pendingVolunteers, setPendingVolunteers] = useState<VolunteerRecord[]>([]);
  const [applications, setApplications] = useState<MissionApplication[]>([]);
  const [applicationFilter, setApplicationFilter] = useState("pending");
  const [notesByVolunteerId, setNotesByVolunteerId] = useState<Record<string, string>>({});
  const [resourceByApplicationId, setResourceByApplicationId] = useState<Record<string, string>>({});
  const [manualForm, setManualForm] = useState({ requestId: "", volunteerId: "", resourceId: "" });
  const [message, setMessage] = useState("");

  const loadPendingVolunteers = async () => {
    try {
      const list = await apiFetch<VolunteerRecord[]>(
        SERVICE_URLS.volunteer,
        "/api/v1/volunteers?verificationStatus=pending"
      );
      setPendingVolunteers(list);
    } catch {
      setPendingVolunteers([]);
    }
  };

  const loadApplications = async () => {
    const query = new URLSearchParams();
    if (applicationFilter) {
      query.set("status", applicationFilter);
    }

    try {
      const list = await apiFetch<MissionApplication[]>(
        SERVICE_URLS.volunteer,
        `/api/v1/applications${query.size ? `?${query.toString()}` : ""}`
      );
      setApplications(list);
    } catch {
      setApplications([]);
    }
  };

  const loadAll = async () => {
    await Promise.all([loadPendingVolunteers(), loadApplications()]);
  };

  useEffect(() => {
    loadAll().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadApplications().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationFilter]);

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

  const updateVolunteerVerification = async (volunteerId: string, verificationStatus: "approved" | "rejected") => {
    setMessage("");

    try {
      await apiFetch(SERVICE_URLS.volunteer, `/api/v1/volunteers/${volunteerId}/verification`, {
        method: "PATCH",
        body: JSON.stringify({
          verificationStatus,
          verificationNotes: notesByVolunteerId[volunteerId] ?? ""
        })
      });

      setMessage(`Volunteer ${verificationStatus}`);
      await loadPendingVolunteers();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update volunteer verification");
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    setMessage("");

    try {
      await apiFetch(SERVICE_URLS.volunteer, `/api/v1/applications/${applicationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });

      setMessage(`Application ${status}`);
      await loadApplications();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update application status");
    }
  };

  const assignFromApplication = async (application: MissionApplication) => {
    setMessage("");

    try {
      await apiFetch(SERVICE_URLS.volunteer, "/api/v1/assignments", {
        method: "POST",
        body: JSON.stringify({
          requestId: application.requestId,
          applicationId: application.id,
          resourceId: resourceByApplicationId[application.id] || undefined
        })
      });

      setMessage(`Assignment created from application ${application.id}`);
      await loadApplications();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to assign mission");
    }
  };

  const createManualAssignment = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await apiFetch(SERVICE_URLS.volunteer, "/api/v1/assignments", {
        method: "POST",
        body: JSON.stringify({
          requestId: manualForm.requestId,
          volunteerId: manualForm.volunteerId || undefined,
          resourceId: manualForm.resourceId || undefined
        })
      });

      setMessage("Manual assignment created");
      setManualForm({ requestId: "", volunteerId: "", resourceId: "" });
      await loadApplications();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to create manual assignment");
    }
  };

  if (user?.role !== "admin") {
    return (
      <>
        <NavBar />
        <div className="card">
          <h1>Super Admin Panel</h1>
          <p>Admin role is required to review volunteer legitimacy and mission applications.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <h1>Super Admin Panel</h1>

      <div className="card">
        <h3 className="section-title">Volunteer Approval Queue</h3>
        {pendingVolunteers.length === 0 ? <p>No pending volunteers</p> : null}
        {pendingVolunteers.map((volunteer) => (
          <div className="card" key={volunteer.id}>
            <p>Volunteer ID: {volunteer.id}</p>
            <p>User ID: {volunteer.userId}</p>
            <p>
              {volunteer.city}, {volunteer.district}
            </p>
            <textarea
              placeholder="Verification note"
              value={notesByVolunteerId[volunteer.id] ?? ""}
              onChange={(e) => setNotesByVolunteerId({ ...notesByVolunteerId, [volunteer.id]: e.target.value })}
            />
            <div className="inline-actions">
              <button type="button" onClick={() => updateVolunteerVerification(volunteer.id, "approved")}>Approve</button>
              <button type="button" onClick={() => updateVolunteerVerification(volunteer.id, "rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="section-title">Mission Applications</h3>
        <div className="inline-actions">
          <select value={applicationFilter} onChange={(e) => setApplicationFilter(e.target.value)}>
            <option value="">all</option>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
          </select>
          <button type="button" onClick={loadApplications}>Refresh</button>
        </div>

        {applications.map((application) => (
          <div className="card" key={application.id}>
            <p>Application ID: {application.id}</p>
            <p>Mission ID: {application.requestId}</p>
            <p>Volunteer Profile ID: {application.volunteerId}</p>
            <p>Status: <span className={`status-pill ${application.status}`}>{application.status}</span></p>
            {application.message ? <p>Volunteer Note: {application.message}</p> : null}

            {application.status === "pending" ? (
              <div className="inline-actions">
                <button type="button" onClick={() => updateApplicationStatus(application.id, "accepted")}>Accept</button>
                <button type="button" onClick={() => updateApplicationStatus(application.id, "rejected")}>Reject</button>
              </div>
            ) : null}

            {application.status === "accepted" ? (
              <div className="inline-actions">
                <input
                  placeholder="Optional resource ID"
                  value={resourceByApplicationId[application.id] ?? ""}
                  onChange={(e) => setResourceByApplicationId({ ...resourceByApplicationId, [application.id]: e.target.value })}
                />
                <button type="button" onClick={() => assignFromApplication(application)}>Assign Mission</button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="section-title">Manual Assignment</h3>
        <form onSubmit={createManualAssignment}>
          <input
            placeholder="Request ID"
            value={manualForm.requestId}
            onChange={(e) => setManualForm({ ...manualForm, requestId: e.target.value })}
          />
          <input
            placeholder="Volunteer ID (optional)"
            value={manualForm.volunteerId}
            onChange={(e) => setManualForm({ ...manualForm, volunteerId: e.target.value })}
          />
          <input
            placeholder="Resource ID (optional)"
            value={manualForm.resourceId}
            onChange={(e) => setManualForm({ ...manualForm, resourceId: e.target.value })}
          />
          <button type="submit">Create Assignment</button>
        </form>
      </div>

      {message ? (
        <div className="card">
          <p>{message}</p>
        </div>
      ) : null}
    </>
  );
}
