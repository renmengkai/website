import { serveDir } from "https://deno.land/std@0.220.0/http/file_server.ts";

Deno.serve((req: Request) => {
  const url = new URL(req.url);
  
  // 如果请求路径以 /cms 开头，则从 public 目录提供内容
  if (url.pathname.startsWith('/cms')) {
    return serveDir(req, {
      fsRoot: "public",
      quiet: true,
    });
  }
  
  // 对于其他请求，从 dist 目录提供内容
  return serveDir(req, {
    fsRoot: "dist",
    quiet: true,
  });
});