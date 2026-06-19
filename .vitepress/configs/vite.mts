import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { RSSOptions, RssPlugin } from 'vitepress-plugin-rss'

const RSS: RSSOptions = {
  title: '冰冻大西瓜',
  baseUrl: 'https://bddxg.top',
  copyright: '奇迹不过是努力的另一个名字，愿机会永远对你有利(｡･∀･)ﾉﾞ',
}

/** @type {import('vite').UserConfig} */
export default {
  plugins: [groupIconVitePlugin(), RssPlugin(RSS)],
  server: {
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      external: ['gitalk', 'rough-notation'],
      output: {
        globals: {
          gitalk: 'Gitalk',
          'rough-notation': 'RoughNotation',
        },
      },
    },
  },
}
