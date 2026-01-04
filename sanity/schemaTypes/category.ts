import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: '分类',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '路径别名',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'usedFor',
      title: '适用范围',
      description: '该分类用于哪个内容类型',
      type: 'string',
      options: {
        list: [
          { title: '博客文章 (Blog)', value: 'blog' },
          { title: '项目作品 (Projects)', value: 'projects' },
          { title: '两者通用 (Both)', value: 'both' },
        ],
        layout: 'radio',
      },
      initialValue: 'blog',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '描述',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      usedFor: 'usedFor',
    },
    prepare({ title, usedFor }) {
      const labels: Record<string, string> = {
        blog: '📝 Blog',
        projects: '🛠️ Projects',
        both: '🌐 Both',
      };
      return {
        title,
        subtitle: labels[usedFor] || usedFor,
      };
    },
  },
})