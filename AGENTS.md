# Website agent rules

## Replit production provenance

Replit production does not continuously track a Git branch. Publish creates a snapshot of the Replit workspace at that moment. Never claim that a GitHub merge is deployed or live without checking the active production bundle.

As of 15 September 2026:

- the live-site lineage is the diverged `replit-agent` history, not GitHub `main`;
- the latest verified Replit preparation commit is `1ecee180ad46d3c0e2d74d89e41a193296922433`;
- GitHub Privacy Notice merge commit is `1b4f8d6f8b34175aaac0168868b6864e8ef6dd56`;
- both histories share `be75facef0ff82df52b8f004f3e14ea15b8a837f` and then diverge;
- the two reviewed Privacy Notice v1.4 file blobs are identical at Replit commit `1ecee180...` and GitHub merge `1b4f8d6...`.

Before changing or deploying the website:

1. Report the Replit workspace branch and exact HEAD.
2. Report GitHub `main`, the common ancestor and divergence.
3. Treat the current production workspace as a snapshot, not as a branch that follows `main`.
4. Do not fast-forward, merge, reset, rebase, force-push or overwrite either diverged history without a separate approved reconciliation plan.
5. Apply only exact independently reviewed files or commit content authorised for the deployment.
6. Review and test the complete resulting Replit workspace snapshot before Publish.
7. After Publish, verify the active JavaScript bundle and required live text. HTTP 200 alone is not enough.

DEC-LOG-050 still rejects the old broad `replit-agent` change set as the TVZ-37 implementation source. Current production provenance does not approve that history for GitHub `main`; it only permits controlled maintenance of the actual production snapshot until branch reconciliation is separately approved.

Never expose secrets, tokens, production data or client information. Production changes, branch reconciliation and deployment require explicit CEO approval.

## OpenAI Select Partner brand

Any OpenAI wording or badge use must follow the controlling rules in Traviz-Core at `departments/marketing/brand/openai-select-partner/README.md`. Building a change does not approve publication.
