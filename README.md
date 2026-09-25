# Terminal Access — Progressive Sign-In UX Demo

[![Quality](https://github.com/kooroosh1363/secound-login-form/actions/workflows/quality.yml/badge.svg)](https://github.com/kooroosh1363/secound-login-form/actions/workflows/quality.yml)
[![Deploy](https://github.com/kooroosh1363/secound-login-form/actions/workflows/pages.yml/badge.svg)](https://github.com/kooroosh1363/secound-login-form/actions/workflows/pages.yml)

Terminal Access modernizes the original 2023 Matrix-style login form into a progressive, two-step sign-in UX demo.

Instead of collecting email and password on one screen, the current interface models a small state machine:

```text
identity -> secret -> success
```

The project stays frontend-only and does not pretend to perform real authentication.

## Features

- progressive email → password flow
- explicit, testable state machine
- change-account action
- password show/hide control
- Caps Lock warning
- remember-email behavior
- password never persisted
- semantic labels and correct autocomplete
- live status feedback
- responsive terminal/cyber aesthetic
- automatic light/dark color scheme
- reduced-motion support
- zero runtime dependencies
- no Bootstrap, Bootstrap Icons, Google Fonts, or background video

## Why remove the Matrix video?

The original repository shipped an approximately 10.7 MB MP4 as a fullscreen background.

The modern version replaces that payload with CSS-rendered terminal visuals. This makes the project:

- much lighter
- faster to load
- easier to host on GitHub Pages
- independent of a large binary asset
- visually consistent in light and dark modes

## State architecture

```text
createAuthState()
      │
      ▼
reduceAuthState(state, event)
      │
      ├── SUBMIT_IDENTITY
      ├── CHANGE_IDENTITY
      ├── SUBMIT_SECRET
      └── RESET
      │
      ▼
DOM render layer
```

The reducer contains no DOM code, so the interaction flow can be tested independently.

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Quality

Node.js 20+:

```bash
npm run check
```

Tests cover:

- initial and remembered-email state
- identity validation
- secret validation
- identity changes
- success transitions
- password visibility copy
- local email persistence
- secure input semantics
- absence of Bootstrap/video/external runtime dependencies

## Scope

This is a frontend sign-in UX demonstration. Real authentication still requires a secure server-side identity system, password hashing, session/token handling, CSRF protection, rate limiting, and recovery/account lifecycle features.

## Deployment

The GitHub Pages workflow runs the quality gate before publishing the static site.

## License

No license is currently included.
