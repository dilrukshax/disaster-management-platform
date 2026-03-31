import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "./password.js";

test("hashPassword and verifyPassword handle valid and invalid inputs", async () => {
  const plain = "Requester@123";
  const hash = await hashPassword(plain);

  assert.notEqual(hash, plain);
  assert.equal(await verifyPassword(plain, hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
});
