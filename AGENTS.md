# AGENTS.md

Explicitly import subdirectory instruction files that must always be in context:
@server/AGENTS.md

## Pull Requests

When creating a pull request, follow `.github/PULL_REQUEST_TEMPLATE.md` exactly:

- Remove all `<!-- -->` comments.
- Omit sections that are not applicable (Ticket Link, Screenshots) — do not write N/A, just remove the header.
- The `#### Release Note` header and its "```release-note" fenced code block **must always be present** (WITHOUT escaping the ``` characters). Write `NONE` if the change has no API, schema, UI, or breaking changes.

## Cursor Cloud Agents

This repository has a checked-in Cloud Agent environment under `.cursor/`. Docker is started by `.cursor/scripts/cloud-agent-start.sh`; if Docker is unavailable in Cloud, treat that as an environment failure rather than falling back to snapshot assumptions.

The environment declares `mattermost/enterprise` as a Cursor multi-repo dependency. Cursor clones the repositories as siblings, so `server/Makefile` can use its default `../../enterprise` path; the install hook does not clone or symlink enterprise.

If the enterprise sibling repo is not provisioned, that is not a blocker for general development: the server and webapp build and run fully as Team Edition. Hydrate the workspace with `BUILD_ENTERPRISE_READY=false` (e.g. `cd server && BUILD_ENTERPRISE_READY=false make setup-go-work`) and run with `cd server && ENABLED_DOCKER_SERVICES='postgres redis' BUILD_ENTERPRISE_READY=false make run-server` plus `cd webapp && make run`. The webapp compiles into `webapp/channels/dist`, which the server serves directly at `http://localhost:8065` (the separate `9005` dev server is optional).
