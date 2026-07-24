import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { type MarkdownOptions } from 'vitepress'

const markdown: MarkdownOptions = {
  lineNumbers: true,
  image: {
    lazyLoading: true,
  },
  config(md: any) {
    md.use(groupIconMdPlugin)
  },
}

export default markdown