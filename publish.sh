#!/bin/bash

# Create a release branch for each major version:
# This will act as an alpha release for that major version.
# Any time you are ready to publish a new version from master,
# you should pull those changes into this branch (following the same steps listed below).

# https://github.com/actions/toolkit/blob/master/docs/action-versioning.md

git branch -D releases/v1
git push origin --delete releases/v1
git -b checkout releases/v1   # If this branch already exists, omit the -b flag
npm run build
rm -rf node_modules
sed -i '' '/node_modules/d' .gitignore   # Bash command that removes node_modules from .gitignore
npm install --production
git add node_modules .gitignore
git commit -m node_modules
git push origin releases/v1
