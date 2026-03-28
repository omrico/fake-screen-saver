#!/bin/bash

set -e

OUTPUT_NAME="fake-screen-saver.zip"
BUILD_DIR="build"

rm -f "$OUTPUT_NAME"
rm -rf "$BUILD_DIR"

mkdir -p "$BUILD_DIR"

cp manifest.json "$BUILD_DIR/"
cp background.js "$BUILD_DIR/"
cp screensaver.html "$BUILD_DIR/"
cp screensaver.js "$BUILD_DIR/"

cp -r icons "$BUILD_DIR/"
cp -r popup "$BUILD_DIR/"
cp -r content "$BUILD_DIR/"

cd "$BUILD_DIR"
zip -r "../$OUTPUT_NAME" .
cd ..

rm -rf "$BUILD_DIR"

echo "Created $OUTPUT_NAME"
unzip -l "$OUTPUT_NAME"
