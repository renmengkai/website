import {defineType, defineArrayMember} from 'sanity'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: '富文本内容',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: '文本块',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        {title: '正常', value: 'normal'},
        {title: '标题 1', value: 'h1'},
        {title: '标题 2', value: 'h2'},
        {title: '标题 3', value: 'h3'},
        {title: '标题 4', value: 'h4'},
        {title: '引用', value: 'blockquote'},
      ],
      lists: [
        {title: '无序列表', value: 'bullet'},
        {title: '有序列表', value: 'number'},
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          {title: '加粗', value: 'strong'},
          {title: '斜体', value: 'em'},
          {title: '代码', value: 'code'},
          {title: '下划线', value: 'underline'},
          {title: '删除线', value: 'strike-through'},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: '链接',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: '链接地址',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
    }),
    defineArrayMember({
      type: 'code',
      title: '代码块',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'Python', value: 'python'},
          {title: 'Java', value: 'java'},
          {title: 'C++', value: 'cpp'},
          {title: 'C#', value: 'csharp'},
          {title: 'Go', value: 'go'},
          {title: 'Rust', value: 'rust'},
          {title: 'PHP', value: 'php'},
          {title: 'Ruby', value: 'ruby'},
          {title: 'Shell', value: 'sh'},
          {title: 'Bash', value: 'bash'},
          {title: 'SQL', value: 'sql'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'JSON', value: 'json'},
          {title: 'YAML', value: 'yaml'},
          {title: 'Markdown', value: 'markdown'},
          {title: 'Docker', value: 'dockerfile'},
        ],
        withFilename: true,
      },
    }),
  ],
})