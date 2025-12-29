import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const indexPath = join(rootDir, 'public', 'cms', 'index.html');

try {
  let content = readFileSync(indexPath, 'utf-8');

  // 替换所有静态资源路径 - 更全面的替换
  // HTML 属性中的路径
  content = content.replace(/href="\/static\//g, 'href="/cms/static/');
  content = content.replace(/src="\/static\//g, 'src="/cms/static/');
  content = content.replace(/href="\/vendor\//g, 'href="/cms/vendor/');
  content = content.replace(/src="\/vendor\//g, 'src="/cms/vendor/');

  // JSON 字符串中的路径（如 import map）
  content = content.replace(/"\/static\//g, '"/cms/static/');
  content = content.replace(/"\/vendor\//g, '"/cms/vendor/');

  // 单引号字符串中的路径
  content = content.replace(/'\/static\//g, "'/cms/static/");
  content = content.replace(/'\/vendor\//g, "'/cms/vendor/");

  writeFileSync(indexPath, content, 'utf-8');
  console.log('✓ Fixed static resource paths in public/cms/index.html');
  console.log('Now refresh your browser to test!');
} catch (error) {
  console.error('✗ Fix failed:', error);
}
