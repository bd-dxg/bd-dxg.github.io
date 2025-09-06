import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'

export default {
  lineNumbers: true,
  theme: {
    light: 'material-theme-lighter' as const,
    dark: 'material-theme-darker' as const
  },
  image: {
    lazyLoading: true
  },
  config(md: any) {
    md.use(groupIconMdPlugin)
  }
}
