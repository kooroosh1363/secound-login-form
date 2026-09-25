const KEY = "terminal-signin.remembered-email";

export function loadRememberedEmail(storage = window.localStorage) {
  try {
    return String(storage.getItem(KEY) ?? "");
  } catch {
    return "";
  }
}

export function saveRememberedEmail(email, storage = window.localStorage) {
  const normalized = String(email ?? "").trim();

  try {
    if (normalized) storage.setItem(KEY, normalized);
    else storage.removeItem(KEY);
  } catch {
    // Storage is optional; sign-in flow remains usable without it.
  }

  return normalized;
}

export function clearRememberedEmail(storage = window.localStorage) {
  try {
    storage.removeItem(KEY);
  } catch {
    // Ignore privacy-mode storage failures.
  }
}
