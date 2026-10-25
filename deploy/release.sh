#!/bin/sh
set -eu

artifact=${1:?Usage: release.sh /path/to/dist.tar.gz}
base=/var/www/hosseinmokhtari.ir
release="$base/releases/$(date -u +%Y%m%dT%H%M%SZ)"
test -f "$artifact"
install -d -m 755 "$release"
tar -xzf "$artifact" -C "$release"
test -s "$release/index.html"
test -s "$release/404.html"
find "$release" -type d -exec chmod 755 {} +
find "$release" -type f -exec chmod 644 {} +
if [ -L "$base/current" ]; then
    readlink -f "$base/current" > "$base/previous-release"
fi
ln -s "$release" "$base/current.next"
mv -Tf "$base/current.next" "$base/current"
printf 'Published %s\n' "$release"
