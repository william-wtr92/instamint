#!/bin/sh

SCRIPTS_DIR="./scripts"

VERSION=$(pnpm run version | grep -oE 'to [0-9]+\.[0-9]+\.[0-9]+' | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
echo "🚀 New version: $VERSION"

if [ -z "$VERSION" ]; then
  echo "⚠️ No version found. Exiting..."
  exit 1
fi

echo "💡 New version: $VERSION"

chmod +x $SCRIPTS_DIR/changelog.sh
$SCRIPTS_DIR/changelog.sh $VERSION

git add .
git commit -m "chore(release): 🚀 v$VERSION"
git tag -a v$VERSION -m "v$VERSION"
git push origin main --tags

echo "🚀 New release pushed to the repository v$VERSION"