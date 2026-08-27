---
name: Development database binding
description: Which connection variable must be used for schema migrations in this Replit.
---

Run application schema migrations against `DATABASE_URL`, without replacing it
with `NEON_DATABASE_URL`.

**Why:** This environment can expose both variables with different database
targets. Migrating the Neon-named connection left the running application
schema unchanged and caused runtime inserts to fail.

**How to apply:** Use the repository's normal migration command with its
existing environment. Do not remap the connection variable unless the
application database binding is intentionally changed.