import type { HeadConfig } from 'vitepress'

const head: HeadConfig[] = [
  // 引入 Gitalk CDN
  ['script', { src: 'https://unpkg.com/gitalk@1.8.0/dist/gitalk.min.js' }],
  ['link', { rel: 'stylesheet', href: 'https://unpkg.com/gitalk@1.8.0/dist/gitalk.css' }],
  // 引入 RoughNotation CDN (IIFE 格式)
  ['script', { src: 'https://unpkg.com/rough-notation@0.5.1/lib/rough-notation.iife.js' }],
]

export default head
