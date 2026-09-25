import {
  STEPS,
  createAuthState,
  passwordVisibilityLabel,
  reduceAuthState,
} from "./auth-flow.js";
import {
  clearRememberedEmail,
  loadRememberedEmail,
  saveRememberedEmail,
} from "./storage.js";

const identityPanel = document.querySelector("#identity-step");
const secretPanel = document.querySelector("#secret-step");
const successPanel = document.querySelector("#success-step");
const identityForm = document.querySelector("#identity-form");
const secretForm = document.querySelector("#secret-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const rememberInput = document.querySelector("#remember");
const selectedIdentity = document.querySelector("#selected-identity");
const changeIdentity = document.querySelector("#change-identity");
const passwordToggle = document.querySelector("#password-toggle");
const capsStatus = document.querySelector("#caps-lock-status");
const identityError = document.querySelector("#identity-error");
const secretError = document.querySelector("#secret-error");
const globalStatus = document.querySelector("#global-status");
const resetButton = document.querySelector("#reset-flow");

let state = createAuthState(loadRememberedEmail());
let passwordVisible = false;

function render() {
  identityPanel.hidden = state.step !== STEPS.IDENTITY;
  secretPanel.hidden = state.step !== STEPS.SECRET;
  successPanel.hidden = state.step !== STEPS.SUCCESS;

  emailInput.value = state.email;
  rememberInput.checked = state.remember;
  selectedIdentity.textContent = state.email;

  identityError.textContent = state.step === STEPS.IDENTITY ? state.error : "";
  secretError.textContent = state.step === STEPS.SECRET ? state.error : "";

  if (state.step === STEPS.IDENTITY) {
    globalStatus.textContent = "Step 1 of 2: identify your account.";
    queueMicrotask(() => emailInput.focus());
  } else if (state.step === STEPS.SECRET) {
    globalStatus.textContent = "Step 2 of 2: enter your password.";
    queueMicrotask(() => passwordInput.focus());
  } else {
    globalStatus.textContent =
      "Demo sign-in flow completed locally. No credentials were transmitted.";
  }
}

identityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state = reduceAuthState(state, {
    type: "SUBMIT_IDENTITY",
    email: emailInput.value,
  });
  render();
});

secretForm.addEventListener("submit", (event) => {
  event.preventDefault();

  state = reduceAuthState(state, {
    type: "SUBMIT_SECRET",
    password: passwordInput.value,
    remember: rememberInput.checked,
  });

  if (state.step === STEPS.SUCCESS) {
    if (state.remember) saveRememberedEmail(state.email);
    else clearRememberedEmail();

    passwordInput.value = "";
    passwordVisible = false;
    passwordInput.type = "password";
    passwordToggle.textContent = "Show";
    passwordToggle.setAttribute("aria-pressed", "false");
    passwordToggle.setAttribute("aria-label", "Show password");
  }

  render();
});

changeIdentity.addEventListener("click", () => {
  state = reduceAuthState(state, { type: "CHANGE_IDENTITY" });
  passwordInput.value = "";
  render();
});

passwordToggle.addEventListener("click", () => {
  passwordVisible = !passwordVisible;
  passwordInput.type = passwordVisible ? "text" : "password";
  passwordToggle.textContent = passwordVisible ? "Hide" : "Show";
  passwordToggle.setAttribute("aria-pressed", String(passwordVisible));
  passwordToggle.setAttribute(
    "aria-label",
    passwordVisibilityLabel(passwordVisible),
  );
  passwordInput.focus();
});

function updateCapsLock(event) {
  capsStatus.textContent = event.getModifierState?.("CapsLock")
    ? "Caps Lock is on."
    : "";
}

passwordInput.addEventListener("keydown", updateCapsLock);
passwordInput.addEventListener("keyup", updateCapsLock);
passwordInput.addEventListener("blur", () => {
  capsStatus.textContent = "";
});

resetButton.addEventListener("click", () => {
  state = reduceAuthState(state, { type: "RESET" });
  render();
});

render();
