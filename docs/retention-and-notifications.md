# Retention and Contact Notifications

This document describes the prepared retention and contact-notification
boundaries. It is intentionally a design and verification record, not an
activation instruction.

## Retention rules

- Contact submissions are eligible for hard deletion once their `createdAt`
  timestamp is at least 12 months before an explicitly supplied reference time.
- OAuth users are eligible for anonymisation once `accessRemovedAt` is at least
  90 days before an explicitly supplied reference time.
- A legal hold always makes the corresponding record ineligible, regardless of
  age. Holds carry an optional reason for review.
- Missing lifecycle timestamps are ineligible. OAuth session expiry is not used
  as an access-removal signal.

The policy functions are pure and require the caller to provide the reference
time. This keeps decisions deterministic and prevents accidental dependence on
the machine clock.

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
workflow, which is not part of this prepared-but-disabled implementation.

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

## Disabled until approval

The following are deliberately not active:

- no retention scheduler, worker, startup hook, public endpoint, or admin UI;
- no call to delete contact submissions or anonymise users from normal
  application execution;
- no production database migration or schema application;
- no Postmark key setup, sender verification, DKIM/Return-Path setup, or test
  email;
- no deployment or production activation of retention processing.

Before activation, obtain approval for the retention policy, legal-hold
workflow, replacement values, migration, Postmark sender and recipient
configuration, operational monitoring, and a staged production rollout.