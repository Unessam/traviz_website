---
name: Postmark inactive-account behavior
description: Diagnostic lesson for accepted Postmark submissions that never appear in Activity.
---

If Postmark returns `ErrorCode: 0`, `Message: OK`, and a Message ID but the message does not appear in Activity and lookup returns error 701, check whether the Postmark account was deactivated after prolonged inactivity.

**Why:** A confirmed incident showed that valid credentials, a live server, and correctly formatted addresses could still produce accepted-but-unrecorded submissions while the account was inactive. Reactivating the account immediately restored Activity tracking and delivery.

**How to apply:** Before rotating credentials or changing application code, confirm account activation status. After reactivation, send one direct API test and require both a recorded Activity entry and a Delivered event.