# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Development
- `npm run dev` - Start Astro frontend dev server (http://localhost:4321)
- `npm run sanity-dev` - Start Sanity CMS Studio (http://localhost:3333)

Run these in separate terminals for simultaneous frontend and CMS development.

### Build & Deploy
- `npm run build` - Build Astro static site to `dist/`
- `npm run build-cms` - Build Sanity CMS and deploy to `public/cms/` (removes old `public/cms`, builds, then moves `sanity/dist/` → `public/cms/`)
- `npm run preview` - Preview production build locally

For production deployment, run both `npm run build` and `npm run build-cms`, then deploy the `dist/` directory. The CMS will be accessible at `/cms` path.

### Project Setup
- Root `npm install` - Install Astro dependencies
- `cd sanity && npm install` - Install Sanity CMS dependencies (separate package.json)

## Architecture

This is a hybrid static site using **Astro** for the frontend and **Sanity CMS** for headless content management.

### Tech Stack
- **Frontend**: Astro (static output), Vue.js components, Tailwind CSS
- **CMS**: Sanity Studio with custom schemas
- **Deployment**: Static site generation to `dist/`

### Key Architectural Points

**Dual Package Structure**: The `sanity/` directory has its own `package.json` and dependencies. When installing root dependencies, you must also run `cd sanity && npm install`.

**Sanity Integration**:
- Client configured in `src/lib/sanity.ts` with project ID `k2j30muc`, dataset `production`
- GROQ queries defined as exports in `src/lib/sanity.ts`:
  - `postsQuery` - All blog posts
  - `postBySlugQuery` - Single post by slug
  - `projectsQuery` - All projects (ordered by `order` field)
  - `projectBySlugQuery` - Single project by slug
  - `aboutQuery` - About page content
  - `featuredContentQuery` - Featured posts and projects for homepage
- Helper function `fetchSanity<T>()` wraps Sanity client fetch

**Astro Configuration**:
- Static output mode (`output: 'static'`)
- Site URL: `https://www.mengkai.ren`
- Vite SSR config marks `@sanity/client` as non-external for compatibility
- Integrations: Vue.js, Tailwind CSS

**Page Structure**:
- `src/pages/index.astro` - Homepage
- `src/pages/blog/index.astro` - Blog listing
- `src/pages/blog/[slug].astro` - Blog post detail
- `src/pages/projects/index.astro` - Projects listing
- `src/pages/projects/[slug].astro` - Project detail
- `src/pages/about.astro` - About page
- `src/pages/cms.astro` - CMS redirect/iframe page
- `src/layouts/Layout.astro` - Base layout with Header/Footer, SEO meta tags

**Component Organization**:
- `src/components/` - Vue and Astro components (Hero, Header, Footer, PostCard, ProjectCard, ThemeToggle)
- `src/components/ui/` - Reusable UI components (Badge, Card, Button, SectionTitle)

**Sanity Schemas** (`sanity/schemaTypes/`):
- `post.ts` - Blog articles with title, excerpt, body, coverImage, author, categories, publishedAt
- `project.ts` - Projects with title, description, body, thumbnail, gallery, technologies, liveUrl, githubUrl, featured flag, order field
- `author.ts` - Author profiles with name, bio, avatar, social links
- `category.ts` - Post categories
- `about.ts` - About page with bio, avatar, skills, experience, education, social
- `blockContent.ts` - Portable Text rich content schema

**Content Fetching Pattern**: Astro pages use the `fetchSanity()` helper with predefined GROQ queries at build time to fetch data from Sanity, then render statically.

### CMS Deployment Workflow

The CMS is built as a static SPA and deployed to `public/cms/` so it's accessible at the same domain after deployment. The `build-cms` script handles this automatically.
