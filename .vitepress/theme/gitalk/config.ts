// Gitalk配置文件
export const gitalkConfig: GitalkConfig = {
  // GitHub OAuth App 配置 - 需要你在 GitHub 创建 OAuth App 后填入
  clientID: import.meta.env.VITE_GITALK_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GITALK_CLIENT_SECRET,

  // GitHub 仓库配置
  repo: 'bd-dxg.github.io', // 仓库名
  owner: 'bd-dxg', // 仓库所有者
  admin: ['bd-dxg'], // 管理员用户名数组
  labels: ['Gitalk'], // GitHub issue 标签

  // 其他配置
  distractionFreeMode: false, // 专注模式
  language: 'zh-CN', // 语言
  perPage: 10, // 每页评论数
  pagerDirection: 'last', // 排序方式
  createIssueManually: true, // 手动创建issue
  enableHotKey: true, // 启用快捷键

  // 代理配置（可选，用于解决网络问题）
  // proxy: 'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
}

// 生成页面唯一ID的函数
export function generatePageId(path: string): string {
  return (
    path
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .replace(/\.html$/, '')
      .substring(0, 50) || // GitHub label长度限制
    'index'
  )
}

// 获取页面标题的函数
export function getPageTitle(): string {
  return document?.title || 'Blog Post'
}

// 生成评论区描述的函数
export function generateBody(title: string, path: string): string {
  return `评论区 - ${title}\n\n页面路径: ${path}\n\n欢迎在此讨论！`
}
