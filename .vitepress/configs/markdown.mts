import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'

export default {
  lineNumbers: true,
  image: {
    lazyLoading: true,
  },
  config(md: any) {
    md.use(groupIconMdPlugin)
  },
}
