#!/bin/sh
/app/wait-for-it.sh db:5432 --timeout=0 --strict -- echo "db is up"

pnpm run kn:latest

pnpm run dev