const WEB_BASE = process.env.WEB_BASE_URL ?? "http://localhost:3000";
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3005";

async function assertHttpOk(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Expected 2xx from ${url}, received ${response.status}`);
  }

  const text = await response.text();
  if (!text.includes("<html") && !text.includes("<!DOCTYPE")) {
    throw new Error(`Unexpected HTML payload from ${url}`);
  }
}

async function run() {
  await assertHttpOk(`${WEB_BASE}/`);
  await assertHttpOk(`${WEB_BASE}/login`);
  await assertHttpOk(`${WEB_BASE}/register`);
  await assertHttpOk(`${WEB_BASE}/requests`);
  await assertHttpOk(`${WEB_BASE}/admin`);

  const configResponse = await fetch(`${API_BASE}/api/v1/config/public`);
  if (!configResponse.ok) {
    throw new Error(`Failed to load config endpoint: ${configResponse.status}`);
  }

  const configPayload = await configResponse.json();
  if (!configPayload.notificationWsUrl) {
    throw new Error("notificationWsUrl missing in public config");
  }

  console.log("UI smoke test passed");
}

run().catch((error) => {
  console.error("UI smoke test failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
