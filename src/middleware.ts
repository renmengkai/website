import { defineMiddleware } from 'astro:middleware';

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
      
      // 对于其他 /cms 路径，重定向到 /cms/index.html
      return context.redirect('/cms/index.html', 302);
    }
  }
  
  return next();
});
