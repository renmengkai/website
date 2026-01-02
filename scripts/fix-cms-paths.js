import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'sanity', 'dist');

/**
 * 修复 Sanity 构建后的静态资源路径
 * 注意:现在 Sanity 构建时使用 --base-path /cms,所以大部分路径已经正确
 * 这个脚本主要用于修复可能的边缘情况
 */
function fixCmsPaths() {
  try {
    // 修复 index.html - 添加额外的路径检查
    const indexPath = join(distDir, 'index.html');
    let content = readFileSync(indexPath, 'utf-8');

    // Sanity v5 使用 --base-path 后应该已经生成了正确的路径
    // 但为了确保万无一失,检查并修复可能遗漏的路径
    const needsFix = content.includes('/static/') && !content.includes('/cms/static/');

    if (needsFix) {
      console.log('⚠ Found unpatched paths, fixing...');
      // HTML 属性中的路径
      content = content.replace(/href="\/static\//g, 'href="/cms/static/');
      content = content.replace(/src="\/static\//g, 'src="/cms/static/');
      content = content.replace(/href="\/vendor\//g, 'href="/cms/vendor/');
      content = content.replace(/src="\/vendor\//g, 'src="/cms/vendor/');

      // JSON 字符串中的路径
      content = content.replace(/"\/static\//g, '"/cms/static/');
      content = content.replace(/"\/vendor\//g, '"/cms/vendor/');

      writeFileSync(indexPath, content, 'utf-8');
      console.log('✓ Fixed static resource paths in index.html');
    } else {
      console.log('✓ CMS paths are already correct (base-path is working)');
    }

    console.log('✓ CMS path fixing completed!');
  } catch (error) {
    console.error('✗ Error fixing CMS paths:', error);
    process.exit(1);
  }
}

/**
 * 递归修复目录中的所有 HTML/JS/CSS 文件
 */
function fixDirectory(dir) {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = join(dir, file.name);

    if (file.isDirectory()) {
      fixDirectory(fullPath);
    } else if (file.isFile()) {
      const ext = file.name.split('.').pop();
      if (['html', 'js', 'css'].includes(ext)) {
        fixFile(fullPath);
      }
    }
  }
}

/**
 * 修复单个文件中的路径引用
 */
function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');

    // 替换路径引用
    const originalContent = content;
    content = content.replace(/url\("\/static\//g, 'url("/cms/static/');
    content = content.replace(/url\('\/static\//g, "url('/cms/static/");
    content = content.replace(/url\(\/static\//g, 'url(/cms/static/');
    content = content.replace(/url\("\/vendor\//g, 'url("/cms/vendor/');
    content = content.replace(/url\('\/vendor\//g, "url('/cms/vendor/");
    content = content.replace(/url\(\/vendor\//g, 'url(/cms/vendor/');

    // 只在内容有变化时写入
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
    }
  } catch (error) {
    // 忽略无法读取的文件
  }
}

fixCmsPaths();
