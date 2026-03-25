#!/usr/bin/env node

/**
 * 跨平台 CMS 构建脚本
 * 自动检测操作系统并执行相应的构建命令
 */

import { execSync } from 'child_process';
import { platform } from 'os';

const currentPlatform = platform();

console.log(`Detected platform: ${currentPlatform}`);

if (currentPlatform === 'win32') {
  console.log('Running Windows build script...');
  try {
    execSync('scripts\\install-sanity.bat && scripts\\build-cms.bat', { stdio: 'inherit' });
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('Running Linux/Unix build script...');
  try {
    execSync('bash scripts/install-sanity.sh && bash scripts/build-cms.sh', { stdio: 'inherit' });
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}
