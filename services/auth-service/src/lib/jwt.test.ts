import assert from "node:assert/strict";
import test from "node:test";
import { parseBearerToken, signAuthToken, verifyAuthToken } from "./jwt.js";

const secret = "unit-test-secret";

test("parseBearerToken validates header format", () => {
  assert.equal(parseBearerToken(undefined), null);
  assert.equal(parseBearerToken("Basic abc"), null);
  assert.equal(parseBearerToken("Bearer token-123"), "token-123");
});

test("verifyAuthToken accepts valid token and rejects invalid token", () => {
  const token = signAuthToken({ userId: "u1", email: "u1@local", role: "requester" }, secret);

  const parsed = verifyAuthToken(token, secret);
  assert.ok(parsed);
  assert.equal(parsed?.userId, "u1");
  assert.equal(parsed?.role, "requester");

  assert.equal(verifyAuthToken("invalid.token", secret), null);
});
