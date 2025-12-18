# Deno Deploy 静态文件服务器
# 使用 Deno 内置的文件服务器来部署静态网站

import { serveDir } from "https://deno.land/std@0.220.0/http/file_server.ts";

Deno.serve((req: Request) => {
  return serveDir(req, {
    fsRoot: "dist",
    quiet: true,
  });
});
