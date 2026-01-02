import { defineMiddleware } from 'astro:middleware';
import { readFileSync } from 'fs';
import { join } from 'path';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // 对于所有 /cms 开头的路径
  if (pathname.startsWith('/cms')) {
    // 如果是静态资源（包含文件扩展名），让其正常处理
    if (pathname.match(/\.(js|css|json|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot|webmanifest|mjs)$/)) {
      return next();
    }
    
    // 对于 /cms、/cms/、/cms/index.html 或任何其他 /cms/* 路径
    // 都返回 cms/index.html 的内容，让 Sanity Studio 的客户端路由处理
    try {
      const cmsIndexPath = join(process.cwd(), 'public', 'cms', 'index.html');
      const htmlContent = readFileSync(cmsIndexPath, 'utf-8');
      
      return new Response(htmlContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    } catch (error) {
      console.error('Error loading CMS index.html:', error);
      return next();
    }
  }
  
  return next();
});
