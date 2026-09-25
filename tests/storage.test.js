import test from "node:test";
import assert from "node:assert/strict";

import {
  clearRememberedEmail,
  loadRememberedEmail,
  saveRememberedEmail,
} from "../assets/js/storage.js";

function memoryStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

test("remembers and clears only the email identity", () => {
  const storage = memoryStorage();

  saveRememberedEmail(" user@example.com ", storage);
  assert.equal(loadRememberedEmail(storage), "user@example.com");

  clearRememberedEmail(storage);
  assert.equal(loadRememberedEmail(storage), "");
});

test("storage failures are non-fatal", () => {
  const storage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
    removeItem() { throw new Error("blocked"); },
  };

  assert.equal(loadRememberedEmail(storage), "");
  assert.equal(saveRememberedEmail("user@example.com", storage), "user@example.com");
  assert.doesNotThrow(() => clearRememberedEmail(storage));
});
