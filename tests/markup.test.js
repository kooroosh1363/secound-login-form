import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("progressive steps and live status are present", () => {
  for (const id of ["identity-step", "secret-step", "success-step"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.match(html, /id="global-status"[^>]*aria-live="polite"/);
});

test("email and password use correct semantics", () => {
  assert.match(html, /id="email"[^>]*type="email"/);
  assert.match(html, /autocomplete="username"/);
  assert.match(html, /id="password"[^>]*type="password"/);
  assert.match(html, /autocomplete="current-password"/);
});

test("password toggle is an accessible button", () => {
  assert.match(html, /id="password-toggle"[^>]*type="button"/);
  assert.match(html, /aria-pressed="false"/);
});

test("page has no Bootstrap, external font, or video dependency", () => {
  assert.doesNotMatch(
    html,
    /bootstrap|fonts\.googleapis\.com|cdn\.jsdelivr\.net|<video|\.mp4/i,
  );
});

test("application script loads as an ES module", () => {
  assert.match(
    html,
    /<script[^>]+type="module"[^>]+src="\.\/assets\/js\/app\.js"/,
  );
});
