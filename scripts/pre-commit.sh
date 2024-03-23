#!/bin/sh
echo "Running lint checks !"

pnpm run lint
pnpm run format:check

if [ $? -ne 0 ]; then
  echo "Linting failed, commit aborted."
  exit 1
fi