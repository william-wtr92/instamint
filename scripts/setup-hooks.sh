#!/bin/sh

cp scripts/commit-msg.sh ./.git/hooks/commit-msg
cp scripts/pre-commit.sh ./.git/hooks/pre-commit
cp scripts/pre-push.sh ./.git/hooks/pre-push

chmod +x ./.git/hooks/commit-msg
chmod +x ./.git/hooks/pre-commit
chmod +x ./.git/hooks/pre-push
