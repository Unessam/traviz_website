---
name: Playwright on Nix
description: Runtime requirement for executing checked-in Playwright browser tests in this Replit workspace.
---

Local Playwright Chromium requires its Linux shared libraries to be declared in the Replit Nix environment; downloading the browser binary alone is not sufficient.

**Why:** Chromium initially failed before test execution because required shared objects such as GLib and libxkbcommon were absent.

**How to apply:** Preserve the existing browser runtime packages when maintaining Playwright tests, and treat missing-library launch errors as environment dependencies rather than test failures.