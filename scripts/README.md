# Scripts Directory

This directory contains all build and utility scripts for the project.

## Build Scripts

### `install-sanity.bat`
Installs Sanity CMS dependencies in the `sanity/` directory.

### `build-cms.bat`
Main build script that:
1. Builds Sanity Studio
2. Fixes static resource paths
3. Copies to `public/cms/`
4. Cleans up temporary files

## Utility Scripts

### `fix-cms-paths.js`
Automatically fixes static resource paths in Sanity build output.
- Replaces `/static/` with `/cms/static/`
- Replaces `/vendor/` with `/cms/vendor/`
- Runs automatically during `build-cms.bat`

### `fix-current-cms.js`
Quick fix script for already-built CMS in `public/cms/`.
Use this to manually fix paths without rebuilding.

## Usage

### First Time Setup
```bash
# Install Sanity dependencies
npm run sanity-install
```

### Build CMS
```bash
# Build and deploy CMS to public/cms/
npm run build-cms
```

### Quick Fix (Without Rebuild)
```bash
# Fix paths in existing build
node scripts/fix-current-cms.js
```
