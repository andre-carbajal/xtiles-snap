#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "snap" ]]; then
  shift
  set -- pack "$@"
fi

exec /snap/bin/snapcraft "$@"
