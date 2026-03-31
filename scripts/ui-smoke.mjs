const WEB_BASE = process.env.WEB_BASE_URL ?? "http://localhost:3000";
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3005";

async function fetchHtml(url, cookieHeader) {
  const response = await fetch(url, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
  if (!response.ok) {
    throw new Error(`Expected 2xx from ${url}, received ${response.status}`);
  }

  const text = await response.text();
  if (!text.includes("<html") && !text.includes("<!DOCTYPE")) {
    throw new Error(`Unexpected HTML response from ${url}`);
  }

  return text;
}

async function assertRedirect(url, expectedPath, cookieHeader) {
  const response = await fetch(url, {
    redirect: "manual",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });

  if (response.status < 300 || response.status >= 400) {
    throw new Error(`Expected redirect from ${url}, received ${response.status}`);
  }

  const location = response.headers.get("location") ?? "";
  if (!location.includes(expectedPath)) {
    throw new Error(`Expected redirect to include ${expectedPath}, received ${location || "<empty>"}`);
  }
}

async function loginAdminToken() {
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "coordinator@relieflink.local", password: "Admin@123" })
  });

  if (!response.ok) {
    throw new Error(`Admin login failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!payload?.token) {
    throw new Error("Admin login token missing");
  }

  return payload.token;
}

async function run() {
  await fetchHtml(`${WEB_BASE}/login`);
  await fetchHtml(`${WEB_BASE}/register`);

  await assertRedirect(`${WEB_BASE}/dashboard/requester`, "/login");

  const token = await loginAdminToken();
  const cookie = `rl_token=${encodeURIComponent(token)}`;

  await assertRedirect(`${WEB_BASE}/dashboard`, "/dashboard/admin", cookie);

  const adminDashboard = await fetchHtml(`${WEB_BASE}/dashboard/admin`, cookie);
  if (!adminDashboard.includes("Admin Command Center")) {
    throw new Error("Admin dashboard content missing");
  }

  await assertRedirect(`${WEB_BASE}/dashboard/requester`, "/dashboard/admin", cookie);

  console.log("UI smoke test passed");
}

run().catch((error) => {
  console.error("UI smoke test failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
