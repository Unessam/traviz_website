# Retention and Contact Notifications

This document describes the approved retention controls and the operating
procedure for the contact-notification boundary.

## Retention rules

- Contact submissions are eligible for hard deletion once their `createdAt`
  timestamp is at least 12 months before an explicitly supplied reference time.
- OAuth users are eligible for anonymisation once `accessRemovedAt` is at least
  90 days before an explicitly supplied reference time.
- A legal hold always makes the corresponding record ineligible, regardless of
  age. Adding or releasing a hold requires an operator reason for review.
- Missing lifecycle timestamps are ineligible. OAuth session expiry is not used
  as an access-removal signal.

The policy functions are pure and require the caller to provide the reference
time. The controlled HTTP workflow accepts a timestamp and rejects future
timestamps; when a timestamp is omitted it records the server time used for
the run. This keeps every completed run reproducible.

The repository layer repeats the age and legal-hold predicates when it
performs an eventual action. User anonymisation preserves the user ID and
database constraints while clearing email, name, and profile-image values.
An anonymisation timestamp is non-personal evidence that the action occurred.
An internal access-removal operation records the lifecycle timestamp; a
successful OAuth upsert clears that timestamp, so a restored account cannot
remain eligible because of stale removal state.

Public contact requests use a strict form-only schema containing name, email,
company, and message. Creation always sets legal-hold values to their safe
defaults. Legal holds can only be changed through an authorised internal
workflow. Every access-removal, legal-hold, dry-run, deletion, anonymisation,
and failed run is recorded with a non-sensitive actor ID, target ID, timestamp,
and action summary.

## Contact notification boundary

The contact flow stores the validated submission before it attempts a
notification. Postmark is used only when `POSTMARK_API_KEY`,
`POSTMARK_FROM_EMAIL`, and `POSTMARK_TO_EMAIL` are configured, or when a client
is explicitly injected by a test or approved caller. Missing configuration is
a no-op. A provider failure cannot turn a stored submission into a failed
contact request.

Notification failures emit only a fixed reason such as `provider_error`.
Form contents, addresses, provider error objects, and credentials are never
written to logs.

## Staff authorization

The following endpoints require both a valid Replit session and a retention
staff allowlist match. The allowlist is fail-closed: no authenticated user is
authorised until at least one of these deployment variables is configured.

- `RETENTION_ADMIN_USER_IDS`: comma-separated Replit subject IDs; preferred
  because the ID is stable.
- `RETENTION_ADMIN_EMAILS`: comma-separated staff email addresses. This is
  supported for teams that do not yet maintain subject IDs.

Authorised staff use only these protected routes:

- `PATCH /api/admin/users/:id/access-removal` records access removal.
- `PATCH /api/admin/users/:id/legal-hold` manages a user legal hold.
- `PATCH /api/admin/contact-submissions/:id/legal-hold` manages a contact
  submission legal hold.
- `GET /api/admin/retention/preview` shows aggregate eligibility counts.
- `POST /api/admin/retention/runs` creates a dry run or an approved execution.
- `GET /api/admin/retention/runs` shows recent run status and totals.
- `GET /api/admin/retention/audit-events` shows the non-sensitive audit trail.

The admin dashboard exposes these operations in a Retention Operations console.
The console is rendered only after a protected retention request succeeds, so
staff outside the allowlist see neither the controls nor retained contact data.
Operators select a completed dry run before entering the explicit live-action
confirmation; the server remains authoritative for authorisation, activation,
snapshot freshness, and all mutation checks.

The routes intentionally return only lifecycle and legal-hold fields for
individual operations; they do not expose contact message contents.

## Migration and deployment

The checked-in Drizzle migrations are additive and safe for databases that
previously used `db:push`. They add missing retention fields, run records,
audit events, and supporting indexes without rewriting existing contact or user
records. Historical dry runs are backfilled as non-reviewable, so an operator
must create a fresh dry run after this upgrade before any live action.

`npm run db:migrate` is the normal migration command. The production startup
command runs it before starting the application, so the approved migration is
applied by the normal deployment process rather than by an ad-hoc production
connection. Deploying the application is the approval point for this schema
change; verify the deployment log contains a successful migration before
enabling retention actions.

## Retention run procedure

1. Confirm the retention policy, legal-hold workflow, migration, monitoring
   owner, backup availability, and production rollout approval are recorded by
   the company.
2. Configure the staff allowlist. Do **not** set
   `RETENTION_AUTOMATION_ENABLED` yet.
3. Have an authorised staff member create a dry run with
   `POST /api/admin/retention/runs` and `{ "dryRun": true }`. Save the returned
   run ID and review its eligible and legal-hold totals.
4. Investigate unexpected totals, then place holds or correct lifecycle state
   before continuing. Any legal-hold or lifecycle change requires a fresh dry
   run. The live run compares its current eligible-record fingerprint with the
   reviewed snapshot and rejects changed candidate sets.
5. After documented approval, set `RETENTION_AUTOMATION_ENABLED=true` in the
   deployment environment. This is deliberately a separate, fail-closed
   activation gate.
6. An authorised staff member creates the live run with the reviewed
   `previewRunId`, `"dryRun": false`, and
   `"confirmation": "APPLY_RETENTION"`. The service rejects a live action
   without each of those controls.
7. Review the completed run totals and audit events. Disable the activation
   variable immediately if totals or failure status are unexpected.

The controlled runner is request-driven rather than a startup hook or
background scheduler. It stops on an action failure, marks the run as failed,
and records a fixed failure code without logging record contents.

## Monitoring and rollback

Monitor recent retention runs for `failed` status, unexpected candidate totals,
or skipped actions. Investigate the audit event trail using target IDs and run
IDs; do not add contact form content or provider responses to application logs.

To stop future live actions, set `RETENTION_AUTOMATION_ENABLED` to any value
other than `true` and redeploy. This does not interrupt a database transaction
already in progress, so make the change before requesting another run.

Hard-deleted contact submissions and anonymised profile fields cannot be
reconstructed by this application. Recovery requires the company-approved
database backup and incident process. For a suspected pending deletion, place
a legal hold immediately; for a restored OAuth account, the next successful
sign-in clears its access-removal timestamp.