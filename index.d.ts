/// <reference types="vitepress/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface GitalkConfig {
  clientID: string
  clientSecret: string
  repo: string
  owner: string
  admin: string[]
  labels: string[]
  distractionFreeMode?: boolean
  proxy?: string
  language?: string
  perPage?: number
  pagerDirection?: string
  createIssueManually?: boolean
  enableHotKey?: boolean
}
