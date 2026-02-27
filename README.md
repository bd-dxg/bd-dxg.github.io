# 冰冻大西瓜的个人博客

[![Deploy](https://github.com/bd-dxg/bd-dxg.github.io/actions/workflows/deploy-github-pages.yml/badge.svg)](https://github.com/bd-dxg/bd-dxg.github.io/actions/workflows/deploy.yml)
[![VitePress](https://img.shields.io/badge/VitePress-2.0.0--alpha.15-blue)](https://vitepress.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.5-green)](https://vuejs.org/)
[![License](https://img.shields.io/badge/License-AGPL--3.0-red)](LICENSE)

基于 VitePress 构建的现代化个人博客，集成了手绘风格样式、评论系统和多种交互效果，支持自动化部署。

🔗 **在线访问**: [https://bd-dxg.github.io](https://bd-dxg.github.io)

## ✨ 特性

- 📝 **VitePress 驱动** - 基于 Vue 3 + Vite 的静态站点生成器
- 🎨 **Rough Notation 手绘风格** - 独特的手绘标注样式，让内容更生动
- 💬 **Gitalk 评论系统** - 基于 GitHub Issues 的评论功能
- 📱 **响应式设计** - 优雅适配移动端和桌面端
- 🚀 **自动化部署** - GitHub Actions 自动构建和部署到 GitHub Pages
- 🔍 **全文搜索** - 内置搜索功能
- 📊 **SEO 优化** - 完整的 meta 标签和站点地图
- 🎯 **性能优化** - Gitalk 和 Rough Notation 通过 CDN 引入，减少打包体积
- ✨ **交互增强** - 页面宽度平滑过渡、按钮扫光效果、自定义选中文字样式
- 🖼️ **视觉优化** - 首页背景图、版权提示功能
- ⚡ **动画控制** - 覆盖系统"减少动画"设置，强制显示动画效果
- 🛠️ **Sidebar 自动化** - 自动生成侧边栏配置，减少手动维护

## 🎯 技术栈

- **框架**: VitePress 2.0.0-alpha.15 + Vue 3.5
- **包管理**: bun
- **样式**: CSS
- **评论**: Gitalk (CDN 引入)
- **动画**: Rough Notation (CDN 引入)
- **部署**: GitHub Actions + GitHub Pages
- **工具**: Prettier + TypeScript

## 🏗️ 项目结构

```
.
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 部署配置
├── .vitepress/
│   ├── config.mts             # VitePress 主配置
│   ├── configs/               # 配置文件模块（head 配置等）
│   ├── theme/                 # 自定义主题
│   │   ├── gitalk/            # Gitalk 评论系统
│   │   │   ├── config.ts      # Gitalk 配置
│   │   │   ├── gitalkLayout.vue
│   │   │   ├── gitalk.css     # 样式定制
│   │   │   └── README.md      # 配置说明
│   │   ├── rough-notation/    # 手绘标注功能
│   │   │   ├── rough-notation-plugin.ts
│   │   │   └── rough-notation.css
│   │   ├── utils/             # 工具函数
│   │   ├── assets/            # 静态资源
│   │   ├── custom.css         # 自定义样式
│   │   ├── index.ts           # 主题入口
│   │   └── style.css          # 全局样式
│   └── sidebar.config.ts      # Sidebar 自动化生成配置
├── scripts/                   # 工具脚本
│   └── generateSidebar.ts     # Sidebar 自动生成脚本
├── Article/                   # 文章内容目录
│   ├── InterviewQ/            # 面试题系列
│   │   ├── Frontend/          # 前端面试题
│   │   ├── Backend/           # 后端面试题
│   │   └── TheWayofCode/      # 代码之道（GitFlow 工作流等）
│   ├── Lives/                 # 程序员成长感悟
│   ├── Tips/                  # 实用工具配置
│   └── components/            # 自定义组件
├── package.json
├── prettier.config.js         # 代码格式化配置
└── tsconfig.json              # TypeScript 配置
```

## 🔧 配置说明

### Gitalk 评论系统

1. 在 GitHub 创建 OAuth App
2. 配置环境变量：
   ```env
   VITE_GITALK_CLIENT_ID=your_client_id
   VITE_GITALK_CLIENT_SECRET=your_client_secret
   ```
3. **注意**: Gitalk 已改为 CDN 引入，无需安装依赖包
4. 详细配置请参考：[Gitalk 配置指南](./.vitepress/theme/gitalk/README.md)

### Rough Notation 手绘样式

- 支持多种标注类型：下划线、框选、圆圈、高亮等
- 自动适配主题色彩
- 响应式动画效果
- **注意**: Rough Notation 已改为 CDN 引入，无需安装依赖包

### 自动化部署

项目配置了 GitHub Actions，当代码推送到 `main` 分支时自动：

1. 安装依赖（使用 bun）
2. 构建静态网站
3. 部署到 GitHub Pages

需要在仓库 Settings > Secrets 中配置：

- `GITALK_CLIENT_ID`
- `GITALK_CLIENT_SECRET`

### 新增功能配置

#### 版权提示功能

- **复制内容追加版权**: 当用户复制文章内容时，自动在剪切板内容末尾追加版权信息
- **首页底部版权**: 在网站首页底部显示版权信息
- **支持自定义版权文本**

#### 交互效果

- **页面宽度平滑过渡**: 窗口大小变化时内容平滑过渡
- **按钮扫光效果**: 主页按钮添加扫光动画
- **自定义选中文字样式**: 优化文字选中视觉效果
- **强制动画显示**: 覆盖系统"减少动画"设置，确保动画效果正常显示

#### 视觉优化

- **首页背景图**: 添加个性化背景图
- **配置模块化**: head 配置分离到单文件，便于维护

### 文章 Frontmatter

所有文章建议添加 Frontmatter 以增强 SEO 和页面信息：

```yaml
---
title: 文章标题
description: 文章描述
---
```

**提示**: 使用 `/add-frontmatter` 技能可自动为 Markdown 文章添加 Frontmatter

### Rough Notation 手绘样式

Rough Notation 已自动适配 Markdown 语法，无需手动添加类名：

```markdown
_斜体文本_ - 自动应用手绘下划线效果
`行内代码` - 自动应用手绘方框效果

> 引用内容 - 自动应用手绘左括号效果
> ~~删除线~~ - 自动应用手绘删除效果
> [链接文本](url) - 自动应用手绘下划线效果
```

## 📄 许可证

[AGPL-3.0](LICENSE) © bd-dxg

## 🙏 致谢

- [VitePress](https://vitepress.dev/) - 优秀的静态站点生成器
- [Gitalk](https://github.com/gitalk/gitalk) - 基于 GitHub Issues 的评论组件
- [Rough Notation](https://roughnotation.com/) - 手绘风格标注库
