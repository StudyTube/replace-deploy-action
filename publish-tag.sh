#!/bin/bash

# When ready for a stable release, add a major version tag:
# Move the major version tag (v1, v2, etc.) to point to the ref of the current release.
# This will act as the stable release for that major version.
# You should keep this tag updated to the most recent stable minor/patch release.

# https://github.com/actions/toolkit/blob/master/docs/action-versioning.md

git checkout releases/v1
git push origin :refs/tags/v1
git tag -fa v1 -m "Update v1 tag"
git push origin v1
