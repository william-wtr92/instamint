#!/bin/bash

GITHUB_BASE="https://github.com/"
GITHUB_PROJECT_URL="https://github.com/william-wtr92/instamint"
CHANGELOG_FILE="CHANGELOG.md"
TEMP_FILE="new_entries_temp.md"
NEW_VERSION_ARG=$1

git fetch --tags
LAST_TAG=$(git describe --tags `git rev-list --tags --max-count=1`)
echo "🚀 Last tag found: $LAST_TAG"

if [ -z "$LAST_TAG" ]; then
    echo "⚠️ No previous tag found. Using the first commit of the project."
    LAST_TAG=$(git rev-list --max-parents=0 HEAD)
fi

COMMITS=$(git log $LAST_TAG..HEAD --pretty=format:"- **%s**, by [@%al]($GITHUB_BASE%al) in ([#%h]($GITHUB_PROJECT_URL/commit/%H))" --reverse | sed -E "s|\(#([0-9]+)\)|([#\1]($GITHUB_PROJECT_URL/pull/\1))|g")
COMMITS=$(echo "$COMMITS" | sed -E 's/([0-9]+)\+//g')

if [ -z "$COMMITS" ]; then
    echo "⚠️ No commit found since the last tag until now."
    exit 0
fi

VERSION_DATE=$(date "+%Y-%m-%d")

NEW_VERSION=$NEW_VERSION_ARG

NEW_ENTRIES="## [$NEW_VERSION]($GITHUB_PROJECT_URL/compare/$LAST_TAG..HEAD) ($VERSION_DATE)

### 🚀 What's Changed

$COMMITS
"

if [ -f "$CHANGELOG_FILE" ]; then
    HEADER="# 📝 Changelog\n\n#### All notable changes of the project will be documented in this file.\n"

    CONTENT=$(sed '1,3d' $CHANGELOG_FILE)

    {
        echo -e "$HEADER"
        echo -e "$NEW_ENTRIES"
        echo "$CONTENT"
    } > $TEMP_FILE
else
    echo -e "# 📝 Changelog\n\n#### All notable changes of the project will be documented in this file.\n\n$NEW_ENTRIES" > $TEMP_FILE
fi

mv $TEMP_FILE $CHANGELOG_FILE

echo "📝 Commits added to $CHANGELOG_FILE."
