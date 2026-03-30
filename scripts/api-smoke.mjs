const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3005";

const json = (value) => JSON.stringify(value);

async function api(path, options = {}, token) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${path}: ${typeof payload === "string" ? payload : JSON.stringify(payload)}`);
  }

  return payload;
}

async function run() {
  const stamp = Date.now();

  const adminLogin = await api("/api/v1/auth/login", {
    method: "POST",
    body: json({ email: "coordinator@relieflink.local", password: "Admin@123" })
  });

  const requester = await api("/api/v1/auth/register", {
    method: "POST",
    body: json({
      fullName: `Requester ${stamp}`,
      email: `requester.${stamp}@relieflink.local`,
      phone: `+9477${String(stamp).slice(-7)}`,
      password: "Requester@123",
      role: "requester",
      district: "Colombo",
      city: "Colombo"
    })
  });

  const volunteer = await api("/api/v1/auth/register", {
    method: "POST",
    body: json({
      fullName: `Volunteer ${stamp}`,
      email: `volunteer.${stamp}@relieflink.local`,
      phone: `+9476${String(stamp).slice(-7)}`,
      password: "Volunteer@123",
      role: "volunteer",
      district: "Gampaha",
      city: "Negombo"
    })
  });

  const mission = await api(
    "/api/v1/requests",
    {
      method: "POST",
      body: json({
        category: "rescue",
        description: "Flood rescue needed near junction",
        urgency: "high",
        district: "Colombo",
        city: "Colombo",
        addressLine: "Galle Face, Colombo",
        peopleCount: 4
      })
    },
    requester.token
  );

  await api(
    "/api/v1/volunteers",
    {
      method: "POST",
      body: json({
        userId: volunteer.user.id,
        skillSet: ["first aid", "evacuation"],
        district: "Gampaha",
        city: "Negombo",
        availabilityStatus: "available"
      })
    },
    volunteer.token
  );

  const pendingVolunteers = await api(
    "/api/v1/volunteers?verificationStatus=pending",
    { method: "GET" },
    adminLogin.token
  );

  const pendingVolunteer = pendingVolunteers.find((item) => item.userId === volunteer.user.id);
  if (!pendingVolunteer) {
    throw new Error("Pending volunteer was not found");
  }

  await api(
    `/api/v1/volunteers/${pendingVolunteer.id}/verification`,
    {
      method: "PATCH",
      body: json({ verificationStatus: "approved", verificationNotes: "Smoke test approval" })
    },
    adminLogin.token
  );

  await api(
    `/api/v1/missions/${mission.id}/applications`,
    {
      method: "POST",
      body: json({ message: "Ready for immediate rescue dispatch" })
    },
    volunteer.token
  );

  const pendingApplications = await api(
    "/api/v1/applications?status=pending",
    { method: "GET" },
    adminLogin.token
  );

  const application = pendingApplications.find((item) => item.requestId === mission.id && item.volunteer.userId === volunteer.user.id);
  if (!application) {
    throw new Error("Pending mission application was not found");
  }

  await api(
    `/api/v1/applications/${application.id}/status`,
    {
      method: "PATCH",
      body: json({ status: "accepted" })
    },
    adminLogin.token
  );

  await api(
    "/api/v1/assignments",
    {
      method: "POST",
      body: json({
        requestId: mission.id,
        applicationId: application.id
      })
    },
    adminLogin.token
  );

  await api(
    `/api/v1/requests/${mission.id}/status`,
    {
      method: "PATCH",
      body: json({ status: "in_progress" })
    },
    volunteer.token
  );

  await api(
    `/api/v1/requests/${mission.id}/status`,
    {
      method: "PATCH",
      body: json({ status: "completed" })
    },
    volunteer.token
  );

  const timeline = await api(`/api/v1/status-events/request/${mission.id}`, { method: "GET" }, adminLogin.token);
  if (!timeline.length || timeline[0].newStatus !== "completed") {
    throw new Error("Mission timeline did not end in completed status");
  }

  console.log("API smoke test passed");
}

run().catch((error) => {
  console.error("API smoke test failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
