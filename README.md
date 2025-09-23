# 冰冻大西瓜的个人博客

[![Deploy](https://github.com/bd-dxg/bd-dxg.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/bd-dxg/bd-dxg.github.io/actions/workflows/deploy.yml)
[![VitePress](https://img.shields.io/badge/VitePress-2.0-blue)](https://vitepress.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.5-green)](https://vuejs.org/)
[![License](https://img.shields.io/badge/License-GPL--3.0-red)](LICENSE)

基于 VitePress 构建的现代化个人博客，集成了手绘风格样式和评论系统，支持自动化部署。

🔗 **在线访问**: [https://bd-dxg.github.io](https://bd-dxg.github.io)

## ✨ 特性

- 📝 **VitePress 驱动** - 基于 Vue 3 + Vite 的静态站点生成器
- 🎨 **Rough Notation 手绘风格** - 独特的手绘标注样式，让内容更生动
- 💬 **Gitalk 评论系统** - 基于 GitHub Issues 的评论功能
- 🌙 **主题适配** - 完美支持亮色/暗色主题切换
- 📱 **响应式设计** - 优雅适配移动端和桌面端
- 🚀 **自动化部署** - GitHub Actions 自动构建和部署到 GitHub Pages
- 🔍 **全文搜索** - 内置搜索功能
- 📊 **SEO 优化** - 完整的 meta 标签和站点地图

## 🎯 技术栈

- **框架**: VitePress 2.0 + Vue 3.5
- **包管理**: pnpm
- **样式**: CSS + TypeScript
- **评论**: Gitalk
- **动画**: Rough Notation
- **部署**: GitHub Actions + GitHub Pages

## 🏗️ 项目结构

```
.
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 部署配置
├── .vitepress/
│   ├── config.mts             # VitePress 主配置
│   ├── configs/               # 配置文件模块
│   └── theme/                 # 自定义主题
│       ├── gitalk/            # Gitalk 评论系统
│       │   ├── config.ts      # Gitalk 配置
│       │   ├── gitalkLayout.vue
│       │   ├── gitalk.css     # 样式定制
│       │   └── README.md      # 配置说明
│       ├── rough-notation/    # 手绘标注功能
│       │   ├── rough-notation-plugin.ts
│       │   └── rough-notation.css
│       ├── index.ts           # 主题入口
│       └── style.css          # 全局样式
├── Article/                   # 文章内容目录
└── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 🔧 配置说明

### Gitalk 评论系统

1. 在 GitHub 创建 OAuth App
2. 配置环境变量：
   ```env
   VITE_GITALK_CLIENT_ID=your_client_id
   VITE_GITALK_CLIENT_SECRET=your_client_secret
   ```
3. 详细配置请参考：[Gitalk 配置指南](./.vitepress/theme/gitalk/README.md)

### Rough Notation 手绘样式

- 支持多种标注类型：下划线、框选、圆圈、高亮等
- 自动适配主题色彩
- 响应式动画效果

### 自动化部署

项目配置了 GitHub Actions，当代码推送到 `main` 分支时自动：

1. 安装依赖（使用 pnpm）
2. 构建静态网站
3. 部署到 GitHub Pages

需要在仓库 Settings > Secrets 中配置：
- `GITALK_CLIENT_ID`
- `GITALK_CLIENT_SECRET`

## 📝 写作

文章放在 `Article/` 目录下，支持：

- Markdown 语法
- Vue 组件
- 代码高亮
- 数学公式
- 图表展示

### 使用 Rough Notation

Rough Notation 已自动适配 Markdown 语法，无需手动添加类名：

```markdown
**加粗文本** - 自动应用手绘高亮效果
*斜体文本* - 自动应用手绘下划线效果
`行内代码` - 自动应用手绘方框效果
> 引用内容 - 自动应用手绘左括号效果
~~删除线~~ - 自动应用手绘删除效果
[链接文本](url) - 自动应用手绘下划线效果
```

还支持自定义数据属性进行更精细的控制：

```html
<span data-notation="highlight">自定义高亮</span>
<span data-notation="circle">圆圈标注</span>
<span data-notation="box">方框标注</span>
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[GPL-3.0](LICENSE) © bd-dxg

## 🙏 致谢

- [VitePress](https://vitepress.dev/) - 优秀的静态站点生成器
- [Gitalk](https://github.com/gitalk/gitalk) - 基于 GitHub Issues 的评论组件
- [Rough Notation](https://roughnotation.com/) - 手绘风格标注库
