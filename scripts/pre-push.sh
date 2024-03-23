#!/bin/sh
echo "Running unit tests !"

## TODO : add all tests here
pnpm run test:business   # Run business server logic tests

if [ $? -ne 0 ]; then
  echo "Unit tests failed, push aborted."
  exit 1
fi