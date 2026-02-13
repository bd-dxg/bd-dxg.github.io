# 冰冻大西瓜的个人博客

[![Deploy](https://github.com/bd-dxg/bd-dxg.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/bd-dxg/bd-dxg.github.io/actions/workflows/deploy.yml)
[![VitePress](https://img.shields.io/badge/VitePress-2.0.0--alpha.15-blue)](https://vitepress.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.5-green)](https://vuejs.org/)
[![License](https://img.shields.io/badge/License-GPL--3.0-red)](LICENSE)

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
- **包管理**: pnpm
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

## 📚 文章分类

### 🎯 面试题系列

#### 前端面试题

- [首屏优化](https://bd-dxg.github.io/InterviewQ/Frontend/FirstScreenOptimization) - 前端性能优化核心方案
- [系统稳定性保障方案](https://bd-dxg.github.io/InterviewQ/Frontend/SystemStability) - 构建可靠的前端系统
- [页面关闭统计数据](https://bd-dxg.github.io/InterviewQ/Frontend/PageCloseAnalytics) - Navigator.sendBeacon() API 最佳实践
- [Vite 打包结构控制](https://bd-dxg.github.io/InterviewQ/Frontend/ViteChunkControl) - Vite 8 + Rolldown 产物配置指南

#### 后端面试题

- [32 位机器上的 int64 类型](https://bd-dxg.github.io/InterviewQ/Backend/GoInt64On32Bit) - Go 语言中的类型陷阱
- [Go map 创建与性能优化](https://bd-dxg.github.io/InterviewQ/Backend/GoMapMake) - 深入理解 Go 的 make 机制

#### 代码之道

- [GitFlow 五大分支概述](https://bd-dxg.github.io/InterviewQ/TheWayofCode/GitFlow/GitflowOverview) - 详解 GitFlow 工作流的核心分支
- [Git 进阶技巧](https://bd-dxg.github.io/InterviewQ/TheWayofCode/GitFlow/GitProTips) - 版本回退、撤销、重置的四种场景
- [Git 克隆优化指南](https://bd-dxg.github.io/InterviewQ/TheWayofCode/GitFlow/GitClone) - 部分克隆技术实现快速克隆

### 💡 程序员成长

**热门文章**:

- [如何成为越干越值钱的程序员](https://bd-dxg.github.io/Lives/EvolvingDev) - AI 协作与职场成长心法
- [做通用服务的一些感悟](https://bd-dxg.github.io/Lives/CommonServiceInsights) - 通用服务开发的核心理念
- [从"学不进去"到"主动突破"](https://bd-dxg.github.io/Lives/FromStuckToBreakthrough) - 突破瓶颈的方法
- [程序员从幼稚走向成熟的标志](https://bd-dxg.github.io/Lives/SuccessfulMarketing) - 职场进阶指南
- [怎么知道我的能力处于什么水平](https://bd-dxg.github.io/Lives/AssessAndImprove) - 程序员职业发展阶段划分
- [适应第一份开发工作](https://bd-dxg.github.io/Lives/FirstDevJob) - 从学生到职场新人的转变指南
- [如何成为一名合格的中级开发](https://bd-dxg.github.io/Lives/QualifiedMidDev) - 中级开发工程师成长路径
- [如何成为一名合格的高级开发](https://bd-dxg.github.io/Lives/QualifiedSeniorDev) - 高级开发工程师能力要求
- [程序员应该怎么写博客](https://bd-dxg.github.io/Lives/BloggingForProgrammers) - 程序员写作的四个阶段
- [规避笔记陷阱](https://bd-dxg.github.io/Lives/AvoidNoteTrap) - 做有效笔记的三大陷阱
- [程序员提高效率的 10 个方法](https://bd-dxg.github.io/Lives/ProgrammingEfficiency) - 基于脑科学的工作效率提升
- [程序员的谎谬之言还是至理名言](https://bd-dxg.github.io/Lives/ProgrammerMyths) - 反思"需要时再学"的学习态度
- [如果回到过去，我会这样告诫我自己](https://bd-dxg.github.io/Lives/AdviceToMyPastSelf) - 一位程序员的职业反思
- [建议的身份法则](https://bd-dxg.github.io/Lives/IdentityMatters) - 职场沟通的身份法则
- [如何超过大多数人](https://bd-dxg.github.io/Lives/OutperformOthers) - 信息获取与认知格局提升
- [如果善于提问，你会厉害很多](https://bd-dxg.github.io/Lives/PowerOfAsking) - 高效提问的十个技巧
- [一个人过很好的 10 条建议](https://bd-dxg.github.io/Lives/LivingWellAlone) - 独处生活的智慧

更多感悟文章请访问：[程序员成长专栏](https://bd-dxg.github.io/Lives/)

### 🛠️ 实用工具配置

**ESLint 配置系列**:

- [JS ESLint 配置指南](https://bd-dxg.github.io/Tips/EslintJs) - ESLint v9 扁平化配置详解
- [TS ESLint 配置指南](https://bd-dxg.github.io/Tips/EslintTs) - TypeScript 项目完整配置
- [Vue3 + TypeScript + ESLint 配置](https://bd-dxg.github.io/Tips/EslintVue3Ts) - 现代前端项目规范
- [Eslint + Prettier 配置方案](https://bd-dxg.github.io/Tips/EslintPrettierConfig) - 代码规范自动化

**开发工具**:

- [AI 工具配置](https://bd-dxg.github.io/Tips/AIToolsConfig) - AI 辅助开发工具集
- [常用插件](https://bd-dxg.github.io/Tips/MyCodePlugin) - VSCode 常用插件推荐
- [常用软件](https://bd-dxg.github.io/Tips/RecSoftware) - Windows 开发效率软件推荐
- [自动导入组件跳转修复](https://bd-dxg.github.io/Tips/AutoImportJumpFix) - 解决 unplugin-vue-components 跳转问题
- [GlazeWM 窗口管理器](https://bd-dxg.github.io/Tips/GlazeWMIntro) - Windows 平铺式窗口管理
- [职场高频英语缩写](https://bd-dxg.github.io/Tips/WorkplaceAbbreviations) - 职场和开发中常见术语

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

1. 安装依赖（使用 pnpm）
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

[GPL-3.0](LICENSE) © bd-dxg

## 🙏 致谢

- [VitePress](https://vitepress.dev/) - 优秀的静态站点生成器
- [Gitalk](https://github.com/gitalk/gitalk) - 基于 GitHub Issues 的评论组件
- [Rough Notation](https://roughnotation.com/) - 手绘风格标注库
