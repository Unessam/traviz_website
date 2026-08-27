---
name: Retention approval snapshots
description: Safety rule for carrying an approved dry run into an irreversible retention action.
---

An approval to run retention applies only to the exact eligible-record set
reviewed in the dry run. A live execution must compare an immutable
candidate-set fingerprint with the reviewed run and fail closed on a mismatch.
Runs created before fingerprints existed are non-reviewable and require a new
dry run.

**Why:** A newly backdated access-removal timestamp or changed legal hold after
review could otherwise make a record eligible and bypass the staff review that
is required before deletion or anonymisation.

**How to apply:** Any change to the data used to determine eligibility must
either invalidate the preview or cause live execution to reject it. Preserve
the legacy non-reviewable behavior when evolving retention schemas.