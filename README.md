# 个人网站项目

一个基于 Astro 和 Sanity CMS 构建的个人网站项目，包含博客、项目展示和个人介绍等功能。

## 技术栈

- **前端框架**: [Astro](https://astro.build/)
- **CMS**: [Sanity](https://www.sanity.io/)
- **UI 框架**: Tailwind CSS
- **组件库**: Vue.js
- **部署**: 静态站点生成

## 项目结构

```
website/
├── sanity/                 # Sanity CMS 配置和 Schema
│   ├── schemaTypes/        # 数据模型定义
│   │   ├── post.ts         # 博客文章 Schema
│   │   ├── project.ts      # 项目 Schema
│   │   ├── author.ts       # 作者 Schema
│   │   ├── category.ts     # 分类 Schema
│   │   ├── about.ts        # 关于页面 Schema
│   │   └── ...             # 其他 Schema
│   ├── sanity.config.ts    # Sanity 配置文件
│   └── package.json        # Sanity 依赖
├── src/                    # Astro 前端源码
│   ├── components/         # Vue 组件
│   ├── lib/                # 工具库
│   │   └── sanity.ts       # Sanity 客户端配置
│   └── styles/             # 样式文件
├── public/                 # 静态资源
├── astro.config.mjs        # Astro 配置
└── package.json            # 项目依赖
```

## 功能特性

- **博客系统**: 基于 Sanity CMS 的博客文章管理
- **项目展示**: 个人项目展示页面
- **内容管理**: 使用 Sanity Studio 进行内容编辑
- **响应式设计**: 支持移动设备访问
- **静态生成**: 高性能的静态站点部署

## 开发环境设置

1. 克隆项目到本地：

```bash
git clone <repository-url>
cd website
```

2. 安装依赖：

```bash
npm install
```

3. 进入 sanity 目录安装依赖：

```bash
cd sanity && npm install
```

## 本地开发

### 启动前端开发服务器

```bash
npm run dev
```

### 启动 Sanity CMS

```bash
npm run sanity-dev
```

### 同时启动前端和 CMS

分别在两个终端中运行：

终端 1（前端）：
```bash
npm run dev
```

终端 2（CMS）：
```bash
npm run sanity-dev
```

## 构建与部署

### 构建前端应用

```bash
npm run build
```

### 构建 CMS 并部署到 public/cms

```bash
npm run build-cms
```

此命令会：
1. 构建 Sanity Studio
2. 删除旧的 public/cms 目录
3. 将构建好的 CMS 移动到 public/cms 目录

### 完整构建流程

```bash
# 构建前端
npm run build

# 构建 CMS
npm run build-cms
```

## 项目配置

### Sanity 配置

- **Project ID**: k2j30muc
- **Dataset**: production
- **API Version**: 2024-01-01
- **CDN**: 启用

### Schema 类型

项目定义了以下数据类型：

- **Post**: 博客文章
  - 标题、摘要、内容
  - 发布日期、封面图片
  - 作者、分类信息

- **Project**: 个人项目
  - 标题、描述、技术栈
  - 演示链接、GitHub 链接
  - 缩略图、相册

- **Author**: 作者信息
  - 姓名、头像、简介
  - 社交链接

- **Category**: 文章分类

- **About**: 关于页面内容

### API 查询

项目使用 GROQ 查询语言从 Sanity 获取数据，包括：

- 博客文章列表和详情
- 项目列表和详情
- 关于页面内容
- 精选内容查询

## 部署说明

1. 构建前端应用: `npm run build`
2. 构建 CMS: `npm run build-cms`
3. 将 `dist` 目录部署到静态托管服务（如 Netlify、Vercel、GitHub Pages 等）
4. CMS 将部署在 `/cms` 路径下

## 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT