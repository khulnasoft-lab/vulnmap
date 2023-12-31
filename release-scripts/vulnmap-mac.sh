#!/usr/bin/env bash
set -euo pipefail

DIRNAME=$(dirname "$0")

NODE="$DIRNAME/node-v12.22.11-darwin-x64/bin/node"
VULNMAP_CLI="$DIRNAME/dist/cli/index.js"

"$NODE" "$VULNMAP_CLI" "$@"