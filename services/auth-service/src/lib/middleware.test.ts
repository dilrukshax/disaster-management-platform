import assert from "node:assert/strict";
import test from "node:test";
import type { NextFunction, Response } from "express";
import { createAuthMiddleware, requireRoles } from "./middleware.js";
import { signAuthToken } from "./jwt.js";
import type { AuthRequest } from "../types.js";

function mockResponse() {
  const state: { code?: number; payload?: unknown } = {};
  const res = {
    status(code: number) {
      state.code = code;
      return this;
    },
    json(payload: unknown) {
      state.payload = payload;
      return this;
    }
  };

  return { state, res: res as unknown as Response };
}

test("auth middleware rejects missing and invalid tokens", () => {
  const auth = createAuthMiddleware("secret");

  {
    const { state, res } = mockResponse();
    let called = false;
    const req = { headers: {} } as AuthRequest;
    auth(req, res, (() => {
      called = true;
    }) as NextFunction);

    assert.equal(called, false);
    assert.equal(state.code, 401);
  }

  {
    const { state, res } = mockResponse();
    let called = false;
    const req = { headers: { authorization: "Bearer bad-token" } } as AuthRequest;
    auth(req, res, (() => {
      called = true;
    }) as NextFunction);

    assert.equal(called, false);
    assert.equal(state.code, 401);
  }
});

test("auth middleware accepts valid token and role guard enforces coordinator/admin", () => {
  const secret = "secret";
  const auth = createAuthMiddleware(secret);
  const token = signAuthToken(
    { userId: "u-2", email: "admin@local", role: "admin" },
    secret
  );

  const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
  const { res } = mockResponse();
  let authCalled = false;
  auth(req, res, (() => {
    authCalled = true;
  }) as NextFunction);

  assert.equal(authCalled, true);
  assert.equal(req.user?.role, "admin");

  const guard = requireRoles(["coordinator", "admin"]);
  let guardCalled = false;
  guard(req, res, (() => {
    guardCalled = true;
  }) as NextFunction);

  assert.equal(guardCalled, true);
});
