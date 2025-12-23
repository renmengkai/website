import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'

// 添加额外的schema类型
import { project } from './project'
import { about } from './about'

export const schemaTypes = [post, author, category, blockContent, project, about]