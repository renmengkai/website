# 设计规范 (Design Guidelines)

## 色彩系统

### 主色调
- **强调色**: 绿色 `primary-500 (#4ade80)`
- **用途**: 关键元素强调、趋势箭头、活跃标签

### 辅助色
- **深色**: `dark-100 (#1a1a1a)` - 用于主按钮、深色背景
- **中性色**: `gray-900`, `gray-100`, `gray-50` - 文字、边框、背景

### 禁用元素
- **渐变**: 禁止使用任何渐变效果（linear-gradient, radial-gradient）
- **模糊装饰**: 禁止使用 blur、glow 等装饰效果

### 色彩比例
- 背景: 白 `white` 为主
- 边框: `border-gray-200`
- 文字: 深灰 `gray-900`、中灰 `gray-500`、浅灰 `gray-400`
- 强调: 仅绿色 `primary-500` 用于关键元素

## 字体系统

### 字体
- **主字体**: Inter (Google Fonts)
- **备选**: system-ui, -apple-system, sans-serif

### 字重
- 标题: `font-bold` (700)
- 正文: `font-medium` (500)

### 字号
- 主标题: `text-5xl sm:text-6xl lg:text-7xl`
- 副标题: `text-xl sm:text-2xl`
- 正文: `text-base sm:text-lg`
- 辅助文字: `text-sm`
- 标签: `text-xs`

## 圆角系统

### 统一圆角风格
- **大圆角**: `rounded-2xl` (1rem) - 卡片、容器
- **超大圆角**: `rounded-3xl` (1.5rem) - 大型卡片、CTA区域
- **胶囊按钮**: `rounded-full` - 所有按钮

### 保持一致性
- 圆角大小一经定义，全站统一使用
- 禁止混用不同级别的圆角

## 阴影系统

### 简化阴影
- **卡片阴影**: `shadow-card` (已定义为 `none`)
- **禁止**: 多层阴影、color 阴影、glow 效果

### 原则
- 极简风格依赖边框和背景色区分层次
- 阴影仅在必要时使用

## 边框系统

### 卡片边框
- 默认: `border border-gray-200`
- Hover: `hover:border-gray-300`

### 按钮边框
- 次要按钮: `border border-gray-200`
- Hover: `hover:border-gray-300`

## 网格背景

### 科技感网格
```css
background-image: 
  linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
background-size: 60px 60px;
```

### 使用位置
- Hero 区域背景
- 保持纯色线条，不要渐变遮罩

## 组件规范

### 按钮

**主按钮**
- 背景: `bg-dark-100`
- 文字: 白色
- 圆角: `rounded-full`
- Hover: `hover:bg-dark-300`

**次要按钮**
- 背景: `bg-white`
- 边框: `border border-gray-200`
- Hover: `hover:bg-gray-50 hover:border-gray-300`

### 卡片

**无阴影**，纯边框风格：
```html
<div class="bg-white rounded-2xl border border-gray-200 p-6">
```

### 标签/徽章

**辅助标签**
- `bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs`

**强调标签**
- `bg-primary-500/10 text-primary-600 px-3 py-1 rounded-full text-xs ring-1 ring-primary-500/20`

## 动画风格

### 淡入动画
```css
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
```

### 过渡时长
- 默认: `duration-200`
- 卡片: `duration-300`

### 禁止
- 弹跳效果 (bounce)
- 发光脉冲 (glow-pulse)
- 复杂3D变换

## 布局规范

### 容器
```css
.container-custom {
  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

### 间距
- Section 间距: `py-16 lg:py-24`
- 卡片间距: `gap-6` 或 `gap-8`

## 禁止使用

以下元素在设计中严格禁止：

1. ❌ 渐变背景或渐变文字
2. ❌ 模糊 (blur) 或发光 (glow) 装饰
3. ❌ 多层阴影
4. ❌ 彩色进度条（统一使用 `bg-gray-900`）
5. ❌ 彩色图标背景（如 `bg-blue-50`）
6. ❌ 动画弹跳或复杂变换

## 更新日志

- **2026-04-10**: 初始版本，定义极简科技风格规范
- **2026-04-10 (下午)**: 增强卡片边框颜色由 `gray-100` 改为 `gray-200`，hover 由 `gray-200` 改为 `gray-300`