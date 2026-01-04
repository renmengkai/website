import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue(),
    tailwind()
  ],
  output: 'static',
  site: 'https://www.mengkai.ren',
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  },
  vite: {
    ssr: {
      noExternal: ['@sanity/client']
    }
  },
  // 配置 public 目录，确保 /cms 路径可以正确访问
  publicDir: 'public'
});
