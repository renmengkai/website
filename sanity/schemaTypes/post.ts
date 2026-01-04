import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: '博客文章',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '摘要',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: '封面图',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'author',
      title: '作者',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'categories',
      title: '分类',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: '正文内容',
      type: 'text',
      description: '支持直接粘贴 Markdown 内容，包括代码块、标题、列表等',
      rows: 30,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
    },
  },
})