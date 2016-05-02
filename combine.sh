#!/bin/sh

rm -rf dist/
mkdir -p dist/
echo '// https://github.com/Derbeth/ortjs-wiki' > dist/ort.js
cat node_modules/ort/dist/ort.js >> dist/ort.js
echo >> dist/ort.js
echo >> dist/ort.js
cat ort-button.js >> dist/ort.js
echo Generated to dist/ort.js
