#!/usr/bin/env bash
set -euo pipefail

ARCH="${1:?Usage: build-snap.sh <x64|arm64>}"
case "$ARCH" in
  x64) SNAP_ARCH="amd64" ;;
  arm64) SNAP_ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH" >&2; exit 2 ;;
esac

VERSION="$(node -p "require('./package.json').version")"
PROJECT_DIR="release/snap-${ARCH}"
if [[ "$ARCH" == "x64" ]]; then
  UNPACKED_DIR="linux-unpacked"
else
  UNPACKED_DIR="linux-${ARCH}-unpacked"
fi
OUTPUT="../xtiles-snap_${VERSION}_${ARCH}.snap"

rm -rf "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR/snap/gui" "$PROJECT_DIR/app"
cp snap/snapcraft.yaml "$PROJECT_DIR/snapcraft.yaml"
cp build/icons/icon.png "$PROJECT_DIR/snap/gui/icon.png"

mkdir -p "release/${UNPACKED_DIR}/usr/share/applications"
mkdir -p "release/${UNPACKED_DIR}/usr/share/pixmaps"
cp xtiles-snap.desktop "release/${UNPACKED_DIR}/usr/share/applications/xtiles-snap.desktop"
cp build/icons/icon.png "release/${UNPACKED_DIR}/usr/share/pixmaps/xtiles-snap.png"
cp -a "release/${UNPACKED_DIR}/." "$PROJECT_DIR/app/"

sed -i \
  -e "s|__VERSION__|${VERSION}|g" \
  -e "s|__ARCH__|${SNAP_ARCH}|g" \
  "$PROJECT_DIR/snapcraft.yaml"

pushd "$PROJECT_DIR" >/dev/null
snapcraft prime --destructive-mode
snapcraft pack --output "$OUTPUT" prime
popd >/dev/null
