#!/bin/sh

if [ "$PNPM_POSTINSTALL_ENABLE" != "false" ]; then
    chmod +x scripts/setup-hooks.sh
    bash scripts/setup-hooks.sh
fi
