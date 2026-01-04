import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: '项目作品',
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
      name: 'description',
      title: '简介',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'thumbnail',
      title: '缩略图',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: '图片集',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'categories',
      title: '分类',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'technologies',
      title: '技术栈',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'liveUrl',
      title: '在线地址',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub 地址',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: '精选推荐',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
    }),
    defineField({
      name: 'body',
      title: '正文内容',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { 
          type: 'object',
          name: 'code',
          title: '代码块',
          fields: [
            {
              name: 'language',
              type: 'string',
              title: '语言'
            },
            {
              name: 'code',
              type: 'text',
              title: '代码'
            }
          ]
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'thumbnail' },
  },
})