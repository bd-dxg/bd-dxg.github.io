# Gitalk 配置指南

## 1. 创建 GitHub OAuth App

1. 前往 [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: 你的博客名称
   - **Homepage URL**: 你的博客域名 (如: `https://yourdomain.com`)
   - **Authorization callback URL**: 你的博客域名 (如: `https://yourdomain.com`)
4. 创建后获得 `Client ID` 和 `Client Secret`

## 2. 环境变量配置（必需）

### 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
VITE_GITALK_CLIENT_ID=your_client_id_here
VITE_GITALK_CLIENT_SECRET=your_client_secret_here
```

**注意**:

- 使用 `VITE_` 前缀，这样 Vite 会自动注入这些变量
- 确保将 `.env` 文件添加到 `.gitignore` 中，避免提交敏感信息

## 3. 修改配置文件

编辑 `config.ts` 文件中的配置：

```typescript
export const gitalkConfig: GitalkConfig = {
  // GitHub OAuth App 配置 - 使用环境变量
  clientID: import.meta.env.VITE_GITALK_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GITALK_CLIENT_SECRET,

  // GitHub 仓库配置
  repo: 'your-repo-name', // 替换为你的仓库名
  owner: 'your-github-username', // 替换为你的 GitHub 用户名
  admin: ['your-github-username'], // 替换为管理员用户名数组
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
```

## 4. 文件结构说明

当前 Gitalk 配置包含以下文件：

```
.vitepress/theme/gitalk/
├── config.ts          # 主配置文件
├── gitalkLayout.vue    # Vue 组件实现
├── gitalk.css         # 样式定制文件
└── README.md          # 配置说明文档
```

### 核心功能

- **自动路由识别**: 自动根据页面路径生成唯一 ID
- **主题适配**: 完全适配 VitePress 的亮色/暗色主题
- **响应式设计**: 针对移动设备优化
- **Vue 3 兼容**: 使用 Composition API 编写

## 5. 仓库设置

确保你的 GitHub 仓库：

- 已开启 Issues 功能
- 是公开的（Private 仓库需要特殊配置）

## 6. 初始化评论

第一次访问页面时，需要你（管理员）登录 GitHub 来初始化评论系统。系统会自动为每个页面创建对应的 GitHub Issue。

## 7. 配置选项详解

### 必需配置

- `clientID`: GitHub OAuth App 的 Client ID
- `clientSecret`: GitHub OAuth App 的 Client Secret
- `repo`: GitHub 仓库名
- `owner`: 仓库所有者用户名
- `admin`: 管理员用户名数组

### 可选配置

- `labels`: GitHub Issue 标签（默认: `['Gitalk']`）
- `language`: 界面语言（默认: `'zh-CN'`）
- `perPage`: 每页显示评论数（默认: `10`）
- `distractionFreeMode`: 专注模式（默认: `false`）
- `pagerDirection`: 分页方向（默认: `'last'`）
- `createIssueManually`: 手动创建 Issue（默认: `true`）
- `enableHotKey`: 启用快捷键（默认: `true`）
- `proxy`: 代理地址（解决网络问题，可选）

## 8. 样式自定义

在 `gitalk.css` 中已经适配了 VitePress 的主题变量：

- 自动适配亮色/暗色主题
- 使用 VitePress 的品牌色彩
- 响应式设计
- 代码块和引用块样式适配

你可以根据需要修改 CSS 变量来自定义样式。

## 9. 故障排除

### 常见问题

1. **Error: Not Found** - 检查仓库名和用户名是否正确
2. **Error: Validation Failed** - 检查 OAuth App 的回调地址是否正确
3. **环境变量未加载** - 确保环境变量使用 `VITE_` 前缀
4. **网络问题** - 可以配置代理或使用镜像站点
5. **页面路由问题** - 检查 Vue 组件是否正确集成到 VitePress 主题中

### 调试方法

1. **检查环境变量**:

   ```javascript
   console.log('Client ID:', import.meta.env.VITE_GITALK_CLIENT_ID)
   // 注意：不要在生产环境中打印 Client Secret
   ```

2. **查看浏览器控制台**:
   - CORS 错误：检查 OAuth App 配置
   - 网络错误：考虑使用代理
   - 权限错误：确保仓库 Issues 已开启

3. **验证配置**:
   - 确认 GitHub 仓库存在且可访问
   - 确认 OAuth App 回调地址正确
   - 确认环境变量已正确设置

## 10. 集成到 VitePress

要在 VitePress 中使用此 Gitalk 组件，请在你的自定义主题或页面中引入：

```vue
<template>
  <div>
    <!-- 你的页面内容 -->
    <GitalkLayout />
  </div>
</template>

<script setup>
import GitalkLayout from './.vitepress/theme/gitalk/gitalkLayout.vue'
</script>
```

## 参考资源

- [Gitalk 官方文档](https://github.com/gitalk/gitalk)
- [GitHub OAuth Apps 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
