#!/bin/bash
set -e

echo "========================================"
echo "Building CMS and deploying to public/cms"
echo "========================================"
echo ""

echo "[1/4] Building Sanity Studio..."
cd sanity
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Sanity build failed"
    cd ..
    exit 1
fi
cd ..

echo "[2/4] Fixing static resource paths..."
node scripts/fix-cms-paths.js
if [ $? -ne 0 ]; then
    echo "Error: Path fixing failed"
    exit 1
fi

echo "[3/4] Copying to public/cms..."
if [ -d public/cms ]; then
    rm -rf public/cms
fi
cp -r sanity/dist public/cms
if [ $? -ne 0 ]; then
    echo "Error: File copy failed"
    exit 1
fi

echo "[4/4] Cleaning up temporary files..."
rm -rf sanity/dist

echo ""
echo "========================================"
echo "CMS build completed!"
echo "========================================"
echo ""
echo "Visit: http://localhost:4321/cms"
echo ""
