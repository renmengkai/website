import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
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
    
    // 对于其他 /cms/* 路径（如 /cms/structure），获取 index.html 并返回
    const indexUrl = new URL('/cms/index.html', context.url.origin);
    const response = await fetch(indexUrl);
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
  
  return next();
});
