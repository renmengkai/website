import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: '作者',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '姓名',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
  },
})
