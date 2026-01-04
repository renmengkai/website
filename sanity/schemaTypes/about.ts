import { defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: '关于',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
    }),
    defineField({
      name: 'avatar',
      title: '头像',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: '个人简介',
      type: 'text',
    }),
    defineField({
      name: 'skills',
      title: '技能',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: '技能名称' },
            { name: 'level', type: 'number', title: '熟练程度 (0-100)' },
          ],
        },
      ],
    }),
    defineField({
      name: 'experience',
      title: '工作经历',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'company', type: 'string', title: '公司' },
            { name: 'role', type: 'string', title: '职位' },
            { name: 'period', type: 'string', title: '时间段' },
            { name: 'description', type: 'text', title: '工作描述' },
          ],
        },
      ],
    }),
    defineField({
      name: 'social',
      title: '社交链接',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: '平台名称' },
            { name: 'url', type: 'url', title: '链接地址' },
            { name: 'icon', type: 'string', title: '图标名称' },
          ],
        },
      ],
    }),
  ],
})