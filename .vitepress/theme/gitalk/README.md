# Gitalk 配置指南

## 1. 创建 GitHub OAuth App

1. 前往 [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: 你的博客名称
   - **Homepage URL**: 你的博客域名 (如: `https://yourdomain.com`)
   - **Authorization callback URL**: 你的博客域名 (如: `https://yourdomain.com`)
4. 创建后获得 `Client ID` 和 `Client Secret`

## 2. 修改配置文件

编辑 `config.ts` 文件中的配置：

```typescript
export const gitalkConfig: GitalkConfig = {
  clientID: 'your-github-client-id', // 替换为你的 Client ID
  clientSecret: 'your-github-client-secret', // 替换为你的 Client Secret
  repo: 'your-repo-name', // 替换为你的仓库名
  owner: 'your-github-username', // 替换为你的 GitHub 用户名
  admin: ['your-github-username'] // 替换为管理员用户名数组
  // ... 其他配置
}
```

## 3. 环境变量（推荐）

为了安全起见，建议使用环境变量：

1. 创建 `.env` 文件：

```bash
GITALK_CLIENT_ID=your_client_id_here
GITALK_CLIENT_SECRET=your_client_secret_here
```

2. 在 `vite.config.ts` 或 `.vitepress/config.ts` 中配置环境变量：

```typescript
export default defineConfig({
  define: {
    'process.env.GITALK_CLIENT_ID': JSON.stringify(process.env.GITALK_CLIENT_ID),
    'process.env.GITALK_CLIENT_SECRET': JSON.stringify(process.env.GITALK_CLIENT_SECRET)
  }
})
```

## 4. 仓库设置

确保你的 GitHub 仓库：

- 已开启 Issues 功能
- 是公开的（Private 仓库需要特殊配置）

## 5. 初始化评论

第一次访问页面时，需要你（管理员）登录 GitHub 来初始化评论系统。

## 6. 自定义配置

你可以在 `config.ts` 中调整更多配置：

- `language`: 界面语言（'zh-CN', 'en'等）
- `perPage`: 每页显示评论数
- `distractionFreeMode`: 专注模式
- `proxy`: 代理地址（解决网络问题）

## 7. 样式自定义

在 `gitalk.css` 中可以自定义样式，已经适配了 VitePress 的主题变量。

## 故障排除

### 常见问题

1. **Error: Not Found** - 检查仓库名和用户名是否正确
2. **Error: Validation Failed** - 检查 OAuth App 的回调地址是否正确
3. **网络问题** - 可以配置代理或使用镜像站点

### 调试

在浏览器控制台查看错误信息，常见错误：

- CORS 错误：检查 OAuth App 配置
- 网络错误：考虑使用代理
- 权限错误：确保仓库 Issues 已开启

## 参考资源

- [Gitalk 官方文档](https://github.com/gitalk/gitalk)
- [GitHub OAuth Apps 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
