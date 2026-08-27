---
name: GitHub branch publishing
description: Replit-specific distinction between GitHub connector access and Git CLI push authentication.
---

The installed GitHub integration can read repository data without authenticating the workspace's Git HTTPS remote. A GitHub device authorization must also complete the `gh` CLI login in the same workspace before `git push` can succeed.

**Why:** Repository reads through the connector worked while Git push failed with an invalid username/token. After the CLI device flow completed, the ordinary Git push succeeded and preserved the local commit history.

**How to apply:** When a GitHub remote push fails but the integration is installed, do not request a token in chat. Complete `gh auth login --hostname github.com --git-protocol https --web`, verify `gh auth status`, then retry the push.