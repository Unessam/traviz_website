#!/usr/bin/env bash
set -euo pipefail

# Recreate the dependency tree from the committed lockfile without
# contacting npm's audit service or running package lifecycle scripts.
npm ci --ignore-scripts --no-audit --no-fund

# Catch type errors and build failures before the merged task is considered
# ready for the reconciled workflows.
npm run check
npm run build