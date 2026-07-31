---
title: '为什么已经有 VitePress 了，还需要 undocs？'
description: '探讨 VitePress 与 undocs 的设计理念差异，理解为何已有成熟方案仍会出现新项目。'
---

# 为什么已经有 VitePress 了，还需要 undocs？ {#why-undocs}

![](/imgs/1783565252.avif)

最近在逛 GitHub 的时候，偶然看到了一条 anfu 关于 `unjs/undocs` 合并 PR 的动态。

他维护了包括 UnoCSS、VueUse 等一系列优秀的开源项目。

出于好奇，我点进了 `unjs/undocs` 仓库。

第一眼看到介绍时，我产生了一个疑问：

> 等等，这不就是文档站生成工具吗？

我的第一反应是：

不是已经有 VitePress 了吗？

为什么还要重新做一个类似的项目？

## VitePress 已经很好用了 {#vitepress-is-good}

如果你做过前端项目，大概率接触过 VitePress。

它解决的问题非常明确：

> 写 Markdown，然后生成一个漂亮的文档网站。

比如：

```
docs/
├── index.md
├── guide/
│   ├── install.md
│   └── config.md
└── api/
    └── options.md
```

你只需要写：

```md
## 安装

npm install xxx
```

剩下的：

- 页面生成
- 主题
- 搜索
- Vue 组件支持

都交给 VitePress。

它非常适合：

- 产品文档
- 技术教程
- 框架文档
- 项目说明

比如 Vue、Vite 这些项目的文档，都属于这种模式。

所以看到 undocs 的时候，我自然会想：

> 既然 VitePress 已经这么成熟了，为什么还要造一个类似的轮子？

## 后来发现，两者解决的其实不是同一个问题 {#different-problems}

继续了解之后，我发现自己一开始的理解有偏差。

VitePress 和 undocs 虽然最终产物都是：

> 一个文档网站

但是出发点完全不同。

简单来说：

**VitePress 是「人写文档」。**

而：

**undocs 更偏向「代码生成文档」。**

## VitePress：Markdown First {#vitepress-markdown-first}

![](/imgs/1783565251.avif)
VitePress 的核心对象是 Markdown。

流程大概是：

![](/imgs/1783565255.avif)

比如：

```md
# useFetch

useFetch 用于请求数据。

## 参数

url:
请求地址

options:
配置参数
```

这里的内容完全依赖开发者维护。

优点：

- 灵活
- 自由度高
- 可以写任何内容

缺点：

如果项目 API 很多，维护成本会越来越高。

## undocs：Code First {#undocs-code-first}

![](/imgs/1783565253.avif)
而 undocs 面向的是另一类场景。

比如一个 TypeScript 库：

```
my-utils

src/
├── index.ts
├── format.ts
└── parse.ts
```

里面有：

```ts
export function formatDate(date: Date, options?: FormatOptions): string
```

理论上，文档需要展示：

```
formatDate

参数：

date:
Date

options:
FormatOptions

返回：

string
```

这些内容其实代码本身已经包含了。

为什么还要人工再写一遍？

这就是 undocs 想解决的问题。

它希望：

![](/imgs/1783565256.avif)

## 为什么 UnJS 需要这样的工具？ {#why-unjs-needs-it}

这里就和 UnJS 自己的生态有关。

UnJS 里面有大量的小型工具库：

例如：

- h3
- defu
- ufo
- pathe
- consola

这些库有一个共同特点：

代码量可能不大，但是 API 很多。

如果每个项目都手动维护：

```
README.md

api.md

types.md
```

时间久了非常麻烦。

尤其 TypeScript 项目：

类型定义本身就是最准确的文档来源。

所以自动生成 API 文档会更加合理。

## 为什么不直接给 VitePress 加这些功能？ {#why-not-extend-vitepress}

这是我最开始另一个疑问。

既然 VitePress 已经存在，为什么不扩展它？

答案其实很简单：

因为两个项目的设计理念不同。

VitePress -> Markdown First

它认为：**文档内容由人决定**

undocs -> Code First

它认为：**API 文档应该尽可能从代码中产生**

如果把：

- TypeScript AST 解析
- API 自动提取
- 类型展示
- 导出分析

全部加入 VitePress，最终可能会让 VitePress 变成一个非常复杂的工具。

有时候不是功能越多越好，而是定位越清晰越好。

## 开源世界为什么总有"重复造轮子"？ {#why-reinvent-wheel}

![](/imgs/1783565254.avif)
其实类似的问题非常多。

比如：

Express 已经存在，为什么还有 Fastify？

Webpack 已经存在，为什么还有 Vite？

React 已经存在，为什么还有 Vue？

看起来都是重复。

但是深入之后会发现：

它们解决的问题虽然相似，但是设计目标不同。

| 工具    | 定位             | 设计理念                                |
| ------- | ---------------- | --------------------------------------- |
| Express | Node.js Web 框架 | 追求简单、稳定和丰富的生态              |
| Fastify | Node.js Web 框架 | 追求高性能、Schema 驱动和优秀的类型体验 |
| Webpack | 前端构建工具     | 解决大型项目复杂的模块打包问题          |
| Vite    | 前端构建工具     | 通过现代 ESM 提升开发体验和启动速度     |

## 最后的理解 {#final-thoughts}

这次了解 undocs 最大的收获其实不是认识了一个新工具。

而是重新理解了一个问题：

> 为什么已经有一个成熟方案，还会出现新的项目？

答案通常不是：

“旧项目不好。”

更多时候是：

“新的场景出现了。”

VitePress 和 undocs 就像：

一个负责写书。

一个负责根据代码生成 API 手册。

它们最终都输出文档，但服务的人群不同。

所以开源世界里很多看似重复的项目，本质上都是不同设计理念下的选择。

看到一个新项目时，也许不应该第一时间问：

> 为什么不直接用 XXX？

而应该问：

> 它想解决的问题，和 XXX 是不是同一个问题？
