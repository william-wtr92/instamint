#!/bin/bash

BASE_VERSION=$(date "+%y.%m")

checkIfExistVersion() {
    local version="$1"
    for file in $(find ./apps -name 'package.json' -not -path '*/.next/*'); do
        if grep -q "\"version\": \"$version\"" "$file"; then
            return 0 
        fi
    done
    return 1 
}

findHighestSuffix() {
    local highest=-1 
    for file in $(find ./apps -name 'package.json' -not -path '*/.next/*'); do
        while IFS= read -r line; do
            version=$(echo "$line" | grep -o "\"version\": \"$BASE_VERSION\([.][0-9]\+\)\?\"" | grep -o "$BASE_VERSION\([.][0-9]\+\)\?")
            if [[ $version =~ ^$BASE_VERSION\.([0-9]+)$ ]]; then
                suffix=${BASH_REMATCH[1]}
                ((suffix > highest)) && highest=$suffix
            elif [[ $version == $BASE_VERSION ]]; then
                highest=0 
            fi
        done < "$file"
    done
    echo $((highest + 1)) 
}

VERSION_SUFFIX=$(findHighestSuffix)

if [[ "$VERSION_SUFFIX" -gt 0 ]]; then
    NEXT_VERSION="$BASE_VERSION.$VERSION_SUFFIX"
else
    NEXT_VERSION="$BASE_VERSION"
fi

find ./apps -name 'package.json' -not -path '*/.next/*' | while read file; do
    if [ -f "$file" ]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' -E "s/\"version\": \"[0-9]+\.[0-9]+(\.[0-9]+)?\"/\"version\": \"$NEXT_VERSION\"/" "$file"
        else
            sed -i -E "s/\"version\": \"[0-9]+\.[0-9]+(\.[0-9]+)?\"/\"version\": \"$NEXT_VERSION\"/" "$file"
        fi
        echo "🚀 Updated version in $file to $NEXT_VERSION"
    else
        echo "⚠️ File: $file does not exist !"
    fi
done
