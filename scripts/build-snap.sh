#!/usr/bin/env bash
set -euo pipefail

ARCH="${1:?Usage: build-snap.sh <x64|arm64> [bundle-dir]}"
BUNDLE_DIR="${2:-src-tauri/target/release/bundle}"

case "$ARCH" in
  x64) SNAP_ARCH="amd64" ;;
  arm64) SNAP_ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH" >&2; exit 2 ;;
esac

VERSION="$(node -p "require('./package.json').version")"
PROJECT_DIR="release/snap-${ARCH}"
APP_DIR="${PROJECT_DIR}/app"
OUTPUT="../xtiles-snap_${VERSION}_${ARCH}.snap"
DEB_PATH="$(find "$BUNDLE_DIR/deb" -maxdepth 1 -type f -name '*.deb' -print -quit)"

if [[ -z "$DEB_PATH" ]]; then
  echo "No Tauri DEB found in $BUNDLE_DIR/deb" >&2
  exit 1
fi

rm -rf "$PROJECT_DIR"
mkdir -p "$APP_DIR" "$PROJECT_DIR/snap/gui"
dpkg-deb -x "$DEB_PATH" "$APP_DIR"

mkdir -p "$APP_DIR/usr/share/applications" "$APP_DIR/usr/share/pixmaps"
cp xtiles-snap.desktop "$APP_DIR/usr/share/applications/xtiles-snap.desktop"
cp src-tauri/icons/icon.png "$APP_DIR/usr/share/pixmaps/xtiles-snap.png"
cp snap/gui/icon.png "$PROJECT_DIR/snap/gui/icon.png"
cp snap/snapcraft.yaml "$PROJECT_DIR/snapcraft.yaml"

sed -i \
  -e "s|__VERSION__|${VERSION}|g" \
  -e "s|__ARCH__|${SNAP_ARCH}|g" \
  "$PROJECT_DIR/snapcraft.yaml"

pushd "$PROJECT_DIR" >/dev/null
snapcraft prime --destructive-mode
snapcraft pack --destructive-mode --output "$OUTPUT" prime
popd >/dev/null
