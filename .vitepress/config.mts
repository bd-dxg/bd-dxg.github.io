import { defineConfig } from 'vitepress'
import { markdown, nav, sidebar, search, footer, vite, head } from './configs/index.mts'

export default defineConfig({
  srcDir: 'Article',
  lang: 'zh-CN',
  title: '冰冻大西瓜',
  titleTemplate: false,
  description: '个人博客,前端技术,JavaScript,Typescript,Vue3,React,Node,小程序,面试题',
  head,
  markdown,
  vite,
  themeConfig: {
    nav,
    sidebar,
    search,
    footer,
    logo: 'https://images.bddxg.top/blog/1762394897704.png',
    outline: 'deep',
    outlineTitle: '文章目录',
    lastUpdatedText: '更新于',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },
})
