#!/bin/sh
MESSAGE=$(cat $1)

echo "$MESSAGE" | pnpm exec -- commitlint

if [ $? -ne 0 ]; then
  echo "Commit message does not follow the conventional commit guidelines."
  exit 1
fi