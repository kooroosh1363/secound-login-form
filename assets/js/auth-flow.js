const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const STEPS = Object.freeze({
  IDENTITY: "identity",
  SECRET: "secret",
  SUCCESS: "success",
});

export const LIMITS = Object.freeze({
  emailMax: 254,
  passwordMin: 8,
  passwordMax: 128,
});

export function normalizeEmail(value) {
  return String(value ?? "").trim();
}

export function validateEmail(value) {
  const email = normalizeEmail(value);

  if (!email) return "Please enter your email address.";
  if (email.length > LIMITS.emailMax || !EMAIL_PATTERN.test(email)) {
    return "Please enter a valid email address.";
  }

  return "";
}

export function validatePassword(value) {
  const password = String(value ?? "");

  if (!password) return "Please enter your password.";
  if (password.length < LIMITS.passwordMin) {
    return `Password must be at least ${LIMITS.passwordMin} characters.`;
  }
  if (password.length > LIMITS.passwordMax) {
    return `Password must be ${LIMITS.passwordMax} characters or fewer.`;
  }

  return "";
}

export function createAuthState(rememberedEmail = "") {
  return {
    step: STEPS.IDENTITY,
    email: normalizeEmail(rememberedEmail),
    password: "",
    remember: Boolean(normalizeEmail(rememberedEmail)),
    error: "",
  };
}

export function reduceAuthState(state, event) {
  switch (event?.type) {
    case "SUBMIT_IDENTITY": {
      const email = normalizeEmail(event.email);
      const error = validateEmail(email);

      return error
        ? { ...state, email, error }
        : { ...state, step: STEPS.SECRET, email, password: "", error: "" };
    }

    case "CHANGE_IDENTITY":
      return { ...state, step: STEPS.IDENTITY, password: "", error: "" };

    case "SUBMIT_SECRET": {
      const password = String(event.password ?? "");
      const error = validatePassword(password);

      return error
        ? { ...state, password, remember: Boolean(event.remember), error }
        : {
            ...state,
            step: STEPS.SUCCESS,
            password: "",
            remember: Boolean(event.remember),
            error: "",
          };
    }

    case "RESET":
      return createAuthState(state.remember ? state.email : "");

    default:
      return state;
  }
}

export function passwordVisibilityLabel(isVisible) {
  return isVisible ? "Hide password" : "Show password";
}
