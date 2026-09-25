import test from "node:test";
import assert from "node:assert/strict";

import {
  STEPS,
  createAuthState,
  passwordVisibilityLabel,
  reduceAuthState,
  validateEmail,
  validatePassword,
} from "../assets/js/auth-flow.js";

test("starts on identity step and can preload remembered email", () => {
  const state = createAuthState(" user@example.com ");
  assert.equal(state.step, STEPS.IDENTITY);
  assert.equal(state.email, "user@example.com");
  assert.equal(state.remember, true);
});

test("identity submission validates before advancing", () => {
  const initial = createAuthState();

  const invalid = reduceAuthState(initial, {
    type: "SUBMIT_IDENTITY",
    email: "not-an-email",
  });
  assert.equal(invalid.step, STEPS.IDENTITY);
  assert.ok(invalid.error);

  const valid = reduceAuthState(initial, {
    type: "SUBMIT_IDENTITY",
    email: "user@example.com",
  });
  assert.equal(valid.step, STEPS.SECRET);
  assert.equal(valid.email, "user@example.com");
});

test("secret step validates before success", () => {
  const identity = reduceAuthState(createAuthState(), {
    type: "SUBMIT_IDENTITY",
    email: "user@example.com",
  });

  const invalid = reduceAuthState(identity, {
    type: "SUBMIT_SECRET",
    password: "short",
    remember: false,
  });
  assert.equal(invalid.step, STEPS.SECRET);
  assert.ok(invalid.error);

  const valid = reduceAuthState(identity, {
    type: "SUBMIT_SECRET",
    password: "long-enough-password",
    remember: true,
  });
  assert.equal(valid.step, STEPS.SUCCESS);
  assert.equal(valid.password, "");
  assert.equal(valid.remember, true);
});

test("change identity clears secret state", () => {
  const secret = {
    ...createAuthState("user@example.com"),
    step: STEPS.SECRET,
    password: "temporary",
  };
  const changed = reduceAuthState(secret, { type: "CHANGE_IDENTITY" });

  assert.equal(changed.step, STEPS.IDENTITY);
  assert.equal(changed.password, "");
});

test("validators and visibility copy expose clear contracts", () => {
  assert.equal(validateEmail("user@example.com"), "");
  assert.ok(validateEmail("bad"));
  assert.equal(validatePassword("12345678"), "");
  assert.ok(validatePassword("short"));
  assert.equal(passwordVisibilityLabel(false), "Show password");
  assert.equal(passwordVisibilityLabel(true), "Hide password");
});
