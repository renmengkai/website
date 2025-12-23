import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'k2j30muc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// GROQ 查询：获取所有博客文章
export const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "coverImage": coverImage.asset->url,
  "author": author->{name, "avatar": avatar.asset->url},
  categories[]->{title, slug}
}`;

// GROQ 查询：获取单篇博客文章
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  body,
  publishedAt,
  "coverImage": coverImage.asset->url,
  "author": author->{name, bio, "avatar": avatar.asset->url},
  categories[]->{title, slug}
}`;

// GROQ 查询：获取所有项目
export const projectsQuery = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  slug,
  description,
  "thumbnail": thumbnail.asset->url,
  technologies,
  liveUrl,
  githubUrl,
  featured
}`;

// GROQ 查询：获取单个项目
export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  body,
  "thumbnail": thumbnail.asset->url,
  "gallery": gallery[].asset->url,
  technologies,
  liveUrl,
  githubUrl,
  featured
}`;

// GROQ 查询：获取关于页面内容
export const aboutQuery = `*[_type == "about"][0] {
  title,
  bio,
  "avatar": avatar.asset->url,
  skills,
  experience,
  education,
  social
}`;

// GROQ 查询：获取精选内容（首页用）
export const featuredContentQuery = `{
  "posts": *[_type == "post"] | order(publishedAt desc)[0...3] {
    _id, title, slug, excerpt, publishedAt, "coverImage": coverImage.asset->url
  },
  "projects": *[_type == "project" && featured == true] | order(order asc)[0...3] {
    _id, title, slug, description, "thumbnail": thumbnail.asset->url, technologies
  }
}`;

// 获取数据的辅助函数
export async function fetchSanity<T>(query: string, params = {}): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw error;
  }
}