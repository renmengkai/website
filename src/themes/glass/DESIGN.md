# 深色科技风设计系统规范（Ethereal Glass)

创建日期: 2026-07-16

全站统一的深色玻璃设计语言。任何页面/组件改造必须严格遵循本规范。
基础设施已就绪：`tailwind.config.mjs`、`src/styles/global.css`、`src/lib/motion.ts`。
参照样板（已完成，视为规范的落地示例）：`src/components/Hero.astro`、`src/components/PostCard.astro`、`src/components/ui/Card.astro`、`src/components/ui/Button.astro`、`src/components/Footer.astro`、`src/pages/index.astro`。

## 色彩令牌（只用这些，禁止 gray-*/white 底/黑字）

| 用途 | 类名 |
|---|---|
| 页面底色 | `bg-void`（#050505，body 已设，无需重复） |
| 抬升面 | `bg-void-raised` |
| 卡片内核 | `bg-void-panel` |
| 主文字 | `text-fg` |
| 次级文字 | `text-fg-soft` |
| 弱文字 | `text-fg-faint` |
| 装饰文字 | `text-fg-ghost` |
| 唯一强调色 | `primary-400/500`（绿），文字用 `text-primary-400` |
| 边框/分割线 | `border-white/10` 或 `.hairline`（border-white/[0.08]） |
| 浅玻璃面 | `bg-white/[0.04]` ~ `bg-white/[0.06]` |

## 关键组件类（global.css 已定义）

- `.bezel` + 内部 `.bezel-core`：双层玻璃卡片（外壳托盘+内核），所有重要卡片必须用这个结构；或直接用 `<Card>` 组件
- `.eyebrow`：眉题小标签（大标题上方）
- `.hairline`：发丝分割线（配 border-t / border-b）
- `.input-dark`：表单输入统一样式（input/textarea/select 全用它）
- `.orb .orb-primary` / `.orb-teal`：环境辉光球（放进 relative + overflow-hidden 的 section）
- `.bg-grid-dark`：网格线背景（仅 hero 类区块）
- `.text-glow-gradient`：绿色渐变文字（每页最多一处）
- `.marquee` + `.marquee-track`：无限滚动带

## 动效（motion.ts 已全局初始化，直接用属性）

- `data-reveal`（+ `style="--reveal-delay: 120ms"`）：滚动入场（fade+up+blur）。区块标题、卡片列表逐个加 stagger（i*120ms）
- `data-reveal-lines` + `.reveal-line > span`：大标题逐行遮罩（只用于页面主标题）
- `data-spotlight`：光斑跟随（Card 组件已内置）
- `data-magnetic`：磁性按钮（只给主 CTA）
- `data-count-to="42"`：数字滚动计数（统计数字）
- 过渡一律 `duration-300~700` + `ease-out-expo` 或 `ease-spring`，禁止 linear/ease-in-out

## 按钮

用 `<Button>` 组件（variant: primary=绿实心/secondary=玻璃/ghost/outline，showArrow 时箭头自动嵌套在圆形容器里）。
手写时遵循「岛式胶囊」：`rounded-full` + 文字 `pl-6/7` + 右侧 `w-8/9 h-8/9 rounded-full bg-void/15`（绿底）或 `bg-white/[0.08]`（玻璃底）圆形箭头容器。

## 排版

- h1/h2/h3 自动是 Space Grotesk（font-display 已在 base 设定）
- 页面主标题：`text-display-lg` 或 `text-display-xl`；区块标题用 `<SectionTitle title subtitle index="01">`（左对齐，带序号）
- 眉题：`.eyebrow`；等宽信息（日期/标签/代码）用 `font-mono text-xs`
- 段落正文 `text-fg-faint leading-relaxed`，长文限宽 `max-w-2xl`

## 页面骨架模板

```astro
<section class="relative pt-32 pb-16 lg:pb-24 overflow-hidden">
  <div class="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true"></div>
  <div class="orb orb-primary -top-40 left-1/2 -translate-x-1/2 w-[48rem] h-[30rem]" aria-hidden="true"></div>
  <div class="container-custom relative text-center">
    <p class="eyebrow mb-8" data-reveal>栏目名</p>
    <h1 class="text-display-lg font-bold text-fg mb-6" data-reveal-lines>
      <span class="reveal-line"><span style="--line-index: 1;">页面标题</span></span>
    </h1>
    <p class="text-lg text-fg-faint max-w-2xl mx-auto" data-reveal style="--reveal-delay: 300ms;">副标题描述</p>
  </div>
</section>
<!-- 后续内容区块 -->
<section class="section border-t hairline">…</section>
```

注意：Header 是悬浮胶囊导航（fixed），每页首屏必须 `pt-28`+，避免内容被导航遮住。

## 硬性禁令

- 禁 `bg-white`、`bg-gray-*`、`text-gray-*`、`border-gray-*`、`shadow-card`、纯黑 #000
- 禁 `dark:` 前缀（全站只有深色，一律写深色值）；遇到旧代码的 `dark:` 变体：把 dark: 后面的值提升为默认值并删掉前缀
- 禁 Inter/Roboto 字体引用
- 动画只许 transform/opacity/filter，禁 top/left/width/height
- `height: 100vh` → `min-h-[100dvh]`
- 保持既有功能不变：脚本逻辑、表单提交、Sanity 查询、路由、prose 内容渲染一律不动，只改视觉层
- 无障碍：交互元素保留 focus 样式（全局 :focus-visible 已设，别 outline-none 裸奔）；装饰元素加 `aria-hidden="true"`
