/** @type {import('tailwindcss').Config} */
// 双设计系统共用一份 Tailwind 配置：
//  - vima（浅色 · 暖纸酒红）令牌：brand/paper/ink/clay/stone/mist/sand/cream/line/moss
//  - glass（深色 · Ethereal Glass）令牌：void/fg/primary/dark + 辉光阴影/动效
// sans/mono 字体按主题经 CSS 变量解析（--font-sans/--font-mono 在各主题样式表 :root 中定义）
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // ===== glass · 深空底色体系（OLED 黑） =====
        void: {
          DEFAULT: '#050505',   // 页面底
          raised: '#0a0a0b',    // 抬升面
          panel: '#0e0e10',     // 卡片内核
        },
        // glass · 文字体系（暖中性灰）
        fg: {
          DEFAULT: '#f4f4f2',   // 主文字
          soft: '#b6b6b1',      // 次级文字
          faint: '#7c7c76',     // 弱文字
          ghost: '#4b4b47',     // 装饰性文字
        },
        // glass · 品牌绿（glass 唯一强调色）
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#4ade80',
          600: '#22c55e',
          700: '#16a34a',
          800: '#15803d',
          900: '#14532d',
          950: '#052e16',
        },
        // 兼容旧类名
        dark: {
          DEFAULT: '#050505',
          50: '#0a0a0b',
          100: '#0e0e10',
          200: '#161618',
          300: '#232326',
        },
        // ===== vima · 暖纸底 + 酒红品牌色 =====
        brand: {
          DEFAULT: '#A5282C', // 品牌主色（酒红）
          dark: '#8C1F23',    // hover 加深
          tint: '#F7ECEA',    // 品牌浅底（标签底色）
          line: '#EAD5D2',    // 品牌浅描边
        },
        paper: '#FAF8F4',     // 页面底色（暖纸色）
        ink: {
          DEFAULT: '#221E1B', // 标题 / 深色块
          soft: '#5A524A',    // 深色块内描边
        },
        clay: '#4D463E',      // 正文
        stone: '#8A8178',     // 次要文字
        mist: '#B4ACA2',      // 弱化文字（日期等）
        sand: '#D9D3CA',      // 占位图形
        cream: '#F4F0EA',     // 浅填充（进度条底 / 占位块）
        line: {
          DEFAULT: '#E7E1D8', // 描边
          soft: '#F0EBE4',    // 弱描边 / 分隔线
          strong: '#C9C2B8',  // 次按钮描边
        },
        moss: {
          DEFAULT: '#2E7D5B', // 成功 / 运行中
          tint: '#EBF3EE',
          line: '#D3E4DA',
        },
      },
      fontFamily: {
        // 按主题解析：vima → Noto Sans SC / IBM Plex Mono；glass → Plus Jakarta Sans / JetBrains Mono
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        // glass 专用展示字体
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'system-ui', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        // vima 专用衬线标题
        serif: ['"Noto Serif SC"', 'Songti SC', 'SimSun', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8.5vw, 7rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'heading-xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading': ['1.5rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        // glass · 绿色辉光体系
        'glow-sm': '0 0 24px -8px rgba(74, 222, 128, 0.35)',
        'glow': '0 0 48px -12px rgba(74, 222, 128, 0.4)',
        'glow-lg': '0 0 80px -16px rgba(74, 222, 128, 0.45)',
        'depth': '0 24px 48px -24px rgba(0, 0, 0, 0.8)',
        'bezel-core': 'inset 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      animation: {
        'marquee': 'marquee 36s linear infinite',
        'orb-drift': 'orb-drift 18s ease-in-out infinite alternate',
        'ping-slow': 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'orb-drift': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '100%': { transform: 'translate3d(6%, 4%, 0) scale(1.12)' },
        },
      },
    },
  },
  plugins: [],
}
