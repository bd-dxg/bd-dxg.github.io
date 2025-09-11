import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'

export default {
  image: {
    lazyLoading: true
  },
  config(md: any) {
    md.use(groupIconMdPlugin)
  }
}
