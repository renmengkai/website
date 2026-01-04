import { serveDir, serveFile } from "https://deno.land/std@0.220.0/http/file_server.ts";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  
  // 如果请求路径以 /cms 开头，处理 SPA 路由
  if (url.pathname.startsWith('/cms')) {
    // 如果是静态资源请求，直接提供文件
    if (url.pathname.match(/\.(js|css|json|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot|webmanifest|mjs)$/)) {
      return serveDir(req, {
        fsRoot: "public",
        quiet: true,
      });
    }
    
    // 如果是 /cms 或 /cms/，重定向到 /cms/structure
    if (url.pathname === '/cms' || url.pathname === '/cms/') {
      return Response.redirect(new URL('/cms/structure', req.url), 302);
    }
    
    // 对于其他 /cms/* 路径（如 /cms/structure），返回 index.html（SPA 回退）
    return serveFile(req, "public/cms/index.html");
  }
  
  // 对于其他请求，从 dist 目录提供内容
  return serveDir(req, {
    fsRoot: "dist",
    quiet: true,
  });
});