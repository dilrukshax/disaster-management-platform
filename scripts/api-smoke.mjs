const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3005";

const toJson = (value) => JSON.stringify(value);

async function api(path, { method = "GET", body, token } = {}) {
  const headers = new Headers();
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? toJson(body) : undefined
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

  return { response, payload };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const stamp = Date.now();

  const adminLogin = await api("/api/v1/auth/login", {
    method: "POST",
    body: { email: "coordinator@relieflink.local", password: "Admin@123" }
  });

  assert(adminLogin.response.ok, "Admin login failed");
  const adminToken = adminLogin.payload?.token;
  assert(adminToken, "Admin token missing");

  const requesterEmail = `requester.${stamp}@relieflink.local`;
  const volunteerEmail = `volunteer.${stamp}@relieflink.local`;

  const requesterRegister = await api("/api/v1/auth/register", {
    method: "POST",
    body: {
      fullName: `Requester ${stamp}`,
      email: requesterEmail,
      phone: `+9477${String(stamp).slice(-7)}`,
      password: "Requester@123",
      role: "requester",
      district: "Colombo",
      city: "Colombo"
    }
  });

  assert(requesterRegister.response.status === 201, "Requester registration failed");
  const requesterToken = requesterRegister.payload?.token;
  const requesterId = requesterRegister.payload?.user?.id;
  assert(requesterToken && requesterId, "Requester token or user id missing");

  const volunteerRegister = await api("/api/v1/auth/register", {
    method: "POST",
    body: {
      fullName: `Volunteer ${stamp}`,
      email: volunteerEmail,
      phone: `+9476${String(stamp).slice(-7)}`,
      password: "Volunteer@123",
      role: "volunteer",
      district: "Gampaha",
      city: "Negombo"
    }
  });

  assert(volunteerRegister.response.status === 201, "Volunteer registration failed");

  const loginFailure = await api("/api/v1/auth/login", {
    method: "POST",
    body: { email: requesterEmail, password: "invalid-password" }
  });

  assert(loginFailure.response.status === 401, "Expected 401 for invalid login");

  const me = await api("/api/v1/auth/me", {
    method: "GET",
    token: requesterToken
  });

  assert(me.response.ok, "Requester /me failed");
  assert(me.payload?.email === requesterEmail, "Requester /me email mismatch");

  const roleUpdate = await api(`/api/v1/users/${requesterId}/role`, {
    method: "PATCH",
    token: adminToken,
    body: { role: "coordinator" }
  });

  assert(roleUpdate.response.ok, "Admin role update failed");
  assert(roleUpdate.payload?.role === "coordinator", "Role update response mismatch");

  const requesterRelogin = await api("/api/v1/auth/login", {
    method: "POST",
    body: { email: requesterEmail, password: "Requester@123" }
  });

  assert(requesterRelogin.response.ok, "Requester re-login failed after role update");
  assert(requesterRelogin.payload?.user?.role === "coordinator", "Expected updated role on login response");

  console.log("API smoke test passed");
}

run().catch((error) => {
  console.error("API smoke test failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
