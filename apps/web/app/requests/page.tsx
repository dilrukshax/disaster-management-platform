"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import { apiFetch } from "../../lib/api/client";
import { getUser } from "../../lib/auth/session";
import { subscribeMissionChannel, subscribeUserChannel } from "../../lib/realtime/socket";
import { SERVICE_URLS } from "../../lib/api/urls";

type ReliefRequest = {
  id: string;
  category: string;
  urgency: string;
  district: string;
  city: string;
  addressLine: string;
  peopleCount: number;
  status: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
};

type SessionUser = {
  id: string;
  role: "requester" | "volunteer" | "coordinator" | "admin";
};

const MissionMap = dynamic(() => import("../../components/MissionMap"), { ssr: false });

export default function RequestsPage() {
  const [requests, setRequests] = useState<ReliefRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [newStatus, setNewStatus] = useState("in_progress");
  const [message, setMessage] = useState("");
  const [requestForm, setRequestForm] = useState({
    category: "rescue",
    urgency: "high",
    district: "Colombo",
    city: "Colombo",
    addressLine: "Galle Road, Colombo",
    description: "Need urgent rescue support",
    peopleCount: 3
  });

  const user = typeof window === "undefined" ? null : getUser<SessionUser>();

  const isPrivileged = useMemo(() => {
    return Boolean(user && ["coordinator", "admin"].includes(user.role));
  }, [user]);

  const isVolunteer = user?.role === "volunteer";

  const loadRequests = async () => {
    const query = new URLSearchParams();
    if (statusFilter) query.set("status", statusFilter);
    if (urgencyFilter) query.set("urgency", urgencyFilter);
    if (districtFilter) query.set("district", districtFilter);

    await apiFetch<ReliefRequest[]>(SERVICE_URLS.request, `/api/v1/requests${query.size ? `?${query.toString()}` : ""}`)
      .then(setRequests)
      .catch(() => setRequests([]));
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requests.forEach((request) => {
      subscribeMissionChannel(request.id).catch(() => undefined);
    });
  }, [requests]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let mounted = true;
    let cleanup: (() => void) | null = null;

    subscribeUserChannel(user.id)
      .then((socket) => {
        if (!mounted) {
          return;
        }

        const onMissionStatus = () => {
          loadRequests().catch(() => undefined);
        };

        const onAssignment = () => {
          loadRequests().catch(() => undefined);
        };

        socket.on("mission:status-updated", onMissionStatus);
        socket.on("mission:assignment-updated", onAssignment);

        cleanup = () => {
          socket.off("mission:status-updated", onMissionStatus);
          socket.off("mission:assignment-updated", onAssignment);
        };
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const createRequest = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const created = await apiFetch<ReliefRequest>(SERVICE_URLS.request, "/api/v1/requests", {
        method: "POST",
        body: JSON.stringify({
          ...requestForm,
          peopleCount: Number(requestForm.peopleCount)
        })
      });

      setSelectedRequestId(created.id);
      setMessage("Mission request created successfully");
      await loadRequests();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to create request");
    }
  };

  const updateStatus = async () => {
    if (!selectedRequestId) {
      setMessage("Select a mission first");
      return;
    }

    setMessage("");

    try {
      await apiFetch(SERVICE_URLS.request, `/api/v1/requests/${selectedRequestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      setMessage("Mission status updated");
      await loadRequests();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <>
      <NavBar />
      <h1>Mission Requests and Sri Lanka Map</h1>

      <div className="card">
        <h3 className="section-title">Create Need-Help Mission</h3>
        <form onSubmit={createRequest}>
          <div className="inline-actions">
            <select value={requestForm.category} onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}>
              <option value="water">water</option>
              <option value="food">food</option>
              <option value="medicine">medicine</option>
              <option value="shelter">shelter</option>
              <option value="rescue">rescue</option>
              <option value="transport">transport</option>
              <option value="other">other</option>
            </select>
            <select value={requestForm.urgency} onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>
          <input
            placeholder="Address line"
            value={requestForm.addressLine}
            onChange={(e) => setRequestForm({ ...requestForm, addressLine: e.target.value })}
          />
          <div className="inline-actions">
            <input placeholder="District" value={requestForm.district} onChange={(e) => setRequestForm({ ...requestForm, district: e.target.value })} />
            <input placeholder="City" value={requestForm.city} onChange={(e) => setRequestForm({ ...requestForm, city: e.target.value })} />
          </div>
          <textarea
            placeholder="Describe the emergency"
            value={requestForm.description}
            onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
          />
          <input
            type="number"
            min={1}
            value={requestForm.peopleCount}
            onChange={(e) => setRequestForm({ ...requestForm, peopleCount: Number(e.target.value) })}
          />
          <button type="submit">Submit Need Help Request</button>
        </form>
        {pickedLocation ? (
          <p>
            Picked map point: {pickedLocation.latitude.toFixed(5)}, {pickedLocation.longitude.toFixed(5)}
          </p>
        ) : null}
      </div>

      <div className="card">
        <h3 className="section-title">Mission Filters</h3>
        <div className="inline-actions">
          <input placeholder="District" value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">pending</option>
            <option value="matched">matched</option>
            <option value="assigned">assigned</option>
            <option value="in_progress">ongoing</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)}>
            <option value="">All urgencies</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button type="button" onClick={loadRequests}>Apply Filters</button>
        </div>
      </div>

      <MissionMap
        missions={requests}
        selectedMissionId={selectedRequestId || null}
        pickedLocation={pickedLocation}
        onPickLocation={(latitude, longitude) => setPickedLocation({ latitude, longitude })}
        onSelectMission={(requestId) => setSelectedRequestId(requestId)}
      />

      {isPrivileged || isVolunteer ? (
        <div className="card">
          <h3 className="section-title">Mission Status Control</h3>
          <div className="inline-actions">
            <input
              placeholder="Mission Request ID"
              value={selectedRequestId}
              onChange={(e) => setSelectedRequestId(e.target.value)}
            />
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {isPrivileged ? <option value="pending">pending</option> : null}
              {isPrivileged ? <option value="matched">matched</option> : null}
              {isPrivileged ? <option value="assigned">assigned</option> : null}
              <option value="in_progress">ongoing</option>
              <option value="completed">completed</option>
              {isPrivileged ? <option value="cancelled">cancelled</option> : null}
            </select>
            <button type="button" onClick={updateStatus}>Update Mission Status</button>
          </div>
        </div>
      ) : null}

      {message ? <div className="card"><p>{message}</p></div> : null}

      {requests.map((item) => (
        <div className="card" key={item.id}>
          <strong>{item.category}</strong> - {item.urgency}
          <p>
            {item.addressLine}, {item.city}, {item.district}
          </p>
          <p>People affected: {item.peopleCount}</p>
          <p>Status: {item.status === "in_progress" ? "ongoing" : item.status}</p>
          <p>ID: {item.id}</p>
          <button type="button" onClick={() => setSelectedRequestId(item.id)}>Select Mission</button>
        </div>
      ))}
    </>
  );
}
