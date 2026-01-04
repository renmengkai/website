import { defineMiddleware } from 'astro:middleware';
import { readFileSync } from 'fs';
import { join } from 'path';

export const onRequest = defineMiddleware(async (context, next) => {
  // 仅在开发环境处理 /cms 路由
  // 生产环境由 _redirects 文件处理
  if (import.meta.env.DEV) {
    const { pathname } = context.url;
    
    // 对于所有 /cms 开头的路径
    if (pathname.startsWith('/cms')) {
      // 如果已经是 index.html，直接返回
      if (pathname === '/cms/index.html') {
        return next();
      }
      
      // 如果是静态资源，让其正常处理
      if (pathname.match(/\.(js|css|json|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot|webmanifest|mjs)$/)) {
        return next();
      }
      
      // 如果是 /cms 或 /cms/，重定向到 /cms/structure
      if (pathname === '/cms' || pathname === '/cms/') {
        return context.redirect('/cms/structure', 302);
      }
      
      // 对于其他 /cms/* 路径（如 /cms/structure），返回 index.html 内容
      try {
        const indexPath = join(process.cwd(), 'public', 'cms', 'index.html');
        const html = readFileSync(indexPath, 'utf-8');
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      } catch (e) {
        // 如果读取失败，继续正常处理
        return next();
      }
    }
  }
  
  return next();
});
