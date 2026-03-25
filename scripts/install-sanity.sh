#!/bin/bash
set -e

echo "Installing Sanity CMS dependencies..."
cd sanity
npm install
if [ $? -ne 0 ]; then
    echo "Error: npm install failed"
    exit 1
fi
echo ""
echo "Dependencies installed!"
cd ..
echo ""
echo "Now you can run: npm run build-cms"
