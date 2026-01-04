import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'website',

  projectId: 'k2j30muc',
  dataset: 'production',

  // 设置基础路径为 /cms，这样构建的静态文件会使用正确的资源路径
  // 这个配置会在构建时被使用
  basePath: '/cms',
  studio: {
    components: {
      logo: () => null,
    }
  },

  plugins: [
    structureTool(),
    visionTool(),
    codeInput()
  ],

  schema: {
    types: schemaTypes,
  },

  // 静态构建时的基础路径
  // 注意：这个选项需要在构建时通过环境变量或 CLI 参数传递
})
